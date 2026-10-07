import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  aggregateS3CasesV0_2,
  evaluateFrozenS3PairV0_2,
  reconstructFrozenS3SampleV0_2,
  reconstructS3SubstrateStatesV0_2,
  sha256BytesV0_2,
  sha256FileV0_2,
  validateS3AuthorityIdentitiesV0_2,
  MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_PROCEDURE_ID_V0_2,
  MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_SCHEMA_VERSION_V0_2,
  S3_CMUDICT_PATH_V0_2,
  S3_EXPECTED_AFTER_FINGERPRINT_V0_2,
  S3_EXPECTED_BEFORE_FINGERPRINT_V0_2,
  S3_EXPECTED_CMUDICT_SHA256_V0_2,
  S3_EXPECTED_POPULATION_SPEC_SHA256_V0_2,
  S3_EXPECTED_SOURCE_PROCEDURE_SHA256_V0_2,
  S3_EXPECTED_SOURCE_SAMPLE_SHA256_V0_2,
  S3_POPULATION_SPEC_PATH_V0_2,
  S3_SOURCE_PROCEDURE_PATH_V0_2,
  S3_SOURCE_SAMPLE_PATH_V0_2,
  type MultilingualDiscoverySubstrateS3CaseV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS3.v0_2";

const ROOT = process.cwd();
const ARTIFACT_RELATIVE_DIRECTORY =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s3-independent-coverage-evaluation-v0.1";
const ARTIFACT_DIRECTORY = join(ROOT, ARTIFACT_RELATIVE_DIRECTORY);
const EXECUTION_PATH = join(ARTIFACT_DIRECTORY, "execution.json");
const SAMPLE_PATH = join(ARTIFACT_DIRECTORY, "sample.json");
const PAIRED_RESULTS_PATH = join(ARTIFACT_DIRECTORY, "paired-results.json");
const SUMMARY_PATH = join(ARTIFACT_DIRECTORY, "summary.json");
const MANIFEST_PATH = join(ARTIFACT_DIRECTORY, "hash-manifest.json");
const MILESTONE_PATH = "docs/open-instrument/multilingual-discovery-substrate-expansion-v0.2-milestone.md";

const EXPERIMENT_ID =
  "open-instrument.multilingual-discovery-substrate-expansion-v0.2.s3-independent-coverage-evaluation.v0.1";
const CONTRACT_ID = "OPEN_INSTRUMENT_MULTILINGUAL_DISCOVERY_SUBSTRATE_EXPANSION_V0_2";
const REPOSITORY_HEAD = "3855488b9b37fcd42c2c1eaf3dbd4191831578d8";
const SAMPLE_SELECTION_ID = "M7_FROZEN_PREPARED_ORDERED_POPULATION_FIRST_512_REACHABLE";
const SAMPLE_SIZE = 512;
const ATTEMPT_MAX = 1;

const compactJson = (value: unknown): string => JSON.stringify(value);
const canonicalJson = (value: unknown): string => `${JSON.stringify(value, null, 2)}\n`;
const sha256Json = (value: unknown): string => sha256BytesV0_2(compactJson(value));
const sha256CanonicalJson = (value: unknown): string => sha256BytesV0_2(canonicalJson(value));
const readJson = <T>(path: string): T => JSON.parse(readFileSync(path, "utf8")) as T;
const writeCanonicalJson = (path: string, value: unknown): void => {
  writeFileSync(path, canonicalJson(value), "utf8");
};
const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) throw new Error(message);
};

function sourceRelative(path: string): string {
  return path.slice(`${ROOT}/`.length);
}

function frozenExecutionIdentity(
  sample: ReturnType<typeof reconstructFrozenS3SampleV0_2>,
  states: ReturnType<typeof reconstructS3SubstrateStatesV0_2>,
  authority: ReturnType<typeof validateS3AuthorityIdentitiesV0_2>,
) {
  return {
    experimentId: EXPERIMENT_ID,
    contractId: CONTRACT_ID,
    schemaVersion: MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_SCHEMA_VERSION_V0_2,
    procedureId: MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_PROCEDURE_ID_V0_2,
    repositoryHead: REPOSITORY_HEAD,
    scheduleVersion: "frozen-prepared-ordered-population-v0.1",
    fixtureVersion: "m7-frozen-cmudict-population-v0.1",
    acceptanceVersion: "multilingual-discovery-substrate-v0.2-s3-coverage-v0.1",
    masterSeed: null,
    streams: [],
    sample: {
      sourcePath: S3_SOURCE_SAMPLE_PATH_V0_2,
      sourceSha256: sample.sourceSampleSha256,
      sampleSize: sample.sampleSize,
      selectionId: SAMPLE_SELECTION_ID,
      firstInput: sample.firstInput,
      lastInput: sample.lastInput,
    },
    substrate: {
      before: {
        total: states.before.total,
        languageCounts: states.before.languageCounts,
        uniqueForms: states.before.uniqueForms,
        uniqueQueryKeys: states.before.uniqueQueryKeys,
        fingerprint: states.before.fingerprint,
      },
      after: {
        total: states.after.total,
        languageCounts: states.after.languageCounts,
        uniqueForms: states.after.uniqueForms,
        uniqueQueryKeys: states.after.uniqueQueryKeys,
        fingerprint: states.after.fingerprint,
      },
    },
    authority: {
      sourceProcedure: { path: S3_SOURCE_PROCEDURE_PATH_V0_2, sha256: authority.actual.sourceProcedure },
      sourceSample: { path: S3_SOURCE_SAMPLE_PATH_V0_2, sha256: authority.actual.sourceSample },
      populationSpec: { path: S3_POPULATION_SPEC_PATH_V0_2, sha256: authority.actual.populationSpec },
      cmudict: { path: S3_CMUDICT_PATH_V0_2, sha256: authority.actual.cmudict },
      preS3: authority.actual,
    },
    execution: {
      authoritativeAttemptsBefore: 0,
      authoritativeAttemptsMax: ATTEMPT_MAX,
      noRerun: true,
      syntheticOnly: true,
      realDataExecuted: false,
      providerExecution: false,
    },
  } as const;
}

function validatePreflight(
  sample: ReturnType<typeof reconstructFrozenS3SampleV0_2>,
  states: ReturnType<typeof reconstructS3SubstrateStatesV0_2>,
  authority: ReturnType<typeof validateS3AuthorityIdentitiesV0_2>,
): void {
  assert(authority.actual.sourceProcedure === S3_EXPECTED_SOURCE_PROCEDURE_SHA256_V0_2, "S3_SOURCE_PROCEDURE_HASH");
  assert(authority.actual.sourceSample === S3_EXPECTED_SOURCE_SAMPLE_SHA256_V0_2, "S3_SOURCE_SAMPLE_HASH");
  assert(authority.actual.populationSpec === S3_EXPECTED_POPULATION_SPEC_SHA256_V0_2, "S3_POPULATION_SPEC_HASH");
  assert(authority.actual.cmudict === S3_EXPECTED_CMUDICT_SHA256_V0_2, "S3_CMUDICT_HASH");
  assert(readFileSync(join(ROOT, S3_CMUDICT_PATH_V0_2)).byteLength === 3618488, "S3_CMUDICT_BYTES");
  assert(sample.sampleSize === SAMPLE_SIZE, "S3_SAMPLE_SIZE");
  assert(sample.sourceSampleSha256 === S3_EXPECTED_SOURCE_SAMPLE_SHA256_V0_2, "S3_SAMPLE_IDENTITY");
  assert(states.before.fingerprint === S3_EXPECTED_BEFORE_FINGERPRINT_V0_2, "S3_BEFORE_FINGERPRINT");
  assert(states.after.fingerprint === S3_EXPECTED_AFTER_FINGERPRINT_V0_2, "S3_AFTER_FINGERPRINT");
  assert(states.before.total === 57 && states.before.languageCounts.Albanian === 55 && states.before.languageCounts.Latin === 2, "S3_BEFORE_COUNTS");
  assert(states.after.total === 76 && states.after.languageCounts.Albanian === 55 && states.after.languageCounts.Latin === 21, "S3_AFTER_COUNTS");
  assert(states.before.duplicateForms.length === 0 && states.before.queryKeyCollisions.length === 0, "S3_BEFORE_COLLISIONS");
  assert(states.after.duplicateForms.length === 0 && states.after.queryKeyCollisions.length === 0, "S3_AFTER_COLLISIONS");
}

function transitionMetrics(cases: readonly Awaited<ReturnType<typeof evaluateFrozenS3PairV0_2>>[number][]) {
  const transitions = new Map<string, number>();
  for (const entry of cases) {
    const key = `${entry.before.classification}_TO_${entry.after.classification}`;
    transitions.set(key, (transitions.get(key) ?? 0) + 1);
  }
  const count = (key: string): number => transitions.get(key) ?? 0;
  const beforePositive = cases.filter((entry) => entry.before.classification === "GENERIC_CROSS_FORM_POSITIVE");
  const afterPositive = cases.filter((entry) => entry.after.classification === "GENERIC_CROSS_FORM_POSITIVE");
  const beforeSelf = cases.filter((entry) => entry.before.classification === "EXACT_SELF_MATCH_ONLY");
  const afterSelf = cases.filter((entry) => entry.after.classification === "EXACT_SELF_MATCH_ONLY");
  const beforeNull = cases.filter((entry) => entry.before.validNull);
  const afterNull = cases.filter((entry) => entry.after.validNull);
  const beforeRate = beforePositive.length / cases.length;
  const afterRate = afterPositive.length / cases.length;
  return {
    transitions: Object.fromEntries([...transitions.entries()].sort(([left], [right]) => left.localeCompare(right))),
    nullToNull: count("SUBSTRATE_NO_MATCH_TO_SUBSTRATE_NO_MATCH"),
    nullToCrossFormPositive: count("SUBSTRATE_NO_MATCH_TO_GENERIC_CROSS_FORM_POSITIVE"),
    nullToSelfMatchOnly: count("SUBSTRATE_NO_MATCH_TO_EXACT_SELF_MATCH_ONLY"),
    selfMatchOnlyToSelfMatchOnly: count("EXACT_SELF_MATCH_ONLY_TO_EXACT_SELF_MATCH_ONLY"),
    selfMatchOnlyToCrossFormPositive: count("EXACT_SELF_MATCH_ONLY_TO_GENERIC_CROSS_FORM_POSITIVE"),
    crossFormPositiveToCrossFormPositive: count("GENERIC_CROSS_FORM_POSITIVE_TO_GENERIC_CROSS_FORM_POSITIVE"),
    crossFormPositiveToNull: count("GENERIC_CROSS_FORM_POSITIVE_TO_SUBSTRATE_NO_MATCH"),
    crossFormPositiveToSelfMatchOnly: count("GENERIC_CROSS_FORM_POSITIVE_TO_EXACT_SELF_MATCH_ONLY"),
    newCrossFormPositiveInputs: afterPositive.filter((entry) => entry.before.classification !== "GENERIC_CROSS_FORM_POSITIVE").length,
    lostCrossFormPositiveInputs: beforePositive.filter((entry) => entry.after.classification !== "GENERIC_CROSS_FORM_POSITIVE").length,
    unchangedCrossFormPositiveInputs: cases.filter((entry) => entry.before.classification === "GENERIC_CROSS_FORM_POSITIVE" && entry.after.classification === "GENERIC_CROSS_FORM_POSITIVE").length,
    newSelfMatchOnlyInputs: afterSelf.filter((entry) => entry.before.classification !== "EXACT_SELF_MATCH_ONLY").length,
    lostSelfMatchOnlyInputs: beforeSelf.filter((entry) => entry.after.classification !== "EXACT_SELF_MATCH_ONLY").length,
    resolvedValidNullInputs: beforeNull.filter((entry) => !entry.after.validNull).length,
    newValidNullInputs: afterNull.filter((entry) => !entry.before.validNull).length,
    netCrossFormPositiveDelta: afterPositive.length - beforePositive.length,
    netSelfMatchDelta: afterSelf.length - beforeSelf.length,
    netValidNullDelta: afterNull.length - beforeNull.length,
    beforeCrossFormRate: beforeRate,
    afterCrossFormRate: afterRate,
    absoluteRateDelta: afterRate - beforeRate,
    relativeRateDelta: beforeRate === 0 ? null : (afterRate - beforeRate) / beforeRate,
  } as const;
}

function s1Attribution(
  cases: readonly Awaited<ReturnType<typeof evaluateFrozenS3PairV0_2>>[number][],
  s1Ids: readonly string[],
) {
  const s1 = new Set(s1Ids);
  const changed = cases.filter((entry) => entry.changed);
  const changedExplained = changed.filter((entry) =>
    entry.changedS1CandidateSourceIds.length > 0 &&
    entry.changedCandidateSourceIds.every((id) => s1.has(id)),
  );
  const nonS1 = changed.filter((entry) => !(
    entry.changedS1CandidateSourceIds.length > 0 &&
    entry.changedCandidateSourceIds.every((id) => s1.has(id))
  ));
  const retrieved = new Set<string>();
  const inputReached = new Set<string>();
  let occurrences = 0;
  for (const entry of cases) {
    for (const candidate of entry.after.candidates) {
      if (!s1.has(candidate.sourceId)) continue;
      retrieved.add(candidate.sourceId);
      inputReached.add(entry.input);
      occurrences += 1;
    }
  }
  return {
    changedInputCount: changed.length,
    changedInputsExplainedByS1Rows: changedExplained.length,
    changedInputsWithNonS1Cause: nonS1.length,
    s1RowsRetrievedCount: retrieved.size,
    s1RowsNeverRetrievedCount: s1Ids.length - retrieved.size,
    s1RowsRetrieved: [...retrieved].sort(),
    s1RowsNeverRetrieved: s1Ids.filter((id) => !retrieved.has(id)).sort(),
    incrementalCandidateOccurrences: occurrences,
    uniqueInputsReachedByS1: inputReached.size,
  } as const;
}

function diversityDelta(
  cases: readonly Awaited<ReturnType<typeof evaluateFrozenS3PairV0_2>>[number][],
) {
  let increased = 0;
  let unchanged = 0;
  let decreased = 0;
  for (const entry of cases) {
    const before = new Set(entry.before.candidates.map((candidate) => candidate.sourceId)).size;
    const after = new Set(entry.after.candidates.map((candidate) => candidate.sourceId)).size;
    if (after > before) increased += 1;
    else if (after === before) unchanged += 1;
    else decreased += 1;
  }
  return { increased, unchanged, decreased } as const;
}

function authorityValidation(
  cases: readonly Awaited<ReturnType<typeof evaluateFrozenS3PairV0_2>>[number][],
  states: ReturnType<typeof reconstructS3SubstrateStatesV0_2>,
) {
  let provenanceLoss = 0;
  let missingCitation = 0;
  let unauthorizedPronunciation = 0;
  let unauthorizedFunctional = 0;
  let unauthorizedHistorical = 0;
  let unauthorizedProduction = 0;
  let noSingleWinner = true;
  let userDecides = true;
  const inspect = (entry: MultilingualDiscoverySubstrateS3CaseV0_2, map: ReadonlyMap<string, { citationIds: readonly string[] }>) => {
    for (const candidate of entry.candidates) {
      const source = map.get(candidate.sourceId);
      if (!source) provenanceLoss += 1;
      if (!source || source.citationIds.length === 0 || candidate.evidenceRefs.length === 0 ||
          candidate.evidenceRefs.some((citationId) => !source.citationIds.includes(citationId))) {
        missingCitation += 1;
      }
      if (candidate.canonicalLanguage === "Latin" && candidate.candidateVoicePath.length > 0) unauthorizedPronunciation += 1;
      if (candidate.functionalEvidenceKind !== "none" && candidate.sourceStatus !== "reviewed_accepted") unauthorizedFunctional += 1;
      if (candidate.historicalRelation !== "not_claimed") unauthorizedHistorical += 1;
      if (candidate.sourceStatus.includes("production")) unauthorizedProduction += 1;
      noSingleWinner = noSingleWinner && candidate.noSingleWinner;
      userDecides = userDecides && candidate.userDecisionPosture === "user_decides";
    }
  };
  for (const entry of cases) {
    inspect(entry.before, states.beforeSourceMap);
    inspect(entry.after, states.afterSourceMap);
  }
  return {
    candidatesWithProvenanceLoss: provenanceLoss,
    candidatesWithMissingCitation: missingCitation,
    unauthorizedPronunciationPositives: unauthorizedPronunciation,
    unauthorizedFunctionalPositives: unauthorizedFunctional,
    unauthorizedHistoricalClaims: unauthorizedHistorical,
    unauthorizedProductionPromotions: unauthorizedProduction,
    noSingleWinner,
    userDecides,
  } as const;
}

function caseSideFingerprint(cases: readonly Awaited<ReturnType<typeof evaluateFrozenS3PairV0_2>>[number][], side: "before" | "after") {
  return sha256CanonicalJson(cases.map((entry) => ({ input: entry.input, upstream: entry.upstream, result: entry[side] })));
}

function outcomeFor(
  before: ReturnType<typeof aggregateS3CasesV0_2>,
  after: ReturnType<typeof aggregateS3CasesV0_2>,
  authority: ReturnType<typeof authorityValidation>,
) {
  const integrity = authority.candidatesWithProvenanceLoss === 0 &&
    authority.candidatesWithMissingCitation === 0 &&
    authority.unauthorizedPronunciationPositives === 0 &&
    authority.unauthorizedFunctionalPositives === 0 &&
    authority.unauthorizedHistoricalClaims === 0 &&
    authority.unauthorizedProductionPromotions === 0 &&
    authority.noSingleWinner && authority.userDecides;
  if (!integrity) return "EVALUATION_INVALID" as const;
  if (after.crossFormPositiveInputs > before.crossFormPositiveInputs) return "MEASURABLE_GENERIC_COVERAGE_IMPROVEMENT" as const;
  if (after.distinctCandidateSourceRecords > before.distinctCandidateSourceRecords ||
      after.totalCandidateRecordsRetrieved > before.totalCandidateRecordsRetrieved ||
      after.diversity.multipleCandidates > before.diversity.multipleCandidates) {
    return "MEASURABLE_REACHABLE_CANDIDATE_UNIVERSE_IMPROVEMENT_ONLY" as const;
  }
  return "NO_MEASURABLE_EXISTING_ONLY_IMPROVEMENT" as const;
}

function buildSummary(
  cases: readonly Awaited<ReturnType<typeof evaluateFrozenS3PairV0_2>>[number][],
  states: ReturnType<typeof reconstructS3SubstrateStatesV0_2>,
) {
  const before = aggregateS3CasesV0_2(cases, "before");
  const after = aggregateS3CasesV0_2(cases, "after");
  const transitions = transitionMetrics(cases);
  const attribution = s1Attribution(cases, states.after.latinRecords.filter((record) => record.sourceRecordId !== "").map((record) => record.sourceRecordId));
  const authority = authorityValidation(cases, states);
  const outcome = outcomeFor(before, after, authority);
  return {
    schemaVersion: MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_SCHEMA_VERSION_V0_2,
    experimentId: EXPERIMENT_ID,
    before,
    after,
    transitions,
    attribution,
    languageContribution: { before: before.languageContribution, after: after.languageContribution },
    sourceTraditionContribution: { before: before.sourceTraditionContribution, after: after.sourceTraditionContribution },
    diversityDelta: diversityDelta(cases),
    authorityProvenanceValidation: authority,
    historicalM7Reference: {
      referenceOnly: true,
      substrate: "55_ALBANIAN",
      sampleSize: 512,
      crossFormPositives: 4,
      selfMatchOnly: 0,
      noMatch: 508,
      positiveRatePercent: 0.78125,
      usedAsControlledS3Before: false,
    },
    outcomeClassification: outcome,
    outcomeRationale: outcome === "MEASURABLE_GENERIC_COVERAGE_IMPROVEMENT"
      ? "Cross-form generic Discovery inputs increased under the frozen paired procedure with no authority-boundary defect."
      : outcome === "MEASURABLE_REACHABLE_CANDIDATE_UNIVERSE_IMPROVEMENT_ONLY"
        ? "The reachable source-attested candidate universe increased without an increase in cross-form input coverage."
        : outcome === "NO_MEASURABLE_EXISTING_ONLY_IMPROVEMENT"
          ? "The frozen existing-only expansion produced no measurable paired coverage or candidate-universe increase."
          : "At least one frozen authority or provenance condition failed during evaluation.",
  } as const;
}

function assertStoredResultIntegrity(rootDir = ROOT): void {
  const artifactDirectory = join(rootDir, ARTIFACT_RELATIVE_DIRECTORY);
  const pairedResultsPath = join(artifactDirectory, "paired-results.json");
  const summaryPath = join(artifactDirectory, "summary.json");
  const samplePath = join(artifactDirectory, "sample.json");
  const executionPath = join(artifactDirectory, "execution.json");
  const manifestPath = join(artifactDirectory, "hash-manifest.json");
  assert(existsSync(pairedResultsPath) && existsSync(summaryPath) && existsSync(manifestPath), "S3_RESULT_ARTIFACTS_MISSING");
  const paired = readJson<{ cases: Awaited<ReturnType<typeof evaluateFrozenS3PairV0_2>> }>(pairedResultsPath);
  const summary = readJson<ReturnType<typeof buildSummary> & {
    reproducibility: {
      sampleHashRun1: string;
      sampleHashRun2: string;
      beforeResultHashRun1: string;
      beforeResultHashRun2: string;
      afterResultHashRun1: string;
      afterResultHashRun2: string;
    };
  }>(summaryPath);
  const manifest = readJson<{
    artifacts: readonly { path: string; bytes: number; sha256: string }[];
    schedule: { sampleSha256: string };
    resultFingerprints: {
      beforeRun1: string;
      beforeRun2: string;
      afterRun1: string;
      afterRun2: string;
      summaryRun1: string;
      summaryRun2: string;
    };
  }>(manifestPath);
  assert(paired.cases.length === SAMPLE_SIZE, "S3_RESULT_CASE_COUNT");
  assert(paired.cases.every((entry) => entry.before.upstream.fingerprint === entry.after.upstream.fingerprint), "S3_UPSTREAM_RESULT_MISMATCH");
  for (const artifact of manifest.artifacts) {
    const artifactPath = join(rootDir, artifact.path);
    const bytes = readFileSync(artifactPath);
    assert(bytes.byteLength === artifact.bytes, `S3_ARTIFACT_BYTES:${artifact.path}`);
    assert(sha256BytesV0_2(bytes) === artifact.sha256, `S3_ARTIFACT_HASH:${artifact.path}`);
  }
  const actualSampleHash = sha256BytesV0_2(readFileSync(samplePath));
  const actualPairedResultsHash = sha256BytesV0_2(readFileSync(pairedResultsPath));
  const actualSummaryHash = sha256BytesV0_2(readFileSync(summaryPath));
  const execution = readJson<{
    sampleArtifactSha256: string;
    pairedResultsArtifactSha256: string;
    summaryArtifactSha256: string;
  }>(executionPath);
  assert(actualSampleHash === manifest.schedule.sampleSha256, "S3_SAMPLE_MANIFEST_HASH");
  assert(actualSampleHash === summary.reproducibility.sampleHashRun1 && actualSampleHash === summary.reproducibility.sampleHashRun2, "S3_SAMPLE_REPRODUCIBILITY_HASH");
  assert(actualSampleHash === execution.sampleArtifactSha256, "S3_EXECUTION_SAMPLE_HASH");
  assert(actualPairedResultsHash === execution.pairedResultsArtifactSha256, "S3_EXECUTION_PAIRED_RESULTS_HASH");
  assert(actualSummaryHash === execution.summaryArtifactSha256, "S3_EXECUTION_SUMMARY_HASH");
  const storedBeforeHash = caseSideFingerprint(paired.cases, "before");
  const storedAfterHash = caseSideFingerprint(paired.cases, "after");
  assert(storedBeforeHash === manifest.resultFingerprints.beforeRun1 && storedBeforeHash === manifest.resultFingerprints.beforeRun2, "S3_BEFORE_RESULT_BINDING_HASH");
  assert(storedAfterHash === manifest.resultFingerprints.afterRun1 && storedAfterHash === manifest.resultFingerprints.afterRun2, "S3_AFTER_RESULT_BINDING_HASH");
  assert(storedBeforeHash === summary.reproducibility.beforeResultHashRun1 && storedBeforeHash === summary.reproducibility.beforeResultHashRun2, "S3_BEFORE_RESULT_REPRODUCIBILITY_HASH");
  assert(storedAfterHash === summary.reproducibility.afterResultHashRun1 && storedAfterHash === summary.reproducibility.afterResultHashRun2, "S3_AFTER_RESULT_REPRODUCIBILITY_HASH");
  assert(actualSummaryHash === manifest.resultFingerprints.summaryRun1 && actualSummaryHash === manifest.resultFingerprints.summaryRun2, "S3_SUMMARY_BINDING_HASH");
  const states = reconstructS3SubstrateStatesV0_2(rootDir);
  const { reproducibility: _reproducibility, ...storedSummaryCore } = summary;
  const recomputedSummary = buildSummary(paired.cases, states);
  assert(canonicalJson(storedSummaryCore) === canonicalJson(recomputedSummary), "S3_SUMMARY_CONTENT_MISMATCH");
}

async function executeOnce(): Promise<void> {
  const existing = [EXECUTION_PATH, SAMPLE_PATH, PAIRED_RESULTS_PATH, SUMMARY_PATH, MANIFEST_PATH].filter(existsSync);
  assert(existing.length === 0, "S3_AUTHORITATIVE_RESULT_ALREADY_EXISTS_NO_RERUN");
  const authority = validateS3AuthorityIdentitiesV0_2(ROOT);
  const sample = reconstructFrozenS3SampleV0_2(ROOT);
  const states = reconstructS3SubstrateStatesV0_2(ROOT);
  validatePreflight(sample, states, authority);
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  const identity = frozenExecutionIdentity(sample, states, authority);
  writeCanonicalJson(SAMPLE_PATH, {
    schemaVersion: `${MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_SCHEMA_VERSION_V0_2}.sample`,
    status: "FROZEN_BEFORE_SUBSTRATE_EVALUATION",
    experimentId: EXPERIMENT_ID,
    procedureId: MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_PROCEDURE_ID_V0_2,
    sourceSamplePath: S3_SOURCE_SAMPLE_PATH_V0_2,
    sourceSampleSha256: sample.sourceSampleSha256,
    sampleSize: sample.sampleSize,
    sampleSelectionId: SAMPLE_SELECTION_ID,
    firstInput: sample.firstInput,
    lastInput: sample.lastInput,
    orderingRule: "NFC, trim, lower-case existing CMUdict normalization; Unicode code-point ascending; deduplicate normalized lexical word",
    substrateResponseUsedDuringSelection: false,
    entries: sample.entries,
  });
  const startedUtc = new Date().toISOString();
  writeCanonicalJson(EXECUTION_PATH, {
    ...identity,
    status: "RUNNING",
    startedUtc,
    sampleArtifact: sourceRelative(SAMPLE_PATH),
    sampleArtifactSha256: sha256FileV0_2(ROOT, sourceRelative(SAMPLE_PATH)),
    substrates: { beforeRecords: states.before.records, afterRecords: states.after.records },
  });
  const cases = await evaluateFrozenS3PairV0_2(sample.entries, states);
  const paired = {
    schemaVersion: `${MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_SCHEMA_VERSION_V0_2}.paired-results`,
    status: "COMPLETED_RESULT_PRESERVED",
    experimentId: EXPERIMENT_ID,
    sampleArtifact: sourceRelative(SAMPLE_PATH),
    sampleArtifactSha256: sha256FileV0_2(ROOT, sourceRelative(SAMPLE_PATH)),
    pairedSampleIdentical: true,
    upstreamAnalysisIdentical: cases.every((entry) => entry.upstream.fingerprint === entry.before.upstream.fingerprint && entry.before.upstream.fingerprint === entry.after.upstream.fingerprint),
    classificationRulesIdentical: true,
    onlyExperimentalVariable: "DIRECT_DISCOVERY_SUBSTRATE_CONTENT",
    evaluation: { attempt: 1, attemptsMax: 1, noRerun: true, adaptiveReplication: false, replacementReplicates: false, syntheticOnly: true, realDataExecuted: false },
    cases,
  } as const;
  writeCanonicalJson(PAIRED_RESULTS_PATH, paired);
  const beforeResultHashRun1 = caseSideFingerprint(cases, "before");
  const beforeResultHashRun2 = caseSideFingerprint(cases, "before");
  const afterResultHashRun1 = caseSideFingerprint(cases, "after");
  const afterResultHashRun2 = caseSideFingerprint(cases, "after");
  const summary = {
    ...buildSummary(cases, states),
    reproducibility: {
      sampleHashRun1: sha256FileV0_2(ROOT, sourceRelative(SAMPLE_PATH)),
      sampleHashRun2: sha256FileV0_2(ROOT, sourceRelative(SAMPLE_PATH)),
      beforeResultHashRun1,
      beforeResultHashRun2,
      afterResultHashRun1,
      afterResultHashRun2,
    },
  } as const;
  writeCanonicalJson(SUMMARY_PATH, summary);
  writeCanonicalJson(EXECUTION_PATH, {
    ...identity,
    status: "COMPLETED",
    startedUtc,
    completedUtc: new Date().toISOString(),
    sampleArtifact: sourceRelative(SAMPLE_PATH),
    sampleArtifactSha256: sha256FileV0_2(ROOT, sourceRelative(SAMPLE_PATH)),
    pairedResultsArtifact: sourceRelative(PAIRED_RESULTS_PATH),
    pairedResultsArtifactSha256: sha256FileV0_2(ROOT, sourceRelative(PAIRED_RESULTS_PATH)),
    summaryArtifact: sourceRelative(SUMMARY_PATH),
    summaryArtifactSha256: sha256FileV0_2(ROOT, sourceRelative(SUMMARY_PATH)),
    substrates: { beforeRecords: states.before.records, afterRecords: states.after.records },
    result: {
      outcomeClassification: summary.outcomeClassification,
      authoritativeAttempts: 1,
      beforeResultHash: beforeResultHashRun1,
      afterResultHash: afterResultHashRun1,
    },
  });
  const artifactPaths = [EXECUTION_PATH, SAMPLE_PATH, PAIRED_RESULTS_PATH, SUMMARY_PATH].map((path) => ({
    path: sourceRelative(path),
    bytes: readFileSync(path).byteLength,
    sha256: sha256BytesV0_2(readFileSync(path)),
  }));
  const manifest = {
    schemaVersion: `${MULTILINGUAL_DISCOVERY_SUBSTRATE_S3_SCHEMA_VERSION_V0_2}.hash-manifest`,
    status: "FROZEN_RESULT_BINDINGS",
    experimentId: EXPERIMENT_ID,
    repositoryHead: REPOSITORY_HEAD,
    artifacts: artifactPaths,
    authorityBindings: identity.authority,
    substrateBindings: identity.substrate,
    execution: { attempts: 1, attemptsMax: 1, noRerun: true, syntheticOnly: true, realDataExecuted: false, providerExecution: false },
    schedule: { sampleSize: SAMPLE_SIZE, sampleSelectionId: SAMPLE_SELECTION_ID, sampleSha256: sha256FileV0_2(ROOT, sourceRelative(SAMPLE_PATH)) },
    outcomeClassification: summary.outcomeClassification,
    resultFingerprints: {
      beforeRun1: beforeResultHashRun1,
      beforeRun2: beforeResultHashRun2,
      afterRun1: afterResultHashRun1,
      afterRun2: afterResultHashRun2,
      summaryRun1: sha256FileV0_2(ROOT, sourceRelative(SUMMARY_PATH)),
      summaryRun2: sha256FileV0_2(ROOT, sourceRelative(SUMMARY_PATH)),
    },
  } as const;
  writeCanonicalJson(MANIFEST_PATH, manifest);
  assertStoredResultIntegrity();
  console.log(JSON.stringify({
    outcome: summary.outcomeClassification,
    sample: { size: sample.sampleSize, first: sample.firstInput, last: sample.lastInput, sha256: sample.sourceSampleSha256 },
    before: { ...summary.before, resultSha256: sha256FileV0_2(ROOT, sourceRelative(PAIRED_RESULTS_PATH)) },
    after: { ...summary.after, resultSha256: sha256FileV0_2(ROOT, sourceRelative(PAIRED_RESULTS_PATH)) },
    transitions: summary.transitions,
    attribution: summary.attribution,
    artifacts: {
      execution: { path: sourceRelative(EXECUTION_PATH), sha256: sha256FileV0_2(ROOT, sourceRelative(EXECUTION_PATH)) },
      sample: { path: sourceRelative(SAMPLE_PATH), sha256: sha256FileV0_2(ROOT, sourceRelative(SAMPLE_PATH)) },
      pairedResults: { path: sourceRelative(PAIRED_RESULTS_PATH), sha256: sha256FileV0_2(ROOT, sourceRelative(PAIRED_RESULTS_PATH)) },
      summary: { path: sourceRelative(SUMMARY_PATH), sha256: sha256FileV0_2(ROOT, sourceRelative(SUMMARY_PATH)) },
      manifest: { path: sourceRelative(MANIFEST_PATH), sha256: sha256FileV0_2(ROOT, sourceRelative(MANIFEST_PATH)) },
    },
  }, null, 2));
}

async function main(): Promise<void> {
  const mode = process.argv[2] ?? "--preflight";
  if (mode === "--preflight") {
    const authority = validateS3AuthorityIdentitiesV0_2(ROOT);
    const sample = reconstructFrozenS3SampleV0_2(ROOT);
    const states = reconstructS3SubstrateStatesV0_2(ROOT);
    validatePreflight(sample, states, authority);
    console.log(JSON.stringify({ status: "PREFLIGHT_PASS", sampleSize: sample.sampleSize, firstInput: sample.firstInput, lastInput: sample.lastInput, before: states.before.fingerprint, after: states.after.fingerprint }, null, 2));
    return;
  }
  if (mode === "--verify") {
    assertStoredResultIntegrity();
    console.log(JSON.stringify({ status: "STORED_RESULT_INTEGRITY_PASS", pairedResultsSha256: sha256FileV0_2(ROOT, sourceRelative(PAIRED_RESULTS_PATH)), summarySha256: sha256FileV0_2(ROOT, sourceRelative(SUMMARY_PATH)) }, null, 2));
    return;
  }
  if (mode !== "--execute") throw new Error(`S3_UNKNOWN_MODE:${mode}`);
  await executeOnce();
}

void main();
