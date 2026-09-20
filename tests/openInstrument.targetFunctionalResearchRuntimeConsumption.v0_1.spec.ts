import {
  discoverTargetBoundFunctionalResearchWitnessesV0_1,
} from "@/shared/multiSourceFunctionalDiscovery.v0_1";
import {
  buildTargetBoundFunctionalResearchInputGroupsV0_1,
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
  type MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import {
  projectMultiSourceFunctionalResearchWitnessesV0_1,
} from "@/shared/multiSourceFunctionalResearchProjection.v0_1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

function targetBoundRow(
  index: number,
  overrides: Partial<MultiSourceFunctionalResearchEvidenceRowV0_1> = {},
): MultiSourceFunctionalResearchEvidenceRowV0_1 {
  return {
    registryVersion:
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
    researchEvidenceId: `fixture.target-bound.${index}`,
    embryo: "X",
    evidenceFamily: "lexical_dictionary",
    language: "Fixture Language",
    form: `Y-${index}`,
    gloss: `fixture source meaning ${index}`,
    embryoRelation: "no_structural_relation",
    relationOperationIds: [],
    attestationTruth: "fact",
    sourceStatus: "research_candidate",
    citations: [
      {
        citationId: `fixture.target-bound.citation.${index}`,
        sourceTitle: "Fixture source",
        sourceAuthorOrEditor: "Fixture editor",
        sourcePublisherOrHost: "Fixture host",
        sourceDateOrVersion: "Fixture version",
        sourceUrlOrArchiveRef: `fixture://target-bound/${index}`,
        entryLocator: `fixture entry ${index}`,
        sourceHashOrArchiveHash: null,
        attestedForm: `Y-${index}`,
        attestedGloss: `fixture source meaning ${index}`,
      },
    ],
    functionalHypotheses: [
      {
        targetWord: "fixture-target",
        targetSenseId: "fixture-sense",
        semanticBridge:
          "the source meaning may functionally correspond to the frozen target sense",
        functionalBridgeTruth: "hypothesis",
        claimBoundary: "functional_hypothesis_only",
      },
    ],
    historicalOriginClaim: "not_claimed",
    historicalTransmissionClaim: "not_claimed",
    winnerClaim: "not_claimed",
    languageSuperiorityClaim: "not_claimed",
    candidateTruthClaim: "not_claimed",
    userDecisionPosture: "user_decides",
    ...overrides,
  };
}

const genericRows = [
  targetBoundRow(1),
  targetBoundRow(2),
  targetBoundRow(3),
];

function mockRuntimeRows(): MultiSourceFunctionalResearchEvidenceRowV0_1[] {
  return [1, 2, 3].map((index) => {
    const row = targetBoundRow(index);
    return {
      ...row,
      researchEvidenceId: `fixture.data.target-bound.${index}`,
      form: `SOURCE-${index}`,
      functionalHypotheses: [
        {
          ...row.functionalHypotheses[0],
          targetWord: "data",
          targetSenseId: "fixture-sense",
        },
      ],
      citations: [
        {
          ...row.citations[0],
          citationId: `fixture.data.target-bound.citation.${index}`,
          attestedForm: `SOURCE-${index}`,
        },
      ],
    };
  });
}

jest.mock(
  "../src/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1",
  () => ({
    loadMultiSourceFunctionalResearchEvidenceCatalogV0_1: () =>
      mockRuntimeRows(),
  }),
);

describe(
  "Open Instrument target-bound functional research runtime consumption v0.1",
  () => {
    it(
      "keeps no-structural-relation witnesses target-bound and separate from structural discovery",
      () => {
        const groups =
          buildTargetBoundFunctionalResearchInputGroupsV0_1({
            targetWord: "fixture-target",
            targetSenseId: "fixture-sense",
            rows: genericRows,
          });

        expect(groups).toHaveLength(1);
        expect(groups[0]?.embryo).toBe("X");
        expect(groups[0]?.sources).toHaveLength(3);
        expect(
          groups[0]?.sources.map((source) => source.form),
        ).toEqual(["Y-1", "Y-2", "Y-3"]);

        const witnesses =
          discoverTargetBoundFunctionalResearchWitnessesV0_1({
            targetWord: "fixture-target",
            targetSenseId: "fixture-sense",
            embryo: "X",
            sources: groups[0]?.sources ?? [],
          });

        expect(witnesses).toHaveLength(3);
        for (const witness of witnesses) {
          expect(witness.embryoAuthority).toBe("target_bound_research");
          expect(witness.targetSenseId).toBe("fixture-sense");
          expect(witness.embryoRelation).toBe("no_structural_relation");
          expect(witness.relationOperationIds).toEqual([]);
          expect(witness.sourceForm).not.toBe(witness.embryo);
          expect(witness.attestationTruth).toBe("fact");
          expect(witness.functionalBridgeTruth).toBe("hypothesis");
        }

        const projected =
          projectMultiSourceFunctionalResearchWitnessesV0_1(witnesses);

        expect(projected).toHaveLength(3);
        for (const candidate of projected) {
          expect(candidate.targetWord).toBe("fixture-target");
          expect(candidate.targetSenseId).toBe("fixture-sense");
          expect(candidate.sourceKind).toBe("multi_source_research_witness");
          expect(candidate.embryoRelation).toBe("no_structural_relation");
          expect(candidate.relationOperationIds).toEqual([]);
          expect(candidate.functionalBridgeTruth).toBe("hypothesis");
          expect(candidate.claimBoundary).toBe(
            "research_functional_hypothesis_only",
          );
          expect(candidate.historicalOriginClaim).toBe("not_claimed");
          expect(candidate.winnerClaim).toBe("not_claimed");
          expect(candidate.candidateTruthClaim).toBe("not_claimed");
          expect(candidate.userDecisionPosture).toBe("user_decides");
        }
      },
    );

    it(
      "rejects target-sense mismatch, structural relation rows, and source/embryo identity as target-bound research",
      () => {
        expect(
          buildTargetBoundFunctionalResearchInputGroupsV0_1({
            targetWord: "fixture-target",
            targetSenseId: "other-sense",
            rows: genericRows,
          }),
        ).toEqual([]);

        expect(
          buildTargetBoundFunctionalResearchInputGroupsV0_1({
            targetWord: "other-target",
            targetSenseId: "fixture-sense",
            rows: genericRows,
          }),
        ).toEqual([]);

        expect(
          buildTargetBoundFunctionalResearchInputGroupsV0_1({
            targetWord: "fixture-target",
            targetSenseId: "fixture-sense",
            rows: [
              targetBoundRow(4, {
                form: "X",
              }),
              targetBoundRow(5, {
                embryoRelation: "exact_form",
              }),
            ],
          }),
        ).toEqual([]);
      },
    );

    it(
      "augments a candidate_only result without replacing its structural candidates or changing Null behavior",
      async () => {
        const rawPayload = await runAnalysisDeterministic("data", {
          mode: "strict",
        });
        const baseline = enginePayloadToAnalysisResult(rawPayload) as any;
        const baselineStructuralCandidates = baseline.candidates.filter(
          (candidate: any) =>
            candidate.sourceKind !== "multi_source_research_witness",
        );

        (rawPayload as any).inputs = {
          targetSenseId: "fixture-sense",
          targetSenseLabel: "fixture sense",
        };

        const result = enginePayloadToAnalysisResult(rawPayload) as any;
        const researchCandidates = result.candidates.filter(
          (candidate: any) =>
            candidate.sourceKind === "multi_source_research_witness",
        );

        expect(result.analysisStatusV0_1.status).toBe(
          "research_functional_hypothesis",
        );
        expect(researchCandidates).toHaveLength(3);
        expect(
          result.candidates.filter(
            (candidate: any) =>
              candidate.sourceKind !== "multi_source_research_witness",
          ),
        ).toHaveLength(baselineStructuralCandidates.length);
        expect(
          new Set(researchCandidates.map((candidate: any) => candidate.targetWord)),
        ).toEqual(new Set(["data"]));
        expect(
          new Set(researchCandidates.map((candidate: any) => candidate.targetSenseId)),
        ).toEqual(new Set(["fixture-sense"]));
        expect(
          new Set(researchCandidates.map((candidate: any) => candidate.embryo)),
        ).toEqual(new Set(["X"]));

        for (const candidate of researchCandidates) {
          expect(candidate.form).not.toBe(candidate.embryo);
          expect(candidate.embryoRelation).toBe("no_structural_relation");
          expect(candidate.relationOperationIds).toEqual([]);
          expect(candidate.attestationTruth).toBe("fact");
          expect(candidate.functionalBridgeTruth).toBe("hypothesis");
          expect(candidate.claimBoundary).toBe(
            "research_functional_hypothesis_only",
          );
          expect(candidate.historicalOriginClaim).toBe("not_claimed");
          expect(candidate.candidateTruthClaim).toBe("not_claimed");
          expect(candidate.winnerClaim).toBe("not_claimed");
          expect(candidate.userDecisionPosture).toBe("user_decides");
          expect(candidate.evidenceRefs).toHaveLength(1);
        }

        const mismatchedSensePayload = await runAnalysisDeterministic("data", {
          mode: "strict",
        });
        (mismatchedSensePayload as any).inputs = {
          targetSenseId: "other-sense",
          targetSenseLabel: "other sense",
        };
        const mismatchedSenseResult = enginePayloadToAnalysisResult(
          mismatchedSensePayload,
        ) as any;
        expect(
          mismatchedSenseResult.candidates.filter(
            (candidate: any) =>
              candidate.sourceKind === "multi_source_research_witness",
          ),
        ).toEqual([]);
        expect(mismatchedSenseResult.analysisStatusV0_1.status).toBe(
          "candidate_only",
        );

        const mismatchedWordPayload = await runAnalysisDeterministic("candle", {
          mode: "strict",
        });
        (mismatchedWordPayload as any).inputs = {
          targetSenseId: "fixture-sense",
          targetSenseLabel: "fixture sense",
        };
        const mismatchedWordResult = enginePayloadToAnalysisResult(
          mismatchedWordPayload,
        ) as any;
        expect(
          mismatchedWordResult.candidates.filter(
            (candidate: any) =>
              candidate.sourceKind === "multi_source_research_witness",
          ),
        ).toEqual([]);

        const nullPayload = await runAnalysisDeterministic("xyz", {
          mode: "strict",
        });
        (nullPayload as any).inputs = {
          targetSenseId: "fixture-sense",
          targetSenseLabel: "fixture sense",
        };
        const nullResult = enginePayloadToAnalysisResult(nullPayload) as any;
        expect(
          nullResult.candidates.filter(
            (candidate: any) =>
              candidate.sourceKind === "multi_source_research_witness",
          ),
        ).toEqual([]);
        expect(nullResult.analysisStatusV0_1.status).toBe(
          "null_no_supported_candidate",
        );
      },
    );
  },
);
