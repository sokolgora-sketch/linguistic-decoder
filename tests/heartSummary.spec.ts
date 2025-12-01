import { buildHeartSummaryText } from "../src/shared/heartSummary";

describe("buildHeartSummaryText", () => {
  it("builds a readable snapshot for a normal heart result", () => {
    const result = {
      input: {
        normalized: "study",
        raw: "study",
      },
      heartPaths: {
        primary: {
          voiceSequence: ["U", "I"],
          ringPath: [1, 1],
          levelPath: ["low", "high"],
          tension: "low",
          frontierConsonants: 7,
        },
      },
    };

    const text = buildHeartSummaryText(result as any);
    expect(text).not.toBeNull();

    // Basic sanity checks on the text we copy to clipboard
    expect(text).toContain('Seven-Voices heart snapshot for "study"');
    expect(text).toContain("Primary path: U → I");
    expect(text).toContain("Rings: 1 → 1");
    expect(text).toContain("Levels: low → high");
    expect(text).toContain("Tension: low");
    expect(text).toContain("Frontier consonants: 7");
  });

  it("returns null when there is no heart data", () => {
    const text = buildHeartSummaryText({} as any);
    expect(text).toBeNull();
  });
});