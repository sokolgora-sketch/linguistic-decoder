import {
  analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1,
} from "./sevenVoiceFunctionalRecurrenceCohortEvidence.v0_1";

import {
  sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1,
  type SevenVoiceFunctionalRecurrenceResearchCohortCatalogEntryV0_1,
} from "@/data/sevenVoiceFunctionalRecurrenceResearchCohorts.v0_1";

export const
SEVEN_VOICE_FUNCTIONAL_RECURRENCE_RESEARCH_SURFACE_SCHEMA_V0_1 =
  "open-instrument.seven-voice-functional-recurrence-research-surface.v0_1" as const;

export type SevenVoiceFunctionalRecurrenceResearchObservationV0_1 =
  Readonly<{
    recurrenceEvidenceId: string;
    evidenceRole:
      "cohort_member" | "negative_control";
    languageId: string;
    languageVariety:
      string | null;
    surfaceForm: string;
    comparisonForm: string;
    comparisonMode:
      | "orthography"
      | "transliteration"
      | "z_zero_functional_normalization";
    comparisonAuthority: string;
    voicePath:
      readonly string[];
    sourceStatus:
      "research_candidate" | "reviewed_candidate";
    citations:
      readonly Readonly<{
        citationId: string;
        sourceTitle: string;
        sourceAuthorOrEditor:
          string | null;
        sourcePublisherOrHost: string;
        sourceDateOrVersion: string;
        sourceUrlOrArchiveRef: string;
        entryLocator: string;
        sourceHashOrArchiveHash:
          string | null;
        attestedForm: string;
        attestedGloss: string;
      }>[];
  }>;

export type SevenVoiceFunctionalRecurrenceResearchAvailableV0_1 =
  Readonly<{
    schemaVersion:
      typeof SEVEN_VOICE_FUNCTIONAL_RECURRENCE_RESEARCH_SURFACE_SCHEMA_V0_1;
    status:
      "available";
    conceptId: string;
    cohortId: string;
    sharedCanonicalVoices:
      readonly string[];
    sharedFunctionalNucleus:
      readonly string[];
    observations:
      readonly SevenVoiceFunctionalRecurrenceResearchObservationV0_1[];
    truth:
      Readonly<{
        recurrenceObservationTruth:
          "fact_within_declared_comparison_forms";
        functionalVoiceMeaningTruth:
          "research_hypothesis";
      }>;
    claimBoundary:
      unknown;
  }>;

export type SevenVoiceFunctionalRecurrenceResearchRejectedV0_1 =
  Readonly<{
    schemaVersion:
      typeof SEVEN_VOICE_FUNCTIONAL_RECURRENCE_RESEARCH_SURFACE_SCHEMA_V0_1;
    status:
      "rejected";
    conceptId: string;
    cohortId: string;
    reasonCodes:
      readonly string[];
  }>;

export type SevenVoiceFunctionalRecurrenceResearchSurfaceV0_1 =
  | SevenVoiceFunctionalRecurrenceResearchAvailableV0_1
  | SevenVoiceFunctionalRecurrenceResearchRejectedV0_1;

function normalizeConceptIdV0_1(
  value: unknown,
): string {
  return String(
    value ?? "",
  )
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase(
      "en-US",
    );
}

export function
resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
  concept: unknown,
):
  SevenVoiceFunctionalRecurrenceResearchCohortCatalogEntryV0_1 | null {
  const normalized =
    normalizeConceptIdV0_1(
      concept,
    );

  if (!normalized) {
    return null;
  }

  for (
    const entry
    of sevenVoiceFunctionalRecurrenceResearchCohortCatalogV0_1
  ) {
    const identities = [
      entry.conceptId,
      ...entry.aliases,
    ].map(
      normalizeConceptIdV0_1,
    );

    if (
      identities.includes(
        normalized,
      )
    ) {
      return entry;
    }
  }

  return null;
}

export function
buildSevenVoiceFunctionalRecurrenceResearchSurfaceV0_1(
  concept: unknown,
):
  SevenVoiceFunctionalRecurrenceResearchSurfaceV0_1 | null {
  const entry =
    resolveSevenVoiceFunctionalRecurrenceResearchCohortV0_1(
      concept,
    );

  if (!entry) {
    return null;
  }

  const analysis =
    analyzeSevenVoiceFunctionalRecurrenceFromCohortEvidenceV0_1(
      entry.cohort,
    );

  if (
    analysis.status ===
      "rejected"
  ) {
    return {
      schemaVersion:
        SEVEN_VOICE_FUNCTIONAL_RECURRENCE_RESEARCH_SURFACE_SCHEMA_V0_1,
      status:
        "rejected",
      conceptId:
        entry.cohort.conceptId,
      cohortId:
        entry.cohort.cohortId,
      reasonCodes:
        [
          ...analysis
            .admission
            .reasonCodes,
        ],
    };
  }

  const recurrence:
    any =
    analysis.recurrence;

  const recurrenceObservations:
    any[] =
    Array.isArray(
      recurrence
        ?.observations,
    )
      ? recurrence
          .observations
      : [];

  return {
    schemaVersion:
      SEVEN_VOICE_FUNCTIONAL_RECURRENCE_RESEARCH_SURFACE_SCHEMA_V0_1,

    status:
      "available",

    conceptId:
      entry.cohort
        .conceptId,

    cohortId:
      entry.cohort
        .cohortId,

    sharedCanonicalVoices:
      Array.isArray(
        recurrence
          ?.sharedCanonicalVoices,
      )
        ? [
            ...recurrence
              .sharedCanonicalVoices,
          ]
        : [],

    sharedFunctionalNucleus:
      Array.isArray(
        recurrence
          ?.sharedFunctionalNucleus,
      )
        ? [
            ...recurrence
              .sharedFunctionalNucleus,
          ]
        : [],

    observations:
      entry.cohort
        .observations
        .map(
          (
            row,
            index,
          ) => ({
            recurrenceEvidenceId:
              row.recurrenceEvidenceId,

            evidenceRole:
              row.evidenceRole,

            languageId:
              row.languageId,

            languageVariety:
              row.languageVariety,

            surfaceForm:
              row.surfaceForm,

            comparisonForm:
              row.comparisonForm,

            comparisonMode:
              row.comparisonMode,

            comparisonAuthority:
              row.comparisonAuthority,

            voicePath:
              Array.isArray(
                recurrenceObservations[
                  index
                ]?.voicePath,
              )
                ? [
                    ...recurrenceObservations[
                      index
                    ].voicePath,
                  ]
                : [],

            sourceStatus:
              row.sourceStatus,

            citations:
              row.citations.map(
                (
                  citation,
                ) => ({
                  ...citation,
                }),
              ),
          }),
        ),

    truth: {
      recurrenceObservationTruth:
        "fact_within_declared_comparison_forms",

      functionalVoiceMeaningTruth:
        "research_hypothesis",
    },

    claimBoundary:
      recurrence
        ?.claimBoundary ??
      null,
  };
}
