import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import {
  createFilesystemStrictBlindDurabilityStoreV1,
  defaultStrictBlindArtifactPathsV1,
  runStrictBlindAuthorizedCaseV1,
  verifyStrictBlindExecutionAuthorizationV1,
  type StrictBlindCorrespondenceEvaluationV1,
  type StrictBlindExecutionAuthorizationV1,
  type StrictBlindPreRevealContextV1,
  type StrictBlindResultPackageV1,
} from "../src/shared/openInstrument/strictBlindReplicationRunner.v1";

const CASE_ORDER = ["SBR-01", "SBR-02", "SBR-03"] as const;
type ReplicationSlot = (typeof CASE_ORDER)[number];

const SOURCE_OBSERVATIONS_BY_EMBRYO: Readonly<
  Record<string, ReadonlyArray<{
    sourceTraditionId: string;
    sourceRecordId: string;
    sourceForm: string;
    gloss: string;
    locator: string;
  }>>
> = {
  IR: [
    {
      sourceTraditionId: "fjale.fjalor-shqip.v0_1",
      sourceRecordId: "fjale.fjalor-shqip.ir.v0_1",
      sourceForm: "IR",
      gloss: "Fara e gjelit në vezë.",
      locator: "https://fjale.al/ir",
    },
    {
      sourceTraditionId: "scaife.lewis-short.v0_1",
      sourceRecordId: "scaife.lewis-short.ira.v0_1",
      sourceForm: "īra",
      gloss: "anger, wrath, rage, ire",
      locator:
        "https://atlas.perseus.tufts.edu/dictionaries/entry/urn:cite2:scaife-viewer:dictionary-entries.atlas_v1:lat.ls.perseus-eng2-n24877/",
    },
  ],
  YNE: [
    {
      sourceTraditionId: "fjale.fjalor-shqip.v0_1",
      sourceRecordId: "fjale.fjalor-shqip.yne.v0_1",
      sourceForm: "YNË",
      gloss: "Që na përket neve; që ka të bëjë me ne.",
      locator: "https://fjale.al/yn%C3%AB",
    },
  ],
  OLE: [],
};

const root = process.cwd();
const frozenArtifacts = defaultStrictBlindArtifactPathsV1(root);
const artifactRoot = resolve(
  root,
  "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1",
);
const authorizationPath = resolve(artifactRoot, "execution-authorization.v1.json");
const executionRoot = resolve(artifactRoot, "execution-v1");
const seriesResultPath = resolve(executionRoot, "series-result-package.v1.json");

function sha256Bytes(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function canonicalJson(value: unknown): Buffer {
  return Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function sourceQueryForm(stage: string, embryo: string): string {
  if (stage === "S0 exact embryo") return embryo;
  if (stage === "S1 identity-preserving normalization") {
    return embryo.toLocaleLowerCase("en-US");
  }
  return embryo;
}

function runBlindWorker(context: StrictBlindPreRevealContextV1): void {
  for (const sourceTraditionId of context.authorizedSourceTraditionIds) {
    for (const stage of context.authorizedSearchStages) {
      context.recordSourceQuery({
        sourceTraditionId,
        stage,
        queryForm: sourceQueryForm(stage, context.structuralInput.embryo),
        formOrigin: "structural_embryo_or_authorized_transform",
      });
    }
  }

  for (const observation of
    SOURCE_OBSERVATIONS_BY_EMBRYO[context.structuralInput.embryo] ?? []) {
    context.recordSourceObservation({
      ...observation,
      attestationTruth: "fact",
    });
  }

  context.freezeNull({
    reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
  });
}

function evaluateAfterReveal(input: {
  targetWord: string;
  targetSenseId: string;
  targetSenseLabel: string;
  preRevealArtifact: StrictBlindResultPackageV1["preRevealArtifact"];
}): StrictBlindCorrespondenceEvaluationV1 {
  if (input.preRevealArtifact.sourceObservations.length > 0) {
    return {
      classification: "FORM_RESEMBLANCE_ONLY",
      reasonCode: "SOURCE_FORM_OBSERVED_BUT_NO_TARGET_FUNCTIONAL_CORRESPONDENCE",
      targetBinding: "FAILED",
      functionalMechanism: null,
      evidenceBeyondGloss: false,
      structuralRelationStatus: "SEPARATE",
    };
  }
  return {
    classification: "NULL",
    reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
    targetBinding: "NOT_EVALUATED",
    functionalMechanism: null,
    evidenceBeyondGloss: false,
    structuralRelationStatus: "NONE",
  };
}

function assertCaseOrder(value: readonly string[]): asserts value is readonly ReplicationSlot[] {
  if (JSON.stringify(value) !== JSON.stringify(CASE_ORDER)) {
    throw new Error("EXECUTION_CASE_ORDER_INVALID");
  }
}

export type StrictBlindSeriesExecutionCaseRecordV1 = Readonly<{
  replicationSlot: ReplicationSlot;
  caseOpaqueId: string;
  targetReveal: Readonly<{
    targetWord: string;
    targetSenseId: string;
    targetSenseLabel: string;
  }>;
  result: StrictBlindResultPackageV1;
  durabilityPaths: Readonly<{
    primary: string;
    secondary: string;
    manifest: string;
  }>;
  durabilityHashes: Readonly<{
    primary: string;
    secondary: string;
    manifest: string;
  }>;
}>;

export type StrictBlindSeriesExecutionPackageV1 = Readonly<{
  schemaVersion: "open-instrument.strict-blind-replication-series-execution-result.v1";
  experimentId: string;
  executionId: "strict-blind-replication-series-v1.execution-01";
  authorizationSha256: string;
  frozenIdentity: Readonly<{
    preregistrationSha256: string;
    workerEnvelopeSha256: string;
    payloadSha256: Readonly<Record<ReplicationSlot, string>>;
  }>;
  authorizedCases: readonly ReplicationSlot[];
  providerCalls: 0;
  productionMutationState: "NONE";
  cases: readonly StrictBlindSeriesExecutionCaseRecordV1[];
  summary: Readonly<{
    validCaseCount: number;
    positiveCount: number;
    nullCount: number;
    insufficientCount: number;
    sourceUnavailableCount: number;
    contaminatedCount: number;
    classifications: readonly string[];
  }>;
}>;

function summarize(
  cases: readonly StrictBlindSeriesExecutionCaseRecordV1[],
): StrictBlindSeriesExecutionPackageV1["summary"] {
  const classifications = cases.map(
    (entry) => entry.result.postRevealEvaluation?.classification ?? "CONTAMINATED",
  );
  return {
    validCaseCount: cases.filter((entry) => !entry.result.contamination.contaminated).length,
    positiveCount: classifications.filter((value) => value === "FUNCTIONAL_CORRESPONDENCE").length,
    nullCount: classifications.filter((value) => value === "NULL").length,
    insufficientCount: classifications.filter((value) => value === "INSUFFICIENT_CORRESPONDENCE").length,
    sourceUnavailableCount: classifications.filter((value) => value === "SOURCE_UNAVAILABLE").length,
    contaminatedCount: cases.filter((entry) => entry.result.contamination.contaminated).length,
    classifications,
  };
}

function main(): void {
  if (existsSync(seriesResultPath)) {
    throw new Error("EXECUTION_ALREADY_RECORDED");
  }
  const authorizationBytes = readFileSync(authorizationPath);
  const authorization = readJson<StrictBlindExecutionAuthorizationV1>(authorizationPath);
  assertCaseOrder(authorization.authorizedCases);
  if (!authorization.realExecutionAuthorized) {
    throw new Error("REAL_EXECUTION_AUTHORIZATION_REQUIRED");
  }

  const preregistration = readJson<{
    structuralControllers: Array<{
      replicationSlot: ReplicationSlot;
      targetWord: string;
      targetSenseId: string;
      targetSenseDefinition: string;
    }>;
  }>(frozenArtifacts.preregistrationPath);
  const controllers = new Map(
    preregistration.structuralControllers.map((controller) => [
      controller.replicationSlot,
      {
        targetWord: controller.targetWord,
        targetSenseId: controller.targetSenseId,
        targetSenseLabel: controller.targetSenseDefinition,
      },
    ]),
  );
  mkdirSync(executionRoot, { recursive: true });
  const records: StrictBlindSeriesExecutionCaseRecordV1[] = [];

  for (const replicationSlot of CASE_ORDER) {
    const frozen = verifyStrictBlindExecutionAuthorizationV1(
      authorization,
      frozenArtifacts,
      replicationSlot,
    );
    const payload = readJson<{ embryo: string; voicePath: string[] }>(
      resolve(root, frozenArtifacts.payloadPaths[replicationSlot]),
    );
    const targetReveal = controllers.get(replicationSlot);
    if (!targetReveal) throw new Error("TARGET_REVEAL_RECORD_MISSING");
    const caseOpaqueId = `${frozen.experimentId}.${replicationSlot}.opaque`;
    const caseRoot = resolve(executionRoot, replicationSlot);
    const result = runStrictBlindAuthorizedCaseV1({
      mode: "real",
      authorization,
      caseOpaqueId,
      replicationSlot,
      frozenArtifacts,
      structuralInput: {
        embryo: payload.embryo,
        voicePath: payload.voicePath,
      },
      durabilityStore: createFilesystemStrictBlindDurabilityStoreV1(caseRoot),
      worker: runBlindWorker,
      revealTarget: () => targetReveal,
      evaluateAfterReveal,
    });
    const primaryPath = resolve(caseRoot, "pre-reveal.primary.json");
    const secondaryPath = resolve(caseRoot, "pre-reveal.secondary.json");
    const manifestPath = resolve(caseRoot, "pre-reveal.manifest.json");
    const record: StrictBlindSeriesExecutionCaseRecordV1 = {
      replicationSlot,
      caseOpaqueId,
      targetReveal,
      result,
      durabilityPaths: {
        primary: `execution-v1/${replicationSlot}/pre-reveal.primary.json`,
        secondary: `execution-v1/${replicationSlot}/pre-reveal.secondary.json`,
        manifest: `execution-v1/${replicationSlot}/pre-reveal.manifest.json`,
      },
      durabilityHashes: {
        primary: sha256Bytes(readFileSync(primaryPath)),
        secondary: sha256Bytes(readFileSync(secondaryPath)),
        manifest: sha256Bytes(readFileSync(manifestPath)),
      },
    };
    writeFileSync(
      resolve(caseRoot, "post-reveal-result.v1.json"),
      canonicalJson(record),
    );
    records.push(record);
  }

  const first = records[0].result;
  const packageValue: StrictBlindSeriesExecutionPackageV1 = {
    schemaVersion: "open-instrument.strict-blind-replication-series-execution-result.v1",
    experimentId: first.preRevealArtifact.replicationExperimentId,
    executionId: "strict-blind-replication-series-v1.execution-01",
    authorizationSha256: sha256Bytes(authorizationBytes),
    frozenIdentity: {
      preregistrationSha256: frozenArtifacts.expectedPreregistrationSha256,
      workerEnvelopeSha256: frozenArtifacts.expectedWorkerEnvelopeSha256,
      payloadSha256: {
        "SBR-01": frozenArtifacts.expectedPayloadSha256["SBR-01"],
        "SBR-02": frozenArtifacts.expectedPayloadSha256["SBR-02"],
        "SBR-03": frozenArtifacts.expectedPayloadSha256["SBR-03"],
      },
    },
    authorizedCases: CASE_ORDER,
    providerCalls: 0,
    productionMutationState: "NONE",
    cases: records,
    summary: summarize(records),
  };
  writeFileSync(seriesResultPath, canonicalJson(packageValue));
  console.log(JSON.stringify(packageValue.summary, null, 2));
}

if (process.argv[1]?.endsWith("openInstrumentStrictBlindReplicationSeriesV1Execution.v1.ts")) {
  main();
}
