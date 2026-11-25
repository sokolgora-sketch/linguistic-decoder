import { extractSevenVowelsFromString, type SevenVowel } from "@/shared/math7.core";
import type {
  FunctionalMotivationResearchClaimLayerV0_2,
} from "@/shared/openInstrument/functionalMotivationResearchReference.v0_2";
import type {
  FunctionalMotivationTraceClaimV0_1,
  FunctionalMotivationTraceExplanationPatternV0_1,
} from "@/shared/openInstrument/functionalMotivationTrace.v0_1";
import {
  runLocalProviderRuntimePreflightV0_1,
  type LocalProviderRuntimePreflightV0_1,
} from "@/shared/openInstrument/localProviderRuntimePreflight.v0_1";
import {
  evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1,
} from "@/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1";
import {
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  runProposerV0_2,
  type ProposerRequestV0_2,
  type ProposerResultV0_2,
} from "@/shared/llm/providers/proposerProvider.v0.2";

export const SEMANTIC_FRAME_PILOT_SCHEMA_V0_1 =
  "open-instrument.semantic-frame-pilot.packet.v0_1" as const;
export const SEMANTIC_FRAME_PILOT_AUTH_SCHEMA_V0_1 =
  "open-instrument.semantic-frame-pilot.authorization.v0_1" as const;
export const SEMANTIC_FRAME_PILOT_MAX_CALLS_V0_1 = 3 as const;
export const SEMANTIC_FRAME_PILOT_TIMEOUT_MS_V0_1 = 8000 as const;
export const SEMANTIC_FRAME_PILOT_MAX_OUTPUT_TOKENS_V0_1 = 512 as const;

export type SemanticFramePilotClaimStatusV0_1 =
  | "SOURCE_REPORTED"
  | "INFERRED"
  | "HYPOTHESIS"
  | "UNKNOWN_OR_NULL";

export type SemanticFramePilotSourceV0_1 = Readonly<{
  sourceId: string;
  sourceTitle: string;
  sourceUrl: string;
  entryLocator: string;
  sourceNativeSenseId: string | null;
  language: string;
  variety: string;
  exactForm: string;
  sourceStatus: string;
  citationStatus: string;
  licensingStatus: "NOT_ASSESSED";
  reusePermission: string;
  rightsNote?: string;
  accessedOn?: string;
  localSenseId?: string;
  existingResearchEvidenceId?: string;
  existingCitationId?: string;
  existingCandidateId?: string;
  scope?: string;
}>;

export type SemanticFramePilotSourceFactV0_1 = Readonly<{
  claimId: string;
  text: string;
  claimStatus: "SOURCE_REPORTED";
  evidenceStatus: string;
  sourceIds: readonly string[];
}>;

export type SemanticFramePilotTargetV0_1 = Readonly<{
  word: string;
  targetSenseId: string;
  targetSourceId: string;
  sourceFactIds: readonly string[];
  excludedSourceIds: readonly string[];
  carrierRelationBoundary: string;
}>;

export type SemanticFramePilotPacketV0_1 = Readonly<{
  schemaVersion: typeof SEMANTIC_FRAME_PILOT_SCHEMA_V0_1;
  packetId: string;
  milestoneId: string;
  status: "RESEARCH_ONLY_NOT_PRODUCTION_AUTHORITY";
  authorityBoundary: Readonly<{
    citationStatusForNewFjaleRecords: "CITATION_ENTERED_UNVERIFIED";
    licensingStatus: "NOT_ASSESSED";
    reusePermission: "NOT_STATED_ON_ACCESSED_ENTRIES";
    storedSourceText: "MINIMAL_PARAPHRASES_ONLY_NO_DICTIONARY_DEFINITIONS";
    sourceAuthorityPromotion: "NONE";
    historicalOrigin: "NOT_CLAIMED";
    winner: "NO_SINGLE_WINNER";
    userDecisionPosture: "user_decides";
    productionBehaviorChanged: false;
  }>;
  executionLimits: Readonly<{
    providerId: "openai_compat";
    localOnly: true;
    maximumCandidateTargets: 3;
    maximumCallCount: 3;
    timeoutMs: 8000;
    maximumOutputTokens: 512;
    maximumRetryCount: 0;
    truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
  }>;
  sources: readonly SemanticFramePilotSourceV0_1[];
  sourceFacts: readonly SemanticFramePilotSourceFactV0_1[];
  targets: readonly SemanticFramePilotTargetV0_1[];
  nullControl: Readonly<{
    word: string;
    status: "UNKNOWN_OR_NULL";
    providerCalls: 0;
    reason: string;
  }>;
}>;

export type SemanticFramePilotTypedClaimV0_1 = Omit<
  FunctionalMotivationTraceClaimV0_1,
  "status"
> & Readonly<{
  status: SemanticFramePilotClaimStatusV0_1;
}>;

export type SemanticFramePilotExplanationPatternV0_1 = Omit<
  FunctionalMotivationTraceExplanationPatternV0_1,
  "action" | "patient" | "result" | "wholeWordFunction"
> & Readonly<{
  action: SemanticFramePilotTypedClaimV0_1;
  patient: SemanticFramePilotTypedClaimV0_1;
  result: SemanticFramePilotTypedClaimV0_1;
  wholeWordFunction: SemanticFramePilotTypedClaimV0_1;
}>;

export type SemanticFramePilotVoiceEventV0_1 = Readonly<{
  voice: SevenVowel;
  position: number;
}>;

export type SemanticFramePilotStructureV0_1 = Readonly<{
  exactSpelling: string;
  codePoints: readonly Readonly<{ character: string; position: number }>[];
  writtenVoiceEvents: readonly SemanticFramePilotVoiceEventV0_1[];
  claimLayer: "DERIVED_STRUCTURE";
  status: "INFERRED";
  representationAuthority: "ORTHOGRAPHIC";
  pronunciationAuthority: "UNKNOWN_OR_NULL";
  morphologyEstablished: false;
}>;

export type SemanticFramePilotCandidateV0_1 = Readonly<{
  form: string;
  function: SemanticFramePilotTypedClaimV0_1;
  evidenceRefs: readonly string[];
  writtenVoiceEvents: readonly SemanticFramePilotVoiceEventV0_1[];
  exactSubstringSpans: readonly Readonly<{ start: number; end: number }>[];
  claimStatus: "HYPOTHESIS";
}>;

export type SemanticFramePilotParsedFrameV0_1 = Readonly<{
  schemaVersion: "open-instrument.semantic-frame-pilot.frame.v0_1";
  target: Readonly<{ word: string; targetSenseId: string }>;
  sourceFacts: readonly SemanticFramePilotSourceFactV0_1[];
  writtenStructure: SemanticFramePilotStructureV0_1;
  embryo: SemanticFramePilotCandidateV0_1 | null;
  explanationPattern: SemanticFramePilotExplanationPatternV0_1;
  causalExplanation: SemanticFramePilotTypedClaimV0_1;
  unresolvedOperations: readonly SemanticFramePilotTypedClaimV0_1[];
  alternatives: readonly SemanticFramePilotTypedClaimV0_1[];
  selection: Readonly<{
    mode: "no_single_winner";
    selectedCandidateId: null;
    userDecisionPosture: "user_decides";
  }>;
  sourceAuthorityPromotion: "NONE";
  historicalOrigin: "NOT_CLAIMED";
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;

export type SemanticFramePilotParseResultV0_1 =
  | Readonly<{ ok: true; frame: SemanticFramePilotParsedFrameV0_1 }>
  | Readonly<{ ok: false; reasonCodes: readonly string[] }>;

export type SemanticFramePilotExecutionPlanV0_1 = Readonly<{
  providerId: "openai_compat";
  modelId: string;
  endpointUrl: string;
  localOnly: true;
  maximumCallCount: number;
  timeoutMs: number;
  maximumOutputTokens: number;
  maximumRetryCount: 0;
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;

export type SemanticFramePilotAuthorizationV0_1 = Readonly<{
  schemaVersion: typeof SEMANTIC_FRAME_PILOT_AUTH_SCHEMA_V0_1;
  authorizationId: string;
  state:
    | "authorization_not_granted"
    | "granted_one_shot_local_only"
    | "consumed"
    | "expired";
  packetFingerprint: string;
  providerId: "openai_compat";
  modelId: string;
  endpointUrl: string;
  maximumCallCount: number;
  timeoutMs: number;
  maximumOutputTokens: number;
  maximumRetryCount: 0;
  localOnly: true;
  truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion";
}>;

export type SemanticFramePilotExecutionRowV0_1 = Readonly<{
  word: string;
  targetSenseId: string;
  providerAttempted: boolean;
  providerId: string | null;
  modelId: string;
  usage: ProposerResultV0_2["usage"] | null;
  frame: SemanticFramePilotParsedFrameV0_1 | null;
  status: "proposed" | "unknown" | "malformed" | "timeout" | "provider_error";
  reasonCodes: readonly string[];
}>;

export type SemanticFramePilotExecutionResultV0_1 = Readonly<{
  status: "blocked" | "completed";
  authorizationState: "authorization_not_granted" | "consumed";
  reasonCodes: readonly string[];
  plannedCalls: number;
  attemptedCalls: number;
  completedCalls: number;
  failedCalls: number;
  remainingCalls: number;
  runtimePreflight: LocalProviderRuntimePreflightV0_1 | null;
  rows: readonly SemanticFramePilotExecutionRowV0_1[];
}>;

type PilotRecordV0_1 = Record<string, unknown>;
type ProposalExecutorV0_1 = (
  request: ProposerRequestV0_2,
) => Promise<ProposerResultV0_2>;
type RuntimePreflightExecutorV0_1 = (
  providerId: string,
  modelId: string,
  endpointUrl: string,
  localOnly: boolean,
) => Promise<LocalProviderRuntimePreflightV0_1>;

type RunOptionsV0_1 = Readonly<{
  execute?: ProposalExecutorV0_1;
  runtimePreflight?: RuntimePreflightExecutorV0_1;
}>;

const consumedAuthorizationIdsV0_1 = new Set<string>();

function isRecordV0_1(value: unknown): value is PilotRecordV0_1 {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonemptyStringV0_1(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function exactKeysV0_1(value: PilotRecordV0_1, expected: readonly string[]): boolean {
  return Object.keys(value).length === expected.length &&
    expected.every((key) => Object.hasOwn(value, key));
}

function isLoopbackUrlV0_1(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" &&
      (url.hostname === "127.0.0.1" || url.hostname === "localhost");
  } catch {
    return false;
  }
}

function sourceMapV0_1(packet: SemanticFramePilotPacketV0_1): Map<string, SemanticFramePilotSourceV0_1> {
  return new Map(packet.sources.map((source) => [source.sourceId, source]));
}

function factMapV0_1(packet: SemanticFramePilotPacketV0_1): Map<string, SemanticFramePilotSourceFactV0_1> {
  return new Map(packet.sourceFacts.map((fact) => [fact.claimId, fact]));
}

function validReviewedSourcesV0_1(packet: SemanticFramePilotPacketV0_1): string[] {
  const reasons: string[] = [];
  const registry = reviewedExternalLexiconSourceRowCandidateRegistryV0_1;
  for (const source of packet.sources) {
    if (source.citationStatus !== "reviewed_accepted") continue;
    const row = registry.find((candidate) => candidate.sourceId === source.sourceId);
    if (!row || row.sourceStatus !== "reviewed_accepted" ||
        row.candidateId !== source.existingCandidateId) {
      reasons.push(`REVIEWED_SOURCE_IDENTITY_MISMATCH:${source.sourceId}`);
      continue;
    }
    const authorization = evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(row);
    if (!authorization.authorized) reasons.push(`REVIEWED_SOURCE_NOT_AUTHORIZED:${source.sourceId}`);
  }
  return reasons;
}

export function validateSemanticFramePilotPacketV0_1(
  value: unknown,
): readonly string[] {
  if (!isRecordV0_1(value)) return ["PACKET_NOT_OBJECT"];
  const packet = value as unknown as SemanticFramePilotPacketV0_1;
  const reasons: string[] = [];
  if (packet.schemaVersion !== SEMANTIC_FRAME_PILOT_SCHEMA_V0_1) reasons.push("PACKET_SCHEMA_INVALID");
  if (!isNonemptyStringV0_1(packet.packetId) || !isNonemptyStringV0_1(packet.milestoneId)) reasons.push("PACKET_ID_REQUIRED");
  if (packet.status !== "RESEARCH_ONLY_NOT_PRODUCTION_AUTHORITY") reasons.push("PACKET_AUTHORITY_BOUNDARY_INVALID");
  if (packet.authorityBoundary?.sourceAuthorityPromotion !== "NONE" ||
      packet.authorityBoundary?.historicalOrigin !== "NOT_CLAIMED" ||
      packet.authorityBoundary?.winner !== "NO_SINGLE_WINNER" ||
      packet.authorityBoundary?.productionBehaviorChanged !== false) {
    reasons.push("PACKET_AUTHORITY_BOUNDARY_INVALID");
  }
  if (packet.executionLimits?.providerId !== "openai_compat" ||
      packet.executionLimits?.localOnly !== true ||
      packet.executionLimits?.maximumCandidateTargets !== SEMANTIC_FRAME_PILOT_MAX_CALLS_V0_1 ||
      packet.executionLimits?.maximumCallCount !== SEMANTIC_FRAME_PILOT_MAX_CALLS_V0_1 ||
      packet.executionLimits?.timeoutMs !== SEMANTIC_FRAME_PILOT_TIMEOUT_MS_V0_1 ||
      packet.executionLimits?.maximumOutputTokens !== SEMANTIC_FRAME_PILOT_MAX_OUTPUT_TOKENS_V0_1 ||
      packet.executionLimits?.maximumRetryCount !== 0 ||
      packet.executionLimits?.truthBoundary !== "hypothesis_only_user_decides_no_evidence_promotion") {
    reasons.push("EXECUTION_LIMITS_INVALID");
  }
  if (!Array.isArray(packet.sources) || packet.sources.length === 0 ||
      !Array.isArray(packet.sourceFacts) || !Array.isArray(packet.targets) ||
      packet.targets.length === 0 || packet.targets.length > SEMANTIC_FRAME_PILOT_MAX_CALLS_V0_1) {
    return [...reasons, "PACKET_COLLECTION_BOUND_INVALID"];
  }
  if (!packet.sources.every(isRecordV0_1) || !packet.sourceFacts.every(isRecordV0_1) ||
      !packet.targets.every(isRecordV0_1)) {
    return [...reasons, "PACKET_COLLECTION_ENTRY_INVALID"];
  }

  const sources = sourceMapV0_1(packet);
  if (sources.size !== packet.sources.length || packet.sources.some((source) =>
    !isNonemptyStringV0_1(source.sourceId) || !isNonemptyStringV0_1(source.sourceUrl) ||
    !isNonemptyStringV0_1(source.entryLocator) || !isNonemptyStringV0_1(source.exactForm) ||
    !isNonemptyStringV0_1(source.language) || source.licensingStatus !== "NOT_ASSESSED")) {
    reasons.push("SOURCE_IDENTITY_OR_RIGHTS_METADATA_INVALID");
  }
  if (packet.sources.some((source) => source.citationStatus === "CITATION_ENTERED_UNVERIFIED" &&
      (source.reusePermission !== "NOT_STATED_ON_ACCESSED_ENTRY" ||
       !isNonemptyStringV0_1(source.rightsNote)))) {
    reasons.push("UNREVIEWED_SOURCE_STATUS_INVALID");
  }
  if (new Set(packet.sourceFacts.map((fact) => fact.claimId)).size !== packet.sourceFacts.length ||
      packet.sourceFacts.some((fact) => fact.claimStatus !== "SOURCE_REPORTED" ||
        !isNonemptyStringV0_1(fact.claimId) || !isNonemptyStringV0_1(fact.text) ||
        !Array.isArray(fact.sourceIds) || fact.sourceIds.length === 0 ||
        fact.sourceIds.some((sourceId) => !sources.has(sourceId) ||
          sources.get(sourceId)?.citationStatus !== fact.evidenceStatus))) {
    reasons.push("SOURCE_FACT_PROVENANCE_INVALID");
  }
  reasons.push(...validReviewedSourcesV0_1(packet));

  const facts = factMapV0_1(packet);
  const targetWords = packet.targets.map((target) => target.word);
  if (new Set(targetWords).size !== packet.targets.length) reasons.push("TARGET_WORDS_MUST_BE_UNIQUE");
  for (const target of packet.targets) {
    if (!isNonemptyStringV0_1(target.word) || !isNonemptyStringV0_1(target.targetSenseId) ||
        !isNonemptyStringV0_1(target.targetSourceId) ||
        !isNonemptyStringV0_1(target.carrierRelationBoundary) ||
        !Array.isArray(target.sourceFactIds) || target.sourceFactIds.length === 0 ||
        !Array.isArray(target.excludedSourceIds)) {
      reasons.push("TARGET_SOURCE_OR_SENSE_BINDING_INVALID");
      continue;
    }
    const targetSource = sources.get(target.targetSourceId);
    const includedFacts = target.sourceFactIds.map((id) => facts.get(id));
    if (!targetSource || targetSource.exactForm !== target.word ||
        targetSource.localSenseId !== target.targetSenseId ||
        includedFacts.some((fact) => !fact || fact.sourceIds.some((id) =>
          target.excludedSourceIds.includes(id))) ||
        !includedFacts.some((fact) => fact?.sourceIds.includes(target.targetSourceId)) ||
        target.excludedSourceIds.some((id) => !sources.has(id))) {
      reasons.push("TARGET_SOURCE_OR_SENSE_BINDING_INVALID");
    }
  }
  if (!isRecordV0_1(packet.nullControl) || !isNonemptyStringV0_1(packet.nullControl.word) ||
      packet.nullControl.status !== "UNKNOWN_OR_NULL" ||
      packet.nullControl?.providerCalls !== 0 ||
      !isNonemptyStringV0_1(packet.nullControl.reason) ||
      packet.targets.some((target) => target.word === packet.nullControl.word)) {
    reasons.push("NULL_CONTROL_MUST_REMAIN_ZERO_CALL");
  }
  return [...new Set(reasons)];
}

function claimLayerForStatusV0_1(
  status: SemanticFramePilotClaimStatusV0_1,
): FunctionalMotivationResearchClaimLayerV0_2 {
  if (status === "SOURCE_REPORTED") return "SOURCE_FACT";
  if (status === "INFERRED") return "LOGICAL_INFERENCE";
  if (status === "HYPOTHESIS") return "EXPLORATORY_HYPOTHESIS";
  return "UNKNOWN_OR_NULL";
}

function typedClaimV0_1(
  text: string,
  status: SemanticFramePilotClaimStatusV0_1,
  sourceIds: readonly string[],
): SemanticFramePilotTypedClaimV0_1 {
  return {
    text,
    claimLayer: claimLayerForStatusV0_1(status),
    status,
    sourceIds,
  };
}

function structureForWordV0_1(word: string): SemanticFramePilotStructureV0_1 {
  const codePoints = Array.from(word).map((character, position) => ({ character, position }));
  const writtenVoiceEvents = codePoints.flatMap(({ character, position }) => {
    const voice = extractSevenVowelsFromString(character)[0];
    return voice ? [{ voice, position }] : [];
  });
  return {
    exactSpelling: word,
    codePoints,
    writtenVoiceEvents,
    claimLayer: "DERIVED_STRUCTURE",
    status: "INFERRED",
    representationAuthority: "ORTHOGRAPHIC",
    pronunciationAuthority: "UNKNOWN_OR_NULL",
    morphologyEstablished: false,
  };
}

function exactSubstringSpansV0_1(word: string, form: string): readonly Readonly<{ start: number; end: number }>[] {
  const wordPoints = Array.from(word);
  const formPoints = Array.from(form);
  if (formPoints.length === 0 || formPoints.length > wordPoints.length) return [];
  const spans: Array<{ start: number; end: number }> = [];
  for (let start = 0; start <= wordPoints.length - formPoints.length; start += 1) {
    if (formPoints.every((character, offset) => wordPoints[start + offset] === character)) {
      spans.push({ start, end: start + formPoints.length });
    }
  }
  return spans;
}

function textArrayV0_1(value: unknown, maximumLength: number): string[] | null {
  if (!Array.isArray(value) || value.length > maximumLength ||
      !value.every((item) => typeof item === "string" && item.trim().length > 0)) return null;
  return [...value];
}

function parseCandidateClaimV0_1(
  value: unknown,
  allowedSourceIds: ReadonlySet<string>,
  path: string,
  reasons: string[],
): SemanticFramePilotTypedClaimV0_1 | null {
  if (!isRecordV0_1(value) || !exactKeysV0_1(value, ["text", "evidenceRefs"])) {
    if (isRecordV0_1(value) && ("status" in value || "claimStatus" in value || "claimLayer" in value)) {
      reasons.push(`MODEL_AUTHORITY_FIELD_FORBIDDEN:${path}`);
    } else {
      reasons.push(`MODEL_CLAIM_SHAPE_INVALID:${path}`);
    }
    return null;
  }
  const rawText = value.text;
  const refs = textArrayV0_1(value.evidenceRefs, 8);
  if (refs === null || (rawText !== null && typeof rawText !== "string")) {
    reasons.push(`MODEL_CLAIM_SHAPE_INVALID:${path}`);
    return null;
  }
  if (rawText === null) {
    if (refs.length !== 0) reasons.push(`NULL_CLAIM_HAS_EVIDENCE:${path}`);
    return typedClaimV0_1("", "UNKNOWN_OR_NULL", []);
  }
  if (rawText.trim().length === 0 || rawText.length > 700 || refs.length === 0 ||
      refs.some((sourceId) => !allowedSourceIds.has(sourceId)) ||
      new Set(refs).size !== refs.length) {
    reasons.push(`MODEL_CLAIM_EVIDENCE_OR_TEXT_INVALID:${path}`);
    return null;
  }
  return typedClaimV0_1(rawText, "HYPOTHESIS", refs);
}

function expectedFrameKeysV0_1(): readonly string[] {
  return [
    "word",
    "targetSenseId",
    "embryo",
    "action",
    "patient",
    "resultState",
    "wholeWordFunction",
    "causalExplanation",
    "unresolvedOperations",
    "alternatives",
    "selection",
  ];
}

export function parseSemanticFramePilotProposalV0_1(
  rawText: string,
  packet: SemanticFramePilotPacketV0_1,
  target: SemanticFramePilotTargetV0_1,
): SemanticFramePilotParseResultV0_1 {
  const packetReasons = validateSemanticFramePilotPacketV0_1(packet);
  if (packetReasons.length > 0) return { ok: false, reasonCodes: packetReasons };
  const registeredTarget = packet.targets.find((candidate) =>
    candidate.word === target.word && candidate.targetSenseId === target.targetSenseId);
  if (!registeredTarget || JSON.stringify(registeredTarget) !== JSON.stringify(target)) {
    return { ok: false, reasonCodes: ["TARGET_NOT_BOUND_TO_PACKET"] };
  }
  if (typeof rawText !== "string") return { ok: false, reasonCodes: ["MODEL_OUTPUT_NOT_TEXT"] };

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { ok: false, reasonCodes: ["MODEL_OUTPUT_MALFORMED_JSON"] };
  }
  if (!isRecordV0_1(parsed) || !exactKeysV0_1(parsed, expectedFrameKeysV0_1())) {
    const modelClaimsAuthority = isRecordV0_1(parsed) &&
      ("claimStatus" in parsed || "claimLayer" in parsed || "sourceAuthorityPromotion" in parsed);
    return {
      ok: false,
      reasonCodes: [modelClaimsAuthority ? "MODEL_AUTHORITY_FIELD_FORBIDDEN" : "MODEL_FRAME_SHAPE_INVALID"],
    };
  }
  if (parsed.word !== target.word || parsed.targetSenseId !== target.targetSenseId) {
    return { ok: false, reasonCodes: ["MODEL_TARGET_IDENTITY_MISMATCH"] };
  }
  const allFacts = factMapV0_1(packet);
  const targetFacts = target.sourceFactIds.map((id) => allFacts.get(id)).filter(
    (fact): fact is SemanticFramePilotSourceFactV0_1 => Boolean(fact),
  );
  const allowedSourceIds = new Set(targetFacts.flatMap((fact) => fact.sourceIds));
  const reasons: string[] = [];

  let embryo: SemanticFramePilotCandidateV0_1 | null = null;
  if (parsed.embryo !== null) {
    if (!isRecordV0_1(parsed.embryo) ||
        !exactKeysV0_1(parsed.embryo, ["form", "function", "evidenceRefs"]) ||
        !isNonemptyStringV0_1(parsed.embryo.form) || parsed.embryo.form === target.word) {
      reasons.push("MODEL_EMBRYO_SHAPE_OR_CIRCULARITY_INVALID");
    } else {
      const functionClaim = parseCandidateClaimV0_1(
        parsed.embryo.function,
        allowedSourceIds,
        "embryo.function",
        reasons,
      );
      const refs = textArrayV0_1(parsed.embryo.evidenceRefs, 8);
      if (refs === null || refs.length === 0 || refs.some((id) => !allowedSourceIds.has(id)) ||
          new Set(refs).size !== refs.length) {
        reasons.push("MODEL_EMBRYO_EVIDENCE_INVALID");
      }
      if (functionClaim && refs) {
        const structure = structureForWordV0_1(parsed.embryo.form);
        embryo = {
          form: parsed.embryo.form,
          function: functionClaim,
          evidenceRefs: refs,
          writtenVoiceEvents: structure.writtenVoiceEvents,
          exactSubstringSpans: exactSubstringSpansV0_1(target.word, parsed.embryo.form),
          claimStatus: "HYPOTHESIS",
        };
      }
    }
  }

  const action = parseCandidateClaimV0_1(parsed.action, allowedSourceIds, "action", reasons);
  const patient = parseCandidateClaimV0_1(parsed.patient, allowedSourceIds, "patient", reasons);
  const result = parseCandidateClaimV0_1(parsed.resultState, allowedSourceIds, "resultState", reasons);
  const wholeWordFunction = parseCandidateClaimV0_1(parsed.wholeWordFunction, allowedSourceIds, "wholeWordFunction", reasons);
  const causalExplanation = parseCandidateClaimV0_1(parsed.causalExplanation, allowedSourceIds, "causalExplanation", reasons);
  const unresolved = textArrayV0_1(parsed.unresolvedOperations, 8);
  if (unresolved === null) reasons.push("UNRESOLVED_OPERATIONS_SHAPE_INVALID");
  const rawAlternatives = Array.isArray(parsed.alternatives) ? parsed.alternatives : null;
  if (!rawAlternatives || rawAlternatives.length > 4) reasons.push("ALTERNATIVES_SHAPE_INVALID");
  const alternatives = (rawAlternatives ?? []).map((item, index) =>
    parseCandidateClaimV0_1(item, allowedSourceIds, `alternatives:${index}`, reasons),
  ).filter((item): item is SemanticFramePilotTypedClaimV0_1 => item !== null);
  const selection = parsed.selection;
  if (!isRecordV0_1(selection) || !exactKeysV0_1(selection, ["mode", "selectedCandidateId"]) ||
      selection.mode !== "no_single_winner" || selection.selectedCandidateId !== null) {
    reasons.push("NO_SINGLE_WINNER_REQUIRED");
  }
  if (reasons.length > 0 || !action || !patient || !result || !wholeWordFunction ||
      !causalExplanation || unresolved === null) {
    return { ok: false, reasonCodes: [...new Set(reasons)] };
  }

  const makeUnknown = (text: string): SemanticFramePilotTypedClaimV0_1 =>
    typedClaimV0_1(text, "UNKNOWN_OR_NULL", []);
  return {
    ok: true,
    frame: {
      schemaVersion: "open-instrument.semantic-frame-pilot.frame.v0_1",
      target: { word: target.word, targetSenseId: target.targetSenseId },
      sourceFacts: targetFacts,
      writtenStructure: structureForWordV0_1(target.word),
      embryo,
      explanationPattern: { action, patient, result, wholeWordFunction },
      causalExplanation,
      unresolvedOperations: unresolved.map(makeUnknown),
      alternatives,
      selection: {
        mode: "no_single_winner",
        selectedCandidateId: null,
        userDecisionPosture: "user_decides",
      },
      sourceAuthorityPromotion: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      truthBoundary: "hypothesis_only_user_decides_no_evidence_promotion",
    },
  };
}

export function buildSemanticFramePilotNullControlV0_1(
  packet: SemanticFramePilotPacketV0_1,
): Readonly<{
  word: string;
  status: "UNKNOWN_OR_NULL";
  providerCalls: 0;
  frame: null;
  reason: string;
}> {
  return {
    word: packet.nullControl.word,
    status: "UNKNOWN_OR_NULL",
    providerCalls: 0,
    frame: null,
    reason: packet.nullControl.reason,
  };
}

export function buildSemanticFramePilotSystemPromptV0_1(): string {
  return [
    "You are a research-only functional-frame candidate proposer. You are not a source authority.",
    "Use only the supplied exact source facts. Source citations marked unverified remain unverified.",
    "Do not claim historical origin, derivation, morphology, cognacy, or a single winner.",
    "A lexical resemblance or written substring does not establish an embryo or relation.",
    "When a source does not support a role, use null with an empty evidenceRefs array.",
    "Every non-null candidate claim must cite one or more supplied sourceIds in evidenceRefs.",
    "Do not emit claim status, claim layer, review status, or authority fields; the caller assigns hypothesis or unknown status.",
    "Use the exact word and targetSenseId from the input. Keep alternatives separate.",
    "Return exactly one JSON object with keys: word, targetSenseId, embryo, action, patient, resultState, wholeWordFunction, causalExplanation, unresolvedOperations, alternatives, selection.",
    "Each claim is {text: string|null, evidenceRefs: string[]}. embryo is null or {form: string, function: claim, evidenceRefs: string[]}.",
    "selection must be {mode: no_single_winner, selectedCandidateId: null}. Return JSON only.",
  ].join(" ");
}

export function buildSemanticFramePilotUserPayloadV0_1(
  packet: SemanticFramePilotPacketV0_1,
  target: SemanticFramePilotTargetV0_1,
): Readonly<Record<string, unknown>> {
  const facts = factMapV0_1(packet);
  const sources = sourceMapV0_1(packet);
  const sourceFacts = target.sourceFactIds.flatMap((claimId) => {
    const fact = facts.get(claimId);
    if (!fact) return [];
    return [{
      claimId: fact.claimId,
      text: fact.text,
      claimStatus: fact.claimStatus,
      evidenceStatus: fact.evidenceStatus,
      sources: fact.sourceIds.map((sourceId) => {
        const source = sources.get(sourceId)!;
        return {
          sourceId: source.sourceId,
          sourceTitle: source.sourceTitle,
          sourceUrl: source.sourceUrl,
          entryLocator: source.entryLocator,
          exactForm: source.exactForm,
          language: source.language,
          variety: source.variety,
          sourceStatus: source.sourceStatus,
          citationStatus: source.citationStatus,
          licensingStatus: source.licensingStatus,
        };
      }),
    }];
  });
  return {
    word: target.word,
    targetSenseId: target.targetSenseId,
    targetSourceId: target.targetSourceId,
    sourceFacts,
    writtenStructure: structureForWordV0_1(target.word),
    carrierRelationBoundary: target.carrierRelationBoundary,
    claimBoundary: {
      generatedClaimsAreHypotheses: true,
      sourceAuthorityPromotion: "NONE",
      historicalOrigin: "NOT_CLAIMED",
      selection: "no_single_winner",
    },
  };
}

export function fingerprintSemanticFramePilotExecutionV0_1(
  packet: SemanticFramePilotPacketV0_1,
  plan: SemanticFramePilotExecutionPlanV0_1,
): string {
  return JSON.stringify({
    packet,
    plan: {
      providerId: plan.providerId,
      modelId: plan.modelId,
      endpointUrl: plan.endpointUrl,
      localOnly: plan.localOnly,
      maximumCallCount: plan.maximumCallCount,
      timeoutMs: plan.timeoutMs,
      maximumOutputTokens: plan.maximumOutputTokens,
      maximumRetryCount: plan.maximumRetryCount,
      truthBoundary: plan.truthBoundary,
    },
  });
}

function blockedExecutionV0_1(
  reasonCodes: readonly string[],
  plannedCalls: number,
  runtimePreflight: LocalProviderRuntimePreflightV0_1 | null = null,
): SemanticFramePilotExecutionResultV0_1 {
  return {
    status: "blocked",
    authorizationState: "authorization_not_granted",
    reasonCodes,
    plannedCalls,
    attemptedCalls: 0,
    completedCalls: 0,
    failedCalls: 0,
    remainingCalls: plannedCalls,
    runtimePreflight,
    rows: [],
  };
}

function validateExecutionPlanV0_1(
  packet: SemanticFramePilotPacketV0_1,
  plan: SemanticFramePilotExecutionPlanV0_1,
): readonly string[] {
  const reasons: string[] = [];
  if (plan.providerId !== "openai_compat" || !plan.localOnly || !isLoopbackUrlV0_1(plan.endpointUrl)) {
    reasons.push("LOCAL_LOOPBACK_PROVIDER_REQUIRED");
  }
  if (!isNonemptyStringV0_1(plan.modelId)) reasons.push("MODEL_ID_REQUIRED");
  if (packet.targets.length > SEMANTIC_FRAME_PILOT_MAX_CALLS_V0_1 ||
      plan.maximumCallCount !== packet.targets.length ||
      plan.maximumCallCount > SEMANTIC_FRAME_PILOT_MAX_CALLS_V0_1) reasons.push("CALL_BOUND_INVALID");
  if (plan.timeoutMs !== SEMANTIC_FRAME_PILOT_TIMEOUT_MS_V0_1) reasons.push("TIMEOUT_BOUND_INVALID");
  if (plan.maximumOutputTokens !== SEMANTIC_FRAME_PILOT_MAX_OUTPUT_TOKENS_V0_1) reasons.push("OUTPUT_TOKEN_BOUND_INVALID");
  if (plan.maximumRetryCount !== 0) reasons.push("RETRY_BOUND_INVALID");
  if (plan.truthBoundary !== "hypothesis_only_user_decides_no_evidence_promotion") reasons.push("TRUTH_BOUNDARY_INVALID");
  return reasons;
}

function validateAuthorizationV0_1(
  packet: SemanticFramePilotPacketV0_1,
  plan: SemanticFramePilotExecutionPlanV0_1,
  authorization: SemanticFramePilotAuthorizationV0_1,
): readonly string[] {
  const fingerprint = fingerprintSemanticFramePilotExecutionV0_1(packet, plan);
  return [
    !isNonemptyStringV0_1(authorization.authorizationId) ? "AUTHORIZATION_ID_REQUIRED" : "",
    authorization.schemaVersion !== SEMANTIC_FRAME_PILOT_AUTH_SCHEMA_V0_1 ? "AUTH_SCHEMA_INVALID" : "",
    authorization.state !== "granted_one_shot_local_only" ? "AUTHORIZATION_NOT_ACTIVE" : "",
    consumedAuthorizationIdsV0_1.has(authorization.authorizationId) ? "AUTHORIZATION_CONSUMED" : "",
    authorization.packetFingerprint !== fingerprint ? "PACKET_FINGERPRINT_MISMATCH" : "",
    authorization.providerId !== plan.providerId ? "AUTH_PROVIDER_MISMATCH" : "",
    authorization.modelId !== plan.modelId ? "AUTH_MODEL_MISMATCH" : "",
    authorization.endpointUrl !== plan.endpointUrl ? "AUTH_ENDPOINT_MISMATCH" : "",
    authorization.maximumCallCount !== plan.maximumCallCount ? "AUTH_CALL_BOUND_MISMATCH" : "",
    authorization.timeoutMs !== plan.timeoutMs ? "AUTH_TIMEOUT_MISMATCH" : "",
    authorization.maximumOutputTokens !== plan.maximumOutputTokens ? "AUTH_OUTPUT_TOKEN_BOUND_MISMATCH" : "",
    authorization.maximumRetryCount !== 0 ? "AUTH_RETRY_BOUND_INVALID" : "",
    authorization.localOnly !== true ? "AUTH_LOCAL_ONLY_REQUIRED" : "",
    authorization.truthBoundary !== plan.truthBoundary ? "AUTH_TRUTH_BOUNDARY_MISMATCH" : "",
  ].filter(Boolean);
}

function validateRuntimeReadyV0_1(
  result: LocalProviderRuntimePreflightV0_1,
  plan: SemanticFramePilotExecutionPlanV0_1,
): boolean {
  return result.providerId === plan.providerId && result.modelId === plan.modelId &&
    result.endpointUrl === plan.endpointUrl && result.endpointReachable &&
    result.modelVisible && result.residencyObservationSupported && result.modelResident &&
    result.readinessStatus === "runtime_residency_ready";
}

function defaultExecutorV0_1(plan: SemanticFramePilotExecutionPlanV0_1): ProposalExecutorV0_1 {
  return async (request) => {
    const baseUrl = process.env.OPENAI_BASE_URL?.trim() ?? "";
    const model = process.env.OPENAI_MODEL?.trim() ?? "";
    const key = process.env.OPENAI_API_KEY?.trim() ?? "";
    if (baseUrl !== plan.endpointUrl || model !== plan.modelId || !key) {
      throw new Error("LOCAL_PROVIDER_CONFIGURATION_MISMATCH");
    }
    return runProposerV0_2(request, "openai_compat");
  };
}

async function withTimeoutV0_1<T>(
  execute: (signal: AbortSignal) => Promise<T>,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error("SEMANTIC_FRAME_PILOT_TIMEOUT"));
    }, timeoutMs);
  });
  try {
    return await Promise.race([execute(controller.signal), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function runSemanticFramePilotV0_1(
  packet: SemanticFramePilotPacketV0_1,
  plan: SemanticFramePilotExecutionPlanV0_1,
  authorization: SemanticFramePilotAuthorizationV0_1,
  options: RunOptionsV0_1 = {},
): Promise<SemanticFramePilotExecutionResultV0_1> {
  const packetReasons = validateSemanticFramePilotPacketV0_1(packet);
  const planReasons = validateExecutionPlanV0_1(packet, plan);
  const authReasons = validateAuthorizationV0_1(packet, plan, authorization);
  const plannedCalls = packet.targets.length;
  if (packetReasons.length || planReasons.length || authReasons.length) {
    return blockedExecutionV0_1([...packetReasons, ...planReasons, ...authReasons], plannedCalls);
  }
  const hasOverrides = Boolean(options.execute || options.runtimePreflight);
  if (hasOverrides && process.env.NODE_ENV !== "test") {
    return blockedExecutionV0_1(["TEST_EXECUTOR_OVERRIDE_FORBIDDEN"], plannedCalls);
  }
  if (process.env.NODE_ENV === "test" && (!options.execute || !options.runtimePreflight)) {
    return blockedExecutionV0_1(["TEST_EXECUTOR_AND_PREFLIGHT_REQUIRED"], plannedCalls);
  }
  if (!options.execute && (
    (process.env.OPENAI_BASE_URL?.trim() ?? "") !== plan.endpointUrl ||
    (process.env.OPENAI_MODEL?.trim() ?? "") !== plan.modelId ||
    !(process.env.OPENAI_API_KEY?.trim())
  )) {
    return blockedExecutionV0_1(["LOCAL_PROVIDER_CONFIGURATION_MISMATCH"], plannedCalls);
  }

  const runtimePreflight = await (options.runtimePreflight ?? runLocalProviderRuntimePreflightV0_1)(
    plan.providerId,
    plan.modelId,
    plan.endpointUrl,
    plan.localOnly,
  );
  if (!validateRuntimeReadyV0_1(runtimePreflight, plan)) {
    return blockedExecutionV0_1(
      ["LOCAL_PROVIDER_RUNTIME_NOT_READY", ...runtimePreflight.reasonCodes],
      plannedCalls,
      runtimePreflight,
    );
  }

  const prompts = packet.targets.map((target) => ({
    target,
    request: {
      word: target.word,
      mode: "strict" as const,
      systemPrompt: buildSemanticFramePilotSystemPromptV0_1(),
      userPayload: buildSemanticFramePilotUserPayloadV0_1(packet, target),
      maximumOutputTokens: plan.maximumOutputTokens,
    },
  }));
  consumedAuthorizationIdsV0_1.add(authorization.authorizationId);
  const execute = options.execute ?? defaultExecutorV0_1(plan);
  const rows: SemanticFramePilotExecutionRowV0_1[] = [];
  let attemptedCalls = 0;
  let failedCalls = 0;

  for (const { target, request } of prompts) {
    attemptedCalls += 1;
    try {
      const proposal = await withTimeoutV0_1(
        (signal) => execute({ ...request, signal }),
        plan.timeoutMs,
      );
      const parsed = parseSemanticFramePilotProposalV0_1(proposal.rawText, packet, target);
      if (!parsed.ok) {
        failedCalls += 1;
        rows.push({
          word: target.word,
          targetSenseId: target.targetSenseId,
          providerAttempted: true,
          providerId: proposal.provider,
          modelId: plan.modelId,
          usage: proposal.usage ?? null,
          frame: null,
          status: "malformed",
          reasonCodes: parsed.reasonCodes,
        });
        continue;
      }
      rows.push({
        word: target.word,
        targetSenseId: target.targetSenseId,
        providerAttempted: true,
        providerId: proposal.provider,
        modelId: plan.modelId,
        usage: proposal.usage ?? null,
        frame: parsed.frame,
        status: "proposed",
        reasonCodes: ["HYPOTHESIS_ONLY_NO_AUTHORITY_PROMOTION"],
      });
    } catch (error) {
      failedCalls += 1;
      const timeout = error instanceof Error && error.message === "SEMANTIC_FRAME_PILOT_TIMEOUT";
      rows.push({
        word: target.word,
        targetSenseId: target.targetSenseId,
        providerAttempted: true,
        providerId: "openai_compat",
        modelId: plan.modelId,
        usage: null,
        frame: null,
        status: timeout ? "timeout" : "provider_error",
        reasonCodes: [timeout ? "PROVIDER_REQUEST_TIMEOUT" : "PROVIDER_REQUEST_FAILED"],
      });
    }
  }

  return {
    status: "completed",
    authorizationState: "consumed",
    reasonCodes: ["SEMANTIC_FRAME_PILOT_COMPLETED", "AUTHORIZATION_CONSUMED"],
    plannedCalls,
    attemptedCalls,
    completedCalls: rows.length,
    failedCalls,
    remainingCalls: Math.max(0, plannedCalls - attemptedCalls),
    runtimePreflight,
    rows,
  };
}
