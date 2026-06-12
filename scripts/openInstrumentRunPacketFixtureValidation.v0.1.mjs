#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const fixturePath =
  "docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json";

const helperTestPath = "tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts";
const integrationGateTestPath =
  "tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts";

function fail(message, detail) {
  console.error(`FAIL: ${message}`);
  if (detail) {
    console.error(detail);
  }
  process.exitCode = 1;
}

function readFixtureJson() {
  try {
    return JSON.parse(readFileSync(fixturePath, "utf8"));
  } catch (error) {
    fail(`could not parse fixture JSON at ${fixturePath}`, String(error));
    return null;
  }
}

function runJest(testPath) {
  const result = spawnSync(
    "npx",
    ["jest", "-c", "jest.config.mjs", testPath, "--runInBand"],
    {
      stdio: "inherit",
      shell: false,
    },
  );

  if (result.status !== 0) {
    fail(`focused Jest validation failed for ${testPath}`);
  }

  return result.status === 0;
}

console.log("Open Instrument run packet fixture validation v0.1");
console.log("Boundary: static schema/traceability validation only.");
console.log("Boundary: no model call, no provider execution, no OpenAI API use.");
console.log("Boundary: no provider default change, no runtime/API/UI wiring.");
console.log("Boundary: not candidate-truth evidence and not origin evidence.");

const fixture = readFixtureJson();

if (fixture) {
  const summary = {
    schemaVersion: fixture.schemaVersion,
    packetId: fixture.packetId,
    runId: fixture.runId,
    provider: fixture.provider,
    model: fixture.model,
    endpointType: fixture.endpointType,
    evidenceClassIntent: fixture.evidenceClassIntent,
    modelCallAuthorization: fixture.modelCallAuthorization,
    artifactCreationAuthorization: fixture.artifactCreationAuthorization,
    rerunAuthorization: fixture.rerunAuthorization,
    openAiApiAuthorization: fixture.openAiApiAuthorization,
  };

  console.log("Fixture summary:");
  console.log(JSON.stringify(summary, null, 2));

  if (fixture.provider !== "fixture") {
    fail("fixture provider is not fixture");
  }

  if (fixture.model !== "none") {
    fail("fixture model is not none");
  }

  if (fixture.endpointType !== "none") {
    fail("fixture endpointType is not none");
  }

  if (fixture.evidenceClassIntent !== "design-only") {
    fail("fixture evidenceClassIntent is not design-only");
  }

  if (fixture.modelCallAuthorization !== false) {
    fail("fixture modelCallAuthorization is not false");
  }

  if (fixture.artifactCreationAuthorization !== false) {
    fail("fixture artifactCreationAuthorization is not false");
  }

  if (fixture.rerunAuthorization !== false) {
    fail("fixture rerunAuthorization is not false");
  }

  if (fixture.openAiApiAuthorization !== false) {
    fail("fixture openAiApiAuthorization is not false");
  }
}

console.log("Running focused helper validation test...");
runJest(helperTestPath);

console.log("Running focused integration gate validation test...");
runJest(integrationGateTestPath);

if (process.exitCode && process.exitCode !== 0) {
  console.error("Open Instrument run packet fixture validation failed.");
} else {
  console.log("Open Instrument run packet fixture validation passed.");
}
