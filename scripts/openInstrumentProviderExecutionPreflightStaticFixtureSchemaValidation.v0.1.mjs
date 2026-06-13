#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_FIXTURE_PATH =
  "docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json";

const DEFAULT_SCHEMA_PATH =
  "docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json";

const FIXTURE_PATH =
  process.env.OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_STATIC_FIXTURE_PATH || DEFAULT_FIXTURE_PATH;

const SCHEMA_PATH =
  process.env.OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_STATIC_SCHEMA_PATH || DEFAULT_SCHEMA_PATH;

const BOUNDARY_LINES = [
  "Open Instrument provider execution preflight static fixture schema validation v0.1",
  "Boundary: local static fixture/schema validation only.",
  "Boundary: no model call, no provider execution, no OpenAI API use.",
  "Boundary: no network call, no provider default change, no runtime/API/UI wiring.",
  "Boundary: no fixture mutation, no schema mutation, no artifact/report creation.",
  "Boundary: not provider-output, candidate-truth, origin, model-quality, publication, or execution-safety evidence."
];

function readJson(filePath) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return JSON.parse(fs.readFileSync(absolutePath, "utf8"));
}

function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function resolveRef(rootSchema, ref) {
  if (!ref.startsWith("#/")) {
    throw new Error(`Unsupported schema ref: ${ref}`);
  }

  return ref
    .slice(2)
    .split("/")
    .reduce((node, segment) => {
      if (!node || !Object.prototype.hasOwnProperty.call(node, segment)) {
        throw new Error(`Unresolved schema ref: ${ref}`);
      }
      return node[segment];
    }, rootSchema);
}

function validateNode(schemaNode, value, location, rootSchema, errors) {
  if (!schemaNode || typeof schemaNode !== "object") {
    errors.push(`${location}: invalid schema node`);
    return;
  }

  if (schemaNode.$ref) {
    validateNode(resolveRef(rootSchema, schemaNode.$ref), value, location, rootSchema, errors);
    return;
  }

  if (Object.prototype.hasOwnProperty.call(schemaNode, "const") && !deepEqual(value, schemaNode.const)) {
    errors.push(`${location}: expected const ${JSON.stringify(schemaNode.const)}, received ${JSON.stringify(value)}`);
    return;
  }

  if (schemaNode.enum && !schemaNode.enum.some((candidate) => deepEqual(candidate, value))) {
    errors.push(`${location}: expected one of ${JSON.stringify(schemaNode.enum)}, received ${JSON.stringify(value)}`);
    return;
  }

  if (schemaNode.type === "object") {
    if (!isPlainObject(value)) {
      errors.push(`${location}: expected object`);
      return;
    }

    const required = Array.isArray(schemaNode.required) ? schemaNode.required : [];
    for (const key of required) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        errors.push(`${location}.${key}: missing required field`);
      }
    }

    const properties = schemaNode.properties || {};
    if (schemaNode.additionalProperties === false) {
      for (const key of Object.keys(value)) {
        if (!Object.prototype.hasOwnProperty.call(properties, key)) {
          errors.push(`${location}.${key}: unknown field`);
        }
      }
    }

    for (const [key, childSchema] of Object.entries(properties)) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        validateNode(childSchema, value[key], `${location}.${key}`, rootSchema, errors);
      }
    }

    return;
  }

  if (schemaNode.type === "array") {
    if (!Array.isArray(value)) {
      errors.push(`${location}: expected array`);
      return;
    }

    if (typeof schemaNode.minItems === "number" && value.length < schemaNode.minItems) {
      errors.push(`${location}: expected at least ${schemaNode.minItems} items`);
    }

    if (schemaNode.items) {
      value.forEach((item, index) => {
        validateNode(schemaNode.items, item, `${location}[${index}]`, rootSchema, errors);
      });
    }

    return;
  }

  if (schemaNode.type === "string") {
    if (typeof value !== "string") {
      errors.push(`${location}: expected string`);
      return;
    }

    if (typeof schemaNode.minLength === "number" && value.length < schemaNode.minLength) {
      errors.push(`${location}: expected string length >= ${schemaNode.minLength}`);
    }

    if (schemaNode.pattern) {
      const re = new RegExp(schemaNode.pattern);
      if (!re.test(value)) {
        errors.push(`${location}: string does not match pattern ${schemaNode.pattern}`);
      }
    }

    return;
  }

  if (schemaNode.type === "integer") {
    if (!Number.isInteger(value)) {
      errors.push(`${location}: expected integer`);
      return;
    }

    if (typeof schemaNode.minimum === "number" && value < schemaNode.minimum) {
      errors.push(`${location}: expected integer >= ${schemaNode.minimum}`);
    }
  }
}

function enforceBoundaryInvariants(schema, fixture, errors) {
  if (schema.type !== "object") {
    errors.push("schema.type: schema root must remain object");
  }

  if (schema.additionalProperties !== false) {
    errors.push("schema.additionalProperties: schema root must remain fail-closed false");
  }

  const expectedIdentity = [
    ["providerIdentity.provider", fixture.providerIdentity?.provider, "fixture"],
    ["modelIdentity.model", fixture.modelIdentity?.model, "none"],
    ["endpointIdentity.endpointType", fixture.endpointIdentity?.endpointType, "none"]
  ];

  for (const [field, actual, expected] of expectedIdentity) {
    if (actual !== expected) {
      errors.push(`${field}: expected ${expected}, received ${actual}`);
    }
  }

  const falseAuthorizationGates = [
    "providerExecutionAuthorized",
    "modelCallAuthorized",
    "openAiApiUseAuthorized",
    "runtimeApiUiWiringAuthorized",
    "artifactReportCreationAuthorized",
    "publicationFramingAuthorized",
    "fallbackProviderAuthorized",
    "fallbackModelAuthorized",
    "silentRerunAuthorized",
    "hiddenExecutionPathAuthorized"
  ];

  for (const key of falseAuthorizationGates) {
    if (schema.properties?.authorizationGates?.properties?.[key]?.const !== false) {
      errors.push(`schema.authorizationGates.${key}: schema must require false`);
    }
    if (fixture.authorizationGates?.[key] !== false) {
      errors.push(`fixture.authorizationGates.${key}: expected false`);
    }
  }

  const falseEvidenceGates = [
    "providerOutputEvidence",
    "candidateTruthEvidence",
    "originEvidence",
    "modelQualityEvidence",
    "publicationEvidence",
    "executionSafetyEvidence"
  ];

  for (const key of falseEvidenceGates) {
    if (schema.properties?.evidenceBoundaryStatus?.properties?.[key]?.const !== false) {
      errors.push(`schema.evidenceBoundaryStatus.${key}: schema must require false`);
    }
    if (fixture.evidenceBoundaryStatus?.[key] !== false) {
      errors.push(`fixture.evidenceBoundaryStatus.${key}: expected false`);
    }
  }

  const finalDecisionEnum = schema.properties?.finalDecision?.properties?.value?.enum;
  if (!Array.isArray(finalDecisionEnum)) {
    errors.push("schema.finalDecision.value.enum: missing enum");
  } else {
    for (const requiredValue of ["blocked_static_fixture_only", "static_fixture_ready_for_schema_authorization_review"]) {
      if (!finalDecisionEnum.includes(requiredValue)) {
        errors.push(`schema.finalDecision.value.enum: missing ${requiredValue}`);
      }
    }
  }
}

function validateFixtureAgainstSchema(fixture, schema) {
  const errors = [];
  validateNode(schema, fixture, "$", schema, errors);
  enforceBoundaryInvariants(schema, fixture, errors);
  return errors;
}

function main() {
  for (const line of BOUNDARY_LINES) {
    console.log(line);
  }

  const schema = readJson(SCHEMA_PATH);
  const fixture = readJson(FIXTURE_PATH);
  const errors = validateFixtureAgainstSchema(fixture, schema);

  console.log("Fixture summary:");
  console.log(
    JSON.stringify(
      {
        fixturePath: FIXTURE_PATH,
        schemaPath: SCHEMA_PATH,
        schemaVersion: fixture.schemaVersion,
        fixtureId: fixture.fixtureIdentity?.fixtureId,
        provider: fixture.providerIdentity?.provider,
        model: fixture.modelIdentity?.model,
        endpointType: fixture.endpointIdentity?.endpointType,
        finalDecision: fixture.finalDecision?.value,
        providerExecutionAuthorized: fixture.authorizationGates?.providerExecutionAuthorized,
        modelCallAuthorized: fixture.authorizationGates?.modelCallAuthorized,
        openAiApiUseAuthorized: fixture.authorizationGates?.openAiApiUseAuthorized,
        runtimeApiUiWiringAuthorized: fixture.authorizationGates?.runtimeApiUiWiringAuthorized
      },
      null,
      2
    )
  );

  if (errors.length > 0) {
    console.error("Static fixture schema validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("Open Instrument provider execution preflight static fixture schema validation passed.");
}

main();
