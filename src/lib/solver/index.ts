
import { VOWELS, Vowel, VOWEL_LEVEL, VOWEL_RING, VOWEL_VALUE, CClass, MAP_CLASS } from "./valueTables";
import type { Analysis, Path, SolveMode } from "./types";
import { CFG, ENGINE_VERSION } from "./engineConfig";

export type { Analysis, Path, SolveMode, Checksum, Vowel } from "./types";

export type SolveOptions = {
  beamWidth: number;
  maxOps: number;
  allowDelete: boolean;
  allowClosure: boolean;
  opCost: { sub: number; del: number; ins: number; };
};

// --- Base Extraction & Keep Count ---
function isVowelChar(ch:string){ const c=ch.normalize("NFC"); return /[aeiouy]/i.test(c)||c==="ë"||c==="Ë"; }
function toVowel(ch:string):Vowel|null{ const u=ch.toUpperCase(); return u==="Ë" ? "Ë" : (["A","E","I","O","U","Y"].includes(u)?(u as Vowel):null); }
function extractBase(word:string):Vowel[]{ 
    const out:Vowel[]=[]; 
    for(const ch of word.normalize("NFC")){ 
        if(!isVowelChar(ch))continue; 
        const v=toVowel(ch)!; 
        if(CFG.norm.collapseDupes && out.length && out[out.length-1]===v) continue; 
        out.push(v);
    } 
    return out; 
}
function keptCount(base:Vowel[], cand:Vowel[]){ let k=0; for(let i=0;i<Math.min(base.length,cand.length);i++) if(base[i]===cand[i]) k++; return k; }

function normalizeTerminalY(seq: Vowel[], rawWord: string): Vowel[] {
  // Rule N0: English terminal “y” behaves like /i/
  // e.g., study, happy, duty → final Y becomes I
  if (CFG.norm.terminalYtoI && seq.length && seq[seq.length - 1] === "Y" && rawWord.toLowerCase().endsWith("y")) {
    const out = seq.slice();
    out[out.length - 1] = "I";
    return out;
  }
  return seq;
}


// --- Path Scoring ---
const checksumV = (p: Vowel[]) => p.reduce((acc,v)=> acc*VOWEL_VALUE[v], 1);
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

function scoreTuple(base: Vowel[], p: Path): [number, number, number, number, number] {
  return [
    p.checksums.find(c => c.type === "E")!.value,
    p.checksums.find(c => c.type === "C")!.value,
    ringPenalty(p.vowelPath),
    -p.kept,
    checksumV(p.vowelPath),
  ];
}


// --- Path Generation & State ---
type State = { seq: Vowel[]; E: number; ops: string[] };

function opCostFromLabel(op: string, costs: { sub: number; del: number; ins: number; }){ 
  if(op.startsWith("delete")) return costs.del; 
  if(op.startsWith("closure")) return costs.ins;
  return costs.sub;
}

function mkPath(base: Vowel[], seq: Vowel[], E: number, ops: string[], computeC: (path: Vowel[]) => number): Path {
    const p: Path = {
        vowelPath: seq,
        ringPath: seq.map(v=>VOWEL_RING[v]),
        levelPath: seq.map(v=>VOWEL_LEVEL[v]),
        checksums: [{type:"V",value:checksumV(seq)}, {type:"E",value:E}, {type:"C",value:computeC(seq)}],
        kept: keptCount(base, seq),
        ops,
    };
    
    // Note: E includes penalties, so it won't perfectly match op costs.
    // const Ecalc = ops.reduce((s,op)=>s+opCostFromLabel(op, {sub: CFG.cost.sub, del: CFG.cost.del, ins: CFG.cost.insClosure}),0);
    // if (Ecalc !== E) { console.warn(`Energy mismatch E=${E} sum(ops)=${Ecalc} ops=${ops.join(',')}`); }

    if (p.kept > Math.min(base.length, seq.length)) {
        throw new Error(`Keeps overflow: kept=${p.kept} base=${base.length} seq=${seq.length}`);
    }
    if (ops.some(o=>o.startsWith("insert ") && o!=="closure Ë")) throw new Error("Illegal insert op");
    return p;
}


function neighbors(base: Vowel[], st: State, opts: SolveOptions): State[] {
  const out: State[] = [];
  const seq = st.seq;
  const { allowDelete = true, allowClosure = true, opCost = { sub:CFG.cost.sub, del:CFG.cost.del, ins:CFG.cost.insClosure } } = opts;

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

function classRange(cls: CClass): [number, number] {
  switch (cls) {
    case "Glide":
    case "Liquid":
    case "Nasal":     return [0,1];
    case "Fricative": return [1,1];
    case "Affricate": return [1,2];
    case "Plosive":   return [2,3];
  }
}

function hopPenalty(absDelta: number, cls: CClass): number {
  const [lo, hi] = classRange(cls);
  if (absDelta < lo) return lo - absDelta;
  if (absDelta > hi) return absDelta - hi;
  return 0;
}

function extractWindowsClasses(word: string, baseSeq: Vowel[]): CClass[] {
  const s = word.normalize("NFC");
  const pos: number[] = [];
  let vi = 0;

  // Find the word-indices of the base vowels.
  // This is tricky because of dupe collapse, e.g. "aa" -> A.
  // This simple model just finds the first match.
  let lastWordI = -1;
  for (let i=0; i<baseSeq.length; i++) {
    const targetV = baseSeq[i];
    let found = false;
    for (let j=lastWordI+1; j<s.length; j++) {
      const wordV = toVowel(s[j]);
      if (wordV === targetV) {
        pos.push(j);
        lastWordI = j;
        found = true;
        break;
      }
    }
    if (!found) pos.push(lastWordI + 1); // fallback
  }

  const windows: string[] = [];
  for (let k=0;k<pos.length-1;k++){
    windows.push(s.slice(pos[k]+1, pos[k+1]));
  }

  return windows.map(chars => {
    for (const ch of chars.toLowerCase()) {
      if (isVowelChar(ch)) continue;
      if (MAP_CLASS[ch]) return MAP_CLASS[ch];
    }
    return "Fricative"; // neutral default
  });
}

// --- Main Solver ---
function solveWord(word: string, opts: SolveOptions): Omit<Analysis, "word" | "mode"> {
  const rawBase = extractBase(word);
  const base = normalizeTerminalY(rawBase, word);
  const consClasses = extractWindowsClasses(word, base);

  const computeC = (vowelPath: Vowel[]): number => {
    let c = 0;
    for (let i=0;i<Math.min(vowelPath.length-1, consClasses.length); i++){
      const d = Math.abs(VOWEL_RING[vowelPath[i+1]] - VOWEL_RING[vowelPath[i]]);
      c += hopPenalty(d, consClasses[i]);
    }
    // extra hop (e.g., closure) → assume Glide expectation
    for (let j=consClasses.length; j<vowelPath.length-1; j++){
      const d = Math.abs(VOWEL_RING[vowelPath[j+1]] - VOWEL_RING[vowelPath[j]]);
      c += hopPenalty(d, "Glide");
    }
    return c;
  }

  const baseSeq = base.length ? base : (["O"] as Vowel[]);

  const K = opts.beamWidth;
  const maxOps = opts.maxOps;

  let paths: Path[] = [];
  const q: State[] = [{ seq: baseSeq, E: 0, ops: [] }];
  const visited = new Set<string>([baseSeq.join("")]);

  while (q.length > 0) {
    const st = q.shift()!;
    if (st.ops.length > maxOps) continue;
    
    // Add current state to solutions
    const p = mkPath(baseSeq, st.seq, st.E, st.ops, computeC);
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
  const uniqPaths = Array.from(new Map(paths.map(p => [p.vowelPath.join(""), p])).values());

  uniqPaths.sort((p, q) => {
    const A = scoreTuple(baseSeq, p), B = scoreTuple(baseSeq, q);
    for(let i=0; i<A.length; i++) if (A[i] !== B[i]) return A[i] - B[i];

    const c = preferClosureTie(p.vowelPath, q.vowelPath);
    if (c !== 0) return c;
    
    return A[A.length-1] - B[B.length-1];
  });

  const primary = uniqPaths[0];

  const frontier = uniqPaths
    .slice(1, K)
    .filter(p => p.checksums.find(c => c.type === "E")!.value <= primary.checksums.find(c => c.type === "E")!.value + CFG.frontierDeltaE);
  
  const signals = [
      `base_raw=${rawBase.join("") || "-"}`,
      `base_norm=${base.join("") || "-"}`,
      `cons_windows=${consClasses.join(",") || "-"}`,
      `signals: deterministic beam; Ë-closure tie-break`
  ];

  return {
    engineVersion: ENGINE_VERSION,
    primaryPath: primary,
    frontierPaths: frontier,
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
  };
}
