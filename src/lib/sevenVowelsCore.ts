// src/lib/sevenVowelsCore.ts

// The 7 legal voices in the system
export type Voice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
export type VoicePath = Voice[];

// Explicit vector type for the 7 voices
export type VoiceVector = {
  A: number;
  E: number;
  I: number;
  O: number;
  U: number;
  Y: number;
  Ë: number;
};

export type Ring = "INNER" | "MIDDLE" | "OUTER" | "MEDIATOR";

const VOICES: Voice[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

/**
 * Extract the Seven-vowel vowel path from a word.
 *
 * - Keeps only {A,E,I,O,U,Y,Ë} (case-insensitive).
 * - Returns them in order of appearance.
 * - If no vowels are found, returns null.
 */
export function extractVowelPath(input: string): VoicePath | null {
  if (!input) return null;

  const upper = input.toUpperCase();
  const path: VoicePath = [];

  for (const ch of upper) {
    if (VOICES.includes(ch as Voice)) {
      path.push(ch as Voice);
    }
  }

  return path.length > 0 ? path : null;
}

/**
 * Create an empty voice vector with all counts = 0.
 */
export function createEmptyVoiceVector(): VoiceVector {
  return { A: 0, E: 0, I: 0, O: 0, U: 0, Y: 0, Ë: 0 };
}

/**
 * Count how many times each Voice appears in the path.
 * If path is null, returns an all-zero vector.
 */
export function voiceVectorFromPath(path: VoicePath | null): VoiceVector {
  const vector = createEmptyVoiceVector();
  if (!path) return vector;

  for (const v of path) {
    vector[v] += 1;
  }
  return vector;
}

// Ring groupings according to your model
const INNER_VOICES: Voice[] = ["I", "U"];   // near heart, male
const MIDDLE_VOICES: Voice[] = ["E", "Y"];  // middle, female
const OUTER_VOICES: Voice[] = ["A", "Ë"];   // outer, father/mother
const MEDIATOR_VOICE: Voice = "O";

/**
 * Partition a path into rings.
 * - INNER: I, U
 * - MIDDLE: E, Y
 * - OUTER: A, Ë
 * - MEDIATOR: O (present or not)
 */
export function computeRings(path: VoicePath | null): {
  inner: Voice[];
  middle: Voice[];
  outer: Voice[];
  mediator: "O" | null;
} {
  if (!path || path.length === 0) {
    return { inner: [], middle: [], outer: [], mediator: null };
  }

  const inner: Voice[] = [];
  const middle: Voice[] = [];
  const outer: Voice[] = [];
  let mediator: "O" | null = null;

  for (const v of path) {
    if (v === MEDIATOR_VOICE) {
      mediator = "O";
      continue;
    }
    if (INNER_VOICES.includes(v)) inner.push(v);
    else if (MIDDLE_VOICES.includes(v)) middle.push(v);
    else if (OUTER_VOICES.includes(v)) outer.push(v);
  }

  return { inner, middle, outer, mediator };
}

// ... existing imports, types and functions stay as they are above

export type BalanceResult = {
  score: number; // 0 (unbalanced) → 1 (balanced)
  notes: string[];
};

export type TensionResult = {
  score: number; // 0 (calm) → 1 (high tension)
  notes: string[];
};

export type Rings = {
  inner: Voice[];
  middle: Voice[];
  outer: Voice[];
  mediator: "O" | null;
};

/**
 * Compute a simple balance metric by looking at how evenly
 * the 3 rings (inner/middle/outer) are populated.
 */
export function computeBalance(vector: VoiceVector): BalanceResult {
  const inner = vector.I + vector.U;
  const middle = vector.E + vector.Y;
  const outer = vector.A + vector.Ë;

  const totalRings = inner + middle + outer;
  if (totalRings === 0) {
    return {
      score: 0,
      notes: ["no voices in rings"],
    };
  }

  const avg = totalRings / 3;
  const diffInner = Math.abs(inner - avg);
  const diffMiddle = Math.abs(middle - avg);
  const diffOuter = Math.abs(outer - avg);

  const diffSum = diffInner + diffMiddle + diffOuter;
  const normalised = diffSum / totalRings; // 0 = perfect
  const score = Math.max(0, 1 - normalised); // 1 = perfect

  let dominant: string;
  if (inner >= middle && inner >= outer) dominant = "inner";
  else if (middle >= inner && middle >= outer) dominant = "middle";
  else dominant = "outer";

  const notes: string[] = [`dominant ring: ${dominant}`];

  if (score > 0.75) notes.push("overall balanced");
  else if (score < 0.4) notes.push("strong imbalance between rings");

  return { score, notes };
}

/**
 * Compute a simple tension metric based on how much one ring dominates.
 */
export function computeTension(vector: VoiceVector): TensionResult {
  const inner = vector.I + vector.U;
  const middle = vector.E + vector.Y;
  const outer = vector.A + vector.Ë;

  const totalRings = inner + middle + outer;
  if (totalRings === 0) {
    return {
      score: 0,
      notes: ["no voices in rings"],
    };
  }

  const maxRing = Math.max(inner, middle, outer);
  const minRing = Math.min(inner, middle, outer);

  if (maxRing === 0) {
    return { score: 0, notes: ["no ring activity"] };
  }

  const ratio = minRing / maxRing; // 1 = equal, 0 = one ring only
  const score = 1 - ratio; // 0 = calm, 1 = high tension

  const notes: string[] = [];
  if (score < 0.25) notes.push("low tension");
  else if (score > 0.75) notes.push("high tension between rings");

  return { score, notes };
}

export type Math7Summary = {
  path: VoicePath | null;
  vector: VoiceVector;
  rings: Rings;
  totalVoices: number;
  dominantVoices: Voice[];
  balance: BalanceResult;
  tension: TensionResult;
};

/**
 * High-level Math7 summary for a raw word.
 * This is the object we will later plug into analyzeWord().
 */
export function summarizeWordMath7(input: string): Math7Summary {
  const path = extractVowelPath(input);
  const vector = voiceVectorFromPath(path);
  const rings = computeRings(path);

  const totalVoices = Object.values(vector).reduce(
    (sum, v) => sum + v,
    0
  );

  const counts = Object.entries(vector) as [Voice, number][];
  const maxCount = counts.reduce((m, [, c]) => (c > m ? c : m), 0);
  const dominantVoices =
    maxCount <= 0
      ? []
      : counts
          .filter(([, c]) => c === maxCount)
          .map(([v]) => v);

  const balance = computeBalance(vector);
  const tension = computeTension(vector);

  return {
    path,
    vector,
    rings,
    totalVoices,
    dominantVoices,
    balance,
    tension,
  };
}
