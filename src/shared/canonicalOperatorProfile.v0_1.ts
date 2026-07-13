import type { ReviewedExternalLexiconCandidateSourceRowV0_1 } from "./reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  buildReviewedExternalLexiconFunctionalReadinessV0_1,
  type ReviewedExternalLexiconFunctionalReadinessV0_1,
} from "./reviewedExternalLexiconFunctionalReadiness.v0_1";
import {
  evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1,
  type ReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1,
} from "./reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1";
import {
  projectReviewedExternalLexiconProductionRowForRuntimeV0_1,
  type ReviewedExternalLexiconRuntimeProjectionV0_1,
} from "./reviewedExternalLexiconRuntimeProjection.v0_1";
import {
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "./reviewedExternalLexiconSourceRowRegistry.v0_1";

export type CanonicalOperatorReviewedEvidenceStatusV0_1 =
  | "none"
  | "reviewed_functional";

export type CanonicalOperatorLifecycleStatusV0_1 =
  | "candidate"
  | "functionally_ready"
  | "machine_authorized"
  | "production_member"
  | "runtime_verified"
  | "canon_locked"
  | "deprecated";

export type CanonicalOperatorAuthorizationScopeV0_1 =
  "bounded_functional_lexical_projection";

export type CanonicalOperatorProfileV0_1 = {
  profileVersion: "canonical-operator-profile.v0_1";
  operatorId: string;
  embryo: string;
  language: string;
  sourceId: string;
  boundedLexicalFunction: string;
  reviewedEvidenceStatus: CanonicalOperatorReviewedEvidenceStatusV0_1;
  canonLifecycleStatus: CanonicalOperatorLifecycleStatusV0_1;
  authorizationScope: CanonicalOperatorAuthorizationScopeV0_1;
  positiveProofWords: readonly string[];
  negativeControlWords: readonly string[];
};

export type ResolvedCanonicalOperatorProfileV0_1 = {
  profile: CanonicalOperatorProfileV0_1;
  sourceRow: ReviewedExternalLexiconCandidateSourceRowV0_1;
  readiness: ReviewedExternalLexiconFunctionalReadinessV0_1;
  authorization: ReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1;
  productionMember: boolean;
  runtimeProjection: ReviewedExternalLexiconRuntimeProjectionV0_1 | null;
};

export const canonicalOperatorProfilesV0_1 = [
  {
    profileVersion: "canonical-operator-profile.v0_1",
    operatorId: "DA",
    embryo: "DA",
    language: "sq",
    sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
    boundedLexicalFunction: "split / divide functional motivation",
    reviewedEvidenceStatus: "reviewed_functional",
    canonLifecycleStatus: "canon_locked",
    authorizationScope: "bounded_functional_lexical_projection",
    positiveProofWords: ["da", "dam", "damage"],
    negativeControlWords: [
      "study",
      "xyz",
      "mode",
      "made",
      "dome",
      "di",
      "studim",
    ],
  },
  {
    profileVersion: "canonical-operator-profile.v0_1",
    operatorId: "DI",
    embryo: "DI",
    language: "sq",
    sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
    boundedLexicalFunction: "know / knowledge functional motivation",
    reviewedEvidenceStatus: "reviewed_functional",
    canonLifecycleStatus: "canon_locked",
    authorizationScope: "bounded_functional_lexical_projection",
    positiveProofWords: ["di", "study", "studim"],
    negativeControlWords: [
      "da",
      "dam",
      "damage",
      "mode",
      "xyz",
      "dij",
      "dije",
      "dit",
    ],
  },
] as const satisfies readonly CanonicalOperatorProfileV0_1[];

export function getCanonicalOperatorProfileV0_1(
  operatorId: string,
): CanonicalOperatorProfileV0_1 | null {
  const normalizedOperatorId = operatorId.trim().toLocaleUpperCase("en-US");

  return (
    canonicalOperatorProfilesV0_1.find(
      (profile) => profile.operatorId === normalizedOperatorId,
    ) ?? null
  );
}

export function resolveCanonicalOperatorProfileV0_1(
  profile: CanonicalOperatorProfileV0_1,
): ResolvedCanonicalOperatorProfileV0_1 | null {
  const sourceRow =
    reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
      (row) => row.sourceId === profile.sourceId,
    );

  if (!sourceRow) return null;

  const readiness =
    buildReviewedExternalLexiconFunctionalReadinessV0_1(sourceRow);

  const authorization =
    evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
      sourceRow,
    );

  const productionMember =
    isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
      sourceRow.sourceId,
    );

  const runtimeProjection =
    projectReviewedExternalLexiconProductionRowForRuntimeV0_1(sourceRow);

  return {
    profile,
    sourceRow,
    readiness,
    authorization,
    productionMember,
    runtimeProjection,
  };
}

export function getResolvedCanonicalOperatorProfilesV0_1(): readonly ResolvedCanonicalOperatorProfileV0_1[] {
  return canonicalOperatorProfilesV0_1.flatMap((profile) => {
    const resolved = resolveCanonicalOperatorProfileV0_1(profile);
    return resolved ? [resolved] : [];
  });
}
