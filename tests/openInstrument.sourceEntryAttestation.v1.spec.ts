import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import manifest from "../scripts/openInstrument/sourceBatches/lewis-short-entry-attestation-batch1.v1.manifest.json";
import {
  importReviewedLewisShortEntryAttestationsV1,
  type ReviewedLewisShortEntryAttestationManifestV1,
} from "../scripts/openInstrument/reviewedLewisShortEntryAttestationImport.v1";
import {
  validateSourceEntryAttestationV1,
  type SourceEntryAttestationV1,
} from "../src/shared/openInstrument/sourceEntryAttestation.v1";

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

describe("Open Instrument source-entry attestation v1", () => {
  it("preserves AS, IS, and both exact-form IN entries without sense selection", () => {
    const result = importFixture();

    expect(result.status).toBe("IMPORTED");
    expect(result.rejections).toEqual([]);
    expect(result.attestations.map((attestation) => attestation.sourceForm)).toEqual([
      "as",
      "in",
      "is",
    ]);

    const as = attestationFor("as");
    expect(as.entries).toHaveLength(1);
    expect(as.entries[0]?.senses).toHaveLength(12);
    expect(as.entrySelectionStatus).toBe("NOT_APPLICABLE");
    expect(as.entries[0]?.senseSelectionStatus).toBe("UNRESOLVED");
    expect(as.entries[0]?.selectedSenseId).toBeNull();

    const is = attestationFor("is");
    expect(is.entries).toHaveLength(1);
    expect(is.entries[0]?.senses).toHaveLength(25);
    expect(is.entrySelectionStatus).toBe("NOT_APPLICABLE");
    expect(is.entries[0]?.senseSelectionStatus).toBe("UNRESOLVED");
    expect(is.entries[0]?.selectedSenseId).toBeNull();

    const int = attestationFor("in");
    expect(int.entries.map((entry) => entry.entryId)).toEqual(["n22111", "n22112"]);
    expect(int.entries.map((entry) => entry.senses.length)).toEqual([25, 1]);
    expect(int.entrySelectionStatus).toBe("UNRESOLVED");
    expect(int.selectedEntryId).toBeNull();
    expect(int.entries.every((entry) => entry.selectedSenseId === null)).toBe(true);
    expect(JSON.stringify(result.attestations)).not.toMatch(
      /semanticBridge|targetMeaning|functionalCorrespondence|historicalOrigin|runtimeAuthorization|productionMembership/u,
    );
  });

  it("is deterministic, source-traceable, and deeply immutable", () => {
    const first = importFixture();
    const second = importReviewedLewisShortEntryAttestationsV1(sourceSlice, {
      ...entryManifest,
      sourceSliceSha256,
      selectedEntryIds: [...entryManifest.selectedEntryIds].reverse(),
    });

    expect(first).toEqual(second);
    expect(first.inputSha256).toBe(sourceSliceSha256);
    expect(first.outputSha256).toMatch(/^[0-9a-f]{64}$/u);
    expect(first.attestations[0]?.sourceHashOrArchiveHash).toBe(
      manifest.sourceFileGitBlobSha,
    );
    expect(Object.isFrozen(first.attestations)).toBe(true);
    expect(Object.isFrozen(first.attestations[0])).toBe(true);
    expect(Object.isFrozen(first.attestations[0]?.entries)).toBe(true);
    expect(Object.isFrozen(first.attestations[0]?.entries[0]?.senses)).toBe(true);
    expect(first.attestations[0]?.entries[0]?.senses[0]?.senseLocator).toContain(
      'sense id="',
    );
  });

  it("rejects forbidden correspondence fields and empty source senses", () => {
    const as = attestationFor("as");
    const forbidden = {
      ...as,
      semanticBridge: "must not exist",
    } as unknown;
    const forbiddenResult = validateSourceEntryAttestationV1(forbidden);
    expect(forbiddenResult.ok).toBe(false);
    if (!forbiddenResult.ok) {
      expect(forbiddenResult.reasonCodes).toContain("FORBIDDEN_SEMANTIC_FIELD_PRESENT");
    }

    const emptySenses = {
      ...as,
      entries: [{ ...as.entries[0], senses: [] }],
    } as unknown;
    const emptyResult = validateSourceEntryAttestationV1(emptySenses);
    expect(emptyResult.ok).toBe(false);
    if (!emptyResult.ok) expect(emptyResult.reasonCodes).toContain("SENSES_REQUIRED");

    const editorialText = {
      ...as,
      entries: [{
        ...as.entries[0],
        senses: [{ ...as.entries[0]?.senses[0], text: "init." }],
      }],
    } as unknown;
    const editorialResult = validateSourceEntryAttestationV1(editorialText);
    expect(editorialResult.ok).toBe(false);
    if (!editorialResult.ok) {
      expect(editorialResult.reasonCodes).toContain("SENSE_EDITORIAL_ONLY");
    }
  });

  it("rejects an editorial-only Lewis & Short entry as source evidence", () => {
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
    expect(result.rejections).toEqual([
      { entryId: "im-editorial", reasonCodes: ["NO_SUBSTANTIVE_SENSES"] },
    ]);
  });
});
