import {
  analyzeSevenVoiceFunctionalRecurrenceV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrence.v0_1";

describe(
  "Open Instrument Seven-Voice Functional Recurrence v0.1",
  () => {
    it(
      "finds shared U across the declared WATER functional-normalization cohort",
      () => {
        const result =
          analyzeSevenVoiceFunctionalRecurrenceV0_1({
            conceptId:
              "water",
            forms: [
              {
                languageId:
                  "english",
                surfaceForm:
                  "water",
                comparisonForm:
                  "uoter",
                comparisonMode:
                  "z_zero_functional_normalization",
                comparisonAuthority:
                  "z_zero_project_doctrine",
              },
              {
                languageId:
                  "albanian",
                surfaceForm:
                  "ujë",
                comparisonForm:
                  "ujë",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "attested_surface_form",
              },
              {
                languageId:
                  "gheg_albanian",
                surfaceForm:
                  "uj",
                comparisonForm:
                  "uj",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "attested_surface_form",
              },
              {
                languageId:
                  "mandarin_pinyin",
                surfaceForm:
                  "shuǐ",
                comparisonForm:
                  "shui",
                comparisonMode:
                  "transliteration",
                comparisonAuthority:
                  "declared_transliteration",
              },
            ],
          });

        expect(
          result.conceptId,
        ).toBe(
          "water",
        );

        expect(
          result.observations.map(
            (row) => ({
              languageId:
                row.languageId,
              surfaceForm:
                row.surfaceForm,
              comparisonForm:
                row.comparisonForm,
              comparisonMode:
                row.comparisonMode,
              voicePath:
                row.voicePath,
            }),
          ),
        ).toEqual([
          {
            languageId:
              "english",
            surfaceForm:
              "water",
            comparisonForm:
              "uoter",
            comparisonMode:
              "z_zero_functional_normalization",
            voicePath: [
              "U",
              "O",
              "E",
            ],
          },
          {
            languageId:
              "albanian",
            surfaceForm:
              "ujë",
            comparisonForm:
              "ujë",
            comparisonMode:
              "orthography",
            voicePath: [
              "U",
              "Ë",
            ],
          },
          {
            languageId:
              "gheg_albanian",
            surfaceForm:
              "uj",
            comparisonForm:
              "uj",
            comparisonMode:
              "orthography",
            voicePath: [
              "U",
            ],
          },
          {
            languageId:
              "mandarin_pinyin",
            surfaceForm:
              "shuǐ",
            comparisonForm:
              "shui",
            comparisonMode:
              "transliteration",
            voicePath: [
              "U",
              "I",
            ],
          },
        ]);

        expect(
          result.sharedCanonicalVoices,
        ).toEqual([
          "U",
        ]);

        expect(
          result.sharedFunctionalNucleus,
        ).toEqual([
          "U",
        ]);
      },
    );

    it(
      "finds shared Y across SY and EYE without claiming phonetic identity",
      () => {
        const result =
          analyzeSevenVoiceFunctionalRecurrenceV0_1({
            conceptId:
              "eye",
            forms: [
              {
                languageId:
                  "albanian",
                surfaceForm:
                  "sy",
                comparisonForm:
                  "sy",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "attested_surface_form",
              },
              {
                languageId:
                  "english",
                surfaceForm:
                  "eye",
                comparisonForm:
                  "eye",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "attested_surface_form",
              },
            ],
          });

        expect(
          result.observations.map(
            (row) =>
              row.voicePath,
          ),
        ).toEqual([
          [
            "Y",
          ],
          [
            "E",
            "Y",
            "E",
          ],
        ]);

        expect(
          result.sharedCanonicalVoices,
        ).toEqual([
          "Y",
        ]);

        expect(
          result.sharedFunctionalNucleus,
        ).toEqual([
          "Y",
        ]);

        expect(
          result.claimBoundary
            .phoneticIdentityClaim,
        ).toBe(
          "not_claimed",
        );
      },
    );

    it(
      "does not silently convert raw WATER orthography into the U recurrence",
      () => {
        const result =
          analyzeSevenVoiceFunctionalRecurrenceV0_1({
            conceptId:
              "water_raw_control",
            forms: [
              {
                languageId:
                  "english",
                surfaceForm:
                  "water",
                comparisonForm:
                  "water",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "attested_surface_form",
              },
              {
                languageId:
                  "albanian",
                surfaceForm:
                  "ujë",
                comparisonForm:
                  "ujë",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "attested_surface_form",
              },
              {
                languageId:
                  "gheg_albanian",
                surfaceForm:
                  "uj",
                comparisonForm:
                  "uj",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "attested_surface_form",
              },
            ],
          });

        expect(
          result.observations[0]
            ?.voicePath,
        ).toEqual([
          "A",
          "E",
        ]);

        expect(
          result.sharedCanonicalVoices,
        ).toEqual([]);

        expect(
          result.sharedFunctionalNucleus,
        ).toEqual([]);
      },
    );

    it(
      "keeps recurrence observation separate from function and historical claims",
      () => {
        const result =
          analyzeSevenVoiceFunctionalRecurrenceV0_1({
            conceptId:
              "water",
            forms: [
              {
                languageId:
                  "english",
                surfaceForm:
                  "water",
                comparisonForm:
                  "uoter",
                comparisonMode:
                  "z_zero_functional_normalization",
                comparisonAuthority:
                  "z_zero_project_doctrine",
              },
              {
                languageId:
                  "albanian",
                surfaceForm:
                  "uj",
                comparisonForm:
                  "uj",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "attested_surface_form",
              },
            ],
          });

        expect(
          result.claimBoundary,
        ).toEqual({
          recurrenceObservationTruth:
            "fact_within_declared_comparison_forms",
          functionalVoiceMeaningTruth:
            "research_hypothesis",
          phoneticIdentityClaim:
            "not_claimed",
          historicalOriginClaim:
            "not_claimed",
          historicalTransmissionClaim:
            "not_claimed",
          cognacyClaim:
            "not_claimed",
          borrowingClaim:
            "not_claimed",
          winnerClaim:
            "not_claimed",
          candidateTruthClaim:
            "not_claimed",
          universalityClaim:
            "not_claimed",
          userDecisionPosture:
            "user_decides",
        });
      },
    );

    it(
      "uses the canonical Seven-Voice SSOT and preserves deterministic voice order",
      () => {
        const result =
          analyzeSevenVoiceFunctionalRecurrenceV0_1({
            conceptId:
              "determinism_control",
            forms: [
              {
                languageId:
                  "one",
                surfaceForm:
                  "uoyë",
                comparisonForm:
                  "uoyë",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "synthetic_control",
              },
              {
                languageId:
                  "two",
                surfaceForm:
                  "yu",
                comparisonForm:
                  "yu",
                comparisonMode:
                  "orthography",
                comparisonAuthority:
                  "synthetic_control",
              },
            ],
          });

        expect(
          result.sharedCanonicalVoices,
        ).toEqual([
          "U",
          "Y",
        ]);

        expect(
          result.sharedFunctionalNucleus,
        ).toEqual([
          "U",
          "Y",
        ]);
      },
    );
  },
);
