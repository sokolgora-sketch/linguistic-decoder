# Open Instrument Llama Five-Word Smoke v0.3 Result

Date: 2026-06-03

Status: internal local provider-quality smoke only.

This document records the five-word v0.3 local Open Instrument smoke using Ollama `llama3.1:8b` through the `openai_compat` provider path after PATH_MATCH repair prompt guidance was implemented in PR #1155.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not a general model-quality proof, and not a reason to change the default provider from `mock`.

---

## 1. Purpose

The v0.3 smoke tests whether the PATH_MATCH repair prompt guidance from PR #1155 improves the five-word v0.2 failure pattern recorded in:

    docs/open-instrument/llama-five-word-smoke-v0.2-failure-analysis.md

Repair guidance source:

    docs/open-instrument/path-match-repair-guidance-v0.1.md

Tested path:

    Open Instrument → openai_compat → Ollama local → llama3.1:8b → parser → verifier

---

## 2. Archived artifact

Archived JSON artifact:

    docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.3.json

The artifact preserves exact request/response summaries, raw proposer text/API response, verifier summaries, fail reasons, `vowelPath.present`, redaction status, and claim boundary.

---

## 3. Run settings

Run settings:

    endpoint: /api/propose-loop
    provider: openai_compat
    runtime: Ollama local
    model: llama3.1:8b
    mode: strict
    maxAttempts: 3
    baseUrl: http://localhost:11434/v1

No paid OpenAI API call was used.

---

## 4. Five-word set

The smoke used exactly this word set:

- `study`
- `damage`
- `language`
- `philosophy`
- `mathematics`

---

## 5. Result table

| Word | Status | Attempts | Accepted form | Candidate language | Decomposition summary | vowelPath.present | Main failure reason |
|---|---:|---:|---|---|---|---:|---|
| `study` | PASS | 2 | `study` | English | action: to study; instrument: book; unit: person | true | PATH_MATCH: vowelPath mismatch. provided=U→Y extracted=U→I |
| `damage` | FAIL | 3 | `` | English | action: cause; instrument: force; unit: amount | true | PATH_MATCH: vowelPath mismatch. provided=A→M→E extracted=A→A→E |
| `language` | FAIL | 3 | `` | English | action: derive; instrument: prefix; unit: morpheme | true | PATH_MATCH: vowelPath mismatch. provided=A→E extracted=A→U→A→E |
| `philosophy` | FAIL | 3 | `` | English | action: Philos-; instrument: -ophy | true | PATH_MATCH: vowelPath mismatch. provided=I→O extracted=I→O→O→I |
| `mathematics` | FAIL | 3 | `` | English | action: calculate; instrument: mind; unit: science | true | PATH_MATCH: vowelPath mismatch. provided=A→E extracted=A→E→A→I |

Summary:

    passCount: 1
    failCount: 4
    pathMatchFailures: 5

---

## 6. Comparison against v0.2

v0.2 baseline:

- `study` passed on attempt 2 with `vowelPath=["U","Y"]`.
- `damage` failed after 3 attempts.
- `language` failed after 3 attempts.
- `philosophy` failed after 3 attempts.
- `mathematics` failed after 3 attempts.
- all four failed cases were `PATH_MATCH` repair failures.

v0.3 result:

- pass count: 1
- failure count: 4
- PATH_MATCH failure count: 5
- PATH_MATCH improved: no, not narrowly; the pass count did not increase over the v0.2 baseline and the repaired `study` still reported a PATH_MATCH mismatch during repair.
- attempts reduced: no; the failed words still consumed the full 3 attempts.
- truthful forms preserved: only partially; `study` reached PASS, but the repair traces still show PATH_MATCH mismatches rather than a clean path-preserving improvement.

Interpretation:

The v0.3 smoke still has failures. The failures must be preserved and inspected before any expansion.

---

## 7. Verifier note

Verifier v0.1 can pass `PATH_MATCH` when `vowelPath` is absent.

Therefore this result must be read with the archived field:

    candidateSummary.vowelPath.present

Do not rely only on final PASS/FAIL.

A PASS without `vowelPath.present=true` does not prove path validity.

---

## 8. Quality boundary

This is a controlled local-provider smoke result.

It is useful for development comparison only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- a general model-quality proof;
- a reason to change the default provider from `mock`.

Some outputs may be structurally acceptable to the current verifier while still being linguistically thin.

---

## 9. Current decision

Keep default provider as:

    mock

Keep `llama3.1:8b` as a local smoke model only.

Do not expand to ten-word or twenty-word smoke unless this v0.3 result is reviewed first.

---

## 10. Completion definition

This result is complete when:

- the exact five-word smoke was run;
- the v0.3 JSON artifact was archived;
- the result doc links to the artifact;
- the result table was generated from the artifact;
- `vowelPath.present` was preserved;
- v0.2 comparison was recorded;
- claim boundaries were preserved;
- the archive guard passed;
- local validation passed.
