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
const RESULT_PATH = path.join(ARTIFACT_DIR, "result.json");
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

  test("binds the external execution result without bundling the source", () => {
    const manifest = readJson<{
      status: string;
      procedureId: string;
      artifacts: Array<{ path: string; bytes: number; sha256: string }>;
      execution: {
        sourceAcquisitionAttempts: number;
        authoritativeAcquisitionAttemptCount: number;
        transferAttemptCount: number;
        sourceAcquired: boolean;
        sourceSnapshotVerification: string;
        observedBytes: number;
        observedSha256: string;
        identityMatch: boolean;
        resultArtifactCreated: boolean;
        sourceImported: boolean;
        sourceIndexed: boolean;
        coverageEvaluated: boolean;
        s4Started: boolean;
        runtimeChanged: boolean;
      };
    }>(MANIFEST_PATH);
    const result = readJson<{
      procedureId: string;
      procedureSha256: string;
      sourceSnapshotId: string;
      sourceFamilyId: string;
      localExternalPath: string;
      acquisitionMode: string;
      toolingIdentity: {
        transfer: string;
        hash: string;
        runtime: string;
      };
      authoritativeAcquisitionAttemptCount: number;
      transferAttemptCount: number;
      observedBytes: number;
      observedSha256: string;
      byteLengthMatch: boolean;
      sha256Match: boolean;
      identityMatch: boolean;
      sourceSnapshotVerification: string;
      acquired: boolean;
      sourceContentInspected: boolean;
      imported: boolean;
      adapterImplemented: boolean;
      indexed: boolean;
      coverageEvaluated: boolean;
      runtimeChanged: boolean;
      s4: string;
      failureReason: string | null;
      nextAction: string;
    }>(RESULT_PATH);

    expect(manifest.status).toBe("EXECUTED");
    expect(manifest.procedureId).toBe(
      "open-instrument.source-family-lexical-substrate.english-kaikki.snapshot-acquisition.v0.1",
    );
    expect(manifest.execution).toMatchObject({
      sourceAcquisitionAttempts: 1,
      authoritativeAcquisitionAttemptCount: 1,
      transferAttemptCount: 1,
      sourceAcquired: true,
      sourceSnapshotVerification: "PASS",
      observedBytes: 3335546346,
      observedSha256: "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195",
      identityMatch: true,
      resultArtifactCreated: true,
      sourceImported: false,
      sourceIndexed: false,
      coverageEvaluated: false,
      s4Started: false,
      runtimeChanged: false,
    });
    for (const artifact of manifest.artifacts) {
      const absolutePath = path.join(ROOT, artifact.path);
      expect(fs.existsSync(absolutePath)).toBe(true);
      expect(fs.statSync(absolutePath).size).toBe(artifact.bytes);
      expect(sha256(absolutePath)).toBe(artifact.sha256);
    }
    expect(fs.existsSync(RESULT_PATH)).toBe(true);
    expect(manifest.artifacts.map((artifact) => artifact.path)).toEqual([
      "docs/open-instrument/english-kaikki-snapshot-acquisition-procedure-v0.1.md",
      "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-snapshot-acquisition-procedure-v0.1/procedure.json",
      "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-snapshot-acquisition-procedure-v0.1/result.json",
    ]);
    const resultArtifact = manifest.artifacts.find((artifact) => artifact.path.endsWith("/result.json"));
    expect(resultArtifact?.bytes).toBe(fs.statSync(RESULT_PATH).size);
    expect(resultArtifact?.sha256).toBe(sha256(RESULT_PATH));
    expect(result).toMatchObject({
      procedureId: manifest.procedureId,
      procedureSha256: "0c031549c58f7ca7f0ffc95108a2529c19dade6db925f59c7ab6671f2f793c35",
      sourceSnapshotId: "open-instrument.wiktionary-kaikki-english-lexical-sense.snapshot.2026-10-03.v0_1",
      sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
      localExternalPath: "OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT/source-family/english-kaikki/2026-10-03/kaikki.org-dictionary-English.jsonl",
      acquisitionMode: "NETWORK_TRANSFER_VERIFIED",
      toolingIdentity: {
        transfer: "curl 8.7.1 (x86_64-apple-darwin24.0) libcurl/8.7.1 (SecureTransport) LibreSSL/3.3.6 zlib/1.2.12 nghttp2/1.64.0",
        hash: "shasum 6.02 (SHA-256)",
        runtime: "node v24.11.0",
      },
      authoritativeAcquisitionAttemptCount: 1,
      transferAttemptCount: 1,
      observedBytes: 3335546346,
      observedSha256: "9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195",
      byteLengthMatch: true,
      sha256Match: true,
      identityMatch: true,
      sourceSnapshotVerification: "PASS",
      acquired: true,
      sourceContentInspected: false,
      imported: false,
      adapterImplemented: false,
      indexed: false,
      coverageEvaluated: false,
      runtimeChanged: false,
      s4: "NOT_STARTED",
      failureReason: null,
      nextAction: "DEFINE_AND_FREEZE_ENGLISH_KAIKKI_SOURCE_FAMILY_ADAPTER_V0_1",
    });
    expect(manifest.artifacts.some((artifact) => artifact.path.endsWith(".jsonl"))).toBe(false);
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

  test("binds milestone execution facts to the verified result", () => {
    const milestone = fs.readFileSync(MILESTONE_PATH, "utf8");
    const result = readJson<{ nextAction: string; s4: string }>(RESULT_PATH);

    expect(milestone).toContain("`ENGLISH_KAIKKI_ACQUISITION_PROCEDURE=EXECUTED`");
    expect(milestone).toContain("`ENGLISH_KAIKKI_ACQUISITION_ATTEMPTS=1`");
    expect(milestone).toContain("`ENGLISH_KAIKKI_SOURCE_ACQUIRED=YES`");
    expect(milestone).toContain("`ENGLISH_KAIKKI_SOURCE_VERIFICATION=PASS`");
    expect(milestone).toContain("`ENGLISH_KAIKKI_SOURCE_CONTENT_INSPECTED=NO`");
    expect(milestone).toContain("`ENGLISH_KAIKKI_SOURCE_ADAPTER_IMPLEMENTED=NO`");
    expect(milestone).toContain("`ENGLISH_KAIKKI_SOURCE_INDEX_BUILT=NO`");
    expect(milestone).toContain("`ENGLISH_KAIKKI_COVERAGE_EVALUATED=NO`");
    expect(milestone).toContain("`SOURCE_IMPORTED=NO`");
    expect(milestone).toContain("`SOURCE_RUNTIME_AUTHORIZED=NO`");
    expect(milestone).toContain("`RUNTIME_CHANGED=NO`");
    expect(milestone).toContain("`S4=NOT_STARTED`");
    expect(milestone).toContain(`\`NEXT_ACTION=${result.nextAction}\``);
    expect(result.s4).toBe("NOT_STARTED");
  });
});
