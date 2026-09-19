import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import manifest from "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.manifest.json";
import {
  importReviewedLewisShortEntryAttestationsV1,
  type ReviewedLewisShortEntryAttestationManifestV1,
} from "../scripts/openInstrument/reviewedLewisShortEntryAttestationImport.v1";
import {
  buildTargetBoundCorrespondenceDecisionRuleV1,
  type TargetBoundCorrespondenceReviewV1,
} from "../src/shared/openInstrument/targetBoundCorrespondenceDecisionRule.v1";
import {
  buildTargetBoundCorrespondenceDecisionRuleV2,
  fingerprintTargetBoundCorrespondenceDecisionRuleV2,
  TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2,
  validateTargetBoundCorrespondenceDecisionRuleV2,
  type TargetBoundCorrespondenceDecisionRuleV2,
  type TargetBoundCorrespondenceReviewV2,
} from "../src/shared/openInstrument/targetBoundCorrespondenceDecisionRule.v2";
import type { SourceEntryAttestationV1 } from "../src/shared/openInstrument/sourceEntryAttestation.v1";
import {
  buildTargetBoundFunctionalCorrespondenceV1,
  type TargetBoundFunctionalCorrespondenceTargetInputV1,
} from "../src/shared/openInstrument/targetBoundFunctionalCorrespondence.v1";
import { targetBlindReviewedSourceAttestationRegistryV1 } from "../src/shared/openInstrument/targetBlindReviewedSourceAttestationRegistry.v1";

const fixturePath = join(
  __dirname,
  "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.xml",
);
const sourceSlice = readFileSync(fixturePath, "utf8");
const sourceSliceSha256 = createHash("sha256").update(sourceSlice, "utf8").digest("hex");
const entryManifest = manifest as unknown as ReviewedLewisShortEntryAttestationManifestV1;

function attestations(): readonly SourceEntryAttestationV1[] {
  const result = importReviewedLewisShortEntryAttestationsV1(sourceSlice, {
    ...entryManifest,
    sourceSliceSha256,
  });
  if (result.status !== "IMPORTED") throw new Error("Expected imported attestations");
  return result.attestations;
}

function targetInput(
  targetSense: TargetBoundFunctionalCorrespondenceTargetInputV1["targetSense"] = {
    id: "fixture-sense",
    label: "fixture target sense",
  },
): TargetBoundFunctionalCorrespondenceTargetInputV1 {
  return {
    analysisId: "analysis:synthetic:logic-structural:synthetic:as",
    targetWord: "synthetic-target",
    targetSense,
    structuralHypothesisId: "logic-structural:synthetic:as:fixture",
    embryo: "AS",
    voicePath: ["A"],
    engineVersion: "2025-11-14-core-6",
    structuralHypothesisVersion: "z-zero.structural-hypothesis.v0_1",
  };
}

function packageFor(input = targetInput()) {
  const attestation = attestations().find((candidate) => candidate.sourceForm === "as");
  const review = targetBlindReviewedSourceAttestationRegistryV1.find(
    (candidate) => candidate.attestationId === attestation?.attestationId,
  );
  if (!attestation || !review) throw new Error("Missing AS fixture");
  const result = buildTargetBoundFunctionalCorrespondenceV1(input, attestation, review);
  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return { package: result.package, attestation, review };
}

function reviewFor(
  verdict: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "UNSUPPORTED" | "UNKNOWN" | "NULL",
  text = `Fixture rationale for ${verdict}.`,
): TargetBoundCorrespondenceReviewV2 {
  const reasonCode = {
    SUPPORTED: "REVIEWED_SUPPORT",
    PARTIALLY_SUPPORTED: "REVIEWED_PARTIAL_SUPPORT",
    UNSUPPORTED: "REVIEWED_NON_SUPPORT",
    UNKNOWN: "INSUFFICIENT_AUTHORIZED_INFORMATION",
    NULL: "NO_DEFENSIBLE_COMPARISON",
  }[verdict] as const;
  const relationship = {
    SUPPORTED: "DIRECT",
    PARTIALLY_SUPPORTED: "PARTIAL",
    UNSUPPORTED: "NONE",
    UNKNOWN: "UNDETERMINED",
    NULL: "NOT_APPLICABLE",
  }[verdict] as const;
  return {
    reviewStatus: "REVIEWED",
    verdict,
    reviewer: "synthetic-test-reviewer",
    reviewerKind: "HUMAN",
    reviewedAt: "2026-09-19",
    rationale: {
      relationship,
      limitations: verdict === "SUPPORTED" ? [] : ["fixture-bound-review"],
      text,
    },
    reasonCodes: [reasonCode],
  };
}

function decisionFor(review: TargetBoundCorrespondenceReviewV2) {
  const fixture = packageFor();
  const unitId = fixture.package.comparisonUnits[0]?.comparisonUnitId;
  if (!unitId) throw new Error("Missing comparison unit");
  const result = buildTargetBoundCorrespondenceDecisionRuleV2(
    fixture.package,
    fixture.attestation,
    fixture.review,
    unitId,
    review,
  );
  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return { ...fixture, decision: result.decision };
}

describe("reviewed target-bound correspondence decision rule v2", () => {
  it("emits v2 reviewed decisions with required rationale text and preserves authority boundaries", () => {
    const fixture = decisionFor(reviewFor("UNSUPPORTED"));
    expect(fixture.decision.schemaVersion).toBe(TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2);
    expect(fixture.decision.review.rationale).toEqual({
      relationship: "NONE",
      limitations: ["fixture-bound-review"],
      text: "Fixture rationale for UNSUPPORTED.",
    });
    expect(fixture.decision.functionalAcceptance).toBe("NOT_AUTHORIZED");
    expect(fixture.decision.historicalRelation).toBe("NOT_CLAIMED");
    expect(fixture.decision.winnerClaim).toBe("NOT_CLAIMED");
    expect(fixture.decision.runtimeAuthorization).toBe("NOT_AUTHORIZED");
    expect(fixture.decision.userDecisionPosture).toBe("user_decides");
    expect(fixture.decision.noSingleWinner).toBe(true);
    expect(validateTargetBoundCorrespondenceDecisionRuleV2(
      fixture.decision,
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({ ok: true });
  });

  it("retains all existing verdict, relationship, and reason-code semantics", () => {
    for (const verdict of ["SUPPORTED", "PARTIALLY_SUPPORTED", "UNSUPPORTED", "UNKNOWN", "NULL"] as const) {
      const fixture = decisionFor(reviewFor(verdict));
      expect(fixture.decision.review.verdict).toBe(verdict);
      expect(validateTargetBoundCorrespondenceDecisionRuleV2(
        fixture.decision,
        fixture.package,
        fixture.attestation,
        fixture.review,
      )).toMatchObject({ ok: true });
    }
  });

  it("requires exact non-empty trimmed NFC rationale text and rejects the old v1 shape", () => {
    const fixture = packageFor();
    const unitId = fixture.package.comparisonUnits[0]!.comparisonUnitId;
    for (const text of ["", "   ", "e\u0301"]) {
      const result = buildTargetBoundCorrespondenceDecisionRuleV2(
        fixture.package,
        fixture.attestation,
        fixture.review,
        unitId,
        {
          ...reviewFor("UNSUPPORTED"),
          rationale: {
            ...reviewFor("UNSUPPORTED").rationale,
            text,
          },
        },
      );
      expect(result).toEqual({
        ok: false,
        reasonCodes: expect.arrayContaining(["RATIONALE_INVALID"]),
      });
    }

    const validRationale = reviewFor("UNSUPPORTED").rationale;
    const missingText = {
      ...reviewFor("UNSUPPORTED"),
      rationale: {
        relationship: validRationale.relationship,
        limitations: validRationale.limitations,
      },
    } as unknown as TargetBoundCorrespondenceReviewV2;
    const extraField = {
      ...reviewFor("UNSUPPORTED"),
      rationale: { ...validRationale, extra: "not authorized" },
    } as unknown as TargetBoundCorrespondenceReviewV2;
    for (const invalidReview of [missingText, extraField]) {
      expect(buildTargetBoundCorrespondenceDecisionRuleV2(
        fixture.package,
        fixture.attestation,
        fixture.review,
        unitId,
        invalidReview,
      )).toEqual({
        ok: false,
        reasonCodes: expect.arrayContaining(["RATIONALE_INVALID"]),
      });
    }

    const oldV1Review: TargetBoundCorrespondenceReviewV1 = {
      ...reviewFor("SUPPORTED"),
      rationale: {
        relationship: "DIRECT",
        limitations: [],
      },
    };
    const oldV1 = buildTargetBoundCorrespondenceDecisionRuleV1(
      fixture.package,
      fixture.attestation,
      fixture.review,
      unitId,
      oldV1Review,
    );
    if (!oldV1.ok) throw new Error(oldV1.reasonCodes.join(","));
    expect(validateTargetBoundCorrespondenceDecisionRuleV2(
      oldV1.decision,
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["SCHEMA_VERSION_INVALID"]),
    });
  });

  it("covers rationale text in the fingerprint and remains deterministic and immutable", () => {
    const first = decisionFor(reviewFor("PARTIALLY_SUPPORTED"));
    const second = decisionFor(reviewFor("PARTIALLY_SUPPORTED"));
    expect(first.decision).toEqual(second.decision);
    expect(fingerprintTargetBoundCorrespondenceDecisionRuleV2(first.decision)).toBe(
      first.decision.decisionFingerprint,
    );

    const changed = decisionFor(reviewFor("PARTIALLY_SUPPORTED", "A different substantive rationale."));
    expect(changed.decision.decisionFingerprint).not.toBe(first.decision.decisionFingerprint);
    expect(Object.isFrozen(changed.decision)).toBe(true);
    expect(Object.isFrozen(changed.decision.review)).toBe(true);
    expect(Object.isFrozen(changed.decision.review.rationale)).toBe(true);

    expect(validateTargetBoundCorrespondenceDecisionRuleV2(
      { ...first.decision, review: changed.decision.review },
      first.package,
      first.attestation,
      first.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["DECISION_FINGERPRINT_MISMATCH"]),
    });
  });

  it("keeps NOT_REVIEWED decisions without reviewed rationale", () => {
    const fixture = packageFor(targetInput(null));
    const unitId = fixture.package.comparisonUnits[0]!.comparisonUnitId;
    const result = buildTargetBoundCorrespondenceDecisionRuleV2(
      fixture.package,
      fixture.attestation,
      fixture.review,
      unitId,
    );
    expect(result).toMatchObject({ ok: true, decision: { review: { reviewStatus: "NOT_REVIEWED", rationale: null } } });
    if (!result.ok) return;
    expect(result.decision.schemaVersion).toBe(TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2);
  });
});
