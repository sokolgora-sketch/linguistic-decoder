# Open Instrument Ollama Local Provider Smoke Result v0.1

Date: 2026-06-01

Status: internal local provider-pipe smoke only.

This note records a local Open Instrument smoke check using Ollama through the `openai_compat` provider path.

This is not a scientific eval, not publication evidence, not a model-quality endorsement, and not a change to the default provider contract.

---

## 1. Purpose

The purpose of this smoke was to confirm that Open Instrument can call a local OpenAI-compatible provider endpoint without using paid OpenAI API calls.

Tested path:

    Open Instrument → openai_compat → Ollama local → qwen2.5:0.5b → parser → verifier

---

## 2. Local environment

Ollama was installed locally.

Observed version:

    ollama version is 0.24.0

Installed local model:

    qwen2.5:0.5b

Observed local model listing:

    qwen2.5:0.5b    a8b0c5157701    397 MB

---

## 3. Direct Ollama endpoint check

Direct OpenAI-compatible endpoint:

    http://localhost:11434/v1/chat/completions

Direct test prompt:

    Return only this word: OK

Observed result shape:

    model: qwen2.5:0.5b
    message.role: assistant
    message.content: OK

Interpretation:

- Ollama local server was reachable.
- The OpenAI-compatible chat completions endpoint worked.
- No OpenAI paid API call was required.

---

## 4. Open Instrument mock baseline

Request summary:

    word: study
    mode: strict
    provider: mock
    maxAttempts: 2

Observed result:

    status: PASS
    attemptsUsed: 1
    provider: mock
    acceptedCandidateForms: study

Verifier checks passed:

- `OPS_ALLOWED`
- `DECOMP_PRESENT`
- `PATH_MATCH`
- `LANG_KNOWN`
- `ROOT_HAS_VOWEL`
- `FUNCTION_FIT_NONEMPTY`

Interpretation:

- The deterministic mock success path remained healthy.

---

## 5. Open Instrument rejected mock baseline

Request summary:

    word: study
    mode: strict
    provider: mock_reject_ops
    maxAttempts: 2

Observed result:

    status: FAIL
    attemptsUsed: 2
    provider: mock_reject_ops
    acceptedCandidateForms: null

Expected rejection:

    OPS_ALLOWED
    Illegal opsUsed token(s): E_INSERT_NOT_ALLOWED

Interpretation:

- The deterministic rejected-proposal path remained healthy.
- The verifier blocked illegal ops cleanly.
- The API returned structured failure reasons instead of crashing.

---

## 6. Missing-env guard check

Request summary:

    word: study
    mode: strict
    provider: openai_compat
    maxAttempts: 1

Environment at first check:

    PROPOSER_PROVIDER=<unset>
    OPENAI_BASE_URL=<unset>
    OPENAI_MODEL=<unset>
    OPENAI_API_KEY=<unset>

Observed result:

    status: LLM_ERROR
    provider: openai_compat
    reason: openai_compat not configured (need OPENAI_API_KEY + OPENAI_MODEL)

Interpretation:

- `openai_compat` did not silently fall back to mock.
- Missing real-provider configuration failed safely.
- The server did not crash.

---

## 7. Ollama through Open Instrument

The dev server was restarted with local Ollama provider environment:

    PROPOSER_PROVIDER=openai_compat
    OPENAI_BASE_URL=http://localhost:11434/v1
    OPENAI_API_KEY=ollama
    OPENAI_MODEL=qwen2.5:0.5b

Request summary:

    word: study
    mode: strict
    provider: openai_compat
    maxAttempts: 3

Observed result:

    status: PASS
    attemptsUsed: 1
    provider: openai_compat
    model: qwen2.5:0.5b
    acceptedCandidateForms: studie

Verifier checks passed:

- `OPS_ALLOWED`
- `DECOMP_PRESENT`
- `PATH_MATCH`
- `LANG_KNOWN`
- `ROOT_HAS_VOWEL`
- `FUNCTION_FIT_NONEMPTY`

Observed raw candidate summary:

    form: studie
    language: English
    opsUsed: []
    decomposition.action: verb
    decomposition.instrument: empty
    decomposition.unit: noun
    vowelPath: []

---

## 8. Interpretation

The local Ollama smoke passed as provider-pipe proof.

Confirmed:

- Open Instrument can call a local OpenAI-compatible endpoint.
- `OPENAI_BASE_URL` correctly supports `http://localhost:11434/v1`.
- The `openai_compat` provider path can receive, parse, and verify local model output.
- No OpenAI paid API call was required.

Quality caveat:

- `qwen2.5:0.5b` produced a weak linguistic candidate.
- The accepted form was `studie`, not the expected canonical English form `study`.
- The decomposition was generic: `verb | noun`.
- Therefore this smoke proves provider connectivity, not linguistic quality.

---

## 9. Claim boundary

Allowed:

- Local Ollama provider-pipe smoke passed.
- `openai_compat` can use Ollama through `OPENAI_BASE_URL`.
- The Open Instrument parser/verifier pipeline handled the local model response.
- The result is useful as local provider-readiness evidence.

Blocked:

- Do not treat this as scientific evidence.
- Do not treat this as publication evidence.
- Do not claim `qwen2.5:0.5b` is good enough for Open Instrument research use.
- Do not change the default provider from `mock`.
- Do not weaken verifier checks to accommodate local model output.
- Do not make README/public claims from this smoke.
- Do not mix this with Cohort 03/04 evidence.

---

## 10. Current decision

Keep the default provider as `mock`.

Keep Ollama as an optional local smoke path for provider compatibility testing.

Future work, if needed:

- test a stronger local model;
- improve prompt strictness for small local models;
- add a local provider-quality comparison doc only after multiple models are tested.
