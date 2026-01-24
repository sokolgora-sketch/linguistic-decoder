/**
 * Seven Principles Math v1 (Prism diagnostics)
 *
 * Pure helpers over index1 (1..7) and ring geometry.
 * NO scoring/ranking. Only gates/diagnostics.
 */

export type Index1 = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type RingIndex = 0 | 1 | 2 | 3; // 0 core, 1 inner, 2 middle, 3 outer

export function assertIndex1(i: number): asserts i is Index1 {
  if (![1, 2, 3, 4, 5, 6, 7].includes(i)) {
    throw new Error(`sevenPrinciples.math.v1: index1 out of range: ${i}`);
  }
}

export function mirrorIndex(i: Index1): Index1 {
  // 1↔7, 2↔6, 3↔5, 4↔4
  const m = (8 - i) as number;
  assertIndex1(m);
  return m;
}

export function ringOfIndex(i: Index1): RingIndex {
  // Core: 4
  // Inner: 3,5
  // Middle: 2,6
  // Outer: 1,7
  switch (i) {
    case 4:
      return 0;
    case 3:
    case 5:
      return 1;
    case 2:
    case 6:
      return 2;
    case 1:
    case 7:
      return 3;
  }
}

export function pathCrossesCenter(indices: Index1[]): boolean {
  return Array.isArray(indices) && indices.includes(4);
}

export function pathCompletion(indices: Index1[]): { endsOnE: boolean; endsOnË: boolean } {
  if (!Array.isArray(indices) || indices.length === 0) return { endsOnE: false, endsOnË: false };
  const last = indices[indices.length - 1];
  return { endsOnE: last === 2, endsOnË: last === 7 };
}

export function pathRingFlow(indices: Index1[]): RingIndex[] {
  if (!Array.isArray(indices) || indices.length === 0) return [];
  return indices.map(ringOfIndex);
}

export type DriftSummary =
  | { kind: "none" }
  | { kind: "flat"; steps: number }
  | { kind: "mostly_increasing"; up: number; down: number; flat: number; steps: number }
  | { kind: "mostly_decreasing"; up: number; down: number; flat: number; steps: number }
  | { kind: "mixed"; up: number; down: number; flat: number; steps: number };

export function pathDrift(indices: Index1[]): DriftSummary {
  if (!Array.isArray(indices) || indices.length <= 1) return { kind: "none" };

  let up = 0;
  let down = 0;
  let flat = 0;

  for (let k = 1; k < indices.length; k++) {
    const a = indices[k - 1];
    const b = indices[k];
    if (b > a) up++;
    else if (b < a) down++;
    else flat++;
  }

  const steps = indices.length - 1;
  if (up === 0 && down === 0) return { kind: "flat", steps };

  if (up > down) return { kind: "mostly_increasing", up, down, flat, steps };
  if (down > up) return { kind: "mostly_decreasing", up, down, flat, steps };
  return { kind: "mixed", up, down, flat, steps };
}
