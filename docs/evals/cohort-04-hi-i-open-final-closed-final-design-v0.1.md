# Cohort 04 Hindi `/i/` Open-Final / Closed-Final Design v0.1

Status: design only  
Scope: documentation only  
Date recorded: 2026-05-22

## 1. Purpose

This document defines a narrow follow-up mechanism design after Cohort 03.

Cohort 03 is closed as an internal mechanism archive, not a publication-ready cohort.

Cohort 04 begins only as a design question:

> Does open-final versus closed-final distribution explain high-edge pressure in Hindi `/i/` length-matched buckets?

This document does not create runnable buckets.  
This document does not authorize `/evals` runs.  
This document does not publish or update README claims.

## 2. Source context

This design follows:

- `docs/evals/cohort-03-publication-readiness-decision-v0.1.md`
- `docs/evals/cohort-03-final-scope-case-inventory-v0.1.md`
- `docs/evals/cohort-03-high-region-pressure-mechanism-note-outline-v0.1.md`
- `docs/evals/cohort-03-hi-i-target-split-token-geometry-result-v0.1.md`
- `docs/evals/cohort-03-hi-i-length-matched-main-target-result-v0.1.md`
- `docs/evals/cohort-03-hi-i-length-matched-main-target-replication-result-v0.1.md`
- `docs/evals/cohort-03-hi-i-mechanism-synthesis-v0.1.md`

## 3. Cohort 03 carry-forward boundary

Cohort 03 final classification:

> mixed mechanism cohort, not publication-ready

Hindi `/i/` final mechanism classification:

> length-sensitive high-boundary pressure case

Cohort 03 showed that length matching can prevent full high collapse at the verdict level, but the result remained boundary-stressed.

Therefore, Cohort 04 should not ask whether Hindi `/i/` is “solved.”

It should ask a narrower mechanism question.

## 4. Primary research question

Primary question:

> Holding mean token length near the accepted length-matched range, does open-final versus closed-final distribution change high-edge pressure in Hindi `/i/` buckets?

In practical terms:

- If an open-final controlled target stays cleaner than a closed-final controlled target, final openness may be a pressure regulator.
- If both remain similarly boundary-stressed, open/closed final distribution is probably not the main mechanism.
- If closed-final tokens stabilize better, the prior assumption needs revision.

## 5. Hypothesis

Working hypothesis:

> Hindi `/i/` high-edge pressure is influenced by target/high-anchor token geometry beyond mean length. Open-final versus closed-final distribution may be one separable pressure variable.

This is not a claim of support.

This is a mechanism hypothesis.

## 6. Design constraints

Any future runnable Cohort 04 pack must obey these constraints:

1. Keep `taskId` as `T5_INTERMEDIATE_V0_1`.
2. Keep `inputShape` as `intermediate_triple`.
3. Keep language as Hindi broad-Latin transliteration.
4. Keep vowel under test as `/i/`.
5. Keep anchors constant across lanes.
6. Keep mean token length close across target lanes.
7. Vary primarily open-final versus closed-final distribution.
8. Avoid reusing target tokens from prior Hindi `/i/` lanes unless explicitly declared as reference lanes.
9. Do not mix long-`ee` high-front spellings into short-`i` target lanes.
10. Do not claim support from a single run.
11. Preserve evidence-pack export after scoring.
12. Record every run ID, label, provider/model metadata, and evidence ZIP.

## 7. Proposed future lanes

This design proposes lanes only. It does not provide token buckets yet.

### Lane A — baseline reference

Purpose:

> Re-run one prior accepted length-matched Hindi `/i/` target as a reference lane.

Use:

- constant low anchor;
- constant short-`i` high anchor;
- prior accepted target only if the future curation doc explicitly copies it.

Expected role:

- reference, not new evidence by itself.

### Lane B — open-final controlled target

Purpose:

> Test a length-matched Hindi `/i/` target with a higher open-final count.

Design constraint:

- visible short `i`;
- mean length near the accepted length-matched range;
- mostly open-final tokens;
- no long-`ee` high-front markers.

Expected diagnostic:

- reduced high-edge pressure would suggest final openness may soften high-boundary stress.

### Lane C — closed-final controlled target

Purpose:

> Test a length-matched Hindi `/i/` target with a higher closed-final count.

Design constraint:

- visible short `i`;
- mean length near Lane B;
- mostly closed-final tokens;
- no long-`ee` high-front markers.

Expected diagnostic:

- increased high-edge pressure would support open/closed final distribution as an active variable.

### Lane D — mixed-final balanced target

Purpose:

> Test whether a balanced open/closed-final distribution behaves between Lane B and Lane C.

Design constraint:

- visible short `i`;
- mean length near Lane B and Lane C;
- balanced final shape;
- no long-`ee` high-front markers.

Expected diagnostic:

- intermediate behavior would strengthen the geometry-pressure interpretation.

## 8. Required curation output before evals

Before any `/evals` run, create a separate curation doc with:

1. exact token buckets;
2. rejected token list;
3. no-reuse check against previous Hindi `/i/` targets and anchors;
4. token-geometry summary per lane;
5. comparison against prior accepted and replication targets;
6. declared run IDs and labels;
7. exact `/evals` UI field instructions;
8. exact JSON payloads;
9. evidence-pack ZIP naming convention;
10. blocked claims.

## 9. Required run structure

No run structure is authorized yet.

A future curation/run-design doc must explicitly decide whether the series uses:

- 4 runs;
- 8 runs;
- another fixed count.

Do not infer the number of runs from this design doc.

The future document must state:

- target count;
- run IDs;
- labels;
- lane order;
- metadata fields;
- exact JSON payloads.

## 10. Expected verdict interpretation

Possible outcomes:

### Outcome 1 — open-final improves stability

Reading:

> Open-final distribution may reduce high-edge pressure in Hindi `/i/` length-matched buckets.

Allowed claim:

- open-final shape is a candidate pressure regulator.

Blocked claim:

- Do not claim Hindi `/i/` supports `V6-V7`.

### Outcome 2 — closed-final improves stability

Reading:

> Closed-final distribution may stabilize Hindi `/i/` more than expected.

Allowed claim:

- final-shape assumptions need revision.

Blocked claim:

- prior length-matching result was wrong.

### Outcome 3 — no meaningful difference

Reading:

> Open-final versus closed-final distribution is probably not the dominant pressure variable.

Allowed claim:

- mean length or another token-geometry variable may be more important.

Blocked claim:

- open/closed final shape has no effect in all languages.

### Outcome 4 — both collapse high

Reading:

> Hindi `/i/` remains high-region pressure even after final-shape control.

Allowed claim:

- high-boundary pressure remains unresolved.

Blocked claim:

- model is falsified from this test alone.

## 11. Blocked claims

Blocked claims:

- Do not claim Cohort 04 has started as an evidence cohort.
- Do not run `/evals` from this design doc alone.
- Do not create evidence packs from this design doc alone.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim closed-final distribution solves Hindi `/i/`.
- Do not claim length matching solves Hindi `/i/`.
- Do not publish this as public evidence.
- Do not update README.

## 12. Next required document

Next document required before any run:

> Cohort 04 Hindi `/i/` open-final / closed-final curation instructions v0.1

That document must create the token-generation rules and decide whether the first runnable series is 4-run or 8-run.

Until that curation document is merged, no new eval runs are authorized.
