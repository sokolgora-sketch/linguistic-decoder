import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { buildMinRootHypotheses } from "@/shared/deepRoot.minRoots.v1";
import { extractSevenVowelsFromString } from "@/shared/math7.core";
import {
  buildMotivationEngineDiscoveryV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import {
  discoverStructuralHypothesesV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";

const ROOT = process.cwd();
const ARTIFACT_DIRECTORY = join(
  ROOT,
  "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1",
);
const PROCEDURE_PATH = join(ARTIFACT_DIRECTORY, "procedure.json");
const ELIGIBILITY_PATH = join(ARTIFACT_DIRECTORY, "eligibility.json");
const PRIMARY_PATH = join(ARTIFACT_DIRECTORY, "primary-selection.json");
const SAMPLE_PATH = join(ARTIFACT_DIRECTORY, "reachable-sample.json");
const RESULT_PATH = join(ARTIFACT_DIRECTORY, "result.json");
const MANIFEST_PATH = join(ARTIFACT_DIRECTORY, "hash-manifest.json");
const PHASE_B_ATTEMPT_PATH = join(ARTIFACT_DIRECTORY, "phase-b-attempt.json");
const POPULATION_SPEC_PATH = join(
  ROOT,
  "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json",
);
const SOURCE_PATH = join(ROOT, "src/data/openInstrument/pronunciation/cmudict.dict");
const ORIGINAL_SELECTION_PATH = join(
  ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/selection-procedure.json",
);
const ORIGINAL_PRIMARY_PATH = join(
  ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/primary-selection.json",
);
const ORIGINAL_PRIMARY_RESULT_PATH = join(
  ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/primary-result.json",
);
const ORIGINAL_RESULT_PATH = join(
  ROOT,
  "docs/open-instrument/research-artifacts/m7-novel-input-generalization-v0.1/result.json",
);
const RETRIEVAL_PATH = join(ROOT, "src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts");
const STRUCTURAL_PATH = join(ROOT, "src/shared/structuralHypothesisDiscovery.v0_1.ts");
const GENERIC_QUERY_PATH = join(ROOT, "src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1.ts");

const PROCEDURE_ID = "open-instrument-m7-substrate-reachable-generalization-v0.1";
const CURRENT_MAIN_HEAD = "969e31927b0e9047e7354f2439d23f417e10e908";
const SOURCE_SHA256 = "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22";
const POPULATION_SPEC_SHA256 = "81248026f57cffb0c357a4e29e0cce4d3139adc1521eda89e72754783095ed44";
const RETRIEVAL_SHA256 = "e0ae5d74daf894db64380a2e04b0043e83bb756f2dba3109f5b01e6b1d5b67b0";
const STRUCTURAL_SHA256 = "96fba8363df8b3d59caf6d7dc9ac9ad88007d15432bec4b647b83484a25555db";
const GENERIC_QUERY_SHA256 = "d8ecde88cb241010ffd3464852ff814bf745a4dfcd0ce3743966b8af078ed0a3";
const SUBSTRATE_VERSION = "albanian-generic-lexical-substrate.v0_1";
const SUBSTRATE_RECORD_COUNT = 55;
const SUBSTRATE_FINGERPRINT = "3db9f039c12b0b3d51a9d64361909403baf4224c92c3ff237f7e9d49aabedcbb";
const SAMPLE_SIZE = 512;

const ORIGINAL_HASHES = {
  selection: "de0363366f854230b178011c36a52818add15664f57a7241105bdbc6fb9b8eb7",
  primary: "c402b51ab936e29967dc5f53b2b43da541e1399513a5eb70890677ea52b53d23",
  primaryResult: "cacbb9dbc9b12a785063b4506f5ad05a52a0e402b7cb99a35e51ea5819f8b841",
  result: "ea109f02539b80baf03b5d7491385aac3a4067045513e630911d4f2f0c7e98d6",
} as const;

type PopulationEntry = Readonly<{
  lexicalWord: string;
  eligibility: "ELIGIBLE" | "NULL_OR_INELIGIBLE";
}>;

type JsonRecord = Record<string, unknown>;

type ReachabilityClassification =
  | "UPSTREAM_PRONUNCIATION_NULL"
  | "UPSTREAM_STRUCTURAL_NULL"
  | "SUBSTRATE_REACHABLE";

type ReachableInput = Readonly<{
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
  structuralHypotheses: readonly JsonRecord[];
  genericQueryKeys: readonly string[];
}>;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function writeJson(path: string, value: unknown): void {
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

function sha256Json(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value), "utf8").digest("hex");
}

function normalizeWord(value: string): string {
  return value.normalize("NFC").trim().toLocaleLowerCase("en-US");
}

function compareText(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${String(expected)}, received ${String(actual)}`);
  }
}

function assertFileHash(path: string, expected: string, label: string): void {
  assertEqual(sha256File(path), expected, label);
}

function validateFrozenProcedure(): JsonRecord {
  const procedure = readJson<JsonRecord>(PROCEDURE_PATH);
  assertEqual(procedure.status, "FROZEN_BEFORE_EXECUTION", "successor procedure status");
  assertEqual(procedure.procedureId, PROCEDURE_ID, "successor procedure id");
  const population = procedure.inputPopulation as JsonRecord;
  assertEqual(population.sourceSha256, SOURCE_SHA256, "CMUdict source binding");
  assertEqual(population.populationSpecSha256, POPULATION_SPEC_SHA256, "population spec binding");
  assertFileHash(SOURCE_PATH, SOURCE_SHA256, "CMUdict source hash");
  assertEqual(readFileSync(SOURCE_PATH).byteLength, 3618488, "CMUdict source bytes");
  assertFileHash(POPULATION_SPEC_PATH, POPULATION_SPEC_SHA256, "population spec hash");
  assertFileHash(RETRIEVAL_PATH, RETRIEVAL_SHA256, "retrieval identity");
  assertFileHash(STRUCTURAL_PATH, STRUCTURAL_SHA256, "structural identity");
  assertFileHash(GENERIC_QUERY_PATH, GENERIC_QUERY_SHA256, "generic query identity");

  const substrate = getAlbanianLexicalSubstrateRecordsV0_1();
  assertEqual(substrate.length, SUBSTRATE_RECORD_COUNT, "substrate record count");
  assertEqual(sha256Json(substrate), SUBSTRATE_FINGERPRINT, "substrate fingerprint");

  assertFileHash(ORIGINAL_SELECTION_PATH, ORIGINAL_HASHES.selection, "original selection preservation");
  assertFileHash(ORIGINAL_PRIMARY_PATH, ORIGINAL_HASHES.primary, "original primary selection preservation");
  assertFileHash(ORIGINAL_PRIMARY_RESULT_PATH, ORIGINAL_HASHES.primaryResult, "original primary result preservation");
  assertFileHash(ORIGINAL_RESULT_PATH, ORIGINAL_HASHES.result, "original coverage result preservation");
  return procedure;
}

function readPopulation(): readonly PopulationEntry[] {
  const population = readJson<{ population: { entries: readonly PopulationEntry[] } }>(POPULATION_SPEC_PATH);
  return population.population.entries;
}

function preparedPopulation(): Readonly<{
  raw: readonly string[];
  prepared: readonly string[];
  rawPositionByWord: ReadonlyMap<string, number>;
}> {
  const originalProcedure = readJson<JsonRecord>(ORIGINAL_SELECTION_PATH);
  const exclusion = originalProcedure.preparedWordExclusion as JsonRecord;
  const explicitWords = new Set(
    (exclusion.excludedWords as readonly string[]).map(normalizeWord),
  );
  const substrateWords = new Set(
    getAlbanianLexicalSubstrateRecordsV0_1()
      .map((record) => normalizeWord(record.sourceForm))
      .filter((word) => /^[a-z]+$/u.test(word)),
  );
  const raw = [...new Set(
    readPopulation()
      .filter((entry) => entry.eligibility === "ELIGIBLE")
      .map((entry) => normalizeWord(entry.lexicalWord))
      .filter((word) => /^[a-z]+$/u.test(word)),
  )].sort(compareText);
  const excluded = new Set([...explicitWords, ...substrateWords]);
  const prepared = raw.filter((word) => !excluded.has(word));
  return {
    raw,
    prepared,
    rawPositionByWord: new Map(raw.map((word, index) => [word, index + 1])),
  };
}

function stableUniqueRoots(word: string) {
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

function genericQueryKeysForWord(word: string): readonly string[] {
  const structuralHypotheses = discoverStructuralHypothesesV0_1(word);
  const contexts: Array<{ queryForm: string; contextId: string }> = [];
  const seen = new Set<string>();

  for (const root of stableUniqueRoots(word)) {
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

  return Object.freeze(
    [...new Set(
      contexts
        .sort((left, right) => compareText(`${left.queryForm}:${left.contextId}`, `${right.queryForm}:${right.contextId}`))
        .map((context) => context.queryForm),
    )],
  );
}

function compactStructuralHypotheses(word: string): readonly JsonRecord[] {
  return discoverStructuralHypothesesV0_1(word).map((hypothesis) => ({
    hypothesisId: hypothesis.hypothesisId,
    embryo: hypothesis.embryo,
    expansionChain: [...hypothesis.expansionChain],
    reasonCodes: [...hypothesis.reasonCodes],
  }));
}

function gammaForHeart(heart: ReturnType<typeof buildHeartInstrumentV1>): readonly string[] {
  if (heart.spokenPronunciation.status !== "defined") return [];
  return heart.spokenPronunciation.variants.flatMap((variant) =>
    variant.normalizedSegments
      .filter((segment) => segment.kind === "consonant")
      .flatMap((segment) => [...segment.sourceUnits]),
  );
}

function zcVariantCountForHeart(heart: ReturnType<typeof buildHeartInstrumentV1>): number {
  return heart.spokenPronunciation.status === "defined"
    ? heart.spokenPronunciation.variants.length
    : 0;
}

export function classifyReachabilityForWordV0_1(word: string): Readonly<{
  classification: ReachabilityClassification;
  profile: string;
  pronunciationStatus: string;
  pronunciationReason: string | null;
  voicePath: readonly string[] | null;
  gamma: readonly string[];
  zcVariantCount: number;
  structuralHypotheses: readonly JsonRecord[];
  genericQueryKeys: readonly string[];
}> {
  const heart = buildHeartInstrumentV1(word);
  const pronunciationUsable =
    heart.spokenPronunciation.status === "defined" &&
    Array.isArray(heart.canonicalSpokenVoicePath) &&
    heart.canonicalSpokenVoicePath.length > 0;
  if (!pronunciationUsable) {
    return {
      classification: "UPSTREAM_PRONUNCIATION_NULL",
      profile: heart.spokenPronunciation.sourceProfileId,
      pronunciationStatus: heart.spokenPronunciation.status,
      pronunciationReason: heart.spokenPronunciation.reasonCode,
      voicePath: heart.canonicalSpokenVoicePath,
      gamma: [],
      zcVariantCount: 0,
      structuralHypotheses: [],
      genericQueryKeys: [],
    };
  }

  const structuralHypotheses = compactStructuralHypotheses(word);
  const genericQueryKeys = genericQueryKeysForWord(word);
  if (genericQueryKeys.length === 0) {
    return {
      classification: "UPSTREAM_STRUCTURAL_NULL",
      profile: heart.spokenPronunciation.sourceProfileId,
      pronunciationStatus: heart.spokenPronunciation.status,
      pronunciationReason: heart.spokenPronunciation.reasonCode,
      voicePath: heart.canonicalSpokenVoicePath,
      gamma: gammaForHeart(heart),
      zcVariantCount: zcVariantCountForHeart(heart),
      structuralHypotheses,
      genericQueryKeys,
    };
  }

  return {
    classification: "SUBSTRATE_REACHABLE",
    profile: heart.spokenPronunciation.sourceProfileId,
    pronunciationStatus: heart.spokenPronunciation.status,
    pronunciationReason: heart.spokenPronunciation.reasonCode,
    voicePath: heart.canonicalSpokenVoicePath,
    gamma: gammaForHeart(heart),
    zcVariantCount: zcVariantCountForHeart(heart),
    structuralHypotheses,
    genericQueryKeys,
  };
}

export function buildEligibilitySnapshotV0_1(sampleSize = SAMPLE_SIZE) {
  const existingPhaseAArtifacts = [ELIGIBILITY_PATH, SAMPLE_PATH, PRIMARY_PATH].filter(readFileExists);
  if (existingPhaseAArtifacts.length > 0) {
    throw new Error("M7_PHASE_A_ARTIFACTS_ALREADY_EXISTS_NO_RERUN");
  }
  const procedure = validateFrozenProcedure();
  const population = preparedPopulation();
  const cases: JsonRecord[] = [];
  const reachable: ReachableInput[] = [];
  const counts = {
    UPSTREAM_PRONUNCIATION_NULL: 0,
    UPSTREAM_STRUCTURAL_NULL: 0,
    SUBSTRATE_REACHABLE: 0,
  } satisfies Record<ReachabilityClassification, number>;

  for (let index = 0; index < population.prepared.length && reachable.length < sampleSize; index += 1) {
    const input = population.prepared[index]!;
    const classification = classifyReachabilityForWordV0_1(input);
    counts[classification.classification] += 1;
    const base = {
      input,
      rawPopulationPosition: population.rawPositionByWord.get(input),
      preparedPopulationPosition: index + 1,
      classification: classification.classification,
      pronunciationStatus: classification.pronunciationStatus,
      pronunciationReason: classification.pronunciationReason,
      genericQueryKeyCount: classification.genericQueryKeys.length,
    };
    if (classification.classification === "SUBSTRATE_REACHABLE") {
      const reachableInput: ReachableInput = {
        input,
        rawPopulationPosition: population.rawPositionByWord.get(input)!,
        preparedPopulationPosition: index + 1,
        reachablePopulationPosition: reachable.length + 1,
        pronunciationStatus: classification.pronunciationStatus,
        pronunciationReason: classification.pronunciationReason,
        profile: classification.profile,
        voicePath: classification.voicePath,
        gamma: classification.gamma,
        zcVariantCount: classification.zcVariantCount,
        structuralHypotheses: classification.structuralHypotheses,
        genericQueryKeys: classification.genericQueryKeys,
      };
      reachable.push(reachableInput);
      cases.push({
        ...base,
        rawPopulationPosition: reachableInput.rawPopulationPosition,
        preparedPopulationPosition: reachableInput.preparedPopulationPosition,
        reachablePopulationPosition: reachableInput.reachablePopulationPosition,
        genericQueryKeys: [...reachableInput.genericQueryKeys],
      });
    } else {
      cases.push(base);
    }
  }

  if (reachable.length < sampleSize) {
    throw new Error(`M7_SUBSTRATE_REACHABLE_SAMPLE_INSUFFICIENT:${reachable.length}`);
  }

  const procedureSha256 = sha256File(PROCEDURE_PATH);
  const eligibility = {
    schemaVersion: "open-instrument.m7-substrate-reachable-generalization-eligibility.v0.1",
    status: "PHASE_A_COMPLETE_BEFORE_SUBSTRATE_LOOKUP",
    procedureId: PROCEDURE_ID,
    procedureSha256,
    phase: "A_PRONUNCIATION_STRUCTURE_QUERY_GENERATION_ONLY",
    substrateResponseInspected: false,
    candidateCountInspected: false,
    candidateFormInspected: false,
    rawEligiblePopulationCount: population.raw.length,
    preparedPopulationCount: population.prepared.length,
    rawInputsInspected: cases.length,
    counts,
    allReachableHaveQueryKeys: reachable.every((entry) => entry.genericQueryKeys.length > 0),
    reachableSampleSize: reachable.length,
    cases,
  };
  writeJson(ELIGIBILITY_PATH, eligibility);
  const eligibilitySha256 = sha256File(ELIGIBILITY_PATH);

  const sample = {
    schemaVersion: "open-instrument.m7-substrate-reachable-generalization-reachable-sample.v0.1",
    status: "FROZEN_BEFORE_SUBSTRATE_EVALUATION",
    procedureId: PROCEDURE_ID,
    procedureSha256,
    eligibilityPath: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/eligibility.json",
    eligibilitySha256,
    sampleSize: sampleSize,
    stoppingRule: "none_after_sample_freeze",
    substrateEvaluationNotStarted: true,
    entries: reachable,
  };
  writeJson(SAMPLE_PATH, sample);
  const sampleSha256 = sha256File(SAMPLE_PATH);

  const primary = {
    schemaVersion: "open-instrument.m7-substrate-reachable-generalization-primary-selection.v0.1",
    status: "FROZEN_BEFORE_SUBSTRATE_LOOKUP",
    procedureId: PROCEDURE_ID,
    procedureSha256,
    eligibilityPath: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/eligibility.json",
    eligibilitySha256,
    samplePath: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/reachable-sample.json",
    sampleSha256,
    primary: reachable[0],
    selectedBeforeSubstrateLookup: true,
  };
  writeJson(PRIMARY_PATH, primary);

  return {
    procedure,
    eligibility,
    sample,
    primary,
    eligibilitySha256,
    sampleSha256,
    primarySha256: sha256File(PRIMARY_PATH),
  };
}

function validateFrozenReachabilityArtifacts() {
  validateFrozenProcedure();
  const eligibility = readJson<JsonRecord>(ELIGIBILITY_PATH);
  const sample = readJson<JsonRecord>(SAMPLE_PATH);
  const primary = readJson<JsonRecord>(PRIMARY_PATH);
  assertEqual(eligibility.status, "PHASE_A_COMPLETE_BEFORE_SUBSTRATE_LOOKUP", "eligibility status");
  assertEqual(eligibility.substrateResponseInspected, false, "eligibility substrate response boundary");
  assertEqual(eligibility.candidateCountInspected, false, "eligibility candidate count boundary");
  assertEqual(sample.status, "FROZEN_BEFORE_SUBSTRATE_EVALUATION", "sample status");
  assertEqual(sample.substrateEvaluationNotStarted, true, "sample freeze boundary");
  assertEqual(primary.status, "FROZEN_BEFORE_SUBSTRATE_LOOKUP", "primary status");
  assertEqual(primary.selectedBeforeSubstrateLookup, true, "primary freeze boundary");
  assertEqual(eligibility.procedureSha256, sha256File(PROCEDURE_PATH), "eligibility procedure binding");
  assertEqual(sample.eligibilitySha256, sha256File(ELIGIBILITY_PATH), "sample eligibility binding");
  assertEqual(primary.sampleSha256, sha256File(SAMPLE_PATH), "primary sample binding");
  const entries = sample.entries as readonly ReachableInput[];
  assertEqual(entries.length, SAMPLE_SIZE, "reachable sample size");
  if (entries.some((entry) => entry.genericQueryKeys.length === 0)) {
    throw new Error("M7_REACHABLE_SAMPLE_QUERY_KEY_MISSING");
  }
  const primaryEntry = primary.primary as ReachableInput;
  assertEqual(primaryEntry.input, entries[0]?.input, "successor primary/sample binding");
  return { eligibility, sample, primary, entries };
}

function compactCandidate(candidate: ReturnType<typeof buildMotivationEngineDiscoveryV0_1>["candidates"][number]) {
  return {
    candidateId: candidate.candidateId,
    candidateLanguage: candidate.candidateLanguage,
    candidateForm: candidate.candidateForm,
    candidateGloss: candidate.candidateGloss,
    candidateEmbryo: candidate.candidateEmbryo,
    sourceId: candidate.sourceFact.sourceId,
    sourceStatus: candidate.sourceFact.sourceStatus,
    evidenceRefs: [...candidate.sourceFact.evidenceRefs],
    matchClassification: candidate.structuralComparison.matchClassification,
    presentationClassification: candidate.structuralComparison.presentationClassification,
    matchedQuery: candidate.structuralComparison.matchedQuery,
    representationCompatibility: candidate.structuralComparison.representationCompatibility,
    matchReason: candidate.structuralComparison.matchReason,
    functionalStatus: candidate.functionalInterpretation.status,
    functionalStatement: candidate.functionalInterpretation.statement,
    functionalEvidenceRefs: [...candidate.functionalInterpretation.evidenceRefs],
    functionalReason: candidate.functionalInterpretation.reason,
    historicalRelation: candidate.historicalRelation,
    noSingleWinner: candidate.noSingleWinner,
    userDecisionPosture: candidate.userDecisionPosture,
  };
}

function evaluateCase(entry: ReachableInput): Promise<JsonRecord> {
  const word = entry.input;
  const heart = buildHeartInstrumentV1(word);
  return runAnalysisDeterministic(word, { mode: "strict", alphabet: "auto" }).then((payload) => {
    const analysis = enginePayloadToAnalysisResult(payload);
    const discovery = buildMotivationEngineDiscoveryV0_1({
      word,
      inputLanguage: "en",
      inputProfile: heart.spokenPronunciation.sourceProfileId,
      analysis,
      heart,
    });
    const candidates = discovery.candidates.map(compactCandidate);
    const crossFormCandidates = candidates.filter((candidate) =>
      normalizeWord(String(candidate.candidateForm)) !== normalizeWord(word),
    );
    const classification = crossFormCandidates.length > 0
      ? "GENERIC_CROSS_FORM_POSITIVE"
      : candidates.length > 0
        ? "EXACT_SELF_MATCH_ONLY"
        : "SUBSTRATE_NO_MATCH";
    return {
      input: word,
      classification,
      pronunciationStatus: heart.spokenPronunciation.status,
      pronunciationReason: heart.spokenPronunciation.reasonCode,
      voicePath: heart.canonicalSpokenVoicePath,
      gamma: discovery.derivedStructure.gamma,
      zc: discovery.derivedStructure.zeroConsonantalStructuralComposition,
      structuralHypotheses: discovery.derivedStructure.structuralHypotheses,
      genericQueryKeys: [...entry.genericQueryKeys],
      status: discovery.status,
      candidateCount: candidates.length,
      candidates,
      crossFormPositive: crossFormCandidates.length > 0,
      crossFormCandidates,
      noSingleWinner: discovery.noSingleWinner,
      userDecisionPosture: discovery.userDecisionPosture,
      interpretationStatus: discovery.interpretation.status,
      unknownOrNullReason: discovery.unknownOrNull.reason,
      historicalRelations: candidates.map((candidate) => candidate.historicalRelation),
    } satisfies JsonRecord;
  });
}

async function evaluateSubstrate(): Promise<void> {
  if (readFileExists(RESULT_PATH) || readFileExists(MANIFEST_PATH) || readFileExists(PHASE_B_ATTEMPT_PATH)) {
    throw new Error("M7_SUCCESSOR_RESULT_ALREADY_EXISTS_NO_RERUN");
  }
  const frozen = validateFrozenReachabilityArtifacts();
  const attempt = {
    schemaVersion: "open-instrument.m7-substrate-reachable-generalization-phase-b-attempt.v0.1",
    status: "RUNNING",
    attempt: 1,
    procedurePath: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/procedure.json",
    procedureSha256: sha256File(PROCEDURE_PATH),
    samplePath: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/reachable-sample.json",
    sampleSha256: sha256File(SAMPLE_PATH),
    sampleSize: frozen.entries.length,
    noRerun: true,
    realDataExecuted: false,
    providerExecution: false,
  };
  writeJson(PHASE_B_ATTEMPT_PATH, attempt);
  const entries = frozen.entries;
  const cases: JsonRecord[] = [];
  for (const entry of entries) {
    cases.push(await evaluateCase(entry));
  }
  const positiveCases = cases.flatMap((entry) =>
    entry.classification === "GENERIC_CROSS_FORM_POSITIVE"
      ? [{ input: entry.input, genericQueryKeys: entry.genericQueryKeys, candidates: entry.crossFormCandidates }]
      : [],
  );
  const result = {
    schemaVersion: "open-instrument.m7-substrate-reachable-generalization-result.v0.1",
    status: "COMPLETED_RESULT_PRESERVED",
    procedure: {
      path: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/procedure.json",
      sha256: sha256File(PROCEDURE_PATH),
    },
    eligibility: {
      path: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/eligibility.json",
      sha256: sha256File(ELIGIBILITY_PATH),
      rawInputsInspected: frozen.eligibility.rawInputsInspected,
      counts: frozen.eligibility.counts,
    },
    primary: {
      path: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/primary-selection.json",
      sha256: sha256File(PRIMARY_PATH),
      input: (frozen.primary.primary as ReachableInput).input,
      frozenBeforeSubstrateLookup: true,
      resultClass: cases[0]?.classification,
    },
    reachableSample: {
      path: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/reachable-sample.json",
      sha256: sha256File(SAMPLE_PATH),
      size: entries.length,
      substrateEvaluationAfterFreeze: true,
    },
    authority: {
      sourceProfile: "open-instrument.cmudict-arpabet-en-us.v0_1",
      sourcePath: "src/data/openInstrument/pronunciation/cmudict.dict",
      sourceSha256: SOURCE_SHA256,
      populationSpecPath: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json",
      populationSpecSha256: POPULATION_SPEC_SHA256,
      substrateVersion: SUBSTRATE_VERSION,
      substrateRecordCount: SUBSTRATE_RECORD_COUNT,
      substrateFingerprint: SUBSTRATE_FINGERPRINT,
      engineHead: CURRENT_MAIN_HEAD,
      retrievalPath: "src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts",
      retrievalSha256: RETRIEVAL_SHA256,
      structuralPath: "src/shared/structuralHypothesisDiscovery.v0_1.ts",
      structuralSha256: STRUCTURAL_SHA256,
      genericQueryPath: "src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1.ts",
      genericQuerySha256: GENERIC_QUERY_SHA256,
    },
    sample: {
      size: entries.length,
      cases,
      positiveCases,
      counts: {
        sampleSize: cases.length,
        crossFormPositiveCases: positiveCases.length,
        selfMatchOnlyCases: cases.filter((entry) => entry.classification === "EXACT_SELF_MATCH_ONLY").length,
        substrateNoMatchCases: cases.filter((entry) => entry.classification === "SUBSTRATE_NO_MATCH").length,
        invalidCases: 0,
        engineOrAuthorityFailures: 0,
      },
    },
    execution: {
      repositoryHead: CURRENT_MAIN_HEAD,
      phaseAExecutionAttempts: 1,
      phaseBExecutionAttempts: 1,
      noRerun: true,
      adaptiveSelection: false,
      sampleFrozenBeforeSubstrateEvaluation: true,
      substrateResponseUsedForEligibility: false,
      resultSubstitution: false,
      providerExecution: false,
      realDataExecuted: false,
    },
    phaseBAttemptPath: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/phase-b-attempt.json",
    integrity: {
      engineUnchanged: true,
      substrateUnchanged: true,
      retrievalUnchanged: true,
      noTargetSpecificMapping: true,
      noFunctionalEvidencePromotion: true,
      noHistoricalOriginClaim: true,
      noRanking: true,
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    },
  };
  writeJson(PHASE_B_ATTEMPT_PATH, {
    ...attempt,
    status: "COMPLETED",
    resultPath: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/result.json",
  });
  writeJson(RESULT_PATH, result);
  const manifest = {
    schemaVersion: "open-instrument.m7-substrate-reachable-generalization-hash-manifest.v0.1",
    status: "FROZEN_RESULT_BINDINGS",
    repositoryHead: CURRENT_MAIN_HEAD,
    artifacts: [
      PROCEDURE_PATH,
      ELIGIBILITY_PATH,
      PRIMARY_PATH,
      SAMPLE_PATH,
      RESULT_PATH,
      PHASE_B_ATTEMPT_PATH,
    ].map((path) => ({
      path: path.slice(`${ROOT}/`.length),
      bytes: readFileSync(path).byteLength,
      sha256: sha256File(path),
    })),
    execution: {
      phaseAExecutionAttempts: 1,
      phaseBExecutionAttempts: 1,
      noRerun: true,
      realDataExecuted: false,
      providerExecution: false,
    },
    authority: {
      sourceSha256: SOURCE_SHA256,
      populationSpecSha256: POPULATION_SPEC_SHA256,
      substrateFingerprint: SUBSTRATE_FINGERPRINT,
      retrievalSha256: RETRIEVAL_SHA256,
      structuralSha256: STRUCTURAL_SHA256,
      genericQuerySha256: GENERIC_QUERY_SHA256,
    },
  };
  writeJson(MANIFEST_PATH, manifest);
  process.stdout.write(`${JSON.stringify({
    valid: true,
    sampleSize: cases.length,
    rawInputsInspected: frozen.eligibility.rawInputsInspected,
    positiveCount: positiveCases.length,
    primary: (frozen.primary.primary as ReachableInput).input,
  }, null, 2)}\n`);
}

function repairResultMetadataWithoutScientificRerun(): void {
  const frozen = validateFrozenReachabilityArtifacts();
  const result = readJson<JsonRecord>(RESULT_PATH);
  const manifest = readJson<JsonRecord>(MANIFEST_PATH);
  const sample = result.sample as JsonRecord;
  const cases = sample.cases as readonly JsonRecord[];
  assertEqual(cases.length, frozen.entries.length, "result/sample case alignment");
  const existingRepair = (result.serializationRepair as JsonRecord | undefined) ?? {};
  const existingManifestRepair = (manifest.metadataRepair as JsonRecord | undefined) ?? {};
  const currentResultSha256BeforeRepair = sha256File(RESULT_PATH);
  const resultSha256BeforeRepair = typeof existingRepair.preRepairResultSha256 === "string"
    ? existingRepair.preRepairResultSha256
    : currentResultSha256BeforeRepair;
  const manifestSha256BeforeRepair = typeof existingRepair.preRepairManifestSha256 === "string"
    ? existingRepair.preRepairManifestSha256
    : typeof existingManifestRepair.preRepairManifestSha256 === "string"
      ? existingManifestRepair.preRepairManifestSha256
      : sha256File(MANIFEST_PATH);
  const repairClass = "SERIALIZATION_ONLY";
  const repairReason =
    "pre-substrate generic query keys existed in frozen Phase A but were omitted from evaluated-result serialization.";
  const repairInputs = new Set(["ata", "ate", "ati", "atom"]);
  const repairedCases = cases.map((entry, index) =>
    entry.classification === "GENERIC_CROSS_FORM_POSITIVE" && repairInputs.has(String(entry.input))
      ? {
          ...entry,
          genericQueryKeys: [...frozen.entries[index]!.genericQueryKeys],
        }
      : entry,
  );
  const positiveCases = repairedCases.flatMap((entry) =>
    entry.classification === "GENERIC_CROSS_FORM_POSITIVE"
      ? [{
          input: entry.input,
          genericQueryKeys: entry.genericQueryKeys,
          candidates: entry.crossFormCandidates,
        }]
      : [],
  );
  const repairedResult = {
    ...result,
    sample: {
      ...sample,
      cases: repairedCases,
      positiveCases,
    },
    serializationRepair: {
      repairClass,
      repairReason,
      preRepairResultSha256: resultSha256BeforeRepair,
      preRepairManifestSha256: manifestSha256BeforeRepair,
      appliedAfterExecution: true,
      scientificResultChanged: false,
      scientificReexecution: false,
      changedFields: ["sample.cases[].genericQueryKeys", "sample.positiveCases[].genericQueryKeys"],
      source: "frozen Phase A reachable-sample.json",
    },
  };
  writeJson(RESULT_PATH, repairedResult);
  const attempt = {
    schemaVersion: "open-instrument.m7-substrate-reachable-generalization-phase-b-attempt.v0.1",
    status: "COMPLETED_POST_EXECUTION_METADATA_REPAIR",
    attempt: 1,
    resultPath: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/result.json",
    resultSha256BeforeRepair,
    currentResultSha256BeforeRepair,
    resultSha256AfterRepair: sha256File(RESULT_PATH),
    preRepairManifestSha256: manifestSha256BeforeRepair,
    repairClass,
    repairReason,
    noRerun: true,
    scientificResultChanged: false,
    scientificReexecution: false,
    realDataExecuted: false,
    providerExecution: false,
    preExecutionReservationAvailable: false,
  };
  writeJson(PHASE_B_ATTEMPT_PATH, attempt);
  const artifacts = (manifest.artifacts as readonly JsonRecord[]).filter((artifact) =>
    artifact.path !== "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/result.json" &&
    artifact.path !== "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/phase-b-attempt.json",
  );
  writeJson(MANIFEST_PATH, {
    ...manifest,
    artifacts: [
      ...artifacts,
      {
        path: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/result.json",
        bytes: readFileSync(RESULT_PATH).byteLength,
        sha256: sha256File(RESULT_PATH),
      },
      {
        path: "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/phase-b-attempt.json",
        bytes: readFileSync(PHASE_B_ATTEMPT_PATH).byteLength,
        sha256: sha256File(PHASE_B_ATTEMPT_PATH),
      },
    ],
    metadataRepair: {
      repairClass,
      repairReason,
      preRepairResultSha256: resultSha256BeforeRepair,
      preRepairManifestSha256: manifestSha256BeforeRepair,
      appliedAfterExecution: true,
      scientificResultChanged: false,
      scientificReexecution: false,
      resultSha256BeforeRepair,
    },
  });
}

function readFileExists(path: string): boolean {
  try {
    readFileSync(path);
    return true;
  } catch {
    return false;
  }
}

function validateResultArtifacts(): void {
  validateFrozenReachabilityArtifacts();
  const result = readJson<JsonRecord>(RESULT_PATH);
  const manifest = readJson<JsonRecord>(MANIFEST_PATH);
  assertEqual(result.status, "COMPLETED_RESULT_PRESERVED", "successor result status");
  assertEqual(manifest.status, "FROZEN_RESULT_BINDINGS", "successor manifest status");
  const sample = result.sample as JsonRecord;
  const counts = sample.counts as JsonRecord;
  assertEqual(counts.sampleSize, SAMPLE_SIZE, "successor result sample size");
  assertEqual((sample.cases as readonly unknown[]).length, SAMPLE_SIZE, "successor result case count");
  const resultCases = sample.cases as readonly JsonRecord[];
  if (resultCases.some((entry) => !Array.isArray(entry.genericQueryKeys))) {
    throw new Error("M7_RESULT_QUERY_KEYS_MISSING");
  }
  const positiveCases = sample.positiveCases as readonly JsonRecord[];
  if (positiveCases.some((entry) => !Array.isArray(entry.genericQueryKeys) || entry.genericQueryKeys.length === 0)) {
    throw new Error("M7_POSITIVE_RESULT_QUERY_KEYS_MISSING");
  }
  assertEqual((result.execution as JsonRecord).phaseAExecutionAttempts, 1, "phase A attempt count");
  assertEqual((result.execution as JsonRecord).phaseBExecutionAttempts, 1, "phase B attempt count");
  assertEqual((result.execution as JsonRecord).noRerun, true, "successor no-rerun binding");
  assertEqual((result.execution as JsonRecord).substrateResponseUsedForEligibility, false, "eligibility response boundary");
  const artifacts = manifest.artifacts as readonly { path: string; bytes: number; sha256: string }[];
  if (!artifacts.some((artifact) => artifact.path.endsWith("/phase-b-attempt.json"))) {
    throw new Error("M7_PHASE_B_ATTEMPT_ARTIFACT_MISSING");
  }
  for (const artifact of artifacts) {
    const path = join(ROOT, artifact.path);
    assertEqual(readFileSync(path).byteLength, artifact.bytes, `manifest bytes ${artifact.path}`);
    assertEqual(sha256File(path), artifact.sha256, `manifest hash ${artifact.path}`);
  }
  process.stdout.write(`${JSON.stringify({
    valid: true,
    sampleSize: counts.sampleSize,
    crossFormPositiveCount: counts.crossFormPositiveCases,
    selfMatchOnlyCount: counts.selfMatchOnlyCases,
    substrateNoMatchCount: counts.substrateNoMatchCases,
    resultSha256: sha256File(RESULT_PATH),
    manifestSha256: sha256File(MANIFEST_PATH),
  }, null, 2)}\n`);
}

async function main(): Promise<void> {
  if (process.argv.includes("--eligibility")) {
    const snapshot = buildEligibilitySnapshotV0_1();
    process.stdout.write(`${JSON.stringify({
      valid: true,
      phase: "A",
      rawInputsInspected: snapshot.eligibility.rawInputsInspected,
      counts: snapshot.eligibility.counts,
      reachableSampleSize: snapshot.sample.entries.length,
      primary: snapshot.primary.primary.input,
      substrateResponseInspected: false,
    }, null, 2)}\n`);
  } else if (process.argv.includes("--evaluate")) {
    await evaluateSubstrate();
  } else if (process.argv.includes("--validate")) {
    validateResultArtifacts();
  } else if (process.argv.includes("--repair-result-metadata")) {
    repairResultMetadataWithoutScientificRerun();
  }
}

void main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
