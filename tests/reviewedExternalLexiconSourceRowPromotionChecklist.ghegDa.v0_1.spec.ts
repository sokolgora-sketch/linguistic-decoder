import { reviewedExternalLexiconSourceRowCandidateRegistryV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("reviewed external lexicon source row promotion checklist Gheg DA v0.1", () => {
  it("marks the current Gheg DA candidate promotion-ready after reviewed citation metadata intake", () => {
    const row = reviewedExternalLexiconSourceRowCandidateRegistryV0_1[0];
    const checklist = buildReviewedExternalLexiconPromotionChecklistV0_1(row);

    expect(checklist).toMatchObject({
      checklistVersion: "reviewed-external-lexicon-promotion-checklist.v0_1",
      sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
      candidateId: "albanian-da-dam-damage-functional",
      promotionReady: true,
    });

    expect(checklist.items.every((item) => item.passed)).toBe(true);
  });

  it("fails if pending markers or the non-live source note return", () => {
    const row = {
      ...reviewedExternalLexiconSourceRowCandidateRegistryV0_1[0],
      sourceNote:
        "NON-LIVE CANDIDATE: Reviewed Gheg da as a free operator meaning split/divide can functionally motivate damage/harm.",
      externalCitations: [
        {
          ...reviewedExternalLexiconSourceRowCandidateRegistryV0_1[0].externalCitations[0],
          sourceUrlOrArchiveRef: "pending-reviewed-external-citation:gheg-da-split-divide",
          entryLocator: "pending:gheg-da",
        },
      ],
    };

    const checklist = buildReviewedExternalLexiconPromotionChecklistV0_1(row);

    expect(checklist.promotionReady).toBe(false);
    expect(checklist.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "source_url_or_archive_ref_finalized", passed: false }),
        expect.objectContaining({ id: "entry_locator_finalized", passed: false }),
        expect.objectContaining({ id: "source_note_live_marker_removed", passed: false }),
      ]),
    );
  });
});
