// src/core/sevenVowelsTraits.ts
// Symbolic traits for each vowel (for UI / explanation only)

import type { VowelId } from "./sevenVowelsCore";

export interface VowelTraits {
  polarity: "light" | "dark" | "bridge";
  role: "father" | "mother" | "inner" | "outer" | "mediator";
  color: string;       // hex color for UI
  personality: string; // 1 short human sentence
}

export const VOWEL_TRAITS: Record<VowelId, VowelTraits> = {
  A: {
    polarity: "light",
    role: "father",
    color: "#FF0000", // red
    personality:
      "Initiates and cuts; pushes energy outward; the first strike or decision.",
  },
  E: {
    polarity: "light",
    role: "outer",
    color: "#FFA500", // orange
    personality:
      "Expands and spreads; turns one action into many ripples and connections.",
  },
  I: {
    polarity: "light",
    role: "inner",
    color: "#FFFF00", // yellow
    personality:
      "Focuses like a narrow beam; pattern recognition, aim, and sharp insight.",
  },
  O: {
    polarity: "bridge",
    role: "mediator",
    color: "#00FF00", // green
    personality:
      "Balances and holds; forms a circle or nest; keeps opposing forces in play.",
  },
  U: {
    polarity: "dark",
    role: "inner",
    color: "#0000FF", // blue
    personality:
      "Pulls things downward into depth, storage, and the unseen reservoir.",
  },
  Y: {
    polarity: "bridge",
    role: "outer",
    color: "#4B0082", // indigo
    personality:
      "Stands at thresholds; flips states; connects upper and lower fields.",
  },
  "Ë": {
    polarity: "dark",
    role: "mother",
    color: "#EE82EE", // violet
    personality:
      "Absorbs and closes; womb and consequence; what everything falls back into.",
  },
};
