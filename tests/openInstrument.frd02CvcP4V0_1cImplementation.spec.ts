import {
  auditP4All29CompatibilityV0_1C,
  buildP4ScheduleV0_1C,
  evaluateP4AggregateAcceptanceV0_1C,
  evaluateP4FixtureAcceptanceV0_1C,
  generateP4FixtureV0_1C,
  p4AuthorityBindingsV0_1C,
  P4_V0_1C_SPARSE_THRESHOLD,
  type P4FixtureAcceptanceV0_1C,
} from "../src/shared/openInstrument/frd02CvcP4Implementation.v0_1c";
import { P4_PERMUTATION_STREAM_ID_V0_1B } from "../src/shared/openInstrument/frd02CvcP4Implementation.v0_1b";
import {
  canonicalSeedTupleV0_1B,
  FIXTURE_IDS_V0_1B,
  seedWordsV0_1B,
} from "../src/shared/openInstrument/frd02CvcSyntheticCalibration.v0_1b";
import type { P4ReplicateResultV0_1B } from "../src/shared/openInstrument/frd02CvcP4Implementation.v0_1b";

function expectedE3Result(replicateId: string): P4ReplicateResultV0_1B {
  const fixture = generateP4FixtureV0_1C("E3", replicateId);
  return {
    valid: false,
    fixtureId: "E3",
    replicateId,
    inputSha256: fixture.constructionFingerprint,
    constructionFingerprint: fixture.constructionFingerprint,
    seedTuple: canonicalSeedTupleV0_1B("E3", replicateId, P4_PERMUTATION_STREAM_ID_V0_1B),
    seedWords: seedWordsV0_1B("E3", replicateId, P4_PERMUTATION_STREAM_ID_V0_1B).map((word) => word.toString()) as [string, string, string, string],
    normalization: { eligibleRecordCount: 1152, excludedClusterAdjacentRecordIds: [], excludedRepeatedRecordIds: [] },
    gateA: { pass: true, state: "PASS", reason: null },
    gateB: { status: "FAILURE", reason: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED", domain: "RESOURCE" },
    statistic: null,
    pValue: null,
    outcome: "INSUFFICIENT_EVIDENCE",
    reason: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED",
    invalidReason: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED",
  };
}

function passAcceptance(fixtureId: string): P4FixtureAcceptanceV0_1C {
  return { fixtureId, outcome: "CALIBRATION_PASS", validReplicates: 8, invalidReplicates: 0, unexpectedReplicates: 0, expectedInvalidReplicates: 0, reason: null };
}

describe("FRD-02 P4 v0.1c successor implementation", () => {
  test("binds the frozen successor authority and keeps P1/P2/P3 unchanged", () => {
    const bindings = p4AuthorityBindingsV0_1C();
    expect(bindings.contractId).toBe("OPEN_INSTRUMENT_FRD02_CVC_V0_1C_P4_METHODOLOGY_V0_1");
    expect(bindings.humanContractSha256).toBe("b6f58fdbcc38c3c5dc8238fec692c3d98b649018113e7540a972d03c558c40c6");
    expect(bindings.machineContractSha256).toBe("7862a9d9ece42692069240c47ab917520f3fb101ccbdf945860ebc24fa055743");
    expect(bindings.p1ChangeRequired).toBe("NO");
    expect(bindings.p2ChangeRequired).toBe("NO");
    expect(bindings.p3ChangeRequired).toBe("NO");
  });

  test("implements exact C7 missing-voice and missing-position constructions", () => {
    const missingVoice = generateP4FixtureV0_1C("C7", "0", "default");
    const missingPosition = generateP4FixtureV0_1C("C7", "4", "position");
    if (missingVoice.kind !== "single" || missingPosition.kind !== "single") throw new Error("EXPECTED_SINGLE_FIXTURE");
    expect(missingVoice.records).toHaveLength(1060);
    expect(missingPosition.records).toHaveLength(1060);
    expect(new Set(missingVoice.records.map((record) => record.stratumId)).size).toBe(12);
    expect(new Set(missingPosition.records.map((record) => record.stratumId)).size).toBe(12);
    expect(new Set(missingVoice.records.filter((record) => record.stratumId === "S3").map((record) => record.independenceGroupId)).size).toBe(4);
    expect(new Set(missingPosition.records.filter((record) => record.stratumId === "S4").map((record) => record.independenceGroupId)).size).toBe(4);
    expect(missingVoice.records.filter((record) => record.stratumId === "S3")).toHaveLength(4);
    expect(missingPosition.records.filter((record) => record.stratumId === "S4")).toHaveLength(4);
  });

  test("implements exact C8 rare-identity replacement without changing the sparse threshold", () => {
    const concentration = generateP4FixtureV0_1C("C8", "0", "default");
    const rare = generateP4FixtureV0_1C("C8", "4", "right");
    if (concentration.kind !== "single" || rare.kind !== "single") throw new Error("EXPECTED_SINGLE_FIXTURE");
    const rareRecords = rare.records.filter((record) => record.C_R.startsWith("RARE_R_"));
    expect(concentration.records).toHaveLength(1252);
    expect(rare.records).toHaveLength(1152);
    expect(rareRecords).toHaveLength(396);
    expect(new Set(rareRecords.map((record) => record.C_R)).size).toBe(33);
    expect(rareRecords.every((record) => record.C_L !== record.C_R)).toBe(true);
    expect(rareRecords.length / 1152).toBe(0.34375);
    expect(rareRecords.length / 1152).toBeGreaterThan(P4_V0_1C_SPARSE_THRESHOLD);
  });

  test("accepts the exact E3 expected-invalid resource pattern and rejects near misses", () => {
    const results = Array.from({ length: 8 }, (_, index) => expectedE3Result(String(index)));
    expect(evaluateP4FixtureAcceptanceV0_1C("E3", results)).toMatchObject({ outcome: "CALIBRATION_PASS", expectedInvalidReplicates: 8, invalidReplicates: 0 });
    expect(evaluateP4FixtureAcceptanceV0_1C("E3", results.map((result) => ({ ...result, outcome: "NULL" })))).toMatchObject({ outcome: "CALIBRATION_INVALID" });
    expect(evaluateP4FixtureAcceptanceV0_1C("E3", results.slice(0, 7))).toMatchObject({ outcome: "CALIBRATION_INVALID" });
  });

  test("keeps the successor schedule at 29 fixtures, 8 replicates, and 232 evaluations", () => {
    const first = buildP4ScheduleV0_1C();
    const second = buildP4ScheduleV0_1C();
    expect(first).toHaveLength(232);
    expect(new Set(first.map((entry) => entry.fixtureId)).size).toBe(29);
    expect(first.map((entry) => entry.replicateId).slice(0, 8)).toEqual(["0", "1", "2", "3", "4", "5", "6", "7"]);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
  });

  test("passes the definition-time all-29 compatibility audit without running calibration", () => {
    const audit = auditP4All29CompatibilityV0_1C();
    expect(audit).toMatchObject({
      fixtureCount: 29,
      changedFixtureIds: ["E3", "C7", "C8"],
      all29Accounted: true,
      scheduleSize: 232,
      scheduleDeterministic: true,
      unchangedFixturesPreserved: true,
      e3ConstructionPreserved: true,
      p1Changed: false,
      p2Changed: false,
      p3Changed: false,
    });
    expect(audit.unchangedFixtureIds).toHaveLength(26);
    expect(audit.c7).toMatchObject({ missingVoiceRecords: 1060, missingPositionRecords: 1060, all12StrataPreserved: true, missingVoiceAffectedStratumGroups: 4, missingPositionAffectedStratumGroups: 4 });
    expect(audit.c8).toMatchObject({ recordCount: 1152, groupCount: 96, strataCount: 12, rareRecordCount: 396, rareIdentityCount: 33, rareIdentityWeight: 0.34375, threshold: 0.25, thresholdExceeded: true });
  });

  test("applies the frozen aggregate E3 exception without weakening invalidity", () => {
    const schedule = buildP4ScheduleV0_1C();
    const acceptances = FIXTURE_IDS_V0_1B.map((fixtureId) => fixtureId === "E3"
      ? { ...passAcceptance("E3"), expectedInvalidReplicates: 8 }
      : passAcceptance(fixtureId));
    expect(evaluateP4AggregateAcceptanceV0_1C(schedule, acceptances)).toMatchObject({ outcome: "CALIBRATION_PASS", acceptedFixtureCount: 29, invalidResultCount: 0, expectedInvalidE3Replicates: 8 });
    expect(evaluateP4AggregateAcceptanceV0_1C(schedule, acceptances.map((entry) => entry.fixtureId === "C3" ? { ...entry, outcome: "CALIBRATION_FAIL" } : entry))).toMatchObject({ outcome: "CALIBRATION_FAIL" });
    expect(evaluateP4AggregateAcceptanceV0_1C(schedule, acceptances.map((entry) => entry.fixtureId === "C3" ? { ...entry, invalidReplicates: 1 } : entry))).toMatchObject({ outcome: "CALIBRATION_INVALID" });
    expect(evaluateP4AggregateAcceptanceV0_1C(schedule, acceptances.map((entry) => entry.fixtureId === "E3" ? { ...entry, expectedInvalidReplicates: 7 } : entry))).toMatchObject({ outcome: "CALIBRATION_INVALID" });
  });
});
