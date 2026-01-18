import { buildRootMapV1 } from "@/shared/deepRoot.rootMap.builder.v1";

// Minimal proto roots used by builder are read via getProtoRootV1.
// These tests focus on hypothesis selection behavior, not protoRoots content.
// If a protoRootId is unknown, tokens still emit, but gloss may be "unknown".

describe("buildRootMapV1 (RootMap selection)", () => {
  it("prefers Heart-aligned terminal vowel (study: DI not DA)", () => {
    const H_DI = {
      protoRoots: ["SHTU", "DI"],
      carriers: [
        { protoRootId: "SHTU", segment: "stu", carrierForm: "stu", lang: "en", ops: ["s↔sh"] },
        { protoRootId: "DI", segment: "di", carrierForm: "di", lang: "sq", ops: [] },
      ],
      decomposition: { action: "SHTU", function: "DI" },
      checks: { opsWithinLimits: true, skeletonExplained: true },
      opsCount: 1,
    };

    const H_DA = {
      protoRoots: ["SHTU", "DA"],
      carriers: [
        { protoRootId: "SHTU", segment: "stu", carrierForm: "stu", lang: "en", ops: ["s↔sh"] },
        { protoRootId: "DA", segment: "dy", carrierForm: "da", lang: "sq", ops: ["vowel_swap"] },
      ],
      decomposition: { action: "SHTU", function: "DA" },
      checks: { opsWithinLimits: true, skeletonExplained: true },
      opsCount: 2,
    };

    // Heart terminal vowel = I → should pick DI hypothesis even if DA is first
    const rm = buildRootMapV1({
      basis: "study",
      minRoots: [H_DA as any, H_DI as any],
      heartPrimaryPath: ["U", "I"],
    });

    expect(rm?.tokens.map((t) => t.token)).toEqual(["SHTU", "DI"]);
  });
});
