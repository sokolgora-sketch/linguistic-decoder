import {
  CMUDICT_ARPABET_VOICE_PROFILE_V0_1,
  resolveArpabetPronunciationVariantsToVoiceV0_1,
  resolveCmuDictPronunciationToVoiceV0_1,
} from "@/shared/openInstrument/pronunciationToVoice.v0_1";
import {
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
  lookupCmuDictPronunciationsV0_1,
  type CmuDictPronunciationVariantV0_1,
} from "@/shared/openInstrument/cmudictArpabetPronunciation.v0_1";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";

function syntheticVariant(
  word: string,
  pronunciation: string,
  variantId = "1",
): CmuDictPronunciationVariantV0_1 {
  return {
    lexicalWord: word,
    sourceForm: variantId === "1" ? word : `${word}(${variantId})`,
    variantId,
    variantOrder: Number(variantId) - 1,
    sourcePronunciation: pronunciation,
    sourceUnits: pronunciation.split(/\s+/u),
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
  };
}

describe("Open Instrument pronunciation-backed Voice authority v0.1", () => {
  test.each([
    ["stone", ["O", "U"]],
    ["make", ["E", "I"]],
    ["time", ["A", "I"]],
    ["home", ["O", "U"]],
    ["name", ["E", "I"]],
    ["cat", ["A"]],
  ])("%s resolves through the bundled source", (word, expected) => {
    const result = resolveCmuDictPronunciationToVoiceV0_1(word);
    expect(result.status).toBe("defined");
    expect(result.sourceNotation).toBe("ARPABET");
    expect(result.canonicalSpokenVoicePath).toEqual(expected);
  });

  test("stone preserves one OW moving nucleus and the existing canonicalizer", () => {
    const result = resolveCmuDictPronunciationToVoiceV0_1("stone");
    const nucleus = result.variants[0].nuclei[0];
    expect(nucleus.baseCategory).toBe("OW");
    expect(nucleus.kind).toBe("moving_nucleus");
    expect(nucleus.observationAuthority?.nucleusStructure.state).toBe("ONE_NUCLEUS");
    expect(nucleus.canonicalization?.canonicalVoiceEvents).toEqual(["O", "U"]);
    expect(result.canonicalSpokenVoicePath).toEqual(["O", "U"]);
  });

  test("all frozen moving categories use profile and observation authority", () => {
    const cases = [
      ["OW", ["O", "U"]],
      ["AY", ["A", "I"]],
      ["EY", ["E", "I"]],
      ["OY", ["O", "I"]],
      ["AW", ["A", "U"]],
    ] as const;
    for (const [category, path] of cases) {
      const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
        category.toLowerCase(),
        [syntheticVariant(category.toLowerCase(), `T ${category}1 M`)],
      );
      expect(result.canonicalSpokenVoicePath).toEqual(path);
      expect(result.variants[0].nuclei[0].canonicalization?.status).toBe("defined");
    }
  });

  test.each([
    ["AA", ["A"]], ["AE", ["A"]], ["AH", ["Ë"]], ["AO", ["O"]],
    ["EH", ["E"]], ["ER", ["Ë"]], ["IH", ["I"]], ["IY", ["I"]],
    ["UH", ["U"]], ["UW", ["U"]],
  ])("%s is one supported monophthong nucleus", (category, path) => {
    const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
      category.toLowerCase(),
      [syntheticVariant(category.toLowerCase(), `T ${category}2 M`)],
    );
    expect(result.canonicalSpokenVoicePath).toEqual(path);
    expect(result.variants[0].nuclei).toHaveLength(1);
    expect(result.variants[0].nuclei[0].kind).toBe("monophthong_nucleus");
  });

  test("stress is metadata and does not create an event", () => {
    const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "stress",
      [syntheticVariant("stress", "S OW0 OW1 T")],
    );
    expect(result.canonicalSpokenVoicePath).toEqual(["O", "U", "O", "U"]);
    expect(result.variants[0].nuclei.map((nucleus) => nucleus.stress)).toEqual(["0", "1"]);
  });

  test("unknown words fail closed without orthographic substitution", () => {
    const result = resolveCmuDictPronunciationToVoiceV0_1("word-not-in-cmudict-v0-1");
    expect(result).toMatchObject({
      status: "null",
      reasonCode: "PRONUNCIATION_NOT_FOUND",
      canonicalSpokenVoicePath: null,
    });
    expect(buildHeartInstrumentV1("stone").canonicalSpokenVoicePath).toEqual(["O", "U"]);
  });

  test("same-path variants are accepted and different-path variants are Null", () => {
    const same = resolveArpabetPronunciationVariantsToVoiceV0_1("same", [
      syntheticVariant("same", "M AE1 K"),
      syntheticVariant("same", "M AA1 K", "2"),
    ]);
    expect(same.status).toBe("defined");
    expect(same.canonicalSpokenVoicePath).toEqual(["A"]);

    const different = resolveArpabetPronunciationVariantsToVoiceV0_1("different", [
      syntheticVariant("different", "M AE1 K"),
      syntheticVariant("different", "M EH1 K", "2"),
    ]);
    expect(different.status).toBe("null");
    expect(different.reasonCode).toBe("PRONUNCIATION_VARIANT_AMBIGUOUS");
    expect(different.canonicalSpokenVoicePath).toBeNull();
  });

  test("unsupported vowel variants fail closed", () => {
    const unsupported = syntheticVariant("unsupported", "T AX1 M");
    const result = resolveArpabetPronunciationVariantsToVoiceV0_1("unsupported", [unsupported]);
    expect(result.status).toBe("null");
    expect(result.reasonCode).toBe("PRONUNCIATION_VOWEL_CATEGORY_UNSUPPORTED");
  });

  test("the frozen profile covers the complete CMUdict vowel inventory", () => {
    expect(Object.keys(CMUDICT_ARPABET_VOICE_PROFILE_V0_1).sort()).toEqual([
      "AA", "AE", "AH", "AO", "AW", "AY", "EH", "ER", "EY", "IH", "IY", "OW", "OY", "UH", "UW",
    ]);
  });

  test("lookup is deterministic and preserves source variant order", () => {
    const first = lookupCmuDictPronunciationsV0_1("STONE");
    const second = lookupCmuDictPronunciationsV0_1("stone");
    expect(first).toEqual(second);
    expect(first[0]).toMatchObject({ sourceNotation: "ARPABET", sourceForm: "stone", variantOrder: 0 });
  });

  test("Heart exposes orthographic and spoken paths separately", () => {
    const packet = buildHeartInstrumentV1("stone");
    expect(packet.surfaceVowels).toEqual(["O", "E"]);
    expect(packet.orthographicVowels).toEqual(["O", "E"]);
    expect(packet.canonicalSpokenVoicePath).toEqual(["O", "U"]);
    expect(packet.spokenMath7?.values1to7).toEqual([4, 5]);
  });
});
