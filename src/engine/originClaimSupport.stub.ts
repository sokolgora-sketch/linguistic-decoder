import type { OriginClaimSupportBundle } from "@/shared/originClaimSupport.v1";

export function buildOriginClaimSupportStub(claimId: string): OriginClaimSupportBundle {
  return {
    claimId,
    refs: [],
  };
}
