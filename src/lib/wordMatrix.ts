import type { AnalyzeWordResultUI } from "@/shared/resultsUI";
import type { WordMatrixSummary } from "@/components/WordMatrixCard";

/**
 * Build-safe WordMatrix adapter.
 * Accepts the UI analysis shape and returns the exact summary shape required by WordMatrixCard.
 * Defensive by design: repo has multiple drifting result shapes.
 */
export function buildWordMatrixUI(
  analysis: AnalyzeWordResultUI | null | undefined
): WordMatrixSummary | undefined {
  if (!analysis) return;

  const anyA: any = analysis as any;
  const word: string = anyA.word ?? "";

  // primaryPath.voicePath sometimes is string[], sometimes string, sometimes null.
  const vp = anyA?.primaryPath?.voicePath;
  const voicePath =
    Array.isArray(vp) ? vp.join("") : typeof vp === "string" ? vp : "";

  return {
    word,
    entries: [
      { label: "primary.voicePath", value: voicePath || "—" },
    ],
  };
}
