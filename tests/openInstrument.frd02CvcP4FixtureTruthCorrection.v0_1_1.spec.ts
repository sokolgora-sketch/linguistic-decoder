import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type JsonObject = Record<string, unknown>;

const artifactPath = path.resolve(
  process.cwd(),
  "docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-fixture-truth-correction-v0.1.1/preregistration.json",
);
const manifestPath = path.resolve(
  process.cwd(),
  "docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-fixture-truth-correction-v0.1.1/hash-manifest.json",
);

function loadArtifact(): JsonObject {
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as JsonObject;
}

function loadManifest(): JsonObject {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as JsonObject;
}

type Table = Record<string, Record<string, number>>;

function flatten(table: Table): string {
  return ["L0/R0", "L0/R1", "L1/R0", "L1/R1"]
    .map((key) => {
      const [left, right] = key.split("/");
      return String(table[left][right]);
    })
    .join(",");
}

describe("FRD-02 P4 fixture-truth correction v0.1.1", () => {
  test("separates common null structure from N11 ordered structure", () => {
    const artifact = loadArtifact();
    const common = artifact.commonConstruction as JsonObject;
    const n11 = artifact.n11 as JsonObject;
    const commonTable = common.jointTablePerStratum as Table;
    const orderedTable = (n11.ordered as JsonObject).jointTablePerStratum as Table;
    const destroyedTable = (n11.destroyed as JsonObject).jointTablePerStratum as Table;

    expect(flatten(commonTable)).toBe("24,24,24,24");
    expect(flatten(orderedTable)).toBe("48,0,0,48");
    expect(flatten(destroyedTable)).toBe("24,24,24,24");
    expect(flatten(commonTable)).not.toBe(flatten(orderedTable));
    expect(flatten(commonTable)).toBe(flatten(destroyedTable));
  });

  test("preserves the required marginals and control dimensions", () => {
    const artifact = loadArtifact();
    const preserved = artifact.preservedControls as JsonObject;
    expect(preserved.recordCountPerFixture).toBe(1152);
    expect(preserved.groupCount).toBe(96);
    expect(preserved.strata).toBe(12);
    expect(preserved.leftMarginalsPerStratum).toEqual({ L0: 48, L1: 48 });
    expect(preserved.rightMarginalsPerStratum).toEqual({ R0: 48, R1: 48 });
    expect(preserved.voicePositionCoverage).toBe(true);
    expect(preserved.weights).toBe("existing_group_stratum_weights");
    expect(preserved.eligibility).toBe("existing_parent_eligibility");
    expect(preserved.structuralZero).toBe("C_L_NE_C_R");
    expect(preserved.gateAInputs).toBe("preserved");
  });

  test("preserves N11 sequences, fixture impact, and frozen schedule", () => {
    const artifact = loadArtifact();
    const n11 = artifact.n11 as JsonObject;
    expect((n11.ordered as JsonObject).leftSequence).toEqual(["L0", "L0", "L1", "L1"]);
    expect((n11.ordered as JsonObject).rightSequence).toEqual(["R0", "R0", "R1", "R1"]);
    expect((n11.destroyed as JsonObject).rightSequence).toEqual(["R0", "R1", "R1", "R0"]);
    const impact = artifact.fixtureImpact as JsonObject;
    expect(impact.fixtureCount).toBe(29);
    expect(impact.purposesChanged).toBe(false);
    expect(impact.expectedGateOrP2BehaviorChanged).toBe(false);
    expect(impact.allowedOutcomesChanged).toBe(false);
    const frozen = artifact.frozenUnrelatedChoices as JsonObject;
    expect(frozen.replicatesPerFixture).toBe(8);
    expect(frozen.totalEvaluations).toBe(232);
    expect(frozen.seedConstructionChanged).toBe(false);
    expect(frozen.acceptanceOutcomes).toEqual([
      "CALIBRATION_PASS",
      "CALIBRATION_FAIL",
      "CALIBRATION_INVALID",
    ]);
  });

  test("keeps the correction before implementation and calibration", () => {
    const artifact = loadArtifact();
    const provenance = artifact.provenance as JsonObject;
    const boundary = artifact.implementationBoundary as JsonObject;
    expect(provenance.discoveredBeforeP4Implementation).toBe(true);
    expect(provenance.discoveredBeforeCalibration).toBe(true);
    expect(provenance.calibrationResultExisted).toBe(false);
    expect(provenance.resultInformedTuning).toBe(false);
    expect(boundary.p4RunnerImplemented).toBe(false);
    expect(boundary.calibrationExecuted).toBe(false);
    expect(boundary.realDataExecutionAuthorized).toBe(false);
    expect(boundary.semanticInterpretationAuthorized).toBe(false);
  });

  test("binds the correction artifacts by exact bytes and SHA-256", () => {
    const manifest = loadManifest();
    const artifacts = manifest.artifacts as JsonObject[];
    expect(artifacts).toHaveLength(2);
    for (const entry of artifacts) {
      const filePath = path.resolve(process.cwd(), entry.path as string);
      const bytes = fs.readFileSync(filePath);
      const digest = createHash("sha256").update(bytes).digest("hex");
      expect(bytes.byteLength).toBe(entry.byteLength);
      expect(digest).toBe(entry.sha256);
    }
    expect(manifest.p4RunnerImplemented).toBe(false);
    expect(manifest.calibrationExecuted).toBe(false);
  });
});
