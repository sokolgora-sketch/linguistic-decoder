// src/functions/deepRootEngine.ts
import type { DeepRootSummary } from "@/shared/engineShape";

/**
 * Computes a simple proto-root analysis for a given word.
 * This is a hard-coded V1 for our canonical words to establish the data shape.
 *
 * @param raw The word to analyze.
 * @returns A DeepRootSummary object or undefined if no root is found.
 */
export function computeDeepRootForWord(raw: string): DeepRootSummary | undefined {
  const word = raw.toLowerCase();

  if (word === "damage" || word === "dëmtim") {
    return {
      coreFunction: "cut / divide / reduce integrity",
      motif: ["A", "A", "E"],
      lightDark: "MIXED",
      vibrationalTone: "LOW",
      pieces: [
        { role: "ACTION", block: "DA", language: "Alb", meaning: "cut / divide" },
        { role: "DOMAIN", block: "M",  language: "Alb", meaning: "mass / body" },
        { role: "RESULT", block: "G", language: "Alb", meaning: "impact / wound" },
      ],
      short: "Damage = DA (cut) + M (mass) + G (impact): cutting the integrity of a body.",
      examples: [
        { language: "Albanian", form: "dëm",    gloss: "harm, loss" },
        { language: "Latin",    form: "damnum", gloss: "loss, harm" },
        { language: "English",  form: "damage", gloss: "harm, deterioration" },
      ],
    };
  }

  if (word === "study") {
    return {
      coreFunction: "to add to oneself; to make outside knowledge internal",
      motif: ["U", "I"],
      lightDark: "MIXED",
      vibrationalTone: "HIGH",
      pieces: [
        { role: "ACTION", block: "SHTU", language: "Alb", meaning: "to add" },
        { role: "DOMAIN", block: "DI", language: "Alb", meaning: "to know" },
        { role: "RESULT", block: "M", language: "Alb", meaning: "to make mine" },
      ],
      short: "Study = SHTU (add) + DI (know) + M (mine): the process of adding knowledge to make it your own.",
      examples: [
        { language: "Albanian", form: "studim", gloss: "study" },
        { language: "Latin",    form: "studium", gloss: "zeal, application" },
        { language: "English",  form: "study", gloss: "application of mind to the acquisition of knowledge" },
      ],
    };
  }

  if (word === "mathematics") {
    return {
      coreFunction: "to measure, assess, and formalize quantity",
      motif: ["A", "E", "A", "I", "A"],
      lightDark: "LIGHT",
      vibrationalTone: "HIGH",
      pieces: [
        { role: "ACTION", block: "MAT", language: "Alb/PIE", meaning: "to measure" },
        { role: "DOMAIN", block: "MA", language: "PIE", meaning: "mother / form" },
        { role: "RESULT", block: "TIKA", language: "Alb", meaning: "what you have" },
      ],
      short: "Mathematics = MAT (measure) + MA (form) + TIKA (what you have): the formal measurement of what is.",
      examples: [
        { language: "Albanian", form: "matematikë", gloss: "mathematics" },
        { language: "Greek",    form: "máthēma", gloss: "that which is learned" },
        { language: "English",  form: "mathematics", gloss: "the science of numbers and their operations" },
      ],
    };
  }

  return undefined;
}