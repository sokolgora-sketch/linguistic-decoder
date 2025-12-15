export type SevenVoice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export type PatternFamily =
  | "LIFE"
  | "IDENTITY"
  | "CULTURE"
  | "NETWORK"
  | "SYSTEMS"
  | "VALUE";

export type MatchStrength = "strong" | "medium" | "weak";

export interface SevenVoicesPattern {
  id: string;                     // e.g. "L1", "I2"
  family: PatternFamily;
  label: string;                  // short human label
  template: SevenVoice[];         // vowel sequence to match, e.g. ["A","A","E"]
  type: "path" | "cluster";
  description: string;            // one-sentence explanation
  matchHint?: string;             // OPTIONAL: simple description of how to match
}

export const SEVEN_VOICES_PATTERNS: SevenVoicesPattern[] = [
  // --- LIFE ---
  {
    id: "L1",
    family: "LIFE",
    label: "Initiating Action",
    template: ["A"],
    type: "path",
    description: "Single A – outward, initiating action.",
  },
  {
    id: "L2",
    family: "LIFE",
    label: "Potential to Act",
    template: ["U", "A"],
    type: "path",
    description: "Breath/potential → act.",
  },
  // --- IDENTITY ---
  {
    id: "I1",
    family: "IDENTITY",
    label: "Inner Focus",
    template: ["I"],
    type: "path",
    description: "Focused, inner ray of light.",
  },
  {
    id: "I2",
    family: "IDENTITY",
    label: "Act to Focus",
    template: ["A", "I"],
    type: "path",
    description: "Act → focus.",
  },
  // --- CULTURE ---
  {
    id: "C1",
    family: "CULTURE",
    label: "Shared to Individual",
    template: ["E", "I"],
    type: "path",
    description: "Shared space → individual voice.",
  },
  // --- NETWORK ---
  {
    id: "N1",
    family: "NETWORK",
    label: "Balance to Flow",
    template: ["O", "U"],
    type: "path",
    description: "Balance → flow.",
  },
  // --- SYSTEMS / VALUE ---
  {
    id: "S1",
    family: "SYSTEMS",
    label: "Evaluation",
    template: ["A", "A", "E"],
    type: "path",
    description: "Double act resolving in evaluation.",
  },
  {
    id: "S2",
    family: "SYSTEMS",
    label: "Closing the Loop",
    template: ["U", "U", "Ë"],
    type: "path",
    description: "Deep potential looping and closing in unit.",
  },
  {
    id: "S3",
    family: "VALUE",
    label: "From Balance to Focus",
    template: ["O", "Ë", "I"],
    type: "path",
    description: "Balance → closure → inner focus.",
  },
];
