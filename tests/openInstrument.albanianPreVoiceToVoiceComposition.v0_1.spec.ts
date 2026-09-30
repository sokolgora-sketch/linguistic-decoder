import type { AlbanianPronunciationSourceObservationV0_1 } from "@/shared/openInstrument/albanianPronunciationSourceObservation.v0_1";
import {
  projectAlbanianPronunciationSourceObservationV0_1,
} from "@/shared/openInstrument/albanianPhonologicalCategoryProjector.v0_1";
import {
  bridgeAlbanianPreVoiceCategoryToCanonicalV0_1,
} from "@/shared/openInstrument/albanianPreVoiceCategoryBridge.v0_1";
import {
  quantizeSevenVoicePhonologicalCategoryV0_1,
} from "@/shared/openInstrument/sevenVoicePhonologicalCategoryAuthority.v0_1";

function observation(
  rawIpa: string,
  lexicalForm = "fixture",
): AlbanianPronunciationSourceObservationV0_1 {
  return {
    schemaVersion: "open-instrument.albanian-pronunciation-source-observation.v0_1",
    lexicalForm,
    lookupKey: lexicalForm,
    rawIpa,
    sourceProfileId: "open-instrument.wiktionary-kaikki-albanian-ipa.v0_1",
    sourceScope: "STANDARD_EXPLICIT",
    sourceProfileQualifier: null,
    sourceNotation: "IPA",
    notationKind: "UNSPECIFIED",
    directTags: ["standard"],
    notes: [],
    variantIdentity: `${lexicalForm}:0`,
    variantOrder: 0,
    sourceRecordId: `${lexicalForm}:0`,
    sourceLocator: { lineNumber: 1, byteOffset: 0, rowSha256: "fixture" },
    provenance: {
      authority: "NON_AUTHORITATIVE_FIXTURE",
      frozenArtifactSha256: null,
      frozenArtifactBytes: null,
      fixtureId: "albanian-prevoice-to-voice-composition-v0.1",
      extractionRule: "test-only",
      readArtifactSha256: "fixture",
      readArtifactBytes: 1,
    },
  };
}

function canonicalVoicePath(
  rawIpa: string,
  lexicalForm = "fixture",
): readonly string[] {
  const projection = projectAlbanianPronunciationSourceObservationV0_1(
    observation(rawIpa, lexicalForm),
  );

  if (
    projection.status !== "SUPPORTED" ||
    projection.nuclei.some((nucleus) => nucleus.status !== "SUPPORTED" || nucleus.category === null)
  ) {
    throw new Error(`expected supported projection for ${lexicalForm} ${rawIpa}`);
  }

  return projection.nuclei.map((nucleus) =>
    quantizeSevenVoicePhonologicalCategoryV0_1(
      bridgeAlbanianPreVoiceCategoryToCanonicalV0_1(nucleus.category!),
    ),
  );
}

describe("Albanian pre-Voice to canonical Voice composition v0.1", () => {
  it("composes every frozen Albanian category through the existing bridge and quantizer", () => {
    const expected = {
      "/i/": "I",
      "/y/": "Y",
      "/u/": "U",
      "/e/": "E",
      "/ə/": "Ë",
      "/o/": "O",
      "/a/": "A",
    } as const;

    for (const [rawIpa, voice] of Object.entries(expected)) {
      expect(canonicalVoicePath(rawIpa)).toEqual([voice]);
    }
  });

  it("composes yll, çun, and bardhë from whole pronunciations without word rules", () => {
    expect(canonicalVoicePath("/yɫ/", "yll")).toEqual(["Y"]);
    expect(canonicalVoicePath("/tʃun/", "çun")).toEqual(["U"]);
    expect(canonicalVoicePath("/ˈbaɾðə/", "bardhë")).toEqual(["A", "Ë"]);
  });

  it("does not compose an unresolved projection into a canonical Voice path", () => {
    const projection = projectAlbanianPronunciationSourceObservationV0_1(
      observation("/ai/"),
    );

    expect(projection.status).toBe("UNRESOLVED");
    expect(projection.categories).toEqual([null, null]);
    expect(projection.reasonCodes).toEqual(
      expect.arrayContaining([
        "PLAIN_IPA_ADJACENCY_INSUFFICIENT",
        "NUCLEUS_STRUCTURE_UNRESOLVED",
      ]),
    );
  });
});
