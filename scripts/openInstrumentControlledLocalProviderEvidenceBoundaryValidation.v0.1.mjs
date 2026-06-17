import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const DEFAULT_SCHEMA = path.join(
  repoRoot,
  "docs/open-instrument/schemas/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-schema-v0.1.json",
);

const DEFAULT_FIXTURE = path.join(
  repoRoot,
  "docs/open-instrument/fixtures/controlled-local-provider-evidence-boundary/open-instrument-controlled-local-provider-evidence-boundary-static-fixture-v0.1.json",
);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function argValue(name, fallback) {
  const index = process.argv.indexOf(name);
  if (index === -1) return fallback;
  const value = process.argv[index + 1];
  if (!value) throw new Error(`Missing value for ${name}`);
  return path.resolve(value);
}

function isSha256(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function push(errors, pathName, message) {
  errors.push(`${pathName}: ${message}`);
}

export function validateControlledLocalProviderEvidenceBoundaryRecord(record, schema) {
  const errors = [];

  if (!schema || schema.schemaVersion !== "open-instrument.controlled-local-provider.evidence-boundary.schema.v0.1") {
    push(errors, "schema.schemaVersion", "unexpected schema version");
    return errors;
  }

  for (const field of schema.requiredTopLevelFields ?? []) {
    if (!(field in record)) {
      push(errors, `$`, `missing required field: ${field}`);
    }
  }

  if (record.schemaVersion !== schema.boundarySchemaFor) {
    push(errors, "$.schemaVersion", `expected ${schema.boundarySchemaFor}, received ${record.schemaVersion}`);
  }

  if (!isNonEmptyString(record.fixtureId)) {
    push(errors, "$.fixtureId", "expected non-empty string");
  }

  if (record.boundaryVersion !== "v0.1") {
    push(errors, "$.boundaryVersion", `expected v0.1, received ${record.boundaryVersion}`);
  }

  const sourceChain = record.sourceChain ?? {};
  if (sourceChain.designPr !== 1392) push(errors, "$.sourceChain.designPr", "expected 1392");
  if (sourceChain.reviewPr !== 1393) push(errors, "$.sourceChain.reviewPr", "expected 1393");
  if (sourceChain.authorizationPr !== 1394) push(errors, "$.sourceChain.authorizationPr", "expected 1394");
  if (!isSha256(sourceChain.priorControlledExecutionResponseSha256)) {
    push(errors, "$.sourceChain.priorControlledExecutionResponseSha256", "expected sha256");
  }

  const provider = record.providerIdentity ?? {};
  if (provider.providerFamily !== "local") push(errors, "$.providerIdentity.providerFamily", "expected local");
  if (provider.providerName !== "ollama") push(errors, "$.providerIdentity.providerName", "expected ollama");
  if (!isNonEmptyString(provider.modelName)) push(errors, "$.providerIdentity.modelName", "expected non-empty string");
  if (provider.endpointType !== "local_openai_compatible") push(errors, "$.providerIdentity.endpointType", "expected local_openai_compatible");
  if (provider.endpointUrlClass !== "localhost") push(errors, "$.providerIdentity.endpointUrlClass", "expected localhost");
  if (provider.paidOpenAiApiUsed !== false) push(errors, "$.providerIdentity.paidOpenAiApiUsed", "expected false");
  if (provider.remoteProviderEndpointUsed !== false) push(errors, "$.providerIdentity.remoteProviderEndpointUsed", "expected false");
  if (provider.secretsUsed !== false) push(errors, "$.providerIdentity.secretsUsed", "expected false");

  const prompt = record.promptIdentity ?? {};
  if (!isNonEmptyString(prompt.promptId)) push(errors, "$.promptIdentity.promptId", "expected non-empty string");
  if (!isNonEmptyString(prompt.promptSha256)) push(errors, "$.promptIdentity.promptSha256", "expected recorded value");
  if (prompt.promptSha256Available !== false) {
    push(errors, "$.promptIdentity.promptSha256Available", "expected false for prior-lane unavailable prompt hash");
  }

  const response = record.responseIdentity ?? {};
  if (!isSha256(response.responseSha256)) push(errors, "$.responseIdentity.responseSha256", "expected sha256");
  if (response.responseSha256 !== sourceChain.priorControlledExecutionResponseSha256) {
    push(errors, "$.responseIdentity.responseSha256", "must match sourceChain prior response sha");
  }
  if (!isNonEmptyString(response.responseCaptureMethod)) push(errors, "$.responseIdentity.responseCaptureMethod", "expected non-empty string");
  if (!isNonEmptyString(response.responseRetentionPolicy)) push(errors, "$.responseIdentity.responseRetentionPolicy", "expected non-empty string");

  const gates = record.authorizationGates ?? {};
  for (const gate of schema.requiredFalseAuthorizationGates ?? []) {
    if (gates[gate] !== false) {
      push(errors, `$.authorizationGates.${gate}`, "expected false");
    }
  }
  for (const gate of schema.requiredTrueImplementationGates ?? []) {
    if (gates[gate] !== true) {
      push(errors, `$.authorizationGates.${gate}`, "expected true");
    }
  }

  const boundary = record.evidenceBoundary ?? {};
  const allowedGranted = new Set(schema.allowedGrantedEvidenceClasses ?? []);
  const blocked = new Set(schema.blockedEvidenceClasses ?? []);
  const granted = Array.isArray(boundary.evidenceClassesGranted) ? boundary.evidenceClassesGranted : [];
  const denied = Array.isArray(boundary.evidenceClassesDenied) ? boundary.evidenceClassesDenied : [];
  const denialReasons = Array.isArray(boundary.denialReasons) ? boundary.denialReasons : [];

  if (boundary.evidenceClassRequested !== "local_smoke_transcript") {
    push(errors, "$.evidenceBoundary.evidenceClassRequested", "expected local_smoke_transcript");
  }

  for (const klass of granted) {
    if (!allowedGranted.has(klass)) {
      push(errors, `$.evidenceBoundary.evidenceClassesGranted.${klass}`, "class is not allowed to be granted");
    }
    if (blocked.has(klass)) {
      push(errors, `$.evidenceBoundary.evidenceClassesGranted.${klass}`, "blocked class was granted");
    }
  }

  if (!granted.includes("local_smoke_transcript")) {
    push(errors, "$.evidenceBoundary.evidenceClassesGranted", "must grant local_smoke_transcript");
  }

  for (const klass of blocked) {
    if (!denied.includes(klass)) {
      push(errors, `$.evidenceBoundary.evidenceClassesDenied.${klass}`, "blocked class must be denied");
    }
  }

  for (const reason of schema.requiredDenyReasons ?? []) {
    if (!denialReasons.includes(reason)) {
      push(errors, `$.evidenceBoundary.denialReasons.${reason}`, "missing required denial reason");
    }
  }

  if (!denialReasons.includes("missing_prompt_hash_blocks_promotion")) {
    push(errors, "$.evidenceBoundary.denialReasons.missing_prompt_hash_blocks_promotion", "missing required denial reason");
  }

  if (boundary.promotionBlocked !== true) {
    push(errors, "$.evidenceBoundary.promotionBlocked", "expected true");
  }

  const finalDecision = record.finalDecision ?? {};
  const allowedDecisions = new Set(schema.finalDecision?.allowedValues ?? []);
  if (!allowedDecisions.has(finalDecision.value)) {
    push(errors, "$.finalDecision.value", "unexpected final decision");
  }

  if (finalDecision.value !== "local_smoke_transcript_only") {
    push(errors, "$.finalDecision.value", "expected local_smoke_transcript_only");
  }

  const declaration = record.nonExecutionDeclaration ?? {};
  const requiredFalseDeclaration = [
    "providerRunOccurred",
    "modelCallOccurred",
    "paidOpenAiApiUsed",
    "remoteProviderEndpointUsed",
    "secretsUsed",
    "runtimeApiUiWiringAdded",
    "sourceFilesChangedForRuntime",
    "candidateTruthEvidenceCreated",
    "originEvidenceCreated",
    "modelQualityEvidenceCreated",
    "publicationEvidenceCreated",
    "executionSafetyEvidenceCreated",
  ];

  for (const key of requiredFalseDeclaration) {
    if (declaration[key] !== false) {
      push(errors, `$.nonExecutionDeclaration.${key}`, "expected false");
    }
  }

  return errors;
}

export function validateFiles({ schemaPath = DEFAULT_SCHEMA, fixturePath = DEFAULT_FIXTURE } = {}) {
  const schema = readJson(schemaPath);
  const fixture = readJson(fixturePath);
  return validateControlledLocalProviderEvidenceBoundaryRecord(fixture, schema);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const schemaPath = argValue("--schema", DEFAULT_SCHEMA);
  const fixturePath = argValue("--fixture", DEFAULT_FIXTURE);
  const errors = validateFiles({ schemaPath, fixturePath });

  console.log("Open Instrument controlled local-provider evidence boundary validation v0.1");
  console.log("Boundary: static evidence-boundary validation only.");
  console.log("Boundary: no provider execution, no model call, no OpenAI API use.");
  console.log("Boundary: no remote provider endpoint, no secrets, no runtime/API/UI wiring.");
  console.log("Boundary: candidate-truth/origin/model-quality/publication/execution-safety evidence remains blocked.");

  if (errors.length > 0) {
    console.error("Evidence boundary validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  const fixture = readJson(fixturePath);
  console.log("Boundary summary:");
  console.log(JSON.stringify({
    schemaVersion: fixture.schemaVersion,
    fixtureId: fixture.fixtureId,
    boundaryVersion: fixture.boundaryVersion,
    provider: fixture.providerIdentity?.providerName,
    model: fixture.providerIdentity?.modelName,
    endpointType: fixture.providerIdentity?.endpointType,
    finalDecision: fixture.finalDecision?.value,
    granted: fixture.evidenceBoundary?.evidenceClassesGranted,
    deniedCount: fixture.evidenceBoundary?.evidenceClassesDenied?.length,
    providerExecutionAuthorized: fixture.authorizationGates?.providerExecutionAuthorized,
    runtimeApiUiWiringAuthorized: fixture.authorizationGates?.runtimeApiUiWiringAuthorized,
  }, null, 2));
  console.log("Open Instrument controlled local-provider evidence boundary validation passed.");
}
