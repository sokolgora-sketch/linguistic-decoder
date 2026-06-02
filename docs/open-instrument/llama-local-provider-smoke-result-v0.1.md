# Open Instrument Llama Local Provider Smoke Result v0.1

Date: 2026-06-02

Status: internal local provider-quality smoke only.

This note records a local Open Instrument smoke check using Ollama `llama3.1:8b` through the `openai_compat` provider path.

This is not a scientific eval, not publication evidence, not a model endorsement, and not a change to the default provider contract.

---

## 1. Purpose

The previous local Ollama smoke with `qwen2.5:0.5b` proved provider connectivity but produced weak linguistic output.

This follow-up smoke checks whether a stronger local model can produce a better Open Instrument proposal while still using the same OpenAI-compatible provider path.

Tested path:

    Open Instrument → openai_compat → Ollama local → llama3.1:8b → parser → verifier

---

## 2. Local environment

Machine:

    Apple M2
    RAM: 16 GB

Installed local model after cleanup:

    llama3.1:8b

Observed local model listing:

    llama3.1:8b    46e0c10c039e    4.9 GB

Removed unused models after testing:

    qwen2.5:0.5b
    qwen2.5:3b

---

## 3. Direct Ollama endpoint check

Direct OpenAI-compatible endpoint:

    http://localhost:11434/v1/chat/completions

Direct test prompt:

    Return only this word: OK

Observed result shape:

    model: llama3.1:8b
    message.role: assistant
    message.content: OK

Interpretation:

- Ollama local server was reachable.
- The OpenAI-compatible chat completions endpoint worked.
- `llama3.1:8b` responded correctly through the local endpoint.
- No OpenAI paid API call was required.

---

## 4. Open Instrument configuration

The dev server was restarted with local Ollama provider environment:

    PROPOSER_PROVIDER=openai_compat
    OPENAI_BASE_URL=http://localhost:11434/v1
    OPENAI_API_KEY=ollama
    OPENAI_MODEL=llama3.1:8b

Request summary:

    word: study
    mode: strict
    provider: openai_compat
    maxAttempts: 3

---

## 5. Open Instrument result

Observed result:

    status: PASS
    attemptsUsed: 1
    provider: openai_compat
    model: llama3.1:8b
    acceptedCandidateForms: study

Verifier checks passed:

- `OPS_ALLOWED`
- `DECOMP_PRESENT`
- `PATH_MATCH`
- `LANG_KNOWN`
- `ROOT_HAS_VOWEL`
- `FUNCTION_FIT_NONEMPTY`

Observed raw candidate summary:

    form: study
    language: English
    opsUsed: []
    decomposition.action: to study
    decomposition.instrument: empty
    decomposition.unit: empty

---

## 6. Comparison with earlier local Qwen smoke

Earlier `qwen2.5:0.5b` local smoke:

    status: PASS
    acceptedCandidateForms: studie
    decomposition: verb | noun

This `llama3.1:8b` local smoke:

    status: PASS
    acceptedCandidateForms: study
    decomposition.action: to study

Interpretation:

- `llama3.1:8b` produced a cleaner candidate than `qwen2.5:0.5b`.
- It preserved the canonical input form `study`.
- It produced a more directly useful action field: `to study`.
- It passed in one attempt.

---

## 7. Interpretation

The `llama3.1:8b` local smoke passed as provider-pipe and basic local-provider-quality proof.

Confirmed:

- Open Instrument can call `llama3.1:8b` locally through Ollama.
- `OPENAI_BASE_URL` works with `http://localhost:11434/v1`.
- The `openai_compat` provider can receive, parse, and verify local `llama3.1:8b` output.
- No paid OpenAI API call is required.
- The result is better than the earlier tiny-model smoke.

Quality caveat:

- This is a single smoke case on `study`.
- It does not prove general model quality.
- It does not prove research readiness.
- It does not replace systematic model comparison.

---

## 8. Claim boundary

Allowed:

- `llama3.1:8b` local smoke passed.
- `llama3.1:8b` produced a cleaner local Open Instrument proposal than `qwen2.5:0.5b` on this one smoke case.
- Ollama remains a viable local OpenAI-compatible provider path for development smoke testing.

Blocked:

- Do not treat this as scientific evidence.
- Do not treat this as publication evidence.
- Do not claim `llama3.1:8b` is generally good enough for Open Instrument research use.
- Do not change the default provider from `mock`.
- Do not weaken verifier checks to accommodate local model output.
- Do not make README/public claims from this smoke.
- Do not mix this with Cohort 03/04 evidence.

---

## 9. Current decision

Keep the default provider as `mock`.

Keep `llama3.1:8b` as the preferred local Ollama smoke model for now.

Future work, if needed:

- test additional words beyond `study`;
- compare `llama3.1:8b` against other local models;
- create a small local model comparison note only after repeated smoke cases.
