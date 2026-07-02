import { evaluateReviewedExternalLexiconEvidenceGateV0_1 } from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  isReviewedExternalLexiconRegistryRowProductionSafeV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("reviewed external lexicon source row candidate registry DI v0.1", () => {
  const row = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
    (candidate) => candidate.sourceId === "reviewed.external.di.knowledge.candidate.v0_1",
  );

  it("exposes DI as a reviewed source-row candidate with claim boundaries locked off", () => {
    expect(row).toMatchObject({
      sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
      candidateId: "albanian-di-know-functional",
      candidateLanguage: "sq",
      displayForm: "DI know knowledge candidate",
      sourceKind: "reviewed_dictionary_source",
      sourceStatus: "reviewed_accepted",
      embryo: "DI",
      isolatedStandaloneForm: "di",
      plainStandaloneGloss: "know / knowledge",
      originClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      userDecisionPosture: "user_decides",
    });

    expect(row?.sourceNote).not.toContain("NON-LIVE CANDIDATE");
    expect(row?.sourceNote).toContain("Reviewed citation candidate");
    expect(row?.externalCitations[0]).toMatchObject({
      citationStatus: "reviewed_accepted",
      citationType: "dictionary_entry",
      attestedForm: "di",
      attestedGloss: "know / knowledge",
    });
  });

  it("is production-safe as metadata but remains blocked from production-live promotion pending direct authoritative locator", () => {
    expect(row).toBeDefined();
    expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(true);
    expect(row?.externalCitations[0]).toMatchObject({
      sourceTitle: "di",
      sourcePublisherOrHost: "Wiktionary / DPEWA reference listing",
      sourceUrlOrArchiveRef: "https://en.wiktionary.org/wiki/di#Albanian",
      entryLocator: "Albanian > Etymology 1 > Verb > di: to know",
      sourceHashOrArchiveHash: "url:https://en.wiktionary.org/wiki/di#Albanian",
    });
    expect(row?.externalCitations[0].reviewNote).toContain(
      "Direct DPEWA/FGJSH locator",
    );
    expect(row?.externalCitations[0].reviewNote).toContain(
      "still required before production-live promotion",
    );
    expect(row?.sourceNote).toContain("production registry remains separately gated");
    expect(row?.externalCitations[0].sourceUrlOrArchiveRef).not.toContain("pending");
    expect(row?.externalCitations[0].entryLocator).not.toContain("pending:");
  });

  it("is source-validation eligible for diagnostics while remaining non-live", () => {
    expect(row).toBeDefined();
    const result = evaluateReviewedExternalLexiconEvidenceGateV0_1(row);

    expect(result.validationOutcome).toBe("source_validation_eligible");
    expect(result.validationReasons).toEqual([]);
    expect(result.evidenceCategories).toEqual([
      "free_operator_attested",
      "functional_motivation_supported",
      "historical_origin_not_claimed",
      "user_decides",
    ]);
    expect(result.freeOperatorDiagnostic).toMatchObject({
      operator: "di",
      attestedForms: ["di"],
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
  });

  it("keeps the checklist blocked for production-live promotion until direct authoritative locator exists", () => {
    expect(row).toBeDefined();
    const checklist = buildReviewedExternalLexiconPromotionChecklistV0_1(row);

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
