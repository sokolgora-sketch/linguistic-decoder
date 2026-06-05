# Open Instrument Study Segmentation 004 Qwen3 8B Capture Failure v0.1

Date: 2026-06-05

Status: internal development operational record only.

This document records the failed Open Instrument model-capture attempt for `study.segmentation.004`.

It is not a Heart-to-Brain prototype result, not a validation result, and not model-quality evidence.

---

## 1. Purpose

The purpose is to archive the operational timeout that happened while trying to capture Brain output for `study.segmentation.004`.

The capture failed before usable Brain output existed.

---

## 2. Context

Relevant prior Open Instrument steps:

- PR #1176: `study.segmentation.004` / `S + TU + DI` diagnostic artifact.
- PR #1177: failure review for the `study.segmentation.004` prototype.
- PR #1178: null-candidate traceability reinforcement.
- PR #1180: model-capture failure artifact design.

This record follows that design and captures the first actual timeout outcome.

---

## 3. Target

- `study.segmentation.004`
- `S + TU + DI`

---

## 4. Provider and model

- Local Ollama
- OpenAI-compatible endpoint
- `qwen3:8b`

Endpoint:

- `http://localhost:11434/v1`

---

## 5. Failure summary

- Attempt 1 timed out after `120000 ms`
- Attempt 2 timed out after `600000 ms`
- Error: `Error: timeout`

The model call timed out before any usable Brain output was produced.

---

## 6. Availability summary

- Heart input available: `true`
- Brain prompt built: `true`
- Raw response available: `false`
- Parsed Brain output available: `false`
- Validation available: `false`

---

## 7. Interpretation

This is an operational capture failure.

It is not:

- a Brain-output failure;
- a validation failure;
- model-quality evidence;
- a candidate-truth result;
- a language-origin result.

The artifact preserves the timeout as development evidence only.

---

## 8. Artifact reference

`docs/open-instrument/artifacts/model-capture-failure/2026-06-04-study-segmentation-004-ollama-qwen3-8b-timeout-v0.1.json`

---

## 9. Claim boundary

This document is:

- development operational record only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- model-quality evidence;
- candidate-truth evidence;
- language-origin evidence;
- a reason to change the default provider from `mock`.

---

## 10. Completion definition

This record is complete when:

- the timeout artifact path is recorded;
- the failure summary is recorded;
- the availability summary is recorded;
- the interpretation is explicit;
- the claim boundary is explicit.
