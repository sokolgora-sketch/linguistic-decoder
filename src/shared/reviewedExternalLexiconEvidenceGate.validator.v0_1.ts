export type ReviewedExternalLexiconCitationStatusV0_1 =
  | "missing"
  | "present_unreviewed"
  | "reviewed_accepted"
  | "reviewed_rejected"
  | "superseded";

export type ReviewedExternalLexiconCitationTypeV0_1 =
  | "dictionary_entry"
  | "grammar_entry"
  | "corpus_line"
  | "academic_lexical_reference"
  | "reviewed_scanned_source"
  | "reviewed_archive_copy"
  | "project_doc"
  | "project_fixture"
  | "project_snapshot"
  | "seed_row"
  | "model_output";

export type ReviewedExternalLexiconSourceStatusV0_1 =
  | "missing_source"
  | "draft_source"
  | "review_pending"
  | "reviewed_accepted"
  | "reviewed_rejected"
  | "superseded";

export type ReviewedExternalLexiconSourceKindV0_1 =
  | "reviewed_static_source"
  | "reviewed_dictionary_source"
  | "reviewed_lexical_source"
  | "reviewed_human_curation_source"
  | "reviewed_provider_capture_source"
  | "SEED"
  | "EXAMPLE"
  | "FIXTURE_ONLY"
  | "MODEL_OUTPUT_UNREVIEWED"
  | "SYMBOLIC_RESONANCE_ONLY"
  | "HISTORICAL_CONTEXT_ONLY";

export type ReviewedExternalLexiconCitationV0_1 = {
  citationId: string;
  citationStatus: ReviewedExternalLexiconCitationStatusV0_1;
  citationType: ReviewedExternalLexiconCitationTypeV0_1;
  sourceTitle: string | null;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string | null;
  sourceDateOrVersion: string | null;
  sourceUrlOrArchiveRef: string | null;
  entryLocator: string | null;
  attestedForm: string | null;
  attestedGloss: string | null;
  attestedGrammarNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  sourceHashOrArchiveHash: string | null;
};

export type ReviewedExternalLexiconCandidateSourceRowV0_1 = {
  sourceId: string;
  sourceKind: ReviewedExternalLexiconSourceKindV0_1;
  sourceStatus: ReviewedExternalLexiconSourceStatusV0_1;
  candidateId: string;
  displayForm: string;
  candidateLanguage: string;
  embryo: string;
  isolatedStandaloneForm: string | null;
  plainStandaloneGloss: string | null;
  sourceNote: string | null;
  semanticBridge: string | null;
  originClaim: false;
  historicalTransmissionClaim: false;
  winnerClaim: false;
  languageSuperiorityClaim: false;
  candidateTruthClaim: false;
  publicationEvidenceClaim: false;
  scientificEvidenceClaim: false;
  userDecisionPosture: "user_decides" | null;
  externalCitations: ReviewedExternalLexiconCitationV0_1[];
};

export type ReviewedExternalLexiconEvidenceGateEvaluationV0_1 = {
  eligible: boolean;
  validationOutcome: "source_validation_eligible" | "blocked";
  validationReasons: string[];
  originClaim: "not_claimed";
  userDecisionPosture: "user_decides" | null;
};

export const INTERNAL_REVIEWED_EXTERNAL_LEXICON_CITATION_TYPES_V0_1: ReadonlySet<ReviewedExternalLexiconCitationTypeV0_1> =
  new Set(["project_doc", "project_fixture", "project_snapshot", "seed_row", "model_output"]);

export const NON_VALIDATING_REVIEWED_EXTERNAL_LEXICON_SOURCE_KINDS_V0_1: ReadonlySet<ReviewedExternalLexiconSourceKindV0_1> =
  new Set([
    "SEED",
    "EXAMPLE",
    "FIXTURE_ONLY",
    "MODEL_OUTPUT_UNREVIEWED",
    "SYMBOLIC_RESONANCE_ONLY",
    "HISTORICAL_CONTEXT_ONLY",
  ]);

function normalizeReviewedExternalLexiconTextV0_1(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US");
}

function hasSplitDivideGlossV0_1(value: string | null | undefined): boolean {
  const text = normalizeReviewedExternalLexiconTextV0_1(value);
  return /\b(split|divide|separate|separation|cut|share|divided)\b/.test(text);
}

function hasKnowGlossV0_1(value: string | null | undefined): boolean {
  const text = normalizeReviewedExternalLexiconTextV0_1(value);
  return /\b(know|knowing|knowledge|i know)\b/.test(text);
}

function hasGiveGlossV0_1(value: string | null | undefined): boolean {
  const text = normalizeReviewedExternalLexiconTextV0_1(value);
  return /\b(give|gave|given)\b/.test(text);
}

export function evaluateReviewedExternalLexiconEvidenceGateV0_1(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): ReviewedExternalLexiconEvidenceGateEvaluationV0_1 {
  const reasons = new Set<string>();

  if (NON_VALIDATING_REVIEWED_EXTERNAL_LEXICON_SOURCE_KINDS_V0_1.has(row.sourceKind)) {
    if (row.sourceKind === "SEED") reasons.add("sourceKind_seed_not_validation");
    else if (row.sourceKind === "MODEL_OUTPUT_UNREVIEWED") reasons.add("externalCitation_model_output_only");
    else if (row.sourceKind === "SYMBOLIC_RESONANCE_ONLY") reasons.add("symbolic_resonance_not_validation");
    else if (row.sourceKind === "HISTORICAL_CONTEXT_ONLY") reasons.add("historical_context_not_validation");
    else reasons.add("sourceKind_not_validation");
  }

  if (row.sourceStatus !== "reviewed_accepted") {
    reasons.add("source_not_reviewed_accepted");
  }

  if (!row.isolatedStandaloneForm) reasons.add("missing_isolatedStandaloneForm");
  if (!row.plainStandaloneGloss) reasons.add("missing_plainStandaloneGloss");
  if (!row.sourceNote) reasons.add("missing_sourceNote");
  if (!row.semanticBridge) reasons.add("missing_semanticBridge");
  if (row.userDecisionPosture !== "user_decides") reasons.add("user_decision_posture_missing");

  if (row.externalCitations.length === 0) {
    reasons.add("missing_externalCitation");
  }

  const reviewedExternalCitations = row.externalCitations.filter((citation) => {
    if (citation.citationStatus !== "reviewed_accepted") {
      reasons.add("externalCitation_not_reviewed_accepted");
    }

    if (INTERNAL_REVIEWED_EXTERNAL_LEXICON_CITATION_TYPES_V0_1.has(citation.citationType)) {
      if (citation.citationType === "seed_row") reasons.add("externalCitation_seed_source_only");
      else if (citation.citationType === "project_fixture") reasons.add("externalCitation_example_fixture_only");
      else if (citation.citationType === "model_output") reasons.add("externalCitation_model_output_only");
      else reasons.add("externalCitation_internal_source_only");
    }

    if (!citation.entryLocator) reasons.add("externalCitation_missing_locator");
    if (!citation.attestedForm) reasons.add("externalCitation_missing_attestedForm");
    if (!citation.attestedGloss) reasons.add("externalCitation_missing_attestedGloss");

    return (
      citation.citationStatus === "reviewed_accepted" &&
      !INTERNAL_REVIEWED_EXTERNAL_LEXICON_CITATION_TYPES_V0_1.has(citation.citationType) &&
      Boolean(citation.entryLocator) &&
      Boolean(citation.attestedForm) &&
      Boolean(citation.attestedGloss)
    );
  });

  if (reviewedExternalCitations.length === 0) {
    reasons.add("externalCitation_not_reviewed_accepted");
  }

  if (row.candidateId === "albanian-da-dam-damage-functional") {
    const exactDaSplit = reviewedExternalCitations.some(
      (citation) =>
        normalizeReviewedExternalLexiconTextV0_1(citation.attestedForm) === "da" &&
        hasSplitDivideGlossV0_1(citation.attestedGloss),
    );

    const derivativeInsteadOfEmbryo = reviewedExternalCitations.some((citation) =>
      ["ndaj", "ndarë", "ndare"].includes(normalizeReviewedExternalLexiconTextV0_1(citation.attestedForm)),
    );

    const gaveCollision = reviewedExternalCitations.some(
      (citation) =>
        normalizeReviewedExternalLexiconTextV0_1(citation.attestedForm) === "da" &&
        hasGiveGlossV0_1(citation.attestedGloss),
    );

    if (derivativeInsteadOfEmbryo) reasons.add("externalCitation_derivative_not_embryo");
    if (gaveCollision) reasons.add("externalCitation_homophone_collision");
    if (gaveCollision) reasons.add("externalCitation_gloss_mismatch");

    if (!exactDaSplit) {
      reasons.add("da_quarantine_missing_reviewed_exact_external_citation");
    }
  }

  if (row.candidateId === "albanian-shtu-di-study-functional") {
    const exactDiKnow = reviewedExternalCitations.some(
      (citation) =>
        normalizeReviewedExternalLexiconTextV0_1(citation.attestedForm) === "di" &&
        hasKnowGlossV0_1(citation.attestedGloss),
    );

    if (!exactDiKnow) {
      reasons.add("di_missing_reviewed_external_citation");
    }

    if (!row.semanticBridge) {
      reasons.add("di_composition_bridge_missing");
    }
  }

  const validationReasons = [...reasons].sort();
  const eligible = validationReasons.length === 0;

  return {
    eligible,
    validationOutcome: eligible ? "source_validation_eligible" : "blocked",
    validationReasons,
    originClaim: "not_claimed",
    userDecisionPosture: row.userDecisionPosture,
  };
}
