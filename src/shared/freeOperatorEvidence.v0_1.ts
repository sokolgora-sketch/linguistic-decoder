import {
  FREE_OPERATOR_PROFILES_V0_1,
  freeOperatorProfileFormMatchesV0_1,
  freeOperatorProfileGlossMatchesV0_1,
  normalizeFreeOperatorProfileTextV0_1,
} from "./freeOperatorProfile.v0_1";

export type FreeOperatorEvidenceCategoryV0_1 =
  | "free_operator_attested"
  | "functional_motivation_supported"
  | "derivative_family_support"
  | "homophone_collision"
  | "historical_origin_not_claimed"
  | "user_decides";

export type FreeOperatorEvidenceInputV0_1 = {
  operator: string;
  attestedForm: string;
  attestedGloss: string;
  dialect?: string | null;
  functionalBridge?: string | null;
};

export type FreeOperatorEvidenceClassificationV0_1 = {
  operator: string;
  attestedForm: string;
  categories: FreeOperatorEvidenceCategoryV0_1[];
  historicalOriginClaim: "not_claimed";
  userDecisionPosture: "user_decides";
};

function hasFunctionalBridgeV0_1(value: string | null | undefined): boolean {
  return Boolean(value && value.trim());
}

function findFreeOperatorProfileV0_1(operator: string) {
  const normalizedOperator = normalizeFreeOperatorProfileTextV0_1(operator);

  return FREE_OPERATOR_PROFILES_V0_1.find(
    (profile) => normalizeFreeOperatorProfileTextV0_1(profile.operator) === normalizedOperator,
  );
}

function addMatchingTermSetCategoriesV0_1(
  categories: Set<FreeOperatorEvidenceCategoryV0_1>,
  termSet: {
    forms: readonly string[];
    glossTerms: readonly string[];
    categories: readonly FreeOperatorEvidenceCategoryV0_1[];
  },
  form: string,
  gloss: string,
): void {
  if (
    freeOperatorProfileFormMatchesV0_1(termSet.forms, form) &&
    freeOperatorProfileGlossMatchesV0_1(termSet.glossTerms, gloss)
  ) {
    for (const category of termSet.categories) categories.add(category);
  }
}

export function classifyFreeOperatorEvidenceV0_1(
  input: FreeOperatorEvidenceInputV0_1,
): FreeOperatorEvidenceClassificationV0_1 {
  const operator = normalizeFreeOperatorProfileTextV0_1(input.operator);
  const form = normalizeFreeOperatorProfileTextV0_1(input.attestedForm);
  const gloss = normalizeFreeOperatorProfileTextV0_1(input.attestedGloss);

  const categories = new Set<FreeOperatorEvidenceCategoryV0_1>();

  categories.add("historical_origin_not_claimed");
  categories.add("user_decides");

  const profile = findFreeOperatorProfileV0_1(operator);

  if (profile) {
    addMatchingTermSetCategoriesV0_1(
      categories,
      profile.directFreeOperator,
      form,
      gloss,
    );
    addMatchingTermSetCategoriesV0_1(
      categories,
      profile.derivativeFamilySupport,
      form,
      gloss,
    );

    for (const collision of profile.homophoneCollisions) {
      addMatchingTermSetCategoriesV0_1(categories, collision, form, gloss);
    }
  }

  if (
    categories.has("free_operator_attested") &&
    hasFunctionalBridgeV0_1(input.functionalBridge)
  ) {
    categories.add("functional_motivation_supported");
  }

  return {
    operator,
    attestedForm: form,
    categories: [...categories].sort(),
    historicalOriginClaim: "not_claimed",
    userDecisionPosture: "user_decides",
  };
}
