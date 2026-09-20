import {
  GET,
} from "../app/api/analyze-v1/route";

async function analyze(
  word: string,
): Promise<any> {
  const response =
    await GET(
      new Request(
        "http://localhost/api/analyze-v1?word=" +
          encodeURIComponent(word) +
          "&mode=strict",
      ),
    );

  expect(
    response.status,
  ).toBe(200);

  return response.json();
}

function researchCandidates(
  body: any,
): any[] {
  return Array.isArray(
    body?.candidates,
  )
    ? body.candidates.filter(
        (candidate: any) =>
          candidate?.sourceKind ===
          "multi_source_research_witness",
      )
    : [];
}

function structuralCandidates(
  body: any,
): any[] {
  return Array.isArray(
    body?.candidates,
  )
    ? body.candidates.filter(
        (candidate: any) =>
          candidate?.sourceKind ===
          "logic_derived_structural_hypothesis",
      )
    : [];
}

describe(
  "Open Instrument evidence-first research embryo fallback v0.1",
  () => {
    it(
      "lets source-attested LOVE research fill a true structural Null without inventing structural surgery",
      async () => {
        const body =
          await analyze(
            "love",
          );

        expect(
          structuralCandidates(
            body,
          ),
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .status,
        ).not.toBe("research_functional_hypothesis");

        expect(
          new Set(
            body.analysisStatusV0_1
              .researchHypothesisEmbryos,
          ),
        ).toEqual(
          new Set(),
        );

        expect(
          body.analysisStatusV0_1
            .reviewedOperators,
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .candidateOnlyOperators,
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .structuralTokens,
        ).toEqual([]);

        const research =
          researchCandidates(
            body,
          );

        expect(
          research,
        ).toHaveLength(2);

        expect(
          new Set(
            research.map(
              (candidate: any) =>
                candidate.sourceId,
            ),
          ),
        ).toEqual(
          new Set([
            "research.external.albanian-dua-love.v0_1",
            "research.external.latin-amo-love.v0_1",
          ]),
        );

        expect(
          new Set(
            research.map(
              (candidate: any) =>
                candidate.embryo,
            ),
          ),
        ).toEqual(
          new Set(["AMO", "DUA"]),
        );

        for (
          const candidate
          of research
        ) {
          expect(
            candidate.claimType,
          ).toBe(
            "unresolved",
          );

          expect(
            candidate.validationOutcome,
          ).toBe(
            "not_evaluated",
          );

          expect(
            candidate.rankGroup,
          ).toBe(
            "unresolved",
          );

          expect(
            candidate.sourceStatus,
          ).toBe(
            "research_candidate",
          );

          expect(
            candidate.embryoAuthority,
          ).toBe(
            "source_attested_exact_form",
          );

          expect(
            candidate.claimBoundary,
          ).toBe(
            "lexical_source_evidence_only",
          );

          expect(candidate.evidenceBasis).toBe("lexical_equivalence");
          expect(candidate.functionalBridgeTruth).toBe("unknown");

          expect(candidate.evidenceBasis).toBe("lexical_equivalence");
          expect(candidate.functionalBridgeTruth).toBe("unknown");

          expect(candidate.evidenceBasis).toBe("lexical_equivalence");
          expect(candidate.functionalBridgeTruth).toBe("unknown");

          expect(
            candidate.historicalOriginClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.candidateTruthClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.userDecisionPosture,
          ).toBe(
            "user_decides",
          );
        }
      },
    );

    it(
      "admits source-backed HOPE research without promoting semantic truth",
      async () => {
        const body =
          await analyze(
            "hope",
          );

        expect(
          structuralCandidates(
            body,
          ),
        ).toEqual([]);

        expect(
          researchCandidates(
            body,
          ),
        ).toHaveLength(2);

        expect(
          body.analysisStatusV0_1
            .status,
        ).not.toBe("research_functional_hypothesis");

        expect(
          body.analysisStatusV0_1
            .researchHypothesisEmbryos,
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .reviewedOperators,
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .candidateOnlyOperators,
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .structuralTokens,
        ).toEqual([]);

        for (
          const candidate
          of researchCandidates(
            body,
          )
        ) {
          expect(
            candidate.targetWord,
          ).toBe(
            "hope",
          );

          expect(
            candidate.sourceStatus,
          ).toBe(
            "research_candidate",
          );

          expect(
            candidate.claimBoundary,
          ).toBe(
            "lexical_source_evidence_only",
          );

          expect(
            candidate.historicalOriginClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.historicalTransmissionClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.winnerClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.languageSuperiorityClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.candidateTruthClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.userDecisionPosture,
          ).toBe(
            "user_decides",
          );
        }
      },
    );

    it.each([
      [
        "study",
        "reviewed_functional_evidence",
      ],
      [
        "damage",
        "reviewed_functional_evidence",
      ],
      [
        "father",
        "reviewed_functional_evidence",
      ],
    ] as const)(
      "does not outrank existing stronger truth for %s",
      async (
        word,
        expectedStatus,
      ) => {
        const body =
          await analyze(
            word,
          );

        expect(
          body.analysisStatusV0_1
            .status,
        ).toBe(
          expectedStatus,
        );

        expect(
          researchCandidates(
            body,
          ),
        ).toEqual([]);
      },
    );
  },
);
