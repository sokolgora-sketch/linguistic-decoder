
import { VOWELS, Vowel, VOWEL_LEVEL, VOWEL_RING, VOWEL_VALUE, STABILIZER_S, DIGRAPHS } from "./valueTables";
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
  engineVersion: "2025-11-13-v1.0",
  beamStrict: 12,
  beamOpen: 20,
  frontierDeltaE: { strict: 2, open: 3 }
};

const isVowelChar = (ch:string)=> "aeiouyëAEIOUYË".includes(ch);
const mapToVowel = (ch:string): Vowel|undefined => {
  const c = ch.toLowerCase();
  if (c==="a") return "A"; if (c==="e") return "E"; if (c==="i") return "I";
  if (c==="o") return "O"; if (c==="u") return "U"; if (c==="y") return "Y";
  if (c==="ë" || c==="ë") return "Ë"; return undefined;
};

function nounishScore(word: string): number {
  const w = word.toLowerCase();
  // strong noun/result suffixes → 2, softer → 1
  if (/(age|ment|tion|sion|ance|ence)\b/.test(w)) return 2;
  if (/(ness|ship|hood|dom|ure|um|us)\b/.test(w)) return 1;
  // English silent -e after g/c often marks result nouns (e.g., damage, service)
  if (/(ge|ce)\b/.test(w)) return 1;
  return 0;
}

export function moveCost(a: Vowel, b: Vowel): number {
  const ringStep = Math.abs(VOWEL_RING[a] - VOWEL_RING[b]);
  const ringDisc = (a === "O" || b === "O") ? 1 : 0;
  const ringCost = Math.max(0, ringStep - ringDisc);

  const lvlStep = Math.abs(VOWEL_LEVEL[a] - VOWEL_LEVEL[b]);
  const lvlDisc = (a === "O" || b === "O") ? 1 : 0;
  const levelCost = Math.max(0, lvlStep - lvlDisc);

  return ringCost + levelCost;
}

function gravityBonus(path: Vowel[]): number {
  const lvl = path.map(v => VOWEL_LEVEL[v]);
  let reversals = 0; for (let i=1;i<lvl.length;i++) if (lvl[i] > lvl[i-1]) reversals++;
  const monotone = lvl.every((v,i)=> i===0 || v<=lvl[i-1]);
  return (monotone ? -1 : 0) + reversals; // negative lowers E
}

function buildSlots(word: string){
  const s = word.toLowerCase();
  const consonants: string[] = [];
  const slots: (Vowel|undefined)[] = [undefined];
  for (let i=0; i<s.length;){
    const two = s.slice(i,i+2);
    if (!isVowelChar(s[i]) && DIGRAPHS.includes(two)) { consonants.push(two); slots.push(undefined); i+=2; continue; }
    if (!isVowelChar(s[i])) { consonants.push(s[i]); slots.push(undefined); i++; continue; }
    // vowel run -> take last of the run
    let j=i, last: Vowel|undefined = undefined;
    while (j<s.length && isVowelChar(s[j])){ last = mapToVowel(s[j]) ?? last; j++; }
    slots[slots.length-1] = last; i=j;
  }
  return { consonants, slots };
}

type State = { row: Vowel|null; cost: number; path: Vowel[]; ops: string[]; cStab: number; kept: number; deleted: number; };
type OpKind = "keep" | "sub" | "ins" | "del";

function opCost(observed: Vowel|undefined, chosen: Vowel|"Ø", opts: SolveOptions): {cost:number, op?:string, kind: OpKind}{
  const { opCost: costs = { sub:1, del:3, ins:2 } } = opts;
  if (!observed){
    if (chosen === "Ø") return { cost: 0, kind: "keep" };  // nothing to keep
    return { cost: costs.ins, op: `insert ${chosen}`, kind: "ins" };
  } else {
    if (chosen === "Ø") {
        if (!opts.allowDelete) return { cost: 999, kind: "del" };
        return { cost: costs.del, op: `delete ${observed}`, kind: "del" };
    }
    if (chosen === observed) return { cost: 0, kind: "keep" };
    return { cost: costs.sub, op: `${observed}→${chosen}`, kind: "sub" };
  }
}

function stabilizerAcross(cons: string[], idx: number, prev: Vowel|null, curr: Vowel|"Ø"): number {
  if (idx<0 || curr==="Ø" || !prev) return 0;
  if (prev === curr) return 0;
  return STABILIZER_S[cons[idx]] ?? 0;
}

function dedupeKeepK(states: State[], K:number){
  const seen = new Set<string>(), out: State[] = [];
  for (const s of states){
    const key = `${s.cost}|${s.path.join("")}`;
    if (seen.has(key)) continue; seen.add(key); out.push(s);
    if (out.length>=K) break;
  }
  return out;
}

const rankClosure = (c:Vowel)=> c==="Ë"?0: c==="A"?1:2;

function uniqByPath<T extends { path: Vowel[] }>(arr: T[]): T[] {
  const seen = new Set<string>(); const out: T[] = [];
  for (const x of arr) { const k = x.path.join(""); if (seen.has(k)) continue; seen.add(k); out.push(x); }
  return out;
}

function hasInstrument(path: Vowel[]) {
  // E or I anywhere before the final closure
  const inner = path.slice(0, -1);
  return inner.some(v => v === "E" || v === "I");
}
function observedHasInstrument(slots: (Vowel|undefined)[]) {
  return slots.some(v => v === "E" || v === "I");
}

function preferClosureTie(a: Vowel[], b: Vowel[]): number {
  const enda = a[a.length - 1] === "Ë" ? 0 : 1;
  const endb = b[b.length - 1] === "Ë" ? 0 : 1;
  return enda - endb;
}


export function solveMatrix(word: string, mode: SolveMode): Analysis {
  const options: SolveOptions = mode === 'strict'
  ? { beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false, opCost: { sub: 1, del: 3, ins: 2 } }
  : { beamWidth: 8, maxOps: 2, allowDelete: true,  allowClosure: true,  opCost: { sub: 1, del: 3, ins: 2 } };

  const { consonants, slots } = buildSlots(word);
  const beam = (mode==="strict" ? DEFAULTS.beamStrict : DEFAULTS.beamOpen) * (options.beamWidth ?? 1);

  let col: State[] = [{ row:null, cost:0, path:[], ops:[], cStab:0, kept: 0, deleted: 0 }];

  for (let j=0; j<slots.length; j++){
    const observed = slots[j];
    const candidates: (Vowel|"Ø")[] = ["Ø", ...VOWELS];
    let next: State[] = [];
    for (const st of col){
      if (st.ops.length > (options.maxOps ?? 2)) continue;

      for (const cand of candidates){
        const { cost: oc, op, kind } = opCost(observed, cand, options);
        if (oc > 900) continue; // prune illegal op

        let tCost = 0, newRow = st.row, newPath = st.path.slice();
        if (cand !== "Ø"){
          if (st.row){ tCost = moveCost(st.row, cand as Vowel); }
          newRow = cand as Vowel;
          if (newPath[newPath.length-1] !== newRow) newPath.push(newRow);
        }
        const stab = stabilizerAcross(consonants, j-1, st.row, cand);
        const newOps = op ? [...st.ops, op] : st.ops;

        if (newOps.length > (options.maxOps ?? 2)) continue;
        
        next.push({ 
            row:newRow, 
            cost: st.cost + oc + tCost + stab, 
            path:newPath, 
            ops: newOps,
            cStab: st.cStab + stab,
            kept: st.kept + (kind === "keep" ? 1 : 0),
            deleted: st.deleted + (kind === "del" ? 1 : 0)
        });
      }
    }
    next.sort((a,b)=> (a.cost-b.cost) || a.path.join("").localeCompare(b.path.join("")));
    col = dedupeKeepK(next, beam);
  }

  const obsHasInstr = observedHasInstrument(slots);
  const nounish = nounishScore(word);
  type Sol = { path: Vowel[]; E:number; ops:string[]; cStab:number; closure: Vowel; kept: number; hasInstr:boolean; };
  const sols: Sol[] = [];

  for (const st of col){
    if (!st.row) continue;
    const closures = options.allowClosure ? ["Ë"] : [];

    for (const closure of closures){
      const t = moveCost(st.row, closure);
      const path = st.path[st.path.length-1]===closure ? st.path.slice() : [...st.path, closure];
      const base = st.cost + t;
      const g = gravityBonus(path);
      const instr = hasInstrument(path);
      const instrPenalty = instr ? 0 : (obsHasInstr ? 2 : 1);
      const closureBias = closure === "Ë" ? -nounish : (nounish ? +nounish : 0);
      const opCostTotal = st.ops.reduce((s, op) => s + (op.startsWith("delete") ? 3 : op.startsWith("closure") ? 2 : 1), 0);
      const finalOps = [...st.ops, `closure ${closure}`];

      if (finalOps.length > (options.maxOps ?? 2) + 1) continue;

      const E = opCostTotal + t + g + instrPenalty + closureBias;

      sols.push({ path, E, ops:finalOps, cStab: st.cStab, closure, kept: st.kept, hasInstr: instr });
    }
    // Handle no-closure case (for strict mode primarily)
    if (!options.allowClosure) {
        const path = st.path;
        const g = gravityBonus(path);
        const instr = hasInstrument(path);
        const instrPenalty = instr ? 0 : (obsHasInstr ? 2 : 1);
        const opCostTotal = st.ops.reduce((s, op) => s + (op.startsWith("delete") ? 3 : op.startsWith("closure") ? 2 : 1), 0);
        const E = opCostTotal + g + instrPenalty;
        sols.push({ path, E, ops: st.ops, cStab: st.cStab, closure: path[path.length - 1], kept: st.kept, hasInstr: instr });
    }
  }

  let solsFiltered = sols.filter(s => s.path.length >= 2);
  if (solsFiltered.length === 0) { 
      solsFiltered = sols; // fallback if truly unavoidable
  }
  
  const checksumV = (p: Vowel[]) => p.reduce((acc,v)=> acc*VOWEL_VALUE[v], 1);
  const ringPenalty = (p:Vowel[]) => { let d=0; for(let i=0;i<p.length-1;i++) d+=Math.abs(VOWEL_RING[p[i]]-VOWEL_RING[p[i+1]]); return d;};
  
  const scoreTuple = (p: {path:Vowel[], E:number, kept: number}): [number,number,number,number] => [
    p.E,
    ringPenalty(p.path),
    -p.kept,
    checksumV(p.path)
  ];

  solsFiltered.sort((a,b) => {
    const A = scoreTuple(a), B = scoreTuple(b);
    if (A[0] !== B[0]) return A[0] - B[0];
    if (A[1] !== B[1]) return A[1] - B[1];
    if (A[2] !== B[2]) return A[2] - B[2];
    const c = preferClosureTie(a.path, b.path);
    if (c !== 0) return c;
    return A[3] - B[3];
  });
  
  if (solsFiltered.length === 0) {
    throw new Error("Solver failed to find a valid path for the given word.");
  }
  
  const primary = solsFiltered[0];
  const pKey = primary.path.join("");
  const delta = mode === "strict" ? DEFAULTS.frontierDeltaE.strict : DEFAULTS.frontierDeltaE.open;

  const frontier = uniqByPath(
    solsFiltered
      .slice(1)
      .filter(s => s.E <= primary.E + delta && s.path.join("") !== pKey)
  );

  const toPath = (sol: {path: Vowel[], E: number, cStab: number, ops: string[], kept: number}): Path => ({
    voicePath: sol.path,
    ringPath: sol.path.map(v => VOWEL_RING[v]),
    levelPath: sol.path.map(v => VOWEL_LEVEL[v]),
    ops: sol.ops,
    checksums: [
        { type: 'V', value: sol.path.reduce((acc,v)=> acc*VOWEL_VALUE[v], 1) },
        { type: 'E', value: sol.E },
        { type: 'C', value: sol.cStab }
    ],
    kept: sol.kept
  });

  return {
    engineVersion: DEFAULTS.engineVersion,
    word,
    mode,
    primaryPath: toPath(primary),
    frontierPaths: frontier.map(f => toPath(f)),
    signals: ["deterministic: beam DP; gravity; closure prefers Ë on tie"]
  };
}
