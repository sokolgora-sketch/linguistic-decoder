export type SevenVowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export const SEVEN_VOWELS: ReadonlyArray<SevenVowel> = ["A", "E", "I", "O", "U", "Y", "Ë"];

/**
 * Public 1..7 mapping (clock ring).
 * A=1, E=2, I=3, O=4, U=5, Y=6, Ë=7
 */
export function value1to7(v: SevenVowel): number {
  switch (v) {
    case "A": return 1;
    case "E": return 2;
    case "I": return 3;
    case "O": return 4;
    case "U": return 5;
    case "Y": return 6;
    case "Ë": return 7;
  }
}

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

/**
 * Canonical engine standard:
 * - indices0to6 = values1to7 - 1
 * - sum0to6 = Σ(indices0to6)
 * - totalMod7 = totalMod7FromSum0to6(sum0to6)  (0..6)
* - total1to7 = totalMod7 + 1 (1..7)
 *
 * NOTE: We still compute rawSum (Σ values1to7) for wrap/events storytelling,
 * but totals must be derived from sum0to6 to stay consistent with src/engine/math7.ts.
 */
export function sum0to6FromValues1to7(values1to7: number[]): number {
  return values1to7.reduce((a, b) => a + (b - 1), 0);
}

export function totalMod7FromSum0to6(sum0to6: number): number {
  return mod(sum0to6, 7);
}

export function total1to7FromSum0to6(sum0to6: number): number {
  return mod(sum0to6, 7) + 1;
}


/** Clock modulo that returns 1..7 (never 0). */
export function total1to7FromSum(sum: number): number {
  // (sum shifted into 1..7 ring, safe-mod), with safe modulo
  return mod(sum - 1, 7) + 1;
}

/** Legacy mod7 total in 0..6 (keep for compatibility). */
export function totalMod7FromSum(sum: number): number {
  return mod(sum, 7);
}

/** NFC normalize, uppercase, and return basis. */
export function normalizeBasis(input: string): string {
  return String(input ?? "").normalize("NFC");
}

/** Strict vowel extraction: only A,E,I,O,U,Y,Ë. Everything else is ignored. */
export function extractSevenVowels(basisNfc: string): SevenVowel[] {
  const up = basisNfc.toUpperCase();
  const out: SevenVowel[] = [];
  for (const ch of up) {
    if (ch === "A" || ch === "E" || ch === "I" || ch === "O" || ch === "U" || ch === "Y" || ch === "Ë") {
      out.push(ch);
    }
  }
  return out;
}

/**
 * Jumps = circular deltas between consecutive values on 1..7 ring.
 * Returns values in range 0..6 where:
 * 0 = same, 1 = next clockwise, 6 = one step counterclockwise, etc.
 */
export function jumpsOnRing(values1to7: number[]): number[] {
  if (values1to7.length <= 1) return [];
  const jumps: number[] = [];
  for (let i = 1; i < values1to7.length; i++) {
    const prev = values1to7[i - 1];
    const next = values1to7[i];
    // map to 0..6 delta
    const delta = mod(next - prev, 7);
    jumps.push(delta);
  }
  return jumps;
}

export type Math7Packet = {
  values1to7: number[];
  rawSum: number;
  totalMod7: number;   // 0..6 (legacy)
  total1to7: number;   // 1..7 (clock)
  wrapCount: number;   // number of times rawSum crosses 7 boundaries
  jumps: number[];     // 0..6 ring deltas
  events: string[];    // annotations only
};

export function computeMath7(values1to7: number[]): Math7Packet {
  const rawSum = values1to7.reduce((a, b) => a + b, 0);

  // Canonical totals (match src/engine/math7.ts):
  // derive totals from 0..6 index sum, not from raw 1..7 sum.
  const sum0to6 = sum0to6FromValues1to7(values1to7);
  const totalMod7 = totalMod7FromSum0to6(sum0to6);
  const total1to7 = total1to7FromSum0to6(sum0to6);

  const wrapCount = rawSum > 0 ? Math.floor((rawSum - 1) / 7) : 0;

  const events: string[] = [];
  if (wrapCount > 0) events.push("WRAP_GATE");
  if (values1to7.length > 0) events.push("COMPLETION");

  // Optional story flags (never replace math state)
  if (rawSum === 8) events.push("INFINITE_PEACE");
  if (rawSum === 9) events.push("NEW_CYCLE");

  return {
    values1to7,
    rawSum,
    totalMod7,
    total1to7,
    wrapCount,
    jumps: jumpsOnRing(values1to7),
    events,
  };
}
