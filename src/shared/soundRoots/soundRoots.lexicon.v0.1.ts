// src/shared/soundRoots/soundRoots.lexicon.v0.1.ts
// SoundRoots v0.1 — deterministic "nature sound" signals (NOT proof of origin).
// Discipline:
// - No single-letter clusters (too broad).
// - Prefer specific carriers ("shi", "shush", "dr", "gur").
// - Locked by snapshot test.

export type SoundRootStrength = "soft" | "medium";

export type SoundRootDomain =
  | "rain_water"
  | "fire_cook"
  | "silence_wind"
  | "wind_air"
  | "water_splash"
  | "impact_generic"
  | "impact_heavy"
  | "break_crack"
  | "impact_wood"
  | "impact_stone";

export type SoundRoot = Readonly<{
  id: `SR${number}`;
  clusters: readonly string[];
  domain: SoundRootDomain;
  gloss: string;
  strength: SoundRootStrength;
}>;

export const SOUND_ROOTS_V0_1: readonly SoundRoot[] = [
  {
    id: "SR1",
    clusters: ["shi", "shii"],
    domain: "rain_water",
    gloss: "rain / water hiss",
    strength: "medium",
  },
  {
    id: "SR2",
    clusters: ["zhii", "zhi", "zh", "zii", "zi"],
    domain: "fire_cook",
    gloss: "sizzle / fry / cook",
    strength: "medium",
  },
  {
    id: "SR3",
    clusters: ["shush", "shh"],
    domain: "silence_wind",
    gloss: "hush / silence",
    strength: "medium",
  },
  {
    id: "SR4",
    clusters: ["fëshfësh", "fshh", "fësh", "fsh"],
    domain: "wind_air",
    gloss: "wind / rustle / whoosh",
    strength: "medium",
  },
  {
    id: "SR5",
    clusters: ["plash", "plap", "plup"],
    domain: "water_splash",
    gloss: "splash / plop / pour",
    strength: "soft",
  },
  {
    id: "SR6",
    clusters: ["trok", "tok", "tak", "tuk"],
    domain: "impact_generic",
    gloss: "impact / knock / tap",
    strength: "medium",
  },
  {
    id: "SR7",
    clusters: ["bum", "bam"],
    domain: "impact_heavy",
    gloss: "heavy impact / bang",
    strength: "soft",
  },
  {
    id: "SR8",
    clusters: ["krrak", "krak", "krr", "kr"],
    domain: "break_crack",
    gloss: "break / crack / snap",
    strength: "medium",
  },
  {
    id: "SR9",
    clusters: ["dr"],
    domain: "impact_wood",
    gloss: "wood contact / strike (carrier: dr-)",
    strength: "soft",
  },
  {
    id: "SR10",
    clusters: ["gur", "gr"],
    domain: "impact_stone",
    gloss: "stone clack / strike (carrier: gur-/gr-)",
    strength: "medium",
  },
] as const;
