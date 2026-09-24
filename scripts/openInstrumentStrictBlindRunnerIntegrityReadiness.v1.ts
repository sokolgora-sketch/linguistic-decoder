import { rmSync } from "node:fs";
import { join } from "node:path";

import {
  STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1,
  STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_INTEGRITY_V1,
  createStrictBlindIntegrityTempDirectoryV1,
  runStrictBlindIntegritySyntheticCaseV1,
  verifyStrictBlindIntegrityPackageV1,
  type StrictBlindIntegritySyntheticSourceAccessV1,
  type SyntheticSourceResultV1,
} from "../src/shared/openInstrument/strictBlindRunnerIntegrity.v1";
import {
  defaultStrictBlindArtifactPathsV1,
  verifyStrictBlindFrozenArtifactsV1,
} from "../src/shared/openInstrument/strictBlindReplicationRunner.v1";

const sourceTraditions = [
  "fjale.fjalor-shqip.v0_1",
  "scaife.lewis-short.v0_1",
  "scaife.middle-liddell.v0_1",
];
const searchStages = [
  "S0 exact embryo",
  "S1 identity-preserving normalization",
  "S2 source-attested bounded morphology",
  "S3 source-attested dialect/history",
  "S4 authoritative reconstruction",
];

function syntheticSourceAccess(): StrictBlindIntegritySyntheticSourceAccessV1 {
  const results: SyntheticSourceResultV1[] = [];
  for (const sourceTraditionId of sourceTraditions) {
    for (const stage of searchStages) {
      results.push({
        sourceTraditionId,
        stage,
        queryForm: "SYNTHETIC_EMBRYO",
        result: "NOT_FOUND",
      });
    }
  }
  return {
    mode: STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1,
    results,
  };
}

async function main(): Promise<void> {
  const root = process.cwd();
  const frozenArtifacts = defaultStrictBlindArtifactPathsV1(root);
  const frozen = verifyStrictBlindFrozenArtifactsV1(frozenArtifacts, "SBR-01");
  const artifactDirectory = createStrictBlindIntegrityTempDirectoryV1(
    "open-instrument-strict-blind-readiness-",
  );
  try {
    const result = await runStrictBlindIntegritySyntheticCaseV1({
      replicationSlot: "SBR-01",
      caseOpaqueId: "synthetic.integrity.readiness.v1",
      frozenArtifacts,
      structuralInput: { embryo: frozen.payloadEmbryo, voicePath: frozen.payloadVoicePath },
      sourceAccess: syntheticSourceAccess(),
      artifactDirectory,
      workerDecision: { kind: "NULL", reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE" },
      target: {
        targetWord: "synthetic-target",
        targetSenseId: "synthetic-sense",
        targetSenseLabel: "synthetic target sense",
      },
      evaluateAfterReveal() {
        return {
          classification: "NULL",
          reasonCode: "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE",
          targetBinding: "MATCHED",
          functionalMechanism: null,
          evidenceBeyondGloss: false,
          structuralRelationStatus: "NONE",
        };
      },
    });
    const packageVerification = verifyStrictBlindIntegrityPackageV1({
      packagePath: join(artifactDirectory, "result-package.json"),
      durabilityDirectory: artifactDirectory,
      authorizationDirectory: join(artifactDirectory, "authorization"),
      frozenArtifacts,
      replicationSlot: "SBR-01",
    });
    const checks = {
      frozenHashesMatch: true,
      workerIsolationVerified: result.workerIsolation.workerContext === "worker_thread" &&
        result.workerIsolation.targetFieldsReceived === false &&
        result.workerIsolation.crossCaseContextReceived === false,
      sourceAccessProvenanceVerified: result.sourceAccess.acquisitionMode ===
        STRICT_BLIND_INTEGRITY_ACQUISITION_MODE_V1,
      externalDurabilityRecoveryVerified: result.durability.independentlyRecovered,
      atomicAuthorizationVerified: result.authorization.state === "COMPLETED",
      standaloneVerifierVerified: packageVerification.status === "PASS",
      failClosedProductionFirewall: result.productionMutationState === "NONE" && result.providerCalls === 0,
      realExecutionLockActive: STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_INTEGRITY_V1 === false,
    };
    const ready = Object.values(checks).every(Boolean);
    console.log(JSON.stringify({
      status: ready
        ? "READY_FOR_STRICT_BLIND_RUNNER_INTEGRITY_REPAIR"
        : "NOT_READY_FOR_STRICT_BLIND_RUNNER_INTEGRITY_REPAIR",
      checks,
      realExecutionAuthorized: false,
      providerCalls: 0,
      productionMutationState: "NONE",
      syntheticOnly: true,
    }, null, 2));
  } finally {
    rmSync(artifactDirectory, { recursive: true, force: true });
  }
}

void main();
