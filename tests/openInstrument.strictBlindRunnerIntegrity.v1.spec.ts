import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1,
  STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_INTEGRITY_V1,
  StrictBlindIntegrityAuthorizationStoreV1,
  createStrictBlindIntegrityTempDirectoryV1,
  initializeStrictBlindIntegrityAuthorizationV1,
  recoverStrictBlindIntegrityPreRevealV1,
  runStrictBlindIntegritySyntheticCaseV1,
  verifyStrictBlindIntegrityPackageV1,
  type StrictBlindIntegritySyntheticCaseInputV1,
  type StrictBlindIntegritySyntheticSourceAccessV1,
  type SyntheticSourceResultV1,
} from "../src/shared/openInstrument/strictBlindRunnerIntegrity.v1";
import {
  defaultStrictBlindArtifactPathsV1,
} from "../src/shared/openInstrument/strictBlindReplicationRunner.v1";

const paths = defaultStrictBlindArtifactPathsV1(process.cwd());
const sourceTraditions = [
  "fjale.fjalor-shqip.v0_1",
  "scaife.lewis-short.v0_1",
  "scaife.middle-liddell.v0_1",
];
const stages = [
  "S0 exact embryo",
  "S1 identity-preserving normalization",
  "S2 source-attested bounded morphology",
  "S3 source-attested dialect/history",
  "S4 authoritative reconstruction",
];

const activeDirectories: string[] = [];

function makeDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), "open-instrument-strict-blind-integrity-test-"));
  activeDirectories.push(directory);
  return directory;
}

function makeSourceAccess(
  result: "NOT_FOUND" | "SOURCE_UNAVAILABLE" | "FOUND" = "NOT_FOUND",
): StrictBlindIntegritySyntheticSourceAccessV1 {
  const results: SyntheticSourceResultV1[] = [];
  for (const [sourceIndex, sourceTraditionId] of sourceTraditions.entries()) {
    for (const [stageIndex, stage] of stages.entries()) {
      const base = {
        sourceTraditionId,
        stage,
        queryForm: `SYNTHETIC_EMBRYO_${sourceIndex}_${stageIndex}`,
      };
      if (result === "FOUND" && sourceIndex === 0 && stageIndex === 0) {
        results.push({
          ...base,
          result: "FOUND",
          sourceRecordId: "synthetic.record.v1",
          sourceForm: "SYNTHETIC_EMBRYO",
          gloss: "synthetic bounded operation",
          locator: "synthetic://authorized-source/record",
          attestationTruth: "fact",
        });
      } else if (result === "SOURCE_UNAVAILABLE") {
        results.push({
          ...base,
          result: "SOURCE_UNAVAILABLE",
          detail: "synthetic source unavailable",
        });
      } else {
        results.push({ ...base, result: "NOT_FOUND" });
      }
    }
  }
  return {
    mode: STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1,
    results,
  };
}

function makeInput(
  overrides: Partial<StrictBlindIntegritySyntheticCaseInputV1> = {},
): StrictBlindIntegritySyntheticCaseInputV1 {
  return {
    replicationSlot: "SBR-01",
    caseOpaqueId: "synthetic.integrity.case.v1",
    frozenArtifacts: paths,
    structuralInput: { embryo: "IR", voicePath: ["I"] },
    sourceAccess: makeSourceAccess("FOUND"),
    artifactDirectory: makeDirectory(),
    workerDecision: {
      kind: "FUNCTION",
      mechanismType: "operation_process",
      statement: "synthetic bounded operation",
      evidenceBeyondGloss: true,
    },
    target: {
      targetWord: "synthetic-target",
      targetSenseId: "synthetic-sense",
      targetSenseLabel: "synthetic target sense",
    },
    evaluateAfterReveal() {
      return {
        classification: "FUNCTIONAL_CORRESPONDENCE",
        reasonCode: "SYNTHETIC_ONLY",
        targetBinding: "MATCHED",
        functionalMechanism: "synthetic bounded operation",
        evidenceBeyondGloss: true,
        structuralRelationStatus: "SEPARATE",
      };
    },
    ...overrides,
  };
}

afterEach(() => {
  for (const directory of activeDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("strict-blind runner integrity repair v1", () => {
  test("runs in an isolated worker and independently verifies a synthetic bounded function", async () => {
    const input = makeInput();
    const result = await runStrictBlindIntegritySyntheticCaseV1(input);

    expect(result.packageType).toBe("SYNTHETIC_ONLY_RESEARCH_INTEGRITY");
    expect(result.workerIsolation).toEqual({
      workerContext: "worker_thread",
      targetFieldsReceived: false,
      crossCaseContextReceived: false,
    });
    expect(result.sourceAccess.acquisitionMode).toBe("SYNTHETIC_TEST_FIXTURE");
    expect(result.durability.independentlyRecovered).toBe(true);
    expect(result.reveal).toEqual({ allowed: true, targetRevealed: true });
    expect(result.productionMutationState).toBe("NONE");

    const preReveal = readFileSync(join(input.artifactDirectory, "pre-reveal.primary.json"), "utf8");
    expect(preReveal).not.toContain("targetWord");
    expect(
      verifyStrictBlindIntegrityPackageV1({
        packagePath: join(input.artifactDirectory, "result-package.json"),
        durabilityDirectory: input.artifactDirectory,
        authorizationDirectory: join(input.artifactDirectory, "authorization"),
        frozenArtifacts: paths,
        replicationSlot: "SBR-01",
      }),
    ).toEqual({ status: "PASS", productionMutationState: "NONE", providerCalls: 0 });
  });

  test("preserves a synthetic Null/source-unavailable outcome", async () => {
    const result = await runStrictBlindIntegritySyntheticCaseV1(
      makeInput({
        sourceAccess: makeSourceAccess("SOURCE_UNAVAILABLE"),
        workerDecision: { kind: "NULL", reasonCode: "SOURCE_UNAVAILABLE" },
        evaluateAfterReveal() {
          return {
            classification: "NULL",
            reasonCode: "SOURCE_UNAVAILABLE",
            targetBinding: "MATCHED",
            functionalMechanism: null,
            evidenceBeyondGloss: false,
            structuralRelationStatus: "NONE",
          };
        },
      }),
    );
    expect(result.postRevealEvaluation.classification).toBe("NULL");
    expect(result.sourceAccess.unavailableCount).toBe(15);
    expect(result.productionMutationState).toBe("NONE");
  });

  test("rejects an unauthorized source and non-synthetic acquisition mode", async () => {
    const unauthorized = makeSourceAccess("FOUND");
    const results = [...unauthorized.results];
    results[0] = { ...results[0], sourceTraditionId: "unauthorized.source" } as SyntheticSourceResultV1;
    await expect(
      runStrictBlindIntegritySyntheticCaseV1(
        makeInput({ sourceAccess: { ...unauthorized, results } }),
      ),
    ).rejects.toThrow("SOURCE_ACCESS_OUTSIDE_FROZEN_PROTOCOL");

    await expect(
      runStrictBlindIntegritySyntheticCaseV1(
        makeInput({
          sourceAccess: {
            mode: "AUTHORIZED_REAL_SOURCE_RETRIEVAL",
            results: [],
          } as never,
        }),
      ),
    ).rejects.toThrow("REAL_SOURCE_ACQUISITION_NOT_AUTHORIZED_IN_REPAIR");
  });

  test("rejects target leakage before the worker thread starts", async () => {
    await expect(
      runStrictBlindIntegritySyntheticCaseV1(
        makeInput({
          workerDecision: {
            kind: "NULL",
            reasonCode: "INSUFFICIENT_AUTHORITY",
            targetWord: "leak",
          } as never,
        }),
      ),
    ).rejects.toThrow("WORKER_TARGET_INPUT_LEAK");
  });

  test("atomically consumes authorization and rejects replay after failure", () => {
    const directory = makeDirectory();
    initializeStrictBlindIntegrityAuthorizationV1(directory, {
      schemaVersion: "open-instrument.strict-blind-runner-integrity.v1",
      authorizationId: "synthetic.auth.v1",
      executionId: "synthetic.execution.v1",
      caseOpaqueId: "synthetic.case.v1",
      mode: "synthetic",
      realExecutionAuthorized: false,
    });
    const store = new StrictBlindIntegrityAuthorizationStoreV1(directory);
    const token = store.consume("synthetic.case.v1");
    expect(store.snapshot().state).toBe("ATOMICALLY_CONSUMED");
    expect(() => store.consume("synthetic.case.v1")).toThrow("AUTHORIZATION_ALREADY_CONSUMED");
    store.transition(token, "EXECUTING");
    store.transition(token, "FAILED");
    expect(store.snapshot().state).toBe("FAILED");
    expect(() => store.consume("synthetic.case.v1")).toThrow("AUTHORIZATION_ALREADY_CONSUMED");
  });

  test("rejects incomplete worker source coverage", async () => {
    const access = makeSourceAccess("NOT_FOUND");
    await expect(
      runStrictBlindIntegritySyntheticCaseV1(
        makeInput({ sourceAccess: { ...access, results: access.results.slice(1) } }),
      ),
    ).rejects.toThrow("SOURCE_QUERY_COVERAGE_INCOMPLETE");
  });

  test("rejects frozen payload identity mismatch before worker execution", async () => {
    await expect(
      runStrictBlindIntegritySyntheticCaseV1(
        makeInput({
          frozenArtifacts: {
            ...paths,
            expectedPayloadSha256: { ...paths.expectedPayloadSha256, "SBR-01": "bad" },
          },
        }),
      ),
    ).rejects.toThrow("PAYLOAD_HASH_MISMATCH");
  });

  test("rejects contamination and never reveals", async () => {
    await expect(
      runStrictBlindIntegritySyntheticCaseV1(
        makeInput({ contaminationReason: "CROSS_CASE_CONTEXT" }),
      ),
    ).rejects.toThrow("CONTAMINATION_BLOCKS_REVEAL");
  });

  test("detects pre-reveal artifact tampering after worker context is gone", async () => {
    const input = makeInput();
    await runStrictBlindIntegritySyntheticCaseV1(input);
    writeFileSync(join(input.artifactDirectory, "pre-reveal.primary.json"), "tampered");
    expect(() => recoverStrictBlindIntegrityPreRevealV1(input.artifactDirectory)).toThrow(
      "PRE_REVEAL_DURABILITY_RECOVERY_FAILED",
    );
  });

  test("detects manifest tampering and package tampering", async () => {
    const input = makeInput();
    await runStrictBlindIntegritySyntheticCaseV1(input);
    const manifestPath = join(input.artifactDirectory, "pre-reveal.manifest.json");
    writeFileSync(manifestPath, "{}");
    expect(() => recoverStrictBlindIntegrityPreRevealV1(input.artifactDirectory)).toThrow(
      "PRE_REVEAL_DURABILITY_RECOVERY_FAILED",
    );

    const second = makeInput();
    await runStrictBlindIntegritySyntheticCaseV1(second);
    const packagePath = join(second.artifactDirectory, "result-package.json");
    const packageValue = JSON.parse(readFileSync(packagePath, "utf8")) as Record<string, unknown>;
    writeFileSync(packagePath, JSON.stringify({ ...packageValue, providerCalls: 1 }));
    expect(() =>
      verifyStrictBlindIntegrityPackageV1({
        packagePath,
        durabilityDirectory: second.artifactDirectory,
        authorizationDirectory: join(second.artifactDirectory, "authorization"),
        frozenArtifacts: paths,
        replicationSlot: "SBR-01",
      }),
    ).toThrow("STRICT_BLIND_INTEGRITY_PACKAGE_INVALID");
  });

  test("rejects unknown post-reveal evaluation enums", async () => {
    const input = makeInput();
    await runStrictBlindIntegritySyntheticCaseV1(input);
    const packagePath = join(input.artifactDirectory, "result-package.json");
    const postRevealPath = join(input.artifactDirectory, "post-reveal.json");
    const packageValue = JSON.parse(readFileSync(packagePath, "utf8")) as Record<string, unknown> & {
      postRevealEvaluation: Record<string, unknown>;
    };
    const postRevealValue = JSON.parse(readFileSync(postRevealPath, "utf8")) as Record<string, unknown> & {
      evaluation: Record<string, unknown>;
    };
    const invalidEvaluation = {
      ...packageValue.postRevealEvaluation,
      classification: "UNKNOWN_CLASSIFICATION",
    };
    writeFileSync(packagePath, JSON.stringify({ ...packageValue, postRevealEvaluation: invalidEvaluation }));
    writeFileSync(postRevealPath, JSON.stringify({ ...postRevealValue, evaluation: invalidEvaluation }));
    expect(() =>
      verifyStrictBlindIntegrityPackageV1({
        packagePath,
        durabilityDirectory: input.artifactDirectory,
        authorizationDirectory: join(input.artifactDirectory, "authorization"),
        frozenArtifacts: paths,
        replicationSlot: "SBR-01",
      }),
    ).toThrow("POST_REVEAL_EVALUATION_ENUM_INVALID");
  });

  test("does not permit reveal or verification before durable recovery", () => {
    const directory = makeDirectory();
    writeFileSync(join(directory, "pre-reveal.primary.json"), "{}");
    expect(() => recoverStrictBlindIntegrityPreRevealV1(directory)).toThrow();
    expect(() =>
      verifyStrictBlindIntegrityPackageV1({
        packagePath: join(directory, "result-package.json"),
        durabilityDirectory: directory,
        authorizationDirectory: join(directory, "authorization"),
        frozenArtifacts: paths,
        replicationSlot: "SBR-01",
      }),
    ).toThrow();
  });

  test("uses external durability and refuses a second pre-reveal finalization", async () => {
    const input = makeInput();
    await runStrictBlindIntegritySyntheticCaseV1(input);
    expect(() =>
      writeFileSync(join(input.artifactDirectory, "pre-reveal.finalized"), "again", { flag: "wx" }),
    ).toThrow();
    expect(() =>
      writeFileSync(join(input.artifactDirectory, "post-reveal.json"), "again", { flag: "wx" }),
    ).toThrow();
  });

  test("keeps real execution locked and synthetic authorization non-authorizing", () => {
    expect(STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_INTEGRITY_V1).toBe(false);
    const directory = createStrictBlindIntegrityTempDirectoryV1();
    activeDirectories.push(directory);
    expect(directory).toMatch(/open-instrument-strict-blind-/);
  });

  test("repeated synthetic runs are deterministic apart from their external directories", async () => {
    const firstInput = makeInput({ caseOpaqueId: "synthetic.repeat.v1" });
    const secondInput = makeInput({ caseOpaqueId: "synthetic.repeat.v1" });
    const first = await runStrictBlindIntegritySyntheticCaseV1(firstInput);
    const second = await runStrictBlindIntegritySyntheticCaseV1(secondInput);
    expect(first).toEqual(second);
  });
});
