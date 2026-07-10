import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("reviewed external lexicon DI bounded production and stronger-authority boundary v0.1", () => {
  const sourceId =
    "reviewed.external.di.knowledge.candidate.v0_1";

  const row =
    reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
      (candidate) => candidate.sourceId === sourceId,
    );

  it("admits DI to bounded functional production membership", () => {
    expect(row).toBeDefined();

    const productionRow =
      getReviewedExternalLexiconProductionSourceRowsV0_1().find(
        (candidate) => candidate.sourceId === sourceId,
      );

    expect(productionRow).toMatchObject({
      sourceId,
      candidateId: "albanian-di-know-functional",
      embryo: "DI",
      isolatedStandaloneForm: "di",
      plainStandaloneGloss: "know / knowledge",
      sourceStatus: "reviewed_accepted",
      originClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      candidateTruthClaim: false,
      publicationEvidenceClaim: false,
      scientificEvidenceClaim: false,
      userDecisionPosture: "user_decides",
    });

    expect(productionRow?.sourceNote).toContain(
      "bounded functional lexical projection",
    );

    expect(productionRow?.sourceNote).toContain(
      "the user decides",
    );
  });

  it("passes the lexical packaging checklist without asserting direct dictionary authority", () => {
    expect(row).toBeDefined();

    const checklist =
      buildReviewedExternalLexiconPromotionChecklistV0_1(
        row!,
      );

    expect(checklist.promotionReady).toBe(true);

    expect(checklist.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "direct_authoritative_locator_or_archive",
          passed: true,
        }),
      ]),
    );

    expect(row?.externalCitations[0].reviewNote).toContain(
      "remains unresolved for historical-authority or stronger-source claims",
    );

    expect(row?.externalCitations[0].reviewNote).toContain(
      "is not required for this bounded lexical projection",
    );

    expect(row?.externalCitations[0].reviewNote).not.toContain(
      "entry verified",
    );

    expect(row?.originClaim).toBe(false);
    expect(row?.historicalTransmissionClaim).toBe(false);
    expect(row?.winnerClaim).toBe(false);
    expect(row?.languageSuperiorityClaim).toBe(false);
    expect(row?.candidateTruthClaim).toBe(false);
  });
});
