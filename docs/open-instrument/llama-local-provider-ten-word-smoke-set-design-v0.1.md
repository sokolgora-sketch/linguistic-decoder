# Open Instrument Llama Local Provider Ten-Word Smoke Set Design v0.1

Status: design only.

This document defines the next ten-word local-provider smoke set for Open Instrument using Ollama `llama3.1:8b` through the `openai_compat` provider path.

No smoke run is performed by this document.

No JSON artifact is added by this document.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, and not a reason to change the default provider from `mock`.

---

## 1. Purpose

Open Instrument now has a documented and guarded local-provider smoke workflow.

The five-word `llama3.1:8b` smoke confirmed that the local OpenAI-compatible provider path can produce stable development smoke results for a small fixed set.

Before expanding the smoke set, this document freezes the next ten-word set and the future artifact target.

The purpose is to prevent ad hoc word expansion and to keep local-provider smoke work reproducible.

---

## 2. Background

Recent Open Instrument local-provider work:

- PR #1140 recorded a weak `qwen2.5:0.5b` local provider-pipe smoke.
- PR #1141 recorded a cleaner `llama3.1:8b` single-word smoke.
- PR #1142 recorded a five-word `llama3.1:8b` local smoke.
- PR #1143 defined the local-provider smoke archive design.
- PR #1144 archived the exact five-word `llama3.1:8b` smoke artifact.
- PR #1145 added a guard test for local-provider smoke archive artifacts.

Current preferred local smoke model:

    llama3.1:8b

Default provider remains:

    mock

---

## 3. Ten-word smoke set

The next local-provider smoke set is fixed as:

1. `study`
2. `damage`
3. `language`
4. `philosophy`
5. `mathematics`
6. `origin`
7. `measure`
8. `voice`
9. `garden`
10. `memory`

This is a smoke set only.

It is not an eval set.

It is not publication evidence.

It is not Cohort evidence.

---

## 4. Word rationale

### 4.1 `study`

Purpose:

- keeps continuity with the first single-word local smoke;
- checks whether the model preserves the canonical form already seen in the `llama3.1:8b` smoke.

### 4.2 `damage`

Purpose:

- keeps continuity with the five-word smoke;
- probes a concrete action/result word with a simple functional decomposition expectation.

### 4.3 `language`

Purpose:

- keeps continuity with the five-word smoke;
- probes a central Open Instrument / ZË-RO domain word.

### 4.4 `philosophy`

Purpose:

- keeps continuity with the five-word smoke;
- probes a longer abstract word and decomposition stability.

### 4.5 `mathematics`

Purpose:

- keeps continuity with the five-word smoke;
- probes a longer structured concept word.

### 4.6 `origin`

Purpose:

- introduces an Open Instrument / etymology-domain probe;
- checks whether the local model can handle source/root language around a compact word.

### 4.7 `measure`

Purpose:

- introduces a ZË-RO-relevant functional concept;
- checks action/instrument/unit decomposition around measurement.

### 4.8 `voice`

Purpose:

- introduces a central Seven-Voices / Open Instrument concept;
- checks whether the local model preserves the plain canonical form.

### 4.9 `garden`

Purpose:

- introduces a symbolic/domain word used in wider ZË-RO writing and conceptual work;
- checks decomposition behavior on a concrete noun with semantic load.

### 4.10 `memory`

Purpose:

- introduces a cognitive/state word;
- checks decomposition behavior on a common abstract noun.

---

## 5. Future run settings

The future run should use:

    endpoint: /api/propose-loop
    provider: openai_compat
    runtime: Ollama local
    model: llama3.1:8b
    mode: strict
    maxAttempts: 3
    baseUrl: http://localhost:11434/v1

Expected local dev server environment:

    PROPOSER_PROVIDER=openai_compat
    OPENAI_BASE_URL=http://localhost:11434/v1
    OPENAI_API_KEY=ollama
    OPENAI_MODEL=llama3.1:8b

The `OPENAI_API_KEY=ollama` value is the local dummy Ollama value only.

No paid OpenAI API call should be used for this local smoke.

---

## 6. Future artifact target

The future ten-word smoke artifact should be written to:

    docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-ten-word-v0.1.json

The artifact must follow:

- `docs/open-instrument/local-provider-smoke-archive-design-v0.1.md`
- `tests/openInstrument.localProviderSmokeArchive.guard.spec.ts`

The future PR that adds the artifact must run the guard test.

---

## 7. Required future artifact fields

The future artifact must preserve:

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

Each run must record:

- `word`;
- request endpoint;
- mode;
- provider;
- maxAttempts;
- response status;
- attemptsUsed;
- acceptedCandidateForms;
- model;
- candidate form;
- candidate language;
- opsUsed;
- decomposition fields;
- `vowelPath.present`;
- `vowelPath.value`;
- verifier checks.

Important verifier note:

In verifier v0.1, `PATH_MATCH` can pass when no `vowelPath` is provided.

Therefore the future artifact must record whether `vowelPath` was present or absent for every candidate.

Do not rely only on final PASS/FAIL.

---

## 8. Non-goals

This design does not:

- run the ten-word smoke;
- add the ten-word JSON artifact;
- approve `llama3.1:8b` as research-grade;
- change the default provider;
- change provider implementation;
- change parser behavior;
- change verifier behavior;
- change scorer behavior;
- change evals;
- change Cohort evidence;
- update README;
- make public or publication claims.

---

## 9. Claim boundary

Allowed future wording after the run, if the artifact passes:

- `llama3.1:8b` completed the ten-word local-provider smoke.
- The local OpenAI-compatible provider path remained usable for development smoke testing.
- The archived JSON artifact preserves the exact development smoke record.

Blocked wording:

- `llama3.1:8b` is scientifically validated.
- `llama3.1:8b` is research-grade.
- The smoke result supports ZË-RO vowel-bracket claims.
- The smoke result is publication evidence.
- The smoke result is eval evidence.
- The smoke result is Cohort evidence.
- The default provider should change from `mock`.

---

## 10. Completion definition

This design is complete when:

- the exact ten-word set is defined;
- every word has a rationale;
- the future run settings are defined;
- the future artifact path is defined;
- required future artifact fields are defined;
- the `vowelPath.present` requirement is explicit;
- non-goals are explicit;
- claim boundaries are explicit;
- no smoke run is performed;
- no artifact JSON is added;
- local validation passes.

The next PR may run and archive the ten-word smoke only after this design is merged.
