import {
  buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1,
  resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceResearchCatalog.v0_1";

describe(
  "Open Instrument FATHER Seven-Voice Functional Recurrence research catalog v0.1",
  () => {
    it(
      "resolves FATHER generically from catalog identity",
      () => {
        expect(
          resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
            "father",
          )?.conceptId,
        ).toBe(
          "FATHER",
        );

        expect(
          resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
            "FATHER",
          )?.conceptId,
        ).toBe(
          "FATHER",
        );
      },
    );

    it(
      "admits the source-backed FATHER cohort and returns shared A",
      () => {
        const result =
          buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
            "father",
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
            "expected FATHER recurrence research surface",
          );
        }

        expect(
          result.sharedFunctionalNucleus,
        ).toEqual([
          "A",
        ]);

        expect(
          result.sharedCanonicalVoices,
        ).toEqual([
          "A",
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
              "FATHER",
            comparison:
              "FATHER",
            mode:
              "orthography",
            path: [
              "A",
              "E",
            ],
          },
          {
            language:
              "Albanian",
            variety:
              null,
            surface:
              "AT",
            comparison:
              "AT",
            mode:
              "orthography",
            path: [
              "A",
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
          "https://www.oxfordlearnersdictionaries.com/us/definition/english/father_1",
          "https://ieed.ullet.net/alb.html",
        ]);

        expect(
          result.observations[1]
            ?.citations[0],
        ).toEqual(
          expect.objectContaining({
            sourceTitle:
              "The Albanian inherited lexicon",
            sourceAuthorOrEditor:
              "Bardhyl Demiraj; database revised by Alexander Lubotsky and Michiel de Vaan",
            attestedForm:
              "at",
            attestedGloss:
              "father",
          }),
        );
      },
    );
  },
);
