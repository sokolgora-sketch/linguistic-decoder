# Cohort 03 `/i/` Pressure Mechanism Design v0.1

Status: design only
Scope: documentation only
Date recorded: 2026-05-20

## 1. Purpose

This document defines the next mechanism-focused investigation after the Cohort 03 high-region `/i/` pressure batch.

The previous batch summary is:

- `docs/evals/cohort-03-high-region-i-pressure-batch-summary-v0.1.md`

That summary changed the working interpretation from:

> possible global high-region failure

to:

> cross-family `/i/` high-region pressure, not global high-region failure

This document does not introduce new scores, new eval runs, or new support claims. It decides what mechanism question should be asked next.

## 2. Current evidence state

The completed batch records this pattern:

| Target | Family/domain | Result |
|---|---|---|
| Hindi `/i/` | Indo-Iranian | robust `COLLAPSED_HIGH` |
| Persian `/i/` | Indo-Iranian | robust `COLLAPSED_HIGH` |
| Arabic `/i/` | Semitic | robust `COLLAPSED_HIGH` |
| Hebrew `/i/` | Semitic | robust `COLLAPSED_HIGH` |
| Finnish `/y/` | Finnic / high front rounded control | `INTERMEDIATE` |
| Turkish `/ı/` | Turkic / high back unrounded control | mostly `INTERMEDIATE`, one mixed-target `EXCEEDS_LOW` |

The strongest current interpretation is:

> The pressure is concentrated around `/i/` under the current high-region lens. It is not a global high-region failure.

## 3. What is now known

The Hindi follow-up diagnostics already tested and reduced several explanations.

### 3.1 High-anchor contamination is not enough

Hindi `/i/` Arm C reduced obvious high-anchor target contamination and still collapsed high.

Current reading:

> Obvious high-anchor `/i/` contamination is not the primary explanation.

### 3.2 Target-bucket mixing is not enough

Hindi `/i/` target-bucket split produced collapse in both core and mixed target buckets.

Current reading:

> Broad target-bucket mixing is not the primary explanation.

### 3.3 Low-anchor token choice is not enough

Hindi `/i/` low-anchor sensitivity also collapsed across low-anchor variants.

Current reading:

> Low-anchor token choice is not the primary explanation.

### 3.4 The issue is not global high-region failure

Finnish `/y/` stayed `INTERMEDIATE`.

Turkish `/ı/` mostly stayed `INTERMEDIATE`, with one mixed-target `EXCEEDS_LOW`.

Current reading:

> The current lens can still hold non-`/i/` high-region controls as non-collapsed.

## 4. Mechanism hypotheses

The next investigation should distinguish between four mechanism hypotheses.

### H1 — `/i/` needs a narrower high-front lane

Hypothesis:

> `/i/` is being tested inside a bracket geometry that is too broad or not front-specific enough.

Expected signal:

- `/i/` may stabilize under a narrower high-front bracket such as selected `V6-V7` comparisons.
- Non-`/i/` controls should not be used to rescue `/i/`; they should only define contrast.

Risk:

- A narrower bracket could become post-hoc unless designed before running.
- This must be treated as a diagnostic lane, not support.

### H2 — `/i/` is over-compressed by current anchor definitions

Hypothesis:

> The current anchor definitions over-compress front high vowels upward, causing high-side collapse.

Expected signal:

- The same `/i/` target bucket remains unstable across language families.
- Alternative anchor definitions reduce high-side collapse without changing the target bucket.

Risk:

- This touches anchor doctrine and must not be changed from one batch alone.
- Any future anchor change must be versioned and tested against controls.

### H3 — `/i/` has target-internal semantic/phonotactic pressure

Hypothesis:

> `/i/` tokens across these languages share semantic or phonotactic features that pull them toward the high anchor independent of family.

Expected signal:

- Core/mixed splits may still collapse.
- Further splits by function class may reveal one subgroup driving collapse.

Risk:

- This can become endless token fishing.
- Any subgroup split must be fixed before scoring.

### H4 — scorer geometry is too coarse for high-front vowels

Hypothesis:

> The current scoring geometry does not distinguish high-front `/i/` from the upper anchor strongly enough.

Expected signal:

- `/i/` repeatedly crosses high-side collapse even when anchors and target buckets are cleaned.
- Finnish `/y/` and Turkish `/ı/` remaining non-collapsed suggests the issue is not all high vowels, but a specific high-front geometry boundary.

Risk:

- This is closest to scorer-model pressure.
- No scorer math change should happen until a design doc and regression plan exist.

## 5. Recommended next diagnostic direction

The next best step is not another broad language battery.

Recommended next direction:

> Design a narrow `/i/` high-front diagnostic lane before running more tests.

This should be a design-first lane with fixed rules:

1. choose two languages already shown to collapse, preferably Hindi and Arabic;
2. keep one previously collapsed target bucket unchanged;
3. test one narrower candidate bracket;
4. include one non-`/i/` high-region control;
5. export series evidence packs;
6. do not treat stabilization as support until replicated.

## 6. Proposed next batch design

Potential batch name:

- `cohort03-i-high-front-lane-probe-v0.1`

Primary question:

> Does a narrower high-front lane reduce `/i/` collapse without causing Finnish `/y/` or Turkish `/ı/` to collapse?

Candidate targets:

| Role | Target | Reason |
|---|---|---|
| primary `/i/` pressure target | Hindi `/i/` | most audited `/i/` case |
| cross-family `/i/` pressure target | Arabic `/i/` | Semitic replication |
| non-`/i/` high-front control | Finnish `/y/` | stayed `INTERMEDIATE` in cleaned comparison |
| non-front high control | Turkish `/ı/` | mostly `INTERMEDIATE` in cleaned comparison |

Possible test shape:

| Run class | Candidate bracket | Control bracket | Purpose |
|---|---|---|---|
| Hindi `/i/` | narrow high-front lane | prior collapsed bracket | see whether `/i/` remains high-collapsed |
| Arabic `/i/` | narrow high-front lane | prior collapsed bracket | check cross-family repeat |
| Finnish `/y/` | same lane or declared control lane | prior bracket | ensure non-`/i/` control is not forced to collapse |
| Turkish `/ı/` | separate high-back comparison | prior bracket | ensure dotless/back high vowel is not misread as dotted/front `/i/` |

The exact payloads are not defined in this document. They require a separate run-design document.

## 7. What not to do next

Do not:

- run more broad `/i/` support tests;
- rerun Hindi/Persian/Arabic/Hebrew with cosmetic token changes;
- update README;
- publish a claim from this mechanism stage;
- change scorer math;
- change anchor doctrine;
- call `/i/` support for `V5-V7`;
- call the high-region model solved.

## 8. Decision gate before new eval runs

Before any new `/evals` payloads, create a run-design doc that defines:

1. exact languages;
2. exact brackets;
3. exact target buckets;
4. exact anchor buckets;
5. expected readout logic;
6. claim boundaries;
7. export requirements.

No new high-region run should happen until that run-design doc exists.

## 9. Claim boundaries

Allowed:

- The completed batch supports a mechanism-design phase.
- Cross-family `/i/` pressure is the working interpretation.
- The issue is not currently global high-region failure.
- Finnish `/y/` and Turkish `/ı/` are useful controls because they did not repeat the same high-collapse pattern.
- A narrower high-front diagnostic lane is a reasonable next design question.

Blocked:

- Do not claim `/i/` supports any bracket.
- Do not claim `V6-V7` is the solution before testing.
- Do not claim Finnish `/y/` proves the model.
- Do not claim Turkish `/ı/` proves the model.
- Do not modify scorer math from this design alone.
- Do not modify anchor definitions from this design alone.
- Do not run additional high-region support tests before a run-design doc.
