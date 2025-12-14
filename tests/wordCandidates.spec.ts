import { generateCandidates } from "../src/engine/wordCandidates";

describe("wordCandidates.generateCandidates", () => {
  it("returns an empty array for blank input", () => {
    expect(generateCandidates("")).toEqual([]);
    expect(generateCandidates("   ")).toEqual([]);
  });

  it("returns an identity candidate with Math7 summary for 'study'", () => {
    const candidates = generateCandidates("study");

    expect(candidates.length).toBe(1);

    const c = candidates[0];

    // structure
    expect(c.input).toBe("study");
    expect(c.form).toBe("study");
    expect(c.pieces).toEqual(["study"]);
    expect(c.opsUsed).toEqual(["identity"]);

    // Math7 invariants; we know from existing tests that
    // extractVowelPath('study') = ["U", "Y"] and totalVoices = 2
    expect(c.math7).not.toBeNull();
    expect(c.math7?.path).toEqual(["U", "Y"]);
    expect(c.math7?.totalVoices).toBe(2);
  });
});
