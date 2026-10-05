export const FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_PREREGISTRATION_V0_1" as const;

export const FUNCTIONAL_MANIFESTATION_PREREGISTRATION_VERSION_V0_1 =
  "0.1" as const;

export const FUNCTIONAL_MANIFESTATION_PREREGISTRATION_STATUS_V0_1 =
  "FROZEN_PREREGISTRATION_CONTRACT_ONLY" as const;

export const FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_V0_1 = Object.freeze({
  contractId: FUNCTIONAL_MANIFESTATION_PREREGISTRATION_CONTRACT_ID_V0_1,
  version: FUNCTIONAL_MANIFESTATION_PREREGISTRATION_VERSION_V0_1,
  status: FUNCTIONAL_MANIFESTATION_PREREGISTRATION_STATUS_V0_1,
  claimBoundary: "BOUNDED_WITHIN_FROZEN_ENGLISH_POPULATION_ASSOCIATION_ONLY",
  frozenInputs: Object.freeze({
    stageA: Object.freeze({
      path: "/tmp/open-instrument-functional-outcome-stage-a-v0.1.json",
      bytes: 41648123,
      sha256:
        "c0953894a677696761bab73bfc10af0ea1f8cefccee428b158477186459f61c3",
    }),
    stageB: Object.freeze({
      path: "/tmp/open-instrument-functional-outcome-stage-b-v0.1.json",
      bytes: 1266368,
      sha256:
        "dbc689de4dce6411b9b066fd058d0282580d7c5c67515c4943d25831bc7c6845",
    }),
    directDistribution: Object.freeze({
      path: "/tmp/open-instrument-functional-outcome-stage-b-direct-distribution.json",
      sha256:
        "36fc1d522f95e6b07068434828baec773d340f6190b3e33b92e69da06ecc20e6",
    }),
    canonicalVoicePopulation: Object.freeze({
      path: "/tmp/open-instrument-canonical-voice-population-v0.1.jsonl",
      bytes: 14777467,
      sha256:
        "949c682dfc2bfb6de127b053452411652444971e00706babf9be050fce5aa194",
    }),
    structuralPopulation: Object.freeze({
      path:
        "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/result.json.gz",
      bytes: 11062103,
      sha256:
        "ce3d9c9ca3535176c169f45e076736af3cc254b415428d7201fd2a3f24d24f46",
    }),
  }),
  frozenGeometry: Object.freeze({
    sourceMatchedForms: 94632,
    distinctDirectMatchForms: 3678,
    directMatchPropertyObservations: 5077,
    propertyIdsTotal: 44,
    propertyIdsNonzero: 38,
    propertyIdsZero: 6,
    totalVoiceGroups: 3698,
    candidateVariationVoiceGroupsBeforeVariantPolicy: 295,
  }),
  observationalIndependence: Object.freeze({
    independentUnit: "NORMALIZED_LEXICAL_FORM_IDENTITY",
    sourceRecordPosSense: "EVIDENCE_ONLY_AGGREGATED_WITHOUT_WEIGHTING",
    pronunciationVariantPolicy:
      "RETAIN_ONLY_FORMS_WITH_EXACTLY_ONE_ELIGIBLE_PRONUNCIATION_VARIANT",
    voicePathPolicy:
      "RETAIN_ONLY_FORMS_WITH_EXACTLY_ONE_CANONICAL_VOICE_PATH",
    multiVariantPolicy: "EXCLUDE_WITHOUT_WINNER_SELECTION",
    multiVoicePathPolicy: "EXCLUDE_WITHOUT_WINNER_SELECTION",
    propertyObservationPolicy:
      "SORTED_UNIQUE_DIRECT_PROPERTY_IDS_PER_FORM_WITH_UNRESOLVED_EVIDENCE_FLAG",
    pseudoreplicationPrevention:
      "ONE_FORM_ONE_UNIT; SOURCE_SENSES_AND_PROPERTY_MATCHES_DO_NOT_ADD_UNITS",
  }),
  outcomeDesign: Object.freeze({
    representation:
      "EXACT_MULTILABEL_OUTCOME_SIGNATURE = SORTED_DIRECT_PROPERTY_ID_SET_PLUS_UNRESOLVED_EVIDENCE_FLAG",
    directMatchRequirement: "AT_LEAST_ONE_DIRECT_PROPERTY_ID",
    unresolvedTreatment:
      "PRESERVE_AS_FLAG; NEVER_RECODE_AS_PROPERTY_NEGATIVE",
    sourceNotFoundTreatment: "EXCLUDE_AS_UNAVAILABLE; NEVER_RECODE_AS_NEGATIVE",
    zeroCountPropertyTreatment:
      "RETAIN_IN_44_PROPERTY_VOCABULARY; DESCRIPTIVE_ZERO_ONLY",
    rarePropertyTreatment:
      "RETAIN_IN_GLOBAL_SIGNATURE; NO_PROPERTY_SPECIFIC_TEST_OR_CUTOFF",
    propertyAggregation: "NO_PROPERTY_MERGING_OR_SEMANTIC_CLUSTERING",
  }),
  predictorHierarchy: Object.freeze({
    primary: "GAMMA_EXACT_FROZEN_CONFIGURATION_SIGNATURE",
    secondary: "ZC_EXACT_FROZEN_SIGNATURE_DESCRIPTIVE_ONLY",
    dependence:
      "ZC_IS_DETERMINISTIC_LOSSY_PROJECTION_OF_GAMMA; NOT_INDEPENDENT_EVIDENCE",
    valueExposureAtFreeze: false,
  }),
  withinVoiceDesign: Object.freeze({
    blocking: "EXACT_CANONICAL_VOICE_PATH",
    method: "STRATIFIED_CONDITIONAL_PERMUTATION_WITHIN_VOICE_PATH",
    statistic: "CONDITIONAL_MUTUAL_INFORMATION_GAMMA_OUTCOME_GIVEN_V",
    equivalentStatistic:
      "G_SQUARED_CONTINGENCY_STATISTIC_OVER_EXACT_OUTCOME_SIGNATURES",
    nullGeneration:
      "PERMUTE_FORM_OUTCOME_SIGNATURES_WITHIN_EACH_VOICE_BLOCK; HOLD_GAMMA_AND_BLOCKS_FIXED",
    exchangeability:
      "UNDER_NULL_FORM_OUTCOME_SIGNATURES_ARE_EXCHANGEABLE_WITHIN_V_BLOCKS",
    exchangeabilityBoundary:
      "OBSERVED_POPULATION_ONLY; NO_GENERALIZATION_BEYOND_FROZEN_SOURCE_AND_V_AUTHORITY",
    permutationCount: 10000,
    permutationSeed:
      "OPEN_INSTRUMENT_FUNCTIONAL_MANIFESTATION_V0_1_GAMMA_PRIMARY_PERMUTATION",
    effectiveSupportFailure:
      "INCONCLUSIVE_INSUFFICIENT_EFFECTIVE_SUPPORT_WHEN_PERMUTATION_IS_DEGENERATE_OR_UNCERTAINTY_IS_UNDEFINED",
  }),
  inferentialConstants: Object.freeze({
    alpha: 0.05,
    uncertaintyLevel: 0.95,
    bootstrapReplicates: 2000,
    minimumRepeatedStructuralClass: 2,
    noPowerThreshold: true,
    noPropertySupportCutoff: true,
  }),
  multipleTesting: Object.freeze({
    primaryTestCount: 1,
    secondaryInferentialTestCount: 0,
    family: "ONE_GAMMA_PRIMARY_OMNIBUS_TEST",
    correction: "NONE_REQUIRED_FOR_SINGLE_PRIMARY_TEST",
    resultDependentTestSelection: false,
  }),
  effectSize: Object.freeze({
    primary: "NORMALIZED_CONDITIONAL_MUTUAL_INFORMATION",
    uncertainty: "95_PERCENT_BLOCK_BOOTSTRAP_OVER_VOICE_GROUPS",
    interpretation:
      "PROPORTION_OF_WITHIN_V_OUTCOME_INFORMATION_ASSOCIATED_WITH_GAMMA_SIGNATURE",
  }),
  decisionSemantics: Object.freeze({
    supported:
      "SUPPORTED_BOUNDED_ASSOCIATION = ALPHA_CRITERION_AND_POSITIVE_UNCERTAINTY_BOUND_MET",
    null:
      "NULL_NO_DETECTABLE_ASSOCIATION = NONDEGENERATE_TEST_AND_ALPHA_CRITERION_NOT_MET",
    inconclusive:
      "INCONCLUSIVE_INSUFFICIENT_EFFECTIVE_SUPPORT = DEGENERATE_STRUCTURE_OR_UNDEFINED_UNCERTAINTY",
    invalid:
      "INVALID_ASSUMPTION_FAILURE = FROZEN_UNIT_BLOCK_OR_PROVENANCE_INVARIANT_BROKEN",
  }),
  executionBoundary: Object.freeze({
    gammaValuesInspectedAtFreeze: false,
    zcValuesInspectedAtFreeze: false,
    targetWordsUsed: false,
    redesignAfterPredictorExposure: false,
    executionOnlyNextAction:
      "EXECUTE_FUNCTIONAL_MANIFESTATION_EXPERIMENT_V0_1",
    productionPromotion: false,
    causalOrSemanticClaim: false,
  }),
} as const);
