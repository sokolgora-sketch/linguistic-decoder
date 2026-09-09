import {
  CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1,
  type ContrastiveSemanticPairV0_1,
} from "@/shared/openInstrument/contrastiveSemanticCalibration.v0_1";
import {
  validateControlledSemanticContrastiveExecutionPacketV0_2,
  type ControlledSemanticContrastiveAuthorizationV0_2,
  type ControlledSemanticContrastiveExecutionPacketV0_2,
  type ControlledSemanticContrastiveExecutionRowV0_2,
} from "@/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_2";
import type { ProposerProviderTokenUsageV0_1 } from "@/shared/llm/providers/proposerProvider.v0.2";

export const CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MEASUREMENT_VERSION_V0_1 =
  "open-instrument.controlled-semantic-contrastive-natural-completion-measurement.v0_1" as const;

export const CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MODE_V0_1 =
  "uncapped_natural_completion" as const;

type HistoricalAuthorizationV0_2 = ControlledSemanticContrastiveAuthorizationV0_2;

export type ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1 = Omit<
  ControlledSemanticContrastiveExecutionPacketV0_2,
  "controlledExecutionVersion"
> & {
  controlledExecutionVersion: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MEASUREMENT_VERSION_V0_1;
  measurementMode: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MODE_V0_1;
};

export type ControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1 = Omit<
  HistoricalAuthorizationV0_2,
  "controlledExecutionVersion"
> & {
  controlledExecutionVersion: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MEASUREMENT_VERSION_V0_1;
  measurementMode: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MODE_V0_1;
};

export type ControlledSemanticContrastiveNaturalCompletionMeasurementRowV0_1 = Omit<
  ControlledSemanticContrastiveExecutionRowV0_2,
  "aggregateStatus" | "logicCandidateEmitted"
> & {
  measurementMode: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MODE_V0_1;
  tokenUsage: ProposerProviderTokenUsageV0_1 | null;
  logicCandidateEmitted: false;
  aggregateStatus: "unknown";
};

function hasOwnMaximumOutputTokensV0_1(value: object): boolean {
  return Object.prototype.hasOwnProperty.call(value, "maximumOutputTokens");
}

function asHistoricalPacketV0_2(
  packet: ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1,
): ControlledSemanticContrastiveExecutionPacketV0_2 {
  return {
    ...packet,
    controlledExecutionVersion: "open-instrument.controlled-semantic-contrastive-execution.v0_2",
  } as ControlledSemanticContrastiveExecutionPacketV0_2;
}

export function validateControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(
  packet: ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1,
): readonly string[] {
  const reasons = [...validateControlledSemanticContrastiveExecutionPacketV0_2(asHistoricalPacketV0_2(packet))];
  if (packet.controlledExecutionVersion !== CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MEASUREMENT_VERSION_V0_1) {
    reasons.push("NATURAL_COMPLETION_MEASUREMENT_VERSION_INVALID");
  }
  if (packet.measurementMode !== CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MODE_V0_1) {
    reasons.push("NATURAL_COMPLETION_MEASUREMENT_MODE_INVALID");
  }
  if (hasOwnMaximumOutputTokensV0_1(packet)) {
    reasons.push("NATURAL_COMPLETION_OUTPUT_BUDGET_FORBIDDEN");
  }
  return reasons;
}

export function fingerprintControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(
  packet: ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1,
): string {
  return JSON.stringify({
    schemaVersion: packet.schemaVersion,
    controlledExecutionVersion: packet.controlledExecutionVersion,
    measurementMode: packet.measurementMode,
    packetId: packet.packetId,
    milestoneId: packet.milestoneId,
    providerId: packet.providerId,
    modelId: packet.modelId,
    endpointUrl: packet.endpointUrl,
    localOnly: packet.localOnly,
    contrastiveDecisionContractVersion: packet.contrastiveDecisionContractVersion,
    pairs: packet.pairs,
    maximumCallCount: packet.maximumCallCount,
    timeoutMs: packet.timeoutMs,
    maximumRetryCount: packet.maximumRetryCount,
    purpose: packet.purpose,
    truthBoundary: packet.truthBoundary,
  });
}

export function validateControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1(
  packet: ControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1,
  authorization: ControlledSemanticContrastiveNaturalCompletionMeasurementAuthorizationV0_1,
): readonly string[] {
  const reasons = [...validateControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(packet)];
  if (hasOwnMaximumOutputTokensV0_1(authorization)) {
    reasons.push("NATURAL_COMPLETION_OUTPUT_BUDGET_FORBIDDEN");
  }
  if (authorization.schemaVersion !== CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1) reasons.push("NATURAL_COMPLETION_AUTH_SCHEMA_INVALID");
  if (authorization.controlledExecutionVersion !== packet.controlledExecutionVersion) reasons.push("NATURAL_COMPLETION_EXECUTION_VERSION_MISMATCH");
  if (authorization.measurementMode !== packet.measurementMode) reasons.push("NATURAL_COMPLETION_MEASUREMENT_MODE_MISMATCH");
  if (authorization.state !== "granted_one_shot_local_only") reasons.push("NATURAL_COMPLETION_AUTHORIZATION_NOT_ACTIVE");
  if (authorization.packetFingerprint !== fingerprintControlledSemanticContrastiveNaturalCompletionMeasurementPacketV0_1(packet)) reasons.push("NATURAL_COMPLETION_PACKET_FINGERPRINT_MISMATCH");
  if (authorization.milestoneId !== packet.milestoneId) reasons.push("NATURAL_COMPLETION_MILESTONE_MISMATCH");
  if (authorization.providerId !== packet.providerId) reasons.push("NATURAL_COMPLETION_PROVIDER_MISMATCH");
  if (authorization.modelId !== packet.modelId) reasons.push("NATURAL_COMPLETION_MODEL_MISMATCH");
  if (authorization.maximumCallCount !== packet.maximumCallCount) reasons.push("NATURAL_COMPLETION_CALL_BOUND_MISMATCH");
  if (authorization.timeoutMs !== packet.timeoutMs) reasons.push("NATURAL_COMPLETION_TIMEOUT_MISMATCH");
  if (authorization.maximumRetryCount !== packet.maximumRetryCount) reasons.push("NATURAL_COMPLETION_RETRY_BOUND_MISMATCH");
  if (authorization.localOnly !== packet.localOnly) reasons.push("NATURAL_COMPLETION_LOCAL_ONLY_MISMATCH");
  if (authorization.contrastiveDecisionContractVersion !== packet.contrastiveDecisionContractVersion) reasons.push("NATURAL_COMPLETION_DECISION_CONTRACT_MISMATCH");
  if (authorization.purpose !== packet.purpose) reasons.push("NATURAL_COMPLETION_PURPOSE_MISMATCH");
  if (authorization.truthBoundary !== packet.truthBoundary) reasons.push("NATURAL_COMPLETION_TRUTH_BOUNDARY_MISMATCH");
  return reasons;
}

export function createControlledSemanticContrastiveNaturalCompletionMeasurementRowV0_1(
  row: ControlledSemanticContrastiveExecutionRowV0_2,
  tokenUsage: ProposerProviderTokenUsageV0_1 | null = null,
): ControlledSemanticContrastiveNaturalCompletionMeasurementRowV0_1 {
  return {
    ...row,
    measurementMode: CONTROLLED_SEMANTIC_CONTRASTIVE_NATURAL_COMPLETION_MODE_V0_1,
    tokenUsage,
    logicCandidateEmitted: false,
    aggregateStatus: "unknown",
  };
}

export type ControlledSemanticContrastiveNaturalCompletionMeasurementPairV0_1 = ContrastiveSemanticPairV0_1;
