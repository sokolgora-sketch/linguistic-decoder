import breadFjaleRaw from "./fixtures/openInstrument/rawSourceEntry/bread.fjale.v0_1.json";
import breadLewisShortRaw from "./fixtures/openInstrument/rawSourceEntry/bread.lewis-short.v0_1.json";
import hopeFjaleRaw from "./fixtures/openInstrument/rawSourceEntry/hope.fjale.v0_1.json";
import hopeLewisShortRaw from "./fixtures/openInstrument/rawSourceEntry/hope.lewis-short.v0_1.json";
import breadFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/bread.fjale.v0_1.json";
import breadLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/bread.lewis-short.v0_1.json";
import hopeFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/hope.fjale.v0_1.json";
import hopeLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/hope.lewis-short.v0_1.json";
import breadPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/bread.research-evidence-packet.v0_1.json";
import hopePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/hope.research-evidence-packet.v0_1.json";
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
import {
  captureRawSourceEntryV0_1,
  OPEN_INSTRUMENT_RAW_SOURCE_ENTRY_CAPTURE_VERSION_V0_1,
} from "../src/shared/openInstrumentRawSourceEntryCapture.v0_1";

const FORBIDDEN_FIELDS = [
  "targetWord",
  "targetSenseId",
  "embryo",
  "embryoRelation",
  "relationOperationIds",
  "semanticBridge",
  "historicalOriginClaim",
  "historicalTransmissionClaim",
  "winnerClaim",
  "candidateTruthClaim",
  "languageSuperiorityClaim",
] as const;

function buildFromRaw(raw: any) {
  const captured = captureRawSourceEntryV0_1(raw);
  expect(captured.ok).toBe(true);
  if (!captured.ok) throw new Error(captured.diagnostics.join(", "));
  expect(captured.candidate.reviewStatus).toBe("RAW_CAPTURE_REVIEW_REQUIRED");

  const sense = captured.candidate.senseCandidates[0];
  const built = buildOfflineSourceEntrySnapshotV0_1({
    builderVersion: OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1,
    sourceTraditionId: captured.candidate.sourceTraditionId,
    sourceUrlOrArchiveRef: captured.candidate.sourceUrlOrArchiveRef,
    sourceDateOrVersion: captured.candidate.sourceDateOrVersionCandidate,
    entryHeadword: captured.candidate.headwordCandidates[0],
    entryLocator: captured.candidate.entryLocatorCandidates[0],
    senseLabel: sense.label,
    attestedForm: captured.candidate.attestedFormCandidates[0],
    attestedGloss: sense.text,
  });
  expect(built.ok).toBe(true);
  if (!built.ok) throw new Error(built.reasonCodes.join(", "));
  return { captured, snapshot: built.snapshot };
}

function compileFromRaw(
  rawSources: readonly any[],
  packet: any,
) {
  const candidates = rawSources.map((raw) => {
    const { snapshot } = buildFromRaw(raw);
    const extracted = extractOfflineSourceEntryFactsV0_1(snapshot);
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
      throw new Error("raw capture pipeline rejected source");
    }
    return adapted.candidate;
  });

  const reviewed = {
    ...packet,
    sources: packet.sources.map((source: any, index: number) => {
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

  return compileOpenInstrumentResearchEvidencePacketInputV0_1(reviewed);
}

describe("Open Instrument raw source entry capture v0.1", () => {
  it.each([
    ["bread FJALË", breadFjaleRaw, breadFjaleSnapshot],
    ["bread Lewis & Short", breadLewisShortRaw, breadLewisShortSnapshot],
    ["hope FJALË", hopeFjaleRaw, hopeFjaleSnapshot],
    ["hope Lewis & Short", hopeLewisShortRaw, hopeLewisShortSnapshot],
  ])("extracts review-required candidates for %s", (_label, raw, expectedSnapshot) => {
    const { captured, snapshot } = buildFromRaw(raw);

    expect(captured.candidate.headwordCandidates).toEqual([
      expectedSnapshot.entry.headword,
    ]);
    expect(captured.candidate.entryLocatorCandidates).toEqual([
      expectedSnapshot.entry.locator,
    ]);
    expect(captured.candidate.attestedFormCandidates).toEqual(
      expectedSnapshot.entry.attestedForms,
    );
    expect(captured.candidate.attestedGlossCandidates).toEqual([
      expectedSnapshot.entry.senses[0].text,
    ]);
    expect(captured.candidate.diagnostics).toEqual(["REVIEW_REQUIRED"]);
    expect(snapshot).toEqual(expectedSnapshot);

    for (const field of FORBIDDEN_FIELDS) {
      expect(captured.candidate).not.toHaveProperty(field);
    }
  });

  it("preserves multiple FJALË senses without selecting one", () => {
    const result = captureRawSourceEntryV0_1({
      ...breadFjaleRaw,
      rawEntryText: `${breadFjaleRaw.rawEntryText}\n2. a second source-visible sense`,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.diagnostics.join(", "));
    expect(result.candidate.senseCandidates).toEqual([
      {
        label: "sense 1",
        text: breadFjaleSnapshot.entry.senses[0].text,
      },
      {
        label: "sense 2",
        text: "a second source-visible sense",
      },
    ]);
    expect(result.candidate.diagnostics).toEqual([
      "MULTIPLE_SENSES_REVIEW_REQUIRED",
      "REVIEW_REQUIRED",
    ]);
  });

  it("preserves multiple Lewis & Short senses without selecting one", () => {
    const result = captureRawSourceEntryV0_1({
      ...breadLewisShortRaw,
      rawEntryText: `${breadLewisShortRaw.rawEntryText}\n2. another source-visible sense`,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.diagnostics.join(", "));
    expect(result.candidate.senseCandidates).toHaveLength(2);
    expect(result.candidate.diagnostics).toEqual([
      "MULTIPLE_SENSES_REVIEW_REQUIRED",
      "REVIEW_REQUIRED",
    ]);
  });

  it.each([
    ["unknown tradition", { sourceTraditionId: "unknown.v0_1" }, "UNSUPPORTED_SOURCE_TRADITION"],
    ["missing URL", { sourceUrlOrArchiveRef: "   " }, "SOURCE_URL_MISSING"],
    ["missing raw text", { rawEntryText: "   " }, "RAW_CAPTURE_INVALID"],
    ["bad date", { sourceDateOrVersion: 20260907 }, "INVALID_OPTIONAL_DATE_VERSION"],
    ["bad version", { captureVersion: "wrong.v0_1" }, "RAW_CAPTURE_INVALID"],
  ])("fails closed for %s", (_label, override, reasonCode) => {
    const result = captureRawSourceEntryV0_1({
      ...breadFjaleRaw,
      ...override,
    });
    expect(result).toEqual({
      ok: false,
      candidate: null,
      diagnostics: expect.arrayContaining([reasonCode]),
      reviewStatus: "REVIEW_REQUIRED",
    });
  });

  it.each([
    ["bread", [breadFjaleRaw, breadLewisShortRaw], breadPacket],
    ["hope", [hopeFjaleRaw, hopeLewisShortRaw], hopePacket],
  ])("preserves %s evidence through the existing compiler", (_word, raws, packet) => {
    const compiled = compileFromRaw(raws, packet);
    const catalogRows = catalog.rows.filter((row) =>
      compiled.some((compiledRow) => compiledRow.researchEvidenceId === row.researchEvidenceId),
    );
    expect(catalogRows).toEqual(compiled);
  });

  it("uses the declared capture version", () => {
    expect(breadFjaleRaw.captureVersion).toBe(
      OPEN_INSTRUMENT_RAW_SOURCE_ENTRY_CAPTURE_VERSION_V0_1,
    );
  });
});
