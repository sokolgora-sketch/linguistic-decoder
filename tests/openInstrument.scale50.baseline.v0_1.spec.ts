import { NextRequest } from "next/server";

import { GET } from "@/app/api/analyze-v1/route";
import type { AnalysisStatusCodeV0_1 } from "@/shared/analysisStatus.v0_1";

type Scale50Category =
  | "nature"
  | "body"
  | "action"
  | "abstract"
  | "human_social";

type Scale50Case = Readonly<{
  word: string;
  category: Scale50Category;
}>;

/**
 * SCALE-50 v0.1
 *
 * Fixed before observing results.
 *
 * Purpose:
 * - measure generalization beyond the small canonical/research proving set;
 * - use the real analyze-v1 route and aggregate analysisStatusV0_1;
 * - preserve Null as a valid result;
 * - make no historical-origin, winner, ownership, or candidate-truth claim.
 *
 * The corpus deliberately avoids the current principal proving targets:
 * DA/DI/AT positive proofs and STERILE/GJAK/LOVE research targets.
 */
const SCALE_50_V0_1: readonly Scale50Case[] = [
  // Nature
  { word: "rain", category: "nature" },
  { word: "river", category: "nature" },
  { word: "mountain", category: "nature" },
  { word: "stone", category: "nature" },
  { word: "tree", category: "nature" },
  { word: "wind", category: "nature" },
  { word: "sea", category: "nature" },
  { word: "sky", category: "nature" },
  { word: "snow", category: "nature" },
  { word: "cloud", category: "nature" },

  // Body
  { word: "hand", category: "body" },
  { word: "head", category: "body" },
  { word: "heart", category: "body" },
  { word: "blood", category: "body" },
  { word: "bone", category: "body" },
  { word: "skin", category: "body" },
  { word: "mouth", category: "body" },
  { word: "ear", category: "body" },
  { word: "nose", category: "body" },
  { word: "foot", category: "body" },

  // Action
  { word: "run", category: "action" },
  { word: "walk", category: "action" },
  { word: "speak", category: "action" },
  { word: "hear", category: "action" },
  { word: "eat", category: "action" },
  { word: "drink", category: "action" },
  { word: "sleep", category: "action" },
  { word: "build", category: "action" },
  { word: "break", category: "action" },
  { word: "carry", category: "action" },

  // Abstract
  { word: "truth", category: "abstract" },
  { word: "time", category: "abstract" },
  { word: "life", category: "abstract" },
  { word: "death", category: "abstract" },
  { word: "mind", category: "abstract" },
  { word: "memory", category: "abstract" },
  { word: "freedom", category: "abstract" },
  { word: "justice", category: "abstract" },
  { word: "order", category: "abstract" },
  { word: "change", category: "abstract" },

  // Human / social
  { word: "mother", category: "human_social" },
  { word: "child", category: "human_social" },
  { word: "friend", category: "human_social" },
  { word: "home", category: "human_social" },
  { word: "work", category: "human_social" },
  { word: "war", category: "human_social" },
  { word: "peace", category: "human_social" },
  { word: "king", category: "human_social" },
  { word: "woman", category: "human_social" },
  { word: "man", category: "human_social" },
] as const;

const ALLOWED_STATUSES = [
  "reviewed_functional_evidence",
  "research_functional_hypothesis",
  "candidate_only",
  "structural_unreviewed",
  "null_no_supported_candidate",
] as const satisfies readonly AnalysisStatusCodeV0_1[];

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string",
      )
    : [];
}

describe(
  "Open Instrument SCALE-50 baseline v0.1",
  () => {
    jest.setTimeout(180_000);

    it(
      "measures 50 fixed non-canonical words through the real analyze-v1 status boundary",
      async () => {
        expect(SCALE_50_V0_1).toHaveLength(50);

        const words =
          SCALE_50_V0_1.map(
            (entry) => entry.word,
          );

        expect(
          new Set(words).size,
        ).toBe(50);

        const counts: Record<
          AnalysisStatusCodeV0_1,
          number
        > = {
          reviewed_functional_evidence: 0,
          research_functional_hypothesis: 0,
          candidate_only: 0,
          structural_unreviewed: 0,
          null_no_supported_candidate: 0,
        };

        const categoryCounts =
          new Map<
            Scale50Category,
            Record<AnalysisStatusCodeV0_1, number>
          >();

        const rows: Array<{
          word: string;
          category: Scale50Category;
          status: AnalysisStatusCodeV0_1;
          reviewedOperators: string[];
          researchHypothesisEmbryos: string[];
          candidateOnlyOperators: string[];
          structuralTokens: string[];
        }> = [];

        for (
          const scaleCase
          of SCALE_50_V0_1
        ) {
          const url =
            "http://localhost/api/analyze-v1" +
            `?word=${encodeURIComponent(
              scaleCase.word,
            )}` +
            "&mode=strict";

          const response =
            await GET(
              new NextRequest(url),
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
              `Expected object response for ${scaleCase.word}`,
            );
          }

          const rawStatus =
            body.analysisStatusV0_1;

          expect(
            isRecord(rawStatus),
          ).toBe(true);

          if (!isRecord(rawStatus)) {
            throw new Error(
              `Missing analysisStatusV0_1 for ${scaleCase.word}`,
            );
          }

          const status =
            rawStatus.status;

          expect(
            ALLOWED_STATUSES,
          ).toContain(status);

          if (
            typeof status !== "string" ||
            !(
              ALLOWED_STATUSES as readonly string[]
            ).includes(status)
          ) {
            throw new Error(
              `Invalid analysis status for ${scaleCase.word}: ${String(
                status,
              )}`,
            );
          }

          const typedStatus =
            status as AnalysisStatusCodeV0_1;

          expect(
            rawStatus.userDecisionPosture,
          ).toBe("user_decides");

          const claimBoundary =
            rawStatus.claimBoundary;

          expect(
            isRecord(claimBoundary),
          ).toBe(true);

          if (!isRecord(claimBoundary)) {
            throw new Error(
              `Missing claim boundary for ${scaleCase.word}`,
            );
          }

          expect(
            claimBoundary.historicalOriginClaim,
          ).toBe("not_claimed");

          expect(
            claimBoundary.historicalTransmissionClaim,
          ).toBe("not_claimed");

          expect(
            claimBoundary.winnerClaim,
          ).toBe("not_claimed");

          expect(
            claimBoundary.languageSuperiorityClaim,
          ).toBe("not_claimed");

          expect(
            claimBoundary.linguisticOwnershipClaim,
          ).toBe("not_claimed");

          expect(
            claimBoundary.candidateTruthClaim,
          ).toBe("not_claimed");

          expect(
            claimBoundary.structuralOutputIsCandidateTruth,
          ).toBe(false);

          expect(
            claimBoundary.nullIsValid,
          ).toBe(true);

          counts[typedStatus] += 1;

          if (
            !categoryCounts.has(
              scaleCase.category,
            )
          ) {
            categoryCounts.set(
              scaleCase.category,
              {
                reviewed_functional_evidence: 0,
                research_functional_hypothesis: 0,
                candidate_only: 0,
                structural_unreviewed: 0,
                null_no_supported_candidate: 0,
              },
            );
          }

          categoryCounts
            .get(scaleCase.category)![typedStatus] += 1;

          rows.push({
            word:
              scaleCase.word,
            category:
              scaleCase.category,
            status:
              typedStatus,
            reviewedOperators:
              stringArray(
                rawStatus.reviewedOperators,
              ),
            researchHypothesisEmbryos:
              stringArray(
                rawStatus.researchHypothesisEmbryos,
              ),
            candidateOnlyOperators:
              stringArray(
                rawStatus.candidateOnlyOperators,
              ),
            structuralTokens:
              stringArray(
                rawStatus.structuralTokens,
              ),
          });
        }

        expect(
          Object.values(counts)
            .reduce(
              (sum, value) =>
                sum + value,
              0,
            ),
        ).toBe(50);

        console.log(
          "\n=== OPEN INSTRUMENT SCALE-50 BASELINE v0.1 ===",
        );

        console.log(
          "SCALE50_COUNTS=" +
            JSON.stringify(counts),
        );

        console.log(
          "SCALE50_CATEGORY_COUNTS=" +
            JSON.stringify(
              Object.fromEntries(
                categoryCounts,
              ),
            ),
        );

        console.log(
          "SCALE50_ROWS_BEGIN",
        );

        for (const row of rows) {
          console.log(
            [
              row.word,
              row.category,
              row.status,
              `reviewed=${row.reviewedOperators.join(",") || "-"}`,
              `research=${row.researchHypothesisEmbryos.join(",") || "-"}`,
              `candidate=${row.candidateOnlyOperators.join(",") || "-"}`,
              `structural=${row.structuralTokens.join(",") || "-"}`,
            ].join("\t"),
          );
        }

        console.log(
          "SCALE50_ROWS_END",
        );
      },
    );
  },
);
