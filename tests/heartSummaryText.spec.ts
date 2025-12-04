// tests/heartSummaryText.spec.ts

import { buildHeartSummaryText } from "../src/lib/heartSummaryText";

describe("buildHeartSummaryText", () => {
  it("formats a standard primary path", () => {
    const text = buildHeartSummaryText({
      word: "study",
      primaryPath: {
        voicePath: ["U", "I"],
        ringPath: [1, 1],
      },
    });

    expect(text).toBe("study: U → I (rings 1 → 1)");
  });

  it("handles empty paths defensively", () => {
    const text = buildHeartSummaryText({
      word: "???",
      primaryPath: {
        voicePath: [], // empty arrays → join("") → fallback to "?"
        ringPath: [],
      },
    });

    expect(text).toBe("???: ? (rings ?)");
  });
});