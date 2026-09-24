import { createHash } from "node:crypto";
import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Worker } from "node:worker_threads";

import {
  STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_V1,
  STRICT_BLIND_REPLICATION_OUTCOME_V1,
  verifyStrictBlindFrozenArtifactsV1,
  type StrictBlindCorrespondenceEvaluationV1,
  type StrictBlindFrozenArtifactPathsV1,
} from "./strictBlindReplicationRunner.v1";

export const STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1 =
  "open-instrument.strict-blind-runner-integrity.v1" as const;

export const STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1 =
  "SYNTHETIC_TEST_FIXTURE" as const;

export type StrictBlindIntegrityAcquisitionModeV1 =
  | typeof STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1
  | "AUTHORIZED_REAL_SOURCE_RETRIEVAL";

const FORBIDDEN_TARGET_KEYS_V1 = new Set([
  "targetWord",
  "targetSenseId",
  "targetSenseLabel",
  "targetSenseDefinition",
  "translation",
  "etymology",
  "expectedFunction",
  "postRevealEvaluation",
  "controllerIdentity",
]);

export type SyntheticSourceResultV1 =
  | {
      readonly sourceTraditionId: string;
      readonly stage: string;
      readonly queryForm: string;
      readonly result: "FOUND";
      readonly sourceRecordId: string;
      readonly sourceForm: string;
      readonly gloss: string;
      readonly locator: string;
      readonly attestationTruth: "fact";
    }
  | {
      readonly sourceTraditionId: string;
      readonly stage: string;
      readonly queryForm: string;
      readonly result: "NOT_FOUND";
    }
  | {
      readonly sourceTraditionId: string;
      readonly stage: string;
      readonly queryForm: string;
      readonly result: "SOURCE_UNAVAILABLE";
      readonly detail: string;
    };

export type StrictBlindIntegritySourceQueryV1 = Readonly<{
  queryId: string;
  sourceTraditionId: string;
  stage: string;
  queryForm: string;
  formOrigin: "structural_embryo_or_authorized_transform";
  acquisitionMode: StrictBlindIntegrityAcquisitionModeV1;
}>;

export type StrictBlindIntegritySourceObservationV1 = Readonly<{
  queryId: string;
  sourceTraditionId: string;
  sourceRecordId: string;
  sourceForm: string;
  gloss: string;
  locator: string;
  attestationTruth: "fact";
  acquisitionMode: StrictBlindIntegrityAcquisitionModeV1;
}>;

export type StrictBlindIntegritySourceUnavailableV1 = Readonly<{
  queryId: string;
  sourceTraditionId: string;
  stage: string;
  reasonCode: "SOURCE_UNAVAILABLE";
  detail: string;
  acquisitionMode: StrictBlindIntegrityAcquisitionModeV1;
}>;

export type StrictBlindIntegritySyntheticSourceAccessV1 = Readonly<{
  mode: typeof STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1;
  results: readonly SyntheticSourceResultV1[];
}>;

export type StrictBlindIntegritySourceAccessV1 = Readonly<{
  mode: StrictBlindIntegrityAcquisitionModeV1;
  results: readonly SyntheticSourceResultV1[];
}>;

export type StrictBlindIntegrityWorkerDecisionV1 = Readonly<
  | {
      readonly kind: "FUNCTION";
      readonly mechanismType:
        | "operation_process"
        | "functional_role"
        | "functional_decomposition"
        | "semantic_mechanism"
        | "lexical_equivalence_only";
      readonly statement: string;
      readonly evidenceBeyondGloss: boolean;
    }
  | {
      readonly kind: "NULL";
      readonly reasonCode:
        | "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE"
        | "SOURCE_UNAVAILABLE"
        | "INSUFFICIENT_AUTHORITY";
    }
  >;

export type StrictBlindIntegrityWorkerInputV1 = Readonly<{
  caseOpaqueId: string;
  payloadSha256: string;
  structuralInput: Readonly<{
    embryo: string;
    voicePath: readonly string[];
  }>;
  sourceTraditionIds: readonly string[];
  searchStages: readonly string[];
  sourceAccess: StrictBlindIntegritySyntheticSourceAccessV1;
  decision: StrictBlindIntegrityWorkerDecisionV1;
  contaminationReason: string | null;
}>;

type StrictBlindIntegrityWorkerResultV1 = Readonly<{
  queries: readonly StrictBlindIntegritySourceQueryV1[];
  observations: readonly StrictBlindIntegritySourceObservationV1[];
  unavailable: readonly StrictBlindIntegritySourceUnavailableV1[];
  decision: StrictBlindIntegrityWorkerDecisionV1;
  contamination: Readonly<{ contaminated: boolean; reasonCode: string | null }>;
  isolation: Readonly<{
    workerContext: "worker_thread";
    targetFieldsReceived: false;
    crossCaseContextReceived: false;
  }>;
}>;

export type StrictBlindIntegrityAuthorizationArtifactV1 = Readonly<{
  schemaVersion: typeof STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1;
  authorizationId: string;
  executionId: string;
  caseOpaqueId: string;
  mode: "synthetic";
  realExecutionAuthorized: false;
}>;

export type StrictBlindIntegrityAuthorizationStateV1 =
  | "GRANTED"
  | "ATOMICALLY_CONSUMED"
  | "EXECUTING"
  | "COMPLETED"
  | "FAILED";

export type StrictBlindIntegrityAuthorizationSnapshotV1 = Readonly<{
  artifact: StrictBlindIntegrityAuthorizationArtifactV1;
  state: StrictBlindIntegrityAuthorizationStateV1;
  token: string | null;
}>;

export type StrictBlindIntegrityEvaluationInputV1 = Readonly<{
  targetWord: string;
  targetSenseId: string;
  targetSenseLabel: string;
  preRevealArtifact: Readonly<Record<string, unknown>>;
}>;

export type StrictBlindIntegritySyntheticCaseInputV1 = Readonly<{
  replicationSlot: string;
  caseOpaqueId: string;
  frozenArtifacts: StrictBlindFrozenArtifactPathsV1;
  structuralInput: Readonly<{ embryo: string; voicePath: readonly string[] }>;
  sourceAccess: StrictBlindIntegritySyntheticSourceAccessV1;
  artifactDirectory: string;
  workerDecision: StrictBlindIntegrityWorkerDecisionV1;
  contaminationReason?: string | null;
  target: Readonly<{
    targetWord: string;
    targetSenseId: string;
    targetSenseLabel: string;
  }>;
  evaluateAfterReveal: (
    input: StrictBlindIntegrityEvaluationInputV1,
  ) => StrictBlindCorrespondenceEvaluationV1;
}>;

export type StrictBlindIntegrityResultPackageV1 = Readonly<{
  schemaVersion: typeof STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1;
  packageType: "SYNTHETIC_ONLY_RESEARCH_INTEGRITY";
  replicationSlot: string;
  caseOpaqueId: string;
  frozenIdentity: Readonly<{
    preregistrationSha256: string;
    workerEnvelopeSha256: string;
    payloadSha256: string;
  }>;
  authorization: StrictBlindIntegrityAuthorizationSnapshotV1;
  workerIsolation: StrictBlindIntegrityWorkerResultV1["isolation"];
  sourceAccess: Readonly<{
    acquisitionMode: typeof STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1;
    queryCount: number;
    observationCount: number;
    unavailableCount: number;
  }>;
  preRevealArtifactSha256: string;
  durability: Readonly<{
    primaryAndSecondaryMatch: true;
    manifestMatches: true;
    hashMatches: true;
    independentlyRecovered: true;
  }>;
  reveal: Readonly<{ allowed: true; targetRevealed: true }>;
  targetReveal: Readonly<{
    targetWord: string;
    targetSenseId: string;
    targetSenseLabel: string;
  }>;
  postRevealEvaluation: StrictBlindCorrespondenceEvaluationV1;
  productionMutationState: "NONE";
  providerCalls: 0;
}>;

type StrictBlindIntegrityManifestV1 = Readonly<{
  schemaVersion: typeof STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1;
  caseOpaqueId: string;
  payloadSha256: string;
  preRevealArtifactSha256: string;
  primarySha256: string;
  secondarySha256: string;
  targetRevealStatus: "NOT_REQUESTED_AND_NOT_PERFORMED";
  revealGateStatus: "FORBIDDEN_UNTIL_DURABILITY_GATE";
  postRevealRewrite: "FORBIDDEN";
}>;

const WORKER_SOURCE_V1 = `
const { parentPort } = require("node:worker_threads");
const forbidden = new Set(${JSON.stringify([...FORBIDDEN_TARGET_KEYS_V1])});
function hasForbidden(value) {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasForbidden);
  return Object.entries(value).some(([key, nested]) => forbidden.has(key) || hasForbidden(nested));
}
function queryId(sourceTraditionId, stage, queryForm) {
  return [sourceTraditionId, stage, queryForm].join("|");
}
parentPort.once("message", (input) => {
  try {
    if (hasForbidden(input)) throw new Error("WORKER_TARGET_INPUT_LEAK");
    if (input.sourceAccess.mode !== "SYNTHETIC_TEST_FIXTURE") {
      throw new Error("REAL_SOURCE_ACQUISITION_NOT_AUTHORIZED_IN_REPAIR");
    }
    const queries = [];
    const observations = [];
    const unavailable = [];
    for (const result of input.sourceAccess.results) {
      const id = queryId(result.sourceTraditionId, result.stage, result.queryForm);
      queries.push({
        queryId: id,
        sourceTraditionId: result.sourceTraditionId,
        stage: result.stage,
        queryForm: result.queryForm,
        formOrigin: "structural_embryo_or_authorized_transform",
        acquisitionMode: "SYNTHETIC_TEST_FIXTURE",
      });
      if (result.result === "FOUND") {
        observations.push({
          queryId: id,
          sourceTraditionId: result.sourceTraditionId,
          sourceRecordId: result.sourceRecordId,
          sourceForm: result.sourceForm,
          gloss: result.gloss,
          locator: result.locator,
          attestationTruth: "fact",
          acquisitionMode: "SYNTHETIC_TEST_FIXTURE",
        });
      } else if (result.result === "SOURCE_UNAVAILABLE") {
        unavailable.push({
          queryId: id,
          sourceTraditionId: result.sourceTraditionId,
          stage: result.stage,
          reasonCode: "SOURCE_UNAVAILABLE",
          detail: result.detail,
          acquisitionMode: "SYNTHETIC_TEST_FIXTURE",
        });
      }
    }
    parentPort.postMessage({
      queries,
      observations,
      unavailable,
      decision: input.decision,
      contamination: {
        contaminated: Boolean(input.contaminationReason),
        reasonCode: input.contaminationReason || null,
      },
      isolation: {
        workerContext: "worker_thread",
        targetFieldsReceived: false,
        crossCaseContextReceived: false,
      },
    });
  } catch (error) {
    parentPort.postMessage({ error: error instanceof Error ? error.message : String(error) });
  }
});
`;

function sha256V1(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

function canonicalJsonV1(value: unknown): Buffer {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function hasForbiddenTargetFieldV1(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  if (Array.isArray(value)) return value.some(hasForbiddenTargetFieldV1);
  return Object.entries(value).some(
    ([key, nested]) => FORBIDDEN_TARGET_KEYS_V1.has(key) || hasForbiddenTargetFieldV1(nested),
  );
}

function exactTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    value.normalize("NFC") === value
  );
}

function assertSyntheticSourceAccessV1(
  access: StrictBlindIntegritySyntheticSourceAccessV1,
  sourceTraditionIds: readonly string[],
  searchStages: readonly string[],
): void {
  if (access.mode !== STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1) {
    throw new Error("REAL_SOURCE_ACQUISITION_NOT_AUTHORIZED_IN_REPAIR");
  }
  for (const result of access.results) {
    if (
      !sourceTraditionIds.includes(result.sourceTraditionId) ||
      !searchStages.includes(result.stage) ||
      !exactTextV1(result.queryForm) ||
      hasForbiddenTargetFieldV1(result)
    ) {
      throw new Error("SOURCE_ACCESS_OUTSIDE_FROZEN_PROTOCOL");
    }
    if (result.result === "FOUND") {
      if (
        !exactTextV1(result.sourceRecordId) ||
        !exactTextV1(result.sourceForm) ||
        !exactTextV1(result.gloss) ||
        !exactTextV1(result.locator) ||
        result.attestationTruth !== "fact"
      ) {
        throw new Error("SOURCE_FACT_INVALID");
      }
    }
    if (result.result === "SOURCE_UNAVAILABLE" && !exactTextV1(result.detail)) {
      throw new Error("SOURCE_UNAVAILABLE_DETAIL_INVALID");
    }
  }
}

function assertCompleteCoverageV1(
  queries: readonly StrictBlindIntegritySourceQueryV1[],
  unavailable: readonly StrictBlindIntegritySourceUnavailableV1[],
  sourceTraditionIds: readonly string[],
  searchStages: readonly string[],
): void {
  const keys = new Set(
    [...queries, ...unavailable].map((entry) => `${entry.sourceTraditionId}|${entry.stage}`),
  );
  for (const sourceTraditionId of sourceTraditionIds) {
    for (const stage of searchStages) {
      if (!keys.has(`${sourceTraditionId}|${stage}`)) {
        throw new Error("SOURCE_QUERY_COVERAGE_INCOMPLETE");
      }
    }
  }
}

function assertEvaluationV1(evaluation: StrictBlindCorrespondenceEvaluationV1): void {
  if (
    !evaluation ||
    !STRICT_BLIND_REPLICATION_OUTCOME_V1.includes(evaluation.classification) ||
    !["MATCHED", "FAILED", "NOT_EVALUATED"].includes(evaluation.targetBinding) ||
    !["SEPARATE", "NONE", "INSUFFICIENT"].includes(evaluation.structuralRelationStatus) ||
    typeof evaluation.reasonCode !== "string" ||
    typeof evaluation.evidenceBeyondGloss !== "boolean" ||
    (evaluation.functionalMechanism !== null &&
      typeof evaluation.functionalMechanism !== "string")
  ) {
    throw new Error("POST_REVEAL_EVALUATION_ENUM_INVALID");
  }
  if (!evaluation.reasonCode.trim()) throw new Error("POST_REVEAL_REASON_INVALID");
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

export function initializeStrictBlindIntegrityAuthorizationV1(
  directory: string,
  artifact: StrictBlindIntegrityAuthorizationArtifactV1,
): void {
  mkdirSync(directory, { recursive: true });
  writeFileSync(join(directory, "authorization.json"), canonicalJsonV1(artifact), { flag: "wx" });
  writeFileSync(join(directory, "state.json"), canonicalJsonV1({ state: "GRANTED" }), { flag: "wx" });
}

export class StrictBlindIntegrityAuthorizationStoreV1 {
  constructor(private readonly directory: string) {}

  private readArtifact(): StrictBlindIntegrityAuthorizationArtifactV1 {
    return JSON.parse(readFileSync(join(this.directory, "authorization.json"), "utf8")) as StrictBlindIntegrityAuthorizationArtifactV1;
  }

  private readState(): StrictBlindIntegrityAuthorizationStateV1 {
    return (JSON.parse(readFileSync(join(this.directory, "state.json"), "utf8")) as { state: StrictBlindIntegrityAuthorizationStateV1 }).state;
  }

  private writeState(state: StrictBlindIntegrityAuthorizationStateV1): void {
    const tempPath = join(this.directory, `state.${process.pid}.${Date.now()}.tmp`);
    writeFileSync(tempPath, canonicalJsonV1({ state }));
    renameSync(tempPath, join(this.directory, "state.json"));
  }

  consume(expectedCaseOpaqueId: string): string {
    const artifact = this.readArtifact();
    if (artifact.mode !== "synthetic" || artifact.realExecutionAuthorized !== false) {
      throw new Error("REAL_EXECUTION_AUTHORIZATION_REQUIRED");
    }
    if (artifact.caseOpaqueId !== expectedCaseOpaqueId) {
      throw new Error("AUTHORIZATION_SCOPE_MISMATCH");
    }
    if (existsSync(join(this.directory, "consumed.token"))) {
      throw new Error("AUTHORIZATION_ALREADY_CONSUMED");
    }
    if (this.readState() !== "GRANTED") throw new Error("AUTHORIZATION_NOT_GRANTABLE");
    const token = sha256V1(canonicalJsonV1(artifact));
    let fd: number;
    try {
      fd = openSync(join(this.directory, "consumed.token"), "wx");
    } catch {
      throw new Error("AUTHORIZATION_ALREADY_CONSUMED");
    }
    try {
      writeFileSync(fd, `${token}\n`);
    } finally {
      closeSync(fd);
    }
    this.writeState("ATOMICALLY_CONSUMED");
    return token;
  }

  transition(token: string, next: "EXECUTING" | "COMPLETED" | "FAILED"): void {
    const storedToken = readFileSync(join(this.directory, "consumed.token"), "utf8").trim();
    if (storedToken !== token) throw new Error("AUTHORIZATION_TOKEN_MISMATCH");
    const current = this.readState();
    const allowed =
      (current === "ATOMICALLY_CONSUMED" && next === "EXECUTING") ||
      (current === "EXECUTING" && (next === "COMPLETED" || next === "FAILED"));
    if (!allowed) throw new Error("AUTHORIZATION_STATE_TRANSITION_INVALID");
    this.writeState(next);
  }

  snapshot(): StrictBlindIntegrityAuthorizationSnapshotV1 {
    const artifact = this.readArtifact();
    const tokenPath = join(this.directory, "consumed.token");
    return {
      artifact,
      state: this.readState(),
      token: existsSync(tokenPath) ? readFileSync(tokenPath, "utf8").trim() : null,
    };
  }
}

export function createStrictBlindIntegrityTempDirectoryV1(prefix = "open-instrument-strict-blind-"): string {
  const directory = join(tmpdir(), `${prefix}${process.pid}-${Date.now()}`);
  mkdirSync(directory, { recursive: true });
  return directory;
}

async function runIsolatedWorkerV1(
  input: StrictBlindIntegrityWorkerInputV1,
): Promise<StrictBlindIntegrityWorkerResultV1> {
  if (hasForbiddenTargetFieldV1(input)) throw new Error("WORKER_TARGET_INPUT_LEAK");
  return new Promise((resolve, reject) => {
    const worker = new Worker(WORKER_SOURCE_V1, { eval: true });
    const finish = (callback: () => void) => {
      void worker.terminate();
      callback();
    };
    worker.once("message", (message: StrictBlindIntegrityWorkerResultV1 | { error?: string }) => {
      if (!("queries" in message)) {
        finish(() => reject(new Error(message.error ?? "WORKER_RESULT_INVALID")));
        return;
      }
      finish(() => resolve(message));
    });
    worker.once("error", (error) => finish(() => reject(error)));
    worker.postMessage(input);
  });
}

function writeAtomicV1(path: string, bytes: Buffer): void {
  const temporary = `${path}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(temporary, bytes, { flag: "wx" });
  renameSync(temporary, path);
}

export function writeStrictBlindIntegrityPreRevealV1(
  directory: string,
  input: Readonly<{
    caseOpaqueId: string;
    payloadSha256: string;
    artifact: Readonly<Record<string, unknown>>;
  }>,
): Readonly<{ preRevealArtifactSha256: string; manifest: StrictBlindIntegrityManifestV1 }> {
  mkdirSync(directory, { recursive: true });
  const primaryPath = join(directory, "pre-reveal.primary.json");
  const secondaryPath = join(directory, "pre-reveal.secondary.json");
  const manifestPath = join(directory, "pre-reveal.manifest.json");
  const finalizedPath = join(directory, "pre-reveal.finalized");
  if (existsSync(finalizedPath)) throw new Error("PRE_REVEAL_ALREADY_FINALIZED");
  if (hasForbiddenTargetFieldV1(input.artifact)) throw new Error("PRE_REVEAL_TARGET_LEAK");
  const bytes = canonicalJsonV1(input.artifact);
  const artifactSha256 = sha256V1(bytes);
  const manifest: StrictBlindIntegrityManifestV1 = {
    schemaVersion: STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1,
    caseOpaqueId: input.caseOpaqueId,
    payloadSha256: input.payloadSha256,
    preRevealArtifactSha256: artifactSha256,
    primarySha256: sha256V1(bytes),
    secondarySha256: sha256V1(bytes),
    targetRevealStatus: "NOT_REQUESTED_AND_NOT_PERFORMED",
    revealGateStatus: "FORBIDDEN_UNTIL_DURABILITY_GATE",
    postRevealRewrite: "FORBIDDEN",
  };
  writeAtomicV1(primaryPath, bytes);
  writeAtomicV1(secondaryPath, bytes);
  writeAtomicV1(manifestPath, canonicalJsonV1(manifest));
  writeFileSync(finalizedPath, `${artifactSha256}\n`, { flag: "wx" });
  return { preRevealArtifactSha256: artifactSha256, manifest };
}

export function recoverStrictBlindIntegrityPreRevealV1(
  directory: string,
): Readonly<{
  artifact: Readonly<Record<string, unknown>>;
  manifest: StrictBlindIntegrityManifestV1;
  proof: Readonly<{
    primaryAndSecondaryMatch: true;
    manifestMatches: true;
    hashMatches: true;
    independentlyRecovered: true;
  }>;
}> {
  const primaryBytes = readFileSync(join(directory, "pre-reveal.primary.json"));
  const secondaryBytes = readFileSync(join(directory, "pre-reveal.secondary.json"));
  const manifestBytes = readFileSync(join(directory, "pre-reveal.manifest.json"));
  let manifest: StrictBlindIntegrityManifestV1;
  let artifact: Readonly<Record<string, unknown>>;
  try {
    manifest = JSON.parse(manifestBytes.toString("utf8")) as StrictBlindIntegrityManifestV1;
    artifact = JSON.parse(primaryBytes.toString("utf8")) as Readonly<Record<string, unknown>>;
  } catch {
    throw new Error("PRE_REVEAL_DURABILITY_RECOVERY_FAILED");
  }
  const expectedManifest = JSON.parse(canonicalJsonV1(manifest).toString("utf8"));
  if (
    hasForbiddenTargetFieldV1(artifact) ||
    !primaryBytes.equals(secondaryBytes) ||
    JSON.stringify(manifest) !== JSON.stringify(expectedManifest) ||
    sha256V1(primaryBytes) !== manifest.preRevealArtifactSha256 ||
    sha256V1(primaryBytes) !== manifest.primarySha256 ||
    sha256V1(secondaryBytes) !== manifest.secondarySha256 ||
    manifest.targetRevealStatus !== "NOT_REQUESTED_AND_NOT_PERFORMED" ||
    manifest.revealGateStatus !== "FORBIDDEN_UNTIL_DURABILITY_GATE" ||
    manifest.postRevealRewrite !== "FORBIDDEN"
  ) {
    throw new Error("PRE_REVEAL_DURABILITY_RECOVERY_FAILED");
  }
  return {
    artifact,
    manifest,
    proof: {
      primaryAndSecondaryMatch: true,
      manifestMatches: true,
      hashMatches: true,
      independentlyRecovered: true,
    },
  };
}

function buildIntegrityPreRevealArtifactV1(
  frozen: ReturnType<typeof verifyStrictBlindFrozenArtifactsV1>,
  input: StrictBlindIntegritySyntheticCaseInputV1,
  worker: StrictBlindIntegrityWorkerResultV1,
): Readonly<Record<string, unknown>> {
  return {
    schemaVersion: STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1,
    artifactType: "strict_blind_pre_reveal_canonical",
    replicationExperimentId: "open-instrument-strict-blind-embryo-first-replication-series-v1",
    replicationSlot: input.replicationSlot,
    caseOpaqueId: input.caseOpaqueId,
    payloadSha256: frozen.payloadSha256[input.replicationSlot],
    structuralInput: input.structuralInput,
    embryoOrder: [input.structuralInput.embryo],
    sourceQueries: worker.queries,
    sourceObservations: worker.observations,
    sourceUnavailableEvents: worker.unavailable,
    sourceAcquisitionMode: STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1,
    functionFreeze: worker.decision,
    contamination: worker.contamination,
    targetRevealStatus: "NOT_REQUESTED_AND_NOT_PERFORMED",
    revealGateStatus: "FORBIDDEN_UNTIL_DURABILITY_GATE",
    noSingleWinner: true,
    userDecides: true,
    freezeStatus: "FROZEN",
    createdBeforeTargetReveal: true,
    blindnessAttestation: true,
    productionMutationState: "NONE",
    providerCalls: 0,
  };
}

function assertRecoveredSourceContractV1(
  artifact: Readonly<Record<string, unknown>>,
  frozen: ReturnType<typeof verifyStrictBlindFrozenArtifactsV1>,
): void {
  if (artifact.sourceAcquisitionMode !== STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1) {
    throw new Error("SOURCE_ACQUISITION_MODE_INVALID");
  }
  const queries = Array.isArray(artifact.sourceQueries)
    ? artifact.sourceQueries as StrictBlindIntegritySourceQueryV1[]
    : [];
  const observations = Array.isArray(artifact.sourceObservations)
    ? artifact.sourceObservations as StrictBlindIntegritySourceObservationV1[]
    : [];
  const unavailable = Array.isArray(artifact.sourceUnavailableEvents)
    ? artifact.sourceUnavailableEvents as StrictBlindIntegritySourceUnavailableV1[]
    : [];
  for (const query of queries) {
    if (
      Object.keys(query).sort().join(",") !==
        "acquisitionMode,formOrigin,queryForm,queryId,sourceTraditionId,stage" ||
      query.acquisitionMode !== STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1 ||
      query.formOrigin !== "structural_embryo_or_authorized_transform" ||
      !frozen.sourceTraditionIds.includes(query.sourceTraditionId) ||
      !frozen.searchStages.includes(query.stage) ||
      query.queryId !== `${query.sourceTraditionId}|${query.stage}|${query.queryForm}` ||
      !exactTextV1(query.queryForm)
    ) {
      throw new Error("SOURCE_QUERY_PROVENANCE_INVALID");
    }
  }
  for (const observation of observations) {
    if (
      Object.keys(observation).sort().join(",") !==
        "acquisitionMode,attestationTruth,gloss,locator,queryId,sourceForm,sourceRecordId,sourceTraditionId" ||
      observation.acquisitionMode !== STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1 ||
      observation.attestationTruth !== "fact" ||
      !frozen.sourceTraditionIds.includes(observation.sourceTraditionId) ||
      !exactTextV1(observation.queryId) ||
      !exactTextV1(observation.sourceRecordId) ||
      !exactTextV1(observation.sourceForm) ||
      !exactTextV1(observation.gloss) ||
      !exactTextV1(observation.locator)
    ) {
      throw new Error("SOURCE_OBSERVATION_PROVENANCE_INVALID");
    }
  }
  for (const event of unavailable) {
    const queryPrefix = `${event.sourceTraditionId}|${event.stage}|`;
    if (
      Object.keys(event).sort().join(",") !==
        "acquisitionMode,detail,queryId,reasonCode,sourceTraditionId,stage" ||
      event.acquisitionMode !== STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1 ||
      event.reasonCode !== "SOURCE_UNAVAILABLE" ||
      !frozen.sourceTraditionIds.includes(event.sourceTraditionId) ||
      !frozen.searchStages.includes(event.stage) ||
      !event.queryId.startsWith(queryPrefix) ||
      !exactTextV1(event.queryId.slice(queryPrefix.length)) ||
      !exactTextV1(event.detail)
    ) {
      throw new Error("SOURCE_UNAVAILABLE_PROVENANCE_INVALID");
    }
  }
  assertCompleteCoverageV1(queries, unavailable, frozen.sourceTraditionIds, frozen.searchStages);
}

export async function runStrictBlindIntegritySyntheticCaseV1(
  input: StrictBlindIntegritySyntheticCaseInputV1,
): Promise<StrictBlindIntegrityResultPackageV1> {
  if (STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_V1) {
    throw new Error("REAL_EXECUTION_LOCK_CONFIGURATION_INVALID");
  }
  if (input.sourceAccess.mode !== STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1) {
    throw new Error("REAL_SOURCE_ACQUISITION_NOT_AUTHORIZED_IN_REPAIR");
  }
  const frozen = verifyStrictBlindFrozenArtifactsV1(input.frozenArtifacts, input.replicationSlot);
  assertSyntheticSourceAccessV1(
    input.sourceAccess,
    frozen.sourceTraditionIds,
    frozen.searchStages,
  );
  const durabilityDirectory = input.artifactDirectory;
  const authorizationDirectory = join(durabilityDirectory, "authorization");
  const authorizationArtifact: StrictBlindIntegrityAuthorizationArtifactV1 = {
    schemaVersion: STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1,
    authorizationId: `synthetic.${input.caseOpaqueId}`,
    executionId: `synthetic.${input.caseOpaqueId}`,
    caseOpaqueId: input.caseOpaqueId,
    mode: "synthetic",
    realExecutionAuthorized: false,
  };
  initializeStrictBlindIntegrityAuthorizationV1(authorizationDirectory, authorizationArtifact);
  const authorization = new StrictBlindIntegrityAuthorizationStoreV1(authorizationDirectory);
  const token = authorization.consume(input.caseOpaqueId);
  authorization.transition(token, "EXECUTING");
  const workerInput: StrictBlindIntegrityWorkerInputV1 = {
    caseOpaqueId: input.caseOpaqueId,
    payloadSha256: frozen.payloadSha256[input.replicationSlot],
    structuralInput: input.structuralInput,
    sourceTraditionIds: frozen.sourceTraditionIds,
    searchStages: frozen.searchStages,
    sourceAccess: input.sourceAccess,
    decision: input.workerDecision,
    contaminationReason: input.contaminationReason ?? null,
  };
  const worker = await runIsolatedWorkerV1(workerInput);
  if (worker.isolation.targetFieldsReceived || worker.isolation.crossCaseContextReceived) {
    authorization.transition(token, "FAILED");
    throw new Error("WORKER_ISOLATION_FAILED");
  }
  assertCompleteCoverageV1(
    worker.queries,
    worker.unavailable,
    frozen.sourceTraditionIds,
    frozen.searchStages,
  );
  const preRevealArtifact = buildIntegrityPreRevealArtifactV1(frozen, input, worker);
  const durability = writeStrictBlindIntegrityPreRevealV1(durabilityDirectory, {
    caseOpaqueId: input.caseOpaqueId,
    payloadSha256: frozen.payloadSha256[input.replicationSlot],
    artifact: preRevealArtifact,
  });
  const recovered = recoverStrictBlindIntegrityPreRevealV1(durabilityDirectory);
  if (recovered.manifest.preRevealArtifactSha256 !== durability.preRevealArtifactSha256) {
    authorization.transition(token, "FAILED");
    throw new Error("PRE_REVEAL_HASH_MISMATCH");
  }
  if (worker.contamination.contaminated) {
    authorization.transition(token, "FAILED");
    throw new Error("CONTAMINATION_BLOCKS_REVEAL");
  }
  const evaluation = input.evaluateAfterReveal({
    targetWord: input.target.targetWord,
    targetSenseId: input.target.targetSenseId,
    targetSenseLabel: input.target.targetSenseLabel,
    preRevealArtifact: recovered.artifact,
  });
  assertEvaluationV1(evaluation);
  const postRevealPath = join(durabilityDirectory, "post-reveal.json");
  writeFileSync(
    postRevealPath,
    canonicalJsonV1({
      targetReveal: input.target,
      evaluation,
      preRevealArtifactSha256: durability.preRevealArtifactSha256,
    }),
    { flag: "wx" },
  );
  authorization.transition(token, "COMPLETED");
  const packageValue: StrictBlindIntegrityResultPackageV1 = {
    schemaVersion: STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1,
    packageType: "SYNTHETIC_ONLY_RESEARCH_INTEGRITY",
    replicationSlot: input.replicationSlot,
    caseOpaqueId: input.caseOpaqueId,
    frozenIdentity: {
      preregistrationSha256: frozen.preregistrationSha256,
      workerEnvelopeSha256: frozen.workerEnvelopeSha256,
      payloadSha256: frozen.payloadSha256[input.replicationSlot],
    },
    authorization: authorization.snapshot(),
    workerIsolation: worker.isolation,
    sourceAccess: {
      acquisitionMode: STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1,
      queryCount: worker.queries.length,
      observationCount: worker.observations.length,
      unavailableCount: worker.unavailable.length,
    },
    preRevealArtifactSha256: durability.preRevealArtifactSha256,
    durability: recovered.proof,
    reveal: { allowed: true, targetRevealed: true },
    targetReveal: input.target,
    postRevealEvaluation: evaluation,
    productionMutationState: "NONE",
    providerCalls: 0,
  };
  writeFileSync(join(durabilityDirectory, "result-package.json"), canonicalJsonV1(packageValue), { flag: "wx" });
  const verification = verifyStrictBlindIntegrityPackageV1({
    packagePath: join(durabilityDirectory, "result-package.json"),
    durabilityDirectory,
    authorizationDirectory,
    frozenArtifacts: input.frozenArtifacts,
    replicationSlot: input.replicationSlot,
  });
  if (verification.status !== "PASS") throw new Error("STANDALONE_VERIFICATION_FAILED");
  return packageValue;
}

export function verifyStrictBlindIntegrityPackageV1(input: Readonly<{
  packagePath: string;
  durabilityDirectory: string;
  authorizationDirectory: string;
  frozenArtifacts: StrictBlindFrozenArtifactPathsV1;
  replicationSlot: string;
}>): Readonly<{ status: "PASS"; productionMutationState: "NONE"; providerCalls: 0 }> {
  const packageValue = JSON.parse(readFileSync(input.packagePath, "utf8")) as StrictBlindIntegrityResultPackageV1;
  const frozen = verifyStrictBlindFrozenArtifactsV1(input.frozenArtifacts, input.replicationSlot);
  const recovered = recoverStrictBlindIntegrityPreRevealV1(input.durabilityDirectory);
  const authorization = new StrictBlindIntegrityAuthorizationStoreV1(input.authorizationDirectory).snapshot();
  const postReveal = JSON.parse(
    readFileSync(join(input.durabilityDirectory, "post-reveal.json"), "utf8"),
  ) as {
    targetReveal?: unknown;
    evaluation?: StrictBlindCorrespondenceEvaluationV1;
    preRevealArtifactSha256?: string;
  };
  const recoveredQueries = Array.isArray(recovered.artifact.sourceQueries)
    ? recovered.artifact.sourceQueries
    : [];
  const recoveredObservations = Array.isArray(recovered.artifact.sourceObservations)
    ? recovered.artifact.sourceObservations
    : [];
  const recoveredUnavailable = Array.isArray(recovered.artifact.sourceUnavailableEvents)
    ? recovered.artifact.sourceUnavailableEvents
    : [];
  assertRecoveredSourceContractV1(recovered.artifact, frozen);
  if (
    packageValue.schemaVersion !== STRICT_BLIND_RUNNER_INTEGRITY_SCHEMA_V1 ||
    packageValue.packageType !== "SYNTHETIC_ONLY_RESEARCH_INTEGRITY" ||
    packageValue.replicationSlot !== input.replicationSlot ||
    packageValue.caseOpaqueId !== recovered.artifact.caseOpaqueId ||
    recovered.artifact.replicationSlot !== input.replicationSlot ||
    packageValue.frozenIdentity.preregistrationSha256 !== frozen.preregistrationSha256 ||
    packageValue.frozenIdentity.workerEnvelopeSha256 !== frozen.workerEnvelopeSha256 ||
    packageValue.frozenIdentity.payloadSha256 !== frozen.payloadSha256[input.replicationSlot] ||
    packageValue.authorization.state !== "COMPLETED" ||
    authorization.state !== "COMPLETED" ||
    JSON.stringify(packageValue.authorization.artifact) !== JSON.stringify(authorization.artifact) ||
    packageValue.authorization.token !== authorization.token ||
    packageValue.workerIsolation.workerContext !== "worker_thread" ||
    packageValue.workerIsolation.targetFieldsReceived !== false ||
    packageValue.workerIsolation.crossCaseContextReceived !== false ||
    packageValue.sourceAccess.acquisitionMode !== STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1 ||
    packageValue.sourceAccess.queryCount !== recoveredQueries.length ||
    packageValue.sourceAccess.observationCount !== recoveredObservations.length ||
    packageValue.sourceAccess.unavailableCount !== recoveredUnavailable.length ||
    packageValue.durability.independentlyRecovered !== true ||
    packageValue.reveal.allowed !== true ||
    packageValue.reveal.targetRevealed !== true ||
    packageValue.productionMutationState !== "NONE" ||
    packageValue.providerCalls !== 0 ||
    packageValue.preRevealArtifactSha256 !== recovered.manifest.preRevealArtifactSha256 ||
    postReveal.preRevealArtifactSha256 !== packageValue.preRevealArtifactSha256 ||
    JSON.stringify(postReveal.targetReveal) !== JSON.stringify(packageValue.targetReveal) ||
    JSON.stringify(postReveal.evaluation) !== JSON.stringify(packageValue.postRevealEvaluation) ||
    hasForbiddenTargetFieldV1(recovered.artifact)
  ) {
    throw new Error("STRICT_BLIND_INTEGRITY_PACKAGE_INVALID");
  }
  assertEvaluationV1(packageValue.postRevealEvaluation);
  return { status: "PASS", productionMutationState: "NONE", providerCalls: 0 };
}

export const STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_INTEGRITY_V1 = false as const;
