# Cohort 03/04 High-Region Mechanism Overview v0.1

Status: internal mechanism overview  
Scope: documentation only  
Date recorded: 2026-05-25

## 1. Purpose

This document connects the Cohort 03 high-region pressure findings with the Cohort 04 Hindi `/i/` final-shape mechanism results.

The purpose is to preserve the internal research logic before any future paper framing or additional eval work.

Core question:

> How did Cohort 04 refine the high-region pressure findings left by Cohort 03?

## 2. Source documents

Cohort 03 sources:

- `docs/evals/cohort-03-hi-i-mechanism-synthesis-v0.1.md`
- `docs/evals/cohort-03-high-region-pressure-mechanism-note-outline-v0.1.md`
- `docs/evals/cohort-03-hi-i-length-matched-main-target-result-v0.1.md`
- `docs/evals/cohort-03-hi-i-length-matched-main-target-replication-result-v0.1.md`
- `docs/evals/cohort-03-hi-i-target-split-token-geometry-result-v0.1.md`
- `docs/evals/cohort-03-hi-ar-i-token-geometry-result-v0.1.md`

Cohort 04 sources:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-curation-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-mechanism-synthesis-v0.1.md`

## 3. Cohort 03 baseline problem

Cohort 03 established Hindi `/i/` as a high-region pressure case.

The important outcome was not simple support.

The important outcome was pressure:

> Hindi `/i/` remained unstable or high-boundary stressed even after length-matching and related controls.

Cohort 03 therefore did two things:

1. it prevented a simplistic high-bracket support claim;
2. it exposed token geometry as a likely active variable.

The working boundary after Cohort 03 was:

> Hindi `/i/` is a high-boundary pressure case, not a solved support case.

## 4. Cohort 04 refinement

Cohort 04 narrowed the pressure question.

Instead of asking whether Hindi `/i/` generally supports a high bracket, it asked a smaller mechanism question:

> Does final-shape distribution change Hindi `/i/` high-boundary pressure?

The key contrast was:

- open-final-heavy target buckets;
- closed-final-heavy target buckets;
- mixed-final and baseline comparators.

This was the correct move because Cohort 03 had already shown that length alone was insufficient.

## 5. Cohort 04 evidence pack 1 — final-shape comparison

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-closed-final-v0.1.v0.1.zip`

SHA256:

- `9e6904f18f65a25a505ce92bd8e55bb57dcb95520e0d4322ebf28ea572a287ef`

Result summary:

| Lane | Verdict | normalizedPosition | gap_high | Flags |
|---|---|---:|---:|---|
| baseline reference | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| open-final controlled | `INTERMEDIATE` | 0.608696 | 0.18 | none |
| closed-final controlled | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |
| mixed-final balanced | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

Reading:

> Open-final distribution reduced high-boundary pressure in this Hindi `/i/` pack.

This first pack isolated final-shape distribution as a plausible pressure variable.

## 6. Cohort 04 evidence pack 2 — open-final replication

Evidence ZIP:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-replication-v0.1.v0.1.zip`

SHA256:

- `9cd4a2934ca3a1fedd5e50115d4e930813f495775b7acb4ae91a40933bf2a82a`

Result summary:

| Lane | Verdict | normalizedPosition | gap_high | Flags |
|---|---|---:|---:|---|
| prior open-final reference | `INTERMEDIATE` | 0.608696 | 0.18 | none |
| open-final replication A | `INTERMEDIATE` | 0.626812 | 0.171667 | none |
| open-final replication B | `INTERMEDIATE` | 0.673913 | 0.15 | none |
| closed-final stress reference | `INTERMEDIATE` | 0.706522 | 0.135 | `BOUNDARY_UNCERTAIN_HIGH` |

Reading:

> The open-final pressure-reduction effect replicated in this Cohort 04 Hindi `/i/` pack.

This second pack made the signal stronger because two independently curated open-final lanes avoided high-boundary flags while the closed-final comparator retained the high-boundary stress pattern.

## 7. Combined high-region mechanism reading

The combined Cohort 03/04 reading is:

> Hindi `/i/` high-boundary pressure is partly controlled by token-final shape.

More precisely:

- Cohort 03 established pressure after length controls.
- Cohort 04 showed that open-final-heavy buckets reduce that pressure.
- Cohort 04 replication showed that the open-final effect repeats across independent target buckets.
- Closed-final-heavy buckets repeatedly preserve the high-boundary stress pattern.

This does not make Hindi `/i/` a solved high-bracket support case.

It explains one mechanism inside the pressure.

## 8. Mechanism statement

Internal mechanism statement:

> Open-final-heavy Hindi `/i/` buckets repeatedly reduce high-boundary stress, while closed-final-heavy Hindi `/i/` buckets repeatedly preserve it.

Interpretive consequence:

> Final shape is an active mechanism variable in the high-region bracket battery.

This is a mechanism claim, not a universal phonological law.

## 9. What this changes in the research map

Before Cohort 04:

> Hindi `/i/` was a pressure case that could not be resolved by length matching alone.

After Cohort 04:

> Hindi `/i/` remains a pressure case, but one pressure-reducing mechanism has been isolated and replicated: open-final target geometry.

This means future high-region tests should track at least:

- target mean token length;
- open-final versus closed-final distribution;
- high-boundary diagnostic flags;
- whether a clean result survives independent curation.

## 10. Allowed internal claims

Allowed internal claims:

- Cohort 03 exposed Hindi `/i/` as a high-region pressure case.
- Cohort 04 isolated final-shape distribution as an active mechanism variable.
- Open-final-heavy Hindi `/i/` target buckets repeatedly reduced high-boundary pressure.
- Closed-final-heavy Hindi `/i/` target buckets repeatedly retained `BOUNDARY_UNCERTAIN_HIGH`.
- The open-final pressure-reduction effect replicated across independently curated targets.
- Hindi `/i/` should be treated as a mechanism-rich pressure case, not a simple support case.

## 11. Blocked claims

Blocked claims:

- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim final-shape distribution is proven globally.
- Do not claim Cohort 03/04 is publication-ready.
- Do not publish this as public evidence.
- Do not update README with Cohort 03/04 claims.
- Do not frame this as a universal phonological law.

## 12. Publication boundary

This overview is internal.

It is not a public paper.

It is not a README update.

It is not a Zenodo or LingBuzz publication basis by itself.

Reason:

- The case is still one language/vowel focus.
- The token data are broad-Latin and not acoustic.
- The mechanism is internally replicated but not cross-linguistically generalized.
- Cohort 03 and Cohort 04 still need a broader paper-level argument before public framing.

Current status:

> Internal mechanism overview, not publication-ready.

## 13. Recommended next step

Recommended next step:

> Stop additional Hindi `/i/` eval runs and preserve this as the Cohort 03/04 high-region checkpoint.

Possible follow-up work should be one of:

1. a paper-outline doc for high-region pressure mechanisms;
2. a cross-language design using the same open-final/closed-final logic;
3. a VoiceLab/acoustic bridge design;
4. a TypeScript 6 migration project, separate from eval research.

## 14. Final checkpoint

Cohort 03/04 now has a coherent internal chain:

1. Cohort 03 found pressure.
2. Cohort 04 isolated final shape.
3. Cohort 04 replicated the open-final effect.
4. The combined result is a mechanism overview, not a publication claim.

The high-region model is stronger after this work, but the correct framing remains cautious:

> Mechanism isolated; support not overclaimed.
