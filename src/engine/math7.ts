// src/engine/math7.ts
// Seven-Principles / Math7 "heart" summary layer.
// Pure function: takes a core analysis result and returns a compact summary
// of the primary voice path in terms of the Seven Principles.

// Fixed mapping from vowel → principle.
const PRINCIPLE_MAP: Record<string, string> = {
  A: "Truth / Action",
  E: "Expansion",
  I: "Insight",
  O: "Balance",
  U: "Unity",
  Y: "Network Integrity",
  "Ë": "Evolution",
};

export type Math7PrimarySummary = {
  voicePath: string;        // e.g. "U → I"
  levelPath: string;        // e.g. "Low → High"
  ringPath: string;         // e.g. "1 → 1"
  state: "flow" | "cycle";  // "flow" if first ≠ last, "cycle" if first == last
  totalSteps: number;       // how many vowels in the path
  totalMod7: number;        // totalSteps % 7, but mapped into 1..7
  principlesPath: string[]; // sequence of principles, same length as vowels
};

export type Math7Summary = {
  primary: Math7PrimarySummary;
};

/**
 * Compute the Math7 / Seven-Principles summary from a core engine result.
 *
 * - Expects result.primaryPath.voicePath to exist (e.g. "U → I").
 * - Never mutates the incoming result.
 * - Returns undefined if there's no usable primary path.
 */
export function computeMath7ForResult(result: any): Math7Summary | undefined {
  if (!result || !result.primaryPath) return undefined;

  const primary = result.primaryPath;
  const voicePath: string | undefined = primary.voicePath;
  const levelPath: string | undefined = primary.levelPath;
  const ringPath: string | undefined = primary.ringPath;

  if (!voicePath || typeof voicePath !== "string") {
    return undefined;
  }

  // Split "U → I" into ["U", "I"], trimming spaces.
  const vowels = voicePath
    .split("→")
    .map((v) => v.trim())
    .filter(Boolean);

  if (vowels.length === 0) return undefined;

  const first = vowels[0];
  const last = vowels[vowels.length - 1];
  const state: "flow" | "cycle" = first === last ? "cycle" : "flow";

  const principlesPath = vowels.map((v) => PRINCIPLE_MAP[v] ?? v);

  const totalSteps = vowels.length;
  const rawMod = totalSteps % 7;
  const totalMod7 = rawMod === 0 ? 7 : rawMod; // keep 1..7 only

  return {
    primary: {
      voicePath,
      levelPath: levelPath ?? "",
      ringPath: ringPath ?? "",
      state,
      totalSteps,
      totalMod7,
      principlesPath,
    },
  };
}
