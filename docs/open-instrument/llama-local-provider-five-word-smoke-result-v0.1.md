# Open Instrument Llama Local Provider Five-Word Smoke Result v0.1

Date: 2026-06-02

Status: internal local provider-quality smoke only.

This note records a five-word local Open Instrument smoke check using Ollama `llama3.1:8b` through the `openai_compat` provider path.

This is not a scientific eval, not publication evidence, not a general model-quality proof, and not a change to the default provider contract.

---

## 1. Purpose

The previous `llama3.1:8b` local smoke showed a clean single-word result for `study`.

This follow-up checks whether the same local provider path stays stable across a small fixed word set.

Tested path:

    Open Instrument → openai_compat → Ollama local → llama3.1:8b → parser → verifier

---

## 2. Environment and repo state

Repo state before test:

    ## main...origin/main
    divergence: 0 0

Local Ollama model:

    llama3.1:8b

Endpoint path:

    http://localhost:11434/v1

Provider path:

    openai_compat

No paid OpenAI API call was used.

---

## 3. Test words

The smoke used five words:

- `study`
- `damage`
- `language`
- `philosophy`
- `mathematics`

These words were selected as Open Instrument smoke probes only.

They are not an eval set and not publication evidence.

---

## 4. Result table

| Word | Status | Attempts | Accepted form | Structured decomposition |
|---|---:|---:|---|---|
| `study` | PASS | 1 | `study` | `action: to study` |
| `damage` | PASS | 1 | `damage` | `action: cause`; `instrument: force`; `unit: amount` |
| `language` | PASS | 1 | `language` | `action: express`; `instrument: tongue`; `unit: word` |
| `philosophy` | PASS | 1 | `philosophy` | `action: contemplate`; `instrument: mind`; `unit: thought` |
| `mathematics` | PASS | 1 | `mathematics` | `action: calculate`; `instrument: mind`; `unit: concept` |

All five calls returned:

    status: PASS
    attemptsUsed: 1
    provider: openai_compat
    model: llama3.1:8b

---

## 5. Verifier behavior

Each accepted candidate passed the active verifier checks:

- `OPS_ALLOWED`
- `DECOMP_PRESENT`
- `PATH_MATCH`
- `LANG_KNOWN`
- `ROOT_HAS_VOWEL`
- `FUNCTION_FIT_NONEMPTY`

Important detail:

- `PATH_MATCH` passed because no `vowelPath` was provided and v0.1 does not require that check when absent.
- This means the smoke confirms provider/parser/verifier stability, not full Seven-Voices path quality.

---

## 6. Interpretation

The five-word smoke supports a limited local-provider-quality reading.

Confirmed:

- `llama3.1:8b` works through the Open Instrument `openai_compat` path.
- The model preserved canonical input forms across all five tested words.
- The parser handled all five responses.
- The verifier returned structured PASS results for all five responses.
- All responses passed in one attempt.
- The output was materially cleaner than the earlier `qwen2.5:0.5b` result.

Current local model preference:

    llama3.1:8b

Reason:

- stronger than `qwen2.5:0.5b`;
- better canonical-form preservation;
- usable structured decomposition fields;
- still local and free to run after installation.

---

## 7. Quality boundary

This is still only a smoke test.

Limitations:

- only five words;
- no systematic model comparison;
- no manual linguistic adjudication;
- no preserved full request/response archive beyond this note;
- no scoring as eval evidence;
- no publication claim.

Some decompositions are useful but generic:

- `damage`: `cause / force / amount`
- `philosophy`: `contemplate / mind / thought`
- `mathematics`: `calculate / mind / concept`

Therefore:

- `llama3.1:8b` is preferred for local smoke testing;
- it is not yet approved as a research-grade proposer;
- it should not replace the default `mock` provider.

---

## 8. Claim boundary

Allowed:

- `llama3.1:8b` passed a five-word local Open Instrument smoke.
- `llama3.1:8b` is currently the preferred local Ollama smoke model.
- The local OpenAI-compatible provider path is stable enough for development smoke testing.

Blocked:

- Do not treat this as scientific evidence.
- Do not treat this as publication evidence.
- Do not claim `llama3.1:8b` is generally research-grade.
- Do not change the default provider from `mock`.
- Do not weaken verifier checks to fit local model output.
- Do not make README/public claims from this smoke.
- Do not mix this with Cohort 03/04 evidence.

---

## Artifact linkage

Archived artifact:

    docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.1.json

The artifact preserves exact local smoke request/response summaries for the five-word `llama3.1:8b` Open Instrument smoke.

It records:

- provider metadata;
- model metadata;
- word set;
- per-run request summary;
- per-run response summary;
- raw proposer text;
- verifier summary;
- whether `vowelPath` was present or absent;
- redaction status;
- claim boundary.

The artifact is development evidence only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- a reason to change the default provider from `mock`.

## 9. Current decision

Keep default provider as:

    mock

Keep preferred local Ollama smoke model as:

    llama3.1:8b

Next possible local-provider work:

- test a 10-word or 20-word smoke set;
- add exact response archiving for local-provider smoke;
- compare `llama3.1:8b` with another local model only if needed.
