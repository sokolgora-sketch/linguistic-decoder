import { extractSevenVowelsFromString, totalMod7FromString } from "@/shared/math7.core";

test("math7 uses mapVowels v0.2 for Greek (μέτρο)", () => {
  expect(extractSevenVowelsFromString("μέτρο")).toEqual(["E", "O"]);
  expect(totalMod7FromString("μέτρο")).toBe(4); // 1+3 = 4
});

test("math7 uses mapVowels v0.2 for Greek polytonic (ὕδωρ)", () => {
  expect(extractSevenVowelsFromString("ὕδωρ")).toEqual(["Y", "O"]);
  expect(totalMod7FromString("ὕδωρ")).toBe(1); // 5+3 = 8 -> 1
});
