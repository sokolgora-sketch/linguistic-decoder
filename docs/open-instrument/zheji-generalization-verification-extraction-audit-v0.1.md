# Zheji Generalization Verification Extraction Audit v0.1 — Design

Status: DESIGN_DEFINED.

Project lane: Open Instrument / ZËRO.

Design date: 2026-06-20.

Design base:

* Short SHA: `410d291e`
* Full SHA: `410d291e00c1d1670abd71e08809bb1e4cb2f403`

Prerequisite governance:

* Passive Artifact Registry v0.1 is closed.
* Passive-to-Runtime Authorization Checklist v0.1 is closed.
* This design remains docs-only and passive.

## Purpose

This milestone decides how to verify whether the Zheji/Open Instrument pipeline generalizes beyond the current `study` evidence.

The milestone exists because a validated schema is not the same thing as a working research instrument.

The next empirical question is:

Does the instrument produce valid, meaningful candidates on a fresh word, or does it only produce structurally valid nulls?

Before selecting the second word, this design requires an extraction audit.

The audit must determine whether Heart vowel extraction is currently:

* orthographic: based on written letters
* phonetic: based on spoken sound / IPA / pronunciation
* mixed: written extraction with later semantic or phonetic interpretation
* unspecified: no stable contract found

This answer controls candidate-word selection.

## Why extraction audit comes before choosing the word

English spelling is not a safe proxy for pronunciation.

Examples:

* `mind` contains written `i`, but spoken English commonly realizes it as /aɪ/.
* `study` contains written `u`, but spoken English commonly realizes it as /ʌ/.
* A test word with diphthongs, silent letters, rhotic endings, or schwa reduction may accidentally test English spelling noise instead of Zheji generalization.

Therefore the second-word replay must not be locked until extraction semantics are documented.

## Milestone decision

Selected milestone:

`research(open-instrument): verify Zheji generalization with extraction audit v0.1`

This milestone is selected instead of runtime readiness.

Runtime readiness is deferred because research generalization is not yet empirically established.

## Scope

This milestone may:

* inspect Heart extraction behavior
* document whether extraction is orthographic, phonetic, mixed, or unspecified
* define clean second-word selection criteria
* choose one second-word target after extraction semantics are reviewed
* define Isolation Audit prompt hardening
* authorize a later single second-word replay only after review
* review whether the replay produces real candidates, honest nulls, or model/prompt collapse

This milestone may not:

* modify runtime behavior
* modify API output
* modify UI output
* execute providers
* replay Zheji before an explicit authorized replay step
* modify package metadata
* modify CI
* create evidence packs
* create publication artifacts
* claim candidate truth
* claim origin evidence
* claim ownership evidence
* claim model-quality evidence

## Required extraction audit

The extraction audit must inspect source, tests, docs, and fixtures for:

* vowel extraction implementation
* input normalization behavior
* surface vowel extraction behavior
* functional vowel path behavior
* Heart / voice path behavior
* any phonetic, IPA, or pronunciation logic
* any dependency on written spelling
* any tests that lock orthographic or phonetic behavior

The audit must produce one of these statuses:

| Status | Meaning |
| --- | --- |
| EXTRACTION_ORTHOGRAPHIC | Heart extraction is based on written letters. |
| EXTRACTION_PHONETIC | Heart extraction is based on spoken pronunciation or IPA. |
| EXTRACTION_MIXED | Heart extraction has both written and phonetic stages. |
| EXTRACTION_UNSPECIFIED | No stable extraction contract exists yet. |

If status is EXTRACTION_UNSPECIFIED, the milestone must stop before replay and define a stable extraction contract.

## Second-word candidate rules

A second-word candidate should avoid:

* diphthongs
* silent letters
* schwa-reduced syllables
* rhotic endings
* ambiguous English spelling/pronunciation conflicts
* reuse of the exact same consonant cluster as `study`
* word-specific prompt tuning

Candidate selection must be based on the extraction status.

### If extraction is orthographic

Allowed candidate class:

* clean written vowels
* no silent letters
* no word-specific exception rules

Current preferred candidates:

1. `comic`
2. `limit`

`comic` is preferred because it tests a new first vowel path `O -> I` and introduces velar C/K context.

`limit` is the safer backup because it repeats short written `I` and isolates consonant-context effects.

`mind` is deferred unless the design explicitly accepts orthographic extraction and documents the /aɪ/ pronunciation trap.

### If extraction is phonetic

Allowed candidate class:

* clean monophthong pronunciation
* clear IPA mapping
* no diphthong unless the test explicitly targets diphthongs

Current preferred candidates:

1. `comic`
2. `limit`

`mind` is rejected as the first second-word candidate because /aɪ/ is a diphthong.

### If extraction is mixed

The candidate must be selected only after both stages are documented.

The design must say which stage is being tested.

### If extraction is unspecified

No second-word replay is authorized.

## Candidate comparison table

| Candidate | Current posture | Reason |
| --- | --- | --- |
| `comic` | preferred | avoids silent letters, tests O -> I, introduces velar C/K, avoids ST reuse |
| `limit` | backup | repeated I, clean consonant context, lower known-answer bias |
| `mind` | deferred | written I conflicts with spoken /aɪ/ unless orthographic extraction is explicitly accepted |
| `study` | baseline only | already over-tested and not sufficient for generalization |

## Isolation Audit prompt hardening

Before any second-word replay, the prompt must add an Isolation Audit rule.

The rule must require that a candidate marked `atomic` includes a standalone isolated definition in `sourceNote`.

If the model cannot provide an isolated standalone definition, the candidate must not be marked `atomic`.

Allowed fallback classifications:

* metaphorical
* derived
* opaque
* null

The Isolation Audit must be dry and mechanical.

It must not invite metaphor.

It must not reward convenient carrier selection.

It must not require a schema change unless inspection proves the current schema cannot represent the audit.

## Replay design rule

A later replay must use the proven pipeline without word-specific prompt tuning.

The replay must be one explicit word only.

The replay must state:

* target word
* extraction status
* segmentation hypothesis
* candidate anchor families
* validator command
* test command
* expected output path
* rejection criteria

The replay must not occur inside this design PR.

## Result interpretation gate

After replay, the review must classify the result as one of:

| Result | Meaning |
| --- | --- |
| GENERALIZES_WITH_CANDIDATES | Valid non-null candidates appear and pass Isolation Audit. |
| HONEST_NULL | Valid null output with clear refusal reasons. |
| PROMPT_MODEL_COLLAPSE | Invalid JSON, schema breakage, all-null without useful refusal, or structural collapse. |
| EXTRACTION_CONTRACT_FAILURE | Replay reveals extraction behavior was not stable enough to test. |

## DeepSeek / model-switch boundary

No model switch is authorized by this design.

A future model switch requires a separate explicit authorization step.

If a local 8B model collapses under Isolation Audit load, that is evidence for review.

It does not automatically authorize DeepSeek, Ollama model change, provider execution, or prompt rewrite.

## Required validation for design review

A review of this design must run:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

## Hard boundaries

Hard boundaries preserved:

* No provider execution.
* No Zheji replay.
* No runtime/API/UI behavior changes.
* No package metadata changes.
* No CI changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`docs(open-instrument): review Zheji generalization verification extraction audit design v0.1`
