// src/functions/deepRootEngine.ts
import type { AnalyzeWordResult, DeepRootSummary } from "@/shared/engineShape";

/**
 * Computes a simple proto-root analysis for a given word result.
 * This is a placeholder for a more sophisticated deep-root engine.
 *
 * @param result The result from the main analysis.
 * @returns A DeepRootSummary object or null if no root is found.
 */
export function computeDeepRoot(result: AnalyzeWordResult): DeepRootSummary | null {
  if (!result || !result.word) {
    return null;
  }

  const word = result.word.toLowerCase();

  // Simple hard-coded examples based on user request
  if (word.includes("ma") || word.includes("mat")) {
    return {
      protoRoot: "MA",
      meaning: "measure, form, mother, make",
      functionAxis: "Creation",
      examples: ["mathematics", "matrix", "mater", "make"],
    };
  }

  // Add more rules here as needed...

  return null;
}
