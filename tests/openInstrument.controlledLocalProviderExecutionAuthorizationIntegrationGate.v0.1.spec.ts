import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const helperPath = path.join(
  process.cwd(),
  "scripts/openInstrumentControlledLocalProviderExecutionAuthorizationValidation.v0.1.mjs",
);

const fixturePath = path.join(
  process.cwd(),
  "docs/open-instrument/fixtures/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-static-fixture-v0.1.json",
);

const schemaPath = path.join(
  process.cwd(),
  "docs/open-instrument/schemas/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-schema-v0.1.json",
);

describe("Open Instrument controlled local-provider execution authorization integration gate v0.1", () => {
  it("keeps the checked-in static authorization fixture passing the validation helper", () => {
    const output = execFileSync("node", [helperPath], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    expect(output).toContain("Controlled local-provider execution authorization validation passed.");
    expect(output).toContain("execution_authorization_contract_static_only");
  });

  it("keeps the fixture static and non-executing", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.authorizationState.currentState).toBe("execution_authorization_not_granted");
    expect(fixture.finalAuthorizationDecision.value).toBe("execution_authorization_contract_static_only");
    expect(fixture.authorizationGates.actualProviderExecutionAuthorized).toBe(false);
    expect(fixture.authorizationGates.modelCallAuthorized).toBe(false);
    expect(fixture.nonExecutionDeclaration.providerRunOccurred).toBe(false);
    expect(fixture.nonExecutionDeclaration.modelCallOccurred).toBe(false);
    expect(fixture.nonExecutionDeclaration.newProviderResponseCaptured).toBe(false);
    expect(fixture.nonExecutionDeclaration.runtimeApiUiWiringChanged).toBe(false);
  });

  it("keeps provider identity, model identity, and local endpoint proof required", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.providerIdentityRequirements.providerNameRequired).toBe(true);
    expect(fixture.providerIdentityRequirements.modelNameRequired).toBe(true);
    expect(fixture.endpointRequirements.localOnlyEndpointRequired).toBe(true);
    expect(fixture.endpointRequirements.localEndpointProofRequired).toBe(true);
    expect(fixture.endpointRequirements.remoteEndpointForbidden).toBe(true);
  });

  it("keeps prompt, request, and response hash requirements mandatory", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.promptRequirements.promptSha256Required).toBe(true);
    expect(fixture.requestRequirements.requestBodySha256Required).toBe(true);
    expect(fixture.responseRequirements.responseSha256Required).toBe(true);
  });

  it("keeps execution counts narrow", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.executionCountLimits.maximumExecutionCount).toBe(1);
    expect(fixture.executionCountLimits.maximumRequestCount).toBe(1);
    expect(fixture.executionCountLimits.maximumResponseCount).toBe(1);
  });

  it("keeps the only granted class as the static authorization contract class", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.evidenceClassPolicy.granted).toEqual([
      "controlled_local_provider_execution_authorization_contract_static",
    ]);
  });

  it("keeps future observation classes candidate-only", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.evidenceClassPolicy.candidateOnly).toEqual(
      expect.arrayContaining([
        "local_smoke_transcript",
        "prompt_response_capture_record",
        "local_provider_execution_capture_record",
        "provider_output_observation_candidate",
        "parser_compatibility_observation_candidate",
        "reproducibility_observation_candidate",
      ]),
    );
  });

  it("keeps promotion evidence classes denied", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.evidenceClassPolicy.denied).toEqual(
      expect.arrayContaining([
        "provider_output_evidence",
        "parser_compatibility_evidence",
        "reproducibility_evidence",
        "candidate_truth_evidence",
        "origin_evidence",
        "model_quality_evidence",
        "publication_evidence",
        "execution_safety_evidence",
      ]),
    );
  });

  it("keeps schema markers for mandatory hash requirements and narrow counts", () => {
    const schema = JSON.parse(readFileSync(schemaPath, "utf8"));

    expect(schema.requiredSha256RequirementFields).toEqual(
      expect.arrayContaining([
        "$.promptRequirements.promptSha256Required",
        "$.requestRequirements.requestBodySha256Required",
        "$.responseRequirements.responseSha256Required",
      ]),
    );

    expect(schema.maximumExecutionCount).toBe(1);
    expect(schema.maximumRequestCount).toBe(1);
    expect(schema.maximumResponseCount).toBe(1);
  });

  it("does not import runtime, API, UI, provider, OpenAI, or network modules", () => {
    const helper = readFileSync(helperPath, "utf8");

    expect(helper).not.toMatch(/from ["']openai["']/);
    expect(helper).not.toMatch(/from ["']@openai\//);
    expect(helper).not.toMatch(/fetch\(/);
    expect(helper).not.toMatch(/\/api\//);
    expect(helper).not.toMatch(/src\/ui|app\//);
    expect(helper).not.toMatch(/http:|https:/);
  });
});
