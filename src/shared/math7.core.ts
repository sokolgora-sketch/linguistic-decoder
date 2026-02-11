// src/shared/math7.core.ts
/**
 * Math7 core (single source of truth)
 *
 * This file defines:
 * - The canonical Seven Vowels set
 * - Their fixed 0-based indexing
 * - Stable extraction from strings
 * - Stable mod-7 totals
 *
 * Rule:
 * - No other file should define vowel order/index.
 * - Any mod7 computations should import from here.
 */

import { mapVowelsV0_2 } from "./vowels/mapVowels.v0.2";

export const SEVEN_VOWELS = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
export type SevenVowel = (typeof SEVEN_VOWELS)[number];

// 0-based indexing (matches existing behavior where "study" => totalMod7 = 2)
export const VOWEL_INDEX: Record<SevenVowel, number> = {
  A: 0,
  E: 1,
  I: 2,
  O: 3,
  U: 4,
  Y: 5,
  "Ë": 6,
};

export function isSevenVowel(x: string): x is SevenVowel {
  return (SEVEN_VOWELS as readonly string[]).includes(x);
}

export function extractSevenVowelsFromString(input: string): SevenVowel[] {
  // Orthography SSOT: Universal Vowel Mapper v0.1 (Latin + diacritics → Seven Voices).
  // Deterministic; never throws.
  try {
    const out = mapVowelsV0_2({ word: String(input ?? "") });
    return out.voices as unknown as SevenVowel[];
  } catch {
    return [];
  }
}

export function totalMod7FromSum0to6(sum0to6: number): number {
  // canonical safe modulo: 0..6
  return ((sum0to6 % 7) + 7) % 7;
}


export function totalMod7FromVowels(vowels: SevenVowel[]): number {
  let sum = 0;
  for (const v of vowels) sum += VOWEL_INDEX[v];
  return totalMod7FromSum0to6(sum);
}

export function totalMod7FromString(input: string): number {
  return totalMod7FromVowels(extractSevenVowelsFromString(input));
}
