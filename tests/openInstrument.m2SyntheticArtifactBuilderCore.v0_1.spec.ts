import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  selectFirstEligibleSyntheticM2CandidateV0_1,
} from "../src/shared/openInstrument/oneEmbryoProofM2Preregistration.v0_1";
import {
  buildM2ControllerPrivateStructuralFreezeRecordV0_1,
  computeM2SharedStructuralFingerprintV0_1,
  findForbiddenM2OperatorVisibleProjectionKeysV0_1,
  buildSyntheticM2ArtifactCoreV0_1,
  projectM2ControllerPrivateStructuralFreezeToOperatorV0_1,
  serializeM2OperatorVisiblePayloadV0_1,
  findForbiddenM2BlindPayloadContentV0_1,
  validateM2SyntheticEligibilityPoolV0_1,
  type M2SyntheticCandidateEligibilityDeclarationV0_1,
  type M2SyntheticArtifactCoreInputV0_1,
} from "../src/shared/openInstrument/m2SyntheticArtifactBuilderCore.v0_1";
import { discoverStructuralHypothesesV0_1 } from "../src/shared/structuralHypothesisDiscovery.v0_1";

const root = process.cwd();
const pool = JSON.parse(
  readFileSync(
    resolve(root, "src/data/openInstrument/targetSenseAuthorityPool.v0_1.json"),
    "utf8",
  ),
) as {
  entries: readonly { caseId: string }[];
};
const baselineManifest = JSON.parse(
  readFileSync(
    resolve(
      root,
      "tests/fixtures/openInstrument/analysis-capability-baseline.v1.manifest.json",
    ),
    "utf8",
  ),
) as { cases: readonly { caseId: string }[] };
const priorResearch = JSON.parse(
  readFileSync(
    resolve(
      root,
      "docs/open-instrument/research-artifacts/frozen-target-functional-research-trial-v0_1/restart-01.json",
    ),
    "utf8",
  ),
) as { selection: { eligibleCaseIds: readonly string[] } };

const emptyPriorUseEvidence = () => ({
  baseline: false,
  control: false,
  reveal: false,
  priorTarget: false,
  priorResearch: false,
  previouslyUsed: false,
  previouslyRevealed: false,
});

const declaration = (
  opaqueCandidateId: string,
  overrides: Partial<M2SyntheticCandidateEligibilityDeclarationV0_1> = {},
): M2SyntheticCandidateEligibilityDeclarationV0_1 => ({
  opaqueCandidateId,
  opaqueIdentityStatus: "REVIEWED_OPAQUE_IDENTITY",
  eligibilityDecision: "ELIGIBLE",
  identityStatus: "UNAMBIGUOUS",
  sourceAuthorityStatus: "VERIFIED",
  senseAuthorityStatus: "RESOLVED_ONE_REVIEWABLE_SENSE",
  priorUseEvidence: emptyPriorUseEvidence(),
  ...overrides,
});

const syntheticInput = (
  structuralInput = "qai",
  overrides: Partial<M2SyntheticArtifactCoreInputV0_1> = {},
): M2SyntheticArtifactCoreInputV0_1 => ({
  poolCoverage: "COMPLETE",
  candidateDeclarations: [declaration("synthetic:case-b")],
  caseOpaqueId: "synthetic:payload",
  structuralInput,
  sourceUniverseId: "synthetic-source-universe-v0_1",
  searchPolicyId: "synthetic-search-policy-v0_1",
  stopRuleId: "synthetic-stop-rule-v0_1",
  claimBoundary: ["research_only", "no_single_winner", "user_decides"],
  ...overrides,
});

describe("Open Instrument M2 synthetic artifact builder core", () => {
  test("fails closed for all seven resolved authority-pool records", () => {
    const baselineIds = new Set(
      baselineManifest.cases.map((item) => item.caseId),
    );
    const priorResearchIds = new Set(
      priorResearch.selection.eligibleCaseIds,
    );
    const declarations = pool.entries.map((entry) =>
      declaration(entry.caseId, {
        opaqueIdentityStatus: "UNVERIFIED",
        priorUseEvidence: {
          ...emptyPriorUseEvidence(),
          baseline: baselineIds.has(entry.caseId),
          priorResearch: priorResearchIds.has(entry.caseId),
        },
      }),
    );

    const result = validateM2SyntheticEligibilityPoolV0_1(
      declarations,
      "COMPLETE",
    );

    expect(pool.entries).toHaveLength(7);
    expect(result.complete).toBe(true);
    expect(result.candidateRecords).toHaveLength(7);
    expect(result.candidateEvidence).toHaveLength(7);
    expect(result.eligibleCandidates).toHaveLength(0);
    expect(result.candidateRecords.every((item) => item.eligibility === "EXCLUDED")).toBe(
      true,
    );
    expect(result.reasonCodes).toEqual(
      expect.arrayContaining([
        "OPAQUE_IDENTITY_UNVERIFIED",
        "PRIOR_BASELINE",
        "PRIOR_RESEARCH",
      ]),
    );
  });

  test("requires complete evidence and rejects duplicates and ambiguity", () => {
    const missingEvidence = validateM2SyntheticEligibilityPoolV0_1(
      [{ opaqueCandidateId: "synthetic:missing" } as unknown as M2SyntheticCandidateEligibilityDeclarationV0_1],
      "COMPLETE",
    );
    expect(missingEvidence.complete).toBe(false);
    expect(missingEvidence.eligibleCandidates).toHaveLength(0);
    expect(missingEvidence.reasonCodes).toContain(
      "ELIGIBILITY_DECLARATION_INCOMPLETE",
    );

    const duplicate = validateM2SyntheticEligibilityPoolV0_1(
      [declaration("synthetic:duplicate"), declaration("synthetic:duplicate")],
      "COMPLETE",
    );
    expect(duplicate.complete).toBe(false);
    expect(duplicate.reasonCodes).toContain("DUPLICATE_OPAQUE_CANDIDATE_ID");

    const ambiguous = validateM2SyntheticEligibilityPoolV0_1(
      [declaration("synthetic:ambiguous", { identityStatus: "AMBIGUOUS" })],
      "COMPLETE",
    );
    expect(ambiguous.eligibleCandidates).toHaveLength(0);
    expect(ambiguous.reasonCodes).toContain("IDENTITY_AMBIGUOUS");
  });

  test("uses the existing deterministic opaque-id selector", () => {
    const result = validateM2SyntheticEligibilityPoolV0_1(
      [declaration("synthetic:case-z"), declaration("synthetic:case-a")],
      "COMPLETE",
    );
    const selected = selectFirstEligibleSyntheticM2CandidateV0_1(
      result.candidateRecords,
    );
    expect(selected?.opaqueCandidateId).toBe("synthetic:case-a");
  });

  test("builds a canonical synthetic payload from the first structural result", () => {
    const result = buildSyntheticM2ArtifactCoreV0_1(
      syntheticInput("qay", {
        candidateDeclarations: [
          declaration("synthetic:case-z"),
          declaration("synthetic:case-a"),
        ],
      }),
    );

    expect(result.status).toBe("SYNTHETIC_PAYLOAD_BUILT");
    expect(result.selectedCandidate?.opaqueCandidateId).toBe(
      "synthetic:case-a",
    );
    expect(result.structural.kind).toBe("HYPOTHESIS");
    expect(result.structural.selectedIndex).toBe(0);
    expect(result.blindPayload?.voicePath).toEqual(
      expect.arrayContaining(["Y"]),
    );
    expect(result.blindPayload?.targetRevealStatus).toBe(
      "FORBIDDEN_UNTIL_REVEAL_GATE",
    );
    expect(result.payloadBytes?.toString("utf8").endsWith("\n")).toBe(true);
    expect(result.payloadByteLength).toBe(result.payloadBytes?.byteLength);
    expect(result.payloadSha256).toBeDefined();
    expect(result.reasonCodes).toContain("SYNTHETIC_PAYLOAD_CORE_BUILT");
    expect(result.reasonCodes).toContain(
      "M2_CONTROLLER_PRIVATE_RECORD_BUILT",
    );
    expect(result.structuralFreeze.ready).toBe(true);
    expect(Object.keys(result)).toEqual([
      "status",
      "selectedCandidate",
      "structural",
      "structuralFreeze",
      "blindPayload",
      "payloadBytes",
      "payloadSha256",
      "payloadByteLength",
      "reasonCodes",
    ]);
    expect(JSON.stringify(result)).not.toContain("structuralHypothesis");
    expect(JSON.stringify(result)).not.toContain("reductionSteps");
    expect(JSON.stringify(result)).not.toContain("expansionChain");
    expect(JSON.stringify(result)).not.toContain("controllerArtifactSha256");
    const repeat = buildSyntheticM2ArtifactCoreV0_1(
      syntheticInput("qay", {
        candidateDeclarations: [
          declaration("synthetic:case-z"),
          declaration("synthetic:case-a"),
        ],
      }),
    );
    expect(repeat.payloadSha256).toBe(result.payloadSha256);
    expect(repeat.payloadBytes?.equals(result.payloadBytes as Buffer)).toBe(
      true,
    );
    expect(JSON.stringify(result.blindPayload)).not.toContain("targetWord");
    expect(JSON.stringify(result.blindPayload)).not.toContain("hypothesisId");
    expect(JSON.stringify(result.blindPayload)).not.toContain("expansionChain");
    expect(JSON.stringify(result.blindPayload)).not.toContain("reductionSteps");
  });

  test("binds a private structural record to a limited operator projection", () => {
    const result = buildSyntheticM2ArtifactCoreV0_1(syntheticInput("qay"));
    const hypothesis = discoverStructuralHypothesesV0_1("qay")[0];
    expect(hypothesis).toBeDefined();
    const privateRecord = buildM2ControllerPrivateStructuralFreezeRecordV0_1(
      hypothesis as NonNullable<typeof hypothesis>,
    );
    expect(privateRecord.structuralHypothesis).toEqual(
      expect.objectContaining({ basis: "qay", embryo: expect.any(String) }),
    );
    expect(privateRecord.controllerArtifactSha256).toMatch(/^[0-9a-f]{64}$/u);
    expect(privateRecord.controllerArtifactByteLength).toBeGreaterThan(0);
    expect(privateRecord.controllerArtifactSha256).not.toBe(
      privateRecord.structuralFingerprint,
    );
    expect(privateRecord.structuralFingerprint).toBe(
      computeM2SharedStructuralFingerprintV0_1(
        privateRecord.structuralHypothesis.embryo,
        result.blindPayload?.voicePath ?? [],
      ),
    );

    const projection = projectM2ControllerPrivateStructuralFreezeToOperatorV0_1(
      privateRecord,
      {
        caseOpaqueId: "synthetic:payload",
        sourceUniverseId: "synthetic-source-universe-v0_1",
        searchPolicyId: "synthetic-search-policy-v0_1",
        stopRuleId: "synthetic-stop-rule-v0_1",
        claimBoundary: ["research_only", "no_single_winner", "user_decides"],
      },
    );

    expect(projection.status).toBe("PROJECTED");
    expect(projection.operatorPayload).toEqual(result.blindPayload);
    expect(projection.payloadSha256).toBe(result.payloadSha256);
    expect(projection.payloadByteLength).toBe(result.payloadByteLength);
    expect(projection.reasonCodes).toEqual(
      expect.arrayContaining([
        "M2_CONTROLLER_PRIVATE_RECORD_BUILT",
        "M2_OPERATOR_PROJECTION_BUILT",
      ]),
    );

    const privateKeys = findForbiddenM2OperatorVisibleProjectionKeysV0_1(
      privateRecord?.structuralHypothesis,
    );
    expect(privateKeys).toEqual(
      expect.arrayContaining([
        "$.hypothesisId",
        "$.basis",
        "$.reductionSteps",
        "$.expansionChain",
      ]),
    );
    expect(findForbiddenM2OperatorVisibleProjectionKeysV0_1(
      projection.operatorPayload,
    )).toEqual([]);
    expect(Object.keys(projection)).toEqual([
      "status",
      "operatorPayload",
      "payloadBytes",
      "payloadSha256",
      "payloadByteLength",
      "reasonCodes",
    ]);
    expect(JSON.stringify(projection)).not.toContain("structuralHypothesis");
    expect(JSON.stringify(projection)).not.toContain("controllerArtifactSha256");
    expect(JSON.stringify({ ...projection })).not.toContain("PRIVATE_HYPOTHESIS");
    expect(JSON.stringify({ ...projection })).not.toContain("PRIVATE_BASIS");

    const tampered = projectM2ControllerPrivateStructuralFreezeToOperatorV0_1(
      {
        ...privateRecord,
        structuralFingerprint: "0".repeat(64),
      },
      {
        caseOpaqueId: "synthetic:payload",
        sourceUniverseId: "synthetic-source-universe-v0_1",
        searchPolicyId: "synthetic-search-policy-v0_1",
        stopRuleId: "synthetic-stop-rule-v0_1",
        claimBoundary: ["research_only"],
      },
    );
    expect(tampered.status).toBe("BLOCKED");
    expect(tampered.operatorPayload).toBeNull();
    expect(tampered.reasonCodes).toContain(
      "M2_CONTROLLER_PRIVATE_RECORD_INVALID",
    );

    const malformed = projectM2ControllerPrivateStructuralFreezeToOperatorV0_1(
      null as unknown as typeof privateRecord,
      null as unknown as Parameters<
        typeof projectM2ControllerPrivateStructuralFreezeToOperatorV0_1
      >[1],
    );
    expect(malformed.status).toBe("BLOCKED");
    expect(malformed.reasonCodes).toContain(
      "M2_CONTROLLER_PRIVATE_RECORD_INVALID",
    );
  });

  test("isolates private-artifact changes from the shared fingerprint and rejects extra operator keys", () => {
    const hypothesis = discoverStructuralHypothesesV0_1("qay")[0];
    expect(hypothesis).toBeDefined();
    const privateRecord = buildM2ControllerPrivateStructuralFreezeRecordV0_1(
      hypothesis as NonNullable<typeof hypothesis>,
    );
    const privateHypothesis = privateRecord.structuralHypothesis;
    expect(privateHypothesis.reductionSteps.length).toBeGreaterThan(0);
    const privateOnlyVariants = [
      {
        basis: "PRIVATE_BASIS_SENTINEL",
      },
      {
        hypothesisId: "PRIVATE_HYPOTHESIS_SENTINEL",
      },
      {
        evidenceRefs: [
          ...privateHypothesis.evidenceRefs,
          "PRIVATE_EVIDENCE_SENTINEL",
        ],
      },
      {
        reductionSteps: privateHypothesis.reductionSteps.map((step, index) =>
          index === 0
            ? {
                ...step,
                removedOrChanged: `${step.removedOrChanged}:PRIVATE`,
              }
            : step,
        ),
      },
      {
        expansionChain: [
          ...privateHypothesis.expansionChain,
          "PRIVATE_EXPANSION_SENTINEL",
        ],
      },
    ];
    for (const privateOnlyVariant of privateOnlyVariants) {
      const alteredRecord =
        buildM2ControllerPrivateStructuralFreezeRecordV0_1({
          ...privateHypothesis,
          ...privateOnlyVariant,
        });
      expect(alteredRecord.structuralFingerprint).toBe(
        privateRecord.structuralFingerprint,
      );
      expect(alteredRecord.controllerArtifactSha256).not.toBe(
        privateRecord.controllerArtifactSha256,
      );
    }

    const visibleAlteredRecord =
      buildM2ControllerPrivateStructuralFreezeRecordV0_1({
        ...privateRecord.structuralHypothesis,
        embryo: "AU",
      });
    expect(visibleAlteredRecord.structuralFingerprint).not.toBe(
      privateRecord.structuralFingerprint,
    );
    expect(
      computeM2SharedStructuralFingerprintV0_1(
        privateHypothesis.embryo,
        ["A"],
      ),
    ).not.toBe(privateRecord.structuralFingerprint);

    const projection = projectM2ControllerPrivateStructuralFreezeToOperatorV0_1(
      privateRecord,
      {
        caseOpaqueId: "synthetic:payload",
        sourceUniverseId: "synthetic-source-universe-v0_1",
        searchPolicyId: "synthetic-search-policy-v0_1",
        stopRuleId: "synthetic-stop-rule-v0_1",
        claimBoundary: ["research_only"],
      },
    );
    const extraKey = {
      ...projection.operatorPayload,
      hypothesisId: "PRIVATE_HYPOTHESIS_SENTINEL",
    };
    const rejected = serializeM2OperatorVisiblePayloadV0_1(extraKey);
    expect(rejected.status).toBe("BLOCKED");
    expect(rejected.operatorPayload).toBeNull();
    expect(rejected.payloadBytes).toBeNull();
    expect(rejected.reasonCodes).toEqual(
      expect.arrayContaining([
        "M2_OPERATOR_PROJECTION_FORBIDDEN_KEY",
        "M2_OPERATOR_PAYLOAD_SCHEMA_INVALID",
      ]),
    );
    expect(JSON.stringify(rejected)).not.toContain("PRIVATE_HYPOTHESIS_SENTINEL");
    expect(JSON.stringify(projection.operatorPayload)).not.toContain(
      "PRIVATE_BASIS_SENTINEL",
    );
  });

  test("preserves structural Null and does not replace the selected candidate", () => {
    const result = buildSyntheticM2ArtifactCoreV0_1(
      syntheticInput("xyz", {
        candidateDeclarations: [declaration("synthetic:only")],
      }),
    );

    expect(result.status).toBe("STRUCTURAL_NULL");
    expect(result.selectedCandidate?.opaqueCandidateId).toBe("synthetic:only");
    expect(result.structural.kind).toBe("NULL");
    expect(result.blindPayload).toBeNull();
    expect(result.structuralFreeze.structuralNull).toBe(true);
    expect(result.reasonCodes).toContain("STRUCTURAL_NULL_PRESERVED");
  });

  test("rejects forbidden fields and target-bearing values without logging content", () => {
    expect(
      findForbiddenM2BlindPayloadContentV0_1({
        claimBoundary: ["targetWord=secret"],
      }),
    ).toEqual(["$.claimBoundary[0]"]);

    const result = buildSyntheticM2ArtifactCoreV0_1(
      syntheticInput("qai", {
        sourceUniverseId: "targetSenseId=secret",
      }),
    );
    expect(result.status).toBe("ELIGIBILITY_BLOCKED");
    expect(result.reasonCodes).toContain("BLIND_PAYLOAD_FORBIDDEN_VALUE");
    expect(JSON.stringify(result)).not.toContain("secret");
  });
});
