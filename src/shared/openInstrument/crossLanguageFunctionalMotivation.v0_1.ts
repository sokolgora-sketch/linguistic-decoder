import {
  analyzeStructuralInputV0_2,
  type StructuralVoiceEventV0_2,
} from "@/shared/structuralHypothesisDiscovery.v0_2";
import type { GenericFunctionalWitnessV1 } from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import {
  isInterpretationDecisionPolicyV0_1,
  type InterpretationDecisionPolicyV0_1,
} from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";
import type {
  SingleWordFunctionalMotivationBuildResultV0_1,
  SingleWordFunctionalMotivationProposalV0_1,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";

export type NeutralGenericFunctionalWitnessContextV2 = Readonly<
  Omit<GenericFunctionalWitnessV1, "winnerClaim" | "noSingleWinner"> & {
    interpretationDecisionPolicy: InterpretationDecisionPolicyV0_1;
  }
>;

export type CrossLanguageGenericFunctionalWitnessContextV0_1 =
  | GenericFunctionalWitnessV1
  | NeutralGenericFunctionalWitnessContextV2;

export const CROSS_LANGUAGE_FUNCTIONAL_MOTIVATION_SCHEMA_V0_1 =
  "open-instrument.cross-language-functional-motivation.v0_1" as const;

export const CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1 = [
  {
    operationId: "IDENTITY.v0_1",
    kind: "IDENTITY",
    version: "0.1",
    positionUnit: "none",
    cost: 0,
  },
  {
    operationId: "TRANSPOSE_ADJACENT.v0_1",
    kind: "TRANSPOSE_ADJACENT",
    version: "0.1",
    positionUnit: "zero_based_unicode_code_point",
    cost: 1,
  },
] as const;

export type CrossLanguageOperationDefinitionV0_1 =
  (typeof CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1)[number];
export type CrossLanguageOperationIdV0_1 = CrossLanguageOperationDefinitionV0_1["operationId"];

export type CrossLanguageEvidenceStatusV0_1 =
  | "USER_PROPOSED"
  | "CITATION_ENTERED_UNVERIFIED"
  | "UNKNOWN_OR_NULL";

export type CrossLanguageLinguisticApplicabilityStatusV0_1 = "NOT_ASSESSED";

export type CrossLanguageWitnessInputV0_1 =
  | Readonly<{
      kind: "USER_PROPOSED";
      witnessId: string;
      exactForm: string;
      language: string;
      variety: string;
      proposedMeaning: string;
      evidenceStatus: CrossLanguageEvidenceStatusV0_1;
      evidenceReference: string;
    }>
  | Readonly<{
      kind: "EXISTING_GENERIC_SOURCE_WITNESS";
      witnessId: string;
      genericWitnessId: string;
    }>;

export type CrossLanguageOperationApplicationInputV0_1 = Readonly<{
  applicationId: string;
  operationId: CrossLanguageOperationIdV0_1;
  positions: readonly number[];
}>;

export type CrossLanguageCorrespondenceInputV0_1 = Readonly<{
  relationId: string;
  targetComponentIndex: number;
  witnessId: string;
  proposedRelationship: string;
  applications: readonly CrossLanguageOperationApplicationInputV0_1[];
}>;

export type FunctionalArchitectureContributionInputV0_1 = Readonly<{
  contributionId: string;
  exactForm: string;
  proposedMeaning: string;
  functionalRole: string;
  evidenceStatus: CrossLanguageEvidenceStatusV0_1;
  evidenceReference: string;
}>;

export type FunctionalArchitectureInputV0_1 = Readonly<{
  architectureId: string;
  label: string;
  language: string;
  exactForm: string;
  contributions: readonly FunctionalArchitectureContributionInputV0_1[];
}>;

export type FunctionalArchitectureParallelInputV0_1 = Readonly<{
  parallelId: string;
  architectures: readonly FunctionalArchitectureInputV0_1[];
  proposedSimilarity: string;
  differences: string;
  unresolvedMaterial: string;
}>;

export type CrossLanguageBoundaryOperationWitnessInputV0_1 = Readonly<{
  witnessId: string;
  targetForm: string;
  language: string;
  componentForms: readonly string[];
  rawConcatenation: string;
  boundaryAfterComponentIndex: number;
  boundaryPosition: number;
  affectedInputSpan: Readonly<{ start: number; end: number }>;
  boundaryInput: string;
  boundaryOutput: string;
  declaredResultForm: string;
  linguisticRuleName: string;
  linguisticRuleAttribution: string;
  linguisticRuleReference: string;
  sourceReferences: readonly string[];
  evidenceStatus: CrossLanguageEvidenceStatusV0_1;
  functionalInterpretation: string;
}>;

export type CrossLanguageFunctionalMotivationInputV0_1 = Readonly<{
  targetSense: Readonly<{
    label: string;
    evidenceStatus: CrossLanguageEvidenceStatusV0_1;
    evidenceReference: string;
  }>;
  witnesses: readonly CrossLanguageWitnessInputV0_1[];
  correspondences: readonly CrossLanguageCorrespondenceInputV0_1[];
  proposedSynthesis: string;
  unresolvedMaterial: readonly string[];
  functionalParallel: FunctionalArchitectureParallelInputV0_1 | null;
  sourceWitnesses: readonly CrossLanguageGenericFunctionalWitnessContextV0_1[];
  boundaryOperationWitness?: CrossLanguageBoundaryOperationWitnessInputV0_1 | null;
}>;

export type CrossLanguageFunctionalMotivationOperationApplicationV0_1 = Readonly<{
  applicationId: string;
  sequence: number;
  operationId: CrossLanguageOperationIdV0_1;
  kind: "IDENTITY" | "TRANSPOSE_ADJACENT";
  positions: readonly number[];
  before: string;
  after: string | null;
  cost: number;
  status: "APPLIED" | "REJECTED" | "NOT_RUN";
  reasonCodes: readonly string[];
  voicePathBefore: readonly string[] | null;
  voicePathAfter: readonly string[] | null;
  unresolvedVoices: readonly string[];
}>;

export type CrossLanguageBoundaryOperationWitnessV0_1 = Readonly<{
  witnessId: string;
  targetForm: string;
  language: string;
  positionUnit: "zero_based_unicode_code_point";
  spanConvention: "half_open";
  componentForms: readonly string[];
  rawConcatenation: string;
  boundaryAfterComponentIndex: number;
  boundaryPosition: number;
  boundaryInput: string;
  boundaryOutput: string;
  affectedInputSpan: Readonly<{ start: number; end: number }>;
  affectedOutputSpan: Readonly<{ start: number; end: number }>;
  declaredResultForm: string;
  reconstructedForm: string;
  mechanicalReconstructionStatus: "EXACT_MATCH" | "MISMATCH";
  linguisticRule: Readonly<{
    name: string;
    attribution: string | null;
    reference: string | null;
    evidenceStatus: CrossLanguageEvidenceStatusV0_1;
  }>;
  sourceReferences: readonly string[];
  evidenceStatus: CrossLanguageEvidenceStatusV0_1;
  linguisticApplicabilityStatus: CrossLanguageLinguisticApplicabilityStatusV0_1;
  authority: "USER_DECLARED_UNVERIFIED";
  operationCost: null;
  writtenVoices: Readonly<{
    status: "COMPLETE" | "UNKNOWN_OR_NULL";
    path: readonly string[];
    events: readonly StructuralVoiceEventV0_2[];
    unresolvedReason: string | null;
  }>;
  unresolvedVoices: readonly string[];
  functionalInterpretation: Readonly<{
    text: string | null;
    status: "USER_PROPOSED" | "UNKNOWN_OR_NULL";
  }>;
  sourceAuthorityPromotion: "NONE";
}>;

export type CrossLanguageFunctionalMotivationV0_1 = Readonly<{
  schemaVersion: typeof CROSS_LANGUAGE_FUNCTIONAL_MOTIVATION_SCHEMA_V0_1;
  target: SingleWordFunctionalMotivationProposalV0_1["target"] & Readonly<{
    sense: Readonly<{
      label: string | null;
      evidenceStatus: CrossLanguageEvidenceStatusV0_1;
      evidenceReference: string | null;
    }>;
  }>;
  targetComponents: readonly Readonly<{
    componentId: string;
    segmentIndex: number;
    exactSpelling: string;
    language: string;
    dialect: string | null;
    targetCodePointSpan: Readonly<{ start: number; end: number }> | null;
    proposedMeaning: string | null;
    evidenceStatus: CrossLanguageEvidenceStatusV0_1;
    voiceAttributionStatus: "ATTRIBUTED" | "UNKNOWN_OR_NULL";
    voiceAttributionReasonCodes: readonly string[];
    voiceEvents: readonly StructuralVoiceEventV0_2[];
    unresolved: boolean;
  }>[];
  targetWrittenVoices: Readonly<{
    status: "COMPLETE" | "UNKNOWN_OR_NULL";
    path: readonly string[];
    events: readonly StructuralVoiceEventV0_2[];
    unresolvedReason: string | null;
  }>;
  witnesses: readonly Readonly<{
    witnessId: string;
    kind: "USER_PROPOSED" | "EXISTING_GENERIC_SOURCE_WITNESS";
    exactForm: string;
    language: string;
    variety: string | null;
    proposedMeaning: string | null;
    evidenceStatus: CrossLanguageEvidenceStatusV0_1 | "SOURCE_RECORD_ONLY";
    evidenceReference: string | null;
    sourceRecord: Readonly<{
      genericWitnessId: string;
      sourceId: string;
      sourceStatus: string;
      attestationTruth: string;
      citationRefs: readonly string[];
      functionalCorrespondence: "NOT_EVALUATED";
      sourceAttestation: "SOURCE_RECORD_ONLY";
    }> | null;
    writtenVoices: Readonly<{
      status: "COMPLETE" | "UNKNOWN_OR_NULL";
      path: readonly string[];
      events: readonly StructuralVoiceEventV0_2[];
      unresolvedReason: string | null;
    }>;
  }>[];
  correspondences: readonly Readonly<{
    relationId: string;
    targetComponentId: string;
    targetComponentForm: string;
    witnessId: string;
    witnessForm: string;
    proposedRelationship: string;
    input: string;
    output: string;
    exactFormMatch: boolean;
    formStatus: "EXACT_MATCH" | "MISMATCH";
    applications: readonly CrossLanguageFunctionalMotivationOperationApplicationV0_1[];
    operationCount: number;
    totalCost: number;
    independentVerifiedCorrespondenceCount: 0;
    authority: "USER_DECLARED_UNVERIFIED";
    linguisticValidity: "NOT_ASSESSED";
    voiceConservation: "PRESERVED" | "CHANGED" | "UNKNOWN_OR_NULL";
    unresolvedVoices: readonly string[];
  }>[];
  functionalSynthesis: Readonly<{
    text: string | null;
    status: "EXPLORATORY_HYPOTHESIS" | "UNKNOWN_OR_NULL";
  }>;
  unresolvedMaterial: readonly string[];
  functionalParallel: Readonly<{
    parallelId: string;
    status: "USER_PROPOSED" | "UNKNOWN_OR_NULL";
    architectures: readonly Readonly<{
      architectureId: string;
      label: string;
      language: string;
      exactForm: string;
      contributions: readonly FunctionalArchitectureContributionInputV0_1[];
      writtenVoices: Readonly<{
        status: "COMPLETE" | "UNKNOWN_OR_NULL";
        path: readonly string[];
        events: readonly StructuralVoiceEventV0_2[];
        unresolvedReason: string | null;
      }>;
    }>[];
    proposedSimilarity: string | null;
    differences: string | null;
    unresolvedMaterial: readonly string[];
    relationshipAuthority: "USER_PROPOSED";
    historicalRelation: "NOT_CLAIMED";
    automaticSemanticEvaluation: "NOT_PERFORMED";
  }> | null;
  boundaryOperationWitness?: CrossLanguageBoundaryOperationWitnessV0_1;
  strictEmbryoMeaning: Readonly<{ status: "UNKNOWN_OR_NULL"; meaning: null }>;
  sourceAuthorityPromotion: "NONE";
  historicalOrigin: "NOT_CLAIMED";
  selection: Readonly<{
    mode: "no_single_winner";
    selectedCandidateId: null;
    userDecisionPosture: "user_decides";
  }>;
}>;

export type CrossLanguageFunctionalMotivationBuildResultV0_1 =
  | Readonly<{ status: "READY"; proposal: CrossLanguageFunctionalMotivationV0_1 }>
  | Readonly<{ status: "INVALID"; reasonCodes: readonly string[] }>;

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function exactToken(value: unknown, limit = 80): value is string {
  return isNonEmpty(value) && !/\s/u.test(value) && Array.from(value).length <= limit;
}

function isEvidenceStatus(value: unknown): value is CrossLanguageEvidenceStatusV0_1 {
  return value === "USER_PROPOSED" || value === "CITATION_ENTERED_UNVERIFIED" || value === "UNKNOWN_OR_NULL";
}

function isOperationId(value: unknown): value is CrossLanguageOperationIdV0_1 {
  return value === "IDENTITY.v0_1" || value === "TRANSPOSE_ADJACENT.v0_1";
}

function cloneVoiceEvent(event: StructuralVoiceEventV0_2): StructuralVoiceEventV0_2 {
  return { ...event, sourceSpan: { ...event.sourceSpan } };
}

function projectWrittenVoices(form: string): Readonly<{
  status: "COMPLETE" | "UNKNOWN_OR_NULL";
  path: readonly string[];
  events: readonly StructuralVoiceEventV0_2[];
  unresolvedReason: string | null;
}> {
  // Preserve unsupported foreign orthography (including Sanskrit vowel-length marks)
  // without silently coercing it into the canonical written Seven Voices.
  if (!Array.from(form).every((character) => /\s/u.test(character) || /^[A-Za-zÇçËë]$/u.test(character))) {
    return {
      status: "UNKNOWN_OR_NULL",
      path: [],
      events: [],
      unresolvedReason: "FOREIGN_ORTHOGRAPHY_NOT_PROJECTED_TO_CANONICAL_WRITTEN_VOICES",
    };
  }
  const analysis = analyzeStructuralInputV0_2(form);
  if (analysis.inputVoiceSequenceStatus !== "complete") {
    return {
      status: "UNKNOWN_OR_NULL",
      path: [],
      events: [],
      unresolvedReason: analysis.inputVoiceSequenceStatus,
    };
  }
  const events = analysis.inputVoiceEvents.map(cloneVoiceEvent);
  return { status: "COMPLETE", path: events.map((event) => event.voice), events, unresolvedReason: null };
}

function isCombiningMark(value: string | undefined): boolean {
  return value !== undefined && /^\p{M}$/u.test(value);
}

function validateBoundaryOperationWitness(value: unknown): string[] {
  if (value === undefined || value === null) return [];
  if (!isRecord(value)) return ["BOUNDARY_WITNESS_MALFORMED"];
  const reasons: string[] = [];
  if (!isNonEmpty(value.witnessId) || value.witnessId.length > 100) reasons.push("BOUNDARY_WITNESS_ID_REQUIRED");
  if (!exactToken(value.targetForm, 120)) reasons.push("BOUNDARY_WITNESS_TARGET_FORM_REQUIRED");
  if (!isNonEmpty(value.language) || value.language.length > 100) reasons.push("BOUNDARY_WITNESS_LANGUAGE_REQUIRED");
  if (!Array.isArray(value.componentForms) || value.componentForms.length < 2 || value.componentForms.length > 8) {
    reasons.push("BOUNDARY_WITNESS_TWO_TO_EIGHT_COMPONENTS_REQUIRED");
  } else if (value.componentForms.some((form) => !exactToken(form, 120))) {
    reasons.push("BOUNDARY_WITNESS_COMPONENT_FORMS_MUST_BE_EXACT_TOKENS");
  }
  if (!exactToken(value.rawConcatenation, 960)) reasons.push("BOUNDARY_WITNESS_RAW_CONCATENATION_REQUIRED");
  if (Array.isArray(value.componentForms) && value.componentForms.every((form) => exactToken(form, 120)) &&
    typeof value.rawConcatenation === "string" && value.rawConcatenation !== value.componentForms.join("")) {
    reasons.push("BOUNDARY_WITNESS_RAW_CONCATENATION_MISMATCH");
  }
  if (!Number.isInteger(value.boundaryAfterComponentIndex) || (value.boundaryAfterComponentIndex as number) < 0 ||
    !Array.isArray(value.componentForms) || (value.boundaryAfterComponentIndex as number) >= value.componentForms.length - 1) {
    reasons.push("BOUNDARY_WITNESS_COMPONENT_BOUNDARY_INDEX_INVALID");
  }
  if (!Number.isInteger(value.boundaryPosition) || (value.boundaryPosition as number) < 1) {
    reasons.push("BOUNDARY_WITNESS_CODE_POINT_POSITION_INVALID");
  }
  if (Array.isArray(value.componentForms) && value.componentForms.every((form) => exactToken(form, 120)) &&
    Number.isInteger(value.boundaryAfterComponentIndex) && (value.boundaryAfterComponentIndex as number) >= 0 &&
    (value.boundaryAfterComponentIndex as number) < value.componentForms.length - 1) {
    const expectedPosition = value.componentForms.slice(0, (value.boundaryAfterComponentIndex as number) + 1)
      .reduce((sum: number, form) => sum + Array.from(form).length, 0);
    if (value.boundaryPosition !== expectedPosition) reasons.push("BOUNDARY_WITNESS_CODE_POINT_POSITION_MISMATCH");
  }

  const rawCharacters = typeof value.rawConcatenation === "string" ? Array.from(value.rawConcatenation) : [];
  const span = value.affectedInputSpan;
  let validSpan: Readonly<{ start: number; end: number }> | null = null;
  if (!isRecord(span) || !Number.isInteger(span.start) || !Number.isInteger(span.end) ||
    (span.start as number) < 0 || (span.end as number) <= (span.start as number) || (span.end as number) > rawCharacters.length) {
    reasons.push("BOUNDARY_WITNESS_INPUT_SPAN_INVALID");
  } else {
    validSpan = { start: span.start as number, end: span.end as number };
    if (Number.isInteger(value.boundaryPosition) &&
      !(validSpan.start < (value.boundaryPosition as number) && validSpan.end > (value.boundaryPosition as number))) {
      reasons.push("BOUNDARY_WITNESS_INPUT_SPAN_MUST_COVER_BOUNDARY");
    }
    if (rawCharacters[validSpan.start] && isCombiningMark(rawCharacters[validSpan.start])) {
      reasons.push("BOUNDARY_WITNESS_INPUT_SPAN_SPLITS_COMBINING_SEQUENCE");
    }
    if (rawCharacters[validSpan.end] && isCombiningMark(rawCharacters[validSpan.end])) {
      reasons.push("BOUNDARY_WITNESS_INPUT_SPAN_SPLITS_COMBINING_SEQUENCE");
    }
  }
  if (!exactToken(value.boundaryInput, 80)) reasons.push("BOUNDARY_WITNESS_INPUT_REQUIRED");
  else if (validSpan && value.boundaryInput !== rawCharacters.slice(validSpan.start, validSpan.end).join("")) {
    reasons.push("BOUNDARY_WITNESS_INPUT_SPAN_TEXT_MISMATCH");
  }
  if (typeof value.boundaryPosition === "number" && isCombiningMark(rawCharacters[value.boundaryPosition])) {
    reasons.push("BOUNDARY_WITNESS_BOUNDARY_SPLITS_COMBINING_SEQUENCE");
  }
  if (!exactToken(value.boundaryOutput, 80)) reasons.push("BOUNDARY_WITNESS_OUTPUT_REQUIRED");
  else if (typeof value.boundaryInput === "string" && value.boundaryInput === value.boundaryOutput) {
    reasons.push("BOUNDARY_WITNESS_OPERATION_MUST_CHANGE_BOUNDARY_MATERIAL");
  }
  if (!exactToken(value.declaredResultForm, 120)) reasons.push("BOUNDARY_WITNESS_DECLARED_RESULT_REQUIRED");
  if (!isNonEmpty(value.linguisticRuleName) || value.linguisticRuleName.length > 200) reasons.push("BOUNDARY_WITNESS_RULE_NAME_REQUIRED");
  if (typeof value.linguisticRuleAttribution !== "string" || value.linguisticRuleAttribution.length > 300) reasons.push("BOUNDARY_WITNESS_RULE_ATTRIBUTION_MALFORMED");
  if (typeof value.linguisticRuleReference !== "string" || value.linguisticRuleReference.length > 1000) reasons.push("BOUNDARY_WITNESS_RULE_REFERENCE_MALFORMED");
  if (!Array.isArray(value.sourceReferences) || value.sourceReferences.length > 12 ||
    value.sourceReferences.some((reference) => !isNonEmpty(reference) || reference.length > 1000)) {
    reasons.push("BOUNDARY_WITNESS_SOURCE_REFERENCES_MALFORMED");
  }
  if (!isEvidenceStatus(value.evidenceStatus)) reasons.push("BOUNDARY_WITNESS_EVIDENCE_STATUS_UNSUPPORTED");
  else if (value.evidenceStatus === "CITATION_ENTERED_UNVERIFIED" &&
    !((Array.isArray(value.sourceReferences) && value.sourceReferences.some(isNonEmpty)) ||
      (typeof value.linguisticRuleReference === "string" && isNonEmpty(value.linguisticRuleReference)))) {
    reasons.push("BOUNDARY_WITNESS_UNVERIFIED_CITATION_REQUIRED");
  }
  if (typeof value.functionalInterpretation !== "string" || value.functionalInterpretation.length > 1000) {
    reasons.push("BOUNDARY_WITNESS_FUNCTIONAL_INTERPRETATION_MALFORMED");
  }

  if (validSpan && typeof value.boundaryOutput === "string" && exactToken(value.boundaryOutput, 80) &&
    rawCharacters.length > 0) {
    const reconstructed = [
      ...rawCharacters.slice(0, validSpan.start),
      ...Array.from(value.boundaryOutput),
      ...rawCharacters.slice(validSpan.end),
    ].join("");
    if (typeof value.declaredResultForm === "string" && exactToken(value.declaredResultForm, 120) &&
      reconstructed !== value.declaredResultForm) {
      reasons.push("BOUNDARY_WITNESS_DECLARED_RESULT_MISMATCH");
    }
  }
  return [...new Set(reasons)];
}

function buildBoundaryOperationWitness(
  value: CrossLanguageBoundaryOperationWitnessInputV0_1 | null | undefined,
): CrossLanguageBoundaryOperationWitnessV0_1 | undefined {
  if (!value) return undefined;
  const rawCharacters = Array.from(value.rawConcatenation);
  const span = value.affectedInputSpan;
  const outputCharacters = Array.from(value.boundaryOutput);
  const reconstructedForm = [
    ...rawCharacters.slice(0, span.start),
    ...outputCharacters,
    ...rawCharacters.slice(span.end),
  ].join("");
  const writtenVoices = projectWrittenVoices(reconstructedForm);
  return {
    witnessId: value.witnessId,
    targetForm: value.targetForm,
    language: value.language,
    positionUnit: "zero_based_unicode_code_point",
    spanConvention: "half_open",
    componentForms: [...value.componentForms],
    rawConcatenation: value.rawConcatenation,
    boundaryAfterComponentIndex: value.boundaryAfterComponentIndex,
    boundaryPosition: value.boundaryPosition,
    boundaryInput: value.boundaryInput,
    boundaryOutput: value.boundaryOutput,
    affectedInputSpan: { ...span },
    affectedOutputSpan: { start: span.start, end: span.start + outputCharacters.length },
    declaredResultForm: value.declaredResultForm,
    reconstructedForm,
    mechanicalReconstructionStatus: reconstructedForm === value.targetForm ? "EXACT_MATCH" : "MISMATCH",
    linguisticRule: {
      name: value.linguisticRuleName,
      attribution: value.linguisticRuleAttribution.trim() || null,
      reference: value.linguisticRuleReference.trim() || null,
      evidenceStatus: value.evidenceStatus,
    },
    sourceReferences: [...value.sourceReferences],
    evidenceStatus: value.evidenceStatus,
    linguisticApplicabilityStatus: "NOT_ASSESSED",
    authority: "USER_DECLARED_UNVERIFIED",
    operationCost: null,
    writtenVoices,
    unresolvedVoices: writtenVoices.status === "COMPLETE" ? [] : [writtenVoices.unresolvedReason ?? "VOICE_PATH_UNKNOWN"],
    functionalInterpretation: {
      text: value.functionalInterpretation.trim() || null,
      status: value.functionalInterpretation.trim() ? "USER_PROPOSED" : "UNKNOWN_OR_NULL",
    },
    sourceAuthorityPromotion: "NONE",
  };
}

function validateOperationApplication(value: unknown, index: number): string[] {
  const prefix = `APPLICATION_${index + 1}`;
  if (!isRecord(value)) return [`${prefix}_MALFORMED`];
  const reasons: string[] = [];
  if (!isNonEmpty(value.applicationId) || value.applicationId.length > 100) reasons.push(`${prefix}_ID_REQUIRED`);
  if (!isOperationId(value.operationId)) reasons.push(`${prefix}_OPERATION_UNSUPPORTED`);
  if (!Array.isArray(value.positions)) reasons.push(`${prefix}_POSITIONS_REQUIRED`);
  else if (value.operationId === "IDENTITY.v0_1" && value.positions.length !== 0) {
    reasons.push(`${prefix}_IDENTITY_TAKES_NO_POSITIONS`);
  } else if (value.operationId === "TRANSPOSE_ADJACENT.v0_1") {
    const positions = value.positions;
    if (positions.length !== 2 || !positions.every(Number.isInteger)) {
      reasons.push(`${prefix}_TWO_INTEGER_CODE_POINT_POSITIONS_REQUIRED`);
    } else if ((positions[1] as number) !== (positions[0] as number) + 1) {
      reasons.push(`${prefix}_POSITIONS_MUST_BE_ADJACENT_AND_ORDERED`);
    }
  }
  return reasons;
}

export function replayCrossLanguageOperationSequenceV0_1(
  initialForm: string,
  applications: readonly CrossLanguageOperationApplicationInputV0_1[],
): Readonly<{
  status: "EXAMINED" | "REJECTED";
  input: string;
  output: string;
  applications: readonly CrossLanguageFunctionalMotivationOperationApplicationV0_1[];
  operationCount: number;
  totalCost: number;
  reasonCodes: readonly string[];
}> {
  const rootReasons: string[] = [];
  if (!exactToken(initialForm)) rootReasons.push("CORRESPONDENCE_INPUT_MUST_BE_ONE_EXACT_TOKEN_UP_TO_80_CODE_POINTS");
  if (!Array.isArray(applications) || applications.length > 8) rootReasons.push("ZERO_TO_EIGHT_APPLICATIONS_REQUIRED");
  if (rootReasons.length) {
    return { status: "REJECTED", input: typeof initialForm === "string" ? initialForm : "", output: typeof initialForm === "string" ? initialForm : "", applications: [], operationCount: 0, totalCost: 0, reasonCodes: rootReasons };
  }

  const ids = new Set<string>();
  for (const [index, application] of applications.entries()) {
    rootReasons.push(...validateOperationApplication(application, index));
    if (isRecord(application) && typeof application.applicationId === "string") {
      if (ids.has(application.applicationId)) rootReasons.push(`APPLICATION_${index + 1}_ID_DUPLICATED`);
      ids.add(application.applicationId);
    }
  }
  if (rootReasons.length) {
    return { status: "REJECTED", input: initialForm, output: initialForm, applications: [], operationCount: 0, totalCost: 0, reasonCodes: [...new Set(rootReasons)] };
  }

  let current = initialForm;
  let failed = false;
  const results: CrossLanguageFunctionalMotivationOperationApplicationV0_1[] = [];
  for (const [index, application] of applications.entries()) {
    const definition = CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1.find((item) => item.operationId === application.operationId)!;
    const before = current;
    const beforeVoices = projectWrittenVoices(before);
    const reasonCodes: string[] = [];
    let after: string | null = null;
    if (failed) {
      results.push({
        applicationId: application.applicationId,
        sequence: index + 1,
        operationId: application.operationId,
        kind: definition.kind,
        positions: [...application.positions],
        before,
        after: null,
        cost: definition.cost,
        status: "NOT_RUN",
        reasonCodes: ["PREVIOUS_APPLICATION_REJECTED"],
        voicePathBefore: beforeVoices.status === "COMPLETE" ? beforeVoices.path : null,
        voicePathAfter: null,
        unresolvedVoices: beforeVoices.status === "COMPLETE" ? [] : [beforeVoices.unresolvedReason ?? "VOICE_PATH_UNKNOWN"],
      });
      continue;
    }

    if (application.operationId === "IDENTITY.v0_1") {
      after = before;
    } else {
      const [left, right] = application.positions;
      const characters = Array.from(before);
      if (left === undefined || right === undefined || left < 0 || right >= characters.length) {
        reasonCodes.push("TRANSPOSE_POSITION_OUT_OF_RANGE");
      } else if (isCombiningMark(characters[left]) || isCombiningMark(characters[right]) ||
        isCombiningMark(characters[left - 1]) || isCombiningMark(characters[right + 1])) {
        reasonCodes.push("TRANSPOSE_WOULD_SPLIT_UNICODE_COMBINING_SEQUENCE");
      } else {
        [characters[left], characters[right]] = [characters[right]!, characters[left]!];
        after = characters.join("");
      }
    }

    if (reasonCodes.length || after === null) {
      failed = true;
      results.push({
        applicationId: application.applicationId,
        sequence: index + 1,
        operationId: application.operationId,
        kind: definition.kind,
        positions: [...application.positions],
        before,
        after: null,
        cost: definition.cost,
        status: "REJECTED",
        reasonCodes: reasonCodes.length ? reasonCodes : ["OPERATION_COULD_NOT_BE_APPLIED"],
        voicePathBefore: beforeVoices.status === "COMPLETE" ? beforeVoices.path : null,
        voicePathAfter: null,
        unresolvedVoices: beforeVoices.status === "COMPLETE" ? [] : [beforeVoices.unresolvedReason ?? "VOICE_PATH_UNKNOWN"],
      });
      continue;
    }

    const afterVoices = projectWrittenVoices(after);
    const unresolvedVoices = beforeVoices.status === "COMPLETE" && afterVoices.status === "COMPLETE"
      ? (JSON.stringify(beforeVoices.path) === JSON.stringify(afterVoices.path)
        ? []
        : [`BEFORE:${beforeVoices.path.join("→")}`, `AFTER:${afterVoices.path.join("→")}`])
      : [beforeVoices.unresolvedReason ?? afterVoices.unresolvedReason ?? "VOICE_PATH_UNKNOWN"];
    results.push({
      applicationId: application.applicationId,
      sequence: index + 1,
      operationId: application.operationId,
      kind: definition.kind,
      positions: [...application.positions],
      before,
      after,
      cost: definition.cost,
      status: "APPLIED",
      reasonCodes: [],
      voicePathBefore: beforeVoices.status === "COMPLETE" ? beforeVoices.path : null,
      voicePathAfter: afterVoices.status === "COMPLETE" ? afterVoices.path : null,
      unresolvedVoices,
    });
    current = after;
  }

  const reasonCodes = failed ? ["ONE_OR_MORE_APPLICATIONS_REJECTED; LATER_APPLICATIONS_NOT_APPLIED"] : [];
  return {
    status: failed ? "REJECTED" : "EXAMINED",
    input: initialForm,
    output: current,
    applications: results,
    operationCount: results.filter((item) => item.status === "APPLIED").length,
    totalCost: results.filter((item) => item.status === "APPLIED").reduce((sum, item) => sum + item.cost, 0),
    reasonCodes,
  };
}

function validateParallel(value: unknown): string[] {
  if (value === null) return [];
  if (!isRecord(value)) return ["FUNCTIONAL_PARALLEL_MALFORMED"];
  const reasons: string[] = [];
  if (!isNonEmpty(value.parallelId) || value.parallelId.length > 100) reasons.push("PARALLEL_ID_REQUIRED");
  if (!Array.isArray(value.architectures) || value.architectures.length !== 2) {
    reasons.push("EXACTLY_TWO_FUNCTIONAL_ARCHITECTURES_REQUIRED");
  } else {
    const architectureIds = new Set<string>();
    for (const [architectureIndex, architecture] of value.architectures.entries()) {
      const prefix = `ARCHITECTURE_${architectureIndex + 1}`;
      if (!isRecord(architecture)) {
        reasons.push(`${prefix}_MALFORMED`);
        continue;
      }
      for (const field of ["architectureId", "label", "language", "exactForm"] as const) {
        if (!isNonEmpty(architecture[field]) || architecture[field].length > 200) reasons.push(`${prefix}_${field.toUpperCase()}_REQUIRED`);
      }
      if (typeof architecture.architectureId === "string") {
        if (architectureIds.has(architecture.architectureId)) reasons.push(`${prefix}_ID_DUPLICATED`);
        architectureIds.add(architecture.architectureId);
      }
      if (!Array.isArray(architecture.contributions) || architecture.contributions.length < 1 || architecture.contributions.length > 8) {
        reasons.push(`${prefix}_ONE_TO_EIGHT_CONTRIBUTIONS_REQUIRED`);
      } else {
        const contributionIds = new Set<string>();
        for (const [contributionIndex, contribution] of architecture.contributions.entries()) {
          const itemPrefix = `${prefix}_CONTRIBUTION_${contributionIndex + 1}`;
          if (!isRecord(contribution)) {
            reasons.push(`${itemPrefix}_MALFORMED`);
            continue;
          }
          if (!isNonEmpty(contribution.contributionId) || contribution.contributionId.length > 100) reasons.push(`${itemPrefix}_ID_REQUIRED`);
          else if (contributionIds.has(contribution.contributionId)) reasons.push(`${itemPrefix}_ID_DUPLICATED`);
          else contributionIds.add(contribution.contributionId);
          if (!isNonEmpty(contribution.exactForm) || Array.from(contribution.exactForm).length > 120) reasons.push(`${itemPrefix}_EXACT_FORM_REQUIRED`);
          if (typeof contribution.proposedMeaning !== "string" || contribution.proposedMeaning.length > 300) reasons.push(`${itemPrefix}_MEANING_MALFORMED`);
          if (typeof contribution.functionalRole !== "string" || contribution.functionalRole.length > 200) reasons.push(`${itemPrefix}_ROLE_MALFORMED`);
          if (!isEvidenceStatus(contribution.evidenceStatus)) reasons.push(`${itemPrefix}_EVIDENCE_STATUS_UNSUPPORTED`);
          if (typeof contribution.evidenceReference !== "string" || contribution.evidenceReference.length > 500) reasons.push(`${itemPrefix}_EVIDENCE_REFERENCE_MALFORMED`);
          else if (contribution.evidenceStatus === "CITATION_ENTERED_UNVERIFIED" && !isNonEmpty(contribution.evidenceReference)) {
            reasons.push(`${itemPrefix}_UNVERIFIED_CITATION_REQUIRED`);
          }
        }
      }
    }
  }
  for (const field of ["proposedSimilarity", "differences", "unresolvedMaterial"] as const) {
    if (typeof value[field] !== "string" || value[field].length > 1000) reasons.push(`PARALLEL_${field.toUpperCase()}_MALFORMED`);
  }
  return reasons;
}

function validateSourceWitnessContext(value: unknown): string[] {
  if (!Array.isArray(value)) return ["SOURCE_WITNESS_CONTEXT_MALFORMED"];
  const reasons: string[] = [];
  const witnessIds = new Set<string>();
  for (const [index, witness] of value.entries()) {
    const prefix = `SOURCE_WITNESS_${index + 1}`;
    if (!isRecord(witness)) {
      reasons.push(`${prefix}_MALFORMED`);
      continue;
    }
    if (!isNonEmpty(witness.witnessId) || witness.witnessId.length > 200) reasons.push(`${prefix}_ID_REQUIRED`);
    else if (witnessIds.has(witness.witnessId)) reasons.push(`${prefix}_ID_DUPLICATED`);
    else witnessIds.add(witness.witnessId);
    for (const field of ["sourceId", "language", "sourceForm", "gloss"] as const) {
      if (!isNonEmpty(witness[field]) || witness[field].length > 500) reasons.push(`${prefix}_${field.toUpperCase()}_REQUIRED`);
    }
    if (!Array.isArray(witness.citationRefs) || witness.citationRefs.length === 0 ||
      witness.citationRefs.some((reference) => !isNonEmpty(reference) || reference.length > 1000)) {
      reasons.push(`${prefix}_CITATION_REFS_REQUIRED`);
    }
    if (witness.languageVariety !== undefined && witness.languageVariety !== null &&
      (typeof witness.languageVariety !== "string" || witness.languageVariety.length > 200)) {
      reasons.push(`${prefix}_LANGUAGE_VARIETY_MALFORMED`);
    }
    if (witness.sourceFormNormalization !== "EXACT_PRESERVED") reasons.push(`${prefix}_SOURCE_FORM_NOT_EXACT_PRESERVED`);
    if (witness.sourceStatus !== "research_candidate" && witness.sourceStatus !== "reviewed_candidate") reasons.push(`${prefix}_SOURCE_STATUS_UNSUPPORTED`);
    if (witness.attestationTruth !== "fact" && witness.attestationTruth !== "inference" &&
      witness.attestationTruth !== "hypothesis" && witness.attestationTruth !== "unknown") {
      reasons.push(`${prefix}_ATTESTATION_TRUTH_UNSUPPORTED`);
    }
    if (witness.sourceAttestation !== "SOURCE_RECORD_ONLY") reasons.push(`${prefix}_SOURCE_ATTESTATION_UNSUPPORTED`);
    if (witness.functionalCorrespondence !== "NOT_EVALUATED") reasons.push(`${prefix}_FUNCTIONAL_CORRESPONDENCE_ALREADY_EVALUATED`);
    const hasNeutralPolicy = Object.prototype.hasOwnProperty.call(
      witness,
      "interpretationDecisionPolicy",
    );
    const hasLegacyPolicyFields =
      Object.prototype.hasOwnProperty.call(witness, "winnerClaim") ||
      Object.prototype.hasOwnProperty.call(witness, "noSingleWinner");
    const decisionBoundaryIsValid = hasNeutralPolicy
      ? !hasLegacyPolicyFields &&
        isInterpretationDecisionPolicyV0_1(witness.interpretationDecisionPolicy)
      : witness.winnerClaim === "NOT_CLAIMED" && witness.noSingleWinner === true;
    if (witness.targetMeaning !== "NOT_CLAIMED" || witness.historicalRelation !== "NOT_CLAIMED" ||
      witness.languageSuperiorityClaim !== "NOT_CLAIMED" ||
      witness.userDecisionPosture !== "user_decides" || !decisionBoundaryIsValid) {
      reasons.push(`${prefix}_GENERIC_WITNESS_CLAIM_BOUNDARY_INVALID`);
    }
  }
  return reasons;
}

function buildParallel(value: FunctionalArchitectureParallelInputV0_1 | null) {
  if (!value) return null;
  const architectures = value.architectures.map((architecture) => {
    const voices = projectWrittenVoices(architecture.exactForm);
    return {
      architectureId: architecture.architectureId,
      label: architecture.label,
      language: architecture.language,
      exactForm: architecture.exactForm,
      contributions: architecture.contributions.map((contribution) => ({ ...contribution })),
      writtenVoices: voices,
    };
  });
  return {
    parallelId: value.parallelId,
    status: value.proposedSimilarity.trim() || value.differences.trim() ? "USER_PROPOSED" as const : "UNKNOWN_OR_NULL" as const,
    architectures,
    proposedSimilarity: value.proposedSimilarity.trim() || null,
    differences: value.differences.trim() || null,
    unresolvedMaterial: value.unresolvedMaterial.trim() ? [value.unresolvedMaterial.trim()] : [],
    relationshipAuthority: "USER_PROPOSED" as const,
    historicalRelation: "NOT_CLAIMED" as const,
    automaticSemanticEvaluation: "NOT_PERFORMED" as const,
  };
}

function validateInput(value: unknown): string[] {
  if (!isRecord(value)) return ["INPUT_MUST_BE_OBJECT"];
  const reasons: string[] = [];
  if (!isRecord(value.targetSense)) reasons.push("TARGET_SENSE_MALFORMED");
  else {
    if (typeof value.targetSense.label !== "string" || value.targetSense.label.length > 300) reasons.push("TARGET_SENSE_LABEL_MALFORMED");
    if (!isEvidenceStatus(value.targetSense.evidenceStatus)) reasons.push("TARGET_SENSE_EVIDENCE_STATUS_UNSUPPORTED");
    if (typeof value.targetSense.evidenceReference !== "string" || value.targetSense.evidenceReference.length > 500) reasons.push("TARGET_SENSE_REFERENCE_MALFORMED");
    else if (value.targetSense.evidenceStatus === "CITATION_ENTERED_UNVERIFIED" && !isNonEmpty(value.targetSense.evidenceReference)) reasons.push("TARGET_SENSE_UNVERIFIED_CITATION_REQUIRED");
  }
  if (!Array.isArray(value.witnesses) || value.witnesses.length > 12) reasons.push("ZERO_TO_TWELVE_WITNESSES_REQUIRED");
  else {
    const witnessIds = new Set<string>();
    for (const [index, witness] of value.witnesses.entries()) {
      const prefix = `WITNESS_${index + 1}`;
      if (!isRecord(witness)) {
        reasons.push(`${prefix}_MALFORMED`);
        continue;
      }
      if (!isNonEmpty(witness.witnessId) || witness.witnessId.length > 100) reasons.push(`${prefix}_ID_REQUIRED`);
      else if (witnessIds.has(witness.witnessId)) reasons.push(`${prefix}_ID_DUPLICATED`);
      else witnessIds.add(witness.witnessId);
      if (witness.kind === "USER_PROPOSED") {
        if (!exactToken(witness.exactForm)) reasons.push(`${prefix}_EXACT_FORM_REQUIRED`);
        if (!isNonEmpty(witness.language) || witness.language.length > 100) reasons.push(`${prefix}_LANGUAGE_REQUIRED`);
        if (typeof witness.variety !== "string" || witness.variety.length > 100) reasons.push(`${prefix}_VARIETY_MALFORMED`);
        if (typeof witness.proposedMeaning !== "string" || witness.proposedMeaning.length > 300) reasons.push(`${prefix}_MEANING_MALFORMED`);
        if (!isEvidenceStatus(witness.evidenceStatus)) reasons.push(`${prefix}_EVIDENCE_STATUS_UNSUPPORTED`);
        if (typeof witness.evidenceReference !== "string" || witness.evidenceReference.length > 500) reasons.push(`${prefix}_REFERENCE_MALFORMED`);
        else if (witness.evidenceStatus === "CITATION_ENTERED_UNVERIFIED" && !isNonEmpty(witness.evidenceReference)) reasons.push(`${prefix}_UNVERIFIED_CITATION_REQUIRED`);
      } else if (witness.kind === "EXISTING_GENERIC_SOURCE_WITNESS") {
        if (!isNonEmpty(witness.genericWitnessId) || witness.genericWitnessId.length > 200) reasons.push(`${prefix}_GENERIC_WITNESS_REFERENCE_REQUIRED`);
      } else reasons.push(`${prefix}_KIND_UNSUPPORTED`);
    }
  }
  if (!Array.isArray(value.correspondences) || value.correspondences.length > 12) reasons.push("ZERO_TO_TWELVE_CORRESPONDENCES_REQUIRED");
  else {
    const relationIds = new Set<string>();
    for (const [index, relation] of value.correspondences.entries()) {
      const prefix = `CORRESPONDENCE_${index + 1}`;
      if (!isRecord(relation)) {
        reasons.push(`${prefix}_MALFORMED`);
        continue;
      }
      if (!isNonEmpty(relation.relationId) || relation.relationId.length > 100) reasons.push(`${prefix}_ID_REQUIRED`);
      else if (relationIds.has(relation.relationId)) reasons.push(`${prefix}_ID_DUPLICATED`);
      else relationIds.add(relation.relationId);
      if (!Number.isInteger(relation.targetComponentIndex) || (relation.targetComponentIndex as number) < 0) reasons.push(`${prefix}_TARGET_COMPONENT_INDEX_INVALID`);
      if (!isNonEmpty(relation.witnessId) || relation.witnessId.length > 100) reasons.push(`${prefix}_WITNESS_REFERENCE_REQUIRED`);
      if (typeof relation.proposedRelationship !== "string" || relation.proposedRelationship.length > 500) reasons.push(`${prefix}_RELATIONSHIP_MALFORMED`);
      if (!Array.isArray(relation.applications) || relation.applications.length > 8) reasons.push(`${prefix}_ZERO_TO_EIGHT_APPLICATIONS_REQUIRED`);
      else {
        const appIds = new Set<string>();
        relation.applications.forEach((application, applicationIndex) => {
          reasons.push(...validateOperationApplication(application, applicationIndex).map((reason) => `${prefix}_${reason}`));
          if (isRecord(application) && typeof application.applicationId === "string") {
            if (appIds.has(application.applicationId)) reasons.push(`${prefix}_APPLICATION_${applicationIndex + 1}_ID_DUPLICATED`);
            appIds.add(application.applicationId);
          }
        });
      }
    }
  }
  if (typeof value.proposedSynthesis !== "string" || value.proposedSynthesis.length > 1000) reasons.push("PROPOSED_SYNTHESIS_MALFORMED");
  if (!Array.isArray(value.unresolvedMaterial) || value.unresolvedMaterial.length > 20 ||
    value.unresolvedMaterial.some((item) => typeof item !== "string" || item.length > 500)) reasons.push("UNRESOLVED_MATERIAL_MALFORMED");
  reasons.push(...validateParallel(value.functionalParallel));
  reasons.push(...validateSourceWitnessContext(value.sourceWitnesses));
  reasons.push(...validateBoundaryOperationWitness(value.boundaryOperationWitness));
  return [...new Set(reasons)];
}

function invalid(reasonCodes: readonly string[]): CrossLanguageFunctionalMotivationBuildResultV0_1 {
  return { status: "INVALID", reasonCodes: [...new Set(reasonCodes)] };
}

export function buildCrossLanguageFunctionalMotivationV0_1(
  parent: SingleWordFunctionalMotivationBuildResultV0_1,
  input: CrossLanguageFunctionalMotivationInputV0_1,
): CrossLanguageFunctionalMotivationBuildResultV0_1 {
  if (!parent || parent.status !== "READY") return invalid(["VALIDATED_SINGLE_WORD_PROPOSAL_REQUIRED"]);
  const reasons = validateInput(input);
  if (reasons.length) return invalid(reasons);
  const proposal = parent.proposal;
  if (input.boundaryOperationWitness && input.boundaryOperationWitness.targetForm !== proposal.target.exactWord) {
    return invalid(["BOUNDARY_WITNESS_TARGET_FORM_MISMATCH"]);
  }
  const boundaryOperationWitness = buildBoundaryOperationWitness(input.boundaryOperationWitness);
  const sourceWitnesses = input.sourceWitnesses;
  const sourceWitnessById = new Map(sourceWitnesses.map((witness) => [witness.witnessId, witness]));
  const witnesses = input.witnesses.map((witness) => {
    if (witness.kind === "USER_PROPOSED") {
      return {
        witnessId: witness.witnessId,
        kind: witness.kind,
        exactForm: witness.exactForm,
        language: witness.language,
        variety: witness.variety.trim() || null,
        proposedMeaning: witness.proposedMeaning.trim() || null,
        evidenceStatus: witness.evidenceStatus,
        evidenceReference: witness.evidenceReference.trim() || null,
        sourceRecord: null,
        writtenVoices: projectWrittenVoices(witness.exactForm),
      };
    }
    const source = sourceWitnessById.get(witness.genericWitnessId);
    if (!source) return null;
    return {
      witnessId: witness.witnessId,
      kind: witness.kind,
      exactForm: source.sourceForm,
      language: source.language,
      variety: source.languageVariety ?? null,
      proposedMeaning: source.gloss,
      evidenceStatus: "SOURCE_RECORD_ONLY" as const,
      evidenceReference: source.citationRefs.join(" · ") || null,
      sourceRecord: {
        genericWitnessId: source.witnessId,
        sourceId: source.sourceId,
        sourceStatus: source.sourceStatus,
        attestationTruth: source.attestationTruth,
        citationRefs: [...source.citationRefs],
        functionalCorrespondence: source.functionalCorrespondence,
        sourceAttestation: source.sourceAttestation,
      },
      writtenVoices: projectWrittenVoices(source.sourceForm),
    };
  });
  const invalidSourceWitnessRefs = witnesses.flatMap((witness, index) => witness ? [] : [`WITNESS_${index + 1}_SOURCE_RECORD_NOT_AVAILABLE`]);
  if (invalidSourceWitnessRefs.length) return invalid(invalidSourceWitnessRefs);
  const resolvedWitnesses = witnesses as CrossLanguageFunctionalMotivationV0_1["witnesses"];
  const witnessById = new Map(resolvedWitnesses.map((witness) => [witness.witnessId, witness]));

  const targetComponentsExactlyAlign = proposal.reconstruction.formComparison === "EXACT_MATCH" &&
    proposal.reconstruction.exactConcatenation === proposal.target.exactWord;
  const targetAndComponentNfcCoordinatesCompatible =
    proposal.target.exactWord === proposal.target.exactWord.normalize("NFC") &&
    proposal.segments.every((segment) => segment.exactSpelling === segment.exactSpelling.normalize("NFC"));
  const targetVoiceEventsAvailable = proposal.writtenStructure.status === "COMPLETE";
  const targetComponentAttributionAuthorized = targetComponentsExactlyAlign &&
    targetAndComponentNfcCoordinatesCompatible &&
    targetVoiceEventsAvailable;
  let componentOffset = 0;
  const targetComponents = proposal.segments.map((segment, segmentIndex) => {
    const segmentLength = Array.from(segment.exactSpelling).length;
    const span = targetComponentAttributionAuthorized
      ? { start: componentOffset, end: componentOffset + segmentLength }
      : null;
    if (span) componentOffset = span.end;
    const voiceAttributionStatus = span !== null
      ? "ATTRIBUTED" as const
      : "UNKNOWN_OR_NULL" as const;
    const voiceAttributionReasonCodes = span !== null
      ? []
      : !targetComponentsExactlyAlign
        ? ["TARGET_COMPONENT_CONCATENATION_MISMATCH"]
        : [
            ...(!targetAndComponentNfcCoordinatesCompatible ? ["TARGET_COMPONENT_NFC_ALIGNMENT_UNAVAILABLE"] : []),
            ...(!targetVoiceEventsAvailable
              ? [proposal.writtenStructure.reasonCode ?? "TARGET_WRITTEN_VOICE_EVENTS_UNAVAILABLE"]
              : []),
          ];
    const voiceEvents = span !== null
      ? proposal.writtenStructure.voiceEvents.filter((event) => event.sourcePosition >= span.start && event.sourcePosition < span.end).map(cloneVoiceEvent)
      : [];
    return {
      componentId: `target-component-${segmentIndex + 1}`,
      segmentIndex,
      exactSpelling: segment.exactSpelling,
      language: segment.language,
      dialect: segment.dialect,
      targetCodePointSpan: span,
      proposedMeaning: segment.proposedMeaning,
      evidenceStatus: segment.evidence.status,
      voiceAttributionStatus,
      voiceAttributionReasonCodes,
      voiceEvents,
      unresolved: segment.unresolved,
    };
  });
  for (const relation of input.correspondences) {
    if (relation.targetComponentIndex >= targetComponents.length) reasons.push(`CORRESPONDENCE_${relation.relationId}_TARGET_COMPONENT_NOT_FOUND`);
    if (!witnessById.has(relation.witnessId)) reasons.push(`CORRESPONDENCE_${relation.relationId}_WITNESS_NOT_FOUND`);
  }
  if (reasons.length) return invalid(reasons);

  const correspondences = input.correspondences.map((relation) => {
    const component = targetComponents[relation.targetComponentIndex]!;
    const witness = witnessById.get(relation.witnessId)!;
    const replay = replayCrossLanguageOperationSequenceV0_1(component.exactSpelling, relation.applications);
    const inputVoices = projectWrittenVoices(component.exactSpelling);
    const outputVoices = projectWrittenVoices(replay.output);
    const voiceConservation = inputVoices.status !== "COMPLETE" || outputVoices.status !== "COMPLETE"
      ? "UNKNOWN_OR_NULL" as const
      : JSON.stringify(inputVoices.path) === JSON.stringify(outputVoices.path) ? "PRESERVED" as const : "CHANGED" as const;
    const unresolvedVoices = voiceConservation === "PRESERVED"
      ? []
      : voiceConservation === "UNKNOWN_OR_NULL"
        ? [inputVoices.unresolvedReason ?? outputVoices.unresolvedReason ?? "VOICE_PATH_UNKNOWN"]
        : [`TARGET_COMPONENT:${inputVoices.path.join("→")}`, `WITNESS_FORM:${outputVoices.path.join("→")}`];
    return {
      relationId: relation.relationId,
      targetComponentId: component.componentId,
      targetComponentForm: component.exactSpelling,
      witnessId: witness.witnessId,
      witnessForm: witness.exactForm,
      proposedRelationship: relation.proposedRelationship.trim(),
      input: replay.input,
      output: replay.output,
      exactFormMatch: replay.status === "EXAMINED" && replay.output === witness.exactForm,
      formStatus: replay.status === "EXAMINED" && replay.output === witness.exactForm ? "EXACT_MATCH" as const : "MISMATCH" as const,
      applications: replay.applications,
      operationCount: replay.operationCount,
      totalCost: replay.totalCost,
      independentVerifiedCorrespondenceCount: 0 as const,
      authority: "USER_DECLARED_UNVERIFIED" as const,
      linguisticValidity: "NOT_ASSESSED" as const,
      voiceConservation,
      unresolvedVoices,
    };
  });

  const targetWrittenVoices = proposal.writtenStructure.status === "COMPLETE"
    ? {
        status: "COMPLETE" as const,
        path: [...proposal.writtenStructure.voicePath],
        events: proposal.writtenStructure.voiceEvents.map(cloneVoiceEvent),
        unresolvedReason: null,
      }
    : {
        status: "UNKNOWN_OR_NULL" as const,
        path: [] as string[],
        events: [] as StructuralVoiceEventV0_2[],
        unresolvedReason: proposal.writtenStructure.reasonCode ?? "TARGET_WRITTEN_VOICES_UNAVAILABLE",
      };
  const targetSense = input.targetSense;
  return {
    status: "READY",
    proposal: {
      schemaVersion: CROSS_LANGUAGE_FUNCTIONAL_MOTIVATION_SCHEMA_V0_1,
      target: {
        ...proposal.target,
        sense: {
          label: targetSense.label.trim() || null,
          evidenceStatus: targetSense.evidenceStatus,
          evidenceReference: targetSense.evidenceReference.trim() || null,
        },
      },
      targetComponents,
      targetWrittenVoices,
      witnesses: resolvedWitnesses,
      correspondences,
      functionalSynthesis: {
        text: input.proposedSynthesis.trim() || null,
        status: input.proposedSynthesis.trim() ? "EXPLORATORY_HYPOTHESIS" : "UNKNOWN_OR_NULL",
      },
      unresolvedMaterial: input.unresolvedMaterial.map((item) => item.trim()).filter(Boolean),
      functionalParallel: buildParallel(input.functionalParallel),
      ...(boundaryOperationWitness ? { boundaryOperationWitness } : {}),
      strictEmbryoMeaning: { status: "UNKNOWN_OR_NULL", meaning: null },
      sourceAuthorityPromotion: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      selection: { mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" },
    },
  };
}
