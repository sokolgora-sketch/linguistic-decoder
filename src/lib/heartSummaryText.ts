// src/lib/heartSummaryText.ts

/**
 * Minimal shape we need from the engine to describe a "heart summary".
 * We keep this loose on purpose so we don't drag in heavy engine types.
 */
export type HeartSummaryInput = {
  word: string;
  primaryPath: {
    voicePath: string | string[];  // e.g. ["U", "I"]
    ringPath: string | number[];   // e.g. [1, 1]
    levelPath?: string;
  };
};

/**
 * Build a single-line, human-friendly description of the primary path.
 *
 * Example:
 *   buildHeartSummaryText({
 *     word: "study",
 *     primaryPath: { voicePath: ["U", "I"], ringPath: [1, 1] }
 *   });
 *
 * → 'study: U → I (rings 1 → 1)'
 */
export function buildHeartSummaryText(input: HeartSummaryInput): string {
  const { word, primaryPath } = input;
  const path = Array.isArray(primaryPath.voicePath) ? primaryPath.voicePath.join(" → ") : primaryPath.voicePath;
  const rings = Array.isArray(primaryPath.ringPath) ? primaryPath.ringPath.join(" → ") : primaryPath.ringPath;

  // Very defensive; if engine ever sends something weird, we still return *something*.
  const pathPart = path ? path : "?";
  const ringPart = rings ? rings : "?";

  if (primaryPath.levelPath) {
    return `${pathPart}${primaryPath.levelPath}.${ringPart}`;
  }

  return `${word}: ${pathPart} (rings ${ringPart})`;
}
