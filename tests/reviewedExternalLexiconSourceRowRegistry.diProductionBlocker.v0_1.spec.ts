import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("reviewed external lexicon source row registry DI production blocker v0.1", () => {
  const sourceId = "reviewed.external.di.knowledge.candidate.v0_1";

  it("keeps reviewed DI out of production rows until direct authoritative locator exists", () => {
    const productionRows = getReviewedExternalLexiconProductionSourceRowsV0_1();
    const diProductionRow = productionRows.find((row) => row.sourceId === sourceId);

    expect(diProductionRow).toBeUndefined();

    const candidateRow = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
      (row) => row.sourceId === sourceId,
    );

    expect(candidateRow).toBeDefined();
    expect(candidateRow?.sourceNote).toContain("production registry remains separately gated");
    expect(candidateRow?.externalCitations[0].reviewNote).toContain(
      "Direct DPEWA/FGJSH locator",
    );
    expect(candidateRow?.externalCitations[0].reviewNote).toContain(
      "still required before production-live promotion",
    );
  });

  it("fails the production-live checklist on the direct authoritative locator blocker", () => {
    const candidateRow = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
      (row) => row.sourceId === sourceId,
    );

    expect(candidateRow).toBeDefined();

    const checklist = buildReviewedExternalLexiconPromotionChecklistV0_1(candidateRow);

    expect(checklist.promotionReady).toBe(false);
    expect(checklist.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "direct_authoritative_locator_or_archive",
          passed: false,
        }),
      ]),
    );
  });
});
