import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const helperPath = path.join(
  process.cwd(),
  "scripts/openInstrumentBoundaryGatedPromptResponseCaptureValidation.v0.1.mjs",
);

const fixturePath = path.join(
  process.cwd(),
  "docs/open-instrument/fixtures/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-static-fixture-v0.1.json",
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

  const dir = mkdtempSync(path.join(tmpdir(), "oi-prompt-response-capture-"));
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

describe("Open Instrument boundary-gated local-provider prompt-response capture validation v0.1", () => {
  it("passes the checked-in static prompt-response capture fixture", () => {
    const output = runFixture(fixturePath);

    expect(output).toContain("Boundary-gated local-provider prompt-response capture validation passed.");
    expect(output).toContain("capture_contract_static_only");
    expect(output).toContain("execution_not_authorized");
    expect(output).toContain("prompt_response_capture_contract_static");
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

  it("rejects provider execution authorization", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.authorizationGates.providerExecutionAuthorized = true;
    });

    expectFixtureToFail(candidate, "$.authorizationGates.providerExecutionAuthorized: expected false");
  });

  it("rejects remote endpoint use", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.endpointIdentity.remoteProviderEndpointUsed = true;
    });

    expectFixtureToFail(candidate, "$.endpointIdentity.remoteProviderEndpointUsed: expected false");
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

  it("rejects provider-output evidence promotion", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.evidenceClassPolicy.granted.push("provider_output_evidence");
    });

    expectFixtureToFail(candidate, "$.evidenceClassPolicy.granted.provider_output_evidence: class is not allowed to be granted");
  });

  it("rejects missing blocked denial reason", () => {
    const candidate = writeMutatedFixture((fixture) => {
      delete fixture.denialReasons.origin_evidence;
    });

    expectFixtureToFail(candidate, "$.denialReasons.origin_evidence: expected non-empty string");
  });

  it("rejects untracked prompt mutation", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.promptIdentity.promptMutationPolicy = "untracked";
    });

    expectFixtureToFail(candidate, "$.promptIdentity.promptMutationPolicy: untracked mutation is forbidden");
  });

  it("rejects non-execution declaration drift", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.nonExecutionDeclaration.modelCallOccurred = true;
    });

    expectFixtureToFail(candidate, "$.nonExecutionDeclaration.modelCallOccurred: expected false");
  });
});
