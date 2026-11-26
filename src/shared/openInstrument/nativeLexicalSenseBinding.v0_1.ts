import {
  ENGLISH_KAIKKI_SOURCE_DATE_OR_VERSION_V0_1,
  ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1,
  ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1,
  ENGLISH_KAIKKI_SOURCE_TITLE_V0_1,
  type EnglishKaikkiSourceRecordV0_1,
} from "./englishKaikkiSourceFamilyAdapter.v0_1";
import {
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
  ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1,
  normalizeEnglishLexicalJoinKeyV0_1,
} from "./englishLexicalSenseSourceContract.v0_1";

export const NATIVE_LEXICAL_TARGET_SENSE_SCHEMA_V0_1 =
  "open-instrument.native-lexical-target-sense.v0_1" as const;

export type NativeLexicalTargetSenseLookupStatusV0_1 =
  | "MATCHES_FOUND"
  | "LEXICAL_SENSE_SOURCE_NOT_FOUND"
  | "LEXICAL_SENSE_GLOSS_NOT_FOUND"
  | "UNAVAILABLE"
  | "NOT_QUERIED";

export type NativeLexicalTargetSenseAlternativeV0_1 = Readonly<{
  senseId: string;
  sourceSenseId: string;
  senseOrdinal: number;
  inputForm: string;
  sourceForm: string;
  language: "English";
  languageCode: "en";
  partOfSpeech: string;
  glosses: readonly string[];
  rawGlosses: readonly string[];
  tags: readonly string[];
  rawTags: readonly string[];
  selectedGlossCandidates: readonly string[];
  sourceStatus: "research_candidate";
  evidenceClassification: "SOURCE_REPORTED_UNREVIEWED_CANDIDATE";
  sourceRecord: Readonly<{
    sourceRecordId: string;
    sourceFamilyId: typeof ENGLISH_KAIKKI_SOURCE_FAMILY_ID_V0_1;
    snapshotId: typeof ENGLISH_KAIKKI_SNAPSHOT_ID_V0_1;
    recordOrdinal: number;
    recordSha256: string;
    entryLocator: string;
    sourceUrl: typeof ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1;
    sourceTitle: typeof ENGLISH_KAIKKI_SOURCE_TITLE_V0_1;
    sourceDateOrVersion: typeof ENGLISH_KAIKKI_SOURCE_DATE_OR_VERSION_V0_1;
    snapshotBytes: typeof ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1;
    snapshotSha256: typeof ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1;
  }>;
  citationRefs: readonly string[];
}>;

export type NativeLexicalTargetSenseAlternativesV0_1 = Readonly<{
  schemaVersion: typeof NATIVE_LEXICAL_TARGET_SENSE_SCHEMA_V0_1;
  inputForm: string;
  language: "English" | null;
  lookupStatus: NativeLexicalTargetSenseLookupStatusV0_1;
  reasonCode: string | null;
  alternatives: readonly NativeLexicalTargetSenseAlternativeV0_1[];
  sourceStatus: "research_candidate" | null;
  claimBoundary: "exact lexical source alternatives only; not reviewed authority, morphology, functional correspondence, or historical origin";
}>;

export type NativeLexicalTargetSenseSelectionV0_1 = Readonly<{
  status:
    | "NOT_REQUESTED"
    | "BOUND"
    | "SENSE_SELECTED_GLOSS_UNRESOLVED"
    | "SENSE_SELECTED_NO_GLOSS"
    | "SENSE_ID_NOT_FOUND"
    | "GLOSS_NOT_FOUND"
    | "SOURCE_LOOKUP_UNAVAILABLE"
    | "SOURCE_LOOKUP_NOT_APPLICABLE";
  requestedSenseId: string | null;
  requestedGloss: string | null;
  selectedSenseId: string | null;
  selectedGloss: string | null;
  sourceRecordId: string | null;
  sourceStatus: "research_candidate" | null;
  reasonCode: string | null;
  userDecisionPosture: "user_decides";
}>;

export type NativeLexicalTargetSenseResultV0_1 = Readonly<
  NativeLexicalTargetSenseAlternativesV0_1 & {
    selection: NativeLexicalTargetSenseSelectionV0_1;
    noAutomaticWinner: true;
    userDecisionPosture: "user_decides";
  }
>;

function sourceGlossesV0_1(sense: EnglishKaikkiSourceRecordV0_1["senses"][number]): readonly string[] {
  if (sense.glosses && sense.glosses.length > 0) return sense.glosses;
  return sense.raw_glosses ?? [];
}

export function buildNativeLexicalTargetSenseAlternativesV0_1(input: Readonly<{
  inputForm: string;
  lookupStatus: NativeLexicalTargetSenseLookupStatusV0_1;
  sourceRecords?: readonly EnglishKaikkiSourceRecordV0_1[];
  reasonCode?: string | null;
}>): NativeLexicalTargetSenseAlternativesV0_1 {
  const sourceRecords = input.sourceRecords;
  if (
    (input.lookupStatus === "MATCHES_FOUND" || input.lookupStatus === "LEXICAL_SENSE_GLOSS_NOT_FOUND") &&
    sourceRecords === undefined
  ) {
    return Object.freeze({
      schemaVersion: NATIVE_LEXICAL_TARGET_SENSE_SCHEMA_V0_1,
      inputForm: input.inputForm,
      language: "English",
      lookupStatus: "UNAVAILABLE",
      reasonCode: "SOURCE_RECORDS_NOT_EXPOSED",
      alternatives: Object.freeze([]),
      sourceStatus: null,
      claimBoundary: "exact lexical source alternatives only; not reviewed authority, morphology, functional correspondence, or historical origin",
    });
  }

  if (sourceRecords !== undefined) {
    const inputKey = normalizeEnglishLexicalJoinKeyV0_1(input.inputForm);
    const recordsAreBound = sourceRecords.every((record) =>
      record.lang === "English" &&
      record.lang_code === "en" &&
      record.queryForm === inputKey &&
      normalizeEnglishLexicalJoinKeyV0_1(record.word) === inputKey,
    );
    if (!recordsAreBound) {
      return Object.freeze({
        schemaVersion: NATIVE_LEXICAL_TARGET_SENSE_SCHEMA_V0_1,
        inputForm: input.inputForm,
        language: "English",
        lookupStatus: "UNAVAILABLE",
        reasonCode: "SOURCE_RECORD_TARGET_IDENTITY_MISMATCH",
        alternatives: Object.freeze([]),
        sourceStatus: null,
        claimBoundary: "exact lexical source alternatives only; not reviewed authority, morphology, functional correspondence, or historical origin",
      });
    }
  }

  const alternatives = (sourceRecords ?? []).flatMap((record) =>
    record.senses.map((sense): NativeLexicalTargetSenseAlternativeV0_1 => Object.freeze({
      senseId: sense.senseId,
      sourceSenseId: sense.sourceSenseId,
      senseOrdinal: sense.senseOrdinal,
      inputForm: input.inputForm,
      sourceForm: record.word,
      language: "English",
      languageCode: "en",
      partOfSpeech: record.pos,
      glosses: Object.freeze([...(sense.glosses ?? [])]),
      rawGlosses: Object.freeze([...(sense.raw_glosses ?? [])]),
      tags: Object.freeze([...(sense.tags ?? [])]),
      rawTags: Object.freeze([...(sense.raw_tags ?? [])]),
      selectedGlossCandidates: Object.freeze([...sourceGlossesV0_1(sense)]),
      sourceStatus: "research_candidate",
      evidenceClassification: "SOURCE_REPORTED_UNREVIEWED_CANDIDATE",
      sourceRecord: Object.freeze({
        sourceRecordId: record.sourceRecordId,
        sourceFamilyId: record.sourceFamilyId,
        snapshotId: record.snapshotId,
        recordOrdinal: record.recordOrdinal,
        recordSha256: record.recordSha256,
        entryLocator: record.entryLocator,
        sourceUrl: ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1,
        sourceTitle: ENGLISH_KAIKKI_SOURCE_TITLE_V0_1,
        sourceDateOrVersion: ENGLISH_KAIKKI_SOURCE_DATE_OR_VERSION_V0_1,
        snapshotBytes: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_BYTES_V0_1,
        snapshotSha256: ENGLISH_LEXICAL_SENSE_SOURCE_ARTIFACT_SHA256_V0_1,
      }),
      citationRefs: Object.freeze([ENGLISH_LEXICAL_SENSE_SOURCE_URL_V0_1, record.entryLocator]),
    })),
  );

  const lookupStatus = input.lookupStatus === "MATCHES_FOUND" && alternatives.length === 0
    ? "LEXICAL_SENSE_GLOSS_NOT_FOUND"
    : input.lookupStatus;
  return Object.freeze({
    schemaVersion: NATIVE_LEXICAL_TARGET_SENSE_SCHEMA_V0_1,
    inputForm: input.inputForm,
    language: input.lookupStatus === "NOT_QUERIED" ? null : "English",
    lookupStatus,
    reasonCode: input.reasonCode ?? null,
    alternatives: Object.freeze(alternatives),
    sourceStatus: alternatives.length > 0 ? "research_candidate" : null,
    claimBoundary: "exact lexical source alternatives only; not reviewed authority, morphology, functional correspondence, or historical origin",
  });
}

export function bindNativeLexicalTargetSenseV0_1(input: Readonly<{
  alternatives: NativeLexicalTargetSenseAlternativesV0_1;
  requestedSenseId?: string | null;
  requestedGloss?: string | null;
}>): NativeLexicalTargetSenseSelectionV0_1 {
  const requestedSenseId = input.requestedSenseId ?? null;
  const requestedGloss = input.requestedGloss ?? null;
  const base = {
    requestedSenseId,
    requestedGloss,
    userDecisionPosture: "user_decides" as const,
  };
  if (requestedSenseId === null) {
    return Object.freeze({
      ...base,
      status: "NOT_REQUESTED",
      selectedSenseId: null,
      selectedGloss: null,
      sourceRecordId: null,
      sourceStatus: null,
      reasonCode: null,
    });
  }
  if (input.alternatives.language !== "English" || input.alternatives.lookupStatus === "NOT_QUERIED") {
    return Object.freeze({
      ...base,
      status: "SOURCE_LOOKUP_NOT_APPLICABLE",
      selectedSenseId: null,
      selectedGloss: null,
      sourceRecordId: null,
      sourceStatus: null,
      reasonCode: "ENGLISH_SOURCE_LOOKUP_NOT_APPLICABLE",
    });
  }
  if (input.alternatives.lookupStatus === "UNAVAILABLE") {
    return Object.freeze({
      ...base,
      status: "SOURCE_LOOKUP_UNAVAILABLE",
      selectedSenseId: null,
      selectedGloss: null,
      sourceRecordId: null,
      sourceStatus: null,
      reasonCode: input.alternatives.reasonCode ?? "ENGLISH_SOURCE_LOOKUP_UNAVAILABLE",
    });
  }

  const sense = input.alternatives.alternatives.find((candidate) => candidate.senseId === requestedSenseId);
  if (!sense) {
    return Object.freeze({
      ...base,
      status: "SENSE_ID_NOT_FOUND",
      selectedSenseId: null,
      selectedGloss: null,
      sourceRecordId: null,
      sourceStatus: null,
      reasonCode: "SENSE_ID_NOT_IN_EXACT_TARGET_WORD_SOURCE_RECORDS",
    });
  }

  const glosses = sense.selectedGlossCandidates;
  if (requestedGloss !== null) {
    if (!glosses.includes(requestedGloss)) {
      return Object.freeze({
        ...base,
        status: "GLOSS_NOT_FOUND",
        selectedSenseId: sense.senseId,
        selectedGloss: null,
        sourceRecordId: sense.sourceRecord.sourceRecordId,
        sourceStatus: sense.sourceStatus,
        reasonCode: "GLOSS_NOT_IN_SELECTED_SOURCE_SENSE",
      });
    }
    return Object.freeze({
      ...base,
      status: "BOUND",
      selectedSenseId: sense.senseId,
      selectedGloss: requestedGloss,
      sourceRecordId: sense.sourceRecord.sourceRecordId,
      sourceStatus: sense.sourceStatus,
      reasonCode: null,
    });
  }

  if (glosses.length === 1) {
    return Object.freeze({
      ...base,
      status: "BOUND",
      selectedSenseId: sense.senseId,
      selectedGloss: glosses[0] ?? null,
      sourceRecordId: sense.sourceRecord.sourceRecordId,
      sourceStatus: sense.sourceStatus,
      reasonCode: null,
    });
  }
  return Object.freeze({
    ...base,
    status: glosses.length === 0 ? "SENSE_SELECTED_NO_GLOSS" : "SENSE_SELECTED_GLOSS_UNRESOLVED",
    selectedSenseId: sense.senseId,
    selectedGloss: null,
    sourceRecordId: sense.sourceRecord.sourceRecordId,
    sourceStatus: sense.sourceStatus,
    reasonCode: glosses.length === 0 ? "SELECTED_SOURCE_SENSE_HAS_NO_GLOSS" : "EXPLICIT_GLOSS_SELECTION_REQUIRED",
  });
}

export function buildNativeLexicalTargetSenseResultV0_1(
  alternatives: NativeLexicalTargetSenseAlternativesV0_1,
  selection: NativeLexicalTargetSenseSelectionV0_1,
): NativeLexicalTargetSenseResultV0_1 {
  return Object.freeze({
    ...alternatives,
    selection,
    noAutomaticWinner: true,
    userDecisionPosture: "user_decides",
  });
}
