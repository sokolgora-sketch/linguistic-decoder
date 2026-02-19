import { vectorDeltaSummaryV0_1 } from "@/shared/geometry/vectorDeltaSummary.v0.1";

describe("VectorDelta (Geometry) v0.1", () => {
  test("empty path => zero summary", () => {
    const s = vectorDeltaSummaryV0_1([]);
    expect(s.steps).toHaveLength(0);
    expect(s.totals.totalDist).toBe(0);
    expect(s.totals.netRadial).toBe(0);
    expect(s.signature).toBe("∅");
  });

  test("single step O→A is outward", () => {
    const s = vectorDeltaSummaryV0_1(["O", "A"]);
    expect(s.steps).toHaveLength(1);
    expect(s.steps[0].turnKind).toBe("outward");
    expect(s.steps[0].radialDelta).toBe(3);
  });

  test("ring movement E→Y is circular (same radius)", () => {
    const s = vectorDeltaSummaryV0_1(["E", "Y"]);
    expect(s.steps[0].turnKind).toBe("circular");
    expect(s.steps[0].radialDelta).toBe(0);
  });

  test("multi-step counts inward/outward/circular", () => {
    const s = vectorDeltaSummaryV0_1(["A", "O", "I", "E", "Y"]);
    expect(s.steps).toHaveLength(4);
    expect(s.totals.inwardCount + s.totals.outwardCount + s.totals.circularCount).toBe(4);
  });
});
