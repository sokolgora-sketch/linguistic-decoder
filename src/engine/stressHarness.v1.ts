import type { StressHarnessItem, StressHarnessRow } from "@/shared/engineShape";

/**
 * Canonical dataset — baseline, anchors, and system-level words
 */
export const CANON_WORDS_V1: StressHarnessItem[] = [
  { word: "study", label: "EN baseline" },
  { word: "damage", label: "EN baseline" },
  { word: "Love", label: "EN baseline" },
  { word: "Law", label: "EN baseline" },
  { word: "gjak", label: "SQ anchor" },
  { word: "zemër", label: "SQ anchor" },
  { word: "frymË", label: "SQ anchor" },
  { word: "Shqipëri", label: "SQ anchor" },
  { word: "kulturë", label: "SQ anchor" },
  { word: "sistem", label: "systems" },
  { word: "internet", label: "systems" },
  { word: "kriptomonedhë", label: "systems" },
];

/**
 * Harness runner that takes a test function argument.
 */
export function runStressHarnessV1(
  items: StressHarnessItem[],
  fn: (word: string) => unknown
): StressHarnessRow[] {
  if (typeof fn !== "function") {
    throw new Error("runStressHarnessV1: fn must be a callable test function");
  }

  return items.map(({ word }) => {
    try {
      const stress = fn(word);
      return { word, ok: true, stress };
    } catch (e: any) {
      return {
        word,
        ok: false,
        stress: null,
        error: String(e?.message ?? e),
      };
    }
  });
}
