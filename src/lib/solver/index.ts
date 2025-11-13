
import { VOWELS, Vowel, VOWEL_LEVEL, VOWEL_RING, VOWEL_VALUE, STABILIZER_S, DIGRAPHS } from "./valueTables";
import type { Analysis, Path, SolveMode } from "./types";

export type { Analysis, Path, SolveMode, Checksum, Vowel } from "./types";

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

function opCost(observed: Vowel|undefined, chosen: Vowel|"Ø"): {cost:number, op?:string, kind: OpKind}{
  if (!observed){
    if (chosen === "Ø") return { cost: 0, kind: "keep" };  // nothing to keep
    return { cost: 2, op: `insert ${chosen}`, kind: "ins" };
  } else {
    if (chosen === "Ø") return { cost: 1, op: `delete ${observed}`, kind: "del" };
    if (chosen === observed) return { cost: 0, kind: "keep" };
    return { cost: 1, op: `${observed}→${chosen}`, kind: "sub" };
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

function uniqByPath<T extends { path: string[] }>(arr: T[]): T[] {
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


export function solveMatrix(word: string, mode: SolveMode): Analysis {
  const { consonants, slots } = buildSlots(word);
  console.log("slots", slots);
  const beam = mode==="strict" ? DEFAULTS.beamStrict : DEFAULTS.beamOpen;

  let col: State[] = [{ row:null, cost:0, path:[], ops:[], cStab:0, kept: 0, deleted: 0 }];

  for (let j=0; j<slots.length; j++){
    const observed = slots[j];
    const candidates: (Vowel|"Ø")[] = ["Ø", ...VOWELS];
    const next: State[] = [];
    for (const st of col){
      for (const cand of candidates){
        const { cost: oc, op, kind } = opCost(observed, cand);
        let tCost = 0, newRow = st.row, newPath = st.path.slice();
        if (cand !== "Ø"){
          if (st.row){ tCost = moveCost(st.row, cand as Vowel); }
          newRow = cand as Vowel;
          if (newPath[newPath.length-1] !== newRow) newPath.push(newRow);
        }
        const stab = stabilizerAcross(consonants, j-1, st.row, cand);
        
        next.push({ 
            row:newRow, 
            cost: st.cost + oc + tCost + stab, 
            path:newPath, 
            ops: op?[...st.ops,op]:st.ops, 
            cStab: st.cStab + stab,
            kept: st.kept + (kind === "keep" ? 1 : 0),
            deleted: st.deleted + (kind === "del" ? 1 : 0)
        });
      }
    }
    next.sort((a,b)=> (a.cost-b.cost) || a.path.join("").localeCompare(b.path.join("")));
    col = dedupeKeepK(next, beam);
  }

  type Sol = { path: Vowel[]; E:number; ops:string[]; cStab:number; closure: Vowel; kept: number; };
  const sols: Sol[] = [];
  const obsHasInstrument = observedHasInstrument(slots);

  for (const st of col){
    if (!st.row) continue;
    for (const closure of ["Ë","A"] as Vowel[]){
      const t = moveCost(st.row, closure);
      const path = st.path[st.path.length-1]===closure ? st.path.slice() : [...st.path, closure];
      const base = st.cost + t;

      let penalty = 0;
      if (!hasInstrument(path)) {
        penalty = obsHasInstrument ? 2 : 1;
      }

      const E = base + gravityBonus(path) + penalty;
      sols.push({ path, E, ops:[...st.ops, `closure ${closure}`], cStab: st.cStab, closure, kept: st.kept });
    }
  }

  let solsFiltered = sols.filter(s => s.path.length >= 2);
  if (solsFiltered.length === 0) { 
      solsFiltered = sols; // fallback if truly unavoidable
  }

  solsFiltered.sort((a,b)=> 
    (a.E-b.E) || 
    (b.kept - a.kept) || // more keeps wins
    (rankClosure(a.closure)-rankClosure(b.closure)) || 
    (a.path.length-b.path.length) || 
    a.path.join("").localeCompare(b.path.join(""))
  );
  
  if (solsFiltered.length === 0) {
    throw new Error("Solver failed to find a valid path for the given word.");
  }
  
  const primary = solsFiltered[0];
  const frontier = uniqByPath(solsFiltered.slice(1).filter(s => s.E <= primary.E + (mode==="strict" ? DEFAULTS.frontierDeltaE.strict : DEFAULTS.frontierDeltaE.open)));

  const toPath = (sol: {path: Vowel[], E: number, cStab: number, ops: string[]}): Path => ({
    voicePath: sol.path,
    ringPath: sol.path.map(v => VOWEL_RING[v]),
    levelPath: sol.path.map(v => VOWEL_LEVEL[v]),
    ops: sol.ops,
    checksums: [
        { type: 'V', value: sol.path.reduce((acc,v)=> acc*VOWEL_VALUE[v], 1) },
        { type: 'E', value: sol.E },
        { type: 'C', value: sol.cStab }
    ]
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
