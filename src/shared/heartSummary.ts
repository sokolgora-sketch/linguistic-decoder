// src/shared/heartSummary.ts
import type { Math7PrimarySummary } from "../types/engine";

/**
 * Human-readable Seven-Voices heart snapshot.
 */
export function formatHeartSummaryText(
  word: string,
  summary: Math7PrimarySummary
): string {
  return [
    `Seven-Voices heart snapshot for "${word}":`,
    `- Primary path: ${summary.primaryPath}`,
    `- Rings: ${summary.rings}`,
    `- Levels: ${summary.levels}`,
    `- Tension: ${summary.tension}`,
    `- Frontier consonants: ${summary.frontierConsonants}`,
  ].join("\n");
}
