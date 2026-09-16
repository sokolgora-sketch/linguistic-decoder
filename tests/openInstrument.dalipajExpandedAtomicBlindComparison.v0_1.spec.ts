import { createHash } from "node:crypto";
import { readFileSync as readTextFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_AUTHORITY_V0_1,
  DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_SCHEMA_V0_1,
  compareDalipajExpandedAtomicCorpusToZeroV0_1,
  runDalipajExpandedAtomicZeroFormOnlyAnalysisV0_1,
} from "../src/shared/openInstrument/dalipajExpandedAtomicBlindComparison.v0_1";
import {
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
  validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1,
} from "../src/shared/openInstrument/dalipajEmbryomorphemeExpandedSourceCorpus.v0_1";
import {
  DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
} from "../src/shared/openInstrument/dalipajEmbryomorphemeSourceCorpus.v0_1";

const REPO_ROOT = resolve(__dirname, "..");
const EXPANDED_SOURCE_PATH = resolve(
  REPO_ROOT,
  "src/shared/openInstrument/dalipajEmbryomorphemeExpandedSourceCorpus.v0_1.ts",
);
const OLD_SOURCE_PATH = resolve(
  REPO_ROOT,
  "src/shared/openInstrument/dalipajEmbryomorphemeSourceCorpus.v0_1.ts",
);

function sha256File(path: string): string {
  return createHash("sha256")
    .update(readTextFileSync(path))
    .digest("hex");
}

describe("Dalipaj expanded atomic blind comparison v0.1", () => {
  test("freezes form-only outputs before revealing source claims", async () => {
    const generationInputs: unknown[] = [];
    const result = await compareDalipajExpandedAtomicCorpusToZeroV0_1({
      analyzeForm: async (form) => {
        generationInputs.push(form);
        expect(typeof form).toBe("string");
        return runDalipajExpandedAtomicZeroFormOnlyAnalysisV0_1(form);
      },
    });

    expect(generationInputs).toEqual(["BI", "LE", "ZA", "GJ", "MA"]);
    expect(result).toMatchObject({
      schemaVersion: DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_SCHEMA_V0_1,
      comparisonAuthority:
        DALIPAJ_EXPANDED_ATOMIC_BLIND_COMPARISON_AUTHORITY_V0_1,
      comparisonPhase: "SOURCE_REVEALED_AFTER_ZERO_OUTPUT_FREEZE",
      sourceGlossVisibleDuringGeneration: false,
      targetSenseInjected: false,
      semanticAlignmentInjected: false,
      providerCalls: 0,
    });
    expect(result.records.every((record) =>
      record.zeroOutputFrozenBeforeSourceReveal === true &&
      record.sourceClaimWasUsedForGeneration === false,
    )).toBe(true);
    expect(result.records.every((record) =>
      !Object.prototype.hasOwnProperty.call(record.zeroOutput, "sourceGloss") &&
      !Object.prototype.hasOwnProperty.call(
        record.zeroOutput,
        "sourceFunctionalTarget",
      ) &&
      !Object.prototype.hasOwnProperty.call(record.zeroOutput, "targetSense") &&
      !Object.prototype.hasOwnProperty.call(
        record.zeroOutput,
        "semanticAlignment",
      ),
    )).toBe(true);
  });

  test("captures five structural outputs separately from comparison", async () => {
    const result = await compareDalipajExpandedAtomicCorpusToZeroV0_1();
    const [bi, le, za, gj, ma] = result.records;

    expect(result).toMatchObject({
      comparisonRecordCount: 5,
      totalCases: 5,
      structuralCandidateCount: 0,
      structuralNullCount: 5,
      functionallyComparableCount: 0,
      corpusLevelResult: "STRUCTURAL_CAPABILITY_LIMIT_DOMINATES",
    });
    expect([bi, le, za, gj, ma].map((record) => record.form)).toEqual([
      "BI",
      "LE",
      "ZA",
      "GJ",
      "MA",
    ]);
    expect(bi.zeroOutput).toMatchObject({
      normalizedForm: "bi",
      vowelSequence: ["I"],
      structuralStatus: "STRUCTURAL_NULL",
      genericHypothesisStatus: "UNAVAILABLE",
      evidenceState: "NOT_APPLICABLE_STRUCTURAL_NULL",
    });
    expect(le.zeroOutput).toMatchObject({
      normalizedForm: "le",
      vowelSequence: ["E"],
      structuralStatus: "STRUCTURAL_NULL",
      genericHypothesisStatus: "UNAVAILABLE",
    });
    expect(za.zeroOutput).toMatchObject({
      normalizedForm: "za",
      vowelSequence: ["A"],
      structuralStatus: "STRUCTURAL_NULL",
      genericHypothesisStatus: "UNAVAILABLE",
    });
    expect(gj.zeroOutput).toMatchObject({
      normalizedForm: "gj",
      vowelSequence: [],
      structuralStatus: "STRUCTURAL_NULL",
      structuralHypothesisId: null,
      structuralEmbryo: null,
      structuralExpansionChain: null,
      genericHypothesisStatus: "UNAVAILABLE",
      genericFunctionalHypothesis: null,
      functionalComponents: null,
      evidenceState: "NOT_APPLICABLE_STRUCTURAL_NULL",
    });
    expect(gj.verdict).toBe("NOT_APPLICABLE_STRUCTURAL_NULL");
    expect(gj.reasonCodes).toContain("ZERO_STRUCTURAL_NULL");
    expect(ma.zeroOutput).toMatchObject({
      normalizedForm: "ma",
      vowelSequence: ["A"],
      structuralStatus: "STRUCTURAL_NULL",
      genericHypothesisStatus: "UNAVAILABLE",
    });
    expect([bi, le, za, ma].every((record) =>
      record.verdict === "NOT_APPLICABLE_STRUCTURAL_NULL" &&
      record.zeroOutput.genericFunctionalHypothesis === null &&
      record.reasonCodes.includes("ZERO_STRUCTURAL_NULL") &&
      record.zeroOutput.evidenceState === "NOT_APPLICABLE_STRUCTURAL_NULL",
    )).toBe(true);
  });

  test("uses only exact canonical property terms and preserves the definition gap", async () => {
    const result = await compareDalipajExpandedAtomicCorpusToZeroV0_1();
    const candidateRecords = result.records.filter(
      (record) => record.zeroOutput.genericFunctionalHypothesis !== null,
    );

    expect(candidateRecords).toHaveLength(0);
    expect(result.records.every((record) =>
      record.verdict === "NOT_APPLICABLE_STRUCTURAL_NULL" &&
      record.matchedProperty === null &&
      record.matchedPropertySpecificity === null &&
      record.matchedPropertySourceClass === null &&
      record.wrongProfileAlternatives.length === 0 &&
      record.profileSpecificityVerdict === "NOT_APPLICABLE_STRUCTURAL_NULL" &&
      record.propertyDefinitionInsufficient === false,
    )).toBe(true);
    expect(result).toMatchObject({
      directCorrespondenceCount: 0,
      partialCorrespondenceCount: 0,
      noCorrespondenceCount: 0,
      insufficientInformationCount: 0,
      propertyDefinitionInsufficientCases: 0,
      functionalCorrespondenceObserved: "INSUFFICIENT",
      propertyDefinitionGapMateriallyObserved: "NO",
    });
  });

  test("keeps the comparison outside canonical, runtime, and evidence authority", async () => {
    const result = await compareDalipajExpandedAtomicCorpusToZeroV0_1();

    expect(result).toMatchObject({
      cyclopsHistoricalClaimEvaluated: "NO",
      dalipajValidatesZero: "NO",
      zeroValidatesDalipaj: "NO",
      canonicalPromotion: "NO",
      runtimeAuthority: "NO",
      productionEvidencePromotion: "NO",
      historicalClaimAdoption: "NO",
    });
    for (const record of result.records) {
      expect(record.zeroOutput.genericFunctionalHypothesis).not.toEqual(
        expect.objectContaining({ targetSense: expect.anything() }),
      );
      expect(record.zeroOutput.genericFunctionalHypothesis).not.toEqual(
        expect.objectContaining({ semanticAlignment: expect.anything() }),
      );
    }
  });

  test("leaves both source registries unchanged and valid", async () => {
    const expandedBefore = sha256File(EXPANDED_SOURCE_PATH);
    const oldBefore = sha256File(OLD_SOURCE_PATH);
    const expandedJsonBefore = JSON.stringify(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
    );
    const oldJsonBefore = JSON.stringify(
      DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
    );

    await compareDalipajExpandedAtomicCorpusToZeroV0_1();

    expect(sha256File(EXPANDED_SOURCE_PATH)).toBe(expandedBefore);
    expect(sha256File(OLD_SOURCE_PATH)).toBe(oldBefore);
    expect(JSON.stringify(DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1)).toBe(
      expandedJsonBefore,
    );
    expect(JSON.stringify(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1)).toBe(
      oldJsonBefore,
    );
    expect(validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1()).toEqual({
      ok: true,
      reasonCodes: [],
    });
    expect(DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
      (record) => record.sourceGloss,
    )).toEqual([
      "godas; e qëlloj dikë me diçka; ushtroj dhunë",
      "prodhon, nxjerr, lëshon",
      "kap, lidh",
      "gjë, gja; emër i pacaktuar",
      "mba, me mbajt",
    ]);
  });

  test("is deterministic and deeply frozen", async () => {
    const first = await compareDalipajExpandedAtomicCorpusToZeroV0_1();
    const second = await compareDalipajExpandedAtomicCorpusToZeroV0_1();

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.records)).toBe(true);
    for (const record of first.records) {
      expect(Object.isFrozen(record)).toBe(true);
      expect(Object.isFrozen(record.zeroOutput)).toBe(true);
      expect(Object.isFrozen(record.wrongProfileAlternatives)).toBe(true);
    }
  });
});
