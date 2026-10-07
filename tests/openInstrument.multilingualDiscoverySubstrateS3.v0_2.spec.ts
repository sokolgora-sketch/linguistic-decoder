import {
  reconstructFrozenS3SampleV0_2,
  reconstructS3SubstrateStatesV0_2,
  validateS3AuthorityIdentitiesV0_2,
  S3_EXPECTED_AFTER_FINGERPRINT_V0_2,
  S3_EXPECTED_BEFORE_FINGERPRINT_V0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS3.v0_2";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const S3_ARTIFACT_DIR = join(
  process.cwd(),
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1",
);

function fileSha256(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("multilingual Discovery substrate v0.2 S3 preflight", () => {
  it("reconstructs all frozen pre-S3 authority identities", () => {
    const authority = validateS3AuthorityIdentitiesV0_2();
    expect(Object.values(authority.matches).every(Boolean)).toBe(true);
  });

  it("reconstructs the frozen sample without substrate response lookup", () => {
    const sample = reconstructFrozenS3SampleV0_2();
    expect(sample.sampleSize).toBe(512);
    expect(sample.firstInput).toBe("aiello");
    expect(sample.lastInput).toBe("balzarini");
    expect(sample.entries.every((entry) => entry.genericQueryKeys.length > 0)).toBe(true);
  });

  it("reconstructs the controlled 57-record and 76-record substrates", () => {
    const states = reconstructS3SubstrateStatesV0_2();
    expect(states.before.total).toBe(57);
    expect(states.before.languageCounts).toEqual({ Albanian: 55, Latin: 2 });
    expect(states.before.uniqueForms).toBe(57);
    expect(states.before.uniqueQueryKeys).toBe(57);
    expect(states.before.fingerprint).toBe(S3_EXPECTED_BEFORE_FINGERPRINT_V0_2);
    expect(states.before.duplicateForms).toEqual([]);
    expect(states.before.queryKeyCollisions).toEqual([]);

    expect(states.after.total).toBe(76);
    expect(states.after.languageCounts).toEqual({ Albanian: 55, Latin: 21 });
    expect(states.after.uniqueForms).toBe(76);
    expect(states.after.uniqueQueryKeys).toBe(76);
    expect(states.after.fingerprint).toBe(S3_EXPECTED_AFTER_FINGERPRINT_V0_2);
    expect(states.after.duplicateForms).toEqual([]);
    expect(states.after.queryKeyCollisions).toEqual([]);
  });

  it("validates the preserved paired artifact without executing the evaluator", () => {
    const paired = JSON.parse(readFileSync(join(S3_ARTIFACT_DIR, "paired-results.json"), "utf8")) as {
      cases: readonly unknown[];
    };
    const summary = JSON.parse(readFileSync(join(S3_ARTIFACT_DIR, "summary.json"), "utf8")) as {
      before: { totalInputs: number; crossFormPositiveInputs: number };
      after: { totalInputs: number; crossFormPositiveInputs: number };
      reproducibility: Record<string, string>;
    };
    const manifest = JSON.parse(readFileSync(join(S3_ARTIFACT_DIR, "hash-manifest.json"), "utf8")) as {
      artifacts: readonly { path: string; sha256: string }[];
      execution: { attempts: number; noRerun: boolean; syntheticOnly: boolean; realDataExecuted: boolean };
    };
    expect(paired.cases).toHaveLength(512);
    expect(summary.before.totalInputs).toBe(512);
    expect(summary.after.totalInputs).toBe(512);
    expect(manifest.execution).toEqual({ attempts: 1, attemptsMax: 1, noRerun: true, syntheticOnly: true, realDataExecuted: false, providerExecution: false });
    expect(Object.values(summary.reproducibility).every((value) => typeof value === "string" && value.length > 0)).toBe(true);
    for (const artifact of manifest.artifacts) {
      expect(fileSha256(join(process.cwd(), artifact.path))).toBe(artifact.sha256);
    }
    const verificationOutput = execFileSync(
      "npx",
      ["tsx", "scripts/openInstrumentMultilingualDiscoverySubstrateS3.v0_2.ts", "--verify"],
      { encoding: "utf8" },
    );
    expect(verificationOutput).toContain("STORED_RESULT_INTEGRITY_PASS");
  });
});
