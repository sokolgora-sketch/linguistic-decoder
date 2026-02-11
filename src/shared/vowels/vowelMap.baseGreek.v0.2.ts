// src/shared/vowels/vowelMap.baseGreek.v0.2.ts
// Greek orthography → Seven Voices (v0.2)
// Policy: keep v0.1 Latin-only; Greek support begins in v0.2.
// Notes:
// - We include common monotonic precomposed vowels (tonos/dialytika).
// - Polytonic is handled in the mapper via NFD base fallback (α/ε/η/ι/ο/υ/ω).

import type { VowelVoice } from "./vowelVoices.v0.1";

export const VOWEL_MAP_BASE_GREEK_V0_2: Readonly<Record<string, VowelVoice>> = Object.freeze({
  // --- A family (alpha) ----------------------------------------------------
  "α": "A",
  "ά": "A",
  "Α": "A",
  "Ά": "A",

  // --- E family (epsilon, eta) --------------------------------------------
  "ε": "E",
  "έ": "E",
  "Ε": "E",
  "Έ": "E",

  "η": "E",
  "ή": "E",
  "Η": "E",
  "Ή": "E",

  // --- I family (iota) -----------------------------------------------------
  "ι": "I",
  "ί": "I",
  "ϊ": "I",
  "ΐ": "I",
  "Ι": "I",
  "Ί": "I",
  "Ϊ": "I",

  // --- O family (omicron, omega) ------------------------------------------
  "ο": "O",
  "ό": "O",
  "Ο": "O",
  "Ό": "O",

  "ω": "O",
  "ώ": "O",
  "Ω": "O",
  "Ώ": "O",

  // --- Y family (upsilon) --------------------------------------------------
  // Rationale: Greek upsilon is the historical source of Latin Y; treat as Y-family in orthography.
  "υ": "Y",
  "ύ": "Y",
  "ϋ": "Y",
  "ΰ": "Y",
  "Υ": "Y",
  "Ύ": "Y",
  "Ϋ": "Y",
});
