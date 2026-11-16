import {
  buildSymbolicFunctionalContentV0_1,
  type SymbolicFunctionalContentInputV0_1,
} from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";
import {
  EMBRIOMORPHEME_SPECTRUM_V0_1,
  TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1,
  getEmbriomorphemeAssociationV0_1,
} from "@/shared/openInstrument/embriomorphemeSpectrum.v0_1";
import {
  SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_1,
  buildSymbolicFunctionalCompositionV0_2,
  spectrumOccurrenceIdV0_2,
  type SymbolicCompositionOperationV0_2,
  type SymbolicFunctionalCompositionInputV0_2,
} from "@/shared/openInstrument/symbolicFunctionalComposition.v0_2";

function associationId(unit: string, association: string): string {
  const candidate = [
    ...EMBRIOMORPHEME_SPECTRUM_V0_1.flatMap(({ associations }) => associations),
    ...TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1,
  ].find((entry) => entry.unit === unit && entry.association === association);
  if (!candidate) throw new Error(`Missing fixture association: ${unit} ${association}`);
  return candidate.candidateId;
}

function voiceOperatorId(voice: string): string {
  const candidate = SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_1.find((entry) => entry.voice === voice);
  if (!candidate) throw new Error(`Missing fixture Voice operator: ${voice}`);
  return candidate.candidateId;
}

function sourceContentInput(): SymbolicFunctionalContentInputV0_1 {
  return {
    target: {
      exactSpelling: "NDRIÇIM",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSense: {
        senseId: "ndricim.action-of-verb",
        label: "Action according to the meanings of NDRIÇOJ / NDRIÇOHEM",
        definition: "The action according to the meanings of the verbs NDRIÇOJ and NDRIÇOHEM.",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: ["fjale-ndricim"],
        functionalFrame: "ACTION_OF_VERB_FUNCTION",
      },
      alternativeSenses: [],
    },
    sources: [{
      sourceId: "fjale-ndricim",
      label: "FJALË — NDRIÇIM",
      url: "https://fjale.al/ndri%C3%A7im",
      locator: "action sense defined by reference to NDRIÇOJ / NDRIÇOHEM",
      citationStatus: "CITATION_ENTERED_UNVERIFIED",
      licensingStatus: "NOT_ASSESSED",
    }],
    segmentationCandidates: [{
      candidateId: "proposed-ndriç-im",
      components: [
        { componentId: "proposed-stem", exactSpelling: "NDRIÇ" },
        { componentId: "unresolved-im", exactSpelling: "IM" },
      ],
      claimLayer: "USER_PROPOSAL",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    }],
    functionCandidates: [{
      candidateId: "ndricoj-light",
      exactForm: "NDRIÇOJ",
      sourceSenseId: "ndricoj-sense-1",
      functionText: "gives light or makes something have light",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      sourceIds: ["fjale-ndricim"],
    }],
    componentFunctionBindings: [{
      bindingId: "proposed-stem-to-light-function",
      segmentationCandidateId: "proposed-ndriç-im",
      componentId: "proposed-stem",
      functionCandidateId: "ndricoj-light",
      claimLayer: "USER_PROPOSAL",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
    }],
    voiceRoleCandidates: [],
    consonantAssociationCandidates: [],
    compositionOperations: [{
      operationId: "source-action-of-verb",
      operationType: "ACTION_OF_VERB_FUNCTION",
      candidateLabel: "source-reported action sense",
      targetSenseId: "ndricim.action-of-verb",
      functionCandidateId: "ndricoj-light",
      componentFunctionBindingId: "proposed-stem-to-light-function",
      operationStatus: "SOURCE_REPORTED_UNVERIFIED",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      relationSourceIds: ["fjale-ndricim"],
    }],
    alternativeReadings: [],
    unresolvedClaims: [{ claimId: "suffix-im", text: "The proposed IM component remains unresolved.", sourceIds: [] }],
  };
}

function selectSpectrum(
  operationId: string,
  unit: string,
  position: number,
  association: string,
  outputSymbolId: string,
): SymbolicCompositionOperationV0_2 {
  const end = position + Array.from(unit).length;
  return {
    operationId,
    kind: "SELECT_SPECTRUM_CANDIDATE",
    dependsOn: [],
    occurrenceId: spectrumOccurrenceIdV0_2(unit, position, end),
    associationCandidateId: associationId(unit, association),
    outputSymbolId,
  };
}

function applyVoice(
  operationId: string,
  voice: "A" | "E" | "I" | "O" | "U" | "Y" | "Ë",
  position: number,
  outputSymbolId: string,
): SymbolicCompositionOperationV0_2 {
  return {
    operationId,
    kind: "APPLY_VOICE_OPERATOR",
    dependsOn: [],
    voice,
    position,
    operatorCandidateId: voiceOperatorId(voice),
    outputSymbolId,
  };
}

function ndrIçimInput(
  dAssociation = "light",
  includeM = true,
): SymbolicFunctionalCompositionInputV0_2 {
  const operations: SymbolicCompositionOperationV0_2[] = [
    selectSpectrum("select-n-enclosure", "N", 0, "enclosure", "n-enclosure"),
    selectSpectrum("select-n-inside", "N", 0, "inside", "n-inside"),
    selectSpectrum("select-d", "D", 1, dAssociation, "d-value"),
    selectSpectrum("select-r", "R", 2, "cycle", "r-cycle"),
    applyVoice("apply-i-3", "I", 3, "i-focus-3"),
    selectSpectrum("select-ç-release", "Ç", 4, "release", "ç-release"),
    selectSpectrum("select-ç-emit", "Ç", 4, "emit", "ç-emit"),
    applyVoice("apply-i-5", "I", 5, "i-focus-5"),
  ];
  if (includeM) operations.push(selectSpectrum("select-m", "M", 6, "result", "m-result"));

  const links = [
    ["n-enclosure", "n-inside", "select-n-enclosure", "select-n-inside"],
    ["n-inside", "d-value", "select-n-inside", "select-d"],
    ["d-value", "r-cycle", "select-d", "select-r"],
    ["r-cycle", "i-focus-3", "select-r", "apply-i-3"],
    ["i-focus-3", "ç-release", "apply-i-3", "select-ç-release"],
    ["ç-release", "ç-emit", "select-ç-release", "select-ç-emit"],
    ["ç-emit", "i-focus-5", "select-ç-emit", "apply-i-5"],
    ["i-focus-5", "m-result", "apply-i-5", "select-m"],
  ] as const;
  const connectionOperations = links.map(([leftSymbolId, rightSymbolId, leftProducer, rightProducer], index) => ({
    operationId: `connect-${index + 1}`,
    kind: "CONNECT_SYMBOLS" as const,
    dependsOn: [leftProducer, rightProducer],
    leftSymbolId,
    rightSymbolId,
    relationText: "contributes to",
    outputRelationId: `relation-${index + 1}`,
  }));
  operations.push(...connectionOperations);
  operations.push({
    operationId: "represent-chain",
    kind: "REPRESENT_SYMBOLIC_TRANSFORMATION",
    dependsOn: connectionOperations.map(({ operationId }) => operationId),
    relationIds: connectionOperations.map(({ outputRelationId }) => outputRelationId),
    transformationLabel: "ordered provisional symbolic contributions",
    outputTransformationId: "ndricim-symbolic-chain",
  });
  operations.push({
    operationId: "express-reading",
    kind: "EXPRESS_RESULT",
    dependsOn: [
      "represent-chain", "select-n-enclosure", "select-n-inside", "select-d", "select-r", "apply-i-3",
      "select-ç-release", "select-ç-emit", "apply-i-5", "select-m",
    ],
    transformationId: "ndricim-symbolic-chain",
    outputExpressionId: "ndricim-proposed-reading",
    template: [
      { kind: "literal", text: "Within " },
      { kind: "symbol", symbolId: "n-enclosure" },
      { kind: "literal", text: " / " },
      { kind: "symbol", symbolId: "n-inside" },
      { kind: "literal", text: ", " },
      { kind: "symbol", symbolId: "d-value" },
      { kind: "literal", text: " follows a " },
      { kind: "symbol", symbolId: "r-cycle" },
      { kind: "literal", text: " shaped by " },
      { kind: "symbol", symbolId: "i-focus-3" },
      { kind: "literal", text: " and " },
      { kind: "symbol", symbolId: "i-focus-5" },
      { kind: "literal", text: "; " },
      { kind: "symbol", symbolId: "ç-release" },
      { kind: "literal", text: " / " },
      { kind: "symbol", symbolId: "ç-emit" },
      { kind: "literal", text: " contributes toward " },
      { kind: "symbol", symbolId: "m-result" },
      { kind: "literal", text: " as a proposed reading of " },
      { kind: "target_concept" },
      { kind: "literal", text: "." },
    ],
  });

  return {
    target: {
      exactSpelling: "NDRIÇIM",
      language: "Albanian",
      variety: "Standard Albanian",
      wholeWordConcept: "illuminating",
    },
    operations,
    sourceFunctionLayer: buildSymbolicFunctionalContentV0_1(sourceContentInput()),
  };
}

function syntheticShGjYInput(): SymbolicFunctionalCompositionInputV0_2 {
  const operations: SymbolicCompositionOperationV0_2[] = [
    selectSpectrum("select-sh", "SH", 0, "sharpness", "sh-sharpness"),
    selectSpectrum("select-gj", "GJ", 2, "gathering", "gj-gathering"),
    applyVoice("apply-y-4", "Y", 4, "y-reflect"),
    {
      operationId: "connect-sh-gj",
      kind: "CONNECT_SYMBOLS",
      dependsOn: ["select-sh", "select-gj"],
      leftSymbolId: "sh-sharpness",
      rightSymbolId: "gj-gathering",
      relationText: "is paired with",
      outputRelationId: "sh-gj-relation",
    },
    {
      operationId: "connect-gj-y",
      kind: "CONNECT_SYMBOLS",
      dependsOn: ["select-gj", "apply-y-4"],
      leftSymbolId: "gj-gathering",
      rightSymbolId: "y-reflect",
      relationText: "is viewed through",
      outputRelationId: "gj-y-relation",
    },
    {
      operationId: "represent-synthetic-chain",
      kind: "REPRESENT_SYMBOLIC_TRANSFORMATION",
      dependsOn: ["connect-sh-gj", "connect-gj-y"],
      relationIds: ["sh-gj-relation", "gj-y-relation"],
      transformationLabel: "synthetic ordered hypothesis",
      outputTransformationId: "synthetic-chain",
    },
    {
      operationId: "express-synthetic-result",
      kind: "EXPRESS_RESULT",
      dependsOn: ["represent-synthetic-chain", "select-sh", "select-gj", "apply-y-4"],
      transformationId: "synthetic-chain",
      outputExpressionId: "synthetic-expression",
      template: [
        { kind: "symbol", symbolId: "sh-sharpness" },
        { kind: "literal", text: " and " },
        { kind: "symbol", symbolId: "gj-gathering" },
        { kind: "literal", text: " are considered with " },
        { kind: "symbol", symbolId: "y-reflect" },
        { kind: "literal", text: " for " },
        { kind: "target_concept" },
        { kind: "literal", text: "." },
      ],
    },
  ];
  return {
    target: { exactSpelling: "shgjy", language: "Synthetic", variety: "Test fixture", wholeWordConcept: "a synthetic target concept" },
    operations,
  };
}

describe("symbolic functional composition v0.2", () => {
  it("keeps the fifteen-unit hypotheses and Ç target-local values explicitly proposed and source-free", () => {
    expect(EMBRIOMORPHEME_SPECTRUM_V0_1).toHaveLength(15);
    expect(Object.fromEntries(EMBRIOMORPHEME_SPECTRUM_V0_1.map(({ unit, associations }) => [
      unit,
      associations.map(({ association }) => association),
    ]))).toEqual({
      R: ["circular motion", "cycle", "rhythm"],
      L: ["linear flow", "spreading", "liquid"],
      D: ["division", "direction", "light", "cut"],
      M: ["matter", "mother", "result", "closure"],
      N: ["enclosure", "inside", "negation", "origin"],
      SH: ["sharpness", "separation", "intensity"],
      GJ: ["gathering", "continuity", "mass"],
      B: ["being", "substance", "growth"],
      P: ["surface", "expansion", "appearance"],
      T: ["touch", "cut", "boundary"],
      K: ["hardness", "angle", "corner"],
      V: ["void", "opening", "womb"],
      S: ["structure", "solidity", "sibilance"],
      Z: ["sound", "darkness", "deep"],
      F: ["breath", "spirit", "force"],
    });
    for (const [unit, expected] of [
      ["N", ["enclosure", "inside", "negation", "origin"]],
      ["D", ["division", "direction", "light", "cut"]],
      ["R", ["circular motion", "cycle", "rhythm"]],
      ["M", ["matter", "mother", "result", "closure"]],
    ] as const) {
      const entry = EMBRIOMORPHEME_SPECTRUM_V0_1.find((candidate) => candidate.unit === unit);
      expect(entry?.associations.map(({ association }) => association)).toEqual(expected);
      expect(entry?.associations.every((candidate) => candidate.claimLayer === "EXPLORATORY_HYPOTHESIS" &&
        candidate.evidenceStatus === "USER_PROPOSED" && candidate.sourceIds.length === 0 &&
        candidate.citationStatus === "NO_CITATION_ENTERED" &&
        candidate.provenanceClass === "OWNER_SUPPLIED_PROVISIONAL_RESEARCH_ASSOCIATION")).toBe(true);
    }
    expect(TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1.map(({ association }) => association)).toEqual(["release", "emit"]);
    expect(TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1.every(({ provenanceClass }) =>
      provenanceClass === "TARGET_LOCAL_USER_PROPOSAL_NOT_IN_FIFTEEN_UNIT_TABLE",
    )).toBe(true);
    expect(getEmbriomorphemeAssociationV0_1(associationId("Ç", "release"))?.sourceIds).toEqual([]);
  });

  it("retains independent I@3 and I@5 events with canonical, trait-table, and proposed operator labels separated", () => {
    const result = buildSymbolicFunctionalCompositionV0_2(ndrIçimInput());
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.target.codePoints).toEqual(Array.from("NDRIÇIM").map((character, position) => ({ character, position })));
    expect(result.target.writtenVoices).toEqual([{ voice: "I", position: 3 }, { voice: "I", position: 5 }]);
    expect(result.voiceEvents.map(({ canonicalIdentity, position, existingTraitTableLabel, selectedOperator }) => ({
      canonicalIdentity, position, existingTraitTableLabel, proposedOperator: selectedOperator?.operatorText,
    }))).toEqual([
      { canonicalIdentity: "I", position: 3, existingTraitTableLabel: "Inner Focus/Light", proposedOperator: "SPECIFY / FOCUS" },
      { canonicalIdentity: "I", position: 5, existingTraitTableLabel: "Inner Focus/Light", proposedOperator: "SPECIFY / FOCUS" },
    ]);
    expect(result.voiceEvents.map(({ selectedOperator }) => selectedOperator?.claimLayer)).toEqual([
      "EXPLORATORY_HYPOTHESIS", "EXPLORATORY_HYPOTHESIS",
    ]);
  });

  it("computes the full ordered NDRIÇIM trace and keeps source lexical output separate", () => {
    const input = ndrIçimInput();
    const result = buildSymbolicFunctionalCompositionV0_2(input);
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.symbolicComposition.status).toBe("COMPLETE_PROPOSED");
    expect(result.operationTrace.map(({ operationId }) => operationId)).toEqual([
      "select-n-enclosure", "select-n-inside", "select-d", "select-r", "apply-i-3",
      "select-ç-release", "select-ç-emit", "apply-i-5", "select-m",
      "connect-1", "connect-2", "connect-3", "connect-4", "connect-5", "connect-6", "connect-7", "connect-8",
      "represent-chain", "express-reading",
    ]);
    expect(result.operationTrace.map(({ kind }) => kind)).toEqual([
      "SELECT_SPECTRUM_CANDIDATE", "SELECT_SPECTRUM_CANDIDATE", "SELECT_SPECTRUM_CANDIDATE",
      "SELECT_SPECTRUM_CANDIDATE", "APPLY_VOICE_OPERATOR", "SELECT_SPECTRUM_CANDIDATE",
      "SELECT_SPECTRUM_CANDIDATE", "APPLY_VOICE_OPERATOR", "SELECT_SPECTRUM_CANDIDATE",
      "CONNECT_SYMBOLS", "CONNECT_SYMBOLS", "CONNECT_SYMBOLS", "CONNECT_SYMBOLS",
      "CONNECT_SYMBOLS", "CONNECT_SYMBOLS", "CONNECT_SYMBOLS", "CONNECT_SYMBOLS",
      "REPRESENT_SYMBOLIC_TRANSFORMATION", "EXPRESS_RESULT",
    ]);
    expect(result.operationTrace.every(({ status }) => status === "COMPUTED")).toBe(true);
    expect(result.spectrumOccurrences.map(({ unit, span, selectedAssociationIds, status }) => ({ unit, span, selectedAssociationIds, status }))).toEqual([
      { unit: "N", span: { start: 0, end: 1 }, selectedAssociationIds: ["n:enclosure", "n:inside"], status: "SELECTED_HYPOTHESIS" },
      { unit: "D", span: { start: 1, end: 2 }, selectedAssociationIds: ["d:light"], status: "SELECTED_HYPOTHESIS" },
      { unit: "R", span: { start: 2, end: 3 }, selectedAssociationIds: ["r:cycle"], status: "SELECTED_HYPOTHESIS" },
      { unit: "Ç", span: { start: 4, end: 5 }, selectedAssociationIds: ["ç:release", "ç:emit"], status: "SELECTED_HYPOTHESIS" },
      { unit: "M", span: { start: 6, end: 7 }, selectedAssociationIds: ["m:result"], status: "SELECTED_HYPOTHESIS" },
    ]);
    expect(result.operationTrace.filter(({ kind }) => kind === "CONNECT_SYMBOLS").map(({ contribution }) => contribution)).toEqual([
      "enclosure contributes to inside",
      "inside contributes to light",
      "light contributes to cycle",
      "cycle contributes to SPECIFY / FOCUS",
      "SPECIFY / FOCUS contributes to release",
      "release contributes to emit",
      "emit contributes to SPECIFY / FOCUS",
      "SPECIFY / FOCUS contributes to result",
    ]);
    expect(result.symbolicComposition.transformationText).toContain("enclosure contributes to inside → inside contributes to light → light contributes to cycle");
    expect(result.symbolicComposition.expression).toBe(
      "Within enclosure / inside, light follows a cycle shaped by SPECIFY / FOCUS and SPECIFY / FOCUS; release / emit contributes toward result as a proposed reading of illuminating.",
    );
    expect(result.symbolicComposition).toMatchObject({
      claimLayer: "EXPLORATORY_HYPOTHESIS",
      evidenceStatus: "USER_PROPOSED",
      sourceIds: [],
      reasonCodes: [],
    });
    expect(result.sourceFunctionLayer).toBe(input.sourceFunctionLayer);
    if (result.sourceFunctionLayer?.ok) {
      expect(result.sourceFunctionLayer.content.compositions[0]?.status).toBe("COMPOSED_WITH_USER_PROPOSED_RELATION");
      expect(result.sourceFunctionLayer.content.compositions[0]?.evidenceStatus).toBe("USER_PROPOSED");
      expect(result.sourceFunctionLayer.content.segmentations[0]?.rawReconstruction).toBe("NDRIÇIM");
      expect(result.sourceFunctionLayer.content.segmentations[0]?.components[1]?.status).toBe("UNKNOWN_OR_NULL");
    }
    expect(result.interpretationSelection).toEqual({ mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" });
    expect(result.sourceAuthorityPromotion).toBe("NONE");
    expect(result.productionAuthority).toBe("NONE");
    expect(result.historicalOrigin).toBe("NOT_CLAIMED");
    expect(result.directPetroZhejiFidelity).toBe("NOT_ESTABLISHED");
  });

  it("changes the computed expression when the selected D association changes", () => {
    const light = buildSymbolicFunctionalCompositionV0_2(ndrIçimInput("light"));
    const direction = buildSymbolicFunctionalCompositionV0_2(ndrIçimInput("direction"));
    expect(light.ok && direction.ok).toBe(true);
    if (!light.ok || !direction.ok) return;
    expect(light.symbolicComposition.expression).toContain("inside, light follows");
    expect(direction.symbolicComposition.expression).toContain("inside, direction follows");
    expect(direction.symbolicComposition.expression).not.toBe(light.symbolicComposition.expression);
  });

  it("keeps multiple explicitly expressed readings available without selecting one", () => {
    const input = ndrIçimInput();
    const expressionOperation = input.operations.find((operation) => operation.kind === "EXPRESS_RESULT");
    if (!expressionOperation || expressionOperation.kind !== "EXPRESS_RESULT") throw new Error("Missing expression fixture");
    const result = buildSymbolicFunctionalCompositionV0_2({
      ...input,
      operations: [
        ...input.operations,
        {
          ...expressionOperation,
          operationId: "express-alternative-reading",
          outputExpressionId: "ndricim-alternative-expression",
          template: [{ kind: "literal" as const, text: "Alternative proposal: " }, ...expressionOperation.template],
        },
      ],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.symbolicComposition.status).toBe("MULTIPLE_PROPOSED");
    expect(result.symbolicComposition.expression).toBeNull();
    expect(result.symbolicComposition.proposedExpressions).toHaveLength(2);
    expect(result.symbolicComposition.proposedExpressions[1]?.text).toMatch(/^Alternative proposal: /);
    expect(result.interpretationSelection).toEqual({ mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" });
  });

  it("returns explicit partial/Null content when a required selected association is absent", () => {
    const result = buildSymbolicFunctionalCompositionV0_2(ndrIçimInput("light", false));
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.symbolicComposition.status).toBe("PARTIAL_NULL");
    expect(result.symbolicComposition.expression).toBeNull();
    expect(result.symbolicComposition.reasonCodes).toContain("SPECTRUM_ASSOCIATION_MISSING:spectrum:M@6-7");
    expect(result.symbolicComposition.reasonCodes).toContain("TRANSFORMATION_RELATION_UNAVAILABLE:represent-chain");
    expect(result.spectrumOccurrences.find(({ unit }) => unit === "M")).toMatchObject({
      selectedAssociationIds: [],
      status: "UNKNOWN_OR_NULL",
    });
  });

  it("uses the same engine for SH/GJ longest-match spans and a canonical Y event", () => {
    const result = buildSymbolicFunctionalCompositionV0_2(syntheticShGjYInput());
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.target.codePoints).toEqual(Array.from("shgjy").map((character, position) => ({ character, position })));
    expect(result.spectrumOccurrences.map(({ unit, exactText, span }) => ({ unit, exactText, span }))).toEqual([
      { unit: "SH", exactText: "sh", span: { start: 0, end: 2 } },
      { unit: "GJ", exactText: "gj", span: { start: 2, end: 4 } },
    ]);
    expect(result.voiceEvents.map(({ canonicalIdentity, position, selectedOperator }) => ({
      canonicalIdentity, position, operator: selectedOperator?.operatorText,
    }))).toEqual([{ canonicalIdentity: "Y", position: 4, operator: "PROBE / REFLECT" }]);
    expect(result.symbolicComposition.status).toBe("COMPLETE_PROPOSED");
    expect(result.symbolicComposition.expression).toBe(
      "sharpness and gathering are considered with PROBE / REFLECT for a synthetic target concept.",
    );
  });

  it("does not attach source authority to provisional spectra or Voice operators", () => {
    expect(SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_1.map(({ voice, operatorText }) => [voice, operatorText])).toEqual([
      ["A", "INITIATE / GROUND"],
      ["E", "EXPAND / OUTWARD"],
      ["I", "SPECIFY / FOCUS"],
      ["O", "CONTAIN / ENCLOSE"],
      ["U", "DEEPEN / NOURISH"],
      ["Y", "PROBE / REFLECT"],
      ["Ë", "CLOSE / NEUTRALIZE"],
    ]);
    const candidates = [
      ...EMBRIOMORPHEME_SPECTRUM_V0_1.flatMap(({ associations }) => associations),
      ...TARGET_LOCAL_SPECTRUM_ASSOCIATIONS_V0_1,
      ...SYMBOLIC_VOICE_OPERATOR_PROFILE_V0_1,
    ];
    expect(candidates.every(({ claimLayer, evidenceStatus, sourceIds, citationStatus }) =>
      claimLayer === "EXPLORATORY_HYPOTHESIS" && evidenceStatus === "USER_PROPOSED" &&
      sourceIds.length === 0 && citationStatus === "NO_CITATION_ENTERED",
    )).toBe(true);
    const result = buildSymbolicFunctionalCompositionV0_2(ndrIçimInput());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.directPetroZhejiFidelity).toBe("NOT_ESTABLISHED");
      expect(result.sourceAuthorityPromotion).toBe("NONE");
      expect(result.symbolicComposition.evidenceStatus).toBe("USER_PROPOSED");
    }
  });
});
