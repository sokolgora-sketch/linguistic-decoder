import {
  NextRequest,
} from "next/server";

import {
  GET,
} from "@/app/api/analyze-v1/route";

async function analyze(
  word: string,
) {
  const response =
    await GET(
      new NextRequest(
        `http://localhost/api/analyze-v1?word=${encodeURIComponent(
          word,
        )}&mode=strict`,
      ),
    );

  expect(
    response.status,
  ).toBe(200);

  return response.json();
}

function researchCandidates(
  body: any,
) {
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
) {
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
  "/api/analyze-v1 multi-source functional research runtime v0.1",
  () => {
    it(
      "layers the two admissible ER research witnesses onto STERILE without removing deterministic structural hypotheses",
      async () => {
        const body =
          await analyze(
            "sterile",
          );

        const research =
          researchCandidates(
            body,
          );

        expect(
          research,
        ).toHaveLength(2);

        expect(
          research.map(
            (candidate: any) =>
              candidate.sourceId,
          ),
        ).toEqual([
          "research.external.pokorny-er5-loose-crumbly.v0_1",
          "research.external.greek-eremos-empty-devoid.v0_1",
        ]);

        expect(
          research.map(
            (candidate: any) =>
              candidate.embryo,
          ),
        ).toEqual([
          "ER",
          "ER",
        ]);

        for (
          const candidate
          of research
        ) {
          expect(
            candidate.targetWord,
          ).toBe(
            "sterile",
          );

          expect(
            candidate.claimType,
          ).toBe(
            "functionalMotivation",
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
            candidate.claimBoundary,
          ).toBe(
            "research_functional_hypothesis_only",
          );

          expect(
            candidate.candidateTruthClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.historicalOriginClaim,
          ).toBe(
            "not_claimed",
          );

          expect(
            candidate.userDecisionPosture,
          ).toBe(
            "user_decides",
          );
        }

        expect(
          structuralCandidates(
            body,
          ).map(
            (candidate: any) =>
              candidate.embryo,
          ),
        ).toEqual([
          "ER",
          "ERILE",
        ]);
      },
    );

    it(
      "recomputes STERILE aggregate status as research_functional_hypothesis without promoting reviewed or candidate-only ownership",
      async () => {
        const body =
          await analyze(
            "sterile",
          );

        expect(
          body.analysisStatusV0_1
            .status,
        ).toBe(
          "research_functional_hypothesis",
        );

        expect(
          body.analysisStatusV0_1
            .researchHypothesisEmbryos,
        ).toEqual([
          "ER",
        ]);

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

        expect(
          body.analysisStatusV0_1
            .claimBoundary
            .candidateTruthClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          body.analysisStatusV0_1
            .userDecisionPosture,
        ).toBe(
          "user_decides",
        );
      },
    );

    it(
      "preserves lexical attestation truth separately from the functional bridge hypothesis",
      async () => {
        const body =
          await analyze(
            "sterile",
          );

        const research =
          researchCandidates(
            body,
          );

        const pokorny =
          research.find(
            (candidate: any) =>
              candidate.sourceId ===
              "research.external.pokorny-er5-loose-crumbly.v0_1",
          );

        const greek =
          research.find(
            (candidate: any) =>
              candidate.sourceId ===
              "research.external.greek-eremos-empty-devoid.v0_1",
          );

        expect(
          pokorny,
        ).toBeTruthy();

        expect(
          pokorny
            .attestationTruth,
        ).toBe(
          "inference",
        );

        expect(
          pokorny
            .functionalBridgeTruth,
        ).toBe(
          "hypothesis",
        );

        expect(
          greek,
        ).toBeTruthy();

        expect(
          greek
            .attestationTruth,
        ).toBe(
          "fact",
        );

        expect(
          greek
            .functionalBridgeTruth,
        ).toBe(
          "hypothesis",
        );

        expect(
          greek
            .plainStandaloneGloss,
        ).toContain(
          "empty",
        );

        expect(
          greek
            .semanticBridge,
        ).toContain(
          "productive or reproductive capacity",
        );

        expect(
          greek
            .evidenceRefs,
        ).toEqual([
          "research.external.logeion-eremos.citation.v0_1",
          "research.external.pokorny-er5-greek-reflex.citation.v0_1",
        ]);
      },
    );

    it(
      "does not leak STERILE-bound ER research witnesses into TERROR",
      async () => {
        const body =
          await analyze(
            "terror",
          );

        expect(
          researchCandidates(
            body,
          ),
        ).toEqual([]);
      },
    );

    it(
      "keeps reviewed STUDY ownership above the research lane and emits no STERILE-bound research witness",
      async () => {
        const body =
          await analyze(
            "study",
          );

        expect(
          researchCandidates(
            body,
          ),
        ).toEqual([]);

        expect(
          body.analysisStatusV0_1
            .status,
        ).toBe(
          "reviewed_functional_evidence",
        );

        expect(
          body.analysisStatusV0_1
            .reviewedOperators,
        ).toContain(
          "DI",
        );
      },
    );
  },
);
