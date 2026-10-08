import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTIFACT_DIR = path.join(
  ROOT,
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-snapshot-acquisition-procedure-v0.1",
);
const PROCEDURE_PATH = path.join(ARTIFACT_DIR, "procedure.json");
const MANIFEST_PATH = path.join(ARTIFACT_DIR, "hash-manifest.json");
const RUNBOOK_PATH = path.join(
  ROOT,
  "docs/open-instrument/english-kaikki-snapshot-acquisition-procedure-v0.1.md",
);
const MILESTONE_PATH = path.join(
  ROOT,
  "docs/open-instrument/multilingual-discovery-substrate-expansion-v0.2-milestone.md",
);

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function sha256(filePath: string): string {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

describe("English Kaikki snapshot acquisition procedure v0.1", () => {
  test("freezes a source-identity-bound procedure without acquiring a source", () => {
    const procedure = readJson<{
      status: string;
      procedureId: string;
      sourceSnapshot: {
        expectedBytes: number;
        expectedSha256: string;
        canonicalSourceReference: string;
        acquisitionLocator: { urlIsImmutableIdentity: boolean };
      };
      procedure: {
        attemptPolicy: { authoritativeAcquisitionAttemptsMax: number; transferAttemptsMax: number };
        hashPolicy: { algorithm: string; silentExpectedIdentityUpdate: boolean };
        storagePolicy: { repositoryBundling: boolean; runtimeFetch: boolean };
        resourcePreflight: { largeBodyRequestBeforePreflight: boolean };
      };
      recordIdentity: {
        policyStatus: string;
        sensePreservation: { primarySenseSelection: boolean; winnerSelection: boolean };
      };
      purposeFirewall: { sourceFactOnly: boolean; functionalClaims: boolean; historicalClaims: boolean; pronunciationAuthority: boolean };
      executionState: {
        sourceAcquisitionAuthorized: boolean;
        sourceAcquisitionAttempts: number;
        sourceAcquired: boolean;
        sourceImported: boolean;
        sourceAdapterImplemented: boolean;
        sourceIndexBuilt: boolean;
        coverageEvaluated: boolean;
        runtimeChanged: boolean;
        s4: string;
      };
    }>(PROCEDURE_PATH);

    expect(procedure.status).toBe("DEFINED_NOT_EXECUTED");
    expect(procedure.procedureId).toBe(
      "open-instrument.source-family-lexical-substrate.english-kaikki.snapshot-acquisition.v0.1",
    );
    expect(procedure.sourceSnapshot.expectedBytes).toBe(3335546346);
    expect(procedure.sourceSnapshot.expectedSha256).toBe(
      "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195",
    );
    expect(procedure.sourceSnapshot.canonicalSourceReference).toBe(
      "https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl",
    );
    expect(procedure.sourceSnapshot.acquisitionLocator.urlIsImmutableIdentity).toBe(false);
    expect(procedure.procedure.attemptPolicy).toMatchObject({
      authoritativeAcquisitionAttemptsMax: 1,
      transferAttemptsMax: 3,
    });
    expect(procedure.procedure.hashPolicy).toMatchObject({
      algorithm: "SHA-256",
      silentExpectedIdentityUpdate: false,
    });
    expect(procedure.procedure.storagePolicy).toMatchObject({
      repositoryBundling: false,
      runtimeFetch: false,
    });
    expect(procedure.procedure.resourcePreflight.largeBodyRequestBeforePreflight).toBe(false);
    expect(procedure.recordIdentity.policyStatus).toBe(
      "DEFERRED_TO_SEPARATE_SOURCE_ADAPTER_DEFINITION",
    );
    expect(procedure.recordIdentity.sensePreservation).toMatchObject({
      primarySenseSelection: false,
      winnerSelection: false,
    });
    expect(procedure.purposeFirewall).toMatchObject({
      sourceFactOnly: true,
      functionalClaims: false,
      historicalClaims: false,
      pronunciationAuthority: false,
    });
    expect(procedure.executionState).toEqual({
      sourceAcquisitionAuthorized: false,
      sourceAcquisitionAttempts: 0,
      sourceAcquired: false,
      sourceImported: false,
      sourceAdapterImplemented: false,
      sourceIndexBuilt: false,
      coverageEvaluated: false,
      runtimeChanged: false,
      s4: "NOT_STARTED",
    });
  });

  test("binds only repository procedure artifacts and creates no result placeholder", () => {
    const manifest = readJson<{
      status: string;
      procedureId: string;
      artifacts: Array<{ path: string; bytes: number; sha256: string }>;
      execution: { sourceAcquisitionAttempts: number; resultArtifactCreated: boolean };
    }>(MANIFEST_PATH);

    expect(manifest.status).toBe("DEFINED_NOT_EXECUTED");
    expect(manifest.procedureId).toBe(
      "open-instrument.source-family-lexical-substrate.english-kaikki.snapshot-acquisition.v0.1",
    );
    expect(manifest.execution).toMatchObject({
      sourceAcquisitionAttempts: 0,
      resultArtifactCreated: false,
    });
    for (const artifact of manifest.artifacts) {
      const absolutePath = path.join(ROOT, artifact.path);
      expect(fs.existsSync(absolutePath)).toBe(true);
      expect(fs.statSync(absolutePath).size).toBe(artifact.bytes);
      expect(sha256(absolutePath)).toBe(artifact.sha256);
    }
    expect(fs.existsSync(path.join(ARTIFACT_DIR, "result.json"))).toBe(false);
    expect(manifest.artifacts.map((artifact) => artifact.path)).toEqual([
      "docs/open-instrument/english-kaikki-snapshot-acquisition-procedure-v0.1.md",
      "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-snapshot-acquisition-procedure-v0.1/procedure.json",
    ]);
    expect(fs.existsSync(RUNBOOK_PATH)).toBe(true);
  });

  test("binds the milestone procedure hash to the recomputed procedure hash", () => {
    const procedureHash = sha256(PROCEDURE_PATH);
    const manifest = readJson<{
      artifacts: Array<{ path: string; sha256: string }>;
    }>(MANIFEST_PATH);
    const procedureArtifact = manifest.artifacts.find(
      (artifact) => artifact.path.endsWith("/procedure.json"),
    );
    const milestone = fs.readFileSync(MILESTONE_PATH, "utf8");
    const milestoneHash = milestone.match(
      /`ENGLISH_KAIKKI_PROCEDURE_SHA256=([0-9a-f]{64})`/,
    )?.[1];

    expect(procedureArtifact?.sha256).toBe(procedureHash);
    expect(milestoneHash).toBe(procedureHash);
  });
});
