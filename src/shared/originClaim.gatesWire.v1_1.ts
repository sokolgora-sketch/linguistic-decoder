/**
 * OriginClaim v1.1 — gated inclusion (feature-flagged)
 *
 * Default behavior: NO-OP (returns candidates unchanged).
 * Enable with: ORIGIN_CLAIM_GATES_V1_1=1
 *
 * Why:
 * - lets us merge wiring safely without changing gold fixtures yet
 * - later we flip the flag + intentionally update gold
 */

import type { OriginClaimCandidateV1 } from "./originClaim.v1";
import {
  gateOriginClaimCandidateV1_1,
  compareOriginClaimCandidatesV1_1,
} from "./originClaim.gates.v1_1";
import { ORIGIN_CLAIM_GATES_DEFAULT_V1_1, toGateCandidateV1_1 } from "./originClaim.gatesBridge.v1_1";

function isEnabled(): boolean {
  return process.env.ORIGIN_CLAIM_GATES_V1_1 === "1";
}

function getSupport(c: any): { positives: number; negatives: number } {
  // Prefer explicit fields if present (we keep fallbacks to avoid tight coupling).
  const pos =
    c?.support?.positives ??
    c?.supportVector?.positives ??
    c?.signals?.positives ??
    0;

  const neg =
    c?.support?.negatives ??
    c?.supportVector?.negatives ??
    c?.signals?.negatives ??
    0;

  return {
    positives: Number.isFinite(pos) ? pos : 0,
    negatives: Number.isFinite(neg) ? neg : 0,
  };
}

/**
 * Apply v1.1 gates + stable ordering.
 * When disabled, returns candidates unchanged.
 */
export function maybeApplyOriginClaimGatesV1_1(
  candidates: OriginClaimCandidateV1[],
): OriginClaimCandidateV1[] {
  if (!isEnabled()) return candidates;

  const cfg = ORIGIN_CLAIM_GATES_DEFAULT_V1_1;

  const passing: OriginClaimCandidateV1[] = [];

  for (const cand of candidates) {
    const support = getSupport(cand as any);
    const gateCand = toGateCandidateV1_1(cand as any, support);
    const verdict = gateOriginClaimCandidateV1_1(gateCand, cfg);

    if (verdict.include) passing.push(cand);
  }

  // Stable ordering (language then form, per v1.1 comparator)
  passing.sort((a: any, b: any) => {
    const ga = toGateCandidateV1_1(a, getSupport(a));
    const gb = toGateCandidateV1_1(b, getSupport(b));
    return compareOriginClaimCandidatesV1_1(ga, gb);
  });

  return passing;
}
