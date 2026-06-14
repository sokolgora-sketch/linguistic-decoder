# Open Instrument provider execution preflight mapping coverage audit CI authorization boundary design v0.1

## Status

This document is:

- design-only
- docs-only
- CI authorization boundary design only
- not CI wiring
- not implementation
- not provider execution
- not model execution
- not OpenAI API use
- not network access
- not runtime/API/UI wiring
- not provider default mutation
- not fixture mutation
- not schema mutation
- not artifact creation
- not report creation
- not evidence-pack creation
- not publication framing
- not provider-output evidence
- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not publication evidence
- not execution-safety evidence

## Purpose

This document designs the authorization boundary for a future CI wiring PR that may run the existing local deterministic provider execution preflight mapping coverage audit in CI.

It does not wire CI.

It does not edit workflow files.

It does not edit package metadata.

It does not edit the helper.

It does not edit tests.

It does not authorize provider execution.

## Reviewed current implementation

Current accepted implementation:

- helper: scripts/openInstrumentProviderExecutionPreflightMappingCoverageAudit.v0.1.mjs
- focused test: tests/openInstrument.providerExecutionPreflightMappingCoverageAudit.v0.1.spec.ts
- package script: open-instrument:audit-provider-execution-preflight-mapping-coverage

Current accepted implementation PR:

- PR #1343
- title: test(open-instrument): implement provider execution preflight mapping coverage audit
- merge short SHA: 0ebe8ef3

Current accepted implementation review PR:

- PR #1344
- title: docs(open-instrument): review provider execution preflight mapping coverage audit implementation
- merge short SHA: 26e1a7bc
- review doc: docs/open-instrument/open-instrument-provider-execution-preflight-mapping-coverage-audit-implementation-review-v0.1.md

## Existing local command eligible for future CI consideration

The only command eligible for future CI consideration is:

npm run open-instrument:audit-provider-execution-preflight-mapping-coverage

The command resolves to:

node scripts/openInstrumentProviderExecutionPreflightMappingCoverageAudit.v0.1.mjs

No other command is authorized by this design.

## Future CI wiring scope

A future CI wiring PR may add the mapping coverage audit command to the existing CI workflow only if the review of this design accepts the boundary.

The future CI wiring PR may change only:

- .github/workflows/ci.yml

If package metadata must change, this design is not enough.

If helper behavior must change, this design is not enough.

If tests must change, this design is not enough.

If any non-CI file must change, a separate implementation or authorization lane is required.

## Required future CI placement

The future CI gate should run after repository checkout and dependency installation.

The future CI gate should run before any step that could be mistaken for provider execution readiness.

The future CI gate should be grouped with static Open Instrument validation gates.

The future CI gate should not be grouped with runtime smoke tests.

The future CI gate should not be grouped with provider execution tests.

The future CI gate should not be grouped with model-output checks.

## Future CI command

The future CI step should run exactly:

npm run open-instrument:audit-provider-execution-preflight-mapping-coverage

The future CI step should not pass environment path overrides.

The future CI step should use checked-in repository files only.

The future CI step should not read secrets.

The future CI step should not use tokens other than standard repository checkout permissions.

The future CI step should not call external services.

## Explicit non-authorizations

This design does not authorize:

- provider execution
- model calls
- OpenAI API use
- Ollama calls
- network calls
- runtime route wiring
- API route wiring
- UI wiring
- provider default mutation
- model default mutation
- fixture mutation
- schema mutation
- prompt mutation
- artifact creation
- report creation
- evidence pack creation
- publication framing
- fallback provider use
- fallback model use
- silent reruns
- hidden execution paths
- runnable JSON creation
- provider output validation
- provider quality claims
- origin claims
- candidate-truth claims
- execution-safety claims

## Future workflow guardrails

The future CI wiring PR must preserve these guardrails:

- no secrets added
- no provider credentials added
- no network endpoint added
- no curl command added
- no fetch command added
- no OpenAI SDK invocation added
- no provider SDK invocation added
- no runtime/API/UI path added
- no artifact upload added for this audit
- no evidence pack upload added for this audit
- no workflow dispatch input for provider execution added
- no matrix expansion over providers added
- no model matrix added
- no provider default mutation added
- no auto-rerun behavior added

## Failure behavior

The future CI gate must fail the PR if the mapping coverage audit fails.

The future CI gate must not attempt recovery.

The future CI gate must not retry with altered inputs.

The future CI gate must not fall back to another provider, model, endpoint, fixture, schema, or command.

The future CI gate must not convert failure into warning.

The future CI gate must not allow continue-on-error.

## Environment policy

The future CI gate must not set these environment overrides:

- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_MAPPING_DESIGN_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_MAPPING_REVIEW_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_AUDIT_DESIGN_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_AUDIT_REVIEW_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_CHECKLIST_CONTRACT_DESIGN_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_CHECKLIST_CONTRACT_REVIEW_PATH
- OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_FIXTURE_PATH

Those overrides are accepted for focused local tests only.

They are not accepted for CI wiring.

CI must run against checked-in repository paths.

## Evidence boundary

A passing future CI gate would mean only:

- the checked-in mapping coverage audit passed
- required docs/fixture/checklist mapping coverage remained present
- required fail-closed markers remained present
- known unsafe authorization/evidence language was not detected by the audit

A passing future CI gate would not mean:

- provider execution is safe
- model output is correct
- OpenAI API use is authorized
- provider output exists
- provider output is valid
- origin evidence exists
- candidate-truth evidence exists
- model-quality evidence exists
- publication evidence exists
- execution-safety evidence exists
- a provider run is authorized

## Future CI review requirements

The future CI wiring PR must prove:

- changed files are limited to the CI workflow file
- the command is exactly npm run open-instrument:audit-provider-execution-preflight-mapping-coverage
- no secrets are referenced
- no provider/model/OpenAI/API endpoint is referenced
- no runtime/API/UI path is referenced
- no artifact upload is added
- no continue-on-error is added
- no environment path override is added
- existing static fixture schema validation remains wired
- existing run packet validation remains unaffected
- build and gate pass
- GitHub checks pass before merge

## Stop conditions

The future CI wiring PR must stop if any of these happen:

- any non-workflow file changes
- package metadata changes
- helper code changes
- focused test changes
- fixture changes
- schema changes
- docs claim provider execution authorization
- CI adds secret usage
- CI adds network access
- CI adds provider/model/OpenAI/API reference
- CI adds runtime/API/UI wiring
- CI adds artifact/report/evidence-pack upload
- CI adds continue-on-error
- CI uses environment path overrides
- CI uses a command other than the package script
- CI creates a new execution path
- CI creates a new publication or evidence path

## Review decision requested

The requested review decision for the next PR is:

- accept or reject this CI authorization boundary design

The next PR must not wire CI.

The next PR must remain docs-only.

## Next accepted action

If this design is accepted, the next accepted action is:

docs(open-instrument): review provider execution preflight mapping coverage audit CI authorization boundary design

Only after that review lands may a separate authorization PR authorize CI wiring.

This design alone does not authorize CI wiring.
