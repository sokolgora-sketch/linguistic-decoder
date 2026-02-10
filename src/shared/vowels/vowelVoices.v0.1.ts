// src/shared/vowels/vowelVoices.v0.1.ts
// Universal Vowel Mapper v0.1 — canonical Seven-Voices vocabulary.
// This is the ONLY allowed union for orthography-derived vowel voices.

export type VowelVoice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export const VOWEL_VOICES_V0_1 = Object.freeze([
  "A",
  "E",
  "I",
  "O",
  "U",
  "Y",
  "Ë",
] as const);

const VOWEL_VOICES_SET_V0_1: ReadonlySet<string> = new Set(VOWEL_VOICES_V0_1 as unknown as string[]);

export function isVowelVoice(x: unknown): x is VowelVoice {
  return typeof x === "string" && VOWEL_VOICES_SET_V0_1.has(x);
}
