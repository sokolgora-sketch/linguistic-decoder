import { existsSync, readFileSync } from "node:fs";

describe("Open Instrument live smoke runbook v0.1", () => {
  it("exposes a repo-native live smoke command with lane-correct proof words", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8"));
    const scriptPath = "scripts/open-instrument/live-smoke.v0.1.mjs";

    expect(pkg.scripts["open-instrument:live-smoke"]).toBe(`node ${scriptPath}`);
    expect(existsSync(scriptPath)).toBe(true);

    const script = readFileSync(scriptPath, "utf8");

    expect(script).toContain("production build");
    expect(script).toContain("/api/analyze-v1");
    expect(script).toContain('"da"');
    expect(script).toContain('"dam"');
    expect(script).toContain('"study"');
    expect(script).toContain('"damage"');
    expect(script).toContain('"xyz"');
    expect(script).toContain("Expected damage to expose reviewed DA evidence after bounded DA minRoots emission.");
    expect(script).toContain("Expected study to keep reviewed DI runtime projection absent.");
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
