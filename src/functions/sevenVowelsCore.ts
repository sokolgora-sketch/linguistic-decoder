/**
 * ⚠️ SEVEN-VOICES CORE ENGINE (solveWord)
 *
 * Deterministic vowel-path solver: vowel sequences, rings, levels,
 * op costs, consonant influence. All major tests depend on this file.
 *
 * Important:
 * - Never let auto-formatters or AI tools rewrite it wholesale.
 * - Changes must keep all test suites green.
 */
// @ts-nocheck

import { getManifest, EngineManifest } from "../engine/manifest";
import {
  computeC,
  extractBase,
  normalizeTerminalY,
  readWindowsDebug,
  edgeBiasPenalty,
  type EdgeInfo,
} from "./sevenVoicesC";
import { chooseProfile, CClass } from "./languages";

export const VOWELS = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
export type Vowel = (typeof VOWELS)[number];

export const VOWEL_VALUE: Record<Vowel, number> = {
  A: 2, E: 3, I: 5, O: 7, U: 11, Y: 13, Ë: 17,
};

export function checksumV(path) {
  let product = 1;
  const seen = new Set();
  for (const v of path) {
    if (!seen.has(v)) {
      product *= VOWEL_VALUE[v];
      seen.add(v);
    }
  }
  return product;
}

function keptCount(base, cand) {
  let k = 0;
  for (let i = 0; i < Math.min(base.length, cand.length); i++)
    if (base[i] === cand[i]) k++;
  return k;
}

function mkPath(baseSeq, consClasses, seq, E, ops, RING, LVL) {
  const voicePath = seq;
  return {
    voicePath,
    ringPath: voicePath.map(v => RING[v]),
    levelPath: voicePath.map(v => LVL[v]),
    checksums: {
      V: checksumV(voicePath),
      E,
      C: computeC(voicePath, consClasses, RING),
    },
    kept: keptCount(baseSeq, voicePath),
    ops,
  };
}

function neighbors(st, opts) {
  const out = [];
  const seq = st.seq;
  const { allowDelete, allowClosure, opCost } = opts;

  // substitutions
  for (let i = 0; i < seq.length; i++) {
    for (const v of VOWELS)
      if (v !== seq[i]) {
        const next = seq.slice();
        next[i] = v;
        out.push({ seq: next, E: st.E + opCost.sub, ops: [...st.ops, `${seq[i]}→${v}`] });
      }
  }

  // deletes
  if (allowDelete) {
    for (let i = 0; i < seq.length; i++) {
      const next = seq.slice(0, i).concat(seq.slice(i + 1));
      if (!next.length) continue;
      out.push({ seq: next, E: st.E + opCost.del, ops: [...st.ops, `delete ${seq[i]}`] });
    }
  }

  // closure Ë
  if (allowClosure && seq[seq.length - 1] !== "Ë") {
    const next = seq.concat("Ë");
    out.push({ seq: next, E: st.E + opCost.ins, ops: [...st.ops, "closure Ë"] });
  }

  return out;
}

const ringPenalty = (p, RING) => {
  let d = 0;
  for (let i = 0; i < p.length - 1; i++)
    d += Math.abs(RING[p[i]] - RING[p[i + 1]]);
  return d;
};

function preferClosureTie(a, b) {
  const enda = a[a.length - 1] === "Ë" ? 0 : 1;
  const endb = b[b.length - 1] === "Ë" ? 0 : 1;
  return enda - endb;
}

function scoreTuple(p, RING) {
  const { E, V, C } = p.checksums;
  return [E, ringPenalty(p.voicePath, RING), C, -p.kept];
}

// --- NEW PATCHED COMPARATOR ---
// Gives open mode a small deterministic bias toward longer vowel paths
function comparePaths(a, b, RING, mode = "strict") {
  const A = scoreTuple(a, RING), B = scoreTuple(b, RING);
  for (let i = 0; i < A.length; i++) if (A[i] !== B[i]) return A[i] - B[i];
  if (mode === "open") {
    const lenDiff = (b.voicePath?.length ?? 0) - (a.voicePath?.length ?? 0);
    if (lenDiff !== 0) return lenDiff;
  }
  return preferClosureTie(a.voicePath, b.voicePath);
}

// --- MAIN SOLVER ---
export function solveWord(word, opts: any = {}, alphabet) {
  const manifest = opts.manifest ? opts.manifest : getManifest();
  const RING = manifest.ringIndex;
  const LVL = manifest.levelIndex;
  const EDGE_W = typeof opts.edgeWeight === "number" ? opts.edgeWeight : manifest.edgeWeight;
  const opCost = opts.opCost ?? manifest.opCost;

  const rawBase = extractBase(word);
  const base = normalizeTerminalY(rawBase, word);
  const baseSeq = base.length ? base : (["O"] as Vowel[]);

  const profile = chooseProfile(word, alphabet === "auto" ? undefined : alphabet);
  const { windows, classes: consClasses, edge, edgeWindows } =
    readWindowsDebug(word, baseSeq, profile);

  const K = opts.beamWidth;
  const maxOps = opts.maxOps;

  let paths = [];
  const q = [{ seq: baseSeq, E: 0, ops: [] }];
  const visited = new Set([baseSeq.join("")]);

  while (q.length > 0) {
    const st = q.shift();
    if (!st) continue;
    if (st.ops.length > maxOps) continue;

    const p = mkPath(baseSeq, consClasses, st.seq, st.E, st.ops, RING, LVL);
    paths.push(p);

    const nextStates = neighbors(st, { ...opts, opCost });
    for (const n of nextStates) {
      const key = n.seq.join("");
      if (visited.has(key)) continue;
      visited.add(key);
      q.push(n);
    }
  }

  const uniqPaths = Array.from(new Map(paths.map(p => [p.voicePath.join(""), p])).values());

  // edge bias
  for (const p of uniqPaths) {
    let edgePenalty = 0;
    if (p.voicePath.length > 1) {
      if (edge.prefix?.cls) {
        const dPrefix = Math.abs(RING[p.voicePath[1]] - RING[p.voicePath[0]]);
        edgePenalty += edgeBiasPenalty(dPrefix, edge.prefix.cls, EDGE_W);
      }
      if (edge.suffix?.cls) {
        const lastHopIdx = p.voicePath.length - 2;
        const dSuffix = Math.abs(RING[p.voicePath[lastHopIdx + 1]] - RING[p.voicePath[lastHopIdx]]);
        edgePenalty += edgeBiasPenalty(dSuffix, edge.suffix.cls, EDGE_W);
      }
    }
    p.checksums.E += edgePenalty;
  }

  // Use patched comparison
  uniqPaths.sort((a, b) => comparePaths(a, b, RING, opts.mode ?? "strict"));

  const primary = uniqPaths[0];
  const frontier = uniqPaths
    .slice(1, K)
    .filter(p => p.checksums.E <= (primary.checksums.E || 0) + 2);

  const signals = [
    `base_raw=${rawBase.join("") || "-"}`,
    `base_norm=${base.join("") || "-"}`,
    `cons_windows=${consClasses.join(",") || "-"}`,
    ...edgeWindows,
    `alphabet=${profile.id}`,
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
