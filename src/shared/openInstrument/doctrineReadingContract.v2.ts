import {
  INTERPRETATION_DECISION_POLICY_V0_1,
  isInterpretationDecisionPolicyV0_1,
} from "./interpretationDecisionPolicy.v0_1";
import {
  DOCTRINE_READING_CONTRACT_SCHEMA_V1,
  projectDoctrineReadingV1,
  type DoctrineReadingV1,
} from "./doctrineReadingContract.v1";
import {
  hasLegacyInterpretationSelectionFieldsV0_2,
  projectNeutralInterpretationSelectionV0_2,
  type NeutralInterpretationSelectionV0_2,
} from "./neutralInterpretationProjection.v0_2";

export const DOCTRINE_READING_CONTRACT_SCHEMA_V2 =
  "open-instrument.doctrine-reading.v2" as const;

export type DoctrineReadingV2 = Omit<
  NeutralInterpretationSelectionV0_2<DoctrineReadingV1>,
  "schemaVersion"
> & Readonly<{
  schemaVersion: typeof DOCTRINE_READING_CONTRACT_SCHEMA_V2;
  interpretationDecisionPolicy: typeof INTERPRETATION_DECISION_POLICY_V0_1;
}>;

function stableShape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableShape);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, child]) => [key, stableShape(child)]),
  );
}

function sameShape(left: unknown, right: unknown): boolean {
  return JSON.stringify(stableShape(left)) === JSON.stringify(stableShape(right));
}

function toNeutralV2(value: DoctrineReadingV1): DoctrineReadingV2 {
  const projected = projectNeutralInterpretationSelectionV0_2(value) as Record<string, unknown>;
  projected.schemaVersion = DOCTRINE_READING_CONTRACT_SCHEMA_V2;
  projected.interpretationDecisionPolicy = INTERPRETATION_DECISION_POLICY_V0_1;
  return projected as DoctrineReadingV2;
}

function isCanonicalDoctrineReadingV1(value: unknown): value is DoctrineReadingV1 {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  if (candidate.schemaVersion !== DOCTRINE_READING_CONTRACT_SCHEMA_V1 ||
      !Array.isArray(candidate.analyzedVoicePath)) return false;
  const expected = projectDoctrineReadingV1(candidate.analyzedVoicePath);
  return expected.ok && expected.doctrineReading !== null && sameShape(value, expected.doctrineReading);
}

export function isDoctrineReadingV2(value: unknown): value is DoctrineReadingV2 {
  if (
    value === null || typeof value !== "object" || Array.isArray(value) ||
    (value as Record<string, unknown>).schemaVersion !== DOCTRINE_READING_CONTRACT_SCHEMA_V2 ||
    !isInterpretationDecisionPolicyV0_1((value as Record<string, unknown>).interpretationDecisionPolicy) ||
    hasLegacyInterpretationSelectionFieldsV0_2(value)
  ) return false;

  const candidate = value as Record<string, unknown>;
  if (!Array.isArray(candidate.analyzedVoicePath)) return false;
  const expectedV1 = projectDoctrineReadingV1(candidate.analyzedVoicePath);
  if (!expectedV1.ok || expectedV1.doctrineReading === null) return false;
  return sameShape(value, toNeutralV2(expectedV1.doctrineReading));
}

export function toDoctrineReadingV2(value: unknown): DoctrineReadingV2 | null {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.schemaVersion === DOCTRINE_READING_CONTRACT_SCHEMA_V2) {
    return isDoctrineReadingV2(input) ? input as DoctrineReadingV2 : null;
  }
  if (!isCanonicalDoctrineReadingV1(input)) return null;
  const projected = toNeutralV2(input);
  return isDoctrineReadingV2(projected) ? projected : null;
}
