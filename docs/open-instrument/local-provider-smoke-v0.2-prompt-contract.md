# Open Instrument Local Provider Smoke v0.2 Prompt Contract

Status: contract planning only.

This document defines the proposed prompt/output contract for future Open Instrument local-provider smoke v0.2 runs.

No code is changed by this document.

No guard is changed by this document.

No artifacts are added by this document.

This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, and not a reason to change the default provider from `mock`.

---

## 1. Purpose

Open Instrument local-provider smoke v0.1 proved that the local provider path can run through:

    Open Instrument → openai_compat → Ollama local → llama3.1:8b → parser → verifier

The next v0.2 goal is to require local proposer output to include `vowelPath`.

This prompt contract defines the exact output expectations before any v0.2 guard or artifact capture is added.

---

## 2. Background

Recent Open Instrument local-provider work:

- PR #1140 recorded weak `qwen2.5:0.5b` local provider-pipe smoke.
- PR #1141 recorded cleaner `llama3.1:8b` single-word smoke.
- PR #1142 recorded five-word `llama3.1:8b` smoke.
- PR #1143 defined local-provider smoke archive design.
- PR #1144 archived the exact five-word `llama3.1:8b` smoke artifact.
- PR #1145 added the local-provider smoke archive guard.
- PR #1146 defined the ten-word local smoke set.
- PR #1147 archived the exact ten-word `llama3.1:8b` smoke artifact and result doc.
- PR #1148 planned the local smoke `vowelPath` v0.2 direction.

Current preferred local smoke model:

    llama3.1:8b

Default provider remains:

    mock

---

## 3. v0.1 limitation

The current v0.1 archive artifacts honestly record:

    candidateSummary.vowelPath.present=false

This is valid for v0.1.

Verifier v0.1 can pass `PATH_MATCH` when no `vowelPath` is provided.

Therefore, v0.1 artifacts prove local provider/parser/verifier smoke behavior, but they do not prove full Seven-Voices path-quality behavior.

The old v0.1 artifacts must not be rewritten or treated as defective.

They remain valid historical development artifacts.

---

## 4. v0.2 target

Future local-provider smoke v0.2 candidate output must include `vowelPath`.

Future v0.2 archived artifacts should record:

    candidateSummary.vowelPath.present=true

and:

    candidateSummary.vowelPath.value

as a non-empty array.

The purpose is to make v0.2 smoke output inspectable for Seven-Voices path behavior.

This still does not make the smoke scientific evidence.

---

## 5. Exact output contract

The model must return JSON only.

The top-level object must include:

- `word`
- `mode`
- `candidates`

The `candidates` field must be a non-empty array.

Each candidate must include:

- `form`
- `language`
- `opsUsed`
- `decomposition`
- `vowelPath`

The `decomposition` object must include:

- `action`
- `instrument`
- `unit`
- `statement`

The `vowelPath` field must be:

- present;
- an array;
- non-empty;
- composed only of allowed Seven-Voice symbols.

---

## 6. Seven-Voice symbol rule

Allowed `vowelPath` symbols:

    A
    E
    I
    O
    U
    Y
    Ë

Rules:

- use uppercase symbols only;
- do not use lowercase symbols;
- do not use IPA symbols in `vowelPath`;
- do not use empty strings;
- do not use non-Seven-Voice letters;
- do not omit `vowelPath`;
- do not provide an empty `vowelPath` array.

Examples:

Allowed:

    "vowelPath": ["U", "I"]

Allowed:

    "vowelPath": ["A", "E", "I"]

Blocked:

    "vowelPath": []

Blocked:

    "vowelPath": ["u", "i"]

Blocked:

    "vowelPath": ["ə"]

Blocked:

    missing vowelPath field

---

## 7. Rejection and repair rule

For v0.2 local smoke, a candidate should be treated as incomplete if:

- `vowelPath` is missing;
- `vowelPath` is empty;
- `vowelPath` contains lowercase values;
- `vowelPath` contains values outside `A`, `E`, `I`, `O`, `U`, `Y`, `Ë`;
- `vowelPath` is not an array.

Future repair prompts should explicitly ask for corrected JSON with a valid non-empty `vowelPath`.

Repair should not weaken the archive claim boundary.

Repair should not change the default provider.

Repair should not silently accept missing path data.

---

## 8. Proposed system instruction

Future v0.2 local smoke prompt should include a system instruction like:

    You are an Open Instrument proposer.
    Return JSON only.
    Do not include markdown.
    Include `word`, `mode`, and a non-empty `candidates` array.
    Every candidate must include `form`, `language`, `opsUsed`, `decomposition`, and `vowelPath`.
    `vowelPath` must be a non-empty array.
    Use only uppercase Seven-Voice symbols in `vowelPath`: A, E, I, O, U, Y, Ë.
    Do not use IPA symbols in `vowelPath`.
    If you cannot supply a valid `vowelPath`, return a corrected JSON candidate rather than omitting the field.

Future v0.2 local smoke prompt should include a user/task instruction like:

    Given the word, propose a candidate in JSON only.
    Include a non-empty `vowelPath` using only uppercase Seven-Voice symbols.
    Fill `decomposition` with action, instrument, unit, and statement.
    Keep the output strictly machine-readable.

The prompt sketch is intentionally narrow so the archive contract stays testable.

---

## 9. Archive implications

Future v0.2 artifact naming should use:

    v0.2.json

Existing v0.1 artifacts stay valid.

Future v0.2 guard should enforce:

    candidateSummary.vowelPath.present === true

This document does not add that guard yet.

---

## 10. Non-goals

This PR does not:

- change code;
- change guard behavior;
- capture new artifacts;
- add eval claims;
- add README/publication claims.

---

## 11. Claim boundary

This contract is not scientific evidence.

It is not publication evidence.

It is not eval evidence.

It is not Cohort evidence.

It is not a reason to change the default provider from `mock`.

The doc only defines the future v0.2 prompt/output contract.

---

## 12. Completion definition

This planning doc is complete when:

- the v0.1 limitation is clearly stated;
- the v0.2 target is explicit;
- the JSON-only output shape is defined;
- `vowelPath` and Seven-Voice rules are defined;
- rejection/repair behavior is described;
- archive implications are scoped;
- non-goals and claim boundary remain conservative.

---

## 13. Next recommended PRs

Recommended next PR sequence:

1. v0.2 prompt/runbook implementation.
2. v0.2 archive guard.
3. v0.2 five-word capture.
4. v0.2 ten-word capture only if five-word v0.2 is clean.
