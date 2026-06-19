#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");

export const SCHEMA_PATH = path.join(ROOT, "docs/open-instrument/schemas/static-provider-result-import-quarantine/open-instrument-static-provider-result-import-quarantine-schema-v0.1.json");
export const FIXTURE_PATH = path.join(ROOT, "docs/open-instrument/fixtures/static-provider-result-import-quarantine/open-instrument-static-provider-result-import-quarantine-static-fixture-v0.1.json");

const EXPECTED = {
  recordKind: "open_instrument_static_provider_result_import_quarantine",
  schemaVersion: "0.1",
  sourcePr: 1442,
  sourceMergeSha: "0cfc7b6a8520af302f95020638005a2d80c86d15",
  providerName: "ollama",
  modelName: "llama3.1:8b",
  endpointIdentity: "http://127.0.0.1:11434/api/generate",
  localEndpointProofSha256: "6e82b917ab7a55d0b9a9f22e6d02f9ce7a843643a276726722bf6a0ee0a3b033",
  promptSha256: "c423e701b6c9c5868b0fb0d2bae3760aaf39db0c06a89b664293d35a37df347b",
  requestBodySha256: "cf1c5c6662d008f0af78cdbc89936875b6dae6515d74cca9b2fa725c7f53ad37",
  responseSha256: "4ed28de890a82de2106400038b5115ef34a1bf11e6df273f7eac0ed51983ebda",
  executionCount: 1,
  requestCount: 1,
  responseCaptureCount: 1,
  retryCount: 0,
  rerunCount: 0,
  importStatus: "static_import_validated",
  quarantineStatus: "quarantined_candidate_only",
  candidateOnlyStatus: "candidate_only_retained",
  evidencePromotionStatus: "evidence_promotion_blocked",
  publicationStatus: "publication_blocked",
  providerOutputScoringStatus: "provider_output_scoring_blocked",
  candidateRankingStatus: "candidate_ranking_blocked",
  runtimeApiUiWiringStatus: "runtime_api_ui_wiring_blocked",
  secretStatus: "secrets_absent",
};

const EXPECTED_NON_EXECUTION = {
  providerExecutionStatus: "provider_execution_not_authorized",
  modelCallStatus: "model_call_not_authorized",
  paidOpenAiApiStatus: "paid_openai_api_not_authorized",
  remoteEndpointStatus: "remote_endpoint_not_authorized",
  localhostCallStatus: "localhost_call_not_authorized",
  ollamaCallStatus: "ollama_call_not_authorized",
  openAiCompatibleEndpointStatus: "openai_compatible_endpoint_not_authorized",
  retryStatus: "retry_not_authorized",
  rerunStatus: "rerun_not_authorized",
};

const REQUIRED_BLOCKED_EVIDENCE_CLASSES = [
  "provider_output_evidence",
  "parser_compatibility_evidence",
  "reproducibility_evidence",
  "candidate_truth_evidence",
  "origin_evidence",
  "model_quality_evidence",
  "publication_evidence",
  "execution_safety_evidence",
];

const FORBIDDEN_KEYS = new Set([
  "providerOutput",
  "providerOutputText",
  "rawProviderOutput",
  "rawProviderResponse",
  "responseText",
  "rawResponseText",
  "modelOutput",
  "modelOutputText",
  "evidenceGranted",
  "evidencePromoted",
  "originClaim",
  "candidateTruthEvidence",
  "publicationText",
  "rankedCandidate",
  "score",
  "scoreValue",
  "runtimePayload",
  "apiPayload",
  "uiPayload",
  "secret",
  "apiKey",
]);

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function assertEqual(errors, label, actual, expected) {
  if (actual !== expected) {
    errors.push(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertArrayContainsAll(errors, label, actual, expectedValues) {
  if (!Array.isArray(actual)) {
    errors.push(`${label}: expected array`);
    return;
  }

  for (const value of expectedValues) {
    if (!actual.includes(value)) {
      errors.push(`${label}: missing ${value}`);
    }
  }
}

function assertNoForbiddenKeys(errors, value, pointer = "$") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoForbiddenKeys(errors, item, `${pointer}[${index}]`));
    return;
  }

  if (!value || typeof value !== "object") return;

  for (const [key, nested] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key)) {
      errors.push(`${pointer}.${key}: forbidden key`);
    }
    assertNoForbiddenKeys(errors, nested, `${pointer}.${key}`);
  }
}

function validateSchemaShape(schema, fixture, errors) {
  assertEqual(errors, "schema.additionalProperties", schema.additionalProperties, false);

  if (!Array.isArray(schema.required)) {
    errors.push("schema.required: expected array");
    return;
  }

  const fixtureKeys = Object.keys(fixture).sort();
  const requiredKeys = [...schema.required].sort();

  assertEqual(errors, "schema.required length", requiredKeys.length, fixtureKeys.length);

  for (const key of requiredKeys) {
    if (!fixtureKeys.includes(key)) errors.push(`fixture missing required key ${key}`);
  }

  for (const key of fixtureKeys) {
    if (!requiredKeys.includes(key)) errors.push(`fixture has non-schema key ${key}`);
  }
}

export function validateStaticProviderResultImportQuarantine({
  schemaPath = SCHEMA_PATH,
  fixturePath = FIXTURE_PATH,
} = {}) {
  const schema = readJson(schemaPath);
  const fixture = readJson(fixturePath);
  const errors = [];

  validateSchemaShape(schema, fixture, errors);

  for (const [key, expected] of Object.entries(EXPECTED)) {
    assertEqual(errors, key, fixture[key], expected);
  }

  if (!fixture.nonExecutionStatement || typeof fixture.nonExecutionStatement !== "object") {
    errors.push("nonExecutionStatement: expected object");
  } else {
    for (const [key, expected] of Object.entries(EXPECTED_NON_EXECUTION)) {
      assertEqual(errors, `nonExecutionStatement.${key}`, fixture.nonExecutionStatement[key], expected);
    }
  }

  assertArrayContainsAll(errors, "blockedEvidenceClasses", fixture.blockedEvidenceClasses, REQUIRED_BLOCKED_EVIDENCE_CLASSES);
  assertNoForbiddenKeys(errors, fixture);

  const result = {
    status: errors.length === 0 ? "STATIC_PROVIDER_RESULT_IMPORT_QUARANTINE_VALID" : "STATIC_PROVIDER_RESULT_IMPORT_QUARANTINE_INVALID",
    schemaPath: path.relative(ROOT, schemaPath),
    fixturePath: path.relative(ROOT, fixturePath),
    providerName: fixture.providerName,
    modelName: fixture.modelName,
    responseSha256: fixture.responseSha256,
    importStatus: fixture.importStatus,
    quarantineStatus: fixture.quarantineStatus,
    evidencePromotionStatus: fixture.evidencePromotionStatus,
    blockedEvidenceClasses: fixture.blockedEvidenceClasses,
    errors,
  };

  if (errors.length > 0) {
    const error = new Error(result.status);
    error.result = result;
    throw error;
  }

  return result;
}

const isDirectRun = Boolean(process.argv[1]) && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isDirectRun) {
  try {
    console.log(JSON.stringify(validateStaticProviderResultImportQuarantine(), null, 2));
  } catch (error) {
    console.error(JSON.stringify(error.result ?? { status: "STATIC_PROVIDER_RESULT_IMPORT_QUARANTINE_INVALID", errors: [String(error)] }, null, 2));
    process.exit(1);
  }
}
