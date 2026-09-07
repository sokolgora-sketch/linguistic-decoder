import { NextRequest } from "next/server";

import { GET } from "@/app/api/analyze-v1/route";

type UnknownRecord =
  Record<string, unknown>;

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function candidateRows(
  body: UnknownRecord,
): UnknownRecord[] {
  return Array.isArray(body.candidates)
    ? body.candidates.filter(isRecord)
    : [];
}

const COHORT = [
  {
    word: "ear",
    embryo: "VESH",
    sourceId:
      "research.external.albanian-vesh-ear.scale50.v0_1",
  },
  {
    word: "nose",
    embryo: "HUNDË",
    sourceId:
      "research.external.albanian-hunde-nose.scale50.v0_1",
  },
  {
    word: "foot",
    embryo: "KËMBË",
    sourceId:
      "research.external.albanian-kembe-foot.scale50.v0_1",
  },
  {
    word: "peace",
    embryo: "PAQE",
    sourceId:
      "research.external.albanian-paqe-peace.scale50.v0_1",
  },
  {
    word: "king",
    embryo: "MBRET",
    sourceId:
      "research.external.albanian-mbret-king.scale50.v0_1",
  },
] as const;

async function analyze(
  word: string,
): Promise<UnknownRecord> {
  const response =
    await GET(
      new NextRequest(
        "http://localhost/api/analyze-v1" +
          `?word=${encodeURIComponent(word)}` +
          "&mode=strict",
      ),
    );

  expect(response.status).toBe(200);

  const body: unknown =
    await response.json();

  expect(isRecord(body)).toBe(true);

  if (!isRecord(body)) {
    throw new Error(
      `Expected object response for ${word}`,
    );
  }

  return body;
}

describe(
  "Open Instrument SCALE-50 Null breadth Cohort F v0.1",
  () => {
    jest.setTimeout(180_000);

    it.each(COHORT)(
      "$word moves from valid Null to bounded source-attested research",
      async ({
        word,
        embryo,
        sourceId,
      }) => {
        const body =
          await analyze(word);

        expect(
          body.analysisStatusV0_1,
        ).toEqual(
          expect.objectContaining({
            status:
              "research_functional_hypothesis",
            reviewedOperators: [],
            candidateOnlyOperators: [],
            researchHypothesisEmbryos:
              expect.arrayContaining([
                embryo,
              ]),
            structuralTokens: [],
            userDecisionPosture:
              "user_decides",
          }),
        );

        const witness =
          candidateRows(body)
            .find(
              (candidate) =>
                candidate.sourceKind ===
                  "multi_source_research_witness" &&
                candidate.sourceId ===
                  sourceId &&
                candidate.targetWord ===
                  word &&
                candidate.embryo ===
                  embryo,
            );

        expect(witness).toBeDefined();

        expect(witness).toEqual(
          expect.objectContaining({
            targetWord:
              word,
            embryo,
            sourceId,
            language:
              "Albanian",
            embryoAuthority:
              "source_attested_exact_form",
            sourceStatus:
              "research_candidate",
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
          }),
        );

        const status =
          body.analysisStatusV0_1;

        expect(isRecord(status)).toBe(true);

        if (!isRecord(status)) {
          throw new Error(
            `Missing status for ${word}`,
          );
        }

        const boundary =
          status.claimBoundary;

        expect(isRecord(boundary)).toBe(true);

        if (!isRecord(boundary)) {
          throw new Error(
            `Missing claim boundary for ${word}`,
          );
        }

        expect(
          boundary.historicalOriginClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          boundary.historicalTransmissionClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          boundary.winnerClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          boundary.candidateTruthClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          boundary.structuralOutputIsCandidateTruth,
        ).toBe(false);

        expect(
          boundary.nullIsValid,
        ).toBe(true);
      },
    );

    it.each([
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
    ] as const)(
      "%s preserves the older Cohort A/B Null-control contract",
      async (word) => {
        const body =
          await analyze(word);

        expect(
          body.analysisStatusV0_1,
        ).toEqual(
          expect.objectContaining({
            status:
              "null_no_supported_candidate",
            userDecisionPosture:
              "user_decides",
          }),
        );
      },
    );
  },
);
