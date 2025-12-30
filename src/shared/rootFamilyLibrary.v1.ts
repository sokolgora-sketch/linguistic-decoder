/**
 * RootFamilyLibrary v1
 * Curated reference library. Keep small and deterministic.
 */

import type { RootFamilyV1, RootFamilyId } from "./rootFamily.v1";

/**
 * Start minimal.
 * Expand only when you add snapshot-tested fixtures.
 */
export const ROOT_FAMILY_LIBRARY_V1: readonly RootFamilyV1[] = [
  {
    id: "family_at_pat_father_v1",
    label: "AT/PAT (father/authority line)",
    protoRoots: [
      { root: "AT", function: "authority / origin line" },
      { root: "PAT", function: "father marker / lineage" },
    ],
    carriers: [
      { lang: "en", form: "father" },
      { lang: "la", form: "pater" },
      { lang: "grc", form: "patēr" },
    ],
    notes: ["Curated starter family; expand via dedicated rootFamily tests."],
  },
] as const;

export function getRootFamilyById(id: RootFamilyId): RootFamilyV1 | undefined {
  return ROOT_FAMILY_LIBRARY_V1.find((f) => f.id === id);
}
