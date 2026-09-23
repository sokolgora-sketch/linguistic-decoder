#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const EXPECTED_PREREGISTRATION_SHA256 =
  "240e7af20ff90122b254db31eaa407053c922b937ad93489a8f6c085a95d412f";
export const EXPECTED_STRUCTURAL_INPUT_SHA256 =
  "d0450375a862a994c359fab7f30479e06fef51f50449ab452eafc0040818f481";
export const EXPECTED_RESULT_PATH = resolve(
  process.cwd(),
  "docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/result.json",
);
export const EXPECTED_PREREGISTRATION_PATH = resolve(
  process.cwd(),
  "docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/preregistration.json",
);

const voices = ["A", "E", "I", "O", "U", "Y", "Ë"];
const nonzeroCodes = ["001", "010", "011", "100", "101", "110", "111"];
const mirrorPairs = [["A", "Ë"], ["E", "Y"], ["I", "U"]];
const rings = { A: 3, E: 2, I: 1, O: 0, U: 1, Y: 2, Ë: 3 };
const structuralMapping = { A: "110", E: "100", I: "010", O: "001", U: "011", Y: "101", Ë: "111" };
const expectedFamilyCounts = {
  UNRESTRICTED: 5040,
  CENTER_PRESERVING: 720,
  MIRROR_EDGE_PRESERVING: 528,
  CENTERED_MIRROR_EDGE: 144,
  PAIR_BLOCK_PRESERVING: 48,
  EXACT_RING_PRESERVING: 8,
  STRUCTURAL_V0_1: 1,
};
const metricNames = [
  "code_sequence", "pairwise_hamming_distance_matrix", "pairwise_xor_matrix",
  "ordered_xor_transition_signature", "hamming_weight_sequence",
  "hamming_transition_signature", "cube_edge_incidence",
  "distance_to_center_sequence", "distance_from_sentinel_sequence",
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
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stableValue(value[key])]));
  }
  return value;
}

function stableStringify(value) {
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
  return [...left].reduce((total, bit, index) => total + (bit === right[index] ? 0 : 1), 0);
}

function xor(left, right) {
  return [...left].map((bit, index) => (bit === right[index] ? "0" : "1")).join("");
}

function weight(code) {
  return [...code].filter((bit) => bit === "1").length;
}

function mappingFromPermutation(permutation) {
  return Object.fromEntries(voices.map((voice, index) => [voice, permutation[index]]));
}

function metricSignatures(mapping) {
  const pairs = voices.flatMap((left, leftIndex) => voices.slice(leftIndex + 1).map((right) => [left, right]));
  return {
    code_sequence: voices.map((voice) => mapping[voice]).join("|"),
    pairwise_hamming_distance_matrix: pairs.map(([left, right]) => hamming(mapping[left], mapping[right])).join(","),
    pairwise_xor_matrix: pairs.map(([left, right]) => xor(mapping[left], mapping[right])).join("|"),
    ordered_xor_transition_signature: voices.slice(0, -1).map((voice, index) => xor(mapping[voice], mapping[voices[index + 1]])).join("|"),
    hamming_weight_sequence: voices.map((voice) => weight(mapping[voice])).join(","),
    hamming_transition_signature: voices.slice(0, -1).map((voice, index) => hamming(mapping[voice], mapping[voices[index + 1]])).join(","),
    cube_edge_incidence: pairs.map(([left, right]) => (hamming(mapping[left], mapping[right]) === 1 ? "1" : "0")).join(""),
    distance_to_center_sequence: voices.map((voice) => hamming(mapping[voice], mapping.O)).join(","),
    distance_from_sentinel_sequence: voices.map((voice) => hamming(mapping[voice], "000")).join(","),
  };
}

function predicates() {
  return {
    UNRESTRICTED: () => true,
    CENTER_PRESERVING: (mapping) => mapping.O === "001",
    MIRROR_EDGE_PRESERVING: (mapping) => mirrorPairs.every(([left, right]) => hamming(mapping[left], mapping[right]) === 1),
    CENTERED_MIRROR_EDGE: (mapping) => mapping.O === "001" && mirrorPairs.every(([left, right]) => hamming(mapping[left], mapping[right]) === 1),
    PAIR_BLOCK_PRESERVING: (mapping) => mirrorPairs.every(([left, right]) => mapping[left].slice(0, 2) === mapping[right].slice(0, 2)),
    EXACT_RING_PRESERVING: (mapping) => voices.every((voice) => Number.parseInt(mapping[voice].slice(0, 2), 2) === rings[voice]),
    STRUCTURAL_V0_1: (mapping) => voices.every((voice) => mapping[voice] === structuralMapping[voice]),
  };
}

export function verifySevenVoicesBinaryStructuralProjectionExperiment({
  resultPath = EXPECTED_RESULT_PATH,
  preregistrationPath = EXPECTED_PREREGISTRATION_PATH,
} = {}) {
  const preregistrationRaw = readFileSync(preregistrationPath, "utf8");
  const preregistrationSha = sha256(preregistrationRaw);
  assert(preregistrationSha === EXPECTED_PREREGISTRATION_SHA256, "PREREGISTRATION_SHA_MISMATCH");
  const preregistration = JSON.parse(preregistrationRaw);
  const structuralInputSha = sha256(JSON.stringify(preregistration.canonicalStructuralInput));
  assert(structuralInputSha === EXPECTED_STRUCTURAL_INPUT_SHA256, "STRUCTURAL_INPUT_SHA_MISMATCH");

  const resultRaw = readFileSync(resultPath, "utf8");
  assert(resultRaw.endsWith("\n"), "RESULT_MISSING_NEWLINE");
  const result = JSON.parse(resultRaw);
  const { resultSha256, ...resultWithoutHash } = result;
  assert(resultSha256 === sha256(stableStringify(resultWithoutHash)), "RESULT_SHA_MISMATCH");
  assert(result.preregistrationSha === preregistrationSha, "RESULT_PREREGISTRATION_SHA_MISMATCH");
  assert(result.canonicalInputFingerprint === structuralInputSha, "RESULT_STRUCTURAL_INPUT_SHA_MISMATCH");
  assert(result.mappingUniverseSize === 5040, "RESULT_MAPPING_UNIVERSE_MISMATCH");
  assert(result.classification === "REDUNDANT", "RESULT_CLASSIFICATION_MISMATCH");
  assert(result.primaryMetric.name === "ADDITIONAL_STRUCTURAL_INVARIANT_COUNT", "RESULT_PRIMARY_METRIC_MISMATCH");
  assert(result.primaryMetric.value === 0, "RESULT_PRIMARY_METRIC_VALUE_MISMATCH");
  assert(result.primaryMetric.byConstructionCount === 7, "RESULT_BY_CONSTRUCTION_COUNT_MISMATCH");
  assert(result.primaryMetric.symmetryArtifactCount === 9, "RESULT_SYMMETRY_ARTIFACT_COUNT_MISMATCH");
  assert(result.primaryMetric.survivingAdditionalInvariants.length === 0, "RESULT_SURVIVING_INVARIANT_MISMATCH");
  assert(result.semanticClaimsMade === false, "SEMANTIC_CLAIMS_NOT_FALSE");
  assert(result.linguisticClaimsMade === false, "LINGUISTIC_CLAIMS_NOT_FALSE");
  assert(result.productionAuthorityChanged === false, "PRODUCTION_AUTHORITY_NOT_FALSE");

  const mappings = permutations(nonzeroCodes).map(mappingFromPermutation);
  assert(mappings.length === 5040, "ENUMERATION_COUNT_MISMATCH");
  const familyCounts = {};
  for (const [name, predicate] of Object.entries(predicates())) {
    const observed = mappings.filter(predicate).length;
    familyCounts[name] = { expected: expectedFamilyCounts[name], observed, match: observed === expectedFamilyCounts[name] };
    assert(observed === expectedFamilyCounts[name], `${name}_COUNT_MISMATCH`);
    assert(result.controlFamilyCounts[name].observed === observed, `${name}_RESULT_COUNT_MISMATCH`);
  }
  assert(JSON.stringify(result.mappingDefinition) === JSON.stringify(structuralMapping), "RESULT_MAPPING_MISMATCH");
  assert(stableStringify(result.candidateSignature.metrics) === stableStringify(metricSignatures(structuralMapping)), "RESULT_CANDIDATE_SIGNATURE_MISMATCH");
  assert(result.reasonCodes.includes("NO_SURVIVING_ADDITIONAL_INVARIANT"), "RESULT_REASON_CODE_MISSING");

  return { resultSha256, preregistrationSha, structuralInputSha, mappingUniverseCount: mappings.length, familyCounts, classification: result.classification, primaryMetric: result.primaryMetric };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(JSON.stringify(verifySevenVoicesBinaryStructuralProjectionExperiment(), null, 2));
}
