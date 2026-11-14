const LEGACY_INTERPRETATION_INPUT_REPLACEMENTS_V0_1: readonly (readonly [RegExp, string])[] = [
  [/\bno single sense winner\b/giu, "component-sense choice remains open"],
  [/\bno single winner is claimed\b/giu, "no interpretation is selected automatically"],
  [/\bno single winner is selected\b/giu, "no interpretation is selected automatically"],
  [/\bno single winner\b/giu, "multiple interpretations may coexist"],
  [/\bwinning sense\b/giu, "selected interpretation"],
  [/\bsense winner\b/giu, "component-sense choice"],
  [/\bno winner selected\b/giu, "no interpretation is selected automatically"],
  [/\bwithout selecting a winner\b/giu, "while keeping alternatives open for user review"],
  [/\border is not a ranking\b/giu, "display order does not recommend an interpretation"],
  [/\bautomatic ranking\b/giu, "automatic interpretation selection"],
  [/\bsense is ranked\b/giu, "sense is selected automatically"],
  [/\bselecting a winner\b/giu, "selecting one interpretation automatically"],
  [/\bselect a winner\b/giu, "select an interpretation automatically"],
  [/\bwinner claims? remain unclaimed\b/giu, "interpretation remains with the user"],
  [/\bwinner claims?\b/giu, "claim to select an interpretation automatically"],
  [/\bwinner selection\b/giu, "automatic interpretation selection"],
  [/\bwinner evidence\b/giu, "evidence for selecting an interpretation"],
  [/\bautomatic functional winners?\b/giu, "automatic functional readings"],
  [/\bfunctional winners\b/giu, "functional interpretations"],
  [/\bor a unique winner\b/giu, "or one uniquely established interpretation"],
  [/\ba unique winner\b/giu, "a uniquely established interpretation"],
  [/\bno winner\b/giu, "interpretation remains with the user"],
  [/\bwinnerClaim=not_claimed;?\s*/giu, "automaticInterpretationSelection=DISABLED; "],
  [/\bno_single_winner\b/giu, "automatic_interpretation_selection_disabled"],
];

function migratePolicyText(value: string): string {
  const migrated = LEGACY_INTERPRETATION_INPUT_REPLACEMENTS_V0_1.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value,
  );
  return /^[A-Z]/.test(value) && /^[a-z]/.test(migrated)
    ? `${migrated[0]!.toUpperCase()}${migrated.slice(1)}`
    : migrated;
}

/** Migrate only the generated policy suffix, leaving cited evidence untouched. */
export function migrateLegacyReviewedEvidenceLineAtInputV0_1(value: string): string {
  if (!value.toLocaleLowerCase("en-US").startsWith("reviewed functional free-operator evidence:")) {
    return value;
  }
  return value.replace(
    /;\s*winnerClaim=not_claimed;\s*languageSuperiorityClaim=/i,
    "; automaticInterpretationSelection=DISABLED; languageSuperiorityClaim=",
  );
}

/**
 * Migrate legacy policy prose only at known policy-text fields. A direct
 * string call remains available for callers that have already established
 * the string's legacy-policy role. Other serialized text is copied exactly.
 */
export function migrateLegacyInterpretationTextAtInputV0_1(value: unknown): unknown {
  if (typeof value === "string") return migratePolicyText(value);
  if (value === null || typeof value !== "object") return value;

  const visit = (node: unknown, path: readonly string[]): unknown => {
    if (Array.isArray(node)) return node.map((item) => visit(item, path));
    if (typeof node === "string") {
      const key = path[path.length - 1];
      const isLegacyStatusSummary = key === "summary" && path.includes("analysisStatusV0_1");
      const isLegacyCandidateBoundary = key === "claimBoundary" && path.includes("candidates");
      const isGeneratedReviewedEvidence = key === "evidenceText";
      const isLegacyDeepRootPolicyText =
        (key === "gloss" || key === "notes") &&
        path.includes("deepRoot") &&
        path.includes("functionalRoots");
      if (isGeneratedReviewedEvidence) return migrateLegacyReviewedEvidenceLineAtInputV0_1(node);
      return isLegacyStatusSummary || isLegacyCandidateBoundary || isLegacyDeepRootPolicyText
        ? migratePolicyText(node)
        : node;
    }
    if (node === null || typeof node !== "object") return node;
    return Object.fromEntries(Object.entries(node).map(([key, child]) => [key, visit(child, [...path, key])]));
  };

  return visit(value, []);
}
