import type { VowelVoice } from "../vowels/vowelVoices.v0.1";

// Canon symbolic ladder (UI + book + meaning doctrine)
export const VOICES_V0_1 = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
export type VoiceV0_1 = (typeof VOICES_V0_1)[number];

// Alias to make intent explicit
export const SYMBOLIC_ORDER_V0_1 = VOICES_V0_1;

// Color doctrine (rainbow ladder)
export const COLORS_BY_VOICE_V0_1: Record<VowelVoice, string> = {
  A: "Red",
  E: "Orange",
  I: "Yellow",
  O: "Green",
  U: "Blue",
  Y: "Indigo",
  Ë: "Violet",
} as const;

// Notes doctrine (symbolic correspondence; NOT acoustic truth)
export const NOTES_BY_VOICE_V0_1: Record<VowelVoice, string> = {
  A: "Do",
  E: "Re",
  I: "Mi",
  O: "Fa",
  U: "Sol",
  Y: "La",
  Ë: "Ti",
} as const;

// Project principles (your modern set, locked as symbolic doctrine)
// Assumption (v0.1): map the 7 principles in-order onto the symbolic ladder.
export const PRINCIPLES_BY_VOICE_MODERN_V0_1: Record<VowelVoice, string> = {
  A: "Truth",
  E: "Expansion",
  I: "Insight",
  O: "Balance",
  U: "Unity",
  Y: "Network Integrity",
  Ë: "Evolution",
} as const;

export const PRINCIPLES_SETS_V0_1 = {
  modern: PRINCIPLES_BY_VOICE_MODERN_V0_1,
  // v0.2 candidate: add "hermetic" as an explicit alternate set (still symbolic)
} as const;

export type PrinciplesSetKeyV0_1 = keyof typeof PRINCIPLES_SETS_V0_1;
export const DEFAULT_PRINCIPLES_SET_KEY_V0_1: PrinciplesSetKeyV0_1 = "modern";

export function getPrinciplesByVoiceV0_1(
  key: PrinciplesSetKeyV0_1 = DEFAULT_PRINCIPLES_SET_KEY_V0_1
): Record<VowelVoice, string> {
  return PRINCIPLES_SETS_V0_1[key];
}

// Single snapshot target (stable, human-scannable)
export const VOICE_DOCTRINE_V0_1 = {
  version: "v0.1",
  category: "symbolic_doctrine",
  voices: VOICES_V0_1,
  symbolicOrder: SYMBOLIC_ORDER_V0_1,
  colorsByVoice: COLORS_BY_VOICE_V0_1,
  notesByVoice: NOTES_BY_VOICE_V0_1,
  principles: {
    defaultSet: DEFAULT_PRINCIPLES_SET_KEY_V0_1,
    sets: PRINCIPLES_SETS_V0_1,
  },
} as const;
