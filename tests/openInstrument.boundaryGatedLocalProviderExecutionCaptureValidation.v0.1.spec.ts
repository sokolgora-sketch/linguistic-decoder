import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const helperPath = path.join(
  process.cwd(),
  "scripts/openInstrumentBoundaryGatedLocalProviderExecutionCaptureValidation.v0.1.mjs",
);

const fixturePath = path.join(
  process.cwd(),
  "docs/open-instrument/fixtures/execution-capture/open-instrument-boundary-gated-local-provider-execution-capture-static-fixture-v0.1.json",
);

function runFixture(candidateFixturePath: string): string {
  return execFileSync("node", [helperPath, candidateFixturePath], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function writeMutatedFixture(mutator: (fixture: any) => void): string {
  const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));
  mutator(fixture);

  const dir = mkdtempSync(path.join(tmpdir(), "oi-execution-capture-"));
  const candidate = path.join(dir, "fixture.json");
  writeFileSync(candidate, JSON.stringify(fixture, null, 2));
  return candidate;
}

function expectFixtureToFail(candidateFixturePath: string, expected: string): void {
  try {
    runFixture(candidateFixturePath);
  } catch (error) {
    const failure = error as { stdout?: Buffer | string; stderr?: Buffer | string; message?: string };
    const text = `${String(failure.stdout ?? "")}\n${String(failure.stderr ?? "")}\n${String(failure.message ?? "")}`;
    expect(text).toContain(expected);
    return;
  }

  throw new Error("expected fixture validation to fail");
}

describe("Open Instrument boundary-gated local-provider execution capture validation v0.1", () => {
  it("passes the checked-in static execution capture fixture", () => {
    const output = runFixture(fixturePath);

    expect(output).toContain("Boundary-gated local-provider execution capture validation passed.");
    expect(output).toContain("execution_capture_contract_static_only");
    expect(output).toContain("execution_not_authorized");
    expect(output).toContain("local_provider_execution_capture_contract_static");
  });

  it("rejects missing prompt SHA-256", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.promptIdentity.promptSha256 = "";
    });

    expectFixtureToFail(candidate, "$.promptIdentity.promptSha256: expected sha256");
  });

  it("rejects missing request body SHA-256", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.requestIdentity.requestBodySha256 = "";
    });

    expectFixtureToFail(candidate, "$.requestIdentity.requestBodySha256: expected sha256");
  });

  it("rejects missing response SHA-256", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.responseIdentity.responseSha256 = "";
    });

    expectFixtureToFail(candidate, "$.responseIdentity.responseSha256: expected sha256");
  });

  it("rejects actual provider execution authorization", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.authorizationGates.actualProviderExecutionAuthorized = true;
    });

    expectFixtureToFail(candidate, "$.authorizationGates.actualProviderExecutionAuthorized: expected false");
  });

  it("rejects actual provider execution in the authorization block", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.executionAuthorization.actualProviderExecutionAuthorized = true;
    });

    expectFixtureToFail(candidate, "$.executionAuthorization.actualProviderExecutionAuthorized: expected false");
  });

  it("rejects missing local endpoint proof requirement", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.endpointIdentity.localEndpointProofRequired = false;
    });

    expectFixtureToFail(candidate, "$.endpointIdentity.localEndpointProofRequired: expected true");
  });

  it("rejects remote endpoint use", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.endpointIdentity.remoteProviderEndpointUsed = true;
    });

    expectFixtureToFail(candidate, "$.endpointIdentity.remoteProviderEndpointUsed: expected false");
  });

  it("rejects network call occurrence", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.networkBoundary.networkCallOccurred = true;
    });

    expectFixtureToFail(candidate, "$.networkBoundary.networkCallOccurred: expected false");
  });

  it("rejects runtime API UI wiring authorization", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.authorizationGates.runtimeApiUiWiringAuthorized = true;
    });

    expectFixtureToFail(candidate, "$.authorizationGates.runtimeApiUiWiringAuthorized: expected false");
  });

  it("rejects active execution authorized pending capture state", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.captureState.currentState = "execution_authorized_pending_capture";
    });

    expectFixtureToFail(candidate, "$.captureState.currentState: expected \"execution_not_authorized\"");
  });

  it("rejects candidate-truth evidence promotion", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.evidenceClassPolicy.granted.push("candidate_truth_evidence");
    });

    expectFixtureToFail(candidate, "$.evidenceClassPolicy.granted.candidate_truth_evidence: class is not allowed to be granted");
  });

  it("rejects execution capture candidate class promotion", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.evidenceClassPolicy.granted.push("local_provider_execution_capture_record");
    });

    expectFixtureToFail(candidate, "$.evidenceClassPolicy.granted.local_provider_execution_capture_record: class is not allowed to be granted");
  });

  it("rejects missing blocked denial reason", () => {
    const candidate = writeMutatedFixture((fixture) => {
      delete fixture.denialReasons.origin_evidence;
    });

    expectFixtureToFail(candidate, "$.denialReasons.origin_evidence: expected non-empty string");
  });

  it("rejects untracked response mutation", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.responseIdentity.responseMutationPolicy = "untracked";
    });

    expectFixtureToFail(candidate, "$.responseIdentity.responseMutationPolicy: untracked mutation is forbidden");
  });

  it("rejects hidden rerun", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.executionCommand.hiddenRerunDetected = true;
    });

    expectFixtureToFail(candidate, "$.executionCommand.hiddenRerunDetected: expected false");
  });

  it("rejects non-execution declaration drift", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.nonExecutionDeclaration.providerRunOccurred = true;
    });

    expectFixtureToFail(candidate, "$.nonExecutionDeclaration.providerRunOccurred: expected false");
  });
});
