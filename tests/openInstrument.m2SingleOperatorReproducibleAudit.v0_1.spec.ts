import {
  canonicalSerializeM2SingleOperatorAuditV0_1,
  M2_FROZEN_OPAQUE_ID_SELECTOR_V0_1,
  M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1,
  M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
  M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_SCHEMA_V0_1,
  sha256M2SingleOperatorAuditV0_1,
  verifyM2SingleOperatorReproducibleAuditV0_1,
  type M2SingleOperatorReproducibleAuditInputV0_1,
} from "../src/shared/openInstrument/m2SingleOperatorReproducibleAudit.v0_1";
import { SOURCE_ENTRY_ATTESTATION_SCHEMA_V1 } from "../src/shared/openInstrument/sourceEntryAttestation.v1";

const sourceBytes = "synthetic-source-bytes-v0.1";
const inventoryBytes = "synthetic-exclusion-inventory-v0.1";
const hash = (value: string) => sha256M2SingleOperatorAuditV0_1(value);
const length = (value: string) => Buffer.byteLength(value, "utf8");

const sourceAttestation = () => ({
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
  sourceHashOrArchiveHash: hash(sourceBytes),
  sourceForm: "synthetic-form",
  sourceFormNormalization: "EXACT_PRESERVED" as const,
  sourceAttestation: "SOURCE_FORM_OR_ENTRY_ATTESTED" as const,
  entries: [
    {
      entryId: "entry-1",
      entryKey: "synthetic-form",
      entryLocator: "entry-1",
      sourceForm: "synthetic-form",
      senses: [
        {
          senseId: "sense-1",
          senseLocator: "sense-1",
          text: "substantive synthetic sense",
          contentStatus: "SUBSTANTIVE_LEXICAL_SENSE" as const,
        },
      ],
      senseSelectionStatus: "EXPLICITLY_RESOLVED" as const,
      selectedSenseId: "sense-1",
    },
  ],
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
  return {
    serializedBytes,
    sha256: hash(serializedBytes),
    byteLength: length(serializedBytes),
    frozen: true as const,
  };
};

const baseAudit = (): M2SingleOperatorReproducibleAuditInputV0_1 => {
  const audit = {
    schemaVersion: M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_SCHEMA_V0_1,
    auditMode: "SYNTHETIC_FIXTURE" as const,
    classification: M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
    controller: {
      controllerReference: "synthetic-controller-v0.1",
      declaredAt: "2026-10-20T00:00:00Z",
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
        expectedSha256: hash(sourceBytes),
        expectedByteLength: length(sourceBytes),
        declaredCategories: [] as const,
      },
      {
        artifactId: "inventory-1",
        kind: "EXCLUSION_INVENTORY" as const,
        sourceReference: "synthetic://inventory/exclusions.json",
        sourceRevisionOrAccessDate: "synthetic-v0.1",
        expectedSha256: hash(inventoryBytes),
        expectedByteLength: length(inventoryBytes),
        declaredCategories: [...M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1],
      },
    ],
    candidateRecords: [
      {
        opaqueCandidateId: "m2:synthetic-a",
        sourceArtifactId: "source-1",
        sourceEntryReference: "entry-1",
        sourceSenseReference: "sense-1",
        sourceAttestation: sourceAttestation(),
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
      },
    ],
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
  const canonical = canonicalSerializeM2SingleOperatorAuditV0_1(audit);
  return {
    ...audit,
    auditIntegrity: {
      ...audit.auditIntegrity,
      payloadSha256: hash(canonical),
      payloadByteLength: length(canonical),
    },
  };
};

const verify = (
  input: M2SingleOperatorReproducibleAuditInputV0_1,
  observed = [
    { artifactId: "source-1", bytes: sourceBytes },
    { artifactId: "inventory-1", bytes: inventoryBytes },
  ],
) => verifyM2SingleOperatorReproducibleAuditV0_1(input, observed);

const refingerprint = (
  input: M2SingleOperatorReproducibleAuditInputV0_1,
): M2SingleOperatorReproducibleAuditInputV0_1 => {
  const canonical = canonicalSerializeM2SingleOperatorAuditV0_1(input);
  return {
    ...input,
    auditIntegrity: {
      ...input.auditIntegrity,
      payloadSha256: hash(canonical),
      payloadByteLength: length(canonical),
    },
  };
};

const expectBlockedWithoutAuthorization = (
  result: ReturnType<typeof verifyM2SingleOperatorReproducibleAuditV0_1>,
) => {
  expect(result.status).toBe("BLOCKED");
  expect(result.realCandidateIntakeAuthorized).toBe(false);
  expect(result.realSelectionExecuted).toBe(false);
  expect(result.realExecutionAuthorized).toBe(false);
  expect(JSON.stringify(result)).not.toContain("synthetic-form");
  expect(JSON.stringify(result)).not.toContain("substantive synthetic sense");
};

describe("M2 single-operator reproducible audit", () => {
  test("verifies synthetic evidence without claiming independent review or authorization", () => {
    const result = verify(baseAudit());
    expect(result.status).toBe(M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1);
    expect(result.reasonCodes).toEqual(["SINGLE_OPERATOR_AUDIT_VERIFIED"]);
    expect(result.auditFingerprint.verified).toBe(true);
    expect(result.independentHumanReviewClaimed).toBe(false);
    expect(result.realKeyCreated).toBe(false);
    expect(result.realCandidateIntakeAuthorized).toBe(false);
    expect(result.realSelectionExecuted).toBe(false);
    expect(result.realExecutionAuthorized).toBe(false);
  });

  test("recomputes stale or mismatched artifact hashes and byte lengths", () => {
    const result = verify(baseAudit(), [
      { artifactId: "source-1", bytes: "changed-source-bytes" },
      { artifactId: "inventory-1", bytes: inventoryBytes },
    ]);
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toEqual(
      expect.arrayContaining(["EVIDENCE_HASH_MISMATCH", "EVIDENCE_BYTE_LENGTH_MISMATCH"]),
    );
  });

  test("fails closed for incomplete prior-use coverage", () => {
    const input = baseAudit();
    const result = verify(refingerprint({
      ...input,
      candidateRecords: [
        {
          ...input.candidateRecords[0],
          priorUse: { ...input.candidateRecords[0].priorUse, priorResearch: "UNKNOWN" },
          declaredDecision: "UNKNOWN",
          declaredReasonCodes: ["PRIOR_USE_UNKNOWN_OR_CONFLICTING"],
        },
      ],
    }));
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toContain("PRIOR_USE_UNKNOWN_OR_CONFLICTING");
  });

  test("requires self-review provenance but does not require a second human", () => {
    const input = baseAudit();
    const result = verify({
      ...input,
      controller: {
        ...input.controller,
        controllerReference: "",
        selfReviewStatus: "UNREVIEWED",
      } as typeof input.controller,
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toContain("SELF_REVIEW_PROVENANCE_MISSING");
  });

  test("rejects a false independent-human-review claim", () => {
    const input = baseAudit();
    const result = verify({
      ...input,
      controller: {
        ...input.controller,
        independentReviewerReference: "same-controller",
      } as typeof input.controller,
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toContain("INDEPENDENT_REVIEW_CLAIM_FORBIDDEN");
  });

  test("rejects target-bearing public projection content", () => {
    const input = baseAudit();
    const leaked = {
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
      targetWord: "must-not-leak",
    };
    const serializedBytes = `${JSON.stringify(leaked, Object.keys(leaked).sort())}\n`;
    const publicArtifact = {
      serializedBytes,
      sha256: hash(serializedBytes),
      byteLength: length(serializedBytes),
      frozen: true as const,
    };
    const unsigned = { ...input, publicProjection: publicArtifact };
    const canonical = canonicalSerializeM2SingleOperatorAuditV0_1(unsigned);
    const result = verify({
      ...unsigned,
      auditIntegrity: {
        ...input.auditIntegrity,
        payloadSha256: hash(canonical),
        payloadByteLength: length(canonical),
      },
    });
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toContain("PUBLIC_TARGET_SEMANTICS_EXPOSED");
    expect(JSON.stringify(result)).not.toContain("must-not-leak");
  });

  test("rejects nested public metadata and scope mismatches", () => {
    const input = baseAudit();
    const projection = JSON.parse(input.publicProjection.serializedBytes) as Record<string, unknown>;
    projection.scopeId = { sourceForm: "synthetic-form", text: "substantive synthetic sense" };
    const serializedBytes = `${JSON.stringify(projection, Object.keys(projection).sort())}\n`;
    const unsigned = {
      ...input,
      publicProjection: {
        serializedBytes,
        sha256: hash(serializedBytes),
        byteLength: length(serializedBytes),
        frozen: true as const,
      },
    };
    const result = verify(refingerprint(unsigned));
    expectBlockedWithoutAuthorization(result);
    expect(result.reasonCodes).toContain("PUBLIC_PROJECTION_INVALID");
  });

  test("binds the candidate sense to the referenced source entry", () => {
    const input = baseAudit();
    const attestation = sourceAttestation();
    const secondEntry = {
      ...attestation.entries[0],
      entryId: "entry-2",
      entryKey: "other-form",
      entryLocator: "entry-2",
      sourceForm: "other-form",
      senses: [{ ...attestation.entries[0].senses[0], senseId: "sense-2", senseLocator: "sense-2" }],
      selectedSenseId: "sense-2",
    };
    const result = verify(refingerprint({
      ...input,
      candidateRecords: [{
        ...input.candidateRecords[0],
        sourceSenseReference: "sense-2",
        sourceAttestation: {
          ...attestation,
          entries: [...attestation.entries, secondEntry],
        },
      }],
    }));
    expectBlockedWithoutAuthorization(result);
    expect(result.reasonCodes).toContain("SOURCE_ARTIFACT_REFERENCE_INVALID");
  });

  test.each(["PRESENT", "UNKNOWN", "CONFLICTING"] as const)(
    "rejects array-valued prior-use status %s",
    (status) => {
      const input = baseAudit();
      const malformed = {
        ...input,
        candidateRecords: [{
          ...input.candidateRecords[0],
          priorUse: {
            ...input.candidateRecords[0].priorUse,
            baseline: [status],
          },
        }],
      } as unknown as M2SingleOperatorReproducibleAuditInputV0_1;
      const result = verify(refingerprint(malformed));
      expectBlockedWithoutAuthorization(result);
      expect(result.reasonCodes).toContain("CANDIDATE_RECORD_SHAPE_INVALID");
    },
  );

  test("rejects an unresolved multi-sense attestation with a null sense reference", () => {
    const input = baseAudit();
    const attestation = sourceAttestation();
    const unresolvedAttestation = {
      ...attestation,
      entries: [{
        ...attestation.entries[0],
        senses: [
          ...attestation.entries[0].senses,
          {
            ...attestation.entries[0].senses[0],
            senseId: "sense-2",
            senseLocator: "sense-2",
          },
        ],
        senseSelectionStatus: "UNRESOLVED" as const,
        selectedSenseId: null,
      }],
    };
    const malformed = {
      ...input,
      candidateRecords: [{
        ...input.candidateRecords[0],
        sourceSenseReference: null,
        sourceAttestation: unresolvedAttestation,
        declaredDecision: "UNKNOWN" as const,
        declaredReasonCodes: ["PRIOR_USE_UNKNOWN_OR_CONFLICTING"],
      }],
    } as unknown as M2SingleOperatorReproducibleAuditInputV0_1;
    const result = verify(refingerprint(malformed));
    expectBlockedWithoutAuthorization(result);
    expect(result.reasonCodes).toContain("SOURCE_ARTIFACT_REFERENCE_INVALID");
  });

  test("requires exclusion categories to come from an exclusion inventory", () => {
    const input = baseAudit();
    const result = verify(
      refingerprint({
        ...input,
        declaredScope: {
          ...input.declaredScope,
          evidenceArtifactIds: ["source-1"],
        },
        evidenceArtifacts: [{
          ...input.evidenceArtifacts[0],
          declaredCategories: [...M2_SINGLE_OPERATOR_EXCLUSION_CATEGORIES_V0_1],
        }] as typeof input.evidenceArtifacts,
      }),
      [{ artifactId: "source-1", bytes: sourceBytes }],
    );
    expectBlockedWithoutAuthorization(result);
    expect(result.reasonCodes).toContain("EVIDENCE_SCOPE_INCOMPLETE");
  });

  test("rejects a missing audit mode before applying mode-specific rules", () => {
    const input = baseAudit();
    const malformed = { ...input } as M2SingleOperatorReproducibleAuditInputV0_1 & Record<string, unknown>;
    delete malformed.auditMode;
    const result = verify(refingerprint(malformed));
    expectBlockedWithoutAuthorization(result);
    expect(result.reasonCodes).toContain("AUDIT_MODE_INVALID");
  });

  test("rejects missing and non-array candidate collections", () => {
    const input = baseAudit();
    const missing = { ...input } as M2SingleOperatorReproducibleAuditInputV0_1 & Record<string, unknown>;
    delete missing.candidateRecords;
    const missingResult = verify(refingerprint(missing));
    expectBlockedWithoutAuthorization(missingResult);
    expect(missingResult.reasonCodes).toContain("CANDIDATE_RECORD_SHAPE_INVALID");

    const nonArray = refingerprint({
      ...input,
      candidateRecords: null as unknown as M2SingleOperatorReproducibleAuditInputV0_1["candidateRecords"],
    });
    const nonArrayResult = verify(nonArray);
    expectBlockedWithoutAuthorization(nonArrayResult);
    expect(nonArrayResult.reasonCodes).toContain("CANDIDATE_RECORD_SHAPE_INVALID");
  });

  test("rejects manual preference and unauthorized execution flags", () => {
    const input = baseAudit();
    const result = verify(refingerprint({
      ...input,
      selectionPolicy: { ...input.selectionPolicy, manualPreference: true } as typeof input.selectionPolicy,
      executionBoundary: { ...input.executionBoundary, realSelectionExecuted: true } as typeof input.executionBoundary,
    }));
    expect(result.status).toBe("BLOCKED");
    expect(result.reasonCodes).toEqual(
      expect.arrayContaining(["SELECTION_POLICY_INVALID", "SELECTION_EXECUTED_UNAUTHORIZED"]),
    );
  });

  test("keeps audit fingerprints deterministic and non-self-referential", () => {
    const input = baseAudit();
    const first = verify(input);
    const second = verify(JSON.parse(JSON.stringify(input)) as typeof input);
    expect(second).toEqual(first);
    expect(input.auditIntegrity.selfReferential).toBe(false);
  });
});
