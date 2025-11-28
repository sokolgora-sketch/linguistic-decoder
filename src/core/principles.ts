// src/core/principles.ts

// Axes = Seven Voices layer
export type AxisId = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export type PrincipleId =
  | "love"
  | "religion"
  | "mathematics"
  | "law"
  | "power"
  | "creation"
  | "origin";

export type PrincipleDef = {
  id: PrincipleId;
  label: string;   // human label
  axis: AxisId;    // which vowel/voice carries it
  description: string;
};

// ⚠️ Mapping is *draft*. We can tweak later.
// For now it just lets the UI show something deterministic.
export const PRINCIPLES: PrincipleDef[] = [
  {
    id: "love",
    label: "Love",
    axis: "A",
    description: "Heart-opening, primary giving / bonding drive.",
  },
  {
    id: "religion",
    label: "Religion / Faith",
    axis: "E",
    description: "Alignment, belief, expansion toward something higher.",
  },
  {
    id: "mathematics",
    label: "Mathematics / Measure",
    axis: "I",
    description: "Precision, measure, structure and logic.",
  },
  {
    id: "law",
    label: "Law / Order",
    axis: "O",
    description: "Balance, mediation, fair boundaries.",
  },
  {
    id: "power",
    label: "Power / Will",
    axis: "U",
    description: "Force, momentum, ability to act in the world.",
  },
  {
    id: "creation",
    label: "Creation / Art",
    axis: "Y",
    description: "Imagination, pattern-making, innovation.",
  },
  {
    id: "origin",
    label: "Origin / Source",
    axis: "Ë",
    description: "Root, womb, return point of all paths.",
  },
];
