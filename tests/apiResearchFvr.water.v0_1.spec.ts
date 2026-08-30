import {
  GET,
} from "@/app/api/research/fvr/route";

describe(
  "Open Instrument FVR research API WATER v0.1",
  () => {
    it(
      "returns the admitted WATER recurrence without changing analyze-v1",
      async () => {
        const response =
          await GET(
            new Request(
              "http://localhost/api/research/fvr?concept=water",
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
          "WATER",
        );

        expect(
          json.sharedFunctionalNucleus,
        ).toEqual([
          "U",
        ]);

        expect(
          json.truth
            .functionalVoiceMeaningTruth,
        ).toBe(
          "research_hypothesis",
        );
      },
    );

    it(
      "returns not_available rather than inventing a cohort",
      async () => {
        const response =
          await GET(
            new Request(
              "http://localhost/api/research/fvr?concept=xyz",
            ),
          );

        expect(
          response.status,
        ).toBe(
          404,
        );

        const json:
          any =
          await response.json();

        expect(
          json.status,
        ).toBe(
          "not_available",
        );
      },
    );
  },
);
