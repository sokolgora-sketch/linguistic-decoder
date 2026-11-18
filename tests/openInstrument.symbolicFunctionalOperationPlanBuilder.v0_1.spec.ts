import {
  buildSymbolicFunctionalOperationPlanV0_1,
  type SymbolicFunctionalOperationPlanInputV0_1,
} from "@/shared/openInstrument/symbolicFunctionalOperationPlanBuilder.v0_1";
import {
  EMBRIOMORPHEME_SPECTRUM_V0_1,
  getEmbriomorphemeAssociationV0_1,
} from "@/shared/openInstrument/embriomorphemeSpectrum.v0_1";
import {
  SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_3,
} from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";
import type { SymbolicFunctionalContentInputV0_1 } from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";

function associationId(unit: string, association: string): string {
  const candidate = [
    ...EMBRIOMORPHEME_SPECTRUM_V0_1.flatMap(({ associations }) => associations),
  ].find((entry) => entry.unit === unit && entry.association === association);
  if (!candidate) throw new Error(`Missing fixture association ${unit}:${association}`);
  return candidate.candidateId;
}

function operatorId(voice: "A" | "I" | "U"): string {
  const candidate = SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_3.find((entry) => entry.voice === voice);
  if (!candidate) throw new Error(`Missing fixture Voice operator ${voice}`);
  return candidate.candidateId;
}

function dallimSourceInput(): SymbolicFunctionalContentInputV0_1 {
  const dallimSourceId = "fjale-dallim";
  const dallojSourceId = "fjale-dalloj";
  return {
    target: {
      exactSpelling: "DALLIM",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSense: {
        senseId: "dallim.action-of-distinguishing",
        label: "Act of distinguishing",
        definition: "The action according to the meanings of DALLOJ and DALLOHEM.",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [dallimSourceId],
        functionalFrame: "ACTION_OF_VERB_FUNCTION",
      },
      alternativeSenses: [
        {
          senseId: "dallim.distinguishing-feature-or-difference",
          label: "Distinguishing feature or difference",
          definition: "A feature that makes one person or thing distinguishable from another; a difference.",
          claimLayer: "SOURCE_FACT",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
          sourceIds: [dallimSourceId],
          functionalFrame: "OTHER",
        },
        {
          senseId: "dallim.unequal-treatment",
          label: "Unequal treatment",
          definition: "Unequal treatment that favors or evaluates people or things by differing criteria.",
          claimLayer: "SOURCE_FACT",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
          sourceIds: [dallimSourceId],
          functionalFrame: "OTHER",
        },
      ],
    },
    sources: [
      {
        sourceId: dallimSourceId,
        label: "FJALË — DALLIM",
        url: "https://fjale.al/index.php/dallim",
        locator: "sense 1, action according to DALLOJ and DALLOHEM; senses 2–3 retained separately",
        citationStatus: "CITATION_ENTERED_UNVERIFIED",
        licensingStatus: "NOT_ASSESSED",
      },
      {
        sourceId: dallojSourceId,
        label: "FJALË — DALLOJ",
        url: "https://fjale.al/index.php/dalloj",
        locator: "transitive sense 1, distinguishing or recognizing one from another",
        citationStatus: "CITATION_ENTERED_UNVERIFIED",
        licensingStatus: "NOT_ASSESSED",
      },
    ],
    segmentationCandidates: [
      {
        candidateId: "user-proposed-dall-plus-im",
        components: [
          { componentId: "dall", exactSpelling: "DALL" },
          { componentId: "im", exactSpelling: "IM" },
        ],
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      },
    ],
    functionCandidates: [
      {
        candidateId: "dalloj.distinguish-or-recognize",
        exactForm: "DALLOJ",
        sourceSenseId: "dalloj.transitive-sense-1",
        functionText: "Perceive or mentally recognize a person, thing, or phenomenon as distinct from another; notice and know it rather than confuse it with another.",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: [dallojSourceId],
      },
    ],
    componentFunctionBindings: [],
    voiceRoleCandidates: [],
    consonantAssociationCandidates: [],
    compositionOperations: [
      {
        operationId: "source-reported-dallim-action-link",
        operationType: "ACTION_OF_VERB_FUNCTION",
        candidateLabel: "Dictionary-defined action relation to DALLOJ / DALLOHEM",
        targetSenseId: "dallim.action-of-distinguishing",
        functionCandidateId: "dalloj.distinguish-or-recognize",
        operationStatus: "SOURCE_REPORTED_UNVERIFIED",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        relationSourceIds: [dallimSourceId],
      },
    ],
    alternativeReadings: [],
    unresolvedClaims: [
      {
        claimId: "dallim-im-morphology",
        text: "DALL + IM is a separate user-proposed segmentation; the role and morphological status of IM are not established here.",
        sourceIds: [],
      },
    ],
  };
}

function dallimInput(
  dAssociation = "division",
): SymbolicFunctionalOperationPlanInputV0_1 {
  const selectedSenseId = "dallim.action-of-distinguishing";
  const spectrumSelections = [
    { selectionId: "d", unit: "D", start: 0, end: 1, associationCandidateId: associationId("D", dAssociation) },
    { selectionId: "ll", unit: "LL", start: 2, end: 4, associationCandidateId: associationId("LL", "clarity") },
    { selectionId: "m", unit: "M", start: 5, end: 6, associationCandidateId: associationId("M", "result") },
  ] as const;
  const voiceBindings = [
    {
      bindingId: "a-initiates-d",
      voice: "A" as const,
      position: 1,
      operatorCandidateId: operatorId("A"),
      input: { kind: "SPECTRUM_SELECTION" as const, selectionId: "d" },
    },
    {
      bindingId: "i-focuses-ll",
      voice: "I" as const,
      position: 4,
      operatorCandidateId: operatorId("I"),
      input: { kind: "SPECTRUM_SELECTION" as const, selectionId: "ll" },
    },
  ];
  const functionalEdges = [
    {
      edgeId: "division-initiation",
      left: { kind: "SPECTRUM_SELECTION" as const, selectionId: "d" },
      right: { kind: "VOICE_BINDING" as const, bindingId: "a-initiates-d" },
      relationText: "produces",
    },
    {
      edgeId: "initiation-clarity",
      left: { kind: "VOICE_BINDING" as const, bindingId: "a-initiates-d" },
      right: { kind: "SPECTRUM_SELECTION" as const, selectionId: "ll" },
      relationText: "is paired with",
    },
    {
      edgeId: "clarity-focus",
      left: { kind: "SPECTRUM_SELECTION" as const, selectionId: "ll" },
      right: { kind: "VOICE_BINDING" as const, bindingId: "i-focuses-ll" },
      relationText: "is focused as",
    },
    {
      edgeId: "focus-result",
      left: { kind: "VOICE_BINDING" as const, bindingId: "i-focuses-ll" },
      right: { kind: "SPECTRUM_SELECTION" as const, selectionId: "m" },
      relationText: "yields",
    },
  ] as const;

  return {
    target: { exactSpelling: "DALLIM", language: "Albanian", variety: "Standard Albanian" },
    sourceFunctionInput: dallimSourceInput(),
    spectrumSelections,
    voiceBindings,
    functionalEdges,
    transformationLabel: "user-proposed embryo-first distinction chain",
    functionalBridges: [
      {
        bridgeId: "focused-distinction",
        targetSenseId: selectedSenseId,
        role: "PRIMARY",
        status: "USER_PROPOSED",
        text: "This illustrative proposal pairs an initiated contribution with focused clarity as one possible functional reading of the act of distinguishing.",
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      },
      {
        bridgeId: "attentive-separation-alternative",
        targetSenseId: selectedSenseId,
        role: "ALTERNATIVE",
        status: "USER_PROPOSED",
        text: "Alternatively, an initiated contribution and focused clarity are proposed as a way to attend to one thing as distinct from another.",
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      },
    ],
    functionalRoleMappings: [
      {
        mappingId: "initiated-division-contribution",
        bridgeId: "focused-distinction",
        symbolOutputId: "symbol:voice:a-initiates-d",
        selectedSenseId,
        functionCandidateId: "dalloj.distinguish-or-recognize",
        compositionOperationId: "source-reported-dallim-action-link",
        functionalRole: {
          roleId: "initiated-division",
          label: "an initiated contribution proposed for distinguishing",
          claimLayer: "USER_PROPOSAL",
          evidenceStatus: "USER_PROPOSED",
          sourceIds: [],
        },
        relationType: "PROPOSED_CONTRIBUTES_TO_SELECTED_LEXICAL_FUNCTION",
      },
      {
        mappingId: "focused-clarity-contribution",
        bridgeId: "attentive-separation-alternative",
        symbolOutputId: "symbol:voice:i-focuses-ll",
        selectedSenseId,
        functionCandidateId: "dalloj.distinguish-or-recognize",
        compositionOperationId: "source-reported-dallim-action-link",
        functionalRole: {
          roleId: "focused-clarity",
          label: "a focused clarity contribution proposed for distinguishing",
          claimLayer: "USER_PROPOSAL",
          evidenceStatus: "USER_PROPOSED",
          sourceIds: [],
        },
        relationType: "PROPOSED_CONTRIBUTES_TO_SELECTED_LEXICAL_FUNCTION",
      },
    ],
    unresolvedParts: [
      {
        claimId: "im-role-unresolved",
        text: "The proposed DALL + IM segmentation does not establish a suffix function; the selected M=result consonant association does not explain IM.",
        claimLayer: "UNKNOWN_OR_NULL",
        evidenceStatus: "UNKNOWN_OR_NULL",
        sourceIds: [],
      },
    ],
  };
}

function syntheticNonDallimInput(): SymbolicFunctionalOperationPlanInputV0_1 {
  const sourceFunctionInput: SymbolicFunctionalContentInputV0_1 = {
    target: {
      exactSpelling: "BLU",
      language: "Synthetic test language",
      variety: "Test fixture",
      selectedSense: {
        senseId: "synthetic.blu.sense",
        label: "Synthetic target function",
        definition: "A test-only user-proposed target concept.",
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
        functionalFrame: "OTHER",
      },
      alternativeSenses: [],
    },
    sources: [],
    segmentationCandidates: [],
    functionCandidates: [
      {
        candidateId: "synthetic.blu.function",
        exactForm: "BLU",
        sourceSenseId: "synthetic.blu.function-sense",
        functionText: "a test-only synthetic function",
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      },
    ],
    componentFunctionBindings: [],
    voiceRoleCandidates: [],
    consonantAssociationCandidates: [],
    compositionOperations: [
      {
        operationId: "synthetic.blu.sense-function",
        operationType: "ACTION_OF_VERB_FUNCTION",
        candidateLabel: "Synthetic test relation",
        targetSenseId: "synthetic.blu.sense",
        functionCandidateId: "synthetic.blu.function",
        operationStatus: "USER_PROPOSED",
        evidenceStatus: "USER_PROPOSED",
        relationSourceIds: [],
      },
    ],
    alternativeReadings: [],
    unresolvedClaims: [],
  };
  return {
    target: { exactSpelling: "BLU", language: "Synthetic test language", variety: "Test fixture" },
    sourceFunctionInput,
    spectrumSelections: [
      { selectionId: "b", unit: "B", start: 0, end: 1, associationCandidateId: associationId("B", "growth") },
      { selectionId: "l", unit: "L", start: 1, end: 2, associationCandidateId: associationId("L", "spreading") },
    ],
    voiceBindings: [
      {
        bindingId: "u-deepens-b",
        voice: "U",
        position: 2,
        operatorCandidateId: operatorId("U"),
        input: { kind: "SPECTRUM_SELECTION", selectionId: "b" },
      },
    ],
    functionalEdges: [
      {
        edgeId: "b-to-u",
        left: { kind: "SPECTRUM_SELECTION", selectionId: "b" },
        right: { kind: "VOICE_BINDING", bindingId: "u-deepens-b" },
        relationText: "is transformed as",
      },
      {
        edgeId: "u-to-l",
        left: { kind: "VOICE_BINDING", bindingId: "u-deepens-b" },
        right: { kind: "SPECTRUM_SELECTION", selectionId: "l" },
        relationText: "is related to",
      },
    ],
    transformationLabel: "synthetic compiler generality fixture",
    functionalBridges: [
      {
        bridgeId: "synthetic-bridge",
        targetSenseId: "synthetic.blu.sense",
        role: "PRIMARY",
        status: "USER_PROPOSED",
        text: "A synthetic user-proposed bridge for exercising the generic plan compiler.",
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      },
    ],
    functionalRoleMappings: [
      {
        mappingId: "synthetic-growth-contribution",
        bridgeId: "synthetic-bridge",
        symbolOutputId: "symbol:voice:u-deepens-b",
        selectedSenseId: "synthetic.blu.sense",
        functionCandidateId: "synthetic.blu.function",
        compositionOperationId: "synthetic.blu.sense-function",
        functionalRole: {
          roleId: "synthetic-transformed-growth",
          label: "a transformed growth result",
          claimLayer: "USER_PROPOSAL",
          evidenceStatus: "USER_PROPOSED",
          sourceIds: [],
        },
        relationType: "PROPOSED_CONTRIBUTES_TO_SELECTED_LEXICAL_FUNCTION",
      },
    ],
    unresolvedParts: [],
  };
}

describe("symbolic functional operation plan builder v0.1", () => {
  it("compiles the DALLIM source-linked sense into the existing v0.3 evaluator", () => {
    const input = dallimInput();
    const result = buildSymbolicFunctionalOperationPlanV0_1(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.evaluation.ok).toBe(true);
    if (!result.evaluation.ok) return;
    expect(result.evaluation.target.codePoints).toEqual(
      Array.from("DALLIM").map((character, position) => ({ character, position })),
    );
    expect(result.evaluation.target.writtenVoices).toEqual([
      { voice: "A", position: 1 },
      { voice: "I", position: 4 },
    ]);
    expect(result.evaluation.spectrumOccurrences.map(({ unit, span, selectedAssociationIds }) => ({
      unit, span, selectedAssociationIds,
    }))).toEqual([
      { unit: "D", span: { start: 0, end: 1 }, selectedAssociationIds: [associationId("D", "division")] },
      { unit: "LL", span: { start: 2, end: 4 }, selectedAssociationIds: [associationId("LL", "clarity")] },
      { unit: "M", span: { start: 5, end: 6 }, selectedAssociationIds: [associationId("M", "result")] },
    ]);
    expect(result.evaluation.voiceEvents.map(({ eventId, appliedOperationIds }) => ({ eventId, appliedOperationIds }))).toEqual([
      { eventId: "voice:A@1", appliedOperationIds: ["apply:a-initiates-d"] },
      { eventId: "voice:I@4", appliedOperationIds: ["apply:i-focuses-ll"] },
    ]);
    expect(result.evaluation.operationTrace.filter(({ kind }) => kind === "APPLY_VOICE_OPERATOR").map(({ contribution }) => contribution)).toEqual([
      "INITIATE / GROUND(division) → initiated(division)",
      "SPECIFY / FOCUS(clarity) → focused(clarity)",
    ]);
    expect(result.operationPlan.reduce<Record<string, number>>((counts, operation) => {
      counts[operation.kind] = (counts[operation.kind] ?? 0) + 1;
      return counts;
    }, {})).toEqual({
      SELECT_SPECTRUM_CANDIDATE: 3,
      APPLY_VOICE_OPERATOR: 2,
      CONNECT_SYMBOLS: 4,
      REPRESENT_SYMBOLIC_TRANSFORMATION: 1,
      EXPRESS_RESULT: 2,
    });
    expect(result.operationPlan.filter((operation) => operation.kind === "APPLY_VOICE_OPERATOR").map(({ dependsOn }) => dependsOn)).toEqual([
      ["select:d"],
      ["select:ll"],
    ]);
    expect(result.evaluation.symbolicComposition.status).toBe("MULTIPLE_PROPOSED");
    expect(result.evaluation.symbolicComposition.transformationText).toContain("division produces initiated(division)");
    expect(result.evaluation.symbolicComposition.transformationText).toContain("focused(clarity) yields result");
    expect(result.functionalMotivation.bridges.map(({ role, status }) => [role, status])).toEqual([
      ["PRIMARY", "USER_PROPOSED"],
      ["ALTERNATIVE", "USER_PROPOSED"],
    ]);
    expect(result.functionalMotivation.status).toBe("MULTIPLE_PROPOSED");
    expect(result.graphMeaningBridge).toMatchObject({
      status: "MULTIPLE_PROPOSED",
      selectedLexicalSense: {
        senseId: "dallim.action-of-distinguishing",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      },
      interpretationSelection: { mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" },
      sourceAuthorityPromotion: "NONE",
    });
    expect(result.graphMeaningBridge.mappings.map(({ graphOutput, selectedLexicalFunction, generatedContribution }) => ({
      symbol: graphOutput.text,
      functionCandidateId: selectedLexicalFunction.candidateId,
      functionEvidence: selectedLexicalFunction.evidenceStatus,
      relationClaimLayer: selectedLexicalFunction.compositionClaimLayer,
      compositionEvidence: selectedLexicalFunction.compositionEvidenceStatus,
      applicability: selectedLexicalFunction.linguisticApplicability,
      generatedContribution,
    }))).toEqual([
      {
        symbol: "initiated(division)",
        functionCandidateId: "dalloj.distinguish-or-recognize",
        functionEvidence: "CITATION_ENTERED_UNVERIFIED",
        relationClaimLayer: "SOURCE_FACT",
        compositionEvidence: "CITATION_ENTERED_UNVERIFIED",
        applicability: "NOT_ASSESSED",
        generatedContribution: expect.stringContaining("initiated(division)"),
      },
      {
        symbol: "focused(clarity)",
        functionCandidateId: "dalloj.distinguish-or-recognize",
        functionEvidence: "CITATION_ENTERED_UNVERIFIED",
        relationClaimLayer: "SOURCE_FACT",
        compositionEvidence: "CITATION_ENTERED_UNVERIFIED",
        applicability: "NOT_ASSESSED",
        generatedContribution: expect.stringContaining("focused(clarity)"),
      },
    ]);
    expect(result.graphMeaningBridge.wholeWordExplanations).toHaveLength(2);
    expect(result.graphMeaningBridge.wholeWordExplanations.every(({ claimLayer, evidenceStatus, sourceIds }) =>
      claimLayer === "USER_PROPOSAL" && evidenceStatus === "USER_PROPOSED" && sourceIds.length === 0,
    )).toBe(true);
    expect(result.functionalMotivation.unresolvedParts[0]?.text).toContain("does not explain IM");

    const proposedSegmentation = result.sourceFunctionLayer.segmentations.find(({ candidateId }) => candidateId === "user-proposed-dall-plus-im");
    expect(proposedSegmentation).toMatchObject({ rawReconstruction: "DALLIM", reconstructionStatus: "EXACT_MATCH" });
    expect(proposedSegmentation?.claimLayer).toBe("USER_PROPOSAL");
    expect(proposedSegmentation?.components.map(({ exactSpelling }) => exactSpelling)).toEqual(["DALL", "IM"]);
    expect(result.sourceFunctionLayer.target.selectedSense).toMatchObject({
      senseId: "dallim.action-of-distinguishing",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      claimLayer: "SOURCE_FACT",
    });
    expect(result.sourceFunctionLayer.target.alternativeSenses.map(({ senseId }) => senseId)).toEqual([
      "dallim.distinguishing-feature-or-difference",
      "dallim.unequal-treatment",
    ]);
    expect(result.sourceFunctionLayer.compositions[0]).toMatchObject({
      status: "COMPOSED_FROM_SOURCE_RELATION",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      linguisticApplicability: "NOT_ASSESSED",
    });
    expect(result.sourceReferences.map(({ url, citationStatus }) => [url, citationStatus])).toEqual([
      ["https://fjale.al/index.php/dallim", "CITATION_ENTERED_UNVERIFIED"],
      ["https://fjale.al/index.php/dalloj", "CITATION_ENTERED_UNVERIFIED"],
    ]);
    expect(result.functionalMotivation).toMatchObject({
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      evidenceStatus: "USER_PROPOSED",
      sourceAuthorityPromotion: "NONE",
      productionAuthority: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      interpretationSelection: { mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" },
    });
    expect(result.evaluation.sourceAuthorityPromotion).toBe("NONE");
    expect(result.evaluation.symbols.every(({ provenance }) =>
      provenance.claimLayer === "EXPLORATORY_HYPOTHESIS" && provenance.evidenceStatus === "USER_PROPOSED" &&
      provenance.sourceIds.length === 0,
    )).toBe(true);
    expect(result.operationPlan.some((operation) => operation.kind === "APPLY_VOICE_OPERATOR")).toBe(true);
    expect(result).toEqual(buildSymbolicFunctionalOperationPlanV0_1(input));
  });

  it("changes its computed graph when a selected spectrum candidate changes", () => {
    const division = buildSymbolicFunctionalOperationPlanV0_1(dallimInput("division"));
    const direction = buildSymbolicFunctionalOperationPlanV0_1(dallimInput("direction"));
    expect(division.ok && direction.ok).toBe(true);
    if (!division.ok || !direction.ok || !division.evaluation.ok || !direction.evaluation.ok) return;

    expect(division.evaluation.symbolicComposition.transformationText).toContain("division");
    expect(direction.evaluation.symbolicComposition.transformationText).toContain("direction");
    expect(direction.evaluation.symbolicComposition.transformationText).not.toBe(division.evaluation.symbolicComposition.transformationText);
    expect(division.ok && division.graphMeaningBridge.wholeWordExplanations[0]?.text).toContain("initiated(division)");
    expect(direction.ok && direction.graphMeaningBridge.wholeWordExplanations[0]?.text).toContain("initiated(direction)");
    expect(direction.functionalMotivation.bridges.map(({ role, text }) => [role, text])).toEqual([
      ["PRIMARY", "This illustrative proposal pairs an initiated contribution with focused clarity as one possible functional reading of the act of distinguishing."],
      ["ALTERNATIVE", "Alternatively, an initiated contribution and focused clarity are proposed as a way to attend to one thing as distinct from another."],
    ]);
    expect(direction.graphMeaningBridge.wholeWordExplanations[0]?.text).toContain(
      "functional role “an initiated contribution proposed for distinguishing”",
    );
    expect(direction.functionalMotivation.bridges.map(({ text }) => text).join(" ")).not.toMatch(/initiated division|initiating a division/iu);
  });

  it("returns partial Null when an explicitly bound Voice event has no operand", () => {
    const input = dallimInput();
    const voiceBindings = input.voiceBindings.map((binding) => binding.bindingId === "i-focuses-ll"
      ? { ...binding, input: { kind: "SPECTRUM_SELECTION" as const, selectionId: "missing-operand" } }
      : binding);
    const result = buildSymbolicFunctionalOperationPlanV0_1({ ...input, voiceBindings });
    expect(result.ok).toBe(true);
    if (!result.ok || !result.evaluation.ok) return;

    expect(result.functionalMotivation.status).toBe("PARTIAL_NULL");
    expect(result.graphMeaningBridge.status).toBe("PARTIAL_NULL");
    expect(result.evaluation.symbolicComposition.status).toBe("PARTIAL_NULL");
    expect(result.evaluation.symbolicComposition.reasonCodes).toContain(
      "VOICE_OPERATOR_INPUT_SYMBOL_UNAVAILABLE:symbol:selection:missing-operand",
    );
  });

  it("cannot claim whole-word motivation without an explicit proposed bridge", () => {
    const result = buildSymbolicFunctionalOperationPlanV0_1({ ...dallimInput(), functionalBridges: [] });
    expect(result.ok).toBe(true);
    if (!result.ok || !result.evaluation.ok) return;

    expect(result.functionalMotivation.status).toBe("PARTIAL_NULL");
    expect(result.functionalMotivation.reasonCodes).toContain("FUNCTIONAL_BRIDGE_MISSING_OR_UNRESOLVED");
    expect(result.evaluation.symbolicComposition.status).toBe("PARTIAL_NULL");
    expect(result.evaluation.symbolicComposition.expression).toBeNull();
  });

  it("does not treat bridge prose alone as a graph-to-meaning explanation", () => {
    const result = buildSymbolicFunctionalOperationPlanV0_1({
      ...dallimInput(),
      functionalRoleMappings: [],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.evaluation.ok && result.evaluation.symbolicComposition.status).toBe("MULTIPLE_PROPOSED");
    expect(result.graphMeaningBridge.status).toBe("PARTIAL_NULL");
    expect(result.graphMeaningBridge.wholeWordExplanations).toHaveLength(0);
    expect(result.graphMeaningBridge.reasonCodes).toContain(
      "GRAPH_MEANING_MAPPING_REQUIRED_FOR_BRIDGE:focused-distinction",
    );
    expect(result.functionalMotivation.status).toBe("PARTIAL_NULL");
  });

  it("returns partial Null for a role mapping that is disconnected from an evaluated graph output", () => {
    const input = dallimInput();
    const functionalRoleMappings = input.functionalRoleMappings?.map((mapping) =>
      mapping.mappingId === "initiated-division-contribution"
        ? { ...mapping, symbolOutputId: "symbol:voice:missing-output" }
        : mapping,
    );
    const result = buildSymbolicFunctionalOperationPlanV0_1({ ...input, functionalRoleMappings });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.graphMeaningBridge.status).toBe("PARTIAL_NULL");
    expect(result.graphMeaningBridge.unresolvedMappings).toContainEqual(expect.objectContaining({
      mappingId: "initiated-division-contribution",
      reasonCodes: expect.arrayContaining([
        "GRAPH_MEANING_MAPPING_GRAPH_OUTPUT_NOT_FOUND:initiated-division-contribution",
      ]),
    }));
    expect(result.functionalMotivation.status).toBe("PARTIAL_NULL");
  });

  it("requires the mapping to reference the selected lexical function relation", () => {
    const input = dallimInput();
    const functionalRoleMappings = input.functionalRoleMappings?.map((mapping) =>
      mapping.mappingId === "initiated-division-contribution"
        ? { ...mapping, functionCandidateId: "unselected.lexical-function" }
        : mapping,
    );
    const result = buildSymbolicFunctionalOperationPlanV0_1({ ...input, functionalRoleMappings });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.graphMeaningBridge.status).toBe("PARTIAL_NULL");
    expect(result.graphMeaningBridge.unresolvedMappings).toContainEqual(expect.objectContaining({
      mappingId: "initiated-division-contribution",
      reasonCodes: expect.arrayContaining([
        "GRAPH_MEANING_MAPPING_LEXICAL_FUNCTION_NOT_FOUND:initiated-division-contribution",
        "GRAPH_MEANING_MAPPING_SELECTED_FUNCTION_RELATION_NOT_FOUND:initiated-division-contribution",
      ]),
    }));
    expect(result.functionalMotivation.status).toBe("PARTIAL_NULL");
  });

  it("compiles a non-DALLIM synthetic input without a word-specific branch", () => {
    const result = buildSymbolicFunctionalOperationPlanV0_1(syntheticNonDallimInput());
    expect(result.ok).toBe(true);
    if (!result.ok || !result.evaluation.ok) return;

    expect(result.evaluation.target.codePoints).toEqual([
      { character: "B", position: 0 },
      { character: "L", position: 1 },
      { character: "U", position: 2 },
    ]);
    expect(result.evaluation.target.writtenVoices).toEqual([{ voice: "U", position: 2 }]);
    expect(result.evaluation.symbolicComposition.status).toBe("COMPLETE_PROPOSED");
    expect(result.evaluation.operationTrace.find(({ kind }) => kind === "APPLY_VOICE_OPERATOR")?.contribution).toBe(
      "DEEPEN / NOURISH(growth) → deepened(growth)",
    );
    expect(result.evaluation.historicalOrigin).toBe("NOT_CLAIMED");
    expect(result.evaluation.sourceAuthorityPromotion).toBe("NONE");
    expect(result.graphMeaningBridge.status).toBe("COMPLETE_PROPOSED");
    expect(result.graphMeaningBridge.wholeWordExplanations[0]?.text).toContain("deepened(growth)");
    expect(result.graphMeaningBridge.mappings[0]?.selectedLexicalFunction).toMatchObject({
      candidateId: "synthetic.blu.function",
      evidenceStatus: "USER_PROPOSED",
      compositionClaimLayer: "USER_PROPOSAL",
      compositionEvidenceStatus: "USER_PROPOSED",
      linguisticApplicability: "NOT_ASSESSED",
    });
  });

  it("rejects a source-function layer whose target identity differs from the exact target", () => {
    const input = dallimInput();
    const result = buildSymbolicFunctionalOperationPlanV0_1({
      ...input,
      target: { ...input.target, exactSpelling: "DALLIMX" },
    });
    expect(result).toMatchObject({ ok: false, reasonCodes: ["SOURCE_FUNCTION_LAYER_TARGET_IDENTITY_MISMATCH"] });
  });
});
