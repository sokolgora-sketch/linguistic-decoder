import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("reviewed external lexicon DI locator/archive assessment v0.1", () => {
  const sourceId =
    "reviewed.external.di.knowledge.candidate.v0_1";

  const row =
    reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
      (candidate) => candidate.sourceId === sourceId,
    );

  it("records bounded lexical production evidence while stronger authority remains separate", () => {
    expect(row).toBeDefined();

    expect(row).toMatchObject({
      sourceId,
      isolatedStandaloneForm: "di",
      plainStandaloneGloss: "know / knowledge",
      originClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      candidateTruthClaim: false,
      publicationEvidenceClaim: false,
      scientificEvidenceClaim: false,
      userDecisionPosture: "user_decides",
    });

    expect(row?.sourceNote).toContain(
      "bounded functional lexical projection",
    );

    expect(row?.externalCitations[0].reviewNote).toContain(
      "A direct DPEWA/FGJSH locator or archived authoritative dictionary snapshot remains unresolved",
    );

    expect(row?.externalCitations[0].reviewNote).toContain(
      "historical-authority or stronger-source claims",
    );
  });

  it("keeps DI in production while its lexical packaging checklist passes", () => {
    const productionIds =
      getReviewedExternalLexiconProductionSourceRowsV0_1().map(
        (productionRow) => productionRow.sourceId,
      );

    expect(productionIds).toContain(sourceId);

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
  });

  it("documents the exact inspected lexical evidence without converting it into historical proof", () => {
    expect(row).toBeDefined();

    const inspectedEvidence = [
      {
        source: "Wiktionary di#Albanian",
        locator:
          "https://en.wiktionary.org/wiki/di#Albanian",
        entry:
          "Albanian > Etymology 1 > Verb > di: to know",
        form: "di",
        gloss: "know / knowledge",
      },
    ];

    expect(inspectedEvidence).toEqual([
      expect.objectContaining({
        source: "Wiktionary di#Albanian",
        locator:
          "https://en.wiktionary.org/wiki/di#Albanian",
      }),
    ]);

    const claims = JSON.stringify(row);

    expect(claims).not.toContain(
      "historicalOriginClaim=true",
    );
    expect(claims).not.toContain("winnerClaim=true");
    expect(claims).not.toContain(
      "languageSuperiorityClaim=true",
    );
    expect(claims).not.toContain(
      "candidateTruthClaim=true",
    );
  });
});
