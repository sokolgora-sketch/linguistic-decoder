# Open Instrument provider execution preflight static fixture schema validation implementation authorization v0.1

## Status

This document is:

- authorization-only
- docs-only
- static fixture schema validation implementation authorization only
- no validation code created by this PR
- no validation tests created by this PR
- no package script wiring by this PR
- no CI workflow wiring by this PR
- no schema mutation by this PR
- no fixture mutation by this PR
- no runtime/API/UI wiring by this PR
- no provider execution
- no model call
- no OpenAI API use
- no provider default change
- no artifact/report creation
- no publication framing
- no runnable JSON created by this PR
- no execution authorization granted by this PR

## Authorization decision

Static fixture schema validation implementation is authorized for one future PR only.

The future PR may implement a local static validator for the provider execution preflight static fixture and schema.

The future PR may not execute providers.

The future PR may not execute models.

The future PR may not use OpenAI APIs.

The future PR may not use network calls.

The future PR may not mutate the fixture.

The future PR may not mutate the schema.

The future PR may not wire runtime/API/UI paths.

The future PR may not create artifacts.

The future PR may not create reports.

The future PR may not create evidence packs.

The future PR may not create publication framing.

## Reviewed authorization boundary

Reviewed boundary design review:

- `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-validation-authorization-boundary-design-review-v0.1.md`
- PR #1332
- title: `docs(open-instrument): review static fixture schema validation authorization boundary design`
- merge SHA: `0cef796d6032de6c06d69517efbf6080f5a43a96`
- short SHA: `0cef796d`

Reviewed boundary design:

- `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-validation-authorization-boundary-design-v0.1.md`
- PR #1331
- title: `docs(open-instrument): design static fixture schema validation authorization boundary`
- merge SHA: `509aa7ce472e811984b8489ec4bf73fc4bb93035`
- short SHA: `509aa7ce`

Reviewed schema review:

- `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-review-v0.1.md`
- PR #1330
- title: `docs(open-instrument): review provider execution preflight static fixture schema`
- merge SHA: `a1f73caa5a909b423241f0758d80ad90a4a596a0`
- short SHA: `a1f73caa`

Accepted static fixture schema:

- `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`
- PR #1329
- title: `docs(open-instrument): create provider execution preflight static fixture schema`
- merge SHA: `f210c5f020bb4793f958f252c6d4e6f90c8b2bce`
- short SHA: `f210c5f0`

Source static fixture:

- `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`
- PR #1325
- title: `docs(open-instrument): create provider execution preflight static JSON fixture`
- merge SHA: `81b8f05b109c31bbab8667e8f3e102529b0aed2f`
- short SHA: `81b8f05b`

## Authorized future changed files

One future implementation PR is authorized to change exactly these paths:

- `scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts`
- `package.json`

No other path is authorized by this document.

The future implementation PR must fail closed if it changes:

- `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`
- `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`
- package-lock.json
- .github/workflows/
- app/
- pages/
- src/
- components/
- lib/
- runtime/API/UI files outside the explicit validator scope

## Authorized future package script

One future implementation PR is authorized to add exactly this package script:

`open-instrument:validate-provider-execution-preflight-static-fixture`

The package script must run only the local static validator.

The package script must not run providers.

The package script must not run models.

The package script must not use OpenAI APIs.

The package script must not use network calls.

The package script must not mutate files.

## Authorized future validator path

One future implementation PR is authorized to create:

`scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`

The validator must be local and static.

The validator must load only:

- `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`
- `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`

The validator must validate the fixture against the schema.

The validator must fail closed.

The validator must print a boundary summary.

The validator must exit non-zero on validation failure.

## Authorized future test paths

One future implementation PR is authorized to create:

- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts`

The tests must be local.

The tests must not require provider keys.

The tests must not require network access.

The tests must not call providers.

The tests must not call models.

The tests must not call OpenAI APIs.

## Required future validator assertions

The future validator must reject:

- missing required top-level fields
- unknown top-level fields
- true providerExecutionAuthorized
- true modelCallAuthorized
- true openAiApiUseAuthorized
- true runtimeApiUiWiringAuthorized
- true artifactReportCreationAuthorized
- true publicationFramingAuthorized
- true fallbackProviderAuthorized
- true fallbackModelAuthorized
- true silentRerunAuthorized
- true hiddenExecutionPathAuthorized
- true providerOutputEvidence
- true candidateTruthEvidence
- true originEvidence
- true modelQualityEvidence
- true publicationEvidence
- true executionSafetyEvidence
- live provider identity drift
- live model identity drift
- live endpoint identity drift
- unsupported finalDecision drift
- schema root drift away from fail-closed additionalProperties
- fixture drift away from provider: fixture
- fixture drift away from model: none
- fixture drift away from endpointType: none

## Required future tests

The future focused test must prove that the validator:

- accepts the checked-in static fixture
- rejects missing required top-level fields
- rejects unknown top-level fields
- rejects true providerExecutionAuthorized
- rejects true modelCallAuthorized
- rejects true openAiApiUseAuthorized
- rejects true runtimeApiUiWiringAuthorized
- rejects true providerOutputEvidence
- rejects true candidateTruthEvidence
- rejects true originEvidence
- rejects true modelQualityEvidence
- rejects true publicationEvidence
- rejects true executionSafetyEvidence
- rejects live provider identity drift
- rejects live model identity drift
- rejects live endpoint identity drift
- rejects unsupported finalDecision drift

The future integration gate test must prove that:

- the checked-in static fixture passes the validator
- the validator remains scoped to fixture/schema validation only
- execution gates fail closed
- evidence gates fail closed
- provider/model/endpoint identity drifts fail closed

## Required future checks

The future implementation PR must run:

- `npm run open-instrument:validate-run-packet-fixture`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts --runInBand`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts --runInBand`
- `npm run open-instrument:validate-provider-execution-preflight-static-fixture`
- `npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts --runInBand`
- `npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts --runInBand`
- `npm run build`
- `npm run gate:quick`
- `git diff --check`

Any failed check fails closed.

Any skipped required check fails closed unless separately reviewed.

## Required future stop conditions

The future implementation PR must stop when:

- repo is dirty before branch creation
- main is not synced
- unexpected non-dependency PR exists
- fixture is missing
- schema is missing
- authorization source is missing
- changed files are not exactly the authorized set
- schema changes
- fixture changes
- package-lock.json changes
- CI workflow changes
- runtime/API/UI files change
- provider execution appears
- model call appears
- OpenAI API use appears
- network call appears
- hidden fallback appears
- silent rerun appears
- default changes appear
- artifact/report creation appears
- publication framing appears
- evidence boundary changes
- required checks fail
- GitHub checks fail
- mergeability fails
- DF_BRAIN is dirty before update

## Explicitly unauthorized future behavior

This authorization does not authorize:

- provider execution
- model calls
- OpenAI API use
- network calls
- Ollama calls
- runtime/API/UI wiring
- schema mutation
- fixture mutation
- package-lock.json mutation
- CI workflow mutation
- artifact creation
- report creation
- evidence pack creation
- publication framing
- provider default changes
- model default changes
- endpoint default changes
- fallback provider behavior
- fallback model behavior
- silent rerun behavior
- hidden execution paths

## Evidence boundary

This authorization is:

- validation implementation authorization evidence only
- not validation implementation evidence
- not provider-output evidence
- not candidate-truth evidence
- not origin evidence
- not model-quality evidence
- not publication evidence
- not execution-safety evidence

A future validator passing must not be interpreted as:

- provider output quality
- candidate truth
- origin proof
- model quality
- publication readiness
- runtime execution safety

It may only prove that the checked-in static fixture conforms to the checked-in static schema.

## Next accepted task

Next accepted action after this authorization lands:

`test(open-instrument): implement static fixture schema validator`

The future implementation must change exactly:

- `scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts`
- `package.json`

It must not change:

- `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`
- `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`
- package-lock.json
- CI workflows
- runtime/API/UI paths

It must not perform provider execution, model calls, OpenAI API use, network calls, artifact/report creation, or publication framing.
