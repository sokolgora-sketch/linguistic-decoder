import { createHash } from "node:crypto";

import type { ComparativeVerdictV0_1 } from "./functionalRoleComparativeEvaluationContract.v0_1";
import {
  TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1,
  buildTargetBoundCorrespondenceDecisionRuleV1,
  fingerprintTargetBoundCorrespondenceDecisionRuleV1,
  validateTargetBoundCorrespondenceDecisionRuleV1,
  type TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1,
  type TargetBoundCorrespondenceDecisionRuleV1,
  type TargetBoundCorrespondenceRationaleRelationshipV1,
  type TargetBoundCorrespondenceReviewReasonCodeV1,
  type TargetBoundCorrespondenceReviewV1,
} from "./targetBoundCorrespondenceDecisionRule.v1";

export const TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2 =
  "open-instrument.target-bound-correspondence-decision-rule.v2" as const;

export type TargetBoundCorrespondenceRationaleV2 = Readonly<{
  relationship: TargetBoundCorrespondenceRationaleRelationshipV1;
  limitations: readonly string[];
  text: string;
}>;

export type TargetBoundCorrespondenceReviewV2 = Readonly<
  | {
      reviewStatus: "NOT_REVIEWED";
      verdict: null;
      reviewer: null;
      reviewerKind: null;
      reviewedAt: null;
      rationale: null;
      reasonCodes: readonly [];
    }
  | {
      reviewStatus: "REVIEWED";
      verdict: ComparativeVerdictV0_1;
      reviewer: string;
      reviewerKind: "HUMAN";
      reviewedAt: string;
      rationale: TargetBoundCorrespondenceRationaleV2;
      reasonCodes: readonly TargetBoundCorrespondenceReviewReasonCodeV1[];
    }
>;

type DecisionBodyV2 = Omit<
  TargetBoundCorrespondenceDecisionRuleV1,
  "schemaVersion" | "review" | "decisionFingerprint"
> & {
  schemaVersion: typeof TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2;
  review: TargetBoundCorrespondenceReviewV2;
};

export type TargetBoundCorrespondenceDecisionRuleV2 = Readonly<
  DecisionBodyV2 & { decisionFingerprint: string }
>;

export type TargetBoundCorrespondenceDecisionRuleValidationResultV2 = Readonly<
  | { ok: true; decision: TargetBoundCorrespondenceDecisionRuleV2 }
  | {
      ok: false;
      reasonCodes: readonly TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1[];
    }
>;

type RecordV2 = Record<string, unknown>;
type BuildArgumentsV2 = Parameters<typeof buildTargetBoundCorrespondenceDecisionRuleV1>;

const DECISION_KEYS_V2 = [
  "schemaVersion",
  "targetBoundPackageFingerprint",
  "comparisonUnitId",
  "comparisonUnitFingerprint",
  "targetInputFingerprint",
  "sourceAttestationId",
  "sourceAttestationFingerprint",
  "sourceReviewFingerprint",
  "sourceEntryId",
  "sourceSenseId",
  "sourceSenseLocator",
  "sourceSenseTextHash",
  "doctrineProfileSchemaVersion",
  "doctrineProfileEngineAuthority",
  "doctrineProfileRegistry",
  "doctrineVoicePath",
  "targetSenseBinding",
  "review",
  "claimBoundary",
  "functionalAcceptance",
  "historicalRelation",
  "winnerClaim",
  "productionMembership",
  "runtimeAuthorization",
  "userDecisionPosture",
  "noSingleWinner",
  "decisionFingerprint",
] as const;

const REVIEW_KEYS_V2 = [
  "reviewStatus",
  "verdict",
  "reviewer",
  "reviewerKind",
  "reviewedAt",
  "rationale",
  "reasonCodes",
] as const;

const RATIONALE_KEYS_V2 = [
  "relationship",
  "limitations",
  "text",
] as const;

function isRecordV2(value: unknown): value is RecordV2 {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeysV2(value: RecordV2, keys: readonly string[]): boolean {
  const actual = Object.keys(value);
  return actual.length === keys.length && keys.every((key) => Object.prototype.hasOwnProperty.call(value, key));
}

function exactTextV2(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    value === value.normalize("NFC")
  );
}

function validSha256V2(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function validRationaleV2(value: unknown): value is TargetBoundCorrespondenceRationaleV2 {
  return isRecordV2(value) && hasExactKeysV2(value, RATIONALE_KEYS_V2) && exactTextV2(value.text);
}

function reviewShapeReasonCodesV2(
  value: unknown,
): TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1[] {
  if (!isRecordV2(value) || !hasExactKeysV2(value, REVIEW_KEYS_V2)) {
    return ["REVIEW_STATE_INVALID"];
  }
  if (value.reviewStatus === "NOT_REVIEWED") {
    return value.verdict === null &&
      value.reviewer === null &&
      value.reviewerKind === null &&
      value.reviewedAt === null &&
      value.rationale === null &&
      Array.isArray(value.reasonCodes) &&
      value.reasonCodes.length === 0
      ? []
      : ["REVIEW_STATE_INVALID"];
  }
  if (value.reviewStatus !== "REVIEWED") return ["REVIEW_STATE_INVALID"];
  return validRationaleV2(value.rationale) ? [] : ["RATIONALE_INVALID"];
}

function toLegacyReviewV2(value: TargetBoundCorrespondenceReviewV2): TargetBoundCorrespondenceReviewV1 {
  if (value.reviewStatus === "NOT_REVIEWED") return value;
  return {
    reviewStatus: "REVIEWED",
    verdict: value.verdict,
    reviewer: value.reviewer,
    reviewerKind: "HUMAN",
    reviewedAt: value.reviewedAt,
    rationale: {
      relationship: value.rationale.relationship,
      limitations: [...value.rationale.limitations],
    },
    reasonCodes: [...value.reasonCodes],
  };
}

function deepFreezeV2<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as RecordV2)) deepFreezeV2(child, seen);
  return Object.freeze(value);
}

function canonicalStringifyV2(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalStringifyV2).join(",")}]`;
  const record = value as RecordV2;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalStringifyV2(record[key])}`)
    .join(",")}}`;
}

function decisionFingerprintBodyV2(value: DecisionBodyV2): string {
  return createHash("sha256").update(canonicalStringifyV2(value), "utf8").digest("hex");
}

export function buildTargetBoundCorrespondenceDecisionRuleV2(
  packageValue: BuildArgumentsV2[0],
  attestationValue: BuildArgumentsV2[1],
  sourceReviewValue: BuildArgumentsV2[2],
  comparisonUnitId: BuildArgumentsV2[3],
  reviewValue?: TargetBoundCorrespondenceReviewV2,
): TargetBoundCorrespondenceDecisionRuleValidationResultV2 {
  const shapeReasons = reviewValue === undefined ? [] : reviewShapeReasonCodesV2(reviewValue);
  if (shapeReasons.length > 0) return { ok: false, reasonCodes: shapeReasons };

  const legacyResult = buildTargetBoundCorrespondenceDecisionRuleV1(
    packageValue,
    attestationValue,
    sourceReviewValue,
    comparisonUnitId,
    reviewValue === undefined ? undefined : toLegacyReviewV2(reviewValue),
  );
  if (!legacyResult.ok) return legacyResult;

  const normalizedReview: TargetBoundCorrespondenceReviewV2 = legacyResult.decision.review.reviewStatus === "NOT_REVIEWED"
    ? legacyResult.decision.review
    : {
        ...legacyResult.decision.review,
        rationale: {
          ...legacyResult.decision.review.rationale,
          text: (reviewValue as Extract<TargetBoundCorrespondenceReviewV2, { reviewStatus: "REVIEWED" }>).rationale.text,
        },
      };
  const { decisionFingerprint: _legacyFingerprint, ...legacyBody } = legacyResult.decision;
  const body = deepFreezeV2({
    ...legacyBody,
    schemaVersion: TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2,
    review: normalizedReview,
  } as DecisionBodyV2);
  return {
    ok: true,
    decision: deepFreezeV2({
      ...body,
      decisionFingerprint: decisionFingerprintBodyV2(body),
    }),
  };
}

export function validateTargetBoundCorrespondenceDecisionRuleV2(
  value: unknown,
  packageValue: BuildArgumentsV2[0],
  attestationValue: BuildArgumentsV2[1],
  sourceReviewValue: BuildArgumentsV2[2],
): TargetBoundCorrespondenceDecisionRuleValidationResultV2 {
  if (!isRecordV2(value)) return { ok: false, reasonCodes: ["INPUT_NOT_OBJECT"] };
  const reasons = new Set<TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1>();
  if (value.schemaVersion !== TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2) {
    reasons.add("SCHEMA_VERSION_INVALID");
  }
  if (!hasExactKeysV2(value, DECISION_KEYS_V2)) reasons.add("UNEXPECTED_FIELD_PRESENT");

  const reviewReasons = reviewShapeReasonCodesV2(value.review);
  for (const reason of reviewReasons) reasons.add(reason);

  if (!validSha256V2(value.decisionFingerprint)) {
    reasons.add("DECISION_FINGERPRINT_INVALID");
  }

  if (reviewReasons.length === 0) {
    const candidate = {
      ...value,
      schemaVersion: TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1,
      review: toLegacyReviewV2(value.review as TargetBoundCorrespondenceReviewV2),
      decisionFingerprint: "0".repeat(64),
    } as TargetBoundCorrespondenceDecisionRuleV1;
    const legacyFingerprint = fingerprintTargetBoundCorrespondenceDecisionRuleV1(candidate);
    const legacyResult = validateTargetBoundCorrespondenceDecisionRuleV1(
      { ...candidate, decisionFingerprint: legacyFingerprint },
      packageValue,
      attestationValue,
      sourceReviewValue,
    );
    if (!legacyResult.ok) {
      for (const reason of legacyResult.reasonCodes) reasons.add(reason);
    } else if (validSha256V2(value.decisionFingerprint)) {
      const { decisionFingerprint: _valueFingerprint, ...body } = value;
      if (value.decisionFingerprint !== decisionFingerprintBodyV2(body as DecisionBodyV2)) {
        reasons.add("DECISION_FINGERPRINT_MISMATCH");
      }
    }
  }

  const sortedReasons = [...reasons].sort();
  if (sortedReasons.length > 0) return { ok: false, reasonCodes: sortedReasons };
  return buildTargetBoundCorrespondenceDecisionRuleV2(
    packageValue,
    attestationValue,
    sourceReviewValue,
    value.comparisonUnitId as string,
    value.review as TargetBoundCorrespondenceReviewV2,
  );
}

export function fingerprintTargetBoundCorrespondenceDecisionRuleV2(
  value: TargetBoundCorrespondenceDecisionRuleV2,
): string {
  if (!validSha256V2(value.decisionFingerprint)) {
    throw new Error("Cannot fingerprint an invalid correspondence decision");
  }
  const { decisionFingerprint: _decisionFingerprint, ...body } = value;
  return decisionFingerprintBodyV2(body);
}
