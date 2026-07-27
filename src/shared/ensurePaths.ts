import type { AnalyzeWordResultUI } from "@/shared/resultsUI";

/**
 * Normalize the authoritative word-level voice path.
 *
 * Rules:
 * - Preserve primaryPath when the engine emitted it.
 * - A legacy candidate path may backfill a missing primaryPath.
 * - Never copy the word-level primary path into a candidate row.
 * - Never invent a path when neither source exists.
 */
function splitPath(s?: string | null): string[] {
  if (!s) return [];
  return String(s)
    .split(/[-–—\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function ensurePrimaryAndCandidatePaths(
  result: AnalyzeWordResultUI,
): AnalyzeWordResultUI {
  if (!result) return result;

  const best = Array.isArray(result.candidates) ? result.candidates[0] : undefined;

  const primaryArr =
    Array.isArray(result.primaryPath?.voicePath) ? result.primaryPath!.voicePath : [];

  const candidateStr = best?.vowelPath ?? undefined;
  const candidateArr = splitPath(candidateStr);

  // Choose the first available source of truth
  const chosenArr = primaryArr.length ? primaryArr : candidateArr;

  // If we still have nothing, do not invent
  if (chosenArr.length === 0) return result;

  // Ensure primaryPath.voicePath exists
  if (!result.primaryPath) {
    result.primaryPath = {
      voicePath: chosenArr,
      levelPath: "",
      ringPath: [],
    };
  } else if (!Array.isArray(result.primaryPath.voicePath) || result.primaryPath.voicePath.length === 0) {
    result.primaryPath.voicePath = chosenArr;
  }

  return result;
}
