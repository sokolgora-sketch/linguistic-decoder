import { NextRequest } from "next/server";

import breakFjaleRaw from "./fixtures/openInstrument/rawSourceEntry/break.fjale.v0_1.json";
import breakLewisShortRaw from "./fixtures/openInstrument/rawSourceEntry/break.lewis-short.v0_1.json";
import breakFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/break.fjale.v0_1.json";
import breakLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/break.lewis-short.v0_1.json";
import breakPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/break.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import { GET } from "../app/api/analyze-v1/route";
import {
  captureRawSourceEntryV0_1,
} from "../src/shared/openInstrumentRawSourceEntryCapture.v0_1";
import {
  buildOfflineSourceEntrySnapshotV0_1,
  OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceSnapshotBuilder.v0_1";
import { extractOfflineSourceEntryFactsV0_1 } from "../src/shared/openInstrumentOfflineSourceEntryExtractor.v0_1";
import {
  captureReviewedSourceV0_1,
  OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceCapture.v0_1";
import { adaptVerifiedSourceRecordV0_1 } from "../src/shared/openInstrumentSourceAdapter.v0_1";
import {
  buildOpenInstrumentSourceReviewPacketV0_1,
  finalizeOpenInstrumentSourceReviewPacketV0_1,
  type OpenInstrumentSourceReviewPacketV0_1,
} from "../src/shared/openInstrumentSourceReviewPacket.v0_1";
import { compileOpenInstrumentResearchEvidencePacketInputV0_1 } from "../src/shared/openInstrumentResearchEvidencePacket.v0_1";
import { admitOpenInstrumentResearchCatalogV0_1 } from "../src/shared/openInstrumentResearchCatalogAdmission.v0_1";

const BREAK_ROWS = catalog.rows.filter((row) =>
  row.functionalHypotheses.some((hypothesis) => hypothesis.targetWord === "break"),
);
const PRE_ADMISSION_CATALOG = {
  catalogVersion: catalog.catalogVersion,
  rows: catalog.rows.filter((row) => !BREAK_ROWS.includes(row)),
};

function candidatesFromVerifiedSources() {
  return [
    [breakFjaleRaw, breakFjaleSnapshot],
    [breakLewisShortRaw, breakLewisShortSnapshot],
  ].map(([raw, expectedSnapshot]) => {
    const captured = captureRawSourceEntryV0_1(raw);
    expect(captured.ok).toBe(true);
    if (!captured.ok) throw new Error(captured.diagnostics.join(", "));

    const sense = captured.candidate.senseCandidates[0];
    const snapshot = buildOfflineSourceEntrySnapshotV0_1({
      builderVersion: OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1,
      sourceTraditionId: captured.candidate.sourceTraditionId,
      sourceUrlOrArchiveRef: captured.candidate.sourceUrlOrArchiveRef,
      sourceDateOrVersion: captured.candidate.sourceDateOrVersionCandidate,
      entryHeadword: captured.candidate.headwordCandidates[0],
      entryLocator: captured.candidate.entryLocatorCandidates[0],
      senseLabel: sense?.label,
      attestedForm: captured.candidate.attestedFormCandidates[0],
      attestedGloss: sense?.text,
    });
    expect(snapshot.ok).toBe(true);
    if (!snapshot.ok) throw new Error(snapshot.reasonCodes.join(", "));
    expect(snapshot.snapshot).toEqual(expectedSnapshot);

    const extracted = extractOfflineSourceEntryFactsV0_1(snapshot.snapshot);
    expect(extracted.ok).toBe(true);
    if (!extracted.ok) throw new Error(extracted.diagnostics.join(", "));

    const capturedSource = captureReviewedSourceV0_1({
      captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
      sourceTraditionId: extracted.candidate.sourceTraditionId,
      sourceDateOrVersion: extracted.candidate.sourceDateOrVersion,
      sourceUrlOrArchiveRef: extracted.candidate.sourceUrlOrArchiveRef,
      entryLocator: extracted.candidate.entryLocatorCandidates[0],
      attestedForm: extracted.candidate.attestedFormCandidates[0],
      attestedGloss: extracted.candidate.attestedGlossCandidates[0],
    });
    expect(capturedSource.ok).toBe(true);
    if (!capturedSource.ok) throw new Error(capturedSource.reasonCodes.join(", "));

    const adapted = adaptVerifiedSourceRecordV0_1(capturedSource.sourceRecord);
    expect(adapted.ok && adapted.admissible).toBe(true);
    if (!adapted.ok || !adapted.admissible) throw new Error(adapted.reasonCodes.join(", "));
    return adapted.candidate;
  });
}

function acceptReview(
  review: OpenInstrumentSourceReviewPacketV0_1,
): OpenInstrumentSourceReviewPacketV0_1 {
  return {
    ...review,
    targetSenseId: { ...review.targetSenseId, decision: "accepted" },
    semanticBridge: { ...review.semanticBridge, decision: "accepted" },
    sources: review.sources.map((source) => ({
      ...source,
      proposedEmbryo: { ...source.proposedEmbryo, decision: "accepted" },
      proposedEmbryoRelation: { ...source.proposedEmbryoRelation, decision: "accepted" },
      proposedRelationOperationIds: { ...source.proposedRelationOperationIds, decision: "accepted" },
      sourceReviewDecision: "accepted",
    })),
    provenanceIndependenceDecision: "accepted",
    overallDecision: "accepted",
  };
}

function reviewedBreakPacket() {
  const review = buildOpenInstrumentSourceReviewPacketV0_1({
    reviewPacketId: breakPacket.packetId,
    targetWord: breakPacket.targetWord,
    targetSenseId: breakPacket.targetSenseId,
    semanticBridge: breakPacket.semanticBridge,
    candidates: candidatesFromVerifiedSources(),
  });
  const finalized = finalizeOpenInstrumentSourceReviewPacketV0_1(acceptReview(review));
  expect(finalized.ok).toBe(true);
  if (!finalized.ok) throw new Error(finalized.reasonCodes.join(", "));
  expect(finalized.packet).toEqual(breakPacket);
  return finalized.packet;
}

async function analyze(word: string) {
  return GET(
    new NextRequest(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );
}

describe("Open Instrument research catalog admission v0.1", () => {
  jest.setTimeout(180_000);

  it("admits compiler-generated BREAK rows through the complete reviewed pipeline", async () => {
    const packet = reviewedBreakPacket();
    const generatedRows = compileOpenInstrumentResearchEvidencePacketInputV0_1(packet);
    expect(generatedRows).toHaveLength(2);

    const admission = admitOpenInstrumentResearchCatalogV0_1(
      PRE_ADMISSION_CATALOG,
      generatedRows,
    );
    expect(admission.ok).toBe(true);
    if (!admission.ok) throw new Error(admission.reasonCodes.join(", "));
    expect(admission.dryRun).toMatchObject({
      currentRowCount: 78,
      incomingRowCount: 2,
      resultRowCount: 80,
      wouldChange: true,
      collisions: [],
    });
    expect(admission.catalog.rows).toEqual(catalog.rows);

    const response = await analyze("break");
    expect(response.status).toBe(200);
    const body = (await response.json()) as Record<string, unknown>;
    expect((body.analysisStatusV0_1 as Record<string, unknown>).status).toBe(
      "research_functional_hypothesis",
    );
  });

  it("dry-runs without mutation and produces byte-stable output", () => {
    const generatedRows = compileOpenInstrumentResearchEvidencePacketInputV0_1(
      reviewedBreakPacket(),
    );
    const first = admitOpenInstrumentResearchCatalogV0_1(PRE_ADMISSION_CATALOG, generatedRows);
    const second = admitOpenInstrumentResearchCatalogV0_1(PRE_ADMISSION_CATALOG, generatedRows);
    expect(first).toEqual(second);
    expect(JSON.stringify(PRE_ADMISSION_CATALOG)).not.toContain("physical_break_damage");
  });

  it.each([
    ["duplicate researchEvidenceId", (rows: typeof BREAK_ROWS) => [...rows, rows[0]], "researchEvidenceId:"],
    ["duplicate citationId", (rows: typeof BREAK_ROWS) => [rows[0], { ...rows[1], citations: [{ ...rows[1].citations[0], citationId: rows[0].citations[0].citationId }] }], "citationId:"],
    ["duplicate source identity", (rows: typeof BREAK_ROWS) => [rows[0], { ...rows[1], citations: [{ ...rows[1].citations[0], sourceUrlOrArchiveRef: rows[0].citations[0].sourceUrlOrArchiveRef, entryLocator: rows[0].citations[0].entryLocator, attestedForm: rows[0].citations[0].attestedForm }] }], "sourceIdentity:"],
  ] as const)("rejects %s", (_name, mutate, reason) => {
    const result = admitOpenInstrumentResearchCatalogV0_1(PRE_ADMISSION_CATALOG, mutate(BREAK_ROWS));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reasonCodes.some((code) => code.startsWith(reason))).toBe(true);
  });

  it("rejects malformed rows and repeated admission", () => {
    const malformed = {
      ...BREAK_ROWS[0],
      attestationTruth: "inference",
    };
    const malformedResult = admitOpenInstrumentResearchCatalogV0_1(
      PRE_ADMISSION_CATALOG,
      [malformed, BREAK_ROWS[1]],
    );
    expect(malformedResult.ok).toBe(false);
    if (!malformedResult.ok) expect(malformedResult.reasonCodes).toContain(
      "malformedRow:" + BREAK_ROWS[0].researchEvidenceId + ":ATTESTATION_TRUTH_NOT_FACT",
    );

    const repeated = admitOpenInstrumentResearchCatalogV0_1(catalog, BREAK_ROWS);
    expect(repeated.ok).toBe(false);
    if (!repeated.ok) expect(repeated.reasonCodes.some((code) => code.startsWith("researchEvidenceId:"))).toBe(true);
  });

  it("preserves protected Null controls after BREAK admission", async () => {
    for (const word of ["justice", "wind", "mouth", "drink", "time", "work", "stone", "head", "hear", "death", "home"]) {
      const response = await analyze(word);
      expect(response.status).toBe(200);
      const body = (await response.json()) as Record<string, unknown>;
      expect((body.analysisStatusV0_1 as Record<string, unknown>).status).toBe(
        "null_no_supported_candidate",
      );
    }
  });
});
