#!/usr/bin/env node

import { existsSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const VERSION = "jest-shadow-selection-v0.1";
const TEST_FILE = /^tests\/.+\.spec\.(?:ts|tsx)$/;
const JEST_INPUT_EXTENSION = /\.(?:ts|tsx|js|jsx|mjs|cjs|mts|cts|json)$/i;
const ALWAYS_REQUIRED = [
  "Keep the normal pre-push hook enabled; it must run npm run gate:prepush on every push.",
  "gate:quick and gate:prepush are not equivalent; gate:quick includes integration tests while gate:prepush does not.",
  "All required hosted CI checks remain mandatory before merge.",
  "This shadow selection does not authorize skipping gates or CI.",
];

function ordinalSort(values) {
  return [...values].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));
}

function run(command, args, options = {}) {
  return spawnSync(command, args, {
    cwd: options.cwd,
    encoding: "utf8",
    maxBuffer: 32 * 1024 * 1024,
    timeout: options.timeout,
    windowsHide: true,
  });
}

function fail(code, message) {
  console.log(JSON.stringify({
    version: VERSION,
    mode: "SHADOW_ONLY",
    status: "INVALID_INPUT",
    error: { code, message },
    alwaysRequired: ALWAYS_REQUIRED,
  }, null, 2));
  process.exitCode = 2;
}

function normalizeRepoPath(input) {
  const slashPath = input.replaceAll("\\", "/");
  if (!slashPath || slashPath.startsWith("/") || /^[A-Za-z]:\//.test(slashPath)) {
    throw new Error(`Expected a non-empty repository-relative path: ${input}`);
  }

  const normalized = path.posix.normalize(slashPath);
  if (normalized === "." || normalized === ".." || normalized.startsWith("../")) {
    throw new Error(`Path escapes the repository root: ${input}`);
  }
  return normalized;
}

function parseArguments(args) {
  if (args.length === 1 && args[0] === "--help") return { help: true };
  if (args[0] === "--base" && args.length === 2 && !args[1].startsWith("-")) {
    return { base: args[1] };
  }
  if (args[0] === "--files" && args.length > 1 && args.slice(1).every((value) => !value.startsWith("--"))) {
    return { files: args.slice(1) };
  }
  return null;
}

function gitRoot(cwd) {
  const result = run("git", ["rev-parse", "--show-toplevel"], { cwd });
  if (result.status !== 0) throw new Error(result.stderr.trim() || "Not inside a Git repository.");
  const root = path.resolve(result.stdout.trim());
  if (path.resolve(cwd) !== root) throw new Error("Run this command from the repository root.");
  return root;
}

function changedFilesForBase(root, base) {
  const verified = run("git", ["rev-parse", "--verify", "--quiet", `${base}^{commit}`], { cwd: root });
  if (verified.status !== 0) throw new Error(`Git comparison base is not a resolvable commit: ${base}`);

  const result = run("git", ["diff", "--name-only", "-z", "--no-renames", `${base}...HEAD`, "--"], { cwd: root });
  if (result.status !== 0) throw new Error(result.stderr.trim() || `Could not diff against ${base}.`);
  return result.stdout.split("\0").filter(Boolean);
}

function fallbackCodes(file, exists) {
  const reasons = [];
  if (!exists) reasons.push("CHANGED_FILE_MISSING_OR_DELETED");
  if (/^(?:package(?:-lock)?\.json|tsconfig[^/]*\.json)$/.test(file)
    || /(?:^|\/)[^/]+\.config\.[^.]+$/.test(file)
    || /^\.github\//.test(file)
    || /^\.githooks\//.test(file)
    || /^scripts\/gate(?:\.|\/)/.test(file)) {
    reasons.push("VALIDATION_OR_BUILD_CONFIGURATION");
  }
  if (/^app\/api\//.test(file)) reasons.push("API_OR_SECURITY_BOUNDARY");
  if (/^src\/shared\//.test(file)) reasons.push("SHARED_CONTRACT_OR_ENGINE");
  if (/^(?:src|app)\//.test(file)) reasons.push("APPLICATION_RUNTIME_CODE");
  if (/^src\/data\//.test(file) || /^data\//.test(file) || /\.json$/i.test(file)) {
    reasons.push("DATA_OR_GENERATED_ARTIFACT");
  }
  if (/^scripts\//.test(file)) reasons.push("SCRIPT_OR_GENERATOR");
  if (/^docs\/(?:open-instrument|constitution)\//.test(file)
    || /^docs\/.*(?:contract|authority|scientific|research).*\.(?:md|mdx)$/i.test(file)) {
    reasons.push("SCIENTIFIC_CONTRACT_DOCUMENTATION");
  }
  if (/^src\/ui\/(?:instrument\/contractAdapter\.ts|telemetry\/)/.test(file)) {
    reasons.push("PUBLIC_EVIDENCE_CONTRACT");
  } else if (/^src\/ui\//.test(file)) {
    reasons.push("USER_FACING_PRESENTATION");
  }
  if (!TEST_FILE.test(file) && !JEST_INPUT_EXTENSION.test(file) && !/\.(?:md|mdx|txt)$/i.test(file)) {
    reasons.push("UNKNOWN_OR_UNSUPPORTED_FILE_TYPE");
  }
  return ordinalSort(new Set(reasons));
}

function parseJestList(stdout, root) {
  const jsonStart = stdout.indexOf("[");
  if (jsonStart < 0) throw new Error("Jest did not emit a --listTests JSON array.");
  const listed = JSON.parse(stdout.slice(jsonStart));
  if (!Array.isArray(listed) || listed.some((item) => typeof item !== "string")) {
    throw new Error("Jest --listTests output was not a string array.");
  }
  return ordinalSort(new Set(listed.map((testPath) => {
    const relative = path.isAbsolute(testPath) ? path.relative(root, testPath) : testPath;
    return normalizeRepoPath(relative);
  })));
}

function main() {
  const parsed = parseArguments(process.argv.slice(2));
  if (parsed?.help) {
    console.log("Usage: node scripts/jestShadowSelection.v0_1.mjs --base <git-ref> | --files <repo-relative-path> [...]");
    console.log("Lists Jest-related suites only. It never runs selected tests or changes a gate.");
    return;
  }
  if (!parsed) {
    fail("USAGE", "Provide exactly one input: --base <git-ref> or --files <repo-relative-path> [...].");
    return;
  }

  let root;
  let changedFiles;
  try {
    root = gitRoot(process.cwd());
    changedFiles = parsed.base ? changedFilesForBase(root, parsed.base) : parsed.files;
    changedFiles = ordinalSort(new Set(changedFiles.map(normalizeRepoPath)));
  } catch (error) {
    fail("INPUT_OR_GIT_ERROR", error instanceof Error ? error.message : String(error));
    return;
  }

  const fileRecords = changedFiles.map((file) => {
    const exists = existsSync(path.resolve(root, file));
    return { path: file, exists, fallbackReasons: fallbackCodes(file, exists) };
  });
  const fallbackReasons = ordinalSort(new Set(fileRecords.flatMap((record) => record.fallbackReasons)));
  const directChangedTests = fileRecords
    .filter((record) => record.exists && TEST_FILE.test(record.path))
    .map((record) => record.path);
  const jestInputFiles = fileRecords
    .filter((record) => record.exists && (TEST_FILE.test(record.path) || JEST_INPUT_EXTENSION.test(record.path)))
    .map((record) => record.path);

  let selectionStatus = "NOT_RUN_NO_SUPPORTED_INPUT";
  let jestSelectedTests = [];
  let selectionError = null;

  if (jestInputFiles.length > 0) {
    const result = run("npm", [
      "run", "test", "--",
      "--ci", "--runInBand", "--listTests", "--json", "--passWithNoTests",
      "--findRelatedTests", ...jestInputFiles,
    ], { cwd: root, timeout: 120_000 });

    if (result.error || result.status !== 0) {
      selectionStatus = "FAILED";
      selectionError = result.error?.message || result.stderr.trim() || `Jest list command exited ${result.status}.`;
      fallbackReasons.push("JEST_SELECTION_FAILED");
    } else {
      try {
        jestSelectedTests = parseJestList(result.stdout, root);
        selectionStatus = "COMPLETED";
      } catch (error) {
        selectionStatus = "FAILED";
        selectionError = error instanceof Error ? error.message : String(error);
        fallbackReasons.push("JEST_OUTPUT_UNPARSEABLE");
      }
    }
  }

  const suggestedTests = ordinalSort(new Set([...jestSelectedTests, ...directChangedTests]));
  if (suggestedTests.length === 0) fallbackReasons.push("EMPTY_RELATED_TEST_SELECTION");
  const sortedFallbackReasons = ordinalSort(new Set(fallbackReasons));
  const broaderValidationRecommended = sortedFallbackReasons.length > 0;

  const report = {
    version: VERSION,
    mode: "SHADOW_ONLY",
    selectionStatus,
    comparison: parsed.base ? { kind: "git-merge-base-diff", base: parsed.base, head: "HEAD" } : { kind: "explicit-file-set" },
    changedFiles,
    fileAnalysis: fileRecords.map((record) => ({
      ...record,
      jestInputEligible: record.exists && (TEST_FILE.test(record.path) || JEST_INPUT_EXTENSION.test(record.path)),
      dependencyGraphUncertainty: record.fallbackReasons.length > 0
        || (!TEST_FILE.test(record.path) && !JEST_INPUT_EXTENSION.test(record.path)),
    })),
    unsupportedOrUncertainFiles: fileRecords
      .filter((record) => record.fallbackReasons.length > 0
        || (!TEST_FILE.test(record.path) && !JEST_INPUT_EXTENSION.test(record.path)))
      .map((record) => record.path),
    directChangedTests,
    jestInputFiles,
    jestSelectedTests,
    suggestedTests,
    selectedSuiteCount: suggestedTests.length,
    fallbackReasons: sortedFallbackReasons,
    broaderValidationRecommended,
    mandatoryValidation: ALWAYS_REQUIRED,
    guidance: broaderValidationRecommended
      ? [
        "Review direct contracts and non-import-based consumers; Jest's dependency graph is incomplete for file reads, generated artifacts, dynamic imports, and subprocesses.",
        "Use npm run gate:quick when broader local integration validation is warranted; use npm run gate or npm run build when production-build validation is required.",
      ]
      : [
        "This list is observational only. Run the selected tests in addition to, not instead of, required gates and hosted CI.",
      ],
    warning: "Shadow selection is not validation authorization and must not reduce mandatory execution.",
    ...(selectionError ? { selectionError } : {}),
  };

  console.log(JSON.stringify(report, null, 2));
  if (selectionStatus === "FAILED") process.exitCode = 1;
}

main();
