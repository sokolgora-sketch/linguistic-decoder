# Open Instrument Run Packet Validation Integration Boundary Design v0.1

## Status
Design only.

No implementation.
No helper source changes.
No helper test changes.
No fixture JSON changes.
No runtime/API/UI wiring.
No prompt changes.
No provider default changes.
No model calls.
No reruns.
No provider execution.
No OpenAI API use.
No artifact creation.
No publication framing.

## Source chain
This design follows the current Open Instrument run-packet chain:

- PR #1281 / `216524f7`
- PR #1282 / `be9353d17f8962b307a777244ecdc3e47cd9792c`
- PR #1283 / `3220744a6cc94686c27197fcaf88af3dacb03fd0`
- PR #1284 / `82f975ce1ac68ea79dfc980252aedfb7793400fa`
- PR #1285 / `e6e763631b30cfc19b28f00dbb7660497021c53f`
- PR #1286 / `cd9ecc41cdcb3068c2b3aa9b719962486196ff71`
- PR #1287 / `e72d4ca7a8cc0bc6f066862558363187b60df0bc`
- PR #1288 / `5bd920a5fa92f4922d27820faaa6ecfd04459147`
- PR #1289 / `351b098dbe3b9ab8d433b8c57c8b3cfa6c1157c9`
- PR #1290 / `7d6e22d19df784498cfdf8a84b454acb67f1fad7`
- PR #1291 / `aa76e21a47215689de6553ca02630db3666d4c7a`
- PR #1292 / `e3581666e3965f7b779fd28b38ff95635f7f068b`

Reference paths:

- `docs/open-instrument/open-instrument-working-loop-design-v0.1.md`
- `docs/open-instrument/open-instrument-run-packet-contract-design-v0.1.md`
- `docs/open-instrument/fixtures/run-packets/open-instrument-run-packet-fixture-v0.1.json`
- `src/shared/openInstrument/runPacketFixtureValidation.v0.1.ts`
- `tests/openInstrument.runPacketFixtureValidation.v0.1.spec.ts`
- `docs/open-instrument/open-instrument-run-packet-fixture-validation-helper-review-v0.1.md`

## Design purpose
The purpose is to define the boundary for a future integration of `validateRunPacketFixtureV0_1` into the Open Instrument workflow.

This design decides:

- where validation can run;
- what input it can inspect;
- what output it can produce;
- what it must not trigger;
- what future PR type is required before integration is implemented.

## Open Instrument loop placement
The accepted loop remains:

Design → Preflight → Run Packet → Provider Execution → Capture → Verification → Archive and Report → Review and Closure

Design position:

- The validation helper belongs before provider execution.
- It may be used during a future preflight/run-packet readiness gate.
- It may be used to validate a static run packet fixture or candidate run packet object before any provider is called.
- It must not run after provider execution as evidence of model quality.
- It must not turn a provider result into origin evidence.
- It must not convert validation success into publication readiness.

## Integration boundary
A future implementation may call `validateRunPacketFixtureV0_1` only on already-constructed run-packet-like objects or known static fixture objects.

Future integration must be local and deterministic.

Future integration must not:

- read provider secrets;
- call OpenAI API;
- call Ollama;
- call network;
- call a provider;
- create artifacts;
- create reports;
- mutate run packets;
- mutate fixture JSON;
- mutate provider defaults;
- modify prompts;
- modify Brain candidate search validators;
- modify runtime UI behavior without its own explicit PR.

## Allowed future use cases
Allowed future use cases:

1. Static fixture validation in tests.
2. Preflight check for a local run-packet JSON object before provider execution.
3. CI check for static fixture contract drift.
4. Developer-facing guard before a controlled provider run.
5. Review-time evidence that a run packet is structurally ready.

Each allowed use remains schema/traceability evidence only.

## Forbidden future use cases
Forbidden future use cases:

1. Using validation pass as candidate-truth evidence.
2. Using validation pass as origin evidence.
3. Using validation pass as model-quality proof.
4. Using validation pass as publication readiness.
5. Automatically calling provider after validation without explicit operator authorization.
6. Automatically creating artifacts or reports after validation.
7. Changing provider defaults because validation passed.
8. Retrying with fallback providers because validation failed.
9. Silently editing fixture/run-packet data to make validation pass.
10. Treating validation as a substitute for review.

## Input boundary
Allowed inputs:

- parsed static fixture object;
- parsed run-packet-like object produced by a future run-packet builder;
- JSON object loaded by a test or preflight command outside the helper.

Forbidden inputs:

- raw provider response;
- model output text;
- external web data;
- secrets;
- live provider configuration;
- runtime UI form data without explicit future integration design;
- mutable global state.

The helper itself must continue to accept parsed input and not read from disk.

## Output boundary
Allowed output:

- deterministic ok boolean;
- deterministic issue list;
- stable issue path/code/message;
- local human-readable preflight failure summary in a future PR.

Forbidden output:

- artifact report;
- provider result;
- publication claim;
- origin claim;
- candidate-truth claim;
- model-quality score;
- provider recommendation;
- automatic fix patch.

## Stop behavior
If validation fails, future integration must stop before provider execution.

Failure must not:

- retry with another provider;
- call a model;
- edit the fixture;
- edit prompt contract;
- edit validator expectations;
- create artifact/report output;
- switch provider defaults;
- proceed to provider execution.

## Authorization boundary
These fields remain required and false unless a separate explicit future PR changes the design:

- modelCallAuthorization
- artifactCreationAuthorization
- rerunAuthorization
- openAiApiAuthorization

Validation success does not change these fields.

Validation success does not authorize provider execution.

## Provider default boundary
Validation does not inspect provider defaults.

Validation does not mutate provider defaults.

Validation success is not a reason to change provider default.

Validation failure is not a reason to change provider default.

Provider default remains outside this helper boundary.

## Evidence boundary
Validation helper output is schema/traceability evidence only.

Validation helper output is not candidate-truth evidence.

Validation helper output is not origin evidence.

Validation helper output is not historical proof.

Validation helper output is not model-quality evidence.

Validation helper output is not publication evidence.

## Runtime/API/UI boundary
No runtime/API/UI wiring is authorized by this design.

If future runtime/API/UI use is desired, it requires a separate implementation design and review.

Future UI must not present validation pass as semantic truth.

Future API must not auto-run providers after validation.

Future runtime must not create artifacts because validation passed.

## CI/test boundary
Future CI/test integration may be allowed only for:

- static fixture contract-drift detection;
- helper behavior stability;
- required field coverage;
- stop-condition coverage;
- boundary falsehood coverage.

CI/test integration must not call providers/models.

## Future implementation sequence
Recommended sequence:

1. Review this integration-boundary design.
2. Add a small local script or test-only integration that validates the static fixture in CI.
3. Review that integration.
4. Design a preflight command boundary for run-packet objects.
5. Implement preflight command only after review.
6. Only after separate authorization may provider execution be considered.

Do not skip directly to runtime/provider execution.

## Required future PR after this design
The next accepted action after this design lands is:

`docs(open-instrument): review run packet validation integration boundary design`

Do not recommend implementation immediately.

## Claim boundary
This integration-boundary design is development-only schema/traceability design. It is not external origin/truth evidence, not candidate-truth evidence, not historical origin proof, not model-quality proof, not publication evidence, and not a reason to change provider defaults or authorize OpenAI API use.

## Final design decision
The Open Instrument run packet validation integration boundary is designed as a local, deterministic, pre-provider validation boundary. It may support future static fixture and preflight readiness checks, but it does not authorize model calls, provider execution, artifact creation, OpenAI API use, provider-default changes, runtime/API/UI wiring, publication framing, origin claims, or candidate-truth claims.
