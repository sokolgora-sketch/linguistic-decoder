import fs from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const helperPath = path.join(
  repoRoot,
  "scripts/openInstrumentFirstControlledLocalProviderExecutionRunAuthorizationValidation.v0.1.mjs"
);
const fixturePath = path.join(
  repoRoot,
  "docs/open-instrument/fixtures/first-controlled-execution-run-authorization/open-instrument-first-controlled-local-provider-execution-run-authorization-static-fixture-v0.1.json"
);
const schemaPath = path.join(
  repoRoot,
  "docs/open-instrument/schemas/first-controlled-execution-run-authorization/open-instrument-first-controlled-local-provider-execution-run-authorization-schema-v0.1.json"
);

describe("first controlled local-provider execution run authorization integration gate", () => {
  it("keeps helper static and away from runtime, provider, network, and secret imports", () => {
    const helper = fs.readFileSync(helperPath, "utf8");

    expect(helper).not.toMatch(/from\s+["']node:http["']/);
    expect(helper).not.toMatch(/from\s+["']node:https["']/);
    expect(helper).not.toMatch(/from\s+["']node:net["']/);
    expect(helper).not.toMatch(/from\s+["']node:tls["']/);
    expect(helper).not.toMatch(/from\s+["']node:child_process["']/);
    expect(helper).not.toContain("fetch(");
    expect(helper).not.toContain("axios");
    expect(helper).not.toMatch(/from\s+["']openai["']/);
    expect(helper).not.toMatch(/from\s+["']ollama["']/);
    expect(helper).not.toMatch(/from\s+["']@\/app/);
    expect(helper).not.toMatch(/from\s+["']@\/src/);
  });

  it("keeps fixture non-executing and one-shot run grant inactive", () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    expect(fixture.status).toBe("static_contract_only");
    expect(fixture.states.default).toBe("first_controlled_execution_run_authorization_not_granted");
    expect(fixture.states.active).toBe("first_controlled_execution_run_authorization_not_granted");
    expect(fixture.states.oneShotRunGrantActive).toBe(false);
    expect(fixture.apiAndSecretPolicy.actualProviderExecutionAuthorized).toBe(false);
    expect(fixture.apiAndSecretPolicy.modelCallAuthorized).toBe(false);
    expect(fixture.apiAndSecretPolicy.paidOpenAiApiUseAuthorized).toBe(false);
    expect(fixture.endpointPolicy.remoteProviderEndpointUseAuthorized).toBe(false);
    expect(fixture.endpointPolicy.localhostProviderCallAuthorized).toBe(false);
    expect(fixture.endpointPolicy.ollamaCallAuthorized).toBe(false);
    expect(fixture.endpointPolicy.openAiCompatibleEndpointCallAuthorized).toBe(false);
    expect(fixture.apiAndSecretPolicy.secretsAuthorized).toBe(false);
    expect(fixture.apiAndSecretPolicy.runtimeApiUiWiringAuthorized).toBe(false);
  });

  it("keeps identity, local proof, prompt, request, and response requirements mandatory", () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    expect(fixture.identityRequirements.providerFamilyRequired).toBe(true);
    expect(fixture.identityRequirements.providerNameRequired).toBe(true);
    expect(fixture.identityRequirements.modelFamilyRequired).toBe(true);
    expect(fixture.identityRequirements.modelNameRequired).toBe(true);
    expect(fixture.identityRequirements.endpointIdentityRequired).toBe(true);
    expect(fixture.identityRequirements.localEndpointProofRequired).toBe(true);
    expect(fixture.promptRequestResponseRequirements.promptSha256Required).toBe(true);
    expect(fixture.promptRequestResponseRequirements.requestBodySha256Required).toBe(true);
    expect(fixture.promptRequestResponseRequirements.responseSha256Required).toBe(true);
  });

  it("keeps one-shot counts narrow and retry/rerun disabled", () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    expect(fixture.limits.maximumExecutionCount).toBe(1);
    expect(fixture.limits.maximumRequestCount).toBe(1);
    expect(fixture.limits.maximumResponseCount).toBe(1);
    expect(fixture.limits.maximumRetryCount).toBe(0);
    expect(fixture.limits.maximumRerunCount).toBe(0);
  });

  it("keeps consumption and expiration mandatory", () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    expect(fixture.lifecyclePolicy.consumptionPolicyRequired).toBe(true);
    expect(fixture.lifecyclePolicy.expirationPolicyRequired).toBe(true);
    expect(fixture.lifecyclePolicy.reuseAuthorized).toBe(false);
    expect(fixture.lifecyclePolicy.rerunWithoutNewAuthorizationAuthorized).toBe(false);
    expect(fixture.lifecyclePolicy.consumeAfterOneShotRunRequired).toBe(true);
  });

  it("keeps evidence classes blocked and candidate observations non-granted", () => {
    const fixture = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

    expect(fixture.candidateOnlyClasses).toContain("provider_output_observation_candidate");
    expect(fixture.candidateOnlyClasses).toContain("parser_compatibility_observation_candidate");
    expect(fixture.candidateOnlyClasses).toContain("reproducibility_observation_candidate");
    expect(fixture.blockedEvidenceClasses).toContain("candidate_truth_evidence");
    expect(fixture.blockedEvidenceClasses).toContain("origin_evidence");
    expect(fixture.blockedEvidenceClasses).toContain("model_quality_evidence");
    expect(fixture.blockedEvidenceClasses).toContain("publication_evidence");
    expect(fixture.blockedEvidenceClasses).toContain("execution_safety_evidence");
    expect(fixture.grantedEvidenceClasses).toEqual([]);
  });

  it("keeps schema anchored on static non-executing run authorization markers", () => {
    const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));

    expect(schema.title).toContain("first controlled local-provider execution run authorization");
    expect(schema.properties.status.const).toBe("static_contract_only");
    expect(schema.properties.states.properties.default.const).toBe(
      "first_controlled_execution_run_authorization_not_granted"
    );
    expect(schema.properties.states.properties.oneShotRunGrantActive.const).toBe(false);
    expect(schema.properties.limits.properties.maximumExecutionCount.const).toBe(1);
    expect(schema.properties.limits.properties.maximumRetryCount.const).toBe(0);
    expect(schema.properties.lifecyclePolicy.properties.consumptionPolicyRequired.const).toBe(true);
    expect(schema.properties.lifecyclePolicy.properties.expirationPolicyRequired.const).toBe(true);
    expect(schema.properties.grantedEvidenceClasses.maxItems).toBe(0);
  });
});
