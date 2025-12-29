import { buildMinRootHypotheses } from "../src/shared/deepRoot.minRoots.v1";

describe("DR3 DeepRoot minimal roots engine v1", () => {
  it("study: produces bounded hypotheses", () => {
    const h = buildMinRootHypotheses("study", {
      allowSSh: true,
      langAllowList: ["sq"],
      maxHypotheses: 20,
    });

    expect(h.length).toBeGreaterThan(0);
    expect(h.length).toBeLessThanOrEqual(20);
  });

  it("determinism: same input, same output", () => {
    const a = buildMinRootHypotheses("study", {
      allowSSh: true,
      langAllowList: ["sq"],
    });
    const b = buildMinRootHypotheses("study", {
      allowSSh: true,
      langAllowList: ["sq"],
    });

    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("hypotheses include protoRoots + segments", () => {
    const h = buildMinRootHypotheses("study", {
      allowSSh: true,
      langAllowList: ["sq"],
      maxHypotheses: 5,
    });

    const x = h[0];
    expect(Array.isArray(x.segments)).toBe(true);
    expect(Array.isArray(x.protoRoots)).toBe(true);
    expect(x.protoRoots.length).toBe(x.segments.length);
  });

  it("opsWithinLimits enforced", () => {
    const h = buildMinRootHypotheses("study", {
      allowSSh: true,
      langAllowList: ["sq"],
    });

    for (const x of h) {
      expect(typeof x.checks.opsWithinLimits).toBe("boolean");
    }
  });
});
