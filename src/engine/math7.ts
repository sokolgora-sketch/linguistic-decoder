import {
  totalMod7FromVowels,
  isSevenVowel,
  type SevenVowel,
  VOWEL_INDEX,
} from "@/shared/math7.core";
import { extractMath7BasisFromPayload } from "@/shared/math7.basis";

/**
 * Public: principle names emitted by Math7.
 * Keep stable — tests and UI depend on this wording.
 */
export const PRINCIPLE_MAP: Record<SevenVowel, string> = {
  A: "Truth",
  E: "Expansion",
  I: "Insight",
  O: "Balance",
  U: "Unity",
  Y: "Network Integrity",
  "Ë": "Evolution",
};

export type Math7Primary = {
  cycleState: "open" | "closed";
  totalMod7: number; // 0–6
  principlesPath: string[];

  /**
   * Evidence fields (optional): make Math7 auditable.
   * These MUST NOT be required (contract stability).
   */
  basis?: string;           // sanitized basis used to derive vowels (not spelling)
  vowels?: SevenVowel[];    // extracted 7-vowels
  indices?: number[];       // VOWEL_INDEX[v]
  sum?: number;             // indices sum
};

export type Math7Summary = {
  primary: Math7Primary;
};

/**
 * Internal helper: normalize any vowel-ish inputs to canonical SevenVowel[].
 */
function normalizeSevenVowels(vowelsIn: Array<string | null | undefined>): SevenVowel[] {
  return vowelsIn
    .map((v) => String(v ?? "").toUpperCase())
    .filter((v): v is SevenVowel => isSevenVowel(v));
}

/**
 * Public helper: build math7.primary from a vowel sequence.
 * basis is optional "show your work" text (already sanitized).
 */
export function math7PrimaryFromVowels(
  vowelsIn: Array<string | null | undefined>,
  opts?: { basis?: string }
): Math7Primary {
  const vowels = normalizeSevenVowels(vowelsIn);

  const principlesPath = vowels.map((v) => PRINCIPLE_MAP[v] ?? v);

  // Canonical mod7: sum of indices A=0..Ë=6
  const totalMod7 = totalMod7FromVowels(vowels);

  // Keep legacy cycleState behavior stable: closed if ends with Ë, else open.
  const cycleState: Math7Primary["cycleState"] =
    vowels.length > 0 && vowels[vowels.length - 1] === "Ë" ? "closed" : "open";

  // Evidence fields (optional)
  const indices = vowels.map((v) => VOWEL_INDEX[v]);
  const sum = indices.reduce((a, b) => a + b, 0);

  return {
    cycleState,
    totalMod7,
    principlesPath,
    basis: opts?.basis,
    vowels,
    indices,
    sum,
  };
}

/**
 * Public API expected by analysisAdapter and routes.
 * It consumes the engine payload and derives Math7 summary.
 *
 * IMPORTANT: we intentionally use the payload's vowelPath (if present),
 * because that is the analysis pipeline's basis.
 */
export function computeMath7ForResult(payload: any): Math7Summary {
  const { basis, vowels } = extractMath7BasisFromPayload(payload);
  return { primary: math7PrimaryFromVowels(vowels, { basis }) };
}
