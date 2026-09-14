import {
  stableNormalize,
  stableStringify,
  type JsonValue,
} from "../engineContract.v1";
import type { Alphabet, Mode } from "../analysisResult.v1";
import type { AnalysisStatusCodeV0_1 } from "../analysisStatus.v0_1";

export const ANALYSIS_CAPABILITY_BASELINE_SCHEMA_VERSION_V1 =
  "open-instrument.analysis-capability-baseline.v1" as const;
export const ANALYSIS_CAPABILITY_BASELINE_MANIFEST_SCHEMA_VERSION_V1 =
  "open-instrument.analysis-capability-baseline-manifest.v1" as const;
export const ANALYSIS_CAPABILITY_BASELINE_GENERATION_MODE_V1 =
  "deterministic-analyze-v1-route-v1" as const;
export const ANALYSIS_CAPABILITY_BASELINE_FINGERPRINT_STRATEGY_V1 =
  "open-instrument.analyze-v1-stable-regression-fingerprint.v0.1" as const;

export const ANALYSIS_CAPABILITY_BASELINE_STATUS_CODES_V1 = [
  "reviewed_functional_evidence",
  "research_functional_hypothesis",
  "candidate_only",
  "structural_unreviewed",
  "null_no_supported_candidate",
] as const satisfies readonly AnalysisStatusCodeV0_1[];

export const ANALYSIS_CAPABILITY_BASELINE_DELTA_CODES_V1 = [
  "MATCH",
  "SHIFT",
  "DIVERGE",
  "NOT_EMITTED",
] as const;

export const ANALYSIS_CAPABILITY_BASELINE_CANONICAL_VOICES_V1 = [
  "A",
  "E",
  "I",
  "O",
  "U",
  "Y",
  "Ë",
] as const;

const SUPPORTED_ALPHABETS_V1 = [
  "auto",
  "albanian",
  "latin",
  "sanskrit",
  "ancient_greek",
  "pie",
  "turkish",
  "german",
] as const satisfies readonly Alphabet[];

type UnknownRecord = Record<string, unknown>;

export type AnalysisCapabilityBaselineCaseV1 = Readonly<{
  caseId: string;
  word: string;
  mode: Mode;
  alphabet: Alphabet;
  ipa?: string;
  targetSenseId?: string;
  targetSenseLabel?: string;
  category?: string;
  tags?: readonly string[];
}>;

export type AnalysisCapabilityBaselineManifestV1 = Readonly<{
  schemaVersion: typeof ANALYSIS_CAPABILITY_BASELINE_MANIFEST_SCHEMA_VERSION_V1;
  corpusVersion: string;
  cases: readonly AnalysisCapabilityBaselineCaseV1[];
}>;

export type BaselineEvidenceReferenceMeasurementV1 = Readonly<{
  ref: string;
  kind:
    | "internal_diagnostic"
    | "reviewed_evidence"
    | "research_evidence"
    | "unresolved";
  sourceStatus?: string;
  navigable: boolean;
  hasLocator: boolean;
  hasSafeUrl: boolean;
}>;

export type BaselineCandidateV1 = Readonly<{
  ordinal: number;
  id: string | null;
  form: string | null;
  sourceKind: string | null;
  sourceStatus: string | null;
  status: JsonValue | null;
  validationOutcome: string | null;
  embryo: string | null;
  embryoSize: number | null;
  functionalComponents: Readonly<{
    count: number;
    embryos: readonly string[];
    languages: readonly (string | null)[];
    meanings: readonly (string | null)[];
    evidenceStates: readonly (string | null)[];
  }> | null;
  expansionChain: JsonValue | null;
  vowelPath: JsonValue | null;
  evidence: Readonly<{
    refCount: number;
    resolvedCount: number;
    unresolvedCount: number;
    reviewedCount: number;
    researchCount: number;
    locatorCount: number;
    safeUrlCount: number;
    navigableCount: number;
    refs: readonly BaselineEvidenceReferenceMeasurementV1[];
  }> | null;
  functionalStatement: string | null;
  targetSenseId: string | null;
  targetSenseLabel: string | null;
  claimBoundary: JsonValue | null;
  userDecisionPosture: string | null;
}>;

export type BaselineInvariantSummaryV1 = Readonly<{
  claimBoundaryPreserved: boolean;
  userDecisionPosturePreserved: boolean;
  noSingleWinnerPreserved: boolean;
  nullIsValidPreserved: boolean;
  researchBoundaryPreserved: boolean;
  unresolvedEvidencePreserved: boolean;
  forbiddenFieldsAbsent: boolean;
  providerExecutionObserved: boolean;
  valid: boolean;
  failures: readonly string[];
}>;

export type AnalysisCapabilityBaselineCaseResultV1 = Readonly<{
  caseId: string;
  request: Readonly<{
    word: string;
    mode: Mode;
    alphabet: Alphabet;
    ipa: string | null;
    targetSenseId: string | null;
    targetSenseLabel: string | null;
    category: string | null;
    tags: readonly string[];
  }>;
  normalizedWord: string;
  engineVersion: string;
  status: AnalysisStatusCodeV0_1;
  nullResult: boolean;
  paths: Readonly<{
    detected: JsonValue | null;
    surface: JsonValue | null;
    functional: JsonValue | null;
    delta: string | null;
    normalizationSteps: JsonValue | null;
    normalizationRecordCount: number;
  }>;
  candidateCount: number;
  candidateIds: readonly (string | null)[];
  candidates: readonly BaselineCandidateV1[];
  embryo: Readonly<{
    candidateCount: number;
    candidatesWithEmbryo: number;
    forms: readonly string[];
    sizes: readonly number[];
  }>;
  composition: Readonly<{
    candidatesWithFunctionalStatements: number;
    candidatesWithComponents: number;
    totalComponents: number;
    candidatesWithExpansionChain: number;
    candidatesWithVowelPath: number;
  }>;
  evidence: Readonly<{
    candidatesWithRefs: number;
    totalRefs: number;
    resolvedRefs: number;
    unresolvedRefs: number;
    reviewedRefs: number;
    researchRefs: number;
    refsWithLocator: number;
    refsWithSafeUrl: number;
    navigableRefs: number;
  }>;
  targetSense: Readonly<{
    candidateBindings: readonly {
      candidateId: string | null;
      targetSenseId: string | null;
      targetSenseLabel: string | null;
    }[];
  }>;
  invariants: BaselineInvariantSummaryV1;
  fingerprint: string;
  repeatability: Readonly<{
    checked: boolean;
    stable: boolean;
    repeatedFingerprint: string;
  }>;
}>;

export type AnalysisCapabilityBaselineAggregateV1 = Readonly<{
  totalCases: number;
  statusCounts: Readonly<Record<AnalysisStatusCodeV0_1, number>>;
  nullCount: number;
  pathCoverage: Readonly<{
    detected: number;
    surface: number;
    functional: number;
    delta: number;
  }>;
  normalization: Readonly<{
    casesWithRecords: number;
    recordCount: number;
  }>;
  candidates: Readonly<{
    casesWithCandidates: number;
    totalCandidates: number;
  }>;
  embryos: Readonly<{
    casesWithEmbryos: number;
    candidatesWithEmbryos: number;
  }>;
  composition: Readonly<{
    casesWithFunctionalStatements: number;
    candidatesWithFunctionalStatements: number;
    casesWithComponents: number;
    candidatesWithComponents: number;
    totalComponents: number;
    casesWithExpansionChains: number;
    candidatesWithExpansionChains: number;
    casesWithCandidateVowelPaths: number;
    candidatesWithCandidateVowelPaths: number;
  }>;
  evidence: Readonly<{
    casesWithRefs: number;
    candidatesWithRefs: number;
    totalRefs: number;
    resolvedRefs: number;
    unresolvedRefs: number;
    reviewedRefs: number;
    researchRefs: number;
    refsWithLocator: number;
    refsWithSafeUrl: number;
    navigableRefs: number;
  }>;
  targetSense: Readonly<{
    casesWithRequestContext: number;
    candidateBindings: number;
  }>;
  repeatability: Readonly<{
    checkedCases: number;
    stableCases: number;
    allStable: boolean;
  }>;
  invariantFailures: readonly string[];
}>;

export type AnalysisCapabilityBaselineV1 = Readonly<{
  schemaVersion: typeof ANALYSIS_CAPABILITY_BASELINE_SCHEMA_VERSION_V1;
  corpusVersion: string;
  generationMode: typeof ANALYSIS_CAPABILITY_BASELINE_GENERATION_MODE_V1;
  fingerprintStrategy: typeof ANALYSIS_CAPABILITY_BASELINE_FINGERPRINT_STRATEGY_V1;
  canonicalVoices: readonly string[];
  engineVersions: readonly string[];
  caseCount: number;
  cases: readonly AnalysisCapabilityBaselineCaseResultV1[];
  aggregate: AnalysisCapabilityBaselineAggregateV1;
  valid: boolean;
}>;

export type BuildAnalysisCapabilityBaselineCaseInputV1 = Readonly<{
  input: AnalysisCapabilityBaselineCaseV1;
  publicResult: unknown;
  viewModel: unknown;
  fingerprint: string;
  repeatedFingerprint: string;
  evidenceMeasurements: ReadonlyArray<ReadonlyArray<BaselineEvidenceReferenceMeasurementV1>>;
  providerExecutionObserved?: boolean;
}>;

function isRecord(value: unknown): value is UnknownRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasOwn(record: UnknownRecord, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(record, key);
}

function assertCondition(
  condition: unknown,
  message: string,
): asserts condition {
  if (!condition) throw new Error(message);
}

function assertOnlyKeys(
  record: UnknownRecord,
  allowed: readonly string[],
  path: string,
): void {
  const allowedSet = new Set(allowed);
  for (const key of Object.keys(record)) {
    assertCondition(allowedSet.has(key), `${path}: unknown key '${key}'`);
  }
}

function requiredText(value: unknown, path: string): string {
  assertCondition(typeof value === "string", `${path}: expected string`);
  const normalized = value.trim();
  assertCondition(normalized.length > 0, `${path}: expected non-empty string`);
  return normalized;
}

function optionalText(
  record: UnknownRecord,
  key: string,
  path: string,
): string | undefined {
  if (!hasOwn(record, key)) return undefined;
  return requiredText(record[key], `${path}.${key}`);
}

function optionalStringArray(
  record: UnknownRecord,
  key: string,
  path: string,
): string[] | undefined {
  if (!hasOwn(record, key)) return undefined;
  const value = record[key];
  assertCondition(Array.isArray(value), `${path}.${key}: expected array`);
  return value.map((item, index) =>
    requiredText(item, `${path}.${key}[${index}]`),
  );
}

function jsonValue(value: unknown): JsonValue {
  return stableNormalize(value);
}

function optionalJsonValue(
  record: UnknownRecord,
  key: string,
): JsonValue | null {
  return hasOwn(record, key) ? jsonValue(record[key]) : null;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

function finiteNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function presentValue(value: unknown): JsonValue | null {
  if (!isRecord(value) || value.kind !== "present") return null;
  return jsonValue(value.value);
}

function readRecord(value: unknown): UnknownRecord {
  return isRecord(value) ? value : {};
}

function containsForbiddenBaselineKey(value: unknown): boolean {
  const forbidden = new Set([
    "raw",
    "debug",
    "providerOutput",
    "providerRequest",
    "providerResponse",
    "tokenUsage",
    "requestId",
    "environment",
    "runtime",
    "serverError",
    "exception",
    "calibrationPacket",
    "researchRows",
  ]);

  if (Array.isArray(value)) return value.some(containsForbiddenBaselineKey);
  if (!isRecord(value)) return false;

  return Object.entries(value).some(
    ([key, child]) => forbidden.has(key) || containsForbiddenBaselineKey(child),
  );
}

function expectedClaimBoundary(value: unknown): boolean {
  if (!isRecord(value)) return false;

  return (
    value.historicalOriginClaim === "not_claimed" &&
    value.historicalTransmissionClaim === "not_claimed" &&
    value.winnerClaim === "not_claimed" &&
    value.languageSuperiorityClaim === "not_claimed" &&
    value.linguisticOwnershipClaim === "not_claimed" &&
    value.candidateTruthClaim === "not_claimed" &&
    value.structuralOutputIsCandidateTruth === false &&
    value.nullIsValid === true
  );
}

function readNormalizationSteps(
  publicResult: UnknownRecord,
): { value: JsonValue | null; count: number } {
  const evidence = readRecord(publicResult.evidence);
  if (!hasOwn(evidence, "normalizationSteps")) {
    return { value: null, count: 0 };
  }

  const raw = evidence.normalizationSteps;
  assertCondition(
    Array.isArray(raw),
    "result.evidence.normalizationSteps: expected array",
  );
  return { value: jsonValue(raw), count: raw.length };
}

function readFunctionalComponents(
  candidate: UnknownRecord,
): BaselineCandidateV1["functionalComponents"] {
  const segmentation = readRecord(candidate.segmentation);
  if (!hasOwn(segmentation, "components")) return null;

  const rawComponents = segmentation.components;
  assertCondition(
    Array.isArray(rawComponents),
    "candidate.segmentation.components: expected array",
  );

  const embryos: string[] = [];
  const languages: Array<string | null> = [];
  const meanings: Array<string | null> = [];
  const evidenceStates: Array<string | null> = [];

  rawComponents.forEach((rawComponent, index) => {
    assertCondition(
      isRecord(rawComponent),
      `candidate.segmentation.components[${index}]: expected object`,
    );
    embryos.push(requiredText(rawComponent.embryo, `component[${index}].embryo`));
    languages.push(stringOrNull(rawComponent.language));
    meanings.push(stringOrNull(rawComponent.plainMeaning));
    evidenceStates.push(stringOrNull(rawComponent.evidenceState));
  });

  return {
    count: rawComponents.length,
    embryos,
    languages,
    meanings,
    evidenceStates,
  };
}

function readCandidateEvidence(
  candidate: UnknownRecord,
  measurements: readonly BaselineEvidenceReferenceMeasurementV1[],
): BaselineCandidateV1["evidence"] {
  if (!hasOwn(candidate, "evidenceRefs")) {
    assertCondition(
      measurements.length === 0,
      "candidate evidence measurements exist without evidenceRefs",
    );
    return null;
  }

  const refs = candidate.evidenceRefs;
  assertCondition(Array.isArray(refs), "candidate.evidenceRefs: expected array");
  const normalizedRefs = refs.map((ref, index) =>
    requiredText(ref, `candidate.evidenceRefs[${index}]`),
  );
  assertCondition(
    normalizedRefs.length === measurements.length,
    "candidate evidence measurement count does not match evidenceRefs",
  );

  return {
    refCount: measurements.length,
    resolvedCount: measurements.filter((item) => item.kind !== "unresolved").length,
    unresolvedCount: measurements.filter((item) => item.kind === "unresolved").length,
    reviewedCount: measurements.filter((item) => item.kind === "reviewed_evidence").length,
    researchCount: measurements.filter((item) => item.kind === "research_evidence").length,
    locatorCount: measurements.filter((item) => item.hasLocator).length,
    safeUrlCount: measurements.filter((item) => item.hasSafeUrl).length,
    navigableCount: measurements.filter((item) => item.navigable).length,
    refs: measurements,
  };
}

function buildInvariantSummary(
  publicResult: UnknownRecord,
  statusRecord: UnknownRecord,
  candidates: readonly BaselineCandidateV1[],
  providerExecutionObserved: boolean,
): BaselineInvariantSummaryV1 {
  const claimBoundaryPreserved = expectedClaimBoundary(statusRecord.claimBoundary);
  const userDecisionPosturePreserved =
    statusRecord.userDecisionPosture === "user_decides";
  const noSingleWinnerPreserved =
    isRecord(statusRecord.claimBoundary) &&
    statusRecord.claimBoundary.winnerClaim === "not_claimed";
  const nullIsValidPreserved =
    isRecord(statusRecord.claimBoundary) &&
    statusRecord.claimBoundary.nullIsValid === true;
  const researchBoundaryPreserved = candidates.every((candidate) =>
    candidate.evidence?.refs.every(
      (reference) =>
        reference.kind !== "research_evidence" ||
        reference.sourceStatus !== "reviewed_accepted",
    ) ?? true,
  );
  const unresolvedEvidencePreserved = candidates.every((candidate) =>
    candidate.evidence?.refs.every(
      (reference) =>
        reference.kind !== "unresolved" ||
        (reference.navigable === false && reference.hasSafeUrl === false),
    ) ?? true,
  );
  const forbiddenFieldsAbsent = !containsForbiddenBaselineKey(publicResult);

  const failures: string[] = [];
  if (!claimBoundaryPreserved) failures.push("CLAIM_BOUNDARY_NOT_PRESERVED");
  if (!userDecisionPosturePreserved) failures.push("USER_DECISION_POSTURE_NOT_PRESERVED");
  if (!noSingleWinnerPreserved) failures.push("NO_SINGLE_WINNER_NOT_PRESERVED");
  if (!nullIsValidPreserved) failures.push("NULL_VALIDITY_NOT_PRESERVED");
  if (!researchBoundaryPreserved) failures.push("RESEARCH_BOUNDARY_NOT_PRESERVED");
  if (!unresolvedEvidencePreserved) failures.push("UNRESOLVED_EVIDENCE_NOT_PRESERVED");
  if (!forbiddenFieldsAbsent) failures.push("FORBIDDEN_FIELD_PRESENT");
  if (providerExecutionObserved) failures.push("PROVIDER_EXECUTION_OBSERVED");

  return {
    claimBoundaryPreserved,
    userDecisionPosturePreserved,
    noSingleWinnerPreserved,
    nullIsValidPreserved,
    researchBoundaryPreserved,
    unresolvedEvidencePreserved,
    forbiddenFieldsAbsent,
    providerExecutionObserved,
    valid: failures.length === 0,
    failures,
  };
}

export function parseAnalysisCapabilityBaselineManifestV1(
  input: unknown,
): AnalysisCapabilityBaselineManifestV1 {
  assertCondition(isRecord(input), "manifest: expected object");
  assertOnlyKeys(input, ["schemaVersion", "corpusVersion", "cases"], "manifest");
  assertCondition(
    input.schemaVersion === ANALYSIS_CAPABILITY_BASELINE_MANIFEST_SCHEMA_VERSION_V1,
    `manifest.schemaVersion: expected '${ANALYSIS_CAPABILITY_BASELINE_MANIFEST_SCHEMA_VERSION_V1}'`,
  );
  const corpusVersion = requiredText(input.corpusVersion, "manifest.corpusVersion");
  assertCondition(Array.isArray(input.cases), "manifest.cases: expected array");

  const caseIds = new Set<string>();
  const cases = input.cases.map((rawCase, index) => {
    assertCondition(isRecord(rawCase), `manifest.cases[${index}]: expected object`);
    assertOnlyKeys(
      rawCase,
      [
        "caseId",
        "word",
        "mode",
        "alphabet",
        "ipa",
        "targetSenseId",
        "targetSenseLabel",
        "category",
        "tags",
      ],
      `manifest.cases[${index}]`,
    );

    const value: AnalysisCapabilityBaselineCaseV1 = {
      caseId: requiredText(rawCase.caseId, `manifest.cases[${index}].caseId`),
      word: requiredText(rawCase.word, `manifest.cases[${index}].word`),
      mode: requiredText(rawCase.mode, `manifest.cases[${index}].mode`) as Mode,
      alphabet: requiredText(
        rawCase.alphabet,
        `manifest.cases[${index}].alphabet`,
      ) as Alphabet,
      ...(optionalText(rawCase, "ipa", `manifest.cases[${index}]`) !== undefined
        ? { ipa: optionalText(rawCase, "ipa", `manifest.cases[${index}]`) }
        : {}),
      ...(optionalText(rawCase, "targetSenseId", `manifest.cases[${index}]`) !== undefined
        ? {
            targetSenseId: optionalText(
              rawCase,
              "targetSenseId",
              `manifest.cases[${index}]`,
            ),
          }
        : {}),
      ...(optionalText(rawCase, "targetSenseLabel", `manifest.cases[${index}]`) !== undefined
        ? {
            targetSenseLabel: optionalText(
              rawCase,
              "targetSenseLabel",
              `manifest.cases[${index}]`,
            ),
          }
        : {}),
      ...(optionalText(rawCase, "category", `manifest.cases[${index}]`) !== undefined
        ? { category: optionalText(rawCase, "category", `manifest.cases[${index}]`) }
        : {}),
      ...(optionalStringArray(rawCase, "tags", `manifest.cases[${index}]`) !== undefined
        ? { tags: optionalStringArray(rawCase, "tags", `manifest.cases[${index}]`) }
        : {}),
    };

    assertCondition(
      value.mode === "strict" || value.mode === "open",
      `manifest.cases[${index}].mode: expected 'strict' or 'open'`,
    );
    assertCondition(
      (SUPPORTED_ALPHABETS_V1 as readonly string[]).includes(value.alphabet),
      `manifest.cases[${index}].alphabet: unsupported alphabet '${value.alphabet}'`,
    );
    assertCondition(!caseIds.has(value.caseId), `manifest.cases: duplicate caseId '${value.caseId}'`);
    caseIds.add(value.caseId);
    return value;
  });

  assertCondition(cases.length > 0, "manifest.cases: expected at least one case");
  return {
    schemaVersion: ANALYSIS_CAPABILITY_BASELINE_MANIFEST_SCHEMA_VERSION_V1,
    corpusVersion,
    cases,
  };
}

export function buildAnalysisCapabilityBaselineCaseV1(
  input: BuildAnalysisCapabilityBaselineCaseInputV1,
): AnalysisCapabilityBaselineCaseResultV1 {
  const publicResult = readRecord(input.publicResult);
  assertCondition(Object.keys(publicResult).length > 0, "result: expected public object");

  const statusRecord = readRecord(publicResult.analysisStatusV0_1);
  const status = requiredText(statusRecord.status, "result.analysisStatusV0_1.status") as AnalysisStatusCodeV0_1;
  assertCondition(
    (ANALYSIS_CAPABILITY_BASELINE_STATUS_CODES_V1 as readonly string[]).includes(status),
    `result.analysisStatusV0_1.status: unsupported status '${status}'`,
  );

  const engineVersion = requiredText(publicResult.engineVersion, "result.engineVersion");
  const normalizedWord = requiredText(publicResult.sanitized, "result.sanitized");
  const candidatesRaw = publicResult.candidates;
  assertCondition(Array.isArray(candidatesRaw), "result.candidates: expected array");
  assertCondition(
    candidatesRaw.length === input.evidenceMeasurements.length,
    "candidate evidence measurement rows do not match candidate count",
  );

  const candidates = candidatesRaw.map((rawCandidate, index) => {
    assertCondition(isRecord(rawCandidate), `result.candidates[${index}]: expected object`);
    const evidence = readCandidateEvidence(
      rawCandidate,
      input.evidenceMeasurements[index] ?? [],
    );
    return {
      ordinal: index,
      id: stringOrNull(rawCandidate.id) ?? stringOrNull(rawCandidate.candidateId),
      form: stringOrNull(rawCandidate.form) ?? stringOrNull(rawCandidate.displayForm),
      sourceKind: stringOrNull(rawCandidate.sourceKind),
      sourceStatus: stringOrNull(rawCandidate.sourceStatus),
      status: hasOwn(rawCandidate, "status") ? jsonValue(rawCandidate.status) : null,
      validationOutcome: stringOrNull(rawCandidate.validationOutcome),
      embryo: stringOrNull(rawCandidate.embryo),
      embryoSize: finiteNumberOrNull(rawCandidate.embryoSize),
      functionalComponents: readFunctionalComponents(rawCandidate),
      expansionChain: optionalJsonValue(rawCandidate, "expansionChain"),
      vowelPath: optionalJsonValue(rawCandidate, "vowelPath"),
      evidence,
      functionalStatement: stringOrNull(rawCandidate.functionalStatement),
      targetSenseId: stringOrNull(rawCandidate.targetSenseId),
      targetSenseLabel: stringOrNull(rawCandidate.targetSenseLabel),
      claimBoundary: optionalJsonValue(rawCandidate, "claimBoundary"),
      userDecisionPosture: stringOrNull(rawCandidate.userDecisionPosture),
    } satisfies BaselineCandidateV1;
  });

  const readout = readRecord(readRecord(input.viewModel).readout);
  const normalization = readNormalizationSteps(publicResult);
  const paths = {
    detected: presentValue(readout.voicePath),
    surface: presentValue(readout.voicePathSurface),
    functional: presentValue(readout.voicePathFunctional),
    delta: stringOrNull(readout.voicePathDelta),
    normalizationSteps: normalization.value,
    normalizationRecordCount: normalization.count,
  };

  const claimBoundaryPreserved = expectedClaimBoundary(statusRecord.claimBoundary);
  const invariantSummary = buildInvariantSummary(
    publicResult,
    statusRecord,
    candidates,
    input.providerExecutionObserved ?? false,
  );

  const candidateBindings = candidates.flatMap((candidate) =>
    candidate.targetSenseId || candidate.targetSenseLabel
      ? [
          {
            candidateId: candidate.id,
            targetSenseId: candidate.targetSenseId,
            targetSenseLabel: candidate.targetSenseLabel,
          },
        ]
      : [],
  );

  assertCondition(/^[a-f0-9]{64}$/.test(input.fingerprint), "fingerprint: expected SHA-256 hex");
  assertCondition(/^[a-f0-9]{64}$/.test(input.repeatedFingerprint), "repeatedFingerprint: expected SHA-256 hex");

  return {
    caseId: input.input.caseId,
    request: {
      word: input.input.word,
      mode: input.input.mode,
      alphabet: input.input.alphabet,
      ipa: input.input.ipa ?? null,
      targetSenseId: input.input.targetSenseId ?? null,
      targetSenseLabel: input.input.targetSenseLabel ?? null,
      category: input.input.category ?? null,
      tags: [...(input.input.tags ?? [])],
    },
    normalizedWord,
    engineVersion,
    status,
    nullResult: status === "null_no_supported_candidate",
    paths,
    candidateCount: candidates.length,
    candidateIds: candidates.map((candidate) => candidate.id),
    candidates,
    embryo: {
      candidateCount: candidates.length,
      candidatesWithEmbryo: candidates.filter((candidate) => candidate.embryo !== null).length,
      forms: candidates.flatMap((candidate) => candidate.embryo ? [candidate.embryo] : []),
      sizes: candidates.flatMap((candidate) => candidate.embryoSize === null ? [] : [candidate.embryoSize]),
    },
    composition: {
      candidatesWithFunctionalStatements: candidates.filter(
        (candidate) => candidate.functionalStatement !== null,
      ).length,
      candidatesWithComponents: candidates.filter((candidate) => candidate.functionalComponents !== null).length,
      totalComponents: candidates.reduce(
        (sum, candidate) => sum + (candidate.functionalComponents?.count ?? 0),
        0,
      ),
      candidatesWithExpansionChain: candidates.filter((candidate) => candidate.expansionChain !== null).length,
      candidatesWithVowelPath: candidates.filter((candidate) => candidate.vowelPath !== null).length,
    },
    evidence: {
      candidatesWithRefs: candidates.filter(
        (candidate) => (candidate.evidence?.refCount ?? 0) > 0,
      ).length,
      totalRefs: candidates.reduce((sum, candidate) => sum + (candidate.evidence?.refCount ?? 0), 0),
      resolvedRefs: candidates.reduce((sum, candidate) => sum + (candidate.evidence?.resolvedCount ?? 0), 0),
      unresolvedRefs: candidates.reduce((sum, candidate) => sum + (candidate.evidence?.unresolvedCount ?? 0), 0),
      reviewedRefs: candidates.reduce((sum, candidate) => sum + (candidate.evidence?.reviewedCount ?? 0), 0),
      researchRefs: candidates.reduce((sum, candidate) => sum + (candidate.evidence?.researchCount ?? 0), 0),
      refsWithLocator: candidates.reduce((sum, candidate) => sum + (candidate.evidence?.locatorCount ?? 0), 0),
      refsWithSafeUrl: candidates.reduce((sum, candidate) => sum + (candidate.evidence?.safeUrlCount ?? 0), 0),
      navigableRefs: candidates.reduce((sum, candidate) => sum + (candidate.evidence?.navigableCount ?? 0), 0),
    },
    targetSense: { candidateBindings },
    invariants: {
      ...invariantSummary,
      claimBoundaryPreserved,
    },
    fingerprint: input.fingerprint,
    repeatability: {
      checked: true,
      stable: input.fingerprint === input.repeatedFingerprint,
      repeatedFingerprint: input.repeatedFingerprint,
    },
  };
}

function emptyStatusCounts(): Record<AnalysisStatusCodeV0_1, number> {
  return {
    reviewed_functional_evidence: 0,
    research_functional_hypothesis: 0,
    candidate_only: 0,
    structural_unreviewed: 0,
    null_no_supported_candidate: 0,
  };
}

export function aggregateAnalysisCapabilityBaselineV1(
  cases: readonly AnalysisCapabilityBaselineCaseResultV1[],
): AnalysisCapabilityBaselineAggregateV1 {
  const statusCounts = emptyStatusCounts();
  for (const item of cases) statusCounts[item.status] += 1;

  const evidence = cases.reduce(
    (sum, item) => ({
      casesWithRefs: sum.casesWithRefs + (item.evidence.totalRefs > 0 ? 1 : 0),
      candidatesWithRefs: sum.candidatesWithRefs + item.evidence.candidatesWithRefs,
      totalRefs: sum.totalRefs + item.evidence.totalRefs,
      resolvedRefs: sum.resolvedRefs + item.evidence.resolvedRefs,
      unresolvedRefs: sum.unresolvedRefs + item.evidence.unresolvedRefs,
      reviewedRefs: sum.reviewedRefs + item.evidence.reviewedRefs,
      researchRefs: sum.researchRefs + item.evidence.researchRefs,
      refsWithLocator: sum.refsWithLocator + item.evidence.refsWithLocator,
      refsWithSafeUrl: sum.refsWithSafeUrl + item.evidence.refsWithSafeUrl,
      navigableRefs: sum.navigableRefs + item.evidence.navigableRefs,
    }),
    {
      casesWithRefs: 0,
      candidatesWithRefs: 0,
      totalRefs: 0,
      resolvedRefs: 0,
      unresolvedRefs: 0,
      reviewedRefs: 0,
      researchRefs: 0,
      refsWithLocator: 0,
      refsWithSafeUrl: 0,
      navigableRefs: 0,
    },
  );

  const aggregate: AnalysisCapabilityBaselineAggregateV1 = {
    totalCases: cases.length,
    statusCounts,
    nullCount: statusCounts.null_no_supported_candidate,
    pathCoverage: {
      detected: cases.filter((item) => item.paths.detected !== null).length,
      surface: cases.filter((item) => item.paths.surface !== null).length,
      functional: cases.filter((item) => item.paths.functional !== null).length,
      delta: cases.filter((item) => item.paths.delta !== null).length,
    },
    normalization: {
      casesWithRecords: cases.filter((item) => item.paths.normalizationRecordCount > 0).length,
      recordCount: cases.reduce((sum, item) => sum + item.paths.normalizationRecordCount, 0),
    },
    candidates: {
      casesWithCandidates: cases.filter((item) => item.candidateCount > 0).length,
      totalCandidates: cases.reduce((sum, item) => sum + item.candidateCount, 0),
    },
    embryos: {
      casesWithEmbryos: cases.filter((item) => item.embryo.candidatesWithEmbryo > 0).length,
      candidatesWithEmbryos: cases.reduce((sum, item) => sum + item.embryo.candidatesWithEmbryo, 0),
    },
    composition: {
      casesWithFunctionalStatements: cases.filter(
        (item) => item.composition.candidatesWithFunctionalStatements > 0,
      ).length,
      candidatesWithFunctionalStatements: cases.reduce(
        (sum, item) => sum + item.composition.candidatesWithFunctionalStatements,
        0,
      ),
      casesWithComponents: cases.filter((item) => item.composition.candidatesWithComponents > 0).length,
      candidatesWithComponents: cases.reduce((sum, item) => sum + item.composition.candidatesWithComponents, 0),
      totalComponents: cases.reduce((sum, item) => sum + item.composition.totalComponents, 0),
      casesWithExpansionChains: cases.filter((item) => item.composition.candidatesWithExpansionChain > 0).length,
      candidatesWithExpansionChains: cases.reduce((sum, item) => sum + item.composition.candidatesWithExpansionChain, 0),
      casesWithCandidateVowelPaths: cases.filter((item) => item.composition.candidatesWithVowelPath > 0).length,
      candidatesWithCandidateVowelPaths: cases.reduce((sum, item) => sum + item.composition.candidatesWithVowelPath, 0),
    },
    evidence,
    targetSense: {
      casesWithRequestContext: cases.filter(
        (item) => item.request.targetSenseId !== null || item.request.targetSenseLabel !== null,
      ).length,
      candidateBindings: cases.reduce((sum, item) => sum + item.targetSense.candidateBindings.length, 0),
    },
    repeatability: {
      checkedCases: cases.filter((item) => item.repeatability.checked).length,
      stableCases: cases.filter((item) => item.repeatability.stable).length,
      allStable: cases.every((item) => item.repeatability.checked && item.repeatability.stable),
    },
    invariantFailures: cases.flatMap((item) =>
      item.invariants.failures.map((failure) => `${item.caseId}:${failure}`),
    ),
  };

  return aggregate;
}

export function buildAnalysisCapabilityBaselineV1(input: {
  manifest: AnalysisCapabilityBaselineManifestV1;
  cases: readonly AnalysisCapabilityBaselineCaseResultV1[];
}): AnalysisCapabilityBaselineV1 {
  assertCondition(
    input.cases.length === input.manifest.cases.length,
    "baseline cases do not match manifest case count",
  );
  input.manifest.cases.forEach((manifestCase, index) => {
    assertCondition(
      input.cases[index]?.caseId === manifestCase.caseId,
      `baseline case order mismatch at index ${index}`,
    );
  });

  const aggregate = aggregateAnalysisCapabilityBaselineV1(input.cases);
  return {
    schemaVersion: ANALYSIS_CAPABILITY_BASELINE_SCHEMA_VERSION_V1,
    corpusVersion: input.manifest.corpusVersion,
    generationMode: ANALYSIS_CAPABILITY_BASELINE_GENERATION_MODE_V1,
    fingerprintStrategy: ANALYSIS_CAPABILITY_BASELINE_FINGERPRINT_STRATEGY_V1,
    canonicalVoices: [...ANALYSIS_CAPABILITY_BASELINE_CANONICAL_VOICES_V1],
    engineVersions: [...new Set(input.cases.map((item) => item.engineVersion))],
    caseCount: input.cases.length,
    cases: input.cases,
    aggregate,
    valid: aggregate.invariantFailures.length === 0 && aggregate.repeatability.allStable,
  };
}

export function serializeAnalysisCapabilityBaselineV1(
  baseline: AnalysisCapabilityBaselineV1,
): string {
  return `${stableStringify(baseline)}\n`;
}

function parseBaselineCaseV1(
  value: unknown,
  index: number,
): AnalysisCapabilityBaselineCaseResultV1 {
  assertCondition(isRecord(value), `baseline.cases[${index}]: expected object`);
  assertOnlyKeys(
    value,
    [
      "caseId",
      "request",
      "normalizedWord",
      "engineVersion",
      "status",
      "nullResult",
      "paths",
      "candidateCount",
      "candidateIds",
      "candidates",
      "embryo",
      "composition",
      "evidence",
      "targetSense",
      "invariants",
      "fingerprint",
      "repeatability",
    ],
    `baseline.cases[${index}]`,
  );
  const caseId = requiredText(value.caseId, `baseline.cases[${index}].caseId`);
  const request = readRecord(value.request);
  assertCondition(
    requiredText(request.word, `baseline.cases[${index}].request.word`).length > 0,
    "request.word is required",
  );
  const status = requiredText(value.status, `baseline.cases[${index}].status`) as AnalysisStatusCodeV0_1;
  assertCondition(
    (ANALYSIS_CAPABILITY_BASELINE_STATUS_CODES_V1 as readonly string[]).includes(status),
    `baseline.cases[${index}].status: unsupported status '${status}'`,
  );
  assertCondition(typeof value.nullResult === "boolean", `baseline.cases[${index}].nullResult: expected boolean`);
  assertCondition(
    value.nullResult === (status === "null_no_supported_candidate"),
    `baseline.cases[${index}].nullResult: status mismatch`,
  );
  assertCondition(Array.isArray(value.candidates), `baseline.cases[${index}].candidates: expected array`);
  assertCondition(Array.isArray(value.candidateIds), `baseline.cases[${index}].candidateIds: expected array`);
  assertCondition(value.candidates.length === value.candidateIds.length, `baseline.cases[${index}]: candidate identity count mismatch`);
  assertCondition(value.candidateCount === value.candidates.length, `baseline.cases[${index}]: candidateCount mismatch`);
  assertCondition(isRecord(value.paths), `baseline.cases[${index}].paths: expected object`);
  assertCondition(isRecord(value.invariants), `baseline.cases[${index}].invariants: expected object`);
  assertCondition(isRecord(value.repeatability), `baseline.cases[${index}].repeatability: expected object`);
  assertCondition(value.invariants.providerExecutionObserved === false, `baseline.cases[${index}]: provider execution observed`);
  assertCondition(value.invariants.valid === true, `baseline.cases[${index}]: invalid invariants`);
  assertCondition(
    typeof value.fingerprint === "string" && /^[a-f0-9]{64}$/.test(value.fingerprint),
    `baseline.cases[${index}]: invalid fingerprint`,
  );
  assertCondition(value.repeatability.checked === true, `baseline.cases[${index}]: repeatability not checked`);
  assertCondition(value.repeatability.stable === true, `baseline.cases[${index}]: repeatability failed`);
  assertCondition(
    typeof value.repeatability.repeatedFingerprint === "string" &&
    /^[a-f0-9]{64}$/.test(value.repeatability.repeatedFingerprint),
    `baseline.cases[${index}]: invalid repeated fingerprint`,
  );
  assertCondition(
    value.fingerprint === value.repeatability.repeatedFingerprint,
    `baseline.cases[${index}]: repeated fingerprint does not match fingerprint`,
  );
  return value as unknown as AnalysisCapabilityBaselineCaseResultV1;
}

export function parseAnalysisCapabilityBaselineV1(
  input: string | unknown,
): AnalysisCapabilityBaselineV1 {
  let value: unknown = input;
  if (typeof input === "string") {
    try {
      value = JSON.parse(input);
    } catch {
      throw new Error("baseline: malformed JSON");
    }
  }

  assertCondition(isRecord(value), "baseline: expected object");
  assertOnlyKeys(
    value,
    [
      "schemaVersion",
      "corpusVersion",
      "generationMode",
      "fingerprintStrategy",
      "canonicalVoices",
      "engineVersions",
      "caseCount",
      "cases",
      "aggregate",
      "valid",
    ],
    "baseline",
  );
  assertCondition(
    value.schemaVersion === ANALYSIS_CAPABILITY_BASELINE_SCHEMA_VERSION_V1,
    `baseline.schemaVersion: expected '${ANALYSIS_CAPABILITY_BASELINE_SCHEMA_VERSION_V1}'`,
  );
  assertCondition(
    value.generationMode === ANALYSIS_CAPABILITY_BASELINE_GENERATION_MODE_V1,
    "baseline.generationMode: unsupported generation mode",
  );
  assertCondition(
    value.fingerprintStrategy === ANALYSIS_CAPABILITY_BASELINE_FINGERPRINT_STRATEGY_V1,
    "baseline.fingerprintStrategy: unsupported strategy",
  );
  assertCondition(
    Array.isArray(value.canonicalVoices) &&
      stableStringify(value.canonicalVoices) ===
        stableStringify(ANALYSIS_CAPABILITY_BASELINE_CANONICAL_VOICES_V1),
    "baseline.canonicalVoices: canonical Seven-Voice order mismatch",
  );
  assertCondition(
    Array.isArray(value.engineVersions) &&
      value.engineVersions.length > 0 &&
      value.engineVersions.every(
        (version) => typeof version === "string" && version.trim().length > 0,
      ),
    "baseline.engineVersions: expected non-empty string array",
  );
  assertCondition(Array.isArray(value.cases), "baseline.cases: expected array");
  assertCondition(value.caseCount === value.cases.length, "baseline.caseCount: mismatch");
  assertCondition(typeof value.valid === "boolean", "baseline.valid: expected boolean");

  const caseIds = new Set<string>();
  const cases = value.cases.map((item, index) => {
    const parsed = parseBaselineCaseV1(item, index);
    assertCondition(!caseIds.has(parsed.caseId), `baseline.cases: duplicate caseId '${parsed.caseId}'`);
    caseIds.add(parsed.caseId);
    return parsed;
  });
  assertCondition(isRecord(value.aggregate), "baseline.aggregate: expected object");
  const expectedAggregate = aggregateAnalysisCapabilityBaselineV1(cases);
  assertCondition(
    stableStringify(value.aggregate) === stableStringify(expectedAggregate),
    "baseline.aggregate: does not match case results",
  );
  assertCondition(!containsForbiddenBaselineKey(value), "baseline: forbidden field present");
  assertCondition(value.valid === (expectedAggregate.invariantFailures.length === 0 && expectedAggregate.repeatability.allStable), "baseline.valid: mismatch");

  return value as unknown as AnalysisCapabilityBaselineV1;
}
