import { extractFunctionalRootsV1 } from "@/shared/deepRoot.functional.v1";

describe("DeepRoot functionalRoots v1.2 (father)", () => {
  it("emits functionalRoots for father (AT / PAT family)", () => {
    const roots = extractFunctionalRootsV1({
      basis: { word: "father", normalizedWord: "father" },
    });

    expect(roots).toEqual([
      {
        id: "proto.at.pat.v1",
        language: "proto",
        surfaceForms: ["father", "pater", "atë"],
        roots: ["AT", "PAT"],
        gloss:
          "Functional root AT / PAT: origin, projection, source of lineage and authority.",
        opsUsed: [],
          vowelPath: "A→Ë",
          notes: [
            "surface → proto carrier",
            "no winner; family-level functional root",
            "Proto functional family (non-historical claim).",
            "Carrier across IE and Albanian.",
          ],
      },
    ]);
  });
});
