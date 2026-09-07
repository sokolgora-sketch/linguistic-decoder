import fs from "node:fs";
import path from "node:path";

import { NextRequest } from "next/server";

import { GET } from "@/app/api/analyze-v1/route";
import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
  parseOpenInstrumentResearchEvidencePacketV0_1,
} from "@/shared/openInstrumentResearchEvidencePacket.v0_1";
import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import type { AnalysisStatusCodeV0_1 } from "@/shared/analysisStatus.v0_1";
import {
  validateCohortGEvidencePacketV0_1,
  type CohortGEvidencePacketPolicyV0_1,
} from "@/tests/helpers/openInstrumentCohortGEvidencePacketValidator.v0_1";

type PilotTargetV0_1 = {
  targetWord: string;
  targetSenseId: string;
  packetFile: string;
  expectedRows: readonly {
    id: string;
    embryo: string;
    form: string;
    sourceFamily: string;
    provenanceGroupId: string;
  }[];
};

const PACKET_DIRECTORY_V0_1 = path.join(
  process.cwd(),
  "src/data/openInstrument/researchEvidencePackets.v0_1",
);

const PILOT_TARGETS_V0_1: readonly PilotTargetV0_1[] = [
  {
    targetWord: "order",
    targetSenseId: "arrangement_structured_sequence",
    packetFile: "order.research-evidence-packet.v0_1.json",
    expectedRows: [
      {
        id: "research.external.open-instrument-research-evidence-packet-v0-1.order-lexical-arrangement-v0-1.fjale-rend",
        embryo: "rend",
        form: "rend",
        sourceFamily: "lexical_dictionary",
        provenanceGroupId: "fjale.fjalor-shqip.v0_1",
      },
      {
        id: "research.external.open-instrument-research-evidence-packet-v0-1.order-lexical-arrangement-v0-1.lewis-short-ordo",
        embryo: "ordo",
        form: "ordo",
        sourceFamily: "historical_dictionary",
        provenanceGroupId: "scaife.lewis-short.v0_1",
      },
    ],
  },
  {
    targetWord: "change",
    targetSenseId: "become_different_alteration",
    packetFile: "change.research-evidence-packet.v0_1.json",
    expectedRows: [
      {
        id: "research.external.open-instrument-research-evidence-packet-v0-1.change-alteration-v0-1.fjale-ndryshim",
        embryo: "ndryshim",
        form: "ndryshim",
        sourceFamily: "lexical_dictionary",
        provenanceGroupId: "fjale.fjalor-shqip.v0_1",
      },
      {
        id: "research.external.open-instrument-research-evidence-packet-v0-1.change-alteration-v0-1.lewis-short-mutatio",
        embryo: "mūtātiō",
        form: "mūtātiō",
        sourceFamily: "historical_dictionary",
        provenanceGroupId: "scaife.lewis-short.v0_1",
      },
    ],
  },
];

const PRE_PILOT_NULL_TARGETS_V0_1 = new Set(["order", "change"]);

function readPacketV0_1(fileName: string): unknown {
  return JSON.parse(
    fs.readFileSync(path.join(PACKET_DIRECTORY_V0_1, fileName), "utf8"),
  ) as unknown;
}

function policyForV0_1(
  target: PilotTargetV0_1,
): CohortGEvidencePacketPolicyV0_1 {
  return {
    targetWord: target.targetWord,
    targetSenseId: target.targetSenseId,
    minimumRows: 2,
    minimumProvenanceGroups: 2,
  };
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

function researchCandidatesV0_1(
  body: Record<string, unknown>,
): Array<Record<string, unknown>> {
  const candidates = body.candidates;
  return Array.isArray(candidates)
    ? candidates.filter(
        (candidate): candidate is Record<string, unknown> =>
          typeof candidate === "object" &&
          candidate !== null &&
          !Array.isArray(candidate) &&
          candidate.sourceKind === "multi_source_research_witness",
      )
    : [];
}

describe("Open Instrument real evidence-packet compiler pilot v0.1", () => {
  jest.setTimeout(180_000);

  it("reproduces the four catalog rows from the two reviewed packets", () => {
    const catalogRows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();
    expect(catalogRows).toHaveLength(62);

    const compiledRows = PILOT_TARGETS_V0_1.flatMap((target) => {
      const parsed = parseOpenInstrumentResearchEvidencePacketV0_1(
        readPacketV0_1(target.packetFile),
      );
      expect(parsed.ok).toBe(true);
      if (!parsed.ok) throw new Error(parsed.errors.join("; "));

      const rows = compileOpenInstrumentResearchEvidencePacketInputV0_1(
        parsed.packet,
      );
      expect(rows).toHaveLength(2);
      return rows;
    });

    const pilotIds = new Set(compiledRows.map((row) => row.researchEvidenceId));
    const catalogPilotRows = catalogRows.filter((row) =>
      pilotIds.has(row.researchEvidenceId),
    );

    expect(catalogPilotRows).toEqual(compiledRows);
    expect(compiledRows.map((row) => row.researchEvidenceId)).toEqual(
      PILOT_TARGETS_V0_1.flatMap((target) =>
        target.expectedRows.map((expected) => expected.id),
      ),
    );
  });

  it("passes packet readiness and preserves source-family and truth boundaries", () => {
    for (const target of PILOT_TARGETS_V0_1) {
      const rows = compileOpenInstrumentResearchEvidencePacketInputV0_1(
        readPacketV0_1(target.packetFile),
      );
      const result = validateCohortGEvidencePacketV0_1(
        rows,
        policyForV0_1(target),
      );

      expect(result.ready).toBe(true);
      expect(result.reasonCodes).toEqual([]);
      expect(result.acceptedResearchEvidenceIds).toHaveLength(2);
      expect(result.provenanceGroupIds).toEqual([
        "fjale.fjalor-shqip.v0_1",
        "scaife.lewis-short.v0_1",
      ]);

      expect(rows.map((row) => ({
        id: row.researchEvidenceId,
        embryo: row.embryo,
        form: row.form,
        sourceFamily: row.evidenceFamily,
        provenanceGroupId: row.citations[0]?.provenanceGroupId,
      }))).toEqual(target.expectedRows);

      for (const row of rows) {
        expect(row.functionalHypotheses).toHaveLength(1);
        expect(row.functionalHypotheses[0]).toMatchObject({
          targetWord: target.targetWord,
          targetSenseId: target.targetSenseId,
          functionalBridgeTruth: "hypothesis",
          claimBoundary: "functional_hypothesis_only",
        });
        expect(row.attestationTruth).toBe("fact");
        expect(row.sourceStatus).toBe("research_candidate");
        expect(row.historicalOriginClaim).toBe("not_claimed");
        expect(row.historicalTransmissionClaim).toBe("not_claimed");
        expect(row.winnerClaim).toBe("not_claimed");
        expect(row.languageSuperiorityClaim).toBe("not_claimed");
        expect(row.candidateTruthClaim).toBe("not_claimed");
        expect(row.userDecisionPosture).toBe("user_decides");
      }
    }
  });

  it("moves only order and change from their pre-pilot Null state", async () => {
    for (const target of PILOT_TARGETS_V0_1) {
      expect(PRE_PILOT_NULL_TARGETS_V0_1.has(target.targetWord)).toBe(true);
      const body = await analyzeV0_1(target.targetWord);
      const status = (body.analysisStatusV0_1 as Record<string, unknown>).status;
      expect(status as AnalysisStatusCodeV0_1).toBe(
        "research_functional_hypothesis",
      );
      expect(
        (body.analysisStatusV0_1 as Record<string, unknown>)
          .researchHypothesisEmbryos,
      ).toEqual(expect.arrayContaining(target.expectedRows.map((row) => row.embryo)));
    }
  });

  it("keeps justice and all legacy Null controls isolated", async () => {
    const controls = [
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
    ];

    for (const word of ["justice", ...controls]) {
      const body = await analyzeV0_1(word);
      expect(
        (body.analysisStatusV0_1 as Record<string, unknown>).status,
      ).toBe("null_no_supported_candidate");
      expect(researchCandidatesV0_1(body)).toEqual([]);
    }
  });

  it("prevents target leakage from the pilot rows", async () => {
    const catalogRows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();
    const pilotIds = new Set(
      PILOT_TARGETS_V0_1.flatMap((target) =>
        target.expectedRows.map((expected) => expected.id),
      ),
    );

    for (const target of PILOT_TARGETS_V0_1) {
      const targetRows = catalogRows.filter((row) =>
        pilotIds.has(row.researchEvidenceId) &&
        row.functionalHypotheses.some(
          (hypothesis) => hypothesis.targetWord === target.targetWord,
        ),
      );
      expect(targetRows).toHaveLength(2);
      expect(
        targetRows.every((row) =>
          row.functionalHypotheses.every(
            (hypothesis) => hypothesis.targetWord === target.targetWord,
          ),
        ),
      ).toBe(true);
    }
  });
});
