import { createHash } from "node:crypto";

import {
  DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  getSevenVoiceDoctrineFunctionalProfileV0_1,
} from "./doctrineFunctionalProfile.v0_1";
import type { ComparativeVerdictV0_1 } from "./functionalRoleComparativeEvaluationContract.v0_1";
import {
  validateSourceEntryAttestationV1,
  type SourceEntryAttestationV1,
} from "./sourceEntryAttestation.v1";
import {
  fingerprintSourceEntryAttestationV1,
  validateTargetBlindReviewedSourceAttestationV1,
  type TargetBlindReviewedSourceAttestationV1,
} from "./targetBlindReviewedSourceAttestation.v1";
import {
  TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1,
  fingerprintTargetBoundReviewEnvelopeV1,
  validateTargetBoundFunctionalCorrespondenceV1,
  type TargetBoundFunctionalCorrespondenceComparisonUnitV1,
  type TargetBoundFunctionalCorrespondencePackageV1,
} from "./targetBoundFunctionalCorrespondence.v1";
import type { SevenVoiceKey } from "../sevenVoiceOrderedViews.v0.1";

export const TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1 =
  "open-instrument.target-bound-correspondence-decision-rule.v1" as const;

export const TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_PROFILE_REGISTRY_V1 =
  "SEVEN_VOICE_DOCTRINE_PROFILES_V0_1" as const;

export type TargetBoundCorrespondenceRationaleRelationshipV1 =
  | "DIRECT"
  | "PARTIAL"
  | "NONE"
  | "UNDETERMINED"
  | "NOT_APPLICABLE";

export type TargetBoundCorrespondenceReviewReasonCodeV1 =
  | "TARGET_SENSE_UNBOUND"
  | "SOURCE_SENSE_MATERIAL_MISSING"
  | "INSUFFICIENT_AUTHORIZED_INFORMATION"
  | "REVIEWED_SUPPORT"
  | "REVIEWED_PARTIAL_SUPPORT"
  | "REVIEWED_NON_SUPPORT"
  | "NO_DEFENSIBLE_COMPARISON";

export type TargetBoundCorrespondenceRationaleV1 = Readonly<{
  relationship: TargetBoundCorrespondenceRationaleRelationshipV1;
  limitations: readonly string[];
  text: string;
}>;

export type TargetBoundCorrespondenceReviewV1 = Readonly<
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
      rationale: TargetBoundCorrespondenceRationaleV1;
      reasonCodes: readonly TargetBoundCorrespondenceReviewReasonCodeV1[];
    }
>;

type DecisionBodyV1 = Readonly<{
  schemaVersion: typeof TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1;
  targetBoundPackageFingerprint: string;
  comparisonUnitId: string;
  comparisonUnitFingerprint: string;
  targetInputFingerprint: string;
  sourceAttestationId: string;
  sourceAttestationFingerprint: string;
  sourceReviewFingerprint: string;
  sourceEntryId: string;
  sourceSenseId: string;
  sourceSenseLocator: string;
  sourceSenseTextHash: string;
  doctrineProfileSchemaVersion: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  doctrineProfileEngineAuthority: typeof DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1;
  doctrineProfileRegistry: typeof TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_PROFILE_REGISTRY_V1;
  doctrineVoicePath: readonly SevenVoiceKey[];
  targetSenseBinding: "TARGET_SENSE_UNBOUND" | "TARGET_SENSE_PRESENT_USER_PROVIDED";
  review: TargetBoundCorrespondenceReviewV1;
  claimBoundary: "TARGET_BOUND_CORRESPONDENCE_REVIEW_ONLY";
  functionalAcceptance: "NOT_AUTHORIZED";
  historicalRelation: "NOT_CLAIMED";
  winnerClaim: "NOT_CLAIMED";
  productionMembership: "NOT_AUTHORIZED";
  runtimeAuthorization: "NOT_AUTHORIZED";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type TargetBoundCorrespondenceDecisionRuleV1 = Readonly<
  DecisionBodyV1 & {
    decisionFingerprint: string;
  }
>;

export type TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1 =
  | "INPUT_NOT_OBJECT"
  | "UNEXPECTED_FIELD_PRESENT"
  | "FORBIDDEN_AUTHORITY_FIELD_PRESENT"
  | "SCHEMA_VERSION_INVALID"
  | "TARGET_BOUND_PACKAGE_INVALID"
  | "COMPARISON_UNIT_NOT_FOUND"
  | "COMPARISON_UNIT_ALREADY_REVIEWED"
  | "COMPARISON_UNIT_BINDING_MISMATCH"
  | "SOURCE_ATTESTATION_ID_MISMATCH"
  | "SOURCE_ATTESTATION_FINGERPRINT_MISMATCH"
  | "SOURCE_REVIEW_FINGERPRINT_MISMATCH"
  | "SOURCE_ENTRY_ID_MISMATCH"
  | "SOURCE_SENSE_ID_MISMATCH"
  | "SOURCE_SENSE_LOCATOR_MISMATCH"
  | "SOURCE_SENSE_TEXT_HASH_MISMATCH"
  | "TARGET_INPUT_FINGERPRINT_MISMATCH"
  | "TARGET_SENSE_BINDING_MISMATCH"
  | "DOCTRINE_PROFILE_INVALID"
  | "DOCTRINE_PROFILE_PATH_MISMATCH"
  | "REVIEW_STATE_INVALID"
  | "VERDICT_INVALID"
  | "REVIEWER_REQUIRED"
  | "REVIEWER_INVALID"
  | "REVIEWER_KIND_INVALID"
  | "REVIEWED_AT_REQUIRED"
  | "REVIEWED_AT_INVALID"
  | "RATIONALE_INVALID"
  | "REASON_CODES_INVALID"
  | "VERDICT_REASON_MISMATCH"
  | "TARGET_SENSE_REQUIRED_FOR_POSITIVE_VERDICT"
  | "DECISION_FINGERPRINT_INVALID"
  | "DECISION_FINGERPRINT_MISMATCH";

export type TargetBoundCorrespondenceDecisionRuleValidationResultV1 = Readonly<
  | {
      ok: true;
      decision: TargetBoundCorrespondenceDecisionRuleV1;
    }
  | {
      ok: false;
      reasonCodes: readonly TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1[];
    }
>;

type RecordV1 = Record<string, unknown>;
type ContextV1 = Readonly<{
  unit: TargetBoundFunctionalCorrespondenceComparisonUnitV1;
  targetBoundPackageFingerprint: string;
  sourceAttestationFingerprint: string;
  sourceReviewFingerprint: string;
  sourceSenseLocator: string;
  sourceSenseTextHash: string;
  targetSenseBinding: "TARGET_SENSE_UNBOUND" | "TARGET_SENSE_PRESENT_USER_PROVIDED";
  doctrineVoicePath: readonly SevenVoiceKey[];
}>;

const DECISION_KEYS_V1 = [
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

const REVIEW_KEYS_V1 = [
  "reviewStatus",
  "verdict",
  "reviewer",
  "reviewerKind",
  "reviewedAt",
  "rationale",
  "reasonCodes",
] as const;

const RATIONALE_KEYS_V1 = [
  "relationship",
  "limitations",
  "text",
] as const;

const REVIEW_VERDICTS_V1 = new Set<ComparativeVerdictV0_1>([
  "SUPPORTED",
  "PARTIALLY_SUPPORTED",
  "UNSUPPORTED",
  "UNKNOWN",
  "NULL",
]);

const RELATIONSHIPS_V1 = new Set<TargetBoundCorrespondenceRationaleRelationshipV1>([
  "DIRECT",
  "PARTIAL",
  "NONE",
  "UNDETERMINED",
  "NOT_APPLICABLE",
]);

const REVIEW_REASON_CODES_V1 = new Set<TargetBoundCorrespondenceReviewReasonCodeV1>([
  "TARGET_SENSE_UNBOUND",
  "SOURCE_SENSE_MATERIAL_MISSING",
  "INSUFFICIENT_AUTHORIZED_INFORMATION",
  "REVIEWED_SUPPORT",
  "REVIEWED_PARTIAL_SUPPORT",
  "REVIEWED_NON_SUPPORT",
  "NO_DEFENSIBLE_COMPARISON",
]);

const FORBIDDEN_FIELDS_V1 = new Set([
  "targetWord",
  "targetSense",
  "targetSenseId",
  "targetMeaning",
  "semanticBridge",
  "historicalOrigin",
  "historicalTransmission",
  "etymology",
  "cognacy",
  "borrowing",
  "languagePriority",
  "languageSuperiority",
  "winner",
  "gate3Authorization",
  "provider",
  "providerOutput",
  "model",
  "automaticEntrySelection",
  "automaticSenseSelection",
  "selectedEntryId",
  "selectedSenseId",
]);

function isRecordV1(value: unknown): value is RecordV1 {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeysV1(value: RecordV1, expected: readonly string[]): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expected].sort());
}

function hasForbiddenFieldV1(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return false;
  seen.add(value);
  if (Array.isArray(value)) return value.some((child) => hasForbiddenFieldV1(child, seen));
  return Object.entries(value).some(
    ([key, child]) => FORBIDDEN_FIELDS_V1.has(key) || hasForbiddenFieldV1(child, seen),
  );
}

function exactTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value.trim() === value &&
    value === value.normalize("NFC")
  );
}

function validSha256V1(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function validDateV1(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    year > 0 &&
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function canonicalStringifyV1(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalStringifyV1).join(",")}]`;
  const record = value as RecordV1;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalStringifyV1(record[key])}`)
    .join(",")}}`;
}

function sha256V1(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as RecordV1)) deepFreezeV1(child, seen);
  return Object.freeze(value);
}

function sortedUniqueV1<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)].sort() as T[];
}

function equalV1(left: unknown, right: unknown): boolean {
  return canonicalStringifyV1(left) === canonicalStringifyV1(right);
}

function targetBoundPackageFingerprintV1(
  value: TargetBoundFunctionalCorrespondencePackageV1,
): string {
  return sha256V1(canonicalStringifyV1({
    schemaVersion: TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1,
    package: value,
  }));
}

function decisionFingerprintV1(value: DecisionBodyV1): string {
  return sha256V1(canonicalStringifyV1(value));
}

function senseForUnitV1(
  attestation: SourceEntryAttestationV1,
  unit: TargetBoundFunctionalCorrespondenceComparisonUnitV1,
): { locator: string; text: string } | null {
  const entry = attestation.entries.find((candidate) => candidate.entryId === unit.sourceEntryId);
  const sense = entry?.senses.find((candidate) => candidate.senseId === unit.sourceSenseId);
  return sense ? { locator: sense.senseLocator, text: sense.text } : null;
}

function reviewFingerprintV1(value: TargetBlindReviewedSourceAttestationV1): string {
  return fingerprintTargetBoundReviewEnvelopeV1(value);
}

function validRationaleV1(value: unknown): value is TargetBoundCorrespondenceRationaleV1 {
  if (!isRecordV1(value) || !hasExactKeysV1(value, RATIONALE_KEYS_V1)) return false;
  return (
    typeof value.relationship === "string" &&
    RELATIONSHIPS_V1.has(value.relationship as TargetBoundCorrespondenceRationaleRelationshipV1) &&
    Array.isArray(value.limitations) &&
    value.limitations.every(exactTextV1) &&
    exactTextV1(value.text)
  );
}

function reviewV1(
  value: unknown,
  targetSensePresent: boolean,
): { ok: true; review: TargetBoundCorrespondenceReviewV1 } | { ok: false; reasonCodes: TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1[] } {
  if (!isRecordV1(value) || !hasExactKeysV1(value, REVIEW_KEYS_V1)) {
    return { ok: false, reasonCodes: ["REVIEW_STATE_INVALID"] };
  }
  if (value.reviewStatus === "NOT_REVIEWED") {
    if (
      value.verdict !== null ||
      value.reviewer !== null ||
      value.reviewerKind !== null ||
      value.reviewedAt !== null ||
      value.rationale !== null ||
      !Array.isArray(value.reasonCodes) ||
      value.reasonCodes.length !== 0
    ) {
      return { ok: false, reasonCodes: ["REVIEW_STATE_INVALID"] };
    }
    return {
      ok: true,
      review: {
        reviewStatus: "NOT_REVIEWED",
        verdict: null,
        reviewer: null,
        reviewerKind: null,
        reviewedAt: null,
        rationale: null,
        reasonCodes: Object.freeze([]),
      },
    };
  }

  if (value.reviewStatus !== "REVIEWED") {
    return { ok: false, reasonCodes: ["REVIEW_STATE_INVALID"] };
  }
  if (typeof value.verdict !== "string" || !REVIEW_VERDICTS_V1.has(value.verdict as ComparativeVerdictV0_1)) {
    return { ok: false, reasonCodes: ["VERDICT_INVALID"] };
  }
  if (!exactTextV1(value.reviewer) || value.reviewer.length > 200) {
    return { ok: false, reasonCodes: ["REVIEWER_REQUIRED", "REVIEWER_INVALID"] };
  }
  if (value.reviewerKind !== "HUMAN") {
    return { ok: false, reasonCodes: ["REVIEWER_KIND_INVALID"] };
  }
  if (!validDateV1(value.reviewedAt)) {
    return { ok: false, reasonCodes: ["REVIEWED_AT_REQUIRED", "REVIEWED_AT_INVALID"] };
  }
  if (!validRationaleV1(value.rationale)) {
    return { ok: false, reasonCodes: ["RATIONALE_INVALID"] };
  }
  if (
    !Array.isArray(value.reasonCodes) ||
    value.reasonCodes.some((reason) => !REVIEW_REASON_CODES_V1.has(reason as TargetBoundCorrespondenceReviewReasonCodeV1))
  ) {
    return { ok: false, reasonCodes: ["REASON_CODES_INVALID"] };
  }

  const verdict = value.verdict as ComparativeVerdictV0_1;
  const rationale = value.rationale as TargetBoundCorrespondenceRationaleV1;
  const reasonCodes = sortedUniqueV1(value.reasonCodes as TargetBoundCorrespondenceReviewReasonCodeV1[]);
  const requiredReason = {
    SUPPORTED: "REVIEWED_SUPPORT",
    PARTIALLY_SUPPORTED: "REVIEWED_PARTIAL_SUPPORT",
    UNSUPPORTED: "REVIEWED_NON_SUPPORT",
    UNKNOWN: targetSensePresent ? "INSUFFICIENT_AUTHORIZED_INFORMATION" : "TARGET_SENSE_UNBOUND",
    NULL: "NO_DEFENSIBLE_COMPARISON",
  }[verdict] as TargetBoundCorrespondenceReviewReasonCodeV1;
  const compatibleReasons = new Set<TargetBoundCorrespondenceReviewReasonCodeV1>([requiredReason]);
  if (verdict === "UNKNOWN" || verdict === "NULL") {
    compatibleReasons.add("SOURCE_SENSE_MATERIAL_MISSING");
  }

  const reasons = new Set<TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1>();
  if (
    !reasonCodes.includes(requiredReason) ||
    reasonCodes.some((reason) => !compatibleReasons.has(reason))
  ) {
    reasons.add("VERDICT_REASON_MISMATCH");
  }

  if (["SUPPORTED", "PARTIALLY_SUPPORTED", "UNSUPPORTED"].includes(verdict)) {
    if (!targetSensePresent) reasons.add("TARGET_SENSE_REQUIRED_FOR_POSITIVE_VERDICT");
  }

  const expectedRelationship = {
    SUPPORTED: "DIRECT",
    PARTIALLY_SUPPORTED: "PARTIAL",
    UNSUPPORTED: "NONE",
    UNKNOWN: "UNDETERMINED",
    NULL: "NOT_APPLICABLE",
  }[verdict];
  if (rationale.relationship !== expectedRelationship) reasons.add("RATIONALE_INVALID");
  if (verdict === "NULL" && rationale.limitations.length === 0) {
    reasons.add("RATIONALE_INVALID");
  }

  if (reasons.size > 0) return { ok: false, reasonCodes: [...reasons].sort() };
  return {
    ok: true,
    review: deepFreezeV1({
      reviewStatus: "REVIEWED",
      verdict,
      reviewer: value.reviewer as string,
      reviewerKind: "HUMAN",
      reviewedAt: value.reviewedAt as string,
      rationale: deepFreezeV1({
        relationship: rationale.relationship,
        limitations: Object.freeze([...rationale.limitations]),
        text: rationale.text,
      }),
      reasonCodes: Object.freeze(reasonCodes),
    }),
  };
}

function contextV1(
  packageValue: unknown,
  attestationValue: unknown,
  sourceReviewValue: unknown,
  unitId: string,
): { ok: true; context: ContextV1 } | { ok: false; reasonCodes: TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1[] } {
  const attestationResult = validateSourceEntryAttestationV1(attestationValue);
  if (!attestationResult.ok) return { ok: false, reasonCodes: ["TARGET_BOUND_PACKAGE_INVALID"] };
  const reviewResult = validateTargetBlindReviewedSourceAttestationV1(
    sourceReviewValue,
    attestationResult.attestation,
  );
  if (!reviewResult.ok || reviewResult.review.reviewDecision !== "accepted") {
    return { ok: false, reasonCodes: ["TARGET_BOUND_PACKAGE_INVALID"] };
  }
  const packageResult = validateTargetBoundFunctionalCorrespondenceV1(
    packageValue,
    attestationResult.attestation,
    reviewResult.review,
  );
  if (!packageResult.ok) return { ok: false, reasonCodes: ["TARGET_BOUND_PACKAGE_INVALID"] };

  const packageValueNormalized = packageResult.package;
  const unit = packageValueNormalized.comparisonUnits.find(
    (candidate) => candidate.comparisonUnitId === unitId,
  );
  if (!unit) return { ok: false, reasonCodes: ["COMPARISON_UNIT_NOT_FOUND"] };
  if (unit.review.reviewStatus !== "NOT_REVIEWED") {
    return { ok: false, reasonCodes: ["COMPARISON_UNIT_ALREADY_REVIEWED"] };
  }
  const sense = senseForUnitV1(attestationResult.attestation, unit);
  if (!sense) return { ok: false, reasonCodes: ["COMPARISON_UNIT_BINDING_MISMATCH"] };

  const sourceAttestationFingerprint = fingerprintSourceEntryAttestationV1(
    attestationResult.attestation,
  );
  const sourceReviewFingerprint = reviewFingerprintV1(reviewResult.review);
  const doctrineVoicePath = [...packageValueNormalized.targetInput.voicePath];
  if (!doctrineVoicePath.every((voice) => getSevenVoiceDoctrineFunctionalProfileV0_1(voice))) {
    return { ok: false, reasonCodes: ["DOCTRINE_PROFILE_INVALID"] };
  }

  return {
    ok: true,
    context: {
      unit,
      targetBoundPackageFingerprint: targetBoundPackageFingerprintV1(packageValueNormalized),
      sourceAttestationFingerprint,
      sourceReviewFingerprint,
      sourceSenseLocator: sense.locator,
      sourceSenseTextHash: sha256V1(sense.text),
      targetSenseBinding: packageValueNormalized.targetInput.targetSense === null
        ? "TARGET_SENSE_UNBOUND"
        : "TARGET_SENSE_PRESENT_USER_PROVIDED",
      doctrineVoicePath: Object.freeze(doctrineVoicePath),
    },
  };
}

function bodyV1(
  context: ContextV1,
  review: TargetBoundCorrespondenceReviewV1,
): DecisionBodyV1 {
  return {
    schemaVersion: TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1,
    targetBoundPackageFingerprint: context.targetBoundPackageFingerprint,
    comparisonUnitId: context.unit.comparisonUnitId,
    comparisonUnitFingerprint: context.unit.comparisonUnitFingerprint,
    targetInputFingerprint: context.unit.targetInputFingerprint,
    sourceAttestationId: context.unit.sourceAttestationId,
    sourceAttestationFingerprint: context.sourceAttestationFingerprint,
    sourceReviewFingerprint: context.sourceReviewFingerprint,
    sourceEntryId: context.unit.sourceEntryId,
    sourceSenseId: context.unit.sourceSenseId,
    sourceSenseLocator: context.sourceSenseLocator,
    sourceSenseTextHash: context.sourceSenseTextHash,
    doctrineProfileSchemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
    doctrineProfileEngineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
    doctrineProfileRegistry: TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_PROFILE_REGISTRY_V1,
    doctrineVoicePath: context.doctrineVoicePath,
    targetSenseBinding: context.targetSenseBinding,
    review,
    claimBoundary: "TARGET_BOUND_CORRESPONDENCE_REVIEW_ONLY",
    functionalAcceptance: "NOT_AUTHORIZED",
    historicalRelation: "NOT_CLAIMED",
    winnerClaim: "NOT_CLAIMED",
    productionMembership: "NOT_AUTHORIZED",
    runtimeAuthorization: "NOT_AUTHORIZED",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  };
}

function notReviewedV1(): TargetBoundCorrespondenceReviewV1 {
  return {
    reviewStatus: "NOT_REVIEWED",
    verdict: null,
    reviewer: null,
    reviewerKind: null,
    reviewedAt: null,
    rationale: null,
    reasonCodes: Object.freeze([]),
  };
}

export function buildTargetBoundCorrespondenceDecisionRuleV1(
  packageValue: unknown,
  attestationValue: unknown,
  sourceReviewValue: unknown,
  comparisonUnitId: string,
  reviewValue?: unknown,
): TargetBoundCorrespondenceDecisionRuleValidationResultV1 {
  return buildForUnitV1(
    packageValue,
    attestationValue,
    sourceReviewValue,
    comparisonUnitId,
    reviewValue,
  );
}

function buildForUnitV1(
  packageValue: unknown,
  attestationValue: unknown,
  sourceReviewValue: unknown,
  comparisonUnitId: string,
  reviewValue: unknown | undefined,
): TargetBoundCorrespondenceDecisionRuleValidationResultV1 {
  const contextResult = contextV1(
    packageValue,
    attestationValue,
    sourceReviewValue,
    comparisonUnitId,
  );
  if (!contextResult.ok) return { ok: false, reasonCodes: contextResult.reasonCodes };
  const reviewResult = reviewV1(
    reviewValue === undefined ? notReviewedV1() : reviewValue,
    contextResult.context.targetSenseBinding === "TARGET_SENSE_PRESENT_USER_PROVIDED",
  );
  if (!reviewResult.ok) return { ok: false, reasonCodes: reviewResult.reasonCodes };
  const body = deepFreezeV1(bodyV1(contextResult.context, reviewResult.review));
  return {
    ok: true,
    decision: deepFreezeV1({
      ...body,
      decisionFingerprint: decisionFingerprintV1(body),
    }),
  };
}

export function validateTargetBoundCorrespondenceDecisionRuleV1(
  value: unknown,
  packageValue: unknown,
  attestationValue: unknown,
  sourceReviewValue: unknown,
): TargetBoundCorrespondenceDecisionRuleValidationResultV1 {
  if (!isRecordV1(value)) return { ok: false, reasonCodes: ["INPUT_NOT_OBJECT"] };
  const reasons = new Set<TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1>();
  if (!hasExactKeysV1(value, DECISION_KEYS_V1)) reasons.add("UNEXPECTED_FIELD_PRESENT");
  if (hasForbiddenFieldV1(value)) reasons.add("FORBIDDEN_AUTHORITY_FIELD_PRESENT");
  if (value.schemaVersion !== TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1) {
    reasons.add("SCHEMA_VERSION_INVALID");
  }
  if (!exactTextV1(value.comparisonUnitId)) reasons.add("COMPARISON_UNIT_BINDING_MISMATCH");

  const contextResult = contextV1(
    packageValue,
    attestationValue,
    sourceReviewValue,
    exactTextV1(value.comparisonUnitId) ? value.comparisonUnitId : "",
  );
  if (!contextResult.ok) {
    for (const reason of contextResult.reasonCodes) reasons.add(reason);
  } else {
    const reviewResult = reviewV1(
      value.review,
      contextResult.context.targetSenseBinding === "TARGET_SENSE_PRESENT_USER_PROVIDED",
    );
    if (!reviewResult.ok) {
      for (const reason of reviewResult.reasonCodes) reasons.add(reason);
    } else {
      const expectedBody = bodyV1(contextResult.context, reviewResult.review);
      const expected = {
        ...expectedBody,
        decisionFingerprint: decisionFingerprintV1(expectedBody),
      };
      for (const field of [
        "targetBoundPackageFingerprint",
        "comparisonUnitFingerprint",
        "targetInputFingerprint",
        "sourceAttestationId",
        "sourceAttestationFingerprint",
        "sourceReviewFingerprint",
        "sourceEntryId",
        "sourceSenseId",
        "sourceSenseLocator",
        "sourceSenseTextHash",
      ] as const) {
        if (value[field] !== expected[field]) {
          reasons.add(field === "targetInputFingerprint"
            ? "TARGET_INPUT_FINGERPRINT_MISMATCH"
            : field === "sourceAttestationId"
              ? "SOURCE_ATTESTATION_ID_MISMATCH"
              : field === "sourceAttestationFingerprint"
                ? "SOURCE_ATTESTATION_FINGERPRINT_MISMATCH"
                : field === "sourceReviewFingerprint"
                  ? "SOURCE_REVIEW_FINGERPRINT_MISMATCH"
                  : field === "sourceEntryId"
                    ? "SOURCE_ENTRY_ID_MISMATCH"
                    : field === "sourceSenseId"
                      ? "SOURCE_SENSE_ID_MISMATCH"
                      : field === "sourceSenseLocator"
                        ? "SOURCE_SENSE_LOCATOR_MISMATCH"
                        : field === "sourceSenseTextHash"
                          ? "SOURCE_SENSE_TEXT_HASH_MISMATCH"
                          : field === "comparisonUnitFingerprint"
                            ? "COMPARISON_UNIT_BINDING_MISMATCH"
                            : "COMPARISON_UNIT_BINDING_MISMATCH");
        }
      }
      if (value.targetSenseBinding !== expected.targetSenseBinding) reasons.add("TARGET_SENSE_BINDING_MISMATCH");
      if (
        value.doctrineProfileSchemaVersion !== expected.doctrineProfileSchemaVersion ||
        value.doctrineProfileEngineAuthority !== expected.doctrineProfileEngineAuthority ||
        value.doctrineProfileRegistry !== expected.doctrineProfileRegistry ||
        !equalV1(value.doctrineVoicePath, expected.doctrineVoicePath)
      ) {
        reasons.add("DOCTRINE_PROFILE_PATH_MISMATCH");
      }
      if (
        value.claimBoundary !== expected.claimBoundary ||
        value.functionalAcceptance !== expected.functionalAcceptance ||
        value.historicalRelation !== expected.historicalRelation ||
        value.winnerClaim !== expected.winnerClaim ||
        value.productionMembership !== expected.productionMembership ||
        value.runtimeAuthorization !== expected.runtimeAuthorization ||
        value.userDecisionPosture !== expected.userDecisionPosture ||
        value.noSingleWinner !== expected.noSingleWinner
      ) {
        reasons.add("FORBIDDEN_AUTHORITY_FIELD_PRESENT");
      }
      if (!validSha256V1(value.decisionFingerprint)) {
        reasons.add("DECISION_FINGERPRINT_INVALID");
      } else if (value.decisionFingerprint !== expected.decisionFingerprint) {
        reasons.add("DECISION_FINGERPRINT_MISMATCH");
      }
    }
  }

  const sortedReasons = [...reasons].sort();
  if (sortedReasons.length > 0) return { ok: false, reasonCodes: sortedReasons };
  const expectedResult = buildForUnitV1(
    packageValue,
    attestationValue,
    sourceReviewValue,
    value.comparisonUnitId as string,
    value.review,
  );
  return expectedResult;
}

export function fingerprintTargetBoundCorrespondenceDecisionRuleV1(
  value: TargetBoundCorrespondenceDecisionRuleV1,
): string {
  if (!validSha256V1(value.decisionFingerprint)) {
    throw new Error("Cannot fingerprint an invalid correspondence decision");
  }
  const { decisionFingerprint: _decisionFingerprint, ...body } = value;
  return decisionFingerprintV1(body);
}
