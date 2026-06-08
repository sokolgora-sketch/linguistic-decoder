# Study Segmentation 004 Zheji Reinforced Replay Plan v0.1

## Purpose

This document plans one future controlled Zheji reinforced replay for `study.segmentation.004`.

This is a planning document only.

It does not run a model.

It does not create an artifact.

It does not modify source code.

It does not change provider defaults.

It does not start the `.004` replay.

## Background

The accepted stable baseline is:

- word: `study`
- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`
- voice path: `U → I`

The approved hard-case target is:

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- expected word-level voice path: `U → I`

The segmentation-comparison gate was merged in PR #1240.

PR #1240 approved `.004 / S + TU + DI` as the next hard-case target, but did not approve a model call.

This plan defines the exact future `.004` replay procedure.

## Prior evidence chain

Relevant recent PRs:

- PR #1236: reinforced the Zheji output skeleton
- PR #1237: archived first clean reinforced `.003 / SHTU + DI` replay
- PR #1238: archived clean reinforced `.003 / SHTU + DI` repeat
- PR #1239: reviewed and accepted `.003 / SHTU + DI` as structurally stable
- PR #1240: merged the `.003` to `.004` segmentation-comparison gate

The important decision from PR #1239:

- `.003 / SHTU + DI` is structurally stable under the reinforced Zheji output skeleton.

The important decision from PR #1240:

- `.004 / S + TU + DI` is the next hard-case target.
- `.004` still requires a separate planning PR before artifact capture.

This document is that planning PR.

## Replay target

Fixed target:

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks:
  - `S`
  - `TU`
  - `DI`

Voice path:

- word-level voice path: `U → I`

The model must not change the target.

Brain must not change:

- `study` to another word
- `study.segmentation.004` to another segmentationId
- `S + TU + DI` to another split
- `S` to `SH`
- `TU` to `STU`
- `DI` to `D + I`
- `.004` back to `.003`

## Provider path

Future replay provider path, if approved after this plan:

- provider: `openai_compat`
- model: `llama3.1:8b`
- base URL: `http://localhost:11434/v1`
- endpoint: `http://localhost:11434/v1/chat/completions`

Provider default must remain:

- `mock`

This plan does not approve provider default change.

This plan does not approve non-local provider use.

This plan does not use OpenAI API.

## Artifact paths for future replay

If a future artifact task is approved, use these paths.

Artifact JSON:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-08-study-heart-brain-llama3-1-8b-segmentation-004-zheji-reinforced-replay-v0.1.json`

Report markdown:

- `docs/open-instrument/study-segmentation-004-zheji-reinforced-replay-result-v0.1.md`

Do not overwrite:

- `.003` artifacts
- older `.004` prototype artifacts
- older `.004` timeout artifacts
- older `.004` reduced-language artifacts
- older `.004` enum-repair artifacts

## Prompt skeleton requirements

The future `.004` replay must use the reinforced skeleton discipline from PR #1236.

Required prompt anchors:

- `STRUCTURAL_CONTRACT`
- `LINGUISTIC_EVALUATION_RULES`
- `OUTPUT_JSON_SKELETON`

The output skeleton must be at the bottom of the user prompt.

The prompt must force top-level:

- `word`
- `segmentationId`
- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`

The prompt must forbid top-level:

- `candidates`

The prompt must forbid Brain from returning:

- `transparencyContrast`
- `transparencyContrastNote`

The prompt must forbid Brain from:

- scoring candidates
- ranking candidates
- choosing a winner
- claiming origin
- claiming historical truth
- mutating `candidateType`

## Required raw Brain output skeleton

Future raw Brain output must contain:

- `word`
- `segmentationId`
- `chunkCandidates`
- `nullCandidates`
- `warnings`
- `claimBoundary`

`chunkCandidates` must be an array.

`nullCandidates` must be an array.

`warnings` must be an array.

`claimBoundary` must be a non-null object.

If there are no warnings, Brain must return:

- `warnings: []`

Brain must not return top-level:

- `candidates`

If Brain returns top-level `candidates` instead of `chunkCandidates`, classify as structural failure.

## Required chunk coverage

The Heart-approved `.004` chunks are:

- `S`
- `TU`
- `DI`

Every chunk must be represented by at least one of:

- valid non-null candidate in `chunkCandidates`
- valid null-candidate record in `nullCandidates`

No chunk may disappear.

No candidate may use an unapproved chunk.

Approved chunks only:

- `S`
- `TU`
- `DI`

Disallowed chunk drift examples:

- `SHTU`
- `STU`
- `D`
- `I`
- `D + I`
- `S + T + U + DI`

## Required non-null candidate fields

Every object in `chunkCandidates` must include:

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

For non-null candidates:

- `nullCandidate` must be `false`
- `segmentationId` must equal `study.segmentation.004`
- `chunk` must be one of `S`, `TU`, `DI`
- `language` must be a non-empty string
- `candidateForm` must be a non-empty string
- `meaning` must be a non-empty string
- `functionFit` must use current repo-accepted values
- `sourceNote` must be a non-empty explanation string
- `evidenceType` must use current repo-accepted values
- `candidateType` must use current repo-accepted values
- `falseFriendRisk` must use current repo-accepted values
- `notes` must be a string

## Required null-candidate fields

Every object in `nullCandidates` must include:

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

- `nullCandidate` must be `true`
- `candidateType` must be `null_candidate`
- `segmentationId` must equal `study.segmentation.004`
- `chunk` must be one of `S`, `TU`, `DI`
- `sourceNote` must explain why no credible candidate was found
- `notes` must preserve traceability
- explanation fields must not be omitted

## Zheji enrichment requirements

Zheji fields remain additive.

They must not replace the structural Brain candidate schema.

Non-null candidates should include:

- `analysisLayers`
- `semanticTransparency`

`analysisLayers` should include:

- formal layer
- symbolic layer

Each analysis layer must include:

- `isPresent`
- `evidenceNote`

For `evidenceNote`:

- use a short string when evidence is present
- use `null` when evidence is not present
- do not omit `evidenceNote`

`semanticTransparency` should include:

- `level`
- `rationale`
- `decomposition`

If `decomposition` is uncertain, use:

- `decomposition: []`

Do not use:

- `decomposition: null`

Missing or partial Zheji enrichment is not allowed to collapse the structural Brain schema.

## Enrichment warning policy

If structural validation passes but enrichment is incomplete, classify as structurally valid with enrichment warnings.

Examples of enrichment warnings:

- missing `analysisLayers`
- missing `semanticTransparency`
- missing `analysisLayers.*.evidenceNote`
- `semanticTransparency.decomposition` is missing or malformed
- valid structure but partial transparency data

Enrichment warning must not be treated as structural failure if the base Brain schema is valid.

## Derived contrast policy

`transparencyContrast` remains derived.

Brain must not return it.

The post-processor may compute it only after raw parse, normalization, and validation.

The post-processor must not:

- choose a winner
- infer origin
- mutate `candidateType`
- use null candidates as transparency evidence

If transparency data is partial, derived contrast may be marked:

- partial
- unavailable

## Future classification names

Future `.004` artifact should use one of these classification names.

Clean result:

- `CLEAN_ZHEJI_STUDY004_REINFORCED_REPLAY`

Structurally valid but enrichment warnings:

- `ZHEJI_STUDY004_REINFORCED_ENRICHMENT_WARNING`

Structural failure:

- `ZHEJI_STUDY004_REINFORCED_STRUCTURAL_FAILURE`

Raw parse failure:

- `ZHEJI_STUDY004_RAW_PARSE_FAILURE`

Provider/model failure:

- `ZHEJI_STUDY004_PROVIDER_FAILURE`

Timeout:

- `ZHEJI_STUDY004_MODEL_CAPTURE_TIMEOUT`

Forbidden raw field failure:

- `ZHEJI_STUDY004_FORBIDDEN_RAW_FIELD_FAILURE`

Derived contrast failure:

- `ZHEJI_STUDY004_DERIVED_CONTRAST_FAILURE`

## Future success criteria

A future `.004` replay is clean only if:

- exactly one model call is made
- provider HTTP status is `200`
- raw parse ok is `true`
- top-level `word` equals `study`
- top-level `segmentationId` equals `study.segmentation.004`
- top-level `chunkCandidates` exists and is an array
- top-level `nullCandidates` exists and is an array
- top-level `warnings` exists and is an array
- top-level `claimBoundary` exists and is an object
- top-level `candidates` is absent
- every Heart-approved chunk is covered
- all non-null candidates preserve required Brain fields
- all null candidates preserve required traceability fields
- forbidden raw fields are absent
- structural issue count is `0`
- enrichment warning count is `0`
- derived contrast does not fail
- OpenAI API used is `false`
- provider default changed is `false`
- runtime wiring changed is `false`
- source files changed is `false`
- validator changed is `false`
- prompt source changed is `false`

## Acceptable warning result

A future `.004` replay may be accepted for review as warning-level evidence if:

- structural validation passes
- enrichment warnings exist
- derived contrast is partial or unavailable
- claim boundary remains intact
- provider default remains `mock`
- no forbidden raw fields are present

This must not be called fully clean.

It should be classified as:

- `ZHEJI_STUDY004_REINFORCED_ENRICHMENT_WARNING`

## Hard failure criteria

Classify as structural failure if:

- top-level `candidates` replaces `chunkCandidates`
- `chunkCandidates` is missing
- `nullCandidates` is missing
- `warnings` is missing
- `claimBoundary` is missing
- any approved chunk lacks candidate or null-candidate coverage
- candidate uses wrong segmentationId
- candidate uses unapproved chunk
- candidate omits required Brain fields
- null candidate omits traceability fields
- `candidateType` is missing
- `candidateType` is invalid
- `candidateType` is mutated by Zheji transparency
- `sourceNote` is missing
- `notes` is missing
- Brain returns `transparencyContrast`
- Brain returns `transparencyContrastNote`
- Brain scores, ranks, declares winner, or claims origin

## Preflight checks before future model call

Before any future `.004` model call, run preflight.

Required checks:

- repo on expected artifact branch
- repo has no unexpected changes
- main synced before branch creation
- old artifact path does not already exist
- old report path does not already exist
- `llama3.1:8b` is available from local Ollama
- local model endpoint responds
- plan-only runner confirms reinforced skeleton anchors
- plan-only runner confirms no model call
- plan-only runner confirms no artifact write
- provider default remains `mock`
- source/runtime/provider guard is clean
- no API/UI/runtime files changed
- no existing Zheji lens files changed
- no eval/Cohort/VoiceLab files changed

## Stop rules before future model call

Stop before model call if:

- branch is wrong
- repo is dirty before artifact capture
- target artifact already exists
- target report already exists
- local Ollama endpoint is unavailable
- `llama3.1:8b` is unavailable
- reinforced skeleton anchors are missing
- prompt allows top-level `candidates`
- prompt omits `nullCandidates`
- prompt omits `warnings`
- prompt omits `claimBoundary`
- provider default is not `mock`
- source/runtime files have changed unexpectedly
- operator cannot prove one-call-only capture

## Future model-call rule

If this plan is later followed, the future artifact task may make exactly one local model call.

Allowed:

- one call to local `llama3.1:8b`
- explicit `openai_compat` provider path
- local endpoint only
- raw provider response archived
- parsed raw Brain output archived
- validation result archived
- derived contrast output archived
- companion markdown report archived

Not allowed:

- multiple retries
- silent reruns
- provider fallback
- OpenAI API use
- provider default change
- source edits during artifact capture
- validator edits during artifact capture
- prompt source edits during artifact capture

## Future artifact report requirements

The future report must include:

- classification
- status
- fixed input
- provider path
- model call count
- OpenAI API used
- provider default changed
- raw parse result
- structural validation result
- enrichment validation result
- forbidden raw field result
- derived contrast result
- chunk coverage result
- structural issue preview
- enrichment warning preview
- claim boundary
- next action

## Required review after future artifact

A future `.004` artifact must be reviewed in a separate PR before any next step.

The review must compare `.004` against:

- stable `.003 / SHTU + DI`
- prior `.004` negative/diagnostic artifacts
- prior `.004` timeout artifacts
- prior `.004` reduced-language / enum-repair results where relevant

The review must decide whether the new `.004` result is:

- clean
- structurally valid with enrichment warnings
- structural failure
- provider failure
- timeout
- not comparable

## Claim boundary

This plan is development-only.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not language superiority evidence.

It is not a reason to change provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not modify `candidateType`.

It does not run `.004`.

## Plan decision

Decision:

- The `.004 / S + TU + DI` reinforced replay is planned but not executed.
- Exact fixed input is locked.
- Artifact/report paths are locked.
- Preflight and stop rules are locked.
- Classification names are locked.
- Review requirement is locked.
- Future artifact capture may be considered only after this plan is reviewed and merged.
