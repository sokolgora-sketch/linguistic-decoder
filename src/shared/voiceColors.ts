// src/shared/voiceColors.ts
import type { Vowel } from "./engineShape";

export const VOICE_COLOR_MAP: Record<Vowel, string> = {
  A: "#EF4444",  // red
  E: "#F59E0B",  // orange
  I: "#EAB308",  // yellow
  O: "#10B981",  // green
  U: "#3B82F6",  // blue
  Y: "#6366F1",  // indigo
  "Ë": "#8B5CF6", // violet
};

// Short principle labels for each Voice (Seven Principles).
export const VOICE_LABEL_MAP: Record<Vowel, string> = {
  A: "Truth / Source / Action",
  E: "Expansion / Flow",
  I: "Insight / Pattern",
  O: "Balance / Heart / Mediator",
  U: "Unity / Field",
  Y: "Network Integrity",
  "Ë": "Evolution / Completion",
};
