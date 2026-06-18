import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const repoRoot = process.cwd();
const scriptPath = path.join(
  repoRoot,
  "scripts/openInstrumentFirstControlledLocalProviderExecutionAuthorizationValidation.v0.1.mjs"
);
const fixturePath = path.join(
  repoRoot,
  "docs/open-instrument/fixtures/first-controlled-execution-authorization/open-instrument-first-controlled-local-provider-execution-authorization-static-fixture-v0.1.json"
);

function runWithFixture(overrideFixturePath?: string): string {
  return execFileSync(process.execPath, [scriptPath], {
    cwd: repoRoot,
    env: {
      ...process.env,
      ...(overrideFixturePath
        ? { OI_FIRST_CONTROLLED_LOCAL_PROVIDER_EXECUTION_AUTHORIZATION_FIXTURE: overrideFixturePath }
        : {}),
    },
    encoding: "utf8",
  });
}

function writeMutatedFixture(mutator: (fixture: any) => void): string {
  const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));
  mutator(fixture);

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "oi-first-execution-auth-"));
  const out = path.join(dir, "fixture.json");
  fs.writeFileSync(out, `${JSON.stringify(fixture, null, 2)}\n`, "utf8");
  return out;
}

function expectFailure(mutator: (fixture: any) => void, expected: string): void {
  const mutated = writeMutatedFixture(mutator);

  let output = "";
  try {
    runWithFixture(mutated);
  } catch (error: any) {
    output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
  }

  expect(output).toContain(expected);
}

describe("first controlled local-provider execution authorization static validation", () => {
  it("passes the checked-in static fixture", () => {
    const output = runWithFixture();

    expect(output).toContain("First controlled local-provider execution authorization validation passed");
    expect(output).toContain("first_controlled_local_provider_execution_authorization_contract_static");
    expect(output).toContain("defaultState=first_controlled_execution_authorization_not_granted");
    expect(output).toContain("oneShotGrantActive=false");
    expect(output).toContain("actualProviderExecutionAuthorized=false");
    expect(output).toContain("modelCallAuthorized=false");
    expect(output).toContain("paidOpenAiApiUseAuthorized=false");
    expect(output).toContain("maximumExecutionCount=1");
    expect(output).toContain("maximumRetryCount=0");
    expect(output).toContain("maximumRerunCount=0");
  });

  it("fails closed on provider execution authorization drift", () => {
    expectFailure(
      (fixture) => {
        fixture.apiAndSecretPolicy.actualProviderExecutionAuthorized = true;
      },
      "apiAndSecretPolicy.actualProviderExecutionAuthorized must be false"
    );
  });

  it("fails closed on model call authorization drift", () => {
    expectFailure(
      (fixture) => {
        fixture.apiAndSecretPolicy.modelCallAuthorized = true;
      },
      "apiAndSecretPolicy.modelCallAuthorized must be false"
    );
  });

  it("fails closed on paid OpenAI API authorization drift", () => {
    expectFailure(
      (fixture) => {
        fixture.apiAndSecretPolicy.paidOpenAiApiUseAuthorized = true;
      },
      "apiAndSecretPolicy.paidOpenAiApiUseAuthorized must be false"
    );
  });

  it("fails closed on remote endpoint authorization drift", () => {
    expectFailure(
      (fixture) => {
        fixture.endpointPolicy.remoteProviderEndpointUseAuthorized = true;
      },
      "endpointPolicy.remoteProviderEndpointUseAuthorized must be false"
    );
  });

  it("fails closed on localhost provider call authorization drift", () => {
    expectFailure(
      (fixture) => {
        fixture.endpointPolicy.localhostProviderCallAuthorized = true;
      },
      "endpointPolicy.localhostProviderCallAuthorized must be false"
    );
  });

  it("fails closed on Ollama authorization drift", () => {
    expectFailure(
      (fixture) => {
        fixture.endpointPolicy.ollamaCallAuthorized = true;
      },
      "endpointPolicy.ollamaCallAuthorized must be false"
    );
  });

  it("fails closed on OpenAI-compatible endpoint authorization drift", () => {
    expectFailure(
      (fixture) => {
        fixture.endpointPolicy.openAiCompatibleEndpointCallAuthorized = true;
      },
      "endpointPolicy.openAiCompatibleEndpointCallAuthorized must be false"
    );
  });

  it("fails closed on missing provider identity requirement", () => {
    expectFailure(
      (fixture) => {
        fixture.identityRequirements.providerNameRequired = false;
      },
      "identityRequirements.providerNameRequired must be true"
    );
  });

  it("fails closed on missing model identity requirement", () => {
    expectFailure(
      (fixture) => {
        fixture.identityRequirements.modelNameRequired = false;
      },
      "identityRequirements.modelNameRequired must be true"
    );
  });

  it("fails closed on missing local endpoint proof requirement", () => {
    expectFailure(
      (fixture) => {
        fixture.identityRequirements.localEndpointProofRequired = false;
      },
      "identityRequirements.localEndpointProofRequired must be true"
    );
  });

  it("fails closed on missing prompt SHA-256 requirement", () => {
    expectFailure(
      (fixture) => {
        fixture.promptRequestResponseRequirements.promptSha256Required = false;
      },
      "promptRequestResponseRequirements.promptSha256Required must be true"
    );
  });

  it("fails closed on missing request body SHA-256 requirement", () => {
    expectFailure(
      (fixture) => {
        fixture.promptRequestResponseRequirements.requestBodySha256Required = false;
      },
      "promptRequestResponseRequirements.requestBodySha256Required must be true"
    );
  });

  it("fails closed on missing response SHA-256 requirement", () => {
    expectFailure(
      (fixture) => {
        fixture.promptRequestResponseRequirements.responseSha256Required = false;
      },
      "promptRequestResponseRequirements.responseSha256Required must be true"
    );
  });

  it("fails closed on maximum execution count drift", () => {
    expectFailure(
      (fixture) => {
        fixture.limits.maximumExecutionCount = 2;
      },
      "limits.maximumExecutionCount expected 1 got 2"
    );
  });

  it("fails closed on retry count drift", () => {
    expectFailure(
      (fixture) => {
        fixture.limits.maximumRetryCount = 1;
      },
      "limits.maximumRetryCount expected 0 got 1"
    );
  });

  it("fails closed on rerun count drift", () => {
    expectFailure(
      (fixture) => {
        fixture.limits.maximumRerunCount = 1;
      },
      "limits.maximumRerunCount expected 0 got 1"
    );
  });

  it("fails closed on active one-shot grant drift", () => {
    expectFailure(
      (fixture) => {
        fixture.states.active = "first_controlled_execution_authorization_granted_one_shot_local_only";
      },
      "states.active expected"
    );
  });

  it("fails closed on evidence promotion drift", () => {
    expectFailure(
      (fixture) => {
        fixture.grantedEvidenceClasses = ["candidate_truth_evidence"];
      },
      "grantedEvidenceClasses.length expected 0 got 1"
    );
  });

  it("fails closed on candidate-only class promotion drift", () => {
    expectFailure(
      (fixture) => {
        fixture.candidateOnlyClasses = fixture.candidateOnlyClasses.filter(
          (item: string) => item !== "provider_output_observation_candidate"
        );
      },
      "candidateOnlyClasses missing provider_output_observation_candidate"
    );
  });

  it("fails closed on post-execution review requirement drift", () => {
    expectFailure(
      (fixture) => {
        fixture.postExecutionReview.requiredBeforeEvidenceClassChange = false;
      },
      "postExecutionReview.requiredBeforeEvidenceClassChange must be true"
    );
  });
});
