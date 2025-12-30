import { selectHighlightedHypotheses } from "../src/shared/deepRoot.verdict.v1";

describe("DR5 verdict highlight v1 (no scores)", () => {
  it("prefers passed hypothesis over failed", () => {
    const v = selectHighlightedHypotheses([
      {
        id: "fail",
        opsCount: 0,
        segments: ["a", "b"],
        carriers: [{ lang: "sq", ops: ["exact"] }],
        checks: [{ code: "FUNC_OK", ok: false }],
      },
      {
        id: "pass",
        opsCount: 3,
        segments: ["a", "b", "c"],
        carriers: [{ lang: "sq", ops: ["exact"] }],
        checks: [{ code: "FUNC_OK", ok: true }],
      },
    ]);

    expect(v.highlighted[0]).toBe("pass");
    expect(v.reasons.join(" ")).toContain("PASS_FIRST");
  });

  it("within passed: fewest ops wins", () => {
    const v = selectHighlightedHypotheses([
      {
        id: "ops3",
        opsCount: 3,
        segments: ["a", "b"],
        carriers: [{ lang: "sq", ops: ["vowel_swap"] }],
        checks: [{ code: "OK", ok: true }],
      },
      {
        id: "ops1",
        opsCount: 1,
        segments: ["a", "b", "c"],
        carriers: [{ lang: "sq", ops: ["exact"] }],
        checks: [{ code: "OK", ok: true }],
      },
    ]);

    expect(v.highlighted[0]).toBe("ops1");
  });

  it("tie: fewer segments wins (after ops)", () => {
    const v = selectHighlightedHypotheses([
      {
        id: "seg3",
        opsCount: 1,
        segments: ["a", "b", "c"],
        carriers: [{ lang: "sq", ops: ["exact"] }],
        checks: [{ code: "OK", ok: true }],
      },
      {
        id: "seg2",
        opsCount: 1,
        segments: ["a", "b"],
        carriers: [{ lang: "sq", ops: ["exact"] }],
        checks: [{ code: "OK", ok: true }],
      },
    ]);

    expect(v.highlighted[0]).toBe("seg2");
  });

  it("determinism: identical input yields identical JSON", () => {
    const hypotheses = [
      {
        id: "a",
        opsCount: 2,
        segments: ["x", "y"],
        carriers: [{ lang: "en", ops: ["exact"] }],
        checks: [{ code: "OK", ok: true }],
      },
      {
        id: "b",
        opsCount: 2,
        segments: ["x", "y"],
        carriers: [{ lang: "sq", ops: ["exact"] }],
        checks: [{ code: "OK", ok: true }],
      },
    ];

    const v1 = selectHighlightedHypotheses(hypotheses);
    const v2 = selectHighlightedHypotheses(hypotheses);

    expect(JSON.stringify(v1)).toBe(JSON.stringify(v2));
  });
});
