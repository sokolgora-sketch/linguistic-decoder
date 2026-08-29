import {
  symbolicMathOrder,
} from "@/shared/sevenVoiceOrderedViews.v0.1";

import type {
  SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";

import {
  extractOrthographyVoicesFromWordV0_1,
} from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

export const SEVEN_VOICE_FUNCTIONAL_RECURRENCE_SCHEMA_V0_1 =
  "open-instrument.seven-voice-functional-recurrence.v0_1" as const;

export type SevenVoiceFunctionalRecurrenceComparisonModeV0_1 =
  | "orthography"
  | "transliteration"
  | "z_zero_functional_normalization";

export type SevenVoiceFunctionalRecurrenceFormV0_1 =
  Readonly<{
    languageId: string;

    /**
     * Original lexical surface retained for audit.
     *
     * This value is never silently rewritten by this layer.
     */
    surfaceForm: string;

    /**
     * Explicit comparison form supplied by the caller.
     *
     * Examples:
     *
     * WATER surface + UOTER functional comparison form
     * UJË surface + UJË orthographic comparison form
     * 水 surface/transliterated presentation + SHUI comparison form
     *
     * This layer does not invent this value.
     */
    comparisonForm: string;

    /**
     * Declares how comparisonForm was obtained.
     *
     * Modes are deliberately explicit so orthography,
     * transliteration, and ZË-RO functional normalization
     * cannot be silently conflated.
     */
    comparisonMode:
      SevenVoiceFunctionalRecurrenceComparisonModeV0_1;

    /**
     * Audit/provenance label for the declared comparison form.
     *
     * v0.1 stores the authority exactly as supplied.
     * It does not infer evidence strength from the label.
     */
    comparisonAuthority: string;
  }>;

export type SevenVoiceFunctionalRecurrenceObservationV0_1 =
  Readonly<{
    languageId: string;
    surfaceForm: string;
    comparisonForm: string;
    comparisonMode:
      SevenVoiceFunctionalRecurrenceComparisonModeV0_1;
    comparisonAuthority: string;
    voicePath: SevenVoiceKey[];
  }>;

export type SevenVoiceFunctionalRecurrenceClaimBoundaryV0_1 =
  Readonly<{
    recurrenceObservationTruth:
      "fact_within_declared_comparison_forms";
    functionalVoiceMeaningTruth:
      "research_hypothesis";
    phoneticIdentityClaim:
      "not_claimed";
    historicalOriginClaim:
      "not_claimed";
    historicalTransmissionClaim:
      "not_claimed";
    cognacyClaim:
      "not_claimed";
    borrowingClaim:
      "not_claimed";
    winnerClaim:
      "not_claimed";
    candidateTruthClaim:
      "not_claimed";
    universalityClaim:
      "not_claimed";
    userDecisionPosture:
      "user_decides";
  }>;

export type SevenVoiceFunctionalRecurrenceResultV0_1 =
  Readonly<{
    schemaVersion:
      typeof SEVEN_VOICE_FUNCTIONAL_RECURRENCE_SCHEMA_V0_1;

    conceptId: string;

    observations:
      SevenVoiceFunctionalRecurrenceObservationV0_1[];

    /**
     * Set intersection of canonical voices present in every
     * declared comparison form.
     *
     * Ordering follows the canonical symbolic Seven-Voice SSOT:
     *
     * A E I O U Y Ë
     */
    sharedCanonicalVoices:
      SevenVoiceKey[];

    /**
     * v0.1 intentionally equals sharedCanonicalVoices.
     *
     * "Functional nucleus" is the project interpretation of
     * the deterministic recurrence observation. It does not
     * assign an independent lexical meaning to the voice.
     */
    sharedFunctionalNucleus:
      SevenVoiceKey[];

    claimBoundary:
      SevenVoiceFunctionalRecurrenceClaimBoundaryV0_1;
  }>;

function normalizeAuditTextV0_1(
  value: unknown,
): string {
  return String(value ?? "")
    .normalize("NFC")
    .trim();
}

function extractDeclaredComparisonVoicePathV0_1(
  comparisonForm: string,
): SevenVoiceKey[] {
  const extracted =
    extractOrthographyVoicesFromWordV0_1({
      word:
        comparisonForm,
    });

  return extracted.voices.map(
    (voice) =>
      voice as SevenVoiceKey,
  );
}

function sharedCanonicalVoicesV0_1(
  observations:
    readonly SevenVoiceFunctionalRecurrenceObservationV0_1[],
): SevenVoiceKey[] {
  if (
    observations.length === 0
  ) {
    return [];
  }

  const voiceSets =
    observations.map(
      (observation) =>
        new Set<SevenVoiceKey>(
          observation.voicePath,
        ),
    );

  return symbolicMathOrder.filter(
    (voice) =>
      voiceSets.every(
        (voiceSet) =>
          voiceSet.has(
            voice,
          ),
      ),
  );
}

const CLAIM_BOUNDARY_V0_1:
  SevenVoiceFunctionalRecurrenceClaimBoundaryV0_1 =
    Object.freeze({
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

export function analyzeSevenVoiceFunctionalRecurrenceV0_1(
  input: Readonly<{
    conceptId: string;

    forms:
      readonly SevenVoiceFunctionalRecurrenceFormV0_1[];
  }>,
): SevenVoiceFunctionalRecurrenceResultV0_1 {
  const conceptId =
    normalizeAuditTextV0_1(
      input.conceptId,
    );

  const observations:
    SevenVoiceFunctionalRecurrenceObservationV0_1[] =
      input.forms.map(
        (form) => {
          const surfaceForm =
            normalizeAuditTextV0_1(
              form.surfaceForm,
            );

          const comparisonForm =
            normalizeAuditTextV0_1(
              form.comparisonForm,
            );

          return {
            languageId:
              normalizeAuditTextV0_1(
                form.languageId,
              ),

            surfaceForm,

            comparisonForm,

            comparisonMode:
              form.comparisonMode,

            comparisonAuthority:
              normalizeAuditTextV0_1(
                form.comparisonAuthority,
              ),

            voicePath:
              extractDeclaredComparisonVoicePathV0_1(
                comparisonForm,
              ),
          };
        },
      );

  const sharedCanonicalVoices =
    sharedCanonicalVoicesV0_1(
      observations,
    );

  return {
    schemaVersion:
      SEVEN_VOICE_FUNCTIONAL_RECURRENCE_SCHEMA_V0_1,

    conceptId,

    observations,

    sharedCanonicalVoices:
      [...sharedCanonicalVoices],

    sharedFunctionalNucleus:
      [...sharedCanonicalVoices],

    claimBoundary:
      CLAIM_BOUNDARY_V0_1,
  };
}
