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
  fingerprintSourceEntryAttestationV1,
  validateTargetBlindReviewedSourceAttestationV1,
} from "../src/shared/openInstrument/targetBlindReviewedSourceAttestation.v1";
import {
  TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REGISTRY_SCHEMA_V1,
  TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEW_DATE_V1,
  TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEWER_V1,
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

function importAttestations(): readonly SourceEntryAttestationV1[] {
  const result = importReviewedLewisShortEntryAttestationsV1(sourceSlice, {
    ...entryManifest,
    sourceSliceSha256,
  });

  if (result.status !== "IMPORTED") throw new Error("Expected imported attestations");
  return result.attestations;
}

describe("target-blind reviewed source attestation registry v1", () => {
  it("records the three accepted source-only decisions against exact packages", () => {
    const attestations = importAttestations();
    const expectedForms = ["as", "in", "is"];
    const expectedAttestationIds = [
      "source-entry-attestation.scaife-lewis-short.form-as.v1",
      "source-entry-attestation.scaife-lewis-short.form-in.v1",
      "source-entry-attestation.scaife-lewis-short.form-is.v1",
    ];

    expect(TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REGISTRY_SCHEMA_V1).toBe(
      "open-instrument.target-blind-reviewed-source-attestation-registry.v1",
    );
    expect(sourceSliceSha256).toBe(
      "92bd71660cdcc2c2b57d6869fdaed42aa2b04e19e9182aeffe0eae269937ab65",
    );
    expect(entryManifest.sourceRepositoryCommit).toBe(
      "56061ca127f4a2844980baffc5f2b6d1332897b3",
    );
    expect(targetBlindReviewedSourceAttestationRegistryV1).toHaveLength(3);
    expect(targetBlindReviewedSourceAttestationRegistryV1.map((review) => review.attestationId)).toEqual(
      expectedAttestationIds,
    );

    for (const [index, sourceForm] of expectedForms.entries()) {
      const attestation = attestations.find(
        (candidate) => candidate.sourceForm === sourceForm,
      );
      const review = targetBlindReviewedSourceAttestationRegistryV1[index];

      expect(attestation).toBeDefined();
      expect(review).toBeDefined();
      if (!attestation || !review) continue;

      const before = JSON.stringify(attestation);
      expect(review.reviewDecision).toBe("accepted");
      expect(review.reviewer).toBe(
        TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEWER_V1,
      );
      expect(review.reviewedAt).toBe(
        TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEW_DATE_V1,
      );
      expect(review.reasonCodes).toEqual([]);
      expect(review.claimBoundary).toBe("SOURCE_ATTESTATION_ONLY");
      expect(review.attestationId).toBe(attestation.attestationId);
      expect(review.attestationFingerprint).toBe(
        fingerprintSourceEntryAttestationV1(attestation),
      );

      const validation = validateTargetBlindReviewedSourceAttestationV1(
        review,
        attestation,
      );
      expect(validation.ok).toBe(true);
      expect(JSON.stringify(attestation)).toBe(before);
    }
  });

  it("preserves four entries and 63 senses without selecting any", () => {
    const attestations = importAttestations().filter((attestation) =>
      ["as", "in", "is"].includes(attestation.sourceForm),
    );

    expect(attestations.map((attestation) => attestation.entries.length)).toEqual([
      1,
      2,
      1,
    ]);
    expect(
      attestations.reduce(
        (total, attestation) =>
          total + attestation.entries.reduce((count, entry) => count + entry.senses.length, 0),
        0,
      ),
    ).toBe(63);
    expect(attestations.every((attestation) => attestation.selectedEntryId === null)).toBe(
      true,
    );
    expect(
      attestations.every((attestation) =>
        attestation.entries.every((entry) => entry.selectedSenseId === null),
      ),
    ).toBe(true);
    expect(attestations[1]?.entrySelectionStatus).toBe("UNRESOLVED");
    expect(attestations[0]?.entries[0]?.senseSelectionStatus).toBe("UNRESOLVED");
    expect(attestations[1]?.entries[0]?.senseSelectionStatus).toBe("UNRESOLVED");
    expect(attestations[2]?.entries[0]?.senseSelectionStatus).toBe("UNRESOLVED");
  });

  it("keeps accepted review envelopes target-blind and source-only", () => {
    const forbiddenKeys = [
      "targetWord",
      "targetMeaning",
      "semanticBridge",
      "functionalCorrespondence",
      "functionalAcceptance",
      "historicalRelation",
      "winner",
      "productionMembership",
      "runtimeAuthorization",
    ];

    for (const review of targetBlindReviewedSourceAttestationRegistryV1) {
      for (const key of forbiddenKeys) {
        expect(review).not.toHaveProperty(key);
      }
    }
    expect(
      targetBlindReviewedSourceAttestationRegistryV1.every(
        (review) => review.claimBoundary === "SOURCE_ATTESTATION_ONLY",
      ),
    ).toBe(true);
  });

  it("fails closed when an accepted package changes", () => {
    const attestation = importAttestations().find(
      (candidate) => candidate.sourceForm === "in",
    );
    const review = targetBlindReviewedSourceAttestationRegistryV1[1];

    expect(attestation).toBeDefined();
    if (!attestation) return;

    const changed = JSON.parse(JSON.stringify(attestation)) as SourceEntryAttestationV1;
    changed.entries[0].senses[0].text = `${changed.entries[0].senses[0].text} changed`;

    expect(validateTargetBlindReviewedSourceAttestationV1(review, changed)).toEqual({
      ok: false,
      reasonCodes: ["ATTESTATION_FINGERPRINT_MISMATCH"],
    });
  });

  it("keeps registry and reason-code data immutable", () => {
    expect(Object.isFrozen(targetBlindReviewedSourceAttestationRegistryV1)).toBe(true);
    for (const review of targetBlindReviewedSourceAttestationRegistryV1) {
      expect(Object.isFrozen(review)).toBe(true);
      expect(Object.isFrozen(review.reasonCodes)).toBe(true);
    }
  });
});
