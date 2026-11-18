import type { AlbanianKaikkiExactLexicalSourceFactV0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  buildSymbolicFunctionalOperationPlanV0_1,
  type SymbolicFunctionalBridgeV0_1,
  type SymbolicFunctionalOperationPlanInputV0_1,
  type SymbolicFunctionalOperationPlanResultV0_1,
  type SymbolicFunctionalPlanNodeReferenceV0_1,
  type SymbolicFunctionalRoleMappingV0_1,
} from "@/shared/openInstrument/symbolicFunctionalOperationPlanBuilder.v0_1";
import type { SymbolicFunctionalSenseV0_1 } from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";
import type {
  SymbolicCompositionOperationV0_3,
  SymbolicFunctionalCompositionResultV0_3,
} from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import { sameAlbanianSourceForm } from "@/ui/instrument/albanianSourceFormIdentity.v0_1";

export type CurrentWordGraphMeaningNodeV0_1 = Readonly<{
  nodeId: string;
  reference: SymbolicFunctionalPlanNodeReferenceV0_1;
  symbolOutputId: string;
  text: string;
  symbolKind: "SPECTRUM_ASSOCIATION" | "VOICE_TRANSFORM";
}>;

export type CurrentWordGraphMeaningSourceSenseV0_1 = Readonly<{
  optionId: string;
  sense: SymbolicFunctionalSenseV0_1;
  source: SymbolicFunctionalOperationPlanInputV0_1["sourceFunctionInput"]["sources"][number];
  sourceRecordId: string;
  entryLocator: string;
  sourceSnapshotId: string;
}>;

export type CurrentWordGraphMeaningEdgeDraftV0_1 = Readonly<{
  edgeId: string;
  leftNodeId: string;
  rightNodeId: string;
  relationText: string;
}>;

export type CurrentWordGraphMeaningBridgeDraftV0_1 = Readonly<{
  bridgeId: string;
  role: "PRIMARY" | "ALTERNATIVE" | "";
  text: string;
}>;

export type CurrentWordGraphMeaningMappingDraftV0_1 = Readonly<{
  mappingId: string;
  bridgeId: string;
  symbolOutputId: string;
  roleLabel: string;
}>;

export type CurrentWordGraphMeaningProjectionV0_1 = Readonly<{
  plan: SymbolicFunctionalOperationPlanResultV0_1 | null;
  status: "COMPLETE_PROPOSED" | "MULTIPLE_PROPOSED" | "PARTIAL_NULL";
  reasonCodes: readonly string[];
}>;

export type CurrentWordGraphMeaningSummaryV0_1 = Readonly<{
  targetWord: string;
  meaning: Readonly<{
    kind: "SOURCE_FACT" | "USER_PROPOSAL";
    text: string;
    label: string;
    definition: string;
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED" | "USER_PROPOSED";
  }> | null;
  contributions: readonly Readonly<{
    mappingId: string;
    computedOutput: string;
    proposedRole: string;
    evidenceStatus: "USER_PROPOSED";
  }> [];
  sourceMeanings: readonly Readonly<{
    text: string;
    citationStatus: "CITATION_ENTERED_UNVERIFIED";
  }> [];
  statusLabel: string;
  missingDescription: string | null;
}>;

/** Builds the short UI readout from the selected sense and evaluated builder mappings. */
export function currentWordGraphMeaningSummaryV0_1(input: Readonly<{
  targetWord: string;
  selectedSense: SymbolicFunctionalSenseV0_1 | null;
  sourceAlternatives: readonly CurrentWordGraphMeaningSourceSenseV0_1[];
  projection: CurrentWordGraphMeaningProjectionV0_1;
}>): CurrentWordGraphMeaningSummaryV0_1 {
  const plan = input.projection.plan;
  const bridge = plan?.ok ? plan.graphMeaningBridge : null;
  const reasonCodes = input.projection.reasonCodes;
  const selectedMeaningForms = new Set(
    input.selectedSense
      ? [input.selectedSense.label, input.selectedSense.definition]
          .map((text) => text.normalize("NFC").trim().toLowerCase())
      : [],
  );
  let missingDescription: string | null = null;
  if (input.projection.status === "PARTIAL_NULL") {
    if (reasonCodes.includes("CURRENT_WORD_IDENTITY_MISMATCH")) {
      missingDescription = "The draft word does not match the analyzed word; its identity-bound explanation is withheld.";
    } else if (!input.selectedSense || reasonCodes.includes("SELECTED_TARGET_SENSE_REQUIRED")) {
      missingDescription = "Choose a source meaning or enter your own proposed reading.";
    } else if (reasonCodes.some((reason) => reason.startsWith("FUNCTIONAL_EDGE_DRAFT_INCOMPLETE") || reason.startsWith("TRANSFORMATION_REQUIRES_RELATIONS"))) {
      missingDescription = "Complete the missing relationship links in the symbolic graph.";
    } else if (reasonCodes.some((reason) => reason.startsWith("GRAPH_MEANING_MAPPING") || reason === "GRAPH_MEANING_ROLE_MAPPING_REQUIRED")) {
      missingDescription = "Complete at least one computed-output mapping to a proposed functional role.";
    } else if (reasonCodes.includes("GRAPH_MEANING_TARGET_COMPOSITION_PARTIAL_NULL")) {
      missingDescription = "Some target structure or operations remain unresolved. The computed contributions are partial and do not establish a whole-word explanation.";
    } else if (reasonCodes.includes("USER_PROPOSED_FUNCTION_FORM_AND_DESCRIPTION_REQUIRED")) {
      missingDescription = "Add a proposed function and its description.";
    } else if (reasonCodes.includes("FUNCTION_RELATION_KIND_NOT_SELECTED")) {
      missingDescription = "Choose how the proposed function relates to the selected meaning.";
    } else if (reasonCodes.some((reason) => reason.includes("BRIDGE_MISSING_OR_UNRESOLVED"))) {
      missingDescription = "Add a whole-word bridge proposal.";
    } else {
      missingDescription = "A required graph dependency is incomplete; see the detailed analysis and evidence.";
    }
  }

  const statusLabel = input.projection.status === "COMPLETE_PROPOSED"
    ? "Proposal complete — not verified"
    : input.projection.status === "MULTIPLE_PROPOSED"
      ? "Multiple proposals remain — not verified"
      : "Explanation incomplete";

  return {
    targetWord: input.targetWord,
    meaning: input.selectedSense ? {
      kind: input.selectedSense.claimLayer,
      text: input.selectedSense.claimLayer === "USER_PROPOSAL"
        ? input.selectedSense.label
        : input.selectedSense.definition,
      label: input.selectedSense.label,
      definition: input.selectedSense.definition,
      evidenceStatus: input.selectedSense.evidenceStatus,
    } : null,
    contributions: bridge?.mappings.map((mapping) => ({
      mappingId: mapping.mappingId,
      computedOutput: mapping.graphOutput.text,
      proposedRole: mapping.functionalRole.label,
      evidenceStatus: mapping.evidenceStatus,
    })) ?? [],
    sourceMeanings: input.sourceAlternatives.filter(({ sense }) =>
      !selectedMeaningForms.has(sense.definition.normalize("NFC").trim().toLowerCase()),
    ).map(({ sense, source }) => ({
      text: sense.definition,
      citationStatus: source.citationStatus,
    })),
    statusLabel,
    missingDescription,
  };
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

export function currentWordGraphMeaningNodeIdV0_1(
  reference: SymbolicFunctionalPlanNodeReferenceV0_1,
): string {
  return reference.kind === "SPECTRUM_SELECTION"
    ? `selection:${reference.selectionId}`
    : `voice:${reference.bindingId}`;
}

/** Only NFC/Albanian-locale exact-form, source-attested records can populate the source-sense selector. */
export function currentWordGraphMeaningSourceSensesV0_1(
  exactSpelling: string,
  facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[],
): CurrentWordGraphMeaningSourceSenseV0_1[] {
  const result: CurrentWordGraphMeaningSourceSenseV0_1[] = [];
  for (const fact of facts) {
    if (fact.languageCode !== "sq" || !sameAlbanianSourceForm(fact.form, exactSpelling) || fact.attestationTruth !== "fact") continue;
    const sourceId = `kaikki:${fact.sourceRecordId}`;
    const source = {
      sourceId,
      label: `Albanian Kaikki snapshot · ${fact.sourceSnapshot.sourceFamilyId}`,
      url: fact.sourceSnapshot.sourceUrl,
      locator: fact.entryLocator,
      citationStatus: "CITATION_ENTERED_UNVERIFIED" as const,
      licensingStatus: "NOT_ASSESSED" as const,
    };
    fact.senses.forEach((sourceSense, senseIndex) => {
      const definition = sourceSense.glosses.join("; ").trim();
      if (!definition) return;
      const sourceSenseKey = sourceSense.senseId ?? `ordinal-${senseIndex + 1}`;
      const senseId = `${sourceId}:sense:${sourceSenseKey}:${senseIndex + 1}`;
      const sense: SymbolicFunctionalSenseV0_1 = {
        senseId,
        label: `Sense ${senseIndex + 1}${fact.partOfSpeech ? ` · ${fact.partOfSpeech}` : ""}`,
        definition,
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [sourceId],
        functionalFrame: "OTHER",
      };
      result.push({
        optionId: `source-sense:${senseId}`,
        sense,
        source,
        sourceRecordId: fact.sourceRecordId,
        entryLocator: fact.entryLocator,
        sourceSnapshotId: `${fact.sourceSnapshot.sourceFamilyId} · SHA-256 ${fact.sourceSnapshot.sha256}`,
      });
    });
  }
  return result;
}

/**
 * Offers only evaluated symbols from the existing current-word projection as
 * endpoints. IDs are translated to the plan builder's existing node identity.
 */
export function currentWordGraphMeaningNodesV0_1(
  operations: readonly SymbolicCompositionOperationV0_3[],
  evaluation: SymbolicFunctionalCompositionResultV0_3,
): CurrentWordGraphMeaningNodeV0_1[] {
  if (!evaluation.ok) return [];
  const nodes: CurrentWordGraphMeaningNodeV0_1[] = [];
  for (const operation of operations) {
    if (operation.kind !== "SELECT_SPECTRUM_CANDIDATE" && operation.kind !== "APPLY_VOICE_OPERATOR") continue;
    const symbol = evaluation.symbols.find(({ symbolId }) => symbolId === operation.outputSymbolId);
    // SELECT_SPECTRUM_CANDIDATE traces intentionally omit outputSymbolId;
    // the evaluator's symbol table contains only successfully computed nodes.
    if (!symbol) continue;
    const reference: SymbolicFunctionalPlanNodeReferenceV0_1 = operation.kind === "SELECT_SPECTRUM_CANDIDATE"
      ? { kind: "SPECTRUM_SELECTION", selectionId: operation.occurrenceId }
      : { kind: "VOICE_BINDING", bindingId: operation.voiceEventId };
    const symbolOutputId = reference.kind === "SPECTRUM_SELECTION"
      ? `symbol:selection:${reference.selectionId}`
      : `symbol:voice:${reference.bindingId}`;
    const nodeId = currentWordGraphMeaningNodeIdV0_1(reference);
    if (nodes.some((node) => node.nodeId === nodeId)) continue;
    nodes.push({ nodeId, reference, symbolOutputId, text: symbol.text, symbolKind: symbol.symbolKind });
  }
  return nodes;
}

export function buildCurrentWordGraphMeaningProjectionV0_1(input: Readonly<{
  identityMatches: boolean;
  target: SymbolicFunctionalOperationPlanInputV0_1["target"];
  selectedSense: SymbolicFunctionalSenseV0_1 | null;
  alternativeSenses: readonly SymbolicFunctionalSenseV0_1[];
  sources: SymbolicFunctionalOperationPlanInputV0_1["sourceFunctionInput"]["sources"];
  functionForm: string;
  functionDescription: string;
  relationKind: "ACTION_OF_VERB_FUNCTION" | "";
  spectrumSelections: SymbolicFunctionalOperationPlanInputV0_1["spectrumSelections"];
  voiceBindings: SymbolicFunctionalOperationPlanInputV0_1["voiceBindings"];
  nodes: readonly CurrentWordGraphMeaningNodeV0_1[];
  edges: readonly CurrentWordGraphMeaningEdgeDraftV0_1[];
  bridges: readonly CurrentWordGraphMeaningBridgeDraftV0_1[];
  mappings: readonly CurrentWordGraphMeaningMappingDraftV0_1[];
  alternativeReadingText: string;
}>): CurrentWordGraphMeaningProjectionV0_1 {
  if (!input.identityMatches) {
    return { plan: null, status: "PARTIAL_NULL", reasonCodes: ["CURRENT_WORD_IDENTITY_MISMATCH"] };
  }
  if (!input.selectedSense) {
    return { plan: null, status: "PARTIAL_NULL", reasonCodes: ["SELECTED_TARGET_SENSE_REQUIRED"] };
  }

  const selectedSense = input.selectedSense;
  const functionForm = input.functionForm.trim();
  const functionDescription = input.functionDescription.trim();
  const functionCandidateId = `current-word-function:${selectedSense.senseId}`;
  const compositionOperationId = `current-word-function-relation:${selectedSense.senseId}`;
  const hasFunction = functionForm.length > 0 && functionDescription.length > 0;
  const hasFunctionRelation = hasFunction && input.relationKind === "ACTION_OF_VERB_FUNCTION";
  const sources = [...new Map(input.sources.map((source) => [source.sourceId, source])).values()];
  const availableNodes = new Map(input.nodes.map((node) => [node.nodeId, node]));
  const incompleteReasons: string[] = [];

  const functionalEdges: SymbolicFunctionalOperationPlanInputV0_1["functionalEdges"][number][] = [];
  for (const edge of input.edges) {
    const left = availableNodes.get(edge.leftNodeId);
    const right = availableNodes.get(edge.rightNodeId);
    if (!left || !right || !edge.relationText.trim() || edge.leftNodeId === edge.rightNodeId) {
      incompleteReasons.push(`FUNCTIONAL_EDGE_DRAFT_INCOMPLETE:${edge.edgeId}`);
      continue;
    }
    functionalEdges.push({
      edgeId: edge.edgeId,
      left: left.reference,
      right: right.reference,
      relationText: edge.relationText,
    });
  }

  const functionalBridges: SymbolicFunctionalBridgeV0_1[] = [];
  for (const bridge of input.bridges) {
    if (!bridge.role) {
      incompleteReasons.push(`FUNCTIONAL_BRIDGE_ROLE_REQUIRED:${bridge.bridgeId}`);
      continue;
    }
    if (!bridge.text.trim()) {
      functionalBridges.push({
        bridgeId: bridge.bridgeId,
        targetSenseId: selectedSense.senseId,
        role: bridge.role,
        status: "UNKNOWN_OR_NULL",
        text: null,
        claimLayer: "UNKNOWN_OR_NULL",
        evidenceStatus: "UNKNOWN_OR_NULL",
        sourceIds: [],
      });
      continue;
    }
    functionalBridges.push({
      bridgeId: bridge.bridgeId,
      targetSenseId: selectedSense.senseId,
      role: bridge.role,
      status: "USER_PROPOSED",
      text: bridge.text,
      claimLayer: "USER_PROPOSAL",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    });
  }

  const functionalRoleMappings: SymbolicFunctionalRoleMappingV0_1[] = input.mappings.map((mapping) => ({
    mappingId: mapping.mappingId,
    bridgeId: mapping.bridgeId,
    symbolOutputId: mapping.symbolOutputId,
    selectedSenseId: selectedSense.senseId,
    functionCandidateId,
    compositionOperationId,
    functionalRole: {
      roleId: `${mapping.mappingId}:role`,
      label: mapping.roleLabel,
      claimLayer: "USER_PROPOSAL",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    },
    relationType: "PROPOSED_CONTRIBUTES_TO_SELECTED_LEXICAL_FUNCTION",
  }));

  for (const mapping of input.mappings) {
    if (!mapping.bridgeId || !mapping.symbolOutputId || !mapping.roleLabel.trim()) {
      incompleteReasons.push(`GRAPH_MEANING_MAPPING_DRAFT_INCOMPLETE:${mapping.mappingId}`);
    }
  }
  if (!hasFunction) incompleteReasons.push("USER_PROPOSED_FUNCTION_FORM_AND_DESCRIPTION_REQUIRED");
  if (hasFunction && !hasFunctionRelation) incompleteReasons.push("FUNCTION_RELATION_KIND_NOT_SELECTED");
  if (input.bridges.length === 0) incompleteReasons.push("FUNCTIONAL_BRIDGE_MISSING_OR_UNRESOLVED");
  if (input.mappings.length === 0) incompleteReasons.push("GRAPH_MEANING_ROLE_MAPPING_REQUIRED");

  const sourceFunctionInput: SymbolicFunctionalOperationPlanInputV0_1["sourceFunctionInput"] = {
    target: {
      exactSpelling: input.target.exactSpelling,
      language: input.target.language,
      variety: input.target.variety,
      selectedSense,
      alternativeSenses: input.alternativeSenses,
    },
    sources,
    segmentationCandidates: [],
    functionCandidates: hasFunction ? [{
      candidateId: functionCandidateId,
      exactForm: functionForm,
      sourceSenseId: selectedSense.senseId,
      functionText: functionDescription,
      claimLayer: "USER_PROPOSAL",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    }] : [],
    componentFunctionBindings: [],
    voiceRoleCandidates: [],
    consonantAssociationCandidates: [],
    compositionOperations: hasFunctionRelation ? [{
      operationId: compositionOperationId,
      operationType: "ACTION_OF_VERB_FUNCTION",
      candidateLabel: "User-proposed action-of-verb functional relation",
      targetSenseId: selectedSense.senseId,
      functionCandidateId,
      operationStatus: "USER_PROPOSED",
      evidenceStatus: "USER_PROPOSED",
      relationSourceIds: [],
    }] : [],
    alternativeReadings: [
      ...input.alternativeSenses.map((sense) => ({
        readingId: `alternative:${sense.senseId}`,
        text: `${sense.label}: ${sense.definition}`,
        claimLayer: sense.claimLayer,
        evidenceStatus: sense.evidenceStatus,
        sourceIds: sense.sourceIds,
      })),
      ...(input.alternativeReadingText.trim() ? [{
        readingId: `user-alternative:${selectedSense.senseId}`,
        text: input.alternativeReadingText,
        claimLayer: "USER_PROPOSAL" as const,
        evidenceStatus: "USER_PROPOSED" as const,
        sourceIds: [],
      }] : []),
    ],
    unresolvedClaims: [{
      claimId: `current-word-structure:${selectedSense.senseId}`,
      text: "Internal morphology and historical derivation are not established by this symbolic graph.",
      sourceIds: [],
    }],
  };

  const plan = buildSymbolicFunctionalOperationPlanV0_1({
    target: input.target,
    sourceFunctionInput,
    spectrumSelections: input.spectrumSelections,
    voiceBindings: input.voiceBindings,
    functionalEdges,
    transformationLabel: "User-authored graph of selected current-word symbolic outputs",
    functionalBridges,
    functionalRoleMappings,
    unresolvedParts: [{
      claimId: `current-word-unknown-structure:${selectedSense.senseId}`,
      text: "No unselected spelling material or internal morphology is assigned a function here.",
      claimLayer: "UNKNOWN_OR_NULL",
      evidenceStatus: "UNKNOWN_OR_NULL",
      sourceIds: [],
    }],
  });

  const planReasons = plan.ok ? plan.functionalMotivation.reasonCodes : plan.reasonCodes;
  const resultReasons = sortedUnique([...planReasons, ...incompleteReasons]);
  const status = !plan.ok || incompleteReasons.length > 0 ||
      plan.functionalMotivation.status === "PARTIAL_NULL"
    ? "PARTIAL_NULL"
    : plan.functionalMotivation.status;
  return { plan, status, reasonCodes: resultReasons };
}
