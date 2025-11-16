import { computeC } from "../functions/sevenVoicesC";
import { Vowel } from "../functions/sevenVoicesCore";
import { CClass } from "../functions/languages";

// We pass voice paths and the consonant class per hop directly.

describe("computeC — ring-hop penalties per consonant class", () => {
  // Plosive expects |Δring| ∈ [2,3]
  it("A→A with Plosive window penalizes by 2", () => {
    // |Δ| = |3 - 3| = 0 → distance to 2 = 2
    expect(computeC(['A','A'] as Vowel[], ['Plosive'] as CClass[])).toBe(2);
  });

  // Sibilant Fricative expects [1,2]
  it("I→I with Sibilant window penalizes by 1", () => {
    // |Δ| = |1 - 1| = 0 → distance to 1 = 1
    expect(computeC(['I','I'] as Vowel[], ['SibilantFricative'] as CClass[])).toBe(1);
  });

  // Nasal expects [0,1]
  it("A→A with Nasal window is free (0)", () => {
    // |Δ| = 0 ∈ [0,1] → 0
    expect(computeC(['A','A'] as Vowel[], ['Nasal'] as CClass[])).toBe(0);
  });

  // Liquid expects [0,1]
  it("O→A with Liquid window penalizes by 2", () => {
    // |Δ| = |0 - 3| = 3; hi=1 → 3 - 1 = 2
    expect(computeC(['O','A'] as Vowel[], ['Liquid'] as CClass[])).toBe(2);
  });

  // Sanity: study-like hop U→I with Plosive window (d)
  it("U→I with Plosive window penalizes by 2", () => {
    // |Δ| = |1 - 1| = 0; lo=2 → 2
    expect(computeC(['U','I'] as Vowel[], ['Plosive'] as CClass[])).toBe(2);
  });
});
