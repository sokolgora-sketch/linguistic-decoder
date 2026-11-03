import { createHash } from "node:crypto";
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";
import { basename, dirname, join, resolve, sep } from "node:path";

import {
  M2_CONTROLLER_COMMITMENT_PHASES_V0_1,
  M2_CONTROLLER_PRIVATE_BOUNDARY_SCHEMA_V0_1,
  M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
  M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1 as CONTROLLER_AUDIT_CLASSIFICATION,
  verifyM2ControllerPrivateBoundaryV0_1,
  type M2ControllerPrivateBoundaryInputV0_1,
} from "../../src/shared/openInstrument/m2ControllerPrivateBoundary.v0_1";
import {
  buildSyntheticM2ArtifactCoreV0_1,
  validateM2SyntheticEligibilityPoolV0_1,
  type M2SyntheticCandidateEligibilityDeclarationV0_1,
} from "../../src/shared/openInstrument/m2SyntheticArtifactBuilderCore.v0_1";
import {
  buildM2SoloAiBlindResearchHandoffV0_1,
  buildM2SoloAiReviewerProjectionV0_1,
  evaluateM2SoloAiReviewDecisionV0_1,
  M2_SOLO_AI_REVIEW_CHECKS_V0_1,
  M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1,
  M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1,
  isValidM2SoloAiReviewerIdentityV0_1,
  verifyM2SoloAiReviewerProjectionReadOnlyV0_1,
  type M2SoloAiReviewCheckStatusV0_1,
  type M2SoloAiReviewDecisionV0_1,
  type M2SoloAiReviewStatusV0_1,
} from "../../src/shared/openInstrument/m2SoloAiReviewWorkflow.v0_1";
import {
  canonicalSerializeM2SingleOperatorAuditV0_1,
  M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1,
  M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1,
  M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
  M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_SCHEMA_V0_1,
  sha256M2SingleOperatorAuditV0_1,
  verifyM2SingleOperatorReproducibleAuditV0_1,
  type M2SingleOperatorReproducibleAuditInputV0_1,
} from "../../src/shared/openInstrument/m2SingleOperatorReproducibleAudit.v0_1";
import {
  canonicalSerializeOneEmbryoProofM2V0_1,
  sha256OneEmbryoProofM2V0_1,
  type M2BlindPayloadV0_1,
} from "../../src/shared/openInstrument/oneEmbryoProofM2Preregistration.v0_1";
import {
  SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
  validateSourceEntryAttestationV1,
} from "../../src/shared/openInstrument/sourceEntryAttestation.v1";
import {
  M2_COVERAGE_VERIFIED_FOR_DECLARED_SCOPE_V0_1,
  M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1,
  M2_OPAQUE_ID_ALGORITHM_V0_1,
  M2_OPAQUE_ID_SERIALIZATION_PROFILE_V0_1,
  validateM2FreshCandidatePoolAuthorityBoundaryV0_1,
} from "../../src/shared/openInstrument/m2FreshCandidatePoolAuthorityBoundary.v0_1";

const ROOT = process.cwd();
const DEFAULT_OUTPUT = join("/private/tmp", `open-instrument-m2-solo-ai-review-packet-${Date.now()}-${process.pid}.json`);
const PREREGISTRATION_PATH = "docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/preregistration.json";
const EXPECTED_PREREGISTRATION_SHA256 = "28bfab132990c4f67313462d076e44db538927e8a132421b7af71aeccd428f93";
const SOURCE_BYTES = "synthetic-source-bytes-v0.1";
const INVENTORY_BYTES = "synthetic-exclusion-inventory-v0.1";

const sha256 = (value: Buffer | string) => createHash("sha256").update(value).digest("hex");
const byteLength = (value: Buffer | string) => Buffer.isBuffer(value) ? value.byteLength : Buffer.byteLength(value, "utf8");
const canonical = (value: unknown): string => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const isWithin = (path: string, root: string) => path === root || path.startsWith(`${root}${sep}`);

const temporaryRoots = () => [...new Set([tmpdir(), "/private/tmp"]
  .filter((path) => existsSync(path))
  .map((path) => realpathSync(path)))];

const resolveExistingTemporaryFile = (path: string, repo: string) => {
  const canonicalPath = realpathSync(resolve(path));
  const roots = temporaryRoots();
  if (isWithin(canonicalPath, repo) || !roots.some((root) => isWithin(canonicalPath, root))) {
    throw new Error("review decision input must be an existing file under an OS temporary directory and outside the repository");
  }
  return canonicalPath;
};

const resolveNewTemporaryOutput = (path: string, repo: string) => {
  const candidate = resolve(path);
  const realParent = realpathSync(dirname(candidate));
  const roots = temporaryRoots();
  if (isWithin(realParent, repo) || !roots.some((root) => isWithin(realParent, root))) {
    throw new Error("review packet output must use an existing OS temporary directory outside the repository");
  }
  return join(realParent, basename(candidate));
};

const sanitizeDecisionForPacket = (value: unknown) => {
  if (!isRecord(value)) return null;
  const identity = isValidM2SoloAiReviewerIdentityV0_1(value.reviewerIdentity) ? value.reviewerIdentity : null;
  const rawChecks = isRecord(value.checks) ? value.checks : {};
  const status = (item: unknown): M2SoloAiReviewStatusV0_1 =>
    item === "PASS" || item === "FAIL" || item === "UNKNOWN" ? item : "UNKNOWN";
  const sha = (item: unknown): string | null => typeof item === "string" && /^[0-9a-f]{64}$/u.test(item) ? item : null;
  const safeCodes = (items: unknown): string[] => Array.isArray(items)
    ? items.filter((item): item is string => typeof item === "string" && /^[A-Z][A-Z0-9_.:-]{0,127}$/u.test(item))
    : [];
  return {
    schemaVersion: value.schemaVersion === M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1 ? value.schemaVersion : null,
    reviewerIdentity: {
      provider: identity?.provider ?? null,
      agent: identity?.agent ?? null,
      modelId: identity?.modelId ?? null,
      sessionId: identity?.sessionId ?? null,
      identityBasis: identity?.identityBasis ?? null,
    },
    classification: value.classification === M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1 ? value.classification : null,
    outcome: status(value.outcome),
    reviewedInputSha256: sha(value.reviewedInputSha256),
    reviewedArtifactSha256s: Array.isArray(value.reviewedArtifactSha256s)
      ? value.reviewedArtifactSha256s.map(sha).filter((item): item is string => item !== null)
      : [],
    selectionFingerprintBefore: sha(value.selectionFingerprintBefore),
    selectionFingerprintAfter: sha(value.selectionFingerprintAfter),
    checks: Object.fromEntries(M2_SOLO_AI_REVIEW_CHECKS_V0_1.map((check) => [check, status(rawChecks[check])])) as M2SoloAiReviewDecisionV0_1["checks"],
    conflicts: safeCodes(value.conflicts),
    failures: safeCodes(value.failures),
    claimsHumanIndependentReview: value.claimsHumanIndependentReview === false ? false : true,
  };
};

const attestation = () => ({
  schemaVersion: SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
  attestationId: "synthetic-attestation-v0.1",
  sourceTraditionId: "synthetic-source-tradition-v0.1",
  sourceTitle: "Synthetic source",
  sourceAuthorOrEditor: null,
  sourcePublisherOrHost: "Synthetic host",
  sourceDateOrVersion: "synthetic-v0.1",
  sourceRepositoryCommit: "synthetic-commit-v0.1",
  sourceFilePath: "synthetic/source.json",
  sourceUrlOrArchiveRef: "synthetic://source",
  sourceHashOrArchiveHash: sha256M2SingleOperatorAuditV0_1(SOURCE_BYTES),
  sourceForm: "synthetic-form",
  sourceFormNormalization: "EXACT_PRESERVED" as const,
  sourceAttestation: "SOURCE_FORM_OR_ENTRY_ATTESTED" as const,
  entries: [{
    entryId: "entry-1",
    entryKey: "synthetic-form",
    entryLocator: "entry-1",
    sourceForm: "synthetic-form",
    senses: [{
      senseId: "sense-1",
      senseLocator: "sense-1",
      text: "substantive synthetic sense",
      contentStatus: "SUBSTANTIVE_LEXICAL_SENSE" as const,
    }],
    senseSelectionStatus: "EXPLICITLY_RESOLVED" as const,
    selectedSenseId: "sense-1",
  }],
  entrySelectionStatus: "EXPLICITLY_RESOLVED" as const,
  selectedEntryId: "entry-1",
});

const publicProjection = () => {
  const value = {
    schemaVersion: "m2-public-pool-definition.v0.1",
    serializationProfile: "canonical-json-v0.1",
    scopeId: "synthetic-scope-v0.1",
    scopeVersion: "0.1",
    containsTargetSemantics: false,
    targetBearingFieldCount: 0,
    auditClassification: M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
    selectionPolicyId: M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1,
    selectionExecuted: false,
    realCandidateIntakeAuthorized: false,
    realExecutionAuthorized: false,
  };
  const serializedBytes = `${JSON.stringify(value, Object.keys(value).sort())}\n`;
  return { serializedBytes, sha256: sha256M2SingleOperatorAuditV0_1(serializedBytes), byteLength: byteLength(serializedBytes), frozen: true as const };
};

const buildSingleOperatorAudit = (): M2SingleOperatorReproducibleAuditInputV0_1 => {
  const audit = {
    schemaVersion: M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_SCHEMA_V0_1,
    auditMode: "SYNTHETIC_FIXTURE" as const,
    classification: M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
    controller: {
      controllerReference: "synthetic-controller-v0.1",
      declaredAt: "2026-11-03T00:00:00Z",
      selfReviewStatus: "SELF_REVIEWED" as const,
      independentReviewerReference: null,
      claimsIndependentHumanReview: false as const,
    },
    declaredScope: {
      scopeId: "synthetic-scope-v0.1",
      scopeVersion: "0.1",
      evidenceArtifactIds: ["source-1", "inventory-1"],
      exclusionCategories: [...M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1],
      priorUsePolicy: "UNKNOWN_OR_CONFLICTING_FAIL_CLOSED" as const,
    },
    evidenceArtifacts: [
      {
        artifactId: "source-1",
        kind: "SOURCE" as const,
        sourceReference: "synthetic://source/source.json",
        sourceRevisionOrAccessDate: "synthetic-v0.1",
        expectedSha256: sha256M2SingleOperatorAuditV0_1(SOURCE_BYTES),
        expectedByteLength: byteLength(SOURCE_BYTES),
        declaredCategories: [] as const,
      },
      {
        artifactId: "inventory-1",
        kind: "EXCLUSION_INVENTORY" as const,
        sourceReference: "synthetic://inventory/exclusions.json",
        sourceRevisionOrAccessDate: "synthetic-v0.1",
        expectedSha256: sha256M2SingleOperatorAuditV0_1(INVENTORY_BYTES),
        expectedByteLength: byteLength(INVENTORY_BYTES),
        declaredCategories: [...M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1],
      },
    ],
    candidateRecords: [{
      opaqueCandidateId: "m2:synthetic-a",
      sourceArtifactId: "source-1",
      sourceEntryReference: "entry-1",
      sourceSenseReference: "sense-1",
      sourceAttestation: attestation(),
      sourceAuthorityStatus: "VERIFIED" as const,
      senseAuthorityStatus: "RESOLVED_ONE_REVIEWABLE_SENSE" as const,
      priorUse: {
        baseline: "ABSENT" as const,
        priorTarget: "ABSENT" as const,
        priorReveal: "ABSENT" as const,
        priorControl: "ABSENT" as const,
        priorResearch: "ABSENT" as const,
        embryoOrReplication: "ABSENT" as const,
      },
      declaredDecision: "ELIGIBLE" as const,
      declaredReasonCodes: ["ELIGIBLE_AFTER_FAIL_CLOSED_AUDIT"],
      manualPreference: false as const,
    }],
    keyBoundary: {
      algorithm: "HMAC-SHA256" as const,
      algorithmVersion: "0.1" as const,
      commitmentStatus: "NOT_CREATED" as const,
      commitmentSha256: null,
      commitmentByteLength: null,
      generationAuthorized: false as const,
      realKeyCreated: false as const,
      rotationProhibited: true as const,
    },
    selectionPolicy: {
      selectorId: M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1,
      selectionCount: 1 as const,
      randomness: "NOT_USED" as const,
      manualPreference: false as const,
      selectionExecuted: false as const,
    },
    publicProjection: publicProjection(),
    executionBoundary: {
      realCandidateIntakeAuthorized: false as const,
      realSelectionExecuted: false as const,
      realExecutionAuthorized: false as const,
    },
    auditIntegrity: {
      payloadSha256: "0".repeat(64),
      payloadByteLength: 0,
      selfReferential: false as const,
      frozen: true as const,
    },
  };
  const serialized = canonicalSerializeM2SingleOperatorAuditV0_1(audit);
  return {
    ...audit,
    auditIntegrity: {
      ...audit.auditIntegrity,
      payloadSha256: sha256M2SingleOperatorAuditV0_1(serialized),
      payloadByteLength: byteLength(serialized),
    },
  };
};

const declaration = (opaqueCandidateId: string): M2SyntheticCandidateEligibilityDeclarationV0_1 => ({
  opaqueCandidateId,
  opaqueIdentityStatus: "REVIEWED_OPAQUE_IDENTITY",
  eligibilityDecision: "ELIGIBLE",
  identityStatus: "UNAMBIGUOUS",
  sourceAuthorityStatus: "VERIFIED",
  senseAuthorityStatus: "RESOLVED_ONE_REVIEWABLE_SENSE",
  priorUseEvidence: {
    baseline: false,
    control: false,
    reveal: false,
    priorTarget: false,
    priorResearch: false,
    previouslyUsed: false,
    previouslyRevealed: false,
  },
});

const buildSyntheticArtifactCore = () => buildSyntheticM2ArtifactCoreV0_1({
  poolCoverage: "COMPLETE",
  candidateDeclarations: [declaration("m2:synthetic-z"), declaration("m2:synthetic-a")],
  caseOpaqueId: "synthetic:payload",
  structuralInput: "qay",
  sourceUniverseId: "synthetic-source-universe-v0_1",
  searchPolicyId: "synthetic-search-policy-v0_1",
  stopRuleId: "synthetic-stop-rule-v0_1",
  claimBoundary: ["research_only", "no_single_winner", "user_decides", "Null_valid"],
});

const integrity = (value: string) => ({
  frozenSha256: sha256OneEmbryoProofM2V0_1(value),
  observedSha256: sha256OneEmbryoProofM2V0_1(value),
  frozenByteLength: byteLength(value),
  observedByteLength: byteLength(value),
  hashVerified: true,
  frozenBeforeIntake: true,
  mutatedAfterFreeze: false,
});

const buildSyntheticAuthorityInput = () => {
  const publicPool = "synthetic-public-pool-definition-v0.1";
  const privateRegistry = "synthetic-private-registry-v0.1";
  return {
    schemaVersion: M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1,
    syntheticFixture: true as const,
    opaqueIdAuthority: {
      algorithm: M2_OPAQUE_ID_ALGORITHM_V0_1,
      algorithmVersion: "0.1",
      canonicalIdentitySerializationProfile: M2_OPAQUE_ID_SERIALIZATION_PROFILE_V0_1,
      namespaceCommitment: {
        sha256: sha256OneEmbryoProofM2V0_1("synthetic-namespace-commitment-v0.1"),
        byteLength: byteLength("synthetic-namespace-commitment-v0.1"),
        committedBeforeIntake: true,
        frozen: true,
      },
      keyCustody: { status: "INDEPENDENTLY_CONTROLLED_PRIVATE", syntheticFixtureOnly: true, realKeyCreated: false },
      registryReview: { status: "INDEPENDENTLY_REVIEWED", reviewerReference: "synthetic-reviewer-v0.1", syntheticFixtureOnly: true },
      registryIntegrity: integrity(privateRegistry),
      insertionOrderIndependent: true,
    },
    exclusionCoverage: {
      scopeId: "synthetic-exclusion-scope",
      scopeVersion: "0.1",
      coverageClass: M2_COVERAGE_VERIFIED_FOR_DECLARED_SCOPE_V0_1,
      evidenceInventory: integrity("synthetic-evidence-inventory-v0.1"),
      categories: {
        baseline: "COVERED",
        priorTarget: "COVERED",
        priorReveal: "COVERED",
        priorControl: "COVERED",
        priorResearch: "COVERED",
        embryoOrReplication: "COVERED",
      },
      independentReview: { status: "INDEPENDENTLY_REVIEWED", reviewerReference: "synthetic-coverage-reviewer-v0.1", syntheticFixtureOnly: true },
    },
    visibilityAndSealedLinkage: {
      publicPoolDefinition: {
        schemaVersion: "synthetic.pool-definition.v0.1",
        serializationProfile: "canonical-json-v0.1",
        containsTargetSemantics: false,
        targetBearingFieldCount: 0,
        sha256: sha256OneEmbryoProofM2V0_1(publicPool),
        byteLength: byteLength(publicPool),
        frozen: true,
      },
      sealedManifest: {
        schemaVersion: "synthetic.sealed-manifest.v0.1",
        serializationProfile: "canonical-json-v0.1",
        linkageMode: M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
        poolDefinitionSha256: sha256OneEmbryoProofM2V0_1(publicPool),
        poolDefinitionByteLength: byteLength(publicPool),
        privateRegistrySha256: sha256OneEmbryoProofM2V0_1(privateRegistry),
        privateRegistryByteLength: byteLength(privateRegistry),
        frozenSha256: sha256OneEmbryoProofM2V0_1("synthetic-sealed-manifest-v0.1"),
        observedSha256: sha256OneEmbryoProofM2V0_1("synthetic-sealed-manifest-v0.1"),
        frozenByteLength: byteLength("synthetic-sealed-manifest-v0.1"),
        observedByteLength: byteLength("synthetic-sealed-manifest-v0.1"),
        hashVerified: true,
        frozen: true,
        selfReferential: false as const,
        targetBearingDataPublic: false as const,
      },
    },
    executionBoundary: { realCandidateIntakeAuthorized: false as const, realExecutionAuthorized: false as const },
  };
};

type ControllerFixture = {
  root: string;
  input: M2ControllerPrivateBoundaryInputV0_1;
  artifacts: readonly Readonly<{ artifactId: string; sha256: string; byteLength: number; bytes: Buffer }>[];
  manifest: Readonly<{ sha256: string; byteLength: number }>;
  cleanup: () => void;
};

const buildControllerFixture = (): ControllerFixture => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), "m2-solo-ai-review-")));
  chmodSync(root, 0o700);
  const values = {
    namespace: Buffer.from("synthetic namespace commitment\n"),
    exclusion: Buffer.from("synthetic exclusion inventory\n"),
    registry: Buffer.from("synthetic private registry\n"),
    selection: Buffer.from("synthetic selection record\n"),
    chronology: Buffer.from("synthetic chronology record\n"),
  };
  const pool = {
    schemaVersion: "open-instrument.m2-public-pool-definition.v0.1",
    serializationProfile: "canonical-json-v0.1",
    containsTargetSemantics: false,
    targetBearingFieldCount: 0,
    linkageMode: M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
    frozen: true,
  };
  const poolBytes = Buffer.from(`${canonical(pool)}\n`);
  const projection = {
    claimBoundary: ["synthetic-only"],
    schemaVersion: "synthetic-operator-projection.v0.1",
    structuralFingerprint: "a".repeat(64),
  };
  const projectionBytes = `${canonical(projection)}\n`;
  const files = [
    ["namespace", "namespace.bin", "NAMESPACE_COMMITMENT", values.namespace],
    ["exclusion", "exclusion.bin", "EXCLUSION_INVENTORY", values.exclusion],
    ["registry", "registry.bin", "PRIVATE_REGISTRY", values.registry],
    ["selection", "selection.bin", "SELECTION_RECORD", values.selection],
    ["chronology", "chronology.bin", "CHRONOLOGY_RECORD", values.chronology],
    ["pool", "public-pool.json", "PUBLIC_POOL_DEFINITION", poolBytes],
  ] as const;
  type SyntheticArtifactRecord = {
    artifactId: string;
    kind: "NAMESPACE_COMMITMENT" | "PUBLIC_POOL_DEFINITION" | "EXCLUSION_INVENTORY" | "PRIVATE_REGISTRY" | "SELECTION_RECORD" | "CHRONOLOGY_RECORD" | "SEALED_MANIFEST";
    relativePath: string;
    expectedSha256: string;
    expectedByteLength: number;
    exclusionCategories: string[];
    frozen: true;
    mutatedAfterFreeze: false;
  };
  const artifacts: SyntheticArtifactRecord[] = files.map(([artifactId, relativePath, kind, bytes]) => ({
    artifactId,
    kind,
    relativePath,
    expectedSha256: sha256(bytes),
    expectedByteLength: bytes.length,
    exclusionCategories: [] as string[],
    frozen: true as const,
    mutatedAfterFreeze: false as const,
  }));
  for (const [, relativePath, , bytes] of files) {
    writeFileSync(join(root, relativePath), bytes, { mode: 0o600 });
    chmodSync(join(root, relativePath), 0o600);
  }
  const dependencies = [...artifacts]
    .sort((left, right) => left.artifactId.localeCompare(right.artifactId))
    .map((artifact) => ({ artifactId: artifact.artifactId, byteLength: artifact.expectedByteLength, sha256: artifact.expectedSha256 }));
  const manifestBytes = Buffer.from(`${canonical({
    dependencies,
    frozen: true,
    linkageMode: M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
    schemaVersion: "open-instrument.m2-sealed-manifest.v0.1",
    selfReferential: false,
    serializationProfile: "canonical-json-v0.1",
    targetBearingDataPublic: false,
  })}\n`);
  writeFileSync(join(root, "sealed-manifest.json"), manifestBytes, { mode: 0o600 });
  chmodSync(join(root, "sealed-manifest.json"), 0o600);
  artifacts.push({
    artifactId: "manifest",
    kind: "SEALED_MANIFEST",
    relativePath: "sealed-manifest.json",
    expectedSha256: sha256(manifestBytes),
    expectedByteLength: manifestBytes.length,
    exclusionCategories: [],
    frozen: true,
    mutatedAfterFreeze: false,
  });
  const input: M2ControllerPrivateBoundaryInputV0_1 = {
    schemaVersion: M2_CONTROLLER_PRIVATE_BOUNDARY_SCHEMA_V0_1,
    syntheticFixture: true,
    auditProvenance: {
      classification: CONTROLLER_AUDIT_CLASSIFICATION,
      selfReviewStatus: "SELF_REVIEWED",
      independentHumanReviewerReference: null,
      claimsIndependentHumanReview: false,
    },
    privateRoot: root,
    forbiddenRoots: [join(root, "..", "forbidden-not-root")],
    artifacts,
    manifestArtifactId: "manifest",
    exclusionCoverage: {
      artifactId: "exclusion",
      status: "VERIFIED_FOR_DECLARED_SCOPE",
      categories: {
        baseline: "COVERED",
        priorTarget: "COVERED",
        priorReveal: "COVERED",
        priorControl: "COVERED",
        priorResearch: "COVERED",
        embryoOrReplication: "COVERED",
      },
    },
    chronology: {
      evidenceMode: "SYNTHETIC_CONTROLLED_OBSERVATION",
      controlledObservationVerified: true,
      entries: M2_CONTROLLER_COMMITMENT_PHASES_V0_1.map((phase, ordinal) => {
        const artifactId = ["namespace", "pool", "exclusion", "registry", "selection"][ordinal];
        const artifact = artifacts.find((item) => item.artifactId === artifactId);
        return {
          phase,
          artifactId,
          sha256: artifact?.expectedSha256 as string,
          byteLength: artifact?.expectedByteLength as number,
          ordinal,
          occurredAt: `2026-10-20T00:00:0${ordinal}Z`,
          immutableEvidence: true as const,
          executed: false as const,
        };
      }),
    },
    operatorProjection: {
      serializedBytes: projectionBytes,
      sha256: sha256(projectionBytes),
      byteLength: Buffer.byteLength(projectionBytes),
      frozen: true,
    },
    isolationEvidence: {
      evidenceMode: "SYNTHETIC_CONTROLLED_OBSERVATION",
      filesystemBoundaryVerified: true,
      processBoundaryVerified: true,
      filesystemAccessAttempt: "DENIED",
      processAccessAttempt: "DENIED",
      privatePathNotExposed: true,
    },
    executionBoundary: {
      realCandidateIntakeAuthorized: false,
      realKeyCreated: false,
      realIdsAssigned: false,
      realSelectionExecuted: false,
      realExecutionAuthorized: false,
    },
  };
  const actualArtifacts = artifacts.map((artifact) => {
    const bytes = readFileSync(join(root, artifact.relativePath));
    return { artifactId: artifact.artifactId, sha256: sha256(bytes), byteLength: bytes.byteLength, bytes };
  });
  const manifestArtifact = actualArtifacts.find((artifact) => artifact.artifactId === "manifest");
  if (!manifestArtifact) throw new Error("synthetic sealed manifest was not written");
  return {
    root,
    input,
    artifacts: actualArtifacts,
    manifest: { sha256: manifestArtifact.sha256, byteLength: manifestArtifact.byteLength },
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
};

const parseArgs = () => {
  const args = new Map<string, string>();
  for (const item of process.argv.slice(2)) {
    const match = /^--([^=]+)=(.*)$/u.exec(item);
    if (!match || !["out", "review-decision"].includes(match[1])) {
      throw new Error(`unsupported argument: ${item}`);
    }
    args.set(match[1], match[2]);
  }
  return {
    out: args.get("out") ?? DEFAULT_OUTPUT,
    reviewDecisionPath: args.get("review-decision"),
  };
};

const run = () => {
  const args = parseArgs();
  const repo = realpathSync(ROOT);
  const out = resolveNewTemporaryOutput(args.out, repo);
  let reviewerDecision: unknown = null;
  let reviewDecisionArtifact: { sha256: string; byteLength: number; parseStatus: "PARSED" | "INVALID" | "NOT_PROVIDED" | "REJECTED" } = {
    sha256: "",
    byteLength: 0,
    parseStatus: "NOT_PROVIDED",
  };
  if (args.reviewDecisionPath) {
    try {
      const reviewPath = resolveExistingTemporaryFile(args.reviewDecisionPath, repo);
      const bytes = readFileSync(reviewPath);
      reviewDecisionArtifact = { sha256: sha256(bytes), byteLength: bytes.byteLength, parseStatus: "INVALID" };
      try {
        reviewerDecision = JSON.parse(bytes.toString("utf8")) as unknown;
        reviewDecisionArtifact.parseStatus = "PARSED";
      } catch {
        reviewDecisionArtifact.parseStatus = "INVALID";
      }
    } catch {
      reviewDecisionArtifact = { sha256: "", byteLength: 0, parseStatus: "REJECTED" };
    }
  }

  const sourceFilePaths = [
    PREREGISTRATION_PATH,
    "src/shared/openInstrument/oneEmbryoProofM2Preregistration.v0_1.ts",
    "src/shared/openInstrument/m2SingleOperatorReproducibleAudit.v0_1.ts",
    "src/shared/openInstrument/m2ControllerPrivateBoundary.v0_1.ts",
    "src/shared/openInstrument/m2SyntheticArtifactBuilderCore.v0_1.ts",
    "src/shared/openInstrument/m2FreshCandidatePoolAuthorityBoundary.v0_1.ts",
    "src/shared/openInstrument/m2SoloAiReviewWorkflow.v0_1.ts",
    "scripts/openInstrument/m2SoloAiReviewWorkflow.v0_1.ts",
    "tests/openInstrument.m2SoloAiReviewWorkflow.v0_1.spec.ts",
    "package.json",
  ];
  const repositoryArtifacts = sourceFilePaths.map((path) => {
    const bytes = readFileSync(join(repo, path));
    return { artifactId: path, sha256: sha256(bytes), byteLength: bytes.byteLength };
  });
  const preregistrationBytes = readFileSync(join(repo, PREREGISTRATION_PATH));
  const preregistrationSha256 = sha256(preregistrationBytes);
  let preregistrationDocument: unknown = null;
  try {
    preregistrationDocument = JSON.parse(preregistrationBytes.toString("utf8")) as unknown;
  } catch {
    preregistrationDocument = null;
  }
  const frozenPreregistration = isRecord(preregistrationDocument) ? preregistrationDocument : null;
  const frozenLockFields = [
    "executionAuthorized",
    "realTargetSelected",
    "realEmbryoSelected",
    "realBlindPayloadCreated",
    "realDiscoveryExecuted",
    "targetRevealed",
  ] as const;
  const frozenLockValues = Object.fromEntries(frozenLockFields.map((field) => [
    field,
    typeof frozenPreregistration?.[field] === "boolean" ? frozenPreregistration[field] : null,
  ]));
  const frozenContractLocked: M2SoloAiReviewStatusV0_1 = preregistrationSha256 === EXPECTED_PREREGISTRATION_SHA256 &&
    frozenLockFields.every((field) => frozenLockValues[field] === false) ? "PASS" : "FAIL";

  const auditInput = buildSingleOperatorAudit();
  const auditObserved = [
    { artifactId: "source-1", bytes: SOURCE_BYTES },
    { artifactId: "inventory-1", bytes: INVENTORY_BYTES },
  ];
  const auditResult = verifyM2SingleOperatorReproducibleAuditV0_1(auditInput, auditObserved);
  const controller = buildControllerFixture();
  try {
    const controllerResult = verifyM2ControllerPrivateBoundaryV0_1(controller.input);
    const authorityResult = validateM2FreshCandidatePoolAuthorityBoundaryV0_1(buildSyntheticAuthorityInput());
    const artifactCore = buildSyntheticArtifactCore();
    const repeatedCore = buildSyntheticArtifactCore();
    const sourceAttestation = auditInput.candidateRecords[0].sourceAttestation;
    const sourceValidation = validateSourceEntryAttestationV1(sourceAttestation);
    const sourceHashMatches = sourceValidation.ok && sourceValidation.attestation.sourceHashOrArchiveHash ===
      sha256M2SingleOperatorAuditV0_1(SOURCE_BYTES);
    const requiredExclusions = [...M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1].sort();
    const coveredExclusions = auditInput.evidenceArtifacts
      .filter((artifact) => artifact.kind === "EXCLUSION_INVENTORY")
      .flatMap((artifact) => [...artifact.declaredCategories])
      .filter((category, index, values) => values.indexOf(category) === index)
      .sort();
    const controllerHashesVerified = controller.artifacts.every((artifact) =>
      artifact.sha256 === sha256(artifact.bytes) && artifact.byteLength === artifact.bytes.byteLength);
    const blindPayloadBytesVerified = artifactCore.payloadBytes !== null &&
      artifactCore.payloadSha256 !== null && artifactCore.payloadByteLength !== null &&
      sha256(artifactCore.payloadBytes) === artifactCore.payloadSha256 &&
      artifactCore.payloadBytes.byteLength === artifactCore.payloadByteLength;
    const selectionRecord = {
      selectorId: M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1,
      eligibleCandidateIds: ["m2:synthetic-a", "m2:synthetic-z"],
      selectedOpaqueCandidateId: artifactCore.selectedCandidate?.opaqueCandidateId ?? null,
    };
    const selectionSerialized = canonicalSerializeOneEmbryoProofM2V0_1(selectionRecord);
    const selectionFingerprint = sha256OneEmbryoProofM2V0_1(selectionSerialized);
    const repeatedSelection = repeatedCore.selectedCandidate?.opaqueCandidateId ?? null;
    const selectionUnchanged =
      artifactCore.status === "SYNTHETIC_PAYLOAD_BUILT" &&
      repeatedSelection === selectionRecord.selectedOpaqueCandidateId &&
      sha256OneEmbryoProofM2V0_1(canonicalSerializeOneEmbryoProofM2V0_1({ ...selectionRecord, selectedOpaqueCandidateId: repeatedSelection })) === selectionFingerprint;
    const blind = artifactCore.blindPayload
      ? buildM2SoloAiBlindResearchHandoffV0_1(artifactCore.blindPayload)
      : null;
    const baseChecks: Record<(typeof M2_SOLO_AI_REVIEW_CHECKS_V0_1)[number], M2SoloAiReviewCheckStatusV0_1> = {
      artifactHashesRecomputed: auditResult.auditFingerprint.verified && controllerResult.artifactIntegrityVerified && controllerHashesVerified && blindPayloadBytesVerified ? "PASS" : "FAIL",
      sourceProvenanceValidated: auditResult.status === M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1 && sourceHashMatches ? "PASS" : "FAIL",
      exclusionCoverageComplete: auditResult.status === M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1 && requiredExclusions.join("\u0000") === coveredExclusions.join("\u0000") ? "PASS" : "FAIL",
      sealedManifestValidated: controllerResult.status === "SYNTHETIC_BOUNDARY_READY" && controllerResult.sealedManifestVerified && authorityResult.status === "SYNTHETIC_BCD_AUTHORITY_READY" ? "PASS" : "FAIL",
      reviewerContractReadOnly: "UNKNOWN",
      selectionUnchanged: selectionUnchanged ? "PASS" : "FAIL",
      blindPayloadHasNoTargetSemantics: blind?.status === "PASS" ? "PASS" : "FAIL",
      frozenContractLocked,
    };
    const buildReviewerProjection = (machineAuditStatus: M2SoloAiReviewStatusV0_1) => artifactCore.blindPayload
      ? buildM2SoloAiReviewerProjectionV0_1({
        machineAuditStatus,
        auditReasonCodes: auditResult.reasonCodes,
        machineChecks: { ...baseChecks },
        evidenceIntegrity: auditResult.evidenceIntegrity.map((item) => {
          const expected = auditInput.evidenceArtifacts.find((artifact) => artifact.artifactId === item.artifactId)!;
          return {
            artifactId: item.artifactId,
            expectedSha256: expected.expectedSha256,
            observedSha256: item.observedSha256,
            expectedByteLength: expected.expectedByteLength,
            observedByteLength: item.observedByteLength,
          };
        }),
        exclusionCoverage: { requiredCategories: requiredExclusions, coveredCategories: coveredExclusions, status: baseChecks.exclusionCoverageComplete },
        sourceProvenance: sourceValidation.ok ? [{
          candidateOpaqueId: auditInput.candidateRecords[0].opaqueCandidateId,
          sourceTraditionId: sourceValidation.attestation.sourceTraditionId,
          sourceTitle: sourceValidation.attestation.sourceTitle,
          sourceRevisionOrAccessDate: sourceValidation.attestation.sourceDateOrVersion,
          sourceFilePath: sourceValidation.attestation.sourceFilePath,
          sourceHash: sourceValidation.attestation.sourceHashOrArchiveHash,
          entryReference: auditInput.candidateRecords[0].sourceEntryReference,
          senseReference: auditInput.candidateRecords[0].sourceSenseReference,
          validationStatus: sourceHashMatches ? "PASS" : "FAIL",
        }] : [],
        sealedManifest: {
          sha256: controller.manifest.sha256,
          byteLength: controller.manifest.byteLength,
          validationStatus: baseChecks.sealedManifestValidated,
          syntheticOnly: true,
        },
        selection: {
          selectorId: M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1,
          eligibleCandidateCount: selectionRecord.eligibleCandidateIds.length,
          selectionFingerprint,
        },
        blindPayload: artifactCore.blindPayload,
      })
      : null;
    const preliminaryProjection = buildReviewerProjection("UNKNOWN");
    if (!preliminaryProjection || !blind) throw new Error("synthetic reviewer projection was not built");
    baseChecks.reviewerContractReadOnly = verifyM2SoloAiReviewerProjectionReadOnlyV0_1(preliminaryProjection.projection)
      ? "PASS"
      : "FAIL";
    const machineAuditStatusFromChecks = (): M2SoloAiReviewStatusV0_1 => {
      const statuses = Object.values(baseChecks);
      return statuses.some((status) => status === "FAIL")
        ? "FAIL"
        : statuses.some((status) => status === "UNKNOWN") ? "UNKNOWN" : "PASS";
    };
    let machineAuditStatus = machineAuditStatusFromChecks();
    let reviewerProjection = buildReviewerProjection(machineAuditStatus);
    if (!reviewerProjection || !verifyM2SoloAiReviewerProjectionReadOnlyV0_1(reviewerProjection.projection)) {
      baseChecks.reviewerContractReadOnly = "FAIL";
      machineAuditStatus = machineAuditStatusFromChecks();
      reviewerProjection = buildReviewerProjection(machineAuditStatus);
    }
    if (!blind || !reviewerProjection) throw new Error("synthetic structural blind payload was not built");
    const reviewedArtifactSha256s = [...new Set([
      ...auditResult.evidenceIntegrity.flatMap((item) => item.observedSha256 ? [item.observedSha256] : []),
      ...controller.artifacts.map((artifact) => artifact.sha256),
      ...repositoryArtifacts.map((artifact) => artifact.sha256),
      ...(artifactCore.payloadSha256 ? [artifactCore.payloadSha256] : []),
      reviewerProjection.sha256,
    ])].sort();
    const reviewEvaluation = reviewerDecision === null
      ? {
        status: "UNKNOWN" as const,
        classification: M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1,
        reasonCodes: [reviewDecisionArtifact.parseStatus === "NOT_PROVIDED"
          ? "AI_REVIEW_DECISION_NOT_PROVIDED"
          : "AI_REVIEW_DECISION_UNAVAILABLE"],
        selectionUnchanged: null,
        humanIndependentReviewClaimed: false as const,
      }
      : evaluateM2SoloAiReviewDecisionV0_1({
        reviewerInputSha256: reviewerProjection.sha256,
        artifactSha256s: reviewedArtifactSha256s,
        selectionFingerprint,
        machineChecks: baseChecks,
      }, reviewerDecision);
    const safeReviewerDecision = sanitizeDecisionForPacket(reviewerDecision);
    const overallResult: M2SoloAiReviewStatusV0_1 = machineAuditStatus === "FAIL" || reviewEvaluation.status === "FAIL"
      ? "FAIL"
      : machineAuditStatus === "UNKNOWN" || reviewEvaluation.status === "UNKNOWN" ? "UNKNOWN" : "PASS";
    const packet = {
      schemaVersion: M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1,
      packetClassification: "SYNTHETIC_REHEARSAL_ONLY",
      generatedAt: new Date().toISOString(),
      repository: {
        head: execFileSync("git", ["rev-parse", "HEAD"], { cwd: repo, encoding: "utf8" }).trim(),
        workingTreeSourceHashes: repositoryArtifacts,
      },
      frozenContract: {
        path: PREREGISTRATION_PATH,
        sha256: preregistrationSha256,
        expectedSha256: EXPECTED_PREREGISTRATION_SHA256,
        validationStatus: frozenContractLocked,
        ...frozenLockValues,
      },
      roles: {
        controller: {
          actor: "SOLO_DEVELOPER_CONTROLLER",
          access: ["synthetic source attestation", "synthetic exclusion inventory", "synthetic candidate mapping", "frozen selector input"],
          mayFreezeSelection: true,
          mayProvideReviewerProjection: true,
        },
        aiReviewer: {
          executionBoundary: "READ_ONLY_REVIEW_ROLE_IN_CURRENT_CODEX_SESSION",
          access: ["read-only reviewer projection", "exact hashes", "synthetic source provenance metadata", "coverage and validation results", "target-free blind payload"],
          mayChangeSelection: false,
          mayAccessHmacKey: false,
          claimsHumanIndependentReview: false,
          processIsolation: "NOT_DEMONSTRATED_IN_THIS_LOCAL_REHEARSAL",
        },
        blindResearchAgent: {
          access: ["blindResearchHandoff.payload only"],
          executionStatus: "HANDOFF_ONLY_NOT_EXECUTED",
          receivesTargetSemantics: false,
          receivesSourceIdentity: false,
          receivesSelectionControl: false,
          m3Executed: false,
        },
        boundaryEnforcement: "CONTRACT_PROJECTION_TESTED; OS_ACCOUNT_AND_PROCESS_ISOLATION_UNKNOWN",
      },
      selection: {
        selectorId: M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1,
        candidateOrderInput: ["m2:synthetic-z", "m2:synthetic-a"],
        eligibleOpaqueCandidateIds: selectionRecord.eligibleCandidateIds,
        selectedOpaqueCandidateId: selectionRecord.selectedOpaqueCandidateId,
        repeatSelectedOpaqueCandidateId: repeatedSelection,
        fingerprint: selectionFingerprint,
        unchanged: selectionUnchanged,
        manualPreference: false,
        realSelectionExecuted: false,
      },
      machineChecks: {
        singleOperatorAudit: auditResult,
        controllerPrivateBoundary: {
          status: controllerResult.status,
          reasonCodes: controllerResult.reasonCodes,
          syntheticOnly: controllerResult.syntheticOnly,
          artifactIntegrityVerified: controllerResult.artifactIntegrityVerified,
          sealedManifestVerified: controllerResult.sealedManifestVerified,
          commitmentChronologyStatus: controllerResult.commitmentChronologyStatus,
          blindIsolationVerifiedBySyntheticFixture: controllerResult.blindIsolationVerified,
          realCandidateIntakeAuthorized: controllerResult.realCandidateIntakeAuthorized,
          realExecutionAuthorized: controllerResult.realExecutionAuthorized,
        },
        authorityBoundary: authorityResult,
        sourceAttestation: {
          validationStatus: sourceValidation.ok ? "PASS" : "FAIL",
          sourceArtifactHashMatchesAttestation: sourceHashMatches,
          sourceIdentity: sourceValidation.ok ? {
            sourceTraditionId: sourceValidation.attestation.sourceTraditionId,
            sourceHash: sourceValidation.attestation.sourceHashOrArchiveHash,
            entryReference: auditInput.candidateRecords[0].sourceEntryReference,
            senseReference: auditInput.candidateRecords[0].sourceSenseReference,
          } : null,
          allValuesSynthetic: true,
        },
        exclusionCoverage: {
          status: baseChecks.exclusionCoverageComplete,
          requiredCategories: requiredExclusions,
          coveredCategories: coveredExclusions,
          unknownOrConflictingFailClosed: true,
        },
        artifactIntegrity: {
          status: baseChecks.artifactHashesRecomputed,
          repositoryArtifacts,
          syntheticSourceArtifacts: auditResult.evidenceIntegrity,
          controllerArtifacts: controller.artifacts.map(({ artifactId, sha256: digest, byteLength: length }) => ({ artifactId, sha256: digest, byteLength: length })),
          sealedManifest: controller.manifest,
          reviewerProjection: { sha256: reviewerProjection.sha256, byteLength: reviewerProjection.byteLength },
          blindPayload: {
            sha256: artifactCore.payloadSha256,
            byteLength: artifactCore.payloadByteLength,
            handoffProjectionSha256: blind.payloadSha256,
            bytesRecomputed: blindPayloadBytesVerified,
          },
        },
        syntheticArtifactBuilder: {
          status: artifactCore.status,
          reasonCodes: artifactCore.reasonCodes,
          structural: artifactCore.structural,
          targetSemanticFieldsProvided: false,
        },
      },
      aiReviewerInput: reviewerProjection.projection,
      reviewRequest: {
        reviewerInputSha256: reviewerProjection.sha256,
        reviewedArtifactSha256s,
        selectionFingerprint,
        machineCheckStatuses: baseChecks,
        responseFileSchema: "M2SoloAiReviewDecisionV0_1",
      },
      blindResearchHandoff: blind,
      aiReview: {
        reviewerDecision: safeReviewerDecision,
        reviewerDecisionArtifact: reviewDecisionArtifact,
        evaluation: reviewEvaluation,
        modelReviewIsSelfReported: reviewerDecision !== null,
        humanIndependentReview: false,
      },
      result: overallResult,
      resultScope: "synthetic artifact, role-projection, and reviewer-contract rehearsal only",
      realM2Readiness: "UNKNOWN",
      unresolvedBeforeFirstAuthorizedRealPilot: [
        "Separate storage/account and process access denial have not been operationally demonstrated.",
        "A real controller-private source, exclusion inventory, sealed registry, and external manifest fingerprint do not exist in this rehearsal.",
        "No real HMAC key, opaque IDs, target selection, M3 research, or reveal is authorized by the frozen preregistration.",
        "A separate execution-scoped owner authorization is still required before real intake or execution.",
      ],
    };

    writeFileSync(out, `${JSON.stringify(packet, null, 2)}\n`, { mode: 0o600, flag: "wx" });
    process.stdout.write(`${JSON.stringify({ output: out, result: packet.result, machineAuditStatus, selectedOpaqueCandidateId: selectionRecord.selectedOpaqueCandidateId, sourceProvenance: baseChecks.sourceProvenanceValidated, exclusionCoverage: baseChecks.exclusionCoverageComplete, sealedManifest: baseChecks.sealedManifestValidated, selectionUnchanged, blindPayload: baseChecks.blindPayloadHasNoTargetSemantics })}\n`);
  } finally {
    controller.cleanup();
  }
};

run();
