import rawManifest from "@/data/openInstrument/researchHypotheses/ze15-wordnet-role-candidate.v0_1.json";
import {
  parseResearchHypothesisManifestV0_1,
  projectResearchHypothesisManifestToCandidateEvidenceV0_1,
} from "@/shared/openInstrument/researchHypothesisManifest.v0_1";

function parsedManifest() {
  const result = parseResearchHypothesisManifestV0_1(rawManifest);
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.reasonCodes.join(", "));
  return result.manifest;
}

function cloneManifest() {
  return JSON.parse(JSON.stringify(rawManifest)) as Record<string, unknown>;
}

describe("Open Instrument ZE-15 research hypothesis manifest v0.1", () => {
  it("parses the bounded pelar and thëngjilltar assertions", () => {
    const manifest = parsedManifest();

    expect(manifest.assertions).toHaveLength(2);
    expect(manifest.evidence).toHaveLength(4);
    expect(manifest.assertions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          hypothesisId: "ze15.pelar.occupational-role.v0_1",
          sourceRecordId: "en-pelar-sq-noun-RnBYACSN",
          senseId: "en-pelar-sq-noun-RnBYACSN",
          targetLemma: "pelar",
          baseLemma: "pelë",
          proposedSemanticRole: "OCCUPATIONAL_ROLE",
          hypothesisStatus: "PROPOSED_NOT_REVIEWED",
          evidenceAuthority: "RESEARCHER_PROPOSED",
        }),
        expect.objectContaining({
          hypothesisId: "ze15.thengjilltar.occupational-role.v0_1",
          sourceRecordId: "en-thëngjilltar-sq-noun-AMp0~85e",
          senseId: "en-thëngjilltar-sq-noun-AMp0~85e",
          targetLemma: "thëngjilltar",
          baseLemma: "thëngjill",
          proposedSemanticRole: "OCCUPATIONAL_ROLE",
          hypothesisStatus: "PROPOSED_NOT_REVIEWED",
          reasonCodes: expect.arrayContaining([
            "OEWN_EXACT_GLOSS_UNAVAILABLE_AND_TYPED_EQUIVALENCE_UNPROVEN",
          ]),
        }),
      ]),
    );
  });

  it("projects explicit research candidate evidence without AGENT authorization", () => {
    const projected = projectResearchHypothesisManifestToCandidateEvidenceV0_1(
      parsedManifest(),
    );

    expect(projected).toHaveLength(2);
    expect(projected.map((item) => item.targetLemma)).toEqual([
      "pelar",
      "thëngjilltar",
    ]);

    for (const candidate of projected) {
      expect(candidate.sourceKind).toBe("research_hypothesis_manifest");
      expect(candidate.sourceStatus).toBe("research_candidate");
      expect(candidate.admissionScope).toBe("research_hypothesis_only");
      expect(candidate.evidenceAuthority).toBe("RESEARCHER_PROPOSED");
      expect(candidate.hypothesisStatus).toBe("PROPOSED_NOT_REVIEWED");
      expect(candidate.productionAuthorization).toBe("NOT_AUTHORIZED");
      expect(candidate.functionalOperation).toBeNull();
      expect(candidate.embryoFunction).toBe("UNKNOWN_OR_NULL");
      expect(candidate.userDecisionPosture).toBe("user_decides");
      expect(candidate.noSingleWinner).toBe(true);
      expect(candidate.evidenceRefs.length).toBeGreaterThan(0);
    }
  });

  it("preserves status distinctions without treating REVIEWED as production authorization", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = { ...assertions[0], hypothesisStatus: "REVIEWED" };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCodes.join(", "));

    const projected = projectResearchHypothesisManifestToCandidateEvidenceV0_1(
      result.manifest,
    );
    expect(projected[0]).toMatchObject({
      hypothesisStatus: "REVIEWED",
      productionAuthorization: "NOT_AUTHORIZED",
      functionalOperation: null,
    });
  });

  it("fails closed for a source-artifact mismatch", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = {
      ...assertions[0],
      sourceArtifactSha256: "0".repeat(64),
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected source identity rejection");
    expect(result.reasonCodes).toContain("ASSERTION_0_SOURCE_IDENTITY_MISMATCH");
  });

  it("fails closed for missing sense identity", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = { ...assertions[0], senseId: "" };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected malformed manifest rejection");
    expect(result.reasonCodes).toContain("ASSERTION_0_SENSE_REQUIRED");
  });

  it("fails closed for missing evidence references", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = { ...assertions[0], evidenceRefs: ["missing-evidence"] };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected missing evidence rejection");
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_EVIDENCE_REF_MISSING:missing-evidence",
    );
  });

  it("fails closed for duplicate hypothesis IDs", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[1] = { ...assertions[0] };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected duplicate rejection");
    expect(result.reasonCodes).toContain("DUPLICATE_HYPOTHESIS_ID");
  });

  it("fails closed for an unsupported semantic role", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = {
      ...assertions[0],
      proposedSemanticRole: "AGENT",
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected role rejection");
    expect(result.reasonCodes).toContain("ASSERTION_0_ROLE_INVALID");
  });

  it("fails closed for an unsupported production status", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = {
      ...assertions[0],
      hypothesisStatus: "PRODUCTION_AUTHORIZED",
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected unsupported status rejection");
    expect(result.reasonCodes).toContain("ASSERTION_0_STATUS_INVALID");
  });

  it("keeps conflicting researcher assertions as separate no-single-winner evidence", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions.push({
      ...assertions[0],
      hypothesisId: "ze15.pelar.alternative-role.v0_1",
      proposedSemanticRole: "OCCUPATIONAL_ROLE",
      reasonCodes: ["ALTERNATIVE_RESEARCHER_ASSERTION"],
    });

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCodes.join(", "));
    const projected = projectResearchHypothesisManifestToCandidateEvidenceV0_1(
      result.manifest,
    );
    expect(projected).toHaveLength(3);
    expect(new Set(projected.map((item) => item.candidateId)).size).toBe(3);
    expect(projected.every((item) => item.noSingleWinner)).toBe(true);
  });
});
