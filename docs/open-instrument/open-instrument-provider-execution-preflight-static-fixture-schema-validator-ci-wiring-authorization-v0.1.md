# Open Instrument provider execution preflight static fixture schema validator CI wiring authorization v0.1

## Status

This document is:

- authorization-only
- docs-only
- CI wiring authorization only
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
- no network call beyond normal local checks
- no provider default change
- no artifact/report creation
- no evidence pack creation
- no publication framing
- no provider-output evidence
- no candidate-truth evidence
- no origin evidence
- no model-quality evidence
- no publication evidence
- no execution-safety evidence

This PR authorizes exactly one future CI-wiring implementation PR.

This PR does not perform that implementation.

## Authorization source

Reviewed CI authorization boundary design:

- `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-validator-ci-authorization-boundary-design-review-v0.1.md`
- PR #1337
- title: `docs(open-instrument): review static fixture schema validator CI authorization boundary design`
- merge SHA: `8bcddca6ddfbb74c0540e33def8b3c5fb2230bf8`
- short SHA: `8bcddca6`

CI authorization boundary design:

- `docs/open-instrument/open-instrument-provider-execution-preflight-static-fixture-schema-validator-ci-authorization-boundary-design-v0.1.md`
- PR #1336
- title: `docs(open-instrument): design static fixture schema validator CI authorization boundary`
- merge SHA: `0c416e1fd1cf0d697381f80597207e8977f4ca3d`
- short SHA: `0c416e1f`

Reviewed validator implementation:

- PR #1335
- title: `docs(open-instrument): review static fixture schema validator implementation`
- merge SHA: `1daf9319385440b7586e9965eef8351163c47de4`
- short SHA: `1daf9319`

Validator implementation:

- PR #1334
- title: `test(open-instrument): implement static fixture schema validator`
- merge SHA: `2e3564dd5f98ce46a8d7895992225127acc87aa4`
- short SHA: `2e3564dd`

## Authorized future PR

Exactly one future implementation PR is authorized.

Future PR title:

`ci(open-instrument): wire static fixture schema validator gate`

Future branch:

`ci/open-instrument-static-fixture-schema-validator-gate`

Future PR purpose:

- wire the existing local static fixture/schema validator into CI
- wire only the focused validator checks approved below
- keep provider/model/OpenAI/runtime/API/UI execution blocked

This authorization expires after one future implementation PR.

## Authorized future workflow path

The future implementation PR may modify exactly this workflow file:

`.github/workflows/ci.yml`

No other workflow file is authorized.

No new workflow file is authorized.

No package file is authorized.

No validator file is authorized.

No test file is authorized.

No schema file is authorized.

No fixture file is authorized.

No runtime/API/UI file is authorized.

## Authorized future command set

The future implementation PR may add these exact commands to CI:

`npm run open-instrument:validate-provider-execution-preflight-static-fixture`

`npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts --runInBand`

`npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts --runInBand`

No other Open Instrument validator command is authorized.

No provider command is authorized.

No model command is authorized.

No OpenAI command is authorized.

No network command is authorized beyond normal repository checkout/install/test behavior.

## Authorized future changed files

The future implementation PR may change exactly:

- `.github/workflows/ci.yml`

No other changed file is authorized.

## Explicitly forbidden future changed files

The future implementation PR must not change:

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
- any docs file except the future PR body if GitHub stores it externally

## Future implementation required local checks

Before opening the future PR, run:

- `npm run open-instrument:validate-provider-execution-preflight-static-fixture`
- `npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts --runInBand`
- `npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts --runInBand`
- `npm run open-instrument:validate-run-packet-fixture`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts --runInBand`
- `npx jest -c jest.config.mjs tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts --runInBand`
- `npm run build`
- `npm run gate:quick`
- `git diff --check`

## Future implementation required PR checks

The future PR must wait for GitHub checks until stable clean state.

Required PR state before merge:

- mergeable
- all required checks completed successfully
- at least two stable clean snapshots
- PR diff contains only `.github/workflows/ci.yml`

## Future CI fail-closed requirement

The future CI gate must fail if:

- `npm run open-instrument:validate-provider-execution-preflight-static-fixture` fails
- `npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidation.v0.1.spec.ts --runInBand` fails
- `npx jest -c jest.config.mjs tests/openInstrument.providerExecutionPreflightStaticFixtureSchemaValidationIntegrationGate.v0.1.spec.ts --runInBand` fails
- schema file is missing
- fixture file is missing
- validator file is missing
- package script is missing
- package script drifts from `node scripts/openInstrumentProviderExecutionPreflightStaticFixtureSchemaValidation.v0.1.mjs`
- fixture drifts toward live provider identity
- fixture drifts toward live model identity
- fixture drifts toward live endpoint identity
- any execution authorization gate drifts true
- any evidence boundary gate drifts true

## Future implementation forbidden behavior

The future implementation PR must not:

- call providers
- call models
- use OpenAI APIs
- use Ollama
- use provider endpoints
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

## Evidence boundary

Future CI passing must not be interpreted as:

- provider-output evidence
- candidate-truth evidence
- origin evidence
- model-quality evidence
- publication evidence
- execution-safety evidence
- runtime readiness
- provider readiness
- model readiness

Future CI passing may only prove:

- the checked-in static fixture still conforms to the checked-in static schema
- the local static validator still passes
- the focused validator tests still pass
- the integration gate still passes

## Future merge requirements

The future implementation PR may merge only if:

- changed-file guard is exactly `.github/workflows/ci.yml`
- local checks pass
- GitHub checks pass
- mergeability is stable
- no provider/model/OpenAI/runtime/API/UI path is added
- no schema/fixture/validator/test/package path is changed
- main sync after merge is clean
- divergence is `0 0`
- remaining open PR list is reviewed

## Final authorization decision

The future CI-wiring implementation PR is authorized with the exact limits above.

This authorization does not authorize CI wiring in this PR.

This authorization does not authorize any provider execution.

This authorization does not authorize any model call.

This authorization does not authorize any OpenAI API use.

This authorization does not authorize runtime/API/UI wiring.

## Next accepted task

Next accepted action after this authorization lands:

`ci(open-instrument): wire static fixture schema validator gate`

The future task must change only:

`.github/workflows/ci.yml`
