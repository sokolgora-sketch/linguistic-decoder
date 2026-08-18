import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
} from "./reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  buildReviewedExternalLexiconFunctionalReadinessV0_1,
  type ReviewedExternalLexiconFunctionalReadinessV0_1,
} from "./reviewedExternalLexiconFunctionalReadiness.v0_1";

export type ReviewedExternalLexiconFunctionalRuntimeAuthorizationReasonV0_1 =
  | "source_id_not_authorized"
  | "functional_readiness_failed"
  | "source_not_reviewed_accepted"
  | "historical_origin_claim_present"
  | "historical_transmission_claim_present"
  | "winner_claim_present"
  | "language_superiority_claim_present"
  | "candidate_truth_claim_present"
  | "publication_evidence_claim_present"
  | "scientific_evidence_claim_present"
  | "user_decision_posture_missing";

export type ReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1 = {
  authorizationVersion:
    "reviewed-external-lexicon-functional-runtime-authorization.v0_1";
  sourceId: string;
  candidateId: string;
  authorized: boolean;
  authorizationScope: "bounded_functional_lexical_projection";
  historicalOriginClaim: "not_claimed";
  userDecisionPosture: "user_decides" | null;
  readiness: ReviewedExternalLexiconFunctionalReadinessV0_1;
  reasons: ReviewedExternalLexiconFunctionalRuntimeAuthorizationReasonV0_1[];
};

const FUNCTIONAL_RUNTIME_AUTHORIZED_SOURCE_IDS_V0_1 =
  new Set<string>([
    "reviewed.external.di.knowledge.candidate.v0_1",
    "reviewed.external.gheg-da.damage.candidate.v0_1",
    "reviewed.external.albanian-at.father.candidate.v0_1",
  ]);

export function isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
  sourceId: string,
): boolean {
  return FUNCTIONAL_RUNTIME_AUTHORIZED_SOURCE_IDS_V0_1.has(sourceId);
}

export function evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
  row: ReviewedExternalLexiconCandidateSourceRowV0_1,
): ReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1 {
  const reasons =
    new Set<ReviewedExternalLexiconFunctionalRuntimeAuthorizationReasonV0_1>();

  const readiness =
    buildReviewedExternalLexiconFunctionalReadinessV0_1(row);

  if (
    !isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
      row.sourceId,
    )
  ) {
    reasons.add("source_id_not_authorized");
  }

  if (!readiness.functionalReady) {
    reasons.add("functional_readiness_failed");
  }

  if (row.sourceStatus !== "reviewed_accepted") {
    reasons.add("source_not_reviewed_accepted");
  }

  if (row.originClaim !== false) {
    reasons.add("historical_origin_claim_present");
  }

  if (row.historicalTransmissionClaim !== false) {
    reasons.add("historical_transmission_claim_present");
  }

  if (row.winnerClaim !== false) {
    reasons.add("winner_claim_present");
  }

  if (row.languageSuperiorityClaim !== false) {
    reasons.add("language_superiority_claim_present");
  }

  if (row.candidateTruthClaim !== false) {
    reasons.add("candidate_truth_claim_present");
  }

  if (row.publicationEvidenceClaim !== false) {
    reasons.add("publication_evidence_claim_present");
  }

  if (row.scientificEvidenceClaim !== false) {
    reasons.add("scientific_evidence_claim_present");
  }

  if (row.userDecisionPosture !== "user_decides") {
    reasons.add("user_decision_posture_missing");
  }

  const sortedReasons = [...reasons].sort();

  return {
    authorizationVersion:
      "reviewed-external-lexicon-functional-runtime-authorization.v0_1",
    sourceId: row.sourceId,
    candidateId: row.candidateId,
    authorized: sortedReasons.length === 0,
    authorizationScope: "bounded_functional_lexical_projection",
    historicalOriginClaim: "not_claimed",
    userDecisionPosture: row.userDecisionPosture,
    readiness,
    reasons: sortedReasons,
  };
}
