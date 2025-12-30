import { buildDeepRootOutputV1 } from "../src/shared/deepRoot.output.v1";
import type { DeepRootMinRootsV1 } from "../src/shared/deepRoot.minRoots.v1";

function fakeMinRoots(): DeepRootMinRootsV1[] {
  // Minimal, JSON-safe placeholder. We are not testing minRoots logic here.
  return [
    {
      id: "minroot.fake.v1",
      language: "en",
      form: "study",
      decomposition: ["stu", "dy"],
      vowelPath: "U-Y",
      ringFit: "unknown",
      carriers: [],
      signals: [],
      notes: [],
    } as any,
  ];
}

describe("DeepRoot functional roots v1 (conservative)", () => {
  test("study emits functionalRoots with canon shtu+di hypothesis", () => {
    const deepRoot = buildDeepRootOutputV1({
      basis: { word: "study", normalizedWord: "study" },
      minRoots: fakeMinRoots(),
    });

    expect(deepRoot).not.toBeNull();
    expect(deepRoot?.functionalRoots).toBeDefined();
    expect(Array.isArray(deepRoot?.functionalRoots)).toBe(true);

    const ids = (deepRoot!.functionalRoots || []).map((h) => h.id);
    expect(ids).toContain("sq.shtu+di.v1");

    const h = deepRoot!.functionalRoots!.find((x) => x.id === "sq.shtu+di.v1")!;
    expect(h.roots).toEqual(["shtu", "di"]);
    expect(h.vowelPath).toBe("U→I");
  });

  test("non-supported words omit functionalRoots (no empty arrays)", () => {
    const deepRoot = buildDeepRootOutputV1({
      basis: { word: "damage", normalizedWord: "damage" },
      minRoots: fakeMinRoots(),
    });

    expect(deepRoot).not.toBeNull();
    expect((deepRoot as any).functionalRoots).toBeUndefined();
  });
});
