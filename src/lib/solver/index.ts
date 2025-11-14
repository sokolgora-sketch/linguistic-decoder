
import { VOWELS, Vowel, VOWEL_LEVEL, VOWEL_RING, VOWEL_VALUE } from "./valueTables";
import type { Analysis, Path, SolveMode } from "./types";

export type { Analysis, Path, SolveMode, Checksum, Vowel } from "./types";

export type SolveOptions = {
  beamWidth?: number;
  maxOps?: number;
  allowDelete?: boolean;
  allowClosure?: boolean;
  opCost?: { sub: number; del: number; ins: number };
};

const DEFAULTS = {
  engineVersion: "2025-11-14-core-2",
  beamWidth: 8,
  frontierDeltaE: 2
};

// --- Base Extraction & Keep Count ---
function isVowelChar(ch:string){ const c=ch.normalize("NFC"); return /[aeiouy]/i.test(c)||c==="ë"||c==="Ë"; }
function toVowel(ch:string):Vowel|null{ const u=ch.toUpperCase(); return u==="Ë" ? "Ë" : (["A","E","I","O","U","Y"].includes(u)?(u as Vowel):null); }
function extractBase(word:string):Vowel[]{ const out:Vowel[]=[]; for(const ch of word.normalize("NFC")){ if(!isVowelChar(ch))continue; const v=toVowel(ch)!; if(out.length && out[out.length-1]===v)continue; out.push(v);} return out; }
function keptCount(base:Vowel[], cand:Vowel[]){ let k=0; for(let i=0;i<Math.min(base.length,cand.length);i++) if(base[i]===cand[i]) k++; return k; }

function nounishScore(word: string): number {
  const w = word.toLowerCase();
  if (/(age|ment|tion|sion|ance|ence)\b/.test(w)) return 2;
  if (/(ness|ship|hood|dom|ure|um|us)\b/.test(w)) return 1;
  if (/(ge|ce)\b/.test(w)) return 1;
  return 0;
}

// --- Path Scoring ---
const checksumV = (p: Vowel[]) => p.reduce((acc,v)=> acc*VOWEL_VALUE[v], 1);
const ringPenalty = (p:Vowel[]) => { let d=0; for(let i=0;i<p.length-1;i++) d+=Math.abs(VOWEL_RING[p[i]]-VOWEL_RING[p[i+1]]); return d;};
function preferClosureTie(a: Vowel[], b: Vowel[]): number {
  const enda = a[a.length - 1] === "Ë" ? 0 : 1;
  const endb = b[b.length - 1] === "Ë" ? 0 : 1;
  return enda - endb;
}

function scoreTuple(base: Vowel[], p: Path): [number, number, number, number] {
  return [
    p.checksums.find(c => c.type === "E")!.value,
    ringPenalty(p.voicePath),
    -p.kept,
    checksumV(p.voicePath),
  ];
}


// --- Path Generation & State ---
type State = { seq: Vowel[]; E: number; ops: string[] };

function opCostFromLabel(op: string, costs: { sub: number; del: number; ins: number; }){ 
  if(op.startsWith("delete")) return costs.del; 
  if(op.startsWith("closure")) return costs.ins;
  return costs.sub;
}

function mkPath(base: Vowel[], seq: Vowel[], E: number, ops: string[], opCosts: { sub: number; del: number; ins: number; }): Path {
    const p: Path = {
        voicePath: seq,
        ringPath: seq.map(v=>VOWEL_RING[v]),
        levelPath: seq.map(v=>VOWEL_LEVEL[v]),
        checksums: [{type:"V",value:checksumV(seq)}, {type:"E",value:E}, {type:"C",value:0}],
        kept: keptCount(base, seq),
        ops,
    };
    // Note: E includes gravity and penalties, so it won't perfectly match op costs.
    // This is an area for future refinement if exact cost tracking is needed.
    // const Ecalc = ops.reduce((s,op)=>s+opCostFromLabel(op, opCosts),0);
    // if (Ecalc !== E) throw new Error(`Energy mismatch E=${E} sum(ops)=${Ecalc} ops=${ops.join(',')}`);

    if (p.kept > Math.min(base.length, seq.length)) {
        throw new Error(`Keeps overflow: kept=${p.kept} base=${base.length} seq=${seq.length}`);
    }
    if (ops.some(o=>o.startsWith("insert ") && o!=="closure Ë")) throw new Error("Illegal insert op");
    return p;
}


function neighbors(base: Vowel[], st: State, opts: SolveOptions): State[] {
  const out: State[] = [];
  const seq = st.seq;
  const { allowDelete = true, allowClosure = true, opCost = { sub:1, del:3, ins:2 } } = opts;

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
function solveWord(word: string, opts: SolveOptions): Omit<Analysis, "word" | "mode"> {
  const base = extractBase(word);
  const baseSeq = base.length ? base : (["O"] as Vowel[]);

  const K = opts.beamWidth ?? DEFAULTS.beamWidth;
  const maxOps = opts.maxOps ?? 1;

  let paths: Path[] = [];
  const q: State[] = [{ seq: baseSeq, E: 0, ops: [] }];
  const visited = new Set<string>([baseSeq.join("")]);

  while (q.length > 0) {
    const st = q.shift()!;
    if (st.ops.length > maxOps) continue;
    
    // Add current state to solutions
    const p = mkPath(baseSeq, st.seq, st.E, st.ops, opts.opCost!);
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
    const A = scoreTuple(baseSeq, p), B = scoreTuple(baseSeq, q);
    if (A[0] !== B[0]) return A[0] - B[0];
    if (A[1] !== B[1]) return A[1] - B[1];
    if (A[2] !== B[2]) return A[2] - B[2];
    const c = preferClosureTie(p.voicePath, q.voicePath);
    if (c !== 0) return c;
    return A[3] - B[3];
  });

  const primary = uniqPaths[0];
  const pKey = primary.voicePath.join("");

  const frontier = uniqPaths
    .slice(1, K)
    .filter(p => p.checksums.find(c => c.type === "E")!.value <= primary.checksums.find(c => c.type === "E")!.value + DEFAULTS.frontierDeltaE);

  return {
    engineVersion: DEFAULTS.engineVersion,
    primaryPath: primary,
    frontierPaths: frontier,
    signals: ["beam search; op costs; Ë-closure tiebreak"],
  };
}


export function solveMatrix(word: string, options: SolveOptions): Analysis {
  const mode = (options.maxOps ?? 2) > 1 ? "open" : "strict";
  const analysis = solveWord(word, options);

  return {
    ...analysis,
    word,
    mode,
  };
}
