import { segmentBasis } from "../src/shared/segmenter.v1";

describe("DR1 segmenter v1 (deterministic + bounded)", () => {
  it("returns empty on empty input", () => {
    expect(segmentBasis("")).toEqual([]);
    expect(segmentBasis("   ")).toEqual([]);
  });

  it("determinism: same input returns same ordered list", () => {
    const a = segmentBasis("study", { maxSegments: 4, maxCandidates: 200 });
    const b = segmentBasis("study", { maxSegments: 4, maxCandidates: 200 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("ordering: fewer segments first", () => {
    const out = segmentBasis("study", { maxSegments: 3, maxCandidates: 200 });
    expect(out.length).toBeGreaterThan(0);

    // find first instance of 1 segment, then 2, then 3 (if present)
    const segCounts = out.map((x) => x.segments.length);

    const first1 = segCounts.indexOf(1);
    const first2 = segCounts.indexOf(2);
    const first3 = segCounts.indexOf(3);

    expect(first1).toBe(0);
    if (first2 !== -1) expect(first2).toBeGreaterThan(first1);
    if (first3 !== -1) expect(first3).toBeGreaterThan(first2 === -1 ? first1 : first2);
  });

  it("bounds: respects minSegLen and maxSegLen", () => {
    const out = segmentBasis("study", { maxSegments: 5, minSegLen: 2, maxSegLen: 3 });
    // All segments must be length 2 or 3
    for (const s of out) {
      for (const seg of s.segments) {
        expect(seg.length).toBeGreaterThanOrEqual(2);
        expect(seg.length).toBeLessThanOrEqual(3);
      }
    }
  });

  it("hard cap: respects maxCandidates", () => {
    const out = segmentBasis("abcdef", { maxSegments: 6, maxCandidates: 7 });
    expect(out.length).toBeLessThanOrEqual(7);
  });

  it("normalize: trims + lowercases by default", () => {
    const out = segmentBasis("  STuDy  ", { maxSegments: 3 });
    expect(out[0].basis).toBe("study");
  });

  it("normalize can be disabled", () => {
    const out = segmentBasis("  STuDy  ", { maxSegments: 2, normalize: false });
    expect(out[0].basis).toBe("  STuDy  ");
  });
});
