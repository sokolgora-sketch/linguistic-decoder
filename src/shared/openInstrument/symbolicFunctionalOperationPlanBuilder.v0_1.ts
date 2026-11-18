import {
  buildSymbolicFunctionalCompositionV0_3,
  spectrumOccurrenceIdV0_3,
  voiceEventIdV0_3,
  type SymbolicCompositionOperationV0_3,
  type SymbolicFunctionalCompositionResultV0_3,
} from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import {
  buildSymbolicFunctionalContentV0_1,
  type SymbolicFunctionalContentInputV0_1,
  type SymbolicFunctionalContentSuccessV0_1,
} from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";
import type { SevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";

export const SYMBOLIC_FUNCTIONAL_OPERATION_PLAN_SCHEMA_V0_1 =
  "open-instrument.symbolic-functional-operation-plan.v0_1" as const;

export const SYMBOLIC_GRAPH_MEANING_BRIDGE_SCHEMA_V0_1 =
  "open-instrument.symbolic-graph-meaning-bridge.v0_1" as const;

export type SymbolicFunctionalPlanNodeReferenceV0_1 = Readonly<
  | { kind: "SPECTRUM_SELECTION"; selectionId: string }
  | { kind: "VOICE_BINDING"; bindingId: string }
>;

export type SymbolicFunctionalBridgeV0_1 = Readonly<{
  bridgeId: string;
  targetSenseId: string;
  role: "PRIMARY" | "ALTERNATIVE";
} & (
  | {
      status: "USER_PROPOSED";
      /** Kept as a user paraphrase; this text alone cannot complete the typed graph-to-meaning bridge. */
      text: string;
      claimLayer: "USER_PROPOSAL";
      evidenceStatus: "USER_PROPOSED";
      sourceIds: readonly [];
    }
  | {
      status: "UNKNOWN_OR_NULL";
      text: null;
      claimLayer: "UNKNOWN_OR_NULL";
      evidenceStatus: "UNKNOWN_OR_NULL";
      sourceIds: readonly [];
    }
)>;

export type SymbolicFunctionalRoleMappingV0_1 = Readonly<{
  mappingId: string;
  bridgeId: string;
  /** Must name a symbol produced by the evaluated operation graph. */
  symbolOutputId: string;
  selectedSenseId: string;
  functionCandidateId: string;
  /** Must name the source-function relation that binds the candidate to the selected sense. */
  compositionOperationId: string;
  functionalRole: Readonly<{
    roleId: string;
    label: string;
    claimLayer: "USER_PROPOSAL";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
  }>;
  relationType: "PROPOSED_CONTRIBUTES_TO_SELECTED_LEXICAL_FUNCTION";
}>;

export type SymbolicFunctionalOperationPlanInputV0_1 = Readonly<{
  target: Readonly<{
    exactSpelling: string;
    language: string;
    variety: string;
  }>;
  /** Existing source/sense contract; its output stays separate from symbolic hypotheses. */
  sourceFunctionInput: SymbolicFunctionalContentInputV0_1;
  spectrumSelections: readonly Readonly<{
    selectionId: string;
    unit: string;
    start: number;
    end: number;
    associationCandidateId: string;
  }>[];
  /** Each binding names one exact written Voice event and one explicit symbolic operand. */
  voiceBindings: readonly Readonly<{
    bindingId: string;
    voice: SevenVoiceKey;
    position: number;
    operatorCandidateId: string;
    input: SymbolicFunctionalPlanNodeReferenceV0_1;
  }>[];
  /** Ordered user-proposed relationships become the edges consumed by the v0.3 evaluator. */
  functionalEdges: readonly Readonly<{
    edgeId: string;
    left: SymbolicFunctionalPlanNodeReferenceV0_1;
    right: SymbolicFunctionalPlanNodeReferenceV0_1;
    relationText: string;
  }>[];
  transformationLabel: string;
  functionalBridges: readonly SymbolicFunctionalBridgeV0_1[];
  /** Optional for existing callers; omission conservatively leaves the meaning bridge partial. */
  functionalRoleMappings?: readonly SymbolicFunctionalRoleMappingV0_1[];
  unresolvedParts: readonly Readonly<{
    claimId: string;
    text: string;
    claimLayer: "UNKNOWN_OR_NULL";
    evidenceStatus: "UNKNOWN_OR_NULL";
    sourceIds: readonly [];
  }>[];
}>;

export type SymbolicFunctionalOperationPlanFailureV0_1 = Readonly<{
  ok: false;
  schemaVersion: typeof SYMBOLIC_FUNCTIONAL_OPERATION_PLAN_SCHEMA_V0_1;
  reasonCodes: readonly string[];
}>;

export type SymbolicFunctionalOperationPlanSuccessV0_1 = Readonly<{
  ok: true;
  schemaVersion: typeof SYMBOLIC_FUNCTIONAL_OPERATION_PLAN_SCHEMA_V0_1;
  operationPlan: readonly SymbolicCompositionOperationV0_3[];
  evaluation: SymbolicFunctionalCompositionResultV0_3;
  sourceFunctionLayer: SymbolicFunctionalContentSuccessV0_1["content"];
  sourceReferences: SymbolicFunctionalContentInputV0_1["sources"];
  graphMeaningBridge: SymbolicGraphMeaningBridgeV0_1;
  functionalMotivation: Readonly<{
    status: "COMPLETE_PROPOSED" | "MULTIPLE_PROPOSED" | "PARTIAL_NULL";
    selectedSenseId: string;
    bridges: readonly SymbolicFunctionalBridgeV0_1[];
    alternativeReadings: SymbolicFunctionalContentSuccessV0_1["content"]["alternativeReadings"];
    unresolvedParts: SymbolicFunctionalOperationPlanInputV0_1["unresolvedParts"];
    reasonCodes: readonly string[];
    claimLayer: "EXPLORATORY_HYPOTHESIS";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
    sourceAuthorityPromotion: "NONE";
    productionAuthority: "NONE";
    historicalOrigin: "NOT_CLAIMED";
    interpretationSelection: Readonly<{
      mode: "no_single_winner";
      selectedCandidateId: null;
      userDecisionPosture: "user_decides";
    }>;
  }>;
}>;

export type SymbolicGraphMeaningBridgeV0_1 = Readonly<{
  schemaVersion: typeof SYMBOLIC_GRAPH_MEANING_BRIDGE_SCHEMA_V0_1;
  status: "COMPLETE_PROPOSED" | "MULTIPLE_PROPOSED" | "PARTIAL_NULL";
  selectedLexicalSense: Readonly<{
    senseId: string;
    label: string;
    definition: string;
    claimLayer: "SOURCE_FACT" | "USER_PROPOSAL";
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED" | "USER_PROPOSED";
    sourceIds: readonly string[];
  }>;
  mappings: readonly Readonly<{
    mappingId: string;
    bridgeId: string;
    graphOutput: Readonly<{
      symbolId: string;
      symbolKind: "SPECTRUM_ASSOCIATION" | "VOICE_TRANSFORM";
      text: string;
      producerOperationId: string;
      claimLayer: "EXPLORATORY_HYPOTHESIS";
      evidenceStatus: "USER_PROPOSED";
      sourceIds: readonly string[];
    }>;
    functionalRole: SymbolicFunctionalRoleMappingV0_1["functionalRole"];
    selectedLexicalFunction: Readonly<{
      candidateId: string;
      exactForm: string;
      sourceSenseId: string;
      functionText: string;
      claimLayer: SymbolicFunctionalContentInputV0_1["functionCandidates"][number]["claimLayer"];
      evidenceStatus: SymbolicFunctionalContentInputV0_1["functionCandidates"][number]["evidenceStatus"];
      sourceIds: readonly string[];
      compositionOperationId: string;
      compositionStatus: SymbolicFunctionalContentSuccessV0_1["content"]["compositions"][number]["status"];
      compositionClaimLayer: SymbolicFunctionalContentSuccessV0_1["content"]["compositions"][number]["provenance"]["relation"]["claimLayer"];
      compositionEvidenceStatus: SymbolicFunctionalContentSuccessV0_1["content"]["compositions"][number]["evidenceStatus"];
      compositionSourceIds: readonly string[];
      linguisticApplicability: "NOT_ASSESSED";
    }>;
    relationType: SymbolicFunctionalRoleMappingV0_1["relationType"];
    generatedContribution: string;
    claimLayer: "USER_PROPOSAL";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
  }> [];
  wholeWordExplanations: readonly Readonly<{
    bridgeId: string;
    bridgeRole: "PRIMARY" | "ALTERNATIVE";
    text: string;
    claimLayer: "USER_PROPOSAL";
    evidenceStatus: "USER_PROPOSED";
    sourceIds: readonly [];
  }> [];
  unresolvedMappings: readonly Readonly<{
    mappingId: string;
    bridgeId: string;
    reasonCodes: readonly string[];
  }> [];
  reasonCodes: readonly string[];
  claimLayer: "EXPLORATORY_HYPOTHESIS";
  evidenceStatus: "USER_PROPOSED";
  sourceIds: readonly [];
  sourceAuthorityPromotion: "NONE";
  historicalOrigin: "NOT_CLAIMED";
  interpretationSelection: Readonly<{
    mode: "no_single_winner";
    selectedCandidateId: null;
    userDecisionPosture: "user_decides";
  }>;
}>;

export type SymbolicFunctionalOperationPlanResultV0_1 =
  | SymbolicFunctionalOperationPlanFailureV0_1
  | SymbolicFunctionalOperationPlanSuccessV0_1;

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function buildGraphMeaningBridge(
  input: SymbolicFunctionalOperationPlanInputV0_1,
  sourceLayer: SymbolicFunctionalContentSuccessV0_1["content"],
  evaluation: SymbolicFunctionalCompositionResultV0_3,
  validBridges: readonly Extract<SymbolicFunctionalBridgeV0_1, { status: "USER_PROPOSED" }>[],
): SymbolicGraphMeaningBridgeV0_1 {
  const reasons: string[] = [];
  const mappingInputs = input.functionalRoleMappings ?? [];
  const mappingIdCounts = new Map<string, number>();
  for (const mapping of mappingInputs) {
    mappingIdCounts.set(mapping.mappingId, (mappingIdCounts.get(mapping.mappingId) ?? 0) + 1);
  }

  const bridgeById = new Map(validBridges.map((bridge) => [bridge.bridgeId, bridge]));
  const mappings: SymbolicGraphMeaningBridgeV0_1["mappings"][number][] = [];
  const unresolvedMappings: SymbolicGraphMeaningBridgeV0_1["unresolvedMappings"][number][] = [];
  const failedBridgeIds = new Set<string>();
  const resolvedMappingIdsByBridge = new Map<string, string[]>();
  const targetCompositionPartial = evaluation.ok &&
    evaluation.symbolicComposition.status === "PARTIAL_NULL";
  const transformationComputed = evaluation.ok &&
    evaluation.symbolicComposition.transformationText !== null &&
    evaluation.operationTrace.some(({ kind, status }) =>
      kind === "REPRESENT_SYMBOLIC_TRANSFORMATION" && status === "COMPUTED",
    );

  if (validBridges.length === 0) reasons.push("GRAPH_MEANING_BRIDGE_MISSING_OR_UNRESOLVED");
  if (input.functionalBridges.length !== validBridges.length) {
    reasons.push("GRAPH_MEANING_BRIDGE_NOT_VALID_FOR_SELECTED_SENSE");
  }
  if (targetCompositionPartial) reasons.push("GRAPH_MEANING_TARGET_COMPOSITION_PARTIAL_NULL");
  if (!transformationComputed) reasons.push("GRAPH_MEANING_REQUIRES_COMPUTED_TRANSFORMATION");

  for (const mapping of mappingInputs) {
    const mappingReasons: string[] = [];
    const bridge = bridgeById.get(mapping.bridgeId);
    if ((mappingIdCounts.get(mapping.mappingId) ?? 0) !== 1 || !mapping.mappingId.trim()) {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_ID_MUST_BE_NONEMPTY_AND_UNIQUE:${mapping.mappingId}`);
    }
    if (!bridge) mappingReasons.push(`GRAPH_MEANING_MAPPING_BRIDGE_NOT_FOUND:${mapping.bridgeId}`);
    if (mapping.selectedSenseId !== sourceLayer.target.selectedSense.senseId) {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_SELECTED_SENSE_MISMATCH:${mapping.mappingId}`);
    }
    if (!mapping.functionalRole.roleId.trim() || !mapping.functionalRole.label.trim()) {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_ROLE_REQUIRED:${mapping.mappingId}`);
    }
    if (mapping.functionalRole.claimLayer !== "USER_PROPOSAL" ||
        mapping.functionalRole.evidenceStatus !== "USER_PROPOSED" ||
        mapping.functionalRole.sourceIds.length !== 0 ||
        mapping.relationType !== "PROPOSED_CONTRIBUTES_TO_SELECTED_LEXICAL_FUNCTION") {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_AUTHORITY_OR_RELATION_INVALID:${mapping.mappingId}`);
    }

    const candidate = input.sourceFunctionInput.functionCandidates.find(
      ({ candidateId }) => candidateId === mapping.functionCandidateId,
    );
    const candidateFunctionText = candidate?.functionText;
    if (!candidate || !candidateFunctionText?.trim() ||
        candidate.claimLayer === "UNKNOWN_OR_NULL" || candidate.evidenceStatus === "UNKNOWN_OR_NULL") {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_LEXICAL_FUNCTION_NOT_FOUND:${mapping.mappingId}`);
    }
    const composition = sourceLayer.compositions.find((item) =>
      item.operationId === mapping.compositionOperationId &&
      item.targetSenseId === sourceLayer.target.selectedSense.senseId &&
      item.functionCandidateId === mapping.functionCandidateId &&
      item.status !== "UNKNOWN_OR_NULL" &&
      (!candidate || item.sourceFunctionSenseId === candidate.sourceSenseId),
    );
    if (!composition) {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_SELECTED_FUNCTION_RELATION_NOT_FOUND:${mapping.mappingId}`);
    }

    const symbol = evaluation.ok
      ? evaluation.symbols.find(({ symbolId }) => symbolId === mapping.symbolOutputId)
      : undefined;
    if (!symbol) {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_GRAPH_OUTPUT_NOT_FOUND:${mapping.mappingId}`);
    }
    const producerTrace = evaluation.ok
      ? evaluation.operationTrace.find(({ outputSymbolId, status }) =>
        outputSymbolId === mapping.symbolOutputId && status === "COMPUTED",
      )
      : undefined;
    if (!producerTrace || !symbol ||
        (producerTrace.kind !== "SELECT_SPECTRUM_CANDIDATE" && producerTrace.kind !== "APPLY_VOICE_OPERATOR")) {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_GRAPH_OUTPUT_NOT_COMPUTED:${mapping.mappingId}`);
    }
    if (!transformationComputed) {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_NOT_IN_COMPUTED_TRANSFORMATION:${mapping.mappingId}`);
    } else if (!input.functionalEdges.some(({ left, right }) =>
      symbolId(left) === mapping.symbolOutputId || symbolId(right) === mapping.symbolOutputId,
    )) {
      mappingReasons.push(`GRAPH_MEANING_MAPPING_NOT_IN_COMPUTED_TRANSFORMATION:${mapping.mappingId}`);
    }

    const uniqueMappingReasons = sortedUnique(mappingReasons);
    if (uniqueMappingReasons.length > 0 || !candidate || !candidateFunctionText || !composition || !symbol || !producerTrace) {
      failedBridgeIds.add(mapping.bridgeId);
      unresolvedMappings.push({
        mappingId: mapping.mappingId,
        bridgeId: mapping.bridgeId,
        reasonCodes: uniqueMappingReasons,
      });
      reasons.push(...uniqueMappingReasons);
      continue;
    }

    const generatedContribution =
      `For ${input.target.exactSpelling} (${sourceLayer.target.selectedSense.label}: ${sourceLayer.target.selectedSense.definition}), computed graph output “${symbol.text}” is proposed as the functional role “${mapping.functionalRole.label}” and as contributing to the selected lexical function ${candidate.exactForm}: “${candidateFunctionText}”.`;
    mappings.push({
      mappingId: mapping.mappingId,
      bridgeId: mapping.bridgeId,
      graphOutput: {
        symbolId: symbol.symbolId,
        symbolKind: symbol.symbolKind,
        text: symbol.text,
        producerOperationId: producerTrace.operationId,
        claimLayer: symbol.provenance.claimLayer,
        evidenceStatus: symbol.provenance.evidenceStatus,
        sourceIds: symbol.provenance.sourceIds,
      },
      functionalRole: mapping.functionalRole,
      selectedLexicalFunction: {
        candidateId: candidate.candidateId,
        exactForm: candidate.exactForm,
        sourceSenseId: candidate.sourceSenseId,
        functionText: candidateFunctionText,
        claimLayer: candidate.claimLayer,
        evidenceStatus: candidate.evidenceStatus,
        sourceIds: candidate.sourceIds,
        compositionOperationId: composition.operationId,
        compositionStatus: composition.status,
        compositionClaimLayer: composition.provenance.relation.claimLayer,
        compositionEvidenceStatus: composition.evidenceStatus,
        compositionSourceIds: composition.provenance.relation.sourceIds,
        linguisticApplicability: composition.linguisticApplicability,
      },
      relationType: mapping.relationType,
      generatedContribution,
      claimLayer: "USER_PROPOSAL",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    });
    resolvedMappingIdsByBridge.set(mapping.bridgeId, [
      ...(resolvedMappingIdsByBridge.get(mapping.bridgeId) ?? []),
      mapping.mappingId,
    ]);
  }

  const wholeWordExplanations: SymbolicGraphMeaningBridgeV0_1["wholeWordExplanations"][number][] = [];
  for (const bridge of validBridges) {
    const bridgeMappingIds = resolvedMappingIdsByBridge.get(bridge.bridgeId) ?? [];
    if (bridgeMappingIds.length === 0) {
      failedBridgeIds.add(bridge.bridgeId);
      reasons.push(`GRAPH_MEANING_MAPPING_REQUIRED_FOR_BRIDGE:${bridge.bridgeId}`);
    }
    if (failedBridgeIds.has(bridge.bridgeId) || bridgeMappingIds.length === 0) continue;
    if (targetCompositionPartial) continue;
    const contributions = mappings
      .filter(({ bridgeId }) => bridgeId === bridge.bridgeId)
      .map(({ generatedContribution }) => generatedContribution);
    wholeWordExplanations.push({
      bridgeId: bridge.bridgeId,
      bridgeRole: bridge.role,
      text: contributions.join(" "),
      claimLayer: "USER_PROPOSAL",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    });
  }

  return {
    schemaVersion: SYMBOLIC_GRAPH_MEANING_BRIDGE_SCHEMA_V0_1,
    status: reasons.length > 0
      ? "PARTIAL_NULL"
      : validBridges.length > 1 ? "MULTIPLE_PROPOSED" : "COMPLETE_PROPOSED",
    selectedLexicalSense: {
      senseId: sourceLayer.target.selectedSense.senseId,
      label: sourceLayer.target.selectedSense.label,
      definition: sourceLayer.target.selectedSense.definition,
      claimLayer: sourceLayer.target.selectedSense.claimLayer,
      evidenceStatus: sourceLayer.target.selectedSense.evidenceStatus,
      sourceIds: sourceLayer.target.selectedSense.sourceIds,
    },
    mappings,
    wholeWordExplanations,
    unresolvedMappings,
    reasonCodes: sortedUnique(reasons),
    claimLayer: "EXPLORATORY_HYPOTHESIS",
    evidenceStatus: "USER_PROPOSED",
    sourceIds: [],
    sourceAuthorityPromotion: "NONE",
    historicalOrigin: "NOT_CLAIMED",
    interpretationSelection: {
      mode: "no_single_winner",
      selectedCandidateId: null,
      userDecisionPosture: "user_decides",
    },
  };
}

function nodeKey(reference: SymbolicFunctionalPlanNodeReferenceV0_1): string {
  return reference.kind === "SPECTRUM_SELECTION"
    ? `selection:${reference.selectionId}`
    : `voice:${reference.bindingId}`;
}

function symbolId(reference: SymbolicFunctionalPlanNodeReferenceV0_1): string {
  return `symbol:${nodeKey(reference)}`;
}

function compileVoiceBindings(
  bindings: SymbolicFunctionalOperationPlanInputV0_1["voiceBindings"],
  producerByNode: Map<string, string>,
): SymbolicCompositionOperationV0_3[] {
  const pending = [...bindings];
  const ordered: typeof pending = [];
  const pendingKeys = new Set(pending.map(({ bindingId }) => `voice:${bindingId}`));

  while (pending.length > 0) {
    const nextIndex = pending.findIndex(({ input }) =>
      input.kind !== "VOICE_BINDING" || !pendingKeys.has(nodeKey(input)),
    );
    const binding = pending.splice(nextIndex < 0 ? 0 : nextIndex, 1)[0]!;
    pendingKeys.delete(`voice:${binding.bindingId}`);
    ordered.push(binding);
  }

  const operations: SymbolicCompositionOperationV0_3[] = [];
  for (const binding of ordered) {
    const operationId = `apply:${binding.bindingId}`;
    const inputSymbolId = symbolId(binding.input);
    const producer = producerByNode.get(nodeKey(binding.input));
    operations.push({
      operationId,
      kind: "APPLY_VOICE_OPERATOR",
      dependsOn: producer ? [producer] : [],
      voice: binding.voice,
      position: binding.position,
      voiceEventId: voiceEventIdV0_3(binding.voice, binding.position),
      operatorCandidateId: binding.operatorCandidateId,
      inputSymbolId,
      outputSymbolId: symbolId({ kind: "VOICE_BINDING", bindingId: binding.bindingId }),
    });
    producerByNode.set(`voice:${binding.bindingId}`, operationId);
  }
  return operations;
}

/**
 * Compiles occurrence selections and user-authored graph edges into the
 * existing v0.3 operation vocabulary, then delegates all mechanical
 * evaluation to that contract. It does not infer spectra, operators, edges,
 * or functional bridges from spelling or lexical content.
 */
export function buildSymbolicFunctionalOperationPlanV0_1(
  input: SymbolicFunctionalOperationPlanInputV0_1,
): SymbolicFunctionalOperationPlanResultV0_1 {
  const reasons: string[] = [];
  const sourceResult = buildSymbolicFunctionalContentV0_1(input.sourceFunctionInput);
  if (!sourceResult.ok) {
    return {
      ok: false,
      schemaVersion: SYMBOLIC_FUNCTIONAL_OPERATION_PLAN_SCHEMA_V0_1,
      reasonCodes: sortedUnique(sourceResult.reasonCodes.map((reason) => `SOURCE_FUNCTION_LAYER_INVALID:${reason}`)),
    };
  }

  const sourceTarget = input.sourceFunctionInput.target;
  if (input.target.exactSpelling !== sourceTarget.exactSpelling ||
      input.target.language !== sourceTarget.language || input.target.variety !== sourceTarget.variety) {
    reasons.push("SOURCE_FUNCTION_LAYER_TARGET_IDENTITY_MISMATCH");
  }
  const selectedSense = sourceResult.content.target.selectedSense;
  if (selectedSense.claimLayer === "SOURCE_FACT" &&
      (selectedSense.evidenceStatus !== "CITATION_ENTERED_UNVERIFIED" || selectedSense.sourceIds.length === 0)) {
    reasons.push("SELECTED_SOURCE_LINKED_LEXICAL_SENSE_PROVENANCE_REQUIRED");
  }
  if (selectedSense.claimLayer === "USER_PROPOSAL" && selectedSense.evidenceStatus !== "USER_PROPOSED") {
    reasons.push("SELECTED_USER_PROPOSED_SENSE_STATUS_INVALID");
  }

  const codePoints = Array.from(input.target.exactSpelling);
  const selectionIds = input.spectrumSelections.map(({ selectionId }) => selectionId);
  const bindingIds = input.voiceBindings.map(({ bindingId }) => bindingId);
  const edgeIds = input.functionalEdges.map(({ edgeId }) => edgeId);
  const bridgeIds = input.functionalBridges.map(({ bridgeId }) => bridgeId);
  const unresolvedIds = input.unresolvedParts.map(({ claimId }) => claimId);
  if (!unique(selectionIds) || selectionIds.some((id) => !id.trim())) reasons.push("SPECTRUM_SELECTION_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
  if (!unique(bindingIds) || bindingIds.some((id) => !id.trim())) reasons.push("VOICE_BINDING_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
  if (!unique(edgeIds) || edgeIds.some((id) => !id.trim())) reasons.push("FUNCTIONAL_EDGE_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
  if (!unique(bridgeIds) || bridgeIds.some((id) => !id.trim())) reasons.push("FUNCTIONAL_BRIDGE_IDS_MUST_BE_NONEMPTY_AND_UNIQUE");
  if (!unique(unresolvedIds) || unresolvedIds.some((id) => !id.trim()) ||
      input.unresolvedParts.some(({ text }) => !text.trim())) {
    reasons.push("UNRESOLVED_PARTS_REQUIRE_NONEMPTY_UNIQUE_IDS_AND_TEXT");
  }

  for (const selection of input.spectrumSelections) {
    const unitPoints = Array.from(selection.unit);
    const actual = codePoints.slice(selection.start, selection.end);
    if (!Number.isInteger(selection.start) || !Number.isInteger(selection.end) ||
        selection.start < 0 || selection.end <= selection.start ||
        actual.length !== unitPoints.length || actual.join("").toUpperCase() !== selection.unit) {
      reasons.push(`SPECTRUM_SELECTION_NOT_BOUND_TO_EXACT_CODE_POINT_SPAN:${selection.selectionId}`);
    }
  }

  const eventKeys = input.voiceBindings.map(({ voice, position }) => `${voice}@${position}`);
  if (!unique(eventKeys)) reasons.push("VOICE_EVENT_BINDINGS_MUST_BE_UNIQUE");
  if (!input.transformationLabel.trim()) reasons.push("TRANSFORMATION_LABEL_REQUIRED");
  if (reasons.length > 0) {
    return {
      ok: false,
      schemaVersion: SYMBOLIC_FUNCTIONAL_OPERATION_PLAN_SCHEMA_V0_1,
      reasonCodes: sortedUnique(reasons),
    };
  }

  const operations: SymbolicCompositionOperationV0_3[] = [];
  const producerByNode = new Map<string, string>();
  for (const selection of input.spectrumSelections) {
    const operationId = `select:${selection.selectionId}`;
    operations.push({
      operationId,
      kind: "SELECT_SPECTRUM_CANDIDATE",
      dependsOn: [],
      occurrenceId: spectrumOccurrenceIdV0_3(selection.unit, selection.start, selection.end),
      associationCandidateId: selection.associationCandidateId,
      outputSymbolId: symbolId({ kind: "SPECTRUM_SELECTION", selectionId: selection.selectionId }),
    });
    producerByNode.set(`selection:${selection.selectionId}`, operationId);
  }
  operations.push(...compileVoiceBindings(input.voiceBindings, producerByNode));

  const relationIds: string[] = [];
  const connectionOperationIds: string[] = [];
  for (const edge of input.functionalEdges) {
    const operationId = `connect:${edge.edgeId}`;
    const dependencies = sortedUnique([
      producerByNode.get(nodeKey(edge.left)),
      producerByNode.get(nodeKey(edge.right)),
    ].filter((producer): producer is string => Boolean(producer)));
    const outputRelationId = `relation:${edge.edgeId}`;
    operations.push({
      operationId,
      kind: "CONNECT_SYMBOLS",
      dependsOn: dependencies,
      leftSymbolId: symbolId(edge.left),
      rightSymbolId: symbolId(edge.right),
      relationText: edge.relationText,
      outputRelationId,
    });
    relationIds.push(outputRelationId);
    connectionOperationIds.push(operationId);
  }

  const transformationId = "plan:transformation";
  const transformationOperationId = "represent:transformation";
  operations.push({
    operationId: transformationOperationId,
    kind: "REPRESENT_SYMBOLIC_TRANSFORMATION",
    dependsOn: connectionOperationIds,
    relationIds,
    transformationLabel: input.transformationLabel,
    outputTransformationId: transformationId,
  });

  const validBridges = input.functionalBridges.filter(
    (bridge): bridge is Extract<SymbolicFunctionalBridgeV0_1, { status: "USER_PROPOSED" }> =>
      bridge.status === "USER_PROPOSED" && bridge.targetSenseId === selectedSense.senseId,
  );
  for (const bridge of input.functionalBridges) {
    if (bridge.targetSenseId !== selectedSense.senseId) {
      reasons.push(`FUNCTIONAL_BRIDGE_MUST_REFERENCE_SELECTED_SENSE:${bridge.bridgeId}`);
    }
    if (bridge.status === "UNKNOWN_OR_NULL") {
      reasons.push(`FUNCTIONAL_BRIDGE_UNKNOWN_OR_NULL:${bridge.bridgeId}`);
    } else if (!bridge.text.trim()) {
      reasons.push(`FUNCTIONAL_BRIDGE_TEXT_REQUIRED:${bridge.bridgeId}`);
    }
  }
  for (const bridge of validBridges) {
    operations.push({
      operationId: `express:${bridge.bridgeId}`,
      kind: "EXPRESS_RESULT",
      dependsOn: [transformationOperationId],
      transformationId,
      outputExpressionId: `expression:${bridge.bridgeId}`,
      userProposedParaphrase: bridge.text,
    });
  }

  if (validBridges.length === 0) reasons.push("FUNCTIONAL_BRIDGE_MISSING_OR_UNRESOLVED");

  const evaluation = buildSymbolicFunctionalCompositionV0_3({
    target: {
      exactSpelling: input.target.exactSpelling,
      language: input.target.language,
      variety: input.target.variety,
      wholeWordConcept: selectedSense.definition,
    },
    operations,
    sourceFunctionLayer: sourceResult,
  });

  const graphMeaningBridge = buildGraphMeaningBridge(input, sourceResult.content, evaluation, validBridges);
  const evaluatorStatus = evaluation.ok ? evaluation.symbolicComposition.status : "PARTIAL_NULL";
  const motivationStatus = evaluatorStatus === "PARTIAL_NULL" ||
    graphMeaningBridge.status === "PARTIAL_NULL" || validBridges.length === 0 || reasons.length > 0
    ? "PARTIAL_NULL" as const
    : graphMeaningBridge.status === "MULTIPLE_PROPOSED" || evaluatorStatus === "MULTIPLE_PROPOSED"
      ? "MULTIPLE_PROPOSED" as const
      : "COMPLETE_PROPOSED" as const;
  const evaluatorReasons = evaluation.ok ? evaluation.symbolicComposition.reasonCodes : evaluation.reasonCodes;

  return {
    ok: true,
    schemaVersion: SYMBOLIC_FUNCTIONAL_OPERATION_PLAN_SCHEMA_V0_1,
    operationPlan: operations,
    evaluation,
    sourceFunctionLayer: sourceResult.content,
    sourceReferences: input.sourceFunctionInput.sources,
    graphMeaningBridge,
    functionalMotivation: {
      status: motivationStatus,
      selectedSenseId: selectedSense.senseId,
      bridges: input.functionalBridges,
      alternativeReadings: sourceResult.content.alternativeReadings,
      unresolvedParts: input.unresolvedParts,
      reasonCodes: sortedUnique([...reasons, ...evaluatorReasons, ...graphMeaningBridge.reasonCodes]),
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
      sourceAuthorityPromotion: "NONE",
      productionAuthority: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      interpretationSelection: {
        mode: "no_single_winner",
        selectedCandidateId: null,
        userDecisionPosture: "user_decides",
      },
    },
  };
}
