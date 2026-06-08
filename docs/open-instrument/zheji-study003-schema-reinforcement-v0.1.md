# Zheji Study003 Schema Reinforcement v0.1

## Status

This is a schema reinforcement design document only.

It does not run a model.

It does not rerun `study.segmentation.003`.

It does not run `study.segmentation.004`.

It does not create an artifact.

It does not modify source code.

It does not modify prompt source.

It does not modify validator source.

It does not modify provider defaults.

It does not modify runtime, API, or UI wiring.

## Reason for this document

PR #1233 archived the first controlled Zheji `study.segmentation.003` replay artifact.

PR #1234 reviewed that artifact and accepted the classification:

- `VALIDATION_FAILURE_AFTER_ZHEJI`

The review found that the model partially understood the Zheji semantic-enrichment request.

The model returned:

- `analysisLayers`
- `semanticTransparency`

However, the model failed strict Open Instrument Brain schema obedience.

The model returned top-level:

- `word`
- `segmentationId`
- `candidates`

The required Open Instrument Brain output skeleton is:

- `word`
- `segmentationId`
- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`

Therefore the next step is not a rerun.

The next step is to design stronger schema reinforcement before another model call.

## Reviewed failure boundary

The first Zheji `.003 / SHTU + DI` replay failed because Brain compressed the output shape.

It kept the new Zheji enrichment fields but dropped the base Brain candidate-search schema.

This is the wrong shape:

- top-level `candidates`
- candidate objects with only:
  - `chunk`
  - `analysisLayers`
  - `semanticTransparency`

This is the required shape:

- top-level `chunkCandidates`
- top-level `nullCandidates`
- top-level `warnings`
- top-level `claimBoundary`
- candidate objects preserving every existing Brain candidate field
- Zheji fields added only as additive fields

## Goal

The goal is to reinforce the required Brain output skeleton before any future Zheji replay.

The model must understand that Zheji fields are additive.

The model must not replace or compress the existing schema.

The model must not invent an alternate schema.

The model must not use top-level `candidates`.

The model must not omit `chunkCandidates`.

The model must not omit `nullCandidates`.

The model must not omit `warnings`.

The model must not omit `claimBoundary`.

## Reinforcement principle

The reinforced contract must be split into two explicit sections.

Section 1 is the structural contract.

Section 2 is the enrichment contract.

The structural contract is non-negotiable.

The enrichment contract is additive and gracefully degradable.

The model must satisfy the structural contract before attempting enrichment.

If the model cannot fill enrichment fields cleanly, it should preserve the structural contract and omit or null-safe the enrichment fields according to the warning policy.

The model must never collapse the structural contract in order to satisfy the enrichment contract.

## Failure classes

Future review and validation should distinguish two classes.

### STRUCTURAL_FAILURE

Structural failures are hard failures.

They include:

- missing top-level `word`
- missing top-level `segmentationId`
- missing top-level `chunkCandidates`
- missing top-level `nullCandidates`
- missing top-level `warnings`
- missing top-level `claimBoundary`
- use of top-level `candidates` instead of `chunkCandidates`
- missing required base candidate fields
- invalid enum values on existing Brain fields
- missing `language`
- missing `candidateForm`
- missing `meaning`
- missing `functionFit`
- missing `sourceNote`
- missing `evidenceType`
- missing `candidateType`
- missing `falseFriendRisk`
- missing `nullCandidate`
- missing required traceability on null candidates
- malformed or missing `claimBoundary`

A structural failure means the artifact is captured with issues and is not clean.

### ENRICHMENT_WARNING

Enrichment warnings are soft warnings.

They include:

- missing `analysisLayers`
- missing `semanticTransparency`
- missing `analysisLayers.*.evidenceNote`
- `semanticTransparency.decomposition` omitted
- `semanticTransparency.decomposition` set to null
- incomplete symbolic evaluation
- unavailable semantic transparency for a candidate

An enrichment warning does not by itself make the base Brain output structurally invalid.

It means the Zheji layer is incomplete for that candidate.

The artifact may still be structurally accepted if all required Brain fields pass.

The report must record enrichment warnings clearly.

The derived contrast post-processor should compute only from valid present `semanticTransparency.level` values.

If enrichment fields are missing, derived contrast should mark the matrix partial or unavailable rather than invent values.

## Non-goals

This design does not:

- weaken structural validation
- add automatic repair for missing structural fields
- accept top-level `candidates` as an alias for `chunkCandidates`
- make `language` optional
- make `candidateType` optional
- make `sourceNote` optional
- make `warnings` optional
- make `claimBoundary` optional
- declare winner
- declare origin
- declare history
- declare candidate truth
- change provider default from `mock`
- run `.004`
- run a model

## Required top-level object

Future Zheji replay Brain output must use this exact top-level skeleton:

- `word`
- `segmentationId`
- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`

No replacement top-level candidate array is allowed.

Specifically forbidden top-level replacements:

- `candidates`
- `results`
- `analyses`
- `languages`
- `chunks`
- `items`

If Brain returns top-level `candidates`, the output must be classified as schema failure.

It must not be silently accepted.

## Required top-level field: word

`word` must be present.

`word` must be a string.

For the next `.003` replay, `word` must be exactly:

- `study`

## Required top-level field: segmentationId

`segmentationId` must be present.

`segmentationId` must be a string.

For the next `.003` replay, `segmentationId` must be exactly:

- `study.segmentation.003`

Every candidate and null candidate must copy the same `segmentationId`.

No candidate may use a missing, alternate, shortened, or malformed segmentation id.

## Required top-level field: chunkCandidates

`chunkCandidates` must be present.

`chunkCandidates` must be an array.

It may be empty only if every Heart-approved chunk is represented in `nullCandidates`.

For the next `.003` replay, every candidate must use one of the Heart-approved chunks:

- `SHTU`
- `DI`

No other chunk string is allowed.

Allowed:

- `SHTU`
- `DI`

Forbidden:

- `STU`
- `S`
- `TU`
- `D`
- `I`
- `SHT`
- `UDI`
- any lowercase or transformed chunk not explicitly approved by Heart

## Required top-level field: nullCandidates

`nullCandidates` must be present.

`nullCandidates` must be an array.

It may be empty only if every Heart-approved chunk has at least one valid object in `chunkCandidates`.

Null candidates must preserve traceability.

Each null candidate must include:

- `chunk`
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

For null candidates:

- `candidateType` must be `null_candidate`
- `nullCandidate` must be `true`
- `sourceNote` must explain why no credible candidate was provided
- `notes` must be a non-empty audit note when required by current validation

## Required top-level field: warnings

`warnings` must be present.

`warnings` must be an array.

If there are no warnings, use an empty array.

Correct empty form:

- `warnings: []`

Wrong forms:

- omitted `warnings`
- `warnings: null`
- `warnings: "none"`
- `warnings: {}`

## Required top-level field: claimBoundary

`claimBoundary` must be present.

`claimBoundary` must be a non-null object.

It must explicitly preserve the development-only boundary.

Required claim boundary values:

- originClaim: false
- winnerClaim: false
- historicalProof: false
- candidateTruthProof: false
- modelQualityEvidence: false
- providerDefaultChangeReason: false

The names must match the current validator contract when implemented.

The purpose is to prevent the model from treating semantic transparency as origin proof.

## Required non-null candidate fields

Every object in `chunkCandidates` must preserve the existing Brain candidate schema.

Each non-null candidate must include:

- `chunk`
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

Zheji fields must be added after preserving those fields.

Target additive Zheji fields on non-null candidates:

- `analysisLayers`
- `semanticTransparency`

These fields are requested for Zheji enrichment.

They are additive and should be present when the model can provide them without damaging the structural contract.

Missing Zheji enrichment fields should be classified as `ENRICHMENT_WARNING`, not `STRUCTURAL_FAILURE`.

The candidate object must not collapse to only:

- `chunk`
- `analysisLayers`
- `semanticTransparency`

That minimal form was the exact failure in PR #1233.

## Required candidate field: chunk

`chunk` must be present.

`chunk` must be one of the Heart-approved chunks.

For the next `.003` replay:

- `SHTU`
- `DI`

The model must not create new chunks.

The model must not split `SHTU` into `S + TU`.

The model must not replace `SHTU` with `STU`.

The model must not replace `DI` with `D + I`.

## Required candidate field: segmentationId

Every candidate must include `segmentationId`.

For the next `.003` replay, every candidate must use:

- `study.segmentation.003`

This field must not be omitted.

This field must not differ from the top-level `segmentationId`.

## Required candidate field: language

Every non-null candidate must include `language`.

`language` must be a non-empty string.

This is required because derived transparency contrast groups candidate languages by `semanticTransparency.level`.

If `language` is missing, derived contrast may execute but cannot be interpreted as language-level evidence.

This was observed in PR #1233.

## Required candidate field: candidateForm

Every non-null candidate must include `candidateForm`.

`candidateForm` must be a non-empty string.

It should contain the proposed candidate form for the chunk.

It must not be replaced by the chunk alone unless the candidate form is genuinely the same as the chunk.

## Required candidate field: meaning

Every non-null candidate must include `meaning`.

`meaning` must be a non-empty string.

It should describe the candidate meaning in plain language.

It must not be replaced by only a Zheji transparency reason.

## Required candidate field: functionFit

Every non-null candidate must include `functionFit`.

`functionFit` must use the current repo-accepted value set.

Zheji semantic transparency does not replace `functionFit`.

Zheji semantic transparency may explain the function, but the base field must remain.

## Required candidate field: sourceNote

Every non-null candidate must include `sourceNote`.

`sourceNote` must be a non-empty string.

It must state the evidence basis or the limitation.

It must not be replaced by:

- `meaning`
- `analysisLayers`
- `semanticTransparency`
- `notes`
- `candidateType`

## Required candidate field: evidenceType

Every non-null candidate must include `evidenceType`.

`evidenceType` must use the current repo-accepted value set.

Zheji symbolic alignment does not create a new evidence type.

Zheji fields must not mutate this field.

## Required candidate field: candidateType

Every non-null candidate must include `candidateType`.

`candidateType` must use the current repo-accepted value set.

Zheji fields must not mutate `candidateType`.

Atomic transparency does not upgrade `candidateType`.

Symbolic presence does not upgrade `candidateType`.

Albanian transparency does not upgrade `candidateType`.

No language gets privileged candidate-type treatment from the Zheji layer.

## Required candidate field: falseFriendRisk

Every non-null candidate must include `falseFriendRisk`.

`falseFriendRisk` must use the current repo-accepted value set.

Zheji semantic transparency does not remove false-friend risk.

Zheji semantic transparency does not prove linguistic truth.

## Required candidate field: nullCandidate

Every candidate in `chunkCandidates` must include `nullCandidate`.

For non-null candidates:

- `nullCandidate: false`

For objects in `nullCandidates`:

- `nullCandidate: true`

This field must not be omitted.

## Required candidate field: notes

Every candidate should preserve the existing `notes` contract.

If the current validator requires non-empty notes, Brain must provide non-empty notes.

If notes are optional under the current validator, Brain should still include an empty array or approved empty value only if accepted by current validation.

Zheji fields do not replace `notes`.

## Additive Zheji field: analysisLayers

Every non-null candidate should include `analysisLayers`.

If `analysisLayers` is missing but the base Brain candidate schema is otherwise valid, classify it as `ENRICHMENT_WARNING`.

Do not classify missing `analysisLayers` as `STRUCTURAL_FAILURE`.

The structural candidate fields remain more important than the enrichment fields.

`analysisLayers` must contain:

- `formal`
- `symbolic`

Each layer must contain:

- `isPresent`
- `evidenceNote`

`isPresent` must be boolean.

`evidenceNote` must be string or null.

If `isPresent` is true:

- `evidenceNote` must be a short non-empty reason.

If `isPresent` is false:

- `evidenceNote` should be null, not omitted.

If `evidenceNote` is missing while the base Brain schema is otherwise valid, classify it as `ENRICHMENT_WARNING`.

Wrong form:

- symbolic is false but `evidenceNote` is missing

Correct form:

- symbolic is false
- evidenceNote is null

## Additive Zheji field: semanticTransparency

Every non-null candidate should include `semanticTransparency`.

If `semanticTransparency` is missing but the base Brain candidate schema is otherwise valid, classify it as `ENRICHMENT_WARNING`.

Do not classify missing `semanticTransparency` as `STRUCTURAL_FAILURE`.

The structural candidate fields remain more important than the enrichment fields.

`semanticTransparency` must contain:

- `level`
- `reason`

Allowed `level` values:

- `atomic`
- `metaphorical`
- `opaque`

`reason` must be a short auditable string.

`decomposition` is optional.

If `decomposition` is present, it must be an array of non-empty strings.

If uncertain, omit `decomposition`.

Do not set:

- `decomposition: null`

The `decomposition: null` form caused validation issues in PR #1233.

If `decomposition` is null while the base Brain schema is otherwise valid, classify it as `ENRICHMENT_WARNING`.

The better model behavior is to omit `decomposition` when uncertain.

## Fields Brain must not return

Brain must not return:

- `transparencyContrast`
- `transparencyContrastNote`
- score
- rank
- winner
- originVerdict
- historicalTruth
- provesOrigin
- isOrigin
- languageWins

If Brain returns any of these fields, the output must be classified as boundary violation or validation failure.

## Derived contrast boundary

`transparencyContrast` is not a Brain field.

It is computed after Brain output is parsed and validated.

The post-processor reads candidate-level `semanticTransparency.level`.

The post-processor groups candidate languages into:

- atomic
- metaphorical
- opaque

The post-processor must not:

- score candidates
- rank candidates
- choose a winner
- infer origin
- mutate `candidateType`
- interpret missing `language` as valid language-level evidence

If candidates omit `language`, derived contrast may execute but must be marked non-interpretable as language-level evidence.

## Prompt reinforcement requirement

Before the next `.003` replay, the prompt/runner helper should include a strict output skeleton reminder.

The reminder should explicitly say:

- Return exactly one JSON object.
- Use top-level `chunkCandidates`, not `candidates`.
- Use top-level `nullCandidates`, even if empty.
- Use top-level `warnings`, even if empty.
- Use top-level `claimBoundary`.
- Preserve all existing Brain candidate fields.
- Add `analysisLayers` and `semanticTransparency` only as additive fields.
- Do not replace existing fields with Zheji fields.
- Do not return `transparencyContrast`.
- Do not return `transparencyContrastNote`.
- Do not score, rank, choose winner, claim origin, or mutate `candidateType`.

## Replay gating requirement

No new model call should happen until schema reinforcement is designed and reviewed.

A future implementation PR may update the runner/prompt helper.

After implementation, the next replay should still target `.003 / SHTU + DI`.

Do not run `.004 / S + TU + DI` until `.003` is structurally stable with Zheji fields active.

## Recommended implementation sequence

After this design PR, recommended next PR:

`feat(open-instrument): reinforce zheji study003 output skeleton`

Purpose:

- update the plan-only runner/prompt helper
- add explicit output skeleton pressure
- add focused tests proving the prompt demands exact top-level keys
- add focused tests proving Brain is forbidden from top-level `candidates`
- add focused tests proving Zheji fields are additive only
- add focused tests distinguishing `STRUCTURAL_FAILURE` from `ENRICHMENT_WARNING`
- add focused tests proving missing enrichment does not collapse a structurally valid Brain output
- do not run a model
- do not create an artifact
- do not change provider default

Then:

1. Review the implementation PR.
2. Run one controlled `.003` replay.
3. Archive the result.
4. Review the result.
5. Only then consider `.004`.

## Claim boundary

This schema reinforcement design is development-only.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not language superiority evidence.

It is not a reason to change provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not modify `candidateType`.

It does not weaken validation.
