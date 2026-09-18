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
  TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
  validateTargetBlindReviewedSourceAttestationV1,
  type TargetBlindReviewedSourceAttestationV1,
} from "../src/shared/openInstrument/targetBlindReviewedSourceAttestation.v1";

const fixturePath = join(
  __dirname,
  "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.xml",
);
const sourceSlice = readFileSync(fixturePath, "utf8");
const sourceSliceSha256 = createHash("sha256")
  .update(sourceSlice, "utf8")
  .digest("hex");
const entryManifest = manifest as unknown as ReviewedLewisShortEntryAttestationManifestV1;

function importFixture() {
  return importReviewedLewisShortEntryAttestationsV1(sourceSlice, {
    ...entryManifest,
    sourceSliceSha256,
  });
}

function attestationFor(sourceForm: string): SourceEntryAttestationV1 {
  const result = importFixture();
  expect(result.status).toBe("IMPORTED");
  const attestation = result.attestations.find(
    (candidate) => candidate.sourceForm === sourceForm,
  );
  if (!attestation) throw new Error(`Missing attestation for ${sourceForm}`);
  return attestation;
}

function acceptedReviewFor(
  attestation: SourceEntryAttestationV1,
): TargetBlindReviewedSourceAttestationV1 {
  return {
    schemaVersion: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
    attestationSchemaVersion: attestation.schemaVersion,
    attestationId: attestation.attestationId,
    attestationFingerprint: fingerprintSourceEntryAttestationV1(attestation),
    reviewDecision: "accepted",
    reviewer: "synthetic-test-reviewer",
    reviewedAt: "2026-09-18",
    reasonCodes: [],
    claimBoundary: "SOURCE_ATTESTATION_ONLY",
  };
}

function pendingReviewFor(
  attestation: SourceEntryAttestationV1,
): TargetBlindReviewedSourceAttestationV1 {
  return {
    schemaVersion: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
    attestationSchemaVersion: attestation.schemaVersion,
    attestationId: attestation.attestationId,
    attestationFingerprint: fingerprintSourceEntryAttestationV1(attestation),
    reviewDecision: "pending",
    reviewer: null,
    reviewedAt: null,
    reasonCodes: ["REVIEW_DEFERRED"],
    claimBoundary: "SOURCE_ATTESTATION_ONLY",
  };
}

describe("target-blind reviewed source attestation v1", () => {
  it("reviews AS, IS, and IN without selecting entries or senses", () => {
    const attestations = [attestationFor("as"), attestationFor("in"), attestationFor("is")];
    const reviews = attestations.map((attestation) =>
      validateTargetBlindReviewedSourceAttestationV1(
        acceptedReviewFor(attestation),
        attestation,
      ),
    );

    expect(reviews.every((result) => result.ok)).toBe(true);
    expect(attestations.map((attestation) => attestation.sourceForm)).toEqual([
      "as",
      "in",
      "is",
    ]);
    expect(attestations.map((attestation) => attestation.entries.length)).toEqual([
      1,
      2,
      1,
    ]);
    expect(attestations.reduce((total, attestation) => total + attestation.entries.length, 0)).toBe(4);
    expect(
      attestations.flatMap((attestation) =>
        attestation.entries.flatMap((entry) => entry.senses),
      ),
    ).toHaveLength(63);
    expect(attestations.flatMap((attestation) => attestation.entries).every((entry) => entry.selectedSenseId === null)).toBe(true);
    expect(attestations.every((attestation) => attestation.selectedEntryId === null)).toBe(true);
  });

  it("preserves the AS source package and accepts only the source claim", () => {
    const attestation = attestationFor("as");
    const result = validateTargetBlindReviewedSourceAttestationV1(
      acceptedReviewFor(attestation),
      attestation,
    );

    expect(result).toMatchObject({
      ok: true,
      review: {
        reviewDecision: "accepted",
        claimBoundary: "SOURCE_ATTESTATION_ONLY",
        reviewer: "synthetic-test-reviewer",
      },
    });
    expect(attestation.entries[0]?.senses).toHaveLength(12);
    expect(attestation.entrySelectionStatus).toBe("NOT_APPLICABLE");
    expect(attestation.selectedEntryId).toBeNull();
    expect(attestation.entries[0]?.senseSelectionStatus).toBe("UNRESOLVED");
    expect(attestation.entries[0]?.selectedSenseId).toBeNull();
  });

  it("preserves IS and both IN entries with zero selection", () => {
    const is = attestationFor("is");
    const int = attestationFor("in");
    const isResult = validateTargetBlindReviewedSourceAttestationV1(
      acceptedReviewFor(is),
      is,
    );
    const inResult = validateTargetBlindReviewedSourceAttestationV1(
      acceptedReviewFor(int),
      int,
    );

    expect(isResult.ok).toBe(true);
    expect(inResult.ok).toBe(true);
    expect(is.entries[0]?.senses).toHaveLength(25);
    expect(is.entries[0]?.selectedSenseId).toBeNull();
    expect(int.entries.map((entry) => entry.entryId)).toEqual(["n22111", "n22112"]);
    expect(int.entries.map((entry) => entry.senses.length)).toEqual([25, 1]);
    expect(int.entrySelectionStatus).toBe("UNRESOLVED");
    expect(int.selectedEntryId).toBeNull();
    expect(int.entries.every((entry) => entry.selectedSenseId === null)).toBe(true);
  });

  it("supports deferred and rejected review states without semantic claims", () => {
    const attestation = attestationFor("as");
    const pending = validateTargetBlindReviewedSourceAttestationV1(
      pendingReviewFor(attestation),
      attestation,
    );
    const rejected = validateTargetBlindReviewedSourceAttestationV1(
      {
        ...acceptedReviewFor(attestation),
        reviewDecision: "rejected",
        reasonCodes: ["SOURCE_PROVENANCE_INSUFFICIENT"],
      },
      attestation,
    );

    expect(pending.ok).toBe(true);
    expect(rejected.ok).toBe(true);
  });

  it("invalidates a review when the bound attestation changes", () => {
    const attestation = attestationFor("is");
    const changed = JSON.parse(JSON.stringify(attestation)) as SourceEntryAttestationV1;
    changed.entries[0].senses[0].text = `${changed.entries[0].senses[0].text} changed`;

    const result = validateTargetBlindReviewedSourceAttestationV1(
      acceptedReviewFor(attestation),
      changed,
    );

    expect(result).toEqual({
      ok: false,
      reasonCodes: ["ATTESTATION_FINGERPRINT_MISMATCH"],
    });
  });

  it("fails closed for invalid attestations and editorial-only IM", () => {
    const editorialOnly =
      '<?xml version="1.0"?><sourceSlice sourceFormat="TEI.2 XML"><entryFree id="im-editorial" key="im"><orth lang="la">im</orth><sense id="im-editorial.0"><hi rend="ital">init.</hi></sense></entryFree></sourceSlice>';
    const result = importReviewedLewisShortEntryAttestationsV1(editorialOnly, {
      ...entryManifest,
      sourceSliceSha256: createHash("sha256")
        .update(editorialOnly, "utf8")
        .digest("hex"),
      selectedEntryIds: ["im-editorial"],
    });

    expect(result.status).toBe("REJECTED");
    expect(result.attestations).toEqual([]);
    expect(
      validateTargetBlindReviewedSourceAttestationV1(
        pendingReviewFor(attestationFor("as")),
        null,
      ),
    ).toEqual({ ok: false, reasonCodes: ["ATTESTATION_INVALID"] });
  });

  it("rejects target, correspondence, and runtime fields", () => {
    const attestation = attestationFor("as");
    const result = validateTargetBlindReviewedSourceAttestationV1(
      {
        ...acceptedReviewFor(attestation),
        targetWord: "forbidden",
        semanticBridge: "forbidden",
        runtimeAuthorization: "forbidden",
      },
      attestation,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toEqual([
        "FORBIDDEN_FIELD_PRESENT",
        "UNEXPECTED_FIELD_PRESENT",
      ]);
    }
  });

  it("rejects an attestation with a preselected entry or sense", () => {
    const attestation = attestationFor("in");
    const selected = JSON.parse(JSON.stringify(attestation)) as SourceEntryAttestationV1;
    selected.selectedEntryId = "n22111";
    selected.entrySelectionStatus = "EXPLICITLY_RESOLVED";
    selected.entries[0].selectedSenseId = selected.entries[0].senses[0].senseId;
    selected.entries[0].senseSelectionStatus = "EXPLICITLY_RESOLVED";

    const result = validateTargetBlindReviewedSourceAttestationV1(
      acceptedReviewFor(attestation),
      selected,
    );

    expect(result).toEqual({
      ok: false,
      reasonCodes: ["ATTESTATION_FINGERPRINT_MISMATCH", "PRESELECTED_ENTRY_OR_SENSE"],
    });
  });

  it("rejects sparse reason-code arrays", () => {
    const attestation = attestationFor("as");
    const sparseReasons = new Array(1) as TargetBlindReviewedSourceAttestationV1["reasonCodes"];
    const result = validateTargetBlindReviewedSourceAttestationV1(
      {
        ...acceptedReviewFor(attestation),
        reviewDecision: "rejected",
        reasonCodes: sparseReasons,
      },
      attestation,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("REASON_CODES_INVALID");
    }
  });

  it("rejects nonexistent review calendar dates", () => {
    const attestation = attestationFor("is");
    const result = validateTargetBlindReviewedSourceAttestationV1(
      {
        ...acceptedReviewFor(attestation),
        reviewedAt: "2026-02-31",
      },
      attestation,
    );

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reasonCodes).toContain("REVIEWED_AT_INVALID");
      expect(result.reasonCodes).toContain("REVIEWED_AT_REQUIRED");
    }
  });

  it("is deterministic and deeply immutable", () => {
    const attestation = attestationFor("in");
    const first = validateTargetBlindReviewedSourceAttestationV1(
      acceptedReviewFor(attestation),
      attestation,
    );
    const second = validateTargetBlindReviewedSourceAttestationV1(
      acceptedReviewFor(attestation),
      attestation,
    );

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    if (first.ok) {
      expect(Object.isFrozen(first.review)).toBe(true);
      expect(Object.isFrozen(first.review.reasonCodes)).toBe(true);
    }
    expect(fingerprintSourceEntryAttestationV1(attestation)).toBe(
      fingerprintSourceEntryAttestationV1(attestation),
    );
  });
});
