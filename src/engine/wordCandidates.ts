// Core candidate-engine types + a minimal v1 generator.
// This stays strictly within the Seven-vowel / Math7 rules.

import { summarizeWordMath7, type Math7Summary } from "../lib/sevenVowelsCore";
import type { AllowedOpId } from "@/shared/ops/allowedOps.v0.1";

/**
 * Single-source policy:
 * Candidate ops MUST use the canonical AllowedOpId vocabulary.
 */
export type CandidateOpId = AllowedOpId;

/**
 * Structural representation of one candidate form of a word.
 */
export interface CandidateForm {
  /** Original word passed in by the user */
  readonly input: string;
  /** Surface form of this candidate after transforms */
  readonly form: string;
  /** Smallest functional chunks, e.g. ["s'tu", "di", "m"] */
  readonly pieces: string[];
  /** Which legal ops we applied to reach this form */
  readonly opsUsed: CandidateOpId[];
  /** Math7 snapshot for this candidate */
  readonly math7: Math7Summary | null;
}

/**
 * Very small, deterministic v1 generator.
 *
 * For now:
 * - returns a single "exact" candidate
 * - uses summarizeWordMath7 to attach the Math7 summary
 *
 * Later we will expand this to explore other legal transforms
 * (vowel swaps, s↔sh, g↔gj, final swaps, compounding, etc.).
 */
export function generateCandidates(word: string): CandidateForm[] {
  const trimmed = word.trim();

  if (!trimmed) {
    return [];
  }

  const normalized = trimmed.toLowerCase();

  const math7 = summarizeWordMath7(normalized);

  return [
    {
      input: trimmed,
      form: normalized,
      pieces: [normalized],
      opsUsed: ["exact"],
      math7,
    },
  ];
}
