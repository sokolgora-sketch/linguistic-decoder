# Zheji Study003 Replay Artifact Review v0.1

## Status

This is a review document only.

It reviews the archived Zheji `study.segmentation.003` replay artifact from PR #1233.

It does not run a model.

It does not rerun the artifact.

It does not create a new artifact.

It does not modify source code.

It does not modify prompt source.

It does not modify validator source.

It does not modify provider defaults.

It does not modify runtime, API, or UI wiring.

It does not run `.004`.

## Reviewed artifact

Artifact:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-003-zheji-replay-v0.1.json`

Report:

- `docs/open-instrument/study-segmentation-003-zheji-replay-result-v0.1.md`

Merged in:

- PR #1233
- merge SHA: `dde5dae`

## Fixed input reviewed

The replay used the fixed Heart-approved input:

- word: `study`
- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`
- voice path: `U → I`

The reviewed replay used the clean baseline segmentation, not the later hard-case `.004 / S + TU + DI`.

## Provider reviewed

The replay used:

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`

Execution boundaries:

- exactly one local model call
- no OpenAI API
- provider default remained `mock`
- no source changes
- no runtime changes
- no prompt source changes
- no validator source changes
- no provider-default changes

## Artifact classification reviewed

The artifact classification is accepted as correct:

- `VALIDATION_FAILURE_AFTER_ZHEJI`

The status is accepted as correct:

- `captured_with_issues`

The classification should not be changed to clean.

The classification should not be softened.

The artifact should not be rerun to chase a cleaner result.

## Execution proof reviewed

The artifact recorded:

- `modelCallMade: true`
- `attemptCount: 1`
- `openAiApiUsed: false`
- `providerDefaultChanged: false`
- `validatorChanged: false`
- `promptSourceChanged: false`
- `sourceFilesChanged: false`

This satisfies the one-call artifact boundary.

## Parse result reviewed

The raw model output parsed successfully.

Reviewed value:

- raw parse ok: `true`

This matters because the failure was not JSON extraction failure.

The model produced parseable JSON.

## Brain schema validation reviewed

Brain validation failed.

Reviewed values:

- brain validation ok: `false`
- brain validation issue count: `10`

Primary Brain schema failures:

- missing required top-level `chunkCandidates`
- missing required top-level `nullCandidates`
- missing required top-level `warnings`
- missing required top-level `claimBoundary`
- `chunkCandidates` was not an array because it was missing
- `nullCandidates` was not an array because it was missing
- `warnings` was not an array because it was missing
- `claimBoundary` was not an object because it was missing
- no valid candidate/null-candidate result for Heart chunk `SHTU`
- no valid candidate/null-candidate result for Heart chunk `DI`

The model used:

- top-level `candidates`

The strict Open Instrument schema requires:

- top-level `chunkCandidates`
- top-level `nullCandidates`
- top-level `warnings`
- top-level `claimBoundary`

Therefore the Brain schema failure is real.

## Candidate shape reviewed

The model candidate objects used this minimal shape:

- `chunk`
- `analysisLayers`
- `semanticTransparency`

This is useful because it shows the model responded to the Zheji semantic-enrichment request.

It is invalid because it omitted required Brain candidate fields, including:

- `segmentationId`
- `language`
- `candidateForm`
- `meaning`
- `functionFit`
- `sourceNote`
- `evidenceType`
- `candidateType`
- `falseFriendRisk`
- `nullCandidate`
- `notes`

The model gave Zheji enrichment without preserving the base Brain schema.

That is the core failure boundary.

## Zheji validation reviewed

Zheji validation failed.

Reviewed values:

- Zheji validation ok: `false`
- Zheji validation issue count: `8`

Zheji validation issues:

- `analysisLayers.*.evidenceNote` was missing where the layer was false
- `semanticTransparency.decomposition` was `null` where the validator expects an array of non-empty strings when present

The model included the requested Zheji fields.

The model did not fully satisfy their shape contract.

This is a partial Zheji response, not a clean Zheji response.

## Forbidden raw fields reviewed

The artifact recorded:

- forbidden raw field found: `false`

This means Brain did not return forbidden fields such as:

- `transparencyContrast`
- `transparencyContrastNote`
- score
- rank
- winner
- origin verdict
- historical truth proof
- language-wins field

This is a positive result.

The model respected the no-winner and no-origin boundary better than it respected the structural schema.

## Missing Zheji fields reviewed

The artifact recorded:

- missing Zheji fields: `false`

This is a positive result.

The model did include:

- `analysisLayers`
- `semanticTransparency`

Therefore the first Zheji replay did not fail because the model ignored the Zheji task.

It failed because the model compressed the overall output schema.

## Derived contrast reviewed

The artifact recorded:

- derived contrast ok: `true`

However, the derived language matrix is not meaningful as language-level evidence because the model omitted candidate `language`.

This confirms the post-processor can execute, but the input was structurally insufficient.

Derived contrast should not be interpreted as supporting any language.

Derived contrast should not be used to declare a winner.

Derived contrast should not be used to infer origin.

Derived contrast should not mutate `candidateType`.

## Conceptual result

This artifact is a useful captured failure.

The model partially understood the semantic-enrichment layer.

The model returned candidate-level Zheji fields.

The model did not obey the strict Brain schema.

Therefore the current bottleneck is schema obedience, not the basic concept of semantic transparency.

## What this supports

This review supports the following conclusions:

- Zheji semantic transparency is worth continuing.
- The model can produce `analysisLayers`.
- The model can produce `semanticTransparency`.
- The model respected the no-winner/no-origin boundary.
- The strict Brain schema must be reinforced before another local replay.
- The runner/prompt contract needs stronger explicit output skeleton pressure before any rerun or `.004` replay.

## What this does not support

This review does not support:

- declaring the replay clean
- rerunning immediately
- running `.004` immediately
- changing provider default
- changing validator logic
- weakening validation
- treating the derived contrast matrix as evidence
- declaring a winner
- declaring origin
- declaring historical proof
- declaring candidate truth proof
- claiming model-quality evidence

## Review decision

Accepted classification:

- `VALIDATION_FAILURE_AFTER_ZHEJI`

Accepted interpretation:

- parseable local model output
- partial Zheji semantic-enrichment compliance
- strict Brain schema failure
- Zheji shape failure
- no forbidden winner/origin behavior
- no missing Zheji fields
- derived contrast executable but not meaningful without language fields

The artifact should remain archived as captured-with-issues evidence.

No rerun should be made from this review PR.

## Recommended next PR

Recommended next PR:

`docs(open-instrument): design zheji study003 schema reinforcement`

Purpose:

- define how to reinforce the Brain output skeleton before another model call;
- require exact top-level keys:
  - `word`
  - `segmentationId`
  - `chunkCandidates`
  - `nullCandidates`
  - `warnings`
  - `claimBoundary`
- require non-null candidates to preserve all existing Brain candidate fields;
- require Zheji fields as additive only;
- require `analysisLayers.*.evidenceNote` as string or null;
- require `semanticTransparency.decomposition` to be omitted when uncertain, not set to null;
- preserve no-winner/no-origin/no-candidateType-mutation boundaries;
- keep provider default as `mock`;
- do not run a model in that design PR.

After that design PR, a later implementation PR may update the runner/prompt helper.

Only after implementation and review should another `.003` replay or `.004` replay be considered.

## Claim boundary

This review is development evidence for embryo morpheme meaning/function motivation analysis.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not language superiority evidence.

It is not a reason to change provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not modify `candidateType`.
