import { describe, expect, test } from "@jest/globals";
import {
  discoverStructuralHypothesesV0_1,
  type StructuralHypothesisV0_1,
} from "../src/shared/structuralHypothesisDiscovery.v0_1";
import {
  evaluateDoctrineSymbolicCompositionRuleV1,
  DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1,
} from "../src/shared/openInstrument/doctrineSymbolicCompositionRule.v1";

function structuralFixture(
  terminalVoicePath: string[] = ["U"],
): StructuralHypothesisV0_1 {
  const terminalForm = `R${terminalVoicePath.join("")}`;
  const basis = `T${terminalForm}`;

  return {
    hypothesisVersion: "z-zero.structural-hypothesis.v0_1",
    hypothesisId: "logic-structural:fixture:ER:peel_left_consonant_frame",
    basis,
    embryo: terminalForm,
    embryoSize: Array.from(terminalForm).length,
    discoveryStatus: "structural_hypothesis",
    independentStandaloneMeaning: null,
    lexicalAttestation: "not_evaluated",
    functionalSupportStatus: "unknown",
    reductionSteps: [
      {
        from: basis,
        to: terminalForm,
        operationId: "peel_left_consonant_frame",
        reasonCodes: [
          "structural_reduction_applied",
          "structural_containment_preserved",
          "deterministic_operation_authorized",
          "left_consonant_frame_preserved",
          "voice_path_recorded",
        ],
        fromSpan: { start: 0, end: 1 },
        removedOrChanged: "T",
        voicePathBefore: terminalVoicePath as StructuralHypothesisV0_1["reductionSteps"][number]["voicePathBefore"],
        voicePathAfter: terminalVoicePath as StructuralHypothesisV0_1["reductionSteps"][number]["voicePathAfter"],
      },
    ],
    expansionChain: [terminalForm, basis],
    reasonCodes: [
      "structural_reduction_applied",
      "structural_containment_preserved",
      "deterministic_operation_authorized",
      "terminal_structural_hypothesis_reached",
      "minimum_defensible_embryo_reached",
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

describe("Open Instrument doctrine symbolic composition rule v1", () => {
  test("composes a single voice as one state with zero transitions", () => {
    const result = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["U"]),
    });

    expect(result).toMatchObject({
      schemaVersion: DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1,
      status: "SYMBOLIC_COMPOSITION_SUPPORTED",
      structuralHypothesisId: "logic-structural:fixture:ER:peel_left_consonant_frame",
      terminalVoicePath: ["U"],
      startState: {
        pathIndex: 0,
        voice: "U",
        doctrineRole: "Containment/Depth",
      },
      terminalState: {
        pathIndex: 0,
        voice: "U",
        doctrineRole: "Containment/Depth",
      },
      transitions: [],
    });
  });

  test("emits one ordered transition for two distinct voices", () => {
    const result = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["U", "I"]),
    });

    expect(result).toMatchObject({
      compositionMode: "ORDERED_STATE_TRANSITION",
      transitions: [
        {
          transitionIndex: 0,
          transitionKind: "ORDERED_STATE_TRANSITION",
          from: { pathIndex: 0, voice: "U", doctrineRole: "Containment/Depth" },
          to: { pathIndex: 1, voice: "I", doctrineRole: "Direction/Focus" },
        },
      ],
    });
  });

  test("reverses transition direction when path order is reversed", () => {
    const forward = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["U", "I"]),
    });
    const reverse = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["I", "U"]),
    });

    expect(forward).toMatchObject({
      transitions: [{ from: { voice: "U" }, to: { voice: "I" } }],
    });
    expect(reverse).toMatchObject({
      transitions: [{ from: { voice: "I" }, to: { voice: "U" } }],
    });
    expect(forward).not.toEqual(reverse);
  });

  test("preserves every adjacent transition for three voices", () => {
    const result = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["A", "I", "Ë"]),
    });

    expect(result).toMatchObject({
      transitions: [
        { transitionIndex: 0, from: { voice: "A" }, to: { voice: "I" } },
        { transitionIndex: 1, from: { voice: "I" }, to: { voice: "Ë" } },
      ],
    });
    expect((result as { transitions: unknown[] }).transitions).toHaveLength(2);
  });

  test("preserves self-transitions and return paths without deduplication", () => {
    const repeated = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["Y", "Y"]),
    });
    const returned = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["Y", "E", "Y"]),
    });

    expect(repeated).toMatchObject({
      transitions: [{
        transitionIndex: 0,
        from: { pathIndex: 0, voice: "Y" },
        to: { pathIndex: 1, voice: "Y" },
      }],
    });
    expect(returned).toMatchObject({
      transitions: [
        { transitionIndex: 0, from: { voice: "Y" }, to: { voice: "E" } },
        { transitionIndex: 1, from: { voice: "E" }, to: { voice: "Y" } },
      ],
    });
  });

  test("uses canonical roles and excludes presentation labels and semantic claims", () => {
    const result = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["U", "I"]),
    });

    expect(result).toMatchObject({
      orderedRoleProjection: [
        { doctrineRole: "Containment/Depth" },
        { doctrineRole: "Direction/Focus" },
      ],
      truthClassification: {
        registryMapping: "fact",
        structuralProjection: "inference",
        symbolicComposition: "inference",
      },
      provenance: {
        sourceCompositionContract:
          "open-instrument.doctrine-semantic-composition-contract.v0_1",
        roleVocabularyAuthority: "src/shared/sevenPrinciples.v1.ts",
      },
    });
    expect(JSON.stringify(result)).not.toContain("Unity");
    expect(result).not.toHaveProperty("semanticBridge");
    expect(result).not.toHaveProperty("semanticAlignment");
    expect(result).not.toHaveProperty("functionalStatement");
    expect(result).not.toHaveProperty("evidenceRefs");
  });

  test("preserves target-sense context without creating a relation", () => {
    const withSense = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["U"]),
      targetSense: { id: "sense", label: "bounded sense" },
    });
    const withoutSense = evaluateDoctrineSymbolicCompositionRuleV1({
      structuralHypothesis: structuralFixture(["U"]),
    });

    expect(withSense).toMatchObject({
      targetSense: { id: "sense", label: "bounded sense" },
      truthClassification: { targetBoundRelation: "unknown" },
    });
    expect(withoutSense).toMatchObject({
      truthClassification: { targetBoundRelation: "not_applicable" },
    });
  });

  test("preserves claims, user decision, and no-single-winner posture", () => {
    const result = evaluateDoctrineSymbolicCompositionRuleV1({
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
  });

  test("fails closed for missing, malformed, and structurally invalid input", () => {
    expect(
      evaluateDoctrineSymbolicCompositionRuleV1({ structuralHypothesis: null }),
    ).toMatchObject({ status: "REJECT", reasonCodes: ["STRUCTURAL_HYPOTHESIS_REQUIRED"] });

    expect(
      evaluateDoctrineSymbolicCompositionRuleV1({
        structuralHypothesis: structuralFixture(["U"]),
        targetSense: { id: "", label: "" },
      }),
    ).toMatchObject({ status: "REJECT", reasonCodes: ["TARGET_SENSE_INVALID"] });

    const malformed = structuralFixture(["U"]);
    malformed.reductionSteps[0].voicePathAfter = [
      "V",
    ] as StructuralHypothesisV0_1["reductionSteps"][number]["voicePathAfter"];
    expect(
      evaluateDoctrineSymbolicCompositionRuleV1({
        structuralHypothesis: malformed,
      }),
    ).toMatchObject({
      status: "REJECT",
      reasonCodes: ["STRUCTURAL_HYPOTHESIS_INVALID"],
    });
  });

  test("is deterministic and generic across held-out word identities", () => {
    for (const word of ["bistro", "contra", "mantra"]) {
      const structural = structuralFixture(["U", "I"]);
      structural.hypothesisId = `logic-structural:${word}:generic`;
      const first = evaluateDoctrineSymbolicCompositionRuleV1({
        structuralHypothesis: structural,
      });
      const second = evaluateDoctrineSymbolicCompositionRuleV1({
        structuralHypothesis: structural,
      });

      expect(first).toEqual(second);
      expect(first).toMatchObject({
        status: "SYMBOLIC_COMPOSITION_SUPPORTED",
        transitions: [{ from: { voice: "U" }, to: { voice: "I" } }],
      });
      expect(JSON.stringify(first)).not.toMatch(/learning|knowledge|understanding|wisdom/i);
    }
  });

  test("composes existing structurally discovered hypotheses without word branches", () => {
    for (const word of ["bistro", "contra", "mantra"]) {
      const hypotheses = discoverStructuralHypothesesV0_1(word);
      for (const structuralHypothesis of hypotheses) {
        const result = evaluateDoctrineSymbolicCompositionRuleV1({
          structuralHypothesis,
        });
        expect(result.status).toBe("SYMBOLIC_COMPOSITION_SUPPORTED");
        expect(result).not.toHaveProperty("semanticBridge");
        expect(result).not.toHaveProperty("evidenceRefs");
      }
    }
  });

  test("does not compose a structural Null control", () => {
    expect(discoverStructuralHypothesesV0_1("zz")).toEqual([]);
  });
});
