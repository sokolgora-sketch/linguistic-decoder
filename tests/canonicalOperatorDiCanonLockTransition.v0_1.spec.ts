import { readFileSync } from "node:fs";

import {
  canonicalOperatorProfilesV0_1,
  getResolvedCanonicalOperatorProfilesV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

import {
  evaluateCanonicalOperatorCanonLockAdmissionV0_1,
} from "@/shared/canonicalOperatorCanonLockAdmission.v0_1";

import {
  evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1,
  getReviewedExternalLexiconEvidenceOperationPolicyV0_1,
} from "@/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1";

describe("DI canonical operator canon-lock transition v0.1", () => {
  const transition = readFileSync(
    "docs/open-instrument/di-canon-lock-lifecycle-transition-v0.1.md",
    "utf8",
  );

  const review = readFileSync(
    "docs/open-instrument/reports/di-canon-lock-transition-review-v0.1.md",
    "utf8",
  );

  const resolvedProfiles =
    getResolvedCanonicalOperatorProfilesV0_1();

  const da = resolvedProfiles.find(
    (resolved) => resolved.profile.operatorId === "DA",
  );

  const di = resolvedProfiles.find(
    (resolved) => resolved.profile.operatorId === "DI",
  );

  it("admits DI under bounded functional lexical projection", () => {
    expect(di).toBeDefined();

    expect(
      evaluateCanonicalOperatorCanonLockAdmissionV0_1(di!),
    ).toEqual({
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

  it("preserves the exact DI profile identity and proof sets", () => {
    expect(di?.profile).toEqual(
      expect.objectContaining({
        operatorId: "DI",
        embryo: "DI",
        language: "sq",
        sourceId:
          "reviewed.external.di.knowledge.candidate.v0_1",
        boundedLexicalFunction:
          "know / knowledge functional motivation",
        reviewedEvidenceStatus: "reviewed_functional",
        canonLifecycleStatus: "canon_locked",
        authorizationScope:
          "bounded_functional_lexical_projection",
        positiveProofWords: ["di", "study", "studim"],
        negativeControlWords: [
          "da",
          "dam",
          "damage",
          "mode",
          "xyz",
          "dij",
          "dije",
          "dit",
        ],
      }),
    );
  });

  it("preserves runtime prerequisites and bounded claims", () => {
    expect(di?.readiness.functionalReady).toBe(true);
    expect(di?.authorization.authorized).toBe(true);
    expect(di?.productionMember).toBe(true);
    expect(di?.runtimeProjection).not.toBeNull();

    expect(di?.runtimeProjection?.claimBoundary).toEqual({
      historicalOriginClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
  });

  it("preserves reviewed DI operation and carrier scope", () => {
    expect(
      getReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        "reviewed.external.di.knowledge.candidate.v0_1",
      ),
    ).toMatchObject({
      sourceId:
        "reviewed.external.di.knowledge.candidate.v0_1",
      embryo: "DI",
      allowedEvidenceOps: ["exact", "y_to_i"],
      allowedEvidenceCarrierForms: ["di"],
    });

    for (const params of [
      {
        ops: ["exact"],
        segment: "di",
        carrierForm: "di",
      },
      {
        ops: ["y_to_i"],
        segment: "dy",
        carrierForm: "di",
      },
    ]) {
      expect(
        evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1({
          sourceId:
            "reviewed.external.di.knowledge.candidate.v0_1",
          embryo: "DI",
          ...params,
        }),
      ).toMatchObject({
        allowed: true,
        effectiveCarrierForm: "di",
        reasons: [],
      });
    }

    for (const carrierForm of ["dij", "dije", "dit"]) {
      expect(
        evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1({
          sourceId:
            "reviewed.external.di.knowledge.candidate.v0_1",
          embryo: "DI",
          ops: ["exact"],
          segment: carrierForm,
          carrierForm,
        }),
      ).toMatchObject({
        allowed: false,
        effectiveCarrierForm: carrierForm,
        reasons: ["carrier_form_not_allowed"],
      });
    }
  });

  it("keeps DA admitted and canon_locked", () => {
    expect(da).toBeDefined();

    expect(
      evaluateCanonicalOperatorCanonLockAdmissionV0_1(da!),
    ).toMatchObject({
      operatorId: "DA",
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

  it("keeps DA and DI canon_locked while AT remains runtime_verified", () => {
    expect(
      canonicalOperatorProfilesV0_1.map(
        (profile) => [
          profile.operatorId,
          profile.canonLifecycleStatus,
        ],
      ),
    ).toEqual([
      ["DA", "canon_locked"],
      ["DI", "canon_locked"],
      ["AT", "runtime_verified"],
    ]);
  });

  it("records transition, rollback and historical-record boundaries", () => {
    for (const marker of [
      "DI-only governance transition",
      "`bounded_functional_lexical_projection`",
      "The readiness reassessment remains a historical pre-transition record.",
      "The governance-only rollback target is:",
      "`runtime_verified`",
      "No duplicate scope field is introduced.",
    ]) {
      expect(transition).toContain(marker);
    }

    expect(review).toContain(
      "Status: IMPLEMENTED_PENDING_REVIEW.",
    );
    expect(review).toContain(
      "No DI-specific RootMap branch is added.",
    );
  });

  it("preserves not-claimed boundaries and user decision posture", () => {
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
