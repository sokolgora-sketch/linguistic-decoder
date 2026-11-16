import { manifestTrait } from "@/core/sevenVowelsTraits";
import {
  buildSymbolicFunctionalContentV0_1,
  type SymbolicFunctionalContentInputV0_1,
} from "@/shared/openInstrument/symbolicFunctionalContentEngine.v0_1";
import {
  FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1,
} from "@/ui/instrument/sections/functionalMotivationMethodExamplesAdapter.v0_1";
import { projectFunctionalMotivationTraceV0_1 } from "@/shared/openInstrument/functionalMotivationTrace.v0_1";

function ndrIçimInput(): SymbolicFunctionalContentInputV0_1 {
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
      alternativeSenses: [
        {
          senseId: "ndricim.light-or-equipment",
          label: "Light from a source; means used to make light",
          definition: "Light emitted by a source, or equipment used to make light.",
          claimLayer: "SOURCE_FACT",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
          sourceIds: ["fjale-ndricim"],
          functionalFrame: "OTHER",
        },
        {
          senseId: "ndricim-brightness",
          label: "Brightness",
          definition: "The brightness of something.",
          claimLayer: "SOURCE_FACT",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
          sourceIds: ["fjale-ndricim"],
          functionalFrame: "OTHER",
        },
        {
          senseId: "ndricim-enlightenment",
          label: "Historical Enlightenment sense",
          definition: "Enlightenment; the historical period or movement.",
          claimLayer: "SOURCE_FACT",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
          sourceIds: ["fjale-ndricim"],
          functionalFrame: "OTHER",
        },
      ],
    },
    sources: [
      {
        sourceId: "fjale-ndricim",
        label: "FJALË — NDRIÇIM",
        url: "https://fjale.al/ndri%C3%A7im",
        locator: "senses 1–4; sense 1 defines the action by reference to NDRIÇOJ / NDRIÇOHEM",
        citationStatus: "CITATION_ENTERED_UNVERIFIED",
        licensingStatus: "NOT_ASSESSED",
      },
      {
        sourceId: "fjale-ndricoj",
        label: "FJALË — NDRIÇOJ",
        url: "https://fjale.al/ndri%C3%A7oj",
        locator: "senses 1, 3, 4 and 5",
        citationStatus: "CITATION_ENTERED_UNVERIFIED",
        licensingStatus: "NOT_ASSESSED",
      },
    ],
    segmentationCandidates: [
      {
        candidateId: "proposed-ndriç-im",
        components: [
          { componentId: "proposed-stem", exactSpelling: "NDRIÇ" },
          { componentId: "unresolved-im", exactSpelling: "IM" },
        ],
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      },
    ],
    functionCandidates: [
      {
        candidateId: "ndricoj-literal-light",
        exactForm: "NDRIÇOJ",
        sourceSenseId: "ndricoj-sense-1",
        functionText: "gives light or makes something have light",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: ["fjale-ndricoj"],
      },
      {
        candidateId: "ndricoj-clarify",
        exactForm: "NDRIÇOJ",
        sourceSenseId: "ndricoj-sense-3",
        functionText: "makes something obscure clear and understandable",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: ["fjale-ndricoj"],
      },
      {
        candidateId: "ndricoj-spread-knowledge",
        exactForm: "NDRIÇOJ",
        sourceSenseId: "ndricoj-sense-4",
        functionText: "spreads knowledge and culture through education",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: ["fjale-ndricoj"],
      },
      {
        candidateId: "ndricoj-inform",
        exactForm: "NDRIÇOJ",
        sourceSenseId: "ndricoj-sense-5",
        functionText: "informs others about what is unknown or unclear",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: ["fjale-ndricoj"],
      },
    ],
    componentFunctionBindings: [
      {
        bindingId: "proposed-stem-to-light-function",
        segmentationCandidateId: "proposed-ndriç-im",
        componentId: "proposed-stem",
        functionCandidateId: "ndricoj-literal-light",
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      },
    ],
    voiceRoleCandidates: [3, 5].map((position) => ({
      candidateId: `i-role-${position}`,
      voice: "I" as const,
      position,
      roleText: `${manifestTrait("I").zhejiFunctionalRole} (existing ZË-RO trait-table label; not direct Petro Zheji authority)`,
      provenanceClass: "ZERO_SEVEN_VOICES_ORIGINAL" as const,
      claimLayer: "USER_PROPOSAL" as const,
      evidenceStatus: "USER_PROPOSED" as const,
      sourceIds: [],
    })),
    consonantAssociationCandidates: [],
    compositionOperations: [
      {
        operationId: "compose-literal-light-action",
        operationType: "ACTION_OF_VERB_FUNCTION",
        candidateLabel: "literal light-giving action",
        targetSenseId: "ndricim.action-of-verb",
        functionCandidateId: "ndricoj-literal-light",
        componentFunctionBindingId: "proposed-stem-to-light-function",
        operationStatus: "SOURCE_REPORTED_UNVERIFIED",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        relationSourceIds: ["fjale-ndricim"],
      },
      {
        operationId: "compose-figurative-clarification",
        operationType: "ACTION_OF_VERB_FUNCTION",
        candidateLabel: "figurative clarification action",
        targetSenseId: "ndricim.action-of-verb",
        functionCandidateId: "ndricoj-clarify",
        operationStatus: "SOURCE_REPORTED_UNVERIFIED",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        relationSourceIds: ["fjale-ndricim"],
      },
      {
        operationId: "compose-knowledge-imparting",
        operationType: "ACTION_OF_VERB_FUNCTION",
        candidateLabel: "figurative knowledge-imparting action",
        targetSenseId: "ndricim.action-of-verb",
        functionCandidateId: "ndricoj-spread-knowledge",
        operationStatus: "SOURCE_REPORTED_UNVERIFIED",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        relationSourceIds: ["fjale-ndricim"],
      },
      {
        operationId: "compose-informing",
        operationType: "ACTION_OF_VERB_FUNCTION",
        candidateLabel: "figurative informing action",
        targetSenseId: "ndricim.action-of-verb",
        functionCandidateId: "ndricoj-inform",
        operationStatus: "SOURCE_REPORTED_UNVERIFIED",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        relationSourceIds: ["fjale-ndricim"],
      },
    ],
    alternativeReadings: [
      {
        readingId: "physical-light-or-equipment",
        text: "A separate source-reported sense concerns light from a source or equipment used to make light.",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: ["fjale-ndricim"],
      },
      {
        readingId: "brightness",
        text: "Brightness remains a separate dictionary sense.",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: ["fjale-ndricim"],
      },
      {
        readingId: "historical-enlightenment",
        text: "The historical Enlightenment sense remains separate from the action and physical-light senses.",
        claimLayer: "SOURCE_FACT",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceIds: ["fjale-ndricim"],
      },
    ],
    unresolvedClaims: [
      { claimId: "im-function", text: "The function and linguistic applicability of the proposed IM component are not established.", sourceIds: [] },
      { claimId: "m-autonomous-meaning", text: "No autonomous symbolic meaning is assigned to M.", sourceIds: [] },
      { claimId: "direct-zheji-fidelity", text: "Direct fidelity to Petro Zheji's complete Symbolic Algorithm is not established.", sourceIds: [] },
    ],
  };
}

describe("symbolic functional content engine v0.1", () => {
  it("preserves exact NDRIÇIM spelling and both independent written I events", () => {
    const result = buildSymbolicFunctionalContentV0_1(ndrIçimInput());
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.content.target.codePoints).toEqual(Array.from("NDRIÇIM").map((character, position) => ({ character, position })));
    expect(result.content.target.writtenVoices).toEqual([
      { voice: "I", position: 3 },
      { voice: "I", position: 5 },
    ]);
    expect(result.content.voiceEvents.map(({ voice, position }) => `${voice}@${position}`)).toEqual(["I@3", "I@5"]);
    expect(result.content.voiceEvents.map((event) => event.roleCandidates[0]?.roleText)).toEqual([
      `${manifestTrait("I").zhejiFunctionalRole} (existing ZË-RO trait-table label; not direct Petro Zheji authority)`,
      `${manifestTrait("I").zhejiFunctionalRole} (existing ZË-RO trait-table label; not direct Petro Zheji authority)`,
    ]);
    expect(result.content.target.pronunciationAuthority).toBe("NOT_ESTABLISHED");
  });

  it("computes a provenance-bound action relation deterministically and keeps literal and figurative candidates separate", () => {
    const input = ndrIçimInput();
    const first = buildSymbolicFunctionalContentV0_1(input);
    const second = buildSymbolicFunctionalContentV0_1(input);
    expect(first).toEqual(second);
    expect(first.ok).toBe(true);
    if (!first.ok) return;

    const compositions = first.content.compositions;
    expect(compositions.map(({ candidateLabel }) => candidateLabel)).toEqual([
      "literal light-giving action",
      "figurative clarification action",
      "figurative knowledge-imparting action",
      "figurative informing action",
    ]);
    expect(compositions.map(({ resultText }) => resultText)).toEqual([
      "Action/process corresponding to the verb function: gives light or makes something have light",
      "Action/process corresponding to the verb function: makes something obscure clear and understandable",
      "Action/process corresponding to the verb function: spreads knowledge and culture through education",
      "Action/process corresponding to the verb function: informs others about what is unknown or unclear",
    ]);
    expect(compositions.map(({ sourceFunctionSenseId }) => sourceFunctionSenseId)).toEqual([
      "ndricoj-sense-1",
      "ndricoj-sense-3",
      "ndricoj-sense-4",
      "ndricoj-sense-5",
    ]);
    expect(compositions[0]).toMatchObject({
      claimLayer: "USER_PROPOSAL",
      status: "COMPOSED_WITH_USER_PROPOSED_RELATION",
      evidenceStatus: "USER_PROPOSED",
      linguisticApplicability: "NOT_ASSESSED",
      provenance: {
        relation: { claimLayer: "SOURCE_FACT", evidenceStatus: "CITATION_ENTERED_UNVERIFIED", sourceIds: ["fjale-ndricim"] },
        function: { claimLayer: "SOURCE_FACT", evidenceStatus: "CITATION_ENTERED_UNVERIFIED", sourceIds: ["fjale-ndricoj"] },
        componentBinding: { bindingId: "proposed-stem-to-light-function", claimLayer: "USER_PROPOSAL", evidenceStatus: "USER_PROPOSED" },
      },
    });
    expect(compositions[1]?.claimLayer).toBe("LOGICAL_INFERENCE");
    expect(compositions[2]?.claimLayer).toBe("LOGICAL_INFERENCE");
    expect(compositions.every(({ targetSenseId }) => targetSenseId === "ndricim.action-of-verb")).toBe(true);
    const withoutVoiceRoleProposals = buildSymbolicFunctionalContentV0_1({
      ...input,
      voiceRoleCandidates: [],
    });
    expect(withoutVoiceRoleProposals.ok).toBe(true);
    if (withoutVoiceRoleProposals.ok) {
      expect(withoutVoiceRoleProposals.content.compositions).toEqual(compositions);
    }
    expect(first.content.target.alternativeSenses.map(({ senseId }) => senseId)).toEqual([
      "ndricim.light-or-equipment",
      "ndricim-brightness",
      "ndricim-enlightenment",
    ]);
    expect(first.content.alternativeReadings.map(({ readingId }) => readingId)).toEqual([
      "physical-light-or-equipment",
      "brightness",
      "historical-enlightenment",
    ]);
  });

  it("reports proposed NDRIÇ + IM reconstruction while keeping IM and unsupported consonant links Null", () => {
    const result = buildSymbolicFunctionalContentV0_1(ndrIçimInput());
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const segmentation = result.content.segmentations[0];
    expect(segmentation).toMatchObject({
      rawReconstruction: "NDRIÇIM",
      reconstructionStatus: "EXACT_MATCH",
      claimLayer: "USER_PROPOSAL",
    });
    expect(segmentation?.components.map(({ exactSpelling, span, status }) => ({ exactSpelling, span, status }))).toEqual([
      { exactSpelling: "NDRIÇ", span: { start: 0, end: 5 }, status: "CANDIDATE" },
      { exactSpelling: "IM", span: { start: 5, end: 7 }, status: "UNKNOWN_OR_NULL" },
    ]);
    expect(result.content.consonantStructures.map(({ character, position, status }) => ({ character, position, status }))).toEqual([
      { character: "N", position: 0, status: "UNKNOWN_OR_NULL" },
      { character: "D", position: 1, status: "UNKNOWN_OR_NULL" },
      { character: "R", position: 2, status: "UNKNOWN_OR_NULL" },
      { character: "Ç", position: 4, status: "UNKNOWN_OR_NULL" },
      { character: "M", position: 6, status: "UNKNOWN_OR_NULL" },
    ]);
    expect(result.content.unresolved.map(({ claimId }) => claimId)).toEqual(expect.arrayContaining([
      "component:proposed-ndriç-im:unresolved-im",
      "im-function",
      "m-autonomous-meaning",
      "consonant:N@0",
      "consonant:Ç@4",
    ]));
  });

  it("accepts a generic synthetic target without a word-name branch", () => {
    const synthetic: SymbolicFunctionalContentInputV0_1 = {
      target: {
        exactSpelling: "YUMEN",
        language: "Synthetic fixture",
        variety: "Test data",
        selectedSense: {
          senseId: "synthetic-action",
          label: "user-described action sense",
          definition: "A synthetic action frame used only to exercise composition.",
          claimLayer: "USER_PROPOSAL",
          evidenceStatus: "USER_PROPOSED",
          sourceIds: [],
          functionalFrame: "ACTION_OF_VERB_FUNCTION",
        },
        alternativeSenses: [],
      },
      sources: [],
      segmentationCandidates: [{
        candidateId: "synthetic-whole",
        components: [{ componentId: "whole", exactSpelling: "YUMEN" }],
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      }],
      functionCandidates: [{
        candidateId: "synthetic-function",
        exactForm: "TONE",
        sourceSenseId: "synthetic-function-sense",
        functionText: "emits a clear tone",
        claimLayer: "USER_PROPOSAL",
        evidenceStatus: "USER_PROPOSED",
        sourceIds: [],
      }],
      componentFunctionBindings: [],
      voiceRoleCandidates: [],
      consonantAssociationCandidates: [],
      compositionOperations: [{
        operationId: "synthetic-action-of",
        operationType: "ACTION_OF_VERB_FUNCTION",
        candidateLabel: "synthetic proposal",
        targetSenseId: "synthetic-action",
        functionCandidateId: "synthetic-function",
        operationStatus: "USER_PROPOSED",
        evidenceStatus: "USER_PROPOSED",
        relationSourceIds: [],
      }],
      alternativeReadings: [],
      unresolvedClaims: [],
    };
    const result = buildSymbolicFunctionalContentV0_1(synthetic);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.content.compositions[0]).toMatchObject({
      resultText: "Action/process corresponding to the verb function: emits a clear tone",
      claimLayer: "USER_PROPOSAL",
      status: "COMPOSED_WITH_USER_PROPOSED_RELATION",
      targetSenseId: "synthetic-action",
    });
    expect(result.content.target.exactSpelling).toBe("YUMEN");
    expect(result.content.target.writtenVoices).toEqual([
      { voice: "Y", position: 0 },
      { voice: "U", position: 1 },
      { voice: "E", position: 3 },
    ]);
    expect(result.content.voiceEvents.every((event) => event.roleStatus === "UNKNOWN_OR_NULL")).toBe(true);
  });

  it("rejects decomposed spellings instead of normalizing away code-point coordinates", () => {
    const input = ndrIçimInput();
    const decomposed = {
      ...input,
      target: { ...input.target, exactSpelling: "NDRIC\u0327IM" },
    };
    expect(buildSymbolicFunctionalContentV0_1(decomposed)).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining([
        "TARGET_EXACT_SPELLING_MUST_BE_NFC_FOR_CODE_POINT_ACCOUNTING",
      ]),
    });
  });

  it("rejects a relationship that cites a source not bound to the selected sense", () => {
    const input = ndrIçimInput();
    const invalid = {
      ...input,
      compositionOperations: input.compositionOperations.map((operation) =>
        operation.operationId === "compose-literal-light-action"
          ? { ...operation, relationSourceIds: ["fjale-ndricoj"] }
          : operation,
      ),
    };
    const result = buildSymbolicFunctionalContentV0_1(invalid);
    expect(result).toMatchObject({
      ok: false,
      reasonCodes: expect.arrayContaining(["SOURCE_RELATION_PROVENANCE_INVALID:compose-literal-light-action"]),
    });
  });

  it("keeps unsupported operations Null and never claims origin, automatic selection, or direct Zheji fidelity", () => {
    const input = ndrIçimInput();
    const withNull = {
      ...input,
      functionCandidates: [...input.functionCandidates, {
        candidateId: "unknown-verb-function",
        exactForm: "NDRIÇOJ",
        sourceSenseId: "unknown-source-sense",
        functionText: null,
        claimLayer: "UNKNOWN_OR_NULL" as const,
        evidenceStatus: "UNKNOWN_OR_NULL" as const,
        sourceIds: [],
      }],
      compositionOperations: [...input.compositionOperations, {
        operationId: "unsupported-link",
        operationType: "ACTION_OF_VERB_FUNCTION" as const,
        candidateLabel: "unsupported association",
        targetSenseId: "ndricim.action-of-verb",
        functionCandidateId: "unknown-verb-function",
        operationStatus: "UNKNOWN_OR_NULL" as const,
        evidenceStatus: "UNKNOWN_OR_NULL" as const,
        relationSourceIds: [],
      }],
    };
    const result = buildSymbolicFunctionalContentV0_1(withNull);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.content.compositions.at(-1)).toMatchObject({
      resultText: null,
      claimLayer: "UNKNOWN_OR_NULL",
      status: "UNKNOWN_OR_NULL",
      evidenceStatus: "UNKNOWN_OR_NULL",
    });
    expect(result.content.selection).toEqual({ mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" });
    expect(result.content.sourceAuthorityPromotion).toBe("NONE");
    expect(result.content.productionAuthority).toBe("NONE");
    expect(result.content.historicalOrigin).toBe("NOT_CLAIMED");
    expect(result.content.symbolicAlgorithmAttribution).toBe("ZHEJI_INSPIRED_ZERO_RESEARCH_IMPLEMENTATION");
  });

  it("does not alter the established STUDIM and GJITHÇKA trace projections", () => {
    const studim = projectFunctionalMotivationTraceV0_1(FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.STUDIM);
    const gjithçka = projectFunctionalMotivationTraceV0_1(FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.GJITHÇKA);
    expect(studim.status).toBe("READY");
    expect(gjithçka.status).toBe("READY");
    if (studim.status !== "READY" || gjithçka.status !== "READY") return;
    expect(studim.projection.motivationEquation.equation).toContain("SHTU (proposed increase function) + DI (know / knowledge)");
    expect(studim.projection.target.writtenVoices).toEqual(["U@2", "I@4"]);
    expect(studim.projection.components.at(-1)?.status).toBe("UNKNOWN_OR_NULL");
    expect(gjithçka.projection.reconstruction.status).toBe("MISMATCH");
    expect(gjithçka.projection.surfaceReconciliation).toMatchObject({
      status: "EXACT_MATCH",
      initialForm: "GJITHËÇKA",
      finalForm: "GJITHÇKA",
      operationCount: 1,
      cost: 1,
      inverseStatus: "EXACT_MATCH",
    });
    expect(gjithçka.projection.target.writtenVoices).toEqual(["I@2", "A@7"]);
  });
});
