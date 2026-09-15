import {
  evaluateDoctrineSemanticCompositionContractV0_1,
  DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
} from "../src/shared/openInstrument/doctrineSemanticCompositionContract.v0_1";
import type {
  StructuralHypothesisV0_1,
} from "../src/shared/structuralHypothesisDiscovery.v0_1";

function structuralFixture(
  terminalVoicePath: string[] = ["U"],
): StructuralHypothesisV0_1 {
  return {
    hypothesisVersion: "z-zero.structural-hypothesis.v0_1",
    hypothesisId: "logic-structural:fixture:ER:peel_left_consonant_frame",
    basis: "fixture",
    embryo: "ER",
    embryoSize: 2,
    discoveryStatus: "structural_hypothesis",
    independentStandaloneMeaning: null,
    lexicalAttestation: "not_evaluated",
    functionalSupportStatus: "unknown",
    reductionSteps: [
      {
        from: "FIXTURE",
        to: "ER",
        operationId: "peel_left_consonant_frame",
        reasonCodes: [
          "structural_reduction_applied",
          "left_consonant_frame_preserved",
          "structural_containment_preserved",
          "deterministic_operation_authorized",
          "voice_path_recorded",
        ],
        fromSpan: { start: 0, end: 2 },
        removedOrChanged: "FIX",
        voicePathBefore: ["I"],
        voicePathAfter: terminalVoicePath as StructuralHypothesisV0_1["reductionSteps"][number]["voicePathAfter"],
      },
    ],
    expansionChain: ["ER", "FIXTURE"],
    reasonCodes: [
      "structural_reduction_applied",
      "structural_containment_preserved",
      "deterministic_operation_authorized",
      "terminal_structural_hypothesis_reached",
      "voice_path_recorded",
      "independent_meaning_unknown",
      "lexical_attestation_not_required_for_discovery",
      "historical_origin_not_claimed",
      "candidate_truth_not_claimed",
      "production_promotion_not_claimed",
    ],
    evidenceRefs: [],
    historicalOriginClaim: "not_claimed",
    historicalTransmissionClaim: "not_claimed",
    winnerClaim: "not_claimed",
    languageSuperiorityClaim: "not_claimed",
    candidateTruthClaim: "not_claimed",
    userDecisionPosture: "user_decides",
  };
}

describe("Open Instrument doctrine semantic composition contract v0.1", () => {
  test.each([
    ["A", "Initiation/Source"],
    ["E", "Expansion/Bridge"],
    ["I", "Direction/Focus"],
    ["O", "Mediation/Balance"],
    ["U", "Containment/Depth"],
    ["Y", "Reflection/Mirror"],
    ["Ë", "Completion/Unit"],
  ])("projects canonical %s through the locked role vocabulary", (voice, role) => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture([voice]),
    });

    expect(result).toMatchObject({
      schemaVersion: DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
      status: "INTERPRETATION_SUPPORTED",
      compositionMode: "ORDERED_ROLES_ONLY",
      interpretationLevel: "ordered_doctrine_roles",
      orderedRoleProjection: [
        { pathIndex: 0, voice, doctrineRole: role },
      ],
      truthClassification: {
        registryMapping: "fact",
        structuralProjection: "inference",
        targetBoundRelation: "not_applicable",
      },
    });
  });

  test("uses terminal structural path rather than a whole-word fallback", () => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(["U"]),
    });

    expect(result).toMatchObject({
      terminalVoicePath: ["U"],
      orderedRoleProjection: [
        { pathIndex: 0, voice: "U", doctrineRole: "Containment/Depth" },
      ],
    });
  });

  test("preserves multi-voice order without semantic collapse", () => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(["U", "I"]),
    });

    expect(result).toMatchObject({
      terminalVoicePath: ["U", "I"],
      orderedRoleProjection: [
        { pathIndex: 0, voice: "U", doctrineRole: "Containment/Depth" },
        { pathIndex: 1, voice: "I", doctrineRole: "Direction/Focus" },
      ],
    });
    expect(result).not.toHaveProperty("semanticBridge");
    expect(result).not.toHaveProperty("functionalStatement");
    expect(JSON.stringify(result)).not.toContain("leads");
    expect(JSON.stringify(result)).not.toContain("becomes");
  });

  test("preserves repeated voices and distinct path indexes", () => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(["Y", "E", "Y"]),
    });

    expect(result).toMatchObject({
      terminalVoicePath: ["Y", "E", "Y"],
      orderedRoleProjection: [
        { pathIndex: 0, voice: "Y", doctrineRole: "Reflection/Mirror" },
        { pathIndex: 1, voice: "E", doctrineRole: "Expansion/Bridge" },
        { pathIndex: 2, voice: "Y", doctrineRole: "Reflection/Mirror" },
      ],
    });
  });

  test("preserves absent target sense as non-applicable context", () => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(["U"]),
    });

    expect(result).not.toHaveProperty("targetSense");
    expect(result).toMatchObject({
      truthClassification: { targetBoundRelation: "not_applicable" },
    });
  });

  test("preserves target sense as context without semantic proof", () => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(["U", "I"]),
      targetSense: {
        id: "  bounded_sense ",
        label: "  a bounded sense  ",
        definition: "  a bounded definition  ",
      },
    });

    expect(result).toMatchObject({
      targetSense: {
        id: "bounded_sense",
        label: "a bounded sense",
        definition: "a bounded definition",
      },
      truthClassification: { targetBoundRelation: "unknown" },
    });
    expect(result).not.toHaveProperty("semanticBridge");
    expect(result).not.toHaveProperty("functionalStatement");
  });

  test.each([
    [null, "STRUCTURAL_HYPOTHESIS_REQUIRED"],
    [{}, "STRUCTURAL_HYPOTHESIS_INVALID"],
  ])("rejects malformed structural input %#", (structuralHypothesis, reasonCode) => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralHypothesis as StructuralHypothesisV0_1,
    });

    expect(result).toMatchObject({ status: "REJECT", reasonCodes: [reasonCode] });
  });

  test("rejects a structural hypothesis without a terminal reduction step", () => {
    const structural = structuralFixture(["U"]);
    structural.reductionSteps = [];

    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structural,
    });

    expect(result).toMatchObject({
      status: "REJECT",
      reasonCodes: ["TERMINAL_REDUCTION_STEP_REQUIRED"],
    });
  });

  test.each([
    [[], "TERMINAL_VOICE_PATH_REQUIRED"],
    [["V"], "UNSUPPORTED_VOICE"],
  ])("fails closed for terminal path %#", (path, reasonCode) => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(path as string[]),
    });

    expect(result).toMatchObject({ status: "REJECT" });
    expect(result.reasonCodes).toContain(reasonCode);
    expect(result.reasonCodes).toContain(
      path.length === 0
        ? "TERMINAL_VOICE_PATH_REQUIRED"
        : "DOCTRINE_PROJECTION_REJECTED",
    );
  });

  test("rejects malformed target sense context", () => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(["U"]),
      targetSense: { id: "", label: "" },
    });

    expect(result).toMatchObject({
      status: "REJECT",
      reasonCodes: ["TARGET_SENSE_INVALID"],
    });
  });

  test("is deterministic and carries complete reproducibility provenance", () => {
    const input = {
      structuralHypothesis: structuralFixture(["U", "I"]),
      targetSense: { id: "sense", label: "bounded sense" },
    };

    const first = evaluateDoctrineSemanticCompositionContractV0_1(input);
    const second = evaluateDoctrineSemanticCompositionContractV0_1(input);

    expect(first).toEqual(second);
    expect(first).toMatchObject({
      provenance: {
        contractSchema: DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
        doctrineProjectionSchema: "open-instrument.doctrine-projection.v0_1",
        orderedViewsSchema: "open-instrument.seven-voice-ordered-views.v0.1",
        doctrineAuthority: "src/shared/doctrine/voiceDoctrine.v0.1.ts",
        roleVocabularyAuthority: "src/shared/sevenPrinciples.v1.ts",
        structuralHypothesisId: input.structuralHypothesis.hypothesisId,
        terminalVoicePath: ["U", "I"],
        targetSenseId: "sense",
      },
    });
  });

  test("preserves claim boundaries and excludes lexical/component claims", () => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(["U"]),
    });

    expect(result).toMatchObject({
      claimBoundary: {
        historicalOriginClaim: "not_claimed",
        historicalTransmissionClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        lexicalMeaningClaim: "not_claimed",
      },
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(result).not.toHaveProperty("functionalComponents");
    expect(result).not.toHaveProperty("semanticBridge");
    expect(result).not.toHaveProperty("functionalStatement");
  });

  test("uses projection roles rather than modern doctrine labels", () => {
    const result = evaluateDoctrineSemanticCompositionContractV0_1({
      structuralHypothesis: structuralFixture(["U"]),
    });

    expect(result).toMatchObject({
      roleVocabularyAuthority: "src/shared/sevenPrinciples.v1.ts",
      orderedRoleProjection: [
        { doctrineRole: "Containment/Depth" },
      ],
    });
    expect(JSON.stringify(result)).not.toContain("Unity");
  });
});
