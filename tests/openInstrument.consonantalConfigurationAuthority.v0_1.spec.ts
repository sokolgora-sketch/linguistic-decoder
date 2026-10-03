import fs from "node:fs";

import {
  resolveArpabetPronunciationVariantsToVoiceV0_1,
} from "@/shared/openInstrument/pronunciationToVoice.v0_1";
import {
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
  type CmuDictPronunciationVariantV0_1,
} from "@/shared/openInstrument/cmudictArpabetPronunciation.v0_1";

const CONTRACT_PATH =
  "docs/open-instrument/consonantal-configuration-authority-v0.1.md";

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

function sourceNucleusSegments(
  variant: ReturnType<typeof resolveArpabetPronunciationVariantsToVoiceV0_1>["variants"][number],
) {
  return variant.normalizedSegments.filter(
    (segment) => segment.nucleusIndex !== null,
  );
}

function consonantRegions(
  variant: ReturnType<typeof resolveArpabetPronunciationVariantsToVoiceV0_1>["variants"][number],
) {
  const nuclei = sourceNucleusSegments(variant);
  const consonants = variant.normalizedSegments.filter(
    (segment) => segment.kind === "consonant",
  );

  return {
    prefix: consonants
      .filter((segment) => segment.segmentIndex < (nuclei[0]?.segmentIndex ?? Infinity))
      .map((segment) => segment.sourceUnits.join(" ")),
    inter: nuclei.slice(0, -1).map((left, index) =>
      consonants
        .filter(
          (segment) =>
            segment.segmentIndex > left.segmentIndex &&
            segment.segmentIndex < nuclei[index + 1].segmentIndex,
        )
        .map((segment) => segment.sourceUnits.join(" ")),
    ),
    suffix: consonants
      .filter((segment) => segment.segmentIndex > (nuclei.at(-1)?.segmentIndex ?? -1))
      .map((segment) => segment.sourceUnits.join(" ")),
  };
}

describe("consonantal configuration authority v0.1", () => {
  const contract = fs.readFileSync(CONTRACT_PATH, "utf8");

  it("freezes the structural-only identity and firewalls", () => {
    expect(contract).toContain(
      "CONTRACT_ID=OPEN_INSTRUMENT_CONSONANTAL_CONFIGURATION_AUTHORITY_V0_1",
    );
    expect(contract).toContain("STATUS=FROZEN_STRUCTURAL_AUTHORITY_CONTRACT_ONLY");
    expect(contract).toContain("FUNCTIONAL_BRIDGE_AUTHORITY=NO");
    expect(contract).toContain("PHONOLOGICAL_ROLE_AUTHORITY=NO");
    expect(contract).toContain("CONSONANT_MEANING_AUTHORITY=NO");
    expect(contract).toContain("FUNCTIONAL_COMPOSITION_AUTHORITY=NO");
    expect(contract).toContain("SEMANTIC_AUTHORITY=NO");
    expect(contract).toContain("ORTHOGRAPHIC_AUTHORITY=NO");
    expect(contract).toContain("G2P_AUTHORITY=NO");
  });

  it("uses source-relative regions rather than phonological roles", () => {
    expect(contract).toContain("SOURCE_PREFIX_REGION");
    expect(contract).toContain("SOURCE_INTER_NUCLEUS_REGION");
    expect(contract).toContain("SOURCE_SUFFIX_REGION");
    expect(contract).toContain("The terms `onset`, `coda`, `syllable`,");
    expect(contract).toContain("PHONOLOGICAL_CLAIM=NO");
    expect(contract).toContain("FUNCTIONAL_CLAIM=NO");
    expect(contract).toContain("SEMANTIC_CLAIM=NO");
  });

  it("keeps stone and home structurally distinct while preserving their path", () => {
    const stone = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "stone",
      [syntheticVariant("stone", "S T OW1 N")],
    );
    const home = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "home",
      [syntheticVariant("home", "HH OW1 M")],
    );

    expect(stone.canonicalSpokenVoicePath).toEqual(["O", "U"]);
    expect(home.canonicalSpokenVoicePath).toEqual(["O", "U"]);
    expect(consonantRegions(stone.variants[0])).toEqual({
      prefix: ["S", "T"],
      inter: [],
      suffix: ["N"],
    });
    expect(consonantRegions(home.variants[0])).toEqual({
      prefix: ["HH"],
      inter: [],
      suffix: ["M"],
    });
    expect(consonantRegions(stone.variants[0])).not.toEqual(
      consonantRegions(home.variants[0]),
    );
    expect(contract).toContain("STONE_CONFIGURATION != HOME_CONFIGURATION");
    expect(contract).toContain("does not imply");
  });

  it("anchors moving-nucleus expansion to one source nucleus", () => {
    const movingCases = [
      ["OW", ["O", "U"]],
      ["EY", ["E", "I"]],
      ["AY", ["A", "I"]],
    ] as const;

    for (const [category, events] of movingCases) {
      const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
        category.toLowerCase(),
        [syntheticVariant(category.toLowerCase(), `T ${category}1 M`)],
      );
      expect(result.variants[0].nuclei).toHaveLength(1);
      expect(result.variants[0].nuclei[0].kind).toBe("moving_nucleus");
      expect(result.canonicalSpokenVoicePath).toEqual(events);
      expect(consonantRegions(result.variants[0])).toEqual({
        prefix: ["T"],
        inter: [],
        suffix: ["M"],
      });
    }

    expect(contract).toContain("MOVING_NUCLEUS_CREATES_SOURCE_CONSONANT_REGION=NO");
    expect(contract).toContain("does not create a source consonant region between `O` and `U`.");
  });

  it("represents inter-source-nucleus regions without naming phonological roles", () => {
    const cases = [
      ["mother", "M AH1 DH ER0", ["M"], [["DH"]], []],
      ["study", "S T AH1 D IY0", ["S", "T"], [["D"]], []],
      ["water", "W AO1 T ER0", ["W"], [["T"]], []],
    ] as const;

    for (const [word, pronunciation, prefix, inter, suffix] of cases) {
      const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
        word,
        [syntheticVariant(word, pronunciation)],
      );
      expect(result.status).toBe("defined");
      expect(consonantRegions(result.variants[0])).toEqual({ prefix, inter, suffix });
    }
  });

  it("preserves repeated canonical events as distinct source nuclei", () => {
    const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "mother",
      [syntheticVariant("mother", "M AH1 DH ER0")],
    );
    expect(result.variants[0].nuclei.map((nucleus) => nucleus.sourceToken)).toEqual([
      "AH1",
      "ER0",
    ]);
    expect(result.canonicalSpokenVoicePath).toEqual(["Ë", "Ë"]);
    expect(consonantRegions(result.variants[0]).inter).toEqual([["DH"]]);
  });

  it("keeps pronunciation Null and variant ambiguity fail-closed", () => {
    const missing = resolveArpabetPronunciationVariantsToVoiceV0_1("missing", []);
    expect(missing.status).toBe("null");
    expect(missing.reasonCode).toBe("PRONUNCIATION_NOT_FOUND");
    expect(missing.canonicalSpokenVoicePath).toBeNull();

    const ambiguous = resolveArpabetPronunciationVariantsToVoiceV0_1("ambiguous", [
      syntheticVariant("ambiguous", "M AE1 K"),
      syntheticVariant("ambiguous", "M EH1 K", "2"),
    ]);
    expect(ambiguous.status).toBe("null");
    expect(ambiguous.reasonCode).toBe("PRONUNCIATION_VARIANT_AMBIGUOUS");
    expect(ambiguous.variants).toHaveLength(2);
    expect(ambiguous.canonicalSpokenVoicePath).toBeNull();
    expect(contract).toContain("No configuration is derived from spelling");
  });

  it("does not authorize a functional bridge or change Level-3", () => {
    expect(contract).toContain("Level-3 Voice-pair authority remains unchanged");
    expect(contract).toContain("This contract grants no `(Voice, configuration) -> functional output` rule.");
    expect(contract).toContain("LEVEL3_CHANGED=NO");
    expect(contract).toContain("FRD02_PROMOTION=NO");
  });
});
