import {
  FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_ID_V0_1,
  FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_V0_1,
  FUNCTIONAL_MANIFESTATION_PREREGISTRATION_STATUS_V0_1,
} from "@/shared/openInstrument/functionalManifestationPreregistration.v0_1";

describe("functional manifestation preregistration v0.1", () => {
  it("freezes the bounded source, unit, and blindness boundary", () => {
    const contract = FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_V0_1;

    expect(contract.contractId).toBe(
      FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_ID_V0_1,
    );
    expect(contract.status).toBe(
      FUNCTIONAL_MANIFESTATION_PREREGISTRATION_STATUS_V0_1,
    );
    expect(contract.frozenInputs.stageA.sha256).toBe(
      "c0953894a677696761bab73bfc10af0ea1f8cefccee428b158477186459f61c3",
    );
    expect(contract.frozenInputs.stageB.sha256).toBe(
      "dbc689de4dce6411b9b066fd058d0282580d7c5c67515c4943d25831bc7c6845",
    );
    expect(contract.frozenGeometry.candidateVariationVoiceGroupsBeforeVariantPolicy).toBe(
      295,
    );
    expect(contract.observationalIndependence.independentUnit).toBe(
      "NORMALIZED_LEXICAL_FORM_IDENTITY",
    );
    expect(contract.observationalIndependence.multiVariantPolicy).toContain(
      "EXCLUDE",
    );
    expect(contract.observationalIndependence.multiVoicePathPolicy).toContain(
      "EXCLUDE",
    );
    expect(contract.executionBoundary.gammaValuesInspectedAtFreeze).toBe(false);
    expect(contract.executionBoundary.zcValuesInspectedAtFreeze).toBe(false);
    expect(contract.executionBoundary.targetWordsUsed).toBe(false);
  });

  it("freezes one global multilabel Gamma test with ZC descriptive only", () => {
    const contract = FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_V0_1;

    expect(contract.outcomeDesign.representation).toContain(
      "EXACT_MULTILABEL_OUTCOME_SIGNATURE",
    );
    expect(contract.outcomeDesign.unresolvedTreatment).toContain(
      "NEVER_RECODE_AS_PROPERTY_NEGATIVE",
    );
    expect(contract.predictorHierarchy.primary).toBe(
      "GAMMA_EXACT_FROZEN_CONFIGURATION_SIGNATURE",
    );
    expect(contract.predictorHierarchy.secondary).toContain("DESCRIPTIVE");
    expect(contract.multipleTesting.primaryTestCount).toBe(1);
    expect(contract.multipleTesting.secondaryInferentialTestCount).toBe(0);
    expect(contract.withinVoiceDesign.blocking).toBe(
      "EXACT_CANONICAL_VOICE_PATH",
    );
    expect(contract.withinVoiceDesign.permutationCount).toBe(10000);
    expect(contract.inferentialConstants.alpha).toBe(0.05);
    expect(contract.inferentialConstants.noPowerThreshold).toBe(true);
  });

  it("freezes bounded decision semantics and forbids redesign after exposure", () => {
    const contract = FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_V0_1;

    expect(contract.decisionSemantics.supported).toContain(
      "SUPPORTED_BOUNDED_ASSOCIATION",
    );
    expect(contract.decisionSemantics.null).toContain(
      "NULL_NO_DETECTABLE_ASSOCIATION",
    );
    expect(contract.decisionSemantics.inconclusive).toContain(
      "INCONCLUSIVE_INSUFFICIENT_EFFECTIVE_SUPPORT",
    );
    expect(contract.decisionSemantics.invalid).toContain(
      "INVALID_ASSUMPTION_FAILURE",
    );
    expect(contract.executionBoundary.redesignAfterPredictorExposure).toBe(
      false,
    );
    expect(contract.executionBoundary.executionOnlyNextAction).toBe(
      "EXECUTE_FUNCTIONAL_MANIFESTATION_EXPERIMENT_V0_1",
    );
    expect(contract.executionBoundary.productionPromotion).toBe(false);
    expect(contract.executionBoundary.causalOrSemanticClaim).toBe(false);
  });
});
