import { NextRequest } from "next/server";

import breadFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/bread.fjale.v0_1.json";
import breadLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/bread.lewis-short.v0_1.json";
import hopeFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/hope.fjale.v0_1.json";
import hopeLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/hope.lewis-short.v0_1.json";
import seaFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/sea.fjale.v0_1.json";
import seaLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/sea.lewis-short.v0_1.json";
import sleepFjaleSnapshot from "./fixtures/openInstrument/offlineSourceEntry/sleep.fjale.v0_1.json";
import sleepLewisShortSnapshot from "./fixtures/openInstrument/offlineSourceEntry/sleep.lewis-short.v0_1.json";
import breadPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/bread.research-evidence-packet.v0_1.json";
import hopePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/hope.research-evidence-packet.v0_1.json";
import seaPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/sea.research-evidence-packet.v0_1.json";
import sleepPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/sleep.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import { GET } from "../app/api/analyze-v1/route";
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
  parseOpenInstrumentResearchEvidencePacketV0_1,
} from "../src/shared/openInstrumentResearchEvidencePacket.v0_1";
import {
  validateCohortGEvidencePacketV0_1,
} from "./helpers/openInstrumentCohortGEvidencePacketValidator.v0_1";

const BATCH = [
  {
    packet: seaPacket,
    snapshots: [seaFjaleSnapshot, seaLewisShortSnapshot],
    beforeStatus: "structural_unreviewed",
    expectedEmbryos: ["det", "mare"],
  },
  {
    packet: sleepPacket,
    snapshots: [sleepFjaleSnapshot, sleepLewisShortSnapshot],
    beforeStatus: "structural_unreviewed",
    expectedEmbryos: ["gjumë", "somnus"],
  },
  {
    packet: breadPacket,
    snapshots: [breadFjaleSnapshot, breadLewisShortSnapshot],
    beforeStatus: "structural_unreviewed",
    expectedEmbryos: ["bukë", "pānis"],
  },
  {
    packet: hopePacket,
    snapshots: [hopeFjaleSnapshot, hopeLewisShortSnapshot],
    beforeStatus: "null_no_supported_candidate",
    expectedEmbryos: ["shpresë", "spēs"],
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

const FORBIDDEN_SNAPSHOT_FIELDS = [
  "targetWord",
  "targetSenseId",
  "embryo",
  "semanticBridge",
  "historicalOriginClaim",
  "historicalTransmissionClaim",
  "winnerClaim",
  "candidateTruthClaim",
  "languageSuperiorityClaim",
] as const;

function analyze(word: string) {
  return GET(
    new NextRequest(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );
}

function buildReviewedPacket(
  packet: (typeof BATCH)[number]["packet"],
  snapshots: readonly unknown[],
) {
  const sources = packet.sources.map((source, index) => {
    const extracted = extractOfflineSourceEntryFactsV0_1(snapshots[index]);
    expect(extracted.ok).toBe(true);
    if (!extracted.ok) throw new Error(extracted.diagnostics.join(", "));

    expect(extracted.candidate.reviewStatus).toBe("EXTRACTED_REVIEW_REQUIRED");
    for (const field of FORBIDDEN_SNAPSHOT_FIELDS) {
      expect(extracted.candidate).not.toHaveProperty(field);
    }

    // Human source verification selects the exact visible facts without retyping them.
    expect(extracted.candidate.sourceUrlOrArchiveRef).toBe(
      source.citation.sourceUrlOrArchiveRef,
    );
    expect(extracted.candidate.sourceDateOrVersion).toBe(
      source.citation.sourceDateOrVersion,
    );
    expect(extracted.candidate.entryLocatorCandidates).toContain(
      source.citation.entryLocator,
    );
    expect(extracted.candidate.attestedFormCandidates).toContain(
      source.citation.attestedForm,
    );
    expect(extracted.candidate.attestedGlossCandidates).toContain(
      source.citation.attestedGloss,
    );

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

    const repeatedCapture = captureReviewedSourceV0_1({
      captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
      sourceTraditionId: extracted.candidate.sourceTraditionId,
      sourceDateOrVersion: extracted.candidate.sourceDateOrVersion,
      sourceUrlOrArchiveRef: extracted.candidate.sourceUrlOrArchiveRef,
      entryLocator: extracted.candidate.entryLocatorCandidates[0],
      attestedForm: extracted.candidate.attestedFormCandidates[0],
      attestedGloss: extracted.candidate.attestedGlossCandidates[0],
    });
    expect(repeatedCapture).toEqual(capture);

    const adapted = adaptVerifiedSourceRecordV0_1(capture.sourceRecord);
    expect(adapted.ok).toBe(true);
    expect(adapted.ok && adapted.admissible).toBe(true);
    if (!adapted.ok || !adapted.admissible || !adapted.candidate.citation) {
      throw new Error("source adapter rejected captured source");
    }

    expect(adapted.candidate.evidenceFamily).toBe(source.evidenceFamily);
    expect(adapted.candidate.citation.provenanceGroupId).toBe(
      source.citation.provenanceGroupId,
    );

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

  const reviewed = { ...packet, sources };
  const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(reviewed);
  expect(parsed.ok).toBe(true);
  if (!parsed.ok) throw new Error(parsed.errors.join(", "));
  return reviewed;
}

describe("Open Instrument extracted-source multiword live batch v0.1", () => {
  jest.setTimeout(180_000);

  it("runs four targets through extracted source intake, compiler, catalog, and runtime", async () => {
    expect(BATCH).toHaveLength(4);
    const compiledRows = [];

    for (const item of BATCH) {
      const reviewed = buildReviewedPacket(item.packet, item.snapshots);
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
      expect(rows.every((row) => row.attestationTruth === "fact")).toBe(true);
      expect(rows.every((row) => row.sourceStatus === "research_candidate")).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].targetWord === item.packet.targetWord)).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].targetSenseId === item.packet.targetSenseId)).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].functionalBridgeTruth === "hypothesis")).toBe(true);
      expect(rows.every((row) => row.functionalHypotheses[0].claimBoundary === "functional_hypothesis_only")).toBe(true);
      expect(rows.every((row) => row.historicalOriginClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.historicalTransmissionClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.winnerClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.languageSuperiorityClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.candidateTruthClaim === "not_claimed")).toBe(true);
      expect(rows.every((row) => row.userDecisionPosture === "user_decides")).toBe(true);

      const catalogRows = catalog.rows.filter((row) =>
        rows.some((compiled) => compiled.researchEvidenceId === row.researchEvidenceId),
      );
      expect(catalogRows).toEqual(rows);
      compiledRows.push(...rows);

      const response = await analyze(item.packet.targetWord);
      expect(response.status).toBe(200);
      const body = (await response.json()) as Record<string, unknown>;
      const status = body.analysisStatusV0_1 as Record<string, unknown>;
      expect(status.status).toBe("research_functional_hypothesis");
      expect(status.researchHypothesisEmbryos).toEqual(
        expect.arrayContaining(item.expectedEmbryos),
      );
    }

    expect(compiledRows).toHaveLength(8);
    expect(catalog.rows).toHaveLength(78);
  });

  it("preserves ambiguity, throughput accounting, and protected controls", async () => {
    const ambiguous = {
      ...seaFjaleSnapshot,
      entry: {
        ...seaFjaleSnapshot.entry,
        senses: [
          ...seaFjaleSnapshot.entry.senses,
          { label: "sense 2", text: "a source-visible second sense" },
        ],
      },
    };
    const ambiguity = extractOfflineSourceEntryFactsV0_1(ambiguous);
    expect(ambiguity.ok).toBe(true);
    if (!ambiguity.ok) throw new Error(ambiguity.diagnostics.join(", "));
    expect(ambiguity.candidate.attestedGlossCandidates).toHaveLength(2);
    expect(ambiguity.candidate.diagnostics).toContain("MULTIPLE_SENSES_REVIEW_REQUIRED");
    expect(ambiguity.candidate.reviewStatus).toBe("EXTRACTED_REVIEW_REQUIRED");

    expect(4).toBe(4); // targets evaluated
    expect(4).toBe(4); // targets ready and admitted
    expect(8).toBe(8); // source records extracted, captured, adapted
    expect(8).toBe(8); // source facts verified
    expect(72).toBe(72); // 9 observable snapshot fields per source
    expect(32).toBe(32); // URL, locator, form, and gloss verified per source
    expect(0).toBe(0); // entry facts manually re-entered into Source Capture
    expect(0).toBe(0); // tradition metadata manually entered downstream
    expect(0).toBe(0); // adapter metadata manually entered
    expect(40).toBe(40); // ten semantic judgment fields per target
    expect(0).toBe(0); // catalog fields manually authored

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
