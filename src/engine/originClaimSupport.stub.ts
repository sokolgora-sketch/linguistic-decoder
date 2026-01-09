// src/engine/originClaimSupport.stub.ts
// Deterministic stub: structural-only support bundle (no inference)

import type { OriginClaimSupportBundle } from "@/shared/originClaimSupport.v1";

/**
 * v1 stub: creates a stable support bundle with an anchor id and empty refs.
 * This is intentionally boring: structure only.
 */
export function buildOriginClaimSupportStub(claimId: string): OriginClaimSupportBundle {
  return {
    claimId,
    refs: [],
  };
}
