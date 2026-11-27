import path from "node:path";

const {
  ENGINE_REQUIRED_GUARD_TESTS,
  FILESYSTEM_SCAN_GUARD_TESTS,
  selectScopedCodeTests,
  selectScopedEngineTests,
} = require("../scripts/prepushScopedCodeSelection.v0_1.cjs") as {
  ENGINE_REQUIRED_GUARD_TESTS: string[];
  FILESYSTEM_SCAN_GUARD_TESTS: string[];
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
    filesystemScanGuardCount?: number;
    explicitConsumerCount?: number;
  };
  selectScopedEngineTests: (input: {
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
    engineGuardCount?: number;
    filesystemScanGuardCount?: number;
    explicitConsumerCount?: number;
    totalSuiteCount?: number;
  };
};

const repoRoot = process.cwd();
const sectionPath = "src/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1.tsx";
const changedDirectTest = "tests/ui.instrument.analysisStatus.v0_1.spec.tsx";
const engineSourcePath = "src/shared/openInstrument/nativeCognitiveStateToContent.v0_1.ts";
const engineDirectTest = "tests/openInstrument.albanianNativeDomainToAgent.v0_1.spec.ts";

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
    expect(result.testPaths).toContain("tests/ui.devOnly.contractAdapter.import.guard.spec.ts");
    expect(result.testPaths).toContain("tests/doctrine/doctrineDrift.guard.v0.1.2.spec.ts");
    expect(result.testPaths).toContain("tests/vowels/orthographySsot.guard.v0.1.spec.ts");
    expect(result.testPaths).toContain("tests/vowels/phoneticIpaSsot.guard.v0.1.spec.ts");
    expect(result.filesystemScanGuardCount).toBe(4);
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

describe("fail-closed scoped-engine Jest selector", () => {
  it("selects a measured subset with related tests, direct tests, engine guards, and consumers", () => {
    const result = selectScopedEngineTests({
      repoRoot,
      changedPaths: [engineSourcePath, engineDirectTest],
    });

    if (result.state !== "SELECTED") throw new Error(JSON.stringify(result));
    expect(result.testPaths).toContain(engineDirectTest);
    expect(result.testPaths).toContain("tests/openInstrument.motivationEngineDiscovery.v0_1.spec.ts");
    expect(result.testPaths).toContain("tests/openInstrument.motivationEngineDiscoveryServerOnly.v0_1.spec.ts");
    expect(result.testPaths).toContain("tests/openInstrument.deterministicBetaSafety.v0_1.spec.ts");
    expect(result.testPaths).toContain("tests/apiAnalyzeV1.nativeLexicalSenseBinding.v0_1.spec.ts");
    expect(result.testPaths).toContain("tests/apiAnalyzeV1.albanianLexicalReading.v0_1.spec.ts");
    expect(result.testPaths).toContain("tests/ui.instrument.primaryAlbanianReadingCard.v0_1.spec.tsx");
    for (const testPath of FILESYSTEM_SCAN_GUARD_TESTS) {
      expect(result.testPaths).toContain(testPath);
    }
    expect(result.engineGuardCount).toBe(ENGINE_REQUIRED_GUARD_TESTS.length);
    expect(result.filesystemScanGuardCount).toBe(FILESYSTEM_SCAN_GUARD_TESTS.length);
    expect(result.explicitConsumerCount).toBeGreaterThan(0);
    expect(result.testPaths!.length).toBeLessThan(result.totalSuiteCount!);
    expect(result.testPaths!.length).toBeLessThanOrEqual(
      Math.min(200, Math.floor(result.totalSuiteCount! * 0.2)),
    );
  });

  it("uses FULL for unsupported engine paths, empty related selection, or a missing mandatory guard", () => {
    expect(
      selectScopedEngineTests({
        repoRoot,
        changedPaths: ["src/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1.ts"],
      }).state,
    ).toBe("FULL");

    const listed = [
      engineDirectTest,
      ...ENGINE_REQUIRED_GUARD_TESTS,
      ...FILESYSTEM_SCAN_GUARD_TESTS,
    ];
    const runner = (_root: string, args: string[]) => ({
      status: 0,
      stdout: JSON.stringify(
        args.includes("--findRelatedTests")
          ? []
          : listed.map((testPath) => path.join(repoRoot, testPath)),
      ),
      stderr: "",
    });
    const emptyRelated = selectScopedEngineTests({
      repoRoot,
      changedPaths: [engineSourcePath],
      runner,
    });
    expect(emptyRelated.state).toBe("FULL");
    expect(emptyRelated.reason).toMatch(/no related tests/i);

    const missingGuard = ENGINE_REQUIRED_GUARD_TESTS[1];
    const missingGuardRunner = (_root: string, args: string[]) => ({
      status: 0,
      stdout: JSON.stringify(
        args.includes("--findRelatedTests")
          ? [path.join(repoRoot, engineDirectTest)]
          : listed
              .filter((testPath) => testPath !== missingGuard)
              .map((testPath) => path.join(repoRoot, testPath)),
      ),
      stderr: "",
    });
    const missing = selectScopedEngineTests({
      repoRoot,
      changedPaths: [engineSourcePath],
      runner: missingGuardRunner,
    });
    expect(missing.state).toBe("FULL");
    expect(missing.reason).toContain(missingGuard);
  });
});
