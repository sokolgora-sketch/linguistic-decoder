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

export type SymbolicFunctionalOperationPlanResultV0_1 =
  | SymbolicFunctionalOperationPlanFailureV0_1
  | SymbolicFunctionalOperationPlanSuccessV0_1;

function unique(values: readonly string[]): boolean {
  return new Set(values).size === values.length;
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
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

  const evaluatorStatus = evaluation.ok ? evaluation.symbolicComposition.status : "PARTIAL_NULL";
  const motivationStatus = evaluatorStatus === "PARTIAL_NULL" || validBridges.length === 0 || reasons.length > 0
    ? "PARTIAL_NULL" as const
    : evaluatorStatus === "MULTIPLE_PROPOSED" || validBridges.length > 1
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
    functionalMotivation: {
      status: motivationStatus,
      selectedSenseId: selectedSense.senseId,
      bridges: input.functionalBridges,
      alternativeReadings: sourceResult.content.alternativeReadings,
      unresolvedParts: input.unresolvedParts,
      reasonCodes: sortedUnique([...reasons, ...evaluatorReasons]),
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
