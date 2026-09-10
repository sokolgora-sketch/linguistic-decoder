import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "../reviewedExternalLexiconSourceRowRegistry.v0_1";
import type {
  ReviewedExternalLexiconCitationV0_1,
  ReviewedExternalLexiconSourceStatusV0_1,
} from "../reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "../multiSourceFunctionalResearchEvidenceCatalog.v0_1";
import type {
  MultiSourceFunctionalResearchCitationV0_1,
  MultiSourceFunctionalResearchSourceStatusV0_1,
} from "../multiSourceFunctionalResearchEvidenceRegistry.v0_1";

export type EvidenceReferenceResolutionKindV0_1 =
  | "internal_diagnostic"
  | "reviewed_evidence"
  | "research_evidence"
  | "unresolved";

export type EvidenceReferenceDestinationTypeV0_1 =
  | "external_primary_source"
  | "internal_record"
  | "none";

export type EvidenceReferenceResolutionV0_1 = Readonly<{
  originalRef: string;
  kind: EvidenceReferenceResolutionKindV0_1;
  sourceId?: string;
  researchEvidenceId?: string;
  citationId?: string;
  title?: string;
  locator?: string;
  sourceStatus?: string;
  destinationType: EvidenceReferenceDestinationTypeV0_1;
  safeUrl?: string;
  navigable: boolean;
}>;

export type ReviewedEvidenceReferenceInputV0_1 = {
  ref: string;
  sourceId?: string;
  citationId?: string;
  sourceStatus?: ReviewedExternalLexiconSourceStatusV0_1;
};

export type ResearchEvidenceReferenceInputV0_1 = {
  ref: string;
  researchEvidenceId?: string;
  citationId?: string;
  sourceStatus?: MultiSourceFunctionalResearchSourceStatusV0_1;
};

export type ReviewedEvidenceCitationResolutionInputV0_1 = {
  originalRef: string;
  sourceId: string;
  sourceStatus: ReviewedExternalLexiconSourceStatusV0_1;
  citation: ReviewedExternalLexiconCitationV0_1 | null | undefined;
};

export type ResearchEvidenceCitationResolutionInputV0_1 = {
  originalRef: string;
  researchEvidenceId: string;
  sourceStatus: MultiSourceFunctionalResearchSourceStatusV0_1;
  citation: MultiSourceFunctionalResearchCitationV0_1 | null | undefined;
};

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function textV0_1(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFC").trim() : "";
}

function originalRefV0_1(value: unknown): string {
  return isRecordV0_1(value) ? (typeof value.ref === "string" ? value.ref : "") : "";
}

function unresolvedV0_1(originalRef: string): EvidenceReferenceResolutionV0_1 {
  return {
    originalRef,
    kind: "unresolved",
    destinationType: "none",
    navigable: false,
  };
}

/**
 * Allow only absolute HTTP(S) URLs from source metadata. This function does
 * not fetch, normalize into a different destination, or infer URLs from
 * locators/archive text.
 */
export function isSafeEvidenceUrlV0_1(value: unknown): string | null {
  if (typeof value !== "string") return null;

  const candidate = value.trim();
  if (!candidate || candidate.startsWith("//")) return null;

  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null;
    }

    if (!parsed.hostname) return null;
    return candidate;
  } catch {
    return null;
  }
}

function resolvedCitationV0_1(options: {
  originalRef: string;
  kind: "reviewed_evidence" | "research_evidence";
  sourceId?: string;
  researchEvidenceId?: string;
  sourceStatus: string;
  citationId: string;
  sourceTitle: string | null;
  sourceUrlOrArchiveRef: string | null;
  entryLocator: string | null;
}): EvidenceReferenceResolutionV0_1 {
  const safeUrl = isSafeEvidenceUrlV0_1(options.sourceUrlOrArchiveRef);
  const title = textV0_1(options.sourceTitle) || undefined;
  const locator = textV0_1(options.entryLocator) || undefined;

  return {
    originalRef: options.originalRef,
    kind: options.kind,
    ...(options.sourceId ? { sourceId: options.sourceId } : {}),
    ...(options.researchEvidenceId
      ? { researchEvidenceId: options.researchEvidenceId }
      : {}),
    citationId: options.citationId,
    ...(title ? { title } : {}),
    ...(locator ? { locator } : {}),
    sourceStatus: options.sourceStatus,
    destinationType: safeUrl ? "external_primary_source" : "none",
    ...(safeUrl ? { safeUrl } : {}),
    navigable: Boolean(safeUrl),
  };
}

export function resolveReviewedEvidenceCitationV0_1(
  input: ReviewedEvidenceCitationResolutionInputV0_1 | null | undefined,
): EvidenceReferenceResolutionV0_1 {
  const citation = input?.citation;
  if (
    !input ||
    !textV0_1(input.originalRef) ||
    !textV0_1(input.sourceId) ||
    input.sourceStatus !== "reviewed_accepted" ||
    !citation ||
    citation.citationStatus !== "reviewed_accepted" ||
    !textV0_1(citation.citationId)
  ) {
    return unresolvedV0_1(input?.originalRef ?? "");
  }

  return resolvedCitationV0_1({
    originalRef: input.originalRef,
    kind: "reviewed_evidence",
    sourceId: input.sourceId,
    sourceStatus: input.sourceStatus,
    citationId: citation.citationId,
    sourceTitle: citation.sourceTitle,
    sourceUrlOrArchiveRef: citation.sourceUrlOrArchiveRef,
    entryLocator: citation.entryLocator,
  });
}

export function resolveReviewedEvidenceReferenceV0_1(
  input: ReviewedEvidenceReferenceInputV0_1 | null | undefined,
): EvidenceReferenceResolutionV0_1 {
  const originalRef = originalRefV0_1(input);
  if (!textV0_1(originalRef) || !isRecordV0_1(input)) {
    return unresolvedV0_1(originalRef);
  }

  const requestedSourceId = textV0_1(input.sourceId);
  const requestedCitationId = textV0_1(input.citationId);
  const requestedStatus = textV0_1(input.sourceStatus);
  const lookupRef = textV0_1(originalRef);
  const rows = getReviewedExternalLexiconProductionSourceRowsV0_1();

  for (const row of rows) {
    const sourceMatches = requestedSourceId
      ? row.sourceId === requestedSourceId
      : !requestedCitationId && row.sourceId === lookupRef;

    if (!sourceMatches && requestedSourceId) continue;

    for (const citation of row.externalCitations) {
      const citationMatches = requestedCitationId
        ? citation.citationId === requestedCitationId
        : citation.citationId === lookupRef;

      if (!citationMatches) continue;
      if (requestedStatus && row.sourceStatus !== requestedStatus) {
        return unresolvedV0_1(originalRef);
      }

      return resolveReviewedEvidenceCitationV0_1({
        originalRef,
        sourceId: row.sourceId,
        sourceStatus: row.sourceStatus,
        citation,
      });
    }

    if (
      sourceMatches &&
      !requestedCitationId &&
      row.sourceId === lookupRef
    ) {
      const citation = row.externalCitations[0];
      if (!citation) return unresolvedV0_1(originalRef);

      if (requestedStatus && row.sourceStatus !== requestedStatus) {
        return unresolvedV0_1(originalRef);
      }

      return resolveReviewedEvidenceCitationV0_1({
        originalRef,
        sourceId: row.sourceId,
        sourceStatus: row.sourceStatus,
        citation,
      });
    }
  }

  return unresolvedV0_1(originalRef);
}

export function resolveResearchEvidenceCitationV0_1(
  input: ResearchEvidenceCitationResolutionInputV0_1 | null | undefined,
): EvidenceReferenceResolutionV0_1 {
  const citation = input?.citation;
  if (
    !input ||
    !textV0_1(input.originalRef) ||
    !textV0_1(input.researchEvidenceId) ||
    (input.sourceStatus !== "research_candidate" &&
      input.sourceStatus !== "reviewed_candidate") ||
    !citation ||
    !textV0_1(citation.citationId)
  ) {
    return unresolvedV0_1(input?.originalRef ?? "");
  }

  return resolvedCitationV0_1({
    originalRef: input.originalRef,
    kind: "research_evidence",
    researchEvidenceId: input.researchEvidenceId,
    sourceStatus: input.sourceStatus,
    citationId: citation.citationId,
    sourceTitle: citation.sourceTitle,
    sourceUrlOrArchiveRef: citation.sourceUrlOrArchiveRef,
    entryLocator: citation.entryLocator,
  });
}

export function resolveResearchEvidenceReferenceV0_1(
  input: ResearchEvidenceReferenceInputV0_1 | null | undefined,
): EvidenceReferenceResolutionV0_1 {
  const originalRef = originalRefV0_1(input);
  if (!textV0_1(originalRef) || !isRecordV0_1(input)) {
    return unresolvedV0_1(originalRef);
  }

  const requestedResearchEvidenceId = textV0_1(input.researchEvidenceId);
  const requestedCitationId = textV0_1(input.citationId);
  const requestedStatus = textV0_1(input.sourceStatus);
  const lookupRef = textV0_1(originalRef);

  for (const row of loadMultiSourceFunctionalResearchEvidenceCatalogV0_1()) {
    const researchIdMatches = requestedResearchEvidenceId
      ? row.researchEvidenceId === requestedResearchEvidenceId
      : !requestedCitationId && row.researchEvidenceId === lookupRef;

    if (!researchIdMatches && requestedResearchEvidenceId) continue;

    for (const citation of row.citations) {
      const citationMatches = requestedCitationId
        ? citation.citationId === requestedCitationId
        : citation.citationId === lookupRef;

      if (!citationMatches) continue;
      if (requestedStatus && row.sourceStatus !== requestedStatus) {
        return unresolvedV0_1(originalRef);
      }

      return resolveResearchEvidenceCitationV0_1({
        originalRef,
        researchEvidenceId: row.researchEvidenceId,
        sourceStatus: row.sourceStatus,
        citation,
      });
    }

    if (
      researchIdMatches &&
      !requestedCitationId &&
      row.researchEvidenceId === lookupRef
    ) {
      const citation = row.citations[0];
      if (!citation) return unresolvedV0_1(originalRef);

      if (requestedStatus && row.sourceStatus !== requestedStatus) {
        return unresolvedV0_1(originalRef);
      }

      return resolveResearchEvidenceCitationV0_1({
        originalRef,
        researchEvidenceId: row.researchEvidenceId,
        sourceStatus: row.sourceStatus,
        citation,
      });
    }
  }

  return unresolvedV0_1(originalRef);
}

export function resolveInternalDiagnosticReferenceV0_1(
  ref: unknown,
): EvidenceReferenceResolutionV0_1 {
  const originalRef = typeof ref === "string" ? ref : "";
  if (!textV0_1(originalRef)) return unresolvedV0_1(originalRef);

  return {
    originalRef,
    kind: "internal_diagnostic",
    destinationType: "internal_record",
    navigable: false,
  };
}
