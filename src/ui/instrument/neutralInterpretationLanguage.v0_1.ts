const LEGACY_BOUNDARY_COPY_REPLACEMENTS_V0_1: readonly (readonly [RegExp, string])[] = [
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
];

/** Converts known legacy claim-boundary copy at render time without changing stored payloads. */
export function presentNeutralInterpretationBoundaryV0_1(value: string): string {
  const presented = LEGACY_BOUNDARY_COPY_REPLACEMENTS_V0_1.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value,
  );
  return /^[A-Z]/.test(value) && /^[a-z]/.test(presented)
    ? `${presented[0]!.toUpperCase()}${presented.slice(1)}`
    : presented;
}

export const LEGACY_INTERPRETATION_COPY_PATTERNS_V0_1 = [
  /\bno single sense winner\b/iu,
  /\bwinning sense\b/iu,
  /\bsense winner\b/iu,
  /\bno single winner\b/iu,
  /\bno winner(?: selected)?\b/iu,
  /\bwinning sense\b/iu,
  /\bwinner selection\b/iu,
  /\bwithout selecting a winner\b/iu,
  /\border is not a ranking\b/iu,
  /\bautomatic ranking\b/iu,
  /\bsense is ranked\b/iu,
  /\ba unique winner\b/iu,
] as const;
