import {
  validateTargetBoundCorrespondenceDecisionRuleV2,
  type TargetBoundCorrespondenceDecisionRuleV2,
  type TargetBoundCorrespondenceReviewV2,
} from "./targetBoundCorrespondenceDecisionRule.v2";
import type {
  TargetBoundCorrespondenceRationaleRelationshipV1,
  TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1,
  TargetBoundCorrespondenceReviewReasonCodeV1,
} from "./targetBoundCorrespondenceDecisionRule.v1";
import type {
  TargetBoundFunctionalCorrespondencePackageV1,
} from "./targetBoundFunctionalCorrespondence.v1";

export const TARGET_BOUND_REVIEWED_CORRESPONDENCE_EVIDENCE_PROJECTION_SCHEMA_V1 =
  "open-instrument.target-bound-reviewed-correspondence-evidence-projection.v1" as const;

export const TARGET_BOUND_REVIEWED_CORRESPONDENCE_EVIDENCE_KIND_V1 =
  "REVIEWED_TARGET_BOUND_CORRESPONDENCE_EVIDENCE" as const;

export type TargetBoundReviewedCorrespondenceEvidenceProjectionTargetScopeV1 =
  Readonly<{
    targetInputFingerprint: string;
    targetWord: string;
    targetSense: Readonly<{ id: string; label: string }> | null;
    structuralHypothesisId: string;
    embryo: string;
    voicePath: readonly string[];
    targetSenseBinding: TargetBoundCorrespondenceDecisionRuleV2["targetSenseBinding"];
  }>;

export type TargetBoundReviewedCorrespondenceEvidenceProjectionSourceScopeV1 =
  Readonly<{
    sourceAttestationId: string;
    sourceAttestationFingerprint: string;
    sourceReviewFingerprint: string;
    sourceEntryId: string;
    sourceSenseId: string;
    sourceSenseLocator: string;
    sourceSenseTextHash: string;
  }>;

export type TargetBoundReviewedCorrespondenceEvidenceProjectionComparisonScopeV1 =
  Readonly<{
    targetBoundPackageFingerprint: string;
    comparisonUnitId: string;
    comparisonUnitFingerprint: string;
  }>;

export type TargetBoundReviewedCorrespondenceEvidenceProjectionDecisionScopeV1 =
  Readonly<{
    reviewStatus: "REVIEWED";
    verdict: Exclude<TargetBoundCorrespondenceReviewV2["verdict"], null>;
    relationship: TargetBoundCorrespondenceRationaleRelationshipV1;
    rationale: Readonly<{
      text: string;
      limitations: readonly string[];
    }>;
    reasonCodes: readonly TargetBoundCorrespondenceReviewReasonCodeV1[];
    reviewer: string;
    reviewerKind: "HUMAN";
    reviewedAt: string;
    decisionFingerprint: string;
  }>;

export type TargetBoundReviewedCorrespondenceEvidenceProjectionAuthorityScopeV1 =
  Readonly<{
    claimBoundary: TargetBoundCorrespondenceDecisionRuleV2["claimBoundary"];
    functionalAcceptance: TargetBoundCorrespondenceDecisionRuleV2["functionalAcceptance"];
    historicalRelation: TargetBoundCorrespondenceDecisionRuleV2["historicalRelation"];
    winnerClaim: TargetBoundCorrespondenceDecisionRuleV2["winnerClaim"];
    productionMembership: TargetBoundCorrespondenceDecisionRuleV2["productionMembership"];
    runtimeAuthorization: TargetBoundCorrespondenceDecisionRuleV2["runtimeAuthorization"];
    userDecisionPosture: TargetBoundCorrespondenceDecisionRuleV2["userDecisionPosture"];
    noSingleWinner: TargetBoundCorrespondenceDecisionRuleV2["noSingleWinner"];
  }>;

export type TargetBoundReviewedCorrespondenceEvidenceProjectionV1 = Readonly<{
  schemaVersion: typeof TARGET_BOUND_REVIEWED_CORRESPONDENCE_EVIDENCE_PROJECTION_SCHEMA_V1;
  evidenceKind: typeof TARGET_BOUND_REVIEWED_CORRESPONDENCE_EVIDENCE_KIND_V1;
  target: TargetBoundReviewedCorrespondenceEvidenceProjectionTargetScopeV1;
  source: TargetBoundReviewedCorrespondenceEvidenceProjectionSourceScopeV1;
  comparison: TargetBoundReviewedCorrespondenceEvidenceProjectionComparisonScopeV1;
  decision: TargetBoundReviewedCorrespondenceEvidenceProjectionDecisionScopeV1;
  authority: TargetBoundReviewedCorrespondenceEvidenceProjectionAuthorityScopeV1;
}>;

export type TargetBoundReviewedCorrespondenceEvidenceProjectionInputV1 = Readonly<{
  decision: unknown;
  packageValue: unknown;
  attestationValue: unknown;
  sourceReviewValue: unknown;
}>;

export type TargetBoundReviewedCorrespondenceEvidenceProjectionReasonCodeV1 =
  | TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1
  | "DECISION_REVIEW_NOT_REVIEWED"
  | "DECISION_REVIEWER_NOT_HUMAN";

export type TargetBoundReviewedCorrespondenceEvidenceProjectionResultV1 = Readonly<
  | {
      ok: true;
      evidence: TargetBoundReviewedCorrespondenceEvidenceProjectionV1 | null;
    }
  | {
      ok: false;
      reasonCodes: readonly TargetBoundReviewedCorrespondenceEvidenceProjectionReasonCodeV1[];
    }
>;

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return Object.freeze(value);
}

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function reviewedDecisionV1(
  value: TargetBoundCorrespondenceDecisionRuleV2,
): value is TargetBoundCorrespondenceDecisionRuleV2 & {
  review: Extract<TargetBoundCorrespondenceReviewV2, { reviewStatus: "REVIEWED" }>;
} {
  return value.review.reviewStatus === "REVIEWED";
}

function projectDecisionV1(
  decision: TargetBoundCorrespondenceDecisionRuleV2,
  packageValue: TargetBoundFunctionalCorrespondencePackageV1,
): TargetBoundReviewedCorrespondenceEvidenceProjectionV1 {
  const review = decision.review as Extract<
    TargetBoundCorrespondenceReviewV2,
    { reviewStatus: "REVIEWED" }
  >;
  const targetInput = packageValue.targetInput;

  return deepFreezeV1({
    schemaVersion:
      TARGET_BOUND_REVIEWED_CORRESPONDENCE_EVIDENCE_PROJECTION_SCHEMA_V1,
    evidenceKind: TARGET_BOUND_REVIEWED_CORRESPONDENCE_EVIDENCE_KIND_V1,
    target: {
      targetInputFingerprint: packageValue.targetInputFingerprint,
      targetWord: targetInput.targetWord,
      targetSense: targetInput.targetSense
        ? {
            id: targetInput.targetSense.id,
            label: targetInput.targetSense.label,
          }
        : null,
      structuralHypothesisId: targetInput.structuralHypothesisId,
      embryo: targetInput.embryo,
      voicePath: [...targetInput.voicePath],
      targetSenseBinding: decision.targetSenseBinding,
    },
    source: {
      sourceAttestationId: decision.sourceAttestationId,
      sourceAttestationFingerprint: decision.sourceAttestationFingerprint,
      sourceReviewFingerprint: decision.sourceReviewFingerprint,
      sourceEntryId: decision.sourceEntryId,
      sourceSenseId: decision.sourceSenseId,
      sourceSenseLocator: decision.sourceSenseLocator,
      sourceSenseTextHash: decision.sourceSenseTextHash,
    },
    comparison: {
      targetBoundPackageFingerprint: decision.targetBoundPackageFingerprint,
      comparisonUnitId: decision.comparisonUnitId,
      comparisonUnitFingerprint: decision.comparisonUnitFingerprint,
    },
    decision: {
      reviewStatus: review.reviewStatus,
      verdict: review.verdict,
      relationship: review.rationale.relationship,
      rationale: {
        text: review.rationale.text,
        limitations: [...review.rationale.limitations],
      },
      reasonCodes: [...review.reasonCodes],
      reviewer: review.reviewer,
      reviewerKind: review.reviewerKind,
      reviewedAt: review.reviewedAt,
      decisionFingerprint: decision.decisionFingerprint,
    },
    authority: {
      claimBoundary: decision.claimBoundary,
      functionalAcceptance: decision.functionalAcceptance,
      historicalRelation: decision.historicalRelation,
      winnerClaim: decision.winnerClaim,
      productionMembership: decision.productionMembership,
      runtimeAuthorization: decision.runtimeAuthorization,
      userDecisionPosture: decision.userDecisionPosture,
      noSingleWinner: decision.noSingleWinner,
    },
  });
}

export function projectTargetBoundReviewedCorrespondenceEvidenceV1(
  input: unknown,
): TargetBoundReviewedCorrespondenceEvidenceProjectionResultV1 {
  if (!isRecordV1(input)) return { ok: false, reasonCodes: ["INPUT_NOT_OBJECT"] };
  if (input.decision === null) return { ok: true, evidence: null };

  const validation = validateTargetBoundCorrespondenceDecisionRuleV2(
    input.decision,
    input.packageValue,
    input.attestationValue,
    input.sourceReviewValue,
  );
  if (!validation.ok) {
    return { ok: false, reasonCodes: validation.reasonCodes };
  }

  const decision = validation.decision;
  if (!reviewedDecisionV1(decision)) {
    return { ok: false, reasonCodes: ["DECISION_REVIEW_NOT_REVIEWED"] };
  }
  if (decision.review.reviewerKind !== "HUMAN") {
    return { ok: false, reasonCodes: ["DECISION_REVIEWER_NOT_HUMAN"] };
  }

  const packageValue = input.packageValue as TargetBoundFunctionalCorrespondencePackageV1;
  return {
    ok: true,
    evidence: projectDecisionV1(decision, packageValue),
  };
}
