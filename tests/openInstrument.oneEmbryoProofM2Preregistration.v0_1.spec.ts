import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  M2_REQUIRED_PRE_REVEAL_ARTIFACTS_V0_1,
  M2_REQUIRED_VALID_PROOF_ARTIFACTS_V0_1,
  ONE_EMBRYO_PROOF_M2_CONTRACT_ID_V0_1,
  ONE_EMBRYO_PROOF_M2_SCHEMA_V0_1,
  canonicalSerializeOneEmbryoProofM2V0_1,
  evaluateOneEmbryoM2ProofValidityV0_1,
  evaluateOneEmbryoM2RevealGateV0_1,
  findForbiddenM2BlindPayloadKeysV0_1,
  selectFirstEligibleSyntheticM2CandidateV0_1,
  sha256OneEmbryoProofM2V0_1,
  type M2ArtifactRecordV0_1,
  type M2RevealGateInputV0_1,
} from "../src/shared/openInstrument/oneEmbryoProofM2Preregistration.v0_1";

const root = process.cwd();
const artifactPath = resolve(
  root,
  "docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/preregistration.json",
);
const manifestPath = resolve(
  root,
  "docs/open-instrument/research-artifacts/m2-one-embryo-proof-v1/hash-manifest.json",
);

const hash = "a".repeat(64);

function syntheticArtifact(
  artifactId: M2ArtifactRecordV0_1["artifactId"],
): M2ArtifactRecordV0_1 {
  return {
    artifactId,
    present: true,
    expectedSha256: hash,
    observedSha256: hash,
    expectedByteLength: 10,
    observedByteLength: 10,
    createdBeforeReveal: true,
    immutableAfterFreeze: true,
  };
}

function gateInput(
  artifacts: readonly M2ArtifactRecordV0_1[],
): M2RevealGateInputV0_1 {
  return {
    artifacts,
    hashChainVerified: true,
    searchStateComplete: true,
    preRevealDecisionFrozen: true,
    blindnessViolation: false,
    manualRevealAuthorization: true,
  };
}

describe("Open Instrument one-embryo proof v1 M2 preregistration", () => {
  test("freezes a target-free machine-readable contract and manifest", () => {
    const artifactBytes = readFileSync(artifactPath);
    const artifact = JSON.parse(artifactBytes.toString("utf8"));
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

    expect(artifact.schemaVersion).toBe(ONE_EMBRYO_PROOF_M2_SCHEMA_V0_1);
    expect(artifact.contractId).toBe(ONE_EMBRYO_PROOF_M2_CONTRACT_ID_V0_1);
    expect(artifact.status).toBe("FROZEN_PREREGISTRATION_CONTRACT_ONLY");
    expect(artifact.realTargetSelected).toBe(false);
    expect(artifact.realEmbryoSelected).toBe(false);
    expect(artifact.realDiscoveryExecuted).toBe(false);
    expect(artifact.targetRevealed).toBe(false);
    expect(artifact.requiredPreRevealArtifacts.map((item: { artifactId: string }) => item.artifactId)).toEqual(
      [...M2_REQUIRED_PRE_REVEAL_ARTIFACTS_V0_1],
    );
    expect(artifact.requiredValidProofArtifacts).toEqual(
      [...M2_REQUIRED_VALID_PROOF_ARTIFACTS_V0_1],
    );
    const machineText = JSON.stringify(artifact);
    expect(machineText).not.toMatch(/support/i);
    expect(machineText).not.toMatch(/"targetWord"\s*:/i);
    expect(machineText).not.toMatch(/"targetSenseDefinition"\s*:/i);
    expect(manifest.contractSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(manifest.machineReadableSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(manifest.machineReadableByteLength).toBe(artifactBytes.byteLength);
    expect(sha256OneEmbryoProofM2V0_1(artifactBytes)).toBe(manifest.machineReadableSha256);
  });

  test("selects only the first eligible opaque synthetic candidate", () => {
    const selected = selectFirstEligibleSyntheticM2CandidateV0_1([
      { opaqueCandidateId: "case-z", eligibility: "ELIGIBLE", previouslyUsed: false, previouslyRevealed: false, identityAmbiguous: false },
      { opaqueCandidateId: "case-a", eligibility: "ELIGIBLE", previouslyUsed: false, previouslyRevealed: false, identityAmbiguous: false },
      { opaqueCandidateId: "case-0-used", eligibility: "ELIGIBLE", previouslyUsed: true, previouslyRevealed: false, identityAmbiguous: false },
    ]);
    expect(selected?.opaqueCandidateId).toBe("case-a");
  });

  test("keeps blind payload serialization deterministic and semantic-field free", () => {
    const payload = {
      stopRuleId: "m2-stop-v0_1",
      schemaVersion: ONE_EMBRYO_PROOF_M2_SCHEMA_V0_1,
      caseOpaqueId: "opaque-case-synthetic",
      structuralEmbryo: "AB",
      structuralFingerprint: hash,
      voicePath: ["A"],
      sourceUniverseId: "m2-source-universe-v0_1",
      searchPolicyId: "m2-search-policy-v0_1",
      claimBoundary: ["research_only", "no_single_winner", "user_decides"],
      targetRevealStatus: "FORBIDDEN_UNTIL_REVEAL_GATE",
    };
    const reordered = { ...payload };
    expect(canonicalSerializeOneEmbryoProofM2V0_1(payload)).toBe(
      canonicalSerializeOneEmbryoProofM2V0_1(reordered),
    );
    expect(findForbiddenM2BlindPayloadKeysV0_1(payload)).toEqual([]);
    expect(
      findForbiddenM2BlindPayloadKeysV0_1({ ...payload, targetSenseId: "hidden" }),
    ).toEqual(["$.targetSenseId"]);
  });

  test("blocks reveal when any required pre-reveal artifact is missing", () => {
    const artifacts = M2_REQUIRED_PRE_REVEAL_ARTIFACTS_V0_1
      .filter((artifactId) => artifactId !== "M3_PRE_REVEAL_FUNCTION_OR_NULL")
      .map(syntheticArtifact);
    const result = evaluateOneEmbryoM2RevealGateV0_1(gateInput(artifacts));
    expect(result.allowed).toBe(false);
    expect(result.reasonCodes).toContain("REQUIRED_ARTIFACT_MISSING");
  });

  test("blocks reveal when an artifact hash is unverifiable or mismatched", () => {
    const artifacts = M2_REQUIRED_PRE_REVEAL_ARTIFACTS_V0_1.map(syntheticArtifact);
    const mismatched = artifacts.map((artifact) =>
      artifact.artifactId === "M2_BLIND_PAYLOAD"
        ? { ...artifact, observedSha256: "b".repeat(64) }
        : artifact,
    );
    const result = evaluateOneEmbryoM2RevealGateV0_1(gateInput(mismatched));
    expect(result.allowed).toBe(false);
    expect(result.reasonCodes).toContain("ARTIFACT_HASH_MISMATCH");
  });

  test("prevents the M6 durability gap from producing a valid proof", () => {
    const preRevealArtifacts = M2_REQUIRED_PRE_REVEAL_ARTIFACTS_V0_1.map(syntheticArtifact);
    const revealGate = gateInput(preRevealArtifacts);
    const missingM5 = evaluateOneEmbryoM2ProofValidityV0_1({
      revealGate,
      postRevealArtifact: null,
      targetRevealPerformed: true,
      postRevealEvaluationComplete: true,
    });
    expect(missingM5.valid).toBe(false);
    expect(missingM5.reasonCodes).toContain("POST_REVEAL_RESULT_MISSING");

    const complete = evaluateOneEmbryoM2ProofValidityV0_1({
      revealGate,
      postRevealArtifact: syntheticArtifact("M5_POST_REVEAL_CORRESPONDENCE_RESULT"),
      targetRevealPerformed: true,
      postRevealEvaluationComplete: true,
    });
    expect(complete.valid).toBe(true);
  });
});
