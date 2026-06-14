# Open Instrument provider execution preflight mapping coverage audit CI wiring authorization v0.1

Status: accepted

Scope: authorization only

Lane: Open Instrument provider execution preflight safety infrastructure

## Authorization decision

This document authorizes exactly one future CI wiring PR for the provider execution preflight mapping coverage audit.

Authorized future PR title:

- ci(open-instrument): wire provider execution preflight mapping coverage audit gate

This authorization does not wire CI.

This authorization does not edit workflow files.

This authorization does not authorize provider execution.

This authorization does not authorize model calls.

This authorization does not authorize OpenAI API use.

This authorization does not authorize network access.

This authorization does not authorize runtime, API, or UI wiring.

This authorization does not authorize provider default mutation.

This authorization does not authorize fixture mutation.

This authorization does not authorize schema mutation.

This authorization does not authorize artifact upload, report generation, evidence-pack creation, or publication framing.

## Reviewed prerequisites

Accepted implementation PR:

- PR #1343
- title: test(open-instrument): implement provider execution preflight mapping coverage audit
- merge short SHA: 0ebe8ef3

Accepted implementation review PR:

- PR #1344
- title: docs(open-instrument): review provider execution preflight mapping coverage audit implementation
- merge short SHA: 26e1a7bc

Accepted CI authorization boundary design PR:

- PR #1345
- title: docs(open-instrument): design provider execution preflight mapping coverage audit CI authorization boundary
- merge short SHA: e2cf9273

Accepted CI authorization boundary design review PR:

- PR #1346
- title: docs(open-instrument): review provider execution preflight mapping coverage audit CI authorization boundary design
- merge short SHA: 8198fbe8

## Authorized future changed-file scope

The future CI wiring PR may change only:

- .github/workflows/ci.yml

No other file is authorized.

The future CI wiring PR must stop if any of these files change:

- package.json
- package-lock.json
- scripts/openInstrumentProviderExecutionPreflightMappingCoverageAudit.v0.1.mjs
- tests/openInstrument.providerExecutionPreflightMappingCoverageAudit.v0.1.spec.ts
- docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json
- docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json
- any runtime source file
- any API route file
- any UI component file
- any artifact, report, evidence-pack, or publication file

## Authorized future command

The future CI wiring PR may add exactly this command to CI:

- npm run open-instrument:audit-provider-execution-preflight-mapping-coverage

The command currently resolves to:

- node scripts/openInstrumentProviderExecutionPreflightMappingCoverageAudit.v0.1.mjs

No other mapping coverage audit command is authorized.

No direct node command is authorized in the workflow if it bypasses the package script.

## Required future workflow placement

The future CI wiring must place the mapping coverage audit gate with the static Open Instrument validation gates.

The future CI wiring must run after checkout and dependency installation.

The future CI wiring must run before any step that could be mistaken for provider execution readiness.

The future CI wiring must not be grouped with runtime smoke tests.

The future CI wiring must not be grouped with provider execution tests.

The future CI wiring must not be grouped with model-output checks.

## Required future CI behavior

The future CI gate must fail the PR if the mapping coverage audit fails.

The future CI gate must not use continue-on-error.

The future CI gate must not convert failures to warnings.

The future CI gate must not retry with altered inputs.

The future CI gate must not use provider fallback.

The future CI gate must not use model fallback.

The future CI gate must not use endpoint fallback.

The future CI gate must not use fixture fallback.

The future CI gate must not use schema fallback.

The future CI gate must not use command fallback.

## Required future environment policy

The future CI wiring must run against checked-in repository files only.

The future CI wiring must not pass environment path overrides.

The future CI wiring must not set any of these variables:

- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_MAPPING_DESIGN_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_MAPPING_REVIEW_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_AUDIT_DESIGN_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_AUDIT_REVIEW_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_CHECKLIST_CONTRACT_DESIGN_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_CHECKLIST_CONTRACT_REVIEW_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_FIXTURE_PATH

These overrides remain local-test only.

They are not CI wiring inputs.

## Required future security boundary

The future CI wiring must not add:

- secrets
- provider credentials
- network endpoints
- curl commands
- fetch commands
- OpenAI SDK invocation
- provider SDK invocation
- runtime paths
- API paths
- UI paths
- artifact uploads
- report uploads
- evidence-pack uploads
- workflow dispatch inputs for provider execution
- provider matrices
- model matrices
- provider default mutation
- automatic rerun behavior

## Required future proof before merge

The future CI wiring PR must prove:

- changed files are exactly .github/workflows/ci.yml
- the workflow command is exactly npm run open-instrument:audit-provider-execution-preflight-mapping-coverage
- no environment path override is used
- no secret is referenced
- no provider credential is referenced
- no OpenAI API endpoint is referenced
- no provider or model matrix is added
- no artifact, report, or evidence-pack upload is added
- no continue-on-error is added
- static fixture schema validation remains wired
- run packet validation remains unaffected
- build passes
- gate passes
- GitHub checks pass before merge

## Evidence boundary

A future passing CI gate would mean only that the checked-in mapping coverage audit passed.

A future passing CI gate would not mean:

- provider execution is safe
- provider execution is authorized
- model calls are authorized
- OpenAI API use is authorized
- model output is correct
- provider output exists
- provider output is valid
- origin evidence exists
- candidate-truth evidence exists
- model-quality evidence exists
- publication evidence exists
- execution-safety evidence exists

## Stop conditions

The future CI wiring PR must stop if:

- any file other than .github/workflows/ci.yml changes
- package metadata changes
- helper code changes
- focused tests change
- fixtures change
- schemas change
- CI uses a command other than the package script
- CI uses environment path overrides
- CI uses secrets
- CI adds network access
- CI references provider, model, OpenAI, or API endpoints
- CI adds runtime, API, or UI wiring
- CI adds artifact, report, or evidence-pack upload
- CI adds continue-on-error
- CI adds provider or model matrices
- CI creates a new provider execution path
- CI creates a publication or evidence path

## Local check review

Before this authorization document was created, the existing mapping coverage audit was run:

- npm run open-instrument:audit-provider-execution-preflight-mapping-coverage

The focused mapping coverage audit Jest test was run:

- npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightMappingCoverageAudit.v0.1.spec.ts --runInBand

The authorization PR must also pass build and gate before merge.

## Next accepted task

The next accepted task after this authorization lands is:

- ci(open-instrument): wire provider execution preflight mapping coverage audit gate

That future task may change only .github/workflows/ci.yml.

That future task must preserve every boundary in this authorization.
