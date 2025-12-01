// src/shared/heartSummary.ts

/**
 * Build a plain-text Seven-Voices “heart snapshot” for the current analysis.
 * Used by the “Copy heart summary” buttons in the UI.
 */
export function buildHeartSummaryText(result: any): string | null {
  if (!result) return null;

  // Try to get a nice display word
  const word: string =
    result?.input?.normalized ??
    result?.input?.raw ??
    result?.word ??
    "";

  // Heart path lives either under math7.heartPaths.primary
  // or heartPaths.primary depending on engine shape.
  const heart =
    result?.math7?.heartPaths?.primary ??
    result?.heartPaths?.primary;

  if (!heart) return null;

  const voiceSeq: string[] =
    heart.voiceSequence || heart.voices || [];

  const ringPath: (number | string)[] =
    heart.ringPath || heart.rings || [];

  const levelPath: (string | number)[] =
    heart.levelPath || heart.levels || [];

  if (!voiceSeq.length || !ringPath.length || !levelPath.length) {
    // Not enough info to build a snapshot
    return null;
  }

  const voicePathStr = voiceSeq.join(" → ");
  const ringPathStr = ringPath.join(" → ");

  // Take first and last level as the range (e.g. low → high)
  const firstLevel = levelPath[0];
  const lastLevel = levelPath[levelPath.length - 1];
  const levelPathStr = `${firstLevel} → ${lastLevel}`;

  // Tension: try a few possible fields and fall back to "unknown"
  const tension: string =
    heart.tensionLevel ??
    heart.tension ??
    heart.tensionLabel ??
    "unknown";

  // Frontier consonants / count
  const frontier: number | string =
    heart.frontierConsonants ??
    heart.frontierCount ??
    heart.frontier ??
    0;

  // Final multi-line snapshot text
  return [
    `Seven-Voices heart snapshot for "${word}":`,
    `- Primary path: ${voicePathStr}`,
    `- Rings: ${ringPathStr}`,
    `- Levels: ${levelPathStr}`,
    `- Tension: ${tension}`,
    `- Frontier consonants: ${frontier}`,
  ].join("\n");
}
