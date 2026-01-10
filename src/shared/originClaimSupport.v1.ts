// src/shared/originClaimSupport.v1.ts

export type OriginClaimSupportRef = `ref:${string}`;

export interface OriginClaimSupportBundle {
  claimId: string;
  refs: OriginClaimSupportRef[];
}

/**
 * Minimal, structural seed. No inference.
 * The builder decides refs purely from presence/ids.
 */
export interface OriginClaimSupportSeedV1 {
  hasHeartMath7Primary: boolean;
  hasEvidenceSignals: boolean;
  candidateIds: string[];              // e.g. ["latin-studium", "albanian-studim"]
  deepRootFunctionalRootIds: string[]; // e.g. ["sq.shtu+di.v1"]
}

export function ocRef(path: string): OriginClaimSupportRef {
  // Normalize to "ref:<path>" exactly once.
  return (`ref:${path.replace(/^ref:/, "")}`) as OriginClaimSupportRef;
}
