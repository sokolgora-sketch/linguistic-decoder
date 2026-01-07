// src/engine/originClaim.builder.v1.ts
//
// Origin Claim Protocol — V1 (STUB)
// This file intentionally contains NO inference logic.
// It exists to wire the contract honestly before claims are implemented.

import type { AnalyzeWordResultV1 } from "@/shared/analysisResult.v1";
import type { OriginClaimV1 } from "@/shared/originClaim.v1";

export function buildOriginClaimV1(_result: AnalyzeWordResultV1): OriginClaimV1 {
  return {
    version: "v1",

    // Protocol rule: never a single absolute winner
    policy: "no_single_winner",

    // Stub: no candidates asserted yet
    candidates: [],

    // Summary shape is contract-defined in src/shared/originClaim.v1.ts
    summary: {
      confidence: "insufficient_evidence",
      note:
        "Origin Claim Protocol v1 is wired but intentionally logic-free (no hypotheses emitted yet).",
    },
  };
}
