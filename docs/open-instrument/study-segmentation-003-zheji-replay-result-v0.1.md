# Zheji Study003 Replay Result v0.1

## Status

Classification: VALIDATION_FAILURE_AFTER_ZHEJI

This is a development artifact for embryo morpheme meaning/function motivation analysis.

It is not external origin/truth evidence.

It is not historical origin proof.

It is not candidate truth proof.

It is not model-quality evidence.

It is not a reason to change provider default from `mock`.

## Fixed input

- word: `study`
- segmentationId: `study.segmentation.003`
- chunks: `SHTU + DI`
- voice path: `U → I`

## Provider

- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- model call count: `1`
- OpenAI API used: `false`
- provider default changed: `false`

## Zheji prompt metadata

- zhejiPromptContractApplied: `true`
- sevenVoiceDoctrineReferenceIncluded: `true`
- symbolicEvaluationAllowed: `true`
- zhejiFieldsRequested: `analysisLayers, semanticTransparency`
- transparencyContrastRequestedFromBrain: `false`

## Validation

- raw parse ok: `true`
- raw Brain top-level keys: `candidates, segmentationId, word`
- brain validation call ok: `true`
- brain validation ok: `false`
- brain validation issue count: `10`
- Zheji validation call ok: `true`
- Zheji validation ok: `false`
- Zheji validation issue count: `8`
- forbidden raw field found: `false`
- forbidden raw fields: `none`
- missing Zheji fields: `false`
- missing Zheji reason: `none`
- derived contrast ok: `true`

## Brain validation issue preview

- MISSING_FIELD at chunkCandidates: Brain output missing required field: chunkCandidates
- MISSING_FIELD at nullCandidates: Brain output missing required field: nullCandidates
- MISSING_FIELD at warnings: Brain output missing required field: warnings
- MISSING_FIELD at claimBoundary: Brain output missing required field: claimBoundary
- MISSING_FIELD at chunkCandidates: chunkCandidates must be an array.
- MISSING_FIELD at nullCandidates: nullCandidates must be an array.
- MISSING_FIELD at warnings: warnings must be an array.
- INVALID_CLAIM_BOUNDARY at claimBoundary: claimBoundary must be an object.
- MISSING_CHUNK_RESULT at chunks.SHTU: Every Heart-approved chunk must have at least one candidate or null candidate.
- MISSING_CHUNK_RESULT at chunks.DI: Every Heart-approved chunk must have at least one candidate or null candidate.

## Zheji validation issue preview

- INVALID_ZHEJI_ANALYSIS_LAYER at chunkCandidates.0.analysisLayers.symbolic.evidenceNote: evidenceNote must be string or null.
- INVALID_ZHEJI_SEMANTIC_TRANSPARENCY at chunkCandidates.0.semanticTransparency.decomposition: semanticTransparency.decomposition must be an array of non-empty strings when present.
- INVALID_ZHEJI_ANALYSIS_LAYER at chunkCandidates.1.analysisLayers.formal.evidenceNote: evidenceNote must be string or null.
- INVALID_ZHEJI_SEMANTIC_TRANSPARENCY at chunkCandidates.1.semanticTransparency.decomposition: semanticTransparency.decomposition must be an array of non-empty strings when present.
- INVALID_ZHEJI_ANALYSIS_LAYER at chunkCandidates.2.analysisLayers.formal.evidenceNote: evidenceNote must be string or null.
- INVALID_ZHEJI_SEMANTIC_TRANSPARENCY at chunkCandidates.2.semanticTransparency.decomposition: semanticTransparency.decomposition must be an array of non-empty strings when present.
- INVALID_ZHEJI_ANALYSIS_LAYER at chunkCandidates.3.analysisLayers.symbolic.evidenceNote: evidenceNote must be string or null.
- INVALID_ZHEJI_SEMANTIC_TRANSPARENCY at chunkCandidates.3.semanticTransparency.decomposition: semanticTransparency.decomposition must be an array of non-empty strings when present.

## Interpretation

The single local model call returned parseable JSON and included candidate-level `analysisLayers` and `semanticTransparency` fields.

However, the response did not match the required Brain candidate search schema.

The model used top-level `candidates` instead of `chunkCandidates` and omitted required fields such as language, candidateForm, meaning, functionFit, sourceNote, evidenceType, candidateType, falseFriendRisk, nullCandidate, notes, warnings, and claimBoundary.

The Zheji fields were present, but the shape was not fully valid because false layers omitted `evidenceNote` and `semanticTransparency.decomposition` was `null` instead of an array when present.

This is a useful captured failure: the model followed the semantic-enrichment idea partially, but not the strict Open Instrument schema.

## Derived contrast

Derived contrast was computed after raw parse and validation.

It does not declare a winner.

It does not infer origin.

It does not mutate `candidateType`.

Because the model omitted candidate `language`, the derived matrix cannot be interpreted as language-level evidence.

See artifact JSON for `zhejiDerivedOutput` and `zhejiPostProcessor`.

## Claim boundary

This result is limited to semantic/function motivation inspection.

It does not declare winner, history, origin, language superiority, or candidate truth.

## Next action

Review this artifact in a separate review PR before running `.004` or expanding scope.

A later runner/prompt contract may need stricter schema reminder wording before another model call.
