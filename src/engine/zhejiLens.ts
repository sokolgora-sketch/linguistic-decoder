// src/engine/zhejiLens.ts
// Zheji Structural Lens: algorithms that sit on top of the 7-vowel core.
// Pure + deterministic. No I/O, no side effects.

import type { Vowel } from "../core/sevenVowelsCore";
import {
  type VowelTrait,
  type TensionMatrix,
  vowelTensionMatrix,
} from "../core/sevenVowelsTraits";

// === Types ================================================================

export interface TrinaryRoles {
  subject: string;   // initiator chunk
  object: string;    // material / context
  modifier: string;  // result / completion
}

export type RootPolarity = "Centripetal" | "Centrifugal" | "Static";

export type ConsonantSymmetry = "Symmetric" | "Asymmetric";

// === Algorithm 1 – Trinary Root Structure ================================

/**
 * Turn decomposition parts into a Subject–Object–Modifier triple.
 * Zero-Placeholder rule: always returns three slots, using "∅" when missing.
 */
export function toTrinaryRoles(parts: string[]): TrinaryRoles {
  const n = parts.length;

  if (n === 0) return { subject: "∅", object: "∅", modifier: "∅" };
  if (n === 1) return { subject: parts[0], object: "∅", modifier: "∅" };
  if (n === 2) return { subject: parts[0], object: parts[1], modifier: "∅" };

  const subject = parts[0];
  const modifier = parts[n - 1];
  const object = parts.slice(1, n - 1).join("-");

  return { subject, object, modifier };
}

// === Algorithm 2 – Root Polarity =========================================

/**
 * Aggregate vowel polarities along the path.
 * Centripetal vowels decrease score, Centrifugal increase, Neutral = 0.
 */
export function computeRootPolarity(
  vowelPath: Vowel[],
  traits: Record<Vowel, VowelTrait>
): RootPolarity {
  let score = 0;

  for (const v of vowelPath) {
    const p = traits[v].polarity;
    if (p === "Centrifugal") score += 1;
    else if (p === "Centripetal") score -= 1;
    // "Static" contributes 0
  }

  if (score > 0) return "Centrifugal";
  if (score < 0) return "Centripetal";
  return "Static";
}

// === Algorithm 3 – Vowel Shift Tension ===================================

/**
 * Per-step tension along the vowel path using the tension matrix.
 */
export function computeVowelTensionPath(
  vowelPath: Vowel[],
  tensionMatrix: TensionMatrix = vowelTensionMatrix
): number[] {
  if (vowelPath.length < 2) return [];
  const out: number[] = [];

  for (let i = 0; i < vowelPath.length - 1; i++) {
    const v1 = vowelPath[i];
    const v2 = vowelPath[i + 1];
    out.push(tensionMatrix[v1][v2]);
  }

  return out;
}

/**
 * Sum up a tension path into a single scalar.
 */
export function computeTotalTensionScore(tensionPath: number[]): number {
  return tensionPath.reduce((sum, t) => sum + t, 0);
}

// === Algorithm 4 – Consonant Symmetry ====================================

/**
 * Simple consonant symmetry heuristic: if the first and last consonant match,
 * we treat the frame as "closed" (Symmetric), otherwise "open" (Asymmetric).
 */
export function computeConsonantSymmetry(parts: string[]): ConsonantSymmetry {
  const joined = parts.join("");
  const onlyConsonants = joined.replace(/[AEIOUYË]/gi, "");

  if (onlyConsonants.length < 2) return "Asymmetric";

  const first = onlyConsonants[0];
  const last = onlyConsonants[onlyConsonants.length - 1];

  return first === last ? "Symmetric" : "Asymmetric";
}

// === Algorithm 5 – Functional Statement (Algoritmi Simbolik) =============

/**
 * Build a Zheji-style functional statement from vowel path + traits.
 * v1 is intentionally simple and fully deterministic.
 */
export function buildFunctionalStatement(
  parts: string[],
  vowelPath: Vowel[],
  traits: Record<Vowel, VowelTrait>
): string {
  if (!vowelPath.length) {
    return "No vocal path detected.";
  }

  const startTrait = traits[vowelPath[0]];
  const endTrait = traits[vowelPath[vowelPath.length - 1]];
  const midTrait =
    vowelPath.length > 2 ? traits[vowelPath[1]] : undefined;

  const segments: string[] = [];

  segments.push(`From ${startTrait.zhejiFunctionalRole}`);
  if (midTrait) {
    segments.push(`through ${midTrait.zhejiFunctionalRole}`);
  }
  segments.push(`towards ${endTrait.zhejiFunctionalRole}`);

  const base = segments.join(" ");

  const subject = parts[0];
  const modifier = parts.length > 1 ? parts[parts.length - 1] : undefined;

  if (subject || modifier) {
    const frame = [
      subject ? `"${subject}"` : "∅",
      "…",
      modifier ? `"${modifier}"` : "∅",
    ].join(" → ");
    return `${base} (built as ${frame})`;
  }

  return base;
}

// === Algorithm 6 – Root Family Id (for future inversion) ==================

/**
 * Build a stable family id from vowel path + consonant skeleton.
 * Two different words sharing this id are structurally related
 * under the Zheji lens.
 */
export function computeRootFamilyId(
  vowelPath: Vowel[],
  consonantSkeleton: string
): string {
  const v = vowelPath.join("");
  const c = consonantSkeleton.toLowerCase();
  return `${v}:${c}`;
}
