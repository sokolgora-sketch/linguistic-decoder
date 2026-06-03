# Open Instrument Llama Local Provider Five-Word Smoke Result v0.2
Date: 2026-06-03
Status: internal local provider-quality smoke only.
This document records the five-word local Open Instrument smoke using Ollama `llama3.1:8b` through the `openai_compat` provider path.
This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not a general model-quality proof, and not a reason to change the default provider from `mock`.

## 1. Purpose
The five-word smoke run executes the fixed word set defined in:
    docs/open-instrument/local-provider-smoke-v0.2-runbook.md
    docs/open-instrument/local-provider-smoke-v0.2-prompt-contract.md
The goal is to test whether the local OpenAI-compatible provider path can satisfy the v0.2 `vowelPath` contract.

## 1a. Links
- Runbook: `docs/open-instrument/local-provider-smoke-v0.2-runbook.md`
- Prompt contract: `docs/open-instrument/local-provider-smoke-v0.2-prompt-contract.md`
- Artifact: `docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.2.json`

## 2. Archived artifact
Archived JSON artifact:
    /Users/wei/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export/docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.2.json
The artifact preserves:
- repo metadata;
- provider metadata;
- local environment summary;
- word set;
- per-run request summary;
- per-run response summary;
- candidate summary;
- verifier summary;
- raw proposer text/API response;
- fail reasons if any;
- redaction status;
- claim boundary.

## 3. Run settings
Run settings:
    endpoint: /api/propose-loop
    provider: openai_compat
    runtime: Ollama local
    model: llama3.1:8b
    mode: strict
    maxAttempts: 3
    baseUrl: http://localhost:11434/v1

## 4. Five-word set
- `study`
- `damage`
- `language`
- `philosophy`
- `mathematics`

## 5. Result table
| Word | Status | Attempts | Accepted form | Candidate language | Decomposition summary | vowelPath.present | vowelPath.value |
|---|---:|---:|---|---|---|---:|---|
| `study` | PASS | 2 | `study` | English | action: to study; instrument: book; unit: hour | true | `U, Y` |
| `damage` | FAIL | 3 | `` | English | action: cause; instrument: force; unit: amount | true | `A, U` |
| `language` | FAIL | 3 | `` | English | action: express; instrument: tongue; unit: word | true | `A, E` |
| `philosophy` | FAIL | 3 | `` | English | action: contemplate; instrument: mind; unit: thought | true | `I, O` |
| `mathematics` | FAIL | 3 | `` | English | action: calculate; instrument: mind; unit: concept | true | `A, E` |

## 6. Guard result
Archive guard: passed.
The archived JSON artifact passed `tests/openInstrument.localProviderSmokeArchive.guard.spec.ts`.

## 7. Interpretation
Only if the artifact passes the archive guard:
- the local provider path works for this five-word v0.2 smoke;
- `llama3.1:8b` remains the preferred local smoke model;
- the run is still development evidence only.

This specific run is mixed in quality:
- `study` passed with explicit `vowelPath`
- `damage`, `language`, `philosophy`, and `mathematics` failed after 3 attempts each
- the artifact is still valid as development evidence because it preserves the exact capture and passes the archive guard

## 8. Quality boundary
- not scientific evidence
- not publication evidence
- not eval evidence
- not Cohort evidence
- not general model-quality proof
- not reason to change default provider from `mock`

## 9. Current decision
Proceed only if the artifact passes the version-aware archive guard and the local checks are clean.

## 10. Completion definition
This result is complete when:
- the exact five-word smoke was run;
- the JSON artifact was archived;
- the artifact passed the version-aware archive guard;
- the result doc links the artifact and contracts;
- claim boundaries were preserved.
