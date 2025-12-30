import { extractFunctionalRootsV1 } from "@/shared/deepRoot.functional.v1";

describe("DeepRoot functionalRoots v1.1 (damage)", () => {
  it("emits functionalRoots for damage only", () => {
    const out = extractFunctionalRootsV1({
      basis: { word: "damage", normalizedWord: "damage" },
    });

    expect(out).toEqual([
      {
        id: "sq.dem.v1",
        language: "sq",
        surfaceForms: ["damage", "dëm"],
        roots: ["dëm"],
        gloss:
          "Functional reading: dëm (harm / loss / injury) as a minimal carrier for the damage concept.",
        opsUsed: [
          "english surface → sq carrier (short form)",
          "note: this is a minimal-root hypothesis, not a historical-chain claim",
        ],
        vowelPath: "A→Ë",
        notes: [
          "Deterministic pilot hypothesis (v1.1).",
          "No winner; functional carrier only.",
        ],
      },
    ]);

    const other = extractFunctionalRootsV1({
      basis: { word: "hope", normalizedWord: "hope" },
    });
    expect(other).toEqual([]);
  });
});
