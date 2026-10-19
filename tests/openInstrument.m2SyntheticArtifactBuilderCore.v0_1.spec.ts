import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  selectFirstEligibleSyntheticM2CandidateV0_1,
} from "../src/shared/openInstrument/oneEmbryoProofM2Preregistration.v0_1";
import {
  buildSyntheticM2ArtifactCoreV0_1,
  findForbiddenM2BlindPayloadContentV0_1,
  validateM2SyntheticEligibilityPoolV0_1,
  type M2SyntheticCandidateEligibilityDeclarationV0_1,
  type M2SyntheticArtifactCoreInputV0_1,
} from "../src/shared/openInstrument/m2SyntheticArtifactBuilderCore.v0_1";

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
      "M2_STRUCTURAL_FREEZE_BLINDNESS_CONTRACT_CONFLICT",
    );
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
