import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const helper = path.join(repoRoot, "scripts/openInstrumentControlledLocalProviderEvidenceBoundaryValidation.v0.1.mjs");
const fixturePath = path.join(repoRoot, "docs/open-instrument/fixtures/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-static-fixture-v0.1.json");
const schemaPath = path.join(repoRoot, "docs/open-instrument/schemas/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-schema-v0.1.json");

function readFixture() {
  return JSON.parse(fs.readFileSync(fixturePath, "utf8"));
}

function writeTempFixture(value: unknown) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oi-evidence-boundary-"));
  const file = path.join(dir, "fixture.json");
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
  return file;
}

function runFixture(file: string) {
  return execFileSync(process.execPath, [helper, "--schema", schemaPath, "--fixture", file], {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function expectFixtureToFail(file: string, expected: string) {
  try {
    runFixture(file);
    throw new Error("expected fixture validation to fail");
  } catch (error: unknown) {
    const failure = error as { stderr?: Buffer | string; message?: string };
    const text = String(failure.stderr ?? failure.message ?? "");
    expect(text).toContain(expected);
  }
}

describe("Open Instrument controlled local-provider evidence boundary validation v0.1", () => {
  it("passes the checked-in static evidence-boundary fixture", () => {
    const output = execFileSync(process.execPath, [helper], {
      cwd: repoRoot,
      encoding: "utf8",
    });

    expect(output).toContain("Open Instrument controlled local-provider evidence boundary validation passed.");
    expect(output).toContain("local_smoke_transcript_only");
  });

  it("keeps the fixture local smoke transcript only", () => {
    const fixture = readFixture();

    expect(fixture.evidenceBoundary.evidenceClassesGranted).toEqual(["local_smoke_transcript"]);
    expect(fixture.finalDecision.value).toBe("local_smoke_transcript_only");
    expect(fixture.evidenceBoundary.promotionBlocked).toBe(true);
  });

  it("rejects provider execution authorization", () => {
    const fixture = readFixture();
    fixture.authorizationGates.providerExecutionAuthorized = true;

    expectFixtureToFail(
      writeTempFixture(fixture),
      "$.authorizationGates.providerExecutionAuthorized: expected false",
    );
  });

  it("rejects runtime API UI wiring authorization", () => {
    const fixture = readFixture();
    fixture.authorizationGates.runtimeApiUiWiringAuthorized = true;

    expectFixtureToFail(
      writeTempFixture(fixture),
      "$.authorizationGates.runtimeApiUiWiringAuthorized: expected false",
    );
  });

  it("rejects candidate-truth evidence promotion", () => {
    const fixture = readFixture();
    fixture.evidenceBoundary.evidenceClassesGranted.push("candidate_truth_evidence");

    expectFixtureToFail(
      writeTempFixture(fixture),
      "$.evidenceBoundary.evidenceClassesGranted.candidate_truth_evidence: class is not allowed to be granted",
    );
  });

  it("rejects missing response SHA-256", () => {
    const fixture = readFixture();
    fixture.responseIdentity.responseSha256 = "missing";

    expectFixtureToFail(
      writeTempFixture(fixture),
      "$.responseIdentity.responseSha256: expected sha256",
    );
  });

  it("rejects remote endpoint use", () => {
    const fixture = readFixture();
    fixture.providerIdentity.remoteProviderEndpointUsed = true;

    expectFixtureToFail(
      writeTempFixture(fixture),
      "$.providerIdentity.remoteProviderEndpointUsed: expected false",
    );
  });

  it("rejects missing blocked evidence-class denial", () => {
    const fixture = readFixture();
    fixture.evidenceBoundary.evidenceClassesDenied = fixture.evidenceBoundary.evidenceClassesDenied.filter(
      (value: string) => value !== "origin_evidence",
    );

    expectFixtureToFail(
      writeTempFixture(fixture),
      "$.evidenceBoundary.evidenceClassesDenied.origin_evidence: blocked class must be denied",
    );
  });
});
