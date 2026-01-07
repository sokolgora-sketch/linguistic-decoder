import { analyzeWord } from "@/engine/analyzeWord";

describe("originClaim.v1 — default behavior", () => {
  it("defaults to insufficient_evidence", () => {
    const result = analyzeWord("study", "strict");

    expect(result.originClaim).toBeDefined();

    // Canonical protocol shape (src/shared/originClaim.v1.ts)
    expect(result.originClaim.policy).toBe("no_single_winner");
    expect(Array.isArray(result.originClaim.candidates)).toBe(true);
    expect(result.originClaim.candidates.length).toBe(0);
    expect(result.originClaim.summary.confidence).toBe("insufficient_evidence");

    // Snapshot the whole originClaim block
    expect(result.originClaim).toMatchSnapshot();
  });
});
