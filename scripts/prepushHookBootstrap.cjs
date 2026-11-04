"use strict";

const { spawnSync } = require("node:child_process");
const { lstatSync, realpathSync } = require("node:fs");
const path = require("node:path");

function git(root, args) {
  const result = spawnSync("git", args, {
    cwd: root, encoding: "utf8", shell: false, timeout: 10_000,
  });
  return { status: result.status, stdout: result.stdout?.trim() ?? "", error: result.error };
}

function requiredGit(root, args, description) {
  const result = git(root, args);
  if (result.error || result.status !== 0 || !result.stdout) {
    throw new Error("Cannot " + description + "; Git state is unavailable");
  }
  return result.stdout;
}

function ensurePrepushHook({ repoRoot, mode = "install" }) {
  if (!["install", "check", "prepare"].includes(mode)) throw new Error("Unsupported hook setup mode");
  const root = realpathSync(repoRoot);
  const top = git(root, ["rev-parse", "--show-toplevel"]);
  if (top.status !== 0 || top.error || !top.stdout || realpathSync(top.stdout) !== root) {
    if (mode === "prepare") return { status: "SKIPPED_NOT_REPOSITORY_ROOT" };
    throw new Error("Hook setup must run at the root of this Git checkout");
  }

  const hookPath = path.join(root, ".githooks", "pre-push");
  let hook;
  try { hook = lstatSync(hookPath); }
  catch { throw new Error("Required .githooks/pre-push file is missing"); }
  if (!hook.isFile() || hook.isSymbolicLink() || (hook.mode & 0o111) === 0) {
    throw new Error("Required .githooks/pre-push must be a regular executable file");
  }

  const effective = git(root, ["config", "--get", "core.hooksPath"]);
  if (effective.error || ![0, 1].includes(effective.status)) {
    throw new Error("Cannot inspect the effective Git hooksPath");
  }
  if (effective.status === 0 && effective.stdout !== ".githooks") {
    throw new Error("A different core.hooksPath is configured; do not overwrite existing hooks");
  }
  if (effective.status === 0) return { status: "READY", hooksPath: ".githooks" };
  if (mode === "check") {
    throw new Error("Pre-push hook is not active; run npm run hooks:setup before implementation or pushing");
  }

  const gitDir = requiredGit(root, ["rev-parse", "--git-dir"], "find the Git directory");
  const commonDir = requiredGit(root, ["rev-parse", "--git-common-dir"], "find the shared Git directory");
  const linkedWorktree = path.resolve(root, gitDir) !== path.resolve(root, commonDir);
  if (linkedWorktree) {
    const worktreeConfig = git(root, ["config", "--bool", "--get", "extensions.worktreeConfig"]);
    if (worktreeConfig.status !== 0 || worktreeConfig.stdout !== "true") {
      throw new Error("Linked worktree has no safe per-worktree Git config; use an isolated clone, not shared core.hooksPath changes");
    }
    if (git(root, ["config", "--worktree", "core.hooksPath", ".githooks"]).status !== 0) {
      throw new Error("Could not activate the per-worktree pre-push hook");
    }
  } else if (git(root, ["config", "--local", "core.hooksPath", ".githooks"]).status !== 0) {
    throw new Error("Could not activate the local pre-push hook");
  }

  const verified = git(root, ["config", "--get", "core.hooksPath"]);
  if (verified.status !== 0 || verified.stdout !== ".githooks") {
    throw new Error("Pre-push hook activation could not be verified");
  }
  return { status: "INSTALLED", hooksPath: ".githooks" };
}
module.exports = { ensurePrepushHook };

if (require.main === module) {
  try {
    const arg = process.argv[2];
    if (arg && !["--check", "--prepare"].includes(arg)) throw new Error("Unsupported argument");
    const mode = arg === "--check" ? "check" : arg === "--prepare" ? "prepare" : "install";
    const result = ensurePrepushHook({ repoRoot: path.resolve(__dirname, ".."), mode });
    console.log("pre-push hook bootstrap: " + result.status + (result.hooksPath ? " (" + result.hooksPath + ")" : ""));
  } catch (error) {
    console.error("pre-push hook bootstrap FAILED: " + error.message);
    process.exitCode = 1;
  }
}
