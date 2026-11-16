import { extractSevenVowelsFromString, type SevenVowel } from "@/shared/math7.core";
import { INTERPRETATION_DECISION_POLICY_V0_1 } from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";
import { isSevenVoiceKey, type SevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";

export const SYMBOLIC_FUNCTIONAL_CONTENT_ENGINE_SCHEMA_V0_1 =
  "open-instrument.symbolic-functional-content-engine.v0_1" as const;

export type SymbolicFunctionalClaimLayerV0_1 =
  | "SOURCE_FACT"
  | "DERIVED_STRUCTURE"
  | "LOGICAL_INFERENCE"
  | "USER_PROPOSAL"
  | "EXPLORATORY_HYPOTHESIS"
  | "UNKNOWN_OR_NULL";

export type SymbolicFunctionalEvidenceStatusV0_1 =
  | "CITATION_ENTERED_UNVERIFIED"
  | "USER_PROPOSED"
  | "UNKNOWN_OR_NULL";

export type SymbolicFunctionalSourceV0_1 = Readonly<{
  sourceId: string;
  label: string;
  url: string;
  locator: string;
  citationStatus: "CITATION_ENTERED_UNVERIFIED";
  licensingStatus: "NOT_ASSESSED";
}>;

export type SymbolicFunctionalSenseV0_1 = Readonly<{
  senseId: string;
  label: string;
  definition: string;
  claimLayer: "SOURCE_FACT" | "USER_PROPOSAL";
  evidenceStatus: "CITATION_ENTERED_UNVERIFIED" | "USER_PROPOSED";
  sourceIds: readonly string[];
  functionalFrame: "ACTION_OF_VERB_FUNCTION" | "OTHER" | "UNKNOWN_OR_NULL";
}>;

export type SymbolicFunctionalContentInputV0_1 = Readonly<{
  target: Readonly<{
    exactSpelling: string;
    language: string;
    variety: string;
    selectedSense: SymbolicFunctionalSenseV0_1;
    alternativeSenses: readonly SymbolicFunctionalSenseV0_1[];
  }>;
  sources: readonly SymbolicFunctionalSourceV0_1[];
  segmentationCandidates: readonly Readonly<{
    candidateId: string;
    components: readonly Readonly<{ componentId: string; exactSpelling: string }>[];
    claimLayer: "USER_PROPOSAL" | "SOURCE_FACT";
    evidenceStatus: "USER_PROPOSED" | "CITATION_ENTERED_UNVERIFIED";
    sourceIds: readonly string[];
  }>[];
  functionCandidates: readonly Readonly<{
    candidateId: string;
    exactForm: string;
    sourceSenseId: string;
    functionText: string | null;
    claimLayer: SymbolicFunctionalClaimLayerV0_1;
    evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
    sourceIds: readonly string[];
  }>[];
  componentFunctionBindings: readonly Readonly<{
    bindingId: string;
    segmentationCandidateId: string;
    componentId: string;
    functionCandidateId: string;
    claimLayer: "SOURCE_FACT" | "USER_PROPOSAL" | "UNKNOWN_OR_NULL";
    evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
    sourceIds: readonly string[];
  }>[];
  voiceRoleCandidates: readonly Readonly<{
    candidateId: string;
    voice: SevenVoiceKey;
    position: number;
    roleText: string | null;
    provenanceClass:
      | "ZERO_SEVEN_VOICES_ORIGINAL"
      | "OPEN_INSTRUMENT_ORIGINAL"
      | "SOURCE_FACT"
      | "USER_PROPOSED"
      | "UNKNOWN";
    claimLayer: SymbolicFunctionalClaimLayerV0_1;
    evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
    sourceIds: readonly string[];
  }>[];
  consonantAssociationCandidates: readonly Readonly<{
    candidateId: string;
    character: string;
    position: number;
    associationText: string | null;
    claimLayer: SymbolicFunctionalClaimLayerV0_1;
    evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
    sourceIds: readonly string[];
  }>[];
  compositionOperations: readonly Readonly<{
    operationId: string;
    operationType: "ACTION_OF_VERB_FUNCTION";
    candidateLabel: string;
    targetSenseId: string;
    functionCandidateId: string;
    componentFunctionBindingId?: string;
    operationStatus:
      | "SOURCE_REPORTED_UNVERIFIED"
      | "USER_PROPOSED"
      | "UNKNOWN_OR_NULL";
    evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
    relationSourceIds: readonly string[];
  }>[];
  alternativeReadings: readonly Readonly<{
    readingId: string;
    text: string;
    claimLayer: SymbolicFunctionalClaimLayerV0_1;
    evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
    sourceIds: readonly string[];
  }>[];
  unresolvedClaims: readonly Readonly<{
    claimId: string;
    text: string;
    sourceIds: readonly string[];
  }>[];
}>;

export type SymbolicFunctionalContentFailureV0_1 = Readonly<{
  ok: false;
  schemaVersion: typeof SYMBOLIC_FUNCTIONAL_CONTENT_ENGINE_SCHEMA_V0_1;
  reasonCodes: readonly string[];
}>;

export type SymbolicFunctionalContentSuccessV0_1 = Readonly<{
  ok: true;
  content: Readonly<{
    schemaVersion: typeof SYMBOLIC_FUNCTIONAL_CONTENT_ENGINE_SCHEMA_V0_1;
    target: Readonly<{
      exactSpelling: string;
      language: string;
      variety: string;
      selectedSense: SymbolicFunctionalSenseV0_1;
      alternativeSenses: readonly SymbolicFunctionalSenseV0_1[];
      codePoints: readonly Readonly<{ character: string; position: number }>[];
      writtenVoices: readonly Readonly<{ voice: SevenVowel; position: number }>[];
      representationAuthority: "ORTHOGRAPHIC";
      pronunciationAuthority: "NOT_ESTABLISHED";
    }>;
    segmentations: readonly Readonly<{
      candidateId: string;
      claimLayer: "USER_PROPOSAL" | "SOURCE_FACT";
      rawReconstruction: string;
      reconstructionStatus: "EXACT_MATCH" | "MISMATCH";
      components: readonly Readonly<{
        componentId: string;
        exactSpelling: string;
        span: Readonly<{ start: number; end: number }>;
        functionBindings: readonly Readonly<{
          bindingId: string;
          functionCandidateId: string;
          claimLayer: "SOURCE_FACT" | "USER_PROPOSAL" | "UNKNOWN_OR_NULL";
          evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
          sourceIds: readonly string[];
        }>[];
        status: "CANDIDATE" | "UNKNOWN_OR_NULL";
      }>[];
    }>[];
    functionCandidates: SymbolicFunctionalContentInputV0_1["functionCandidates"];
    voiceEvents: readonly Readonly<{
      voice: SevenVoiceKey;
      position: number;
      character: string;
      roleCandidates: readonly SymbolicFunctionalContentInputV0_1["voiceRoleCandidates"][number][];
      roleStatus: "CANDIDATE" | "UNKNOWN_OR_NULL";
    }>[];
    consonantStructures: readonly Readonly<{
      character: string;
      position: number;
      associationCandidates: readonly SymbolicFunctionalContentInputV0_1["consonantAssociationCandidates"][number][];
      status: "CANDIDATE" | "UNKNOWN_OR_NULL";
    }>[];
    compositions: readonly Readonly<{
      operationId: string;
      operationType: "ACTION_OF_VERB_FUNCTION";
      candidateLabel: string;
      targetSenseId: string;
      senseRole: "SELECTED_SENSE" | "ALTERNATIVE_SENSE";
      functionCandidateId: string;
      sourceFunctionSenseId: string;
      resultText: string | null;
      claimLayer: SymbolicFunctionalClaimLayerV0_1;
      status:
        | "COMPOSED_FROM_SOURCE_RELATION"
        | "COMPOSED_WITH_USER_PROPOSED_RELATION"
        | "UNKNOWN_OR_NULL";
      evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
      linguisticApplicability: "NOT_ASSESSED";
      provenance: Readonly<{
        relation: Readonly<{
          claimLayer: "SOURCE_FACT" | "USER_PROPOSAL" | "UNKNOWN_OR_NULL";
          evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
          sourceIds: readonly string[];
        }>;
        function: Readonly<{
          claimLayer: SymbolicFunctionalClaimLayerV0_1;
          evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
          sourceIds: readonly string[];
        }>;
        componentBinding?: Readonly<{
          bindingId: string;
          claimLayer: "SOURCE_FACT" | "USER_PROPOSAL" | "UNKNOWN_OR_NULL";
          evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
          sourceIds: readonly string[];
        }>;
      }>;
    }>[];
    alternativeReadings: SymbolicFunctionalContentInputV0_1["alternativeReadings"];
    unresolved: readonly Readonly<{
      claimId: string;
      text: string;
      claimLayer: "UNKNOWN_OR_NULL";
      sourceIds: readonly string[];
    }>[];
    reasoningTrace: readonly Readonly<{
      stepId: string;
      text: string;
      claimLayer: SymbolicFunctionalClaimLayerV0_1;
      evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1;
      sourceIds: readonly string[];
    }>[];
    interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1;
    selection: Readonly<{
      mode: "no_single_winner";
      selectedCandidateId: null;
      userDecisionPosture: "user_decides";
    }>;
    sourceAuthorityPromotion: "NONE";
    productionAuthority: "NONE";
    historicalOrigin: "NOT_CLAIMED";
    symbolicAlgorithmAttribution: "ZHEJI_INSPIRED_ZERO_RESEARCH_IMPLEMENTATION";
  }>;
}>;

export type SymbolicFunctionalContentResultV0_1 =
  | SymbolicFunctionalContentFailureV0_1
  | SymbolicFunctionalContentSuccessV0_1;

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function reasonList(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function hasSources(sourceIds: readonly string[], sourceMap: ReadonlyMap<string, SymbolicFunctionalSourceV0_1>): boolean {
  return sourceIds.every((sourceId) => sourceMap.has(sourceId));
}

function isSourceFactClaim(
  claimLayer: SymbolicFunctionalClaimLayerV0_1,
  evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1,
  sourceIds: readonly string[],
): boolean {
  return claimLayer === "SOURCE_FACT" &&
    evidenceStatus === "CITATION_ENTERED_UNVERIFIED" &&
    sourceIds.length > 0;
}

function composeActionOfVerbFunction(functionText: string): string {
  return `Action/process corresponding to the verb function: ${functionText}`;
}

/**
 * Computes a bounded functional composition from typed sense, function,
 * relation, and provenance inputs. It never derives a relation from a word's
 * spelling or Voice path, and it does not evaluate morphological applicability.
 */
export function buildSymbolicFunctionalContentV0_1(
  input: SymbolicFunctionalContentInputV0_1,
): SymbolicFunctionalContentResultV0_1 {
  const reasons: string[] = [];
  const target = input?.target;
  const exactSpelling = target?.exactSpelling;
  if (typeof exactSpelling !== "string" || exactSpelling.length === 0) {
    reasons.push("TARGET_EXACT_SPELLING_REQUIRED");
  }
  if (typeof exactSpelling === "string" && exactSpelling.normalize("NFC") !== exactSpelling) {
    reasons.push("TARGET_EXACT_SPELLING_MUST_BE_NFC_FOR_CODE_POINT_ACCOUNTING");
  }
  if (!target?.language?.trim() || !target?.variety?.trim()) {
    reasons.push("TARGET_LANGUAGE_AND_VARIETY_REQUIRED");
  }

  const allSenses = [target?.selectedSense, ...(target?.alternativeSenses ?? [])].filter(Boolean) as SymbolicFunctionalSenseV0_1[];
  const senseMap = new Map(allSenses.map((sense) => [sense.senseId, sense]));
  if (!target?.selectedSense?.senseId || !target.selectedSense.label || !target.selectedSense.definition) {
    reasons.push("SELECTED_TARGET_SENSE_REQUIRED");
  }
  if (!unique(allSenses.map((sense) => sense.senseId))) reasons.push("TARGET_SENSE_IDS_MUST_BE_UNIQUE");

  const sourceMap = new Map<string, SymbolicFunctionalSourceV0_1>();
  for (const source of input?.sources ?? []) {
    if (!source.sourceId || sourceMap.has(source.sourceId)) reasons.push("SOURCE_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    else sourceMap.set(source.sourceId, source);
  }
  for (const sense of allSenses) {
    if (!hasSources(sense.sourceIds, sourceMap)) reasons.push(`UNKNOWN_SENSE_SOURCE:${sense.senseId}`);
    if (sense.claimLayer === "SOURCE_FACT" &&
        (sense.evidenceStatus !== "CITATION_ENTERED_UNVERIFIED" || sense.sourceIds.length === 0)) {
      reasons.push(`SOURCE_SENSE_PROVENANCE_REQUIRED:${sense.senseId}`);
    }
    if (sense.claimLayer === "USER_PROPOSAL" && sense.evidenceStatus !== "USER_PROPOSED") {
      reasons.push(`USER_SENSE_EVIDENCE_STATUS_INVALID:${sense.senseId}`);
    }
  }

  const sourceIdGroups: readonly (readonly string[])[] = [
    ...(input?.segmentationCandidates ?? []).map((candidate) => candidate.sourceIds),
    ...(input?.functionCandidates ?? []).map((candidate) => candidate.sourceIds),
    ...(input?.componentFunctionBindings ?? []).map((binding) => binding.sourceIds),
    ...(input?.voiceRoleCandidates ?? []).map((candidate) => candidate.sourceIds),
    ...(input?.consonantAssociationCandidates ?? []).map((candidate) => candidate.sourceIds),
    ...(input?.compositionOperations ?? []).map((operation) => operation.relationSourceIds),
    ...(input?.alternativeReadings ?? []).map((reading) => reading.sourceIds),
    ...(input?.unresolvedClaims ?? []).map((claim) => claim.sourceIds),
  ];
  for (const group of sourceIdGroups) {
    if (!hasSources(group, sourceMap)) reasons.push("UNKNOWN_SOURCE_REFERENCE");
  }

  const codePoints = Array.from(typeof exactSpelling === "string" ? exactSpelling : "");
  const voiceEvents = codePoints.flatMap((character, position) => {
    const voice = extractSevenVowelsFromString(character)[0];
    return voice && isSevenVoiceKey(voice) ? [{ character, voice, position }] : [];
  });
  const voiceEventKey = (voice: string, position: number) => `${voice}@${position}`;
  const expectedVoiceKeys = new Set(voiceEvents.map(({ voice, position }) => voiceEventKey(voice, position)));

  const functionMap = new Map<string, SymbolicFunctionalContentInputV0_1["functionCandidates"][number]>();
  for (const candidate of input?.functionCandidates ?? []) {
    if (!candidate.candidateId || functionMap.has(candidate.candidateId)) reasons.push("FUNCTION_CANDIDATE_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    else functionMap.set(candidate.candidateId, candidate);
    if (candidate.claimLayer === "SOURCE_FACT" &&
        !isSourceFactClaim(candidate.claimLayer, candidate.evidenceStatus, candidate.sourceIds)) {
      reasons.push(`FUNCTION_SOURCE_PROVENANCE_REQUIRED:${candidate.candidateId}`);
    }
    if (candidate.claimLayer === "SOURCE_FACT" && candidate.functionText === null) {
      reasons.push(`SOURCE_FUNCTION_TEXT_REQUIRED:${candidate.candidateId}`);
    }
    if (candidate.claimLayer === "USER_PROPOSAL" && candidate.evidenceStatus !== "USER_PROPOSED") {
      reasons.push(`USER_FUNCTION_EVIDENCE_STATUS_INVALID:${candidate.candidateId}`);
    }
    if (candidate.claimLayer === "UNKNOWN_OR_NULL" && candidate.evidenceStatus !== "UNKNOWN_OR_NULL") {
      reasons.push(`UNKNOWN_FUNCTION_EVIDENCE_STATUS_INVALID:${candidate.candidateId}`);
    }
    if (candidate.claimLayer === "UNKNOWN_OR_NULL" && candidate.functionText !== null) {
      reasons.push(`UNKNOWN_FUNCTION_TEXT_MUST_BE_NULL:${candidate.candidateId}`);
    }
    if (candidate.functionText !== null && !candidate.functionText.trim()) {
      reasons.push(`FUNCTION_TEXT_MUST_BE_NONEMPTY_OR_NULL:${candidate.candidateId}`);
    }
  }

  const segmentationMap = new Map<string, SymbolicFunctionalContentInputV0_1["segmentationCandidates"][number]>();
  const componentKeys = new Set<string>();
  for (const candidate of input?.segmentationCandidates ?? []) {
    if (!candidate.candidateId || segmentationMap.has(candidate.candidateId)) reasons.push("SEGMENTATION_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    else segmentationMap.set(candidate.candidateId, candidate);
    if (candidate.components.length === 0) reasons.push(`SEGMENTATION_REQUIRES_COMPONENTS:${candidate.candidateId}`);
    if (candidate.claimLayer === "SOURCE_FACT" &&
        !isSourceFactClaim(candidate.claimLayer, candidate.evidenceStatus, candidate.sourceIds)) {
      reasons.push(`SEGMENTATION_SOURCE_PROVENANCE_REQUIRED:${candidate.candidateId}`);
    }
    if (candidate.claimLayer === "USER_PROPOSAL" && candidate.evidenceStatus !== "USER_PROPOSED") {
      reasons.push(`SEGMENTATION_USER_STATUS_INVALID:${candidate.candidateId}`);
    }
    const ids = candidate.components.map((component) => component.componentId);
    if (!unique(ids) || ids.some((id) => !id)) reasons.push(`COMPONENT_IDS_MUST_BE_NONEMPTY_AND_UNIQUE:${candidate.candidateId}`);
    for (const component of candidate.components) {
      componentKeys.add(`${candidate.candidateId}:${component.componentId}`);
      if (!component.exactSpelling) reasons.push(`COMPONENT_SPELLING_REQUIRED:${candidate.candidateId}:${component.componentId}`);
    }
  }

  const bindingMap = new Map<string, SymbolicFunctionalContentInputV0_1["componentFunctionBindings"][number]>();
  const bindingsByComponent = new Map<string, SymbolicFunctionalContentInputV0_1["componentFunctionBindings"]>();
  for (const binding of input?.componentFunctionBindings ?? []) {
    if (!binding.bindingId || bindingMap.has(binding.bindingId)) reasons.push("COMPONENT_BINDING_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    else bindingMap.set(binding.bindingId, binding);
    if (!componentKeys.has(`${binding.segmentationCandidateId}:${binding.componentId}`)) reasons.push(`UNKNOWN_COMPONENT_BINDING_TARGET:${binding.bindingId}`);
    if (!functionMap.has(binding.functionCandidateId)) reasons.push(`UNKNOWN_COMPONENT_BINDING_FUNCTION:${binding.bindingId}`);
    if (binding.claimLayer === "SOURCE_FACT" &&
        !isSourceFactClaim(binding.claimLayer, binding.evidenceStatus, binding.sourceIds)) {
      reasons.push(`COMPONENT_BINDING_SOURCE_PROVENANCE_REQUIRED:${binding.bindingId}`);
    }
    if (binding.claimLayer === "USER_PROPOSAL" && binding.evidenceStatus !== "USER_PROPOSED") {
      reasons.push(`COMPONENT_BINDING_USER_STATUS_INVALID:${binding.bindingId}`);
    }
    if (binding.claimLayer === "UNKNOWN_OR_NULL" && binding.evidenceStatus !== "UNKNOWN_OR_NULL") {
      reasons.push(`COMPONENT_BINDING_UNKNOWN_STATUS_INVALID:${binding.bindingId}`);
    }
    const key = `${binding.segmentationCandidateId}:${binding.componentId}`;
    bindingsByComponent.set(key, [...(bindingsByComponent.get(key) ?? []), binding]);
  }

  const roleIds = new Set<string>();
  for (const role of input?.voiceRoleCandidates ?? []) {
    if (!role.candidateId || roleIds.has(role.candidateId)) reasons.push("VOICE_ROLE_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    roleIds.add(role.candidateId);
    if (!expectedVoiceKeys.has(voiceEventKey(role.voice, role.position))) reasons.push(`VOICE_ROLE_NOT_BOUND_TO_TARGET_EVENT:${role.candidateId}`);
    if (role.claimLayer === "SOURCE_FACT" &&
        !isSourceFactClaim(role.claimLayer, role.evidenceStatus, role.sourceIds)) reasons.push(`VOICE_ROLE_SOURCE_PROVENANCE_REQUIRED:${role.candidateId}`);
    if (role.claimLayer === "SOURCE_FACT" && role.provenanceClass !== "SOURCE_FACT") reasons.push(`VOICE_ROLE_SOURCE_CLASS_INVALID:${role.candidateId}`);
    if (role.claimLayer === "UNKNOWN_OR_NULL" &&
        (role.evidenceStatus !== "UNKNOWN_OR_NULL" || role.roleText !== null)) reasons.push(`VOICE_ROLE_UNKNOWN_STATUS_INVALID:${role.candidateId}`);
    if (role.claimLayer !== "UNKNOWN_OR_NULL" && role.roleText === null) reasons.push(`VOICE_ROLE_TEXT_REQUIRED:${role.candidateId}`);
  }

  const consonantIds = new Set<string>();
  for (const association of input?.consonantAssociationCandidates ?? []) {
    if (!association.candidateId || consonantIds.has(association.candidateId)) reasons.push("CONSONANT_ASSOCIATION_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    consonantIds.add(association.candidateId);
    if (codePoints[association.position] !== association.character ||
        expectedVoiceKeys.has(voiceEventKey(association.character, association.position)) ||
        !/^\p{L}$/u.test(association.character)) {
      reasons.push(`CONSONANT_ASSOCIATION_NOT_BOUND_TO_TARGET_STRUCTURE:${association.candidateId}`);
    }
    if (association.claimLayer === "UNKNOWN_OR_NULL" && association.associationText !== null) {
      reasons.push(`UNKNOWN_CONSONANT_ASSOCIATION_MUST_BE_NULL:${association.candidateId}`);
    }
    if (association.claimLayer === "SOURCE_FACT" &&
        !isSourceFactClaim(association.claimLayer, association.evidenceStatus, association.sourceIds)) {
      reasons.push(`CONSONANT_ASSOCIATION_SOURCE_PROVENANCE_REQUIRED:${association.candidateId}`);
    }
    if (association.claimLayer === "USER_PROPOSAL" && association.evidenceStatus !== "USER_PROPOSED") {
      reasons.push(`CONSONANT_ASSOCIATION_USER_STATUS_INVALID:${association.candidateId}`);
    }
    if (association.claimLayer === "UNKNOWN_OR_NULL" && association.evidenceStatus !== "UNKNOWN_OR_NULL") {
      reasons.push(`CONSONANT_ASSOCIATION_UNKNOWN_STATUS_INVALID:${association.candidateId}`);
    }
    if (association.claimLayer !== "UNKNOWN_OR_NULL" && association.associationText === null) {
      reasons.push(`CONSONANT_ASSOCIATION_TEXT_REQUIRED:${association.candidateId}`);
    }
  }

  const operationIds = new Set<string>();
  for (const operation of input?.compositionOperations ?? []) {
    if (!operation.operationId || operationIds.has(operation.operationId)) reasons.push("COMPOSITION_OPERATION_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
    operationIds.add(operation.operationId);
    const sense = senseMap.get(operation.targetSenseId);
    if (!sense) reasons.push(`UNKNOWN_COMPOSITION_TARGET_SENSE:${operation.operationId}`);
    if (!functionMap.has(operation.functionCandidateId)) reasons.push(`UNKNOWN_COMPOSITION_FUNCTION:${operation.operationId}`);
    if (operation.operationStatus === "SOURCE_REPORTED_UNVERIFIED") {
      if (sense?.functionalFrame !== "ACTION_OF_VERB_FUNCTION") reasons.push(`SOURCE_RELATION_FRAME_NOT_ATTESTED:${operation.operationId}`);
      if (operation.evidenceStatus !== "CITATION_ENTERED_UNVERIFIED" || operation.relationSourceIds.length === 0 ||
          operation.relationSourceIds.some((id) => !sense?.sourceIds.includes(id))) {
        reasons.push(`SOURCE_RELATION_PROVENANCE_INVALID:${operation.operationId}`);
      }
      const functionCandidate = functionMap.get(operation.functionCandidateId);
      if (functionCandidate?.claimLayer !== "SOURCE_FACT" && functionCandidate?.claimLayer !== "UNKNOWN_OR_NULL") {
        reasons.push(`SOURCE_RELATION_REQUIRES_SOURCE_FUNCTION_OR_NULL:${operation.operationId}`);
      }
    } else if (operation.operationStatus === "USER_PROPOSED" && operation.evidenceStatus !== "USER_PROPOSED") {
      reasons.push(`USER_RELATION_EVIDENCE_STATUS_INVALID:${operation.operationId}`);
    } else if (operation.operationStatus === "UNKNOWN_OR_NULL" && operation.evidenceStatus !== "UNKNOWN_OR_NULL") {
      reasons.push(`UNKNOWN_RELATION_EVIDENCE_STATUS_INVALID:${operation.operationId}`);
    }
    if (operation.componentFunctionBindingId) {
      const binding = bindingMap.get(operation.componentFunctionBindingId);
      if (!binding || binding.functionCandidateId !== operation.functionCandidateId) {
        reasons.push(`COMPOSITION_COMPONENT_BINDING_MISMATCH:${operation.operationId}`);
      }
    }
  }

  for (const reading of input?.alternativeReadings ?? []) {
    if (reading.claimLayer === "SOURCE_FACT" &&
        !isSourceFactClaim(reading.claimLayer, reading.evidenceStatus, reading.sourceIds)) {
      reasons.push(`ALTERNATIVE_SOURCE_PROVENANCE_REQUIRED:${reading.readingId}`);
    }
    if (reading.claimLayer === "USER_PROPOSAL" && reading.evidenceStatus !== "USER_PROPOSED") {
      reasons.push(`ALTERNATIVE_USER_STATUS_INVALID:${reading.readingId}`);
    }
    if (reading.claimLayer === "UNKNOWN_OR_NULL" && reading.evidenceStatus !== "UNKNOWN_OR_NULL") {
      reasons.push(`ALTERNATIVE_UNKNOWN_STATUS_INVALID:${reading.readingId}`);
    }
  }
  for (const claim of input?.unresolvedClaims ?? []) {
    if (!claim.claimId || !claim.text.trim()) reasons.push("UNRESOLVED_CLAIMS_REQUIRE_ID_AND_TEXT");
  }

  if (reasons.length > 0) {
    return {
      ok: false,
      schemaVersion: SYMBOLIC_FUNCTIONAL_CONTENT_ENGINE_SCHEMA_V0_1,
      reasonCodes: reasonList(reasons),
    };
  }

  const senses = senseMap;
  let componentPosition: number;
  const segmentations = input.segmentationCandidates.map((candidate) => {
    componentPosition = 0;
    const components = candidate.components.map((component) => {
      const start = componentPosition;
      const end = start + Array.from(component.exactSpelling).length;
      componentPosition = end;
      const functionBindings = bindingsByComponent.get(`${candidate.candidateId}:${component.componentId}`) ?? [];
      const hasUsableFunctionBinding = functionBindings.some((binding) => {
        const functionCandidate = functionMap.get(binding.functionCandidateId);
        return functionCandidate?.functionText !== null && functionCandidate?.functionText !== undefined &&
          functionCandidate.claimLayer !== "UNKNOWN_OR_NULL" && binding.claimLayer !== "UNKNOWN_OR_NULL";
      });
      return {
        componentId: component.componentId,
        exactSpelling: component.exactSpelling,
        span: { start, end },
        functionBindings: functionBindings.map((binding) => ({
          bindingId: binding.bindingId,
          functionCandidateId: binding.functionCandidateId,
          claimLayer: binding.claimLayer,
          evidenceStatus: binding.evidenceStatus,
          sourceIds: [...binding.sourceIds],
        })),
        status: hasUsableFunctionBinding ? "CANDIDATE" as const : "UNKNOWN_OR_NULL" as const,
      };
    });
    const rawReconstruction = candidate.components.map((component) => component.exactSpelling).join("");
    return {
      candidateId: candidate.candidateId,
      claimLayer: candidate.claimLayer,
      rawReconstruction,
      reconstructionStatus: rawReconstruction === exactSpelling ? "EXACT_MATCH" as const : "MISMATCH" as const,
      components,
    };
  });

  const projectedVoiceEvents = voiceEvents.map(({ voice, position, character }) => {
    const roleCandidates = input.voiceRoleCandidates.filter((candidate) => candidate.voice === voice && candidate.position === position);
    const hasRoleCandidate = roleCandidates.some((candidate) =>
      candidate.claimLayer !== "UNKNOWN_OR_NULL" && candidate.roleText !== null,
    );
    return {
      voice,
      position,
      character,
      roleCandidates,
      roleStatus: hasRoleCandidate ? "CANDIDATE" as const : "UNKNOWN_OR_NULL" as const,
    };
  });
  const consonantStructures = codePoints.flatMap((character, position) => {
    const voice = extractSevenVowelsFromString(character)[0];
    if (voice || !/^\p{L}$/u.test(character)) return [];
    const associationCandidates = input.consonantAssociationCandidates.filter((candidate) =>
      candidate.position === position && candidate.character === character,
    );
    const hasAssociation = associationCandidates.some((candidate) =>
      candidate.claimLayer !== "UNKNOWN_OR_NULL" && candidate.associationText !== null,
    );
    return [{ character, position, associationCandidates, status: hasAssociation ? "CANDIDATE" as const : "UNKNOWN_OR_NULL" as const }];
  });

  const compositions = input.compositionOperations.map((operation) => {
    const sense = senses.get(operation.targetSenseId)!;
    const functionCandidate = functionMap.get(operation.functionCandidateId)!;
    const binding = operation.componentFunctionBindingId
      ? bindingMap.get(operation.componentFunctionBindingId)
      : undefined;
    const canCompose = functionCandidate.functionText !== null &&
      functionCandidate.claimLayer !== "UNKNOWN_OR_NULL" &&
      (!binding || binding.claimLayer !== "UNKNOWN_OR_NULL") &&
      operation.operationStatus !== "UNKNOWN_OR_NULL";
    const resultText = canCompose ? composeActionOfVerbFunction(functionCandidate.functionText!) : null;
    const claimLayer: SymbolicFunctionalClaimLayerV0_1 = !canCompose
      ? "UNKNOWN_OR_NULL"
      : binding || operation.operationStatus === "USER_PROPOSED"
        ? "USER_PROPOSAL"
        : "LOGICAL_INFERENCE";
    const status = !canCompose
      ? "UNKNOWN_OR_NULL" as const
      : binding || operation.operationStatus === "USER_PROPOSED"
        ? "COMPOSED_WITH_USER_PROPOSED_RELATION" as const
        : "COMPOSED_FROM_SOURCE_RELATION" as const;
    const evidenceStatus: SymbolicFunctionalEvidenceStatusV0_1 = !canCompose
      ? "UNKNOWN_OR_NULL"
      : binding || operation.operationStatus === "USER_PROPOSED"
        ? "USER_PROPOSED"
        : "CITATION_ENTERED_UNVERIFIED";
    return {
      operationId: operation.operationId,
      operationType: operation.operationType,
      candidateLabel: operation.candidateLabel,
      targetSenseId: operation.targetSenseId,
      senseRole: operation.targetSenseId === target.selectedSense.senseId ? "SELECTED_SENSE" as const : "ALTERNATIVE_SENSE" as const,
      functionCandidateId: operation.functionCandidateId,
      sourceFunctionSenseId: functionCandidate.sourceSenseId,
      resultText,
      claimLayer,
      status,
      evidenceStatus,
      linguisticApplicability: "NOT_ASSESSED" as const,
      provenance: {
        relation: {
          claimLayer: operation.operationStatus === "SOURCE_REPORTED_UNVERIFIED" ? "SOURCE_FACT" as const :
            operation.operationStatus === "USER_PROPOSED" ? "USER_PROPOSAL" as const : "UNKNOWN_OR_NULL" as const,
          evidenceStatus: operation.evidenceStatus,
          sourceIds: [...operation.relationSourceIds],
        },
        function: {
          claimLayer: functionCandidate.claimLayer,
          evidenceStatus: functionCandidate.evidenceStatus,
          sourceIds: [...functionCandidate.sourceIds],
        },
        ...(binding ? {
          componentBinding: {
            bindingId: binding.bindingId,
            claimLayer: binding.claimLayer,
            evidenceStatus: binding.evidenceStatus,
            sourceIds: [...binding.sourceIds],
          },
        } : {}),
      },
    };
  });

  const automaticUnresolved = segmentations.flatMap((segmentation) => segmentation.components.flatMap((component) =>
    component.status === "UNKNOWN_OR_NULL"
      ? [{
          claimId: `component:${segmentation.candidateId}:${component.componentId}`,
          text: `No functional contribution is supplied for component ${component.exactSpelling}.`,
          claimLayer: "UNKNOWN_OR_NULL" as const,
          sourceIds: [],
        }]
      : [],
  ));
  const unresolved = [
    ...automaticUnresolved,
    ...input.unresolvedClaims.map((claim) => ({
      claimId: claim.claimId,
      text: claim.text,
      claimLayer: "UNKNOWN_OR_NULL" as const,
      sourceIds: [...claim.sourceIds],
    })),
    ...consonantStructures.flatMap((event) => event.status === "UNKNOWN_OR_NULL"
      ? [{
          claimId: `consonant:${event.character}@${event.position}`,
          text: `No consonant association is supplied for ${event.character}@${event.position}.`,
          claimLayer: "UNKNOWN_OR_NULL" as const,
          sourceIds: [],
        }]
      : [],
    ),
    ...compositions.flatMap((composition) => composition.status === "UNKNOWN_OR_NULL"
      ? [{
          claimId: `composition:${composition.operationId}`,
          text: `The functional relationship ${composition.operationId} remains unresolved because an input function or relationship is UNKNOWN_OR_NULL.`,
          claimLayer: "UNKNOWN_OR_NULL" as const,
          sourceIds: [],
        }]
      : [],
    ),
  ];

  const reasoningTrace = [
    ...segmentations.map((segmentation) => ({
      stepId: `reconstruction:${segmentation.candidateId}`,
      text: `${segmentation.components.map((component) => component.exactSpelling).join(" + ")} = ${segmentation.rawReconstruction} (${segmentation.reconstructionStatus}).`,
      claimLayer: segmentation.claimLayer as SymbolicFunctionalClaimLayerV0_1,
      evidenceStatus: input.segmentationCandidates.find((candidate) => candidate.candidateId === segmentation.candidateId)!.evidenceStatus,
      sourceIds: [...input.segmentationCandidates.find((candidate) => candidate.candidateId === segmentation.candidateId)!.sourceIds],
    })),
    ...compositions.map((composition) => ({
      stepId: `composition:${composition.operationId}`,
      text: composition.resultText
        ? `${composition.candidateLabel}: ${composition.resultText}`
        : `No composition produced for ${composition.candidateLabel}; status UNKNOWN_OR_NULL.`,
      claimLayer: composition.claimLayer,
      evidenceStatus: composition.evidenceStatus,
      sourceIds: [...composition.provenance.relation.sourceIds, ...composition.provenance.function.sourceIds],
    })),
  ];

  const computedWrittenVoices = voiceEvents.map(({ voice, position }) => ({ voice, position }));
  return {
    ok: true,
    content: {
      schemaVersion: SYMBOLIC_FUNCTIONAL_CONTENT_ENGINE_SCHEMA_V0_1,
      target: {
        exactSpelling,
        language: target.language,
        variety: target.variety,
        selectedSense: target.selectedSense,
        alternativeSenses: [...target.alternativeSenses],
        codePoints: codePoints.map((character, position) => ({ character, position })),
        writtenVoices: computedWrittenVoices,
        representationAuthority: "ORTHOGRAPHIC",
        pronunciationAuthority: "NOT_ESTABLISHED",
      },
      segmentations,
      functionCandidates: [...input.functionCandidates],
      voiceEvents: projectedVoiceEvents,
      consonantStructures,
      compositions,
      alternativeReadings: [...input.alternativeReadings],
      unresolved,
      reasoningTrace,
      interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
      selection: {
        mode: "no_single_winner",
        selectedCandidateId: null,
        userDecisionPosture: "user_decides",
      },
      sourceAuthorityPromotion: "NONE",
      productionAuthority: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      symbolicAlgorithmAttribution: "ZHEJI_INSPIRED_ZERO_RESEARCH_IMPLEMENTATION",
    },
  };
}
