import {
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
} from "./albanianKaikkiExactLexicalSourceIdentity.v0_1";

export type AlbanianStructuralBoundaryStatusV0_1 =
  | "SOURCE_SUPPORTED"
  | "STRUCTURAL_ONLY"
  | "MISMATCH"
  | "UNKNOWN";

export type AlbanianStructuralSourceRecordV0_1 = {
  sourceLemma: string;
  sourceRecordId: string;
  entryLocator: string;
  sourceFileLine: number;
  partOfSpeech: string;
  sourceSenseIds: string[];
  sourceFieldStatus: "present" | "not_present_in_record";
  morphology: {
    kind: "prefix" | "suffix";
    sourceBaseForm: string;
    affix: string;
    sourceField: "etymology_templates[0]";
    sourceScope: "source_record_level";
    adjudication: "source_reported_not_independently_adjudicated";
  } | null;
  sourceCaveat: string;
};

export const ALBANIAN_STRUCTURAL_SOURCE_IDENTITY_V0_1 = {
  sourceFamilyId: ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
  bytes: ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  sha256: ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
  sourceArtifact: "frozen Kaikki Albanian JSONL snapshot",
} as const;

/**
 * Small provenance index for the four exposed research examples. It stores
 * record identities and morphological template fields only, not definitions.
 */
export const ALBANIAN_STRUCTURAL_SOURCE_RECORDS_V0_1: Record<
  string,
  AlbanianStructuralSourceRecordV0_1
> = {
  planet: {
    sourceLemma: "planet",
    sourceRecordId: "kaikki-albanian-jsonl:word=planet:ordinal=0",
    entryLocator: "jsonl://word/planet/match/0",
    sourceFileLine: 11,
    partOfSpeech: "noun",
    sourceSenseIds: ["en-planet-sq-noun-y1gV~lw8"],
    sourceFieldStatus: "not_present_in_record",
    morphology: null,
    sourceCaveat: "No etymology or derivational template field is present in this frozen record.",
  },
  shkruaj: {
    sourceLemma: "shkruaj",
    sourceRecordId: "kaikki-albanian-jsonl:word=shkruaj:ordinal=0",
    entryLocator: "jsonl://word/shkruaj/match/0",
    sourceFileLine: 2019,
    partOfSpeech: "verb",
    sourceSenseIds: [
      "en-shkruaj-sq-verb-GyIdbR6y",
      "en-shkruaj-sq-verb-aIwiB1Ed",
      "en-shkruaj-sq-verb-cr0PfHQD",
    ],
    sourceFieldStatus: "present",
    morphology: {
      kind: "prefix",
      sourceBaseForm: "kruaj",
      affix: "sh",
      sourceField: "etymology_templates[0]",
      sourceScope: "source_record_level",
      adjudication: "source_reported_not_independently_adjudicated",
    },
    sourceCaveat: "The record contains competing etymology accounts; no exact sense-level relation is stated.",
  },
  shkronjë: {
    sourceLemma: "shkronjë",
    sourceRecordId: "kaikki-albanian-jsonl:word=shkronj%C3%AB:ordinal=0",
    entryLocator: "jsonl://word/shkronj%C3%AB/match/0",
    sourceFileLine: 2611,
    partOfSpeech: "noun",
    sourceSenseIds: ["en-shkronjë-sq-noun-827aZGDv"],
    sourceFieldStatus: "present",
    morphology: {
      kind: "suffix",
      sourceBaseForm: "shkruaj",
      affix: "onjë",
      sourceField: "etymology_templates[0]",
      sourceScope: "source_record_level",
      adjudication: "source_reported_not_independently_adjudicated",
    },
    sourceCaveat: "The suffix boundary is source-reported; the source base form is not the surface stem SHKR.",
  },
  shkrim: {
    sourceLemma: "shkrim",
    sourceRecordId: "kaikki-albanian-jsonl:word=shkrim:ordinal=0",
    entryLocator: "jsonl://word/shkrim/match/0",
    sourceFileLine: 5057,
    partOfSpeech: "noun",
    sourceSenseIds: ["en-shkrim-sq-noun-7ocRBeh1"],
    sourceFieldStatus: "present",
    morphology: {
      kind: "suffix",
      sourceBaseForm: "shkruaj",
      affix: "im",
      sourceField: "etymology_templates[0]",
      sourceScope: "source_record_level",
      adjudication: "source_reported_not_independently_adjudicated",
    },
    sourceCaveat: "The suffix boundary is source-reported; the source base form is not the surface stem SHKR.",
  },
};

export const ALBANIAN_JETE_SOURCE_RECORD_V0_1 = {
  sourceLemma: "jetë",
  sourceRecordId: "kaikki-albanian-jsonl:word=jet%C3%AB:ordinal=0",
  entryLocator: "jsonl://word/jet%C3%AB/match/0",
  sourceFileLine: 2088,
  sourceRegister: "not_marked_by_headword_record",
  dialectalSenseIds: [
    "en-jetë-sq-noun-VFog-vfL",
    "en-jetë-sq-noun-SG6kYiTR",
    "en-jetë-sq-noun-Vperynox",
  ],
  bareJetFormInThisNounRecord: false,
} as const;
