import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

import {
  SEVEN_VOICE_ALBANIAN_REOPEN_POSTURE_V0_1,
  SEVEN_VOICE_ATOMIC_IPA_REWRITES_V0_1,
  SEVEN_VOICE_CATEGORY_FOLDS_V0_1,
  SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1,
  SEVEN_VOICE_LEGACY_IPA_MAP_STATUS_V0_1,
  SEVEN_VOICE_NON_VOICE_FEATURE_POLICY_V0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_BOUNDARY_V0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_ID_V0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_V0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_SCHEMA_V0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_STATUS_V0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1,
  SEVEN_VOICE_SYMBOL_TO_CATEGORY_REFERENCE_V0_1,
  SEVEN_VOICE_VALUES_V0_1,
  classifyReferenceIpaSymbolV0_1,
  quantizeSevenVoicePhonologicalCategoryV0_1,
  quantizeWithNonVoiceFeaturesV0_1,
} from "@/shared/openInstrument/sevenVoicePhonologicalCategoryAuthority.v0_1";

const contractDoc = readFileSync(
  "docs/open-instrument/seven-voice-phonological-category-authority-contract-v0.1.md",
  "utf8",
);

describe("Seven-Voice phonological category authority contract v0.1", () => {
  it("freezes the contract document bytes", () => {
    expect(Buffer.byteLength(contractDoc, "utf8")).toBe(6014);
    expect(createHash("sha256").update(contractDoc, "utf8").digest("hex")).toBe(
      "af5cdb723e5d09800ca764521acc769164e9fb144686b72ac1f6568cc79f7496",
    );
  });

  it("freezes the contract identity and exact canonical inventories", () => {
    expect(SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_SCHEMA_V0_1).toBe(
      "open-instrument.seven-voice-phonological-category-authority.v0_1",
    );
    expect(SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_ID_V0_1).toBe(
      "OPEN_INSTRUMENT_SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_V0_1",
    );
    expect(SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_STATUS_V0_1).toBe(
      "FROZEN_CANONICAL_CATEGORY_QUANTIZER_ONLY",
    );
    expect(SEVEN_VOICE_VALUES_V0_1).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
    expect(SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1).toEqual([
      "HIGH_FRONT_UNROUNDED",
      "HIGH_FRONT_ROUNDED",
      "HIGH_BACK",
      "MID_FRONT_UNROUNDED",
      "CENTRAL_NON_CLOSE",
      "MID_BACK",
      "LOW_OPEN",
    ]);
  });

  it("maps every valid category to exactly one canonical Voice", () => {
    expect(Object.keys(SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1)).toHaveLength(7);
    expect(new Set(Object.values(SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1)).size).toBe(7);
    for (const category of SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1) {
      expect(quantizeSevenVoicePhonologicalCategoryV0_1(category)).toBe(
        SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1[category],
      );
    }
  });

  it("keeps Y canonical and distinguishes the I/Y routes", () => {
    expect(SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1.HIGH_FRONT_UNROUNDED).toBe("I");
    expect(SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1.HIGH_FRONT_ROUNDED).toBe("Y");
    expect(classifyReferenceIpaSymbolV0_1("i")).toEqual(
      expect.objectContaining({ category: "HIGH_FRONT_UNROUNDED", voice: "I" }),
    );
    expect(classifyReferenceIpaSymbolV0_1("y")).toEqual(
      expect.objectContaining({ category: "HIGH_FRONT_ROUNDED", voice: "Y" }),
    );
  });

  it("covers the complete frozen symbol reference policy", () => {
    const expected: Record<string, [string, string]> = {
      i: ["HIGH_FRONT_UNROUNDED", "I"],
      ɪ: ["HIGH_FRONT_UNROUNDED", "I"],
      y: ["HIGH_FRONT_ROUNDED", "Y"],
      ʏ: ["HIGH_FRONT_ROUNDED", "Y"],
      ø: ["HIGH_FRONT_ROUNDED", "Y"],
      œ: ["HIGH_FRONT_ROUNDED", "Y"],
      e: ["MID_FRONT_UNROUNDED", "E"],
      ɛ: ["MID_FRONT_UNROUNDED", "E"],
      ɨ: ["HIGH_FRONT_UNROUNDED", "I"],
      ʉ: ["HIGH_FRONT_ROUNDED", "Y"],
      ɘ: ["CENTRAL_NON_CLOSE", "Ë"],
      ə: ["CENTRAL_NON_CLOSE", "Ë"],
      ɜ: ["CENTRAL_NON_CLOSE", "Ë"],
      ɵ: ["CENTRAL_NON_CLOSE", "Ë"],
      ɞ: ["CENTRAL_NON_CLOSE", "Ë"],
      ʌ: ["CENTRAL_NON_CLOSE", "Ë"],
      u: ["HIGH_BACK", "U"],
      ʊ: ["HIGH_BACK", "U"],
      ɯ: ["HIGH_BACK", "U"],
      o: ["MID_BACK", "O"],
      ɔ: ["MID_BACK", "O"],
      ɤ: ["MID_BACK", "O"],
      a: ["LOW_OPEN", "A"],
      æ: ["LOW_OPEN", "A"],
      ɑ: ["LOW_OPEN", "A"],
      ɒ: ["LOW_OPEN", "A"],
      ɐ: ["LOW_OPEN", "A"],
      ɶ: ["LOW_OPEN", "A"],
    };
    expect(Object.keys(SEVEN_VOICE_SYMBOL_TO_CATEGORY_REFERENCE_V0_1).sort()).toEqual(
      Object.keys(expected).sort(),
    );
    for (const [symbol, [category, voice]] of Object.entries(expected)) {
      expect(classifyReferenceIpaSymbolV0_1(symbol)).toEqual(
        expect.objectContaining({ status: "SUPPORTED", category, voice }),
      );
    }
  });

  it("applies only the two atomic rewrites and preserves the ʌ exception", () => {
    expect(SEVEN_VOICE_ATOMIC_IPA_REWRITES_V0_1).toEqual({ ɚ: "ə", ɝ: "ɜ" });
    expect(classifyReferenceIpaSymbolV0_1("ɚ")).toEqual(
      expect.objectContaining({ normalizedSymbol: "ə", category: "CENTRAL_NON_CLOSE", voice: "Ë" }),
    );
    expect(classifyReferenceIpaSymbolV0_1("ɝ")).toEqual(
      expect.objectContaining({ normalizedSymbol: "ɜ", category: "CENTRAL_NON_CLOSE", voice: "Ë" }),
    );
    expect(classifyReferenceIpaSymbolV0_1("ʌ")).toEqual(
      expect.objectContaining({ category: "CENTRAL_NON_CLOSE", voice: "Ë" }),
    );
    expect(classifyReferenceIpaSymbolV0_1("ɤ")).toEqual(
      expect.objectContaining({ category: "MID_BACK", voice: "O" }),
    );
  });

  it("keeps non-Voice features as metadata", () => {
    expect(SEVEN_VOICE_NON_VOICE_FEATURE_POLICY_V0_1).toEqual(
      expect.objectContaining({
        length: expect.stringContaining("does not alter Voice identity"),
        nasalization: expect.stringContaining("does not alter Voice identity"),
        stress: expect.stringContaining("does not create a Voice event"),
        tone: expect.stringContaining("does not alter Voice identity"),
      }),
    );
    const features = { length: "LONG", nasalization: "PRESENT", stress: "1", tone: null } as const;
    expect(quantizeWithNonVoiceFeaturesV0_1("LOW_OPEN", features)).toEqual({
      voice: "A",
      features,
    });
    expect(quantizeWithNonVoiceFeaturesV0_1("HIGH_FRONT_UNROUNDED", {
      ...features,
      length: "NONE_RECORDED",
      nasalization: "NOT_RECORDED",
    })).toEqual(expect.objectContaining({ voice: "I" }));
  });

  it("returns Null only for unsupported reference symbols", () => {
    expect(classifyReferenceIpaSymbolV0_1("x")).toEqual({
      status: "NULL",
      rawSymbol: "x",
      normalizedSymbol: "x",
      category: null,
      voice: null,
      reasonCode: "IPA_SYMBOL_NOT_QUANTIZABLE",
    });
    for (const category of SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1) {
      expect(quantizeSevenVoicePhonologicalCategoryV0_1(category)).not.toBeNull();
    }
  });

  it("keeps the authority boundary separate from parsing, dialect, semantics, and canonicalization", () => {
    expect(SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_BOUNDARY_V0_1).toEqual(
      expect.objectContaining({
        canonicalCategoriesDefined: true,
        categoryToVoiceQuantizerDefined: true,
        rawIpaParsingDefined: false,
        dialectClassificationDefined: false,
        movingNucleusSegmentationDefined: false,
        g2pDefined: false,
        spellingAuthorityDefined: false,
        semanticAuthorityDefined: false,
        etymologicalAuthorityDefined: false,
        downstreamCanonicalizationDefined: false,
      }),
    );
    expect(SEVEN_VOICE_LEGACY_IPA_MAP_STATUS_V0_1).toEqual(
      expect.objectContaining({
        status: "LEGACY_COARSE_BUCKET",
        authoritative: false,
        callSiteMigration: false,
        replacementByThisContract: false,
      }),
    );
    expect(SEVEN_VOICE_ALBANIAN_REOPEN_POSTURE_V0_1).toEqual(
      expect.objectContaining({
        currentState: "REOPEN_CONDITION_SATISFIED_BY_NEW_DOCTRINE_AUTHORITY",
        bridgeDefined: false,
        runtimeWiringDefined: false,
      }),
    );
    expect(contractDoc).toContain("IPA_TO_VOICE_AUTHORITY");
    expect(contractDoc).toContain("IPA_TO_VOICE_AUTHORITY` for arbitrary unreviewed input");
    expect(contractDoc).toContain("ORTHOGRAPHIC_AUTHORITY = NO");
    expect(contractDoc).toContain("G2P_AUTHORITY = NO");
    expect(contractDoc).toContain("MOVING_NUCLEUS_AUTHORITY = NOT_DEFINED_HERE");
    expect(contractDoc).toContain("SEMANTIC_AUTHORITY = NO");
    expect(contractDoc).toContain("moving-nucleus interpreter");
    expect(contractDoc).toContain("ALBANIAN_UNSPECIFIED");
  });

  it("deep-freezes the contract structures", () => {
    expect(Object.isFrozen(SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_V0_1)).toBe(true);
    expect(Object.isFrozen(SEVEN_VOICE_VALUES_V0_1)).toBe(true);
    expect(Object.isFrozen(SEVEN_VOICE_CATEGORY_TO_VOICE_V0_1)).toBe(true);
    expect(Object.isFrozen(SEVEN_VOICE_CATEGORY_FOLDS_V0_1)).toBe(true);
    expect(Object.isFrozen(SEVEN_VOICE_CATEGORY_FOLDS_V0_1[0])).toBe(true);
  });
});
