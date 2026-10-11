#!/usr/bin/env node

/**
 * Constrained-environment pre-push gate.
 *
 * Keep deterministic local validation mandatory while leaving tests that
 * require loopback, tsx IPC, or the integration build/network path to CI.
 * This is a validation partition, not a hook bypass.
 */
import { spawnSync } from "node:child_process";

const capabilityDependentTestPatterns = [
  "tests/apiAnalyzeV1\\.evidence\\.smoke\\.curl\\.spec\\.ts$",
  "tests/apiAnalyzeV1\\.stability\\.repeat\\.smoke\\.spec\\.ts$",
  "tests/openInstrument\\.multilingualDiscoverySubstrateS3\\.v0_2\\.spec\\.ts$",
  "tests/ownedNextServer\\.spec\\.ts$",
  "tests/battery/batterySeriesStatsGenerator\\.v0\\.1\\.spec\\.ts$",
  "tests/battery/batteryEvidencePackInspectScript\\.v0\\.1\\.spec\\.ts$",
];

const gateEnvironment = { ...process.env };
delete gateEnvironment.OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT;

function run(command, args) {
  const result = spawnSync(command, args, {
    env: gateEnvironment,
    shell: false,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`gate:prepush failed to start ${command}: ${result.error.message}`);
    process.exit(1);
  }

  if (result.status !== 0) process.exit(result.status ?? 1);
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
