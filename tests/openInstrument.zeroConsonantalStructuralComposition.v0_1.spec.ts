import {
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
  lookupCmuDictPronunciationsV0_1,
  type CmuDictPronunciationVariantV0_1,
} from "@/shared/openInstrument/cmudictArpabetPronunciation.v0_1";
import {
  resolveArpabetPronunciationVariantsToVoiceV0_1,
  resolveCmuDictPronunciationToVoiceV0_1,
} from "@/shared/openInstrument/pronunciationToVoice.v0_1";
import { deriveZeroConsonantalStructuralCompositionV0_1 } from "@/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1";

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

function compose(word: string, pronunciation: string) {
  const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
    word,
    [syntheticVariant(word, pronunciation)],
  );
  return {
    result,
    composition: deriveZeroConsonantalStructuralCompositionV0_1(
      result.variants[0] ?? null,
    ),
  };
}

describe("ZË-RO consonantal structural composition v0.1", () => {
  it("derives the frozen stone and home controls without changing Voice", () => {
    const stone = compose("stone", "S T OW1 N");
    const home = compose("home", "HH OW1 M");

    expect(stone.composition).toMatchObject({
      voicePath: ["O", "U"],
      p: 2,
      i: [],
      s: 1,
      d: [2, 1],
      a: 1,
      r: [],
    });
    expect(home.composition).toMatchObject({
      voicePath: ["O", "U"],
      p: 1,
      i: [],
      s: 1,
      d: [1, 1],
      a: 0,
      r: [],
    });
    expect(stone.result.canonicalSpokenVoicePath).toEqual(
      home.result.canonicalSpokenVoicePath,
    );
    expect(stone.composition).not.toEqual(home.composition);
  });

  it("keeps moving nuclei source-relative and preserves zero inter-regions", () => {
    const cases = [
      ["OW", ["O", "U"]],
      ["EY", ["E", "I"]],
      ["AY", ["A", "I"]],
      ["OY", ["O", "I"]],
      ["AW", ["A", "U"]],
    ] as const;

    for (const [category, voicePath] of cases) {
      const { composition } = compose(
        category.toLowerCase(),
        `T ${category}1 M`,
      );
      expect(composition).toMatchObject({
        voicePath,
        p: 1,
        i: [],
        s: 1,
        d: [1, 1],
        a: 0,
        r: [],
      });
    }

    expect(compose("mother", "M AH1 DH ER0").composition).toMatchObject({
      p: 1,
      i: [1],
      s: 0,
      d: [1, 1, 0],
      a: 1,
    });
    expect(compose("study", "S T AH1 D IY0").composition).toMatchObject({
      p: 2,
      i: [1],
      s: 0,
      d: [2, 1, 0],
      a: 2,
    });
    expect(compose("water", "W AO1 T ER0").composition).toMatchObject({
      p: 1,
      i: [1],
      s: 0,
      d: [1, 1, 0],
      a: 1,
    });
  });

  it("locks the single-nucleus controls and lossy same-ZC projection", () => {
    for (const [word, pronunciation, voicePath] of [
      ["cat", "K AE1 T", ["A"]],
      ["make", "M EY1 K", ["E", "I"]],
      ["time", "T AY1 M", ["A", "I"]],
      ["name", "N EY1 M", ["E", "I"]],
    ] as const) {
      expect(compose(word, pronunciation).composition).toMatchObject({
        voicePath,
        p: 1,
        i: [],
        s: 1,
        d: [1, 1],
        a: 0,
        r: [],
      });
    }

    const make = compose("make", "M EY1 K").composition;
    const name = compose("name", "N EY1 M").composition;
    expect(make?.voicePath).toEqual(name?.voicePath);
    expect(make?.d).toEqual(name?.d);
    expect(make?.a).toEqual(name?.a);
    expect(make?.r).toEqual(name?.r);
    expect(make?.sourceProfileId).toBe(name?.sourceProfileId);
  });

  it("preserves exact repeated consonant identity and source positions", () => {
    const bundled = resolveCmuDictPronunciationToVoiceV0_1("banana");
    const bananaSource = lookupCmuDictPronunciationsV0_1("banana")[0];
    expect(bananaSource?.sourcePronunciation).toBe("B AH0 N AE1 N AH0");
    expect(
      deriveZeroConsonantalStructuralCompositionV0_1(
        bundled.variants[0] ?? null,
      ),
    ).toMatchObject({
      voicePath: ["Ë", "A", "Ë"],
      p: 1,
      i: [1, 1],
      s: 0,
      d: [1, 1, 1, 0],
      a: 1,
      r: [
        {
          identity: ["N"],
          segmentIndices: [2, 4],
          occurrenceCount: 2,
        },
      ],
    });
  });

  it("derives retained variants independently without selecting a winner", () => {
    const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "same-path-variants",
      [
        syntheticVariant("same-path-variants", "M AE1 K"),
        syntheticVariant("same-path-variants", "M AE1 K", "2"),
      ],
    );
    expect(result.status).toBe("defined");
    expect(result.variants.map(deriveZeroConsonantalStructuralCompositionV0_1)).toHaveLength(2);
    expect(
      deriveZeroConsonantalStructuralCompositionV0_1(result.variants[0]),
    ).toMatchObject({
      voicePath: ["A"],
      p: 1,
      i: [],
      s: 1,
      d: [1, 1],
      a: 0,
      r: [],
    });
    expect(
      deriveZeroConsonantalStructuralCompositionV0_1(result.variants[1]),
    ).toMatchObject({
      voicePath: ["A"],
      p: 1,
      i: [],
      s: 1,
      d: [1, 1],
      a: 0,
      r: [],
    });

    const ambiguous = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "ambiguous",
      [
        syntheticVariant("ambiguous", "M AE1 K"),
        syntheticVariant("ambiguous", "M EH1 K", "2"),
      ],
    );
    expect(ambiguous.status).toBe("null");
    expect(ambiguous.canonicalSpokenVoicePath).toBeNull();
    expect(ambiguous.variants.map(deriveZeroConsonantalStructuralCompositionV0_1)).toHaveLength(2);
  });

  it("returns Null for unavailable, malformed, or unsupported authority", () => {
    const missing = resolveCmuDictPronunciationToVoiceV0_1(
      "word-not-in-cmudict-v0-1",
    );
    expect(deriveZeroConsonantalStructuralCompositionV0_1(null)).toBeNull();
    expect(missing.canonicalSpokenVoicePath).toBeNull();

    const malformed = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "malformed",
      [syntheticVariant("malformed", "S COMMENT OW1 N")],
    );
    expect(malformed.status).toBe("defined");
    expect(
      deriveZeroConsonantalStructuralCompositionV0_1(malformed.variants[0]),
    ).toBeNull();

    const unsupported = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "unsupported",
      [syntheticVariant("unsupported", "S AX1 N")],
    );
    expect(unsupported.status).toBe("null");
    expect(
      deriveZeroConsonantalStructuralCompositionV0_1(unsupported.variants[0]),
    ).toBeNull();
  });

  it("is pure, deterministic, frozen, and provenance-bearing", () => {
    const result = resolveCmuDictPronunciationToVoiceV0_1("stone");
    const first = deriveZeroConsonantalStructuralCompositionV0_1(
      result.variants[0],
    );
    const second = deriveZeroConsonantalStructuralCompositionV0_1(
      result.variants[0],
    );
    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(first).toMatchObject({
      sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
      sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
      sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    });
  });
});
