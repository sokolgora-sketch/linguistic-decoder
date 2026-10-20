import {
  canonicalSerializeOneEmbryoProofM2V0_1,
  sha256OneEmbryoProofM2V0_1,
} from "./oneEmbryoProofM2Preregistration.v0_1";
import {
  validateSourceEntryAttestationV1,
  type SourceEntryAttestationV1,
} from "./sourceEntryAttestation.v1";

export const M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_SCHEMA_V0_1 =
  "open-instrument.m2-single-operator-reproducible-audit.v0.1" as const;
export const M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1 =
  "SINGLE_OPERATOR_REPRODUCIBLE_AUDIT" as const;
export const M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1 =
  "CODE_UNIT_LEXICAL_MINIMUM_OVER_COMPLETE_ELIGIBLE_OPAQUE_IDS" as const;

export const M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1 = [
  "baseline",
  "priorTarget",
  "priorReveal",
  "priorControl",
  "priorResearch",
  "embryoOrReplication",
] as const;

type ExclusionCategoryV0_1 =
  (typeof M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1)[number];
type PriorUseStatusV0_1 = "ABSENT" | "PRESENT" | "UNKNOWN" | "CONFLICTING";

export type M2SingleOperatorAuditArtifactV0_1 = Readonly<{
  artifactId: string;
  kind: "SOURCE" | "EXCLUSION_INVENTORY";
  sourceReference: string;
  sourceRevisionOrAccessDate: string;
  expectedSha256: string;
  expectedByteLength: number;
  declaredCategories: readonly ExclusionCategoryV0_1[];
}>;

export type M2SingleOperatorAuditCandidateV0_1 = Readonly<{
  opaqueCandidateId: string;
  sourceArtifactId: string;
  sourceEntryReference: string;
  sourceSenseReference: string;
  sourceAttestation: SourceEntryAttestationV1;
  sourceAuthorityStatus: "VERIFIED" | "UNKNOWN" | "CONFLICTING";
  senseAuthorityStatus:
    | "RESOLVED_ONE_REVIEWABLE_SENSE"
    | "UNKNOWN"
    | "CONFLICTING";
  priorUse: Readonly<Record<ExclusionCategoryV0_1, PriorUseStatusV0_1>>;
  declaredDecision: "ELIGIBLE" | "EXCLUDED" | "UNKNOWN";
  declaredReasonCodes: readonly string[];
  manualPreference: false;
}>;

export type M2SingleOperatorReproducibleAuditInputV0_1 = Readonly<{
  schemaVersion: typeof M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_SCHEMA_V0_1;
  auditMode: "SYNTHETIC_FIXTURE" | "PRIVATE_REAL_INPUT";
  classification: typeof M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1;
  controller: Readonly<{
    controllerReference: string;
    declaredAt: string;
    selfReviewStatus: "SELF_REVIEWED";
    independentReviewerReference: null;
    claimsIndependentHumanReview: false;
  }>;
  declaredScope: Readonly<{
    scopeId: string;
    scopeVersion: string;
    evidenceArtifactIds: readonly string[];
    exclusionCategories: readonly ExclusionCategoryV0_1[];
    priorUsePolicy: "UNKNOWN_OR_CONFLICTING_FAIL_CLOSED";
  }>;
  evidenceArtifacts: readonly M2SingleOperatorAuditArtifactV0_1[];
  candidateRecords: readonly M2SingleOperatorAuditCandidateV0_1[];
  keyBoundary: Readonly<{
    algorithm: "HMAC-SHA256";
    algorithmVersion: "0.1";
    commitmentStatus: "NOT_CREATED" | "COMMITTED";
    commitmentSha256: string | null;
    commitmentByteLength: number | null;
    generationAuthorized: false;
    realKeyCreated: false;
    rotationProhibited: true;
  }>;
  selectionPolicy: Readonly<{
    selectorId: typeof M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1;
    selectionCount: 1;
    randomness: "NOT_USED";
    manualPreference: false;
    selectionExecuted: false;
  }>;
  publicProjection: Readonly<{
    serializedBytes: string;
    sha256: string;
    byteLength: number;
    frozen: true;
  }>;
  executionBoundary: Readonly<{
    realCandidateIntakeAuthorized: false;
    realSelectionExecuted: false;
    realExecutionAuthorized: false;
  }>;
  auditIntegrity: Readonly<{
    payloadSha256: string;
    payloadByteLength: number;
    selfReferential: false;
    frozen: true;
  }>;
}>;

export type M2SingleOperatorObservedArtifactV0_1 = Readonly<{
  artifactId: string;
  bytes: string | Buffer;
}>;

export type M2SingleOperatorAuditReasonCodeV0_1 =
  | "AUDIT_INPUT_MALFORMED"
  | "AUDIT_SCHEMA_INVALID"
  | "AUDIT_MODE_INVALID"
  | "AUDIT_CLASSIFICATION_INVALID"
  | "CONTROLLER_REFERENCE_MISSING"
  | "SELF_REVIEW_PROVENANCE_MISSING"
  | "INDEPENDENT_REVIEW_CLAIM_FORBIDDEN"
  | "EVIDENCE_ARTIFACT_MISSING"
  | "EVIDENCE_ARTIFACT_UNDECLARED"
  | "EVIDENCE_ARTIFACT_DUPLICATE"
  | "EVIDENCE_REFERENCE_INVALID"
  | "EVIDENCE_HASH_INVALID"
  | "EVIDENCE_HASH_MISMATCH"
  | "EVIDENCE_BYTE_LENGTH_MISMATCH"
  | "EVIDENCE_SCOPE_INCOMPLETE"
  | "EVIDENCE_KIND_INVALID"
  | "CANDIDATE_RECORD_SHAPE_INVALID"
  | "DUPLICATE_OPAQUE_CANDIDATE_ID"
  | "OPAQUE_CANDIDATE_ID_INVALID"
  | "SOURCE_ARTIFACT_REFERENCE_INVALID"
  | "SOURCE_ATTESTATION_INVALID"
  | "SOURCE_AUTHORITY_UNKNOWN"
  | "SENSE_AUTHORITY_UNKNOWN"
  | "PRIOR_USE_UNKNOWN_OR_CONFLICTING"
  | "PRIOR_USE_PRESENT_EXCLUDED"
  | "CANDIDATE_DECISION_MISMATCH"
  | "DECLARED_REASON_CODES_MISMATCH"
  | "PUBLIC_TARGET_SEMANTICS_EXPOSED"
  | "PUBLIC_PROJECTION_INVALID"
  | "PUBLIC_PROJECTION_HASH_MISMATCH"
  | "KEY_COMMITMENT_INVALID"
  | "REAL_KEY_CREATED"
  | "REAL_AUTHORIZATION_REQUESTED"
  | "KEY_ROTATION_NOT_PROHIBITED"
  | "SELECTION_POLICY_INVALID"
  | "MANUAL_PREFERENCE_FORBIDDEN"
  | "SELECTION_EXECUTED_UNAUTHORIZED"
  | "AUDIT_FINGERPRINT_INVALID"
  | "AUDIT_FINGERPRINT_MISMATCH"
  | "AUDIT_FINGERPRINT_SELF_REFERENTIAL"
  | "SINGLE_OPERATOR_AUDIT_VERIFIED";

export type M2SingleOperatorAuditResultV0_1 = Readonly<{
  status:
    | typeof M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1
    | "BLOCKED";
  classification: typeof M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1;
  reasonCodes: readonly M2SingleOperatorAuditReasonCodeV0_1[];
  auditFingerprint: Readonly<{
    observedSha256: string | null;
    observedByteLength: number | null;
    verified: boolean;
  }>;
  evidenceIntegrity: readonly Readonly<{
    artifactId: string;
    observedSha256: string | null;
    observedByteLength: number | null;
    reasonCodes: readonly M2SingleOperatorAuditReasonCodeV0_1[];
  }>[];
  exclusionDecisions: readonly Readonly<{
    opaqueCandidateId: string;
    decision: "ELIGIBLE" | "EXCLUDED" | "UNKNOWN";
    reasonCodes: readonly string[];
  }>[];
  publicTargetSemanticsExposed: boolean;
  independentHumanReviewClaimed: boolean;
  realKeyCreated: false;
  realCandidateIntakeAuthorized: false;
  realSelectionExecuted: false;
  realExecutionAuthorized: false;
}>;

const SHA256_PATTERN_V0_1 = /^[0-9a-f]{64}$/u;
const OPAQUE_ID_PATTERN_V0_1 = /^m2:[A-Za-z0-9._:-]+$/u;
const REQUIRED_ARTIFACT_KEYS_V0_1 = [
  "artifactId",
  "kind",
  "sourceReference",
  "sourceRevisionOrAccessDate",
  "expectedSha256",
  "expectedByteLength",
  "declaredCategories",
] as const;
const REQUIRED_PRIOR_USE_KEYS_V0_1 =
  M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1;

const isRecordV0_1 = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const hasExactKeysV0_1 = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean =>
  Object.keys(value).sort().join("\u0000") === [...keys].sort().join("\u0000");

const isNonEmptyTextV0_1 = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isSha256V0_1 = (value: unknown): value is string =>
  typeof value === "string" && SHA256_PATTERN_V0_1.test(value);

const isByteLengthV0_1 = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;

const sortedUniqueV0_1 = (values: readonly string[]): string[] =>
  [...new Set(values)].sort();

const bytesV0_1 = (value: string | Buffer): number =>
  Buffer.isBuffer(value) ? value.byteLength : Buffer.byteLength(value, "utf8");

const hashV0_1 = (value: string | Buffer): string =>
  sha256OneEmbryoProofM2V0_1(value);

const hasForbiddenPublicKeyV0_1 = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(hasForbiddenPublicKeyV0_1);
  if (!isRecordV0_1(value)) return false;
  const forbidden = new Set([
    "targetWord",
    "targetSense",
    "targetSenseId",
    "targetSenseDefinition",
    "translation",
    "etymology",
    "privateRegistryPreimage",
    "namespaceSecret",
    "key",
    "salt",
  ]);
  return Object.entries(value).some(
    ([key, child]) => forbidden.has(key) || hasForbiddenPublicKeyV0_1(child),
  );
};

const canonicalPublicProjectionV0_1 = (value: unknown): string =>
  `${canonicalSerializeOneEmbryoProofM2V0_1(value)}\n`;

export function canonicalSerializeM2SingleOperatorAuditV0_1(
  value: M2SingleOperatorReproducibleAuditInputV0_1,
): string {
  const copy = { ...(value as Record<string, unknown>) };
  delete copy.auditIntegrity;
  return `${canonicalSerializeOneEmbryoProofM2V0_1(copy)}\n`;
}

export function sha256M2SingleOperatorAuditV0_1(
  value: string | Buffer,
): string {
  return hashV0_1(value);
}

const addReasonV0_1 = (
  reasons: M2SingleOperatorAuditReasonCodeV0_1[],
  reason: M2SingleOperatorAuditReasonCodeV0_1,
): void => {
  reasons.push(reason);
};

function validateArtifactShapeV0_1(
  value: unknown,
  reasons: M2SingleOperatorAuditReasonCodeV0_1[],
): value is M2SingleOperatorAuditArtifactV0_1 {
  if (
    !isRecordV0_1(value) ||
    !hasExactKeysV0_1(value, REQUIRED_ARTIFACT_KEYS_V0_1) ||
    !isNonEmptyTextV0_1(value.artifactId) ||
    !isNonEmptyTextV0_1(value.sourceReference) ||
    !isNonEmptyTextV0_1(value.sourceRevisionOrAccessDate) ||
    !isSha256V0_1(value.expectedSha256) ||
    !isByteLengthV0_1(value.expectedByteLength) ||
    !Array.isArray(value.declaredCategories)
  ) {
    addReasonV0_1(reasons, "EVIDENCE_REFERENCE_INVALID");
    return false;
  }
  if (value.kind !== "SOURCE" && value.kind !== "EXCLUSION_INVENTORY") {
    addReasonV0_1(reasons, "EVIDENCE_KIND_INVALID");
    return false;
  }
  const categories = value.declaredCategories as unknown[];
  if (
    categories.some(
      (category) =>
        !M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1.includes(
          category as ExclusionCategoryV0_1,
        ),
    ) || sortedUniqueV0_1(categories as string[]).length !== categories.length
  ) {
    addReasonV0_1(reasons, "EVIDENCE_SCOPE_INCOMPLETE");
    return false;
  }
  return true;
}

function validatePublicProjectionV0_1(
  value: unknown,
  declaredScope: Record<string, unknown> | undefined,
  reasons: M2SingleOperatorAuditReasonCodeV0_1[],
): boolean {
  const parsedValue = isRecordV0_1(value) && value.serializedBytes;
  if (
    !isRecordV0_1(value) ||
    !hasExactKeysV0_1(value, ["serializedBytes", "sha256", "byteLength", "frozen"]) ||
    typeof value.serializedBytes !== "string" ||
    !isSha256V0_1(value.sha256) ||
    !isByteLengthV0_1(value.byteLength) ||
    value.frozen !== true
  ) {
    addReasonV0_1(reasons, "PUBLIC_PROJECTION_INVALID");
    return false;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(value.serializedBytes);
  } catch {
    addReasonV0_1(reasons, "PUBLIC_PROJECTION_INVALID");
    return false;
  }
  if (
    !isRecordV0_1(parsed) ||
    hasForbiddenPublicKeyV0_1(parsed) ||
    parsedValue !== value.serializedBytes ||
    canonicalPublicProjectionV0_1(parsed) !== value.serializedBytes ||
    hashV0_1(value.serializedBytes) !== value.sha256 ||
    Buffer.byteLength(value.serializedBytes, "utf8") !== value.byteLength
  ) {
    addReasonV0_1(reasons, "PUBLIC_PROJECTION_HASH_MISMATCH");
    if (hasForbiddenPublicKeyV0_1(parsed)) {
      addReasonV0_1(reasons, "PUBLIC_TARGET_SEMANTICS_EXPOSED");
    }
    return false;
  }
  const expectedKeys = [
    "schemaVersion",
    "serializationProfile",
    "scopeId",
    "scopeVersion",
    "containsTargetSemantics",
    "targetBearingFieldCount",
    "auditClassification",
    "selectionPolicyId",
    "selectionExecuted",
    "realCandidateIntakeAuthorized",
    "realExecutionAuthorized",
  ];
  if (
    !hasExactKeysV0_1(parsed, expectedKeys) ||
    typeof parsed.schemaVersion !== "string" ||
    parsed.schemaVersion !== "m2-public-pool-definition.v0.1" ||
    typeof parsed.serializationProfile !== "string" ||
    parsed.serializationProfile !== "canonical-json-v0.1" ||
    typeof parsed.scopeId !== "string" ||
    typeof parsed.scopeVersion !== "string" ||
    !declaredScope ||
    typeof declaredScope.scopeId !== "string" ||
    typeof declaredScope.scopeVersion !== "string" ||
    parsed.scopeId !== declaredScope.scopeId ||
    parsed.scopeVersion !== declaredScope.scopeVersion ||
    typeof parsed.containsTargetSemantics !== "boolean" ||
    parsed.containsTargetSemantics !== false ||
    typeof parsed.targetBearingFieldCount !== "number" ||
    !Number.isInteger(parsed.targetBearingFieldCount) ||
    parsed.targetBearingFieldCount !== 0 ||
    typeof parsed.auditClassification !== "string" ||
    parsed.auditClassification !==
      M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1 ||
    typeof parsed.selectionPolicyId !== "string" ||
    parsed.selectionPolicyId !== M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1 ||
    typeof parsed.selectionExecuted !== "boolean" ||
    parsed.selectionExecuted !== false ||
    typeof parsed.realCandidateIntakeAuthorized !== "boolean" ||
    parsed.realCandidateIntakeAuthorized !== false ||
    typeof parsed.realExecutionAuthorized !== "boolean" ||
    parsed.realExecutionAuthorized !== false
  ) {
    addReasonV0_1(reasons, "PUBLIC_PROJECTION_INVALID");
    return false;
  }
  return true;
}

function candidateDecisionV0_1(
  candidate: M2SingleOperatorAuditCandidateV0_1,
  sourceValid: boolean,
): { decision: "ELIGIBLE" | "EXCLUDED" | "UNKNOWN"; reasonCodes: string[] } {
  const priorValues = Object.values(candidate.priorUse);
  if (priorValues.some((value) => value === "PRESENT")) {
    return { decision: "EXCLUDED", reasonCodes: ["PRIOR_USE_PRESENT_EXCLUDED"] };
  }
  if (
    !sourceValid ||
    candidate.sourceAuthorityStatus !== "VERIFIED" ||
    candidate.senseAuthorityStatus !== "RESOLVED_ONE_REVIEWABLE_SENSE" ||
    priorValues.some((value) => value === "UNKNOWN" || value === "CONFLICTING")
  ) {
    return {
      decision: "UNKNOWN",
      reasonCodes: ["PRIOR_USE_UNKNOWN_OR_CONFLICTING"],
    };
  }
  return {
    decision: "ELIGIBLE",
    reasonCodes: ["ELIGIBLE_AFTER_FAIL_CLOSED_AUDIT"],
  };
}

export function verifyM2SingleOperatorReproducibleAuditV0_1(
  input: unknown,
  observedArtifacts: readonly M2SingleOperatorObservedArtifactV0_1[],
): M2SingleOperatorAuditResultV0_1 {
  const reasons: M2SingleOperatorAuditReasonCodeV0_1[] = [];
  const evidenceIntegrity: Array<M2SingleOperatorAuditResultV0_1["evidenceIntegrity"][number]> = [];
  const exclusionDecisions: Array<M2SingleOperatorAuditResultV0_1["exclusionDecisions"][number]> = [];

  if (!isRecordV0_1(input)) {
    return {
      status: "BLOCKED",
      classification: M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
      reasonCodes: ["AUDIT_INPUT_MALFORMED"],
      auditFingerprint: { observedSha256: null, observedByteLength: null, verified: false },
      evidenceIntegrity,
      exclusionDecisions,
      publicTargetSemanticsExposed: false,
      independentHumanReviewClaimed: false,
      realKeyCreated: false,
      realCandidateIntakeAuthorized: false,
      realSelectionExecuted: false,
      realExecutionAuthorized: false,
    };
  }

  const audit = input as Partial<M2SingleOperatorReproducibleAuditInputV0_1>;
  if (audit.schemaVersion !== M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_SCHEMA_V0_1) {
    addReasonV0_1(reasons, "AUDIT_SCHEMA_INVALID");
  }
  if (
    audit.auditMode !== "SYNTHETIC_FIXTURE" &&
    audit.auditMode !== "PRIVATE_REAL_INPUT"
  ) {
    addReasonV0_1(reasons, "AUDIT_MODE_INVALID");
  }
  if (audit.classification !== M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1) {
    addReasonV0_1(reasons, "AUDIT_CLASSIFICATION_INVALID");
  }

  const controller = audit.controller as Record<string, unknown> | undefined;
  if (
    !controller ||
    !hasExactKeysV0_1(controller, [
      "controllerReference",
      "declaredAt",
      "selfReviewStatus",
      "independentReviewerReference",
      "claimsIndependentHumanReview",
    ]) ||
    !isNonEmptyTextV0_1(controller.controllerReference) ||
    !isNonEmptyTextV0_1(controller.declaredAt) ||
    controller.selfReviewStatus !== "SELF_REVIEWED"
  ) {
    addReasonV0_1(reasons, "SELF_REVIEW_PROVENANCE_MISSING");
  }
  if (
    controller &&
    (controller.independentReviewerReference !== null ||
      controller.claimsIndependentHumanReview !== false)
  ) {
    addReasonV0_1(reasons, "INDEPENDENT_REVIEW_CLAIM_FORBIDDEN");
  }

  const scope = audit.declaredScope as Record<string, unknown> | undefined;
  if (
    !scope ||
    !hasExactKeysV0_1(scope, [
      "scopeId",
      "scopeVersion",
      "evidenceArtifactIds",
      "exclusionCategories",
      "priorUsePolicy",
    ]) ||
    !isNonEmptyTextV0_1(scope.scopeId) ||
    !isNonEmptyTextV0_1(scope.scopeVersion) ||
    !Array.isArray(scope.evidenceArtifactIds) ||
    !Array.isArray(scope.exclusionCategories) ||
    scope.priorUsePolicy !== "UNKNOWN_OR_CONFLICTING_FAIL_CLOSED"
  ) {
    addReasonV0_1(reasons, "EVIDENCE_SCOPE_INCOMPLETE");
  }

  const artifacts = Array.isArray(audit.evidenceArtifacts)
    ? audit.evidenceArtifacts
    : [];
  const artifactById = new Map<string, M2SingleOperatorAuditArtifactV0_1>();
  for (const value of artifacts) {
    const artifactReasons: M2SingleOperatorAuditReasonCodeV0_1[] = [];
    if (validateArtifactShapeV0_1(value, artifactReasons)) {
      if (artifactById.has(value.artifactId)) {
        addReasonV0_1(reasons, "EVIDENCE_ARTIFACT_DUPLICATE");
      } else {
        artifactById.set(value.artifactId, value);
      }
    }
    reasons.push(...artifactReasons);
  }
  const declaredArtifactIds = new Set(
    isRecordV0_1(scope) && Array.isArray(scope.evidenceArtifactIds)
      ? scope.evidenceArtifactIds.filter((value): value is string => typeof value === "string")
      : [],
  );
  for (const artifact of artifacts) {
    if (isRecordV0_1(artifact) && typeof artifact.artifactId === "string" && !declaredArtifactIds.has(artifact.artifactId)) {
      addReasonV0_1(reasons, "EVIDENCE_ARTIFACT_UNDECLARED");
    }
  }
  if (declaredArtifactIds.size !== artifactById.size) {
    addReasonV0_1(reasons, "EVIDENCE_ARTIFACT_MISSING");
  }

  const observedById = new Map<string, M2SingleOperatorObservedArtifactV0_1>();
  for (const observed of observedArtifacts) {
    if (observedById.has(observed.artifactId)) {
      addReasonV0_1(reasons, "EVIDENCE_ARTIFACT_DUPLICATE");
    } else {
      observedById.set(observed.artifactId, observed);
    }
    if (!artifactById.has(observed.artifactId)) {
      addReasonV0_1(reasons, "EVIDENCE_ARTIFACT_UNDECLARED");
    }
  }
  for (const artifact of artifactById.values()) {
    const observed = observedById.get(artifact.artifactId);
    const artifactReasons: M2SingleOperatorAuditReasonCodeV0_1[] = [];
    if (!observed) {
      addReasonV0_1(artifactReasons, "EVIDENCE_ARTIFACT_MISSING");
      addReasonV0_1(reasons, "EVIDENCE_ARTIFACT_MISSING");
      evidenceIntegrity.push({
        artifactId: artifact.artifactId,
        observedSha256: null,
        observedByteLength: null,
        reasonCodes: artifactReasons,
      });
      continue;
    }
    const observedSha256 = hashV0_1(observed.bytes);
    const observedByteLength = bytesV0_1(observed.bytes);
    if (observedSha256 !== artifact.expectedSha256) {
      addReasonV0_1(artifactReasons, "EVIDENCE_HASH_MISMATCH");
    }
    if (observedByteLength !== artifact.expectedByteLength) {
      addReasonV0_1(artifactReasons, "EVIDENCE_BYTE_LENGTH_MISMATCH");
    }
    reasons.push(...artifactReasons);
    evidenceIntegrity.push({
      artifactId: artifact.artifactId,
      observedSha256,
      observedByteLength,
      reasonCodes: sortedUniqueV0_1(artifactReasons) as M2SingleOperatorAuditReasonCodeV0_1[],
    });
  }

  const coveredCategories = new Set<string>();
  for (const artifact of artifactById.values()) {
    if (artifact.kind !== "EXCLUSION_INVENTORY") continue;
    for (const category of artifact.declaredCategories) coveredCategories.add(category);
  }
  const requiredCategories = isRecordV0_1(scope) && Array.isArray(scope.exclusionCategories)
    ? scope.exclusionCategories
    : [];
  if (
    sortedUniqueV0_1(requiredCategories as string[]).join("\u0000") !==
      sortedUniqueV0_1([...M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1]).join("\u0000") ||
    requiredCategories.some((category) => !coveredCategories.has(String(category)))
  ) {
    addReasonV0_1(reasons, "EVIDENCE_SCOPE_INCOMPLETE");
  }

  if (!Array.isArray(audit.candidateRecords)) {
    addReasonV0_1(reasons, "CANDIDATE_RECORD_SHAPE_INVALID");
  }
  const candidates = Array.isArray(audit.candidateRecords) ? audit.candidateRecords : [];
  const candidateIds = new Set<string>();
  for (const value of candidates) {
    const candidate = value as Partial<M2SingleOperatorAuditCandidateV0_1>;
    if (
      !isRecordV0_1(value) ||
      !hasExactKeysV0_1(value, [
        "opaqueCandidateId",
        "sourceArtifactId",
        "sourceEntryReference",
        "sourceSenseReference",
        "sourceAttestation",
        "sourceAuthorityStatus",
        "senseAuthorityStatus",
        "priorUse",
        "declaredDecision",
        "declaredReasonCodes",
        "manualPreference",
      ])
    ) {
      addReasonV0_1(reasons, "CANDIDATE_RECORD_SHAPE_INVALID");
      continue;
    }
    if (
      typeof candidate.opaqueCandidateId !== "string" ||
      !OPAQUE_ID_PATTERN_V0_1.test(candidate.opaqueCandidateId)
    ) {
      addReasonV0_1(reasons, "OPAQUE_CANDIDATE_ID_INVALID");
    }
    if (typeof candidate.opaqueCandidateId === "string") {
      if (candidateIds.has(candidate.opaqueCandidateId)) addReasonV0_1(reasons, "DUPLICATE_OPAQUE_CANDIDATE_ID");
      candidateIds.add(candidate.opaqueCandidateId);
    }
    if (candidate.manualPreference !== false) addReasonV0_1(reasons, "MANUAL_PREFERENCE_FORBIDDEN");
    const sourceArtifact = artifactById.get(String(candidate.sourceArtifactId));
    const attestationResult = validateSourceEntryAttestationV1(candidate.sourceAttestation);
    const sourceValid = Boolean(
      sourceArtifact?.kind === "SOURCE" &&
        attestationResult.ok &&
        attestationResult.attestation.sourceHashOrArchiveHash === sourceArtifact.expectedSha256 &&
        attestationResult.attestation.selectedEntryId === candidate.sourceEntryReference &&
        attestationResult.attestation.entries.find(
          (entry) => entry.entryId === candidate.sourceEntryReference,
        )?.selectedSenseId === candidate.sourceSenseReference,
    );
    if (!sourceValid) {
      addReasonV0_1(reasons, "SOURCE_ARTIFACT_REFERENCE_INVALID");
      if (!attestationResult.ok) addReasonV0_1(reasons, "SOURCE_ATTESTATION_INVALID");
    }
    if (candidate.sourceAuthorityStatus !== "VERIFIED") addReasonV0_1(reasons, "SOURCE_AUTHORITY_UNKNOWN");
    if (candidate.senseAuthorityStatus !== "RESOLVED_ONE_REVIEWABLE_SENSE") addReasonV0_1(reasons, "SENSE_AUTHORITY_UNKNOWN");
    const priorUse = candidate.priorUse as Record<string, unknown> | undefined;
    if (
      !priorUse ||
      !hasExactKeysV0_1(priorUse, REQUIRED_PRIOR_USE_KEYS_V0_1) ||
      Object.values(priorUse).some(
        (status) => !["ABSENT", "PRESENT", "UNKNOWN", "CONFLICTING"].includes(String(status)),
      )
    ) {
      addReasonV0_1(reasons, "CANDIDATE_RECORD_SHAPE_INVALID");
      continue;
    }
    const expected = candidateDecisionV0_1(candidate as M2SingleOperatorAuditCandidateV0_1, sourceValid);
    if (expected.decision === "UNKNOWN") {
      addReasonV0_1(reasons, "PRIOR_USE_UNKNOWN_OR_CONFLICTING");
    }
    const declaredReasons = Array.isArray(candidate.declaredReasonCodes)
      ? sortedUniqueV0_1(candidate.declaredReasonCodes)
      : [];
    if (expected.decision !== candidate.declaredDecision) addReasonV0_1(reasons, "CANDIDATE_DECISION_MISMATCH");
    if (declaredReasons.join("\u0000") !== expected.reasonCodes.join("\u0000")) addReasonV0_1(reasons, "DECLARED_REASON_CODES_MISMATCH");
    exclusionDecisions.push({
      opaqueCandidateId: String(candidate.opaqueCandidateId),
      decision: expected.decision,
      reasonCodes: expected.reasonCodes,
    });
  }

  const keyBoundary = audit.keyBoundary as Record<string, unknown> | undefined;
  if (
    !keyBoundary ||
    !hasExactKeysV0_1(keyBoundary, [
      "algorithm",
      "algorithmVersion",
      "commitmentStatus",
      "commitmentSha256",
      "commitmentByteLength",
      "generationAuthorized",
      "realKeyCreated",
      "rotationProhibited",
    ]) ||
    keyBoundary.algorithm !== "HMAC-SHA256" ||
    keyBoundary.algorithmVersion !== "0.1"
  ) {
    addReasonV0_1(reasons, "KEY_COMMITMENT_INVALID");
  } else {
    if (keyBoundary.generationAuthorized !== false || keyBoundary.realKeyCreated !== false) addReasonV0_1(reasons, "REAL_KEY_CREATED");
    if (keyBoundary.rotationProhibited !== true) addReasonV0_1(reasons, "KEY_ROTATION_NOT_PROHIBITED");
    if (keyBoundary.commitmentStatus === "COMMITTED") {
      if (!isSha256V0_1(keyBoundary.commitmentSha256) || !isByteLengthV0_1(keyBoundary.commitmentByteLength)) addReasonV0_1(reasons, "KEY_COMMITMENT_INVALID");
    } else if (keyBoundary.commitmentStatus !== "NOT_CREATED" || keyBoundary.commitmentSha256 !== null || keyBoundary.commitmentByteLength !== null) {
      addReasonV0_1(reasons, "KEY_COMMITMENT_INVALID");
    }
  }
  if (audit.auditMode === "PRIVATE_REAL_INPUT" && keyBoundary?.commitmentStatus !== "COMMITTED") addReasonV0_1(reasons, "KEY_COMMITMENT_INVALID");

  const selection = audit.selectionPolicy as Record<string, unknown> | undefined;
  if (
    !selection ||
    !hasExactKeysV0_1(selection, ["selectorId", "selectionCount", "randomness", "manualPreference", "selectionExecuted"]) ||
    selection.selectorId !== M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1 ||
    selection.selectionCount !== 1 ||
    selection.randomness !== "NOT_USED" ||
    selection.manualPreference !== false
  ) addReasonV0_1(reasons, "SELECTION_POLICY_INVALID");
  if (selection && selection.selectionExecuted !== false) addReasonV0_1(reasons, "SELECTION_EXECUTED_UNAUTHORIZED");

  const execution = audit.executionBoundary as Record<string, unknown> | undefined;
  if (
    !execution ||
    !hasExactKeysV0_1(execution, ["realCandidateIntakeAuthorized", "realSelectionExecuted", "realExecutionAuthorized"]) ||
    execution.realCandidateIntakeAuthorized !== false ||
    execution.realSelectionExecuted !== false ||
    execution.realExecutionAuthorized !== false
  ) addReasonV0_1(reasons, "REAL_AUTHORIZATION_REQUESTED");
  if (execution && execution.realSelectionExecuted !== false) {
    addReasonV0_1(reasons, "SELECTION_EXECUTED_UNAUTHORIZED");
  }

  const publicProjectionValid = validatePublicProjectionV0_1(
    audit.publicProjection,
    scope,
    reasons,
  );
  const auditIntegrity = audit.auditIntegrity as Record<string, unknown> | undefined;
  let observedAuditSha256: string | null = null;
  let observedAuditByteLength: number | null = null;
  let auditFingerprintVerified = false;
  if (
    !auditIntegrity ||
    !hasExactKeysV0_1(auditIntegrity, ["payloadSha256", "payloadByteLength", "selfReferential", "frozen"]) ||
    !isSha256V0_1(auditIntegrity.payloadSha256) ||
    !isByteLengthV0_1(auditIntegrity.payloadByteLength)
  ) {
    addReasonV0_1(reasons, "AUDIT_FINGERPRINT_INVALID");
  } else {
    if (auditIntegrity.selfReferential !== false) addReasonV0_1(reasons, "AUDIT_FINGERPRINT_SELF_REFERENTIAL");
    if (auditIntegrity.frozen !== true) addReasonV0_1(reasons, "AUDIT_FINGERPRINT_INVALID");
    const canonical = canonicalSerializeM2SingleOperatorAuditV0_1(audit as M2SingleOperatorReproducibleAuditInputV0_1);
    observedAuditSha256 = hashV0_1(canonical);
    observedAuditByteLength = Buffer.byteLength(canonical, "utf8");
    auditFingerprintVerified = observedAuditSha256 === auditIntegrity.payloadSha256 && observedAuditByteLength === auditIntegrity.payloadByteLength;
    if (!auditFingerprintVerified) addReasonV0_1(reasons, "AUDIT_FINGERPRINT_MISMATCH");
  }
  if (!publicProjectionValid) addReasonV0_1(reasons, "PUBLIC_PROJECTION_INVALID");

  const reasonCodes = sortedUniqueV0_1(reasons) as M2SingleOperatorAuditReasonCodeV0_1[];
  if (reasonCodes.length === 0) addReasonV0_1(reasonCodes, "SINGLE_OPERATOR_AUDIT_VERIFIED");
  return {
    status: reasonCodes.length === 1 && reasonCodes[0] === "SINGLE_OPERATOR_AUDIT_VERIFIED"
      ? M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1
      : "BLOCKED",
    classification: M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
    reasonCodes,
    auditFingerprint: {
      observedSha256: observedAuditSha256,
      observedByteLength: observedAuditByteLength,
      verified: auditFingerprintVerified,
    },
    evidenceIntegrity,
    exclusionDecisions,
    publicTargetSemanticsExposed: reasonCodes.includes("PUBLIC_TARGET_SEMANTICS_EXPOSED"),
    independentHumanReviewClaimed: reasonCodes.includes("INDEPENDENT_REVIEW_CLAIM_FORBIDDEN"),
    realKeyCreated: false,
    realCandidateIntakeAuthorized: false,
    realSelectionExecuted: false,
    realExecutionAuthorized: false,
  };
}
