# Open Instrument PATH_MATCH v0.2-v0.3 Diagnosis v0.1
Status: development diagnosis only.

This document diagnoses the Open Instrument `llama3.1:8b` five-word v0.2 and v0.3 `PATH_MATCH` repair results.

No smoke run is performed by this document. No code changes are made by this document. No archive artifacts are added or changed by this document.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not a general model-quality proof, and not a reason to change the default provider from `mock`.

---

## 1. Purpose

The goal is to decide what the v0.2 and v0.3 `PATH_MATCH` evidence actually says before running more local smoke tests.

The key question:

    Did prompt-level PATH_MATCH repair guidance meaningfully improve the five-word local-provider result?

The answer from the current evidence is no.

The v0.3 result is a negative comparison record, not a meaningful improvement over v0.2.

---

## 2. Evidence Sources

Primary evidence sources:

- `docs/open-instrument/llama-five-word-smoke-v0.2-failure-analysis.md`
- `docs/open-instrument/llama-five-word-smoke-v0.3-result.md`
- `docs/open-instrument/path-match-repair-guidance-v0.1.md`
- `src/shared/llm/prompts/rootProposer.v0.2.ts`
- `docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-five-word-v0.3.json`

Relevant prior sequence:

- PR #1153 recorded the five-word v0.2 failure analysis.
- PR #1154 recorded PATH_MATCH repair guidance.
- PR #1155 implemented PATH_MATCH repair prompt guidance.
- PR #1156 archived the five-word v0.3 smoke result.

---

## 3. v0.2 Baseline

The v0.2 failure analysis recorded:

- `study` passed on attempt 2 with `vowelPath=["U","Y"]`.
- `damage` failed after 3 attempts.
- `language` failed after 3 attempts.
- `philosophy` failed after 3 attempts.
- `mathematics` failed after 3 attempts.

All four failed runs were `PATH_MATCH` repair failures.

The analysis found no evidence of:

- bad JSON;
- empty vowel paths;
- lowercase vowel paths;
- invalid vowel symbols;
- archive shape corruption.

The archive guard passed.

Interpretation:

- provider pipe was working;
- archive structure was valid;
- failure was proposal/path-repair quality.

---

## 4. v0.3 Result

The v0.3 result ran after PATH_MATCH repair prompt guidance was implemented.

The v0.3 result recorded:

- `study` passed on attempt 2 with `vowelPath.present=true`.
- `damage` failed after 3 attempts.
- `language` failed after 3 attempts.
- `philosophy` failed after 3 attempts.
- `mathematics` failed after 3 attempts.
- `PATH_MATCH failures`: 5.

Interpretation:

- v0.3 did not produce a meaningful improvement over v0.2;
- prompt doctrine alone did not fix repair behavior;
- the result remains a repair-quality failure record.

---

## 5. Comparison Table

| Word | v0.2 result | v0.3 result | Change |
|---|---|---|---|
| `study` | PASS on attempt 2, `vowelPath=["U","Y"]` | PASS on attempt 2, `vowelPath.present=true` | No meaningful attempt improvement |
| `damage` | FAIL after 3 attempts, `PATH_MATCH` repair failure | FAIL after 3 attempts | No improvement |
| `language` | FAIL after 3 attempts, `PATH_MATCH` repair failure | FAIL after 3 attempts | No improvement |
| `philosophy` | FAIL after 3 attempts, `PATH_MATCH` repair failure | FAIL after 3 attempts | No improvement |
| `mathematics` | FAIL after 3 attempts, `PATH_MATCH` repair failure | FAIL after 3 attempts | No improvement |

Net reading:

- pass count did not meaningfully improve;
- failure count did not meaningfully improve;
- retry behavior did not become reliable;
- `PATH_MATCH` remains the active blocker.

---

## 6. What Is Not The Blocker

The evidence does not point to these as the primary blocker.

### 6.1 Provider Pipe

The local provider path can call Ollama through `openai_compat`.

This is not primarily a provider connectivity failure.

### 6.2 Archive Structure

The archive guard passed.

This is not primarily an artifact-shape failure.

### 6.3 JSON Parsing

The v0.2 failure analysis found no evidence of bad JSON.

This is not primarily a JSON formatting failure.

### 6.4 Vowel Symbol Format

The v0.2 failure analysis found no evidence of lowercase vowel paths or invalid symbols.

This is not primarily a vowel-symbol serialization failure.

---

## 7. What Is Likely The Blocker

The likely blocker is deeper repair architecture.

Prompt doctrine alone did not make the model reliably repair `PATH_MATCH`.

Possible causes:

### 7.1 Local Model Weakness

`llama3.1:8b` may not reliably perform constrained symbolic repair when forced to reconcile form, decomposition, and vowel path.

### 7.2 Retry Loop Weakness

The retry loop may not provide enough structured feedback for the model to repair the exact failed condition.

A plain-language failure reason may not be enough.

### 7.3 Candidate Schema Weakness

The candidate schema may not expose enough repair-specific fields, such as:

- extracted path;
- declared path;
- mismatch location;
- material used for extraction;
- whether form changed;
- whether language changed;
- whether decomposition changed.

### 7.4 Missing Deterministic Repair Scaffold

A deterministic helper may be needed before model retry.

The helper could compute and expose:

- extracted vowel path;
- declared vowel path;
- mismatch explanation;
- allowed repair action.

The model would then repair from a structured object rather than infer everything from prose.

### 7.5 Model Selection

A stronger local model may perform better, but changing model before improving repair scaffolding risks hiding the architecture problem.

A larger model should be tested only after the repair scaffold is defined.

---

## 8. Diagnosis

The v0.2-v0.3 comparison shows:

    PATH_MATCH repair is not currently solved by prompt doctrine alone.

The repair layer needs architecture.

The next improvement should not be another smoke expansion.

The next improvement should be one of:

- deterministic repair scaffold;
- structured repair feedback object;
- stricter candidate schema;
- clearer retry trace;
- controlled model comparison only after repair structure exists.

The repair loop must make candidate truth easier to preserve.

---

## 9. Recommended Next Options

### Option A — Deterministic Repair Scaffold

Recommended first.

Add a deterministic scaffold that computes:

- extracted vowel path;
- declared vowel path;
- mismatch reason;
- whether `vowelPath` is present;
- whether form/decomposition material changed;
- suggested repair constraint.

This keeps the model from guessing the mismatch.

### Option B — Structured Repair Feedback Object

Add structured retry feedback into the proposer trace.

Example fields:

- `failedCheckId`;
- `failedReason`;
- `extractedPath`;
- `declaredPath`;
- `pathMismatchKind`;
- `repairInstruction`;
- `doNotChangeForm`;
- `doNotChangeLanguage`.

### Option C — Stricter Proposer Output Schema

Require repair attempts to explicitly state:

- candidate form;
- extracted vowels;
- declared vowel path;
- decomposition material used for extraction;
- whether form changed;
- whether language changed.

### Option D — Stronger Local Model After Scaffold

Test a stronger local model only after structured repair feedback exists.

Otherwise model comparison may confuse model power with architecture quality.

### Option E — Pause Local Model PATH_MATCH Work

If repair scaffolding is too large for now, pause local `PATH_MATCH` work and keep local provider smoke limited to provider-pipe checks.

---

## 10. Explicit Non-Recommendations

Do not:

- expand to ten-word smoke yet;
- expand to twenty-word smoke yet;
- weaken `PATH_MATCH`;
- hide repeated failures;
- treat prompt-only guidance as sufficient;
- change default provider from `mock`;
- make README claims;
- make publication claims;
- treat local smoke as Cohort evidence.

A negative result is useful evidence. It should remain visible.

---

## 11. Claim Boundary

This diagnosis is development evidence only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- a general model-quality proof;
- a reason to change the default provider from `mock`.

Allowed internal wording:

- v0.2 and v0.3 show persistent `PATH_MATCH` repair failure;
- prompt doctrine alone did not materially improve the result;
- the next useful work is repair architecture, not larger smoke sets.

Blocked wording:

- `llama3.1:8b` is proven bad generally;
- local provider work is useless;
- the verifier should be weakened;
- the default provider should change;
- the smoke result supports or rejects ZË-RO bracket claims.

---

## 12. Next Action

Recommended next action:

    Design a deterministic PATH_MATCH repair scaffold or structured repair feedback object.

Do this before:

- another five-word smoke;
- ten-word smoke;
- twenty-word smoke;
- local model comparison.

The repair layer needs structure before more output is useful.

---

## 13. Completion Definition

This diagnosis is complete when:

- v0.2 and v0.3 are compared directly;
- non-blockers are separated from likely blockers;
- prompt-only repair is judged insufficient;
- next architecture options are ranked;
- expansion to ten-word/twenty-word smoke is blocked for now;
- claim boundaries are explicit;
- no code changes are made;
- no artifacts are changed;
- local validation passes.
