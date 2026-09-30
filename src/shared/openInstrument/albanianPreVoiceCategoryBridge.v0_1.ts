import {
  type AlbanianPhonologicalCategoryV0_1,
} from "./albanianPhonologicalNucleusAuthority.v0_1";
import type { SevenVoicePhonologicalCategoryV0_1 } from "./sevenVoicePhonologicalCategoryAuthority.v0_1";

export const ALBANIAN_PRE_VOICE_CATEGORY_BRIDGE_SCHEMA_V0_1 =
  "open-instrument.albanian-pre-voice-category-bridge.v0_1" as const;

export const ALBANIAN_PRE_VOICE_CATEGORY_TO_CANONICAL_CATEGORY_V0_1 = Object.freeze({
  HIGH_FRONT_UNROUNDED: "HIGH_FRONT_UNROUNDED",
  HIGH_FRONT_ROUNDED: "HIGH_FRONT_ROUNDED",
  HIGH_BACK_ROUNDED: "HIGH_BACK",
  MID_FRONT_UNROUNDED: "MID_FRONT_UNROUNDED",
  CENTRAL_MID: "CENTRAL_NON_CLOSE",
  MID_BACK_ROUNDED: "MID_BACK",
  LOW_CENTRAL_OR_BACK: "LOW_OPEN",
} as const satisfies Readonly<
  Record<AlbanianPhonologicalCategoryV0_1, SevenVoicePhonologicalCategoryV0_1>
>);

export function bridgeAlbanianPreVoiceCategoryToCanonicalV0_1(
  category: AlbanianPhonologicalCategoryV0_1,
): SevenVoicePhonologicalCategoryV0_1 {
  return ALBANIAN_PRE_VOICE_CATEGORY_TO_CANONICAL_CATEGORY_V0_1[category];
}
