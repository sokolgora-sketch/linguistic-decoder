import type { AnalysisStatusCodeV0_1 } from "../analysisStatus.v0_1";
import {
  isSevenVoiceKey,
  type SevenVoiceKey,
} from "../sevenVoiceOrderedViews.v0.1";
import {
  COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1,
  COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1,
  COMPARATIVE_INTERACTION_AUTHORITY_V0_1,
  COMPARATIVE_I_TO_U_STATUS_V0_1,
  COMPARATIVE_MODEL_IDS_V0_1,
  COMPARATIVE_U_TO_I_STATUS_V0_1,
  type ComparativeCircularityStatusV0_1,
  type ComparativeControlCategoryV0_1,
  type ComparativeModelIdV0_1,
  type ComparativeProvenanceKindV0_1,
  type ComparativeSplitV0_1,
} from "./functionalRoleComparativeEvaluationContract.v0_1";

export const FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SCHEMA_V0_1 =
  "open-instrument.functional-role-comparative-evaluation-corpus.v0_1" as const;
export const FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_ID_V0_1 =
  "open-instrument.functional-role-comparative-evaluation-corpus.v0_1" as const;
export const FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_VERSION_V0_1 =
  "open-instrument.functional-role-comparative-evaluation-corpus.v1" as const;
export const FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SOURCE_V0_1 =
  "open-instrument.analysis-capability-baseline.v1.manifest.json" as const;
export const FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_CASE_COUNT_V0_1 =
  57 as const;

const CANONICAL_BASELINE_STATUS_CODES_V0_1 = [
  "reviewed_functional_evidence",
  "research_functional_hypothesis",
  "candidate_only",
  "structural_unreviewed",
  "null_no_supported_candidate",
] as const satisfies readonly AnalysisStatusCodeV0_1[];

const CASE_CONTROL_CATEGORIES_V0_1 = [
  "NULL_CONTROL",
  "AMBIGUITY_CONTROL",
  "TARGET_SENSE_CONTROL",
  "MULTI_CANDIDATE_CONTROL",
  "MODEL_DIVERGENCE_CONTROL",
  "GENERAL_CASE",
] as const satisfies readonly ComparativeControlCategoryV0_1[];

const SPLITS_V0_1 = ["DEVELOPMENT", "HELD_OUT", "CONTROL"] as const;
const PROVENANCE_KINDS_V0_1 = [
  "INDEPENDENT",
  "REVIEWED_EXISTING_EVIDENCE",
  "RESEARCH_EXISTING_EVIDENCE",
  "FIXTURE_AUTHORED",
  "CANONICAL_AUTHORED",
  "TARGET_SENSE_AUTHORED",
  "SYNTHETIC",
  "UNKNOWN",
] as const;
const CIRCULARITY_STATUSES_V0_1 = [
  "INDEPENDENT_SIGNAL",
  "PARTIALLY_CIRCULAR",
  "CIRCULAR",
  "UNKNOWN",
] as const;

type TargetSenseIndependenceV0_1 =
  | "INDEPENDENT"
  | "NONINDEPENDENT"
  | "UNKNOWN"
  | "NOT_APPLICABLE";

type NullExpectationV0_1 =
  | "INDEPENDENTLY_EXPECTED_NULL"
  | "INDEPENDENTLY_EXPECTED_NON_NULL"
  | "UNKNOWN_EXPECTED_NULLNESS"
  | "NOT_APPLICABLE";

type NullExpectationProvenanceV0_1 =
  | ComparativeProvenanceKindV0_1
  | "NOT_APPLICABLE";

type EligibilityReasonV0_1 =
  | "GENERAL_CASE_PREREGISTRATION"
  | "CONTROL_CASE_NOT_PRIMARY_COMPARATIVE_DENOMINATOR";

export type ComparativeCorpusTargetSenseV0_1 = Readonly<{
  id: string | null;
  label: string | null;
  provenance: ComparativeProvenanceKindV0_1;
  independence: Exclude<TargetSenseIndependenceV0_1, "NOT_APPLICABLE">;
  sourceRef: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SOURCE_V0_1;
  predatesComparativeEvaluation: true;
}>;

export type FunctionalRoleComparativeEvaluationCorpusCaseV0_1 = Readonly<{
  caseOrdinal: number;
  caseId: string;
  sourceCorpus: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SOURCE_V0_1;
  input: Readonly<{
    word: string;
    language: "en";
    category: string;
  }>;
  structuralVoicePath: readonly SevenVoiceKey[];
  caseKind: "GENERAL_CASE" | "CONTROL_CASE";
  controlCategories: readonly ComparativeControlCategoryV0_1[];
  split: ComparativeSplitV0_1;
  evaluationEligibility: "ELIGIBLE" | "INELIGIBLE";
  eligibilityReason: EligibilityReasonV0_1;
  caseProvenance: ComparativeProvenanceKindV0_1;
  caseCircularity: ComparativeCircularityStatusV0_1;
  targetSense?: ComparativeCorpusTargetSenseV0_1;
  targetSenseIndependence: TargetSenseIndependenceV0_1;
  observedCandidateCount: number;
  observedNull: boolean;
  observedStatus: AnalysisStatusCodeV0_1;
  nullExpectation: NullExpectationV0_1;
  nullExpectationProvenance: NullExpectationProvenanceV0_1;
  inclusionRationale: string;
}>;

export type FunctionalRoleComparativeEvaluationCorpusV0_1 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SCHEMA_V0_1;
  corpusId: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_ID_V0_1;
  corpusVersion: typeof FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_VERSION_V0_1;
  preregistrationStatus: "FROZEN_BEFORE_COMPARATIVE_EXECUTION";
  comparativeResultsGenerated: false;
  modelWinnerPresent: false;
  modelIds: readonly ComparativeModelIdV0_1[];
  fPEquivalenceStatus: typeof COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1;
  interactionAuthorityPresent: typeof COMPARATIVE_INTERACTION_AUTHORITY_V0_1;
  genericPathCompositionStatus: typeof COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1;
  uToIStatus: typeof COMPARATIVE_U_TO_I_STATUS_V0_1;
  iToUStatus: typeof COMPARATIVE_I_TO_U_STATUS_V0_1;
  orderingPolicy: "BASELINE_MANIFEST_ORDER_V1";
  selectionPolicy: string;
  heldOutPolicy: string;
  controlPolicy: string;
  targetSenseIndependencePolicy: string;
  nullControlPolicy: string;
  circularityPolicy: string;
  vocabularyNeutralityPolicy: string;
  structuralOrderSemanticDirectionBoundary: "PRESERVED";
  cases: readonly FunctionalRoleComparativeEvaluationCorpusCaseV0_1[];
}>;

type RawCorpusCaseV0_1 = Readonly<{
  caseId: string;
  word: string;
  category: string;
  structuralVoicePath: readonly SevenVoiceKey[];
  split: ComparativeSplitV0_1;
  controlCategories: readonly ComparativeControlCategoryV0_1[];
  evaluationEligibility: "ELIGIBLE" | "INELIGIBLE";
  observedCandidateCount: number;
  observedNull: boolean;
  observedStatus: AnalysisStatusCodeV0_1;
  nullExpectation: NullExpectationV0_1;
  inclusionRationale: string;
  targetSense?: Readonly<{
    id: string | null;
    label: string | null;
  }>;
}>;

const RAW_CORPUS_CASES_V0_1: readonly RawCorpusCaseV0_1[] = [
  { caseId: "canonical.study", word: "study", category: "canonical", structuralVoicePath: ["U", "Y"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 4, observedNull: false, observedStatus: "reviewed_functional_evidence", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "canonical.damage", word: "damage", category: "canonical", structuralVoicePath: ["A", "E"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "reviewed_functional_evidence", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "canonical.mystery", word: "mystery", category: "canonical", structuralVoicePath: ["Y", "E", "Y"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "canonical.water", word: "water", category: "canonical", structuralVoicePath: ["A", "E"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "target-sense.candle", word: "candle", category: "target_sense", structuralVoicePath: ["A", "E"], split: "CONTROL", controlCategories: ["TARGET_SENSE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "structural_unreviewed", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing target-sense case retained as a provenance control; it is not independent target-sense evidence.", targetSense: { id: null, label: "a wax light source" } },
  { caseId: "target-sense.water-physical-liquid", word: "water", category: "target_sense", structuralVoicePath: ["A", "E"], split: "CONTROL", controlCategories: ["TARGET_SENSE_CONTROL", "MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing target-sense case retained as a provenance control; it is not independent target-sense evidence. Pre-existing multi-candidate case retained without selecting a candidate winner.", targetSense: { id: "physical_water_liquid", label: null } },
  { caseId: "null.xyz", word: "xyz", category: "null_control", structuralVoicePath: ["Y"], split: "CONTROL", controlCategories: ["NULL_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing explicit Null fixture retained to test unknown Null expectation; engine Null is not treated as correct Null." },
  { caseId: "scale50.rain.nature", word: "rain", category: "nature", structuralVoicePath: ["A", "Ë"], split: "HELD_OUT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case selected by a fixed structural-stratum rule before comparative results." },
  { caseId: "scale50.river.nature", word: "river", category: "nature", structuralVoicePath: ["I", "E"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.mountain.nature", word: "mountain", category: "nature", structuralVoicePath: ["O", "U", "A", "I"], split: "HELD_OUT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case selected by a fixed structural-stratum rule before comparative results." },
  { caseId: "scale50.stone.nature", word: "stone", category: "nature", structuralVoicePath: ["O", "E"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.tree.nature", word: "tree", category: "nature", structuralVoicePath: ["E"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.wind.nature", word: "wind", category: "nature", structuralVoicePath: ["I"], split: "HELD_OUT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case selected by a fixed structural-stratum rule before comparative results." },
  { caseId: "scale50.sea.nature", word: "sea", category: "nature", structuralVoicePath: ["E", "A"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.sky.nature", word: "sky", category: "nature", structuralVoicePath: ["Y"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.snow.nature", word: "snow", category: "nature", structuralVoicePath: ["O"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.cloud.nature", word: "cloud", category: "nature", structuralVoicePath: ["O", "U"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 4, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.hand.body", word: "hand", category: "body", structuralVoicePath: ["A"], split: "HELD_OUT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case selected by a fixed structural-stratum rule before comparative results." },
  { caseId: "scale50.head.body", word: "head", category: "body", structuralVoicePath: ["E", "A"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.heart.body", word: "heart", category: "body", structuralVoicePath: ["E", "A"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.blood.body", word: "blood", category: "body", structuralVoicePath: ["O"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.bone.body", word: "bone", category: "body", structuralVoicePath: ["O", "E"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.skin.body", word: "skin", category: "body", structuralVoicePath: ["I"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.mouth.body", word: "mouth", category: "body", structuralVoicePath: ["O", "U"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.ear.body", word: "ear", category: "body", structuralVoicePath: ["E", "A"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.nose.body", word: "nose", category: "body", structuralVoicePath: ["O", "E"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.foot.body", word: "foot", category: "body", structuralVoicePath: ["O"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.run.action", word: "run", category: "action", structuralVoicePath: ["U"], split: "HELD_OUT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case selected by a fixed structural-stratum rule before comparative results." },
  { caseId: "scale50.walk.action", word: "walk", category: "action", structuralVoicePath: ["A"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.speak.action", word: "speak", category: "action", structuralVoicePath: ["E", "A"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 3, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.hear.action", word: "hear", category: "action", structuralVoicePath: ["E", "A"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.eat.action", word: "eat", category: "action", structuralVoicePath: ["E", "A"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.drink.action", word: "drink", category: "action", structuralVoicePath: ["I"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.sleep.action", word: "sleep", category: "action", structuralVoicePath: ["E"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 4, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.build.action", word: "build", category: "action", structuralVoicePath: ["U", "Ë"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.break.action", word: "break", category: "action", structuralVoicePath: ["E", "A"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 4, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.carry.action", word: "carry", category: "action", structuralVoicePath: ["A", "Y"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.truth.abstract", word: "truth", category: "abstract", structuralVoicePath: ["U"], split: "HELD_OUT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case selected by a fixed structural-stratum rule before comparative results." },
  { caseId: "scale50.time.abstract", word: "time", category: "abstract", structuralVoicePath: ["I", "E"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.life.abstract", word: "life", category: "abstract", structuralVoicePath: ["I", "E"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.death.abstract", word: "death", category: "abstract", structuralVoicePath: ["E", "A"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.mind.abstract", word: "mind", category: "abstract", structuralVoicePath: ["I"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.memory.abstract", word: "memory", category: "abstract", structuralVoicePath: ["E", "O", "Y"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.freedom.abstract", word: "freedom", category: "abstract", structuralVoicePath: ["E", "Ë"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.justice.abstract", word: "justice", category: "abstract", structuralVoicePath: ["U", "I", "E"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.order.abstract", word: "order", category: "abstract", structuralVoicePath: ["O", "E"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.change.abstract", word: "change", category: "abstract", structuralVoicePath: ["A", "E"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 4, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.mother.human-social", word: "mother", category: "human_social", structuralVoicePath: ["E", "E"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.child.human-social", word: "child", category: "human_social", structuralVoicePath: ["I"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.friend.human-social", word: "friend", category: "human_social", structuralVoicePath: ["I"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 4, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.home.human-social", word: "home", category: "human_social", structuralVoicePath: ["O", "E"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.work.human-social", word: "work", category: "human_social", structuralVoicePath: ["O"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 0, observedNull: true, observedStatus: "null_no_supported_candidate", nullExpectation: "UNKNOWN_EXPECTED_NULLNESS", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.war.human-social", word: "war", category: "human_social", structuralVoicePath: ["A"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.peace.human-social", word: "peace", category: "human_social", structuralVoicePath: ["E", "A", "E"], split: "HELD_OUT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case selected by a fixed structural-stratum rule before comparative results." },
  { caseId: "scale50.king.human-social", word: "king", category: "human_social", structuralVoicePath: ["I"], split: "DEVELOPMENT", controlCategories: [], evaluationEligibility: "ELIGIBLE", observedCandidateCount: 1, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing baseline case retained by baseline-manifest membership before comparative results." },
  { caseId: "scale50.woman.human-social", word: "woman", category: "human_social", structuralVoicePath: ["A", "A"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
  { caseId: "scale50.man.human-social", word: "man", category: "human_social", structuralVoicePath: ["A"], split: "CONTROL", controlCategories: ["MULTI_CANDIDATE_CONTROL"], evaluationEligibility: "INELIGIBLE", observedCandidateCount: 2, observedNull: false, observedStatus: "research_functional_hypothesis", nullExpectation: "NOT_APPLICABLE", inclusionRationale: "Pre-existing multi-candidate case retained without selecting a candidate winner." },
];

function deepFreezeV0_1<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      deepFreezeV0_1(child);
    }
  }
  return value;
}

function buildCorpusCaseV0_1(
  definition: RawCorpusCaseV0_1,
  caseOrdinal: number,
): FunctionalRoleComparativeEvaluationCorpusCaseV0_1 {
  const hasTargetSense = definition.targetSense !== undefined;
  return {
    caseOrdinal,
    caseId: definition.caseId,
    sourceCorpus: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SOURCE_V0_1,
    input: {
      word: definition.word,
      language: "en",
      category: definition.category,
    },
    structuralVoicePath: [...definition.structuralVoicePath],
    caseKind: definition.controlCategories.length > 0 ? "CONTROL_CASE" : "GENERAL_CASE",
    controlCategories: [...definition.controlCategories],
    split: definition.split,
    evaluationEligibility: definition.evaluationEligibility,
    eligibilityReason: definition.evaluationEligibility === "ELIGIBLE"
      ? "GENERAL_CASE_PREREGISTRATION"
      : "CONTROL_CASE_NOT_PRIMARY_COMPARATIVE_DENOMINATOR",
    caseProvenance: "FIXTURE_AUTHORED",
    caseCircularity: "UNKNOWN",
    ...(hasTargetSense
      ? {
          targetSense: {
            id: definition.targetSense?.id ?? null,
            label: definition.targetSense?.label ?? null,
            provenance: "FIXTURE_AUTHORED" as const,
            independence: "UNKNOWN" as const,
            sourceRef: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SOURCE_V0_1,
            predatesComparativeEvaluation: true as const,
          },
        }
      : {}),
    targetSenseIndependence: hasTargetSense ? "UNKNOWN" : "NOT_APPLICABLE",
    observedCandidateCount: definition.observedCandidateCount,
    observedNull: definition.observedNull,
    observedStatus: definition.observedStatus,
    nullExpectation: definition.nullExpectation,
    nullExpectationProvenance: definition.nullExpectation === "UNKNOWN_EXPECTED_NULLNESS"
      ? "FIXTURE_AUTHORED"
      : definition.nullExpectation === "NOT_APPLICABLE"
        ? "NOT_APPLICABLE"
        : "INDEPENDENT",
    inclusionRationale: definition.inclusionRationale,
  };
}

export const FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1 =
  deepFreezeV0_1<FunctionalRoleComparativeEvaluationCorpusV0_1>({
    schemaVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SCHEMA_V0_1,
    corpusId: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_ID_V0_1,
    corpusVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_VERSION_V0_1,
    preregistrationStatus: "FROZEN_BEFORE_COMPARATIVE_EXECUTION",
    comparativeResultsGenerated: false,
    modelWinnerPresent: false,
    modelIds: [...COMPARATIVE_MODEL_IDS_V0_1],
    fPEquivalenceStatus: COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1,
    interactionAuthorityPresent: COMPARATIVE_INTERACTION_AUTHORITY_V0_1,
    genericPathCompositionStatus: COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1,
    uToIStatus: COMPARATIVE_U_TO_I_STATUS_V0_1,
    iToUStatus: COMPARATIVE_I_TO_U_STATUS_V0_1,
    orderingPolicy: "BASELINE_MANIFEST_ORDER_V1",
    selectionPolicy: "Select existing baseline manifest membership before any F/P/M result exists; do not tune inclusion after comparison.",
    heldOutPolicy: "Use the seven explicit baseline IDs marked HELD_OUT to cover single, two, and 3+ Voice paths, candidate-bearing and observed-Null cases, and varied Voice composition.",
    controlPolicy: "Retain target-sense, explicit Null, and pre-existing multi-candidate controls without selecting a semantic or candidate winner; no ambiguity or model-divergence control is manufactured.",
    targetSenseIndependencePolicy: "The baseline does not establish independent target-sense provenance; target-sense cases remain UNKNOWN and are not independent target-sense evidence.",
    nullControlPolicy: "An observed engine Null is not an independently expected Null; independent Null/non-Null expectations require the #1944 provenance gate and are absent here.",
    circularityPolicy: "Baseline fixture provenance is recorded as FIXTURE_AUTHORED and circularity remains UNKNOWN unless independent evidence is added in a later execution lane.",
    vocabularyNeutralityPolicy: "Case selection uses pre-existing baseline identity, structural metadata, controls, and provenance only; it does not privilege F, P, M, presentation labels, or legacy vocabulary.",
    structuralOrderSemanticDirectionBoundary: "PRESERVED",
    cases: RAW_CORPUS_CASES_V0_1.map((definition, index) =>
      buildCorpusCaseV0_1(definition, index + 1),
    ),
  });

const isRecordV0_1 = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasOnlyKnownKeysV0_1 = (
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean => Object.keys(value).every((key) => keys.includes(key));

const isOneOfV0_1 = <T extends string>(value: unknown, values: readonly T[]) =>
  typeof value === "string" && values.includes(value as T);

const isUniqueStringArrayV0_1 = (value: unknown): value is readonly string[] =>
  Array.isArray(value) &&
  value.every((item) => typeof item === "string") &&
  new Set(value).size === value.length;

function validateTargetSenseV0_1(value: unknown): boolean {
  return (
    isRecordV0_1(value) &&
    hasOnlyKnownKeysV0_1(value, [
      "id",
      "label",
      "provenance",
      "independence",
      "sourceRef",
      "predatesComparativeEvaluation",
    ]) &&
    (value.id === null || typeof value.id === "string") &&
    (value.label === null || typeof value.label === "string") &&
    isOneOfV0_1(value.provenance, PROVENANCE_KINDS_V0_1) &&
    (value.independence === "INDEPENDENT" ||
      value.independence === "NONINDEPENDENT" ||
      value.independence === "UNKNOWN") &&
    value.sourceRef === FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SOURCE_V0_1 &&
    value.predatesComparativeEvaluation === true &&
    !(value.independence === "INDEPENDENT" && value.provenance !== "INDEPENDENT")
  );
}

function validateCorpusCaseV0_1(value: unknown): boolean {
  if (
    !isRecordV0_1(value) ||
    !hasOnlyKnownKeysV0_1(value, [
      "caseOrdinal",
      "caseId",
      "sourceCorpus",
      "input",
      "structuralVoicePath",
      "caseKind",
      "controlCategories",
      "split",
      "evaluationEligibility",
      "eligibilityReason",
      "caseProvenance",
      "caseCircularity",
      "targetSense",
      "targetSenseIndependence",
      "observedCandidateCount",
      "observedNull",
      "observedStatus",
      "nullExpectation",
      "nullExpectationProvenance",
      "inclusionRationale",
    ])
  ) {
    return false;
  }
  const input = value.input;
  const path = value.structuralVoicePath;
  const controls = value.controlCategories;
  const hasTargetSense = value.targetSense !== undefined;
  if (
    typeof value.caseOrdinal !== "number" ||
    !Number.isInteger(value.caseOrdinal) ||
    value.caseOrdinal < 1 ||
    typeof value.caseId !== "string" ||
    value.caseId.length === 0 ||
    value.sourceCorpus !== FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SOURCE_V0_1 ||
    !isRecordV0_1(input) ||
    !hasOnlyKnownKeysV0_1(input, ["word", "language", "category"]) ||
    typeof input.word !== "string" ||
    input.word.length === 0 ||
    input.language !== "en" ||
    typeof input.category !== "string" ||
    input.category.length === 0 ||
    !Array.isArray(path) ||
    path.length === 0 ||
    !path.every(isSevenVoiceKey) ||
    !Array.isArray(controls) ||
    !isUniqueStringArrayV0_1(controls) ||
    !controls.every((item) => isOneOfV0_1(item, CASE_CONTROL_CATEGORIES_V0_1)) ||
    value.caseKind !== (controls.length > 0 ? "CONTROL_CASE" : "GENERAL_CASE") ||
    !isOneOfV0_1(value.split, SPLITS_V0_1) ||
    !isOneOfV0_1(value.caseProvenance, PROVENANCE_KINDS_V0_1) ||
    !isOneOfV0_1(value.caseCircularity, CIRCULARITY_STATUSES_V0_1) ||
    !isOneOfV0_1(value.observedStatus, CANONICAL_BASELINE_STATUS_CODES_V0_1) ||
    typeof value.observedCandidateCount !== "number" ||
    !Number.isInteger(value.observedCandidateCount) ||
    value.observedCandidateCount < 0 ||
    typeof value.observedNull !== "boolean" ||
    typeof value.inclusionRationale !== "string" ||
    value.inclusionRationale.length === 0 ||
    (value.evaluationEligibility === "ELIGIBLE") !== (controls.length === 0) ||
    !isOneOfV0_1(value.evaluationEligibility, ["ELIGIBLE", "INELIGIBLE"] as const) ||
    !isOneOfV0_1(value.eligibilityReason, [
      "GENERAL_CASE_PREREGISTRATION",
      "CONTROL_CASE_NOT_PRIMARY_COMPARATIVE_DENOMINATOR",
    ] as const) ||
    (value.eligibilityReason === "GENERAL_CASE_PREREGISTRATION") !==
      (controls.length === 0) ||
    (value.split === "CONTROL") !== (controls.length > 0) ||
    (value.split === "HELD_OUT" && controls.length > 0) ||
    (hasTargetSense && !validateTargetSenseV0_1(value.targetSense)) ||
    (!hasTargetSense && value.targetSenseIndependence !== "NOT_APPLICABLE") ||
    (hasTargetSense && value.targetSenseIndependence === "NOT_APPLICABLE") ||
    !isOneOfV0_1(value.targetSenseIndependence, [
      "INDEPENDENT",
      "NONINDEPENDENT",
      "UNKNOWN",
      "NOT_APPLICABLE",
    ] as const) ||
    !isOneOfV0_1(value.nullExpectation, [
      "INDEPENDENTLY_EXPECTED_NULL",
      "INDEPENDENTLY_EXPECTED_NON_NULL",
      "UNKNOWN_EXPECTED_NULLNESS",
      "NOT_APPLICABLE",
    ] as const) ||
    !isOneOfV0_1(value.nullExpectationProvenance, [
      ...PROVENANCE_KINDS_V0_1,
      "NOT_APPLICABLE",
    ] as const)
  ) {
    return false;
  }
  if (
    value.nullExpectation === "NOT_APPLICABLE" &&
    value.nullExpectationProvenance !== "NOT_APPLICABLE"
  ) {
    return false;
  }
  if (
    value.nullExpectation !== "NOT_APPLICABLE" &&
    value.nullExpectationProvenance === "NOT_APPLICABLE"
  ) {
    return false;
  }
  if (
    (value.nullExpectation === "INDEPENDENTLY_EXPECTED_NULL" ||
      value.nullExpectation === "INDEPENDENTLY_EXPECTED_NON_NULL") &&
    value.nullExpectationProvenance !== "INDEPENDENT"
  ) {
    return false;
  }
  if (
    value.nullExpectation === "UNKNOWN_EXPECTED_NULLNESS" &&
    value.nullExpectationProvenance === "INDEPENDENT"
  ) {
    return false;
  }
  if (
    controls.includes("NULL_CONTROL") &&
    value.nullExpectation !== "UNKNOWN_EXPECTED_NULLNESS"
  ) {
    return false;
  }
  return true;
}

export type FunctionalRoleComparativeEvaluationCorpusValidationV0_1 = Readonly<{
  ok: boolean;
  reasonCodes: readonly string[];
}>;

export function validateFunctionalRoleComparativeEvaluationCorpusV0_1(
  value: unknown,
): FunctionalRoleComparativeEvaluationCorpusValidationV0_1 {
  const failures: string[] = [];
  if (
    !isRecordV0_1(value) ||
    !hasOnlyKnownKeysV0_1(value, [
      "schemaVersion",
      "corpusId",
      "corpusVersion",
      "preregistrationStatus",
      "comparativeResultsGenerated",
      "modelWinnerPresent",
      "modelIds",
      "fPEquivalenceStatus",
      "interactionAuthorityPresent",
      "genericPathCompositionStatus",
      "uToIStatus",
      "iToUStatus",
      "orderingPolicy",
      "selectionPolicy",
      "heldOutPolicy",
      "controlPolicy",
      "targetSenseIndependencePolicy",
      "nullControlPolicy",
      "circularityPolicy",
      "vocabularyNeutralityPolicy",
      "structuralOrderSemanticDirectionBoundary",
      "cases",
    ])
  ) {
    failures.push("CORPUS_OBJECT_INVALID");
  } else {
    if (value.schemaVersion !== FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SCHEMA_V0_1) failures.push("SCHEMA_VERSION_INVALID");
    if (value.corpusId !== FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_ID_V0_1) failures.push("CORPUS_ID_INVALID");
    if (value.corpusVersion !== FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_VERSION_V0_1) failures.push("CORPUS_VERSION_INVALID");
    if (value.preregistrationStatus !== "FROZEN_BEFORE_COMPARATIVE_EXECUTION") failures.push("PREREGISTRATION_STATUS_INVALID");
    if (value.comparativeResultsGenerated !== false) failures.push("COMPARATIVE_RESULTS_PRESENT");
    if (value.modelWinnerPresent !== false) failures.push("MODEL_WINNER_PRESENT");
    if (JSON.stringify(value.modelIds) !== JSON.stringify(COMPARATIVE_MODEL_IDS_V0_1)) failures.push("MODEL_IDS_INVALID");
    if (value.fPEquivalenceStatus !== COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1) failures.push("F_P_EQUIVALENCE_INVALID");
    if (value.interactionAuthorityPresent !== COMPARATIVE_INTERACTION_AUTHORITY_V0_1) failures.push("INTERACTION_AUTHORITY_INVALID");
    if (value.genericPathCompositionStatus !== COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1) failures.push("PATH_COMPOSITION_INVALID");
    if (value.uToIStatus !== COMPARATIVE_U_TO_I_STATUS_V0_1) failures.push("U_TO_I_INVALID");
    if (value.iToUStatus !== COMPARATIVE_I_TO_U_STATUS_V0_1) failures.push("I_TO_U_INVALID");
    if (value.orderingPolicy !== "BASELINE_MANIFEST_ORDER_V1") failures.push("ORDERING_POLICY_INVALID");
    for (const field of ["selectionPolicy", "heldOutPolicy", "controlPolicy", "targetSenseIndependencePolicy", "nullControlPolicy", "circularityPolicy", "vocabularyNeutralityPolicy"]) {
      if (typeof value[field] !== "string" || value[field].length === 0) failures.push("POLICY_INVALID");
    }
    if (value.structuralOrderSemanticDirectionBoundary !== "PRESERVED") failures.push("STRUCTURAL_DIRECTION_BOUNDARY_INVALID");
    if (!Array.isArray(value.cases) || value.cases.length !== FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_CASE_COUNT_V0_1) {
      failures.push("CASE_COUNT_INVALID");
    } else {
      const ids = value.cases.map((item) => isRecordV0_1(item) ? item.caseId : "");
      if (new Set(ids).size !== ids.length) failures.push("DUPLICATE_CASE_ID");
      value.cases.forEach((item, index) => {
        if (!validateCorpusCaseV0_1(item)) failures.push("CASE_INVALID");
        if (isRecordV0_1(item) && item.caseOrdinal !== index + 1) failures.push("CASE_ORDER_INVALID");
      });
    }
  }
  return { ok: failures.length === 0, reasonCodes: [...new Set(failures)] };
}

export function getFunctionalRoleComparativeEvaluationCorpusV0_1(): FunctionalRoleComparativeEvaluationCorpusV0_1 {
  return FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1;
}
