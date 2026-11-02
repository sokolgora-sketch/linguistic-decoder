import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "../reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  projectReviewedExternalLexiconProductionRowForRuntimeV0_1,
} from "../reviewedExternalLexiconRuntimeProjection.v0_1";
import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
} from "../reviewedExternalLexiconEvidenceGate.validator.v0_1";
import type {
  GenericFunctionalWitnessQueryV1,
  GenericFunctionalWitnessSourceAdapterResultV1,
  GenericFunctionalWitnessSourceAdapterV1,
} from "./genericFunctionalWitnessDiscovery.v1";

export const REVIEWED_EXTERNAL_LEXICON_WITNESS_ADAPTER_ID_V0_1 =
  "reviewed-external-lexicon-production-source-rows.v0_1" as const;

const REVIEWED_EMBRYO_LOOKUP_OPERATION_V0_1 =
  "reviewed_external_lexicon_source_row_embryo_lookup_v0_1";

function compareTextV0_1(left: string, right: string): number {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function firstCitation(row: ReviewedExternalLexiconCandidateSourceRowV0_1) {
  return row.externalCitations[0];
}

function projectRow(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
  input: GenericFunctionalWitnessQueryV1,
) {
  if (row.embryo !== input.embryo) return null;
  if (row.sourceStatus !== "reviewed_accepted") return null;

  const runtimeProjection =
    projectReviewedExternalLexiconProductionRowForRuntimeV0_1(row);
  const citation = firstCitation(row);

  if (!runtimeProjection || !citation) return null;

  const sourceForm = citation.attestedForm?.trim();
  const gloss = citation.attestedGloss?.trim();
  const citationRefs = row.externalCitations
    .map((candidate) => candidate.citationId.trim())
    .filter(Boolean)
    .sort(compareTextV0_1);

  if (!sourceForm || !gloss || citationRefs.length === 0) return null;

  return {
    queryForm: input.embryo,
    sourceId: row.sourceId,
    evidenceFamily: "lexical_dictionary" as const,
    language: row.candidateLanguage,
    languageVariety: null,
    sourceForm,
    sourceFormNormalization: "EXACT_PRESERVED" as const,
    gloss,
    citationRefs,
    embryoRelation: "authorized_transformation" as const,
    relationOperationIds: [REVIEWED_EMBRYO_LOOKUP_OPERATION_V0_1],
    attestationTruth: "fact" as const,
    sourceStatus: "reviewed_candidate" as const,
    sourceAuthorityStatus: row.sourceStatus,
    sourceProvenance: {
      sourceRecordId: row.sourceId,
      sourceTraditionId:
        "reviewed-external-lexicon-source-row-registry.v0_1",
      sourceTitle: citation.sourceTitle ?? row.sourceKind,
      sourceDateOrVersion: citation.sourceDateOrVersion ?? "",
      sourceUrlOrArchiveRef: citation.sourceUrlOrArchiveRef ?? "",
      entryLocator: citation.entryLocator ?? "",
      sourceHashOrArchiveHash: citation.sourceHashOrArchiveHash,
      languageVariety: null,
    },
  };
}

/**
 * Adapts already-authorized reviewed lexical rows to the generic embryo query.
 * It does not admit rows, create source meaning, or bind a witness to a target.
 */
export function createReviewedExternalLexiconWitnessAdapterV0_1():
  GenericFunctionalWitnessSourceAdapterV1 {
  const rows = [...getReviewedExternalLexiconProductionSourceRowsV0_1()].sort(
    (left, right) => compareTextV0_1(left.sourceId, right.sourceId),
  );

  return Object.freeze({
    adapterId: REVIEWED_EXTERNAL_LEXICON_WITNESS_ADAPTER_ID_V0_1,
    query(
      input: GenericFunctionalWitnessQueryV1,
    ): GenericFunctionalWitnessSourceAdapterResultV1 {
      return {
        ok: true,
        records: rows
          .map((row) => projectRow(row, input))
          .filter((record): record is NonNullable<typeof record> => record !== null),
      };
    },
  });
}
