# Open Instrument Run Packet Fixture Validation CI Guard Design Review v0.1

## Status

This is a review-only document.

The CI guard design already exists from PR #1301.

This PR does not implement CI wiring.

This PR does not change GitHub Actions workflows, package.json, package-lock.json, validation script, integration gate test, validation helper, helper test, fixture JSON, source schema, prompt contracts, runtime code, API routes, UI, provider defaults, artifact creation, report creation, model execution, provider execution, OpenAI API use, rerun behavior, or publication framing.

No model call is authorized.

No rerun is authorized.

No provider execution is authorized.

No runtime/API/UI wiring is authorized.

No OpenAI API use is authorized.

No provider default change is authorized.

No CI implementation is authorized in this PR.

## Reviewed design

Reviewed CI guard design:

- PR #1301
- merge SHA `dec97835e629e5b6fa628005b92f436e8c69f18c`
- design doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-ci-guard-design-v0.1.md`

Reviewed package script review:

- PR #1300 / `88440edba3a97d495f160a8f46a1fb66f2cb6191`
- review doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-package-script-review-v0.1.md`

Reviewed package script implementation:

- PR #1299 / `54d6e456decabe928b2836d87c918c29dc6fbc9b`
- package script: `open-instrument:validate-run-packet-fixture`
- command: `node scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs`

Reviewed validation script review:

- PR #1298 / `fe4b100c0f87c4578f96fd224092d87969b02175`
- review doc: `docs/open-instrument/open-instrument-run-packet-fixture-validation-script-review-v0.1.md`

Reviewed validation script implementation:

- PR #1297 / `b5791915745057fd90fa3a39b6953da79f4a9b8b`
- script: `scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs`

Reviewed integration gate:

- PR #1296 / `b3022db9f21fe480f341211a5907226fd49f3e01`
- PR #1295 / `a46893a9e4700063c838afbe20a61ea145bef116`
- gate test: `tests/openInstrument.runPacketFixtureValidationIntegrationGate.v0.1.spec.ts`

Reviewed validation helper:

- PR #1291 / `aa76e21a47215689de6553ca02630db3666d4c7a`
- helper: `src/shared/openInstrument/runPacketFixtureValidation.v0.1.ts`
- helper test: `tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts`
- exported helper: `validateRunPacketFixtureV0_1`

Reviewed fixture:

- PR #1287 / `e72d4ca7a8cc0bc6f066862558363187b60df0bc`
- fixture: `docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json`

Accepted Open Instrument loop:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure

This review evaluates the CI guard design only, not any implementation.

## Review purpose

This review checks whether the CI guard design is safe to accept as the next blueprint step before any GitHub Actions implementation.

The design is accepted only if it keeps the future CI guard narrow, deterministic, local, schema/traceability-only, and separate from provider execution, OpenAI API use, artifact/report creation, runtime/API/UI wiring, and publication framing.

## Design-only posture review

The design clearly states that it does not implement CI wiring.

The design does not authorize workflow edits by itself.

The design requires a separate implementation PR after review.

Decision: design-only posture is accepted.

## Future command review

The proposed future command is:

`npm run open-instrument:validate-run-packet-fixture`

The command invokes:

`node scripts/openInstrumentRunPacketFixtureValidation.v0.1.mjs`

The command has already been accepted as the named local entry point for deterministic static run packet fixture validation.

Decision: future command is accepted.

## Future CI placement review

The design permits either a narrow dedicated CI step in the existing workflow or a dedicated job, depending on workflow inspection.

The design requires the implementation PR to inspect existing GitHub Actions workflow structure before changing it.

The design avoids broad workflow refactors.

Decision: future CI placement guidance is accepted.

## Future trigger review

The design scopes future triggering around relevant static validation files, including package script, validation script, helper, tests, and fixture JSON.

The design allows broader triggers only if they match existing workflow conventions and are explained in the implementation PR.

Decision: future trigger guidance is accepted.

## Pass condition review

The design defines pass conditions around the package script exit code, static fixture parse, identity fields, authorization fields, focused helper validation, and integration gate validation.

Decision: pass condition is accepted.

## Fail condition review

The design fails closed on missing package script, command drift, parse failure, live-provider identity drift, authorization drift, evidence-class drift, helper failure, gate failure, or nonzero script exit.

Decision: fail condition is accepted.

## Scope boundary review

The design states the future CI guard is a validation guard only.

The design excludes model calls, provider endpoints, OpenAI API use, Ollama use, provider-default inspection/mutation, artifact/report creation, candidate payload generation, segmentation, evidence-pack creation, and runtime/API/UI changes.

Decision: scope boundary is accepted.

## Runtime/API/UI boundary review

The design does not authorize app route, API route, UI component, request/response contract, or product UI changes.

Future runtime/API/UI integration requires separate design and review.

Decision: runtime/API/UI boundary is accepted.

## Provider/network/API boundary review

The design requires the future CI guard to remain local and deterministic.

It must not use OpenAI API, provider credentials, network access, fallback providers, live provider availability, or provider-default mutation.

Decision: provider/network/API boundary is accepted.

## Artifact/report boundary review

The design excludes artifact creation, report creation, and run-output archiving.

Artifact/report validation requires separate design and review.

Decision: artifact/report boundary is accepted.

## Evidence boundary review

The design states future CI guard output is schema/traceability validation evidence only.

It is not candidate-truth evidence.

It is not origin evidence.

It is not model-quality proof.

It is not historical proof.

It is not publication evidence.

Decision: evidence boundary is accepted.

## Failure handling review

The design states CI failure does not authorize provider execution, rerun, OpenAI API use, fallback providers, provider-default changes, or runtime/API/UI changes.

Failure is handled by inspecting the static validation lane.

Decision: failure handling is accepted.

## Implementation guardrails review

The design requires future implementation to inspect workflow files first, modify only the minimum workflow file needed, run the package script locally, preserve package and validation behavior, avoid broad CI refactors, avoid unrelated dependency changes, avoid Dependabot PR #1280, and avoid provider/runtime/UI code.

Decision: implementation guardrails are accepted.

## Required implementation proof review

The design requires future implementation proof including changed files, workflow diff, package script proof, local package script pass, focused helper pass, focused integration gate pass, build pass, gate pass, GitHub checks pass, and expected PR diff.

Decision: implementation proof requirements are accepted.

## Limitations

This review does not implement the CI guard.

This review does not modify `.github/`.

This review does not modify package.json.

This review does not modify package-lock.json.

This review does not change validation behavior.

This review does not change fixture JSON.

This review does not add provider execution.

This review does not add artifact/report validation.

This review does not add runtime/API/UI integration.

## Accepted next action

The next accepted action after this review lands is:

`ci(open-instrument): add run packet fixture validation guard`

Purpose:

- inspect existing GitHub Actions workflow files;
- add the narrowest CI wiring that runs `npm run open-instrument:validate-run-packet-fixture`;
- keep the change separate from provider execution;
- keep the change separate from runtime/API/UI;
- keep the change separate from artifact/report creation;
- preserve no model calls;
- preserve no OpenAI API use;
- preserve no provider default changes.

This is not provider execution.

## Claim boundary

This CI guard design review is development-only schema/traceability review. It is not external origin/truth evidence, not candidate-truth evidence, not historical origin proof, not model-quality proof, not publication evidence, and not a reason to change provider defaults or authorize OpenAI API use.

The reviewed design keeps `modelCallAuthorization`, `artifactCreationAuthorization`, `rerunAuthorization`, and `openAiApiAuthorization` outside any implicit authorization path.

It also preserves explicit boundary handling around `claimBoundary`, `publicationBoundary`, `providerDefaultBoundary`, `evidenceClassIntent`, and `design-only` evidence posture.

## Final review decision

The Open Instrument run packet fixture validation CI guard design is accepted.

The accepted design authorizes a future implementation PR to add a narrow CI guard around `npm run open-instrument:validate-run-packet-fixture`.

The accepted design does not itself authorize model calls, provider execution, artifact creation, report creation, OpenAI API use, provider-default changes, runtime/API/UI wiring, publication framing, origin claims, or candidate-truth claims.
