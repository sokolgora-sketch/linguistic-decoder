import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "./interpretationDecisionPolicy.v0_1";

const LEGACY_SELECTION_FIELDS_V0_2 = new Set([
  "winnerClaim",
  "noSingleWinner",
  "candidateWinnerIndependent",
]);

type LegacySelectionFieldV0_2 =
  | "winnerClaim"
  | "noSingleWinner"
  | "candidateWinnerIndependent";

type HasLegacySelectionFieldV0_2<T> = Extract<
  keyof T,
  LegacySelectionFieldV0_2
> extends never
  ? false
  : true;

type NeutralSelectionRecordV0_2<T extends object> = {
  [K in keyof T as K extends LegacySelectionFieldV0_2
    ? never
    : K extends "policy" | "mode"
      ? T[K] extends "no_single_winner"
        ? never
        : K
      : K]: NeutralInterpretationSelectionV0_2<T[K]>;
} & (HasLegacySelectionFieldV0_2<T> extends true
  ? { interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1 }
  : {});

/** Type-level projection of legacy selection guards to the neutral policy. */
export type NeutralInterpretationSelectionV0_2<T> = T extends readonly (infer Item)[]
  ? readonly NeutralInterpretationSelectionV0_2<Item>[]
  : T extends object
    ? NeutralSelectionRecordV0_2<T>
    : T;

export function hasLegacyInterpretationSelectionFieldsV0_2(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasLegacyInterpretationSelectionFieldsV0_2);
  if (value === null || typeof value !== "object") return false;
  return Object.entries(value).some(([key, child]) =>
    LEGACY_SELECTION_FIELDS_V0_2.has(key) ||
    ((key === "policy" || key === "mode") && child === "no_single_winner") ||
    hasLegacyInterpretationSelectionFieldsV0_2(child),
  );
}

/**
 * Structural, version-boundary projection only. Text, identities, evidence,
 * alternatives, order, and Null values are copied exactly.
 */
export function projectNeutralInterpretationSelectionV0_2<T>(
  value: T,
): NeutralInterpretationSelectionV0_2<T> {
  if (Array.isArray(value)) {
    return value.map((item) => projectNeutralInterpretationSelectionV0_2(item)) as
      NeutralInterpretationSelectionV0_2<T>;
  }
  if (value === null || typeof value !== "object") {
    return value as NeutralInterpretationSelectionV0_2<T>;
  }

  const output: Record<string, unknown> = {};
  let replacedGuard = false;
  for (const [key, child] of Object.entries(value)) {
    if (LEGACY_SELECTION_FIELDS_V0_2.has(key)) {
      replacedGuard = true;
      continue;
    }
    if ((key === "policy" || key === "mode") && child === "no_single_winner") {
      replacedGuard = true;
      continue;
    }
    output[key] = projectNeutralInterpretationSelectionV0_2(child);
  }
  if (replacedGuard) {
    output.interpretationDecisionPolicy = INTERPRETATION_DECISION_POLICY_V0_1;
  }
  return output as NeutralInterpretationSelectionV0_2<T>;
}

export function isNeutralInterpretationDecisionPolicyV0_2(value: unknown): boolean {
  return isInterpretationDecisionPolicyV0_1(value);
}
