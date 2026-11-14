import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const { classifyPrePush } = require("../scripts/prepushChangeClassifier.cjs") as {
  classifyPrePush: (input: {
    repoRoot: string;
    remoteName?: string;
    remoteUrl?: string;
    stdin?: string;
  }) => { tier: string; reason: string; baseSha?: string; headSha?: string; changedPaths?: string[] };
};
const { validateDocsOnlyCommit } = require("../scripts/prepushDocsValidation.cjs") as {
  validateDocsOnlyCommit: (input: { repoRoot: string; baseSha: string; headSha: string }) => {
    state: string;
    reason: string;
  };
};

type Fixture = {
  root: string;
  remote: string;
  topicRef: string;
  zeroSha: string;
  cleanup: () => void;
};

function git(cwd: string, ...args: string[]) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (key.startsWith("GIT_")) delete env[key];
  env.GIT_TERMINAL_PROMPT = "0";
  const result = spawnSync("git", args, { cwd, env, encoding: "utf8", shell: false });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout.trim();
}

function makeFixture(pushMain = true, seed?: (root: string) => void): Fixture {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "prepush-classifier-"));
  const root = path.join(temp, "repo");
  const remote = path.join(temp, "remote.git");
  const emptyHooks = path.join(temp, "empty-hooks");
  fs.mkdirSync(root);
  fs.mkdirSync(emptyHooks);
  git(temp, "init", "--bare", "--initial-branch=main", remote);
  git(temp, "init", "--initial-branch=main", root);
  git(root, "config", "user.name", "Pre-push Test");
  git(root, "config", "user.email", "prepush-test@example.invalid");
  git(root, "config", "core.hooksPath", emptyHooks);
  git(root, "remote", "add", "origin", remote);

  fs.mkdirSync(path.join(root, "docs"));
  fs.writeFileSync(path.join(root, "docs/dev-workflow.md"), "# Workflow\n");
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Instructions\n");
  fs.writeFileSync(path.join(root, "CONTRIBUTING.md"), "# Contributing\n");
  fs.writeFileSync(
    path.join(root, "package.json"),
    JSON.stringify({
      scripts: {
        "gate:prepush": `node ${JSON.stringify(path.resolve(process.cwd(), "scripts/gate.prepush.mjs"))}`,
        lint: "echo FULL_LINT",
        test: "echo FULL_TEST",
      },
    }),
  );
  seed?.(root);
  git(root, "add", "--all");
  git(root, "commit", "-m", "base docs");
  if (pushMain) git(root, "push", "origin", "main");
  git(root, "checkout", "-b", "topic/docs");

  const objectFormat = git(root, "rev-parse", "--show-object-format");
  const hashLength = objectFormat === "sha256" ? 64 : 40;
  return {
    root,
    remote,
    topicRef: "refs/heads/topic/docs",
    zeroSha: "0".repeat(hashLength),
    cleanup: () => fs.rmSync(temp, { recursive: true, force: true }),
  };
}

function commit(fixture: Fixture, message = "docs update") {
  git(fixture.root, "add", "--all");
  git(fixture.root, "commit", "-m", message);
  return git(fixture.root, "rev-parse", "HEAD");
}

function classify(fixture: Fixture, oldRemoteSha = fixture.zeroSha) {
  const headSha = git(fixture.root, "rev-parse", "HEAD");
  return classifyPrePush({
    repoRoot: fixture.root,
    remoteName: "origin",
    remoteUrl: fixture.remote,
    stdin: `${fixture.topicRef} ${headSha} ${fixture.topicRef} ${oldRemoteSha}\n`,
  });
}

describe("pre-push fast-path classifier", () => {
  let fixtures: Fixture[] = [];
  afterEach(() => {
    for (const fixture of fixtures) fixture.cleanup();
    fixtures = [];
  });

  function fresh(pushMain = true) {
    const fixture = makeFixture(pushMain);
    fixtures.push(fixture);
    return fixture;
  }

  it("selects the fast lane for a clean new branch containing only allowlisted Markdown", () => {
    const fixture = fresh();
    fs.writeFileSync(path.join(fixture.root, "docs/dev-workflow.md"), "# Workflow\n\nUpdated.\n");
    const headSha = commit(fixture);

    const result = classify(fixture);

    expect(result.tier).toBe("DOCS_ONLY");
    expect(result.baseSha).toBe(git(fixture.root, "rev-parse", "main"));
    expect(result.headSha).toBe(headSha);
    expect(result.changedPaths).toEqual(["docs/dev-workflow.md"]);
  });

  it("selects the fast lane for a docs-only update to the exact live remote branch SHA", () => {
    const fixture = fresh();
    fs.writeFileSync(path.join(fixture.root, "docs/dev-workflow.md"), "# First\n");
    const oldRemoteSha = commit(fixture, "first docs commit");
    git(fixture.root, "push", "origin", "topic/docs");
    fs.writeFileSync(path.join(fixture.root, "docs/dev-workflow.md"), "# Second\n");
    commit(fixture, "second docs commit");

    expect(classify(fixture, oldRemoteSha).tier).toBe("DOCS_ONLY");
  });

  it("selects SCOPED_CODE for one bounded Instrument section change", () => {
    const fixture = fresh();
    const source = path.join(fixture.root, "src/ui/instrument/sections/ExampleCard.tsx");
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.writeFileSync(source, "export const ExampleCard = () => null;\n");
    commit(fixture, "bounded UI change");

    const result = classify(fixture);

    expect(result.tier).toBe("SCOPED_CODE");
    expect(result.changedPaths).toEqual(["src/ui/instrument/sections/ExampleCard.tsx"]);
  });

  it("keeps a directly changed focused UI test in the SCOPED_CODE diff", () => {
    const fixture = fresh();
    const source = path.join(fixture.root, "src/ui/instrument/InstrumentPanel.tsx");
    const test = path.join(fixture.root, "tests/ui.instrument.scopedGate.spec.tsx");
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.mkdirSync(path.dirname(test), { recursive: true });
    fs.writeFileSync(source, "export const InstrumentPanel = () => null;\n");
    fs.writeFileSync(test, "describe('scoped', () => {});\n");
    commit(fixture, "UI and focused test");

    const result = classify(fixture);

    expect(result.tier).toBe("SCOPED_CODE");
    expect(result.changedPaths).toEqual([
      "src/ui/instrument/InstrumentPanel.tsx",
      "tests/ui.instrument.scopedGate.spec.tsx",
    ]);
  });

  it.each([
    ["shared functional engine", "src/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1.ts"],
    ["API route", "app/api/analyze-v1/route.ts"],
    ["security policy", "src/shared/security/example.ts"],
    ["CI workflow", ".github/workflows/ci.yml"],
    ["source generator", "scripts/generateAlbanianOccupationalRoleCandidateBatch.v0_1.mts"],
    ["baseline-mutating test", "tests/validation/canonC2.runner.v0.4.spec.ts"],
    ["Jest configuration", "jest.config.mjs"],
    ["generated baseline", "src/data/validation/example-baseline.json"],
    ["unrecognized direct test", "tests/openInstrument.authority.spec.ts"],
  ])("uses FULL when %s is in the pushed diff", (_label, changedPath) => {
    const fixture = fresh();
    const source = path.join(fixture.root, "src/ui/instrument/sections/ExampleCard.tsx");
    const extra = path.join(fixture.root, changedPath);
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.mkdirSync(path.dirname(extra), { recursive: true });
    fs.writeFileSync(source, "export const ExampleCard = () => null;\n");
    fs.writeFileSync(extra, "changed\n");
    commit(fixture, "unsafe mixed change");

    expect(classify(fixture).tier).toBe("FULL");
  });

  it("retains verified changed paths for the full-validation tier", () => {
    const fixture = fresh();
    fs.mkdirSync(path.join(fixture.root, "src/shared"), { recursive: true });
    fs.writeFileSync(path.join(fixture.root, "src/shared/example.ts"), "export const example = true;\n");
    const headSha = commit(fixture, "shared source change");
    const result = classify(fixture);

    expect(result).toMatchObject({
      tier: "FULL",
      baseSha: git(fixture.root, "rev-parse", "main"),
      headSha,
      changedPaths: ["src/shared/example.ts"],
    });
  });

  it("uses FULL for a mixed documentation and scoped-code diff", () => {
    const fixture = fresh();
    fs.writeFileSync(path.join(fixture.root, "docs/dev-workflow.md"), "# Changed\n");
    const source = path.join(fixture.root, "src/ui/instrument/sections/ExampleCard.tsx");
    fs.mkdirSync(path.dirname(source), { recursive: true });
    fs.writeFileSync(source, "export const ExampleCard = () => null;\n");
    commit(fixture, "mixed docs and UI");

    expect(classify(fixture).tier).toBe("FULL");
  });

  it.each([
    ["TypeScript", "src/example.ts"],
    ["mixed Markdown and code", "src/example.ts"],
    ["the gate script", "scripts/gate.prepush.mjs"],
    ["the hook", ".githooks/pre-push"],
    ["CI configuration", ".github/workflows/ci.yml"],
    ["a dependency manifest", "package.json"],
    ["a lockfile", "package-lock.json"],
    ["MDX", "docs/example.mdx"],
  ])("uses the full lane when %s changes", (_label, changedPath) => {
    const fixture = fresh();
    fs.writeFileSync(path.join(fixture.root, "docs/dev-workflow.md"), "# Changed docs\n");
    const target = path.join(fixture.root, changedPath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "changed\n");
    commit(fixture);

    expect(classify(fixture).tier).toBe("FULL");
  });

  it.each([
    "docs/open-instrument/albanian-pronunciation-source-contract-v0.1.md",
    "docs/open-instrument/blind-validation-pilot-preregistration-v1.md",
    "docs/contracts/README.md",
    "docs/validation/VALIDATION_REPORT_LATEST_v0.2.md",
  ])("uses the full lane for scientific or validation document %s", (changedPath) => {
    const fixture = fresh();
    const target = path.join(fixture.root, changedPath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, "# Authority-bearing document\n");
    commit(fixture);

    expect(classify(fixture).tier).toBe("FULL");
  });

  it("continues to allow the narrow process-document subtree", () => {
    const fixture = fresh();
    fs.mkdirSync(path.join(fixture.root, "docs/process"), { recursive: true });
    fs.writeFileSync(path.join(fixture.root, "docs/process/workflows.md"), "# Workflow\n");
    commit(fixture);

    expect(classify(fixture).tier).toBe("DOCS_ONLY");
  });

  it("uses the full lane for ambiguous, multiple, or malformed ref data", () => {
    const fixture = fresh();
    fs.writeFileSync(path.join(fixture.root, "docs/dev-workflow.md"), "# Changed\n");
    const headSha = commit(fixture);
    const validLine = `${fixture.topicRef} ${headSha} ${fixture.topicRef} ${fixture.zeroSha}`;
    expect(classifyPrePush({ repoRoot: fixture.root }).tier).toBe("FULL");
    expect(classifyPrePush({
      repoRoot: fixture.root,
      remoteName: "origin",
      remoteUrl: fixture.remote,
      stdin: `${validLine}\n${validLine}\n`,
    }).tier).toBe("FULL");
    expect(classifyPrePush({
      repoRoot: fixture.root,
      remoteName: "origin",
      remoteUrl: fixture.remote,
      stdin: `${fixture.topicRef} ${headSha} refs/heads/other ${fixture.zeroSha}\n`,
    }).tier).toBe("FULL");
  });

  it("uses the full lane when remote/base data is missing, stale, mismatched, or unavailable", () => {
    const missingMain = fresh(false);
    fs.writeFileSync(path.join(missingMain.root, "docs/dev-workflow.md"), "# Changed\n");
    commit(missingMain);
    expect(classify(missingMain).tier).toBe("FULL");

    const stale = fresh();
    fs.writeFileSync(path.join(stale.root, "docs/dev-workflow.md"), "# First\n");
    const oldRemoteSha = commit(stale, "first docs commit");
    git(stale.root, "push", "origin", "topic/docs");
    fs.writeFileSync(path.join(stale.root, "docs/dev-workflow.md"), "# Second\n");
    const headSha = commit(stale, "second docs commit");
    git(stale.root, "push", "origin", "topic/docs");
    expect(classify(stale, oldRemoteSha).tier).toBe("FULL");

    expect(classifyPrePush({
      repoRoot: stale.root,
      remoteName: "origin",
      remoteUrl: `${stale.remote}-different`,
      stdin: `${stale.topicRef} ${headSha} ${stale.topicRef} ${headSha}\n`,
    }).tier).toBe("FULL");

    const unavailable = fresh();
    fs.writeFileSync(path.join(unavailable.root, "docs/dev-workflow.md"), "# Changed\n");
    commit(unavailable);
    fs.rmSync(unavailable.remote, { recursive: true, force: true });
    expect(classify(unavailable).tier).toBe("FULL");
  });

  it("uses the full lane for deletes, renames, executable modes, symlinks, and unusual filenames", () => {
    const deletion = fresh();
    fs.rmSync(path.join(deletion.root, "docs/dev-workflow.md"));
    commit(deletion, "delete docs");
    expect(classify(deletion).tier).toBe("FULL");

    const rename = fresh();
    fs.rmSync(path.join(rename.root, "docs/dev-workflow.md"));
    fs.writeFileSync(path.join(rename.root, "docs/renamed.md"), "# Renamed\n");
    commit(rename, "rename docs");
    expect(classify(rename).tier).toBe("FULL");

    const mode = fresh();
    fs.chmodSync(path.join(mode.root, "docs/dev-workflow.md"), 0o755);
    commit(mode, "change docs mode");
    expect(classify(mode).tier).toBe("FULL");

    const executable = makeFixture(true, (root) => {
      const script = path.join(root, "scripts", "audit.sh");
      fs.mkdirSync(path.dirname(script), { recursive: true });
      fs.writeFileSync(script, "#!/bin/sh\necho before\n", { mode: 0o755 });
    });
    fixtures.push(executable);
    fs.writeFileSync(
      path.join(executable.root, "scripts", "audit.sh"),
      "#!/bin/sh\necho after\n",
      { mode: 0o755 },
    );
    commit(executable, "update executable script");
    expect(classify(executable)).toMatchObject({
      tier: "FULL",
      changedPaths: ["scripts/audit.sh"],
    });

    const symlink = fresh();
    fs.symlinkSync("dev-workflow.md", path.join(symlink.root, "docs/link.md"));
    commit(symlink, "add docs symlink");
    expect(classify(symlink).tier).toBe("FULL");

    const unusual = fresh();
    fs.writeFileSync(path.join(unusual.root, "docs/unusual\nname.md"), "# Unusual\n");
    commit(unusual, "add unusual path");
    expect(classify(unusual).tier).toBe("FULL");

    const dotted = fresh();
    fs.writeFileSync(path.join(dotted.root, "docs/odd..name.md"), "# Odd\n");
    commit(dotted, "add unusual dotted path");
    expect(classify(dotted).tier).toBe("FULL");
  });

  it("uses the full lane for dirty or detached state and ignores caller-set fast-path flags", () => {
    const fixture = fresh();
    fs.writeFileSync(path.join(fixture.root, "docs/dev-workflow.md"), "# Changed\n");
    commit(fixture);
    fs.writeFileSync(path.join(fixture.root, "untracked.txt"), "untracked\n");
    expect(classify(fixture).tier).toBe("FULL");
    fs.rmSync(path.join(fixture.root, "untracked.txt"));

    git(fixture.root, "checkout", "--detach", "HEAD");
    expect(classify(fixture).tier).toBe("FULL");

    const prior = process.env.OPEN_INSTRUMENT_DOCS_ONLY;
    process.env.OPEN_INSTRUMENT_DOCS_ONLY = "1";
    try {
      expect(classifyPrePush({ repoRoot: fixture.root }).tier).toBe("FULL");
    } finally {
      if (prior === undefined) delete process.env.OPEN_INSTRUMENT_DOCS_ONLY;
      else process.env.OPEN_INSTRUMENT_DOCS_ONLY = prior;
    }
  });

  it("runs the frozen preflight before a verified documentation fast path", () => {
    const fixture = fresh();
    fs.writeFileSync(path.join(fixture.root, "docs/dev-workflow.md"), "# Updated docs\n");
    const headSha = commit(fixture);
    const update = `${fixture.topicRef} ${headSha} ${fixture.topicRef} ${fixture.zeroSha}\n`;
    const hookScript = path.resolve(__dirname, "../.githooks/pre-push");
    const gateScript = path.resolve(__dirname, "../scripts/gate.prepush.mjs");
    const env = { ...process.env, OPEN_INSTRUMENT_DOCS_ONLY: "1" };
    const fast = spawnSync("bash", [hookScript, "origin", fixture.remote], {
      cwd: fixture.root,
      env,
      encoding: "utf8",
      input: update,
      shell: false,
      timeout: 30_000,
    });
    expect(fast.status).toBe(0);
    expect(fast.stdout).toContain("frozen-contract preflight passed");
    expect(fast.stdout.indexOf("frozen-contract preflight passed")).toBeLessThan(fast.stdout.indexOf("verified documentation-only"));
    expect(fast.stdout).toContain("verified documentation-only");
    expect(fast.stdout).toContain("documentation-only:");

    const fallback = spawnSync(process.execPath, [gateScript], {
      cwd: fixture.root,
      env,
      encoding: "utf8",
      shell: false,
      timeout: 30_000,
    });
    expect(fallback.status).toBe(1);
    expect(fallback.stderr).toContain("FROZEN_CHANGESET_UNVERIFIED");
    expect(fallback.stdout).not.toContain("FULL_LINT");
    expect(fallback.stdout).not.toContain("FULL_TEST");
  });

  it("continues into full validation after a verified ordinary code change passes preflight", () => {
    const fixture = fresh();
    fs.mkdirSync(path.join(fixture.root, "src"), { recursive: true });
    fs.writeFileSync(path.join(fixture.root, "src/example.ts"), "export const example = true;\n");
    const headSha = commit(fixture, "ordinary source change");
    const update = `${fixture.topicRef} ${headSha} ${fixture.topicRef} ${fixture.zeroSha}\n`;
    const hookScript = path.resolve(__dirname, "../.githooks/pre-push");
    const result = spawnSync("bash", [hookScript, "origin", fixture.remote], {
      cwd: fixture.root,
      env: { ...process.env },
      encoding: "utf8",
      input: update,
      shell: false,
      timeout: 30_000,
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("frozen-contract preflight passed (0 changed identities checked)");
    expect(result.stdout).toContain("FULL_LINT");
    expect(result.stdout).toContain("FULL_TEST");
    expect(result.stdout.indexOf("frozen-contract preflight passed")).toBeLessThan(result.stdout.indexOf("FULL_LINT"));
  });

  it("rejects a changed frozen source before full lint and Jest start", () => {
    const protectedPath = "src/shared/openInstrument/motivationEngineDiscovery.v0_1.ts";
    const manifestPath = "docs/open-instrument/research-artifacts/test-s2/hash-manifest.json";
    const baseline = "export const frozen = 'baseline';\n";
    const fixture = makeFixture(true, (root) => {
      fs.mkdirSync(path.join(root, path.dirname(protectedPath)), { recursive: true });
      fs.mkdirSync(path.join(root, path.dirname(manifestPath)), { recursive: true });
      fs.writeFileSync(path.join(root, protectedPath), baseline);
      fs.writeFileSync(path.join(root, manifestPath), JSON.stringify({
        schemaVersion: "test.s2.hash-manifest.v0.1",
        procedureId: "test.s2.authority-truth.v0.1",
        inputs: [{ path: protectedPath, sha256: createHash("sha256").update(baseline).digest("hex") }],
      }, null, 2));
    });
    fixtures.push(fixture);
    fs.writeFileSync(path.join(fixture.root, protectedPath), "export const frozen = 'modified';\n");
    const headSha = commit(fixture, "modify frozen implementation");
    const update = `${fixture.topicRef} ${headSha} ${fixture.topicRef} ${fixture.zeroSha}\n`;
    const hookScript = path.resolve(__dirname, "../.githooks/pre-push");
    const result = spawnSync("bash", [hookScript, "origin", fixture.remote], {
      cwd: fixture.root,
      env: { ...process.env },
      encoding: "utf8",
      input: update,
      shell: false,
      timeout: 30_000,
    });

    expect(result.status).toBe(1);
    expect(result.stdout).toContain("frozen-contract preflight elapsed");
    expect(result.stderr).toContain("FROZEN_IDENTITY_MISMATCH");
    expect(result.stderr).toContain(protectedPath);
    expect(result.stderr).toContain(createHash("sha256").update(baseline).digest("hex"));
    expect(result.stderr).toContain(createHash("sha256").update("export const frozen = 'modified';\n").digest("hex"));
    expect(result.stdout).not.toContain("FULL_LINT");
    expect(result.stdout).not.toContain("FULL_TEST");
  });

  it("runs scoped UI validation through the hook and falls back to FULL on an empty selection", () => {
    const fixture = fresh();
    const packagePath = path.join(fixture.root, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8")) as {
      scripts: Record<string, string>;
    };
    packageJson.scripts.test = "echo SCOPED_TEST";
    packageJson.scripts["typecheck:prod"] = "echo SCOPED_TYPECHECK";
    fs.writeFileSync(packagePath, JSON.stringify(packageJson));

    const testsRoot = path.join(fixture.root, "tests");
    fs.mkdirSync(testsRoot, { recursive: true });
    for (let index = 0; index < 80; index += 1) {
      fs.writeFileSync(
        path.join(testsRoot, `ui.instrument.guard-${index}.spec.tsx`),
        "describe('guard', () => {});\n",
      );
    }
    const filesystemScanGuards = [
      "ui.devOnly.contractAdapter.import.guard.spec.ts",
      "doctrine/doctrineDrift.guard.v0.1.2.spec.ts",
      "vowels/orthographySsot.guard.v0.1.spec.ts",
      "vowels/phoneticIpaSsot.guard.v0.1.spec.ts",
    ];
    for (const guardPath of filesystemScanGuards) {
      const absolutePath = path.join(testsRoot, guardPath);
      fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
      fs.writeFileSync(absolutePath, "describe('filesystem guard', () => {});\n");
    }
    fs.writeFileSync(path.join(testsRoot, "ui.instrument.related.spec.tsx"), "describe('related', () => {});\n");
    fs.writeFileSync(path.join(testsRoot, "ui.instrument.direct.spec.tsx"), "describe('direct before', () => {});\n");
    for (let index = 0; index < 368; index += 1) {
      fs.writeFileSync(path.join(testsRoot, `unrelated-${index}.spec.tsx`), "describe('other', () => {});\n");
    }
    const sourceRoot = path.join(fixture.root, "src/ui/instrument/sections");
    fs.mkdirSync(sourceRoot, { recursive: true });
    const sourcePath = path.join(sourceRoot, "ExampleCard.tsx");
    fs.writeFileSync(sourcePath, "export const ExampleCard = () => null;\n");
    git(fixture.root, "add", "--all");
    git(fixture.root, "commit", "-m", "add local scoped-gate harness");
    git(fixture.root, "push", "origin", "topic/docs");
    const oldRemoteSha = git(fixture.root, "rev-parse", "HEAD");

    fs.writeFileSync(sourcePath, "export const ExampleCard = () => <div />;\n");
    fs.writeFileSync(path.join(testsRoot, "ui.instrument.direct.spec.tsx"), "describe('direct after', () => {});\n");
    const headSha = commit(fixture, "scoped UI push");

    const nodeModules = path.join(fixture.root, "node_modules");
    const jestBin = path.join(nodeModules, "jest/bin");
    const executableBin = path.join(nodeModules, ".bin");
    fs.mkdirSync(jestBin, { recursive: true });
    fs.mkdirSync(executableBin, { recursive: true });
    fs.appendFileSync(path.join(fixture.root, ".git/info/exclude"), "\n/node_modules/\n");
    fs.writeFileSync(
      path.join(executableBin, "eslint"),
      "#!/bin/sh\necho SCOPED_LINT\n",
      { mode: 0o755 },
    );

    const fakeJest = (related: string[]) => `
      const fs = require('node:fs');
      const path = require('node:path');
      const root = process.cwd();
      const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
        const absolute = path.join(dir, entry.name);
        if (entry.isDirectory()) return walk(absolute);
        return /\\.spec\\.tsx?$/.test(entry.name) ? [absolute] : [];
      });
      const inventory = walk(path.join(root, 'tests'));
      const related = ${JSON.stringify(related)}.map(name => path.join(root, 'tests', name));
      process.stdout.write(JSON.stringify(process.argv.includes('--findRelatedTests') ? related : inventory));
    `;
    fs.writeFileSync(path.join(jestBin, "jest.js"), fakeJest(["ui.instrument.related.spec.tsx"]));

    const hookScript = path.resolve(__dirname, "../.githooks/pre-push");
    const update = `${fixture.topicRef} ${headSha} ${fixture.topicRef} ${oldRemoteSha}\n`;
    const runHook = () => spawnSync("bash", [hookScript, "origin", fixture.remote], {
      cwd: fixture.root,
      env: { ...process.env },
      encoding: "utf8",
      input: update,
      shell: false,
      timeout: 30_000,
    });

    const scoped = runHook();
    expect(scoped.status).toBe(0);
    expect(scoped.stdout).toContain("verified scoped Instrument UI change");
    expect(scoped.stdout).toContain("86/454 serial Jest suites");
    for (const guardPath of filesystemScanGuards) {
      expect(scoped.stdout).toContain(guardPath);
    }
    expect(scoped.stdout).toContain("4 filesystem-scanning guards");
    expect(scoped.stdout).toContain("SCOPED_LINT");
    expect(scoped.stdout).toContain("SCOPED_TYPECHECK");
    expect(scoped.stdout).toContain("SCOPED_TEST");
    expect(scoped.stdout).not.toContain("FULL_LINT");

    fs.writeFileSync(path.join(jestBin, "jest.js"), fakeJest([]));
    const uncertain = runHook();
    expect(uncertain.status).toBe(0);
    expect(uncertain.stdout).toContain("selection became uncertain");
    expect(uncertain.stdout).toContain("using full gate");
    expect(uncertain.stdout).toContain("FULL_LINT");
    expect(uncertain.stdout).toContain("SCOPED_TEST");
  });
});

describe("documentation fast-path content validation", () => {
  let fixtures: Fixture[] = [];
  afterEach(() => {
    for (const fixture of fixtures) fixture.cleanup();
    fixtures = [];
  });

  it("checks diff whitespace, skill frontmatter, routed skill references, and local links", () => {
    const temp = fs.mkdtempSync(path.join(os.tmpdir(), "prepush-docs-"));
    const root = path.join(temp, "repo");
    const remote = path.join(temp, "remote.git");
    fs.mkdirSync(root);
    git(temp, "init", "--bare", "--initial-branch=main", remote);
    git(temp, "init", "--initial-branch=main", root);
    git(root, "config", "user.name", "Pre-push Test");
    git(root, "config", "user.email", "prepush-test@example.invalid");
    const emptyHooks = path.join(temp, "empty-hooks");
    fs.mkdirSync(emptyHooks);
    git(root, "config", "core.hooksPath", emptyHooks);
    git(root, "remote", "add", "origin", remote);
    fs.mkdirSync(path.join(root, ".agents/skills/zero-session-bootstrap"), { recursive: true });
    fs.writeFileSync(path.join(root, "CONTRIBUTING.md"), "# Contributing\n");
    fs.writeFileSync(path.join(root, "AGENTS.md"), "# Routing\n\n[Contributing](./CONTRIBUTING.md)\n");
    fs.writeFileSync(
      path.join(root, ".agents/skills/zero-session-bootstrap/SKILL.md"),
      '---\nname: zero-session-bootstrap\ndescription: "Use during session startup to verify repository state."\n---\n\n# Skill\n',
    );
    git(root, "add", "--all");
    git(root, "commit", "-m", "base docs");
    git(root, "push", "origin", "main");
    git(root, "checkout", "-b", "topic/docs");
    fs.writeFileSync(
      path.join(root, "AGENTS.md"),
      '# Routing\n\nUse `.agents/skills/zero-session-bootstrap/SKILL.md`.\n\n[Contributing](./CONTRIBUTING.md)\n',
    );
    git(root, "add", "AGENTS.md");
    git(root, "commit", "-m", "update routing");
    const baseSha = git(root, "rev-parse", "main");
    const headSha = git(root, "rev-parse", "HEAD");

    expect(validateDocsOnlyCommit({ repoRoot: root, baseSha, headSha }).state).toBe("PASS");
    fs.rmSync(temp, { recursive: true, force: true });
  });

  it("does not block a docs fast path for an unchanged pre-existing broken link", () => {
    const fixture = makeFixture();
    fixtures.push(fixture);
    fs.writeFileSync(
      path.join(fixture.root, "docs/dev-workflow.md"),
      "# Existing docs\n\n[Old missing target](./not-present.md)\n",
    );
    const oldRemoteSha = commit(fixture, "baseline with existing broken link");
    git(fixture.root, "push", "origin", "topic/docs");
    fs.writeFileSync(
      path.join(fixture.root, "docs/dev-workflow.md"),
      "# Existing docs\n\n[Old missing target](./not-present.md)\n\nNew paragraph.\n",
    );
    const headSha = commit(fixture, "change unrelated paragraph");

    const validation = validateDocsOnlyCommit({
      repoRoot: fixture.root,
      baseSha: oldRemoteSha,
      headSha,
    });

    expect(validation.state).toBe("PASS");
  });

  it("forces default diff prefixes and validates new links with diff.noprefix enabled", () => {
    const fixture = makeFixture();
    fixtures.push(fixture);
    const baseSha = git(fixture.root, "rev-parse", "main");
    fs.writeFileSync(
      path.join(fixture.root, "docs/dev-workflow.md"),
      "# Workflow\n\n[Missing target](./not-present.md)\n",
    );
    const headSha = commit(fixture);
    git(fixture.root, "config", "diff.noprefix", "true");

    const validation = validateDocsOnlyCommit({ repoRoot: fixture.root, baseSha, headSha });

    expect(validation.state).toBe("FAIL");
    expect(validation.reason).toContain("local link target does not exist");
  });

  it.each([
    ["malformed skill frontmatter", '---\nname: zero-session-bootstrap\ndescription: Use session startup\n---\n\n# Skill\n', "description"],
    ["a missing local link", "# Docs\n\n[Missing](./missing.md)\n", "does not exist"],
    ["a missing AGENTS skill reference", "# Routing\n\n`.agents/skills/zero-missing/SKILL.md`\n", "missing skill"],
    ["trailing whitespace", "# Docs \n", "whitespace"],
  ])("fails documentation validation for %s", (_label, changedContent, expectedReason) => {
    const fixture = makeFixture();
    fixtures.push(fixture);
    const baseSha = git(fixture.root, "rev-parse", "main");
    const filePath = _label === "malformed skill frontmatter"
      ? ".agents/skills/zero-session-bootstrap/SKILL.md"
      : _label === "a missing AGENTS skill reference"
        ? "AGENTS.md"
        : "docs/dev-workflow.md";
    const target = path.join(fixture.root, filePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, changedContent);
    const headSha = commit(fixture);

    const validation = validateDocsOnlyCommit({ repoRoot: fixture.root, baseSha, headSha });

    expect(validation.state).toBe("FAIL");
    expect(validation.reason.toLowerCase()).toContain(expectedReason.toLowerCase());
  });
});
