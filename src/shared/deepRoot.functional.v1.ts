/**
 * DeepRoot Functional Roots v1
 * - Deterministic, conservative.
 * - v1 only emits for "study" (canon hook).
 * - Returns [] for all other words.
 * - JSON-safe: consumer omits field if empty.
 */

export type FunctionalRootHypothesisV1 = {
  id: string; // stable id, versioned
  language: "sq" | "mixed";
  surfaceForms: string[];
  roots: string[];
  gloss: string;
  opsUsed: string[];
  vowelPath: string;
  notes?: string[];
};

export function extractFunctionalRootsV1(params: {
  basis: { word: string; normalizedWord: string };
  mode?: "open" | "strict" | string;
}): FunctionalRootHypothesisV1[] {
  const w = (params?.basis?.normalizedWord || params?.basis?.word || "").toLowerCase().trim();

  // v1: canonical pilot hook only.
  if (w !== "study") return [];

  // We do not claim a single "winner". We emit a functional hypothesis.
  // Canon: shtu + di  (SQ functional reading)
  const hypothesis: FunctionalRootHypothesisV1 = {
    id: "sq.shtu+di.v1",
    language: "sq",
    surfaceForms: ["study", "studim"],
    roots: ["shtu", "di"],
    gloss: "Functional reading: shtu (not yours / added-on) + di (know) → making knowledge yours through learning.",
    opsUsed: [
      "english carrier → sq functional reading",
      "note: studim treated as nominal closure of the same carrier family",
    ],
    vowelPath: "U→I",
    notes: [
      "Deterministic pilot hypothesis (v1).",
      "No historical-chain claim; functional decomposition only.",
    ],
  };

  return [hypothesis];
}
