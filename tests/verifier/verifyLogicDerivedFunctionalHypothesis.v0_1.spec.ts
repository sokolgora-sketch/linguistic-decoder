import {
  buildLogicDerivedFunctionalHypothesisV0_1,
} from "../../src/shared/openInstrument/logicDerivedFunctionalHypothesis.v0_1";
import {
  verifyLogicDerivedFunctionalHypothesisV0_1,
} from "../../src/shared/verifier/verifyLogicDerivedFunctionalHypothesis.v0_1";
import type {
  StructuralHypothesisV0_1,
} from "../../src/shared/structuralHypothesisDiscovery.v0_1";

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

function hypothesisFixture(): Record<string, unknown> {
  const result = buildLogicDerivedFunctionalHypothesisV0_1({
    targetWord: "fixture",
    targetSense: {
      id: "fixture_sense",
      label: "a bounded test object",
    },
    structuralHypothesis: structuralFixture(),
  });

  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return JSON.parse(JSON.stringify(result.hypothesis)) as Record<string, unknown>;
}

function validContext(overrides: Record<string, unknown> = {}) {
  return {
    targetWord: "fixture",
    ...overrides,
  };
}

describe("logic-derived functional hypothesis verifier v0.1", () => {
  test("accepts a bounded candidate-only hypothesis", () => {
    const result = verifyLogicDerivedFunctionalHypothesisV0_1(
      hypothesisFixture(),
      validContext(),
    );

    expect(result).toMatchObject({
      status: "verified",
      accepted: true,
      reasonCodes: [],
    });
    expect(result.checks.every((check) => check.pass)).toBe(true);
  });

  test.each([
    ["wrong target word", { targetWord: "other" }, "TARGET_WORD_MISMATCH"],
    [
      "reviewed or research evidence owns result",
      { strongerEvidencePresent: true },
      "STRONGER_EVIDENCE_OWNS_RESULT",
    ],
    [
      "canonical candidate owns result",
      { canonicalCandidatePresent: true },
      "STRONGER_EVIDENCE_OWNS_RESULT",
    ],
    [
      "structural-only result owns result",
      { structuralOnly: true },
      "STRONGER_EVIDENCE_OWNS_RESULT",
    ],
  ])("rejects %s", (_label, context, reasonCode) => {
    expect(
      verifyLogicDerivedFunctionalHypothesisV0_1(
        hypothesisFixture(),
        validContext(context),
      ),
    ).toMatchObject({
      status: "rejected",
      accepted: false,
      reasonCodes: expect.arrayContaining([reasonCode]),
    });
  });

  test("rejects a missing target sense and forbidden truth promotion", () => {
    const hypothesis = hypothesisFixture();
    delete hypothesis.targetSenseId;
    hypothesis.candidateTruthClaim = "claimed";

    expect(
      verifyLogicDerivedFunctionalHypothesisV0_1(
        hypothesis,
        validContext(),
      ),
    ).toMatchObject({
      status: "rejected",
      reasonCodes: expect.arrayContaining([
        "TARGET_SENSE_MISSING",
        "TRUTH_BOUNDARY_VIOLATION",
      ]),
    });
  });

  test("rejects a tampered doctrine projection and unauthorized operation", () => {
    const hypothesis = hypothesisFixture();
    const projection = hypothesis.doctrineProjection as Record<string, unknown>;
    (projection.projections as Array<Record<string, unknown>>)[0].doctrineRole =
      "Initiation/Source";
    (hypothesis.structuralAnchor as Record<string, unknown>).reductionOperationIds = [
      "invented_operation",
    ];

    expect(
      verifyLogicDerivedFunctionalHypothesisV0_1(
        hypothesis,
        validContext(),
      ),
    ).toMatchObject({
      status: "rejected",
      reasonCodes: expect.arrayContaining([
        "STRUCTURAL_ANCHOR_INVALID",
        "DOCTRINE_PROJECTION_MISMATCH",
      ]),
    });
  });

  test.each([
    [null, null],
    [{}, { targetWord: "fixture" }],
  ])("fails closed for malformed runtime values", (hypothesis, context) => {
    expect(
      verifyLogicDerivedFunctionalHypothesisV0_1(hypothesis, context),
    ).toMatchObject({
      status: "rejected",
      accepted: false,
      reasonCodes: ["MALFORMED_RUNTIME_INPUT"],
    });
  });

  test("is deterministic and does not mutate the hypothesis", () => {
    const hypothesis = hypothesisFixture();
    const before = JSON.parse(JSON.stringify(hypothesis));
    const first = verifyLogicDerivedFunctionalHypothesisV0_1(
      hypothesis,
      validContext(),
    );
    const second = verifyLogicDerivedFunctionalHypothesisV0_1(
      hypothesis,
      validContext(),
    );

    expect(first).toEqual(second);
    expect(hypothesis).toEqual(before);
  });
});
