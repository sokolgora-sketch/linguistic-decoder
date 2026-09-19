import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import manifest from "../scripts/openInstrument/sourceBatches/lewis-short-aqua-entry-attestation-batch1.v1.manifest.json";
import { serializeCanonicalSourceSliceV1 } from "../src/shared/openInstrument/sourceSliceSerialization.v1";
import {
  importReviewedLewisShortEntryAttestationsV1,
  type ReviewedLewisShortEntryAttestationManifestV1,
} from "../scripts/openInstrument/reviewedLewisShortEntryAttestationImport.v1";
import { fingerprintSourceEntryAttestationV1 } from "../src/shared/openInstrument/targetBlindReviewedSourceAttestation.v1";

const packetPath = join(
  __dirname,
  "../scripts/openInstrument/sourceBatches/lewis-short-aqua-entry-attestation-batch1.v1.xml",
);
const packet = readFileSync(packetPath, "utf8");
const packetManifest = manifest as unknown as ReviewedLewisShortEntryAttestationManifestV1 &
  Record<string, unknown>;

function sha256(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function exactAquaEntry(source: string): string {
  const openingTag = '<entryFree key="aqua" type="main" id="n3259">';
  const closingTag = "</entryFree>";
  const start = source.indexOf(openingTag);
  const end = source.indexOf(closingTag, start);
  if (start < 0 || end < 0) throw new Error("Pinned AQUA entry not found");
  return source.slice(start, end + closingTag.length);
}

function importAqua() {
  return importReviewedLewisShortEntryAttestationsV1(packet, packetManifest);
}

describe("Open Instrument bounded AQUA n3259 source attestation v1", () => {
  it("persists the canonical target-blind source packet identity", () => {
    const exactEntryXml = exactAquaEntry(packet);
    const serialized = serializeCanonicalSourceSliceV1({
      sourceFormat: "TEI.2 XML",
      sourceTraditionId: "scaife.lewis-short.v0_1",
      exactEntryXml,
    });

    expect(Buffer.byteLength(exactEntryXml, "utf8")).toBe(25255);
    expect(sha256(exactEntryXml)).toBe(
      "a4f69c6bdccaa0456c97944eafe455fbe415f8bc46cfd13a14bb0b5586fdf2de",
    );
    expect(Buffer.byteLength(serialized, "utf8")).toBe(25488);
    expect(sha256(serialized)).toBe(
      "c70fdfd3e9f3087ce7c9af2d3cc766cac332af224cd8a39f02880a3185b466a3",
    );
    expect(serialized).toBe(packet);
    expect(packetManifest.sourceSliceSha256).toBe(sha256(packet));
    expect(packetManifest.primarySourceForm).toBe("ăqua");
    expect(packetManifest.authorizedLookupRepresentation).toBe("ĂQUA");
    expect(packetManifest.primarySourceForm).toBe(
      String(packetManifest.primarySourceForm).normalize("NFC"),
    );
    expect(packetManifest.authorizedLookupRepresentation).toBe(
      String(packetManifest.authorizedLookupRepresentation).normalize("NFC"),
    );
  });

  it("imports all 33 source senses in source order without target selection", () => {
    const first = importAqua();

    expect(first.status).toBe("IMPORTED");
    expect(first.rejections).toEqual([]);
    expect(first.attestations).toHaveLength(1);

    const attestation = first.attestations[0];
    expect(attestation?.attestationId).toBe(
      "source-entry-attestation.scaife-lewis-short.form-ăqua.v1",
    );
    expect(attestation?.sourceForm).toBe("ăqua");
    expect(attestation?.sourceForm).toBe(attestation?.sourceForm.normalize("NFC"));
    expect(attestation?.entries).toHaveLength(1);
    expect(attestation?.entries[0]?.entryId).toBe("n3259");
    expect(attestation?.entries[0]?.entryKey).toBe("aqua");
    expect(attestation?.entries[0]?.senses).toHaveLength(33);
    expect(attestation?.entries[0]?.senses.map((sense) => sense.senseId)).toEqual(
      Array.from({ length: 33 }, (_, index) => `n3259.${index}`),
    );
    expect(attestation?.entries[0]?.senseSelectionStatus).toBe("UNRESOLVED");
    expect(attestation?.entries[0]?.selectedSenseId).toBeNull();
    expect(attestation?.entrySelectionStatus).toBe("NOT_APPLICABLE");
    expect(attestation?.selectedEntryId).toBeNull();
    expect(JSON.stringify(attestation)).not.toMatch(
      /targetWord|targetSense|targetMeaning|functionalCorrespondence|semanticBridge|runtimeAuthorization|productionMembership/u,
    );
  });

  it("is deterministic and fingerprinted without creating review or package authority", () => {
    const first = importAqua();
    const second = importAqua();
    const firstAttestation = first.attestations[0];
    const secondAttestation = second.attestations[0];

    expect(first).toEqual(second);
    expect(first.outputJson).toBe(second.outputJson);
    expect(first.outputSha256).toBe(second.outputSha256);
    expect(firstAttestation).toBeDefined();
    expect(secondAttestation).toBeDefined();
    if (!firstAttestation || !secondAttestation) return;

    const firstFingerprint = fingerprintSourceEntryAttestationV1(firstAttestation);
    const secondFingerprint = fingerprintSourceEntryAttestationV1(secondAttestation);
    console.log(`AQUA_ATTESTATION_FINGERPRINT=${firstFingerprint}`);
    expect(firstFingerprint).toBe(
      "0a4bdc13e2f422f3724b3a52fcd9279260e6b7c40875caba33b432502b6f00d7",
    );
    expect(firstFingerprint).toBe(secondFingerprint);
    expect(Object.isFrozen(firstAttestation)).toBe(true);
    expect(Object.isFrozen(firstAttestation.entries)).toBe(true);
    expect(Object.isFrozen(firstAttestation.entries[0]?.senses)).toBe(true);
    expect(packetManifest.humanSourceReview).toBe("NOT_PERFORMED");
    expect(packetManifest.targetBoundPackage).toBe("NOT_CREATED");
    expect(packetManifest.functionalVerdict).toBe("NOT_CREATED");
    expect(packetManifest.runtimePromotion).toBe("NOT_AUTHORIZED");
  });
});
