import { VOWEL_TRAITS } from "@/core/sevenVowelsTraits";
import { defaultManifest } from "@/engine/manifest";
import { VOWELS, VOWEL_INDEX as CORE_INDEX, VOWEL_RING } from "@/core/sevenVowelsCore";
import { SEVEN_VOWELS, VOWEL_INDEX } from "@/shared/math7.core";
import { sevenVoiceRegistry, symbolicMathOrder } from "@/shared/sevenVoiceOrderedViews.v0.1";
import { SEVEN_PRINCIPLES } from "@/shared/sevenPrinciples.v1";
import { mirrorIndex, ringOfIndex, type Index1 } from "@/shared/sevenPrinciples.math.v1";
import { VOWEL_VOICES_V0_1, isVowelVoice } from "@/shared/vowels/vowelVoices.v0.1";
import { mapVowelsV0_2 } from "@/shared/vowels/mapVowels.v0.2";
import { analyzeWordV1 } from "@/v1/analyzeWordV1";
import { SEVEN_VOWELS as V1_VOWELS, value1to7 } from "@/v1/math7.core.v1";

it("uses exactly the canonical seven voices across active symbolic consumers", () => {
  expect(symbolicMathOrder).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
  for (const order of [VOWELS, SEVEN_VOWELS, V1_VOWELS, VOWEL_VOICES_V0_1]) {
    expect(order).toEqual(symbolicMathOrder);
    expect(new Set(order).size).toBe(7);
  }
  expect(isVowelVoice("Y")).toBe(true);
  expect(isVowelVoice("V8")).toBe(false);
});

it("keeps all indices, rings, colors, and mirrors consistent with the registry", () => {
  symbolicMathOrder.forEach((voice, index) => {
    const entry = sevenVoiceRegistry[voice];
    const position = (index + 1) as Index1;
    expect(entry.symbolicMathIndex).toBe(position);
    expect(entry.math7Value).toBe(position);
    expect(CORE_INDEX[voice]).toBe(index);
    expect(VOWEL_INDEX[voice]).toBe(index);
    expect(value1to7(voice)).toBe(position);
    expect(VOWEL_RING[voice]).toBe(entry.symbolicRing);
    expect(ringOfIndex(position)).toBe(entry.symbolicRing);
    expect(SEVEN_PRINCIPLES[voice].color).toBe(entry.symbolicColor);
    expect(VOWEL_TRAITS[voice].color).toBe(entry.symbolicColor);
    expect(defaultManifest.ringIndex[voice]).toBe(entry.symbolicRing);
    expect(defaultManifest.levelIndex[voice]).toBe({ high: 1, mid: 0, low: -1 }[entry.symbolicLevel]);
    expect(mirrorIndex(mirrorIndex(position))).toBe(position);
    expect(ringOfIndex(mirrorIndex(position))).toBe(entry.symbolicRing);
  });
  expect(symbolicMathOrder.map(v => sevenVoiceRegistry[v].symbolicLevel)).toEqual(["high", "high", "high", "mid", "low", "low", "low"]);
  expect(symbolicMathOrder.map(v => VOWEL_RING[v])).toEqual([3, 2, 1, 0, 1, 2, 3]);
  expect(sevenVoiceRegistry.O.symbolicMathIndex).toBe(4);
  expect(VOWEL_RING.O).toBe(0);
});

it("projects unchanged canonical numbers into the active v1 evidence contract", () => {
  const evidence = analyzeWordV1("aeiouyë").evidence;
  expect(evidence.surfaceVowels).toEqual(symbolicMathOrder);
  expect(evidence.math7.indices).toEqual([0, 1, 2, 3, 4, 5, 6]);
  expect(evidence.math7.sum).toBe(21);
  expect(evidence.math7.totalMod7).toBe(0);
});

it("keeps explicit Turkish consonantal y scoped to that request", () => {
  expect(mapVowelsV0_2({ word: "yol" }).voices).toEqual(["Y", "O"]);
  expect(mapVowelsV0_2({ word: "yol", langHint: "tr" }).voices).toEqual(["O"]);
  expect(mapVowelsV0_2({ word: "yol" }).voices).toEqual(["Y", "O"]);
  expect(isVowelVoice("Y")).toBe(true);
});
