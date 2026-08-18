import {
  canonicalOperatorProfilesV0_1,
  getResolvedCanonicalOperatorProfilesV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";
import {
  evaluateCanonicalOperatorCanonLockAdmissionV0_1,
} from "@/shared/canonicalOperatorCanonLockAdmission.v0_1";

describe("DA canonical operator canon-lock transition v0.1", () => {
  const resolvedProfiles =
    getResolvedCanonicalOperatorProfilesV0_1();

  const da = resolvedProfiles.find(
    (resolved) => resolved.profile.operatorId === "DA",
  );

  const di = resolvedProfiles.find(
    (resolved) => resolved.profile.operatorId === "DI",
  );

  it("admits DA under the existing bounded authorization scope", () => {
    expect(da).toBeDefined();

    const admission =
      evaluateCanonicalOperatorCanonLockAdmissionV0_1(da!);

    expect(admission).toEqual({
      admissionVersion:
        "canonical-operator-canon-lock-admission.v0_1",
      operatorId: "DA",
      sourceId:
        "reviewed.external.gheg-da.damage.candidate.v0_1",
      admitted: true,
      admittedScope:
        "bounded_functional_lexical_projection",
      rollbackLifecycleStatus: "runtime_verified",
      reasons: [],
    });

    expect(da?.profile.canonLifecycleStatus).toBe(
      "canon_locked",
    );
  });

  it("preserves DI as an independently admitted canon-locked operator", () => {
    expect(di).toBeDefined();

    const admission =
      evaluateCanonicalOperatorCanonLockAdmissionV0_1(di!);

    expect(admission).toEqual({
      admissionVersion:
        "canonical-operator-canon-lock-admission.v0_1",
      operatorId: "DI",
      sourceId:
        "reviewed.external.di.knowledge.candidate.v0_1",
      admitted: true,
      admittedScope:
        "bounded_functional_lexical_projection",
      rollbackLifecycleStatus: "runtime_verified",
      reasons: [],
    });

    expect(di?.profile.canonLifecycleStatus).toBe(
      "canon_locked",
    );
  });

  it("preserves exact DA profile identity and proof coverage", () => {
    expect(da?.profile).toEqual(
      expect.objectContaining({
        operatorId: "DA",
        embryo: "DA",
        language: "sq",
        sourceId:
          "reviewed.external.gheg-da.damage.candidate.v0_1",
        boundedLexicalFunction:
          "split / divide functional motivation",
        reviewedEvidenceStatus: "reviewed_functional",
        canonLifecycleStatus: "canon_locked",
        authorizationScope:
          "bounded_functional_lexical_projection",
        positiveProofWords: ["da", "dam", "damage"],
        negativeControlWords: [
          "study",
          "xyz",
          "mode",
          "made",
          "dome",
          "di",
          "studim",
        ],
      }),
    );
  });

  it("preserves runtime prerequisites and bounded claims", () => {
    expect(da?.readiness.functionalReady).toBe(true);
    expect(da?.authorization.authorized).toBe(true);
    expect(da?.productionMember).toBe(true);
    expect(da?.runtimeProjection).not.toBeNull();

    expect(da?.runtimeProjection?.claimBoundary).toEqual({
      historicalOriginClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
  });

  it("preserves DA and DI canon locks while AT remains runtime_verified", () => {
    expect(
      canonicalOperatorProfilesV0_1
        .filter(
          (profile) =>
            profile.canonLifecycleStatus === "canon_locked",
        )
        .map((profile) => profile.operatorId),
    ).toEqual(["DA", "DI"]);

    expect(
      canonicalOperatorProfilesV0_1
        .filter(
          (profile) =>
            profile.canonLifecycleStatus ===
            "runtime_verified",
        )
        .map((profile) => profile.operatorId),
    ).toEqual(["AT"]);
  });
});
