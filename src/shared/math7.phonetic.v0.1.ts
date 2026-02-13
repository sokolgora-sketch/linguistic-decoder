// src/shared/math7.phonetic.v0.1.ts
/**
 * Phonetic Math7 (IPA → SevenVowel[] → mod7)
 *
 * IMPORTANT:
 * - Orthography SSOT stays in math7.core.ts (mapVowels v0.2).
 * - This module is the parallel phonetic lane: it only parses the given IPA string.
 * - Deterministic, no I/O, no G2P.
 */

import { extractCarrierVoicesFromIpaV0_1 } from "./vowels/extractCarrierVoicesFromIpa.v0.1";
import { type SevenVowel, VOWEL_INDEX, totalMod7FromSum0to6 } from "./math7.core";

function asSevenVowels(x: unknown): SevenVowel[] {
  if (Array.isArray(x)) return x.filter((v) => typeof v === "string") as SevenVowel[];
  const voices = (x as any)?.voices;
  if (Array.isArray(voices)) return voices.filter((v) => typeof v === "string") as SevenVowel[];
  return [];
}

export function extractSevenVowelsFromIpa(input: string): SevenVowel[] {
  try {
    const out = extractCarrierVoicesFromIpaV0_1(String(input ?? ""));
    return asSevenVowels(out);
  } catch {
    return [];
  }
}

export function totalMod7FromIpa(input: string): number {
  const vowels = extractSevenVowelsFromIpa(input);
  let sum = 0;
  for (const v of vowels) sum += (VOWEL_INDEX as any)[v] ?? 0;
  return totalMod7FromSum0to6(sum);
}
