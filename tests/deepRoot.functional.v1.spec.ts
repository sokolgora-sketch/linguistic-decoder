import { buildDeepRootOutputV1 } from "@/shared/deepRoot.output.v1";

describe("DeepRoot functional roots v1 (conservative)", () => {
  it("study emits functionalRoots", () => {
    const deepRoot = buildDeepRootOutputV1({
      basis: { word: "study", normalizedWord: "study" } as any,
      deepRoot: { hypotheses: [] } as any,
    });

    expect(deepRoot).not.toBeNull();
    expect((deepRoot as any).functionalRoots).toEqual([
      {
        id: "sq.shtu+di.v1",
        language: "sq",
        surfaceForms: ["study", "studim"],
        roots: ["shtu", "di"],
        gloss:
          "Functional reading: shtu (not yours / added-on) + di (know) → making knowledge yours through learning.",
        opsUsed: ["s_to_sh", "y_to_i"],
        vowelPath: "U→I",
        notes: [
          "english carrier → sq functional reading",
          "note: studim treated as nominal closure of the same carrier family",
          "Deterministic pilot hypothesis (v1).",
          "No historical-chain claim; functional decomposition only.",
        ],
      },
    ]);
  });

  it("damage emits functionalRoots (v1.1)", () => {
    const deepRoot = buildDeepRootOutputV1({
      basis: { word: "damage", normalizedWord: "damage" } as any,
      deepRoot: { hypotheses: [] } as any,
    });

    expect(deepRoot).not.toBeNull();
    expect((deepRoot as any).functionalRoots).toEqual([
      {
        id: "sq.dem.v1",
        language: "sq",
        surfaceForms: ["damage", "dëm"],
        roots: ["dëm"],
        gloss:
          "Functional reading: dëm (harm / loss / injury) as a minimal carrier for the damage concept.",
        opsUsed: [],
        vowelPath: "A→Ë",
        notes: [
          "english surface → sq carrier (short form)",
          "note: this is a minimal-root hypothesis, not a historical-chain claim",
          "Deterministic pilot hypothesis (v1.1).",
          "No winner; functional carrier only.",
        ],
      },
    ]);
  });

  it("non-supported words omit functionalRoots (no empty arrays)", () => {
    const deepRoot = buildDeepRootOutputV1({
      basis: { word: "hope", normalizedWord: "hope" } as any,
      deepRoot: { hypotheses: [] } as any,
    });

    expect(deepRoot).not.toBeNull();
    expect((deepRoot as any).functionalRoots).toBeUndefined();
  });
});
