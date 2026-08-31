import {
  GET,
} from "@/app/api/research/fvr/route";

describe(
  "Open Instrument FVR research API EYE v0.1",
  () => {
    it(
      "returns the admitted EYE recurrence through the generic endpoint",
      async () => {
        const response =
          await GET(
            new Request(
              "http://localhost/api/research/fvr?concept=eye",
            ),
          );

        expect(
          response.status,
        ).toBe(
          200,
        );

        const json:
          any =
          await response.json();

        expect(
          json.status,
        ).toBe(
          "available",
        );

        expect(
          json.conceptId,
        ).toBe(
          "EYE",
        );

        expect(
          json.sharedFunctionalNucleus,
        ).toEqual([
          "Y",
        ]);

        expect(
          json.observations.map(
            (
              observation: any,
            ) =>
              observation.comparisonForm,
          ),
        ).toEqual([
          "EYE",
          "SY",
        ]);

        expect(
          json.truth
            .recurrenceObservationTruth,
        ).toBe(
          "fact_within_declared_comparison_forms",
        );

        expect(
          json.truth
            .functionalVoiceMeaningTruth,
        ).toBe(
          "research_hypothesis",
        );
      },
    );
  },
);
