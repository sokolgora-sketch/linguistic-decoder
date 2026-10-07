import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  BROADER_DIAGNOSTIC_EXPECTED_PREPARED_POPULATION_COUNT_V0_2,
  BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2,
  BROADER_DIAGNOSTIC_SELECTION_ID_V0_2,
  MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_PROCEDURE_ID_V0_2,
  MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_SCHEMA_VERSION_V0_2,
  reconstructBroaderDiagnosticPreparedPopulationV0_2,
  selectBroaderDiagnosticPreparedInputsV0_2,
  selectBroaderDiagnosticPreparedPositionsV0_2,
  sha256BroaderDiagnosticSelectionV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateBroaderDiagnostic.v0_2";
import {
  genericQueryKeysForWordV0_2,
  reconstructS3SubstrateStatesV0_2,
  sha256FileV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS3.v0_2";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";

export const BROADER_DIAGNOSTIC_RESULT_DIRECTORY_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1" as const;
export const BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2 =
  `${BROADER_DIAGNOSTIC_RESULT_DIRECTORY_V0_2}/sample.json` as const;
export const BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2 =
  `${BROADER_DIAGNOSTIC_RESULT_DIRECTORY_V0_2}/results.json` as const;
export const BROADER_DIAGNOSTIC_SUMMARY_ARTIFACT_PATH_V0_2 =
  `${BROADER_DIAGNOSTIC_RESULT_DIRECTORY_V0_2}/summary.json` as const;
export const BROADER_DIAGNOSTIC_HASH_MANIFEST_PATH_V0_2 =
  `${BROADER_DIAGNOSTIC_RESULT_DIRECTORY_V0_2}/hash-manifest.json` as const;

const PROCEDURE_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-procedure-v0.1/procedure.json";
const PROCEDURE_MANIFEST_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-procedure-v0.1/hash-manifest.json";
const S3_SAMPLE_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1/sample.json";
const S3_PAIRED_RESULTS_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1/paired-results.json";
const S3_SUMMARY_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1/summary.json";
const S3_MANIFEST_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1/hash-manifest.json";
const QUERY_GENERATOR_PATH_V0_2 = "src/shared/openInstrument/multilingualDiscoverySubstrateS3.v0_2.ts";
const STRUCTURAL_NORMALIZER_PATH_V0_2 = "src/shared/structuralHypothesisDiscovery.v0_1.ts";
const MATCHING_ADAPTER_PATH_V0_2 = "src/shared/openInstrument/genericFunctionalWitnessSourceAcquisition.v1.ts";
const EXECUTION_WRAPPER_PATH_V0_2 =
  "scripts/openInstrumentMultilingualDiscoveryBroaderDiagnosticExecution.v0_2.ts";

const EXPECTED_PROCEDURE_SHA256_V0_2 =
  "c84bfa8214c7abedd9da80124f304cc6f42cabb856913d22f7bcecee7e7b0c29";
const EXPECTED_PROCEDURE_MANIFEST_SHA256_V0_2 =
  "174c63d3e17bc0af4d3228d51b521c899df88f5502919be901612b47eec4e201";
const EXPECTED_S3_SAMPLE_SHA256_V0_2 =
  "8ba957d57f5f2509f2acc2b875a5427e075942d2a9c52d63b9208590045cc2cd";
const EXPECTED_S3_PAIRED_RESULTS_SHA256_V0_2 =
  "b703051f8d6020548f93dc9a6591b22278f467bb0c521871b31aafb47be4ca03";
const EXPECTED_S3_SUMMARY_SHA256_V0_2 =
  "1985db5f7d8d7fd59c6ca741f30d1814ffa469f95c141ff7e9aef109da11ebea";
const EXPECTED_S3_MANIFEST_SHA256_V0_2 =
  "7fa23b2eb80cc2b78ecd880295d71f5a542e561918747cdf7082bf76f2055497";
const EXPECTED_QUERY_GENERATOR_SHA256_V0_2 =
  "dd4a01e61c0e37846a0416242b347f499ed135e608eecf446a58bc83da079220";
const EXPECTED_STRUCTURAL_NORMALIZER_SHA256_V0_2 =
  "96fba8363df8b3d59caf6d7dc9ac9ad88007d15432bec4b647b83484a25555db";
const EXPECTED_MATCHING_ADAPTER_SHA256_V0_2 =
  "f49ff4f0b877887b466002ce465feb58adbb07204cc6560c3caaa0364d95a0a0";
const EXPECTED_SUBSTRATE_FINGERPRINT_V0_2 =
  "1c4714a1d9a7550c1c037b4ce62ca85e9ff24966f2e8d447c038bce001b45d81";

const EXPECTED_ASCII_LATIN_KEYS_V0_2 = [
  "AMO", "ARBOR", "ARS", "CAELUM", "FAMILIARIS", "FRANGO", "MARE",
  "NIMBUS", "NIX", "ORDO", "PELLIS", "SOMNUS", "STELLA",
] as const;
const EXPECTED_DIACRITIC_LATIN_KEYS_V0_2 = [
  "CAERŬLĔUS", "LĪBERTAS", "MŪTĀTIŌ", "PĀNIS", "SPĒS", "VĪSĬO", "VĬR", "ĂQUA",
] as const;

type JsonObject = Record<string, unknown>;

type FrozenProcedure = Readonly<{
  procedureId: string;
  schemaVersion: string;
  status: string;
  populationAuthority: Readonly<{
    rawSourceVariantCount: number;
    eligibleNormalizedAsciiWordCount: number;
    preparedPopulationCount: number;
  }>;
  samplingDesign: Readonly<{
    selectedDesign: string;
    selectionId: string;
    sampleSize: number;
    stratumCount: number;
    seed: null;
  }>;
  substrateAuthority: Readonly<{
    total: number;
    languageCounts: Readonly<Record<string, number>>;
    fingerprint: string;
    asciiLatinKeys: readonly string[];
    diacriticLatinKeys: readonly string[];
  }>;
  executionFirewall: Readonly<{
    authoritativeAttempts: number;
    resultArtifactCreated: boolean;
  }>;
}>;

type DiagnosticCase = Readonly<{
  input: string;
  rawPopulationPosition: number;
  preparedPopulationPosition: number;
  selectedPopulationPosition: number;
  valid: boolean;
  invalidReason: string | null;
  pronunciationStatus: string;
  pronunciationReason: string | null;
  canonicalVoicePathLength: number;
  generatedQueryKeys: readonly string[];
  substrateIntersections: readonly string[];
}>;

type ReachedKey = Readonly<{
  key: string;
  language: string;
  inputCount: number;
  inputs: readonly string[];
  sourceRecordIds: readonly string[];
}>;

function readJson<T>(rootDir: string, relativePath: string): T {
  return JSON.parse(readFileSync(join(rootDir, relativePath), "utf8")) as T;
}

function writeJson(rootDir: string, relativePath: string, value: unknown): void {
  writeFileSync(
    join(rootDir, relativePath),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8",
  );
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sameSet(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function currentHead(rootDir: string): string {
  return execFileSync("git", ["rev-parse", "HEAD"], { cwd: rootDir, encoding: "utf8" }).trim();
}

function preflight(rootDir: string): Readonly<{
  procedure: FrozenProcedure;
  procedureSha256: string;
  procedureManifestSha256: string;
  repositoryHead: string;
  executionWrapperSha256: string;
  substrate: ReturnType<typeof reconstructS3SubstrateStatesV0_2>;
}> {
  const resultDirectory = join(rootDir, BROADER_DIAGNOSTIC_RESULT_DIRECTORY_V0_2);
  if (existsSync(resultDirectory)) {
    throw new Error("BROADER_DIAGNOSTIC_RESULT_DIRECTORY_ALREADY_EXISTS");
  }
  const procedure = readJson<FrozenProcedure>(rootDir, PROCEDURE_PATH_V0_2);
  const procedureSha256 = sha256FileV0_2(rootDir, PROCEDURE_PATH_V0_2);
  const procedureManifestSha256 = sha256FileV0_2(rootDir, PROCEDURE_MANIFEST_PATH_V0_2);
  if (
    procedureSha256 !== EXPECTED_PROCEDURE_SHA256_V0_2 ||
    procedureManifestSha256 !== EXPECTED_PROCEDURE_MANIFEST_SHA256_V0_2 ||
    procedure.procedureId !== MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_PROCEDURE_ID_V0_2 ||
    procedure.schemaVersion !== MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_SCHEMA_VERSION_V0_2 ||
    procedure.status !== "DEFINED_NOT_EXECUTED" ||
    procedure.samplingDesign.selectionId !== BROADER_DIAGNOSTIC_SELECTION_ID_V0_2 ||
    procedure.samplingDesign.sampleSize !== BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2 ||
    procedure.samplingDesign.stratumCount !== BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2 ||
    procedure.samplingDesign.seed !== null ||
    procedure.executionFirewall.authoritativeAttempts !== 0 ||
    procedure.executionFirewall.resultArtifactCreated !== false ||
    procedure.populationAuthority.rawSourceVariantCount !== 135166 ||
    procedure.populationAuthority.eligibleNormalizedAsciiWordCount !== 117473 ||
    procedure.populationAuthority.preparedPopulationCount !== BROADER_DIAGNOSTIC_EXPECTED_PREPARED_POPULATION_COUNT_V0_2 ||
    procedure.substrateAuthority.total !== 76 ||
    procedure.substrateAuthority.languageCounts.Albanian !== 55 ||
    procedure.substrateAuthority.languageCounts.Latin !== 21 ||
    procedure.substrateAuthority.languageCounts.Other !== 0 ||
    procedure.substrateAuthority.fingerprint !== EXPECTED_SUBSTRATE_FINGERPRINT_V0_2 ||
    JSON.stringify(procedure.substrateAuthority.asciiLatinKeys) !== JSON.stringify(EXPECTED_ASCII_LATIN_KEYS_V0_2) ||
    JSON.stringify(procedure.substrateAuthority.diacriticLatinKeys) !== JSON.stringify(EXPECTED_DIACRITIC_LATIN_KEYS_V0_2)
  ) {
    throw new Error("BLOCKED_FROZEN_AUTHORITY_MISMATCH");
  }

  const s3Hashes = [
    [S3_SAMPLE_PATH_V0_2, EXPECTED_S3_SAMPLE_SHA256_V0_2],
    [S3_PAIRED_RESULTS_PATH_V0_2, EXPECTED_S3_PAIRED_RESULTS_SHA256_V0_2],
    [S3_SUMMARY_PATH_V0_2, EXPECTED_S3_SUMMARY_SHA256_V0_2],
    [S3_MANIFEST_PATH_V0_2, EXPECTED_S3_MANIFEST_SHA256_V0_2],
  ] as const;
  if (s3Hashes.some(([path, expected]) => sha256FileV0_2(rootDir, path) !== expected)) {
    throw new Error("BLOCKED_S3_AUTHORITY_MISMATCH");
  }
  const s3Manifest = readJson<JsonObject>(rootDir, S3_MANIFEST_PATH_V0_2);
  const s3Execution = s3Manifest.execution as JsonObject;
  if (s3Execution.attempts !== 1 || s3Execution.noRerun !== true) {
    throw new Error("BLOCKED_S3_AUTHORITY_MISMATCH");
  }

  if (
    sha256FileV0_2(rootDir, QUERY_GENERATOR_PATH_V0_2) !== EXPECTED_QUERY_GENERATOR_SHA256_V0_2 ||
    sha256FileV0_2(rootDir, STRUCTURAL_NORMALIZER_PATH_V0_2) !== EXPECTED_STRUCTURAL_NORMALIZER_SHA256_V0_2 ||
    sha256FileV0_2(rootDir, MATCHING_ADAPTER_PATH_V0_2) !== EXPECTED_MATCHING_ADAPTER_SHA256_V0_2
  ) {
    throw new Error("BLOCKED_FROZEN_AUTHORITY_MISMATCH");
  }

  const substrate = reconstructS3SubstrateStatesV0_2(rootDir);
  const latinKeys = substrate.after.latinRecords.map((record) => record.lookupForm).sort(compareText);
  const asciiLatinKeys = latinKeys.filter((key) => /^[A-Z]+$/u.test(key));
  const diacriticLatinKeys = latinKeys.filter((key) => !/^[A-Z]+$/u.test(key));
  if (
    substrate.after.total !== 76 ||
    substrate.after.languageCounts.Albanian !== 55 ||
    substrate.after.languageCounts.Latin !== 21 ||
    substrate.after.fingerprint !== EXPECTED_SUBSTRATE_FINGERPRINT_V0_2 ||
    JSON.stringify(asciiLatinKeys) !== JSON.stringify(EXPECTED_ASCII_LATIN_KEYS_V0_2) ||
    JSON.stringify(diacriticLatinKeys) !== JSON.stringify(EXPECTED_DIACRITIC_LATIN_KEYS_V0_2)
  ) {
    throw new Error("BLOCKED_FROZEN_AUTHORITY_MISMATCH");
  }

  return {
    procedure,
    procedureSha256,
    procedureManifestSha256,
    repositoryHead: currentHead(rootDir),
    executionWrapperSha256: sha256FileV0_2(rootDir, EXECUTION_WRAPPER_PATH_V0_2),
    substrate,
  };
}

function materializeSample(
  rootDir: string,
  procedureSha256: string,
  procedureManifestSha256: string,
  repositoryHead: string,
) {
  const population = reconstructBroaderDiagnosticPreparedPopulationV0_2(rootDir);
  if (
    population.raw.length !== 117473 ||
    population.prepared.length !== BROADER_DIAGNOSTIC_EXPECTED_PREPARED_POPULATION_COUNT_V0_2
  ) {
    throw new Error("BLOCKED_FROZEN_AUTHORITY_MISMATCH");
  }
  const positions = selectBroaderDiagnosticPreparedPositionsV0_2(
    population.prepared.length,
    BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2,
  );
  const inputs = selectBroaderDiagnosticPreparedInputsV0_2(
    population.prepared,
    BROADER_DIAGNOSTIC_SAMPLE_SIZE_V0_2,
  );
  const selectedIdentities = positions.map((position, index) => ({
    stratumIndex: index,
    preparedPopulationPosition: position,
    rawPopulationPosition: population.rawPositionByWord.get(inputs[index]!)!,
    input: inputs[index]!,
  }));
  const sampleIdentitySha256 = sha256BroaderDiagnosticSelectionV0_2(inputs);
  if (
    positions.length !== 1024 ||
    inputs.length !== 1024 ||
    new Set(inputs).size !== 1024 ||
    positions[0] !== 1 ||
    positions.at(-1) !== 117275 ||
    selectedIdentities.some((entry, index) => entry.input !== inputs[index] || entry.preparedPopulationPosition !== positions[index])
  ) {
    throw new Error("BROADER_DIAGNOSTIC_SAMPLE_IDENTITY_MISMATCH");
  }
  const sample = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-broader-stratified-diagnostic-v0.1.sample",
    status: "FROZEN_BEFORE_QUERY_GENERATION",
    procedureId: MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_PROCEDURE_ID_V0_2,
    procedureSha256,
    procedureManifestSha256,
    repositoryExecutionHead: repositoryHead,
    selectionId: BROADER_DIAGNOSTIC_SELECTION_ID_V0_2,
    sampleSize: 1024,
    preparedPopulationCount: population.prepared.length,
    stratumCount: 1024,
    seed: null,
    orderingRule: "NFC, trim, lower-case existing CMUdict normalization; ASCII alphabetic; deduplicated; Unicode code-point ascending",
    queryGenerationStartedAtFreeze: false,
    positions,
    selectedIdentities,
    sampleIdentitySha256,
  } as const;
  mkdirSync(join(rootDir, BROADER_DIAGNOSTIC_RESULT_DIRECTORY_V0_2), { recursive: true });
  writeJson(rootDir, BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2, sample);
  return { population, positions, inputs, sample, sampleSha256: sha256FileV0_2(rootDir, BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2) } as const;
}

function classifyInterpretation(
  reachedKeys: readonly string[],
  s3ReachedKeys: readonly string[],
  asciiLatinReached: readonly string[],
): string {
  if (sameSet(reachedKeys, s3ReachedKeys)) return "CLASS_A_BROADER_SAMPLE_REVEALS_NO_ADDITIONAL_SUBSTRATE_KEYS";
  if (asciiLatinReached.length > 0) return "CLASS_C_BROADER_SAMPLE_REVEALS_ONE_OR_MORE_ASCII_LATIN_KEYS";
  if (reachedKeys.some((key) => !s3ReachedKeys.includes(key)) && asciiLatinReached.length === 0) {
    return "CLASS_B_BROADER_SAMPLE_REVEALS_ADDITIONAL_EXISTING_SUBSTRATE_KEYS_BUT_NO_LATIN";
  }
  return "CLASS_D_OTHER_PREDECLARED_RESULT";
}

function storedS3ReachedKeys(rootDir: string): readonly string[] {
  const paired = readJson<JsonObject>(rootDir, S3_PAIRED_RESULTS_PATH_V0_2);
  const cases = Array.isArray(paired.cases) ? paired.cases : [];
  return [...new Set(cases.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const after = (entry as JsonObject).after;
    if (!after || typeof after !== "object") return [];
    const candidates = (after as JsonObject).candidates;
    if (!Array.isArray(candidates)) return [];
    return candidates.flatMap((candidate) => {
      if (!candidate || typeof candidate !== "object") return [];
      const matchedQuery = (candidate as JsonObject).matchedQuery;
      return typeof matchedQuery === "string" ? [matchedQuery] : [];
    });
  }))].sort(compareText);
}

function aggregateCases(
  cases: readonly DiagnosticCase[],
  substrateByKey: ReadonlyMap<string, Readonly<{ language: string; sourceRecordIds: readonly string[] }>>,
) {
  const validCases = cases.filter((entry) => entry.valid);
  const queryKeys = [...new Set(validCases.flatMap((entry) => entry.generatedQueryKeys))].sort(compareText);
  const reachedKeys = [...new Set(validCases.flatMap((entry) => entry.substrateIntersections))].sort(compareText);
  const reachedAlbanianKeys = reachedKeys.filter((key) => substrateByKey.get(key)?.language === "Albanian");
  const reachedLatinKeys = reachedKeys.filter((key) => substrateByKey.get(key)?.language === "Latin");
  const reachedAsciiLatinKeys = reachedLatinKeys.filter((key) => /^[A-Z]+$/u.test(key));
  const reachedDiacriticLatinKeys = reachedLatinKeys.filter((key) => !/^[A-Z]+$/u.test(key));
  const generatedKeysWithAnySubstrateRecord = new Set(validCases.flatMap((entry) => entry.substrateIntersections));
  const reachedKeyDetails: ReachedKey[] = reachedKeys.map((key) => {
    const inputs = validCases.filter((entry) => entry.substrateIntersections.includes(key)).map((entry) => entry.input);
    const substrate = substrateByKey.get(key)!;
    return {
      key,
      language: substrate.language,
      inputCount: inputs.length,
      inputs,
      sourceRecordIds: [...substrate.sourceRecordIds].sort(compareText),
    };
  });
  const rate = (numerator: number, denominator: number): number | null => denominator === 0 ? null : numerator / denominator;
  return {
    inputCount: cases.length,
    validInputCount: validCases.length,
    invalidOrUnreachableInputCount: cases.length - validCases.length,
    totalQueryKeyOccurrences: validCases.reduce((sum, entry) => sum + entry.generatedQueryKeys.length, 0),
    distinctQueryKeys: queryKeys.length,
    distinctSubstrateKeysReached: reachedKeys.length,
    distinctAlbanianKeysReached: reachedAlbanianKeys.length,
    distinctLatinKeysReached: reachedLatinKeys.length,
    distinctAsciiLatinKeysReached: reachedAsciiLatinKeys.length,
    distinctDiacriticLatinKeysReached: reachedDiacriticLatinKeys.length,
    generatedKeysWithAnySubstrateRecord: generatedKeysWithAnySubstrateRecord.size,
    generatedKeysWithNoSubstrateRecord: queryKeys.length - generatedKeysWithAnySubstrateRecord.size,
    generatedKeySubstrateCoverageRate: rate(generatedKeysWithAnySubstrateRecord.size, queryKeys.length),
    substrateKeyReachabilityRate: rate(reachedKeys.length, 76),
    albanianSubstrateKeyReachabilityRate: rate(reachedAlbanianKeys.length, 55),
    latinSubstrateKeyReachabilityRate: rate(reachedLatinKeys.length, 21),
    asciiLatinSubstrateKeyReachabilityRate: rate(reachedAsciiLatinKeys.length, 13),
    inputsWithAnySubstrateIntersection: validCases.filter((entry) => entry.substrateIntersections.length > 0).length,
    inputsWithAlbanianIntersection: validCases.filter((entry) => entry.substrateIntersections.some((key) => reachedAlbanianKeys.includes(key))).length,
    inputsWithLatinIntersection: validCases.filter((entry) => entry.substrateIntersections.some((key) => reachedLatinKeys.includes(key))).length,
    multipleSubstrateKeyInputs: validCases.filter((entry) => entry.substrateIntersections.length > 1).length,
    reachedKeys,
    reachedAlbanianKeys,
    reachedLatinKeys,
    reachedAsciiLatinKeys,
    reachedDiacriticLatinKeys,
    reachedKeyDetails,
  } as const;
}

export function executeBroaderDiagnosticOnceV0_2(rootDir = process.cwd()) {
  const authority = preflight(rootDir);
  const sample = materializeSample(
    rootDir,
    authority.procedureSha256,
    authority.procedureManifestSha256,
    authority.repositoryHead,
  );
  const substrateByKey = new Map(
    authority.substrate.after.records.map((record) => [record.queryForm, {
      language: record.language,
      sourceRecordIds: [record.sourceRecordId],
    }]),
  );
  const cases: DiagnosticCase[] = [];
  const invalidReasonCounts = new Map<string, number>();

  for (const identity of sample.sample.selectedIdentities) {
    const heart = buildHeartInstrumentV1(identity.input);
    const canonicalVoicePathLength = heart.canonicalSpokenVoicePath?.length ?? 0;
    const pronunciationUsable = heart.spokenPronunciation.status === "defined" &&
      Array.isArray(heart.canonicalSpokenVoicePath) && heart.canonicalSpokenVoicePath.length > 0;
    if (!pronunciationUsable) {
      const reason = heart.spokenPronunciation.status === "defined"
        ? "CANONICAL_VOICE_PATH_EMPTY"
        : `PRONUNCIATION_UNUSABLE:${heart.spokenPronunciation.reasonCode ?? "UNKNOWN"}`;
      invalidReasonCounts.set(reason, (invalidReasonCounts.get(reason) ?? 0) + 1);
      cases.push({
        input: identity.input,
        rawPopulationPosition: identity.rawPopulationPosition,
        preparedPopulationPosition: identity.preparedPopulationPosition,
        selectedPopulationPosition: identity.stratumIndex + 1,
        valid: false,
        invalidReason: reason,
        pronunciationStatus: heart.spokenPronunciation.status,
        pronunciationReason: heart.spokenPronunciation.reasonCode,
        canonicalVoicePathLength,
        generatedQueryKeys: [],
        substrateIntersections: [],
      });
      continue;
    }
    let generatedQueryKeys: readonly string[];
    try {
      generatedQueryKeys = genericQueryKeysForWordV0_2(identity.input);
    } catch {
      const reason = "STRUCTURAL_QUERY_GENERATION_FAILURE";
      invalidReasonCounts.set(reason, (invalidReasonCounts.get(reason) ?? 0) + 1);
      cases.push({
        input: identity.input,
        rawPopulationPosition: identity.rawPopulationPosition,
        preparedPopulationPosition: identity.preparedPopulationPosition,
        selectedPopulationPosition: identity.stratumIndex + 1,
        valid: false,
        invalidReason: reason,
        pronunciationStatus: heart.spokenPronunciation.status,
        pronunciationReason: heart.spokenPronunciation.reasonCode,
        canonicalVoicePathLength,
        generatedQueryKeys: [],
        substrateIntersections: [],
      });
      continue;
    }
    if (generatedQueryKeys.length === 0) {
      const reason = "NO_GENERIC_QUERY_KEYS";
      invalidReasonCounts.set(reason, (invalidReasonCounts.get(reason) ?? 0) + 1);
      cases.push({
        input: identity.input,
        rawPopulationPosition: identity.rawPopulationPosition,
        preparedPopulationPosition: identity.preparedPopulationPosition,
        selectedPopulationPosition: identity.stratumIndex + 1,
        valid: false,
        invalidReason: reason,
        pronunciationStatus: heart.spokenPronunciation.status,
        pronunciationReason: heart.spokenPronunciation.reasonCode,
        canonicalVoicePathLength,
        generatedQueryKeys: [],
        substrateIntersections: [],
      });
      continue;
    }
    cases.push({
      input: identity.input,
      rawPopulationPosition: identity.rawPopulationPosition,
      preparedPopulationPosition: identity.preparedPopulationPosition,
      selectedPopulationPosition: identity.stratumIndex + 1,
      valid: true,
      invalidReason: null,
      pronunciationStatus: heart.spokenPronunciation.status,
      pronunciationReason: heart.spokenPronunciation.reasonCode,
      canonicalVoicePathLength,
      generatedQueryKeys: [...generatedQueryKeys],
      substrateIntersections: [...generatedQueryKeys].filter((key) => substrateByKey.has(key)).sort(compareText),
    });
  }

  const aggregate = aggregateCases(cases, substrateByKey);
  const s3ReachedKeys = storedS3ReachedKeys(rootDir);
  const interpretationClass = classifyInterpretation(
    aggregate.reachedKeys,
    s3ReachedKeys,
    aggregate.reachedAsciiLatinKeys,
  );
  const result = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-broader-stratified-diagnostic-v0.1.result",
    status: "COMPLETED",
    experimentId: "open-instrument.multilingual-discovery-substrate-expansion-v0.2.broader-stratified-diagnostic.v0.1",
    procedureId: MULTILINGUAL_DISCOVERY_SUBSTRATE_BROADER_DIAGNOSTIC_PROCEDURE_ID_V0_2,
    procedureSha256: authority.procedureSha256,
    procedureManifestSha256: authority.procedureManifestSha256,
    repositoryExecutionHead: authority.repositoryHead,
    authoritativeAttemptsBefore: 0,
    authoritativeAttempts: 1,
    authoritativeAttemptsMax: 1,
    noRerun: true,
    syntheticOnly: true,
    realDataExecuted: false,
    providerExecution: false,
    sourceAcquisition: false,
    sourceReattestation: false,
    sampleArtifact: BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2,
    sampleArtifactSha256: sample.sampleSha256,
    sampleIdentitySha256: sample.sample.sampleIdentitySha256,
    sampleInputCount: sample.inputs.length,
    sampleFirstPosition: sample.positions[0],
    sampleLastPosition: sample.positions.at(-1),
    queryGeneratorSha256: EXPECTED_QUERY_GENERATOR_SHA256_V0_2,
    structuralNormalizerSha256: EXPECTED_STRUCTURAL_NORMALIZER_SHA256_V0_2,
    matchingAdapterSha256: EXPECTED_MATCHING_ADAPTER_SHA256_V0_2,
    executionWrapperPath: EXECUTION_WRAPPER_PATH_V0_2,
    executionWrapperSha256: authority.executionWrapperSha256,
    matchingSemantics: "record.lookupForm === input.embryo under existing NFC/trim normalization",
    substrate: {
      total: authority.substrate.after.total,
      albanian: authority.substrate.after.languageCounts.Albanian,
      latin: authority.substrate.after.languageCounts.Latin,
      other: authority.substrate.after.languageCounts.Other ?? 0,
      fingerprint: authority.substrate.after.fingerprint,
    },
    invalidReasonCounts: Object.fromEntries([...invalidReasonCounts.entries()].sort(([left], [right]) => compareText(left, right))),
    cases,
    aggregate,
    s3Comparison: {
      sampleSize: 512,
      distinctQueryKeys: 1085,
      substrateKeysReached: s3ReachedKeys.length,
      substrateKeysReachedList: s3ReachedKeys,
      latinKeysReached: 0,
      generatedKeySubstrateCoverageRate: 1 / 1085,
      substrateKeyReachabilityRate: 1 / 76,
      descriptiveOnly: true,
    },
    interpretationClass,
    postResultNextAction: "REVIEW_BROADER_STRATIFIED_DIAGNOSTIC_RESULT_AND_DECIDE_SUBSTRATE_ARCHITECTURE",
  } as const;
  writeJson(rootDir, BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2, result);
  const rawResultSha256 = sha256FileV0_2(rootDir, BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2);
  const summary = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-broader-stratified-diagnostic-v0.1.summary",
    status: "COMPLETED_RESULT_PRESERVED",
    experimentId: result.experimentId,
    procedureId: result.procedureId,
    authoritativeAttempts: 1,
    sampleInputCount: result.sampleInputCount,
    sampleIdentitySha256: result.sampleIdentitySha256,
    validInputCount: aggregate.validInputCount,
    invalidOrUnreachableInputCount: aggregate.invalidOrUnreachableInputCount,
    invalidReasonCounts: result.invalidReasonCounts,
    metrics: aggregate,
    interpretationClass,
    s3Comparison: result.s3Comparison,
    rawResultArtifact: BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2,
    rawResultSha256,
    noRerun: true,
    realDataExecuted: false,
    providerExecution: false,
    postResultNextAction: result.postResultNextAction,
  } as const;
  writeJson(rootDir, BROADER_DIAGNOSTIC_SUMMARY_ARTIFACT_PATH_V0_2, summary);
  const summarySha256 = sha256FileV0_2(rootDir, BROADER_DIAGNOSTIC_SUMMARY_ARTIFACT_PATH_V0_2);
  const manifest = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-broader-stratified-diagnostic-v0.1.hash-manifest",
    status: "COMPLETED_RESULT_BINDINGS",
    experimentId: result.experimentId,
    procedureId: result.procedureId,
    repositoryExecutionHead: authority.repositoryHead,
    procedure: {
      path: PROCEDURE_PATH_V0_2,
      sha256: authority.procedureSha256,
    },
    procedureManifest: {
      path: PROCEDURE_MANIFEST_PATH_V0_2,
      sha256: authority.procedureManifestSha256,
    },
    artifacts: [
      { path: BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2, bytes: readFileSync(join(rootDir, BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2)).byteLength, sha256: sample.sampleSha256 },
      { path: BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2, bytes: readFileSync(join(rootDir, BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2)).byteLength, sha256: rawResultSha256 },
      { path: BROADER_DIAGNOSTIC_SUMMARY_ARTIFACT_PATH_V0_2, bytes: readFileSync(join(rootDir, BROADER_DIAGNOSTIC_SUMMARY_ARTIFACT_PATH_V0_2)).byteLength, sha256: summarySha256 },
    ],
    authorityBindings: {
      s3Sample: { path: S3_SAMPLE_PATH_V0_2, sha256: EXPECTED_S3_SAMPLE_SHA256_V0_2 },
      s3PairedResults: { path: S3_PAIRED_RESULTS_PATH_V0_2, sha256: EXPECTED_S3_PAIRED_RESULTS_SHA256_V0_2 },
      s3Summary: { path: S3_SUMMARY_PATH_V0_2, sha256: EXPECTED_S3_SUMMARY_SHA256_V0_2 },
      s3Manifest: { path: S3_MANIFEST_PATH_V0_2, sha256: EXPECTED_S3_MANIFEST_SHA256_V0_2 },
      queryGenerator: { path: QUERY_GENERATOR_PATH_V0_2, sha256: EXPECTED_QUERY_GENERATOR_SHA256_V0_2 },
      structuralNormalizer: { path: STRUCTURAL_NORMALIZER_PATH_V0_2, sha256: EXPECTED_STRUCTURAL_NORMALIZER_SHA256_V0_2 },
      matchingAdapter: { path: MATCHING_ADAPTER_PATH_V0_2, sha256: EXPECTED_MATCHING_ADAPTER_SHA256_V0_2 },
      executionWrapper: { path: EXECUTION_WRAPPER_PATH_V0_2, sha256: authority.executionWrapperSha256 },
      substrateFingerprint: EXPECTED_SUBSTRATE_FINGERPRINT_V0_2,
    },
    execution: {
      authoritativeAttemptsBefore: 0,
      authoritativeAttempts: 1,
      authoritativeAttemptsMax: 1,
      noRerun: true,
      syntheticOnly: true,
      realDataExecuted: false,
      providerExecution: false,
      queryOutcomesInspected: true,
      candidateOutcomesInspected: false,
      s3Rerun: false,
      postResultSampleChange: false,
      postResultQueryChange: false,
      postResultMatchingChange: false,
    },
    outcome: {
      interpretationClass,
      postResultNextAction: result.postResultNextAction,
    },
  } as const;
  writeJson(rootDir, BROADER_DIAGNOSTIC_HASH_MANIFEST_PATH_V0_2, manifest);
  const manifestSha256 = sha256FileV0_2(rootDir, BROADER_DIAGNOSTIC_HASH_MANIFEST_PATH_V0_2);
  return {
    result,
    summary,
    manifest,
    hashes: { sample: sample.sampleSha256, rawResult: rawResultSha256, summary: summarySha256, manifest: manifestSha256 },
  } as const;
}

export function verifyStoredBroaderDiagnosticResultV0_2(rootDir = process.cwd()) {
  const sample = readJson<JsonObject>(rootDir, BROADER_DIAGNOSTIC_SAMPLE_ARTIFACT_PATH_V0_2);
  const result = readJson<JsonObject>(rootDir, BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2);
  const summary = readJson<JsonObject>(rootDir, BROADER_DIAGNOSTIC_SUMMARY_ARTIFACT_PATH_V0_2);
  const manifest = readJson<JsonObject>(rootDir, BROADER_DIAGNOSTIC_HASH_MANIFEST_PATH_V0_2);
  const cases = Array.isArray(result.cases) ? result.cases : [];
  const aggregate = result.aggregate as JsonObject;
  const sampleIdentities = Array.isArray(sample.selectedIdentities) ? sample.selectedIdentities : [];
  const positions = Array.isArray(sample.positions) ? sample.positions : [];
  const selectedInputs = sampleIdentities.map((entry) => (entry as JsonObject).input);
  if (
    result.authoritativeAttempts !== 1 ||
    result.noRerun !== true ||
    result.realDataExecuted !== false ||
    sample.sampleSize !== 1024 ||
    sampleIdentities.length !== 1024 ||
    cases.length !== 1024 ||
    new Set(sampleIdentities.map((entry) => (entry as JsonObject).input)).size !== 1024 ||
    positions.length !== 1024 ||
    positions[0] !== 1 ||
    positions.at(-1) !== 117275 ||
    sha256BroaderDiagnosticSelectionV0_2(selectedInputs as string[]) !== sample.sampleIdentitySha256 ||
    aggregate.inputCount !==
      (aggregate.validInputCount as number) + (aggregate.invalidOrUnreachableInputCount as number)
  ) {
    throw new Error("BROADER_DIAGNOSTIC_STORED_RESULT_INTEGRITY_FAILURE");
  }
  const artifactEntries = manifest.artifacts;
  if (!Array.isArray(artifactEntries) || artifactEntries.some((entry) => {
    const item = entry as JsonObject;
    return typeof item.path !== "string" || typeof item.sha256 !== "string" ||
      typeof item.bytes !== "number" ||
      readFileSync(join(rootDir, item.path)).byteLength !== item.bytes ||
      sha256FileV0_2(rootDir, item.path) !== item.sha256;
  })) {
    throw new Error("BROADER_DIAGNOSTIC_STORED_RESULT_HASH_FAILURE");
  }
  if (
    result.executionWrapperPath !== EXECUTION_WRAPPER_PATH_V0_2 ||
    result.executionWrapperSha256 !== sha256FileV0_2(rootDir, EXECUTION_WRAPPER_PATH_V0_2) ||
    (manifest.authorityBindings as JsonObject)?.executionWrapper === undefined
  ) {
    throw new Error("BROADER_DIAGNOSTIC_STORED_RESULT_WRAPPER_BINDING_FAILURE");
  }
  const states = reconstructS3SubstrateStatesV0_2(rootDir);
  const substrateByKey = new Map(
    states.after.records.map((record) => [record.queryForm, {
      language: record.language,
      sourceRecordIds: [record.sourceRecordId],
    }]),
  );
  const recomputedAggregate = aggregateCases(cases as DiagnosticCase[], substrateByKey);
  if (JSON.stringify(recomputedAggregate) !== JSON.stringify(aggregate)) {
    throw new Error("BROADER_DIAGNOSTIC_STORED_RESULT_AGGREGATE_FAILURE");
  }
  if (JSON.stringify((summary as JsonObject).metrics) !== JSON.stringify(aggregate)) {
    throw new Error("BROADER_DIAGNOSTIC_STORED_RESULT_SUMMARY_METRICS_FAILURE");
  }
  if (summary.rawResultSha256 !== sha256FileV0_2(rootDir, BROADER_DIAGNOSTIC_RAW_RESULT_ARTIFACT_PATH_V0_2)) {
    throw new Error("BROADER_DIAGNOSTIC_STORED_RESULT_SUMMARY_BINDING_FAILURE");
  }
  return Object.freeze({
    ok: true,
    scientificEngineReexecuted: false,
    aggregateAccountingVerified: true,
    hashesVerified: true,
  });
}
