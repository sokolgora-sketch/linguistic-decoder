import {
  buildSemanticAlignmentContextV0_1,
  deterministicNoAlignmentV0_1,
  parseSemanticAlignmentProposalV0_1,
} from "../src/shared/openInstrument/semanticAlignment.v0_1";
import { discoverStructuralHypothesesV0_1 } from "../src/shared/structuralHypothesisDiscovery.v0_1";
import { runSemanticAlignmentProposalV0_1 } from "../src/shared/orchestrator/semanticAlignmentProposal.v0_1";

function contextFixture() {
  const structuralHypothesis = discoverStructuralHypothesesV0_1("candle")[0];
  if (!structuralHypothesis) throw new Error("fixture structural hypothesis missing");
  const result = buildSemanticAlignmentContextV0_1({
    targetWord: "candle",
    targetSenseId: "wax_light_source",
    targetSenseLabel: "a wax light source",
    structuralHypothesis,
  });
  if (!result.ok) throw new Error(result.reasonCodes.join(","));
  return result.context;
}

function proposedFixture() {
  const context = contextFixture();
  return parseSemanticAlignmentProposalV0_1(
    {
      alignmentStatus: "proposed",
      doctrineRoles: [context.doctrineProjection.projections[0].doctrineRole],
      semanticBridge:
        "A bounded light-source sense can be tested as a functional relation to the structural anchor without asserting lexical truth.",
      reasonCodes: ["fixture_only"],
    },
    context,
    {
      alignmentSource: "provider_proposed_hypothesis",
      providerId: "fixture",
      modelId: "fixture",
    },
  );
}

describe("Open Instrument semantic alignment v0.1", () => {
  test("builds a deterministic bounded context", () => {
    const first = contextFixture();
    expect(first).toEqual(contextFixture());
    expect(first.targetSenseLabel).toBe("a wax light source");
    expect(first.claimBoundary).toMatchObject({
      historicalOriginClaim: "not_claimed",
      winnerClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
    expect(JSON.stringify(first)).not.toContain("ignore previous instructions");
  });

  test("accepts a non-tautological provider hypothesis", () => {
    expect(proposedFixture()).toMatchObject({
      ok: true,
      assessment: {
        alignmentStatus: "proposed",
        alignmentSource: "provider_proposed_hypothesis",
      },
    });
  });

  test.each(["unknown", "rejected"] as const)("accepts %s without a bridge", (alignmentStatus) => {
    const context = contextFixture();
    expect(
      parseSemanticAlignmentProposalV0_1(
        {
          alignmentStatus,
          doctrineRoles: [],
          semanticBridge: null,
          reasonCodes: ["no_relation"],
        },
        context,
        { alignmentSource: "provider_proposed_hypothesis" },
      ),
    ).toMatchObject({ ok: true, assessment: { alignmentStatus, semanticBridge: null } });
  });

  test.each([
    ["missing bridge", { alignmentStatus: "proposed", doctrineRoles: ["Expansion/Bridge"], semanticBridge: null }],
    ["wrong role", { alignmentStatus: "proposed", doctrineRoles: ["not-a-doctrine-role"], semanticBridge: "A bounded relation can be tested without asserting lexical truth." }],
    ["tautological sense", { alignmentStatus: "proposed", doctrineRoles: ["Expansion/Bridge"], semanticBridge: "a wax light source" }],
    ["forbidden historical claim", { alignmentStatus: "proposed", doctrineRoles: ["Expansion/Bridge"], semanticBridge: "This is the proven historical origin of the target." }],
  ])("rejects %s", (_label, value) => {
    const context = contextFixture();
    expect(
      parseSemanticAlignmentProposalV0_1(value, context, {
        alignmentSource: "provider_proposed_hypothesis",
      }),
    ).toMatchObject({ ok: false });
  });

  test("returns unknown when the provider is unavailable", async () => {
    const previous = process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER;
    delete process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER;
    const result = await runSemanticAlignmentProposalV0_1(contextFixture());
    if (previous === undefined) delete process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER;
    else process.env.OPEN_INSTRUMENT_SEMANTIC_ALIGNMENT_TEST_PROVIDER = previous;

    expect(result).toMatchObject({
      attempted: false,
      status: "skipped_disabled",
      realProvider: false,
      assessment: {
        alignmentStatus: "unknown",
        semanticBridge: null,
        alignmentSource: "deterministic_no_alignment",
      },
    });
  });

  test("supports deterministic mock proposed, unknown, and rejected paths", async () => {
    for (const [provider, status] of [
      ["mock_semantic_proposed", "proposed"],
      ["mock_semantic_unknown", "unknown"],
      ["mock_semantic_rejected", "rejected"],
    ] as const) {
      const result = await runSemanticAlignmentProposalV0_1(contextFixture(), {
        providerOverrideForTests: provider,
      });
      expect(result.status).toBe(status);
      expect(result.mockProvider).toBe(true);
      expect(result.realProvider).toBe(false);
    }
  });

  test("does not turn deterministic no-alignment into a proposal", () => {
    expect(deterministicNoAlignmentV0_1(contextFixture(), ["fixture"])).toMatchObject({
      alignmentStatus: "unknown",
      semanticBridge: null,
      doctrineRoles: [],
      alignmentSource: "deterministic_no_alignment",
    });
  });
});
