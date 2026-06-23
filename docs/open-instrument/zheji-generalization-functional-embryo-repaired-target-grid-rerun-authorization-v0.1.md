# Functional embryo repaired target-grid rerun authorization v0.1

Date: 2026-06-23

Status: FUNCTIONAL_EMBRYO_REPAIRED_TARGET_GRID_RERUN_AUTHORIZATION_DEFINED_PENDING_REVIEW.

Reviewed base for this authorization definition:

* Short SHA: `9ca6dfd5`
* Full SHA: `9ca6dfd592b4109acd96adfb2327cfa613d0c333`
* Subject: `docs(open-instrument): review functional embryo prompt-delivery attestation repair implementation v0.1`

## Purpose

This document defines the next controlled rerun authorization after the functional embryo prompt-delivery and attestation repair was implemented and reviewed.

This document does not execute the rerun.

This document does not authorize a model/provider call by itself until reviewed and accepted in a separate review PR.

## Authorization target

The next execution, after this authorization is reviewed and accepted, is one controlled repaired Layer 2 target-grid rerun for the reviewed `comic` target grid.

Authorized target grid:

* word: `comic`
* stage: `MIXED_STAGE_ORTHOGRAPHIC_PRIMARY_WITH_PHONETIC_SANITY`
* segmentation: `COM + IC`
* chunks: `COM`, `IC`
* candidate languages: `Albanian`, `Latin`, `Greek`, `Sanskrit`
* target count: `8`

The execution must use the existing Layer 2 target-grid runner only:

* `scripts/openInstrumentLayer2TargetGridExecutionRunner.v0.1.mjs`

The output artifact path must remain:

* `docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

## Required execution base

The future execution PR must run only from the reviewed repaired implementation base that includes the prompt-delivery and attestation repair.

Required base:

* `9ca6dfd592b4109acd96adfb2327cfa613d0c333`

The future execution script must verify that current `HEAD` equals the required base before any provider/model call.

## Required provider identity

The future execution must use only the reviewed local provider identity:

* providerFamily: `local_only_openai_compatible`
* providerName: `ollama_openai_compat`
* model: `llama3.1:8b`
* endpointClass: `localhost_only`
* baseUrl: `http://127.0.0.1:11434/v1`

Remote endpoints are not authorized.

OpenAI-hosted endpoints are not authorized.

DeepSeek endpoints are not authorized.

API keys are not authorized.

Authorization headers are not authorized.

## Required pre-execution proofs

Before any provider/model call, the future execution script must prove:

* clean working tree
* current branch is `main`
* current `HEAD` equals the required base SHA
* implementation review status is present
* actual single-call prompt output contains `<ISOLATION_AUDIT>`
* actual single-call prompt output contains `<RESPONSE_ENVELOPE_REQUIRED>`
* actual single-call prompt output contains `<CLAIM_BOUNDARY_REQUIRED>`
* actual single-call prompt output contains `attested_standalone_form`
* actual single-call prompt output rejects `reasonably_inferred`
* actual Layer 2 printed request bodies contain `<ISOLATION_AUDIT>`
* actual Layer 2 printed request bodies contain `<RESPONSE_ENVELOPE_REQUIRED>`
* actual Layer 2 printed request bodies contain `<CLAIM_BOUNDARY_REQUIRED>`
* actual Layer 2 printed request bodies contain `attested_standalone_form`
* actual Layer 2 printed request bodies reject `reasonably_inferred`
* Layer 2 scaffold validator contains attestation rejection logic
* prompt-delivery regression test passes
* Layer 2 runner test passes
* Layer 2 scaffold test passes

## Required command shape for the future execution

The future execution must use the reviewed runner execution flag:

* `--execute-reviewed-layer2-target-grid`

It must include:

* `--reviewed-execution-base-sha 9ca6dfd592b4109acd96adfb2327cfa613d0c333`
* `--provider-family local_only_openai_compatible`
* `--provider-name ollama_openai_compat`
* `--model llama3.1:8b`
* `--endpoint-class localhost_only`
* `--base-url http://127.0.0.1:11434/v1`
* `--output docs/open-instrument/artifacts/zheji-generalization/comic-layer2-target-grid-replay-v0.1.json`

## Required result handling

After execution, the future PR must:

* compute the artifact SHA-256
* print aggregate classification
* print each target classification
* verify artifact schema fields
* verify claimBoundary remains development-only
* verify no evidence promotion
* verify no publication framing
* verify no winner-crowning
* verify no origin evidence claim
* verify no candidate-truth evidence claim
* commit only the target-grid replay artifact
* not modify runner code
* not modify tests
* not modify schema
* not modify package/CI config

## Allowed outcomes

The repaired rerun may still produce null or invalidated results.

Allowed aggregate outcomes include:

* `TARGET_GRID_ALL_NULL_ACCEPTED`
* `TARGET_GRID_PARTIAL_INVALIDATED`
* `TARGET_GRID_SIGNAL_PRESENT`

A signal-present result is not accepted as truth by execution alone.

Any signal-present result requires a separate result-review PR before interpretation.

## Claim boundary

This authorization definition is development-only.

It does not prove origin.

It does not prove functional motivation.

It does not prove a candidate true.

It does not crown a winner.

It does not create publication evidence.

It does not promote evidence.

It only defines the conditions under which one future local-only repaired target-grid rerun may be performed after review.

## Current PR scope

This PR is docs-only.

This PR must not:

* execute a replay
* call a provider
* call a model
* mutate an artifact
* change runner code
* change tests
* change schema
* change package files
* change CI
* promote evidence
* frame results for publication

## Next accepted task

`docs(open-instrument): review functional embryo repaired target-grid rerun authorization v0.1`
