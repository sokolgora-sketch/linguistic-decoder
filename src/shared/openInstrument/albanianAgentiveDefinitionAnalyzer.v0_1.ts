/**
 * Bounded Albanian definition-text analysis for exploratory role evidence.
 *
 * Results are derived from the supplied text. They are not source-authored
 * labels, lexical facts, derivational relations, or functional authorization.
 */

export const ALBANIAN_AGENTIVE_DEFINITION_ANALYZER_SCHEMA_V0_1 =
  "open-instrument.albanian-agentive-definition-analyzer.v0_1" as const;

export const ALBANIAN_AGENTIVE_DEFINITION_ANALYSIS_AUTHORITY_V0_1 =
  "ANALYZER_DERIVED_NOT_SOURCE_AUTHORED" as const;

export const ALBANIAN_AGENTIVE_DEFINITION_CLASSIFICATIONS_V0_1 = [
  "HUMAN_AGENT_ROLE",
  "ACTIVITY_OR_PROCESS",
  "INSTRUMENT_OR_TOOL",
  "ANIMAL_OR_BIOLOGICAL",
  "DEMONYM_OR_NATIONALITY",
  "ADJECTIVE_OR_PROPERTY",
  "UNKNOWN_OR_NULL",
] as const;

export type AlbanianAgentiveDefinitionClassificationV0_1 =
  (typeof ALBANIAN_AGENTIVE_DEFINITION_CLASSIFICATIONS_V0_1)[number];

export const ALBANIAN_AGENTIVE_DEFINITION_PATTERN_IDS_V0_1 = [
  "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE",
  "INCOMPLETE_PREPOSITIONAL_HUMAN_PREDICATE",
  "ROLE_HEAD_WITH_GENITIVE_PLURAL_COMPLEMENT",
  "ANIMAL_OR_BIOLOGICAL_SEMANTIC_HEAD",
  "ACTIVITY_OR_PROCESS_NOMINAL_HEAD",
  "INSTRUMENT_PURPOSE_CONSTRUCTION",
  "EXPLICIT_CITIZENSHIP_OR_NATIONALITY_DESCRIPTION",
  "ADJECTIVE_RELATIVE_PROPERTY_WITH_ADJECTIVE_POS",
  "GEOGRAPHIC_RESIDENCE_IS_NOT_NATIONALITY",
  "AMBIGUOUS_ROLE_HEAD_WITHOUT_QUALIFIED_COMPLEMENT",
  "MULTI_CLAUSE_DEFINITION",
  "BARE_LEXICAL_REFERENCE",
] as const;

export type AlbanianAgentiveDefinitionPatternIdV0_1 =
  (typeof ALBANIAN_AGENTIVE_DEFINITION_PATTERN_IDS_V0_1)[number];

export const ALBANIAN_AGENTIVE_DEFINITION_REASON_CODES_V0_1 = [
  "ANALYZER_INPUT_INVALID",
  "ANALYZER_DEFINITION_EMPTY",
  "ANALYZER_TEXT_ONLY_NOT_SOURCE_AUTHORITY",
  "EXPLICIT_HUMAN_ROLE_CONSTRUCTION_MATCHED",
  "ROLE_HEAD_COMPLEMENT_CONSTRUCTION_MATCHED",
  "ANIMAL_OR_BIOLOGICAL_DEFINITION_MATCHED",
  "ACTIVITY_OR_PROCESS_DEFINITION_MATCHED",
  "INSTRUMENT_OR_TOOL_DEFINITION_MATCHED",
  "CITIZENSHIP_OR_NATIONALITY_DEFINITION_MATCHED",
  "ADJECTIVE_POS_AND_PROPERTY_FRAME_MATCHED",
  "GEOGRAPHIC_RESIDENCE_DOES_NOT_ESTABLISH_NATIONALITY",
  "ROLE_HEAD_REQUIRES_QUALIFIED_COMPLEMENT",
  "ROLE_COMPLEMENT_STRUCTURE_UNRESOLVED",
  "AGENT_PREDICATE_NEGATED",
  "HEADWORD_POS_CONFLICTS_WITH_HUMAN_ROLE_TEXT",
  "ILLUSTRATIVE_EXAMPLE_IS_NOT_HEADWORD_EVIDENCE",
  "FIGURATIVE_CUE_REQUIRES_REVIEW",
  "CONFLICTING_DEFINITION_SIGNALS",
  "MULTI_CLAUSE_CONTEXT_UNRESOLVED",
  "ADJECTIVE_POS_REQUIRED_FOR_PROPERTY_FRAME",
  "INSUFFICIENT_ANALYZED_CONTEXT",
  "NO_SUPPORTED_DEFINITION_PATTERN",
] as const;

export type AlbanianAgentiveDefinitionReasonCodeV0_1 =
  (typeof ALBANIAN_AGENTIVE_DEFINITION_REASON_CODES_V0_1)[number];

export type AlbanianAgentiveDefinitionAnalyzerInputV0_1 = Readonly<{
  headword: string;
  definitionText: string;
  posTag: string | null;
  sourceRowOrdinal: number | null;
}>;

/** Span offsets are zero-based UTF-16 offsets into the original definitionText. */
export type AlbanianAgentiveDefinitionEvidenceSpanV0_1 = Readonly<{
  start: number;
  end: number;
  text: string;
}>;

export type AlbanianAgentiveDefinitionAnalyzerResultV0_1 = Readonly<{
  schemaVersion: typeof ALBANIAN_AGENTIVE_DEFINITION_ANALYZER_SCHEMA_V0_1;
  analysisAuthority: typeof ALBANIAN_AGENTIVE_DEFINITION_ANALYSIS_AUTHORITY_V0_1;
  headword: string | null;
  definitionText: string | null;
  posTag: string | null;
  sourceRowOrdinal: number | null;
  classification: AlbanianAgentiveDefinitionClassificationV0_1;
  matchedPattern: AlbanianAgentiveDefinitionPatternIdV0_1 | null;
  evidenceSpan: AlbanianAgentiveDefinitionEvidenceSpanV0_1 | null;
  reasonCodes: readonly AlbanianAgentiveDefinitionReasonCodeV0_1[];
}>;

type OriginalSpanV0_1 = Readonly<{ start: number; end: number }>;

type NormalizedViewV0_1 = Readonly<{
  original: string;
  text: string;
  originalSpansByNormalizedCodeUnit: readonly OriginalSpanV0_1[];
}>;

type TextRangeV0_1 = Readonly<{ start: number; end: number }>;

type RuleSignalV0_1 = Readonly<{
  classification: Exclude<
    AlbanianAgentiveDefinitionClassificationV0_1,
    "UNKNOWN_OR_NULL"
  >;
  matchedPattern: AlbanianAgentiveDefinitionPatternIdV0_1;
  reasonCode: AlbanianAgentiveDefinitionReasonCodeV0_1;
  range: TextRangeV0_1;
}>;

type UnresolvedSignalV0_1 = Readonly<{
  matchedPattern: AlbanianAgentiveDefinitionPatternIdV0_1 | null;
  reasonCode: AlbanianAgentiveDefinitionReasonCodeV0_1;
  range: TextRangeV0_1 | null;
}>;

type ClauseEvaluationV0_1 = Readonly<{
  signals: readonly RuleSignalV0_1[];
  unresolved: readonly UnresolvedSignalV0_1[];
}>;

type InputSnapshotV0_1 = Readonly<{
  valid: boolean;
  headword: string | null;
  definitionText: string | null;
  posTag: string | null;
  sourceRowOrdinal: number | null;
}>;

const ROLE_HEADS_V0_1 = [
  "bari",
  "mjeshtri",
  "roja",
  "shitësi",
  "punonjësi",
  "punëtori",
] as const;

const HUMAN_SUBJECTS_V0_1 = "(?:ai|ajo|personi|njeriu|punonjësi|mjeshtri)";
const QUALIFIED_PREDICATES_V0_1 =
  "(?:merret\\s+me|bën|punon(?:\\s+(?:me|për|në|si))?|shet|rregullon|kujdeset\\s+për|mbarështon|përkthen|gjuan)";

const EXPLICIT_HUMAN_ROLE_PATTERN_V0_1 = new RegExp(
  `^(?<phrase>${HUMAN_SUBJECTS_V0_1}\\s+që\\s+(?:(?<negation>nuk\\s+|s['’]\\s*))?${QUALIFIED_PREDICATES_V0_1}\\s+[\\p{L}\\p{M}\\d][\\p{L}\\p{M}\\d\\s'’,-]*?)[.!?]*$`,
  "u",
);

const INCOMPLETE_PREPOSITIONAL_HUMAN_PREDICATE_PATTERN_V0_1 = new RegExp(
  `^(?<phrase>${HUMAN_SUBJECTS_V0_1}\\s+që\\s+punon\\s+(?:me|për|në|si))[.!?]*$`,
  "u",
);

const ROLE_HEAD_WITH_GENITIVE_COMPLEMENT_PATTERN_V0_1 =
  /^((?:bari|mjeshtri|roja|shitësi|punonjësi|punëtori)\s+(?:(?:i|e|të|së)\s+)?[\p{L}\p{M}]+(?:ash|esh|ësh|ëve|eve|ve))[.!?]*$/u;

const ANIMAL_OR_BIOLOGICAL_PATTERN_V0_1 =
  /^((?:kafshë|gjitar|shpend|peshk|insekt|zvarranik|amfib|qen|mace|lopë|dele|pelë)(?:\s+[\p{L}\p{M}\s'’,-]+)?)[.!?]*$/u;

const ACTIVITY_OR_PROCESS_PATTERN_V0_1 =
  /^((?:veprimtaria|aktiviteti|procesi|veprimi)\s+(?:e|i|të|së)\s+[\p{L}\p{M}][\p{L}\p{M}\s'’,-]*?)[.!?]*$/u;

const INSTRUMENT_PURPOSE_PATTERN_V0_1 =
  /^((?:mjet|vegël|instrument)\s+(?:që\s+(?:përdoret|shërben)\s+për|për)\s+[\p{L}\p{M}][\p{L}\p{M}\s'’,-]*?)[.!?]*$/u;

const CITIZENSHIP_OR_NATIONALITY_PATTERN_V0_1 =
  /^((?:shtetas(?:e)?|personi\s+me\s+kombësi)\s+(?:(?:i|e)\s+)?[\p{L}\p{M}]+(?:\s+[\p{L}\p{M}]+)?)[.!?]*$/u;

const GEOGRAPHIC_RESIDENCE_PATTERN_V0_1 =
  /^((?:banor|banore)\s+(?:i|e)\s+[\p{L}\p{M}]+(?:\s+[\p{L}\p{M}]+)?)[.!?]*$/u;

const ADJECTIVE_PROPERTY_PATTERN_V0_1 =
  /^((?:që\s+(?:lidhet\s+me|i\s+përket|ka\s+(?:lidhje|të\s+bëjë)\s+me))\s+[\p{L}\p{M}][\p{L}\p{M}\s'’,-]*?)[.!?]*$/u;

const ILLUSTRATIVE_EXAMPLE_PATTERN_V0_1 =
  /(?:^|[\s([{])(?:p\.?\s*sh\.?|për\s+shembull)(?:$|[\s,.;:!?)}\]])/u;

const FIGURATIVE_CUE_PATTERN_V0_1 =
  /(?:^|\s)(?:figurativisht|në\s+kuptim\s+figurativ|në\s+kuptimin\s+figurativ|metaforikisht|si\s+metaforë|në\s+mënyrë\s+figurative)(?:$|\s|[,.!?;])/u;

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function snapshotInputV0_1(input: unknown): InputSnapshotV0_1 {
  if (!isRecordV0_1(input)) {
    return {
      valid: false,
      headword: null,
      definitionText: null,
      posTag: null,
      sourceRowOrdinal: null,
    };
  }

  const headword = typeof input.headword === "string" ? input.headword : null;
  const definitionText =
    typeof input.definitionText === "string" ? input.definitionText : null;
  const posTag =
    input.posTag === null || input.posTag === undefined || typeof input.posTag === "string"
      ? (typeof input.posTag === "string" ? input.posTag : null)
      : null;
  const rawOrdinal = input.sourceRowOrdinal;
  const sourceRowOrdinal =
    rawOrdinal === null || rawOrdinal === undefined
      ? null
      : Number.isSafeInteger(rawOrdinal) && (rawOrdinal as number) >= 0
        ? (rawOrdinal as number)
        : null;
  const posValid = input.posTag === null || input.posTag === undefined || typeof input.posTag === "string";
  const ordinalValid =
    rawOrdinal === null || rawOrdinal === undefined ||
    (Number.isSafeInteger(rawOrdinal) && (rawOrdinal as number) >= 0);

  return {
    valid:
      headword !== null && headword.trim().length > 0 &&
      definitionText !== null && posValid && ordinalValid,
    headword,
    definitionText,
    posTag,
    sourceRowOrdinal,
  };
}

function createNormalizedViewV0_1(original: string): NormalizedViewV0_1 {
  const codePoints = [...original];
  const spans: OriginalSpanV0_1[] = [];
  let normalized = "";
  let originalOffset = 0;

  for (let index = 0; index < codePoints.length; index += 1) {
    const start = originalOffset;
    let cluster = codePoints[index] ?? "";
    originalOffset += cluster.length;

    while (index + 1 < codePoints.length && /^\p{M}$/u.test(codePoints[index + 1] ?? "")) {
      index += 1;
      const mark = codePoints[index] ?? "";
      cluster += mark;
      originalOffset += mark.length;
    }

    const end = originalOffset;
    const folded = cluster.normalize("NFC").toLocaleLowerCase("sq-AL");
    normalized += folded;
    for (let unit = 0; unit < folded.length; unit += 1) {
      spans.push({ start, end });
    }
  }

  return {
    original,
    text: normalized,
    originalSpansByNormalizedCodeUnit: Object.freeze(spans),
  };
}

function trimRangeV0_1(text: string, start: number, end: number): TextRangeV0_1 {
  const value = text.slice(start, end);
  const leading = value.match(/^\s*/u)?.[0].length ?? 0;
  const trailing = value.match(/\s*$/u)?.[0].length ?? 0;
  return { start: start + leading, end: Math.max(start + leading, end - trailing) };
}

function originalSpanV0_1(
  view: NormalizedViewV0_1,
  normalizedStart: number,
  normalizedEnd: number,
): AlbanianAgentiveDefinitionEvidenceSpanV0_1 | null {
  if (normalizedStart < 0 || normalizedEnd <= normalizedStart) return null;
  const startMapping = view.originalSpansByNormalizedCodeUnit[normalizedStart];
  const endMapping = view.originalSpansByNormalizedCodeUnit[normalizedEnd - 1];
  if (!startMapping || !endMapping) return null;
  const start = startMapping.start;
  const end = endMapping.end;
  return Object.freeze({ start, end, text: view.original.slice(start, end) });
}

function capturedRangeV0_1(
  clause: TextRangeV0_1,
  match: RegExpExecArray,
  capturedText: string,
): TextRangeV0_1 | null {
  const relativeStart = match[0].indexOf(capturedText);
  if (relativeStart < 0) return null;
  return {
    start: clause.start + relativeStart,
    end: clause.start + relativeStart + capturedText.length,
  };
}

function splitClausesV0_1(text: string): readonly TextRangeV0_1[] {
  const clauses: TextRangeV0_1[] = [];
  const separator = /[;.!?\n\r]+/gu;
  let cursor = 0;
  for (const match of text.matchAll(separator)) {
    const start = match.index ?? cursor;
    const end = start + match[0].length;
    const range = trimRangeV0_1(text, cursor, start);
    if (range.end > range.start) clauses.push(range);
    cursor = end;
  }
  const finalRange = trimRangeV0_1(text, cursor, text.length);
  if (finalRange.end > finalRange.start) clauses.push(finalRange);
  return clauses;
}

function isAdjectivePosV0_1(posTag: string | null): boolean {
  if (posTag === null) return false;
  const normalized = posTag.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
  return normalized === "mbiemër" || normalized === "mbiemer" ||
    normalized === "adjective" || normalized === "adj" || normalized === "adj.";
}

function isIncompatibleHumanRolePosV0_1(posTag: string | null): boolean {
  if (posTag === null) return false;
  const normalized = posTag.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
  return normalized === "mbiemër" || normalized === "mbiemer" ||
    normalized === "adjective" || normalized === "adj" || normalized === "adj." ||
    normalized === "folje" || normalized === "verb" || normalized === "v.";
}

function isRoleHeadPrefixV0_1(clauseText: string): boolean {
  return ROLE_HEADS_V0_1.some((head) =>
    clauseText === head || clauseText.startsWith(`${head} `),
  );
}

function signalFromPatternV0_1(
  clause: TextRangeV0_1,
  clauseText: string,
  pattern: RegExp,
  classification: RuleSignalV0_1["classification"],
  matchedPattern: AlbanianAgentiveDefinitionPatternIdV0_1,
  reasonCode: AlbanianAgentiveDefinitionReasonCodeV0_1,
): RuleSignalV0_1 | null {
  const match = pattern.exec(clauseText);
  const capturedText = match?.[1];
  if (!match || !capturedText) return null;
  const range = capturedRangeV0_1(clause, match, capturedText);
  if (!range) return null;
  return { classification, matchedPattern, reasonCode, range };
}

function evaluateClauseV0_1(
  clause: TextRangeV0_1,
  clauseText: string,
  posTag: string | null,
): ClauseEvaluationV0_1 {
  const signals: RuleSignalV0_1[] = [];
  const unresolved: UnresolvedSignalV0_1[] = [];

  const incompletePrepositionalMatch =
    INCOMPLETE_PREPOSITIONAL_HUMAN_PREDICATE_PATTERN_V0_1.exec(clauseText);
  const incompletePrepositionalPhrase = incompletePrepositionalMatch?.groups?.["phrase"];
  if (incompletePrepositionalMatch && incompletePrepositionalPhrase) {
    const range = capturedRangeV0_1(
      clause,
      incompletePrepositionalMatch,
      incompletePrepositionalPhrase,
    );
    if (range) {
      unresolved.push({
        matchedPattern: "INCOMPLETE_PREPOSITIONAL_HUMAN_PREDICATE",
        reasonCode: "ROLE_COMPLEMENT_STRUCTURE_UNRESOLVED",
        range,
      });
    }
  }

  const explicitMatch = incompletePrepositionalMatch
    ? null
    : EXPLICIT_HUMAN_ROLE_PATTERN_V0_1.exec(clauseText);
  const explicitPhrase = explicitMatch?.groups?.["phrase"];
  if (explicitMatch && explicitPhrase) {
    const range = capturedRangeV0_1(clause, explicitMatch, explicitPhrase);
    if (range && explicitMatch.groups?.["negation"]) {
      unresolved.push({
        matchedPattern: "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE",
        reasonCode: "AGENT_PREDICATE_NEGATED",
        range,
      });
    } else if (range && isIncompatibleHumanRolePosV0_1(posTag)) {
      unresolved.push({
        matchedPattern: "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE",
        reasonCode: "HEADWORD_POS_CONFLICTS_WITH_HUMAN_ROLE_TEXT",
        range,
      });
    } else if (range) {
      signals.push({
        classification: "HUMAN_AGENT_ROLE",
        matchedPattern: "EXPLICIT_HUMAN_SUBJECT_QUALIFIED_PREDICATE",
        reasonCode: "EXPLICIT_HUMAN_ROLE_CONSTRUCTION_MATCHED",
        range,
      });
    }
  }

  const roleSignal = signalFromPatternV0_1(
    clause,
    clauseText,
    ROLE_HEAD_WITH_GENITIVE_COMPLEMENT_PATTERN_V0_1,
    "HUMAN_AGENT_ROLE",
    "ROLE_HEAD_WITH_GENITIVE_PLURAL_COMPLEMENT",
    "ROLE_HEAD_COMPLEMENT_CONSTRUCTION_MATCHED",
  );
  if (roleSignal && isIncompatibleHumanRolePosV0_1(posTag)) {
    unresolved.push({
      matchedPattern: roleSignal.matchedPattern,
      reasonCode: "HEADWORD_POS_CONFLICTS_WITH_HUMAN_ROLE_TEXT",
      range: roleSignal.range,
    });
  } else if (roleSignal) {
    signals.push(roleSignal);
  }

  const animalSignal = signalFromPatternV0_1(
    clause,
    clauseText,
    ANIMAL_OR_BIOLOGICAL_PATTERN_V0_1,
    "ANIMAL_OR_BIOLOGICAL",
    "ANIMAL_OR_BIOLOGICAL_SEMANTIC_HEAD",
    "ANIMAL_OR_BIOLOGICAL_DEFINITION_MATCHED",
  );
  if (animalSignal) signals.push(animalSignal);

  const activitySignal = signalFromPatternV0_1(
    clause,
    clauseText,
    ACTIVITY_OR_PROCESS_PATTERN_V0_1,
    "ACTIVITY_OR_PROCESS",
    "ACTIVITY_OR_PROCESS_NOMINAL_HEAD",
    "ACTIVITY_OR_PROCESS_DEFINITION_MATCHED",
  );
  if (activitySignal) signals.push(activitySignal);

  const instrumentSignal = signalFromPatternV0_1(
    clause,
    clauseText,
    INSTRUMENT_PURPOSE_PATTERN_V0_1,
    "INSTRUMENT_OR_TOOL",
    "INSTRUMENT_PURPOSE_CONSTRUCTION",
    "INSTRUMENT_OR_TOOL_DEFINITION_MATCHED",
  );
  if (instrumentSignal) signals.push(instrumentSignal);

  const demonymSignal = signalFromPatternV0_1(
    clause,
    clauseText,
    CITIZENSHIP_OR_NATIONALITY_PATTERN_V0_1,
    "DEMONYM_OR_NATIONALITY",
    "EXPLICIT_CITIZENSHIP_OR_NATIONALITY_DESCRIPTION",
    "CITIZENSHIP_OR_NATIONALITY_DEFINITION_MATCHED",
  );
  if (demonymSignal) signals.push(demonymSignal);

  const adjectiveSignal = signalFromPatternV0_1(
    clause,
    clauseText,
    ADJECTIVE_PROPERTY_PATTERN_V0_1,
    "ADJECTIVE_OR_PROPERTY",
    "ADJECTIVE_RELATIVE_PROPERTY_WITH_ADJECTIVE_POS",
    "ADJECTIVE_POS_AND_PROPERTY_FRAME_MATCHED",
  );
  if (adjectiveSignal) {
    if (isAdjectivePosV0_1(posTag)) {
      signals.push(adjectiveSignal);
    } else {
      unresolved.push({
        matchedPattern: "ADJECTIVE_RELATIVE_PROPERTY_WITH_ADJECTIVE_POS",
        reasonCode: "ADJECTIVE_POS_REQUIRED_FOR_PROPERTY_FRAME",
        range: adjectiveSignal.range,
      });
    }
  }

  const residenceSignal = signalFromPatternV0_1(
    clause,
    clauseText,
    GEOGRAPHIC_RESIDENCE_PATTERN_V0_1,
    "DEMONYM_OR_NATIONALITY",
    "GEOGRAPHIC_RESIDENCE_IS_NOT_NATIONALITY",
    "GEOGRAPHIC_RESIDENCE_DOES_NOT_ESTABLISH_NATIONALITY",
  );
  if (residenceSignal) {
    unresolved.push({
      matchedPattern: residenceSignal.matchedPattern,
      reasonCode: residenceSignal.reasonCode,
      range: residenceSignal.range,
    });
  }

  if (isRoleHeadPrefixV0_1(clauseText) && !roleSignal && !explicitMatch) {
    const bare = ROLE_HEADS_V0_1.includes(clauseText as (typeof ROLE_HEADS_V0_1)[number]);
    unresolved.push({
      matchedPattern: "AMBIGUOUS_ROLE_HEAD_WITHOUT_QUALIFIED_COMPLEMENT",
      reasonCode: bare
        ? "ROLE_HEAD_REQUIRES_QUALIFIED_COMPLEMENT"
        : "ROLE_COMPLEMENT_STRUCTURE_UNRESOLVED",
      range: { start: clause.start, end: clause.end },
    });
  }

  return { signals, unresolved };
}

function resultV0_1(
  input: InputSnapshotV0_1,
  classification: AlbanianAgentiveDefinitionClassificationV0_1,
  matchedPattern: AlbanianAgentiveDefinitionPatternIdV0_1 | null,
  evidenceSpan: AlbanianAgentiveDefinitionEvidenceSpanV0_1 | null,
  reasonCodes: readonly AlbanianAgentiveDefinitionReasonCodeV0_1[],
): AlbanianAgentiveDefinitionAnalyzerResultV0_1 {
  return Object.freeze({
    schemaVersion: ALBANIAN_AGENTIVE_DEFINITION_ANALYZER_SCHEMA_V0_1,
    analysisAuthority: ALBANIAN_AGENTIVE_DEFINITION_ANALYSIS_AUTHORITY_V0_1,
    headword: input.headword,
    definitionText: input.definitionText,
    posTag: input.posTag,
    sourceRowOrdinal: input.sourceRowOrdinal,
    classification,
    matchedPattern,
    evidenceSpan,
    reasonCodes: Object.freeze([...new Set(reasonCodes)].sort()),
  });
}

function wholeDefinitionSpanV0_1(
  view: NormalizedViewV0_1,
): AlbanianAgentiveDefinitionEvidenceSpanV0_1 | null {
  const trimmed = trimRangeV0_1(view.text, 0, view.text.length);
  return originalSpanV0_1(view, trimmed.start, trimmed.end);
}

/**
 * Classifies only bounded grammatical evidence in definitionText. This
 * synchronous analyzer does not consult headword morphology or external data.
 */
export function analyzeAlbanianAgentiveDefinitionV0_1(
  input: AlbanianAgentiveDefinitionAnalyzerInputV0_1,
): AlbanianAgentiveDefinitionAnalyzerResultV0_1 {
  const snapshot = snapshotInputV0_1(input);
  if (!snapshot.valid) {
    return resultV0_1(snapshot, "UNKNOWN_OR_NULL", null, null, ["ANALYZER_INPUT_INVALID"]);
  }
  const definitionText = snapshot.definitionText;
  if (definitionText === null || definitionText.trim().length === 0) {
    return resultV0_1(snapshot, "UNKNOWN_OR_NULL", null, null, ["ANALYZER_DEFINITION_EMPTY"]);
  }

  const view = createNormalizedViewV0_1(definitionText);
  const wholeSpan = wholeDefinitionSpanV0_1(view);
  if (!wholeSpan) {
    return resultV0_1(snapshot, "UNKNOWN_OR_NULL", null, null, ["INSUFFICIENT_ANALYZED_CONTEXT"]);
  }

  if (ILLUSTRATIVE_EXAMPLE_PATTERN_V0_1.test(view.text)) {
    return resultV0_1(
      snapshot,
      "UNKNOWN_OR_NULL",
      null,
      wholeSpan,
      ["ILLUSTRATIVE_EXAMPLE_IS_NOT_HEADWORD_EVIDENCE"],
    );
  }
  if (FIGURATIVE_CUE_PATTERN_V0_1.test(view.text)) {
    return resultV0_1(
      snapshot,
      "UNKNOWN_OR_NULL",
      null,
      wholeSpan,
      ["FIGURATIVE_CUE_REQUIRES_REVIEW"],
    );
  }

  const clauses = splitClausesV0_1(view.text);
  if (clauses.length === 0) {
    return resultV0_1(snapshot, "UNKNOWN_OR_NULL", null, wholeSpan, ["ANALYZER_DEFINITION_EMPTY"]);
  }

  const evaluations = clauses.map((clause) =>
    evaluateClauseV0_1(clause, view.text.slice(clause.start, clause.end), snapshot.posTag),
  );
  const allSignals = evaluations.flatMap((evaluation) => evaluation.signals);
  const allUnresolved = evaluations.flatMap((evaluation) => evaluation.unresolved);

  if (clauses.length > 1) {
    const classifications = new Set(allSignals.map((signal) => signal.classification));
    const reason: AlbanianAgentiveDefinitionReasonCodeV0_1 = classifications.size > 1
      ? "CONFLICTING_DEFINITION_SIGNALS"
      : "MULTI_CLAUSE_CONTEXT_UNRESOLVED";
    return resultV0_1(
      snapshot,
      "UNKNOWN_OR_NULL",
      "MULTI_CLAUSE_DEFINITION",
      wholeSpan,
      [reason],
    );
  }

  if (allSignals.length > 1) {
    const classifications = new Set(allSignals.map((signal) => signal.classification));
    return resultV0_1(
      snapshot,
      "UNKNOWN_OR_NULL",
      allSignals[0]?.matchedPattern ?? null,
      wholeSpan,
      [classifications.size > 1 ? "CONFLICTING_DEFINITION_SIGNALS" : "NO_SUPPORTED_DEFINITION_PATTERN"],
    );
  }

  if (allUnresolved.length > 0) {
    const unresolved = allUnresolved[0];
    return resultV0_1(
      snapshot,
      "UNKNOWN_OR_NULL",
      unresolved?.matchedPattern ?? null,
      unresolved?.range
        ? originalSpanV0_1(view, unresolved.range.start, unresolved.range.end)
        : wholeSpan,
      allUnresolved.map((item) => item.reasonCode),
    );
  }

  const signal = allSignals[0];
  if (signal) {
    return resultV0_1(
      snapshot,
      signal.classification,
      signal.matchedPattern,
      originalSpanV0_1(view, signal.range.start, signal.range.end),
      [signal.reasonCode],
    );
  }

  const clauseText = view.text.slice(clauses[0]?.start ?? 0, clauses[0]?.end ?? 0);
  const isBareLexicalReference = /^[\p{L}\p{M}]+(?:[-'’][\p{L}\p{M}]+)*$/u.test(clauseText);
  if (isBareLexicalReference) {
    const isRoleHead = ROLE_HEADS_V0_1.includes(clauseText as (typeof ROLE_HEADS_V0_1)[number]);
    return resultV0_1(
      snapshot,
      "UNKNOWN_OR_NULL",
      isRoleHead ? "AMBIGUOUS_ROLE_HEAD_WITHOUT_QUALIFIED_COMPLEMENT" : "BARE_LEXICAL_REFERENCE",
      wholeSpan,
      [isRoleHead ? "ROLE_HEAD_REQUIRES_QUALIFIED_COMPLEMENT" : "INSUFFICIENT_ANALYZED_CONTEXT"],
    );
  }

  return resultV0_1(
    snapshot,
    "UNKNOWN_OR_NULL",
    null,
    null,
    ["NO_SUPPORTED_DEFINITION_PATTERN", "ANALYZER_TEXT_ONLY_NOT_SOURCE_AUTHORITY"],
  );
}
