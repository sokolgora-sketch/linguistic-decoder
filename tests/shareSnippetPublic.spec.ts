import { buildPublicSummarySnippet } from "@/lib/shareSnippetPublic";
import type { AnalyzeWordResultUI } from "@/shared/resultsUI";

describe("buildPublicSummarySnippet", () => {
  it("includes key public fields and hides internal meta", () => {
    const fakeResult: AnalyzeWordResultUI = {
      word: "test",
      engineMeta: {
        engineLabel: "Test Engine",
        build: "1.0.0",
        modeLabel: "strict",
        alphabetLabel: "auto",
        rawVersion: "1.0.0-debug"
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
      }
    };

    const snippet = buildPublicSummarySnippet(fakeResult);

    expect(snippet).toContain("Word: test");
    expect(snippet).toContain("Engine: Test Engine (build 1.0.0, mode strict, alphabet auto)");
    expect(snippet).toContain("Heart: test: A → B (rings 1 → 2)");
    expect(snippet).toContain("Structure: A test statement [subject: test subject, object: test object, modifier: test modifier, polarity: positive, tension: high]");
    expect(snippet).toContain("Symbolic reading: A test summary");
    expect(snippet).not.toContain("rawVersion");
    expect(snippet).not.toContain("debug");
  });

  it("handles missing optional fields gracefully", () => {
    const fakeResult: AnalyzeWordResultUI = {
      word: "test",
      engineMeta: {
        engineLabel: "Test Engine",
        build: "1.0.0",
        modeLabel: "strict",
        alphabetLabel: "auto",
      },
      primaryPath: {
        voicePath: "A",
        ringPath: 1,
      },
      options: {
        mode: "strict",
        alphabet: "auto",
      }
    };

    const snippet = buildPublicSummarySnippet(fakeResult);

    expect(snippet).toContain("Word: test");
    expect(snippet).toContain("Engine: Test Engine (build 1.0.0, mode strict, alphabet auto)");
    expect(snippet).toContain("Heart: test: A (rings 1)");
    expect(snippet).not.toContain("Structure:");
    expect(snippet).not.toContain("Symbolic reading:");
  });
});
