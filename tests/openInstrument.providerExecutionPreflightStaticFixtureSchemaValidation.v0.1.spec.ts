import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const validatorPath = path.join(
  repoRoot,
  "scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs"
);
const fixturePath = path.join(
  repoRoot,
  "docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json"
);
const schemaPath = path.join(
  repoRoot,
  "docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json"
);

function readFixture(): any {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function runValidatorWithFixture(fixture: any): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oi-preflight-fixture-"));
  const tempFixturePath = path.join(dir, "fixture.json");
  fs.writeFileSync(tempFixturePath, JSON.stringify(fixture, null, 2));

  return execFileSync(process.execPath, [validatorPath], {
    cwd: repoRoot,
    encoding: "utf8",
    env: {
      ...process.env,
      OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_STATIC_FIXTURE_PATH: tempFixturePath,
      OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_STATIC_SCHEMA_PATH: schemaPath
    }
  });
}

function expectFixtureRejected(fixture: any): void {
  expect(() => runValidatorWithFixture(fixture)).toThrow();
}

describe("Open Instrument provider execution preflight static fixture schema validation v0.1", () => {
  test("accepts the checked-in static fixture", () => {
    const output = runValidatorWithFixture(readFixture());

    expect(output).toContain("local static fixture/schema validation only");
    expect(output).toContain("no model call, no provider execution, no OpenAI API use");
    expect(output).toContain("static fixture schema validation passed");
  });

  test("rejects a missing required top-level field", () => {
    const fixture = readFixture();
    delete fixture.providerIdentity;

    expectFixtureRejected(fixture);
  });

  test("rejects an unknown top-level field", () => {
    const fixture = readFixture();
    fixture.runtimeExecutionShortcut = true;

    expectFixtureRejected(fixture);
  });

  test.each([
    "providerExecutionAuthorized",
    "modelCallAuthorized",
    "openAiApiUseAuthorized",
    "runtimeApiUiWiringAuthorized",
    "artifactReportCreationAuthorized",
    "publicationFramingAuthorized",
    "fallbackProviderAuthorized",
    "fallbackModelAuthorized",
    "silentRerunAuthorized",
    "hiddenExecutionPathAuthorized"
  ])("rejects true authorization gate: %s", (gate) => {
    const fixture = readFixture();
    fixture.authorizationGates[gate] = true;

    expectFixtureRejected(fixture);
  });

  test.each([
    "providerOutputEvidence",
    "candidateTruthEvidence",
    "originEvidence",
    "modelQualityEvidence",
    "publicationEvidence",
    "executionSafetyEvidence"
  ])("rejects true evidence gate: %s", (gate) => {
    const fixture = readFixture();
    fixture.evidenceBoundaryStatus[gate] = true;

    expectFixtureRejected(fixture);
  });

  test("rejects live provider identity drift", () => {
    const fixture = readFixture();
    fixture.providerIdentity.provider = "openai";
    fixture.providerIdentity.liveProviderNamePresent = true;

    expectFixtureRejected(fixture);
  });

  test("rejects live model identity drift", () => {
    const fixture = readFixture();
    fixture.modelIdentity.model = "gpt-live";
    fixture.modelIdentity.liveModelNamePresent = true;

    expectFixtureRejected(fixture);
  });

  test("rejects live endpoint identity drift", () => {
    const fixture = readFixture();
    fixture.endpointIdentity.endpointType = "https";
    fixture.endpointIdentity.endpointUrl = "https://example.invalid";
    fixture.endpointIdentity.liveEndpointUrlPresent = true;

    expectFixtureRejected(fixture);
  });

  test("rejects unsupported finalDecision drift", () => {
    const fixture = readFixture();
    fixture.finalDecision.value = "runtime_execution_ready";

    expectFixtureRejected(fixture);
  });
});
