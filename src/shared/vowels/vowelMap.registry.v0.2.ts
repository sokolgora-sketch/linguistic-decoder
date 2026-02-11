// src/shared/vowels/vowelMap.registry.v0.2.ts
// Universal Vowel Mapper v0.2 — per-language override scaffold.
// v0.2 adds Greek ("el") as a supported hint.

import type { VowelVoice } from "./vowelVoices.v0.1";

export type LangHintV0_2 = "sq" | "en" | "fr" | "sv" | "zh-pinyin" | "el";

export const VOWEL_MAP_OVERRIDES_V0_2: Readonly<
  Record<LangHintV0_2, Partial<Record<string, VowelVoice>>>
> = Object.freeze({
  sq: Object.freeze({}),
  en: Object.freeze({}),
  fr: Object.freeze({}),
  sv: Object.freeze({}),
  "zh-pinyin": Object.freeze({}),
  el: Object.freeze({}),
});
