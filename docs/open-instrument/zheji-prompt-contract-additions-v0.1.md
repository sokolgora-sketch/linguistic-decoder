# Zheji Prompt Contract Additions v0.1

## Status

This is a prompt contract design only.

It is not implemented.

No source prompt change is made in this PR.

No source validator change is made in this PR.

No source schema change is made in this PR.

No runtime change is made in this PR.

No model call is made in this PR.

No artifact replay is made in this PR.

No provider default change is made in this PR.

No existing Zheji UI or engine lens is changed in this PR.

This prompt contract design supports embryo morpheme meaning analysis. It is not external origin/truth evidence.

## Source policy reviewed

This document follows the staged Zheji transparency lane:

- `docs/open-instrument/zheji-semantic-transparency-layer-v0.1.md`
- `docs/open-instrument/zheji-semantic-transparency-layer-review-v0.1.md`
- `docs/open-instrument/zheji-transparency-schema-additions-v0.1.md`
- `docs/open-instrument/zheji-transparency-validation-policy-v0.1.md`

The validation policy says the next design step is the Brain prompt contract.

This document defines how the Brain should eventually be asked for candidate-level Zheji transparency fields.

## Current prompt boundary

The current Brain prompt remains a structural candidate-search prompt.

It asks Brain to preserve Heart-approved segmentation, chunks, language targets, enum fields, source notes, warnings, and claim boundary.

The current Brain prompt does not yet request:

- `analysisLayers`
- `semanticTransparency`
- `transparencyContrast`

This document does not change that prompt. It only designs a future additive prompt section.

## Prompt addition boundary

Future prompt additions must be appended as a compact section.

They must not replace the existing Brain candidate-search instructions.

They must not weaken any existing structural instruction.

They must not remove:

- exact `word`
- exact `segmentationId`
- exact Heart-approved chunks
- scalar enum rules
- `sourceNote`
- `warnings`
- `claimBoundary`
- null-candidate traceability
- origin/truth claim boundary

Future Zheji prompt additions must stay subordinate to the existing Heart-Brain contract.

## Fields Brain may return

When the Zheji prompt contract is active, Brain may return candidate-level:

- `analysisLayers`
- `semanticTransparency`

Brain must not return:

- `transparencyContrast`

`transparencyContrast` is computed later by deterministic post-processing.

## Fields Brain must not return

Brain must not return any of these Zheji-related fields:

- `transparencyContrast`
- `transparencyContrastNote`
- `score`
- `rank`
- `winner`
- `originVerdict`
- `historicalTruth`
- `provesOrigin`
- `isOrigin`
- `languageWins`
- any field that mutates or overrides `candidateType`

If Brain returns `transparencyContrast`, the future validator should treat it as a raw-output boundary violation.

If Brain returns prose contrast notes, the future validator should reject or flag them.

## Candidate-level prompt target: `analysisLayers`

Future Brain prompt section should ask for this field only on non-null `chunkCandidates`.

Shape:

- `analysisLayers.formal.isPresent`
- `analysisLayers.formal.evidenceNote`
- `analysisLayers.symbolic.isPresent`
- `analysisLayers.symbolic.evidenceNote`

Prompt meaning:

- `formal.isPresent` is true only if the candidate is supported by documented historical etymology, attested cognates, dictionary evidence, living lexical evidence, or established comparative evidence.
- `formal.evidenceNote` is a short reason for that formal evidence.
- `symbolic.isPresent` is true only if the candidate aligns with the explicitly provided ZË-RO Seven-Voice doctrine reference for this embryo morpheme.
- `symbolic.evidenceNote` is a short reason for that symbolic alignment.

Both formal and symbolic may be true.

Both may be false.

Neither changes `candidateType`.

## Symbolic doctrine dependency

Symbolic evaluation is only allowed when the prompt includes a compact Seven-Voice doctrine reference.

The prompt contract must record whether symbolic evaluation is allowed.

Future artifacts should record:

- `zhejiPromptContractApplied`
- `sevenVoiceDoctrineReferenceIncluded`
- `symbolicEvaluationAllowed`

Policy:

- if `sevenVoiceDoctrineReferenceIncluded` is false, then `symbolicEvaluationAllowed` must be false;
- if `symbolicEvaluationAllowed` is false, Brain must set `symbolic.isPresent` to false or mark symbolic as not evaluated under the later schema decision;
- Brain must not invent poetic symbolic evidence without an explicit doctrine reference.

## Compact Seven-Voice doctrine reference

Future prompt additions should include only the compact doctrine required for the current Heart-approved voice path.

For `study.segmentation.004`, the relevant path is `U → I`.

A compact doctrine reference for this path may include:

- `U`: container, inside, adding, holding, depth
- `I`: insight, intellect, knowing, line, point

The prompt must not include a long doctrine essay.

The prompt must not ask Brain to reinterpret the whole Seven-Voice system.

The prompt must only ask whether candidate meaning aligns with the supplied doctrine hints for the current embryo chunks.

## Candidate-level prompt target: `semanticTransparency`

Future Brain prompt section should ask for this field only on non-null `chunkCandidates`.

Shape:

- `semanticTransparency.level`
- `semanticTransparency.reason`
- `semanticTransparency.decomposition`

Allowed `level` values:

- `atomic`
- `metaphorical`
- `opaque`

Definitions for Brain:

- `atomic`: the candidate meaning is explained as a direct literal, physical, or functional sum of the smallest meaningful parts inside that language, with minimal conceptual leap.
- `metaphorical`: the candidate has internal roots or structure, but reaching the embryo meaning requires abstraction or conceptual leap.
- `opaque`: the candidate exists as a lexical form but has no useful internal structural explanation for the embryo meaning.

The `reason` must be short and auditable.

The `decomposition` array is optional.

If decomposition is unclear, Brain should omit `decomposition` rather than invent parts.

Dictionary morphology alone is not enough for `atomic`.

A candidate with documented roots can still be `metaphorical` if the path from roots to embryo meaning requires abstraction.

Brain must judge the semantic path, not merely the presence of dictionary roots.

## Local-model burden limits

The Zheji prompt addition must stay small.

Do not require long explanations.

Do not require long comparative notes.

Do not ask Brain to write a cross-language essay.

Do not ask Brain to choose a winner.

Do not ask Brain to score candidates.

Do not ask Brain to prove origin.

The future prompt should prefer short field-level notes that are easy to validate.

## Null-candidate prompt policy

Null candidates do not represent a candidate meaning.

Therefore, future prompt additions should not require `semanticTransparency` on `nullCandidates`.

For v0.1, null candidates may omit `analysisLayers` unless a later schema/validator PR decides otherwise.

If later schema requires `analysisLayers` on null candidates, values should be false/null only.

Null candidates must continue to include existing traceability and explanation fields required by the current Brain contract.

## CandidateType boundary in prompt

The future prompt must explicitly say:

- `semanticTransparency.level = atomic` does not upgrade `candidateType`.
- `symbolic.isPresent = true` does not upgrade `candidateType`.
- Albanian atomic transparency does not upgrade `candidateType`.
- `candidateType` remains controlled by the existing candidate evidence/type rules.
- Zheji fields are parallel enrichment fields.

The prompt must forbid Brain from adding new candidateType values.

## Albanian boundary in prompt

The prompt may include Albanian as a target language when Heart input includes it.

The prompt must not say Albanian wins.

The prompt must not privilege Albanian by schema.

The prompt must not treat Albanian atomic transparency as proof.

If Albanian is atomic and another language is metaphorical, Brain only reports candidate-level transparency. The deterministic post-processor later records matrix contrast.

## Brain must not compute contrast

The future prompt must explicitly instruct:

Brain must not compute `transparencyContrast`.

Brain must not write `transparencyContrastNote`.

Brain must not compare all candidates into a winner.

Brain must not produce cross-language prose notes.

Brain only fills candidate-level fields.

The system computes the contrast matrix after Brain output.

## Draft prompt section, future only

Future implementation may append a compact section like this, adjusted to the exact schema chosen later:

ANALYSIS LAYER INSTRUCTIONS

For every non-null chunk candidate, include `analysisLayers`.

`analysisLayers.formal.isPresent` is true only when the candidate has documented historical, lexical, dictionary, cognate, or established comparative evidence.

`analysisLayers.formal.evidenceNote` must be a short reason, or null when formal evidence is not present.

`analysisLayers.symbolic.isPresent` is true only when the candidate meaning aligns with the supplied ZË-RO Seven-Voice doctrine reference for this embryo morpheme.

`analysisLayers.symbolic.evidenceNote` must be a short reason, or null when symbolic evidence is not present or not evaluated.

If `symbolicEvaluationAllowed` is false, set symbolic.isPresent to false and do not invent symbolic evidence.

For every non-null chunk candidate, include `semanticTransparency`.

`semanticTransparency.level` must be exactly one of: atomic, metaphorical, opaque.

`semanticTransparency.reason` must be short and auditable.

`semanticTransparency.decomposition` is optional. If uncertain, omit it.

Use `atomic` only when the candidate meaning is directly explained as a literal, physical, or functional sum of smallest meaningful parts inside that language.

Use `metaphorical` when roots or structure exist but the embryo meaning requires conceptual leap.

Use `opaque` when no useful internal structural explanation exists for the embryo meaning.

Do not use dictionary morphology alone as proof of atomic transparency.

Do not return `transparencyContrast`.

Do not return `transparencyContrastNote`.

Do not score, rank, choose a winner, claim origin, or modify `candidateType`.

## Future required output schema implication

The future prompt schema should add candidate-level fields only when the Zheji prompt contract is active.

The schema should include:

- `analysisLayers`
- `semanticTransparency`

The schema should not include:

- `transparencyContrast`

Derived outputs may later include `transparencyContrast`, but raw Brain output must not.

## Artifact/report metadata implication

Future controlled artifacts should record:

- `zhejiPromptContractApplied`
- `sevenVoiceDoctrineReferenceIncluded`
- `symbolicEvaluationAllowed`
- `zhejiFieldsRequested`
- `transparencyContrastRequestedFromBrain`

Expected value for `transparencyContrastRequestedFromBrain` should be false.

These metadata fields help validation and review separate prompt behavior from model behavior.

## Existing Zheji lens compatibility

This prompt contract does not reuse existing `src/engine/zhejiLens.ts` or `src/lib/zhejiSummary.ts`.

Existing Zheji UI/path lens remains a word/vowel-path overlay.

Open Instrument Zheji prompt additions are candidate-level Brain output instructions.

Any future reuse of Seven-Voice trait references from existing code must be separately designed.

## Non-goals

This PR does not implement the prompt.

This PR does not implement schema changes.

This PR does not implement validator changes.

This PR does not implement post-processing.

This PR does not run a model.

This PR does not replay artifacts.

This PR does not change provider defaults.

This PR does not add scores, ranks, winners, or origin verdicts.

This PR does not make Albanian automatic winner.

This PR does not modify `candidateType`.

## Recommended next PR

Recommended next PR:

`docs(open-instrument): design zheji derived contrast post-processor`

Purpose:

- define how `transparencyContrast` is computed after Brain output;
- define matrix construction from candidate-level `semanticTransparency.level`;
- define raw vs normalized vs derived output boundaries;
- define no-prose/no-winner/no-score behavior;
- define artifact/report placement.

Do not implement the prompt before derived contrast behavior is designed.

## Claim boundary

This is development prompt-contract design for embryo morpheme meaning analysis.

It is not external origin/truth evidence.

It is not candidate truth proof.

It is not historical origin proof.

It is not reason to change provider default from `mock`.

It is not reason to expand language/model scope without another controlled plan.
