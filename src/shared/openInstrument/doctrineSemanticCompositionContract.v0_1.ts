import type {
  StructuralHypothesisV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  DOCTRINE_PROJECTION_SCHEMA_V0_1,
  projectSevenVoiceDoctrineV0_1,
} from "@/shared/openInstrument/doctrineProjection.v0_1";
import {
  sevenVoiceOrderedViewsSchemaVersion,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";

export const DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1 =
  "open-instrument.doctrine-semantic-composition-contract.v0_1" as const;

export const DOCTRINE_SEMANTIC_COMPOSITION_STATUS_V0_1 = {
  supported: "INTERPRETATION_SUPPORTED",
  reject: "REJECT",
} as const;

export const DOCTRINE_SEMANTIC_COMPOSITION_MODE_V0_1 =
  "ORDERED_ROLES_ONLY" as const;

export const DOCTRINE_SEMANTIC_INTERPRETATION_LEVEL_V0_1 =
  "ordered_doctrine_roles" as const;

export const DOCTRINE_SEMANTIC_COMPOSITION_PROVENANCE_V0_1 = Object.freeze({
  doctrineAuthority: "src/shared/doctrine/voiceDoctrine.v0.1.ts",
  roleVocabularyAuthority: "src/shared/sevenPrinciples.v1.ts",
  doctrineProjectionSchema: DOCTRINE_PROJECTION_SCHEMA_V0_1,
  orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
});

export type DoctrineSemanticCompositionReasonCodeV0_1 =
  | "STRUCTURAL_HYPOTHESIS_REQUIRED"
  | "STRUCTURAL_HYPOTHESIS_INVALID"
  | "TERMINAL_REDUCTION_STEP_REQUIRED"
  | "TERMINAL_VOICE_PATH_REQUIRED"
  | "DOCTRINE_PROJECTION_REJECTED"
  | "DOCTRINE_AUTHORITY_UNSUPPORTED"
  | "UNSUPPORTED_VOICE"
  | "MALFORMED_TERMINAL_VOICE_PATH"
  | "TARGET_SENSE_INVALID";

export type DoctrineSemanticCompositionInputV0_1 = Readonly<{
  structuralHypothesis: StructuralHypothesisV0_1 | null | undefined;
  targetSense?: Readonly<{
    id: string;
    label: string;
    definition?: string | null;
  }> | null;
}>;

export type DoctrineSemanticCompositionSuccessV0_1 = Readonly<{
  schemaVersion:
    typeof DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1;
  status: typeof DOCTRINE_SEMANTIC_COMPOSITION_STATUS_V0_1.supported;
  structuralHypothesisId: string;
  embryo: string;
  doctrineAuthority: "src/shared/doctrine/voiceDoctrine.v0.1.ts";
  roleVocabularyAuthority: "src/shared/sevenPrinciples.v1.ts";
  compositionMode: typeof DOCTRINE_SEMANTIC_COMPOSITION_MODE_V0_1;
  terminalVoicePath: SevenVoiceKey[];
  orderedRoleProjection: readonly Readonly<{
    pathIndex: number;
    voice: SevenVoiceKey;
    doctrineRole: string;
  }>[];
  interpretationLevel: typeof DOCTRINE_SEMANTIC_INTERPRETATION_LEVEL_V0_1;
  truthClassification: Readonly<{
    registryMapping: "fact";
    structuralProjection: "inference";
    targetBoundRelation: "not_applicable" | "unknown";
  }>;
  targetSense?: Readonly<{
    id: string;
    label: string;
    definition?: string;
  }>;
  provenance: Readonly<{
    contractSchema: typeof DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1;
    doctrineProjectionSchema: typeof DOCTRINE_PROJECTION_SCHEMA_V0_1;
    orderedViewsSchema: typeof sevenVoiceOrderedViewsSchemaVersion;
    doctrineAuthority: "src/shared/doctrine/voiceDoctrine.v0.1.ts";
    roleVocabularyAuthority: "src/shared/sevenPrinciples.v1.ts";
    structuralHypothesisId: string;
    terminalVoicePath: SevenVoiceKey[];
    targetSenseId?: string;
  }>;
  claimBoundary: Readonly<{
    historicalOriginClaim: "not_claimed";
    historicalTransmissionClaim: "not_claimed";
    winnerClaim: "not_claimed";
    languageSuperiorityClaim: "not_claimed";
    candidateTruthClaim: "not_claimed";
    lexicalMeaningClaim: "not_claimed";
  }>;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
  reasonCodes: readonly [];
}>;

export type DoctrineSemanticCompositionFailureV0_1 = Readonly<{
  schemaVersion:
    typeof DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1;
  status: typeof DOCTRINE_SEMANTIC_COMPOSITION_STATUS_V0_1.reject;
  reasonCodes: readonly DoctrineSemanticCompositionReasonCodeV0_1[];
  failures: readonly Readonly<{
    code: DoctrineSemanticCompositionReasonCodeV0_1;
    field: string;
  }>[];
}>;

export type DoctrineSemanticCompositionResultV0_1 =
  | DoctrineSemanticCompositionSuccessV0_1
  | DoctrineSemanticCompositionFailureV0_1;

type RecordV0_1 = Record<string, unknown>;

function isRecordV0_1(value: unknown): value is RecordV0_1 {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function textV0_1(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFKC").trim() : "";
}

function failureV0_1(
  code: DoctrineSemanticCompositionReasonCodeV0_1,
  field: string,
): Readonly<{
  code: DoctrineSemanticCompositionReasonCodeV0_1;
  field: string;
}> {
  return { code, field };
}

function rejectedV0_1(
  failures: readonly Readonly<{
    code: DoctrineSemanticCompositionReasonCodeV0_1;
    field: string;
  }>[],
): DoctrineSemanticCompositionFailureV0_1 {
  return {
    schemaVersion: DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
    status: DOCTRINE_SEMANTIC_COMPOSITION_STATUS_V0_1.reject,
    reasonCodes: [...new Set(failures.map((failure) => failure.code))].sort(),
    failures: [...failures].sort((left, right) =>
      `${left.code}:${left.field}`.localeCompare(`${right.code}:${right.field}`),
    ),
  };
}

function normalizeTargetSenseV0_1(
  value: unknown,
):
  | Readonly<{
      id: string;
      label: string;
      definition?: string;
    }>
  | null
  | false {
  if (value == null) return null;
  if (!isRecordV0_1(value)) return false;

  const id = textV0_1(value.id);
  const label = textV0_1(value.label);
  if (!id || !label) return false;

  const definition = textV0_1(value.definition);
  return {
    id,
    label,
    ...(definition ? { definition } : {}),
  };
}

function structuralHypothesisValidV0_1(
  value: unknown,
): value is StructuralHypothesisV0_1 {
  if (!isRecordV0_1(value)) return false;

  return (
    value.hypothesisVersion === "z-zero.structural-hypothesis.v0_1" &&
    value.discoveryStatus === "structural_hypothesis" &&
    textV0_1(value.hypothesisId).length > 0 &&
    textV0_1(value.embryo).length > 0 &&
    Number.isInteger(value.embryoSize) &&
    Number(value.embryoSize) > 0 &&
    value.historicalOriginClaim === "not_claimed" &&
    value.historicalTransmissionClaim === "not_claimed" &&
    value.winnerClaim === "not_claimed" &&
    value.languageSuperiorityClaim === "not_claimed" &&
    value.candidateTruthClaim === "not_claimed" &&
    value.userDecisionPosture === "user_decides"
  );
}

function projectionFailureCodeV0_1(
  code: string,
): DoctrineSemanticCompositionReasonCodeV0_1 {
  if (code === "unsupported_voice") return "UNSUPPORTED_VOICE";
  if (code === "malformed_path_entry") return "MALFORMED_TERMINAL_VOICE_PATH";
  return "DOCTRINE_PROJECTION_REJECTED";
}

export function evaluateDoctrineSemanticCompositionContractV0_1(
  input: DoctrineSemanticCompositionInputV0_1,
): DoctrineSemanticCompositionResultV0_1 {
  if (input?.structuralHypothesis == null) {
    return rejectedV0_1([
      failureV0_1("STRUCTURAL_HYPOTHESIS_REQUIRED", "structuralHypothesis"),
    ]);
  }

  if (!structuralHypothesisValidV0_1(input.structuralHypothesis)) {
    return rejectedV0_1([
      failureV0_1("STRUCTURAL_HYPOTHESIS_INVALID", "structuralHypothesis"),
    ]);
  }

  const reductionSteps = input.structuralHypothesis.reductionSteps;
  if (!Array.isArray(reductionSteps) || reductionSteps.length === 0) {
    return rejectedV0_1([
      failureV0_1(
        "TERMINAL_REDUCTION_STEP_REQUIRED",
        "structuralHypothesis.reductionSteps",
      ),
    ]);
  }

  const terminalReductionStep = reductionSteps[reductionSteps.length - 1];
  if (!isRecordV0_1(terminalReductionStep)) {
    return rejectedV0_1([
      failureV0_1(
        "TERMINAL_REDUCTION_STEP_REQUIRED",
        "structuralHypothesis.reductionSteps",
      ),
    ]);
  }

  if (!Array.isArray(terminalReductionStep.voicePathAfter)) {
    return rejectedV0_1([
      failureV0_1(
        "TERMINAL_VOICE_PATH_REQUIRED",
        "structuralHypothesis.reductionSteps[].voicePathAfter",
      ),
    ]);
  }

  if (terminalReductionStep.voicePathAfter.length === 0) {
    return rejectedV0_1([
      failureV0_1(
        "TERMINAL_VOICE_PATH_REQUIRED",
        "structuralHypothesis.reductionSteps[].voicePathAfter",
      ),
    ]);
  }

  const targetSense = normalizeTargetSenseV0_1(input.targetSense);
  if (targetSense === false) {
    return rejectedV0_1([failureV0_1("TARGET_SENSE_INVALID", "targetSense")]);
  }

  const projection = projectSevenVoiceDoctrineV0_1(
    terminalReductionStep.voicePathAfter,
  );
  if (!projection.ok) {
    const projectionFailure = projection.reasonCodes.map((code) =>
      failureV0_1(projectionFailureCodeV0_1(code), "terminalVoicePath"),
    );
    return rejectedV0_1([
      failureV0_1("DOCTRINE_PROJECTION_REJECTED", "terminalVoicePath"),
      ...projectionFailure,
    ]);
  }

  if (
    projection.provenance.principleRegistry !==
    DOCTRINE_SEMANTIC_COMPOSITION_PROVENANCE_V0_1.roleVocabularyAuthority
  ) {
    return rejectedV0_1([
      failureV0_1(
        "DOCTRINE_AUTHORITY_UNSUPPORTED",
        "roleVocabularyAuthority",
      ),
    ]);
  }

  const terminalVoicePath = [...projection.inputPath];
  const structuralHypothesisId = textV0_1(
    input.structuralHypothesis.hypothesisId,
  );

  return {
    schemaVersion: DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
    status: DOCTRINE_SEMANTIC_COMPOSITION_STATUS_V0_1.supported,
    structuralHypothesisId,
    embryo: textV0_1(input.structuralHypothesis.embryo),
    doctrineAuthority:
      DOCTRINE_SEMANTIC_COMPOSITION_PROVENANCE_V0_1.doctrineAuthority,
    roleVocabularyAuthority:
      DOCTRINE_SEMANTIC_COMPOSITION_PROVENANCE_V0_1.roleVocabularyAuthority,
    compositionMode: DOCTRINE_SEMANTIC_COMPOSITION_MODE_V0_1,
    terminalVoicePath,
    orderedRoleProjection: projection.projections.map((entry) => ({
      pathIndex: entry.pathIndex,
      voice: entry.voice,
      doctrineRole: entry.doctrineRole,
    })),
    interpretationLevel: DOCTRINE_SEMANTIC_INTERPRETATION_LEVEL_V0_1,
    truthClassification: {
      registryMapping: "fact",
      structuralProjection: "inference",
      targetBoundRelation: targetSense ? "unknown" : "not_applicable",
    },
    ...(targetSense ? { targetSense } : {}),
    provenance: {
      contractSchema:
        DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
      doctrineProjectionSchema: DOCTRINE_PROJECTION_SCHEMA_V0_1,
      orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
      doctrineAuthority:
        DOCTRINE_SEMANTIC_COMPOSITION_PROVENANCE_V0_1.doctrineAuthority,
      roleVocabularyAuthority:
        DOCTRINE_SEMANTIC_COMPOSITION_PROVENANCE_V0_1.roleVocabularyAuthority,
      structuralHypothesisId,
      terminalVoicePath: [...terminalVoicePath],
      ...(targetSense ? { targetSenseId: targetSense.id } : {}),
    },
    claimBoundary: {
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      lexicalMeaningClaim: "not_claimed",
    },
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
    reasonCodes: [],
  };
}
