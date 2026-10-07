import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { verifyStoredResult } from "@/../scripts/openInstrumentRetrievalKeyAuthorityAndReachabilityExecution.v0_1";

const ROOT = process.cwd();
const ARTIFACT_DIR = path.join(
  ROOT,
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-execution-v0.1",
);

function readJson<T>(fileName: string): T {
  return JSON.parse(fs.readFileSync(path.join(ARTIFACT_DIR, fileName), "utf8")) as T;
}

function sha256(fileName: string): string {
  return crypto
    .createHash("sha256")
    .update(fs.readFileSync(path.join(ARTIFACT_DIR, fileName)))
    .digest("hex");
}

describe("retrieval-key authority and reachability execution v0.1", () => {
  test("verifies the single stored CLASS_E result without executing Arm B", () => {
    const verification = verifyStoredResult();
    const result = readJson<any>("result.json");
    const manifest = readJson<any>("hash-manifest.json");

    expect(verification.resultSha256).toBe("43828f3dee6fe3d86a6cb673cfe600826222f1c776563798fb2d00b71e9f7188");
    expect(verification.manifestSha256).toBe("6be8afee402f79b6c827d85900676784cc7eac00a02c3cf4505ba0f738ec2d27");
    expect(result.authoritativeAttemptsBefore).toBe(0);
    expect(result.authoritativeAttempts).toBe(1);
    expect(result.authoritativeAttemptsMax).toBe(1);
    expect(result.authorityGate.decision).toBe("INSUFFICIENT_EVIDENCE");
    expect(result.arms.ARM_A.scientificReachabilityExecuted).toBe(false);
    expect(result.arms.ARM_B.status).toBe("NOT_AUTHORIZED");
    expect(result.arms.ARM_B.scientificReachabilityExecuted).toBe(false);
    expect(result.arms.ARM_B.reachabilityMetrics).toBeNull();
    expect(result.interpretation.class).toBe("CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE");
    expect(result.nextAction).toBe("REVIEW_V0_2_SUBSTRATE_SOURCE_ARCHITECTURE_AFTER_CLASS_E");
    expect(result.integrity).toMatchObject({
      sourceFormMutated: false,
      citationMutated: false,
      glossMutated: false,
      attestationMutated: false,
      provenanceMutated: false,
      queryGenerationChanged: false,
      normalizationChanged: false,
      matchingChanged: false,
      s3Rerun: false,
      broaderDiagnosticRerun: false,
      s4Started: false,
    });
    expect(manifest.artifacts).toHaveLength(1);
    expect(manifest.execution).toMatchObject({
      authoritativeAttemptsBefore: 0,
      authoritativeAttempts: 1,
      authoritativeAttemptsMax: 1,
      noRerun: true,
      armBExecuted: false,
      s3Rerun: false,
      broaderDiagnosticRerun: false,
      s4Started: false,
    });
  });

  test("preserves the frozen prior results and exact 21-record identity binding", () => {
    const result = readJson<any>("result.json");
    expect(result.priorResults).toEqual({
      s3ResultSha256: "b703051f8d6020548f93dc9a6591b22278f467bb0c521871b31aafb47be4ca03",
      broaderResultSha256: "51019087d2199f8506267c3e6a4fbdb8824962641a6ed49abaa7e2c7bcc59ee6",
    });
    expect(result.latinTestSet).toMatchObject({
      recordCount: 21,
      currentAsciiCount: 13,
      currentDiacriticCount: 8,
      sourceRecordsChanged: false,
      citationsChanged: false,
      provenanceChanged: false,
    });
    expect(fs.existsSync(path.join(ARTIFACT_DIR, "result.json"))).toBe(true);
    expect(fs.existsSync(path.join(ARTIFACT_DIR, "hash-manifest.json"))).toBe(true);
    expect(sha256("result.json")).toBe("43828f3dee6fe3d86a6cb673cfe600826222f1c776563798fb2d00b71e9f7188");
  });
});
