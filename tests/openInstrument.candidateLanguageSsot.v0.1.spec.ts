import fs from "node:fs";
import path from "node:path";

const replayScriptPath = path.join(
  process.cwd(),
  "scripts/openInstrumentLimitGeneralizationReplay.v0.1.mjs"
);

const readReplayScript = () => fs.readFileSync(replayScriptPath, "utf8");

describe("generalization replay candidate-language SSOT v0.1", () => {
  it("declares a versioned candidate-language policy separate from source-language scope", () => {
    const source = readReplayScript();

    expect(source).toContain("GENERALIZATION_REPLAY_CANDIDATE_LANGUAGE_POLICY_V0_1");
    expect(source).toContain('schemaVersion: "open-instrument.generalization-replay-candidate-language-policy.v0.1"');
    expect(source).toContain('scope: "target_grid_candidate_languages"');
    expect(source).toContain("GENERALIZATION_REPLAY_SOURCE_LANGUAGE_SCOPE_POLICY_V0_1");
    expect(source).toContain('sourceScope: "english_source_only"');
  });

  it("locks the active target-grid candidate languages and stable ids", () => {
    const source = readReplayScript();

    expect(source).toContain('Object.freeze({ id: "albanian", label: "Albanian" })');
    expect(source).toContain('Object.freeze({ id: "latin", label: "Latin" })');
    expect(source).toContain('Object.freeze({ id: "greek", label: "Greek" })');
    expect(source).toContain('Object.freeze({ id: "sanskrit", label: "Sanskrit" })');
    expect(source).toContain('activeTargetGridCandidateLanguageIds: Object.freeze(["albanian", "latin", "greek", "sanskrit"])');
  });

  it("routes target-grid labels through the SSOT instead of a standalone magic-string array", () => {
    const source = readReplayScript();

    expect(source).toContain("export function activeTargetGridCandidateLanguagesForReplay");
    expect(source).toContain("export function activeTargetGridCandidateLanguageLabelsForReplay");
    expect(source).toContain("activeTargetGridCandidateLanguagesForReplay().map((language) => language.label)");
    expect(source).toContain("activeTargetGridCandidateLanguageLabelsForReplay()");
  });

  it("defines fail-closed unsupported candidate-language behavior", () => {
    const source = readReplayScript();

    expect(source).toContain("export function assertSupportedCandidateLanguageForReplay");
    expect(source).toContain("UNSUPPORTED_CANDIDATE_LANGUAGE_FOR_CURRENT_GENERALIZATION_REPLAY");
    expect(source).toContain("Unsupported candidate language for current generalization replay");
    expect(source).toContain("throw error;");
    expect(source).toContain("error.supportedCandidateLanguages");
  });
});
