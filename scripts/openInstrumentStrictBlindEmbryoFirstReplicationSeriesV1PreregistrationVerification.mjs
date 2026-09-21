import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dir = resolve(root, "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1");
const artifactPath = resolve(dir, "preregistration.json");
const manifestPath = resolve(dir, "hash-manifest.json");

const EXPECTED_BASELINE_SHA = "12a92a4fe5faec0516b30d3a7e86e75924f9c68349b905a2c07d61289d406650";
const EXPECTED_CORPUS_SHA = "d2459e58b7e61e125afb8d1ab894e04b7b21d1d66fe0eebdcacf69ed10ca2d2f";
const EXPECTED_M7_PREREG_SHA = "54d579f1af4bb597ccb4037d156dc27123742b487845ecd52fc80d84cc69cd3e";
const EXPECTED_SOURCE_TRADITIONS = ["fjale.fjalor-shqip.v0_1", "scaife.lewis-short.v0_1", "scaife.middle-liddell.v0_1"];
const EXPECTED_OUTCOMES = ["FUNCTIONAL_CORRESPONDENCE", "LEXICAL_EQUIVALENCE", "FORM_RESEMBLANCE_ONLY", "HISTORICAL_RELATION_ONLY", "INSUFFICIENT_CORRESPONDENCE", "NULL"];
const FORBIDDEN_PAYLOAD_KEYS = new Set(["targetWord", "partOfSpeech", "targetSenseId", "targetSenseDefinition", "targetSenseLocator", "expansionChain", "operationIds", "controller", "controllerSha256", "translation", "etymology", "expectedFunction"]);

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const without = (value, key) => Object.fromEntries(Object.entries(value).filter(([name]) => name !== key));

function findForbiddenKeys(value, path = "$") {
  const found = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => found.push(...findForbiddenKeys(item, `${path}[${index}]`)));
    return found;
  }
  if (!value || typeof value !== "object") return found;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_PAYLOAD_KEYS.has(key)) found.push(`${path}.${key}`);
    found.push(...findForbiddenKeys(child, `${path}.${key}`));
  }
  return found;
}

function verifySelection(artifact) {
  const pool = artifact.candidatePoolAuthority.candidatePool;
  const eligible = pool.filter((entry) => entry.status === "ELIGIBLE");
  if (eligible.length !== 8) throw new Error(`eligible pool size mismatch: ${eligible.length}`);
  const selected = artifact.structuralControllers;
  if (selected.length !== 3) throw new Error("selected controller count mismatch");
  const selectedWords = selected.map((controller) => controller.targetWord);
  const expected = ["direct", "synergy", "whole"];
  if (!same(selectedWords, expected)) throw new Error(`selection mismatch: ${selectedWords.join(",")}`);
  const signatures = selected.map((controller) => controller.operationIds.join("+"));
  if (new Set(signatures).size !== 3) throw new Error("selection lacks three distinct operation signatures");
  for (const controller of selected) {
    if (!eligible.some((entry) => entry.word === controller.targetWord)) throw new Error(`selected ineligible target: ${controller.targetWord}`);
    if (controller.structuralSourceKind !== "logic_derived_structural_hypothesis") throw new Error(`controller provenance mismatch: ${controller.targetWord}`);
    const recalculated = sha256(Buffer.from(JSON.stringify(without(controller, "controllerSha256"))));
    if (recalculated !== controller.controllerSha256) throw new Error(`controller hash mismatch: ${controller.targetWord}`);
  }
}

export function verifyStrictBlindEmbryoFirstReplicationSeriesV1Preregistration() {
  const artifactBytes = readFileSync(artifactPath);
  const artifact = JSON.parse(artifactBytes.toString("utf8"));
  const manifest = readJson(manifestPath);
  if (artifact.schemaVersion !== "open-instrument.strict-blind-embryo-first-replication-series-preregistration.v1") throw new Error("schema mismatch");
  if (artifact.experimentId !== "open-instrument-strict-blind-embryo-first-replication-series-v1") throw new Error("experiment identity mismatch");
  if (artifact.status !== "PREREGISTERED_BEFORE_BLIND_RESEARCH") throw new Error("status mismatch");
  if (artifact.series.isM7 !== false || artifact.series.isNewScientificSeries !== true || artifact.series.researchOnly !== true) throw new Error("series boundary mismatch");
  if (artifact.repository.baselineArtifactSha256 !== EXPECTED_BASELINE_SHA || artifact.repository.corpusSha256 !== EXPECTED_CORPUS_SHA) throw new Error("repository artifact identity mismatch");
  if (artifact.historicalStartingState.completedStrictBlindObservations !== 2 || artifact.historicalStartingState.strictPositiveCount !== 0 || artifact.historicalStartingState.m7_02CountedAsCompleted !== false) throw new Error("scientific starting state mismatch");
  if (artifact.positiveCriterion.reusedUnchanged !== true) throw new Error("positive criterion was changed");
  if (artifact.sampleAndStopping.plannedValidNewCases !== 3 || artifact.sampleAndStopping.plannedCompletedStrictN !== 5 || artifact.sampleAndStopping.replacementForbiddenForScientificOutcome !== true) throw new Error("sample or stopping rule mismatch");
  if (!same(artifact.sourceUniverse.traditions.map((tradition) => tradition.id), EXPECTED_SOURCE_TRADITIONS) || artifact.sourceUniverse.noNewTradition !== true) throw new Error("source universe mismatch");
  if (!same(artifact.outcomeSpace, EXPECTED_OUTCOMES)) throw new Error("outcome space mismatch");
  if (!same(artifact.caseIndependence.executionOrder, ["SBR-01", "SBR-02", "SBR-03"])) throw new Error("execution order mismatch");
  if (artifact.protocolIntegrity.sourceResearchPerformed !== false || artifact.protocolIntegrity.blindRunsPerformed !== false || artifact.protocolIntegrity.targetRevealPerformed !== false || artifact.protocolIntegrity.productionEvidenceAdmitted !== false || artifact.protocolIntegrity.selectedAfterSourceResearch !== false) throw new Error("research contamination or promotion flag");
  if (artifact.historicalM7.preregistrationSha256 !== EXPECTED_M7_PREREG_SHA || artifact.historicalM7.reconstructionForbidden !== true) throw new Error("M7 immutability boundary mismatch");

  verifySelection(artifact);

  const payloadResults = artifact.blindPayloads.map((declared) => {
    const bytes = readFileSync(resolve(root, declared.path));
    const payload = JSON.parse(bytes.toString("utf8"));
    if (bytes.byteLength !== declared.rawByteLength || sha256(bytes) !== declared.rawSha256) throw new Error(`blind payload identity mismatch: ${declared.replicationSlot}`);
    const forbidden = findForbiddenKeys(payload);
    if (forbidden.length) throw new Error(`blind payload forbidden key: ${forbidden.join(",")}`);
    const controller = artifact.structuralControllers.find((item) => item.replicationSlot === declared.replicationSlot);
    if (!controller || payload.replicationSlot !== declared.replicationSlot || payload.embryo !== controller.embryo || !same(payload.voicePath, controller.voicePath)) throw new Error(`blind payload controller mismatch: ${declared.replicationSlot}`);
    for (const forbiddenText of [controller.targetWord, controller.targetSenseId, controller.targetSenseDefinition, controller.targetSenseLocator]) {
      if (bytes.toString("utf8").toLowerCase().includes(forbiddenText.toLowerCase())) throw new Error(`blind payload target leakage: ${declared.replicationSlot}`);
    }
    if (payload.targetRevealStatus !== "FORBIDDEN_UNTIL_DURABILITY_GATE") throw new Error(`blind reveal boundary mismatch: ${declared.replicationSlot}`);
    return { replicationSlot: declared.replicationSlot, byteLength: bytes.byteLength, sha256: sha256(bytes) };
  });

  const baselineBytes = readFileSync(resolve(root, artifact.repository.baselineArtifactPath));
  if (sha256(baselineBytes) !== EXPECTED_BASELINE_SHA) throw new Error("baseline artifact changed");
  const m7Bytes = readFileSync(resolve(root, artifact.historicalM7.preregistrationPath));
  if (sha256(m7Bytes) !== EXPECTED_M7_PREREG_SHA) throw new Error("historical M7 preregistration changed");
  const manifestArtifactSha = sha256(artifactBytes);
  if (manifest.artifactByteLength !== artifactBytes.byteLength || manifest.artifactSha256 !== manifestArtifactSha) throw new Error("preregistration manifest mismatch");
  if (!same(manifest.controllerSha256, artifact.structuralControllers.map((controller) => controller.controllerSha256))) throw new Error("controller manifest mismatch");
  if (!same(manifest.blindPayloadSha256, payloadResults.map((payload) => payload.sha256))) throw new Error("blind payload manifest mismatch");
  return { artifactByteLength: artifactBytes.byteLength, artifactSha256: manifestArtifactSha, selectedWords: artifact.structuralControllers.map((controller) => controller.targetWord), payloadResults };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(verifyStrictBlindEmbryoFirstReplicationSeriesV1Preregistration()));
