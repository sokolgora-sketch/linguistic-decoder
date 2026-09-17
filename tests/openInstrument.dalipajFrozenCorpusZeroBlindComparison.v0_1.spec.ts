import {
  DALIPAJ_ZERO_BLIND_COMPARISON_SCHEMA_V0_1,
  compareDalipajFrozenCorpusToZeroV0_1,
  runDalipajZeroFormOnlyAnalysisV0_1,
} from "../src/shared/openInstrument/dalipajFrozenCorpusZeroBlindComparison.v0_1";
import {
  DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
  validateDalipajEmbryomorphemeSourceCorpusV0_1,
} from "../src/shared/openInstrument/dalipajEmbryomorphemeSourceCorpus.v0_1";

describe("Dalipaj frozen corpus and Zero blind comparison v0.1", () => {
  test("runs form-only generation before revealing frozen source glosses", async () => {
    const generationInputs: unknown[] = [];
    const result = await compareDalipajFrozenCorpusToZeroV0_1({
      analyzeForm: async (form) => {
        generationInputs.push(form);
        expect(typeof form).toBe("string");
        return runDalipajZeroFormOnlyAnalysisV0_1(form);
      },
    });

    expect(generationInputs).toEqual(["GROP", "SY", "SY-GROP"]);
    expect(result).toMatchObject({
      schemaVersion: DALIPAJ_ZERO_BLIND_COMPARISON_SCHEMA_V0_1,
      comparisonPhase: "SOURCE_REVEALED_AFTER_ZERO_OUTPUT_FREEZE",
      sourceGlossVisibleDuringGeneration: false,
      targetSenseInjected: false,
      semanticAlignmentInjected: false,
      providerCalls: 0,
    });
    expect(result.records.every((record) =>
      record.sourceClaimWasUsedForGeneration === false,
    )).toBe(true);
    expect(result.records[0].zeroOutput).not.toHaveProperty("sourceGloss");
    expect(result.records[0].zeroOutput).not.toHaveProperty("semanticAlignment");
  });

  test("captures the ordinary form-only outputs and conservative verdicts", async () => {
    const result = await compareDalipajFrozenCorpusToZeroV0_1();
    const [grop, sy, syGrop] = result.records;

    expect(grop.zeroOutput).toMatchObject({
      form: "GROP",
      normalizedForm: "grop",
      voicePath: ["O"],
      structuralHypothesisId:
        "logic-structural:grop:op:peel_left_consonant_frame+peel_left_consonant_frame",
      embryo: "OP",
      evidenceStatus: "NO_EXTERNAL_EVIDENCE",
    });
    expect(grop.zeroOutput.functionalComponents?.[0]?.voice).toBe("O");
    expect(grop.sourceGloss).toBe("pit/hollow; used in the eye-socket context");
    expect(grop.verdict).toBe("NO_CORRESPONDENCE");
    expect(grop.profileSpecificityCheck).toBe("NO_MATCH_NO_SPECIFICITY_CLAIM");
    expect(grop.reasonCodes).toEqual(expect.arrayContaining([
      "NO_EXACT_REVIEWED_PROFILE_PROPERTY_MATCH",
      "PROFILE_SPECIFICITY_NOT_ESTABLISHED",
    ]));

    expect(sy.zeroOutput).toMatchObject({
      form: "SY",
      normalizedForm: "sy",
      voicePath: ["Y"],
      embryo: null,
      functionalComponents: null,
      evidenceStatus: "NOT_APPLICABLE_STRUCTURAL_NULL",
    });
    expect(sy.verdict).toBe("STRUCTURAL_NULL");
    expect(sy.sourceFormClassification).toBe("CONSTITUENT_CLAIM");
    expect(sy.reasonCodes).toEqual(expect.arrayContaining([
      "SOURCE_FORM_CONSTITUENT_ONLY",
      "STANDALONE_ATOMIC_STATUS_NOT_ESTABLISHED",
    ]));

    expect(syGrop.zeroOutput).toMatchObject({
      form: "SY-GROP",
      normalizedForm: "sygrop",
      voicePath: ["Y", "O"],
      embryo: "YGR",
      evidenceStatus: "NO_EXTERNAL_EVIDENCE",
    });
    expect(syGrop.verdict).toBe("NO_CORRESPONDENCE");
    expect(syGrop.sourceFormClassification).toBe("COMPOUND_CLAIM");
    expect(syGrop.reasonCodes).toEqual(expect.arrayContaining([
      "SOURCE_FORM_COMPOUND_CLAIM",
      "HISTORICAL_CLAIM_OUTSIDE_COMPARISON",
    ]));
    expect(result.cyclopsHistoricalClaimEvaluated).toBe("NO");
    expect(result.corpusLevelResult).toBe("NO_OBSERVED_CORRESPONDENCE");
  });

  test("keeps source records unchanged and refuses promotion or runtime authority", async () => {
    const before = JSON.stringify(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1);
    const result = await compareDalipajFrozenCorpusToZeroV0_1();
    const after = JSON.stringify(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1);

    expect(after).toBe(before);
    expect(validateDalipajEmbryomorphemeSourceCorpusV0_1()).toEqual({
      ok: true,
      reasonCodes: [],
    });
    expect(result.canonicalPromotion).toBe("NO");
    expect(result.runtimeAuthority).toBe("NO");
    expect(result.productionEvidencePromotion).toBe("NO");
    expect(result.dalipajValidatesZero).toBe("NO");
    expect(result.zeroValidatesDalipaj).toBe("NO");
    expect(result.records[1].sourceFormClassification).toBe("CONSTITUENT_CLAIM");
    expect(result.records[1].zeroOutput.embryo).toBeNull();
  });

  test("preserves source constituent and compound classifications for non-null analyses", async () => {
    const atomicOutput = await runDalipajZeroFormOnlyAnalysisV0_1("GROP");
    const result = await compareDalipajFrozenCorpusToZeroV0_1({
      analyzeForm: async (form) => ({
        ...atomicOutput,
        form,
      }),
    });
    const sy = result.records[1];
    const syGrop = result.records[2];

    expect(sy.zeroOutput.embryo).toBe("OP");
    expect(sy.reasonCodes).toEqual(expect.arrayContaining([
      "SOURCE_FORM_CONSTITUENT_ONLY",
      "STANDALONE_ATOMIC_STATUS_NOT_ESTABLISHED",
    ]));
    expect(sy.reasonCodes).not.toContain("SOURCE_FORM_ATOMIC");
    expect(syGrop.zeroOutput.embryo).toBe("OP");
    expect(syGrop.reasonCodes).toEqual(expect.arrayContaining([
      "SOURCE_FORM_COMPOUND_CLAIM",
      "HISTORICAL_CLAIM_OUTSIDE_COMPARISON",
    ]));
    expect(syGrop.reasonCodes).not.toContain("SOURCE_FORM_ATOMIC");
  });

  test("uses only bounded verdicts, explicit reason codes, and deterministic output", async () => {
    const first = await compareDalipajFrozenCorpusToZeroV0_1();
    const second = await compareDalipajFrozenCorpusToZeroV0_1();
    const verdicts = new Set([
      "DIRECT_CORRESPONDENCE",
      "PARTIAL_CORRESPONDENCE",
      "NO_CORRESPONDENCE",
      "INSUFFICIENT_INFORMATION",
      "STRUCTURAL_NULL",
      "NOT_APPLICABLE",
    ]);

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.records)).toBe(true);
    expect(first.records).toHaveLength(3);
    for (const record of first.records) {
      expect(verdicts.has(record.verdict)).toBe(true);
      expect(record.reasonCodes.length).toBeGreaterThan(0);
      expect(record.zeroOutput).toBeDefined();
      expect(record.zeroOutput.genericFunctionalHypothesis).not.toEqual(
        expect.objectContaining({ targetSense: expect.anything() }),
      );
      expect(record.zeroOutput.genericFunctionalHypothesis).not.toEqual(
        expect.objectContaining({ semanticAlignment: expect.anything() }),
      );
    }
  });
});
