/**
 * Local, research-only Fjalori → existing analyzer measurement.
 * This module is not imported by the application and never authorizes production AGENT.
 */
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { analyzeAlbanianAgentiveDefinitionV0_1 } from "../../src/shared/openInstrument/albanianAgentiveDefinitionAnalyzer.v0_1";
import type { AlbanianAgentiveDefinitionClassificationV0_1 } from "../../src/shared/openInstrument/albanianAgentiveDefinitionAnalyzer.v0_1";
import {
  getAlbanianOccupationalRoleCandidatesForWordV0_1,
  type AlbanianOccupationalRoleCandidateV0_1,
} from "../../src/shared/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1";

export const FJALORI_PHASE_2_SCHEMA_V0_1 =
  "open-instrument.fjalori-agentive-definition-phase2-report.v0_1" as const;
export const FJALORI_PHASE_2_EXPORT_SCHEMA_V0_1 =
  "open-instrument.fjalori-agentive-definition-export.v0_1" as const;
export const FJALORI_PHASE_2_EXPECTED_SHA256_V0_1 =
  "6c6c4f4db543ccdbc41d800efa5e141e1880807d5f7d48d1a33043bd2956c6b1" as const;
export const FJALORI_PHASE_2_EXPECTED_BYTES_V0_1 = 11_714_723 as const;
export const FJALORI_PHASE_2_EXPECTED_ROWS_V0_1 = 36_407 as const;
export const FJALORI_PHASE_2_SOURCE_IDENTITY_V0_1 =
  "Fjalori Shqip; Hugging Face dataset akadriu/fjalori-shqip; data/train-00000-of-00001.parquet" as const;
export const KAIKKI_PHASE_2_EXPECTED_SHA256_V0_1 =
  "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc" as const;
export const KAIKKI_PHASE_2_EXPECTED_BYTES_V0_1 = 67_438_537 as const;
export const FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1 = ["shqiptar", "gjitar", "gjueti", "kombëtar"] as const;

const EXPECTED_FJALORI_COLUMNS_V0_1 = [
  "word",
  "full_header",
  "syntactic_tag",
  "sem_tag_1",
  "sem_tag_2",
  "sem_tag_3",
  "definition",
  "senses",
  "num_senses",
] as const;

export type FjaloriSourceRowV0_1 = Readonly<{
  physicalRowOrdinal: number;
  normalizedWord: string;
  word: string;
  full_header: string;
  syntactic_tag: string | null;
  sem_tag_1: string | null;
  sem_tag_2: string | null;
  sem_tag_3: string | null;
  definition: string;
  senses: readonly string[];
  num_senses: number;
}>;

export type FjaloriExportV0_1 = Readonly<{
  schemaVersion: typeof FJALORI_PHASE_2_EXPORT_SCHEMA_V0_1;
  source: Readonly<{
    sourceIdentity: string;
    artifactSha256: string;
    artifactBytes: number;
    recordCount: number;
    columns: readonly string[];
  }>;
  scanSummary: Readonly<{
    sourceRowsScanned: number;
    uniqueExactWordCount: number;
    uniqueNfcCasefoldWordCount: number;
    duplicateFullRecordCount: number;
    duplicateNormalizedHeadwordRowCount: number;
    nullCountsByColumn: Readonly<Record<string, number>>;
    numSensesZeroRowCount: number;
    multipleStructuredSenseRowCount: number;
  }>;
  candidateMatchSummary: Readonly<{
    candidateSenseCount: number;
    uniqueCandidateLemmaCount: number;
    exactLemmaMatchedCount: number;
    matchedCandidateSenseCount: number;
    missingCandidateLemmas: readonly string[];
  }>;
  candidateMatches: readonly Readonly<{
    candidateId: string;
    targetLemma: string;
    normalizedLemma: string;
    matchedPhysicalRowOrdinals: readonly number[];
  }>[];
  matchedRows: readonly FjaloriSourceRowV0_1[];
  negativeControlMatches: readonly Readonly<{
    targetLemma: typeof FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1[number];
    normalizedLemma: string;
    matchedPhysicalRowOrdinals: readonly number[];
  }>[];
  negativeControlRows: readonly FjaloriSourceRowV0_1[];
}>;

export type KaikkiNegativeControlRecordV0_1 = Readonly<{
  lemma: typeof FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1[number];
  sourceRecordId: string;
  rawEntryId: string | null;
  physicalRecordOrdinal: number;
  matchOrdinal: number;
  entryLocator: string;
  language: string;
  languageCode: string;
  partOfSpeech: string | null;
  senses: readonly Readonly<{
    senseOrdinal: number;
    senseId: string | null;
    glosses: readonly string[];
    categories: readonly Readonly<{ name: string; orig: string | null; langcode: string | null }>[];
  }>[];
  sourceDerivedForms: readonly Readonly<{ word: string | null; languageCode: string | null }>[];
  etymologyLinks: readonly (readonly [string, string])[];
  etymologyTemplates: readonly Readonly<{ name: string; expansion: string | null }>[];
}>;

export type DefinitionUnitEvaluationV0_1 = Readonly<{
  physicalRowOrdinal: number;
  sourceField: "senses" | "definition";
  unitOrdinal: number;
  sourceUnitText: string;
  originalUnitUtf16Length: number;
  analyzerInputStartUtf16Offset: number;
  analyzerInputText: string;
  posTag: string | null;
  semanticTags: readonly (string | null)[];
  analyzerClassification: AlbanianAgentiveDefinitionClassificationV0_1;
  matchedPattern: string | null;
  reasonCodes: readonly string[];
  evidenceSpanLocation: Readonly<{
    field: "senses" | "definition";
    unitOrdinal: number;
    startUtf16Offset: number;
    endUtf16Offset: number;
    excerpt: string;
  }> | null;
}>;

export type FjaloriCandidateEvaluationV0_1 = Readonly<{
  candidateId: string;
  candidateStatus: AlbanianOccupationalRoleCandidateV0_1["candidateStatus"];
  targetLemma: string;
  kaikkiSourceRecordId: string;
  kaikkiSenseId: string;
  kaikkiPhysicalRecordOrdinal: number;
  kaikkiSenseOrdinal: number;
  kaikkiPartOfSpeech: string | null;
  kaikkiGlosses: readonly string[];
  kaikkiPronunciationIpa: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["pronunciationIpa"];
  kaikkiCategories: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["categories"];
  suffixDiscoveryMatches: AlbanianOccupationalRoleCandidateV0_1["suffixDiscoveryMatches"];
  sourceDerivedRelations: AlbanianOccupationalRoleCandidateV0_1["sourceDerivedRelations"];
  ontology: AlbanianOccupationalRoleCandidateV0_1["ontology"];
  targetEtymologyLinks: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["etymologyLinks"];
  targetEtymologyTemplates: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["etymologyTemplates"];
  existingManifestHypothesisStatus: string | null;
  existingManifestHypothesis: AlbanianOccupationalRoleCandidateV0_1["researchHypothesis"];
  existingFunctionalOperation: null;
  existingProductionAuthorization: "NOT_AUTHORIZED";
  embryoFunction: "UNKNOWN_OR_NULL";
  historicalRelation: "NOT_CLAIMED";
  fjaloriMatchStatus: "FORM_NOT_FOUND" | "FORM_FOUND";
  fjaloriPhysicalRowOrdinals: readonly number[];
  fjaloriSourceRows: readonly FjaloriSourceRowV0_1[];
  fjaloriSenseAlignmentStatus: "NO_FORM_MATCH" | "FORM_FOUND_SENSE_UNRESOLVED" | "AMBIGUOUS_MULTISENSE";
  definitionEvidenceStatus:
    | "DEFINITION_INSUFFICIENT"
    | "HUMAN_AGENT_EVIDENCE_OBSERVED"
    | "NON_AGENTIVE_EVIDENCE_OBSERVED"
    | "AMBIGUOUS_MULTISENSE"
    | "SOURCE_UNAVAILABLE";
  fjaloriPosTags: readonly (string | null)[];
  definitionUnitEvaluations: readonly DefinitionUnitEvaluationV0_1[];
  analyzerClassification:
    | "HUMAN_AGENT_ROLE"
    | "NON_AGENTIVE_EVIDENCE_OBSERVED"
    | "UNKNOWN_OR_NULL"
    | "CONFLICTING_OR_MULTIPLE_UNITS";
  existingAgentStatus: "NOT_REEVALUATED_IN_FJALORI_PHASE2";
  newResearchEligibilityStatus:
    | "NOT_ELIGIBLE_FORM_NOT_FOUND"
    | "NOT_ELIGIBLE_NO_SOURCE_DERIVED_RELATION"
    | "NOT_ELIGIBLE_NO_HUMAN_AGENT_EVIDENCE"
    | "NOT_ELIGIBLE_CONFLICTING_OR_MULTIPLE_UNITS"
    | "NOT_ELIGIBLE_CROSS_SOURCE_SENSE_ALIGNMENT_UNRESOLVED";
  candidateReviewStatus: "POTENTIAL_AGENT_REVIEW_TARGET" | "NOT_A_POTENTIAL_AGENT_REVIEW_TARGET";
  functionalOperation: null;
  productionAuthorization: "NOT_AUTHORIZED";
  noSingleWinner: true;
  userDecisionPosture: "user_decides";
  ambiguity: Readonly<{
    candidateSenseCountForLemma: number;
    fjaloriRowCount: number;
    definitionUnitCount: number;
    hasMultipleKaikkiSenses: boolean;
    hasMultipleFjaloriRows: boolean;
    hasMultipleDefinitionUnits: boolean;
    hasConflictingAnalyzerClassifications: boolean;
    codes: readonly string[];
  }>;
  reasonCodes: readonly string[];
  claimBoundary: string;
}>;

export type FjaloriPhase2ReportV0_1 = Readonly<{
  schemaVersion: typeof FJALORI_PHASE_2_SCHEMA_V0_1;
  evidenceClassifications: readonly ["FACT", "INFERENCE", "HYPOTHESIS", "UNKNOWN_OR_NULL"];
  analyzer: Readonly<{
    module: "src/shared/openInstrument/albanianAgentiveDefinitionAnalyzer.v0_1.ts";
    authority: "ANALYZER_DERIVED_NOT_SOURCE_AUTHORED";
  }>;
  fjalori: FjaloriExportV0_1["source"] & FjaloriExportV0_1["scanSummary"];
  kaikki: Readonly<{
    sourceProfileId: string;
    artifactSha256: string;
    artifactBytes: number;
    physicalRowsScanned: number;
    candidateSourceRecordAndSenseIdentitiesVerified: number;
    sourceDerivedRelationsVerified: number;
  }>;
  candidateBatch: Readonly<{
    candidateSenseCount: number;
    uniqueLemmaCount: number;
    sourceOccupationCategorySenseCount: number;
    existingResearchHypothesisCount: number;
  }>;
  metrics: Readonly<{
    A_totalCandidateSensesEvaluated: number;
    B_exactFjaloriLemmaMatchedCandidateSenses: number;
    B_uniqueExactFjaloriLemmaMatches: number;
    C_sharedSourceSenseIdAlignedMatches: number;
    D_distinctDefinitionUnitsEvaluated: number;
    E_humanAgentRoleUnitOutputs: number;
    F_humanAgentCandidateSensesWithUnresolvedAlignment: number;
    G_definitivelyNonAgentiveUnitClassifications: number;
    H_unknownOrNullUnitOutputs: number;
    I_priorAgentBaselineSensesWithCrossSourceSenseIdCorroboration: number;
    I_priorAgentBaselineSenseIdentityDetailAvailable: false;
    J_additionalResearchEligibleTargetSenses: number;
    J_potentialAgentReviewTargetsWithoutSenseAlignment: number;
    K_casesNeedingSynonymResolution: number;
    L_distinctDefinitionUnitsNeedingAnalyzerRuleReview: number;
    M_distinctCandidateSenses: number;
    M_distinctCandidateLemmas: number;
  }>;
  priorMeasuredKaikkiOnlyBaseline: Readonly<{
    exploratoryAgentTargetSenseCount: 11;
    agentRelationshipOutputCount: 14;
    source: "PR #2257 post-merge measurement report";
    reexecutedInThisRun: false;
  }>;
  reproducibility: Readonly<{
    repositoryCommit: string;
    command: string;
    runnerVersion: "0.1.0";
    analyzerArtifactSha256: string;
    candidateBatchSha256: string;
    candidateBatchBytes: number;
    fjaloriSourcePath: string;
    kaikkiSourcePath: string;
    fjaloriDatasetCardLicense: "CC BY 4.0 listed; original-dictionary rights not independently adjudicated here";
    fjaloriAttribution: "Fjalori Shqip; Hugging Face dataset akadriu/fjalori-shqip";
  }>;
  candidateResults: readonly FjaloriCandidateEvaluationV0_1[];
  negativeControlResults: readonly Readonly<{
    targetLemma: typeof FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1[number];
    candidateBatchMembership: "NOT_IN_30_SENSE_BATCH";
    kaikkiRecords: readonly KaikkiNegativeControlRecordV0_1[];
    fjaloriMatchStatus: "FORM_NOT_FOUND" | "FORM_FOUND";
    fjaloriPhysicalRowOrdinals: readonly number[];
    fjaloriSourceRows: readonly FjaloriSourceRowV0_1[];
    definitionUnitEvaluations: readonly DefinitionUnitEvaluationV0_1[];
    functionalOperation: null;
    productionAuthorization: "NOT_AUTHORIZED";
    reasonCodes: readonly string[];
  }>[];
  negativeControlSummary: Readonly<{
    targetFormCount: number;
    verifiedKaikkiRecordCount: number;
    exactFjaloriFormMatchCount: number;
    definitionUnitCount: number;
    humanAgentAnalyzerOutputCount: number;
    nonAgentAnalyzerOutputCount: number;
    unknownOrNullAnalyzerOutputCount: number;
  }>;
  productionBehaviorChanged: false;
  claimBoundary: string;
}>;

export function normalizeAlbanianLexicalFormV0_1(value: string): string {
  return value.normalize("NFC").toLocaleLowerCase("sq-AL");
}

export function verifyArtifactDigestV0_1(
  bytes: Uint8Array,
  expectedByteCount: number,
  expectedSha256: string,
): Readonly<{ actualByteCount: number; actualSha256: string; valid: boolean }> {
  const actualSha256 = createHash("sha256").update(bytes).digest("hex");
  return Object.freeze({
    actualByteCount: bytes.byteLength,
    actualSha256,
    valid: bytes.byteLength === expectedByteCount && actualSha256 === expectedSha256,
  });
}

function assertFjaloriExportV0_1(
  value: FjaloriExportV0_1,
  candidates: readonly AlbanianOccupationalRoleCandidateV0_1[],
): void {
  if (
    value.schemaVersion !== FJALORI_PHASE_2_EXPORT_SCHEMA_V0_1 ||
    value.source.sourceIdentity !== FJALORI_PHASE_2_SOURCE_IDENTITY_V0_1 ||
    value.source.artifactSha256 !== FJALORI_PHASE_2_EXPECTED_SHA256_V0_1 ||
    value.source.artifactBytes !== FJALORI_PHASE_2_EXPECTED_BYTES_V0_1 ||
    value.source.recordCount !== FJALORI_PHASE_2_EXPECTED_ROWS_V0_1 ||
    value.scanSummary.sourceRowsScanned !== FJALORI_PHASE_2_EXPECTED_ROWS_V0_1 ||
    JSON.stringify(value.source.columns) !== JSON.stringify(EXPECTED_FJALORI_COLUMNS_V0_1) ||
    value.candidateMatches.length !== candidates.length ||
    value.negativeControlMatches.length !== FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1.length
  ) {
    throw new Error("FJALORI_EXPORT_SOURCE_IDENTITY_OR_SCHEMA_INVALID");
  }
  const expectedCandidateById = new Map(candidates.map((candidate) => [candidate.candidateId, candidate]));
  const candidateKeys = new Set(candidates.map((candidate) => normalizeAlbanianLexicalFormV0_1(candidate.sourceRecord.lemma)));
  const actualCandidateIds = new Set<string>();
  const ordinalsByWord = new Map<string, number[]>();
  let previousOrdinal = -1;
  for (const row of value.matchedRows) {
    if (
      !Number.isSafeInteger(row.physicalRowOrdinal) ||
      row.physicalRowOrdinal <= previousOrdinal ||
      row.physicalRowOrdinal < 0 ||
      row.physicalRowOrdinal >= value.source.recordCount ||
      row.normalizedWord !== normalizeAlbanianLexicalFormV0_1(row.word) ||
      !candidateKeys.has(row.normalizedWord) ||
      typeof row.full_header !== "string" ||
      (row.syntactic_tag !== null && typeof row.syntactic_tag !== "string") ||
      [row.sem_tag_1, row.sem_tag_2, row.sem_tag_3].some((tag) => tag !== null && typeof tag !== "string") ||
      typeof row.definition !== "string" ||
      !Array.isArray(row.senses) || row.senses.some((sense) => typeof sense !== "string") ||
      !Number.isSafeInteger(row.num_senses) || row.num_senses < 0
    ) {
      throw new Error("FJALORI_EXPORT_ROW_IDENTITY_OR_ORDER_INVALID");
    }
    const ordinals = ordinalsByWord.get(row.normalizedWord) ?? [];
    ordinals.push(row.physicalRowOrdinal);
    ordinalsByWord.set(row.normalizedWord, ordinals);
    previousOrdinal = row.physicalRowOrdinal;
  }
  for (const match of value.candidateMatches) {
    const candidate = expectedCandidateById.get(match.candidateId);
    const expectedLemma = candidate?.sourceRecord.lemma;
    const expectedKey = expectedLemma === undefined ? null : normalizeAlbanianLexicalFormV0_1(expectedLemma);
    if (
      !candidate || actualCandidateIds.has(match.candidateId) ||
      match.targetLemma !== expectedLemma || match.normalizedLemma !== expectedKey ||
      JSON.stringify(match.matchedPhysicalRowOrdinals) !== JSON.stringify(ordinalsByWord.get(expectedKey!) ?? [])
    ) {
      throw new Error(`FJALORI_CANDIDATE_MATCH_INDEX_INVALID:${match.candidateId}`);
    }
    actualCandidateIds.add(match.candidateId);
  }
  if (actualCandidateIds.size !== candidates.length) throw new Error("FJALORI_CANDIDATE_MATCH_INDEX_INCOMPLETE");

  const controlKeys = new Set(FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1.map(normalizeAlbanianLexicalFormV0_1));
  const controlRowsByKey = new Map<string, number[]>();
  previousOrdinal = -1;
  for (const row of value.negativeControlRows) {
    if (
      !Number.isSafeInteger(row.physicalRowOrdinal) || row.physicalRowOrdinal <= previousOrdinal ||
      row.physicalRowOrdinal < 0 || row.physicalRowOrdinal >= value.source.recordCount ||
      row.normalizedWord !== normalizeAlbanianLexicalFormV0_1(row.word) ||
      !controlKeys.has(row.normalizedWord) || typeof row.definition !== "string" ||
      !Array.isArray(row.senses) || row.senses.some((sense) => typeof sense !== "string")
    ) {
      throw new Error("FJALORI_NEGATIVE_CONTROL_ROW_IDENTITY_OR_ORDER_INVALID");
    }
    const ordinals = controlRowsByKey.get(row.normalizedWord) ?? [];
    ordinals.push(row.physicalRowOrdinal);
    controlRowsByKey.set(row.normalizedWord, ordinals);
    previousOrdinal = row.physicalRowOrdinal;
  }
  FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1.forEach((lemma, index) => {
    const match = value.negativeControlMatches[index];
    const key = normalizeAlbanianLexicalFormV0_1(lemma);
    if (
      !match || match.targetLemma !== lemma || match.normalizedLemma !== key ||
      JSON.stringify(match.matchedPhysicalRowOrdinals) !== JSON.stringify(controlRowsByKey.get(key) ?? [])
    ) {
      throw new Error(`FJALORI_NEGATIVE_CONTROL_MATCH_INDEX_INVALID:${lemma}`);
    }
  });
  const matchedCandidateCount = value.candidateMatches.filter((match) => match.matchedPhysicalRowOrdinals.length > 0).length;
  const matchedLemmaCount = new Set(value.candidateMatches
    .filter((match) => match.matchedPhysicalRowOrdinals.length > 0)
    .map((match) => match.normalizedLemma)).size;
  const missingLemmas = value.candidateMatches
    .filter((match) => match.matchedPhysicalRowOrdinals.length === 0)
    .map((match) => match.targetLemma);
  if (
    value.candidateMatchSummary.candidateSenseCount !== candidates.length ||
    value.candidateMatchSummary.uniqueCandidateLemmaCount !== candidateKeys.size ||
    value.candidateMatchSummary.matchedCandidateSenseCount !== matchedCandidateCount ||
    value.candidateMatchSummary.exactLemmaMatchedCount !== matchedLemmaCount ||
    JSON.stringify(value.candidateMatchSummary.missingCandidateLemmas) !== JSON.stringify(missingLemmas)
  ) {
    throw new Error("FJALORI_CANDIDATE_MATCH_SUMMARY_INVALID");
  }
}

function escapedRegExpV0_1(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function startsWithMetadataTokenV0_1(text: string, token: string, offset: number): number | null {
  const candidate = token.trim();
  if (!candidate) return null;
  const remaining = text.slice(offset);
  const tokenRegex = new RegExp(`^${escapedRegExpV0_1(candidate)}(?=\\s)`, "u");
  const match = tokenRegex.exec(remaining);
  if (!match) return null;
  let nextOffset = offset + match[0].length;
  while (/\s/u.test(text[nextOffset] ?? "")) nextOffset += 1;
  return nextOffset;
}

function extractAnalyzerInputV0_1(
  row: FjaloriSourceRowV0_1,
  sourceText: string,
  field: "senses" | "definition",
): Readonly<{ text: string; startOffset: number }> {
  let startOffset = 0;
  while (/\s/u.test(sourceText[startOffset] ?? "")) startOffset += 1;
  if (field === "senses") {
    const ordinalPrefix = /^\d+\.\s*/u.exec(sourceText.slice(startOffset));
    if (ordinalPrefix) startOffset += ordinalPrefix[0].length;
  }

  const posTag = row.syntactic_tag?.trim() ?? "";
  const afterPos = posTag ? startsWithMetadataTokenV0_1(sourceText, posTag, startOffset) : null;
  if (afterPos !== null) {
    startOffset = afterPos;
    const pluralMarker = startsWithMetadataTokenV0_1(sourceText, "sh.", startOffset);
    if (pluralMarker !== null) startOffset = pluralMarker;
  }

  for (const semanticTag of [row.sem_tag_1, row.sem_tag_2, row.sem_tag_3]) {
    const afterTag = semanticTag ? startsWithMetadataTokenV0_1(sourceText, semanticTag, startOffset) : null;
    if (afterTag !== null) startOffset = afterTag;
  }
  while (/\s/u.test(sourceText[startOffset] ?? "")) startOffset += 1;
  let endOffset = sourceText.length;
  while (endOffset > startOffset && /\s/u.test(sourceText[endOffset - 1] ?? "")) endOffset -= 1;
  return Object.freeze({ text: sourceText.slice(startOffset, endOffset), startOffset });
}

export function buildFjaloriDefinitionUnitsV0_1(row: FjaloriSourceRowV0_1): readonly Readonly<{
  sourceField: "senses" | "definition";
  unitOrdinal: number;
  text: string;
  analyzerInput: string;
  analyzerInputStartUtf16Offset: number;
}>[] {
  const sourceField = row.senses.length > 0 ? "senses" : "definition";
  const sourceUnits = row.senses.length > 0
    ? row.senses.map((text, unitOrdinal) => ({ text, unitOrdinal, sourceField: "senses" as const }))
    : [{ text: row.definition, unitOrdinal: 0, sourceField: "definition" as const }];
  return Object.freeze(sourceUnits.map((unit) => {
    const extracted = extractAnalyzerInputV0_1(row, unit.text, unit.sourceField);
    return Object.freeze({
      sourceField: unit.sourceField,
      unitOrdinal: unit.unitOrdinal,
      text: unit.text,
      analyzerInput: extracted.text,
      analyzerInputStartUtf16Offset: extracted.startOffset,
    });
  }));
}

function evaluateDefinitionUnitV0_1(
  row: FjaloriSourceRowV0_1,
  unit: ReturnType<typeof buildFjaloriDefinitionUnitsV0_1>[number],
): DefinitionUnitEvaluationV0_1 {
  const result = analyzeAlbanianAgentiveDefinitionV0_1({
    headword: row.word,
    definitionText: unit.analyzerInput,
    posTag: row.syntactic_tag,
    sourceRowOrdinal: row.physicalRowOrdinal,
  });
  const span = result.evidenceSpan;
  const evidenceSpanLocation = span
    ? Object.freeze({
        field: unit.sourceField,
        unitOrdinal: unit.unitOrdinal,
        startUtf16Offset: unit.analyzerInputStartUtf16Offset + span.start,
        endUtf16Offset: unit.analyzerInputStartUtf16Offset + span.end,
        excerpt: unit.text.slice(span.start + unit.analyzerInputStartUtf16Offset, span.end + unit.analyzerInputStartUtf16Offset),
      })
    : null;
  return Object.freeze({
    physicalRowOrdinal: row.physicalRowOrdinal,
    sourceField: unit.sourceField,
    unitOrdinal: unit.unitOrdinal,
    sourceUnitText: unit.text,
    originalUnitUtf16Length: unit.text.length,
    analyzerInputStartUtf16Offset: unit.analyzerInputStartUtf16Offset,
    analyzerInputText: unit.analyzerInput,
    posTag: row.syntactic_tag,
    semanticTags: Object.freeze([row.sem_tag_1, row.sem_tag_2, row.sem_tag_3]),
    analyzerClassification: result.classification,
    matchedPattern: result.matchedPattern,
    reasonCodes: result.reasonCodes,
    evidenceSpanLocation,
  });
}

function sourceRelationEvidenceV0_1(candidate: AlbanianOccupationalRoleCandidateV0_1): Readonly<{
  sourceDerivedRelations: AlbanianOccupationalRoleCandidateV0_1["sourceDerivedRelations"];
  targetEtymologyLinks: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["etymologyLinks"];
  targetEtymologyTemplates: AlbanianOccupationalRoleCandidateV0_1["sourceRecord"]["etymologyTemplates"];
}> {
  return Object.freeze({
    sourceDerivedRelations: candidate.sourceDerivedRelations,
    targetEtymologyLinks: candidate.sourceRecord.etymologyLinks,
    targetEtymologyTemplates: candidate.sourceRecord.etymologyTemplates,
  });
}

function summarizeCandidateAnalyzerV0_1(
  units: readonly DefinitionUnitEvaluationV0_1[],
): FjaloriCandidateEvaluationV0_1["analyzerClassification"] {
  const classes = new Set(units.map((unit) => unit.analyzerClassification));
  if (units.length > 1) return "CONFLICTING_OR_MULTIPLE_UNITS";
  const hasAgent = classes.has("HUMAN_AGENT_ROLE");
  const nonAgentClasses = [...classes].filter((item) =>
    item !== "HUMAN_AGENT_ROLE" && item !== "UNKNOWN_OR_NULL",
  );
  if (hasAgent && nonAgentClasses.length > 0) return "CONFLICTING_OR_MULTIPLE_UNITS";
  if (hasAgent) return "HUMAN_AGENT_ROLE";
  if (nonAgentClasses.length === 1 && classes.size === 1) return "NON_AGENTIVE_EVIDENCE_OBSERVED";
  if (nonAgentClasses.length > 0) return "CONFLICTING_OR_MULTIPLE_UNITS";
  return "UNKNOWN_OR_NULL";
}

export function buildFjaloriPhase2ReportV0_1(input: Readonly<{
  candidates: readonly AlbanianOccupationalRoleCandidateV0_1[];
  fjaloriExport: FjaloriExportV0_1;
  verifiedKaikkiCandidateIds: ReadonlySet<string>;
  verifiedNegativeControlRecords?: readonly KaikkiNegativeControlRecordV0_1[];
  kaikkiPhysicalRowsScanned: number;
  verifiedKaikkiDerivedRelationCount: number;
  repositoryCommit: string;
  command: string;
  fjaloriSourcePath: string;
  kaikkiSourcePath: string;
  analyzerArtifactSha256: string;
  candidateBatchSha256: string;
  candidateBatchBytes: number;
}>): FjaloriPhase2ReportV0_1 {
  assertFjaloriExportV0_1(input.fjaloriExport, input.candidates);
  if (input.verifiedKaikkiCandidateIds.size !== input.candidates.length) {
    throw new Error("KAIKKI_CANDIDATE_SOURCE_IDENTITIES_NOT_VERIFIED");
  }
  if (new Set(input.candidates.map((candidate) => candidate.candidateId)).size !== input.candidates.length) {
    throw new Error("KAIKKI_CANDIDATE_IDS_NOT_UNIQUE");
  }
  const candidateKeysByLemma = new Map<string, number>();
  for (const candidate of input.candidates) {
    const key = normalizeAlbanianLexicalFormV0_1(candidate.sourceRecord.lemma);
    candidateKeysByLemma.set(key, (candidateKeysByLemma.get(key) ?? 0) + 1);
  }
  const exportedMatchByCandidate = new Map(input.fjaloriExport.candidateMatches.map((item) => [item.candidateId, item]));
  const rowsByNormalizedWord = new Map<string, FjaloriSourceRowV0_1[]>();
  for (const row of input.fjaloriExport.matchedRows) {
    const existing = rowsByNormalizedWord.get(row.normalizedWord) ?? [];
    existing.push(row);
    rowsByNormalizedWord.set(row.normalizedWord, existing);
  }
  const unitEvaluationsBySourceIdentity = new Map<string, DefinitionUnitEvaluationV0_1>();
  const rowUnitsByOrdinal = new Map<number, readonly DefinitionUnitEvaluationV0_1[]>();

  for (const row of input.fjaloriExport.matchedRows) {
    const units = buildFjaloriDefinitionUnitsV0_1(row).map((unit) => evaluateDefinitionUnitV0_1(row, unit));
    rowUnitsByOrdinal.set(row.physicalRowOrdinal, Object.freeze(units));
    for (const unit of units) {
      unitEvaluationsBySourceIdentity.set(`${unit.physicalRowOrdinal}:${unit.sourceField}:${unit.unitOrdinal}`, unit);
    }
  }

  const candidateResults = input.candidates.map((candidate): FjaloriCandidateEvaluationV0_1 => {
    if (!input.verifiedKaikkiCandidateIds.has(candidate.candidateId)) {
      throw new Error(`KAIKKI_CANDIDATE_IDENTITY_NOT_VERIFIED:${candidate.candidateId}`);
    }
    const key = normalizeAlbanianLexicalFormV0_1(candidate.sourceRecord.lemma);
    const matchIndex = exportedMatchByCandidate.get(candidate.candidateId);
    if (!matchIndex || matchIndex.normalizedLemma !== key || matchIndex.targetLemma !== candidate.sourceRecord.lemma) {
      throw new Error(`FJALORI_CANDIDATE_MATCH_INDEX_INVALID:${candidate.candidateId}`);
    }
    const rows = rowsByNormalizedWord.get(key) ?? [];
    const rowOrdinals = rows.map((row) => row.physicalRowOrdinal);
    if (JSON.stringify(rowOrdinals) !== JSON.stringify(matchIndex.matchedPhysicalRowOrdinals)) {
      throw new Error(`FJALORI_ROW_JOIN_IDENTITY_INVALID:${candidate.candidateId}`);
    }
    const definitionUnits = rows.flatMap((row) => rowUnitsByOrdinal.get(row.physicalRowOrdinal) ?? []);
    const humanUnits = definitionUnits.filter((unit) => unit.analyzerClassification === "HUMAN_AGENT_ROLE");
    const nonAgentUnits = definitionUnits.filter((unit) =>
      unit.analyzerClassification !== "HUMAN_AGENT_ROLE" && unit.analyzerClassification !== "UNKNOWN_OR_NULL",
    );
    const hasConflict = humanUnits.length > 0 && nonAgentUnits.length > 0;
    const candidateSenseCount = candidateKeysByLemma.get(key) ?? 0;
    const multipleCandidateSenses = candidateSenseCount > 1;
    const multipleRows = rows.length > 1;
    const multipleUnits = definitionUnits.length > 1;
    const ambiguityCodes = [
      ...(multipleCandidateSenses ? ["MULTIPLE_KAIKKI_SENSE_IDS_FOR_LEMMA"] : []),
      ...(multipleRows ? ["MULTIPLE_FJALORI_SOURCE_ROWS_FOR_LEMMA"] : []),
      ...(multipleUnits ? ["MULTIPLE_FJALORI_DEFINITION_UNITS"] : []),
      ...(hasConflict ? ["CONFLICTING_AGENT_AND_NON_AGENT_CLASSIFICATIONS"] : []),
      ...(rows.length > 0 ? ["FJALORI_HAS_NO_SHARED_KAIKKI_SENSE_ID"] : []),
    ];
    const senseAlignmentStatus = rows.length === 0
      ? "NO_FORM_MATCH" as const
      : multipleCandidateSenses || multipleRows || multipleUnits
        ? "AMBIGUOUS_MULTISENSE" as const
        : "FORM_FOUND_SENSE_UNRESOLVED" as const;
    const candidateClassification = summarizeCandidateAnalyzerV0_1(definitionUnits);
    const definitionEvidenceStatus: FjaloriCandidateEvaluationV0_1["definitionEvidenceStatus"] =
      rows.length > 0 && (multipleCandidateSenses || multipleRows || multipleUnits)
        ? "AMBIGUOUS_MULTISENSE"
        : humanUnits.length > 0
          ? "HUMAN_AGENT_EVIDENCE_OBSERVED"
          : nonAgentUnits.length > 0
            ? "NON_AGENTIVE_EVIDENCE_OBSERVED"
            : "DEFINITION_INSUFFICIENT";
    const directDerivedWitness = candidate.sourceDerivedRelations.length > 0;
    let eligibility: FjaloriCandidateEvaluationV0_1["newResearchEligibilityStatus"];
    let candidateReviewStatus: FjaloriCandidateEvaluationV0_1["candidateReviewStatus"] = "NOT_A_POTENTIAL_AGENT_REVIEW_TARGET";
    if (rows.length === 0) {
      eligibility = "NOT_ELIGIBLE_FORM_NOT_FOUND";
    } else if (!directDerivedWitness) {
      eligibility = "NOT_ELIGIBLE_NO_SOURCE_DERIVED_RELATION";
    } else if (humanUnits.length === 0) {
      eligibility = "NOT_ELIGIBLE_NO_HUMAN_AGENT_EVIDENCE";
    } else if (hasConflict || candidateClassification === "CONFLICTING_OR_MULTIPLE_UNITS") {
      eligibility = "NOT_ELIGIBLE_CONFLICTING_OR_MULTIPLE_UNITS";
    } else if (multipleCandidateSenses || multipleRows || multipleUnits || senseAlignmentStatus !== "FORM_FOUND_SENSE_UNRESOLVED") {
      eligibility = "NOT_ELIGIBLE_CROSS_SOURCE_SENSE_ALIGNMENT_UNRESOLVED";
    } else if (senseAlignmentStatus === "FORM_FOUND_SENSE_UNRESOLVED") {
      eligibility = "NOT_ELIGIBLE_CROSS_SOURCE_SENSE_ALIGNMENT_UNRESOLVED";
      candidateReviewStatus = "POTENTIAL_AGENT_REVIEW_TARGET";
    } else {
      eligibility = "NOT_ELIGIBLE_CROSS_SOURCE_SENSE_ALIGNMENT_UNRESOLVED";
    }
    const reasonCodes = [
      ...(rows.length === 0 ? ["FJALORI_EXACT_FORM_NOT_FOUND"] : []),
      ...(rows.length > 0 ? ["FJALORI_FORM_MATCH_DOES_NOT_ESTABLISH_SENSE_IDENTITY"] : []),
      ...(candidate.sourceDerivedRelations.length === 0 ? ["NO_BASE_SIDE_SOURCE_DERIVED_RELATION"] : []),
      ...(humanUnits.length === 0 ? ["NO_HUMAN_AGENT_ROLE_ANALYSIS_RESULT"] : []),
      ...(hasConflict ? ["CONFLICTING_DEFINITION_UNIT_CLASSIFICATIONS"] : []),
      ...(multipleCandidateSenses ? ["KAIKKI_TARGET_LEMMA_HAS_MULTIPLE_CANDIDATE_SENSES"] : []),
      ...(multipleRows ? ["FJALORI_TARGET_LEMMA_HAS_MULTIPLE_ROWS"] : []),
      ...(multipleUnits ? ["FJALORI_TARGET_LEMMA_HAS_MULTIPLE_DEFINITION_UNITS"] : []),
      ...(rows.length > 0 ? ["FJALORI_HAS_NO_SENSE_ID_FOR_CROSS_SOURCE_ALIGNMENT"] : []),
      ...(candidateReviewStatus === "POTENTIAL_AGENT_REVIEW_TARGET" ? ["POTENTIAL_AGENT_REVIEW_TARGET_ONLY_NO_SENSE_ALIGNMENT"] : []),
    ];
    const relationEvidence = sourceRelationEvidenceV0_1(candidate);
    return Object.freeze({
      candidateId: candidate.candidateId,
      candidateStatus: candidate.candidateStatus,
      targetLemma: candidate.sourceRecord.lemma,
      kaikkiSourceRecordId: candidate.sourceRecordId,
      kaikkiSenseId: candidate.senseId,
      kaikkiPhysicalRecordOrdinal: candidate.sourceRecord.physicalRecordOrdinal,
      kaikkiSenseOrdinal: candidate.sourceRecord.senseOrdinal,
      kaikkiPartOfSpeech: candidate.sourceRecord.partOfSpeech,
      kaikkiGlosses: candidate.sourceRecord.glosses,
      kaikkiPronunciationIpa: candidate.sourceRecord.pronunciationIpa,
      kaikkiCategories: candidate.sourceRecord.categories,
      suffixDiscoveryMatches: candidate.suffixDiscoveryMatches,
      sourceDerivedRelations: relationEvidence.sourceDerivedRelations,
      ontology: candidate.ontology,
      targetEtymologyLinks: relationEvidence.targetEtymologyLinks,
      targetEtymologyTemplates: relationEvidence.targetEtymologyTemplates,
      existingManifestHypothesisStatus: candidate.researchHypothesis?.hypothesisStatus ?? null,
      existingManifestHypothesis: candidate.researchHypothesis,
      existingFunctionalOperation: candidate.functionalOperation,
      existingProductionAuthorization: candidate.productionAuthorization,
      embryoFunction: candidate.embryoFunction,
      historicalRelation: candidate.historicalRelation,
      fjaloriMatchStatus: rows.length === 0 ? "FORM_NOT_FOUND" : "FORM_FOUND",
      fjaloriPhysicalRowOrdinals: Object.freeze(rowOrdinals),
      fjaloriSourceRows: Object.freeze(rows.map((row) => Object.freeze({
        ...row,
        senses: Object.freeze([...row.senses]),
      }))),
      fjaloriSenseAlignmentStatus: senseAlignmentStatus,
      definitionEvidenceStatus,
      fjaloriPosTags: Object.freeze(rows.map((row) => row.syntactic_tag)),
      definitionUnitEvaluations: Object.freeze(definitionUnits),
      analyzerClassification: candidateClassification,
      existingAgentStatus: "NOT_REEVALUATED_IN_FJALORI_PHASE2",
      newResearchEligibilityStatus: eligibility,
      candidateReviewStatus,
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED",
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
      ambiguity: Object.freeze({
        candidateSenseCountForLemma: candidateSenseCount,
        fjaloriRowCount: rows.length,
        definitionUnitCount: definitionUnits.length,
        hasMultipleKaikkiSenses: multipleCandidateSenses,
        hasMultipleFjaloriRows: multipleRows,
        hasMultipleDefinitionUnits: multipleUnits,
        hasConflictingAnalyzerClassifications: hasConflict,
        codes: Object.freeze(ambiguityCodes),
      }),
      reasonCodes: Object.freeze([...new Set(reasonCodes)].sort()),
      claimBoundary: "Fjalori rows are matched by NFC plus Albanian case-insensitive form only; no Fjalori sense identifier or reviewed cross-source alignment is implied. Analyzer labels are derived interpretations of source text, not source-authored roles. A possible AGENT proposal remains unreviewed, functionalOperation stays Null, and productionAuthorization is NOT_AUTHORIZED. Source-derived relations and target-authored etymology references are preserved separately and never relabeled.",
    });
  });

  const distinctUnits = [...unitEvaluationsBySourceIdentity.values()];
  const negativeControlResults = FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1.map((lemma) => {
    const normalizedLemma = normalizeAlbanianLexicalFormV0_1(lemma);
    const rows = input.fjaloriExport.negativeControlRows.filter((row) => row.normalizedWord === normalizedLemma);
    const units = rows.flatMap((row) => buildFjaloriDefinitionUnitsV0_1(row)
      .map((unit) => evaluateDefinitionUnitV0_1(row, unit)));
    const match = input.fjaloriExport.negativeControlMatches.find((item) => item.targetLemma === lemma);
    return Object.freeze({
      targetLemma: lemma,
      candidateBatchMembership: "NOT_IN_30_SENSE_BATCH" as const,
      kaikkiRecords: Object.freeze((input.verifiedNegativeControlRecords ?? []).filter((record) => record.lemma === lemma)),
      fjaloriMatchStatus: rows.length === 0 ? "FORM_NOT_FOUND" as const : "FORM_FOUND" as const,
      fjaloriPhysicalRowOrdinals: Object.freeze(rows.map((row) => row.physicalRowOrdinal)),
      fjaloriSourceRows: Object.freeze(rows.map((row) => Object.freeze({ ...row, senses: Object.freeze([...row.senses]) }))),
      definitionUnitEvaluations: Object.freeze(units),
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED" as const,
      reasonCodes: Object.freeze([
        "NEGATIVE_CONTROL_NOT_IN_OCCUPATIONAL_CANDIDATE_BATCH",
        ...(match?.matchedPhysicalRowOrdinals.length ? [] : ["FJALORI_EXACT_FORM_NOT_FOUND"]),
        "NO_PHASE2_FUNCTIONAL_OPERATION_AUTHORIZATION",
      ]),
    });
  });
  const uniqueCandidateLemmas = new Set(input.candidates.map((item) => normalizeAlbanianLexicalFormV0_1(item.sourceRecord.lemma)));
  const uniqueMatchedCandidateLemmas = new Set(candidateResults
    .filter((item) => item.fjaloriPhysicalRowOrdinals.length > 0)
    .map((item) => normalizeAlbanianLexicalFormV0_1(item.targetLemma)));
  const bareReferenceCandidateIds = new Set(candidateResults
    .filter((item) => item.definitionUnitEvaluations.some((unit) => unit.matchedPattern === "BARE_LEXICAL_REFERENCE"))
    .map((item) => item.candidateId));
  const occupationCategorySenseCount = input.candidates.filter((candidate) =>
    candidate.sourceRecord.categories.some((category) => category.name === "Occupations" && category.orig === "sq:Occupations" && category.langcode === "sq"),
  ).length;
  const existingHypothesisCount = input.candidates.filter((candidate) => candidate.researchHypothesis !== null).length;
  return Object.freeze({
    schemaVersion: FJALORI_PHASE_2_SCHEMA_V0_1,
    evidenceClassifications: Object.freeze(["FACT", "INFERENCE", "HYPOTHESIS", "UNKNOWN_OR_NULL"]),
    analyzer: Object.freeze({
      module: "src/shared/openInstrument/albanianAgentiveDefinitionAnalyzer.v0_1.ts",
      authority: "ANALYZER_DERIVED_NOT_SOURCE_AUTHORED",
    }),
    fjalori: Object.freeze({ ...input.fjaloriExport.source, ...input.fjaloriExport.scanSummary }),
    kaikki: Object.freeze({
      sourceProfileId: "open-instrument.albanian-kaikki.frozen.20261022T035432Z",
      artifactSha256: KAIKKI_PHASE_2_EXPECTED_SHA256_V0_1,
      artifactBytes: KAIKKI_PHASE_2_EXPECTED_BYTES_V0_1,
      physicalRowsScanned: input.kaikkiPhysicalRowsScanned,
      candidateSourceRecordAndSenseIdentitiesVerified: input.verifiedKaikkiCandidateIds.size,
      sourceDerivedRelationsVerified: input.verifiedKaikkiDerivedRelationCount,
    }),
    candidateBatch: Object.freeze({
      candidateSenseCount: input.candidates.length,
      uniqueLemmaCount: uniqueCandidateLemmas.size,
      sourceOccupationCategorySenseCount: occupationCategorySenseCount,
      existingResearchHypothesisCount: existingHypothesisCount,
    }),
    metrics: Object.freeze({
      A_totalCandidateSensesEvaluated: candidateResults.length,
      B_exactFjaloriLemmaMatchedCandidateSenses: candidateResults.filter((item) => item.fjaloriPhysicalRowOrdinals.length > 0).length,
      B_uniqueExactFjaloriLemmaMatches: uniqueMatchedCandidateLemmas.size,
      C_sharedSourceSenseIdAlignedMatches: 0,
      D_distinctDefinitionUnitsEvaluated: distinctUnits.length,
      E_humanAgentRoleUnitOutputs: distinctUnits.filter((item) => item.analyzerClassification === "HUMAN_AGENT_ROLE").length,
      F_humanAgentCandidateSensesWithUnresolvedAlignment: candidateResults.filter((item) =>
        item.definitionUnitEvaluations.some((unit) => unit.analyzerClassification === "HUMAN_AGENT_ROLE") &&
        item.fjaloriSenseAlignmentStatus !== ("SOURCE_SENSE_ID_MATCHED" as never),
      ).length,
      G_definitivelyNonAgentiveUnitClassifications: distinctUnits.filter((item) =>
        item.analyzerClassification !== "HUMAN_AGENT_ROLE" && item.analyzerClassification !== "UNKNOWN_OR_NULL",
      ).length,
      H_unknownOrNullUnitOutputs: distinctUnits.filter((item) => item.analyzerClassification === "UNKNOWN_OR_NULL").length,
      I_priorAgentBaselineSensesWithCrossSourceSenseIdCorroboration: 0,
      I_priorAgentBaselineSenseIdentityDetailAvailable: false,
      J_additionalResearchEligibleTargetSenses: 0,
      J_potentialAgentReviewTargetsWithoutSenseAlignment: candidateResults.filter((item) =>
        item.candidateReviewStatus === "POTENTIAL_AGENT_REVIEW_TARGET",
      ).length,
      K_casesNeedingSynonymResolution: bareReferenceCandidateIds.size,
      L_distinctDefinitionUnitsNeedingAnalyzerRuleReview: distinctUnits.filter((item) => item.analyzerClassification === "UNKNOWN_OR_NULL").length,
      M_distinctCandidateSenses: new Set(candidateResults.map((item) => item.kaikkiSenseId)).size,
      M_distinctCandidateLemmas: uniqueCandidateLemmas.size,
    }),
    priorMeasuredKaikkiOnlyBaseline: Object.freeze({
      exploratoryAgentTargetSenseCount: 11,
      agentRelationshipOutputCount: 14,
      source: "PR #2257 post-merge measurement report",
      reexecutedInThisRun: false,
    }),
    negativeControlResults: Object.freeze(negativeControlResults),
    negativeControlSummary: Object.freeze({
      targetFormCount: FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1.length,
      verifiedKaikkiRecordCount: (input.verifiedNegativeControlRecords ?? []).length,
      exactFjaloriFormMatchCount: input.fjaloriExport.negativeControlMatches.filter((item) =>
        item.matchedPhysicalRowOrdinals.length > 0,
      ).length,
      definitionUnitCount: negativeControlResults.reduce((count, result) => count + result.definitionUnitEvaluations.length, 0),
      humanAgentAnalyzerOutputCount: negativeControlResults.reduce((count, result) =>
        count + result.definitionUnitEvaluations.filter((unit) => unit.analyzerClassification === "HUMAN_AGENT_ROLE").length, 0),
      nonAgentAnalyzerOutputCount: negativeControlResults.reduce((count, result) =>
        count + result.definitionUnitEvaluations.filter((unit) =>
          unit.analyzerClassification !== "HUMAN_AGENT_ROLE" && unit.analyzerClassification !== "UNKNOWN_OR_NULL",
        ).length, 0),
      unknownOrNullAnalyzerOutputCount: negativeControlResults.reduce((count, result) =>
        count + result.definitionUnitEvaluations.filter((unit) => unit.analyzerClassification === "UNKNOWN_OR_NULL").length, 0),
    }),
    reproducibility: Object.freeze({
      repositoryCommit: input.repositoryCommit,
      command: input.command,
      runnerVersion: "0.1.0",
      analyzerArtifactSha256: input.analyzerArtifactSha256,
      candidateBatchSha256: input.candidateBatchSha256,
      candidateBatchBytes: input.candidateBatchBytes,
      fjaloriSourcePath: input.fjaloriSourcePath,
      kaikkiSourcePath: input.kaikkiSourcePath,
      fjaloriDatasetCardLicense: "CC BY 4.0 listed; original-dictionary rights not independently adjudicated here",
      fjaloriAttribution: "Fjalori Shqip; Hugging Face dataset akadriu/fjalori-shqip",
    }),
    candidateResults: Object.freeze(candidateResults),
    productionBehaviorChanged: false,
    claimBoundary: "This is a deterministic local research measurement, not a production provider or functional authorization change. FACT: pinned source identity, row fields/ordinals, Kaikki identities, source relation fields, and analyzer outputs. INFERENCE: analyzer classification and cross-source compatibility proposal. HYPOTHESIS: possible unreviewed AGENT candidate only. UNKNOWN_OR_NULL: unresolved senses, synonym references, and unsupported definitions. No Fjalori sense IDs exist in this source export; no reviewed alignment, reviewer record, owner approval, or production AGENT authorization is created.",
  });
}

function verifyKaikkiSnapshotV0_1(
  buffer: Buffer,
  candidates: readonly AlbanianOccupationalRoleCandidateV0_1[],
  expectedRows: number,
): Readonly<{
  verifiedCandidateIds: ReadonlySet<string>;
  rowCount: number;
  verifiedDerivedRelationCount: number;
  negativeControlRecords: readonly KaikkiNegativeControlRecordV0_1[];
}> {
  const digest = verifyArtifactDigestV0_1(buffer, KAIKKI_PHASE_2_EXPECTED_BYTES_V0_1, KAIKKI_PHASE_2_EXPECTED_SHA256_V0_1);
  if (!digest.valid) throw new Error(`KAIKKI_SOURCE_IDENTITY_MISMATCH:${digest.actualByteCount}:${digest.actualSha256}`);
  const targetCandidatesByOrdinal = new Map<number, AlbanianOccupationalRoleCandidateV0_1[]>();
  for (const candidate of candidates) {
    const ordinal = candidate.sourceRecord.physicalRecordOrdinal;
    const list = targetCandidatesByOrdinal.get(ordinal) ?? [];
    list.push(candidate);
    targetCandidatesByOrdinal.set(ordinal, list);
  }
  const relationsByBaseOrdinal = new Map<number, {
    candidate: AlbanianOccupationalRoleCandidateV0_1;
    relation: AlbanianOccupationalRoleCandidateV0_1["sourceDerivedRelations"][number];
  }[]>();
  for (const candidate of candidates) {
    for (const relation of candidate.sourceDerivedRelations) {
      const matchingRelations = relationsByBaseOrdinal.get(relation.basePhysicalRecordOrdinal) ?? [];
      matchingRelations.push({ candidate, relation });
      relationsByBaseOrdinal.set(relation.basePhysicalRecordOrdinal, matchingRelations);
    }
  }
  const exactWordMatchOrdinals = new Map<string, number>();
  const verifiedCandidateIds = new Set<string>();
  const negativeControlWords = new Set<string>(FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1);
  const negativeControlRecords: KaikkiNegativeControlRecordV0_1[] = [];
  let verifiedDerivedRelationCount = 0;
  const lines = buffer.toString("utf8").split(/\r?\n/u);
  if (lines.at(-1) === "") lines.pop();
  if (lines.length !== expectedRows) throw new Error(`KAIKKI_SOURCE_ROW_COUNT_MISMATCH:${lines.length}:${expectedRows}`);
  lines.forEach((line, physicalRecordOrdinal) => {
    if (!line) throw new Error(`KAIKKI_EMPTY_JSONL_ROW:${physicalRecordOrdinal}`);
    const entry = JSON.parse(line) as Record<string, unknown>;
    const word = typeof entry.word === "string" ? entry.word : null;
    if (!word) throw new Error(`KAIKKI_WORD_INVALID:${physicalRecordOrdinal}`);
    const matchOrdinal = exactWordMatchOrdinals.get(word) ?? 0;
    exactWordMatchOrdinals.set(word, matchOrdinal + 1);
    const matchingCandidates = targetCandidatesByOrdinal.get(physicalRecordOrdinal) ?? [];
    for (const candidate of matchingCandidates) {
      const source = candidate.sourceRecord;
      const senses = Array.isArray(entry.senses) ? entry.senses as Record<string, unknown>[] : [];
      const sourceSense = senses[source.senseOrdinal];
      const expectedSourceRecordId = `kaikki-albanian-jsonl:word=${encodeURIComponent(source.lemma)}:ordinal=${matchOrdinal}`;
      const expectedLocator = `jsonl://word/${encodeURIComponent(source.lemma)}/match/${matchOrdinal}`;
      if (
        word !== source.lemma ||
        entry.lang_code !== "sq" ||
        entry.lang !== "Albanian" ||
        entry.pos !== source.partOfSpeech ||
        candidate.sourceRecordId !== expectedSourceRecordId ||
        source.entryLocator !== expectedLocator ||
        (typeof entry.id === "string" ? entry.id : null) !== source.rawEntryId ||
        !sourceSense || sourceSense.id !== candidate.senseId
      ) {
        throw new Error(`KAIKKI_CANDIDATE_SOURCE_IDENTITY_MISMATCH:${candidate.candidateId}`);
      }
      verifiedCandidateIds.add(candidate.candidateId);
    }
    if (negativeControlWords.has(word)) {
      if (entry.lang_code !== "sq" || entry.lang !== "Albanian") {
        throw new Error(`KAIKKI_NEGATIVE_CONTROL_LANGUAGE_INVALID:${word}:${physicalRecordOrdinal}`);
      }
      const senses = Array.isArray(entry.senses) ? entry.senses as Record<string, unknown>[] : [];
      const controlSenses = senses.map((sense, senseOrdinal) => {
        const categories = Array.isArray(sense.categories) ? sense.categories as Record<string, unknown>[] : [];
        return Object.freeze({
          senseOrdinal,
          senseId: typeof sense.id === "string" ? sense.id : null,
          glosses: Object.freeze(Array.isArray(sense.glosses)
            ? sense.glosses.filter((gloss): gloss is string => typeof gloss === "string")
            : []),
          categories: Object.freeze(categories.flatMap((category) =>
            typeof category.name === "string"
              ? [Object.freeze({
                  name: category.name,
                  orig: typeof category.orig === "string" ? category.orig : null,
                  langcode: typeof category.langcode === "string" ? category.langcode : null,
                })]
              : [],
          )),
        });
      });
      const etymologyLinks = Array.isArray(entry.etymology_links)
        ? (entry.etymology_links as unknown[]).flatMap((link): (readonly [string, string])[] =>
            Array.isArray(link) && typeof link[0] === "string" && typeof link[1] === "string"
              ? [[link[0], link[1]]]
              : [],
          )
        : [];
      const etymologyTemplates = Array.isArray(entry.etymology_templates)
        ? (entry.etymology_templates as Record<string, unknown>[]).flatMap((template) =>
            typeof template.name === "string"
              ? [Object.freeze({
                  name: template.name,
                  expansion: typeof template.expansion === "string" ? template.expansion : null,
                })]
              : [],
          )
        : [];
      const sourceDerivedForms = Array.isArray(entry.derived)
        ? (entry.derived as unknown[]).map((derived) => Object.freeze({
            word: typeof derived === "string"
              ? derived
              : derived !== null && typeof derived === "object" && typeof (derived as Record<string, unknown>).word === "string"
                ? (derived as Record<string, string>).word
                : null,
            languageCode: derived !== null && typeof derived === "object" && typeof (derived as Record<string, unknown>).lang_code === "string"
              ? (derived as Record<string, string>).lang_code
              : null,
          }))
        : [];
      negativeControlRecords.push(Object.freeze({
        lemma: word as KaikkiNegativeControlRecordV0_1["lemma"],
        sourceRecordId: `kaikki-albanian-jsonl:word=${encodeURIComponent(word)}:ordinal=${matchOrdinal}`,
        rawEntryId: typeof entry.id === "string" ? entry.id : null,
        physicalRecordOrdinal,
        matchOrdinal,
        entryLocator: `jsonl://word/${encodeURIComponent(word)}/match/${matchOrdinal}`,
        language: entry.lang as string,
        languageCode: entry.lang_code as string,
        partOfSpeech: typeof entry.pos === "string" ? entry.pos : null,
        senses: Object.freeze(controlSenses),
        sourceDerivedForms: Object.freeze(sourceDerivedForms),
        etymologyLinks: Object.freeze(etymologyLinks),
        etymologyTemplates: Object.freeze(etymologyTemplates),
      }));
    }
    for (const { candidate, relation } of relationsByBaseOrdinal.get(physicalRecordOrdinal) ?? []) {
      const expectedBaseRecordId = `kaikki-albanian-jsonl:word=${encodeURIComponent(word)}:ordinal=${matchOrdinal}`;
      const expectedBaseLocator = `jsonl://word/${encodeURIComponent(word)}/match/${matchOrdinal}`;
      if (
        word !== relation.baseLemma || entry.lang_code !== "sq" || entry.lang !== "Albanian" ||
        relation.direction !== "BASE_RECORD_LISTS_TARGET_AS_DERIVED_FORM" ||
        relation.baseSourceRecordId !== expectedBaseRecordId || relation.baseEntryLocator !== expectedBaseLocator
      ) {
        throw new Error(`KAIKKI_SOURCE_DERIVED_BASE_IDENTITY_MISMATCH:${candidate.candidateId}`);
      }

      const rootDerived = Array.isArray(entry.derived) ? entry.derived : [];
      let targetForm: string | null = null;
      let targetSenseId: string | null = null;
      if (relation.relationScope === "SOURCE_RECORD") {
        const derivedEntry = rootDerived[relation.relationIndex];
        targetForm = typeof derivedEntry === "string"
          ? derivedEntry
          : derivedEntry !== null && typeof derivedEntry === "object" && typeof (derivedEntry as Record<string, unknown>).word === "string"
            ? (derivedEntry as Record<string, string>).word
            : null;
      } else if (relation.relationScope === "SOURCE_SENSE") {
        let globalRelationIndex = rootDerived.length;
        for (const rawSense of Array.isArray(entry.senses) ? entry.senses : []) {
          const baseSense = rawSense !== null && typeof rawSense === "object" ? rawSense as Record<string, unknown> : null;
          const senseDerived = Array.isArray(baseSense?.derived) ? baseSense.derived : [];
          for (const derivedEntry of senseDerived) {
            if (globalRelationIndex === relation.relationIndex) {
              targetSenseId = typeof baseSense?.id === "string" ? baseSense.id : null;
              targetForm = typeof derivedEntry === "string"
                ? derivedEntry
                : derivedEntry !== null && typeof derivedEntry === "object" && typeof (derivedEntry as Record<string, unknown>).word === "string"
                  ? (derivedEntry as Record<string, string>).word
                  : null;
            }
            globalRelationIndex += 1;
          }
        }
      }
      if (
        targetForm !== candidate.sourceRecord.lemma ||
        (relation.relationScope === "SOURCE_RECORD" && relation.baseSenseIds.length !== 0) ||
        (relation.relationScope === "SOURCE_SENSE" &&
          (!targetSenseId || relation.baseSenseIds.length !== 1 || relation.baseSenseIds[0] !== targetSenseId))
      ) {
        throw new Error(`KAIKKI_SOURCE_DERIVED_EDGE_MISMATCH:${candidate.candidateId}:${relation.relationIndex}`);
      }
      verifiedDerivedRelationCount += 1;
    }
  });
  if (verifiedCandidateIds.size !== candidates.length) throw new Error("KAIKKI_CANDIDATE_PHYSICAL_ROW_MISSING");
  const expectedDerivedRelationCount = candidates.reduce((count, candidate) => count + candidate.sourceDerivedRelations.length, 0);
  if (verifiedDerivedRelationCount !== expectedDerivedRelationCount) throw new Error("KAIKKI_SOURCE_DERIVED_RELATION_COUNT_MISMATCH");
  const expectedControlCounts = new Map<string, number>([["shqiptar", 2], ["gjitar", 2], ["gjueti", 1], ["kombëtar", 1]]);
  for (const [lemma, expectedCount] of expectedControlCounts) {
    const actualCount = negativeControlRecords.filter((record) => record.lemma === lemma).length;
    if (actualCount !== expectedCount) throw new Error(`KAIKKI_NEGATIVE_CONTROL_RECORD_COUNT_MISMATCH:${lemma}:${actualCount}:${expectedCount}`);
  }
  return Object.freeze({
    verifiedCandidateIds,
    rowCount: lines.length,
    verifiedDerivedRelationCount,
    negativeControlRecords: Object.freeze(negativeControlRecords),
  });
}

type CliOptionsV0_1 = Readonly<{
  parquet: string;
  kaikki: string;
  report: string;
  python: string;
}>;

function parseCliOptionsV0_1(argv: readonly string[]): CliOptionsV0_1 {
  const values = new Map<string, string>();
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || !value || values.has(key.slice(2))) {
      throw new Error("USAGE: --parquet PATH --kaikki PATH --report PATH [--python PATH]");
    }
    values.set(key.slice(2), value);
  }
  const parquet = values.get("parquet");
  const kaikki = values.get("kaikki");
  const report = values.get("report");
  const python = values.get("python") ?? process.env.FJALORI_PYTHON ?? "python3";
  if (!parquet || !kaikki || !report) throw new Error("USAGE: --parquet PATH --kaikki PATH --report PATH [--python PATH]");
  return Object.freeze({ parquet, kaikki, report, python });
}

export async function runFjaloriPhase2CliV0_1(argv = process.argv.slice(2)): Promise<FjaloriPhase2ReportV0_1> {
  const options = parseCliOptionsV0_1(argv);
  const scriptPath = fileURLToPath(import.meta.url);
  const repoRoot = resolve(dirname(scriptPath), "../..");
  const reportPath = resolve(options.report);
  const reportRelativeToRepo = relative(repoRoot, reportPath);
  if (reportRelativeToRepo === "" || (!reportRelativeToRepo.startsWith("..") && !isAbsolute(reportRelativeToRepo))) {
    throw new Error("REPORT_PATH_MUST_BE_OUTSIDE_PUBLIC_REPOSITORY");
  }

  const candidateBatchPath = resolve(repoRoot, "src/data/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1.json");
  const exporterPath = resolve(repoRoot, "scripts/research/exportFjaloriAgentiveDefinitionEvidenceV0_1.py");
  const candidateBatchBuffer = readFileSync(candidateBatchPath);
  const rawCandidates = (JSON.parse(candidateBatchBuffer.toString("utf8")) as { candidates?: unknown }).candidates;
  if (!Array.isArray(rawCandidates) || rawCandidates.length !== 30) {
    throw new Error(`CANDIDATE_BATCH_COUNT_INVALID:${Array.isArray(rawCandidates) ? rawCandidates.length : "missing"}`);
  }
  const candidates = rawCandidates.map((rawCandidate) => {
    const raw = rawCandidate as AlbanianOccupationalRoleCandidateV0_1;
    const projected = getAlbanianOccupationalRoleCandidatesForWordV0_1(raw.sourceRecord.lemma)
      .candidates.find((candidate) => candidate.candidateId === raw.candidateId);
    if (
      !projected || projected.sourceRecordId !== raw.sourceRecordId || projected.senseId !== raw.senseId ||
      projected.sourceRecord.physicalRecordOrdinal !== raw.sourceRecord.physicalRecordOrdinal ||
      projected.sourceRecord.senseOrdinal !== raw.sourceRecord.senseOrdinal
    ) {
      throw new Error(`CANDIDATE_BATCH_PROJECTED_IDENTITY_MISMATCH:${raw.candidateId}`);
    }
    return projected;
  });
  const privateWorkingDirectory = mkdtempSync(join(tmpdir(), "open-instrument-fjalori-phase2-"));
  const exportPath = join(privateWorkingDirectory, "matched-fjalori-rows.private.json");
  try {
    const exportResult = spawnSync(options.python, [
      exporterPath,
      "--source", resolve(options.parquet),
      "--candidate-batch", candidateBatchPath,
      "--output", exportPath,
    ], { encoding: "utf8", maxBuffer: 1024 * 1024 });
    if (exportResult.error) throw exportResult.error;
    if (exportResult.status !== 0) {
      const exportMessage = (exportResult.stderr || exportResult.stdout).trim();
      if (exportMessage.startsWith("SOURCE_UNAVAILABLE:")) {
        throw new Error(`FJALORI_SOURCE_UNAVAILABLE:${exportMessage}`);
      }
      throw new Error(`FJALORI_EXPORT_FAILED:${exportResult.status}:${exportMessage}`);
    }
    const fjaloriExport = JSON.parse(readFileSync(exportPath, "utf8")) as FjaloriExportV0_1;
    const kaikkiBuffer = readFileSync(options.kaikki);
    const verifiedKaikki = verifyKaikkiSnapshotV0_1(
      kaikkiBuffer,
      candidates,
      (JSON.parse(candidateBatchBuffer.toString("utf8")) as { suffixScan: { sourceRowsScanned: number } }).suffixScan.sourceRowsScanned,
    );
    const repositoryHead = spawnSync("git", ["rev-parse", "HEAD"], { cwd: repoRoot, encoding: "utf8" });
    if (repositoryHead.status !== 0 || !repositoryHead.stdout.trim()) {
      throw new Error(`REPOSITORY_HEAD_UNAVAILABLE:${repositoryHead.stderr || repositoryHead.error || "unknown"}`);
    }
    const report = buildFjaloriPhase2ReportV0_1({
      candidates,
      fjaloriExport,
      verifiedKaikkiCandidateIds: verifiedKaikki.verifiedCandidateIds,
      verifiedNegativeControlRecords: verifiedKaikki.negativeControlRecords,
      kaikkiPhysicalRowsScanned: verifiedKaikki.rowCount,
      verifiedKaikkiDerivedRelationCount: verifiedKaikki.verifiedDerivedRelationCount,
      repositoryCommit: repositoryHead.stdout.trim(),
      command: [process.execPath, ...process.execArgv, ...process.argv.slice(1)]
        .map((argument) => JSON.stringify(argument))
        .join(" "),
      fjaloriSourcePath: resolve(options.parquet),
      kaikkiSourcePath: resolve(options.kaikki),
      analyzerArtifactSha256: createHash("sha256")
        .update(readFileSync(resolve(repoRoot, "src/shared/openInstrument/albanianAgentiveDefinitionAnalyzer.v0_1.ts")))
        .digest("hex"),
      candidateBatchSha256: createHash("sha256").update(candidateBatchBuffer).digest("hex"),
      candidateBatchBytes: candidateBatchBuffer.byteLength,
    });
    writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, { encoding: "utf8", flag: "wx" });
    return report;
  } finally {
    rmSync(privateWorkingDirectory, { recursive: true, force: true });
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  runFjaloriPhase2CliV0_1()
    .then((report) => {
      process.stdout.write(`${JSON.stringify({
        reportPath: process.argv.slice(2).find((_, index, args) => args[index - 1] === "--report") ?? null,
        metrics: report.metrics,
        productionBehaviorChanged: report.productionBehaviorChanged,
      }, null, 2)}\n`);
    })
    .catch((error: unknown) => {
      process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
      process.exitCode = 1;
    });
}
