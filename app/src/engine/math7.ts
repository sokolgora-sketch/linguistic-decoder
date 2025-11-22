// src/engine/math7.ts
//
// Seven-Principles math layer for vowels.
// This file is PURE: no side effects, no engine calls,
// just mappings and helpers over Vowel sequences.

import type { Vowel } from "@/shared/engineShape";

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
  1: "Unity",       // A – Bashkimi
  2: "Vibration",   // E – Vibrimi
  3: "Rhythm",      // I – Ritmi
  4: "Balance",     // O – Balanca (mediator)
  5: "Change",      // U – Ndryshimi
  6: "Initiative",  // Y – Nisma
  0: "Love",        // Ë – Dashuria / Resolution (7 ≡ 0)
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
  // Ë↔Ë is special; we won't count it here to keep 0–3 range.
  return count;
}
