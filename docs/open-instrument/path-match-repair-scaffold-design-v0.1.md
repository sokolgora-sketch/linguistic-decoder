# Open Instrument PATH_MATCH Repair Scaffold Design v0.1
Status: design only.

This document defines a deterministic `PATH_MATCH` repair scaffold for Open Instrument proposer retries.

No code changes are made by this document. No smoke run is performed by this document. No archive artifact is added or changed by this document.

This is development design only. It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not a general model-quality proof, and not a reason to change the default provider from `mock`.

---

## 1. Purpose

The Open Instrument `PATH_MATCH` v0.2-v0.3 diagnosis showed that prompt doctrine alone did not solve path repair.

The next useful step is to design a deterministic scaffold that computes repair facts before model retry.

The model should not be asked to guess the mismatch from prose.

The repair loop should provide structured repair feedback that makes candidate truth easier to preserve.

Core doctrine remains:

    Repair must make the candidate true, not merely make the verifier pass.

---

## 2. Background

Relevant sequence:

- PR #1153 recorded the five-word v0.2 failure analysis.
- PR #1154 recorded `PATH_MATCH` repair guidance.
- PR #1155 implemented repair guidance in the proposer prompt path.
- PR #1156 archived the five-word v0.3 smoke result.
- PR #1157 diagnosed that v0.3 did not meaningfully improve over v0.2.

PR #1157 concluded:

- provider pipe is not the blocker;
- archive structure is not the blocker;
- JSON parsing is not the blocker;
- prompt doctrine alone did not fix repair behavior;
- the likely blocker is deeper repair architecture / candidate truth discipline.

Therefore this design focuses on deterministic repair scaffolding.

---

## 3. Core Goal

The repair scaffold should compute a structured object before the model retry.

The scaffold should tell the model:

- what failed;
- why it failed;
- what path was declared;
- what path was extracted;
- what material was used for extraction;
- whether form/language/decomposition changed;
- what repairs are allowed;
- what repairs are blocked.

The scaffold must not weaken the verifier.

The scaffold must not hide failure.

The scaffold must make truthful repair easier and superficial verifier-passing harder.

---

## 4. Repair Feedback Object

The repair feedback object should include these fields:

    {
      "failedCheckId": "PATH_MATCH",
      "failedReason": "<verifier reason>",
      "acceptedForm": "<candidate form>",
      "candidateLanguage": "<candidate language>",
      "declaredVowelPath": ["..."],
      "extractedVowelPath": ["..."],
      "vowelPathPresent": true,
      "mismatchKind": "PATH_SYMBOL_MISMATCH",
      "extractionMaterial": {
        "form": "<accepted form>",
        "decompositionText": "<material used for extraction>",
        "rootMaterial": "<root/root-like material if available>"
      },
      "formChanged": false,
      "languageChanged": false,
      "decompositionChanged": true,
      "allowedRepairActions": ["..."],
      "blockedRepairActions": ["..."],
      "repairInstruction": "<single direct instruction for the next retry>"
    }

The exact implementation may use TypeScript types, but the conceptual contract should stay stable.

---

## 5. Field Definitions

### 5.1 `failedCheckId`

The verifier check that failed.

For this scaffold, primary value is:

    PATH_MATCH

### 5.2 `failedReason`

The verifier-provided reason.

This must be preserved verbatim or near-verbatim.

### 5.3 `acceptedForm`

The candidate form being verified.

Repair should preserve this form unless a justified variant/proto-form operation is explicitly allowed.

### 5.4 `candidateLanguage`

The candidate language.

Repair should preserve this language unless the original language is unsupported or contradicted.

### 5.5 `declaredVowelPath`

The path supplied by the model.

If absent, record an empty array and set `vowelPathPresent` to false.

### 5.6 `extractedVowelPath`

The deterministic path extracted from accepted form/root/decomposition material.

This is the path the model must reconcile with.

### 5.7 `vowelPathPresent`

Boolean.

This must stay explicit because a PASS with no `vowelPath` has a different meaning from a PASS with a checked path.

### 5.8 `mismatchKind`

A structured classification of the mismatch.

### 5.9 `extractionMaterial`

The material used to compute the extracted path.

This makes the repair auditable.

### 5.10 `formChanged`

Boolean.

Tracks whether the form changed between attempts.

### 5.11 `languageChanged`

Boolean.

Tracks whether the language changed between attempts.

### 5.12 `decompositionChanged`

Boolean.

Tracks whether the decomposition changed between attempts.

### 5.13 `allowedRepairActions`

Actions the next retry may take.

### 5.14 `blockedRepairActions`

Actions the next retry must not take.

### 5.15 `repairInstruction`

A single direct instruction generated from the scaffold.

This should be short and specific.

---

## 6. Mismatch Kinds

The scaffold should classify `PATH_MATCH` failures using this enum:

- `MISSING_VOWEL_PATH`
- `PATH_LENGTH_MISMATCH`
- `PATH_SYMBOL_MISMATCH`
- `PATH_ORDER_MISMATCH`
- `EXTRA_DECOMPOSITION_MATERIAL`
- `MISSING_DECOMPOSITION_MATERIAL`
- `FORM_CHANGED_DURING_REPAIR`
- `LANGUAGE_CHANGED_DURING_REPAIR`
- `UNKNOWN_PATH_MISMATCH`

### 6.1 `MISSING_VOWEL_PATH`

The candidate did not provide `vowelPath` in a stricter repair context.

### 6.2 `PATH_LENGTH_MISMATCH`

The declared and extracted paths have different lengths.

### 6.3 `PATH_SYMBOL_MISMATCH`

The declared path contains a different vowel symbol than the extracted path.

### 6.4 `PATH_ORDER_MISMATCH`

The declared symbols are present but ordered differently.

### 6.5 `EXTRA_DECOMPOSITION_MATERIAL`

The decomposition introduces extra vowel-bearing material not supported by the accepted form/root material.

### 6.6 `MISSING_DECOMPOSITION_MATERIAL`

The decomposition omits material required to justify the extracted path.

### 6.7 `FORM_CHANGED_DURING_REPAIR`

The candidate changed the accepted form during repair without an allowed variant/proto operation.

### 6.8 `LANGUAGE_CHANGED_DURING_REPAIR`

The candidate changed language during repair only to satisfy the check.

### 6.9 `UNKNOWN_PATH_MISMATCH`

Fallback for mismatches not yet classified.

---

## 7. Allowed Repair Actions

Allowed actions:

- recompute `vowelPath` from actual extracted material;
- correct decomposition if decomposition caused the mismatch;
- remove unsupported decomposition material;
- preserve accepted form;
- preserve language unless unsupported;
- explicitly fail if no truthful repair exists.

Allowed repair should make the candidate more truthful.

Allowed repair should not optimize for superficial PASS.

---

## 8. Blocked Repair Actions

Blocked actions:

- do not change form just to satisfy `PATH_MATCH`;
- do not change language just to satisfy `PATH_MATCH`;
- do not invent vowels;
- do not remove `vowelPath` to bypass checking;
- do not weaken `PATH_MATCH`;
- do not hide repeated failures;
- do not replace a real mismatch with vague decomposition;
- do not make the verifier pass by making the candidate less truthful.

---

## 9. Retry Prompt Payload Shape

The retry prompt should receive a structured repair object before prose instructions.

Recommended shape:

    {
      "repairContext": {
        "failedCheckId": "PATH_MATCH",
        "failedReason": "...",
        "acceptedForm": "...",
        "candidateLanguage": "...",
        "declaredVowelPath": ["..."],
        "extractedVowelPath": ["..."],
        "vowelPathPresent": true,
        "mismatchKind": "PATH_SYMBOL_MISMATCH",
        "extractionMaterial": {
          "form": "...",
          "decompositionText": "...",
          "rootMaterial": "..."
        },
        "formChanged": false,
        "languageChanged": false,
        "decompositionChanged": true,
        "allowedRepairActions": ["recompute_vowel_path", "correct_decomposition"],
        "blockedRepairActions": ["change_form_to_satisfy_path", "invent_vowels"],
        "repairInstruction": "Keep the accepted form fixed and recompute vowelPath from the extracted material."
      }
    }

The model should repair from this object.

The retry prompt should still include the doctrine:

    Repair must make the candidate true, not merely make the verifier pass.

---

## 10. Trace And Archive Requirements

Future traces should preserve the repair scaffold object.

Future local-provider smoke artifacts should preserve:

- the failed check;
- the repair scaffold object;
- the retry response;
- whether repair succeeded;
- whether form changed;
- whether language changed;
- whether `vowelPath.present` changed.

Archive artifacts must continue to record:

    candidateSummary.vowelPath.present

A PASS without `vowelPath.present=true` must not be treated as path validation.

---

## 11. Implementation Plan

### Phase 1 - Design Only

This PR.

Define the scaffold contract and claim boundaries.

### Phase 2 - Deterministic Helper

Add a helper that builds the repair scaffold object from verifier failure and candidate data.

### Phase 3 - Guard/Unit Tests

Add focused tests for:

- mismatch kind classification;
- blocked actions;
- allowed actions;
- `vowelPathPresent`;
- form/language change detection.

### Phase 4 - Prompt Wiring

Inject the repair scaffold object into the retry prompt.

Do not remove the doctrine text.

### Phase 5 - Controlled v0.4 Five-Word Smoke

Run a controlled five-word v0.4 smoke only after scaffold implementation and tests merge.

Archive the result whether it passes or fails.

---

## 12. Non-Goals

This design does not:

- implement the helper;
- change prompt code;
- change verifier logic;
- change parser logic;
- change scorer logic;
- change provider behavior;
- run a smoke;
- add or modify artifacts;
- expand to ten-word smoke;
- expand to twenty-word smoke;
- update README;
- make public claims;
- touch evals or Cohort evidence.

---

## 13. Claim Boundary

This is development design only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- a general model-quality proof;
- a reason to change the default provider from `mock`.

Allowed internal reading:

- v0.2-v0.3 diagnosis showed prompt-only repair guidance was insufficient.
- next work should design deterministic repair feedback before more smoke runs.
- repair architecture should preserve candidate truth before optimizing for PASS.

Blocked reading:

- the verifier should be weakened;
- local smoke should expand anyway;
- `llama3.1:8b` is proven generally bad;
- local provider work is useless;
- this supports or rejects ZË-RO bracket claims.

---

## 14. Completion Definition

This design is complete when:

- repair scaffold purpose is defined;
- required fields are defined;
- mismatch kinds are defined;
- allowed repair actions are defined;
- blocked repair actions are defined;
- retry prompt payload shape is defined;
- trace/archive requirements are defined;
- implementation phases are defined;
- non-goals are explicit;
- claim boundaries are explicit;
- no code changes are made;
- no artifacts are changed;
- local validation passes.
