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
    word: "sky",
    embryo: "QIELL",
    sourceId:
      "research.external.albanian-qiell-sky.scale50.v0_1",
  },
  {
    word: "heart",
    embryo: "ZEMËR",
    sourceId:
      "research.external.albanian-zemer-heart.scale50.v0_1",
  },
  {
    word: "eat",
    embryo: "HA",
    sourceId:
      "research.external.albanian-ha-eat.scale50.v0_1",
  },
  {
    word: "mind",
    embryo: "MENDJE",
    sourceId:
      "research.external.albanian-mendje-mind.scale50.v0_1",
  },
  {
    word: "war",
    embryo: "LUFTË",
    sourceId:
      "research.external.albanian-lufte-war.scale50.v0_1",
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

  expect(
    response.status,
  ).toBe(200);

  const body: unknown =
    await response.json();

  expect(
    isRecord(body),
  ).toBe(true);

  if (!isRecord(body)) {
    throw new Error(
      `Expected object response for ${word}`,
    );
  }

  return body;
}

describe(
  "Open Instrument SCALE-50 Null breadth Cohort D v0.1",
  () => {
    jest.setTimeout(180_000);

    it.each(COHORT)(
      "$word moves from valid Null to bounded source-backed research only",
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

        expect(
          witness,
        ).toBeDefined();

        expect(
          witness,
        ).toEqual(
          expect.objectContaining({
            targetWord:
              word,
            embryo,
            sourceId,
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

        expect(
          isRecord(status),
        ).toBe(true);

        if (!isRecord(status)) {
          throw new Error(
            `Missing analysis status for ${word}`,
          );
        }

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

    it(
      "does not disturb the proven structural/research coexistence lane",
      async () => {
        const body =
          await analyze(
            "memory",
          );

        expect(
          body.analysisStatusV0_1,
        ).toEqual(
          expect.objectContaining({
            status:
              "research_functional_hypothesis",
            researchHypothesisEmbryos:
              expect.arrayContaining([
                "KUJTESË",
              ]),
          }),
        );

        const structuralEm =
          candidateRows(body)
            .filter(
              (candidate) =>
                candidate.sourceKind ===
                  "logic_derived_structural_hypothesis" &&
                candidate.embryo ===
                  "EM",
            );

        expect(
          structuralEm,
        ).toHaveLength(1);
      },
    );
  },
);
