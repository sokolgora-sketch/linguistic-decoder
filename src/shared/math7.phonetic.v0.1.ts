// src/shared/math7.phonetic.v0.1.ts
/**
 * Phonetic Math7 (IPA → SevenVowel[] → mod7)
 *
 * IMPORTANT:
 * - Orthography SSOT stays in math7.core.ts (mapVowels v0.2).
 * - This module is the parallel phonetic lane: it only parses the given IPA string.
 * - Deterministic, no I/O, no G2P.
 *
 * Rule:
 * - Do not trust arbitrary strings; only accept canonical SevenVowel values.
 */

import { extractCarrierVoicesFromIpaV0_1 } from "./vowels/extractCarrierVoicesFromIpa.v0.1";
import {
  type SevenVowel,
  VOWEL_INDEX,
  totalMod7FromSum0to6,
  isSevenVowel,
} from "./math7.core";

function coerceSevenVowels(x: unknown): SevenVowel[] {
  const voicesRaw =
    Array.isArray((x as any)?.voices) ? (x as any).voices :
    Array.isArray(x) ? x :
    [];

  const out: SevenVowel[] = [];
  for (const v of voicesRaw) {
    if (typeof v === "string" && isSevenVowel(v)) out.push(v);
  }
  return out;
}

export function extractSevenVowelsFromIpa(input: string): SevenVowel[] {
  try {
    const out = extractCarrierVoicesFromIpaV0_1(String(input ?? ""));
    return coerceSevenVowels(out);
  } catch {
    return [];
  }
}

export function totalMod7FromIpa(input: string): number {
  const vowels = extractSevenVowelsFromIpa(input);
  let sum = 0;
  for (const v of vowels) sum += VOWEL_INDEX[v];
  return totalMod7FromSum0to6(sum);
}
