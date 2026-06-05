# Open Instrument Study Segmentation 004 Reduced-Language Llama Result Review v0.1
Status: internal development structural review only.

This document reviews the reduced-language `llama3.1:8b` result for `study.segmentation.004` at v0.4.
It classifies the result as a structural Brain-output / validation-contract failure.
No model call is performed by this review.
No code changes are made by this review.
No artifact JSON is modified by this review.
No result doc is modified by this review.
This review is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, not candidate-truth evidence, and not language-origin evidence.

---

## 1. Purpose
The purpose is to classify the reduced-language llama v0.4 result after PR #1202 and compare it with the earlier Qwen reduced-language timeout plus the earlier llama v0.1/v0.2/v0.3 reviews.

The key distinction is that llama returned parseable Brain output, but deterministic validation still rejected it.

The v0.4 result improves on v0.3 by fixing the top-level `warnings` / `claimBoundary` contract, but it regresses on candidate-shape / enum compliance.

---

## 2. Source files
Llama artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4.json`

Llama result doc:

`docs/open-instrument/study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4.md`

Earlier llama v0.3 review:

`docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.3-result-review-v0.1.md`

Earlier llama v0.2 review:

`docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.2-result-review-v0.1.md`

Earlier llama v0.1 review:

`docs/open-instrument/study-segmentation-004-reduced-language-llama-result-review-v0.1.md`

Qwen reduced-language timeout artifact:

`docs/open-instrument/artifacts/model-capture-failure/2026-06-05-study-segmentation-004-ollama-qwen3-8b-reduced-language-timeout-v0.1.json`

Qwen reduced-language timeout review:

`docs/open-instrument/study-segmentation-004-reduced-language-timeout-review-v0.1.md`

Qwen full-prompt timeout artifact:

`docs/open-instrument/artifacts/model-capture-failure/2026-06-04-study-segmentation-004-ollama-qwen3-8b-timeout-v0.1.json`

Timeout policy:

`docs/open-instrument/local-model-timeout-budget-policy-v0.1.md`

Successful segmentation 002 v0.2 artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`

Successful segmentation 003 artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json`

---

## 3. Llama v0.4 result summary
Artifact type:

`open-instrument-heart-brain-prototype`

Target:

`study.segmentation.004`

Chunks:

`S + TU + DI`

Model:

`llama3.1:8b`

Reduced languages:

- Albanian
- Latin
- Chinese
- Germanic

Outcome:

`validation_failure`

Parse ok:

`true`

Validation ok:

`false`

Validation issue count:

`36`

Checked candidates:

`3`

Checked null candidates:

`3`

Covered chunks:

`S`, `TU`, `DI`

Missing chunks:

`none`

This is the fourth reduced-language attempt in this lane.
It now satisfies the top-level `warnings` and `claimBoundary` metadata contract, but it fails candidate enum and candidate-shape rules under the stricter full contract.

---

## 4. Prior miss-check
The earlier contract misses are now resolved as follows:

- top-level `word` present and matches Heart input
- top-level `segmentationId` present and matches Heart input
- null candidates with explanation/audit field
- chunk candidates with `sourceNote`
- top-level `warnings` present and is array
- top-level `claimBoundary` present and is non-null object

So the v0.4 failure is not identity, not source-note traceability, and not top-level metadata.

---

## 5. Validation issue table
| Severity | Code | Path | Message |
| --- | --- | --- | --- |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.0.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.0.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.0.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.0.candidateType | nullCandidate=true requires candidateType=null_candidate. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.0.evidenceType | nullCandidate=true requires evidenceType=none. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.0.falseFriendRisk | nullCandidate=true requires falseFriendRisk=none. |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.1.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.1.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.1.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.1.candidateType | nullCandidate=true requires candidateType=null_candidate. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.1.evidenceType | nullCandidate=true requires evidenceType=none. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.1.falseFriendRisk | nullCandidate=true requires falseFriendRisk=none. |
| error | INVALID_CANDIDATE_TYPE | chunkCandidates.2.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | chunkCandidates.2.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | chunkCandidates.2.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.2.candidateType | nullCandidate=true requires candidateType=null_candidate. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.2.evidenceType | nullCandidate=true requires evidenceType=none. |
| error | INVALID_NULL_CANDIDATE | chunkCandidates.2.falseFriendRisk | nullCandidate=true requires falseFriendRisk=none. |
| error | INVALID_CANDIDATE_TYPE | nullCandidates.0.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | nullCandidates.0.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | nullCandidates.0.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.0.candidateType | nullCandidate=true requires candidateType=null_candidate. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.0.evidenceType | nullCandidate=true requires evidenceType=none. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.0.falseFriendRisk | nullCandidate=true requires falseFriendRisk=none. |
| error | INVALID_CANDIDATE_TYPE | nullCandidates.1.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | nullCandidates.1.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | nullCandidates.1.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.1.candidateType | nullCandidate=true requires candidateType=null_candidate. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.1.evidenceType | nullCandidate=true requires evidenceType=none. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.1.falseFriendRisk | nullCandidate=true requires falseFriendRisk=none. |
| error | INVALID_CANDIDATE_TYPE | nullCandidates.2.candidateType | candidateType must be one of the allowed Brain candidate types. |
| error | INVALID_EVIDENCE_TYPE | nullCandidates.2.evidenceType | evidenceType must be one of the allowed Brain evidence types. |
| error | INVALID_FALSE_FRIEND_RISK | nullCandidates.2.falseFriendRisk | falseFriendRisk must be one of the allowed values. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.2.candidateType | nullCandidate=true requires candidateType=null_candidate. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.2.evidenceType | nullCandidate=true requires evidenceType=none. |
| error | INVALID_NULL_CANDIDATE | nullCandidates.2.falseFriendRisk | nullCandidate=true requires falseFriendRisk=none. |

---

## 6. Issue-family summary
Issue-family counts:

- `INVALID_CANDIDATE_TYPE`: 6
- `INVALID_EVIDENCE_TYPE`: 6
- `INVALID_FALSE_FRIEND_RISK`: 6
- `INVALID_NULL_CANDIDATE`: 18

No other issue codes appear in the v0.4 artifact validation result.

The issue distribution is consistent with enum drift and null-candidate shape drift across all three candidate slots, both for `chunkCandidates` and `nullCandidates`.

---

## 7. Improvement / regression comparison
Validation issue trend:

- v0.1 validation issues: `8`
- v0.2 validation issues: `4`
- v0.3 validation issues: `4`
- v0.4 validation issues: `36`

What improved across the sequence:

- v0.2 fixed top-level identity
- v0.3 fixed chunk-candidate `sourceNote`
- v0.4 fixed `warnings`
- v0.4 fixed `claimBoundary`

What regressed in v0.4:

- candidate-shape / enum compliance
- null-candidate strictness across both candidate lists

Interpretation:

- v0.1 had identity and null-candidate traceability problems.
- v0.2 fixed identity but still failed null-candidate traceability.
- v0.3 fixed null-candidate traceability but still failed top-level metadata.
- v0.4 fixed top-level metadata, but it regressed heavily in enum and null-candidate shape compliance.

The result is structurally worse than v0.3 even though it clears more metadata contracts.

---

## 8. Failure classification
This is a structural Brain-output / validation-contract failure.
It is specifically candidate-shape / enum drift under a stricter full contract.

It is not:

- operational timeout
- provider failure
- parser failure
- top-level identity failure
- candidate source-note failure
- top-level metadata failure
- candidate truth failure
- model-quality evidence

The model returned parseable JSON.
The validator rejected the output.
All chunks were covered.
Missing chunks were none.

---

## 9. Comparison with Qwen
Qwen reduced-language timeout:

- artifact type: `open-instrument-model-capture-failure`
- failure kind: `timeout`
- raw response available: `false`
- parsed Brain output available: `false`
- validation available: `false`

Llama v0.4:

- parse ok: `true`
- validation ok: `false`
- validation issue count: `36`

Reading:

- Qwen timed out.
- Llama returned parseable JSON in v0.1, v0.2, v0.3, and v0.4.
- Llama remains operationally better for this target.
- This is not a model-quality claim.

---

## 10. Comparison with successful baselines
Segmentation 002 v0.2:

- segmentation: `study.segmentation.002`
- chunks: `STU + DI`
- validation ok: `true`
- validation issue count: `0`

Segmentation 003:

- segmentation: `study.segmentation.003`
- chunks: `SHTU + DI`
- validation ok: `true`
- validation issue count: `0`

Reading:

- `study.segmentation.002` / `STU + DI` v0.2 passed structurally.
- `study.segmentation.003` / `SHTU + DI` passed structurally.
- The v0.4 llama result does not affect those baselines.

---

## 11. Interpretation
PR #1201 worked for top-level metadata.

The strict prompt is now likely too large or too brittle for llama.

Do not keep adding broad prompt prose blindly.

Do not chunk-split yet.

Do not switch model yet.

The next decision should evaluate either:

- enum-contract compression / schema example tightening; or
- deterministic post-parse enum normalization.

---

## 12. Decision
Next PR should design a safe candidate enum repair / normalization policy.

Recommended next title:

`docs/open-instrument: design brain candidate enum repair policy`

---

## 13. Required next design scope
The next design should define:

- safe deterministic enum normalization only;
- whitelist mappings only;
- no semantic invention;
- no candidate creation;
- no source/evidence fabrication;
- raw Brain output must be preserved;
- normalized output must be stored separately;
- validator must still run on the normalized strict object;
- unresolved enum values remain validation failures;
- prompt-only tightening must be compared as an alternative.

---

## 14. Claim boundary
This review is a development structural review only.

It is not:

- scientific evidence
- publication evidence
- eval evidence
- Cohort evidence
- model-quality evidence
- candidate-truth evidence
- language-origin evidence
- validator failure
- a reason to change the default provider from `mock`

---

## 15. Completion definition
This review is complete when:

- llama v0.4 artifact path is recorded;
- llama v0.4 result doc path is recorded;
- result summary is recorded;
- prior miss-check is recorded;
- validation issue table is recorded;
- issue-family summary is recorded;
- improvement / regression comparison is recorded;
- Qwen comparison is recorded;
- successful baseline comparison is recorded;
- next decision is explicit;
- required next design scope is recorded;
- claim boundary is explicit;
- no model call is made;
- no code changes are made;
- local validation passes.
