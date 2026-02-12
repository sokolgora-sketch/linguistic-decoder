// src/shared/vowels/ipaVowelMap.v0.2.ts
// IPA vowel symbol → Seven Voices (v0.2)
// Policy: v0.1 remains stable; v0.2 expands coverage.
// This is a "family bucket" map (not phonetics research): deterministic, coarse.

import type { VowelVoice } from "./vowelVoices.v0.1";
import { IPA_VOWEL_MAP_V0_1 } from "./ipaVowelMap.v0.1";

export const IPA_VOWEL_MAP_V0_2: Readonly<Record<string, VowelVoice>> = Object.freeze({
  ...IPA_VOWEL_MAP_V0_1,

  // --- A family (open / near-open) ---
  "ɑ": "A",
  "ɐ": "A",
  "æ": "A",
  "ɶ": "A",

  // --- E family (front / mid-front) ---
  "ɛ": "E",

  // --- I family (close / near-close front unrounded) ---
  "ɪ": "I",

  // --- O family (back rounded mid/open-mid/open) ---
  "ɔ": "O",
  "ɒ": "O",

  // --- U family (close / near-close back/central-ish) ---
  "ʊ": "U",
  "ɯ": "U",
  "ʉ": "U",
  "ɨ": "U",

  // --- Y family (front rounded) ---
  "ʏ": "Y",
  "ø": "Y",
  "œ": "Y",

  // --- Ë family (central/neutral + rhotic) ---
  "ə": "Ë",
  "ɘ": "Ë",
  "ɵ": "Ë",
  "ɜ": "Ë",
  "ɞ": "Ë",
  "ʌ": "Ë",
  "ɤ": "Ë",
  "ɚ": "Ë",
  "ɝ": "Ë",
});
