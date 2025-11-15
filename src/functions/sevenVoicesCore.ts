// @ts-nocheck

import { getManifest, EngineManifest } from "@/engine/manifest";
import { computeC, extractBase, normalizeTerminalY, readWindowsDebug, edgeBiasPenalty, type EdgeInfo } from "./sevenVoicesC";
import { chooseProfile, CClass } from "./languages";

export const VOWELS = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
export type Vowel = (typeof VOWELS)[number];

export const VOWEL_VALUE: Record<Vowel, number> = { A: 2, E: 3, I: 5, O: 7, U: 11, Y: 13, "Ë": 17 };

export type SolveOptions = {
  beamWidth: number;
  maxOps: number;
  allowDelete: boolean;
  allowClosure: boolean;
  opCost: { sub: number; del: number; ins: number };
  edgeWeight?: number;
  manifest: EngineManifest;
  alphabet: string;
};

export type Path = {
  voicePath: Vowel[];
  ringPath: number[];
  levelPath: number[];
  ops: string[];
  checksums: { V: number; E: number; C: number };
  kept: number;
};

// --- Path Generation & State ---
type State = { seq: Vowel[]; E: number; ops: string[] };

export function checksumV(path: Vowel[]): number {
  let product = 1;
  const seen = new Set<Vowel>();
  for (const v of path) {
    if (!seen.has(v)) {
      product *= VOWEL_VALUE[v];
      seen.add(v);
    }
  }
  return product;
}

function keptCount(base: Vowel[], cand: Vowel[]) {
  let k = 0;
  for (let i = 0; i < Math.min(base.length, cand.length); i++)
    if (base[i] === cand[i]) k++;
  return k;
}

function mkPath(
  baseSeq: Vowel[],
  consClasses: CClass[],
  seq: Vowel[],
  E: number,
  ops: string[],
  edgeInfo: EdgeInfo,
  edgeWeight: number,
  RING: Record<Vowel, number>,
  LVL: Record<Vowel, number>
): Path {
  const voicePath = seq;
  let finalE = E;

  // Apply edge bias to first and last hops
  if (voicePath.length > 1 && edgeInfo.prefix?.cls) {
    const dPrefix = Math.abs(RING[voicePath[1]] - RING[voicePath[0]]);
    finalE += edgeBiasPenalty(dPrefix, edgeInfo.prefix.cls, edgeWeight);
  }
  if (voicePath.length > 1 && edgeInfo.suffix?.cls) {
      const lastHopIdx = voicePath.length - 2;
      const dSuffix = Math.abs(RING[voicePath[lastHopIdx + 1]] - RING[voicePath[lastHopIdx]]);
      finalE += edgeBiasPenalty(dSuffix, edgeInfo.suffix.cls, edgeWeight);
  }


  const p: Path = {
    voicePath,
    ringPath: voicePath.map((v: Vowel) => RING[v]),
    levelPath: voicePath.map((v: Vowel) => LVL[v]),
    checksums: {
      V: checksumV(voicePath),
      E: finalE,
      C: computeC(voicePath, consClasses, RING),
    },
    kept: keptCount(baseSeq, voicePath),
    ops,
  };

  if (p.kept > Math.min(baseSeq.length, seq.length)) {
    throw new Error(
      `Keeps overflow: kept=${p.kept} base=${baseSeq.length} seq=${seq.length}`
    );
  }
  if (ops.some((o: string) => o.startsWith("insert ") && o !== "closure Ë"))
    throw new Error("Illegal insert op");
  return p;
}

function neighbors(st: State, opts: SolveOptions): State[] {
  const out: State[] = [];
  const seq = st.seq;
  const { allowDelete, allowClosure, opCost } = opts;

  // substitute
  for (let i = 0; i < seq.length; i++) {
    for (const v of VOWELS)
      if (v !== seq[i]) {
        const next = seq.slice();
        next[i] = v;
        out.push({
          seq: next,
          E: st.E + opCost.sub,
          ops: [...st.ops, `${seq[i]}→${v}`],
        });
      }
  }

  // delete (optional)
  if (allowDelete) {
    for (let i = 0; i < seq.length; i++) {
      const next = seq.slice(0, i).concat(seq.slice(i + 1));
      if (!next.length) continue;
      out.push({
        seq: next,
        E: st.E + opCost.del,
        ops: [...st.ops, `delete ${seq[i]}`],
      });
    }
  }

  // insert closure Ë (optional) — THE ONLY INSERT ALLOWED
  if (allowClosure && seq[seq.length - 1] !== "Ë") {
    const next = seq.concat("Ë");
    out.push({
      seq: next,
      E: st.E + opCost.ins,
      ops: [...st.ops, "closure Ë"],
    });
  }

  return out;
}

// --- Path Scoring ---
const ringPenalty = (p: Vowel[], RING: Record<Vowel, number>) => {
  let d = 0;
  for (let i = 0; i < p.length - 1; i++)
    d += Math.abs(RING[p[i]] - RING[p[i + 1]]);
  return d;
};
function preferClosureTie(a: Vowel[], b: Vowel[]): number {
  const enda = a[a.length - 1] === "Ë" ? 0 : 1;
  const endb = b[b.length - 1] === "Ë" ? 0 : 1;
  return enda - endb;
}

function scoreTuple(p: Path, RING: Record<Vowel, number>): [number, number, number, number] {
  const { E, V, C } = p.checksums;
  return [E, ringPenalty(p.voicePath, RING), C, -p.kept];
}


// --- Main Solver ---
export function solveWord(word: string, opts: SolveOptions, alphabet: string) {
    const manifest = opts.manifest;
    const RING = manifest.ringIndex;
    const LVL  = manifest.levelIndex;
    const EDGE_W = typeof opts.edgeWeight === "number" ? opts.edgeWeight : manifest.edgeWeight;

    const rawBase = extractBase(word);
    const base = normalizeTerminalY(rawBase, word);
    const baseSeq = base.length ? base : (["O"] as Vowel[]);

    const profile = chooseProfile(word, alphabet === "auto" ? undefined : alphabet);
    const { windows, classes: consClasses, edge, edgeWindows } = readWindowsDebug(word, baseSeq, profile);
    
    const K = opts.beamWidth;
    const maxOps = opts.maxOps;

    let paths: Path[] = [];
    const q: State[] = [{ seq: baseSeq, E: 0, ops: [] }];
    const visited = new Set<string>([baseSeq.join("")]);

    while (q.length > 0) {
        const st = q.shift();
        if(!st) continue;
        if (st.ops.length > maxOps) continue;
        
        const p = mkPath(baseSeq, consClasses, st.seq, st.E, st.ops, edge, EDGE_W, RING, LVL);
        paths.push(p);

        const nextStates = neighbors(st, opts);
        for (const n of nextStates) {
            const key = n.seq.join("");
            if (visited.has(key)) continue;
            visited.add(key);
            q.push(n);
        }
    }

    const uniqPaths = Array.from(new Map(paths.map(p => [p.voicePath.join(""), p])).values());

    uniqPaths.sort((p, q) => {
        const A = scoreTuple(p, RING), B = scoreTuple(q, RING);
        for(let i=0; i<A.length; i++) if (A[i] !== B[i]) return A[i] - B[i];
        return preferClosureTie(p.voicePath, q.voicePath);
    });

    const primary = uniqPaths[0];

    const frontier = uniqPaths
        .slice(1, K)
        .filter(p => p.checksums.E <= (primary.checksums.E || 0) + 2);
    
    const signals = [
        `base_raw=${rawBase.join("") || "-"}`,
        `base_norm=${base.join("") || "-"}`,
        `cons_windows=${consClasses.join(",") || "-"}`,
        ...edgeWindows,
        `alphabet=${profile.id}`
    ];

    return {
        engineVersion: manifest.version,
        primaryPath: primary,
        frontierPaths: frontier,
        windows,
        windowClasses: consClasses,
        edgeWindows,
        signals,
    };
}
