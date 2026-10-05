import type {
  DoctrineFunctionalPropertyIdV0_1,
} from "./doctrineFunctionalProfile.v0_1";
import {
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_PROFILE_ID_V0_1,
  type EnglishLexicalSenseExampleV0_1,
} from "./englishLexicalSenseSourceContract.v0_1";

export const FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_FUNCTIONAL_OUTCOME_NORMALIZATION_ADJUDICATION_V0_1" as const;

export const FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1 =
  "open-instrument.functional-outcome-normalization.v0_1" as const;

export const FUNCTIONAL_OUTCOME_NORMALIZATION_VERSION_V0_1 = "v0.1" as const;

export const FUNCTIONAL_OUTCOME_NORMALIZATION_UNIT_OF_ANALYSIS_V0_1 =
  "SOURCE_RECORD_POS_SENSE" as const;

export const FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1 =
  ENGLISH_LEXICAL_SENSE_SOURCE_PROFILE_ID_V0_1;

export const FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1 =
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1;

export const FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_IDS_V0_1 = Object.freeze([
  "beginning",
  "creation",
  "activation",
  "life_pulse",
  "expansion",
  "transformation",
  "connection",
  "growth",
  "illumination",
  "knowledge",
  "recognition",
  "clarity",
  "truth_orientation",
  "understanding",
  "mediation",
  "balance",
  "order",
  "center",
  "harmonization",
  "non_domination",
  "unification",
  "support",
  "grounding",
  "depth",
  "stability",
  "nourishment",
  "belonging",
  "foundation",
  "choice",
  "duality",
  "exploration",
  "adventure",
  "mystery",
  "imagination",
  "experimentation",
  "discovery",
  "risk",
  "learning_from_experience",
  "resolution",
  "harmony",
  "peace",
  "reconciliation",
  "unity",
  "emotional_interiority",
] as const satisfies readonly DoctrineFunctionalPropertyIdV0_1[]);

export type FunctionalOutcomePropertyIdV0_1 =
  (typeof FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_IDS_V0_1)[number];

export type FunctionalOutcomePropertyOutcomeV0_1 =
  | "DIRECT_MATCH"
  | "CONTRADICTION"
  | "NO_MATCH"
  | "UNKNOWN"
  | "NOT_TESTABLE";

export type FunctionalOutcomeInputKindV0_1 =
  | "SOURCE_SENSE"
  | "SOURCE_NOT_FOUND";

export type FunctionalOutcomeSourceSenseInputV0_1 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1;
  inputKind: "SOURCE_SENSE";
  sourceProfileId: typeof FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1;
  sourceArtifactSha256: typeof FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1;
  sourceRecordId: string;
  sourceRecordOrdinal: number;
  sourceForm: string;
  language: typeof ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1;
  languageCode: typeof ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1;
  pos: string;
  senseId: string;
  senseOrdinal: number;
  glosses: readonly string[];
  tags: readonly string[];
  rawTags: readonly string[];
  examples: readonly EnglishLexicalSenseExampleV0_1[];
}>;

export type FunctionalOutcomeSourceNotFoundInputV0_1 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1;
  inputKind: "SOURCE_NOT_FOUND";
  sourceProfileId: typeof FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1;
  sourceArtifactSha256: typeof FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1;
  normalizedJoinKey: string;
  reasonCode: "LEXICAL_SENSE_SOURCE_NOT_FOUND";
}>;

export type FunctionalOutcomeNormalizationInputV0_1 =
  | FunctionalOutcomeSourceSenseInputV0_1
  | FunctionalOutcomeSourceNotFoundInputV0_1;

export type FunctionalOutcomeEvidenceRefV0_1 = Readonly<{
  sourceRecordId: string;
  senseId: string;
  locator: string;
  evidenceText: string;
}>;

export type FunctionalOutcomeObservationV0_1 = Readonly<{
  propertyId: FunctionalOutcomePropertyIdV0_1;
  outcome: FunctionalOutcomePropertyOutcomeV0_1;
  evidenceRefs: readonly FunctionalOutcomeEvidenceRefV0_1[];
}>;

export type FunctionalOutcomeAdjudicationStatusV0_1 =
  | "NOT_STARTED"
  | "PENDING"
  | "COMPLETE"
  | "DISAGREEMENT";

export type FunctionalOutcomeAdjudicationDecisionV0_1 =
  | "NO_DECISION"
  | "SUPPORTED"
  | "PARTIALLY_SUPPORTED"
  | "UNSUPPORTED"
  | "UNKNOWN"
  | "NULL"
  | "DISAGREEMENT";

export type FunctionalOutcomeAdjudicationV0_1 = Readonly<{
  status: FunctionalOutcomeAdjudicationStatusV0_1;
  decision: FunctionalOutcomeAdjudicationDecisionV0_1;
  reviewerIds: readonly string[];
  reviewedAt: string | null;
  rationale: string | null;
  provenanceRefs: readonly string[];
}>;

export type FunctionalOutcomeNormalizationStatusV0_1 =
  | "SOURCE_NOT_FOUND"
  | "SOURCE_PRESENT_OUTCOME_UNRESOLVED"
  | "SOURCE_PRESENT_OUTCOME_ADJUDICATED";

export type FunctionalOutcomeNormalizationReasonCodeV0_1 =
  | "LEXICAL_SENSE_SOURCE_NOT_FOUND"
  | "SOURCE_PRESENT_OUTCOME_UNRESOLVED"
  | "SOURCE_TEXT_INSUFFICIENT"
  | "NO_EXACT_CANONICAL_PROPERTY_TERM"
  | "UNRESOLVED_SENSE_AMBIGUITY"
  | "INSUFFICIENT_AUTHORIZED_INFORMATION"
  | "OUTCOME_CONFLICTING_EVIDENCE"
  | "OUTCOME_UNSUPPORTED_TEXT"
  | "REVIEW_REQUIRED"
  | "REVIEW_DISAGREEMENT"
  | "FORCED_SINGLE_WINNER_FORBIDDEN"
  | "STRUCTURAL_INPUT_FORBIDDEN"
  | "TARGET_INPUT_FORBIDDEN"
  | "PROVIDER_INPUT_FORBIDDEN"
  | "PROVENANCE_MISSING";

export type FunctionalOutcomeNormalizationResultV0_1 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1;
  unitOfAnalysis: typeof FUNCTIONAL_OUTCOME_NORMALIZATION_UNIT_OF_ANALYSIS_V0_1;
  input: FunctionalOutcomeNormalizationInputV0_1;
  status: FunctionalOutcomeNormalizationStatusV0_1;
  outcomes: readonly FunctionalOutcomeObservationV0_1[];
  reasonCodes: readonly FunctionalOutcomeNormalizationReasonCodeV0_1[];
  adjudication: FunctionalOutcomeAdjudicationV0_1;
  claimBoundary: "SOURCE_TO_OUTCOME_NORMALIZATION_ONLY";
  functionalAcceptance: "NOT_AUTHORIZED";
  historicalOriginClaim: "NOT_CLAIMED";
  winnerClaim: "NOT_CLAIMED";
  productionRuntimeAuthority: "NOT_AUTHORIZED";
  manifestationAuthority: "NOT_AUTHORIZED";
  consonantMeaningAuthority: "NOT_AUTHORIZED";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export const FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_OUTCOMES_V0_1 =
  Object.freeze([
    "DIRECT_MATCH",
    "CONTRADICTION",
    "NO_MATCH",
    "UNKNOWN",
    "NOT_TESTABLE",
  ] as const);

export const FUNCTIONAL_OUTCOME_NORMALIZATION_REASON_CODES_V0_1 = Object.freeze([
  "LEXICAL_SENSE_SOURCE_NOT_FOUND",
  "SOURCE_PRESENT_OUTCOME_UNRESOLVED",
  "SOURCE_TEXT_INSUFFICIENT",
  "NO_EXACT_CANONICAL_PROPERTY_TERM",
  "UNRESOLVED_SENSE_AMBIGUITY",
  "INSUFFICIENT_AUTHORIZED_INFORMATION",
  "OUTCOME_CONFLICTING_EVIDENCE",
  "OUTCOME_UNSUPPORTED_TEXT",
  "REVIEW_REQUIRED",
  "REVIEW_DISAGREEMENT",
  "FORCED_SINGLE_WINNER_FORBIDDEN",
  "STRUCTURAL_INPUT_FORBIDDEN",
  "TARGET_INPUT_FORBIDDEN",
  "PROVIDER_INPUT_FORBIDDEN",
  "PROVENANCE_MISSING",
] as const satisfies readonly FunctionalOutcomeNormalizationReasonCodeV0_1[]);

export const FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_V0_1 = Object.freeze({
  contractId: FUNCTIONAL_OUTCOME_NORMALIZATION_CONTRACT_ID_V0_1,
  version: FUNCTIONAL_OUTCOME_NORMALIZATION_VERSION_V0_1,
  status: "FROZEN_CONTRACT_ONLY",
  unitOfAnalysis: FUNCTIONAL_OUTCOME_NORMALIZATION_UNIT_OF_ANALYSIS_V0_1,
  sourceProfileId: FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1,
  sourceArtifactSha256: FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1,
  propertyVocabulary: "EXISTING_DOCTRINE_FUNCTIONAL_PROPERTY_IDS_ONLY",
  propertyOutcomeVocabulary: FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_OUTCOMES_V0_1,
  normalizationRule: "EXACT_CANONICAL_PROPERTY_TERM_ONLY",
  matchingOperator: {
    fieldScope: "GLOSSES_ONLY",
    propertyTermRule: "PROPERTY_ID_UNDERSCORE_TO_ASCII_SPACE_ONLY",
    textNormalization:
      "NFC_THEN_EN_US_LOWERCASE_THEN_NON_LETTER_DIGIT_RUN_TO_ASCII_SPACE_THEN_COLLAPSE_AND_TRIM",
    matchGranularity: "NORMALIZED_CONTIGUOUS_WHOLE_TOKEN_SEQUENCE",
    punctuationHandling: "NON_LETTER_DIGIT_RUN_IS_TOKEN_BOUNDARY",
    substringMatching: false,
    stemming: false,
    lemmatization: false,
    synonymExpansion: false,
    semanticInference: false,
    multiplePropertyMatches: "PRESERVE_ALL",
    multipleGlosses: "INSPECT_EACH_GLOSS_PRESERVE_ALL_EVIDENCE",
    zeroExactMatch: "SOURCE_PRESENT_NO_EXACT_MATCH_UNRESOLVED",
    insufficientGlossText: "SOURCE_TEXT_INSUFFICIENT",
  },
  multiplicity: {
    sourceRecordsPreserved: true,
    posRecordsPreserved: true,
    sensesPreserved: true,
    outcomesPreserved: true,
    primarySenseSelection: false,
    senseMerging: false,
    outcomeRanking: false,
    winnerSelection: false,
  },
  missingness: {
    sourceNotFound: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
    sourcePresentOutcomeUnresolved: "SOURCE_PRESENT_OUTCOME_UNRESOLVED",
    spellingFallback: false,
    modelInferenceFallback: false,
  },
  adjudication: {
    sourceOnly: true,
    humanReviewMayResolveSourceToOutcome: true,
    structuralPredictorsAvailable: false,
    targetSenseAvailable: false,
    providerOutputAvailable: false,
    disagreementFailsClosed: true,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  },
  constructiveBlindness: {
    vAvailable: false,
    gammaAvailable: false,
    zcAvailable: false,
    level3Available: false,
    math7Available: false,
    manifestationResultsAvailable: false,
    targetResultsAvailable: false,
    candidateRankingAvailable: false,
    providerOutputAvailable: false,
  },
  authorityFirewalls: {
    functionalOutcomeEmpiricalAuthority: "NO",
    functionalAcceptance: "NOT_AUTHORIZED",
    productionRuntimeAuthority: "NO",
    manifestationAuthority: "NO",
    consonantMeaningAuthority: "NO",
    historicalOriginAuthority: "NO",
    ipaToVoiceAuthority: "NO",
  },
} as const);

const SOURCE_INPUT_KEYS_V0_1 = [
  "schemaVersion",
  "inputKind",
  "sourceProfileId",
  "sourceArtifactSha256",
  "sourceRecordId",
  "sourceRecordOrdinal",
  "sourceForm",
  "language",
  "languageCode",
  "pos",
  "senseId",
  "senseOrdinal",
  "glosses",
  "tags",
  "rawTags",
  "examples",
] as const;

const NOT_FOUND_INPUT_KEYS_V0_1 = [
  "schemaVersion",
  "inputKind",
  "sourceProfileId",
  "sourceArtifactSha256",
  "normalizedJoinKey",
  "reasonCode",
] as const;

const FORBIDDEN_INPUT_KEYS_V0_1 = new Set([
  "canonicalVoicePath",
  "voicePath",
  "gamma",
  "consonantalConfiguration",
  "level3",
  "math7",
  "manifestationResults",
  "candidateRanking",
  "targetWord",
  "targetSense",
  "targetSenseId",
  "providerOutput",
  "modelOutput",
]);

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTextV0_1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value === value.trim() &&
    value === value.normalize("NFC")
  );
}

function isSha256V0_1(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function hasExactKeysV0_1(
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expected].sort());
}

function hasForbiddenInputKeyV0_1(
  value: unknown,
  seen = new WeakSet<object>(),
): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return false;
  }
  seen.add(value);
  if (Array.isArray(value)) {
    return value.some((child) => hasForbiddenInputKeyV0_1(child, seen));
  }
  return Object.entries(value).some(
    ([key, child]) =>
      FORBIDDEN_INPUT_KEYS_V0_1.has(key) ||
      hasForbiddenInputKeyV0_1(child, seen),
  );
}

function validExampleV0_1(value: unknown): value is EnglishLexicalSenseExampleV0_1 {
  if (!isRecordV0_1(value)) return false;
  const hasText = value.text !== undefined;
  const hasRef = value.ref !== undefined;
  if (!hasText && !hasRef) return false;
  if (hasText && !isTextV0_1(value.text)) return false;
  if (hasRef && !isTextV0_1(value.ref)) return false;
  if (value.bold_text_offsets !== undefined) {
    if (
      !Array.isArray(value.bold_text_offsets) ||
      !value.bold_text_offsets.every(
        (offset) =>
          Array.isArray(offset) &&
          offset.length === 2 &&
          offset.every((part) => Number.isInteger(part) && part >= 0),
      )
    ) {
      return false;
    }
  }
  return value.type === undefined || isTextV0_1(value.type);
}

function validTextArrayV0_1(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every(isTextV0_1);
}

export type FunctionalOutcomeNormalizationInputValidationResultV0_1 = Readonly<
  | { ok: true; input: FunctionalOutcomeNormalizationInputV0_1 }
  | { ok: false; reasonCodes: readonly string[] }
>;

export function validateFunctionalOutcomeNormalizationInputV0_1(
  value: unknown,
): FunctionalOutcomeNormalizationInputValidationResultV0_1 {
  if (!isRecordV0_1(value)) {
    return { ok: false, reasonCodes: ["INPUT_NOT_RECORD"] };
  }

  const reasons: string[] = [];
  if (hasForbiddenInputKeyV0_1(value)) {
    reasons.push("FORBIDDEN_STRUCTURAL_OR_TARGET_INPUT");
  }
  if (value.schemaVersion !== FUNCTIONAL_OUTCOME_NORMALIZATION_SCHEMA_V0_1) {
    reasons.push("SCHEMA_VERSION_INVALID");
  }
  if (!isTextV0_1(value.sourceProfileId)) reasons.push("SOURCE_PROFILE_INVALID");
  if (!isSha256V0_1(value.sourceArtifactSha256)) {
    reasons.push("SOURCE_ARTIFACT_HASH_INVALID");
  }

  if (value.inputKind === "SOURCE_NOT_FOUND") {
    if (!hasExactKeysV0_1(value, NOT_FOUND_INPUT_KEYS_V0_1)) {
      reasons.push("UNEXPECTED_FIELD_PRESENT");
    }
    if (value.sourceProfileId !== FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1) {
      reasons.push("SOURCE_PROFILE_INVALID");
    }
    if (value.sourceArtifactSha256 !== FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1) {
      reasons.push("SOURCE_ARTIFACT_HASH_INVALID");
    }
    if (!isTextV0_1(value.normalizedJoinKey)) reasons.push("JOIN_KEY_INVALID");
    if (value.reasonCode !== "LEXICAL_SENSE_SOURCE_NOT_FOUND") {
      reasons.push("MISSINGNESS_REASON_INVALID");
    }
  } else if (value.inputKind === "SOURCE_SENSE") {
    if (!hasExactKeysV0_1(value, SOURCE_INPUT_KEYS_V0_1)) {
      reasons.push("UNEXPECTED_FIELD_PRESENT");
    }
    if (value.sourceProfileId !== FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_PROFILE_V0_1) {
      reasons.push("SOURCE_PROFILE_INVALID");
    }
    if (value.sourceArtifactSha256 !== FUNCTIONAL_OUTCOME_NORMALIZATION_SOURCE_ARTIFACT_SHA256_V0_1) {
      reasons.push("SOURCE_ARTIFACT_HASH_INVALID");
    }
    if (!isTextV0_1(value.sourceRecordId)) reasons.push("SOURCE_RECORD_ID_INVALID");
    if (
      typeof value.sourceRecordOrdinal !== "number" ||
      !Number.isInteger(value.sourceRecordOrdinal) ||
      value.sourceRecordOrdinal < 1
    ) {
      reasons.push("SOURCE_RECORD_ORDINAL_INVALID");
    }
    if (!isTextV0_1(value.sourceForm)) reasons.push("SOURCE_FORM_INVALID");
    if (value.language !== ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_V0_1) {
      reasons.push("LANGUAGE_INVALID");
    }
    if (value.languageCode !== ENGLISH_LEXICAL_SENSE_SOURCE_LANGUAGE_CODE_V0_1) {
      reasons.push("LANGUAGE_CODE_INVALID");
    }
    if (!isTextV0_1(value.pos)) reasons.push("POS_INVALID");
    if (!isTextV0_1(value.senseId)) reasons.push("SENSE_ID_INVALID");
    if (
      typeof value.senseOrdinal !== "number" ||
      !Number.isInteger(value.senseOrdinal) ||
      value.senseOrdinal < 1
    ) {
      reasons.push("SENSE_ORDINAL_INVALID");
    }
    if (!validTextArrayV0_1(value.glosses)) reasons.push("GLOSSES_INVALID");
    if (!validTextArrayV0_1(value.tags)) reasons.push("TAGS_INVALID");
    if (!validTextArrayV0_1(value.rawTags)) reasons.push("RAW_TAGS_INVALID");
    if (!Array.isArray(value.examples) || !value.examples.every(validExampleV0_1)) {
      reasons.push("EXAMPLES_INVALID");
    }
  } else {
    reasons.push("INPUT_KIND_INVALID");
  }

  const uniqueReasons = [...new Set(reasons)].sort();
  if (uniqueReasons.length > 0) return { ok: false, reasonCodes: uniqueReasons };

  return { ok: true, input: value as FunctionalOutcomeNormalizationInputV0_1 };
}

export function canonicalPropertyIdToMatchingTermV0_1(
  propertyId: FunctionalOutcomePropertyIdV0_1,
): string {
  return propertyId.replace(/_/gu, " ");
}

export function normalizeFunctionalOutcomeMatchingTextV0_1(
  text: string,
): string {
  return text
    .normalize("NFC")
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{L}\p{Nd}]+/gu, " ")
    .replace(/ +/gu, " ")
    .trim();
}

type NormalizedGlossTokensV0_1 = Readonly<{
  glossIndex: number;
  sourceText: string;
  tokens: readonly string[];
}>;

function normalizedGlossTokensV0_1(
  sourceText: string,
  glossIndex: number,
): NormalizedGlossTokensV0_1 {
  const normalizedText = normalizeFunctionalOutcomeMatchingTextV0_1(sourceText);
  return {
    glossIndex,
    sourceText,
    tokens: normalizedText.length === 0 ? [] : normalizedText.split(" "),
  };
}

function hasExactTokenSequenceV0_1(
  haystack: readonly string[],
  needle: readonly string[],
  start: number,
): boolean {
  return needle.every((token, offset) => haystack[start + offset] === token);
}

export function findExactCanonicalPropertyMatchesV0_1(
  input: FunctionalOutcomeSourceSenseInputV0_1,
): readonly FunctionalOutcomeObservationV0_1[] {
  const normalizedGlosses = input.glosses.map(normalizedGlossTokensV0_1);

  return FUNCTIONAL_OUTCOME_NORMALIZATION_PROPERTY_IDS_V0_1.flatMap(
    (propertyId) => {
      const propertyTokens = normalizeFunctionalOutcomeMatchingTextV0_1(
        canonicalPropertyIdToMatchingTermV0_1(propertyId),
      ).split(" ");
      const evidenceRefs: FunctionalOutcomeEvidenceRefV0_1[] = [];

      for (const gloss of normalizedGlosses) {
        for (
          let start = 0;
          start <= gloss.tokens.length - propertyTokens.length;
          start += 1
        ) {
          if (!hasExactTokenSequenceV0_1(gloss.tokens, propertyTokens, start)) {
            continue;
          }
          const end = start + propertyTokens.length - 1;
          evidenceRefs.push({
            sourceRecordId: input.sourceRecordId,
            senseId: input.senseId,
            locator: `glosses[${gloss.glossIndex}].tokens[${start}..${end}]`,
            evidenceText: gloss.sourceText,
          });
        }
      }

      return evidenceRefs.length === 0
        ? []
        : [{
            propertyId,
            outcome: "DIRECT_MATCH",
            evidenceRefs,
          }];
    },
  );
}

export type FunctionalOutcomeMatchingEvaluationV0_1 = Readonly<{
  outcomes: readonly FunctionalOutcomeObservationV0_1[];
  reasonCode:
    | "SOURCE_TEXT_INSUFFICIENT"
    | "NO_EXACT_CANONICAL_PROPERTY_TERM"
    | null;
}>;

export function evaluateFunctionalOutcomeMatchingV0_1(
  input: FunctionalOutcomeSourceSenseInputV0_1,
): FunctionalOutcomeMatchingEvaluationV0_1 {
  const usableGlosses = input.glosses.some(
    (gloss) => normalizeFunctionalOutcomeMatchingTextV0_1(gloss).length > 0,
  );
  if (!usableGlosses) {
    return {
      outcomes: [],
      reasonCode: "SOURCE_TEXT_INSUFFICIENT",
    };
  }

  const outcomes = findExactCanonicalPropertyMatchesV0_1(input);
  return {
    outcomes,
    reasonCode: outcomes.length === 0
      ? "NO_EXACT_CANONICAL_PROPERTY_TERM"
      : null,
  };
}
