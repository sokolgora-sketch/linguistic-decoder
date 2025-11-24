// src/shared/voiceColors.ts
import type { Vowel } from "@/shared/engineShape";

// Core palette – you can tweak hex later
export const VOICE_COLOR_MAP: Record<Vowel, string> = {
  A: "#ef4444", // red
  E: "#f97316", // orange
  I: "#eab308", // yellow
  O: "#22c55e", // green
  U: "#3b82f6", // blue
  Y: "#6366f1", // indigo
  Ë: "#a855f7", // violet
};

export const VOICE_LABEL_MAP: Record<Vowel, string> = {
  A: "Truth / Source / Action",
  E: "Expansion / Flow",
  I: "Insight / Pattern",
  O: "Balance / Heart / Mediator",
  U: "Unity / Field",
  Y: "Network Integrity",
  Ë: "Evolution / Completion",
};
