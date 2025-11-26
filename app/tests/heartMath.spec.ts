// tests/heartMath.spec.ts
import {
  calculate,
  reduceToPrinciple,
  base7DigitsToVoices,
  decimalToBase7,
  evaluateVoiceEquation,
} from "../src/shared/heartMath";

describe("Seven-Principles Heart Math", () => {
  it("reduces numbers correctly", () => {
    expect(reduceToPrinciple(7)).toBe("Ë");
    expect(reduceToPrinciple(8)).toBe("A");
    expect(reduceToPrinciple(14)).toBe("Ë");
  });

  it("converts between base-7 and voices", () => {
    const digits = decimalToBase7(45); // [6, 3] -> voices [7, 4] -> [Ë, O]
    expect(base7DigitsToVoices(digits)).toEqual(["Ë", "O"]);
  });

  it("performs calculator ops", () => {
    const sum = calculate(4, 5, "add");
    expect(sum.decimal).toBe(9);
    expect(sum.principle).toBe("E");
  });

  it("evaluates voice equations", () => {
    const result = evaluateVoiceEquation("AO", "ËA", "add");
    expect(result.principle).toBeDefined();
    expect(result.principle).toBe('I');
  });

  it("evaluates digit equations", () => {
    const result = evaluateVoiceEquation("14", "71", "add");
    expect(result.principle).toBe('I');
  });
});
