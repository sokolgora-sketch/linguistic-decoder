import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  defaultStrictBlindArtifactPathsV1,
  verifyStrictBlindExecutionAuthorizationV1,
  type StrictBlindExecutionAuthorizationV1,
} from "../src/shared/openInstrument/strictBlindReplicationRunner.v1";
import type {
  StrictBlindSeriesExecutionCaseRecordV1,
  StrictBlindSeriesExecutionPackageV1,
} from "./openInstrumentStrictBlindReplicationSeriesV1Execution.v1";

const CASE_ORDER = ["SBR-01", "SBR-02", "SBR-03"] as const;
const EXPECTED_SOURCE_TRADITIONS = [
  "fjale.fjalor-shqip.v0_1",
  "scaife.lewis-short.v0_1",
  "scaife.middle-liddell.v0_1",
];
const EXPECTED_SEARCH_STAGES = [
  "S0 exact embryo",
  "S1 identity-preserving normalization",
  "S2 source-attested bounded morphology",
  "S3 source-attested dialect/history",
  "S4 authoritative reconstruction",
];

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

function hasForbiddenTargetKey(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasForbiddenTargetKey);
  if (!value || typeof value !== "object") return false;
  return Object.entries(value).some(([key, nested]) =>
    [
      "targetWord",
      "targetSenseId",
      "targetSenseLabel",
      "targetSenseDefinition",
      "translation",
      "etymology",
      "expectedFunction",
      "expansionChain",
    ].includes(key) || hasForbiddenTargetKey(nested),
  );
}

function assertCaseRecord(
  record: StrictBlindSeriesExecutionCaseRecordV1,
  expectedSlot: (typeof CASE_ORDER)[number],
  expectedTarget: { targetWord: string; targetSenseId: string; targetSenseLabel: string },
): void {
  if (record.replicationSlot !== expectedSlot) throw new Error("CASE_ORDER_INVALID");
  if (record.targetReveal.targetWord !== expectedTarget.targetWord || record.targetReveal.targetSenseId !== expectedTarget.targetSenseId || record.targetReveal.targetSenseLabel !== expectedTarget.targetSenseLabel) {
    throw new Error(`TARGET_REVEAL_MISMATCH:${expectedSlot}`);
  }
  const result = record.result;
  if (
    result.mode !== "real" ||
    result.reveal.allowed !== true ||
    result.reveal.targetRevealed !== true ||
    result.durability.passed !== true ||
    result.contamination.contaminated !== false ||
    result.productionMutationState !== "NONE"
  ) {
    throw new Error(`CASE_RESULT_INVALID:${expectedSlot}`);
  }
  const artifact = result.preRevealArtifact;
  if (
    artifact.createdBeforeTargetReveal !== true ||
    artifact.blindnessAttestation !== true ||
    artifact.targetRevealStatus !== "NOT_REQUESTED_AND_NOT_PERFORMED" ||
    artifact.revealGateStatus !== "FORBIDDEN_UNTIL_DURABILITY_GATE" ||
    artifact.productionMutationState !== "NONE" ||
    hasForbiddenTargetKey(artifact)
  ) {
    throw new Error(`PRE_REVEAL_ARTIFACT_INVALID:${expectedSlot}`);
  }
  const canonicalArtifactBytes = canonicalJson(artifact);
  const canonicalHash = sha256Bytes(canonicalArtifactBytes);
  if (canonicalHash !== result.preRevealArtifactSha256) {
    throw new Error(`PRE_REVEAL_HASH_INVALID:${expectedSlot}`);
  }
  const caseRoot = resolve(executionRoot, expectedSlot);
  const primaryPath = resolve(caseRoot, "pre-reveal.primary.json");
  const secondaryPath = resolve(caseRoot, "pre-reveal.secondary.json");
  const manifestPath = resolve(caseRoot, "pre-reveal.manifest.json");
  if (!existsSync(primaryPath) || !existsSync(secondaryPath) || !existsSync(manifestPath)) {
    throw new Error(`DURABILITY_ARTIFACT_MISSING:${expectedSlot}`);
  }
  const primaryBytes = readFileSync(primaryPath);
  const secondaryBytes = readFileSync(secondaryPath);
  const manifest = readJson<{
    caseOpaqueId: string;
    payloadSha256: string;
    preRevealArtifactSha256: string;
    primaryAndSecondaryMustMatchExactly: boolean;
    targetRevealStatus: string;
    revealGateStatus: string;
  }>(manifestPath);
  if (
    !primaryBytes.equals(secondaryBytes) ||
    !primaryBytes.equals(canonicalArtifactBytes) ||
    sha256Bytes(primaryBytes) !== result.preRevealArtifactSha256 ||
    manifest.caseOpaqueId !== record.caseOpaqueId ||
    manifest.payloadSha256 !== result.payloadSha256 ||
    manifest.preRevealArtifactSha256 !== result.preRevealArtifactSha256 ||
    manifest.primaryAndSecondaryMustMatchExactly !== true ||
    manifest.targetRevealStatus !== "NOT_REQUESTED_AND_NOT_PERFORMED" ||
    manifest.revealGateStatus !== "FORBIDDEN_UNTIL_DURABILITY_GATE"
  ) {
    throw new Error(`DURABILITY_MANIFEST_INVALID:${expectedSlot}`);
  }
  const queryKeys = new Set(
    artifact.sourceQueries.map((query) => `${query.sourceTraditionId}|${query.stage}`),
  );
  for (const sourceTraditionId of EXPECTED_SOURCE_TRADITIONS) {
    for (const stage of EXPECTED_SEARCH_STAGES) {
      if (!queryKeys.has(`${sourceTraditionId}|${stage}`)) {
        throw new Error(`SOURCE_QUERY_COVERAGE_INVALID:${expectedSlot}`);
      }
    }
  }
  if (
    artifact.sourceObservations.some((observation) =>
      !EXPECTED_SOURCE_TRADITIONS.includes(observation.sourceTraditionId),
    )
  ) {
    throw new Error(`SOURCE_OBSERVATION_UNAUTHORIZED:${expectedSlot}`);
  }
}

export function verifyStrictBlindReplicationSeriesExecutionPackageV1(): Readonly<{
  status: "PASS";
  caseCount: 3;
  providerCalls: 0;
  productionMutationState: "NONE";
}> {
  if (!existsSync(seriesResultPath)) throw new Error("SERIES_RESULT_PACKAGE_MISSING");
  const authorizationBytes = readFileSync(authorizationPath);
  const authorization = readJson<StrictBlindExecutionAuthorizationV1>(authorizationPath);
  const packageValue = readJson<StrictBlindSeriesExecutionPackageV1>(seriesResultPath);
  if (
    packageValue.schemaVersion !== "open-instrument.strict-blind-replication-series-execution-result.v1" ||
    packageValue.executionId !== "strict-blind-replication-series-v1.execution-01" ||
    packageValue.providerCalls !== 0 ||
    packageValue.productionMutationState !== "NONE" ||
    sha256Bytes(authorizationBytes) !== packageValue.authorizationSha256 ||
    JSON.stringify(packageValue.authorizedCases) !== JSON.stringify(CASE_ORDER) ||
    packageValue.cases.length !== CASE_ORDER.length
  ) {
    throw new Error("SERIES_RESULT_IDENTITY_INVALID");
  }
  if (
    packageValue.frozenIdentity.preregistrationSha256 !== frozenArtifacts.expectedPreregistrationSha256 ||
    packageValue.frozenIdentity.workerEnvelopeSha256 !== frozenArtifacts.expectedWorkerEnvelopeSha256 ||
    JSON.stringify(packageValue.frozenIdentity.payloadSha256) !== JSON.stringify(frozenArtifacts.expectedPayloadSha256)
  ) {
    throw new Error("SERIES_FROZEN_IDENTITY_INVALID");
  }
  const preregistration = readJson<{
    structuralControllers: Array<{
      replicationSlot: (typeof CASE_ORDER)[number];
      targetWord: string;
      targetSenseId: string;
      targetSenseDefinition: string;
    }>;
  }>(frozenArtifacts.preregistrationPath);
  for (const [index, slot] of CASE_ORDER.entries()) {
    verifyStrictBlindExecutionAuthorizationV1(authorization, frozenArtifacts, slot);
    const controller = preregistration.structuralControllers.find(
      (candidate) => candidate.replicationSlot === slot,
    );
    if (!controller) throw new Error(`TARGET_REVEAL_RECORD_MISSING:${slot}`);
    assertCaseRecord(packageValue.cases[index], slot, {
      targetWord: controller.targetWord,
      targetSenseId: controller.targetSenseId,
      targetSenseLabel: controller.targetSenseDefinition,
    });
  }
  const classifications = packageValue.cases.map(
    (entry) => entry.result.postRevealEvaluation?.classification ?? "CONTAMINATED",
  );
  const expectedSummary = {
    validCaseCount: packageValue.cases.filter((entry) => !entry.result.contamination.contaminated).length,
    positiveCount: classifications.filter((value) => value === "FUNCTIONAL_CORRESPONDENCE").length,
    nullCount: classifications.filter((value) => value === "NULL").length,
    insufficientCount: classifications.filter((value) => value === "INSUFFICIENT_CORRESPONDENCE").length,
    sourceUnavailableCount: classifications.filter((value) => value === "SOURCE_UNAVAILABLE").length,
    contaminatedCount: packageValue.cases.filter((entry) => entry.result.contamination.contaminated).length,
    classifications,
  };
  if (JSON.stringify(packageValue.summary) !== JSON.stringify(expectedSummary)) {
    throw new Error("SERIES_SUMMARY_MISMATCH");
  }
  return {
    status: "PASS",
    caseCount: packageValue.cases.length,
    providerCalls: packageValue.providerCalls,
    productionMutationState: packageValue.productionMutationState,
  };
}

if (process.argv[1]?.endsWith("openInstrumentStrictBlindReplicationSeriesV1ExecutionVerification.v1.ts")) {
  console.log(JSON.stringify(verifyStrictBlindReplicationSeriesExecutionPackageV1(), null, 2));
}
