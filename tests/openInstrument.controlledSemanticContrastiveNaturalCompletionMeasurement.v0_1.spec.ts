import {
  CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MEASUREMENT_VERSION_V0_1,
  CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MODE_V0_1,
  createControlledSemanticContrastiveNaturalCompletionMeasurementRowV0_1,
  fingerprintControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1,
  validateControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1,
  validateControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1,
  type ControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1,
  type ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1,
} from "../src/shared/openInstrument/controlledSemanticContrastiveNaturalCompletionMeasurement.v0_1";
import {
  CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_2,
  type ControlledSemanticContrastiveExecutionRowV0_2,
} from "../src/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_2";

const structuralIds = [
  "logic-structural:candle:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:bistro:is:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:contra:on:peel_right_consonant_led_expansion+peel_left_consonant_frame",
  "logic-structural:mantra:an:peel_right_consonant_led_expansion+peel_left_consonant_frame",
];

const packet: ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1 = {
  schemaVersion: "open-instrument.controlled-semantic-contrastive-runner.v0_1",
  controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MEASUREMENT_VERSION_V0_1,
  measurementMode: CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MODE_V0_1,
  packetId: "fixture.natural-completion-measurement.v0.1",
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

function authorization(overrides: Partial<ControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1> = {}): ControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1 {
  return {
    schemaVersion: packet.schemaVersion,
    controlledExecutionVersion: packet.controlledExecutionVersion,
    measurementMode: packet.measurementMode,
    authorizationId: "natural-completion-measurement-test",
    state: "granted_one_shot_local_only",
    milestoneId: packet.milestoneId,
    providerId: packet.providerId,
    modelId: packet.modelId,
    packetFingerprint: fingerprintControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(packet),
    maximumCallCount: packet.maximumCallCount,
    timeoutMs: packet.timeoutMs,
    maximumRetryCount: packet.maximumRetryCount,
    localOnly: packet.localOnly,
    contrastiveDecisionContractVersion: packet.contrastiveDecisionContractVersion,
    purpose: packet.purpose,
    truthBoundary: packet.truthBoundary,
    ...overrides,
  };
}

function historicalRow(): ControlledSemanticContrastiveExecutionRowV0_2 {
  return {
    word: "candle",
    structuralHypothesisId: structuralIds[0],
    embryo: "an",
    expansionChain: ["an"],
    voicePath: ["A"],
    providerAttempted: true,
    providerId: "openai_compat",
    modelId: "gemma3:4b",
    preferredSense: "neither",
    alignmentStatus: "unknown",
    semanticBridge: null,
    doctrineRoles: [],
    supportTrace: null,
    diagnostics: null,
    elapsedMs: 100,
    reasonCodes: ["CONTRASTIVE_RELATION_NEITHER"],
    timeout: false,
    providerError: false,
    malformed: false,
    logicCandidateEmitted: false,
    aggregateStatus: "unknown",
    truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion",
  };
}

describe("controlled contrastive natural completion measurement v0.1", () => {
  test("binds a distinct uncapped measurement identity without changing historical v0.2", () => {
    expect(packet.controlledExecutionVersion).toBe("open-instrument.controlled-semantic-contrastive-natural-completion-measurement.v0_1");
    expect(packet.measurementMode).toBe("uncapped_natural_completion");
    expect(validateControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(packet)).toEqual([]);
    expect(fingerprintControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(packet)).toContain("uncapped_natural_completion");
    expect(fingerprintControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(packet)).not.toContain("maximumOutputTokens");
    expect(CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_2).not.toBe(packet.controlledExecutionVersion);
  });

  test("rejects a packet with any output-token field", () => {
    const withBudget = { ...packet, maximumOutputTokens: 128 } as unknown as ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1;
    expect(validateControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(withBudget)).toContain("NATURAL_COMPLETION_OUTPUT_BUDGET_FORBIDDEN");
  });

  test("rejects omitted or non-integer timeoutMs", () => {
    const { timeoutMs: _omitted, ...withoutTimeoutShape } = packet;
    const withoutTimeout =
      withoutTimeoutShape as unknown as ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1;

    expect(
      validateControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(withoutTimeout),
    ).toContain("NATURAL_COMPLETION_TIMEOUT_INVALID");

    const fractionalTimeout = {
      ...packet,
      timeoutMs: 8000.5,
    } as ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1;

    expect(
      validateControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(fractionalTimeout),
    ).toContain("NATURAL_COMPLETION_TIMEOUT_INVALID");
  });

  test("validates one-shot authorization binding without consuming it", () => {
    expect(validateControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1(packet, authorization())).toEqual([]);
    expect(validateControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1(packet, authorization({ measurementMode: "wrong_mode" as typeof packet.measurementMode }))).toContain("NATURAL_COMPLETION_MEASUREMENT_MODE_MISMATCH");
    expect(validateControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1(packet, authorization({ packetFingerprint: "wrong" }))).toContain("NATURAL_COMPLETION_PACKET_FINGERPRINT_MISMATCH");
  });

  test("forces measurement rows to remain unknown and candidate-free while retaining usage", () => {
    const row = createControlledSemanticContrastiveNaturalCompletionMeasurementRowV0_1(historicalRow(), {
      promptTokens: 12,
      completionTokens: 34,
      totalTokens: 46,
    });
    expect(row).toMatchObject({
      measurementMode: "uncapped_natural_completion",
      tokenUsage: { promptTokens: 12, completionTokens: 34, totalTokens: 46 },
      logicCandidateEmitted: false,
      aggregateStatus: "unknown",
    });
    expect(row.truthBoundary).toBe("hypothesis_only_user_decides_no_evidence_promotion");
  });

  test("does not create provider, runner, or authorization side effects", () => {
    expect(Object.keys(packet)).not.toContain("maximumOutputTokens");
    expect(Object.keys(authorization())).not.toContain("maximumOutputTokens");
  });
});
