import { NextRequest } from "next/server";

import { GET } from "@/app/api/analyze-v1/route";

import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";

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
    albanianEmbryo: "QIELL",
    latinEmbryo: "CAELUM",
    albanianSource:
      "research.external.albanian-qiell-sky.scale50.v0_1",
    latinSource:
      "research.external.latin-caelum-sky.scale50.v0_1",
  },
  {
    word: "heart",
    albanianEmbryo: "ZEMËR",
    latinEmbryo: "COR",
    albanianSource:
      "research.external.albanian-zemer-heart.scale50.v0_1",
    latinSource:
      "research.external.latin-cor-heart.scale50.v0_1",
  },
  {
    word: "eat",
    albanianEmbryo: "HA",
    latinEmbryo: "EDO",
    albanianSource:
      "research.external.albanian-ha-eat.scale50.v0_1",
    latinSource:
      "research.external.latin-edo-eat.scale50.v0_1",
  },
  {
    word: "mind",
    albanianEmbryo: "MENDJE",
    latinEmbryo: "MENS",
    albanianSource:
      "research.external.albanian-mendje-mind.scale50.v0_1",
    latinSource:
      "research.external.latin-mens-mind.scale50.v0_1",
  },
  {
    word: "war",
    albanianEmbryo: "LUFTË",
    latinEmbryo: "BELLIGERO",
    albanianSource:
      "research.external.albanian-lufte-war.scale50.v0_1",
    latinSource:
      "research.external.latin-belligero-war.scale50.v0_1",
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
  "Open Instrument SCALE-50 multi-source depth Cohort E v0.1",
  () => {
    jest.setTimeout(180_000);

    it.each(COHORT)(
      "$word exposes independent Albanian and Latin research witnesses without truth promotion",
      async ({
        word,
        albanianEmbryo,
        latinEmbryo,
        albanianSource,
        latinSource,
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
                albanianEmbryo,
                latinEmbryo,
              ]),
            userDecisionPosture:
              "user_decides",
          }),
        );

        const research =
          candidateRows(body)
            .filter(
              (candidate) =>
                candidate.sourceKind ===
                  "multi_source_research_witness" &&
                candidate.targetWord ===
                  word,
            );

        const albanian =
          research.find(
            (candidate) =>
              candidate.sourceId ===
                albanianSource,
          );

        const latin =
          research.find(
            (candidate) =>
              candidate.sourceId ===
                latinSource,
          );

        expect(albanian).toEqual(
          expect.objectContaining({
            embryo:
              albanianEmbryo,
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
            candidateTruthClaim:
              "not_claimed",
            historicalOriginClaim:
              "not_claimed",
            winnerClaim:
              "not_claimed",
          }),
        );

        expect(latin).toEqual(
          expect.objectContaining({
            embryo:
              latinEmbryo,
            language:
              "Latin",
            embryoAuthority:
              "source_attested_exact_form",
            sourceStatus:
              "research_candidate",
            attestationTruth:
              "fact",
            functionalBridgeTruth:
              "hypothesis",
            candidateTruthClaim:
              "not_claimed",
            historicalOriginClaim:
              "not_claimed",
            winnerClaim:
              "not_claimed",
          }),
        );

        const languages =
          new Set(
            research
              .map(
                (candidate) =>
                  candidate.language,
              )
              .filter(
                (value): value is string =>
                  typeof value === "string",
              ),
          );

        expect(
          languages.has(
            "Albanian",
          ),
        ).toBe(true);

        expect(
          languages.has(
            "Latin",
          ),
        ).toBe(true);
      },
    );

    it.each(COHORT)(
      "$word has both lexical_dictionary and historical_dictionary research families in the passive catalog",
      ({
        word,
        albanianSource,
        latinSource,
      }) => {
        const rows =
          loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();

        const targetRows =
          rows.filter(
            (row) =>
              row.functionalHypotheses
                .some(
                  (hypothesis) =>
                    hypothesis.targetWord
                      .trim()
                      .toLocaleLowerCase(
                        "en-US",
                      ) === word,
                ),
          );

        const sourceIds =
          new Set(
            targetRows.map(
              (row) =>
                row.researchEvidenceId,
            ),
          );

        const languages =
          new Set(
            targetRows.map(
              (row) =>
                row.language,
            ),
          );

        const families =
          new Set(
            targetRows.map(
              (row) =>
                row.evidenceFamily,
            ),
          );

        expect(
          sourceIds.has(
            albanianSource,
          ),
        ).toBe(true);

        expect(
          sourceIds.has(
            latinSource,
          ),
        ).toBe(true);

        expect(
          languages.has(
            "Albanian",
          ),
        ).toBe(true);

        expect(
          languages.has(
            "Latin",
          ),
        ).toBe(true);

        expect(
          families.has(
            "lexical_dictionary",
          ),
        ).toBe(true);

        expect(
          families.has(
            "historical_dictionary",
          ),
        ).toBe(true);
      },
    );
  },
);
