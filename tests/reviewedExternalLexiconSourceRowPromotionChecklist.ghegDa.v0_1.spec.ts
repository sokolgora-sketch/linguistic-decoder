import { reviewedExternalLexiconSourceRowCandidateRegistryV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("reviewed external lexicon source row promotion checklist Gheg DA v0.1", () => {
  it("keeps the current Gheg DA candidate not promotion-ready until pending metadata is finalized", () => {
    const row = reviewedExternalLexiconSourceRowCandidateRegistryV0_1[0];
    const checklist = buildReviewedExternalLexiconPromotionChecklistV0_1(row);

    expect(checklist).toMatchObject({
      checklistVersion: "reviewed-external-lexicon-promotion-checklist.v0_1",
      sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
      candidateId: "albanian-da-dam-damage-functional",
      promotionReady: false,
    });

    expect(checklist.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "source_url_or_archive_ref_finalized",
          passed: false,
        }),
        expect.objectContaining({
          id: "entry_locator_finalized",
          passed: false,
        }),
        expect.objectContaining({
          id: "source_note_live_marker_removed",
          passed: false,
        }),
      ]),
    );
  });

  it("passes only when pending markers are replaced and the non-live source note is removed", () => {
    const row = {
      ...reviewedExternalLexiconSourceRowCandidateRegistryV0_1[0],
      sourceNote:
        "Reviewed Gheg da as a free operator meaning split/divide can functionally motivate damage/harm through split/divided state.",
      externalCitations: [
        {
          ...reviewedExternalLexiconSourceRowCandidateRegistryV0_1[0].externalCitations[0],
          sourceUrlOrArchiveRef: "archive://reviewed-external-lexicon/gheg-da-split-divide",
          entryLocator: "entry:gheg-da-split-divide",
        },
      ],
    };

    const checklist = buildReviewedExternalLexiconPromotionChecklistV0_1(row);

    expect(checklist.promotionReady).toBe(true);
    expect(checklist.items.every((item) => item.passed)).toBe(true);
  });
});
