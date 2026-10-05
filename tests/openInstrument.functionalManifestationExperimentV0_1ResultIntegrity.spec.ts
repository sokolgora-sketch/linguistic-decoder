import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const RESULT_DIR = path.join(
  process.cwd(),
  "docs/open-instrument/research-artifacts/functional-manifestation-v0.1-experiment-v0.1",
);
const RESULT_PATH = path.join(RESULT_DIR, "result.json");
const IDENTITY_PATH = path.join(RESULT_DIR, "execution-identity.json");
const MANIFEST_PATH = path.join(RESULT_DIR, "hash-manifest.json");

function sha256(filePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

describe("functional manifestation v0.1 stored result integrity", () => {
  it("verifies the preserved result without executing the experiment", () => {
    const result = JSON.parse(fs.readFileSync(RESULT_PATH, "utf8")) as {
      decision: { classification: string };
      execution: { attemptCount: number; noRerun: boolean; realDataExecuted: boolean };
      confirmatoryPopulation: {
        sourceMatchedForms: number;
        directMatchFormsBeforeVariantPolicy: number;
        directIndependentUnitsAfterVariantPolicy: number;
        candidateVariationVoiceGroups: number;
        candidateVariationUnits: number;
      };
      permutationTest: { completed: number };
      bootstrapUncertainty: { completed: number };
      zcDescriptiveOnly: { secondaryInferentialTestExecuted: boolean };
    };
    const identity = JSON.parse(fs.readFileSync(IDENTITY_PATH, "utf8")) as {
      resultSha256: string;
    };
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8")) as {
      finalClassification: string;
      executionAttemptCount: number;
      noRerun: boolean;
      artifacts: Array<{ path: string; sha256: string; byteLength: number }>;
    };

    expect(result.decision.classification).toBe("NULL_NO_DETECTABLE_ASSOCIATION");
    expect(result.execution).toEqual(expect.objectContaining({
      attemptCount: 1,
      noRerun: true,
      realDataExecuted: false,
    }));
    expect(result.confirmatoryPopulation).toEqual(expect.objectContaining({
      sourceMatchedForms: 94632,
      directMatchFormsBeforeVariantPolicy: 3678,
      directIndependentUnitsAfterVariantPolicy: 3283,
      candidateVariationVoiceGroups: 255,
      candidateVariationUnits: 2974,
    }));
    expect(result.permutationTest.completed).toBe(10000);
    expect(result.bootstrapUncertainty.completed).toBe(2000);
    expect(result.zcDescriptiveOnly.secondaryInferentialTestExecuted).toBe(false);
    expect(identity.resultSha256).toBe(sha256(RESULT_PATH));
    expect(manifest.finalClassification).toBe(result.decision.classification);
    expect(manifest.executionAttemptCount).toBe(1);
    expect(manifest.noRerun).toBe(true);
    expect(manifest.artifacts.find((artifact) => artifact.path.endsWith("result.json"))).toEqual(
      expect.objectContaining({
        sha256: sha256(RESULT_PATH),
        byteLength: fs.statSync(RESULT_PATH).size,
      }),
    );
  });
});
