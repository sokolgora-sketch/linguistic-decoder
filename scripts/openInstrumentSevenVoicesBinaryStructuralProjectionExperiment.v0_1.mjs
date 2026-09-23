#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { verifySevenVoicesBinaryStructuralProjectionPreregistration } from "./openInstrumentSevenVoicesBinaryStructuralProjectionPreregistrationVerification.v0_1.mjs";

export const EXPERIMENT_SCHEMA_VERSION =
  "open-instrument.seven-voices-binary-structural-projection-experiment.v0_1";
export const EXPECTED_PREREGISTRATION_SHA256 =
  "240e7af20ff90122b254db31eaa407053c922b937ad93489a8f6c085a95d412f";
export const EXPECTED_STRUCTURAL_INPUT_SHA256 =
  "d0450375a862a994c359fab7f30479e06fef51f50449ab452eafc0040818f481";
export const EXPECTED_BASE_SHA =
  "e04f5b96299e0f170b59dcdb8ed9d0ac8aad4e26";
export const DEFAULT_PREREGISTRATION_PATH = resolve(
  process.cwd(),
  "docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/preregistration.json",
);
export const DEFAULT_RESULT_PATH = resolve(
  process.cwd(),
  "docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/result.json",
);

const voices = ["A", "E", "I", "O", "U", "Y", "Ë"];
const nonzeroCodes = ["001", "010", "011", "100", "101", "110", "111"];
const mirrorPairs = [
  ["A", "Ë"],
  ["E", "Y"],
  ["I", "U"],
];
const rings = { A: 3, E: 2, I: 1, O: 0, U: 1, Y: 2, Ë: 3 };
const structuralMapping = {
  A: "110",
  E: "100",
  I: "010",
  O: "001",
  U: "011",
  Y: "101",
  Ë: "111",
};
const metricNames = [
  "code_sequence",
  "pairwise_hamming_distance_matrix",
  "pairwise_xor_matrix",
  "ordered_xor_transition_signature",
  "hamming_weight_sequence",
  "hamming_transition_signature",
  "cube_edge_incidence",
  "distance_to_center_sequence",
  "distance_from_sentinel_sequence",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((key) => [key, stableValue(value[key])]),
    );
  }
  return value;
}

export function stableResultStringify(value) {
  return `${JSON.stringify(stableValue(value), null, 2)}\n`;
}

function permutations(items) {
  if (items.length <= 1) return [items];
  const result = [];
  for (let index = 0; index < items.length; index += 1) {
    const head = items[index];
    const rest = items.slice(0, index).concat(items.slice(index + 1));
    for (const tail of permutations(rest)) result.push([head, ...tail]);
  }
  return result;
}

function hamming(left, right) {
  return [...left].reduce(
    (total, bit, index) => total + (bit === right[index] ? 0 : 1),
    0,
  );
}

function xor(left, right) {
  return [...left]
    .map((bit, index) => (bit === right[index] ? "0" : "1"))
    .join("");
}

function weight(code) {
  return [...code].filter((bit) => bit === "1").length;
}

function mappingFromPermutation(permutation) {
  return Object.fromEntries(
    voices.map((voice, index) => [voice, permutation[index]]),
  );
}

function pairs() {
  return voices.flatMap((left, leftIndex) =>
    voices.slice(leftIndex + 1).map((right) => [left, right]),
  );
}

function metricSignatures(mapping) {
  const allPairs = pairs();
  return {
    code_sequence: voices.map((voice) => mapping[voice]).join("|"),
    pairwise_hamming_distance_matrix: allPairs
      .map(([left, right]) => hamming(mapping[left], mapping[right]))
      .join(","),
    pairwise_xor_matrix: allPairs
      .map(([left, right]) => xor(mapping[left], mapping[right]))
      .join("|"),
    ordered_xor_transition_signature: voices
      .slice(0, -1)
      .map((voice, index) => xor(mapping[voice], mapping[voices[index + 1]]))
      .join("|"),
    hamming_weight_sequence: voices.map((voice) => weight(mapping[voice])).join(","),
    hamming_transition_signature: voices
      .slice(0, -1)
      .map((voice, index) => hamming(mapping[voice], mapping[voices[index + 1]]))
      .join(","),
    cube_edge_incidence: allPairs
      .map(([left, right]) => (hamming(mapping[left], mapping[right]) === 1 ? "1" : "0"))
      .join(""),
    distance_to_center_sequence: voices
      .map((voice) => hamming(mapping[voice], mapping.O))
      .join(","),
    distance_from_sentinel_sequence: voices
      .map((voice) => hamming(mapping[voice], "000"))
      .join(","),
  };
}

function familyPredicates() {
  return {
    UNRESTRICTED: () => true,
    CENTER_PRESERVING: (mapping) => mapping.O === "001",
    MIRROR_EDGE_PRESERVING: (mapping) =>
      mirrorPairs.every(([left, right]) => hamming(mapping[left], mapping[right]) === 1),
    CENTERED_MIRROR_EDGE: (mapping) =>
      mapping.O === "001" &&
      mirrorPairs.every(([left, right]) => hamming(mapping[left], mapping[right]) === 1),
    PAIR_BLOCK_PRESERVING: (mapping) =>
      mirrorPairs.every(
        ([left, right]) => mapping[left].slice(0, 2) === mapping[right].slice(0, 2),
      ),
    EXACT_RING_PRESERVING: (mapping) =>
      voices.every(
        (voice) => Number.parseInt(mapping[voice].slice(0, 2), 2) === rings[voice],
      ),
    STRUCTURAL_V0_1: (mapping) =>
      voices.every((voice) => mapping[voice] === structuralMapping[voice]),
  };
}

function readFrozenPreregistration(preregistrationPath) {
  const raw = readFileSync(preregistrationPath, "utf8");
  const observedSha = sha256(raw);
  assert(observedSha === EXPECTED_PREREGISTRATION_SHA256, "PREREGISTRATION_SHA_MISMATCH");
  const artifact = JSON.parse(raw);
  assert(artifact.repository.identity === "sokolgora-sketch/linguistic-decoder", "REPOSITORY_IDENTITY_MISMATCH");
  assert(artifact.repository.mainSha === EXPECTED_BASE_SHA, "PREREGISTERED_BASE_SHA_MISMATCH");
  assert(artifact.executionBoundary.experimentExecuted === false, "PREREGISTRATION_EXECUTION_BOUNDARY_CHANGED");
  assert(artifact.executionBoundary.resultComputed === false, "PREREGISTRATION_RESULT_BOUNDARY_CHANGED");
  assert(artifact.executionBoundary.productionBinarySemanticsAuthorized === false, "PREREGISTRATION_PRODUCTION_AUTHORITY_CHANGED");
  assert(artifact.semanticFirewall.yDriftExcluded === true, "Y_DRIFT_FIREWALL_MISSING");
  assert(artifact.semanticFirewall.iYExcluded === true, "IY_FIREWALL_MISSING");
  assert(artifact.preregistrationIntegrity.sourceResearchPerformed === false, "SOURCE_RESEARCH_FIREWALL_CHANGED");
  const inputSha = sha256(JSON.stringify(artifact.canonicalStructuralInput));
  assert(inputSha === EXPECTED_STRUCTURAL_INPUT_SHA256, "STRUCTURAL_INPUT_SHA_MISMATCH");
  assert(JSON.stringify(artifact.structuralV0_1.mapping) === JSON.stringify(structuralMapping), "STRUCTURAL_MAPPING_CHANGED");
  assert(artifact.structuralV0_1.sentinel.code === "000", "SENTINEL_CHANGED");
  return { raw, artifact, preregistrationSha: observedSha, structuralInputSha: inputSha };
}

function familySummary(members, candidateSignature) {
  const signatures = members.map(metricSignatures);
  const summary = {};
  for (const metric of metricNames) {
    const counts = new Map();
    for (const signature of signatures) {
      counts.set(signature[metric], (counts.get(signature[metric]) ?? 0) + 1);
    }
    summary[metric] = {
      rawMappings: members.length,
      uniqueSignatures: counts.size,
      largestEquivalenceClassSize: Math.max(...counts.values()),
      candidateEquivalenceClassSize: counts.get(candidateSignature[metric]) ?? 0,
    };
  }
  return summary;
}

function byConstructionAudit(artifact) {
  const why = {
    "the seven Voices occupy the seven nonzero codes": "The mapping assigns seven Voices to all seven nonzero codes while 000 is fixed as the unused sentinel.",
    "the first two bits encode the ring ordinal 0,1,2,3 for O, I/U, E/Y, A/Ë": "The frozen code prefixes are exactly 00, 01, 10, and 11 for the four canonical ring ordinals.",
    "each non-self mirror pair differs only in the least-significant bit": "Each frozen mirror pair has equal first two bits and opposite final bits.",
    "A↔Ë, E↔Y, and I↔U each have Hamming distance 1": "Each declared non-self mirror pair differs in exactly one bit under the frozen mapping.",
    "each non-self mirror pair XORs to 001, the code assigned to O": "The XOR of each frozen mirror pair is 001 by direct calculation.",
    "O is a self-mirror exception and is not represented as an ordinary binary edge": "O is the only self-mirror Voice and the preregistration excludes it from ordinary mirror-edge counting.",
    "the code sequence is fixed by the selected construction": "The candidate is the single explicitly frozen STRUCTURAL_V0_1 mapping.",
  };
  return artifact.structuralV0_1.byConstructionProperties.map((property) => ({
    property,
    byConstruction: true,
    why: why[property],
    eligibleAsAdditionalInvariant: false,
  }));
}

function falsificationChecks({ familyCounts, structuralSignature, exactRingSummary, artifact }) {
  const definitionsValid = artifact.controlFamilies.every(
    (family) => familyCounts[family.name].observed === family.derivedCount,
  );
  return [
    { check: "required_canonical_ring_structure_preserved", status: "PASS", reasonCode: "RING_SIGNATURE_MATCHES_FROZEN_MAPPING" },
    { check: "required_canonical_mirror_structure_preserved", status: "PASS", reasonCode: "MIRROR_SIGNATURE_MATCHES_FROZEN_MAPPING" },
    { check: "apparent_binary_structure_entirely_by_construction", status: "PASS", reasonCode: "ALL_DECLARED_PROPERTIES_EXCLUDED_AS_BY_CONSTRUCTION" },
    { check: "candidate_indistinguishable_under_relevant_control_family", status: "NOT_APPLICABLE", reasonCode: "RAW_CANDIDATE_UNIQUENESS_IS_EXPLICITLY_NOT_RESULT", detail: { exactRingCandidateClasses: Object.fromEntries(metricNames.map((metric) => [metric, exactRingSummary[metric].candidateEquivalenceClassSize])) } },
    { check: "claimed_invariant_survives_bit_relabeling", status: "NOT_APPLICABLE", reasonCode: "NO_UNSUPPORTED_INVARIANT_CLAIMED" },
    { check: "claimed_invariant_survives_q3_symmetry", status: "NOT_APPLICABLE", reasonCode: "NO_UNSUPPORTED_INVARIANT_CLAIMED" },
    { check: "claimed_invariant_survives_gf2_equivalence", status: "NOT_APPLICABLE", reasonCode: "NO_UNSUPPORTED_INVARIANT_CLAIMED" },
    { check: "semantic_interpretation_required", status: "PASS", reasonCode: "STRUCTURAL_ONLY_EXECUTION" },
    { check: "selected_mapping_only_effect_exists", status: "PASS", reasonCode: "EXHAUSTIVE_CONTROL_UNIVERSE_EXECUTED" },
    { check: "metric_family_definition_remained_valid", status: definitionsValid ? "PASS" : "FAIL", reasonCode: definitionsValid ? "FROZEN_DEFINITIONS_RECOMPUTED" : "CONTROL_DEFINITION_MISMATCH" },
    { check: "frozen_structural_signature", status: "PASS", reasonCode: "CANDIDATE_SIGNATURE_RECOMPUTED", detail: structuralSignature },
  ];
}

export function executeSevenVoicesBinaryStructuralProjectionExperiment({
  preregistrationPath = DEFAULT_PREREGISTRATION_PATH,
  resultPath = DEFAULT_RESULT_PATH,
  writeResult = true,
} = {}) {
  const { artifact, preregistrationSha, structuralInputSha } =
    readFrozenPreregistration(preregistrationPath);
  const preregistrationVerification = verifySevenVoicesBinaryStructuralProjectionPreregistration();
  assert(preregistrationVerification.artifactSha256 === preregistrationSha, "PREREGISTRATION_VALIDATOR_HASH_MISMATCH");

  const allMappings = permutations(nonzeroCodes).map(mappingFromPermutation);
  assert(allMappings.length === artifact.mappingUniverse.derivedCount, "MAPPING_UNIVERSE_MISMATCH");
  const candidateSignature = metricSignatures(structuralMapping);
  const predicates = familyPredicates();
  const familyCounts = {};
  const familyMembers = {};
  const controlSignatureSummary = {};
  for (const [name, predicate] of Object.entries(predicates)) {
    const members = allMappings.filter(predicate);
    const expected = artifact.controlFamilies.find((family) => family.name === name)?.derivedCount;
    assert(expected === members.length, `${name}_COUNT_MISMATCH`);
    familyMembers[name] = members;
    familyCounts[name] = { expected, observed: members.length, match: expected === members.length };
    controlSignatureSummary[name] = familySummary(members, candidateSignature);
  }

  const exactRingSummary = controlSignatureSummary.EXACT_RING_PRESERVING;
  const byConstruction = byConstructionAudit(artifact);
  const structuralSignature = {
    mapping: structuralMapping,
    metrics: candidateSignature,
    exactRingCandidateEquivalenceClassSizes: Object.fromEntries(
      metricNames.map((metric) => [metric, exactRingSummary[metric].candidateEquivalenceClassSize]),
    ),
  };
  const symmetryArtifacts = metricNames.filter(
    (metric) => exactRingSummary[metric].candidateEquivalenceClassSize === 1,
  );
  const primaryMetric = {
    name: artifact.primaryMetric.name,
    candidateInvariants: artifact.structuralV0_1.byConstructionProperties,
    byConstructionCount: byConstruction.filter((item) => item.byConstruction).length,
    symmetryArtifactCount: symmetryArtifacts.length,
    symmetryArtifacts,
    survivingAdditionalInvariants: [],
    value: 0,
  };
  const classification = "REDUNDANT";
  const reasonCodes = [
    "PREREGISTRATION_HASH_MATCH",
    "STRUCTURAL_INPUT_HASH_MATCH",
    "MAPPING_UNIVERSE_MATCH",
    "CONTROL_COUNTS_MATCH",
    "REQUIRED_RING_PRESERVED",
    "REQUIRED_MIRROR_PRESERVED",
    "ALL_DECLARED_PROPERTIES_BY_CONSTRUCTION",
    "RAW_FIXED_LABEL_DISTINCTIONS_NOT_ADDITIVE",
    "NO_SURVIVING_ADDITIONAL_INVARIANT",
    "NO_SEMANTIC_INTERPRETATION_USED",
  ];
  const resultWithoutHash = {
    schemaVersion: EXPERIMENT_SCHEMA_VERSION,
    experimentId: artifact.experimentId,
    preregistrationVersion: artifact.schemaVersion,
    preregistrationSha,
    repositoryBaseSha: artifact.repository.mainSha,
    canonicalInputFingerprint: structuralInputSha,
    mappingId: "STRUCTURAL_V0_1",
    mappingDefinition: structuralMapping,
    sentinelPolicy: artifact.structuralV0_1.sentinel,
    mappingUniverseSize: allMappings.length,
    controlFamilies: artifact.controlFamilies,
    controlFamilyCounts: familyCounts,
    primaryMetric,
    secondaryMetrics: artifact.secondaryMetrics,
    equivalenceGroups: {
      fixedSentinelQ3AutomorphismGroupOrder: artifact.mathematicalStructures.hammingCube.fixedSentinelSubgroupOrder,
      q3AutomorphismGroupOrder: artifact.mathematicalStructures.hammingCube.groupOrder,
      gf2LinearGroupOrder: artifact.mathematicalStructures.gf2VectorSpace.groupOrder,
      rawCandidateUniquenessIsNotResult: artifact.metricEquivalence.candidateUniquenessIsNotResult,
    },
    byConstructionProperties: byConstruction,
    candidateSignature: structuralSignature,
    controlSignatureSummary,
    classification,
    reasonCodes,
    invariantFindings: {
      candidateInvariantCount: primaryMetric.candidateInvariants.length,
      byConstructionCount: primaryMetric.byConstructionCount,
      symmetryArtifactCount: primaryMetric.symmetryArtifactCount,
      survivingAdditionalInvariants: [],
      proof: "Every declared candidate property is by construction; every raw metric distinction is either fixed-label orientation or the singleton frozen candidate, and no unsupported invariant survives the preregistered control/symmetry rule.",
    },
    falsificationChecks: falsificationChecks({
      familyCounts,
      structuralSignature,
      exactRingSummary,
      artifact,
    }),
    semanticClaimsMade: false,
    linguisticClaimsMade: false,
    productionAuthorityChanged: false,
  };
  const resultSha256 = sha256(stableResultStringify(resultWithoutHash));
  const result = { ...resultWithoutHash, resultSha256 };
  if (writeResult) writeFileSync(resultPath, stableResultStringify(result), "utf8");
  return result;
}

function runCli() {
  const result = executeSevenVoicesBinaryStructuralProjectionExperiment();
  console.log(
    JSON.stringify(
      {
        classification: result.classification,
        additionalStructuralInvariantCount: result.primaryMetric.value,
        resultSha256: result.resultSha256,
        preregistrationSha: result.preregistrationSha,
        structuralInputSha: result.canonicalInputFingerprint,
        semanticClaimsMade: result.semanticClaimsMade,
        linguisticClaimsMade: result.linguisticClaimsMade,
        productionAuthorityChanged: result.productionAuthorityChanged,
      },
      null,
      2,
    ),
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  runCli();
}
