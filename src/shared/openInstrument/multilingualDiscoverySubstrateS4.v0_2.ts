import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { realpath } from "node:fs/promises";
import { isAbsolute, join, relative, resolve } from "node:path";

import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import {
  buildMotivationEngineDiscoveryV0_1,
  type MotivationEngineDiscoveryV0_1,
  type MotivationEngineDiscoveryCandidateV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
  type EnglishKaikkiProviderOperationalStatusV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import { createEnglishKaikkiServerOnlyExactIndexProviderV0_1 } from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";
import { reconstructS3SubstrateStatesV0_2 } from "@/shared/openInstrument/multilingualDiscoverySubstrateS3.v0_2";

export const S4_PRODUCT_VALIDATION_RESULT_DIRECTORY_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s4-product-validation-v0.1" as const;
export const S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2 =
  `${S4_PRODUCT_VALIDATION_RESULT_DIRECTORY_V0_2}/procedure.json` as const;
export const S4_PRODUCT_VALIDATION_EXECUTION_PATH_V0_2 =
  `${S4_PRODUCT_VALIDATION_RESULT_DIRECTORY_V0_2}/execution.json` as const;
export const S4_PRODUCT_VALIDATION_RESULTS_PATH_V0_2 =
  `${S4_PRODUCT_VALIDATION_RESULT_DIRECTORY_V0_2}/results.json` as const;
export const S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2 =
  `${S4_PRODUCT_VALIDATION_RESULT_DIRECTORY_V0_2}/summary.json` as const;
export const S4_PRODUCT_VALIDATION_HASH_MANIFEST_PATH_V0_2 =
  `${S4_PRODUCT_VALIDATION_RESULT_DIRECTORY_V0_2}/hash-manifest.json` as const;

const BROADER_SAMPLE_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/sample.json";
const BROADER_RESULTS_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-broader-stratified-diagnostic-v0.1/results.json";
const EXPECTED_REPOSITORY_BASE_V0_2 = "6b06c0d6009f11570807973ad7a28e1c633c1a21";
const EXPECTED_SAMPLE_SHA256_V0_2 = "20bd7e0f93629d8c1c87dfa76c1b1f1b9bfeb763dc44905bced2f91341179ffd";
const EXPECTED_BROADER_RESULTS_SHA256_V0_2 = "51019087d2199f8506267c3e6a4fbdb8824962641a6ed49abaa7e2c7bcc59ee6";
const EXPECTED_SAMPLE_IDENTITY_SHA256_V0_2 = "5fa453b1a6b7ad6dbc965080d6b47d48d54c4a4c7961813e13d6cae25a010dc3";

type JsonObject = Record<string, unknown>;
type HistoricalCase = Readonly<{
  input: string;
  valid: boolean;
  generatedQueryKeys: readonly string[];
}>;
type S4Procedure = Readonly<{
  schemaVersion: string;
  procedureId: string;
  status: string;
  authority: Readonly<{
    repositoryBase: string;
    samplePath: string;
    sampleSha256: string;
    sampleIdentitySha256: string;
    selectionId: string;
    sampleSize: number;
    validInputCount: number;
    invalidOrUnreachableInputCount: number;
    validityBinding: Readonly<{ path: string; sha256: string }>;
  }>;
  s4AuthoritativeAttemptsBefore: number;
  s4AuthoritativeAttemptsMax: number;
  resultArtifactCreated: boolean;
}>;

export type S4ProductValidationCandidateV0_2 = Readonly<{
  candidateId: string;
  candidateLanguage: string;
  candidateForm: string;
  candidateGloss: string;
  candidateEmbryo: string;
  sourceId: string;
  sourceStatus: string;
  attestationTruth: string;
  evidenceRefs: readonly string[];
  sourceUrlOrArchiveRef: string | null;
  entryLocator: string | null;
  candidateVoicePath: readonly string[];
  matchClassification: string;
  presentationClassification: string;
  functionalStatus: string;
  historicalRelation: string;
  userDecisionPosture: string;
  noSingleWinner: true;
}>;

export type S4ProductValidationSideV0_2 = Readonly<{
  classification: "GENERIC_CROSS_FORM_POSITIVE" | "EXACT_SELF_MATCH_ONLY" | "SUBSTRATE_NO_MATCH";
  candidateCount: number;
  crossFormCandidateCount: number;
  candidateSourceRecordIds: readonly string[];
  candidateLanguages: readonly string[];
  candidates: readonly S4ProductValidationCandidateV0_2[];
  validNull: boolean;
  nullReason: string | null;
  distinctSourceRecordCount: number;
  maxCandidatesPerSourceRecord: number;
}>;

export type S4ProductValidationCaseV0_2 = Readonly<{
  input: string;
  upstream: Readonly<{
    voicePath: readonly string[];
    gamma: readonly string[];
    structuralHypothesisIds: readonly string[];
    genericQueryKeys: readonly string[];
    fingerprint: string;
  }>;
  baseline: S4ProductValidationSideV0_2;
  expanded: S4ProductValidationSideV0_2;
  provider: EnglishKaikkiProviderOperationalStatusV0_1;
  baselinePositive: boolean;
  expandedPositive: boolean;
  newPositive: boolean;
  regressed: boolean;
  sourceAttribution: readonly string[];
}>;

export type S4ProductValidationSummaryV0_2 = Readonly<{
  TOTAL_INPUTS: number;
  VALID_INPUTS: number;
  BASELINE_POSITIVE_INPUTS: number;
  EXPANDED_POSITIVE_INPUTS: number;
  NEW_POSITIVE_INPUTS: number;
  UNCHANGED_POSITIVE_INPUTS: number;
  UNCHANGED_NULL_INPUTS: number;
  REGRESSED_INPUTS: number;
  ENGLISH_CONTRIBUTING_INPUTS: number;
  ALBANIAN_CONTRIBUTING_INPUTS: number;
  LATIN_CONTRIBUTING_INPUTS: number;
  MULTI_SOURCE_CONTRIBUTING_INPUTS: number;
  COVERAGE_BEFORE: number;
  COVERAGE_AFTER: number;
  COVERAGE_ABSOLUTE_DELTA: number;
  COVERAGE_RELATIVE_DELTA: number | null;
  TOTAL_BASELINE_CANDIDATES: number;
  TOTAL_EXPANDED_CANDIDATES: number;
  DISTINCT_BASELINE_SOURCE_RECORDS: number;
  DISTINCT_EXPANDED_SOURCE_RECORDS: number;
  MAX_EXPANDED_CANDIDATES_PER_INPUT: number;
}>;

function readJson<T>(rootDir: string, path: string): T {
  return JSON.parse(readFileSync(join(rootDir, path), "utf8")) as T;
}

function writeJson(rootDir: string, path: string, value: unknown): void {
  writeFileSync(join(rootDir, path), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256Bytes(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function sha256FileS4V0_2(rootDir: string, path: string): string {
  return sha256Bytes(readFileSync(join(rootDir, path)));
}

function sha256Json(value: unknown): string {
  return sha256Bytes(JSON.stringify(value));
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalized(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function sortedUnique(values: readonly string[]): string[] {
  return [...new Set(values)].sort(compareText);
}

function asObject(value: unknown): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("S4_AUTHORITY_JSON_OBJECT_REQUIRED");
  }
  return value as JsonObject;
}

function currentHead(rootDir: string): string {
  return execFileSync("git", ["rev-parse", "HEAD"], { cwd: rootDir, encoding: "utf8" }).trim();
}

function gitRoot(rootDir: string): string {
  return execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: rootDir, encoding: "utf8" }).trim();
}

function isInside(parent: string, child: string): boolean {
  const childRelative = relative(parent, child);
  return childRelative === "" || (!childRelative.startsWith("..") && !isAbsolute(childRelative));
}

function assertEqual<T>(actual: T, expected: T, code: string): void {
  if (actual !== expected) throw new Error(`${code}:${String(actual)}:${String(expected)}`);
}

function assertArrayEqual(actual: readonly string[], expected: readonly string[], code: string): void {
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    throw new Error(code);
  }
}

function loadFrozenAuthority(rootDir: string): Readonly<{
  procedure: S4Procedure;
  procedureSha256: string;
  sampleSha256: string;
  broaderResultsSha256: string;
  sampleIdentitySha256: string;
  historicalCases: readonly HistoricalCase[];
  validCases: readonly HistoricalCase[];
  sampleSize: number;
  validInputCount: number;
  invalidInputCount: number;
}> {
  const procedure = readJson<S4Procedure>(rootDir, S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2);
  const procedureSha256 = sha256FileS4V0_2(rootDir, S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2);
  const sampleSha256 = sha256FileS4V0_2(rootDir, BROADER_SAMPLE_PATH_V0_2);
  const broaderResultsSha256 = sha256FileS4V0_2(rootDir, BROADER_RESULTS_PATH_V0_2);
  const sample = asObject(readJson<unknown>(rootDir, BROADER_SAMPLE_PATH_V0_2));
  const broader = asObject(readJson<unknown>(rootDir, BROADER_RESULTS_PATH_V0_2));

  assertEqual(procedure.status, "DEFINED_NOT_EXECUTED", "S4_PROCEDURE_NOT_FROZEN");
  assertEqual(procedure.authority.repositoryBase, EXPECTED_REPOSITORY_BASE_V0_2, "S4_REPOSITORY_BASE_MISMATCH");
  assertEqual(procedure.authority.sampleSha256, EXPECTED_SAMPLE_SHA256_V0_2, "S4_SAMPLE_BINDING_MISMATCH");
  assertEqual(procedure.authority.validityBinding.sha256, EXPECTED_BROADER_RESULTS_SHA256_V0_2, "S4_VALIDITY_BINDING_MISMATCH");
  assertEqual(procedure.authority.sampleIdentitySha256, EXPECTED_SAMPLE_IDENTITY_SHA256_V0_2, "S4_SAMPLE_IDENTITY_BINDING_MISMATCH");
  assertEqual(sampleSha256, EXPECTED_SAMPLE_SHA256_V0_2, "S4_SAMPLE_CHANGED");
  assertEqual(broaderResultsSha256, EXPECTED_BROADER_RESULTS_SHA256_V0_2, "S4_VALIDITY_ARTIFACT_CHANGED");
  assertEqual(sample.sampleIdentitySha256, EXPECTED_SAMPLE_IDENTITY_SHA256_V0_2, "S4_SAMPLE_IDENTITY_CHANGED");
  assertEqual(sample.selectionId, procedure.authority.selectionId, "S4_SELECTION_ID_MISMATCH");
  assertEqual(sample.sampleSize, procedure.authority.sampleSize, "S4_SAMPLE_SIZE_MISMATCH");
  assertEqual(broader.sampleInputCount, procedure.authority.sampleSize, "S4_BROADER_SAMPLE_SIZE_MISMATCH");
  assertEqual(broader.sampleIdentitySha256, EXPECTED_SAMPLE_IDENTITY_SHA256_V0_2, "S4_BROADER_SAMPLE_IDENTITY_MISMATCH");
  assertEqual(broader.syntheticOnly, true, "S4_BROADER_NOT_SYNTHETIC_ONLY");
  assertEqual(broader.realDataExecuted, false, "S4_BROADER_REAL_DATA_EXECUTED");
  assertEqual(broader.noRerun, true, "S4_BROADER_RERUN_FLAG");

  const identities = Array.isArray(sample.selectedIdentities) ? sample.selectedIdentities : [];
  const cases = Array.isArray(broader.cases) ? broader.cases : [];
  assertEqual(identities.length, procedure.authority.sampleSize, "S4_SAMPLE_IDENTITY_COUNT_MISMATCH");
  assertEqual(cases.length, procedure.authority.sampleSize, "S4_BROADER_CASE_COUNT_MISMATCH");
  const historicalCases = cases.map((value): HistoricalCase => {
    const record = asObject(value);
    if (typeof record.input !== "string" || typeof record.valid !== "boolean" || !Array.isArray(record.generatedQueryKeys)) {
      throw new Error("S4_BROADER_CASE_SCHEMA_MISMATCH");
    }
    return Object.freeze({
      input: record.input,
      valid: record.valid,
      generatedQueryKeys: record.generatedQueryKeys.filter((key): key is string => typeof key === "string"),
    });
  });
  identities.forEach((value, index) => {
    const identity = asObject(value);
    assertEqual(identity.input, historicalCases[index]?.input, "S4_SAMPLE_INPUT_ORDER_MISMATCH");
  });
  const validCases = historicalCases.filter((entry) => entry.valid);
  const invalidInputCount = historicalCases.length - validCases.length;
  assertEqual(validCases.length, procedure.authority.validInputCount, "S4_VALID_INPUT_COUNT_MISMATCH");
  assertEqual(invalidInputCount, procedure.authority.invalidOrUnreachableInputCount, "S4_INVALID_INPUT_COUNT_MISMATCH");
  return Object.freeze({
    procedure,
    procedureSha256,
    sampleSha256,
    broaderResultsSha256,
    sampleIdentitySha256: EXPECTED_SAMPLE_IDENTITY_SHA256_V0_2,
    historicalCases,
    validCases,
    sampleSize: historicalCases.length,
    validInputCount: validCases.length,
    invalidInputCount,
  });
}

function compactCandidate(candidate: MotivationEngineDiscoveryCandidateV0_1): S4ProductValidationCandidateV0_2 {
  return Object.freeze({
    candidateId: candidate.candidateId,
    candidateLanguage: candidate.candidateLanguage,
    candidateForm: candidate.candidateForm,
    candidateGloss: candidate.candidateGloss,
    candidateEmbryo: candidate.candidateEmbryo,
    sourceId: candidate.sourceFact.sourceId,
    sourceStatus: candidate.sourceFact.sourceStatus,
    attestationTruth: candidate.sourceFact.attestationTruth,
    evidenceRefs: [...candidate.sourceFact.evidenceRefs],
    sourceUrlOrArchiveRef: candidate.sourceFact.sourceUrlOrArchiveRef,
    entryLocator: candidate.sourceFact.entryLocator,
    candidateVoicePath: [...candidate.candidateVoicePath],
    matchClassification: candidate.structuralComparison.matchClassification,
    presentationClassification: candidate.structuralComparison.presentationClassification,
    functionalStatus: candidate.functionalInterpretation.status,
    historicalRelation: candidate.historicalRelation,
    userDecisionPosture: candidate.userDecisionPosture,
    noSingleWinner: candidate.noSingleWinner,
  });
}

function evaluateSide(
  input: string,
  discovery: MotivationEngineDiscoveryV0_1,
): S4ProductValidationSideV0_2 {
  const candidates = discovery.candidates.map(compactCandidate);
  const crossForm = candidates.filter((candidate) => normalized(candidate.candidateForm) !== normalized(input));
  const sourceIds = sortedUnique(candidates.map((candidate) => candidate.sourceId));
  const languages = sortedUnique(candidates.map((candidate) => candidate.candidateLanguage === "sq" ? "Albanian" : candidate.candidateLanguage));
  const perSource = new Map<string, number>();
  for (const candidate of candidates) perSource.set(candidate.sourceId, (perSource.get(candidate.sourceId) ?? 0) + 1);
  return Object.freeze({
    classification: crossForm.length > 0
      ? "GENERIC_CROSS_FORM_POSITIVE"
      : candidates.length > 0
        ? "EXACT_SELF_MATCH_ONLY"
        : "SUBSTRATE_NO_MATCH",
    candidateCount: candidates.length,
    crossFormCandidateCount: crossForm.length,
    candidateSourceRecordIds: sourceIds,
    candidateLanguages: languages,
    candidates,
    validNull: candidates.length === 0,
    nullReason: candidates.length === 0 ? discovery.unknownOrNull.reason : null,
    distinctSourceRecordCount: sourceIds.length,
    maxCandidatesPerSourceRecord: Math.max(0, ...perSource.values()),
  });
}

function upstreamFor(
  discovery: MotivationEngineDiscoveryV0_1,
  genericQueryKeys: readonly string[],
) {
  const value = {
    voicePath: [...discovery.derivedStructure.voicePath],
    gamma: [...discovery.derivedStructure.gamma.orderedUnits],
    structuralHypothesisIds: discovery.derivedStructure.structuralHypotheses.map((hypothesis) => hypothesis.hypothesisId),
    genericQueryKeys: [...genericQueryKeys],
  } as const;
  return Object.freeze({ ...value, fingerprint: sha256Json(value) });
}

function assertDiscoveryBoundary(discovery: MotivationEngineDiscoveryV0_1, externalRoot: string): void {
  const serialized = JSON.stringify(discovery);
  if (serialized.includes(externalRoot) || serialized.includes(resolve(externalRoot))) {
    throw new Error("S4_EXTERNAL_ROOT_LEAK");
  }
  for (const candidate of discovery.candidates) {
    if (
      !candidate.sourceFact.sourceId ||
      !candidate.sourceFact.sourceStatus ||
      !candidate.sourceFact.attestationTruth ||
      candidate.sourceFact.evidenceRefs.length === 0 ||
      !candidate.sourceFact.entryLocator ||
      candidate.historicalRelation !== "not_claimed" ||
      candidate.userDecisionPosture !== "user_decides" ||
      candidate.noSingleWinner !== true ||
      candidate.candidateStatus !== "experimental"
    ) throw new Error("S4_CANDIDATE_AUTHORITY_BOUNDARY_FAILURE");
    if (candidate.candidateLanguage === "English") {
      if (candidate.candidateVoicePath.length !== 0) throw new Error("S4_ENGLISH_VOICE_PATH_NOT_NULL");
      if (
        candidate.functionalInterpretation.status !== "UNKNOWN_OR_NULL" &&
        candidate.functionalInterpretation.status !== "NOT_APPLICABLE_SELF_MATCH"
      ) throw new Error("S4_ENGLISH_FUNCTIONAL_CLAIM_UNAUTHORIZED");
      const url = candidate.sourceFact.sourceUrlOrArchiveRef;
      if (!url) throw new Error("S4_ENGLISH_PROVENANCE_MISSING");
      const hostname = new URL(url).hostname;
      if (hostname !== "kaikki.org" && !hostname.endsWith(".kaikki.org")) {
        throw new Error("S4_ENGLISH_PROVENANCE_HOST_MISMATCH");
      }
    }
  }
}

function assertBaselinePreserved(
  baseline: S4ProductValidationSideV0_2,
  expanded: S4ProductValidationSideV0_2,
): void {
  const expandedIds = new Set(expanded.candidateSourceRecordIds);
  if (baseline.candidateSourceRecordIds.some((id) => !expandedIds.has(id))) {
    throw new Error("S4_BASELINE_SOURCE_RECORD_REGRESSION");
  }
}

function sourceAttribution(input: string, side: S4ProductValidationSideV0_2): string[] {
  const families = sortedUnique(
    side.candidates
      .filter((candidate) => normalized(candidate.candidateForm) !== normalized(input))
      .map((candidate) => candidate.candidateLanguage === "sq" ? "Albanian" : candidate.candidateLanguage),
  );
  if (families.length === 1 && families[0] === "English") return ["English-only"];
  if (families.length === 1 && families[0] === "Albanian") return ["Albanian-only"];
  if (families.length === 1 && families[0] === "Latin") return ["Latin-only"];
  if (families.length > 1) return ["multi-source"];
  return [];
}

function aggregateSummary(cases: readonly S4ProductValidationCaseV0_2[], totalInputs: number, validInputs: number): S4ProductValidationSummaryV0_2 {
  const baselinePositive = cases.filter((entry) => entry.baselinePositive).length;
  const expandedPositive = cases.filter((entry) => entry.expandedPositive).length;
  const newPositive = cases.filter((entry) => entry.newPositive).length;
  const unchangedPositive = cases.filter((entry) => entry.baselinePositive && entry.expandedPositive).length;
  const unchangedNull = cases.filter((entry) => !entry.baselinePositive && !entry.expandedPositive && entry.baseline.validNull && entry.expanded.validNull).length;
  const regressed = cases.filter((entry) => entry.regressed).length;
  const contribution = (label: string) => cases.filter((entry) => entry.newPositive && entry.sourceAttribution.includes(label)).length;
  const coverageBefore = validInputs === 0 ? 0 : baselinePositive / validInputs;
  const coverageAfter = validInputs === 0 ? 0 : expandedPositive / validInputs;
  return Object.freeze({
    TOTAL_INPUTS: totalInputs,
    VALID_INPUTS: validInputs,
    BASELINE_POSITIVE_INPUTS: baselinePositive,
    EXPANDED_POSITIVE_INPUTS: expandedPositive,
    NEW_POSITIVE_INPUTS: newPositive,
    UNCHANGED_POSITIVE_INPUTS: unchangedPositive,
    UNCHANGED_NULL_INPUTS: unchangedNull,
    REGRESSED_INPUTS: regressed,
    ENGLISH_CONTRIBUTING_INPUTS: contribution("English-only"),
    ALBANIAN_CONTRIBUTING_INPUTS: contribution("Albanian-only"),
    LATIN_CONTRIBUTING_INPUTS: contribution("Latin-only"),
    MULTI_SOURCE_CONTRIBUTING_INPUTS: contribution("multi-source"),
    COVERAGE_BEFORE: coverageBefore,
    COVERAGE_AFTER: coverageAfter,
    COVERAGE_ABSOLUTE_DELTA: coverageAfter - coverageBefore,
    COVERAGE_RELATIVE_DELTA: baselinePositive === 0 ? null : (expandedPositive - baselinePositive) / baselinePositive,
    TOTAL_BASELINE_CANDIDATES: cases.reduce((sum, entry) => sum + entry.baseline.candidateCount, 0),
    TOTAL_EXPANDED_CANDIDATES: cases.reduce((sum, entry) => sum + entry.expanded.candidateCount, 0),
    DISTINCT_BASELINE_SOURCE_RECORDS: new Set(cases.flatMap((entry) => entry.baseline.candidateSourceRecordIds)).size,
    DISTINCT_EXPANDED_SOURCE_RECORDS: new Set(cases.flatMap((entry) => entry.expanded.candidateSourceRecordIds)).size,
    MAX_EXPANDED_CANDIDATES_PER_INPUT: Math.max(0, ...cases.map((entry) => entry.expanded.candidateCount)),
  });
}

function assertProcedureNotExecuted(rootDir: string): Readonly<{
  authority: ReturnType<typeof loadFrozenAuthority>;
  gitRoot: string;
  executionHead: string;
}> {
  const authority = loadFrozenAuthority(rootDir);
  if (existsSync(join(rootDir, S4_PRODUCT_VALIDATION_EXECUTION_PATH_V0_2))) {
    throw new Error("S4_EXECUTION_ARTIFACT_ALREADY_EXISTS");
  }
  const root = gitRoot(rootDir);
  const executionHead = currentHead(rootDir);
  try {
    execFileSync("git", ["merge-base", "--is-ancestor", authority.procedure.authority.repositoryBase, executionHead], { cwd: rootDir, stdio: "ignore" });
  } catch {
    throw new Error("S4_EXECUTION_HEAD_NOT_DESCENDANT_OF_AUTHORITY_BASE");
  }
  return Object.freeze({ authority, gitRoot: root, executionHead });
}

export function ensureS4ProductValidationResultDirectoryV0_2(rootDir = process.cwd()): string {
  const resultDir = join(rootDir, S4_PRODUCT_VALIDATION_RESULT_DIRECTORY_V0_2);
  mkdirSync(resultDir, { recursive: true });
  return resultDir;
}

export async function executeS4ProductValidationV0_2(rootDir = process.cwd()): Promise<Readonly<{
  summary: S4ProductValidationSummaryV0_2;
  resultsPath: string;
  summaryPath: string;
  hashManifestPath: string;
}>> {
  const preflight = assertProcedureNotExecuted(rootDir);
  const externalRootValue = process.env.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT;
  if (!externalRootValue) throw new Error("S4_EXTERNAL_ROOT_NOT_CONFIGURED");
  const externalRoot = await realpath(externalRootValue).catch(() => {
    throw new Error("S4_EXTERNAL_ROOT_NOT_FOUND");
  });
  if (isInside(preflight.gitRoot, externalRoot)) throw new Error("S4_EXTERNAL_ROOT_INSIDE_GIT");
  const states = reconstructS3SubstrateStatesV0_2(rootDir);
  if (states.after.total !== 76 || states.after.languageCounts.Albanian !== 55 || states.after.languageCounts.Latin !== 21) {
    throw new Error("S4_SUBSTRATE_AUTHORITY_MISMATCH");
  }
  const provider = await createEnglishKaikkiServerOnlyExactIndexProviderV0_1();
  const cases: S4ProductValidationCaseV0_2[] = [];
  for (const historical of preflight.authority.validCases) {
    const heart = buildHeartInstrumentV1(historical.input);
    const payload = await runAnalysisDeterministic(historical.input, { mode: "strict", alphabet: "auto" });
    const analysis = enginePayloadToAnalysisResult(payload);
    const baselineDiscovery = buildMotivationEngineDiscoveryV0_1({
      word: historical.input,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis,
      heart,
      sourceAdapters: states.afterAdapters,
    });
    const expandedResult = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: historical.input,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis,
      heart,
      provider,
    });
    const currentQueryKeys = sortedUnique(baselineDiscovery.derivedStructure.structuralHypotheses.flatMap((hypothesis) => hypothesis.expansionChain));
    assertArrayEqual(currentQueryKeys, sortedUnique(historical.generatedQueryKeys), `S4_QUERY_KEY_AUTHORITY_MISMATCH:${historical.input}`);
    const baselineUpstream = upstreamFor(baselineDiscovery, currentQueryKeys);
    const expandedUpstream = upstreamFor(expandedResult.discovery, currentQueryKeys);
    if (baselineUpstream.fingerprint !== expandedUpstream.fingerprint) throw new Error(`S4_UPSTREAM_DRIFT:${historical.input}`);
    assertDiscoveryBoundary(expandedResult.discovery, externalRoot);
    const baseline = evaluateSide(historical.input, baselineDiscovery);
    const expanded = evaluateSide(historical.input, expandedResult.discovery);
    assertBaselinePreserved(baseline, expanded);
    const baselinePositive = baseline.classification === "GENERIC_CROSS_FORM_POSITIVE";
    const expandedPositive = expanded.classification === "GENERIC_CROSS_FORM_POSITIVE";
    cases.push(Object.freeze({
      input: historical.input,
      upstream: baselineUpstream,
      baseline,
      expanded,
      provider: expandedResult.englishProvider,
      baselinePositive,
      expandedPositive,
      newPositive: !baselinePositive && expandedPositive,
      regressed: baselinePositive && !expandedPositive,
      sourceAttribution: !baselinePositive && expandedPositive ? sourceAttribution(historical.input, expanded) : [],
    }));
  }
  const summary = aggregateSummary(cases, preflight.authority.sampleSize, preflight.authority.validInputCount);
  const providerFailures = cases.filter((entry) => entry.provider.status !== "AVAILABLE");
  if (providerFailures.length > 0) throw new Error(`S4_PROVIDER_UNAVAILABLE:${providerFailures.length}`);
  if (summary.REGRESSED_INPUTS !== 0) throw new Error(`S4_REGRESSIONS:${summary.REGRESSED_INPUTS}`);
  ensureS4ProductValidationResultDirectoryV0_2(rootDir);
  const execution = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-s4-product-validation.v0.1.execution",
    status: "COMPLETED_RESULT_PRESERVED",
    procedurePath: S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2,
    procedureSha256: preflight.authority.procedureSha256,
    repositoryAuthorityBase: preflight.authority.procedure.authority.repositoryBase,
    repositoryExecutionHead: preflight.executionHead,
    samplePath: BROADER_SAMPLE_PATH_V0_2,
    sampleSha256: preflight.authority.sampleSha256,
    sampleIdentitySha256: preflight.authority.sampleIdentitySha256,
    validityBindingPath: BROADER_RESULTS_PATH_V0_2,
    validityBindingSha256: preflight.authority.broaderResultsSha256,
    externalRootConfigured: true,
    externalRootRecorded: false,
    attempt1: {
      classification: "MECHANICAL_POST_EVALUATION_PERSISTENCE_FAILURE",
      providerEvaluationReachedPersistence: true,
      executionJsonWritten: false,
      resultsJsonWritten: false,
      interpretableResearchResult: false,
      failure: "EXISTING_PROCEDURE_DIRECTORY_RECREATION",
    },
    correctiveAttempt: {
      authorized: true,
      number: 2,
      reason: "MECHANICAL_PERSISTENCE_FAILURE_BEFORE_DURABLE_RESULT_COMMIT",
    },
    authoritativeAttemptsBefore: 1,
    authoritativeAttempts: 2,
    authoritativeAttemptsMax: 2,
    durableResultAttempt: 2,
    sourceAcquisitionPerformed: false,
    sourceContentInspectedByS4: false,
    networkTransferPerformed: false,
    historicalS0S3Rerun: false,
    casesEvaluated: cases.length,
  } as const;
  const results = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-s4-product-validation.v0.1.result",
    status: "COMPLETED_RESULT_PRESERVED",
    experimentId: "open-instrument.multilingual-discovery-substrate-expansion-v0.2.s4-product-validation.v0.1",
    execution,
    summary,
    cases,
    invalidOrUnreachableInputCount: preflight.authority.invalidInputCount,
    outcome: summary.NEW_POSITIVE_INPUTS > 0 ? "S4_MEASURABLE_IMPROVEMENT" : "S4_BOUNDED_NO_IMPROVEMENT",
    productSurfaceValidation: "PENDING",
  } as const;
  const summaryArtifact = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-s4-product-validation.v0.1.summary",
    status: "COMPLETED_RESULT_PRESERVED",
    authority: {
      procedurePath: S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2,
      procedureSha256: preflight.authority.procedureSha256,
      samplePath: BROADER_SAMPLE_PATH_V0_2,
      sampleSha256: preflight.authority.sampleSha256,
      sampleIdentitySha256: preflight.authority.sampleIdentitySha256,
      validityBindingSha256: preflight.authority.broaderResultsSha256,
    },
    summary,
    outcome: results.outcome,
    productSurfaceValidation: "PENDING",
  } as const;
  writeJson(rootDir, S4_PRODUCT_VALIDATION_EXECUTION_PATH_V0_2, execution);
  writeJson(rootDir, S4_PRODUCT_VALIDATION_RESULTS_PATH_V0_2, results);
  writeJson(rootDir, S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2, summaryArtifact);
  const artifacts = [
    S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2,
    S4_PRODUCT_VALIDATION_EXECUTION_PATH_V0_2,
    S4_PRODUCT_VALIDATION_RESULTS_PATH_V0_2,
    S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2,
  ].map((path) => ({ path, sha256: sha256FileS4V0_2(rootDir, path) }));
  writeJson(rootDir, S4_PRODUCT_VALIDATION_HASH_MANIFEST_PATH_V0_2, {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-s4-product-validation-v0.1.hash-manifest",
    status: "COMPLETED_RESULT_PRESERVED",
    artifacts,
    execution: {
      attempts: 2,
      attemptsMax: 2,
      correctiveAttempt: 2,
      durableResultAttempt: 2,
      noThirdAttempt: true,
      sourceAcquisition: false,
      sourceContentInspected: false,
      networkTransfer: false,
    },
  });
  return Object.freeze({
    summary,
    resultsPath: S4_PRODUCT_VALIDATION_RESULTS_PATH_V0_2,
    summaryPath: S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2,
    hashManifestPath: S4_PRODUCT_VALIDATION_HASH_MANIFEST_PATH_V0_2,
  });
}

function persistedCaseV0_2(value: unknown, index: number): S4ProductValidationCaseV0_2 {
  const entry = asObject(value);
  const required = [
    "input",
    "upstream",
    "baseline",
    "expanded",
    "provider",
    "baselinePositive",
    "expandedPositive",
    "newPositive",
    "regressed",
    "sourceAttribution",
  ];
  if (required.some((key) => !(key in entry))) throw new Error(`S4_PERSISTED_CASE_SCHEMA:${index}`);
  if (
    typeof entry.input !== "string" ||
    !entry.upstream ||
    !entry.baseline ||
    !entry.expanded ||
    !entry.provider ||
    !Array.isArray(entry.sourceAttribution)
  ) throw new Error(`S4_PERSISTED_CASE_SCHEMA:${index}`);
  const baseline = asObject(entry.baseline);
  const expanded = asObject(entry.expanded);
  for (const [label, side] of [["baseline", baseline], ["expanded", expanded]] as const) {
    if (
      typeof side.classification !== "string" ||
      typeof side.candidateCount !== "number" ||
      typeof side.crossFormCandidateCount !== "number" ||
      !Array.isArray(side.candidateSourceRecordIds) ||
      !Array.isArray(side.candidateLanguages) ||
      !Array.isArray(side.candidates) ||
      typeof side.validNull !== "boolean" ||
      !(side.nullReason === null || typeof side.nullReason === "string") ||
      typeof side.distinctSourceRecordCount !== "number" ||
      typeof side.maxCandidatesPerSourceRecord !== "number" ||
      side.candidateCount !== side.candidates.length ||
      side.distinctSourceRecordCount !== new Set(side.candidates.map((candidate) => asObject(candidate).sourceId)).size
    ) throw new Error(`S4_PERSISTED_SIDE_SCHEMA:${index}:${label}`);
  }
  const provider = asObject(entry.provider);
  if (provider.status !== "AVAILABLE") throw new Error(`S4_PERSISTED_PROVIDER_UNAVAILABLE:${index}`);
  const upstream = asObject(entry.upstream);
  if (
    !Array.isArray(upstream.voicePath) ||
    !Array.isArray(upstream.gamma) ||
    !Array.isArray(upstream.structuralHypothesisIds) ||
    !Array.isArray(upstream.genericQueryKeys) ||
    typeof upstream.fingerprint !== "string"
  ) throw new Error(`S4_PERSISTED_UPSTREAM_SCHEMA:${index}`);
  if (
    typeof entry.baselinePositive !== "boolean" ||
    typeof entry.expandedPositive !== "boolean" ||
    typeof entry.newPositive !== "boolean" ||
    typeof entry.regressed !== "boolean"
  ) throw new Error(`S4_PERSISTED_CLASSIFICATION_SCHEMA:${index}`);
  const baselinePositive = baseline.classification === "GENERIC_CROSS_FORM_POSITIVE";
  const expandedPositive = expanded.classification === "GENERIC_CROSS_FORM_POSITIVE";
  if (
    entry.baselinePositive !== baselinePositive ||
    entry.expandedPositive !== expandedPositive ||
    entry.newPositive !== (!baselinePositive && expandedPositive) ||
    entry.regressed !== (baselinePositive && !expandedPositive)
  ) throw new Error(`S4_PERSISTED_CLASSIFICATION_MISMATCH:${index}`);
  return entry as unknown as S4ProductValidationCaseV0_2;
}

export function finalizeS4ProductValidationAttempt2V0_2(rootDir = process.cwd()): Readonly<{
  summary: S4ProductValidationSummaryV0_2;
  summaryPath: string;
  hashManifestPath: string;
}> {
  const authority = loadFrozenAuthority(rootDir);
  const execution = readJson<JsonObject>(rootDir, S4_PRODUCT_VALIDATION_EXECUTION_PATH_V0_2);
  const results = readJson<JsonObject>(rootDir, S4_PRODUCT_VALIDATION_RESULTS_PATH_V0_2);
  if (existsSync(join(rootDir, S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2)) || existsSync(join(rootDir, S4_PRODUCT_VALIDATION_HASH_MANIFEST_PATH_V0_2))) {
    throw new Error("S4_FINALIZATION_ARTIFACT_ALREADY_EXISTS");
  }
  assertEqual(execution.durableResultAttempt, 2, "S4_RECOVERY_ATTEMPT_MISMATCH");
  assertEqual((execution.correctiveAttempt as JsonObject).number, 2, "S4_RECOVERY_CORRECTIVE_ATTEMPT_MISMATCH");
  assertEqual(results.status, "COMPLETED_RESULT_PRESERVED", "S4_RECOVERY_RESULT_STATUS_MISMATCH");
  const rawCases = Array.isArray(results.cases) ? results.cases : [];
  assertEqual(rawCases.length, authority.validInputCount, "S4_RECOVERY_CASE_COUNT_MISMATCH");
  const persistedCases = rawCases.map(persistedCaseV0_2);
  const expectedInputs = authority.validCases.map((entry) => entry.input);
  const actualInputs = persistedCases.map((entry) => entry.input);
  assertArrayEqual(actualInputs, expectedInputs, "S4_RECOVERY_INPUT_ORDER_MISMATCH");
  if (new Set(actualInputs).size !== actualInputs.length) throw new Error("S4_RECOVERY_DUPLICATE_INPUT");
  const externalRootLeak = JSON.stringify(results).includes("/Users/") || JSON.stringify(results).includes("\\\\");
  if (externalRootLeak) throw new Error("S4_RECOVERY_EXTERNAL_PATH_LEAK");
  const summary = aggregateSummary(persistedCases, authority.sampleSize, authority.validInputCount);
  const storedSummary = results.summary as S4ProductValidationSummaryV0_2;
  if (JSON.stringify(storedSummary) !== JSON.stringify(summary)) throw new Error("S4_RECOVERY_SUMMARY_RECOMPUTATION_MISMATCH");
  const summaryArtifact = {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-s4-product-validation.v0.1.summary",
    status: "COMPLETED_RESULT_PRESERVED",
    authority: {
      procedurePath: S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2,
      procedureSha256: authority.procedureSha256,
      samplePath: BROADER_SAMPLE_PATH_V0_2,
      sampleSha256: authority.sampleSha256,
      sampleIdentitySha256: authority.sampleIdentitySha256,
      validityBindingSha256: authority.broaderResultsSha256,
    },
    recovery: {
      method: "OFFLINE_DETERMINISTIC_ARTIFACT_FINALIZATION",
      attempt1Classification: "MECHANICAL_POST_EVALUATION_PERSISTENCE_FAILURE",
      attempt1DurableResult: false,
      correctiveAttemptNumber: 2,
      providerQueriesDuringRecovery: 0,
      indexLookupsDuringRecovery: 0,
      networkCallsDuringRecovery: 0,
      evaluationInputsReexecuted: 0,
    },
    summary,
    outcome: results.outcome,
    productSurfaceValidation: results.productSurfaceValidation,
  } as const;
  writeJson(rootDir, S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2, summaryArtifact);
  const artifacts = [
    S4_PRODUCT_VALIDATION_PROCEDURE_PATH_V0_2,
    S4_PRODUCT_VALIDATION_EXECUTION_PATH_V0_2,
    S4_PRODUCT_VALIDATION_RESULTS_PATH_V0_2,
    S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2,
  ].map((path) => ({ path, sha256: sha256FileS4V0_2(rootDir, path) }));
  writeJson(rootDir, S4_PRODUCT_VALIDATION_HASH_MANIFEST_PATH_V0_2, {
    schemaVersion: "open-instrument.multilingual-discovery-substrate-expansion-s4-product-validation-v0.1.hash-manifest",
    status: "COMPLETED_RESULT_PRESERVED",
    artifacts,
    recovery: summaryArtifact.recovery,
    execution: {
      attempts: 2,
      attemptsMax: 2,
      correctiveAttempt: 2,
      durableResultAttempt: 2,
      noThirdAttempt: true,
      sourceAcquisition: false,
      sourceContentInspected: false,
      networkTransfer: false,
    },
  });
  return Object.freeze({
    summary,
    summaryPath: S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2,
    hashManifestPath: S4_PRODUCT_VALIDATION_HASH_MANIFEST_PATH_V0_2,
  });
}

export function verifyS4ProductValidationV0_2(rootDir = process.cwd()): Readonly<{
  summary: S4ProductValidationSummaryV0_2;
  outcome: string;
  manifestVerified: boolean;
}> {
  const execution = readJson<JsonObject>(rootDir, S4_PRODUCT_VALIDATION_EXECUTION_PATH_V0_2);
  const results = readJson<JsonObject>(rootDir, S4_PRODUCT_VALIDATION_RESULTS_PATH_V0_2);
  const summaryArtifact = readJson<JsonObject>(rootDir, S4_PRODUCT_VALIDATION_SUMMARY_PATH_V0_2);
  const manifest = readJson<JsonObject>(rootDir, S4_PRODUCT_VALIDATION_HASH_MANIFEST_PATH_V0_2);
  assertEqual(execution.authoritativeAttempts, 2, "S4_RESULT_ATTEMPT_MISMATCH");
  assertEqual(execution.authoritativeAttemptsMax, 2, "S4_RESULT_ATTEMPT_MAX_MISMATCH");
  assertEqual(execution.durableResultAttempt, 2, "S4_DURABLE_ATTEMPT_MISMATCH");
  assertEqual((execution.correctiveAttempt as JsonObject).number, 2, "S4_CORRECTIVE_ATTEMPT_MISMATCH");
  assertEqual(execution.externalRootRecorded, false, "S4_EXTERNAL_ROOT_RECORDED");
  assertEqual(execution.networkTransferPerformed, false, "S4_NETWORK_TRANSFER_FLAG");
  assertEqual(results.status, "COMPLETED_RESULT_PRESERVED", "S4_RESULT_STATUS_MISMATCH");
  assertEqual(summaryArtifact.status, "COMPLETED_RESULT_PRESERVED", "S4_SUMMARY_STATUS_MISMATCH");
  const artifacts = Array.isArray(manifest.artifacts) ? manifest.artifacts : [];
  for (const value of artifacts) {
    const artifact = asObject(value);
    if (typeof artifact.path !== "string" || typeof artifact.sha256 !== "string" || sha256FileS4V0_2(rootDir, artifact.path) !== artifact.sha256) {
      throw new Error("S4_HASH_MANIFEST_MISMATCH");
    }
  }
  if (!Array.isArray(results.cases) || results.cases.length !== Number(summaryArtifact.summary && (summaryArtifact.summary as JsonObject).VALID_INPUTS)) {
    throw new Error("S4_RESULT_CASE_COUNT_MISMATCH");
  }
  const summary = summaryArtifact.summary as S4ProductValidationSummaryV0_2;
  if (summary.REGRESSED_INPUTS !== 0) throw new Error("S4_STORED_REGRESSION");
  return Object.freeze({ summary, outcome: String(results.outcome), manifestVerified: true });
}
