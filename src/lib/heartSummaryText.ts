// src/lib/heartSummaryText.ts

/**
 * Minimal shape we need from the engine to describe a "heart summary".
 * We keep this loose on purpose so we don't drag in heavy engine types.
 */
export type HeartSummaryInput = {
  word: string;
  primaryPath: {
    voicePath: string[];  // e.g. ["U", "I"]
    ringPath: number[];   // e.g. [1, 1]
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
  const path = (primaryPath.voicePath ?? []).join(" → ");
  const rings = (primaryPath.ringPath ?? []).join(" → ");

  // Very defensive; if engine ever sends something weird, we still return *something*.
  const pathPart = path ? path : "?";
  const ringPart = rings ? rings : "?";

  return `${word}: ${pathPart} (rings ${ringPart})`;
}
