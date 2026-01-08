/**
 * OriginClaim v1.1 — deterministic gate reasons.
 * Contract-level: treat as stable once released.
 */

export type OriginClaimReasonCodeV1_1 =
  | "include_passes_min_support"
  | "exclude_missing_decomposition"
  | "exclude_missing_vowel_path"
  | "exclude_low_support";

export type OriginClaimReasonV1_1 = {
  code: OriginClaimReasonCodeV1_1;
  /**
   * Optional debug detail.
   * Must be deterministic (derived from inputs; no time/random).
   */
  detail?: string;
};

export type OriginClaimGateVerdictV1_1 = {
  include: boolean;
  reasons: OriginClaimReasonV1_1[];
};
