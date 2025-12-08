import { buildShareSnippet } from "../src/lib/shareSnippet";
import { AnalyzeWordResultUI } from "@/shared/resultsUI";

const LOVE_ANALYSIS: AnalyzeWordResultUI = {
  word: "love",
  sanitized: "love",
  primaryPath: {
    voicePath: "V",
    levelPath: "1",
    ringPath: "1",
  },
  frontier: [],
  languageFamilies: [
    {
      language: "Latin",
      form: "amor",
      passes: true,
      morphologyMatrix: {
        pivot: "am-",
      },
      symbolic: [
        {
          tag: "attraction",
        },
      ],
    },
    {
      language: "Albanian",
      form: "dashuri",
      passes: true,
      morphologyMatrix: {
        pivot: "dash",
      },
      symbolic: [
        {
          tag: "attraction",
        },
      ],
    },
  ],
  history: [],
  engineMeta: {
    versionLine: "core-2",
    modeLabel: "strict",
    alphabetLabel: "auto",
    engineVersion: "2025-11-16-core-2",
    mode: "strict",
    alphabet: "auto",
  },
  symbolic: {
    label: "Attraction",
    notes: ["Attraction", "Affection", "Union"],
  },
};

const STUDY_ANALYSIS: AnalyzeWordResultUI = {
  word: "study",
  sanitized: "study",
  primaryPath: {
    voicePath: "U",
    levelPath: "-1",
    ringPath: "1",
  },
  frontier: [],
  languageFamilies: [
    {
      language: "Latin",
      form: "studium",
      passes: true,
      morphologyMatrix: {
        pivot: "stud",
      },
      symbolic: [
        {
          tag: "effort",
        },
      ],
    },
    {
      language: "Albanian",
      form: "studim",
      passes: true,
      morphologyMatrix: {
        pivot: "s'tu",
      },
    },
  ],
  history: [],
  engineMeta: {
    versionLine: "core-2",
    modeLabel: "strict",
    alphabetLabel: "auto",
    engineVersion: "2025-11-16-core-2",
    mode: "strict",
    alphabet: "auto",
  },
  symbolic: {
    label: "Effort",
    notes: ["Effort", "Focus", "Dedication"],
  },
};

describe("buildShareSnippet", () => {
  it("includes header, summary, engine meta, languages and symbolic for LOVE", () => {
    const snippet = buildShareSnippet({
      word: "love",
      analysis: LOVE_ANALYSIS,
    });

    expect(snippet).toContain("Linguistic Decoder — love");
    expect(snippet).toContain("Summary: V1.1");
    expect(snippet).toContain("Engine: core-2 · strict · auto");
    expect(snippet).toContain(
      "Languages: Latin – amor (pivot: am-, tag: attraction); Albanian – dashuri (pivot: dash, tag: attraction)"
    );
    expect(snippet).toContain("Symbolic (experimental): Attraction — Attraction");
  });

  it("includes header, summary, engine meta, languages and symbolic for STUDY", () => {
    const snippet = buildShareSnippet({
      word: "study",
      analysis: STUDY_ANALYSIS,
    });

    expect(snippet).toContain("Linguistic Decoder — study");
    expect(snippet).toContain("Summary: U-1.1");
    expect(snippet).toContain("Engine: core-2 · strict · auto");
    expect(snippet).toContain(
      "Languages: Latin – studium (pivot: stud, tag: effort); Albanian – studim (pivot: s'tu)"
    );
    expect(snippet).toContain("Symbolic (experimental): Effort — Effort");
  });

  it("is safe if heart/meta are missing", () => {
    const snippet = buildShareSnippet({
      word: "hope",
      analysis: {
        word: "hope",
        sanitized: "hope",
        primaryPath: null,
        frontier: [],
        languageFamilies: [],
        history: [],
        engineMeta: {
          engineVersion: "mock-v0",
          mode: "open",
          alphabet: "auto",
        },
      },
    });

    expect(snippet).toContain("Linguistic Decoder — hope");
    // Should still at least include Engine: line
    expect(snippet).toContain("Engine:");
  });
});
