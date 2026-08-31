import {
  SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,
  type SevenVoiceFunctionalRecurrenceCohortEvidenceInputV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceCohortEvidence.v0_1";

export type SevenVoiceFunctionalRecurrenceResearchCohortCatalogEntryV0_1 =
  Readonly<{
    conceptId: string;
    aliases: readonly string[];
    cohort:
      SevenVoiceFunctionalRecurrenceCohortEvidenceInputV0_1;
  }>;

const claimBoundary = {
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
  languageSuperiorityClaim:
    "not_claimed",
  candidateTruthClaim:
    "not_claimed",
  universalityClaim:
    "not_claimed",
  userDecisionPosture:
    "user_decides",
} as const;

/**
 * Real source-attested research cohort.
 *
 * Important:
 * - lexical surfaces are source-attested;
 * - WATER -> UOTER is project-doctrine comparison data,
 *   not an English orthographic or phonetic fact;
 * - shuǐ -> SHUI is an explicit Hanyu-Pinyin comparison transform;
 * - recurrence meaning remains a research hypothesis;
 * - no row is promoted to candidate truth or historical origin.
 */
export const
sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1 =
  [
    {
      conceptId:
        "WATER",

      aliases: [
        "water",
      ],

      cohort: {
        schemaVersion:
          SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,

        cohortId:
          "research.recurrence.water.v0_1",

        conceptId:
          "WATER",

        observations: [
          {
            recurrenceEvidenceId:
              "research.water.english-water.v0_1",

            evidenceRole:
              "cohort_member",

            languageId:
              "English",

            languageVariety:
              null,

            surfaceForm:
              "WATER",

            comparisonForm:
              "UOTER",

            comparisonMode:
              "z_zero_functional_normalization",

            comparisonAuthority:
              "z_zero_project_doctrine",

            comparisonProvenance: {
              provenanceId:
                "research.water.english-uoter.provenance.v0_1",

              authority:
                "z_zero_project_doctrine",

              ruleId:
                "z-zero.fvr.water-to-uoter.project-doctrine.v0_1",

              evidenceRefs: [
                "docs/open-instrument/z-zero-seven-voice-functional-recurrence-milestone-v0.1.md#water-proving-cohort",
                "SEVEN_VOICE_FUNCTIONAL_RECURRENCE_V0_1",
              ],
            },

            attestationTruth:
              "fact",

            sourceStatus:
              "research_candidate",

            citations: [
              {
                citationId:
                  "research.water.english.oxford-water.v0_1",

                sourceTitle:
                  "Oxford Advanced Learner's Dictionary — water noun",

                sourceAuthorOrEditor:
                  null,

                sourcePublisherOrHost:
                  "Oxford University Press",

                sourceDateOrVersion:
                  "accessed 2026-08-30",

                sourceUrlOrArchiveRef:
                  "https://www.oxfordlearnersdictionaries.com/us/definition/english/water_1",

                entryLocator:
                  "water noun; sense 1",

                sourceHashOrArchiveHash:
                  null,

                attestedForm:
                  "WATER",

                attestedGloss:
                  "water",
              },
            ],

            claimBoundary,
          },

          {
            recurrenceEvidenceId:
              "research.water.albanian-standard-uje.v0_1",

            evidenceRole:
              "cohort_member",

            languageId:
              "Albanian",

            languageVariety:
              "Standard",

            surfaceForm:
              "UJË",

            comparisonForm:
              "UJË",

            comparisonMode:
              "orthography",

            comparisonAuthority:
              "source_orthography",

            comparisonProvenance: {
              provenanceId:
                "research.water.albanian-standard-uje.orthography.v0_1",

              authority:
                "source_orthography",

              ruleId:
                null,

              evidenceRefs: [],
            },

            attestationTruth:
              "fact",

            sourceStatus:
              "research_candidate",

            citations: [
              {
                citationId:
                  "research.water.albanian-standard.iecor.v0_1",

                sourceTitle:
                  "IE-CoR Cognate Set 335 — water",

                sourceAuthorOrEditor:
                  "Matthew Scarborough et al.",

                sourcePublisherOrHost:
                  "IE-CoR",

                sourceDateOrVersion:
                  "accessed 2026-08-30",

                sourceUrlOrArchiveRef:
                  "https://iecor.clld.org/cognatesets/335",

                entryLocator:
                  "Albanian: Standard; lexeme ujë; meaning water",

                sourceHashOrArchiveHash:
                  null,

                attestedForm:
                  "UJË",

                attestedGloss:
                  "water",
              },
            ],

            claimBoundary,
          },

          {
            recurrenceEvidenceId:
              "research.water.albanian-gheg-uj.v0_1",

            evidenceRole:
              "cohort_member",

            languageId:
              "Albanian",

            languageVariety:
              "Gheg",

            surfaceForm:
              "UJ",

            comparisonForm:
              "UJ",

            comparisonMode:
              "orthography",

            comparisonAuthority:
              "source_orthography",

            comparisonProvenance: {
              provenanceId:
                "research.water.albanian-gheg-uj.orthography.v0_1",

              authority:
                "source_orthography",

              ruleId:
                null,

              evidenceRefs: [],
            },

            attestationTruth:
              "fact",

            sourceStatus:
              "research_candidate",

            citations: [
              {
                citationId:
                  "research.water.albanian-gheg.boretzky-2014.v0_1",

                sourceTitle:
                  "Konjunktiv und Infinitiv im gegischen Dialekt des Albanischen",

                sourceAuthorOrEditor:
                  "Norbert Boretzky",

                sourcePublisherOrHost:
                  "Zeitschrift für Balkanologie",

                sourceDateOrVersion:
                  "50 (2014) 2",

                sourceUrlOrArchiveRef:
                  "https://www.zeitschrift-fuer-balkanologie.de/index.php/zfb/article/download/382/407/732",

                entryLocator:
                  "p.145, example (1): e la me pi uj ... translated with Wasser",

                sourceHashOrArchiveHash:
                  null,

                attestedForm:
                  "UJ",

                attestedGloss:
                  "Wasser",
              },
            ],

            claimBoundary,
          },

          {
            recurrenceEvidenceId:
              "research.water.mandarin-shui.v0_1",

            evidenceRole:
              "cohort_member",

            languageId:
              "Mandarin Chinese",

            languageVariety:
              "Mandarin",

            surfaceForm:
              "shuǐ",

            comparisonForm:
              "SHUI",

            comparisonMode:
              "transliteration",

            comparisonAuthority:
              "hanyu_pinyin",

            comparisonProvenance: {
              provenanceId:
                "research.water.mandarin-shui.transliteration.v0_1",

              authority:
                "hanyu_pinyin",

              ruleId:
                "z-zero.fvr.hanyu-pinyin-tone-strip-uppercase.v0_1",

              evidenceRefs: [
                "https://dict.revised.moe.edu.tw/dictView.jsp?ID=9163&q=1&word=%E6%B0%B4",
              ],
            },

            attestationTruth:
              "fact",

            sourceStatus:
              "research_candidate",

            citations: [
              {
                citationId:
                  "research.water.mandarin.moe-shui.v0_1",

                sourceTitle:
                  "Revised Mandarin Chinese Dictionary — 水",

                sourceAuthorOrEditor:
                  null,

                sourcePublisherOrHost:
                  "Ministry of Education, Republic of China (Taiwan)",

                sourceDateOrVersion:
                  "2021; accessed 2026-08-30",

                sourceUrlOrArchiveRef:
                  "https://dict.revised.moe.edu.tw/dictView.jsp?ID=9163&q=1&word=%E6%B0%B4",

                entryLocator:
                  "水; Hanyu Pinyin shuǐ; interpretation 1",

                sourceHashOrArchiveHash:
                  null,

                attestedForm:
                  "shuǐ",

                attestedGloss:
                  "無色無臭的液體",
              },
            ],

            claimBoundary,
          },
        ],
      },
    },

    {
      conceptId:
        "EYE",

      aliases: [
        "eye",
      ],

      cohort: {
        schemaVersion:
          SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,

        cohortId:
          "research.recurrence.eye.v0_1",

        conceptId:
          "EYE",

        observations: [
          {
            recurrenceEvidenceId:
              "research.eye.english-eye.v0_1",

            evidenceRole:
              "cohort_member",

            languageId:
              "English",

            languageVariety:
              null,

            surfaceForm:
              "EYE",

            comparisonForm:
              "EYE",

            comparisonMode:
              "orthography",

            comparisonAuthority:
              "source_orthography",

            comparisonProvenance: {
              provenanceId:
                "research.eye.english-eye.orthography.v0_1",

              authority:
                "source_orthography",

              ruleId:
                null,

              evidenceRefs: [],
            },

            attestationTruth:
              "fact",

            sourceStatus:
              "research_candidate",

            citations: [
              {
                citationId:
                  "research.eye.english.oxford-eye.v0_1",

                sourceTitle:
                  "Oxford Advanced Learner's Dictionary — eye noun",

                sourceAuthorOrEditor:
                  null,

                sourcePublisherOrHost:
                  "Oxford University Press",

                sourceDateOrVersion:
                  "accessed 2026-08-30",

                sourceUrlOrArchiveRef:
                  "https://www.oxfordlearnersdictionaries.com/us/definition/english/eye_1",

                entryLocator:
                  "eye noun; part of body; sense 1",

                sourceHashOrArchiveHash:
                  null,

                attestedForm:
                  "EYE",

                attestedGloss:
                  "eye",
              },
            ],

            claimBoundary,
          },

          {
            recurrenceEvidenceId:
              "research.eye.albanian-standard-sy.v0_1",

            evidenceRole:
              "cohort_member",

            languageId:
              "Albanian",

            languageVariety:
              "Standard",

            surfaceForm:
              "SY",

            comparisonForm:
              "SY",

            comparisonMode:
              "orthography",

            comparisonAuthority:
              "source_orthography",

            comparisonProvenance: {
              provenanceId:
                "research.eye.albanian-standard-sy.orthography.v0_1",

              authority:
                "source_orthography",

              ruleId:
                null,

              evidenceRefs: [],
            },

            attestationTruth:
              "fact",

            sourceStatus:
              "research_candidate",

            citations: [
              {
                citationId:
                  "research.eye.albanian-standard.iecor-211.v0_1",

                sourceTitle:
                  "IE-CoR Cognate Set 211 — eye",

                sourceAuthorOrEditor:
                  "Matthew Scarborough et al.",

                sourcePublisherOrHost:
                  "IE-CoR",

                sourceDateOrVersion:
                  "accessed 2026-08-30",

                sourceUrlOrArchiveRef:
                  "https://iecor.clld.org/cognatesets/211",

                entryLocator:
                  "Albanian: Standard; lexeme sy; meaning eye",

                sourceHashOrArchiveHash:
                  null,

                attestedForm:
                  "SY",

                attestedGloss:
                  "eye",
              },
            ],

            claimBoundary,
          },
        ],
      },
    },
  ] as const satisfies
    readonly SevenVoiceFunctionalRecurrenceResearchCohortCatalogEntryV0_1[];
