import { buildDeepRootOutputV1 } from "../src/shared/deepRoot.output.v1";

describe("DR4 DeepRoot output v1 (public-facing shape)", () => {
  it("study: returns DeepRoot output or undefined (never throws)", () => {
    const out = buildDeepRootOutputV1({
      basis: "study",
      mode: "strict",
      allowSSh: true,
      langAllowList: ["sq"],
      maxHypotheses: 10,
    });

    // In v1 we allow undefined, but if present must be sane.
    if (!out) return;

    expect(out.version).toBe("deeproot-output-v1");
    expect(out.basis).toBe("study");
    expect(Array.isArray(out.protoRoots)).toBe(true);
    expect(Array.isArray(out.hypotheses)).toBe(true);

    for (const h of out.hypotheses) {
      expect(Array.isArray(h.protoRoots)).toBe(true);
      expect(Array.isArray(h.segments)).toBe(true);
      expect(h.protoRoots.length).toBe(h.segments.length);
      expect(typeof h.opsCount).toBe("number");
      expect(typeof h.checks.opsWithinLimits).toBe("boolean");
    }
  });

  it("determinism: same input returns identical JSON", () => {
    const a = buildDeepRootOutputV1({ basis: "study", mode: "strict", langAllowList: ["sq"] });
    const b = buildDeepRootOutputV1({ basis: "study", mode: "strict", langAllowList: ["sq"] });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
