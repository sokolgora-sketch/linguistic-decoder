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

function normalizeFreeOperatorTextV0_1(value: string): string {
  return value.trim().toLocaleLowerCase("en-US");
}

function hasSplitDivideGlossV0_1(value: string): boolean {
  return /\b(split|divide|separate|separation|cut|share|divided)\b/.test(
    normalizeFreeOperatorTextV0_1(value),
  );
}

function hasGiveGlossV0_1(value: string): boolean {
  return /\b(give|gave|given)\b/.test(normalizeFreeOperatorTextV0_1(value));
}

function hasFunctionalBridgeV0_1(value: string | null | undefined): boolean {
  return Boolean(value && value.trim());
}

export function classifyFreeOperatorEvidenceV0_1(
  input: FreeOperatorEvidenceInputV0_1,
): FreeOperatorEvidenceClassificationV0_1 {
  const operator = normalizeFreeOperatorTextV0_1(input.operator);
  const form = normalizeFreeOperatorTextV0_1(input.attestedForm);
  const gloss = normalizeFreeOperatorTextV0_1(input.attestedGloss);

  const categories = new Set<FreeOperatorEvidenceCategoryV0_1>();

  categories.add("historical_origin_not_claimed");
  categories.add("user_decides");

  if (operator === "da") {
    if ((form === "da" || form === "daj") && hasSplitDivideGlossV0_1(gloss)) {
      categories.add("free_operator_attested");
    }

    if ((form === "ndaj" || form === "ndarë" || form === "ndare") && hasSplitDivideGlossV0_1(gloss)) {
      categories.add("derivative_family_support");
    }

    if (form === "da" && hasGiveGlossV0_1(gloss)) {
      categories.add("homophone_collision");
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
