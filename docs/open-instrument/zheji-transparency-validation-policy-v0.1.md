# Zheji Transparency Validation Policy v0.1

## Status

- validation policy design only
- not implemented
- no source validator change
- no source schema change
- no prompt change
- no runtime change
- no model call
- no artifact replay
- no provider default change
- no changes to existing Zheji UI/engine lens

This validation policy supports embryo morpheme meaning analysis. It is not external origin/truth evidence.

## Source schema reviewed

This policy is grounded in:

- PR #1219 design: `docs/open-instrument/zheji-semantic-transparency-layer-v0.1.md`
- PR #1220 review: `docs/open-instrument/zheji-semantic-transparency-layer-review-v0.1.md`
- PR #1221 schema design: `docs/open-instrument/zheji-transparency-schema-additions-v0.1.md`

PR #1221 fixed the future field shapes. This PR defines how future validators should treat those fields.

## Current validator boundary

The current Open Instrument validator behavior remains intact and must not change in this PR.

Current behavior includes:

- validates top-level identity
- validates chunkCandidates
- validates nullCandidates
- validates candidateType
- validates evidenceType
- validates falseFriendRisk
- validates sourceNote
- validates claim boundary
- forbids origin/proof overclaims
- does not yet validate Zheji transparency fields

## Validation targets

### Raw Brain output

Raw Brain output may include candidate-level:

- analysisLayers
- semanticTransparency

Raw Brain output must not include computed:

- transparencyContrast

If raw Brain output includes transparencyContrast, future validator or post-processor should flag it as a boundary violation.

### Normalized Brain output

Normalized Brain output may preserve candidate-level Zheji fields after safe shape validation or normalization if later normalizer support exists.

The validator should validate candidate-level field shape after normalization.

### Derived enriched output

Derived enriched output may include:

- candidate-level analysisLayers
- candidate-level semanticTransparency
- computed chunk/embryo-level transparencyContrast

The validator should check the matrix shape and ensure it was computed, not Brain-authored.

## `analysisLayers` validation policy

For non-null chunkCandidates, future active Zheji schema should validate:

- analysisLayers is an object
- analysisLayers.formal is an object
- analysisLayers.symbolic is an object
- formal.isPresent is boolean
- symbolic.isPresent is boolean
- formal.evidenceNote is string or null
- symbolic.evidenceNote is string or null
- no extra score/rank/winner/origin fields are allowed inside analysisLayers
- if isPresent is true, evidenceNote should be a non-empty short string
- if isPresent is false, evidenceNote may be null or a short not-evaluated note
- symbolic evidence requires an explicit doctrine reference in the prompt contract
- if doctrine reference is absent or incomplete, symbolic must be false or not evaluated

Policy decision:

- v0.1 should prefer warnings for note length, not hard errors, unless a later validator PR decides exact limits
- v0.1 should hard-error on wrong types

## `semanticTransparency` validation policy

For non-null chunkCandidates, future active Zheji schema should validate:

- semanticTransparency is an object
- semanticTransparency.level is one of atomic, metaphorical, opaque
- semanticTransparency.reason is a non-empty short string
- semanticTransparency.decomposition is optional
- if present, decomposition is an array of short strings
- no score/rank/winner/origin fields are allowed inside semanticTransparency
- atomic does not mean historical truth
- dictionary morphology alone is not enough for atomic, but the validator cannot judge semantic truth; it can only validate shape

Policy decision:

- validator checks shape and forbidden fields
- human review checks whether the level is meaningful

## `transparencyContrast` validation policy

For derived enriched output, future validator should validate:

- transparencyContrast is absent from raw Brain output
- transparencyContrast is present only in derived or post-processed output when the Zheji layer is active
- transparencyContrast.hasContrast is boolean
- transparencyContrast.matrix is an object
- matrix.atomic is an array of strings
- matrix.metaphorical is an array of strings
- matrix.opaque is an array of strings
- matrix entries are language labels or language codes from non-null candidates
- null candidates do not contribute to the matrix
- no natural-language contrast note field in v0.1
- no winner field
- no score/rank fields
- no origin verdict fields
- no candidateType mutation

Policy decision:

- if no candidate ids exist, language-only matrix is valid for v0.1
- if multiple candidates per language create ambiguity, future candidate-id design is required before richer contrast validation

## Null candidate policy

- nullCandidates should not require semanticTransparency in v0.1
- nullCandidates should not contribute to transparencyContrast.matrix
- nullCandidates may omit analysisLayers in v0.1
- if later schema includes analysisLayers on null candidates, values should be false or null only
- nulls remain evidence of absence, not transparency evidence

## Required vs optional rollout policy

Phase 0 - current artifacts:

- old artifacts without Zheji fields remain valid under current validator

Phase 1 - Zheji-active raw Brain outputs:

- non-null chunkCandidates should include analysisLayers and semanticTransparency
- missing fields may be warnings during the first transition PR if backward compatibility is needed

Phase 2 - strict Zheji-active validation:

- non-null chunkCandidates require both fields
- derived outputs require transparencyContrast

Phase 3 - replay review:

- archived structurally clean segmentation is replayed with Zheji fields active
- review decides whether the strict policy is usable

The exact phase switch must be explicit in future implementation PRs.

## Forbidden fields and claims

Future validator should reject or flag:

- score
- rank
- winner
- originVerdict
- historicalTruth
- provesOrigin
- isOrigin
- languageWins
- prose contrast notes generated by deterministic code
- any field that mutates or overrides candidateType

The Zheji layer is enrichment, not scoring.

## CandidateType boundary validation

Future validator should ensure:

- candidateType remains one of the existing allowed values
- semanticTransparency.level = atomic does not upgrade candidateType
- symbolic.isPresent = true does not upgrade candidateType
- Albanian atomic transparency does not upgrade candidateType
- no new candidateType values are added by the Zheji layer in v0.1

## Prompt dependency validation

The validator cannot prove whether a symbolic note is doctrinally correct, but it can require boundary fields in artifacts or reports that show whether the prompt included a doctrine reference.

Future artifact or report should record:

- zhejiPromptContractApplied
- sevenVoiceDoctrineReferenceIncluded
- symbolicEvaluationAllowed

Policy:

- if symbolicEvaluationAllowed is false, symbolic.isPresent must be false or not evaluated
- if symbolic.isPresent is true while symbolic evaluation was not allowed, future validator should flag it

## Existing Zheji lens compatibility

- existing `src/engine/zhejiLens.ts` remains untouched
- existing `src/lib/zhejiSummary.ts` remains untouched
- existing Zheji UI/path lens is word/vowel-path level
- Open Instrument transparency validation is candidate/chunk level
- validation policy does not require direct reuse of existing Zheji lens
- future reuse of Seven-Voice traits must be separately designed

## Validator issue codes, future only

Suggested future issue families. Do not implement.

- MISSING_ZHEJI_ANALYSIS_LAYERS
- INVALID_ZHEJI_ANALYSIS_LAYERS
- INVALID_ZHEJI_SEMANTIC_TRANSPARENCY
- INVALID_ZHEJI_TRANSPARENCY_LEVEL
- INVALID_ZHEJI_CONTRAST_MATRIX
- RAW_BRAIN_OUTPUT_CONTAINS_DERIVED_CONTRAST
- ZHEJI_FORBIDDEN_SCORE_FIELD
- ZHEJI_FORBIDDEN_ORIGIN_CLAIM
- ZHEJI_SYMBOLIC_WITHOUT_DOCTRINE_REFERENCE
- ZHEJI_CANDIDATE_TYPE_MUTATION

## Non-goals

- no implementation
- no source validator change
- no source schema change
- no prompt change
- no runtime change
- no model run
- no artifact replay
- no candidate scoring
- no automatic Albanian preference
- no origin proof
- no candidate truth proof

## Recommended next PR

`docs/open-instrument: design zheji prompt contract additions`

Purpose:

- define how Brain should be asked for analysisLayers and semanticTransparency
- define compact 7-Voice doctrine reference handling
- define symbolic default behavior when doctrine reference is absent
- define how to keep local-model burden low
- explicitly forbid Brain from returning transparencyContrast

Do not recommend immediate source validator implementation until prompt contract is designed.

## Claim boundary

- development validation policy for embryo morpheme meaning analysis
- not external origin/truth evidence
- not candidate truth proof
- not historical origin proof
- not reason to change provider default from `mock`
- not reason to expand language/model scope without another controlled plan
