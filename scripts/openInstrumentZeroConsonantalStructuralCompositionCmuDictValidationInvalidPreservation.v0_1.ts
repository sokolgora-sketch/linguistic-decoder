import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const REPO_ROOT = process.cwd();
const SOURCE_PATH = join(REPO_ROOT, "src/data/openInstrument/pronunciation/cmudict.dict");
const RUNNER_PATH = join(REPO_ROOT, "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1.ts");
const VALIDATION_MODULE_PATH = join(REPO_ROOT, "src/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1.ts");
const IMPLEMENTATION_PATH = join(REPO_ROOT, "src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts");
const CONTRACT_PATH = join(REPO_ROOT, "docs/open-instrument/zero-consonantal-structural-composition-v0.1.md");
const CONFIGURATION_AUTHORITY_PATH = join(REPO_ROOT, "docs/open-instrument/consonantal-configuration-authority-v0.1.md");
const PRIOR_PRODUCT_CONTRACT_PATH = join(REPO_ROOT, "docs/open-instrument/consonant-structure-product-embryo-v0.1.md");
const FRD02_RESULT_PATH = join(REPO_ROOT, "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-synthetic-calibration-v0.1/result.json");
const FRD02_MANIFEST_PATH = join(REPO_ROOT, "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-synthetic-calibration-v0.1/hash-manifest.json");
const ARTIFACT_DIRECTORY = join(REPO_ROOT, "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1");
const POPULATION_SPEC_PATH = join(ARTIFACT_DIRECTORY, "population-spec.json");
const RESULT_PATH = join(ARTIFACT_DIRECTORY, "result.json");
const MANIFEST_PATH = join(ARTIFACT_DIRECTORY, "hash-manifest.json");

const SOURCE_SHA256 = "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22";
const SOURCE_BYTES = 3618488;
const ZC_CONTRACT_SHA256 = "1ee274253f2b6da3c29a9c9b4409c258e64a6d4121dcf48925464dac926a8e0c";
const CONFIGURATION_AUTHORITY_SHA256 = "b4d24f1105af0b4a3a2a3275425f84a1499ddea77f0d307f5d175d8125ac502d";
const PRIOR_PRODUCT_CONTRACT_SHA256 = "14ab3a088f891b1aba079d5ef7f6c23a2c5883758c24a7976788dd9024dc99fc";
const FRD02_HISTORICAL_TYPO_SHA256 = "b912ae02bb8be01ba75475df068a3cffdd440eae166542cc944ce8fdabf2bf43";

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function fileBytes(path: string): number {
  return readFileSync(path).byteLength;
}

function repositoryHead(): string {
  return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function preserveInvalidExecution(): void {
  if (!existsSync(POPULATION_SPEC_PATH)) throw new Error("population spec is missing");
  if (existsSync(RESULT_PATH) || existsSync(MANIFEST_PATH)) {
    throw new Error("invalid execution artifacts already exist; refusing overwrite");
  }
  if (sha256File(SOURCE_PATH) !== SOURCE_SHA256 || fileBytes(SOURCE_PATH) !== SOURCE_BYTES) {
    throw new Error("frozen source identity mismatch");
  }
  if (sha256File(CONTRACT_PATH) !== ZC_CONTRACT_SHA256) throw new Error("ZC contract hash mismatch");
  if (sha256File(CONFIGURATION_AUTHORITY_PATH) !== CONFIGURATION_AUTHORITY_SHA256) throw new Error("configuration authority hash mismatch");
  if (sha256File(PRIOR_PRODUCT_CONTRACT_PATH) !== PRIOR_PRODUCT_CONTRACT_SHA256) throw new Error("prior product contract hash mismatch");

  const populationSpec = JSON.parse(readFileSync(POPULATION_SPEC_PATH, "utf8")) as {
    source: { sha256: string; bytes: number; id: string; revision: string; notation: string };
    contracts: { zcContractSha256: string; configurationAuthoritySha256: string; priorProductContractSha256: string };
    population: { lexicalFormsTotal: number; sourceVariantsTotal: number; entries: readonly { eligibility: string; reasonCode: string | null }[] };
  };
  const eligibleVariants = populationSpec.population.entries.filter((entry) => entry.eligibility === "ELIGIBLE").length;
  const nullReasonCounts = new Map<string, number>();
  for (const entry of populationSpec.population.entries.filter((candidate) => candidate.eligibility !== "ELIGIBLE")) {
    const reason = entry.reasonCode ?? "ZC_NULL";
    nullReasonCounts.set(reason, (nullReasonCounts.get(reason) ?? 0) + 1);
  }
  const failureStack = `RangeError: Maximum call stack size exceeded
    at numericSummaryV0_1 (src/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1.ts:140:44)
    at buildZeroConsonantalDistributionSummaryV0_1 (src/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1.ts:222:8)
    at execute (scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1.ts:440:25)`;
  const runnerSha256 = sha256File(RUNNER_PATH);
  const preservationSha256 = sha256File(join(REPO_ROOT, "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidationInvalidPreservation.v0_1.ts"));
  const now = new Date().toISOString();
  const result = {
    schemaVersion: "open-instrument.zero-consonantal-structural-composition-cmudict-validation.v0_1",
    status: "INVALID_EXECUTION_PRESERVED",
    outcome: "INVALID_EXECUTION",
    population: {
      sourceId: populationSpec.source.id,
      sourceRevision: populationSpec.source.revision,
      sourceNotation: populationSpec.source.notation,
      sourceSha256: populationSpec.source.sha256,
      sourceBytes: populationSpec.source.bytes,
      lexicalFormsTotal: populationSpec.population.lexicalFormsTotal,
      sourceVariantsTotal: populationSpec.population.sourceVariantsTotal,
      eligibleVariants,
      nullOrIneligibleVariants: populationSpec.population.sourceVariantsTotal - eligibleVariants,
      nullReasonCounts: [...nullReasonCounts.entries()].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0).map(([reasonCode, count]) => ({ reasonCode, count })),
    },
    execution: {
      attemptCount: 1,
      authoritativeExecutionStarted: true,
      authoritativeExecutionCompleted: false,
      executedScientificEvaluations: eligibleVariants,
      aggregationStarted: true,
      observationsPersisted: false,
      executionStartUtc: null,
      executionEndUtc: null,
      preservedAtUtc: now,
      command: "npx tsx scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1.ts --execute",
      runnerPath: "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1.ts",
      runnerSha256,
      populationSpecPath: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1/population-spec.json",
      populationSpecSha256: sha256File(POPULATION_SPEC_PATH),
      repositoryHead: repositoryHead(),
      noRerun: true,
      adaptiveRerun: false,
      replacementReplicates: false,
      syntheticOnly: false,
      realDataExecuted: false,
      failure: {
        stage: "AGGREGATION",
        name: "RangeError",
        message: "Maximum call stack size exceeded",
        stack: failureStack,
      },
    },
    authority: {
      zcContractSha256: sha256File(CONTRACT_PATH),
      configurationAuthoritySha256: sha256File(CONFIGURATION_AUTHORITY_PATH),
      priorProductContractSha256: sha256File(PRIOR_PRODUCT_CONTRACT_PATH),
      implementationPath: "src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts",
      implementationSha256: sha256File(IMPLEMENTATION_PATH),
      sourcePath: "src/data/openInstrument/pronunciation/cmudict.dict",
    },
    claimBoundary: {
      semanticAnalysisPerformed: false,
      semanticInterpretation: "NOT_PERFORMED",
      lexicalMeaningUsed: false,
      productionReadinessEstablished: false,
    },
  };
  writeJson(RESULT_PATH, result);
  const frd02Manifest = JSON.parse(readFileSync(FRD02_MANIFEST_PATH, "utf8")) as { artifacts: readonly { path: string; sha256: string }[] };
  const manifest = {
    manifestVersion: "open-instrument.artifact-hash-manifest.v0_1",
    status: "INVALID_EXECUTION_PRESERVED",
    outcome: "INVALID_EXECUTION",
    attemptCount: 1,
    noRerun: true,
    realDataExecuted: false,
    preservationOnly: true,
    repositoryHead: repositoryHead(),
    preservationScriptPath: "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidationInvalidPreservation.v0_1.ts",
    preservationScriptSha256: preservationSha256,
    artifacts: [
      { path: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1/population-spec.json", sha256: sha256File(POPULATION_SPEC_PATH), byteLength: fileBytes(POPULATION_SPEC_PATH) },
      { path: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1/result.json", sha256: sha256File(RESULT_PATH), byteLength: fileBytes(RESULT_PATH) },
      { path: "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1.ts", sha256: runnerSha256, byteLength: fileBytes(RUNNER_PATH) },
      { path: "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidationInvalidPreservation.v0_1.ts", sha256: preservationSha256, byteLength: fileBytes(join(REPO_ROOT, "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidationInvalidPreservation.v0_1.ts")) },
      { path: "src/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1.ts", sha256: sha256File(VALIDATION_MODULE_PATH), byteLength: fileBytes(VALIDATION_MODULE_PATH) },
      { path: "src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts", sha256: sha256File(IMPLEMENTATION_PATH), byteLength: fileBytes(IMPLEMENTATION_PATH) },
      { path: "src/data/openInstrument/pronunciation/cmudict.dict", sha256: SOURCE_SHA256, byteLength: SOURCE_BYTES },
    ],
    frozenContracts: {
      zcContractSha256: ZC_CONTRACT_SHA256,
      configurationAuthoritySha256: CONFIGURATION_AUTHORITY_SHA256,
      priorProductContractSha256: PRIOR_PRODUCT_CONTRACT_SHA256,
    },
    frd02: {
      actualSha256: sha256File(FRD02_RESULT_PATH),
      preservedManifestSha256: frd02Manifest.artifacts.find((artifact) => artifact.path.endsWith("result.json"))?.sha256 ?? null,
      historicalTypoValue: FRD02_HISTORICAL_TYPO_SHA256,
      manifestSha256: sha256File(FRD02_MANIFEST_PATH),
    },
  };
  writeJson(MANIFEST_PATH, manifest);
  console.log(JSON.stringify({
    mode: "PRESERVE_INVALID_EXECUTION",
    resultPath: RESULT_PATH,
    resultBytes: fileBytes(RESULT_PATH),
    resultSha256: sha256File(RESULT_PATH),
    manifestPath: MANIFEST_PATH,
    manifestSha256: sha256File(MANIFEST_PATH),
    attemptCount: 1,
    outcome: "INVALID_EXECUTION",
  }, null, 2));
}

preserveInvalidExecution();
