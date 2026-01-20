import { value1to7, SEVEN_VOWELS } from "@/v1/math7.core.v1";
import { VOWEL_INDEX as INDEX_0_TO_6, SEVEN_VOWELS as SEVEN_VOWELS_0_TO_6 } from "@/shared/math7.core";

describe("audit v0.1.2 — vowel numeric mapping is consistent across systems", () => {
  it("1..7 public mapping equals (0..6 index + 1) for all seven vowels", () => {
    // Sanity: both layers agree on vowel order set
    expect([...SEVEN_VOWELS]).toEqual([...SEVEN_VOWELS_0_TO_6]);

    for (const v of SEVEN_VOWELS) {
      const public1to7 = value1to7(v);
      const index0to6 = INDEX_0_TO_6[v];

      expect(Number.isInteger(public1to7)).toBe(true);
      expect(Number.isInteger(index0to6)).toBe(true);

      // Public doctrine must be exactly index+1
      expect(public1to7).toBe(index0to6 + 1);

      // Range checks
      expect(public1to7).toBeGreaterThanOrEqual(1);
      expect(public1to7).toBeLessThanOrEqual(7);

      expect(index0to6).toBeGreaterThanOrEqual(0);
      expect(index0to6).toBeLessThanOrEqual(6);
    }
  });

  it("spot checks the doctrine explicitly", () => {
    // These are the canonical clock-ring values.
    expect(value1to7("A")).toBe(1);
    expect(value1to7("E")).toBe(2);
    expect(value1to7("I")).toBe(3);
    expect(value1to7("O")).toBe(4);
    expect(value1to7("U")).toBe(5);
    expect(value1to7("Y")).toBe(6);
    expect(value1to7("Ë")).toBe(7);
  });
});
