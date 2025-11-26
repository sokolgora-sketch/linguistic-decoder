// src/shared/sevenVoices.ts

import type { Vowel, PrincipleName } from "./engineShape";

export type RingIndex = 0 | 1 | 2 | 3;

export interface VoiceMeta {
  id: Vowel;
  label: string;             // human-friendly label
  principle: PrincipleName;  // core principle name
  // keep alias for any older code that used principleName
  principleName: PrincipleName;
  ring: RingIndex;           // 0 = center (O), 1 = inner (I/U), 2 = middle (E/Y), 3 = outer (A/Ë)
}

// Canonical Seven-Voices meta.
// Heart model:
// O = mediator at center
// I/U = inner (male)
// E/Y = middle (female)
// A/Ë = outer (father/mother)

const META: Record<Vowel, VoiceMeta> = {
  A: {
    id: "A",
    label: "Action / Truth",
    principle: "Truth",
    principleName: "Truth",
    ring: 3,
  },
  E: {
    id: "E",
    label: "Expansion / Bridge",
    principle: "Expansion",
    principleName: "Expansion",
    ring: 2,
  },
  I: {
    id: "I",
    label: "Insight / Measure",
    principle: "Insight",
    principleName: "Insight",
    ring: 1,
  },
  O: {
    id: "O",
    label: "Balance / Heart",
    principle: "Balance",
    principleName: "Balance",
    ring: 0, // center
  },
  U: {
    id: "U",
    label: "Unity / Breath",
    principle: "Unity",
    principleName: "Unity",
    ring: 1,
  },
  Y: {
    id: "Y",
    label: "Network / Weave",
    principle: "Network Integrity",
    principleName: "Network Integrity",
    ring: 2,
  },
  Ë: {
    id: "Ë",
    label: "Evolution / Unit",
    principle: "Evolution",
    principleName: "Evolution",
    ring: 3,
  },
};

export const SEVEN_VOICES: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

// Canonical seven principle words in order A…Ë.
// Tests expect: [0] = "Truth", [6] = "Evolution".
export const SEVEN_PRINCIPLES_IN_ORDER: PrincipleName[] = [
  "Truth",
  "Expansion",
  "Insight",
  "Balance",
  "Unity",
  "Network Integrity",
  "Evolution",
];

/**
 * Return static metadata for a given vowel/voice.
 */
export function getVoiceMeta(vowel: Vowel): VoiceMeta {
  return META[vowel];
}

// === Path → Principles summary ==============================================

export interface PathPrincipleSummary {
  principlePath: PrincipleName[];      // e.g. ["Unity", "Insight"]
  dominantVoices: Vowel[];             // voices with highest frequency in path
  dominantPrinciples: PrincipleName[]; // principles of those dominant voices
  sevenWords: PrincipleName[];         // always the 7 principles in canonical order
}

/**
 * Map a vowel path (e.g. ["U","I"]) into:
 * - principlePath: the sequence of principle names
 * - dominantVoices: the voice(s) that appear most often
 * - dominantPrinciples: principle(s) for those voices
 * - sevenWords: full list of principles in canonical order
 *
 * Tests expect, for ["U","I"]:
 *   principlePath === ["Unity","Insight"]
 *   dominantVoices.sort() === ["I","U"]
 *   dominantPrinciples.sort() === ["Insight","Unity"]
 *   sevenWords[0] === "Truth", sevenWords[6] === "Evolution"
 */
export function mapPathToPrinciples(path: Vowel[]): PathPrincipleSummary {
  // Straight mapping of vowels → principles, in order
  const principlePath: PrincipleName[] = path.map(
    (v) => getVoiceMeta(v).principle
  );

  // Frequency count for dominant voices
  const counts: Partial<Record<Vowel, number>> = {};
  for (const v of path) {
    counts[v] = (counts[v] ?? 0) + 1;
  }

  const values = Object.values(counts) as number[];
  const maxCount = values.length ? Math.max(...values) : 0;

  const dominantVoices = (Object.entries(counts) as [Vowel, number][])
    .filter(([, count]) => count === maxCount && maxCount > 0)
    .map(([v]) => v)
    .sort();

  const dominantPrinciples: PrincipleName[] = dominantVoices.map(
    (v) => getVoiceMeta(v).principle
  );

  return {
    principlePath,
    dominantVoices,
    dominantPrinciples,
    sevenWords: SEVEN_PRINCIPLES_IN_ORDER,
  };
}
