import {
  buildCurrentWordGraphMeaningProjectionV0_1,
  currentWordGraphMeaningNodesV0_1,
  currentWordGraphMeaningSourceSensesV0_1,
  type CurrentWordGraphMeaningEdgeDraftV0_1,
  type CurrentWordGraphMeaningMappingDraftV0_1,
} from "@/ui/instrument/sections/currentWordSymbolicMeaningBridgeAdapter.v0_1";
import { buildCurrentWordSymbolicDraftProjectionV0_1 } from "@/ui/instrument/sections/CurrentWordSymbolicDraftV0_1";
import type { SymbolicFunctionalPlanNodeReferenceV0_1 } from "@/shared/openInstrument/symbolicFunctionalOperationPlanBuilder.v0_1";
import type { AlbanianKaikkiExactLexicalSourceFactV0_1 } from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";

const sense = {
  senseId: "user.dallim.distinguishing",
  label: "Act of distinguishing",
  definition: "The act of distinguishing things.",
  claimLayer: "USER_PROPOSAL" as const,
  evidenceStatus: "USER_PROPOSED" as const,
  sourceIds: [],
  functionalFrame: "OTHER" as const,
};

function makeProjection(dAssociation = "d:division") {
  const current = buildCurrentWordSymbolicDraftProjectionV0_1({
    exactSpelling: "DALLIM",
    language: "Albanian",
    variety: "Standard Albanian",
    selections: {
      spectrumCandidateByOccurrenceId: {
        "spectrum:D@0-1": dAssociation,
        "spectrum:L@2-3": "l:spreading",
        "spectrum:L@3-4": "l:linear-flow",
        "spectrum:M@5-6": "m:result",
      },
      voiceDraftByEventId: {
        "voice:A@1": { operatorCandidateId: "voice-a:initiate-ground", operandOccurrenceId: "spectrum:D@0-1" },
        "voice:I@4": { operatorCandidateId: "voice-i:specify-focus", operandOccurrenceId: "spectrum:L@3-4" },
      },
    },
  });
  const nodes = currentWordGraphMeaningNodesV0_1(current.operations, current.evaluation);
  const spectrumSelections = [
    { selectionId: "spectrum:D@0-1", unit: "D", start: 0, end: 1, associationCandidateId: dAssociation },
    { selectionId: "spectrum:L@2-3", unit: "L", start: 2, end: 3, associationCandidateId: "l:spreading" },
    { selectionId: "spectrum:L@3-4", unit: "L", start: 3, end: 4, associationCandidateId: "l:linear-flow" },
    { selectionId: "spectrum:M@5-6", unit: "M", start: 5, end: 6, associationCandidateId: "m:result" },
  ];
  const voiceBindings = [
    {
      bindingId: "voice:A@1",
      voice: "A" as const,
      position: 1,
      operatorCandidateId: "voice-a:initiate-ground",
      input: { kind: "SPECTRUM_SELECTION" as const, selectionId: "spectrum:D@0-1" },
    },
    {
      bindingId: "voice:I@4",
      voice: "I" as const,
      position: 4,
      operatorCandidateId: "voice-i:specify-focus",
      input: { kind: "SPECTRUM_SELECTION" as const, selectionId: "spectrum:L@3-4" },
    },
  ];
  const node = (nodeId: string) => nodes.find(({ nodeId: candidate }) => candidate === nodeId)!;
  const edges: CurrentWordGraphMeaningEdgeDraftV0_1[] = [
    { edgeId: "edge-d-a", leftNodeId: "selection:spectrum:D@0-1", rightNodeId: "voice:voice:A@1", relationText: "produces" },
    { edgeId: "edge-a-l-first", leftNodeId: "voice:voice:A@1", rightNodeId: "selection:spectrum:L@2-3", relationText: "separates within" },
    { edgeId: "edge-l-first-second", leftNodeId: "selection:spectrum:L@2-3", rightNodeId: "selection:spectrum:L@3-4", relationText: "is traced across" },
    { edgeId: "edge-l-i", leftNodeId: "selection:spectrum:L@3-4", rightNodeId: "voice:voice:I@4", relationText: "is focused as" },
    { edgeId: "edge-i-m", leftNodeId: "voice:voice:I@4", rightNodeId: "selection:spectrum:M@5-6", relationText: "yields" },
  ];
  const mappings: CurrentWordGraphMeaningMappingDraftV0_1[] = [
    { mappingId: "mapping-a", bridgeId: "bridge-primary", symbolOutputId: node("voice:voice:A@1").symbolOutputId, roleLabel: "an initiated distinction" },
    { mappingId: "mapping-i", bridgeId: "bridge-primary", symbolOutputId: node("voice:voice:I@4").symbolOutputId, roleLabel: "a focused distinction" },
  ];
  return { current, nodes, spectrumSelections, voiceBindings, edges, mappings };
}

function build(dAssociation = "d:division", overrides: Partial<Parameters<typeof buildCurrentWordGraphMeaningProjectionV0_1>[0]> = {}) {
  const fixture = makeProjection(dAssociation);
  return buildCurrentWordGraphMeaningProjectionV0_1({
    identityMatches: true,
    target: { exactSpelling: "DALLIM", language: "Albanian", variety: "Standard Albanian" },
    selectedSense: sense,
    alternativeSenses: [],
    sources: [],
    functionForm: "DALLOJ",
    functionDescription: "distinguish or recognize one thing from another",
    relationKind: "ACTION_OF_VERB_FUNCTION",
    ...fixture,
    bridges: [{ bridgeId: "bridge-primary", role: "PRIMARY", text: "The user-proposed act of distinguishing is represented by the connected graph." }],
    alternativeReadingText: "",
    ...overrides,
  });
}

describe("current-word graph meaning adapter v0.1", () => {
  it("accepts only exact-form source senses and retains unverified provenance", () => {
    const facts = [{
      sourceRecordId: "fixture:dallim",
      entryLocator: "dallim#Albanian",
      physicalRecordOrdinal: 1,
      language: "Albanian",
      languageCode: "sq",
      form: "DALLIM",
      partOfSpeech: "noun",
      senses: [{ senseId: "fixture.sense.1", glosses: ["act of distinguishing"] }],
      ipaObservations: [],
      sourceStatus: "observed_external_snapshot",
      attestationTruth: "fact",
      pronunciationAuthority: {},
      sourceSnapshot: { sourceFamilyId: "fixture", sourceUrl: "https://example.invalid/dallim", sha256: "a".repeat(64), bytes: 1 },
    }] as unknown as AlbanianKaikkiExactLexicalSourceFactV0_1[];
    const choices = currentWordGraphMeaningSourceSensesV0_1("DALLIM", facts);

    expect(currentWordGraphMeaningSourceSensesV0_1("DALLOJ", facts)).toEqual([]);
    expect(choices).toHaveLength(1);
    expect(choices[0]?.sense).toMatchObject({
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: ["kaikki:fixture:dallim"],
      definition: "act of distinguishing",
    });
    expect(choices[0]?.source).toMatchObject({
      citationStatus: "CITATION_ENTERED_UNVERIFIED",
      licensingStatus: "NOT_ASSESSED",
    });
  });

  it("maps only computed current-word symbols into builder node references", () => {
    const fixture = makeProjection();
    expect(fixture.current.evaluation.ok).toBe(true);
    expect(fixture.nodes.map(({ text, reference, symbolOutputId }) => [text, reference, symbolOutputId])).toEqual([
      ["division", { kind: "SPECTRUM_SELECTION", selectionId: "spectrum:D@0-1" }, "symbol:selection:spectrum:D@0-1"],
      ["spreading", { kind: "SPECTRUM_SELECTION", selectionId: "spectrum:L@2-3" }, "symbol:selection:spectrum:L@2-3"],
      ["linear flow", { kind: "SPECTRUM_SELECTION", selectionId: "spectrum:L@3-4" }, "symbol:selection:spectrum:L@3-4"],
      ["result", { kind: "SPECTRUM_SELECTION", selectionId: "spectrum:M@5-6" }, "symbol:selection:spectrum:M@5-6"],
      ["initiated(division)", { kind: "VOICE_BINDING", bindingId: "voice:A@1" }, "symbol:voice:voice:A@1"],
      ["focused(linear flow)", { kind: "VOICE_BINDING", bindingId: "voice:I@4" }, "symbol:voice:voice:I@4"],
    ]);
  });

  it("uses computed outputs and explicit edges, function and mappings for a proposed contribution", () => {
    const result = build();
    expect(result.status).toBe("COMPLETE_PROPOSED");
    expect(result.plan?.ok).toBe(true);
    if (!result.plan?.ok) return;
    expect(result.plan.evaluation.operationTrace.filter(({ kind, status }) => kind === "APPLY_VOICE_OPERATOR" && status === "COMPUTED").map(({ contribution }) => contribution)).toEqual([
      "INITIATE / GROUND(division) → initiated(division)",
      "SPECIFY / FOCUS(linear flow) → focused(linear flow)",
    ]);
    expect(result.plan.graphMeaningBridge.mappings.map(({ graphOutput, selectedLexicalFunction, generatedContribution }) => ({
      output: graphOutput.text,
      sense: selectedLexicalFunction.claimLayer,
      functionStatus: selectedLexicalFunction.evidenceStatus,
      relationStatus: selectedLexicalFunction.compositionEvidenceStatus,
      contribution: generatedContribution,
    }))).toEqual([
      {
        output: "initiated(division)",
        sense: "USER_PROPOSAL",
        functionStatus: "USER_PROPOSED",
        relationStatus: "USER_PROPOSED",
        contribution: expect.stringContaining("distinguish or recognize one thing from another"),
      },
      {
        output: "focused(linear flow)",
        sense: "USER_PROPOSAL",
        functionStatus: "USER_PROPOSED",
        relationStatus: "USER_PROPOSED",
        contribution: expect.stringContaining("focused(linear flow)"),
      },
    ]);
    expect(result.plan.graphMeaningBridge).toMatchObject({
      sourceAuthorityPromotion: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      interpretationSelection: { mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" },
    });
  });

  it("recomputes meaning when the selected spectrum operand changes", () => {
    const division = build("d:division");
    const light = build("d:light");
    expect(division.plan?.ok && division.plan.graphMeaningBridge.mappings[0]?.graphOutput.text).toBe("initiated(division)");
    expect(light.plan?.ok && light.plan.graphMeaningBridge.mappings[0]?.graphOutput.text).toBe("initiated(light)");
    expect(light.plan?.ok && light.plan.graphMeaningBridge.mappings[0]?.generatedContribution).not.toBe(
      division.plan?.ok ? division.plan.graphMeaningBridge.mappings[0]?.generatedContribution : undefined,
    );
  });

  it("keeps missing edges and mappings partial, and withholds identity-mismatched plans", () => {
    const fixture = makeProjection();
    const missingEdge = build("d:division", { edges: fixture.edges.slice(0, 2) });
    const missingMapping = build("d:division", { mappings: [] });
    const mismatched = build("d:division", { identityMatches: false });

    expect(missingEdge.status).toBe("PARTIAL_NULL");
    expect(missingMapping.status).toBe("PARTIAL_NULL");
    expect(missingMapping.reasonCodes).toContain("GRAPH_MEANING_ROLE_MAPPING_REQUIRED");
    expect(mismatched.plan).toBeNull();
    expect(mismatched.reasonCodes).toContain("CURRENT_WORD_IDENTITY_MISMATCH");
  });

  it("retains explicit node references as graph edges rather than treating a bridge phrase as a relationship", () => {
    const fixture = makeProjection();
    const result = build("d:division", {
      edges: [],
      mappings: fixture.mappings,
      bridges: [{ bridgeId: "bridge-primary", role: "PRIMARY", text: "A free-text explanation by itself." }],
    });
    expect(result.status).toBe("PARTIAL_NULL");
    expect(result.plan?.ok && result.plan.graphMeaningBridge.wholeWordExplanations).toEqual([]);
    expect(result.reasonCodes).toContain("TRANSFORMATION_REQUIRES_RELATIONS:represent:transformation");
  });
});
