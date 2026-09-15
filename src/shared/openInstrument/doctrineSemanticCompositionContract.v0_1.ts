import type {
  StructuralHypothesisReasonCodeV0_1,
  StructuralHypothesisV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  extractSevenVowelsFromString,
  isSevenVowel,
} from "@/shared/math7.core";
import { STRUCTURAL_HYPOTHESIS_VERSION_V0_1 } from "@/shared/structuralHypothesisDiscovery.v0_1";
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

const AUTHORIZED_REDUCTION_OPERATION_IDS_V0_1 = new Set<string>([
  "peel_right_vowel_led_expansion",
  "peel_right_consonant_led_expansion",
  "peel_left_consonant_frame",
]);

const REDUCTION_REASON_CODES_V0_1 = new Set<string>([
  "structural_reduction_applied",
  "right_edge_vowel_led_expansion",
  "right_edge_consonant_led_expansion",
  "left_consonant_frame_preserved",
  "structural_containment_preserved",
  "deterministic_operation_authorized",
  "voice_path_recorded",
]);

const HYPOTHESIS_REASON_CODES_V0_1 = new Set<string>([
  "structural_reduction_applied",
  "structural_containment_preserved",
  "deterministic_operation_authorized",
  "terminal_structural_hypothesis_reached",
  "minimum_defensible_embryo_reached",
  "insufficient_structural_support",
  "voice_path_recorded",
  "independent_meaning_unknown",
  "lexical_attestation_not_required_for_discovery",
  "historical_origin_not_claimed",
  "candidate_truth_not_claimed",
  "production_promotion_not_claimed",
]);

const REQUIRED_HYPOTHESIS_REASON_CODES_V0_1: readonly StructuralHypothesisReasonCodeV0_1[] = [
  "structural_reduction_applied",
  "structural_containment_preserved",
  "deterministic_operation_authorized",
  "terminal_structural_hypothesis_reached",
  "voice_path_recorded",
  "independent_meaning_unknown",
  "lexical_attestation_not_required_for_discovery",
  "historical_origin_not_claimed",
  "candidate_truth_not_claimed",
  "production_promotion_not_claimed",
];

function canonicalKeyV0_1(value: unknown): string {
  return textV0_1(value).toLocaleUpperCase("en-US");
}

function stringArrayV0_1(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((entry) => typeof entry === "string")
  );
}

function canonicalVoicePathV0_1(
  value: unknown,
): value is string[] {
  return (
    stringArrayV0_1(value) &&
    value.every((voice) => isSevenVowel(voice))
  );
}

function sameStringArrayV0_1(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function canonicalPathMatchesFormV0_1(
  value: unknown,
  form: string,
  allowEmpty: boolean,
): value is string[] {
  return (
    canonicalVoicePathV0_1(value) &&
    (allowEmpty || value.length > 0) &&
    sameStringArrayV0_1(value, extractSevenVowelsFromString(form))
  );
}

function requiredReasonCodesPresentV0_1(
  actual: readonly string[],
  required: readonly string[],
): boolean {
  return required.every((reasonCode) => actual.includes(reasonCode));
}

function reductionStepValidV0_1(
  value: unknown,
  previousForm: string,
): value is RecordV0_1 {
  if (!isRecordV0_1(value)) return false;

  const from = textV0_1(value.from);
  const to = textV0_1(value.to);
  const operationId = textV0_1(value.operationId);
  const reasonCodes = value.reasonCodes;
  const fromSpan = value.fromSpan;
  const removedOrChanged = textV0_1(value.removedOrChanged);

  if (
    !from ||
    !to ||
    !AUTHORIZED_REDUCTION_OPERATION_IDS_V0_1.has(operationId) ||
    !stringArrayV0_1(reasonCodes) ||
    reasonCodes.length === 0 ||
    !reasonCodes.every((reasonCode) =>
      REDUCTION_REASON_CODES_V0_1.has(reasonCode),
    ) ||
    !requiredReasonCodesPresentV0_1(
      reasonCodes,
      [
        "structural_reduction_applied",
        "structural_containment_preserved",
        "deterministic_operation_authorized",
        "voice_path_recorded",
      ],
    ) ||
    !removedOrChanged ||
    !isRecordV0_1(fromSpan) ||
    !Number.isInteger(fromSpan.start) ||
    !Number.isInteger(fromSpan.end)
  ) {
    return false;
  }

  const chars = Array.from(from.normalize("NFC"));
  const start = Number(fromSpan.start);
  const end = Number(fromSpan.end);
  const expectedTo = chars.slice(0, start).concat(chars.slice(end)).join("");

  const validSpan = start >= 0 && end > start && end <= chars.length;
  const operationSpanValid =
    operationId === "peel_left_consonant_frame"
      ? start === 0 && end === 1
      : end === chars.length && end - start >= 2 && end - start <= 3;
  const removedValueMatches =
    canonicalKeyV0_1(chars.slice(start, end).join("")) ===
    canonicalKeyV0_1(removedOrChanged);
  const sequenceMatches = canonicalKeyV0_1(from) === canonicalKeyV0_1(previousForm);
  const beforePathValid = canonicalPathMatchesFormV0_1(
    value.voicePathBefore,
    from,
    false,
  );
  const afterPathValid = canonicalPathMatchesFormV0_1(
    value.voicePathAfter,
    to,
    false,
  );

  const operationReasonCode =
    operationId === "peel_left_consonant_frame"
      ? "left_consonant_frame_preserved"
      : operationId === "peel_right_vowel_led_expansion"
        ? "right_edge_vowel_led_expansion"
        : "right_edge_consonant_led_expansion";

  return (
    validSpan &&
    operationSpanValid &&
    removedValueMatches &&
    sequenceMatches &&
    expectedTo.length > 0 &&
    canonicalKeyV0_1(expectedTo) === canonicalKeyV0_1(to) &&
    reasonCodes.includes(operationReasonCode) &&
    beforePathValid &&
    afterPathValid
  );
}

function structuralHypothesisValidV0_1(
  value: unknown,
): value is StructuralHypothesisV0_1 {
  if (!isRecordV0_1(value)) return false;

  const reductionSteps = value.reductionSteps;
  const expansionChain = value.expansionChain;
  const reasonCodes = value.reasonCodes;
  const evidenceRefs = value.evidenceRefs;

  if (!(
    value.hypothesisVersion === STRUCTURAL_HYPOTHESIS_VERSION_V0_1 &&
    textV0_1(value.basis).length > 0 &&
    value.discoveryStatus === "structural_hypothesis" &&
    textV0_1(value.hypothesisId).length > 0 &&
    textV0_1(value.embryo).length > 0 &&
    Number.isInteger(value.embryoSize) &&
    Number(value.embryoSize) > 0 &&
    Number(value.embryoSize) === Array.from(textV0_1(value.embryo)).length &&
    value.independentStandaloneMeaning === null &&
    value.lexicalAttestation === "not_evaluated" &&
    value.functionalSupportStatus === "unknown" &&
    value.historicalOriginClaim === "not_claimed" &&
    value.historicalTransmissionClaim === "not_claimed" &&
    value.winnerClaim === "not_claimed" &&
    value.languageSuperiorityClaim === "not_claimed" &&
    value.candidateTruthClaim === "not_claimed" &&
    value.userDecisionPosture === "user_decides"
  )) {
    return false;
  }

  if (
    !Array.isArray(reductionSteps) ||
    !Array.isArray(expansionChain) ||
    expansionChain.length < 2 ||
    !stringArrayV0_1(expansionChain) ||
    !stringArrayV0_1(reasonCodes) ||
    reasonCodes.length === 0 ||
    !reasonCodes.every((reasonCode) =>
      HYPOTHESIS_REASON_CODES_V0_1.has(reasonCode),
    ) ||
    !requiredReasonCodesPresentV0_1(
      reasonCodes,
      REQUIRED_HYPOTHESIS_REASON_CODES_V0_1,
    ) ||
    !stringArrayV0_1(evidenceRefs) ||
    !evidenceRefs.every((ref) => textV0_1(ref).length > 0) ||
    !expansionChain.every((entry) => textV0_1(entry).length > 0)
  ) {
    return false;
  }

  if (reductionSteps.length === 0) return true;

  if (
    !reductionSteps.every((step, index, steps) =>
      reductionStepValidV0_1(
        step,
        index === 0
          ? textV0_1(value.basis)
          : textV0_1(steps[index - 1]?.to),
      ),
    ) ||
    expansionChain.length !== reductionSteps.length + 1 ||
    canonicalKeyV0_1(reductionSteps[0]?.from) !==
      canonicalKeyV0_1(value.basis) ||
    canonicalKeyV0_1(reductionSteps[reductionSteps.length - 1]?.to) !==
      canonicalKeyV0_1(value.embryo)
  ) {
    return false;
  }

  return expansionChain.every((entry, index) =>
    index < reductionSteps.length
      ? canonicalKeyV0_1(entry) ===
        canonicalKeyV0_1(reductionSteps[reductionSteps.length - 1 - index]?.to)
      : canonicalKeyV0_1(entry) === canonicalKeyV0_1(value.basis),
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
