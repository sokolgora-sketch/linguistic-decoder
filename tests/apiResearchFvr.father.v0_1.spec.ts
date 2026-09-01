import {
  GET,
} from "@/app/api/research/fvr/route";

describe(
  "Open Instrument FVR research API FATHER v0.1",
  () => {
    it(
      "returns the admitted FATHER recurrence through the generic endpoint",
      async () => {
        const response =
          await GET(
            new Request(
              "http://localhost/api/research/fvr?concept=father",
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
          "FATHER",
        );

        expect(
          json.sharedFunctionalNucleus,
        ).toEqual([
          "A",
        ]);

        expect(
          json.observations.map(
            (
              observation: any,
            ) =>
              observation.comparisonForm,
          ),
        ).toEqual([
          "FATHER",
          "AT",
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
