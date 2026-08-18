import {
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  buildReviewedExternalLexiconPromotionChecklistV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

const AT_SOURCE_ID =
  "reviewed.external.albanian-at.father.candidate.v0_1";

function getAtRow() {
  const row =
    reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
      (candidate) =>
        candidate.sourceId ===
        AT_SOURCE_ID,
    );

  if (!row) {
    throw new Error(
      "Reviewed Albanian AT source row not found.",
    );
  }

  return row;
}

describe(
  "reviewed external lexicon AT promotion checklist v0.1",
  () => {
    it(
      "accepts reviewed academic lexical reference evidence for bounded lexical promotion",
      () => {
        const row =
          getAtRow();

        expect(
          row.externalCitations[0]
            .citationType,
        ).toBe(
          "academic_lexical_reference",
        );

        const checklist =
          buildReviewedExternalLexiconPromotionChecklistV0_1(
            row,
          );

        expect(
          checklist.promotionReady,
        ).toBe(true);

        expect(
          checklist.items,
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id:
                "citation_type_supported_lexical_source",
              passed:
                true,
            }),
          ]),
        );
      },
    );

    it(
      "does not broaden promotion to project-internal citation types",
      () => {
        const row =
          getAtRow();

        const projectDocRow = {
          ...row,
          externalCitations: [
            {
              ...row.externalCitations[0],
              citationType:
                "project_doc" as const,
            },
          ],
        };

        const checklist =
          buildReviewedExternalLexiconPromotionChecklistV0_1(
            projectDocRow,
          );

        expect(
          checklist.promotionReady,
        ).toBe(false);

        expect(
          checklist.items,
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id:
                "citation_type_supported_lexical_source",
              passed:
                false,
            }),
          ]),
        );
      },
    );

    it(
      "does not treat every external citation category as lexical-promotion authority",
      () => {
        const row =
          getAtRow();

        const grammarRow = {
          ...row,
          externalCitations: [
            {
              ...row.externalCitations[0],
              citationType:
                "grammar_entry" as const,
            },
          ],
        };

        const checklist =
          buildReviewedExternalLexiconPromotionChecklistV0_1(
            grammarRow,
          );

        expect(
          checklist.promotionReady,
        ).toBe(false);

        expect(
          checklist.items,
        ).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id:
                "citation_type_supported_lexical_source",
              passed:
                false,
            }),
          ]),
        );
      },
    );
  },
);
