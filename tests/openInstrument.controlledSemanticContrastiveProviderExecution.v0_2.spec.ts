import {
  CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_2,
  fingerprintControlledSemanticContrastiveExecutionPacketV0_2,
  runControlledSemanticContrastiveProviderExecutionV0_2,
  type ControlledSemanticContrastiveAuthorizationV0_2,
  type ControlledSemanticContrastiveExecutionPacketV0_2,
} from "../src/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_2";
import type { LocalProviderRuntimePreflightV0_1 } from "../src/shared/openInstrument/localProviderRuntimePreflight.v0_1";
import type { ContrastiveSemanticProposalResultV0_1 } from "../src/shared/orchestrator/contrastiveSemanticCalibrationProposal.v0_1";

const structuralIds = [
  "logic-structural:candle:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:bistro:is:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:contra:on:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:mantra:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
];

const packet: ControlledSemanticContrastiveExecutionPacketV0_2 = {
  schemaVersion: "open-instrument.controlled-semantic-contrastive-runner.v0_1",
  controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_2,
  packetId: "fixture.runtime-preflight.v0.2",
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

function authorization(): ControlledSemanticContrastiveAuthorizationV0_2 {
  authorizationCount += 1;
  return {
    schemaVersion: packet.schemaVersion,
    controlledExecutionVersion: packet.controlledExecutionVersion,
    authorizationId: `runtime-preflight-${authorizationCount}`,
    state: "granted_one_shot_local_only",
    milestoneId: packet.milestoneId,
    providerId: packet.providerId,
    modelId: packet.modelId,
    packetFingerprint: fingerprintControlledSemanticContrastiveExecutionPacketV0_2(packet),
    maximumCallCount: 4,
    timeoutMs: 8000,
    maximumRetryCount: 0,
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

describe("controlled contrastive execution v0.2 runtime preflight", () => {
  test("requires resident runtime evidence before consuming authorization or executing", async () => {
    const execute = jest.fn(async () => proposal());
    const runtimePreflight = jest.fn(async (): Promise<LocalProviderRuntimePreflightV0_1> => ({
      ...readyPreflight(),
      modelResident: false,
      readinessStatus: "model_not_resident",
      reasonCodes: ["LOCAL_PROVIDER_MODEL_NOT_RESIDENT"],
    }));
    const auth = authorization();
    const blocked = await runControlledSemanticContrastiveProviderExecutionV0_2(packet, auth, { execute, runtimePreflight });
    expect(blocked).toMatchObject({ status: "blocked", authorizationState: "authorization_not_granted", attemptedCalls: 0, runtimePreflight: { readinessStatus: "model_not_resident" } });
    expect(blocked.reasonCodes).toEqual(expect.arrayContaining(["CONTRASTIVE_RUNTIME_PREFLIGHT_NOT_READY", "LOCAL_PROVIDER_MODEL_NOT_RESIDENT"]));
    expect(execute).not.toHaveBeenCalled();

    const completed = await runControlledSemanticContrastiveProviderExecutionV0_2(packet, auth, { execute, runtimePreflight: async () => readyPreflight() });
    expect(completed).toMatchObject({ status: "completed", authorizationState: "consumed", plannedCalls: 4, attemptedCalls: 4, runtimePreflight: { modelResident: true } });
    expect(execute).toHaveBeenCalledTimes(4);
  });

  test("blocks unsupported residency observation and keeps execution version bound", async () => {
    const execute = jest.fn(async () => proposal());
    const result = await runControlledSemanticContrastiveProviderExecutionV0_2(packet, authorization(), {
      execute,
      runtimePreflight: async () => ({ ...readyPreflight(), residencyObservationSupported: false, modelResident: false, readinessStatus: "residency_observation_unavailable", reasonCodes: ["LOCAL_PROVIDER_RESIDENCY_OBSERVATION_UNAVAILABLE"] }),
    });
    expect(result).toMatchObject({ status: "blocked", controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_2 });
    expect(execute).not.toHaveBeenCalled();
  });

  test("version and fingerprint distinguish historical v0.1 execution", async () => {
    const execute = jest.fn(async () => proposal());
    const mismatch = await runControlledSemanticContrastiveProviderExecutionV0_2(packet, { ...authorization(), controlledExecutionVersion: "open-instrument.controlled-semantic-contrastive-execution.v0.1" as typeof packet.controlledExecutionVersion }, { execute, runtimePreflight: async () => readyPreflight() });
    expect(mismatch.reasonCodes).toContain("CONTRASTIVE_EXECUTION_VERSION_MISMATCH");
    expect(execute).not.toHaveBeenCalled();
    expect(fingerprintControlledSemanticContrastiveExecutionPacketV0_2(packet)).not.toBe("historical-v0.1-fingerprint");
  });

  test("successful mocked execution preserves truth boundaries and sanitized preflight provenance", async () => {
    const result = await runControlledSemanticContrastiveProviderExecutionV0_2(packet, authorization(), { execute: async () => proposal(), runtimePreflight: async () => readyPreflight() });
    expect(result.rows).toHaveLength(4);
    expect(result.rows.every((row) => row.logicCandidateEmitted === false && row.aggregateStatus === "unknown" && row.truthBoundary === "hypothesis_only_user_decides_no_evidence_promotion")).toBe(true);
    expect(result.runtimePreflight).toEqual(expect.objectContaining({ providerId: "openai_compat", modelId: "gemma3:4b", modelResident: true }));
    expect(JSON.stringify(result)).not.toContain("raw");
  });
});
