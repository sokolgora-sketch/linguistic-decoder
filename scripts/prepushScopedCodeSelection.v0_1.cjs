"use strict";

const { spawnSync } = require("node:child_process");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const UI_SOURCE = /^src\/ui\/instrument\/InstrumentPanel\.tsx$|^src\/ui\/instrument\/sections\/(?:[A-Za-z0-9][A-Za-z0-9._-]*\/)*[A-Za-z0-9][A-Za-z0-9._-]*\.tsx$/;
const UI_TEST = /^tests\/(?:ui\.instrument|instrumentPanel)\.[A-Za-z0-9._-]+\.spec\.tsx?$/;
const UI_GUARD_TEST = /^tests\/(?:ui\.instrument\.[^/]+|instrumentPanel\.[^/]+)\.spec\.tsx?$/;
const MAX_CHANGED_PATHS = 20;
const MAX_CHANGED_SOURCES = 5;
const MAX_CHANGED_TESTS = 15;
const MAX_SELECTED_SUITES = 150;
const MAX_SELECTED_FRACTION = 0.2;
const MIN_UI_GUARD_SUITES = 80;

function full(reason) {
  return { state: "FULL", reason };
}

function safeRelativePath(value) {
  return (
    typeof value === "string" &&
    /^[A-Za-z0-9._/-]+$/.test(value) &&
    !value.startsWith("/") &&
    !value.includes("//") &&
    value.split("/").every((part) => part !== "" && part !== "." && part !== "..")
  );
}

function normalizeTestPath(repoRoot, value) {
  if (typeof value !== "string" || value.length === 0) return null;
  const absolute = path.resolve(repoRoot, value);
  const relative = path.relative(repoRoot, absolute).split(path.sep).join("/");
  return safeRelativePath(relative) && relative.startsWith("tests/") ? relative : null;
}

function parseJestList(stdout, repoRoot) {
  if (typeof stdout !== "string") return { error: "Jest list output was not text" };
  const start = stdout.indexOf("[");
  const end = stdout.lastIndexOf("]");
  if (start < 0 || end < start) return { error: "Jest list output did not contain a JSON array" };

  let value;
  try {
    value = JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return { error: "Jest list output contained malformed JSON" };
  }
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string")) {
    return { error: "Jest list output was not an array of test paths" };
  }

  const paths = [];
  for (const item of value) {
    const normalized = normalizeTestPath(repoRoot, item);
    if (!normalized) return { error: "Jest listed a path outside the repository test tree" };
    paths.push(normalized);
  }
  return { paths: [...new Set(paths)].sort() };
}

function runJest(repoRoot, args) {
  const entry = path.join(repoRoot, "node_modules/jest/bin/jest.js");
  const result = spawnSync(process.execPath, [entry, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
    shell: false,
    timeout: 30_000,
  });
  return {
    status: result.status,
    error: result.error,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
}

function listTests(repoRoot, changedSource, runner) {
  const args = ["-c", "jest.config.mjs", "--ci", "--runInBand", "--listTests", "--json"];
  if (changedSource) args.push("--findRelatedTests", path.resolve(repoRoot, changedSource));
  const result = runner(repoRoot, args);
  if (result.error || result.status !== 0) {
    return { error: `Jest test discovery failed${result.error ? `: ${result.error.message}` : ""}` };
  }
  return parseJestList(result.stdout, repoRoot);
}

function explicitSourceConsumers(repoRoot, allTests, sourcePaths) {
  const tokens = new Set();
  for (const sourcePath of sourcePaths) {
    const basename = path.posix.basename(sourcePath);
    tokens.add(sourcePath);
    tokens.add(basename);
    tokens.add(basename.replace(/\.[^.]+$/, ""));
    if (sourcePath.startsWith("src/ui/instrument/sections/")) {
      tokens.add("src/ui/instrument/sections/");
    }
  }

  const consumers = [];
  for (const testPath of allTests) {
    let source;
    try {
      source = readFileSync(path.join(repoRoot, testPath), "utf8");
    } catch {
      return { error: `could not inspect test source ${testPath}` };
    }
    if ([...tokens].some((token) => source.includes(token))) consumers.push(testPath);
  }
  return { paths: consumers };
}

function selectScopedCodeTests({ repoRoot, changedPaths, runner = runJest }) {
  if (!repoRoot || !Array.isArray(changedPaths) || changedPaths.length === 0) {
    return full("scoped-code inputs are missing");
  }
  if (changedPaths.length > MAX_CHANGED_PATHS || new Set(changedPaths).size !== changedPaths.length) {
    return full("changed path count is too large or ambiguous");
  }
  if (changedPaths.some((item) => !safeRelativePath(item))) {
    return full("a changed path is malformed or outside the repository");
  }

  const sourcePaths = changedPaths.filter((item) => UI_SOURCE.test(item));
  const directChangedTests = changedPaths.filter((item) => UI_TEST.test(item));
  if (sourcePaths.length + directChangedTests.length !== changedPaths.length) {
    return full("a changed path is outside the scoped Instrument UI allowlist");
  }
  if (sourcePaths.length > MAX_CHANGED_SOURCES || directChangedTests.length > MAX_CHANGED_TESTS) {
    return full("too many UI sources or direct tests for a scoped selection");
  }
  if (sourcePaths.length === 0 && directChangedTests.length === 0) {
    return full("no supported UI source or direct test was changed");
  }

  const allResult = listTests(repoRoot, null, runner);
  if (allResult.error) return full(allResult.error);
  const allTests = allResult.paths;
  if (allTests.length === 0) return full("Jest discovered no registered test suites");
  const allTestSet = new Set(allTests);

  for (const directTest of directChangedTests) {
    if (!allTestSet.has(directTest)) {
      return full(`directly changed test is not registered with Jest: ${directTest}`);
    }
  }

  const selected = new Set(directChangedTests);
  const relatedTestPaths = new Set();
  let relatedCount = 0;
  for (const sourcePath of sourcePaths) {
    const related = listTests(repoRoot, sourcePath, runner);
    if (related.error) return full(related.error);
    if (related.paths.length === 0) {
      return full(`Jest found no related tests for changed source ${sourcePath}`);
    }
    for (const testPath of related.paths) {
      if (!allTestSet.has(testPath)) {
        return full(`related-test selection returned an unregistered suite: ${testPath}`);
      }
      selected.add(testPath);
      relatedTestPaths.add(testPath);
    }
    relatedCount += related.paths.length;
  }

  const uiGuards = allTests.filter((testPath) => UI_GUARD_TEST.test(testPath));
  if (uiGuards.length < MIN_UI_GUARD_SUITES) {
    return full(`cross-cutting UI guard inventory is unexpectedly small (${uiGuards.length})`);
  }
  for (const testPath of uiGuards) selected.add(testPath);

  const explicitConsumers = explicitSourceConsumers(repoRoot, allTests, sourcePaths);
  if (explicitConsumers.error) return full(explicitConsumers.error);
  for (const testPath of explicitConsumers.paths) selected.add(testPath);

  if (selected.size === 0) return full("scoped test selection is empty");
  const allowedSize = Math.min(MAX_SELECTED_SUITES, Math.floor(allTests.length * MAX_SELECTED_FRACTION));
  if (selected.size > allowedSize) {
    return full(`selected suite count ${selected.size} exceeds the safe cap ${allowedSize}`);
  }

  return {
    state: "SELECTED",
    reason: "related tests, direct tests, all Instrument UI guards, and source-referencing consumers were included",
    testPaths: [...selected].sort(),
    relatedTestPaths: [...relatedTestPaths].sort(),
    sourcePaths,
    directChangedTests,
    relatedTestCount: relatedCount,
    uiGuardCount: uiGuards.length,
    explicitConsumerCount: explicitConsumers.paths.length,
    totalSuiteCount: allTests.length,
  };
}

module.exports = { selectScopedCodeTests };
