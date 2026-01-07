// src/shared/originClaim.builder.v1.ts
//
// Origin Claim Builder — V1 (STUB)
// IMPORTANT:
// - This file MUST remain logic-free until the protocol is finalized.
// - No inference, no ranking, no heuristics.
// - Always returns explicit "insufficient_evidence".

import type { AnalyzeWordResultV1 } from "./analysisResult.v1";
import type { OriginClaimV1 } from "./originClaim.v1";

export function buildOriginClaimV1(
  result: AnalyzeWordResultV1
): OriginClaimV1 {
  return {
    version: "v1",
    policy: "no_single_winner",

    candidates: [],

    summary: {
      confidence: "insufficient_evidence",
      note:
        "Origin analysis not yet computed. This result exposes the contract only.",
    },

    meta: {
      engineVersion: result.engineVersion,
      generatedAt: new Date().toISOString(),
    },
  };
}
