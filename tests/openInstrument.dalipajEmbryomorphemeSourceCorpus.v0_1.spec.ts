import {
  DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1,
  DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1,
  DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
  DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
  getDalipajEmbryomorphemeSourceRecordV0_1,
  validateDalipajEmbryomorphemeSourceCorpusV0_1,
} from "../src/shared/openInstrument/dalipajEmbryomorphemeSourceCorpus.v0_1";

describe("Dalipaj embryomorpheme source corpus v0.1", () => {
  test("freezes exactly the defensible partial source records", () => {
    expect(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1).toMatchObject({
      schemaVersion: DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1,
      corpusAuthority: DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_AUTHORITY_V0_1,
      corpusStatus: "PARTIAL_PRIMARY_CORPUS_AVAILABLE",
      freezeStatus: "FROZEN",
      recordCount: 3,
      canonicalPromotion: "NO",
      runtimeAuthority: "NO",
      historicalClaimAdoption: "NO",
      productionEvidencePromotion: "NO",
      zeroEvaluationStatus: DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
    });
    expect(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map((record) => record.form)).toEqual([
      "GROP",
      "SY",
      "SY-GROP",
    ]);
    expect(validateDalipajEmbryomorphemeSourceCorpusV0_1()).toEqual({
      ok: true,
      reasonCodes: [],
    });
  });

  test("keeps GROP atomic, SY constituent-only, and SY-GROP compound", () => {
    expect(getDalipajEmbryomorphemeSourceRecordV0_1("GROP")).toMatchObject({
      formClassification: "ATOMIC_EMBRYOMORPHEME",
      sourceGloss: "pit/hollow; used in the eye-socket context",
    });
    expect(getDalipajEmbryomorphemeSourceRecordV0_1("SY")).toMatchObject({
      formClassification: "CONSTITUENT_CLAIM",
      standaloneAtomicStatus: "NOT_ESTABLISHED_FROM_ACCESSIBLE_SOURCE",
    });
    expect(getDalipajEmbryomorphemeSourceRecordV0_1("SY-GROP")).toMatchObject({
      formClassification: "COMPOUND_CLAIM",
      claimTypes: ["DALIPAJ_FUNCTIONAL_CLAIM", "DALIPAJ_ETYMOLOGICAL_CLAIM"],
    });
  });

  test("keeps the Cyclops relationship attributed and unevaluated", () => {
    const record = getDalipajEmbryomorphemeSourceRecordV0_1("SY-GROP");

    expect(record?.sourceLocator).toContain("CIKLOP");
    expect(record?.claimTypes).toContain("DALIPAJ_ETYMOLOGICAL_CLAIM");
    expect(record?.zeroEvaluationStatus).toBe(
      DALIPAJ_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
    );
    expect(
      DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.historicalClaimAdoption,
    ).toBe("NO");
  });

  test("excludes unverified forms from the frozen primary corpus", () => {
    const forms = DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
      (record) => record.form,
    );

    for (const excluded of [
      "TERHEK",
      "HECTOR",
      "BËR",
      "KE",
      "TI",
      "PRAKTIKË",
      "PEK",
      "PJEK",
      "KËRTHIZË",
      "KORINTH",
    ]) {
      expect(forms).not.toContain(excluded);
    }
  });

  test("contains no ZË-RO mapping or runtime analysis fields", () => {
    const serialized = JSON.stringify(
      DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
    );

    for (const forbiddenField of [
      "vowelAffinity",
      "expectedVoice",
      "expectedPath",
      "voicePath",
      "zeroVoice",
      "zeroRole",
      "zeroProfile",
      "zeroFunctionalCorrespondence",
      "zeroAgreement",
      "agreementScore",
      "semanticAlignment",
      "targetSenseAlignment",
      "doctrineProjection",
      "functionalComponents",
      "providerOutput",
    ]) {
      expect(serialized).not.toContain(forbiddenField);
    }
  });

  test("is deterministic, deeply immutable, and fails closed", () => {
    expect(getDalipajEmbryomorphemeSourceRecordV0_1("GROP")).toBe(
      getDalipajEmbryomorphemeSourceRecordV0_1("GROP"),
    );
    expect(Object.isFrozen(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1)).toBe(true);
    expect(Object.isFrozen(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records)).toBe(
      true,
    );
    expect(
      Object.isFrozen(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records[0]),
    ).toBe(true);
    expect(getDalipajEmbryomorphemeSourceRecordV0_1("SY-GROP")).toEqual(
      getDalipajEmbryomorphemeSourceRecordV0_1("SY-GROP"),
    );
    expect(getDalipajEmbryomorphemeSourceRecordV0_1("GROP ")).toBeNull();

    const malformed = {
      ...DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
      records: [
        {
          ...DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records[0],
          expectedVoice: "U",
        },
        ...DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.slice(1),
      ],
    };

    expect(validateDalipajEmbryomorphemeSourceCorpusV0_1(malformed)).toEqual({
      ok: false,
      reasonCodes: ["CANONICAL_CONTENT_INVALID", "FORBIDDEN_FIELD_PRESENT"],
    });

    const altered = {
      ...DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
      records: [
        {
          ...DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records[0],
          sourceGloss: "altered gloss",
        },
        ...DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.slice(1),
      ],
    };

    expect(validateDalipajEmbryomorphemeSourceCorpusV0_1(altered)).toEqual({
      ok: false,
      reasonCodes: ["CANONICAL_CONTENT_INVALID"],
    });
  });
});
