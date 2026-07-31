import { analyzeWord } from "../src/engine/analyzeWord";
import heartStudy from "./gold/heart-study-core.json";

describe("Seven-Voices heart core — study", () => {
  it("matches the golden heart snapshot", async () => {
    const analysis = analyzeWord("study");

    const heart = analysis.primaryPath;

    // Guard: make sure we’re actually looking at the core object
    expect(analysis.word).toBe("study");
    expect(analysis.meta.engineVersion).toBe("0.2.0-symbolic");

    // Compare only the heart piece so we can evolve other parts later
    expect(heart).toBeDefined();
    expect(heart.voicePath).toEqual("U → Y");
    expect(heart.ringPath).toEqual("1 → 2");
    expect(heart.levelPath).toEqual("low → low");
  });
});
