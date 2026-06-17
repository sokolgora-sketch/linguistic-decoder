import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const DEFAULT_SCHEMA_PATH =
  "docs/open-instrument/schemas/execution-capture/open-instrument-boundary-gated-local-provider-execution-capture-schema-v0.1.json";

export const DEFAULT_FIXTURE_PATH =
  "docs/open-instrument/fixtures/execution-capture/open-instrument-boundary-gated-local-provider-execution-capture-static-fixture-v0.1.json";

const EXPECTED_SCHEMA_VERSION =
  "open-instrument.boundary-gated-local-provider.execution-capture.v0.1";

const EXPECTED_SCHEMA_ID =
  "open-instrument.boundary-gated-local-provider.execution-capture.schema.v0.1";

const EXPECTED_DECISION = "execution_capture_contract_static_only";
const EXPECTED_DEFAULT_STATE = "execution_not_authorized";
const FORBIDDEN_ACTIVE_STATE = "execution_authorized_pending_capture";

const SHA256_RE = /^[a-f0-9]{64}$/;
const GIT_SHA_RE = /^[a-f0-9]{40}$/;

const REQUIRED_TOP_LEVEL_FIELDS = [
  "schemaVersion",
  "executionCapturePacketId",
  "sourceChain",
  "executionAuthorization",
  "executionOperator",
  "executionEnvironment",
  "providerIdentity",
  "endpointIdentity",
  "networkBoundary",
  "promptIdentity",
  "requestIdentity",
  "executionCommand",
  "responseIdentity",
  "rerunPolicy",
  "parserCompatibilityPolicy",
  "captureState",
  "authorizationGates",
  "evidenceClassPolicy",
  "denialReasons",
  "finalExecutionCaptureDecision",
  "nonPromotionDeclaration",
  "nonExecutionDeclaration",
  "implementationGates",
];

const ALLOWED_GRANTED_CLASSES = [
  "local_provider_execution_capture_contract_static",
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

export function validateLocalProviderExecutionCaptureFixture(fixture, schema) {
  const errors = [];

  validateSchema(errors, schema);

  const root = requireRecord(errors, fixture, "$");

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!(field in root)) {
      errors.push(`$.${field}: missing required field`);
    }
  }

  expectConst(errors, root.schemaVersion, EXPECTED_SCHEMA_VERSION, "$.schemaVersion");
  expectText(errors, root.executionCapturePacketId, "$.executionCapturePacketId");

  const sourceChain = requireRecord(errors, root.sourceChain, "$.sourceChain");
  expectConst(errors, sourceChain.executionCaptureDesignPr, 1407, "$.sourceChain.executionCaptureDesignPr");
  expectConst(errors, sourceChain.executionCaptureDesignReviewPr, 1408, "$.sourceChain.executionCaptureDesignReviewPr");
  expectConst(errors, sourceChain.promptResponseCaptureClosureAssessmentPr, 1406, "$.sourceChain.promptResponseCaptureClosureAssessmentPr");
  validateGitSha(errors, sourceChain.executionCaptureDesignMergeSha, "$.sourceChain.executionCaptureDesignMergeSha");
  validateGitSha(errors, sourceChain.executionCaptureDesignReviewMergeSha, "$.sourceChain.executionCaptureDesignReviewMergeSha");
  validateGitSha(errors, sourceChain.promptResponseCaptureClosureAssessmentMergeSha, "$.sourceChain.promptResponseCaptureClosureAssessmentMergeSha");
  validateSha(errors, sourceChain.priorControlledExecutionResponseSha256, "$.sourceChain.priorControlledExecutionResponseSha256");

  const executionAuthorization = requireRecord(errors, root.executionAuthorization, "$.executionAuthorization");
  expectConst(errors, executionAuthorization.authorizationPr, 1409, "$.executionAuthorization.authorizationPr");
  validateGitSha(errors, executionAuthorization.authorizationMergeSha, "$.executionAuthorization.authorizationMergeSha");
  expectConst(
    errors,
    executionAuthorization.authorizedScope,
    "static_execution_capture_contract_machinery_only",
    "$.executionAuthorization.authorizedScope",
  );
  expectFalse(errors, executionAuthorization.actualProviderExecutionAuthorized, "$.executionAuthorization.actualProviderExecutionAuthorized");

  const executionOperator = requireRecord(errors, root.executionOperator, "$.executionOperator");
  expectText(errors, executionOperator.operatorDeclaration, "$.executionOperator.operatorDeclaration");
  expectTrue(errors, executionOperator.operatorIdentityRequiredForFutureExecution, "$.executionOperator.operatorIdentityRequiredForFutureExecution");
  expectFalse(errors, executionOperator.operatorIdentityPresent, "$.executionOperator.operatorIdentityPresent");

  const executionEnvironment = requireRecord(errors, root.executionEnvironment, "$.executionEnvironment");
  expectText(errors, executionEnvironment.environmentClass, "$.executionEnvironment.environmentClass");
  expectText(errors, executionEnvironment.futureExecutionEnvironmentRequired, "$.executionEnvironment.futureExecutionEnvironmentRequired");
  expectText(errors, executionEnvironment.executionTimestampPolicy, "$.executionEnvironment.executionTimestampPolicy");

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
  expectTrue(errors, endpointIdentity.endpointClassExplicit, "$.endpointIdentity.endpointClassExplicit");
  expectTrue(errors, endpointIdentity.endpointClassLocalOnly, "$.endpointIdentity.endpointClassLocalOnly");
  expectTrue(errors, endpointIdentity.localEndpointProofRequired, "$.endpointIdentity.localEndpointProofRequired");
  expectText(errors, endpointIdentity.localEndpointProofStatus, "$.endpointIdentity.localEndpointProofStatus");
  expectFalse(errors, endpointIdentity.remoteProviderEndpointUsed, "$.endpointIdentity.remoteProviderEndpointUsed");
  expectFalse(errors, endpointIdentity.liveEndpointUrlPresent, "$.endpointIdentity.liveEndpointUrlPresent");

  const networkBoundary = requireRecord(errors, root.networkBoundary, "$.networkBoundary");
  expectText(errors, networkBoundary.networkBoundaryDeclaration, "$.networkBoundary.networkBoundaryDeclaration");
  expectFalse(errors, networkBoundary.paidOpenAiApiUsed, "$.networkBoundary.paidOpenAiApiUsed");
  expectFalse(errors, networkBoundary.remoteProviderEndpointUsed, "$.networkBoundary.remoteProviderEndpointUsed");
  expectFalse(errors, networkBoundary.secretsUsed, "$.networkBoundary.secretsUsed");
  expectFalse(errors, networkBoundary.networkCallOccurred, "$.networkBoundary.networkCallOccurred");

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
  expectText(errors, requestIdentity.requestBodyPreviewPolicy, "$.requestIdentity.requestBodyPreviewPolicy");
  expectText(errors, requestIdentity.requestBodyMutationPolicy, "$.requestIdentity.requestBodyMutationPolicy");
  if (requestIdentity.requestBodyMutationPolicy.toLowerCase().includes("untracked")) {
    errors.push("$.requestIdentity.requestBodyMutationPolicy: untracked mutation is forbidden");
  }

  const executionCommand = requireRecord(errors, root.executionCommand, "$.executionCommand");
  expectText(errors, executionCommand.executionCommandClass, "$.executionCommand.executionCommandClass");
  expectFalse(errors, executionCommand.executionCommandPresent, "$.executionCommand.executionCommandPresent");
  expectFalse(errors, executionCommand.hiddenRerunDetected, "$.executionCommand.hiddenRerunDetected");

  const responseIdentity = requireRecord(errors, root.responseIdentity, "$.responseIdentity");
  expectText(errors, responseIdentity.responseCaptureMethod, "$.responseIdentity.responseCaptureMethod");
  validateSha(errors, responseIdentity.responseSha256, "$.responseIdentity.responseSha256");
  expectText(errors, responseIdentity.responseRetentionPolicy, "$.responseIdentity.responseRetentionPolicy");
  expectText(errors, responseIdentity.responseMutationPolicy, "$.responseIdentity.responseMutationPolicy");
  if (responseIdentity.responseMutationPolicy.toLowerCase().includes("untracked")) {
    errors.push("$.responseIdentity.responseMutationPolicy: untracked mutation is forbidden");
  }

  const rerunPolicy = requireRecord(errors, root.rerunPolicy, "$.rerunPolicy");
  expectFalse(errors, rerunPolicy.rerunAuthorized, "$.rerunPolicy.rerunAuthorized");
  expectFalse(errors, rerunPolicy.hiddenRerunDetected, "$.rerunPolicy.hiddenRerunDetected");
  expectText(errors, rerunPolicy.rerunPolicy, "$.rerunPolicy.rerunPolicy");

  const parserCompatibilityPolicy = requireRecord(errors, root.parserCompatibilityPolicy, "$.parserCompatibilityPolicy");
  expectFalse(errors, parserCompatibilityPolicy.parserCompatibilityAuthorized, "$.parserCompatibilityPolicy.parserCompatibilityAuthorized");
  expectFalse(errors, parserCompatibilityPolicy.parserCompatibilityEvidenceCreated, "$.parserCompatibilityPolicy.parserCompatibilityEvidenceCreated");
  expectText(errors, parserCompatibilityPolicy.parserCompatibilityPolicy, "$.parserCompatibilityPolicy.parserCompatibilityPolicy");

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

  const finalExecutionCaptureDecision = requireRecord(errors, root.finalExecutionCaptureDecision, "$.finalExecutionCaptureDecision");
  expectConst(errors, finalExecutionCaptureDecision.value, EXPECTED_DECISION, "$.finalExecutionCaptureDecision.value");
  expectText(errors, finalExecutionCaptureDecision.rationale, "$.finalExecutionCaptureDecision.rationale");

  const nonPromotionDeclaration = requireRecord(errors, root.nonPromotionDeclaration, "$.nonPromotionDeclaration");
  for (const key of [
    "promptResponseCaptureContractNotProviderOutputEvidence",
    "promptResponseCaptureContractNotParserCompatibilityEvidence",
    "promptResponseCaptureContractNotReproducibilityEvidence",
    "promptResponseCaptureContractNotCandidateTruthEvidence",
    "promptResponseCaptureContractNotOriginEvidence",
    "promptResponseCaptureContractNotModelQualityEvidence",
    "promptResponseCaptureContractNotPublicationEvidence",
    "promptResponseCaptureContractNotExecutionSafetyEvidence",
  ]) {
    expectTrue(errors, nonPromotionDeclaration[key], `$.nonPromotionDeclaration.${key}`);
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

export function runLocalProviderExecutionCaptureValidation({
  fixturePath = DEFAULT_FIXTURE_PATH,
  schemaPath = DEFAULT_SCHEMA_PATH,
} = {}) {
  const fixture = readJson(fixturePath);
  const schema = readJson(schemaPath);
  const errors = validateLocalProviderExecutionCaptureFixture(fixture, schema);

  if (errors.length > 0) {
    const message = ["Boundary-gated local-provider execution capture validation failed:", ...errors.map((error) => `- ${error}`)].join("\n");
    throw new Error(message);
  }

  return {
    schemaVersion: fixture.schemaVersion,
    executionCapturePacketId: fixture.executionCapturePacketId,
    finalExecutionCaptureDecision: fixture.finalExecutionCaptureDecision.value,
    defaultState: fixture.captureState.defaultState,
    currentState: fixture.captureState.currentState,
    granted: fixture.evidenceClassPolicy.granted,
    candidateOnly: fixture.evidenceClassPolicy.candidateOnly,
    deniedCount: fixture.evidenceClassPolicy.denied.length,
    actualProviderExecutionAuthorized: fixture.authorizationGates.actualProviderExecutionAuthorized,
    runtimeApiUiWiringAuthorized: fixture.authorizationGates.runtimeApiUiWiringAuthorized,
    localEndpointProofRequired: fixture.endpointIdentity.localEndpointProofRequired,
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const fixturePath = process.argv[2] ?? DEFAULT_FIXTURE_PATH;

  try {
    const summary = runLocalProviderExecutionCaptureValidation({ fixturePath });

    console.log("Open Instrument boundary-gated local-provider execution capture validation v0.1");
    console.log("Boundary: static execution-capture contract validation only.");
    console.log("Boundary: no provider execution, no model call, no OpenAI API use.");
    console.log("Boundary: no remote provider endpoint, no secrets, no runtime/API/UI wiring.");
    console.log("Boundary: candidate-truth/origin/model-quality/publication/execution-safety evidence remains blocked.");
    console.log("Execution capture summary:");
    console.log(JSON.stringify(summary, null, 2));
    console.log("Boundary-gated local-provider execution capture validation passed.");
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}
