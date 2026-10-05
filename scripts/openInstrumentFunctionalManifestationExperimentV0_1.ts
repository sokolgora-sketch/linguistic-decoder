import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

export const EXPERIMENT_ID =
  "OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_EXPERIMENT_V0_1";
export const PERMUTATION_STREAM_NAME =
  "OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_V0_1_GAMMA_PRIMARY_PERMUTATION";
export const BOOTSTRAP_STREAM_NAME =
  `${PERMUTATION_STREAM_NAME}:BLOCK_BOOTSTRAP`;
export const PERMUTATIONS = 10_000;
export const BOOTSTRAP_REPLICATES = 2_000;
export const ALPHA = 0.05;
export const UNCERTAINTY_LEVEL = 0.95;
export const MINIMUM_REPEATED_STRUCTURAL_CLASS = 2;

const REPO_ROOT = process.cwd();
const STAGE_A_PATH = "/tmp/open-instrument-functional-outcome-stage-a-v0.1.json";
const STAGE_B_PATH = "/tmp/open-instrument-functional-outcome-stage-b-v0.1.json";
const DIRECT_DISTRIBUTION_PATH =
  "/tmp/open-instrument-functional-outcome-stage-b-direct-distribution.json";
const CANONICAL_VOICE_PATH =
  "/tmp/open-instrument-canonical-voice-population-v0.1.jsonl";
const STRUCTURAL_PATH =
  "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/result.json.gz";
const PREREGISTRATION_PATH =
  "docs/open-instrument/functional-manifestation-preregistration-v0.1.md";
const RUNNER_PATH = "scripts/openInstrumentFunctionalManifestationExperimentV0_1.ts";
const RESULT_DIR =
  "docs/open-instrument/research-artifacts/functional-manifestation-v0.1-experiment-v0.1";
const RESULT_PATH = `${RESULT_DIR}/result.json`;
const EXECUTION_IDENTITY_PATH = `${RESULT_DIR}/execution-identity.json`;
const HASH_MANIFEST_PATH = `${RESULT_DIR}/hash-manifest.json`;

const EXPECTED_HASHES = Object.freeze({
  stageA: "c0953894a677696761bab73bfc10af0ea1f8cefccee428b158477186459f61c3",
  stageB: "dbc689de4dce6411b9b066fd058d0282580d7c5c67515c4943d25831bc7c6845",
  directDistribution:
    "36fc1d522f95e6b07068434828baec773d340f6190b3e33b92e69da06ecc20e6",
  canonicalVoice:
    "949c682dfc2bfb6de127b053452411652444971e00706babf9be050fce5aa194",
  structural:
    "ce3d9c9ca3535176c169f45e076736af3cc254b415428d7201fd2a3f24d24f46",
  preregistration:
    "f103bc83a6910ba41e917aef9d099f6189c8f1c2d840f1c4116a1c51aaa2b395",
});

type StageAForm = {
  normalizedForm: string;
  sourcePresentOutcomeUnresolvedUnitCount: number;
  directPropertyIds: string[];
};

type StageAArtifact = {
  forms: StageAForm[];
  metrics: Record<string, number>;
};

type StructuralObservation = {
  lexicalWord: string;
  sourceForm: string;
  variantId: string;
  variantOrder: number;
  voicePath: string[];
  gammaSignature: string;
  zc: Record<string, unknown>;
};

type StructuralArtifact = {
  population: Record<string, unknown>;
  observations: StructuralObservation[];
};

type Unit = {
  formKey: string;
  voiceKey: string;
  gamma: string;
  zc: string;
  propertySignature: string;
  outcome: string;
};

type Block = {
  key: string;
  rows: Unit[];
};

type StructuralDiagnostics = {
  distinctGammaSignatures: number;
  vGroupsWithAnyRepeatedGammaClass: number;
  vGroupsWithAtLeastTwoDistinctRepeatedGammaClasses: number;
  unitsInRepeatedGammaClasses: number;
  unitsInSingletonGammaClasses: number;
  effectiveVGroups: number;
  effectiveUnits: number;
  gammaClassSizeDistribution: Record<string, number>;
  vGroupGammaClassDistribution: Array<{
    distinctClasses: number;
    repeatedClasses: number;
    units: number;
    vGroups: number;
  }>;
};

type Statistic = {
  normalizedCmi: number | null;
  gSquared: number | null;
  outcomeEntropy: number | null;
  totalUnits: number;
};

function compareCodePoint(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record)
      .sort(compareCodePoint)
      .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function sha256Bytes(bytes: Buffer): string {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function sha256File(filePath: string): string {
  return sha256Bytes(fs.readFileSync(filePath));
}

function fileIdentity(filePath: string) {
  const bytes = fs.readFileSync(filePath);
  return { path: filePath, bytes: bytes.length, sha256: sha256Bytes(bytes) };
}

function repoPath(relativePath: string): string {
  return path.join(REPO_ROOT, relativePath);
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

function normalizeForm(value: string): string {
  return value.normalize("NFC").toLocaleLowerCase("en-US");
}

function assertFrozenInputs(): void {
  const inputs = [
    [STAGE_A_PATH, EXPECTED_HASHES.stageA],
    [STAGE_B_PATH, EXPECTED_HASHES.stageB],
    [DIRECT_DISTRIBUTION_PATH, EXPECTED_HASHES.directDistribution],
    [CANONICAL_VOICE_PATH, EXPECTED_HASHES.canonicalVoice],
    [repoPath(STRUCTURAL_PATH), EXPECTED_HASHES.structural],
    [repoPath(PREREGISTRATION_PATH), EXPECTED_HASHES.preregistration],
  ] as const;

  for (const [filePath, expectedHash] of inputs) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`FROZEN_INPUT_MISSING:${filePath}`);
    }
    const actualHash = sha256File(filePath);
    if (actualHash !== expectedHash) {
      throw new Error(`FROZEN_INPUT_HASH_MISMATCH:${filePath}`);
    }
  }
}

function loadStructuralArtifact(): StructuralArtifact {
  const compressed = fs.readFileSync(repoPath(STRUCTURAL_PATH));
  const uncompressed = zlib.gunzipSync(compressed);
  return JSON.parse(uncompressed.toString("utf8")) as StructuralArtifact;
}

function stageAFormsByKey(stageA: StageAArtifact): Map<string, StageAForm> {
  return new Map(stageA.forms.map((form) => [normalizeForm(form.normalizedForm), form]));
}

function buildUnits(stageA: StageAArtifact, structural: StructuralArtifact): {
  units: Unit[];
  sourceMatchedForms: number;
  directMatchForms: number;
  oneVariantForms: number;
} {
  const stageForms = stageAFormsByKey(stageA);
  const observationsByForm = new Map<string, StructuralObservation[]>();

  for (const observation of structural.observations) {
    const key = normalizeForm(observation.lexicalWord);
    const current = observationsByForm.get(key) ?? [];
    current.push(observation);
    observationsByForm.set(key, current);
  }

  let oneVariantForms = 0;
  const units: Unit[] = [];

  for (const [formKey, form] of stageForms) {
    const observations = observationsByForm.get(formKey) ?? [];
    if (observations.length === 0) continue;

    const variantKeys = new Set(
      observations.map(
        (observation) => `${observation.variantId}\u0000${observation.variantOrder}`,
      ),
    );
    if (variantKeys.size === 1) oneVariantForms += 1;

    if (variantKeys.size !== 1) continue;
    const voiceKeys = new Set(
      observations.map((observation) => stableJson(observation.voicePath)),
    );
    if (voiceKeys.size !== 1 || form.directPropertyIds.length === 0) continue;

    const observation = observations[0];
    const directPropertyIds = [...new Set(form.directPropertyIds)].sort(compareCodePoint);
    units.push({
      formKey,
      voiceKey: stableJson(observation.voicePath),
      gamma: observation.gammaSignature,
      zc: stableJson(observation.zc),
      propertySignature: stableJson({ directPropertyIds }),
      outcome: stableJson({
        directPropertyIds,
        unresolvedEvidence: form.sourcePresentOutcomeUnresolvedUnitCount > 0,
      }),
    });
  }

  return {
    units: units.sort((left, right) => compareCodePoint(left.formKey, right.formKey)),
    sourceMatchedForms: [...stageForms.values()].filter(
      (form) => form.sourcePresentOutcomeUnresolvedUnitCount >= 0,
    ).length,
    directMatchForms: [...stageForms.values()].filter(
      (form) => form.directPropertyIds.length > 0,
    ).length,
    oneVariantForms,
  };
}

function candidateBlocks(units: Unit[]): Block[] {
  const allGroups = new Map<string, Unit[]>();
  for (const unit of units) {
    const group = allGroups.get(unit.voiceKey) ?? [];
    group.push(unit);
    allGroups.set(unit.voiceKey, group);
  }

  return [...allGroups.entries()]
    .filter(([, group]) => {
      const propertySignatures = new Set(
        group.map((unit) => unit.propertySignature),
      );
      return group.length >= 2 && propertySignatures.size >= 2;
    })
    .sort(([left], [right]) => compareCodePoint(left, right))
    .map(([key, rows]) => ({
      key,
      rows: rows.sort((left, right) => compareCodePoint(left.formKey, right.formKey)),
    }));
}

function histogram(values: number[]): Record<string, number> {
  const output: Record<string, number> = {};
  for (const value of values) output[String(value)] = (output[String(value)] ?? 0) + 1;
  return Object.fromEntries(
    Object.entries(output).sort(([left], [right]) => Number(left) - Number(right)),
  );
}

function structuralDiagnostics(blocks: Block[]): StructuralDiagnostics {
  const gammaSizes: number[] = [];
  const groupShapes = new Map<string, number>();
  const distinctGamma = new Set<string>();
  let anyRepeated = 0;
  let atLeastTwoRepeated = 0;
  let repeatedUnits = 0;
  let singletonUnits = 0;
  let effectiveUnits = 0;

  for (const block of blocks) {
    const counts = new Map<string, number>();
    for (const row of block.rows) {
      distinctGamma.add(row.gamma);
      counts.set(row.gamma, (counts.get(row.gamma) ?? 0) + 1);
    }
    const repeatedClasses = [...counts.values()].filter(
      (count) => count >= MINIMUM_REPEATED_STRUCTURAL_CLASS,
    );
    if (repeatedClasses.length > 0) anyRepeated += 1;
    if (repeatedClasses.length >= 2) {
      atLeastTwoRepeated += 1;
      effectiveUnits += block.rows.length;
    }
    for (const count of counts.values()) {
      gammaSizes.push(count);
      if (count >= MINIMUM_REPEATED_STRUCTURAL_CLASS) repeatedUnits += count;
      else singletonUnits += count;
    }
    const shapeKey = `${counts.size}|${repeatedClasses.length}|${block.rows.length}`;
    groupShapes.set(shapeKey, (groupShapes.get(shapeKey) ?? 0) + 1);
  }

  const vGroupGammaClassDistribution = [...groupShapes.entries()]
    .map(([key, vGroups]) => {
      const [distinctClasses, repeatedClasses, units] = key.split("|").map(Number);
      return { distinctClasses, repeatedClasses, units, vGroups };
    })
    .sort((left, right) =>
      left.distinctClasses - right.distinctClasses ||
      left.repeatedClasses - right.repeatedClasses ||
      left.units - right.units,
    );

  return {
    distinctGammaSignatures: distinctGamma.size,
    vGroupsWithAnyRepeatedGammaClass: anyRepeated,
    vGroupsWithAtLeastTwoDistinctRepeatedGammaClasses: atLeastTwoRepeated,
    unitsInRepeatedGammaClasses: repeatedUnits,
    unitsInSingletonGammaClasses: singletonUnits,
    effectiveVGroups: atLeastTwoRepeated,
    effectiveUnits,
    gammaClassSizeDistribution: histogram(gammaSizes),
    vGroupGammaClassDistribution,
  };
}

function statisticForBlocks(blocks: Block[]): Statistic {
  const totalUnits = blocks.reduce((sum, block) => sum + block.rows.length, 0);
  if (totalUnits === 0) {
    return { normalizedCmi: null, gSquared: null, outcomeEntropy: null, totalUnits };
  }

  let mutualInformation = 0;
  let conditionalEntropy = 0;

  for (const block of blocks) {
    const gammaCounts = new Map<string, number>();
    const outcomeCounts = new Map<string, number>();
    const jointCounts = new Map<string, number>();
    for (const row of block.rows) {
      gammaCounts.set(row.gamma, (gammaCounts.get(row.gamma) ?? 0) + 1);
      outcomeCounts.set(row.outcome, (outcomeCounts.get(row.outcome) ?? 0) + 1);
      const key = `${row.gamma}\u0000${row.outcome}`;
      jointCounts.set(key, (jointCounts.get(key) ?? 0) + 1);
    }
    const blockSize = block.rows.length;
    for (const count of outcomeCounts.values()) {
      const probability = count / blockSize;
      conditionalEntropy -= (blockSize / totalUnits) * probability * Math.log(probability);
    }
    for (const [key, count] of jointCounts) {
      const separator = key.indexOf("\u0000");
      const gamma = key.slice(0, separator);
      const outcome = key.slice(separator + 1);
      const gammaCount = gammaCounts.get(gamma) ?? 0;
      const outcomeCount = outcomeCounts.get(outcome) ?? 0;
      mutualInformation +=
        (count / totalUnits) *
        Math.log((count * blockSize) / (gammaCount * outcomeCount));
    }
  }

  const normalizedCmi = conditionalEntropy > 0 ? mutualInformation / conditionalEntropy : null;
  return {
    normalizedCmi,
    gSquared: 2 * totalUnits * mutualInformation,
    outcomeEntropy: conditionalEntropy,
    totalUnits,
  };
}

class SplitMix64 {
  private state: bigint;
  private static readonly MASK = (1n << 64n) - 1n;

  constructor(label: string) {
    this.state = BigInt(`0x${sha256Bytes(Buffer.from(label, "utf8")).slice(0, 16)}`);
  }

  nextUnit(): number {
    this.state = (this.state + 0x9e3779b97f4a7c15n) & SplitMix64.MASK;
    let value = this.state;
    value = ((value ^ (value >> 30n)) * 0xbf58476d1ce4e5b9n) & SplitMix64.MASK;
    value = ((value ^ (value >> 27n)) * 0x94d049bb133111ebn) & SplitMix64.MASK;
    value ^= value >> 31n;
    return Number(value >> 11n) / 9_007_199_254_740_992;
  }

  integer(maxExclusive: number): number {
    return Math.floor(this.nextUnit() * maxExclusive);
  }
}

function shuffled<T>(values: T[], rng: SplitMix64): T[] {
  const copy = [...values];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = rng.integer(index + 1);
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function permutationSummary(blocks: Block[], observed: Statistic) {
  const values: number[] = [];
  let extremeCount = 0;
  for (let replicate = 0; replicate < PERMUTATIONS; replicate += 1) {
    const rng = new SplitMix64(`${PERMUTATION_STREAM_NAME}\u0000${replicate}`);
    const permutedBlocks = blocks.map((block) => {
      const outcomes = shuffled(block.rows.map((row) => row.outcome), rng);
      return {
        key: block.key,
        rows: block.rows.map((row, index) => ({ ...row, outcome: outcomes[index] })),
      };
    });
    const statistic = statisticForBlocks(permutedBlocks).normalizedCmi;
    if (statistic === null) continue;
    values.push(statistic);
    if (observed.normalizedCmi !== null && statistic >= observed.normalizedCmi) {
      extremeCount += 1;
    }
  }
  const pValue =
    observed.normalizedCmi === null
      ? null
      : (1 + extremeCount) / (PERMUTATIONS + 1);
  return {
    values,
    completed: values.length,
    extremeCount,
    pValue,
  };
}

function quantile(values: number[], probability: number): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((left, right) => left - right);
  const position = (sorted.length - 1) * probability;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function mean(values: number[]): number | null {
  return values.length === 0 ? null : values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]): number | null {
  return quantile(values, 0.5);
}

function standardDeviation(values: number[]): number | null {
  const average = mean(values);
  if (average === null) return null;
  return Math.sqrt(
    values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length,
  );
}

function bootstrapSummary(blocks: Block[]) {
  const values: number[] = [];
  let undefinedReplicates = 0;
  for (let replicate = 0; replicate < BOOTSTRAP_REPLICATES; replicate += 1) {
    const rng = new SplitMix64(`${BOOTSTRAP_STREAM_NAME}\u0000${replicate}`);
    const sampledBlocks = Array.from({ length: blocks.length }, () =>
      blocks[rng.integer(blocks.length)],
    );
    const statistic = statisticForBlocks(sampledBlocks).normalizedCmi;
    if (statistic === null) undefinedReplicates += 1;
    else values.push(statistic);
  }
  return {
    completed: BOOTSTRAP_REPLICATES,
    valid: values.length,
    undefined: undefinedReplicates,
    mean: mean(values),
    median: median(values),
    lower: quantile(values, (1 - UNCERTAINTY_LEVEL) / 2),
    upper: quantile(values, 1 - (1 - UNCERTAINTY_LEVEL) / 2),
  };
}

function zcDiagnostics(blocks: Block[]) {
  const zc = new Set<string>();
  const gammaToZc = new Map<string, Set<string>>();
  const zcToGamma = new Map<string, Set<string>>();
  let multipleZcGroups = 0;
  for (const block of blocks) {
    const groupZc = new Set<string>();
    for (const row of block.rows) {
      zc.add(row.zc);
      groupZc.add(row.zc);
      const gammaValues = gammaToZc.get(row.gamma) ?? new Set<string>();
      gammaValues.add(row.zc);
      gammaToZc.set(row.gamma, gammaValues);
      const zcValues = zcToGamma.get(row.zc) ?? new Set<string>();
      zcValues.add(row.gamma);
      zcToGamma.set(row.zc, zcValues);
    }
    if (groupZc.size > 1) multipleZcGroups += 1;
  }
  const gammaWithMultipleZc = [...gammaToZc.values()].filter((values) => values.size > 1).length;
  const zcWithMultipleGamma = [...zcToGamma.values()].filter((values) => values.size > 1).length;
  return {
    distinctZcSignatures: zc.size,
    vGroupsWithMultipleZcSignatures: multipleZcGroups,
    gammaToZcSingleValued: gammaWithMultipleZc === 0,
    gammaClassesWithMultipleZc: gammaWithMultipleZc,
    zcClassesWithMultipleGamma: zcWithMultipleGamma,
  };
}

function populationDigest(units: Unit[]): string {
  return sha256Bytes(
    Buffer.from(
      stableJson(
        units.map((unit) => ({
          form: sha256Bytes(Buffer.from(unit.formKey, "utf8")),
          voice: sha256Bytes(Buffer.from(unit.voiceKey, "utf8")),
          gamma: sha256Bytes(Buffer.from(unit.gamma, "utf8")),
          zc: sha256Bytes(Buffer.from(unit.zc, "utf8")),
          outcome: sha256Bytes(Buffer.from(unit.outcome, "utf8")),
        })),
      ),
      "utf8",
    ),
  );
}

function writeCanonicalJson(filePath: string, value: unknown): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${stableJson(value)}\n`, "utf8");
}

export function executeExperiment(): void {
  assertFrozenInputs();
  const gammaFirstExposure = new Date().toISOString();
  const stageA = readJson<StageAArtifact>(STAGE_A_PATH);
  const structural = loadStructuralArtifact();
  const { units, sourceMatchedForms, directMatchForms, oneVariantForms } =
    buildUnits(stageA, structural);
  const blocks = candidateBlocks(units);

  if (
    sourceMatchedForms !== 94632 ||
    directMatchForms !== 3678 ||
    units.length !== 3283 ||
    blocks.length !== 255 ||
    blocks.reduce((sum, block) => sum + block.rows.length, 0) !== 2974
  ) {
    throw new Error("INVALID_ASSUMPTION_FAILURE:CONFIRMATORY_GEOMETRY_MISMATCH");
  }

  const diagnostics = structuralDiagnostics(blocks);
  const observed = statisticForBlocks(blocks);
  const permutation = permutationSummary(blocks, observed);
  const bootstrap = bootstrapSummary(blocks);
  const zc = zcDiagnostics(blocks);
  const classification =
    observed.normalizedCmi === null || bootstrap.lower === null
      ? "INCONCLUSIVE_INSUFFICIENT_EFFECTIVE_SUPPORT"
      : permutation.pValue !== null &&
          permutation.pValue <= ALPHA &&
          bootstrap.lower > 0
        ? "SUPPORTED_BOUNDED_ASSOCIATION"
        : "NULL_NO_DETECTABLE_ASSOCIATION";

  const sourceIdentities = {
    stageA: fileIdentity(STAGE_A_PATH),
    stageB: fileIdentity(STAGE_B_PATH),
    directDistribution: fileIdentity(DIRECT_DISTRIBUTION_PATH),
    canonicalVoice: fileIdentity(CANONICAL_VOICE_PATH),
    structural: fileIdentity(repoPath(STRUCTURAL_PATH)),
    preregistration: fileIdentity(repoPath(PREREGISTRATION_PATH)),
  };
  const result = {
    schemaVersion: "open-instrument.functional-manifestation-result.v0_1",
    experimentId: EXPERIMENT_ID,
    status: "COMPLETED_RESULT_PRESERVED",
    execution: {
      attemptCount: 1,
      noRerun: true,
      syntheticOnly: false,
      realDataExecuted: false,
      adaptiveReplication: false,
      replacementReplicates: false,
      gammaFirstExposureOccurred: true,
      gammaFirstExposureUtc: gammaFirstExposure,
      repositoryHead: "c1cdda0616812dede4f7bcb6ef1b9899563586f5",
      runnerPath: RUNNER_PATH,
      runnerSha256: sha256File(repoPath(RUNNER_PATH)),
      permutationStreamName: PERMUTATION_STREAM_NAME,
      bootstrapStreamName: BOOTSTRAP_STREAM_NAME,
      randomizationMethod:
        "SplitMix64 seeded by SHA-256(stream-name\u0000replicate-index); Fisher-Yates; no outcome-dependent seed",
      finiteRandomizationPValue:
        "(1 + null statistics >= observed statistic) / (permutations + 1)",
      quantileMethod: "linear interpolation over sorted values",
    },
    preregistration: {
      contractId: "OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_PREREGISTRATION_V0_1",
      status: "FROZEN_PREREGISTRATION_CONTRACT_ONLY",
      sha256: EXPECTED_HASHES.preregistration,
      designChanged: false,
    },
    frozenInputs: sourceIdentities,
    confirmatoryPopulation: {
      sourceMatchedForms,
      directMatchFormsBeforeVariantPolicy: directMatchForms,
      directIndependentUnitsAfterVariantPolicy: units.length,
      candidateVariationVoiceGroups: blocks.length,
      candidateVariationUnits: blocks.reduce((sum, block) => sum + block.rows.length, 0),
      propertyIdsRepresented: new Set(
        units.flatMap((unit) => JSON.parse(unit.outcome).directPropertyIds),
      ).size,
      oneVariantForms,
      populationDigestSha256: populationDigest(units),
    },
    effectiveStructuralSupport: diagnostics,
    morphologyDiagnostic: {
      available: false,
      reason: "No existing frozen morphology-family identity relation is present in the admitted inputs; no spelling or external morphology was introduced.",
    },
    primaryStatistic: {
      observedConditionalMutualInformation: observed.normalizedCmi,
      normalizationDefinition: "I(Gamma;Outcome|V) / H(Outcome|V), natural logarithms",
      observedGSquaredEquivalent: observed.gSquared,
      totalEffectiveUnits: observed.totalUnits,
      totalEffectiveVoiceGroups: blocks.length,
    },
    permutationTest: {
      requested: PERMUTATIONS,
      completed: permutation.completed,
      streamName: PERMUTATION_STREAM_NAME,
      nullStatisticMean: mean(permutation.values),
      nullStatisticMedian: median(permutation.values),
      nullStatisticSd: standardDeviation(permutation.values),
      nullStatisticMin: permutation.values.length ? Math.min(...permutation.values) : null,
      nullStatisticMax: permutation.values.length ? Math.max(...permutation.values) : null,
      extremeCount: permutation.extremeCount,
      pValue: permutation.pValue,
      alpha: ALPHA,
    },
    bootstrapUncertainty: {
      requested: BOOTSTRAP_REPLICATES,
      completed: bootstrap.completed,
      valid: bootstrap.valid,
      undefined: bootstrap.undefined,
      mean: bootstrap.mean,
      median: bootstrap.median,
      lower95: bootstrap.lower,
      upper95: bootstrap.upper,
      level: UNCERTAINTY_LEVEL,
      blockUnit: "canonical Voice group",
    },
    zcDescriptiveOnly: {
      ...zc,
      secondaryInferentialTestExecuted: false,
    },
    decision: {
      classification,
      primaryTestCount: 1,
      secondaryInferentialTestCount: 0,
      postExposureDesignChange: false,
      rationale:
        classification === "SUPPORTED_BOUNDED_ASSOCIATION"
          ? "Frozen nondegenerate primary test meets alpha and the frozen lower uncertainty bound is positive."
          : classification === "NULL_NO_DETECTABLE_ASSOCIATION"
            ? "Frozen nondegenerate primary test does not meet the alpha and positive-lower-bound criteria."
            : "Frozen structural support or uncertainty calculation is degenerate or undefined.",
    },
    claimBoundary: {
      functionalCausalityEstablished: false,
      intrinsicConsonantMeaningEstablished: false,
      universalSemanticsEstablished: false,
      historicalOriginEstablished: false,
      albanianDerivationEstablished: false,
      productionSemanticAuthority: false,
    },
  };

  const tempResultPath = `/tmp/open-instrument-functional-manifestation-v0.1-result.json`;
  writeCanonicalJson(tempResultPath, result);
  const durableResultPath = repoPath(RESULT_PATH);
  fs.mkdirSync(path.dirname(durableResultPath), { recursive: true });
  fs.copyFileSync(tempResultPath, durableResultPath);

  const executionIdentity = {
    manifestVersion: "open-instrument.functional-manifestation-execution-identity.v0_1",
    experimentId: EXPERIMENT_ID,
    repositoryHead: result.execution.repositoryHead,
    executionBranch: "codex/open-instrument-functional-manifestation-experiment-v0-1",
    runnerPath: RUNNER_PATH,
    runnerSha256: result.execution.runnerSha256,
    preregistrationSha256: EXPECTED_HASHES.preregistration,
    permutationStreamName: PERMUTATION_STREAM_NAME,
    bootstrapStreamName: BOOTSTRAP_STREAM_NAME,
    permutationCount: PERMUTATIONS,
    bootstrapReplicates: BOOTSTRAP_REPLICATES,
    attemptCount: 1,
    noRerun: true,
    realDataExecuted: false,
    resultPath: RESULT_PATH,
    resultSha256: sha256File(durableResultPath),
    resultBytes: fs.statSync(durableResultPath).size,
  };
  const identityPath = repoPath(EXECUTION_IDENTITY_PATH);
  writeCanonicalJson(identityPath, executionIdentity);

  const manifest = {
    manifestVersion: "open-instrument.artifact-hash-manifest.v0_1",
    contractId: "OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_EXPERIMENT_V0_1",
    status: "COMPLETED_RESULT_PRESERVED",
    experimentExecuted: true,
    executionAttemptCount: 1,
    noRerun: true,
    realDataExecuted: false,
    productionAuthorityChanged: false,
    repositoryHead: result.execution.repositoryHead,
    executionBranch: executionIdentity.executionBranch,
    finalClassification: classification,
    artifacts: [
      { path: RESULT_PATH, sha256: sha256File(durableResultPath), byteLength: fs.statSync(durableResultPath).size },
      { path: EXECUTION_IDENTITY_PATH, sha256: sha256File(identityPath), byteLength: fs.statSync(identityPath).size },
      { path: RUNNER_PATH, sha256: result.execution.runnerSha256, byteLength: fs.statSync(repoPath(RUNNER_PATH)).size },
      { path: PREREGISTRATION_PATH, sha256: EXPECTED_HASHES.preregistration, byteLength: fs.statSync(repoPath(PREREGISTRATION_PATH)).size },
      ...Object.values(sourceIdentities).map((identity) => ({
        path: identity.path,
        sha256: identity.sha256,
        byteLength: identity.bytes,
      })),
    ],
  };
  writeCanonicalJson(repoPath(HASH_MANIFEST_PATH), manifest);

  console.log(`FUNCTIONAL_MANIFESTATION_RESULT=${classification}`);
  console.log(`RESULT_PATH=${RESULT_PATH}`);
  console.log(`RESULT_SHA256=${sha256File(durableResultPath)}`);
  console.log(`RESULT_BYTES=${fs.statSync(durableResultPath).size}`);
  console.log(`MANIFEST_PATH=${HASH_MANIFEST_PATH}`);
  console.log(`MANIFEST_SHA256=${sha256File(repoPath(HASH_MANIFEST_PATH))}`);
  console.log("AUTHORITATIVE_EXECUTION_ATTEMPTS=1");
  console.log("RERUN=NO");
  console.log("REAL_DATA_EXECUTED=NO");
}

if (process.argv.includes("--execute")) {
  executeExperiment();
}

export { SplitMix64, compareCodePoint, stableJson };
