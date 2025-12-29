/**
 * ProtoRoots Library v1
 * ---------------------
 * Deterministic, curated minimal functional roots + carrier forms.
 *
 * Rules:
 * - No runtime "root invention". Roots must exist here to be used.
 * - Keep entries small, explicit, and versioned.
 * - Carriers list concrete surface forms across languages/dialects.
 */

export type ProtoRootRole = "Action" | "Function" | "Unit" | "Modifier" | "Unknown";

export type ProtoCarrier = {
  lang: string;            // e.g., "sq", "en", "la", "grc", "sa", "de", "sl"
  dialect?: string;        // e.g., "Gheg", "Tosk"
  form: string;            // carrier form, e.g., "di", "shtu", "da"
  gloss?: string;          // brief meaning for this carrier form
  notes?: string;
};

export type ProtoRoot = {
  id: string;              // e.g., "DI", "SHTU", "DA", "AT"
  gloss: string;           // minimal meaning label, e.g., "know/knowledge"
  roleHint: ProtoRootRole; // Action | Function | Unit | Modifier | Unknown
  carriers: ProtoCarrier[];
  notes?: string;
};

export const PROTO_ROOTS_V1: readonly ProtoRoot[] = Object.freeze([
  {
    id: "DI",
    gloss: "know / knowledge",
    roleHint: "Function",
    carriers: [
      { lang: "sq", form: "di", gloss: "I know" },
      { lang: "sq", dialect: "Gheg", form: "dij", gloss: "I know" },
      { lang: "sq", form: "dije", gloss: "knowledge" },
      { lang: "sq", form: "dit", gloss: "day (carrier; semantic drift possible)", notes: "include as weak carrier; do not over-claim" },
    ],
    notes: "Core proto-root used for study → (s)tu/(sh)tu + DI + (m).",
  },
  {
    id: "SHTU",
    gloss: "add / increase / put-on",
    roleHint: "Action",
    carriers: [
      { lang: "sq", form: "shtu", gloss: "add / increased" },
      { lang: "sq", form: "shtoj", gloss: "to add" },
      { lang: "sq", form: "shtim", gloss: "addition / increase" },
      { lang: "sq", dialect: "Gheg", form: "shtue", gloss: "added (participle)" },
      // English-facing carrier often appears without 'h' — we record as a carrier candidate,
      // but do NOT claim etymology here; matching logic will enforce allowed ops.
      { lang: "en", form: "stu", gloss: "surface segment carrier (study)", notes: "treated as possible carrier via s↔sh rule" },
    ],
    notes: "We treat STU as potential surface carrier mapping to SHTU via s↔sh allowance (engine rule).",
  },
  {
    id: "DA",
    gloss: "divide / cut / separate",
    roleHint: "Action",
    carriers: [
      { lang: "sq", form: "da", gloss: "gave (aorist/part)", notes: "carrier; semantics can branch; keep cautious" },
      { lang: "sq", form: "ndaj", gloss: "divide / share" },
      { lang: "sq", form: "ndarë", gloss: "divided" },
    ],
    notes: "Proto-root used as example for minimal functional decomposition patterns.",
  },
  {
    id: "AT",
    gloss: "father / progenitor marker",
    roleHint: "Unit",
    carriers: [
      { lang: "sq", form: "atë", gloss: "father" },
      { lang: "sq", form: "ati", gloss: "the father (def/older form)" },
      { lang: "la", form: "pater", gloss: "father (non-minimal carrier; reference only)", notes: "not minimal; included for cross-language carrier awareness" },
    ],
    notes: "Keep as 'Unit' proto-root; do not over-extend beyond minimal meaning.",
  },
  {
    id: "M",
    gloss: "make / form / do (m-marker)",
    roleHint: "Unit",
    carriers: [
      { lang: "sq", form: "më", gloss: "marker/carrier (weak)", notes: "used as suffix carrier in some decompositions; treat cautiously" },
      { lang: "sq", form: "m", gloss: "suffix marker (very weak)", notes: "only used when explicit constraints allow" },
    ],
    notes: "This is intentionally weak. Later we may split into true morphemes (e.g., -im, -m).",
  },
]);

export const PROTO_ROOTS_V1_BY_ID: Readonly<Record<string, ProtoRoot>> = Object.freeze(
  Object.fromEntries(PROTO_ROOTS_V1.map((r) => [r.id, r])) as Record<string, ProtoRoot>
);

export function getProtoRootV1(id: string): ProtoRoot | undefined {
  return PROTO_ROOTS_V1_BY_ID[id];
}
