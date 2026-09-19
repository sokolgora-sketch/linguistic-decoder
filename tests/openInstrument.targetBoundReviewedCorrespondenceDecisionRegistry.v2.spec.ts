import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import manifest from "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.manifest.json";
import {
  importReviewedLewisShortEntryAttestationsV1,
  type ReviewedLewisShortEntryAttestationManifestV1,
} from "../scripts/openInstrument/reviewedLewisShortEntryAttestationImport.v1";
import {
  fingerprintTargetBoundCorrespondenceDecisionRuleV2,
  validateTargetBoundCorrespondenceDecisionRuleV2,
} from "../src/shared/openInstrument/targetBoundCorrespondenceDecisionRule.v2";
import {
  buildTargetBoundFunctionalCorrespondenceV1,
  type TargetBoundFunctionalCorrespondenceTargetInputV1,
} from "../src/shared/openInstrument/targetBoundFunctionalCorrespondence.v1";
import {
  targetBoundReviewedCorrespondenceDecisionRegistryV2,
  validateTargetBoundReviewedCorrespondenceDecisionRegistryV2,
} from "../src/shared/openInstrument/targetBoundReviewedCorrespondenceDecisionRegistry.v2";
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

function targetInput(
  overrides: Partial<TargetBoundFunctionalCorrespondenceTargetInputV1> = {},
): TargetBoundFunctionalCorrespondenceTargetInputV1 {
  return {
    analysisId: "analysis:flas:logic-structural:flas:as:peel_left_consonant_frame+peel_left_consonant_frame",
    targetWord: "flas",
    targetSense: { id: "user_sense_i_speak_i_talk", label: "I speak / I talk" },
    structuralHypothesisId: "logic-structural:flas:as:peel_left_consonant_frame+peel_left_consonant_frame",
    embryo: "AS",
    voicePath: ["A"],
    engineVersion: "2025-11-14-core-6",
    structuralHypothesisVersion: "z-zero.structural-hypothesis.v0_1",
    ...overrides,
  };
}

function packageFixture(input = targetInput()) {
  const { attestation, review } = sourceFixture();
  const result = buildTargetBoundFunctionalCorrespondenceV1(input, attestation, review);
  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return { package: result.package, attestation, review };
}

function cloneRegistry(): Array<Record<string, unknown>> {
  return JSON.parse(JSON.stringify(targetBoundReviewedCorrespondenceDecisionRegistryV2)) as Array<Record<string, unknown>>;
}

describe("target-bound reviewed correspondence decision registry v2", () => {
  it("persists exactly the approved FLAS to AS review shape and totals", () => {
    const verdicts = targetBoundReviewedCorrespondenceDecisionRegistryV2.map(
      (decision) => decision.review.verdict,
    );
    expect(targetBoundReviewedCorrespondenceDecisionRegistryV2).toHaveLength(12);
    expect(new Set(targetBoundReviewedCorrespondenceDecisionRegistryV2.map((decision) => decision.comparisonUnitId)).size).toBe(12);
    expect(verdicts.filter((verdict) => verdict === "SUPPORTED")).toHaveLength(0);
    expect(verdicts.filter((verdict) => verdict === "PARTIALLY_SUPPORTED")).toHaveLength(0);
    expect(verdicts.filter((verdict) => verdict === "UNSUPPORTED")).toHaveLength(9);
    expect(verdicts.filter((verdict) => verdict === "UNKNOWN")).toHaveLength(2);
    expect(verdicts.filter((verdict) => verdict === "NULL")).toHaveLength(1);
    expect(targetBoundReviewedCorrespondenceDecisionRegistryV2.every(
      (decision) => decision.review.reviewStatus === "REVIEWED" && decision.review.reviewerKind === "HUMAN",
    )).toBe(true);
    expect(new Set(targetBoundReviewedCorrespondenceDecisionRegistryV2.map((decision) => decision.review.reviewer))).toEqual(new Set(["DF / Sokol Gora"]));
    expect(new Set(targetBoundReviewedCorrespondenceDecisionRegistryV2.map((decision) => decision.review.reviewedAt))).toEqual(new Set(["2026-09-19"]));
    expect(targetBoundReviewedCorrespondenceDecisionRegistryV2.map((decision) => decision.review.rationale.text)).toEqual([
      "The cell contains grammatical, citation, and form material without sufficient standalone functional meaning to determine correspondence to the bound target sense.",
      "The source describes unity, a unit, and quantitative standards; these functions do not correspond to the bound target sense \"I speak / I talk\".",
      "The cell is a lexicographic structural marker without sufficient standalone semantic material for correspondence judgment.",
      "The source describes a coin, monetary value, and valuation functions; these do not correspond to the bound target sense.",
      "The cell is an incomplete continuation heading rather than a complete lexical meaning, so no defensible functional comparison can be made.",
      "The source describes possession-based valuation and personal worth rather than speaking or talking.",
      "Although the source mentions petitioning context, its attested functional center is deferential giving to a superior rather than speaking or talking.",
      "The source describes inheritance portions, ownership shares, and completeness rather than speaking or talking.",
      "The source describes measurement of spatial extent rather than speaking or talking.",
      "The source describes an acre and land-area measurement rather than speaking or talking.",
      "The source identifies a unit of length and does not functionally correspond to speaking or talking.",
      "The source describes weight, a pound, and numerical terminology rather than speaking or talking.",
    ]);
  });

  it("validates every persisted envelope and its exact identity bindings", () => {
    const fixture = packageFixture();
    expect(fixture.package.targetInputFingerprint).toBe(
      "2ff642a18d3c7ce62db2306b2085b747acbf082bf0d4364866e1004f58eb2a06",
    );
    expect(fixture.package.comparisonUnitCount).toBe(12);
    expect(fixture.package.sourceReview.attestationFingerprint).toBe(
      "223c2730656fbbfc774fc2febfa41f2d8b9abe491cd4c59e0ebbfcb8e63d6ae3",
    );
    expect(fixture.package.sourceReview.reviewFingerprint).toBe(
      "c3d9d65315c81c648d84a40e3cf3c31753f5a65d54e3a85b98a90d43a0cdbbe4",
    );
    expect(targetBoundReviewedCorrespondenceDecisionRegistryV2.every(
      (decision) => decision.targetBoundPackageFingerprint ===
        "913d7d0904399333d79d4f30efb5d4e1085592ef80af1037efb7b02a693901c9" &&
        decision.sourceEntryId === "n3855" &&
        decision.sourceAttestationFingerprint === fixture.package.sourceReview.attestationFingerprint &&
        decision.sourceReviewFingerprint === fixture.package.sourceReview.reviewFingerprint &&
        decision.targetInputFingerprint === fixture.package.targetInputFingerprint &&
        decision.targetSenseBinding === "TARGET_SENSE_PRESENT_USER_PROVIDED",
    )).toBe(true);
    expect(targetBoundReviewedCorrespondenceDecisionRegistryV2.every((decision) => {
      const result = validateTargetBoundCorrespondenceDecisionRuleV2(
        decision,
        fixture.package,
        fixture.attestation,
        fixture.review,
      );
      return result.ok && fingerprintTargetBoundCorrespondenceDecisionRuleV2(decision) === decision.decisionFingerprint;
    })).toBe(true);
    expect(validateTargetBoundReviewedCorrespondenceDecisionRegistryV2(
      targetBoundReviewedCorrespondenceDecisionRegistryV2,
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({ ok: true });
  });

  it("fingerprints rationale text and rejects a reused fingerprint", () => {
    const fixture = packageFixture();
    const original = targetBoundReviewedCorrespondenceDecisionRegistryV2[0];
    if (original.review.reviewStatus !== "REVIEWED") throw new Error("Expected reviewed decision");
    const changed = {
      ...original,
      review: {
        ...original.review,
        rationale: {
          ...original.review.rationale,
          text: `${original.review.rationale.text} Additional bounded note.`,
        },
      },
    } as typeof original;
    expect(fingerprintTargetBoundCorrespondenceDecisionRuleV2(changed)).not.toBe(original.decisionFingerprint);
    expect(validateTargetBoundCorrespondenceDecisionRuleV2(
      { ...changed, decisionFingerprint: original.decisionFingerprint },
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["DECISION_FINGERPRINT_MISMATCH"]),
    });
  });

  it("rejects identical and conflicting duplicate comparison-unit IDs", () => {
    const fixture = packageFixture();
    const identical = Object.freeze([
      ...targetBoundReviewedCorrespondenceDecisionRegistryV2,
      targetBoundReviewedCorrespondenceDecisionRegistryV2[0],
    ]);
    expect(validateTargetBoundReviewedCorrespondenceDecisionRegistryV2(
      identical,
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["DUPLICATE_COMPARISON_UNIT_ID"]),
    });

    const conflicting = cloneRegistry();
    conflicting.push({
      ...conflicting[0],
      decisionFingerprint: "0".repeat(64),
    });
    const conflictingResult = validateTargetBoundReviewedCorrespondenceDecisionRegistryV2(
      Object.freeze(conflicting),
      fixture.package,
      fixture.attestation,
      fixture.review,
    );
    expect(conflictingResult).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["CONFLICTING_COMPARISON_UNIT_ID"]),
    });
  });

  it("rejects stale target, source, package, and target-sense bindings", () => {
    const fixture = packageFixture();
    const staleTarget = cloneRegistry();
    staleTarget[0].targetInputFingerprint = "0".repeat(64);
    expect(validateTargetBoundReviewedCorrespondenceDecisionRegistryV2(
      Object.freeze(staleTarget),
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["TARGET_INPUT_FINGERPRINT_MISMATCH"]),
    });

    const staleSource = cloneRegistry();
    staleSource[0].sourceAttestationFingerprint = "0".repeat(64);
    expect(validateTargetBoundReviewedCorrespondenceDecisionRegistryV2(
      Object.freeze(staleSource),
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["SOURCE_ATTESTATION_FINGERPRINT_MISMATCH"]),
    });

    const stalePackage = cloneRegistry();
    stalePackage[0].targetBoundPackageFingerprint = "0".repeat(64);
    expect(validateTargetBoundReviewedCorrespondenceDecisionRegistryV2(
      Object.freeze(stalePackage),
      fixture.package,
      fixture.attestation,
      fixture.review,
    )).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["COMPARISON_UNIT_BINDING_MISMATCH"]),
    });

    const changedTarget = packageFixture(targetInput({
      targetSense: { id: "sense:movement", label: "movement" },
    }));
    expect(validateTargetBoundReviewedCorrespondenceDecisionRegistryV2(
      targetBoundReviewedCorrespondenceDecisionRegistryV2,
      changedTarget.package,
      changedTarget.attestation,
      changedTarget.review,
    )).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["COMPARISON_UNIT_NOT_FOUND"]),
    });
  });

  it("is deeply immutable and preserves every authority boundary", () => {
    expect(Object.isFrozen(targetBoundReviewedCorrespondenceDecisionRegistryV2)).toBe(true);
    for (const decision of targetBoundReviewedCorrespondenceDecisionRegistryV2) {
      expect(Object.isFrozen(decision)).toBe(true);
      expect(Object.isFrozen(decision.review)).toBe(true);
      expect(Object.isFrozen(decision.review.rationale)).toBe(true);
      expect(Object.isFrozen(decision.review.rationale.limitations)).toBe(true);
      expect(Object.isFrozen(decision.review.reasonCodes)).toBe(true);
      expect(Object.isFrozen(decision.doctrineVoicePath)).toBe(true);
      expect(decision.functionalAcceptance).toBe("NOT_AUTHORIZED");
      expect(decision.historicalRelation).toBe("NOT_CLAIMED");
      expect(decision.winnerClaim).toBe("NOT_CLAIMED");
      expect(decision.runtimeAuthorization).toBe("NOT_AUTHORIZED");
      expect(decision.userDecisionPosture).toBe("user_decides");
      expect(decision.noSingleWinner).toBe(true);
      expect(decision).not.toHaveProperty("selectedEntryId");
      expect(decision).not.toHaveProperty("selectedSenseId");
      expect(decision).not.toHaveProperty("gate3Authorization");
      expect(decision).not.toHaveProperty("provider");
      expect(decision).not.toHaveProperty("historicalOrigin");
      expect(decision).not.toHaveProperty("winner");
    }
  });
});
