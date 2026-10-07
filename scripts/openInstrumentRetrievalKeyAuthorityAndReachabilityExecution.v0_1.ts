import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { getLatinLexicalSubstrateRecordsV0_1 } from "@/shared/openInstrument/latinLexicalSubstrate.v0_1";
import { getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2 } from "@/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2";

const ROOT = process.cwd();
const PROCEDURE_RELATIVE_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-v0.1/procedure.json";
const PROCEDURE_MANIFEST_RELATIVE_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-v0.1/hash-manifest.json";
const ARTIFACT_DIRECTORY_RELATIVE_PATH =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-retrieval-key-authority-and-reachability-execution-v0.1";
const RESULT_RELATIVE_PATH = `${ARTIFACT_DIRECTORY_RELATIVE_PATH}/result.json`;
const RESULT_MANIFEST_RELATIVE_PATH = `${ARTIFACT_DIRECTORY_RELATIVE_PATH}/hash-manifest.json`;
const STARTING_HEAD = "e43a994e14e33aefa4459ba042f47b42dcb79385";
const PROCEDURE_BASELINE_HEAD = "0abf2ee7371773db65679cf5a50040de9887e94a";
const PROCEDURE_SHA256 = "353f036165c1efeaecd9d0485cd485eb18094afe67d1fc451ecd725ae8c20879";
const PROCEDURE_MANIFEST_SHA256 = "436b0c92306102ca3df8d59098916b08e93404d7b9809069e0abffa72dce8b16";
const S3_RESULT_SHA256 = "b703051f8d6020548f93dc9a6591b22278f467bb0c521871b31aafb47be4ca03";
const BROADER_RESULT_SHA256 = "51019087d2199f8506267c3e6a4fbdb8824962641a6ed49abaa7e2c7bcc59ee6";
const S0_BASELINE_SHA256 = "52fd4865fd3a0eb2067ea460af7d75024948de5c56cbcc8ce9936361a591a58e";

type FrozenRecord = {
  sourceRecordId: string;
  sourceForm: string;
  currentLookupForm: string;
  proposedRetrievalKey: string;
  sourceTradition: string;
  citationIds: string[];
  attestation: string;
  sourceStatus: string;
  transformationApplied: string;
  transformationReason: string;
  collisionStatus: string;
};

type FrozenProcedure = {
  status: string;
  procedureId: string;
  repositoryBaselineHead: string;
  authorityDecision: {
    currentDecision: string;
    gate: {
      decisionOrder: string[];
      currentEvidence: {
        explicitSourceTraditionAuthorization: boolean;
        explicitSourceTraditionProhibition: boolean;
        operatorCoverage: string;
        sourceTruthInvariants: string;
        collisionPolicyFrozen: string;
        currentDecision: string;
      };
      postFreezeEvidenceMayChangeDecision: boolean;
      decisionMustBeReboundByNewProcedureVersion: boolean;
    };
    runtimeCanonicalizationAuthorized: boolean;
    currentMatchingChanged: boolean;
    s4Started: boolean;
  };
  operator: {
    operatorId: string;
    status: string;
    selectedOption: string;
  };
  decisionClasses?: Record<string, string>;
  latinTestSet: {
    recordCount: number;
    currentAsciiCount: number;
    currentDiacriticCount: number;
    records: FrozenRecord[];
  };
  priorResults: {
    s3ResultSha256: string;
    broaderResultSha256: string;
  };
  executionFirewall: {
    authoritativeAttempts: number;
    authoritativeAttemptsMax: number;
    resultArtifactCreated: boolean;
    s3Rerun: boolean;
    broaderDiagnosticRerun: boolean;
    s4Started: boolean;
  };
};

type FrozenManifest = {
  status: string;
  procedureId: string;
  repositoryBaselineHead: string;
  artifacts: Array<{ path: string; bytes: number; sha256: string }>;
  execution: {
    authoritativeAttempts: number;
    authoritativeAttemptsMax: number;
    resultArtifactCreated: boolean;
    s3Rerun: boolean;
    broaderDiagnosticRerun: boolean;
    s4Started: boolean;
  };
};

const absolute = (relativePath: string) => path.join(ROOT, relativePath);

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(absolute(relativePath), "utf8")) as T;
}

function sha256Bytes(bytes: Buffer | string): string {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function sha256File(relativePath: string): string {
  return sha256Bytes(fs.readFileSync(absolute(relativePath)));
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function writeJson(relativePath: string, value: unknown): void {
  fs.writeFileSync(absolute(relativePath), stableJson(value), "utf8");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function deriveAuthorityGate(procedure: FrozenProcedure): "AUTHORIZED" | "NOT_AUTHORIZED" | "INSUFFICIENT_EVIDENCE" {
  const evidence = procedure.authorityDecision.gate.currentEvidence;
  const invariantsPass = [
    evidence.operatorCoverage,
    evidence.sourceTruthInvariants,
    evidence.collisionPolicyFrozen,
  ].every((value) => value === "PASS");

  if (evidence.explicitSourceTraditionAuthorization && invariantsPass) return "AUTHORIZED";
  if (evidence.explicitSourceTraditionProhibition || !invariantsPass) return "NOT_AUTHORIZED";
  return "INSUFFICIENT_EVIDENCE";
}

function actualLatinIdentity(procedure: FrozenProcedure) {
  const actual = [
    ...getLatinLexicalSubstrateRecordsV0_1(),
    ...getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2(),
  ];
  const frozenById = new Map(procedure.latinTestSet.records.map((record) => [record.sourceRecordId, record]));
  const identity = actual
    .map((record) => {
      const frozen = frozenById.get(record.sourceRecordId);
      assert(frozen, `Latin record is not frozen: ${record.sourceRecordId}`);
      assert(frozen.sourceForm === record.sourceForm, `sourceForm changed: ${record.sourceRecordId}`);
      assert(frozen.currentLookupForm === record.lookupForm, `lookupForm changed: ${record.sourceRecordId}`);
      assert(frozen.sourceTradition === record.sourceTraditionId, `source tradition changed: ${record.sourceRecordId}`);
      assert(frozen.citationIds.length === 1 && frozen.citationIds[0] === record.citation.citationId, `citation changed: ${record.sourceRecordId}`);
      assert(frozen.attestation === record.attestationTruth, `attestation changed: ${record.sourceRecordId}`);
      assert(frozen.sourceStatus === record.sourceStatus, `source status changed: ${record.sourceRecordId}`);
      assert(Boolean(record.gloss), `gloss missing: ${record.sourceRecordId}`);
      return {
        sourceRecordId: record.sourceRecordId,
        sourceForm: record.sourceForm,
        currentLookupForm: record.lookupForm,
        sourceTradition: record.sourceTraditionId,
        citationIds: [record.citation.citationId],
        attestation: record.attestationTruth,
        sourceStatus: record.sourceStatus,
        glossPresent: true,
      };
    })
    .sort((a, b) => a.sourceRecordId.localeCompare(b.sourceRecordId));

  assert(actual.length === 21, `Expected 21 Latin records, received ${actual.length}`);
  assert(procedure.latinTestSet.recordCount === 21, "Frozen Latin record count changed");
  return {
    recordCount: actual.length,
    currentAsciiCount: actual.filter((record) => /^[A-Z]+$/.test(record.lookupForm)).length,
    currentDiacriticCount: actual.filter((record) => !/^[A-Z]+$/.test(record.lookupForm)).length,
    identitySha256: sha256Bytes(stableJson(actual)),
  };
}

function verifyFrozenInputs(): { procedure: FrozenProcedure; manifest: FrozenManifest; latinIdentity: ReturnType<typeof actualLatinIdentity> } {
  assert(sha256File(PROCEDURE_RELATIVE_PATH) === PROCEDURE_SHA256, "Frozen procedure hash mismatch");
  assert(sha256File(PROCEDURE_MANIFEST_RELATIVE_PATH) === PROCEDURE_MANIFEST_SHA256, "Frozen procedure manifest hash mismatch");

  const procedure = readJson<FrozenProcedure>(PROCEDURE_RELATIVE_PATH);
  const manifest = readJson<FrozenManifest>(PROCEDURE_MANIFEST_RELATIVE_PATH);
  assert(procedure.status === "DEFINED_NOT_EXECUTED", "Frozen procedure status is not DEFINED_NOT_EXECUTED");
  assert(procedure.repositoryBaselineHead === PROCEDURE_BASELINE_HEAD, "Frozen procedure baseline head mismatch");
  assert(procedure.authorityDecision.currentDecision === "INSUFFICIENT_EVIDENCE", "Frozen authority decision mismatch");
  assert(procedure.authorityDecision.gate.currentEvidence.currentDecision === "INSUFFICIENT_EVIDENCE", "Frozen current evidence decision mismatch");
  assert(!procedure.authorityDecision.gate.currentEvidence.explicitSourceTraditionAuthorization, "Unexpected frozen authorization");
  assert(!procedure.authorityDecision.gate.currentEvidence.explicitSourceTraditionProhibition, "Unexpected frozen prohibition");
  assert(procedure.authorityDecision.gate.currentEvidence.operatorCoverage === "PASS", "Frozen operator coverage mismatch");
  assert(procedure.authorityDecision.gate.currentEvidence.sourceTruthInvariants === "PASS", "Frozen source truth invariant mismatch");
  assert(procedure.authorityDecision.gate.currentEvidence.collisionPolicyFrozen === "PASS", "Frozen collision policy mismatch");
  assert(!procedure.authorityDecision.gate.postFreezeEvidenceMayChangeDecision, "Post-freeze authority change is enabled");
  assert(procedure.authorityDecision.gate.decisionMustBeReboundByNewProcedureVersion, "New procedure rebinding requirement missing");
  assert(procedure.executionFirewall.authoritativeAttempts === 0, "Frozen attempt count is not zero");
  assert(procedure.executionFirewall.authoritativeAttemptsMax === 1, "Frozen attempt maximum mismatch");
  assert(!procedure.executionFirewall.resultArtifactCreated, "Frozen procedure already has a result");
  assert(!procedure.executionFirewall.s3Rerun, "Frozen procedure permits S3 rerun");
  assert(!procedure.executionFirewall.broaderDiagnosticRerun, "Frozen procedure permits broader rerun");
  assert(!procedure.executionFirewall.s4Started, "Frozen procedure has S4 started");
  assert(manifest.status === "DEFINED_NOT_EXECUTED", "Frozen manifest status mismatch");
  assert(manifest.repositoryBaselineHead === PROCEDURE_BASELINE_HEAD, "Frozen manifest baseline head mismatch");
  assert(manifest.execution.authoritativeAttempts === 0, "Frozen manifest attempt count is not zero");
  assert(manifest.execution.authoritativeAttemptsMax === 1, "Frozen manifest attempt maximum mismatch");
  assert(!manifest.execution.resultArtifactCreated, "Frozen manifest already has a result");
  assert(!manifest.execution.s3Rerun && !manifest.execution.broaderDiagnosticRerun && !manifest.execution.s4Started, "Frozen manifest firewall mismatch");
  assert(sha256File("docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1/paired-results.json") === S3_RESULT_SHA256, "S3 result changed");
  assert(sha256File("docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/results.json") === BROADER_RESULT_SHA256, "Broader result changed");
  assert(sha256File("docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/baseline.json") === S0_BASELINE_SHA256, "S0 baseline changed");

  return { procedure, manifest, latinIdentity: actualLatinIdentity(procedure) };
}

function createResult(): void {
  const resultPath = absolute(RESULT_RELATIVE_PATH);
  const resultManifestPath = absolute(RESULT_MANIFEST_RELATIVE_PATH);
  assert(!fs.existsSync(resultPath), "Authoritative result already exists; rerun is forbidden");
  assert(!fs.existsSync(resultManifestPath), "Result manifest already exists; rerun is forbidden");

  const { procedure, latinIdentity } = verifyFrozenInputs();
  const authorityGate = deriveAuthorityGate(procedure);
  assert(authorityGate === procedure.authorityDecision.currentDecision, "Authority gate derivation differs from frozen decision");
  assert(authorityGate !== "AUTHORIZED", "Frozen authority unexpectedly authorizes Arm B; stop for review");

  fs.mkdirSync(path.dirname(resultPath), { recursive: true });

  const result = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-v0.2.retrieval-key-authority-and-reachability-execution-result.v0.1",
    status: "PROCEDURE_EXECUTED",
    procedureId: procedure.procedureId,
    procedureSha256: PROCEDURE_SHA256,
    procedureManifestSha256: PROCEDURE_MANIFEST_SHA256,
    repositoryStartingHead: STARTING_HEAD,
    repositoryExecutionHead: STARTING_HEAD,
    authoritativeAttemptsBefore: 0,
    authoritativeAttempts: 1,
    authoritativeAttemptsMax: 1,
    noRerun: true,
    syntheticOnly: true,
    realDataExecuted: false,
    providerExecution: false,
    sourceAcquisition: false,
    sourceReattestation: false,
    authorityGate: {
      decision: authorityGate,
      currentEvidence: procedure.authorityDecision.gate.currentEvidence,
      postFreezeEvidenceMayChangeDecision: procedure.authorityDecision.gate.postFreezeEvidenceMayChangeDecision,
      decisionMustBeReboundByNewProcedureVersion: procedure.authorityDecision.gate.decisionMustBeReboundByNewProcedureVersion,
      derivedFromFrozenProcedureOnly: true,
    },
    operator: {
      operatorId: procedure.operator.operatorId,
      selectedOption: procedure.operator.selectedOption,
      status: procedure.operator.status,
      runtimeAuthorized: false,
    },
    latinTestSet: {
      recordCount: latinIdentity.recordCount,
      currentAsciiCount: latinIdentity.currentAsciiCount,
      currentDiacriticCount: latinIdentity.currentDiacriticCount,
      identitySha256: latinIdentity.identitySha256,
      sourceRecordsChanged: false,
      citationsChanged: false,
      provenanceChanged: false,
    },
    arms: {
      ARM_A: {
        status: "NOT_EXECUTED_AUTHORITY_GATE_TERMINATED",
        representation: "CURRENT_UPPERCASE_NFC_IDENTITY",
        scientificReachabilityExecuted: false,
        reachabilityMetrics: null,
      },
      ARM_B: {
        status: "NOT_AUTHORIZED",
        scientificReachabilityExecuted: false,
        reachabilityMetrics: null,
        reason: "AUTHORITY_GATE_INSUFFICIENT_EVIDENCE",
      },
    },
    interpretation: {
      class: "CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE",
      definition: procedure.decisionClasses?.CLASS_E ?? "OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE",
      canonicalizationHypothesisStatus: "CLOSED_UNSUPPORTED_BY_FROZEN_AUTHORITY",
      established: [
        "The frozen evidence does not authorize the candidate Latin retrieval-key operator.",
        "Arm B was not scientifically executed.",
        "Current runtime retrieval and matching remain unchanged.",
      ],
      notEstablished: [
        "Canonicalization would fail to increase Latin reachability.",
        "Canonicalization would succeed.",
        "Latin is linguistically irrelevant.",
        "Any historical, functional, semantic, pronunciation, or etymological claim.",
      ],
    },
    integrity: {
      sourceFormMutated: false,
      citationMutated: false,
      glossMutated: false,
      attestationMutated: false,
      provenanceMutated: false,
      queryGenerationChanged: false,
      normalizationChanged: false,
      matchingChanged: false,
      newSource: false,
      newLanguage: false,
      s3Rerun: false,
      broaderDiagnosticRerun: false,
      s4Started: false,
    },
    priorResults: {
      s3ResultSha256: S3_RESULT_SHA256,
      broaderResultSha256: BROADER_RESULT_SHA256,
    },
    nextAction: "REVIEW_V0_2_SUBSTRATE_SOURCE_ARCHITECTURE_AFTER_CLASS_E",
  };

  writeJson(RESULT_RELATIVE_PATH, result);
  const resultSha256 = sha256File(RESULT_RELATIVE_PATH);
  const resultBytes = fs.statSync(resultPath).size;
  const manifest = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-v0.2.retrieval-key-authority-and-reachability-execution-hash-manifest.v0.1",
    status: "COMPLETED_RESULT_BINDINGS",
    procedureId: procedure.procedureId,
    repositoryExecutionHead: STARTING_HEAD,
    procedure: { path: PROCEDURE_RELATIVE_PATH, sha256: PROCEDURE_SHA256 },
    procedureManifest: { path: PROCEDURE_MANIFEST_RELATIVE_PATH, sha256: PROCEDURE_MANIFEST_SHA256 },
    artifacts: [{ path: RESULT_RELATIVE_PATH, bytes: resultBytes, sha256: resultSha256 }],
    authorityBindings: {
      s3Result: S3_RESULT_SHA256,
      broaderResult: BROADER_RESULT_SHA256,
      s0Baseline: S0_BASELINE_SHA256,
      latinTestSetIdentity: latinIdentity.identitySha256,
    },
    execution: {
      authoritativeAttemptsBefore: 0,
      authoritativeAttempts: 1,
      authoritativeAttemptsMax: 1,
      noRerun: true,
      armBExecuted: false,
      syntheticOnly: true,
      realDataExecuted: false,
      providerExecution: false,
      s3Rerun: false,
      broaderDiagnosticRerun: false,
      s4Started: false,
    },
    outcome: {
      authorityGate: authorityGate,
      armAStatus: "NOT_EXECUTED_AUTHORITY_GATE_TERMINATED",
      armBStatus: "NOT_AUTHORIZED",
      interpretationClass: "CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE",
      nextAction: "REVIEW_V0_2_SUBSTRATE_SOURCE_ARCHITECTURE_AFTER_CLASS_E",
    },
  };
  writeJson(RESULT_MANIFEST_RELATIVE_PATH, manifest);
  console.log(JSON.stringify({ resultPath: RESULT_RELATIVE_PATH, resultBytes, resultSha256, manifestPath: RESULT_MANIFEST_RELATIVE_PATH, manifestSha256: sha256File(RESULT_MANIFEST_RELATIVE_PATH), authorityGate, interpretationClass: "CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE" }, null, 2));
}

function repairStoredSerializationMetadata(): void {
  const { latinIdentity } = verifyFrozenInputs();
  const result = readJson<any>(RESULT_RELATIVE_PATH);
  const manifest = readJson<any>(RESULT_MANIFEST_RELATIVE_PATH);
  assert(result.authoritativeAttempts === 1, "Stored result attempt count is not one");
  assert(result.authorityGate?.decision === "INSUFFICIENT_EVIDENCE", "Stored result authority gate changed");
  assert(result.arms?.ARM_B?.scientificReachabilityExecuted === false, "Arm B was executed");
  result.latinTestSet.currentAsciiCount = latinIdentity.currentAsciiCount;
  result.latinTestSet.currentDiacriticCount = latinIdentity.currentDiacriticCount;
  result.postResultDeterministicRepair = {
    kind: "SERIALIZATION_METADATA_ONLY",
    fields: ["latinTestSet.currentAsciiCount", "latinTestSet.currentDiacriticCount"],
    scientificProcedureReexecuted: false,
    armAReexecuted: false,
    armBReexecuted: false,
  };
  writeJson(RESULT_RELATIVE_PATH, result);
  const resultSha256 = sha256File(RESULT_RELATIVE_PATH);
  manifest.artifacts = manifest.artifacts.map((artifact: any) => artifact.path === RESULT_RELATIVE_PATH
    ? { ...artifact, bytes: fs.statSync(absolute(RESULT_RELATIVE_PATH)).size, sha256: resultSha256 }
    : artifact);
  manifest.postResultDeterministicRepair = {
    kind: "SERIALIZATION_METADATA_ONLY",
    scientificProcedureReexecuted: false,
  };
  writeJson(RESULT_MANIFEST_RELATIVE_PATH, manifest);
  console.log(JSON.stringify({ resultSha256, manifestSha256: sha256File(RESULT_MANIFEST_RELATIVE_PATH), scientificProcedureReexecuted: false }, null, 2));
}

export function verifyStoredResult(): { resultSha256: string; manifestSha256: string } {
  const { procedure, latinIdentity } = verifyFrozenInputs();
  const result = readJson<any>(RESULT_RELATIVE_PATH);
  const manifest = readJson<any>(RESULT_MANIFEST_RELATIVE_PATH);
  const resultSha256 = sha256File(RESULT_RELATIVE_PATH);
  const manifestSha256 = sha256File(RESULT_MANIFEST_RELATIVE_PATH);
  assert(result.status === "PROCEDURE_EXECUTED", "Stored result status mismatch");
  assert(result.procedureId === procedure.procedureId, "Stored result procedure binding mismatch");
  assert(result.procedureSha256 === PROCEDURE_SHA256, "Stored result procedure hash mismatch");
  assert(result.procedureManifestSha256 === PROCEDURE_MANIFEST_SHA256, "Stored result procedure manifest hash mismatch");
  assert(result.authoritativeAttemptsBefore === 0 && result.authoritativeAttempts === 1 && result.authoritativeAttemptsMax === 1, "Stored result attempt accounting mismatch");
  assert(result.noRerun === true && result.syntheticOnly === true && result.realDataExecuted === false, "Stored result execution flags mismatch");
  assert(result.authorityGate.decision === "INSUFFICIENT_EVIDENCE", "Stored authority gate mismatch");
  assert(result.latinTestSet.recordCount === 21 && result.latinTestSet.currentAsciiCount === 13 && result.latinTestSet.currentDiacriticCount === 8, "Stored Latin partition mismatch");
  assert(result.latinTestSet.identitySha256 === latinIdentity.identitySha256, "Stored Latin identity binding mismatch");
  assert(result.authorityGate.derivedFromFrozenProcedureOnly === true, "Stored authority derivation binding missing");
  assert(result.arms.ARM_A.scientificReachabilityExecuted === false, "Arm A unexpectedly executed");
  assert(result.arms.ARM_B.status === "NOT_AUTHORIZED" && result.arms.ARM_B.scientificReachabilityExecuted === false, "Arm B execution mismatch");
  assert(result.arms.ARM_B.reachabilityMetrics === null, "Hypothetical Arm B metrics were fabricated");
  assert(result.interpretation.class === "CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE", "Stored class mismatch");
  assert(result.nextAction === "REVIEW_V0_2_SUBSTRATE_SOURCE_ARCHITECTURE_AFTER_CLASS_E", "Stored next action mismatch");
  assert(result.integrity.queryGenerationChanged === false && result.integrity.normalizationChanged === false && result.integrity.matchingChanged === false, "Runtime integrity mismatch");
  assert(sha256File(PROCEDURE_RELATIVE_PATH) === result.procedureSha256, "Procedure changed after result creation");
  assert(sha256File(PROCEDURE_MANIFEST_RELATIVE_PATH) === result.procedureManifestSha256, "Procedure manifest changed after result creation");
  assert(manifest.procedure.sha256 === PROCEDURE_SHA256 && manifest.procedureManifest.sha256 === PROCEDURE_MANIFEST_SHA256, "Result manifest authority mismatch");
  assert(manifest.authorityBindings.latinTestSetIdentity === latinIdentity.identitySha256, "Result manifest Latin identity binding mismatch");
  assert(manifest.artifacts.some((artifact: any) => artifact.path === RESULT_RELATIVE_PATH && artifact.bytes === fs.statSync(absolute(RESULT_RELATIVE_PATH)).size && artifact.sha256 === resultSha256), "Result manifest artifact binding mismatch");
  assert(manifest.execution.authoritativeAttempts === 1 && manifest.execution.noRerun === true && manifest.execution.armBExecuted === false, "Result manifest execution mismatch");
  assert(manifest.outcome.authorityGate === "INSUFFICIENT_EVIDENCE" && manifest.outcome.interpretationClass === "CLASS_E_OPERATOR_NOT_AUTHORIZED_OR_NOT_SCIENTIFICALLY_DEFENSIBLE", "Result manifest outcome mismatch");
  return { resultSha256, manifestSha256 };
}

const entryPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (entryPath === path.resolve(fileURLToPath(import.meta.url))) {
  const mode = process.argv[2];
  if (mode === "--execute") createResult();
  else if (mode === "--repair-serialization") repairStoredSerializationMetadata();
  else if (mode === "--verify") console.log(JSON.stringify({ verified: true, ...verifyStoredResult() }, null, 2));
  else throw new Error("Usage: tsx scripts/openInstrumentRetrievalKeyAuthorityAndReachabilityExecution.v0_1.ts --execute|--repair-serialization|--verify");
}
