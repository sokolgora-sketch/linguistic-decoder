export const INTERPRETATION_DECISION_POLICY_SCHEMA_V0_1 =
  "open-instrument.interpretation-decision-policy.v0_1" as const;

export type InterpretationDecisionPolicyV0_1 = Readonly<{
  schemaVersion: typeof INTERPRETATION_DECISION_POLICY_SCHEMA_V0_1;
  multipleInterpretationsMayCoexist: true;
  automaticInterpretationSelection: "DISABLED";
  interpretationDecisionAuthority: "USER_DECIDES";
  alternativeProvenance: "PRESERVED_PER_INTERPRETATION";
  alternativeClaimStatus: "PRESERVED_PER_INTERPRETATION";
}>;

export const INTERPRETATION_DECISION_POLICY_V0_1: InterpretationDecisionPolicyV0_1 =
  Object.freeze({
    schemaVersion: INTERPRETATION_DECISION_POLICY_SCHEMA_V0_1,
    multipleInterpretationsMayCoexist: true,
    automaticInterpretationSelection: "DISABLED",
    interpretationDecisionAuthority: "USER_DECIDES",
    alternativeProvenance: "PRESERVED_PER_INTERPRETATION",
    alternativeClaimStatus: "PRESERVED_PER_INTERPRETATION",
  });

export function isInterpretationDecisionPolicyV0_1(
  value: unknown,
): value is InterpretationDecisionPolicyV0_1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const policy = value as Record<string, unknown>;
  return (
    policy.schemaVersion === INTERPRETATION_DECISION_POLICY_SCHEMA_V0_1 &&
    policy.multipleInterpretationsMayCoexist === true &&
    policy.automaticInterpretationSelection === "DISABLED" &&
    policy.interpretationDecisionAuthority === "USER_DECIDES" &&
    policy.alternativeProvenance === "PRESERVED_PER_INTERPRETATION" &&
    policy.alternativeClaimStatus === "PRESERVED_PER_INTERPRETATION" &&
    Object.keys(policy).length === 6
  );
}
