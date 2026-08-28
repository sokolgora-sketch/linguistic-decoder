import {
  buildAnalysisStatusV0_1,
} from "@/shared/analysisStatus.v0_1";

function researchCandidate(
  overrides: Record<string, unknown> = {},
) {
  return {
    candidateId:
      "research-functional:fixture-er",
    targetWord:
      "sterile",

    displayForm:
      "ἐρῆμος",
    form:
      "ἐρῆμος",

    candidateLanguage:
      "Ancient Greek",
    language:
      "Ancient Greek",

    embryo:
      "ER",

    sourceKind:
      "multi_source_research_witness",

    sourceId:
      "research.external.fixture.er.v0_1",

    sourceStatus:
      "research_candidate",

    claimType:
      "functionalMotivation",

    validationOutcome:
      "not_evaluated",

    rankGroup:
      "unresolved",

    plainStandaloneGloss:
      "empty, deserted; devoid of",

    semanticBridge:
      "empty or devoid can be tested as a functional precursor to absence of productive capacity",

    evidenceRefs: [
      "research.external.fixture.er.citation.v0_1",
    ],

    embryoRelation:
      "reconstructed_form",

    relationOperationIds: [],

    attestationTruth:
      "fact",

    functionalBridgeTruth:
      "hypothesis",

    claimBoundary:
      "research_functional_hypothesis_only",

    historicalOriginClaim:
      "not_claimed",

    historicalTransmissionClaim:
      "not_claimed",

    winnerClaim:
      "not_claimed",

    languageSuperiorityClaim:
      "not_claimed",

    candidateTruthClaim:
      "not_claimed",

    userDecisionPosture:
      "user_decides",

    ...overrides,
  };
}

describe(
  "Open Instrument analysis status research functional hypothesis v0.1",
  () => {
    it(
      "assigns a distinct research_functional_hypothesis status to a target-bound source-backed functional hypothesis",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "sterile",

            candidates: [
              researchCandidate(),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          (status as any)
            .researchHypothesisEmbryos,
        ).toEqual([
          "ER",
        ]);

        expect(
          status.candidateOnlyOperators,
        ).toEqual([]);

        expect(
          status.reviewedOperators,
        ).toEqual([]);

        expect(
          status.summary
            .toLocaleLowerCase(),
        ).toContain(
          "research",
        );

        expect(
          status.summary
            .toLocaleLowerCase(),
        ).toContain(
          "not reviewed",
        );
      },
    );

    it(
      "does not reuse candidateOnlyOperators to represent research embryos",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "data",

            candidates: [
              researchCandidate({
                targetWord:
                  "data",
              }),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          (status as any)
            .researchHypothesisEmbryos,
        ).toEqual([
          "ER",
        ]);

        expect(
          status.candidateOnlyOperators,
        ).not.toContain(
          "ER",
        );
      },
    );

    it(
      "gives a valid research functional hypothesis precedence over structural output",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "sterile",

            rootMap: {
              tokens: [
                {
                  token:
                    "ER",
                },
              ],

              keys: [],
            },

            candidates: [
              researchCandidate(),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          (status as any)
            .researchHypothesisEmbryos,
        ).toEqual([
          "ER",
        ]);

        expect(
          status.structuralTokens,
        ).toEqual([
          "ER",
        ]);
      },
    );

    it(
      "keeps reviewed functional evidence above research hypotheses",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "study",

            rootMap: {
              tokens: [
                {
                  token:
                    "DI",
                },
              ],

              keys: [
                {
                  token:
                    "DI",

                  evidence: [
                    "reviewed functional free-operator evidence: fixture; historicalOriginClaim=not_claimed; winnerClaim=not_claimed; languageSuperiorityClaim=not_claimed; userDecisionPosture=user_decides",
                  ],
                },
              ],
            },

            candidates: [
              researchCandidate({
                targetWord:
                  "study",
              }),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "reviewed_functional_evidence",
        );

        expect(
          status.reviewedOperators,
        ).toContain(
          "DI",
        );
      },
    );

    it(
      "rejects a research projection whose targetWord does not match the analyzed word",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "sterile",

            candidates: [
              researchCandidate({
                targetWord:
                  "damage",
              }),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "null_no_supported_candidate",
        );

        expect(
          (status as any)
            .researchHypothesisEmbryos ??
            [],
        ).toEqual([]);
      },
    );

    it.each([
      {
        field:
          "sourceKind",
        value:
          "automatic_llm_functional_proposal",
      },
      {
        field:
          "claimType",
        value:
          "structuralHypothesis",
      },
      {
        field:
          "validationOutcome",
        value:
          "validated",
      },
      {
        field:
          "rankGroup",
        value:
          "validatedFunctionalMotivation",
      },
      {
        field:
          "claimBoundary",
        value:
          "functional motivation evidence only; not historical origin",
      },
      {
        field:
          "candidateTruthClaim",
        value:
          "claimed",
      },
      {
        field:
          "historicalOriginClaim",
        value:
          "claimed",
      },
      {
        field:
          "userDecisionPosture",
        value:
          "system_decides",
      },
    ])(
      "fails closed when research identity field $field is invalid",
      ({
        field,
        value,
      }) => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "sterile",

            candidates: [
              researchCandidate({
                [field]:
                  value,
              }),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "null_no_supported_candidate",
        );
      },
    );

    it(
      "requires an actual functional bridge before research evidence can drive functional-hypothesis status",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "sterile",

            candidates: [
              researchCandidate({
                semanticBridge:
                  null,

                functionalBridgeTruth:
                  "unknown",
              }),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "null_no_supported_candidate",
        );
      },
    );

    it(
      "does not permit reviewed_accepted evidence to be relabelled as an unreviewed research hypothesis",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "sterile",

            candidates: [
              researchCandidate({
                sourceStatus:
                  "reviewed_accepted",
              }),
            ],
          });

        expect(
          status.status,
        ).toBe(
          "null_no_supported_candidate",
        );
      },
    );

    it(
      "keeps global claim boundaries and user-decision posture unchanged",
      () => {
        const status =
          buildAnalysisStatusV0_1({
            word:
              "sterile",

            candidates: [
              researchCandidate(),
            ],
          });

        expect(
          status.claimBoundary,
        ).toEqual({
          historicalOriginClaim:
            "not_claimed",

          historicalTransmissionClaim:
            "not_claimed",

          winnerClaim:
            "not_claimed",

          languageSuperiorityClaim:
            "not_claimed",

          linguisticOwnershipClaim:
            "not_claimed",

          candidateTruthClaim:
            "not_claimed",

          structuralOutputIsCandidateTruth:
            false,

          nullIsValid:
            true,
        });

        expect(
          status.userDecisionPosture,
        ).toBe(
          "user_decides",
        );
      },
    );
  },
);
