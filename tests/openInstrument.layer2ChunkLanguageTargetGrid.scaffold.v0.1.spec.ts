import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const scriptPath = path.join(process.cwd(), "scripts/openInstrumentLayer2ChunkLanguageTargetGrid.v0.1.mjs");

function runJson(args: string[]): unknown {
  return JSON.parse(execFileSync("node", [scriptPath, ...args], { encoding: "utf8" }));
}

describe("Open Instrument Layer 2 chunk-language target grid scaffold v0.1", () => {
  it("passes its deterministic self-check", () => {
    const result = runJson(["--self-check"]) as {
      ok: boolean;
      targetCount: number;
      allNullClassification: string;
    };

    expect(result.ok).toBe(true);
    expect(result.targetCount).toBe(8);
    expect(result.allNullClassification).toBe("TARGET_GRID_ALL_NULL_ACCEPTED");
  });

  it("builds the reviewed initial COM/IC target grid", () => {
    const grid = runJson(["--print-grid"]) as Array<{
      word: string;
      stage: string;
      segmentation: string;
      chunk: string;
      candidateLanguage: string;
      sourceLanguage: string;
      targetId: string;
      targetStatus: string;
    }>;

    expect(grid.map((target) => target.targetId)).toEqual([
      "comic::COM::Albanian",
      "comic::COM::Latin",
      "comic::COM::Greek",
      "comic::COM::Sanskrit",
      "comic::IC::Albanian",
      "comic::IC::Latin",
      "comic::IC::Greek",
      "comic::IC::Sanskrit",
    ]);

    expect(grid.every((target) => target.word === "comic")).toBe(true);
    expect(grid.every((target) => target.segmentation === "COM + IC")).toBe(true);
    expect(grid.every((target) => target.targetStatus === "pending")).toBe(true);
    expect(grid.every((target) => target.sourceLanguage === "English")).toBe(true);
  });

  it("defines target, response, and aggregate contracts without provider execution", () => {
    const source = readFileSync(scriptPath, "utf8");

    expect(source).toContain('const TARGET_GRID_SCHEMA_VERSION = "open-instrument.layer2-chunk-language-target-grid.scaffold.v0.1"');
    expect(source).toContain('const REVIEWED_CHUNKS = Object.freeze(["COM", "IC"])');
    expect(source).toContain('const REVIEWED_CANDIDATE_LANGUAGES = Object.freeze(["Albanian", "Latin", "Greek", "Sanskrit"])');
    expect(source).toContain("function buildTargetGrid");
    expect(source).toContain("function validateTarget");
    expect(source).toContain("function validateTargetResponse");
    expect(source).toContain("function classifyAggregate");
    expect(source).toContain("TARGET_GRID_SIGNAL_PRESENT");
    expect(source).toContain("TARGET_GRID_ALL_NULL_ACCEPTED");
    expect(source).toContain("TARGET_GRID_DEGENERATE_BLOCKED");
    expect(source).toContain("TARGET_GRID_PARTIAL_INVALIDATED");
    expect(source).toContain("TARGET_GRID_EXECUTION_BLOCKED");
  });

  it("preserves non-execution boundaries in the scaffold", () => {
    const source = readFileSync(scriptPath, "utf8");

    expect(source).not.toContain("fetch(");
    expect(source).not.toContain("OPENAI_BASE_URL");
    expect(source).not.toContain("ollama_openai_compat");
    expect(source).not.toContain("chat/completions");
    expect(source).not.toContain("providerFamily");
    expect(source).not.toContain("providerName");
  });
});
