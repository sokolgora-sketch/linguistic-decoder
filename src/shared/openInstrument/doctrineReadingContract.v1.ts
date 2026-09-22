import {
  DOCTRINE_FUNCTIONAL_PROFILE_COMPLETENESS_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1,
  SEVEN_VOICE_DOCTRINE_PROFILES_V0_1,
  type DoctrineFunctionalProfileDatumV0_1,
  type DoctrineFunctionalProfileClaimBoundaryV0_1,
} from "@/shared/openInstrument/doctrineFunctionalProfile.v0_1";
import {
  DOCTRINE_PROJECTION_PROVENANCE_V0_1,
  DOCTRINE_PROJECTION_SCHEMA_V0_1,
  projectSevenVoiceDoctrineV0_1,
  type DoctrineProjectionFailureV0_1,
} from "@/shared/openInstrument/doctrineProjection.v0_1";
import {
  DOCTRINE_SEMANTIC_COMPOSITION_MODE_V0_1,
  type DoctrineSemanticCompositionSuccessV0_1,
} from "@/shared/openInstrument/doctrineSemanticCompositionContract.v0_1";
import {
  sevenVoiceOrderedViewsSchemaVersion,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";
import type { PrincipleRole } from "@/shared/sevenPrinciples.v1";

export const DOCTRINE_READING_CONTRACT_SCHEMA_V1 =
  "open-instrument.doctrine-reading.v1" as const;

export const DOCTRINE_READING_PATH_COMPOSITION_V1: DoctrineFunctionalProfileClaimBoundaryV0_1["pathComposition"] =
  "NOT_AUTHORIZED";

export const DOCTRINE_READING_COMPOSITION_MODE_V1 =
  DOCTRINE_SEMANTIC_COMPOSITION_MODE_V0_1;

export const DOCTRINE_READING_CLAIM_BOUNDARY_V1 = Object.freeze({
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  lexicalMeaningClaim: "not_claimed",
} satisfies DoctrineSemanticCompositionSuccessV0_1["claimBoundary"]);

export const DOCTRINE_READING_PROVENANCE_V1 = Object.freeze({
  doctrineProjectionSchema: DOCTRINE_PROJECTION_SCHEMA_V0_1,
  orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
  doctrineAuthority: DOCTRINE_PROJECTION_PROVENANCE_V0_1.doctrineRegistry,
  roleVocabularyAuthority:
    DOCTRINE_PROJECTION_PROVENANCE_V0_1.principleRegistry,
  functionalProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  functionalProfileAuthority:
    "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
} as const);

export type DoctrineReadingEntryV1 = Readonly<{
  pathIndex: number;
  voice: SevenVoiceKey;
  doctrineRole: PrincipleRole;
  functionalProperties: readonly DoctrineFunctionalProfileDatumV0_1[];
  profileSchemaVersion: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  profileEngineAuthority:
    typeof DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1;
  profileNormalizationStatus:
    typeof DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_STATUS_V0_1;
  profileCompleteness: typeof DOCTRINE_FUNCTIONAL_PROFILE_COMPLETENESS_V0_1;
  profileTruthClassification:
    typeof DOCTRINE_FUNCTIONAL_PROFILE_TRUTH_CLASSIFICATION_V0_1;
}>;

export type DoctrineReadingV1 = Readonly<{
  schemaVersion: typeof DOCTRINE_READING_CONTRACT_SCHEMA_V1;
  analyzedVoicePath: readonly SevenVoiceKey[];
  entries: readonly DoctrineReadingEntryV1[];
  compositionMode: typeof DOCTRINE_SEMANTIC_COMPOSITION_MODE_V0_1;
  pathComposition: typeof DOCTRINE_READING_PATH_COMPOSITION_V1;
  providerIndependent: true;
  externalEvidenceIndependent: true;
  candidateWinnerIndependent: true;
  claimBoundary: typeof DOCTRINE_READING_CLAIM_BOUNDARY_V1;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
  provenance: typeof DOCTRINE_READING_PROVENANCE_V1;
}>;

export type DoctrineReadingFailureReasonCodeV1 =
  DoctrineProjectionFailureV0_1["reasonCodes"][number];

export type DoctrineReadingProjectionSuccessV1 = Readonly<{
  ok: true;
  schemaVersion: typeof DOCTRINE_READING_CONTRACT_SCHEMA_V1;
  doctrineReading: DoctrineReadingV1 | null;
}>;

export type DoctrineReadingProjectionFailureV1 = Readonly<{
  ok: false;
  schemaVersion: typeof DOCTRINE_READING_CONTRACT_SCHEMA_V1;
  reasonCodes: readonly DoctrineReadingFailureReasonCodeV1[];
  invalidIndex?: number;
}>;

export type DoctrineReadingProjectionResultV1 =
  | DoctrineReadingProjectionSuccessV1
  | DoctrineReadingProjectionFailureV1;

export function projectDoctrineReadingV1(
  inputPath: unknown,
): DoctrineReadingProjectionResultV1 {
  if (inputPath === undefined || inputPath === null) {
    return {
      ok: true,
      schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
      doctrineReading: null,
    };
  }

  const projection = projectSevenVoiceDoctrineV0_1(inputPath);

  if (!projection.ok) {
    return {
      ok: false,
      schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
      reasonCodes: [...projection.reasonCodes],
      ...(projection.invalidIndex === undefined
        ? {}
        : { invalidIndex: projection.invalidIndex }),
    };
  }

  if (projection.emptyPath) {
    return {
      ok: true,
      schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
      doctrineReading: null,
    };
  }

  const entries = projection.projections.map((entry) => {
    const profile = SEVEN_VOICE_DOCTRINE_PROFILES_V0_1[entry.voice];

    return {
      pathIndex: entry.pathIndex,
      voice: entry.voice,
      doctrineRole: entry.doctrineRole,
      functionalProperties: profile.functionalProperties,
      profileSchemaVersion: profile.schemaVersion,
      profileEngineAuthority: profile.engineAuthority,
      profileNormalizationStatus: profile.normalizationStatus,
      profileCompleteness: profile.profileCompleteness,
      profileTruthClassification: profile.truthClassification,
    } satisfies DoctrineReadingEntryV1;
  });

  return {
    ok: true,
    schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
    doctrineReading: {
      schemaVersion: DOCTRINE_READING_CONTRACT_SCHEMA_V1,
      analyzedVoicePath: [...projection.inputPath],
      entries,
      compositionMode: DOCTRINE_SEMANTIC_COMPOSITION_MODE_V0_1,
      pathComposition: DOCTRINE_READING_PATH_COMPOSITION_V1,
      providerIndependent: true,
      externalEvidenceIndependent: true,
      candidateWinnerIndependent: true,
      claimBoundary: DOCTRINE_READING_CLAIM_BOUNDARY_V1,
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
      provenance: DOCTRINE_READING_PROVENANCE_V1,
    },
  };
}
