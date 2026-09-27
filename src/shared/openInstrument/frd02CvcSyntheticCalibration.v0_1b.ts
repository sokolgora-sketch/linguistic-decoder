import { createHash } from "node:crypto";
import {
  canonicalCompareV0_1B,
  countExactNullV0_1B,
  enumerateExactNullAssignmentsV0_1B,
  sampleExactNullAssignmentV0_1B,
  Xoshiro256ssV0_1B,
} from "./frd02CvcExactNull.v0_1b";
import type {
  DonorProfileV0_1B,
  ExactNullCountResultV0_1B,
  ExactNullEnumerationResultV0_1B,
  ExactNullFailureReasonV0_1B,
  ExactNullSampleResultV0_1B,
  ExactNullSignatureClassV0_1B,
  ObservedAssignmentV0_1B,
  PrimarySlotV0_1B,
  RecipientV0_1B,
} from "./frd02CvcExactNull.v0_1b";

export const AMENDED_CONTRACT_SHA256_V0_1B =
  "77038ccc5406da0f6970fab2c667ea131955057abc1907f0f59e61180e306129";
export const GENERATOR_CONTRACT_SHA256_V0_1B =
  "571ef6f139442b086887fb847097aff13edb53dea835b64c97b0b1fbf46a7a8d";
export const ANALYZER_CONTRACT_SHA256_V0_1B =
  "3cf7076b5f9685990891ad6333a89b75aa8823d977664f2c9bffe2364d63608e";

export const ALPHA_V0_1B = 0.05;
export const MONTE_CARLO_DRAWS_V0_1B = 10_000;
export const MAX_EXHAUSTIVE_NULL_REALIZATIONS_V0_1B = 10_000;

export const STRATA_V0_1B = [
  { id: "S0", voice: "V0", position: "P0" },
  { id: "S1", voice: "V1", position: "P0" },
  { id: "S2", voice: "V2", position: "P0" },
  { id: "S3", voice: "V3", position: "P0" },
  { id: "S4", voice: "V0", position: "P1" },
  { id: "S5", voice: "V0", position: "P2" },
  { id: "S6", voice: "V0", position: "P3" },
  { id: "S7", voice: "V4", position: "P4" },
  { id: "S8", voice: "V5", position: "P5" },
  { id: "S9", voice: "V6", position: "P5" },
  { id: "S10", voice: "V1", position: "P2" },
  { id: "S11", voice: "V2", position: "P4" },
] as const;

export const FIXTURE_IDS_V0_1B = [
  "N0",
  "N1",
  "N2",
  "N3",
  "N4",
  "N5",
  "N6",
  "N7",
  "N8",
  "N9",
  "N10",
  "N11",
  "N11_ORDERED",
  "N11_ORDER_DESTROYED",
  "N12",
  "N13",
  "E1",
  "E2",
  "E3",
  "C0",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
] as const;

const FIXTURE_ID_SET = new Set<string>(FIXTURE_IDS_V0_1B);
const STRATUM_BY_ID = new Map<string, (typeof STRATA_V0_1B)[number]>(
  STRATA_V0_1B.map((stratum) => [stratum.id, stratum]),
);
const STRATUM_INDEX = new Map<string, number>(
  STRATA_V0_1B.map((stratum, index) => [stratum.id, index]),
);
const VOICE_IDS = ["V0", "V1", "V2", "V3", "V4", "V5", "V6"] as const;
const POSITION_IDS = ["P0", "P1", "P2", "P3", "P4", "P5"] as const;
const ANALYZER_RECORD_KEYS = new Set([
  "recordId",
  "fixtureId",
  "replicateId",
  "independenceGroupId",
  "C_L",
  "V",
  "C_R",
  "P",
  "stratumId",
  "stableSlotId",
  "tokenLengthClass",
  "geometryClass",
  "clusterAdjacent",
  "topology",
]);
const ANALYZER_OPTION_KEYS = new Set(["fixtureId", "replicateId", "permutationStreamId"]);

export const GATE_A_THRESHOLDS_V0_1B = {
  MIN_ELIGIBLE_GROUPS: 80,
  MIN_VXP_STRATA: 12,
  MIN_GROUPS_PER_INCLUDED_STRATUM: 4,
  MIN_DISTINCT_LEFT_IDENTITIES_PER_STRATUM: 2,
  MIN_DISTINCT_RIGHT_IDENTITIES_PER_STRATUM: 2,
  MIN_EXCHANGEABLE_NULL_POOL_GROUPS: 30,
  MIN_GROUPS_PER_VOICE: 8,
  MIN_GROUPS_PER_POSITION: 8,
  RARE_IDENTITY_WEIGHT_MAX: 0.25,
  CONCENTRATION_RATIO_MAX: 0.5,
} as const;

export const GATE_A_REASON_CODES_V0_1B = [
  "MINIMUM_ELIGIBLE_GROUPS_NOT_MET",
  "MINIMUM_VXP_STRATA_NOT_MET",
  "MINIMUM_GROUPS_PER_STRATUM_NOT_MET",
  "MINIMUM_DISTINCT_LEFT_IDENTITIES_NOT_MET",
  "MINIMUM_DISTINCT_RIGHT_IDENTITIES_NOT_MET",
  "VOICE_COVERAGE_MINIMUM_NOT_MET",
  "POSITION_COVERAGE_MINIMUM_NOT_MET",
  "RARE_IDENTITY_SPARSE_THRESHOLD_EXCEEDED",
  "CONCENTRATION_CONFOUND_THRESHOLD_EXCEEDED",
  "EXCHANGEABILITY_MINIMUM_NOT_MET",
] as const;

export type GateAReasonV0_1B = (typeof GATE_A_REASON_CODES_V0_1B)[number];
export type CalibrationOutcomeV0_1B =
  | "SPARSE"
  | "INSUFFICIENT_EVIDENCE"
  | "STRUCTURAL_BUT_CONFOUNDED"
  | "NULL"
  | "CVC_CONFIGURATIONAL_SUPPORT";
export type ReachableOutcomeV0_1B = CalibrationOutcomeV0_1B;

export type SyntheticStructuralRecordV0_1B = Readonly<{
  recordId: string;
  fixtureId: string;
  replicateId: string;
  independenceGroupId: string;
  C_L: string;
  V: string;
  C_R: string;
  P: string;
  stratumId: string;
  stableSlotId: string;
  tokenLengthClass: string;
  geometryClass: string;
  clusterAdjacent: boolean;
  topology?: string;
}>;

export type WeightedSyntheticStructuralRecordV0_1B =
  SyntheticStructuralRecordV0_1B &
    Readonly<{
      weight: number;
      rawCount: number;
    }>;

export type NormalizationResultV0_1B = Readonly<{
  eligibleRecords: readonly SyntheticStructuralRecordV0_1B[];
  excludedClusterAdjacentRecordIds: readonly string[];
  excludedRepeatedRecordIds: readonly string[];
}>;

export type GroupStratumMassV0_1B = Readonly<{
  independenceGroupId: string;
  stratumId: string;
  rawCount: number;
  mass: number;
}>;

export type GateACriteriaV0_1B = Readonly<{
  minimumEligibleGroups: boolean;
  minimumVxpStrata: boolean;
  minimumGroupsPerIncludedStratum: boolean;
  minimumDistinctLeftIdentities: boolean;
  minimumDistinctRightIdentities: boolean;
  voiceCoverage: boolean;
  positionCoverage: boolean;
  rareIdentityWeight: boolean;
  concentration: boolean;
  exchangeability: boolean;
}>;

export type GateAMetricsV0_1B = Readonly<{
  eligibleGroups: number;
  vxpStrata: number;
  groupsPerIncludedStratum: Readonly<Record<string, number>>;
  distinctLeftIdentitiesPerStratum: Readonly<Record<string, number>>;
  distinctRightIdentitiesPerStratum: Readonly<Record<string, number>>;
  groupsPerVoice: Readonly<Record<string, number>>;
  groupsPerPosition: Readonly<Record<string, number>>;
  rareIdentityWeight: number;
  concentrationRatioByStratum: Readonly<Record<string, number>>;
  exchangeabilityPoolSizes: readonly number[];
  maxExchangeabilityPool: number;
}>;

export type GateAResultV0_1B = Readonly<{
  pass: boolean;
  state: "PASS" | "SPARSE" | "STRUCTURAL_BUT_CONFOUNDED" | "INSUFFICIENT_EVIDENCE";
  reason: GateAReasonV0_1B | null;
  criteria: GateACriteriaV0_1B;
  metrics: GateAMetricsV0_1B;
}>;

export type StructuralSlotV0_1B = Readonly<{
  slotId: string;
  recordId: string;
  stratumId: string;
  ordinalWithinGroupStratum: number;
  leftIdentity: string;
  rightIdentity: string;
  tokenLengthClass: string;
  geometryClass: string;
}>;

export type StructuralGroupProfileV0_1B = Readonly<{
  groupId: string;
  signatureClassId: string;
  signatureKey: string;
  slots: readonly StructuralSlotV0_1B[];
  recipient: RecipientV0_1B;
  donor: DonorProfileV0_1B;
}>;

export type SignatureProfileAdapterV0_1B = Readonly<{
  classes: readonly ExactNullSignatureClassV0_1B[];
  profiles: readonly StructuralGroupProfileV0_1B[];
}>;

export type GateBResultV0_1B =
  | Readonly<{
      status: "NOT_RUN";
    }>
  | Readonly<{
      status: "READY";
      branch: "EXHAUSTIVE" | "MONTE_CARLO";
      totalCount: bigint;
    }>
  | Readonly<{
      status: "FAILURE";
      reason: ExactNullFailureReasonV0_1B;
      domain: "FINITE_SCIENTIFIC" | "RESOURCE" | "COMPUTATIONAL";
    }>;

export type SyntheticCalibrationOptionsV0_1B = Readonly<{
  fixtureId?: string;
  replicateId?: string;
  permutationStreamId?: string;
}>;

export type SyntheticCalibrationResultV0_1B = Readonly<{
  fixtureId: string;
  replicateId: string;
  state: CalibrationOutcomeV0_1B;
  reason: GateAReasonV0_1B | ExactNullFailureReasonV0_1B | null;
  pValue: number | null;
  statistic: number | null;
  gateA: GateAResultV0_1B;
  gateB: GateBResultV0_1B;
  normalization: NormalizationResultV0_1B;
  weightedRecords: readonly WeightedSyntheticStructuralRecordV0_1B[];
  adapter: SignatureProfileAdapterV0_1B | null;
  seedWords: readonly [bigint, bigint, bigint, bigint];
  permutationStreamId: string;
  exhaustiveExceedances: number | null;
  monteCarloExceedances: number | null;
  monteCarloDraws: number | null;
  duplicateMonteCarloDrawsRetained: boolean;
  noLocalization: true;
  realDataClusterAdjacencyRule: "UNRESOLVED";
  realDataFrd02ExecutionBlocker: "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN";
}>;

export class SyntheticCalibrationValidationErrorV0_1B extends TypeError {
  readonly code: string;

  constructor(code: string) {
    super(code);
    this.name = "SyntheticCalibrationValidationErrorV0_1B";
    this.code = code;
    Object.setPrototypeOf(this, SyntheticCalibrationValidationErrorV0_1B.prototype);
  }
}

function validationFailure(code: string): never {
  throw new SyntheticCalibrationValidationErrorV0_1B(code);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function assertString(value: unknown, code: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) validationFailure(code);
}

function assertCanonicalReplicateId(value: string): void {
  if (!/^(0|[1-9][0-9]*)$/.test(value)) validationFailure("INVALID_REPLICATE_ID");
}

function assertFixtureId(value: string): void {
  if (!FIXTURE_ID_SET.has(value) || value.includes("|")) validationFailure("INVALID_FIXTURE_ID");
}

function assertDelimiterFree(value: string, code: string): void {
  if (!/^[A-Za-z0-9_-]+$/.test(value) || value.includes("|")) validationFailure(code);
}

function validateRecordValue(value: unknown): SyntheticStructuralRecordV0_1B {
  if (!isObject(value)) validationFailure("MALFORMED_SYNTHETIC_RECORD");
  for (const key of Object.keys(value)) {
    if (!ANALYZER_RECORD_KEYS.has(key)) validationFailure("UNAUTHORIZED_ANALYZER_FIELD");
  }
  const record = value as Record<string, unknown>;
  const requiredStrings = [
    ["recordId", "INVALID_RECORD_ID"],
    ["fixtureId", "INVALID_FIXTURE_ID"],
    ["replicateId", "INVALID_REPLICATE_ID"],
    ["independenceGroupId", "INVALID_INDEPENDENCE_GROUP_ID"],
    ["C_L", "INVALID_LEFT_IDENTITY"],
    ["V", "INVALID_VOICE"],
    ["C_R", "INVALID_RIGHT_IDENTITY"],
    ["P", "INVALID_POSITION"],
    ["stratumId", "INVALID_STRATUM_ID"],
    ["stableSlotId", "INVALID_STABLE_SLOT_ID"],
    ["tokenLengthClass", "INVALID_TOKEN_LENGTH_CLASS"],
    ["geometryClass", "INVALID_GEOMETRY_CLASS"],
  ] as const;
  for (const [field, code] of requiredStrings) assertString(record[field], code);
  if (typeof record.clusterAdjacent !== "boolean") {
    validationFailure(record.clusterAdjacent === undefined ? "MISSING_CLUSTER_ADJACENT" : "INVALID_CLUSTER_ADJACENT");
  }
  const fixtureId = record.fixtureId as string;
  const replicateId = record.replicateId as string;
  const stratumId = record.stratumId as string;
  const voice = record.V as string;
  const position = record.P as string;
  assertFixtureId(fixtureId);
  assertCanonicalReplicateId(replicateId);
  const stratum = STRATUM_BY_ID.get(stratumId);
  if (stratum === undefined) validationFailure("INVALID_STRATUM_ID");
  if (voice !== stratum.voice || position !== stratum.position) {
    validationFailure("STRATUM_VOICE_POSITION_MISMATCH");
  }
  if (record.topology !== undefined) assertString(record.topology, "INVALID_TOPOLOGY");
  return record as SyntheticStructuralRecordV0_1B;
}

export function validateSyntheticStructuralRecordV0_1B(
  value: unknown,
): SyntheticStructuralRecordV0_1B {
  return validateRecordValue(value);
}

export function validateSyntheticStructuralRecordsV0_1B(
  values: readonly unknown[],
): readonly SyntheticStructuralRecordV0_1B[] {
  if (!Array.isArray(values)) validationFailure("INVALID_SYNTHETIC_RECORDS");
  const records = values.map(validateRecordValue);
  const recordIds = new Set<string>();
  let fixtureId: string | null = null;
  let replicateId: string | null = null;
  for (const record of records) {
    if (recordIds.has(record.recordId)) validationFailure("DUPLICATE_RECORD_ID");
    recordIds.add(record.recordId);
    if (fixtureId === null) fixtureId = record.fixtureId;
    if (replicateId === null) replicateId = record.replicateId;
    if (record.fixtureId !== fixtureId) validationFailure("MIXED_FIXTURE_IDS");
    if (record.replicateId !== replicateId) validationFailure("MIXED_REPLICATE_IDS");
  }
  return records;
}

function compareRecordsForSlot(left: SyntheticStructuralRecordV0_1B, right: SyntheticStructuralRecordV0_1B): number {
  const positionOrder = canonicalCompareV0_1B(left.P, right.P);
  if (positionOrder !== 0) return positionOrder;
  const stableSlotOrder = canonicalCompareV0_1B(left.stableSlotId, right.stableSlotId);
  if (stableSlotOrder !== 0) return stableSlotOrder;
  return canonicalCompareV0_1B(left.recordId, right.recordId);
}

function compareRecordsCanonical(
  left: SyntheticStructuralRecordV0_1B,
  right: SyntheticStructuralRecordV0_1B,
): number {
  const groupOrder = canonicalCompareV0_1B(left.independenceGroupId, right.independenceGroupId);
  if (groupOrder !== 0) return groupOrder;
  const leftIndex = STRATUM_INDEX.get(left.stratumId) ?? Number.MAX_SAFE_INTEGER;
  const rightIndex = STRATUM_INDEX.get(right.stratumId) ?? Number.MAX_SAFE_INTEGER;
  if (leftIndex !== rightIndex) return leftIndex - rightIndex;
  return compareRecordsForSlot(left, right);
}

function mapByGroupAndStratum<T>(
  records: readonly T[],
  group: (record: T) => string,
  stratum: (record: T) => string,
): Map<string, Map<string, T[]>> {
  const result = new Map<string, Map<string, T[]>>();
  for (const record of records) {
    const groupId = group(record);
    const stratumId = stratum(record);
    let byStratum = result.get(groupId);
    if (byStratum === undefined) {
      byStratum = new Map<string, T[]>();
      result.set(groupId, byStratum);
    }
    let rows = byStratum.get(stratumId);
    if (rows === undefined) {
      rows = [];
      byStratum.set(stratumId, rows);
    }
    rows.push(record);
  }
  return result;
}

export function normalizePrimaryRecordsV0_1B(
  values: readonly unknown[],
): NormalizationResultV0_1B {
  const records = validateSyntheticStructuralRecordsV0_1B(values);
  const excludedClusterAdjacentRecordIds: string[] = [];
  const afterCluster = records.filter((record) => {
    if (record.clusterAdjacent) {
      excludedClusterAdjacentRecordIds.push(record.recordId);
      return false;
    }
    return true;
  });
  const excludedRepeatedRecordIds: string[] = [];
  const eligibleRecords = afterCluster.filter((record) => {
    if (record.C_L === record.C_R) {
      excludedRepeatedRecordIds.push(record.recordId);
      return false;
    }
    return true;
  });
  return {
    eligibleRecords: [...eligibleRecords].sort(compareRecordsCanonical),
    excludedClusterAdjacentRecordIds,
    excludedRepeatedRecordIds,
  };
}

export function applyGroupStratumWeightsV0_1B(
  records: readonly SyntheticStructuralRecordV0_1B[],
): readonly WeightedSyntheticStructuralRecordV0_1B[] {
  const counts = mapByGroupAndStratum(records, (record) => record.independenceGroupId, (record) => record.stratumId);
  return [...records]
    .sort(compareRecordsCanonical)
    .map((record) => {
      const rawCount = counts.get(record.independenceGroupId)?.get(record.stratumId)?.length ?? 0;
      if (rawCount <= 0) validationFailure("MISSING_GROUP_STRATUM_COUNT");
      return { ...record, rawCount, weight: 1 / rawCount };
    });
}

export function groupStratumMassesV0_1B(
  records: readonly WeightedSyntheticStructuralRecordV0_1B[],
): readonly GroupStratumMassV0_1B[] {
  const masses = new Map<string, GroupStratumMassV0_1B>();
  for (const record of records) {
    const key = record.independenceGroupId + "\u0000" + record.stratumId;
    const existing = masses.get(key);
    if (existing === undefined) {
      masses.set(key, {
        independenceGroupId: record.independenceGroupId,
        stratumId: record.stratumId,
        rawCount: record.rawCount,
        mass: record.weight,
      });
    } else {
      masses.set(key, { ...existing, mass: existing.mass + record.weight });
    }
  }
  return [...masses.values()].sort((left, right) => {
    const groupOrder = canonicalCompareV0_1B(left.independenceGroupId, right.independenceGroupId);
    return groupOrder !== 0 ? groupOrder : canonicalCompareV0_1B(left.stratumId, right.stratumId);
  });
}

function encodeHex(bytes: Uint8Array): string {
  let result = "";
  for (const byte of bytes) result += byte.toString(16).padStart(2, "0");
  return result;
}

function lengthPrefixedUtf8Vector(values: readonly string[]): string {
  const encoder = new TextEncoder();
  return values
    .map((value) => {
      const bytes = encoder.encode(value);
      return bytes.length.toString(16).padStart(8, "0") + encodeHex(bytes);
    })
    .join("");
}

function structuralGroupLayouts(
  records: readonly WeightedSyntheticStructuralRecordV0_1B[],
): readonly StructuralGroupProfileV0_1B[] {
  const grouped = mapByGroupAndStratum(records, (record) => record.independenceGroupId, (record) => record.stratumId);
  const groupIds = [...grouped.keys()].sort(canonicalCompareV0_1B);
  const profiles: StructuralGroupProfileV0_1B[] = [];
  for (const groupId of groupIds) {
    const byStratum = grouped.get(groupId);
    if (byStratum === undefined) continue;
    const slots: StructuralSlotV0_1B[] = [];
    const counts: string[] = [];
    const geometry: string[] = [];
    for (const stratum of STRATA_V0_1B) {
      const rows = [...(byStratum.get(stratum.id) ?? [])].sort((left, right) =>
        compareRecordsForSlot(left, right),
      );
      counts.push(String(rows.length));
      for (let ordinal = 0; ordinal < rows.length; ordinal += 1) {
        const record = rows[ordinal];
        const slotId = lengthPrefixedUtf8Vector([record.stratumId, String(ordinal)]);
        slots.push({
          slotId,
          recordId: record.recordId,
          stratumId: record.stratumId,
          ordinalWithinGroupStratum: ordinal,
          leftIdentity: record.C_L,
          rightIdentity: record.C_R,
          tokenLengthClass: record.tokenLengthClass,
          geometryClass: record.geometryClass,
        });
        geometry.push(
          record.stratumId,
          String(ordinal),
          record.tokenLengthClass,
          record.geometryClass,
        );
      }
    }
    const signatureKey = lengthPrefixedUtf8Vector([
      "VXP_SLOT_COUNTS",
      ...counts,
      "SECONDARY_GEOMETRY",
      ...geometry,
    ]);
    const signatureClassId = "sig-" + signatureKey;
    const primarySlots: PrimarySlotV0_1B[] = slots.map((slot) => ({
      slotId: slot.slotId,
      leftIdentity: slot.leftIdentity,
    }));
    const rightIdentityBySlot = slots.map((slot) => ({
      slotId: slot.slotId,
      rightIdentity: slot.rightIdentity,
    }));
    const recipient: RecipientV0_1B = {
      recipientId: groupId,
      signatureClassId,
      primarySlots,
    };
    const donor: DonorProfileV0_1B = {
      donorId: groupId,
      signatureClassId,
      rightIdentityBySlot,
    };
    profiles.push({ groupId, signatureClassId, signatureKey, slots, recipient, donor });
  }
  return profiles;
}

export function buildSignatureProfileAdapterV0_1B(
  records: readonly WeightedSyntheticStructuralRecordV0_1B[],
): SignatureProfileAdapterV0_1B {
  const profiles = structuralGroupLayouts(records);
  const bySignature = new Map<string, StructuralGroupProfileV0_1B[]>();
  for (const profile of profiles) {
    const members = bySignature.get(profile.signatureClassId) ?? [];
    members.push(profile);
    bySignature.set(profile.signatureClassId, members);
  }
  const classes: ExactNullSignatureClassV0_1B[] = [];
  for (const signatureClassId of [...bySignature.keys()].sort(canonicalCompareV0_1B)) {
    const members = [...(bySignature.get(signatureClassId) ?? [])].sort((left, right) =>
      canonicalCompareV0_1B(left.groupId, right.groupId),
    );
    const first = members[0];
    if (first === undefined) continue;
    const observedAssignment: ObservedAssignmentV0_1B[] = members.map((member) => ({
      recipientId: member.recipient.recipientId,
      donorId: member.donor.donorId,
    }));
    classes.push({
      signatureClassId,
      primarySlotIds: first.slots.map((slot) => slot.slotId),
      recipients: members.map((member) => member.recipient),
      donors: members.map((member) => member.donor),
      observedAssignment,
    });
  }
  return { classes, profiles };
}

function sortedKeys<T>(map: Map<string, T>): string[] {
  return [...map.keys()].sort(canonicalCompareV0_1B);
}

function getNestedNumberMap(
  map: Map<string, Map<string, number>>,
  first: string,
  second: string,
): number {
  return map.get(first)?.get(second) ?? 0;
}

function addNestedNumber(
  map: Map<string, Map<string, number>>,
  first: string,
  second: string,
  value: number,
): void {
  let secondMap = map.get(first);
  if (secondMap === undefined) {
    secondMap = new Map<string, number>();
    map.set(first, secondMap);
  }
  secondMap.set(second, (secondMap.get(second) ?? 0) + value);
}

function signaturePoolSizes(
  records: readonly WeightedSyntheticStructuralRecordV0_1B[],
): number[] {
  const profiles = structuralGroupLayouts(records);
  const counts = new Map<string, number>();
  for (const profile of profiles) {
    counts.set(profile.signatureClassId, (counts.get(profile.signatureClassId) ?? 0) + 1);
  }
  return [...counts.values()].sort((left, right) => right - left);
}

export function evaluateGateAV0_1B(
  records: readonly WeightedSyntheticStructuralRecordV0_1B[],
): GateAResultV0_1B {
  const groups = new Set(records.map((record) => record.independenceGroupId));
  const strata = new Map<string, WeightedSyntheticStructuralRecordV0_1B[]>();
  const voiceGroups = new Map<string, Set<string>>();
  const positionGroups = new Map<string, Set<string>>();
  const identityGroups = new Map<string, Set<string>>();
  const groupStratumUnits = new Set<string>();
  const rawByStratumGroup = new Map<string, number>();
  for (const record of records) {
    const rows = strata.get(record.stratumId) ?? [];
    rows.push(record);
    strata.set(record.stratumId, rows);
    const voiceSet = voiceGroups.get(record.V) ?? new Set<string>();
    voiceSet.add(record.independenceGroupId);
    voiceGroups.set(record.V, voiceSet);
    const positionSet = positionGroups.get(record.P) ?? new Set<string>();
    positionSet.add(record.independenceGroupId);
    positionGroups.set(record.P, positionSet);
    for (const identity of [record.C_L, record.C_R]) {
      const identitySet = identityGroups.get(identity) ?? new Set<string>();
      identitySet.add(record.independenceGroupId);
      identityGroups.set(identity, identitySet);
    }
    groupStratumUnits.add(record.independenceGroupId + "\u0000" + record.stratumId);
    const rawKey = record.stratumId + "\u0000" + record.independenceGroupId;
    rawByStratumGroup.set(rawKey, (rawByStratumGroup.get(rawKey) ?? 0) + 1);
  }
  const rareIdentities = new Set(
    [...identityGroups.entries()]
      .filter(([, identitySet]) => identitySet.size < 3)
      .map(([identity]) => identity),
  );
  const rareUnits = new Set<string>();
  for (const record of records) {
    if (rareIdentities.has(record.C_L) || rareIdentities.has(record.C_R)) {
      rareUnits.add(record.independenceGroupId + "\u0000" + record.stratumId);
    }
  }
  const rareIdentityWeight =
    groupStratumUnits.size === 0 ? 0 : rareUnits.size / groupStratumUnits.size;

  const groupsPerIncludedStratum: Record<string, number> = {};
  const distinctLeftIdentitiesPerStratum: Record<string, number> = {};
  const distinctRightIdentitiesPerStratum: Record<string, number> = {};
  const concentrationRatioByStratum: Record<string, number> = {};
  let concentrationFailure = false;
  for (const [stratumId, rows] of strata.entries()) {
    const stratumGroups = new Set(rows.map((record) => record.independenceGroupId));
    groupsPerIncludedStratum[stratumId] = stratumGroups.size;
    distinctLeftIdentitiesPerStratum[stratumId] = new Set(rows.map((record) => record.C_L)).size;
    distinctRightIdentitiesPerStratum[stratumId] = new Set(rows.map((record) => record.C_R)).size;
    const groupCounts = new Map<string, number>();
    for (const record of rows) {
      groupCounts.set(
        record.independenceGroupId,
        (groupCounts.get(record.independenceGroupId) ?? 0) + 1,
      );
    }
    const maxRaw = Math.max(0, ...groupCounts.values());
    const ratio = rows.length === 0 ? 0 : maxRaw / rows.length;
    concentrationRatioByStratum[stratumId] = ratio;
    if (ratio > GATE_A_THRESHOLDS_V0_1B.CONCENTRATION_RATIO_MAX) concentrationFailure = true;
  }
  const groupsPerVoice: Record<string, number> = Object.fromEntries(
    VOICE_IDS.map((voice) => [voice, voiceGroups.get(voice)?.size ?? 0]),
  );
  const groupsPerPosition: Record<string, number> = Object.fromEntries(
    POSITION_IDS.map((position) => [position, positionGroups.get(position)?.size ?? 0]),
  );
  const criteria: GateACriteriaV0_1B = {
    minimumEligibleGroups:
      groups.size >= GATE_A_THRESHOLDS_V0_1B.MIN_ELIGIBLE_GROUPS,
    minimumVxpStrata:
      strata.size >= GATE_A_THRESHOLDS_V0_1B.MIN_VXP_STRATA,
    minimumGroupsPerIncludedStratum: Object.values(groupsPerIncludedStratum).every(
      (value) => value >= GATE_A_THRESHOLDS_V0_1B.MIN_GROUPS_PER_INCLUDED_STRATUM,
    ),
    minimumDistinctLeftIdentities: Object.values(distinctLeftIdentitiesPerStratum).every(
      (value) => value >= GATE_A_THRESHOLDS_V0_1B.MIN_DISTINCT_LEFT_IDENTITIES_PER_STRATUM,
    ),
    minimumDistinctRightIdentities: Object.values(distinctRightIdentitiesPerStratum).every(
      (value) => value >= GATE_A_THRESHOLDS_V0_1B.MIN_DISTINCT_RIGHT_IDENTITIES_PER_STRATUM,
    ),
    voiceCoverage: VOICE_IDS.every(
      (voice) => (voiceGroups.get(voice)?.size ?? 0) >= GATE_A_THRESHOLDS_V0_1B.MIN_GROUPS_PER_VOICE,
    ),
    positionCoverage: POSITION_IDS.every(
      (position) =>
        (positionGroups.get(position)?.size ?? 0) >= GATE_A_THRESHOLDS_V0_1B.MIN_GROUPS_PER_POSITION,
    ),
    rareIdentityWeight:
      rareIdentityWeight <= GATE_A_THRESHOLDS_V0_1B.RARE_IDENTITY_WEIGHT_MAX,
    concentration: !concentrationFailure,
    exchangeability:
      (signaturePoolSizes(records)[0] ?? 0) >=
      GATE_A_THRESHOLDS_V0_1B.MIN_EXCHANGEABLE_NULL_POOL_GROUPS,
  };
  const metrics: GateAMetricsV0_1B = {
    eligibleGroups: groups.size,
    vxpStrata: strata.size,
    groupsPerIncludedStratum,
    distinctLeftIdentitiesPerStratum,
    distinctRightIdentitiesPerStratum,
    groupsPerVoice,
    groupsPerPosition,
    rareIdentityWeight,
    concentrationRatioByStratum,
    exchangeabilityPoolSizes: signaturePoolSizes(records),
    maxExchangeabilityPool: signaturePoolSizes(records)[0] ?? 0,
  };
  let reason: GateAReasonV0_1B | null = null;
  let state: GateAResultV0_1B["state"] = "PASS";
  if (!criteria.rareIdentityWeight) {
    reason = "RARE_IDENTITY_SPARSE_THRESHOLD_EXCEEDED";
    state = "SPARSE";
  } else if (!criteria.concentration) {
    reason = "CONCENTRATION_CONFOUND_THRESHOLD_EXCEEDED";
    state = "STRUCTURAL_BUT_CONFOUNDED";
  } else {
    const remainingFailures: readonly [GateAReasonV0_1B, boolean][] = [
      ["MINIMUM_ELIGIBLE_GROUPS_NOT_MET", criteria.minimumEligibleGroups],
      ["MINIMUM_VXP_STRATA_NOT_MET", criteria.minimumVxpStrata],
      ["MINIMUM_GROUPS_PER_STRATUM_NOT_MET", criteria.minimumGroupsPerIncludedStratum],
      ["MINIMUM_DISTINCT_LEFT_IDENTITIES_NOT_MET", criteria.minimumDistinctLeftIdentities],
      ["MINIMUM_DISTINCT_RIGHT_IDENTITIES_NOT_MET", criteria.minimumDistinctRightIdentities],
      ["VOICE_COVERAGE_MINIMUM_NOT_MET", criteria.voiceCoverage],
      ["POSITION_COVERAGE_MINIMUM_NOT_MET", criteria.positionCoverage],
      ["EXCHANGEABILITY_MINIMUM_NOT_MET", criteria.exchangeability],
    ];
    const failed = remainingFailures.find(([, passed]) => !passed);
    if (failed !== undefined) {
      reason = failed[0];
      state = "INSUFFICIENT_EVIDENCE";
    }
  }
  return {
    pass: reason === null,
    state,
    reason,
    criteria,
    metrics,
  };
}

export function calculateStatisticV0_1B(
  records: readonly WeightedSyntheticStructuralRecordV0_1B[],
  rightIdentityOverrides?: ReadonlyMap<string, string>,
): number {
  const cells = new Map<string, Map<string, Map<string, number>>>();
  const rows = new Map<string, Map<string, number>>();
  const columns = new Map<string, Map<string, number>>();
  const totals = new Map<string, number>();
  for (const record of records) {
    const rightIdentity = rightIdentityOverrides?.get(record.recordId) ?? record.C_R;
    const cellByLeft = cells.get(record.stratumId) ?? new Map<string, Map<string, number>>();
    const rightByLeft = cellByLeft.get(record.C_L) ?? new Map<string, number>();
    rightByLeft.set(rightIdentity, (rightByLeft.get(rightIdentity) ?? 0) + record.weight);
    cellByLeft.set(record.C_L, rightByLeft);
    cells.set(record.stratumId, cellByLeft);
    addNestedNumber(rows, record.stratumId, record.C_L, record.weight);
    addNestedNumber(columns, record.stratumId, rightIdentity, record.weight);
    totals.set(record.stratumId, (totals.get(record.stratumId) ?? 0) + record.weight);
  }
  let statistic = 0;
  const orderedStrata = [...cells.keys()].sort((left, right) => {
    const leftIndex = STRATUM_INDEX.get(left) ?? Number.MAX_SAFE_INTEGER;
    const rightIndex = STRATUM_INDEX.get(right) ?? Number.MAX_SAFE_INTEGER;
    return leftIndex - rightIndex || canonicalCompareV0_1B(left, right);
  });
  for (const stratumId of orderedStrata) {
    const cellByLeft = cells.get(stratumId);
    if (cellByLeft === undefined) continue;
    const total = totals.get(stratumId) ?? 0;
    for (const left of sortedKeys(cellByLeft)) {
      const rightByLeft = cellByLeft.get(left);
      if (rightByLeft === undefined) continue;
      for (const right of sortedKeys(rightByLeft)) {
        const observed = rightByLeft.get(right) ?? 0;
        const row = getNestedNumberMap(rows, stratumId, left);
        const column = getNestedNumberMap(columns, stratumId, right);
        if (observed <= 0 || row <= 0 || column <= 0 || total <= 0) continue;
        statistic += 2 * observed * Math.log((observed * total) / (row * column));
      }
    }
  }
  return statistic;
}

function resolveIdentityContext(
  records: readonly SyntheticStructuralRecordV0_1B[],
  options: SyntheticCalibrationOptionsV0_1B,
): { fixtureId: string; replicateId: string; permutationStreamId: string } {
  for (const key of Object.keys(options)) {
    if (!ANALYZER_OPTION_KEYS.has(key)) validationFailure("UNAUTHORIZED_ANALYZER_OPTION");
  }
  const fixtureId = options.fixtureId ?? records[0]?.fixtureId;
  const replicateId = options.replicateId ?? records[0]?.replicateId;
  const permutationStreamId = options.permutationStreamId ?? "permutation-primary";
  if (fixtureId === undefined || replicateId === undefined) {
    validationFailure("MISSING_SEED_IDENTITY_CONTEXT");
  }
  assertFixtureId(fixtureId);
  assertCanonicalReplicateId(replicateId);
  assertDelimiterFree(permutationStreamId, "INVALID_PERMUTATION_STREAM_ID");
  for (const record of records) {
    if (record.fixtureId !== fixtureId) validationFailure("FIXTURE_ID_CONTEXT_MISMATCH");
    if (record.replicateId !== replicateId) validationFailure("REPLICATE_ID_CONTEXT_MISMATCH");
  }
  return { fixtureId, replicateId, permutationStreamId };
}

export function canonicalSeedTupleV0_1B(
  fixtureId: string,
  replicateId: string,
  permutationStreamId = "permutation-primary",
): string {
  assertFixtureId(fixtureId);
  assertCanonicalReplicateId(replicateId);
  assertDelimiterFree(permutationStreamId, "INVALID_PERMUTATION_STREAM_ID");
  return [
    "FRD02_CVC_STRUCTURAL_ZERO_NULL_V0_1",
    "primary",
    AMENDED_CONTRACT_SHA256_V0_1B,
    GENERATOR_CONTRACT_SHA256_V0_1B,
    ANALYZER_CONTRACT_SHA256_V0_1B,
    fixtureId,
    replicateId,
    permutationStreamId,
  ].join("|");
}

export function seedWordsV0_1B(
  fixtureId: string,
  replicateId: string,
  permutationStreamId = "permutation-primary",
): readonly [bigint, bigint, bigint, bigint] {
  const serialized = canonicalSeedTupleV0_1B(fixtureId, replicateId, permutationStreamId);
  const digest = createHash("sha256").update(Buffer.from(serialized, "utf8")).digest();
  const words: [bigint, bigint, bigint, bigint] = [
    digest.readBigUInt64LE(0),
    digest.readBigUInt64LE(8),
    digest.readBigUInt64LE(16),
    digest.readBigUInt64LE(24),
  ];
  return words.every((word) => word === BigInt(0))
    ? [BigInt(1), BigInt(0), BigInt(0), BigInt(0)]
    : words;
}

function profileByGroup(
  adapter: SignatureProfileAdapterV0_1B,
): Map<string, StructuralGroupProfileV0_1B> {
  return new Map(adapter.profiles.map((profile) => [profile.groupId, profile]));
}

function overrideMapForAssignment(
  adapter: SignatureProfileAdapterV0_1B,
  assignment: readonly { signatureClassId: string; recipientId: string; donorId: string }[],
): ReadonlyMap<string, string> {
  const profiles = profileByGroup(adapter);
  const overrides = new Map<string, string>();
  for (const entry of assignment) {
    const recipient = profiles.get(entry.recipientId);
    const donor = profiles.get(entry.donorId);
    if (
      recipient === undefined ||
      donor === undefined ||
      recipient.signatureClassId !== entry.signatureClassId ||
      donor.signatureClassId !== entry.signatureClassId
    ) {
      validationFailure("P2_ASSIGNMENT_PROFILE_MISMATCH");
    }
    const donorBySlot = new Map(donor.slots.map((slot) => [slot.slotId, slot.rightIdentity]));
    for (const slot of recipient.slots) {
      const donorRight = donorBySlot.get(slot.slotId);
      if (donorRight === undefined) validationFailure("INCOMPLETE_DONOR_PROFILE");
      overrides.set(slot.recordId, donorRight);
    }
  }
  return overrides;
}

function p2FailureToGateB(
  result:
    | Extract<ExactNullCountResultV0_1B, { status: "FAILURE" | "FINITE_FAILURE" }>
    | Extract<ExactNullEnumerationResultV0_1B, { status: "FAILURE" | "FINITE_FAILURE" }>
    | Extract<ExactNullSampleResultV0_1B, { status: "FAILURE" | "FINITE_FAILURE" }>,
): Extract<GateBResultV0_1B, { status: "FAILURE" }> {
  if (result.status === "FINITE_FAILURE") {
    return {
      status: "FAILURE",
      reason: result.reason,
      domain: "FINITE_SCIENTIFIC",
    };
  }
  return {
    status: "FAILURE",
    reason: result.reason,
    domain: result.domain,
  };
}

export function mapP2FailureToGateBV0_1B(
  result: Readonly<{
    status: "FAILURE" | "FINITE_FAILURE";
    reason: ExactNullFailureReasonV0_1B;
    domain?: "FINITE_SCIENTIFIC" | "RESOURCE" | "COMPUTATIONAL";
  }>,
): Extract<GateBResultV0_1B, { status: "FAILURE" }> {
  return {
    status: "FAILURE",
    reason: result.reason,
    domain: result.status === "FINITE_FAILURE" ? "FINITE_SCIENTIFIC" : result.domain ?? "COMPUTATIONAL",
  };
}

export function finiteNullBranchForCountV0_1B(
  totalCount: bigint,
): "P2_FAILURE" | "ONLY_OBSERVED_REALIZATION" | "INSUFFICIENT_DISTINCT_NULL_REALIZATIONS" | "EXHAUSTIVE" | "MONTE_CARLO" {
  if (totalCount === BigInt(0)) return "P2_FAILURE";
  if (totalCount === BigInt(1)) return "ONLY_OBSERVED_REALIZATION";
  if (totalCount < BigInt(21)) return "INSUFFICIENT_DISTINCT_NULL_REALIZATIONS";
  if (totalCount <= BigInt(MAX_EXHAUSTIVE_NULL_REALIZATIONS_V0_1B)) return "EXHAUSTIVE";
  return "MONTE_CARLO";
}

export function exhaustivePValueV0_1B(exceedances: number, totalCount: bigint): number {
  if (totalCount < BigInt(21) || totalCount > BigInt(MAX_EXHAUSTIVE_NULL_REALIZATIONS_V0_1B)) {
    validationFailure("INVALID_EXHAUSTIVE_TOTAL_COUNT");
  }
  if (!Number.isInteger(exceedances) || exceedances < 0) validationFailure("INVALID_EXCEEDANCE_COUNT");
  return exceedances / Number(totalCount);
}

export function monteCarloPValueV0_1B(exceedances: number): number {
  if (!Number.isInteger(exceedances) || exceedances < 0 || exceedances > MONTE_CARLO_DRAWS_V0_1B) {
    validationFailure("INVALID_EXCEEDANCE_COUNT");
  }
  return (1 + exceedances) / (MONTE_CARLO_DRAWS_V0_1B + 1);
}

export function classifyPrimaryPValueV0_1B(
  primaryP: number,
  gateAPass = true,
  gateBPass = true,
): "NULL" | "CVC_CONFIGURATIONAL_SUPPORT" | "INSUFFICIENT_EVIDENCE" {
  if (!gateAPass || !gateBPass) return "INSUFFICIENT_EVIDENCE";
  if (!Number.isFinite(primaryP)) validationFailure("INVALID_PRIMARY_P_VALUE");
  return primaryP > ALPHA_V0_1B ? "NULL" : "CVC_CONFIGURATIONAL_SUPPORT";
}

function observedAssignmentForClass(
  adapter: SignatureProfileAdapterV0_1B,
): readonly ObservedAssignmentV0_1B[] {
  return adapter.classes.flatMap((signatureClass) => signatureClass.observedAssignment ?? []);
}

function buildBaseResult(
  fixtureId: string,
  replicateId: string,
  gateA: GateAResultV0_1B,
  normalization: NormalizationResultV0_1B,
  weightedRecords: readonly WeightedSyntheticStructuralRecordV0_1B[],
  seedWords: readonly [bigint, bigint, bigint, bigint],
  permutationStreamId: string,
): {
  fixtureId: string;
  replicateId: string;
  gateA: GateAResultV0_1B;
  normalization: NormalizationResultV0_1B;
  weightedRecords: readonly WeightedSyntheticStructuralRecordV0_1B[];
  seedWords: readonly [bigint, bigint, bigint, bigint];
  permutationStreamId: string;
} {
  return {
    fixtureId,
    replicateId,
    gateA,
    normalization,
    weightedRecords,
    seedWords,
    permutationStreamId,
  };
}

export function analyzeSyntheticCalibrationV0_1B(
  values: readonly unknown[],
  options: SyntheticCalibrationOptionsV0_1B = {},
): SyntheticCalibrationResultV0_1B {
  const validatedRecords = validateSyntheticStructuralRecordsV0_1B(values);
  const identity = resolveIdentityContext(validatedRecords, options);
  const normalization = normalizePrimaryRecordsV0_1B(validatedRecords);
  const weightedRecords = applyGroupStratumWeightsV0_1B(normalization.eligibleRecords);
  const gateA = evaluateGateAV0_1B(weightedRecords);
  const seedWords = seedWordsV0_1B(
    identity.fixtureId,
    identity.replicateId,
    identity.permutationStreamId,
  );
  const base = buildBaseResult(
    identity.fixtureId,
    identity.replicateId,
    gateA,
    normalization,
    weightedRecords,
    seedWords,
    identity.permutationStreamId,
  );
  if (!gateA.pass) {
    return {
      ...base,
      state: gateA.state === "PASS" ? "INSUFFICIENT_EVIDENCE" : gateA.state,
      reason: gateA.reason,
      pValue: null,
      statistic: null,
      gateB: { status: "NOT_RUN" },
      adapter: null,
      exhaustiveExceedances: null,
      monteCarloExceedances: null,
      monteCarloDraws: null,
      duplicateMonteCarloDrawsRetained: false,
      noLocalization: true,
      realDataClusterAdjacencyRule: "UNRESOLVED",
      realDataFrd02ExecutionBlocker: "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN",
    };
  }

  const adapter = buildSignatureProfileAdapterV0_1B(weightedRecords);
  const observedStatistic = calculateStatisticV0_1B(weightedRecords);
  const countResult = countExactNullV0_1B(adapter.classes);
  if (countResult.status === "FAILURE" || countResult.status === "FINITE_FAILURE") {
    const gateB = p2FailureToGateB(countResult);
    return {
      ...base,
      state: "INSUFFICIENT_EVIDENCE",
      reason: gateB.reason,
      pValue: null,
      statistic: observedStatistic,
      gateB,
      adapter,
      exhaustiveExceedances: null,
      monteCarloExceedances: null,
      monteCarloDraws: null,
      duplicateMonteCarloDrawsRetained: false,
      noLocalization: true,
      realDataClusterAdjacencyRule: "UNRESOLVED",
      realDataFrd02ExecutionBlocker: "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN",
    };
  }

  const totalCount = countResult.totalCount;
  const branch = finiteNullBranchForCountV0_1B(totalCount);
  if (branch === "EXHAUSTIVE") {
    const enumeration = enumerateExactNullAssignmentsV0_1B(adapter.classes);
    if (enumeration.status === "FAILURE" || enumeration.status === "FINITE_FAILURE") {
      const gateB = p2FailureToGateB(enumeration);
      return {
        ...base,
        state: "INSUFFICIENT_EVIDENCE",
        reason: gateB.reason,
        pValue: null,
        statistic: observedStatistic,
        gateB,
        adapter,
        exhaustiveExceedances: null,
        monteCarloExceedances: null,
        monteCarloDraws: null,
        duplicateMonteCarloDrawsRetained: false,
        noLocalization: true,
        realDataClusterAdjacencyRule: "UNRESOLVED",
        realDataFrd02ExecutionBlocker: "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN",
      };
    }
    let exceedances = 0;
    for (const assignment of enumeration.assignments) {
      const overrides = overrideMapForAssignment(adapter, assignment);
      const nullStatistic = calculateStatisticV0_1B(weightedRecords, overrides);
      if (nullStatistic >= observedStatistic) exceedances += 1;
    }
    const pValue = exhaustivePValueV0_1B(exceedances, totalCount);
    const state = classifyPrimaryPValueV0_1B(pValue);
    return {
      ...base,
      state,
      reason: null,
      pValue,
      statistic: observedStatistic,
      gateB: { status: "READY", branch: "EXHAUSTIVE", totalCount },
      adapter,
      exhaustiveExceedances: exceedances,
      monteCarloExceedances: null,
      monteCarloDraws: null,
      duplicateMonteCarloDrawsRetained: false,
      noLocalization: true,
      realDataClusterAdjacencyRule: "UNRESOLVED",
      realDataFrd02ExecutionBlocker: "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN",
    };
  }

  if (branch !== "MONTE_CARLO") {
    const reason = branch === "P2_FAILURE"
      ? "NO_ADMISSIBLE_NULL_REALIZATIONS"
      : branch;
    return {
      ...base,
      state: "INSUFFICIENT_EVIDENCE",
      reason,
      pValue: null,
      statistic: observedStatistic,
      gateB: {
        status: "FAILURE",
        reason,
        domain: "FINITE_SCIENTIFIC",
      },
      adapter,
      exhaustiveExceedances: null,
      monteCarloExceedances: null,
      monteCarloDraws: null,
      duplicateMonteCarloDrawsRetained: false,
      noLocalization: true,
      realDataClusterAdjacencyRule: "UNRESOLVED",
      realDataFrd02ExecutionBlocker: "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN",
    };
  }

  const rng = new Xoshiro256ssV0_1B(seedWords);
  let exceedances = 0;
  for (let drawIndex = 0; drawIndex < MONTE_CARLO_DRAWS_V0_1B; drawIndex += 1) {
    const sample = sampleExactNullAssignmentV0_1B(adapter.classes, rng);
    if (sample.status === "FAILURE" || sample.status === "FINITE_FAILURE") {
      const gateB = p2FailureToGateB(sample);
      return {
        ...base,
        state: "INSUFFICIENT_EVIDENCE",
        reason: gateB.reason,
        pValue: null,
        statistic: observedStatistic,
        gateB,
        adapter,
        exhaustiveExceedances: null,
        monteCarloExceedances: exceedances,
        monteCarloDraws: drawIndex,
        duplicateMonteCarloDrawsRetained: true,
        noLocalization: true,
        realDataClusterAdjacencyRule: "UNRESOLVED",
        realDataFrd02ExecutionBlocker: "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN",
      };
    }
    const overrides = overrideMapForAssignment(adapter, sample.assignment);
    const nullStatistic = calculateStatisticV0_1B(weightedRecords, overrides);
    if (nullStatistic >= observedStatistic) exceedances += 1;
  }
  const pValue = monteCarloPValueV0_1B(exceedances);
  const state = classifyPrimaryPValueV0_1B(pValue);
  return {
    ...base,
    state,
    reason: null,
    pValue,
    statistic: observedStatistic,
    gateB: { status: "READY", branch: "MONTE_CARLO", totalCount },
    adapter,
    exhaustiveExceedances: null,
    monteCarloExceedances: exceedances,
    monteCarloDraws: MONTE_CARLO_DRAWS_V0_1B,
    duplicateMonteCarloDrawsRetained: true,
    noLocalization: true,
    realDataClusterAdjacencyRule: "UNRESOLVED",
    realDataFrd02ExecutionBlocker: "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN",
  };
}

export const analyzeSyntheticRecordsV0_1B = analyzeSyntheticCalibrationV0_1B;
export const analyzeSyntheticFixtureV0_1B = analyzeSyntheticCalibrationV0_1B;
