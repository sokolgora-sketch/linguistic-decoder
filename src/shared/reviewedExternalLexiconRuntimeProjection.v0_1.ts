import type { ReviewedExternalLexiconCandidateSourceRowV0_1 } from "./reviewedExternalLexiconEvidenceGate.validator.v0_1";

export type ReviewedExternalLexiconRuntimeProjectionV0_1 = {
  projectionVersion: "reviewed-external-lexicon-runtime-projection.v0_1";
  sourceId: string;
  candidateId: string;
  embryo: string;
  isolatedStandaloneForm: string;
  evidenceText: string;
  claimBoundary: {
    historicalOriginClaim: "not_claimed";
    winnerClaim: "not_claimed";
    languageSuperiorityClaim: "not_claimed";
    userDecisionPosture: "user_decides";
  };
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function firstCitation(row: ReviewedExternalLexiconCandidateSourceRowV0_1) {
  return row.externalCitations[0];
}

function hasAcceptedProductionPromotionMarker(row: ReviewedExternalLexiconCandidateSourceRowV0_1): boolean {
  const citation = firstCitation(row);
  return (
    text(row.sourceNote).includes("Production registry promotion accepted v0.1") &&
    text(citation?.reviewNote).includes("Production source row promotion accepted v0.1")
  );
}

function sourceLabel(citation: ReturnType<typeof firstCitation>): string {
  const title = text(citation?.sourceTitle);
  const author = text(citation?.sourceAuthorOrEditor);
  const date = text(citation?.sourceDateOrVersion);
  const host = text(citation?.sourcePublisherOrHost);

  if (
    author.includes("Dedvukaj") &&
    author.includes("Ndoci") &&
    date.includes("2023") &&
    host.includes("Proceedings of the Linguistic Society of America")
  ) {
    return "Dedvukaj & Ndoci 2023 PLSA";
  }

  return [author, date, title].filter(Boolean).join(", ");
}

export function projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): ReviewedExternalLexiconRuntimeProjectionV0_1 | null {
  if (!hasAcceptedProductionPromotionMarker(row)) return null;
  if (row.sourceStatus !== "reviewed_accepted") return null;
  if (row.userDecisionPosture !== "user_decides") return null;
  if (row.originClaim !== false) return null;
  if (row.historicalTransmissionClaim !== false) return null;
  if (row.winnerClaim !== false) return null;
  if (row.languageSuperiorityClaim !== false) return null;

  const citation = firstCitation(row);
  if (!citation || citation.citationStatus !== "reviewed_accepted") return null;

  const label = sourceLabel(citation);
  const locator = text(citation.entryLocator);
  const sourceRef = text(citation.sourceUrlOrArchiveRef);
  const form = text(row.isolatedStandaloneForm);
  const gloss = text(row.plainStandaloneGloss);
  const attestedForm = text(citation.attestedForm) || form;
  const attestedGloss = text(citation.attestedGloss) || gloss;

  if (!label || !locator || !sourceRef || !form || !gloss) return null;

  return {
    projectionVersion: "reviewed-external-lexicon-runtime-projection.v0_1",
    sourceId: row.sourceId,
    candidateId: row.candidateId,
    embryo: row.embryo,
    isolatedStandaloneForm: form,
    evidenceText: `${label}, ${locator}: ${attestedForm} = ${attestedGloss}. ${sourceRef}`,
    claimBoundary: {
      historicalOriginClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    },
  };
}
