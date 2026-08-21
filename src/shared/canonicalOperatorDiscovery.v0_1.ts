import {
  canonicalOperatorProfilesV0_1,
  isCanonicalOperatorProfileDiscoveryTargetV0_1,
  resolveCanonicalOperatorProfileV0_1,
} from "./canonicalOperatorProfile.v0_1";
import {
  resolveCanonicalOperatorReviewedTargetFamilyV0_1,
} from "./canonicalOperatorReviewedTargetFamily.v0_1";
import { matchSegmentToProtoRoots } from "./carrierMatcher.v1";
import {
  evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1,
} from "./reviewedExternalLexiconEvidenceOperationPolicy.v0_1";
import { segmentBasis } from "./segmenter.v1";
import type { AllowedOpId } from "./ops/allowedOps.v0.1";

export const CANONICAL_OPERATOR_DISCOVERY_VERSION_V0_1 =
  "canonical-operator-discovery.v0_1" as const;

export type CanonicalOperatorFunctionalBridgeStatusV0_1 =
  | "reviewed"
  | "unreviewed";

export type CanonicalOperatorDiscoveryCandidateV0_1 = {
  discoveryVersion:
    typeof CANONICAL_OPERATOR_DISCOVERY_VERSION_V0_1;
  basis: string;
  operatorId: string;
  embryo: string;
  sourceId: string;
  language: string;
  segment: string;
  segmentStart: number;
  carrierForm: string;
  operations: readonly AllowedOpId[];
  functionalBridgeStatus:
    CanonicalOperatorFunctionalBridgeStatusV0_1;
  reviewedEvidenceEligible: boolean;
  discoveryAuthority:
    "canonical_profile_and_reviewed_operation_policy";
};

function normalizeTextV0_1(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US");
}

export function discoverCanonicalOperatorCandidatesV0_1(
  basis: string,
): readonly CanonicalOperatorDiscoveryCandidateV0_1[] {
  const normalizedBasis = normalizeTextV0_1(basis);

  if (!normalizedBasis) return [];

  const resolvedProfiles =
    canonicalOperatorProfilesV0_1.flatMap((profile) => {
      const resolved =
        resolveCanonicalOperatorProfileV0_1(profile);

      const reviewedTargetFamily =
        resolveCanonicalOperatorReviewedTargetFamilyV0_1(
          profile,
          normalizedBasis,
        );

      const discoveryTargetAllowed =
        isCanonicalOperatorProfileDiscoveryTargetV0_1(
          profile,
          normalizedBasis,
        );

      if (
        !resolved ||
        !resolved.readiness.functionalReady ||
        !resolved.authorization.authorized ||
        !resolved.productionMember ||
        !resolved.runtimeProjection ||
        (
          !discoveryTargetAllowed &&
          !reviewedTargetFamily
        )
      ) {
        return [];
      }

      return [
        {
          profile,
          resolved,
          reviewedTargetFamily,
        },
      ];
    });

  if (resolvedProfiles.length === 0) return [];

  const canonicalProfileByOperator = new Map<
    string,
    {
      profile:
        (typeof canonicalOperatorProfilesV0_1)[number];
      reviewedTargetFamily:
        ReturnType<
          typeof resolveCanonicalOperatorReviewedTargetFamilyV0_1
        >;
    }
  >();

  for (
    const {
      profile,
      reviewedTargetFamily,
    } of resolvedProfiles
  ) {
    canonicalProfileByOperator.set(
      profile.operatorId,
      {
        profile,
        reviewedTargetFamily,
      },
    );
  }

  const languageAllowList = Array.from(
    new Set(
      resolvedProfiles.map(
        ({ profile }) => profile.language,
      ),
    ),
  );

  const discoveries:
    CanonicalOperatorDiscoveryCandidateV0_1[] = [];

  const seen = new Set<string>();

  const segmentations = segmentBasis(normalizedBasis, {
    maxSegments: 5,
    maxCandidates: 200,
  });

  for (const segmentation of segmentations) {
    for (const segment of segmentation.segments) {
      const matches = matchSegmentToProtoRoots(segment, {
        allowSSh: true,
        langAllowList: languageAllowList,
      });

      for (const match of matches) {
        const canonicalProfile =
          canonicalProfileByOperator.get(
            match.protoRootId,
          );

        if (!canonicalProfile) continue;

        const {
          profile,
          reviewedTargetFamily,
        } = canonicalProfile;

        const carrierForm =
          normalizeTextV0_1(match.carrier?.form);

        const evaluation =
          evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
            {
              sourceId: profile.sourceId,
              embryo: profile.embryo,
              ops: match.ops,
              segment,
              carrierForm,
            },
          );

        if (
          !evaluation.allowed ||
          !evaluation.effectiveCarrierForm ||
          evaluation.effectiveOps.length === 0
        ) {
          continue;
        }

        const normalizedSegment =
          normalizeTextV0_1(segment);

        const segmentStart =
          normalizedBasis.indexOf(normalizedSegment);

        if (segmentStart < 0) continue;

        const reviewedEvidenceEligible =
          reviewedTargetFamily
            ?.reviewedFamilyEligible === true;

        const key = [
          profile.operatorId,
          normalizedSegment,
          evaluation.effectiveCarrierForm,
          evaluation.effectiveOps.join(","),
        ].join("\u0000");

        if (seen.has(key)) continue;
        seen.add(key);

        discoveries.push({
          discoveryVersion:
            CANONICAL_OPERATOR_DISCOVERY_VERSION_V0_1,
          basis: normalizedBasis,
          operatorId: profile.operatorId,
          embryo: profile.embryo,
          sourceId: profile.sourceId,
          language: profile.language,
          segment: normalizedSegment,
          segmentStart,
          carrierForm:
            evaluation.effectiveCarrierForm,
          operations: evaluation.effectiveOps,
          functionalBridgeStatus:
            reviewedEvidenceEligible
              ? "reviewed"
              : "unreviewed",
          reviewedEvidenceEligible,
          discoveryAuthority:
            "canonical_profile_and_reviewed_operation_policy",
        });
      }
    }
  }

  const profileOrder = new Map<string, number>();

  for (
    const [index, profile]
    of canonicalOperatorProfilesV0_1.entries()
  ) {
    profileOrder.set(
      profile.operatorId,
      index,
    );
  }

  return discoveries.sort((left, right) => {
    const operatorOrder =
      (profileOrder.get(left.operatorId) ?? 999) -
      (profileOrder.get(right.operatorId) ?? 999);

    if (operatorOrder !== 0) return operatorOrder;

    if (left.segment.length !== right.segment.length) {
      return (
        left.segment.length -
        right.segment.length
      );
    }

    if (left.segmentStart !== right.segmentStart) {
      return left.segmentStart - right.segmentStart;
    }

    return left.operations
      .join(",")
      .localeCompare(right.operations.join(","));
  });
}
