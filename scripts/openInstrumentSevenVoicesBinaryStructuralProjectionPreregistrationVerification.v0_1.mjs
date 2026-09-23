import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
export const artifactPath = resolve(
  root,
  "docs/open-instrument/research-artifacts/seven-voices-binary-structural-projection-v0-1/preregistration.json",
);

const expectedFamilies = {
  UNRESTRICTED: 5040,
  CENTER_PRESERVING: 720,
  MIRROR_EDGE_PRESERVING: 528,
  CENTERED_MIRROR_EDGE: 144,
  PAIR_BLOCK_PRESERVING: 48,
  EXACT_RING_PRESERVING: 8,
  STRUCTURAL_V0_1: 1,
};

const familyPredicates = {
  UNRESTRICTED: () => true,
  CENTER_PRESERVING: (m) => m.O === "001",
  MIRROR_EDGE_PRESERVING: (m) => mirrorPairs.every(([a, b]) => hamming(m[a], m[b]) === 1),
  CENTERED_MIRROR_EDGE: (m) => m.O === "001" && mirrorPairs.every(([a, b]) => hamming(m[a], m[b]) === 1),
  PAIR_BLOCK_PRESERVING: (m) => mirrorPairs.every(([a, b]) => m[a].slice(0, 2) === m[b].slice(0, 2)),
  EXACT_RING_PRESERVING: (m) => voices.every((voice) => Number.parseInt(m[voice].slice(0, 2), 2) === rings[voice]),
  STRUCTURAL_V0_1: (m) => voices.every((voice) => m[voice] === structuralMapping[voice]),
};

const voices = ["A", "E", "I", "O", "U", "Y", "Ë"];
const nonzeroCodes = ["001", "010", "011", "100", "101", "110", "111"];
const mirrorPairs = [["A", "Ë"], ["E", "Y"], ["I", "U"]];
const rings = { A: 3, E: 2, I: 1, O: 0, U: 1, Y: 2, Ë: 3 };
const structuralMapping = { A: "110", E: "100", I: "010", O: "001", U: "011", Y: "101", Ë: "111" };

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

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

export function verifySevenVoicesBinaryStructuralProjectionPreregistration() {
  const raw = readFileSync(artifactPath, "utf8");
  const artifact = JSON.parse(raw);
  assert(raw.endsWith("\n"), "artifact must end with a newline");
  assert(artifact.executionBoundary.experimentExecuted === false, "experiment execution is not false");
  assert(artifact.preregistrationIntegrity.sourceResearchPerformed === false, "source research is not false");
  assert(JSON.stringify(artifact.semanticFirewall).includes("Reflection/Mirror"), "Y drift exclusion is missing");
  assert(!JSON.stringify(artifact.semanticFirewall).includes("meaningful semantic relation"), "semantic relation language leaked into firewall");
  assert(artifact.structuralV0_1.sentinel.code === "000", "sentinel must be 000");
  assert(artifact.structuralV0_1.sentinel.isVoice === false, "sentinel cannot be a Voice");
  assert(JSON.stringify(artifact).includes("Fano semantic claims"), "Fano firewall is missing");
  assert(JSON.stringify(artifact).includes("I↔Y functional claims"), "I-Y firewall is missing");

  const mapping = artifact.structuralV0_1.mapping;
  assert(JSON.stringify(voices) === JSON.stringify(artifact.canonicalStructuralInput.voiceOrder), "Voice order drift");
  assert(new Set(Object.values(mapping)).size === voices.length, "structural mapping is not injective");
  assert(Object.values(mapping).every((code) => nonzeroCodes.includes(code)), "structural mapping uses an invalid code");
  assert(!Object.values(mapping).includes("000"), "structural mapping uses the sentinel");
  assert(artifact.mappingUniverse.derivedCount === 5040, "derived mapping count drift");

  const allMappings = permutations(nonzeroCodes).map(mappingFromPermutation);
  assert(allMappings.length === artifact.mappingUniverse.enumeratedCount, "enumerated mapping count drift");
  const structuralMappings = allMappings.filter(familyPredicates.STRUCTURAL_V0_1);
  assert(structuralMappings.length === 1, "structural mapping is not unique");

  const familyCounts = {};
  const familyMetricSummaries = {};
  for (const [family, predicate] of Object.entries(familyPredicates)) {
    const members = allMappings.filter(predicate);
    familyCounts[family] = members.length;
    assert(members.length === expectedFamilies[family], `${family} count drift: ${members.length}`);
    assert(artifact.controlFamilies.find((entry) => entry.name === family)?.enumeratedCount === members.length, `${family} artifact count drift`);
    const signatures = members.map(metricSignatures);
    const candidateSignature = metricSignatures(mapping);
    familyMetricSummaries[family] = {};
    for (const metric of Object.keys(candidateSignature)) {
      const counts = new Map();
      for (const signature of signatures) counts.set(signature[metric], (counts.get(signature[metric]) ?? 0) + 1);
      const candidateClassSize = counts.get(candidateSignature[metric]) ?? 0;
      const largestClassSize = Math.max(...counts.values());
      const summary = [members.length, counts.size, largestClassSize, candidateClassSize];
      familyMetricSummaries[family][metric] = summary;
      assert(JSON.stringify(artifact.metricEquivalence.familySummaries[family][metric]) === JSON.stringify(summary.slice(0, 3)), `${family}/${metric} metric summary drift`);
    }
  }

  const forbiddenProductionPaths = [
    "src/shared/", "src/core/", "src/engine/", "src/ui/", "src/app/", "src/api/", "src/ai/", "provider",
  ];
  assert(artifact.protectedSurfaces.includes("runtime analysis"), "runtime protection missing");
  assert(forbiddenProductionPaths.every((path) => !artifact.experimentId.includes(path)), "production path leaked into identity");

  return {
    artifactSha256: sha256(raw),
    mappingUniverseCount: allMappings.length,
    familyCounts,
    familyMetricSummaries,
    structuralMapping: mapping,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(verifySevenVoicesBinaryStructuralProjectionPreregistration(), null, 2));
}
