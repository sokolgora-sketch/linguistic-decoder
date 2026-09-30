import type { AlbanianPronunciationSourceObservationV0_1 } from "@/shared/openInstrument/albanianPronunciationSourceObservation.v0_1";
import {
  ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_ID_V0_1,
  projectAlbanianPronunciationSourceObservationV0_1,
} from "@/shared/openInstrument/albanianPhonologicalCategoryProjector.v0_1";

function observation(
  rawIpa: string,
  overrides: Partial<AlbanianPronunciationSourceObservationV0_1> = {},
): AlbanianPronunciationSourceObservationV0_1 {
  return {
    schemaVersion: "open-instrument.albanian-pronunciation-source-observation.v0_1",
    lexicalForm: "fixture",
    lookupKey: "fixture",
    rawIpa,
    sourceProfileId: "open-instrument.wiktionary-kaikki-albanian-ipa.v0_1",
    sourceScope: "STANDARD_EXPLICIT",
    sourceProfileQualifier: null,
    sourceNotation: "IPA",
    notationKind: "UNSPECIFIED",
    directTags: ["standard"],
    notes: [],
    variantIdentity: "fixture:0",
    variantOrder: 0,
    sourceRecordId: "fixture:0",
    sourceLocator: { lineNumber: 1, byteOffset: 0, rowSha256: "fixture" },
    provenance: {
      authority: "NON_AUTHORITATIVE_FIXTURE",
      frozenArtifactSha256: null,
      frozenArtifactBytes: null,
      fixtureId: "projector-test",
      extractionRule: "test-only",
      readArtifactSha256: "fixture",
      readArtifactBytes: 1,
    },
    ...overrides,
  };
}

describe("Albanian phonological category projector v0.1", () => {
  it("projects the frozen Standard phonemic matrix without crossing to Voice", () => {
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/i/"))).toMatchObject({
      projectorId: ALBANIAN_PHONOLOGICAL_CATEGORY_PROJECTOR_ID_V0_1,
      status: "SUPPORTED",
      notationKind: "PHONEMIC",
      nucleusStructure: "MONOPHTHONG_NUCLEUS",
      categories: ["HIGH_FRONT_UNROUNDED"],
      authorityRefs: ["ICPhS-2003-THE-VOWELS-OF-STANDARD-ALBANIAN"],
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/y/"))).toMatchObject({
      categories: ["HIGH_FRONT_ROUNDED"],
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/u/"))).toMatchObject({
      categories: ["HIGH_BACK_ROUNDED"],
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/e/"))).toMatchObject({
      categories: ["MID_FRONT_UNROUNDED"],
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/ə/"))).toMatchObject({
      categories: ["CENTRAL_MID"],
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/o/"))).toMatchObject({
      categories: ["MID_BACK_ROUNDED"],
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/a/"))).toMatchObject({
      categories: ["LOW_CENTRAL_OR_BACK"],
    });
  });

  it("projects only the exact reviewed Northern-Tosk and Southern-Gheg qualifiers", () => {
    const northernTosk = observation("/ɜ/", {
      sourceScope: "ALBANIAN_UNSPECIFIED",
      sourceProfileQualifier: "NORTHERN_TOSK_EXPLICIT",
      directTags: ["Northern", "Tosk"],
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(northernTosk)).toMatchObject({
      status: "SUPPORTED",
      categories: ["CENTRAL_MID"],
      authorityRefs: ["JIPA-NORTHERN-TOSK-ALBANIAN"],
      sourceProfileQualifier: "NORTHERN_TOSK_EXPLICIT",
    });

    expect(
      projectAlbanianPronunciationSourceObservationV0_1(
        observation("[ʏ]", {
          sourceScope: "ALBANIAN_UNSPECIFIED",
          sourceProfileQualifier: "NORTHERN_TOSK_EXPLICIT",
          directTags: ["Northern", "Tosk"],
        }),
      ),
    ).toMatchObject({ status: "SUPPORTED", categories: ["HIGH_FRONT_ROUNDED"] });

    expect(
      projectAlbanianPronunciationSourceObservationV0_1(
        observation("/u/", {
          sourceScope: "ALBANIAN_UNSPECIFIED",
          sourceProfileQualifier: "SOUTHERN_GHEG_EXPLICIT",
          directTags: ["Gheg", "Southern"],
        }),
      ),
    ).toMatchObject({ status: "SUPPORTED", categories: ["HIGH_BACK_ROUNDED"] });

    expect(
      projectAlbanianPronunciationSourceObservationV0_1(
        observation("/ə/", {
          sourceScope: "ALBANIAN_UNSPECIFIED",
          sourceProfileQualifier: "SOUTHERN_GHEG_EXPLICIT",
          directTags: ["Gheg", "Southern"],
        }),
      ),
    ).toMatchObject({
      status: "UNRESOLVED",
      categories: [null],
      reasonCodes: expect.arrayContaining(["SYMBOL_AUTHORITY_MISSING"]),
    });
  });

  it("classifies whole strings generically around consonants", () => {
    const yll = projectAlbanianPronunciationSourceObservationV0_1(observation("/yɫ/", {
      lexicalForm: "yll",
      lookupKey: "yll",
    }));
    const çun = projectAlbanianPronunciationSourceObservationV0_1(observation("/tʃun/", {
      lexicalForm: "çun",
      lookupKey: "çun",
    }));

    expect(yll).toMatchObject({ status: "SUPPORTED", categories: ["HIGH_FRONT_ROUNDED"] });
    expect(yll.nuclei[0]).toMatchObject({ raw: "y", baseSymbol: "y", order: 0 });
    expect(çun).toMatchObject({ status: "SUPPORTED", categories: ["HIGH_BACK_ROUNDED"] });
    expect(çun.nuclei[0]).toMatchObject({ raw: "u", baseSymbol: "u", order: 0 });
  });

  it("preserves raw features while keeping category lookup bounded", () => {
    const result = projectAlbanianPronunciationSourceObservationV0_1(
      observation("/ˈaː/"),
    );
    expect(result).toMatchObject({
      rawIpa: "/ˈaː/",
      pronunciationBody: "ˈaː",
      status: "SUPPORTED",
      categories: ["LOW_CENTRAL_OR_BACK"],
      features: {
        length: "LONG",
        nasalization: "NOT_RECORDED",
        stressMarkers: ["ˈ"],
      },
    });

    const nasal = projectAlbanianPronunciationSourceObservationV0_1(observation("/ã/"));
    expect(nasal).toMatchObject({
      status: "SUPPORTED",
      categories: ["LOW_CENTRAL_OR_BACK"],
      features: { nasalization: "PRESENT" },
    });
  });

  it("fails closed for unspecified notation, non-standard profiles, and unsupported symbols", () => {
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("y"))).toMatchObject({
      status: "UNRESOLVED",
      categories: [null],
      reasonCodes: expect.arrayContaining(["NOTATION_AUTHORITY_MISSING"]),
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/y/", {
      sourceScope: "ALBANIAN_UNSPECIFIED",
    }))).toMatchObject({
      status: "UNRESOLVED",
      categories: [null],
      reasonCodes: expect.arrayContaining(["PROFILE_AUTHORITY_MISSING"]),
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/ɪ/"))).toMatchObject({
      status: "UNRESOLVED",
      categories: [null],
      reasonCodes: expect.arrayContaining(["SYMBOL_AUTHORITY_MISSING"]),
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("[y]"))).toMatchObject({
      status: "UNRESOLVED",
      categories: [null],
      reasonCodes: expect.arrayContaining(["PHONOLOGICAL_CATEGORY_UNRESOLVED"]),
    });
  });

  it("does not infer moving nuclei, glide relations, or winners across variants", () => {
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/ai/"))).toMatchObject({
      status: "UNRESOLVED",
      nucleusStructure: "UNRESOLVED_NUCLEUS_STRUCTURE",
      categories: [null, null],
      reasonCodes: expect.arrayContaining([
        "PLAIN_IPA_ADJACENCY_INSUFFICIENT",
        "NUCLEUS_STRUCTURE_UNRESOLVED",
      ]),
    });
    expect(projectAlbanianPronunciationSourceObservationV0_1(observation("/ja/"))).toMatchObject({
      status: "UNRESOLVED",
      reasonCodes: expect.arrayContaining(["NUCLEUS_STRUCTURE_UNRESOLVED"]),
    });
    const variants = [
      observation("/a/", { variantIdentity: "fixture:0", variantOrder: 0 }),
      observation("/i/", { variantIdentity: "fixture:1", variantOrder: 1 }),
    ];
    expect(variants.map(projectAlbanianPronunciationSourceObservationV0_1).map((item) => item.categories)).toEqual([
      ["LOW_CENTRAL_OR_BACK"],
      ["HIGH_FRONT_UNROUNDED"],
    ]);
  });
});
