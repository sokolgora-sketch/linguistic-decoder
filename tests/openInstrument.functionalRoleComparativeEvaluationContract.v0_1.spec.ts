import {
  buildComparativeModelRepresentationV0_1,
  calculateCircularityMetricV0_1,
  calculateFunctionalExplanatorySupportMetricV0_1,
  calculateIndependentEvidenceMetricV0_1,
  calculateModelMAddedInformationMetricV0_1,
  calculateNullMetricsV0_1,
  calculateTargetSenseSupportMetricV0_1,
  calculateUnsupportedRateMetricV0_1,
  COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1,
  COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1,
  COMPARATIVE_I_TO_U_STATUS_V0_1,
  COMPARATIVE_INTERACTION_AUTHORITY_V0_1,
  COMPARATIVE_MODEL_IDS_V0_1,
  COMPARATIVE_U_TO_I_STATUS_V0_1,
  FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1,
  validateComparativeEvaluationCaseV0_1,
  validateComparativeEvaluationCasesV0_1,
  type ComparativeEvaluationCaseV0_1,
  type ComparativeModelJudgmentV0_1,
} from "../src/shared/openInstrument/functionalRoleComparativeEvaluationContract.v0_1";

const BLINDING = {
  protocol: "MODEL_IDENTITY_HIDDEN_V0_1",
  modelIdentityHidden: true,
  expectedWinnerHidden: true,
  canonicalClassificationHidden: true,
  representationMayBeShown: true,
} as const;

function judgment(
  modelId: ComparativeModelJudgmentV0_1["modelId"],
  overrides: Partial<ComparativeModelJudgmentV0_1> = {},
): ComparativeModelJudgmentV0_1 {
  return {
    modelId,
    evaluatorKind: "HUMAN",
    provenance: "INDEPENDENT",
    circularity: "INDEPENDENT_SIGNAL",
    modelOutput: "MODEL_EMITTED_NON_NULL",
    verdict: "SUPPORTED",
    nullAssessment: {
      modelOutcome: "MODEL_EMITTED_NON_NULL",
      expectedOutcome: "INDEPENDENTLY_EXPECTED_NON_NULL",
      expectedOutcomeProvenance: "INDEPENDENT",
      classification: "NOT_APPLICABLE",
    },
    overreachReasons: [],
    ambiguity: null,
    ...overrides,
  };
}

function baseCase(
  overrides: Partial<ComparativeEvaluationCaseV0_1> = {},
): ComparativeEvaluationCaseV0_1 {
  return {
    schemaVersion: FUNCTIONAL_ROLE_COMPARATIVE_EVALUATION_SCHEMA_V0_1,
    caseId: "case.one",
    input: { word: "synthetic" },
    targetSense: {
      id: "sense.one",
      label: "a bounded target sense",
      provenance: "INDEPENDENT",
    },
    structuralVoicePath: ["A"],
    caseProvenance: "INDEPENDENT",
    caseCircularity: "INDEPENDENT_SIGNAL",
    caseKind: "GENERAL_CASE",
    controlCategories: [],
    split: "DEVELOPMENT",
    evaluationEligibility: "ELIGIBLE",
    targetSenseEligibility: "ELIGIBLE_INDEPENDENT",
    nullEligibility: "INELIGIBLE",
    blinding: BLINDING,
    adjudicationStatus: "COMPLETE",
    modelRepresentations: [
      buildComparativeModelRepresentationV0_1("FUNCTIONAL_ROLE_F", ["A"])!,
      buildComparativeModelRepresentationV0_1("DOCTRINE_PRINCIPLE_P", ["A"])!,
      buildComparativeModelRepresentationV0_1(
        "MULTIDIMENSIONAL_PROFILE_M",
        ["A"],
      )!,
    ],
    modelJudgments: [judgment("FUNCTIONAL_ROLE_F")],
    ...overrides,
  };
}

describe("Open Instrument comparative functional-role evaluation contract v0.1", () => {
  test("does not establish F/P equivalence", () => {
    expect(COMPARATIVE_F_P_EQUIVALENCE_STATUS_V0_1).toBe("NOT_ESTABLISHED");
  });

  test("defines exactly the three evaluation identities and canonical Voices", () => {
    expect(COMPARATIVE_MODEL_IDS_V0_1).toEqual([
      "FUNCTIONAL_ROLE_F",
      "DOCTRINE_PRINCIPLE_P",
      "MULTIDIMENSIONAL_PROFILE_M",
    ]);
    expect(
      buildComparativeModelRepresentationV0_1("FUNCTIONAL_ROLE_F", [
        "A",
        "Y",
        "Ë",
      ]),
    ).toMatchObject({
      modelId: "FUNCTIONAL_ROLE_F",
      roles: [
        { voice: "A", role: "Initiation/Source" },
        { voice: "Y", role: "Reflection/Mirror" },
        { voice: "Ë", role: "Completion/Unit" },
      ],
    });
    expect(
      buildComparativeModelRepresentationV0_1("DOCTRINE_PRINCIPLE_P", [
        "A",
        "Y",
        "Ë",
      ]),
    ).toMatchObject({
      principles: [
        { voice: "A", principle: "Bashkimi" },
        { voice: "Y", principle: "Nisma" },
        { voice: "Ë", principle: "Dashuria" },
      ],
    });
    expect(
      buildComparativeModelRepresentationV0_1(
        "MULTIDIMENSIONAL_PROFILE_M",
        ["A"],
      )?.profiles[0]?.profile.voice,
    ).toBe("A");
  });

  test("keeps P separate from F rather than declaring translation equivalence", () => {
    const f = buildComparativeModelRepresentationV0_1(
      "FUNCTIONAL_ROLE_F",
      ["I"],
    );
    const p = buildComparativeModelRepresentationV0_1(
      "DOCTRINE_PRINCIPLE_P",
      ["I"],
    );
    expect(f).toMatchObject({ roles: [{ role: "Direction/Focus" }] });
    expect(p).toMatchObject({ principles: [{ principle: "Ritmi" }] });
    expect(JSON.stringify(f)).not.toBe(JSON.stringify(p));
  });

  test("preserves interaction boundaries and rejects noncanonical Voices", () => {
    expect(COMPARATIVE_INTERACTION_AUTHORITY_V0_1).toBe("NO");
    expect(COMPARATIVE_GENERIC_PATH_COMPOSITION_STATUS_V0_1).toBe(
      "NOT_AUTHORIZED",
    );
    expect(COMPARATIVE_U_TO_I_STATUS_V0_1).toBe(
      "NOT_AUTHORIZED_AS_GENERIC_RULE",
    );
    expect(COMPARATIVE_I_TO_U_STATUS_V0_1).toBe(
      "NOT_AUTHORIZED_AS_GENERIC_RULE",
    );
    expect(
      buildComparativeModelRepresentationV0_1("FUNCTIONAL_ROLE_F", [
        "Ẽ" as never,
      ]),
    ).toBeNull();
  });

  test("validates a case with explicit provenance, blinding, and model references", () => {
    expect(validateComparativeEvaluationCaseV0_1(baseCase()).ok).toBe(true);
  });

  test("keeps verdict distinctions and partial support scoring explicit", () => {
    const cases = [
      baseCase({
        caseId: "supported",
        modelJudgments: [judgment("FUNCTIONAL_ROLE_F", { verdict: "SUPPORTED" })],
      }),
      baseCase({
        caseId: "partial",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", { verdict: "PARTIALLY_SUPPORTED" }),
        ],
      }),
      baseCase({
        caseId: "unsupported",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", { verdict: "UNSUPPORTED" }),
        ],
      }),
      baseCase({
        caseId: "unknown",
        modelJudgments: [judgment("FUNCTIONAL_ROLE_F", { verdict: "UNKNOWN" })],
      }),
      baseCase({
        caseId: "null",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", {
            modelOutput: "MODEL_EMITTED_NULL",
            verdict: "NULL",
            nullAssessment: {
              modelOutcome: "MODEL_EMITTED_NULL",
              expectedOutcome: "UNKNOWN_EXPECTED_NULLNESS",
              expectedOutcomeProvenance: "UNKNOWN",
              classification: "UNKNOWN_NULL_CORRECTNESS",
            },
          }),
        ],
      }),
    ];
    expect(
      cases.every((item) => validateComparativeEvaluationCaseV0_1(item).ok),
    ).toBe(true);
    expect(
      calculateTargetSenseSupportMetricV0_1(
        cases,
        "FUNCTIONAL_ROLE_F",
      ),
    ).toMatchObject({
      eligibleCaseCount: 5,
      supportedCount: 1,
      partiallySupportedCount: 1,
      unsupportedCount: 1,
      unknownCount: 1,
      nullCount: 1,
      denominator: 3,
      score: 0.5,
    });
  });

  test("derives Null correctness without treating Null as a forced failure", () => {
    const cases = [
      baseCase({
        caseId: "correct-null",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", {
            modelOutput: "MODEL_EMITTED_NULL",
            verdict: "NULL",
            nullAssessment: {
              modelOutcome: "MODEL_EMITTED_NULL",
              expectedOutcome: "INDEPENDENTLY_EXPECTED_NULL",
              expectedOutcomeProvenance: "INDEPENDENT",
              classification: "CORRECT_NULL",
            },
          }),
        ],
      }),
      baseCase({
        caseId: "incorrect-null",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", {
            modelOutput: "MODEL_EMITTED_NULL",
            verdict: "NULL",
            nullAssessment: {
              modelOutcome: "MODEL_EMITTED_NULL",
              expectedOutcome: "INDEPENDENTLY_EXPECTED_NON_NULL",
              expectedOutcomeProvenance: "INDEPENDENT",
              classification: "INCORRECT_NULL",
            },
          }),
        ],
      }),
    ];
    expect(
      calculateNullMetricsV0_1(cases, "FUNCTIONAL_ROLE_F"),
    ).toMatchObject({
      totalModelOutputs: 2,
      emittedNullCount: 2,
      independentlyExpectedNullCount: 1,
      correctNullCount: 1,
      incorrectNullCount: 1,
      correctNullRate: 1,
    });
  });

  test("keeps provenance and circularity distributions visible", () => {
    const cases = [
      baseCase({
        caseId: "independent",
        modelJudgments: [judgment("FUNCTIONAL_ROLE_F")],
      }),
      baseCase({
        caseId: "partial",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", {
            provenance: "CANONICAL_AUTHORED",
            circularity: "PARTIALLY_CIRCULAR",
          }),
        ],
      }),
      baseCase({
        caseId: "synthetic",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", {
            evaluatorKind: "SYNTHETIC_MODEL",
            provenance: "SYNTHETIC",
            circularity: "UNKNOWN",
          }),
        ],
      }),
      baseCase({
        caseId: "independent-unsupported",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", { verdict: "UNSUPPORTED" }),
        ],
      }),
    ];
    expect(
      calculateIndependentEvidenceMetricV0_1(cases, "FUNCTIONAL_ROLE_F"),
    ).toMatchObject({
      independentlySupportedCount: 1,
      scoredCount: 4,
      rate: 1 / 4,
    });
    expect(
      calculateCircularityMetricV0_1(cases, "FUNCTIONAL_ROLE_F"),
    ).toMatchObject({
      counts: {
        INDEPENDENT_SIGNAL: 2,
        PARTIALLY_CIRCULAR: 1,
        CIRCULAR: 0,
        UNKNOWN: 1,
      },
    });
  });

  test("keeps unsupported rate separate from Null and Unknown", () => {
    const cases = [
      baseCase({
        caseId: "supported",
        modelJudgments: [judgment("FUNCTIONAL_ROLE_F")],
      }),
      baseCase({
        caseId: "unsupported",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", { verdict: "UNSUPPORTED" }),
        ],
      }),
      baseCase({
        caseId: "unknown",
        modelJudgments: [
          judgment("FUNCTIONAL_ROLE_F", { verdict: "UNKNOWN" }),
        ],
      }),
    ];
    expect(
      calculateUnsupportedRateMetricV0_1(cases, "FUNCTIONAL_ROLE_F"),
    ).toMatchObject({
      numerator: 1,
      denominator: 2,
      rate: 0.5,
      unknownCount: 1,
      nullCount: 0,
    });
    expect(
      calculateFunctionalExplanatorySupportMetricV0_1(
        cases,
        "FUNCTIONAL_ROLE_F",
      ).denominator,
    ).toBe(2);
  });

  test("represents M added-information assessment without ranking models", () => {
    const m = judgment("MULTIDIMENSIONAL_PROFILE_M", {
      addedInformationAssessments: [
        {
          comparatorModelId: "FUNCTIONAL_ROLE_F",
          status: "UNIQUE_INDEPENDENT_SUPPORT",
        },
        {
          comparatorModelId: "DOCTRINE_PRINCIPLE_P",
          status: "UNKNOWN",
        },
      ],
    });
    expect(
      validateComparativeEvaluationCaseV0_1(
        baseCase({ modelJudgments: [m] }),
      ).ok,
    ).toBe(true);
    expect(
      calculateModelMAddedInformationMetricV0_1(
        [baseCase({ modelJudgments: [m] })],
        "FUNCTIONAL_ROLE_F",
      ),
    ).toMatchObject({
      assessedCount: 1,
      uniqueIndependentSupportCount: 1,
      uniqueIndependentSupportRate: 1,
    });

    expect(
      validateComparativeEvaluationCaseV0_1(
        baseCase({
          modelJudgments: [
            judgment("MULTIDIMENSIONAL_PROFILE_M", {
              provenance: "DERIVED",
              circularity: "CIRCULAR",
              addedInformationAssessments: [
                {
                  comparatorModelId: "FUNCTIONAL_ROLE_F",
                  status: "UNIQUE_INDEPENDENT_SUPPORT",
                },
              ],
            }),
          ],
        }),
      ).ok,
    ).toBe(false);
  });

  test("rejects unknown keys, duplicate case IDs, bad Null derivations, and synthetic independence", () => {
    const missingModelRepresentation = { ...baseCase() };
    delete (missingModelRepresentation as { modelRepresentations?: unknown })
      .modelRepresentations;
    expect(
      validateComparativeEvaluationCaseV0_1(missingModelRepresentation).ok,
    ).toBe(false);

    const unknownKey = { ...baseCase(), winner: "F" };
    expect(validateComparativeEvaluationCaseV0_1(unknownKey).ok).toBe(false);

    const duplicateCases = validateComparativeEvaluationCasesV0_1([
      baseCase(),
      baseCase(),
    ]);
    expect(duplicateCases.reasonCodes).toContain("DUPLICATE_CASE_ID");

    const badNull = baseCase({
      modelJudgments: [
        judgment("FUNCTIONAL_ROLE_F", {
          modelOutput: "MODEL_EMITTED_NULL",
          verdict: "NULL",
          nullAssessment: {
            modelOutcome: "MODEL_EMITTED_NULL",
            expectedOutcome: "INDEPENDENTLY_EXPECTED_NULL",
            expectedOutcomeProvenance: "INDEPENDENT",
            classification: "INCORRECT_NULL",
          },
        }),
      ],
    });
    expect(validateComparativeEvaluationCaseV0_1(badNull).ok).toBe(false);

    const syntheticIndependent = baseCase({
      modelJudgments: [
        judgment("FUNCTIONAL_ROLE_F", {
          evaluatorKind: "SYNTHETIC_MODEL",
          provenance: "INDEPENDENT",
        }),
      ],
    });
    expect(validateComparativeEvaluationCaseV0_1(syntheticIndependent).ok).toBe(
      false,
    );
  });

  test("rejects forbidden interaction fields and preserves immutable references", () => {
    const forbidden = { ...baseCase(), startState: "A" };
    expect(
      validateComparativeEvaluationCaseV0_1(forbidden).reasonCodes,
    ).toContain("UNKNOWN_KEY");

    const representation = buildComparativeModelRepresentationV0_1(
      "MULTIDIMENSIONAL_PROFILE_M",
      ["A"],
    );
    expect(Object.isFrozen(representation)).toBe(true);
    expect(Object.isFrozen(representation?.voicePath)).toBe(true);
  });
});
