import { createHash } from "node:crypto";

import {
  buildP4ScheduleV0_1B,
  evaluateP4N11PairAcceptanceV0_1B,
  fixtureExpectationV0_1B,
  generateP4FixtureV0_1B,
  P4_MASTER_SEED_V0_1B,
  P4_PERMUTATION_STREAM_ID_V0_1B,
  P4_REPLICATE_IDS_V0_1B,
  P4_REPLICATES_PER_FIXTURE_V0_1B,
  P4_TOTAL_EVALUATIONS_V0_1B,
  runP4ReplicateV0_1B,
  serializeP4CanonicalV0_1B,
  type P4FixtureAcceptanceV0_1B,
  type P4FixtureSubcaseV0_1B,
  type P4FixtureV0_1B,
  type P4PairReplicateResultV0_1B,
  type P4ReplicateResultV0_1B,
  type P4ScheduledResultV0_1B,
  type P4ScheduleEntryV0_1B,
  type P4SingleFixtureV0_1B,
} from "./frd02CvcP4Implementation.v0_1b";
import {
  canonicalSeedTupleV0_1B,
  FIXTURE_IDS_V0_1B,
  seedWordsV0_1B,
  STRATA_V0_1B,
  type SyntheticStructuralRecordV0_1B,
} from "./frd02CvcSyntheticCalibration.v0_1b";

export const P4_V0_1C_CONTRACT_ID =
  "OPEN_INSTRUMENT_FRD02_CVC_V0_1C_P4_METHODOLOGY_V0_1";
export const P4_V0_1C_HUMAN_CONTRACT_SHA256 =
  "b6f58fdbcc38c3c5dc8238fec692c3d98b649018113e7540a972d03c558c40c6";
export const P4_V0_1C_MACHINE_CONTRACT_SHA256 =
  "7862a9d9ece42692069240c47ab917520f3fb101ccbdf945860ebc24fa055743";
export const P4_V0_1C_HASH_MANIFEST_SHA256 =
  "5bcf6cf9c07476e00715432d4b705025b3ba3722f2ac477d7e5c337676aab11e";
export const P4_V0_1C_EXPERIMENT_ID =
  "OPEN_INSTRUMENT_FRD02_CVC_V0_1C_P4_SUCCESSOR";
export const P4_V0_1C_SCHEDULE_VERSION = "FRD02_CVC_V0_1C_P4_SCHEDULE_V0_1";
export const P4_V0_1C_FIXTURE_VERSION = "FRD02_CVC_V0_1C_P4_FIXTURE_CONSTRUCTION_V0_1";
export const P4_V0_1C_ACCEPTANCE_VERSION = "FRD02_CVC_V0_1C_P4_ACCEPTANCE_V0_1";
export const P4_V0_1C_SPARSE_THRESHOLD = 0.25;
export const P4_V0_1C_CHANGED_FIXTURES = ["E3", "C7", "C8"] as const;
export const P4_V0_1C_UNCHANGED_FIXTURE_COUNT = 26;
export const P4_V0_1C_TOTAL_EVALUATIONS = P4_TOTAL_EVALUATIONS_V0_1B;

export type P4FixtureSubcaseV0_1C = P4FixtureSubcaseV0_1B;
export type P4FixtureV0_1C = P4FixtureV0_1B;
export type P4ScheduleEntryV0_1C = P4ScheduleEntryV0_1B;
export type P4ScheduledResultV0_1C = P4ScheduledResultV0_1B;

export type P4FixtureAcceptanceV0_1C = P4FixtureAcceptanceV0_1B & Readonly<{
  expectedInvalidReplicates: number;
}>;

export type P4AggregateAcceptanceV0_1C = Readonly<{
  outcome: "CALIBRATION_PASS" | "CALIBRATION_FAIL" | "CALIBRATION_INVALID";
  scheduleSize: number;
  acceptedFixtureCount: number;
  invalidResultCount: number;
  expectedInvalidE3Replicates: number;
  fixtureAcceptances: readonly P4FixtureAcceptanceV0_1C[];
  reason: string | null;
}>;

export type P4C7ConstructionAuditV0_1C = Readonly<{
  missingVoiceRecords: number;
  missingPositionRecords: number;
  all12StrataPreserved: boolean;
  missingVoiceAffectedStratumGroups: number;
  missingPositionAffectedStratumGroups: number;
  unrelatedRecordPropertiesPreserved: boolean;
}>;

export type P4C8ConstructionAuditV0_1C = Readonly<{
  recordCount: number;
  groupCount: number;
  strataCount: number;
  rareRecordCount: number;
  rareIdentityCount: number;
  rareIdentityWeight: number;
  threshold: number;
  thresholdExceeded: boolean;
  unrelatedRecordPropertiesPreserved: boolean;
}>;

export type P4All29CompatibilityAuditV0_1C = Readonly<{
  fixtureCount: number;
  changedFixtureIds: readonly string[];
  unchangedFixtureIds: readonly string[];
  all29Accounted: boolean;
  scheduleSize: number;
  scheduleDeterministic: boolean;
  unchangedFixturesPreserved: boolean;
  e3ConstructionPreserved: boolean;
  c7: P4C7ConstructionAuditV0_1C;
  c8: P4C8ConstructionAuditV0_1C;
  p1Changed: false;
  p2Changed: false;
  p3Changed: false;
}>;

function sha256(value: string): string {
  return createHash("sha256").update(Buffer.from(value, "utf8")).digest("hex");
}

function groupIndex(record: SyntheticStructuralRecordV0_1B): number {
  return Number(record.independenceGroupId.slice(1));
}

function relabelRecords(
  records: readonly SyntheticStructuralRecordV0_1B[],
  fixtureId: string,
): SyntheticStructuralRecordV0_1B[] {
  return records.map((record) => ({
    ...record,
    fixtureId,
    recordId: record.recordId.replace(/^[^-]+-/, `${fixtureId}-`),
  }));
}

function singleFixture(
  fixtureId: string,
  replicateId: string,
  records: readonly SyntheticStructuralRecordV0_1B[],
): P4SingleFixtureV0_1B {
  const constructionFingerprint = sha256(serializeP4CanonicalV0_1B(records));
  return {
    kind: "single",
    fixtureId,
    replicateId,
    records,
    constructionFingerprint,
  };
}

function successorC7Fixture(
  replicateId: string,
  subcase: "default" | "position",
): P4SingleFixtureV0_1B {
  const base = generateP4FixtureV0_1B("N0", replicateId);
  if (base.kind !== "single") throw new TypeError("C7_BASE_FIXTURE_FAILURE");
  const affectedStratum = subcase === "default" ? "S3" : "S4";
  const records = relabelRecords(
    base.records.filter(
      (record) => !(record.stratumId === affectedStratum && groupIndex(record) >= 4),
    ),
    "C7",
  );
  return singleFixture("C7", replicateId, records);
}

function successorC8RareFixture(replicateId: string): P4SingleFixtureV0_1B {
  const base = generateP4FixtureV0_1B("N0", replicateId);
  if (base.kind !== "single") throw new TypeError("C8_BASE_FIXTURE_FAILURE");
  const records = relabelRecords(
    base.records.map((record) =>
      groupIndex(record) <= 32
        ? { ...record, C_R: `RARE_R_g${String(groupIndex(record)).padStart(3, "0")}` }
        : record,
    ),
    "C8",
  );
  return singleFixture("C8", replicateId, records);
}

export function generateP4FixtureV0_1C(
  fixtureId: (typeof FIXTURE_IDS_V0_1B)[number],
  replicateId: string,
  subcase: P4FixtureSubcaseV0_1C = "default",
): P4FixtureV0_1C {
  if (fixtureId === "C7") {
    if (subcase !== "default" && subcase !== "position") throw new TypeError("INVALID_C7_SUBCASE");
    return successorC7Fixture(replicateId, subcase);
  }
  if (fixtureId === "C8" && subcase === "right") return successorC8RareFixture(replicateId);
  return generateP4FixtureV0_1B(fixtureId, replicateId, subcase);
}

function scheduledSubcaseV0_1C(
  fixtureId: (typeof FIXTURE_IDS_V0_1B)[number],
  replicateId: string,
): P4FixtureSubcaseV0_1C {
  if (fixtureId !== "C6" && fixtureId !== "C7" && fixtureId !== "C8") return "default";
  return Number(replicateId) < 4 ? "default" : fixtureId === "C7" ? "position" : "right";
}

export function buildP4ScheduleV0_1C(): readonly P4ScheduleEntryV0_1C[] {
  const schedule: P4ScheduleEntryV0_1C[] = [];
  for (const fixtureId of FIXTURE_IDS_V0_1B) {
    for (const replicateId of P4_REPLICATE_IDS_V0_1B) {
      const subcase = scheduledSubcaseV0_1C(fixtureId, replicateId);
      const fixture = generateP4FixtureV0_1C(fixtureId, replicateId, subcase);
      const seedTuple = canonicalSeedTupleV0_1B(fixtureId, replicateId, P4_PERMUTATION_STREAM_ID_V0_1B);
      const words = seedWordsV0_1B(fixtureId, replicateId, P4_PERMUTATION_STREAM_ID_V0_1B);
      schedule.push({
        fixtureId,
        replicateId,
        subcase,
        seedTuple,
        seedWords: words.map((word) => word.toString()) as [string, string, string, string],
        constructionFingerprint: fixture.constructionFingerprint,
      });
    }
  }
  return schedule;
}

function exactReplicateIds(results: readonly { replicateId: string }[]): boolean {
  return results.length === P4_REPLICATES_PER_FIXTURE_V0_1B
    && results.every((result, index) => result.replicateId === String(index));
}

function expectedGateMatches(
  fixtureId: string,
  replicateId: string,
  gate: P4ReplicateResultV0_1B["gateA"],
): boolean {
  if (gate === null) return false;
  const expectation = fixtureExpectationV0_1B(fixtureId);
  const expectedGate = fixtureId === "C7"
    ? Number(replicateId) < 4 ? "VOICE_COVERAGE_MINIMUM_NOT_MET" : "POSITION_COVERAGE_MINIMUM_NOT_MET"
    : fixtureId === "C8"
      ? Number(replicateId) < 4 ? "CONCENTRATION_CONFOUND_THRESHOLD_EXCEEDED" : "RARE_IDENTITY_SPARSE_THRESHOLD_EXCEEDED"
      : expectation.expectedGate;
  if (expectedGate === "PASS") return gate.pass && gate.reason === null;
  return !gate.pass && (Array.isArray(expectedGate) ? expectedGate.includes(gate.reason as never) : gate.reason === expectedGate);
}

function expectedP2Matches(
  fixtureId: string,
  replicateId: string,
  gate: P4ReplicateResultV0_1B["gateB"],
): boolean {
  if (gate === null) return false;
  const expectation = fixtureExpectationV0_1B(fixtureId);
  const expectedP2 = fixtureId === "C7" || fixtureId === "C8" ? "NOT_RUN" : expectation.expectedP2;
  if (expectedP2 === "NOT_RUN") return gate.status === "NOT_RUN";
  if (expectedP2 === "ONLY_OBSERVED_REALIZATION") {
    return gate.status === "FAILURE" && gate.reason === "ONLY_OBSERVED_REALIZATION" && gate.domain === "FINITE_SCIENTIFIC";
  }
  if (expectedP2 === "FAILURE") {
    return gate.status === "FAILURE" && gate.reason === "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED" && gate.domain === "RESOURCE";
  }
  return gate.status === "READY" && gate.branch === expectedP2;
}

function expectedOutcome(fixtureId: string, replicateId: string): string[] {
  if (fixtureId === "C7") return ["INSUFFICIENT_EVIDENCE"];
  if (fixtureId === "C8") return Number(replicateId) < 4 ? ["STRUCTURAL_BUT_CONFOUNDED"] : ["SPARSE"];
  return [...fixtureExpectationV0_1B(fixtureId).expectedOutcomes];
}

function matchesFrozenSubcaseV0_1C(result: P4ReplicateResultV0_1B): boolean {
  if (result.fixtureId !== "C6" && result.fixtureId !== "C7" && result.fixtureId !== "C8") return true;
  const expectedSubcase = scheduledSubcaseV0_1C(result.fixtureId as (typeof FIXTURE_IDS_V0_1B)[number], result.replicateId);
  const expectedFixture = generateP4FixtureV0_1C(result.fixtureId as (typeof FIXTURE_IDS_V0_1B)[number], result.replicateId, expectedSubcase);
  return expectedFixture.kind === "single"
    && result.constructionFingerprint === expectedFixture.constructionFingerprint
    && result.inputSha256 === expectedFixture.constructionFingerprint;
}

function singleAcceptedV0_1C(result: P4ReplicateResultV0_1B): boolean {
  return result.valid
    && expectedGateMatches(result.fixtureId, result.replicateId, result.gateA)
    && expectedP2Matches(result.fixtureId, result.replicateId, result.gateB)
    && result.outcome !== null
    && expectedOutcome(result.fixtureId, result.replicateId).includes(result.outcome);
}

function expectedE3Invalid(result: P4ReplicateResultV0_1B): boolean {
  if (result.fixtureId !== "E3" || result.valid) return false;
  const fixture = generateP4FixtureV0_1C("E3", result.replicateId);
  const expectedWords = seedWordsV0_1B("E3", result.replicateId, P4_PERMUTATION_STREAM_ID_V0_1B).map((word) => word.toString());
  return result.inputSha256 === fixture.constructionFingerprint
    && result.constructionFingerprint === fixture.constructionFingerprint
    && result.seedTuple === canonicalSeedTupleV0_1B("E3", result.replicateId, P4_PERMUTATION_STREAM_ID_V0_1B)
    && serializeP4CanonicalV0_1B(result.seedWords) === serializeP4CanonicalV0_1B(expectedWords)
    && result.gateA?.pass === true
    && result.gateA.reason === null
    && result.gateB?.status === "FAILURE"
    && result.gateB.reason === "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED"
    && result.gateB.domain === "RESOURCE"
    && result.outcome === "INSUFFICIENT_EVIDENCE"
    && result.invalidReason === "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED"
    && result.normalization !== null;
}

function invalidAcceptance(fixtureId: string, invalidReplicates: number, reason: string): P4FixtureAcceptanceV0_1C {
  return {
    fixtureId,
    outcome: "CALIBRATION_INVALID",
    validReplicates: 0,
    invalidReplicates,
    unexpectedReplicates: 0,
    expectedInvalidReplicates: 0,
    reason,
  };
}

export function evaluateP4FixtureAcceptanceV0_1C(
  fixtureId: string,
  results: readonly P4ScheduledResultV0_1C[],
): P4FixtureAcceptanceV0_1C {
  if (fixtureId === "E3") {
    if (!exactReplicateIds(results)) return invalidAcceptance("E3", results.length, "E3_EXPECTED_INVALID_PATTERN_MISMATCH");
    const exact = results.every((result) => result.fixtureId === "E3" && expectedE3Invalid(result as P4ReplicateResultV0_1B));
    return exact
      ? { fixtureId: "E3", outcome: "CALIBRATION_PASS", validReplicates: 0, invalidReplicates: 0, unexpectedReplicates: 0, expectedInvalidReplicates: 8, reason: null }
      : invalidAcceptance("E3", results.filter((result) => !expectedE3Invalid(result as P4ReplicateResultV0_1B)).length, "E3_EXPECTED_INVALID_PATTERN_MISMATCH");
  }
  if (fixtureId === "N11") {
    const acceptance = evaluateP4N11PairAcceptanceV0_1B(results as readonly P4PairReplicateResultV0_1B[]);
    return { ...acceptance, expectedInvalidReplicates: 0 };
  }
  if (!exactReplicateIds(results)) return invalidAcceptance(fixtureId, results.length, "FIXTURE_EXPECTATION_MISMATCH");
  let invalidReplicates = 0;
  let unexpectedReplicates = 0;
  let validReplicates = 0;
  for (const result of results) {
    const single = result as P4ReplicateResultV0_1B;
    if (single.fixtureId !== fixtureId || !single.valid) invalidReplicates += 1;
    else if (!matchesFrozenSubcaseV0_1C(single) || !singleAcceptedV0_1C(single)) unexpectedReplicates += 1;
    else validReplicates += 1;
  }
  const outcome = invalidReplicates > 0 ? "CALIBRATION_INVALID" : unexpectedReplicates > 0 ? "CALIBRATION_FAIL" : "CALIBRATION_PASS";
  return {
    fixtureId,
    outcome,
    validReplicates,
    invalidReplicates,
    unexpectedReplicates,
    expectedInvalidReplicates: 0,
    reason: invalidReplicates > 0 ? "RUNTIME_OR_SCHEMA_FAILURE" : unexpectedReplicates > 0 ? "FIXTURE_EXPECTATION_MISMATCH" : null,
  };
}

function scheduleHasExactIdentity(schedule: readonly P4ScheduleEntryV0_1C[]): boolean {
  if (schedule.length !== P4_V0_1C_TOTAL_EVALUATIONS) return false;
  let index = 0;
  for (const fixtureId of FIXTURE_IDS_V0_1B) {
    for (const replicateId of P4_REPLICATE_IDS_V0_1B) {
      const entry = schedule[index];
      if (entry?.fixtureId !== fixtureId || entry.replicateId !== replicateId) return false;
      index += 1;
    }
  }
  return true;
}

export function evaluateP4AggregateAcceptanceV0_1C(
  schedule: readonly P4ScheduleEntryV0_1C[],
  fixtureAcceptances: readonly P4FixtureAcceptanceV0_1C[],
): P4AggregateAcceptanceV0_1C {
  const scheduleValid = scheduleHasExactIdentity(schedule);
  const acceptanceIds = fixtureAcceptances.map((entry) => entry.fixtureId);
  const acceptanceIdentityValid = fixtureAcceptances.length === FIXTURE_IDS_V0_1B.length
    && new Set(acceptanceIds).size === FIXTURE_IDS_V0_1B.length;
  const acceptanceByFixture = new Map(fixtureAcceptances.map((entry) => [entry.fixtureId, entry]));
  const orderedAcceptances = FIXTURE_IDS_V0_1B.map((fixtureId) => acceptanceByFixture.get(fixtureId));
  const missingAcceptance = orderedAcceptances.some((entry) => entry === undefined);
  const e3 = acceptanceByFixture.get("E3");
  const e3Exact = e3?.outcome === "CALIBRATION_PASS" && e3.expectedInvalidReplicates === 8 && e3.invalidReplicates === 0;
  const invalidResultCount = fixtureAcceptances.reduce((sum, entry) => sum + entry.invalidReplicates, 0);
  const nonE3Pass = orderedAcceptances
    .filter((entry) => entry?.fixtureId !== "E3")
    .every((entry) => entry !== undefined && entry.outcome === "CALIBRATION_PASS" && entry.invalidReplicates === 0);
  const invalid = !scheduleValid || !acceptanceIdentityValid || missingAcceptance || invalidResultCount > 0 || !e3Exact;
  const outcome = invalid ? "CALIBRATION_INVALID" : nonE3Pass ? "CALIBRATION_PASS" : "CALIBRATION_FAIL";
  return {
    outcome,
    scheduleSize: schedule.length,
    acceptedFixtureCount: fixtureAcceptances.filter((entry) => entry.outcome === "CALIBRATION_PASS").length,
    invalidResultCount,
    expectedInvalidE3Replicates: e3?.expectedInvalidReplicates ?? 0,
    fixtureAcceptances,
    reason: outcome === "CALIBRATION_PASS" ? null : invalid ? "SCHEDULE_OR_FIXTURE_ACCEPTANCE_INVALID" : "FIXTURE_ACCEPTANCE_NOT_COMPLETE",
  };
}

export function runP4ScheduleV0_1C(): P4AggregateAcceptanceV0_1C {
  const schedule = buildP4ScheduleV0_1C();
  const byFixture = new Map<string, P4ScheduledResultV0_1C[]>();
  for (const entry of schedule) {
    const result = runP4ReplicateV0_1B(generateP4FixtureV0_1C(entry.fixtureId, entry.replicateId, entry.subcase));
    const existing = byFixture.get(entry.fixtureId) ?? [];
    existing.push(result);
    byFixture.set(entry.fixtureId, existing);
  }
  const acceptances = FIXTURE_IDS_V0_1B.map((fixtureId) => evaluateP4FixtureAcceptanceV0_1C(fixtureId, byFixture.get(fixtureId) ?? []));
  return evaluateP4AggregateAcceptanceV0_1C(schedule, acceptances);
}

export function auditP4All29CompatibilityV0_1C(): P4All29CompatibilityAuditV0_1C {
  const predecessorSchedule = buildP4ScheduleV0_1B();
  const successorSchedule = buildP4ScheduleV0_1C();
  const secondSuccessorSchedule = buildP4ScheduleV0_1C();
  const unchangedFixtureIds = FIXTURE_IDS_V0_1B.filter((fixtureId) => !P4_V0_1C_CHANGED_FIXTURES.includes(fixtureId as (typeof P4_V0_1C_CHANGED_FIXTURES)[number]));
  const predecessorUnchanged = predecessorSchedule.filter((entry) => unchangedFixtureIds.includes(entry.fixtureId));
  const successorUnchanged = successorSchedule.filter((entry) => unchangedFixtureIds.includes(entry.fixtureId));
  const c7Voice = generateP4FixtureV0_1C("C7", "0", "default");
  const c7Position = generateP4FixtureV0_1C("C7", "4", "position");
  const c8Rare = generateP4FixtureV0_1C("C8", "4", "right");
  if (c7Voice.kind !== "single" || c7Position.kind !== "single" || c8Rare.kind !== "single") throw new TypeError("P4_V0_1C_AUDIT_FIXTURE_FAILURE");
  const c7VoiceAffected = c7Voice.records.filter((record) => record.stratumId === "S3");
  const c7PositionAffected = c7Position.records.filter((record) => record.stratumId === "S4");
  const c8RareRecords = c8Rare.records.filter((record) => record.C_R.startsWith("RARE_R_"));
  const rareIdentityCount = new Set(c8RareRecords.map((record) => record.C_R)).size;
  const c8Base = generateP4FixtureV0_1C("C8", "0", "default");
  const c8BaseRecordCount = c8Base.kind === "single" ? c8Base.records.length : 0;
  const c8: P4C8ConstructionAuditV0_1C = {
    recordCount: c8Rare.records.length,
    groupCount: new Set(c8Rare.records.map((record) => record.independenceGroupId)).size,
    strataCount: new Set(c8Rare.records.map((record) => record.stratumId)).size,
    rareRecordCount: c8RareRecords.length,
    rareIdentityCount,
    rareIdentityWeight: c8RareRecords.length / (96 * STRATA_V0_1B.length),
    threshold: P4_V0_1C_SPARSE_THRESHOLD,
    thresholdExceeded: c8RareRecords.length / (96 * STRATA_V0_1B.length) > P4_V0_1C_SPARSE_THRESHOLD,
    unrelatedRecordPropertiesPreserved: c8RareRecords.every((record) => record.C_L !== record.C_R)
      && c8RareRecords.length === 33 * STRATA_V0_1B.length
      && c8BaseRecordCount === 1152,
  };
  const c7: P4C7ConstructionAuditV0_1C = {
    missingVoiceRecords: c7Voice.records.length,
    missingPositionRecords: c7Position.records.length,
    all12StrataPreserved: new Set(c7Voice.records.map((record) => record.stratumId)).size === 12
      && new Set(c7Position.records.map((record) => record.stratumId)).size === 12,
    missingVoiceAffectedStratumGroups: new Set(c7VoiceAffected.map((record) => record.independenceGroupId)).size,
    missingPositionAffectedStratumGroups: new Set(c7PositionAffected.map((record) => record.independenceGroupId)).size,
    unrelatedRecordPropertiesPreserved: c7Voice.records.length === 1060
      && c7Position.records.length === 1060
      && c7VoiceAffected.length === 4
      && c7PositionAffected.length === 4,
  };
  return {
    fixtureCount: FIXTURE_IDS_V0_1B.length,
    changedFixtureIds: P4_V0_1C_CHANGED_FIXTURES,
    unchangedFixtureIds,
    all29Accounted: FIXTURE_IDS_V0_1B.length === 29
      && unchangedFixtureIds.length === P4_V0_1C_UNCHANGED_FIXTURE_COUNT
      && P4_V0_1C_CHANGED_FIXTURES.length === 3,
    scheduleSize: successorSchedule.length,
    scheduleDeterministic: serializeP4CanonicalV0_1B(successorSchedule) === serializeP4CanonicalV0_1B(secondSuccessorSchedule),
    unchangedFixturesPreserved: predecessorUnchanged.length === successorUnchanged.length
      && predecessorUnchanged.every((entry, index) => serializeP4CanonicalV0_1B(entry) === serializeP4CanonicalV0_1B(successorUnchanged[index])),
    e3ConstructionPreserved: predecessorSchedule.filter((entry) => entry.fixtureId === "E3").every((entry, index) => {
      const successor = successorSchedule.filter((candidate) => candidate.fixtureId === "E3")[index];
      return successor !== undefined && serializeP4CanonicalV0_1B(entry) === serializeP4CanonicalV0_1B(successor);
    }),
    c7,
    c8,
    p1Changed: false,
    p2Changed: false,
    p3Changed: false,
  };
}

export function p4AuthorityBindingsV0_1C(): Readonly<Record<string, string>> {
  return {
    contractId: P4_V0_1C_CONTRACT_ID,
    humanContractSha256: P4_V0_1C_HUMAN_CONTRACT_SHA256,
    machineContractSha256: P4_V0_1C_MACHINE_CONTRACT_SHA256,
    hashManifestSha256: P4_V0_1C_HASH_MANIFEST_SHA256,
    experimentId: P4_V0_1C_EXPERIMENT_ID,
    scheduleVersion: P4_V0_1C_SCHEDULE_VERSION,
    fixtureVersion: P4_V0_1C_FIXTURE_VERSION,
    acceptanceVersion: P4_V0_1C_ACCEPTANCE_VERSION,
    masterSeed: P4_MASTER_SEED_V0_1B,
    permutationStreamId: P4_PERMUTATION_STREAM_ID_V0_1B,
    p1ChangeRequired: "NO",
    p2ChangeRequired: "NO",
    p3ChangeRequired: "NO",
  };
}
