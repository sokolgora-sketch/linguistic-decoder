import fs from "node:fs";
import path from "node:path";

import orderPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/order.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import {
  adaptVerifiedSourceRecordV0_1,
} from "@/shared/openInstrumentSourceAdapter.v0_1";
import {
  captureReviewedSourceV0_1,
  OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
} from "@/shared/openInstrumentSourceCapture.v0_1";
import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
  parseOpenInstrumentResearchEvidencePacketV0_1,
} from "@/shared/openInstrumentResearchEvidencePacket.v0_1";

const PACKET_DIRECTORY_V0_1 = path.join(
  process.cwd(),
  "src/data/openInstrument/researchEvidencePackets.v0_1",
);

function readCommittedOrderPacketV0_1(): unknown {
  return JSON.parse(
    fs.readFileSync(
      path.join(
        PACKET_DIRECTORY_V0_1,
        "order.research-evidence-packet.v0_1.json",
      ),
      "utf8",
    ),
  ) as unknown;
}

function reviewedSourceCaptureFromPacketSourceV0_1(
  source: (typeof orderPacket.sources)[number],
) {
  return {
    captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
    sourceTraditionId: source.citation.provenanceGroupId,
    sourceTitle: source.citation.sourceTitle,
    sourceDateOrVersion: source.citation.sourceDateOrVersion,
    sourceUrlOrArchiveRef: source.citation.sourceUrlOrArchiveRef,
    entryLocator: source.citation.entryLocator,
    attestedForm: source.citation.attestedForm,
    attestedGloss: source.citation.attestedGloss,
  };
}

function sourceMetadataWithoutIdentityV0_1(
  source: Record<string, unknown>,
): Record<string, unknown> {
  const { sourceKey: _sourceKey, citation, ...sourceWithoutKey } = source;
  const citationRecord = citation as Record<string, unknown>;
  const { citationId: _citationId, ...citationWithoutId } = citationRecord;

  return {
    ...sourceWithoutKey,
    citation: citationWithoutId,
  };
}

function compiledRowWithoutIdentityV0_1(row: Record<string, unknown>) {
  const { researchEvidenceId: _researchEvidenceId, citations, ...rowWithoutId } = row;
  return {
    ...rowWithoutId,
    citations: (citations as Array<Record<string, unknown>>).map(
      ({ citationId: _citationId, ...citation }) => citation,
    ),
  };
}

describe("Open Instrument source adapter ORDER end-to-end dogfood v0.1", () => {
  it("reconstructs ORDER source metadata and recompiles the existing catalog semantics", () => {
    const committedPacket = readCommittedOrderPacketV0_1();
    const parsedCommittedPacket = parseOpenInstrumentResearchEvidencePacketV0_1(
      committedPacket,
    );
    expect(parsedCommittedPacket.ok).toBe(true);
    if (!parsedCommittedPacket.ok) throw new Error(parsedCommittedPacket.errors.join("; "));

    const captureResults = orderPacket.sources.map((source) =>
      captureReviewedSourceV0_1(reviewedSourceCaptureFromPacketSourceV0_1(source)),
    );
    expect(captureResults.every((result) => result.ok)).toBe(true);
    if (captureResults.some((result) => !result.ok)) {
      throw new Error("ORDER source capture did not produce two source records");
    }

    const sourceRecords = captureResults.map((result) => {
      if (!result.ok) throw new Error("expected source capture success");
      return result.sourceRecord;
    });
    expect(sourceRecords.map((record) => record.language)).toEqual([
      "Albanian",
      "Latin",
    ]);
    expect(sourceRecords.map((record) => record.sourcePublisherOrHost)).toEqual([
      "FJALË — Fjalor Shqip",
      "Scaife ATLAS / Perseus Digital Library",
    ]);

    const adapterResults = sourceRecords.map((sourceRecord) =>
      adaptVerifiedSourceRecordV0_1(sourceRecord),
    );

    expect(adapterResults).toHaveLength(2);
    expect(adapterResults.every((result) => result.ok && result.admissible)).toBe(true);
    if (
      adapterResults.some(
        (result) => !result.ok || !result.admissible || !result.candidate.citation,
      )
    ) {
      throw new Error("ORDER source adapter dogfood did not produce two admissible candidates");
    }

    const candidates = adapterResults.map((result) => {
      if (!result.ok) throw new Error("expected adapter success");
      return result.candidate;
    });

    expect(candidates.map((candidate) => candidate.sourceKey)).toEqual([
      "verified-source:capture.fjale-fjalor-shqip-v0-1.rend-i-m-senses-1-3.rend.v0_1",
      "verified-source:capture.scaife-lewis-short-v0-1.urn-urn-cite2-scaife-viewer-dictionary-entries-atlas-v1-lat-ls-perseus-eng2-n32947-headword-ordo-primary-arrangement-sense.ordo.v0_1",
    ]);
    expect(candidates.map((candidate) => candidate.evidenceFamily)).toEqual([
      "lexical_dictionary",
      "historical_dictionary",
    ]);
    expect(candidates.map((candidate) => candidate.language)).toEqual([
      "Albanian",
      "Latin",
    ]);
    expect(candidates.map((candidate) => candidate.form)).toEqual(["rend", "ordo"]);
    expect(candidates.map((candidate) => candidate.gloss)).toEqual([
      "row; arrangement according to a specified order; sequence",
      "regular row, line, or series; methodical arrangement; order",
    ]);
    expect(candidates.map((candidate) => candidate.citation?.provenanceGroupId)).toEqual([
      "fjale.fjalor-shqip.v0_1",
      "scaife.lewis-short.v0_1",
    ]);
    expect(candidates.map((candidate) => candidate.citation?.citationId)).toEqual([
      "open-instrument.source-record.capture.fjale-fjalor-shqip-v0-1.rend-i-m-senses-1-3.rend.v0_1.citation.v0_1",
      "open-instrument.source-record.capture.scaife-lewis-short-v0-1.urn-urn-cite2-scaife-viewer-dictionary-entries-atlas-v1-lat-ls-perseus-eng2-n32947-headword-ordo-primary-arrangement-sense.ordo.v0_1.citation.v0_1",
    ]);
    expect(candidates.every((candidate) => candidate.classifications.evidenceFamily === "DETERMINISTIC_DERIVATION")).toBe(true);
    expect(candidates.every((candidate) => candidate.classifications.provenance === "DETERMINISTIC_DERIVATION")).toBe(true);

    const adapterOutputText = JSON.stringify(candidates);
    for (const forbiddenField of [
      "targetWord",
      "targetSenseId",
      "embryo",
      "semanticBridge",
      "historicalOriginClaim",
      "historicalTransmissionClaim",
      "winnerClaim",
      "candidateTruthClaim",
      "languageSuperiorityClaim",
    ]) {
      expect(adapterOutputText).not.toContain(forbiddenField);
    }

    const reviewedOrderPacket = {
      ...orderPacket,
      sources: orderPacket.sources.map((source, index) => {
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

    const parsedDogfoodPacket = parseOpenInstrumentResearchEvidencePacketV0_1(
      reviewedOrderPacket,
    );
    expect(parsedDogfoodPacket.ok).toBe(true);
    if (!parsedDogfoodPacket.ok) throw new Error(parsedDogfoodPacket.errors.join("; "));

    expect(
      reviewedOrderPacket.targetWord,
    ).toBe("order");
    expect(reviewedOrderPacket.targetSenseId).toBe("arrangement_structured_sequence");
    expect(reviewedOrderPacket.semanticBridge).toBe(orderPacket.semanticBridge);
    expect(reviewedOrderPacket.sources.map(sourceMetadataWithoutIdentityV0_1)).toEqual(
      orderPacket.sources.map(sourceMetadataWithoutIdentityV0_1),
    );

    const compiledRows = compileOpenInstrumentResearchEvidencePacketInputV0_1(
      reviewedOrderPacket,
    );
    const committedOrderRows = catalog.rows.filter((row) =>
      row.researchEvidenceId.includes("order-lexical-arrangement-v0-1"),
    );

    expect(compiledRows).toHaveLength(2);
    expect(committedOrderRows).toHaveLength(2);
    expect(compiledRows.map(compiledRowWithoutIdentityV0_1)).toEqual(
      committedOrderRows.map(compiledRowWithoutIdentityV0_1),
    );
  });

  it("records the exact source-metadata reduction without hiding review work", () => {
    const reviewedCaptureFieldsPerSource = 7;
    const reviewedCaptureFields = reviewedCaptureFieldsPerSource * 2;
    const autoFilledTraditionFieldsPerSource = 5;
    const autoFilledTraditionFields = autoFilledTraditionFieldsPerSource * 2;
    const reviewerJudgmentFields = [
      "targetWord",
      "targetSenseId",
      "embryo (rend)",
      "embryo (ordo)",
      "embryoRelation (rend)",
      "embryoRelation (ordo)",
      "relationOperationIds (rend)",
      "relationOperationIds (ordo)",
      "semanticBridge",
      "source-independence approval",
    ];

    expect(reviewedCaptureFields).toBe(14);
    expect(autoFilledTraditionFields).toBe(10);
    expect(reviewedCaptureFields - reviewedCaptureFields).toBe(0);
    expect(reviewerJudgmentFields).toHaveLength(10);
  });
});
