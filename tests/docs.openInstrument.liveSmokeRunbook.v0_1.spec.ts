import { existsSync, readFileSync } from "node:fs";

describe("Open Instrument live smoke runbook v0.1", () => {
  it("exposes a repo-native live smoke command with lane-correct proof words", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    const scriptPath = "scripts/open-instrument/live-smoke.v0.1.ts";

    expect(pkg.scripts["open-instrument:live-smoke"]).toBe(`tsx ${scriptPath}`);
    expect(existsSync(scriptPath)).toBe(true);

    const script = readFileSync(scriptPath, "utf8");
    const caseOwner = readFileSync(
      "scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts",
      "utf8",
    );
    const profileOwner = readFileSync(
      "src/shared/canonicalOperatorProfile.v0_1.ts",
      "utf8",
    );

    expect(script).toContain("production build");
    expect(script).toContain("/api/analyze-v1");
    expect(script).toContain(
      "buildCanonicalOperatorLiveSmokeCasesV0_1",
    );
    expect(script).toContain(
      "getCanonicalOperatorLiveSmokeWordsV0_1",
    );
    expect(script).toContain("assertSmokeCase");

    expect(caseOwner).toContain(
      "getResolvedCanonicalOperatorProfilesV0_1",
    );
    expect(caseOwner).toContain("positiveProofWords");
    expect(caseOwner).toContain("negativeControlWords");
    expect(caseOwner).toContain("runtimeProjection.evidenceText");

    expect(profileOwner).toContain(
      'positiveProofWords: ["da", "dam", "damage"]',
    );
    expect(profileOwner).toMatch(
      /operatorId: "DA",[\s\S]*?negativeControlWords:\s*\[\s*"study",\s*"xyz",\s*"mode",\s*"made",\s*"dome",\s*"di",\s*"studim",\s*\]/,
    );
    expect(profileOwner).toContain(
      'positiveProofWords: ["di", "study", "studim"]',
    );
    expect(profileOwner).toContain(
      'negativeControlWords: [',
    );
    for (const word of [
      '"dij"',
      '"dije"',
      '"dit"',
    ]) {
      expect(profileOwner).toContain(word);
    }

    expect(script).not.toContain(
      'const words = ["da", "dam", "study", "damage", "xyz"]',
    );
    expect(script).not.toContain("hasReviewedDaEvidence");
    expect(script).not.toContain("hasReviewedDiProjection");
  });

  it("documents the live smoke rule in the Open Instrument workflow docs", () => {
    const workflow = readFileSync("docs/open-instrument/local-smoke-check-workflow-v0.1.md", "utf8");
    const index = readFileSync("docs/process/workflows.md", "utf8");

    expect(workflow).toContain("Current Repo-Native Live Smoke (2026-07)");
    expect(workflow).toContain("npm run open-instrument:live-smoke");
    expect(workflow).toContain("production build");
    expect(workflow).toContain("live `/chat`");
    expect(workflow).toContain("real `/api/analyze-v1` calls with lane-correct proof words");
    expect(workflow).toContain("`da`");
    expect(workflow).toContain("`dam`");
    expect(workflow).toContain("`study`");
    expect(workflow).toContain("`damage`");
    expect(workflow).toContain("`xyz`");
    expect(workflow).toContain("Treat `damage` showing reviewed DA evidence as the current expected contract after bounded DA minRoots emission.");

    expect(index).toContain("running the repo-native `npm run open-instrument:live-smoke` command");
    expect(index).toContain("the lane-correct proof words `da`, `dam`, `study`, `damage`, and `xyz`");
  });
});
