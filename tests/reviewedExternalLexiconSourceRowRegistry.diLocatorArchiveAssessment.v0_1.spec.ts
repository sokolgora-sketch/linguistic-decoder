import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("reviewed external lexicon DI locator/archive assessment v0.1", () => {
  const sourceId = "reviewed.external.di.knowledge.candidate.v0_1";
  const row = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
    (candidate) => candidate.sourceId === sourceId,
  );

  it("records that DI is semantically supported while production-live packaging remains separately gated", () => {
    expect(row).toBeDefined();

    expect(row).toMatchObject({
      sourceId,
      candidateId: "albanian-di-know-functional",
      embryo: "DI",
      isolatedStandaloneForm: "di",
      plainStandaloneGloss: "know / knowledge",
      semanticBridge:
        "knowledge can motivate study and learning functionally without making a historical-origin claim",
      originClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      userDecisionPosture: "user_decides",
    });

    expect(row?.sourceNote).toContain("production registry remains separately gated");
    expect(row?.externalCitations[0].reviewNote).toContain(
      "Direct DPEWA/FGJSH locator or archived authoritative dictionary snapshot",
    );
  });

  it("keeps DI outside production rows until the direct locator/archive packaging decision is explicit", () => {
    const productionIds = getReviewedExternalLexiconProductionSourceRowsV0_1().map(
      (productionRow) => productionRow.sourceId,
    );

    expect(productionIds).not.toContain(sourceId);

    const checklist = buildReviewedExternalLexiconPromotionChecklistV0_1(row!);
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

  it("documents currently inspected direct evidence without treating it as automatic production promotion", () => {
    const inspectedEvidence = [
      {
        source: "IE-CoR Cognate Set 426",
        locator: "https://iecor.clld.org/cognatesets/426",
        finding:
          "Meaning know; Albanian Gheg di and Albanian Standard di listed under the cognate set.",
      },
      {
        source: "FJALË Fjalor Shqip",
        locator: "https://fjale.al/di",
        finding:
          "Direct DI entry defines knowing / having knowledge / having learned or mastered something.",
      },
      {
        source: "Wiktionary di#Albanian",
        locator: "https://en.wiktionary.org/wiki/di#Albanian",
        finding:
          "Albanian verb di glossed as to know, with DPEWA and FGJSH reference trail.",
      },
    ];

    expect(inspectedEvidence).toEqual([
      expect.objectContaining({
        source: "IE-CoR Cognate Set 426",
        locator: "https://iecor.clld.org/cognatesets/426",
      }),
      expect.objectContaining({
        source: "FJALË Fjalor Shqip",
        locator: "https://fjale.al/di",
      }),
      expect.objectContaining({
        source: "Wiktionary di#Albanian",
        locator: "https://en.wiktionary.org/wiki/di#Albanian",
      }),
    ]);

    expect(JSON.stringify(inspectedEvidence)).not.toContain("historicalOriginClaim=true");
    expect(JSON.stringify(inspectedEvidence)).not.toContain("winnerClaim=true");
    expect(JSON.stringify(inspectedEvidence)).not.toContain("languageSuperiorityClaim=true");
  });
});
