import {
  InMemoryStrictBlindDurabilityStoreV1,
  STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_V1,
  STRICT_BLIND_FROZEN_BASELINE_ARTIFACT_PATH_V1,
  STRICT_BLIND_FROZEN_BASELINE_ARTIFACT_SHA256_V1,
  buildStrictBlindReadinessReportV1,
  defaultStrictBlindArtifactPathsV1,
  runStrictBlindSyntheticCaseV1,
  verifyStrictBlindFrozenArtifactsV1,
  verifyStrictBlindFrozenBaselineMetadataV1,
} from "../src/shared/openInstrument/strictBlindReplicationRunner.v1";

const root = process.cwd();
const paths = defaultStrictBlindArtifactPathsV1(root);
const frozen01 = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-01");
const frozen02 = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-02");
const frozen03 = verifyStrictBlindFrozenArtifactsV1(paths, "SBR-03");
const frozenBaseline = verifyStrictBlindFrozenBaselineMetadataV1(paths);
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
  frozenBaselineIdentityVerified:
    frozenBaseline.artifactPath === STRICT_BLIND_FROZEN_BASELINE_ARTIFACT_PATH_V1 &&
    frozenBaseline.artifactSha256 === STRICT_BLIND_FROZEN_BASELINE_ARTIFACT_SHA256_V1 &&
    frozen01.baselineArtifactPath === frozenBaseline.artifactPath &&
    frozen01.baselineArtifactSha256 === frozenBaseline.artifactSha256,
  runnerTestsPass: synthetic.productionMutationState === "NONE" && synthetic.reveal.allowed,
  realExecutionLockActive: true,
  realSourceAcquisitionReady: false,
  productionFirewallActive: synthetic.productionMutationState === "NONE",
  durabilityGateActive: synthetic.durability.passed,
  revealGateActive: synthetic.reveal.allowed,
});
console.log(JSON.stringify({
  ...report,
  realSbrExecutionAuthorized: STRICT_BLIND_REAL_EXECUTION_AUTHORIZED_V1,
  sbrExecuted: false,
  frozenBaselineMetadata: frozenBaseline,
}, null, 2));
