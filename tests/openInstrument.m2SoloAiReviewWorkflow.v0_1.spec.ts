import {
  buildM2SoloAiBlindResearchHandoffV0_1,
  buildM2SoloAiReviewerProjectionV0_1,
  evaluateM2SoloAiReviewDecisionV0_1,
  M2_SOLO_AI_REVIEW_CHECKS_V0_1,
  M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1,
  M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1,
  verifyM2SoloAiReviewerProjectionReadOnlyV0_1,
  type M2SoloAiReviewDecisionV0_1,
} from "../src/shared/openInstrument/m2SoloAiReviewWorkflow.v0_1";
import {
  canonicalSerializeOneEmbryoProofM2V0_1,
  sha256OneEmbryoProofM2V0_1,
  type M2BlindPayloadV0_1,
} from "../src/shared/openInstrument/oneEmbryoProofM2Preregistration.v0_1";

const sha = (digit: string) => digit.repeat(64);
const allMachineChecks = () => Object.fromEntries(M2_SOLO_AI_REVIEW_CHECKS_V0_1.map((item) => [item, "PASS"])) as M2SoloAiReviewDecisionV0_1["checks"];
const payload: M2BlindPayloadV0_1 = {
  schemaVersion: "open-instrument.one-embryo-proof-m2.v0.1",
  caseOpaqueId: "synthetic:payload",
  structuralEmbryo: "q",
  structuralFingerprint: sha("a"),
  voicePath: ["A"],
  sourceUniverseId: "synthetic-universe",
  searchPolicyId: "synthetic-policy",
  stopRuleId: "synthetic-stop-rule",
  claimBoundary: ["research_only", "Null_valid"],
  targetRevealStatus: "FORBIDDEN_UNTIL_REVEAL_GATE",
};

const decision = (): M2SoloAiReviewDecisionV0_1 => ({
  schemaVersion: M2_SOLO_AI_REVIEW_WORKFLOW_SCHEMA_V0_1,
  reviewerIdentity: {
    provider: "OpenAI",
    agent: "Codex",
    modelId: "GPT-6",
    sessionId: "codex-thread:synthetic-review-session",
    identityBasis: "CALLER_DECLARED",
  },
  classification: M2_SOLO_AI_REVIEW_CLASSIFICATION_V0_1,
  outcome: "PASS",
  reviewedInputSha256: sha("b"),
  reviewedArtifactSha256s: [sha("c"), sha("d")],
  selectionFingerprintBefore: sha("e"),
  selectionFingerprintAfter: sha("e"),
  checks: Object.fromEntries(M2_SOLO_AI_REVIEW_CHECKS_V0_1.map((item) => [item, "PASS"])) as M2SoloAiReviewDecisionV0_1["checks"],
  conflicts: [],
  failures: [],
  claimsHumanIndependentReview: false,
});

describe("M2 solo AI review handoff v0.1", () => {
  test("accepts a synthetic read-only review with exact identity and unchanged selection", () => {
    const result = evaluateM2SoloAiReviewDecisionV0_1({
      reviewerInputSha256: sha("b"),
      artifactSha256s: [sha("d"), sha("c")],
      selectionFingerprint: sha("e"),
      machineChecks: allMachineChecks(),
    }, decision());

    expect(result.status).toBe("PASS");
    expect(result.classification).toBe("AI_ASSISTED_NOT_HUMAN_INDEPENDENT");
    expect(result.selectionUnchanged).toBe(true);
    expect(result.humanIndependentReviewClaimed).toBe(false);
  });

  test("fails when the reviewer explicitly rejects despite otherwise valid passing fields", () => {
    const rejected = { ...decision(), outcome: "FAIL" as const };
    const result = evaluateM2SoloAiReviewDecisionV0_1({
      reviewerInputSha256: sha("b"),
      artifactSha256s: [sha("c"), sha("d")],
      selectionFingerprint: sha("e"),
      machineChecks: allMachineChecks(),
    }, rejected);

    expect(result.status).toBe("FAIL");
    expect(result.reasonCodes).toContain("REVIEWER_REJECTED_REVIEW");
  });

  test("fails a changed selection fingerprint and does not accept reviewer selection overrides", () => {
    const original = decision();
    const before = JSON.stringify(original);
    const mutated = {
      ...original,
      selectionFingerprintAfter: sha("f"),
      selectedCandidateId: "m2:reviewer-selected",
    };
    const result = evaluateM2SoloAiReviewDecisionV0_1({
      reviewerInputSha256: sha("b"),
      artifactSha256s: [sha("c"), sha("d")],
      selectionFingerprint: sha("e"),
      machineChecks: allMachineChecks(),
    }, mutated);

    expect(result.status).toBe("FAIL");
    expect(result.reasonCodes).toEqual(expect.arrayContaining([
      "REVIEW_DECISION_SCHEMA_INVALID",
      "SELECTION_FINGERPRINT_CHANGED",
    ]));
    expect(JSON.stringify(original)).toBe(before);
  });

  test("returns UNKNOWN when reviewer identity or a required review check is unknown", () => {
    const input = decision();
    const unknown = {
      ...input,
      reviewerIdentity: { ...input.reviewerIdentity, sessionId: "UNSPECIFIED" },
      checks: { ...input.checks, sourceProvenanceValidated: "UNKNOWN" as const },
    };
    const result = evaluateM2SoloAiReviewDecisionV0_1({
      reviewerInputSha256: sha("b"),
      artifactSha256s: [sha("c"), sha("d")],
      selectionFingerprint: sha("e"),
      machineChecks: allMachineChecks(),
    }, unknown);

    expect(result.status).toBe("UNKNOWN");
    expect(result.reasonCodes).toContain("REVIEWER_IDENTITY_UNKNOWN");

    const freeTextIdentity = {
      ...decision(),
      reviewerIdentity: { ...decision().reviewerIdentity, modelId: "GPT-6 reviewer notes" },
    };
    const rejectedIdentity = evaluateM2SoloAiReviewDecisionV0_1({
      reviewerInputSha256: sha("b"),
      artifactSha256s: [sha("c"), sha("d")],
      selectionFingerprint: sha("e"),
      machineChecks: allMachineChecks(),
    }, freeTextIdentity);
    expect(rejectedIdentity.status).toBe("UNKNOWN");
    expect(rejectedIdentity.reasonCodes).toContain("REVIEWER_IDENTITY_UNKNOWN");
  });

  test("hands the blind agent only the allowlisted frozen payload", () => {
    const result = buildM2SoloAiBlindResearchHandoffV0_1(payload);
    expect(result.status).toBe("PASS");
    expect(result.role).toBe("BLIND_RESEARCH_AGENT");
    expect(result.targetSemanticsProvided).toBe(false);
    expect(result.sourceIdentityProvided).toBe(false);
    expect(result.selectionControlProvided).toBe(false);
    expect(result.m3ExecutionPerformed).toBe(false);
    expect(Object.keys(result.payload).sort()).toEqual([...result.allowedKeys].sort());
  });

  test("snapshots and freezes the exact hashed blind payload", () => {
    const mutableInput = JSON.parse(JSON.stringify(payload)) as M2BlindPayloadV0_1;
    const result = buildM2SoloAiBlindResearchHandoffV0_1(mutableInput);
    mutableInput.claimBoundary.push("leaked target meaning");

    expect(result.payload.claimBoundary).toEqual(["research_only", "Null_valid"]);
    expect(result.status).toBe("PASS");
    expect(Object.isFrozen(result.payload)).toBe(true);
    expect(Object.isFrozen(result.payload.claimBoundary)).toBe(true);
    expect(result.payloadSha256).toBe(sha256OneEmbryoProofM2V0_1(
      `${canonicalSerializeOneEmbryoProofM2V0_1(result.payload)}\n`,
    ));
  });

  test("fails closed if target semantics are added to the blind handoff", () => {
    const leaked = { ...payload, targetSenseDefinition: "private meaning" };
    const result = buildM2SoloAiBlindResearchHandoffV0_1(leaked as unknown as M2BlindPayloadV0_1);
    expect(result.status).toBe("FAIL");
    expect(result.forbiddenKeyPaths).toContain("$.targetSenseDefinition");
  });

  test("gives the reviewer a read-only projection and hashes its canonical bytes", () => {
    const blind = buildM2SoloAiBlindResearchHandoffV0_1(payload);
    const projection = buildM2SoloAiReviewerProjectionV0_1({
      machineAuditStatus: "PASS",
      auditReasonCodes: ["SYNTHETIC_AUDIT_VERIFIED"],
      evidenceIntegrity: [{
        artifactId: "source-fixture",
        expectedSha256: sha("c"),
        observedSha256: sha("c"),
        expectedByteLength: 12,
        observedByteLength: 12,
      }],
      exclusionCoverage: {
        requiredCategories: ["baseline", "priorTarget"],
        coveredCategories: ["baseline", "priorTarget"],
        status: "PASS",
      },
      machineChecks: allMachineChecks(),
      sourceProvenance: [{
        candidateOpaqueId: "m2:synthetic-a",
        sourceTraditionId: "synthetic-tradition",
        sourceTitle: "Synthetic source",
        sourceRevisionOrAccessDate: "synthetic-v0.1",
        sourceFilePath: "synthetic/source.json",
        sourceHash: sha("c"),
        entryReference: "entry-1",
        senseReference: "sense-1",
        validationStatus: "PASS",
      }],
      sealedManifest: { sha256: sha("d"), byteLength: 24, validationStatus: "PASS", syntheticOnly: true },
      selection: { selectorId: "frozen-synthetic-selector", eligibleCandidateCount: 2, selectionFingerprint: sha("e") },
      blindPayload: blind.payload,
    });

    expect(projection.projection.role).toBe("AI_REVIEWER_READ_ONLY");
    expect(projection.projection.accessBoundary.canChangeCandidateSelection).toBe(false);
    expect(projection.projection.accessBoundary.receivesHmacKey).toBe(false);
    expect(projection.projection.accessBoundary.receivesTargetMeaning).toBe(false);
    expect(verifyM2SoloAiReviewerProjectionReadOnlyV0_1(projection.projection)).toBe(true);
    expect(verifyM2SoloAiReviewerProjectionReadOnlyV0_1({
      ...projection.projection,
      accessBoundary: { ...projection.projection.accessBoundary, canChangeCandidateSelection: true },
    })).toBe(false);
    expect(projection.projection.sourceProvenance[0]).not.toHaveProperty("senseText");
    expect(Object.isFrozen(projection.projection)).toBe(true);
    expect(Object.isFrozen(projection.projection.blindPayload.claimBoundary)).toBe(true);
    expect(projection.sha256).toMatch(/^[0-9a-f]{64}$/u);
  });

  test("does not let the AI reviewer upgrade a failed machine check", () => {
    const machineChecks = { ...allMachineChecks(), frozenContractLocked: "FAIL" as const };
    const result = evaluateM2SoloAiReviewDecisionV0_1({
      reviewerInputSha256: sha("b"),
      artifactSha256s: [sha("c"), sha("d")],
      selectionFingerprint: sha("e"),
      machineChecks,
    }, decision());

    expect(result.status).toBe("FAIL");
    expect(result.reasonCodes).toContain("REVIEW_CHECK_UPGRADED:frozenContractLocked");
  });

  test("records reviewer conflicts as a failure and rejects free-text conflict details", () => {
    const conflict = { ...decision(), conflicts: ["SOURCE_HASH_CONFLICT"] };
    const result = evaluateM2SoloAiReviewDecisionV0_1({
      reviewerInputSha256: sha("b"),
      artifactSha256s: [sha("c"), sha("d")],
      selectionFingerprint: sha("e"),
      machineChecks: allMachineChecks(),
    }, conflict);
    expect(result.status).toBe("FAIL");
    expect(result.reasonCodes).toContain("REVIEW_CONFLICTS_PRESENT");

    const freeText = { ...decision(), conflicts: ["target word definition leaked"] };
    const rejected = evaluateM2SoloAiReviewDecisionV0_1({
      reviewerInputSha256: sha("b"),
      artifactSha256s: [sha("c"), sha("d")],
      selectionFingerprint: sha("e"),
      machineChecks: allMachineChecks(),
    }, freeText);
    expect(rejected.status).toBe("FAIL");
    expect(rejected.reasonCodes).toContain("REVIEW_CONFLICT_CODE_INVALID");
  });
});
