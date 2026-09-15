import { SEVEN_PRINCIPLES, type PrincipleRole } from "../sevenPrinciples.v1";
import {
  isSevenVoiceKey,
  type SevenVoiceKey,
} from "../sevenVoiceOrderedViews.v0.1";
import {
  getSevenVoiceDoctrineFunctionalProfileV0_1,
  validateSevenVoiceDoctrineFunctionalProfileV0_1,
  type SevenVoiceDoctrineFunctionalProfileV0_1,
  type SevenVoicesPrincipleAssociationV0_1,
} from "./doctrineFunctionalProfile.v0_1";

export const FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1 =
  "open-instrument.functional-role-comparative-evaluation.v0_1" as const;

export const COMPARATIVE_MODEL_IDS_V0_1 = Object.freeze([
  "FUNCTIONAL_ROLE_F",
  "DOCTRINE_PRINCIPLE_P",
  "MULTIDIMENSIONAL_PROFILE_M",
] as const);

export const COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1 =
  "NOT_ESTABLISHED" as const;

export type ComparativeModelIdV0_1 =
  (typeof COMPARATIVE_MODEL_IDS_V0_1)[number];

export const COMPARATIVE_MODEL_REFERENCES_V0_1 = Object.freeze({
  FUNCTIONAL_ROLE_F: Object.freeze({
    modelId: "FUNCTIONAL_ROLE_F",
    representation: "CURRENT_PRINCIPLE_ROLE",
    authority: "CURRENT_SEVEN_PRINCIPLES_ROLE",
    source: "src/shared/sevenPrinciples.v1.ts",
  }),
  DOCTRINE_PRINCIPLE_P: Object.freeze({
    modelId: "DOCTRINE_PRINCIPLE_P",
    representation: "CHAPTER_4_PRINCIPLE_ASSOCIATION",
    authority: "REVIEWED_DOCTRINE_PROFILE_PRINCIPLE_ASSOCIATION",
    source: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  }),
  MULTIDIMENSIONAL_PROFILE_M: Object.freeze({
    modelId: "MULTIDIMENSIONAL_PROFILE_M",
    representation: "MULTIDIMENSIONAL_DOCTRINE_PROFILE",
    authority: "REVIEWED_DOCTRINE_PROFILE",
    source: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  }),
} as const);

export const COMPARATIVE_INTERACTION_AUTHORITY_V0_1 = "NO" as const;
export const COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1 =
  "NOT_AUTHORIZED" as const;
export const COMPARATIVE_U_TO_I_STATUS_V0_1 =
  "NOT_AUTHORIZED_AS_GENERIC_RULE" as const;
export const COMPARATIVE_I_TO_U_STATUS_V0_1 =
  "NOT_AUTHORIZED_AS_GENERIC_RULE" as const;

export type ComparativeProvenanceKindV0_1 =
  | "INDEPENDENT"
  | "REVIEWED_EXISTING_EVIDENCE"
  | "RESEARCH_EXISTING_EVIDENCE"
  | "FIXTURE_AUTHORED"
  | "CANONICAL_AUTHORED"
  | "TARGET_SENSE_AUTHORED"
  | "SYNTHETIC"
  | "UNKNOWN";

export type ComparativeCircularityStatusV0_1 =
  | "INDEPENDENT_SIGNAL"
  | "PARTIALLY_CIRCULAR"
  | "CIRCULAR"
  | "UNKNOWN";

export type ComparativeVerdictV0_1 =
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "UNSUPPORTED"
  | "UNKNOWN"
  | "NULL";

export type ComparativeOverreachReasonV0_1 =
  | "EXCEEDS_SOURCE_SUPPORT"
  | "EXCEEDS_TARGET_SENSE_SUPPORT"
  | "EXCEEDS_EVIDENCE_STATUS"
  | "EXCEEDS_AUTHORITY"
  | "POST_HOC_METAPHOR"
  | "FORCED_SINGLE_WINNER"
  | "UNAUTHORIZED_INTERACTION_SEMANTICS";

export type ComparativeSplitV0_1 = "DEVELOPMENT" | "HELD_OUT" | "CONTROL";

export type ComparativeControlCategoryV0_1 =
  | "NULL_CONTROL"
  | "AMBIGUITY_CONTROL"
  | "TARGET_SENSE_CONTROL"
  | "MULTI_CANDIDATE_CONTROL"
  | "MODEL_DIVERGENCE_CONTROL"
  | "GENERAL_CASE";

export type ComparativeEvaluatorKindV0_1 =
  | "DETERMINISTIC_ENGINE"
  | "HUMAN"
  | "SYNTHETIC_MODEL"
  | "EXTERNAL_EVIDENCE";

export type ComparativeAdjudicationStatusV0_1 =
  | "NOT_STARTED"
  | "PENDING"
  | "COMPLETE";

export type ComparativeTargetSenseV0_1 = Readonly<{
  id: string;
  label: string;
  provenance: ComparativeProvenanceKindV0_1;
  provenanceRefs?: readonly string[];
}>;

export type ComparativeFunctionalRoleEntryV0_1 = Readonly<{
  voice: SevenVoiceKey;
  role: PrincipleRole;
}>;

export type ComparativePrincipleEntryV0_1 = Readonly<{
  voice: SevenVoiceKey;
  principle: SevenVoicesPrincipleAssociationV0_1;
}>;

export type ComparativeProfileEntryV0_1 = Readonly<{
  voice: SevenVoiceKey;
  profile: SevenVoiceDoctrineFunctionalProfileV0_1;
}>;

export type ComparativeModelRepresentationV0_1 =
  | Readonly<{
      modelId: "FUNCTIONAL_ROLE_F";
      voicePath: readonly SevenVoiceKey[];
      roles: readonly ComparativeFunctionalRoleEntryV0_1[];
    }>
  | Readonly<{
      modelId: "DOCTRINE_PRINCIPLE_P";
      voicePath: readonly SevenVoiceKey[];
      principles: readonly ComparativePrincipleEntryV0_1[];
    }>
  | Readonly<{
      modelId: "MULTIDIMENSIONAL_PROFILE_M";
      voicePath: readonly SevenVoiceKey[];
      profiles: readonly ComparativeProfileEntryV0_1[];
    }>;

export type ComparativeNullExpectedOutcomeV0_1 =
  | "INDEPENDENTLY_EXPECTED_NULL"
  | "INDEPENDENTLY_EXPECTED_NON_NULL"
  | "UNKNOWN_EXPECTED_NULLNESS";

export type ComparativeNullClassificationV0_1 =
  | "CORRECT_NULL"
  | "INCORRECT_NULL"
  | "UNKNOWN_NULL_CORRECTNESS"
  | "NOT_APPLICABLE";

export type ComparativeNullAssessmentV0_1 = Readonly<{
  modelOutcome: "MODEL_EMITTED_NULL" | "MODEL_EMITTED_NON_NULL";
  expectedOutcome: ComparativeNullExpectedOutcomeV0_1;
  expectedOutcomeProvenance: ComparativeProvenanceKindV0_1;
  classification: ComparativeNullClassificationV0_1;
}>;

export type ComparativeMAddedInformationStatusV0_1 =
  | "UNIQUE_INDEPENDENT_SUPPORT"
  | "DUPLICATED_BY_COMPARATOR"
  | "NO_ADDED_SUPPORT"
  | "INCREASES_SEMANTIC_OVERREACH"
  | "UNKNOWN";

export type ComparativeMAddedInformationAssessmentV0_1 = Readonly<{
  comparatorModelId: "FUNCTIONAL_ROLE_F" | "DOCTRINE_PRINCIPLE_P";
  status: ComparativeMAddedInformationStatusV0_1;
}>;

export type ComparativeModelJudgmentV0_1 = Readonly<{
  modelId: ComparativeModelIdV0_1;
  evaluatorKind: ComparativeEvaluatorKindV0_1;
  provenance: ComparativeProvenanceKindV0_1;
  circularity: ComparativeCircularityStatusV0_1;
  modelOutput: "MODEL_EMITTED_NULL" | "MODEL_EMITTED_NON_NULL";
  verdict: ComparativeVerdictV0_1;
  nullAssessment: ComparativeNullAssessmentV0_1;
  overreachReasons: readonly ComparativeOverreachReasonV0_1[];
  ambiguity: "AMBIGUOUS_SUPPORTED" | null;
  addedInformationAssessments?: readonly ComparativeMAddedInformationAssessmentV0_1[];
}>;

export type ComparativeRepeatabilityRecordV0_1 = Readonly<{
  caseId: string;
  modelId: ComparativeModelIdV0_1;
  voicePath: readonly SevenVoiceKey[];
  representationFingerprint: string;
  repeatedRepresentationFingerprint: string;
  provenanceRefs: readonly string[];
  repeatedProvenanceRefs: readonly string[];
  modelOutput: "MODEL_EMITTED_NULL" | "MODEL_EMITTED_NON_NULL";
  repeatedModelOutput: "MODEL_EMITTED_NULL" | "MODEL_EMITTED_NON_NULL";
  serializedInputFingerprint: string;
  repeatedSerializedInputFingerprint: string;
  stable: boolean;
}>;

export type ComparativeBlindingMetadataV0_1 = Readonly<{
  protocol: "MODEL_IDENTITY_HIDDEN_V0_1";
  modelIdentityHidden: true;
  expectedWinnerHidden: true;
  canonicalClassificationHidden: true;
  representationMayBeShown: true;
}>;

export type ComparativeEvaluationCaseV0_1 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1;
  caseId: string;
  input: Readonly<{
    word: string;
    normalizedInput?: string;
  }>;
  targetSense?: ComparativeTargetSenseV0_1;
  structuralVoicePath?: readonly SevenVoiceKey[];
  caseProvenance: ComparativeProvenanceKindV0_1;
  caseCircularity: ComparativeCircularityStatusV0_1;
  caseKind: "GENERAL_CASE" | "CONTROL_CASE";
  controlCategories: readonly ComparativeControlCategoryV0_1[];
  split: ComparativeSplitV0_1;
  evaluationEligibility: "ELIGIBLE" | "INELIGIBLE";
  targetSenseEligibility: "ELIGIBLE_INDEPENDENT" | "INELIGIBLE";
  nullEligibility: "ELIGIBLE" | "INELIGIBLE" | "UNKNOWN";
  blinding: ComparativeBlindingMetadataV0_1;
  adjudicationStatus: ComparativeAdjudicationStatusV0_1;
  modelRepresentations: readonly ComparativeModelRepresentationV0_1[];
  modelJudgments?: readonly ComparativeModelJudgmentV0_1[];
  repeatability?: readonly ComparativeRepeatabilityRecordV0_1[];
}>;

export type ComparativeValidationReasonV0_1 =
  | "CASE_NOT_OBJECT"
  | "SCHEMA_VERSION_INVALID"
  | "CASE_ID_INVALID"
  | "INPUT_INVALID"
  | "TARGET_SENSE_INVALID"
  | "TARGET_SENSE_ELIGIBILITY_INVALID"
  | "VOICE_PATH_INVALID"
  | "PROVENANCE_INVALID"
  | "CIRCULARITY_INVALID"
  | "CASE_KIND_INVALID"
  | "CONTROL_CATEGORIES_INVALID"
  | "SPLIT_INVALID"
  | "ELIGIBILITY_INVALID"
  | "BLINDING_INVALID"
  | "ADJUDICATION_STATUS_INVALID"
  | "MODEL_REPRESENTATIONS_INVALID"
  | "MODEL_JUDGMENTS_INVALID"
  | "NULL_ASSESSMENT_INVALID"
  | "SYNTHETIC_INDEPENDENCE_INVALID"
  | "OVERREACH_REASONS_INVALID"
  | "ADDED_INFORMATION_INVALID"
  | "REPEATABILITY_INVALID"
  | "UNKNOWN_KEY"
  | "DUPLICATE_CASE_ID"
  | "REGISTRY_INVALID";

export type ComparativeValidationResultV0_1 = Readonly<
  | {
      ok: true;
      schemaVersion: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1;
      value: ComparativeEvaluationCaseV0_1;
    }
  | {
      ok: false;
      schemaVersion: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1;
      reasonCodes: readonly ComparativeValidationReasonV0_1[];
    }
>;

const MODEL_ID_SET_V0_1 = new Set<string>(COMPARATIVE_MODEL_IDS_V0_1);
const PROVENANCE_SET_V0_1 = new Set<ComparativeProvenanceKindV0_1>([
  "INDEPENDENT",
  "REVIEWED_EXISTING_EVIDENCE",
  "RESEARCH_EXISTING_EVIDENCE",
  "FIXTURE_AUTHORED",
  "CANONICAL_AUTHORED",
  "TARGET_SENSE_AUTHORED",
  "SYNTHETIC",
  "UNKNOWN",
]);
const CIRCULARITY_SET_V0_1 = new Set<ComparativeCircularityStatusV0_1>([
  "INDEPENDENT_SIGNAL",
  "PARTIALLY_CIRCULAR",
  "CIRCULAR",
  "UNKNOWN",
]);
const VERDICT_SET_V0_1 = new Set<ComparativeVerdictV0_1>([
  "SUPPORTED",
  "PARTIALLY_SUPPORTED",
  "UNSUPPORTED",
  "UNKNOWN",
  "NULL",
]);
const OVERREACH_REASON_SET_V0_1 = new Set<ComparativeOverreachReasonV0_1>([
  "EXCEEDS_SOURCE_SUPPORT",
  "EXCEEDS_TARGET_SENSE_SUPPORT",
  "EXCEEDS_EVIDENCE_STATUS",
  "EXCEEDS_AUTHORITY",
  "POST_HOC_METAPHOR",
  "FORCED_SINGLE_WINNER",
  "UNAUTHORIZED_INTERACTION_SEMANTICS",
]);
const CONTROL_CATEGORY_SET_V0_1 = new Set<ComparativeControlCategoryV0_1>([
  "NULL_CONTROL",
  "AMBIGUITY_CONTROL",
  "TARGET_SENSE_CONTROL",
  "MULTI_CANDIDATE_CONTROL",
  "MODEL_DIVERGENCE_CONTROL",
  "GENERAL_CASE",
]);

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOnlyKnownKeysV0_1(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  const allowed = new Set(keys);
  return Object.keys(value).every((key) => allowed.has(key));
}

function nonEmptyStringV0_1(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function uniqueStringsV0_1(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.every(nonEmptyStringV0_1) &&
    new Set(value).size === value.length
  );
}

function canonicalVoicePathV0_1(
  value: unknown,
): value is readonly SevenVoiceKey[] {
  return Array.isArray(value) && value.every(isSevenVoiceKey);
}

function knownValueV0_1<T extends string>(
  value: unknown,
  values: ReadonlySet<string>,
): value is T {
  return typeof value === "string" && values.has(value);
}

function valueAtVoiceV0_1(
  path: readonly SevenVoiceKey[],
  entries: readonly { voice: SevenVoiceKey }[],
): boolean {
  return (
    entries.length === path.length &&
    entries.every((entry, index) => entry.voice === path[index])
  );
}

function expectedNullClassificationV0_1(
  assessment: ComparativeNullAssessmentV0_1,
): ComparativeNullClassificationV0_1 {
  if (assessment.expectedOutcome === "UNKNOWN_EXPECTED_NULLNESS") {
    return assessment.modelOutcome === "MODEL_EMITTED_NULL"
      ? "UNKNOWN_NULL_CORRECTNESS"
      : "NOT_APPLICABLE";
  }
  const expectedNull =
    assessment.expectedOutcome === "INDEPENDENTLY_EXPECTED_NULL";
  const emittedNull = assessment.modelOutcome === "MODEL_EMITTED_NULL";
  return expectedNull === emittedNull
    ? expectedNull
      ? "CORRECT_NULL"
      : "NOT_APPLICABLE"
    : "INCORRECT_NULL";
}

function validateTargetSenseV0_1(value: unknown): boolean {
  if (!isRecordV0_1(value)) return false;
  if (
    !hasOnlyKnownKeysV0_1(value, [
      "id",
      "label",
      "provenance",
      "provenanceRefs",
    ])
  ) {
    return false;
  }
  return (
    nonEmptyStringV0_1(value.id) &&
    nonEmptyStringV0_1(value.label) &&
    knownValueV0_1<ComparativeProvenanceKindV0_1>(
      value.provenance,
      PROVENANCE_SET_V0_1,
    ) &&
    (value.provenanceRefs === undefined ||
      uniqueStringsV0_1(value.provenanceRefs))
  );
}

function validateFunctionalRoleRepresentationV0_1(
  value: Record<string, unknown>,
): boolean {
  if (!hasOnlyKnownKeysV0_1(value, ["modelId", "voicePath", "roles"])) {
    return false;
  }
  if (
    value.modelId !== "FUNCTIONAL_ROLE_F" ||
    !canonicalVoicePathV0_1(value.voicePath)
  ) {
    return false;
  }
  if (!Array.isArray(value.roles)) return false;
  if (
    !value.roles.every((entry) => {
      if (
        !isRecordV0_1(entry) ||
        !hasOnlyKnownKeysV0_1(entry, ["voice", "role"]) ||
        typeof entry.voice !== "string" ||
        !isSevenVoiceKey(entry.voice)
      ) {
        return false;
      }
      return entry.role === SEVEN_PRINCIPLES[entry.voice].role;
    })
  ) {
    return false;
  }
  return valueAtVoiceV0_1(
    value.voicePath,
    value.roles as readonly { voice: SevenVoiceKey }[],
  );
}

function validatePrincipleRepresentationV0_1(
  value: Record<string, unknown>,
): boolean {
  if (!hasOnlyKnownKeysV0_1(value, ["modelId", "voicePath", "principles"])) {
    return false;
  }
  if (
    value.modelId !== "DOCTRINE_PRINCIPLE_P" ||
    !canonicalVoicePathV0_1(value.voicePath)
  ) {
    return false;
  }
  if (!Array.isArray(value.principles)) return false;
  if (
    !value.principles.every((entry) => {
      if (
        !isRecordV0_1(entry) ||
        !hasOnlyKnownKeysV0_1(entry, ["voice", "principle"]) ||
        typeof entry.voice !== "string" ||
        !isSevenVoiceKey(entry.voice)
      ) {
        return false;
      }
      const profile = getSevenVoiceDoctrineFunctionalProfileV0_1(entry.voice);
      return profile !== null && entry.principle === profile.principleAssociation.label;
    })
  ) {
    return false;
  }
  return valueAtVoiceV0_1(
    value.voicePath,
    value.principles as readonly { voice: SevenVoiceKey }[],
  );
}

function validateProfileRepresentationV0_1(
  value: Record<string, unknown>,
): boolean {
  if (!hasOnlyKnownKeysV0_1(value, ["modelId", "voicePath", "profiles"])) {
    return false;
  }
  if (
    value.modelId !== "MULTIDIMENSIONAL_PROFILE_M" ||
    !canonicalVoicePathV0_1(value.voicePath)
  ) {
    return false;
  }
  if (!Array.isArray(value.profiles)) return false;
  if (
    !value.profiles.every((entry) => {
      if (
        !isRecordV0_1(entry) ||
        !hasOnlyKnownKeysV0_1(entry, ["voice", "profile"]) ||
        typeof entry.voice !== "string" ||
        !isSevenVoiceKey(entry.voice)
      ) {
        return false;
      }
      const result = validateSevenVoiceDoctrineFunctionalProfileV0_1(
        entry.profile,
      );
      return result.ok && result.value.voice === entry.voice;
    })
  ) {
    return false;
  }
  return valueAtVoiceV0_1(
    value.voicePath,
    value.profiles as readonly { voice: SevenVoiceKey }[],
  );
}

export function validateComparativeModelRepresentationV0_1(
  value: unknown,
): boolean {
  if (!isRecordV0_1(value) || typeof value.modelId !== "string") return false;
  if (value.modelId === "FUNCTIONAL_ROLE_F") {
    return validateFunctionalRoleRepresentationV0_1(value);
  }
  if (value.modelId === "DOCTRINE_PRINCIPLE_P") {
    return validatePrincipleRepresentationV0_1(value);
  }
  if (value.modelId === "MULTIDIMENSIONAL_PROFILE_M") {
    return validateProfileRepresentationV0_1(value);
  }
  return false;
}

export function buildComparativeModelRepresentationV0_1(
  modelId: ComparativeModelIdV0_1,
  voicePath: readonly SevenVoiceKey[],
): ComparativeModelRepresentationV0_1 | null {
  if (!canonicalVoicePathV0_1(voicePath)) return null;

  if (modelId === "FUNCTIONAL_ROLE_F") {
    return Object.freeze({
      modelId,
      voicePath: Object.freeze([...voicePath]),
      roles: Object.freeze(
        voicePath.map((voice) =>
          Object.freeze({ voice, role: SEVEN_PRINCIPLES[voice].role }),
        ),
      ),
    });
  }

  if (modelId === "DOCTRINE_PRINCIPLE_P") {
    return Object.freeze({
      modelId,
      voicePath: Object.freeze([...voicePath]),
      principles: Object.freeze(
        voicePath.map((voice) => {
          const profile = getSevenVoiceDoctrineFunctionalProfileV0_1(voice);
          if (!profile) throw new Error("Missing doctrine profile for " + voice);
          return Object.freeze({
            voice,
            principle: profile.principleAssociation.label,
          });
        }),
      ),
    });
  }

  return Object.freeze({
    modelId,
    voicePath: Object.freeze([...voicePath]),
    profiles: Object.freeze(
      voicePath.map((voice) => {
        const profile = getSevenVoiceDoctrineFunctionalProfileV0_1(voice);
        if (!profile) throw new Error("Missing doctrine profile for " + voice);
        return Object.freeze({ voice, profile });
      }),
    ),
  });
}

function validateNullAssessmentV0_1(
  value: unknown,
  modelOutput: ComparativeModelJudgmentV0_1["modelOutput"],
  circularity: ComparativeCircularityStatusV0_1,
): boolean {
  if (
    !isRecordV0_1(value) ||
    !hasOnlyKnownKeysV0_1(value, [
      "modelOutcome",
      "expectedOutcome",
      "expectedOutcomeProvenance",
      "classification",
    ])
  ) {
    return false;
  }
  if (value.modelOutcome !== modelOutput) return false;
  if (
    value.expectedOutcome !== "INDEPENDENTLY_EXPECTED_NULL" &&
    value.expectedOutcome !== "INDEPENDENTLY_EXPECTED_NON_NULL" &&
    value.expectedOutcome !== "UNKNOWN_EXPECTED_NULLNESS"
  ) {
    return false;
  }
  if (
    !knownValueV0_1<ComparativeProvenanceKindV0_1>(
      value.expectedOutcomeProvenance,
      PROVENANCE_SET_V0_1,
    )
  ) {
    return false;
  }
  if (
    value.expectedOutcome !== "UNKNOWN_EXPECTED_NULLNESS" &&
    (value.expectedOutcomeProvenance !== "INDEPENDENT" ||
      circularity !== "INDEPENDENT_SIGNAL")
  ) {
    return false;
  }
  return (
    value.classification ===
    expectedNullClassificationV0_1(value as ComparativeNullAssessmentV0_1)
  );
}

function validateModelJudgmentV0_1(value: unknown): boolean {
  if (
    !isRecordV0_1(value) ||
    !hasOnlyKnownKeysV0_1(value, [
      "modelId",
      "evaluatorKind",
      "provenance",
      "circularity",
      "modelOutput",
      "verdict",
      "nullAssessment",
      "overreachReasons",
      "ambiguity",
      "addedInformationAssessments",
    ])
  ) {
    return false;
  }
  if (
    !knownValueV0_1<ComparativeModelIdV0_1>(
      value.modelId,
      MODEL_ID_SET_V0_1,
    )
  ) {
    return false;
  }
  if (
    ![
      "DETERMINISTIC_ENGINE",
      "HUMAN",
      "SYNTHETIC_MODEL",
      "EXTERNAL_EVIDENCE",
    ].includes(String(value.evaluatorKind))
  ) {
    return false;
  }
  if (
    !knownValueV0_1<ComparativeProvenanceKindV0_1>(
      value.provenance,
      PROVENANCE_SET_V0_1,
    ) ||
    !knownValueV0_1<ComparativeCircularityStatusV0_1>(
      value.circularity,
      CIRCULARITY_SET_V0_1,
    )
  ) {
    return false;
  }
  if (
    value.evaluatorKind === "SYNTHETIC_MODEL" &&
    (value.provenance === "INDEPENDENT" ||
      value.circularity === "INDEPENDENT_SIGNAL")
  ) {
    return false;
  }
  if (
    value.modelOutput !== "MODEL_EMITTED_NULL" &&
    value.modelOutput !== "MODEL_EMITTED_NON_NULL"
  ) {
    return false;
  }
  if (
    !knownValueV0_1<ComparativeVerdictV0_1>(
      value.verdict,
      VERDICT_SET_V0_1,
    )
  ) {
    return false;
  }
  if (
    value.modelOutput === "MODEL_EMITTED_NULL" &&
    value.verdict !== "NULL" &&
    value.verdict !== "UNKNOWN"
  ) {
    return false;
  }
  if (value.modelOutput === "MODEL_EMITTED_NON_NULL" && value.verdict === "NULL") {
    return false;
  }
  if (
    !validateNullAssessmentV0_1(
      value.nullAssessment,
      value.modelOutput,
      value.circularity,
    )
  ) {
    return false;
  }
  if (
    !Array.isArray(value.overreachReasons) ||
    !value.overreachReasons.every((reason) =>
      OVERREACH_REASON_SET_V0_1.has(reason as ComparativeOverreachReasonV0_1),
    ) ||
    new Set(value.overreachReasons).size !== value.overreachReasons.length
  ) {
    return false;
  }
  if (value.ambiguity !== null && value.ambiguity !== "AMBIGUOUS_SUPPORTED") {
    return false;
  }
  if (
    value.ambiguity === "AMBIGUOUS_SUPPORTED" &&
    value.verdict !== "SUPPORTED" &&
    value.verdict !== "PARTIALLY_SUPPORTED"
  ) {
    return false;
  }
  if (value.verdict === "SUPPORTED" && value.overreachReasons.length > 0) {
    return false;
  }
  if (value.addedInformationAssessments !== undefined) {
    if (
      value.modelId !== "MULTIDIMENSIONAL_PROFILE_M" ||
      !Array.isArray(value.addedInformationAssessments)
    ) {
      return false;
    }
    if (
      new Set(
        value.addedInformationAssessments.map((item) =>
          isRecordV0_1(item) ? item.comparatorModelId : "",
        ),
      ).size !== value.addedInformationAssessments.length ||
      !value.addedInformationAssessments.every(
        (item) =>
          isRecordV0_1(item) &&
          hasOnlyKnownKeysV0_1(item, ["comparatorModelId", "status"]) &&
          (item.comparatorModelId === "FUNCTIONAL_ROLE_F" ||
            item.comparatorModelId === "DOCTRINE_PRINCIPLE_P") &&
          [
            "UNIQUE_INDEPENDENT_SUPPORT",
            "DUPLICATED_BY_COMPARATOR",
            "NO_ADDED_SUPPORT",
            "INCREASES_SEMANTIC_OVERREACH",
            "UNKNOWN",
          ].includes(String(item.status)),
      )
    ) {
      return false;
    }
    const uniqueIndependentSupport = value.addedInformationAssessments.some(
      (item) =>
        isRecordV0_1(item) && item.status === "UNIQUE_INDEPENDENT_SUPPORT",
    );
    if (
      uniqueIndependentSupport &&
      (value.evaluatorKind === "SYNTHETIC_MODEL" ||
        value.provenance !== "INDEPENDENT" ||
        value.circularity !== "INDEPENDENT_SIGNAL" ||
        value.overreachReasons.length > 0 ||
        value.modelOutput === "MODEL_EMITTED_NULL" ||
        (value.verdict !== "SUPPORTED" &&
          value.verdict !== "PARTIALLY_SUPPORTED"))
    ) {
      return false;
    }
  }
  return true;
}

function validateRepeatabilityV0_1(
  value: unknown,
  caseId: string,
  structuralVoicePath: readonly SevenVoiceKey[] | undefined,
): boolean {
  if (
    !isRecordV0_1(value) ||
    !hasOnlyKnownKeysV0_1(value, [
      "caseId",
      "modelId",
      "voicePath",
      "representationFingerprint",
      "repeatedRepresentationFingerprint",
      "provenanceRefs",
      "repeatedProvenanceRefs",
      "modelOutput",
      "repeatedModelOutput",
      "serializedInputFingerprint",
      "repeatedSerializedInputFingerprint",
      "stable",
    ])
  ) {
    return false;
  }
  if (
    value.caseId !== caseId ||
    !knownValueV0_1<ComparativeModelIdV0_1>(
      value.modelId,
      MODEL_ID_SET_V0_1,
    )
  ) {
    return false;
  }
  if (
    !canonicalVoicePathV0_1(value.voicePath) ||
    (structuralVoicePath !== undefined &&
      JSON.stringify(value.voicePath) !== JSON.stringify(structuralVoicePath))
  ) {
    return false;
  }
  if (
    !nonEmptyStringV0_1(value.representationFingerprint) ||
    !nonEmptyStringV0_1(value.repeatedRepresentationFingerprint) ||
    !uniqueStringsV0_1(value.provenanceRefs) ||
    !uniqueStringsV0_1(value.repeatedProvenanceRefs)
  ) {
    return false;
  }
  if (
    value.modelOutput !== "MODEL_EMITTED_NULL" &&
    value.modelOutput !== "MODEL_EMITTED_NON_NULL"
  ) {
    return false;
  }
  if (
    value.repeatedModelOutput !== "MODEL_EMITTED_NULL" &&
    value.repeatedModelOutput !== "MODEL_EMITTED_NON_NULL"
  ) {
    return false;
  }
  if (
    !nonEmptyStringV0_1(value.serializedInputFingerprint) ||
    !nonEmptyStringV0_1(value.repeatedSerializedInputFingerprint)
  ) {
    return false;
  }
  return (
    typeof value.stable === "boolean" &&
    value.stable ===
      (value.serializedInputFingerprint ===
        value.repeatedSerializedInputFingerprint &&
        value.representationFingerprint ===
          value.repeatedRepresentationFingerprint &&
        JSON.stringify(value.provenanceRefs) ===
          JSON.stringify(value.repeatedProvenanceRefs) &&
        value.modelOutput === value.repeatedModelOutput)
  );
}

function validateBlindingV0_1(value: unknown): boolean {
  return (
    isRecordV0_1(value) &&
    hasOnlyKnownKeysV0_1(value, [
      "protocol",
      "modelIdentityHidden",
      "expectedWinnerHidden",
      "canonicalClassificationHidden",
      "representationMayBeShown",
    ]) &&
    value.protocol === "MODEL_IDENTITY_HIDDEN_V0_1" &&
    value.modelIdentityHidden === true &&
    value.expectedWinnerHidden === true &&
    value.canonicalClassificationHidden === true &&
    value.representationMayBeShown === true
  );
}

export function validateComparativeEvaluationCaseV0_1(
  value: unknown,
): ComparativeValidationResultV0_1 {
  const failures: ComparativeValidationReasonV0_1[] = [];
  if (!isRecordV0_1(value)) {
    return {
      ok: false,
      schemaVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1,
      reasonCodes: ["CASE_NOT_OBJECT"],
    };
  }

  if (
    !hasOnlyKnownKeysV0_1(value, [
      "schemaVersion",
      "caseId",
      "input",
      "targetSense",
      "structuralVoicePath",
      "caseProvenance",
      "caseCircularity",
      "caseKind",
      "controlCategories",
      "split",
      "evaluationEligibility",
      "targetSenseEligibility",
      "nullEligibility",
      "blinding",
      "adjudicationStatus",
      "modelRepresentations",
      "modelJudgments",
      "repeatability",
    ])
  ) {
    failures.push("UNKNOWN_KEY");
  }
  if (value.schemaVersion !== FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1) {
    failures.push("SCHEMA_VERSION_INVALID");
  }
  if (!nonEmptyStringV0_1(value.caseId)) failures.push("CASE_ID_INVALID");
  if (
    !isRecordV0_1(value.input) ||
    !hasOnlyKnownKeysV0_1(value.input, ["word", "normalizedInput"]) ||
    !nonEmptyStringV0_1(value.input.word) ||
    (value.input.normalizedInput !== undefined &&
      !nonEmptyStringV0_1(value.input.normalizedInput))
  ) {
    failures.push("INPUT_INVALID");
  }
  if (value.targetSense !== undefined && !validateTargetSenseV0_1(value.targetSense)) {
    failures.push("TARGET_SENSE_INVALID");
  }
  const targetSense = isRecordV0_1(value.targetSense)
    ? value.targetSense
    : undefined;
  if (
    value.structuralVoicePath !== undefined &&
    !canonicalVoicePathV0_1(value.structuralVoicePath)
  ) {
    failures.push("VOICE_PATH_INVALID");
  }
  const structuralVoicePath = canonicalVoicePathV0_1(
    value.structuralVoicePath,
  )
    ? value.structuralVoicePath
    : undefined;
  if (
    !knownValueV0_1<ComparativeProvenanceKindV0_1>(
      value.caseProvenance,
      PROVENANCE_SET_V0_1,
    )
  ) {
    failures.push("PROVENANCE_INVALID");
  }
  if (
    !knownValueV0_1<ComparativeCircularityStatusV0_1>(
      value.caseCircularity,
      CIRCULARITY_SET_V0_1,
    )
  ) {
    failures.push("CIRCULARITY_INVALID");
  }
  if (value.caseKind !== "GENERAL_CASE" && value.caseKind !== "CONTROL_CASE") {
    failures.push("CASE_KIND_INVALID");
  }
  if (
    !Array.isArray(value.controlCategories) ||
    !value.controlCategories.every((category) =>
      CONTROL_CATEGORY_SET_V0_1.has(category as ComparativeControlCategoryV0_1),
    ) ||
    new Set(value.controlCategories).size !== value.controlCategories.length ||
    (value.caseKind === "GENERAL_CASE" && value.controlCategories.length !== 0) ||
    (value.caseKind === "CONTROL_CASE" && value.controlCategories.length === 0)
  ) {
    failures.push("CONTROL_CATEGORIES_INVALID");
  }
  if (
    value.split !== "DEVELOPMENT" &&
    value.split !== "HELD_OUT" &&
    value.split !== "CONTROL"
  ) {
    failures.push("SPLIT_INVALID");
  }
  if (
    value.evaluationEligibility !== "ELIGIBLE" &&
    value.evaluationEligibility !== "INELIGIBLE"
  ) {
    failures.push("ELIGIBILITY_INVALID");
  }
  if (
    value.targetSenseEligibility !== "ELIGIBLE_INDEPENDENT" &&
    value.targetSenseEligibility !== "INELIGIBLE"
  ) {
    failures.push("TARGET_SENSE_ELIGIBILITY_INVALID");
  }
  if (
    value.targetSenseEligibility === "ELIGIBLE_INDEPENDENT" &&
    (!validateTargetSenseV0_1(value.targetSense) ||
      targetSense?.provenance !== "INDEPENDENT")
  ) {
    failures.push("TARGET_SENSE_ELIGIBILITY_INVALID");
  }
  if (
    value.targetSenseEligibility === "INELIGIBLE" &&
    targetSense?.provenance === "INDEPENDENT"
  ) {
    failures.push("TARGET_SENSE_ELIGIBILITY_INVALID");
  }
  if (
    value.nullEligibility !== "ELIGIBLE" &&
    value.nullEligibility !== "INELIGIBLE" &&
    value.nullEligibility !== "UNKNOWN"
  ) {
    failures.push("ELIGIBILITY_INVALID");
  }
  if (
    value.nullEligibility === "ELIGIBLE" &&
    !(
      Array.isArray(value.controlCategories) &&
      value.controlCategories.includes("NULL_CONTROL")
    )
  ) {
    failures.push("ELIGIBILITY_INVALID");
  }
  if (!validateBlindingV0_1(value.blinding)) failures.push("BLINDING_INVALID");
  if (
    value.adjudicationStatus !== "NOT_STARTED" &&
    value.adjudicationStatus !== "PENDING" &&
    value.adjudicationStatus !== "COMPLETE"
  ) {
    failures.push("ADJUDICATION_STATUS_INVALID");
  }

  if (value.modelRepresentations === undefined) {
    failures.push("MODEL_REPRESENTATIONS_INVALID");
  } else {
    const modelRepresentations = Array.isArray(value.modelRepresentations)
      ? (value.modelRepresentations as readonly unknown[])
      : undefined;
    if (
      modelRepresentations === undefined ||
      modelRepresentations.length !== COMPARATIVE_MODEL_IDS_V0_1.length ||
      new Set(
        modelRepresentations.map((item) =>
          isRecordV0_1(item) ? item.modelId : "",
        ),
      ).size !== modelRepresentations.length ||
      !COMPARATIVE_MODEL_IDS_V0_1.every((modelId) =>
        modelRepresentations.some(
          (item) => isRecordV0_1(item) && item.modelId === modelId,
        ),
      ) ||
      !modelRepresentations.every(validateComparativeModelRepresentationV0_1)
    ) {
      failures.push("MODEL_REPRESENTATIONS_INVALID");
    }
    if (
      value.structuralVoicePath !== undefined &&
      modelRepresentations !== undefined &&
      modelRepresentations.some(
        (item) =>
          isRecordV0_1(item) &&
          JSON.stringify(item.voicePath) !==
            JSON.stringify(value.structuralVoicePath),
      )
    ) {
      failures.push("MODEL_REPRESENTATIONS_INVALID");
    }
  }
  if (value.modelJudgments !== undefined) {
    const modelJudgments = Array.isArray(value.modelJudgments)
      ? (value.modelJudgments as readonly unknown[])
      : undefined;
    if (
      modelJudgments === undefined ||
      new Set(
        modelJudgments.map((item) =>
          isRecordV0_1(item) ? item.modelId : "",
        ),
      ).size !== modelJudgments.length ||
      !modelJudgments.every((item) => validateModelJudgmentV0_1(item))
    ) {
      failures.push("MODEL_JUDGMENTS_INVALID");
    }
    if (
      value.adjudicationStatus !== "COMPLETE" &&
      modelJudgments !== undefined &&
      modelJudgments.length > 0
    ) {
      failures.push("ADJUDICATION_STATUS_INVALID");
    }
  }
  if (value.repeatability !== undefined) {
    const repeatability = Array.isArray(value.repeatability)
      ? (value.repeatability as readonly unknown[])
      : undefined;
    if (
      repeatability === undefined ||
      new Set(
        repeatability.map((item) =>
          isRecordV0_1(item) ? item.modelId : "",
        ),
      ).size !== repeatability.length ||
      !repeatability.every((item) =>
        validateRepeatabilityV0_1(
          item,
          nonEmptyStringV0_1(value.caseId) ? value.caseId : "",
          structuralVoicePath,
        ),
      )
    ) {
      failures.push("REPEATABILITY_INVALID");
    }
  }

  if (failures.length > 0) {
    return {
      ok: false,
      schemaVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1,
      reasonCodes: [...new Set(failures)],
    };
  }
  return {
    ok: true,
    schemaVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1,
    value: value as ComparativeEvaluationCaseV0_1,
  };
}

export type ComparativeRegistryValidationResultV0_1 = Readonly<{
  ok: boolean;
  schemaVersion: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1;
  reasonCodes: readonly ComparativeValidationReasonV0_1[];
}>;

export function validateComparativeEvaluationCasesV0_1(
  value: unknown,
): ComparativeRegistryValidationResultV0_1 {
  if (!Array.isArray(value)) {
    return {
      ok: false,
      schemaVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1,
      reasonCodes: ["REGISTRY_INVALID"],
    };
  }
  const ids = value.map((item) => (isRecordV0_1(item) ? item.caseId : ""));
  if (
    ids.some((id) => !nonEmptyStringV0_1(id)) ||
    new Set(ids).size !== ids.length
  ) {
    return {
      ok: false,
      schemaVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1,
      reasonCodes: ["DUPLICATE_CASE_ID"],
    };
  }
  const reasonCodes = value.flatMap((item) => {
    const result = validateComparativeEvaluationCaseV0_1(item);
    return result.ok ? [] : result.reasonCodes;
  });
  return {
    ok: reasonCodes.length === 0,
    schemaVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1,
    reasonCodes: [...new Set(reasonCodes)],
  };
}

export type ComparativeSupportMetricV0_1 = Readonly<{
  modelId: ComparativeModelIdV0_1;
  eligibleCaseCount: number;
  judgedCaseCount: number;
  supportedCount: number;
  partiallySupportedCount: number;
  unsupportedCount: number;
  unknownCount: number;
  nullCount: number;
  unjudgedCount: number;
  denominator: number;
  score: number | null;
}>;

function judgmentsForModelV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  modelId: ComparativeModelIdV0_1,
): readonly ComparativeModelJudgmentV0_1[] {
  return cases.flatMap((item) =>
    (item.modelJudgments ?? []).filter((judgment) => judgment.modelId === modelId),
  );
}

function scoreableVerdictV0_1(
  verdict: ComparativeVerdictV0_1,
): verdict is "SUPPORTED" | "PARTIALLY_SUPPORTED" | "UNSUPPORTED" {
  return (
    verdict === "SUPPORTED" ||
    verdict === "PARTIALLY_SUPPORTED" ||
    verdict === "UNSUPPORTED"
  );
}

function supportMetricV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  modelId: ComparativeModelIdV0_1,
  eligible: (item: ComparativeEvaluationCaseV0_1) => boolean,
): ComparativeSupportMetricV0_1 {
  const eligibleCases = cases.filter(eligible);
  const judgments = eligibleCases.flatMap((item) =>
    (item.modelJudgments ?? []).filter((judgment) => judgment.modelId === modelId),
  );
  const supportedCount = judgments.filter((item) => item.verdict === "SUPPORTED").length;
  const partiallySupportedCount = judgments.filter(
    (item) => item.verdict === "PARTIALLY_SUPPORTED",
  ).length;
  const unsupportedCount = judgments.filter(
    (item) => item.verdict === "UNSUPPORTED",
  ).length;
  const unknownCount = judgments.filter((item) => item.verdict === "UNKNOWN").length;
  const nullCount = judgments.filter((item) => item.verdict === "NULL").length;
  const denominator = supportedCount + partiallySupportedCount + unsupportedCount;
  return {
    modelId,
    eligibleCaseCount: eligibleCases.length,
    judgedCaseCount: judgments.length,
    supportedCount,
    partiallySupportedCount,
    unsupportedCount,
    unknownCount,
    nullCount,
    unjudgedCount: eligibleCases.length - judgments.length,
    denominator,
    score:
      denominator === 0
        ? null
        : (supportedCount + partiallySupportedCount * 0.5) / denominator,
  };
}

export function calculateTargetSenseSupportMetricV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  modelId: ComparativeModelIdV0_1,
): ComparativeSupportMetricV0_1 {
  return supportMetricV0_1(
    cases,
    modelId,
    (item) => item.targetSenseEligibility === "ELIGIBLE_INDEPENDENT",
  );
}

export function calculateFunctionalExplanatorySupportMetricV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  modelId: ComparativeModelIdV0_1,
): ComparativeSupportMetricV0_1 {
  return supportMetricV0_1(
    cases,
    modelId,
    (item) => item.evaluationEligibility === "ELIGIBLE",
  );
}

export type ComparativeRateMetricV0_1 = Readonly<{
  modelId: ComparativeModelIdV0_1;
  numerator: number;
  denominator: number;
  rate: number | null;
  unknownCount: number;
  nullCount: number;
}>;

export function calculateUnsupportedRateMetricV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  modelId: ComparativeModelIdV0_1,
): ComparativeRateMetricV0_1 {
  const judgments = judgmentsForModelV0_1(
    cases.filter((item) => item.evaluationEligibility === "ELIGIBLE"),
    modelId,
  );
  const scored = judgments.filter((item) => scoreableVerdictV0_1(item.verdict));
  const numerator = scored.filter((item) => item.verdict === "UNSUPPORTED").length;
  return {
    modelId,
    numerator,
    denominator: scored.length,
    rate: scored.length === 0 ? null : numerator / scored.length,
    unknownCount: judgments.filter((item) => item.verdict === "UNKNOWN").length,
    nullCount: judgments.filter((item) => item.verdict === "NULL").length,
  };
}

export type ComparativeNullMetricsV0_1 = Readonly<{
  modelId: ComparativeModelIdV0_1;
  totalModelOutputs: number;
  emittedNullCount: number;
  emittedNullRate: number | null;
  independentlyExpectedNullCount: number;
  correctNullCount: number;
  incorrectNullCount: number;
  unknownNullCorrectnessCount: number;
  correctNullRate: number | null;
}>;

export function calculateNullMetricsV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  modelId: ComparativeModelIdV0_1,
): ComparativeNullMetricsV0_1 {
  const judgments = judgmentsForModelV0_1(cases, modelId);
  const emittedNullCount = judgments.filter(
    (item) => item.modelOutput === "MODEL_EMITTED_NULL",
  ).length;
  const independentlyExpectedNullCount = judgments.filter(
    (item) =>
      item.nullAssessment.expectedOutcome === "INDEPENDENTLY_EXPECTED_NULL",
  ).length;
  const correctNullCount = judgments.filter(
    (item) => item.nullAssessment.classification === "CORRECT_NULL",
  ).length;
  const incorrectNullCount = judgments.filter(
    (item) => item.nullAssessment.classification === "INCORRECT_NULL",
  ).length;
  const unknownNullCorrectnessCount = judgments.filter(
    (item) => item.nullAssessment.classification === "UNKNOWN_NULL_CORRECTNESS",
  ).length;
  return {
    modelId,
    totalModelOutputs: judgments.length,
    emittedNullCount,
    emittedNullRate:
      judgments.length === 0 ? null : emittedNullCount / judgments.length,
    independentlyExpectedNullCount,
    correctNullCount,
    incorrectNullCount,
    unknownNullCorrectnessCount,
    correctNullRate:
      independentlyExpectedNullCount === 0
        ? null
        : correctNullCount / independentlyExpectedNullCount,
  };
}

export type ComparativeIndependentEvidenceMetricV0_1 = Readonly<{
  modelId: ComparativeModelIdV0_1;
  independentlySupportedCount: number;
  scoredCount: number;
  rate: number | null;
}>;

export function calculateIndependentEvidenceMetricV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  modelId: ComparativeModelIdV0_1,
): ComparativeIndependentEvidenceMetricV0_1 {
  const judgments = judgmentsForModelV0_1(cases, modelId);
  const scored = judgments.filter((item) => scoreableVerdictV0_1(item.verdict));
  const independent = scored.filter(
    (item) =>
      (item.evaluatorKind === "HUMAN" ||
        item.evaluatorKind === "EXTERNAL_EVIDENCE") &&
      item.provenance === "INDEPENDENT" &&
      item.circularity === "INDEPENDENT_SIGNAL" &&
      item.verdict === "SUPPORTED",
  );
  return {
    modelId,
    independentlySupportedCount: independent.length,
    scoredCount: scored.length,
    rate: scored.length === 0 ? null : independent.length / scored.length,
  };
}

export type ComparativeCircularityMetricV0_1 = Readonly<{
  modelId: ComparativeModelIdV0_1;
  counts: Readonly<Record<ComparativeCircularityStatusV0_1, number>>;
  totalJudgments: number;
  knownClassificationRate: number | null;
  circularRateAmongKnown: number | null;
}>;

export function calculateCircularityMetricV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  modelId: ComparativeModelIdV0_1,
): ComparativeCircularityMetricV0_1 {
  const judgments = judgmentsForModelV0_1(cases, modelId);
  const counts = {
    INDEPENDENT_SIGNAL: judgments.filter(
      (item) => item.circularity === "INDEPENDENT_SIGNAL",
    ).length,
    PARTIALLY_CIRCULAR: judgments.filter(
      (item) => item.circularity === "PARTIALLY_CIRCULAR",
    ).length,
    CIRCULAR: judgments.filter((item) => item.circularity === "CIRCULAR").length,
    UNKNOWN: judgments.filter((item) => item.circularity === "UNKNOWN").length,
  } as const;
  const known = judgments.length - counts.UNKNOWN;
  return {
    modelId,
    counts,
    totalJudgments: judgments.length,
    knownClassificationRate:
      judgments.length === 0 ? null : known / judgments.length,
    circularRateAmongKnown: known === 0 ? null : counts.CIRCULAR / known,
  };
}

export type ComparativeMAddedInformationMetricV0_1 = Readonly<{
  modelId: "MULTIDIMENSIONAL_PROFILE_M";
  comparatorModelId: "FUNCTIONAL_ROLE_F" | "DOCTRINE_PRINCIPLE_P";
  assessedCount: number;
  uniqueIndependentSupportCount: number;
  duplicatedCount: number;
  noAddedSupportCount: number;
  overreachIncreaseCount: number;
  unknownCount: number;
  uniqueIndependentSupportRate: number | null;
}>;

export function calculateModelMAddedInformationMetricV0_1(
  cases: readonly ComparativeEvaluationCaseV0_1[],
  comparatorModelId: "FUNCTIONAL_ROLE_F" | "DOCTRINE_PRINCIPLE_P",
): ComparativeMAddedInformationMetricV0_1 {
  const assessments = cases.flatMap((item) =>
    (item.modelJudgments ?? [])
      .filter((judgment) => judgment.modelId === "MULTIDIMENSIONAL_PROFILE_M")
      .flatMap((judgment) =>
        (judgment.addedInformationAssessments ?? []).filter(
          (assessment) => assessment.comparatorModelId === comparatorModelId,
        ),
      ),
  );
  const uniqueIndependentSupportCount = assessments.filter(
    (item) => item.status === "UNIQUE_INDEPENDENT_SUPPORT",
  ).length;
  const duplicatedCount = assessments.filter(
    (item) => item.status === "DUPLICATED_BY_COMPARATOR",
  ).length;
  const noAddedSupportCount = assessments.filter(
    (item) => item.status === "NO_ADDED_SUPPORT",
  ).length;
  const overreachIncreaseCount = assessments.filter(
    (item) => item.status === "INCREASES_SEMANTIC_OVERREACH",
  ).length;
  const unknownCount = assessments.filter((item) => item.status === "UNKNOWN").length;
  const assessedCount = assessments.length;
  const known = assessedCount - unknownCount;
  return {
    modelId: "MULTIDIMENSIONAL_PROFILE_M",
    comparatorModelId,
    assessedCount,
    uniqueIndependentSupportCount,
    duplicatedCount,
    noAddedSupportCount,
    overreachIncreaseCount,
    unknownCount,
    uniqueIndependentSupportRate:
      known === 0 ? null : uniqueIndependentSupportCount / known,
  };
}
