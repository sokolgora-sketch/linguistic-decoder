import { NextRequest } from "next/server";

import waterPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/water.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import { GET } from "@/app/api/analyze-v1/route";
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
import {
  validateCohortGEvidencePacketV0_1,
} from "@/tests/helpers/openInstrumentCohortGEvidencePacketValidator.v0_1";

const CAPTURE_FIELDS_PER_SOURCE_V0_1 = 6;
const MANUALLY_ENTERED_CAPTURE_FIELDS_V0_1 =
  CAPTURE_FIELDS_PER_SOURCE_V0_1 * 2 + 1;
const AUTO_FILLED_TRADITION_FIELDS_V0_1 = 5 * 2;
const HUMAN_SEMANTIC_JUDGMENT_FIELDS_V0_1 = 10;
const PRE_PILOT_WATER_ROWS_V0_1 = catalog.rows.filter(
  (row) => row.functionalHypotheses.some((hypothesis) => hypothesis.targetWord === "water"),
);

function captureSourceV0_1(overrides: Record<string, unknown>) {
  return captureReviewedSourceV0_1({
    captureVersion: OPEN_INSTRUMENT_SOURCE_CAPTURE_VERSION_V0_1,
    sourceTraditionId: "fjale.fjalor-shqip.v0_1",
    sourceDateOrVersion:
      overrides.sourceTraditionId === "scaife.lewis-short.v0_1"
        ? "Lewis & Short; accessed 2026-09-07"
        : "accessed 2026-09-07",
    sourceUrlOrArchiveRef: "https://fjale.al/uj%C3%AB",
    entryLocator: "UJË m.sh.; sense 1",
    attestedForm: "ujë",
    attestedGloss:
      "Lëng pa ngjyrë, pa erë, i përbërë nga oksigjeni dhe hidrogjeni; përdoret për t’u pirë, për të larë etj.",
    ...overrides,
  });
}

async function analyzeV0_1(word: string): Promise<Record<string, unknown>> {
  const response = await GET(
    new NextRequest(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );
  expect(response.status).toBe(200);
  return (await response.json()) as Record<string, unknown>;
}

describe("Open Instrument live source intake WATER pilot v0.1", () => {
  jest.setTimeout(180_000);

  it("captures, adapts, reviews, compiles, and matches the committed catalog rows", () => {
    const captureResults = [
      captureSourceV0_1({
        sourceTitle: undefined,
        sourceTraditionId: "fjale.fjalor-shqip.v0_1",
      }),
      captureSourceV0_1({
        sourceTraditionId: "scaife.lewis-short.v0_1",
        sourceTitle: "Lewis & Short Latin Dictionary — aqua",
        sourceUrlOrArchiveRef:
          "https://atlas.perseus.tufts.edu/dictionaries/entry/urn%3Acite2%3Ascaife-viewer%3Adictionary-entries.atlas_v1%3Alat.ls.perseus-eng2-n3259/",
        entryLocator:
          "headword ăqua; general water sense; entry text beginning Water, in its most gen. signif.",
        attestedForm: "ăqua",
        attestedGloss:
          "water, in its most general signification; rainwater, river-water, sea-water, etc.",
      }),
    ];

    expect(captureResults.every((result) => result.ok)).toBe(true);
    if (captureResults.some((result) => !result.ok)) return;

    const sourceRecords = captureResults.map((result) => result.sourceRecord);
    expect(sourceRecords.map((record) => record.language)).toEqual([
      "Albanian",
      "Latin",
    ]);
    expect(sourceRecords[0].sourceTitle).toBe("FJALË — Fjalor Shqip");

    const adapterResults = sourceRecords.map((record) =>
      adaptVerifiedSourceRecordV0_1(record),
    );
    expect(adapterResults.every((result) => result.ok && result.admissible)).toBe(true);
    if (
      adapterResults.some(
        (result) => !result.ok || !result.admissible || !result.candidate.citation,
      )
    ) return;

    const candidates = adapterResults.map((result) => {
      if (!result.ok) throw new Error("expected adapter success");
      return result.candidate;
    });
    expect(candidates.map((candidate) => candidate.citation?.provenanceGroupId)).toEqual([
      "fjale.fjalor-shqip.v0_1",
      "scaife.lewis-short.v0_1",
    ]);
    expect(JSON.stringify(candidates)).not.toContain("targetWord");
    expect(JSON.stringify(candidates)).not.toContain("semanticBridge");

    const reviewedPacket = {
      ...waterPacket,
      sources: waterPacket.sources.map((source, index) => {
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
    const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(reviewedPacket);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    const compiledRows = compileOpenInstrumentResearchEvidencePacketInputV0_1(
      reviewedPacket,
    );
    const catalogRows = catalog.rows.filter((row) =>
      compiledRows.some((compiled) => compiled.researchEvidenceId === row.researchEvidenceId),
    );
    expect(catalogRows).toEqual(compiledRows);

    const readiness = validateCohortGEvidencePacketV0_1(compiledRows, {
      targetWord: "water",
      targetSenseId: "physical_water_liquid",
      minimumRows: 2,
      minimumProvenanceGroups: 2,
    });
    expect(readiness).toMatchObject({
      ready: true,
      reasonCodes: [],
      acceptedResearchEvidenceIds: expect.arrayContaining(
        compiledRows.map((row) => row.researchEvidenceId),
      ),
      provenanceGroupIds: [
        "fjale.fjalor-shqip.v0_1",
        "scaife.lewis-short.v0_1",
      ],
    });
    expect(compiledRows.every((row) => row.attestationTruth === "fact")).toBe(true);
    expect(compiledRows.every((row) => row.sourceStatus === "research_candidate")).toBe(true);
    expect(compiledRows.every((row) => row.historicalOriginClaim === "not_claimed")).toBe(true);
    expect(compiledRows.every((row) => row.historicalTransmissionClaim === "not_claimed")).toBe(true);
    expect(compiledRows.every((row) => row.winnerClaim === "not_claimed")).toBe(true);
    expect(compiledRows.every((row) => row.candidateTruthClaim === "not_claimed")).toBe(true);
    expect(compiledRows.every((row) => row.userDecisionPosture === "user_decides")).toBe(true);
  });

  it("records the exact intake boundary and preserves the pilot catalog invariant", () => {
    expect(PRE_PILOT_WATER_ROWS_V0_1).toHaveLength(2);
    expect(MANUALLY_ENTERED_CAPTURE_FIELDS_V0_1).toBe(13);
    expect(AUTO_FILLED_TRADITION_FIELDS_V0_1).toBe(10);
    expect(HUMAN_SEMANTIC_JUDGMENT_FIELDS_V0_1).toBe(10);
    expect(catalog.rows).toHaveLength(78);
    expect(catalog.rows.filter((row) => row.functionalHypotheses.some((hypothesis) => hypothesis.targetWord === "water"))).toHaveLength(2);
  });

  it("promotes only WATER at runtime and preserves the protected Null controls", async () => {
    const water = await analyzeV0_1("water");
    const waterStatus = water.analysisStatusV0_1 as Record<string, unknown>;
    expect(waterStatus.status).toBe("research_functional_hypothesis");
    expect(waterStatus.researchHypothesisEmbryos).toEqual(
      expect.arrayContaining(["ujë", "ăqua"]),
    );
    expect(
      (water.candidates as Array<Record<string, unknown>>).filter(
        (candidate) => candidate.sourceKind === "multi_source_research_witness",
      ),
    ).toHaveLength(2);

    for (const word of [
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
    ]) {
      const body = await analyzeV0_1(word);
      expect((body.analysisStatusV0_1 as Record<string, unknown>).status).toBe(
        "null_no_supported_candidate",
      );
    }
  });
});
