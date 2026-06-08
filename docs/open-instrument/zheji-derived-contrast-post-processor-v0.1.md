# Zheji Derived Contrast Post-Processor v0.1

## Status

This is a post-processor design only.

It is not implemented.

No source post-processor is added in this PR.

No source validator change is made in this PR.

No source schema change is made in this PR.

No source prompt change is made in this PR.

No runtime change is made in this PR.

No model call is made in this PR.

No artifact replay is made in this PR.

No provider default change is made in this PR.

No existing Zheji UI or engine lens is changed in this PR.

This post-processor design supports embryo morpheme meaning analysis. It is not external origin/truth evidence.

## Source design reviewed

This document follows the staged Zheji transparency lane:

- `docs/open-instrument/zheji-semantic-transparency-layer-v0.1.md`
- `docs/open-instrument/zheji-semantic-transparency-layer-review-v0.1.md`
- `docs/open-instrument/zheji-transparency-schema-additions-v0.1.md`
- `docs/open-instrument/zheji-transparency-validation-policy-v0.1.md`
- `docs/open-instrument/zheji-prompt-contract-additions-v0.1.md`

The prompt contract says Brain may later return candidate-level `analysisLayers` and `semanticTransparency`, but Brain must not return `transparencyContrast`.

This document defines how a future deterministic post-processor should derive `transparencyContrast` after Brain output is parsed and normalized.

## Purpose

The purpose is to define the derived contrast step for the future Zheji semantic transparency layer.

The post-processor answers one narrow structural question:

Do non-null candidates for the same embryo chunk fall into different semantic transparency levels?

It does not judge origin.

It does not judge truth.

It does not choose a winner.

It does not write analysis prose.

It only groups candidate languages by `semanticTransparency.level`.

## Pipeline position

The future pipeline should remain ordered:

1. Heart owns word identity, segmentation, chunks, voice path, legal transforms, and function hints.
2. Brain returns raw candidate-level output.
3. Raw Brain output is preserved.
4. Enum/shape normalization may repair approved low-risk shape drift.
5. Normalized Brain output is preserved separately.
6. Zheji candidate-level fields are validated when active.
7. Deterministic post-processor computes `transparencyContrast`.
8. Derived enriched output is preserved separately.
9. Validator/review checks the derived enriched output boundary.
10. Human review interprets the enriched artifact.

The post-processor runs after candidate-level `semanticTransparency` exists.

The post-processor does not run before Brain output is parsed.

The post-processor does not run on unparsed text.

## Input contract

The post-processor input is normalized Brain output with non-null `chunkCandidates`.

Each non-null candidate may include:

- `chunk`
- `language`
- `nullCandidate`
- `semanticTransparency.level`

Allowed levels:

- `atomic`
- `metaphorical`
- `opaque`

Candidates without valid `semanticTransparency.level` should be treated as invalid under the future active Zheji validator, not silently guessed.

Null candidates are excluded from the contrast matrix.

## Output contract

The future derived field is `transparencyContrast`.

Shape:

- `hasContrast`
- `matrix.atomic`
- `matrix.metaphorical`
- `matrix.opaque`

`hasContrast` is boolean.

Each matrix bucket is an array of language labels or language codes.

The v0.1 matrix is language-only unless a separate candidate-id design later adds candidate ids.

## Matrix construction rule

For each embryo chunk:

- collect non-null candidates;
- read each candidate's `semanticTransparency.level`;
- read each candidate's `language`;
- append the language to the matching matrix bucket;
- remove duplicate language labels within the same level if exact duplicates occur;
- preserve a stable deterministic order based on candidate order or sorted language labels, to be decided by implementation;
- ignore null candidates;
- do not infer missing levels;
- do not create prose notes.

Example conceptual result:

- atomic: Albanian
- metaphorical: Latin, Sanskrit
- opaque: English

This is a structured matrix, not a score.

## Contrast detection rule

`hasContrast` is true when at least two of the matrix buckets are non-empty.

`hasContrast` is false when zero or one matrix bucket is non-empty.

The post-processor does not decide which bucket is better.

The post-processor does not mark atomic as winner.

The post-processor does not mark opaque as failure.

The post-processor only records that different transparency levels exist.

## Grouping level

The default grouping level is embryo chunk.

For a Heart segmentation with chunks `S + TU + DI`, the future derived output may include contrast objects per chunk.

If future artifacts need whole-segmentation contrast, that must be designed separately.

v0.1 should not mix chunk-level and word-level contrast in one field.

## Language-only matrix decision

Current Brain candidate contract does not define stable candidate ids.

Therefore v0.1 uses language-only matrix entries.

If multiple non-null candidates exist for the same chunk and same language but different transparency levels, the future implementation should either:

- include that language in multiple buckets and let review inspect ambiguity; or
- require a later candidate-id design before strict contrast validation.

Do not invent candidate ids in this design.

Do not add candidate ids in this PR.

## No prose generation rule

The deterministic post-processor must not generate natural-language contrast notes.

It must not produce fields like:

- `transparencyContrastNote`
- `contrastNote`
- `summary`
- `interpretation`
- `winnerReason`

Readable explanations belong in UI rendering or human review docs, not deterministic derived data.

The post-processor output must remain structured and auditable.

## No scoring rule

The post-processor must not produce:

- `score`
- `rank`
- `confidenceScore`
- `winner`
- `bestLanguage`
- `originVerdict`
- `historicalTruth`
- `provesOrigin`
- `languageWins`

The Zheji layer is enrichment, not scoring.

## CandidateType boundary

The post-processor must not read `candidateType` to compute transparency contrast.

The post-processor must not write `candidateType`.

The post-processor must not mutate `candidateType`.

`semanticTransparency.level = atomic` must not upgrade `candidateType`.

`symbolic.isPresent = true` must not upgrade `candidateType`.

Albanian atomic transparency must not upgrade `candidateType`.

## Raw vs normalized vs derived boundary

Raw Brain output:

- may contain candidate-level `analysisLayers` and `semanticTransparency` when the Zheji prompt contract is active;
- must not contain `transparencyContrast`.

Normalized Brain output:

- preserves candidate-level fields after safe normalization and validation;
- still should not contain derived `transparencyContrast` unless the implementation explicitly stores a combined derived view separately.

Derived enriched output:

- may contain `transparencyContrast`;
- must be distinguishable from raw Brain output;
- must be distinguishable from normalized Brain output.

Artifacts should preserve all three boundaries when available.

## Artifact placement implication

Future controlled artifacts should record:

- `rawBrainOutput`
- `normalizedBrainOutput`
- `zhejiDerivedOutput`
- `zhejiPostProcessor`
- `transparencyContrast`
- `claimBoundary`

The derived output should record:

- `postProcessorApplied`
- `postProcessorName`
- `postProcessorVersion`
- `inputSource`
- `contrastComputedFrom`
- `nullCandidatesExcluded`

Recommended values:

- `postProcessorName`: `detectTransparencyContrast`
- `contrastComputedFrom`: `semanticTransparency.level`
- `nullCandidatesExcluded`: true

## Report placement implication

Future reports should record:

- whether the post-processor ran;
- whether `transparencyContrast` was present in raw Brain output by mistake;
- whether matrix construction succeeded;
- whether `hasContrast` is true;
- matrix bucket contents;
- claim boundary;
- review notes written by human reviewer, not generated by the post-processor.

## Validation implication

Future validator policy should check:

- raw Brain output does not include `transparencyContrast`;
- derived output may include `transparencyContrast`;
- `hasContrast` is boolean;
- matrix buckets are arrays of strings;
- matrix buckets contain only languages from non-null candidates;
- null candidates do not contribute to the matrix;
- forbidden score/rank/winner/origin fields are absent;
- no prose contrast note field exists in v0.1.

This PR does not implement those checks.

## Existing Zheji lens compatibility

This post-processor does not reuse `src/engine/zhejiLens.ts`.

This post-processor does not reuse `src/lib/zhejiSummary.ts`.

Existing Zheji UI/path lens remains a word/vowel-path overlay.

Open Instrument derived contrast is candidate/chunk-level Brain-output enrichment.

Any future UI rendering may choose to display the matrix beside existing Zheji path summaries, but that requires a separate design.

## Non-goals

This PR does not implement the post-processor.

This PR does not implement prompt changes.

This PR does not implement validator changes.

This PR does not implement schema changes.

This PR does not implement runtime changes.

This PR does not run a model.

This PR does not replay artifacts.

This PR does not add candidate ids.

This PR does not score candidates.

This PR does not select a winner.

This PR does not prove origin.

This PR does not make Albanian an automatic winner.

This PR does not modify `candidateType`.

## Recommended next PR

Recommended next PR:

`docs(open-instrument): design zheji controlled replay plan`

Purpose:

- define the first controlled replay using the Zheji semantic transparency design stack;
- choose whether to replay `.003` as a clean baseline or `.004` as the hard-case path;
- define raw, normalized, and derived artifact fields;
- define metadata for prompt contract, validator policy, and post-processor;
- define acceptance criteria before any source implementation or model run.

Do not implement the post-processor before the controlled replay plan defines the artifact contract.

## Claim boundary

This is development post-processor design for embryo morpheme meaning analysis.

It is not external origin/truth evidence.

It is not candidate truth proof.

It is not historical origin proof.

It is not reason to change provider default from `mock`.

It is not reason to expand language/model scope without another controlled plan.
