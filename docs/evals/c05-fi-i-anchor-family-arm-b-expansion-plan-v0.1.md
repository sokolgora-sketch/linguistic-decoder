# Finnish /i/ Anchor-Family Arm B Expansion Plan v0.1

Status: CURATION EXPANSION PLAN ONLY
Project: ZË-RO Evals
Lane: Finnish `/i` anchor-family audit
Arm: B — function-matched place/object expansion
Date recorded: 2026-06-05

This document defines how to expand the Finnish `/i` Arm B `place/object` token pool.

It does not run evaluations.
It does not create evidence packs.
It does not create runnable JSON.
It does not add final token buckets.
It does not change scoring code.
It does not change bracket rules.
It does not update README.
It does not publish anything.
It does not claim Finnish `/i` supports any tested bracket.

Related documents:

- `docs/evals/c05-fi-i-anchor-geometry-scratch-notes-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-audit-design-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-arm-a-token-geometry-table-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-arm-a-review-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-arm-b-place-object-table-v0.1.md`

## 1. Purpose

PR #1193 showed that the existing scratch material is not sufficient for a clean runnable Arm B pack.

This plan defines the expansion rules before any new token table, runnable JSON, or scoring.

The goal is to expand the `place/object` pool without repeating the earlier confounds:

- mixed function classes;
- silent target-vowel contamination;
- final-`i` anchor contamination;
- hidden `ä` / `ö` front-vowel effects;
- short U-heavy anchor distortion;
- unbalanced open-final / closed-final target shape;
- high-anchor contamination without labels.

## 2. Claim boundaries

Allowed:

- define token expansion requirements;
- define accept / hold / reject rules;
- define target counts for future curation;
- define review gates before scoring;
- define sub-arm names for future non-scoring tables.

Blocked:

- do not score from this document;
- do not create `/evals` JSON from this document;
- do not treat this as evidence;
- do not treat this as publication evidence;
- do not treat this as cohort evidence;
- do not mix this with Open Instrument evidence;
- do not claim Finnish `/i` supports `V6→V7`, `V5→V7`, or `V4→V7`.

## 3. Expansion target

The next curation pass should create enough reviewed candidates to support later selection of clean `10/10/10` buckets.

This plan does not choose final buckets.

Minimum future candidate-pool targets:

| pool | minimum reviewed candidates | purpose |
|---|---:|---|
| clean low anchor — A/O/V4-style place/object | 18 | allow 10 clean selections plus rejected/held buffer |
| U-heavy V5-style place/object/object-adjacent | 18 | test whether V5 overcorrection survives length review |
| x_vowel open-final place/object | 18 | allow clean open-final target selection |
| x_vowel closed-final place/object | 18 | allow clean closed-final target selection |
| high anchor — high-contamination place/object/point-object | 18 | preserve intentional high-anchor pressure condition |
| high anchor — lower-contamination place/object/point-object | 18 | prepare later contamination-controlled split |

Reason for 18:

- final runnable buckets need 10 rows;
- curation needs room for rejects, holds, duplicate removal, length balancing, and front-vowel-confound filtering.

## 4. Required row schema

Every future expansion row must include:

| field | required | notes |
|---|---:|---|
| token | yes | Finnish standard orthography |
| proposedPool | yes | one of the expansion pools |
| intendedBucket | yes | `anchor_low`, `x_vowel`, or `anchor_high` |
| gloss | yes | short English gloss |
| functionClass | yes | must stay within place/object or declared adjacent class |
| partOfSpeech | yes | usually noun; adjectives should be rejected unless justified |
| finalShape | yes | `open_final` or `closed_final` |
| finalChar | yes | final visible character |
| contains_i | yes | visible Finnish `i` |
| i_count | yes | integer |
| i_position | yes | initial, medial, final, mixed, none |
| contains_ae | yes | visible `ä` |
| contains_oe | yes | visible `ö` |
| frontVowelConfoundRisk | yes | none, low, medium, high |
| charLength | yes | character count |
| roughSyllables | yes | rough count |
| lengthBand | yes | short, mid, long |
| expectedVoiceCarriers | yes | visible vowel carriers |
| expectedApertureRegion | yes | low, mid, high, mixed |
| sourceCheckNote | yes | dictionary/common-word/source check note |
| decision | yes | candidate, hold, reject |
| riskNote | yes | why the token may distort interpretation |

## 5. Function-class rules

Arm B is restricted to `place/object`.

Accepted classes:

- place/object;
- place/field;
- place/space;
- object/tool;
- object/container;
- object/material;
- point/line/object;
- field/substance only if explicitly labelled.

Hold classes:

- object/food;
- object/movement;
- object/knowledge;
- celestial object;
- field/weather;
- direction/place.

Rejected classes for clean Arm B:

- living object;
- body/organ;
- body/channel;
- person/kin;
- emotion/state;
- property/adjective;
- time;
- relation/state;
- event/action;
- abstract cognition unless explicitly isolated.

## 6. Contamination rules

### 6.1 Low-anchor contamination

Clean low-anchor rows should avoid visible `i`.

Reject for clean low-anchor use:

- final-`i` anchor rows;
- anchor rows with visible `i` unless they are placed in a labelled contaminated-control pool.

Known rejected/isolated rows:

- `koti`
- `ovi`
- `onni`

### 6.2 X-vowel target contamination

Target rows must contain visible `i`, unless explicitly marked as no-visible-`i` control.

For strict Arm B target rows:

- `contains_i` must be true;
- `i_count` must be at least 1;
- no-visible-`i` rows must be rejected or isolated.

Known rejected strict target row:

- `joutsen`

### 6.3 High-anchor contamination

The high anchor must be split later.

Future high-anchor pools:

1. high-contamination high anchor:
   - visible `i` allowed and expected;
   - must label `i_count` and `i_position`.

2. lower-contamination high anchor:
   - visible `i` minimized where possible;
   - must still preserve high/point/object function if available.

If lower-contamination high-anchor candidates cannot be curated cleanly, the failure should be documented instead of forced.

## 7. Front-vowel rules

Finnish `ä` and `ö` must be explicitly labelled.

Fields:

- `contains_ae`
- `contains_oe`
- `frontVowelConfoundRisk`

Interpretation:

| condition | risk |
|---|---|
| no `ä`, no `ö` | none |
| one `ä`, otherwise useful token | medium |
| one `ö`, otherwise useful token | medium |
| both `ä` and `ö` | high |
| multiple front vowels plus visible `i` | high |

Tokens with `ä` / `ö` are not automatically rejected, but they cannot be treated as clean seven-vowel-only material.

## 8. Length rules

The expansion must avoid repeating the U-heavy V5 short-token distortion.

Length bands:

| band | charLength |
|---|---:|
| short | 3-4 |
| mid | 5-6 |
| long | 7+ |

Future candidate pools should aim for:

- most selected rows in mid band;
- short rows allowed only if balanced across buckets;
- long rows allowed only if balanced across target/high buckets;
- U-heavy V5 rows must include mid-length alternatives, not only `puu`, `kuu`, `suu`, `luu`.

Mean token length should be recorded in the later curation-result table before runnable payloads are created.

## 9. Final-shape rules

Future target pools must keep open-final and closed-final visible.

At minimum:

- open-final x_vowel candidates: 18 reviewed rows;
- closed-final x_vowel candidates: 18 reviewed rows.

Do not silently mix open-final and closed-final targets if the future comparison is meant to test shape sensitivity.

If a later runnable Arm B pack combines final shapes, it must declare why.

## 10. Proposed sub-arms

Future non-scoring curation tables should be split as follows:

### Arm B1 — existing-material review

Purpose:

- preserve the PR #1193 finding;
- current scratch material is insufficient;
- no new tokens.

Status:

- already covered by `c05-fi-i-anchor-family-arm-b-place-object-table-v0.1.md`.

### Arm B2 — expanded place/object candidate pool

Purpose:

- add new reviewed Finnish place/object candidates;
- no runnable JSON yet;
- label all contamination and length fields.

Required before merge:

- at least 18 reviewed rows for each expansion pool;
- rejects and holds documented;
- no final bucket selection.

### Arm B3 — high-anchor contamination split

Purpose:

- separate high-anchor pressure from visible `i` contamination;
- compare high-contamination and lower-contamination high-anchor pools.

Required before merge:

- high-contamination candidate table;
- lower-contamination candidate table or documented failure to curate one;
- no scoring.

### Arm B4 — runnable-payload design

Purpose:

- only after B2/B3 review;
- design exact future run structure.

Blocked until:

- expanded curation table is reviewed;
- contamination split is reviewed;
- length/final-shape balance is summarized.

## 11. Stop conditions

Do not create runnable JSON if any of these are true:

- expansion table does not exist;
- fewer than 18 reviewed candidates exist for a required pool;
- target rows are not split by final shape;
- visible `i` contamination is not labelled;
- `ä` / `ö` contamination is not labelled;
- token length bands are missing;
- U-heavy V5 remains mostly short tokens;
- high-anchor contamination split is missing;
- `joutsen` or any no-visible-`i` row is mixed as normal target material;
- final-`i` anchor rows are used as clean low anchors;
- run purpose is support-seeking.

## 12. Next safe work

Next safe evals work:

1. create Arm B2 expanded place/object candidate-pool table;
2. keep it curation-only;
3. do not create runnable JSON;
4. do not score;
5. review expansion before any payload design.
