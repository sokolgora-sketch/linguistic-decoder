import {
  compareTargetToHighAnchorTokenGeometryV0_1,
  compareTokenGeometryBucketsV0_1,
  summarizeTokenGeometryBucketV0_1,
} from "@/shared/evals/tokenGeometryInspection.v0.1";

describe("tokenGeometryInspection v0.1", () => {
  it("summarizes final-shape and target-vowel geometry", () => {
    const summary = summarizeTokenGeometryBucketV0_1({
      bucketId: "x_vowel",
      targetVowel: "i",
      tokens: ["nadi", "sabit", "khushi", "rekha"],
    });

    expect(summary.tokenCount).toBe(4);
    expect(summary.openFinalTokenCount).toBe(3);
    expect(summary.closedFinalTokenCount).toBe(1);
    expect(summary.targetVowelCount).toBe(3);
    expect(summary.targetVowelTokenCount).toBe(3);
    expect(summary.finalTargetVowelTokenCount).toBe(2);
    expect(summary.meanTargetVowelCount).toBe(0.75);
    expect(summary.tokenSummaries.map((item) => item.targetVowelPositions)).toEqual([
      [4],
      [4],
      [6],
      [],
    ]);
  });

  it("adds target-vowel deltas to bucket comparisons", () => {
    const comparison = compareTokenGeometryBucketsV0_1({
      label: "open-vs-closed",
      baseBucketId: "open",
      baseTokens: ["nadi", "rekha"],
      comparisonBucketId: "closed",
      comparisonTokens: ["sabit", "vidit"],
      targetVowel: "i",
    });

    expect(comparison.deltas.comparisonOpenFinalTokenCountMinusBase).toBe(-2);
    expect(comparison.deltas.comparisonClosedFinalTokenCountMinusBase).toBe(2);
    expect(comparison.deltas.comparisonTargetVowelCountMinusBase).toBe(2);
    expect(comparison.deltas.comparisonFinalTargetVowelTokenCountMinusBase).toBe(-1);
  });

  it("flags target final-vowel inflation and high target-vowel count", () => {
    const comparison = compareTargetToHighAnchorTokenGeometryV0_1({
      label: "inflated",
      targetVowel: "i",
      targetTokens: ["bimari", "mini", "chini", "tithi"],
      highAnchorTokens: ["rekha", "seema", "leela", "deva"],
    });

    expect(comparison.flags).toContain("TARGET_HAS_FINAL_TARGET_VOWEL_INFLATION");
    expect(comparison.flags).toContain("TARGET_HAS_HIGH_AVERAGE_TARGET_VOWEL_COUNT");
  });
});
