import { NextRequest } from "next/server";

import artFjaleRaw from "./fixtures/openInstrument/rawSourceEntry/art.fjale.v0_1.json";
import artLewisShortRaw from "./fixtures/openInstrument/rawSourceEntry/art.lewis-short.v0_1.json";
import artFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/art.fjale.v0_1.json";
import artLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/art.lewis-short.v0_1.json";
import artPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/art.research-evidence-packet.v0_1.json";
import blueFjaleRaw from "./fixtures/openInstrument/rawSourceEntry/blue.fjale.v0_1.json";
import blueLewisShortRaw from "./fixtures/openInstrument/rawSourceEntry/blue.lewis-short.v0_1.json";
import blueFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/blue.fjale.v0_1.json";
import blueLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/blue.lewis-short.v0_1.json";
import bluePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/blue.research-evidence-packet.v0_1.json";
import starFjaleRaw from "./fixtures/openInstrument/rawSourceEntry/star.fjale.v0_1.json";
import starLewisShortRaw from "./fixtures/openInstrument/rawSourceEntry/star.lewis-short.v0_1.json";
import starFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/star.fjale.v0_1.json";
import starLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/star.lewis-short.v0_1.json";
import starPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/star.research-evidence-packet.v0_1.json";
import visionFjaleRaw from "./fixtures/openInstrument/rawSourceEntry/vision.fjale.v0_1.json";
import visionLewisShortRaw from "./fixtures/openInstrument/rawSourceEntry/vision.lewis-short.v0_1.json";
import visionFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/vision.fjale.v0_1.json";
import visionLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/vision.lewis-short.v0_1.json";
import visionPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/vision.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import { GET } from "../app/api/analyze-v1/route";
import {
  captureRawSourceEntryV0_1,
} from "../src/shared/openInstrumentRawSourceEntryCapture.v0_1";
import {
  buildOfflineSourceEntrySnapshotV0_1,
  OPEN_INSTRUMENT_SOURCE_SNAPSHOT_BUILDER_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceSnapshotBuilder.v0_1";
import {
  extractOfflineSourceEntryFactsV0_1,
} from "../src/shared/openInstrumentOfflineSourceEntryExtractor.v0_1";
import {
  captureReviewedSourceV0_1,
  OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
} from "../src/shared/openInstrumentSourceCapture.v0_1";
import {
  adaptVerifiedSourceRecordV0_1,
} from "../src/shared/openInstrumentSourceAdapter.v0_1";
import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
  parseOpenInstrumentResearchEvidencePacketV0_1,
} from "../src/shared/openInstrumentResearchEvidencePacket.v0_1";
import {
  validateCohortGEvidencePacketV0_1,
} from "./helpers/openInstrumentCohortGEvidencePacketValidator.v0_1";

const BATCH = [
  {
    packet: starPacket,
    raws: [starFjaleRaw, starLewisShortRaw],
    snapshots: [starFjaleSnapshot, starLewisShortSnapshot],
    beforeStatus: "structural_unreviewed",
  },
  {
    packet: artPacket,
    raws: [artFjaleRaw, artLewisShortRaw],
    snapshots: [artFjaleSnapshot, artLewisShortSnapshot],
    beforeStatus: "null_no_supported_candidate",
  },
  {
    packet: visionPacket,
    raws: [visionFjaleRaw, visionLewisShortRaw],
    snapshots: [visionFjaleSnapshot, visionLewisShortSnapshot],
    beforeStatus: "structural_unreviewed",
  },
  {
    packet: bluePacket,
    raws: [blueFjaleRaw, blueLewisShortRaw],
    snapshots: [blueFjaleSnapshot, blueLewisShortSnapshot],
    beforeStatus: "structural_unreviewed",
  },
] as const;

const PROTECTED_CONTROLS = [
  "justice",
  "wind",
  "mouth",
  "drink",
  "time",
  "work",
  "stone",
  "head",
  "hear",
  "death",
  "home",
] as const;

const RAW_CAPTURE_FIELDS = [
  "captureVersion",
  "sourceTraditionId",
  "sourceUrlOrArchiveRef",
  "sourceDateOrVersion",
  "rawEntryText",
] as const;

function analyze(word: string) {
  return GET(
    new NextRequest(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );
}

function buildReviewedPacket(item: (typeof BATCH)[number]) {
  const sources = item.raws.map((raw, index) => {
    expect(Object.keys(raw).sort()).toEqual([...RAW_CAPTURE_FIELDS].sort());

    const captured = captureRawSourceEntryV0_1(raw);
    expect(captured.ok).toBe(true);
    if (!captured.ok) throw new Error(captured.diagnostics.join(", "));
    expect(captured.candidate.reviewStatus).toBe("RAW_CAPTURE_REVIEW_REQUIRED");
    expect(captured.candidate.headwordCandidates).toEqual([
      item.snapshots[index].entry.headword,
    ]);
    expect(captured.candidate.entryLocatorCandidates).toEqual([
      item.snapshots[index].entry.locator,
    ]);
    expect(captured.candidate.attestedFormCandidates).toEqual(
      item.snapshots[index].entry.attestedForms,
    );
    expect(captured.candidate.attestedGlossCandidates).toEqual([
      item.snapshots[index].entry.senses[0].text,
    ]);

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
    expect(built.snapshot).toEqual(item.snapshots[index]);

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
      throw new Error("source adapter rejected captured source");
    }

    const source = item.packet.sources[index];
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

  const reviewed = { ...item.packet, sources };
  const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(reviewed);
  expect(parsed.ok).toBe(true);
  if (!parsed.ok) throw new Error(parsed.errors.join(", "));
  return reviewed;
}

describe("Open Instrument raw-capture multiword live batch v0.1", () => {
  jest.setTimeout(180_000);

  it("runs four fresh targets through raw capture, compiler, catalog, and runtime", async () => {
    const compiledRows = [];

    for (const item of BATCH) {
      const reviewed = buildReviewedPacket(item);
      const rows = compileOpenInstrumentResearchEvidencePacketInputV0_1(reviewed);
      const readiness = validateCohortGEvidencePacketV0_1(rows, {
        targetWord: item.packet.targetWord,
        targetSenseId: item.packet.targetSenseId,
        minimumRows: 2,
        minimumProvenanceGroups: 2,
      });

      expect(readiness.ready).toBe(true);
      expect(readiness.reasonCodes).toEqual([]);
      expect(readiness.provenanceGroupIds).toEqual([
        "fjale.fjalor-shqip.v0_1",
        "scaife.lewis-short.v0_1",
      ]);
      expect(new Set(rows.map((row) => row.researchEvidenceId)).size).toBe(2);
      expect(rows.every((row) => row.functionalHypotheses[0].targetWord === item.packet.targetWord)).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].targetSenseId === item.packet.targetSenseId)).toBe(true);
      expect(rows.every((row) => row.attestationTruth === "fact")).toBe(true);
      expect(rows.every((row) => row.sourceStatus === "research_candidate")).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].functionalBridgeTruth === "hypothesis")).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].claimBoundary === "functional_hypothesis_only")).toBe(true);
      expect(rows.every((row) => row.historicalOriginClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.historicalTransmissionClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.winnerClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.languageSuperiorityClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.candidateTruthClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.userDecisionPosture === "user_decides")).toBe(true);
      expect(catalog.rows.filter((row) => rows.some((compiled) => compiled.researchEvidenceId === row.researchEvidenceId))).toEqual(rows);
      compiledRows.push(...rows);

      const response = await analyze(item.packet.targetWord);
      expect(response.status).toBe(200);
      const body = (await response.json()) as Record<string, unknown>;
      const status = body.analysisStatusV0_1 as Record<string, unknown>;
      expect(item.beforeStatus).toMatch(/structural_unreviewed|null_no_supported_candidate/);
      expect(status.status).toBe("research_functional_hypothesis");
      expect(status.researchHypothesisEmbryos).toEqual(
        expect.arrayContaining(item.packet.sources.map((source) => source.embryo)),
      );
    }

    expect(compiledRows).toHaveLength(8);
    expect(catalog.rows).toHaveLength(80);
  });

  it("keeps raw capture judgment-free and protects controls", async () => {
    for (const item of BATCH) {
      for (const raw of item.raws) {
        expect(raw).not.toHaveProperty("targetWord");
        expect(raw).not.toHaveProperty("targetSenseId");
        expect(raw).not.toHaveProperty("embryo");
        expect(raw).not.toHaveProperty("semanticBridge");
      }
    }

    for (const word of PROTECTED_CONTROLS) {
      const response = await analyze(word);
      expect(response.status).toBe(200);
      const body = (await response.json()) as Record<string, unknown>;
      expect((body.analysisStatusV0_1 as Record<string, unknown>).status).toBe(
        "null_no_supported_candidate",
      );
    }
  });
});
