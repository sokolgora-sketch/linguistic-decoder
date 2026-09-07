import { NextRequest } from "next/server";

import { GET } from "@/app/api/analyze-v1/route";

type UnknownRecord = Record<string, unknown>;

function isRecord(
  value: unknown,
): value is UnknownRecord {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function candidates(
  body: UnknownRecord,
): UnknownRecord[] {
  return Array.isArray(body.candidates)
    ? body.candidates.filter(isRecord)
    : [];
}

const COHORT = [
  {
    word: "river",
    researchEmbryo: "LUMË",
    structuralEmbryos: ["IV"],
    sourceId:
      "research.external.albanian-lume-river.scale50.v0_1",
  },
  {
    word: "blood",
    researchEmbryo: "GJAK",
    structuralEmbryos: ["LO", "OOD"],
    sourceId:
      "research.external.albanian-gjak-blood.scale50.v0_1",
  },
  {
    word: "speak",
    researchEmbryo: "FLAS",
    structuralEmbryos: ["PE", "EAK"],
    sourceId:
      "research.external.albanian-flas-speak.scale50.v0_1",
  },
  {
    word: "memory",
    researchEmbryo: "KUJTESË",
    structuralEmbryos: ["EM"],
    sourceId:
      "research.external.albanian-kujtese-memory.scale50.v0_1",
  },
  {
    word: "woman",
    researchEmbryo: "GRUA",
    structuralEmbryos: ["OM"],
    sourceId:
      "research.external.albanian-grua-woman.scale50.v0_1",
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
  "Open Instrument SCALE-50 structural + source-attested research coexistence C",
  () => {
    jest.setTimeout(180_000);

    it.each(COHORT)(
      "$word keeps structural hypotheses while independently projecting exact-form research",
      async ({
        word,
        researchEmbryo,
        structuralEmbryos,
        sourceId,
      }) => {
        const body =
          await analyze(word);

        const rows =
          candidates(body);

        const structural =
          rows.filter(
            (candidate) =>
              candidate.sourceKind ===
              "logic_derived_structural_hypothesis",
          );

        const structuralObserved =
          new Set(
            structural
              .map(
                (candidate) =>
                  candidate.embryo,
              )
              .filter(
                (value): value is string =>
                  typeof value === "string",
              ),
          );

        for (
          const embryo
          of structuralEmbryos
        ) {
          expect(
            structuralObserved.has(
              embryo,
            ),
          ).toBe(true);
        }

        const research =
          rows.find(
            (candidate) =>
              candidate.sourceKind ===
                "multi_source_research_witness" &&
              candidate.sourceId ===
                sourceId &&
              candidate.targetWord ===
                word &&
              candidate.embryo ===
                researchEmbryo,
          );

        expect(research).toBeDefined();

        expect(research).toEqual(
          expect.objectContaining({
            embryo:
              researchEmbryo,
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

        expect(
          body.analysisStatusV0_1,
        ).toEqual(
          expect.objectContaining({
            status:
              "research_functional_hypothesis",
            reviewedOperators: [],
            researchHypothesisEmbryos:
              expect.arrayContaining([
                researchEmbryo,
              ]),
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
        ).toBe("not_claimed");

        expect(
          boundary.winnerClaim,
        ).toBe("not_claimed");

        expect(
          boundary.candidateTruthClaim,
        ).toBe("not_claimed");

        expect(
          boundary.structuralOutputIsCandidateTruth,
        ).toBe(false);

        expect(
          boundary.nullIsValid,
        ).toBe(true);
      },
    );

    it.each(["break"])(
      "%s remains structural-only without target-bound source evidence",
      async (word) => {
        const body =
          await analyze(word);

        expect(
          body.analysisStatusV0_1,
        ).toEqual(
          expect.objectContaining({
            status:
              "structural_unreviewed",
            researchHypothesisEmbryos:
              [],
          }),
        );
      },
    );
  },
);
