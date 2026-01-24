import { VOWELS } from "@/core/sevenVowelsCore";
import { SEVEN_VOWELS } from "@/shared/math7.core";
import {
  VOWELS_7,
  SEVEN_PRINCIPLES,
  canonSanityCheck,
  extractVowelPath,
  vowelToColor,
  vowelToNote,
  vowelToRingIndex,
  vowelToIndex1,
} from "@/shared/sevenPrinciples.v1";

describe("Seven Principles Law v1 (constitution)", () => {
  it("fixed order is A,E,I,O,U,Y,Ë (core + shared + law)", () => {
    expect([...VOWELS]).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
    expect([...SEVEN_VOWELS]).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
    expect([...VOWELS_7]).toEqual(["A", "E", "I", "O", "U", "Y", "Ë"]);
  });

  it("canon sanity check passes", () => {
    const chk = canonSanityCheck();
    expect(chk.ok).toBe(true);
    expect(chk.problems).toEqual([]);
  });

  it("locks key invariants", () => {
    expect(SEVEN_PRINCIPLES.O.polarity).toBe("neutral");
    expect(vowelToIndex1("O")).toBe(4);

    // ringIndex (0..3)
    expect(vowelToRingIndex("O")).toBe(0);
    expect(vowelToRingIndex("I")).toBe(1);
    expect(vowelToRingIndex("U")).toBe(1);
    expect(vowelToRingIndex("E")).toBe(2);
    expect(vowelToRingIndex("Y")).toBe(2);
    expect(vowelToRingIndex("A")).toBe(3);
    expect(vowelToRingIndex("Ë")).toBe(3);

    // colors
    expect(vowelToColor("A")).toBe("red");
    expect(vowelToColor("E")).toBe("orange");
    expect(vowelToColor("I")).toBe("yellow");
    expect(vowelToColor("O")).toBe("green");
    expect(vowelToColor("U")).toBe("blue");
    expect(vowelToColor("Y")).toBe("indigo");
    expect(vowelToColor("Ë")).toBe("violet");

    // notes
    expect(vowelToNote("A")).toBe("C");
    expect(vowelToNote("E")).toBe("D");
    expect(vowelToNote("I")).toBe("E");
    expect(vowelToNote("O")).toBe("F");
    expect(vowelToNote("U")).toBe("G");
    expect(vowelToNote("Y")).toBe("A");
    expect(vowelToNote("Ë")).toBe("B");
  });

  it("extractVowelPath is strict", () => {
    expect(extractVowelPath("study")).toEqual(["U", "Y"]);
    expect(extractVowelPath("yë")).toEqual(["Y", "Ë"]);
    expect(extractVowelPath("xyz")).toEqual(["Y"]);
  });
});
