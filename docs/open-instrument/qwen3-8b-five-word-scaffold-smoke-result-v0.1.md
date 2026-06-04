# Open Instrument Qwen3 8B Five-Word Scaffold Smoke Result v0.1

Date: 2026-06-03

Status: internal local provider-quality smoke only.

This document records a controlled five-word Open Instrument smoke using Ollama `qwen3:8b` through the `openai_compat` provider path after the PATH_MATCH repair scaffold was wired into retry prompts.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not a general model-quality proof, and not a reason to change the default provider from `mock`.

---

## 1. Purpose

The purpose is to test a stronger local model candidate against the same five-word PATH_MATCH-sensitive smoke lane.

Baseline model/result:

    docs/open-instrument/llama-five-word-smoke-v0.3-result.md

Scaffold wiring was added in PR #1160.

Tested path:

    Open Instrument -> openai_compat -> Ollama local -> qwen3:8b -> parser -> verifier

---

## 2. Archived artifact

Archived JSON artifact:

    docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-qwen3-8b-five-word-scaffold-v0.1.json

The artifact preserves request/response summaries, raw proposer text/API response, verifier summaries, fail reasons, repair scaffold trace/context if present, `vowelPath.present`, redaction status, and claim boundary.

---

## 3. Run settings

Run settings:

    endpoint: /api/propose-loop
    provider: openai_compat
    runtime: Ollama local
    model: qwen3:8b
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
| `study` | PASS | 2 | `study` | English | action: investigate; instrument: book; unit: time | true | PATH_MATCH: vowelPath mismatch. provided=U→Y extracted=U→I |
| `damage` | PASS | 1 | `damage` | English | action: harm; instrument: hand; unit: loss | true |  |
| `language` | PASS | 2 | `language` | English | action: speak; instrument: tongue; unit: speech | true | PATH_MATCH: vowelPath mismatch. provided=A→U→E extracted=A→U→A→E |
| `philosophy` | PASS | 2 | `philosophy` | Ancient Greek | action: love; instrument: wisdom; unit: study | true | PATH_MATCH: vowelPath mismatch. provided=I→O→O→Y extracted=I→O→O→I |
| `mathematics` | PASS | 2 | `mathematics` | English | action: study; instrument: numbers; unit: science | true | PATH_MATCH: vowelPath mismatch. provided=A→A→I→E extracted=A→E→A→I |

Summary:

    passCount: 5
    failCount: 0
    pathMatchFailures: 4
    scaffoldCount: 4

---

## 6. Comparison against llama3.1:8b v0.3

Baseline:

- model: `llama3.1:8b`
- result doc: `docs/open-instrument/llama-five-word-smoke-v0.3-result.md`
- baseline reading: negative comparison record; no meaningful improvement from prompt doctrine alone.

Qwen3 8B result:

- pass count: 5
- failure count: 0
- PATH_MATCH failure count: 4
- repair scaffold count: 4

Reading:

Qwen3 8B looks better than the previous llama3.1:8b v0.3 result on this narrow smoke.

---

## 7. Verifier and scaffold note

`PATH_MATCH` can pass without path only in older/looser conditions.

For this lane, review:

    candidateSummary.vowelPath.present

Also inspect repair scaffold trace/context when present.

Scaffold context can help repair, but it does not guarantee truthful candidate output.

Passing still requires candidate truth.

---

## 8. Claim boundary

This is development evidence only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- a general model-quality proof;
- a reason to change the default provider from `mock`.

---

## 9. Current decision

Keep default provider as:

    mock

Do not expand to ten-word smoke unless this result is reviewed first.

---

## 10. Completion definition

This result is complete when:

- `qwen3:8b` was run locally;
- the exact five-word smoke was run;
- the JSON artifact was archived;
- the result doc links to the artifact;
- `vowelPath.present` was preserved;
- scaffold trace/context was preserved if present;
- claim boundaries were preserved;
- the archive guard passed;
- local validation passed.
