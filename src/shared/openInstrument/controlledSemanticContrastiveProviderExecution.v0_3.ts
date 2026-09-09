import { discoverStructuralHypothesesV0_1 } from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  buildContrastiveSemanticContextV0_1,
  CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_2,
  CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1,
  type ContrastiveSemanticAssessmentV0_1,
  type ContrastiveSemanticContextV0_1,
  type ContrastiveSemanticPairV0_1,
  type ContrastiveSemanticResponseShapeDiagnosticsV0_1,
} from "@/shared/openInstrument/contrastiveSemanticCalibration.v0_1";
import {
  runContrastiveSemanticProposalV0_1,
  type ContrastiveSemanticProposalResultV0_1,
} from "@/shared/orchestrator/contrastiveSemanticCalibrationProposal.v0_1";
import {
  runLocalProviderRuntimePreflightV0_1,
  type LocalProviderRuntimePreflightV0_1,
} from "@/shared/openInstrument/localProviderRuntimePreflight.v0_1";

export const CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3 =
  "open-instrument.controlled-semantic-contrastive-execution.v0.3" as const;

type HistoricalPacketV0_2 = import("@/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_2").ControlledSemanticContrastiveExecutionPacketV0_2;
type HistoricalAuthorizationV0_2 = import("@/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_2").ControlledSemanticContrastiveAuthorizationV0_2;
type HistoricalRowV0_2 = import("@/shared/openInstrument/controlledSemanticContrastiveProviderExecution.v0_2").ControlledSemanticContrastiveExecutionRowV0_2;

export type ControlledSemanticContrastiveExecutionPacketV0_3 = Omit<HistoricalPacketV0_2, "controlledExecutionVersion"> & {
  controlledExecutionVersion: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3;
  maximumOutputTokens: number;
};

export type ControlledSemanticContrastiveAuthorizationV0_3 = Omit<HistoricalAuthorizationV0_2, "controlledExecutionVersion"> & {
  controlledExecutionVersion: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3;
  maximumOutputTokens: number;
};

export type ControlledSemanticContrastiveExecutionRowV0_3 = HistoricalRowV0_2;

export type ControlledSemanticContrastiveExecutionResultV0_3 = Readonly<{
  controlledExecutionVersion: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3;
  status: "blocked" | "completed";
  authorizationState: "authorization_not_granted" | "consumed";
  reasonCodes: readonly string[];
  plannedCalls: number;
  attemptedCalls: number;
  completedCalls: number;
  failedCalls: number;
  remainingCalls: number;
  maximumOutputTokens: number;
  counts: Readonly<{ proposed: number; unknown: number; malformed: number; timeout: number; providerError: number; skipped: number }>;
  runtimePreflight: LocalProviderRuntimePreflightV0_1 | null;
  rows: readonly ControlledSemanticContrastiveExecutionRowV0_3[];
}>;

type ContrastiveExecutorV0_3 = (
  context: ContrastiveSemanticContextV0_1,
  timeoutMs: number,
  maximumOutputTokens: number,
) => Promise<ContrastiveSemanticProposalResultV0_1>;

type RuntimePreflightExecutorV0_3 = (
  providerId: string,
  modelId: string,
  endpointUrl: string,
  localOnly: boolean,
) => Promise<LocalProviderRuntimePreflightV0_1>;

type RunOptionsV0_3 = Readonly<{
  execute?: ContrastiveExecutorV0_3;
  runtimePreflight?: RuntimePreflightExecutorV0_3;
}>;

const consumedAuthorizationIdsV0_3 = new Set<string>();

function textV0_3(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFKC").trim() : "";
}

function isLoopbackUrlV0_3(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" && (url.hostname === "127.0.0.1" || url.hostname === "localhost");
  } catch {
    return false;
  }
}

export function fingerprintControlledSemanticContrastiveExecutionPacketV0_3(
  packet: ControlledSemanticContrastiveExecutionPacketV0_3,
): string {
  return JSON.stringify({
    schemaVersion: packet.schemaVersion,
    controlledExecutionVersion: packet.controlledExecutionVersion,
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
    maximumOutputTokens: packet.maximumOutputTokens,
    purpose: packet.purpose,
    truthBoundary: packet.truthBoundary,
  });
}

export function validateControlledSemanticContrastiveExecutionPacketV0_3(
  packet: ControlledSemanticContrastiveExecutionPacketV0_3,
): readonly string[] {
  const reasons: string[] = [];
  const words = new Set(packet.pairs.map((pair) => textV0_3(pair.word)));
  if (packet.schemaVersion !== CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1) reasons.push("CONTRASTIVE_RUNNER_SCHEMA_INVALID");
  if (packet.controlledExecutionVersion !== CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3) reasons.push("CONTRASTIVE_EXECUTION_VERSION_INVALID");
  if (!packet.packetId || !packet.milestoneId) reasons.push("CONTRASTIVE_PACKET_ID_REQUIRED");
  if (packet.providerId !== "openai_compat") reasons.push("CONTRASTIVE_PROVIDER_UNSUPPORTED");
  if (!packet.modelId) reasons.push("CONTRASTIVE_MODEL_REQUIRED");
  if (!packet.localOnly || !isLoopbackUrlV0_3(packet.endpointUrl)) reasons.push("CONTRASTIVE_LOCAL_ONLY_ENDPOINT_REQUIRED");
  if (packet.contrastiveDecisionContractVersion !== CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_2) reasons.push("CONTRASTIVE_DECISION_CONTRACT_INVALID");
  if (packet.pairs.length !== 4 || words.size !== 4) reasons.push("CONTRASTIVE_PAIR_BOUND_INVALID");
  if (packet.maximumCallCount !== 4 || packet.maximumCallCount !== packet.pairs.length) reasons.push("CONTRASTIVE_CALL_BOUND_INVALID");
  if (packet.pairs.some((pair) => pair.senseA.targetSenseId === pair.senseB.targetSenseId)) reasons.push("CONTRASTIVE_SENSE_ID_DUPLICATE");
  if (packet.pairs.some((pair) => pair.senseA.targetSenseDefinition.trim() === "" || pair.senseB.targetSenseDefinition.trim() === "")) reasons.push("CONTRASTIVE_DEFINITIONS_REQUIRED");
  if (packet.pairs.some((pair) => !textV0_3(pair.word) || !textV0_3(pair.structuralHypothesisId) || !textV0_3(pair.senseA.targetSenseId) || !textV0_3(pair.senseB.targetSenseId) || !textV0_3(pair.senseA.targetSenseLabel) || !textV0_3(pair.senseB.targetSenseLabel))) reasons.push("CONTRASTIVE_PAIR_FIELDS_REQUIRED");
  if (packet.timeoutMs < 10 || packet.timeoutMs > 30000) reasons.push("CONTRASTIVE_TIMEOUT_BOUND_INVALID");
  if (packet.maximumRetryCount !== 0) reasons.push("CONTRASTIVE_RETRY_BOUND_INVALID");
  if (!Number.isSafeInteger(packet.maximumOutputTokens) || packet.maximumOutputTokens <= 0) reasons.push("CONTRASTIVE_OUTPUT_BUDGET_INVALID");
  if (packet.purpose !== "controlled_semantic_alignment_research") reasons.push("CONTRASTIVE_PURPOSE_INVALID");
  if (packet.truthBoundary !== "hypothesis_only_user_decides_no_evidence_promotion") reasons.push("CONTRASTIVE_TRUTH_BOUNDARY_INVALID");
  return reasons;
}

function blockedV0_3(
  reasonCodes: readonly string[],
  plannedCalls: number,
  maximumOutputTokens: number,
  runtimePreflight: LocalProviderRuntimePreflightV0_1 | null = null,
): ControlledSemanticContrastiveExecutionResultV0_3 {
  return {
    controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3,
    status: "blocked",
    authorizationState: "authorization_not_granted",
    reasonCodes,
    plannedCalls,
    attemptedCalls: 0,
    completedCalls: 0,
    failedCalls: 0,
    remainingCalls: plannedCalls,
    maximumOutputTokens,
    counts: { proposed: 0, unknown: 0, malformed: 0, timeout: 0, providerError: 0, skipped: plannedCalls },
    runtimePreflight,
    rows: [],
  };
}

export async function runControlledSemanticContrastiveProviderExecutionV0_3(
  packet: ControlledSemanticContrastiveExecutionPacketV0_3,
  authorization: ControlledSemanticContrastiveAuthorizationV0_3,
  options: RunOptionsV0_3 = {},
): Promise<ControlledSemanticContrastiveExecutionResultV0_3> {
  const packetReasons = validateControlledSemanticContrastiveExecutionPacketV0_3(packet);
  const fingerprint = fingerprintControlledSemanticContrastiveExecutionPacketV0_3(packet);
  const authReasons = [
    authorization.schemaVersion !== CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1 ? "CONTRASTIVE_AUTH_SCHEMA_INVALID" : "",
    authorization.controlledExecutionVersion !== packet.controlledExecutionVersion ? "CONTRASTIVE_EXECUTION_VERSION_MISMATCH" : "",
    authorization.state !== "granted_one_shot_local_only" ? "CONTRASTIVE_AUTHORIZATION_NOT_ACTIVE" : "",
    consumedAuthorizationIdsV0_3.has(authorization.authorizationId) ? "CONTRASTIVE_AUTHORIZATION_CONSUMED" : "",
    authorization.packetFingerprint !== fingerprint ? "CONTRASTIVE_PACKET_FINGERPRINT_MISMATCH" : "",
    authorization.milestoneId !== packet.milestoneId ? "CONTRASTIVE_MILESTONE_MISMATCH" : "",
    authorization.providerId !== packet.providerId ? "CONTRASTIVE_PROVIDER_MISMATCH" : "",
    authorization.modelId !== packet.modelId ? "CONTRASTIVE_MODEL_MISMATCH" : "",
    authorization.maximumCallCount !== packet.maximumCallCount ? "CONTRASTIVE_CALL_BOUND_MISMATCH" : "",
    authorization.timeoutMs !== packet.timeoutMs ? "CONTRASTIVE_TIMEOUT_MISMATCH" : "",
    authorization.maximumRetryCount !== packet.maximumRetryCount ? "CONTRASTIVE_RETRY_BOUND_MISMATCH" : "",
    authorization.maximumOutputTokens !== packet.maximumOutputTokens ? "CONTRASTIVE_OUTPUT_BUDGET_MISMATCH" : "",
    authorization.localOnly !== packet.localOnly ? "CONTRASTIVE_LOCAL_ONLY_MISMATCH" : "",
    authorization.contrastiveDecisionContractVersion !== packet.contrastiveDecisionContractVersion ? "CONTRASTIVE_DECISION_CONTRACT_MISMATCH" : "",
    authorization.purpose !== packet.purpose ? "CONTRASTIVE_PURPOSE_MISMATCH" : "",
    authorization.truthBoundary !== packet.truthBoundary ? "CONTRASTIVE_TRUTH_BOUNDARY_MISMATCH" : "",
  ].filter(Boolean);
  if (packetReasons.length || authReasons.length) return blockedV0_3([...packetReasons, ...authReasons], packet.pairs.length, packet.maximumOutputTokens);

  if (!options.execute || process.env.NODE_ENV !== "test") {
    const endpoint = process.env.OPENAI_BASE_URL?.trim() ?? "";
    if (endpoint !== packet.endpointUrl) return blockedV0_3(["CONTRASTIVE_PROVIDER_ENDPOINT_MISMATCH"], packet.pairs.length, packet.maximumOutputTokens);
  }

  const runtimePreflight = await (options.runtimePreflight ?? runLocalProviderRuntimePreflightV0_1)(
    packet.providerId,
    packet.modelId,
    packet.endpointUrl,
    packet.localOnly,
  );
  if (runtimePreflight.readinessStatus !== "runtime_residency_ready") {
    return blockedV0_3(
      ["CONTRASTIVE_RUNTIME_PREFLIGHT_NOT_READY", ...runtimePreflight.reasonCodes],
      packet.pairs.length,
      packet.maximumOutputTokens,
      runtimePreflight,
    );
  }

  const contexts: Array<{ pair: ContrastiveSemanticPairV0_1; context: ContrastiveSemanticContextV0_1 }> = [];
  for (const pair of packet.pairs) {
    const structural = discoverStructuralHypothesesV0_1(pair.word).find((candidate) => candidate.hypothesisId === pair.structuralHypothesisId);
    if (!structural) return blockedV0_3(["CONTRASTIVE_FROZEN_STRUCTURAL_INPUT_INVALID"], packet.pairs.length, packet.maximumOutputTokens, runtimePreflight);
    const contextResult = buildContrastiveSemanticContextV0_1(pair, structural);
    if (!contextResult.ok) return blockedV0_3(["CONTRASTIVE_CONTEXT_INVALID", ...contextResult.reasonCodes], packet.pairs.length, packet.maximumOutputTokens, runtimePreflight);
    contexts.push({ pair, context: contextResult.context });
  }

  consumedAuthorizationIdsV0_3.add(authorization.authorizationId);
  const execute = options.execute ?? ((context, timeoutMs, maximumOutputTokens) => runContrastiveSemanticProposalV0_1(context, { timeoutMs, maximumOutputTokens }));
  const counts = { proposed: 0, unknown: 0, malformed: 0, timeout: 0, providerError: 0, skipped: 0 };
  const rows: ControlledSemanticContrastiveExecutionRowV0_3[] = [];
  for (const { pair, context } of contexts) {
    const startedAt = Date.now();
    const proposal = await execute(context, packet.timeoutMs, packet.maximumOutputTokens);
    const elapsedMs = Math.max(0, Date.now() - startedAt);
    if (proposal.error === "timeout") counts.timeout += 1;
    else if (proposal.error === "provider_error") counts.providerError += 1;
    else if (proposal.status === "proposed") counts.proposed += 1;
    else if (proposal.status === "unknown" || proposal.status === "skipped_provider_not_ready") counts.unknown += 1;
    else if (proposal.status === "malformed_output") counts.malformed += 1;
    const assessment = proposal.assessment;
    rows.push({
      word: pair.word,
      structuralHypothesisId: pair.structuralHypothesisId,
      embryo: context.embryo,
      expansionChain: context.expansionChain,
      voicePath: context.voicePath,
      providerAttempted: proposal.attempted,
      providerId: proposal.provider,
      modelId: packet.modelId,
      preferredSense: assessment?.preferredSense ?? null,
      alignmentStatus: assessment?.alignmentStatus ?? null,
      semanticBridge: assessment?.semanticBridge ?? null,
      doctrineRoles: assessment?.doctrineRoles ?? [],
      supportTrace: assessment?.supportTrace ?? null,
      diagnostics: proposal.diagnostics ?? null,
      elapsedMs,
      reasonCodes: proposal.reasonCodes,
      timeout: proposal.error === "timeout",
      providerError: proposal.error === "provider_error",
      malformed: proposal.status === "malformed_output",
      logicCandidateEmitted: false,
      aggregateStatus: proposal.status === "proposed" ? "candidate_only" : "unknown",
      truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion",
    });
  }
  return {
    controlledExecutionVersion: CONTROLLED_SEMANTIC_CONTRASTIVE_EXECUTION_VERSION_V0_3,
    status: "completed",
    authorizationState: "consumed",
    reasonCodes: ["CONTRASTIVE_RUN_COMPLETED", "CONTRASTIVE_AUTHORIZATION_CONSUMED"],
    plannedCalls: contexts.length,
    attemptedCalls: rows.filter((row) => row.providerAttempted).length,
    completedCalls: rows.length,
    failedCalls: rows.filter((row) => row.providerError || row.timeout).length,
    remainingCalls: 0,
    maximumOutputTokens: packet.maximumOutputTokens,
    counts,
    runtimePreflight,
    rows,
  };
}
