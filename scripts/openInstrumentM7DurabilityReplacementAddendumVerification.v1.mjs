import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const addendumPath = resolve(root, "docs/open-instrument/research-artifacts/m7-three-case-replication-v1/durability-replacement-addendum.v1.json");
const preregistrationPath = resolve(root, "docs/open-instrument/research-artifacts/m7-three-case-replication-v1/preregistration.json");
const hashManifestPath = resolve(root, "docs/open-instrument/research-artifacts/m7-three-case-replication-v1/hash-manifest.json");

const EXPECTED_EXPERIMENT_ID = "open-instrument-m7-three-case-replication-v1";
const EXPECTED_PREREGISTRATION_BYTES = 24321;
const EXPECTED_PREREGISTRATION_SHA256 = "54d579f1af4bb597ccb4037d156dc27123742b487845ecd52fc80d84cc69cd3e";
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
const EXPECTED_REPLACEMENTS = [
  {
    id: "open-instrument-m7-three-case-replication-v1:M7-02-REPLACEMENT-02",
    slot: "M7-02",
    embryo: "ATH",
    voicePath: ["A", "E"],
    opaqueStructuralProvenanceReference: "sha256:d0f681cc5bb02cd515fdbf5b53595856a5ca64b6b2bf85dc934fab2e9e548363",
    sourcePolicyVersion: "open-instrument-m7-common-source-universe-v1",
    searchPolicyVersion: "open-instrument-m7-search-s0-s4-v1",
    claimBoundary: "research_only; no historical origin, cognacy, borrowing, language superiority, candidate truth, or winner claim",
    blindPayloadSha256: "4590fa01a764702dc49458f1fb00472e3af2c91ebc21c086de9e671de1b5ee77",
  },
  {
    id: "open-instrument-m7-three-case-replication-v1:M7-03-REPLACEMENT-03",
    slot: "M7-03",
    embryo: "ART",
    voicePath: ["A"],
    opaqueStructuralProvenanceReference: "sha256:4828faec258c60bb9598df1cf1b901e00943abe735696da3f4fa7fd6321f1e78",
    sourcePolicyVersion: "open-instrument-m7-common-source-universe-v1",
    searchPolicyVersion: "open-instrument-m7-search-s0-s4-v1",
    claimBoundary: "research_only; no historical origin, cognacy, borrowing, language superiority, candidate truth, or winner claim",
    blindPayloadSha256: "d6669664d8644f086ffc36b06f814555d379fbc8d070f005e8f50ea326f15997",
  },
];
const EXPECTED_LOST_RUNS = [
  { slot: "M7-02", byteLength: 14855, sha256: "3ffbe21b4d4aa73ff06680de4f271ce895ce79dc2e8f7ce6a524e1fbea52f1ad" },
  { slot: "M7-03", byteLength: 12201, sha256: "e329fc66958becf961e212c989a042ddc33ec6816685a9b173d4d18ad38c6246" },
];
export const REQUIRED_DURABILITY_GATE_FLAGS = [
  "canonicalArtifactBeforeRevealRequired",
  "primaryPersistedBeforeReveal",
  "primaryRawLengthAndShaComputedFromDisk",
  "primaryClosedAndReopened",
  "primaryRecomputedAfterReadback",
  "internalIdentityReverifiedFromReopenedBytes",
  "separateVerificationReportRequired",
  "secondaryByteForByteCopyRequired",
  "secondaryRecomputedFromDisk",
  "primaryAndSecondaryMustMatchExactly",
  "bothPathsAndIdentitiesRecorded",
  "revealBlockedUntilAllChecksPass",
  "secondCopyMustNotBeCreatedByReserialization",
];

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const FORBIDDEN_AUTHORIZATION_KEYS = new Set([
  "targetWord",
  "targetDefinition",
  "targetSenseId",
  "targetSenseDefinition",
  "targetSenseLocator",
  "expansionChain",
  "translation",
  "etymology",
  "expectedFunction",
  "operationIds",
  "controller",
  "controllerSha256",
]);

function findForbiddenKeys(value, path = "$") {
  const found = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => found.push(...findForbiddenKeys(item, `${path}[${index}]`)));
    return found;
  }
  if (!value || typeof value !== "object") return found;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_AUTHORIZATION_KEYS.has(key)) found.push(`${path}.${key}`);
    found.push(...findForbiddenKeys(child, `${path}.${key}`));
  }
  return found;
}

export function assertCompleteDurabilityGate(durabilityGate) {
  for (const flag of REQUIRED_DURABILITY_GATE_FLAGS) {
    if (durabilityGate?.[flag] !== true) throw new Error(`durability gate incomplete: ${flag}`);
  }
}

export function verifyM7DurabilityReplacementAddendum() {
  const addendum = readJson(addendumPath);
  const preregistrationBytes = readFileSync(preregistrationPath);
  const preregistration = JSON.parse(preregistrationBytes.toString("utf8"));
  const hashManifest = readJson(hashManifestPath);
  const preregistrationSha256 = sha256(preregistrationBytes);

  if (addendum.schemaVersion !== "open-instrument.m7-durability-replacement-governance-addendum.v1") throw new Error("addendum schema mismatch");
  if (addendum.artifactKind !== "research_only_m7_durability_replacement_governance_addendum") throw new Error("addendum artifact kind mismatch");
  if (addendum.createdAfterDurabilityFailure !== true || addendum.createdBeforeReplacementResearch !== true) throw new Error("addendum timing boundary mismatch");
  if (preregistration.experimentId !== EXPECTED_EXPERIMENT_ID) throw new Error("experiment identity mismatch");
  if (preregistration.status !== "PREREGISTERED_BEFORE_BLIND_RESEARCH") throw new Error("preregistration status mismatch");
  if (preregistration.revealPolicy.protocolCannotChangeAfterFirstRun !== true) throw new Error("original protocol immutability flag missing");
  if (preregistrationBytes.byteLength !== EXPECTED_PREREGISTRATION_BYTES || preregistrationSha256 !== EXPECTED_PREREGISTRATION_SHA256) throw new Error("original preregistration identity mismatch");
  if (hashManifest.artifactByteLength !== EXPECTED_PREREGISTRATION_BYTES || hashManifest.artifactSha256 !== EXPECTED_PREREGISTRATION_SHA256) throw new Error("original preregistration manifest mismatch");

  const original = addendum.originalPreregistration;
  if (original.path !== "docs/open-instrument/research-artifacts/m7-three-case-replication-v1/preregistration.json") throw new Error("original path mismatch");
  if (original.experimentId !== EXPECTED_EXPERIMENT_ID || original.rawByteLength !== EXPECTED_PREREGISTRATION_BYTES || original.rawSha256 !== EXPECTED_PREREGISTRATION_SHA256) throw new Error("addendum parent identity mismatch");
  if (original.immutable !== true || original.historicalAuthorityOnly !== true || original.protocolCannotChangeAfterFirstRun !== true) throw new Error("original immutability boundary mismatch");

  if (!same(addendum.sourceUniverse.traditions, EXPECTED_SOURCE_TRADITIONS) || addendum.sourceUniverse.noNewTradition !== true) throw new Error("source universe drift");
  if (!same(addendum.searchPolicy.orderedStages, EXPECTED_SEARCH_STAGES) || addendum.searchPolicy.unchangedFromOriginalPreregistration !== true) throw new Error("search policy drift");
  if (addendum.searchPolicy.forbidden.length !== preregistration.searchPolicy.forbidden.length || !same(addendum.searchPolicy.forbidden, preregistration.searchPolicy.forbidden)) throw new Error("search prohibitions drift");

  const preregPayloads = new Map(preregistration.blindPayloads.map((payload) => [payload.replicationSlot, payload]));
  const replacements = addendum.replacementRuns;
  if (!Array.isArray(replacements) || replacements.length !== EXPECTED_REPLACEMENTS.length) throw new Error("replacement count mismatch");
  if (new Set(replacements.map((replacement) => replacement.replacementRunId)).size !== replacements.length) throw new Error("replacement identities are not unique");
  for (const expected of EXPECTED_REPLACEMENTS) {
    const replacement = replacements.find((item) => item.replicationSlot === expected.slot);
    if (!replacement || replacement.replacementRunId !== expected.id) throw new Error(`replacement identity mismatch: ${expected.slot}`);
    if (replacement.isNewBlindObservation !== true || replacement.isReproductionOfLostBytes !== false || replacement.isReplacementForHistoricalRunOnly !== true) throw new Error(`replacement semantics mismatch: ${expected.slot}`);
    const payload = replacement.blindPayload;
    if (payload.replicationExperimentId !== EXPECTED_EXPERIMENT_ID || payload.replicationSlot !== expected.slot || payload.embryo !== expected.embryo || !same(payload.voicePath, expected.voicePath) || payload.opaqueStructuralProvenanceReference !== expected.opaqueStructuralProvenanceReference || payload.sourcePolicyVersion !== expected.sourcePolicyVersion || payload.searchPolicyVersion !== expected.searchPolicyVersion || payload.claimBoundary !== expected.claimBoundary || payload.blindPayloadSha256 !== expected.blindPayloadSha256) throw new Error(`replacement payload mismatch: ${expected.slot}`);
    const originalPayload = preregPayloads.get(expected.slot);
    if (!originalPayload || originalPayload.blindPayloadSha256 !== expected.blindPayloadSha256 || originalPayload.embryo !== expected.embryo || !same(originalPayload.voicePath, expected.voicePath)) throw new Error(`original blind payload mismatch: ${expected.slot}`);
  }

  for (const expected of EXPECTED_LOST_RUNS) {
    const historical = addendum.historicalRuns.find((item) => item.replicationSlot === expected.slot);
    if (!historical || historical.status !== "COMPLETED_BUT_CANONICAL_BYTES_NOT_DURABLY_RECOVERABLE") throw new Error(`historical status mismatch: ${expected.slot}`);
    if (historical.reportedArtifact.rawByteLength !== expected.byteLength || historical.reportedArtifact.rawSha256 !== expected.sha256) throw new Error(`historical artifact identity mismatch: ${expected.slot}`);
    if (historical.canonicalBytesCurrentlyVerified !== false || historical.internalFrozenContentCurrentlyVerified !== false || historical.controlledRevealAuthorized !== false || historical.reconstructionForbidden !== true) throw new Error(`historical recovery boundary mismatch: ${expected.slot}`);
  }

  const forbidden = findForbiddenKeys(addendum.replacementRuns);
  if (forbidden.length) throw new Error(`target/controller leakage in replacement authorization: ${forbidden.join(",")}`);
  if (addendum.blindInputPolicy.sameOriginalBlindPayload !== true || addendum.blindInputPolicy.previousResultsInput !== false || addendum.blindInputPolicy.caseIndependence !== true || addendum.blindInputPolicy.freshStandaloneSessionPerReplacement !== true) throw new Error("blind input policy mismatch");
  assertCompleteDurabilityGate(addendum.durabilityGate);
  if (addendum.claimBoundaries.includes("production_evidence") || !addendum.claimBoundaries.includes("research_only") || !addendum.claimBoundaries.includes("no_single_winner") || !addendum.claimBoundaries.includes("user_decides")) throw new Error("claim boundaries invalid");
  if (addendum.historicalInterpretation.originalPreregistrationRemainsHistoricalAuthority !== true || addendum.historicalInterpretation.replacementResultsMustNotBeReportedAsOriginalBytes !== true || addendum.historicalInterpretation.replacementResultsDoNotRetroactivelyChangeHistoricalOutcomes !== true) throw new Error("historical interpretation boundary invalid");

  return {
    originalPreregistrationByteLength: preregistrationBytes.byteLength,
    originalPreregistrationSha256: preregistrationSha256,
    replacementRunIds: replacements.map((replacement) => replacement.replacementRunId),
    blindPayloadSha256: replacements.map((replacement) => replacement.blindPayload.blindPayloadSha256),
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(verifyM7DurabilityReplacementAddendum()));
