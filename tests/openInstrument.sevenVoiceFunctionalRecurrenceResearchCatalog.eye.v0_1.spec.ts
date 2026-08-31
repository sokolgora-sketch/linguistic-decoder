import {
  buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1,
  resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceResearchCatalog.v0_1";

describe(
  "Open Instrument EYE Seven-Voice Functional Recurrence research catalog v0.1",
  () => {
    it(
      "resolves EYE generically from catalog identity",
      () => {
        expect(
          resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
            "eye",
          )?.conceptId,
        ).toBe(
          "EYE",
        );

        expect(
          resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
            "EYE",
          )?.conceptId,
        ).toBe(
          "EYE",
        );
      },
    );

    it(
      "admits the source-backed EYE cohort and returns shared Y",
      () => {
        const result =
          buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
            "eye",
          );

        expect(
          result?.status,
        ).toBe(
          "available",
        );

        if (
          !result ||
          result.status !==
            "available"
        ) {
          throw new Error(
            "expected EYE recurrence research surface",
          );
        }

        expect(
          result.sharedFunctionalNucleus,
        ).toEqual([
          "Y",
        ]);

        expect(
          result.sharedCanonicalVoices,
        ).toEqual([
          "Y",
        ]);

        expect(
          result.observations.map(
            (
              observation,
            ) => ({
              language:
                observation.languageId,
              variety:
                observation.languageVariety,
              surface:
                observation.surfaceForm,
              comparison:
                observation.comparisonForm,
              mode:
                observation.comparisonMode,
              path:
                observation.voicePath,
            }),
          ),
        ).toEqual([
          {
            language:
              "English",
            variety:
              null,
            surface:
              "EYE",
            comparison:
              "EYE",
            mode:
              "orthography",
            path: [
              "E",
              "Y",
              "E",
            ],
          },
          {
            language:
              "Albanian",
            variety:
              "Standard",
            surface:
              "SY",
            comparison:
              "SY",
            mode:
              "orthography",
            path: [
              "Y",
            ],
          },
        ]);

        expect(
          result.truth,
        ).toEqual({
          recurrenceObservationTruth:
            "fact_within_declared_comparison_forms",
          functionalVoiceMeaningTruth:
            "research_hypothesis",
        });

        expect(
          result.observations.every(
            (
              observation,
            ) =>
              observation.sourceStatus ===
              "research_candidate",
          ),
        ).toBe(
          true,
        );

        expect(
          result.observations.map(
            (
              observation,
            ) =>
              observation
                .citations[0]
                ?.sourceUrlOrArchiveRef,
          ),
        ).toEqual([
          "https://www.oxfordlearnersdictionaries.com/us/definition/english/eye_1",
          "https://iecor.clld.org/cognatesets/211",
        ]);
      },
    );
  },
);
