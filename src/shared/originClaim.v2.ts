import type { OriginClaimV1 } from "./originClaim.v1";
import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "./openInstrument/interpretationDecisionPolicy.v0_1";

export const ORIGIN_CLAIM_SCHEMA_VERSION_V0_2 =
  "open-instrument.origin-claim.v0_2" as const;

export type OriginClaimV0_2 = Omit<OriginClaimV1, "version" | "policy"> & {
  schemaVersion: typeof ORIGIN_CLAIM_SCHEMA_VERSION_V0_2;
  interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1;
  userDecisionPosture: "user_decides";
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function migrateOriginClaimV1ToV0_2(value: unknown): OriginClaimV0_2 | null {
  if (!isRecord(value) || value.version !== "v1" || value.policy !== "no_single_winner") {
    return null;
  }
  const { version: _version, policy: _policy, ...claim } = value;
  const migrated = {
    ...claim,
    schemaVersion: ORIGIN_CLAIM_SCHEMA_VERSION_V0_2,
    interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
    userDecisionPosture: "user_decides" as const,
  };
  return isOriginClaimV0_2(migrated) ? migrated : null;
}

export function migrateOriginClaimV0_2ToV1ForInput(value: unknown): OriginClaimV1 | null {
  if (!isOriginClaimV0_2(value)) return null;
  const {
    schemaVersion: _schemaVersion,
    interpretationDecisionPolicy: _policy,
    userDecisionPosture: _posture,
    ...claim
  } = value;
  return {
    ...claim,
    version: "v1",
    policy: "no_single_winner",
  } as OriginClaimV1;
}

export function isOriginClaimV0_2(value: unknown): value is OriginClaimV0_2 {
  if (!isRecord(value)) return false;
  return (
    value.schemaVersion === ORIGIN_CLAIM_SCHEMA_VERSION_V0_2 &&
    isInterpretationDecisionPolicyV0_1(value.interpretationDecisionPolicy) &&
    value.userDecisionPosture === "user_decides" &&
    Array.isArray(value.candidates) &&
    isRecord(value.summary) &&
    isRecord(value.meta) &&
    !Object.prototype.hasOwnProperty.call(value, "policy") &&
    !Object.prototype.hasOwnProperty.call(value, "version")
  );
}
