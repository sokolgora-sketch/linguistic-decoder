import { buildPublicSummarySnippet } from "./shareSnippetPublic";
import type { AnalyzeWordResultUI } from "@/shared/resultsUI";

describe("buildPublicSummarySnippet", () => {
  it("should build a public summary snippet with all fields", () => {
    const fakeResult = {
      word: "test",
      engineMeta: {
        engineLabel: "Test Engine",
        build: "1.0.0",
        modeLabel: "strict",
        alphabetLabel: "auto",
        rawVersion: "1.0.0-debug",
      },
      primaryPath: {
        voicePath: ["A", "B"],
        ringPath: [1, 2],
      },
      zheji: {
        functionalStatement: "A test statement",
        subject: "test subject",
        object: "test object",
        modifier: "test modifier",
        rootPolarity: "positive",
        tension: "high",
      },
      symbolic: {
        summary: "A test summary",
      },
      options: {
        mode: "strict",
        alphabet: "auto",
      },
    } as unknown as AnalyzeWordResultUI;

    const snippet = buildPublicSummarySnippet(fakeResult);

    expect(snippet).toContain("Word: test");
    expect(snippet).toContain("Engine: Test Engine (build 1.0.0, mode strict, alphabet auto)");
    expect(snippet).toContain("Heart: A(1) → B(2)");
    expect(snippet).toContain("Structure: A test statement [subject: test subject, object: test object, modifier: test modifier, polarity: positive, tension: high]");
    expect(snippet).toContain("Symbolic reading: A test summary");
  });
});
