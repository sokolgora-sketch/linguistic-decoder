"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { TextDecoder } = require("node:util");
const { isAllowedDocsPath, readRawChanges } = require("./prepushChangeClassifier.cjs");

const utf8 = new TextDecoder("utf-8", { fatal: true });

function git(repoRoot, args) {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith("GIT_")) delete env[key];
  }
  env.GIT_TERMINAL_PROMPT = "0";
  return spawnSync("git", ["-C", repoRoot, ...args], {
    env,
    maxBuffer: 16 * 1024 * 1024,
    shell: false,
    encoding: null,
  });
}

function result(state, reason) {
  return { state, reason };
}

function readCommittedText(repoRoot, headSha, filePath) {
  const blob = git(repoRoot, ["show", `${headSha}:${filePath}`]);
  if (blob.status !== 0 || blob.error || !blob.stdout) return null;
  try {
    const content = utf8.decode(blob.stdout);
    return content.includes("\0") ? null : content;
  } catch {
    return null;
  }
}

function validateSkillFrontmatter(filePath, content) {
  const normalized = content.replace(/\r\n/g, "\n");
  if (normalized.includes("\r")) return `skill has bare CR bytes: ${filePath}`;
  if (!normalized.startsWith("---\n")) return `skill frontmatter is missing: ${filePath}`;
  const end = normalized.indexOf("\n---\n", 4);
  if (end < 0) return `skill frontmatter is not closed: ${filePath}`;

  const lines = normalized.slice(4, end).split("\n");
  const values = new Map();
  for (const line of lines) {
    const nameMatch = /^name: ([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(line);
    if (nameMatch) {
      if (values.has("name")) return `duplicate skill name field: ${filePath}`;
      values.set("name", nameMatch[1]);
      continue;
    }
    if (line.startsWith("description: ")) {
      if (values.has("description")) return `duplicate skill description field: ${filePath}`;
      let description;
      try {
        description = JSON.parse(line.slice("description: ".length));
      } catch {
        return `skill description must be a valid quoted scalar: ${filePath}`;
      }
      if (typeof description !== "string") return `skill description must be text: ${filePath}`;
      values.set("description", description);
      continue;
    }
    return `unsupported or malformed skill frontmatter field: ${filePath}`;
  }

  const expectedName = filePath.split("/")[2];
  const description = values.get("description");
  if (values.size !== 2 || values.get("name") !== expectedName) {
    return `skill frontmatter name does not match its directory: ${filePath}`;
  }
  if (!description || description.length > 1024 || !/^Use\b/.test(description)) {
    return `skill description is empty, too long, or lacks a use trigger: ${filePath}`;
  }
  return null;
}

function localTarget(repoRoot, headSha, sourcePath, destination) {
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(destination)) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(destination.split(/[?#]/, 1)[0]);
  } catch {
    return `invalid URL encoding in link from ${sourcePath}`;
  }
  if (decoded === "") return null;
  if (/[\\\0\r\n]/.test(decoded)) return `unsafe local link in ${sourcePath}`;

  const target = decoded.startsWith("/")
    ? decoded.slice(1)
    : path.posix.join(path.posix.dirname(sourcePath), decoded);
  const normalized = path.posix.normalize(target);
  if (normalized === ".." || normalized.startsWith("../") || normalized.startsWith("/")) {
    return `local link escapes the repository in ${sourcePath}`;
  }
  const exists = git(repoRoot, ["cat-file", "-e", `${headSha}:${normalized}`]);
  if (exists.status !== 0 || exists.error) return `local link target does not exist: ${sourcePath} -> ${destination}`;
  return null;
}

function readAddedMarkdownLines(repoRoot, baseSha, headSha, filePaths) {
  const diff = git(repoRoot, [
    "diff",
    "--unified=0",
    "--no-renames",
    "--no-ext-diff",
    "--no-textconv",
    baseSha,
    headSha,
    "--",
    ...filePaths,
  ]);
  if (diff.status !== 0 || diff.error) return null;
  let text;
  try {
    text = utf8.decode(diff.stdout || Buffer.alloc(0));
  } catch {
    return null;
  }

  const additions = new Map(filePaths.map((filePath) => [filePath, []]));
  let currentPath = null;
  let inHunk = false;
  for (const line of text.split("\n")) {
    if (line.startsWith("diff --git ")) {
      currentPath = null;
      inHunk = false;
      continue;
    }
    if (line.startsWith("+++ b/")) {
      currentPath = line.slice("+++ b/".length);
      continue;
    }
    if (line.startsWith("@@")) {
      inHunk = true;
      continue;
    }
    if (inHunk && currentPath && line.startsWith("+")) {
      additions.get(currentPath)?.push(line.slice(1));
    }
  }
  return new Map([...additions].map(([filePath, lines]) => [filePath, lines.join("\n")]));
}

function normalizeReference(label) {
  return label.trim().replace(/\s+/g, " ").toLowerCase();
}

function validateMarkdownLinks(repoRoot, headSha, filePath, content, changedContent = content) {
  const inlineMatches = [...changedContent.matchAll(/!?(?:\[[^\]\n]*\])\(([^)\n]*)\)/g)];
  const inlineStarts = changedContent.match(/\]\(/g) || [];
  if (inlineMatches.length !== inlineStarts.length) {
    return `unsupported or malformed inline Markdown link in ${filePath}`;
  }

  const destinations = inlineMatches.map((match) => match[1]);
  const definitions = new Map();
  for (const match of content.matchAll(/^\s{0,3}\[([^\]\n]+)\]:\s*(<[^>\n]+>|\S+)(?:\s+.*)?$/gm)) {
    const target = match[2].startsWith("<") ? match[2].slice(1, -1) : match[2];
    if (!definitions.has(normalizeReference(match[1]))) definitions.set(normalizeReference(match[1]), target);
  }
  for (const match of changedContent.matchAll(/^\s{0,3}\[([^\]\n]+)\]:\s*(<[^>\n]+>|\S+)(?:\s+.*)?$/gm)) {
    destinations.push(match[2].startsWith("<") ? match[2].slice(1, -1) : match[2]);
  }
  for (const match of changedContent.matchAll(/!?\[([^\]\n]+)\]\[([^\]\n]*)\]/g)) {
    const reference = normalizeReference(match[2] || match[1]);
    const target = definitions.get(reference);
    if (!target) return `Markdown reference link has no definition in ${filePath}: ${reference}`;
    destinations.push(target);
  }

  for (const raw of destinations) {
    const trimmed = raw.trim();
    const token = /^<([^>]+)>/.exec(trimmed)?.[1] || /^(\S+)/.exec(trimmed)?.[1];
    if (!token) return `empty Markdown link destination in ${filePath}`;
    if (/[()]/.test(token)) return `parenthesized Markdown link destination is unsupported in ${filePath}`;
    const failure = localTarget(repoRoot, headSha, filePath, token);
    if (failure) return failure;
  }
  return null;
}

function validateAgAgentsSkillReferences(repoRoot, headSha, filePath, content) {
  if (filePath !== "AGENTS.md") return null;
  const references = new Set(
    [...content.matchAll(/\.agents\/skills\/[A-Za-z0-9._/-]+\/SKILL\.md/g)].map((match) => match[0]),
  );
  for (const skillPath of references) {
    if (!isAllowedDocsPath(skillPath)) return `AGENTS.md contains an invalid skill path: ${skillPath}`;
    const skill = readCommittedText(repoRoot, headSha, skillPath);
    if (skill == null) return `AGENTS.md references a missing skill: ${skillPath}`;
    const failure = validateSkillFrontmatter(skillPath, skill);
    if (failure) return failure;
  }
  return null;
}

function validateDocsOnlyCommit({ repoRoot, baseSha, headSha }) {
  if (!repoRoot || !baseSha || !headSha) return result("UNCERTAIN", "verified commit context is missing");

  const root = git(repoRoot, ["rev-parse", "--show-toplevel"]);
  const topLevel = root.status === 0 ? utf8.decode(root.stdout).trim() : "";
  const currentHead = git(topLevel || repoRoot, ["rev-parse", "--verify", "HEAD^{commit}"]);
  if (currentHead.status !== 0 || utf8.decode(currentHead.stdout).trim() !== headSha) {
    return result("UNCERTAIN", "HEAD changed after pre-push classification");
  }
  const status = git(topLevel || repoRoot, ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
  if (status.status !== 0 || status.error || status.stdout.length !== 0) {
    return result("UNCERTAIN", "worktree changed after pre-push classification");
  }

  const diff = readRawChanges(topLevel || repoRoot, baseSha, headSha);
  if (diff.error) return result("UNCERTAIN", diff.error);
  const paths = diff.changes.map((change) => change.path);
  const whitespace = git(topLevel || repoRoot, ["diff", "--check", baseSha, headSha, "--", ...paths]);
  if (whitespace.status !== 0 || whitespace.error) {
    return result("FAIL", "git diff --check found whitespace errors in the pushed documentation");
  }
  const addedLines = readAddedMarkdownLines(topLevel || repoRoot, baseSha, headSha, paths);
  if (!addedLines) return result("UNCERTAIN", "could not identify added Markdown lines for link validation");

  const contents = new Map();
  for (const filePath of paths) {
    if (!isAllowedDocsPath(filePath)) return result("UNCERTAIN", `path is not allowlisted: ${filePath}`);
    const content = readCommittedText(topLevel || repoRoot, headSha, filePath);
    if (content == null) return result("FAIL", `could not read valid UTF-8 committed Markdown: ${filePath}`);
    if (!content.endsWith("\n")) return result("FAIL", `Markdown file has no final newline: ${filePath}`);
    contents.set(filePath, content);
  }

  const skillsToValidate = new Set(paths.filter((filePath) => /^\.agents\/skills\/[^/]+\/SKILL\.md$/.test(filePath)));
  for (const [filePath, content] of contents) {
    if (skillsToValidate.has(filePath)) {
      const failure = validateSkillFrontmatter(filePath, content);
      if (failure) return result("FAIL", failure);
    }
    const pathFailure = validateAgAgentsSkillReferences(topLevel || repoRoot, headSha, filePath, content);
    if (pathFailure) return result("FAIL", pathFailure);
    const linkFailure = validateMarkdownLinks(
      topLevel || repoRoot,
      headSha,
      filePath,
      content,
      addedLines.get(filePath) || "",
    );
    if (linkFailure) return result("FAIL", linkFailure);
  }

  return result("PASS", `validated ${paths.length} committed Markdown file(s), whitespace, skill frontmatter, and local references`);
}

module.exports = {
  validateDocsOnlyCommit,
  validateMarkdownLinks,
  readAddedMarkdownLines,
  validateSkillFrontmatter,
};
