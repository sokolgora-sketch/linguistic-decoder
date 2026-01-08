import type { OriginClaimGateVerdictV1_1 } from "./originClaim.reasons.v1_1";

export type OriginClaimCandidateLikeV1_1 = {
  language?: string;
  form?: string;
  // decomposition-ish
  decomposition?: unknown;
  // voice path-ish
  vowelPath?: unknown;

  // deterministic support signals (numbers already computed elsewhere)
  support?: {
    positives?: number;
    negatives?: number;
  };
};

export type OriginClaimGateConfigV1_1 = {
  minPositives: number;     // e.g. 1
  maxNegatives: number;     // e.g. 0 or 1
};

function hasNonEmptyArray(x: unknown): boolean {
  return Array.isArray(x) && x.some((v) => String(v ?? "").trim().length > 0);
}

export function gateOriginClaimCandidateV1_1(
  cand: OriginClaimCandidateLikeV1_1,
  cfg: OriginClaimGateConfigV1_1,
): OriginClaimGateVerdictV1_1 {
  const reasons: OriginClaimGateVerdictV1_1["reasons"] = [];

  const hasDecomp = hasNonEmptyArray(cand.decomposition);
  if (!hasDecomp) {
    reasons.push({ code: "exclude_missing_decomposition" });
  }

  const hasVowelPath = hasNonEmptyArray(cand.vowelPath);
  if (!hasVowelPath) {
    reasons.push({ code: "exclude_missing_vowel_path" });
  }

  const positives = cand.support?.positives ?? 0;
  const negatives = cand.support?.negatives ?? 0;

  if (positives < cfg.minPositives || negatives > cfg.maxNegatives) {
    reasons.push({
      code: "exclude_low_support",
      detail: `pos=${positives},neg=${negatives},minPos=${cfg.minPositives},maxNeg=${cfg.maxNegatives}`,
    });
  }

  const include = reasons.length === 0;
  if (include) reasons.push({ code: "include_passes_min_support" });

  return { include, reasons };
}

/**
 * Deterministic ordering for included candidates.
 * Keep it boring and stable: language, then form (case-insensitive).
 */
export function compareOriginClaimCandidatesV1_1(
  a: OriginClaimCandidateLikeV1_1,
  b: OriginClaimCandidateLikeV1_1,
): number {
  const la = String(a.language ?? "").toLowerCase();
  const lb = String(b.language ?? "").toLowerCase();
  if (la < lb) return -1;
  if (la > lb) return 1;

  const fa = String(a.form ?? "").toLowerCase();
  const fb = String(b.form ?? "").toLowerCase();
  if (fa < fb) return -1;
  if (fa > fb) return 1;

  return 0;
}
