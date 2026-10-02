import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import {
  applyGroupStratumWeightsV0_1B,
  buildSignatureProfileAdapterV0_1B,
  evaluateGateAV0_1B,
  FIXTURE_IDS_V0_1B,
  normalizePrimaryRecordsV0_1B,
  STRATA_V0_1B,
  type SyntheticStructuralRecordV0_1B,
} from "../src/shared/openInstrument/frd02CvcSyntheticCalibration.v0_1b";
import {
  countExactNullV0_1B,
  type ExactNullSignatureClassV0_1B,
} from "../src/shared/openInstrument/frd02CvcExactNull.v0_1b";

const COMMON = ["R0", "R1", "R0", "R1"] as const;
const ORDERED = ["R0", "R0", "R1", "R1"] as const;
const DESTROYED = ["R0", "R1", "R1", "R0"] as const;

type FixtureMode = "COMMON" | "ORDERED" | "DESTROYED";
type Matrix = readonly (readonly boolean[])[];

function makeP4Records(
  fixtureId: string,
  groupCount = 96,
  mode: FixtureMode = "COMMON",
): SyntheticStructuralRecordV0_1B[] {
  const rightSequence = mode === "ORDERED" ? ORDERED : mode === "DESTROYED" ? DESTROYED : COMMON;
  const records: SyntheticStructuralRecordV0_1B[] = [];
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
    const groupId = `g${String(groupIndex).padStart(3, "0")}`;
    const cycle = groupIndex % 4;
    const left = cycle < 2 ? "L0" : "L1";
    const right = rightSequence[cycle];
    for (const stratum of STRATA_V0_1B) {
      records.push({
        recordId: `${fixtureId}-0-${groupId}-${stratum.id}-slot-0`,
        fixtureId,
        replicateId: "0",
        independenceGroupId: groupId,
        C_L: left,
        V: stratum.voice,
        C_R: right,
        P: stratum.position,
        stratumId: stratum.id,
        stableSlotId: "slot-0",
        tokenLengthClass: "4-6",
        geometryClass: "shared",
        clusterAdjacent: false,
      });
    }
  }
  return records;
}

function runP2Precondition(records: readonly SyntheticStructuralRecordV0_1B[]) {
  const normalized = normalizePrimaryRecordsV0_1B(records);
  const weighted = applyGroupStratumWeightsV0_1B(normalized.eligibleRecords);
  const gateA = evaluateGateAV0_1B(weighted);
  if (!gateA.pass) return { gateA, p2: { status: "NOT_RUN" as const } };
  const p2 = countExactNullV0_1B(buildSignatureProfileAdapterV0_1B(weighted).classes);
  return { gateA, p2 };
}

function classFromMatrix(
  matrix: Matrix,
  classId: string,
  profiles?: readonly (readonly string[])[],
): ExactNullSignatureClassV0_1B {
  const slotIds = Array.from({ length: matrix.length }, (_, index) => `s${index}`);
  const recipients = matrix.map((_, recipientIndex) => ({
    recipientId: `${classId}-r${recipientIndex}`,
    signatureClassId: classId,
    primarySlots: slotIds.map((slotId, slotIndex) => ({
      slotId,
      leftIdentity: `left-${recipientIndex}-${slotIndex}`,
    })),
  }));
  const donors = matrix[0].map((_, donorIndex) => ({
    donorId: `${classId}-d${donorIndex}`,
    signatureClassId: classId,
    rightIdentityBySlot: slotIds.map((slotId, slotIndex) => ({
      slotId,
      rightIdentity:
        profiles?.[donorIndex]?.[slotIndex] ??
        (matrix[slotIndex]?.[donorIndex]
          ? `right-${donorIndex}-${slotIndex}`
          : `left-${slotIndex}-${slotIndex}`),
    })),
  }));
  return {
    signatureClassId: classId,
    primarySlotIds: slotIds,
    recipients,
    donors,
    observedAssignment: undefined,
  };
}

function complete(size: number): Matrix {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => true));
}

function uniformProfiles(size: number): readonly (readonly string[])[] {
  return Array.from({ length: size }, () => Array.from({ length: size }, () => "same"));
}

function matrixFromMasks(masks: readonly number[], size: number): Matrix {
  return masks.map((mask) => Array.from({ length: size }, (_, column) => (mask & (1 << column)) !== 0));
}

function p2Branch(classes: readonly ExactNullSignatureClassV0_1B[]) {
  const result = countExactNullV0_1B(classes);
  if (result.status === "READY") return result.branch;
  if (result.status === "FINITE_FAILURE") return result.branch;
  return result.reason;
}

function sha256File(relativePath: string): string {
  return createHash("sha256").update(readFileSync(join(process.cwd(), relativePath))).digest("hex");
}

describe("FRD-02 P1/P2 exact-null compatibility", () => {
  test.each([
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
    "C0",
  ])("%s reaches P2 without the superseded raw-class failure", (fixtureId) => {
    const result = runP2Precondition(makeP4Records(fixtureId));
    expect(result.gateA.pass).toBe(true);
    expect(result.p2.status).toBe("READY");
    if (result.p2.status === "READY") expect(result.p2.branch).toBe("MONTE_CARLO");
  });

  test("N11 ordered and destroyed both reach P2", () => {
    for (const [fixtureId, mode] of [
      ["N11_ORDERED", "ORDERED"],
      ["N11_ORDER_DESTROYED", "DESTROYED"],
    ] as const) {
      const result = runP2Precondition(makeP4Records(fixtureId, 96, mode));
      expect(result.gateA.pass).toBe(true);
      expect(result.p2.status).toBe("READY");
    }
  });

  test("P4 records retain the exact 96-group / 12-stratum shape", () => {
    const records = makeP4Records("N0");
    expect(records).toHaveLength(96 * 12);
    expect(new Set(records.map((record) => record.independenceGroupId)).size).toBe(96);
    expect(new Set(records.map((record) => record.stratumId)).size).toBe(12);
  });

  test("E1, C1, and C2 preserve the valid P2 precondition after normalization", () => {
    const base = makeP4Records("N0");
    const cases = [
      [
        "E1",
        [
          ...base,
          { ...base[0], recordId: "E1-cluster", independenceGroupId: "g096", clusterAdjacent: true },
        ],
      ],
      [
        "C1",
        [
          ...base,
          { ...base[0], recordId: "C1-cluster", independenceGroupId: "g096", clusterAdjacent: true },
        ],
      ],
      [
        "C2",
        [
          ...base,
          { ...base[0], recordId: "C2-repeat", independenceGroupId: "g096", C_L: "R0", C_R: "R0" },
        ],
      ],
    ] as const;
    for (const [fixtureId, records] of cases) {
      const result = runP2Precondition(records);
      expect(result.gateA.pass).toBe(true);
      expect(result.p2.status).toBe("READY");
    }
  });

  test("N12 and N13 preserve their exact-null branch boundaries", () => {
    const ten = matrixFromMasks([0b0011, 0b1101, 0b1111, 0b1111], 4);
    const seventyThree = matrixFromMasks([0b110011, 0b111110, 0b101100, 0b011101, 0b100111, 0b010111], 6);
    const oneHundredThirtySeven = matrixFromMasks([0b101111, 0b011111, 0b111011, 0b101011, 0b110101, 0b011101], 6);
    expect(p2Branch([
      classFromMatrix(ten, "n12-a"),
      classFromMatrix(ten, "n12-b"),
      classFromMatrix(ten, "n12-c"),
      classFromMatrix(ten, "n12-d"),
    ])).toBe("EXHAUSTIVE");
    expect(countExactNullV0_1B([
      classFromMatrix(ten, "n12-a"),
      classFromMatrix(ten, "n12-b"),
      classFromMatrix(ten, "n12-c"),
      classFromMatrix(ten, "n12-d"),
    ])).toMatchObject({ status: "READY", totalCount: BigInt(10_000) });
    expect(countExactNullV0_1B([
      classFromMatrix(seventyThree, "n13-a"),
      classFromMatrix(oneHundredThirtySeven, "n13-b"),
    ])).toMatchObject({ status: "READY", branch: "MONTE_CARLO", totalCount: BigInt(10_001) });
  });

  test("E2 remains finite-null and E3 remains computationally resource-bound", () => {
    expect(p2Branch([classFromMatrix([[true]], "e2")])).toBe("ONLY_OBSERVED_REALIZATION");
    expect(p2Branch([
      classFromMatrix(complete(31), "e3", Array.from({ length: 31 }, (_, index) => Array.from({ length: 31 }, () => `profile-${index}`))),
    ])).toBe("EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED");
  });

  test("all 29 frozen fixture preconditions are accounted for without calibration", () => {
    const expectedIds = [...FIXTURE_IDS_V0_1B];
    expect(expectedIds).toHaveLength(29);
    const audited = new Map<string, { gateA: string; p2: string }>();
    for (const fixtureId of ["N0", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10", "C0"]) {
      const result = runP2Precondition(makeP4Records(fixtureId));
      audited.set(fixtureId, { gateA: result.gateA.pass ? "PASS" : result.gateA.reason ?? "UNKNOWN", p2: result.p2.status });
    }
    for (const [fixtureId, mode] of [["N11_ORDERED", "ORDERED"], ["N11_ORDER_DESTROYED", "DESTROYED"]] as const) {
      const result = runP2Precondition(makeP4Records(fixtureId, 96, mode));
      audited.set(fixtureId, { gateA: result.gateA.pass ? "PASS" : result.gateA.reason ?? "UNKNOWN", p2: result.p2.status });
    }
    const base = makeP4Records("E1");
    audited.set("E1", { gateA: "PASS", p2: runP2Precondition([
      ...base,
      { ...base[0], recordId: "E1-audit-cluster", independenceGroupId: "g096", clusterAdjacent: true },
    ]).p2.status });
    audited.set("C1", { gateA: "PASS", p2: runP2Precondition([
      ...base,
      { ...base[0], recordId: "C1-audit-cluster", independenceGroupId: "g096", clusterAdjacent: true },
    ]).p2.status });
    audited.set("C2", { gateA: "PASS", p2: runP2Precondition([
      ...base,
      { ...base[0], recordId: "C2-audit-repeat", independenceGroupId: "g096", C_L: "R0", C_R: "R0" },
    ]).p2.status });
    audited.set("N11", { gateA: "PAIR_CONTAINER", p2: "NOT_INDEPENDENTLY_ANALYZED" });
    audited.set("N12", { gateA: "PASS_BY_FROZEN_P4_CONTRACT", p2: p2Branch([
      classFromMatrix(matrixFromMasks([0b0011, 0b1101, 0b1111, 0b1111], 4), "n12-a"),
      classFromMatrix(matrixFromMasks([0b0011, 0b1101, 0b1111, 0b1111], 4), "n12-b"),
      classFromMatrix(matrixFromMasks([0b0011, 0b1101, 0b1111, 0b1111], 4), "n12-c"),
      classFromMatrix(matrixFromMasks([0b0011, 0b1101, 0b1111, 0b1111], 4), "n12-d"),
    ]) });
    audited.set("N13", { gateA: "PASS_BY_FROZEN_P4_CONTRACT", p2: p2Branch([
      classFromMatrix(matrixFromMasks([0b110011, 0b111110, 0b101100, 0b011101, 0b100111, 0b010111], 6), "n13-a"),
      classFromMatrix(matrixFromMasks([0b101111, 0b011111, 0b111011, 0b101011, 0b110101, 0b011101], 6), "n13-b"),
    ]) });
    audited.set("E2", { gateA: "PASS_BY_FROZEN_P4_CONTRACT", p2: p2Branch([classFromMatrix([[true]], "e2-audit")]) });
    audited.set("E3", { gateA: "PASS_BY_FROZEN_P4_CONTRACT", p2: p2Branch([
      classFromMatrix(complete(31), "e3-audit", Array.from({ length: 31 }, (_, index) => Array.from({ length: 31 }, () => `profile-${index}`))),
    ]) });

    const c3 = runP2Precondition(makeP4Records("C3", 79));
    audited.set("C3", { gateA: c3.gateA.reason ?? "UNKNOWN", p2: c3.p2.status });
    const c4 = runP2Precondition(makeP4Records("C4").filter((record) => record.stratumId !== "S11"));
    audited.set("C4", { gateA: c4.gateA.reason ?? "UNKNOWN", p2: c4.p2.status });
    const c5 = runP2Precondition(makeP4Records("C5").filter((record) => record.stratumId !== "S0" || record.independenceGroupId < "g003"));
    audited.set("C5", { gateA: c5.gateA.reason ?? "UNKNOWN", p2: c5.p2.status });
    const c6 = runP2Precondition(makeP4Records("C6").map((record) => ({ ...record, C_L: "L0" })));
    audited.set("C6", { gateA: c6.gateA.reason ?? "UNKNOWN", p2: c6.p2.status });
    const c7 = runP2Precondition(makeP4Records("C7").filter((record) => record.stratumId !== "S3"));
    audited.set("C7", { gateA: c7.gateA.reason ?? "UNKNOWN", p2: c7.p2.status });
    const c8Records = makeP4Records("C8");
    for (let index = 0; index < 100; index += 1) {
      c8Records.push({ ...c8Records[0], recordId: `C8-extra-${index}`, stableSlotId: `extra-${index}`, C_R: "R1" });
    }
    const c8 = runP2Precondition(c8Records);
    audited.set("C8", { gateA: c8.gateA.reason ?? "UNKNOWN", p2: c8.p2.status });
    const c9 = runP2Precondition(makeP4Records("C9").map((record, index) => ({
      ...record,
      geometryClass: Number(record.independenceGroupId.slice(1)) < 29 ? "pool" : `singleton-${index}`,
    })));
    audited.set("C9", { gateA: c9.gateA.reason ?? "UNKNOWN", p2: c9.p2.status });

    expect([...audited.keys()].sort((left, right) => expectedIds.indexOf(left) - expectedIds.indexOf(right))).toEqual(expectedIds);
    expect(audited.get("N0")).toMatchObject({ gateA: "PASS", p2: "READY" });
    expect(audited.get("N11_ORDERED")).toMatchObject({ gateA: "PASS", p2: "READY" });
    expect(audited.get("N11_ORDER_DESTROYED")).toMatchObject({ gateA: "PASS", p2: "READY" });
    expect(audited.get("N12")).toMatchObject({ p2: "EXHAUSTIVE" });
    expect(audited.get("N13")).toMatchObject({ p2: "MONTE_CARLO" });
    expect(audited.get("E2")).toMatchObject({ p2: "ONLY_OBSERVED_REALIZATION" });
    expect(audited.get("E3")).toMatchObject({ p2: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED" });
    for (const fixtureId of ["C3", "C4", "C5", "C6", "C7", "C8", "C9"]) {
      expect(audited.get(fixtureId)?.p2).toBe("NOT_RUN");
    }
  });

  test("correction hash manifest binds the human and machine authority artifacts", () => {
    const manifestPath = "docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p1-p2-exact-null-arithmetic-compatibility-v0.1/hash-manifest.json";
    const manifest = JSON.parse(readFileSync(join(process.cwd(), manifestPath), "utf8")) as {
      contractId: string;
      humanArtifact: { path: string; bytes: number; sha256: string };
      machineArtifact: { path: string; bytes: number; sha256: string };
      testPath: string;
    };
    expect(manifest.contractId).toBe("OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P1_P2_EXACT_NULL_ARITHMETIC_COMPATIBILITY_V0_1");
    for (const artifact of [manifest.humanArtifact, manifest.machineArtifact]) {
      expect(statSync(join(process.cwd(), artifact.path)).size).toBe(artifact.bytes);
      expect(sha256File(artifact.path)).toBe(artifact.sha256);
    }
    expect(manifest.testPath).toBe("tests/openInstrument.frd02CvcP1P2Compatibility.v0_1.spec.ts");
  });
});
