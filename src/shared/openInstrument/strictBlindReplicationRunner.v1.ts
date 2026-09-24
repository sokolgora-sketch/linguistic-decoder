import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";

export const STRICT_BLIND_REPLICATION_RUNNER_SCHEMA_V1 =
  "open-instrument.strict-blind-replication-runner.v1" as const;

export const STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_V1 = false as const;

export const STRICT_BLIND_REPLICATION_OUTCOME_V1 = [
  "FUNCTIONAL_CORRESPONDENCE",
  "LEXICAL_EQUIVALENCE",
  "FORM_RESEMBLANCE_ONLY",
  "HISTORICAL_RELATION_ONLY",
  "INSUFFICIENT_CORRESPONDENCE",
  "NULL",
] as const;

export type StrictBlindReplicationOutcomeV1 =
  (typeof STRICT_BLIND_REPLICATION_OUTCOME_V1)[number];

export type StrictBlindRunnerModeV1 = "synthetic" | "real";

export type StrictBlindReadinessCheckV1 = Readonly<{
  preregistrationHashMatch: boolean;
  payloadHashesMatch: boolean;
  workerEnvelopeValid: boolean;
  sourceUniverseFrozen: boolean;
  runnerTestsPass: boolean;
  realExecutionLockActive: boolean;
  productionFirewallActive: boolean;
  durabilityGateActive: boolean;
  revealGateActive: boolean;
  baselineUnchanged: boolean;
}>;

export type StrictBlindReadinessReportV1 = Readonly<{
  status:
    | "READY_FOR_CONTROLLED_STRICT_BLIND_EXECUTION"
    | "NOT_READY_FOR_CONTROLLED_STRICT_BLIND_EXECUTION";
  checks: StrictBlindReadinessCheckV1;
}>;

export type StrictBlindFrozenArtifactPathsV1 = Readonly<{
  root: string;
  preregistrationPath: string;
  workerEnvelopePath: string;
  payloadPaths: Readonly<Record<string, string>>;
  expectedPreregistrationSha256: string;
  expectedWorkerEnvelopeSha256: string;
  expectedPayloadSha256: Readonly<Record<string, string>>;
}>;

export type StrictBlindFrozenArtifactIdentityV1 = Readonly<{
  preregistrationSha256: string;
  workerEnvelopeSha256: string;
  payloadSha256: Readonly<Record<string, string>>;
  experimentId: string;
  sourcePolicyId: string;
  searchPolicyVersion: string;
  durabilityPolicyId: string;
  payloadEmbryo: string;
  payloadVoicePath: readonly string[];
  sourceTraditionIds: readonly string[];
  searchStages: readonly string[];
}>;

export type StrictBlindSourceQueryV1 = Readonly<{
  sourceTraditionId: string;
  stage: string;
  queryForm: string;
  formOrigin: "structural_embryo_or_authorized_transform";
}>;

export type StrictBlindSourceObservationV1 = Readonly<{
  sourceTraditionId: string;
  sourceRecordId: string;
  sourceForm: string;
  gloss: string;
  locator: string;
  attestationTruth: "fact" | "inference" | "hypothesis" | "unknown";
}>;

export type StrictBlindSourceUnavailableV1 = Readonly<{
  sourceTraditionId: string;
  reasonCode: "SOURCE_UNAVAILABLE";
  detail: string;
}>;

export type StrictBlindFunctionFreezeV1 = Readonly<{
  kind: "FUNCTION";
  mechanismType:
    | "operation_process"
    | "functional_role"
    | "functional_decomposition"
    | "semantic_mechanism"
    | "lexical_equivalence_only";
  statement: string;
  evidenceBeyondGloss: boolean;
}>;

export type StrictBlindNullFreezeV1 = Readonly<{
  kind: "NULL";
  reasonCode:
    | "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE"
    | "SOURCE_UNAVAILABLE"
    | "INSUFFICIENT_AUTHORITY";
}>;

export type StrictBlindPreRevealArtifactV1 = Readonly<{
  schemaVersion: typeof STRICT_BLIND_REPLICATION_RUNNER_SCHEMA_V1;
  artifactType: "strict_blind_pre_reveal_canonical";
  replicationExperimentId: string;
  replicationSlot: string;
  sourcePolicyId: string;
  searchPolicyId: string;
  caseOpaqueId: string;
  payloadSha256: string;
  structuralInput: Readonly<{
    embryo: string;
    voicePath: readonly string[];
  }>;
  embryoOrder: readonly string[];
  sourceQueries: readonly StrictBlindSourceQueryV1[];
  sourceObservations: readonly StrictBlindSourceObservationV1[];
  sourceUnavailableEvents: readonly StrictBlindSourceUnavailableV1[];
  sourceQueryLog: readonly StrictBlindSourceQueryV1[];
  acceptedSourceFacts: readonly StrictBlindSourceObservationV1[];
  formRelationAnalysis: readonly string[];
  functionCandidates: readonly StrictBlindFunctionFreezeV1[];
  alternativeFunctions: readonly string[];
  rejectedInterpretations: readonly string[];
  preRevealNullState: StrictBlindNullFreezeV1 | null;
  evidenceReferences: readonly string[];
  truthHierarchy: readonly ["FACT", "INFERENCE", "HYPOTHESIS", "UNKNOWN / NULL"];
  claimBoundaries: readonly string[];
  noSingleWinner: true;
  userDecides: true;
  freezeStatus: "FROZEN";
  createdBeforeTargetReveal: true;
  blindnessAttestation: true;
  frozenDecision: StrictBlindFunctionFreezeV1 | StrictBlindNullFreezeV1;
  contamination: Readonly<{
    contaminated: boolean;
    reasonCode: string | null;
  }>;
  targetRevealStatus: "NOT_REQUESTED_AND_NOT_PERFORMED";
  revealGateStatus: "FORBIDDEN_UNTIL_DURABILITY_GATE";
  productionMutationState: "NONE";
}>;

export type StrictBlindPreRevealContextV1 = Readonly<{
  caseOpaqueId: string;
  payloadSha256: string;
  structuralInput: Readonly<{
    embryo: string;
    voicePath: readonly string[];
  }>;
  authorizedSourceTraditionIds: readonly string[];
  authorizedSearchStages: readonly string[];
  recordSourceQuery: (query: StrictBlindSourceQueryV1) => void;
  recordSourceObservation: (observation: StrictBlindSourceObservationV1) => void;
  recordSourceUnavailable: (event: StrictBlindSourceUnavailableV1) => void;
  freezeFunction: (value: Omit<StrictBlindFunctionFreezeV1, "kind">) => void;
  freezeNull: (value: StrictBlindNullFreezeV1) => void;
  markContaminated: (reasonCode: string) => void;
  readTarget: () => never;
}>;

export type StrictBlindCorrespondenceEvaluationV1 = Readonly<{
  classification: StrictBlindReplicationOutcomeV1;
  reasonCode: string;
  targetBinding: "MATCHED" | "FAILED" | "NOT_EVALUATED";
  functionalMechanism: string | null;
  evidenceBeyondGloss: boolean;
  structuralRelationStatus: "SEPARATE" | "NONE" | "INSUFFICIENT";
}>;

export type StrictBlindPostRevealEvaluationInputV1 = Readonly<{
  targetWord: string;
  targetSenseId: string;
  targetSenseLabel: string;
  preRevealArtifact: StrictBlindPreRevealArtifactV1;
}>;

export type StrictBlindResultPackageV1 = Readonly<{
  schemaVersion: typeof STRICT_BLIND_REPLICATION_RUNNER_SCHEMA_V1;
  mode: StrictBlindRunnerModeV1;
  caseOpaqueId: string;
  payloadSha256: string;
  preRevealArtifact: StrictBlindPreRevealArtifactV1;
  preRevealArtifactSha256: string;
  durability: Readonly<{
    primaryAndSecondaryMatch: boolean;
    manifestMatches: boolean;
    hashMatches: boolean;
    passed: boolean;
  }>;
  reveal: Readonly<{
    allowed: boolean;
    targetRevealed: boolean;
  }>;
  postRevealEvaluation: StrictBlindCorrespondenceEvaluationV1 | null;
  contamination: Readonly<{
    contaminated: boolean;
    reasonCode: string | null;
  }>;
  productionMutationState: "NONE";
}>;

export type StrictBlindDurabilityStoreV1 = Readonly<{
  write: (input: {
    primaryBytes: Buffer;
    secondaryBytes: Buffer;
    manifestBytes: Buffer;
  }) => void;
  read: () => {
    primaryBytes: Buffer;
    secondaryBytes: Buffer;
    manifestBytes: Buffer;
  };
}>;

export class InMemoryStrictBlindDurabilityStoreV1
  implements StrictBlindDurabilityStoreV1
{
  private primaryBytes: Buffer | null = null;
  private secondaryBytes: Buffer | null = null;
  private manifestBytes: Buffer | null = null;

  write(input: {
    primaryBytes: Buffer;
    secondaryBytes: Buffer;
    manifestBytes: Buffer;
  }): void {
    this.primaryBytes = Buffer.from(input.primaryBytes);
    this.secondaryBytes = Buffer.from(input.secondaryBytes);
    this.manifestBytes = Buffer.from(input.manifestBytes);
  }

  read(): {
    primaryBytes: Buffer;
    secondaryBytes: Buffer;
    manifestBytes: Buffer;
  } {
    if (!this.primaryBytes || !this.secondaryBytes || !this.manifestBytes) {
      throw new Error("DURABILITY_ARTIFACT_MISSING");
    }
    return {
      primaryBytes: Buffer.from(this.primaryBytes),
      secondaryBytes: Buffer.from(this.secondaryBytes),
      manifestBytes: Buffer.from(this.manifestBytes),
    };
  }

  mutatePrimaryForTest(mutator: (value: Buffer) => Buffer): void {
    if (!this.primaryBytes) throw new Error("DURABILITY_ARTIFACT_MISSING");
    this.primaryBytes = mutator(Buffer.from(this.primaryBytes));
  }

  deletePrimaryForTest(): void {
    this.primaryBytes = null;
  }
}

export function createFilesystemStrictBlindDurabilityStoreV1(
  directory: string,
): StrictBlindDurabilityStoreV1 {
  const primaryPath = resolve(directory, "pre-reveal.primary.json");
  const secondaryPath = resolve(directory, "pre-reveal.secondary.json");
  const manifestPath = resolve(directory, "pre-reveal.manifest.json");

  return {
    write(input) {
      mkdirSync(directory, { recursive: true });
      writeFileSync(primaryPath, input.primaryBytes);
      writeFileSync(secondaryPath, input.secondaryBytes);
      writeFileSync(manifestPath, input.manifestBytes);
    },
    read() {
      return {
        primaryBytes: readFileSync(primaryPath),
        secondaryBytes: readFileSync(secondaryPath),
        manifestBytes: readFileSync(manifestPath),
      };
    },
  };
}

function sha256BytesV1(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalJsonV1(value: unknown): Buffer {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function exactNonEmptyTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    value.normalize("NFC") === value
  );
}

function hasForbiddenTargetFieldV1(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasForbiddenTargetFieldV1);
  return Object.entries(value).some(([key, nested]) => {
    if (
      [
        "targetWord",
        "targetSenseId",
        "targetSenseLabel",
        "targetSenseDefinition",
        "translation",
        "etymology",
        "expectedFunction",
        "expansionChain",
      ].includes(key)
    ) {
      return true;
    }
    return hasForbiddenTargetFieldV1(nested);
  });
}

function exactSourceQueryIsValidV1(
  value: StrictBlindSourceQueryV1,
  sourceTraditionIds: readonly string[],
  searchStages: readonly string[],
): boolean {
  return (
    Object.keys(value).sort().join(",") ===
      "formOrigin,queryForm,sourceTraditionId,stage" &&
    sourceTraditionIds.includes(value.sourceTraditionId) &&
    searchStages.includes(value.stage) &&
    exactNonEmptyTextV1(value.queryForm) &&
    value.formOrigin === "structural_embryo_or_authorized_transform" &&
    !hasForbiddenTargetFieldV1(value)
  );
}

function exactSourceObservationIsValidV1(
  value: StrictBlindSourceObservationV1,
  sourceTraditionIds: readonly string[],
): boolean {
  return (
    Object.keys(value).sort().join(",") ===
      "attestationTruth,gloss,locator,sourceForm,sourceRecordId,sourceTraditionId" &&
    sourceTraditionIds.includes(value.sourceTraditionId) &&
    exactNonEmptyTextV1(value.sourceRecordId) &&
    exactNonEmptyTextV1(value.sourceForm) &&
    exactNonEmptyTextV1(value.gloss) &&
    exactNonEmptyTextV1(value.locator) &&
    ["fact", "inference", "hypothesis", "unknown"].includes(
      value.attestationTruth,
    ) &&
    !hasForbiddenTargetFieldV1(value)
  );
}

function assertFrozenArtifactBytesV1(
  paths: StrictBlindFrozenArtifactPathsV1,
  replicationSlot: string,
): StrictBlindFrozenArtifactIdentityV1 {
  if (!existsSync(paths.preregistrationPath)) {
    throw new Error("PREREGISTRATION_ARTIFACT_MISSING");
  }
  if (!existsSync(paths.workerEnvelopePath)) {
    throw new Error("WORKER_ENVELOPE_ARTIFACT_MISSING");
  }
  const preregistrationBytes = readFileSync(paths.preregistrationPath);
  const workerEnvelopeBytes = readFileSync(paths.workerEnvelopePath);
  const preregistrationSha256 = sha256BytesV1(preregistrationBytes);
  const workerEnvelopeSha256 = sha256BytesV1(workerEnvelopeBytes);
  if (preregistrationSha256 !== paths.expectedPreregistrationSha256) {
    throw new Error("PREREGISTRATION_HASH_MISMATCH");
  }
  if (workerEnvelopeSha256 !== paths.expectedWorkerEnvelopeSha256) {
    throw new Error("WORKER_ENVELOPE_HASH_MISMATCH");
  }

  const preregistration = JSON.parse(preregistrationBytes.toString("utf8")) as {
    experimentId: string;
    status: string;
    sourceUniverse?: {
      traditions?: Array<{ id?: string; permitted?: boolean }>;
    };
    searchPolicy?: {
      orderedStages?: string[];
      forbidden?: string[];
    };
    blindPayloads?: Array<{ replicationSlot?: string; path?: string; rawSha256?: string }>;
  };
  if (
    preregistration.status !== "PREREGISTERED_BEFORE_BLIND_RESEARCH" ||
    !exactNonEmptyTextV1(preregistration.experimentId)
  ) {
    throw new Error("PREREGISTRATION_STATUS_INVALID");
  }
  const sourceTraditionIds = (preregistration.sourceUniverse?.traditions ?? [])
    .filter((item) => item.permitted === true)
    .map((item) => item.id)
    .filter((item): item is string => exactNonEmptyTextV1(item));
  const searchStages = preregistration.searchPolicy?.orderedStages ?? [];
  if (sourceTraditionIds.length !== 3 || searchStages.length !== 5) {
    throw new Error("SOURCE_UNIVERSE_OR_SEARCH_PROTOCOL_INVALID");
  }
  if (!preregistration.searchPolicy?.forbidden?.includes("target lookup")) {
    throw new Error("TARGET_SEARCH_BOUNDARY_MISSING");
  }
  const declaration = (preregistration.blindPayloads ?? []).find(
    (item) => item.replicationSlot === replicationSlot,
  );
  const payloadPath = paths.payloadPaths[replicationSlot];
  if (!declaration || !payloadPath || declaration.path !== payloadPath) {
    throw new Error("PAYLOAD_DECLARATION_MISMATCH");
  }
  const payloadBytes = readFileSync(resolve(paths.root, payloadPath));
  const payloadSha256 = sha256BytesV1(payloadBytes);
  if (
    payloadSha256 !== paths.expectedPayloadSha256[replicationSlot] ||
    payloadSha256 !== declaration.rawSha256
  ) {
    throw new Error("PAYLOAD_HASH_MISMATCH");
  }
  const envelope = JSON.parse(workerEnvelopeBytes.toString("utf8")) as Record<
    string,
    unknown
  >;
  const envelopeText = workerEnvelopeBytes.toString("utf8");
  if (
    hasForbiddenTargetFieldV1(envelope) ||
    envelopeText.includes("targetSenseDefinition") ||
    envelopeText.includes("targetWord")
  ) {
    throw new Error("WORKER_ENVELOPE_TARGET_LEAK");
  }
  const runtimeAuthorization = envelope.runtimeAuthorization as
    | Record<string, unknown>
    | undefined;
  if (
    !runtimeAuthorization ||
    Object.values(runtimeAuthorization).some((value) => value !== false)
  ) {
    throw new Error("PRODUCTION_FIREWALL_INVALID");
  }
  const payload = JSON.parse(payloadBytes.toString("utf8")) as Record<
    string,
    unknown
  >;
  if (hasForbiddenTargetFieldV1(payload)) {
    throw new Error("BLIND_PAYLOAD_TARGET_LEAK");
  }
  if (payload.targetRevealStatus !== "FORBIDDEN_UNTIL_DURABILITY_GATE") {
    throw new Error("REVEAL_GATE_INVALID");
  }
  if (
    payload.experimentId !== preregistration.experimentId ||
    payload.replicationSlot !== replicationSlot ||
    payload.sourceUniverseId !== "open-instrument-m7-common-source-universe-v1" ||
    payload.searchPolicyVersion !== "open-instrument-m7-search-s0-s4-v1" ||
    payload.durabilityPolicyId !== "open-instrument-pre-reveal-durability-gate-v1" ||
    typeof payload.embryo !== "string" ||
    !Array.isArray(payload.voicePath) ||
    !payload.voicePath.every((voice): voice is string => typeof voice === "string")
  ) {
    throw new Error("BLIND_PAYLOAD_IDENTITY_INVALID");
  }
  const envelopeSourceUniverse = envelope.sourceUniverse as
    | { sourcePolicyId?: unknown; traditions?: Array<{ id?: unknown }> }
    | undefined;
  const envelopeSearchPolicy = envelope.searchPolicy as
    | { searchPolicyVersion?: unknown; orderedStages?: unknown }
    | undefined;
  if (
    envelopeSourceUniverse?.sourcePolicyId !==
      "open-instrument-m7-common-source-universe-v1" ||
    JSON.stringify(
      (envelopeSourceUniverse.traditions ?? []).map((tradition) => tradition.id),
    ) !== JSON.stringify(sourceTraditionIds) ||
    envelopeSearchPolicy?.searchPolicyVersion !==
      "open-instrument-m7-search-s0-s4-v1" ||
    JSON.stringify(envelopeSearchPolicy.orderedStages) !==
      JSON.stringify(searchStages)
  ) {
    throw new Error("WORKER_ENVELOPE_PROTOCOL_INVALID");
  }
  return {
    preregistrationSha256,
    workerEnvelopeSha256,
    payloadSha256: { [replicationSlot]: payloadSha256 },
    experimentId: preregistration.experimentId,
    sourcePolicyId: "open-instrument-m7-common-source-universe-v1",
    searchPolicyVersion: "open-instrument-m7-search-s0-s4-v1",
    durabilityPolicyId: "open-instrument-pre-reveal-durability-gate-v1",
    payloadEmbryo: payload.embryo,
    payloadVoicePath: Object.freeze([...payload.voicePath]),
    sourceTraditionIds,
    searchStages,
  };
}

export function verifyStrictBlindFrozenArtifactsV1(
  paths: StrictBlindFrozenArtifactPathsV1,
  replicationSlot: string,
): StrictBlindFrozenArtifactIdentityV1 {
  return assertFrozenArtifactBytesV1(paths, replicationSlot);
}

function buildPreRevealContextV1(
  caseOpaqueId: string,
  payloadSha256: string,
  structuralInput: { embryo: string; voicePath: readonly string[] },
  sourceTraditionIds: readonly string[],
  searchStages: readonly string[],
  queries: StrictBlindSourceQueryV1[],
  observations: StrictBlindSourceObservationV1[],
  unavailableEvents: StrictBlindSourceUnavailableV1[],
  decision: { value: StrictBlindFunctionFreezeV1 | StrictBlindNullFreezeV1 | null },
  contamination: { contaminated: boolean; reasonCode: string | null },
): StrictBlindPreRevealContextV1 {
  const assertNotFrozen = () => {
    if (decision.value) throw new Error("PRE_REVEAL_DECISION_ALREADY_FROZEN");
  };
  return {
    caseOpaqueId,
    payloadSha256,
    structuralInput: Object.freeze({
      embryo: structuralInput.embryo,
      voicePath: Object.freeze([...structuralInput.voicePath]),
    }),
    authorizedSourceTraditionIds: Object.freeze([...sourceTraditionIds]),
    authorizedSearchStages: Object.freeze([...searchStages]),
    recordSourceQuery(query) {
      assertNotFrozen();
      if (!exactSourceQueryIsValidV1(query, sourceTraditionIds, searchStages)) {
        throw new Error("SOURCE_QUERY_OUTSIDE_FROZEN_PROTOCOL");
      }
      queries.push(Object.freeze({ ...query }));
    },
    recordSourceObservation(observation) {
      assertNotFrozen();
      if (!exactSourceObservationIsValidV1(observation, sourceTraditionIds)) {
        throw new Error("SOURCE_OBSERVATION_OUTSIDE_FROZEN_PROTOCOL");
      }
      observations.push(Object.freeze({ ...observation }));
    },
    recordSourceUnavailable(event) {
      assertNotFrozen();
      if (
        Object.keys(event).sort().join(",") !==
          "detail,reasonCode,sourceTraditionId" ||
        !sourceTraditionIds.includes(event.sourceTraditionId) ||
        event.reasonCode !== "SOURCE_UNAVAILABLE" ||
        !exactNonEmptyTextV1(event.detail)
      ) {
        throw new Error("SOURCE_UNAVAILABLE_EVENT_OUTSIDE_FROZEN_PROTOCOL");
      }
      unavailableEvents.push(Object.freeze({ ...event }));
    },
    freezeFunction(value) {
      assertNotFrozen();
      if (
        !exactNonEmptyTextV1(value.statement) ||
        ![
          "operation_process",
          "functional_role",
          "functional_decomposition",
          "semantic_mechanism",
          "lexical_equivalence_only",
        ].includes(value.mechanismType) ||
        typeof value.evidenceBeyondGloss !== "boolean"
      ) {
        throw new Error("FUNCTION_FREEZE_INVALID");
      }
      decision.value = Object.freeze({ kind: "FUNCTION", ...value });
    },
    freezeNull(value) {
      assertNotFrozen();
      if (
        ![
          "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
          "SOURCE_UNAVAILABLE",
          "INSUFFICIENT_AUTHORITY",
        ].includes(value.reasonCode)
      ) {
        throw new Error("NULL_FREEZE_INVALID");
      }
      decision.value = Object.freeze({ ...value });
    },
    markContaminated(reasonCode) {
      if (!exactNonEmptyTextV1(reasonCode)) {
        throw new Error("CONTAMINATION_REASON_INVALID");
      }
      contamination.contaminated = true;
      contamination.reasonCode = reasonCode;
    },
    readTarget() {
      throw new Error("TARGET_REVEAL_NOT_ALLOWED_PRE_REVEAL");
    },
  };
}

function validatePostRevealEvaluationV1(
  evaluation: StrictBlindCorrespondenceEvaluationV1,
): void {
  if (!STRICT_BLIND_REPLICATION_OUTCOME_V1.includes(evaluation.classification)) {
    throw new Error("POST_REVEAL_OUTCOME_INVALID");
  }
  if (!exactNonEmptyTextV1(evaluation.reasonCode)) {
    throw new Error("POST_REVEAL_REASON_INVALID");
  }
  if (
    evaluation.classification === "FUNCTIONAL_CORRESPONDENCE" &&
    (evaluation.targetBinding !== "MATCHED" ||
      !evaluation.functionalMechanism ||
      evaluation.evidenceBeyondGloss !== true ||
      evaluation.structuralRelationStatus === "INSUFFICIENT")
  ) {
    throw new Error("FUNCTIONAL_CORRESPONDENCE_GATE_FAILED");
  }
}

export type RunSyntheticStrictBlindCaseInputV1 = Readonly<{
  mode: "synthetic";
  caseOpaqueId: string;
  replicationSlot: string;
  frozenArtifacts: StrictBlindFrozenArtifactPathsV1;
  structuralInput: Readonly<{ embryo: string; voicePath: readonly string[] }>;
  durabilityStore: StrictBlindDurabilityStoreV1;
  worker: (context: StrictBlindPreRevealContextV1) => void;
  target: Readonly<{
    targetWord: string;
    targetSenseId: string;
    targetSenseLabel: string;
  }>;
  evaluateAfterReveal: (
    input: StrictBlindPostRevealEvaluationInputV1,
  ) => StrictBlindCorrespondenceEvaluationV1;
}>;

export function runStrictBlindSyntheticCaseV1(
  input: RunSyntheticStrictBlindCaseInputV1,
): StrictBlindResultPackageV1 {
  if (input.mode !== "synthetic") {
    throw new Error("REAL_SBR_EXECUTION_LOCKED");
  }
  const frozen = assertFrozenArtifactBytesV1(
    input.frozenArtifacts,
    input.replicationSlot,
  );
  if (
    input.structuralInput.embryo !== frozen.payloadEmbryo ||
    JSON.stringify(input.structuralInput.voicePath) !==
      JSON.stringify(frozen.payloadVoicePath)
  ) {
    throw new Error("STRUCTURAL_INPUT_PAYLOAD_MISMATCH");
  }
  const queries: StrictBlindSourceQueryV1[] = [];
  const observations: StrictBlindSourceObservationV1[] = [];
  const unavailableEvents: StrictBlindSourceUnavailableV1[] = [];
  const decision: {
    value: StrictBlindFunctionFreezeV1 | StrictBlindNullFreezeV1 | null;
  } = { value: null };
  const contamination = { contaminated: false, reasonCode: null as string | null };
  const context = buildPreRevealContextV1(
    input.caseOpaqueId,
    frozen.payloadSha256[input.replicationSlot],
    input.structuralInput,
    frozen.sourceTraditionIds,
    frozen.searchStages,
    queries,
    observations,
    unavailableEvents,
    decision,
    contamination,
  );
  input.worker(context);
  if (!decision.value) throw new Error("PRE_REVEAL_DECISION_MISSING");
  const coveredTraditions = new Set([
    ...queries.map((query) => query.sourceTraditionId),
    ...unavailableEvents.map((event) => event.sourceTraditionId),
  ]);
  if (
    frozen.sourceTraditionIds.some(
      (sourceTraditionId) => !coveredTraditions.has(sourceTraditionId),
    )
  ) {
    throw new Error("SOURCE_COVERAGE_INCOMPLETE");
  }
  const preRevealArtifact = Object.freeze({
    schemaVersion: STRICT_BLIND_REPLICATION_RUNNER_SCHEMA_V1,
    artifactType: "strict_blind_pre_reveal_canonical" as const,
    replicationExperimentId: frozen.experimentId,
    replicationSlot: input.replicationSlot,
    sourcePolicyId: frozen.sourcePolicyId,
    searchPolicyId: frozen.searchPolicyVersion,
    caseOpaqueId: input.caseOpaqueId,
    payloadSha256: frozen.payloadSha256[input.replicationSlot],
    structuralInput: Object.freeze({
      embryo: input.structuralInput.embryo,
      voicePath: Object.freeze([...input.structuralInput.voicePath]),
    }),
    embryoOrder: Object.freeze([input.structuralInput.embryo]),
    sourceQueries: Object.freeze([...queries]),
    sourceObservations: Object.freeze([...observations]),
    sourceUnavailableEvents: Object.freeze([...unavailableEvents]),
    sourceQueryLog: Object.freeze([...queries]),
    acceptedSourceFacts: Object.freeze([...observations]),
    formRelationAnalysis: Object.freeze([]),
    functionCandidates: Object.freeze(
      decision.value?.kind === "FUNCTION" ? [decision.value] : [],
    ),
    alternativeFunctions: Object.freeze([]),
    rejectedInterpretations: Object.freeze([]),
    preRevealNullState:
      decision.value?.kind === "NULL" ? decision.value : null,
    evidenceReferences: Object.freeze(
      observations.map((observation) => observation.sourceRecordId),
    ),
    truthHierarchy: ["FACT", "INFERENCE", "HYPOTHESIS", "UNKNOWN / NULL"] as const,
    claimBoundaries: Object.freeze([
      "research_only",
      "no_production_evidence",
      "no_runtime_authorization",
      "no_historical_derivation_claim",
      "no_cognacy_claim",
      "no_borrowing_claim",
      "no_language_superiority_claim",
      "no_candidate_truth_claim",
      "no_single_winner",
      "user_decides",
      "null_is_valid",
    ]),
    noSingleWinner: true as const,
    userDecides: true as const,
    freezeStatus: "FROZEN" as const,
    createdBeforeTargetReveal: true as const,
    blindnessAttestation: true as const,
    frozenDecision: decision.value,
    contamination: Object.freeze({ ...contamination }),
    targetRevealStatus: "NOT_REQUESTED_AND_NOT_PERFORMED" as const,
    revealGateStatus: "FORBIDDEN_UNTIL_DURABILITY_GATE" as const,
    productionMutationState: "NONE" as const,
  });
  const preRevealBytes = canonicalJsonV1(preRevealArtifact);
  const preRevealArtifactSha256 = sha256BytesV1(preRevealBytes);
  const manifestBytes = canonicalJsonV1({
    schemaVersion: STRICT_BLIND_REPLICATION_RUNNER_SCHEMA_V1,
    caseOpaqueId: input.caseOpaqueId,
    payloadSha256: preRevealArtifact.payloadSha256,
    preRevealArtifactSha256,
    primaryAndSecondaryMustMatchExactly: true,
    targetRevealStatus: "NOT_REQUESTED_AND_NOT_PERFORMED",
    revealGateStatus: "FORBIDDEN_UNTIL_DURABILITY_GATE",
  });
  input.durabilityStore.write({
    primaryBytes: preRevealBytes,
    secondaryBytes: preRevealBytes,
    manifestBytes,
  });
  const durable = input.durabilityStore.read();
  const durableManifest = JSON.parse(durable.manifestBytes.toString("utf8")) as {
    caseOpaqueId?: string;
    payloadSha256?: string;
    preRevealArtifactSha256?: string;
    primaryAndSecondaryMustMatchExactly?: boolean;
    targetRevealStatus?: string;
    revealGateStatus?: string;
  };
  const durability = {
    primaryAndSecondaryMatch: durable.primaryBytes.equals(durable.secondaryBytes),
    manifestMatches:
      JSON.stringify(durableManifest) === JSON.stringify(JSON.parse(manifestBytes.toString("utf8"))),
    hashMatches:
      sha256BytesV1(durable.primaryBytes) === preRevealArtifactSha256 &&
      sha256BytesV1(durable.secondaryBytes) === preRevealArtifactSha256,
    passed: false,
  };
  durability.passed =
    durability.primaryAndSecondaryMatch &&
    durability.manifestMatches &&
    durability.hashMatches &&
    durableManifest.caseOpaqueId === input.caseOpaqueId &&
    durableManifest.payloadSha256 === preRevealArtifact.payloadSha256 &&
    durableManifest.preRevealArtifactSha256 === preRevealArtifactSha256 &&
    durableManifest.primaryAndSecondaryMustMatchExactly === true &&
    durableManifest.targetRevealStatus === "NOT_REQUESTED_AND_NOT_PERFORMED" &&
    durableManifest.revealGateStatus === "FORBIDDEN_UNTIL_DURABILITY_GATE";
  if (!durability.passed) throw new Error("DURABILITY_GATE_FAILED");
  if (contamination.contaminated) {
    return Object.freeze({
      schemaVersion: STRICT_BLIND_REPLICATION_RUNNER_SCHEMA_V1,
      mode: "synthetic",
      caseOpaqueId: input.caseOpaqueId,
      payloadSha256: preRevealArtifact.payloadSha256,
      preRevealArtifact,
      preRevealArtifactSha256,
      durability,
      reveal: { allowed: false, targetRevealed: false },
      postRevealEvaluation: null,
      contamination: { ...contamination },
      productionMutationState: "NONE",
    });
  }
  const evaluation = input.evaluateAfterReveal({
    targetWord: input.target.targetWord,
    targetSenseId: input.target.targetSenseId,
    targetSenseLabel: input.target.targetSenseLabel,
    preRevealArtifact,
  });
  validatePostRevealEvaluationV1(evaluation);
  return Object.freeze({
    schemaVersion: STRICT_BLIND_REPLICATION_RUNNER_SCHEMA_V1,
    mode: "synthetic",
    caseOpaqueId: input.caseOpaqueId,
    payloadSha256: preRevealArtifact.payloadSha256,
    preRevealArtifact,
    preRevealArtifactSha256,
    durability,
    reveal: { allowed: true, targetRevealed: true },
    postRevealEvaluation: evaluation,
    contamination: { contaminated: false, reasonCode: null },
    productionMutationState: "NONE",
  });
}

export function buildStrictBlindReadinessReportV1(
  checks: StrictBlindReadinessCheckV1,
): StrictBlindReadinessReportV1 {
  const ready = Object.values(checks).every(Boolean);
  return {
    status: ready
      ? "READY_FOR_CONTROLLED_STRICT_BLIND_EXECUTION"
      : "NOT_READY_FOR_CONTROLLED_STRICT_BLIND_EXECUTION",
    checks,
  };
}

export function defaultStrictBlindArtifactPathsV1(
  root = process.cwd(),
): StrictBlindFrozenArtifactPathsV1 {
  const artifactRoot = resolve(
    root,
    "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1",
  );
  return {
    root,
    preregistrationPath: resolve(artifactRoot, "preregistration.json"),
    workerEnvelopePath: resolve(artifactRoot, "target-safe-worker-envelope.v1.json"),
    payloadPaths: {
      "SBR-01": "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/blind-payloads/SBR-01.json",
      "SBR-02": "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/blind-payloads/SBR-02.json",
      "SBR-03": "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/blind-payloads/SBR-03.json",
    },
    expectedPreregistrationSha256:
      "ee1baa297a3155a0c0e29afe8c96cc909b7329d49cc1498c0e58cfecd32a4352",
    expectedWorkerEnvelopeSha256:
      "4e9f3d567697a33230886fda7aee61c2d3f6a575aaa20bb06c957a6b537c2e6c",
    expectedPayloadSha256: {
      "SBR-01": "093269e360f3a42348f5c09342b43562bf0313d3c5d92449f847ee4c7fbead08",
      "SBR-02": "54e43efe8e498fc874730dcf6ef2f7b358eb9ca57a67d1e85516614ea102cdb8",
      "SBR-03": "ca58b25ad84241634caf16ff24228d05d485be4b0d00b7536b28b2e49ff5b50d",
    },
  };
}
