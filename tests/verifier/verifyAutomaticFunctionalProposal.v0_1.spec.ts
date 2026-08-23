import {
  verifyAutomaticFunctionalProposalV0_1,
} from "../../src/shared/verifier/verifyAutomaticFunctionalProposal.v0.1";
import type {
  AutomaticFunctionalProposalResultV0_1,
  FunctionalProposalEnvelopeV0_1,
} from "../../src/shared/orchestrator/automaticFunctionalCandidateProposal.v0.1";

function realProposal(
  proposal:
    FunctionalProposalEnvelopeV0_1,
): AutomaticFunctionalProposalResultV0_1 {
  return {
    schemaVersion:
      "open-instrument.automatic-functional-proposal.v0_1",
    attempted: true,
    status:
      "proposed_unverified",
    provider:
      "openai_compat",
    realProvider: true,
    mockProvider: false,
    userFacingEligible: false,
    verificationState:
      "pending_slice_e",
    candidateCount:
      proposal.candidates.length,
    proposal,
    error: null,
  };
}

function emptyAnalysis(
  word: string,
) {
  return {
    word,
    candidates: [],
    evidence: {
      surfaceVowels: [
        "A",
        "I",
      ],
      vowelPath: [
        "A",
        "I",
      ],
    },
    rootMap: {
      tokens: [],
      keys: [],
    },
    analysisStatusV0_1: {
      reviewedOperators: [],
      structuralTokens: [],
    },
  };
}

describe(
  "Slice E automatic functional proposal verifier v0.1",
  () => {
    it(
      "accepts a bounded real-provider hypothesis only as Proposed",
      () => {
        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis:
              emptyAnalysis(
                "novalume",
              ),
            automaticProposal:
              realProposal({
                word:
                  "novalume",
                candidates: [
                  {
                    language:
                      "Albanian",
                    candidateExpression:
                      "MI",
                    embryos: [
                      {
                        form: "MI",
                        gloss:
                          "fixture meaning",
                      },
                    ],
                    semanticBridge:
                      "fixture semantic bridge",
                    requiredTransforms:
                      [],
                    functionalExplanation:
                      "fixture functional explanation",
                  },
                ],
              }),
          });

        expect(out).toMatchObject({
          status:
            "verified_proposed",
          promotionPolicy:
            "proposed_only",
          acceptedCount: 1,
          rejectedCount: 0,
          deduplicatedCount: 0,
        });

        const promoted =
          out.promotedCandidates[0];

        expect(promoted).toMatchObject({
          sourceKind:
            "automatic_llm_functional_proposal",
          claimType:
            "functionalMotivation",
          originClaim:
            "not_claimed",
          historicalRelation:
            "not_evaluated",
          validationOutcome:
            "not_evaluated",
          rankGroup:
            "unresolved",
          userDecisionPosture:
            "user_decides",
          candidateLanguage:
            "Albanian",
          form: "MI",
          functionalStatement:
            "fixture functional explanation",
          segmentation: {
            kind:
              "functionalProposal",
            components: [
              {
                embryo:
                  "MI",
                language:
                  "Albanian",
                plainMeaning:
                  "fixture meaning",
                evidenceState:
                  "proposed",
              },
            ],
          },
        });

        expect(
          promoted[
            "validationOutcome"
          ],
        ).not.toBe(
          "validated",
        );

        expect(
          promoted[
            "rankGroup"
          ],
        ).not.toBe(
          "validatedFunctionalMotivation",
        );

        expect(
          promoted[
            "rankGroup"
          ],
        ).not.toBe(
          "partialFunctionalMotivation",
        );
      },
    );

    it(
      "refuses mock output entirely",
      () => {
        const automatic:
          AutomaticFunctionalProposalResultV0_1 =
          {
            schemaVersion:
              "open-instrument.automatic-functional-proposal.v0_1",
            attempted: true,
            status:
              "mock_exercised_test_only",
            provider:
              "mock",
            realProvider:
              false,
            mockProvider:
              true,
            userFacingEligible:
              false,
            verificationState:
              "not_started",
            candidateCount: 1,
            proposal: null,
            error: null,
          };

        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis:
              emptyAnalysis(
                "novalume",
              ),
            automaticProposal:
              automatic,
          });

        expect(out).toMatchObject({
          status:
            "not_applicable",
          acceptedCount: 0,
        });

        expect(
          out.promotedCandidates,
        ).toEqual([]);
      },
    );

    it(
      "rejects a proposal that requests a transform not authorized by deterministic context",
      () => {
        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis:
              emptyAnalysis(
                "caldora",
              ),
            automaticProposal:
              realProposal({
                word:
                  "caldora",
                candidates: [
                  {
                    language:
                      "Albanian",
                    candidateExpression:
                      "MI",
                    embryos: [
                      {
                        form: "MI",
                        gloss:
                          "fixture meaning",
                      },
                    ],
                    semanticBridge:
                      "fixture bridge",
                    requiredTransforms:
                      [
                        "invented_transform",
                      ],
                    functionalExplanation:
                      "fixture explanation",
                  },
                ],
              }),
          });

        expect(out).toMatchObject({
          status:
            "rejected_all",
          acceptedCount: 0,
          rejectedCount: 1,
        });

        expect(
          out.results[0]
            .checks.find(
              (check) =>
                check.id ===
                "TRANSFORMS_PERMITTED",
            ),
        ).toMatchObject({
          pass: false,
        });
      },
    );

    it(
      "rejects explicitly historical/non-living language labels for this living-language product lane",
      () => {
        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis:
              emptyAnalysis(
                "caldora",
              ),
            automaticProposal:
              realProposal({
                word:
                  "caldora",
                candidates: [
                  {
                    language:
                      "Latin",
                    candidateExpression:
                      "MI",
                    embryos: [
                      {
                        form: "MI",
                        gloss:
                          "fixture meaning",
                      },
                    ],
                    semanticBridge:
                      "fixture bridge",
                    requiredTransforms:
                      [],
                    functionalExplanation:
                      "fixture explanation",
                  },
                ],
              }),
          });

        expect(out).toMatchObject({
          status:
            "rejected_all",
          acceptedCount: 0,
          rejectedCount: 1,
        });

        expect(
          out.results[0]
            .checks.find(
              (check) =>
                check.id ===
                "LANGUAGE_USABLE",
            ),
        ).toMatchObject({
          pass: false,
        });
      },
    );

    it(
      "deduplicates an LLM proposal against an existing deterministic candidate using language aliases",
      () => {
        const analysis =
          emptyAnalysis(
            "study",
          );

        analysis.candidates = [
          {
            candidateLanguage:
              "sq",
            displayForm:
              "DI",
            claimType:
              "functionalMotivation",
            validationOutcome:
              "validated",
          },
        ];

        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis,
            automaticProposal:
              realProposal({
                word: "study",
                candidates: [
                  {
                    language:
                      "Albanian",
                    candidateExpression:
                      "DI",
                    embryos: [
                      {
                        form: "DI",
                        gloss:
                          "know",
                      },
                    ],
                    semanticBridge:
                      "fixture bridge",
                    requiredTransforms:
                      [],
                    functionalExplanation:
                      "fixture explanation",
                  },
                ],
              }),
          });

        expect(out).toMatchObject({
          status:
            "deduplicated_only",
          acceptedCount: 0,
          rejectedCount: 0,
          deduplicatedCount: 1,
        });

        expect(
          out.promotedCandidates,
        ).toEqual([]);
      },
    );

    it(
      "deduplicates a proposal against the canonical embryo when the reviewed display form is descriptive",
      () => {
        const analysis =
          emptyAnalysis(
            "fixture-word",
          );

        analysis.candidates = [
          {
            candidateLanguage:
              "sq",
            displayForm:
              "Gheg DA split damage candidate",
            form:
              "da",
            embryo:
              "DA",
            claimType:
              "functionalMotivation",
            validationOutcome:
              "validated",
            sourceKind:
              "reviewed_dictionary_source",
          },
        ];

        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis,
            automaticProposal:
              realProposal({
                word:
                  "fixture-word",
                candidates: [
                  {
                    language:
                      "Albanian",
                    candidateExpression:
                      "DA",
                    embryos: [
                      {
                        form:
                          "DA",
                        gloss:
                          "split / divide",
                      },
                    ],
                    semanticBridge:
                      "fixture bridge",
                    requiredTransforms:
                      [],
                    functionalExplanation:
                      "fixture explanation",
                  },
                ],
              }),
          });

        expect(out).toMatchObject({
          status:
            "deduplicated_only",
          acceptedCount: 0,
          rejectedCount: 0,
          deduplicatedCount: 1,
        });

        expect(
          out.results[0]
            .checks.find(
              (check) =>
                check.id ===
                "NOT_DUPLICATE",
            ),
        ).toMatchObject({
          pass: false,
        });

        expect(
          out.promotedCandidates,
        ).toEqual([]);
      },
    );

    it(
      "rejects an unreviewed embryo gloss that repeats the complete target word",
      () => {
        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis:
              emptyAnalysis(
                "memory",
              ),
            automaticProposal:
              realProposal({
                word:
                  "memory",
                candidates: [
                  {
                    language:
                      "English",
                    candidateExpression:
                      "MEM + OI",
                    embryos: [
                      {
                        form:
                          "MEM",
                        gloss:
                          "retain in memory",
                      },
                      {
                        form:
                          "OI",
                        gloss:
                          "perceive or know",
                      },
                    ],
                    semanticBridge:
                      "Retaining information and perceiving it can motivate the target concept.",
                    requiredTransforms:
                      [],
                    functionalExplanation:
                      "A bounded functional hypothesis.",
                  },
                ],
              }),
          });

        expect(out).toMatchObject({
          status:
            "rejected_all",
          acceptedCount: 0,
          rejectedCount: 1,
          deduplicatedCount: 0,
        });

        expect(
          out.results[0]
            .checks.find(
              (check) =>
                check.id ===
                "PROPOSED_EMBRYO_GLOSS_NON_CIRCULAR",
            ),
        ).toMatchObject({
          pass: false,
        });

        expect(
          out.promotedCandidates,
        ).toEqual([]);
      },
    );

    it(
      "allows an independently stated unreviewed embryo gloss through the non-circularity check",
      () => {
        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis:
              emptyAnalysis(
                "memory",
              ),
            automaticProposal:
              realProposal({
                word:
                  "memory",
                candidates: [
                  {
                    language:
                      "English",
                    candidateExpression:
                      "MEM + OI",
                    embryos: [
                      {
                        form:
                          "MEM",
                        gloss:
                          "retain information",
                      },
                      {
                        form:
                          "OI",
                        gloss:
                          "perceive or know",
                      },
                    ],
                    semanticBridge:
                      "Retaining information and perceiving it can motivate the target concept.",
                    requiredTransforms:
                      [],
                    functionalExplanation:
                      "A bounded functional hypothesis.",
                  },
                ],
              }),
          });

        const check =
          out.results[0]
            .checks.find(
              (item) =>
                item.id ===
                "PROPOSED_EMBRYO_GLOSS_NON_CIRCULAR",
            );

        expect(check).toMatchObject({
          pass: true,
        });
      },
    );

    it(
      "orders accepted Proposed candidates smallest-first",
      () => {
        const out =
          verifyAutomaticFunctionalProposalV0_1({
            analysis:
              emptyAnalysis(
                "caldora",
              ),
            automaticProposal:
              realProposal({
                word:
                  "caldora",
                candidates: [
                  {
                    language:
                      "Albanian",
                    candidateExpression:
                      "KA + RA",
                    embryos: [
                      {
                        form: "KA",
                        gloss:
                          "fixture one",
                      },
                      {
                        form: "RA",
                        gloss:
                          "fixture two",
                      },
                    ],
                    semanticBridge:
                      "fixture bridge two",
                    requiredTransforms:
                      [],
                    functionalExplanation:
                      "fixture explanation two",
                  },
                  {
                    language:
                      "Albanian",
                    candidateExpression:
                      "MI",
                    embryos: [
                      {
                        form: "MI",
                        gloss:
                          "fixture one",
                      },
                    ],
                    semanticBridge:
                      "fixture bridge one",
                    requiredTransforms:
                      [],
                    functionalExplanation:
                      "fixture explanation one",
                  },
                ],
              }),
          });

        expect(
          out.promotedCandidates.map(
            (candidate) =>
              candidate[
                "form"
              ],
          ),
        ).toEqual([
          "MI",
          "KA + RA",
        ]);
      },
    );
  },
);
