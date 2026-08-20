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

export type CanonicalOperatorDiscoveryScopeV0_1 =
  | "broad_structural"
  | "bounded_targets";

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
  discoveryScope: CanonicalOperatorDiscoveryScopeV0_1;
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
    discoveryScope: "broad_structural",
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
    discoveryScope: "broad_structural",
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
  {
    profileVersion: "canonical-operator-profile.v0_1",
    operatorId: "AT",
    embryo: "AT",
    language: "sq",
    sourceId: "reviewed.external.albanian-at.father.candidate.v0_1",
    boundedLexicalFunction: "father functional motivation",
    reviewedEvidenceStatus: "reviewed_functional",
    canonLifecycleStatus: "canon_locked",
    authorizationScope: "bounded_functional_lexical_projection",
    discoveryScope: "bounded_targets",
    positiveProofWords: ["father"],
    negativeControlWords: [
      "at",
      "damage",
      "study",
      "mode",
      "xyz",
      "da",
      "di",
      "studim",
    ],
  },
] as const satisfies readonly CanonicalOperatorProfileV0_1[];

function normalizeCanonicalOperatorDiscoveryWordV0_1(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US");
}

export function isCanonicalOperatorProfileDiscoveryTargetV0_1(
  profile: CanonicalOperatorProfileV0_1,
  basis: unknown,
): boolean {
  const normalizedBasis =
    normalizeCanonicalOperatorDiscoveryWordV0_1(
      basis,
    );

  if (!normalizedBasis) {
    return false;
  }

  if (
    profile.canonLifecycleStatus !== "runtime_verified" &&
    profile.canonLifecycleStatus !== "canon_locked"
  ) {
    return false;
  }

  if (profile.discoveryScope === "broad_structural") {
    return true;
  }

  const boundedTargets =
    new Set(
      [
        ...profile.positiveProofWords,
        ...profile.negativeControlWords,
      ].map(
        normalizeCanonicalOperatorDiscoveryWordV0_1,
      ),
    );

  return boundedTargets.has(
    normalizedBasis,
  );
}

/**
 * Structural DeepRoot discovery is broader than reviewed canonical evidence.
 *
 * Discovery breadth is profile metadata, not a canon-lifecycle side effect.
 *
 * Broad-structural profiles retain generic structural discovery.
 *
 * Bounded-target profiles keep the reviewed isolated carrier target-bounded
 * across runtime-mature lifecycle states. Pre-existing carriers remain
 * available to generic structural DeepRoot discovery, but they do not gain
 * reviewed functional evidence unless canonical discovery separately
 * authorizes the whole-word target.
 */
export function isCanonicalOperatorProfileStructuralCarrierAllowedV0_1(
  profile: CanonicalOperatorProfileV0_1,
  basis: unknown,
  carrierForm: unknown,
): boolean {
  if (
    isCanonicalOperatorProfileDiscoveryTargetV0_1(
      profile,
      basis,
    )
  ) {
    return true;
  }

  if (
    profile.discoveryScope !== "bounded_targets" ||
    (
      profile.canonLifecycleStatus !== "runtime_verified" &&
      profile.canonLifecycleStatus !== "canon_locked"
    )
  ) {
    return false;
  }

  const resolved =
    resolveCanonicalOperatorProfileV0_1(
      profile,
    );

  if (!resolved) {
    return false;
  }

  const reviewedIsolatedCarrier =
    normalizeCanonicalOperatorDiscoveryWordV0_1(
      resolved
        .sourceRow
        .isolatedStandaloneForm,
    );

  const normalizedCarrier =
    normalizeCanonicalOperatorDiscoveryWordV0_1(
      carrierForm,
    );

  if (
    !reviewedIsolatedCarrier ||
    !normalizedCarrier
  ) {
    return false;
  }

  return (
    normalizedCarrier !==
    reviewedIsolatedCarrier
  );
}

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
