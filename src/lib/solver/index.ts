
import { VOWELS, Vowel, VOWEL_LEVEL, VOWEL_RING, computeC, chooseProfile, LangProfile, extractWindowClassesWithProfile, readWindowsDebug, checksumV, VOWEL_VALUE } from "./valueTables";
import type { Analysis, Path, SolveMode } from "./types";
import { CFG, ENGINE_VERSION, Alphabet } from "./engineConfig";

export type { Analysis, Path, SolveMode, Checksum, Vowel } from "./types";

export type SolveOptions = {
  beamWidth: number;
  maxOps: number;
  allowDelete: boolean;
  allowClosure: boolean;
  opCost: { sub: number; del: number; ins: number; };
  alphabet?: Alphabet;
};

// --- Base Extraction & Keep Count ---
function isVowelChar(ch:string){ const c=ch.normalize("NFC"); return /[aeiouy]/i.test(c)||c==="ë"||c==="Ë"; }
export function toVowel(ch:string):Vowel|null{ const u=ch.toUpperCase(); return u==="Ë" ? "Ë" : (VOWELS.includes(u as any)?(u as Vowel):null); }

export function extractBase(word: string): Vowel[] {
  const out: Vowel[] = [];
  const s = word.normalize("NFC").toLowerCase();
  for (let i = 0; i < s.length; i++) {
    if (!isVowelChar(s[i])) continue;

    // special case for 'ie' -> I
    if (i < s.length - 1 && s[i] === 'i' && s[i+1] === 'e') {
      if (out.length === 0 || out[out.length-1] !== "I") {
        out.push("I");
      }
      i++; // skip 'e'
      continue;
    }

    const v = toVowel(s[i])!;
    if (CFG.norm.collapseDupes && out.length && out[out.length - 1] === v) continue;
    out.push(v);
  }
  return out;
}
function keptCount(base:Vowel[], cand:Vowel[]){ let k=0; for(let i=0;i<Math.min(base.length,cand.length);i++) if(base[i]===cand[i]) k++; return k; }

export function normalizeTerminalY(seq: Vowel[], rawWord: string): Vowel[] {
  if (CFG.norm.terminalYtoI && seq.length && seq[seq.length - 1] === "Y" && rawWord.toLowerCase().endsWith("y")) {
    const out = seq.slice();
    out[out.length - 1] = "I";
    return out;
  }
  return seq;
}


// --- Path Scoring ---
const ringPenalty = (p:Vowel[]) => { 
    if (CFG.ringJumpPenalty === 0) return 0;
    let d=0; for(let i=0;i<p.length-1;i++) d+=Math.abs(VOWEL_RING[p[i]]-VOWEL_RING[p[i+1]]); return d * CFG.ringJumpPenalty;
};
function preferClosureTie(a: Vowel[], b: Vowel[]): number {
  if (!CFG.preferClosureË) return 0;
  const enda = a[a.length - 1] === "Ë" ? 0 : 1;
  const endb = b[b.length - 1] === "Ë" ? 0 : 1;
  return enda - endb;
}

function scoreTuple(p: Path): [number, number, number, number, number] {
  const E = p.checksums.E;
  const V = p.checksums.V;
  const C = p.checksums.C;
  return [
    E,
    ringPenalty(p.voicePath),
    C * CFG.cWeight,
    -p.kept,
    V,
  ];
}


// --- Path Generation & State ---
type State = { seq: Vowel[]; E: number; ops: string[] };

function opCostFromLabel(op: string, costs: { sub: number; del: number; ins: number; }){ 
  if(op.startsWith("delete")) return costs.del; 
  if(op.startsWith("closure")) return costs.ins;
  return costs.sub;
}

function mkPath(baseSeq: Vowel[], consClasses: ReturnType<typeof extractWindowClassesWithProfile>, seq: Vowel[], E: number, ops: string[]): Path {
    const voicePath = seq;
    const p: Path = {
        voicePath,
        ringPath: voicePath.map(v=>VOWEL_RING[v]),
        levelPath: voicePath.map(v=>VOWEL_LEVEL[v]),
        checksums: {V:checksumV(voicePath), E:E, C:computeC(voicePath, consClasses)},
        kept: keptCount(baseSeq, voicePath),
        ops,
    };

    if (p.kept > Math.min(baseSeq.length, seq.length)) {
        throw new Error(`Keeps overflow: kept=${p.kept} base=${baseSeq.length} seq=${seq.length}`);
    }
    if (ops.some(o=>o.startsWith("insert ") && o!=="closure Ë")) throw new Error("Illegal insert op");
    return p;
}


function neighbors(base: Vowel[], st: State, opts: SolveOptions): State[] {
  const out: State[] = [];
  const seq = st.seq;
  const { allowDelete, allowClosure, opCost } = opts;

  // substitute
  for (let i=0;i<seq.length;i++){
    for (const v of VOWELS) if (v !== seq[i]) {
      const next = seq.slice(); next[i] = v;
      out.push({ seq: next, E: st.E + opCost.sub, ops: [...st.ops, `${seq[i]}→${v}`] });
    }
  }

  // delete (optional)
  if (allowDelete) {
    for (let i=0;i<seq.length;i++){
      const next = seq.slice(0,i).concat(seq.slice(i+1));
      if (!next.length) continue;
      out.push({ seq: next, E: st.E + opCost.del, ops: [...st.ops, `delete ${seq[i]}`] });
    }
  }

  // insert closure Ë (optional) — THE ONLY INSERT ALLOWED
  if (allowClosure && seq[seq.length-1] !== "Ë") {
    const next = seq.concat("Ë");
    out.push({ seq: next, E: st.E + opCost.ins, ops: [...st.ops, "closure Ë"] });
  }

  return out;
}


// --- Main Solver ---
function solveWord(word: string, opts: SolveOptions): Omit<Analysis, "word" | "mode" | "alphabet" | "solveMs" | "ts"> {
  const rawBase = extractBase(word);
  const base = normalizeTerminalY(rawBase, word);
  const baseSeq = base.length ? base : (["O"] as Vowel[]);
  const profile = chooseProfile(word, opts.alphabet === "auto" ? undefined : opts.alphabet);
  const { windows, classes: consClasses } = readWindowsDebug(word, baseSeq, profile);
  
  const K = opts.beamWidth;
  const maxOps = opts.maxOps;

  let paths: Path[] = [];
  const q: State[] = [{ seq: baseSeq, E: 0, ops: [] }];
  const visited = new Set<string>([baseSeq.join("")]);

  while (q.length > 0) {
    const st = q.shift()!;
    if (st.ops.length > maxOps) continue;
    
    // Add current state to solutions
    const p = mkPath(baseSeq, consClasses, st.seq, st.E, st.ops);
    paths.push(p);

    // Get next states
    const nextStates = neighbors(baseSeq, st, opts);
    for (const n of nextStates) {
      const key = n.seq.join("");
      if (visited.has(key)) continue;
      visited.add(key);
      q.push(n);
    }
  }

  // De-duplicate and sort paths
  const uniqPaths = Array.from(new Map(paths.map(p => [p.voicePath.join(""), p])).values());

  uniqPaths.sort((p, q) => {
    const A = scoreTuple(p), B = scoreTuple(q);
    for(let i=0; i<A.length; i++) if (A[i] !== B[i]) return A[i] - B[i];

    return preferClosureTie(p.voicePath, q.voicePath);
  });

  const primary = uniqPaths[0];

  const frontier = uniqPaths
    .slice(1, K)
    .filter(p => p.checksums.E <= primary.checksums.E + 2);
  
  const signals = [
      `base_raw=${rawBase.join("") || "-"}`,
      `base_norm=${base.join("") || "-"}`,
      `cons_windows=${consClasses.join(",") || "-"}`,
  ];

  return {
    engineVersion: ENGINE_VERSION,
    primaryPath: primary,
    frontierPaths: frontier,
    windows,
    windowClasses: consClasses,
    signals,
  };
}


export function solveMatrix(word: string, options: SolveOptions): Analysis {
  const mode = options.maxOps > 1 ? "open" : "strict";
  const analysis = solveWord(word, options);

  return {
    ...analysis,
    word,
    mode,
    alphabet: (options.alphabet || CFG.alphabet) as Alphabet,
    solveMs: 0, // This will be filled by the API route
    ts: 0,      // This will be filled by the API route
  };
}

export function baseForTests(word: string): Vowel[] {
  const raw = extractBase(word);
  const norm = normalizeTerminalY(raw, word);
  return (norm.length ? norm : (["O"] as Vowel[])) as Vowel[];
}
