import { createHash } from "node:crypto";
import rawCatalog from "../../data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import {
  isQuarantinedUnresolvedResearchRowV0_1,
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "../multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import {
  admitOpenInstrumentResearchCatalogV0_1,
} from "../openInstrumentResearchCatalogAdmission.v0_1";
import {
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "./albanianLexicalSubstrate.v0_1";
import {
  loadGenericFunctionalWitnessSourceDatasetV1,
} from "./genericFunctionalWitnessSourceAcquisition.v1";
import {
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
} from "../multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import type {
  MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "../multiSourceFunctionalResearchEvidenceRegistry.v0_1";

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_PROCEDURE_ID_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-v0.2.s0-baseline-freeze.v0.1" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_SCHEMA_VERSION_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-s0-baseline.v0.1" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_EVALUATION_PROCEDURE_ID_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-v0.2.s3-coverage-procedure.v0.1" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_CLASSIFICATIONS_V0_2 = [
  "CURRENTLY_PROJECTED",
  "S1_SELECTED",
  "ADMISSION_UNRESOLVED",
  "ADAPTER_DEFERRED",
  "BOUNDARY_EXCLUDED",
] as const;

export type MultilingualDiscoverySubstrateS0ClassificationV0_2 =
  (typeof MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_CLASSIFICATIONS_V0_2)[number];

export type MultilingualDiscoverySubstrateS0CitationSnapshotV0_2 = Readonly<{
  citationId: string;
  provenanceGroupId: string | null;
  sourceTitle: string;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string;
  sourceDateOrVersion: string;
  sourceUrlOrArchiveRef: string;
  entryLocator: string;
  sourceHashOrArchiveHash: string | null;
  attestedForm: string;
  attestedGloss: string;
}>;

export type MultilingualDiscoverySubstrateS0CatalogRowV0_2 = Readonly<{
  researchEvidenceId: string;
  language: string;
  embryo: string;
  form: string;
  gloss: string;
  embryoRelation: string;
  relationOperationIds: readonly string[];
  attestationTruth: string;
  sourceStatus: string;
  citationIds: readonly string[];
  sourceTraditionIds: readonly string[];
  normalizedSourceForms: readonly string[];
  normalizedQueryKey: string;
  citations: readonly MultilingualDiscoverySubstrateS0CitationSnapshotV0_2[];
  functionalHypotheses: readonly Readonly<{
    targetWord: string;
    targetSenseId: string | null;
    evidenceBasis: string;
    functionalBridgeTruth: string;
    claimBoundary: string;
  }>[];
  currentlyProjected: boolean;
  currentProjectionAdapter: string | null;
  s0Classification: MultilingualDiscoverySubstrateS0ClassificationV0_2;
  reasonCodes: readonly string[];
}>;

export type MultilingualDiscoverySubstrateS0DirectRecordV0_2 = Readonly<{
  recordId: string;
  language: string;
  languageGroup: string;
  sourceForm: string;
  normalizedSourceForm: string;
  queryKey: string;
  gloss: string;
  sourceTraditionId: string | null;
  sourceTitle: string | null;
  sourceDateOrVersion: string | null;
  sourceUrlOrArchiveRef: string | null;
  entryLocator: string | null;
  sourceHashOrArchiveHash: string | null;
  citationIds: readonly string[];
  attestationTruth: string;
  sourceStatus: string;
  sourceAuthorityStatus: string | null;
  embryoRelation: string;
  relationOperationIds: readonly string[];
  adapterId: string;
}>;

export type MultilingualDiscoverySubstrateS0BaselineV0_2 = Readonly<{
  schemaVersion: typeof MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_SCHEMA_VERSION_V0_2;
  procedureId: typeof MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_PROCEDURE_ID_V0_2;
  status: "FROZEN_BEFORE_S1";
  repositoryBaselineHead: string;
  directSubstrate: Readonly<{
    records: readonly MultilingualDiscoverySubstrateS0DirectRecordV0_2[];
    total: number;
    languageCounts: Readonly<Record<string, number>>;
    sourceTraditionCounts: Readonly<Record<string, number>>;
    uniqueNormalizedSourceForms: number;
    uniqueQueryKeys: number;
    duplicateNormalizedSourceForms: readonly Readonly<{
      key: string;
      recordIds: readonly string[];
    }>[];
    queryKeyCollisions: readonly Readonly<{
      key: string;
      recordIds: readonly string[];
    }>[];
    orderingRule: string;
  }>;
  catalog: Readonly<{
    rawRowCount: number;
    loadedRowCount: number;
    loaderQuarantinedRowCount: number;
    loaderQuarantinedRows: readonly Readonly<{
      researchEvidenceId: string;
      language: string;
      embryo: string;
      embryoRelation: string;
      reasonCodes: readonly string[];
    }>[];
    loadedRows: readonly MultilingualDiscoverySubstrateS0CatalogRowV0_2[];
    counts: Readonly<{
      currentlyProjected: number;
      notProjected: number;
      s1Selected: number;
      admissionUnresolved: number;
      adapterDeferred: number;
      boundaryExcluded: number;
      preliminaryEligible: number;
    }>;
    languageCounts: Readonly<Record<string, number>>;
    sourceTraditionCounts: Readonly<Record<string, number>>;
    attestationTruthCounts: Readonly<Record<string, number>>;
    sourceStatusCounts: Readonly<Record<string, number>>;
    orderingRule: string;
  }>;
  s1Cohort: Readonly<{
    count: number;
    rows: readonly Readonly<{
      researchEvidenceId: string;
      language: string;
      sourceTraditionIds: readonly string[];
      citationIds: readonly string[];
      attestedForms: readonly string[];
      normalizedQueryKey: string;
    }>[];
    selectionRule: string;
    targetWordSelectionPresent: false;
    externalFetchRequired: false;
    reAttestationRequired: false;
    newAdapterRequired: false;
  }>;
  heldAndExcluded: Readonly<{
    admissionUnresolved: readonly string[];
    adapterDeferred: readonly string[];
    boundaryExcluded: readonly string[];
  }>;
  evaluationProcedure: Readonly<{
    procedureId: typeof MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_EVALUATION_PROCEDURE_ID_V0_2;
    status: "FROZEN_BEFORE_S1";
    sourceProcedurePath: string;
    sourceProcedureSha256: string;
    inputPopulationAuthority: string;
    sourceProfileId: string;
    sourceRevision: string;
    sourceNotation: string;
    sourcePath: string;
    sourceSha256: string;
    sourceBytes: number;
    populationSpecPath: string;
    populationSpecSha256: string;
    sampleSize: number;
    sampleSelectionRule: string;
    seedOrDeterministicSelectionId: string;
    orderingRule: string;
    exclusionRules: readonly string[];
    reachabilityRule: readonly string[];
    crossFormPositiveRule: string;
    selfMatchRule: string;
    validNullRule: string;
    unsupportedAuthorityRule: string;
    duplicateCollisionRule: string;
    languageContributionRule: string;
    candidateDiversityRule: string;
    baselineSubstrateRecordCount: number;
    baselineSubstrateFingerprint: string;
    expandedResultsInspected: false;
  }>;
}>;

type AnyRecord = Record<string, unknown>;

const EMPTY_CATALOG = {
  catalogVersion: MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
  rows: [],
} as const;

function compareTextV0_2(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeTextV0_2(value: string): string {
  return value.normalize("NFC").trim();
}

function sha256V0_2(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function queryKeyV0_2(value: string): string {
  return normalizeTextV0_2(value).toLocaleUpperCase("en-US");
}

function languageGroupV0_2(language: string): string {
  return language === "sq" ? "Albanian" : language;
}

function countByV0_2(
  values: readonly string[],
): Readonly<Record<string, number>> {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Object.fromEntries(
    [...counts.entries()].sort(([left], [right]) => compareTextV0_2(left, right)),
  );
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

function stringOrNullV0_2(value: unknown): string | null {
  return typeof value === "string" ? normalizeTextV0_2(value) || null : null;
}

function directRecordSnapshotV0_2(
  record: unknown,
): MultilingualDiscoverySubstrateS0DirectRecordV0_2 {
  const value = record as unknown as AnyRecord;
  const provenance = (value.sourceProvenance ?? value.citation) as AnyRecord | undefined;
  const recordId = String(value.sourceId ?? value.sourceRecordId);
  const sourceTraditionId = stringOrNullV0_2(
    value.sourceTraditionId ?? provenance?.sourceTraditionId,
  );
  return {
    recordId,
    language: String(value.language),
    languageGroup: languageGroupV0_2(String(value.language)),
    sourceForm: String(value.sourceForm),
    normalizedSourceForm: normalizeTextV0_2(String(value.sourceForm)),
    queryKey: String(value.queryForm),
    gloss: String(value.gloss),
    sourceTraditionId,
    sourceTitle: stringOrNullV0_2(value.sourceTitle ?? provenance?.sourceTitle),
    sourceDateOrVersion: stringOrNullV0_2(
      value.sourceDateOrVersion ?? provenance?.sourceDateOrVersion,
    ),
    sourceUrlOrArchiveRef: stringOrNullV0_2(
      value.sourceUrlOrArchiveRef ?? provenance?.sourceUrlOrArchiveRef,
    ),
    entryLocator: stringOrNullV0_2(value.entryLocator ?? provenance?.entryLocator),
    sourceHashOrArchiveHash: stringOrNullV0_2(
      value.sourceHashOrArchiveHash ?? provenance?.sourceHashOrArchiveHash,
    ),
    citationIds: Array.isArray(value.citationRefs)
      ? Array.from(value.citationRefs as readonly string[]).sort(compareTextV0_2)
      : provenance && typeof provenance.citationId === "string"
        ? [provenance.citationId]
        : [],
    attestationTruth: String(value.attestationTruth),
    sourceStatus: String(value.sourceStatus),
    sourceAuthorityStatus: stringOrNullV0_2(value.sourceAuthorityStatus),
    embryoRelation: String(value.embryoRelation ?? value.queryRelation ?? value.sourceFormRelation),
    relationOperationIds: Array.isArray(value.relationOperationIds)
      ? [...value.relationOperationIds as string[]].sort(compareTextV0_2)
      : [],
    adapterId:
      value.language === "Latin"
        ? "latin-generic-lexical-substrate.v0_1"
        : "albanian-generic-lexical-substrate.v0_1",
  };
}

function catalogCitationSnapshotV0_2(
  citation: MultiSourceFunctionalResearchEvidenceRowV0_1["citations"][number],
): MultilingualDiscoverySubstrateS0CitationSnapshotV0_2 {
  return {
    citationId: citation.citationId,
    provenanceGroupId: citation.provenanceGroupId ?? null,
    sourceTitle: citation.sourceTitle,
    sourceAuthorOrEditor: citation.sourceAuthorOrEditor,
    sourcePublisherOrHost: citation.sourcePublisherOrHost,
    sourceDateOrVersion: citation.sourceDateOrVersion,
    sourceUrlOrArchiveRef: citation.sourceUrlOrArchiveRef,
    entryLocator: citation.entryLocator,
    sourceHashOrArchiveHash: citation.sourceHashOrArchiveHash,
    attestedForm: citation.attestedForm,
    attestedGloss: citation.attestedGloss,
  };
}

function admissionReasonCodesV0_2(
  row: MultiSourceFunctionalResearchEvidenceRowV0_1,
): readonly string[] {
  const result = admitOpenInstrumentResearchCatalogV0_1(EMPTY_CATALOG, { rows: [row] });
  if (result.ok) return [];
  if (!("reasonCodes" in result)) return ["ADMISSION_VALIDATION_FAILED"];
  const prefix = `malformedRow:${row.researchEvidenceId}:`;
  return [...new Set(
    result.reasonCodes
      .filter((reason) => reason.startsWith(prefix))
      .map((reason) => reason.slice(prefix.length)),
  )].sort(compareTextV0_2);
}

function rowBoundaryReasonCodesV0_2(
  row: MultiSourceFunctionalResearchEvidenceRowV0_1,
): readonly string[] {
  const reasons: string[] = [];
  if (row.embryoRelation === "no_structural_relation") {
    reasons.push("EMBRYO_RELATION_NO_STRUCTURAL_RELATION");
  }
  if (row.attestationTruth !== "fact") {
    reasons.push("ATTESTATION_TRUTH_NOT_FACT");
  }
  return reasons.sort(compareTextV0_2);
}

function catalogRowSnapshotV0_2(
  row: MultiSourceFunctionalResearchEvidenceRowV0_1,
  currentDirectIds: ReadonlySet<string>,
  baselineQueryKeys: ReadonlySet<string>,
): MultilingualDiscoverySubstrateS0CatalogRowV0_2 {
  const currentlyProjected = currentDirectIds.has(row.researchEvidenceId);
  const boundaryReasons = rowBoundaryReasonCodesV0_2(row);
  const admissionReasons = admissionReasonCodesV0_2(row);
  const normalizedQueryKey = queryKeyV0_2(row.embryo);

  let s0Classification: MultilingualDiscoverySubstrateS0ClassificationV0_2;
  let reasonCodes: readonly string[];
  if (currentlyProjected) {
    s0Classification = "CURRENTLY_PROJECTED";
    reasonCodes = ["CURRENT_DIRECT_SUBSTRATE_RECORD"];
  } else if (boundaryReasons.length > 0) {
    s0Classification = "BOUNDARY_EXCLUDED";
    reasonCodes = boundaryReasons;
  } else if (admissionReasons.length === 0 && row.language === "Latin" &&
    baselineQueryKeys.has(normalizedQueryKey)) {
    s0Classification = "BOUNDARY_EXCLUDED";
    reasonCodes = ["BASELINE_QUERY_KEY_COLLISION"];
  } else if (admissionReasons.length === 0 && row.language === "Latin") {
    s0Classification = "S1_SELECTED";
    reasonCodes = ["FULL_ADMISSION_AND_LATIN_ADAPTER_BOUNDARY"];
  } else if (admissionReasons.length === 0) {
    s0Classification = "ADAPTER_DEFERRED";
    reasonCodes = ["ADMISSION_VALID_OUTSIDE_CURRENT_DIRECT_LANGUAGE_ADAPTER_BOUNDARY"];
  } else {
    s0Classification = "ADMISSION_UNRESOLVED";
    reasonCodes = admissionReasons;
  }

  const citations = [...row.citations]
    .sort((left, right) => compareTextV0_2(left.citationId, right.citationId))
    .map(catalogCitationSnapshotV0_2);
  return {
    researchEvidenceId: row.researchEvidenceId,
    language: row.language,
    embryo: row.embryo,
    form: row.form,
    gloss: row.gloss,
    embryoRelation: row.embryoRelation,
    relationOperationIds: [...row.relationOperationIds].sort(compareTextV0_2),
    attestationTruth: row.attestationTruth,
    sourceStatus: row.sourceStatus,
    citationIds: citations.map((citation) => citation.citationId),
    sourceTraditionIds: [...new Set(
      citations
        .map((citation) => citation.provenanceGroupId)
        .filter((value): value is string => value !== null),
    )].sort(compareTextV0_2),
    normalizedSourceForms: [...new Set(
      citations.map((citation) => normalizeTextV0_2(citation.attestedForm)),
    )].sort(compareTextV0_2),
    normalizedQueryKey,
    citations,
    functionalHypotheses: [...row.functionalHypotheses]
      .map((hypothesis) => ({
        targetWord: hypothesis.targetWord,
        targetSenseId: hypothesis.targetSenseId ?? null,
        evidenceBasis: hypothesis.evidenceBasis,
        functionalBridgeTruth: hypothesis.functionalBridgeTruth,
        claimBoundary: hypothesis.claimBoundary,
      }))
      .sort((left, right) =>
        compareTextV0_2(
          `${left.targetWord}:${left.targetSenseId ?? ""}`,
          `${right.targetWord}:${right.targetSenseId ?? ""}`,
        ),
      ),
    currentlyProjected,
    currentProjectionAdapter: currentlyProjected
      ? row.language === "Latin"
        ? "latin-generic-lexical-substrate.v0_1"
        : "albanian-generic-lexical-substrate.v0_1"
      : null,
    s0Classification,
    reasonCodes,
  };
}

function evaluationProcedureV0_2(
  directRecords: readonly MultilingualDiscoverySubstrateS0DirectRecordV0_2[],
): MultilingualDiscoverySubstrateS0BaselineV0_2["evaluationProcedure"] {
  return {
    procedureId: MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_EVALUATION_PROCEDURE_ID_V0_2,
    status: "FROZEN_BEFORE_S1",
    sourceProcedurePath:
      "docs/open-instrument/research-artifacts/m7-substrate-reachable-generalization-v0.1/procedure.json",
    sourceProcedureSha256:
      "2b7ecf4b1b0b7e3f2ced15a0a92381316206711b3392676b22e81e6481ed81cb",
    inputPopulationAuthority: "existing frozen bundled CMUdict eligible pronunciation population",
    sourceProfileId: "open-instrument.cmudict-arpabet-en-us.v0_1",
    sourceRevision: "74790861f652b15e4ac49015a90074ad62a27690",
    sourceNotation: "ARPABET",
    sourcePath: "src/data/openInstrument/pronunciation/cmudict.dict",
    sourceSha256: "81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22",
    sourceBytes: 3618488,
    populationSpecPath:
      "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json",
    populationSpecSha256:
      "81248026f57cffb0c357a4e29e0cce4d3139adc1521eda89e72754783095ed44",
    sampleSize: 512,
    sampleSelectionRule:
      "first 512 substrate-reachable inputs in the frozen prepared ordered population",
    seedOrDeterministicSelectionId:
      "M7_FROZEN_PREPARED_ORDERED_POPULATION_FIRST_512_REACHABLE",
    orderingRule: "NFC, trim, lower-case existing CMUdict normalization; Unicode code-point ascending; deduplicate normalized lexical word",
    exclusionRules: [
      "reuse the original M7 prepared-word exclusion set (84 explicit exclusions)",
      "exclude source-record forms when they are ASCII-alphabetic under the existing M7 rule",
      "do not inspect substrate responses or candidate attractiveness for selection",
    ],
    reachabilityRule: [
      "authorized usable production pronunciation/profile is defined",
      "canonical spoken Voice path is non-null and non-empty",
      "existing structural hypothesis/DeepRoot query-generation machinery produces structural state",
      "at least one existing generic query key is generated before substrate response lookup",
    ],
    crossFormPositiveRule:
      "a substrate candidate is retrieved and its normalized source form is not an exact normalized match to the input",
    selfMatchRule:
      "a substrate response contains only exact normalized source-form matches to the input",
    validNullRule:
      "upstream pronunciation/structure/query-generation Nulls and substrate no-match outcomes remain explicit valid Null classifications",
    unsupportedAuthorityRule:
      "unsupported pronunciation, structural, or source-authority states are excluded before positive classification and remain Null",
    duplicateCollisionRule:
      "report duplicate normalized source forms and duplicate query keys; do not deduplicate away provenance-bearing records silently",
    languageContributionRule:
      "report candidate and reachable contributions by canonical language group and source tradition without ranking languages",
    candidateDiversityRule:
      "report distinct candidate source records and languages per input; do not select a winner",
    baselineSubstrateRecordCount: directRecords.length,
    baselineSubstrateFingerprint: sha256V0_2(JSON.stringify(directRecords)),
    expandedResultsInspected: false,
  };
}

export function buildMultilingualDiscoverySubstrateS0BaselineV0_2(options: {
  repositoryBaselineHead: string;
}): MultilingualDiscoverySubstrateS0BaselineV0_2 {
  // S0 is the immutable pre-S1 baseline. Read the two original Latin records
  // from the frozen generic source dataset rather than from the live Latin
  // adapter, which is intentionally expanded by S1.
  const baseLatinRecords = loadGenericFunctionalWitnessSourceDatasetV1().records
    .filter((record) => record.language === "Latin");
  const directRecords = [
    ...getAlbanianLexicalSubstrateRecordsV0_1(),
    ...baseLatinRecords,
  ]
    .map(directRecordSnapshotV0_2)
    .sort((left, right) => compareTextV0_2(left.recordId, right.recordId));
  const baselineQueryKeys = new Set(directRecords.map((record) => record.queryKey));
  const currentDirectIds = new Set(directRecords.map((record) => record.recordId));
  const loadedRows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();
  const rawRows = (rawCatalog as { rows: readonly AnyRecord[] }).rows;
  const quarantinedRows = rawRows
    .filter(isQuarantinedUnresolvedResearchRowV0_1)
    .map((row) => ({
      researchEvidenceId: String(row.researchEvidenceId),
      language: String(row.language),
      embryo: String(row.embryo),
      embryoRelation: String(row.embryoRelation),
      reasonCodes: ["LOADER_QUARANTINED_UNRESOLVED_RESEARCH_ARTIFACT"],
    }))
    .sort((left, right) => compareTextV0_2(left.researchEvidenceId, right.researchEvidenceId));
  const catalogRows = loadedRows
    .map((row) => catalogRowSnapshotV0_2(row, currentDirectIds, baselineQueryKeys))
    .sort((left, right) => compareTextV0_2(left.researchEvidenceId, right.researchEvidenceId));
  const classification = (name: MultilingualDiscoverySubstrateS0ClassificationV0_2) =>
    catalogRows.filter((row) => row.s0Classification === name);
  const s1Rows = classification("S1_SELECTED");
  const nonBoundaryRows = catalogRows.filter(
    (row) => row.s0Classification !== "BOUNDARY_EXCLUDED",
  );
  const duplicateForms = collisionGroupsV0_2(
    directRecords.map((record) => ({
      key: record.normalizedSourceForm,
      recordId: record.recordId,
    })),
  );
  const queryKeyCollisions = collisionGroupsV0_2(
    directRecords.map((record) => ({ key: record.queryKey, recordId: record.recordId })),
  );
  const sourceTraditionCounts = countByV0_2(
    directRecords.map((record) => record.sourceTraditionId ?? "NONE"),
  );
  const s1SelectionRows = s1Rows.map((row) => ({
    researchEvidenceId: row.researchEvidenceId,
    language: row.language,
    sourceTraditionIds: row.sourceTraditionIds,
    citationIds: row.citationIds,
    attestedForms: row.citations.map((citation) => citation.attestedForm),
    normalizedQueryKey: row.normalizedQueryKey,
  }));
  return {
    schemaVersion: MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_SCHEMA_VERSION_V0_2,
    procedureId: MULTILINGUAL_DISCOVERY_SUBSTRATE_S0_PROCEDURE_ID_V0_2,
    status: "FROZEN_BEFORE_S1",
    repositoryBaselineHead: options.repositoryBaselineHead,
    directSubstrate: {
      records: directRecords,
      total: directRecords.length,
      languageCounts: countByV0_2(directRecords.map((record) => record.languageGroup)),
      sourceTraditionCounts,
      uniqueNormalizedSourceForms: new Set(
        directRecords.map((record) => record.normalizedSourceForm),
      ).size,
      uniqueQueryKeys: new Set(directRecords.map((record) => record.queryKey)).size,
      duplicateNormalizedSourceForms: duplicateForms,
      queryKeyCollisions,
      orderingRule: "recordId ascending by Unicode code-point comparison",
    },
    catalog: {
      rawRowCount: rawRows.length,
      loadedRowCount: loadedRows.length,
      loaderQuarantinedRowCount: quarantinedRows.length,
      loaderQuarantinedRows: quarantinedRows,
      loadedRows: catalogRows,
      counts: {
        currentlyProjected: classification("CURRENTLY_PROJECTED").length,
        notProjected: catalogRows.filter((row) => !row.currentlyProjected).length,
        s1Selected: s1Rows.length,
        admissionUnresolved: classification("ADMISSION_UNRESOLVED").length,
        adapterDeferred: classification("ADAPTER_DEFERRED").length,
        boundaryExcluded: classification("BOUNDARY_EXCLUDED").length,
        preliminaryEligible: nonBoundaryRows.length,
      },
      languageCounts: countByV0_2(loadedRows.map((row) => row.language)),
      sourceTraditionCounts: countByV0_2(
        loadedRows.flatMap((row) => [...new Set(
          row.citations.map((citation) => citation.provenanceGroupId ?? "NONE"),
        )]),
      ),
      attestationTruthCounts: countByV0_2(loadedRows.map((row) => row.attestationTruth)),
      sourceStatusCounts: countByV0_2(loadedRows.map((row) => row.sourceStatus)),
      orderingRule: "researchEvidenceId ascending by Unicode code-point comparison",
    },
    s1Cohort: {
      count: s1Rows.length,
      rows: s1SelectionRows,
      selectionRule:
        "loaded catalog row; not currently projected; attestation fact; full existing admission contract; Latin language within the existing direct adapter boundary; no baseline query-key collision",
      targetWordSelectionPresent: false,
      externalFetchRequired: false,
      reAttestationRequired: false,
      newAdapterRequired: false,
    },
    heldAndExcluded: {
      admissionUnresolved: classification("ADMISSION_UNRESOLVED").map(
        (row) => row.researchEvidenceId,
      ),
      adapterDeferred: classification("ADAPTER_DEFERRED").map(
        (row) => row.researchEvidenceId,
      ),
      boundaryExcluded: classification("BOUNDARY_EXCLUDED").map(
        (row) => row.researchEvidenceId,
      ),
    },
    evaluationProcedure: evaluationProcedureV0_2(directRecords),
  };
}
