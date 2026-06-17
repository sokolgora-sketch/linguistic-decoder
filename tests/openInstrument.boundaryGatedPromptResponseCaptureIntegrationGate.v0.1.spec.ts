import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const helperPath = path.join(
  process.cwd(),
  "scripts/openInstrumentBoundaryGatedPromptResponseCaptureValidation.v0.1.mjs",
);

const fixturePath = path.join(
  process.cwd(),
  "docs/open-instrument/fixtures/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-static-fixture-v0.1.json",
);

const schemaPath = path.join(
  process.cwd(),
  "docs/open-instrument/schemas/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-schema-v0.1.json",
);

describe("Open Instrument boundary-gated prompt-response capture integration gate v0.1", () => {
  it("keeps the checked-in static prompt-response capture fixture passing the validation helper", () => {
    const output = execFileSync("node", [helperPath], {
      cwd: process.cwd(),
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    expect(output).toContain("Boundary-gated local-provider prompt-response capture validation passed.");
    expect(output).toContain("capture_contract_static_only");
  });

  it("keeps the fixture static and non-executing", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.captureState.currentState).toBe("execution_not_authorized");
    expect(fixture.finalCaptureDecision.value).toBe("capture_contract_static_only");
    expect(fixture.nonExecutionDeclaration.providerRunOccurred).toBe(false);
    expect(fixture.nonExecutionDeclaration.modelCallOccurred).toBe(false);
    expect(fixture.nonExecutionDeclaration.newProviderResponseCaptured).toBe(false);
    expect(fixture.nonExecutionDeclaration.runtimeApiUiWiringChanged).toBe(false);
  });

  it("keeps the only granted class as the static contract class", () => {
    const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

    expect(fixture.evidenceClassPolicy.granted).toEqual([
      "prompt_response_capture_contract_static",
    ]);

    expect(fixture.evidenceClassPolicy.candidateOnly).toEqual(
      expect.arrayContaining([
        "local_smoke_transcript",
        "prompt_response_capture_record",
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
        "candidate_truth_evidence",
        "origin_evidence",
        "model_quality_evidence",
        "publication_evidence",
        "execution_safety_evidence",
      ]),
    );
  });

  it("keeps schema markers for mandatory prompt, request, and response hashes", () => {
    const schema = JSON.parse(readFileSync(schemaPath, "utf8"));

    expect(schema.requiredSha256Fields).toEqual(
      expect.arrayContaining([
        "$.promptIdentity.promptSha256",
        "$.requestIdentity.requestBodySha256",
        "$.responseIdentity.responseSha256",
      ]),
    );
  });

  it("does not import runtime, API, UI, provider, or OpenAI modules", () => {
    const helper = readFileSync(helperPath, "utf8");

    expect(helper).not.toMatch(/from ["']openai["']/);
    expect(helper).not.toMatch(/from ["']@openai\//);
    expect(helper).not.toMatch(/fetch\(/);
    expect(helper).not.toMatch(/\/api\//);
    expect(helper).not.toMatch(/src\/ui|app\//);
  });
});
