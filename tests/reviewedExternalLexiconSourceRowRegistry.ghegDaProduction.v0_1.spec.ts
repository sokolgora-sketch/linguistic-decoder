import { evaluateReviewedExternalLexiconEvidenceGateV0_1 } from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  isReviewedExternalLexiconRegistryRowProductionSafeV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

describe("reviewed external lexicon source row registry Gheg DA production v0.1", () => {
  it("promotes only the reviewed Gheg DA row into production rows", () => {
    const rows = getReviewedExternalLexiconProductionSourceRowsV0_1();

    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
      candidateId: "albanian-da-dam-damage-functional",
      sourceKind: "reviewed_dictionary_source",
      sourceStatus: "reviewed_accepted",
      embryo: "DA",
      isolatedStandaloneForm: "da",
      plainStandaloneGloss: "split / divide",
      originClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      userDecisionPosture: "user_decides",
    });
  });

  it("keeps the promoted row production-safe and source-validation eligible", () => {
    const [row] = getReviewedExternalLexiconProductionSourceRowsV0_1();
    const result = evaluateReviewedExternalLexiconEvidenceGateV0_1(row);

    expect(isReviewedExternalLexiconRegistryRowProductionSafeV0_1(row)).toBe(true);
    expect(result.validationOutcome).toBe("source_validation_eligible");
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
