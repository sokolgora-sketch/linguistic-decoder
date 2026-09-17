import rawSourceDataset from "../../data/openInstrument/genericFunctionalWitnessSourceRecords.v1.json";
import {
  adaptVerifiedSourceRecordV0_1,
  OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1,
} from "../openInstrumentSourceAdapter.v0_1";
import type {
  EmbryoSourceRelationV0_1,
  MultiSourceEvidenceFamilyV0_1,
  MultiSourceTruthStatusV0_1,
} from "../multiSourceFunctionalDiscovery.v0_1";
import type {
  MultiSourceFunctionalResearchCitationV0_1,
  MultiSourceFunctionalResearchSourceStatusV0_1,
} from "../multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import {
  GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
  type GenericFunctionalWitnessQueryV1,
  type GenericFunctionalWitnessSourceAdapterV1,
  type GenericFunctionalWitnessSourceAdapterResultV1,
} from "./genericFunctionalWitnessDiscovery.v1";

export const GENERIC_FUNCTIONAL_WITNESS_SOURCE_DATASET_VERSION_V1 =
  "open-instrument.generic-functional-witness-source-dataset.v1" as const;

export const GENERIC_FUNCTIONAL_WITNESS_SOURCE_RECORD_VERSION_V1 =
  "open-instrument.generic-functional-witness-source-record.v1" as const;

export const GENERIC_FUNCTIONAL_WITNESS_SOURCE_AUTHORITY_V1 =
  "RESEARCH_EXTERNAL_SOURCE_INPUT" as const;

export const GENERIC_FUNCTIONAL_WITNESS_SOURCE_ADAPTER_ID_V1 =
  "frozen-real-source-records.v1" as const;

type GenericFunctionalWitnessSourceQueryRelationV1 =
  "authorized_transformation";

export type GenericFunctionalWitnessSourceAcquisitionRecordV1 = Readonly<{
  recordVersion: typeof GENERIC_FUNCTIONAL_WITNESS_SOURCE_RECORD_VERSION_V1;
  sourceRecordId: string;
  sourceTraditionId: string;
  language: string;
  languageVariety: string | null;
  sourceTitle: string;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string;
  sourceDateOrVersion: string;
  sourceUrlOrArchiveRef: string;
  entryLocator: string;
  sourceHashOrArchiveHash: string | null;
  sourceForm: string;
  sourceFormNormalization: "EXACT_PRESERVED";
  queryForm: string;
  queryNormalization: "STRUCTURAL_DISPLAY_UPPERCASE";
  lookupForm: string;
  lookupNormalization: typeof GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1;
  lookupTransformationAuthority: "STRUCTURAL_HYPOTHESIS_DISPLAY_FORM_V0_1";
  sourceFormRelation: "exact_form";
  queryRelation: GenericFunctionalWitnessSourceQueryRelationV1;
  relationOperationIds: readonly string[];
  evidenceFamily: MultiSourceEvidenceFamilyV0_1;
  gloss: string;
  attestationTruth: MultiSourceTruthStatusV0_1;
  sourceStatus: MultiSourceFunctionalResearchSourceStatusV0_1;
  citation: MultiSourceFunctionalResearchCitationV0_1;
}>;

export type GenericFunctionalWitnessSourceDatasetV1 = Readonly<{
  datasetVersion: typeof GENERIC_FUNCTIONAL_WITNESS_SOURCE_DATASET_VERSION_V1;
  sourceAuthority: typeof GENERIC_FUNCTIONAL_WITNESS_SOURCE_AUTHORITY_V1;
  records: readonly GenericFunctionalWitnessSourceAcquisitionRecordV1[];
}>;

export type ParseGenericFunctionalWitnessSourceDatasetResultV1 =
  | Readonly<{
      ok: true;
      dataset: GenericFunctionalWitnessSourceDatasetV1;
    }>
  | Readonly<{
      ok: false;
      reasonCodes: readonly string[];
    }>;

const EVIDENCE_FAMILIES_V1 = new Set<MultiSourceEvidenceFamilyV0_1>([
  "lexical_dictionary",
  "dialect_lexicon",
  "etymological_dictionary",
  "historical_dictionary",
  "corpus",
  "scholarly_paper",
  "reconstructed_lexicon",
  "other",
]);

const TRUTH_STATUSES_V1 = new Set<MultiSourceTruthStatusV0_1>([
  "fact",
  "inference",
  "hypothesis",
  "unknown",
]);

const SOURCE_STATUSES_V1 = new Set<MultiSourceFunctionalResearchSourceStatusV0_1>([
  "research_candidate",
  "reviewed_candidate",
]);

const DATASET_KEYS_V1 = ["datasetVersion", "sourceAuthority", "records"] as const;

const RECORD_KEYS_V1 = [
  "recordVersion",
  "sourceRecordId",
  "sourceTraditionId",
  "language",
  "languageVariety",
  "sourceTitle",
  "sourceAuthorOrEditor",
  "sourcePublisherOrHost",
  "sourceDateOrVersion",
  "sourceUrlOrArchiveRef",
  "entryLocator",
  "sourceHashOrArchiveHash",
  "sourceForm",
  "sourceFormNormalization",
  "queryForm",
  "queryNormalization",
  "lookupForm",
  "lookupNormalization",
  "lookupTransformationAuthority",
  "sourceFormRelation",
  "queryRelation",
  "relationOperationIds",
  "evidenceFamily",
  "gloss",
  "attestationTruth",
  "sourceStatus",
  "citation",
] as const;

const CITATION_KEYS_V1 = [
  "citationId",
  "sourceTitle",
  "sourceAuthorOrEditor",
  "sourcePublisherOrHost",
  "sourceDateOrVersion",
  "sourceUrlOrArchiveRef",
  "entryLocator",
  "sourceHashOrArchiveHash",
  "attestedForm",
  "attestedGloss",
  "provenanceGroupId",
] as const;

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function exactTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    value === value.normalize("NFC")
  );
}

function nullableExactTextV1(value: unknown): value is string | null {
  return value === null || exactTextV1(value);
}

function hasExactKeysV1(
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expected].sort());
}

function sortTextV1(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function citationIsValidV1(
  value: unknown,
  sourceForm: string,
  gloss: string,
): value is MultiSourceFunctionalResearchCitationV0_1 {
  if (!isRecordV1(value) || !hasExactKeysV1(value, CITATION_KEYS_V1)) {
    return false;
  }

  return (
    exactTextV1(value.citationId) &&
    exactTextV1(value.sourceTitle) &&
    nullableExactTextV1(value.sourceAuthorOrEditor) &&
    exactTextV1(value.sourcePublisherOrHost) &&
    exactTextV1(value.sourceDateOrVersion) &&
    exactTextV1(value.sourceUrlOrArchiveRef) &&
    exactTextV1(value.entryLocator) &&
    nullableExactTextV1(value.sourceHashOrArchiveHash) &&
    value.attestedForm === sourceForm &&
    value.attestedGloss === gloss &&
    exactTextV1(value.provenanceGroupId)
  );
}

function verifiedSourceRecordIsValidV1(
  value: Record<string, unknown>,
): boolean {
  const result = adaptVerifiedSourceRecordV0_1({
    sourceRecordVersion: OPEN_INSTRUMENT_VERIFIED_SOURCE_RECORD_VERSION_V0_1,
    sourceRecordId: value.sourceRecordId,
    sourceTraditionId: value.sourceTraditionId,
    language: value.language,
    sourceTitle: value.sourceTitle,
    sourceAuthorOrEditor: value.sourceAuthorOrEditor,
    sourcePublisherOrHost: value.sourcePublisherOrHost,
    sourceDateOrVersion: value.sourceDateOrVersion,
    sourceUrlOrArchiveRef: value.sourceUrlOrArchiveRef,
    entryLocator: value.entryLocator,
    sourceHashOrArchiveHash: value.sourceHashOrArchiveHash,
    attestedForm: value.sourceForm,
    attestedGloss: value.gloss,
  });

  return result.ok && result.admissible;
}

function parseRecordV1(
  value: unknown,
  index: number,
): GenericFunctionalWitnessSourceAcquisitionRecordV1 | null {
  if (!isRecordV1(value) || !hasExactKeysV1(value, RECORD_KEYS_V1)) {
    return null;
  }

  const sourceForm = value.sourceForm;
  const queryForm = value.queryForm;
  const lookupForm = value.lookupForm;

  if (
    value.recordVersion !== GENERIC_FUNCTIONAL_WITNESS_SOURCE_RECORD_VERSION_V1 ||
    !exactTextV1(value.sourceRecordId) ||
    !exactTextV1(value.sourceTraditionId) ||
    !exactTextV1(value.language) ||
    !nullableExactTextV1(value.languageVariety) ||
    !exactTextV1(value.sourceTitle) ||
    !nullableExactTextV1(value.sourceAuthorOrEditor) ||
    !exactTextV1(value.sourcePublisherOrHost) ||
    !exactTextV1(value.sourceDateOrVersion) ||
    !exactTextV1(value.sourceUrlOrArchiveRef) ||
    !exactTextV1(value.entryLocator) ||
    !nullableExactTextV1(value.sourceHashOrArchiveHash) ||
    !exactTextV1(sourceForm) ||
    value.sourceFormNormalization !== "EXACT_PRESERVED" ||
    !exactTextV1(queryForm) ||
    value.queryNormalization !== "STRUCTURAL_DISPLAY_UPPERCASE" ||
    !exactTextV1(lookupForm) ||
    value.lookupNormalization !== GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1 ||
    value.lookupTransformationAuthority !== "STRUCTURAL_HYPOTHESIS_DISPLAY_FORM_V0_1" ||
    value.sourceFormRelation !== "exact_form" ||
    value.queryRelation !== "authorized_transformation" ||
    !Array.isArray(value.relationOperationIds) ||
    value.relationOperationIds.length === 0 ||
    !value.relationOperationIds.every(exactTextV1) ||
    !EVIDENCE_FAMILIES_V1.has(value.evidenceFamily as MultiSourceEvidenceFamilyV0_1) ||
    !exactTextV1(value.gloss) ||
    !TRUTH_STATUSES_V1.has(value.attestationTruth as MultiSourceTruthStatusV0_1) ||
    !SOURCE_STATUSES_V1.has(
      value.sourceStatus as MultiSourceFunctionalResearchSourceStatusV0_1,
    ) ||
    !citationIsValidV1(value.citation, sourceForm, value.gloss) ||
    !verifiedSourceRecordIsValidV1(value)
  ) {
    return null;
  }

  if (
    queryForm !== lookupForm ||
    lookupForm !== sourceForm.toLocaleUpperCase("en-US") ||
    (value.citation as Record<string, unknown>).sourceTitle !== value.sourceTitle ||
    (value.citation as Record<string, unknown>).sourcePublisherOrHost !==
      value.sourcePublisherOrHost ||
    (value.citation as Record<string, unknown>).sourceDateOrVersion !==
      value.sourceDateOrVersion ||
    (value.citation as Record<string, unknown>).sourceUrlOrArchiveRef !==
      value.sourceUrlOrArchiveRef ||
    (value.citation as Record<string, unknown>).entryLocator !== value.entryLocator
  ) {
    return null;
  }

  return {
    recordVersion: GENERIC_FUNCTIONAL_WITNESS_SOURCE_RECORD_VERSION_V1,
    sourceRecordId: value.sourceRecordId,
    sourceTraditionId: value.sourceTraditionId,
    language: value.language,
    languageVariety: value.languageVariety,
    sourceTitle: value.sourceTitle,
    sourceAuthorOrEditor: value.sourceAuthorOrEditor,
    sourcePublisherOrHost: value.sourcePublisherOrHost,
    sourceDateOrVersion: value.sourceDateOrVersion,
    sourceUrlOrArchiveRef: value.sourceUrlOrArchiveRef,
    entryLocator: value.entryLocator,
    sourceHashOrArchiveHash: value.sourceHashOrArchiveHash,
    sourceForm,
    sourceFormNormalization: "EXACT_PRESERVED",
    queryForm,
    queryNormalization: "STRUCTURAL_DISPLAY_UPPERCASE",
    lookupForm,
    lookupNormalization: GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
    lookupTransformationAuthority: "STRUCTURAL_HYPOTHESIS_DISPLAY_FORM_V0_1",
    sourceFormRelation: "exact_form",
    queryRelation: "authorized_transformation",
    relationOperationIds: [...value.relationOperationIds].sort(sortTextV1),
    evidenceFamily: value.evidenceFamily as MultiSourceEvidenceFamilyV0_1,
    gloss: value.gloss,
    attestationTruth: value.attestationTruth as MultiSourceTruthStatusV0_1,
    sourceStatus:
      value.sourceStatus as MultiSourceFunctionalResearchSourceStatusV0_1,
    citation: { ...(value.citation as MultiSourceFunctionalResearchCitationV0_1) },
  };
}

export function parseGenericFunctionalWitnessSourceDatasetV1(
  value: unknown,
): ParseGenericFunctionalWitnessSourceDatasetResultV1 {
  if (
    !isRecordV1(value) ||
    !hasExactKeysV1(value, DATASET_KEYS_V1) ||
    value.datasetVersion !== GENERIC_FUNCTIONAL_WITNESS_SOURCE_DATASET_VERSION_V1 ||
    value.sourceAuthority !== GENERIC_FUNCTIONAL_WITNESS_SOURCE_AUTHORITY_V1 ||
    !Array.isArray(value.records)
  ) {
    return { ok: false, reasonCodes: ["DATASET_INVALID"] };
  }

  const records = value.records.map(parseRecordV1);
  if (records.some((record) => record === null)) {
    return { ok: false, reasonCodes: ["SOURCE_RECORD_INVALID"] };
  }

  const parsedRecords = records as GenericFunctionalWitnessSourceAcquisitionRecordV1[];
  const sourceRecordIds = parsedRecords.map((record) => record.sourceRecordId);
  if (new Set(sourceRecordIds).size !== sourceRecordIds.length) {
    return { ok: false, reasonCodes: ["SOURCE_RECORD_ID_COLLISION"] };
  }

  const dataset: GenericFunctionalWitnessSourceDatasetV1 = {
    datasetVersion: GENERIC_FUNCTIONAL_WITNESS_SOURCE_DATASET_VERSION_V1,
    sourceAuthority: GENERIC_FUNCTIONAL_WITNESS_SOURCE_AUTHORITY_V1,
    records: parsedRecords.sort((left, right) =>
      sortTextV1(left.sourceRecordId, right.sourceRecordId),
    ),
  };

  return { ok: true, dataset: deepFreezeV1(dataset) };
}

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }

  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return value;
}

export function loadGenericFunctionalWitnessSourceDatasetV1():
  GenericFunctionalWitnessSourceDatasetV1 {
  const parsed = parseGenericFunctionalWitnessSourceDatasetV1(rawSourceDataset);
  if (!parsed.ok) {
    throw new Error(`invalid generic witness source dataset: ${parsed.reasonCodes.join(",")}`);
  }
  return parsed.dataset;
}

function toLane1RecordV1(
  record: GenericFunctionalWitnessSourceAcquisitionRecordV1,
  query: GenericFunctionalWitnessQueryV1,
) {
  return {
    queryForm: query.embryo,
    sourceId: record.sourceRecordId,
    evidenceFamily: record.evidenceFamily,
    language: record.language,
    languageVariety: record.languageVariety,
    sourceForm: record.sourceForm,
    sourceFormNormalization: "EXACT_PRESERVED" as const,
    gloss: record.gloss,
    citationRefs: [record.citation.citationId],
    embryoRelation: record.queryRelation,
    relationOperationIds: [...record.relationOperationIds],
    attestationTruth: record.attestationTruth,
    sourceStatus: record.sourceStatus,
    sourceProvenance: {
      sourceRecordId: record.sourceRecordId,
      sourceTraditionId: record.sourceTraditionId,
      sourceTitle: record.sourceTitle,
      sourceDateOrVersion: record.sourceDateOrVersion,
      sourceUrlOrArchiveRef: record.sourceUrlOrArchiveRef,
      entryLocator: record.entryLocator,
      sourceHashOrArchiveHash: record.sourceHashOrArchiveHash,
      languageVariety: record.languageVariety,
    },
  };
}

export function createGenericFunctionalWitnessSourceAdapterV1(
  dataset: GenericFunctionalWitnessSourceDatasetV1 =
    loadGenericFunctionalWitnessSourceDatasetV1(),
): GenericFunctionalWitnessSourceAdapterV1 {
  const records = [...dataset.records].sort((left, right) =>
    sortTextV1(left.sourceRecordId, right.sourceRecordId),
  );

  return Object.freeze({
    adapterId: GENERIC_FUNCTIONAL_WITNESS_SOURCE_ADAPTER_ID_V1,
    query(input: GenericFunctionalWitnessQueryV1): GenericFunctionalWitnessSourceAdapterResultV1 {
      return {
        ok: true,
        records: records
          .filter((record) => record.lookupForm === input.embryo)
          .map((record) => toLane1RecordV1(record, input)),
      };
    },
  });
}
