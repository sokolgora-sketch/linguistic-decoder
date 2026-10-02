import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

import {
  buildP4ScheduleV0_1C,
  evaluateP4AggregateAcceptanceV0_1C,
  evaluateP4FixtureAcceptanceV0_1C,
  generateP4FixtureV0_1C,
  P4_V0_1C_ACCEPTANCE_VERSION,
  P4_V0_1C_CONTRACT_ID,
  P4_V0_1C_EXPERIMENT_ID,
  P4_V0_1C_FIXTURE_VERSION,
  P4_V0_1C_HASH_MANIFEST_SHA256,
  P4_V0_1C_HUMAN_CONTRACT_SHA256,
  P4_V0_1C_MACHINE_CONTRACT_SHA256,
  P4_V0_1C_SCHEDULE_VERSION,
  P4_V0_1C_TOTAL_EVALUATIONS,
  type P4AggregateAcceptanceV0_1C,
  type P4ScheduleEntryV0_1C,
  type P4ScheduledResultV0_1C,
} from "../src/shared/openInstrument/frd02CvcP4Implementation.v0_1c";
import {
  ANALYZER_CONTRACT_SHA256_V0_1B,
  AMENDED_CONTRACT_SHA256_V0_1B,
  P4_FIXTURE_CORRECTION_MACHINE_SHA256_V0_1_1,
  GENERATOR_CONTRACT_SHA256_V0_1B,
  P4_HUMAN_CONTRACT_SHA256_V0_1B,
  P4_MACHINE_CONTRACT_SHA256_V0_1B,
  P4_P1_P2_CORRECTION_MACHINE_SHA256_V0_1,
  P4_SUBCASE_ALLOCATION_CONTRACT_ID_V0_1,
  P4_SUBCASE_ALLOCATION_HUMAN_SHA256_V0_1,
  P4_SUBCASE_ALLOCATION_MACHINE_SHA256_V0_1,
  P4_MASTER_SEED_V0_1B,
  P4_PERMUTATION_STREAM_ID_V0_1B,
  P4_REPLICATE_IDS_V0_1B,
  P4_REPLICATES_PER_FIXTURE_V0_1B,
  runP4ReplicateV0_1B,
  serializeP4CanonicalV0_1B,
} from "../src/shared/openInstrument/frd02CvcP4Implementation.v0_1b";
import { FIXTURE_IDS_V0_1B } from "../src/shared/openInstrument/frd02CvcSyntheticCalibration.v0_1b";

const ROOT = resolve(process.cwd());
const HUMAN_AUTHORITY_PATH = "docs/open-instrument/frd02-cvc-v0.1c-p4-successor-methodology-freeze-v0.1.md";
const MACHINE_AUTHORITY_PATH = "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-successor-methodology-freeze-v0.1/preregistration.json";
const AUTHORITY_MANIFEST_PATH = "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-successor-methodology-freeze-v0.1/hash-manifest.json";
const DOCTRINE_PATH = "docs/open-instrument/zhero-doctrine-record-v0.1.md";
const IMPLEMENTATION_PATH = "src/shared/openInstrument/frd02CvcP4Implementation.v0_1c.ts";
const WRAPPER_PATH = "scripts/openInstrumentFrd02P4V0_1cSyntheticCalibrationExecution.v0_1.ts";
const RESULT_DIRECTORY = "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-synthetic-calibration-v0.1";
const RESULT_PATH = `${RESULT_DIRECTORY}/result.json`;
const IDENTITY_PATH = `${RESULT_DIRECTORY}/execution-identity.json`;
const RESULT_MANIFEST_PATH = `${RESULT_DIRECTORY}/hash-manifest.json`;
const PREDECESSOR_RESULT_PATH = "docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-synthetic-calibration-v0.1/result.json";
const PREDECESSOR_RESULT_SHA256 = "20c1ad43e95a59912908334ad7fb2bf7f98765aa85b4f5a4f569ac1dea5fdf02";
const DOCTRINE_SHA256 = "b72c23d659d010b5c2a53058cc2f6223e0cbba9b32e351d17009b6545fc05f93";
const AUTHORITATIVE_ATTEMPT_MAXIMUM = 1;

type FrozenIdentityV0_1C = Readonly<{
  experimentId: string;
  contractId: string;
  scheduleVersion: string;
  fixtureVersion: string;
  acceptanceVersion: string;
  masterSeed: string;
  permutationStreamId: string;
  replicateIds: readonly string[];
  fixtureCount: number;
  replicatesPerFixture: number;
  scheduleEntries: number;
  scheduleBytes: number;
  scheduleSha256: string;
  scheduleFirstEntry: P4ScheduleEntryV0_1C;
  scheduleLastEntry: P4ScheduleEntryV0_1C;
  repositoryHead: string;
  executionBranch: string;
  implementationSha256: string;
  executionWrapperPath: string;
  executionWrapperSha256: string;
  authorityHashes: Readonly<Record<string, string>>;
  executionAttemptMaximum: number;
  createdAtUtc: string;
}>;

type StoredResultV0_1C = Readonly<{
  acceptance: P4AggregateAcceptanceV0_1C;
  calibrationOutcome: P4AggregateAcceptanceV0_1C["outcome"];
  contractId: string;
  executedAtUtc: string;
  executionStartedAtUtc: string;
  executionEndedAtUtc: string;
  executionAttemptCount: number;
  executionBranch: string;
  executionIdentitySha256: string;
  manifest: Readonly<Record<string, unknown>>;
  manifestSha256: string;
  productionAuthorityChanged: false;
  realDataExecuted: false;
  replicateResults: readonly P4ScheduledResultV0_1C[];
  repositoryBaseSha: string;
  schemaVersion: string;
  syntheticOnly: true;
}>;

function sha256Bytes(value: Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

function sha256Text(value: string): string {
  return sha256Bytes(Buffer.from(value, "utf8"));
}

function fileBytes(relativePath: string): Buffer {
  return readFileSync(join(ROOT, relativePath));
}

function fileSha256(relativePath: string): string {
  return sha256Bytes(fileBytes(relativePath));
}

function fileByteLength(relativePath: string): number {
  return fileBytes(relativePath).byteLength;
}

function gitValue(...args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function canonicalJson(value: unknown): string {
  return JSON.stringify(value);
}

function scheduleBytes(schedule: readonly P4ScheduleEntryV0_1C[]): string {
  return serializeP4CanonicalV0_1B(schedule);
}

export function buildFrozenScheduleProvenanceV0_1C() {
  const schedule = buildP4ScheduleV0_1C();
  const serialized = scheduleBytes(schedule);
  return {
    schedule,
    serialized,
    bytes: Buffer.byteLength(serialized, "utf8"),
    sha256: sha256Text(serialized),
    firstEntry: schedule[0],
    lastEntry: schedule[schedule.length - 1],
  } as const;
}

function authorityHashes(): Readonly<Record<string, string>> {
  return {
    humanContractSha256: P4_V0_1C_HUMAN_CONTRACT_SHA256,
    machineContractSha256: P4_V0_1C_MACHINE_CONTRACT_SHA256,
    authorityManifestSha256: P4_V0_1C_HASH_MANIFEST_SHA256,
    predecessorResultSha256: PREDECESSOR_RESULT_SHA256,
    doctrineSha256: DOCTRINE_SHA256,
    amendedContractSha256: AMENDED_CONTRACT_SHA256_V0_1B,
    analyzerContractSha256: ANALYZER_CONTRACT_SHA256_V0_1B,
    generatorContractSha256: GENERATOR_CONTRACT_SHA256_V0_1B,
    p4HumanContractSha256: P4_HUMAN_CONTRACT_SHA256_V0_1B,
    p4MachineContractSha256: P4_MACHINE_CONTRACT_SHA256_V0_1B,
    fixtureCorrectionMachineSha256: P4_FIXTURE_CORRECTION_MACHINE_SHA256_V0_1_1,
    p1P2CorrectionMachineSha256: P4_P1_P2_CORRECTION_MACHINE_SHA256_V0_1,
    subcaseAllocationHumanSha256: P4_SUBCASE_ALLOCATION_HUMAN_SHA256_V0_1,
    subcaseAllocationMachineSha256: P4_SUBCASE_ALLOCATION_MACHINE_SHA256_V0_1,
  };
}

export function buildFrozenExecutionIdentityV0_1C(): FrozenIdentityV0_1C {
  const provenance = buildFrozenScheduleProvenanceV0_1C();
  if (provenance.schedule.length !== P4_V0_1C_TOTAL_EVALUATIONS) throw new Error("SCHEDULE_SIZE_MISMATCH");
  if (existsSync(join(ROOT, RESULT_PATH))) throw new Error("SUCCESSOR_RESULT_ALREADY_EXISTS");
  return {
    experimentId: P4_V0_1C_EXPERIMENT_ID,
    contractId: P4_V0_1C_CONTRACT_ID,
    scheduleVersion: P4_V0_1C_SCHEDULE_VERSION,
    fixtureVersion: P4_V0_1C_FIXTURE_VERSION,
    acceptanceVersion: P4_V0_1C_ACCEPTANCE_VERSION,
    masterSeed: P4_MASTER_SEED_V0_1B,
    permutationStreamId: P4_PERMUTATION_STREAM_ID_V0_1B,
    replicateIds: P4_REPLICATE_IDS_V0_1B,
    fixtureCount: FIXTURE_IDS_V0_1B.length,
    replicatesPerFixture: P4_REPLICATES_PER_FIXTURE_V0_1B,
    scheduleEntries: provenance.schedule.length,
    scheduleBytes: provenance.bytes,
    scheduleSha256: provenance.sha256,
    scheduleFirstEntry: provenance.firstEntry,
    scheduleLastEntry: provenance.lastEntry,
    repositoryHead: gitValue("rev-parse", "HEAD"),
    executionBranch: gitValue("branch", "--show-current"),
    implementationSha256: fileSha256(IMPLEMENTATION_PATH),
    executionWrapperPath: WRAPPER_PATH,
    executionWrapperSha256: fileSha256(WRAPPER_PATH),
    authorityHashes: authorityHashes(),
    executionAttemptMaximum: AUTHORITATIVE_ATTEMPT_MAXIMUM,
    createdAtUtc: new Date().toISOString(),
  };
}

function readIdentity(): FrozenIdentityV0_1C {
  return JSON.parse(readFileSync(join(ROOT, IDENTITY_PATH), "utf8")) as FrozenIdentityV0_1C;
}

function assertFrozenIdentity(identity: FrozenIdentityV0_1C): void {
  if (identity.executionAttemptMaximum !== AUTHORITATIVE_ATTEMPT_MAXIMUM) throw new Error("EXECUTION_ATTEMPT_MAXIMUM_MISMATCH");
  if (gitValue("rev-parse", "HEAD") !== identity.repositoryHead) throw new Error("REPOSITORY_HEAD_CHANGED_AFTER_FREEZE");
  if (gitValue("branch", "--show-current") !== identity.executionBranch) throw new Error("EXECUTION_BRANCH_CHANGED_AFTER_FREEZE");
  if (fileSha256(IMPLEMENTATION_PATH) !== identity.implementationSha256) throw new Error("IMPLEMENTATION_CHANGED_AFTER_FREEZE");
  if (fileSha256(WRAPPER_PATH) !== identity.executionWrapperSha256) throw new Error("WRAPPER_CHANGED_AFTER_FREEZE");
  const provenance = buildFrozenScheduleProvenanceV0_1C();
  if (provenance.bytes !== identity.scheduleBytes || provenance.sha256 !== identity.scheduleSha256) throw new Error("SCHEDULE_CHANGED_AFTER_FREEZE");
  if (existsSync(join(ROOT, RESULT_PATH))) throw new Error("SUCCESSOR_RESULT_ALREADY_EXISTS");
  if (fileSha256(HUMAN_AUTHORITY_PATH) !== P4_V0_1C_HUMAN_CONTRACT_SHA256) throw new Error("HUMAN_AUTHORITY_HASH_MISMATCH");
  if (fileSha256(MACHINE_AUTHORITY_PATH) !== P4_V0_1C_MACHINE_CONTRACT_SHA256) throw new Error("MACHINE_AUTHORITY_HASH_MISMATCH");
  if (fileSha256(AUTHORITY_MANIFEST_PATH) !== P4_V0_1C_HASH_MANIFEST_SHA256) throw new Error("AUTHORITY_MANIFEST_HASH_MISMATCH");
  if (fileSha256(DOCTRINE_PATH) !== DOCTRINE_SHA256) throw new Error("DOCTRINE_HASH_MISMATCH");
  if (fileSha256(PREDECESSOR_RESULT_PATH) !== PREDECESSOR_RESULT_SHA256) throw new Error("PREDECESSOR_RESULT_HASH_MISMATCH");
}

export function freezeExecutionIdentityV0_1C(): FrozenIdentityV0_1C {
  const identity = buildFrozenExecutionIdentityV0_1C();
  mkdirSync(join(ROOT, RESULT_DIRECTORY), { recursive: true });
  writeFileSync(join(ROOT, IDENTITY_PATH), `${JSON.stringify(identity, null, 2)}\n`, "utf8");
  return identity;
}

function fixtureResults(results: readonly P4ScheduledResultV0_1C[]): Map<string, P4ScheduledResultV0_1C[]> {
  const byFixture = new Map<string, P4ScheduledResultV0_1C[]>();
  for (const result of results) {
    const entries = byFixture.get(result.fixtureId) ?? [];
    entries.push(result);
    byFixture.set(result.fixtureId, entries);
  }
  return byFixture;
}

function runAuthoritativeSchedule(identity: FrozenIdentityV0_1C): readonly P4ScheduledResultV0_1C[] {
  const schedule = buildP4ScheduleV0_1C();
  const results: P4ScheduledResultV0_1C[] = [];
  for (const entry of schedule) {
    results.push(runP4ReplicateV0_1B(generateP4FixtureV0_1C(entry.fixtureId, entry.replicateId, entry.subcase)));
  }
  if (results.length !== identity.scheduleEntries) throw new Error("AUTHORITATIVE_RESULT_COUNT_MISMATCH");
  return results;
}

function buildResultManifest(identity: FrozenIdentityV0_1C, resultResults: readonly P4ScheduledResultV0_1C[], acceptance: P4AggregateAcceptanceV0_1C, executionIdentitySha256: string) {
  const provenance = buildFrozenScheduleProvenanceV0_1C();
  return {
    authorityBindings: {
      ...identity.authorityHashes,
      contractId: identity.contractId,
      implementationSha256: identity.implementationSha256,
      executionWrapperSha256: identity.executionWrapperSha256,
      executionIdentitySha256,
      predecessorResultPath: PREDECESSOR_RESULT_PATH,
      subcaseAllocationContractId: P4_SUBCASE_ALLOCATION_CONTRACT_ID_V0_1,
    },
    contractId: identity.contractId,
    experimentId: identity.experimentId,
    scheduleVersion: identity.scheduleVersion,
    fixtureVersion: identity.fixtureVersion,
    acceptanceVersion: identity.acceptanceVersion,
    masterSeed: identity.masterSeed,
    permutationStreamId: identity.permutationStreamId,
    fixtureOrder: FIXTURE_IDS_V0_1B,
    replicateIds: identity.replicateIds,
    schedule: provenance.schedule,
    scheduleBytes: provenance.bytes,
    scheduleSha256: provenance.sha256,
    scheduleSize: provenance.schedule.length,
    evaluationCount: resultResults.length,
    acceptance,
    executionAttemptMaximum: identity.executionAttemptMaximum,
    repositoryHead: identity.repositoryHead,
  };
}

function artifact(relativePath: string, sha256: string, byteLength: number) {
  return { path: relativePath, sha256, byteLength };
}

function buildHashManifest(identity: FrozenIdentityV0_1C, result: StoredResultV0_1C, resultSha256: string, identitySha256: string, wrapperSha256: string) {
  const resultManifest = {
    manifestVersion: "open-instrument.artifact-hash-manifest.v0_1",
    contractId: identity.contractId,
    status: "AUTHORITATIVE_SYNTHETIC_CALIBRATION_RESULT_PRESERVED",
    calibrationExecuted: true,
    executionAttemptCount: 1,
    calibrationOutcome: result.calibrationOutcome,
    syntheticOnly: true,
    realDataExecuted: false,
    productionAuthorityChanged: false,
    repositoryBaseSha: identity.repositoryHead,
    executionBranch: identity.executionBranch,
    noRerun: true,
    artifacts: [
      artifact(RESULT_PATH, resultSha256, fileByteLength(RESULT_PATH)),
      artifact(IDENTITY_PATH, identitySha256, fileByteLength(IDENTITY_PATH)),
      artifact(WRAPPER_PATH, wrapperSha256, fileByteLength(WRAPPER_PATH)),
      artifact(IMPLEMENTATION_PATH, identity.implementationSha256, fileByteLength(IMPLEMENTATION_PATH)),
      artifact(HUMAN_AUTHORITY_PATH, identity.authorityHashes.humanContractSha256, fileByteLength(HUMAN_AUTHORITY_PATH)),
      artifact(MACHINE_AUTHORITY_PATH, identity.authorityHashes.machineContractSha256, fileByteLength(MACHINE_AUTHORITY_PATH)),
      artifact(AUTHORITY_MANIFEST_PATH, identity.authorityHashes.authorityManifestSha256, fileByteLength(AUTHORITY_MANIFEST_PATH)),
      artifact(DOCTRINE_PATH, identity.authorityHashes.doctrineSha256, fileByteLength(DOCTRINE_PATH)),
      artifact(PREDECESSOR_RESULT_PATH, identity.authorityHashes.predecessorResultSha256, fileByteLength(PREDECESSOR_RESULT_PATH)),
    ],
    schedule: {
      size: identity.scheduleEntries,
      bytes: identity.scheduleBytes,
      sha256: identity.scheduleSha256,
    },
    acceptance: result.acceptance,
    scientificBoundary: {
      wholeZheroDoctrineTested: false,
      realLanguageTruthEstablished: false,
      lexicalMeaningEstablished: false,
      historicalClaimEstablished: false,
      albanianClaimEstablished: false,
      productionReadinessEstablished: false,
    },
  };
  return resultManifest;
}

export function executeAuthoritativeV0_1C(): StoredResultV0_1C {
  const identity = readIdentity();
  assertFrozenIdentity(identity);
  const identitySha256 = fileSha256(IDENTITY_PATH);
  const startedAtUtc = new Date().toISOString();
  const replicateResults = runAuthoritativeSchedule(identity);
  const grouped = fixtureResults(replicateResults);
  const fixtureAcceptances = FIXTURE_IDS_V0_1B.map((fixtureId) => evaluateP4FixtureAcceptanceV0_1C(fixtureId, grouped.get(fixtureId) ?? []));
  const acceptance = evaluateP4AggregateAcceptanceV0_1C(buildP4ScheduleV0_1C(), fixtureAcceptances);
  const endedAtUtc = new Date().toISOString();
  const manifest = buildResultManifest(identity, replicateResults, acceptance, identitySha256);
  const result: StoredResultV0_1C = {
    acceptance,
    calibrationOutcome: acceptance.outcome,
    contractId: identity.contractId,
    executedAtUtc: endedAtUtc,
    executionStartedAtUtc: startedAtUtc,
    executionEndedAtUtc: endedAtUtc,
    executionAttemptCount: 1,
    executionBranch: identity.executionBranch,
    executionIdentitySha256: identitySha256,
    manifest,
    manifestSha256: sha256Text(canonicalJson(manifest)),
    productionAuthorityChanged: false,
    realDataExecuted: false,
    replicateResults,
    repositoryBaseSha: identity.repositoryHead,
    schemaVersion: "open-instrument.frd02-cvc-v0.1c-p4-synthetic-calibration-result.v0_1",
    syntheticOnly: true,
  };
  mkdirSync(join(ROOT, RESULT_DIRECTORY), { recursive: true });
  writeFileSync(join(ROOT, RESULT_PATH), canonicalJson(result), "utf8");
  const resultSha256 = fileSha256(RESULT_PATH);
  const hashManifest = buildHashManifest(identity, result, resultSha256, identitySha256, identity.executionWrapperSha256);
  writeFileSync(join(ROOT, RESULT_MANIFEST_PATH), `${JSON.stringify(hashManifest, null, 2)}\n`, "utf8");
  return result;
}

function recomputeAcceptanceFromStoredResult(result: StoredResultV0_1C): P4AggregateAcceptanceV0_1C {
  const grouped = fixtureResults(result.replicateResults);
  const acceptances = FIXTURE_IDS_V0_1B.map((fixtureId) => evaluateP4FixtureAcceptanceV0_1C(fixtureId, grouped.get(fixtureId) ?? []));
  return evaluateP4AggregateAcceptanceV0_1C(buildP4ScheduleV0_1C(), acceptances);
}

export function verifyStoredV0_1C(): Readonly<Record<string, unknown>> {
  const identity = readIdentity();
  const result = JSON.parse(readFileSync(join(ROOT, RESULT_PATH), "utf8")) as StoredResultV0_1C;
  const storedAcceptance = JSON.stringify(result.acceptance);
  const recomputedAcceptance = recomputeAcceptanceFromStoredResult(result);
  const resultManifest = result.manifest as Readonly<Record<string, unknown>>;
  const scheduleProvenance = buildFrozenScheduleProvenanceV0_1C();
  if (result.executionAttemptCount !== 1) throw new Error("STORED_ATTEMPT_COUNT_INVALID");
  if (result.replicateResults.length !== P4_V0_1C_TOTAL_EVALUATIONS) throw new Error("STORED_EVALUATION_COUNT_INVALID");
  if (result.acceptance.outcome !== result.calibrationOutcome) throw new Error("STORED_OUTCOME_MISMATCH");
  if (storedAcceptance !== JSON.stringify(recomputedAcceptance)) throw new Error("STORED_ACCEPTANCE_RECOMPUTATION_MISMATCH");
  if (result.manifestSha256 !== sha256Text(canonicalJson(resultManifest))) throw new Error("STORED_MANIFEST_HASH_INVALID");
  if (resultManifest.scheduleSha256 !== identity.scheduleSha256 || resultManifest.scheduleBytes !== identity.scheduleBytes) throw new Error("STORED_SCHEDULE_BINDING_INVALID");
  if (scheduleProvenance.sha256 !== identity.scheduleSha256 || scheduleProvenance.bytes !== identity.scheduleBytes) throw new Error("FROZEN_SCHEDULE_BINDING_INVALID");
  if (result.realDataExecuted || !result.syntheticOnly) throw new Error("NON_SYNTHETIC_RESULT");
  const evaluationKeys = result.replicateResults.map((entry) => `${entry.fixtureId}:${entry.replicateId}`);
  if (new Set(evaluationKeys).size !== P4_V0_1C_TOTAL_EVALUATIONS) throw new Error("DUPLICATE_EVALUATIONS");
  return {
    jsonValid: true,
    evaluationCount: result.replicateResults.length,
    fixtureCount: FIXTURE_IDS_V0_1B.length,
    replicateIdsComplete: true,
    noDuplicates: true,
    noOmissions: true,
    aggregateMatchesStored: true,
    scheduleHashMatches: true,
    attemptCount: result.executionAttemptCount,
    noRerun: true,
    realDataExecuted: false,
  };
}

export function mainV0_1C(): void {
  const command = process.argv[2];
  if (command === "--freeze-identity") {
    const identity = freezeExecutionIdentityV0_1C();
    console.log(JSON.stringify({ identityPath: IDENTITY_PATH, scheduleBytes: identity.scheduleBytes, scheduleSha256: identity.scheduleSha256, scheduleEntries: identity.scheduleEntries }));
    return;
  }
  if (command === "--schedule-only") {
    const provenance = buildFrozenScheduleProvenanceV0_1C();
    console.log(JSON.stringify({ scheduleBytes: provenance.bytes, scheduleSha256: provenance.sha256, scheduleEntries: provenance.schedule.length, firstEntry: provenance.firstEntry, lastEntry: provenance.lastEntry }));
    return;
  }
  if (command === "--verify-stored") {
    console.log(JSON.stringify(verifyStoredV0_1C()));
    return;
  }
  const result = executeAuthoritativeV0_1C();
  console.log(JSON.stringify({ outcome: result.calibrationOutcome, attemptCount: result.executionAttemptCount, resultPath: RESULT_PATH, manifestPath: RESULT_MANIFEST_PATH }));
}
