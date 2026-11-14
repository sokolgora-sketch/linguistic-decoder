import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "./interpretationDecisionPolicy.v0_1";
import {
  isWordSpecificFunctionalDepthV0_1,
  type WordSpecificFunctionalDepthV0_1,
} from "./wordSpecificFunctionalDepth.v0_1";
import {
  hasLegacyInterpretationSelectionFieldsV0_2,
  projectNeutralInterpretationSelectionV0_2,
  type NeutralInterpretationSelectionV0_2,
} from "./neutralInterpretationProjection.v0_2";

export const WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_2 =
  "open-instrument.word-specific-functional-depth.v0_2" as const;

export type WordSpecificFunctionalDepthV0_2 = Omit<
  NeutralInterpretationSelectionV0_2<WordSpecificFunctionalDepthV0_1>,
  "schemaVersion"
> & Readonly<{
  schemaVersion: typeof WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_2;
  interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1;
}>;

function restoreLegacyDepthForValidation(value: unknown, parentKey = ""): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => restoreLegacyDepthForValidation(item, parentKey));
  }
  if (value === null || typeof value !== "object") return value;
  const output: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value)) {
    if (key !== "interpretationDecisionPolicy") {
      output[key] = restoreLegacyDepthForValidation(child, key);
    }
  }
  if (isInterpretationDecisionPolicyV0_1((value as Record<string, unknown>).interpretationDecisionPolicy)) {
    if (parentKey === "claimBoundary") output.winnerClaim = "not_claimed";
    else output.noSingleWinner = true;
  }
  if (parentKey === "") {
    output.schemaVersion = "open-instrument.word-specific-functional-depth.v0_1";
  }
  return output;
}

export function isWordSpecificFunctionalDepthV0_2(
  value: unknown,
): value is WordSpecificFunctionalDepthV0_2 {
  if (
    value === null || typeof value !== "object" || Array.isArray(value) ||
    (value as Record<string, unknown>).schemaVersion !== WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_2 ||
    !isInterpretationDecisionPolicyV0_1((value as Record<string, unknown>).interpretationDecisionPolicy) ||
    hasLegacyInterpretationSelectionFieldsV0_2(value)
  ) return false;
  return isWordSpecificFunctionalDepthV0_1(restoreLegacyDepthForValidation(value));
}

export function toWordSpecificFunctionalDepthV0_2(
  value: unknown,
): WordSpecificFunctionalDepthV0_2 | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.schemaVersion === WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_2) {
    return isWordSpecificFunctionalDepthV0_2(input) ? input as WordSpecificFunctionalDepthV0_2 : null;
  }
  if (!isWordSpecificFunctionalDepthV0_1(input)) return null;
  const projected = projectNeutralInterpretationSelectionV0_2(input) as Record<string, unknown>;
  projected.schemaVersion = WORD_SPECIFIC_FUNCTIONAL_DEPTH_SCHEMA_VERSION_V0_2;
  projected.interpretationDecisionPolicy = INTERPRETATION_DECISION_POLICY_V0_1;
  return isWordSpecificFunctionalDepthV0_2(projected)
    ? projected as WordSpecificFunctionalDepthV0_2
    : null;
}
