import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import manifest from "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.manifest.json";
import {
  importReviewedLewisShortEntryAttestationsV1,
  type ReviewedLewisShortEntryAttestationManifestV1,
} from "../scripts/openInstrument/reviewedLewisShortEntryAttestationImport.v1";
import type { SourceEntryAttestationV1 } from "../src/shared/openInstrument/sourceEntryAttestation.v1";
import {
  targetBlindReviewedSourceAttestationRegistryV1,
} from "../src/shared/openInstrument/targetBlindReviewedSourceAttestationRegistry.v1";
import {
  buildTargetBoundFunctionalCorrespondenceV1,
  fingerprintTargetBoundInputV1,
  validateTargetBoundFunctionalCorrespondenceV1,
  TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1,
  type TargetBoundFunctionalCorrespondenceTargetInputV1,
} from "../src/shared/openInstrument/targetBoundFunctionalCorrespondence.v1";

const fixturePath = join(
  __dirname,
  "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.xml",
);
const sourceSlice = readFileSync(fixturePath, "utf8");
const sourceSliceSha256 = createHash("sha256")
  .update(sourceSlice, "utf8")
  .digest("hex");
const entryManifest = manifest as unknown as ReviewedLewisShortEntryAttestationManifestV1;

function importAttestations(): readonly SourceEntryAttestationV1[] {
  const result = importReviewedLewisShortEntryAttestationsV1(sourceSlice, {
    ...entryManifest,
    sourceSliceSha256,
  });
  if (result.status !== "IMPORTED") throw new Error("Expected imported attestations");
  return result.attestations;
}

function targetInput(
  overrides: Partial<TargetBoundFunctionalCorrespondenceTargetInputV1> = {},
): TargetBoundFunctionalCorrespondenceTargetInputV1 {
  return {
    analysisId: "analysis:flas:logic-structural:flas:as",
    targetWord: "flas",
    targetSense: null,
    structuralHypothesisId: "logic-structural:flas:as:peel_left_consonant_frame+peel_left_consonant_frame",
    embryo: "AS",
    voicePath: ["A"],
    engineVersion: "2025-11-14-core-6",
    structuralHypothesisVersion: "z-zero.structural-hypothesis.v0_1",
    ...overrides,
  };
}

function fixtureFor(sourceForm: string): {
  attestation: SourceEntryAttestationV1;
  review: (typeof targetBlindReviewedSourceAttestationRegistryV1)[number];
} {
  const attestation = importAttestations().find(
    (candidate) => candidate.sourceForm === sourceForm,
  );
  const review = targetBlindReviewedSourceAttestationRegistryV1.find(
    (candidate) => candidate.attestationId === attestation?.attestationId,
  );
  if (!attestation || !review) throw new Error(`Missing fixture for ${sourceForm}`);
  return { attestation, review };
}

function buildFor(
  sourceForm: string,
  input: TargetBoundFunctionalCorrespondenceTargetInputV1 = targetInput(),
) {
  const { attestation, review } = fixtureFor(sourceForm);
  const result = buildTargetBoundFunctionalCorrespondenceV1(input, attestation, review);
  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return { result: result.package, attestation, review };
}

describe("target-bound functional correspondence contract v1", () => {
  it("builds the AS, IN, and IS unit counts without source selection", () => {
    const asPackage = buildFor("as").result;
    const inPackage = buildFor("in", targetInput({
      analysisId: "analysis:minute:logic-structural:minutë:in",
      targetWord: "minutë",
      structuralHypothesisId: "logic-structural:minutë:in:peel_right_vowel_led_expansion+peel_left_consonant_frame",
      embryo: "IN",
      voicePath: ["I"],
    })).result;
    const isPackage = buildFor("is", targetInput({
      analysisId: "analysis:nisem:logic-structural:nisem:is",
      targetWord: "nisem",
      structuralHypothesisId: "logic-structural:nisem:is:peel_right_vowel_led_expansion+peel_left_consonant_frame",
      embryo: "IS",
      voicePath: ["I"],
    })).result;

    expect(asPackage.schemaVersion).toBe(TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1);
    expect(asPackage.comparisonUnitCount).toBe(12);
    expect(inPackage.comparisonUnitCount).toBe(26);
    expect(isPackage.comparisonUnitCount).toBe(25);
    expect(asPackage.comparisonUnitCount + inPackage.comparisonUnitCount + isPackage.comparisonUnitCount).toBe(63);
    expect(inPackage.comparisonUnits.map((unit) => unit.sourceEntryId)).toEqual([
      ...Array(25).fill("n22111"),
      "n22112",
    ]);
    expect(asPackage.selectedEntryId).toBeNull();
    expect(inPackage.selectedEntryId).toBeNull();
    expect(isPackage.selectedEntryId).toBeNull();
    expect(asPackage.selectedSenseIds).toEqual([]);
    expect(inPackage.selectedSenseIds).toEqual([]);
    expect(isPackage.selectedSenseIds).toEqual([]);
  });

  it("preserves source order and independently addresses every source sense", () => {
    const { result, attestation } = buildFor("in", targetInput({
      analysisId: "analysis:finis:logic-structural:finis:in",
      targetWord: "finis",
      structuralHypothesisId: "logic-structural:finis:in:peel_right_vowel_led_expansion+peel_left_consonant_frame",
      embryo: "IN",
    }));
    const expected = attestation.entries.flatMap((entry, entryIndex) =>
      entry.senses.map((sense, senseIndex) => ({
        entryId: entry.entryId,
        senseId: sense.senseId,
        entryIndex,
        senseIndex,
      })),
    );
    expect(result.comparisonUnits.map((unit) => ({
      entryId: unit.sourceEntryId,
      senseId: unit.sourceSenseId,
      entryIndex: unit.sourceOrder.entryIndex,
      senseIndex: unit.sourceOrder.senseIndex,
    }))).toEqual(expected);
    expect(result.comparisonUnits.every((unit) => unit.review.reviewStatus === "NOT_REVIEWED")).toBe(true);
    expect(result.correspondenceState).toBe("NOT_REVIEWED");
  });

  it("binds deterministic target fingerprints and distinguishes target mutations", () => {
    const absent = targetInput();
    const present = targetInput({
      targetSense: { id: "sense:movement", label: "movement" },
    });
    expect(fingerprintTargetBoundInputV1(absent)).toBe(fingerprintTargetBoundInputV1(absent));
    expect(fingerprintTargetBoundInputV1(absent)).not.toBe(fingerprintTargetBoundInputV1(present));
    expect(fingerprintTargetBoundInputV1(absent)).not.toBe(
      fingerprintTargetBoundInputV1(targetInput({ targetWord: "ngas" })),
    );
    expect(fingerprintTargetBoundInputV1(absent)).not.toBe(
      fingerprintTargetBoundInputV1(targetInput({ structuralHypothesisId: "logic-structural:changed" })),
    );
    expect(fingerprintTargetBoundInputV1(absent)).not.toBe(
      fingerprintTargetBoundInputV1(targetInput({ embryo: "ASIS", voicePath: ["A", "I"] })),
    );
  });

  it("validates the package against the exact source and review fingerprints", () => {
    const { result, attestation, review } = buildFor("as");
    expect(validateTargetBoundFunctionalCorrespondenceV1(result, attestation, review)).toMatchObject({ ok: true });

    const changedAttestation = JSON.parse(JSON.stringify(attestation)) as SourceEntryAttestationV1;
    changedAttestation.entries[0].senses[0].text = `${changedAttestation.entries[0].senses[0].text} changed`;
    expect(validateTargetBoundFunctionalCorrespondenceV1(result, changedAttestation, review)).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["SOURCE_REVIEW_INVALID"]),
    });

    const changed = {
      ...result,
      sourceReview: {
        ...result.sourceReview,
        attestationFingerprint: "0".repeat(64),
      },
    };
    expect(validateTargetBoundFunctionalCorrespondenceV1(changed, attestation, review)).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["SOURCE_ATTESTATION_FINGERPRINT_MISMATCH"]),
    });

    const changedTarget = {
      ...result,
      targetInput: {
        ...result.targetInput,
        targetWord: "ngas",
      },
    };
    expect(validateTargetBoundFunctionalCorrespondenceV1(changedTarget, attestation, review)).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining([
        "TARGET_INPUT_FINGERPRINT_MISMATCH",
        "COMPARISON_UNIT_IDENTITY_MISMATCH",
        "COMPARISON_UNIT_FINGERPRINT_MISMATCH",
      ]),
    });

    const changedUnit = {
      ...result,
      comparisonUnits: [
        {
          ...result.comparisonUnits[0],
          sourceAttestationId: "source-entry-attestation:other",
        },
        ...result.comparisonUnits.slice(1),
      ],
    };
    expect(validateTargetBoundFunctionalCorrespondenceV1(changedUnit, attestation, review)).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["COMPARISON_UNIT_IDENTITY_MISMATCH"]),
    });

    const inFixture = buildFor("in");
    const changedSelectionStatus = {
      ...inFixture.result,
      sourceEntrySelectionStatus: "NOT_APPLICABLE" as const,
    };
    expect(validateTargetBoundFunctionalCorrespondenceV1(
      changedSelectionStatus,
      inFixture.attestation,
      inFixture.review,
    )).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["SOURCE_SELECTION_INVALID"]),
    });
  });

  it("does not accept a rejected or pending source review", () => {
    const { attestation } = fixtureFor("as");
    const rejected = {
      ...targetBlindReviewedSourceAttestationRegistryV1[0],
      reviewDecision: "rejected" as const,
      reasonCodes: ["SOURCE_ATTESTATION_INVALID"] as const,
    };
    const pending = {
      ...targetBlindReviewedSourceAttestationRegistryV1[0],
      reviewDecision: "pending" as const,
      reviewer: null,
      reviewedAt: null,
      reasonCodes: ["REVIEW_DEFERRED"] as const,
    };
    expect(buildTargetBoundFunctionalCorrespondenceV1(targetInput(), attestation, rejected)).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_REVIEW_NOT_ACCEPTED"],
    });
    expect(buildTargetBoundFunctionalCorrespondenceV1(targetInput(), attestation, pending)).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_REVIEW_NOT_ACCEPTED"],
    });
  });

  it("rejects authority fields and keeps all non-source authority disabled", () => {
    const { result, attestation, review } = buildFor("as");
    expect(result.functionalAcceptance).toBe("NOT_AUTHORIZED");
    expect(result.historicalRelation).toBe("NOT_CLAIMED");
    expect(result.winnerClaim).toBe("NOT_CLAIMED");
    expect(result.productionMembership).toBe("NOT_AUTHORIZED");
    expect(result.runtimeAuthorization).toBe("NOT_AUTHORIZED");
    expect(result.comparisonUnits.every((unit) => unit.review.verdict === null)).toBe(true);

    const tampered = {
      ...result,
      semanticBridge: "forbidden",
    };
    expect(validateTargetBoundFunctionalCorrespondenceV1(tampered, attestation, review)).toEqual({
      ok: false,
      reasonCodes: expect.arrayContaining(["FORBIDDEN_AUTHORITY_FIELD_PRESENT"]),
    });
  });

  it("is deeply immutable and deterministic", () => {
    const first = buildFor("is").result;
    const second = buildFor("is").result;
    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.targetInput)).toBe(true);
    expect(Object.isFrozen(first.sourceReview)).toBe(true);
    expect(Object.isFrozen(first.comparisonUnits)).toBe(true);
    expect(Object.isFrozen(first.comparisonUnits[0])).toBe(true);
    expect(Object.isFrozen(first.comparisonUnits[0]?.sourceOrder)).toBe(true);
    expect(Object.isFrozen(first.comparisonUnits[0]?.review)).toBe(true);
  });

  it("does not change the existing Lane 3 correspondence contract", () => {
    const { result } = buildFor("as");
    expect(result.comparisonUnits).toHaveLength(12);
    expect(result.comparisonUnits.every((unit) => unit.review.reviewStatus === "NOT_REVIEWED")).toBe(true);
    expect(result).not.toHaveProperty("semanticBridge");
    expect(result).not.toHaveProperty("targetMeaning");
  });
});
