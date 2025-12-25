import type { AnalyzeWordResultUI } from "@/shared/resultsUI";

/**
 * Normalize "voice path" between:
 * - primaryPath.voicePath: string[]
 * - candidates[0].vowelPath: string (joined)
 *
 * Rule:
 * - If either exists, derive the other.
 * - Never invent a path if neither exists.
 */
function splitPath(s?: string | null): string[] {
  if (!s) return [];
  return String(s)
    .split(/[-–—\s]+/g)
    .map((x) => x.trim())
    .filter(Boolean);
}

function joinPath(path?: string[] | null): string | undefined {
  if (!Array.isArray(path) || path.length === 0) return undefined;
  const cleaned = path.map((x) => String(x).trim()).filter(Boolean);
  if (cleaned.length === 0) return undefined;
  return cleaned.join("-");
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

  // Ensure candidates[0].vowelPath exists
  const joined = joinPath(chosenArr);
  if (best && joined && !best.vowelPath) {
    best.vowelPath = joined;
  }

  return result;
}
