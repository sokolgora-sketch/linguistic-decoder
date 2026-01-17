// src/shared/deepRoot.rootMap.builder.v1.test.ts
import { buildRootMapV1 } from "@/shared/deepRoot.rootMap.builder.v1";
import type { MinRootHypothesis } from "@/shared/deepRoot.minRoots.v1";

describe("buildRootMapV1", () => {
  it("should return null if basis is empty", () => {
    const result = buildRootMapV1({ basis: "", minRoots: [] });
    expect(result).toBeNull();
  });

  it("should return a RootMap with a note if minRoots is empty", () => {
    const result = buildRootMapV1({ basis: "test", minRoots: [] });
    expect(result).toEqual({
      tokens: [],
      keys: [],
      composedMeaning: "",
      notes: ["No minRoots hypotheses available; RootMap not emitted."],
    });
  });

  it("should build a RootMap from the first minRoots hypothesis (dama)", () => {
    const minRoots: MinRootHypothesis[] = [
      {
        id: "dama:stub:0",
        basis: "dama",
        segments: ["da", "ma"],
        protoRoots: ["DA", "M"],
        carriers: [
          { protoRootId: "DA", segment: "da", lang: "sq", carrierForm: "da", ops: [] },
          { protoRootId: "M", segment: "ma", lang: "sq", carrierForm: "ma", ops: [] },
        ],
        decomposition: { action: "DA" },
        checks: { opsWithinLimits: true, skeletonExplained: true },
        opsCount: 0,
      },
    ];

    const result = buildRootMapV1({ basis: "dama", minRoots });

    expect(result?.composedMeaning).toBe("divide / cut / separate + make / form / do (m-marker)");
    expect(result?.tokens.map((t) => t.token)).toEqual(["DA", "M"]);
    expect(result?.keys[0].language).toBe("sq");
    expect(result?.keys[0].status).toBe("supported");
  });

  const H: MinRootHypothesis = {
    id: "study:stub:0",
    basis: "study",
    segments: ["stu", "di"],
    protoRoots: ["SHTU", "DI"],
    carriers: [
      {
        protoRootId: "SHTU",
        segment: "stu",
        carrierForm: "stu",
        lang: "en",
        ops: ["s↔sh"],
      },
      {
        protoRootId: "DI",
        segment: "di",
        carrierForm: "di",
        lang: "sq",
        ops: [],
      },
    ],
    decomposition: { action: "SHTU", function: "DI" },
    checks: { opsWithinLimits: true, skeletonExplained: true },
    opsCount: 1,
  };

  it("buildRootMapV1 emits tokens + keys deterministically from first hypothesis (study)", () => {
    const rm = buildRootMapV1({ basis: "study", minRoots: [H] });
    expect(rm?.tokens.map((t) => t.token)).toEqual(["SHTU", "DI"]);
    expect(rm?.keys.length).toBe(2);
    expect(rm?.keys[0].token).toBe("SHTU");
    expect(rm?.keys[0].language).toBe("en");
    expect(rm?.keys[0].ops).toEqual(["s↔sh"]);
    expect(rm?.keys[0].evidence).toContain("ops: s↔sh");

    expect(rm?.keys[1].token).toBe("DI");
    expect(rm?.keys[1].language).toBe("sq");
    expect(rm?.keys[1].ops).toBeUndefined(); // empty ops should be undefined
  });
});

describe("buildRootMapV1 (spans)", () => {
  it("does not emit spans when hypothesis segments are missing (all-or-nothing)", () => {
    const { buildRootMapV1 } = require("@/shared/deepRoot.rootMap.builder.v1");

    const out = buildRootMapV1({
      basis: "study",
      minRoots: [
        {
          protoRoots: ["ST", "DI", "M"],
          carriers: [], // no carrier.segment
          // no segments[] fallback either
          decomposition: {},
          checks: { opsWithinLimits: true, skeletonExplained: true },
        },
      ],
    });

    expect(out).toBeTruthy();
    expect(out.spans).toBeUndefined();
  });

  it("emits spans when carrier segments are present and match basis left-to-right", () => {
    const { buildRootMapV1 } = require("@/shared/deepRoot.rootMap.builder.v1");

    const out = buildRootMapV1({
      basis: "study",
      minRoots: [
        {
          protoRoots: ["ST", "U", "DI", "M"],
          carriers: [
            { protoRootId: "ST", lang: "latin", carrierForm: "st", ops: [], segment: "st" },
            { protoRootId: "U", lang: "latin", carrierForm: "u", ops: [], segment: "u" },
            { protoRootId: "DI", lang: "latin", carrierForm: "di", ops: [], segment: "dy" }, // normalized-ish segment
            { protoRootId: "M", lang: 'latin', carrierForm: 'm', ops: [], segment: 'm' },
          ],
          decomposition: {},
          checks: { opsWithinLimits: true, skeletonExplained: true },
        },
      ],
    });

    expect(out).toBeTruthy();
    expect(Array.isArray(out.spans)).toBe(true);

    // Deterministic cursor-walk: st u dy m within "study"
    expect(out.spans).toEqual([
      { token: "ST", start: 0, end: 2, source: "surface", note: "segment=st" },
      { token: "U", start: 2, end: 3, source: "surface", note: "segment=u" },
      { token: "DI", start: 3, end: 5, source: "surface", note: "segment=dy" },
      { token: "M", start: 5, end: 6, source: "surface" },
    ]);
  });

  it("does not emit spans if any segment cannot be found deterministically", () => {
    const { buildRootMapV1 } = require("@/shared/deepRoot.rootMap.builder.v1");

    const out = buildRootMapV1({
      basis: "study",
      minRoots: [
        {
          protoRoots: ["ST", "X"],
          carriers: [
            { protoRootId: "ST", lang: "latin", carrierForm: "st", ops: [], segment: "st" },
            { protoRootId: "X", lang: "latin", carrierForm: "x", ops: [], segment: "zz" }, // not in basis
          ],
          decomposition: {},
          checks: { opsWithinLimits: true, skeletonExplained: true },
        },
      ],
    });

    expect(out).toBeTruthy();
    expect(out.spans).toBeUndefined();
  });
});
