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

function structuralCandidates(
  payload: any,
): any[] {
  const candidates =
    Array.isArray(
      payload?.candidates,
    )
      ? payload.candidates
      : [];

  return candidates.filter(
    (candidate: any) =>
      candidate?.sourceKind ===
        "logic_derived_structural_hypothesis" &&
      candidate?.claimType ===
        "structuralHypothesis",
  );
}

describe(
  "/api/analyze-v1 logic-first structural hypotheses v0.1",
  () => {
    it(
      "projects the generic STERILE structural hypotheses without promoting them to reviewed truth",
      async () => {
        const body =
          await analyze(
            "sterile",
          );

        const structural =
          structuralCandidates(
            body,
          );

        expect(
          structural.map(
            (candidate) =>
              candidate.embryo,
          ),
        ).toEqual([
          "ER",
          "ERILE",
        ]);

        const er =
          structural[0];

        expect(
          er.candidateId,
        ).toBe(
          "logic-structural:sterile:er:peel_right_vowel_led_expansion+peel_left_consonant_frame+peel_left_consonant_frame",
        );

        expect(
          er.embryoSize,
        ).toBe(2);

        expect(
          er.embryoLanguage,
        ).toBeNull();

        expect(
          er.isolatedStandaloneForm,
        ).toBeNull();

        expect(
          er.plainStandaloneGloss,
        ).toBeNull();

        expect(
          er.sourceNote,
        ).toBeNull();

        expect(
          er.semanticBridge,
        ).toBeNull();

        expect(
          er.independentStandaloneMeaning,
        ).toBeNull();

        expect(
          er.hypothesisVersion,
        ).toBe(
          "z-zero.structural-hypothesis.v0_1",
        );

        expect(
          er.discoveryStatus,
        ).toBe(
          "structural_hypothesis",
        );

        expect(
          er.lexicalAttestation,
        ).toBe(
          "not_evaluated",
        );

        expect(
          er.functionalSupportStatus,
        ).toBe(
          "unknown",
        );

        expect(
          Array.isArray(
            er.reductionSteps,
          ),
        ).toBe(true);

        expect(
          er.reductionSteps,
        ).toHaveLength(3);

        expect(
          er.reductionSteps.map(
            (step: any) =>
              step.operationId,
          ),
        ).toEqual([
          "peel_right_vowel_led_expansion",
          "peel_left_consonant_frame",
          "peel_left_consonant_frame",
        ]);

        expect(
          er.reasonCodes,
        ).toEqual(
          expect.arrayContaining([
            "terminal_structural_hypothesis_reached",
            "minimum_defensible_embryo_reached",
            "independent_meaning_unknown",
          ]),
        );

        expect(
          er.validationOutcome,
        ).toBe(
          "not_evaluated",
        );

        expect(
          er.rankGroup,
        ).toBe(
          "structuralHypothesis",
        );

        expect(
          er.originClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          er.historicalRelation,
        ).toBe(
          "not_evaluated",
        );

        expect(
          er.userDecisionPosture,
        ).toBe(
          "user_decides",
        );

        expect(
          er.expansionChain,
        ).toEqual([
          "ER",
          "TER",
          "STER",
          "STERILE",
        ]);

        expect(
          er.validationReasons,
        ).toEqual(
          expect.arrayContaining([
            "terminal_structural_hypothesis_reached",
            "minimum_defensible_embryo_reached",
            "independent_meaning_unknown",
            "lexical_attestation_not_required_for_discovery",
            "historical_origin_not_claimed",
            "candidate_truth_not_claimed",
            "production_promotion_not_claimed",
          ]),
        );

        expect(
          er.evidenceRefs,
        ).toEqual([]);

        expect(
          er.candidateTruthClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          er.historicalOriginClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          er.historicalTransmissionClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          er.winnerClaim,
        ).toBe(
          "not_claimed",
        );

        expect(
          er.languageSuperiorityClaim,
        ).toBe(
          "not_claimed",
        );
      },
    );

    it(
      "reconciles STERILE aggregate status from Null to structural_unreviewed",
      async () => {
        const body =
          await analyze(
            "sterile",
          );

        expect(
          body.analysisStatusV0_1
            .status,
        ).toBe(
          "structural_unreviewed",
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
        ).toEqual([
          "ER",
          "ERILE",
        ]);

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
      "does not feed structural discovery back into historical origin or winner truth",
      async () => {
        const body =
          await analyze(
            "sterile",
          );

        expect(
          body.originClaim
            ?.policy,
        ).toBe(
          "no_single_winner",
        );

        expect(
          Array.isArray(
            body.originClaim
              ?.candidates,
          )
            ? body.originClaim
                .candidates
            : [],
        ).toEqual([]);
      },
    );

    it(
      "keeps the live TERROR control closed against ER and TER leakage",
      async () => {
        const body =
          await analyze(
            "terror",
          );

        const embryos =
          structuralCandidates(
            body,
          ).map(
            (candidate) =>
              candidate.embryo,
          );

        expect(
          embryos,
        ).not.toContain("ER");

        expect(
          embryos,
        ).not.toContain("TER");

        // Negative-control contract: other structural hypotheses
        // are optional. The mandatory boundary is no ER/TER
        // leakage and no unauthorized TERR -> TER surgery.
      },
    );
  },
);
