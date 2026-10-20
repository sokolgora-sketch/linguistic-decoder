import {
  M2_COVERAGE_VERIFIED_FOR_DECLARED_SCOPE_V0_1,
  M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1,
  M2_OPAQUE_ID_ALGORITHM_V0_1,
  M2_OPAQUE_ID_SERIALIZATION_PROFILE_V0_1,
  M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
  validateM2FreshCandidatePoolAuthorityBoundaryV0_1,
  type M2FreshCandidatePoolAuthorityBoundaryInputV0_1,
} from "../src/shared/openInstrument/m2FreshCandidatePoolAuthorityBoundary.v0_1";
import { sha256OneEmbryoProofM2V0_1 } from "../src/shared/openInstrument/oneEmbryoProofM2Preregistration.v0_1";

const bytes = (value: string) => Buffer.byteLength(value, "utf8");
const hash = (value: string) => sha256OneEmbryoProofM2V0_1(value);

const integrity = (value: string) => ({
  frozenSha256: hash(value),
  observedSha256: hash(value),
  frozenByteLength: bytes(value),
  observedByteLength: bytes(value),
  hashVerified: true,
  frozenBeforeIntake: true,
  mutatedAfterFreeze: false,
});

const validSyntheticAuthority = (): M2FreshCandidatePoolAuthorityBoundaryInputV0_1 => {
  const publicPool = "synthetic-public-pool-definition-v0.1";
  const privateRegistry = "synthetic-private-registry-v0.1";
  return {
    schemaVersion: M2_FRESH_CANDIDATE_POOL_AUTHORITY_BOUNDARY_SCHEMA_V0_1,
    syntheticFixture: true,
    opaqueIdAuthority: {
      algorithm: M2_OPAQUE_ID_ALGORITHM_V0_1,
      algorithmVersion: "0.1",
      canonicalIdentitySerializationProfile: M2_OPAQUE_ID_SERIALIZATION_PROFILE_V0_1,
      namespaceCommitment: {
        sha256: hash("synthetic-namespace-commitment-v0.1"),
        byteLength: bytes("synthetic-namespace-commitment-v0.1"),
        committedBeforeIntake: true,
        frozen: true,
      },
      keyCustody: {
        status: "INDEPENDENTLY_CONTROLLED_PRIVATE",
        syntheticFixtureOnly: true,
        realKeyCreated: false,
      },
      registryReview: {
        status: "INDEPENDENTLY_REVIEWED",
        reviewerReference: "synthetic-reviewer-v0.1",
        syntheticFixtureOnly: true,
      },
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
      independentReview: {
        status: "INDEPENDENTLY_REVIEWED",
        reviewerReference: "synthetic-coverage-reviewer-v0.1",
        syntheticFixtureOnly: true,
      },
    },
    visibilityAndSealedLinkage: {
      publicPoolDefinition: {
        schemaVersion: "synthetic.pool-definition.v0.1",
        serializationProfile: "canonical-json-v0.1",
        containsTargetSemantics: false,
        targetBearingFieldCount: 0,
        sha256: hash(publicPool),
        byteLength: bytes(publicPool),
        frozen: true,
      },
      sealedManifest: {
        schemaVersion: "synthetic.sealed-manifest.v0.1",
        serializationProfile: "canonical-json-v0.1",
        linkageMode: M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
        poolDefinitionSha256: hash(publicPool),
        poolDefinitionByteLength: bytes(publicPool),
        privateRegistrySha256: hash(privateRegistry),
        privateRegistryByteLength: bytes(privateRegistry),
        frozenSha256: hash("synthetic-sealed-manifest-v0.1"),
        observedSha256: hash("synthetic-sealed-manifest-v0.1"),
        frozenByteLength: bytes("synthetic-sealed-manifest-v0.1"),
        observedByteLength: bytes("synthetic-sealed-manifest-v0.1"),
        hashVerified: true,
        frozen: true,
        selfReferential: false,
        targetBearingDataPublic: false,
      },
    },
    executionBoundary: {
      realCandidateIntakeAuthorized: false,
      realExecutionAuthorized: false,
    },
  };
};

describe("M2 fresh candidate-pool B/C/D authority boundary", () => {
  test("accepts valid synthetic metadata without authorizing real intake", () => {
    const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1(
      validSyntheticAuthority(),
    );
    expect(result.status).toBe("SYNTHETIC_BCD_AUTHORITY_READY");
    expect(result.reasonCodes).toEqual(
      expect.arrayContaining([
        "SYNTHETIC_AUTHORITY_METADATA_ACCEPTED",
        "REAL_CANDIDATE_INTAKE_UNAUTHORIZED",
        "REAL_EXECUTION_UNAUTHORIZED",
      ]),
    );
    expect(result.realCandidateIntakeAuthorized).toBe(false);
    expect(result.realExecutionAuthorized).toBe(false);
    expect(result.summary.syntheticOnly).toBe(true);
  });

  test("fails closed for missing or uncommitted namespace metadata", () => {
    const missing = validSyntheticAuthority() as unknown as Record<string, unknown>;
    delete (missing.opaqueIdAuthority as Record<string, unknown>).namespaceCommitment;
    const missingResult = validateM2FreshCandidatePoolAuthorityBoundaryV0_1(missing);
    expect(missingResult.status).toBe("BLOCKED");
    expect(missingResult.reasonCodes).toContain("AUTHORITY_INPUT_MALFORMED");

    const uncommitted = validSyntheticAuthority();
    const uncommittedNamespace = {
      ...uncommitted.opaqueIdAuthority.namespaceCommitment,
      committedBeforeIntake: false,
    };
    const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...uncommitted,
      opaqueIdAuthority: {
        ...uncommitted.opaqueIdAuthority,
        namespaceCommitment: uncommittedNamespace,
      },
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toContain("OPAQUE_ID_NAMESPACE_UNCOMMITTED");
  });

  test("rejects truthy non-boolean namespace commitment and freeze flags", () => {
    for (const field of ["committedBeforeIntake", "frozen"] as const) {
      for (const invalidValue of ["false", 1]) {
        const input = validSyntheticAuthority();
        const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
          ...input,
          opaqueIdAuthority: {
            ...input.opaqueIdAuthority,
            namespaceCommitment: {
              ...input.opaqueIdAuthority.namespaceCommitment,
              [field]: invalidValue,
            } as unknown as typeof input.opaqueIdAuthority.namespaceCommitment,
          },
        });
        expect(result.status).toBe("BLOCKED");
        expect(result.reasonCodes).toContain(
          field === "committedBeforeIntake"
            ? "OPAQUE_ID_NAMESPACE_UNCOMMITTED"
            : "OPAQUE_ID_NAMESPACE_NOT_FROZEN",
        );
        expect(result.realCandidateIntakeAuthorized).toBe(false);
        expect(result.realExecutionAuthorized).toBe(false);
      }
    }
  });

  test("rejects unreviewed or conflicting exclusion coverage", () => {
    const input = validSyntheticAuthority();
    const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...input,
      exclusionCoverage: {
        ...input.exclusionCoverage,
        categories: {
          ...input.exclusionCoverage.categories,
          priorResearch: "CONFLICTING",
        },
        independentReview: {
          ...input.exclusionCoverage.independentReview,
          status: "UNREVIEWED",
        },
      },
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toEqual(
      expect.arrayContaining([
        "COVERAGE_UNKNOWN_OR_CONFLICTING",
        "COVERAGE_REVIEW_UNVERIFIED",
      ]),
    );
  });

  test("requires independent registry and coverage reviewer status", () => {
    const input = validSyntheticAuthority();
    const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...input,
      opaqueIdAuthority: {
        ...input.opaqueIdAuthority,
        keyCustody: { ...input.opaqueIdAuthority.keyCustody, status: "UNKNOWN" },
        registryReview: { ...input.opaqueIdAuthority.registryReview, status: "UNKNOWN" },
      },
      exclusionCoverage: {
        ...input.exclusionCoverage,
        independentReview: {
          ...input.exclusionCoverage.independentReview,
          status: "UNKNOWN",
        },
      },
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toEqual(
      expect.arrayContaining([
        "OPAQUE_ID_KEY_CUSTODY_UNVERIFIED",
        "OPAQUE_ID_REGISTRY_REVIEW_UNVERIFIED",
        "COVERAGE_REVIEW_UNVERIFIED",
      ]),
    );
  });

  test("rejects registry or sealed-manifest fingerprint mismatches", () => {
    const input = validSyntheticAuthority();
    const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...input,
      opaqueIdAuthority: {
        ...input.opaqueIdAuthority,
        registryIntegrity: {
          ...input.opaqueIdAuthority.registryIntegrity,
          observedSha256: "0".repeat(64),
        },
      },
      visibilityAndSealedLinkage: {
        ...input.visibilityAndSealedLinkage,
        sealedManifest: {
          ...input.visibilityAndSealedLinkage.sealedManifest,
          poolDefinitionSha256: "1".repeat(64),
        },
      },
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toEqual(
      expect.arrayContaining([
        "OPAQUE_ID_REGISTRY_HASH_MISMATCH",
        "SEALED_REGISTRY_LINKAGE_MISMATCH",
      ]),
    );

    const manifestMismatch = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...input,
      visibilityAndSealedLinkage: {
        ...input.visibilityAndSealedLinkage,
        sealedManifest: {
          ...input.visibilityAndSealedLinkage.sealedManifest,
          privateRegistrySha256: "2".repeat(64),
        },
      },
    });
    expect(manifestMismatch.status).toBe("BLOCKED");
    expect(manifestMismatch.reasonCodes).toContain(
      "SEALED_REGISTRY_LINKAGE_MISMATCH",
    );
  });

  test("rejects target-bearing public metadata and private preimages", () => {
    const input = validSyntheticAuthority();
    const publicPool = {
      ...input.visibilityAndSealedLinkage.publicPoolDefinition,
      targetWord: "synthetic-target-must-not-appear",
    } as unknown as typeof input.visibilityAndSealedLinkage.publicPoolDefinition;
    const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...input,
      visibilityAndSealedLinkage: {
        ...input.visibilityAndSealedLinkage,
        publicPoolDefinition: publicPool,
      },
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toContain("PUBLIC_TARGET_SEMANTICS_EXPOSED");
    expect(JSON.stringify(result)).not.toContain("synthetic-target-must-not-appear");
  });

  test("rejects a changed synthetic registry after freeze", () => {
    const input = validSyntheticAuthority();
    const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...input,
      opaqueIdAuthority: {
        ...input.opaqueIdAuthority,
        registryIntegrity: {
          ...input.opaqueIdAuthority.registryIntegrity,
          mutatedAfterFreeze: true,
        },
      },
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toContain("OPAQUE_ID_REGISTRY_MUTATED_AFTER_FREEZE");
  });

  test("is deterministic under repeated evaluation and keeps reason codes sorted", () => {
    const input = validSyntheticAuthority();
    const first = validateM2FreshCandidatePoolAuthorityBoundaryV0_1(input);
    const second = validateM2FreshCandidatePoolAuthorityBoundaryV0_1(
      JSON.parse(JSON.stringify(input)) as typeof input,
    );
    expect(second).toEqual(first);
    expect(first.reasonCodes).toEqual([...first.reasonCodes].sort());
  });

  test("rejects malformed inputs and contradictory real-authorization flags", () => {
    const malformed = validateM2FreshCandidatePoolAuthorityBoundaryV0_1(null);
    expect(malformed.status).toBe("BLOCKED");
    expect(malformed.reasonCodes).toContain("AUTHORITY_INPUT_MALFORMED");

    const input = validSyntheticAuthority();
    const contradictory = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...input,
      executionBoundary: {
        realCandidateIntakeAuthorized: true,
        realExecutionAuthorized: false,
      },
    });
    expect(contradictory.status).toBe("BLOCKED");
    expect(contradictory.reasonCodes).toContain("REAL_AUTHORIZATION_REQUESTED");
    expect(contradictory.realExecutionAuthorized).toBe(false);
  });

  test("does not treat universal historical completeness as declared-scope coverage", () => {
    const input = validSyntheticAuthority();
    const result = validateM2FreshCandidatePoolAuthorityBoundaryV0_1({
      ...input,
      exclusionCoverage: {
        ...input.exclusionCoverage,
        coverageClass: "UNIVERSAL_HISTORICAL_COMPLETENESS",
      } as typeof input.exclusionCoverage,
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toContain("COVERAGE_CLASS_INVALID");
  });
});
