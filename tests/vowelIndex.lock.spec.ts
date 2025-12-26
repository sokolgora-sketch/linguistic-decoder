import { SEVEN_VOWELS as M7_VOWELS, VOWEL_INDEX as M7_INDEX } from "@/shared/math7.core";
import { VOWELS as CORE_VOWELS, VOWEL_INDEX as CORE_INDEX } from "@/core/sevenVowelsCore";

describe("Vowel index lock: math7.core ↔ sevenVowelsCore", () => {
  it("vowel order matches exactly", () => {
    expect(CORE_VOWELS).toEqual(M7_VOWELS);
  });

  it("vowel indices match exactly", () => {
    for (const v of M7_VOWELS) {
      expect(CORE_INDEX[v]).toBe(M7_INDEX[v]);
    }
  });
});
