# Open Instrument Run Packet Fixture Validation CI Guard Design v0.1

## Status

This is a design-only document.

This document does not implement CI wiring.

This PR does not change package.json, package-lock.json, GitHub Actions workflows, validation script, integration gate test, validation helper, helper test, fixture JSON, source schema, prompt contracts, runtime code, API routes, UI, provider defaults, artifact creation, report creation, model execution, provider execution, OpenAI API use, rerun behavior, or publication framing.

No model call is authorized.

No rerun is authorized.

No provider execution is authorized.

No runtime/API/UI wiring is authorized.

No OpenAI API use is authorized.

No provider default change is authorized.

No CI implementation is authorized in this PR.

## Reviewed source chain

Package script review:

- PR #1300 / `88440edba3a97d495f160a8f46a1fb66f2cb6191`
- review doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-package-script-review-v0.1.md`
- accepted next action: `docs(open-instrument): design run packet fixture validation CI guard`

Package script implementation:

- PR #1299 / `54d6e456decabe928b2836d87c918c29dc6fbc9b`
- changed file: `package.json`
- package script: `open-instrument:validate-run-packet-fixture`
- command: `node scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs`

Validation script review:

- PR #1298 / `fe4b100c0f87c4578f96fd224092d87969b02175`
- review doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-script-review-v0.1.md`

Validation script implementation:

- PR #1297 / `b5791915745057fd90fa3a39b6953da79f4a9b8b`
- validation script: `scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs`

Integration gate review:

- PR #1296 / `b3022db9f21fe480f341211a5907226fd49f3e01`
- review doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-integration-gate-review-v0.1.md`

Integration gate implementation:

- PR #1295 / `a46893a9e4700063c838afbe20a61ea145bef116`
- gate test: `tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts`

Validation helper implementation:

- PR #1291 / `aa76e21a47215689de6553ca02630db3666d4c7a`
- helper: `src/shared/openInstrument/runPacketFixtureValidation.v0.1.ts`
- helper test: `tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts`
- exported helper: `validateRunPacketFixtureV0_1`

Static fixture:

- PR #1287 / `e72d4ca7a8cc0bc6f066862558363187b60df0bc`
- fixture: `docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json`

Accepted Open Instrument loop:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure

This design evaluates only a future CI guard around the already accepted package script.

## Design purpose

The purpose of the future CI guard is to run the existing local package script in CI so fixture drift is caught before merge.

The guard should verify that the checked-in static run packet fixture remains non-executable, traceable, and aligned with the v0.1 validation helper.

The guard must not change the meaning of validation output.

The guard must not promote validation output into candidate-truth evidence, origin evidence, model-quality proof, or publication evidence.

## Future CI guard command

The proposed future CI guard command is:

`npm run open-instrument:validate-run-packet-fixture`

This command already expands to:

`node scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs`

The command runs the reviewed local validation script.

The reviewed local validation script parses the checked-in static fixture, checks non-execution posture, runs the focused helper validation test, and runs the focused integration gate test.

## Future CI guard placement

Preferred placement for future implementation:

- a dedicated CI step in the existing CI workflow if the workflow structure supports adding narrow checks without broad churn;
- or a dedicated CI job if a separate job is cleaner and less ambiguous.

The implementation PR must inspect existing GitHub Actions workflow structure before changing it.

The implementation PR must avoid broad workflow refactors.

The implementation PR must avoid touching unrelated workflows.

The implementation PR must avoid changing dependency installation strategy unless inspection proves it is necessary.

## Future CI guard trigger

The future CI guard should run on pull requests that affect relevant Open Instrument static validation files.

Minimum relevant paths:

- `package.json`
- `scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs`
- `src/shared/openInstrument/runPacketFixtureValidation.v0.1.ts`
- `tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts`
- `tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts`
- `docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json`
- `docs/open-instrument/open-instrument-run-packet-fixture-validation-ci-guard-design-v0.1.md`

The implementation PR may choose broader triggers only if that matches existing workflow conventions.

The implementation PR must explain the trigger choice.

## Pass condition

The future CI guard passes when:

- `npm run open-instrument:validate-run-packet-fixture` exits zero;
- the package script invokes the reviewed local validation script;
- the local validation script parses the static fixture;
- the static fixture remains `provider: fixture`;
- the static fixture remains `model: none`;
- the static fixture remains `endpointType: none`;
- the static fixture remains `evidenceClassIntent: design-only`;
- `modelCallAuthorization` remains false;
- `artifactCreationAuthorization` remains false;
- `rerunAuthorization` remains false;
- `openAiApiAuthorization` remains false;
- focused helper validation test passes;
- focused integration gate test passes.

## Fail condition

The future CI guard fails when:

- package script is missing;
- package script command drifts;
- validation script cannot parse the fixture;
- fixture identity drifts toward a live provider;
- fixture authorization drifts toward execution;
- fixture evidence class drifts away from design-only;
- helper validation fails;
- integration gate validation fails;
- script exits nonzero.

## Scope boundary

The CI guard is a validation guard only.

The CI guard must not call a model.

The CI guard must not call OpenAI API.

The CI guard must not call Ollama.

The CI guard must not call provider endpoints.

The CI guard must not inspect live provider defaults.

The CI guard must not mutate provider defaults.

The CI guard must not create artifacts.

The CI guard must not create reports.

The CI guard must not run candidate payload generation.

The CI guard must not run segmentation.

The CI guard must not run evidence-pack creation.

The CI guard must not change runtime/API/UI behavior.

## Runtime/API/UI boundary

The future CI guard is not runtime/API/UI wiring.

It must not modify app routes.

It must not modify API routes.

It must not modify UI components.

It must not change request/response contracts.

It must not expose validation state in the product UI.

Runtime/API/UI integration, if ever needed, requires separate design and review.

## Provider/network/API boundary

The future CI guard must remain local and deterministic.

It must not use OpenAI API.

It must not use provider credentials.

It must not use network access.

It must not use fallback providers.

It must not rely on live provider availability.

It must not mutate provider defaults.

Provider execution remains outside the static fixture validation lane.

## Artifact/report boundary

The future CI guard must not create Open Instrument artifacts.

The future CI guard must not create Open Instrument reports.

The future CI guard must not archive run outputs.

Artifact/report validation requires separate design and review.

## Evidence boundary

The future CI guard output is schema/traceability validation evidence only.

The future CI guard output is not candidate-truth evidence.

The future CI guard output is not origin evidence.

The future CI guard output is not model-quality proof.

The future CI guard output is not historical proof.

The future CI guard output is not publication evidence.

## Failure handling

Future CI failure means static validation did not pass.

Future CI failure does not authorize provider execution.

Future CI failure does not authorize rerun.

Future CI failure does not authorize OpenAI API use.

Future CI failure does not authorize fallback providers.

Future CI failure does not authorize provider-default changes.

Future CI failure does not authorize runtime/API/UI changes.

Future CI failure should be handled by inspecting the failing static validation lane.

## Implementation guardrails

The future implementation PR must:

- inspect existing workflow files first;
- modify only the minimum workflow file needed;
- run the package script locally before opening the PR;
- preserve package.json script command;
- preserve validation script behavior;
- preserve helper behavior;
- preserve integration gate behavior;
- preserve fixture JSON behavior;
- avoid broad CI refactors;
- avoid unrelated dependency changes;
- avoid touching Dependabot PR #1280;
- avoid touching provider/runtime/UI code.

## Required implementation proof

The future implementation PR should show:

- exact changed files;
- workflow diff;
- package script still present;
- `npm run open-instrument:validate-run-packet-fixture` passes locally;
- focused helper validation test passes locally;
- focused integration gate test passes locally;
- build passes locally;
- gate passes locally;
- GitHub checks pass after PR creation;
- PR diff contains only expected workflow/doc files.

## Accepted next action

The next accepted action after this design lands is:

`docs(open-instrument): review run packet fixture validation CI guard design`

After that review, a future implementation PR may add the CI guard.

Implementation is not authorized by this design PR alone.

## Claim boundary

This CI guard design is development-only schema/traceability design. It is not external origin/truth evidence, not candidate-truth evidence, not historical origin proof, not model-quality proof, not publication evidence, and not a reason to change provider defaults or authorize OpenAI API use.

The design keeps `modelCallAuthorization`, `artifactCreationAuthorization`, `rerunAuthorization`, and `openAiApiAuthorization` outside any implicit authorization path.

It also preserves explicit boundary handling around `claimBoundary`, `publicationBoundary`, `providerDefaultBoundary`, `evidenceClassIntent`, and `design-only` evidence posture.

## Final design decision

The future Open Instrument run packet fixture validation CI guard should be a narrow CI check around `npm run open-instrument:validate-run-packet-fixture`.

It should catch static fixture drift before merge.

It should not authorize model calls, provider execution, artifact creation, report creation, OpenAI API use, provider-default changes, runtime/API/UI wiring, publication framing, origin claims, or candidate-truth claims.
