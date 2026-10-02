import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type JsonObject = Record<string, any>;

const humanPath = path.resolve(process.cwd(), "docs/open-instrument/frd02-cvc-v0.1c-p4-successor-methodology-freeze-v0.1.md");
const machinePath = path.resolve(process.cwd(), "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-successor-methodology-freeze-v0.1/preregistration.json");
const manifestPath = path.resolve(process.cwd(), "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-successor-methodology-freeze-v0.1/hash-manifest.json");

const load = (filePath: string): JsonObject => JSON.parse(fs.readFileSync(filePath, "utf8")) as JsonObject;
const sha256 = (bytes: Buffer): string => createHash("sha256").update(bytes).digest("hex");

describe("FRD-02 P4 v0.1c successor freeze", () => {
  test("freezes a distinct successor and preserves the execution firewall", () => {
    const artifact = load(machinePath);
    expect(artifact.contractId).toBe("OPEN_INSTRUMENT_FRD02_CVC_V0_1C_P4_METHODOLOGY_V0_1");
    expect(artifact.status).toBe("FROZEN_P4_V0_1C_SUCCESSOR_AUTHORITY_IMPLEMENTATION_NOT_EXECUTED");
    expect(artifact.provenance.successorJustified).toBe(true);
    expect(artifact.provenance.diagnosedCorrectionsOnly).toEqual(["E3", "C7", "C8"]);
    expect(artifact.implementationBoundary.successorImplementationStarted).toBe(false);
    expect(artifact.implementationBoundary.successorCalibrationExecuted).toBe(false);
    expect(artifact.implementationBoundary.productionChanged).toBe(false);
  });

  test("freezes the exact E3 expected-invalid aggregate boundary", () => {
    const artifact = load(machinePath);
    expect(artifact.e3.expectedGateA).toBe("PASS");
    expect(artifact.e3.expectedP2).toEqual({
      status: "FAILURE",
      reason: "EXACT_COUNT_RESOURCE_LIMIT_EXCEEDED",
      domain: "RESOURCE",
    });
    expect(artifact.e3.expectedInvalidClassification).toBe("EXPECTED_INVALID_CONTROL");
    expect(artifact.e3.scientificValidityDenominatorExcludesE3).toBe(true);
    expect(artifact.aggregateRule.expectedE3InvalidityExcludedFromAggregateInvalidity).toBe(true);
    expect(artifact.aggregateRule.outcomes).toEqual(["CALIBRATION_PASS", "CALIBRATION_FAIL", "CALIBRATION_INVALID"]);
  });

  test("freezes C7 constructions that preserve all strata and reach coverage failures", () => {
    const artifact = load(machinePath);
    const c7 = artifact.c7;
    expect(c7.base).toEqual(expect.objectContaining({ groups: 96, strata: 12, records: 1152 }));
    expect(c7.missingVoice).toEqual(expect.objectContaining({ removedRecords: 92, eligibleRecords: 1060, vxpStrata: 12, affectedVoiceGroups: 4, expectedGateA: "VOICE_COVERAGE_MINIMUM_NOT_MET" }));
    expect(c7.missingPosition).toEqual(expect.objectContaining({ removedRecords: 92, eligibleRecords: 1060, vxpStrata: 12, affectedPositionGroups: 4, expectedGateA: "POSITION_COVERAGE_MINIMUM_NOT_MET" }));
    expect(c7.all12StrataPreserved).toBe(true);
    expect(c7.resultInformedTuning).toBe(false);
  });

  test("freezes C8 rare identity arithmetic above the unchanged threshold", () => {
    const artifact = load(machinePath);
    const rare = artifact.c8.rareIdentity;
    expect(rare.affectedGroups).toBe(33);
    expect(rare.affectedStrataPerGroup).toBe(12);
    expect(rare.affectedRecords).toBe(396);
    expect(rare.groupStratumUnits).toBe(1152);
    expect(rare.rareIdentityWeight).toBe(396 / 1152);
    expect(rare.rareIdentityWeight).toBeGreaterThan(0.25);
    expect(rare.threshold).toBe(0.25);
    expect(rare.thresholdChanged).toBe(false);
    expect(artifact.c8.preserved.recordCount).toBe(1152);
    expect(artifact.c8.preserved.groupStratumWeightMass).toBe(1);
  });

  test("accounts for all 29 fixtures without changing P1/P2/P3", () => {
    const artifact = load(machinePath);
    expect(artifact.preservedAuthority.fixtureCount).toBe(29);
    expect(artifact.preservedAuthority.changedFixtures).toEqual(["E3", "C7", "C8"]);
    expect(artifact.preservedAuthority.unchangedFixtureCount).toBe(26);
    expect(artifact.preservedAuthority.unaccountedFixtures).toBe(0);
    expect(artifact.fixtureAudit.entries).toHaveLength(29);
    expect(artifact.fixtureAudit.entries.filter((entry: JsonObject) => entry.affected)).toHaveLength(3);
    expect(artifact.preservedAuthority.p1ChangeRequired).toBe(false);
    expect(artifact.preservedAuthority.p2ChangeRequired).toBe(false);
    expect(artifact.preservedAuthority.p3ChangeRequired).toBe(false);
    expect(artifact.executionIdentity.totalScheduledEvaluations).toBe(232);
  });

  test("binds the new human and machine artifacts by exact bytes and SHA-256", () => {
    const manifest = load(manifestPath);
    expect(manifest.contractId).toBe("OPEN_INSTRUMENT_FRD02_CVC_V0_1C_P4_METHODOLOGY_V0_1");
    expect(manifest.artifacts).toHaveLength(2);
    for (const entry of manifest.artifacts as JsonObject[]) {
      const bytes = fs.readFileSync(path.resolve(process.cwd(), entry.path));
      expect(bytes.byteLength).toBe(entry.byteLength);
      expect(sha256(bytes)).toBe(entry.sha256);
    }
    expect(manifest.successorImplementationStarted).toBe(false);
    expect(manifest.successorCalibrationExecuted).toBe(false);
    expect(manifest.predecessorResult.modified).toBe(false);
    expect(manifest.predecessorResult.rerun).toBe(false);
  });
});
