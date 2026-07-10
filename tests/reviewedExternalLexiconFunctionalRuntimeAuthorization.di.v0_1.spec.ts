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
  "reviewed external lexicon functional runtime authorization DI v0.1",
  () => {
    const sourceId =
      "reviewed.external.di.knowledge.candidate.v0_1";

    const row =
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
        (candidate) => candidate.sourceId === sourceId,
      );

    it("finds the reviewed DI candidate row", () => {
      expect(row).toBeDefined();

      expect(row).toMatchObject({
        sourceId,
        candidateId: "albanian-di-know-functional",
        embryo: "DI",
        isolatedStandaloneForm: "di",
        plainStandaloneGloss: "know / knowledge",
      });
    });

    it("explicitly authorizes the DI source ID for bounded functional runtime projection", () => {
      expect(
        isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
          sourceId,
        ),
      ).toBe(true);

      expect(
        isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
          "reviewed.external.unknown.candidate.v0_1",
        ),
      ).toBe(false);
    });

    it("authorizes DI structurally without making historical or truth claims", () => {
      expect(row).toBeDefined();

      const result =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          row!,
        );

      expect(result).toEqual(
        expect.objectContaining({
          authorizationVersion:
            "reviewed-external-lexicon-functional-runtime-authorization.v0_1",
          sourceId,
          candidateId: "albanian-di-know-functional",
          authorized: true,
          authorizationScope:
            "bounded_functional_lexical_projection",
          historicalOriginClaim: "not_claimed",
          userDecisionPosture: "user_decides",
          reasons: [],
        }),
      );

      expect(result.readiness.functionalReady).toBe(true);

      expect(row).toEqual(
        expect.objectContaining({
          originClaim: false,
          historicalTransmissionClaim: false,
          winnerClaim: false,
          languageSuperiorityClaim: false,
          candidateTruthClaim: false,
          publicationEvidenceClaim: false,
          scientificEvidenceClaim: false,
          userDecisionPosture: "user_decides",
        }),
      );
    });

    it("does not add DI to production source-row membership", () => {
      const productionIds =
        getReviewedExternalLexiconProductionSourceRowsV0_1().map(
          (productionRow) => productionRow.sourceId,
        );

      expect(productionIds).not.toContain(sourceId);
    });

    it("rejects an unauthorized source ID", () => {
      expect(row).toBeDefined();

      const changed:
        ReviewedExternalLexiconCandidateSourceRowV0_1 = {
          ...row!,
          sourceId: "reviewed.external.unknown.candidate.v0_1",
        };

      const result =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          changed,
        );

      expect(result.authorized).toBe(false);
      expect(result.reasons).toContain(
        "source_id_not_authorized",
      );
    });

    it("rejects a failed functional readiness result", () => {
      expect(row).toBeDefined();

      const changed:
        ReviewedExternalLexiconCandidateSourceRowV0_1 = {
          ...row!,
          externalCitations: row!.externalCitations.map(
            (citation, index) =>
              index === 0
                ? {
                    ...citation,
                    attestedForm: "unrelated",
                  }
                : citation,
          ),
        };

      const result =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          changed,
        );

      expect(result.authorized).toBe(false);
      expect(result.readiness.functionalReady).toBe(false);
      expect(result.reasons).toContain(
        "functional_readiness_failed",
      );
    });

    it("rejects any historical-origin claim", () => {
      expect(row).toBeDefined();

      const changed = {
        ...row!,
        originClaim: true,
      } as unknown as ReviewedExternalLexiconCandidateSourceRowV0_1;

      const result =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          changed,
        );

      expect(result.authorized).toBe(false);
      expect(result.reasons).toContain(
        "historical_origin_claim_present",
      );
    });

    it("rejects candidate-truth promotion", () => {
      expect(row).toBeDefined();

      const changed = {
        ...row!,
        candidateTruthClaim: true,
      } as unknown as ReviewedExternalLexiconCandidateSourceRowV0_1;

      const result =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          changed,
        );

      expect(result.authorized).toBe(false);
      expect(result.reasons).toContain(
        "candidate_truth_claim_present",
      );
    });
  },
);
