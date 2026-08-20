import { readFileSync } from "node:fs";

import {
  canonicalOperatorProfilesV0_1,
  getResolvedCanonicalOperatorProfilesV0_1,
  isCanonicalOperatorProfileDiscoveryTargetV0_1,
  isCanonicalOperatorProfileStructuralCarrierAllowedV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

import {
  evaluateCanonicalOperatorCanonLockAdmissionV0_1,
} from "@/shared/canonicalOperatorCanonLockAdmission.v0_1";

import {
  discoverCanonicalOperatorCandidatesV0_1,
} from "@/shared/canonicalOperatorDiscovery.v0_1";

describe("AT canonical operator canon-lock transition v0.1", () => {
  const transition = readFileSync(
    "docs/open-instrument/at-canon-lock-lifecycle-transition-v0.1.md",
    "utf8",
  );

  const review = readFileSync(
    "docs/open-instrument/reports/at-canon-lock-transition-review-v0.1.md",
    "utf8",
  );

  const historicalAdmission = readFileSync(
    "docs/open-instrument/reports/third-operator-at-authoritative-source-admission-v0.1.md",
    "utf8",
  );

  const resolvedProfiles =
    getResolvedCanonicalOperatorProfilesV0_1();

  const at = resolvedProfiles.find(
    (resolved) =>
      resolved.profile.operatorId === "AT",
  );

  it("admits AT under bounded functional lexical projection", () => {
    expect(at).toBeDefined();

    expect(
      evaluateCanonicalOperatorCanonLockAdmissionV0_1(at!),
    ).toEqual({
      admissionVersion:
        "canonical-operator-canon-lock-admission.v0_1",
      operatorId: "AT",
      sourceId:
        "reviewed.external.albanian-at.father.candidate.v0_1",
      admitted: true,
      admittedScope:
        "bounded_functional_lexical_projection",
      rollbackLifecycleStatus:
        "runtime_verified",
      reasons: [],
    });

    expect(
      at?.profile.canonLifecycleStatus,
    ).toBe("canon_locked");

    expect(
      at?.profile.discoveryScope,
    ).toBe("bounded_targets");
  });

  it("preserves exact AT identity and proof sets", () => {
    expect(at?.profile).toEqual(
      expect.objectContaining({
        operatorId: "AT",
        embryo: "AT",
        language: "sq",
        sourceId:
          "reviewed.external.albanian-at.father.candidate.v0_1",
        boundedLexicalFunction:
          "father functional motivation",
        reviewedEvidenceStatus:
          "reviewed_functional",
        canonLifecycleStatus:
          "canon_locked",
        authorizationScope:
          "bounded_functional_lexical_projection",
        discoveryScope:
          "bounded_targets",
        positiveProofWords: [
          "father",
        ],
        negativeControlWords: [
          "at",
          "damage",
          "study",
          "mode",
          "xyz",
          "da",
          "di",
          "studim",
        ],
      }),
    );
  });

  it("preserves runtime prerequisites and bounded claims", () => {
    expect(at?.readiness.functionalReady).toBe(true);
    expect(at?.authorization.authorized).toBe(true);
    expect(at?.productionMember).toBe(true);
    expect(at?.runtimeProjection).not.toBeNull();

    expect(
      at?.runtimeProjection?.claimBoundary,
    ).toEqual({
      historicalOriginClaim:
        "not_claimed",
      winnerClaim:
        "not_claimed",
      languageSuperiorityClaim:
        "not_claimed",
      userDecisionPosture:
        "user_decides",
    });
  });

  it("keeps father reviewed while bare at remains unreviewed", () => {
    const father =
      discoverCanonicalOperatorCandidatesV0_1(
        "father",
      ).filter(
        (candidate) =>
          candidate.operatorId === "AT",
      );

    expect(father).toContainEqual(
      expect.objectContaining({
        operatorId: "AT",
        carrierForm: "at",
        operations: ["exact"],
        functionalBridgeStatus:
          "reviewed",
        reviewedEvidenceEligible:
          true,
      }),
    );

    const bareAt =
      discoverCanonicalOperatorCandidatesV0_1(
        "at",
      ).filter(
        (candidate) =>
          candidate.operatorId === "AT",
      );

    expect(bareAt).toContainEqual(
      expect.objectContaining({
        operatorId: "AT",
        carrierForm: "at",
        functionalBridgeStatus:
          "unreviewed",
        reviewedEvidenceEligible:
          false,
      }),
    );
  });

  it("keeps unrelated isolated AT discovery blocked after canon lock", () => {
    for (const word of [
      "diet",
      "data",
      "random",
      "later",
      "water",
    ]) {
      expect(
        isCanonicalOperatorProfileDiscoveryTargetV0_1(
          at!.profile,
          word,
        ),
      ).toBe(false);

      expect(
        isCanonicalOperatorProfileStructuralCarrierAllowedV0_1(
          at!.profile,
          word,
          "at",
        ),
      ).toBe(false);

      expect(
        discoverCanonicalOperatorCandidatesV0_1(
          word,
        ).filter(
          (candidate) =>
            candidate.operatorId === "AT",
        ),
      ).toEqual([]);
    }
  });

  it("preserves legacy AT structural carriers", () => {
    for (const carrier of [
      "atë",
      "ati",
      "pater",
    ]) {
      expect(
        isCanonicalOperatorProfileStructuralCarrierAllowedV0_1(
          at!.profile,
          carrier,
          carrier,
        ),
      ).toBe(true);
    }
  });

  it("locks all three operators while preserving independent discovery scopes", () => {
    expect(
      canonicalOperatorProfilesV0_1.map(
        (profile) => [
          profile.operatorId,
          profile.canonLifecycleStatus,
          profile.discoveryScope,
        ],
      ),
    ).toEqual([
      [
        "DA",
        "canon_locked",
        "broad_structural",
      ],
      [
        "DI",
        "canon_locked",
        "broad_structural",
      ],
      [
        "AT",
        "canon_locked",
        "bounded_targets",
      ],
    ]);
  });

  it("records readiness, rollback, historical and claim boundaries", () => {
    for (const marker of [
      "READY_FOR_DEDICATED_TRANSITION",
      "operator_not_explicitly_admitted",
      "PR #1799",
      "`bounded_targets`",
      "7 suites passed",
      "64 tests passed",
      "governance-only rollback target",
      "`runtime_verified`",
    ]) {
      expect(
        review + transition,
      ).toContain(marker);
    }

    expect(
      historicalAdmission,
    ).toContain(
      "AT does **not** enter `canon_locked` in this repair.",
    );

    expect(
      historicalAdmission,
    ).toContain(
      "A separate explicit canon-lock transition would be required before AT could",
    );

    for (const marker of [
      "historical origin",
      "historical transmission",
      "borrowing direction",
      "linguistic ownership",
      "candidate truth",
      "winner status",
      "language superiority",
      "`user_decides`",
    ]) {
      expect(transition).toContain(marker);
    }
  });
});
