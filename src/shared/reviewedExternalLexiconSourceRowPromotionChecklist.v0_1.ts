import type { ReviewedExternalLexiconCandidateSourceRowV0_1 } from "./reviewedExternalLexiconEvidenceGate.validator.v0_1";

export type ReviewedExternalLexiconPromotionChecklistItemV0_1 = {
  id: string;
  label: string;
  passed: boolean;
};

export type ReviewedExternalLexiconPromotionChecklistV0_1 = {
  checklistVersion: "reviewed-external-lexicon-promotion-checklist.v0_1";
  sourceId: string;
  candidateId: string;
  promotionReady: boolean;
  items: ReviewedExternalLexiconPromotionChecklistItemV0_1[];
};

function hasText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function lacksMarker(value: unknown, marker: string): boolean {
  return typeof value !== "string" || !value.includes(marker);
}

function firstCitation(row: ReviewedExternalLexiconCandidateSourceRowV0_1) {
  return row.externalCitations[0];
}

function hasDirectAuthoritativeLocatorOrArchiveV0_1(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): boolean {
  const citation = firstCitation(row);
  const reviewNote = citation?.reviewNote ?? "";
  const sourceNote = row.sourceNote ?? "";

  if (reviewNote.includes("still required before production-live promotion")) return false;
  if (sourceNote.includes("production registry remains separately gated")) return false;

  return true;
}

export function buildReviewedExternalLexiconPromotionChecklistV0_1(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): ReviewedExternalLexiconPromotionChecklistV0_1 {
  const citation = firstCitation(row);

  const items: ReviewedExternalLexiconPromotionChecklistItemV0_1[] = [
    {
      id: "direct_authoritative_locator_or_archive",
      label: "Direct authoritative locator or archived authoritative dictionary evidence is present.",
      passed: hasDirectAuthoritativeLocatorOrArchiveV0_1(row),
    },
    {
      id: "source_status_reviewed_accepted",
      label: "Row has reviewed accepted source status.",
      passed: row.sourceStatus === "reviewed_accepted",
    },
    {
      id: "citation_status_reviewed_accepted",
      label: "Citation has reviewed accepted status.",
      passed: citation?.citationStatus === "reviewed_accepted",
    },
    {
      id: "citation_type_dictionary_entry",
      label: "Citation is a dictionary entry.",
      passed: citation?.citationType === "dictionary_entry",
    },
    {
      id: "source_title_present",
      label: "Citation source title is present.",
      passed: hasText(citation?.sourceTitle),
    },
    {
      id: "source_author_or_editor_present",
      label: "Citation author or editor is present.",
      passed: hasText(citation?.sourceAuthorOrEditor),
    },
    {
      id: "source_publisher_or_host_present",
      label: "Citation publisher or host is present.",
      passed: hasText(citation?.sourcePublisherOrHost),
    },
    {
      id: "source_date_or_version_present",
      label: "Citation date or version is present.",
      passed: hasText(citation?.sourceDateOrVersion),
    },
    {
      id: "source_url_or_archive_ref_finalized",
      label: "Citation URL/archive ref is finalized, not pending.",
      passed:
        hasText(citation?.sourceUrlOrArchiveRef) &&
        lacksMarker(citation?.sourceUrlOrArchiveRef, "pending-reviewed-external-citation:"),
    },
    {
      id: "entry_locator_finalized",
      label: "Citation entry locator is finalized, not pending.",
      passed: hasText(citation?.entryLocator) && lacksMarker(citation?.entryLocator, "pending:"),
    },
    {
      id: "reviewed_by_present",
      label: "Reviewer is present.",
      passed: hasText(citation?.reviewedBy),
    },
    {
      id: "reviewed_at_present",
      label: "Review date is present.",
      passed: hasText(citation?.reviewedAt),
    },
    {
      id: "source_hash_present",
      label: "Source hash or archive hash is present.",
      passed: hasText(citation?.sourceHashOrArchiveHash),
    },
    {
      id: "source_note_live_marker_removed",
      label: "Source note no longer contains NON-LIVE CANDIDATE.",
      passed: lacksMarker(row.sourceNote, "NON-LIVE CANDIDATE"),
    },
  ];

  return {
    checklistVersion: "reviewed-external-lexicon-promotion-checklist.v0_1",
    sourceId: row.sourceId,
    candidateId: row.candidateId,
    promotionReady: items.every((item) => item.passed),
    items,
  };
}
