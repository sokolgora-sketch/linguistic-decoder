import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const artifactDirectory = resolve(
  "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1",
);
const resultPath = resolve(artifactDirectory, "result.json");
const manifestPath = resolve(artifactDirectory, "hash-manifest.json");
const populationSpecPath = resolve(artifactDirectory, "population-spec.json");

function bytes(path: string): Buffer {
  return readFileSync(path);
}

function sha256(path: string): string {
  return createHash("sha256").update(bytes(path)).digest("hex");
}

describe("ZC CMUdict validation artifact integrity", () => {
  it("preserves the single invalid execution without a rerun or observations", () => {
    const result = JSON.parse(bytes(resultPath).toString("utf8")) as {
      status: string;
      outcome: string;
      execution: {
        attemptCount: number;
        authoritativeExecutionStarted: boolean;
        authoritativeExecutionCompleted: boolean;
        observationsPersisted: boolean;
        noRerun: boolean;
        realDataExecuted: boolean;
        failure: { stage: string; name: string; message: string };
      };
    };
    expect(result.status).toBe("INVALID_EXECUTION_PRESERVED");
    expect(result.outcome).toBe("INVALID_EXECUTION");
    expect(result.execution.attemptCount).toBe(1);
    expect(result.execution.authoritativeExecutionStarted).toBe(true);
    expect(result.execution.authoritativeExecutionCompleted).toBe(false);
    expect(result.execution.observationsPersisted).toBe(false);
    expect(result.execution.noRerun).toBe(true);
    expect(result.execution.realDataExecuted).toBe(false);
    expect(result.execution.failure).toEqual(expect.objectContaining({
      stage: "AGGREGATION",
      name: "RangeError",
      message: "Maximum call stack size exceeded",
    }));
  });

  it("binds result, population, runner, and frozen authority bytes", () => {
    const manifest = JSON.parse(bytes(manifestPath).toString("utf8")) as {
      status: string;
      outcome: string;
      attemptCount: number;
      noRerun: boolean;
      realDataExecuted: boolean;
      artifacts: readonly { path: string; sha256: string; byteLength: number }[];
      frozenContracts: {
        zcContractSha256: string;
        configurationAuthoritySha256: string;
        priorProductContractSha256: string;
      };
    };
    const artifact = (suffix: string) => {
      const match = manifest.artifacts.find((entry) => entry.path.endsWith(suffix));
      if (!match) throw new Error(`missing artifact ${suffix}`);
      return match;
    };
    for (const suffix of ["population-spec.json", "result.json", "openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1.ts"]) {
      const entry = artifact(suffix);
      const path = resolve(entry.path);
      expect(sha256(path)).toBe(entry.sha256);
      expect(bytes(path).byteLength).toBe(entry.byteLength);
    }
    expect(manifest.status).toBe("INVALID_EXECUTION_PRESERVED");
    expect(manifest.outcome).toBe("INVALID_EXECUTION");
    expect(manifest.attemptCount).toBe(1);
    expect(manifest.noRerun).toBe(true);
    expect(manifest.realDataExecuted).toBe(false);
    expect(manifest.frozenContracts).toEqual({
      zcContractSha256: "1ee274253f2b6da3c29a9c9b4409c258e64a6d4121dcf48925464dac926a8e0c",
      configurationAuthoritySha256: "b4d24f1105af0b4a3a2a3275425f84a1499ddea77f0d307f5d175d8125ac502d",
      priorProductContractSha256: "14ab3a088f891b1aba079d5ef7f6c23a2c5883758c24a7976788dd9024dc99fc",
    });
    expect(sha256(populationSpecPath)).toBe(artifact("population-spec.json").sha256);
  });
});
