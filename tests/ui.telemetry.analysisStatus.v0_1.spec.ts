require("./helpers/whatwgGlobals.cjs");

const {
  GET,
} = require("../app/api/analyze-v1/route");

const {
  adaptAnalysisToTelemetryVM,
} = require(
  "../src/ui/instrument/contractAdapter"
);

describe(
  "Telemetry VM analysisStatusV0_1",
  () => {
    it.each([
      [
        "damage",
        "reviewed_functional_evidence",
      ],
      [
        "study",
        "reviewed_functional_evidence",
      ],
      [
        "sterile",
        "research_functional_hypothesis",
      ],
      [
        "data",
        "candidate_only",
      ],
      [
        "dij",
        "candidate_only",
      ],
      [
        "mode",
        "structural_unreviewed",
      ],
      [
        "xyz",
        "null_no_supported_candidate",
      ],
    ] as const)(
      "maps %s as %s",
      async (
        word,
        expectedStatus,
      ) => {
        const response = await GET({
          url:
            "http://localhost:3000/api/analyze-v1?word=" +
            encodeURIComponent(word) +
            "&mode=strict",
        } as any);

        const json =
          await response.json();

        const vm =
          adaptAnalysisToTelemetryVM(
            json,
          );

        expect(
          vm.analysisStatusV0_1.kind,
        ).toBe("present");

        if (
          vm.analysisStatusV0_1.kind ===
          "present"
        ) {
          const value =
            vm.analysisStatusV0_1.value;

          expect(value.status).toBe(
            expectedStatus,
          );

          expect(
            value.userDecisionPosture,
          ).toBe("user_decides");

          expect(
            value.claimBoundary
              .structuralOutputIsCandidateTruth,
          ).toBe(false);

          expect(
            value.claimBoundary
              .nullIsValid,
          ).toBe(true);

          if (
            word ===
            "sterile"
          ) {
            expect(
              value
                .researchHypothesisEmbryos,
            ).toEqual([
              "ER",
            ]);

            expect(
              value
                .reviewedOperators,
            ).toEqual([]);

            expect(
              value
                .candidateOnlyOperators,
            ).toEqual([]);

            expect(
              value
                .structuralTokens,
            ).toEqual([]);
          }
        }
      },
    );

    it(
      "fails visibly when the field is absent",
      () => {
        const vm =
          adaptAnalysisToTelemetryVM({
            word: "xyz",
          });

        expect(
          vm.analysisStatusV0_1,
        ).toEqual({
          kind: "missing",
          missing: "not_emitted",
          note: "analysisStatusV0_1",
        });
      },
    );
  },
);
