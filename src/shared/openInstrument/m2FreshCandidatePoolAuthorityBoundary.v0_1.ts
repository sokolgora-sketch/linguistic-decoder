import {
  canonicalSerializeOneEmbryoProofM2V0_1,
  sha256OneEmbryoProofM2V0_1,
} from "./oneEmbryoProofM2Preregistration.v0_1";

export const M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1 =
  "open-instrument.m2-fresh-candidate-pool-authority-boundary.v0.1" as const;

export const M2_OPAQUE_ID_ALGORITHM_V0_1 = "HMAC-SHA256" as const;
export const M2_OPAQUE_ID_SERIALIZATION_PROFILE_V0_1 =
  "m2-candidate-identity-canonical-json.v0.1" as const;
export const M2_COVERAGE_VERIFIED_FOR_DECLARED_SCOPE_V0_1 =
  "COVERAGE_VERIFIED_FOR_DECLARED_SCOPE" as const;
export const M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1 =
  "SEALED_MANIFEST_ONLY" as const;

type AuthorityReviewStatusV0_1 =
  | "INDEPENDENTLY_REVIEWED"
  | "UNREVIEWED"
  | "UNKNOWN"
  | "CONFLICTING";

type IntegrityMetadataV0_1 = Readonly<{
  frozenSha256: string;
  observedSha256: string;
  frozenByteLength: number;
  observedByteLength: number;
  hashVerified: boolean;
  frozenBeforeIntake: boolean;
  mutatedAfterFreeze: boolean;
}>;

export type M2SyntheticOpaqueIdAuthorityMetadataV0_1 = Readonly<{
  algorithm: typeof M2_OPAQUE_ID_ALGORITHM_V0_1;
  algorithmVersion: "0.1";
  canonicalIdentitySerializationProfile: typeof M2_OPAQUE_ID_SERIALIZATION_PROFILE_V0_1;
  namespaceCommitment: Readonly<{
    sha256: string;
    byteLength: number;
    committedBeforeIntake: boolean;
    frozen: boolean;
  }>;
  keyCustody: Readonly<{
    status: "INDEPENDENTLY_CONTROLLED_PRIVATE" | "UNREVIEWED" | "UNKNOWN" | "CONFLICTING";
    syntheticFixtureOnly: boolean;
    realKeyCreated: boolean;
  }>;
  registryReview: Readonly<{
    status: AuthorityReviewStatusV0_1;
    reviewerReference: string;
    syntheticFixtureOnly: boolean;
  }>;
  registryIntegrity: IntegrityMetadataV0_1;
  insertionOrderIndependent: boolean;
}>;

export type M2SyntheticExclusionCoverageMetadataV0_1 = Readonly<{
  scopeId: string;
  scopeVersion: string;
  coverageClass: typeof M2_COVERAGE_VERIFIED_FOR_DECLARED_SCOPE_V0_1;
  evidenceInventory: IntegrityMetadataV0_1;
  categories: Readonly<{
    baseline: "COVERED" | "UNKNOWN" | "CONFLICTING";
    priorTarget: "COVERED" | "UNKNOWN" | "CONFLICTING";
    priorReveal: "COVERED" | "UNKNOWN" | "CONFLICTING";
    priorControl: "COVERED" | "UNKNOWN" | "CONFLICTING";
    priorResearch: "COVERED" | "UNKNOWN" | "CONFLICTING";
    embryoOrReplication: "COVERED" | "UNKNOWN" | "CONFLICTING";
  }>;
  independentReview: Readonly<{
    status: AuthorityReviewStatusV0_1;
    reviewerReference: string;
    syntheticFixtureOnly: boolean;
  }>;
}>;

export type M2SyntheticVisibilityAndSealedLinkageMetadataV0_1 = Readonly<{
  publicPoolDefinition: Readonly<{
    schemaVersion: string;
    serializationProfile: string;
    containsTargetSemantics: false;
    targetBearingFieldCount: 0;
    sha256: string;
    byteLength: number;
    frozen: boolean;
  }>;
  sealedManifest: Readonly<{
    schemaVersion: string;
    serializationProfile: string;
    linkageMode: typeof M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1;
    poolDefinitionSha256: string;
    poolDefinitionByteLength: number;
    privateRegistrySha256: string;
    privateRegistryByteLength: number;
    frozenSha256: string;
    observedSha256: string;
    frozenByteLength: number;
    observedByteLength: number;
    hashVerified: boolean;
    frozen: boolean;
    selfReferential: false;
    targetBearingDataPublic: false;
  }>;
}>;

export type M2FreshCandidatePoolAuthorityBoundaryInputV0_1 = Readonly<{
  schemaVersion: typeof M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1;
  syntheticFixture: true;
  opaqueIdAuthority: M2SyntheticOpaqueIdAuthorityMetadataV0_1;
  exclusionCoverage: M2SyntheticExclusionCoverageMetadataV0_1;
  visibilityAndSealedLinkage: M2SyntheticVisibilityAndSealedLinkageMetadataV0_1;
  executionBoundary: Readonly<{
    realCandidateIntakeAuthorized: false;
    realExecutionAuthorized: false;
  }>;
}>;

export type M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1 =
  | "AUTHORITY_INPUT_MALFORMED"
  | "OPAQUE_ID_ALGORITHM_UNSUPPORTED"
  | "OPAQUE_ID_SERIALIZATION_PROFILE_INVALID"
  | "OPAQUE_ID_NAMESPACE_UNCOMMITTED"
  | "OPAQUE_ID_NAMESPACE_HASH_INVALID"
  | "OPAQUE_ID_NAMESPACE_NOT_FROZEN"
  | "OPAQUE_ID_KEY_CUSTODY_UNVERIFIED"
  | "OPAQUE_ID_REAL_KEY_CREATED"
  | "OPAQUE_ID_REGISTRY_REVIEW_UNVERIFIED"
  | "OPAQUE_ID_REGISTRY_HASH_INVALID"
  | "OPAQUE_ID_REGISTRY_HASH_MISMATCH"
  | "OPAQUE_ID_REGISTRY_MUTATED_AFTER_FREEZE"
  | "OPAQUE_ID_INSERTION_ORDER_DEPENDENT"
  | "COVERAGE_SCOPE_INVALID"
  | "COVERAGE_CLASS_INVALID"
  | "COVERAGE_INVENTORY_HASH_INVALID"
  | "COVERAGE_INVENTORY_HASH_MISMATCH"
  | "COVERAGE_INVENTORY_MUTATED_AFTER_FREEZE"
  | "COVERAGE_CATEGORY_MISSING"
  | "COVERAGE_UNKNOWN_OR_CONFLICTING"
  | "COVERAGE_REVIEW_UNVERIFIED"
  | "PUBLIC_POOL_METADATA_INVALID"
  | "PUBLIC_TARGET_SEMANTICS_EXPOSED"
  | "PUBLIC_POOL_HASH_INVALID"
  | "SEALED_MANIFEST_INVALID"
  | "SEALED_MANIFEST_HASH_INVALID"
  | "SEALED_MANIFEST_HASH_MISMATCH"
  | "SEALED_MANIFEST_NOT_FROZEN"
  | "SEALED_MANIFEST_SELF_REFERENTIAL"
  | "SEALED_REGISTRY_LINKAGE_MISMATCH"
  | "REAL_AUTHORIZATION_REQUESTED"
  | "SYNTHETIC_AUTHORITY_METADATA_ACCEPTED"
  | "REAL_CANDIDATE_INTAKE_UNAUTHORIZED"
  | "REAL_EXECUTION_UNAUTHORIZED";

export type M2FreshCandidatePoolAuthorityBoundaryResultV0_1 = Readonly<{
  status: "SYNTHETIC_BCD_AUTHORITY_READY" | "BLOCKED";
  reasonCodes: readonly M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1[];
  summary: Readonly<{
    schemaVersion: typeof M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1;
    syntheticOnly: true;
    authorityDirections: readonly ["B", "C", "D"];
    coverageStatus:
      | typeof M2_COVERAGE_VERIFIED_FOR_DECLARED_SCOPE_V0_1
      | "BLOCKED";
    registryLinkage:
      | typeof M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1
      | "BLOCKED";
    publicTargetSemanticsExposed: false;
  }>;
  realCandidateIntakeAuthorized: false;
  realExecutionAuthorized: false;
}>;

const SHA256_PATTERN_V0_1 = /^[0-9a-f]{64}$/u;

const isRecordV0_1 = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const hasExactKeysV0_1 = (
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean =>
  Object.keys(value).sort().join("\u0000") ===
  [...expected].sort().join("\u0000");

const isNonEmptyStringV0_1 = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

const isSha256V0_1 = (value: unknown): value is string =>
  typeof value === "string" && SHA256_PATTERN_V0_1.test(value);

const isNonNegativeIntegerV0_1 = (value: unknown): value is number =>
  typeof value === "number" && Number.isInteger(value) && value >= 0;

const sortedReasonCodesV0_1 = (
  values: readonly M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1[],
): M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1[] =>
  [...new Set(values)].sort() as M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1[];

const INTEGRITY_KEYS_V0_1 = [
  "frozenSha256",
  "observedSha256",
  "frozenByteLength",
  "observedByteLength",
  "hashVerified",
  "frozenBeforeIntake",
  "mutatedAfterFreeze",
] as const;

const isIntegrityMetadataShapeV0_1 = (value: unknown): value is IntegrityMetadataV0_1 =>
  isRecordV0_1(value) &&
  hasExactKeysV0_1(value, INTEGRITY_KEYS_V0_1) &&
  isSha256V0_1(value.frozenSha256) &&
  isSha256V0_1(value.observedSha256) &&
  isNonNegativeIntegerV0_1(value.frozenByteLength) &&
  isNonNegativeIntegerV0_1(value.observedByteLength) &&
  typeof value.hashVerified === "boolean" &&
  typeof value.frozenBeforeIntake === "boolean" &&
  typeof value.mutatedAfterFreeze === "boolean";

const hasForbiddenPublicTargetKeysV0_1 = (value: unknown): boolean => {
  if (Array.isArray(value)) return value.some(hasForbiddenPublicTargetKeysV0_1);
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
    ([key, child]) => forbidden.has(key) || hasForbiddenPublicTargetKeysV0_1(child),
  );
};

const validateOpaqueIdAuthorityV0_1 = (
  value: unknown,
  reasons: M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1[],
): boolean => {
  const keys = [
    "algorithm",
    "algorithmVersion",
    "canonicalIdentitySerializationProfile",
    "namespaceCommitment",
    "keyCustody",
    "registryReview",
    "registryIntegrity",
    "insertionOrderIndependent",
  ] as const;
  if (
    !isRecordV0_1(value) ||
    !hasExactKeysV0_1(value, keys) ||
    !isRecordV0_1(value.namespaceCommitment) ||
    !isRecordV0_1(value.keyCustody) ||
    !isRecordV0_1(value.registryReview) ||
    !isIntegrityMetadataShapeV0_1(value.registryIntegrity)
  ) {
    reasons.push("AUTHORITY_INPUT_MALFORMED");
    return false;
  }

  const namespace = value.namespaceCommitment;
  const custody = value.keyCustody;
  const review = value.registryReview;
  let valid = true;
  if (value.algorithm !== M2_OPAQUE_ID_ALGORITHM_V0_1 || value.algorithmVersion !== "0.1") {
    reasons.push("OPAQUE_ID_ALGORITHM_UNSUPPORTED");
    valid = false;
  }
  if (
    value.canonicalIdentitySerializationProfile !==
    M2_OPAQUE_ID_SERIALIZATION_PROFILE_V0_1
  ) {
    reasons.push("OPAQUE_ID_SERIALIZATION_PROFILE_INVALID");
    valid = false;
  }
  if (
    !hasExactKeysV0_1(namespace, ["sha256", "byteLength", "committedBeforeIntake", "frozen"]) ||
    !isSha256V0_1(namespace.sha256) ||
    !isNonNegativeIntegerV0_1(namespace.byteLength)
  ) {
    reasons.push("OPAQUE_ID_NAMESPACE_HASH_INVALID");
    valid = false;
  } else {
    if (!namespace.committedBeforeIntake) {
      reasons.push("OPAQUE_ID_NAMESPACE_UNCOMMITTED");
      valid = false;
    }
    if (!namespace.frozen) {
      reasons.push("OPAQUE_ID_NAMESPACE_NOT_FROZEN");
      valid = false;
    }
  }
  if (
    !hasExactKeysV0_1(custody, ["status", "syntheticFixtureOnly", "realKeyCreated"]) ||
    custody.status !== "INDEPENDENTLY_CONTROLLED_PRIVATE" ||
    custody.syntheticFixtureOnly !== true
  ) {
    reasons.push("OPAQUE_ID_KEY_CUSTODY_UNVERIFIED");
    valid = false;
  }
  if (custody.realKeyCreated !== false) {
    reasons.push("OPAQUE_ID_REAL_KEY_CREATED");
    valid = false;
  }
  if (
    !hasExactKeysV0_1(review, ["status", "reviewerReference", "syntheticFixtureOnly"]) ||
    review.status !== "INDEPENDENTLY_REVIEWED" ||
    !isNonEmptyStringV0_1(review.reviewerReference) ||
    review.syntheticFixtureOnly !== true
  ) {
    reasons.push("OPAQUE_ID_REGISTRY_REVIEW_UNVERIFIED");
    valid = false;
  }
  const integrity = value.registryIntegrity;
  if (!integrity.hashVerified) reasons.push("OPAQUE_ID_REGISTRY_HASH_INVALID");
  if (integrity.frozenSha256 !== integrity.observedSha256 || integrity.frozenByteLength !== integrity.observedByteLength) {
    reasons.push("OPAQUE_ID_REGISTRY_HASH_MISMATCH");
    valid = false;
  }
  if (!integrity.hashVerified || !isSha256V0_1(integrity.frozenSha256)) {
    reasons.push("OPAQUE_ID_REGISTRY_HASH_INVALID");
    valid = false;
  }
  if (!integrity.frozenBeforeIntake) {
    reasons.push("OPAQUE_ID_REGISTRY_HASH_INVALID");
    valid = false;
  }
  if (integrity.mutatedAfterFreeze) {
    reasons.push("OPAQUE_ID_REGISTRY_MUTATED_AFTER_FREEZE");
    valid = false;
  }
  if (value.insertionOrderIndependent !== true) {
    reasons.push("OPAQUE_ID_INSERTION_ORDER_DEPENDENT");
    valid = false;
  }
  return valid;
};

const validateExclusionCoverageV0_1 = (
  value: unknown,
  reasons: M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1[],
): boolean => {
  const keys = [
    "scopeId",
    "scopeVersion",
    "coverageClass",
    "evidenceInventory",
    "categories",
    "independentReview",
  ] as const;
  const categoryKeys = [
    "baseline",
    "priorTarget",
    "priorReveal",
    "priorControl",
    "priorResearch",
    "embryoOrReplication",
  ] as const;
  if (
    !isRecordV0_1(value) ||
    !hasExactKeysV0_1(value, keys) ||
    !isIntegrityMetadataShapeV0_1(value.evidenceInventory) ||
    !isRecordV0_1(value.categories) ||
    !hasExactKeysV0_1(value.categories, categoryKeys) ||
    !isRecordV0_1(value.independentReview)
  ) {
    reasons.push("COVERAGE_SCOPE_INVALID");
    return false;
  }
  let valid = true;
  if (!isNonEmptyStringV0_1(value.scopeId) || !isNonEmptyStringV0_1(value.scopeVersion)) {
    reasons.push("COVERAGE_SCOPE_INVALID");
    valid = false;
  }
  if (value.coverageClass !== M2_COVERAGE_VERIFIED_FOR_DECLARED_SCOPE_V0_1) {
    reasons.push("COVERAGE_CLASS_INVALID");
    valid = false;
  }
  const inventory = value.evidenceInventory;
  if (!inventory.hashVerified) reasons.push("COVERAGE_INVENTORY_HASH_INVALID");
  if (inventory.frozenSha256 !== inventory.observedSha256 || inventory.frozenByteLength !== inventory.observedByteLength) {
    reasons.push("COVERAGE_INVENTORY_HASH_MISMATCH");
    valid = false;
  }
  if (inventory.mutatedAfterFreeze) {
    reasons.push("COVERAGE_INVENTORY_MUTATED_AFTER_FREEZE");
    valid = false;
  }
  if (!inventory.hashVerified || !inventory.frozenBeforeIntake) {
    reasons.push("COVERAGE_INVENTORY_HASH_INVALID");
    valid = false;
  }
  for (const category of categoryKeys) {
    if (value.categories[category] === "UNKNOWN" || value.categories[category] === "CONFLICTING") {
      reasons.push("COVERAGE_UNKNOWN_OR_CONFLICTING");
      valid = false;
    }
    if (value.categories[category] !== "COVERED") {
      reasons.push("COVERAGE_CATEGORY_MISSING");
      valid = false;
    }
  }
  const review = value.independentReview;
  if (
    !hasExactKeysV0_1(review, ["status", "reviewerReference", "syntheticFixtureOnly"]) ||
    review.status !== "INDEPENDENTLY_REVIEWED" ||
    !isNonEmptyStringV0_1(review.reviewerReference) ||
    review.syntheticFixtureOnly !== true
  ) {
    reasons.push("COVERAGE_REVIEW_UNVERIFIED");
    valid = false;
  }
  return valid;
};

const validateVisibilityAndLinkageV0_1 = (
  value: unknown,
  reasons: M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1[],
): boolean => {
  if (
    !isRecordV0_1(value) ||
    !hasExactKeysV0_1(value, ["publicPoolDefinition", "sealedManifest"]) ||
    !isRecordV0_1(value.publicPoolDefinition) ||
    !isRecordV0_1(value.sealedManifest)
  ) {
    reasons.push("PUBLIC_POOL_METADATA_INVALID");
    return false;
  }
  const pool = value.publicPoolDefinition;
  const manifest = value.sealedManifest;
  let valid = true;
  if (
    !hasExactKeysV0_1(pool, [
      "schemaVersion",
      "serializationProfile",
      "containsTargetSemantics",
      "targetBearingFieldCount",
      "sha256",
      "byteLength",
      "frozen",
    ])
  ) {
    reasons.push("PUBLIC_POOL_METADATA_INVALID");
    valid = false;
  }
  if (hasForbiddenPublicTargetKeysV0_1(pool)) {
    reasons.push("PUBLIC_TARGET_SEMANTICS_EXPOSED");
    valid = false;
  }
  if (
    pool.containsTargetSemantics !== false ||
    pool.targetBearingFieldCount !== 0
  ) {
    reasons.push("PUBLIC_TARGET_SEMANTICS_EXPOSED");
    valid = false;
  }
  if (
    !isNonEmptyStringV0_1(pool.schemaVersion) ||
    !isNonEmptyStringV0_1(pool.serializationProfile) ||
    !isSha256V0_1(pool.sha256) ||
    !isNonNegativeIntegerV0_1(pool.byteLength) ||
    pool.frozen !== true
  ) {
    reasons.push("PUBLIC_POOL_HASH_INVALID");
    valid = false;
  }
  const manifestKeys = [
    "schemaVersion",
    "serializationProfile",
    "linkageMode",
    "poolDefinitionSha256",
    "poolDefinitionByteLength",
    "privateRegistrySha256",
    "privateRegistryByteLength",
    "frozenSha256",
    "observedSha256",
    "frozenByteLength",
    "observedByteLength",
    "hashVerified",
    "frozen",
    "selfReferential",
    "targetBearingDataPublic",
  ] as const;
  if (!hasExactKeysV0_1(manifest, manifestKeys)) {
    reasons.push("SEALED_MANIFEST_INVALID");
    valid = false;
  }
  if (hasForbiddenPublicTargetKeysV0_1(manifest)) {
    reasons.push("PUBLIC_TARGET_SEMANTICS_EXPOSED");
    valid = false;
  }
  if (
    !isNonEmptyStringV0_1(manifest.schemaVersion) ||
    !isNonEmptyStringV0_1(manifest.serializationProfile) ||
    manifest.linkageMode !== M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1 ||
    !isSha256V0_1(manifest.poolDefinitionSha256) ||
    !isNonNegativeIntegerV0_1(manifest.poolDefinitionByteLength) ||
    !isSha256V0_1(manifest.privateRegistrySha256) ||
    !isNonNegativeIntegerV0_1(manifest.privateRegistryByteLength) ||
    !isSha256V0_1(manifest.frozenSha256) ||
    !isSha256V0_1(manifest.observedSha256) ||
    !isNonNegativeIntegerV0_1(manifest.frozenByteLength) ||
    !isNonNegativeIntegerV0_1(manifest.observedByteLength) ||
    typeof manifest.hashVerified !== "boolean" ||
    typeof manifest.frozen !== "boolean" ||
    manifest.selfReferential !== false ||
    manifest.targetBearingDataPublic !== false
  ) {
    reasons.push("SEALED_MANIFEST_INVALID");
    valid = false;
  }
  if (
    !isSha256V0_1(pool.sha256) ||
    pool.sha256 !== manifest.poolDefinitionSha256 ||
    pool.byteLength !== manifest.poolDefinitionByteLength
  ) {
    reasons.push("SEALED_REGISTRY_LINKAGE_MISMATCH");
    valid = false;
  }
  if (manifest.frozenSha256 !== manifest.observedSha256 || manifest.frozenByteLength !== manifest.observedByteLength) {
    reasons.push("SEALED_MANIFEST_HASH_MISMATCH");
    valid = false;
  }
  if (!manifest.hashVerified || !isSha256V0_1(manifest.frozenSha256)) {
    reasons.push("SEALED_MANIFEST_HASH_INVALID");
    valid = false;
  }
  if (manifest.frozen !== true) {
    reasons.push("SEALED_MANIFEST_NOT_FROZEN");
    valid = false;
  }
  if (manifest.selfReferential !== false) {
    reasons.push("SEALED_MANIFEST_SELF_REFERENTIAL");
    valid = false;
  }
  return valid;
};

export function validateM2FreshCandidatePoolAuthorityBoundaryV0_1(
  input: unknown,
): M2FreshCandidatePoolAuthorityBoundaryResultV0_1 {
  const reasons: M2FreshCandidatePoolAuthorityBoundaryReasonCodeV0_1[] = [
    "REAL_CANDIDATE_INTAKE_UNAUTHORIZED",
    "REAL_EXECUTION_UNAUTHORIZED",
  ];
  let valid = true;
  if (
    !isRecordV0_1(input) ||
    !hasExactKeysV0_1(input, [
      "schemaVersion",
      "syntheticFixture",
      "opaqueIdAuthority",
      "exclusionCoverage",
      "visibilityAndSealedLinkage",
      "executionBoundary",
    ]) ||
    input.schemaVersion !== M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1 ||
    input.syntheticFixture !== true ||
    !isRecordV0_1(input.executionBoundary) ||
    !hasExactKeysV0_1(input.executionBoundary, [
      "realCandidateIntakeAuthorized",
      "realExecutionAuthorized",
    ])
  ) {
    reasons.push("AUTHORITY_INPUT_MALFORMED");
    valid = false;
  } else {
    if (
      input.executionBoundary.realCandidateIntakeAuthorized !== false ||
      input.executionBoundary.realExecutionAuthorized !== false
    ) {
      reasons.push("REAL_AUTHORIZATION_REQUESTED");
      valid = false;
    }
  }
  valid = validateOpaqueIdAuthorityV0_1(input && isRecordV0_1(input) ? input.opaqueIdAuthority : undefined, reasons) && valid;
  valid = validateExclusionCoverageV0_1(input && isRecordV0_1(input) ? input.exclusionCoverage : undefined, reasons) && valid;
  valid = validateVisibilityAndLinkageV0_1(input && isRecordV0_1(input) ? input.visibilityAndSealedLinkage : undefined, reasons) && valid;
  if (
    isRecordV0_1(input) &&
    isRecordV0_1(input.opaqueIdAuthority) &&
    isIntegrityMetadataShapeV0_1(input.opaqueIdAuthority.registryIntegrity) &&
    isRecordV0_1(input.visibilityAndSealedLinkage) &&
    isRecordV0_1(input.visibilityAndSealedLinkage.sealedManifest) &&
    (input.visibilityAndSealedLinkage.sealedManifest.privateRegistrySha256 !==
      input.opaqueIdAuthority.registryIntegrity.frozenSha256 ||
      input.visibilityAndSealedLinkage.sealedManifest.privateRegistryByteLength !==
        input.opaqueIdAuthority.registryIntegrity.frozenByteLength)
  ) {
    reasons.push("SEALED_REGISTRY_LINKAGE_MISMATCH");
    valid = false;
  }
  if (valid) reasons.push("SYNTHETIC_AUTHORITY_METADATA_ACCEPTED");
  const reasonCodes = sortedReasonCodesV0_1(reasons);
  const blocked = reasonCodes.some(
    (reason) =>
      reason !== "REAL_CANDIDATE_INTAKE_UNAUTHORIZED" &&
      reason !== "REAL_EXECUTION_UNAUTHORIZED" &&
      reason !== "SYNTHETIC_AUTHORITY_METADATA_ACCEPTED",
  );
  return {
    status: !blocked && valid ? "SYNTHETIC_BCD_AUTHORITY_READY" : "BLOCKED",
    reasonCodes,
    summary: {
      schemaVersion: M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1,
      syntheticOnly: true,
      authorityDirections: ["B", "C", "D"],
      coverageStatus: !blocked && valid
        ? M2_COVERAGE_VERIFIED_FOR_DECLARED_SCOPE_V0_1
        : "BLOCKED",
      registryLinkage: !blocked && valid
        ? M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1
        : "BLOCKED",
      publicTargetSemanticsExposed: false,
    },
    realCandidateIntakeAuthorized: false,
    realExecutionAuthorized: false,
  };
}

export const canonicalSerializeM2FreshCandidatePoolAuthorityBoundaryV0_1 = (
  value: M2FreshCandidatePoolAuthorityBoundaryInputV0_1,
): string => canonicalSerializeOneEmbryoProofM2V0_1(value);

export const sha256M2FreshCandidatePoolAuthorityBoundaryV0_1 = (
  value: string | Buffer,
): string => sha256OneEmbryoProofM2V0_1(value);
