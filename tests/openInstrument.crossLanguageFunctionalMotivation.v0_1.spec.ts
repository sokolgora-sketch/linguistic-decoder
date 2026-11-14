import { GET } from "../app/api/analyze-v2/route";
import {
  hasLegacyInterpretationFieldsV2,
  projectNeutralInterpretationNodeV2,
} from "../src/shared/analyzeWordResult.v2.contract";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import {
  buildCrossLanguageFunctionalMotivationV0_1,
  CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1,
  replayCrossLanguageOperationSequenceV0_1,
  type CrossLanguageBoundaryOperationWitnessInputV0_1,
  type CrossLanguageFunctionalMotivationInputV0_1,
  type CrossLanguageOperationApplicationInputV0_1,
} from "@/shared/openInstrument/crossLanguageFunctionalMotivation.v0_1";
import {
  buildSingleWordFunctionalMotivationProposalV0_1,
  type SingleWordFunctionalMotivationInputV0_1,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";
import type { GenericFunctionalWitnessV1 } from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

const genericSourceWitness: GenericFunctionalWitnessV1 = {
  witnessId: "existing-generic-eat",
  queryForm: "DIETA",
  sourceId: "licensed-dictionary:entry-7",
  evidenceFamily: "lexical_dictionary",
  language: "English",
  sourceForm: "EAT",
  sourceFormNormalization: "EXACT_PRESERVED",
  gloss: "eat",
  citationRefs: ["licensed-dictionary:entry-7#EAT"],
  embryoRelation: "exact_form",
  relationOperationIds: ["IDENTITY.v0_1"],
  attestationTruth: "fact",
  sourceStatus: "reviewed_candidate",
  sourceAttestation: "SOURCE_RECORD_ONLY",
  functionalCorrespondence: "NOT_EVALUATED",
  targetMeaning: "NOT_CLAIMED",
  historicalRelation: "NOT_CLAIMED",
  winnerClaim: "NOT_CLAIMED",
  languageSuperiorityClaim: "NOT_CLAIMED",
  userDecisionPosture: "user_decides",
  noSingleWinner: true,
};

const dietaProposalInput: SingleWordFunctionalMotivationInputV0_1 = {
  targetWord: "DIETA",
  targetLanguage: "Albanian",
  targetDialect: "",
  segments: [
    {
      exactSpelling: "DI",
      proposedMeaning: "know",
      proposedGrammaticalRole: "verb",
      language: "Albanian",
      dialect: "",
      evidenceStatus: "USER_PROPOSED",
      evidenceReference: "",
      unresolved: false,
    },
    {
      exactSpelling: "ETA",
      proposedMeaning: "",
      proposedGrammaticalRole: "",
      language: "Albanian",
      dialect: "",
      evidenceStatus: "UNKNOWN_OR_NULL",
      evidenceReference: "",
      unresolved: true,
    },
  ],
  unresolvedConnectingMaterial: "ETA remains unresolved as a target-language component.",
  transformations: [],
  functionalExplanation: "Knowledge-guided eating.",
  transparency: "UNKNOWN_OR_NULL",
};

const dietaInput: CrossLanguageFunctionalMotivationInputV0_1 = {
  targetSense: { label: "", evidenceStatus: "UNKNOWN_OR_NULL", evidenceReference: "" },
  witnesses: [{
    kind: "USER_PROPOSED",
    witnessId: "eat-witness",
    exactForm: "EAT",
    language: "English",
    variety: "",
    proposedMeaning: "eat",
    evidenceStatus: "USER_PROPOSED",
    evidenceReference: "",
  }],
  correspondences: [{
    relationId: "eta-to-eat",
    targetComponentIndex: 1,
    witnessId: "eat-witness",
    proposedRelationship: "Functional witness by analogy.",
    applications: [{
      applicationId: "eta-to-eat-transpose-1",
      operationId: "TRANSPOSE_ADJACENT.v0_1",
      positions: [1, 2],
    }],
  }],
  proposedSynthesis: "Knowledge-guided eating.",
  unresolvedMaterial: ["Strict embryo meaning remains Unknown / Null."],
  functionalParallel: {
    parallelId: "food-intake-function-parallel",
    architectures: [
      {
        architectureId: "albanian-knowing-eating",
        label: "Albanian phrase proposal",
        language: "Albanian",
        exactForm: "DI TË HA",
        contributions: [
          { contributionId: "di-knowing", exactForm: "DI", proposedMeaning: "know", functionalRole: "knowing", evidenceStatus: "USER_PROPOSED", evidenceReference: "" },
          { contributionId: "te-ha-eating", exactForm: "TË HA", proposedMeaning: "know how to eat", functionalRole: "eating", evidenceStatus: "USER_PROPOSED", evidenceReference: "" },
        ],
      },
      {
        architectureId: "sanskrit-measured-intake",
        label: "Sanskrit functional comparison",
        language: "Sanskrit",
        exactForm: "MITĀHĀRA",
        contributions: [
          { contributionId: "mita-measured", exactForm: "mita", proposedMeaning: "measured / moderate", functionalRole: "measurement or moderation", evidenceStatus: "USER_PROPOSED", evidenceReference: "" },
          { contributionId: "ahara-intake", exactForm: "āhāra", proposedMeaning: "food intake", functionalRole: "nourishment", evidenceStatus: "USER_PROPOSED", evidenceReference: "" },
        ],
      },
    ],
    proposedSimilarity: "Regulating or understanding food intake.",
    differences: "Knowing and measuring are distinct functions.",
    unresolvedMaterial: "No historical relation is proposed; Sanskrit morphology and source locators remain unresolved.",
  },
  sourceWitnesses: [],
};

function buildDieta() {
  return buildCrossLanguageFunctionalMotivationV0_1(
    buildSingleWordFunctionalMotivationProposalV0_1(dietaProposalInput),
    dietaInput,
  );
}

const boundaryBaseInput: CrossLanguageFunctionalMotivationInputV0_1 = {
  ...dietaInput,
  witnesses: [],
  correspondences: [],
  proposedSynthesis: "",
  unresolvedMaterial: [],
  functionalParallel: null,
};

const mitaAharaBoundary: CrossLanguageBoundaryOperationWitnessInputV0_1 = {
  witnessId: "sanskrit-boundary-1",
  targetForm: "mitāhāra",
  language: "Sanskrit",
  componentForms: ["mita", "āhāra"],
  rawConcatenation: "mitaāhāra",
  boundaryAfterComponentIndex: 0,
  boundaryPosition: 4,
  affectedInputSpan: { start: 3, end: 5 },
  boundaryInput: "aā",
  boundaryOutput: "ā",
  declaredResultForm: "mitāhāra",
  linguisticRuleName: "savarṇa-dīrgha sandhi",
  linguisticRuleAttribution: "Sanskrit grammatical rule; user attributed",
  linguisticRuleReference: "https://learnsanskrit.org/vyakarana/sounds/savarna-sounds/",
  sourceReferences: ["https://www.wisdomlib.org/definition/mitahara"],
  evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
  functionalInterpretation: "Measured intake can be read as moderation in nourishment.",
};

function buildBoundaryCase(
  targetWord: string,
  segments: SingleWordFunctionalMotivationInputV0_1["segments"],
  boundaryOperationWitness: CrossLanguageBoundaryOperationWitnessInputV0_1,
) {
  const parent = buildSingleWordFunctionalMotivationProposalV0_1({
    targetWord,
    targetLanguage: boundaryOperationWitness.language,
    targetDialect: "",
    segments: segments.map((segment) => ({
      ...segment,
      proposedMeaning: "",
      proposedGrammaticalRole: "",
      language: boundaryOperationWitness.language,
      evidenceStatus: "UNKNOWN_OR_NULL" as const,
      evidenceReference: "",
      unresolved: true,
    })),
    unresolvedConnectingMaterial: "The boundary interaction is user declared and remains linguistically unverified.",
    transformations: [],
    functionalExplanation: "Boundary-witness fixture; no whole-word functional claim is asserted.",
    transparency: "UNKNOWN_OR_NULL",
  });
  return buildCrossLanguageFunctionalMotivationV0_1(parent, { ...boundaryBaseInput, boundaryOperationWitness });
}

describe("cross-language functional motivation v0.1", () => {
  it("records DIETA's target components separately from the user-proposed English witness", () => {
    const result = buildDieta();
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.proposal.target).toMatchObject({ exactWord: "DIETA", language: "Albanian", sense: { evidenceStatus: "UNKNOWN_OR_NULL" } });
    expect(result.proposal.targetComponents.map((component) => [component.componentId, component.exactSpelling])).toEqual([
      ["target-component-1", "DI"],
      ["target-component-2", "ETA"],
    ]);
    expect(result.proposal.targetComponents[1]).toMatchObject({ unresolved: true, proposedMeaning: null, evidenceStatus: "UNKNOWN_OR_NULL" });
    expect(result.proposal.targetComponents.map((component) => ({
      targetCodePointSpan: component.targetCodePointSpan,
      voiceAttributionStatus: component.voiceAttributionStatus,
      voiceAttributionReasonCodes: component.voiceAttributionReasonCodes,
    }))).toEqual([
      { targetCodePointSpan: { start: 0, end: 2 }, voiceAttributionStatus: "ATTRIBUTED", voiceAttributionReasonCodes: [] },
      { targetCodePointSpan: { start: 2, end: 5 }, voiceAttributionStatus: "ATTRIBUTED", voiceAttributionReasonCodes: [] },
    ]);
    expect(result.proposal.witnesses).toEqual([expect.objectContaining({
      witnessId: "eat-witness",
      kind: "USER_PROPOSED",
      exactForm: "EAT",
      language: "English",
      proposedMeaning: "eat",
      evidenceStatus: "USER_PROPOSED",
      sourceRecord: null,
    })]);
    expect(result.proposal.correspondences).toEqual([expect.objectContaining({
      targetComponentId: "target-component-2",
      targetComponentForm: "ETA",
      witnessId: "eat-witness",
      witnessForm: "EAT",
      input: "ETA",
      output: "EAT",
      exactFormMatch: true,
      formStatus: "EXACT_MATCH",
      operationCount: 1,
      totalCost: 1,
      independentVerifiedCorrespondenceCount: 0,
      authority: "USER_DECLARED_UNVERIFIED",
      linguisticValidity: "NOT_ASSESSED",
      voiceConservation: "PRESERVED",
      applications: [expect.objectContaining({
        operationId: "TRANSPOSE_ADJACENT.v0_1",
        positions: [1, 2],
        before: "ETA",
        after: "EAT",
        cost: 1,
        status: "APPLIED",
        voicePathBefore: ["E", "A"],
        voicePathAfter: ["E", "A"],
      })],
    })]);
    expect(result.proposal.targetWrittenVoices.path).toEqual(["I", "E", "A"]);
    expect(result.proposal.targetWrittenVoices.events.map(({ voice, sourcePosition }) => [voice, sourcePosition])).toEqual([
      ["I", 1], ["E", 2], ["A", 4],
    ]);
    expect(result.proposal.targetComponents.flatMap((component) => component.voiceEvents.map((event) => event.voice))).toEqual(["I", "E", "A"]);
    expect(result.proposal.targetComponents.map((component) => component.voiceEvents.map(({ voice, sourcePosition }) => [voice, sourcePosition]))).toEqual([
      [["I", 1]], [["E", 2], ["A", 4]],
    ]);
    expect(result.proposal.functionalSynthesis).toEqual({ text: "Knowledge-guided eating.", status: "EXPLORATORY_HYPOTHESIS" });
    expect(result.proposal.strictEmbryoMeaning).toEqual({ status: "UNKNOWN_OR_NULL", meaning: null });
    expect(result.proposal.sourceAuthorityPromotion).toBe("NONE");
    expect(result.proposal.selection).toEqual({ mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" });
  });

  it("records the MITĀHĀRA boundary as an exact, attributed, non-executable witness", () => {
    const result = buildBoundaryCase("mitāhāra", [
      { ...dietaProposalInput.segments[0]!, exactSpelling: "mita", language: "Sanskrit", proposedMeaning: "measured", unresolved: false },
      { ...dietaProposalInput.segments[1]!, exactSpelling: "āhāra", language: "Sanskrit", proposedMeaning: "food intake", unresolved: false },
    ], mitaAharaBoundary);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.proposal.boundaryOperationWitness).toMatchObject({
      targetForm: "mitāhāra",
      language: "Sanskrit",
      positionUnit: "zero_based_unicode_code_point",
      spanConvention: "half_open",
      componentForms: ["mita", "āhāra"],
      rawConcatenation: "mitaāhāra",
      boundaryAfterComponentIndex: 0,
      boundaryPosition: 4,
      boundaryInput: "aā",
      boundaryOutput: "ā",
      affectedInputSpan: { start: 3, end: 5 },
      affectedOutputSpan: { start: 3, end: 4 },
      declaredResultForm: "mitāhāra",
      reconstructedForm: "mitāhāra",
      mechanicalReconstructionStatus: "EXACT_MATCH",
      linguisticRule: {
        name: "savarṇa-dīrgha sandhi",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      },
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      linguisticApplicabilityStatus: "NOT_ASSESSED",
      authority: "USER_DECLARED_UNVERIFIED",
      operationCost: null,
      writtenVoices: { status: "UNKNOWN_OR_NULL", path: [], events: [] },
      unresolvedVoices: ["FOREIGN_ORTHOGRAPHY_NOT_PROJECTED_TO_CANONICAL_WRITTEN_VOICES"],
      functionalInterpretation: {
        text: "Measured intake can be read as moderation in nourishment.",
        status: "USER_PROPOSED",
      },
      sourceAuthorityPromotion: "NONE",
    });
    expect(result.proposal.targetWrittenVoices.status).toBe("UNKNOWN_OR_NULL");
    expect(result.proposal.strictEmbryoMeaning).toEqual({ status: "UNKNOWN_OR_NULL", meaning: null });
    expect(buildBoundaryCase("mitāhāra", [
      { ...dietaProposalInput.segments[0]!, exactSpelling: "mita", language: "Sanskrit", proposedMeaning: "measured", unresolved: false },
      { ...dietaProposalInput.segments[1]!, exactSpelling: "āhāra", language: "Sanskrit", proposedMeaning: "food intake", unresolved: false },
    ], mitaAharaBoundary)).toEqual(result);
  });

  it.each(["USER_PROPOSED", "CITATION_ENTERED_UNVERIFIED", "UNKNOWN_OR_NULL"] as const)(
    "keeps linguistic applicability NOT_ASSESSED when evidence is %s",
    (evidenceStatus) => {
      const result = buildBoundaryCase("mitāhāra", [
        { ...dietaProposalInput.segments[0]!, exactSpelling: "mita", language: "Sanskrit" },
        { ...dietaProposalInput.segments[1]!, exactSpelling: "āhāra", language: "Sanskrit" },
      ], { ...mitaAharaBoundary, evidenceStatus });
      expect(result.status).toBe("READY");
      if (result.status !== "READY") return;

      expect(result.proposal.boundaryOperationWitness).toMatchObject({
        evidenceStatus,
        linguisticRule: { evidenceStatus },
        linguisticApplicabilityStatus: "NOT_ASSESSED",
      });
    },
  );

  it("uses code-point coordinates for a synthetic non-Sanskrit boundary fixture", () => {
    const syntheticWitness: CrossLanguageBoundaryOperationWitnessInputV0_1 = {
      ...mitaAharaBoundary,
      witnessId: "synthetic-boundary-1",
      targetForm: "xQ",
      language: "Synthetic fixture language",
      componentForms: ["x😀y", "z"],
      rawConcatenation: "x😀yz",
      boundaryAfterComponentIndex: 0,
      boundaryPosition: 3,
      affectedInputSpan: { start: 1, end: 4 },
      boundaryInput: "😀yz",
      boundaryOutput: "Q",
      declaredResultForm: "xQ",
      linguisticRuleName: "synthetic replacement",
      linguisticRuleAttribution: "synthetic test fixture only",
      linguisticRuleReference: "",
      sourceReferences: [],
      evidenceStatus: "USER_PROPOSED",
      functionalInterpretation: "Synthetic fixture only.",
    };
    const result = buildBoundaryCase("xQ", [
      { ...dietaProposalInput.segments[0]!, exactSpelling: "x", language: syntheticWitness.language },
      { ...dietaProposalInput.segments[1]!, exactSpelling: "Q", language: syntheticWitness.language },
    ], syntheticWitness);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.proposal.boundaryOperationWitness).toMatchObject({
      rawConcatenation: "x😀yz",
      boundaryPosition: 3,
      affectedInputSpan: { start: 1, end: 4 },
      boundaryInput: "😀yz",
      reconstructedForm: "xQ",
      mechanicalReconstructionStatus: "EXACT_MATCH",
    });
  });

  it("rejects inconsistent boundary positions, declared outputs, and combining-sequence splits", () => {
    const validSegments = [
      { ...dietaProposalInput.segments[0]!, exactSpelling: "mita", language: "Sanskrit" },
      { ...dietaProposalInput.segments[1]!, exactSpelling: "āhāra", language: "Sanskrit" },
    ];
    const wrongPosition = buildBoundaryCase("mitāhāra", validSegments, { ...mitaAharaBoundary, boundaryPosition: 3 });
    expect(wrongPosition).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["BOUNDARY_WITNESS_CODE_POINT_POSITION_MISMATCH"]) });

    const wrongOutput = buildBoundaryCase("mitāhāra", validSegments, { ...mitaAharaBoundary, boundaryOutput: "āh" });
    expect(wrongOutput).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["BOUNDARY_WITNESS_DECLARED_RESULT_MISMATCH"]) });

    const malformedSpan = buildBoundaryCase("mitāhāra", validSegments, {
      ...mitaAharaBoundary,
      affectedInputSpan: { start: 3, end: 3 },
    });
    expect(malformedSpan).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["BOUNDARY_WITNESS_INPUT_SPAN_INVALID"]) });

    const combiningWitness: CrossLanguageBoundaryOperationWitnessInputV0_1 = {
      ...mitaAharaBoundary,
      witnessId: "synthetic-combining-boundary",
      targetForm: "ab",
      language: "Synthetic fixture language",
      componentForms: ["a\u0301", "b"],
      rawConcatenation: "a\u0301b",
      boundaryPosition: 2,
      affectedInputSpan: { start: 1, end: 3 },
      boundaryInput: "\u0301b",
      boundaryOutput: "b",
      declaredResultForm: "ab",
      evidenceStatus: "USER_PROPOSED",
      sourceReferences: [],
      linguisticRuleReference: "",
    };
    const combining = buildBoundaryCase("ab", [
      { ...dietaProposalInput.segments[0]!, exactSpelling: "a", language: combiningWitness.language },
      { ...dietaProposalInput.segments[1]!, exactSpelling: "b", language: combiningWitness.language },
    ], combiningWitness);
    expect(combining).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["BOUNDARY_WITNESS_INPUT_SPAN_SPLITS_COMBINING_SEQUENCE"]) });
  });

  it("keeps entered citations unverified and rejects a witness attached to another target", () => {
    const segments = [
      { ...dietaProposalInput.segments[0]!, exactSpelling: "mita", language: "Sanskrit" },
      { ...dietaProposalInput.segments[1]!, exactSpelling: "āhāra", language: "Sanskrit" },
    ];
    const result = buildBoundaryCase("mitāhāra", segments, mitaAharaBoundary);
    expect(result.status).toBe("READY");
    if (result.status === "READY") {
      expect(result.proposal.boundaryOperationWitness?.authority).toBe("USER_DECLARED_UNVERIFIED");
      expect(result.proposal.boundaryOperationWitness?.sourceAuthorityPromotion).toBe("NONE");
    }
    expect(buildBoundaryCase("mitāhāra", segments, { ...mitaAharaBoundary, targetForm: "another-word" })).toMatchObject({
      status: "INVALID",
      reasonCodes: ["BOUNDARY_WITNESS_TARGET_FORM_MISMATCH"],
    });
  });

  it("attributes composed PË + O spans in the analyzer's NFC code-point coordinates", () => {
    const parent = buildSingleWordFunctionalMotivationProposalV0_1({
      ...dietaProposalInput,
      targetWord: "PËO",
      segments: [
        { ...dietaProposalInput.segments[0]!, exactSpelling: "PË" },
        { ...dietaProposalInput.segments[1]!, exactSpelling: "O" },
      ],
      unresolvedConnectingMaterial: "",
    });
    expect(parent.status).toBe("READY");
    if (parent.status !== "READY") return;

    const result = buildCrossLanguageFunctionalMotivationV0_1(parent, { ...dietaInput, correspondences: [] });
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.proposal.target.exactWord).toBe("PËO");
    expect(result.proposal.targetComponents.map(({ exactSpelling, targetCodePointSpan, voiceAttributionStatus }) => ({
      exactSpelling,
      targetCodePointSpan,
      voiceAttributionStatus,
    }))).toEqual([
      { exactSpelling: "PË", targetCodePointSpan: { start: 0, end: 2 }, voiceAttributionStatus: "ATTRIBUTED" },
      { exactSpelling: "O", targetCodePointSpan: { start: 2, end: 3 }, voiceAttributionStatus: "ATTRIBUTED" },
    ]);
    expect(result.proposal.targetWrittenVoices.events.map(({ voice, sourcePosition }) => [voice, sourcePosition])).toEqual([
      ["Ë", 1], ["O", 2],
    ]);
    expect(result.proposal.targetComponents.map((component) => component.voiceEvents.map(({ voice, sourcePosition }) => [voice, sourcePosition]))).toEqual([
      [["Ë", 1]], [["O", 2]],
    ]);
  });

  it("withholds component spans for decomposed PE + combining diaeresis + O while retaining NFC target Voices", () => {
    const decomposedTarget = "PE\u0308O";
    const decomposedFirstComponent = "PE\u0308";
    const parent = buildSingleWordFunctionalMotivationProposalV0_1({
      ...dietaProposalInput,
      targetWord: decomposedTarget,
      segments: [
        { ...dietaProposalInput.segments[0]!, exactSpelling: decomposedFirstComponent },
        { ...dietaProposalInput.segments[1]!, exactSpelling: "O" },
      ],
      unresolvedConnectingMaterial: "",
    });
    expect(parent.status).toBe("READY");
    if (parent.status !== "READY") return;
    expect(parent.proposal.reconstruction).toMatchObject({
      exactConcatenation: decomposedTarget,
      targetSpelling: decomposedTarget,
      formComparison: "EXACT_MATCH",
    });

    const result = buildCrossLanguageFunctionalMotivationV0_1(parent, { ...dietaInput, correspondences: [] });
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.proposal.target.exactWord).toBe(decomposedTarget);
    expect(result.proposal.targetComponents.map(({ componentId, exactSpelling, targetCodePointSpan, voiceAttributionStatus, voiceAttributionReasonCodes, voiceEvents }) => ({
      componentId,
      exactSpelling,
      targetCodePointSpan,
      voiceAttributionStatus,
      voiceAttributionReasonCodes,
      voiceEvents,
    }))).toEqual([
      {
        componentId: "target-component-1",
        exactSpelling: decomposedFirstComponent,
        targetCodePointSpan: null,
        voiceAttributionStatus: "UNKNOWN_OR_NULL",
        voiceAttributionReasonCodes: ["TARGET_COMPONENT_NFC_ALIGNMENT_UNAVAILABLE"],
        voiceEvents: [],
      },
      {
        componentId: "target-component-2",
        exactSpelling: "O",
        targetCodePointSpan: null,
        voiceAttributionStatus: "UNKNOWN_OR_NULL",
        voiceAttributionReasonCodes: ["TARGET_COMPONENT_NFC_ALIGNMENT_UNAVAILABLE"],
        voiceEvents: [],
      },
    ]);
    expect(result.proposal.targetWrittenVoices).toMatchObject({ status: "COMPLETE", path: ["Ë", "O"] });
    expect(result.proposal.targetWrittenVoices.events.map(({ voice, sourcePosition }) => [voice, sourcePosition])).toEqual([
      ["Ë", 1], ["O", 2],
    ]);
  });

  it("withholds component spans for PEX + O = PEXO versus exact target PEO while retaining target Voices", () => {
    const parent = buildSingleWordFunctionalMotivationProposalV0_1({
      ...dietaProposalInput,
      targetWord: "PEO",
      segments: [
        { ...dietaProposalInput.segments[0]!, exactSpelling: "PEX" },
        { ...dietaProposalInput.segments[1]!, exactSpelling: "O" },
      ],
      unresolvedConnectingMaterial: "The component join does not match PEO.",
    });
    expect(parent.status).toBe("READY");
    if (parent.status !== "READY") return;
    expect(parent.proposal.reconstruction).toMatchObject({ exactConcatenation: "PEXO", targetSpelling: "PEO", formComparison: "MISMATCH" });

    const result = buildCrossLanguageFunctionalMotivationV0_1(parent, { ...dietaInput, correspondences: [] });
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.proposal.target.exactWord).toBe("PEO");
    expect(result.proposal.targetComponents.map(({ componentId, exactSpelling, targetCodePointSpan }) => [componentId, exactSpelling, targetCodePointSpan])).toEqual([
      ["target-component-1", "PEX", null],
      ["target-component-2", "O", null],
    ]);
    expect(result.proposal.targetComponents.map(({ voiceAttributionStatus, voiceAttributionReasonCodes, voiceEvents }) => ({
      voiceAttributionStatus,
      voiceAttributionReasonCodes,
      voiceEvents,
    }))).toEqual([
      { voiceAttributionStatus: "UNKNOWN_OR_NULL", voiceAttributionReasonCodes: ["TARGET_COMPONENT_CONCATENATION_MISMATCH"], voiceEvents: [] },
      { voiceAttributionStatus: "UNKNOWN_OR_NULL", voiceAttributionReasonCodes: ["TARGET_COMPONENT_CONCATENATION_MISMATCH"], voiceEvents: [] },
    ]);
    expect(result.proposal.targetWrittenVoices.path).toEqual(["E", "O"]);
    expect(result.proposal.targetWrittenVoices.events.map(({ voice, sourcePosition }) => [voice, sourcePosition])).toEqual([["E", 1], ["O", 2]]);
  });

  it("preserves the KANDIL component mismatch without granting inferred component spans", () => {
    const parent = buildSingleWordFunctionalMotivationProposalV0_1({
      ...dietaProposalInput,
      targetWord: "KANDIL",
      segments: [
        { ...dietaProposalInput.segments[0]!, exactSpelling: "KAN", proposedMeaning: "have" },
        { ...dietaProposalInput.segments[1]!, exactSpelling: "DILL", proposedMeaning: "sun/light", proposedGrammaticalRole: "noun", unresolved: false, evidenceStatus: "USER_PROPOSED" },
      ],
      unresolvedConnectingMaterial: "The proposed KANDILL spelling differs from KANDIL.",
    });
    expect(parent.status).toBe("READY");
    if (parent.status !== "READY") return;
    expect(parent.proposal.reconstruction).toMatchObject({ exactConcatenation: "KANDILL", targetSpelling: "KANDIL", formComparison: "MISMATCH" });

    const result = buildCrossLanguageFunctionalMotivationV0_1(parent, { ...dietaInput, correspondences: [] });
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.proposal.targetComponents.map(({ componentId, exactSpelling, targetCodePointSpan }) => [componentId, exactSpelling, targetCodePointSpan])).toEqual([
      ["target-component-1", "KAN", null],
      ["target-component-2", "DILL", null],
    ]);
    expect(result.proposal.targetComponents.every((component) => component.voiceAttributionStatus === "UNKNOWN_OR_NULL" && component.voiceEvents.length === 0)).toBe(true);
    expect(result.proposal.targetWrittenVoices.path).toEqual(["A", "I"]);
    expect(result.proposal.targetWrittenVoices.events.map(({ voice, sourcePosition }) => [voice, sourcePosition])).toEqual([["A", 1], ["I", 4]]);
  });

  it("defines versioned reusable Identity and adjacent-transposition operations", () => {
    expect(CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1).toEqual([
      { operationId: "IDENTITY.v0_1", kind: "IDENTITY", version: "0.1", positionUnit: "none", cost: 0 },
      { operationId: "TRANSPOSE_ADJACENT.v0_1", kind: "TRANSPOSE_ADJACENT", version: "0.1", positionUnit: "zero_based_unicode_code_point", cost: 1 },
    ]);
    expect(replayCrossLanguageOperationSequenceV0_1("same", [{ applicationId: "identity-1", operationId: "IDENTITY.v0_1", positions: [] }])).toMatchObject({
      status: "EXAMINED", input: "same", output: "same", operationCount: 1, totalCost: 0,
    });
  });

  it("replays the same declared input deterministically", () => {
    expect(buildDieta()).toEqual(buildDieta());
  });

  it("supports multiple generic transposition applications with inspectable snapshots and costs", () => {
    const applications: CrossLanguageOperationApplicationInputV0_1[] = [
      { applicationId: "generic-swap-1", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [0, 1] },
      { applicationId: "generic-swap-2", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [2, 3] },
    ];
    const result = replayCrossLanguageOperationSequenceV0_1("ABCD", applications);
    expect(result.status).toBe("EXAMINED");
    expect(result.output).toBe("BADC");
    expect(result.operationCount).toBe(2);
    expect(result.totalCost).toBe(2);
    expect(result.applications.map((application) => [application.before, application.after])).toEqual([
      ["ABCD", "BACD"],
      ["BACD", "BADC"],
    ]);
  });

  it("rejects duplicate application identities, non-adjacent and out-of-range positions", () => {
    const duplicate = replayCrossLanguageOperationSequenceV0_1("ETA", [
      { applicationId: "same", operationId: "IDENTITY.v0_1", positions: [] },
      { applicationId: "same", operationId: "IDENTITY.v0_1", positions: [] },
    ]);
    expect(duplicate).toMatchObject({ status: "REJECTED", reasonCodes: expect.arrayContaining(["APPLICATION_2_ID_DUPLICATED"]) });

    const nonAdjacent = replayCrossLanguageOperationSequenceV0_1("MITA", [
      { applicationId: "bad-gap", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [1, 3] },
    ]);
    expect(nonAdjacent).toMatchObject({ status: "REJECTED", reasonCodes: expect.arrayContaining(["APPLICATION_1_POSITIONS_MUST_BE_ADJACENT_AND_ORDERED"]) });

    const outOfRange = replayCrossLanguageOperationSequenceV0_1("ETA", [
      { applicationId: "past-end", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [2, 3] },
    ]);
    expect(outOfRange.status).toBe("REJECTED");
    expect(outOfRange.applications[0]).toMatchObject({ status: "REJECTED", reasonCodes: ["TRANSPOSE_POSITION_OUT_OF_RANGE"] });
  });

  it("does not split Unicode combining sequences during adjacent transposition", () => {
    const result = replayCrossLanguageOperationSequenceV0_1("E\u0301TA", [
      { applicationId: "unsafe-combining-swap", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [0, 1] },
    ]);
    expect(result.status).toBe("REJECTED");
    expect(result.applications[0]?.reasonCodes).toContain("TRANSPOSE_WOULD_SPLIT_UNICODE_COMBINING_SEQUENCE");
  });

  it("keeps MITA to MAT unresolved under the v0.1 vocabulary and never drops I", () => {
    const outputs = [0, 1, 2].map((position) => replayCrossLanguageOperationSequenceV0_1("MITA", [
      { applicationId: `mitamat-${position}`, operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [position, position + 1] },
    ]));
    expect(outputs.map((item) => item.output)).toEqual(["IMTA", "MTIA", "MIAT"]);
    expect(outputs.every((item) => item.output !== "MAT" && item.output.includes("I"))).toBe(true);
    expect(CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_1.map((definition) => definition.kind)).not.toContain("OMIT");

    const attemptedOmission = replayCrossLanguageOperationSequenceV0_1("MITA", [{
      applicationId: "unsupported-omit",
      operationId: "OMIT.v0_1",
      positions: [1],
    } as never]);
    expect(attemptedOmission).toMatchObject({ status: "REJECTED", reasonCodes: expect.arrayContaining(["APPLICATION_1_OPERATION_UNSUPPORTED"]) });
  });

  it("keeps functional-architecture parallels proposed, records roles, and preserves Sanskrit spelling", () => {
    const result = buildDieta();
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    const parallel = result.proposal.functionalParallel;
    expect(parallel).toMatchObject({
      status: "USER_PROPOSED",
      relationshipAuthority: "USER_PROPOSED",
      historicalRelation: "NOT_CLAIMED",
      automaticSemanticEvaluation: "NOT_PERFORMED",
      proposedSimilarity: "Regulating or understanding food intake.",
      differences: "Knowing and measuring are distinct functions.",
    });
    expect(parallel?.architectures.map((architecture) => architecture.exactForm)).toEqual(["DI TË HA", "MITĀHĀRA"]);
    expect(parallel?.architectures[0]?.contributions.map((contribution) => contribution.functionalRole)).toEqual(["knowing", "eating"]);
    expect(parallel?.architectures[1]?.contributions.map((contribution) => contribution.functionalRole)).toEqual(["measurement or moderation", "nourishment"]);
    expect(parallel?.architectures[1]?.writtenVoices).toMatchObject({ status: "UNKNOWN_OR_NULL", path: [], unresolvedReason: "FOREIGN_ORTHOGRAPHY_NOT_PROJECTED_TO_CANONICAL_WRITTEN_VOICES" });
    expect(parallel?.architectures[1]?.contributions.every((contribution) => contribution.evidenceStatus === "USER_PROPOSED")).toBe(true);
  });

  it("does not create a source-backed witness from user citation text or a missing source id", () => {
    const citationProposal = buildCrossLanguageFunctionalMotivationV0_1(
      buildSingleWordFunctionalMotivationProposalV0_1(dietaProposalInput),
      {
        ...dietaInput,
        witnesses: [{
          kind: "USER_PROPOSED",
          witnessId: "citation-only",
          exactForm: "EAT",
          language: "English",
          variety: "",
          proposedMeaning: "eat",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
          evidenceReference: "User-entered citation, not independently checked",
        }],
        correspondences: [],
      },
    );
    expect(citationProposal.status).toBe("READY");
    if (citationProposal.status === "READY") {
      expect(citationProposal.proposal.witnesses[0]).toMatchObject({
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        sourceRecord: null,
        evidenceReference: "User-entered citation, not independently checked",
      });
    }

    const fakeSourceReference = buildCrossLanguageFunctionalMotivationV0_1(
      buildSingleWordFunctionalMotivationProposalV0_1(dietaProposalInput),
      {
        ...dietaInput,
        witnesses: [{ kind: "EXISTING_GENERIC_SOURCE_WITNESS", witnessId: "forged", genericWitnessId: "not-in-source-context" }],
        correspondences: [],
      },
    );
    expect(fakeSourceReference).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["WITNESS_1_SOURCE_RECORD_NOT_AVAILABLE"]) });
  });

  it("accepts a neutral generic witness from the active V2 response in the cross-language workbench", async () => {
    const response = await GET(new Request(
      "http://localhost/api/analyze-v2?word=pater&mode=strict&alphabet=auto",
    ));
    expect(response.status).toBe(200);
    const body: any = await response.json();

    expect(body.responseContractVersion).toBe("open-instrument.analyze-word-result.v2");
    expect(hasLegacyInterpretationFieldsV2(body)).toBe(false);
    const neutralMatch = body.candidates
      .flatMap((candidate: any) => candidate?.genericFunctionalWitnessRuntimeProjectionV1?.discovery?.matches ?? [])
      .find((match: any) => match.sourceId === "reviewed.external.albanian-at.father.candidate.v0_1");
    expect(neutralMatch).toMatchObject({
      sourceId: "reviewed.external.albanian-at.father.candidate.v0_1",
      sourceStatus: "reviewed_candidate",
      sourceAuthorityStatus: "reviewed_accepted",
      sourceForm: "at",
      citationRefs: ["reviewed.external.albanian-at.father.citation.v0_1"],
      sourceProvenance: {
        sourceRecordId: "reviewed.external.albanian-at.father.candidate.v0_1",
      },
      sourceAttestation: "SOURCE_RECORD_ONLY",
      functionalCorrespondence: "NOT_EVALUATED",
      interpretationDecisionPolicy: {
        multipleInterpretationsMayCoexist: true,
        automaticInterpretationSelection: "DISABLED",
        interpretationDecisionAuthority: "USER_DECIDES",
      },
    });
    expect(neutralMatch).not.toHaveProperty("winnerClaim");
    expect(neutralMatch).not.toHaveProperty("noSingleWinner");

    const vm = adaptAnalysisToTelemetryVM(body);
    const sourceWitnesses = vm.candidates.flatMap((candidate) => {
      const projection = candidate.genericFunctionalWitnessRuntimeProjectionV1;
      if (projection?.kind !== "present" || projection.value.targetWord !== vm.readout.word) return [];
      return projection.value.discovery.matches;
    });
    const sourceWitness = sourceWitnesses.find((match) => match.sourceId === neutralMatch.sourceId);
    expect(sourceWitness).toBeDefined();
    if (!sourceWitness) return;
    expect(sourceWitness.sourceId).toBe(neutralMatch.sourceId);
    expect(sourceWitness.sourceStatus).toBe(neutralMatch.sourceStatus);
    expect(sourceWitness.citationRefs).toEqual(neutralMatch.citationRefs);
    expect(sourceWitness.sourceProvenance?.sourceRecordId).toBe(neutralMatch.sourceId);

    const parent = buildSingleWordFunctionalMotivationProposalV0_1({
      targetWord: "pater",
      targetLanguage: "Latin",
      targetDialect: "",
      segments: ["p", "at", "er"].map((exactSpelling) => ({
        exactSpelling,
        proposedMeaning: "",
        proposedGrammaticalRole: "",
        language: "Latin",
        dialect: "",
        evidenceStatus: "UNKNOWN_OR_NULL" as const,
        evidenceReference: "",
        unresolved: true,
      })),
      unresolvedConnectingMaterial: "The fixture components carry no semantic claim.",
      transformations: [],
      functionalExplanation: "Compatibility regression fixture only.",
      transparency: "UNKNOWN_OR_NULL",
    });
    expect(parent.status).toBe("READY");

    const result = buildCrossLanguageFunctionalMotivationV0_1(parent, {
      ...dietaInput,
      witnesses: [{
        kind: "EXISTING_GENERIC_SOURCE_WITNESS",
        witnessId: "selected-v2-at",
        genericWitnessId: sourceWitness.witnessId,
      }],
      correspondences: [{
        relationId: "at-exact-source-witness",
        targetComponentIndex: 1,
        witnessId: "selected-v2-at",
        proposedRelationship: "User-declared exact-form comparison for compatibility coverage.",
        applications: [],
      }],
      proposedSynthesis: "Compatibility fixture; no functional claim is asserted.",
      sourceWitnesses: [sourceWitness],
    });

    expect(result).toMatchObject({ status: "READY" });
    if (result.status !== "READY") return;
    expect(result.proposal.witnesses[0]).toMatchObject({
      exactForm: "at",
      language: "sq",
      evidenceStatus: "SOURCE_RECORD_ONLY",
      sourceRecord: {
        sourceId: "reviewed.external.albanian-at.father.candidate.v0_1",
        sourceStatus: "reviewed_candidate",
        attestationTruth: "fact",
        citationRefs: ["reviewed.external.albanian-at.father.citation.v0_1"],
        functionalCorrespondence: "NOT_EVALUATED",
        sourceAttestation: "SOURCE_RECORD_ONLY",
      },
      writtenVoices: { status: "COMPLETE", path: ["A"] },
    });
    expect(result.proposal.correspondences[0]).toMatchObject({
      input: "at",
      output: "at",
      exactFormMatch: true,
      formStatus: "EXACT_MATCH",
      operationCount: 0,
      totalCost: 0,
      authority: "USER_DECLARED_UNVERIFIED",
      linguisticValidity: "NOT_ASSESSED",
      voiceConservation: "PRESERVED",
    });
    expect(result.proposal.sourceAuthorityPromotion).toBe("NONE");
    expect(result.proposal.selection.userDecisionPosture).toBe("user_decides");
  });

  it("reuses a generic witness only from the supplied source context without evaluating its function", () => {
    const result = buildCrossLanguageFunctionalMotivationV0_1(
      buildSingleWordFunctionalMotivationProposalV0_1(dietaProposalInput),
      {
        ...dietaInput,
        witnesses: [{
          kind: "EXISTING_GENERIC_SOURCE_WITNESS",
          witnessId: "selected-generic-eat",
          genericWitnessId: genericSourceWitness.witnessId,
        }],
        correspondences: [],
        sourceWitnesses: [genericSourceWitness],
      },
    );
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.proposal.witnesses).toEqual([expect.objectContaining({
      witnessId: "selected-generic-eat",
      kind: "EXISTING_GENERIC_SOURCE_WITNESS",
      exactForm: "EAT",
      language: "English",
      proposedMeaning: "eat",
      evidenceStatus: "SOURCE_RECORD_ONLY",
      sourceRecord: expect.objectContaining({
        genericWitnessId: "existing-generic-eat",
        sourceId: "licensed-dictionary:entry-7",
        functionalCorrespondence: "NOT_EVALUATED",
        sourceAttestation: "SOURCE_RECORD_ONLY",
      }),
    })]);
    expect(result.proposal.sourceAuthorityPromotion).toBe("NONE");
    expect(result.proposal.selection.mode).toBe("no_single_winner");
  });

  it("rejects malformed or claim-promoting generic source context", () => {
    const result = buildCrossLanguageFunctionalMotivationV0_1(
      buildSingleWordFunctionalMotivationProposalV0_1(dietaProposalInput),
      {
        ...dietaInput,
        witnesses: [],
        correspondences: [],
        sourceWitnesses: [{
          ...genericSourceWitness,
          functionalCorrespondence: "SUPPORTED" as never,
        }],
      },
    );
    expect(result).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["SOURCE_WITNESS_1_FUNCTIONAL_CORRESPONDENCE_ALREADY_EVALUATED"]) });
  });

  it("rejects malformed neutral decision policy on generic source context", () => {
    const neutralWitness = projectNeutralInterpretationNodeV2(genericSourceWitness) as Record<string, any>;
    const result = buildCrossLanguageFunctionalMotivationV0_1(
      buildSingleWordFunctionalMotivationProposalV0_1(dietaProposalInput),
      {
        ...dietaInput,
        witnesses: [],
        correspondences: [],
        sourceWitnesses: [{
          ...neutralWitness,
          interpretationDecisionPolicy: {
            ...neutralWitness.interpretationDecisionPolicy,
            automaticInterpretationSelection: "ENABLED",
          },
        }],
      },
    );
    expect(result).toMatchObject({
      status: "INVALID",
      reasonCodes: expect.arrayContaining(["SOURCE_WITNESS_1_GENERIC_WITNESS_CLAIM_BOUNDARY_INVALID"]),
    });
  });

  it("retains existing KANDIL mismatch and strict Null behavior without changing the parent contract", () => {
    const kandil: SingleWordFunctionalMotivationInputV0_1 = {
      ...dietaProposalInput,
      targetWord: "KANDIL",
      segments: [
        { ...dietaProposalInput.segments[0]!, exactSpelling: "KAN", proposedMeaning: "have", proposedGrammaticalRole: "verb" },
        { ...dietaProposalInput.segments[1]!, exactSpelling: "DILL", proposedMeaning: "light", proposedGrammaticalRole: "noun", unresolved: false, evidenceStatus: "USER_PROPOSED" },
      ],
      unresolvedConnectingMaterial: "",
      functionalExplanation: "A lamp holds or provides light.",
    };
    const parent = buildSingleWordFunctionalMotivationProposalV0_1(kandil);
    expect(parent).toMatchObject({ status: "READY", proposal: { reconstruction: { exactConcatenation: "KANDILL", formComparison: "MISMATCH" }, strictEmbryoMeaning: { status: "UNKNOWN_OR_NULL", meaning: null } } });
  });
});
