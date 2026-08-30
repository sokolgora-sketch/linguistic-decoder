import {
  buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1,
  resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceResearchCatalog.v0_1";

describe(
  "Open Instrument WATER Seven-Voice Functional Recurrence research catalog v0.1",
  () => {
    it(
      "resolves WATER generically from catalog identity rather than runtime word shortcuts",
      () => {
        expect(
          resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
            "water",
          )?.conceptId,
        ).toBe(
          "WATER",
        );

        expect(
          resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
            "WATER",
          )?.conceptId,
        ).toBe(
          "WATER",
        );

        expect(
          resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
            "xyz",
          ),
        ).toBeNull();
      },
    );

    it(
      "admits the real source-backed WATER cohort and returns shared U",
      () => {
        const result =
          buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
            "water",
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
            "expected WATER recurrence research surface",
          );
        }

        expect(
          result.sharedFunctionalNucleus,
        ).toEqual([
          "U",
        ]);

        expect(
          result.sharedCanonicalVoices,
        ).toEqual([
          "U",
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
              "WATER",
            comparison:
              "UOTER",
            mode:
              "z_zero_functional_normalization",
            path: [
              "U",
              "O",
              "E",
            ],
          },
          {
            language:
              "Albanian",
            variety:
              "Standard",
            surface:
              "UJË",
            comparison:
              "UJË",
            mode:
              "orthography",
            path: [
              "U",
              "Ë",
            ],
          },
          {
            language:
              "Albanian",
            variety:
              "Gheg",
            surface:
              "UJ",
            comparison:
              "UJ",
            mode:
              "orthography",
            path: [
              "U",
            ],
          },
          {
            language:
              "Mandarin Chinese",
            variety:
              "Mandarin",
            surface:
              "shuǐ",
            comparison:
              "SHUI",
            mode:
              "transliteration",
            path: [
              "U",
              "I",
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
          "https://www.oxfordlearnersdictionaries.com/us/definition/english/water_1",
          "https://iecor.clld.org/cognatesets/335",
          "https://www.zeitschrift-fuer-balkanologie.de/index.php/zfb/article/download/382/407/732",
          "https://dict.revised.moe.edu.tw/dictView.jsp?ID=9163&q=1&word=%E6%B0%B4",
        ]);
      },
    );

    it(
      "does not manufacture a recurrence surface for an unknown concept",
      () => {
        expect(
          buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
            "xyz",
          ),
        ).toBeNull();
      },
    );
  },
);
