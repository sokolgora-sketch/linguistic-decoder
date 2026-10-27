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

function reviewCandidate(
  track: "AI_REVIEW" | "HUMAN_REVIEW" = "AI_REVIEW",
) {
  const reviewers =
    track === "AI_REVIEW"
      ? [
          { id: "ChatGPT", ref: "audit/ze15/pelar/chatgpt" },
          { id: "DeepSeek", ref: "audit/ze15/pelar/deepseek" },
        ]
      : [
          { id: "HUMAN_REVIEWER_A", ref: "audit/ze15/pelar/human-a" },
          { id: "HUMAN_REVIEWER_B", ref: "audit/ze15/pelar/human-b" },
        ];

  return {
    status: "PRE_APPROVAL_CANDIDATE_RATIONALE",
    reviewTrack: track,
    reviewerRecords: reviewers.map(({ id, ref }) => ({
      reviewerId: id,
      reviewerKind: track === "AI_REVIEW" ? "AI" : "HUMAN",
      rationale: `${id} bounded rationale for the synthetic fixture`,
      evidenceRefs: [
        "ze15.albanian.pelar.source.v0_1",
        "ze15.oewn.pelar.occupational-path.v0_1",
      ],
      recordedAt: "2026-10-28T00:00:00Z",
      recordedBeforePeerExposure: true,
      provenance: { sourceKind: "AUDIT_TRAIL", sourceRef: ref },
    })),
  };
}

function ownerApproval() {
  return {
    status: "APPROVED",
    ownerId: "PROJECT_OWNER",
    approvedAt: "2026-10-28T01:00:00Z",
    approvalRef: "owner-decision:ze15:pelar:synthetic",
  };
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
          reviewTrack: "NONE",
          reviewCandidate: null,
          ownerApproval: null,
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
          reviewTrack: "NONE",
          reviewCandidate: null,
          ownerApproval: null,
        }),
      ]),
    );
  });

  it("accepts legacy manifests that predate governance fields", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    for (const assertion of assertions) {
      delete assertion.reviewTrack;
      delete assertion.reviewCandidate;
      delete assertion.ownerApproval;
    }

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCodes.join(", "));
    expect(result.manifest.assertions.every((item) => item.reviewTrack === "NONE")).toBe(
      true,
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
      expect(candidate.historicalRelation).toBe("NOT_CLAIMED");
      expect(candidate.winnerClaim).toBe("NOT_CLAIMED");
      expect(candidate.reviewTrack).toBe("NONE");
      expect(candidate.reviewCandidate).toBeNull();
      expect(candidate.ownerApproval).toBeNull();
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

  it.each([
    "AI_REVIEW",
    "HUMAN_REVIEW",
    "NONE",
  ] as const)("normalizes reviewTrack %s", (reviewTrack) => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = { ...assertions[0], reviewTrack };

    if (reviewTrack !== "NONE") {
      assertions[0].reviewCandidate = reviewCandidate(reviewTrack);
      assertions[0].reviewTrack = "NONE";
    }

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCodes.join(", "));
    expect(result.manifest.assertions[0].reviewTrack).toBe("NONE");
    if (reviewTrack === "NONE") {
      expect(result.manifest.assertions[0].reviewCandidate).toBeNull();
    } else {
      expect(result.manifest.assertions[0].reviewCandidate).toEqual(
        expect.any(Object),
      );
    }
  });

  it.each([
    "REVIEWED_ALIGNED_AI_OWNER_APPROVED",
    "REVIEWED_ALIGNED_HUMAN_OWNER_APPROVED",
  ] as const)("accepts terminal reviewed status %s only with its full envelope", (status) => {
    const track =
      status === "REVIEWED_ALIGNED_AI_OWNER_APPROVED"
        ? "AI_REVIEW"
        : "HUMAN_REVIEW";
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = {
      ...assertions[0],
      hypothesisStatus: status,
      reviewTrack: track,
      reviewCandidate: reviewCandidate(track),
      ownerApproval: ownerApproval(),
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCodes.join(", "));

    const projected = projectResearchHypothesisManifestToCandidateEvidenceV0_1(
      result.manifest,
    )[0];
    expect(projected).toMatchObject({
      hypothesisStatus: status,
      reviewTrack: track,
      productionAuthorization: "NOT_AUTHORIZED",
      functionalOperation: null,
      embryoFunction: "UNKNOWN_OR_NULL",
      historicalRelation: "NOT_CLAIMED",
      winnerClaim: "NOT_CLAIMED",
      noSingleWinner: true,
    });
  });

  it("rejects a missing reviewer identity", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    const candidate = reviewCandidate();
    (candidate.reviewerRecords[0] as Record<string, unknown>).reviewerId = "";
    assertions[0] = {
      ...assertions[0],
      reviewCandidate: candidate,
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected reviewer identity rejection");
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_REVIEWER_0_ID_REQUIRED",
    );
  });

  it("rejects duplicate reviewer identities and provenance", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    const candidate = reviewCandidate();
    candidate.reviewerRecords[1] = { ...candidate.reviewerRecords[0] };
    assertions[0] = { ...assertions[0], reviewCandidate: candidate };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected duplicate reviewer rejection");
    expect(result.reasonCodes).toContain("ASSERTION_0_REVIEWER_IDS_NOT_DISTINCT");
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_REVIEWER_PROVENANCE_NOT_DISTINCT",
    );
  });

  it("rejects missing rationale and missing owner approval", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    const candidate = reviewCandidate();
    (candidate.reviewerRecords[0] as Record<string, unknown>).rationale = "";
    assertions[0] = {
      ...assertions[0],
      hypothesisStatus: "REVIEWED_ALIGNED_AI_OWNER_APPROVED",
      reviewTrack: "AI_REVIEW",
      reviewCandidate: candidate,
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected incomplete review rejection");
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_REVIEWER_0_RATIONALE_REQUIRED",
    );
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_TERMINAL_OWNER_APPROVAL_REQUIRED",
    );
  });

  it("rejects a wrong review-track/status combination", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = {
      ...assertions[0],
      hypothesisStatus: "REVIEWED_ALIGNED_AI_OWNER_APPROVED",
      reviewTrack: "HUMAN_REVIEW",
      reviewCandidate: reviewCandidate("HUMAN_REVIEW"),
      ownerApproval: ownerApproval(),
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected track mismatch rejection");
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_TERMINAL_REVIEW_TRACK_MISMATCH",
    );
  });

  it("rejects rationale references that are not exact manifest evidence references", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    const candidate = reviewCandidate();
    (candidate.reviewerRecords[0] as Record<string, unknown>).evidenceRefs = [
      "invented-evidence",
    ];
    assertions[0] = { ...assertions[0], reviewCandidate: candidate };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected evidence reference rejection");
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_REVIEWER_0_EVIDENCE_REF_MISSING:invented-evidence",
    );
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_REVIEWER_0_EVIDENCE_REF_NOT_BOUND:invented-evidence",
    );
  });

  it("keeps a valid pre-approval candidate non-authoritative", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = { ...assertions[0], reviewCandidate: reviewCandidate() };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCodes.join(", "));
    const projected = projectResearchHypothesisManifestToCandidateEvidenceV0_1(
      result.manifest,
    )[0];
    expect(projected).toMatchObject({
      hypothesisStatus: "PROPOSED_NOT_REVIEWED",
      reviewTrack: "NONE",
      productionAuthorization: "NOT_AUTHORIZED",
      functionalOperation: null,
      embryoFunction: "UNKNOWN_OR_NULL",
      noSingleWinner: true,
    });
    expect(projected.reviewCandidate?.status).toBe(
      "PRE_APPROVAL_CANDIDATE_RATIONALE",
    );
  });

  it("fails closed for a malformed candidate envelope", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = {
      ...assertions[0],
      reviewCandidate: { status: "PRE_APPROVAL_CANDIDATE_RATIONALE" },
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected candidate envelope rejection");
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_REVIEW_CANDIDATE_TRACK_INVALID",
    );
    expect(result.reasonCodes).toContain(
      "ASSERTION_0_REVIEW_CANDIDATE_REVIEWERS_INVALID",
    );
  });

  it("keeps disagreement unresolved and does not select a winner", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    const candidate = reviewCandidate();
    (candidate.reviewerRecords[1] as Record<string, unknown>).rationale =
      "Disagrees: the available evidence does not establish alignment.";
    assertions[0] = {
      ...assertions[0],
      hypothesisStatus: "UNRESOLVED",
      reviewCandidate: candidate,
      reasonCodes: ["REVIEWER_DISAGREEMENT_RETAINED_UNRESOLVED"],
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(true);
    if (!result.ok) throw new Error(result.reasonCodes.join(", "));
    const projected = projectResearchHypothesisManifestToCandidateEvidenceV0_1(
      result.manifest,
    )[0];
    expect(projected).toMatchObject({
      hypothesisStatus: "UNRESOLVED",
      functionalOperation: null,
      winnerClaim: "NOT_CLAIMED",
      noSingleWinner: true,
    });
  });

  it("fails closed when an unresolved disagreement is marked terminal", () => {
    const value = cloneManifest();
    const assertions = value.assertions as Array<Record<string, unknown>>;
    assertions[0] = {
      ...assertions[0],
      hypothesisStatus: "REVIEWED_ALIGNED_AI_OWNER_APPROVED",
      reviewTrack: "AI_REVIEW",
      reviewCandidate: reviewCandidate(),
      ownerApproval: ownerApproval(),
      reasonCodes: ["REVIEWER_DISAGREEMENT_RETAINED_UNRESOLVED"],
    };

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected terminal disagreement rejection");
    expect(result.reasonCodes).toContain("ASSERTION_0_TERMINAL_REVIEW_DISAGREEMENT");
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

  it("fails closed when source-attested evidence omits sense identity", () => {
    const value = cloneManifest();
    const evidence = value.evidence as Array<Record<string, unknown>>;
    const pelarSourceEvidence = evidence.find(
      (item) => item.sourceRecordId === "en-pelar-sq-noun-RnBYACSN",
    );
    if (!pelarSourceEvidence) {
      throw new Error("expected pelar source evidence");
    }
    delete pelarSourceEvidence.senseId;

    const result = parseResearchHypothesisManifestV0_1(value);
    expect(result.ok).toBe(false);
    if (result.ok) throw new Error("expected missing sense identity rejection");
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

  it("preserves multiple researcher assertions without selecting a single winner", () => {
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
