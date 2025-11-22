// src/engine/math7.ts
//
// Seven-Principles math layer for vowels.
// PURE: no engine calls, just mappings and helpers over Vowel sequences.

import type { AnalyzeWordResult, Vowel } from "@/shared/engineShape";

export type CycleState = "open" | "balanced" | "overloaded";

export interface Math7PathSummary {
  voicePath: Vowel[];
  indexPath: number[];      // 0–6
  totalMod7: number;        // 0–6
  cycleState: CycleState;   // open | balanced | overloaded
  pairCoverage: number;     // 0–3 (A–Y, E–U, I–O)
  principlesPath: string[]; // ["Unity", "Balance", ...]
}

export interface Math7Summary {
  primary: Math7PathSummary;
  frontier: Math7PathSummary[];
  candidates: Array<Math7PathSummary & { language: string }>;
}

// Internal numeric model (mod-7 universe):
// A → 1, E → 2, I → 3, O → 4, U → 5, Y → 6, Ë → 0
export const VOICE_TO_INDEX: Record<Vowel, number> = {
  A: 1,
  E: 2,
  I: 3,
  O: 4,
  U: 5,
  Y: 6,
  Ë: 0,
};

export const INDEX_TO_PRINCIPLE: Record<number, string> = {
  1: "Unity",      // A – Bashkimi
  2: "Vibration",  // E – Vibrimi
  3: "Rhythm",     // I – Ritmi
  4: "Balance",    // O – Balanca (mediator)
  5: "Change",     // U – Ndryshimi
  6: "Initiative", // Y – Nisma
  0: "Love",       // Ë – Dashuria / Resolution (7 ≡ 0)
};

// Inverse pairs in this mod-7 model:
// A ↔ Y, E ↔ U, I ↔ O, Ë ↔ Ë
export const INVERSE_PAIRS: Array<[Vowel, Vowel]> = [
  ["A", "Y"],
  ["E", "U"],
  ["I", "O"],
  ["Ë", "Ë"],
];

// ——— Basic helpers ———

export function voicePathToIndexPath(voicePath: Vowel[]): number[] {
  return voicePath.map(v => VOICE_TO_INDEX[v]);
}

export function indexPathToPrinciples(indexPath: number[]): string[] {
  return indexPath.map(i => INDEX_TO_PRINCIPLE[i]);
}

// Sum indices mod 7, stay in [0..6]
export function sumMod7(indexPath: number[]): number {
  return indexPath.reduce((acc, n) => (acc + n) % 7, 0);
}

// Count how many inverse pairs (A–Y, E–U, I–O) are present in a path
export function countInversePairs(voicePath: Vowel[]): number {
  const set = new Set(voicePath);
  let count = 0;
  if (set.has("A") && set.has("Y")) count++;
  if (set.has("E") && set.has("U")) count++;
  if (set.has("I") && set.has("O")) count++;
  // Ë↔Ë is special; we keep it out so pairCoverage stays 0–3.
  return count;
}

// Normalize whatever we stored in AnalyzeWordResult.voicePath back to Vowel[]
// We currently store "A → O → Ë" as a string in analyzeWord.
function parseVoicePath(raw: unknown): Vowel[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as Vowel[];

  if (typeof raw === "string") {
    return raw
      .split("→")
      .map(s => s.trim())
      .filter(Boolean) as Vowel[];
  }

  return [];
}

function summarizePath(voicePath: Vowel[]): Math7PathSummary {
  const indexPath = voicePathToIndexPath(voicePath);
  const totalMod7 = sumMod7(indexPath);
  const principlesPath = indexPathToPrinciples(indexPath);
  const pairCoverage = countInversePairs(voicePath);

  let cycleState: CycleState;
  if (totalMod7 === 0) cycleState = "balanced";
  else if (totalMod7 <= 3) cycleState = "open";
  else cycleState = "overloaded";

  return {
    voicePath,
    indexPath,
    totalMod7,
    cycleState,
    pairCoverage,
    principlesPath,
  };
}

export function computeMath7ForResult(result: AnalyzeWordResult): Math7Summary {
  // primary path
  const primaryVoices = parseVoicePath(result.primaryPath.voicePath);
  const primary = summarizePath(primaryVoices);

  // frontier paths
  const frontier = (result.frontier || []).map(f => {
    const voices = parseVoicePath(f.voicePath);
    return summarizePath(voices);
  });

  // per-language candidates
  const candidates = (result.languageFamilies || []).map(c => {
    const voices = parseVoicePath(c.voicePath);
    return {
      ...summarizePath(voices),
      language: c.language,
    };
  });

  return {
    primary,
    frontier,
    candidates,
  };
}
