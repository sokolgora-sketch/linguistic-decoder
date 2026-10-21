import { createHash } from "node:crypto";
import {
  closeSync,
  constants as fsConstants,
  fstatSync,
  lstatSync,
  openSync,
  readFileSync,
  readdirSync,
  realpathSync,
} from "node:fs";
import { basename, dirname, isAbsolute, join, normalize, relative, sep } from "node:path";

export const M2_CONTROLLER_PRIVATE_BOUNDARY_SCHEMA_V0_1 =
  "open-instrument.m2-controller-private-boundary.v0.1" as const;
export const M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1 =
  "SINGLE_OPERATOR_REPRODUCIBLE_AUDIT" as const;
export const M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1 =
  "SEALED_MANIFEST_ONLY" as const;

export const M2_CONTROLLER_PRIVATE_EXCLUSION_CATEGORIES_V0_1 = [
  "baseline",
  "priorTarget",
  "priorReveal",
  "priorControl",
  "priorResearch",
  "embryoOrReplication",
] as const;

export const M2_CONTROLLER_COMMITMENT_PHASES_V0_1 = [
  "NAMESPACE_COMMITTED",
  "CANDIDATE_UNIVERSE_COMPOSED",
  "EXCLUSION_REVIEW_AND_REGISTRY_FROZEN",
  "OPAQUE_IDS_ASSIGNED",
  "TARGET_SELECTED",
] as const;

type ArtifactKindV0_1 =
  | "NAMESPACE_COMMITMENT"
  | "PUBLIC_POOL_DEFINITION"
  | "EXCLUSION_INVENTORY"
  | "PRIVATE_REGISTRY"
  | "SELECTION_RECORD"
  | "CHRONOLOGY_RECORD"
  | "SEALED_MANIFEST";

type ChronologyStatusV0_1 =
  | "SYNTHETIC_METADATA_ONLY"
  | "ACTUAL_OBSERVATION_VERIFIED"
  | "UNVERIFIED";

type ArtifactV0_1 = Readonly<{
  artifactId: string;
  kind: ArtifactKindV0_1;
  relativePath: string;
  expectedSha256: string;
  expectedByteLength: number;
  exclusionCategories: readonly string[];
  frozen: true;
  mutatedAfterFreeze: false;
}>;

type ChronologyEntryV0_1 = Readonly<{
  phase: (typeof M2_CONTROLLER_COMMITMENT_PHASES_V0_1)[number];
  artifactId: string;
  sha256: string;
  byteLength: number;
  ordinal: number;
  occurredAt: string;
  immutableEvidence: true;
  executed: false;
}>;

export type M2ControllerPrivateBoundaryInputV0_1 = Readonly<{
  schemaVersion: typeof M2_CONTROLLER_PRIVATE_BOUNDARY_SCHEMA_V0_1;
  syntheticFixture: true;
  auditProvenance: Readonly<{
    classification: typeof M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1;
    selfReviewStatus: "SELF_REVIEWED";
    independentHumanReviewerReference: null;
    claimsIndependentHumanReview: false;
  }>;
  privateRoot: string;
  forbiddenRoots: readonly string[];
  artifacts: readonly ArtifactV0_1[];
  manifestArtifactId: string;
  exclusionCoverage: Readonly<{
    artifactId: string;
    status: "VERIFIED_FOR_DECLARED_SCOPE" | "UNKNOWN" | "CONFLICTING";
    categories: Readonly<Record<(typeof M2_CONTROLLER_PRIVATE_EXCLUSION_CATEGORIES_V0_1)[number], "COVERED" | "UNKNOWN" | "CONFLICTING">>;
  }>;
  chronology: Readonly<{
    evidenceMode: "SYNTHETIC_CONTROLLED_OBSERVATION" | "METADATA_ONLY";
    controlledObservationVerified: boolean;
    entries: readonly ChronologyEntryV0_1[];
  }>;
  operatorProjection: Readonly<{
    serializedBytes: string;
    sha256: string;
    byteLength: number;
    frozen: true;
  }>;
  isolationEvidence: Readonly<{
    evidenceMode: "SYNTHETIC_CONTROLLED_OBSERVATION" | "METADATA_ONLY";
    filesystemBoundaryVerified: boolean;
    processBoundaryVerified: boolean;
    filesystemAccessAttempt: "DENIED" | "ALLOWED" | "UNKNOWN";
    processAccessAttempt: "DENIED" | "ALLOWED" | "UNKNOWN";
    privatePathNotExposed: boolean;
  }>;
  executionBoundary: Readonly<{
    realCandidateIntakeAuthorized: false;
    realKeyCreated: false;
    realIdsAssigned: false;
    realSelectionExecuted: false;
    realExecutionAuthorized: false;
  }>;
}>;

export type M2ControllerPrivateBoundaryReasonCodeV0_1 =
  | "INPUT_MALFORMED"
  | "SCHEMA_INVALID"
  | "SYNTHETIC_FIXTURE_REQUIRED"
  | "AUDIT_PROVENANCE_INVALID"
  | "FALSE_INDEPENDENT_HUMAN_REVIEW_CLAIM"
  | "PRIVATE_ROOT_PATH_INVALID"
  | "PRIVATE_ROOT_OVERLAPS_FORBIDDEN_ROOT"
  | "PRIVATE_ROOT_MISSING"
  | "PRIVATE_ROOT_NOT_DIRECTORY"
  | "PRIVATE_ROOT_SYMLINK"
  | "PRIVATE_ROOT_PERMISSIONS_INSUFFICIENT"
  | "PRIVATE_DIRECTORY_PERMISSIONS_INSUFFICIENT"
  | "UNEXPECTED_PRIVATE_PATH"
  | "PRIVATE_SYMLINK_PRESENT"
  | "ARTIFACT_RECORD_INVALID"
  | "DUPLICATE_ARTIFACT_ID"
  | "DUPLICATE_ARTIFACT_PATH"
  | "ARTIFACT_MISSING"
  | "ARTIFACT_NOT_REGULAR"
  | "ARTIFACT_PERMISSIONS_INSUFFICIENT"
  | "ARTIFACT_HASH_MISMATCH"
  | "ARTIFACT_BYTE_LENGTH_MISMATCH"
  | "ARTIFACT_IDENTITY_CHANGED"
  | "EXCLUSION_COVERAGE_MISSING"
  | "EXCLUSION_COVERAGE_UNKNOWN_OR_CONFLICTING"
  | "MANIFEST_MISSING"
  | "MANIFEST_INVALID"
  | "MANIFEST_DEPENDENCY_MISMATCH"
  | "PUBLIC_POOL_METADATA_INVALID"
  | "PUBLIC_TARGET_SEMANTICS_EXPOSED"
  | "BLIND_PROJECTION_INVALID"
  | "COMMITMENT_CHRONOLOGY_INVALID"
  | "COMMITMENT_CHRONOLOGY_UNVERIFIED"
  | "COMMITMENT_ORDER_INVALID"
  | "COMMITMENT_PHASE_EXECUTED_UNAUTHORIZED"
  | "ISOLATION_UNVERIFIED"
  | "BLIND_PRIVATE_ACCESS_OBSERVED"
  | "REAL_AUTHORIZATION_REQUESTED"
  | "SYNTHETIC_AUTHORITY_METADATA_ACCEPTED"
  | "INTERNAL_VALIDATION_FAILURE";

export type M2ControllerPrivateBoundaryResultV0_1 = Readonly<{
  status: "SYNTHETIC_BOUNDARY_READY" | "BLOCKED";
  reasonCodes: readonly M2ControllerPrivateBoundaryReasonCodeV0_1[];
  syntheticOnly: true;
  privateStorageVerified: boolean;
  artifactIntegrityVerified: boolean;
  sealedManifestVerified: boolean;
  commitmentChronologyVerified: boolean;
  commitmentChronologyStatus: ChronologyStatusV0_1;
  blindIsolationVerified: boolean;
  publicProjectionVerified: boolean;
  privateDataExposed: false;
  independentHumanReviewClaimed: false;
  realCandidateIntakeAuthorized: false;
  realKeyCreated: false;
  realIdsAssigned: false;
  realSelectionExecuted: false;
  realExecutionAuthorized: false;
}>;

const SHA256 = /^[0-9a-f]{64}$/u;
const REQUIRED_MANIFEST_KEYS = [
  "schemaVersion",
  "serializationProfile",
  "linkageMode",
  "dependencies",
  "targetBearingDataPublic",
  "selfReferential",
  "frozen",
] as const;
const REQUIRED_POOL_KEYS = [
  "schemaVersion",
  "serializationProfile",
  "containsTargetSemantics",
  "targetBearingFieldCount",
  "linkageMode",
  "frozen",
] as const;
const REQUIRED_PROJECTION_KEYS = [
  "claimBoundary",
  "schemaVersion",
  "structuralFingerprint",
] as const;
const REQUIRED_DEPENDENCY_KEYS = ["artifactId", "byteLength", "sha256"] as const;
const REQUIRED_ARTIFACT_KINDS: readonly ArtifactKindV0_1[] = [
  "NAMESPACE_COMMITMENT",
  "PUBLIC_POOL_DEFINITION",
  "EXCLUSION_INVENTORY",
  "PRIVATE_REGISTRY",
  "SELECTION_RECORD",
  "CHRONOLOGY_RECORD",
  "SEALED_MANIFEST",
];
const EXPECTED_CHRONOLOGY_ARTIFACT_KINDS: readonly ArtifactKindV0_1[] = [
  "NAMESPACE_COMMITMENT",
  "PUBLIC_POOL_DEFINITION",
  "EXCLUSION_INVENTORY",
  "PRIVATE_REGISTRY",
  "SELECTION_RECORD",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const exactKeys = (value: Record<string, unknown>, keys: readonly string[]) => {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  );
};

const nonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;
const sha256 = (value: Buffer | string): string =>
  createHash("sha256").update(value).digest("hex");
const canonical = (value: unknown): string => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map(canonical).join(",") + "]";
  }
  const record = value as Record<string, unknown>;
  return (
    "{" +
    Object.keys(record)
      .sort()
      .map((key) => JSON.stringify(key) + ":" + canonical(record[key]))
      .join(",") +
    "}"
  );
};
const sorted = (values: readonly string[]): string[] =>
  [...values].sort((left, right) =>
    left < right ? -1 : left > right ? 1 : 0,
  );
const sameSortedStrings = (left: readonly string[], right: readonly string[]) => {
  const sortedLeft = sorted(left);
  const sortedRight = sorted(right);
  return (
    sortedLeft.length === sortedRight.length &&
    sortedLeft.every((value, index) => value === sortedRight[index])
  );
};
const hasExactList = (values: unknown, expected: readonly string[]) =>
  Array.isArray(values) &&
  values.every((value) => typeof value === "string") &&
  sameSortedStrings(values as string[], expected) &&
  values.length === expected.length;
const isArtifactKind = (value: unknown): value is ArtifactKindV0_1 =>
  typeof value === "string" &&
  (REQUIRED_ARTIFACT_KINDS as readonly string[]).includes(value);
const isIsoUtcTimestamp = (value: unknown): value is string =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/u.test(value) &&
  Number.isFinite(Date.parse(value));
const utcTimestampMillis = (value: unknown): number | null => {
  if (!isIsoUtcTimestamp(value)) return null;
  const millis = Date.parse(value);
  return Number.isFinite(millis) ? millis : null;
};
const isExactProjectionV0_1 = (value: unknown): value is Record<string, unknown> => {
  if (!isRecord(value) || !exactKeys(value, REQUIRED_PROJECTION_KEYS)) return false;
  return (
    value.schemaVersion === "synthetic-operator-projection.v0.1" &&
    hasExactList(value.claimBoundary, ["synthetic-only"]) &&
    typeof value.structuralFingerprint === "string" &&
    SHA256.test(value.structuralFingerprint)
  );
};
const safeAbsolutePath = (value: unknown): value is string => {
  if (typeof value !== "string" || !isAbsolute(value) || value.includes("\0")) {
    return false;
  }
  const normalized = normalize(value);
  return normalized === value && !value.split(sep).some((part) => part === "." || part === "..");
};
const safeRelativePath = (value: unknown): value is string => {
  if (typeof value !== "string" || !value || value.includes("\0") || value.includes("\\")) {
    return false;
  }
  const normalized = normalize(value);
  return !isAbsolute(value) && normalized === value && !value.split("/").some((part) => part === "." || part === "..");
};
const inside = (child: string, parent: string) => {
  if (child === parent) return true;
  const boundary = parent.endsWith(sep) ? parent : parent + sep;
  return child.startsWith(boundary);
};
const canonicalComparisonPath = (value: string): string | null => {
  try {
    return realpathSync(value);
  } catch {
    try {
      return join(realpathSync(dirname(value)), basename(value));
    } catch {
      return null;
    }
  }
};

const fail = (
  reasonCodes: M2ControllerPrivateBoundaryReasonCodeV0_1[],
  flags: {
    privateStorageVerified: boolean;
    artifactIntegrityVerified: boolean;
    sealedManifestVerified: boolean;
    commitmentChronologyVerified: boolean;
    commitmentChronologyStatus: ChronologyStatusV0_1;
    blindIsolationVerified: boolean;
    publicProjectionVerified: boolean;
  },
): M2ControllerPrivateBoundaryResultV0_1 => ({
  status: "BLOCKED",
  reasonCodes: [...new Set(reasonCodes)].sort(),
  syntheticOnly: true,
  ...flags,
  privateDataExposed: false,
  independentHumanReviewClaimed: false,
  realCandidateIntakeAuthorized: false,
  realKeyCreated: false,
  realIdsAssigned: false,
  realSelectionExecuted: false,
  realExecutionAuthorized: false,
});

const inspectPrivateTreeV0_1 = (
  root: string,
  allowed: ReadonlySet<string>,
): M2ControllerPrivateBoundaryReasonCodeV0_1[] => {
  const reasons: M2ControllerPrivateBoundaryReasonCodeV0_1[] = [];
  const walk = (directory: string) => {
    let entries;
    try {
      entries = readdirSync(directory, { withFileTypes: true });
    } catch {
      reasons.push("PRIVATE_ROOT_MISSING");
      return;
    }
    for (const entry of entries) {
      const full = join(directory, entry.name);
      const rel = relative(root, full);
      if (entry.isSymbolicLink()) {
        reasons.push("PRIVATE_SYMLINK_PRESENT");
        continue;
      }
      if (entry.isDirectory()) {
        try {
          const directoryStat = lstatSync(full);
          if ((directoryStat.mode & 0o077) !== 0) {
            reasons.push("PRIVATE_DIRECTORY_PERMISSIONS_INSUFFICIENT");
          }
        } catch {
          reasons.push("PRIVATE_ROOT_MISSING");
        }
        walk(full);
      } else if (!entry.isFile() || !allowed.has(rel)) {
        reasons.push("UNEXPECTED_PRIVATE_PATH");
      }
    }
  };
  walk(root);
  return reasons;
};

export function verifyM2ControllerPrivateBoundaryV0_1(
  input: unknown,
): M2ControllerPrivateBoundaryResultV0_1 {
  const baseFlags = {
    privateStorageVerified: false,
    artifactIntegrityVerified: false,
    sealedManifestVerified: false,
    commitmentChronologyVerified: false,
    commitmentChronologyStatus: "UNVERIFIED" as const,
    blindIsolationVerified: false,
    publicProjectionVerified: false,
  };
  if (!isRecord(input)) return fail(["INPUT_MALFORMED"], baseFlags);
  if (
    input.schemaVersion !== M2_CONTROLLER_PRIVATE_BOUNDARY_SCHEMA_V0_1 ||
    input.syntheticFixture !== true
  ) {
    return fail(["SCHEMA_INVALID", "SYNTHETIC_FIXTURE_REQUIRED"], baseFlags);
  }
  const provenance = input.auditProvenance;
  if (
    !isRecord(provenance) ||
    provenance.classification !==
      M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1 ||
    provenance.selfReviewStatus !== "SELF_REVIEWED" ||
    provenance.independentHumanReviewerReference !== null ||
    provenance.claimsIndependentHumanReview !== false
  ) {
    return fail(["AUDIT_PROVENANCE_INVALID", "FALSE_INDEPENDENT_HUMAN_REVIEW_CLAIM"], baseFlags);
  }
  const execution = input.executionBoundary;
  if (
    !isRecord(execution) ||
    execution.realCandidateIntakeAuthorized !== false ||
    execution.realKeyCreated !== false ||
    execution.realIdsAssigned !== false ||
    execution.realSelectionExecuted !== false ||
    execution.realExecutionAuthorized !== false
  ) {
    return fail(["REAL_AUTHORIZATION_REQUESTED"], baseFlags);
  }
  if (!safeAbsolutePath(input.privateRoot)) {
    return fail(["PRIVATE_ROOT_PATH_INVALID"], baseFlags);
  }
  if (
    !Array.isArray(input.forbiddenRoots) ||
    !input.forbiddenRoots.every(safeAbsolutePath)
  ) {
    return fail(["PRIVATE_ROOT_PATH_INVALID"], baseFlags);
  }
  const root = input.privateRoot;
  const forbiddenRoots = input.forbiddenRoots as string[];
  let rootStat;
  try {
    rootStat = lstatSync(root);
    if (!rootStat.isDirectory()) return fail(["PRIVATE_ROOT_NOT_DIRECTORY"], baseFlags);
    if (rootStat.isSymbolicLink()) return fail(["PRIVATE_ROOT_SYMLINK"], baseFlags);
    if (realpathSync(root) !== root) return fail(["PRIVATE_ROOT_SYMLINK"], baseFlags);
    if ((rootStat.mode & 0o077) !== 0) {
      return fail(["PRIVATE_ROOT_PERMISSIONS_INSUFFICIENT"], baseFlags);
    }
  } catch {
    return fail(["PRIVATE_ROOT_MISSING"], baseFlags);
  }
  const canonicalRoot = realpathSync(root);
  const canonicalForbiddenRoots = forbiddenRoots.map(canonicalComparisonPath);
  if (canonicalForbiddenRoots.some((forbidden) => forbidden === null)) {
    return fail(["PRIVATE_ROOT_PATH_INVALID"], baseFlags);
  }
  if (
    canonicalForbiddenRoots.some(
      (forbidden) =>
        forbidden !== null &&
        (inside(canonicalRoot, forbidden) || inside(forbidden, canonicalRoot)),
    )
  ) {
    return fail(["PRIVATE_ROOT_OVERLAPS_FORBIDDEN_ROOT"], baseFlags);
  }
  const artifacts = input.artifacts;
  if (!Array.isArray(artifacts)) return fail(["ARTIFACT_RECORD_INVALID"], baseFlags);
  const artifactRecords = artifacts as unknown[];
  const ids = new Set<string>();
  const paths = new Set<string>();
  const metadata = new Map<string, ArtifactV0_1>();
  const contents = new Map<string, Buffer>();
  const reasons: M2ControllerPrivateBoundaryReasonCodeV0_1[] = [];
  for (const value of artifactRecords) {
    if (
      !isRecord(value) ||
      !nonEmptyString(value.artifactId) ||
      !isArtifactKind(value.kind) ||
      !safeRelativePath(value.relativePath) ||
      typeof value.expectedSha256 !== "string" ||
      !SHA256.test(value.expectedSha256) ||
      typeof value.expectedByteLength !== "number" ||
      !Number.isInteger(value.expectedByteLength) ||
      value.expectedByteLength < 0 ||
      !hasExactList(value.exclusionCategories, []) ||
      value.frozen !== true ||
      value.mutatedAfterFreeze !== false
    ) {
      reasons.push("ARTIFACT_RECORD_INVALID");
      continue;
    }
    if (ids.has(value.artifactId)) reasons.push("DUPLICATE_ARTIFACT_ID");
    if (paths.has(value.relativePath)) reasons.push("DUPLICATE_ARTIFACT_PATH");
    ids.add(value.artifactId);
    paths.add(value.relativePath);
    metadata.set(value.artifactId, value as unknown as ArtifactV0_1);
  }
  if (
    metadata.size !== REQUIRED_ARTIFACT_KINDS.length ||
    !REQUIRED_ARTIFACT_KINDS.every(
      (kind) => [...metadata.values()].filter((artifact) => artifact.kind === kind).length === 1,
    )
  ) {
    reasons.push("ARTIFACT_RECORD_INVALID");
  }
  if (
    !nonEmptyString(input.manifestArtifactId) ||
    metadata.get(input.manifestArtifactId)?.kind !== "SEALED_MANIFEST"
  ) {
    reasons.push("MANIFEST_MISSING");
  }
  const allowedPaths = new Set(paths);
  for (const artifact of metadata.values()) {
    const full = join(root, artifact.relativePath);
    let bytes: Buffer | null = null;
    let descriptor: number | null = null;
    try {
      const noFollow = fsConstants.O_NOFOLLOW ?? 0;
      descriptor = openSync(full, fsConstants.O_RDONLY | noFollow);
      const before = fstatSync(descriptor);
      if (!before.isFile()) {
        reasons.push("ARTIFACT_NOT_REGULAR");
      } else if ((before.mode & 0o077) !== 0) {
        reasons.push("ARTIFACT_PERMISSIONS_INSUFFICIENT");
      } else {
        bytes = readFileSync(descriptor);
        const after = fstatSync(descriptor);
        if (
          before.dev !== after.dev ||
          before.ino !== after.ino ||
          before.size !== after.size ||
          before.mtimeMs !== after.mtimeMs ||
          before.ctimeMs !== after.ctimeMs
        ) {
          reasons.push("ARTIFACT_IDENTITY_CHANGED");
        }
      }
    } catch {
      reasons.push("ARTIFACT_MISSING");
    } finally {
      if (descriptor !== null) closeSync(descriptor);
    }
    if (!bytes) {
      continue;
    }
    if (bytes.length !== artifact.expectedByteLength) reasons.push("ARTIFACT_BYTE_LENGTH_MISMATCH");
    if (sha256(bytes) !== artifact.expectedSha256) reasons.push("ARTIFACT_HASH_MISMATCH");
    contents.set(artifact.artifactId, bytes);
  }
  reasons.push(...inspectPrivateTreeV0_1(root, allowedPaths));
  if (reasons.length > 0) return fail(reasons, baseFlags);
  const storageFlags = { ...baseFlags, privateStorageVerified: true, artifactIntegrityVerified: true };
  const coverage = input.exclusionCoverage;
  const coverageCategories =
    isRecord(coverage) && isRecord(coverage.categories)
      ? coverage.categories
      : null;
  if (
    !isRecord(coverage) ||
    coverage.status !== "VERIFIED_FOR_DECLARED_SCOPE" ||
    !nonEmptyString(coverage.artifactId) ||
    metadata.get(coverage.artifactId)?.kind !== "EXCLUSION_INVENTORY" ||
    !coverageCategories ||
    !hasExactList(
      Object.keys(coverageCategories),
      M2_CONTROLLER_PRIVATE_EXCLUSION_CATEGORIES_V0_1,
    ) ||
    !M2_CONTROLLER_PRIVATE_EXCLUSION_CATEGORIES_V0_1.every(
      (category) => coverageCategories[category] === "COVERED",
    )
  ) {
    return fail(["EXCLUSION_COVERAGE_MISSING", "EXCLUSION_COVERAGE_UNKNOWN_OR_CONFLICTING"], storageFlags);
  }
  const manifestId =
    typeof input.manifestArtifactId === "string"
      ? input.manifestArtifactId
      : "";
  const manifestBytes = contents.get(manifestId);
  if (!manifestBytes) return fail(["MANIFEST_MISSING"], storageFlags);
  let manifest: Record<string, unknown>;
  try {
    const text = manifestBytes.toString("utf8");
    const parsedManifest = JSON.parse(text) as unknown;
    if (!isRecord(parsedManifest)) throw new Error("manifest must be an object");
    manifest = parsedManifest;
    if (canonical(manifest) + "\n" !== text) throw new Error("non-canonical");
  } catch {
    return fail(["MANIFEST_INVALID"], storageFlags);
  }
  if (
    !exactKeys(manifest, REQUIRED_MANIFEST_KEYS) ||
    manifest.schemaVersion !== "open-instrument.m2-sealed-manifest.v0.1" ||
    manifest.serializationProfile !== "canonical-json-v0.1" ||
    manifest.linkageMode !== M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1 ||
    manifest.targetBearingDataPublic !== false ||
    manifest.selfReferential !== false ||
    manifest.frozen !== true ||
    !Array.isArray(manifest.dependencies)
  ) {
    return fail(["MANIFEST_INVALID"], storageFlags);
  }
  const expectedDependencies = [...metadata.keys()]
    .filter((id) => id !== manifestId)
    .sort();
  const dependencyRecords = manifest.dependencies as unknown[];
  const dependencyIds: string[] = [];
  if (dependencyRecords.length !== expectedDependencies.length) {
    return fail(["MANIFEST_DEPENDENCY_MISMATCH"], storageFlags);
  }
  for (const dependency of dependencyRecords) {
    if (
      !isRecord(dependency) ||
      !exactKeys(dependency, REQUIRED_DEPENDENCY_KEYS) ||
      !nonEmptyString(dependency.artifactId) ||
      typeof dependency.sha256 !== "string" ||
      !SHA256.test(dependency.sha256) ||
      typeof dependency.byteLength !== "number" ||
      !Number.isInteger(dependency.byteLength) ||
      dependency.byteLength < 0
    ) {
      return fail(["MANIFEST_DEPENDENCY_MISMATCH"], storageFlags);
    }
    dependencyIds.push(dependency.artifactId);
  }
  if (!sameSortedStrings(dependencyIds, expectedDependencies)) {
    return fail(["MANIFEST_DEPENDENCY_MISMATCH"], storageFlags);
  }
  for (const dependency of dependencyRecords) {
    const record = dependency as Record<string, unknown>;
    const artifact = metadata.get(record.artifactId as string);
    if (
      !artifact ||
      record.sha256 !== artifact.expectedSha256 ||
      record.byteLength !== artifact.expectedByteLength ||
      !contents.has(artifact.artifactId)
    ) {
      return fail(["MANIFEST_DEPENDENCY_MISMATCH"], storageFlags);
    }
  }
  const pool = metadata.values();
  let publicPool: Record<string, unknown> | null = null;
  for (const artifact of pool) {
    if (artifact.kind === "PUBLIC_POOL_DEFINITION") {
      const bytes = contents.get(artifact.artifactId);
      if (!bytes) return fail(["PUBLIC_POOL_METADATA_INVALID"], storageFlags);
      try {
        const text = bytes.toString("utf8");
        const parsedPool = JSON.parse(text) as unknown;
        if (!isRecord(parsedPool)) throw new Error("public pool must be an object");
        publicPool = parsedPool;
        if (canonical(publicPool) + "\n" !== text) throw new Error("non-canonical");
      } catch {
        return fail(["PUBLIC_POOL_METADATA_INVALID"], storageFlags);
      }
      if (
        !exactKeys(publicPool, REQUIRED_POOL_KEYS) ||
        publicPool.schemaVersion !== "open-instrument.m2-public-pool-definition.v0.1" ||
        publicPool.serializationProfile !== "canonical-json-v0.1" ||
        publicPool.containsTargetSemantics !== false ||
        publicPool.targetBearingFieldCount !== 0 ||
        publicPool.linkageMode !== M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1 ||
        publicPool.frozen !== true
      ) {
        return fail(["PUBLIC_POOL_METADATA_INVALID", "PUBLIC_TARGET_SEMANTICS_EXPOSED"], storageFlags);
      }
    }
  }
  if (!publicPool) return fail(["PUBLIC_POOL_METADATA_INVALID"], storageFlags);
  const chronology = input.chronology;
  if (
    !isRecord(chronology) ||
    chronology.evidenceMode !== "SYNTHETIC_CONTROLLED_OBSERVATION" ||
    chronology.controlledObservationVerified !== true ||
    !Array.isArray(chronology.entries) ||
    chronology.entries.length !== M2_CONTROLLER_COMMITMENT_PHASES_V0_1.length
  ) {
    return fail(["COMMITMENT_CHRONOLOGY_UNVERIFIED"], storageFlags);
  }
  const entries = chronology.entries as unknown[];
  for (let index = 0; index < entries.length; index += 1) {
    const value = entries[index];
    if (
      !isRecord(value) ||
      value.phase !== M2_CONTROLLER_COMMITMENT_PHASES_V0_1[index] ||
      value.ordinal !== index ||
      !nonEmptyString(value.artifactId) ||
      !metadata.has(value.artifactId) ||
      typeof value.sha256 !== "string" ||
      !SHA256.test(value.sha256) ||
      !Number.isInteger(value.byteLength) ||
      value.immutableEvidence !== true ||
      value.executed !== false ||
      !isIsoUtcTimestamp(value.occurredAt)
    ) {
      return fail(["COMMITMENT_CHRONOLOGY_INVALID"], storageFlags);
    }
    const occurredAtMillis = utcTimestampMillis(value.occurredAt);
    if (occurredAtMillis === null) {
      return fail(["COMMITMENT_CHRONOLOGY_INVALID"], storageFlags);
    }
    const artifact = metadata.get(value.artifactId);
    if (
      !artifact ||
      artifact.kind !== EXPECTED_CHRONOLOGY_ARTIFACT_KINDS[index] ||
      value.sha256 !== artifact.expectedSha256 ||
      value.byteLength !== artifact.expectedByteLength
    ) {
      return fail(["COMMITMENT_CHRONOLOGY_INVALID"], storageFlags);
    }
    const previousEntry = entries[index - 1] as Record<string, unknown> | undefined;
    const previousOccurredAtMillis = utcTimestampMillis(previousEntry?.occurredAt);
    if (
      index > 0 &&
      (previousOccurredAtMillis === null || occurredAtMillis <= previousOccurredAtMillis)
    ) {
      return fail(["COMMITMENT_ORDER_INVALID"], storageFlags);
    }
  }
  const projection = input.operatorProjection;
  let publicProjectionVerified = false;
  if (isRecord(projection) && typeof projection.serializedBytes === "string") {
    try {
      const parsedProjection = JSON.parse(projection.serializedBytes) as unknown;
      publicProjectionVerified =
        projection.serializedBytes.endsWith("\n") &&
        typeof projection.sha256 === "string" &&
        SHA256.test(projection.sha256) &&
        projection.sha256 === sha256(projection.serializedBytes) &&
        projection.byteLength === Buffer.byteLength(projection.serializedBytes) &&
        projection.frozen === true &&
        canonical(parsedProjection) + "\n" === projection.serializedBytes &&
        isExactProjectionV0_1(parsedProjection);
    } catch {
      publicProjectionVerified = false;
    }
  }
  if (!publicProjectionVerified) return fail(["BLIND_PROJECTION_INVALID"], storageFlags);
  const isolation = input.isolationEvidence;
  if (!isRecord(isolation)) return fail(["ISOLATION_UNVERIFIED"], storageFlags);
  if (
    isolation.filesystemAccessAttempt === "ALLOWED" ||
    isolation.processAccessAttempt === "ALLOWED"
  ) {
    return fail(["BLIND_PRIVATE_ACCESS_OBSERVED"], storageFlags);
  }
  if (
    isolation.evidenceMode !== "SYNTHETIC_CONTROLLED_OBSERVATION" ||
    isolation.filesystemBoundaryVerified !== true ||
    isolation.processBoundaryVerified !== true ||
    isolation.filesystemAccessAttempt !== "DENIED" ||
    isolation.processAccessAttempt !== "DENIED" ||
    isolation.privatePathNotExposed !== true
  ) {
    return fail(["ISOLATION_UNVERIFIED"], storageFlags);
  }
  return {
    status: "SYNTHETIC_BOUNDARY_READY",
    reasonCodes: ["SYNTHETIC_AUTHORITY_METADATA_ACCEPTED"],
    syntheticOnly: true,
    privateStorageVerified: true,
    artifactIntegrityVerified: true,
    sealedManifestVerified: true,
    commitmentChronologyVerified: false,
    commitmentChronologyStatus: "SYNTHETIC_METADATA_ONLY",
    blindIsolationVerified: true,
    publicProjectionVerified: true,
    privateDataExposed: false,
    independentHumanReviewClaimed: false,
    realCandidateIntakeAuthorized: false,
    realKeyCreated: false,
    realIdsAssigned: false,
    realSelectionExecuted: false,
    realExecutionAuthorized: false,
  };
}
