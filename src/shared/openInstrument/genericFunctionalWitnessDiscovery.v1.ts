import type {
  EmbryoSourceRelationV0_1,
  MultiSourceEvidenceFamilyV0_1,
  MultiSourceTruthStatusV0_1,
} from "../multiSourceFunctionalDiscovery.v0_1";
import {
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1,
  type MultiSourceFunctionalResearchEvidenceRowV0_1,
  type MultiSourceFunctionalResearchSourceStatusV0_1,
} from "../multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import {
  isSevenVoiceKey,
  type SevenVoiceKey,
} from "../sevenVoiceOrderedViews.v0.1";

export const GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1 =
  "open-instrument.generic-functional-witness-discovery.v1" as const;

export const GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1 =
  "EXACT_NFC" as const;

export type GenericFunctionalWitnessQueryV1 = Readonly<{
  schemaVersion: typeof GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1;
  embryo: string;
  voicePath: readonly SevenVoiceKey[];
  queryNormalization: typeof GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1;
}>;

export type GenericFunctionalWitnessSourceProvenanceV1 = Readonly<{
  sourceRecordId: string;
  sourceTraditionId: string;
  sourceTitle: string;
  sourceDateOrVersion: string;
  sourceUrlOrArchiveRef: string;
  entryLocator: string;
  sourceHashOrArchiveHash: string | null;
  languageVariety: string | null;
}>;

export type GenericFunctionalWitnessSourceRecordV1 = Readonly<{
  queryForm: string;
  sourceId: string;
  evidenceFamily: MultiSourceEvidenceFamilyV0_1;
  language: string;
  languageVariety?: string | null;
  sourceForm: string;
  sourceFormNormalization: "EXACT_PRESERVED";
  gloss: string;
  citationRefs: readonly string[];
  embryoRelation: EmbryoSourceRelationV0_1;
  relationOperationIds: readonly string[];
  attestationTruth: MultiSourceTruthStatusV0_1;
  sourceStatus: MultiSourceFunctionalResearchSourceStatusV0_1;
  sourceProvenance?: GenericFunctionalWitnessSourceProvenanceV1;
}>;

export type GenericFunctionalWitnessSourceAdapterResultV1 =
  | Readonly<{
      ok: true;
      records: readonly GenericFunctionalWitnessSourceRecordV1[];
    }>
  | Readonly<{
      ok: false;
      reasonCode: "SOURCE_ADAPTER_FAILURE";
    }>;

export type GenericFunctionalWitnessSourceAdapterV1 = Readonly<{
  adapterId: string;
  query: (
    input: GenericFunctionalWitnessQueryV1,
  ) => GenericFunctionalWitnessSourceAdapterResultV1;
}>;

export type GenericFunctionalWitnessV1 = Readonly<{
  witnessId: string;
  queryForm: string;
  sourceId: string;
  evidenceFamily: MultiSourceEvidenceFamilyV0_1;
  language: string;
  languageVariety?: string | null;
  sourceForm: string;
  sourceFormNormalization: "EXACT_PRESERVED";
  gloss: string;
  citationRefs: readonly string[];
  embryoRelation: EmbryoSourceRelationV0_1;
  relationOperationIds: readonly string[];
  attestationTruth: MultiSourceTruthStatusV0_1;
  sourceStatus: MultiSourceFunctionalResearchSourceStatusV0_1;
  sourceProvenance?: GenericFunctionalWitnessSourceProvenanceV1;
  sourceAttestation: "SOURCE_RECORD_ONLY";
  functionalCorrespondence: "NOT_EVALUATED";
  targetMeaning: "NOT_CLAIMED";
  historicalRelation: "NOT_CLAIMED";
  winnerClaim: "NOT_CLAIMED";
  languageSuperiorityClaim: "NOT_CLAIMED";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type GenericFunctionalWitnessSourceFailureV1 = Readonly<{
  adapterId: string;
  reasonCode: "SOURCE_ADAPTER_FAILURE" | "SOURCE_RECORD_INVALID";
}>;

export type GenericFunctionalWitnessDiscoveryResultV1 = Readonly<{
  schemaVersion: typeof GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1;
  status: "MATCHES_FOUND" | "NO_MATCHES" | "INVALID_QUERY" | "SOURCE_FAILURE";
  query: GenericFunctionalWitnessQueryV1 | null;
  matches: readonly GenericFunctionalWitnessV1[];
  sourceFailures: readonly GenericFunctionalWitnessSourceFailureV1[];
  evidenceStatus: "ATTESTED_SOURCE_MATCHES" | "NO_EXTERNAL_EVIDENCE";
  functionalCorrespondence: "NOT_EVALUATED";
  historicalRelation: "NOT_CLAIMED";
  winnerClaim: "NOT_CLAIMED";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

const ADMISSIBLE_EMBRYO_RELATIONS_V1 = new Set<EmbryoSourceRelationV0_1>([
  "exact_form",
  "authorized_transformation",
  "reconstructed_form",
  "phonetic_resemblance",
  "semantic_resemblance",
]);

const ADMISSIBLE_EVIDENCE_FAMILIES_V1 = new Set<MultiSourceEvidenceFamilyV0_1>([
  "lexical_dictionary",
  "dialect_lexicon",
  "etymological_dictionary",
  "historical_dictionary",
  "corpus",
  "scholarly_paper",
  "reconstructed_lexicon",
  "other",
]);

function compareTextV1(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function exactTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    value.normalize("NFC") === value
  );
}

function isResearchSourceStatusV1(
  value: unknown,
): value is MultiSourceFunctionalResearchSourceStatusV0_1 {
  return value === "research_candidate" || value === "reviewed_candidate";
}

function sourceProvenanceIsValidV1(
  value: unknown,
  sourceId: string,
): value is GenericFunctionalWitnessSourceProvenanceV1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const provenance = value as Record<string, unknown>;
  return (
    provenance.sourceRecordId === sourceId &&
    exactTextV1(provenance.sourceRecordId) &&
    exactTextV1(provenance.sourceTraditionId) &&
    exactTextV1(provenance.sourceTitle) &&
    exactTextV1(provenance.sourceDateOrVersion) &&
    exactTextV1(provenance.sourceUrlOrArchiveRef) &&
    exactTextV1(provenance.entryLocator) &&
    (provenance.sourceHashOrArchiveHash === null ||
      exactTextV1(provenance.sourceHashOrArchiveHash)) &&
    (provenance.languageVariety === null ||
      exactTextV1(provenance.languageVariety))
  );
}

function isEvidenceFamilyV1(
  value: unknown,
): value is MultiSourceEvidenceFamilyV0_1 {
  return ADMISSIBLE_EVIDENCE_FAMILIES_V1.has(value as MultiSourceEvidenceFamilyV0_1);
}

function isTruthStatusV1(value: unknown): value is MultiSourceTruthStatusV0_1 {
  return (
    value === "fact" ||
    value === "inference" ||
    value === "hypothesis" ||
    value === "unknown"
  );
}

function queryIsValidV1(value: unknown): value is GenericFunctionalWitnessQueryV1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const query = value as Record<string, unknown>;
  return (
    query.schemaVersion === GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1 &&
    exactTextV1(query.embryo) &&
    query.queryNormalization === GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1 &&
    Array.isArray(query.voicePath) &&
    query.voicePath.length > 0 &&
    query.voicePath.every(
      (voice) => typeof voice === "string" && isSevenVoiceKey(voice),
    )
  );
}

function adapterIsValidV1(value: unknown): value is GenericFunctionalWitnessSourceAdapterV1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const adapter = value as Record<string, unknown>;
  return exactTextV1(adapter.adapterId) && typeof adapter.query === "function";
}

function sourceRecordIsValidV1(
  value: unknown,
  queryForm: string,
): value is GenericFunctionalWitnessSourceRecordV1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    record.queryForm === queryForm &&
    exactTextV1(record.queryForm) &&
    exactTextV1(record.sourceId) &&
    isEvidenceFamilyV1(record.evidenceFamily) &&
    exactTextV1(record.language) &&
    (record.languageVariety === undefined ||
      record.languageVariety === null ||
      exactTextV1(record.languageVariety)) &&
    typeof record.sourceForm === "string" &&
    record.sourceForm.length > 0 &&
    record.sourceFormNormalization === "EXACT_PRESERVED" &&
    exactTextV1(record.gloss) &&
    Array.isArray(record.citationRefs) &&
    record.citationRefs.length > 0 &&
    record.citationRefs.every(exactTextV1) &&
    ADMISSIBLE_EMBRYO_RELATIONS_V1.has(record.embryoRelation as EmbryoSourceRelationV0_1) &&
    Array.isArray(record.relationOperationIds) &&
    record.relationOperationIds.every(exactTextV1) &&
    isTruthStatusV1(record.attestationTruth) &&
    isResearchSourceStatusV1(record.sourceStatus) &&
    (record.sourceProvenance === undefined ||
      sourceProvenanceIsValidV1(record.sourceProvenance, record.sourceId))
  );
}

function sourceAdapterResultIsValidV1(
  value: unknown,
): value is GenericFunctionalWitnessSourceAdapterResultV1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const result = value as Record<string, unknown>;
  if (result.ok === false) {
    return result.reasonCode === "SOURCE_ADAPTER_FAILURE";
  }
  return result.ok === true && Array.isArray(result.records);
}

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return value;
}

function resultV1(
  input: Readonly<{
    status: GenericFunctionalWitnessDiscoveryResultV1["status"];
    query: GenericFunctionalWitnessQueryV1 | null;
    matches: readonly GenericFunctionalWitnessV1[];
    sourceFailures: readonly GenericFunctionalWitnessSourceFailureV1[];
  }>,
): GenericFunctionalWitnessDiscoveryResultV1 {
  return deepFreezeV1({
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    status: input.status,
    query: input.query,
    matches: [...input.matches],
    sourceFailures: [...input.sourceFailures],
    evidenceStatus:
      input.matches.length > 0 ? "ATTESTED_SOURCE_MATCHES" : "NO_EXTERNAL_EVIDENCE",
    functionalCorrespondence: "NOT_EVALUATED",
    historicalRelation: "NOT_CLAIMED",
    winnerClaim: "NOT_CLAIMED",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  });
}

function cloneQueryV1(
  input: GenericFunctionalWitnessQueryV1,
): GenericFunctionalWitnessQueryV1 {
  return {
    schemaVersion: input.schemaVersion,
    embryo: input.embryo,
    voicePath: [...input.voicePath],
    queryNormalization: input.queryNormalization,
  };
}

function encodeWitnessIdPartV1(value: string): string {
  return `${value.length}:${value}`;
}

function buildWitnessV1(
  adapterId: string,
  record: GenericFunctionalWitnessSourceRecordV1,
): GenericFunctionalWitnessV1 {
  return {
    witnessId: `generic-functional-witness:${encodeWitnessIdPartV1(adapterId)}:${encodeWitnessIdPartV1(record.sourceId)}`,
    queryForm: record.queryForm,
    sourceId: record.sourceId,
    evidenceFamily: record.evidenceFamily,
    language: record.language,
    sourceForm: record.sourceForm,
    sourceFormNormalization: "EXACT_PRESERVED",
    gloss: record.gloss,
    citationRefs: [...record.citationRefs],
    embryoRelation: record.embryoRelation,
    relationOperationIds: [...record.relationOperationIds],
    attestationTruth: record.attestationTruth,
    sourceStatus: record.sourceStatus,
    ...(record.languageVariety !== undefined
      ? { languageVariety: record.languageVariety }
      : {}),
    ...(record.sourceProvenance
      ? {
          sourceProvenance: {
            ...record.sourceProvenance,
          },
        }
      : {}),
    sourceAttestation: "SOURCE_RECORD_ONLY",
    functionalCorrespondence: "NOT_EVALUATED",
    targetMeaning: "NOT_CLAIMED",
    historicalRelation: "NOT_CLAIMED",
    winnerClaim: "NOT_CLAIMED",
    languageSuperiorityClaim: "NOT_CLAIMED",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  };
}

export function queryGenericFunctionalWitnessesV1(
  input: unknown,
  adapters: readonly unknown[],
): GenericFunctionalWitnessDiscoveryResultV1 {
  if (!queryIsValidV1(input)) {
    return resultV1({
      status: "INVALID_QUERY",
      query: null,
      matches: [],
      sourceFailures: [],
    });
  }

  const validQuery = cloneQueryV1(input);
  const validAdapters = adapters.filter(adapterIsValidV1).sort((left, right) =>
    compareTextV1(left.adapterId, right.adapterId),
  );
  const matches: GenericFunctionalWitnessV1[] = [];
  const sourceFailures: GenericFunctionalWitnessSourceFailureV1[] = [];
  const seenWitnessIds = new Set<string>();

  for (const adapter of validAdapters) {
    let adapterResult: unknown;
    try {
      adapterResult = adapter.query(validQuery);
    } catch {
      sourceFailures.push({
        adapterId: adapter.adapterId,
        reasonCode: "SOURCE_ADAPTER_FAILURE",
      });
      continue;
    }

    if (!sourceAdapterResultIsValidV1(adapterResult)) {
      sourceFailures.push({
        adapterId: adapter.adapterId,
        reasonCode: "SOURCE_ADAPTER_FAILURE",
      });
      continue;
    }

    if (!adapterResult.ok) {
      sourceFailures.push({
        adapterId: adapter.adapterId,
        reasonCode: adapterResult.reasonCode,
      });
      continue;
    }

    const validRecords: GenericFunctionalWitnessSourceRecordV1[] = [];
    for (const record of adapterResult.records) {
      if (!sourceRecordIsValidV1(record, input.embryo)) {
        sourceFailures.push({
          adapterId: adapter.adapterId,
          reasonCode: "SOURCE_RECORD_INVALID",
        });
        continue;
      }

      validRecords.push(record);
    }

    const records = validRecords.sort((left, right) =>
      compareTextV1(left.sourceId, right.sourceId),
    );
    for (const record of records) {
      const witness = buildWitnessV1(adapter.adapterId, record);
      if (seenWitnessIds.has(witness.witnessId)) continue;
      seenWitnessIds.add(witness.witnessId);
      matches.push(witness);
    }
  }

  const sortedFailures = sourceFailures.sort((left, right) =>
    compareTextV1(
      `${left.adapterId}:${left.reasonCode}`,
      `${right.adapterId}:${right.reasonCode}`,
    ),
  );

  return resultV1({
    status:
      matches.length > 0
        ? "MATCHES_FOUND"
        : sortedFailures.length > 0
          ? "SOURCE_FAILURE"
          : "NO_MATCHES",
    query: validQuery,
    matches,
    sourceFailures: sortedFailures,
  });
}

function catalogRowIsAdmissibleV1(
  row: MultiSourceFunctionalResearchEvidenceRowV0_1,
): boolean {
  return (
    row.registryVersion ===
      MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_REGISTRY_VERSION_V0_1 &&
    exactTextV1(row.researchEvidenceId) &&
    exactTextV1(row.embryo) &&
    exactTextV1(row.language) &&
    exactTextV1(row.form) &&
    exactTextV1(row.gloss) &&
    ADMISSIBLE_EMBRYO_RELATIONS_V1.has(row.embryoRelation) &&
    row.relationOperationIds.every(exactTextV1) &&
    isTruthStatusV1(row.attestationTruth) &&
    isResearchSourceStatusV1(row.sourceStatus) &&
    row.historicalOriginClaim === "not_claimed" &&
    row.historicalTransmissionClaim === "not_claimed" &&
    row.winnerClaim === "not_claimed" &&
    row.languageSuperiorityClaim === "not_claimed" &&
    row.candidateTruthClaim === "not_claimed" &&
    row.userDecisionPosture === "user_decides" &&
    row.citations.length > 0 &&
    row.citations.every((citation) => exactTextV1(citation.citationId))
  );
}

export function createMultiSourceFunctionalResearchEvidenceCatalogAdapterV1(
  rows: readonly MultiSourceFunctionalResearchEvidenceRowV0_1[],
): GenericFunctionalWitnessSourceAdapterV1 {
  return Object.freeze({
    adapterId: "multi-source-functional-research-catalog.v0_1",
    query(input: GenericFunctionalWitnessQueryV1) {
      const selectedRows = rows
        .filter(
          (row) =>
            catalogRowIsAdmissibleV1(row) && row.embryo === input.embryo,
        )
        .sort((left, right) =>
          compareTextV1(left.researchEvidenceId, right.researchEvidenceId),
        );

      return {
        ok: true as const,
        records: selectedRows.map((row) => ({
          queryForm: input.embryo,
          sourceId: row.researchEvidenceId,
          evidenceFamily: row.evidenceFamily,
          language: row.language,
          sourceForm: row.form,
          sourceFormNormalization: "EXACT_PRESERVED" as const,
          gloss: row.gloss,
          citationRefs: [...row.citations]
            .map((citation) => citation.citationId)
            .sort(compareTextV1),
          embryoRelation: row.embryoRelation,
          relationOperationIds: [...row.relationOperationIds].sort(compareTextV1),
          attestationTruth: row.attestationTruth,
          sourceStatus: row.sourceStatus,
        })),
      };
    },
  });
}
