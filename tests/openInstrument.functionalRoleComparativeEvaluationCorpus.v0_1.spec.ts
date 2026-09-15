import {
  COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1,
  COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1,
  COMPARATIVE_INTERACTION_AUTHORITY_V0_1,
  COMPARATIVE_I_TO_U_STATUS_V0_1,
  COMPARATIVE_MODEL_IDS_V0_1,
  COMPARATIVE_U_TO_I_STATUS_V0_1,
} from "../src/shared/openInstrument/functionalRoleComparativeEvaluationContract.v0_1";
import {
  FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_CASE_COUNT_V0_1,
  FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_ID_V0_1,
  FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SCHEMA_V0_1,
  FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1,
  FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_VERSION_V0_1,
  getFunctionalRoleComparativeEvaluationCorpusV0_1,
  validateFunctionalRoleComparativeEvaluationCorpusV0_1,
} from "../src/shared/openInstrument/functionalRoleComparativeEvaluationCorpus.v0_1";

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const allKeys = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(allKeys);
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => [key, ...allKeys(child)]);
};

describe("functional role comparative evaluation corpus v0.1", () => {
  test("freezes a stable preregistration identity before comparison", () => {
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.schemaVersion).toBe(
      FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_SCHEMA_V0_1,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.corpusId).toBe(
      FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_ID_V0_1,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.corpusVersion).toBe(
      FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_VERSION_V0_1,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.preregistrationStatus).toBe(
      "FROZEN_BEFORE_COMPARATIVE_EXECUTION",
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.comparativeResultsGenerated).toBe(
      false,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.modelWinnerPresent).toBe(
      false,
    );
  });

  test("reuses the hardened F/P/M boundary without scoring models", () => {
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.modelIds).toEqual(
      COMPARATIVE_MODEL_IDS_V0_1,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.fPEquivalenceStatus).toBe(
      COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.interactionAuthorityPresent).toBe(
      COMPARATIVE_INTERACTION_AUTHORITY_V0_1,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.genericPathCompositionStatus).toBe(
      COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.uToIStatus).toBe(
      COMPARATIVE_U_TO_I_STATUS_V0_1,
    );
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.iToUStatus).toBe(
      COMPARATIVE_I_TO_U_STATUS_V0_1,
    );
    expect(allKeys(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1)).not.toContain(
      "modelJudgments",
    );
  });

  test("contains all 57 baseline cases in deterministic manifest order", () => {
    const cases = FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases;
    expect(cases).toHaveLength(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_CASE_COUNT_V0_1);
    expect(cases.map((item) => item.caseOrdinal)).toEqual(
      cases.map((_, index) => index + 1),
    );
    expect(new Set(cases.map((item) => item.caseId)).size).toBe(cases.length);
    expect(getFunctionalRoleComparativeEvaluationCorpusV0_1()).toEqual(
      FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1,
    );
    expect(validateFunctionalRoleComparativeEvaluationCorpusV0_1(
      FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1,
    ).ok).toBe(true);
  });

  test("uses the preregistered split and control counts", () => {
    const cases = FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases;
    expect(cases.filter((item) => item.split === "DEVELOPMENT")).toHaveLength(20);
    expect(cases.filter((item) => item.split === "HELD_OUT")).toHaveLength(7);
    expect(cases.filter((item) => item.split === "CONTROL")).toHaveLength(30);
    expect(cases.filter((item) => item.controlCategories.includes("TARGET_SENSE_CONTROL"))).toHaveLength(2);
    expect(cases.filter((item) => item.controlCategories.includes("NULL_CONTROL"))).toHaveLength(1);
    expect(cases.filter((item) => item.controlCategories.includes("MULTI_CANDIDATE_CONTROL"))).toHaveLength(28);
    expect(cases.filter((item) => item.controlCategories.includes("AMBIGUITY_CONTROL"))).toHaveLength(0);
    expect(cases.filter((item) => item.controlCategories.includes("MODEL_DIVERGENCE_CONTROL"))).toHaveLength(0);
  });

  test("preserves canonical seven-Voice paths, including Y and repeated paths", () => {
    const cases = FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases;
    expect(cases.every((item) => item.structuralVoicePath.length > 0)).toBe(true);
    expect(cases.some((item) => item.structuralVoicePath.includes("Y"))).toBe(true);
    expect(cases.some((item) => new Set(item.structuralVoicePath).size < item.structuralVoicePath.length)).toBe(true);
    const invalid = clone(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1) as any;
    invalid.cases[0].structuralVoicePath = ["Ẽ"];
    expect(validateFunctionalRoleComparativeEvaluationCorpusV0_1(invalid).ok).toBe(false);
  });

  test("records target-sense provenance without claiming independence", () => {
    const targetCases = FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases.filter(
      (item) => item.targetSense !== undefined,
    );
    expect(targetCases).toHaveLength(2);
    expect(targetCases.every((item) => item.targetSenseIndependence === "UNKNOWN")).toBe(true);
    expect(targetCases.every((item) => item.targetSense?.provenance === "FIXTURE_AUTHORED")).toBe(true);
    expect(targetCases.every((item) => item.evaluationEligibility === "INELIGIBLE")).toBe(true);
  });

  test("does not infer correct Null from an observed engine Null", () => {
    const nullCases = FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases.filter(
      (item) => item.observedNull,
    );
    expect(nullCases).toHaveLength(13);
    expect(nullCases.every((item) => item.nullExpectation === "UNKNOWN_EXPECTED_NULLNESS")).toBe(true);
    expect(nullCases.every((item) => item.nullExpectationProvenance === "FIXTURE_AUTHORED")).toBe(true);
    const xyz = nullCases.find((item) => item.caseId === "null.xyz");
    expect(xyz?.controlCategories).toEqual(["NULL_CONTROL"]);
    const invalid = clone(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1) as any;
    invalid.cases[6].nullExpectation = "INDEPENDENTLY_EXPECTED_NULL";
    expect(validateFunctionalRoleComparativeEvaluationCorpusV0_1(invalid).ok).toBe(false);
  });

  test("keeps multi-candidate controls free of winner selection", () => {
    const controls = FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases.filter(
      (item) => item.controlCategories.includes("MULTI_CANDIDATE_CONTROL"),
    );
    expect(controls).toHaveLength(28);
    expect(controls.every((item) => item.observedCandidateCount >= 2)).toBe(true);
    expect(allKeys(controls)).not.toContain("winner");
    expect(allKeys(controls)).not.toContain("ranking");
  });

  test("keeps circularity unknown when baseline provenance cannot establish independence", () => {
    const cases = FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases;
    expect(cases.every((item) => item.caseProvenance === "FIXTURE_AUTHORED")).toBe(true);
    expect(cases.every((item) => item.caseCircularity === "UNKNOWN")).toBe(true);
    expect(cases.filter((item) => item.caseCircularity === "INDEPENDENT_SIGNAL")).toHaveLength(0);
  });

  test("contains no comparative verdict, winner, ranking, or interaction semantics", () => {
    const serialized = JSON.stringify(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1).toLowerCase();
    expect(serialized).not.toContain('"verdict"');
    expect(serialized).not.toContain('"winner":');
    expect(serialized).not.toContain('"ranking":');
    expect(serialized).not.toContain("becomes");
    expect(serialized).not.toContain("causes");
    expect(allKeys(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1)).not.toContain("winner");
    expect(allKeys(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1)).not.toContain("ranking");
    expect(allKeys(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1)).not.toContain("modelJudgments");
  });

  test("rejects unknown keys and held-out comparative payloads", () => {
    const unknownKey = clone(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1) as any;
    unknownKey.unapprovedResult = "SUPPORTED";
    expect(validateFunctionalRoleComparativeEvaluationCorpusV0_1(unknownKey).ok).toBe(false);
    const heldOutPayload = clone(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1) as any;
    heldOutPayload.cases[7].modelJudgments = [];
    expect(validateFunctionalRoleComparativeEvaluationCorpusV0_1(heldOutPayload).ok).toBe(false);
  });

  test("is deeply immutable", () => {
    expect(Object.isFrozen(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1)).toBe(true);
    expect(Object.isFrozen(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases)).toBe(true);
    expect(Object.isFrozen(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases[0])).toBe(true);
    expect(Object.isFrozen(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases[0].input)).toBe(true);
  });

  test("does not introduce a semantic target-sense or provider lane", () => {
    expect(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1.cases.every(
      (item) => item.targetSenseIndependence !== "INDEPENDENT",
    )).toBe(true);
    expect(allKeys(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1)).not.toContain("provider");
    expect(allKeys(FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_CORPUS_V0_1)).not.toContain("semanticBridge");
  });
});
