import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const helperPath = path.join(
  process.cwd(),
  "scripts/openInstrumentControlledLocalProviderExecutionAuthorizationValidation.v0.1.mjs",
);

const fixturePath = path.join(
  process.cwd(),
  "docs/open-instrument/fixtures/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-static-fixture-v0.1.json",
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

  const dir = mkdtempSync(path.join(tmpdir(), "oi-execution-authorization-"));
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

describe("Open Instrument controlled local-provider execution authorization validation v0.1", () => {
  it("passes the checked-in static authorization fixture", () => {
    const output = runFixture(fixturePath);

    expect(output).toContain("Controlled local-provider execution authorization validation passed.");
    expect(output).toContain("execution_authorization_contract_static_only");
    expect(output).toContain("execution_authorization_not_granted");
    expect(output).toContain("controlled_local_provider_execution_authorization_contract_static");
  });

  it("rejects actual provider execution authorization", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.authorizationGates.actualProviderExecutionAuthorized = true;
    });

    expectFixtureToFail(candidate, "$.authorizationGates.actualProviderExecutionAuthorized: expected false");
  });

  it("rejects model call authorization", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.authorizationGates.modelCallAuthorized = true;
    });

    expectFixtureToFail(candidate, "$.authorizationGates.modelCallAuthorized: expected false");
  });

  it("rejects missing provider identity requirement", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.providerIdentityRequirements.providerNameRequired = false;
    });

    expectFixtureToFail(candidate, "$.providerIdentityRequirements.providerNameRequired: expected true");
  });

  it("rejects missing model identity requirement", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.providerIdentityRequirements.modelNameRequired = false;
    });

    expectFixtureToFail(candidate, "$.providerIdentityRequirements.modelNameRequired: expected true");
  });

  it("rejects missing local endpoint proof requirement", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.endpointRequirements.localEndpointProofRequired = false;
    });

    expectFixtureToFail(candidate, "$.endpointRequirements.localEndpointProofRequired: expected true");
  });

  it("rejects remote endpoint permission drift", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.endpointRequirements.remoteEndpointForbidden = false;
    });

    expectFixtureToFail(candidate, "$.endpointRequirements.remoteEndpointForbidden: expected true");
  });

  it("rejects paid OpenAI API permission drift", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.networkBoundaryRequirements.paidOpenAiApiUseForbidden = false;
    });

    expectFixtureToFail(candidate, "$.networkBoundaryRequirements.paidOpenAiApiUseForbidden: expected true");
  });

  it("rejects secrets permission drift", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.networkBoundaryRequirements.secretsUseForbidden = false;
    });

    expectFixtureToFail(candidate, "$.networkBoundaryRequirements.secretsUseForbidden: expected true");
  });

  it("rejects missing prompt SHA-256 requirement", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.promptRequirements.promptSha256Required = false;
    });

    expectFixtureToFail(candidate, "$.promptRequirements.promptSha256Required: expected true");
  });

  it("rejects missing request body SHA-256 requirement", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.requestRequirements.requestBodySha256Required = false;
    });

    expectFixtureToFail(candidate, "$.requestRequirements.requestBodySha256Required: expected true");
  });

  it("rejects missing response SHA-256 requirement", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.responseRequirements.responseSha256Required = false;
    });

    expectFixtureToFail(candidate, "$.responseRequirements.responseSha256Required: expected true");
  });

  it("rejects maximum execution count above one", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.executionCountLimits.maximumExecutionCount = 2;
    });

    expectFixtureToFail(candidate, "$.executionCountLimits.maximumExecutionCount: expected 1");
  });

  it("rejects maximum request count above one", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.executionCountLimits.maximumRequestCount = 2;
    });

    expectFixtureToFail(candidate, "$.executionCountLimits.maximumRequestCount: expected 1");
  });

  it("rejects maximum response count above one", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.executionCountLimits.maximumResponseCount = 2;
    });

    expectFixtureToFail(candidate, "$.executionCountLimits.maximumResponseCount: expected 1");
  });

  it("rejects active granted authorization state", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.authorizationState.currentState = "controlled_local_execution_authorization_granted_static_scope";
    });

    expectFixtureToFail(candidate, "$.authorizationState.currentState: expected \"execution_authorization_not_granted\"");
  });

  it("rejects candidate-truth evidence promotion", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.evidenceClassPolicy.granted.push("candidate_truth_evidence");
    });

    expectFixtureToFail(candidate, "$.evidenceClassPolicy.granted.candidate_truth_evidence: class is not allowed to be granted");
  });

  it("rejects candidate-only authorization class promotion", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.evidenceClassPolicy.granted.push("provider_output_observation_candidate");
    });

    expectFixtureToFail(candidate, "$.evidenceClassPolicy.granted.provider_output_observation_candidate: class is not allowed to be granted");
  });

  it("rejects missing post-execution review requirement", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.postExecutionReviewRequirement.postExecutionReviewRequiredBeforeEvidenceClassChange = false;
    });

    expectFixtureToFail(candidate, "$.postExecutionReviewRequirement.postExecutionReviewRequiredBeforeEvidenceClassChange: expected true");
  });

  it("rejects non-execution declaration drift", () => {
    const candidate = writeMutatedFixture((fixture) => {
      fixture.nonExecutionDeclaration.providerRunOccurred = true;
    });

    expectFixtureToFail(candidate, "$.nonExecutionDeclaration.providerRunOccurred: expected false");
  });
});
