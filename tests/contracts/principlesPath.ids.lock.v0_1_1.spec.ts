import { describe, it, expect } from "@jest/globals";

// Tight rule: contract principle tokens should be ALL_CAPS IDs, not Title-Case labels.
const ID_RE = /^[A-ZË]+(?:_[A-ZË]+)*$/;

function isPrincipleId(x: unknown): x is string {
  return typeof x === "string" && ID_RE.test(x);
}

describe("principlesPath emits canonical IDs (v0.1.1 lock)", () => {
  it("accepts only ALL_CAPS ids for principlesPath examples", () => {
    const principlesPath = ["UNITY", "INSIGHT", "BALANCE"];

    expect(principlesPath.every(isPrincipleId)).toBe(true);
    expect(principlesPath.some((s) => s === "Unity" || s === "Insight")).toBe(false);
  });
});
