import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  isReviewedExternalLexiconRegistryRowProductionSafeV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import { evaluateReviewedExternalLexiconEvidenceGateV0_1 } from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";

describe("reviewed external lexicon source row registry Gheg DA production v0.1", () => {
  const sourceId =
    "reviewed.external.gheg-da.damage.candidate.v0_1";

  it("keeps the reviewed Gheg DA row in the multi-row production registry", () => {
    const rows =
      getReviewedExternalLexiconProductionSourceRowsV0_1();

    const row = rows.find(
      (candidate) => candidate.sourceId === sourceId,
    );

    expect(row).toMatchObject({
      sourceId,
      candidateId:
        "albanian-da-dam-damage-functional",
      sourceKind: "reviewed_dictionary_source",
      sourceStatus: "reviewed_accepted",
      embryo: "DA",
      isolatedStandaloneForm: "da",
      plainStandaloneGloss: "split / divide",
      originClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      candidateTruthClaim: false,
      publicationEvidenceClaim: false,
      scientificEvidenceClaim: false,
      userDecisionPosture: "user_decides",
    });

    expect(rows.map((candidate) => candidate.sourceId)).toEqual(
      expect.arrayContaining([
        sourceId,
        "reviewed.external.di.knowledge.candidate.v0_1",
      ]),
    );
  });

  it("keeps the DA row production-safe and source-validation eligible", () => {
    const row =
      getReviewedExternalLexiconProductionSourceRowsV0_1().find(
        (candidate) => candidate.sourceId === sourceId,
      );

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
      operator: "da",
      attestedForms: ["da"],
      historicalOriginClaim: "not_claimed",
      userDecisionPosture: "user_decides",
    });
  });
});
