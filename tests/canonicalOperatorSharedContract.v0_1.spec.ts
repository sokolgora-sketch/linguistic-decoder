import {
  canonicalOperatorProfilesV0_1,
  getResolvedCanonicalOperatorProfilesV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";
import {
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

const expectedClaimBoundary = {
  historicalOriginClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  userDecisionPosture: "user_decides",
} as const;

const operatorSpecificEvidenceMarkers = {
  DA: {
    required: [
      "Dedvukaj & Ndoci 2023 PLSA",
      "Example (4), page 3; footnote 1",
      "10.3765/plsa.v8i1.5501",
    ],
    forbidden: [
      "https://en.wiktionary.org/wiki/di#Albanian",
      "Albanian > Etymology 1 > Verb > di: to know",
    ],
  },
  DI: {
    required: [
      "Albanian > Etymology 1 > Verb > di: to know",
      "https://en.wiktionary.org/wiki/di#Albanian",
      "di = know / knowledge",
    ],
    forbidden: [
      "10.3765/plsa.v8i1.5501",
      "Dedvukaj & Ndoci 2023 PLSA",
    ],
  },
} as const;

describe("canonical operator shared contract v0.1", () => {
  const resolvedProfiles = getResolvedCanonicalOperatorProfilesV0_1();

  it("resolves every configured canonical profile exactly once", () => {
    expect(resolvedProfiles).toHaveLength(
      canonicalOperatorProfilesV0_1.length,
    );

    expect(
      resolvedProfiles.map((resolved) => resolved.profile.operatorId),
    ).toEqual(
      canonicalOperatorProfilesV0_1.map((profile) => profile.operatorId),
    );
  });

  it.each(canonicalOperatorProfilesV0_1)(
    "$operatorId references exactly one matching reviewed source row",
    (profile) => {
      const rows =
        reviewedExternalLexiconSourceRowCandidateRegistryV0_1.filter(
          (row) => row.sourceId === profile.sourceId,
        );

      expect(rows).toHaveLength(1);
      expect(rows[0].sourceId).toBe(profile.sourceId);
      expect(rows[0].embryo).toBe(profile.embryo);
      expect(rows[0].candidateLanguage).toBe(profile.language);
    },
  );

  it.each(resolvedProfiles)(
    "$profile.operatorId passes the shared readiness contract",
    ({ profile, sourceRow, readiness }) => {
      expect(readiness.sourceId).toBe(profile.sourceId);
      expect(readiness.candidateId).toBe(sourceRow.candidateId);
      expect(readiness.functionalReady).toBe(true);
      expect(readiness.items.length).toBeGreaterThan(0);
      expect(readiness.items.every((item) => item.passed)).toBe(true);
      expect(readiness.historicalOriginClaim).toBe("not_claimed");
      expect(readiness.userDecisionPosture).toBe("user_decides");
    },
  );

  it.each(resolvedProfiles)(
    "$profile.operatorId passes machine authorization and explicit production membership",
    ({ profile, authorization, productionMember }) => {
      expect(authorization.sourceId).toBe(profile.sourceId);
      expect(authorization.authorized).toBe(true);
      expect(authorization.authorizationScope).toBe(
        profile.authorizationScope,
      );
      expect(authorization.reasons).toEqual([]);
      expect(authorization.historicalOriginClaim).toBe("not_claimed");
      expect(authorization.userDecisionPosture).toBe("user_decides");

      expect(productionMember).toBe(true);
      expect(
        isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
          profile.sourceId,
        ),
      ).toBe(true);
    },
  );

  it.each(resolvedProfiles)(
    "$profile.operatorId emits a matching bounded runtime projection",
    ({ profile, sourceRow, runtimeProjection }) => {
      expect(runtimeProjection).not.toBeNull();
      expect(runtimeProjection?.projectionVersion).toBe(
        "reviewed-external-lexicon-runtime-projection.v0_1",
      );
      expect(runtimeProjection?.sourceId).toBe(profile.sourceId);
      expect(runtimeProjection?.candidateId).toBe(sourceRow.candidateId);
      expect(runtimeProjection?.embryo).toBe(profile.embryo);
      expect(runtimeProjection?.isolatedStandaloneForm).toBe(
        sourceRow.isolatedStandaloneForm,
      );
      expect(runtimeProjection?.claimBoundary).toEqual(
        expectedClaimBoundary,
      );
      expect(runtimeProjection?.evidenceText.length).toBeGreaterThan(0);
    },
  );

  it.each(resolvedProfiles)(
    "$profile.operatorId remains runtime_verified and not canon_locked",
    ({ profile }) => {
      expect(profile.reviewedEvidenceStatus).toBe(
        "reviewed_functional",
      );
      expect(profile.canonLifecycleStatus).toBe("runtime_verified");
      expect(profile.canonLifecycleStatus).not.toBe("canon_locked");
      expect(profile.authorizationScope).toBe(
        "bounded_functional_lexical_projection",
      );
    },
  );

  it.each(resolvedProfiles)(
    "$profile.operatorId keeps explicit positive and negative proof cases",
    ({ profile }) => {
      expect(profile.positiveProofWords.length).toBeGreaterThan(0);
      expect(profile.negativeControlWords.length).toBeGreaterThan(0);

      expect(new Set(profile.positiveProofWords).size).toBe(
        profile.positiveProofWords.length,
      );
      expect(new Set(profile.negativeControlWords).size).toBe(
        profile.negativeControlWords.length,
      );

      for (const word of profile.positiveProofWords) {
        expect(word.trim()).toBe(word);
        expect(word.length).toBeGreaterThan(0);
        expect(profile.negativeControlWords).not.toContain(word);
      }

      for (const word of profile.negativeControlWords) {
        expect(word.trim()).toBe(word);
        expect(word.length).toBeGreaterThan(0);
      }
    },
  );

  it.each(resolvedProfiles)(
    "$profile.operatorId runtime projection contains only its own citation identity",
    ({ profile, runtimeProjection }) => {
      const operatorId =
        profile.operatorId as keyof typeof operatorSpecificEvidenceMarkers;

      const markers = operatorSpecificEvidenceMarkers[operatorId];

      expect(markers).toBeDefined();

      const evidenceText = runtimeProjection?.evidenceText ?? "";

      for (const requiredMarker of markers.required) {
        expect(evidenceText).toContain(requiredMarker);
      }

      for (const forbiddenMarker of markers.forbidden) {
        expect(evidenceText).not.toContain(forbiddenMarker);
      }
    },
  );

  it("keeps DA and DI mutually isolated by proof-word metadata", () => {
    const da = canonicalOperatorProfilesV0_1.find(
      (profile) => profile.operatorId === "DA",
    );
    const di = canonicalOperatorProfilesV0_1.find(
      (profile) => profile.operatorId === "DI",
    );

    expect(da).toBeDefined();
    expect(di).toBeDefined();

    expect(da?.negativeControlWords).toContain("study");

    for (const word of di?.positiveProofWords ?? []) {
      expect(da?.negativeControlWords).toContain(word);
    }

    for (const word of da?.positiveProofWords ?? []) {
      expect(di?.negativeControlWords).toContain(word);
    }
  });
});
