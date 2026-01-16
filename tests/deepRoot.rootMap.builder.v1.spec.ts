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
