import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1,
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1,
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1,
  DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
  getDalipajExpandedEmbryomorphemeSourceRecordV0_1,
  validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1,
} from "../src/shared/openInstrument/dalipajEmbryomorphemeExpandedSourceCorpus.v0_1";
import { DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1 } from "../src/shared/openInstrument/dalipajEmbryomorphemeSourceCorpus.v0_1";

function sha256File(path: string): string {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

describe("Dalipaj expanded embryomorpheme source batch v0.1", () => {
  test("freezes exactly the five newly acquired atomic forms", () => {
    expect(DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1).toMatchObject({
      schemaVersion: DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_SCHEMA_V0_1,
      batchId: DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_BATCH_ID_V0_1,
      corpusAuthority: DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_AUTHORITY_V0_1,
      corpusStatus: "EXPANDED_PRIMARY_CORPUS_BATCH_AVAILABLE",
      freezeStatus: "FROZEN",
      recordCount: 5,
      canonicalPromotion: "NO",
      runtimeAuthority: "NO",
      historicalClaimAdoption: "NO",
      productionEvidencePromotion: "NO",
      zeroEvaluationStatus:
        DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1,
      canonicalStatus: DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
    });
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
        (record) => record.form,
      ),
    ).toEqual(["BI", "LE", "ZA", "GJ", "MA"]);
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.every(
        (record) =>
          record.formClassification === "ATOMIC_EMBRYOMORPHEME" &&
          record.atomicStatus === "PRIMARY_ATOMIC_VERIFIED" &&
          record.confidence === "MEDIUM" &&
          record.zeroEvaluationStatus ===
            DALIPAJ_EXPANDED_EMBRYOMORPHEME_ZERO_EVALUATION_STATUS_V0_1 &&
          record.canonicalStatus ===
            DALIPAJ_EXPANDED_EMBRYOMORPHEME_CANONICAL_STATUS_V0_1,
      ),
    ).toBe(true);
    expect(validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1()).toEqual({
      ok: true,
      reasonCodes: [],
    });
  });

  test("preserves source glosses and provenance without normalized mappings", () => {
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
        (record) => [record.form, record.sourceGloss],
      ),
    ).toEqual([
      ["BI", "godas; e qëlloj dikë me diçka; ushtroj dhunë"],
      ["LE", "prodhon, nxjerr, lëshon"],
      ["ZA", "kap, lidh"],
      ["GJ", "gjë, gja; emër i pacaktuar"],
      ["MA", "mba, me mbajt"],
    ]);
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
        (record) => [record.form, record.sourceTitle, record.sourceUrl],
      ),
    ).toEqual([
      [
        "BI",
        "Cila është origjina e fjalës Via, a ekziston etimoni i saj në greqishte?",
        "https://www.botasot.info/kultura/1934372/cila-eshte-origjina-e-fjales-via-a-ekziston-etimoni-i-saj-ne-greqishte/",
      ],
      [
        "LE",
        "Daulle është fjalë e gjuhës shqipe, jo e origjinës turko-arabe",
        "https://www.botasot.info/kultura/1921215/daulle-eshte-fjale-e-gjuhes-shqipe-jo-e-origjines-turko-arabe/",
      ],
      ["ZA", "Etimologji për fjalën SAMAR", "https://shqip.info/etimologji-per-fjalen-samar/"],
      ["GJ", "Etimologji për fjalën SAMAR", "https://shqip.info/etimologji-per-fjalen-samar/"],
      ["MA", "Etimologji për fjalën SAMAR", "https://shqip.info/etimologji-per-fjalen-samar/"],
    ]);
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
        (record) => [record.form, record.sourceLocator],
      ),
    ).toEqual([
      [
        "BI",
        "Bota Sot article text: explicit Embriomorfja [bi] entry and gloss in the acquired source capture, web lines 359-360.",
      ],
      [
        "LE",
        "Bota Sot article text: explicit embriomorfja [le] entry and gloss in the acquired source capture, web lines 288 and 292-303.",
      ],
      [
        "ZA",
        "Shqip.info article text: the Tre embriomorfet list identifies [za] and its gloss, web lines 116-123 in the acquired source capture; author attribution at line 125.",
      ],
      [
        "GJ",
        "Shqip.info article text: the Tre embriomorfet list identifies [g]/GJ and its gloss, web lines 116-123 in the acquired source capture; author attribution at line 125.",
      ],
      [
        "MA",
        "Shqip.info article text: the Tre embriomorfet list identifies [ma] and its gloss, web lines 116-123 in the acquired source capture; author attribution at line 125.",
      ],
    ]);
    for (const record of DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records) {
      expect(record.author).toBe("Agron Dalipaj");
      expect(record.sourceClass).toBe("PRIMARY_AUTHOR_SOURCE");
      expect(record.claimTypes).toEqual([
        "LEXICAL_CLAIM",
        "DALIPAJ_FUNCTIONAL_CLAIM",
        "DALIPAJ_ETYMOLOGICAL_CLAIM",
      ]);
    }

    const serialized = JSON.stringify(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
    );
    for (const forbiddenField of [
      "vowelAffinity",
      "expectedVoice",
      "expectedPath",
      "voicePath",
      "zeroEmbryo",
      "zeroProfile",
      "zeroRole",
      "zeroFunctionalCorrespondence",
      "agreement",
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

  test("does not promote the batch into canonical, runtime, or production authority", () => {
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.canonicalPromotion,
    ).toBe("NO");
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.runtimeAuthority,
    ).toBe("NO");
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.productionEvidencePromotion,
    ).toBe("NO");
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.historicalClaimAdoption,
    ).toBe("NO");
  });

  test("leaves the original three-record corpus and blind comparison contracts unchanged", () => {
    expect(DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.recordCount).toBe(3);
    expect(
      DALIPAJ_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.map(
        (record) => record.form,
      ),
    ).toEqual(["GROP", "SY", "SY-GROP"]);
    expect(
      sha256File(
        resolve(
          __dirname,
          "../src/shared/openInstrument/dalipajEmbryomorphemeSourceCorpus.v0_1.ts",
        ),
      ),
    ).toBe("e9af9442e01d7cbe0a4d52d37d145508e7e78d9adc6ea26dbf77c496a70bf06d");
    expect(
      sha256File(
        resolve(
          __dirname,
          "../src/shared/openInstrument/dalipajFrozenCorpusZeroBlindComparison.v0_1.ts",
        ),
      ),
    ).toBe("91c77db621bcbda4e44e869f128756ad7fd4c6e90daa048045b3cdcda7e5155e");
  });

  test("is deterministic, deeply frozen, and fails closed", () => {
    expect(getDalipajExpandedEmbryomorphemeSourceRecordV0_1("BI")).toBe(
      getDalipajExpandedEmbryomorphemeSourceRecordV0_1("BI"),
    );
    expect(getDalipajExpandedEmbryomorphemeSourceRecordV0_1("Ẽ")).toBeNull();
    expect(getDalipajExpandedEmbryomorphemeSourceRecordV0_1("BI ")).toBeNull();
    expect(Object.isFrozen(DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1)).toBe(
      true,
    );
    expect(
      Object.isFrozen(DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records),
    ).toBe(true);
    expect(
      DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.every((record) =>
        Object.isFrozen(record),
      ),
    ).toBe(true);

    const malformed = {
      ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
      records: [
        {
          ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records[0],
          expectedVoice: "U",
        },
        ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.slice(1),
      ],
    };

    expect(validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1(malformed)).toEqual(
      expect.objectContaining({
        ok: false,
        reasonCodes: expect.arrayContaining([
          "CANONICAL_CONTENT_INVALID",
          "FORBIDDEN_FIELD_PRESENT",
        ]),
      }),
    );
  });

  test("does not serialize caller-controlled claim types", () => {
    const malformedRecord = {
      ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records[0],
      claimTypes: [1n],
    };
    const cyclicClaimTypes: unknown[] = [];
    cyclicClaimTypes.push(cyclicClaimTypes);

    for (const claimTypes of [malformedRecord.claimTypes, cyclicClaimTypes]) {
      const malformed = {
        ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
        records: [
          { ...malformedRecord, claimTypes },
          ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.slice(1),
        ],
      };

      expect(
        validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1(malformed),
      ).toEqual(
        expect.objectContaining({
          ok: false,
          reasonCodes: expect.arrayContaining(["CLAIM_TYPES_INVALID"]),
        }),
      );
    }
  });

  test("reports an invalid form classification explicitly", () => {
    const malformed = {
      ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1,
      records: [
        {
          ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records[0],
          formClassification: "CONSTITUENT_CLAIM",
        },
        ...DALIPAJ_EXPANDED_EMBRYOMORPHEME_SOURCE_CORPUS_V0_1.records.slice(1),
      ],
    };

    expect(
      validateDalipajExpandedEmbryomorphemeSourceCorpusV0_1(malformed),
    ).toEqual(
      expect.objectContaining({
        ok: false,
        reasonCodes: expect.arrayContaining(["FORM_CLASSIFICATION_INVALID"]),
      }),
    );
  });
});
