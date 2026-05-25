# High-Region Pressure Mechanisms Paper Outline v0.1

Status: internal paper outline  
Scope: documentation only  
Date recorded: 2026-05-25

## 1. Purpose

This document outlines a possible future paper about high-region pressure mechanisms in the ZË-RO vowel-bracket battery.

It is based on the Cohort 03/04 Hindi `/i/` evidence chain.

This is not a paper draft.

This is not publication-ready.

This is not a README update.

This is not a Zenodo or LingBuzz publication plan.

## 2. Proposed working title

Possible title:

> High-Region Pressure Mechanisms in Vowel-Bracket Testing: Hindi `/i/`, Token Geometry, and Final-Shape Effects

Shorter internal title:

> High-Region Pressure Mechanisms

## 3. Core thesis

Working thesis:

> High-region vowel-bracket pressure is not always resolved by changing anchor placement or matching token length. In Hindi `/i/`, Cohort 03 exposed persistent high-boundary pressure, while Cohort 04 isolated final-shape distribution as a repeatable pressure-reducing variable.

One-sentence mechanism claim:

> Open-final-heavy Hindi `/i/` target buckets repeatedly reduced high-boundary stress, while closed-final-heavy buckets preserved it.

Boundary:

> Mechanism isolated; support not overclaimed.

## 4. Source base

Primary source documents:

- `docs/evals/cohort-03-04-high-region-mechanism-overview-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-mechanism-synthesis-v0.1.md`
- `docs/evals/cohort-03-hi-i-mechanism-synthesis-v0.1.md`
- `docs/evals/cohort-03-high-region-pressure-mechanism-note-outline-v0.1.md`

Cohort 04 result sources:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-result-v0.1.md`

Publication-style precedent only:

- `docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md`
- `docs/papers/zero-cohort-01-reproduction-runbook-v0.1.md`

The Cohort 01 paper and runbook are not evidence for the Hindi `/i/` mechanism claim. They are only formatting and publication-process precedent.

## 5. Why this paper exists

The paper would exist because Cohort 03 and Cohort 04 together produce a useful research pattern:

1. Cohort 03 found a pressure case.
2. Cohort 03 showed length matching was helpful but insufficient.
3. Cohort 04 narrowed the mechanism question to final shape.
4. Cohort 04 showed open-final-heavy buckets reduce high-boundary stress.
5. Cohort 04 replicated the open-final effect with independent target buckets.

This is worth preserving because it changes the research posture.

The question is no longer:

> Does Hindi `/i/` simply support `V6-V7`?

The better question is:

> Which token-geometry variables increase or reduce Hindi `/i/` high-boundary pressure?

## 6. Proposed paper structure

### Section 1 — Problem statement

Explain the high-region problem:

- Hindi `/i/` did not behave like a clean support case.
- Early tests showed high collapse or high-boundary stress.
- The pressure persisted across multiple controls.
- A simple bracket-support interpretation would overclaim the evidence.

Core statement:

> Hindi `/i/` is a mechanism-rich pressure case, not a simple support case.

### Section 2 — Method context

Summarize the bracket-battery method:

- `T5_INTERMEDIATE_V0_1`
- `intermediate_triple`
- low anchor
- target vowel bucket
- high anchor
- verdicts:
  - `INTERMEDIATE`
  - `COLLAPSED_HIGH`
  - `COLLAPSED_LOW`
- diagnostic flags:
  - `BOUNDARY_UNCERTAIN_HIGH`
  - `NEAR_COLLAPSE_HIGH`

Do not repeat the full Cohort 01 method unless needed.

Reference the Cohort 01 paper/runbook as method precedent only.

### Section 3 — Cohort 03: pressure after length controls

Summarize Cohort 03:

- Hindi `/i/` showed high-boundary pressure.
- Long-`ee` anchors increased high-region pressure.
- Short-`i` anchors reduced pressure but did not fully stabilize the case.
- Length matching moved runs away from full collapse but retained high-boundary stress.

Key mechanism statement from Cohort 03:

> Hindi `/i/` is length-sensitive and target-shape-sensitive, but remains high-boundary stressed.

Blocked claim:

> Do not claim Hindi `/i/` supports `V6-V7`.

### Section 4 — The mechanism gap

Explain the unresolved question after Cohort 03:

> If length matching helps but does not solve the pressure, what token geometry variable is still active?

Candidate variables:

- mean token length;
- max token length;
- anchor mismatch;
- open-final versus closed-final distribution;
- transliteration geometry;
- short-`i` versus long-`ee` marking.

Cohort 04 focused on final shape because it is measurable inside broad-Latin bucket geometry.

### Section 5 — Cohort 04 final-shape comparison

Summarize the first Cohort 04 evidence pack.

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-closed-final-v0.1.v0.1.zip`

SHA256:

- `9e6904f18f65a25a505ce92bd8e55bb57dcb95520e0d4322ebf28ea572a287ef`

Result table:

| Lane | Verdict | normalizedPosition | gap_high | Flags |
|---|---|---:|---:|---|
| baseline reference | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| open-final controlled | `INTERMEDIATE` | 0.608696 | 0.18 | none |
| closed-final controlled | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| mixed-final balanced | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

Interpretation:

> Open-final distribution reduced high-boundary pressure in this Hindi `/i/` pack.

### Section 6 — Cohort 04 open-final replication

Summarize the second Cohort 04 evidence pack.

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-replication-v0.1.v0.1.zip`

SHA256:

- `9cd4a2934ca3a1fedd5e50115d4e930813f495775b7acb4ae91a40933bf2a82a`

Result table:

| Lane | Verdict | normalizedPosition | gap_high | Flags |
|---|---|---:|---:|---|
| prior open-final reference | `INTERMEDIATE` | 0.608696 | 0.18 | none |
| open-final replication A | `INTERMEDIATE` | 0.626812 | 0.171667 | none |
| open-final replication B | `INTERMEDIATE` | 0.673913 | 0.15 | none |
| closed-final stress reference | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

Interpretation:

> The open-final pressure-reduction effect replicated in this Cohort 04 Hindi `/i/` pack.

### Section 7 — Mechanism model

State the mechanism model carefully:

> Final shape acts as a pressure variable in the Hindi `/i/` high-region battery.

Operational definition:

- open-final = target token ends in `a`, `e`, `i`, `o`, or `u`;
- closed-final = target token ends in another ASCII letter.

Observed pattern:

- open-final-heavy buckets avoided high-boundary flags;
- closed-final-heavy buckets retained `BOUNDARY_UNCERTAIN_HIGH`.

Important boundary:

> This is a token-geometry mechanism, not a universal phonological law.

### Section 8 — What this does and does not prove

Allowed:

- final-shape distribution is active in this Hindi `/i/` setup;
- the open-final effect replicated across independent target buckets;
- Hindi `/i/` should be treated as a mechanism-rich pressure case.

Blocked:

- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim final-shape distribution is proven globally.
- Do not claim the model is confirmed.
- Do not claim the case is publication-ready.

### Section 9 — Figures and tables needed

Potential tables:

1. Cohort 03 pressure trajectory table.
2. Cohort 04 final-shape comparison table.
3. Cohort 04 open-final replication table.
4. Mechanism boundary table:
   - allowed claims;
   - blocked claims;
   - remaining uncertainties.

Potential figures:

1. High-boundary pressure diagram.
2. Open-final versus closed-final lane comparison.
3. Cohort 03 to Cohort 04 mechanism narrowing diagram.

### Section 10 — Evidence package needed before publication

Before this can become a real paper, the project needs a clean evidence package:

- source result docs;
- evidence ZIPs;
- SHA256 values;
- run index extracts;
- series summaries;
- exact token buckets;
- method notes;
- claim-boundary statement;
- reproduction notes.

This outline does not create that evidence package.

### Section 11 — Remaining uncertainties

Known limits:

- one language/vowel focus;
- broad-Latin transliteration only;
- no acoustic measurement yet;
- final shape replicated internally but not cross-linguistically;
- high-region bracket interpretation remains unresolved;
- Hindi `/i/` remains a pressure case, not clean support.

### Section 12 — Publication-readiness decision

Current decision:

> Not publication-ready.

Reason:

- the mechanism is internally strong but narrow;
- cross-language validation is missing;
- acoustic validation is missing;
- the paper argument has not been drafted;
- the evidence package has not been assembled for public review.

### Section 13 — Recommended next step

Recommended next step:

> Do not run more Hindi `/i/` evals immediately.

Better next step:

1. assemble a paper-ready evidence map;
2. decide whether to add one cross-language comparison;
3. decide whether to design a VoiceLab/acoustic bridge;
4. only then draft the full paper.

## 7. Claim boundaries

Allowed internal paper-outline claim:

> Cohort 03/04 isolated a repeatable final-shape pressure mechanism in Hindi `/i/`.

Blocked claims:

- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim final-shape distribution is proven globally.
- Do not claim Cohort 03/04 is publication-ready.
- Do not publish this as public evidence.
- Do not update README with Cohort 03/04 claims.

## 8. Final status

This is an internal outline.

It is useful for future writing.

It should not trigger public publication work yet.

Status:

> Internal paper outline, not publication-ready.
