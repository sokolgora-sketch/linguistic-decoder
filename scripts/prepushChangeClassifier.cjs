"use strict";

const { spawnSync } = require("node:child_process");
const { TextDecoder } = require("node:util");

const utf8 = new TextDecoder("utf-8", { fatal: true });
const ALLOWED_ROOT_DOCS = new Set([
  "AGENTS.md",
  "CONTRIBUTING.md",
  "README.md",
]);

function full(reason) {
  return { tier: "FULL", reason };
}

function cleanGitEnvironment() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith("GIT_")) delete env[key];
  }
  env.GIT_TERMINAL_PROMPT = "0";
  return env;
}

function runGit(repoRoot, args, input) {
  const result = spawnSync("git", ["-C", repoRoot, ...args], {
    env: cleanGitEnvironment(),
    input,
    maxBuffer: 16 * 1024 * 1024,
    shell: false,
    encoding: null,
  });
  return {
    status: result.status,
    error: result.error,
    stdout: result.stdout || Buffer.alloc(0),
    stderr: result.stderr || Buffer.alloc(0),
  };
}

function outputText(result) {
  try {
    return utf8.decode(result.stdout);
  } catch {
    return null;
  }
}

function isAllowedDocsPath(filePath) {
  if (typeof filePath !== "string" || !/^[A-Za-z0-9._/-]+$/.test(filePath)) {
    return false;
  }
  if (
    filePath.startsWith("/") ||
    filePath.includes("//") ||
    filePath.split("/").some((part) => part === "" || part === "." || part === "..")
  ) {
    return false;
  }
  if (ALLOWED_ROOT_DOCS.has(filePath)) return true;
  if (/^\.agents\/skills\/[a-z0-9]+(?:-[a-z0-9]+)*\/SKILL\.md$/.test(filePath)) {
    return true;
  }
  if (!filePath.startsWith("docs/")) return false;
  const segments = filePath.slice("docs/".length).split("/");
  return segments.every(
    (segment) =>
      /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(segment) &&
      !segment.includes("..") &&
      !segment.endsWith("."),
  ) && segments[segments.length - 1]?.endsWith(".md");
}

function parseSingleUpdate(input, hashLength) {
  let text;
  try {
    text = utf8.decode(Buffer.isBuffer(input) ? input : Buffer.from(input || ""));
  } catch {
    return { error: "pre-push ref data is not valid UTF-8" };
  }
  if (text.includes("\0")) return { error: "pre-push ref data contains NUL" };
  if (text.endsWith("\n")) text = text.slice(0, -1);
  if (text.includes("\n") || text.includes("\r")) {
    return { error: "multiple or malformed ref updates" };
  }

  const fields = text.split(/[\t ]+/);
  if (fields.length !== 4 || fields.some((field) => field.length === 0)) {
    return { error: "expected exactly one complete pre-push ref update" };
  }

  const [localRef, localSha, remoteRef, remoteSha] = fields;
  const shaPattern = new RegExp(`^(?:[0-9a-f]{${hashLength}})$`);
  if (!shaPattern.test(localSha) || !shaPattern.test(remoteSha)) {
    return { error: "ref update contains an invalid object ID" };
  }
  if (
    localRef !== remoteRef ||
    !localRef.startsWith("refs/heads/") ||
    localRef === "refs/heads/" ||
    localRef.includes("..") ||
    localRef.includes("\\")
  ) {
    return { error: "only an identical local and remote branch ref is eligible" };
  }
  return { localRef, localSha, remoteRef, remoteSha };
}

function readRawChanges(repoRoot, baseSha, headSha) {
  const result = runGit(repoRoot, [
    "diff",
    "--raw",
    "-z",
    "--no-renames",
    "--no-ext-diff",
    "--no-textconv",
    "--no-abbrev",
    baseSha,
    headSha,
    "--",
  ]);
  if (result.status !== 0 || result.error) return { error: "could not inspect the pushed commit diff" };
  if (result.stdout.length === 0) return { error: "the pushed update has no verifiable file changes" };

  const fields = result.stdout.toString("binary").split("\0");
  if (fields.pop() !== "" || fields.length % 2 !== 0) {
    return { error: "Git returned malformed NUL-delimited diff data" };
  }

  const changes = [];
  for (let index = 0; index < fields.length; index += 2) {
    const header = fields[index];
    let filePath;
    try {
      filePath = utf8.decode(Buffer.from(fields[index + 1], "binary"));
    } catch {
      return { error: "a changed path is not valid UTF-8" };
    }
    const match = /^:([0-7]{6}) ([0-7]{6}) ([0-9a-f]{40}|[0-9a-f]{64}) ([0-9a-f]{40}|[0-9a-f]{64}) ([A-Z])$/.exec(header);
    if (!match) return { error: "Git returned an unrecognized raw diff record" };
    const [, oldMode, newMode, , , status] = match;
    if (
      !["A", "M"].includes(status) ||
      !["000000", "100644"].includes(oldMode) ||
      newMode !== "100644" ||
      !isAllowedDocsPath(filePath)
    ) {
      return { error: "the pushed diff contains a non-allowlisted or non-regular documentation change" };
    }
    if ((status === "A" && oldMode !== "000000") || (status === "M" && oldMode !== "100644")) {
      return { error: "the pushed diff has inconsistent file status and mode" };
    }
    changes.push({ path: filePath, status });
  }

  return changes.length > 0 ? { changes } : { error: "the pushed update has no verifiable file changes" };
}

function classifyPrePush({ repoRoot, remoteName, remoteUrl, stdin }) {
  if (!repoRoot || !remoteName || !remoteUrl || stdin == null) {
    return full("pre-push context is unavailable");
  }
  if (
    !/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(remoteName) ||
    remoteName.length > 255 ||
    remoteUrl.length > 4096 ||
    remoteUrl.startsWith("-") ||
    /[\r\n\0]/.test(remoteUrl) ||
    !/^(?:https?:\/\/|ssh:\/\/|git:\/\/|git@[A-Za-z0-9.-]+:|file:\/\/|\/)/.test(remoteUrl)
  ) {
    return full("push remote is not safely identifiable");
  }

  const formatResult = runGit(repoRoot, ["rev-parse", "--show-object-format"]);
  const objectFormat = outputText(formatResult)?.trim();
  const hashLength = objectFormat === "sha1" ? 40 : objectFormat === "sha256" ? 64 : 0;
  if (!hashLength) return full("Git object format is unavailable or unsupported");

  const update = parseSingleUpdate(stdin, hashLength);
  if (update.error) return full(update.error);
  const { localRef, localSha, remoteRef, remoteSha } = update;
  const zeroSha = "0".repeat(hashLength);
  if (localSha === zeroSha) return full("branch deletion is not documentation-only");

  const repoCheck = runGit(repoRoot, ["rev-parse", "--show-toplevel"]);
  const topLevel = outputText(repoCheck)?.trim();
  if (repoCheck.status !== 0 || !topLevel) return full("repository root could not be verified");

  const status = runGit(topLevel, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
  if (status.status !== 0 || status.error || status.stdout.length !== 0) {
    return full("worktree or index is dirty or could not be verified");
  }

  const branchResult = runGit(topLevel, ["symbolic-ref", "--quiet", "--short", "HEAD"]);
  const branch = outputText(branchResult)?.trim();
  const headResult = runGit(topLevel, ["rev-parse", "--verify", "HEAD^{commit}"]);
  const headSha = outputText(headResult)?.trim();
  if (
    branchResult.status !== 0 ||
    !branch ||
    `refs/heads/${branch}` !== localRef ||
    headResult.status !== 0 ||
    headSha !== localSha
  ) {
    return full("pushed ref is not the clean current branch at HEAD");
  }

  const refCheck = runGit(topLevel, ["check-ref-format", localRef]);
  if (refCheck.status !== 0) return full("pushed branch ref is invalid");

  const remotes = runGit(topLevel, ["remote"]);
  const remoteNames = outputText(remotes)?.trimEnd().split("\n") || [];
  if (remotes.status !== 0 || !remoteNames.includes(remoteName)) {
    return full("hook remote name is not a configured remote");
  }

  const configuredUrls = runGit(topLevel, ["remote", "get-url", "--push", "--all", remoteName]);
  const configuredUrlText = outputText(configuredUrls);
  const configuredUrlLines = configuredUrlText?.trimEnd().split("\n") || [];
  if (
    configuredUrls.status !== 0 ||
    configuredUrlLines.length !== 1 ||
    configuredUrlLines[0] !== remoteUrl
  ) {
    return full("hook remote does not match one configured push URL");
  }

  const refsResult = runGit(topLevel, ["ls-remote", "--refs", "--heads", remoteUrl]);
  const refsText = outputText(refsResult);
  if (refsResult.status !== 0 || refsResult.error || refsText == null) {
    return full("live remote refs could not be verified");
  }
  const remoteHeads = new Map();
  for (const line of refsText.split("\n")) {
    if (line === "") continue;
    const match = /^([0-9a-f]{40}|[0-9a-f]{64})\t(refs\/heads\/[A-Za-z0-9._/-]+)$/.exec(line);
    if (!match || remoteHeads.has(match[2])) return full("live remote refs are malformed or ambiguous");
    remoteHeads.set(match[2], match[1]);
  }

  const remoteCurrentSha = remoteHeads.get(remoteRef);
  let baseSha;
  if (remoteSha === zeroSha) {
    if (remoteCurrentSha) return full("new branch already exists on the remote");
    baseSha = remoteHeads.get("refs/heads/main");
    if (!baseSha) return full("live remote main is unavailable for a new branch");
  } else {
    if (!remoteCurrentSha || remoteCurrentSha !== remoteSha) {
      return full("pre-push remote branch SHA is stale or unavailable");
    }
    baseSha = remoteSha;
  }

  const baseCommit = runGit(topLevel, ["cat-file", "-e", `${baseSha}^{commit}`]);
  const headCommit = runGit(topLevel, ["cat-file", "-e", `${headSha}^{commit}`]);
  if (baseCommit.status !== 0 || headCommit.status !== 0) {
    return full("comparison commits are missing from the local object database");
  }
  const ancestry = runGit(topLevel, ["merge-base", "--is-ancestor", baseSha, headSha]);
  if (ancestry.status !== 0) return full("comparison base is not an ancestor of the pushed commit");

  const diff = readRawChanges(topLevel, baseSha, headSha);
  if (diff.error) return full(diff.error);
  return {
    tier: "DOCS_ONLY",
    reason: "single clean branch update verified against its live remote base",
    baseSha,
    headSha,
    changedPaths: diff.changes.map((change) => change.path),
  };
}

module.exports = {
  classifyPrePush,
  isAllowedDocsPath,
  readRawChanges,
};
