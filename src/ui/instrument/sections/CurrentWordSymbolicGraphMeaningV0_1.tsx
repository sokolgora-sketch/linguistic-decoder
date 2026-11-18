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
  currentWordGraphMeaningSummaryV0_1,
  currentWordGraphMeaningNodesV0_1,
  currentWordGraphMeaningSourceSensesV0_1,
  type CurrentWordGraphMeaningBridgeDraftV0_1,
  type CurrentWordGraphMeaningEdgeDraftV0_1,
  type CurrentWordGraphMeaningMappingDraftV0_1,
} from "@/ui/instrument/sections/currentWordSymbolicMeaningBridgeAdapter.v0_1";

const fieldClass = "mt-1 w-full min-w-0 rounded border border-[#46505c] bg-[#0d1117] px-2 py-1.5 text-sm text-[#f5f7fb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]";
const labelClass = "block min-w-0 text-xs font-medium text-[#c5ced8]";
const cardClass = "mt-2 min-w-0 rounded border border-[#38433a] p-2 text-xs leading-5";

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
  const sourceAlternatives = sourceSenseChoices.filter(({ sense }) => sense.senseId !== selectedSense?.senseId);
  const sourceRecords = [...new Map(sourceSenseChoices.map((choice) => [choice.sourceRecordId, choice])).values()];
  const summary = currentWordGraphMeaningSummaryV0_1({
    targetWord: analyzedWord,
    selectedSense,
    sourceAlternatives,
    projection,
  });
  const proposedInteractions = bridges.filter(({ text }) => text.trim());
  const nodeTextById = new Map(nodes.map(({ nodeId, text }) => [nodeId, text]));
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
            No exact-form source sense is available in the current analysis context for this language and dialect. You may enter your own proposed meaning; this does not assert an attested meaning.
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
              <option key={optionId} value={optionId}>Source-reported · {sense.definition} · Source citation not independently verified</option>
            ))}
            <option value="USER_PROPOSED">Enter your proposed reading</option>
          </select>
        </label>

        {userSenseSelected ? (
          <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2" data-testid="current-word-graph-user-sense-fields">
            <label className={labelClass}>
              Proposed lexical sense label
              <input aria-label="Proposed lexical sense label" className={fieldClass} value={proposedSenseLabel} disabled={!identityMatches} onChange={(event) => setProposedSenseLabel(event.target.value)} />
            </label>
            <label className={labelClass}>
              Proposed sense definition
              <textarea aria-label="Proposed sense definition" className={fieldClass} rows={2} value={proposedSenseDefinition} disabled={!identityMatches} onChange={(event) => setProposedSenseDefinition(event.target.value)} />
            </label>
          </div>
        ) : null}

        {selectedSense ? (
          <div className="mt-2 break-words" data-testid="current-word-graph-selected-sense-indicator">
            {selectedSourceSense
              ? "A source-reported meaning is selected. Its citation has not been independently verified."
              : "Your proposed meaning is selected."}
          </div>
        ) : (
          <p className="mt-2 text-[#aeb7c5]" data-testid="current-word-graph-selected-sense-indicator-empty">Meaning not established. Choose a source meaning or enter your own proposal.</p>
        )}
      </div>

      <div className={cardClass}>
        <h5 className="font-semibold text-[#f5f7fb]">2. Propose a lexical function</h5>
        <p className="mt-1 text-[#aeb7c5]">These fields are always user-authored. A source-reported whole-word sense does not make this function or relation source-established.</p>
        <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
          <label className={labelClass}>
            Your proposed functional form / function
            <input aria-label="Proposed functional form or function" className={fieldClass} value={functionForm} disabled={!identityMatches} onChange={(event) => setFunctionForm(event.target.value)} />
          </label>
          <label className={labelClass}>
            Your proposed function description
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
        <div className="min-w-0" data-testid="current-word-graph-summary">
          <h5 className="font-semibold text-[#f0ddb0]">Functional explanation</h5>
          <p className="mt-1 font-semibold text-[#f5f7fb]" data-testid="current-word-graph-summary-target">
            {summary.targetWord || "UNKNOWN_OR_NULL"}
          </p>
          {summary.meaning ? (
            <p className="mt-1 break-words" data-testid="current-word-graph-summary-meaning">
              <span className="font-medium">{summary.meaning.kind === "SOURCE_FACT" ? "Source-reported meaning:" : "Your proposed reading:"}</span>{" "}
              {summary.meaning.text}
              {summary.meaning.kind === "SOURCE_FACT" ? <span className="text-[#d8bb7a]"> · Source citation not independently verified</span> : null}
            </p>
          ) : (
            <p className="mt-1" data-testid="current-word-graph-summary-meaning-null">Not established</p>
          )}

          <div className="mt-2 min-w-0" data-testid="current-word-graph-summary-contributions">
            <p className="font-medium text-[#f5f7fb]">How it is constructed</p>
            <p className="text-[#aeb7c5]">Computed symbolic output → your proposed functional role</p>
            {summary.contributions.length ? (
              <ul className="mt-1 list-inside list-disc">
                {summary.contributions.slice(0, 2).map((contribution) => (
                  <li key={contribution.mappingId} className="break-words" data-testid="current-word-graph-summary-contribution">
                    {contribution.computedOutput} → {contribution.proposedRole}
                  </li>
                ))}
                {summary.contributions.length > 2 ? <li>See detailed analysis for {summary.contributions.length - 2} additional contributions.</li> : null}
              </ul>
            ) : (
              <p className="mt-1" data-testid="current-word-graph-summary-contribution-null">Not established — no valid computed contribution is available.</p>
            )}
          </div>

          {proposedInteractions.length ? (
            <div className="mt-2 break-words" data-testid="current-word-graph-summary-proposed-interaction">
              <p className="font-medium text-[#f5f7fb]">Your proposed interaction</p>
              <ul className="mt-1 list-inside list-disc">
                {proposedInteractions.map((bridge) => (
                  <li key={bridge.bridgeId}>
                    {bridge.role || "UNRESOLVED_ROLE"} · USER_PROPOSAL / USER_PROPOSED: {bridge.text}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {summary.sourceMeanings.length ? (
            <p className="mt-2 break-words" data-testid="current-word-graph-summary-source-meanings">
              <span className="font-medium">Source also records:</span>{" "}
              {summary.sourceMeanings.slice(0, 2).map(({ text }) => text).join(" · ")}
              <span className="text-[#d8bb7a]"> · Source citation not independently verified</span>
              {summary.sourceMeanings.length > 2 ? ` · ${summary.sourceMeanings.length - 2} more in detailed evidence` : ""}
            </p>
          ) : null}

          <p className="mt-2 font-medium" data-testid="current-word-graph-plain-status">Status: {summary.statusLabel}</p>
          {summary.missingDescription ? (
            <p className="mt-1 break-words text-[#d8bb7a]" data-testid="current-word-graph-summary-missing">{summary.missingDescription}</p>
          ) : null}
          <p className="mt-1">No interpretation is selected automatically; interpretation remains with you.</p>
        </div>

        <details className="mt-3 min-w-0 border-t border-[#38433a] pt-2" data-testid="current-word-graph-details">
          <summary className="cursor-pointer rounded text-[#d8e4ca] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#d8bb7a]">
            View detailed analysis and evidence
          </summary>
          <div className="mt-2 grid min-w-0 gap-3 break-words">
            <section className="min-w-0" aria-label="Machine status and authority details">
              <h6 className="font-semibold text-[#f5f7fb]">Status and authority</h6>
              <p data-testid="current-word-symbolic-whole-word-status">
                Whole-word functional motivation: {selectedSense ? projection.status : "PARTIAL_NULL · UNKNOWN_OR_NULL"}
              </p>
              <p data-testid="current-word-symbolic-graph-status">
                Graph-to-meaning: {projection.status}{projection.reasonCodes.length ? ` · ${projection.reasonCodes.join(" · ")}` : ""}
              </p>
              <p data-testid="current-word-graph-provenance">
                Claim layer: EXPLORATORY_HYPOTHESIS · authored lexical function, graph edges, role mappings and bridges: USER_PROPOSED · Linguistic applicability: NOT_ASSESSED · Source-authority promotion: NONE · Production authority: NONE · Historical origin: NOT_CLAIMED
              </p>
              <p
                data-testid="current-word-graph-decision"
                data-interpretation-selection-mode={plan?.ok ? plan.functionalMotivation.interpretationSelection.mode : "no_single_winner"}
                data-selected-candidate-id={plan?.ok ? plan.functionalMotivation.interpretationSelection.selectedCandidateId ?? "null" : "null"}
                data-user-decision-posture={plan?.ok ? plan.functionalMotivation.interpretationSelection.userDecisionPosture : "user_decides"}
              >
                Interpretation remains with the user; none is chosen automatically.
              </p>
              <p className="text-[#aeb7c5]">A mechanically complete symbolic proposal is not independent linguistic or etymological verification.</p>
              {selectedSense ? (
                <div className="mt-1" data-testid="current-word-graph-selected-sense">
                  Selected sense identity: {selectedSense.senseId} · {selectedSense.claimLayer} · {selectedSense.evidenceStatus} · source IDs: {selectedSense.sourceIds.join(", ") || "none"}
                  <div>Definition: {selectedSense.definition}</div>
                </div>
              ) : <p data-testid="current-word-graph-selected-sense-null">UNKNOWN_OR_NULL · no selected or proposed sense.</p>}
            </section>

            <section className="min-w-0" aria-label="Source records and citations">
              <h6 className="font-semibold text-[#f5f7fb]">Source records and citations</h6>
              {sourceRecords.length ? sourceRecords.map((record) => {
                const source = record.source;
                const recordSenses = sourceSenseChoices.filter(({ sourceRecordId }) => sourceRecordId === record.sourceRecordId);
                return (
                  <div key={record.sourceRecordId} className="mt-1 rounded border border-[#38433a] p-2" data-testid="current-word-graph-source-record">
                    <p>{source.label} · record {record.sourceRecordId} · entry {record.entryLocator}</p>
                    <p>Snapshot: {record.sourceSnapshotId}</p>
                    <p>Citation: {source.citationStatus} · licensing: {source.licensingStatus}</p>
                    <a className="break-all underline" href={source.url} target="_blank" rel="noreferrer">{source.url}</a>
                    <ul className="mt-1 list-inside list-disc">
                      {recordSenses.map(({ sense }) => <li key={sense.senseId}>{sense.senseId} · {sense.claimLayer} · {sense.evidenceStatus}</li>)}
                    </ul>
                  </div>
                );
              }) : <p>UNKNOWN_OR_NULL · no exact-form source records are available.</p>}
            </section>

            <section className="min-w-0" aria-label="Computed mappings and authored bridge">
              <h6 className="font-semibold text-[#f5f7fb]">Computed contributions</h6>
              {planBridge?.mappings.length ? planBridge.mappings.map((mapping) => (
                <article key={mapping.mappingId} className="mt-1 rounded border border-[#38433a] p-2" data-testid="current-word-graph-generated-contribution">
                  <p>{mapping.generatedContribution}</p>
                  <p>Mapping {mapping.mappingId} · bridge {mapping.bridgeId} · relation {mapping.relationType}</p>
                  <p>Graph output: {mapping.graphOutput.symbolId} · producer {mapping.graphOutput.producerOperationId} · {mapping.graphOutput.claimLayer} · {mapping.graphOutput.evidenceStatus} · source IDs: {mapping.graphOutput.sourceIds.join(", ") || "none"}</p>
                  <p>Role: {mapping.functionalRole.roleId} · {mapping.functionalRole.claimLayer} · {mapping.functionalRole.evidenceStatus} · source IDs: {mapping.functionalRole.sourceIds.join(", ") || "none"}</p>
                  <p>Function: {mapping.selectedLexicalFunction.exactForm} · {mapping.selectedLexicalFunction.claimLayer} · {mapping.selectedLexicalFunction.evidenceStatus} · relation {mapping.selectedLexicalFunction.compositionOperationId}: {mapping.selectedLexicalFunction.compositionStatus} / {mapping.selectedLexicalFunction.compositionClaimLayer} / {mapping.selectedLexicalFunction.compositionEvidenceStatus} · linguistic applicability {mapping.selectedLexicalFunction.linguisticApplicability}</p>
                </article>
              )) : <p data-testid="current-word-graph-contribution-null">UNKNOWN_OR_NULL · no valid computed contribution.</p>}

              <h6 className="mt-2 font-semibold text-[#f5f7fb]">Generated whole-word explanation status</h6>
              {planBridge?.wholeWordExplanations.length ? planBridge.wholeWordExplanations.map((explanation) => (
                <p key={explanation.bridgeId} className="mt-1" data-testid="current-word-graph-whole-word-explanation">
                  Bridge {explanation.bridgeId} · {explanation.bridgeRole} · {explanation.claimLayer} / {explanation.evidenceStatus} · composed from the unique generated contributions listed above.
                </p>
              )) : (
                <p className="mt-1" data-testid="current-word-graph-whole-word-null">
                  {plan?.ok && plan.evaluation.ok && plan.evaluation.symbolicComposition.status === "PARTIAL_NULL"
                    ? "PARTIAL_NULL / UNKNOWN_OR_NULL · computed contributions may be shown, but unresolved target structure prevents a whole-word explanation."
                    : "PARTIAL_NULL / UNKNOWN_OR_NULL · a bridge requires a computed relationship graph and at least one valid role mapping."}
                </p>
              )}

              <h6 className="mt-2 font-semibold text-[#f5f7fb]">Original user-authored bridge</h6>
              {bridges.filter(({ text }) => text.trim()).length ? bridges.filter(({ text }) => text.trim()).map((bridge) => (
                <p key={bridge.bridgeId} className="mt-1" data-testid="current-word-graph-user-bridge-text">
                  Bridge {bridge.bridgeId} · {bridge.role || "UNKNOWN_OR_NULL"} · USER_PROPOSAL / USER_PROPOSED: {bridge.text}
                </p>
              )) : <p>UNKNOWN_OR_NULL · no user-authored bridge text.</p>}
            </section>

            <section className="min-w-0" aria-label="Graph relationships and operation trace">
              <h6 className="font-semibold text-[#f5f7fb]">Graph relationships</h6>
              {edges.length ? (
                <ul className="list-inside list-disc" data-testid="current-word-graph-relationships">
                  {edges.map((edge) => (
                    <li key={edge.edgeId}>{edge.edgeId} · {nodeTextById.get(edge.leftNodeId) ?? edge.leftNodeId} —{edge.relationText || "UNKNOWN_OR_NULL"}→ {nodeTextById.get(edge.rightNodeId) ?? edge.rightNodeId} · USER_PROPOSED</li>
                  ))}
                </ul>
              ) : <p>UNKNOWN_OR_NULL · no user-proposed graph relationships.</p>}
              <h6 className="mt-2 font-semibold text-[#f5f7fb]">Evaluated operation trace</h6>
              {plan?.ok && plan.evaluation.ok ? (
                <ol className="list-inside list-decimal" data-testid="current-word-graph-operation-trace">
                  {plan.evaluation.operationTrace.map((trace) => (
                    <li key={trace.operationId}>
                      {trace.operationId} · {trace.kind} · {trace.status} · depends on {trace.dependsOn.join(", ") || "none"} · {trace.contribution ?? "UNKNOWN_OR_NULL"} · reasons: {trace.reasonCodes.join(", ") || "none"}
                    </li>
                  ))}
                </ol>
              ) : <p data-testid="current-word-graph-operation-trace">UNKNOWN_OR_NULL · no successful operation trace is available.</p>}
            </section>

            <section className="min-w-0" aria-label="Alternatives and unresolved claims">
              <h6 className="font-semibold text-[#f5f7fb]">Alternatives</h6>
              <div className="mt-1" data-testid="current-word-graph-alternatives">
                {plan?.ok && plan.sourceFunctionLayer.alternativeReadings.length
                  ? plan.sourceFunctionLayer.alternativeReadings.map(({ readingId, text, claimLayer, evidenceStatus, sourceIds }) => `${readingId} · ${claimLayer} · ${evidenceStatus} · source IDs: ${sourceIds.join(", ") || "none"} · ${text}`).join(" | ")
                  : "UNKNOWN_OR_NULL · no alternative reading entered or available."}
              </div>
              <h6 className="mt-2 font-semibold text-[#f5f7fb]">Open claims and reason codes</h6>
              <div className="mt-1" data-testid="current-word-graph-unresolved">
                {plan?.ok
                  ? plan.functionalMotivation.unresolvedParts.map(({ claimId, text, claimLayer, evidenceStatus, sourceIds }) => `${claimId} · ${claimLayer} / ${evidenceStatus} · source IDs: ${sourceIds.join(", ") || "none"} · ${text}`).join(" | ") || "UNKNOWN_OR_NULL"
                  : "UNKNOWN_OR_NULL · no selected lexical sense."}
              </div>
              <ul className="mt-1 list-inside list-disc" data-testid="current-word-graph-reason-codes">
                {projection.reasonCodes.map((reason) => <li key={reason}>{reason}</li>)}
                {plan?.ok ? plan.graphMeaningBridge.reasonCodes.map((reason) => <li key={`bridge:${reason}`}>{reason}</li>) : null}
                {plan?.ok ? plan.graphMeaningBridge.unresolvedMappings.flatMap((mapping) => mapping.reasonCodes.map((reason) => <li key={`${mapping.mappingId}:${reason}`}>{reason}</li>)) : null}
                {!projection.reasonCodes.length && (!plan?.ok || !plan.graphMeaningBridge.reasonCodes.length) ? <li>UNKNOWN_OR_NULL · no reason code supplied.</li> : null}
              </ul>
            </section>
          </div>
        </details>
      </div>
    </section>
  );
}
