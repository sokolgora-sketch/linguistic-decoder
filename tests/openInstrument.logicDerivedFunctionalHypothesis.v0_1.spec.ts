import {
  buildLogicDerivedFunctionalHypothesisV0_1,
} from "../src/shared/openInstrument/logicDerivedFunctionalHypothesis.v0_1";
import type {
  StructuralHypothesisV0_1,
} from "../src/shared/structuralHypothesisDiscovery.v0_1";

function structuralFixture(): StructuralHypothesisV0_1 {
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
        voicePathAfter: ["E"],
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

describe("Open Instrument logic-derived functional hypothesis v0.1", () => {
  test("combines a target sense, structural anchor, and doctrine projection without promoting truth", () => {
    const result = buildLogicDerivedFunctionalHypothesisV0_1({
      targetWord: "fixture",
      targetSense: {
        id: "fixture_sense",
        label: "a bounded test object",
      },
      structuralHypothesis: structuralFixture(),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.hypothesis).toMatchObject({
      targetWord: "fixture",
      targetSenseId: "fixture_sense",
      aggregateStatus: "candidate_only",
      sourceKind: "logic_derived_functional_hypothesis",
      sourceStatus: "logic_derived_candidate",
      claimType: "functionalMotivation",
      embryo: "ER",
      voicePath: ["E"],
      functionalBridgeTruth: "hypothesis",
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(result.hypothesis.doctrineProjection.projections[0]).toMatchObject({
      voice: "E",
      doctrineRole: "Expansion/Bridge",
    });
    expect(result.hypothesis.semanticBridge).toContain(
      "possible functional bridge",
    );
    expect(result.hypothesis.semanticBridge).toContain(
      "not lexical evidence, candidate truth, or historical origin",
    );
  });

  test("is deterministic for identical input", () => {
    const input = {
      targetWord: "fixture",
      targetSense: { id: "fixture_sense", label: "a bounded test object" },
      structuralHypothesis: structuralFixture(),
    };

    expect(
      buildLogicDerivedFunctionalHypothesisV0_1(input),
    ).toEqual(buildLogicDerivedFunctionalHypothesisV0_1(input));
  });

  test.each([
    [
      { id: "", label: "a bounded test object" },
      "TARGET_SENSE_REQUIRED",
    ],
    [
      { id: "fixture_sense", label: "" },
      "TARGET_SENSE_REQUIRED",
    ],
  ])("requires an explicit target sense: %j", (targetSense, reasonCode) => {
    const result = buildLogicDerivedFunctionalHypothesisV0_1({
      targetWord: "fixture",
      targetSense,
      structuralHypothesis: structuralFixture(),
    });

    expect(result).toMatchObject({
      ok: false,
      reasonCodes: [reasonCode],
    });
  });

  test("rejects structural anchors without an authorized terminal voice path", () => {
    const structural = structuralFixture();
    structural.reductionSteps[0].voicePathAfter = [];

    expect(
      buildLogicDerivedFunctionalHypothesisV0_1({
        targetWord: "fixture",
        targetSense: { id: "fixture_sense", label: "a bounded test object" },
        structuralHypothesis: structural,
      }),
    ).toMatchObject({
      ok: false,
      reasonCodes: ["VOICE_PATH_REQUIRED"],
    });
  });

  test("rejects unsupported doctrine path values instead of normalizing them", () => {
    const structural = structuralFixture();
    structural.reductionSteps[0].voicePathAfter = ["e" as never];

    expect(
      buildLogicDerivedFunctionalHypothesisV0_1({
        targetWord: "fixture",
        targetSense: { id: "fixture_sense", label: "a bounded test object" },
        structuralHypothesis: structural,
      }),
    ).toMatchObject({
      ok: false,
      reasonCodes: ["DOCTRINE_PROJECTION_REJECTED", "unsupported_voice"],
    });
  });
});
