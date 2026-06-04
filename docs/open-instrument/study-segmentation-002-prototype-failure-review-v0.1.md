# Open Instrument Study Segmentation 002 Prototype Failure Review v0.1

Date: 2026-06-04

Status: internal development diagnostic review only.

This document reviews the failed/negative Open Instrument Heart-to-Brain prototype artifact for `study.segmentation.002`.

No new model call is performed by this review.

No code changes are made by this review.

No prompt, validator, test, artifact-run, API, provider, eval, Cohort, README, or publication claim changes are made by this review.

This review is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not proof that any candidate is true, and not proof that any language is origin.

---

## 1. Purpose

The purpose is to diagnose why the `study.segmentation.002` / `STU + DI` prototype failed deterministic Brain output validation.

The goal is not to rescue the result.

The goal is to record what failed before changing prompts or rerunning the model.

---

## 2. Source files

Artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json

Result doc:

    docs/open-instrument/study-heart-brain-qwen3-8b-segmentation-002-result-v0.1.md

Successful baseline artifact:

    docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json

Successful baseline review:

    docs/open-instrument/study-heart-brain-prototype-review-v0.1.md

---

## 3. Prototype summary

Prototype:

- word: `study`
- Heart segmentation: `study.segmentation.002`
- embryo/chunk split: `STU + DI`
- model: `qwen3:8b`
- parse ok: `true`
- validation ok: `false`
- checked candidates: `4`
- checked null candidates: `2`
- covered chunks: `STU, DI`
- missing chunks: `none`
- validation issue count: `13`

---

## 4. Candidate table

| Kind | Chunk | Language | Form | Meaning | Candidate type | Evidence type | False-friend risk | Null |
|---|---|---|---|---|---|---|---|---|
| candidate | STU | Latin | studium | study, pursuit of knowledge | [historical_match] | [historical_etymology] | [low] | false |
| candidate | STU | Germanic | studian | to study | [functional_resonance] | [dictionary_attested] | [medium] | false |
| candidate | DI | Greek | di | through, via | [weak_resonance] | [phonetic_only] | [high] | false |
| candidate | DI | Semitic | da | to know | [functional_resonance] | [doctrine_alignment] | [medium] | false |
| null | STU | Chinese | study | none | null_candidate | none | none | true |
| null | DI | Finnish | di | none | null_candidate | none | none | true |

---

## 5. Validation issue table

| Severity | Code | Path | Message |
|---|---|---|---|
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.0.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.0.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.0.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.1.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.1.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.1.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | SEGMENTATION_ID_MISMATCH | chunkCandidates.2.segmentationId | candidate segmentationId must match Heart input segmentationId. |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.2.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.2.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.2.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.3.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.3.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.3.falseFriendRisk | falseFriendRisk must be one of the allowed values. |

Issue code summary:

- INVALID_CANDIDATE_TYPE: 4
- INVALID_EVIDENCE_TYPE: 4
- INVALID_FALSE_FRIEND_RISK: 4
- SEGMENTATION_ID_MISMATCH: 1

---

## 6. Failure classification

This was a schema contract failure, not a parser failure.

Important facts:

- Brain output parsed as JSON.
- Brain covered both Heart-approved chunks: `STU`, `DI`.
- Missing chunks: none.
- Validation failed because Brain violated strict schema/contract rules.
- Main reported causes: enum field shape drift and one `SEGMENTATION_ID_MISMATCH`.

This is a successful negative diagnostic artifact.

The validator did its job.

---

## 7. Enum drift analysis

The failing enum fields in `chunkCandidates` used arrays where the validator requires scalar strings.

| Path | Artifact value | Shape | Inner value |
|---|---|---|---|
| chunkCandidates.0.candidateType | [historical_match] | array | historical_match |
| chunkCandidates.0.evidenceType | [historical_etymology] | array | historical_etymology |
| chunkCandidates.0.falseFriendRisk | [low] | array | low |
| chunkCandidates.1.candidateType | [functional_resonance] | array | functional_resonance |
| chunkCandidates.1.evidenceType | [dictionary_attested] | array | dictionary_attested |
| chunkCandidates.1.falseFriendRisk | [medium] | array | medium |
| chunkCandidates.2.candidateType | [weak_resonance] | array | weak_resonance |
| chunkCandidates.2.evidenceType | [phonetic_only] | array | phonetic_only |
| chunkCandidates.2.falseFriendRisk | [high] | array | high |
| chunkCandidates.3.candidateType | [functional_resonance] | array | functional_resonance |
| chunkCandidates.3.evidenceType | [doctrine_alignment] | array | doctrine_alignment |
| chunkCandidates.3.falseFriendRisk | [medium] | array | medium |

Current repo candidateType values must be scalar strings:

- `strong_living_match`
- `historical_match`
- `functional_resonance`
- `phonetic_resonance`
- `weak_resonance`
- `likely_false_friend`
- `null_candidate`

Current repo evidenceType values must be scalar strings:

- `living_lexical`
- `historical_etymology`
- `dictionary_attested`
- `phonetic_only`
- `semantic_only`
- `doctrine_alignment`
- `none`

Current repo falseFriendRisk values must be scalar strings:

- `none`
- `low`
- `medium`
- `high`

Interpretation:

- This is not uppercase enum drift.
- This is not prose-label drift in the actual enum values.
- The inner enum labels are mostly valid lowercase repo enum strings.
- The contract violation is that `candidateType`, `evidenceType`, and `falseFriendRisk` were emitted as one-item arrays for non-null chunk candidates.
- Null candidates used scalar strings and did not trigger these enum validation errors.
- Brain needs stronger prompt reinforcement that enum fields are copy-exact scalar strings, not arrays and not prose aliases.

---

## 8. Segmentation mismatch analysis

The artifact reported one `SEGMENTATION_ID_MISMATCH`.

Exact mismatch:

- path: `chunkCandidates.2.segmentationId`
- expected Heart segmentationId: `study.segmentation.002`
- actual candidate-level segmentationId: `study.segment,002`

This was candidate-level, not top-level.

Top-level output kept `study.segmentation.002`, while `chunkCandidates.2.segmentationId` drifted to `study.segment,002`.

This matters because `segmentationId` is the bridge between:

- Heart-approved structure;
- Brain candidate output;
- deterministic validation;
- artifact review.

If Brain changes or miscopies `segmentationId`, it weakens traceability.

The next prompt reinforcement should make `segmentationId` a copy-exact field at top level and candidate level.

---

## 9. Comparison with successful study.segmentation.003

Successful baseline:

- segmentation: `study.segmentation.003`
- embryo/chunks: `SHTU + DI`
- parse ok: `true`
- validation ok: `true`
- validation issue count: `0`

Current result:

- segmentation: `study.segmentation.002`
- embryo/chunks: `STU + DI`
- parse ok: `true`
- validation ok: `false`
- validation issue count: `13`

Reading:

- `study.segmentation.003` passed validation.
- `study.segmentation.002` failed validation.
- `study.segmentation.002` remains structurally useful because it exposed Brain contract fragility.
- The failure does not prove `STU + DI` is bad.
- It proves the Brain prompt/contract needs reinforcement before rerun.

---

## 10. Interpretation

This is a negative/diagnostic artifact.

It does not support model success.

It does not support candidate truth.

It does not support origin claims.

It shows that Qwen3 can return parseable JSON while still violating strict schema.

This is precisely why deterministic Heart validation exists.

---

## 11. Recommended next action

Do not rerun immediately.

Recommended next PR:

    fix(open-instrument): reinforce brain candidate enum contract

That PR should:

- strengthen Brain prompt wording around exact lowercase enum values;
- state that `candidateType`, `evidenceType`, and `falseFriendRisk` must be scalar strings, not arrays;
- make `segmentationId` copy-exact at top level and candidate level;
- tell Brain not to use uppercase enum aliases;
- tell Brain not to use prose labels as enum values;
- add guard tests that the prompt includes exact enum-copy instructions;
- keep validator behavior unchanged.

After that, rerun `study.segmentation.002` in a separate artifact PR.

---

## 12. Claim boundary

This review is:

- development diagnostic review only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- proof that any candidate is true;
- proof that any language is origin;
- a reason to change the default provider from `mock`.

---

## 13. Completion definition

This review is complete when:

- source artifact path is recorded;
- source result doc path is recorded;
- prototype summary is recorded;
- candidate table is recorded;
- validation issue table is recorded;
- failure classification is explicit;
- enum drift analysis is recorded;
- segmentation mismatch analysis is recorded;
- comparison with `study.segmentation.003` is recorded;
- next action is selected;
- claim boundary is explicit;
- no code changes are made;
- no prompt changes are made;
- no validator changes are made;
- no test changes are made;
- no new model call is made;
- no new artifact run is made;
- local validation passes.
