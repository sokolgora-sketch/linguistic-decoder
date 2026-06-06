# Open Instrument Candidate Enum Repair Normalization Policy v0.1

Date: 2026-06-06

Status: development policy only.

This document defines the safe boundary for repairing Brain candidate enum shapes before validation.

It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, not candidate-truth evidence, not language-origin evidence, and not a reason to change the default provider from `mock`.

---

## 1. Purpose

The purpose is to separate safe structural normalization from validator loosening.

Recent `study.segmentation.004` reduced-language `llama3.1:8b` v0.4 output returned parseable JSON with top-level metadata fixed, but every candidate enum field was shaped as an object wrapper:

- `candidateType: { "type": "null_candidate" }`
- `evidenceType: { "type": "none" }`
- `falseFriendRisk: { "type": "none" }`

The validator correctly rejected those values because candidate enum fields must be scalar strings.

---

## 2. Source context

Source artifact:

`docs/open-instrument/artifacts/heart-brain-prototype/2026-06-05-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4.json`

Review:

`docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.4-result-review-v0.1.md`

Observed validation issue families:

- `INVALID_CANDIDATE_TYPE`
- `INVALID_EVIDENCE_TYPE`
- `INVALID_FALSE_FRIEND_RISK`
- `INVALID_NULL_CANDIDATE`

The miss was structural enum wrapping, not a parser failure, not top-level metadata failure, not missing chunk coverage, and not candidate-truth evidence.

---

## 3. Allowed repair class

Only the following repair class is allowed:

- field is one of `candidateType`, `evidenceType`, or `falseFriendRisk`;
- field value is a non-null object;
- object has exactly one key: `type`;
- `type` value is a string;
- `type` value exactly matches the allowed enum list for that field;
- replacing the field value with the `type` string would make no semantic choice.

Example allowed repair:

`candidateType: { "type": "null_candidate" }` becomes `candidateType: "null_candidate"`.

This is a shape repair only.
It does not choose a candidate, evidence class, false-friend risk, language, source, chunk, segmentation, or origin interpretation.

---

## 4. Required guardrails

Any implementation of this policy must:

- preserve the raw Brain output unchanged in archived artifacts;
- record that normalization occurred;
- record every normalized path;
- run normalization before validation, never by weakening validation;
- keep validator enum requirements strict;
- keep arrays invalid for enum fields;
- keep unknown objects invalid;
- keep unknown enum strings invalid;
- keep null-candidate strictness unchanged;
- keep claim-boundary checks unchanged.

The normalized output may be used for deterministic validation only if the raw output remains auditable.

---

## 5. Disallowed repairs

The following repairs are not allowed:

- mapping uppercase aliases such as `NULL_CANDIDATE` to `null_candidate`;
- mapping prose labels or near-synonyms to enum values;
- picking a default enum when a field is missing;
- picking `weak_resonance` because a candidate is uncertain;
- changing `nullCandidate`;
- moving candidates between `chunkCandidates` and `nullCandidates`;
- adding or removing candidates;
- changing `segmentationId`, `chunk`, `language`, `candidateForm`, `meaning`, `functionFit`, `sourceNote`, `notes`, `warnings`, or `claimBoundary`;
- treating normalized validation success as candidate-quality improvement.

If the value is ambiguous, leave it invalid.

---

## 6. Prompt policy

The Brain prompt should continue to require scalar enum strings.

It should explicitly forbid enum object wrappers, including:

- `{ "type": "null_candidate" }`
- `{ "type": "none" }`
- any object value for `candidateType`, `evidenceType`, or `falseFriendRisk`

The prompt reinforcement does not replace deterministic validation.

---

## 7. Implementation boundary

A future implementation should be a separate, narrow PR.

It should add a pre-validation normalization helper with focused tests for:

- allowed one-key `{ type: string }` enum wrappers;
- raw-output preservation metadata;
- arrays still invalid;
- unknown object shapes still invalid;
- unknown enum strings still invalid;
- null-candidate rules still enforced after normalization.

Do not implement this by changing allowed enum lists.
Do not implement this by relaxing `validateBrainCandidateSearchOutput`.

---

## 8. Claim boundary

This policy is development policy only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- model-quality evidence;
- candidate-truth evidence;
- language-origin evidence;
- reason to change the default provider from `mock`.

It governs structural repair discipline only.

---

## 9. Completion definition

This policy is complete when:

- the allowed wrapper-repair class is explicit;
- disallowed repairs are explicit;
- validator loosening is forbidden;
- raw-output preservation is required;
- prompt wrapper prohibition is required;
- future implementation remains scoped to a separate narrow PR.
