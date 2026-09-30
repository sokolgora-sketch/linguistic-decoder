import { readFileSync } from "node:fs";

import {
  ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1,
} from "@/shared/openInstrument/albanianPhonologicalNucleusAuthority.v0_1";
import {
  ALBANIAN_PRE_VOICE_CATEGORY_BRIDGE_SCHEMA_V0_1,
  ALBANIAN_PRE_VOICE_CATEGORY_TO_CANONICAL_CATEGORY_V0_1,
  bridgeAlbanianPreVoiceCategoryToCanonicalV0_1,
} from "@/shared/openInstrument/albanianPreVoiceCategoryBridge.v0_1";
import {
  quantizeSevenVoicePhonologicalCategoryV0_1,
  SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1,
} from "@/shared/openInstrument/sevenVoicePhonologicalCategoryAuthority.v0_1";

const bridgeSource = readFileSync(
  "src/shared/openInstrument/albanianPreVoiceCategoryBridge.v0_1.ts",
  "utf8",
);

describe("Albanian pre-Voice category bridge v0.1", () => {
  it("freezes the typed category-only bridge identity", () => {
    expect(ALBANIAN_PRE_VOICE_CATEGORY_BRIDGE_SCHEMA_V0_1).toBe(
      "open-instrument.albanian-pre-voice-category-bridge.v0_1",
    );
    expect(Object.keys(ALBANIAN_PRE_VOICE_CATEGORY_TO_CANONICAL_CATEGORY_V0_1)).toHaveLength(7);
    expect(ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1).toHaveLength(7);
    expect(Object.keys(ALBANIAN_PRE_VOICE_CATEGORY_TO_CANONICAL_CATEGORY_V0_1).sort()).toEqual(
      [...ALBANIAN_PHONOLOGICAL_CATEGORY_VALUES_V0_1].sort(),
    );
    expect(Object.isFrozen(ALBANIAN_PRE_VOICE_CATEGORY_TO_CANONICAL_CATEGORY_V0_1)).toBe(true);
  });

  it.each([
    ["HIGH_FRONT_UNROUNDED", "HIGH_FRONT_UNROUNDED", "I"],
    ["HIGH_FRONT_ROUNDED", "HIGH_FRONT_ROUNDED", "Y"],
    ["HIGH_BACK_ROUNDED", "HIGH_BACK", "U"],
    ["MID_FRONT_UNROUNDED", "MID_FRONT_UNROUNDED", "E"],
    ["CENTRAL_MID", "CENTRAL_NON_CLOSE", "Ë"],
    ["MID_BACK_ROUNDED", "MID_BACK", "O"],
    ["LOW_CENTRAL_OR_BACK", "LOW_OPEN", "A"],
  ] as const)("maps %s to %s and then to %s through the canonical quantizer", (
    albanianCategory,
    canonicalCategory,
    voice,
  ) => {
    expect(bridgeAlbanianPreVoiceCategoryToCanonicalV0_1(albanianCategory)).toBe(
      canonicalCategory,
    );
    expect(
      quantizeSevenVoicePhonologicalCategoryV0_1(
        bridgeAlbanianPreVoiceCategoryToCanonicalV0_1(albanianCategory),
      ),
    ).toBe(voice);
  });

  it("does not contain a direct Albanian-category-to-Voice table", () => {
    expect(bridgeSource).not.toMatch(/HIGH_BACK_ROUNDED\s*:\s*["']U["']/u);
    expect(bridgeSource).not.toMatch(/CENTRAL_MID\s*:\s*["']Ë["']/u);
    expect(bridgeSource).not.toMatch(/MID_BACK_ROUNDED\s*:\s*["']O["']/u);
    expect(bridgeSource).not.toMatch(/LOW_CENTRAL_OR_BACK\s*:\s*["']A["']/u);
  });

  it("uses only canonical category outputs", () => {
    expect(Object.values(ALBANIAN_PRE_VOICE_CATEGORY_TO_CANONICAL_CATEGORY_V0_1)).toEqual(
      expect.arrayContaining([...SEVEN_VOICE_PHONOLOGICAL_CATEGORY_VALUES_V0_1]),
    );
    expect(Object.values(ALBANIAN_PRE_VOICE_CATEGORY_TO_CANONICAL_CATEGORY_V0_1)).toHaveLength(7);
    expect(bridgeSource).not.toContain("rawIpa");
    expect(bridgeSource).not.toContain("orthograph");
    expect(bridgeSource).not.toContain("G2P");
    expect(bridgeSource).not.toContain("semantic");
    expect(bridgeSource).not.toContain("etymolog");
    expect(bridgeSource).not.toContain("canonicalizeMovingNucleus");
  });
});
