import {
  createGenericFunctionalWitnessSourceAdapterV1,
  loadGenericFunctionalWitnessSourceDatasetV1,
} from "./genericFunctionalWitnessSourceAcquisition.v1";
import type {
  GenericFunctionalWitnessSourceAcquisitionRecordV1,
} from "./genericFunctionalWitnessSourceAcquisition.v1";
import type {
  GenericFunctionalWitnessSourceAdapterV1,
} from "./genericFunctionalWitnessDiscovery.v1";
import {
  GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
} from "./genericFunctionalWitnessDiscovery.v1";
import {
  buildMultilingualDiscoverySubstrateS0BaselineV0_2,
} from "./multilingualDiscoverySubstrateS0.v0_2";
import type {
  MultiSourceEvidenceFamilyV0_1,
  MultiSourceTruthStatusV0_1,
} from "../multiSourceFunctionalDiscovery.v0_1";
import type {
  MultiSourceFunctionalResearchCitationV0_1,
  MultiSourceFunctionalResearchSourceStatusV0_1,
} from "../multiSourceFunctionalResearchEvidenceRegistry.v0_1";

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_PROJECTION_ID_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-v0.2.s1-latin-projection.v0.1" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_BASELINE_HEAD_V0_2 =
  "275594b92e88dd4feb41b1126224ef570a08fa9b" as const;

type S0Baseline = ReturnType<
  typeof buildMultilingualDiscoverySubstrateS0BaselineV0_2
>;

type S0CatalogRow = S0Baseline["catalog"]["loadedRows"][number];

function compareTextV0_2(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function deepFreezeV0_2<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }
  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV0_2(child, seen);
  }
  return value;
}

function requireExactlyOneV0_2<T>(
  values: readonly T[],
  errorCode: string,
): T {
  if (values.length !== 1) {
    throw new Error(`${errorCode}:${values.length}`);
  }
  return values[0];
}

function baseLatinRecordForTraditionV0_2(
  sourceTraditionId: string,
): GenericFunctionalWitnessSourceAcquisitionRecordV1 {
  const record = loadGenericFunctionalWitnessSourceDatasetV1().records.find(
    (candidate) => candidate.sourceTraditionId === sourceTraditionId &&
      candidate.language === "Latin",
  );
  if (!record) {
    throw new Error(`S1_SOURCE_TRADITION_NOT_REPRESENTED:${sourceTraditionId}`);
  }
  return record;
}

function citationV0_2(
  citation: S0CatalogRow["citations"][number],
): MultiSourceFunctionalResearchCitationV0_1 {
  if (citation.provenanceGroupId === null) {
    throw new Error(`S1_MISSING_PROVENANCE_GROUP:${citation.citationId}`);
  }
  return {
    citationId: citation.citationId,
    sourceTitle: citation.sourceTitle,
    sourceAuthorOrEditor: citation.sourceAuthorOrEditor,
    sourcePublisherOrHost: citation.sourcePublisherOrHost,
    sourceDateOrVersion: citation.sourceDateOrVersion,
    sourceUrlOrArchiveRef: citation.sourceUrlOrArchiveRef,
    entryLocator: citation.entryLocator,
    sourceHashOrArchiveHash: citation.sourceHashOrArchiveHash,
    attestedForm: citation.attestedForm,
    attestedGloss: citation.attestedGloss,
    provenanceGroupId: citation.provenanceGroupId,
  };
}

function projectRowV0_2(
  row: S0CatalogRow,
): GenericFunctionalWitnessSourceAcquisitionRecordV1 {
  if (
    row.s0Classification !== "S1_SELECTED" ||
    row.language !== "Latin" ||
    row.currentlyProjected ||
    row.citations.length !== 1 ||
    row.sourceTraditionIds.length !== 1
  ) {
    throw new Error(`S1_ROW_NOT_PROJECTABLE:${row.researchEvidenceId}`);
  }

  const citation = requireExactlyOneV0_2(
    row.citations,
    `S1_REQUIRES_OUT_OF_SCOPE_ARCHITECTURE_CHANGE:${row.researchEvidenceId}:citations`,
  );
  const sourceTraditionId = requireExactlyOneV0_2(
    row.sourceTraditionIds,
    `S1_MISSING_SOURCE_TRADITION:${row.researchEvidenceId}`,
  );
  const baseRecord = baseLatinRecordForTraditionV0_2(sourceTraditionId);

  return {
    recordVersion: baseRecord.recordVersion,
    sourceRecordId: row.researchEvidenceId,
    sourceTraditionId,
    language: row.language,
    languageVariety: null,
    sourceTitle: citation.sourceTitle,
    sourceAuthorOrEditor: citation.sourceAuthorOrEditor,
    sourcePublisherOrHost: citation.sourcePublisherOrHost,
    sourceDateOrVersion: citation.sourceDateOrVersion,
    sourceUrlOrArchiveRef: citation.sourceUrlOrArchiveRef,
    entryLocator: citation.entryLocator,
    sourceHashOrArchiveHash: citation.sourceHashOrArchiveHash,
    sourceForm: citation.attestedForm,
    sourceFormNormalization: "EXACT_PRESERVED",
    queryForm: row.normalizedQueryKey,
    queryNormalization: "STRUCTURAL_DISPLAY_UPPERCASE",
    lookupForm: row.normalizedQueryKey,
    lookupNormalization: GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
    lookupTransformationAuthority: "STRUCTURAL_HYPOTHESIS_DISPLAY_FORM_V0_1",
    sourceFormRelation: "exact_form",
    queryRelation: "authorized_transformation",
    relationOperationIds: [...baseRecord.relationOperationIds],
    evidenceFamily: baseRecord.evidenceFamily as MultiSourceEvidenceFamilyV0_1,
    gloss: citation.attestedGloss,
    attestationTruth: row.attestationTruth as MultiSourceTruthStatusV0_1,
    sourceStatus: row.sourceStatus as MultiSourceFunctionalResearchSourceStatusV0_1,
    citation: citationV0_2(citation),
  };
}

function collisionGroupsV0_2(
  records: readonly Readonly<{ key: string; recordId: string }>[],
): readonly Readonly<{ key: string; recordIds: readonly string[] }>[] {
  const grouped = new Map<string, string[]>();
  for (const record of records) {
    const ids = grouped.get(record.key) ?? [];
    ids.push(record.recordId);
    grouped.set(record.key, ids);
  }
  return [...grouped.entries()]
    .filter(([, recordIds]) => recordIds.length > 1)
    .sort(([left], [right]) => compareTextV0_2(left, right))
    .map(([key, recordIds]) => ({
      key,
      recordIds: [...recordIds].sort(compareTextV0_2),
    }));
}

const S0_BASELINE_V0_2 = buildMultilingualDiscoverySubstrateS0BaselineV0_2({
  repositoryBaselineHead: MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_BASELINE_HEAD_V0_2,
});

const S1_ROWS_V0_2 = S0_BASELINE_V0_2.catalog.loadedRows
  .filter((row) => row.s0Classification === "S1_SELECTED")
  .sort((left, right) => compareTextV0_2(left.researchEvidenceId, right.researchEvidenceId));

if (S1_ROWS_V0_2.length !== 19) {
  throw new Error(`S1_FROZEN_COHORT_MISMATCH:${S1_ROWS_V0_2.length}`);
}

const S1_PROJECTION_RECORDS_V0_2 = deepFreezeV0_2(
  S1_ROWS_V0_2.map(projectRowV0_2),
);

const BASE_LATIN_RECORDS_V0_2 = loadGenericFunctionalWitnessSourceDatasetV1().records
  .filter((record) => record.language === "Latin");

const COMPOSED_LATIN_RECORDS_V0_2 = deepFreezeV0_2(
  [
    ...BASE_LATIN_RECORDS_V0_2,
    ...S1_PROJECTION_RECORDS_V0_2,
  ].sort((left, right) => compareTextV0_2(left.sourceRecordId, right.sourceRecordId)),
);

export type MultilingualDiscoverySubstrateS1ProjectionProofV0_2 = Readonly<{
  projectionId: typeof MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_PROJECTION_ID_V0_2;
  projectedCount: number;
  baselineRecordCount: number;
  projectedLatinRecordCount: number;
  baselineVsS1QueryKeyCollisions: readonly Readonly<{
    key: string;
    recordIds: readonly string[];
  }>[];
  intraCohortQueryKeyCollisions: readonly Readonly<{
    key: string;
    recordIds: readonly string[];
  }>[];
  s1SourceRecordIds: readonly string[];
  s1CitationIds: readonly string[];
  multiCitationRowCount: number;
  multiCitationIdentitiesPreserved: boolean;
  s3EvaluationExecuted: false;
}>;

const BASELINE_RECORD_KEYS_V0_2 = S0_BASELINE_V0_2.directSubstrate.records.map(
  (record) => ({ key: record.queryKey, recordId: record.recordId }),
);

const PROOF_V0_2 = deepFreezeV0_2<MultilingualDiscoverySubstrateS1ProjectionProofV0_2>({
  projectionId: MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_PROJECTION_ID_V0_2,
  projectedCount: S1_PROJECTION_RECORDS_V0_2.length,
  baselineRecordCount: S0_BASELINE_V0_2.directSubstrate.total,
  projectedLatinRecordCount: S1_PROJECTION_RECORDS_V0_2.filter(
    (record) => record.language === "Latin",
  ).length,
  baselineVsS1QueryKeyCollisions: collisionGroupsV0_2([
    ...BASELINE_RECORD_KEYS_V0_2,
    ...S1_PROJECTION_RECORDS_V0_2.map((record) => ({
      key: record.queryForm,
      recordId: record.sourceRecordId,
    })),
  ]),
  intraCohortQueryKeyCollisions: collisionGroupsV0_2(
    S1_PROJECTION_RECORDS_V0_2.map((record) => ({
      key: record.queryForm,
      recordId: record.sourceRecordId,
    })),
  ),
  s1SourceRecordIds: S1_PROJECTION_RECORDS_V0_2.map(
    (record) => record.sourceRecordId,
  ),
  s1CitationIds: S1_PROJECTION_RECORDS_V0_2.map(
    (record) => record.citation.citationId,
  ),
  multiCitationRowCount: S1_ROWS_V0_2.filter((row) => row.citations.length > 1).length,
  multiCitationIdentitiesPreserved: S1_ROWS_V0_2.every(
    (row, index) => row.citations.length === 1 &&
      row.citations[0]?.citationId ===
        S1_PROJECTION_RECORDS_V0_2[index]?.citation.citationId,
  ),
  s3EvaluationExecuted: false,
});

export function getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2():
  readonly GenericFunctionalWitnessSourceAcquisitionRecordV1[] {
  return S1_PROJECTION_RECORDS_V0_2;
}

export function getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2():
  readonly GenericFunctionalWitnessSourceAcquisitionRecordV1[] {
  return COMPOSED_LATIN_RECORDS_V0_2;
}

export function createMultilingualDiscoverySubstrateS1LatinWitnessAdapterV0_2():
  GenericFunctionalWitnessSourceAdapterV1 {
  const sourceDataset = loadGenericFunctionalWitnessSourceDatasetV1();
  const sourceAdapter = createGenericFunctionalWitnessSourceAdapterV1({
    datasetVersion: sourceDataset.datasetVersion,
    sourceAuthority: sourceDataset.sourceAuthority,
    records: COMPOSED_LATIN_RECORDS_V0_2,
  });

  return Object.freeze({
    adapterId: "latin-generic-lexical-substrate.v0_1",
    candidateVoicePathPolicy: "NULL_UNAUTHORIZED" as const,
    query(input) {
      return sourceAdapter.query(input);
    },
  });
}

export function getMultilingualDiscoverySubstrateS1ProjectionProofV0_2():
  MultilingualDiscoverySubstrateS1ProjectionProofV0_2 {
  return PROOF_V0_2;
}
