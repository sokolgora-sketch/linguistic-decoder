# Study Segmentation 004 Controlled Llama Retry After Enum Repair Result v0.1

## Status

- controlled local-provider development retry
- one model call
- no OpenAI API
- no provider default change
- no prompt change
- no validator change
- no runtime wiring change
- development evidence only

## Input contract

- word: `study`
- segmentation: `study.segmentation.004`
- chunks: `S + TU + DI`
- provider: `openai_compat`
- model: `llama3.1:8b`
- endpoint: `http://localhost:11434/v1/chat/completions`
- reduced languages: Albanian, Latin, Chinese, Germanic

## Pipeline

- raw provider response captured;
- raw Brain output parsed;
- `normalizeBrainCandidateEnums` applied if parse succeeded;
- strict validator run after normalization;
- raw and normalized output archived separately.

## Result summary

- parse ok: `true`
- normalization applied: `true`
- repaired count: `18`
- unchanged count: `0`
- unresolved count: `0`
- object-wrapper repair count: `18`
- object-wrapper unresolved count: `0`
- validation ok after normalization: `true`
- validation issue count after normalization: `0`
- issue families after normalization: `{}`
- classification: `CLEAN_AFTER_NORMALIZATION`

## Interpretation

- This is a structurally clean development result only.
- Do not call it candidate truth.
- Do not call it origin proof.
- Next step is review PR.

## Comparison to archived v0.4 replay

- archived v0.4 replay after object-shape repair:
  - repaired count: `18`
  - unresolved count: `0`
  - validation issue count after normalization: `0`
  - validation ok after normalization: `true`

Fresh retry compares structure only; candidate meanings are not expected to match exactly.

## Claim boundary

- development-only
- controlled retry only
- not origin proof
- not candidate truth proof
- not publication evidence
- not eval evidence
- not Cohort evidence
- not model-quality evidence
- not reason to change default provider from `mock`
