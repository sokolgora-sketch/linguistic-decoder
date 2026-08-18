import {
  evaluateReviewedExternalLexiconEvidenceGateV0_1,
} from "@/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";

import {
  buildReviewedExternalLexiconFunctionalReadinessV0_1,
} from "@/shared/reviewedExternalLexiconFunctionalReadiness.v0_1";

import {
  evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1,
} from "@/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1";

import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

import {
  projectReviewedExternalLexiconProductionRowForRuntimeV0_1,
} from "@/shared/reviewedExternalLexiconRuntimeProjection.v0_1";

import {
  evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1,
} from "@/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1";

import {
  getCanonicalOperatorProfileV0_1,
  resolveCanonicalOperatorProfileV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

import {
  discoverCanonicalOperatorCandidatesV0_1,
} from "@/shared/canonicalOperatorDiscovery.v0_1";

import {
  evaluateCanonicalOperatorCanonLockAdmissionV0_1,
} from "@/shared/canonicalOperatorCanonLockAdmission.v0_1";

import {
  getProtoRootV1,
} from "@/shared/protoRoots.v1";

import {
  buildMinRootHypotheses,
} from "@/shared/deepRoot.minRoots.v1";

const AT_SOURCE =
  "reviewed.external.albanian-at.father.candidate.v0_1";

describe(
  "AT authoritative-source runtime admission v0.1",
  () => {
    const row =
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
        (candidate) =>
          candidate.sourceId ===
          AT_SOURCE,
      );

    it("registers the exact reviewed Albanian AT lexical source", () => {
      expect(row).toBeDefined();

      expect(row).toMatchObject({
        sourceId: AT_SOURCE,
        candidateId:
          "albanian-at-father-functional",
        candidateLanguage: "sq",
        displayForm: "AT",
        sourceKind:
          "reviewed_lexical_source",
        sourceStatus:
          "reviewed_accepted",
        embryo: "AT",
        isolatedStandaloneForm:
          "at",
        plainStandaloneGloss:
          "father",
        originClaim: false,
        historicalTransmissionClaim:
          false,
        winnerClaim: false,
        languageSuperiorityClaim:
          false,
        candidateTruthClaim: false,
        publicationEvidenceClaim:
          false,
        scientificEvidenceClaim:
          false,
        userDecisionPosture:
          "user_decides",
      });

      expect(
        row?.externalCitations[0],
      ).toMatchObject({
        citationStatus:
          "reviewed_accepted",
        citationType:
          "academic_lexical_reference",
        sourceTitle:
          "The Albanian inherited lexicon",
        sourceUrlOrArchiveRef:
          "https://ieed.ullet.net/alb.html",
        attestedForm: "at",
        attestedGloss: "father",
      });

      expect(
        row?.externalCitations[0]
          .entryLocator,
      ).toContain(
        "at [m] (tg) {2} 'father'",
      );

      expect(
        row?.externalCitations[0]
          .entryLocator,
      ).toContain(
        "Alb. atë [m] (tg) 'father'",
      );
    });

    it("passes evidence gate and bounded functional readiness", () => {
      expect(row).toBeDefined();

      const gate =
        evaluateReviewedExternalLexiconEvidenceGateV0_1(
          row!,
        );

      expect(gate.eligible).toBe(true);

      expect(
        gate.evidenceCategories,
      ).toEqual(
        expect.arrayContaining([
          "free_operator_attested",
          "functional_motivation_supported",
          "historical_origin_not_claimed",
          "user_decides",
        ]),
      );

      const readiness =
        buildReviewedExternalLexiconFunctionalReadinessV0_1(
          row!,
        );

      expect(
        readiness.functionalReady,
      ).toBe(true);

      expect(
        readiness.items.every(
          (item) => item.passed,
        ),
      ).toBe(true);
    });

    it("passes explicit production membership and machine authorization", () => {
      expect(row).toBeDefined();

      expect(
        isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
          AT_SOURCE,
        ),
      ).toBe(true);

      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1()
          .map(
            (candidate) =>
              candidate.sourceId,
          ),
      ).toContain(
        AT_SOURCE,
      );

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          row!,
        );

      expect(authorization).toEqual(
        expect.objectContaining({
          sourceId: AT_SOURCE,
          candidateId:
            "albanian-at-father-functional",
          authorized: true,
          authorizationScope:
            "bounded_functional_lexical_projection",
          historicalOriginClaim:
            "not_claimed",
          userDecisionPosture:
            "user_decides",
          reasons: [],
        }),
      );
    });

    it("permits only exact reviewed at carrier evidence", () => {
      expect(
        evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1({
          sourceId: AT_SOURCE,
          embryo: "AT",
          ops: ["exact"],
          segment: "at",
          carrierForm: "at",
        }),
      ).toMatchObject({
        allowed: true,
        effectiveOps: ["exact"],
        effectiveCarrierForm:
          "at",
        reasons: [],
      });

      expect(
        evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1({
          sourceId: AT_SOURCE,
          embryo: "AT",
          ops: ["vowel_swap"],
          segment: "et",
          carrierForm: "at",
        }).allowed,
      ).toBe(false);
    });

    it("adds the exact at father carrier to the AT proto-root", () => {
      const root =
        getProtoRootV1("AT");

      expect(root).toBeDefined();

      expect(root?.roleHint).toBe(
        "Unit",
      );

      expect(root?.carriers).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            lang: "sq",
            form: "at",
            gloss: "father",
          }),
          expect.objectContaining({
            lang: "sq",
            form: "atë",
            gloss: "father",
          }),
        ]),
      );
    });

    it("registers AT as runtime_verified but not canon_locked", () => {
      const profile =
        getCanonicalOperatorProfileV0_1(
          "AT",
        );

      expect(profile).toBeDefined();

      expect(profile).toMatchObject({
        operatorId: "AT",
        embryo: "AT",
        language: "sq",
        sourceId: AT_SOURCE,
        reviewedEvidenceStatus:
          "reviewed_functional",
        canonLifecycleStatus:
          "runtime_verified",
        authorizationScope:
          "bounded_functional_lexical_projection",
        positiveProofWords: [
          "father",
        ],
      });

      expect(
        profile?.negativeControlWords,
      ).toContain("at");

      const resolved =
        resolveCanonicalOperatorProfileV0_1(
          profile!,
        );

      expect(resolved).not.toBeNull();
      expect(
        resolved?.readiness
          .functionalReady,
      ).toBe(true);
      expect(
        resolved?.authorization
          .authorized,
      ).toBe(true);
      expect(
        resolved?.productionMember,
      ).toBe(true);
      expect(
        resolved?.runtimeProjection,
      ).not.toBeNull();

      const admission =
        evaluateCanonicalOperatorCanonLockAdmissionV0_1(
          resolved!,
        );

      expect(admission.admitted).toBe(
        false,
      );

      expect(
        admission.reasons,
      ).toContain(
        "operator_not_explicitly_admitted",
      );

      expect(
        admission.rollbackLifecycleStatus,
      ).toBe(
        "runtime_verified",
      );
    });

    it("authorizes father but not bare at as reviewed functional target", () => {
      const father =
        discoverCanonicalOperatorCandidatesV0_1(
          "father",
        ).filter(
          (candidate) =>
            candidate.operatorId ===
            "AT",
        );

      expect(father).toContainEqual(
        expect.objectContaining({
          basis: "father",
          operatorId: "AT",
          embryo: "AT",
          segment: "at",
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
            candidate.operatorId ===
            "AT",
        );

      expect(bareAt).toContainEqual(
        expect.objectContaining({
          basis: "at",
          operatorId: "AT",
          segment: "at",
          functionalBridgeStatus:
            "unreviewed",
          reviewedEvidenceEligible:
            false,
        }),
      );
    });

    it("preserves pre-existing AT carriers for structural DeepRoot discovery without promoting them to reviewed canonical evidence", () => {
      for (const word of [
        "atë",
        "ati",
        "pater",
      ]) {
        const structural =
          buildMinRootHypotheses(
            word,
          );

        expect(
          structural.some(
            (hypothesis) =>
              hypothesis.protoRoots.includes(
                "AT",
              ),
          ),
        ).toBe(true);

        expect(
          discoverCanonicalOperatorCandidatesV0_1(
            word,
          ).filter(
            (candidate) =>
              candidate.operatorId ===
              "AT",
          ),
        ).toEqual([]);
      }
    });

    it("prevents runtime_verified AT from leaking into unrelated generic discovery", () => {
      for (const word of [
        "diet",
        "data",
        "later",
        "water",
      ]) {
        expect(
          discoverCanonicalOperatorCandidatesV0_1(
            word,
          ).filter(
            (candidate) =>
              candidate.operatorId ===
              "AT",
          ),
        ).toEqual([]);

        expect(
          buildMinRootHypotheses(
            word,
          ).some(
            (hypothesis) =>
              hypothesis.protoRoots.includes(
                "AT",
              ),
          ),
        ).toBe(false);
      }
    });

    it("emits an isolated AT runtime projection with no DA or DI citation leakage", () => {
      expect(row).toBeDefined();

      const projection =
        projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
          row!,
        );

      expect(projection).toMatchObject({
        sourceId: AT_SOURCE,
        candidateId:
          "albanian-at-father-functional",
        embryo: "AT",
        isolatedStandaloneForm:
          "at",
        claimBoundary: {
          historicalOriginClaim:
            "not_claimed",
          winnerClaim:
            "not_claimed",
          languageSuperiorityClaim:
            "not_claimed",
          userDecisionPosture:
            "user_decides",
        },
      });

      expect(
        projection?.evidenceText,
      ).toContain(
        "The Albanian inherited lexicon",
      );

      expect(
        projection?.evidenceText,
      ).toContain(
        "https://ieed.ullet.net/alb.html",
      );

      expect(
        projection?.evidenceText,
      ).not.toContain(
        "Dedvukaj & Ndoci",
      );

      expect(
        projection?.evidenceText,
      ).not.toContain(
        "wiktionary.org/wiki/di",
      );
    });
  },
);
