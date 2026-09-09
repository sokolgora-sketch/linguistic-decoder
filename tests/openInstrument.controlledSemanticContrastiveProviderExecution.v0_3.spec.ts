import {
  CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3,
  fingerprintControlledSemanticContrastiveExecutionPacketV0_3,
  runControlledSemanticContrastiveProviderExecutionV0_3,
  validateControlledSemanticContrastiveExecutionPacketV0_3,
  type ControlledSemanticContrastiveAuthorizationV0_3,
  type ControlledSemanticContrastiveExecutionPacketV0_3,
} from "../src/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_3";
import type { LocalProviderRuntimePreflightV0_1 } from "../src/shared/openInstrument/localProviderRuntimePreflight.v0_1";
import type { ContrastiveSemanticProposalResultV0_1 } from "../src/shared/orchestrator/contrastiveSemanticCalibrationProposal.v0_1";

const structuralIds = [
  "logic-structural:candle:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:bistro:is:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:contra:on:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:mantra:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
];

const packet: ControlledSemanticContrastiveExecutionPacketV0_3 = {
  schemaVersion: "open-instrument.controlled-semantic-contrastive-runner.v0_1",
  controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3,
  packetId: "fixture.output-budget.v0.3",
  milestoneId: "OPEN_INSTRUMENT_CONTRASTIVE_SEMANTIC_CALIBRATION_V1",
  providerId: "openai_compat",
  modelId: "gemma3:4b",
  endpointUrl: "http://127.0.0.1:11434/v1",
  localOnly: true,
  contrastiveDecisionContractVersion: "open-instrument.semantic-contrastive-decision-contract.v0_2",
  pairs: ["candle", "bistro", "contra", "mantra"].map((word, index) => ({
    word,
    structuralHypothesisId: structuralIds[index],
    senseA: { targetSenseId: `${word}_a`, targetSenseLabel: "first neutral sense", targetSenseDefinition: "A bounded calibration definition." },
    senseB: { targetSenseId: `${word}_b`, targetSenseLabel: "second neutral sense", targetSenseDefinition: "A different bounded calibration definition." },
  })),
  maximumCallCount: 4,
  timeoutMs: 8000,
  maximumRetryCount: 0,
  maximumOutputTokens: 128,
  purpose: "controlled_semantic_alignment_research",
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion",
};

function readyPreflight(): LocalProviderRuntimePreflightV0_1 {
  return {
    providerId: packet.providerId,
    modelId: packet.modelId,
    endpointUrl: packet.endpointUrl,
    endpointReachable: true,
    modelVisible: true,
    residencyObservationSupported: true,
    modelResident: true,
    expiresAt: "2030-01-01T00:00:00Z",
    readinessStatus: "runtime_residency_ready",
    reasonCodes: ["LOCAL_PROVIDER_RUNTIME_RESIDENCY_READY"],
  };
}

let authorizationCount = 0;

function authorization(): ControlledSemanticContrastiveAuthorizationV0_3 {
  authorizationCount += 1;
  return {
    schemaVersion: packet.schemaVersion,
    controlledExecutionVersion: packet.controlledExecutionVersion,
    authorizationId: `output-budget-${authorizationCount}`,
    state: "granted_one_shot_local_only",
    milestoneId: packet.milestoneId,
    providerId: packet.providerId,
    modelId: packet.modelId,
    packetFingerprint: fingerprintControlledSemanticContrastiveExecutionPacketV0_3(packet),
    maximumCallCount: 4,
    timeoutMs: 8000,
    maximumRetryCount: 0,
    maximumOutputTokens: packet.maximumOutputTokens,
    localOnly: true,
    contrastiveDecisionContractVersion: packet.contrastiveDecisionContractVersion,
    purpose: packet.purpose,
    truthBoundary: packet.truthBoundary,
  };
}

function proposal(): ContrastiveSemanticProposalResultV0_1 {
  return {
    attempted: true,
    status: "unknown",
    provider: "mock",
    providerReady: true,
    realProvider: false,
    mockProvider: true,
    reasonCodes: ["CONTRASTIVE_RELATION_NEITHER"],
    timeoutMs: 8000,
    assessment: null,
    error: null,
  };
}

describe("controlled contrastive execution v0.3 output budget seam", () => {
  test("requires an explicit positive output budget and binds it into the fingerprint", () => {
    expect(validateControlledSemanticContrastiveExecutionPacketV0_3(packet)).toEqual([]);
    expect(fingerprintControlledSemanticContrastiveExecutionPacketV0_3(packet)).not.toBe(
      fingerprintControlledSemanticContrastiveExecutionPacketV0_3({ ...packet, maximumOutputTokens: 256 }),
    );
    expect(validateControlledSemanticContrastiveExecutionPacketV0_3({ ...packet, maximumOutputTokens: 0 })).toContain("CONTRASTIVE_OUTPUT_BUDGET_INVALID");
  });

  test("passes the packet-bound budget to every executor call without changing v0.2 bounds", async () => {
    const budgets: number[] = [];
    const result = await runControlledSemanticContrastiveProviderExecutionV0_3(packet, authorization(), {
      execute: async (_context, timeoutMs, maximumOutputTokens) => {
        expect(timeoutMs).toBe(8000);
        budgets.push(maximumOutputTokens);
        return proposal();
      },
      runtimePreflight: async () => readyPreflight(),
    });

    expect(result).toMatchObject({
      status: "completed",
      authorizationState: "consumed",
      plannedCalls: 4,
      attemptedCalls: 4,
      maximumOutputTokens: 128,
    });
    expect(budgets).toEqual([128, 128, 128, 128]);
    expect(result.rows.every((row) => row.logicCandidateEmitted === false && row.aggregateStatus === "unknown")).toBe(true);
  });

  test("blocks an authorization budget mismatch before any execution", async () => {
    const execute = jest.fn(async () => proposal());
    const result = await runControlledSemanticContrastiveProviderExecutionV0_3(
      packet,
      { ...authorization(), maximumOutputTokens: 256 },
      { execute, runtimePreflight: async () => readyPreflight() },
    );

    expect(result).toMatchObject({ status: "blocked", authorizationState: "authorization_not_granted" });
    expect(result.reasonCodes).toContain("CONTRASTIVE_OUTPUT_BUDGET_MISMATCH");
    expect(execute).not.toHaveBeenCalled();
  });

  test("keeps the v0.3 execution identity and truth boundary explicit", async () => {
    const result = await runControlledSemanticContrastiveProviderExecutionV0_3(packet, authorization(), {
      execute: async () => proposal(),
      runtimePreflight: async () => readyPreflight(),
    });

    expect(result.controlledExecutionVersion).toBe(CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3);
    expect(JSON.stringify(result)).not.toContain("evidenceRefs");
    expect(JSON.stringify(result)).not.toContain("historicalOrigin");
  });
});
