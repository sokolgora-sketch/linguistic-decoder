import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "./interpretationDecisionPolicy.v0_1";
import {
  hasLegacyInterpretationSelectionFieldsV0_2,
  projectNeutralInterpretationSelectionV0_2,
  type NeutralInterpretationSelectionV0_2,
} from "./neutralInterpretationProjection.v0_2";

export const MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_2 =
  "open-instrument.motivation-engine-discovery.v0_2" as const;

export type MotivationEngineDiscoveryV0_2<T extends Record<string, unknown>> =
  Omit<NeutralInterpretationSelectionV0_2<T>, "schemaVersion" | "interpretation"> & {
    schemaVersion: typeof MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_2;
    interpretation: Readonly<{
      layer: string;
      status: "hypothesis" | "UNKNOWN_OR_NULL";
      note: string;
    }>;
    interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1;
  };

const ACTIVE_INTERPRETATION_NOTE_V0_2 =
  "Multiple interpretations may coexist. Automatic interpretation selection is disabled; the user decides.";
const ACTIVE_NULL_NOTE_V0_2 =
  "No qualifying source witness was found for this structure; Null is valid. Multiple interpretations may coexist; the user decides.";

export function toMotivationEngineDiscoveryV0_2<T extends Record<string, unknown>>(
  input: T,
): MotivationEngineDiscoveryV0_2<T> | null {
  if (
    input.schemaVersion !== "open-instrument.motivation-engine-discovery.v0_1" &&
    input.schemaVersion !== MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_2
  ) return null;

  if (input.schemaVersion === MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_2) {
    return isMotivationEngineDiscoveryV0_2(input)
      ? input as unknown as MotivationEngineDiscoveryV0_2<T>
      : null;
  }

  const projected = projectNeutralInterpretationSelectionV0_2(input) as Record<string, unknown>;
  const interpretation = projected.interpretation;
  if (interpretation === null || typeof interpretation !== "object" || Array.isArray(interpretation)) {
    return null;
  }
  const interpretationRecord = interpretation as Record<string, unknown>;
  projected.schemaVersion = MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_2;
  projected.interpretation = {
    ...interpretationRecord,
    note: interpretationRecord.status === "UNKNOWN_OR_NULL"
      ? ACTIVE_NULL_NOTE_V0_2
      : ACTIVE_INTERPRETATION_NOTE_V0_2,
  };
  projected.interpretationDecisionPolicy = INTERPRETATION_DECISION_POLICY_V0_1;
  return isMotivationEngineDiscoveryV0_2(projected)
    ? projected as MotivationEngineDiscoveryV0_2<T>
    : null;
}

export function isMotivationEngineDiscoveryV0_2(value: unknown): boolean {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const current = value as Record<string, unknown>;
  const interpretation = current.interpretation;
  return (
    current.schemaVersion === MOTIVATION_ENGINE_DISCOVERY_SCHEMA_V0_2 &&
    isInterpretationDecisionPolicyV0_1(current.interpretationDecisionPolicy) &&
    !hasLegacyInterpretationSelectionFieldsV0_2(current) &&
    (current.status === "MATCHES_FOUND" || current.status === "NO_MATCHES") &&
    typeof current.inputWord === "string" &&
    typeof current.inputLanguage === "string" &&
    typeof current.inputProfile === "string" &&
    Array.isArray(current.candidates) &&
    interpretation !== null && typeof interpretation === "object" && !Array.isArray(interpretation) &&
    typeof (interpretation as Record<string, unknown>).note === "string" &&
    ((interpretation as Record<string, unknown>).status === "hypothesis" ||
      (interpretation as Record<string, unknown>).status === "UNKNOWN_OR_NULL") &&
    current.userDecisionPosture === "user_decides"
  );
}
