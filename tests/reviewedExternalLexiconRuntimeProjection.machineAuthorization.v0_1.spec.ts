import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
} from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  projectReviewedExternalLexiconProductionRowForRuntimeV0_1,
} from "../src/shared/reviewedExternalLexiconRuntimeProjection.v0_1";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

describe(
  "reviewed external lexicon machine-authorized runtime projection v0.1",
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

    it("keeps DA in explicit production membership and DI outside it", () => {
      expect(
        isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
          daSourceId,
        ),
      ).toBe(true);

      expect(
        isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
          diSourceId,
        ),
      ).toBe(false);
    });

    it("preserves the exact DA runtime projection contract", () => {
      expect(daRow).toBeDefined();

      const projection =
        projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
          daRow!,
        );

      expect(projection).toEqual(
        expect.objectContaining({
          projectionVersion:
            "reviewed-external-lexicon-runtime-projection.v0_1",
          sourceId: daSourceId,
          candidateId: "albanian-da-dam-damage-functional",
          embryo: "DA",
          isolatedStandaloneForm: "da",
          claimBoundary: {
            historicalOriginClaim: "not_claimed",
            winnerClaim: "not_claimed",
            languageSuperiorityClaim: "not_claimed",
            userDecisionPosture: "user_decides",
          },
        }),
      );

      expect(projection?.evidenceText).toContain(
        "Dedvukaj & Ndoci 2023 PLSA",
      );
      expect(projection?.evidenceText).toContain(
        "Example (4), page 3; footnote 1",
      );
      expect(projection?.evidenceText).toContain(
        "10.3765/plsa.v8i1.5501",
      );
    });

    it("does not depend on mutable DA promotion prose", () => {
      expect(daRow).toBeDefined();

      const withoutPromotionProse:
        ReviewedExternalLexiconCandidateSourceRowV0_1 = {
          ...daRow!,
          sourceNote:
            "Reviewed Gheg da bounded functional source row.",
          externalCitations: daRow!.externalCitations.map(
            (citation, index) =>
              index === 0
                ? {
                    ...citation,
                    reviewNote:
                      "Reviewed Gheg da bounded lexical citation.",
                  }
                : citation,
          ),
        };

      const projection =
        projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
          withoutPromotionProse,
        );

      expect(projection).not.toBeNull();
      expect(projection).toEqual(
        expect.objectContaining({
          sourceId: daSourceId,
          candidateId: "albanian-da-dam-damage-functional",
          isolatedStandaloneForm: "da",
        }),
      );
    });

    it("keeps DI non-projectable because DI is not a production member", () => {
      expect(diRow).toBeDefined();

      expect(
        projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
          diRow!,
        ),
      ).toBeNull();

      const productionIds =
        getReviewedExternalLexiconProductionSourceRowsV0_1().map(
          (row) => row.sourceId,
        );

      expect(productionIds).not.toContain(diSourceId);
    });

    it("fails closed when an authorized production row gains a candidate-truth claim", () => {
      expect(daRow).toBeDefined();

      const malformed = {
        ...daRow!,
        candidateTruthClaim: true,
      } as unknown as ReviewedExternalLexiconCandidateSourceRowV0_1;

      expect(
        projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
          malformed,
        ),
      ).toBeNull();
    });

    it("fails closed when lexical readiness no longer passes", () => {
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

      expect(
        projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
          malformed,
        ),
      ).toBeNull();
    });

    it("removes prose promotion markers from projection authorization logic", () => {
      const fs = require("node:fs");
      const path = require("node:path");

      const projectionSource = fs.readFileSync(
        path.join(
          process.cwd(),
          "src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts",
        ),
        "utf8",
      );

      expect(projectionSource).toContain(
        "evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1",
      );
      expect(projectionSource).toContain(
        "isReviewedExternalLexiconSourceIdInProductionMembershipV0_1",
      );

      expect(projectionSource).not.toContain(
        "hasAcceptedProductionPromotionMarker",
      );
      expect(projectionSource).not.toContain(
        "Production registry promotion accepted v0.1",
      );
      expect(projectionSource).not.toContain(
        "Production source row promotion accepted v0.1",
      );
    });
  },
);
