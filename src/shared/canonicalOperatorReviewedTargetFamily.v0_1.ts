import type {
  CanonicalOperatorProfileV0_1,
} from "./canonicalOperatorProfile.v0_1";

export const CANONICAL_OPERATOR_REVIEWED_TARGET_FAMILY_VERSION_V0_1 =
  "canonical-operator-reviewed-target-family.v0_1" as const;

export type CanonicalOperatorReviewedTargetFamilyRuleIdV0_1 =
  | "exact"
  | "plural_s"
  | "plural_y_to_ies"
  | "past_terminal_e_plus_d"
  | "past_y_to_ied"
  | "gerund_plus_ing"
  | "gerund_drop_terminal_e"
  | "derivational_hood"
  | "derivational_ly";

export type CanonicalOperatorReviewedTargetFamilyTransformRuleIdV0_1 =
  Exclude<
    CanonicalOperatorReviewedTargetFamilyRuleIdV0_1,
    "exact"
  >;

export type CanonicalOperatorReviewedTargetFamilyMatchKindV0_1 =
  | "exact"
  | "reviewed_target_family";

export type CanonicalOperatorReviewedTargetFamilyOperatorIdV0_1 =
  | "DA"
  | "DI"
  | "AT";

export type CanonicalOperatorReviewedTargetFamilyPolicyV0_1 = {
  operatorId:
    CanonicalOperatorReviewedTargetFamilyOperatorIdV0_1;
  proofWord: string;
  allowedRules:
    readonly CanonicalOperatorReviewedTargetFamilyTransformRuleIdV0_1[];
};

export type CanonicalOperatorReviewedTargetFamilyMatchV0_1 = {
  bridgeVersion:
    typeof CANONICAL_OPERATOR_REVIEWED_TARGET_FAMILY_VERSION_V0_1;
  operatorId: string;
  normalizedInput: string;
  matchedProofWord: string;
  matchKind:
    CanonicalOperatorReviewedTargetFamilyMatchKindV0_1;
  ruleId:
    CanonicalOperatorReviewedTargetFamilyRuleIdV0_1;
  reviewedFamilyEligible: true;
};

/**
 * Reviewed target-family authority is explicit and fail-closed.
 *
 * The policy begins from an already reviewed canonical positive proof word.
 * A transformation is authorized only when both the proof-word anchor and
 * transformation ID are declared here.
 *
 * This is intentionally not a generic English stemmer/suffix engine.
 * Structural discovery may remain broader, but undeclared target-family
 * forms cannot inherit reviewed canonical evidence.
 */
export const canonicalOperatorReviewedTargetFamilyPoliciesV0_1 = [
  {
    operatorId: "DI",
    proofWord: "study",
    allowedRules: [
      "plural_y_to_ies",
      "past_y_to_ied",
      "gerund_plus_ing",
    ],
  },
  {
    operatorId: "DA",
    proofWord: "damage",
    allowedRules: [
      "plural_s",
      "past_terminal_e_plus_d",
      "gerund_drop_terminal_e",
    ],
  },
  {
    operatorId: "AT",
    proofWord: "father",
    allowedRules: [
      "plural_s",
      "derivational_hood",
      "derivational_ly",
    ],
  },
] as const satisfies readonly CanonicalOperatorReviewedTargetFamilyPolicyV0_1[];

function normalizeWordV0_1(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US");
}

function isPlainAlphabeticWordV0_1(
  value: string,
): boolean {
  return /^[a-z]+$/.test(value);
}

function terminalYHasConsonantBeforeV0_1(
  proofWord: string,
): boolean {
  if (
    proofWord.length < 2 ||
    !proofWord.endsWith("y")
  ) {
    return false;
  }

  const previous =
    proofWord[
      proofWord.length - 2
    ];

  return ![
    "a",
    "e",
    "i",
    "o",
    "u",
    "y",
  ].includes(previous);
}

function matchesDeclaredRuleV0_1(
  ruleId:
    CanonicalOperatorReviewedTargetFamilyTransformRuleIdV0_1,
  proofWord: string,
  input: string,
): boolean {
  switch (ruleId) {
    case "plural_s":
      return (
        input ===
        `${proofWord}s`
      );

    case "plural_y_to_ies":
      return (
        terminalYHasConsonantBeforeV0_1(
          proofWord,
        ) &&
        input ===
          `${proofWord.slice(0, -1)}ies`
      );

    case "past_terminal_e_plus_d":
      return (
        proofWord.endsWith("e") &&
        input ===
          `${proofWord}d`
      );

    case "past_y_to_ied":
      return (
        terminalYHasConsonantBeforeV0_1(
          proofWord,
        ) &&
        input ===
          `${proofWord.slice(0, -1)}ied`
      );

    case "gerund_plus_ing":
      return (
        input ===
        `${proofWord}ing`
      );

    case "gerund_drop_terminal_e":
      return (
        proofWord.endsWith("e") &&
        input ===
          `${proofWord.slice(0, -1)}ing`
      );

    case "derivational_hood":
      return (
        input ===
        `${proofWord}hood`
      );

    case "derivational_ly":
      return (
        input ===
        `${proofWord}ly`
      );
  }
}

function buildMatchV0_1(
  profile:
    CanonicalOperatorProfileV0_1,
  normalizedInput: string,
  proofWord: string,
  ruleId:
    CanonicalOperatorReviewedTargetFamilyRuleIdV0_1,
): CanonicalOperatorReviewedTargetFamilyMatchV0_1 {
  return {
    bridgeVersion:
      CANONICAL_OPERATOR_REVIEWED_TARGET_FAMILY_VERSION_V0_1,
    operatorId:
      profile.operatorId,
    normalizedInput,
    matchedProofWord:
      proofWord,
    matchKind:
      ruleId === "exact"
        ? "exact"
        : "reviewed_target_family",
    ruleId,
    reviewedFamilyEligible:
      true,
  };
}

export function resolveCanonicalOperatorReviewedTargetFamilyV0_1(
  profile:
    CanonicalOperatorProfileV0_1,
  input: unknown,
): CanonicalOperatorReviewedTargetFamilyMatchV0_1 | null {
  const normalizedInput =
    normalizeWordV0_1(
      input,
    );

  if (
    !normalizedInput ||
    !isPlainAlphabeticWordV0_1(
      normalizedInput,
    )
  ) {
    return null;
  }

  const reviewedProofWords =
    profile.positiveProofWords
      .map(
        normalizeWordV0_1,
      )
      .filter(
        (proofWord) =>
          proofWord.length > 0 &&
          isPlainAlphabeticWordV0_1(
            proofWord,
          ),
      );

  /*
   * Exact reviewed positive proof words retain their existing authority.
   * No family policy is required for exact identity.
   */
  if (
    reviewedProofWords.includes(
      normalizedInput,
    )
  ) {
    return buildMatchV0_1(
      profile,
      normalizedInput,
      normalizedInput,
      "exact",
    );
  }

  /*
   * Non-exact family reuse requires an explicit operator + reviewed
   * proof-word anchor + declared transformation.
   */
  for (
    const policy
    of canonicalOperatorReviewedTargetFamilyPoliciesV0_1
  ) {
    if (
      policy.operatorId !==
      profile.operatorId
    ) {
      continue;
    }

    const proofWord =
      normalizeWordV0_1(
        policy.proofWord,
      );

    if (
      !reviewedProofWords.includes(
        proofWord,
      )
    ) {
      continue;
    }

    for (
      const ruleId
      of policy.allowedRules
    ) {
      if (
        !matchesDeclaredRuleV0_1(
          ruleId,
          proofWord,
          normalizedInput,
        )
      ) {
        continue;
      }

      return buildMatchV0_1(
        profile,
        normalizedInput,
        proofWord,
        ruleId,
      );
    }
  }

  return null;
}
