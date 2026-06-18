import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const defaultFixturePath = path.join(
  repoRoot,
  "docs/open-instrument/fixtures/first-controlled-execution-run-authorization/open-instrument-first-controlled-local-provider-execution-run-authorization-static-fixture-v0.1.json"
);

const fixturePath =
  process.env.OI_FIRST_CONTROLLED_LOCAL_PROVIDER_EXECUTION_RUN_AUTHORIZATION_FIXTURE || defaultFixturePath;

const requiredAllowedStates = [
  "first_controlled_execution_run_authorization_design_only",
  "first_controlled_execution_run_authorization_review_required",
  "first_controlled_execution_run_authorization_not_granted",
  "first_controlled_execution_run_authorization_candidate",
  "first_controlled_execution_run_authorization_granted_one_shot_local_only",
  "first_controlled_execution_run_authorization_failed_closed",
  "first_controlled_execution_run_authorization_consumed",
  "first_controlled_execution_run_authorization_expired",
];

const requiredCandidateOnlyClasses = [
  "local_smoke_transcript",
  "prompt_response_capture_record",
  "local_provider_execution_capture_record",
  "provider_output_observation_candidate",
  "parser_compatibility_observation_candidate",
  "reproducibility_observation_candidate",
];

const requiredBlockedEvidenceClasses = [
  "provider_output_evidence",
  "parser_compatibility_evidence",
  "reproducibility_evidence",
  "candidate_truth_evidence",
  "origin_evidence",
  "model_quality_evidence",
  "publication_evidence",
  "execution_safety_evidence",
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertArrayIncludesAll(actual, required, label) {
  assert(Array.isArray(actual), `${label} must be an array`);
  for (const item of required) {
    assert(actual.includes(item), `${label} missing ${item}`);
  }
}

function assertFalse(value, label) {
  assert(value === false, `${label} must be false`);
}

function assertTrue(value, label) {
  assert(value === true, `${label} must be true`);
}

function assertEq(actual, expected, label) {
  assert(actual === expected, `${label} expected ${JSON.stringify(expected)} got ${JSON.stringify(actual)}`);
}

function assertGitSha(value, label) {
  assert(typeof value === "string" && /^[0-9a-f]{40}$/.test(value), `${label} must be a 40-character git SHA`);
}

function assertSha256(value, label) {
  assert(typeof value === "string" && /^[0-9a-f]{64}$/.test(value), `${label} must be a 64-character SHA-256`);
}

export function validateFirstControlledLocalProviderExecutionRunAuthorizationFixture(fixture) {
  assert(isObject(fixture), "fixture must be an object");

  assertEq(
    fixture.schemaVersion,
    "open-instrument.first-controlled-local-provider-execution-run-authorization.v0.1",
    "schemaVersion"
  );

  assertEq(fixture.status, "static_contract_only", "status");

  assert(isObject(fixture.source), "source must be an object");
  assertGitSha(fixture.source.runImplementationAuthorizationMergeSha, "source.runImplementationAuthorizationMergeSha");
  assertGitSha(fixture.source.runDesignReviewMergeSha, "source.runDesignReviewMergeSha");
  assertGitSha(fixture.source.runDesignMergeSha, "source.runDesignMergeSha");
  assertGitSha(fixture.source.runReadinessMergeSha, "source.runReadinessMergeSha");
  assertGitSha(
    fixture.source.authorizationClosureAssessmentMergeSha,
    "source.authorizationClosureAssessmentMergeSha"
  );
  assertSha256(fixture.source.priorControlledExecutionResponseSha256, "source.priorControlledExecutionResponseSha256");

  assert(isObject(fixture.states), "states must be an object");
  assertArrayIncludesAll(fixture.states.allowed, requiredAllowedStates, "states.allowed");
  assertEq(fixture.states.default, "first_controlled_execution_run_authorization_not_granted", "states.default");
  assertEq(fixture.states.active, "first_controlled_execution_run_authorization_not_granted", "states.active");
  assertFalse(fixture.states.oneShotRunGrantActive, "states.oneShotRunGrantActive");

  assert(isObject(fixture.authorizationClasses), "authorizationClasses must be an object");
  assertArrayIncludesAll(
    fixture.authorizationClasses.granted,
    ["first_controlled_local_provider_execution_run_authorization_contract_static"],
    "authorizationClasses.granted"
  );

  assertArrayIncludesAll(
    fixture.authorizationClasses.denied,
    [
      "actual_provider_execution",
      "model_call",
      "paid_openai_api_use",
      "remote_provider_endpoint_use",
      "localhost_provider_call",
      "ollama_call",
      "openai_compatible_endpoint_call",
      "secrets_use",
      "runtime_api_ui_wiring",
      "artifact_creation",
      "evidence_pack_creation",
      "evidence_promotion",
    ],
    "authorizationClasses.denied"
  );

  assert(isObject(fixture.identityRequirements), "identityRequirements must be an object");
  assertTrue(fixture.identityRequirements.providerFamilyRequired, "identityRequirements.providerFamilyRequired");
  assertTrue(fixture.identityRequirements.providerNameRequired, "identityRequirements.providerNameRequired");
  assertTrue(fixture.identityRequirements.modelFamilyRequired, "identityRequirements.modelFamilyRequired");
  assertTrue(fixture.identityRequirements.modelNameRequired, "identityRequirements.modelNameRequired");
  assertTrue(fixture.identityRequirements.endpointClassRequired, "identityRequirements.endpointClassRequired");
  assertTrue(fixture.identityRequirements.endpointIdentityRequired, "identityRequirements.endpointIdentityRequired");
  assertTrue(fixture.identityRequirements.localEndpointProofRequired, "identityRequirements.localEndpointProofRequired");
  assertTrue(fixture.identityRequirements.localhostOnlyDeclarationRequired, "identityRequirements.localhostOnlyDeclarationRequired");

  assert(isObject(fixture.endpointPolicy), "endpointPolicy must be an object");
  assertTrue(fixture.endpointPolicy.localOnlyEndpointClassRequired, "endpointPolicy.localOnlyEndpointClassRequired");
  assertFalse(fixture.endpointPolicy.remoteProviderEndpointUseAuthorized, "endpointPolicy.remoteProviderEndpointUseAuthorized");
  assertFalse(fixture.endpointPolicy.localhostProviderCallAuthorized, "endpointPolicy.localhostProviderCallAuthorized");
  assertFalse(fixture.endpointPolicy.ollamaCallAuthorized, "endpointPolicy.ollamaCallAuthorized");
  assertFalse(
    fixture.endpointPolicy.openAiCompatibleEndpointCallAuthorized,
    "endpointPolicy.openAiCompatibleEndpointCallAuthorized"
  );
  assertFalse(fixture.endpointPolicy.providerFallbackAuthorized, "endpointPolicy.providerFallbackAuthorized");
  assertFalse(fixture.endpointPolicy.modelFallbackAuthorized, "endpointPolicy.modelFallbackAuthorized");
  assertFalse(fixture.endpointPolicy.endpointDiscoveryAuthorized, "endpointPolicy.endpointDiscoveryAuthorized");
  assertFalse(
    fixture.endpointPolicy.automaticProviderSelectionAuthorized,
    "endpointPolicy.automaticProviderSelectionAuthorized"
  );
  assertFalse(
    fixture.endpointPolicy.automaticModelSelectionAuthorized,
    "endpointPolicy.automaticModelSelectionAuthorized"
  );
  assertFalse(fixture.endpointPolicy.hiddenRetryAuthorized, "endpointPolicy.hiddenRetryAuthorized");
  assertFalse(fixture.endpointPolicy.hiddenRerunAuthorized, "endpointPolicy.hiddenRerunAuthorized");

  assert(isObject(fixture.apiAndSecretPolicy), "apiAndSecretPolicy must be an object");
  assertFalse(fixture.apiAndSecretPolicy.actualProviderExecutionAuthorized, "apiAndSecretPolicy.actualProviderExecutionAuthorized");
  assertFalse(fixture.apiAndSecretPolicy.modelCallAuthorized, "apiAndSecretPolicy.modelCallAuthorized");
  assertFalse(fixture.apiAndSecretPolicy.paidOpenAiApiUseAuthorized, "apiAndSecretPolicy.paidOpenAiApiUseAuthorized");
  assertFalse(fixture.apiAndSecretPolicy.secretsAuthorized, "apiAndSecretPolicy.secretsAuthorized");
  assertFalse(fixture.apiAndSecretPolicy.runtimeApiUiWiringAuthorized, "apiAndSecretPolicy.runtimeApiUiWiringAuthorized");
  assertFalse(fixture.apiAndSecretPolicy.artifactCreationAuthorized, "apiAndSecretPolicy.artifactCreationAuthorized");
  assertFalse(fixture.apiAndSecretPolicy.evidencePackCreationAuthorized, "apiAndSecretPolicy.evidencePackCreationAuthorized");
  assertFalse(fixture.apiAndSecretPolicy.evidencePromotionAuthorized, "apiAndSecretPolicy.evidencePromotionAuthorized");

  assert(isObject(fixture.environmentPolicy), "environmentPolicy must be an object");
  assertTrue(fixture.environmentPolicy.environmentVariableAllowlistRequired, "environmentPolicy.environmentVariableAllowlistRequired");
  assertTrue(fixture.environmentPolicy.environmentVariableDenylistRequired, "environmentPolicy.environmentVariableDenylistRequired");
  assertFalse(
    fixture.environmentPolicy.undeclaredEnvironmentVariableReadAuthorized,
    "environmentPolicy.undeclaredEnvironmentVariableReadAuthorized"
  );
  assertFalse(fixture.environmentPolicy.credentialVariableReadAuthorized, "environmentPolicy.credentialVariableReadAuthorized");
  assertFalse(
    fixture.environmentPolicy.endpointVariableReadWithoutDeclarationAuthorized,
    "environmentPolicy.endpointVariableReadWithoutDeclarationAuthorized"
  );

  assert(isObject(fixture.promptRequestResponseRequirements), "promptRequestResponseRequirements must be an object");
  assertTrue(
    fixture.promptRequestResponseRequirements.promptSourcePathRequired,
    "promptRequestResponseRequirements.promptSourcePathRequired"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.promptSourceReviewRequired,
    "promptRequestResponseRequirements.promptSourceReviewRequired"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.promptCanonicalizationMethodRequired,
    "promptRequestResponseRequirements.promptCanonicalizationMethodRequired"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.promptSha256Required,
    "promptRequestResponseRequirements.promptSha256Required"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.requestBodyCanonicalizationMethodRequired,
    "promptRequestResponseRequirements.requestBodyCanonicalizationMethodRequired"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.requestBodySha256Required,
    "promptRequestResponseRequirements.requestBodySha256Required"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.responseCaptureMethodRequired,
    "promptRequestResponseRequirements.responseCaptureMethodRequired"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.responseSha256Required,
    "promptRequestResponseRequirements.responseSha256Required"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.responseRetentionPolicyRequired,
    "promptRequestResponseRequirements.responseRetentionPolicyRequired"
  );
  assertTrue(
    fixture.promptRequestResponseRequirements.responseMutationPolicyRequired,
    "promptRequestResponseRequirements.responseMutationPolicyRequired"
  );
  assertFalse(
    fixture.promptRequestResponseRequirements.silentResponseOverwriteAuthorized,
    "promptRequestResponseRequirements.silentResponseOverwriteAuthorized"
  );

  assert(isObject(fixture.limits), "limits must be an object");
  assertEq(fixture.limits.maximumExecutionCount, 1, "limits.maximumExecutionCount");
  assertEq(fixture.limits.maximumRequestCount, 1, "limits.maximumRequestCount");
  assertEq(fixture.limits.maximumResponseCount, 1, "limits.maximumResponseCount");
  assertEq(fixture.limits.maximumRetryCount, 0, "limits.maximumRetryCount");
  assertEq(fixture.limits.maximumRerunCount, 0, "limits.maximumRerunCount");

  assert(isObject(fixture.lifecyclePolicy), "lifecyclePolicy must be an object");
  assertTrue(fixture.lifecyclePolicy.consumptionPolicyRequired, "lifecyclePolicy.consumptionPolicyRequired");
  assertTrue(fixture.lifecyclePolicy.expirationPolicyRequired, "lifecyclePolicy.expirationPolicyRequired");
  assertFalse(fixture.lifecyclePolicy.reuseAuthorized, "lifecyclePolicy.reuseAuthorized");
  assertFalse(
    fixture.lifecyclePolicy.rerunWithoutNewAuthorizationAuthorized,
    "lifecyclePolicy.rerunWithoutNewAuthorizationAuthorized"
  );
  assertTrue(fixture.lifecyclePolicy.consumeAfterOneShotRunRequired, "lifecyclePolicy.consumeAfterOneShotRunRequired");
  assertTrue(fixture.lifecyclePolicy.failClosedIfConsumedRequired, "lifecyclePolicy.failClosedIfConsumedRequired");
  assertTrue(fixture.lifecyclePolicy.failClosedIfExpiredRequired, "lifecyclePolicy.failClosedIfExpiredRequired");

  assertArrayIncludesAll(fixture.candidateOnlyClasses, requiredCandidateOnlyClasses, "candidateOnlyClasses");
  assertArrayIncludesAll(fixture.blockedEvidenceClasses, requiredBlockedEvidenceClasses, "blockedEvidenceClasses");
  assert(Array.isArray(fixture.grantedEvidenceClasses), "grantedEvidenceClasses must be an array");
  assertEq(fixture.grantedEvidenceClasses.length, 0, "grantedEvidenceClasses.length");

  assert(isObject(fixture.postRunReview), "postRunReview must be an object");
  assertTrue(
    fixture.postRunReview.requiredBeforeEvidenceClassChange,
    "postRunReview.requiredBeforeEvidenceClassChange"
  );
  assertTrue(
    fixture.postRunReview.requiredBeforeExecutionSafetyEvidence,
    "postRunReview.requiredBeforeExecutionSafetyEvidence"
  );

  assert(isObject(fixture.nonExecutionDeclaration), "nonExecutionDeclaration must be an object");
  assertFalse(fixture.nonExecutionDeclaration.providerRunOccurred, "nonExecutionDeclaration.providerRunOccurred");
  assertFalse(fixture.nonExecutionDeclaration.modelCallOccurred, "nonExecutionDeclaration.modelCallOccurred");
  assertFalse(fixture.nonExecutionDeclaration.paidOpenAiApiUseOccurred, "nonExecutionDeclaration.paidOpenAiApiUseOccurred");
  assertFalse(fixture.nonExecutionDeclaration.remoteEndpointUseOccurred, "nonExecutionDeclaration.remoteEndpointUseOccurred");
  assertFalse(fixture.nonExecutionDeclaration.localhostProviderCallOccurred, "nonExecutionDeclaration.localhostProviderCallOccurred");
  assertFalse(fixture.nonExecutionDeclaration.ollamaCallOccurred, "nonExecutionDeclaration.ollamaCallOccurred");
  assertFalse(
    fixture.nonExecutionDeclaration.openAiCompatibleEndpointCallOccurred,
    "nonExecutionDeclaration.openAiCompatibleEndpointCallOccurred"
  );
  assertFalse(fixture.nonExecutionDeclaration.secretsUseOccurred, "nonExecutionDeclaration.secretsUseOccurred");
  assertFalse(
    fixture.nonExecutionDeclaration.runtimeApiUiWiringOccurred,
    "nonExecutionDeclaration.runtimeApiUiWiringOccurred"
  );
  assertFalse(fixture.nonExecutionDeclaration.artifactCreationOccurred, "nonExecutionDeclaration.artifactCreationOccurred");
  assertFalse(fixture.nonExecutionDeclaration.evidencePackCreationOccurred, "nonExecutionDeclaration.evidencePackCreationOccurred");
  assertFalse(fixture.nonExecutionDeclaration.evidencePromotionOccurred, "nonExecutionDeclaration.evidencePromotionOccurred");

  assertEq(
    fixture.finalDecision,
    "first_controlled_local_provider_execution_run_authorization_contract_static_only",
    "finalDecision"
  );

  return fixture;
}

export function validateFirstControlledLocalProviderExecutionRunAuthorizationFixtureFile(filePath = fixturePath) {
  return validateFirstControlledLocalProviderExecutionRunAuthorizationFixture(readJson(filePath));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fixture = validateFirstControlledLocalProviderExecutionRunAuthorizationFixtureFile();

  console.log("First controlled local-provider execution run authorization validation passed");
  console.log(`schemaVersion=${fixture.schemaVersion}`);
  console.log(`finalDecision=${fixture.finalDecision}`);
  console.log(`defaultState=${fixture.states.default}`);
  console.log(`activeState=${fixture.states.active}`);
  console.log(`oneShotRunGrantActive=${fixture.states.oneShotRunGrantActive}`);
  console.log(`staticClass=${fixture.authorizationClasses.granted.join(",")}`);
  console.log(`localEndpointProofRequired=${fixture.identityRequirements.localEndpointProofRequired}`);
  console.log(`providerNameRequired=${fixture.identityRequirements.providerNameRequired}`);
  console.log(`modelNameRequired=${fixture.identityRequirements.modelNameRequired}`);
  console.log(`maximumExecutionCount=${fixture.limits.maximumExecutionCount}`);
  console.log(`maximumRequestCount=${fixture.limits.maximumRequestCount}`);
  console.log(`maximumResponseCount=${fixture.limits.maximumResponseCount}`);
  console.log(`maximumRetryCount=${fixture.limits.maximumRetryCount}`);
  console.log(`maximumRerunCount=${fixture.limits.maximumRerunCount}`);
  console.log(`consumptionPolicyRequired=${fixture.lifecyclePolicy.consumptionPolicyRequired}`);
  console.log(`expirationPolicyRequired=${fixture.lifecyclePolicy.expirationPolicyRequired}`);
  console.log("actualProviderExecutionAuthorized=false");
  console.log("modelCallAuthorized=false");
  console.log("paidOpenAiApiUseAuthorized=false");
  console.log("localhostProviderCallAuthorized=false");
  console.log("ollamaCallAuthorized=false");
  console.log("openAiCompatibleEndpointCallAuthorized=false");
}
