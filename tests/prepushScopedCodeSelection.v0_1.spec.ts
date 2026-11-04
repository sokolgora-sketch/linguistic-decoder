import path from "node:path";

const { selectScopedCodeTests } = require("../scripts/prepushScopedCodeSelection.v0_1.cjs") as {
  selectScopedCodeTests: (input: {
    repoRoot: string;
    changedPaths: string[];
    runner?: (repoRoot: string, args: string[]) => {
      status: number | null;
      error?: Error;
      stdout: string;
      stderr: string;
    };
  }) => {
    state: string;
    reason?: string;
    testPaths?: string[];
    relatedTestPaths?: string[];
    uiGuardCount?: number;
    explicitConsumerCount?: number;
  };
};

const repoRoot = process.cwd();
const sectionPath = "src/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1.tsx";
const changedDirectTest = "tests/ui.instrument.analysisStatus.v0_1.spec.tsx";

describe("fail-closed scoped-code Jest selector", () => {
  it("includes related tests, direct tests, all UI guards, and explicit source consumers", () => {
    const result = selectScopedCodeTests({
      repoRoot,
      changedPaths: [sectionPath, changedDirectTest],
    });

    expect(result.state).toBe("SELECTED");
    expect(result.testPaths).toContain(changedDirectTest);
    expect(result.relatedTestPaths).not.toContain(changedDirectTest);
    expect(result.testPaths).toContain("tests/ui.instrument.singleWordMotivationWorkbench.v0_1.spec.tsx");
    expect(result.uiGuardCount).toBeGreaterThanOrEqual(90);
    expect(result.testPaths!.length).toBeLessThanOrEqual(150);

    const panelSelection = selectScopedCodeTests({
      repoRoot,
      changedPaths: ["src/ui/instrument/InstrumentPanel.tsx"],
    });
    expect(panelSelection.state).toBe("SELECTED");
    expect(panelSelection.testPaths).toContain("tests/ui.devOnly.contractAdapter.import.guard.spec.ts");
    expect(panelSelection.testPaths).toContain("tests/openInstrument.multilingualDiscoverySubstrateS0.v0_2.spec.ts");
  });

  it("uses FULL for unsupported paths, unregistered direct tests, and malformed selection", () => {
    expect(
      selectScopedCodeTests({ repoRoot, changedPaths: ["src/shared/openInstrument/example.ts"] }).state,
    ).toBe("FULL");
    expect(
      selectScopedCodeTests({
        repoRoot,
        changedPaths: [sectionPath, "tests/openInstrument.authority.spec.ts"],
      }).state,
    ).toBe("FULL");

    const failed = selectScopedCodeTests({
      repoRoot,
      changedPaths: [sectionPath],
      runner: () => ({ status: 1, stdout: "", stderr: "Jest failed" }),
    });
    expect(failed.state).toBe("FULL");
    expect(failed.reason).toMatch(/discovery failed/i);

    const unparseable = selectScopedCodeTests({
      repoRoot,
      changedPaths: [sectionPath],
      runner: () => ({ status: 0, stdout: "not JSON", stderr: "" }),
    });
    expect(unparseable.state).toBe("FULL");
    expect(unparseable.reason).toMatch(/JSON array/i);
  });

  it("uses FULL when related-test selection is empty or outside the Jest inventory", () => {
    const inventoryPath = path.join(repoRoot, "tests/ui.instrument.analysisStatus.v0_1.spec.tsx");
    const emptyRelated = selectScopedCodeTests({
      repoRoot,
      changedPaths: [sectionPath],
      runner: (_root, args) => ({
        status: 0,
        stdout: JSON.stringify(args.includes("--findRelatedTests") ? [] : [inventoryPath]),
        stderr: "",
      }),
    });
    expect(emptyRelated.state).toBe("FULL");
    expect(emptyRelated.reason).toMatch(/no related tests/i);

    const foreignRelated = selectScopedCodeTests({
      repoRoot,
      changedPaths: [sectionPath],
      runner: (_root, args) => ({
        status: 0,
        stdout: JSON.stringify(
          args.includes("--findRelatedTests")
            ? [path.join(repoRoot, "tests/not-registered.spec.ts")]
            : [inventoryPath],
        ),
        stderr: "",
      }),
    });
    expect(foreignRelated.state).toBe("FULL");
    expect(foreignRelated.reason).toMatch(/unregistered suite/i);
  });
});
