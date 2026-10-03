import { numericSummaryV0_1 } from "@/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1b";

describe("ZC v0.1b numeric summary repair", () => {
  it("preserves empty and single-value behavior", () => {
    expect(numericSummaryV0_1([])).toEqual({
      histogram: [],
      min: null,
      max: null,
      mean: null,
      median: null,
    });
    expect(numericSummaryV0_1([7])).toEqual({
      histogram: [{ value: 7, count: 1 }],
      min: 7,
      max: 7,
      mean: 7,
      median: 7,
    });
  });

  it("preserves exact even and odd median behavior", () => {
    expect(numericSummaryV0_1([1, 4, 2, 3]).median).toBe(2.5);
    expect(numericSummaryV0_1([1, 5, 3]).median).toBe(3);
  });

  it("computes exact summaries for a population larger than the failed run", () => {
    const values = Array.from({ length: 150_000 }, (_, index) => index - 75_000);
    const summary = numericSummaryV0_1(values);

    expect(summary.min).toBe(-75_000);
    expect(summary.max).toBe(74_999);
    expect(summary.mean).toBe(-0.5);
    expect(summary.median).toBe(-0.5);
    expect(summary.histogram).toHaveLength(150_000);
  });
});
