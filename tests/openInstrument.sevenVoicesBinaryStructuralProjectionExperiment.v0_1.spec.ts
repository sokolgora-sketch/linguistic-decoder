import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import {
  executeSevenVoicesBinaryStructuralProjectionExperiment,
  EXPECTED_PREREGISTRATION_SHA256,
  EXPECTED_STRUCTURAL_INPUT_SHA256,
} from "../scripts/openInstrumentSevenVoicesBinaryStructuralProjectionExperiment.v0_1.mjs";
import { verifySevenVoicesBinaryStructuralProjectionExperiment } from "../scripts/openInstrumentSevenVoicesBinaryStructuralProjectionExperimentVerification.v0_1.mjs";

const root = process.cwd();
const preregistrationPath = path.join(
  root,
  "docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/preregistration.json",
);
const resultPath = path.join(
  root,
  "docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/result.json",
);

describe("Seven Voices binary structural projection experiment v0.1", () => {
  test("executes the frozen universe and returns the preregistered mathematical result", () => {
    const result = executeSevenVoicesBinaryStructuralProjectionExperiment({ writeResult: false });
    expect(result.preregistrationSha).toBe(EXPECTED_PREREGISTRATION_SHA256);
    expect(result.canonicalInputFingerprint).toBe(EXPECTED_STRUCTURAL_INPUT_SHA256);
    expect(result.mappingUniverseSize).toBe(5040);
    expect(Object.fromEntries(Object.entries(result.controlFamilyCounts).map(([name, value]) => [name, value.observed]))).toEqual({
      UNRESTRICTED: 5040,
      CENTER_PRESERVING: 720,
      MIRROR_EDGE_PRESERVING: 528,
      CENTERED_MIRROR_EDGE: 144,
      PAIR_BLOCK_PRESERVING: 48,
      EXACT_RING_PRESERVING: 8,
      STRUCTURAL_V0_1: 1,
    });
    expect(result.classification).toBe("REDUNDANT");
    expect(result.primaryMetric).toMatchObject({
      name: "ADDITIONAL_STRUCTURAL_INVARIANT_COUNT",
      byConstructionCount: 7,
      symmetryArtifactCount: 9,
      value: 0,
      survivingAdditionalInvariants: [],
    });
    expect(result.semanticClaimsMade).toBe(false);
    expect(result.linguisticClaimsMade).toBe(false);
    expect(result.productionAuthorityChanged).toBe(false);
  });

  test("independently verifies the persisted result and exact result hash", () => {
    const verification = verifySevenVoicesBinaryStructuralProjectionExperiment({
      preregistrationPath,
      resultPath,
    });
    expect(verification.mappingUniverseCount).toBe(5040);
    expect(verification.classification).toBe("REDUNDANT");
    expect(verification.primaryMetric.value).toBe(0);
    expect(verification.resultSha256).toMatch(/^[a-f0-9]{64}$/);
  });

  test("fails closed when the frozen preregistration or structural input changes", () => {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "oi-binary-experiment-"));
    const mutatedPath = path.join(tempDir, "preregistration.json");
    const artifact = JSON.parse(fs.readFileSync(preregistrationPath, "utf8"));
    artifact.canonicalStructuralInput.rings.A = 2;
    fs.writeFileSync(mutatedPath, `${JSON.stringify(artifact, null, 2)}\n`, "utf8");
    expect(() => executeSevenVoicesBinaryStructuralProjectionExperiment({
      preregistrationPath: mutatedPath,
      writeResult: false,
    })).toThrow("PREREGISTRATION_SHA_MISMATCH");
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
