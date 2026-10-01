import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

type JsonObject = Record<string, unknown>;

const artifactPath = path.resolve(
  process.cwd(),
  "docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-methodology-freeze-v0.1/preregistration.json",
);
const manifestPath = path.resolve(
  process.cwd(),
  "docs/open-instrument/research-artifacts/frd02-cvc-v0.1b-p4-methodology-freeze-v0.1/hash-manifest.json",
);

function loadArtifact(): JsonObject {
  return JSON.parse(fs.readFileSync(artifactPath, "utf8")) as JsonObject;
}

function loadManifest(): JsonObject {
  return JSON.parse(fs.readFileSync(manifestPath, "utf8")) as JsonObject;
}

function expectNoUnresolvedDecision(value: unknown, location = "$" ): void {
  if (typeof value === "string") {
    expect(value).not.toMatch(/\b(TBD|TODO|implementation-defined|operator discretion|reasonable default|future decision|manual judgment)\b/i);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => expectNoUnresolvedDecision(item, `${location}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      expectNoUnresolvedDecision(child, `${location}.${key}`);
    }
  }
}

describe("FRD-02 v0.1b P4 methodology freeze", () => {
  test("freezes the exact fixture family and execution boundary", () => {
    const artifact = loadArtifact();
    expect(artifact.contractId).toBe("OPEN_INSTRUMENT_FRD02_CVC_V0_1B_P4_METHODOLOGY_V0_1");
    expect(artifact.version).toBe("v0.1");
    expect(artifact.status).toBe("FROZEN_P4_METHODOLOGY_CALIBRATION_NOT_EXECUTED");
    expect((artifact.executionBoundary as JsonObject).p4MethodologyFrozen).toBe(true);
    expect((artifact.executionBoundary as JsonObject).p4RunnerImplemented).toBe(false);
    expect((artifact.executionBoundary as JsonObject).calibrationExecuted).toBe(false);
    expect((artifact.executionBoundary as JsonObject).realDataExecutionAuthorized).toBe(false);
    expect((artifact.executionBoundary as JsonObject).newP4ScientificChoicesRequiredBeforeImplementation).toBe(false);
  });

  test("contains every existing fixture identifier exactly once", () => {
    const artifact = loadArtifact();
    const ids = artifact.fixtureIds as string[];
    const fixtures = artifact.fixtures as JsonObject[];
    expect(ids).toHaveLength(29);
    expect(new Set(ids).size).toBe(ids.length);
    expect(fixtures.map((fixture) => fixture.id)).toEqual(ids);
    expect(ids).toEqual(expect.arrayContaining([
      "N11_ORDERED",
      "N11_ORDER_DESTROYED",
      "C0", "C1", "C2", "C3", "C4", "C5", "C6", "C7", "C8", "C9",
    ]));
  });

  test("freezes cluster, positive-control, replicate, and acceptance rules", () => {
    const artifact = loadArtifact();
    const cluster = artifact.clusterAdjacent as JsonObject;
    const positive = artifact.positiveControl as JsonObject;
    const schedule = artifact.replicateSchedule as JsonObject;
    const acceptance = artifact.acceptance as JsonObject;
    expect(cluster.inputField).toBe("clusterAdjacent");
    expect(cluster.noHeuristicDerivation).toBe(true);
    expect(cluster.trueFixtures).toEqual(["C1", "E1"]);
    expect(positive.fixtureId).toBe("N11_ORDERED");
    expect(positive.pairedDestroyedFixtureId).toBe("N11_ORDER_DESTROYED");
    expect(schedule.replicatesPerFixture).toBe(8);
    expect(schedule.totalEvaluations).toBe(232);
    expect(schedule.adaptiveReplication).toBe(false);
    expect(schedule.replacementReplicates).toBe(false);
    expect(acceptance.methodologyOutcomes).toEqual([
      "CALIBRATION_PASS",
      "CALIBRATION_FAIL",
      "CALIBRATION_INVALID",
    ]);
    expect((acceptance.positiveControl as JsonObject).orderedSupportReplicates).toBe(8);
    expect((acceptance.positiveControl as JsonObject).destroyedSupportReplicates).toBe(0);
  });

  test("has no unresolved methodology decisions and preserves the production firewall", () => {
    const artifact = loadArtifact();
    expectNoUnresolvedDecision(artifact);
    expect(artifact.nonClaims).toEqual(expect.arrayContaining([
      "SEMANTICS",
      "HISTORICAL_ORIGIN",
      "PRODUCTION_AUTHORITY",
    ]));
    expect((artifact.redesignRule as JsonObject).newVersionRequiredForMethodologicalDefect).toBe(true);
  });

  test("binds the durable human and machine artifacts by bytes and hash", () => {
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
