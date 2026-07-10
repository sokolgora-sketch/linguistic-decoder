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

    const daRow =
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
        (row) => row.sourceId === daSourceId,
      );

    const diRow =
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
        (row) => row.sourceId === diSourceId,
      );

    it("machine-authorizes both reviewed DA and reviewed DI source IDs", () => {
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
    });

    it("keeps existing DA production membership because DA passes machine authorization", () => {
      expect(daRow).toBeDefined();

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          daRow!,
        );

      expect(authorization).toEqual(
        expect.objectContaining({
          sourceId: daSourceId,
          candidateId: "albanian-da-dam-damage-functional",
          authorized: true,
          authorizationScope:
            "bounded_functional_lexical_projection",
          historicalOriginClaim: "not_claimed",
          userDecisionPosture: "user_decides",
          reasons: [],
        }),
      );

      expect(authorization.readiness.functionalReady).toBe(true);

      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1(),
      ).toEqual([
        expect.objectContaining({
          sourceId: daSourceId,
          candidateId: "albanian-da-dam-damage-functional",
          embryo: "DA",
        }),
      ]);
    });

    it("keeps DI outside production membership despite DI passing authorization", () => {
      expect(diRow).toBeDefined();

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          diRow!,
        );

      expect(authorization.authorized).toBe(true);
      expect(authorization.readiness.functionalReady).toBe(true);

      const productionIds =
        getReviewedExternalLexiconProductionSourceRowsV0_1().map(
          (row) => row.sourceId,
        );

      expect(productionIds).not.toContain(diSourceId);
    });

    it("rejects a production candidate when machine authorization fails", () => {
      expect(daRow).toBeDefined();

      const malformed = {
        ...daRow!,
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
      expect(daRow).toBeDefined();

      const malformed:
        ReviewedExternalLexiconCandidateSourceRowV0_1 = {
          ...daRow!,
          externalCitations: daRow!.externalCitations.map(
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
  },
);
