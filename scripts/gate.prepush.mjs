#!/usr/bin/env node

/**
 * Mandatory pre-push gate with a verified, narrow Markdown-only fast lane.
 *
 * Keep deterministic local validation mandatory while leaving tests that
 * require loopback, tsx IPC, or the integration build/network path to CI.
 * This is a validation partition, not a hook bypass.
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import classifier from "./prepushChangeClassifier.cjs";
import docsValidation from "./prepushDocsValidation.cjs";
import scopedCodeSelection from "./prepushScopedCodeSelection.v0_1.cjs";

const { classifyPrePush } = classifier;
const { validateDocsOnlyCommit } = docsValidation;
const { selectScopedCodeTests } = scopedCodeSelection;

const capabilityDependentTestPatterns = [
  "tests/apiAnalyzeV1\\.evidence\\.smoke\\.curl\\.spec\\.ts$",
  "tests/apiAnalyzeV1\\.stability\\.repeat\\.smoke\\.spec\\.ts$",
  "tests/openInstrument\\.multilingualDiscoverySubstrateS3\\.v0_2\\.spec\\.ts$",
  "tests/ownedNextServer\\.spec\\.ts$",
  "tests/battery/batterySeriesStatsGenerator\\.v0\\.1\\.spec\\.ts$",
  "tests/battery/batteryEvidencePackInspectScript\\.v0\\.1\\.spec\\.ts$",
];

const gateEnvironment = { ...process.env };
// Preserve an explicit disabled value so Next/Jest dotenv loading cannot
// restore a truthy local external-root configuration from .env.test.local.
gateEnvironment.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT = "";

function run(command, args, label = command) {
  const startedAt = process.hrtime.bigint();
  const result = spawnSync(command, args, {
    env: gateEnvironment,
    shell: false,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`gate:prepush failed to start ${command}: ${result.error.message}`);
    process.exit(1);
  }

  const elapsedSeconds = Number(process.hrtime.bigint() - startedAt) / 1_000_000_000;
  console.log(`[gate:prepush] ${label} elapsed ${elapsedSeconds.toFixed(2)}s`);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const hookArgs = process.argv.slice(2);
let classification = { tier: "FULL", reason: "pre-push hook context is unavailable" };
if (hookArgs.length === 3 && hookArgs[0] === "--hook") {
  try {
    classification = classifyPrePush({
      repoRoot: process.cwd(),
      remoteName: hookArgs[1],
      remoteUrl: hookArgs[2],
      stdin: readFileSync(0),
    });
  } catch {
    classification = { tier: "FULL", reason: "pre-push context could not be read safely" };
  }
}

if (classification.tier === "DOCS_ONLY") {
  console.log(`pre-push: verified documentation-only change (${classification.reason})`);
  const validation = validateDocsOnlyCommit({
    repoRoot: process.cwd(),
    baseSha: classification.baseSha,
    headSha: classification.headSha,
  });
  if (validation.state === "PASS") {
    console.log(`\n✅ gate:prepush passed (documentation-only: ${validation.reason})\n`);
    process.exit(0);
  }
  if (validation.state === "FAIL") {
    console.error(`pre-push: documentation validation failed: ${validation.reason}`);
    process.exit(1);
  }
  console.log(`pre-push: documentation fast path became uncertain (${validation.reason}); using full gate`);
} else if (classification.tier === "SCOPED_CODE") {
  const selection = selectScopedCodeTests({
    repoRoot: process.cwd(),
    changedPaths: classification.changedPaths,
  });
  if (selection.state === "SELECTED") {
    console.log(
      `pre-push: verified scoped Instrument UI change (${selection.reason}); ` +
        `${selection.testPaths.length}/${selection.totalSuiteCount} serial Jest suites, ` +
        `${selection.uiGuardCount} UI guards, ${selection.filesystemScanGuardCount} filesystem-scanning guards, ` +
        `${selection.explicitConsumerCount} source-referencing consumers`,
    );
    run("node_modules/.bin/eslint", ["-c", "eslint.config.mjs", ...classification.changedPaths], "changed-file ESLint");
    run("npm", ["run", "typecheck:prod"], "production typecheck");
    run(
      "npm",
      [
        "test",
        "--",
        "--ci",
        "--runInBand",
        "--runTestsByPath",
        ...selection.testPaths.map((testPath) => `${process.cwd()}/${testPath}`),
      ],
      `selected serial Jest (${selection.testPaths.length} suites)`,
    );
    console.log("\n✅ gate:prepush passed (verified scoped Instrument UI validation)\n");
    process.exit(0);
  }
  console.log(`pre-push: scoped-code selection became uncertain (${selection.reason}); using full gate`);
} else {
  console.log(`pre-push: using full validation (${classification.reason})`);
}

run("npm", ["run", "lint"]);
run("npm", [
  "test",
  "--",
  "--ci",
  "--runInBand",
  `--testPathIgnorePatterns=(${capabilityDependentTestPatterns.join("|")})`,
]);

console.log("\n✅ gate:prepush passed (deterministic local validation)\n");
