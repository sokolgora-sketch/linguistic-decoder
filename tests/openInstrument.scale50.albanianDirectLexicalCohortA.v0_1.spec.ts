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

const COHORT = [
  {
    word: "rain",
    embryo: "SHI",
    sourceId:
      "research.external.albanian-shi-rain.scale50.v0_1",
  },
  {
    word: "hand",
    embryo: "DORË",
    sourceId:
      "research.external.albanian-dore-hand.scale50.v0_1",
  },
  {
    word: "run",
    embryo: "VRAPOJ",
    sourceId:
      "research.external.albanian-vrapoj-run.scale50.v0_1",
  },
  {
    word: "truth",
    embryo: "VËRTETË",
    sourceId:
      "research.external.albanian-vertete-truth.scale50.v0_1",
  },
  {
    word: "mother",
    embryo: "NËNË",
    sourceId:
      "research.external.albanian-nene-mother.scale50.v0_1",
  },
] as const;

const NULL_CONTROLS = [
  "mountain",
  "bone",
  "walk",
  "life",
  "child",
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
  "Open Instrument SCALE-50 Albanian direct lexical cohort A v0.1",
  () => {
    jest.setTimeout(180_000);

    it.each(COHORT)(
      "$word gains only source-backed research-functional status through exact-form evidence",
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
            userDecisionPosture:
              "user_decides",
            researchHypothesisEmbryos:
              expect.arrayContaining([
                embryo,
              ]),
          }),
        );

        const candidates =
          Array.isArray(
            body.candidates,
          )
            ? body.candidates.filter(
                isRecord,
              )
            : [];

        const witness =
          candidates.find(
            (candidate) =>
              candidate.sourceKind ===
                "multi_source_research_witness" &&
              candidate.targetWord ===
                word &&
              candidate.embryo ===
                embryo &&
              candidate.sourceId ===
                sourceId,
          );

        expect(witness).toBeDefined();

        expect(witness).toEqual(
          expect.objectContaining({
            targetWord: word,
            embryo,
            sourceId,
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
            `Missing analysis status for ${word}`,
          );
        }

        expect(
          status.reviewedOperators,
        ).toEqual([]);

        const boundary =
          status.claimBoundary;

        expect(
          isRecord(boundary),
        ).toBe(true);

        if (!isRecord(boundary)) {
          throw new Error(
            `Missing claim boundary for ${word}`,
          );
        }

        expect(
          boundary.historicalOriginClaim,
        ).toBe("not_claimed");

        expect(
          boundary.winnerClaim,
        ).toBe("not_claimed");

        expect(
          boundary.candidateTruthClaim,
        ).toBe("not_claimed");

        expect(
          boundary.nullIsValid,
        ).toBe(true);
      },
    );

    it.each(NULL_CONTROLS)(
      "%s remains valid Null and proves target-bound evidence isolation",
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
