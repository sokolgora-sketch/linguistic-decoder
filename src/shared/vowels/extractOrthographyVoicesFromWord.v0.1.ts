// src/shared/vowels/extractOrthographyVoicesFromWord.v0.1.ts
/**
 * Universal Vowel Mapper SSOT v0.1 (Orthography → 7 Voices)
 * - This is the ONLY public SSOT for written-word vowel extraction.
 * - Internally delegates to mapVowels v0.2.
 * - Deterministic, no I/O, no network.
 */

import type { VowelVoice } from "./vowelVoices.v0.1";
import { mapVowelsV0_2 } from "./mapVowels.v0.2";

const VOICES: readonly VowelVoice[] = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;

function isVoice(x: unknown): x is VowelVoice {
  return typeof x === "string" && (VOICES as readonly string[]).includes(x);
}

function safeStringList(x: unknown): string[] {
  if (!Array.isArray(x)) return [];
  const out: string[] = [];
  for (const it of x) out.push(String(it));
  return out;
}

export type OrthographyTokenV0_1 = {
  raw: string;
  norm: string;
  voice: VowelVoice | null;
  note?: string;
};

export type OrthographyVoicesFromWordV0_1 = {
  word: string;
  voices: VowelVoice[];
  tokens: OrthographyTokenV0_1[];
  diagnostics: {
    unmapped: string[];
    usedOverrides: boolean;
    notes?: string[];
  };
};

export function extractOrthographyVoicesFromWordV0_1(input: {
  word: string;
  langHint?: string | null;
}): OrthographyVoicesFromWordV0_1 {
  const word = String(input.word ?? "").trim();
  const notes: string[] = [];

  try {
    const out = mapVowelsV0_2({ word, langHint: input.langHint ?? undefined });

    const unmapped = Array.from(new Set(safeStringList(out?.diagnostics?.unmapped))).sort();

    const tokens: OrthographyTokenV0_1[] = Array.isArray(out?.tokens)
      ? out.tokens.map((t) => {
          const raw = String((t as any)?.raw ?? "");
          const norm = String((t as any)?.norm ?? "");
          const v = (t as any)?.voice;
          const voice = isVoice(v) ? (v as VowelVoice) : null;
          const note = (t as any)?.note != null ? String((t as any)?.note) : undefined;
          return { raw, norm, voice, note };
        })
      : [];

    return {
      word,
      voices: Array.isArray(out?.voices) ? (out.voices as VowelVoice[]) : [],
      tokens,
      diagnostics: {
        unmapped,
        usedOverrides: !!out?.diagnostics?.usedOverrides,
        notes: notes.length ? notes : undefined,
      },
    };
  } catch (e) {
    notes.push(`orthography_mapper_threw:${String(e)}`);
    return {
      word,
      voices: [],
      tokens: [],
      diagnostics: { unmapped: [], usedOverrides: false, notes },
    };
  }
}
