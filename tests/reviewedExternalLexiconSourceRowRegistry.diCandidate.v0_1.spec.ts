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

  it("exposes DI as a non-live reviewed source-row candidate", () => {
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

    expect(row?.sourceNote).toContain("NON-LIVE CANDIDATE");
    expect(row?.externalCitations[0]).toMatchObject({
      citationStatus: "reviewed_accepted",
      citationType: "dictionary_entry",
      attestedForm: "di",
      attestedGloss: "know / knowledge",
    });
  });

  it("is not production-safe until pending citation metadata is replaced", () => {
    expect(row).toBeDefined();
    expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(false);
    expect(row?.externalCitations[0].sourceUrlOrArchiveRef).toContain(
      "pending-reviewed-external-citation",
    );
    expect(row?.externalCitations[0].entryLocator).toContain("pending:");
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

  it("keeps the promotion checklist blocked by pending metadata", () => {
    expect(row).toBeDefined();
    const checklist = buildReviewedExternalLexiconPromotionChecklistV0_1(row);

    expect(checklist.promotionReady).toBe(false);
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
});
