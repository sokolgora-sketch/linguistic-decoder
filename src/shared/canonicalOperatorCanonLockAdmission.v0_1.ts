import type {
  CanonicalOperatorAuthorizationScopeV0_1,
  ResolvedCanonicalOperatorProfileV0_1,
} from "./canonicalOperatorProfile.v0_1";

export type CanonicalOperatorCanonLockAdmissionReasonV0_1 =
  | "operator_not_explicitly_admitted"
  | "profile_not_runtime_mature"
  | "reviewed_functional_evidence_missing"
  | "functional_readiness_missing"
  | "machine_authorization_missing"
  | "authorization_scope_mismatch"
  | "production_membership_missing"
  | "runtime_projection_missing"
  | "source_identity_mismatch"
  | "embryo_identity_mismatch"
  | "positive_proof_words_missing"
  | "negative_control_words_missing"
  | "proof_word_overlap_present"
  | "historical_origin_boundary_violated"
  | "winner_boundary_violated"
  | "language_superiority_boundary_violated"
  | "user_decision_posture_missing";

export type CanonicalOperatorCanonLockAdmissionV0_1 = {
  admissionVersion: "canonical-operator-canon-lock-admission.v0_1";
  operatorId: string;
  sourceId: string;
  admitted: boolean;
  admittedScope: CanonicalOperatorAuthorizationScopeV0_1 | null;
  rollbackLifecycleStatus: "runtime_verified";
  reasons: CanonicalOperatorCanonLockAdmissionReasonV0_1[];
};

const CANON_LOCK_ADMITTED_OPERATOR_IDS_V0_1 =
  new Set<string>(["DA", "DI"]);

const RUNTIME_MATURE_LIFECYCLE_STATUSES_V0_1 =
  new Set<string>(["runtime_verified", "canon_locked"]);

export function evaluateCanonicalOperatorCanonLockAdmissionV0_1(
  resolved: ResolvedCanonicalOperatorProfileV0_1,
): CanonicalOperatorCanonLockAdmissionV0_1 {
  const {
    profile,
    sourceRow,
    readiness,
    authorization,
    productionMember,
    runtimeProjection,
  } = resolved;

  const reasons =
    new Set<CanonicalOperatorCanonLockAdmissionReasonV0_1>();

  if (!CANON_LOCK_ADMITTED_OPERATOR_IDS_V0_1.has(profile.operatorId)) {
    reasons.add("operator_not_explicitly_admitted");
  }

  if (
    !RUNTIME_MATURE_LIFECYCLE_STATUSES_V0_1.has(
      profile.canonLifecycleStatus,
    )
  ) {
    reasons.add("profile_not_runtime_mature");
  }

  if (profile.reviewedEvidenceStatus !== "reviewed_functional") {
    reasons.add("reviewed_functional_evidence_missing");
  }

  if (!readiness.functionalReady) {
    reasons.add("functional_readiness_missing");
  }

  if (!authorization.authorized) {
    reasons.add("machine_authorization_missing");
  }

  if (
    authorization.authorizationScope !== profile.authorizationScope
  ) {
    reasons.add("authorization_scope_mismatch");
  }

  if (!productionMember) {
    reasons.add("production_membership_missing");
  }

  if (!runtimeProjection) {
    reasons.add("runtime_projection_missing");
  }

  if (
    sourceRow.sourceId !== profile.sourceId ||
    runtimeProjection?.sourceId !== profile.sourceId
  ) {
    reasons.add("source_identity_mismatch");
  }

  if (
    sourceRow.embryo !== profile.embryo ||
    runtimeProjection?.embryo !== profile.embryo
  ) {
    reasons.add("embryo_identity_mismatch");
  }

  if (profile.positiveProofWords.length === 0) {
    reasons.add("positive_proof_words_missing");
  }

  if (profile.negativeControlWords.length === 0) {
    reasons.add("negative_control_words_missing");
  }

  if (
    profile.positiveProofWords.some((word) =>
      profile.negativeControlWords.includes(word)
    )
  ) {
    reasons.add("proof_word_overlap_present");
  }

  if (
    runtimeProjection?.claimBoundary.historicalOriginClaim !==
    "not_claimed"
  ) {
    reasons.add("historical_origin_boundary_violated");
  }

  if (
    runtimeProjection?.claimBoundary.winnerClaim !== "not_claimed"
  ) {
    reasons.add("winner_boundary_violated");
  }

  if (
    runtimeProjection?.claimBoundary.languageSuperiorityClaim !==
    "not_claimed"
  ) {
    reasons.add("language_superiority_boundary_violated");
  }

  if (
    runtimeProjection?.claimBoundary.userDecisionPosture !==
    "user_decides"
  ) {
    reasons.add("user_decision_posture_missing");
  }

  const sortedReasons = [...reasons].sort();

  return {
    admissionVersion:
      "canonical-operator-canon-lock-admission.v0_1",
    operatorId: profile.operatorId,
    sourceId: profile.sourceId,
    admitted: sortedReasons.length === 0,
    admittedScope:
      sortedReasons.length === 0
        ? profile.authorizationScope
        : null,
    rollbackLifecycleStatus: "runtime_verified",
    reasons: sortedReasons,
  };
}
