// src/shared/originClaimSupport.v1.ts
// OriginClaim Support Bundle v1 — structural refs only (no inference)

/**
 * A minimal, deterministic "wiring surface" for future evidence linkage.
 * - MUST remain structural-only: references, ids, pointers.
 * - MUST NOT contain computed scores, rankings, or inferred claims.
 */
export interface OriginClaimSupportBundle {
  /**
   * Stable anchor id for the claim block, derived from request word
   * (e.g. "oc:study"). This is NOT a candidate id.
   */
  claimId: string;

  /**
   * Stable pointers to existing evidence nodes already present in the result model.
   * v1 starts empty; later milestones will populate.
   */
  refs: string[];
}
