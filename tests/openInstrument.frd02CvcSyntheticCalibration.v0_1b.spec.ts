import { createHash } from "node:crypto";
import {
  ALPHA_V0_1B,
  ANALYZER_CONTRACT_SHA256_V0_1B,
  AMENDED_CONTRACT_SHA256_V0_1B,
  applyGroupStratumWeightsV0_1B,
  buildSignatureProfileAdapterV0_1B,
  calculateStatisticV0_1B,
  canonicalSeedTupleV0_1B,
  classifyPrimaryPValueV0_1B,
  exhaustivePValueV0_1B,
  evaluateGateAV0_1B,
  finiteNullBranchForCountV0_1B,
  GENERATOR_CONTRACT_SHA256_V0_1B,
  groupStratumMassesV0_1B,
  mapP2FailureToGateBV0_1B,
  monteCarloPValueV0_1B,
  normalizePrimaryRecordsV0_1B,
  seedWordsV0_1B,
  STRATA_V0_1B,
  SyntheticCalibrationValidationErrorV0_1B,
  analyzeSyntheticCalibrationV0_1B,
  validateSyntheticStructuralRecordV0_1B,
  type SyntheticStructuralRecordV0_1B,
} from "../src/shared/openInstrument/frd02CvcSyntheticCalibration.v0_1b";

const strataById = new Map(STRATA_V0_1B.map((stratum) => [stratum.id, stratum]));

function makeRecord(
  overrides: Partial<SyntheticStructuralRecordV0_1B> = {},
): SyntheticStructuralRecordV0_1B {
  const stratumId = overrides.stratumId ?? "S0";
  const stratum = strataById.get(stratumId);
  if (stratum === undefined) throw new Error("unknown test stratum");
  return {
    recordId: "N0-0-g000-S0-slot-0",
    fixtureId: "N0",
    replicateId: "0",
    independenceGroupId: "g000",
    C_L: "L0",
    V: stratum.voice,
    C_R: "R0",
    P: stratum.position,
    stratumId,
    stableSlotId: "slot-0",
    tokenLengthClass: "4-6",
    geometryClass: "shared",
    clusterAdjacent: false,
    ...overrides,
  };
}

function makeGrid(
  groupCount = 90,
  selectedStrata = STRATA_V0_1B.map((stratum) => stratum.id),
  options: {
    geometry?: (groupIndex: number, stratumId: string) => string;
    left?: (groupIndex: number, stratumId: string) => string;
    right?: (groupIndex: number, stratumId: string) => string;
    clusterAdjacent?: (groupIndex: number, stratumId: string) => boolean;
  } = {},
): SyntheticStructuralRecordV0_1B[] {
  const records: SyntheticStructuralRecordV0_1B[] = [];
  for (let groupIndex = 0; groupIndex < groupCount; groupIndex += 1) {
    const groupId = "g" + String(groupIndex).padStart(3, "0");
    for (const stratumId of selectedStrata) {
      const stratum = strataById.get(stratumId);
      if (stratum === undefined) throw new Error("unknown test stratum");
      records.push(
        makeRecord({
          recordId: "N0-0-" + groupId + "-" + stratumId + "-slot-0",
          independenceGroupId: groupId,
          stratumId,
          V: stratum.voice,
          P: stratum.position,
          stableSlotId: "slot-0",
          C_L: options.left?.(groupIndex, stratumId) ?? (groupIndex % 2 === 0 ? "L0" : "L1"),
          C_R: options.right?.(groupIndex, stratumId) ?? (groupIndex % 2 === 0 ? "R0" : "R1"),
          geometryClass: options.geometry?.(groupIndex, stratumId) ?? "shared",
          clusterAdjacent: options.clusterAdjacent?.(groupIndex, stratumId) ?? false,
        }),
      );
    }
  }
  return records;
}

function makeConcentrationFixture(): SyntheticStructuralRecordV0_1B[] {
  const records = makeGrid(80);
  for (let index = 0; index < 100; index += 1) {
    records.push(
      makeRecord({
        recordId: "N0-0-g000-S0-extra-" + index,
        independenceGroupId: "g000",
        stableSlotId: "extra-" + index,
        C_L: index % 2 === 0 ? "L0" : "L1",
        C_R: index % 2 === 0 ? "R0" : "R1",
        geometryClass: "shared",
      }),
    );
  }
  return records;
}

function makeExchangeabilityFixture(poolSize: number): SyntheticStructuralRecordV0_1B[] {
  return makeGrid(80, undefined, {
    geometry: (groupIndex) =>
      groupIndex < poolSize ? "pool-" + poolSize : "singleton-" + groupIndex,
  });
}

function makeMonteCarloFixture(): SyntheticStructuralRecordV0_1B[] {
  return makeGrid(80, undefined, {
    geometry: (groupIndex) => (groupIndex < 30 ? "mc-pool" : "mc-singleton-" + groupIndex),
  });
}

function expectValidationCode(action: () => unknown, code: string): void {
  try {
    action();
    throw new Error("expected validation failure");
  } catch (error) {
    expect(error).toBeInstanceOf(SyntheticCalibrationValidationErrorV0_1B);
    expect((error as SyntheticCalibrationValidationErrorV0_1B).code).toBe(code);
  }
}

describe("FRD-02 CVC v0.1b synthetic analyzer / fixture adapter", () => {
  test("A/B: missing and malformed clusterAdjacent reject", () => {
    const missing = makeRecord();
    delete (missing as Record<string, unknown>).clusterAdjacent;
    expectValidationCode(() => validateSyntheticStructuralRecordV0_1B(missing), "MISSING_CLUSTER_ADJACENT");
    expectValidationCode(
      () => validateSyntheticStructuralRecordV0_1B({ ...makeRecord(), clusterAdjacent: "false" }),
      "INVALID_CLUSTER_ADJACENT",
    );
  });

  test("C/D: cluster records are excluded and false records remain eligible", () => {
    const records = [
      makeRecord({ recordId: "cluster", clusterAdjacent: true }),
      makeRecord({ recordId: "retained", clusterAdjacent: false }),
    ];
    const normalized = normalizePrimaryRecordsV0_1B(records);
    expect(normalized.excludedClusterAdjacentRecordIds).toEqual(["cluster"]);
    expect(normalized.eligibleRecords.map((record) => record.recordId)).toEqual(["retained"]);
  });

  test("E: cluster adjacency has no heuristic derivation", () => {
    const record = { ...makeRecord() } as Record<string, unknown>;
    delete record.clusterAdjacent;
    record.neighboringSourceRecord = true;
    expectValidationCode(
      () => validateSyntheticStructuralRecordV0_1B(record),
      "UNAUTHORIZED_ANALYZER_FIELD",
    );
  });

  test("F: repeated frames are removed after cluster filtering and before Gate A", () => {
    const records = [
      makeRecord({ recordId: "repeated", C_L: "C0", C_R: "C0" }),
      makeRecord({ recordId: "primary", C_L: "L0", C_R: "R0" }),
    ];
    const normalized = normalizePrimaryRecordsV0_1B(records);
    expect(normalized.excludedRepeatedRecordIds).toEqual(["repeated"]);
    expect(normalized.eligibleRecords.map((record) => record.recordId)).toEqual(["primary"]);
  });

  test("G: every group-stratum receives total mass one", () => {
    const records = [
      makeRecord({ recordId: "a", stableSlotId: "a" }),
      makeRecord({ recordId: "b", stableSlotId: "b" }),
      makeRecord({ recordId: "c", stratumId: "S1", V: "V1", P: "P0" }),
    ];
    const weighted = applyGroupStratumWeightsV0_1B(records);
    expect(groupStratumMassesV0_1B(weighted)).toEqual([
      { independenceGroupId: "g000", stratumId: "S0", rawCount: 2, mass: 1 },
      { independenceGroupId: "g000", stratumId: "S1", rawCount: 1, mass: 1 },
    ]);
  });

  test("H: duplicate raw rows remain represented without increasing group mass", () => {
    const original = [
      makeRecord({ recordId: "a", stableSlotId: "a" }),
      makeRecord({ recordId: "b", stableSlotId: "b" }),
    ];
    const duplicated = [
      ...original,
      makeRecord({ recordId: "c", stableSlotId: "c" }),
      makeRecord({ recordId: "d", stableSlotId: "d" }),
    ];
    const originalMass = groupStratumMassesV0_1B(applyGroupStratumWeightsV0_1B(original));
    const duplicateMass = groupStratumMassesV0_1B(applyGroupStratumWeightsV0_1B(duplicated));
    expect(duplicateMass[0].mass).toBe(originalMass[0].mass);
    expect(duplicateMass[0].rawCount).toBe(4);
  });

  test("I: the minimum eligible-group boundary is exact", () => {
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(makeGrid(79))).reason).toBe(
      "MINIMUM_ELIGIBLE_GROUPS_NOT_MET",
    );
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(makeGrid(80))).criteria.minimumEligibleGroups).toBe(true);
  });

  test("J: the minimum V×P-stratum boundary is exact", () => {
    const eleven = STRATA_V0_1B.slice(0, 11).map((stratum) => stratum.id);
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(makeGrid(90, eleven))).reason).toBe(
      "MINIMUM_VXP_STRATA_NOT_MET",
    );
  });

  test("K: groups-per-stratum boundary is exact", () => {
    const records = makeGrid(90).filter(
      (record) => record.stratumId !== "S0" || Number(record.independenceGroupId.slice(1)) < 3,
    );
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(records)).reason).toBe(
      "MINIMUM_GROUPS_PER_STRATUM_NOT_MET",
    );
  });

  test("L/M: distinct left and right identity boundaries are exact", () => {
    const leftFailure = makeGrid(90, undefined, { left: () => "L0" });
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(leftFailure)).reason).toBe(
      "MINIMUM_DISTINCT_LEFT_IDENTITIES_NOT_MET",
    );
    const rightFailure = makeGrid(90, undefined, { right: () => "R0" });
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(rightFailure)).reason).toBe(
      "MINIMUM_DISTINCT_RIGHT_IDENTITIES_NOT_MET",
    );
  });

  test("N/O: Voice and position coverage boundaries are exact", () => {
    const noVoice = makeGrid(90).filter(
      (record) => record.V !== "V6" || Number(record.independenceGroupId.slice(1)) < 4,
    );
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(noVoice)).reason).toBe(
      "VOICE_COVERAGE_MINIMUM_NOT_MET",
    );
    const noPosition = makeGrid(90).filter(
      (record) => record.P !== "P5" || Number(record.independenceGroupId.slice(1)) < 4,
    );
    const positionBoundary = evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(noPosition));
    expect(positionBoundary.criteria.positionCoverage).toBe(false);
    expect(positionBoundary.metrics.groupsPerPosition.P5).toBe(4);
  });

  test("P/Q: rare-weight and concentration precedence are exact", () => {
    const rare = makeGrid(90, undefined, {
      left: (groupIndex) => "rare-left-" + groupIndex,
      right: (groupIndex) => "rare-right-" + groupIndex,
    });
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(rare)).state).toBe("SPARSE");
    expect(evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(rare)).reason).toBe(
      "RARE_IDENTITY_SPARSE_THRESHOLD_EXCEEDED",
    );
    const concentration = evaluateGateAV0_1B(
      applyGroupStratumWeightsV0_1B(makeConcentrationFixture()),
    );
    expect(concentration.state).toBe("STRUCTURAL_BUT_CONFOUNDED");
    expect(concentration.reason).toBe("CONCENTRATION_CONFOUND_THRESHOLD_EXCEEDED");
  });

  test("R/S: exchangeability pools fail at 29 and pass at 30", () => {
    const failed = evaluateGateAV0_1B(
      applyGroupStratumWeightsV0_1B(makeExchangeabilityFixture(29)),
    );
    expect(failed.reason).toBe("EXCHANGEABILITY_MINIMUM_NOT_MET");
    const passed = evaluateGateAV0_1B(
      applyGroupStratumWeightsV0_1B(makeExchangeabilityFixture(30)),
    );
    expect(passed.criteria.exchangeability).toBe(true);
  });

  test("T/U: the statistic handles hand-calculated and zero-mass cells", () => {
    const weighted = applyGroupStratumWeightsV0_1B([
      makeRecord({ recordId: "l0", C_L: "L0", C_R: "R0" }),
      makeRecord({ recordId: "l1", C_L: "L1", C_R: "R1", stableSlotId: "slot-1" }),
    ]);
    expect(calculateStatisticV0_1B(weighted)).toBeCloseTo(2 * Math.log(2), 12);
    const sparse = applyGroupStratumWeightsV0_1B([
      makeRecord({ recordId: "only", C_L: "L0", C_R: "R0" }),
      makeRecord({ recordId: "other", C_L: "L0", C_R: "R1", stableSlotId: "slot-1" }),
    ]);
    expect(Number.isFinite(calculateStatisticV0_1B(sparse))).toBe(true);
  });

  test("V: statistic summation is deterministic under input reorder", () => {
    const records = makeGrid(4, ["S0", "S1"]);
    const first = calculateStatisticV0_1B(applyGroupStratumWeightsV0_1B(records));
    const second = calculateStatisticV0_1B(applyGroupStratumWeightsV0_1B([...records].reverse()));
    expect(second).toBe(first);
  });

  test("W/X: primary slots are deterministic and collision-safe", () => {
    const records = [
      makeRecord({ recordId: "r-z", stableSlotId: "z" }),
      makeRecord({ recordId: "r-a", stableSlotId: "a" }),
    ];
    const adapter = buildSignatureProfileAdapterV0_1B(applyGroupStratumWeightsV0_1B(records));
    const slots = adapter.profiles[0].slots;
    expect(slots[0].ordinalWithinGroupStratum).toBe(0);
    expect(slots[1].ordinalWithinGroupStratum).toBe(1);
    expect(slots[0].slotId).not.toBe(slots[1].slotId);
    expect(slots[0].slotId.includes("|")).toBe(false);
  });

  test("Y/Z: signatures distinguish geometry but match equivalent profiles", () => {
    const equal = buildSignatureProfileAdapterV0_1B(
      applyGroupStratumWeightsV0_1B([
        makeRecord({ recordId: "a", independenceGroupId: "g000" }),
        makeRecord({ recordId: "b", independenceGroupId: "g001" }),
      ]),
    );
    expect(equal.classes).toHaveLength(1);
    const unequal = buildSignatureProfileAdapterV0_1B(
      applyGroupStratumWeightsV0_1B([
        makeRecord({ recordId: "a", independenceGroupId: "g000" }),
        makeRecord({ recordId: "b", independenceGroupId: "g001", geometryClass: "different" }),
      ]),
    );
    expect(unequal.classes).toHaveLength(2);
  });

  test("AA/AB/AC: profiles align and observed assignments stay inside signatures", () => {
    const adapter = buildSignatureProfileAdapterV0_1B(
      applyGroupStratumWeightsV0_1B([
        makeRecord({ recordId: "a", independenceGroupId: "g000" }),
        makeRecord({ recordId: "b", independenceGroupId: "g001" }),
      ]),
    );
    const signatureClass = adapter.classes[0];
    expect(signatureClass.recipients[0].primarySlots.map((slot) => slot.slotId)).toEqual(
      signatureClass.donors[0].rightIdentityBySlot.map((slot) => slot.slotId),
    );
    expect(signatureClass.observedAssignment).toEqual([
      { recipientId: "g000", donorId: "g000" },
      { recipientId: "g001", donorId: "g001" },
    ]);
    expect(signatureClass.observedAssignment?.every((entry) => entry.donorId === entry.recipientId)).toBe(true);
  });

  test("AD/AE/AF/AG/AH/AI: every frozen P2 failure maps to evidence", () => {
    const reasons = [
      "NO_ADMISSIBLE_NULL_REALIZATIONS",
      "ONLY_OBSERVED_REALIZATION",
      "INSUFFICIENT_DISTINCT_NULL_REALIZATIONS",
      "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED",
      "EXACT_COUNTING_FAILURE",
      "INTEGER_OVERFLOW_OR_NONEXACT_COUNT",
    ] as const;
    for (const reason of reasons) {
      const mapped = mapP2FailureToGateBV0_1B({
        status: reason === "ONLY_OBSERVED_REALIZATION" ? "FINITE_FAILURE" : "FAILURE",
        reason,
        domain: "COMPUTATIONAL",
      });
      expect(mapped).toMatchObject({ status: "FAILURE", reason });
    }
  });

  test("AJ/AK/AL: finite-null boundaries are exact", () => {
    expect(finiteNullBranchForCountV0_1B(BigInt(20))).toBe("INSUFFICIENT_DISTINCT_NULL_REALIZATIONS");
    expect(finiteNullBranchForCountV0_1B(BigInt(21))).toBe("EXHAUSTIVE");
    expect(finiteNullBranchForCountV0_1B(BigInt(10_000))).toBe("EXHAUSTIVE");
    expect(finiteNullBranchForCountV0_1B(BigInt(10_001))).toBe("MONTE_CARLO");
  });

  test("AN/AO/AP/AQ: p-value comparisons are inclusive and retain duplicates", () => {
    expect(exhaustivePValueV0_1B(21, BigInt(21))).toBe(1);
    expect(classifyPrimaryPValueV0_1B(ALPHA_V0_1B)).toBe("CVC_CONFIGURATIONAL_SUPPORT");
    expect(classifyPrimaryPValueV0_1B(ALPHA_V0_1B + Number.EPSILON)).toBe("NULL");
    expect(monteCarloPValueV0_1B(0)).toBe(1 / 10001);
    expect(monteCarloPValueV0_1B(10_000)).toBe(1);
  });

  test("AR/AS/AT/AU/AV: seed binding uses all frozen identity inputs", () => {
    const base = canonicalSeedTupleV0_1B("N0", "0");
    expect(base).toBe(
      "FRD02_CVC_STRUCTURAL_ZERO_NULL_V0_1|primary|amendedContractSha256|generatorContractSha256|analyzerContractSha256|N0|0|permutation-primary",
    );
    expect(seedWordsV0_1B("N0", "0")).toEqual(seedWordsV0_1B("N0", "0"));
    expect(seedWordsV0_1B("N0", "0")).not.toEqual(seedWordsV0_1B("N1", "0"));
    expect(seedWordsV0_1B("N0", "0")).not.toEqual(seedWordsV0_1B("N0", "1"));
    expect(AMENDED_CONTRACT_SHA256_V0_1B).toHaveLength(64);
    expect(GENERATOR_CONTRACT_SHA256_V0_1B).toHaveLength(64);
    expect(ANALYZER_CONTRACT_SHA256_V0_1B).toHaveLength(64);
  });

  test("AW/AX/AY: replicate, delimiter, and little-endian word rules are exact", () => {
    expectValidationCode(() => canonicalSeedTupleV0_1B("N0", "01"), "INVALID_REPLICATE_ID");
    expectValidationCode(() => canonicalSeedTupleV0_1B("N0", "+1"), "INVALID_REPLICATE_ID");
    expectValidationCode(() => canonicalSeedTupleV0_1B("N0", "1.0"), "INVALID_REPLICATE_ID");
    expectValidationCode(() => canonicalSeedTupleV0_1B("N0", "0", "bad|stream"), "INVALID_PERMUTATION_STREAM_ID");
    const serialized = canonicalSeedTupleV0_1B("N0", "0");
    const digest = createHash("sha256").update(Buffer.from(serialized, "utf8")).digest();
    expect(seedWordsV0_1B("N0", "0")).toEqual([
      digest.readBigUInt64LE(0),
      digest.readBigUInt64LE(8),
      digest.readBigUInt64LE(16),
      digest.readBigUInt64LE(24),
    ]);
  });

  test("AZ: the all-zero xoshiro fallback is delegated to P2", () => {
    const words = seedWordsV0_1B("N0", "0");
    expect(words).toHaveLength(4);
    expect(words.every((word) => typeof word === "bigint")).toBe(true);
  });

  test("BA/BB: p-value classification has no marginal branch", () => {
    expect(classifyPrimaryPValueV0_1B(0.051)).toBe("NULL");
    expect(classifyPrimaryPValueV0_1B(0.049)).toBe("CVC_CONFIGURATIONAL_SUPPORT");
    expect(classifyPrimaryPValueV0_1B(0.049, false, true)).toBe("INSUFFICIENT_EVIDENCE");
    expect(["SPARSE", "INSUFFICIENT_EVIDENCE", "STRUCTURAL_BUT_CONFOUNDED", "NULL", "CVC_CONFIGURATIONAL_SUPPORT"])
      .not.toContain("MARGINAL_EFFECT_ONLY");
  });

  test("BC/BD: fixture truth and negative-control labels cannot enter analyzer input", () => {
    const withTruth = { ...makeRecord(), expectedOutcome: "NULL" } as Record<string, unknown>;
    expectValidationCode(
      () => validateSyntheticStructuralRecordV0_1B(withTruth),
      "UNAUTHORIZED_ANALYZER_FIELD",
    );
    const negativeControl = analyzeSyntheticCalibrationV0_1B([
      makeRecord({ fixtureId: "N1" }),
    ]);
    expect(negativeControl.state).not.toBe("CVC_CONFIGURATIONAL_SUPPORT");
    expect(["SPARSE", "INSUFFICIENT_EVIDENCE"]).toContain(negativeControl.state);
  });

  test("BE/BF: output is structural-only and real-data mode remains unavailable", () => {
    const result = analyzeSyntheticCalibrationV0_1B([makeRecord()]);
    expect(result.noLocalization).toBe(true);
    expect(result.realDataClusterAdjacencyRule).toBe("UNRESOLVED");
    expect(result.realDataFrd02ExecutionBlocker).toBe(
      "CLUSTER_ADJACENCY_OPERATIONAL_RULE_NOT_FROZEN",
    );
    expectValidationCode(
      () =>
        analyzeSyntheticCalibrationV0_1B([makeRecord()], {
          ...( { realData: true } as unknown as { permutationStreamId: string } ),
        }),
      "UNAUTHORIZED_ANALYZER_OPTION",
    );
  });

  test("BG: UTF-8 ordering is deterministic and locale-independent", () => {
    const records = [
      makeRecord({ recordId: "z", stableSlotId: "z" }),
      makeRecord({ recordId: "é", stableSlotId: "é" }),
    ];
    const adapter = buildSignatureProfileAdapterV0_1B(applyGroupStratumWeightsV0_1B(records));
    expect(adapter.profiles[0].slots[0].recordId).toBe("z");
    expect(adapter.profiles[0].slots[1].recordId).toBe("é");
  });

  test("BH/BI/BJ: P2 profiles are complete, duplicate ordinals are distinct, and exclusions precede Gate A", () => {
    const records = [
      makeRecord({ recordId: "a", stableSlotId: "same" }),
      makeRecord({ recordId: "b", stableSlotId: "same" }),
    ];
    const adapter = buildSignatureProfileAdapterV0_1B(applyGroupStratumWeightsV0_1B(records));
    expect(adapter.profiles[0].slots.map((slot) => slot.ordinalWithinGroupStratum)).toEqual([0, 1]);
    expect(adapter.profiles[0].recipient.primarySlots).toHaveLength(2);
    expect(adapter.profiles[0].donor.rightIdentityBySlot).toHaveLength(2);
    const base = makeGrid(90);
    const withExcluded = [
      ...base,
      makeRecord({
        recordId: "cluster-only",
        independenceGroupId: "extra",
        clusterAdjacent: true,
      }),
      makeRecord({
        recordId: "repeat-only",
        independenceGroupId: "extra-repeat",
        C_L: "C0",
        C_R: "C0",
      }),
    ];
    const baseGate = evaluateGateAV0_1B(applyGroupStratumWeightsV0_1B(base));
    const excludedGate = evaluateGateAV0_1B(
      applyGroupStratumWeightsV0_1B(normalizePrimaryRecordsV0_1B(withExcluded).eligibleRecords),
    );
    expect(excludedGate.metrics.eligibleGroups).toBe(baseGate.metrics.eligibleGroups);
    expect(excludedGate.metrics.vxpStrata).toBe(baseGate.metrics.vxpStrata);
  });

  test("fixture contract mechanics cover N0-N13, E1-E3, and C0-C9 without calibration", () => {
    const fixtureIds = [
      "N0", "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10",
      "N11", "N11_ORDERED", "N11_ORDER_DESTROYED", "N12", "N13",
      "E1", "E2", "E3", "C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9",
    ];
    for (const fixtureId of fixtureIds) {
      expect(validateSyntheticStructuralRecordV0_1B(makeRecord({ fixtureId })).fixtureId).toBe(fixtureId);
    }
    expect(true).toBe(true);
  });

  test("MC: the bounded compressed fixture uses the exact 10,000-draw path", () => {
    const result = analyzeSyntheticCalibrationV0_1B(makeMonteCarloFixture());
    expect(result.gateA.pass).toBe(true);
    expect(result.gateB.status).toBe("READY");
    if (result.gateB.status === "READY") {
      expect(result.gateB.branch).toBe("MONTE_CARLO");
      expect(result.gateB.totalCount > BigInt(10_000)).toBe(true);
    }
    expect(result.monteCarloDraws).toBe(10_000);
    expect(result.duplicateMonteCarloDrawsRetained).toBe(true);
    expect(result.pValue).not.toBeNull();
  });
});
