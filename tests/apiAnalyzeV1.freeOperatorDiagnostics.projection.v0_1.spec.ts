import { adaptAnalyzeV1ToUI } from "../src/shared/analyzeV1Adapter";

describe("analyze-v1 free-operator diagnostics projection v0.1", () => {
  it("preserves canonical free-operator diagnostics when raw candidates provide them", () => {
    const out = adaptAnalyzeV1ToUI({
      word: "damage",
      sanitized: "damage",
      engineVersion: "test",
      candidates: [
        {
          id: "albanian-da-dam-damage-functional",
          candidateId: "albanian-da-dam-damage-functional",
          language: "Albanian",
          form: "dam",
          displayForm: "dam",
          sourceKind: "REVIEWED_EXTERNAL_LEXICON",
          validationOutcome: "source_validation_eligible",
          validationReasons: [],
          evidenceCategories: [
            "free_operator_attested",
            "functional_motivation_supported",
            "historical_origin_not_claimed",
            "user_decides",
          ],
          freeOperatorDiagnostic: {
            operator: "da",
            attestedForms: ["da"],
            historicalOriginClaim: "not_claimed",
            userDecisionPosture: "user_decides",
          },
          userDecisionPosture: "user_decides",
        },
      ],
    });

    expect(out.candidates[0]).toMatchObject({
      candidateId: "albanian-da-dam-damage-functional",
      evidenceCategories: [
        "free_operator_attested",
        "functional_motivation_supported",
        "historical_origin_not_claimed",
        "user_decides",
      ],
      freeOperatorDiagnostic: {
        operator: "da",
        attestedForms: ["da"],
        historicalOriginClaim: "not_claimed",
        userDecisionPosture: "user_decides",
      },
    });
  });

  it("preserves derivative DA-family diagnostics without pretending exact free-operator proof", () => {
    const out = adaptAnalyzeV1ToUI({
      word: "damage",
      candidates: [
        {
          id: "derivative-family",
          candidateId: "derivative-family",
          language: "Albanian",
          form: "ndaj",
          validationOutcome: "blocked",
          validationReasons: [
            "da_family_supported_by_derivative_form",
            "externalCitation_derivative_family_support_not_exact_embryo",
          ],
          evidenceCategories: [
            "derivative_family_support",
            "historical_origin_not_claimed",
            "user_decides",
          ],
          freeOperatorDiagnostic: {
            operator: "da",
            attestedForms: ["ndaj"],
            historicalOriginClaim: "not_claimed",
            userDecisionPosture: "user_decides",
          },
        },
      ],
    });

    expect(out.candidates[0]).toMatchObject({
      evidenceCategories: [
        "derivative_family_support",
        "historical_origin_not_claimed",
        "user_decides",
      ],
      freeOperatorDiagnostic: {
        operator: "da",
        attestedForms: ["ndaj"],
      },
    });
    expect(out.candidates[0].evidenceCategories).not.toContain("free_operator_attested");
  });
});
