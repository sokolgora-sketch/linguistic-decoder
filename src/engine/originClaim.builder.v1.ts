// src/engine/originClaim.builder.v1.ts
//
// Origin Claim Protocol — V1 (STUB)
// This file intentionally contains NO inference logic.
// It exists to wire the contract honestly before claims are implemented.

import type { AnalyzeWordResultV1 } from "@/shared/analysisResult.v1";
import type { OriginClaimV1 } from "@/shared/originClaim.v1";
import { normalizeCandidateRecord } from "@/shared/brain/candidateRecord.normalize.v0.1";
import { getSeedCandidateRecordsV0_1 } from "@/shared/brain/seedLexicon.v0.1";
import { maybeApplyOriginClaimGatesV1_1 } from "@/shared/originClaim.gatesWire.v1_1";

export function buildOriginClaimV1(result: AnalyzeWordResultV1): OriginClaimV1 {
    const inputs =
    (result as any).inputs ??
    (result as any).request ??
    (result as any).evidence?.request ??
    null;

  const word = inputs?.word ?? (result as any).word ?? "";
  const mode = inputs?.mode ?? (result as any).mode ?? "strict";
  const alphabet = inputs?.alphabet ?? (result as any).alphabet ?? "auto";
  const seedFallbackEnabled = !!(
  // 1) explicit function param (engine builder supports this)
  (inputs && typeof inputs === "object" &&
    (((inputs as any).brainCandidatesSeedFallback || (inputs as any).seedBrainCandidates))) ||
  // 2) flag carried on the result object itself
  ((result as any) && typeof (result as any) === "object" &&
    (((result as any).brainCandidatesSeedFallback || (result as any).seedBrainCandidates))) ||
  // 3) flag nested under result.inputs
  ((result as any)?.inputs && typeof (result as any).inputs === "object" &&
    ((((result as any).inputs as any).brainCandidatesSeedFallback || ((result as any).inputs as any).seedBrainCandidates)))
);
const policy = (result as any)?.originClaim?.policy;
  const gatesActive = policy?.gatesActive ?? false;

  let candidates: any[] = [];
  candidates = maybeApplyOriginClaimGatesV1_1(candidates, gatesActive);

  // BRAIN-0.1 — CandidateRecord side-channel (engine)
  // Additive only. Does NOT change stub candidates output.
  const rawCandidates: any[] = Array.isArray((result as any).candidates) ? ((result as any).candidates as any[]) : [];
    const brainCandidates: any[] = [];

    for (const c of rawCandidates) {
      const maybeRecord =
        (c && typeof c === "object" && ((c as any).brainCandidateRecord || (c as any).candidateRecord)) ||
        (c && typeof c === "object" && {
          v: (c as any).v,
          languageId: (c as any).languageId,
          languageName: (c as any).languageName ?? (c as any).language,
          form: (c as any).form,
          gloss: (c as any).gloss,
          roots: (c as any).roots,
          explains: (c as any).explains,
          opsUsed: (c as any).opsUsed,
          functionTag: (c as any).functionTag,
          source: (c as any).source,
        });

      const norm = normalizeCandidateRecord(maybeRecord);
      if (norm.ok) brainCandidates.push(norm.record);
    }

    // BRAIN-0.2 — Seed fallback (engine)
    // If nothing upstream provided a valid CandidateRecord, inject deterministic seed records.
    if (seedFallbackEnabled && !brainCandidates.length) {
      const seeds = getSeedCandidateRecordsV0_1(word);
      for (const s of seeds as any[]) {
        const norm = normalizeCandidateRecord(s);
        if (norm.ok) brainCandidates.push(norm.record);
      }
    }

    const originClaim: OriginClaimV1 = {
    version: "v1",

    // Protocol rule: never a single absolute winner
    policy: "no_single_winner",

    // Stub: no candidates asserted yet
    candidates: candidates,

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

    // BRAIN-0.1 — Attach brainCandidates (engine)
  // Only attach when present (snapshot-safe).
  if (Array.isArray(brainCandidates) && brainCandidates.length) {
    try {
      const meta = (originClaim as any).meta;
      const inputs = meta && typeof meta === "object" ? (meta as any).inputs : null;
      if (inputs && typeof inputs === "object" && !(inputs as any).brainCandidates) {
        (inputs as any).brainCandidates = brainCandidates;
      }
    } catch {
      // never throw from side-channel
    }
  }

  return originClaim;

}
