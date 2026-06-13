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

function runPackageValidator(): string {
  return execFileSync(
    "npm",
    ["run", "open-instrument:validate-provider-execution-preflight-static-fixture"],
    {
      cwd: repoRoot,
      encoding: "utf8"
    }
  );
}

function readFixture(): any {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function runValidatorWithFixture(fixture: any): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oi-preflight-integration-"));
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

describe("Open Instrument provider execution preflight static fixture schema validation integration gate v0.1", () => {
  test("keeps the checked-in static fixture passing the package validator", () => {
    const output = runPackageValidator();

    expect(output).toContain("Open Instrument provider execution preflight static fixture schema validation v0.1");
    expect(output).toContain("Boundary: local static fixture/schema validation only.");
    expect(output).toContain("Open Instrument provider execution preflight static fixture schema validation passed.");
  });

  test("keeps validation scoped to static schema/fixture only", () => {
    const output = runPackageValidator();

    expect(output).toContain("no model call, no provider execution, no OpenAI API use");
    expect(output).toContain("no network call, no provider default change, no runtime/API/UI wiring");
    expect(output).toContain("no fixture mutation, no schema mutation, no artifact/report creation");
  });

  test("fails closed if execution authorization drifts true", () => {
    const fixture = readFixture();
    fixture.authorizationGates.providerExecutionAuthorized = true;

    expect(() => runValidatorWithFixture(fixture)).toThrow();
  });

  test("fails closed if evidence boundary drifts toward provider output", () => {
    const fixture = readFixture();
    fixture.evidenceBoundaryStatus.providerOutputEvidence = true;

    expect(() => runValidatorWithFixture(fixture)).toThrow();
  });

  test("fails closed if provider identity drifts toward a live provider", () => {
    const fixture = readFixture();
    fixture.providerIdentity.provider = "openai";
    fixture.providerIdentity.liveProviderNamePresent = true;

    expect(() => runValidatorWithFixture(fixture)).toThrow();
  });
});
