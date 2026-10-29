import { spawnSync } from "node:child_process";
import path from "node:path";

const repositoryRoot = process.cwd();
const selectorPath = path.join(repositoryRoot, "scripts/jestShadowSelection.v0_1.mjs");

function runSelector(args: string[]) {
  return spawnSync(process.execPath, [selectorPath, ...args], {
    cwd: repositoryRoot,
    encoding: "utf8",
    timeout: 30_000,
  });
}

function readReport(stdout: string) {
  return JSON.parse(stdout) as {
    mode: string;
    selectionStatus: string;
    changedFiles: string[];
    directChangedTests: string[];
    suggestedTests: string[];
    fallbackReasons: string[];
    unsupportedOrUncertainFiles: string[];
    broaderValidationRecommended: boolean;
    mandatoryValidation: string[];
    warning: string;
  };
}

describe("Jest shadow test selection", () => {
  it("preserves an explicitly changed test file in the suggested set", () => {
    const result = runSelector(["--files", "tests/jestShadowSelection.v0_1.spec.ts"]);

    expect(result.status).toBe(0);
    const report = readReport(result.stdout);
    expect(report.mode).toBe("SHADOW_ONLY");
    expect(report.selectionStatus).toBe("COMPLETED");
    expect(report.directChangedTests).toContain("tests/jestShadowSelection.v0_1.spec.ts");
    expect(report.suggestedTests).toContain("tests/jestShadowSelection.v0_1.spec.ts");
    expect(report.warning).toMatch(/not validation authorization/i);
  });

  it("fails closed when the related-test set is empty", () => {
    const result = runSelector(["--files", "docs/dev-workflow.md"]);

    expect(result.status).toBe(0);
    const report = readReport(result.stdout);
    expect(report.suggestedTests).toEqual([]);
    expect(report.fallbackReasons).toContain("EMPTY_RELATED_TEST_SELECTION");
    expect(report.unsupportedOrUncertainFiles).toContain("docs/dev-workflow.md");
    expect(report.broaderValidationRecommended).toBe(true);
    expect(report.mandatoryValidation.join(" ")).toMatch(/gate:prepush/);
    expect(report.mandatoryValidation.join(" ")).toMatch(/hosted CI/);
    expect(report.mandatoryValidation.join(" ")).toMatch(/not equivalent/);
  });

  it("recommends broader validation for shared functional-engine changes", () => {
    const result = runSelector([
      "--files",
      "src/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1.ts",
    ]);

    expect(result.status).toBe(0);
    const report = readReport(result.stdout);
    expect(report.broaderValidationRecommended).toBe(true);
    expect(report.fallbackReasons).toContain("SHARED_CONTRACT_OR_ENGINE");
    expect(report.suggestedTests.length).toBeGreaterThan(0);
  });

  it("flags generators, generated data, and CI configuration for broader validation", () => {
    const result = runSelector([
      "--files",
      "scripts/generateAlbanianOccupationalRoleCandidateBatch.v0_1.mts",
      "src/data/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1.json",
      ".github/workflows/ci.yml",
    ]);

    expect(result.status).toBe(0);
    const report = readReport(result.stdout);
    expect(report.broaderValidationRecommended).toBe(true);
    expect(report.fallbackReasons).toContain("SCRIPT_OR_GENERATOR");
    expect(report.fallbackReasons).toContain("DATA_OR_GENERATED_ARTIFACT");
    expect(report.fallbackReasons).toContain("VALIDATION_OR_BUILD_CONFIGURATION");
    expect(report.unsupportedOrUncertainFiles).toEqual([
      ".github/workflows/ci.yml",
      "scripts/generateAlbanianOccupationalRoleCandidateBatch.v0_1.mts",
      "src/data/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1.json",
    ]);
  });

  it("rejects paths outside the repository and conflicting input modes", () => {
    const traversal = runSelector(["--files", "../outside.spec.ts"]);
    expect(traversal.status).toBe(2);
    expect(traversal.stdout).toContain("Path escapes the repository root");

    const conflicting = runSelector(["--base", "origin/main", "--files", "tests/example.spec.ts"]);
    expect(conflicting.status).toBe(2);
    expect(conflicting.stdout).toContain("Provide exactly one input");
  });
});
