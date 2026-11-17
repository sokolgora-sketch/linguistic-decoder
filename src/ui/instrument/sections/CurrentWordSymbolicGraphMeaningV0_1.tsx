"use client";

import { useMemo, useState } from "react";
import type { AlbanianKaikkiExactLexicalSourceFactV0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import type { SymbolicFunctionalOperationPlanInputV0_1 } from "@/shared/openInstrument/symbolicFunctionalOperationPlanBuilder.v0_1";
import type {
  SymbolicCompositionOperationV0_3,
  SymbolicFunctionalCompositionResultV0_3,
} from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import {
  buildCurrentWordGraphMeaningProjectionV0_1,
  currentWordGraphMeaningNodesV0_1,
  currentWordGraphMeaningSourceSensesV0_1,
  type CurrentWordGraphMeaningBridgeDraftV0_1,
  type CurrentWordGraphMeaningEdgeDraftV0_1,
  type CurrentWordGraphMeaningMappingDraftV0_1,
} from "@/ui/instrument/sections/currentWordSymbolicMeaningBridgeAdapter.v0_1";

const fieldClass = "mt-1 w-full min-w-0 rounded border border-[#46505c] bg-[#0d1117] px-2 py-1.5 text-sm text-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]";
const labelClass = "block min-w-0 text-xs font-medium text-[#c5ced8]";
const cardClass = "mt-2 min-w-0 rounded border border-[#38433a] p-2 text-xs leading-5";

function selectedSenseDescription(sense: Readonly<{ label: string; definition: string; claimLayer: string; evidenceStatus: string }>): string {
  return `${sense.claimLayer} · ${sense.evidenceStatus} · ${sense.label}: ${sense.definition}`;
}

export function CurrentWordSymbolicGraphMeaningV0_1({
  analyzedWord,
  draftTargetWord,
  language,
  variety,
  identityMatches,
  exactSourceFacts,
  spectrumSelections,
  voiceBindings,
  operations,
  evaluation,
}: {
  analyzedWord: string;
  draftTargetWord: string;
  language: string;
  variety: string;
  identityMatches: boolean;
  exactSourceFacts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
  spectrumSelections: SymbolicFunctionalOperationPlanInputV0_1["spectrumSelections"];
  voiceBindings: SymbolicFunctionalOperationPlanInputV0_1["voiceBindings"];
  operations: readonly SymbolicCompositionOperationV0_3[];
  evaluation: SymbolicFunctionalCompositionResultV0_3;
}) {
  const [senseChoice, setSenseChoice] = useState("");
  const [proposedSenseLabel, setProposedSenseLabel] = useState("");
  const [proposedSenseDefinition, setProposedSenseDefinition] = useState("");
  const [functionForm, setFunctionForm] = useState("");
  const [functionDescription, setFunctionDescription] = useState("");
  const [relationKind, setRelationKind] = useState<"" | "ACTION_OF_VERB_FUNCTION">("");
  const [edges, setEdges] = useState<CurrentWordGraphMeaningEdgeDraftV0_1[]>([]);
  const [bridges, setBridges] = useState<CurrentWordGraphMeaningBridgeDraftV0_1[]>([]);
  const [mappings, setMappings] = useState<CurrentWordGraphMeaningMappingDraftV0_1[]>([]);
  const [alternativeReadingText, setAlternativeReadingText] = useState("");
  const [rowSequence, setRowSequence] = useState(0);

  const sourceSenseChoices = useMemo(
    () => identityMatches ? currentWordGraphMeaningSourceSensesV0_1(analyzedWord, exactSourceFacts) : [],
    [identityMatches, analyzedWord, exactSourceFacts],
  );
  const nodes = useMemo(
    () => currentWordGraphMeaningNodesV0_1(operations, evaluation),
    [operations, evaluation],
  );
  const selectedSourceSense = identityMatches ? sourceSenseChoices.find(({ optionId }) => optionId === senseChoice) ?? null : null;
  const userSenseSelected = identityMatches && senseChoice === "USER_PROPOSED";
  const userSenseId = `user-proposed-current-word-sense:${analyzedWord}:${language}:${variety}`;
  const selectedSense = useMemo(() => identityMatches ? selectedSourceSense?.sense ?? (userSenseSelected && proposedSenseLabel.trim() && proposedSenseDefinition.trim()
    ? {
        senseId: userSenseId,
        label: proposedSenseLabel.trim(),
        definition: proposedSenseDefinition.trim(),
        claimLayer: "USER_PROPOSAL" as const,
        evidenceStatus: "USER_PROPOSED" as const,
        sourceIds: [],
        functionalFrame: "OTHER" as const,
      }
    : null) : null, [identityMatches, selectedSourceSense, userSenseSelected, proposedSenseLabel, proposedSenseDefinition, userSenseId]);
  const alternativeSenseChoices = sourceSenseChoices.filter(({ sense }) => sense.senseId !== selectedSense?.senseId);
  const alternativeSenses = alternativeSenseChoices.map(({ sense }) => sense);
  const sources = sourceSenseChoices.map(({ source }) => source);
  const identityKey = JSON.stringify([
    analyzedWord,
    draftTargetWord,
    language,
    variety,
    exactSourceFacts.map(({ sourceRecordId, sourceSnapshot }) => [sourceRecordId, sourceSnapshot.sha256]),
  ]);

  const projection = useMemo(() => buildCurrentWordGraphMeaningProjectionV0_1({
    identityMatches,
    target: { exactSpelling: analyzedWord, language, variety },
    selectedSense,
    alternativeSenses,
    sources,
    functionForm,
    functionDescription,
    relationKind,
    spectrumSelections,
    voiceBindings,
    nodes,
    edges,
    bridges,
    mappings,
    alternativeReadingText,
  }), [
    identityMatches,
    analyzedWord,
    language,
    variety,
    selectedSense,
    alternativeSenses,
    sources,
    functionForm,
    functionDescription,
    relationKind,
    spectrumSelections,
    voiceBindings,
    nodes,
    edges,
    bridges,
    mappings,
    alternativeReadingText,
  ]);

  const plan = projection.plan;
  const planEvaluation = plan?.ok ? plan.evaluation : null;
  const computedNodes = planEvaluation?.ok
    ? nodes.filter((node) => planEvaluation.symbols.some(({ symbolId }) => symbolId === node.symbolOutputId))
    : [];
  const availableBridges = bridges.filter(({ role, text }) => role && text.trim());
  const planBridge = plan?.ok ? plan.graphMeaningBridge : null;
  const displayedWholeWordStatus = selectedSense && projection.status !== "PARTIAL_NULL"
    ? projection.status
    : "PARTIAL_NULL · UNKNOWN_OR_NULL";

  const addRowId = (prefix: string) => {
    const next = rowSequence + 1;
    setRowSequence(next);
    return `${prefix}-${next}`;
  };
  const updateEdge = (edgeId: string, updates: Partial<CurrentWordGraphMeaningEdgeDraftV0_1>) =>
    setEdges((previous) => previous.map((edge) => edge.edgeId === edgeId ? { ...edge, ...updates } : edge));
  const updateBridge = (bridgeId: string, updates: Partial<CurrentWordGraphMeaningBridgeDraftV0_1>) =>
    setBridges((previous) => previous.map((bridge) => bridge.bridgeId === bridgeId ? { ...bridge, ...updates } : bridge));
  const updateMapping = (mappingId: string, updates: Partial<CurrentWordGraphMeaningMappingDraftV0_1>) =>
    setMappings((previous) => previous.map((mapping) => mapping.mappingId === mappingId ? { ...mapping, ...updates } : mapping));

  return (
    <section
      aria-label="Current-word graph-to-meaning draft"
      data-testid="current-word-graph-meaning"
      data-identity-key={identityKey}
      className="mt-3 min-w-0 rounded border border-[#46505c] bg-[#0e1411] p-2 text-xs leading-5"
    >
      <h4 className="font-semibold text-[#d8e4ca]">Current-word graph-to-meaning draft</h4>
      <p className="mt-1 text-[#aeb7c5]">
        Connect only the current word’s computed symbolic outputs. The lexical function, relationships, roles and explanatory bridge require your explicit entries; none is selected automatically.
      </p>

      {!identityMatches ? (
        <p role="status" data-testid="current-word-graph-identity-null" className="mt-2 rounded border border-[#746541] bg-[#18140e] p-2 text-[#f0ddb0]">
          PARTIAL_NULL · current draft target {draftTargetWord || "UNKNOWN_OR_NULL"} does not match analyzed form {analyzedWord || "UNKNOWN_OR_NULL"}; identity-bound sense, graph and explanation are withheld.
        </p>
      ) : null}

      {identityMatches ? <>
      <div className={cardClass}>
        <h5 className="font-semibold text-[#f5f7fb]">1. Select a lexical sense</h5>
        {sourceSenseChoices.length === 0 && identityMatches ? (
          <p className="mt-1 text-[#aeb7c5]" data-testid="current-word-graph-source-sense-unavailable">
            No exact-form source sense is available in the current analysis context for this language and dialect. You may enter a separate USER_PROPOSED sense; this does not assert an attested meaning.
          </p>
        ) : null}
        <label className={labelClass}>
          Lexical sense for {analyzedWord || "UNKNOWN_OR_NULL"}
          <select
            aria-label="Lexical sense for current-word graph meaning"
            className={fieldClass}
            value={senseChoice}
            disabled={!identityMatches}
            onChange={(event) => {
              setSenseChoice(event.target.value);
              setProposedSenseLabel("");
              setProposedSenseDefinition("");
              setFunctionForm("");
              setFunctionDescription("");
              setRelationKind("");
              setBridges([]);
              setMappings([]);
              setAlternativeReadingText("");
            }}
          >
            <option value="">Choose a source sense or a user proposal</option>
            {sourceSenseChoices.map(({ optionId, sense }) => (
              <option key={optionId} value={optionId}>{sense.label} · {sense.definition} · CITATION_ENTERED_UNVERIFIED</option>
            ))}
            <option value="USER_PROPOSED">Enter a USER_PROPOSED lexical sense</option>
          </select>
        </label>

        {userSenseSelected ? (
          <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2" data-testid="current-word-graph-user-sense-fields">
            <label className={labelClass}>
              Proposed lexical sense label · USER_PROPOSED
              <input aria-label="Proposed lexical sense label" className={fieldClass} value={proposedSenseLabel} disabled={!identityMatches} onChange={(event) => setProposedSenseLabel(event.target.value)} />
            </label>
            <label className={labelClass}>
              Proposed sense definition · USER_PROPOSED
              <textarea aria-label="Proposed sense definition" className={fieldClass} rows={2} value={proposedSenseDefinition} disabled={!identityMatches} onChange={(event) => setProposedSenseDefinition(event.target.value)} />
            </label>
          </div>
        ) : null}

        {selectedSense ? (
          <div className="mt-2 break-words" data-testid="current-word-graph-selected-sense">
            Selected lexical sense: {selectedSenseDescription(selectedSense)}
            {selectedSourceSense ? (
              <div className="mt-1 text-[#aeb7c5]">
                Source: {selectedSourceSense.source.label} · {selectedSourceSense.sourceRecordId} · {selectedSourceSense.entryLocator} · {selectedSourceSense.sourceSnapshotId} · licensing {selectedSourceSense.source.licensingStatus}
              </div>
            ) : null}
          </div>
        ) : (
          <p className="mt-2 text-[#aeb7c5]" data-testid="current-word-graph-selected-sense-null">Selected lexical sense: UNKNOWN_OR_NULL · no sense selected or proposed.</p>
        )}
      </div>

      <div className={cardClass}>
        <h5 className="font-semibold text-[#f5f7fb]">2. Propose a lexical function</h5>
        <p className="mt-1 text-[#aeb7c5]">These fields are always user-authored. A source-reported whole-word sense does not make this function or relation source-established.</p>
        <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
          <label className={labelClass}>
            Proposed functional form / function · USER_PROPOSED
            <input aria-label="Proposed functional form or function" className={fieldClass} value={functionForm} disabled={!identityMatches} onChange={(event) => setFunctionForm(event.target.value)} />
          </label>
          <label className={labelClass}>
            Proposed function description · USER_PROPOSED
            <textarea aria-label="Proposed function description" className={fieldClass} rows={2} value={functionDescription} disabled={!identityMatches} onChange={(event) => setFunctionDescription(event.target.value)} />
          </label>
        </div>
        <label className={`${labelClass} mt-2`}>
          Proposed relationship kind
        <select aria-label="Proposed lexical function relationship" className={fieldClass} value={relationKind} disabled={!identityMatches} onChange={(event) => setRelationKind(event.target.value as "" | "ACTION_OF_VERB_FUNCTION")}>
            <option value="">Select a relationship kind</option>
            <option value="ACTION_OF_VERB_FUNCTION">ACTION_OF_VERB_FUNCTION · USER_PROPOSED</option>
          </select>
        </label>
        <p className="mt-1 text-[#aeb7c5]">The existing contract supports this explicitly proposed action/function relation. Its applicability is NOT_ASSESSED.</p>
      </div>

      <div className={cardClass}>
        <h5 className="font-semibold text-[#f5f7fb]">3. Connect computed symbolic outputs</h5>
        {nodes.length ? nodes.map((node) => (
          <div key={node.nodeId} className="mt-1 break-words" data-testid="current-word-graph-available-node">
            COMPUTED · {node.text} · {node.symbolKind} · {node.reference.kind === "VOICE_BINDING" ? node.reference.bindingId : node.reference.selectionId} · EXPLORATORY_HYPOTHESIS / USER_PROPOSED
          </div>
        )) : <p className="mt-1 text-[#aeb7c5]" data-testid="current-word-graph-nodes-null">UNKNOWN_OR_NULL · no selected symbolic output is currently computed.</p>}
        <button type="button" disabled={!identityMatches} className="mt-2 rounded border border-[#58645a] px-2 py-1 text-[#d8e4ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a] disabled:opacity-50" onClick={() => {
          const edgeId = addRowId("edge");
          setEdges((previous) => [...previous, { edgeId, leftNodeId: "", rightNodeId: "", relationText: "" }]);
        }}>
          Add user-proposed graph relationship
        </button>
        {edges.map((edge, index) => (
          <fieldset key={edge.edgeId} className="mt-2 grid min-w-0 gap-2 rounded border border-[#38433a] p-2 sm:grid-cols-2" data-testid="current-word-graph-edge-draft">
            <legend className="px-1 text-[#d8e4ca]">User-proposed relationship {index + 1}</legend>
            <label className={labelClass}>
              Left computed node
              <select aria-label={`Left computed node for relationship ${index + 1}`} className={fieldClass} value={edge.leftNodeId} disabled={!identityMatches} onChange={(event) => updateEdge(edge.edgeId, { leftNodeId: event.target.value })}>
                <option value="">Select a computed node</option>
                {nodes.map((node) => <option key={node.nodeId} value={node.nodeId}>{node.text} · {node.nodeId}</option>)}
              </select>
            </label>
            <label className={labelClass}>
              Relationship text · USER_PROPOSED
              <input aria-label={`Relationship text ${index + 1}`} className={fieldClass} value={edge.relationText} disabled={!identityMatches} onChange={(event) => updateEdge(edge.edgeId, { relationText: event.target.value })} />
            </label>
            <label className={labelClass}>
              Right computed node
              <select aria-label={`Right computed node for relationship ${index + 1}`} className={fieldClass} value={edge.rightNodeId} disabled={!identityMatches} onChange={(event) => updateEdge(edge.edgeId, { rightNodeId: event.target.value })}>
                <option value="">Select a computed node</option>
                {nodes.map((node) => <option key={node.nodeId} value={node.nodeId}>{node.text} · {node.nodeId}</option>)}
              </select>
            </label>
            <button type="button" disabled={!identityMatches} className="justify-self-start rounded border border-[#58645a] px-2 py-1 text-[#d8e4ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a] disabled:opacity-50" aria-label={`Remove relationship ${index + 1}`} onClick={() => setEdges((previous) => previous.filter(({ edgeId }) => edgeId !== edge.edgeId))}>Remove relationship</button>
          </fieldset>
        ))}
      </div>

      <div className={cardClass}>
        <h5 className="font-semibold text-[#f5f7fb]">4. Add a separate whole-word bridge proposal</h5>
        <p className="mt-1 text-[#aeb7c5]">This user-authored paraphrase is not enough by itself. The typed builder also requires computed graph outputs and explicit role mappings.</p>
        <button type="button" disabled={!identityMatches} className="mt-2 rounded border border-[#58645a] px-2 py-1 text-[#d8e4ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a] disabled:opacity-50" onClick={() => {
          const bridgeId = addRowId("bridge");
          setBridges((previous) => [...previous, { bridgeId, role: "", text: "" }]);
        }}>
          Add user-proposed whole-word bridge
        </button>
        {bridges.map((bridge, index) => (
          <fieldset key={bridge.bridgeId} className="mt-2 grid min-w-0 gap-2 rounded border border-[#38433a] p-2 sm:grid-cols-2" data-testid="current-word-graph-bridge-draft">
            <legend className="px-1 text-[#d8e4ca]">USER_PROPOSED bridge {index + 1}</legend>
            <label className={labelClass}>
              Interpretation role
              <select aria-label={`Interpretation role for bridge ${index + 1}`} className={fieldClass} value={bridge.role} disabled={!identityMatches} onChange={(event) => updateBridge(bridge.bridgeId, { role: event.target.value as "" | "PRIMARY" | "ALTERNATIVE" })}>
                <option value="">Select a role; no role is chosen automatically</option>
                <option value="PRIMARY">PRIMARY · user-proposed</option>
                <option value="ALTERNATIVE">ALTERNATIVE · user-proposed</option>
              </select>
            </label>
            <label className={labelClass}>
              Whole-word explanatory bridge · USER_PROPOSED
              <textarea aria-label={`Whole-word explanatory bridge ${index + 1}`} className={fieldClass} rows={2} value={bridge.text} disabled={!identityMatches} onChange={(event) => updateBridge(bridge.bridgeId, { text: event.target.value })} />
            </label>
            <button type="button" disabled={!identityMatches} className="justify-self-start rounded border border-[#58645a] px-2 py-1 text-[#d8e4ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a] disabled:opacity-50" aria-label={`Remove bridge ${index + 1}`} onClick={() => {
              setBridges((previous) => previous.filter(({ bridgeId }) => bridgeId !== bridge.bridgeId));
              setMappings((previous) => previous.filter(({ bridgeId }) => bridgeId !== bridge.bridgeId));
            }}>Remove bridge</button>
          </fieldset>
        ))}
      </div>

      <div className={cardClass}>
        <h5 className="font-semibold text-[#f5f7fb]">5. Map a computed output to a proposed functional role</h5>
        <button type="button" disabled={!identityMatches} className="mt-2 rounded border border-[#58645a] px-2 py-1 text-[#d8e4ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a] disabled:opacity-50" onClick={() => {
          const mappingId = addRowId("mapping");
          setMappings((previous) => [...previous, { mappingId, bridgeId: "", symbolOutputId: "", roleLabel: "" }]);
        }}>
          Add proposed role mapping
        </button>
        {mappings.map((mapping, index) => (
          <fieldset key={mapping.mappingId} className="mt-2 grid min-w-0 gap-2 rounded border border-[#38433a] p-2 sm:grid-cols-2" data-testid="current-word-graph-mapping-draft">
            <legend className="px-1 text-[#d8e4ca]">USER_PROPOSED role mapping {index + 1}</legend>
            <label className={labelClass}>
              Whole-word bridge
              <select aria-label={`Bridge for role mapping ${index + 1}`} className={fieldClass} value={mapping.bridgeId} disabled={!identityMatches} onChange={(event) => updateMapping(mapping.mappingId, { bridgeId: event.target.value })}>
                <option value="">Select a user-proposed bridge</option>
                {availableBridges.map(({ bridgeId, role }) => <option key={bridgeId} value={bridgeId}>{role} · {bridgeId}</option>)}
              </select>
            </label>
            <label className={labelClass}>
              Actual computed output
              <select aria-label={`Computed output for role mapping ${index + 1}`} className={fieldClass} value={mapping.symbolOutputId} disabled={!identityMatches} onChange={(event) => updateMapping(mapping.mappingId, { symbolOutputId: event.target.value })}>
                <option value="">Select an evaluated graph output</option>
                {computedNodes.map((node) => <option key={node.symbolOutputId} value={node.symbolOutputId}>{node.text} · {node.symbolOutputId}</option>)}
              </select>
            </label>
            <label className={labelClass}>
              Proposed functional role · USER_PROPOSED
              <input aria-label={`Proposed functional role ${index + 1}`} className={fieldClass} value={mapping.roleLabel} disabled={!identityMatches} onChange={(event) => updateMapping(mapping.mappingId, { roleLabel: event.target.value })} />
            </label>
            <button type="button" disabled={!identityMatches} className="justify-self-start rounded border border-[#58645a] px-2 py-1 text-[#d8e4ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a] disabled:opacity-50" aria-label={`Remove role mapping ${index + 1}`} onClick={() => setMappings((previous) => previous.filter(({ mappingId }) => mappingId !== mapping.mappingId))}>Remove role mapping</button>
          </fieldset>
        ))}
      </div>

      <div className={cardClass}>
        <label className={labelClass}>
          Optional alternative reading · USER_PROPOSED
          <textarea aria-label="Optional alternative reading" className={fieldClass} rows={2} value={alternativeReadingText} disabled={!identityMatches} onChange={(event) => setAlternativeReadingText(event.target.value)} />
        </label>
      </div>

      </> : null}

      <div className="mt-2 min-w-0 rounded border border-[#746541] bg-[#18140e] p-2" data-testid="current-word-graph-meaning-result">
        <h5 className="font-semibold text-[#f0ddb0]">Typed graph-to-meaning result</h5>
        <p data-testid="current-word-symbolic-whole-word-status">
          Whole-word functional motivation: {displayedWholeWordStatus}{selectedSense ? " · user decision required" : " · UNKNOWN_OR_NULL"}
        </p>
        <p data-testid="current-word-symbolic-graph-status">
          Graph-to-meaning: {projection.status}{projection.reasonCodes.length ? ` · ${projection.reasonCodes.join(" · ")}` : ""}
        </p>
        {planBridge?.mappings.length ? planBridge.mappings.map((mapping) => (
          <div key={mapping.mappingId} className="mt-2 break-words" data-testid="current-word-graph-generated-contribution">
            GENERATED CONTRIBUTION · USER_PROPOSAL / USER_PROPOSED · {mapping.graphOutput.text} → {mapping.functionalRole.label} → {mapping.selectedLexicalFunction.exactForm}: {mapping.selectedLexicalFunction.functionText} · {mapping.generatedContribution}
          </div>
        )) : (
          <p className="mt-1" data-testid="current-word-graph-contribution-null">UNKNOWN_OR_NULL · no graph-to-meaning contribution is supported by the current sense, function, edge and mapping inputs.</p>
        )}
        {planBridge?.wholeWordExplanations.length && projection.status !== "PARTIAL_NULL" ? planBridge.wholeWordExplanations.map((explanation) => (
          <div key={explanation.bridgeId} className="mt-2 break-words" data-testid="current-word-graph-whole-word-explanation">
            Generated whole-word explanation · {explanation.bridgeRole} · USER_PROPOSAL / USER_PROPOSED: {explanation.text}
          </div>
        )) : (
          <p className="mt-1" data-testid="current-word-graph-whole-word-null">PARTIAL_NULL / UNKNOWN_OR_NULL · a bridge requires a computed relationship graph and at least one valid role mapping.</p>
        )}
        {identityMatches ? bridges.filter(({ text }) => text.trim()).map((bridge) => (
          <div key={bridge.bridgeId} className="mt-1 break-words" data-testid="current-word-graph-user-bridge-text">
            User-authored bridge text · {bridge.role || "role UNKNOWN_OR_NULL"} · USER_PROPOSAL / USER_PROPOSED: {bridge.text}
          </div>
        )) : null}
        <div className="mt-2 break-words" data-testid="current-word-graph-alternatives">
          Alternatives remain separate: {plan?.ok && plan.sourceFunctionLayer.alternativeReadings.length
            ? plan.sourceFunctionLayer.alternativeReadings.map(({ text, claimLayer, evidenceStatus }) => `${claimLayer} · ${evidenceStatus} · ${text}`).join(" | ")
            : "UNKNOWN_OR_NULL · no alternative reading entered or available."}
        </div>
        <div className="mt-1 break-words" data-testid="current-word-graph-unresolved">
          Open structural items: {plan?.ok
            ? plan.functionalMotivation.unresolvedParts.map(({ text }) => text).join(" | ") || "UNKNOWN_OR_NULL"
            : "UNKNOWN_OR_NULL · no selected lexical sense."}
        </div>
        <div className="mt-2 break-words" data-testid="current-word-graph-provenance">
          Claim layer: EXPLORATORY_HYPOTHESIS · all authored lexical function, graph-edge, role-mapping and bridge claims remain USER_PROPOSED. Linguistic applicability: NOT_ASSESSED. Source-authority promotion: NONE. Historical origin: NOT_CLAIMED.
        </div>
        <p data-testid="current-word-graph-decision">Interpretation remains with the user; none is chosen automatically.</p>
        <p className="mt-1 text-[#aeb7c5]">A mechanically complete symbolic proposal is not independent linguistic proof.</p>
      </div>
    </section>
  );
}
