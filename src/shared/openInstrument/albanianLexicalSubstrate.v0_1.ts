import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "../multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import type {
  MultiSourceFunctionalResearchEvidenceRowV0_1,
} from "../multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import type { EmbryoSourceRelationV0_1 } from "../multiSourceFunctionalDiscovery.v0_1";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "../reviewedExternalLexiconSourceRowRegistry.v0_1";
import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
} from "../reviewedExternalLexiconEvidenceGate.validator.v0_1";
import type {
  GenericFunctionalWitnessQueryV1,
  GenericFunctionalWitnessSourceAdapterResultV1,
  GenericFunctionalWitnessSourceAdapterV1,
  GenericFunctionalWitnessSourceRecordV1,
} from "./genericFunctionalWitnessDiscovery.v1";

export const ALBANIAN_LEXICAL_SUBSTRATE_ADAPTER_ID_V0_1 =
  "albanian-generic-lexical-substrate.v0_1" as const;

export const ALBANIAN_LEXICAL_SUBSTRATE_SOURCE_SCOPE_V0_1 =
  "GENERIC_ALBANIAN_LEXICAL_SOURCE_FACTS_ONLY" as const;

const RETRIEVABLE_RELATIONS_V0_1: ReadonlySet<EmbryoSourceRelationV0_1> = new Set([
  "exact_form",
  "authorized_transformation",
  "reconstructed_form",
  "phonetic_resemblance",
  "semantic_resemblance",
] as const);

function compareTextV0_1(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function nonEmptyTextV0_1(value: string | null | undefined): string | null {
  const text = typeof value === "string" ? value.normalize("NFC").trim() : "";
  return text || null;
}

function citationAttestationIsUsableV0_1(
  citation: MultiSourceFunctionalResearchEvidenceRowV0_1["citations"][number],
): boolean {
  return Boolean(
    nonEmptyTextV0_1(citation.citationId) &&
      nonEmptyTextV0_1(citation.sourceTitle) &&
      nonEmptyTextV0_1(citation.sourcePublisherOrHost) &&
      nonEmptyTextV0_1(citation.sourceDateOrVersion) &&
      nonEmptyTextV0_1(citation.sourceUrlOrArchiveRef) &&
      nonEmptyTextV0_1(citation.entryLocator) &&
      nonEmptyTextV0_1(citation.attestedForm) &&
      nonEmptyTextV0_1(citation.attestedGloss),
  );
}

function canonicalQueryKeyV0_1(value: string): string {
  return value.normalize("NFC").trim().toLocaleUpperCase("en-US");
}

function projectResearchRowV0_1(
  row: MultiSourceFunctionalResearchEvidenceRowV0_1,
): GenericFunctionalWitnessSourceRecordV1 | null {
  if (
    row.language.toLocaleLowerCase("en-US") !== "albanian" ||
    !RETRIEVABLE_RELATIONS_V0_1.has(row.embryoRelation)
  ) {
    return null;
  }

  const citations = [...row.citations].sort((left, right) =>
    compareTextV0_1(left.citationId, right.citationId),
  );
  // The registry row is the source unit. Citation glosses may be faithful
  // paraphrases, so wording differences alone do not authorize dropping the
  // row or inventing a semantic conflict adjudicator. Select the stable first
  // citation for the single-record value and preserve every citation ref.
  const citation = citations[0];
  if (
    !citation ||
    !citations.every(citationAttestationIsUsableV0_1)
  ) {
    return null;
  }

  const sourceForm = nonEmptyTextV0_1(citation.attestedForm);
  const gloss = nonEmptyTextV0_1(citation.attestedGloss);
  if (!sourceForm || !gloss) return null;

  return {
    queryForm: canonicalQueryKeyV0_1(row.embryo),
    sourceId: row.researchEvidenceId,
    evidenceFamily: row.evidenceFamily,
    language: row.language,
    languageVariety: null,
    sourceForm,
    sourceFormNormalization: "EXACT_PRESERVED",
    gloss,
    citationRefs: citations.map((candidate) => candidate.citationId),
    embryoRelation: row.embryoRelation,
    relationOperationIds: [...row.relationOperationIds].sort(compareTextV0_1),
    attestationTruth: row.attestationTruth,
    sourceStatus: row.sourceStatus,
    sourceProvenance: {
      sourceRecordId: row.researchEvidenceId,
      sourceTraditionId:
        citation.provenanceGroupId ??
        "multi-source-functional-research-evidence-catalog.v0_1",
      sourceTitle: citation.sourceTitle,
      sourceDateOrVersion: citation.sourceDateOrVersion,
      sourceUrlOrArchiveRef: citation.sourceUrlOrArchiveRef,
      entryLocator: citation.entryLocator,
      sourceHashOrArchiveHash: citation.sourceHashOrArchiveHash,
      languageVariety: null,
    },
  };
}

function projectReviewedRowV0_1(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): GenericFunctionalWitnessSourceRecordV1 | null {
  if (row.candidateLanguage !== "sq" || row.sourceStatus !== "reviewed_accepted") {
    return null;
  }

  const citations = [...row.externalCitations]
    .filter((citation) => citation.citationStatus === "reviewed_accepted")
    .sort((left, right) => compareTextV0_1(left.citationId, right.citationId));
  const citation = citations[0];
  const sourceForm = nonEmptyTextV0_1(citation?.attestedForm) ??
    nonEmptyTextV0_1(row.isolatedStandaloneForm);
  const gloss = nonEmptyTextV0_1(citation?.attestedGloss) ??
    nonEmptyTextV0_1(row.plainStandaloneGloss);

  if (
    !citation ||
    !sourceForm ||
    !gloss ||
    !nonEmptyTextV0_1(citation.sourceTitle) ||
    !nonEmptyTextV0_1(citation.sourceDateOrVersion) ||
    !nonEmptyTextV0_1(citation.sourceUrlOrArchiveRef) ||
    !nonEmptyTextV0_1(citation.entryLocator)
  ) {
    return null;
  }

  return {
    queryForm: canonicalQueryKeyV0_1(row.embryo),
    sourceId: row.sourceId,
    evidenceFamily: "lexical_dictionary",
    language: row.candidateLanguage,
    languageVariety: null,
    sourceForm,
    sourceFormNormalization: "EXACT_PRESERVED",
    gloss,
    citationRefs: citations.map((candidate) => candidate.citationId),
    embryoRelation: "authorized_transformation",
    relationOperationIds: [
      "reviewed_external_lexicon_source_row_embryo_lookup_v0_1",
    ],
    attestationTruth: "fact",
    sourceStatus: "reviewed_candidate",
    sourceAuthorityStatus: "reviewed_accepted",
    sourceProvenance: {
      sourceRecordId: row.sourceId,
      sourceTraditionId: "reviewed-external-lexicon-source-row-registry.v0_1",
      sourceTitle: citation.sourceTitle ?? row.sourceKind,
      sourceDateOrVersion: citation.sourceDateOrVersion ?? "",
      sourceUrlOrArchiveRef: citation.sourceUrlOrArchiveRef ?? "",
      entryLocator: citation.entryLocator ?? "",
      sourceHashOrArchiveHash: citation.sourceHashOrArchiveHash,
      languageVariety: null,
    },
  };
}

function buildRecordsV0_1(): readonly GenericFunctionalWitnessSourceRecordV1[] {
  const records = [
    ...loadMultiSourceFunctionalResearchEvidenceCatalogV0_1()
      .map(projectResearchRowV0_1),
    ...getReviewedExternalLexiconProductionSourceRowsV0_1()
      .map(projectReviewedRowV0_1),
  ].filter(
    (record): record is GenericFunctionalWitnessSourceRecordV1 => record !== null,
  );

  const bySourceId = new Map<string, GenericFunctionalWitnessSourceRecordV1>();
  for (const record of records.sort((left, right) =>
    compareTextV0_1(left.sourceId, right.sourceId),
  )) {
    if (!bySourceId.has(record.sourceId)) bySourceId.set(record.sourceId, record);
  }

  return Object.freeze([...bySourceId.values()]);
}

const ALBANIAN_LEXICAL_SUBSTRATE_RECORDS_V0_1 = buildRecordsV0_1();

export function getAlbanianLexicalSubstrateRecordsV0_1():
  readonly GenericFunctionalWitnessSourceRecordV1[] {
  return ALBANIAN_LEXICAL_SUBSTRATE_RECORDS_V0_1;
}

/**
 * Projects only source-attested Albanian lexical facts into the existing
 * generic embryo query contract. Target words, semantic bridges, functional
 * hypotheses, historical claims, and winner claims are never copied here.
 */
export function createAlbanianLexicalSubstrateWitnessAdapterV0_1():
  GenericFunctionalWitnessSourceAdapterV1 {
  const records = getAlbanianLexicalSubstrateRecordsV0_1();

  return Object.freeze({
    adapterId: ALBANIAN_LEXICAL_SUBSTRATE_ADAPTER_ID_V0_1,
    candidateVoicePathPolicy: "SOURCE_FORM_EXTRACTED" as const,
    query(input: GenericFunctionalWitnessQueryV1):
      GenericFunctionalWitnessSourceAdapterResultV1 {
      return {
        ok: true,
        records: records.filter(
          (record) => record.queryForm === canonicalQueryKeyV0_1(input.embryo),
        ),
      };
    },
  });
}
