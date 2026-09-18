import { createHash } from "node:crypto";

import {
  SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
  validateSourceEntryAttestationV1,
  type SourceEntryAttestationV1,
} from "./sourceEntryAttestation.v1";

export const TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1 =
  "open-instrument.target-blind-reviewed-source-attestation.v1" as const;

export type TargetBlindReviewedSourceAttestationDecisionV1 =
  | "pending"
  | "accepted"
  | "rejected";

export type TargetBlindReviewedSourceAttestationReasonCodeV1 =
  | "REVIEW_DEFERRED"
  | "SOURCE_ATTESTATION_INVALID"
  | "SOURCE_FORM_NOT_EXACT"
  | "SOURCE_PROVENANCE_INSUFFICIENT"
  | "SOURCE_ENTRY_INVENTORY_INCOMPLETE"
  | "EDITORIAL_ONLY_CONTENT";

export type TargetBlindReviewedSourceAttestationV1 = Readonly<{
  schemaVersion:
    typeof TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1;
  attestationSchemaVersion: typeof SOURCE_ENTRY_ATTESTATION_SCHEMA_V1;
  attestationId: string;
  attestationFingerprint: string;
  reviewDecision: TargetBlindReviewedSourceAttestationDecisionV1;
  reviewer: string | null;
  reviewedAt: string | null;
  reasonCodes: readonly TargetBlindReviewedSourceAttestationReasonCodeV1[];
  claimBoundary: "SOURCE_ATTESTATION_ONLY";
}>;

export type TargetBlindReviewedSourceAttestationValidationReasonCodeV1 =
  | "INPUT_NOT_RECORD"
  | "UNEXPECTED_FIELD_PRESENT"
  | "FORBIDDEN_FIELD_PRESENT"
  | "SCHEMA_VERSION_INVALID"
  | "ATTESTATION_SCHEMA_VERSION_INVALID"
  | "ATTESTATION_ID_INVALID"
  | "ATTESTATION_INVALID"
  | "ATTESTATION_ID_MISMATCH"
  | "ATTESTATION_FINGERPRINT_INVALID"
  | "ATTESTATION_FINGERPRINT_MISMATCH"
  | "REVIEW_DECISION_INVALID"
  | "REVIEWER_REQUIRED"
  | "REVIEWER_INVALID"
  | "REVIEWED_AT_REQUIRED"
  | "REVIEWED_AT_INVALID"
  | "REASON_CODES_INVALID"
  | "PRESELECTED_ENTRY_OR_SENSE"
  | "REASON_REQUIRED_FOR_REJECTED"
  | "REVIEW_DEFERRED_REASON_REQUIRED"
  | "FINAL_DECISION_REASON_INVALID"
  | "CLAIM_BOUNDARY_INVALID";

export type TargetBlindReviewedSourceAttestationValidationResultV1 = Readonly<
  | {
      ok: true;
      review: TargetBlindReviewedSourceAttestationV1;
    }
  | {
      ok: false;
      reasonCodes: readonly TargetBlindReviewedSourceAttestationValidationReasonCodeV1[];
    }
>;

const REVIEW_KEYS_V1 = [
  "schemaVersion",
  "attestationSchemaVersion",
  "attestationId",
  "attestationFingerprint",
  "reviewDecision",
  "reviewer",
  "reviewedAt",
  "reasonCodes",
  "claimBoundary",
] as const;

const REVIEW_DECISIONS_V1 = new Set<TargetBlindReviewedSourceAttestationDecisionV1>([
  "pending",
  "accepted",
  "rejected",
]);

const REVIEW_REASON_CODES_V1 = new Set<TargetBlindReviewedSourceAttestationReasonCodeV1>([
  "REVIEW_DEFERRED",
  "SOURCE_ATTESTATION_INVALID",
  "SOURCE_FORM_NOT_EXACT",
  "SOURCE_PROVENANCE_INSUFFICIENT",
  "SOURCE_ENTRY_INVENTORY_INCOMPLETE",
  "EDITORIAL_ONLY_CONTENT",
]);

const FORBIDDEN_FIELDS_V1 = new Set([
  "targetWord",
  "targetSense",
  "targetSenseId",
  "targetMeaning",
  "structuralInput",
  "structuralAnalysis",
  "targetCandidate",
  "semanticBridge",
  "functionalCorrespondence",
  "functionalAcceptance",
  "historicalRelation",
  "historicalOrigin",
  "historicalTransmission",
  "winner",
  "winnerClaim",
  "languageSuperiority",
  "languageSuperiorityClaim",
  "runtimeAuthorization",
  "productionMembership",
  "providerOutput",
]);

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeysV1(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  return JSON.stringify(Object.keys(value).sort()) ===
    JSON.stringify([...expectedKeys].sort());
}

function hasForbiddenFieldV1(
  value: unknown,
  seen = new WeakSet<object>(),
): boolean {
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return false;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.some((child) => hasForbiddenFieldV1(child, seen));
  }

  return Object.entries(value).some(
    ([key, child]) =>
      FORBIDDEN_FIELDS_V1.has(key) || hasForbiddenFieldV1(child, seen),
  );
}

function validTextV1(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length > 0 &&
    value === value.trim() &&
    value === value.normalize("NFC")
  );
}

function validReviewerV1(value: unknown): value is string {
  return validTextV1(value) && value.length <= 200;
}

function validReviewDateV1(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/u.test(value) ||
    value !== value.trim()
  ) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  if (year < 1) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
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
  if (typeof value !== "object" || value === null || seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return Object.freeze(value);
}

function sortedReasonCodesV1(
  values: Iterable<TargetBlindReviewedSourceAttestationReasonCodeV1>,
): TargetBlindReviewedSourceAttestationReasonCodeV1[] {
  return [...new Set(values)].sort();
}

function sha256V1(value: string): string {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

export function fingerprintSourceEntryAttestationV1(
  value: SourceEntryAttestationV1,
): string {
  const validated = validateSourceEntryAttestationV1(value);
  if (!validated.ok) {
    throw new Error("Cannot fingerprint an invalid source attestation");
  }
  return sha256V1(canonicalStringifyV1(validated.attestation));
}

export function validateTargetBlindReviewedSourceAttestationV1(
  value: unknown,
  attestation: unknown,
): TargetBlindReviewedSourceAttestationValidationResultV1 {
  if (!isRecordV1(value)) {
    return deepFreezeV1({ ok: false, reasonCodes: ["INPUT_NOT_RECORD"] });
  }

  const reasons = new Set<TargetBlindReviewedSourceAttestationValidationReasonCodeV1>();
  if (!hasExactKeysV1(value, REVIEW_KEYS_V1)) {
    reasons.add("UNEXPECTED_FIELD_PRESENT");
  }
  if (hasForbiddenFieldV1(value)) {
    reasons.add("FORBIDDEN_FIELD_PRESENT");
  }
  if (value.schemaVersion !== TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1) {
    reasons.add("SCHEMA_VERSION_INVALID");
  }
  if (value.attestationSchemaVersion !== SOURCE_ENTRY_ATTESTATION_SCHEMA_V1) {
    reasons.add("ATTESTATION_SCHEMA_VERSION_INVALID");
  }
  if (!validTextV1(value.attestationId)) {
    reasons.add("ATTESTATION_ID_INVALID");
  }
  if (!/^[0-9a-f]{64}$/u.test(String(value.attestationFingerprint ?? ""))) {
    reasons.add("ATTESTATION_FINGERPRINT_INVALID");
  }
  if (!REVIEW_DECISIONS_V1.has(value.reviewDecision as TargetBlindReviewedSourceAttestationDecisionV1)) {
    reasons.add("REVIEW_DECISION_INVALID");
  }
  if (value.reviewer !== null && !validReviewerV1(value.reviewer)) {
    reasons.add("REVIEWER_INVALID");
  }
  if (value.reviewedAt !== null && !validReviewDateV1(value.reviewedAt)) {
    reasons.add("REVIEWED_AT_INVALID");
  }
  if (
    !Array.isArray(value.reasonCodes) ||
    Object.keys(value.reasonCodes).length !== value.reasonCodes.length ||
    value.reasonCodes.some(
      (reasonCode) =>
        !REVIEW_REASON_CODES_V1.has(
          reasonCode as TargetBlindReviewedSourceAttestationReasonCodeV1,
        ),
    )
  ) {
    reasons.add("REASON_CODES_INVALID");
  }
  if (value.claimBoundary !== "SOURCE_ATTESTATION_ONLY") {
    reasons.add("CLAIM_BOUNDARY_INVALID");
  }

  const attestationResult = validateSourceEntryAttestationV1(attestation);
  if (!attestationResult.ok) {
    reasons.add("ATTESTATION_INVALID");
  } else {
    const normalizedAttestation = attestationResult.attestation;
    if (
      normalizedAttestation.selectedEntryId !== null ||
      normalizedAttestation.entrySelectionStatus === "EXPLICITLY_RESOLVED" ||
      normalizedAttestation.entries.some(
        (entry) =>
          entry.selectedSenseId !== null ||
          entry.senseSelectionStatus === "EXPLICITLY_RESOLVED",
      )
    ) {
      reasons.add("PRESELECTED_ENTRY_OR_SENSE");
    }
    if (value.attestationId !== normalizedAttestation.attestationId) {
      reasons.add("ATTESTATION_ID_MISMATCH");
    }
    if (
      value.attestationFingerprint !==
      fingerprintSourceEntryAttestationV1(normalizedAttestation)
    ) {
      reasons.add("ATTESTATION_FINGERPRINT_MISMATCH");
    }
  }

  const decision = value.reviewDecision;
  const reasonCodes = Array.isArray(value.reasonCodes)
    ? value.reasonCodes as TargetBlindReviewedSourceAttestationReasonCodeV1[]
    : [];

  if (decision === "accepted" || decision === "rejected") {
    if (!validReviewerV1(value.reviewer)) reasons.add("REVIEWER_REQUIRED");
    if (!validReviewDateV1(value.reviewedAt)) reasons.add("REVIEWED_AT_REQUIRED");
  }
  if (decision === "rejected" && reasonCodes.length === 0) {
    reasons.add("REASON_REQUIRED_FOR_REJECTED");
  }
  if (decision === "pending") {
    if (value.reviewer !== null || value.reviewedAt !== null) {
      reasons.add("FINAL_DECISION_REASON_INVALID");
    }
    if (reasonCodes.length !== 1 || reasonCodes[0] !== "REVIEW_DEFERRED") {
      reasons.add("REVIEW_DEFERRED_REASON_REQUIRED");
    }
  }
  if (decision === "accepted" && reasonCodes.length > 0) {
    reasons.add("FINAL_DECISION_REASON_INVALID");
  }
  if (
    decision === "rejected" &&
    reasonCodes.includes("REVIEW_DEFERRED")
  ) {
    reasons.add("FINAL_DECISION_REASON_INVALID");
  }

  const sortedReasons = [...new Set(reasons)].sort();
  if (sortedReasons.length > 0) {
    return deepFreezeV1({ ok: false, reasonCodes: sortedReasons });
  }

  return deepFreezeV1({
    ok: true,
    review: deepFreezeV1({
      schemaVersion: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
      attestationSchemaVersion: SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
      attestationId: value.attestationId as string,
      attestationFingerprint: value.attestationFingerprint as string,
      reviewDecision: value.reviewDecision as TargetBlindReviewedSourceAttestationDecisionV1,
      reviewer: value.reviewer as string | null,
      reviewedAt: value.reviewedAt as string | null,
      reasonCodes: Object.freeze(sortedReasonCodesV1(reasonCodes)),
      claimBoundary: "SOURCE_ATTESTATION_ONLY" as const,
    }),
  });
}
