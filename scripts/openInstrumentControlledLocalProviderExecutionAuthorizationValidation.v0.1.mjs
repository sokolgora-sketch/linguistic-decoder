import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_SCHEMA_PATH =
  "docs/open-instrument/schemas/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-schema-v0.1.json";

export const DEFAULT_FIXTURE_PATH =
  "docs/open-instrument/fixtures/execution-authorization/open-instrument-controlled-local-provider-execution-authorization-static-fixture-v0.1.json";

const EXPECTED_SCHEMA_VERSION =
  "open-instrument.controlled-local-provider.execution-authorization.v0.1";

const EXPECTED_SCHEMA_ID =
  "open-instrument.controlled-local-provider.execution-authorization.schema.v0.1";

const EXPECTED_DECISION = "execution_authorization_contract_static_only";
const EXPECTED_DEFAULT_STATE = "execution_authorization_not_granted";
const FORBIDDEN_ACTIVE_STATE = "controlled_local_execution_authorization_granted_static_scope";

const SHA256_RE = /^[a-f0-9]{64}$/;
const GIT_SHA_RE = /^[a-f0-9]{40}$/;

const REQUIRED_TOP_LEVEL_FIELDS = [
  "schemaVersion",
  "authorizationPacketId",
  "sourceChain",
  "providerIdentityRequirements",
  "endpointRequirements",
  "networkBoundaryRequirements",
  "operatorRequirements",
  "executionEnvironmentRequirements",
  "promptRequirements",
  "requestRequirements",
  "responseRequirements",
  "executionCountLimits",
  "commandPolicy",
  "rerunPolicy",
  "parserCompatibilityPolicy",
  "authorizationState",
  "authorizationGates",
  "evidenceClassPolicy",
  "denialReasons",
  "finalAuthorizationDecision",
  "nonPromotionDeclaration",
  "postExecutionReviewRequirement",
  "nonExecutionDeclaration",
  "implementationGates",
];

const ALLOWED_GRANTED_CLASSES = [
  "controlled_local_provider_execution_authorization_contract_static",
];

const REQUIRED_CANDIDATE_ONLY_CLASSES = [
  "local_smoke_transcript",
  "prompt_response_capture_record",
  "local_provider_execution_capture_record",
  "provider_output_observation_candidate",
  "parser_compatibility_observation_candidate",
  "reproducibility_observation_candidate",
];

const BLOCKED_EVIDENCE_CLASSES = [
  "provider_output_evidence",
  "parser_compatibility_evidence",
  "reproducibility_evidence",
  "candidate_truth_evidence",
  "origin_evidence",
  "model_quality_evidence",
  "publication_evidence",
  "execution_safety_evidence",
];

const REQUIRED_FALSE_AUTHORIZATION_GATES = [
  "actualProviderExecutionAuthorized",
  "modelCallAuthorized",
  "paidOpenAiApiUseAuthorized",
  "remoteProviderEndpointAuthorized",
  "secretsUseAuthorized",
  "runtimeApiUiWiringAuthorized",
  "artifactCreationAuthorized",
  "evidencePackCreationAuthorized",
  "publicationFramingAuthorized",
  "providerOutputScoringAuthorized",
  "candidateRankingAuthorized",
  "providerOutputEvidenceAuthorized",
  "parserCompatibilityEvidenceAuthorized",
  "reproducibilityEvidenceAuthorized",
  "candidateTruthEvidenceAuthorized",
  "originEvidenceAuthorized",
  "modelQualityEvidenceAuthorized",
  "publicationEvidenceAuthorized",
  "executionSafetyEvidenceAuthorized",
];

const REQUIRED_FALSE_NON_EXECUTION_FLAGS = [
  "providerRunOccurred",
  "modelCallOccurred",
  "paidOpenAiApiUsed",
  "remoteProviderEndpointUsed",
  "secretsUsed",
  "runtimeApiUiWiringChanged",
  "newProviderResponseCaptured",
  "artifactCreated",
  "evidencePackCreated",
  "publicationFramingCreated",
  "providerOutputScored",
  "candidateRanked",
  "providerOutputEvidenceCreated",
  "parserCompatibilityEvidenceCreated",
  "reproducibilityEvidenceCreated",
  "candidateTruthEvidenceCreated",
  "originEvidenceCreated",
  "modelQualityEvidenceCreated",
  "publicationEvidenceCreated",
  "executionSafetyEvidenceCreated",
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function hasText(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateSha(errors, value, pointer) {
  if (typeof value !== "string" || !SHA256_RE.test(value)) {
    errors.push(`${pointer}: expected sha256`);
  }
}

function validateGitSha(errors, value, pointer) {
  if (typeof value !== "string" || !GIT_SHA_RE.test(value)) {
    errors.push(`${pointer}: expected git sha`);
  }
}

function expectFalse(errors, value, pointer) {
  if (value !== false) {
    errors.push(`${pointer}: expected false`);
  }
}

function expectTrue(errors, value, pointer) {
  if (value !== true) {
    errors.push(`${pointer}: expected true`);
  }
}

function expectText(errors, value, pointer) {
  if (!hasText(value)) {
    errors.push(`${pointer}: expected non-empty string`);
  }
}

function expectConst(errors, value, expected, pointer) {
  if (value !== expected) {
    errors.push(`${pointer}: expected ${JSON.stringify(expected)}`);
  }
}

function expectNumberConst(errors, value, expected, pointer) {
  if (value !== expected) {
    errors.push(`${pointer}: expected ${expected}`);
  }
}

function requireRecord(errors, value, pointer) {
  if (!isRecord(value)) {
    errors.push(`${pointer}: expected object`);
    return {};
  }
  return value;
}

function requireArray(errors, value, pointer) {
  if (!Array.isArray(value)) {
    errors.push(`${pointer}: expected array`);
    return [];
  }
  return value;
}

function validateSchema(errors, schema) {
  const schemaRecord = requireRecord(errors, schema, "$schema");
  expectConst(errors, schemaRecord.schemaId, EXPECTED_SCHEMA_ID, "$schema.schemaId");

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!asArray(schemaRecord.requiredTopLevelFields).includes(field)) {
      errors.push(`$schema.requiredTopLevelFields.${field}: missing required field marker`);
    }
  }

  for (const field of [
    "$.promptRequirements.promptSha256Required",
    "$.requestRequirements.requestBodySha256Required",
    "$.responseRequirements.responseSha256Required",
  ]) {
    if (!asArray(schemaRecord.requiredSha256RequirementFields).includes(field)) {
      errors.push(`$schema.requiredSha256RequirementFields.${field}: missing sha256 requirement marker`);
    }
  }

  for (const className of BLOCKED_EVIDENCE_CLASSES) {
    if (!asArray(schemaRecord.blockedEvidenceClasses).includes(className)) {
      errors.push(`$schema.blockedEvidenceClasses.${className}: missing blocked class marker`);
    }
  }

  for (const gate of REQUIRED_FALSE_AUTHORIZATION_GATES) {
    if (!asArray(schemaRecord.requiredFalseAuthorizationGates).includes(gate)) {
      errors.push(`$schema.requiredFalseAuthorizationGates.${gate}: missing false gate marker`);
    }
  }

  expectConst(errors, schemaRecord.requiredDefaultState, EXPECTED_DEFAULT_STATE, "$schema.requiredDefaultState");
  expectConst(errors, schemaRecord.requiredFinalDecision, EXPECTED_DECISION, "$schema.requiredFinalDecision");
  expectNumberConst(errors, schemaRecord.maximumExecutionCount, 1, "$schema.maximumExecutionCount");
  expectNumberConst(errors, schemaRecord.maximumRequestCount, 1, "$schema.maximumRequestCount");
  expectNumberConst(errors, schemaRecord.maximumResponseCount, 1, "$schema.maximumResponseCount");
}

export function validateControlledLocalProviderExecutionAuthorizationFixture(fixture, schema) {
  const errors = [];

  validateSchema(errors, schema);

  const root = requireRecord(errors, fixture, "$");

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(field in root)) {
      errors.push(`$.${field}: missing required field`);
    }
  }

  expectConst(errors, root.schemaVersion, EXPECTED_SCHEMA_VERSION, "$.schemaVersion");
  expectText(errors, root.authorizationPacketId, "$.authorizationPacketId");

  const sourceChain = requireRecord(errors, root.sourceChain, "$.sourceChain");
  expectNumberConst(errors, sourceChain.authorizationDesignPr, 1415, "$.sourceChain.authorizationDesignPr");
  expectNumberConst(errors, sourceChain.authorizationDesignReviewPr, 1416, "$.sourceChain.authorizationDesignReviewPr");
  expectNumberConst(errors, sourceChain.implementationAuthorizationPr, 1417, "$.sourceChain.implementationAuthorizationPr");
  expectNumberConst(errors, sourceChain.readinessAssessmentPr, 1414, "$.sourceChain.readinessAssessmentPr");
  expectNumberConst(errors, sourceChain.promptResponseCaptureClosureAssessmentPr, 1406, "$.sourceChain.promptResponseCaptureClosureAssessmentPr");
  expectNumberConst(errors, sourceChain.executionCaptureClosureAssessmentPr, 1413, "$.sourceChain.executionCaptureClosureAssessmentPr");
  validateGitSha(errors, sourceChain.authorizationDesignMergeSha, "$.sourceChain.authorizationDesignMergeSha");
  validateGitSha(errors, sourceChain.authorizationDesignReviewMergeSha, "$.sourceChain.authorizationDesignReviewMergeSha");
  validateGitSha(errors, sourceChain.implementationAuthorizationMergeSha, "$.sourceChain.implementationAuthorizationMergeSha");
  validateGitSha(errors, sourceChain.readinessAssessmentMergeSha, "$.sourceChain.readinessAssessmentMergeSha");
  validateGitSha(errors, sourceChain.promptResponseCaptureClosureAssessmentMergeSha, "$.sourceChain.promptResponseCaptureClosureAssessmentMergeSha");
  validateGitSha(errors, sourceChain.executionCaptureClosureAssessmentMergeSha, "$.sourceChain.executionCaptureClosureAssessmentMergeSha");
  validateSha(errors, sourceChain.priorControlledExecutionResponseSha256, "$.sourceChain.priorControlledExecutionResponseSha256");

  const providerIdentityRequirements = requireRecord(errors, root.providerIdentityRequirements, "$.providerIdentityRequirements");
  for (const key of [
    "providerFamilyRequired",
    "providerNameRequired",
    "modelNameRequired",
    "providerVersionPolicyRequired",
    "hiddenProviderFallbackForbidden",
  ]) {
    expectTrue(errors, providerIdentityRequirements[key], `$.providerIdentityRequirements.${key}`);
  }
  expectText(errors, providerIdentityRequirements.futureProviderFamily, "$.providerIdentityRequirements.futureProviderFamily");
  expectText(errors, providerIdentityRequirements.futureProviderName, "$.providerIdentityRequirements.futureProviderName");
  expectText(errors, providerIdentityRequirements.futureModelName, "$.providerIdentityRequirements.futureModelName");

  const endpointRequirements = requireRecord(errors, root.endpointRequirements, "$.endpointRequirements");
  for (const key of [
    "endpointClassRequired",
    "endpointUrlClassRequired",
    "localOnlyEndpointRequired",
    "localEndpointProofRequired",
    "remoteEndpointForbidden",
  ]) {
    expectTrue(errors, endpointRequirements[key], `$.endpointRequirements.${key}`);
  }
  expectText(errors, endpointRequirements.futureEndpointClass, "$.endpointRequirements.futureEndpointClass");
  expectText(errors, endpointRequirements.futureEndpointUrlClass, "$.endpointRequirements.futureEndpointUrlClass");

  const networkBoundaryRequirements = requireRecord(errors, root.networkBoundaryRequirements, "$.networkBoundaryRequirements");
  for (const key of [
    "localOnlyNetworkDeclarationRequired",
    "paidOpenAiApiUseForbidden",
    "remoteProviderEndpointUseForbidden",
    "secretsUseForbidden",
  ]) {
    expectTrue(errors, networkBoundaryRequirements[key], `$.networkBoundaryRequirements.${key}`);
  }
  expectFalse(errors, networkBoundaryRequirements.networkCallOccurred, "$.networkBoundaryRequirements.networkCallOccurred");

  const operatorRequirements = requireRecord(errors, root.operatorRequirements, "$.operatorRequirements");
  expectTrue(errors, operatorRequirements.operatorDeclarationRequired, "$.operatorRequirements.operatorDeclarationRequired");
  expectTrue(errors, operatorRequirements.operatorIdentityRequiredForFutureExecution, "$.operatorRequirements.operatorIdentityRequiredForFutureExecution");
  expectFalse(errors, operatorRequirements.operatorIdentityPresent, "$.operatorRequirements.operatorIdentityPresent");

  const executionEnvironmentRequirements = requireRecord(errors, root.executionEnvironmentRequirements, "$.executionEnvironmentRequirements");
  expectTrue(errors, executionEnvironmentRequirements.executionEnvironmentDeclarationRequired, "$.executionEnvironmentRequirements.executionEnvironmentDeclarationRequired");
  expectText(errors, executionEnvironmentRequirements.futureExecutionEnvironment, "$.executionEnvironmentRequirements.futureExecutionEnvironment");
  expectTrue(errors, executionEnvironmentRequirements.runtimeApiUiWiringForbidden, "$.executionEnvironmentRequirements.runtimeApiUiWiringForbidden");

  const promptRequirements = requireRecord(errors, root.promptRequirements, "$.promptRequirements");
  for (const key of [
    "promptSourcePathRequired",
    "promptSourceReviewStatusRequired",
    "promptCanonicalizationMethodRequired",
    "promptSha256Required",
    "untrackedPromptMutationForbidden",
  ]) {
    expectTrue(errors, promptRequirements[key], `$.promptRequirements.${key}`);
  }

  const requestRequirements = requireRecord(errors, root.requestRequirements, "$.requestRequirements");
  for (const key of [
    "requestBodyCanonicalizationMethodRequired",
    "requestBodySha256Required",
    "noSecretsRequestBodyPolicyRequired",
    "requestPreviewPolicyRequired",
    "untrackedRequestBodyMutationForbidden",
  ]) {
    expectTrue(errors, requestRequirements[key], `$.requestRequirements.${key}`);
  }

  const responseRequirements = requireRecord(errors, root.responseRequirements, "$.responseRequirements");
  for (const key of [
    "responseCaptureMethodRequired",
    "responseSha256Required",
    "responseRetentionPolicyRequired",
    "responseMutationPolicyRequired",
    "untrackedResponseMutationForbidden",
    "silentResponseOverwriteForbidden",
  ]) {
    expectTrue(errors, responseRequirements[key], `$.responseRequirements.${key}`);
  }

  const executionCountLimits = requireRecord(errors, root.executionCountLimits, "$.executionCountLimits");
  expectNumberConst(errors, executionCountLimits.maximumExecutionCount, 1, "$.executionCountLimits.maximumExecutionCount");
  expectNumberConst(errors, executionCountLimits.maximumRequestCount, 1, "$.executionCountLimits.maximumRequestCount");
  expectNumberConst(errors, executionCountLimits.maximumResponseCount, 1, "$.executionCountLimits.maximumResponseCount");
  expectTrue(errors, executionCountLimits.higherCountRequiresExplicitReviewedAuthorization, "$.executionCountLimits.higherCountRequiresExplicitReviewedAuthorization");

  const commandPolicy = requireRecord(errors, root.commandPolicy, "$.commandPolicy");
  expectTrue(errors, commandPolicy.allowedCommandClassRequired, "$.commandPolicy.allowedCommandClassRequired");
  expectTrue(errors, commandPolicy.forbiddenCommandClassesRequired, "$.commandPolicy.forbiddenCommandClassesRequired");
  expectTrue(errors, commandPolicy.hiddenRerunForbidden, "$.commandPolicy.hiddenRerunForbidden");
  expectTrue(errors, commandPolicy.automaticRetriesForbiddenUnlessExplicitlyAuthorized, "$.commandPolicy.automaticRetriesForbiddenUnlessExplicitlyAuthorized");

  const rerunPolicy = requireRecord(errors, root.rerunPolicy, "$.rerunPolicy");
  expectTrue(errors, rerunPolicy.rerunPolicyRequired, "$.rerunPolicy.rerunPolicyRequired");
  expectFalse(errors, rerunPolicy.rerunAuthorized, "$.rerunPolicy.rerunAuthorized");
  expectFalse(errors, rerunPolicy.hiddenRerunAllowed, "$.rerunPolicy.hiddenRerunAllowed");

  const parserCompatibilityPolicy = requireRecord(errors, root.parserCompatibilityPolicy, "$.parserCompatibilityPolicy");
  expectTrue(errors, parserCompatibilityPolicy.parserCompatibilityPolicyRequired, "$.parserCompatibilityPolicy.parserCompatibilityPolicyRequired");
  expectFalse(errors, parserCompatibilityPolicy.parserCompatibilityEvidenceAuthorized, "$.parserCompatibilityPolicy.parserCompatibilityEvidenceAuthorized");

  const authorizationState = requireRecord(errors, root.authorizationState, "$.authorizationState");
  expectConst(errors, authorizationState.defaultState, EXPECTED_DEFAULT_STATE, "$.authorizationState.defaultState");
  expectConst(errors, authorizationState.currentState, EXPECTED_DEFAULT_STATE, "$.authorizationState.currentState");
  if (authorizationState.currentState === FORBIDDEN_ACTIVE_STATE) {
    errors.push(`$.authorizationState.currentState: ${FORBIDDEN_ACTIVE_STATE} is not allowed active`);
  }
  if (!asArray(authorizationState.inactiveDesignedStates).includes(FORBIDDEN_ACTIVE_STATE)) {
    errors.push(`$.authorizationState.inactiveDesignedStates.${FORBIDDEN_ACTIVE_STATE}: missing inactive state marker`);
  }

  const authorizationGates = requireRecord(errors, root.authorizationGates, "$.authorizationGates");
  for (const gate of REQUIRED_FALSE_AUTHORIZATION_GATES) {
    expectFalse(errors, authorizationGates[gate], `$.authorizationGates.${gate}`);
  }

  const evidenceClassPolicy = requireRecord(errors, root.evidenceClassPolicy, "$.evidenceClassPolicy");
  const granted = requireArray(errors, evidenceClassPolicy.granted, "$.evidenceClassPolicy.granted");
  const candidateOnly = requireArray(errors, evidenceClassPolicy.candidateOnly, "$.evidenceClassPolicy.candidateOnly");
  const denied = requireArray(errors, evidenceClassPolicy.denied, "$.evidenceClassPolicy.denied");

  for (const className of granted) {
    if (!ALLOWED_GRANTED_CLASSES.includes(className)) {
      errors.push(`$.evidenceClassPolicy.granted.${className}: class is not allowed to be granted`);
    }
  }

  for (const className of ALLOWED_GRANTED_CLASSES) {
    if (!granted.includes(className)) {
      errors.push(`$.evidenceClassPolicy.granted.${className}: required static grant missing`);
    }
  }

  for (const className of REQUIRED_CANDIDATE_ONLY_CLASSES) {
    if (!candidateOnly.includes(className)) {
      errors.push(`$.evidenceClassPolicy.candidateOnly.${className}: candidate-only class missing`);
    }
    if (granted.includes(className)) {
      errors.push(`$.evidenceClassPolicy.granted.${className}: candidate-only class must not be granted`);
    }
  }

  for (const className of BLOCKED_EVIDENCE_CLASSES) {
    if (!denied.includes(className)) {
      errors.push(`$.evidenceClassPolicy.denied.${className}: blocked class must be denied`);
    }
    if (granted.includes(className)) {
      errors.push(`$.evidenceClassPolicy.granted.${className}: blocked class must not be granted`);
    }
  }

  const denialReasons = requireRecord(errors, root.denialReasons, "$.denialReasons");
  for (const className of BLOCKED_EVIDENCE_CLASSES) {
    expectText(errors, denialReasons[className], `$.denialReasons.${className}`);
  }

  const finalAuthorizationDecision = requireRecord(errors, root.finalAuthorizationDecision, "$.finalAuthorizationDecision");
  expectConst(errors, finalAuthorizationDecision.value, EXPECTED_DECISION, "$.finalAuthorizationDecision.value");
  expectText(errors, finalAuthorizationDecision.rationale, "$.finalAuthorizationDecision.rationale");

  const nonPromotionDeclaration = requireRecord(errors, root.nonPromotionDeclaration, "$.nonPromotionDeclaration");
  for (const key of [
    "providerOutputNotEvidence",
    "parserCompatibilityNotEvidence",
    "reproducibilityNotEvidence",
    "candidateTruthNotEvidence",
    "originNotEvidence",
    "modelQualityNotEvidence",
    "publicationNotEvidence",
    "executionSafetyNotEvidence",
    "priorControlledResponseRemainsLocalSmokeTranscriptOnly",
  ]) {
    expectTrue(errors, nonPromotionDeclaration[key], `$.nonPromotionDeclaration.${key}`);
  }

  const postExecutionReviewRequirement = requireRecord(errors, root.postExecutionReviewRequirement, "$.postExecutionReviewRequirement");
  for (const key of [
    "postExecutionReviewRequiredBeforeEvidenceClassChange",
    "postExecutionReviewRequiredBeforeRuntimeApiUiWiring",
    "postExecutionReviewRequiredBeforeArtifacts",
    "postExecutionReviewRequiredBeforeEvidencePacks",
  ]) {
    expectTrue(errors, postExecutionReviewRequirement[key], `$.postExecutionReviewRequirement.${key}`);
  }

  const nonExecutionDeclaration = requireRecord(errors, root.nonExecutionDeclaration, "$.nonExecutionDeclaration");
  for (const flag of REQUIRED_FALSE_NON_EXECUTION_FLAGS) {
    expectFalse(errors, nonExecutionDeclaration[flag], `$.nonExecutionDeclaration.${flag}`);
  }

  const implementationGates = requireRecord(errors, root.implementationGates, "$.implementationGates");
  for (const gate of [
    "schemaAdded",
    "staticFixtureAdded",
    "validationHelperAdded",
    "focusedValidationTestsAdded",
    "focusedIntegrationGateTestsAdded",
    "implementationDocAdded",
  ]) {
    expectTrue(errors, implementationGates[gate], `$.implementationGates.${gate}`);
  }

  return errors;
}

export function runControlledLocalProviderExecutionAuthorizationValidation({
  fixturePath = DEFAULT_FIXTURE_PATH,
  schemaPath = DEFAULT_SCHEMA_PATH,
} = {}) {
  const fixture = readJson(fixturePath);
  const schema = readJson(schemaPath);
  const errors = validateControlledLocalProviderExecutionAuthorizationFixture(fixture, schema);

  if (errors.length > 0) {
    const message = ["Controlled local-provider execution authorization validation failed:", ...errors.map((error) => `- ${error}`)].join("\n");
    throw new Error(message);
  }

  return {
    schemaVersion: fixture.schemaVersion,
    authorizationPacketId: fixture.authorizationPacketId,
    finalAuthorizationDecision: fixture.finalAuthorizationDecision.value,
    defaultState: fixture.authorizationState.defaultState,
    currentState: fixture.authorizationState.currentState,
    granted: fixture.evidenceClassPolicy.granted,
    candidateOnly: fixture.evidenceClassPolicy.candidateOnly,
    deniedCount: fixture.evidenceClassPolicy.denied.length,
    actualProviderExecutionAuthorized: fixture.authorizationGates.actualProviderExecutionAuthorized,
    modelCallAuthorized: fixture.authorizationGates.modelCallAuthorized,
    runtimeApiUiWiringAuthorized: fixture.authorizationGates.runtimeApiUiWiringAuthorized,
    localEndpointProofRequired: fixture.endpointRequirements.localEndpointProofRequired,
    maximumExecutionCount: fixture.executionCountLimits.maximumExecutionCount,
    maximumRequestCount: fixture.executionCountLimits.maximumRequestCount,
    maximumResponseCount: fixture.executionCountLimits.maximumResponseCount,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fixturePath = process.argv[2] ?? DEFAULT_FIXTURE_PATH;

  try {
    const summary = runControlledLocalProviderExecutionAuthorizationValidation({ fixturePath });

    console.log("Open Instrument controlled local-provider execution authorization validation v0.1");
    console.log("Boundary: static authorization-envelope validation only.");
    console.log("Boundary: no provider execution, no model call, no OpenAI API use.");
    console.log("Boundary: no remote provider endpoint, no secrets, no runtime/API/UI wiring.");
    console.log("Boundary: candidate-truth/origin/model-quality/publication/execution-safety evidence remains blocked.");
    console.log("Authorization summary:");
    console.log(JSON.stringify(summary, null, 2));
    console.log("Controlled local-provider execution authorization validation passed.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
