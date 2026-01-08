// src/engine/originClaim.builder.v1.ts
//
// Origin Claim Protocol — V1 (STUB)
// This file intentionally contains NO inference logic.
// It exists to wire the contract honestly before claims are implemented.

import type { AnalyzeWordResultV1 } from "@/shared/analysisResult.v1";
import type { OriginClaimV1 } from "@/shared/originClaim.v1";

export function buildOriginClaimV1(result: AnalyzeWordResultV1): OriginClaimV1 {
    const inputs =
    (result as any).inputs ??
    (result as any).request ??
    (result as any).evidence?.request ??
    null;

  const word = inputs?.word ?? (result as any).word ?? "";
  const mode = inputs?.mode ?? (result as any).mode ?? "strict";
  const alphabet = inputs?.alphabet ?? (result as any).alphabet ?? "auto";

  return {
    version: "v1",

    // Protocol rule: never a single absolute winner
    policy: "no_single_winner",

    // Stub: no candidates asserted yet
    candidates: [],

    meta: {
      engineVersion: (result as any).meta?.engineVersion ?? (result as any).engineVersion ?? "unknown",
      generatedAt: new Date().toISOString(),
      inputs: { word, mode, alphabet },
    },

    // Summary shape is contract-defined in src/shared/originClaim.v1.ts
    summary: {
      confidence: "insufficient_evidence",
      note:
        "No passing candidates with sufficient computed support in the current result layers.",
    },
  };
}
