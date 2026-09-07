import treeFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/tree.fjale.v0_1.json";
import treeLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/tree.lewis-short.v0_1.json";
import snowFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/snow.fjale.v0_1.json";
import snowLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/snow.lewis-short.v0_1.json";
import treePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/tree.research-evidence-packet.v0_1.json";
import snowPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/snow.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import {
  extractOfflineSourceEntryFactsV0_1,
} from "../src/shared/openInstrumentOfflineSourceEntryExtractor.v0_1";
import {
  captureReviewedSourceV0_1,
  OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceCapture.v0_1";
import { adaptVerifiedSourceRecordV0_1 } from "../src/shared/openInstrumentSourceAdapter.v0_1";
import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
  parseOpenInstrumentResearchEvidencePacketV0_1,
} from "../src/shared/openInstrumentResearchEvidencePacket.v0_1";

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

function extract(value: unknown) {
  const result = extractOfflineSourceEntryFactsV0_1(value);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.diagnostics.join(", "));
  expect(result.candidate.reviewStatus).toBe("EXTRACTED_REVIEW_REQUIRED");
  for (const field of FORBIDDEN_FIELDS) {
    expect(result.candidate).not.toHaveProperty(field);
  }
  return result.candidate;
}

function reviewedPacketFromSnapshots(
  packet: typeof treePacket,
  snapshots: readonly unknown[],
) {
  const reviewedSources = packet.sources.map((source, index) => {
    const candidate = extract(snapshots[index]);
    const form = source.citation.attestedForm;
    const gloss = source.citation.attestedGloss;
    expect(candidate.headwordCandidates).toContain(source.citation.attestedForm === "pemë" ? "PEMË" : source.citation.attestedForm);
    expect(candidate.entryLocatorCandidates).toContain(source.citation.entryLocator);
    expect(candidate.attestedFormCandidates).toContain(form);
    expect(candidate.attestedGlossCandidates).toContain(gloss);

    const capture = captureReviewedSourceV0_1({
      captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
      sourceTraditionId: source.citation.provenanceGroupId,
      sourceDateOrVersion: source.citation.sourceDateOrVersion,
      sourceUrlOrArchiveRef: candidate.sourceUrlOrArchiveRef,
      entryLocator: source.citation.entryLocator,
      attestedForm: form,
      attestedGloss: gloss,
    });
    expect(capture.ok).toBe(true);
    if (!capture.ok) throw new Error(capture.reasonCodes.join(", "));

    const adapted = adaptVerifiedSourceRecordV0_1(capture.sourceRecord);
    expect(adapted.ok).toBe(true);
    expect(adapted.ok && adapted.admissible).toBe(true);
    if (!adapted.ok || !adapted.admissible || !adapted.candidate.citation) {
      throw new Error("source adapter rejected verified source");
    }

    return {
      sourceKey: adapted.candidate.sourceKey,
      embryo: source.embryo,
      evidenceFamily: adapted.candidate.evidenceFamily,
      language: adapted.candidate.language,
      form: adapted.candidate.form,
      gloss: adapted.candidate.gloss,
      embryoRelation: source.embryoRelation,
      relationOperationIds: source.relationOperationIds,
      citation: adapted.candidate.citation,
    };
  });

  const reviewed = { ...packet, sources: reviewedSources };
  const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(reviewed);
  expect(parsed.ok).toBe(true);
  if (!parsed.ok) throw new Error(parsed.errors.join(", "));
  return reviewed;
}

describe("Open Instrument offline source entry extractor v0.1", () => {
  it.each([
    ["tree FJALË", treeFjaleSnapshot],
    ["tree Lewis & Short", treeLewisShortSnapshot],
    ["snow FJALË", snowFjaleSnapshot],
    ["snow Lewis & Short", snowLewisShortSnapshot],
  ])("extracts observable facts for %s", (_name, snapshot) => {
    const candidate = extract(snapshot);
    expect(candidate.sourceSnapshotId).toMatch(/reviewed-2026-09-07/);
    expect(candidate.entryLocatorCandidates).toHaveLength(1);
    expect(candidate.attestedFormCandidates).toHaveLength(1);
    expect(candidate.attestedGlossCandidates).toHaveLength(1);
    expect(candidate.diagnostics).toEqual([]);
  });

  it("preserves ambiguity as review-required rather than selecting a sense", () => {
    const ambiguous = {
      ...treeFjaleSnapshot,
      entry: {
        ...treeFjaleSnapshot.entry,
        senses: [
          ...treeFjaleSnapshot.entry.senses,
          { label: "sense 3", text: "another source-visible sense" },
        ],
      },
    };
    const result = extractOfflineSourceEntryFactsV0_1(ambiguous);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.diagnostics.join(", "));
    expect(result.candidate.attestedGlossCandidates).toEqual([
      treeFjaleSnapshot.entry.senses[0].text,
      "another source-visible sense",
    ]);
    expect(result.candidate.diagnostics).toContain("MULTIPLE_SENSES_REVIEW_REQUIRED");
    expect(result.candidate.reviewStatus).toBe("EXTRACTED_REVIEW_REQUIRED");
  });

  it("fails closed for unsupported or malformed source snapshots", () => {
    const unsupported = extractOfflineSourceEntryFactsV0_1({
      ...treeFjaleSnapshot,
      sourceTraditionId: "unknown.dictionary.v0_1",
    });
    expect(unsupported).toEqual({
      ok: false,
      candidate: null,
      diagnostics: ["UNSUPPORTED_SOURCE_FORMAT"],
      reviewStatus: "REVIEW_REQUIRED",
    });

    const malformed = extractOfflineSourceEntryFactsV0_1({
      ...treeFjaleSnapshot,
      entry: { ...treeFjaleSnapshot.entry, attestedForms: [], senses: [] },
    });
    expect(malformed.ok).toBe(false);
    if (malformed.ok) throw new Error("expected malformed snapshot rejection");
    expect(malformed.diagnostics).toEqual([
      "ATTESTED_FORM_NOT_FOUND",
      "GLOSS_NOT_FOUND",
    ]);
  });

  it("dogfoods tree and snow through unchanged capture, adapter, packet, and compiler stages", () => {
    for (const [packet, snapshots] of [
      [treePacket, [treeFjaleSnapshot, treeLewisShortSnapshot]],
      [snowPacket, [snowFjaleSnapshot, snowLewisShortSnapshot]],
    ] as const) {
      const reviewed = reviewedPacketFromSnapshots(packet, snapshots);
      const compiled = compileOpenInstrumentResearchEvidencePacketInputV0_1(reviewed);
      const committed = catalog.rows.filter((row) =>
        compiled.some((candidate) => candidate.researchEvidenceId === row.researchEvidenceId),
      );
      expect(committed).toEqual(compiled);
    }
  });
});
