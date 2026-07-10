import {
  isReviewedExternalLexiconRegistryRowProductionSafeV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { evaluateReviewedExternalLexiconEvidenceGateV0_1 } from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import { buildReviewedExternalLexiconPromotionChecklistV0_1 } from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

describe("reviewed external lexicon source row candidate registry DI v0.1", () => {
  const sourceId =
    "reviewed.external.di.knowledge.candidate.v0_1";

  const row =
    reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
      (candidate) => candidate.sourceId === sourceId,
    );

  it("exposes DI as a reviewed bounded production candidate with claim boundaries locked off", () => {
    expect(row).toBeDefined();

    expect(row).toMatchObject({
      sourceId,
      candidateId: "albanian-di-know-functional",
      candidateLanguage: "sq",
      sourceKind: "reviewed_dictionary_source",
      sourceStatus: "reviewed_accepted",
      embryo: "DI",
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
      "Reviewed production row for bounded functional lexical projection",
    );

    expect(row?.sourceNote).toContain(
      "Historical origin, transmission, winner",
    );

    expect(row?.sourceNote).toContain(
      "the user decides",
    );
  });

  it("records stable lexical citation packaging without claiming direct DPEWA or FGJSH authority", () => {
    expect(row?.externalCitations[0]).toMatchObject({
      citationStatus: "reviewed_accepted",
      citationType: "dictionary_entry",
      sourceTitle: "di",
      sourcePublisherOrHost:
        "Wiktionary / DPEWA reference listing",
      sourceUrlOrArchiveRef:
        "https://en.wiktionary.org/wiki/di#Albanian",
      entryLocator:
        "Albanian > Etymology 1 > Verb > di: to know",
      sourceHashOrArchiveHash:
        "url:https://en.wiktionary.org/wiki/di#Albanian",
      attestedForm: "di",
      attestedGloss: "know / knowledge",
    });

    expect(row?.externalCitations[0].reviewNote).toContain(
      "A direct DPEWA/FGJSH locator or archived authoritative dictionary snapshot remains unresolved",
    );

    expect(row?.externalCitations[0].reviewNote).toContain(
      "historical-authority or stronger-source claims",
    );

    expect(row?.externalCitations[0].reviewNote).toContain(
      "is not required for this bounded lexical projection",
    );

    expect(row?.externalCitations[0].reviewNote).not.toContain(
      "entry verified",
    );
  });

  it("remains production-safe and source-validation eligible", () => {
    expect(row).toBeDefined();

    expect(
      isReviewedExternalLexiconRegistryRowProductionSafeV0_1(
        row,
      ),
    ).toBe(true);

    const result =
      evaluateReviewedExternalLexiconEvidenceGateV0_1(
        row!,
      );

    expect(result.validationOutcome).toBe(
      "source_validation_eligible",
    );
    expect(result.eligible).toBe(true);
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

  it("passes the lexical source-packaging checklist while stronger authority remains unclaimed", () => {
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

    expect(row?.originClaim).toBe(false);
    expect(row?.historicalTransmissionClaim).toBe(false);
    expect(row?.candidateTruthClaim).toBe(false);
    expect(row?.userDecisionPosture).toBe(
      "user_decides",
    );
  });
});
