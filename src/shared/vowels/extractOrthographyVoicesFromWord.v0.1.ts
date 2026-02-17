// src/shared/vowels/extractOrthographyVoicesFromWord.v0.1.ts
// Orthography SSOT v0.1 — stable adapter around Universal Vowel Mapper v0.2.
// Contract: never throws; always returns { version, word, voices, tokens, diagnostics }.

import type { VowelVoice } from "./vowelVoices.v0.1";
import { mapVowelsV0_2 } from "./mapVowels.v0.2";

export type OrthographyTokenV0_1 = {
  raw: string;
  norm: string;
  voice: VowelVoice | null;
  note?: string;
};

export type OrthographyDiagnosticsV0_1 = {
  unmapped: string[];
  usedOverrides: boolean;
};

export type OrthographyVoicesFromWordV0_1 = {
  version: "orthography-voices.v0.1";
  word: string; // NFC-normalized word actually processed
  voices: VowelVoice[];
  tokens: OrthographyTokenV0_1[];
  diagnostics: OrthographyDiagnosticsV0_1;
};

function asString(x: unknown): string {
  if (typeof x === "string") return x;
  if (x == null) return "";
  return String(x);
}

export function extractOrthographyVoicesFromWordV0_1(input: {
  word: unknown;
  langHint?: unknown;
}): OrthographyVoicesFromWordV0_1 {
  try {
    const rawWord = asString(input?.word);
    const wordNfc = rawWord.normalize("NFC");
    const langHint = typeof input?.langHint === "string" ? input.langHint : undefined;

    const out = mapVowelsV0_2({ word: wordNfc, langHint });

    return {
      version: "orthography-voices.v0.1",
      word: wordNfc,
      voices: out.voices,
      tokens: out.tokens,
      diagnostics: out.diagnostics,
    };
  } catch {
    return {
      version: "orthography-voices.v0.1",
      word: "",
      voices: [],
      tokens: [],
      diagnostics: { unmapped: [], usedOverrides: false },
    };
  }
}
