import type { FreeOperatorEvidenceCategoryV0_1 } from "./freeOperatorEvidence.v0_1";

export type FreeOperatorProfileTermSetV0_1 = {
  forms: readonly string[];
  glossTerms: readonly string[];
  categories: readonly FreeOperatorEvidenceCategoryV0_1[];
};

export type FreeOperatorProfileHomophoneCollisionV0_1 = {
  forms: readonly string[];
  glossTerms: readonly string[];
  categories: readonly FreeOperatorEvidenceCategoryV0_1[];
};

export type FreeOperatorProfileV0_1 = {
  profileVersion: "free-operator-profile.v0_1";
  operator: string;
  languageScope: readonly string[];
  directFreeOperator: FreeOperatorProfileTermSetV0_1;
  derivativeFamilySupport: FreeOperatorProfileTermSetV0_1;
  homophoneCollisions: readonly FreeOperatorProfileHomophoneCollisionV0_1[];
  requiresFunctionalBridgeFor: "functional_motivation_supported";
  historicalOriginClaim: "not_claimed";
  userDecisionPosture: "user_decides";
};

export const DA_FREE_OPERATOR_PROFILE_V0_1: FreeOperatorProfileV0_1 = {
  profileVersion: "free-operator-profile.v0_1",
  operator: "da",
  languageScope: ["Albanian", "Gheg Albanian", "Tosk Albanian"],
  directFreeOperator: {
    forms: ["da", "daj"],
    glossTerms: ["split", "divide", "separate", "separation", "cut", "share", "divided"],
    categories: ["free_operator_attested"],
  },
  derivativeFamilySupport: {
    forms: ["ndaj", "ndarë", "ndare"],
    glossTerms: ["split", "divide", "separate", "separation", "cut", "share", "divided"],
    categories: ["derivative_family_support"],
  },
  homophoneCollisions: [
    {
      forms: ["da"],
      glossTerms: ["give", "gave", "given"],
      categories: ["homophone_collision"],
    },
  ],
  requiresFunctionalBridgeFor: "functional_motivation_supported",
  historicalOriginClaim: "not_claimed",
  userDecisionPosture: "user_decides",
};

export const DI_FREE_OPERATOR_PROFILE_V0_1: FreeOperatorProfileV0_1 = {
  profileVersion: "free-operator-profile.v0_1",
  operator: "di",
  languageScope: ["Albanian", "Gheg Albanian", "Tosk Albanian"],
  directFreeOperator: {
    forms: ["di"],
    glossTerms: ["know", "knowledge", "understand", "insight", "learning", "study"],
    categories: ["free_operator_attested"],
  },
  derivativeFamilySupport: {
    forms: [],
    glossTerms: [],
    categories: [],
  },
  homophoneCollisions: [],
  requiresFunctionalBridgeFor: "functional_motivation_supported",
  historicalOriginClaim: "not_claimed",
  userDecisionPosture: "user_decides",
};

export const FREE_OPERATOR_PROFILES_V0_1 = [
  DA_FREE_OPERATOR_PROFILE_V0_1,
  DI_FREE_OPERATOR_PROFILE_V0_1,
] as const satisfies readonly FreeOperatorProfileV0_1[];

export function normalizeFreeOperatorProfileTextV0_1(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

function escapeRegExpV0_1(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function freeOperatorProfileFormMatchesV0_1(
  forms: readonly string[],
  form: string,
): boolean {
  const normalizedForm = normalizeFreeOperatorProfileTextV0_1(form);
  return forms.some((candidate) => normalizeFreeOperatorProfileTextV0_1(candidate) === normalizedForm);
}

export function freeOperatorProfileGlossMatchesV0_1(
  glossTerms: readonly string[],
  gloss: string,
): boolean {
  const normalizedGloss = normalizeFreeOperatorProfileTextV0_1(gloss);

  return glossTerms.some((term) => {
    const normalizedTerm = normalizeFreeOperatorProfileTextV0_1(term);
    return new RegExp(`\\b${escapeRegExpV0_1(normalizedTerm)}\\b`).test(normalizedGloss);
  });
}
