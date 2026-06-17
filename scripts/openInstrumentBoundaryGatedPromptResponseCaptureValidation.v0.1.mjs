import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_SCHEMA_PATH =
  "docs/open-instrument/schemas/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-schema-v0.1.json";

export const DEFAULT_FIXTURE_PATH =
  "docs/open-instrument/fixtures/prompt-response-capture/open-instrument-boundary-gated-local-provider-prompt-response-capture-static-fixture-v0.1.json";

const EXPECTED_SCHEMA_VERSION =
  "open-instrument.boundary-gated-local-provider.prompt-response-capture.v0.1";

const EXPECTED_SCHEMA_ID =
  "open-instrument.boundary-gated-local-provider.prompt-response-capture.schema.v0.1";

const EXPECTED_DECISION = "capture_contract_static_only";
const EXPECTED_DEFAULT_STATE = "execution_not_authorized";
const FORBIDDEN_ACTIVE_STATE = "execution_authorized_pending_capture";

const SHA256_RE = /^[a-f0-9]{64}$/;
const GIT_SHA_RE = /^[a-f0-9]{40}$/;

const REQUIRED_TOP_LEVEL_FIELDS = [
  "schemaVersion",
  "capturePacketId",
  "sourceChain",
  "captureAuthorization",
  "providerIdentity",
  "endpointIdentity",
  "promptIdentity",
  "requestIdentity",
  "responseIdentity",
  "captureState",
  "authorizationGates",
  "evidenceClassPolicy",
  "denialReasons",
  "finalCaptureDecision",
  "nonExecutionDeclaration",
  "implementationGates",
];

const ALLOWED_GRANTED_CLASSES = [
  "prompt_response_capture_contract_static",
];

const REQUIRED_CANDIDATE_ONLY_CLASSES = [
  "local_smoke_transcript",
  "prompt_response_capture_record",
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
  "providerExecutionAuthorized",
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

  for (const field of ["$.promptIdentity.promptSha256", "$.requestIdentity.requestBodySha256", "$.responseIdentity.responseSha256"]) {
    if (!asArray(schemaRecord.requiredSha256Fields).includes(field)) {
      errors.push(`$schema.requiredSha256Fields.${field}: missing sha256 marker`);
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
}

export function validatePromptResponseCaptureFixture(fixture, schema) {
  const errors = [];

  validateSchema(errors, schema);

  const root = requireRecord(errors, fixture, "$");

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(field in root)) {
      errors.push(`$.${field}: missing required field`);
    }
  }

  expectConst(errors, root.schemaVersion, EXPECTED_SCHEMA_VERSION, "$.schemaVersion");
  expectText(errors, root.capturePacketId, "$.capturePacketId");

  const sourceChain = requireRecord(errors, root.sourceChain, "$.sourceChain");
  expectConst(errors, sourceChain.designPr, 1400, "$.sourceChain.designPr");
  expectConst(errors, sourceChain.designReviewPr, 1401, "$.sourceChain.designReviewPr");
  expectConst(errors, sourceChain.boundaryAssessmentPr, 1398, "$.sourceChain.boundaryAssessmentPr");
  validateSha(errors, sourceChain.priorControlledExecutionResponseSha256, "$.sourceChain.priorControlledExecutionResponseSha256");

  const captureAuthorization = requireRecord(errors, root.captureAuthorization, "$.captureAuthorization");
  expectConst(errors, captureAuthorization.authorizationPr, 1402, "$.captureAuthorization.authorizationPr");
  validateGitSha(errors, captureAuthorization.authorizationMergeSha, "$.captureAuthorization.authorizationMergeSha");
  expectConst(
    errors,
    captureAuthorization.authorizedScope,
    "static_prompt_response_capture_contract_machinery_only",
    "$.captureAuthorization.authorizedScope",
  );

  const providerIdentity = requireRecord(errors, root.providerIdentity, "$.providerIdentity");
  expectText(errors, providerIdentity.providerFamily, "$.providerIdentity.providerFamily");
  expectText(errors, providerIdentity.providerName, "$.providerIdentity.providerName");
  expectText(errors, providerIdentity.modelName, "$.providerIdentity.modelName");
  expectTrue(errors, providerIdentity.providerIdentityExplicit, "$.providerIdentity.providerIdentityExplicit");
  expectTrue(errors, providerIdentity.modelIdentityExplicit, "$.providerIdentity.modelIdentityExplicit");
  expectFalse(errors, providerIdentity.liveProviderNamePresent, "$.providerIdentity.liveProviderNamePresent");
  expectFalse(errors, providerIdentity.liveModelNamePresent, "$.providerIdentity.liveModelNamePresent");

  const endpointIdentity = requireRecord(errors, root.endpointIdentity, "$.endpointIdentity");
  expectText(errors, endpointIdentity.endpointType, "$.endpointIdentity.endpointType");
  expectText(errors, endpointIdentity.endpointUrlClass, "$.endpointIdentity.endpointUrlClass");
  expectText(errors, endpointIdentity.localEndpointProofPolicy, "$.endpointIdentity.localEndpointProofPolicy");
  expectTrue(errors, endpointIdentity.endpointClassExplicit, "$.endpointIdentity.endpointClassExplicit");
  expectTrue(errors, endpointIdentity.endpointClassLocalOnly, "$.endpointIdentity.endpointClassLocalOnly");
  expectFalse(errors, endpointIdentity.remoteProviderEndpointUsed, "$.endpointIdentity.remoteProviderEndpointUsed");
  expectFalse(errors, endpointIdentity.liveEndpointUrlPresent, "$.endpointIdentity.liveEndpointUrlPresent");

  const promptIdentity = requireRecord(errors, root.promptIdentity, "$.promptIdentity");
  expectText(errors, promptIdentity.promptSourcePath, "$.promptIdentity.promptSourcePath");
  expectText(errors, promptIdentity.promptSourceStatus, "$.promptIdentity.promptSourceStatus");
  expectText(errors, promptIdentity.promptCanonicalizationMethod, "$.promptIdentity.promptCanonicalizationMethod");
  validateSha(errors, promptIdentity.promptSha256, "$.promptIdentity.promptSha256");
  if (typeof promptIdentity.promptLength !== "number" || promptIdentity.promptLength < 0) {
    errors.push("$.promptIdentity.promptLength: expected non-negative number");
  }
  expectText(errors, promptIdentity.promptMutationPolicy, "$.promptIdentity.promptMutationPolicy");
  if (promptIdentity.promptMutationPolicy.toLowerCase().includes("untracked")) {
    errors.push("$.promptIdentity.promptMutationPolicy: untracked mutation is forbidden");
  }

  const requestIdentity = requireRecord(errors, root.requestIdentity, "$.requestIdentity");
  expectText(errors, requestIdentity.requestBodyCanonicalizationMethod, "$.requestIdentity.requestBodyCanonicalizationMethod");
  validateSha(errors, requestIdentity.requestBodySha256, "$.requestIdentity.requestBodySha256");
  expectText(errors, requestIdentity.requestBodyMutationPolicy, "$.requestIdentity.requestBodyMutationPolicy");
  if (requestIdentity.requestBodyMutationPolicy.toLowerCase().includes("untracked")) {
    errors.push("$.requestIdentity.requestBodyMutationPolicy: untracked mutation is forbidden");
  }

  const responseIdentity = requireRecord(errors, root.responseIdentity, "$.responseIdentity");
  expectText(errors, responseIdentity.responseCaptureMethod, "$.responseIdentity.responseCaptureMethod");
  validateSha(errors, responseIdentity.responseSha256, "$.responseIdentity.responseSha256");
  expectText(errors, responseIdentity.responseRetentionPolicy, "$.responseIdentity.responseRetentionPolicy");
  expectText(errors, responseIdentity.responseMutationPolicy, "$.responseIdentity.responseMutationPolicy");
  if (responseIdentity.responseMutationPolicy.toLowerCase().includes("untracked")) {
    errors.push("$.responseIdentity.responseMutationPolicy: untracked mutation is forbidden");
  }

  const captureState = requireRecord(errors, root.captureState, "$.captureState");
  expectConst(errors, captureState.defaultState, EXPECTED_DEFAULT_STATE, "$.captureState.defaultState");
  expectConst(errors, captureState.currentState, EXPECTED_DEFAULT_STATE, "$.captureState.currentState");
  if (captureState.currentState === FORBIDDEN_ACTIVE_STATE) {
    errors.push(`$.captureState.currentState: ${FORBIDDEN_ACTIVE_STATE} is not allowed active`);
  }
  if (!asArray(captureState.inactiveDesignedStates).includes(FORBIDDEN_ACTIVE_STATE)) {
    errors.push(`$.captureState.inactiveDesignedStates.${FORBIDDEN_ACTIVE_STATE}: missing inactive state marker`);
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

  const finalCaptureDecision = requireRecord(errors, root.finalCaptureDecision, "$.finalCaptureDecision");
  expectConst(errors, finalCaptureDecision.value, EXPECTED_DECISION, "$.finalCaptureDecision.value");
  expectText(errors, finalCaptureDecision.rationale, "$.finalCaptureDecision.rationale");

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

export function runPromptResponseCaptureValidation({
  fixturePath = DEFAULT_FIXTURE_PATH,
  schemaPath = DEFAULT_SCHEMA_PATH,
} = {}) {
  const fixture = readJson(fixturePath);
  const schema = readJson(schemaPath);
  const errors = validatePromptResponseCaptureFixture(fixture, schema);

  if (errors.length > 0) {
    const message = ["Boundary-gated prompt-response capture validation failed:", ...errors.map((error) => `- ${error}`)].join("\n");
    throw new Error(message);
  }

  return {
    schemaVersion: fixture.schemaVersion,
    capturePacketId: fixture.capturePacketId,
    finalCaptureDecision: fixture.finalCaptureDecision.value,
    defaultState: fixture.captureState.defaultState,
    currentState: fixture.captureState.currentState,
    granted: fixture.evidenceClassPolicy.granted,
    candidateOnly: fixture.evidenceClassPolicy.candidateOnly,
    deniedCount: fixture.evidenceClassPolicy.denied.length,
    providerExecutionAuthorized: fixture.authorizationGates.providerExecutionAuthorized,
    runtimeApiUiWiringAuthorized: fixture.authorizationGates.runtimeApiUiWiringAuthorized,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fixturePath = process.argv[2] ?? DEFAULT_FIXTURE_PATH;

  try {
    const summary = runPromptResponseCaptureValidation({ fixturePath });

    console.log("Open Instrument boundary-gated local-provider prompt-response capture validation v0.1");
    console.log("Boundary: static prompt-response capture contract validation only.");
    console.log("Boundary: no provider execution, no model call, no OpenAI API use.");
    console.log("Boundary: no remote provider endpoint, no secrets, no runtime/API/UI wiring.");
    console.log("Boundary: candidate-truth/origin/model-quality/publication/execution-safety evidence remains blocked.");
    console.log("Capture summary:");
    console.log(JSON.stringify(summary, null, 2));
    console.log("Boundary-gated local-provider prompt-response capture validation passed.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
