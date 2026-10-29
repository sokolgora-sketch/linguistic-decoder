import rawCandidateBatch from "@/data/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1.json";
import { mkdirSync, mkdtempSync, realpathSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  getAlbanianOccupationalRoleCandidatesForWordV0_1,
  type AlbanianOccupationalRoleCandidateV0_1,
} from "@/shared/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1";
import {
  FJALORI_PHASE_2_EXPECTED_BYTES_V0_1,
  FJALORI_PHASE_2_EXPECTED_ROWS_V0_1,
  FJALORI_PHASE_2_EXPECTED_SHA256_V0_1,
  FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1,
  FJALORI_PHASE_2_EXPORT_SCHEMA_V0_1,
  FJALORI_PHASE_2_SOURCE_IDENTITY_V0_1,
  buildFjaloriDefinitionUnitsV0_1,
  buildFjaloriPhase2ReportV0_1,
  normalizeAlbanianLexicalFormV0_1,
  resolveExternalReportPathV0_1,
  verifyArtifactDigestV0_1,
  type FjaloriExportV0_1,
  type FjaloriSourceRowV0_1,
  type KaikkiNegativeControlRecordV0_1,
} from "../../scripts/research/fjaloriAgentiveDefinitionEvidencePhase2.v0_1";

const candidates = rawCandidateBatch.candidates.map((rawCandidate) => {
  const projected = getAlbanianOccupationalRoleCandidatesForWordV0_1(rawCandidate.sourceRecord.lemma)
    .candidates.find((item) => item.candidateId === rawCandidate.candidateId);
  if (!projected) throw new Error(`Candidate projection missing: ${rawCandidate.candidateId}`);
  return projected;
});
const targetSenseCount = 30;
const candidateIds = new Set(candidates.map((candidate) => candidate.candidateId));

function candidate(lemma: string, senseIndex = 0): AlbanianOccupationalRoleCandidateV0_1 {
  const matches = candidates.filter((item) => item.sourceRecord.lemma === lemma);
  const selected = matches[senseIndex];
  if (!selected) throw new Error(`Missing candidate fixture: ${lemma}#${senseIndex}`);
  return selected;
}

function row(
  word: string,
  physicalRowOrdinal: number,
  input: Readonly<{
    definition?: string;
    senses?: readonly string[];
    pos?: string | null;
    numSenses?: number;
  }> = {},
): FjaloriSourceRowV0_1 {
  return {
    physicalRowOrdinal,
    normalizedWord: normalizeAlbanianLexicalFormV0_1(word),
    word,
    full_header: `${word} [synthetic test row]`,
    syntactic_tag: input.pos === undefined ? "m." : input.pos,
    sem_tag_1: null,
    sem_tag_2: null,
    sem_tag_3: null,
    definition: input.definition ?? "",
    senses: input.senses ?? [],
    num_senses: input.numSenses ?? input.senses?.length ?? 0,
  };
}

function makeExport(
  selectedCandidates: readonly AlbanianOccupationalRoleCandidateV0_1[],
  matchedRows: readonly FjaloriSourceRowV0_1[],
  negativeControlRows: readonly FjaloriSourceRowV0_1[] = [],
): FjaloriExportV0_1 {
  const rowsByWord = new Map<string, FjaloriSourceRowV0_1[]>();
  for (const sourceRow of matchedRows) {
    const list = rowsByWord.get(sourceRow.normalizedWord) ?? [];
    list.push(sourceRow);
    rowsByWord.set(sourceRow.normalizedWord, list);
  }
  const candidateMatches = selectedCandidates.map((item) => ({
    candidateId: item.candidateId,
    targetLemma: item.sourceRecord.lemma,
    normalizedLemma: normalizeAlbanianLexicalFormV0_1(item.sourceRecord.lemma),
    matchedPhysicalRowOrdinals: (rowsByWord.get(normalizeAlbanianLexicalFormV0_1(item.sourceRecord.lemma)) ?? [])
      .map((sourceRow) => sourceRow.physicalRowOrdinal),
  }));
  const matchedSenseCount = candidateMatches.filter((match) => match.matchedPhysicalRowOrdinals.length > 0).length;
  const matchedLemmaCount = new Set(candidateMatches
    .filter((match) => match.matchedPhysicalRowOrdinals.length > 0)
    .map((match) => match.normalizedLemma)).size;
  return {
    schemaVersion: FJALORI_PHASE_2_EXPORT_SCHEMA_V0_1,
    source: {
      sourceIdentity: FJALORI_PHASE_2_SOURCE_IDENTITY_V0_1,
      artifactSha256: FJALORI_PHASE_2_EXPECTED_SHA256_V0_1,
      artifactBytes: FJALORI_PHASE_2_EXPECTED_BYTES_V0_1,
      recordCount: FJALORI_PHASE_2_EXPECTED_ROWS_V0_1,
      columns: ["word", "full_header", "syntactic_tag", "sem_tag_1", "sem_tag_2", "sem_tag_3", "definition", "senses", "num_senses"],
    },
    scanSummary: {
      sourceRowsScanned: FJALORI_PHASE_2_EXPECTED_ROWS_V0_1,
      uniqueExactWordCount: 0,
      uniqueNfcCasefoldWordCount: 0,
      duplicateFullRecordCount: 0,
      duplicateNormalizedHeadwordRowCount: 0,
      nullCountsByColumn: {},
      numSensesZeroRowCount: 0,
      multipleStructuredSenseRowCount: 0,
    },
    candidateMatchSummary: {
      candidateSenseCount: selectedCandidates.length,
      uniqueCandidateLemmaCount: new Set(selectedCandidates.map((item) => normalizeAlbanianLexicalFormV0_1(item.sourceRecord.lemma))).size,
      exactLemmaMatchedCount: matchedLemmaCount,
      matchedCandidateSenseCount: matchedSenseCount,
      missingCandidateLemmas: candidateMatches.filter((match) => match.matchedPhysicalRowOrdinals.length === 0).map((match) => match.targetLemma),
    },
    candidateMatches,
    matchedRows: [...matchedRows].sort((left, right) => left.physicalRowOrdinal - right.physicalRowOrdinal),
    negativeControlMatches: FJALORI_PHASE_2_NEGATIVE_CONTROL_LEMMAS_V0_1.map((targetLemma) => ({
      targetLemma,
      normalizedLemma: normalizeAlbanianLexicalFormV0_1(targetLemma),
      matchedPhysicalRowOrdinals: negativeControlRows
        .filter((sourceRow) => sourceRow.normalizedWord === normalizeAlbanianLexicalFormV0_1(targetLemma))
        .map((sourceRow) => sourceRow.physicalRowOrdinal),
    })),
    negativeControlRows: [...negativeControlRows].sort((left, right) => left.physicalRowOrdinal - right.physicalRowOrdinal),
  };
}

function buildReport(
  rows: readonly FjaloriSourceRowV0_1[],
  selectedCandidates: readonly AlbanianOccupationalRoleCandidateV0_1[] = candidates,
  negativeControls: readonly KaikkiNegativeControlRecordV0_1[] = [],
  negativeControlRows: readonly FjaloriSourceRowV0_1[] = [],
) {
  return buildFjaloriPhase2ReportV0_1({
    candidates: selectedCandidates,
    fjaloriExport: makeExport(selectedCandidates, rows, negativeControlRows),
    verifiedKaikkiCandidateIds: new Set(selectedCandidates.map((item) => item.candidateId)),
    verifiedNegativeControlRecords: negativeControls,
    kaikkiPhysicalRowsScanned: rawCandidateBatch.suffixScan.sourceRowsScanned,
    verifiedKaikkiDerivedRelationCount: selectedCandidates.reduce((count, item) => count + item.sourceDerivedRelations.length, 0),
    repositoryCommit: "fixture-commit",
    command: "synthetic-test-fixture",
    fjaloriSourcePath: "fixture://not-a-real-dataset",
    kaikkiSourcePath: "fixture://not-a-real-dataset",
    analyzerArtifactSha256: "synthetic-analyzer-hash",
    candidateBatchSha256: "synthetic-batch-hash",
    candidateBatchBytes: 0,
  });
}

describe("Fjalori Phase 2 local evidence runner", () => {
  it("normalizes Albanian forms without losing diacritic equivalence and verifies byte digests", () => {
    expect(normalizeAlbanianLexicalFormV0_1("LULESHITËS".normalize("NFD")))
      .toBe(normalizeAlbanianLexicalFormV0_1("luleshitës"));
    const bytes = Buffer.from("bounded-fixture", "utf8");
    const digest = verifyArtifactDigestV0_1(bytes, bytes.length, "a".repeat(64));
    expect(digest).toMatchObject({ actualByteCount: bytes.length, valid: false });
    expect(verifyArtifactDigestV0_1(bytes, bytes.length, digest.actualSha256).valid).toBe(true);
  });

  it("uses definition text even when num_senses is zero and maps pelar as a review candidate only", () => {
    const pelarRow = row("pelar", 24006, { definition: "m. sh. Bari zqxash.", numSenses: 0 });
    const report = buildReport([pelarRow]);
    const pelar = report.candidateResults.find((item) => item.targetLemma === "pelar")!;
    expect(pelar.definitionUnitEvaluations).toHaveLength(1);
    expect(pelar.definitionUnitEvaluations[0]).toMatchObject({
      sourceField: "definition",
      sourceUnitText: "m. sh. Bari zqxash.",
      analyzerInputText: "Bari zqxash.",
      analyzerInputStartUtf16Offset: 7,
      analyzerClassification: "HUMAN_AGENT_ROLE",
      evidenceSpanLocation: { startUtf16Offset: 7, endUtf16Offset: 18, excerpt: "Bari zqxash" },
    });
    expect(pelar).toMatchObject({
      fjaloriMatchStatus: "FORM_FOUND",
      fjaloriSenseAlignmentStatus: "FORM_FOUND_SENSE_UNRESOLVED",
      definitionEvidenceStatus: "HUMAN_AGENT_EVIDENCE_OBSERVED",
      newResearchEligibilityStatus: "NOT_ELIGIBLE_CROSS_SOURCE_SENSE_ALIGNMENT_UNRESOLVED",
      candidateReviewStatus: "POTENTIAL_AGENT_REVIEW_TARGET",
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED",
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
      existingManifestHypothesisStatus: "PROPOSED_NOT_REVIEWED",
    });
    expect(pelar.sourceDerivedRelations).toHaveLength(1);
    expect(pelar.fjaloriSourceRows).toMatchObject([{
      physicalRowOrdinal: 24006,
      word: "pelar",
      syntactic_tag: "m.",
      definition: "m. sh. Bari zqxash.",
      senses: [],
      num_senses: 0,
    }]);
    expect(report.metrics.J_additionalResearchEligibleTargetSenses).toBe(0);
    expect(report.metrics.J_potentialAgentReviewTargetsWithoutSenseAlignment).toBe(1);
    expect(candidate("pelar").functionalOperation).toBeNull();
  });

  it("keeps thëngjilltar's bare lexical reference unresolved for Phase 3 synonym work", () => {
    const report = buildReport([row("thëngjilltar", 33714, { definition: "m. sh. Qxyr.", numSenses: 0 })]);
    const result = report.candidateResults.find((item) => item.targetLemma === "thëngjilltar")!;
    expect(result.definitionUnitEvaluations[0]).toMatchObject({
      analyzerClassification: "UNKNOWN_OR_NULL",
      matchedPattern: "BARE_LEXICAL_REFERENCE",
      sourceUnitText: "m. sh. Qxyr.",
    });
    expect(result.candidateReviewStatus).toBe("NOT_A_POTENTIAL_AGENT_REVIEW_TARGET");
    expect(result.functionalOperation).toBeNull();
    expect(report.metrics.K_casesNeedingSynonymResolution).toBe(1);
  });

  it("does not select a first row when duplicate normalized headwords conflict", () => {
    const report = buildReport([
      row("PELAR", 100, { definition: "m. sh. Bari zqxash.", numSenses: 0 }),
      row("pelar", 104, { definition: "m. sh. Vegël për xqz.", numSenses: 0 }),
    ]);
    const pelar = report.candidateResults.find((item) => item.targetLemma === "pelar")!;
    expect(pelar.fjaloriPhysicalRowOrdinals).toEqual([100, 104]);
    expect(pelar.fjaloriSenseAlignmentStatus).toBe("AMBIGUOUS_MULTISENSE");
    expect(pelar.definitionEvidenceStatus).toBe("AMBIGUOUS_MULTISENSE");
    expect(pelar.newResearchEligibilityStatus).toBe("NOT_ELIGIBLE_CONFLICTING_OR_MULTIPLE_UNITS");
    expect(pelar.candidateReviewStatus).toBe("NOT_A_POTENTIAL_AGENT_REVIEW_TARGET");
    expect(pelar.definitionUnitEvaluations.map((unit) => unit.analyzerClassification)).toEqual([
      "HUMAN_AGENT_ROLE",
      "INSTRUMENT_OR_TOOL",
    ]);
    expect(pelar.fjaloriSourceRows).toHaveLength(2);
  });

  it("keeps multiple structured senses separate and surfaces conflicting agent/non-agent readings", () => {
    const gdhendes = candidate("gdhendës");
    const report = buildReport([
      row("gdhendës", 50, {
        definition: "m. synthetic aggregate is preserved, not used instead of structured senses",
        senses: ["m. Bari zqxash.", "m. Vegël për xqz."],
        numSenses: 2,
      }),
    ]);
    const result = report.candidateResults.find((item) => item.candidateId === gdhendes.candidateId)!;
    expect(result.definitionUnitEvaluations.map((unit) => unit.analyzerClassification)).toEqual([
      "HUMAN_AGENT_ROLE",
      "INSTRUMENT_OR_TOOL",
    ]);
    expect(result.definitionEvidenceStatus).toBe("AMBIGUOUS_MULTISENSE");
    expect(result.analyzerClassification).toBe("CONFLICTING_OR_MULTIPLE_UNITS");
    expect(result.candidateReviewStatus).toBe("NOT_A_POTENTIAL_AGENT_REVIEW_TARGET");
    expect(result.fjaloriSourceRows[0]?.definition).toContain("synthetic aggregate is preserved");
  });

  it("does not count one Fjalori row twice for jakatar's two Kaikki senses", () => {
    const jakatarSenses = [candidate("jakatar", 0), candidate("jakatar", 1)];
    const report = buildReport([row("jakatar", 90, { definition: "m. sh. Ai që bën veshje." })], jakatarSenses);
    expect(report.candidateResults).toHaveLength(2);
    expect(report.candidateResults.map((item) => item.kaikkiSenseId)).toEqual(jakatarSenses.map((item) => item.senseId));
    expect(report.candidateResults.map((item) => item.fjaloriPhysicalRowOrdinals)).toEqual([[90], [90]]);
    expect(report.metrics.D_distinctDefinitionUnitsEvaluated).toBe(1);
    expect(report.metrics.E_humanAgentRoleUnitOutputs).toBe(1);
    expect(report.metrics.F_humanAgentCandidateSensesWithUnresolvedAlignment).toBe(2);
    expect(report.candidateResults.every((item) => item.functionalOperation === null)).toBe(true);
  });

  it("uses source POS restrictions and preserves source-relative UTF-16 evidence offsets", () => {
    const incompatible = row("pelar", 70, { definition: "kal. sh. Bari zqxash.", pos: "kal.", numSenses: 0 });
    const units = buildFjaloriDefinitionUnitsV0_1(incompatible);
    expect(units[0]).toMatchObject({ analyzerInput: "Bari zqxash.", analyzerInputStartUtf16Offset: 9 });
    const report = buildReport([incompatible]);
    const result = report.candidateResults.find((item) => item.targetLemma === "pelar")!;
    expect(result.definitionUnitEvaluations[0]).toMatchObject({
      analyzerClassification: "UNKNOWN_OR_NULL",
      reasonCodes: expect.arrayContaining(["HEADWORD_POS_CONFLICTS_WITH_HUMAN_ROLE_TEXT"]),
    });
    expect(result.candidateReviewStatus).toBe("NOT_A_POTENTIAL_AGENT_REVIEW_TARGET");
  });

  it("reports missing forms without source-absence claims and keeps all senses Null-authorized", () => {
    const report = buildReport([]);
    const pelar = report.candidateResults.find((item) => item.targetLemma === "pelar")!;
    expect(pelar).toMatchObject({
      fjaloriMatchStatus: "FORM_NOT_FOUND",
      fjaloriSenseAlignmentStatus: "NO_FORM_MATCH",
      definitionEvidenceStatus: "DEFINITION_INSUFFICIENT",
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED",
    });
    expect(report.metrics.B_exactFjaloriLemmaMatchedCandidateSenses).toBe(0);
    expect(report.metrics.B_uniqueExactFjaloriLemmaMatches).toBe(0);
    expect(report.candidateResults).toHaveLength(targetSenseCount);
    expect(report.candidateResults.every((item) => item.functionalOperation === null)).toBe(true);
    expect(report.productionBehaviorChanged).toBe(false);
  });

  it("keeps real-source negative controls outside the candidate batch and never authorizes AGENT", () => {
    const lemmas = ["shqiptar", "shqiptar", "gjitar", "gjitar", "gjueti", "kombëtar"] as const;
    const partsOfSpeech = ["adj", "noun", "noun", "adj", "noun", "adj"] as const;
    const senses = [
      { id: "shqiptar-adj", glosses: ["Albanian"], categories: [{ name: "Nationalities", orig: "sq:Nationalities", langcode: "sq" }] },
      { id: "shqiptar-noun", glosses: ["An Albanian in general, or specifically, a male Albanian."], categories: [] },
      { id: "gjitar-noun", glosses: ["mammal"], categories: [] },
      { id: "gjitar-adj", glosses: ["mammalian"], categories: [] },
      { id: "gjueti-noun", glosses: ["hunting"], categories: [{ name: "Hunting", orig: "sq:Hunting", langcode: "sq" }] },
      { id: "kombëtar-adj", glosses: ["national"], categories: [] },
    ];
    const controlRecords: KaikkiNegativeControlRecordV0_1[] = lemmas.map((lemma, index) => ({
      lemma,
      sourceRecordId: `fixture:${lemma}:${index}`,
      rawEntryId: senses[index].id,
      physicalRecordOrdinal: index,
      matchOrdinal: index === 1 || index === 3 ? 1 : 0,
      entryLocator: `fixture://${lemma}/${index}`,
      language: "Albanian",
      languageCode: "sq",
      partOfSpeech: partsOfSpeech[index],
      senses: [{
        senseOrdinal: 0,
        senseId: senses[index].id,
        glosses: senses[index].glosses,
        categories: senses[index].categories,
      }],
      sourceDerivedForms: [],
      etymologyLinks: [],
      etymologyTemplates: [],
    }));
    const controlRows = [
      row("SHQIPTAR", 10671, { pos: "m.", definition: "Shtetas i Xqzlandit.", numSenses: 0 }),
      row("GJITAR", 10768, { pos: "m.", definition: "Kafshë xqz.", numSenses: 1, senses: ["Kafshë xqz."] }),
      row("GJUETI", 15187, { pos: "f.", definition: "Veprimtaria e xqzimit.", numSenses: 0 }),
      row("KOMBËTAR", 31251, { pos: "mb.", definition: "Që lidhet me xqz.", numSenses: 0 }),
    ];
    const report = buildReport([], candidates, controlRecords, controlRows);
    expect(report.negativeControlResults.map((item) => item.targetLemma)).toEqual([
      "shqiptar", "gjitar", "gjueti", "kombëtar",
    ]);
    expect(report.negativeControlResults.every((item) =>
      item.candidateBatchMembership === "NOT_IN_30_SENSE_BATCH" &&
      item.functionalOperation === null && item.productionAuthorization === "NOT_AUTHORIZED",
    )).toBe(true);
    expect(report.negativeControlResults.map((item) => [
      item.targetLemma,
      item.definitionUnitEvaluations.map((unit) => unit.analyzerClassification),
    ])).toEqual([
      ["shqiptar", ["DEMONYM_OR_NATIONALITY"]],
      ["gjitar", ["ANIMAL_OR_BIOLOGICAL"]],
      ["gjueti", ["ACTIVITY_OR_PROCESS"]],
      ["kombëtar", ["ADJECTIVE_OR_PROPERTY"]],
    ]);
    expect(report.negativeControlSummary).toEqual({
      targetFormCount: 4,
      verifiedKaikkiRecordCount: 6,
      exactFjaloriFormMatchCount: 4,
      definitionUnitCount: 4,
      humanAgentAnalyzerOutputCount: 0,
      nonAgentAnalyzerOutputCount: 4,
      unknownOrNullAnalyzerOutputCount: 0,
    });
    expect(report.negativeControlResults.map((item) => item.kaikkiRecords.length)).toEqual([2, 2, 1, 1]);
    expect(report.negativeControlResults[0]?.kaikkiRecords[0]?.senses[0]?.categories[0]?.name).toBe("Nationalities");
  });

  it("preserves candidate ordering and produces deterministic counts on repeated builds", () => {
    const rows = [
      row("thëngjilltar", 33714, { definition: "m. sh. Qxyr.", numSenses: 0 }),
      row("pelar", 24006, { definition: "m. sh. Bari zqxash.", numSenses: 0 }),
    ];
    const first = buildReport(rows);
    const second = buildReport(rows);
    expect(first.candidateResults.map((item) => item.candidateId)).toEqual(candidates.map((item) => item.candidateId));
    expect(first.metrics).toEqual(second.metrics);
    expect(first.candidateResults).toEqual(second.candidateResults);
    expect(first.reproducibility.repositoryCommit).toBe("fixture-commit");
  });

  it("refuses an unrelated source row instead of silently treating it as a candidate match", () => {
    expect(() => buildReport([row("not-a-candidate", 1, { definition: "synthetic unrelated text" })]))
      .toThrow("FJALORI_EXPORT_ROW_IDENTITY_OR_ORDER_INVALID");
    expect(candidateIds.size).toBe(targetSenseCount);
  });

  it("rejects in-repository report paths after canonicalizing symlink parents and path components", () => {
    const temporaryRoot = mkdtempSync(join(tmpdir(), "fjalori-report-path-v01-"));
    const repositoryRoot = join(temporaryRoot, "repository");
    const unusualInRepositoryDirectory = join(repositoryRoot, "..private");
    const symlinkTargetInsideRepository = join(repositoryRoot, "private-reports");
    const symlinkParentOutsideRepository = join(temporaryRoot, "external-alias");
    const safeExternalDirectory = join(temporaryRoot, "safe-external");
    mkdirSync(unusualInRepositoryDirectory, { recursive: true });
    mkdirSync(symlinkTargetInsideRepository, { recursive: true });
    mkdirSync(safeExternalDirectory, { recursive: true });
    symlinkSync(symlinkTargetInsideRepository, symlinkParentOutsideRepository, "dir");

    try {
      expect(() => resolveExternalReportPathV0_1(
        join(unusualInRepositoryDirectory, "report.json"), repositoryRoot,
      )).toThrow("REPORT_PATH_MUST_BE_OUTSIDE_PUBLIC_REPOSITORY");
      expect(() => resolveExternalReportPathV0_1(
        join(symlinkParentOutsideRepository, "report.json"), repositoryRoot,
      )).toThrow("REPORT_PATH_MUST_BE_OUTSIDE_PUBLIC_REPOSITORY");
      expect(resolveExternalReportPathV0_1(
        join(safeExternalDirectory, "report.json"), repositoryRoot,
      )).toBe(join(realpathSync(safeExternalDirectory), "report.json"));
    } finally {
      rmSync(temporaryRoot, { recursive: true, force: true });
    }
  });
});
