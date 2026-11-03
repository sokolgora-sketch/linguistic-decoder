import {
  canonicalSerializeOneEmbryoProofM2V0_1,
  findForbiddenM2BlindPayloadKeysV0_1,
  sha256OneEmbryoProofM2V0_1,
  type M2BlindPayloadV0_1,
} from "./oneEmbryoProofM2Preregistration.v0_1";
import { findForbiddenM2BlindPayloadContentV0_1 } from "./m2SyntheticArtifactBuilderCore.v0_1";

export const M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1 =
  "open-instrument.m2-solo-ai-review-workflow.v0.1" as const;
export const M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1 =
  "AI_ASSISTED_NOT_HUMAN_INDEPENDENT" as const;

export const M2_SOLO_AI_REVIEW_CHECKS_V0_1 = [
  "artifactHashesRecomputed",
  "sourceProvenanceValidated",
  "exclusionCoverageComplete",
  "sealedManifestValidated",
  "reviewerContractReadOnly",
  "selectionUnchanged",
  "blindPayloadHasNoTargetSemantics",
  "frozenContractLocked",
] as const;

export type M2SoloAiReviewStatusV0_1 = "PASS" | "FAIL" | "UNKNOWN";
export type M2SoloAiReviewCheckStatusV0_1 = M2SoloAiReviewStatusV0_1;

export type M2SoloAiReviewIdentityV0_1 = Readonly<{
  provider: "OpenAI";
  agent: "Codex";
  modelId: string;
  sessionId: string;
  identityBasis: "CURRENT_CODEX_SESSION_METADATA" | "CALLER_DECLARED";
}>;

export type M2SoloAiReviewDecisionV0_1 = Readonly<{
  schemaVersion: typeof M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1;
  reviewerIdentity: M2SoloAiReviewIdentityV0_1;
  classification: typeof M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1;
  outcome: M2SoloAiReviewStatusV0_1;
  reviewedInputSha256: string;
  reviewedArtifactSha256s: readonly string[];
  selectionFingerprintBefore: string;
  selectionFingerprintAfter: string;
  checks: Readonly<Record<(typeof M2_SOLO_AI_REVIEW_CHECKS_V0_1)[number], M2SoloAiReviewCheckStatusV0_1>>;
  conflicts: readonly string[];
  failures: readonly string[];
  claimsHumanIndependentReview: false;
}>;

export type M2SoloAiReviewEvaluationV0_1 = Readonly<{
  status: M2SoloAiReviewStatusV0_1;
  classification: typeof M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1;
  reasonCodes: readonly string[];
  selectionUnchanged: boolean | null;
  humanIndependentReviewClaimed: false;
}>;

export type M2SoloAiReviewerProjectionInputV0_1 = Readonly<{
  machineAuditStatus: M2SoloAiReviewStatusV0_1;
  auditReasonCodes: readonly string[];
  machineChecks: Readonly<Record<(typeof M2_SOLO_AI_REVIEW_CHECKS_V0_1)[number], M2SoloAiReviewCheckStatusV0_1>>;
  evidenceIntegrity: readonly Readonly<{
    artifactId: string;
    expectedSha256: string;
    observedSha256: string | null;
    expectedByteLength: number;
    observedByteLength: number | null;
  }>[];
  exclusionCoverage: Readonly<{
    requiredCategories: readonly string[];
    coveredCategories: readonly string[];
    status: M2SoloAiReviewStatusV0_1;
  }>;
  sourceProvenance: readonly Readonly<{
    candidateOpaqueId: string;
    sourceTraditionId: string;
    sourceTitle: string;
    sourceRevisionOrAccessDate: string;
    sourceFilePath: string;
    sourceHash: string;
    entryReference: string;
    senseReference: string;
    validationStatus: M2SoloAiReviewStatusV0_1;
  }>[];
  sealedManifest: Readonly<{
    sha256: string;
    byteLength: number;
    validationStatus: M2SoloAiReviewStatusV0_1;
    syntheticOnly: true;
  }>;
  selection: Readonly<{
    selectorId: string;
    eligibleCandidateCount: number;
    selectionFingerprint: string;
  }>;
  blindPayload: M2BlindPayloadV0_1;
}>;

const SHA256_PATTERN_V0_1 = /^[0-9a-f]{64}$/u;
const REVIEWER_MODEL_ID_PATTERN_V0_1 = /^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/u;
const REVIEWER_SESSION_ID_PATTERN_V0_1 = /^codex-thread:[A-Za-z0-9._-]{1,128}$/u;
const isRecordV0_1 = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const hasExactKeysV0_1 = (value: Record<string, unknown>, keys: readonly string[]) => {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length && actual.every((key, index) => key === expected[index]);
};
const sortedUniqueV0_1 = (values: readonly string[]) => [...new Set(values)].sort();
const CODE_PATTERN_V0_1 = /^[A-Z][A-Z0-9_.:-]{0,127}$/u;

export function isValidM2SoloAiReviewerIdentityV0_1(value: unknown): value is M2SoloAiReviewIdentityV0_1 {
  return isRecordV0_1(value) &&
    hasExactKeysV0_1(value, ["provider", "agent", "modelId", "sessionId", "identityBasis"]) &&
    value.provider === "OpenAI" && value.agent === "Codex" &&
    typeof value.modelId === "string" && REVIEWER_MODEL_ID_PATTERN_V0_1.test(value.modelId) &&
    typeof value.sessionId === "string" && REVIEWER_SESSION_ID_PATTERN_V0_1.test(value.sessionId) &&
    (value.identityBasis === "CURRENT_CODEX_SESSION_METADATA" || value.identityBasis === "CALLER_DECLARED");
}

const snapshotJsonV0_1 = <T,>(value: T): T =>
  JSON.parse(canonicalSerializeOneEmbryoProofM2V0_1(value)) as T;

const deepFreezeV0_1 = <T,>(value: T): T => {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) deepFreezeV0_1(child);
  }
  return value;
};

export function buildM2SoloAiReviewerProjectionV0_1(
  input: M2SoloAiReviewerProjectionInputV0_1,
) {
  const blindPayload = snapshotJsonV0_1(input.blindPayload);
  const forbiddenKeys = findForbiddenM2BlindPayloadKeysV0_1(blindPayload);
  const forbiddenValues = findForbiddenM2BlindPayloadContentV0_1(blindPayload);
  const blindPayloadStatus: M2SoloAiReviewStatusV0_1 =
    forbiddenKeys.length > 0 || forbiddenValues.length > 0 ? "FAIL" : "PASS";
  const projection = {
    schemaVersion: M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1,
    role: "AI_REVIEWER_READ_ONLY" as const,
    classification: M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1,
    machineAuditStatus: input.machineAuditStatus,
    auditReasonCodes: [...input.auditReasonCodes],
    machineCheckStatuses: { ...input.machineChecks },
    evidenceIntegrity: input.evidenceIntegrity.map((item) => ({ ...item })),
    exclusionCoverage: {
      requiredCategories: [...input.exclusionCoverage.requiredCategories],
      coveredCategories: [...input.exclusionCoverage.coveredCategories],
      status: input.exclusionCoverage.status,
    },
    sourceProvenance: input.sourceProvenance.map((source) => ({ ...source })),
    sealedManifest: { ...input.sealedManifest },
    selection: { ...input.selection },
    blindPayload,
    blindPayloadCheck: {
      status: blindPayloadStatus,
      forbiddenKeyPaths: forbiddenKeys,
      forbiddenValuePaths: forbiddenValues,
    },
    accessBoundary: {
      readOnly: true,
      canChangeCandidateSelection: false,
      receivesHmacKey: false,
      receivesTargetMeaning: false,
      enforcement: "EXACT_DATA_PROJECTION_AND_REVIEW_SCHEMA",
    },
    reviewerCanReturn: ["PASS", "FAIL", "UNKNOWN"] as const,
  };
  const immutableProjection = deepFreezeV0_1(projection);
  const serialized = `${canonicalSerializeOneEmbryoProofM2V0_1(immutableProjection)}\n`;
  return {
    projection: immutableProjection,
    sha256: sha256OneEmbryoProofM2V0_1(serialized),
    byteLength: Buffer.byteLength(serialized, "utf8"),
    forbiddenKeyPaths: forbiddenKeys,
    forbiddenValuePaths: forbiddenValues,
  };
}

export function buildM2SoloAiBlindResearchHandoffV0_1(
  payload: M2BlindPayloadV0_1,
) {
  const payloadSnapshot = snapshotJsonV0_1(payload);
  const forbiddenKeyPaths = findForbiddenM2BlindPayloadKeysV0_1(payloadSnapshot);
  const forbiddenValuePaths = findForbiddenM2BlindPayloadContentV0_1(payloadSnapshot);
  const serialized = `${canonicalSerializeOneEmbryoProofM2V0_1(payloadSnapshot)}\n`;
  const allowedKeys = [
    "schemaVersion",
    "caseOpaqueId",
    "structuralEmbryo",
    "structuralFingerprint",
    "voicePath",
    "sourceUniverseId",
    "searchPolicyId",
    "stopRuleId",
    "claimBoundary",
    "targetRevealStatus",
  ];
  const shapeValid = isRecordV0_1(payload) && hasExactKeysV0_1(payload, allowedKeys);
  const status: M2SoloAiReviewStatusV0_1 =
    !shapeValid || forbiddenKeyPaths.length > 0 || forbiddenValuePaths.length > 0
      ? "FAIL"
      : "PASS";
  return deepFreezeV0_1({
    schemaVersion: M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1,
    role: "BLIND_RESEARCH_AGENT" as const,
    status,
    allowedKeys,
    payload: payloadSnapshot,
    payloadSha256: sha256OneEmbryoProofM2V0_1(serialized),
    payloadByteLength: Buffer.byteLength(serialized, "utf8"),
    forbiddenKeyPaths,
    forbiddenValuePaths,
    targetSemanticsProvided: false,
    sourceIdentityProvided: false,
    selectionControlProvided: false,
    m3ExecutionPerformed: false,
  });
}

export function verifyM2SoloAiReviewerProjectionReadOnlyV0_1(projection: unknown): boolean {
  if (!isRecordV0_1(projection) || projection.role !== "AI_REVIEWER_READ_ONLY") return false;
  const boundary = projection.accessBoundary;
  if (!isRecordV0_1(boundary) || !hasExactKeysV0_1(boundary, [
    "readOnly",
    "canChangeCandidateSelection",
    "receivesHmacKey",
    "receivesTargetMeaning",
    "enforcement",
  ])) return false;
  const reviewerCanReturn = projection.reviewerCanReturn;
  return boundary.readOnly === true &&
    Object.isFrozen(projection) &&
    Object.isFrozen(boundary) &&
    boundary.canChangeCandidateSelection === false &&
    boundary.receivesHmacKey === false &&
    boundary.receivesTargetMeaning === false &&
    boundary.enforcement === "EXACT_DATA_PROJECTION_AND_REVIEW_SCHEMA" &&
    Array.isArray(reviewerCanReturn) &&
    [...reviewerCanReturn].sort().join("\u0000") === ["FAIL", "PASS", "UNKNOWN"].join("\u0000");
}

export function evaluateM2SoloAiReviewDecisionV0_1(
  expected: Readonly<{
    reviewerInputSha256: string;
    artifactSha256s: readonly string[];
    selectionFingerprint: string;
    machineChecks: Readonly<Record<(typeof M2_SOLO_AI_REVIEW_CHECKS_V0_1)[number], M2SoloAiReviewCheckStatusV0_1>>;
  }>,
  decision: unknown,
): M2SoloAiReviewEvaluationV0_1 {
  const reasons: string[] = [];
  if (!isRecordV0_1(decision)) {
    return {
      status: "UNKNOWN",
      classification: M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1,
      reasonCodes: ["REVIEW_DECISION_MALFORMED"],
      selectionUnchanged: null,
      humanIndependentReviewClaimed: false,
    };
  }
  const requiredKeys = [
    "schemaVersion",
    "reviewerIdentity",
    "classification",
    "outcome",
    "reviewedInputSha256",
    "reviewedArtifactSha256s",
    "selectionFingerprintBefore",
    "selectionFingerprintAfter",
    "checks",
    "conflicts",
    "failures",
    "claimsHumanIndependentReview",
  ];
  if (!hasExactKeysV0_1(decision, requiredKeys)) reasons.push("REVIEW_DECISION_SCHEMA_INVALID");
  const identity = decision.reviewerIdentity;
  const identityValid = isValidM2SoloAiReviewerIdentityV0_1(identity);
  if (!identityValid) reasons.push("REVIEWER_IDENTITY_UNKNOWN");
  if (decision.schemaVersion !== M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1 ||
      decision.classification !== M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1) {
    reasons.push("REVIEW_CLASSIFICATION_INVALID");
  }
  const outcomeValid = decision.outcome === "PASS" || decision.outcome === "FAIL" || decision.outcome === "UNKNOWN";
  if (!outcomeValid) reasons.push("REVIEW_OUTCOME_INVALID");
  if (decision.reviewedInputSha256 !== expected.reviewerInputSha256) reasons.push("REVIEW_INPUT_HASH_MISMATCH");
  const reviewedHashes = Array.isArray(decision.reviewedArtifactSha256s) &&
    decision.reviewedArtifactSha256s.every((hash) => typeof hash === "string" && SHA256_PATTERN_V0_1.test(hash));
  if (!reviewedHashes || sortedUniqueV0_1(decision.reviewedArtifactSha256s as string[]).join("\u0000") !==
      sortedUniqueV0_1(expected.artifactSha256s).join("\u0000")) {
    reasons.push("REVIEWED_ARTIFACT_HASH_SET_MISMATCH");
  }
  const selectionUnchanged = decision.selectionFingerprintBefore === expected.selectionFingerprint &&
    decision.selectionFingerprintAfter === expected.selectionFingerprint;
  if (!selectionUnchanged) reasons.push("SELECTION_FINGERPRINT_CHANGED");
  if (decision.claimsHumanIndependentReview !== false) reasons.push("HUMAN_INDEPENDENT_REVIEW_CLAIM_FORBIDDEN");
  if (!Array.isArray(decision.conflicts) || decision.conflicts.some((value) => typeof value !== "string")) {
    reasons.push("REVIEW_CONFLICT_LIST_INVALID");
  } else {
    if (decision.conflicts.some((value) => !CODE_PATTERN_V0_1.test(value))) reasons.push("REVIEW_CONFLICT_CODE_INVALID");
    if (decision.conflicts.length > 0) reasons.push("REVIEW_CONFLICTS_PRESENT");
  }
  if (!Array.isArray(decision.failures) || decision.failures.some((value) => typeof value !== "string")) {
    reasons.push("REVIEW_FAILURE_LIST_INVALID");
  } else {
    if (decision.failures.some((value) => !CODE_PATTERN_V0_1.test(value))) reasons.push("REVIEW_FAILURE_CODE_INVALID");
    if (decision.failures.length > 0) reasons.push("REVIEW_FAILURES_PRESENT");
  }
  const checks = decision.checks;
  if (!isRecordV0_1(checks) || !hasExactKeysV0_1(checks, M2_SOLO_AI_REVIEW_CHECKS_V0_1)) {
    reasons.push("REVIEW_CHECK_SET_INVALID");
  } else {
    for (const check of M2_SOLO_AI_REVIEW_CHECKS_V0_1) {
      if (checks[check] === "FAIL") reasons.push(`REVIEW_CHECK_FAILED:${check}`);
      else if (checks[check] !== "PASS" && checks[check] !== "UNKNOWN") reasons.push(`REVIEW_CHECK_UNKNOWN:${check}`);
      const machineStatus = expected.machineChecks[check];
      if (machineStatus !== "PASS" && machineStatus !== "FAIL" && machineStatus !== "UNKNOWN") {
        reasons.push(`MACHINE_CHECK_STATUS_INVALID:${check}`);
      } else if (machineStatus !== "PASS" && checks[check] === "PASS") {
        reasons.push(`REVIEW_CHECK_UPGRADED:${check}`);
      }
    }
  }

  if (decision.outcome === "FAIL") reasons.push("REVIEWER_REJECTED_REVIEW");
  const failed = decision.outcome === "FAIL" || reasons.some((reason) =>
    reason.includes("MISMATCH") || reason.includes("CHANGED") || reason.includes("FORBIDDEN") ||
    reason.includes("CONFLICTS_PRESENT") || reason.includes("FAILURES_PRESENT") ||
    reason.includes("CHECK_FAILED") || reason === "REVIEW_DECISION_SCHEMA_INVALID" ||
    reason.includes("CHECK_UPGRADED") || reason.includes("CODE_INVALID") ||
    reason === "REVIEW_CLASSIFICATION_INVALID" || reason === "REVIEW_OUTCOME_INVALID" ||
    reason === "REVIEWED_ARTIFACT_HASH_SET_MISMATCH" || reason === "REVIEW_CHECK_SET_INVALID",
  );
  const unknown = reasons.length > 0 || !identityValid || decision.outcome === "UNKNOWN" ||
    (isRecordV0_1(checks) && M2_SOLO_AI_REVIEW_CHECKS_V0_1.some((check) => checks[check] === "UNKNOWN"));
  const status: M2SoloAiReviewStatusV0_1 = failed ? "FAIL" : unknown ? "UNKNOWN" : "PASS";
  if (status === "PASS") reasons.push("AI_REVIEW_REPRODUCIBLE_FOR_SYNTHETIC_SCOPE");
  return {
    status,
    classification: M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1,
    reasonCodes: sortedUniqueV0_1(reasons),
    selectionUnchanged: typeof selectionUnchanged === "boolean" ? selectionUnchanged : null,
    humanIndependentReviewClaimed: false,
  };
}
