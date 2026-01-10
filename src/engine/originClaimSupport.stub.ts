// src/engine/originClaimSupport.stub.ts
import type {
  OriginClaimSupportBundle,
  OriginClaimSupportSeedV1,
  OriginClaimSupportRef,
} from "../shared/originClaimSupport.v1";
import { ocRef } from "../shared/originClaimSupport.v1";

function uniqSorted(refs: OriginClaimSupportRef[]) {
  return Array.from(new Set(refs)).sort();
}

/**
 * Structural-only support bundle (no inference).
 * refs are stable pointers into the already-emitted payload.
 */
export function buildOriginClaimSupportStub(
  claimId: string,
  seed?: OriginClaimSupportSeedV1
): OriginClaimSupportBundle {
  if (!seed) return { claimId, refs: [] };

  const refs: OriginClaimSupportRef[] = [];

  if (seed.hasHeartMath7Primary) refs.push(ocRef("heart.math7.primary"));
  if (seed.hasEvidenceSignals) refs.push(ocRef("evidence.signals"));

  for (const id of seed.candidateIds || []) {
    refs.push(ocRef(`candidates[${id}]`));
  }

  for (const frId of seed.deepRootFunctionalRootIds || []) {
    refs.push(ocRef(`deepRoot.functionalRoots[${frId}]`));
  }

  return { claimId, refs: uniqSorted(refs) };
}
