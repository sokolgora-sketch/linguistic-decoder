// src/functions/deepRootEngine.ts

import type { DeepRootSummary, Vowel } from "@/shared/engineShape";
import { computeDeepRootForWord as computeDeepRootRaw } from "./zero-engine-deep-root";

/**
 * Adapter for the DeepRoot engine:
 * takes the raw zero-engine result and normalises it into DeepRootSummary.
 */
export function computeDeepRootForWord(word: string): DeepRootSummary | null {
  const raw = computeDeepRootRaw(word);

  if (!raw) return null;

  const motif = (raw.core_vowel_motif || []) as Vowel[];

  return {
    coreFunction: raw.core_function,
    motif,
    lightDark: raw.light_dark,
    vibrationalTone: raw.vibrational_tone,
    pieces: (raw.pieces || []).map((p: any) => ({
      role: p.role,
      block: p.block,
      language: p.language,
      meaning: p.meaning,
      notes: p.notes,
    })),
    short: raw.explanation_short,
    examples: (raw.examples_modern_usage || []).map((ex: any) => ({
      language: ex.language,
      form: ex.form,
      gloss: ex.gloss,
    })),
  };
}
