import { createHash } from "node:crypto";

import {
  ANALYZER_CONTRACT_SHA256_V0_1B,
  AMENDED_CONTRACT_SHA256_V0_1B,
  applyGroupStratumWeightsV0_1B,
  analyzeSyntheticCalibrationV0_1B,
  canonicalSeedTupleV0_1B,
  FIXTURE_IDS_V0_1B,
  GENERATOR_CONTRACT_SHA256_V0_1B,
  normalizePrimaryRecordsV0_1B,
  seedWordsV0_1B,
  STRATA_V0_1B,
  type CalibrationOutcomeV0_1B,
  type GateAReasonV0_1B,
  type SyntheticCalibrationResultV0_1B,
  type SyntheticStructuralRecordV0_1B,
} from "./frd02CvcSyntheticCalibration.v0_1b";
import type { ExactNullFailureReasonV0_1B } from "./frd02CvcExactNull.v0_1b";

export const P4_CONTRACT_ID_V0_1B = "OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_METHODOLOGY_V0_1";
export const P4_FIXTURE_CORRECTION_CONTRACT_ID_V0_1_1 =
  "OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_FIXTURE_TRUTH_CORRECTION_V0_1_1";
export const P4_HUMAN_CONTRACT_SHA256_V0_1B =
  "798278dbe0d3077700300dd9ad0c531dab422d3a46a7f488fc274b00ba74d5c9";
export const P4_MACHINE_CONTRACT_SHA256_V0_1B =
  "168ed4803d2a33690e88caf2d9bd138c0f0cd96bebd25248c0e1e63ab2927bea";
export const P4_FIXTURE_CORRECTION_MACHINE_SHA256_V0_1_1 =
  "20b593af98ac51f7c962d42debcf5a7f03dfcbfb6c3d64c70d9a27c8c6fe7a96";
export const P4_P1_P2_CORRECTION_MACHINE_SHA256_V0_1 =
  "ed81a8e85341a38d2b08b5a1b706c4699b9c3ad287dea048a70108ce7d436a47";
export const P4_SUBCASE_ALLOCATION_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_C6_C7_C8_SUBCASE_ALLOCATION_CORRECTION_V0_1";
export const P4_SUBCASE_ALLOCATION_HUMAN_SHA256_V0_1 =
  "b63b88783b2df96c93b38fe891a616b2801dbef42d175c7d7a1bb88e6a365547";
export const P4_SUBCASE_ALLOCATION_MACHINE_SHA256_V0_1 =
  "4c94d32b5089c5ea74a0c8a5e74e60616b561241d12723c180fafb48838f3f4e";
export const P4_MASTER_SEED_V0_1B = "FRD02_CVC_V0_1B_P4_MASTER_0";
export const P4_REPLICATE_IDS_V0_1B = ["0", "1", "2", "3", "4", "5", "6", "7"] as const;
export const P4_REPLICATES_PER_FIXTURE_V0_1B = P4_REPLICATE_IDS_V0_1B.length;
export const P4_TOTAL_EVALUATIONS_V0_1B = FIXTURE_IDS_V0_1B.length * P4_REPLICATES_PER_FIXTURE_V0_1B;
export const P4_PERMUTATION_STREAM_ID_V0_1B = "permutation-primary";

export type P4FixtureSubcaseV0_1B = "default" | "right" | "position";
export type P4MethodologyOutcomeV0_1B =
  | "CALIBRATION_PASS"
  | "CALIBRATION_FAIL"
  | "CALIBRATION_INVALID";

export type P4FixtureExpectationV0_1B = Readonly<{
  fixtureId: (typeof FIXTURE_IDS_V0_1B)[number];
  expectedGate: "PASS" | GateAReasonV0_1B | readonly GateAReasonV0_1B[];
  expectedP2:
    | "READY"
    | "NOT_RUN"
    | "EXHAUSTIVE"
    | "MONTE_CARLO"
    | "ONLY_OBSERVED_REALIZATION"
    | "FAILURE";
  expectedOutcomes: readonly CalibrationOutcomeV0_1B[];
}>;

export type P4SingleFixtureV0_1B = Readonly<{
  kind: "single";
  fixtureId: string;
  replicateId: string;
  records: readonly SyntheticStructuralRecordV0_1B[];
  constructionFingerprint: string;
}>;

export type P4PairFixtureV0_1B = Readonly<{
  kind: "pair";
  fixtureId: "N11";
  replicateId: string;
  ordered: P4SingleFixtureV0_1B;
  destroyed: P4SingleFixtureV0_1B;
  constructionFingerprint: string;
}>;

export type P4FixtureV0_1B = P4SingleFixtureV0_1B | P4PairFixtureV0_1B;

export type P4ScheduleEntryV0_1B = Readonly<{
  fixtureId: (typeof FIXTURE_IDS_V0_1B)[number];
  replicateId: string;
  subcase: P4FixtureSubcaseV0_1B;
  seedTuple: string;
  seedWords: readonly [string, string, string, string];
  constructionFingerprint: string;
}>;

export type P4ReplicateResultV0_1B = Readonly<{
  valid: boolean;
  fixtureId: string;
  replicateId: string;
  inputSha256: string | null;
  constructionFingerprint: string | null;
  seedTuple: string | null;
  seedWords: readonly [string, string, string, string] | null;
  normalization: Readonly<{
    eligibleRecordCount: number;
    excludedClusterAdjacentRecordIds: readonly string[];
    excludedRepeatedRecordIds: readonly string[];
  }> | null;
  gateA: Readonly<{ pass: boolean; state: string; reason: string | null }> | null;
  gateB: Readonly<{ status: string; branch?: string; totalCount?: string; reason?: string; domain?: string }> | null;
  statistic: number | null;
  pValue: number | null;
  outcome: CalibrationOutcomeV0_1B | null;
  reason: string | null;
  invalidReason: string | null;
}>;

export type P4PairReplicateResultV0_1B = Readonly<{
  valid: boolean;
  fixtureId: "N11";
  replicateId: string;
  ordered: P4ReplicateResultV0_1B;
  destroyed: P4ReplicateResultV0_1B;
  invalidReason: string | null;
}>;

export type P4ScheduledResultV0_1B = P4ReplicateResultV0_1B | P4PairReplicateResultV0_1B;

export type P4FixtureAcceptanceV0_1B = Readonly<{
  fixtureId: string;
  outcome: P4MethodologyOutcomeV0_1B;
  validReplicates: number;
  invalidReplicates: number;
  unexpectedReplicates: number;
  reason: string | null;
}>;

export type P4AggregateAcceptanceV0_1B = Readonly<{
  outcome: P4MethodologyOutcomeV0_1B;
  scheduleSize: number;
  acceptedFixtureCount: number;
  invalidResultCount: number;
  fixtureAcceptances: readonly P4FixtureAcceptanceV0_1B[];
  reason: string | null;
}>;

const EXPECTATIONS: readonly P4FixtureExpectationV0_1B[] = [
  ...(["N0", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10", "C0", "C1", "C2", "E1"] as const).map(
    (fixtureId) => ({ fixtureId, expectedGate: "PASS" as const, expectedP2: "MONTE_CARLO" as const, expectedOutcomes: ["NULL"] as const }),
  ),
  { fixtureId: "N11", expectedGate: "PASS", expectedP2: "READY", expectedOutcomes: ["CVC_CONFIGURATIONAL_SUPPORT", "NULL"] },
  { fixtureId: "N11_ORDERED", expectedGate: "PASS", expectedP2: "MONTE_CARLO", expectedOutcomes: ["CVC_CONFIGURATIONAL_SUPPORT"] },
  { fixtureId: "N11_ORDER_DESTROYED", expectedGate: "PASS", expectedP2: "MONTE_CARLO", expectedOutcomes: ["NULL", "INSUFFICIENT_EVIDENCE"] },
  { fixtureId: "N12", expectedGate: "PASS", expectedP2: "EXHAUSTIVE", expectedOutcomes: ["NULL"] },
  { fixtureId: "N13", expectedGate: "PASS", expectedP2: "MONTE_CARLO", expectedOutcomes: ["NULL"] },
  { fixtureId: "E2", expectedGate: "PASS", expectedP2: "ONLY_OBSERVED_REALIZATION", expectedOutcomes: ["INSUFFICIENT_EVIDENCE"] },
  { fixtureId: "E3", expectedGate: "PASS", expectedP2: "FAILURE", expectedOutcomes: ["INSUFFICIENT_EVIDENCE"] },
  { fixtureId: "C3", expectedGate: "MINIMUM_ELIGIBLE_GROUPS_NOT_MET", expectedP2: "NOT_RUN", expectedOutcomes: ["INSUFFICIENT_EVIDENCE"] },
  { fixtureId: "C4", expectedGate: "MINIMUM_VXP_STRATA_NOT_MET", expectedP2: "NOT_RUN", expectedOutcomes: ["INSUFFICIENT_EVIDENCE"] },
  { fixtureId: "C5", expectedGate: "MINIMUM_GROUPS_PER_STRATUM_NOT_MET", expectedP2: "NOT_RUN", expectedOutcomes: ["INSUFFICIENT_EVIDENCE"] },
  { fixtureId: "C6", expectedGate: ["MINIMUM_DISTINCT_LEFT_IDENTITIES_NOT_MET", "MINIMUM_DISTINCT_RIGHT_IDENTITIES_NOT_MET"], expectedP2: "NOT_RUN", expectedOutcomes: ["INSUFFICIENT_EVIDENCE"] },
  { fixtureId: "C7", expectedGate: ["VOICE_COVERAGE_MINIMUM_NOT_MET", "POSITION_COVERAGE_MINIMUM_NOT_MET"], expectedP2: "NOT_RUN", expectedOutcomes: ["INSUFFICIENT_EVIDENCE"] },
  { fixtureId: "C8", expectedGate: ["RARE_IDENTITY_SPARSE_THRESHOLD_EXCEEDED", "CONCENTRATION_CONFOUND_THRESHOLD_EXCEEDED"], expectedP2: "NOT_RUN", expectedOutcomes: ["SPARSE", "STRUCTURAL_BUT_CONFOUNDED"] },
  { fixtureId: "C9", expectedGate: "EXCHANGEABILITY_MINIMUM_NOT_MET", expectedP2: "NOT_RUN", expectedOutcomes: ["INSUFFICIENT_EVIDENCE"] },
];

const EXPECTATION_BY_ID = new Map<string, P4FixtureExpectationV0_1B>(
  EXPECTATIONS.map((entry) => [entry.fixtureId, entry]),
);
const VARIABLE_N13_73_MASKS = [0b110011, 0b111110, 0b101100, 0b011101, 0b100111, 0b010111] as const;
const VARIABLE_N13_73_PERMUTATION = [0, 1, 2, 3, 5, 4] as const;
const VARIABLE_N13_137_MASKS = [0b101111, 0b011111, 0b111011, 0b101011, 0b110101, 0b011101] as const;
const VARIABLE_N13_137_PERMUTATION = [0, 1, 3, 5, 2, 4] as const;
const N12_NULL_LEFT = [
  ["0", "0", "1", "3", "NL4", "NL5", "NL6", "NL7", "NL8", "NL9", "NL10", "NL11"],
  ["0", "2", "3", "1", "NL4", "NL5", "NL6", "NL7", "NL8", "NL9", "NL10", "NL11"],
  ["0", "2", "1", "1", "NL4", "NL5", "NL6", "NL7", "NL8", "NL9", "NL10", "NL11"],
  ["0", "2", "1", "3", "NL4", "NL5", "NL6", "NL7", "NL8", "NL9", "NL10", "NL11"],
] as const;
const N12_NULL_RIGHT = [
  ["1", "3", "0", "0", "NR4", "NR5", "NR6", "NR7", "NR8", "NR9", "NR10", "NR11"],
  ["1", "0", "2", "0", "NR4", "NR5", "NR6", "NR7", "NR8", "NR9", "NR10", "NR11"],
  ["2", "3", "3", "2", "NR4", "NR5", "NR6", "NR7", "NR8", "NR9", "NR10", "NR11"],
  ["3", "0", "0", "0", "NR4", "NR5", "NR6", "NR7", "NR8", "NR9", "NR10", "NR11"],
] as const;
const N12_NULL_OBSERVED_DONOR = [0, 3, 1, 2] as const;

function utf8Compare(left: string, right: string): number {
  const a = new TextEncoder().encode(left);
  const b = new TextEncoder().encode(right);
  const length = Math.min(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    if (a[index] !== b[index]) return a[index] - b[index];
  }
  return a.length - b.length;
}

function canonicalJson(value: unknown): string {
  if (typeof value === "bigint") return JSON.stringify(value.toString());
  if (value === null || typeof value === "string" || typeof value === "boolean") return JSON.stringify(value);
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("NONFINITE_NUMBER");
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => utf8Compare(left, right));
    return `{${entries.map(([key, entry]) => `${JSON.stringify(key)}:${canonicalJson(entry)}`).join(",")}}`;
  }
  throw new TypeError("UNSUPPORTED_CANONICAL_JSON_VALUE");
}

export function serializeP4CanonicalV0_1B(value: unknown): string {
  return canonicalJson(value);
}

function sha256(value: string): string {
  return createHash("sha256").update(Buffer.from(value, "utf8")).digest("hex");
}

function record(
  fixtureId: string,
  replicateId: string,
  groupIndex: number,
  stratumIndex: number,
  left: string,
  right: string,
  options: Readonly<Partial<Pick<SyntheticStructuralRecordV0_1B, "stableSlotId" | "tokenLengthClass" | "geometryClass" | "clusterAdjacent" | "topology">>> = {},
): SyntheticStructuralRecordV0_1B {
  const groupId = `g${String(groupIndex).padStart(3, "0")}`;
  const stratum = STRATA_V0_1B[stratumIndex];
  return {
    recordId: `${fixtureId}-${replicateId}-${groupId}-${stratum.id}-slot-0`,
    fixtureId,
    replicateId,
    independenceGroupId: groupId,
    C_L: left,
    V: stratum.voice,
    C_R: right,
    P: stratum.position,
    stratumId: stratum.id,
    stableSlotId: options.stableSlotId ?? "slot-0",
    tokenLengthClass: options.tokenLengthClass ?? "4-6",
    geometryClass: options.geometryClass ?? "shared",
    clusterAdjacent: options.clusterAdjacent ?? false,
    ...(options.topology === undefined ? {} : { topology: options.topology }),
  };
}

const COMMON_LEFT = ["L0", "L0", "L1", "L1"] as const;
const COMMON_RIGHT = ["R0", "R1", "R0", "R1"] as const;
const ORDERED_RIGHT = ["R0", "R0", "R1", "R1"] as const;
const DESTROYED_RIGHT = ["R0", "R1", "R1", "R0"] as const;
const E3_RESOURCE_MASKS = [1431655765, 1717986918, 2021161080, 2139127680, 2147450880, 0] as const;

function commonRecords(
  fixtureId: string,
  replicateId: string,
  groupCount = 96,
  options: Readonly<{ right?: readonly string[]; groupOrder?: readonly number[]; stratumOrder?: readonly number[]; geometry?: (group: number) => string; stableSlotId?: string; tokenLengthClass?: string; topology?: string }> = {},
): SyntheticStructuralRecordV0_1B[] {
  const groups = options.groupOrder ?? Array.from({ length: groupCount }, (_, index) => index);
  const strata = options.stratumOrder ?? STRATA_V0_1B.map((_, index) => index);
  const right = options.right ?? COMMON_RIGHT;
  const records: SyntheticStructuralRecordV0_1B[] = [];
  for (const groupIndex of groups) {
    const cycle = groupIndex % 4;
    for (const stratumIndex of strata) {
      records.push(record(fixtureId, replicateId, groupIndex, stratumIndex, COMMON_LEFT[cycle], right[cycle], {
        geometryClass: options.geometry?.(groupIndex) ?? "shared",
        stableSlotId: options.stableSlotId,
        tokenLengthClass: options.tokenLengthClass,
        topology: options.topology,
      }));
    }
  }
  return records;
}

function variableClassRecords(
  fixtureId: string,
  replicateId: string,
  startGroup: number,
  groupCount: number,
  variableMasks: readonly number[],
  observedDonorByRecipient: readonly number[],
  geometryClass: string,
): SyntheticStructuralRecordV0_1B[] {
  const records: SyntheticStructuralRecordV0_1B[] = [];
  for (let localGroup = 0; localGroup < groupCount; localGroup += 1) {
    const donorIndex = observedDonorByRecipient[localGroup] ?? localGroup;
    for (let stratumIndex = 0; stratumIndex < STRATA_V0_1B.length; stratumIndex += 1) {
      if (stratumIndex < variableMasks.length) {
        const left = `L${localGroup}_${stratumIndex}`;
        const donor = (variableMasks[stratumIndex] & (1 << donorIndex)) !== 0
          ? `ALLOW_${stratumIndex}`
          : `L${stratumIndex}_${stratumIndex}`;
        records.push(record(fixtureId, replicateId, startGroup + localGroup, stratumIndex, left, donor, { geometryClass }));
      } else {
        records.push(record(fixtureId, replicateId, startGroup + localGroup, stratumIndex, `NEUTRAL_L_${stratumIndex}`, `NEUTRAL_R_${stratumIndex}`, { geometryClass }));
      }
    }
  }
  return records;
}

function variableClassRecordsFromVectors(
  fixtureId: string,
  replicateId: string,
  startGroup: number,
  leftVectors: readonly (readonly string[])[],
  donorVectors: readonly (readonly string[])[],
  observedDonorByRecipient: readonly number[],
  geometryClass: string,
): SyntheticStructuralRecordV0_1B[] {
  const records: SyntheticStructuralRecordV0_1B[] = [];
  for (let localGroup = 0; localGroup < leftVectors.length; localGroup += 1) {
    const donorVector = donorVectors[observedDonorByRecipient[localGroup] ?? localGroup];
    if (donorVector === undefined) throw new TypeError("MISSING_P4_DONOR_VECTOR");
    for (let stratumIndex = 0; stratumIndex < STRATA_V0_1B.length; stratumIndex += 1) {
      const left = leftVectors[localGroup]?.[stratumIndex];
      const right = donorVector[stratumIndex];
      if (left === undefined || right === undefined) throw new TypeError("INCOMPLETE_P4_VECTOR");
      records.push(record(fixtureId, replicateId, startGroup + localGroup, stratumIndex, left, right, { geometryClass }));
    }
  }
  return records;
}

function forcedClassRecords(
  fixtureId: string,
  replicateId: string,
  startGroup: number,
  groupCount: number,
  geometryClass: string,
  classIndex = 0,
): SyntheticStructuralRecordV0_1B[] {
  const records: SyntheticStructuralRecordV0_1B[] = [];
  const pairNames = [
    ["F0", "F1"],
    ["F2", "F3"],
    ["F4", "F5"],
  ] as const;
  for (let localGroup = 0; localGroup < groupCount; localGroup += 1) {
    for (let stratumIndex = 0; stratumIndex < STRATA_V0_1B.length; stratumIndex += 1) {
      const pair = pairNames[(classIndex + stratumIndex) % pairNames.length];
      const bit = (localGroup >> (stratumIndex % 7)) & 1;
      records.push(record(
        fixtureId,
        replicateId,
        startGroup + localGroup,
        stratumIndex,
        pair[bit],
        pair[1 - bit],
        { geometryClass },
      ));
    }
  }
  return records;
}

function exactBoundaryRecords(fixtureId: string, replicateId: string, n13: boolean): SyntheticStructuralRecordV0_1B[] {
  const records: SyntheticStructuralRecordV0_1B[] = [];
  if (!n13) {
    records.push(...variableClassRecordsFromVectors(fixtureId, replicateId, 0, N12_NULL_LEFT, N12_NULL_RIGHT, N12_NULL_OBSERVED_DONOR, "n12-variable-0"));
    records.push(...variableClassRecordsFromVectors(fixtureId, replicateId, 4, N12_NULL_LEFT, N12_NULL_RIGHT, N12_NULL_OBSERVED_DONOR, "n12-variable-1"));
    records.push(...variableClassRecordsFromVectors(fixtureId, replicateId, 8, N12_NULL_LEFT, N12_NULL_RIGHT, N12_NULL_OBSERVED_DONOR, "n12-variable-2"));
    records.push(...variableClassRecordsFromVectors(fixtureId, replicateId, 12, N12_NULL_LEFT, N12_NULL_RIGHT, N12_NULL_OBSERVED_DONOR, "n12-variable-3"));
    records.push(...forcedClassRecords(fixtureId, replicateId, 16, 80, "n12-forced"));
    return records;
  }
  records.push(...variableClassRecords(fixtureId, replicateId, 0, 6, VARIABLE_N13_73_MASKS, VARIABLE_N13_73_PERMUTATION, "n13-variable-73"));
  records.push(...variableClassRecords(fixtureId, replicateId, 6, 6, VARIABLE_N13_137_MASKS, VARIABLE_N13_137_PERMUTATION, "n13-variable-137"));
  records.push(...forcedClassRecords(fixtureId, replicateId, 12, 84, "n13-forced"));
  return records;
}

function buildFixtureRecords(fixtureId: (typeof FIXTURE_IDS_V0_1B)[number], replicateId: string, subcase: P4FixtureSubcaseV0_1B): SyntheticStructuralRecordV0_1B[] {
  if (fixtureId === "N11_ORDERED") return commonRecords(fixtureId, replicateId, 96, { right: ORDERED_RIGHT });
  if (fixtureId === "N11_ORDER_DESTROYED") return commonRecords(fixtureId, replicateId, 96, { right: DESTROYED_RIGHT });
  if (fixtureId === "N12") return exactBoundaryRecords(fixtureId, replicateId, false);
  if (fixtureId === "N13") return exactBoundaryRecords(fixtureId, replicateId, true);
  if (fixtureId === "E2") return forcedClassRecords(fixtureId, replicateId, 0, 96, "e2-forced");
  if (fixtureId === "E3") {
    const records: SyntheticStructuralRecordV0_1B[] = [];
    records.push(...variableClassRecords(fixtureId, replicateId, 0, 31, E3_RESOURCE_MASKS, Array.from({ length: 31 }, (_, index) => index), "e3-rich"));
    records.push(...forcedClassRecords(fixtureId, replicateId, 31, 65, "e3-forced"));
    return records;
  }
  if (fixtureId === "C3") return commonRecords(fixtureId, replicateId, 79);
  if (fixtureId === "C4") return commonRecords(fixtureId, replicateId).filter((entry) => entry.stratumId !== "S11");
  if (fixtureId === "C5") return commonRecords(fixtureId, replicateId).filter((entry) => entry.stratumId !== "S0" || Number(entry.independenceGroupId.slice(1)) < 3);
  if (fixtureId === "C6") {
    return subcase === "right"
      ? commonRecords(fixtureId, replicateId).map((entry) => ({ ...entry, C_R: "R0" }))
      : commonRecords(fixtureId, replicateId).map((entry) => ({ ...entry, C_L: "L0" }));
  }
  if (fixtureId === "C7") {
    return subcase === "position"
      ? commonRecords(fixtureId, replicateId).filter((entry) => entry.stratumId !== "S4")
      : commonRecords(fixtureId, replicateId).filter((entry) => entry.stratumId !== "S3");
  }
  if (fixtureId === "C8") {
    const base = commonRecords(fixtureId, replicateId);
    if (subcase === "right") return base.map((entry, index) => index === 0 ? { ...entry, C_R: "RARE_R" } : entry);
    return [...base, ...Array.from({ length: 100 }, (_, index) => ({ ...base[0], recordId: `${fixtureId}-${replicateId}-g000-S0-extra-${index}`, stableSlotId: `extra-${index}`, C_R: "R1" }))];
  }
  if (fixtureId === "C9") {
    return commonRecords(fixtureId, replicateId, 96, { geometry: (group) => group < 29 ? "pool" : `singleton-${group}` });
  }
  if (fixtureId === "E1" || fixtureId === "C1") {
    const base = commonRecords(fixtureId, replicateId);
    return [...base, { ...base[0], recordId: `${fixtureId}-${replicateId}-g096-S0-cluster`, independenceGroupId: "g096", clusterAdjacent: true }];
  }
  if (fixtureId === "C2") {
    const base = commonRecords(fixtureId, replicateId);
    return [...base, { ...base[0], recordId: `${fixtureId}-${replicateId}-g096-S0-repeat`, independenceGroupId: "g096", C_L: "R0", C_R: "R0" }];
  }
  if (fixtureId === "N1") return commonRecords(fixtureId, replicateId).reverse();
  if (fixtureId === "N2") return commonRecords(fixtureId, replicateId, 96, { groupOrder: Array.from({ length: 96 }, (_, index) => 95 - index) });
  if (fixtureId === "N3") return commonRecords(fixtureId, replicateId, 96, { stratumOrder: Array.from({ length: STRATA_V0_1B.length }, (_, index) => STRATA_V0_1B.length - 1 - index) });
  if (fixtureId === "N4") return commonRecords(fixtureId, replicateId, 96, { stableSlotId: "slot-renamed" });
  if (fixtureId === "N5") return commonRecords(fixtureId, replicateId, 96, { geometry: () => "relabelled" });
  if (fixtureId === "N6") return commonRecords(fixtureId, replicateId, 96, { tokenLengthClass: "5-7" });
  if (fixtureId === "N7") return commonRecords(fixtureId, replicateId, 96, { topology: "neutral" });
  if (fixtureId === "N8") return commonRecords(fixtureId, replicateId).map((entry) => ({ ...entry, C_L: entry.C_L === "L0" ? "L1" : "L0" }));
  if (fixtureId === "N9") return commonRecords(fixtureId, replicateId).map((entry) => ({ ...entry, C_R: entry.C_R === "R0" ? "R1" : "R0" }));
  return commonRecords(fixtureId, replicateId);
}

function fingerprintRecords(records: readonly SyntheticStructuralRecordV0_1B[]): string {
  return sha256(serializeP4CanonicalV0_1B(records));
}

export function fixtureExpectationV0_1B(fixtureId: string): P4FixtureExpectationV0_1B {
  const expectation = EXPECTATION_BY_ID.get(fixtureId);
  if (expectation === undefined) throw new RangeError(`UNKNOWN_FIXTURE_ID:${fixtureId}`);
  return expectation;
}

export function generateP4FixtureV0_1B(
  fixtureId: (typeof FIXTURE_IDS_V0_1B)[number],
  replicateId: string,
  subcase: P4FixtureSubcaseV0_1B = "default",
): P4FixtureV0_1B {
  if (fixtureId === "N11") {
    const ordered = generateP4FixtureV0_1B("N11_ORDERED", replicateId);
    const destroyed = generateP4FixtureV0_1B("N11_ORDER_DESTROYED", replicateId);
    if (ordered.kind !== "single" || destroyed.kind !== "single") throw new TypeError("N11_PAIR_GENERATION_FAILURE");
    return {
      kind: "pair",
      fixtureId,
      replicateId,
      ordered,
      destroyed,
      constructionFingerprint: sha256(serializeP4CanonicalV0_1B({ ordered: ordered.constructionFingerprint, destroyed: destroyed.constructionFingerprint })),
    };
  }
  if (!/^([0-7])$/.test(replicateId)) throw new TypeError("INVALID_P4_REPLICATE_ID");
  const records = buildFixtureRecords(fixtureId, replicateId, subcase);
  return { kind: "single", fixtureId, replicateId, records, constructionFingerprint: fingerprintRecords(records) };
}

function scheduledSubcaseV0_1B(
  fixtureId: (typeof FIXTURE_IDS_V0_1B)[number],
  replicateId: string,
): P4FixtureSubcaseV0_1B {
  if (fixtureId !== "C6" && fixtureId !== "C7" && fixtureId !== "C8") return "default";
  return Number(replicateId) < 4 ? "default" : fixtureId === "C7" ? "position" : "right";
}

export function buildP4ScheduleV0_1B(): readonly P4ScheduleEntryV0_1B[] {
  const schedule: P4ScheduleEntryV0_1B[] = [];
  for (const fixtureId of FIXTURE_IDS_V0_1B) {
    for (const replicateId of P4_REPLICATE_IDS_V0_1B) {
      const subcase = scheduledSubcaseV0_1B(fixtureId, replicateId);
      const fixture = generateP4FixtureV0_1B(fixtureId, replicateId, subcase);
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

function serializableGateB(result: SyntheticCalibrationResultV0_1B): P4ReplicateResultV0_1B["gateB"] {
  if (result.gateB.status === "READY") return { status: result.gateB.status, branch: result.gateB.branch, totalCount: result.gateB.totalCount.toString() };
  if (result.gateB.status === "FAILURE") return { status: result.gateB.status, reason: result.gateB.reason, domain: result.gateB.domain };
  return { status: result.gateB.status };
}

function summarizeAnalysis(
  fixture: P4SingleFixtureV0_1B,
  result: SyntheticCalibrationResultV0_1B,
  inputSha256: string,
): P4ReplicateResultV0_1B {
  const expectedWords = seedWordsV0_1B(fixture.fixtureId, fixture.replicateId, P4_PERMUTATION_STREAM_ID_V0_1B).map((word) => word.toString()) as [string, string, string, string];
  const actualWords = result.seedWords.map((word) => word.toString()) as [string, string, string, string];
  const seedValid = serializeP4CanonicalV0_1B(actualWords) === serializeP4CanonicalV0_1B(expectedWords);
  const gateB = serializableGateB(result);
  const resourceFailure = gateB?.status === "FAILURE" && gateB.domain === "RESOURCE";
  return {
    valid: seedValid && !resourceFailure,
    fixtureId: fixture.fixtureId,
    replicateId: fixture.replicateId,
    inputSha256,
    constructionFingerprint: fixture.constructionFingerprint,
    seedTuple: canonicalSeedTupleV0_1B(fixture.fixtureId, fixture.replicateId, P4_PERMUTATION_STREAM_ID_V0_1B),
    seedWords: actualWords,
    normalization: {
      eligibleRecordCount: result.normalization.eligibleRecords.length,
      excludedClusterAdjacentRecordIds: result.normalization.excludedClusterAdjacentRecordIds,
      excludedRepeatedRecordIds: result.normalization.excludedRepeatedRecordIds,
    },
    gateA: { pass: result.gateA.pass, state: result.gateA.state, reason: result.gateA.reason },
    gateB,
    statistic: result.statistic,
    pValue: result.pValue,
    outcome: result.state,
    reason: result.reason,
    invalidReason: !seedValid
      ? "SEED_DERIVATION_MISMATCH"
      : resourceFailure
        ? gateB.reason ?? "RESOURCE_LIMIT_EXCEEDED"
        : null,
  };
}

export function runP4SingleReplicateV0_1B(fixture: P4SingleFixtureV0_1B): P4ReplicateResultV0_1B {
  try {
    const inputSha256 = fingerprintRecords(fixture.records);
    const result = analyzeSyntheticCalibrationV0_1B(fixture.records, {
      fixtureId: fixture.fixtureId,
      replicateId: fixture.replicateId,
      permutationStreamId: P4_PERMUTATION_STREAM_ID_V0_1B,
    });
    return summarizeAnalysis(fixture, result, inputSha256);
  } catch (error) {
    return {
      valid: false,
      fixtureId: fixture.fixtureId,
      replicateId: fixture.replicateId,
      inputSha256: null,
      constructionFingerprint: fixture.constructionFingerprint,
      seedTuple: null,
      seedWords: null,
      normalization: null,
      gateA: null,
      gateB: null,
      statistic: null,
      pValue: null,
      outcome: null,
      reason: null,
      invalidReason: error instanceof Error ? error.message : "RUNTIME_FAILURE",
    };
  }
}

export function runP4ReplicateV0_1B(fixture: P4FixtureV0_1B): P4ScheduledResultV0_1B {
  if (fixture.kind === "single") return runP4SingleReplicateV0_1B(fixture);
  const ordered = runP4SingleReplicateV0_1B(fixture.ordered);
  const destroyed = runP4SingleReplicateV0_1B(fixture.destroyed);
  return {
    valid: ordered.valid && destroyed.valid,
    fixtureId: fixture.fixtureId,
    replicateId: fixture.replicateId,
    ordered,
    destroyed,
    invalidReason: ordered.valid && destroyed.valid ? null : "PAIR_REPLICATE_INVALID",
  };
}

function expectedGateMatches(expectation: P4FixtureExpectationV0_1B, gate: P4ReplicateResultV0_1B["gateA"]): boolean {
  if (gate === null) return false;
  if (expectation.expectedGate === "PASS") return gate.pass && gate.reason === null;
  return !gate.pass && (Array.isArray(expectation.expectedGate) ? expectation.expectedGate.includes(gate.reason as GateAReasonV0_1B) : gate.reason === expectation.expectedGate);
}

function expectedP2Matches(expectation: P4FixtureExpectationV0_1B, gate: P4ReplicateResultV0_1B["gateB"]): boolean {
  if (gate === null) return false;
  if (expectation.expectedP2 === "NOT_RUN") return gate.status === "NOT_RUN";
  if (expectation.expectedP2 === "ONLY_OBSERVED_REALIZATION") {
    return gate.status === "FAILURE"
      && gate.reason === "ONLY_OBSERVED_REALIZATION"
      && gate.domain === "FINITE_SCIENTIFIC";
  }
  if (expectation.expectedP2 === "FAILURE") {
    return gate.status === "FAILURE"
      && gate.reason === "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED"
      && gate.domain === "RESOURCE";
  }
  return gate.status === "READY" && gate.branch === expectation.expectedP2;
}

function hasExactReplicateIds(results: readonly { replicateId: string }[]): boolean {
  return results.every((result, index) => result.replicateId === String(index));
}

function hasMatchingN11ReplicateIds(result: P4PairReplicateResultV0_1B): boolean {
  return result.replicateId === result.ordered.replicateId && result.replicateId === result.destroyed.replicateId;
}

function singleAccepted(expectation: P4FixtureExpectationV0_1B, result: P4ReplicateResultV0_1B): boolean {
  return result.valid && expectedGateMatches(expectation, result.gateA) && expectedP2Matches(expectation, result.gateB) && result.outcome !== null && expectation.expectedOutcomes.includes(result.outcome);
}

export function evaluateP4FixtureAcceptanceV0_1B(
  fixtureId: string,
  results: readonly P4ScheduledResultV0_1B[],
): P4FixtureAcceptanceV0_1B {
  const expectation = fixtureExpectationV0_1B(fixtureId);
  if (results.length !== P4_REPLICATES_PER_FIXTURE_V0_1B || !hasExactReplicateIds(results)) {
    return {
      fixtureId,
      outcome: "CALIBRATION_INVALID",
      validReplicates: 0,
      invalidReplicates: results.length,
      unexpectedReplicates: 0,
      reason: "FIXTURE_EXPECTATION_MISMATCH",
    };
  }
  let invalidReplicates = 0;
  let unexpectedReplicates = 0;
  let validReplicates = 0;
  for (const result of results) {
    if (result.fixtureId !== fixtureId) {
      invalidReplicates += 1;
      continue;
    }
    if (result.fixtureId === "N11") {
      const pair = result as P4PairReplicateResultV0_1B;
      if (!pair.valid || !hasMatchingN11ReplicateIds(pair)) invalidReplicates += 1;
      else if (!singleAccepted(fixtureExpectationV0_1B("N11_ORDERED"), pair.ordered) || !singleAccepted(fixtureExpectationV0_1B("N11_ORDER_DESTROYED"), pair.destroyed)) unexpectedReplicates += 1;
      else validReplicates += 1;
      continue;
    }
    const single = result as P4ReplicateResultV0_1B;
    if (!single.valid) invalidReplicates += 1;
    else if (!singleAccepted(expectation, single)) unexpectedReplicates += 1;
    else validReplicates += 1;
  }
  const outcome: P4MethodologyOutcomeV0_1B = invalidReplicates > 0 ? "CALIBRATION_INVALID" : unexpectedReplicates > 0 ? "CALIBRATION_FAIL" : "CALIBRATION_PASS";
  return { fixtureId, outcome, validReplicates, invalidReplicates, unexpectedReplicates, reason: invalidReplicates > 0 ? "RUNTIME_OR_SCHEMA_FAILURE" : unexpectedReplicates > 0 ? "FIXTURE_EXPECTATION_MISMATCH" : null };
}

export function evaluateP4N11PairAcceptanceV0_1B(
  results: readonly P4PairReplicateResultV0_1B[],
): P4FixtureAcceptanceV0_1B {
  if (results.length !== P4_REPLICATES_PER_FIXTURE_V0_1B || !hasExactReplicateIds(results)) {
    return {
      fixtureId: "N11",
      outcome: "CALIBRATION_INVALID",
      validReplicates: 0,
      invalidReplicates: results.length,
      unexpectedReplicates: 0,
      reason: "FIXTURE_EXPECTATION_MISMATCH",
    };
  }
  let invalidReplicates = 0;
  let unexpectedReplicates = 0;
  for (const result of results) {
    if (!result.valid || !hasMatchingN11ReplicateIds(result)) {
      invalidReplicates += 1;
      continue;
    }
    const ordered = result.ordered;
    const destroyed = result.destroyed;
    const orderedAccepted = singleAccepted(fixtureExpectationV0_1B("N11_ORDERED"), ordered);
    const destroyedAccepted = singleAccepted(fixtureExpectationV0_1B("N11_ORDER_DESTROYED"), destroyed);
    if (!orderedAccepted || !destroyedAccepted || (ordered.statistic ?? Number.NEGATIVE_INFINITY) <= (destroyed.statistic ?? Number.POSITIVE_INFINITY)) unexpectedReplicates += 1;
  }
  const outcome: P4MethodologyOutcomeV0_1B = invalidReplicates > 0 ? "CALIBRATION_INVALID" : unexpectedReplicates > 0 ? "CALIBRATION_FAIL" : "CALIBRATION_PASS";
  return { fixtureId: "N11", outcome, validReplicates: results.length - invalidReplicates - unexpectedReplicates, invalidReplicates, unexpectedReplicates, reason: invalidReplicates > 0 ? "PAIR_REPLICATE_INVALID" : unexpectedReplicates > 0 ? "FIXTURE_EXPECTATION_MISMATCH" : null };
}

export function runP4ScheduleV0_1B(): P4AggregateAcceptanceV0_1B {
  const schedule = buildP4ScheduleV0_1B();
  const byFixture = new Map<string, P4ScheduledResultV0_1B[]>();
  for (const entry of schedule) {
    const result = runP4ReplicateV0_1B(generateP4FixtureV0_1B(entry.fixtureId, entry.replicateId, entry.subcase));
    const existing = byFixture.get(entry.fixtureId) ?? [];
    existing.push(result);
    byFixture.set(entry.fixtureId, existing);
  }
  const fixtureAcceptances: P4FixtureAcceptanceV0_1B[] = [];
  for (const fixtureId of FIXTURE_IDS_V0_1B) {
    const results = byFixture.get(fixtureId) ?? [];
    fixtureAcceptances.push(fixtureId === "N11"
      ? evaluateP4N11PairAcceptanceV0_1B(results as P4PairReplicateResultV0_1B[])
      : evaluateP4FixtureAcceptanceV0_1B(fixtureId, results));
  }
  const invalidResultCount = fixtureAcceptances.reduce((sum, entry) => sum + entry.invalidReplicates, 0);
  const acceptedFixtureCount = fixtureAcceptances.filter((entry) => entry.outcome === "CALIBRATION_PASS").length;
  const outcome: P4MethodologyOutcomeV0_1B = schedule.length !== P4_TOTAL_EVALUATIONS_V0_1B || invalidResultCount > 0
    ? "CALIBRATION_INVALID"
    : acceptedFixtureCount === fixtureAcceptances.length
      ? "CALIBRATION_PASS"
      : "CALIBRATION_FAIL";
  return { outcome, scheduleSize: schedule.length, acceptedFixtureCount, invalidResultCount, fixtureAcceptances, reason: outcome === "CALIBRATION_PASS" ? null : "FIXTURE_ACCEPTANCE_NOT_COMPLETE" };
}

export function p4AuthorityBindingsV0_1B(): Readonly<Record<string, string>> {
  return {
    contractId: P4_CONTRACT_ID_V0_1B,
    humanContractSha256: P4_HUMAN_CONTRACT_SHA256_V0_1B,
    machineContractSha256: P4_MACHINE_CONTRACT_SHA256_V0_1B,
    fixtureCorrectionContractId: P4_FIXTURE_CORRECTION_CONTRACT_ID_V0_1_1,
    fixtureCorrectionMachineSha256: P4_FIXTURE_CORRECTION_MACHINE_SHA256_V0_1_1,
    p1P2CorrectionMachineSha256: P4_P1_P2_CORRECTION_MACHINE_SHA256_V0_1,
    subcaseAllocationContractId: P4_SUBCASE_ALLOCATION_CONTRACT_ID_V0_1,
    subcaseAllocationHumanSha256: P4_SUBCASE_ALLOCATION_HUMAN_SHA256_V0_1,
    subcaseAllocationMachineSha256: P4_SUBCASE_ALLOCATION_MACHINE_SHA256_V0_1,
    amendedContractSha256: AMENDED_CONTRACT_SHA256_V0_1B,
    generatorContractSha256: GENERATOR_CONTRACT_SHA256_V0_1B,
    analyzerContractSha256: ANALYZER_CONTRACT_SHA256_V0_1B,
  };
}

export function fixtureJointTableV0_1B(records: readonly SyntheticStructuralRecordV0_1B[], stratumId = "S0"): Readonly<Record<string, Readonly<Record<string, number>>>> {
  const table: Record<string, Record<string, number>> = {};
  for (const entry of records.filter((record) => record.stratumId === stratumId)) {
    table[entry.C_L] ??= {};
    table[entry.C_L][entry.C_R] = (table[entry.C_L][entry.C_R] ?? 0) + 1;
  }
  return table;
}

export function fixtureNormalizationPreviewV0_1B(records: readonly SyntheticStructuralRecordV0_1B[]) {
  const normalized = normalizePrimaryRecordsV0_1B(records);
  return { eligibleRecordCount: normalized.eligibleRecords.length, excludedClusterAdjacentRecordIds: normalized.excludedClusterAdjacentRecordIds, excludedRepeatedRecordIds: normalized.excludedRepeatedRecordIds, weightedRecordCount: applyGroupStratumWeightsV0_1B(normalized.eligibleRecords).length };
}

export type P4FailureReasonV0_1B = GateAReasonV0_1B | ExactNullFailureReasonV0_1B | "FIXTURE_EXPECTATION_MISMATCH" | "SEED_DERIVATION_MISMATCH" | "RUNTIME_FAILURE";
