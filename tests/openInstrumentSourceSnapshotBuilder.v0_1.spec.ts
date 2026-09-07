import breadFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/bread.fjale.v0_1.json";
import seaFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/sea.fjale.v0_1.json";
import seaLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/sea.lewis-short.v0_1.json";
import sleepFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/sleep.fjale.v0_1.json";
import sleepLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/sleep.lewis-short.v0_1.json";
import seaPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/sea.research-evidence-packet.v0_1.json";
import sleepPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/sleep.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import {
  extractOfflineSourceEntryFactsV0_1,
} from "../src/shared/openInstrumentOfflineSourceEntryExtractor.v0_1";
import {
  adaptVerifiedSourceRecordV0_1,
} from "../src/shared/openInstrumentSourceAdapter.v0_1";
import {
  captureReviewedSourceV0_1,
  OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceCapture.v0_1";
import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
} from "../src/shared/openInstrumentResearchEvidencePacket.v0_1";
import {
  buildOfflineSourceEntrySnapshotV0_1,
  OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceSnapshotBuilder.v0_1";

function inputFromSnapshot(snapshot: any) {
  return {
    builderVersion: OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1,
    sourceTraditionId: snapshot.sourceTraditionId,
    sourceUrlOrArchiveRef: snapshot.sourceUrlOrArchiveRef,
    sourceDateOrVersion: snapshot.sourceDateOrVersion,
    entryHeadword: snapshot.entry.headword,
    entryLocator: snapshot.entry.locator,
    senseLabel: snapshot.entry.senses[0].label,
    attestedForm: snapshot.entry.attestedForms[0],
    attestedGloss: snapshot.entry.senses[0].text,
  };
}

function buildCaptureAndAdapter(snapshot: any) {
  const built = buildOfflineSourceEntrySnapshotV0_1(inputFromSnapshot(snapshot));
  expect(built.ok).toBe(true);
  if (!built.ok) throw new Error(built.reasonCodes.join(", "));

  const extracted = extractOfflineSourceEntryFactsV0_1(built.snapshot);
  expect(extracted.ok).toBe(true);
  if (!extracted.ok) throw new Error(extracted.diagnostics.join(", "));

  const capture = captureReviewedSourceV0_1({
    captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
    sourceTraditionId: extracted.candidate.sourceTraditionId,
    sourceDateOrVersion: extracted.candidate.sourceDateOrVersion,
    sourceUrlOrArchiveRef: extracted.candidate.sourceUrlOrArchiveRef,
    entryLocator: extracted.candidate.entryLocatorCandidates[0],
    attestedForm: extracted.candidate.attestedFormCandidates[0],
    attestedGloss: extracted.candidate.attestedGlossCandidates[0],
  });
  expect(capture.ok).toBe(true);
  if (!capture.ok) throw new Error(capture.reasonCodes.join(", "));

  const adapted = adaptVerifiedSourceRecordV0_1(capture.sourceRecord);
  expect(adapted.ok && adapted.admissible).toBe(true);
  if (!adapted.ok || !adapted.admissible || !adapted.candidate.citation) {
    throw new Error("source adapter rejected builder output");
  }

  return adapted.candidate;
}

describe("Open Instrument source snapshot builder v0.1", () => {
  it.each([
    ["FJALË", seaFjaleSnapshot],
    ["Lewis & Short", seaLewisShortSnapshot],
    ["FJALË sleep", sleepFjaleSnapshot],
    ["Lewis & Short sleep", sleepLewisShortSnapshot],
  ])("builds an exact %s snapshot", (_label, snapshot) => {
    expect(buildOfflineSourceEntrySnapshotV0_1(inputFromSnapshot(snapshot))).toEqual({
      ok: true,
      snapshot,
    });
  });

  it("generates a stable ID without target or sense data", () => {
    const input = inputFromSnapshot(seaFjaleSnapshot);
    const first = buildOfflineSourceEntrySnapshotV0_1(input);
    const second = buildOfflineSourceEntrySnapshotV0_1({
      ...input,
      entryLocator: `  ${input.entryLocator}  `,
    });

    expect(first).toEqual(second);
    if (!first.ok) throw new Error(first.reasonCodes.join(", "));
    expect(first.snapshot.sourceSnapshotId).toBe("fjale-det-reviewed-2026-09-07");
    expect(first.snapshot).not.toHaveProperty("targetWord");
    expect(first.snapshot).not.toHaveProperty("targetSenseId");
    expect(first.snapshot).not.toHaveProperty("embryo");
    expect(first.snapshot).not.toHaveProperty("semanticBridge");
  });

  it("normalizes NFC-equivalent source facts deterministically", () => {
    const input = inputFromSnapshot(sleepFjaleSnapshot);
    const decomposed = {
      ...input,
      entryHeadword: "gjum\u0065\u0308",
      attestedForm: "gjum\u0065\u0308",
    };

    expect(buildOfflineSourceEntrySnapshotV0_1(decomposed)).toEqual(
      buildOfflineSourceEntrySnapshotV0_1(input),
    );
  });

  it.each([
    ["unknown source", { sourceTraditionId: "unknown.source.v0_1" }, "UNKNOWN_SOURCE_TRADITION"],
    ["missing URL", { sourceUrlOrArchiveRef: "   " }, "SOURCE_URL_MISSING"],
    ["missing locator", { entryLocator: "   " }, "ENTRY_LOCATOR_MISSING"],
    ["missing form", { attestedForm: "   " }, "ATTESTED_FORM_MISSING"],
    ["missing gloss", { attestedGloss: "   " }, "ATTESTED_GLOSS_MISSING"],
    ["bad builder version", { builderVersion: "wrong.v0_1" }, "INVALID_BUILDER_VERSION"],
    ["bad optional date", { sourceDateOrVersion: 20260907 }, "INVALID_OPTIONAL_DATE_VERSION"],
  ])("fails closed for %s", (_label, override, reasonCode) => {
    const result = buildOfflineSourceEntrySnapshotV0_1({
      ...inputFromSnapshot(breadFjaleSnapshot),
      ...override,
    });

    expect(result).toEqual({
      ok: false,
      snapshot: null,
      reasonCodes: expect.arrayContaining([reasonCode]),
    });
  });

  it.each([
    ["sea", seaPacket, seaFjaleSnapshot, seaLewisShortSnapshot],
    ["sleep", sleepPacket, sleepFjaleSnapshot, sleepLewisShortSnapshot],
  ])("preserves %s through extractor, capture, adapter, packet, and compiler", (
    _word,
    packet,
    fjaleSnapshot,
    scaifeSnapshot,
  ) => {
    const candidates = [fjaleSnapshot, scaifeSnapshot].map(buildCaptureAndAdapter);
    const reviewed = {
      ...packet,
      sources: packet.sources.map((source, index) => {
        const candidate = candidates[index];
        return {
          sourceKey: candidate.sourceKey,
          embryo: source.embryo,
          evidenceFamily: candidate.evidenceFamily,
          language: candidate.language,
          form: candidate.form,
          gloss: candidate.gloss,
          embryoRelation: source.embryoRelation,
          relationOperationIds: source.relationOperationIds,
          citation: candidate.citation,
        };
      }),
    };
    const compiled = compileOpenInstrumentResearchEvidencePacketInputV0_1(reviewed);
    const catalogRows = catalog.rows.filter((row) =>
      compiled.some((compiledRow) => compiledRow.researchEvidenceId === row.researchEvidenceId),
    );

    expect(catalogRows).toEqual(compiled);
  });
});
