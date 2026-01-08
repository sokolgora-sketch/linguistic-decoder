/**
 * OriginClaim v1.1 — Gates wiring bridge
 * Purpose: convert the existing OriginClaim builder's candidate + computed support
 * into the minimal shape required by the v1.1 gates module.
 *
 * Important: This file must remain deterministic and contract-safe.
 */

import type { OriginClaimCandidateV1 } from "./originClaim.v1";
import type { OriginClaimGateConfigV1_1, OriginClaimCandidateLikeV1_1 } from "./originClaim.gates.v1_1";

/**
 * Default gate config (v1.1)
 * - Keep conservative; we'll tune after we observe real candidate distributions.
 */
export const ORIGIN_CLAIM_GATES_DEFAULT_V1_1: OriginClaimGateConfigV1_1 = {
  minPositives: 1,
  maxNegatives: 0,
};

/**
 * The OriginClaim builder already computes positives/negatives (or can).
 * We pass them through here, along with the candidate's decomposition + vowel path.
 */
export type OriginClaimSupportForGatesV1_1 = {
  positives: number;
  negatives: number;
};

/**
 * Normalize decomposition + vowelPath into the gate candidate shape.
 * (We accept a few legacy field spellings to keep wiring low-risk.)
 */
export function toGateCandidateV1_1(
  cand: OriginClaimCandidateV1,
  support: OriginClaimSupportForGatesV1_1,
): OriginClaimCandidateLikeV1_1 {
  const decomposition =
    (cand as any).decomposition ??
    (cand as any).morphology?.parts ??
    (cand as any).morph?.parts ??
    [];

  const vowelPath =
    (cand as any).vowelPath ??
    (cand as any).vowel_path ??
    (cand as any).voices?.voiceSequence ??
    [];

  return {
    language: String((cand as any).language ?? (cand as any).lang ?? ""),
    form: String((cand as any).form ?? ""),
    decomposition: Array.isArray(decomposition) ? decomposition : [],
    vowelPath: Array.isArray(vowelPath) ? vowelPath : [],
    support: {
      positives: Number.isFinite(support.positives) ? support.positives : 0,
      negatives: Number.isFinite(support.negatives) ? support.negatives : 0,
    },
  };
}
