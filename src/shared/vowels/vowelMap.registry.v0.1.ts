// src/shared/vowels/vowelMap.registry.v0.1.ts
// Universal Vowel Mapper v0.1 — per-language override scaffold.
// v0.1 policy: structure exists, but overrides can be empty.

import type { VowelVoice } from "./vowelVoices.v0.1";

export type LangHintV0_1 = "sq" | "en" | "fr" | "sv" | "zh-pinyin";

export const VOWEL_MAP_OVERRIDES_V0_1: Readonly<
  Record<LangHintV0_1, Partial<Record<string, VowelVoice>>>
> = Object.freeze({
  sq: Object.freeze({}),
  en: Object.freeze({}),
  fr: Object.freeze({}),
  sv: Object.freeze({}),
  "zh-pinyin": Object.freeze({}),
});
