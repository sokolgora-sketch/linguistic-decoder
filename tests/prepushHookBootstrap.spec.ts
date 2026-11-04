import { spawnSync } from "node:child_process";
import { chmodSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const { ensurePrepushHook } = require("../scripts/prepushHookBootstrap.cjs") as {
  ensurePrepushHook: (args: { repoRoot: string; mode?: string }) => { status: string; hooksPath?: string };
};
const roots: string[] = [];

function git(root: string, args: string[]) {
  const result = spawnSync("git", args, { cwd: root, encoding: "utf8", shell: false });
  if (result.error) throw result.error;
  return { status: result.status, stdout: result.stdout.trim() };
}
function fixture() {
  const root = mkdtempSync(path.join(os.tmpdir(), "zero-hook-bootstrap-"));
  roots.push(root);
  expect(git(root, ["init", "-q"]).status).toBe(0);
  git(root, ["config", "user.name", "Hook Fixture"]);
  git(root, ["config", "user.email", "hook@example.invalid"]);
  mkdirSync(path.join(root, ".githooks"));
  const hook = path.join(root, ".githooks", "pre-push");
  writeFileSync(hook, "#!/usr/bin/env bash\nexit 0\n");
  chmodSync(hook, 0o755);
  return { root, hook };
}
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

describe("mandatory pre-push hook bootstrap", () => {
  it("installs in an isolated clone and verifies idempotently", () => {
    const { root } = fixture();
    expect(ensurePrepushHook({ repoRoot: root }).status).toBe("INSTALLED");
    expect(git(root, ["config", "--get", "core.hooksPath"]).stdout).toBe(".githooks");
    expect(ensurePrepushHook({ repoRoot: root, mode: "prepare" }).status).toBe("READY");
    expect(ensurePrepushHook({ repoRoot: root, mode: "check" }).status).toBe("READY");
  });
  it("fails check mode when the hook is not active", () => {
    const { root } = fixture();
    expect(() => ensurePrepushHook({ repoRoot: root, mode: "check" })).toThrow(/not active/);
    expect(git(root, ["config", "--get", "core.hooksPath"]).status).toBe(1);
  });
  it("never overwrites a different configured hooks path", () => {
    const { root } = fixture();
    git(root, ["config", "--local", "core.hooksPath", ".custom"]);
    expect(() => ensurePrepushHook({ repoRoot: root })).toThrow(/different core.hooksPath/);
    expect(git(root, ["config", "--get", "core.hooksPath"]).stdout).toBe(".custom");
  });
  it("refuses to bypass an existing default Git pre-push hook", () => {
    const { root } = fixture();
    const defaultHook = path.resolve(root, git(root, ["rev-parse", "--git-path", "hooks/pre-push"]).stdout);
    mkdirSync(path.dirname(defaultHook), { recursive: true });
    writeFileSync(defaultHook, "#!/bin/sh\nexit 0\n");
    chmodSync(defaultHook, 0o755);
    expect(() => ensurePrepushHook({ repoRoot: root })).toThrow(/existing default pre-push hook would be bypassed/);
    expect(git(root, ["config", "--get", "core.hooksPath"]).status).toBe(1);
  });
  it("rejects a nonexecutable tracked hook", () => {
    const { root, hook } = fixture();
    chmodSync(hook, 0o644);
    expect(() => ensurePrepushHook({ repoRoot: root })).toThrow(/regular executable/);
  });
  it("skips npm prepare outside a Git checkout, but refuses explicit setup", () => {
    const root = mkdtempSync(path.join(os.tmpdir(), "zero-hook-no-git-"));
    roots.push(root);
    expect(ensurePrepushHook({ repoRoot: root, mode: "prepare" }).status).toBe("SKIPPED_NOT_REPOSITORY_ROOT");
    expect(() => ensurePrepushHook({ repoRoot: root })).toThrow(/root of this Git checkout/);
  });
  it("refuses unsafe shared Git configuration in a linked worktree", () => {
    const { root } = fixture();
    writeFileSync(path.join(root, "readme.txt"), "fixture\n");
    git(root, ["add", "."]);
    expect(git(root, ["commit", "-qm", "fixture"]).status).toBe(0);
    const linked = mkdtempSync(path.join(os.tmpdir(), "zero-hook-linked-"));
    rmSync(linked, { recursive: true, force: true });
    roots.push(linked);
    expect(git(root, ["worktree", "add", "-q", "--detach", linked]).status).toBe(0);
    expect(() => ensurePrepushHook({ repoRoot: linked })).toThrow(/Linked worktree/);
    expect(git(root, ["config", "--get", "core.hooksPath"]).status).toBe(1);
  });
  it("uses per-worktree hooksPath when linked-worktree config is enabled", () => {
    const { root } = fixture();
    writeFileSync(path.join(root, "readme.txt"), "fixture\n");
    git(root, ["add", "."]);
    expect(git(root, ["commit", "-qm", "fixture"]).status).toBe(0);
    git(root, ["config", "extensions.worktreeConfig", "true"]);
    const linked = mkdtempSync(path.join(os.tmpdir(), "zero-hook-linked-safe-"));
    rmSync(linked, { recursive: true, force: true });
    roots.push(linked);
    expect(git(root, ["worktree", "add", "-q", "--detach", linked]).status).toBe(0);
    expect(ensurePrepushHook({ repoRoot: linked }).status).toBe("INSTALLED");
    expect(git(linked, ["config", "--worktree", "--get", "core.hooksPath"]).stdout).toBe(".githooks");
    expect(git(root, ["config", "--local", "--get", "core.hooksPath"]).status).toBe(1);
  });
});
