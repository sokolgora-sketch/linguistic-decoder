import type { VowelVoice } from "@/shared/vowels/vowelVoices.v0.1";

/**
 * SSOT: 7-voice integer geometry on an axial hex grid.
 * Deterministic. No floats in logic (TypeScript uses number, but we only do integer ops).
 *
 * Axial coords (q,r):
 *   O = (0,0) radius 0
 *   Ring1: I, U
 *   Ring2: E, Y
 *   Ring3: A, Ë
 *
 * NOTE: placement is doctrine + must be locked by snapshot tests.
 */

export type AxialV0_1 = { q: number; r: number };

export function voiceRadiusV0_1(v: VowelVoice): 0 | 1 | 2 | 3 {
  switch (v) {
    case "O":
      return 0;
    case "I":
    case "U":
      return 1;
    case "E":
    case "Y":
      return 2;
    case "A":
    case "Ë":
      return 3;
    default: {
      // exhaustive check — if VowelVoice expands, TS will complain
      const _never: never = v;
      return _never;
    }
  }
}

/**
 * Axial placement doctrine:
 * - Pick a consistent axis orientation and freeze it via tests.
 */
export function voiceToAxialV0_1(v: VowelVoice): AxialV0_1 {
  switch (v) {
    case "O":
      return { q: 0, r: 0 };

    // ring 1 (radius 1)
    case "I":
      return { q: 1, r: 0 };
    case "U":
      return { q: -1, r: 0 };

    // ring 2 (radius 2)
    case "E":
      return { q: 0, r: 2 };
    case "Y":
      return { q: 0, r: -2 };

    // ring 3 (radius 3)
    case "A":
      return { q: 3, r: 0 };
    case "Ë":
      return { q: -3, r: 0 };

    default: {
      const _never: never = v;
      return _never;
    }
  }
}

/**
 * Axial hex distance:
 * distance = (|dq| + |dr| + |dq+dr|) / 2
 */
export function hexDistanceAxialV0_1(a: AxialV0_1, b: AxialV0_1): number {
  const dq = a.q - b.q;
  const dr = a.r - b.r;
  const ds = dq + dr;
  const sum = Math.abs(dq) + Math.abs(dr) + Math.abs(ds);
  return sum / 2;
}

export function hexDistanceVoiceV0_1(a: VowelVoice, b: VowelVoice): number {
  return hexDistanceAxialV0_1(voiceToAxialV0_1(a), voiceToAxialV0_1(b));
}
