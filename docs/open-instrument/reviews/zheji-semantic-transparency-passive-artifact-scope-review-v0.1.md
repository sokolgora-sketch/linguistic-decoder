# Zheji Semantic Transparency Layer v0.1 — Passive Artifact Scope Review

Status: SCOPE_REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Reviewed scope:

* `docs/open-instrument/zheji-semantic-transparency-passive-artifact-scope-v0.1.md`

Upstream design:

* `docs/open-instrument/zheji-semantic-transparency-layer-v0.1.md`

Upstream design review:

* `docs/open-instrument/reviews/zheji-semantic-transparency-layer-design-review-v0.1.md`

## Review decision

The passive artifact scope is accepted for v0.1.

The next implementation lane may create the accepted passive artifact bundle only.

This review does not authorize runtime integration.

This review does not authorize UI integration.

This review does not authorize provider execution.

This review does not authorize Zheji replay.

## Accepted passive artifact bundle

The next implementation lane may create only these artifacts:

* passive JSON schema file
* passive static fixture file
* passive validation helper script
* unit tests for the validation helper
* documentation linking the passive artifacts back to the design contract

No other artifact type is accepted by this review.

## Accepted future paths

The following future paths are accepted:

* `docs/open-instrument/schemas/zheji-semantic-transparency/zheji-semantic-transparency-schema-v0.1.json`
* `docs/open-instrument/fixtures/zheji-semantic-transparency/zheji-semantic-transparency-static-fixture-v0.1.json`
* `scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts`

No runtime/API/UI path is accepted.

No source-engine provenance runtime path is accepted.

No provider execution path is accepted.

## Acceptance rationale

The scope is accepted because it keeps v0.1 passive and testable.

It allows the project to preserve the semantic transparency contract without changing runtime behavior.

It gives ZËRO a concrete artifact target while maintaining the truth posture:

* candidate-only
* non-origin
* non-ownership
* null-safe
* evidence-anchored
* provider-output-is-not-evidence
* no single winner

## Required implementation constraints

The next implementation lane must obey these constraints:

* do not import the schema into runtime
* do not import the fixture into runtime
* do not import the helper into runtime
* do not modify API routes
* do not modify UI routes
* do not modify engine scoring
* do not modify source-engine provenance
* do not generate evidence packs
* do not generate reports
* do not use provider output
* do not call network
* do not read secrets
* do not replay Zheji examples through any model or engine

## Required validation behavior

The passive validation helper must check at minimum:

* required fields exist
* `claim_policy` is present
* forbidden claim labels are blocked
* `source_note` rejects origin and ownership claims
* Code F and Code E are independent fields
* null result has a null reason
* provider-only support cannot be accepted as strong evidence
* blocked forbidden claims force `blocked_forbidden_claim`
* fixture examples do not use origin, ownership, or proof language
* runtime/API/UI imports are absent

## Required fixture cases

The static fixture must include at minimum:

* one candidate transparency case
* one null case
* one blocked forbidden-claim case

The fixture must not claim:

* proven origin
* true origin
* final etymology
* linguistic ownership
* provider-confirmed truth
* publication-grade proof

## Required source-note posture

Every fixture case must include a source note meaning:

This artifact records candidate semantic transparency and meaning-motivation only. It does not claim origin, historical ownership, final etymology, or publication-grade proof.

The exact wording may vary, but the meaning must be present.

## Forbidden implementation behavior

The next implementation lane must not:

* execute providers
* use OpenAI
* use Ollama
* call remote endpoints
* call localhost endpoints
* mutate runtime/API/UI files
* mutate package metadata
* create CI changes
* create evidence packs
* create publication artifacts
* promote candidate truth
* promote origin evidence
* promote ownership evidence
* promote model-quality evidence

## Review of forbidden files

The forbidden-files list is accepted.

The passive implementation lane must not change:

* `app/**`
* `pages/**`
* `src/app/**`
* `src/pages/**`
* `src/ui/**`
* `src/components/**`
* `src/shared/**`
* API route files
* runtime analysis engine files
* provider execution scripts
* source-engine provenance runtime files
* evidence-pack generation files
* package metadata

## Package metadata decision

Package metadata changes are not accepted for the next implementation lane.

The implementation must use existing project tooling.

If a dependency is needed later, a separate scoped authorization is required.

## Milestone impact

This review advances the milestone from reviewed design to accepted passive artifact scope.

The milestone is not done yet.

The milestone can close only after the accepted passive artifacts are added, validated, reviewed, and recorded in DF_BRAIN.

## Current next task

`test(open-instrument): add zheji semantic transparency passive artifacts v0.1`
