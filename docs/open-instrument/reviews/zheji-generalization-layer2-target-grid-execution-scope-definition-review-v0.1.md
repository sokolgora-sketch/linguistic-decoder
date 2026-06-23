# Layer 2 Target-Grid Execution Scope Definition Review v0.1

Status: LAYER2_TARGET_GRID_EXECUTION_SCOPE_DEFINITION_REVIEWED_ACCEPTED_READY_FOR_RUNNER_IMPLEMENTATION.

Review date: 2026-06-23.

Reviewed base:

* Short SHA: `2bbc062e`
* Full SHA: `2bbc062e554fcc4bc00b42cb5e6e3b192552a4f8`
* Subject: `docs(open-instrument): define Layer 2 target-grid execution scope v0.1`

Reviewed scope:

* `docs/open-instrument/zheji-generalization-layer2-target-grid-execution-scope-v0.1.md`

Reviewed scaffold:

* `scripts/openInstrumentLayer2ChunkLanguageTargetGrid.v0.1.mjs`
* `tests/openInstrument.layer2ChunkLanguageTargetGrid.scaffold.v0.1.spec.ts`

Future artifact path:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

## Review decision

The Layer 2 target-grid execution scope definition is reviewed and accepted.

The scope is accepted as an exact future execution contract.

This review does not execute the target grid.

This review does not call a provider.

This review does not call a model.

This review does not mutate an artifact.

## Accepted execution scope

The reviewed future execution is limited to one target-grid pass for:

* word: `comic`
* stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation: `COM + IC`
* source language: `English`

The exact target grid is accepted:

* `comic::COM::Albanian`
* `comic::COM::Latin`
* `comic::COM::Greek`
* `comic::COM::Sanskrit`
* `comic::IC::Albanian`
* `comic::IC::Latin`
* `comic::IC::Greek`
* `comic::IC::Sanskrit`

Do not expand to all allowlisted languages yet.

## Accepted provider identity for future execution

The reviewed future provider identity is:

* providerFamily: `local_only_openai_compatible`
* providerName: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpointClass: `localhost_only`

The future execution must remain explicit-provider only.

No fallback provider is allowed.

No automatic provider selection is allowed.

No hosted OpenAI endpoint is allowed.

No DeepSeek endpoint is allowed.

No remote provider endpoint is allowed.

## Accepted future artifact contract

The future output artifact path is accepted:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

The future artifact must remain development-only.

The future artifact must not be promoted as:

* origin evidence
* ownership evidence
* publication evidence
* model-quality evidence
* provider-output correctness evidence
* candidate-truth evidence

## Accepted aggregate classifications

The execution scope correctly allows:

* `TARGET_GRID_SIGNAL_PRESENT`
* `TARGET_GRID_ALL_NULL_ACCEPTED`
* `TARGET_GRID_DEGENERATE_BLOCKED`
* `TARGET_GRID_PARTIAL_INVALIDATED`
* `TARGET_GRID_EXECUTION_BLOCKED`

No classification may be converted into origin proof.

No classification may be converted into publication evidence.

No classification may crown a winner.

## Required next implementation

The next PR may implement a target-grid execution runner.

That implementation may add provider-call code, but must not execute it.

The implementation must include:

* reviewed target-grid execution runner
* provider-call isolation for one target at a time
* per-target prompt builder
* per-target response parser
* aggregate artifact writer
* focused tests
* fail-closed provider identity checks
* fail-closed reviewed execution base checks
* fail-closed output path checks

The implementation PR must not write the execution artifact.

The implementation PR must not run the provider.

The implementation PR must not call the model.

A later reviewed execution PR is required before any actual target-grid provider run.

## Boundary proof

No target-grid execution occurred in this review PR.

No provider execution occurred in this review PR.

No model call occurred in this review PR.

No localhost/Ollama call occurred in this review PR.

No remote endpoint use occurred in this review PR.

No hosted OpenAI endpoint use occurred in this review PR.

No DeepSeek endpoint use occurred in this review PR.

No artifact mutation occurred in this review PR.

No source/runtime/API/UI behavior change occurred in this review PR.

No schema/package/CI change occurred in this review PR.

No evidence promotion occurred in this review PR.

No publication framing occurred in this review PR.

No winner-crowning occurred in this review PR.

## Next accepted task

`test(open-instrument): implement Layer 2 target-grid execution runner v0.1`
