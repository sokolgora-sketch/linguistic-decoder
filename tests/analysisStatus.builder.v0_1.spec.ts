import {
  ANALYSIS_STATUS_SCHEMA_VERSION_V0_1,
  buildAnalysisStatusV0_1,
} from "@/shared/analysisStatus.v0_1";

function reviewedEvidenceLine(
  sourceLabel: string,
): string {
  return [
    "reviewed functional free-operator evidence:",
    sourceLabel + ";",
    "historicalOriginClaim=not_claimed;",
    "winnerClaim=not_claimed;",
    "languageSuperiorityClaim=not_claimed;",
    "userDecisionPosture=user_decides",
  ].join(" ");
}

const POSITIVE_CASES = [
  {
    word: "damage",
    input: {
      word: "damage",
      rootMap: {
        tokens: [
          {
            token: "DA",
          },
        ],
        keys: [
          {
            token: "DA",
            status:
              "dialect_attested_pending_review",
            evidence: [
              "sq: da",
              reviewedEvidenceLine(
                "bounded DA source",
              ),
            ],
          },
        ],
      },
    },
    status:
      "reviewed_functional_evidence",
    reviewedOperators: ["DA"],
    candidateOnlyOperators: [],
    structuralTokens: ["DA"],
  },
  {
    word: "study",
    input: {
      word: "study",
      rootMap: {
        tokens: [
          {
            token: "SHTU",
          },
          {
            token: "DI",
          },
        ],
        keys: [
          {
            token: "SHTU",
            evidence: [
              "sq: shtu",
              "gloss: add / increase",
            ],
          },
          {
            token: "DI",
            evidence: [
              "sq: di",
              reviewedEvidenceLine(
                "bounded DI source",
              ),
            ],
          },
        ],
      },
    },
    status:
      "reviewed_functional_evidence",
    reviewedOperators: ["DI"],
    candidateOnlyOperators: [],
    structuralTokens: [
      "SHTU",
      "DI",
    ],
  },
  {
    word: "data",
    input: {
      word: "data",
      rootMap: {
        tokens: [],
        keys: [],
      },
    },
    status:
      "candidate_only",
    reviewedOperators: [],
    candidateOnlyOperators: ["DA"],
    structuralTokens: [],
  },
  {
    word: "dij",
    input: {
      word: "dij",
      rootMap: {
        tokens: [
          {
            token: "DI",
          },
        ],
        keys: [
          {
            token: "DI",
            evidence: [
              "sq: dij",
              "ops: exact",
              "gloss: I know",
            ],
          },
        ],
      },
    },
    status:
      "candidate_only",
    reviewedOperators: [],
    candidateOnlyOperators: ["DI"],
    structuralTokens: ["DI"],
  },
  {
    word: "mode",
    input: {
      word: "mode",
      rootMap: {
        tokens: [
          {
            token: "M",
          },
          {
            token: "DA",
          },
        ],
        keys: [
          {
            token: "M",
            evidence: [
              "carrier-only evidence",
            ],
          },
          {
            token: "DA",
            evidence: [
              "sq: da",
              "ops: final_swap",
              "gloss: split / divide / cut",
            ],
          },
        ],
      },
    },
    status:
      "structural_unreviewed",
    reviewedOperators: [],
    candidateOnlyOperators: [],
    structuralTokens: [
      "M",
      "DA",
    ],
  },
  {
    word: "novalume",
    input: {
      word: "novalume",
      rootMap: {
        tokens: [],
        keys: [],
      },
      candidates: [
        {
          candidateId:
            "automatic-functional-proposal:novalume:1",
          displayForm: "MI",
          form: "MI",
          claimType:
            "functionalMotivation",
          sourceKind:
            "automatic_llm_functional_proposal",
          sourceStatus:
            "deterministically_verified_proposed",
          validationOutcome:
            "not_evaluated",
          userDecisionPosture:
            "user_decides",
          proposalVerificationV0_1: {
            classification:
              "Proposed",
          },
        },
      ],
    },
    status:
      "candidate_only",
    reviewedOperators: [],
    candidateOnlyOperators: [],
    structuralTokens: [],
  },
  {
    word: "xyz",
    input: {
      word: "xyz",
      rootMap: {
        tokens: [],
        keys: [],
      },
    },
    status:
      "null_no_supported_candidate",
    reviewedOperators: [],
    candidateOnlyOperators: [],
    structuralTokens: [],
  },
] as const;

const ADVERSARIAL_CASES = [
  {
    word: "damage",
    operator: "DA",
    variant:
      "actual result without RootMap keys",
    input: {
      word: "damage",
      rootMap: {
        tokens: [
          {
            token: "DA",
          },
        ],
        keys: [],
      },
    },
  },
  {
    word: "damage",
    operator: "DA",
    variant:
      "actual result without keys or tokens",
    input: {
      word: "damage",
      rootMap: {
        tokens: [],
        keys: [],
      },
    },
  },
  {
    word: "damage",
    operator: "DA",
    variant:
      "word only",
    input: {
      word: "damage",
    },
  },
  {
    word: "damage",
    operator: "DA",
    variant:
      "fake unreviewed matching key",
    input: {
      word: "damage",
      rootMap: {
        tokens: [
          {
            token: "DA",
          },
        ],
        keys: [
          {
            token: "DA",
            evidence: [
              "synthetic unreviewed evidence",
            ],
          },
        ],
      },
    },
  },
  {
    word: "damage",
    operator: "DA",
    variant:
      "reviewed marker on wrong operator",
    input: {
      word: "damage",
      rootMap: {
        tokens: [
          {
            token: "DA",
          },
        ],
        keys: [
          {
            token: "DI",
            evidence: [
              reviewedEvidenceLine(
                "wrong operator",
              ),
            ],
          },
        ],
      },
    },
  },
  {
    word: "study",
    operator: "DI",
    variant:
      "actual result without RootMap keys",
    input: {
      word: "study",
      rootMap: {
        tokens: [
          {
            token: "SHTU",
          },
          {
            token: "DI",
          },
        ],
        keys: [],
      },
    },
  },
  {
    word: "study",
    operator: "DI",
    variant:
      "actual result without keys or tokens",
    input: {
      word: "study",
      rootMap: {
        tokens: [],
        keys: [],
      },
    },
  },
  {
    word: "study",
    operator: "DI",
    variant:
      "word only",
    input: {
      word: "study",
    },
  },
  {
    word: "study",
    operator: "DI",
    variant:
      "fake unreviewed matching key",
    input: {
      word: "study",
      rootMap: {
        tokens: [
          {
            token: "DI",
          },
        ],
        keys: [
          {
            token: "DI",
            evidence: [
              "synthetic unreviewed evidence",
            ],
          },
        ],
      },
    },
  },
  {
    word: "study",
    operator: "DI",
    variant:
      "marker missing required non-claim posture",
    input: {
      word: "study",
      rootMap: {
        tokens: [
          {
            token: "DI",
          },
        ],
        keys: [
          {
            token: "DI",
            evidence: [
              "reviewed functional free-operator evidence: incomplete",
            ],
          },
        ],
      },
    },
  },
] as const;

describe(
  "analysisStatusV0_1 builder",
  () => {
    it.each(POSITIVE_CASES)(
      "classifies $word as $status",
      ({
        input,
        status,
        reviewedOperators,
        candidateOnlyOperators,
        structuralTokens,
      }) => {
        const first =
          buildAnalysisStatusV0_1(
            input,
          );

        const second =
          buildAnalysisStatusV0_1(
            input,
          );

        expect(first).toEqual(second);

        expect(first.schemaVersion).toBe(
          ANALYSIS_STATUS_SCHEMA_VERSION_V0_1,
        );

        expect(first.status).toBe(
          status,
        );

        expect(
          first.reviewedOperators,
        ).toEqual(
          reviewedOperators,
        );

        expect(
          first.candidateOnlyOperators,
        ).toEqual(
          candidateOnlyOperators,
        );

        expect(
          first.structuralTokens,
        ).toEqual(
          structuralTokens,
        );

        expect(
          first.userDecisionPosture,
        ).toBe("user_decides");

        expect(
          first.claimBoundary,
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
      },
    );

    it.each(ADVERSARIAL_CASES)(
      "does not authorize $operator for $word from $variant",
      ({
        input,
        operator,
      }) => {
        const result =
          buildAnalysisStatusV0_1(
            input,
          );

        expect(result.status).toBe(
          "candidate_only",
        );

        expect(
          result.reviewedOperators,
        ).toEqual([]);

        expect(
          result.candidateOnlyOperators,
        ).toEqual([operator]);
      },
    );

    it(
      "keeps Null explicit and valid",
      () => {
        const result =
          buildAnalysisStatusV0_1({
            word: "xyz",
            rootMap: {
              tokens: [],
              keys: [],
            },
          });

        expect(result.status).toBe(
          "null_no_supported_candidate",
        );

        expect(
          result.summary,
        ).toContain(
          "Null is a valid result",
        );
      },
    );
  },
);
