require("./helpers/whatwgGlobals.cjs");

const {
  GET,
} = require("../app/api/analyze-v1/route");

const CASES = [
  {
    word: "damage",
    status:
      "reviewed_functional_evidence",
    reviewedOperators: ["DA"],
    candidateOnlyOperators: [],
    structuralTokens: ["DA"],
  },
  {
    word: "study",
    status:
      "reviewed_functional_evidence",
    reviewedOperators: ["DI"],
    candidateOnlyOperators: [],
    structuralTokens: ["SHTU", "DI"],
  },
  {
    word: "data",
    status:
      "candidate_only",
    reviewedOperators: [],
    candidateOnlyOperators: ["DA"],
    structuralTokens: [],
  },
  {
    word: "dij",
    status:
      "candidate_only",
    reviewedOperators: [],
    candidateOnlyOperators: ["DI"],
    structuralTokens: ["DI"],
  },
  {
    word: "mode",
    status:
      "structural_unreviewed",
    reviewedOperators: [],
    candidateOnlyOperators: [],
    structuralTokens: ["M", "DA"],
  },
  {
    word: "xyz",
    status:
      "null_no_supported_candidate",
    reviewedOperators: [],
    candidateOnlyOperators: [],
    structuralTokens: [],
  },
] as const;

describe(
  "/api/analyze-v1 analysisStatusV0_1",
  () => {
    it.each(CASES)(
      "emits $status for $word",
      async ({
        word,
        status,
        reviewedOperators,
        candidateOnlyOperators,
        structuralTokens,
      }) => {
        const response = await GET({
          url:
            "http://localhost:3000/api/analyze-v1?word=" +
            encodeURIComponent(word) +
            "&mode=strict",
        } as any);

        expect(response.status).toBe(200);

        const json =
          await response.json();

        const actual =
          json.analysisStatusV0_1;

        expect(actual).toBeTruthy();

        expect(actual.schemaVersion).toBe(
          "open-instrument.analysis-status.v0_1",
        );

        expect(actual.status).toBe(status);

        expect(
          actual.reviewedOperators,
        ).toEqual(reviewedOperators);

        expect(
          actual.candidateOnlyOperators,
        ).toEqual(
          candidateOnlyOperators,
        );

        expect(
          actual.structuralTokens,
        ).toEqual(structuralTokens);

        expect(
          actual.userDecisionPosture,
        ).toBe("user_decides");

        expect(
          actual.claimBoundary,
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

    it.each([
      "data",
      "dij",
      "mode",
      "xyz",
    ])(
      "does not promote %s to reviewed evidence",
      async (word) => {
        const response = await GET({
          url:
            "http://localhost:3000/api/analyze-v1?word=" +
            encodeURIComponent(word) +
            "&mode=strict",
        } as any);

        const json =
          await response.json();

        expect(
          json.analysisStatusV0_1
            .reviewedOperators,
        ).toEqual([]);
      },
    );
  },
);
