import { NextRequest } from "next/server";

import { GET } from "@/app/api/analyze-v1/route";
import { loadMultiSourceFunctionalResearchEvidenceCatalogV0_1 } from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import type { AnalysisStatusCodeV0_1 } from "@/shared/analysisStatus.v0_1";
import {
  validateCohortGEvidencePacketV0_1,
  type CohortGEvidencePacketPolicyV0_1,
} from "@/tests/helpers/openInstrumentCohortGEvidencePacketValidator.v0_1";

type CohortGCaseV0_1 = {
  targetWord: string;
  targetSenseId: string;
  expectedEmbryos: readonly string[];
  expectedForms: readonly string[];
  expectedSourceIds: readonly string[];
};

const COHORT_G_CASES_V0_1: readonly CohortGCaseV0_1[] = [
  {
    targetWord: "build",
    targetSenseId: "physical_construction",
    expectedEmbryos: ["NDËRTOJ", "οἰκοδομέω"],
    expectedForms: ["ndërtoj", "οἰκοδομέω"],
    expectedSourceIds: [
      "research.external.albanian-ndertoj-build.scale50.cohortG.v0_1",
      "research.external.greek-oikodomeo-build.scale50.cohortG.v0_1",
    ],
  },
  {
    targetWord: "carry",
    targetSenseId: "physical_bearing_transport",
    expectedEmbryos: ["MBAJ", "φέρω"],
    expectedForms: ["mbaj", "φέρω"],
    expectedSourceIds: [
      "research.external.albanian-mbaj-carry.scale50.cohortG.v0_1",
      "research.external.greek-phero-carry.scale50.cohortG.v0_1",
    ],
  },
  {
    targetWord: "man",
    targetSenseId: "adult_male_human",
    expectedEmbryos: ["BURRË", "VĬR"],
    expectedForms: ["burrë", "vĭr"],
    expectedSourceIds: [
      "research.external.albanian-burre-man.scale50.cohortG.v0_1",
      "research.external.latin-vir-man.scale50.cohortG.v0_1",
    ],
  },
  {
    targetWord: "freedom",
    targetSenseId: "liberty_absence_of_restraint",
    expectedEmbryos: ["LIRI", "LĪBERTAS"],
    expectedForms: ["liri", "lībertas"],
    expectedSourceIds: [
      "research.external.albanian-liri-freedom.scale50.cohortG.v0_1",
      "research.external.latin-libertas-freedom.scale50.cohortG.v0_1",
    ],
  },
];

const PRE_COHORT_G_NULL_TARGETS_V0_1 = new Set([
  "build",
  "carry",
  "man",
  "freedom",
  "justice",
]);

function policyFor(
  target: CohortGCaseV0_1,
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

function researchCandidatesV0_1(body: Record<string, unknown>): Array<Record<string, unknown>> {
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

describe("Open Instrument SCALE-50 Cohort G v0.1", () => {
  jest.setTimeout(180_000);

  it("admits only the four approved Null targets through the packet contract", async () => {
    const rows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();
    expect(rows).toHaveLength(78);

    for (const target of COHORT_G_CASES_V0_1) {
      expect(PRE_COHORT_G_NULL_TARGETS_V0_1.has(target.targetWord)).toBe(true);

      const targetRows = rows.filter((row) =>
        row.functionalHypotheses.some(
          (hypothesis) =>
            hypothesis.targetWord === target.targetWord &&
            hypothesis.targetSenseId === target.targetSenseId,
        ),
      );

      const result = validateCohortGEvidencePacketV0_1(
        targetRows,
        policyFor(target),
      );
      expect(result.ready).toBe(true);
      expect(result.reasonCodes).toEqual([]);
      expect(result.provenanceGroupIds).toHaveLength(2);

      expect(targetRows.map((row) => row.researchEvidenceId)).toEqual(
        expect.arrayContaining(target.expectedSourceIds),
      );
      expect(targetRows).toHaveLength(2);
      expect(targetRows.map((row) => row.form)).toEqual(
        expect.arrayContaining(target.expectedForms),
      );

      for (const row of targetRows) {
        expect(target.expectedEmbryos).toContain(row.embryo);
        expect(row.citations[0]?.attestedForm).toBe(row.form);
        expect(row.attestationTruth).toBe("fact");
        expect(row.sourceStatus).toBe("research_candidate");
        expect(row.functionalHypotheses[0]?.functionalBridgeTruth).toBe("hypothesis");
        expect(row.functionalHypotheses[0]?.claimBoundary).toBe(
          "functional_hypothesis_only",
        );
        expect(row.historicalOriginClaim).toBe("not_claimed");
        expect(row.historicalTransmissionClaim).toBe("not_claimed");
        expect(row.winnerClaim).toBe("not_claimed");
        expect(row.languageSuperiorityClaim).toBe("not_claimed");
        expect(row.candidateTruthClaim).toBe("not_claimed");
        expect(row.userDecisionPosture).toBe("user_decides");
        expect(row.citations[0]?.provenanceGroupId).toBeTruthy();
      }

      const body = await analyzeV0_1(target.targetWord);
      const status = (body.analysisStatusV0_1 as Record<string, unknown>).status;
      expect(status as AnalysisStatusCodeV0_1).toBe("research_functional_hypothesis");
      expect(
        new Set(
          (body.analysisStatusV0_1 as Record<string, unknown>)
            .researchHypothesisEmbryos as string[],
        ),
      ).toEqual(new Set(target.expectedEmbryos));

      const candidates = researchCandidatesV0_1(body);
      expect(candidates).toHaveLength(2);
      expect(new Set(candidates.map((candidate) => candidate.sourceId))).toEqual(
        new Set(target.expectedSourceIds),
      );
      expect(candidates.every((candidate) => candidate.targetWord === target.targetWord)).toBe(
        true,
      );
      expect(candidates.every((candidate) => candidate.candidateTruthClaim === "not_claimed")).toBe(
        true,
      );
    }
  });

  it("keeps justice Null and preserves legacy Null controls", async () => {
    for (const word of ["justice", "stone", "wind"]) {
      const body = await analyzeV0_1(word);
      expect(
        (body.analysisStatusV0_1 as Record<string, unknown>).status,
      ).toBe("null_no_supported_candidate");
      expect(researchCandidatesV0_1(body)).toEqual([]);
    }
  });
});
