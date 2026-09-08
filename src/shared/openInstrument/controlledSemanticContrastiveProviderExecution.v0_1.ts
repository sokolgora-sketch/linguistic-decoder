import { discoverStructuralHypothesesV0_1 } from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  buildContrastiveSemanticContextV0_1,
  CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_1,
  CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1,
  type ContrastiveSemanticAssessmentV0_1,
  type ContrastiveSemanticContextV0_1,
  type ContrastiveSemanticPairV0_1,
} from "@/shared/openInstrument/contrastiveSemanticCalibration.v0_1";
import {
  runContrastiveSemanticProposalV0_1,
  type ContrastiveSemanticProposalResultV0_1,
} from "@/shared/orchestrator/contrastiveSemanticCalibrationProposal.v0_1";

export type ControlledSemanticContrastiveExecutionPacketV0_1 = Readonly<{
  schemaVersion: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1;
  packetId: string;
  milestoneId: string;
  providerId: "openai_compat";
  modelId: string;
  endpointUrl: string;
  localOnly: true;
  contrastiveDecisionContractVersion: typeof CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_1;
  pairs: readonly ContrastiveSemanticPairV0_1[];
  maximumCallCount: 4;
  timeoutMs: number;
  maximumRetryCount: 0;
  purpose: "controlled_semantic_alignment_research";
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;

export type ControlledSemanticContrastiveAuthorizationV0_1 = Readonly<{
  schemaVersion: typeof CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1;
  authorizationId: string;
  state: "authorization_not_granted" | "granted_one_shot_local_only" | "consumed" | "expired";
  milestoneId: string;
  providerId: "openai_compat";
  modelId: string;
  packetFingerprint: string;
  maximumCallCount: 4;
  timeoutMs: number;
  maximumRetryCount: 0;
  localOnly: true;
  contrastiveDecisionContractVersion: typeof CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_1;
  purpose: "controlled_semantic_alignment_research";
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;

export type ControlledSemanticContrastiveExecutionRowV0_1 = Readonly<{
  word: string;
  structuralHypothesisId: string;
  embryo: string;
  expansionChain: readonly string[];
  voicePath: readonly string[];
  providerAttempted: boolean;
  providerId: string | null;
  modelId: string | null;
  preferredSense: "sense_a" | "sense_b" | "neither" | "both_or_unclear" | null;
  alignmentStatus: "proposed" | "unknown" | null;
  semanticBridge: string | null;
  doctrineRoles: readonly string[];
  supportTrace: ContrastiveSemanticAssessmentV0_1["supportTrace"];
  reasonCodes: readonly string[];
  timeout: boolean;
  providerError: boolean;
  malformed: boolean;
  logicCandidateEmitted: false;
  aggregateStatus: "candidate_only" | "unknown";
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;

export type ControlledSemanticContrastiveExecutionResultV0_1 = Readonly<{
  status: "blocked" | "completed";
  authorizationState: "authorization_not_granted" | "consumed";
  reasonCodes: readonly string[];
  plannedCalls: number;
  attemptedCalls: number;
  completedCalls: number;
  failedCalls: number;
  remainingCalls: number;
  counts: Readonly<{ proposed: number; unknown: number; malformed: number; timeout: number; providerError: number; skipped: number }>;
  rows: readonly ControlledSemanticContrastiveExecutionRowV0_1[];
}>;

type ContrastiveExecutorV0_1 = (
  context: ContrastiveSemanticContextV0_1,
  timeoutMs: number,
) => Promise<ContrastiveSemanticProposalResultV0_1>;

const consumedAuthorizationIdsV0_1 = new Set<string>();

function textV0_1(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFKC").trim() : "";
}

function isLoopbackUrlV0_1(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" && (url.hostname === "127.0.0.1" || url.hostname === "localhost");
  } catch {
    return false;
  }
}

export function fingerprintControlledSemanticContrastiveExecutionPacketV0_1(
  packet: ControlledSemanticContrastiveExecutionPacketV0_1,
): string {
  return JSON.stringify({
    schemaVersion: packet.schemaVersion,
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

export function validateControlledSemanticContrastiveExecutionPacketV0_1(
  packet: ControlledSemanticContrastiveExecutionPacketV0_1,
): readonly string[] {
  const reasons: string[] = [];
  const words = new Set(packet.pairs.map((pair) => textV0_1(pair.word)));
  if (packet.schemaVersion !== CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1) reasons.push("CONTRASTIVE_RUNNER_SCHEMA_INVALID");
  if (!packet.packetId || !packet.milestoneId) reasons.push("CONTRASTIVE_PACKET_ID_REQUIRED");
  if (packet.providerId !== "openai_compat") reasons.push("CONTRASTIVE_PROVIDER_UNSUPPORTED");
  if (!packet.modelId) reasons.push("CONTRASTIVE_MODEL_REQUIRED");
  if (!packet.localOnly || !isLoopbackUrlV0_1(packet.endpointUrl)) reasons.push("CONTRASTIVE_LOCAL_ONLY_ENDPOINT_REQUIRED");
  if (packet.contrastiveDecisionContractVersion !== CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_1) reasons.push("CONTRASTIVE_DECISION_CONTRACT_INVALID");
  if (packet.pairs.length !== 4 || words.size !== 4) reasons.push("CONTRASTIVE_PAIR_BOUND_INVALID");
  if (packet.maximumCallCount !== 4 || packet.maximumCallCount !== packet.pairs.length) reasons.push("CONTRASTIVE_CALL_BOUND_INVALID");
  if (packet.pairs.some((pair) => pair.senseA.targetSenseId === pair.senseB.targetSenseId)) reasons.push("CONTRASTIVE_SENSE_ID_DUPLICATE");
  if (packet.pairs.some((pair) => pair.senseA.targetSenseDefinition.trim() === "" || pair.senseB.targetSenseDefinition.trim() === "")) reasons.push("CONTRASTIVE_DEFINITIONS_REQUIRED");
  if (packet.pairs.some((pair) => !textV0_1(pair.word) || !textV0_1(pair.structuralHypothesisId) || !textV0_1(pair.senseA.targetSenseId) || !textV0_1(pair.senseB.targetSenseId) || !textV0_1(pair.senseA.targetSenseLabel) || !textV0_1(pair.senseB.targetSenseLabel))) reasons.push("CONTRASTIVE_PAIR_FIELDS_REQUIRED");
  if (packet.timeoutMs < 10 || packet.timeoutMs > 30000) reasons.push("CONTRASTIVE_TIMEOUT_BOUND_INVALID");
  if (packet.maximumRetryCount !== 0) reasons.push("CONTRASTIVE_RETRY_BOUND_INVALID");
  if (packet.purpose !== "controlled_semantic_alignment_research") reasons.push("CONTRASTIVE_PURPOSE_INVALID");
  if (packet.truthBoundary !== "hypothesis_only_user_decides_no_evidence_promotion") reasons.push("CONTRASTIVE_TRUTH_BOUNDARY_INVALID");
  return reasons;
}

function blockedV0_1(reasonCodes: readonly string[], plannedCalls = 0): ControlledSemanticContrastiveExecutionResultV0_1 {
  return {
    status: "blocked",
    authorizationState: "authorization_not_granted",
    reasonCodes,
    plannedCalls,
    attemptedCalls: 0,
    completedCalls: 0,
    failedCalls: 0,
    remainingCalls: plannedCalls,
    counts: { proposed: 0, unknown: 0, malformed: 0, timeout: 0, providerError: 0, skipped: plannedCalls },
    rows: [],
  };
}

export async function runControlledSemanticContrastiveProviderExecutionV0_1(
  packet: ControlledSemanticContrastiveExecutionPacketV0_1,
  authorization: ControlledSemanticContrastiveAuthorizationV0_1,
  options: Readonly<{ execute?: ContrastiveExecutorV0_1 }> = {},
): Promise<ControlledSemanticContrastiveExecutionResultV0_1> {
  const packetReasons = validateControlledSemanticContrastiveExecutionPacketV0_1(packet);
  const fingerprint = fingerprintControlledSemanticContrastiveExecutionPacketV0_1(packet);
  const authReasons = [
    authorization.schemaVersion !== CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1 ? "CONTRASTIVE_AUTH_SCHEMA_INVALID" : "",
    authorization.state !== "granted_one_shot_local_only" ? "CONTRASTIVE_AUTHORIZATION_NOT_ACTIVE" : "",
    consumedAuthorizationIdsV0_1.has(authorization.authorizationId) ? "CONTRASTIVE_AUTHORIZATION_CONSUMED" : "",
    authorization.packetFingerprint !== fingerprint ? "CONTRASTIVE_PACKET_FINGERPRINT_MISMATCH" : "",
    authorization.milestoneId !== packet.milestoneId ? "CONTRASTIVE_MILESTONE_MISMATCH" : "",
    authorization.providerId !== packet.providerId ? "CONTRASTIVE_PROVIDER_MISMATCH" : "",
    authorization.modelId !== packet.modelId ? "CONTRASTIVE_MODEL_MISMATCH" : "",
    authorization.maximumCallCount !== packet.maximumCallCount ? "CONTRASTIVE_CALL_BOUND_MISMATCH" : "",
    authorization.timeoutMs !== packet.timeoutMs ? "CONTRASTIVE_TIMEOUT_MISMATCH" : "",
    authorization.maximumRetryCount !== packet.maximumRetryCount ? "CONTRASTIVE_RETRY_BOUND_MISMATCH" : "",
    authorization.localOnly !== packet.localOnly ? "CONTRASTIVE_LOCAL_ONLY_MISMATCH" : "",
    authorization.contrastiveDecisionContractVersion !== packet.contrastiveDecisionContractVersion ? "CONTRASTIVE_DECISION_CONTRACT_MISMATCH" : "",
    authorization.purpose !== packet.purpose ? "CONTRASTIVE_PURPOSE_MISMATCH" : "",
    authorization.truthBoundary !== packet.truthBoundary ? "CONTRASTIVE_TRUTH_BOUNDARY_MISMATCH" : "",
  ].filter(Boolean);
  if (packetReasons.length || authReasons.length) return blockedV0_1([...packetReasons, ...authReasons], packet.pairs.length);

  if (!options.execute || process.env.NODE_ENV !== "test") {
    const endpoint = process.env.OPENAI_BASE_URL?.trim() ?? "";
    if (endpoint !== packet.endpointUrl) return blockedV0_1(["CONTRASTIVE_PROVIDER_ENDPOINT_MISMATCH"], packet.pairs.length);
  }

  const contexts: Array<{ pair: ContrastiveSemanticPairV0_1; context: ContrastiveSemanticContextV0_1 }> = [];
  for (const pair of packet.pairs) {
    const structural = discoverStructuralHypothesesV0_1(pair.word).find((candidate) => candidate.hypothesisId === pair.structuralHypothesisId);
    if (!structural) return blockedV0_1(["CONTRASTIVE_FROZEN_STRUCTURAL_INPUT_INVALID"], packet.pairs.length);
    const contextResult = buildContrastiveSemanticContextV0_1(pair, structural);
    if (!contextResult.ok) return blockedV0_1(["CONTRASTIVE_CONTEXT_INVALID", ...contextResult.reasonCodes], packet.pairs.length);
    contexts.push({ pair, context: contextResult.context });
  }

  consumedAuthorizationIdsV0_1.add(authorization.authorizationId);
  const execute = options.execute ?? ((context, timeoutMs) => runContrastiveSemanticProposalV0_1(context, { timeoutMs }));
  const counts = { proposed: 0, unknown: 0, malformed: 0, timeout: 0, providerError: 0, skipped: 0 };
  const rows: ControlledSemanticContrastiveExecutionRowV0_1[] = [];
  for (const { pair, context } of contexts) {
    const proposal = await execute(context, packet.timeoutMs);
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
      modelId: assessment?.modelId ?? null,
      preferredSense: assessment?.preferredSense ?? null,
      alignmentStatus: assessment?.alignmentStatus ?? null,
      semanticBridge: assessment?.semanticBridge ?? null,
      doctrineRoles: assessment?.doctrineRoles ?? [],
      supportTrace: assessment?.supportTrace ?? null,
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
    status: "completed",
    authorizationState: "consumed",
    reasonCodes: ["CONTRASTIVE_RUN_COMPLETED", "CONTRASTIVE_AUTHORIZATION_CONSUMED"],
    plannedCalls: contexts.length,
    attemptedCalls: rows.filter((row) => row.providerAttempted).length,
    completedCalls: rows.length,
    failedCalls: rows.filter((row) => row.providerError || row.timeout).length,
    remainingCalls: 0,
    counts,
    rows,
  };
}
