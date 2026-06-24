import fs from "node:fs";
import path from "node:path";

const replayScriptPath = path.join(
  process.cwd(),
  "scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs"
);

const readReplayScript = () => fs.readFileSync(replayScriptPath, "utf8");

describe("generalization replay source-language scope guard v0.1", () => {
  it("declares the current replay path as English-source-only", () => {
    const source = readReplayScript();

    expect(source).toContain("GENERALIZATION_REPLAY_SOURCE_LANGUAGE_SCOPE_POLICY_V0_1");
    expect(source).toContain('sourceScope: "english_source_only"');
    expect(source).toContain('supportedSourceLanguages: Object.freeze(["English"])');
    expect(source).toContain("UNSUPPORTED_SOURCE_LANGUAGE_FOR_CURRENT_GENERALIZATION_REPLAY");
    expect(source).toContain("failClosed: true");
  });

  it("routes sourceLanguageForRequest through the fail-closed guard", () => {
    const source = readReplayScript();

    expect(source).toMatch(
      /export function sourceLanguageForRequest\(argsOrContext = \{\}\) \{\s*return assertSupportedSourceLanguageForRequest\(argsOrContext\)\.sourceLanguage;\s*\}/
    );
    expect(source).toContain("export function assertSupportedSourceLanguageForRequest");
    expect(source).toContain("throw error;");
  });

  it("keeps exact English/default source requests allowed while naming unsupported non-English rejection", () => {
    const source = readReplayScript();

    expect(source).toContain('return "English";');
    expect(source).toContain("Unsupported source language for current generalization replay");
    expect(source).toContain("English-source-only until a reviewed resolver replaces the scope guard");
    expect(source).toContain("error.sourceLanguage = sourceLanguage");
    expect(source).toContain("error.supportedSourceLanguages");
  });
});
