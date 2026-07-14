import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
} from "../../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";

export const JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1 =
  "reviewed.external.jo.refusal.candidate.v0_1";

export const JO_SOURCE_ROW_DESIGN_CITATION_ID_V0_1 =
  "reviewed.external.jo.refusal.candidate.citation.v0_1";

export const JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1 =
  "f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e";

export const JO_SOURCE_ROW_DESIGN_LOCATOR_V0_1 =
  "https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=25210";

export const proposedJoSourceRowDesignV0_1 = {
  sourceId:
    JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
  candidateId:
    "albanian-jo-standalone-refusal-functional",
  candidateLanguage:
    "sq",
  displayForm:
    "JO standalone refusal candidate",
  sourceKind:
    "reviewed_dictionary_source",
  sourceStatus:
    "reviewed_accepted",
  embryo:
    "JO",
  isolatedStandaloneForm:
    "jo",
  plainStandaloneGloss:
    "standalone refusal / explicit rejection",
  sourceNote:
    "DESIGN-ONLY proposed JO source-row package for bounded standalone refusal or explicit rejection. It is not registered for production, runtime authorization, projection, canonical profiling or canon-lock admission. Historical origin, transmission, winner, language-superiority, publication-evidence, scientific-evidence, candidate-truth and general-negation ownership claims remain disabled; the user decides.",
  semanticBridge:
    "standalone refusal or explicit rejection can functionally motivate a direct negative response without claiming historical origin, unrestricted negative polarity or ownership of general grammatical negation",
  originClaim:
    false,
  historicalTransmissionClaim:
    false,
  winnerClaim:
    false,
  languageSuperiorityClaim:
    false,
  candidateTruthClaim:
    false,
  publicationEvidenceClaim:
    false,
  scientificEvidenceClaim:
    false,
  userDecisionPosture:
    "user_decides",
  externalCitations: [
    {
      citationId:
        JO_SOURCE_ROW_DESIGN_CITATION_ID_V0_1,
      citationStatus:
        "reviewed_accepted",
      citationType:
        "dictionary_entry",
      sourceTitle:
        "JO part.",
      sourceAuthorOrEditor:
        "Bardhyl Demiraj; Olav Hackstein",
      sourcePublisherOrHost:
        "Digitales Philologisch-Etymologisches Wörterbuch des Altalbanischen / Ludwig-Maximilians-Universität München",
      sourceDateOrVersion:
        "first publication 2024; source snapshot reviewed 2026-07-14",
      sourceUrlOrArchiveRef:
        JO_SOURCE_ROW_DESIGN_LOCATOR_V0_1,
      entryLocator:
        "DPEWA post ID 25210; exact article head JO part.; dictionary lemmaid=25210",
      attestedForm:
        "jo",
      attestedGloss:
        "no / not; bounded here to standalone refusal or explicit rejection",
      attestedGrammarNote:
        "Exact attested Albanian particle article JO part.; classification Simplex. The article includes broader grammatical-negation uses, but the proposed v0.1 functional scope excludes general sentence-level negation, prefix behavior, suffix behavior, substring projection and transformed carriers.",
      reviewedBy:
        "open-instrument-source-row-design-review",
      reviewedAt:
        "2026-07-14",
      sourceHashOrArchiveHash:
        JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1,
      reviewNote:
        "Candidate-specific DPEWA evidence reviewed for a design-only JO package. Exact article identity, post ID, stable locator, authors, publication year, modern dictionary reference FGJSSH 745f. and source snapshot hash are preserved. Historical attestations remain contextual only. This package is not a production registration or runtime authorization.",
    },
  ],
} as const satisfies ReviewedExternalLexiconCandidateSourceRowV0_1;

export const proposedJoSourceRowDesignPolicyV0_1 = {
  packageStatus:
    "design_only",
  productionRegistryStatus:
    "not_registered",
  functionalRuntimeAuthorization:
    "not_authorized",
  productionMembership:
    "not_admitted",
  runtimeProjection:
    "not_projected",
  canonicalProfile:
    "not_registered",
  operationPolicy:
    "not_registered",
  carrierPolicy:
    "not_registered",
  liveSmoke:
    "not_registered",
  canonLockAdmission:
    "not_admitted",
  boundedFunctionalScope:
    "standalone_refusal_or_explicit_rejection",
  excludedFunctionalScopes: [
    "general_sentence_level_negation",
    "unrestricted_negative_polarity",
    "symbolic_po_jo_opposition",
    "prefix_behavior",
    "suffix_behavior",
    "substring_projection",
  ],
  proposedEvidenceOperations: [
    "exact",
  ],
  proposedEvidenceCarrierForms: [
    "jo",
  ],
  proposedPositiveProofWords: [
    "jo",
  ],
  crossOperatorNegativeControls: [
    "po",
    "da",
    "di",
  ],
  collisionNegativeControls: [
    "major",
    "enjoy",
    "joke",
    "joint",
    "banjo",
    "judo",
  ],
  sourceIdentityRequirements: {
    articleHead:
      "JO part.",
    postId:
      "25210",
    locator:
      JO_SOURCE_ROW_DESIGN_LOCATOR_V0_1,
    sourceHash:
      JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1,
    reconstructed:
      false,
  },
  claimBoundary: {
    historicalOrigin:
      "not_claimed",
    historicalTransmission:
      "not_claimed",
    borrowingDirection:
      "not_claimed",
    linguisticOwnership:
      "not_claimed",
    winnerStatus:
      "not_claimed",
    languageSuperiority:
      "not_claimed",
    candidateTruth:
      "not_claimed",
    scientificProof:
      "not_claimed",
    publicationGradeOpenInstrumentProof:
      "not_claimed",
    generalNegationOwnership:
      "not_claimed",
    userDecisionPosture:
      "user_decides",
  },
} as const;

export type JoSourceRowDesignValidationReasonV0_1 =
  | "source_id_mismatch"
  | "candidate_id_mismatch"
  | "embryo_mismatch"
  | "isolated_form_mismatch"
  | "bounded_gloss_mismatch"
  | "source_not_reviewed_accepted"
  | "citation_missing"
  | "citation_id_mismatch"
  | "citation_not_reviewed_accepted"
  | "article_head_mismatch"
  | "post_id_or_locator_mismatch"
  | "attested_form_mismatch"
  | "bounded_attested_gloss_mismatch"
  | "source_hash_mismatch"
  | "review_identity_missing"
  | "review_date_mismatch"
  | "historical_origin_claim_present"
  | "historical_transmission_claim_present"
  | "winner_claim_present"
  | "language_superiority_claim_present"
  | "candidate_truth_claim_present"
  | "publication_evidence_claim_present"
  | "scientific_evidence_claim_present"
  | "user_decision_posture_mismatch";

export function validateProposedJoSourceRowDesignV0_1(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): {
  valid: boolean;
  reasons: JoSourceRowDesignValidationReasonV0_1[];
} {
  const reasons =
    new Set<JoSourceRowDesignValidationReasonV0_1>();

  if (
    row.sourceId !==
    JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1
  ) {
    reasons.add("source_id_mismatch");
  }

  if (
    row.candidateId !==
    "albanian-jo-standalone-refusal-functional"
  ) {
    reasons.add("candidate_id_mismatch");
  }

  if (row.embryo !== "JO") {
    reasons.add("embryo_mismatch");
  }

  if (row.isolatedStandaloneForm !== "jo") {
    reasons.add("isolated_form_mismatch");
  }

  if (
    row.plainStandaloneGloss !==
    "standalone refusal / explicit rejection"
  ) {
    reasons.add("bounded_gloss_mismatch");
  }

  if (row.sourceStatus !== "reviewed_accepted") {
    reasons.add("source_not_reviewed_accepted");
  }

  const citation = row.externalCitations[0];

  if (!citation) {
    reasons.add("citation_missing");
  } else {
    if (
      citation.citationId !==
      JO_SOURCE_ROW_DESIGN_CITATION_ID_V0_1
    ) {
      reasons.add("citation_id_mismatch");
    }

    if (
      citation.citationStatus !==
      "reviewed_accepted"
    ) {
      reasons.add(
        "citation_not_reviewed_accepted",
      );
    }

    if (citation.sourceTitle !== "JO part.") {
      reasons.add("article_head_mismatch");
    }

    const entryLocator =
      citation.entryLocator ?? "";

    if (
      citation.sourceUrlOrArchiveRef !==
        JO_SOURCE_ROW_DESIGN_LOCATOR_V0_1 ||
      !entryLocator.includes(
        "post ID 25210",
      ) ||
      !entryLocator.includes(
        "JO part.",
      )
    ) {
      reasons.add(
        "post_id_or_locator_mismatch",
      );
    }

    if (citation.attestedForm !== "jo") {
      reasons.add("attested_form_mismatch");
    }

    const attestedGloss =
      citation.attestedGloss ?? "";

    if (
      !attestedGloss.includes(
        "standalone refusal",
      ) ||
      !attestedGloss.includes(
        "explicit rejection",
      )
    ) {
      reasons.add(
        "bounded_attested_gloss_mismatch",
      );
    }

    if (
      citation.sourceHashOrArchiveHash !==
      JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1
    ) {
      reasons.add("source_hash_mismatch");
    }

    const reviewedBy =
      citation.reviewedBy ?? "";

    if (!reviewedBy.trim()) {
      reasons.add("review_identity_missing");
    }

    if (citation.reviewedAt !== "2026-07-14") {
      reasons.add("review_date_mismatch");
    }
  }

  if (row.originClaim !== false) {
    reasons.add(
      "historical_origin_claim_present",
    );
  }

  if (
    row.historicalTransmissionClaim !== false
  ) {
    reasons.add(
      "historical_transmission_claim_present",
    );
  }

  if (row.winnerClaim !== false) {
    reasons.add("winner_claim_present");
  }

  if (
    row.languageSuperiorityClaim !== false
  ) {
    reasons.add(
      "language_superiority_claim_present",
    );
  }

  if (row.candidateTruthClaim !== false) {
    reasons.add(
      "candidate_truth_claim_present",
    );
  }

  if (
    row.publicationEvidenceClaim !== false
  ) {
    reasons.add(
      "publication_evidence_claim_present",
    );
  }

  if (
    row.scientificEvidenceClaim !== false
  ) {
    reasons.add(
      "scientific_evidence_claim_present",
    );
  }

  if (
    row.userDecisionPosture !==
    "user_decides"
  ) {
    reasons.add(
      "user_decision_posture_mismatch",
    );
  }

  return {
    valid: reasons.size === 0,
    reasons: [...reasons],
  };
}
