import {
  canonicalOperatorProfilesV0_1,
  getCanonicalOperatorProfileV0_1,
  getResolvedCanonicalOperatorProfilesV0_1,
  resolveCanonicalOperatorProfileV0_1,
  type CanonicalOperatorProfileV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";
import {
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

const expectedProfileKeys = [
  "authorizationScope",
  "boundedLexicalFunction",
  "canonLifecycleStatus",
  "embryo",
  "language",
  "negativeControlWords",
  "operatorId",
  "positiveProofWords",
  "profileVersion",
  "reviewedEvidenceStatus",
  "sourceId",
].sort();

describe("canonical operator profile v0.1", () => {
  it("registers DA and DI as canon_locked", () => {
    expect(canonicalOperatorProfilesV0_1).toHaveLength(2);
    expect(canonicalOperatorProfilesV0_1.map((profile) => profile.operatorId)).toEqual([
      "DA",
      "DI",
    ]);

    const da = getCanonicalOperatorProfileV0_1("DA");
    const di = getCanonicalOperatorProfileV0_1("DI");

    expect(da?.canonLifecycleStatus).toBe("canon_locked");
    expect(di?.canonLifecycleStatus).toBe("canon_locked");

    for (const profile of canonicalOperatorProfilesV0_1) {
      expect(profile.profileVersion).toBe("canonical-operator-profile.v0_1");
      expect(profile.reviewedEvidenceStatus).toBe("reviewed_functional");
      expect(["runtime_verified", "canon_locked"]).toContain(
        profile.canonLifecycleStatus,
      );
      expect(profile.authorizationScope).toBe(
        "bounded_functional_lexical_projection",
      );
      expect(profile.positiveProofWords.length).toBeGreaterThan(0);
      expect(profile.negativeControlWords.length).toBeGreaterThan(0);
    }
  });

  it("keeps the profile metadata narrow and does not duplicate source truth", () => {
    for (const profile of canonicalOperatorProfilesV0_1) {
      expect(Object.keys(profile).sort()).toEqual(expectedProfileKeys);

      const record = profile as unknown as Record<string, unknown>;

      expect(record.externalCitations).toBeUndefined();
      expect(record.sourceStatus).toBeUndefined();
      expect(record.sourceKind).toBeUndefined();
      expect(record.isolatedStandaloneForm).toBeUndefined();
      expect(record.plainStandaloneGloss).toBeUndefined();
      expect(record.evidenceText).toBeUndefined();
      expect(record.claimBoundary).toBeUndefined();
      expect(record.authorized).toBeUndefined();
      expect(record.productionMember).toBeUndefined();
      expect(record.runtimeProjection).toBeUndefined();
    }
  });

  it("references exact existing source rows rather than creating duplicate rows", () => {
    for (const profile of canonicalOperatorProfilesV0_1) {
      const rows = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.filter(
        (row) => row.sourceId === profile.sourceId,
      );

      expect(rows).toHaveLength(1);
      expect(rows[0].embryo).toBe(profile.embryo);
      expect(rows[0].candidateLanguage).toBe(profile.language);
    }
  });

  it("derives readiness, authorization, membership and projection from existing owners", () => {
    const resolvedProfiles = getResolvedCanonicalOperatorProfilesV0_1();

    expect(resolvedProfiles).toHaveLength(2);

    for (const resolved of resolvedProfiles) {
      expect(resolved.sourceRow.sourceId).toBe(resolved.profile.sourceId);
      expect(resolved.sourceRow.embryo).toBe(resolved.profile.embryo);

      expect(resolved.readiness.sourceId).toBe(resolved.profile.sourceId);
      expect(resolved.readiness.functionalReady).toBe(true);
      expect(resolved.readiness.historicalOriginClaim).toBe("not_claimed");
      expect(resolved.readiness.userDecisionPosture).toBe("user_decides");

      expect(resolved.authorization.sourceId).toBe(resolved.profile.sourceId);
      expect(resolved.authorization.authorized).toBe(true);
      expect(resolved.authorization.authorizationScope).toBe(
        resolved.profile.authorizationScope,
      );
      expect(resolved.authorization.reasons).toEqual([]);

      expect(resolved.productionMember).toBe(true);
      expect(
        isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
          resolved.profile.sourceId,
        ),
      ).toBe(true);

      expect(resolved.runtimeProjection).not.toBeNull();
      expect(resolved.runtimeProjection?.sourceId).toBe(
        resolved.profile.sourceId,
      );
      expect(resolved.runtimeProjection?.embryo).toBe(
        resolved.profile.embryo,
      );
      expect(
        resolved.runtimeProjection?.claimBoundary.historicalOriginClaim,
      ).toBe("not_claimed");
      expect(
        resolved.runtimeProjection?.claimBoundary.winnerClaim,
      ).toBe("not_claimed");
      expect(
        resolved.runtimeProjection?.claimBoundary.languageSuperiorityClaim,
      ).toBe("not_claimed");
      expect(
        resolved.runtimeProjection?.claimBoundary.userDecisionPosture,
      ).toBe("user_decides");
    }
  });

  it("resolves DA and DI by normalized operator ID", () => {
    expect(getCanonicalOperatorProfileV0_1("da")?.operatorId).toBe("DA");
    expect(getCanonicalOperatorProfileV0_1(" DI ")?.operatorId).toBe("DI");
    expect(getCanonicalOperatorProfileV0_1("TER")).toBeNull();
  });

  it("fails closed when a profile references an unknown source row", () => {
    const unknownProfile: CanonicalOperatorProfileV0_1 = {
      profileVersion: "canonical-operator-profile.v0_1",
      operatorId: "UNKNOWN",
      embryo: "UNKNOWN",
      language: "unknown",
      sourceId: "reviewed.external.unknown.missing.v0_1",
      boundedLexicalFunction: "unknown",
      reviewedEvidenceStatus: "none",
      canonLifecycleStatus: "candidate",
      authorizationScope: "bounded_functional_lexical_projection",
      positiveProofWords: ["unknown"],
      negativeControlWords: ["xyz"],
    };

    expect(resolveCanonicalOperatorProfileV0_1(unknownProfile)).toBeNull();
  });

  it("keeps DA and DI proof cases explicit and cross-operator isolated", () => {
    const da = getCanonicalOperatorProfileV0_1("DA");
    const di = getCanonicalOperatorProfileV0_1("DI");

    expect(da?.positiveProofWords).toEqual(["da", "dam", "damage"]);
    expect(da?.negativeControlWords).toEqual([
      "study",
      "xyz",
      "mode",
      "made",
      "dome",
      "di",
      "studim",
    ]);

    expect(di?.positiveProofWords).toEqual([
      "di",
      "study",
      "studim",
    ]);
    expect(di?.negativeControlWords).toEqual([
      "da",
      "dam",
      "damage",
      "mode",
      "xyz",
      "dij",
      "dije",
      "dit",
    ]);
  });
});
