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
  fingerprintTargetBoundCorrespondenceDecisionRuleV1,
  TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1,
  validateTargetBoundCorrespondenceDecisionRuleV1,
  type TargetBoundCorrespondenceDecisionRuleV1,
  type TargetBoundCorrespondenceReviewV1,
} from "../src/shared/openInstrument/targetBoundCorrespondenceDecisionRule.v1";
import type { SourceEntryAttestationV1 } from "../src/shared/openInstrument/sourceEntryAttestation.v1";
import {
  buildTargetBoundFunctionalCorrespondenceV1,
  type TargetBoundFunctionalCorrespondenceTargetInputV1,
} from "../src/shared/openInstrument/targetBoundFunctionalCorrespondence.v1";
import {
  targetBlindReviewedSourceAttestationRegistryV1,
} from "../src/shared/openInstrument/targetBlindReviewedSourceAttestationRegistry.v1";

const fixturePath = join(
  __dirname,
  "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.xml",
);
const sourceSlice = readFileSync(fixturePath, "utf8");
const sourceSliceSha256 = createHash("sha256")
  .update(sourceSlice, "utf8")
  .digest("hex");
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
  targetSense: TargetBoundFunctionalCorrespondenceTargetInputV1["targetSense"] = null,
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

function packageFor(
  sourceForm: string,
  input = targetInput(),
) {
  const attestation = attestations().find(
    (candidate) => candidate.sourceForm === sourceForm,
  );
  const review = targetBlindReviewedSourceAttestationRegistryV1.find(
    (candidate) => candidate.attestationId === attestation?.attestationId,
  );
  if (!attestation || !review) throw new Error(`Missing fixture for ${sourceForm}`);
  const result = buildTargetBoundFunctionalCorrespondenceV1(input, attestation, review);
  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return { package: result.package, attestation, review };
}

function reviewFor(
  verdict: "SUPPORTED" | "PARTIALLY_SUPPORTED" | "UNSUPPORTED" | "UNKNOWN" | "NULL",
  targetSensePresent: boolean,
): TargetBoundCorrespondenceReviewV1 {
  const reasonCode = {
    SUPPORTED: "REVIEWED_SUPPORT",
    PARTIALLY_SUPPORTED: "REVIEWED_PARTIAL_SUPPORT",
    UNSUPPORTED: "REVIEWED_NON_SUPPORT",
    UNKNOWN: targetSensePresent
      ? "INSUFFICIENT_AUTHORIZED_INFORMATION"
      : "TARGET_SENSE_UNBOUND",
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
    reviewedAt: "2026-09-18",
    rationale: {
      relationship,
      limitations: verdict === "SUPPORTED" ? [] : ["fixture-bound-review"],
      text: `Fixture rationale for ${verdict}.`,
    },
    reasonCodes: [reasonCode],
  };
}

function decisionFor(
  sourceForm: string,
  review: TargetBoundCorrespondenceReviewV1,
  input = targetInput({ id: "fixture-sense", label: "fixture target sense" }),
) {
  const fixture = packageFor(sourceForm, input);
  const unitId = fixture.package.comparisonUnits[0]?.comparisonUnitId;
  if (!unitId) throw new Error("Missing comparison unit");
  const result = buildTargetBoundCorrespondenceDecisionRuleV1(
    fixture.package,
    fixture.attestation,
    fixture.review,
    unitId,
    review,
  );
  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return { ...fixture, decision: result.decision };
}

function decisionWithReview(
  decision: TargetBoundCorrespondenceDecisionRuleV1,
  review: TargetBoundCorrespondenceReviewV1,
): TargetBoundCorrespondenceDecisionRuleV1 {
  const candidate = { ...decision, review };
  return {
    ...candidate,
    decisionFingerprint: fingerprintTargetBoundCorrespondenceDecisionRuleV1(candidate),
  };
}

describe("reviewed target-bound correspondence decision rule v1", () => {
  it("creates a one-unit not-reviewed envelope without selecting source entries or senses", () => {
    const fixture = packageFor("as");
    const unitId = fixture.package.comparisonUnits[0]?.comparisonUnitId;
    if (!unitId) throw new Error("Missing comparison unit");
    const result = buildTargetBoundCorrespondenceDecisionRuleV1(
      fixture.package,
      fixture.attestation,
      fixture.review,
      unitId,
    );

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.decision.schemaVersion).toBe(
      TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1,
    );
    expect(result.decision.review.reviewStatus).toBe("NOT_REVIEWED");
    expect(result.decision.targetSenseBinding).toBe("TARGET_SENSE_UNBOUND");
    expect(fixture.package.selectedEntryId).toBeNull();
    expect(fixture.package.selectedSenseIds).toEqual([]);
    expect(result.decision).not.toHaveProperty("semanticBridge");
  });

  it("validates every synthetic verdict with explicit bounded rationale", () => {
    for (const verdict of ["SUPPORTED", "PARTIALLY_SUPPORTED", "UNSUPPORTED", "UNKNOWN", "NULL"] as const) {
      const fixture = decisionFor("as", reviewFor(verdict, true));
      const result = validateTargetBoundCorrespondenceDecisionRuleV1(
        fixture.decision,
        fixture.package,
        fixture.attestation,
        fixture.review,
      );
      expect(result).toMatchObject({ ok: true });
      expect(fixture.decision.review.verdict).toBe(verdict);
    }
  });

  it("preserves substantive rationale text and rejects missing or non-exact text", () => {
    const fixture = decisionFor("as", reviewFor("UNSUPPORTED", true));
    expect(fixture.decision.review.rationale).toEqual({
      relationship: "NONE",
      limitations: ["fixture-bound-review"],
      text: "Fixture rationale for UNSUPPORTED.",
    });

    for (const rationale of [
      { relationship: "NONE", limitations: ["fixture-bound-review"] },
      { relationship: "NONE", limitations: ["fixture-bound-review"], text: "" },
      { relationship: "NONE", limitations: ["fixture-bound-review"], text: "   " },
      { relationship: "NONE", limitations: ["fixture-bound-review"], text: "e\u0301" },
    ]) {
      const result = buildTargetBoundCorrespondenceDecisionRuleV1(
        fixture.package,
        fixture.attestation,
        fixture.review,
        fixture.package.comparisonUnits[0]!.comparisonUnitId,
        {
          ...reviewFor("UNSUPPORTED", true),
          rationale,
        } as unknown as TargetBoundCorrespondenceReviewV1,
      );
      expect(result).toEqual({
        ok: false,
        reasonCodes: expect.arrayContaining(["RATIONALE_INVALID"]),
      });
    }
  });

  it("accepts the authorized rationale key and rejects unknown rationale fields", () => {
    const fixture = decisionFor("as", reviewFor("SUPPORTED", true));
    const extraFieldReview = {
      ...fixture.decision.review,
      rationale: {
        ...fixture.decision.review.rationale,
        extra: "not authorized",
      },
    } as unknown as TargetBoundCorrespondenceReviewV1;
    expect(buildTargetBoundCorrespondenceDecisionRuleV1(
      fixture.package,
      fixture.attestation,
      fixture.review,
      fixture.package.comparisonUnits[0]!.comparisonUnitId,
      extraFieldReview,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["RATIONALE_INVALID"]),
    });
  });

  it("distinguishes target-sense-unbound review from not-reviewed state", () => {
    const fixture = packageFor("as");
    const unitId = fixture.package.comparisonUnits[0]?.comparisonUnitId;
    if (!unitId) throw new Error("Missing comparison unit");
    const result = buildTargetBoundCorrespondenceDecisionRuleV1(
      fixture.package,
      fixture.attestation,
      fixture.review,
      unitId,
      reviewFor("UNKNOWN", false),
    );

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.decision.review.reviewStatus).toBe("REVIEWED");
    expect(result.decision.review.verdict).toBe("UNKNOWN");
    expect(result.decision.review.reasonCodes).toEqual(["TARGET_SENSE_UNBOUND"]);
  });

  it("rejects positive verdicts without an exact user-provided target sense", () => {
    const fixture = packageFor("as");
    const unitId = fixture.package.comparisonUnits[0]?.comparisonUnitId;
    if (!unitId) throw new Error("Missing comparison unit");
    const result = buildTargetBoundCorrespondenceDecisionRuleV1(
      fixture.package,
      fixture.attestation,
      fixture.review,
      unitId,
      reviewFor("SUPPORTED", false),
    );

    expect(result).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["TARGET_SENSE_REQUIRED_FOR_POSITIVE_VERDICT"]),
    });
  });

  it("binds source, target, profile, and decision fingerprints", () => {
    const fixture = decisionFor("as", reviewFor("SUPPORTED", true));
    const valid = validateTargetBoundCorrespondenceDecisionRuleV1(
      fixture.decision,
      fixture.package,
      fixture.attestation,
      fixture.review,
    );
    expect(valid).toMatchObject({ ok: true });
    expect(fingerprintTargetBoundCorrespondenceDecisionRuleV1(fixture.decision)).toBe(
      fixture.decision.decisionFingerprint,
    );

    const changedRationale = decisionWithReview(fixture.decision, {
      ...fixture.decision.review,
      rationale: {
        ...fixture.decision.review.rationale,
        text: "A different substantive rationale.",
      },
    });
    expect(changedRationale.decisionFingerprint).not.toBe(
      fixture.decision.decisionFingerprint,
    );
    expect(fingerprintTargetBoundCorrespondenceDecisionRuleV1(changedRationale)).toBe(
      changedRationale.decisionFingerprint,
    );
    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      { ...fixture.decision, review: changedRationale.review },
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["DECISION_FINGERPRINT_MISMATCH"]),
    });

    const changedDecision = {
      ...fixture.decision,
      sourceSenseTextHash: "0".repeat(64),
    };
    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      changedDecision,
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["SOURCE_SENSE_TEXT_HASH_MISMATCH"]),
    });

    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      { ...fixture.decision, sourceAttestationFingerprint: "0".repeat(64) },
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["SOURCE_ATTESTATION_FINGERPRINT_MISMATCH"]),
    });

    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      { ...fixture.decision, sourceEntryId: "wrong-entry" },
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["SOURCE_ENTRY_ID_MISMATCH"]),
    });

    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      {
        ...fixture.decision,
        review: { ...fixture.decision.review, reviewer: null },
      },
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["REVIEWER_REQUIRED"]),
    });

    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      {
        ...fixture.decision,
        review: { ...fixture.decision.review, reviewedAt: "not-a-date" },
      },
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["REVIEWED_AT_INVALID"]),
    });

    const changedPackage = {
      ...fixture.package,
      targetInput: { ...fixture.package.targetInput, targetWord: "changed-target" },
    };
    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      fixture.decision,
      changedPackage,
      fixture.attestation,
      fixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["TARGET_BOUND_PACKAGE_INVALID"]),
    });
  });

  it("rejects selection, authority, provider, and target-semantic fields", () => {
    const fixture = decisionFor("as", reviewFor("SUPPORTED", true));
    for (const { fields, reasonCode } of [
      { fields: { winner: "as" }, reasonCode: "UNEXPECTED_FIELD_PRESENT" },
      { fields: { runtimeAuthorization: "AUTHORIZED" }, reasonCode: "FORBIDDEN_AUTHORITY_FIELD_PRESENT" },
      { fields: { functionalAcceptance: "ACCEPTED" }, reasonCode: "FORBIDDEN_AUTHORITY_FIELD_PRESENT" },
      { fields: { historicalRelation: "CLAIMED" }, reasonCode: "FORBIDDEN_AUTHORITY_FIELD_PRESENT" },
      { fields: { selectedEntryId: "n3855" }, reasonCode: "UNEXPECTED_FIELD_PRESENT" },
      { fields: { selectedSenseId: "sense-1" }, reasonCode: "UNEXPECTED_FIELD_PRESENT" },
      { fields: { targetMeaning: "meaning" }, reasonCode: "UNEXPECTED_FIELD_PRESENT" },
      { fields: { provider: "model" }, reasonCode: "UNEXPECTED_FIELD_PRESENT" },
      { fields: { review: { ...fixture.decision.review, reviewerKind: "MODEL" } }, reasonCode: "REVIEWER_KIND_INVALID" },
    ]) {
      expect(validateTargetBoundCorrespondenceDecisionRuleV1(
        { ...fixture.decision, ...fields },
        fixture.package,
        fixture.attestation,
        fixture.review,
      )).toEqual({
        ok: false,
        reasonCodes: expect.arrayContaining([reasonCode]),
      });
    }
  });

  it("rejects reason codes that contradict the selected verdict", () => {
    const fixture = decisionFor("as", reviewFor("SUPPORTED", true));
    const contradictorySupport = decisionWithReview(fixture.decision, {
      ...fixture.decision.review,
      reasonCodes: ["REVIEWED_SUPPORT", "REVIEWED_NON_SUPPORT"],
    });
    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      contradictorySupport,
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["VERDICT_REASON_MISMATCH"]),
    });

    const contradictoryMaterial = decisionWithReview(fixture.decision, {
      ...fixture.decision.review,
      reasonCodes: ["REVIEWED_SUPPORT", "SOURCE_SENSE_MATERIAL_MISSING"],
    });
    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      contradictoryMaterial,
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["VERDICT_REASON_MISMATCH"]),
    });

    const unknown = decisionFor("as", reviewFor("UNKNOWN", true));
    const allowedMaterial = decisionWithReview(unknown.decision, {
      ...unknown.decision.review,
      reasonCodes: ["INSUFFICIENT_AUTHORIZED_INFORMATION", "SOURCE_SENSE_MATERIAL_MISSING"],
    });
    expect(validateTargetBoundCorrespondenceDecisionRuleV1(
      allowedMaterial,
      unknown.package,
      unknown.attestation,
      unknown.review,
    )).toMatchObject({ ok: true });
  });

  it("preserves the 63 zero-decision AS, IN, and IS compatibility units", () => {
    const fixtures = ["as", "in", "is"].map((sourceForm) => {
      const fixture = packageFor(sourceForm);
      const unitId = fixture.package.comparisonUnits[0]?.comparisonUnitId;
      if (!unitId) throw new Error(`Missing unit for ${sourceForm}`);
      const result = buildTargetBoundCorrespondenceDecisionRuleV1(
        fixture.package,
        fixture.attestation,
        fixture.review,
        unitId,
      );
      if (!result.ok) throw new Error(result.reasonCodes.join(","));
      return { fixture, decision: result.decision };
    });

    expect(fixtures.map(({ fixture }) => fixture.package.comparisonUnitCount)).toEqual([12, 26, 25]);
    expect(fixtures.every(({ decision }) => decision.review.reviewStatus === "NOT_REVIEWED")).toBe(true);
    expect(fixtures.reduce((count, { decision }) => count + (decision.review.reviewStatus === "REVIEWED" ? 1 : 0), 0)).toBe(0);
    expect(fixtures.every(({ fixture }) => fixture.package.selectedEntryId === null)).toBe(true);
    expect(fixtures.every(({ fixture }) => fixture.package.selectedSenseIds.length === 0)).toBe(true);
  });

  it("is deterministic and deeply immutable", () => {
    const first = decisionFor("as", reviewFor("PARTIALLY_SUPPORTED", true)).decision;
    const second = decisionFor("as", reviewFor("PARTIALLY_SUPPORTED", true)).decision;
    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.review)).toBe(true);
    expect(Object.isFrozen(first.review.rationale)).toBe(true);
    expect(Object.isFrozen(first.review.rationale.text)).toBe(true);
    expect(Object.isFrozen(first.doctrineVoicePath)).toBe(true);
  });
});
