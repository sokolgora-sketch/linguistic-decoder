import { describe, it, expect } from "@jest/globals";
import { normalizeVowelPathV0_1 } from "@/shared/verifier/verifierRules.v0.1";

describe("normalizeVowelPathV0_1 (no-regex parser)", () => {
  it("handles array input", () => {
    expect(normalizeVowelPathV0_1(["A", " ", "E", "", "I"])).toEqual(["A", "E", "I"]);
  });

  it("splits arrow path", () => {
    expect(normalizeVowelPathV0_1("A→E→I")).toEqual(["A", "E", "I"]);
    expect(normalizeVowelPathV0_1("A → E → I")).toEqual(["A", "E", "I"]);
  });

  it("splits hyphen path", () => {
    expect(normalizeVowelPathV0_1("A-E-I")).toEqual(["A", "E", "I"]);
    expect(normalizeVowelPathV0_1("A - E - I")).toEqual(["A", "E", "I"]);
  });

  it("splits whitespace path", () => {
    expect(normalizeVowelPathV0_1("A   E  I")).toEqual(["A", "E", "I"]);
  });

  it("supports ascii arrow ->", () => {
    expect(normalizeVowelPathV0_1("A->E->I")).toEqual(["A", "E", "I"]);
  });
});
