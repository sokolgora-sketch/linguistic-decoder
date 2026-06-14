# Open Instrument provider execution preflight static fixture schema validator CI authorization boundary design v0.1

## Status

This document is:

- design-only
- docs-only
- CI authorization boundary design only
- no CI workflow wiring by this PR
- no GitHub Actions workflow changes by this PR
- no validator code changes by this PR
- no validation test changes by this PR
- no package script changes by this PR
- no package-lock changes by this PR
- no schema mutation by this PR
- no fixture mutation by this PR
- no runtime/API/UI wiring by this PR
- no provider execution
- no model call
- no OpenAI API use
- no network call beyond normal repository checkout/install/test behavior in future CI
- no provider default change
- no artifact/report creation
- no evidence pack creation
- no publication framing
- no execution authorization granted by this PR

## Purpose

The local static fixture/schema validator now exists and has been reviewed.

The next safety question is whether this local validator may later be wired into CI.

This document designs the CI authorization boundary only.

This document does not wire CI.

This document does not edit workflows.

This document does not edit package files.

This document does not edit the validator.

This document does not edit tests.

This document does not edit the schema.

This document does not edit the fixture.

This document does not authorize provider execution.

This document does not authorize model calls.

This document does not authorize OpenAI API use.

## Source chain

Reviewed validator implementation:

- PR #1335
- title: `docs(open-instrument): review static fixture schema validator implementation`
- merge SHA: `1daf9319385440b7586e9965eef8351163c47de4`
- short SHA: `1daf9319`
- review doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-validator-implementation-review-v0.1.md`

Implemented validator:

- PR #1334
- title: `test(open-instrument): implement static fixture schema validator`
- merge SHA: `2e3564dd5f98ce46a8d7895992225127acc87aa4`
- short SHA: `2e3564dd`
- validator: `scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
- focused test: `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts`
- integration gate: `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts`
- package script: `open-instrument:validate-provider-execution-preflight-static-fixture`

Implementation authorization:

- PR #1333
- title: `docs(open-instrument): authorize static fixture schema validation implementation`
- merge SHA: `20d7e756598c535a24bedff97bf8a8c4eac85edb`
- short SHA: `20d7e756`
- authorization doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-validation-implementation-authorization-v0.1.md`

Validation authorization boundary review:

- PR #1332
- title: `docs(open-instrument): review static fixture schema validation authorization boundary design`
- merge SHA: `0cef796d6032de6c06d69517efbf6080f5a43a96`
- short SHA: `0cef796d`
- review doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-validation-authorization-boundary-design-review-v0.1.md`

Validation authorization boundary design:

- PR #1331
- title: `docs(open-instrument): design static fixture schema validation authorization boundary`
- merge SHA: `509aa7ce472e811984b8489ec4bf73fc4bb93035`
- short SHA: `509aa7ce`
- design doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-validation-authorization-boundary-design-v0.1.md`

Reviewed static fixture schema:

- PR #1330
- title: `docs(open-instrument): review provider execution preflight static fixture schema`
- merge SHA: `a1f73caa5a909b423241f0758d80ad90a4a596a0`
- short SHA: `a1f73caa`
- review doc: `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-review-v0.1.md`

Static fixture schema:

- `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`

Static fixture:

- `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`

## Existing validator reviewed

The existing validator is:

`scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`

The existing package script is:

`open-instrument:validate-provider-execution-preflight-static-fixture`

The existing focused test is:

`tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts`

The existing integration gate is:

`tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts`

The validator is local static schema/fixture validation only.

The validator is not provider execution.

The validator is not model execution.

The validator is not OpenAI API use.

The validator is not network execution.

The validator is not runtime/API/UI wiring.

The validator is not artifact/report creation.

The validator is not publication framing.

## Future CI authorization scope

A future CI authorization may allow CI to run exactly these commands:

- `npm run open-instrument:validate-provider-execution-preflight-static-fixture`
- `npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts --runInBand`
- `npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts --runInBand`

This design does not wire those commands into CI.

This design does not authorize workflow changes by itself.

## Future CI allowed file boundary

A future CI-wiring authorization may allow one of the following options, but only after separate review and explicit authorization:

- exactly one new workflow file under `.github/workflows/`
- or exactly one existing workflow file edit under `.github/workflows/`

This design does not authorize either option by itself.

The future CI-wiring PR must define the exact workflow path before implementation.

## Future CI forbidden changes

A future CI-wiring PR must not change:

- `scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts`
- `tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts`
- `package.json`
- `package-lock.json`
- `docs/open-instrument/schemas/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-schema-v0.1.json`
- `docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json`
- app/
- pages/
- src/
- components/
- lib/

A future CI-wiring PR must not add runtime/API/UI behavior.

A future CI-wiring PR must not mutate fixtures.

A future CI-wiring PR must not mutate schemas.

A future CI-wiring PR must not mutate validator logic.

A future CI-wiring PR must not mutate tests.

A future CI-wiring PR must not mutate package scripts.

## Future CI forbidden behavior

Future CI wiring must not:

- call providers
- call models
- use OpenAI APIs
- use Ollama
- use provider endpoints
- use network calls beyond normal repository checkout/install/test behavior
- create artifacts
- create reports
- create evidence packs
- publish outputs
- change provider defaults
- change model defaults
- change endpoint defaults
- introduce fallback provider behavior
- introduce fallback model behavior
- introduce silent rerun behavior
- introduce hidden execution paths
- wire runtime/API/UI paths
- claim candidate truth
- claim origin truth
- claim model quality
- claim publication readiness
- claim execution safety

## Future CI fail-closed requirements

Future CI must fail closed if:

- static fixture validation fails
- focused validator tests fail
- integration gate tests fail
- schema file is missing
- fixture file is missing
- validator file is missing
- package script is missing
- package script drifts from `node scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
- schema root no longer has `additionalProperties: false`
- fixture drifts toward live provider identity
- fixture drifts toward live model identity
- fixture drifts toward live endpoint identity
- any execution authorization gate drifts true
- any evidence boundary gate drifts true
- provider execution appears
- model call appears
- OpenAI API use appears
- runtime/API/UI wiring appears
- artifact/report creation appears
- publication framing appears

## Future CI acceptable infrastructure behavior

A future CI workflow may use normal repository CI infrastructure:

- checkout
- dependency install
- node setup
- package script execution
- focused Jest execution

This infrastructure behavior must remain limited to validation and tests.

It must not introduce provider/model/OpenAI/network execution.

It must not create or upload artifacts unless separately authorized.

## Evidence boundary

CI passing must not be interpreted as:

- provider-output evidence
- candidate-truth evidence
- origin evidence
- model-quality evidence
- publication evidence
- execution-safety evidence
- runtime readiness
- provider readiness
- model readiness

CI passing may only prove:

- the checked-in static fixture still conforms to the checked-in static schema
- the local static validator still passes
- the focused validator tests still pass
- the integration gate still passes

## Stop conditions for future CI-wiring authorization

A future CI-wiring authorization must stop if:

- target workflow path is ambiguous
- CI command set is broader than the three approved commands
- package script drift is detected
- validator drift is detected
- test drift is detected
- schema drift is detected
- fixture drift is detected
- provider execution is proposed
- model call is proposed
- OpenAI API use is proposed
- runtime/API/UI wiring is proposed
- artifact/report creation is proposed
- publication framing is proposed
- candidate-truth framing is proposed
- origin framing is proposed
- model-quality framing is proposed
- execution-safety framing is proposed

## Review requirements for this design

A future review PR must confirm:

- this design is docs-only
- this design is design-only
- no CI workflow was changed
- no validator code was changed
- no tests were changed
- no package files were changed
- no schema was changed
- no fixture was changed
- no runtime/API/UI files were changed
- no provider execution occurred
- no model call occurred
- no OpenAI API use occurred
- no network call occurred beyond normal local checks
- CI wiring remains blocked pending explicit authorization

## Final design conclusion

The static fixture schema validator may be a candidate for future CI wiring.

CI wiring remains blocked.

A later review must accept this boundary design.

A later authorization must explicitly approve the exact workflow path and exact command set before any CI workflow is changed.

## Next accepted task

Next accepted action after this design lands:

`docs(open-instrument): review static fixture schema validator CI authorization boundary design`
