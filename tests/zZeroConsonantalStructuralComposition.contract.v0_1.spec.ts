import fs from "node:fs";

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

const CONTRACT_PATH =
  "docs/open-instrument/zero-consonantal-structural-composition-v0.1.md";
const RUNTIME_PROJECTOR_PATH =
  "src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts";

type VoiceVariant = ReturnType<
  typeof resolveArpabetPronunciationVariantsToVoiceV0_1
>["variants"][number];

type Recurrence = Readonly<{
  identity: readonly string[];
  segmentIndices: readonly number[];
  occurrenceCount: number;
}>;

type StructuralComposition = Readonly<{
  voicePath: readonly string[];
  p: number;
  i: readonly number[];
  s: number;
  d: readonly number[];
  a: number;
  r: readonly Recurrence[];
}>;

function syntheticVariant(
  word: string,
  pronunciation: string,
  variantId = "1",
): CmuDictPronunciationVariantV0_1 {
  return {
    lexicalWord: word,
    sourceForm: variantId === "1" ? word : word + "(" + variantId + ")",
    variantId,
    variantOrder: Number(variantId) - 1,
    sourcePronunciation: pronunciation,
    sourceUnits: pronunciation.split(/\s+/u),
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
  };
}

function sourceNucleusSegments(variant: VoiceVariant) {
  return variant.normalizedSegments.filter(
    (segment) => segment.nucleusIndex !== null,
  );
}

function deriveStructuralComposition(
  result: ReturnType<typeof resolveArpabetPronunciationVariantsToVoiceV0_1>,
  variantIndex = 0,
): StructuralComposition | null {
  if (
    result.status !== "defined" ||
    result.canonicalSpokenVoicePath === null
  ) {
    return null;
  }

  const variant = result.variants[variantIndex];
  if (!variant || variant.canonicalVoicePath === null) return null;

  const nuclei = sourceNucleusSegments(variant);
  const consonants = variant.normalizedSegments.filter(
    (segment) => segment.kind === "consonant",
  );
  const prefix = consonants.filter(
    (segment) =>
      segment.segmentIndex <
      (nuclei[0]?.segmentIndex ?? Number.POSITIVE_INFINITY),
  );
  const inter = nuclei.slice(0, -1).map((left, index) =>
    consonants.filter(
      (segment) =>
        segment.segmentIndex > left.segmentIndex &&
        segment.segmentIndex < nuclei[index + 1].segmentIndex,
    ),
  );
  const suffix = consonants.filter(
    (segment) =>
      segment.segmentIndex > (nuclei.at(-1)?.segmentIndex ?? -1),
  );

  const recurrenceByIdentity = new Map<
    string,
    { identity: readonly string[]; segmentIndices: number[] }
  >();
  for (const segment of consonants) {
    const identity = [...segment.sourceUnits];
    const key = JSON.stringify(identity);
    const current = recurrenceByIdentity.get(key) ?? {
      identity,
      segmentIndices: [],
    };
    current.segmentIndices.push(segment.segmentIndex);
    recurrenceByIdentity.set(key, current);
  }

  const r = [...recurrenceByIdentity.values()]
    .filter((entry) => entry.segmentIndices.length > 1)
    .sort((left, right) => left.segmentIndices[0] - right.segmentIndices[0])
    .map((entry) => ({
      identity: entry.identity,
      segmentIndices: [...entry.segmentIndices],
      occurrenceCount: entry.segmentIndices.length,
    }));

  const p = prefix.length;
  const i = inter.map((region) => region.length);
  const s = suffix.length;

  return {
    voicePath: [...result.canonicalSpokenVoicePath],
    p,
    i,
    s,
    d: [p, ...i, s],
    a: p - s,
    r,
  };
}

function compose(word: string, pronunciation: string) {
  const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
    word,
    [syntheticVariant(word, pronunciation)],
  );
  return {
    result,
    composition: deriveStructuralComposition(result),
  };
}

describe("ZË-RO consonantal structural composition rule v0.1", () => {
  const contract = fs.readFileSync(CONTRACT_PATH, "utf8");

  it("freezes the rule identity, claim level, and production boundary", () => {
    expect(contract).toContain(
      "CONTRACT_ID=OPEN_INSTRUMENT_ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_V0_1",
    );
    expect(contract).toContain(
      "STATUS=FROZEN_ZË-RO_STRUCTURAL_INTERPRETATION_CONTRACT_ONLY",
    );
    expect(contract).toContain("CLAIM_LEVEL=ZË-RO_STRUCTURAL_INTERPRETATION");
    expect(contract).toContain("EXTERNAL_LINGUISTIC_AUTHORITY_REQUIRED=NO");
    expect(contract).toContain("RUNTIME_IMPLEMENTATION=NO");
    expect(fs.existsSync(RUNTIME_PROJECTOR_PATH)).toBe(true);
  });

  it("freezes P, I, S, D, A, and R exactly", () => {
    expect(contract).toContain("ZC_v0_1(Γ) = <P, I, S, D, A, R>");
    expect(contract).toContain(
      "P is the number of consonant source segments in SOURCE_PREFIX_REGION.",
    );
    expect(contract).toContain(
      "I is the ordered vector of consonant source-segment counts for every",
    );
    expect(contract).toContain("D = [P, ...I, S]");
    expect(contract).toContain("A = P - S");
    expect(contract).toContain(
      "R preserves repeated exact consonant source identities",
    );
    expect(contract).toContain("If no consonant identity repeats, R = [].");
    expect(contract).toContain(
      "An unrecognized inline annotation, comment token, malformed",
    );
    expect(contract).toContain(
      "ZC_v0_1 does not strip, split, or reinterpret such a token as a consonant.",
    );
  });

  it("projects stone and home with the same Voice path but different ZC", () => {
    const stone = compose("stone", "S T OW1 N");
    const home = compose("home", "HH OW1 M");

    expect(stone.composition).toEqual({
      voicePath: ["O", "U"],
      p: 2,
      i: [],
      s: 1,
      d: [2, 1],
      a: 1,
      r: [],
    });
    expect(home.composition).toEqual({
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
    expect(contract).toContain(
      "This does not authorize a semantic difference.",
    );
  });

  it("keeps moving nuclei as one source nucleus", () => {
    const cases = [
      ["OW", ["O", "U"]],
      ["EY", ["E", "I"]],
      ["AY", ["A", "I"]],
      ["OY", ["O", "I"]],
      ["AW", ["A", "U"]],
    ] as const;

    for (const [category, voicePath] of cases) {
      const { result, composition } = compose(
        category.toLowerCase(),
        "T " + category + "1 M",
      );
      expect(result.variants[0].nuclei).toHaveLength(1);
      expect(result.variants[0].nuclei[0].kind).toBe("moving_nucleus");
      expect(composition).toEqual({
        voicePath,
        p: 1,
        i: [],
        s: 1,
        d: [1, 1],
        a: 0,
        r: [],
      });
    }

    expect(contract).toContain(
      "These mappings do not create an inter-nucleus region inside one source",
    );
  });

  it("preserves multi-nucleus load topology and zero-length regions", () => {
    expect(compose("mother", "M AH1 DH ER0").composition).toEqual({
      voicePath: ["Ë", "Ë"],
      p: 1,
      i: [1],
      s: 0,
      d: [1, 1, 0],
      a: 1,
      r: [],
    });
    expect(compose("study", "S T AH1 D IY0").composition).toEqual({
      voicePath: ["Ë", "I"],
      p: 2,
      i: [1],
      s: 0,
      d: [2, 1, 0],
      a: 2,
      r: [],
    });
    expect(compose("water", "W AO1 T ER0").composition).toEqual({
      voicePath: ["O", "Ë"],
      p: 1,
      i: [1],
      s: 0,
      d: [1, 1, 0],
      a: 1,
      r: [],
    });
  });

  it("locks the single-nucleus control vectors", () => {
    for (const [word, pronunciation, voicePath] of [
      ["cat", "K AE1 T", ["A"]],
      ["make", "M EY1 K", ["E", "I"]],
      ["time", "T AY1 M", ["A", "I"]],
      ["name", "N EY1 M", ["E", "I"]],
    ] as const) {
      expect(compose(word, pronunciation).composition).toEqual({
        voicePath,
        p: 1,
        i: [],
        s: 1,
        d: [1, 1],
        a: 0,
        r: [],
      });
    }
  });

  it("preserves exact repeated source identity and positions in R", () => {
    const bundled = resolveCmuDictPronunciationToVoiceV0_1("banana");
    const bananaSource = lookupCmuDictPronunciationsV0_1("banana")[0];
    expect(bananaSource).toBeDefined();
    expect(bananaSource?.sourcePronunciation).toBe("B AH0 N AE1 N AH0");
    expect(deriveStructuralComposition(bundled)).toEqual({
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
    expect(contract).toContain("No phonological equivalence");
    expect(contract).toContain("class is introduced.");
  });

  it("returns Null for unavailable or ambiguous top-level authority", () => {
    const missing = resolveCmuDictPronunciationToVoiceV0_1(
      "word-not-in-cmudict-v0-1",
    );
    expect(missing.status).toBe("null");
    expect(missing.canonicalSpokenVoicePath).toBeNull();
    expect(deriveStructuralComposition(missing)).toBeNull();

    const ambiguous = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "ambiguous",
      [
        syntheticVariant("ambiguous", "M AE1 K"),
        syntheticVariant("ambiguous", "M EH1 K", "2"),
      ],
    );
    expect(ambiguous.status).toBe("null");
    expect(ambiguous.reasonCode).toBe("PRONUNCIATION_VARIANT_AMBIGUOUS");
    expect(deriveStructuralComposition(ambiguous)).toBeNull();
    expect(contract).toContain("NULL is not ZERO_CONFIGURATION.");
    expect(contract).toContain("No zero vector is fabricated");
  });

  it("preserves per-variant derivation without selecting a winner", () => {
    const result = resolveArpabetPronunciationVariantsToVoiceV0_1(
      "same-path-variants",
      [
        syntheticVariant("same-path-variants", "M AE1 K"),
        syntheticVariant("same-path-variants", "M AE1 K", "2"),
      ],
    );
    expect(result.status).toBe("defined");
    expect(result.variants).toHaveLength(2);
    expect(deriveStructuralComposition(result, 0)).toEqual(
      deriveStructuralComposition(result, 1),
    );
    expect(contract).toContain(
      "The rule does not select pronunciation winners.",
    );
  });

  it("freezes the eight gates, anti-tuning rule, and future validation boundary", () => {
    for (const gate of [
      "G1 DETERMINISTIC",
      "G2 PREDECLARED",
      "G3 SOURCE-BOUNDED",
      "G4 NULL-CAPABLE",
      "G5 PROVENANCE-BEARING",
      "G6 CLAIM-LABELED",
      "G7 BOUNDED",
      "G8 WORD-INDEPENDENT",
    ]) {
      expect(contract).toContain(gate);
    }
    expect(contract).toContain(
      "This v0.1 rule is frozen before corpus-scale validation.",
    );
    expect(contract).toContain(
      "The planned first validation source is the exact existing bundled",
    );
    expect(contract).toContain(
      "Albanian remains a separate future cross-language lane.",
    );
    expect(contract).toContain("Kabashi response is");
    expect(contract).toContain("not required for this contract freeze.");
  });

  it("keeps downstream and semantic firewalls explicit", () => {
    expect(contract).toContain("VOICE_PATH_CHANGED=NO");
    expect(contract).toContain("LEVEL3_CHANGED=NO");
    expect(contract).toContain("SEMANTIC_FUNCTION=NOT_CLAIMED");
    expect(contract).toContain("PHONOLOGICAL_ANALYSIS=NOT_CLAIMED");
    expect(contract).toContain("No later arrow is authorized by this contract.");
    expect(contract).toContain("This contract does not authorize:");
  });
});
