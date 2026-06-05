# Open Instrument Study Segmentation 004 Reduced-Language Llama Result Review v0.1
Status: internal development structural review only.

This document reviews the reduced-language `llama3.1:8b` result for `study.segmentation.004` at v0.3.
It classifies the result as a structural Brain-output / validation-contract failure.
No model call is performed by this review.
No code changes are made by this review.
No artifact JSON is modified by this review.
No result doc is modified by this review.
This review is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, not candidate-truth evidence, and not language-origin evidence.

---

## 1. Purpose
The purpose is to classify the reduced-language llama v0.3 result after the earlier Qwen3 8B timeout and the earlier llama v0.1/v0.2 reviews.

The key distinction is that llama returned parseable Brain output, but deterministic validation still rejected it.

The v0.3 result improves on v0.2 by fixing the candidate `sourceNote` contract, but it still fails on the top-level Brain metadata contract.

---

## 2. Source files
Llama artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.3.json`

Llama result doc:

`docs/open-instrument/study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-result-v0.3.md`

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

Previous segmentation 004 v0.1 artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-004-v0.1.json`

Previous segmentation 004 failure review:

`docs/open-instrument/study-segmentation-004-prototype-failure-review-v0.1.md`

Successful segmentation 002 v0.2 artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`

Successful segmentation 003 artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-003-v0.1.json`

---

## 3. Llama v0.3 result summary
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

`model_response`

Parse ok:

`true`

Validation ok:

`false`

Validation issue count:

`4`

Checked candidates:

`4`

Checked null candidates:

`4`

Covered chunks:

`S`, `TU`, `DI`

Missing chunks:

`none`

This is the third reduced-language attempt in this lane.
It clears the top-level `word` and `segmentationId` contract, and it clears the chunk-candidate `sourceNote` contract, but it still fails the top-level metadata contract.

---

## 4. Validation issue table
| Severity | Code | Path | Message |
| --- | --- | --- | --- |
| error | MISSING_FIELD | warnings | Brain output missing required field: warnings |
| error | MISSING_FIELD | claimBoundary | Brain output missing required field: claimBoundary |
| error | MISSING_FIELD | warnings | warnings must be an array. |
| error | INVALID_CLAIM_BOUNDARY | claimBoundary | claimBoundary must be an object. |

---

## 5. Failure classification
This is a structural Brain-output / validation-contract failure.

It is not:

- operational timeout;
- provider failure;
- parser failure;
- chunk coverage failure;
- candidate truth failure;
- model-quality evidence.

The model returned parseable JSON.
The validator rejected the output.
All chunks were covered.
Missing chunks were none.

The remaining failure is a top-level metadata contract miss, not a chunk-candidate traceability miss.

---

## 6. Specific structural misses
The artifact and result show these structural misses:

- top-level `warnings` is missing and not typed as an array;
- top-level `claimBoundary` is missing and not typed as an object;
- top-level `word` is present and matches Heart input;
- top-level `segmentationId` is present and matches Heart input;
- all four `chunkCandidates` entries carry non-empty `sourceNote`;
- all four `nullCandidates` entries carry non-empty explanation text.

This is a contract-compliance issue.
It should be fixed through targeted prompt/helper reinforcement, not through validator loosening.

PR #1192 fixed the identity contract.
PR #1198 fixed the chunk-candidate `sourceNote` contract.
This review records the remaining top-level metadata contract miss.

---

## 7. Comparison with v0.1 and v0.2
Segmentation 004 v0.1:

- validation issue count: `8`
- top-level `word` missing;
- top-level `segmentationId` missing;
- four `INVALID_NULL_CANDIDATE` issues on null-candidate explanation fields;
- top-level identity and null-candidate traceability were both broken.

Segmentation 004 v0.2:

- validation issue count: `4`
- top-level `word` present;
- top-level `segmentationId` present;
- four `INVALID_NULL_CANDIDATE` issues on `chunkCandidates.*.sourceNote`;
- identity was fixed;
- null-candidate explanation contract was still broken.

Segmentation 004 v0.3:

- validation issue count: `4`
- top-level `word` present;
- top-level `segmentationId` present;
- all four `chunkCandidates.*.sourceNote` entries now explain absence correctly;
- top-level `warnings` and `claimBoundary` are still missing or mis-shaped.

Reading:

- v0.1 had both identity and null-candidate traceability issues.
- v0.2 fixed identity but still failed null-candidate traceability.
- v0.3 fixed null-candidate traceability but still fails top-level metadata.
- The work is moving in the right direction, but the contract is not complete yet.

---

## 8. Comparison with Qwen reduced-language timeout
Qwen reduced-language timeout:

- artifact type: `open-instrument-model-capture-failure`
- target: `study.segmentation.004`
- model: `qwen3:8b`
- failure kind: `timeout`
- raw response available: `false`
- parsed Brain output available: `false`
- validation available: `false`

Llama reduced-language result:

- model: `llama3.1:8b`
- parse ok: `true`
- validation ok: `false`
- validation issue count: `4`

Reading:

- Qwen timed out.
- Llama returned parseable JSON.
- Llama is operationally better for this target.
- This is not a model-quality claim.

---

## 9. Comparison with full-prompt Qwen timeout
Full-prompt Qwen timeout:

- artifact type: `open-instrument-model-capture-failure`
- target: `study.segmentation.004`
- model: `qwen3:8b`
- failure kind: `timeout`
- raw response available: `false`
- parsed Brain output available: `false`
- validation available: `false`

Reading:

- full-prompt Qwen timed out;
- reduced-language Qwen timed out;
- reduced-language llama returned output;
- the remaining issue is not operational timeout.

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
- `study.segmentation.004` still does not.

---

## 11. Diagnosis
The current evidence says:

- the candidate `sourceNote` contract is now fixed;
- the top-level identity contract is fixed;
- the remaining blocker is top-level Brain metadata, specifically `warnings` and `claimBoundary`;
- the next useful work is to reinforce the metadata contract rather than expanding the capture lane.

The next fix should be a narrow prompt/helper reinforcement for top-level Brain output metadata.

Recommended next title:

`fix(open-instrument): reinforce brain output metadata contract`

---

## 12. Explicit non-recommendations
Do not:

- expand to ten-word smoke yet;
- expand to twenty-word smoke yet;
- weaken `PATH_MATCH` or any other validator contract;
- hide repeated failures;
- treat prompt-only guidance as sufficient;
- change default provider from `mock`;
- make README claims;
- make publication claims;
- treat this as Cohort evidence.

A negative result is still useful evidence.
It should remain visible.

---

## 13. Claim boundary
This review is development evidence only.
It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- a general model-quality proof;
- a reason to change the default provider from `mock`.

Allowed internal reading:

- v0.3 is structurally better than v0.1 and v0.2 on earlier contracts;
- v0.3 still fails the top-level metadata contract;
- the next useful work is metadata contract reinforcement, not bigger smoke sets.

Blocked reading:

- `llama3.1:8b` is proven bad generally;
- local provider work is useless;
- the verifier should be weakened;
- the default provider should change;
- the smoke result supports or rejects ZË-RO bracket claims.

---

## 14. Completion definition
This review is complete when:

- v0.1, v0.2, and v0.3 are compared directly;
- the top-level metadata miss is separated from earlier identity and source-note misses;
- the role of `warnings` and `claimBoundary` is explicit;
- the next architecture option is named;
- expansion to larger smoke sets is blocked for now;
- claim boundaries are explicit;
- no code changes are made;
- no artifacts are changed;
- local validation passes.
