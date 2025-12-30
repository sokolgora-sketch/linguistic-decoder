/**
 * DeepRoot Functional Roots v1
 * Deterministic, conservative micro-root hypotheses.
 *
 * Rules:
 * - Only emit for explicitly supported words (whitelist).
 * - No winners, no scores.
 * - JSON-safe output only.
 * - Keep text stable (tests + snapshots depend on it).
 */

export type FunctionalRootHypothesisV1 = {
  id: string;
  language: string; // e.g. "sq"
  surfaceForms: string[]; // which surface words this applies to
  roots: string[]; // functional micro-roots (lowercase)
  gloss: string; // short functional reading
  opsUsed: string[]; // explanation of mapping/allowed transforms
  vowelPath?: string; // optional, UI hint (stable string)
  notes?: string[]; // optional
};

export function extractFunctionalRootsV1(params: {
  basis: { word: string; normalizedWord: string };
}): FunctionalRootHypothesisV1[] {
  const w = (params.basis.normalizedWord || "").toLowerCase();
  const out: FunctionalRootHypothesisV1[] = [];

  // v1 whitelist (deterministic)
  if (w === "study") {
    out.push({
      id: "sq.shtu+di.v1",
      language: "sq",
      surfaceForms: ["study", "studim"],
      roots: ["shtu", "di"],
      gloss:
        "Functional reading: shtu (not yours / added-on) + di (know) → making knowledge yours through learning.",
      opsUsed: [
        "english carrier → sq functional reading",
        "note: studim treated as nominal closure of the same carrier family",
      ],
      vowelPath: "U→I",
      notes: [
        "Deterministic pilot hypothesis (v1).",
        "No historical-chain claim; functional decomposition only.",
      ],
    });
  }

  if (w === "damage") {
    out.push({
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
    });
  }

  // v1.2: father (AT/PAT family)
  if (w === "father") {
    out.push({
      id: "proto.at.pat.v1",
      language: "proto",
      surfaceForms: ["father", "pater", "atë"],
      roots: ["AT", "PAT"],
      gloss:
        "Functional root AT / PAT: origin, projection, source of lineage and authority.",
      opsUsed: [
        "surface → proto carrier",
        "no winner; family-level functional root",
      ],
      vowelPath: "A→Ë",
      notes: [
        "Proto functional family (non-historical claim).",
        "Carrier across IE and Albanian.",
      ],
    });
  }

  return out;
}
