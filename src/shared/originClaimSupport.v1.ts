/**
 * Origin Claim Support — v1
 *
 * Purpose:
 * - Attach evidence references to origin claims
 * - NO scoring, NO ranking, NO confidence math
 * - Structural only
 */

export type SupportRefKind =
  | "phonetic"
  | "morphological"
  | "functional"
  | "historical"
  | "comparative"
  | "symbolic"
  | "unknown";

export interface OriginClaimSupportRef {
  id: string;                 // stable, deterministic id
  kind: SupportRefKind;       // what type of support this is
  source: string;             // e.g. "engine", "canon", "cross-lang"
  note?: string;              // human-readable note (non-conclusive)
}

export interface OriginClaimSupportBundle {
  claimId: string;            // ties to originClaim.id
  refs: OriginClaimSupportRef[];
}

/**
 * Hard rule:
 * - Empty refs[] is VALID.
 * - Support does NOT imply truth.
 */
