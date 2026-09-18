import { createHash } from "node:crypto";

import {
  ENGINE_VERSION,
} from "../engineVersion";
import {
  STRUCTURAL_HYPOTHESIS_VERSION_V0_1,
} from "../structuralHypothesisDiscovery.v0_1";
import {
  isSevenVoiceKey,
  type SevenVoiceKey,
} from "../sevenVoiceOrderedViews.v0.1";
import {
  SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
  validateSourceEntryAttestationV1,
  type SourceEntryAttestationV1,
} from "./sourceEntryAttestation.v1";
import {
  fingerprintSourceEntryAttestationV1,
  TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
  validateTargetBlindReviewedSourceAttestationV1,
  type TargetBlindReviewedSourceAttestationV1,
} from "./targetBlindReviewedSourceAttestation.v1";
import type {
  ComparativeVerdictV0_1,
} from "./functionalRoleComparativeEvaluationContract.v0_1";

export const TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1 =
  "open-instrument.target-bound-functional-correspondence.v1" as const;

export type TargetBoundFunctionalCorrespondenceTargetSenseV1 = Readonly<{
  id: string;
  label: string;
}>;

export type TargetBoundFunctionalCorrespondenceTargetInputV1 = Readonly<{
  analysisId: string;
  targetWord: string;
  targetSense: TargetBoundFunctionalCorrespondenceTargetSenseV1 | null;
  structuralHypothesisId: string;
  embryo: string;
  voicePath: readonly SevenVoiceKey[];
  engineVersion: typeof ENGINE_VERSION;
  structuralHypothesisVersion: typeof STRUCTURAL_HYPOTHESIS_VERSION_V0_1;
}>;

export type TargetBoundFunctionalCorrespondenceSourceReviewReferenceV1 = Readonly<{
  attestationSchemaVersion: typeof SOURCE_ENTRY_ATTESTATION_SCHEMA_V1;
  reviewSchemaVersion: typeof TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1;
  attestationId: string;
  attestationFingerprint: string;
  reviewFingerprint: string;
  reviewDecision: "accepted";
  claimBoundary: "SOURCE_ATTESTATION_ONLY";
}>;

export type TargetBoundFunctionalCorrespondenceReviewStateV1 =
  | Readonly<{
      reviewStatus: "NOT_REVIEWED";
      verdict: null;
      reviewer: null;
      reviewedAt: null;
    }>
  | Readonly<{
      reviewStatus: "REVIEWED";
      verdict: ComparativeVerdictV0_1;
      reviewer: string;
      reviewedAt: string;
    }>;

export type TargetBoundFunctionalCorrespondenceComparisonUnitV1 = Readonly<{
  comparisonUnitId: string;
  comparisonUnitFingerprint: string;
  sourceAttestationId: string;
  sourceAttestationFingerprint: string;
  sourceEntryId: string;
  sourceSenseId: string;
  sourceOrder: Readonly<{
    entryIndex: number;
    senseIndex: number;
    ordinal: number;
  }>;
  targetInputFingerprint: string;
  review: TargetBoundFunctionalCorrespondenceReviewStateV1;
}>;

export type TargetBoundFunctionalCorrespondencePackageV1 = Readonly<{
  schemaVersion: typeof TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1;
  targetInput: TargetBoundFunctionalCorrespondenceTargetInputV1;
  targetInputFingerprint: string;
  sourceReview: TargetBoundFunctionalCorrespondenceSourceReviewReferenceV1;
  sourceEntrySelectionStatus: SourceEntryAttestationV1["entrySelectionStatus"];
  selectedEntryId: null;
  selectedSenseIds: readonly [];
  comparisonUnits: readonly TargetBoundFunctionalCorrespondenceComparisonUnitV1[];
  comparisonUnitCount: number;
  correspondenceState: "NOT_REVIEWED";
  functionalAcceptance: "NOT_AUTHORIZED";
  historicalRelation: "NOT_CLAIMED";
  winnerClaim: "NOT_CLAIMED";
  productionMembership: "NOT_AUTHORIZED";
  runtimeAuthorization: "NOT_AUTHORIZED";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type TargetBoundFunctionalCorrespondenceReasonCodeV1 =
  | "INPUT_NOT_OBJECT"
  | "UNEXPECTED_FIELD_PRESENT"
  | "FORBIDDEN_AUTHORITY_FIELD_PRESENT"
  | "SCHEMA_VERSION_INVALID"
  | "TARGET_INPUT_INVALID"
  | "TARGET_INPUT_FINGERPRINT_INVALID"
  | "TARGET_INPUT_FINGERPRINT_MISMATCH"
  | "SOURCE_ATTESTATION_INVALID"
  | "SOURCE_REVIEW_INVALID"
  | "SOURCE_REVIEW_NOT_ACCEPTED"
  | "SOURCE_ATTESTATION_ID_MISMATCH"
  | "SOURCE_ATTESTATION_FINGERPRINT_INVALID"
  | "SOURCE_ATTESTATION_FINGERPRINT_MISMATCH"
  | "SOURCE_REVIEW_FINGERPRINT_INVALID"
  | "SOURCE_REVIEW_FINGERPRINT_MISMATCH"
  | "SOURCE_SELECTION_INVALID"
  | "COMPARISON_UNIT_COUNT_MISMATCH"
  | "COMPARISON_UNIT_INVALID"
  | "COMPARISON_UNIT_ORDER_MISMATCH"
  | "COMPARISON_UNIT_IDENTITY_MISMATCH"
  | "COMPARISON_UNIT_FINGERPRINT_MISMATCH"
  | "COMPARISON_REVIEW_STATE_INVALID"
  | "FUNCTIONAL_AUTHORITY_PRESENT"
  | "HISTORICAL_AUTHORITY_PRESENT"
  | "WINNER_AUTHORITY_PRESENT"
  | "RUNTIME_AUTHORITY_PRESENT";

export type TargetBoundFunctionalCorrespondenceValidationResultV1 = Readonly<
  | {
      ok: true;
      package: TargetBoundFunctionalCorrespondencePackageV1;
    }
  | {
      ok: false;
      reasonCodes: readonly TargetBoundFunctionalCorrespondenceReasonCodeV1[];
    }
>;

const PACKAGE_KEYS_V1 = [
  "schemaVersion",
  "targetInput",
  "targetInputFingerprint",
  "sourceReview",
  "sourceEntrySelectionStatus",
  "selectedEntryId",
  "selectedSenseIds",
  "comparisonUnits",
  "comparisonUnitCount",
  "correspondenceState",
  "functionalAcceptance",
  "historicalRelation",
  "winnerClaim",
  "productionMembership",
  "runtimeAuthorization",
  "userDecisionPosture",
  "noSingleWinner",
] as const;

const TARGET_INPUT_KEYS_V1 = [
  "analysisId",
  "targetWord",
  "targetSense",
  "structuralHypothesisId",
  "embryo",
  "voicePath",
  "engineVersion",
  "structuralHypothesisVersion",
] as const;

const TARGET_SENSE_KEYS_V1 = ["id", "label"] as const;

const SOURCE_REVIEW_KEYS_V1 = [
  "attestationSchemaVersion",
  "reviewSchemaVersion",
  "attestationId",
  "attestationFingerprint",
  "reviewFingerprint",
  "reviewDecision",
  "claimBoundary",
] as const;

const UNIT_KEYS_V1 = [
  "comparisonUnitId",
  "comparisonUnitFingerprint",
  "sourceAttestationId",
  "sourceAttestationFingerprint",
  "sourceEntryId",
  "sourceSenseId",
  "sourceOrder",
  "targetInputFingerprint",
  "review",
] as const;

const SOURCE_ORDER_KEYS_V1 = ["entryIndex", "senseIndex", "ordinal"] as const;
const REVIEW_KEYS_V1 = ["reviewStatus", "verdict", "reviewer", "reviewedAt"] as const;

const FORBIDDEN_FIELDS_V1 = new Set([
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
  "targetMeaning",
  "targetCandidate",
  "selectedSenseId",
]);

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeysV1(
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expected].sort());
}

function hasForbiddenFieldV1(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasForbiddenFieldV1);
  if (!isRecordV1(value)) return false;
  return Object.entries(value).some(
    ([key, child]) => FORBIDDEN_FIELDS_V1.has(key) || hasForbiddenFieldV1(child),
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

function sha256V1(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function canonicalStringifyV1(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalStringifyV1).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${canonicalStringifyV1(record[key])}`)
    .join(",")}}`;
}

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return Object.freeze(value);
}

function sortedReasonsV1(
  reasons: Iterable<TargetBoundFunctionalCorrespondenceReasonCodeV1>,
): TargetBoundFunctionalCorrespondenceReasonCodeV1[] {
  return [...new Set(reasons)].sort();
}

function validSha256V1(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function validDateV1(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/u.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  const [year, month, day] = value.split("-").map(Number);
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

type SourceOrderV1 = Readonly<{
  entryIndex: number;
  senseIndex: number;
  ordinal: number;
}>;

function sourceOrderIsValidV1(value: unknown): value is SourceOrderV1 {
  return (
    isRecordV1(value) &&
    hasExactKeysV1(value, SOURCE_ORDER_KEYS_V1) &&
    typeof value.entryIndex === "number" &&
    Number.isInteger(value.entryIndex) &&
    value.entryIndex >= 0 &&
    typeof value.senseIndex === "number" &&
    Number.isInteger(value.senseIndex) &&
    value.senseIndex >= 0 &&
    typeof value.ordinal === "number" &&
    Number.isInteger(value.ordinal) &&
    value.ordinal >= 0
  );
}

function cloneTargetInputV1(
  value: TargetBoundFunctionalCorrespondenceTargetInputV1,
): TargetBoundFunctionalCorrespondenceTargetInputV1 {
  return {
    analysisId: value.analysisId,
    targetWord: value.targetWord,
    targetSense: value.targetSense ? { ...value.targetSense } : null,
    structuralHypothesisId: value.structuralHypothesisId,
    embryo: value.embryo,
    voicePath: [...value.voicePath],
    engineVersion: value.engineVersion,
    structuralHypothesisVersion: value.structuralHypothesisVersion,
  };
}

function targetInputIsValidV1(
  value: unknown,
): value is TargetBoundFunctionalCorrespondenceTargetInputV1 {
  if (!isRecordV1(value) || !hasExactKeysV1(value, TARGET_INPUT_KEYS_V1)) {
    return false;
  }
  const targetSense = value.targetSense;
  return (
    exactTextV1(value.analysisId) &&
    exactTextV1(value.targetWord) &&
    (targetSense === null ||
      (isRecordV1(targetSense) &&
        hasExactKeysV1(targetSense, TARGET_SENSE_KEYS_V1) &&
        exactTextV1(targetSense.id) &&
        exactTextV1(targetSense.label))) &&
    exactTextV1(value.structuralHypothesisId) &&
    exactTextV1(value.embryo) &&
    Array.isArray(value.voicePath) &&
    value.voicePath.length > 0 &&
    value.voicePath.every(
      (voice) => typeof voice === "string" && isSevenVoiceKey(voice),
    ) &&
    value.engineVersion === ENGINE_VERSION &&
    value.structuralHypothesisVersion === STRUCTURAL_HYPOTHESIS_VERSION_V0_1
  );
}

function reviewFingerprintV1(
  review: TargetBlindReviewedSourceAttestationV1,
): string {
  return sha256V1(canonicalStringifyV1(review));
}

export function fingerprintTargetBoundReviewEnvelopeV1(
  review: TargetBlindReviewedSourceAttestationV1,
): string {
  return reviewFingerprintV1(review);
}

export function fingerprintTargetBoundInputV1(
  value: TargetBoundFunctionalCorrespondenceTargetInputV1,
): string {
  if (!targetInputIsValidV1(value)) {
    throw new Error("Cannot fingerprint an invalid target-bound input");
  }
  return sha256V1(
    canonicalStringifyV1({
      schemaVersion: TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1,
      targetInput: value,
    }),
  );
}

function unitIdPartV1(value: string): string {
  return `${value.length}:${value}`;
}

function buildComparisonUnitsV1(
  targetInput: TargetBoundFunctionalCorrespondenceTargetInputV1,
  targetInputFingerprint: string,
  attestation: SourceEntryAttestationV1,
  attestationFingerprint: string,
): readonly TargetBoundFunctionalCorrespondenceComparisonUnitV1[] {
  const units: TargetBoundFunctionalCorrespondenceComparisonUnitV1[] = [];
  let ordinal = 0;
  for (const [entryIndex, entry] of attestation.entries.entries()) {
    for (const [senseIndex, sense] of entry.senses.entries()) {
      const sourceOrder = { entryIndex, senseIndex, ordinal };
      const identity = {
        schemaVersion: TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1,
        targetInputFingerprint,
        sourceAttestationId: attestation.attestationId,
        sourceAttestationFingerprint: attestationFingerprint,
        sourceEntryId: entry.entryId,
        sourceSenseId: sense.senseId,
        sourceOrder,
      };
      const comparisonUnitFingerprint = sha256V1(canonicalStringifyV1(identity));
      const comparisonUnitId =
        `target-bound-comparison-unit:${unitIdPartV1(targetInputFingerprint)}:${unitIdPartV1(
          attestationFingerprint,
        )}:${unitIdPartV1(entry.entryId)}:${unitIdPartV1(sense.senseId)}`;
      units.push({
        comparisonUnitId,
        comparisonUnitFingerprint,
        sourceAttestationId: attestation.attestationId,
        sourceAttestationFingerprint: attestationFingerprint,
        sourceEntryId: entry.entryId,
        sourceSenseId: sense.senseId,
        sourceOrder,
        targetInputFingerprint,
        review: {
          reviewStatus: "NOT_REVIEWED",
          verdict: null,
          reviewer: null,
          reviewedAt: null,
        },
      });
      ordinal += 1;
    }
  }
  return units;
}

function sourceReviewReferenceV1(
  attestation: SourceEntryAttestationV1,
  review: TargetBlindReviewedSourceAttestationV1,
  attestationFingerprint: string,
): TargetBoundFunctionalCorrespondenceSourceReviewReferenceV1 {
  return {
    attestationSchemaVersion: SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
    reviewSchemaVersion: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
    attestationId: attestation.attestationId,
    attestationFingerprint,
    reviewFingerprint: reviewFingerprintV1(review),
    reviewDecision: "accepted",
    claimBoundary: "SOURCE_ATTESTATION_ONLY",
  };
}

function packageV1(
  targetInput: TargetBoundFunctionalCorrespondenceTargetInputV1,
  attestation: SourceEntryAttestationV1,
  review: TargetBlindReviewedSourceAttestationV1,
): TargetBoundFunctionalCorrespondencePackageV1 {
  const targetInputFingerprint = fingerprintTargetBoundInputV1(targetInput);
  const attestationFingerprint = fingerprintSourceEntryAttestationV1(attestation);
  const comparisonUnits = buildComparisonUnitsV1(
    targetInput,
    targetInputFingerprint,
    attestation,
    attestationFingerprint,
  );
  return deepFreezeV1({
    schemaVersion: TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1,
    targetInput: cloneTargetInputV1(targetInput),
    targetInputFingerprint,
    sourceReview: sourceReviewReferenceV1(
      attestation,
      review,
      attestationFingerprint,
    ),
    sourceEntrySelectionStatus: attestation.entrySelectionStatus,
    selectedEntryId: null,
    selectedSenseIds: Object.freeze([]),
    comparisonUnits,
    comparisonUnitCount: comparisonUnits.length,
    correspondenceState: "NOT_REVIEWED",
    functionalAcceptance: "NOT_AUTHORIZED",
    historicalRelation: "NOT_CLAIMED",
    winnerClaim: "NOT_CLAIMED",
    productionMembership: "NOT_AUTHORIZED",
    runtimeAuthorization: "NOT_AUTHORIZED",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  });
}

export function buildTargetBoundFunctionalCorrespondenceV1(
  targetInputValue: unknown,
  attestationValue: unknown,
  reviewValue: unknown,
): TargetBoundFunctionalCorrespondenceValidationResultV1 {
  if (!targetInputIsValidV1(targetInputValue)) {
    return { ok: false, reasonCodes: ["TARGET_INPUT_INVALID"] };
  }

  const attestationResult = validateSourceEntryAttestationV1(attestationValue);
  if (!attestationResult.ok) {
    return { ok: false, reasonCodes: ["SOURCE_ATTESTATION_INVALID"] };
  }

  const reviewResult = validateTargetBlindReviewedSourceAttestationV1(
    reviewValue,
    attestationResult.attestation,
  );
  if (!reviewResult.ok) {
    return { ok: false, reasonCodes: ["SOURCE_REVIEW_INVALID"] };
  }
  if (reviewResult.review.reviewDecision !== "accepted") {
    return { ok: false, reasonCodes: ["SOURCE_REVIEW_NOT_ACCEPTED"] };
  }

  return {
    ok: true,
    package: packageV1(
      targetInputValue,
      attestationResult.attestation,
      reviewResult.review,
    ),
  };
}

function reviewStateIsValidV1(value: unknown): boolean {
  if (!isRecordV1(value) || !hasExactKeysV1(value, REVIEW_KEYS_V1)) return false;
  if (value.reviewStatus === "NOT_REVIEWED") {
    return value.verdict === null && value.reviewer === null && value.reviewedAt === null;
  }
  return (
    value.reviewStatus === "REVIEWED" &&
    typeof value.verdict === "string" &&
    new Set(["SUPPORTED", "PARTIALLY_SUPPORTED", "UNSUPPORTED", "UNKNOWN", "NULL"]).has(
      value.verdict,
    ) &&
    exactTextV1(value.reviewer) &&
    validDateV1(value.reviewedAt)
  );
}

function sourceReviewReferenceIsValidV1(
  value: unknown,
): value is TargetBoundFunctionalCorrespondenceSourceReviewReferenceV1 {
  return (
    isRecordV1(value) &&
    hasExactKeysV1(value, SOURCE_REVIEW_KEYS_V1) &&
    value.attestationSchemaVersion === SOURCE_ENTRY_ATTESTATION_SCHEMA_V1 &&
    value.reviewSchemaVersion === TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1 &&
    exactTextV1(value.attestationId) &&
    validSha256V1(value.attestationFingerprint) &&
    validSha256V1(value.reviewFingerprint) &&
    value.reviewDecision === "accepted" &&
    value.claimBoundary === "SOURCE_ATTESTATION_ONLY"
  );
}

function comparisonUnitIsValidV1(value: unknown): boolean {
  if (!isRecordV1(value) || !hasExactKeysV1(value, UNIT_KEYS_V1)) return false;
  const sourceOrder = value.sourceOrder;
  return (
    exactTextV1(value.comparisonUnitId) &&
    validSha256V1(value.comparisonUnitFingerprint) &&
    exactTextV1(value.sourceAttestationId) &&
    validSha256V1(value.sourceAttestationFingerprint) &&
    exactTextV1(value.sourceEntryId) &&
    exactTextV1(value.sourceSenseId) &&
    sourceOrderIsValidV1(sourceOrder) &&
    validSha256V1(value.targetInputFingerprint) &&
    reviewStateIsValidV1(value.review)
  );
}

export function validateTargetBoundFunctionalCorrespondenceV1(
  value: unknown,
  attestationValue: unknown,
  reviewValue: unknown,
): TargetBoundFunctionalCorrespondenceValidationResultV1 {
  if (!isRecordV1(value)) return { ok: false, reasonCodes: ["INPUT_NOT_OBJECT"] };

  const reasons = new Set<TargetBoundFunctionalCorrespondenceReasonCodeV1>();
  if (!hasExactKeysV1(value, PACKAGE_KEYS_V1)) reasons.add("UNEXPECTED_FIELD_PRESENT");
  if (hasForbiddenFieldV1(value)) reasons.add("FORBIDDEN_AUTHORITY_FIELD_PRESENT");
  if (value.schemaVersion !== TARGET_BOUND_FUNCTIONAL_CORRESPONDENCE_SCHEMA_V1) {
    reasons.add("SCHEMA_VERSION_INVALID");
  }
  if (!targetInputIsValidV1(value.targetInput)) reasons.add("TARGET_INPUT_INVALID");
  if (!validSha256V1(value.targetInputFingerprint)) {
    reasons.add("TARGET_INPUT_FINGERPRINT_INVALID");
  }
  if (!sourceReviewReferenceIsValidV1(value.sourceReview)) {
    reasons.add("SOURCE_REVIEW_INVALID");
  }
  if (
    value.sourceEntrySelectionStatus !== "NOT_APPLICABLE" &&
    value.sourceEntrySelectionStatus !== "UNRESOLVED"
  ) {
    reasons.add("SOURCE_SELECTION_INVALID");
  }
  if (value.selectedEntryId !== null || !Array.isArray(value.selectedSenseIds) || value.selectedSenseIds.length !== 0) {
    reasons.add("SOURCE_SELECTION_INVALID");
  }
  if (!Array.isArray(value.comparisonUnits)) {
    reasons.add("COMPARISON_UNIT_INVALID");
  } else {
    if (value.comparisonUnitCount !== value.comparisonUnits.length) {
      reasons.add("COMPARISON_UNIT_COUNT_MISMATCH");
    }
    if (!value.comparisonUnits.every(comparisonUnitIsValidV1)) {
      reasons.add("COMPARISON_UNIT_INVALID");
    }
  }
  if (value.correspondenceState !== "NOT_REVIEWED") {
    reasons.add("COMPARISON_REVIEW_STATE_INVALID");
  }
  if (value.functionalAcceptance !== "NOT_AUTHORIZED") {
    reasons.add("FUNCTIONAL_AUTHORITY_PRESENT");
  }
  if (value.historicalRelation !== "NOT_CLAIMED") {
    reasons.add("HISTORICAL_AUTHORITY_PRESENT");
  }
  if (value.winnerClaim !== "NOT_CLAIMED") reasons.add("WINNER_AUTHORITY_PRESENT");
  if (
    value.productionMembership !== "NOT_AUTHORIZED" ||
    value.runtimeAuthorization !== "NOT_AUTHORIZED"
  ) {
    reasons.add("RUNTIME_AUTHORITY_PRESENT");
  }
  if (value.userDecisionPosture !== "user_decides" || value.noSingleWinner !== true) {
    reasons.add("COMPARISON_REVIEW_STATE_INVALID");
  }

  const attestationResult = validateSourceEntryAttestationV1(attestationValue);
  const reviewResult = attestationResult.ok
    ? validateTargetBlindReviewedSourceAttestationV1(reviewValue, attestationResult.attestation)
    : null;
  if (!attestationResult.ok) reasons.add("SOURCE_ATTESTATION_INVALID");
  if (!reviewResult?.ok) reasons.add("SOURCE_REVIEW_INVALID");
  if (reviewResult?.ok && reviewResult.review.reviewDecision !== "accepted") {
    reasons.add("SOURCE_REVIEW_NOT_ACCEPTED");
  }

  if (attestationResult.ok && reviewResult?.ok) {
    const attestationFingerprint = fingerprintSourceEntryAttestationV1(attestationResult.attestation);
    const currentReviewFingerprint = reviewFingerprintV1(reviewResult.review);
    if (sourceReviewReferenceIsValidV1(value.sourceReview)) {
      if (value.sourceReview.attestationId !== attestationResult.attestation.attestationId) {
        reasons.add("SOURCE_ATTESTATION_ID_MISMATCH");
      }
      if (value.sourceReview.attestationFingerprint !== attestationFingerprint) {
        reasons.add("SOURCE_ATTESTATION_FINGERPRINT_MISMATCH");
      }
      if (value.sourceReview.reviewFingerprint !== currentReviewFingerprint) {
        reasons.add("SOURCE_REVIEW_FINGERPRINT_MISMATCH");
      }
    }

    if (targetInputIsValidV1(value.targetInput)) {
      const targetInputFingerprint = fingerprintTargetBoundInputV1(value.targetInput);
      if (value.targetInputFingerprint !== targetInputFingerprint) {
        reasons.add("TARGET_INPUT_FINGERPRINT_MISMATCH");
      }
      const expectedUnits = buildComparisonUnitsV1(
        value.targetInput,
        targetInputFingerprint,
        attestationResult.attestation,
        attestationFingerprint,
      );
      const actualUnits = Array.isArray(value.comparisonUnits) ? value.comparisonUnits : [];
      if (actualUnits.length !== expectedUnits.length) {
        reasons.add("COMPARISON_UNIT_COUNT_MISMATCH");
      }
      for (const [index, expected] of expectedUnits.entries()) {
        const actual = actualUnits[index];
        if (!comparisonUnitIsValidV1(actual)) {
          reasons.add("COMPARISON_UNIT_INVALID");
          continue;
        }
        if (
          actual.sourceEntryId !== expected.sourceEntryId ||
          actual.sourceSenseId !== expected.sourceSenseId ||
          JSON.stringify(actual.sourceOrder) !== JSON.stringify(expected.sourceOrder)
        ) {
          reasons.add("COMPARISON_UNIT_ORDER_MISMATCH");
        }
        if (
          actual.comparisonUnitId !== expected.comparisonUnitId ||
          actual.targetInputFingerprint !== expected.targetInputFingerprint ||
          actual.sourceAttestationFingerprint !== expected.sourceAttestationFingerprint
        ) {
          reasons.add("COMPARISON_UNIT_IDENTITY_MISMATCH");
        }
        if (actual.comparisonUnitFingerprint !== expected.comparisonUnitFingerprint) {
          reasons.add("COMPARISON_UNIT_FINGERPRINT_MISMATCH");
        }
      }
    }
  }

  const sortedReasons = sortedReasonsV1(reasons);
  if (sortedReasons.length > 0) return { ok: false, reasonCodes: sortedReasons };
  return {
    ok: true,
    package: deepFreezeV1(value as TargetBoundFunctionalCorrespondencePackageV1),
  };
}
