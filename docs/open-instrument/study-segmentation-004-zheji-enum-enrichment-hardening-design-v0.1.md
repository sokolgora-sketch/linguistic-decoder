# Study Segmentation 004 Zheji Enum and Enrichment Hardening Design v0.1

## Purpose

This document designs the next hardening step after the archived and reviewed Zheji `study.segmentation.004` reinforced replay artifact.

It responds to PR #1242 and PR #1243.

It does not run a model.

It does not create an artifact.

It does not modify source code.

It does not modify prompt helper source.

It does not modify validator source.

It does not change provider defaults.

It does not rerun `.004`.

## Current reviewed state

PR #1242 archived the first controlled `.004 / S + TU + DI` reinforced replay artifact.

PR #1243 reviewed that artifact and accepted it as valid diagnostic evidence.

Accepted classification:

- `ZHEJI_STUDY004_REINFORCED_STRUCTURAL_FAILURE`

Accepted status:

- `captured_with_issues`

Fixed input:

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- word-level voice path: `U → I`

Provider path:

- provider: `openai_compat`
- model: `llama3.1:8b`
- provider default: `mock`
- OpenAI API used: `false`

## What survived

The reinforced top-level Brain skeleton survived the harder `.004 / S + TU + DI` split.

The raw Brain output preserved:

- top-level `chunkCandidates`
- top-level `nullCandidates`
- top-level `warnings`
- top-level `claimBoundary`

Forbidden top-level `candidates` was absent.

This confirms that the PR #1236 output skeleton reinforcement worked at the top-level shape.

## What failed

The failure narrowed to two lower-level contracts.

Structural issue:

- `nullCandidates.0.candidateType` was not `null_candidate`
- `nullCandidates.1.candidateType` was not `null_candidate`
- `nullCandidates.2.candidateType` was not `null_candidate`

Enrichment warning:

- `chunkCandidates.0.semanticTransparency.level` was empty
- `chunkCandidates.1.semanticTransparency.level` was empty
- `chunkCandidates.2.semanticTransparency.level` was empty

Derived contrast:

- no valid transparency candidate count
- contrast partial
- unavailable reason: `no_valid_semantic_transparency`

## Open Instrument framing correction

Open Instrument is not an etymology engine.

It does not trace historical derivation chains.

It does not claim origin.

It does not declare a winner.

It does not prove which language owns a word.

Open Instrument is a meaning-motivation finder.

The core question is:

- Which language candidates can motivate the meaning and function of the target word's embryo morphemes through that language's own smallest meaningful units?

For `study`, Open Instrument does not ask:

- Where did `study` historically come from?

It asks:

- Which candidate languages can explain what `study` does as a function?

For `study.segmentation.004 / S + TU + DI`, the Brain should inspect whether each chunk can be functionally motivated without making origin claims.

## Required artifact sentence

Future Zheji artifacts should include this framing sentence:

"This artifact records which language candidates can motivate the meaning and function of the target word's embryo morphemes. It does not claim origin, history, or linguistic ownership."

This sentence is framing only.

It does not change schema.

It does not weaken validation.

## Zheji terminology anchors

The design accepts three Zheji terminology anchors as documentation and prompt-language support.

### Free operator

Zheji's `operatorët e lirë` means free operators.

In Open Instrument, a free operator is the closest prior-art term to embryo morpheme.

Distinction:

- embryo morpheme emphasizes candidate status and instrument caution;
- free operator emphasizes combinatorial independence and functional mobility.

Open Instrument should use both carefully.

Suggested wording:

- "Assess whether the embryo morpheme behaves as a free operator: a minimal meaningful unit that can combine while preserving functional force."

### Code F

Code F means formal conceptual logic.

Open Instrument mapping:

- Code F maps to `analysisLayers.formal`.

A formal layer is present when the candidate has documented historical, comparative, dictionary, or conventional linguistic support.

Code F does not override the symbolic layer.

Code F does not declare origin.

### Code E

Code E means essential symbolic logic.

Open Instrument mapping:

- Code E maps to `analysisLayers.symbolic`.

A symbolic layer is present when the candidate motivates the function through symbolic, directional, vowel-doctrine, geometric, or action-structure alignment.

Code E does not override the formal layer.

Code E does not declare origin.

## Functional identity card prompt phrase

Future Brain prompts may use this instruction:

"For each candidate, assess whether it provides a functional identity card for the embryo — can it explain why this unit means what it means, using that language's own free operators?"

This phrase is accepted as prompt wording.

It must not become a schema field.

It must not imply origin.

It must not imply language ownership.

## Rejected or postponed ideas

The following ideas are useful but out of scope for this design.

### polarInversion

Do not add `polarInversion` now.

Reason:

- it is a new schema field;
- it expands the semantic model beyond the current failure;
- the current failure is narrower: null-candidate enum obedience and empty transparency levels.

`polarInversion` may be considered later in a separate design PR for Code E / symbolic-axis modeling.

It must not be smuggled into the current enum/enrichment hardening work.

### vector conservation schema

Do not add a vector-conservation schema now.

Reason:

- it would require new schema fields or new validation semantics;
- it risks scope drift;
- current priority is deterministic repair of existing fields.

Vector-conservation language may appear as explanatory prompt language later, but not as a field in this lane.

## Hardening target

The next implementation should harden exactly two things:

1. Null-candidate enum obedience.
2. Non-empty semantic transparency level on non-null candidates.

It should not change the top-level skeleton.

It should not add new schema fields.

It should not modify provider defaults.

It should not broaden to another word.

It should not rerun the model inside the implementation PR.

## Null-candidate enum hardening

### Required rule

Every object in `nullCandidates` must use:

- `candidateType: "null_candidate"`

This must be exact.

Rejected values include:

- `null`
- empty string
- `none`
- `opaque`
- `weak_resonance`
- `phonetic_only`
- `unknown`
- array-wrapped values
- object-wrapped enum values

### Prompt hardening

The reinforced prompt should explicitly state:

- "If a chunk is represented in nullCandidates, candidateType must be exactly null_candidate."
- "Do not use weak_resonance, opaque, unknown, none, or empty string for nullCandidates[].candidateType."
- "nullCandidates are not low-confidence chunk candidates; they are explicit no-candidate records."

### Output skeleton hardening

The output skeleton should include a null-candidate example.

Current pressure point:

- the model saw `nullCandidates: []`;
- under `.004` pressure, it created null candidates but did not preserve the enum.

Design correction:

- keep `nullCandidates` as a top-level array;
- include one null-candidate object example in the skeleton or nearby contract text;
- ensure the example uses `candidateType: "null_candidate"` exactly.

The skeleton should still not force real null candidates when not needed.

The instruction should explain that the example is shape guidance.

### Validator stance

Do not weaken the validator.

If `nullCandidates[].candidateType` is not `null_candidate`, keep it as a structural failure.

This remains a hard failure because null-candidate traceability is part of the Brain structural contract.

## Semantic transparency level hardening

### Required rule

Every non-null candidate in `chunkCandidates` should include:

- `semanticTransparency.level`

Allowed values:

- `atomic`
- `metaphorical`
- `opaque`

The field should not be empty.

The field should not be null.

The field should not be omitted when `semanticTransparency` is present.

### Meaning of levels

`atomic` means:

- the candidate language can motivate the embryo function directly through a smallest meaningful unit or free operator;
- no major conceptual leap is needed;
- this is functional motivation, not origin evidence.

`metaphorical` means:

- the candidate language can motivate the embryo function through an indirect symbolic or conceptual mapping;
- the relation is meaningful but not direct;
- this is still not origin evidence.

`opaque` means:

- the candidate exists only as a weak, frozen, phonetic, borrowed, or unclear residue;
- it does not directly explain the function;
- it may still be recorded as a candidate if the Brain has a reason to preserve it.

### Fallback rule

If uncertain, use:

- `semanticTransparency.level: "opaque"`

Do not use:

- empty string
- null
- unknown
- none
- uncertain
- missing level

This is a deterministic fallback.

It allows derived contrast to remain computable without inventing strength.

### Prompt hardening

The prompt should state:

- "semanticTransparency.level must be one of atomic, metaphorical, opaque."
- "If uncertain, use opaque."
- "Do not leave semanticTransparency.level empty."
- "Do not use null for semanticTransparency.level."
- "atomic is functional motivation, not origin proof."

### Validator stance

Do not convert empty `semanticTransparency.level` into structural failure.

Keep it as enrichment warning if the base Brain structure is valid.

Reason:

- semantic transparency is additive;
- the structural contract must remain the hard boundary;
- enrichment failure should not collapse a structurally valid Brain output.

However, a run with empty transparency levels cannot classify as clean.

It should classify as enrichment warning if structural validation passes.

## Null candidates and transparency validation

Null candidates should not participate in transparency validation.

Null candidates should not participate in derived contrast.

Reason:

- null candidates mean the Brain did not find a credible candidate for that chunk;
- transparency level only applies to non-null candidates;
- adding transparency to null candidates would create fake semantic evidence.

The post-processor should record that null candidates are excluded.

Suggested derived metadata:

- `nullCandidatesExcluded: true`

This is post-processor metadata only if already supported.

Do not add it as a required Brain field.

## Derived contrast policy

The Brain must not return:

- `transparencyContrast`
- `transparencyContrastNote`

The post-processor remains the only component allowed to compute derived contrast.

Derived contrast should group non-null candidate languages by valid `semanticTransparency.level`.

If there are no valid levels, derived contrast should be partial or unavailable.

If valid levels exist for some candidates but not others, derived contrast should be partial.

If all non-null candidates have valid levels, derived contrast may be complete.

The post-processor must not declare winner.

The post-processor must not infer origin.

The post-processor must not mutate `candidateType`.

## Open Instrument prompt framing

Future prompt language should explicitly say:

- "This is not an etymology task."
- "Do not find origin."
- "Do not choose a winner."
- "Find candidates that can motivate the function or action of the embryo morpheme through the language's own smallest meaningful units."
- "For each candidate, ask whether it provides a functional identity card for the embryo."
- "A strong functional motivator is not an origin claim."
- "Albanian may be transparent when it preserves a free operator, but transparency is not ownership."

This should reduce language-superiority drift and origin hallucination.

## No Albanian privilege rule

The Zheji terminology may explain why Albanian often appears structurally transparent.

But Open Instrument must not privilege Albanian by default.

Rule:

- Any language preserving the same functional operator with equal clarity may receive the same transparency level.

Albanian transparency is evidence of functional motivation only.

It is not historical ownership.

It is not origin proof.

It is not superiority proof.

## Implementation PR scope after this design

After this design lands, a separate implementation PR may update:

- reinforced `.004` prompt skeleton text;
- shared Zheji prompt helper text;
- focused guard tests for null-candidate enum fallback;
- focused guard tests for semanticTransparency.level fallback;
- focused guard tests that no new schema fields were added;
- focused guard tests that top-level skeleton is unchanged.

Implementation PR should not:

- run a model;
- create artifacts;
- change provider default;
- change runtime/API/UI wiring;
- add `polarInversion`;
- add vector-conservation schema;
- change the hard structural validator into a soft validator.

## Required implementation tests

The implementation PR should prove that prompt/helper text includes:

- `candidateType: "null_candidate"` for null candidates;
- "semanticTransparency.level must be one of atomic, metaphorical, opaque";
- "If uncertain, use opaque";
- "Do not leave semanticTransparency.level empty";
- "Open Instrument is not an etymology task";
- "functional identity card";
- "free operator";
- "Code F";
- "Code E";
- "No origin";
- "No winner";
- "Do not add polarInversion";
- "Do not add vector-conservation fields";

The tests should also prove that:

- `transparencyContrast` remains forbidden from Brain output;
- `transparencyContrastNote` remains forbidden from Brain output;
- top-level `candidates` remains forbidden;
- top-level `chunkCandidates`, `nullCandidates`, `warnings`, and `claimBoundary` remain required.

## Future replay policy

No `.004` rerun should happen until:

1. this design PR lands;
2. implementation PR lands;
3. implementation review passes;
4. preflight confirms the prompt includes enum and enrichment hardening;
5. artifact/report paths are locked;
6. one-call rule is re-confirmed.

The next replay, if approved later, should still be exactly:

- word: `study`
- segmentationId: `study.segmentation.004`
- chunks: `S + TU + DI`
- model: local `llama3.1:8b`
- provider: `openai_compat`
- provider default: `mock`

## Stop rules

Stop before implementation if a proposed patch:

- adds new schema fields;
- adds `polarInversion`;
- adds vector-conservation fields;
- changes provider default;
- weakens structural validation;
- allows top-level `candidates`;
- removes `nullCandidates`;
- removes `warnings`;
- removes `claimBoundary`;
- lets Brain return `transparencyContrast`;
- lets Brain return `transparencyContrastNote`;
- frames the task as origin search;
- frames the result as historical proof;
- privileges Albanian as origin by default.

## Claim boundary

This design is development-only.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not language superiority evidence.

It is not a reason to change provider default from `mock`.

It does not declare a winner.

It does not declare origin.

It does not mutate `candidateType`.

## Final decision

Proceed with design-first hardening.

Accepted now:

- meaning-motivation finder framing;
- free operator terminology;
- Code F / Code E terminology;
- functional identity card prompt phrase;
- null-candidate enum hardening;
- semanticTransparency.level hardening;
- allowed transparency levels: `atomic`, `metaphorical`, `opaque`;
- deterministic `opaque` fallback when uncertain.

Rejected for this lane:

- `polarInversion` field;
- vector-conservation schema;
- origin framing;
- Albanian privilege;
- immediate rerun.

Next action after this design is merged:

- implementation PR for prompt/helper/test hardening only;
- no model call in implementation PR.
