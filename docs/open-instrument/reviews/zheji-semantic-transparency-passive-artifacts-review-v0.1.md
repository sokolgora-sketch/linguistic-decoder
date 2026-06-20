# Zheji Semantic Transparency Layer v0.1 — Passive Artifacts Review

Status: PASSIVE_ARTIFACTS_REVIEWED_ACCEPTED.

Project lane: Open Instrument / ZËRO.

Reviewed implementation PR:

* `test(open-instrument): add zheji semantic transparency passive artifacts v0.1`

Reviewed main:

* Short SHA: `ff75a5c8`
* Full SHA: `ff75a5c8c50a7ce646bb0d8ecba29b0815e8aa68`

Reviewed artifacts:

* `docs/open-instrument/schemas/zheji-semantic-transparency/zheji-semantic-transparency-schema-v0.1.json`
* `docs/open-instrument/fixtures/zheji-semantic-transparency/zheji-semantic-transparency-static-fixture-v0.1.json`
* `scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts`

## Review decision

The passive artifacts are accepted for Zheji Semantic Transparency Layer v0.1.

The artifact bundle matches the accepted passive scope:

* passive JSON schema
* passive static fixture
* passive validation helper
* Jest tests
* no runtime/API/UI integration

This review does not authorize runtime wiring.

This review does not authorize UI wiring.

This review does not authorize API output changes.

This review does not authorize provider execution.

This review does not authorize Zheji replay.

## What was verified

The review verified:

* required passive schema file exists
* required passive fixture file exists
* required passive validation helper exists
* required Jest test exists
* passive validator returns `ok: true`
* focused Jest test passes
* full gate passes
* post-merge file list matches the four accepted artifact paths
* package metadata was not changed
* no runtime/API/UI/provider import pattern exists in the helper or test

## Validation proof

The following checks were run during review:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`

All passed.

## Correctness notes

The final artifact implementation includes the corrections required during local inspection:

* Jest is used instead of Vitest because the project is Jest-based.
* The source-note denial language is kept separate from forbidden claim-bearing text scanning.
* Code F and Code E coupling is checked structurally.
* CLI direct-run path handling supports repo paths with spaces and non-ASCII characters.

## Artifact posture

The artifact posture is accepted as passive.

The artifacts do not:

* call providers
* call OpenAI
* call remote endpoints
* call localhost endpoints
* read secrets
* mutate runtime files
* mutate API files
* mutate UI files
* produce evidence packs
* create publication artifacts
* claim origin
* claim ownership
* promote candidate truth

## Fixture posture

The static fixture is accepted because it includes:

* one candidate transparency case
* one null case
* one blocked forbidden-claim case

The fixture preserves:

* candidate-only posture
* non-origin posture
* non-ownership posture
* null-safe posture
* source-note denial language

## Validation helper posture

The validation helper is accepted because it checks:

* required fields
* claim policy
* forbidden claim labels
* required source-note posture
* Code F / Code E independence
* null reason requirements
* provider-only strong-evidence rejection
* blocked origin/ownership audit behavior
* runtime/API/UI/provider import absence

## Test posture

The Jest test is accepted because it proves:

* accepted fixture passes
* candidate/null/blocked statuses exist
* missing source note fails
* forbidden origin wording fails in claim-bearing fields
* forbidden ownership wording fails in claim-bearing fields
* required denial language in source notes is allowed
* provider-only strong evidence fails
* Code F / Code E structural coupling fails
* missing null reason fails
* forbidden origin audit must block
* helper stays free from runtime/API/UI/provider imports

## Boundary review

Hard boundaries preserved:

* No provider execution.
* No Zheji replay.
* No runtime/API/UI behavior changes.
* No package metadata changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Milestone impact

The Zheji Semantic Transparency Layer v0.1 milestone now has:

* design
* design review
* passive artifact scope
* passive artifact scope review
* passive artifacts
* passive artifact review

After this review merges, the next safe task is milestone closure.

## Current next task

`docs(open-instrument): close zheji semantic transparency layer v0.1 milestone`
