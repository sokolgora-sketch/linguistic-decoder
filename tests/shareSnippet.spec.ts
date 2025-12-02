import { buildShareSnippet } from "../src/lib/shareSnippet";

describe("buildShareSnippet", () => {
  const fakeAnalysis: any = {
    word: "study",
    engineVersion: "2025-11-16-core-2",
    mode: "strict",
    alphabet: "auto",
    solveMs: 1,
    heart: {
      primaryPath: {
        voicePath: ["U", "I"],
        ringPath: [1, 1],
        levelPath: [-1, 1],
      },
      tensionScore: 3,
      ascentScore: 2,
      complexityScore: 1,
    },
  };

  it("includes header, summary and engine meta", () => {
    const snippet = buildShareSnippet({
      word: "study",
      analysis: fakeAnalysis,
    });

    expect(snippet).toContain("Linguistic Decoder — study");
    expect(snippet).toContain("Summary:");
    expect(snippet).toContain("Engine: 2025-11-16-core-2 · strict · auto");
  });

  it("is safe if heart/meta are missing", () => {
    const snippet = buildShareSnippet({
      word: "hope",
      analysis: {
        word: "hope",
        engineVersion: "mock-v0",
        mode: "open",
        alphabet: "auto",
      } as any,
    });

    expect(snippet).toContain("Linguistic Decoder — hope");
    // Should still at least include Engine: line
    expect(snippet).toContain("Engine:");
  });
});
