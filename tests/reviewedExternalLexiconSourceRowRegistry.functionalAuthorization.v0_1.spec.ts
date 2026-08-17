import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
} from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1,
  isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1,
} from "../src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

describe(
  "reviewed external lexicon authorization-enforced production registry v0.1",
  () => {
    const daSourceId =
      "reviewed.external.gheg-da.damage.candidate.v0_1";
    const diSourceId =
      "reviewed.external.di.knowledge.candidate.v0_1";
    const atSourceId =
      "reviewed.external.albanian-at.father.candidate.v0_1";

    const daRow =
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
        (row) => row.sourceId === daSourceId,
      );
    const diRow =
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
        (row) => row.sourceId === diSourceId,
      );
    const atRow =
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
        (row) => row.sourceId === atSourceId,
      );

    it("machine-authorizes reviewed DA, DI, and AT source IDs", () => {
      expect(
        isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
          daSourceId,
        ),
      ).toBe(true);
      expect(
        isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
          diSourceId,
        ),
      ).toBe(true);
      expect(
        isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
          atSourceId,
        ),
      ).toBe(true);
    });

    it("returns both bounded production rows only after machine authorization passes", () => {
      expect(daRow).toBeDefined();
      expect(diRow).toBeDefined();
      expect(atRow).toBeDefined();

      expect(
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          daRow!,
        ).authorized,
      ).toBe(true);
      expect(
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          diRow!,
        ).authorized,
      ).toBe(true);
      expect(
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          atRow!,
        ).authorized,
      ).toBe(true);

      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1(),
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            sourceId: daSourceId,
            candidateId: "albanian-da-dam-damage-functional",
            embryo: "DA",
          }),
          expect.objectContaining({
            sourceId: diSourceId,
            candidateId: "albanian-di-know-functional",
            embryo: "DI",
          }),
          expect.objectContaining({
            sourceId: atSourceId,
            candidateId:
              "albanian-at-father-functional",
            embryo: "AT",
          }),
        ]),
      );

      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1(),
      ).toHaveLength(3);
    });

    it("keeps DI bounded by functional authorization and user decision", () => {
      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          diRow!,
        );

      expect(authorization).toEqual(
        expect.objectContaining({
          sourceId: diSourceId,
          candidateId: "albanian-di-know-functional",
          authorized: true,
          authorizationScope:
            "bounded_functional_lexical_projection",
          historicalOriginClaim: "not_claimed",
          userDecisionPosture: "user_decides",
          reasons: [],
        }),
      );
      expect(authorization.readiness.functionalReady).toBe(true);
    });

    it("rejects a production candidate when candidate truth is introduced", () => {
      const malformed = {
        ...diRow!,
        candidateTruthClaim: true,
      } as unknown as ReviewedExternalLexiconCandidateSourceRowV0_1;

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          malformed,
        );

      expect(authorization.authorized).toBe(false);
      expect(authorization.reasons).toContain(
        "candidate_truth_claim_present",
      );
    });

    it("rejects a production candidate when lexical readiness fails", () => {
      const malformed:
        ReviewedExternalLexiconCandidateSourceRowV0_1 = {
          ...diRow!,
          externalCitations: diRow!.externalCitations.map(
            (citation, index) =>
              index === 0
                ? {
                    ...citation,
                    attestedForm: "unrelated",
                  }
                : citation,
          ),
        };

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          malformed,
        );

      expect(authorization.authorized).toBe(false);
      expect(authorization.readiness.functionalReady).toBe(false);
      expect(authorization.reasons).toContain(
        "functional_readiness_failed",
      );
    });

    it("keeps AT bounded by reviewed lexical readiness and user decision", () => {
      expect(atRow).toBeDefined();

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          atRow!,
        );

      expect(authorization).toEqual(
        expect.objectContaining({
          sourceId: atSourceId,
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

      expect(
        authorization
          .readiness
          .functionalReady,
      ).toBe(true);
    });

  },
);
