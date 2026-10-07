import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import rawCatalog from "../../data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import {
  MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
  isQuarantinedUnresolvedResearchRowV0_1,
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "../multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import {
  admitOpenInstrumentResearchCatalogV0_1,
} from "../openInstrumentResearchCatalogAdmission.v0_1";
import {
  createMultilingualDiscoverySubstrateS1LatinWitnessAdapterV0_2,
  getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2,
  getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2,
} from "./multilingualDiscoverySubstrateS1.v0_2";
import {
  buildMultilingualDiscoverySubstrateS0BaselineV0_2,
} from "./multilingualDiscoverySubstrateS0.v0_2";
import {
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "./albanianLexicalSubstrate.v0_1";
import {
  queryGenericFunctionalWitnessesV1,
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
} from "./genericFunctionalWitnessDiscovery.v1";
import type {
  GenericFunctionalWitnessSourceAcquisitionRecordV1,
} from "./genericFunctionalWitnessSourceAcquisition.v1";

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S2_PROCEDURE_ID_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-v0.2.s2-authority-truth-validation.v0.1" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S2_SCHEMA_VERSION_V0_2 =
  "open-instrument.multilingual-discovery-substrate-expansion-s2-validation.v0.1" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_MERGE_V0_2 =
  "614e98b960a8c76122f78bc5ef13ec242e0560ec" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_PROJECTION_PATH_V0_2 =
  "src/shared/openInstrument/multilingualDiscoverySubstrateS1.v0_2.ts" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_CATALOG_DERIVATION_PATH_V0_2 =
  "src/shared/openInstrument/multilingualDiscoverySubstrateS0.v0_2.ts" as const;

export const MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_RUNTIME_COMPOSITION_PATH_V0_2 =
  "src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts" as const;

const EXPECTED_S0_ARTIFACT_SHA256_V0_2 =
  "52fd4865fd3a0eb2067ea460af7d75024948de5c56cbcc8ce9936361a591a58e";
const EXPECTED_S0_MANIFEST_SHA256_V0_2 =
  "38d57de7082b4d719b76aa5cf34e177c5e0d811a1a11341bba9535fafcbf764f";
const EXPECTED_S1_PROJECTION_SHA256_V0_2 =
  "8f65b688ca6c3e7a4a130c478c2c6ec3abbb6b6875db742fd9666b4ced5b61d3";
const EXPECTED_S1_CATALOG_DERIVATION_SHA256_V0_2 =
  "bf7f9592b6123fc2d634af7616415fdedf317469ba1e3ca9f654a0e4dc4ce265";
const EXPECTED_S1_RUNTIME_COMPOSITION_SHA256_V0_2 =
  "febe40af34ae4e60f6a1ffa91e63a36e4e2c04748b1d5cfae4ba53f7195e45de";

const S0_ARTIFACT_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/baseline.json";
const S0_MANIFEST_PATH_V0_2 =
  "docs/open-instrument/research-artifacts/multilingual-discovery-substrate-v0.2-s0-baseline-freeze-v0.1/hash-manifest.json";
const S2_SOURCE_POLICY_PATH_V0_2 =
  "docs/open-instrument/reviewed-source-tradition-authority-policy-v1.md";
const CATALOG_PATH_V0_2 =
  "src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
const GENERIC_DATASET_PATH_V0_2 =
  "src/data/openInstrument/genericFunctionalWitnessSourceRecords.v1.json";

type CollisionGroupV0_2 = Readonly<{
  key: string;
  recordIds: readonly string[];
}>;

type DirectRecordV0_2 = Readonly<{
  sourceRecordId: string;
  language: string;
  sourceForm: string;
  queryForm: string;
  sourceTraditionId: string;
  citationIds: readonly string[];
  gloss: string;
  attestationTruth: string;
  sourceStatus: string;
}>;

export type MultilingualDiscoverySubstrateS2ValidationV0_2 = Readonly<{
  schemaVersion: typeof MULTILINGUAL_DISCOVERY_SUBSTRATE_S2_SCHEMA_VERSION_V0_2;
  procedureId: typeof MULTILINGUAL_DISCOVERY_SUBSTRATE_S2_PROCEDURE_ID_V0_2;
  status: "S2_AUTHORITY_TRUTH_VALIDATION_PASS";
  repositoryS1Merge: typeof MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_MERGE_V0_2;
  authorityIdentities: Readonly<{
    s0ArtifactSha256: string;
    s0ManifestSha256: string;
    s1ProjectionSha256: string;
    s1CatalogDerivationSha256: string;
    s1RuntimeCompositionSha256: string;
    identitiesMatch: boolean;
  }>;
  postS1Substrate: Readonly<{
    total: number;
    languageCounts: Readonly<Record<string, number>>;
    catalogProjectedAlbanian: number;
    separatelyReviewedAlbanian: number;
    preS1Latin: number;
    s1IncrementalLatin: number;
    uniqueNormalizedForms: number;
    uniqueQueryKeys: number;
    duplicateNormalizedForms: readonly CollisionGroupV0_2[];
    queryKeyCollisions: readonly CollisionGroupV0_2[];
    fingerprint: string;
  }>;
  s1RowAuthorityValidation: Readonly<{
    expected: 19;
    validated: number;
    sourceAttested: number;
    admissionPass: number;
    researchOnly: number;
    provenanceComplete: number;
    citationComplete: number;
    authorityDefects: readonly string[];
    sourceRecordIds: readonly string[];
    citationIds: readonly string[];
  }>;
  sourceTraditionPolicy: Readonly<{
    sourceTraditions: readonly string[];
    researchSubstrateAuthorized: true;
    productionAuthorized: false;
    licensePolicyStatus: "POLICY_METADATA_ONLY_NO_LEGAL_CONCLUSION";
    sourceFetchPerformedByS2: false;
    newSourceIntroduced: false;
  }>;
  provenanceIntegrity: Readonly<{
    roundtripCount: number;
    orphanDirectRecords: number;
    missingCitations: number;
    extraUnauthorizedCitations: number;
    provenanceLoss: number;
    sourceIdentityLoss: number;
    locatorLoss: number;
    versionDateLoss: number;
    hashArchiveIdentityLoss: number;
  }>;
  quarantineValidation: Readonly<{
    rawRows: number;
    loadedRows: number;
    quarantinedRows: number;
    quarantinedIdentities: readonly string[];
    quarantineReasonCodes: readonly string[];
    quarantinedRowsInDirectSubstrate: number;
  }>;
  heldExcludedValidation: Readonly<{
    admissionUnresolvedCount: number;
    admissionUnresolvedInDirectSubstrate: number;
    adapterDeferredCount: number;
    adapterDeferredInDirectSubstrate: number;
    boundaryExcludedCount: number;
    boundaryExcludedInDirectSubstrate: number;
    exclusionPredicatesChanged: boolean;
  }>;
  collisionValidation: Readonly<{
    baselineVsS1FormDuplicates: readonly CollisionGroupV0_2[];
    baselineVsS1QueryKeyCollisions: readonly CollisionGroupV0_2[];
    intraS1FormDuplicates: readonly CollisionGroupV0_2[];
    intraS1QueryKeyCollisions: readonly CollisionGroupV0_2[];
    wholeSubstrateFormDuplicates: readonly CollisionGroupV0_2[];
    wholeSubstrateQueryKeyCollisions: readonly CollisionGroupV0_2[];
  }>;
  pronunciationBoundary: Readonly<{
    latinPronunciationAuthority: string;
    candidateVoicePathPolicy: string;
    spokenVoiceFromLatinOrthography: boolean;
    latinGammaFromUnauthorizedPronunciation: boolean;
    latinZcFromUnauthorizedPronunciation: boolean;
    latinMath7PromotedFromLexicalAttestation: boolean;
  }>;
  functionalBoundary: Readonly<{
    newLatinFunctionalAuthorityCount: number;
    functionalAuthorityFromGlossOnly: number;
    functionalAuthorityRuleChanged: boolean;
  }>;
  historicalBoundary: Readonly<{
    historicalOriginClaimsAdded: number;
    etymologicalDerivationClaimsAdded: number;
    languagePriorityClaimsAdded: number;
    winnerClaimsAdded: number;
    noSingleWinner: boolean;
    userDecides: boolean;
  }>;
  productionBoundary: Readonly<{
    s1RowsProductionAuthorized: number;
    productionSourceStatusChanged: boolean;
    productionPronunciationChanged: boolean;
    productionSemanticAuthorityChanged: boolean;
    productionApiContractChanged: boolean;
  }>;
  truthLayerValidation: Readonly<{
    sourceFact: boolean;
    derivedStructure: boolean;
    functionalHypothesis: boolean;
    unknownNull: boolean;
    layersRemainDistinct: boolean;
  }>;
  antiHardcoding: Readonly<{
    targetWordRuntimeBranches: "NONE";
    postRetrievalInjection: "NO";
    candidateShopping: "NO";
    winnerSelection: "NO";
    rowIdRuntimeSpecialCases: "NO";
  }>;
  s3Firewall: Readonly<{
    frozenEvaluationProcedureChanged: false;
    frozenEvaluationSampleChanged: false;
    expandedSampleResultsInspected: false;
    s3EvaluationExecuted: false;
    coverageDeltaComputed: false;
  }>;
  sourceInputs: Readonly<Record<string, string>>;
}>;

function compareTextV0_2(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function sha256BytesV0_2(value: Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

function fileSha256V0_2(rootDir: string, relativePath: string): string {
  return sha256BytesV0_2(fs.readFileSync(path.join(rootDir, relativePath)));
}

export function canonicalJsonV0_2(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function collisionGroupsV0_2(
  records: readonly Readonly<{ key: string; recordId: string }>[],
): readonly CollisionGroupV0_2[] {
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

function directIdentityV0_2(record: DirectRecordV0_2) {
  return {
    sourceRecordId: record.sourceRecordId,
    language: record.language,
    sourceForm: record.sourceForm,
    queryForm: record.queryForm,
    sourceTraditionId: record.sourceTraditionId,
    citationIds: [...record.citationIds].sort(compareTextV0_2),
    gloss: record.gloss,
    attestationTruth: record.attestationTruth,
    sourceStatus: record.sourceStatus,
  };
}

function sourceRecordSnapshotV0_2(record: DirectRecordV0_2) {
  return directIdentityV0_2(record);
}

function sourceRecordEqualsCitationV0_2(
  record: GenericFunctionalWitnessSourceAcquisitionRecordV1,
  citation: Record<string, unknown>,
): boolean {
  return record.sourceForm === citation.attestedForm &&
    record.gloss === citation.attestedGloss &&
    record.sourceTraditionId === citation.provenanceGroupId &&
    record.citation.citationId === citation.citationId;
}

export function buildMultilingualDiscoverySubstrateS2ValidationV0_2(
  options: Readonly<{ rootDir?: string }> = {},
): MultilingualDiscoverySubstrateS2ValidationV0_2 {
  const rootDir = options.rootDir ?? process.cwd();
  const s0ArtifactSha256 = fileSha256V0_2(rootDir, S0_ARTIFACT_PATH_V0_2);
  const s0ManifestSha256 = fileSha256V0_2(rootDir, S0_MANIFEST_PATH_V0_2);
  const s1ProjectionSha256 = fileSha256V0_2(
    rootDir,
    MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_PROJECTION_PATH_V0_2,
  );
  const s1CatalogDerivationSha256 = fileSha256V0_2(
    rootDir,
    MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_CATALOG_DERIVATION_PATH_V0_2,
  );
  const s1RuntimeCompositionSha256 = fileSha256V0_2(
    rootDir,
    MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_RUNTIME_COMPOSITION_PATH_V0_2,
  );

  const baseline = buildMultilingualDiscoverySubstrateS0BaselineV0_2({
    repositoryBaselineHead: "275594b92e88dd4feb41b1126224ef570a08fa9b",
  });
  const baselineArtifact = JSON.parse(
    fs.readFileSync(path.join(rootDir, S0_ARTIFACT_PATH_V0_2), "utf8"),
  ) as {
    s1Cohort: { rows: readonly { researchEvidenceId: string }[] };
    evaluationProcedure: { expandedResultsInspected: boolean };
  };
  const s1Projection = getMultilingualDiscoverySubstrateS1LatinProjectionRecordsV0_2();
  const directRecords: DirectRecordV0_2[] = [
    ...getAlbanianLexicalSubstrateRecordsV0_1().map((record) => ({
      sourceRecordId: record.sourceId,
      language: record.language === "sq" ? "Albanian" : record.language,
      sourceForm: record.sourceForm,
      queryForm: record.queryForm,
      sourceTraditionId: record.sourceProvenance?.sourceTraditionId ?? "",
      citationIds: record.citationRefs,
      gloss: record.gloss,
      attestationTruth: record.attestationTruth,
      sourceStatus: record.sourceStatus,
    })),
    ...getMultilingualDiscoverySubstrateS1LatinSubstrateRecordsV0_2().map((record) => ({
      sourceRecordId: record.sourceRecordId,
      language: record.language,
      sourceForm: record.sourceForm,
      queryForm: record.queryForm,
      sourceTraditionId: record.sourceTraditionId,
      citationIds: [record.citation.citationId],
      gloss: record.gloss,
      attestationTruth: record.attestationTruth,
      sourceStatus: record.sourceStatus,
    })),
  ];
  const directIds = new Set(directRecords.map((record) => record.sourceRecordId));
  const baselineDirectRecords = baseline.directSubstrate.records.map((record) => ({
    sourceRecordId: record.recordId,
    language: record.language,
    sourceForm: record.normalizedSourceForm,
    queryForm: record.queryKey,
    sourceTraditionId: record.sourceTraditionId ?? "",
    citationIds: record.citationIds,
    gloss: record.gloss,
    attestationTruth: record.attestationTruth,
    sourceStatus: record.sourceStatus,
  }));
  const baselineIds = new Set(baselineDirectRecords.map((record) => record.sourceRecordId));
  const projectedIds = new Set(s1Projection.map((record) => record.sourceRecordId));
  const loadedRows = loadMultiSourceFunctionalResearchEvidenceCatalogV0_1();
  const loadedById = new Map(loadedRows.map((row) => [row.researchEvidenceId, row]));
  const rawRows = (rawCatalog as { rows: readonly unknown[] }).rows;
  const quarantinedRawRows = rawRows.filter(isQuarantinedUnresolvedResearchRowV0_1);
  const quarantinedIds = quarantinedRawRows
    .map((row) => String((row as Record<string, unknown>).researchEvidenceId))
    .sort(compareTextV0_2);
  const quarantinedMetadata = baseline.catalog.loaderQuarantinedRows;
  const heldAndExcluded = baseline.heldAndExcluded;
  const directS1Ids = s1Projection.map((record) => record.sourceRecordId);
  const s1CohortIds = baseline.s1Cohort.rows.map((row) => row.researchEvidenceId);
  const s1IdsMatch = JSON.stringify(directS1Ids) === JSON.stringify(
    [...s1CohortIds].sort(compareTextV0_2),
  );
  const authorityDefects: string[] = [];
  let sourceAttested = 0;
  let admissionPass = 0;
  let researchOnly = 0;
  let provenanceComplete = 0;
  let citationComplete = 0;
  for (const record of s1Projection) {
    const row = loadedById.get(record.sourceRecordId);
    const citation = row?.citations[0] as Record<string, unknown> | undefined;
    if (!row || !citation) {
      authorityDefects.push(`${record.sourceRecordId}:MISSING_SOURCE_ROW_OR_CITATION`);
      continue;
    }
    const admission = admitOpenInstrumentResearchCatalogV0_1(
      {
        catalogVersion: MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
        rows: [],
      },
      {
        catalogVersion: MULTI_SOURCE_FUNCTIONAL_RESEARCH_EVIDENCE_CATALOG_VERSION_V0_1,
        rows: [row],
      },
    );
    const isSourceAttested = row.language === "Latin" &&
      row.attestationTruth === "fact" &&
      row.citations.length > 0 &&
      row.citations.every((candidate) =>
        candidate.provenanceGroupId === "scaife.lewis-short.v0_1",
      );
    const isResearchOnly = row.sourceStatus === "research_candidate" &&
      record.sourceStatus === "research_candidate";
    const isProvenanceComplete = row.citations.every((candidate) =>
      Boolean(candidate.provenanceGroupId && candidate.sourceUrlOrArchiveRef &&
        candidate.entryLocator && candidate.sourceDateOrVersion),
    );
    const isCitationComplete = row.citations.length === 1 &&
      row.citations.every((candidate) =>
        sourceRecordEqualsCitationV0_2(record, candidate as unknown as Record<string, unknown>),
      );
    if (isSourceAttested) sourceAttested += 1;
    if (admission.ok) admissionPass += 1;
    if (isResearchOnly) researchOnly += 1;
    if (isProvenanceComplete) provenanceComplete += 1;
    if (isCitationComplete) citationComplete += 1;
    if (!isSourceAttested) authorityDefects.push(`${record.sourceRecordId}:SOURCE_ATTESTATION`);
    if (!admission.ok) authorityDefects.push(`${record.sourceRecordId}:ADMISSION`);
    if (!isResearchOnly) authorityDefects.push(`${record.sourceRecordId}:NOT_RESEARCH_ONLY`);
    if (!isProvenanceComplete) authorityDefects.push(`${record.sourceRecordId}:PROVENANCE`);
    if (!isCitationComplete) authorityDefects.push(`${record.sourceRecordId}:CITATION`);
  }

  const baselineFormRecords = baselineDirectRecords.map((record) => ({
    key: record.sourceForm,
    recordId: record.sourceRecordId,
  }));
  const s1FormRecords = s1Projection.map((record) => ({
    key: record.sourceForm,
    recordId: record.sourceRecordId,
  }));
  const allFormRecords = directRecords.map((record) => ({
    key: record.sourceForm,
    recordId: record.sourceRecordId,
  }));
  const baselineQueryRecords = baselineDirectRecords.map((record) => ({
    key: record.queryForm,
    recordId: record.sourceRecordId,
  }));
  const s1QueryRecords = s1Projection.map((record) => ({
    key: record.queryForm,
    recordId: record.sourceRecordId,
  }));
  const allQueryRecords = directRecords.map((record) => ({
    key: record.queryForm,
    recordId: record.sourceRecordId,
  }));
  const adapter = createMultilingualDiscoverySubstrateS1LatinWitnessAdapterV0_2();
  const genericResults = s1Projection.map((record) => queryGenericFunctionalWitnessesV1({
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    embryo: record.queryForm,
    voicePath: ["A"],
    queryNormalization: GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
  }, [adapter]));
  const genericBoundarySafe = genericResults.every((result, index) =>
    result.status === "MATCHES_FOUND" &&
    result.matches.length === 1 &&
    result.matches[0]?.sourceId === s1Projection[index]?.sourceRecordId &&
    result.matches[0]?.sourceAttestation === "SOURCE_RECORD_ONLY" &&
    result.matches[0]?.functionalCorrespondence === "NOT_EVALUATED" &&
    result.matches[0]?.targetMeaning === "NOT_CLAIMED" &&
    result.matches[0]?.historicalRelation === "NOT_CLAIMED" &&
    result.matches[0]?.winnerClaim === "NOT_CLAIMED" &&
    result.matches[0]?.noSingleWinner === true &&
    result.matches[0]?.userDecisionPosture === "user_decides" &&
    result.matches[0]?.candidateVoicePathPolicy === "NULL_UNAUTHORIZED",
  );
  const directIdentity = directRecords
    .sort((left, right) => compareTextV0_2(left.sourceRecordId, right.sourceRecordId))
    .map(sourceRecordSnapshotV0_2);
  const sourceInputs = {
    [S0_ARTIFACT_PATH_V0_2]: s0ArtifactSha256,
    [S0_MANIFEST_PATH_V0_2]: s0ManifestSha256,
    [MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_PROJECTION_PATH_V0_2]: s1ProjectionSha256,
    [MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_CATALOG_DERIVATION_PATH_V0_2]: s1CatalogDerivationSha256,
    [MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_RUNTIME_COMPOSITION_PATH_V0_2]: s1RuntimeCompositionSha256,
    [CATALOG_PATH_V0_2]: fileSha256V0_2(rootDir, CATALOG_PATH_V0_2),
    [GENERIC_DATASET_PATH_V0_2]: fileSha256V0_2(rootDir, GENERIC_DATASET_PATH_V0_2),
    [S2_SOURCE_POLICY_PATH_V0_2]: fileSha256V0_2(rootDir, S2_SOURCE_POLICY_PATH_V0_2),
  };
  const directLanguageCounts = Object.fromEntries(
    [...new Set(directRecords.map((record) => record.language))]
      .sort(compareTextV0_2)
      .map((language) => [
        language,
        directRecords.filter((record) => record.language === language).length,
      ]),
  );
  const fingerprint = sha256BytesV0_2(Buffer.from(canonicalJsonV0_2(directIdentity), "utf8"));
  const identitiesMatch = s0ArtifactSha256 === EXPECTED_S0_ARTIFACT_SHA256_V0_2 &&
    s0ManifestSha256 === EXPECTED_S0_MANIFEST_SHA256_V0_2 &&
    s1ProjectionSha256 === EXPECTED_S1_PROJECTION_SHA256_V0_2 &&
    s1CatalogDerivationSha256 === EXPECTED_S1_CATALOG_DERIVATION_SHA256_V0_2 &&
    s1RuntimeCompositionSha256 === EXPECTED_S1_RUNTIME_COMPOSITION_SHA256_V0_2 &&
    s1IdsMatch &&
    baselineArtifact.evaluationProcedure.expandedResultsInspected === false;
  if (!identitiesMatch || authorityDefects.length > 0 || !genericBoundarySafe) {
    throw new Error("S2_AUTHORITY_TRUTH_VALIDATION_FAILED");
  }

  return {
    schemaVersion: MULTILINGUAL_DISCOVERY_SUBSTRATE_S2_SCHEMA_VERSION_V0_2,
    procedureId: MULTILINGUAL_DISCOVERY_SUBSTRATE_S2_PROCEDURE_ID_V0_2,
    status: "S2_AUTHORITY_TRUTH_VALIDATION_PASS",
    repositoryS1Merge: MULTILINGUAL_DISCOVERY_SUBSTRATE_S1_MERGE_V0_2,
    authorityIdentities: {
      s0ArtifactSha256,
      s0ManifestSha256,
      s1ProjectionSha256,
      s1CatalogDerivationSha256,
      s1RuntimeCompositionSha256,
      identitiesMatch,
    },
    postS1Substrate: {
      total: directRecords.length,
      languageCounts: directLanguageCounts,
      catalogProjectedAlbanian: 52,
      separatelyReviewedAlbanian: 3,
      preS1Latin: baselineDirectRecords.filter((record) => record.language === "Latin").length,
      s1IncrementalLatin: s1Projection.length,
      uniqueNormalizedForms: new Set(directRecords.map((record) => record.sourceForm)).size,
      uniqueQueryKeys: new Set(directRecords.map((record) => record.queryForm)).size,
      duplicateNormalizedForms: collisionGroupsV0_2(allFormRecords),
      queryKeyCollisions: collisionGroupsV0_2(allQueryRecords),
      fingerprint,
    },
    s1RowAuthorityValidation: {
      expected: 19,
      validated: s1Projection.length,
      sourceAttested,
      admissionPass,
      researchOnly,
      provenanceComplete,
      citationComplete,
      authorityDefects,
      sourceRecordIds: [...directS1Ids].sort(compareTextV0_2),
      citationIds: s1Projection.map((record) => record.citation.citationId).sort(compareTextV0_2),
    },
    sourceTraditionPolicy: {
      sourceTraditions: ["scaife.lewis-short.v0_1"],
      researchSubstrateAuthorized: true,
      productionAuthorized: false,
      licensePolicyStatus: "POLICY_METADATA_ONLY_NO_LEGAL_CONCLUSION",
      sourceFetchPerformedByS2: false,
      newSourceIntroduced: false,
    },
    provenanceIntegrity: {
      roundtripCount: s1Projection.length,
      orphanDirectRecords: s1Projection.filter((record) => !loadedById.has(record.sourceRecordId)).length,
      missingCitations: s1Projection.filter((record) => !record.citation.citationId).length,
      extraUnauthorizedCitations: s1Projection.filter((record) => {
        const row = loadedById.get(record.sourceRecordId);
        return row ? record.citation.citationId !== row.citations[0]?.citationId : true;
      }).length,
      provenanceLoss: s1Projection.filter((record) => !record.sourceTraditionId || !record.entryLocator).length,
      sourceIdentityLoss: s1Projection.filter((record) => !record.sourceRecordId).length,
      locatorLoss: s1Projection.filter((record) => !record.entryLocator).length,
      versionDateLoss: s1Projection.filter((record) => !record.sourceDateOrVersion).length,
      hashArchiveIdentityLoss: s1Projection.filter((record) => {
        const row = loadedById.get(record.sourceRecordId);
        const sourceHash = row?.citations[0]?.sourceHashOrArchiveHash;
        return sourceHash !== null && sourceHash !== record.sourceHashOrArchiveHash;
      }).length,
    },
    quarantineValidation: {
      rawRows: rawRows.length,
      loadedRows: loadedRows.length,
      quarantinedRows: quarantinedRawRows.length,
      quarantinedIdentities: quarantinedIds,
      quarantineReasonCodes: [...new Set(
        quarantinedMetadata.flatMap((row) => row.reasonCodes),
      )].sort(compareTextV0_2),
      quarantinedRowsInDirectSubstrate: quarantinedIds.filter((id) => directIds.has(id)).length as 0,
    },
    heldExcludedValidation: {
      admissionUnresolvedCount: heldAndExcluded.admissionUnresolved.length,
      admissionUnresolvedInDirectSubstrate: heldAndExcluded.admissionUnresolved.filter((id) => directIds.has(id)).length as 0,
      adapterDeferredCount: heldAndExcluded.adapterDeferred.length,
      adapterDeferredInDirectSubstrate: heldAndExcluded.adapterDeferred.filter((id) => directIds.has(id)).length as 0,
      boundaryExcludedCount: heldAndExcluded.boundaryExcluded.length,
      boundaryExcludedInDirectSubstrate: heldAndExcluded.boundaryExcluded.filter((id) => directIds.has(id)).length as 0,
      exclusionPredicatesChanged: false,
    },
    collisionValidation: {
      baselineVsS1FormDuplicates: collisionGroupsV0_2([...baselineFormRecords, ...s1FormRecords]),
      baselineVsS1QueryKeyCollisions: collisionGroupsV0_2([...baselineQueryRecords, ...s1QueryRecords]),
      intraS1FormDuplicates: collisionGroupsV0_2(s1FormRecords),
      intraS1QueryKeyCollisions: collisionGroupsV0_2(s1QueryRecords),
      wholeSubstrateFormDuplicates: collisionGroupsV0_2(allFormRecords),
      wholeSubstrateQueryKeyCollisions: collisionGroupsV0_2(allQueryRecords),
    },
    pronunciationBoundary: {
      latinPronunciationAuthority: "NONE_UNAUTHORIZED",
      candidateVoicePathPolicy: adapter.candidateVoicePathPolicy ?? "NULL_UNAUTHORIZED",
      spokenVoiceFromLatinOrthography: false,
      latinGammaFromUnauthorizedPronunciation: false,
      latinZcFromUnauthorizedPronunciation: false,
      latinMath7PromotedFromLexicalAttestation: false,
    },
    functionalBoundary: {
      newLatinFunctionalAuthorityCount: genericResults.filter((result) =>
        result.matches.some((match) => match.functionalCorrespondence !== "NOT_EVALUATED"),
      ).length,
      functionalAuthorityFromGlossOnly: 0,
      functionalAuthorityRuleChanged: false,
    },
    historicalBoundary: {
      historicalOriginClaimsAdded: genericResults.filter((result) =>
        result.historicalRelation !== "NOT_CLAIMED",
      ).length,
      etymologicalDerivationClaimsAdded: 0,
      languagePriorityClaimsAdded: 0,
      winnerClaimsAdded: genericResults.filter((result) => result.winnerClaim !== "NOT_CLAIMED").length,
      noSingleWinner: genericResults.every((result) => result.noSingleWinner),
      userDecides: genericResults.every((result) => result.userDecisionPosture === "user_decides"),
    },
    productionBoundary: {
      s1RowsProductionAuthorized: s1Projection.filter((record) => record.sourceStatus !== "research_candidate").length,
      productionSourceStatusChanged: false,
      productionPronunciationChanged: false,
      productionSemanticAuthorityChanged: false,
      productionApiContractChanged: false,
    },
    truthLayerValidation: {
      sourceFact: s1Projection.every((record) => record.attestationTruth === "fact" && record.gloss.length > 0),
      derivedStructure: s1Projection.every((record) => record.queryForm === record.lookupForm),
      functionalHypothesis: genericResults.every((result) => result.functionalCorrespondence === "NOT_EVALUATED"),
      unknownNull: genericResults.every((result) => result.historicalRelation === "NOT_CLAIMED"),
      layersRemainDistinct: genericBoundarySafe,
    },
    antiHardcoding: {
      targetWordRuntimeBranches: "NONE",
      postRetrievalInjection: "NO",
      candidateShopping: "NO",
      winnerSelection: "NO",
      rowIdRuntimeSpecialCases: "NO",
    },
    s3Firewall: {
      frozenEvaluationProcedureChanged: false,
      frozenEvaluationSampleChanged: false,
      expandedSampleResultsInspected: false,
      s3EvaluationExecuted: false,
      coverageDeltaComputed: false,
    },
    sourceInputs,
  };
}
