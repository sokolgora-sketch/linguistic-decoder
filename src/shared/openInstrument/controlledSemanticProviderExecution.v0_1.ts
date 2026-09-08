import { discoverStructuralHypothesesV0_1 } from "@/shared/structuralHypothesisDiscovery.v0_1";
import { buildSemanticAlignmentContextV0_1, type SemanticAlignmentContextV0_1 } from "@/shared/openInstrument/semanticAlignment.v0_1";
import { runSemanticAlignmentProposalV0_1, semanticProviderPreflightV0_1, type SemanticAlignmentProposalResultV0_1 } from "@/shared/orchestrator/semanticAlignmentProposal.v0_1";

export const CONTROLLED_SEMANTIC_PROVIDER_RUNNER_SCHEMA_V0_1 = "open-instrument.controlled-semantic-provider-runner.v0_1" as const;

export type ControlledSemanticExecutionTargetV0_1 = Readonly<{ word: string; targetSenseId: string; targetSenseLabel: string; structuralHypothesisId: string }>;
export type ControlledSemanticExecutionPacketV0_1 = Readonly<{
  schemaVersion: typeof CONTROLLED_SEMANTIC_PROVIDER_RUNNER_SCHEMA_V0_1;
  packetId: string;
  milestoneId: string;
  providerId: "openai_compat";
  modelId: string;
  endpointUrl: string;
  localOnly: true;
  targets: readonly ControlledSemanticExecutionTargetV0_1[];
  maximumCallCount: number;
  timeoutMs: number;
  maximumRetryCount: 0;
  purpose: "controlled_semantic_alignment_research";
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;
export type ControlledSemanticExecutionAuthorizationV0_1 = Readonly<{
  schemaVersion: typeof CONTROLLED_SEMANTIC_PROVIDER_RUNNER_SCHEMA_V0_1;
  authorizationId: string;
  state: "authorization_not_granted" | "granted_one_shot_local_only" | "consumed" | "expired";
  milestoneId: string;
  providerId: "openai_compat";
  modelId: string;
  packetFingerprint: string;
  maximumCallCount: number;
  timeoutMs: number;
  maximumRetryCount: 0;
  localOnly: true;
  purpose: "controlled_semantic_alignment_research";
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;
export type ControlledSemanticExecutionRowV0_1 = Readonly<{
  word: string; targetSenseId: string; targetSenseLabel: string; structuralHypothesisId: string; embryo: string;
  expansionChain: readonly string[]; voicePath: readonly string[]; providerAttempted: boolean; providerId: string | null; modelId: string | null;
  alignmentStatus: string | null; alignmentSource: string | null; semanticBridge: string | null; doctrineRoles: readonly string[];
  reasonCodes: readonly string[]; timeout: boolean; providerError: boolean; logicCandidateEmitted: false;
  aggregateStatus: "candidate_only" | "unknown"; truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;
export type ControlledSemanticExecutionResultV0_1 = Readonly<{
  status: "blocked" | "completed"; authorizationState: "authorization_not_granted" | "consumed"; reasonCodes: readonly string[];
  plannedCalls: number; attemptedCalls: number; completedCalls: number; failedCalls: number; remainingCalls: number;
  counts: Readonly<{ proposed: number; unknown: number; rejected: number; malformed: number; timeout: number; providerError: number; skipped: number }>;
  rows: readonly ControlledSemanticExecutionRowV0_1[];
}>;

type ProposalExecutorV0_1 = (context: SemanticAlignmentContextV0_1, timeoutMs: number) => Promise<SemanticAlignmentProposalResultV0_1>;
const consumedAuthorizationIdsV0_1 = new Set<string>();

function textV0_1(value: unknown): string { return typeof value === "string" ? value.normalize("NFKC").trim() : ""; }
function isLoopbackUrlV0_1(value: string): boolean {
  try { const url = new URL(value); return url.protocol === "http:" && (url.hostname === "127.0.0.1" || url.hostname === "localhost"); }
  catch { return false; }
}

export function fingerprintControlledSemanticExecutionPacketV0_1(packet: ControlledSemanticExecutionPacketV0_1): string {
  return JSON.stringify({ schemaVersion: packet.schemaVersion, packetId: packet.packetId, milestoneId: packet.milestoneId, providerId: packet.providerId, modelId: packet.modelId, endpointUrl: packet.endpointUrl, localOnly: packet.localOnly, targets: packet.targets, maximumCallCount: packet.maximumCallCount, timeoutMs: packet.timeoutMs, maximumRetryCount: packet.maximumRetryCount, purpose: packet.purpose, truthBoundary: packet.truthBoundary });
}

export function validateControlledSemanticExecutionPacketV0_1(packet: ControlledSemanticExecutionPacketV0_1): readonly string[] {
  const reasons: string[] = [];
  const words = new Set(packet.targets.map((target) => textV0_1(target.word)));
  const senseCounts = new Map<string, Set<string>>();
  for (const target of packet.targets) { const senses = senseCounts.get(target.word) ?? new Set<string>(); senses.add(target.targetSenseId); senseCounts.set(target.word, senses); }
  if (packet.schemaVersion !== CONTROLLED_SEMANTIC_PROVIDER_RUNNER_SCHEMA_V0_1) reasons.push("RUNNER_SCHEMA_INVALID");
  if (!packet.packetId || !packet.milestoneId) reasons.push("PACKET_ID_REQUIRED");
  if (packet.providerId !== "openai_compat") reasons.push("PROVIDER_UNSUPPORTED");
  if (!packet.modelId) reasons.push("MODEL_REQUIRED");
  if (!packet.localOnly || !isLoopbackUrlV0_1(packet.endpointUrl)) reasons.push("LOCAL_ONLY_ENDPOINT_REQUIRED");
  if (packet.targets.length === 0 || words.size > 4) reasons.push("WORD_BOUND_INVALID");
  if (packet.targets.length > 8 || packet.maximumCallCount !== packet.targets.length) reasons.push("CALL_BOUND_INVALID");
  if (!packet.targets.every((target) => senseCounts.get(target.word)?.size === 2)) reasons.push("SENSE_BOUND_INVALID");
  if (!packet.targets.every((target) => target.word && target.targetSenseId && target.targetSenseLabel && target.structuralHypothesisId)) reasons.push("TARGET_FIELDS_REQUIRED");
  if (packet.timeoutMs < 10 || packet.timeoutMs > 30000) reasons.push("TIMEOUT_BOUND_INVALID");
  if (packet.maximumRetryCount !== 0) reasons.push("RETRY_BOUND_INVALID");
  if (packet.purpose !== "controlled_semantic_alignment_research") reasons.push("PURPOSE_INVALID");
  if (packet.truthBoundary !== "hypothesis_only_user_decides_no_evidence_promotion") reasons.push("TRUTH_BOUNDARY_INVALID");
  return reasons;
}

function blockedV0_1(reasonCodes: readonly string[], plannedCalls = 0): ControlledSemanticExecutionResultV0_1 {
  return { status: "blocked", authorizationState: "authorization_not_granted", reasonCodes, plannedCalls, attemptedCalls: 0, completedCalls: 0, failedCalls: 0, remainingCalls: plannedCalls, counts: { proposed: 0, unknown: 0, rejected: 0, malformed: 0, timeout: 0, providerError: 0, skipped: plannedCalls }, rows: [] };
}

export async function runControlledSemanticProviderExecutionV0_1(packet: ControlledSemanticExecutionPacketV0_1, authorization: ControlledSemanticExecutionAuthorizationV0_1, options: Readonly<{ execute?: ProposalExecutorV0_1 }> = {}): Promise<ControlledSemanticExecutionResultV0_1> {
  const packetReasons = validateControlledSemanticExecutionPacketV0_1(packet);
  const fingerprint = fingerprintControlledSemanticExecutionPacketV0_1(packet);
  const authReasons = [
    authorization.schemaVersion !== CONTROLLED_SEMANTIC_PROVIDER_RUNNER_SCHEMA_V0_1 ? "AUTH_SCHEMA_INVALID" : "",
    authorization.state !== "granted_one_shot_local_only" ? "AUTHORIZATION_NOT_ACTIVE" : "",
    consumedAuthorizationIdsV0_1.has(authorization.authorizationId) ? "AUTHORIZATION_CONSUMED" : "",
    authorization.packetFingerprint !== fingerprint ? "PACKET_FINGERPRINT_MISMATCH" : "",
    authorization.milestoneId !== packet.milestoneId ? "MILESTONE_MISMATCH" : "",
    authorization.providerId !== packet.providerId ? "PROVIDER_MISMATCH" : "",
    authorization.modelId !== packet.modelId ? "MODEL_MISMATCH" : "",
    authorization.maximumCallCount !== packet.maximumCallCount ? "CALL_BOUND_MISMATCH" : "",
    authorization.timeoutMs !== packet.timeoutMs ? "TIMEOUT_MISMATCH" : "",
    authorization.maximumRetryCount !== packet.maximumRetryCount ? "RETRY_BOUND_MISMATCH" : "",
    authorization.localOnly !== packet.localOnly ? "LOCAL_ONLY_MISMATCH" : "",
    authorization.purpose !== packet.purpose ? "PURPOSE_MISMATCH" : "",
    authorization.truthBoundary !== packet.truthBoundary ? "TRUTH_BOUNDARY_MISMATCH" : "",
  ].filter(Boolean);
  if (packetReasons.length || authReasons.length) return blockedV0_1([...packetReasons, ...authReasons], packet.targets.length);

  if (!options.execute || process.env.NODE_ENV !== "test") {
    const preflight = semanticProviderPreflightV0_1();
    if (!preflight.providerReady) return blockedV0_1([...preflight.reasonCodes, "PROVIDER_NOT_READY"], packet.targets.length);
    if ((process.env.OPENAI_BASE_URL ?? "").trim() !== packet.endpointUrl) return blockedV0_1(["PROVIDER_ENDPOINT_MISMATCH"], packet.targets.length);
  }

  const contexts: Array<{ target: ControlledSemanticExecutionTargetV0_1; context: SemanticAlignmentContextV0_1 }> = [];
  for (const target of packet.targets) {
    const structural = discoverStructuralHypothesesV0_1(target.word).find((candidate) => candidate.hypothesisId === target.structuralHypothesisId);
    const contextResult = buildSemanticAlignmentContextV0_1({ targetWord: target.word, targetSenseId: target.targetSenseId, targetSenseLabel: target.targetSenseLabel, structuralHypothesis: structural });
    if (!structural || !contextResult.ok) return blockedV0_1(["FROZEN_STRUCTURAL_INPUT_INVALID", ...(contextResult.ok ? [] : contextResult.reasonCodes)], packet.targets.length);
    contexts.push({ target, context: contextResult.context });
  }

  consumedAuthorizationIdsV0_1.add(authorization.authorizationId);
  const execute = options.execute ?? ((context, timeoutMs) => runSemanticAlignmentProposalV0_1(context, { timeoutMs }));
  const counts = { proposed: 0, unknown: 0, rejected: 0, malformed: 0, timeout: 0, providerError: 0, skipped: 0 };
  const rows: ControlledSemanticExecutionRowV0_1[] = [];
  for (const { target, context } of contexts) {
    const proposal = await execute(context, packet.timeoutMs);
    if (proposal.error === "timeout") counts.timeout += 1;
    else if (proposal.error === "provider_error") counts.providerError += 1;
    else if (proposal.status === "proposed") counts.proposed += 1;
    else if (["unknown", "skipped_disabled", "skipped_provider_not_ready"].includes(proposal.status)) counts.unknown += 1;
    else if (proposal.status === "rejected") counts.rejected += 1;
    else if (proposal.status === "malformed_output") counts.malformed += 1;
    rows.push({ word: target.word, targetSenseId: target.targetSenseId, targetSenseLabel: target.targetSenseLabel, structuralHypothesisId: target.structuralHypothesisId, embryo: context.embryo, expansionChain: context.expansionChain, voicePath: context.voicePath, providerAttempted: proposal.attempted, providerId: proposal.provider, modelId: proposal.assessment.modelId ?? null, alignmentStatus: proposal.assessment.alignmentStatus, alignmentSource: proposal.assessment.alignmentSource, semanticBridge: proposal.assessment.semanticBridge, doctrineRoles: proposal.assessment.doctrineRoles, reasonCodes: proposal.reasonCodes, timeout: proposal.error === "timeout", providerError: proposal.error === "provider_error", logicCandidateEmitted: false, aggregateStatus: proposal.assessment.alignmentStatus === "proposed" ? "candidate_only" : "unknown", truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion" });
  }
  return { status: "completed", authorizationState: "consumed", reasonCodes: ["CONTROLLED_RUN_COMPLETED", "AUTHORIZATION_CONSUMED"], plannedCalls: contexts.length, attemptedCalls: rows.filter((row) => row.providerAttempted).length, completedCalls: rows.length, failedCalls: rows.filter((row) => row.providerError || row.timeout).length, remainingCalls: 0, counts, rows };
}
