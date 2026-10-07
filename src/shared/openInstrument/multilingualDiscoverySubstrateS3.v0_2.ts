import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { buildMinRootHypotheses } from "@/shared/deepRoot.minRoots.v1";
import { extractSevenVowelsFromString } from "@/shared/math7.core";
import {
  buildMotivationEngineDiscoveryV0_1,
  type MotivationEngineDiscoveryCandidateV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import {
  createAlbanianLexicalSubstrateWitnessAdapterV0_1,
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import {
  createGenericFunctionalWitnessSourceAdapterV1,
  loadGenericFunctionalWitnessSourceDatasetV1,
  type GenericFunctionalWitnessSourceAcquisitionRecordV1,
} from "@/shared/openInstrument/genericFunctionalWitnessSourceAcquisition.v1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
  type GenericFunctionalWitnessSourceAdapterV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import {
  buildMultilingualDiscoverySubstrateS0BaselineV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS0.v0_2";
import {
  getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2";
import {
  canonicalJsonV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS2.v0_2";
import {
  discoverStructuralHypothesesV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_PROCEDURE_ID_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-v0.2.s3-coverage-procedure.v0.1" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_SCHEMA_VERSION_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-s3-independent-coverage-evaluation.v0.1" as const;

export const S3_SOURCE_PROCEDURE_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/procedure.json" as const;
export const S3_SOURCE_SAMPLE_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/reachable-sample.json" as const;
export const S3_POPULATION_SPEC_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json" as const;
export const S3_CMUDICT_PATH_V0_2 =
  "src/data/openInstrument/pronunciation/cmudict.dict" as const;

export const S3_EXPECTED_SOURCE_PROCEDURE_SHA256_V0_2 =
  "2b7ecf4b1b0b7e3f2ced15a0a92381316206711b3392676b22e81e6481ed81cb" as const;
export const S3_EXPECTED_SOURCE_SAMPLE_SHA256_V0_2 =
  "7c991d806086569f9434f07f0a60ea0d8ec225434fa87050ed6c79d04f738255" as const;
export const S3_EXPECTED_POPULATION_SPEC_SHA256_V0_2 =
  "81248026f57cffb0c357a4e29e0cce4d3139adc1521eda89e72754783095ed44" as const;
export const S3_EXPECTED_CMUDICT_SHA256_V0_2 =
  "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22" as const;

export const S3_EXPECTED_S0_ARTIFACT_SHA256_V0_2 =
  "52fd4865fd3a0eb2067ea460af7d75024948de5c56cbcc8ce9936361a591a58e" as const;
export const S3_EXPECTED_S0_MANIFEST_SHA256_V0_2 =
  "38d57de7082b4d719b76aa5cf34e177c5e0d811a1a11341bba9535fafcbf764f" as const;
export const S3_EXPECTED_S1_PROJECTION_SHA256_V0_2 =
  "8f65b688ca6c3e7a4a130c478c2c6ec3abbb6b6875db742fd9666b4ced5b61d3" as const;
export const S3_EXPECTED_S1_CATALOG_DERIVATION_SHA256_V0_2 =
  "bf7f9592b6123fc2d634af7616415fdedf317469ba1e3ca9f654a0e4dc4ce265" as const;
export const S3_EXPECTED_S1_RUNTIME_COMPOSITION_SHA256_V0_2 =
  "febe40af34ae4e60f6a1ffa91e63a36e4e2c04748b1d5cfae4ba53f7195e45de" as const;
export const S3_EXPECTED_S2_ARTIFACT_SHA256_V0_2 =
  "6dd24ea7074aa73f2060c40afb254370a79270a8ce0db8f273bec5b332792fae" as const;
export const S3_EXPECTED_S2_MANIFEST_SHA256_V0_2 =
  "8a8976b5cbd3586ea76661e3f5f93beb4fcceab8a16fb627e2678bd9dacf0234" as const;
export const S3_EXPECTED_BEFORE_FINGERPRINT_V0_2 =
  "d3d3ab37062d8f9de081f62592c1d3a6e9b0e66721d0202679fc639d0fe37059" as const;
export const S3_EXPECTED_AFTER_FINGERPRINT_V0_2 =
  "1c4714a1d9a7550c1c037b4ce62ca85e9ff24966f2e8d447c038bce001b45d81" as const;

const S3_S0_ARTIFACT_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/baseline.json";
const S3_S0_MANIFEST_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/hash-manifest.json";
const S3_S2_ARTIFACT_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s2-authority-truth-validation-v0.1/validation.json";
const S3_S2_MANIFEST_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s2-authority-truth-validation-v0.1/hash-manifest.json";
const S3_S1_PROJECTION_PATH_V0_2 =
  "src/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2.ts";
const S3_S1_CATALOG_DERIVATION_PATH_V0_2 =
  "src/shared/openInstrument/multilingualDiscoverySubstrateS0.v0_2.ts";
const S3_S1_RUNTIME_COMPOSITION_PATH_V0_2 =
  "src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts";

export type MultilingualDiscoverySubstrateS3FrozenSampleEntryV0_2 = Readonly<{
  input: string;
  rawPopulationPosition: number;
  preparedPopulationPosition: number;
  reachablePopulationPosition: number;
  pronunciationStatus: string;
  pronunciationReason: string | null;
  profile: string;
  voicePath: readonly string[] | null;
  gamma: readonly string[];
  zcVariantCount: number;
  structuralHypotheses: readonly Readonly<Record<string, unknown>>[];
  genericQueryKeys: readonly string[];
}>;

type DirectIdentityV0_2 = Readonly<{
  sourceRecordId: string;
  language: string;
  sourceForm: string;
  queryForm: string;
  sourceTraditionId: string;
  citationIds: readonly string[];
  gloss: string;
  attestationTruth: string;
  sourceStatus: string;
}>;

type JsonRecordV0_2 = Record<string, unknown>;

export type MultilingualDiscoverySubstrateS3SubstrateStateV0_2 = Readonly<{
  label: "BEFORE" | "AFTER";
  records: readonly DirectIdentityV0_2[];
  total: number;
  languageCounts: Readonly<Record<string, number>>;
  uniqueForms: number;
  uniqueQueryKeys: number;
  fingerprint: string;
  duplicateForms: readonly string[];
  queryKeyCollisions: readonly string[];
  latinRecords: readonly GenericFunctionalWitnessSourceAcquisitionRecordV1[];
}>;

export type MultilingualDiscoverySubstrateS3CandidateV0_2 = Readonly<{
  candidateId: string;
  sourceId: string;
  candidateLanguage: string;
  canonicalLanguage: string;
  candidateForm: string;
  candidateGloss: string;
  candidateEmbryo: string;
  sourceTraditionId: string | null;
  sourceStatus: string;
  attestationTruth: string;
  evidenceRefs: readonly string[];
  sourceUrlOrArchiveRef: string | null;
  entryLocator: string | null;
  candidateVoicePath: readonly string[];
  matchClassification: string;
  presentationClassification: string;
  matchedQuery: string;
  functionalStatus: string;
  functionalEvidenceKind: string;
  functionalEvidenceRefs: readonly string[];
  historicalRelation: string;
  candidateStatus: string;
  noSingleWinner: boolean;
  userDecisionPosture: string;
}>;

export type MultilingualDiscoverySubstrateS3CaseV0_2 = Readonly<{
  input: string;
  upstream: Readonly<{
    voicePath: readonly string[];
    gamma: readonly string[];
    structuralHypothesisIds: readonly string[];
    genericQueryKeys: readonly string[];
    fingerprint: string;
  }>;
  classification: string;
  candidateCount: number;
  candidates: readonly MultilingualDiscoverySubstrateS3CandidateV0_2[];
  candidateSourceRecordIds: readonly string[];
  candidateLanguages: readonly string[];
  sourceTraditions: readonly string[];
  crossFormCandidateCount: number;
  validNull: boolean;
  nullReason: string | null;
}>;

function compareTextV0_2(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeWordV0_2(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function readJsonV0_2<T>(rootDir: string, relativePath: string): T {
  return JSON.parse(readFileSync(join(rootDir, relativePath), "utf8")) as T;
}

export function sha256BytesV0_2(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function sha256FileV0_2(rootDir: string, relativePath: string): string {
  return sha256BytesV0_2(readFileSync(join(rootDir, relativePath)));
}

function sha256CompactJsonV0_2(value: unknown): string {
  return sha256BytesV0_2(JSON.stringify(value));
}

function directIdentityV0_2(record: DirectIdentityV0_2): DirectIdentityV0_2 {
  return {
    sourceRecordId: record.sourceRecordId,
    language: record.language,
    sourceForm: record.sourceForm,
    queryForm: record.queryForm,
    sourceTraditionId: record.sourceTraditionId,
    citationIds: [...record.citationIds].sort(compareTextV0_2),
    gloss: record.gloss,
    attestationTruth: record.attestationTruth,
    sourceStatus: record.sourceStatus,
  };
}

function directFromAlbanianV0_2(): DirectIdentityV0_2[] {
  return getAlbanianLexicalSubstrateRecordsV0_1().map((record) => directIdentityV0_2({
    sourceRecordId: record.sourceId,
    language: record.language === "sq" ? "Albanian" : record.language,
    sourceForm: record.sourceForm,
    queryForm: record.queryForm,
    sourceTraditionId: record.sourceProvenance?.sourceTraditionId ?? "",
    citationIds: record.citationRefs,
    gloss: record.gloss,
    attestationTruth: record.attestationTruth,
    sourceStatus: record.sourceStatus,
  }));
}

function directFromLatinV0_2(
  records: readonly GenericFunctionalWitnessSourceAcquisitionRecordV1[],
): DirectIdentityV0_2[] {
  return records.map((record) => directIdentityV0_2({
    sourceRecordId: record.sourceRecordId,
    language: record.language,
    sourceForm: record.sourceForm,
    queryForm: record.queryForm,
    sourceTraditionId: record.sourceTraditionId,
    citationIds: [record.citation.citationId],
    gloss: record.gloss,
    attestationTruth: record.attestationTruth,
    sourceStatus: record.sourceStatus,
  }));
}

function collisionKeysV0_2(records: readonly DirectIdentityV0_2[], field: "sourceForm" | "queryForm") {
  const groups = new Map<string, string[]>();
  for (const record of records) {
    const values = groups.get(record[field]) ?? [];
    values.push(record.sourceRecordId);
    groups.set(record[field], values);
  }
  return [...groups.entries()]
    .filter(([, ids]) => ids.length > 1)
    .sort(([left], [right]) => compareTextV0_2(left, right))
    .map(([key]) => key);
}

function languageCountsV0_2(records: readonly DirectIdentityV0_2[]) {
  return Object.fromEntries(
    [...new Set(records.map((record) => record.language))]
      .sort(compareTextV0_2)
      .map((language) => [language, records.filter((record) => record.language === language).length]),
  );
}

function stableUniqueRootsV0_2(word: string) {
  const roots = buildMinRootHypotheses(word, {
    allowSSh: true,
    langAllowList: ["sq"],
    maxHypotheses: 25,
    maxSegments: 5,
  });
  const seen = new Set<string>();
  return roots.filter((root) => {
    const key = root.protoRoots.join("+");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function genericQueryKeysForWordV0_2(word: string): readonly string[] {
  const structuralHypotheses = discoverStructuralHypothesesV0_1(word);
  const contexts: Array<{ queryForm: string; contextId: string }> = [];
  const seen = new Set<string>();

  for (const root of stableUniqueRootsV0_2(word)) {
    for (const protoRoot of root.protoRoots) {
      if (extractSevenVowelsFromString(protoRoot).length === 0) continue;
      const key = `root:${root.id}:${protoRoot}`;
      if (seen.has(key)) continue;
      seen.add(key);
      contexts.push({ queryForm: protoRoot.normalize("NFC").trim(), contextId: key });
    }
  }

  for (const hypothesis of structuralHypotheses) {
    for (const queryForm of hypothesis.expansionChain) {
      const normalizedQueryForm = queryForm.normalize("NFC").trim();
      if (!normalizedQueryForm || extractSevenVowelsFromString(normalizedQueryForm).length === 0) continue;
      const key = `hypothesis:${hypothesis.hypothesisId}:${normalizedQueryForm}`;
      if (seen.has(key)) continue;
      seen.add(key);
      contexts.push({ queryForm: normalizedQueryForm, contextId: key });
    }
  }

  return [...new Set(
    contexts
      .sort((left, right) => compareTextV0_2(`${left.queryForm}:${left.contextId}`, `${right.queryForm}:${right.contextId}`))
      .map((context) => context.queryForm),
  )];
}

function compactStructuralHypothesesV0_2(word: string): readonly JsonRecordV0_2[] {
  return discoverStructuralHypothesesV0_1(word).map((hypothesis) => ({
    hypothesisId: hypothesis.hypothesisId,
    embryo: hypothesis.embryo,
    expansionChain: [...hypothesis.expansionChain],
    reasonCodes: [...hypothesis.reasonCodes],
  }));
}

function gammaForHeartV0_2(heart: ReturnType<typeof buildHeartInstrumentV1>): readonly string[] {
  if (heart.spokenPronunciation.status !== "defined") return [];
  return heart.spokenPronunciation.variants.flatMap((variant) =>
    variant.normalizedSegments
      .filter((segment) => segment.kind === "consonant")
      .flatMap((segment) => [...segment.sourceUnits]),
  );
}

function zcVariantCountForHeartV0_2(heart: ReturnType<typeof buildHeartInstrumentV1>): number {
  return heart.spokenPronunciation.status === "defined"
    ? heart.spokenPronunciation.variants.length
    : 0;
}

function reconstructReachableEntriesV0_2(rootDir: string): readonly MultilingualDiscoverySubstrateS3FrozenSampleEntryV0_2[] {
  const population = readJsonV0_2<{
    population: { entries: readonly { lexicalWord: string; eligibility: string }[] };
  }>(rootDir, S3_POPULATION_SPEC_PATH_V0_2).population.entries;
  const selection = readJsonV0_2<{
    preparedWordExclusion: { excludedWords: readonly string[] };
  }>(rootDir, "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/selection-procedure.json");
  const excluded = new Set(selection.preparedWordExclusion.excludedWords.map(normalizeWordV0_2));
  for (const record of getAlbanianLexicalSubstrateRecordsV0_1()) {
    const normalized = normalizeWordV0_2(record.sourceForm);
    if (/^[a-z]+$/u.test(normalized)) excluded.add(normalized);
  }
  const raw = [...new Set(
    population
      .filter((entry) => entry.eligibility === "ELIGIBLE")
      .map((entry) => normalizeWordV0_2(entry.lexicalWord))
      .filter((word) => /^[a-z]+$/u.test(word)),
  )].sort(compareTextV0_2);
  const rawPosition = new Map(raw.map((word, index) => [word, index + 1]));
  const prepared = raw.filter((word) => !excluded.has(word));
  const reachable: MultilingualDiscoverySubstrateS3FrozenSampleEntryV0_2[] = [];

  for (let index = 0; index < prepared.length && reachable.length < 512; index += 1) {
    const input = prepared[index]!;
    const heart = buildHeartInstrumentV1(input);
    const pronunciationUsable = heart.spokenPronunciation.status === "defined" &&
      Array.isArray(heart.canonicalSpokenVoicePath) && heart.canonicalSpokenVoicePath.length > 0;
    if (!pronunciationUsable) continue;
    const structuralHypotheses = compactStructuralHypothesesV0_2(input);
    const genericQueryKeys = genericQueryKeysForWordV0_2(input);
    if (genericQueryKeys.length === 0) continue;
    reachable.push({
      input,
      rawPopulationPosition: rawPosition.get(input)!,
      preparedPopulationPosition: index + 1,
      reachablePopulationPosition: reachable.length + 1,
      pronunciationStatus: heart.spokenPronunciation.status,
      pronunciationReason: heart.spokenPronunciation.reasonCode,
      profile: heart.spokenPronunciation.sourceProfileId,
      voicePath: heart.canonicalSpokenVoicePath,
      gamma: gammaForHeartV0_2(heart),
      zcVariantCount: zcVariantCountForHeartV0_2(heart),
      structuralHypotheses,
      genericQueryKeys,
    });
  }
  if (reachable.length !== 512) {
    throw new Error(`S3_SAMPLE_RECONSTRUCTION_COUNT:${reachable.length}`);
  }
  return reachable;
}

export function reconstructFrozenS3SampleV0_2(rootDir = process.cwd()) {
  const procedure = readJsonV0_2<JsonRecordV0_2>(rootDir, S3_SOURCE_PROCEDURE_PATH_V0_2);
  const frozenSample = readJsonV0_2<{
    status: string;
    procedureSha256: string;
    sampleSize: number;
    entries: readonly MultilingualDiscoverySubstrateS3FrozenSampleEntryV0_2[];
  }>(rootDir, S3_SOURCE_SAMPLE_PATH_V0_2);
  const procedureSha256 = sha256FileV0_2(rootDir, S3_SOURCE_PROCEDURE_PATH_V0_2);
  const reconstructed = reconstructReachableEntriesV0_2(rootDir);
  if (procedure.procedureId !== "open-instrument-m7-substrate-reachable-generalization-v0.1" ||
      procedure.status !== "FROZEN_BEFORE_EXECUTION" ||
      frozenSample.status !== "FROZEN_BEFORE_SUBSTRATE_EVALUATION" ||
      frozenSample.procedureSha256 !== procedureSha256 ||
      frozenSample.sampleSize !== 512 ||
      JSON.stringify(reconstructed) !== JSON.stringify(frozenSample.entries)) {
    throw new Error("S3_SAMPLE_RECONSTRUCTION_MISMATCH");
  }
  return {
    entries: reconstructed,
    sourceSampleSha256: sha256FileV0_2(rootDir, S3_SOURCE_SAMPLE_PATH_V0_2),
    sourceProcedureSha256: procedureSha256,
    firstInput: reconstructed[0]?.input ?? null,
    lastInput: reconstructed.at(-1)?.input ?? null,
    sampleSize: reconstructed.length,
  } as const;
}

function sourceRecordMapV0_2(
  records: readonly DirectIdentityV0_2[],
): ReadonlyMap<string, DirectIdentityV0_2> {
  return new Map(records.map((record) => [record.sourceRecordId, record]));
}

function buildLatinAdapterV0_2(
  records: readonly GenericFunctionalWitnessSourceAcquisitionRecordV1[],
): GenericFunctionalWitnessSourceAdapterV1 {
  const dataset = loadGenericFunctionalWitnessSourceDatasetV1();
  const adapter = createGenericFunctionalWitnessSourceAdapterV1({
    datasetVersion: dataset.datasetVersion,
    sourceAuthority: dataset.sourceAuthority,
    records,
  });
  return Object.freeze({
    adapterId: "latin-generic-lexical-substrate.v0_1",
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED" as const,
    query(input) {
      return adapter.query(input);
    },
  });
}

export function reconstructS3SubstrateStatesV0_2(rootDir = process.cwd()) {
  const baseline = buildMultilingualDiscoverySubstrateS0BaselineV0_2({
    repositoryBaselineHead: "ac9a17f9f40709e0da209cef64d86ba224cac778",
  });
  const dataset = loadGenericFunctionalWitnessSourceDatasetV1();
  const beforeLatin = dataset.records.filter((record) => record.language === "Latin");
  const afterLatin = getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2();
  const beforeRecords = [...baseline.directSubstrate.records].sort((left, right) =>
    compareTextV0_2(left.recordId, right.recordId),
  ).map((record) => directIdentityV0_2({
    sourceRecordId: record.recordId,
    language: record.language === "sq" ? "Albanian" : record.language,
    sourceForm: record.normalizedSourceForm,
    queryForm: record.queryKey,
    sourceTraditionId: record.sourceTraditionId ?? "",
    citationIds: record.citationIds,
    gloss: record.gloss,
    attestationTruth: record.attestationTruth,
    sourceStatus: record.sourceStatus,
  }));
  const afterRecords = [...directFromAlbanianV0_2(), ...directFromLatinV0_2(afterLatin)]
    .sort((left, right) => compareTextV0_2(left.sourceRecordId, right.sourceRecordId));
  const before: MultilingualDiscoverySubstrateS3SubstrateStateV0_2 = {
    label: "BEFORE",
    records: beforeRecords,
    total: beforeRecords.length,
    languageCounts: languageCountsV0_2(beforeRecords),
    uniqueForms: new Set(beforeRecords.map((record) => record.sourceForm)).size,
    uniqueQueryKeys: new Set(beforeRecords.map((record) => record.queryForm)).size,
    fingerprint: sha256CompactJsonV0_2(baseline.directSubstrate.records),
    duplicateForms: collisionKeysV0_2(beforeRecords, "sourceForm"),
    queryKeyCollisions: collisionKeysV0_2(beforeRecords, "queryForm"),
    latinRecords: beforeLatin,
  };
  const after: MultilingualDiscoverySubstrateS3SubstrateStateV0_2 = {
    label: "AFTER",
    records: afterRecords,
    total: afterRecords.length,
    languageCounts: languageCountsV0_2(afterRecords),
    uniqueForms: new Set(afterRecords.map((record) => record.sourceForm)).size,
    uniqueQueryKeys: new Set(afterRecords.map((record) => record.queryForm)).size,
    fingerprint: sha256BytesV0_2(canonicalJsonV0_2(afterRecords)),
    duplicateForms: collisionKeysV0_2(afterRecords, "sourceForm"),
    queryKeyCollisions: collisionKeysV0_2(afterRecords, "queryForm"),
    latinRecords: afterLatin,
  };
  if (before.fingerprint !== S3_EXPECTED_BEFORE_FINGERPRINT_V0_2 ||
      after.fingerprint !== S3_EXPECTED_AFTER_FINGERPRINT_V0_2) {
    throw new Error("S3_SUBSTRATE_RECONSTRUCTION_MISMATCH");
  }
  return {
    before,
    after,
    beforeAdapters: [
      createAlbanianLexicalSubstrateWitnessAdapterV0_1(),
      buildLatinAdapterV0_2(beforeLatin),
    ] as readonly GenericFunctionalWitnessSourceAdapterV1[],
    afterAdapters: [
      createAlbanianLexicalSubstrateWitnessAdapterV0_1(),
      buildLatinAdapterV0_2(afterLatin),
    ] as readonly GenericFunctionalWitnessSourceAdapterV1[],
    beforeSourceMap: sourceRecordMapV0_2(beforeRecords),
    afterSourceMap: sourceRecordMapV0_2(afterRecords),
  } as const;
}

function canonicalLanguageV0_2(value: string): string {
  return value === "sq" ? "Albanian" : value;
}

function compactCandidateV0_2(
  candidate: MotivationEngineDiscoveryCandidateV0_1,
  sourceMap: ReadonlyMap<string, DirectIdentityV0_2>,
): MultilingualDiscoverySubstrateS3CandidateV0_2 {
  const source = sourceMap.get(candidate.sourceFact.sourceId);
  return {
    candidateId: candidate.candidateId,
    sourceId: candidate.sourceFact.sourceId,
    candidateLanguage: candidate.candidateLanguage,
    canonicalLanguage: canonicalLanguageV0_2(candidate.candidateLanguage),
    candidateForm: candidate.candidateForm,
    candidateGloss: candidate.candidateGloss,
    candidateEmbryo: candidate.candidateEmbryo,
    sourceTraditionId: source?.sourceTraditionId || null,
    sourceStatus: candidate.sourceFact.sourceStatus,
    attestationTruth: candidate.sourceFact.attestationTruth,
    evidenceRefs: [...candidate.sourceFact.evidenceRefs],
    sourceUrlOrArchiveRef: candidate.sourceFact.sourceUrlOrArchiveRef,
    entryLocator: candidate.sourceFact.entryLocator,
    candidateVoicePath: [...candidate.candidateVoicePath],
    matchClassification: candidate.structuralComparison.matchClassification,
    presentationClassification: candidate.structuralComparison.presentationClassification,
    matchedQuery: candidate.structuralComparison.matchedQuery,
    functionalStatus: candidate.functionalInterpretation.status,
    functionalEvidenceKind: candidate.functionalInterpretation.evidenceKind,
    functionalEvidenceRefs: [...candidate.functionalInterpretation.evidenceRefs],
    historicalRelation: candidate.historicalRelation,
    candidateStatus: candidate.candidateStatus,
    noSingleWinner: candidate.noSingleWinner,
    userDecisionPosture: candidate.userDecisionPosture,
  };
}

function upstreamFingerprintV0_2(value: {
  voicePath: readonly string[];
  gamma: readonly string[];
  structuralHypothesisIds: readonly string[];
  genericQueryKeys: readonly string[];
}): string {
  return sha256CompactJsonV0_2(value);
}

function evaluateDiscoveryV0_2(
  word: string,
  discovery: ReturnType<typeof buildMotivationEngineDiscoveryV0_1>,
  sourceMap: ReadonlyMap<string, DirectIdentityV0_2>,
): Omit<MultilingualDiscoverySubstrateS3CaseV0_2, "upstream"> {
  const candidates = discovery.candidates.map((candidate) => compactCandidateV0_2(candidate, sourceMap));
  const crossFormCandidates = candidates.filter((candidate) =>
    normalizeWordV0_2(candidate.candidateForm) !== normalizeWordV0_2(word),
  );
  const classification = crossFormCandidates.length > 0
    ? "GENERIC_CROSS_FORM_POSITIVE"
    : candidates.length > 0
      ? "EXACT_SELF_MATCH_ONLY"
      : "SUBSTRATE_NO_MATCH";
  return {
    input: word,
    classification,
    candidateCount: candidates.length,
    candidates,
    candidateSourceRecordIds: [...new Set(candidates.map((candidate) => candidate.sourceId))].sort(compareTextV0_2),
    candidateLanguages: [...new Set(candidates.map((candidate) => candidate.canonicalLanguage))].sort(compareTextV0_2),
    sourceTraditions: [...new Set(candidates.map((candidate) => candidate.sourceTraditionId).filter((value): value is string => Boolean(value)))].sort(compareTextV0_2),
    crossFormCandidateCount: crossFormCandidates.length,
    validNull: candidates.length === 0,
    nullReason: candidates.length === 0 ? discovery.unknownOrNull.reason : null,
  };
}

export async function evaluateFrozenS3PairV0_2(
  sample: readonly MultilingualDiscoverySubstrateS3FrozenSampleEntryV0_2[],
  states: ReturnType<typeof reconstructS3SubstrateStatesV0_2>,
) {
  const cases: Array<{
    input: string;
    upstream: MultilingualDiscoverySubstrateS3CaseV0_2["upstream"];
    before: MultilingualDiscoverySubstrateS3CaseV0_2;
    after: MultilingualDiscoverySubstrateS3CaseV0_2;
    changed: boolean;
    changedCandidateSourceIds: readonly string[];
    changedS1CandidateSourceIds: readonly string[];
  }> = [];

  for (const entry of sample) {
    const heart = buildHeartInstrumentV1(entry.input);
    const payload = await runAnalysisDeterministic(entry.input, { mode: "strict", alphabet: "auto" });
    const analysis = enginePayloadToAnalysisResult(payload);
    const beforeDiscovery = buildMotivationEngineDiscoveryV0_1({
      word: entry.input,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis,
      heart,
      sourceAdapters: states.beforeAdapters,
    });
    const afterDiscovery = buildMotivationEngineDiscoveryV0_1({
      word: entry.input,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis,
      heart,
      sourceAdapters: states.afterAdapters,
    });
    const upstream = {
      voicePath: [...beforeDiscovery.derivedStructure.voicePath],
      gamma: [...beforeDiscovery.derivedStructure.gamma.orderedUnits],
      structuralHypothesisIds: beforeDiscovery.derivedStructure.structuralHypotheses.map((hypothesis) => hypothesis.hypothesisId),
      genericQueryKeys: [...entry.genericQueryKeys],
      fingerprint: upstreamFingerprintV0_2({
        voicePath: beforeDiscovery.derivedStructure.voicePath,
        gamma: beforeDiscovery.derivedStructure.gamma.orderedUnits,
        structuralHypothesisIds: beforeDiscovery.derivedStructure.structuralHypotheses.map((hypothesis) => hypothesis.hypothesisId),
        genericQueryKeys: entry.genericQueryKeys,
      }),
    };
    const before = {
      ...evaluateDiscoveryV0_2(entry.input, beforeDiscovery, states.beforeSourceMap),
      upstream,
    };
    const afterUpstreamFingerprint = upstreamFingerprintV0_2({
      voicePath: afterDiscovery.derivedStructure.voicePath,
      gamma: afterDiscovery.derivedStructure.gamma.orderedUnits,
      structuralHypothesisIds: afterDiscovery.derivedStructure.structuralHypotheses.map((hypothesis) => hypothesis.hypothesisId),
      genericQueryKeys: entry.genericQueryKeys,
    });
    if (upstream.fingerprint !== afterUpstreamFingerprint) {
      throw new Error(`S3_UPSTREAM_ANALYSIS_MISMATCH:${entry.input}`);
    }
    const after = {
      ...evaluateDiscoveryV0_2(entry.input, afterDiscovery, states.afterSourceMap),
      upstream,
    };
    const beforeIds = new Set(before.candidateSourceRecordIds);
    const afterIds = new Set(after.candidateSourceRecordIds);
    const changedCandidateSourceIds = [...new Set([...beforeIds, ...afterIds])]
      .filter((id) => beforeIds.has(id) !== afterIds.has(id))
      .sort(compareTextV0_2);
    const changed = before.classification !== after.classification || changedCandidateSourceIds.length > 0;
    const changedS1CandidateSourceIds = changedCandidateSourceIds.filter((id) =>
      states.after.latinRecords.some((record) => record.sourceRecordId === id),
    );
    cases.push({
      input: entry.input,
      upstream,
      before,
      after,
      changed,
      changedCandidateSourceIds,
      changedS1CandidateSourceIds,
    });
  }
  return cases;
}

export function aggregateS3CasesV0_2(
  cases: readonly Readonly<{ before: MultilingualDiscoverySubstrateS3CaseV0_2; after: MultilingualDiscoverySubstrateS3CaseV0_2 }>[],
  side: "before" | "after",
) {
  const selected = cases.map((entry) => entry[side]);
  const candidateCounts = selected.map((entry) => entry.candidateCount).sort((left, right) => left - right);
  const totalCandidates = candidateCounts.reduce((sum, count) => sum + count, 0);
  const median = candidateCounts.length % 2 === 0
    ? ((candidateCounts[candidateCounts.length / 2 - 1] ?? 0) + (candidateCounts[candidateCounts.length / 2] ?? 0)) / 2
    : candidateCounts[Math.floor(candidateCounts.length / 2)] ?? 0;
  const candidates = selected.flatMap((entry) => entry.candidates);
  const distinctRecords = new Set(candidates.map((candidate) => candidate.sourceId));
  const distinctLanguages = new Set(candidates.map((candidate) => candidate.canonicalLanguage));
  const languageContribution = contributionV0_2(selected, (candidate) => candidate.canonicalLanguage);
  const sourceTraditionContribution = contributionV0_2(selected, (candidate) => candidate.sourceTraditionId ?? "UNKNOWN");
  return {
    totalInputs: selected.length,
    validEvaluatedInputs: selected.length,
    crossFormPositiveInputs: selected.filter((entry) => entry.classification === "GENERIC_CROSS_FORM_POSITIVE").length,
    selfMatchOnlyInputs: selected.filter((entry) => entry.classification === "EXACT_SELF_MATCH_ONLY").length,
    validNullInputs: selected.filter((entry) => entry.validNull).length,
    substrateNoMatchInputs: selected.filter((entry) => entry.classification === "SUBSTRATE_NO_MATCH").length,
    upstreamNullInputs: selected.filter((entry) => entry.classification.startsWith("UPSTREAM_")).length,
    unsupportedAuthorityInputs: 0,
    engineFailures: 0,
    crossFormRate: selected.length === 0 ? 0 : selected.filter((entry) => entry.classification === "GENERIC_CROSS_FORM_POSITIVE").length / selected.length,
    totalCandidateRecordsRetrieved: totalCandidates,
    distinctCandidateSourceRecords: distinctRecords.size,
    distinctCandidateLanguages: distinctLanguages.size,
    meanCandidatesPerInput: selected.length === 0 ? 0 : totalCandidates / selected.length,
    medianCandidatesPerInput: median,
    maxCandidatesPerInput: Math.max(0, ...candidateCounts),
    languageContribution,
    sourceTraditionContribution,
    nullDiagnostics: {
      substrateNoMatch: selected.filter((entry) => entry.classification === "SUBSTRATE_NO_MATCH").length,
      pronunciationNull: selected.filter((entry) => entry.classification === "UPSTREAM_PRONUNCIATION_NULL").length,
      structureNull: selected.filter((entry) => entry.classification === "UPSTREAM_STRUCTURAL_NULL").length,
      queryNull: 0,
      unsupportedAuthority: 0,
      engineFailure: 0,
    },
    diversity: diversityV0_2(selected),
  };
}

function contributionV0_2(
  selected: readonly MultilingualDiscoverySubstrateS3CaseV0_2[],
  key: (candidate: MultilingualDiscoverySubstrateS3CandidateV0_2) => string,
) {
  const groups = new Map<string, { occurrences: number; records: Set<string>; inputs: Set<string> }>();
  for (const entry of selected) {
    for (const candidate of entry.candidates) {
      const groupKey = key(candidate);
      const group = groups.get(groupKey) ?? { occurrences: 0, records: new Set<string>(), inputs: new Set<string>() };
      group.occurrences += 1;
      group.records.add(candidate.sourceId);
      group.inputs.add(entry.input);
      groups.set(groupKey, group);
    }
  }
  return Object.fromEntries([...groups.entries()].sort(([left], [right]) => compareTextV0_2(left, right)).map(([name, group]) => [name, {
    candidateOccurrences: group.occurrences,
    distinctSourceRecords: group.records.size,
    inputsReached: group.inputs.size,
  }]));
}

function diversityV0_2(selected: readonly MultilingualDiscoverySubstrateS3CaseV0_2[]) {
  const sourceRecordCounts = selected.map((entry) => new Set(entry.candidates.map((candidate) => candidate.sourceId)));
  const languageCounts = selected.map((entry) => new Set(entry.candidates.map((candidate) => candidate.canonicalLanguage)));
  const traditionCounts = selected.map((entry) => new Set(entry.candidates.map((candidate) => candidate.sourceTraditionId)).size);
  const numeric = (values: readonly number[]) => {
    const sorted = [...values].sort((left, right) => left - right);
    const median = sorted.length % 2 === 0
      ? ((sorted[sorted.length / 2 - 1] ?? 0) + (sorted[sorted.length / 2] ?? 0)) / 2
      : sorted[Math.floor(sorted.length / 2)] ?? 0;
    return { mean: values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0, median, max: Math.max(0, ...values) };
  };
  return {
    sourceRecords: numeric(sourceRecordCounts.map((value) => value.size)),
    languages: numeric(languageCounts.map((value) => value.size)),
    sourceTraditions: numeric(traditionCounts),
    zeroCandidates: sourceRecordCounts.filter((value) => value.size === 0).length,
    oneCandidate: sourceRecordCounts.filter((value) => value.size === 1).length,
    multipleCandidates: sourceRecordCounts.filter((value) => value.size > 1).length,
  };
}

export function validateS3AuthorityIdentitiesV0_2(rootDir = process.cwd()) {
  const actual = {
    s0Artifact: sha256FileV0_2(rootDir, S3_S0_ARTIFACT_PATH_V0_2),
    s0Manifest: sha256FileV0_2(rootDir, S3_S0_MANIFEST_PATH_V0_2),
    s1Projection: sha256FileV0_2(rootDir, S3_S1_PROJECTION_PATH_V0_2),
    s1CatalogDerivation: sha256FileV0_2(rootDir, S3_S1_CATALOG_DERIVATION_PATH_V0_2),
    s1RuntimeComposition: sha256FileV0_2(rootDir, S3_S1_RUNTIME_COMPOSITION_PATH_V0_2),
    s2Artifact: sha256FileV0_2(rootDir, S3_S2_ARTIFACT_PATH_V0_2),
    s2Manifest: sha256FileV0_2(rootDir, S3_S2_MANIFEST_PATH_V0_2),
    sourceProcedure: sha256FileV0_2(rootDir, S3_SOURCE_PROCEDURE_PATH_V0_2),
    sourceSample: sha256FileV0_2(rootDir, S3_SOURCE_SAMPLE_PATH_V0_2),
    populationSpec: sha256FileV0_2(rootDir, S3_POPULATION_SPEC_PATH_V0_2),
    cmudict: sha256FileV0_2(rootDir, S3_CMUDICT_PATH_V0_2),
  } as const;
  const matches = {
    s0Artifact: actual.s0Artifact === S3_EXPECTED_S0_ARTIFACT_SHA256_V0_2,
    s0Manifest: actual.s0Manifest === S3_EXPECTED_S0_MANIFEST_SHA256_V0_2,
    s1Projection: actual.s1Projection === S3_EXPECTED_S1_PROJECTION_SHA256_V0_2,
    s1CatalogDerivation: actual.s1CatalogDerivation === S3_EXPECTED_S1_CATALOG_DERIVATION_SHA256_V0_2,
    s1RuntimeComposition: actual.s1RuntimeComposition === S3_EXPECTED_S1_RUNTIME_COMPOSITION_SHA256_V0_2,
    s2Artifact: actual.s2Artifact === S3_EXPECTED_S2_ARTIFACT_SHA256_V0_2,
    s2Manifest: actual.s2Manifest === S3_EXPECTED_S2_MANIFEST_SHA256_V0_2,
    sourceProcedure: actual.sourceProcedure === S3_EXPECTED_SOURCE_PROCEDURE_SHA256_V0_2,
    sourceSample: actual.sourceSample === S3_EXPECTED_SOURCE_SAMPLE_SHA256_V0_2,
    populationSpec: actual.populationSpec === S3_EXPECTED_POPULATION_SPEC_SHA256_V0_2,
    cmudict: actual.cmudict === S3_EXPECTED_CMUDICT_SHA256_V0_2,
  } as const;
  if (Object.values(matches).some((value) => !value)) {
    throw new Error("S3_AUTHORITY_IDENTITY_MISMATCH");
  }
  return { actual, matches } as const;
}
