import fs from "node:fs";

import {
  SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,
  admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1,
  analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1,
} from "@/shared/openInstrument/sevenVoiceFunctionalRecurrenceCohortEvidence.v0_1";

function claimBoundary() {
  return {
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
  };
}

function citation(
  id: string,
  attestedForm: string,
  attestedGloss: string,
) {
  return {
    citationId:
      id,

    sourceTitle:
      `Fixture source ${id}`,

    sourceAuthorOrEditor:
      null,

    sourcePublisherOrHost:
      "Fixture Research Source",

    sourceDateOrVersion:
      "fixture-v0.1",

    sourceUrlOrArchiveRef:
      `fixture://${id}`,

    entryLocator:
      `entry:${attestedForm}`,

    sourceHashOrArchiveHash:
      null,

    attestedForm,
    attestedGloss,
  };
}

function waterCohort() {
  return {
    schemaVersion:
      SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_SCHEMA_V0_1,

    cohortId:
      "fixture.recurrence.water.v0_1",

    conceptId:
      "WATER",

    observations: [
      {
        recurrenceEvidenceId:
          "fixture.water.english.v0_1",

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
            "fixture.water.uoter.provenance.v0_1",

          authority:
            "z_zero_project_doctrine",

          ruleId:
            "fixture.water_to_uoter.v0_1",

          evidenceRefs: [
            "fixture.project-doctrine.water-u.v0_1",
          ],
        },

        attestationTruth:
          "fact",

        sourceStatus:
          "research_candidate",

        citations: [
          citation(
            "fixture.water.english.citation.v0_1",
            "WATER",
            "water",
          ),
        ],

        claimBoundary:
          claimBoundary(),
      },

      {
        recurrenceEvidenceId:
          "fixture.water.albanian-uje.v0_1",

        evidenceRole:
          "cohort_member",

        languageId:
          "Albanian",

        languageVariety:
          null,

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
            "fixture.albanian-uje.orthography.v0_1",

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
          citation(
            "fixture.water.albanian-uje.citation.v0_1",
            "UJË",
            "water",
          ),
        ],

        claimBoundary:
          claimBoundary(),
      },

      {
        recurrenceEvidenceId:
          "fixture.water.gheg-uj.v0_1",

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
            "fixture.gheg-uj.orthography.v0_1",

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
          citation(
            "fixture.water.gheg-uj.citation.v0_1",
            "UJ",
            "water",
          ),
        ],

        claimBoundary:
          claimBoundary(),
      },

      {
        recurrenceEvidenceId:
          "fixture.water.mandarin-shui.v0_1",

        evidenceRole:
          "cohort_member",

        languageId:
          "Mandarin Chinese",

        languageVariety:
          null,

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
            "fixture.mandarin-shui.transliteration.v0_1",

          authority:
            "hanyu_pinyin",

          ruleId:
            "fixture.hanyu-pinyin-tone-stripped.v0_1",

          evidenceRefs: [],
        },

        attestationTruth:
          "fact",

        sourceStatus:
          "research_candidate",

        citations: [
          citation(
            "fixture.water.mandarin-shui.citation.v0_1",
            "shuǐ",
            "water",
          ),
        ],

        claimBoundary:
          claimBoundary(),
      },
    ],
  };
}

describe(
  "Open Instrument Seven-Voice Functional Recurrence cohort evidence contract v0.1",
  () => {
    it(
      "admits a source-traceable WATER cohort and feeds only validated forms into the existing recurrence engine",
      () => {
        const result =
          analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1(
            waterCohort(),
          );

        expect(
          result.status,
        ).toBe(
          "accepted",
        );

        if (
          result.status !==
          "accepted"
        ) {
          throw new Error(
            "expected accepted cohort",
          );
        }

        expect(
          result.admission.reasonCodes,
        ).toEqual(
          [],
        );

        expect(
          result.admission.observations,
        ).toHaveLength(
          4,
        );

        expect(
          result.admission.evidenceRefs,
        ).toEqual(
          expect.arrayContaining([
            "fixture.water.english.citation.v0_1",
            "fixture.water.albanian-uje.citation.v0_1",
            "fixture.water.gheg-uj.citation.v0_1",
            "fixture.water.mandarin-shui.citation.v0_1",
            "fixture.project-doctrine.water-u.v0_1",
          ]),
        );

        expect(
          result.recurrence.sharedFunctionalNucleus,
        ).toEqual([
          "U",
        ]);

        expect(
          result.recurrence.observations.map(
            (observation) =>
              observation.comparisonForm,
          ),
        ).toEqual([
          "UOTER",
          "UJË",
          "UJ",
          "SHUI",
        ]);
      },
    );

    it(
      "preserves a valid negative control rather than filtering it to manufacture recurrence",
      () => {
        const input =
          waterCohort();

        input.cohortId =
          "fixture.recurrence.water-negative-control.v0_1";

        input.observations =
          [
            {
              recurrenceEvidenceId:
                "fixture.water.raw-orthography-control.v0_1",

              evidenceRole:
                "negative_control",

              languageId:
                "English",

              languageVariety:
                null,

              surfaceForm:
                "WATER",

              comparisonForm:
                "WATER",

              comparisonMode:
                "orthography",

              comparisonAuthority:
                "source_orthography",

              comparisonProvenance: {
                provenanceId:
                  "fixture.water.raw-orthography.v0_1",

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
                citation(
                  "fixture.water.raw-control.citation.v0_1",
                  "WATER",
                  "water",
                ),
              ],

              claimBoundary:
                claimBoundary(),
            },

            input.observations[1],
          ];

        const result =
          analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1(
            input,
          );

        expect(
          result.status,
        ).toBe(
          "accepted",
        );

        if (
          result.status !==
          "accepted"
        ) {
          throw new Error(
            "expected accepted control cohort",
          );
        }

        expect(
          result.admission.observations[0]
            .evidenceRole,
        ).toBe(
          "negative_control",
        );

        expect(
          result.recurrence.sharedFunctionalNucleus,
        ).toEqual(
          [],
        );
      },
    );

    it(
      "fails the complete cohort closed when citation provenance is malformed",
      () => {
        const input =
          waterCohort();

        input.observations[0]
          .citations[0]
          .sourceTitle =
            "   ";

        const admission =
          admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1(
            input,
          );

        expect(
          admission.status,
        ).toBe(
          "rejected",
        );

        expect(
          admission.reasonCodes,
        ).toContain(
          "invalid_citation",
        );

        expect(
          admission.observations,
        ).toEqual(
          [],
        );

        expect(
          admission.recurrenceForms,
        ).toEqual(
          [],
        );
      },
    );

    it(
      "requires explicit rule provenance for ZË-RO functional normalization",
      () => {
        const input =
          waterCohort();

        input.observations[0]
          .comparisonProvenance
          .ruleId =
            null;

        const admission =
          admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1(
            input,
          );

        expect(
          admission.status,
        ).toBe(
          "rejected",
        );

        expect(
          admission.reasonCodes,
        ).toContain(
          "missing_functional_normalization_rule",
        );

        expect(
          admission.recurrenceForms,
        ).toEqual(
          [],
        );
      },
    );

    it(
      "requires explicit transliteration provenance rather than silently treating transliteration as orthography",
      () => {
        const input =
          waterCohort();

        input.observations[3]
          .comparisonProvenance
          .ruleId =
            null;

        const admission =
          admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1(
            input,
          );

        expect(
          admission.status,
        ).toBe(
          "rejected",
        );

        expect(
          admission.reasonCodes,
        ).toContain(
          "missing_transliteration_rule",
        );
      },
    );

    it(
      "requires the lexical surface itself to be source-attested",
      () => {
        const input =
          waterCohort();

        input.observations[1]
          .citations[0]
          .attestedForm =
            "NOT-UJË";

        const admission =
          admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1(
            input,
          );

        expect(
          admission.status,
        ).toBe(
          "rejected",
        );

        expect(
          admission.reasonCodes,
        ).toContain(
          "surface_form_not_source_attested",
        );
      },
    );

    it(
      "rejects hypothesis-only source attestation and duplicate evidence ids",
      () => {
        const hypothesisInput =
          waterCohort();

        hypothesisInput.observations[0]
          .attestationTruth =
            "hypothesis";

        const hypothesisAdmission =
          admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1(
            hypothesisInput,
          );

        expect(
          hypothesisAdmission.status,
        ).toBe(
          "rejected",
        );

        expect(
          hypothesisAdmission.reasonCodes,
        ).toContain(
          "invalid_attestation_truth",
        );

        const duplicateInput =
          waterCohort();

        duplicateInput.observations[1]
          .recurrenceEvidenceId =
            duplicateInput
              .observations[0]
              .recurrenceEvidenceId;

        const duplicateAdmission =
          admitSevenVoiceFunctionalRecurrenceCohortEvidenceV0_1(
            duplicateInput,
          );

        expect(
          duplicateAdmission.status,
        ).toBe(
          "rejected",
        );

        expect(
          duplicateAdmission.reasonCodes,
        ).toContain(
          "duplicate_recurrence_evidence_id",
        );
      },
    );

    it(
      "rejects any attempt to promote recurrence evidence into origin, winner, candidate, or universal truth",
      () => {
        const input =
          waterCohort();

        input.observations[0]
          .claimBoundary
          .winnerClaim =
            "claimed";

        const result =
          analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1(
            input,
          );

        expect(
          result.status,
        ).toBe(
          "rejected",
        );

        expect(
          result.admission.reasonCodes,
        ).toContain(
          "claim_boundary_violation",
        );

        expect(
          result.recurrence,
        ).toBeNull();
      },
    );

    it(
      "keeps the production admission implementation concept-independent with no proving-word shortcuts",
      () => {
        const source =
          fs.readFileSync(
            "src/shared/openInstrument/sevenVoiceFunctionalRecurrenceCohortEvidence.v0_1.ts",
            "utf8",
          );

        for (
          const forbidden
          of [
            "WATER",
            "UOTER",
            "UJË",
            "SHUI",
            "EYE",
            "SY",
          ]
        ) {
          expect(
            source,
          ).not.toContain(
            forbidden,
          );
        }
      },
    );
  },
);
