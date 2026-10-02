import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildP4ScheduleV0_1B,
  evaluateP4FixtureAcceptanceV0_1B,
  evaluateP4N11PairAcceptanceV0_1B,
  fixtureJointTableV0_1B,
  fixtureNormalizationPreviewV0_1B,
  generateP4FixtureV0_1B,
  p4AuthorityBindingsV0_1B,
  P4_REPLICATES_PER_FIXTURE_V0_1B,
  P4_SUBCASE_ALLOCATION_CONTRACT_ID_V0_1,
  P4_SUBCASE_ALLOCATION_HUMAN_SHA256_V0_1,
  P4_SUBCASE_ALLOCATION_MACHINE_SHA256_V0_1,
  P4_TOTAL_EVALUATIONS_V0_1B,
  runP4SingleReplicateV0_1B,
  serializeP4CanonicalV0_1B,
} from "../src/shared/openInstrument/frd02CvcP4Implementation.v0_1b";
import type { P4PairReplicateResultV0_1B, P4ReplicateResultV0_1B } from "../src/shared/openInstrument/frd02CvcP4Implementation.v0_1b";
import { FIXTURE_IDS_V0_1B, STRATA_V0_1B } from "../src/shared/openInstrument/frd02CvcSyntheticCalibration.v0_1b";

describe("FRD-02 P4 implementation and validation", () => {
  test("binds the frozen subcase allocation bytes before remediation", () => {
    const humanPath = resolve(process.cwd(), "docs/open-instrument/frd02-cvc-v0.1b-p4-c6-c7-c8-subcase-allocation-correction-v0.1.md");
    const machinePath = resolve(process.cwd(), "docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-c6-c7-c8-subcase-allocation-correction-v0.1/preregistration.json");
    const manifestPath = resolve(process.cwd(), "docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-c6-c7-c8-subcase-allocation-correction-v0.1/hash-manifest.json");
    const sha256 = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
    const human = readFileSync(humanPath);
    const machine = readFileSync(machinePath);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as {
      contractId: string;
      allocationFrozenBeforeImplementation: boolean;
      artifacts: readonly { path: string; sha256: string; byteLength: number }[];
    };
    expect(manifest.contractId).toBe(P4_SUBCASE_ALLOCATION_CONTRACT_ID_V0_1);
    expect(manifest.allocationFrozenBeforeImplementation).toBe(true);
    expect(sha256(human)).toBe(P4_SUBCASE_ALLOCATION_HUMAN_SHA256_V0_1);
    expect(sha256(machine)).toBe(P4_SUBCASE_ALLOCATION_MACHINE_SHA256_V0_1);
    expect(manifest.artifacts).toEqual(expect.arrayContaining([
      expect.objectContaining({ sha256: P4_SUBCASE_ALLOCATION_HUMAN_SHA256_V0_1, byteLength: human.byteLength }),
      expect.objectContaining({ sha256: P4_SUBCASE_ALLOCATION_MACHINE_SHA256_V0_1, byteLength: machine.byteLength }),
    ]));
  });

  test("binds the frozen authority stack and accounts for all fixtures", () => {
    const bindings = p4AuthorityBindingsV0_1B();
    expect(bindings.contractId).toBe("OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_METHODOLOGY_V0_1");
    expect(bindings.humanContractSha256).toBe("798278dbe0d3077700300dd9ad0c531dab422d3a46a7f488fc274b00ba74d5c9");
    expect(bindings.machineContractSha256).toBe("168ed4803d2a33690e88caf2d9bd138c0f0cd96bebd25248c0e1e63ab2927bea");
    expect(bindings.fixtureCorrectionMachineSha256).toBe("20b593af98ac51f7c962d42debcf5a7f03dfcbfb6c3d64c70d9a27c8c6fe7a96");
    expect(bindings.p1P2CorrectionMachineSha256).toBe("ed81a8e85341a38d2b08b5a1b706c4699b9c3ad287dea048a70108ce7d436a47");
    expect(bindings.subcaseAllocationContractId).toBe("OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_C6_C7_C8_SUBCASE_ALLOCATION_CORRECTION_V0_1");
    expect(bindings.subcaseAllocationHumanSha256).toBe("b63b88783b2df96c93b38fe891a616b2801dbef42d175c7d7a1bb88e6a365547");
    expect(bindings.subcaseAllocationMachineSha256).toBe("4c94d32b5089c5ea74a0c8a5e74e60616b561241d12723c180fafb48838f3f4e");
    expect(FIXTURE_IDS_V0_1B).toHaveLength(29);
    expect(new Set(FIXTURE_IDS_V0_1B).size).toBe(29);
  });

  test("preserves the corrected common and N11 joint constructions", () => {
    const common = generateP4FixtureV0_1B("N0", "0");
    const ordered = generateP4FixtureV0_1B("N11_ORDERED", "0");
    const destroyed = generateP4FixtureV0_1B("N11_ORDER_DESTROYED", "0");
    expect(common.kind).toBe("single");
    expect(ordered.kind).toBe("single");
    expect(destroyed.kind).toBe("single");
    if (common.kind !== "single" || ordered.kind !== "single" || destroyed.kind !== "single") return;
    expect(fixtureJointTableV0_1B(common.records)).toEqual({ L0: { R0: 24, R1: 24 }, L1: { R0: 24, R1: 24 } });
    expect(fixtureJointTableV0_1B(ordered.records)).toEqual({ L0: { R0: 48 }, L1: { R1: 48 } });
    expect(fixtureJointTableV0_1B(destroyed.records)).toEqual({ L0: { R0: 24, R1: 24 }, L1: { R0: 24, R1: 24 } });
    expect(serializeP4CanonicalV0_1B(fixtureJointTableV0_1B(common.records))).not.toBe(serializeP4CanonicalV0_1B(fixtureJointTableV0_1B(ordered.records)));
    expect(common.records).toHaveLength(96 * STRATA_V0_1B.length);
  });

  test("generates all 29 fixtures with explicit cluster truth and frozen shape", () => {
    for (const fixtureId of FIXTURE_IDS_V0_1B) {
      const fixture = generateP4FixtureV0_1B(fixtureId, "0");
      if (fixture.kind === "pair") {
        expect(fixture.ordered.records).toHaveLength(96 * STRATA_V0_1B.length);
        expect(fixture.destroyed.records).toHaveLength(96 * STRATA_V0_1B.length);
        continue;
      }
      expect(fixture.records.length).toBeGreaterThan(0);
      expect(fixture.records.every((record) => typeof record.clusterAdjacent === "boolean")).toBe(true);
      expect(fixture.records.every((record) => record.fixtureId === fixtureId && record.replicateId === "0")).toBe(true);
    }
    const e1 = generateP4FixtureV0_1B("E1", "0");
    const c1 = generateP4FixtureV0_1B("C1", "0");
    if (e1.kind !== "single" || c1.kind !== "single") return;
    expect(e1.records.filter((record) => record.clusterAdjacent)).toHaveLength(1);
    expect(c1.records.filter((record) => record.clusterAdjacent)).toHaveLength(1);
  });

  test("builds exactly the frozen 232-entry non-adaptive schedule", () => {
    const first = buildP4ScheduleV0_1B();
    const second = buildP4ScheduleV0_1B();
    expect(first).toHaveLength(P4_TOTAL_EVALUATIONS_V0_1B);
    expect(first).toHaveLength(29 * P4_REPLICATES_PER_FIXTURE_V0_1B);
    expect(serializeP4CanonicalV0_1B(first)).toBe(serializeP4CanonicalV0_1B(second));
    expect(first.slice(0, 8).map((entry) => entry.replicateId)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7"]);
    expect(first[0]?.seedWords.every((word) => /^\d+$/.test(word))).toBe(true);
    for (const fixtureId of ["C6", "C7", "C8"] as const) {
      const entries = first.filter((entry) => entry.fixtureId === fixtureId);
      expect(entries.slice(0, 4).map((entry) => entry.subcase)).toEqual(["default", "default", "default", "default"]);
      expect(entries.slice(4).map((entry) => entry.subcase)).toEqual(fixtureId === "C7" ? ["position", "position", "position", "position"] : ["right", "right", "right", "right"]);
    }
  });

  test("keeps normalization and Gate A failure controls deterministic", () => {
    const c1 = generateP4FixtureV0_1B("C1", "0");
    const c2 = generateP4FixtureV0_1B("C2", "0");
    const c3 = generateP4FixtureV0_1B("C3", "0");
    if (c1.kind !== "single" || c2.kind !== "single" || c3.kind !== "single") return;
    expect(fixtureNormalizationPreviewV0_1B(c1.records).excludedClusterAdjacentRecordIds).toHaveLength(1);
    expect(fixtureNormalizationPreviewV0_1B(c2.records).excludedRepeatedRecordIds).toHaveLength(1);
    const c3Result = runP4SingleReplicateV0_1B(c3);
    expect(c3Result.valid).toBe(true);
    expect(c3Result.gateA).toMatchObject({ pass: false, reason: "MINIMUM_ELIGIBLE_GROUPS_NOT_MET" });
    expect(c3Result.gateB).toEqual({ status: "NOT_RUN" });
    expect(c3Result.outcome).toBe("INSUFFICIENT_EVIDENCE");
  });

  test("reaches the frozen E2 and E3 P2 boundaries without fallback", () => {
    const e2 = generateP4FixtureV0_1B("E2", "0");
    const e3 = generateP4FixtureV0_1B("E3", "0");
    if (e2.kind !== "single" || e3.kind !== "single") return;
    const e2Result = runP4SingleReplicateV0_1B(e2);
    const e3Result = runP4SingleReplicateV0_1B(e3);
    expect(e2Result.valid).toBe(true);
    expect(e2Result.gateA?.pass).toBe(true);
    expect(e2Result.gateB).toMatchObject({ status: "FAILURE", reason: "ONLY_OBSERVED_REALIZATION" });
    expect(e2Result.outcome).toBe("INSUFFICIENT_EVIDENCE");
    expect(e3Result.valid).toBe(false);
    expect(e3Result.invalidReason).toBe("EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED");
    expect(e3Result.gateA?.pass).toBe(true);
    expect(e3Result.gateB).toMatchObject({ status: "FAILURE", reason: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED" });
    expect(e3Result.outcome).toBe("INSUFFICIENT_EVIDENCE");
  });

  test("supports the exact N12 and N13 branch constructions", () => {
    const n12 = generateP4FixtureV0_1B("N12", "0");
    const n13 = generateP4FixtureV0_1B("N13", "0");
    if (n12.kind !== "single" || n13.kind !== "single") return;
    const n12Result = runP4SingleReplicateV0_1B(n12);
    const n13Result = runP4SingleReplicateV0_1B(n13);
    expect(n12Result.valid).toBe(true);
    expect(n12Result.gateA?.pass).toBe(true);
    expect(n12Result.gateB).toMatchObject({ status: "READY", branch: "EXHAUSTIVE", totalCount: "10000" });
    expect(n12Result.outcome).toBe("NULL");
    expect(n13Result.valid).toBe(true);
    expect(n13Result.gateA?.pass).toBe(true);
    expect(n13Result.gateB).toMatchObject({ status: "READY", branch: "MONTE_CARLO", totalCount: "10001" });
    expect(n13Result.outcome).toBe("NULL");
  }, 120000);

  test("keeps methodology FAIL distinct from INVALID", () => {
    const valid = runP4SingleReplicateV0_1B(generateP4FixtureV0_1B("C3", "0") as Extract<ReturnType<typeof generateP4FixtureV0_1B>, { kind: "single" }>);
    const invalid = { ...valid, valid: false, invalidReason: "RUNTIME_FAILURE" };
    const validResults = Array.from({ length: 8 }, (_, index) => ({ ...valid, replicateId: String(index) }));
    const fail = evaluateP4FixtureAcceptanceV0_1B("C3", validResults);
    const invalidAcceptance = evaluateP4FixtureAcceptanceV0_1B("C3", validResults.map(() => invalid));
    expect(fail.outcome).toBe("CALIBRATION_PASS");
    expect(invalidAcceptance.outcome).toBe("CALIBRATION_INVALID");
  });

  test("rejects duplicate or missing replicate identities and invalid fixture IDs", () => {
    const valid = runP4SingleReplicateV0_1B(generateP4FixtureV0_1B("C3", "0") as Extract<ReturnType<typeof generateP4FixtureV0_1B>, { kind: "single" }>);
    const duplicateIds = evaluateP4FixtureAcceptanceV0_1B("C3", Array.from({ length: 8 }, () => valid));
    expect(duplicateIds.outcome).toBe("CALIBRATION_INVALID");
    expect(duplicateIds.invalidReplicates).toBe(8);
    for (const replicateId of ["-1", "8", "1.0", "missing", undefined]) {
      expect(() => generateP4FixtureV0_1B("C3", replicateId as never)).toThrow("INVALID_P4_REPLICATE_ID");
    }
  });

  test("accepts E2's finite failure and invalidates E3's resource failure", () => {
    const e2 = runP4SingleReplicateV0_1B(generateP4FixtureV0_1B("E2", "0") as Extract<ReturnType<typeof generateP4FixtureV0_1B>, { kind: "single" }>);
    const e3 = runP4SingleReplicateV0_1B(generateP4FixtureV0_1B("E3", "0") as Extract<ReturnType<typeof generateP4FixtureV0_1B>, { kind: "single" }>);
    const e2Acceptance = evaluateP4FixtureAcceptanceV0_1B("E2", Array.from({ length: 8 }, (_, index) => ({ ...e2, replicateId: String(index) })));
    const e3Acceptance = evaluateP4FixtureAcceptanceV0_1B("E3", Array.from({ length: 8 }, (_, index) => ({ ...e3, replicateId: String(index) })));
    expect(e2Acceptance.outcome).toBe("CALIBRATION_PASS");
    expect(e3Acceptance.outcome).toBe("CALIBRATION_INVALID");
  });

  test("accepts the frozen N11 pair only when ordered exceeds destroyed", () => {
    const single = (fixtureId: "N11_ORDERED" | "N11_ORDER_DESTROYED", outcome: "CVC_CONFIGURATIONAL_SUPPORT" | "NULL", statistic: number): P4ReplicateResultV0_1B => ({
      valid: true,
      fixtureId,
      replicateId: "0",
      inputSha256: null,
      constructionFingerprint: null,
      seedTuple: null,
      seedWords: null,
      normalization: null,
      gateA: { pass: true, state: "PASS", reason: null },
      gateB: { status: "READY", branch: "MONTE_CARLO", totalCount: "10001" },
      statistic,
      pValue: null,
      outcome,
      reason: null,
      invalidReason: null,
    });
    const results: P4PairReplicateResultV0_1B[] = Array.from({ length: 8 }, (_, index) => ({
      valid: true,
      fixtureId: "N11",
      replicateId: String(index),
      ordered: { ...single("N11_ORDERED", "CVC_CONFIGURATIONAL_SUPPORT", 2), replicateId: String(index) },
      destroyed: { ...single("N11_ORDER_DESTROYED", "NULL", 1), replicateId: String(index) },
      invalidReason: null,
    }));
    const acceptance = evaluateP4N11PairAcceptanceV0_1B(results);
    expect(acceptance.outcome).toBe("CALIBRATION_PASS");
    expect(evaluateP4N11PairAcceptanceV0_1B(results.map((entry) => ({ ...entry, ordered: { ...entry.ordered, replicateId: "0" } })) as P4PairReplicateResultV0_1B[]).outcome).toBe("CALIBRATION_INVALID");
  });
});
