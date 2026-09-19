import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import manifest from "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.manifest.json";
import {
  importReviewedLewisShortEntryAttestationsV1,
  type ReviewedLewisShortEntryAttestationManifestV1,
} from "../scripts/openInstrument/reviewedLewisShortEntryAttestationImport.v1";
import {
  buildTargetBoundFunctionalCorrespondenceV1,
  type TargetBoundFunctionalCorrespondenceTargetInputV1,
} from "../src/shared/openInstrument/targetBoundFunctionalCorrespondence.v1";
import {
  targetBoundReviewedCorrespondenceDecisionRegistryV2,
} from "../src/shared/openInstrument/targetBoundReviewedCorrespondenceDecisionRegistry.v2";
import {
  projectTargetBoundReviewedCorrespondenceEvidenceV1,
} from "../src/shared/openInstrument/targetBoundReviewedCorrespondenceEvidenceProjection.v1";
import type { SourceEntryAttestationV1 } from "../src/shared/openInstrument/sourceEntryAttestation.v1";
import { targetBlindReviewedSourceAttestationRegistryV1 } from "../src/shared/openInstrument/targetBlindReviewedSourceAttestationRegistry.v1";

const fixturePath = join(
  __dirname,
  "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.xml",
);
const sourceSlice = readFileSync(fixturePath, "utf8");
const sourceSliceSha256 = createHash("sha256").update(sourceSlice, "utf8").digest("hex");
const entryManifest = manifest as unknown as ReviewedLewisShortEntryAttestationManifestV1;

function sourceFixture(): {
  attestation: SourceEntryAttestationV1;
  review: (typeof targetBlindReviewedSourceAttestationRegistryV1)[number];
} {
  const imported = importReviewedLewisShortEntryAttestationsV1(sourceSlice, {
    ...entryManifest,
    sourceSliceSha256,
  });
  if (imported.status !== "IMPORTED") throw new Error("Expected source attestations");
  const attestation = imported.attestations.find((candidate) => candidate.sourceForm === "as");
  const review = targetBlindReviewedSourceAttestationRegistryV1.find(
    (candidate) => candidate.attestationId === attestation?.attestationId,
  );
  if (!attestation || !review) throw new Error("Expected AS source fixture");
  return { attestation, review };
}

function packageFixture(input: TargetBoundFunctionalCorrespondenceTargetInputV1 = {
  analysisId: "analysis:flas:logic-structural:flas:as:peel_left_consonant_frame+peel_left_consonant_frame",
  targetWord: "flas",
  targetSense: { id: "user_sense_i_speak_i_talk", label: "I speak / I talk" },
  structuralHypothesisId: "logic-structural:flas:as:peel_left_consonant_frame+peel_left_consonant_frame",
  embryo: "AS",
  voicePath: ["A"],
  engineVersion: "2025-11-14-core-6",
  structuralHypothesisVersion: "z-zero.structural-hypothesis.v0_1",
}) {
  const { attestation, review } = sourceFixture();
  const result = buildTargetBoundFunctionalCorrespondenceV1(input, attestation, review);
  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return {
    packageValue: result.package,
    attestationValue: attestation,
    sourceReviewValue: review,
  };
}

describe("target-bound reviewed correspondence evidence projection v1", () => {
  it("projects all persisted FLAS to AS reviews without changing verdict totals", () => {
    const fixture = packageFixture();
    const registryBefore = JSON.stringify(targetBoundReviewedCorrespondenceDecisionRegistryV2);
    const projected = targetBoundReviewedCorrespondenceDecisionRegistryV2.map((decision) =>
      projectTargetBoundReviewedCorrespondenceEvidenceV1({
        decision,
        ...fixture,
      }),
    );
    const evidence = projected.map((result) => {
      expect(result.ok).toBe(true);
      if (!result.ok || result.evidence === null) throw new Error("Expected evidence");
      return result.evidence;
    });
    const verdicts = evidence.map((record) => record.decision.verdict);

    expect(evidence).toHaveLength(12);
    expect(verdicts.filter((verdict) => verdict === "SUPPORTED")).toHaveLength(0);
    expect(verdicts.filter((verdict) => verdict === "PARTIALLY_SUPPORTED")).toHaveLength(0);
    expect(verdicts.filter((verdict) => verdict === "UNSUPPORTED")).toHaveLength(9);
    expect(verdicts.filter((verdict) => verdict === "UNKNOWN")).toHaveLength(2);
    expect(verdicts.filter((verdict) => verdict === "NULL")).toHaveLength(1);
    expect(JSON.stringify(targetBoundReviewedCorrespondenceDecisionRegistryV2)).toBe(registryBefore);
  });

  it("preserves every target, source, comparison, decision, and authority field", () => {
    const fixture = packageFixture();
    const sourceDecision = targetBoundReviewedCorrespondenceDecisionRegistryV2[1];
    const result = projectTargetBoundReviewedCorrespondenceEvidenceV1({
      decision: sourceDecision,
      ...fixture,
    });
    expect(result.ok).toBe(true);
    if (!result.ok || result.evidence === null) throw new Error("Expected evidence");

    expect(result.evidence.target).toEqual({
      targetInputFingerprint: fixture.packageValue.targetInputFingerprint,
      targetWord: "flas",
      targetSense: { id: "user_sense_i_speak_i_talk", label: "I speak / I talk" },
      structuralHypothesisId: "logic-structural:flas:as:peel_left_consonant_frame+peel_left_consonant_frame",
      embryo: "AS",
      voicePath: ["A"],
      targetSenseBinding: "TARGET_SENSE_PRESENT_USER_PROVIDED",
    });
    expect(result.evidence.source).toMatchObject({
      sourceAttestationId: sourceDecision.sourceAttestationId,
      sourceAttestationFingerprint: sourceDecision.sourceAttestationFingerprint,
      sourceReviewFingerprint: sourceDecision.sourceReviewFingerprint,
      sourceEntryId: "n3855",
      sourceSenseId: "n3855.1",
      sourceSenseLocator: sourceDecision.sourceSenseLocator,
      sourceSenseTextHash: sourceDecision.sourceSenseTextHash,
    });
    expect(result.evidence.comparison).toEqual({
      targetBoundPackageFingerprint: sourceDecision.targetBoundPackageFingerprint,
      comparisonUnitId: sourceDecision.comparisonUnitId,
      comparisonUnitFingerprint: sourceDecision.comparisonUnitFingerprint,
    });
    expect(result.evidence.decision).toEqual({
      reviewStatus: "REVIEWED",
      verdict: "UNSUPPORTED",
      relationship: "NONE",
      rationale: {
        text: sourceDecision.review.rationale.text,
        limitations: [],
      },
      reasonCodes: ["REVIEWED_NON_SUPPORT"],
      reviewer: "DF / Sokol Gora",
      reviewerKind: "HUMAN",
      reviewedAt: "2026-09-19",
      decisionFingerprint: sourceDecision.decisionFingerprint,
    });
    expect(result.evidence.authority).toEqual({
      claimBoundary: "TARGET_BOUND_CORRESPONDENCE_REVIEW_ONLY",
      functionalAcceptance: "NOT_AUTHORIZED",
      historicalRelation: "NOT_CLAIMED",
      winnerClaim: "NOT_CLAIMED",
      productionMembership: "NOT_AUTHORIZED",
      runtimeAuthorization: "NOT_AUTHORIZED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
  });

  it("returns explicit absence for a missing decision", () => {
    const fixture = packageFixture();
    expect(
      projectTargetBoundReviewedCorrespondenceEvidenceV1({
        decision: null,
        ...fixture,
      }),
    ).toEqual({ ok: true, evidence: null });
  });

  it.each<[string, (value: Record<string, unknown>) => void, string]>([
    ["target fingerprint", (value: Record<string, unknown>) => { value.targetInputFingerprint = "0".repeat(64); }, "TARGET_INPUT_FINGERPRINT_MISMATCH"],
    ["package fingerprint", (value: Record<string, unknown>) => { value.targetBoundPackageFingerprint = "0".repeat(64); }, "COMPARISON_UNIT_BINDING_MISMATCH"],
    ["source attestation fingerprint", (value: Record<string, unknown>) => { value.sourceAttestationFingerprint = "0".repeat(64); }, "SOURCE_ATTESTATION_FINGERPRINT_MISMATCH"],
    ["source review fingerprint", (value: Record<string, unknown>) => { value.sourceReviewFingerprint = "0".repeat(64); }, "SOURCE_REVIEW_FINGERPRINT_MISMATCH"],
    ["comparison unit id", (value: Record<string, unknown>) => { value.comparisonUnitId = "stale-comparison-unit"; }, "COMPARISON_UNIT_NOT_FOUND"],
    ["decision fingerprint", (value: Record<string, unknown>) => { value.decisionFingerprint = "0".repeat(64); }, "DECISION_FINGERPRINT_MISMATCH"],
  ])("fails closed for stale or mismatched %s", (_label, mutate, expectedReason) => {
    const fixture = packageFixture();
    const decision = JSON.parse(JSON.stringify(targetBoundReviewedCorrespondenceDecisionRegistryV2[0])) as Record<string, unknown>;
    mutate(decision);
    const result = projectTargetBoundReviewedCorrespondenceEvidenceV1({
      decision,
      ...fixture,
    });
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("Expected projection rejection");
    expect(result.reasonCodes).toContain(expectedReason);
  });

  it("rejects malformed and non-reviewed decisions", () => {
    const fixture = packageFixture();
    expect(
      projectTargetBoundReviewedCorrespondenceEvidenceV1(undefined),
    ).toMatchObject({ ok: false, reasonCodes: ["INPUT_NOT_OBJECT"] });
    expect(
      projectTargetBoundReviewedCorrespondenceEvidenceV1({
        decision: { malformed: true },
        ...fixture,
      }),
    ).toMatchObject({ ok: false });

    const notReviewed = JSON.parse(JSON.stringify(targetBoundReviewedCorrespondenceDecisionRegistryV2[0])) as Record<string, unknown>;
    notReviewed.review = {
      reviewStatus: "NOT_REVIEWED",
      verdict: null,
      reviewer: null,
      reviewerKind: null,
      reviewedAt: null,
      rationale: null,
      reasonCodes: [],
    };
    expect(
      projectTargetBoundReviewedCorrespondenceEvidenceV1({
        decision: notReviewed,
        ...fixture,
      }),
    ).toMatchObject({ ok: false });
  });

  it("is deterministic, deeply immutable, and does not mutate inputs", () => {
    const fixture = packageFixture();
    const decision = targetBoundReviewedCorrespondenceDecisionRegistryV2[0];
    const first = projectTargetBoundReviewedCorrespondenceEvidenceV1({
      decision,
      ...fixture,
    });
    const second = projectTargetBoundReviewedCorrespondenceEvidenceV1({
      decision,
      ...fixture,
    });
    expect(first).toEqual(second);
    if (!first.ok || first.evidence === null) throw new Error("Expected evidence");
    expect(Object.isFrozen(first.evidence)).toBe(true);
    expect(Object.isFrozen(first.evidence.target)).toBe(true);
    expect(Object.isFrozen(first.evidence.target.targetSense)).toBe(true);
    expect(Object.isFrozen(first.evidence.target.voicePath)).toBe(true);
    expect(Object.isFrozen(first.evidence.source)).toBe(true);
    expect(Object.isFrozen(first.evidence.comparison)).toBe(true);
    expect(Object.isFrozen(first.evidence.decision)).toBe(true);
    expect(Object.isFrozen(first.evidence.decision.rationale)).toBe(true);
    expect(Object.isFrozen(first.evidence.decision.reasonCodes)).toBe(true);
    expect(Object.isFrozen(first.evidence.authority)).toBe(true);
    expect(Object.isFrozen(decision)).toBe(true);
    expect(Object.isFrozen(fixture.packageValue)).toBe(true);
  });
});
