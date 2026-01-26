import {
  totalMod7FromVowels,
  isSevenVowel,
  type SevenVowel,
  VOWEL_INDEX,
} from "@/shared/math7.core";
import { extractMath7BasisFromPayload } from "@/shared/math7.basis";
import { applyStrictTerminalYHint } from "@/shared/math7.basis";

/**
 * Public: principle names emitted by Math7.
 * Keep stable — tests and UI depend on this wording.
 */
export const PRINCIPLE_MAP: Record<SevenVowel, string> = {
  A: "TRUTH",
  E: "EXPANSION",
  I: "INSIGHT",
  O: "BALANCE",
  U: "UNITY",
  Y: "REFLECTION",
  "Ë": "EVOLUTION",
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

  /**
   * Numeric representations:
   * - indices0to6: internal index (A=0..Ë=6)
   * - values1to7: public doctrine (A=1..Ë=7)
   *
   * NOTE: legacy aliases (indices/sum) remain for back-compat and will be removed later.
   */
  indices0to6?: number[];
  sum0to6?: number;

  values1to7?: number[];
  rawSum1to7?: number;
  total1to7?: number;

  // Legacy aliases (deprecated)
  indices?: number[];
  sum?: number;
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


// Local helper: convert a 0..6 sum into 1..7 clock total (never 0).
function total1to7FromSum0to6(sum0to6: number): number {
  // Map sum0to6 to a 1..7 ring total deterministically.
  // We use safe modulo and then +1.
  const mod = ((sum0to6 % 7) + 7) % 7; // 0..6
  return mod + 1; // 1..7
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
  const indices0to6 = vowels.map((v) => VOWEL_INDEX[v]);
  const sum0to6 = indices0to6.reduce((a, b) => a + b, 0);

  // Public doctrine (1..7) derived deterministically from 0..6
  const values1to7 = indices0to6.map((n) => n + 1);
  const rawSum1to7 = values1to7.reduce((a, b) => a + b, 0);
  const total1to7 = total1to7FromSum0to6(sum0to6);

  return {
    cycleState,
    totalMod7,
    principlesPath,
    basis: opts?.basis,
    vowels,

    indices0to6,
    sum0to6,

    values1to7,
    rawSum1to7,
    total1to7,

    // Legacy aliases (deprecated)
    indices: indices0to6,
    sum: sum0to6,
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
  const hinted = applyStrictTerminalYHint(payload, vowels);
  return { primary: math7PrimaryFromVowels(hinted, { basis: hinted.join("") || basis }) };
}
