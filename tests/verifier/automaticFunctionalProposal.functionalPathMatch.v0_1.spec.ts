import {
  verifyAutomaticFunctionalProposalV0_1,
} from "@/shared/verifier/verifyAutomaticFunctionalProposal.v0.1";

import {
  buildAutomaticFunctionalProposalContextV0_1,
  reconcileSliceGRequiredTransformsV0_1,
  sanitizeAutomaticFunctionalRequiredTransformsV0_1,
} from "@/shared/orchestrator/automaticFunctionalCandidateProposal.v0.1";

function automaticProposal(
  args: {
    word: string;
    expression: string;
    embryos: Array<{
      form: string;
      gloss: string;
    }>;
    transforms?: string[];
  },
): any {
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
    candidateCount: 1,
    proposal: {
      word: args.word,
      candidates: [
        {
          language:
            "English",
          candidateExpression:
            args.expression,
          embryos:
            args.embryos,
          semanticBridge:
            "A bounded functional bridge for verifier testing.",
          requiredTransforms:
            args.transforms ?? [],
          functionalExplanation:
            "A bounded proposed functional explanation.",
        },
      ],
    },
    error: null,
  };
}

describe(
  "automatic functional proposal functional-path match v0.1",
  () => {
    test(
      "sanitizer preserves unknown transforms for deterministic rejection",
      () => {
        expect(
          sanitizeAutomaticFunctionalRequiredTransformsV0_1([
            "invented_transform",
            "Y↔I",
            "y_to_i",
          ]),
        ).toEqual([
          "invented_transform",
          "y_to_i",
        ]);
      },
    );

    test(
      "explicit Slice G exact-path reconciliation removes only non-engine transform noise",
      () => {
        const analysis = {
          evidence: {
            surfaceVowelsRaw: [
              "E",
              "O",
              "Y",
            ],
            surfaceVowels: [
              "E",
              "O",
              "Y",
            ],
            vowelPath: [
              "E",
              "O",
              "Y",
            ],
          },
          functionalVoiceNormalizationV0_1: {
            functionalPath: [
              "E",
              "O",
              "I",
            ],
          },
          candidates: [],
        };

        const context =
          buildAutomaticFunctionalProposalContextV0_1(
            analysis,
          );

        const reconciled =
          reconcileSliceGRequiredTransformsV0_1(
            {
              word:
                "fixture",
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
                        "retain",
                    },
                    {
                      form:
                        "OI",
                      gloss:
                        "perceive",
                    },
                  ],
                  semanticBridge:
                    "fixture",
                  requiredTransforms: [
                    "concatenation",
                  ],
                  functionalExplanation:
                    "fixture",
                },
              ],
            },
            context,
          );

        expect(
          context
            .explicitFunctionalNormalization,
        ).toBe(true);

        expect(
          reconciled
            .candidates[0]
            ?.requiredTransforms,
        ).toEqual([]);
      },
    );

    test(
      "legacy context does not erase an unauthorized transform",
      () => {
        const context =
          buildAutomaticFunctionalProposalContextV0_1({
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
            candidates: [],
          });

        const reconciled =
          reconcileSliceGRequiredTransformsV0_1(
            {
              word:
                "fixture",
              candidates: [
                {
                  language:
                    "English",
                  candidateExpression:
                    "MI",
                  embryos: [
                    {
                      form:
                        "MI",
                      gloss:
                        "fixture",
                    },
                  ],
                  semanticBridge:
                    "fixture",
                  requiredTransforms: [
                    "invented_transform",
                  ],
                  functionalExplanation:
                    "fixture",
                },
              ],
            },
            context,
          );

        expect(
          context
            .explicitFunctionalNormalization,
        ).toBe(false);

        expect(
          reconciled
            .candidates[0]
            ?.requiredTransforms,
        ).toEqual([
          "invented_transform",
        ]);
      },
    );

    test(
      "accepts an E-O-I candidate when deterministic functional path is E-O-I",
      () => {
        const result =
          verifyAutomaticFunctionalProposalV0_1({
            analysis: {
              word:
                "memory",
              evidence: {
                surfaceVowelsRaw: [
                  "E",
                  "O",
                  "Y",
                ],
                surfaceVowels: [
                  "E",
                  "O",
                  "Y",
                ],
                vowelPath: [
                  "E",
                  "O",
                  "Y",
                ],
              },
              functionalVoiceNormalizationV0_1: {
                functionalPath: [
                  "E",
                  "O",
                  "I",
                ],
              },
              candidates: [],
            },
            automaticProposal:
              automaticProposal({
                word:
                  "memory",
                expression:
                  "MEM + OI",
                embryos: [
                  {
                    form:
                      "MEM",
                    gloss:
                      "retain",
                  },
                  {
                    form:
                      "OI",
                    gloss:
                      "perceive",
                  },
                ],
              }),
          });

        expect(
          result.status,
        ).toBe(
          "verified_proposed",
        );

        expect(
          result.acceptedCount,
        ).toBe(1);

        expect(
          result.results[0]
            ?.checks.find(
              (check) =>
                check.id ===
                "FUNCTIONAL_PATH_MATCH",
            )?.pass,
        ).toBe(true);
      },
    );

    test(
      "rejects a candidate whose expression path differs from deterministic functional path",
      () => {
        const result =
          verifyAutomaticFunctionalProposalV0_1({
            analysis: {
              word:
                "rhythm",
              evidence: {
                surfaceVowelsRaw: [
                  "Y",
                ],
                surfaceVowels: [
                  "Y",
                ],
                vowelPath: [
                  "Y",
                ],
              },
              functionalVoiceNormalizationV0_1: {
                functionalPath: [
                  "I",
                  "Ë",
                ],
              },
              candidates: [],
            },
            automaticProposal:
              automaticProposal({
                word:
                  "rhythm",
                expression:
                  "DI + SHTU",
                embryos: [
                  {
                    form:
                      "DI",
                    gloss:
                      "division",
                  },
                  {
                    form:
                      "SHTU",
                    gloss:
                      "measure",
                  },
                ],
              }),
          });

        expect(
          result.status,
        ).toBe(
          "rejected_all",
        );

        expect(
          result.results[0]
            ?.checks.find(
              (check) =>
                check.id ===
                "FUNCTIONAL_PATH_MATCH",
            )?.pass,
        ).toBe(false);
      },
    );
  },
);
