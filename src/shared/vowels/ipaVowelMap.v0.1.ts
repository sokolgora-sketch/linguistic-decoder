import type { VowelVoice } from "./vowelVoices.v0.1";

/**
 * IPA → Seven Voices mapping (v0.1)
 * Brutally deterministic collapse into {A,E,I,O,U,Y,Ë}.
 */
export const IPA_VOWEL_TOKENS_V0_1 = Object.freeze([
  // A-family
  "a",
  "ɑ",
  "ɐ",

  // E-family
  "e",
  "ɛ",

  // I-family
  "i",
  "ɪ",

  // O-family
  "o",
  "ɔ",

  // U-family
  "u",
  "ʊ",

  // Y-family
  "y",
  "ʏ",

  // Ë-family (neutral / glue-ish)
  "ə",
  "ʌ",
] as const);

export const IPA_VOWEL_MAP_V0_1: Readonly<Record<string, VowelVoice>> = Object.freeze({
  // A-family
  a: "A",
  ɑ: "A",
  ɐ: "A",

  // E-family
  e: "E",
  ɛ: "E",

  // I-family
  i: "I",
  ɪ: "I",

  // O-family
  o: "O",
  ɔ: "O",

  // U-family
  u: "U",
  ʊ: "U",

  // Y-family
  y: "Y",
  ʏ: "Y",

  // Ë-family
  ə: "Ë",
  ʌ: "Ë",
});
