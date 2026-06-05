# Finnish /i/ Anchor-Family Arm B2 Expanded Place/Object Candidates v0.1

Status: CURATION WORKSHEET ONLY
Project: ZË-RO Evals
Lane: Finnish `/i` anchor-family audit
Arm: B2 — expanded place/object candidate pool
Date recorded: 2026-06-05

This document defines the Arm B2 candidate-pool worksheet for expanding Finnish `/i` place/object material.

It does not run evaluations.
It does not create evidence packs.
It does not create runnable JSON.
It does not add final token buckets.
It does not claim any candidate pool is complete.
It does not claim any token is source-verified unless a future row explicitly says so.
It does not change scoring code.
It does not change bracket rules.
It does not update README.
It does not publish anything.
It does not claim Finnish `/i` supports any tested bracket.

Related documents:

- `docs/evals/c05-fi-i-anchor-geometry-scratch-notes-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-audit-design-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-arm-b-place-object-table-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-arm-b-expansion-plan-v0.1.md`

## 1. Purpose

PR #1195 defined the Arm B2 expansion requirement:

- create expanded place/object candidate pools;
- keep the work curation-only;
- do not create runnable JSON;
- do not score;
- review expansion before payload design.

This document creates the repo-tracked worksheet for that expansion.

The worksheet is intentionally not populated with unverified Finnish tokens.

A future curation PR must fill candidate rows only after dictionary/common-word review.

## 2. Required candidate pools

Each pool targets at least 18 reviewed rows before payload design.

| poolId | pool | minimum reviewed candidates | status |
|---|---|---:|---|
| low_clean_ao_v4_place_object | clean low anchor — A/O/V4-style place/object | 18 | not filled |
| low_u_heavy_v5_place_object | U-heavy V5-style place/object/object-adjacent | 18 | not filled |
| x_open_place_object | x_vowel open-final place/object | 18 | not filled |
| x_closed_place_object | x_vowel closed-final place/object | 18 | not filled |
| high_i_contaminated_place_object | high anchor — high-contamination place/object/point-object | 18 | not filled |
| high_lower_contamination_place_object | high anchor — lower-contamination place/object/point-object | 18 | not filled |

## 3. Row schema

Every future row must use this schema.

| field | required | notes |
|---|---:|---|
| token | yes | Finnish standard orthography |
| proposedPool | yes | one of the pool IDs above |
| intendedBucket | yes | `anchor_low`, `x_vowel`, or `anchor_high` |
| gloss | yes | short English gloss |
| functionClass | yes | must stay within place/object or declared adjacent class |
| partOfSpeech | yes | usually noun |
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

## 4. Acceptance rules

### 4.1 Clean low anchor — A/O/V4-style place/object

Accept only rows that are:

- place/object, place/field, place/space, object/material, or object/container;
- visible-`i` free;
- not final-`i`;
- not obvious emotion/state, person/kin, living-object, time, or property/adjective material.

Known blocked rows for clean use:

- `koti`
- `ovi`
- `onni`

### 4.2 U-heavy V5-style place/object/object-adjacent

Accept rows that:

- are U-heavy or U-dominant;
- are place/object or object-adjacent;
- include mid-length alternatives, not only short long-vowel rows.

Do not allow the future pool to be dominated by:

- `puu`
- `kuu`
- `suu`
- `luu`

These may be retained only as labelled short-token stress rows.

### 4.3 X-vowel open-final place/object

Accept rows that:

- contain visible `i`;
- are open-final;
- are place/object, place/field, object/tool, object/container, or object/material;
- avoid living-object and property/adjective classes unless explicitly held.

### 4.4 X-vowel closed-final place/object

Accept rows that:

- contain visible `i`;
- are closed-final;
- are place/object, place/field, object/tool, object/container, or object/material.

Known blocked strict row:

- `joutsen`

Reason:

- no visible `i`;
- living-object class;
- may only be used later as an explicit no-visible-`i` control.

### 4.5 High-contamination high anchor

Accept rows that:

- contain visible `i`;
- ideally have high/front or point/line/object behavior;
- label `i_count` and `i_position`;
- declare if the row is place/object, point/line/object, field/substance, or only adjacent.

### 4.6 Lower-contamination high anchor

Accept rows that:

- minimize visible `i` where possible;
- still preserve high-anchor or point/object behavior where possible;
- document failure if such rows cannot be curated honestly.

Do not force weak rows to satisfy the count.

If clean lower-contamination high-anchor rows cannot reach 18, record the shortfall.

## 5. Front-vowel rules

Every row must label:

- `contains_ae`
- `contains_oe`
- `frontVowelConfoundRisk`

Risk guide:

| condition | risk |
|---|---|
| no `ä`, no `ö` | none |
| one `ä`, otherwise useful token | medium |
| one `ö`, otherwise useful token | medium |
| both `ä` and `ö` | high |
| multiple front vowels plus visible `i` | high |

`ä` and `ö` are not automatic rejects, but they cannot be treated as clean seven-vowel-only material.

## 6. Length rules

Length bands:

| band | charLength |
|---|---:|
| short | 3-4 |
| mid | 5-6 |
| long | 7+ |

Future curation should prefer mid-band rows.

Short rows are allowed only if balanced across pools.

Long rows are allowed only if balanced across target/high pools.

The later filled table must summarize:

- count by pool;
- count by lengthBand;
- mean charLength by pool;
- open-final vs closed-final counts;
- visible-`i` count by pool;
- `ä` / `ö` count by pool.

## 7. Empty worksheet tables

These tables are intentionally empty placeholders.

A future curation PR must fill them with reviewed Finnish tokens.

### 7.1 clean low anchor — A/O/V4-style place/object

| token | proposedPool | intendedBucket | gloss | functionClass | partOfSpeech | finalShape | finalChar | contains_i | i_count | i_position | contains_ae | contains_oe | frontVowelConfoundRisk | charLength | roughSyllables | lengthBand | expectedVoiceCarriers | expectedApertureRegion | sourceCheckNote | decision | riskNote |
|---|---|---|---|---|---|---|---|---:|---:|---|---:|---:|---|---:|---:|---|---|---|---|---|---|

### 7.2 U-heavy V5-style place/object/object-adjacent

| token | proposedPool | intendedBucket | gloss | functionClass | partOfSpeech | finalShape | finalChar | contains_i | i_count | i_position | contains_ae | contains_oe | frontVowelConfoundRisk | charLength | roughSyllables | lengthBand | expectedVoiceCarriers | expectedApertureRegion | sourceCheckNote | decision | riskNote |
|---|---|---|---|---|---|---|---|---:|---:|---|---:|---:|---|---:|---:|---|---|---|---|---|---|

### 7.3 x_vowel open-final place/object

| token | proposedPool | intendedBucket | gloss | functionClass | partOfSpeech | finalShape | finalChar | contains_i | i_count | i_position | contains_ae | contains_oe | frontVowelConfoundRisk | charLength | roughSyllables | lengthBand | expectedVoiceCarriers | expectedApertureRegion | sourceCheckNote | decision | riskNote |
|---|---|---|---|---|---|---|---|---:|---:|---|---:|---:|---|---:|---:|---|---|---|---|---|---|

### 7.4 x_vowel closed-final place/object

| token | proposedPool | intendedBucket | gloss | functionClass | partOfSpeech | finalShape | finalChar | contains_i | i_count | i_position | contains_ae | contains_oe | frontVowelConfoundRisk | charLength | roughSyllables | lengthBand | expectedVoiceCarriers | expectedApertureRegion | sourceCheckNote | decision | riskNote |
|---|---|---|---|---|---|---|---|---:|---:|---|---:|---:|---|---:|---:|---|---|---|---|---|---|

### 7.5 high anchor — high-contamination place/object/point-object

| token | proposedPool | intendedBucket | gloss | functionClass | partOfSpeech | finalShape | finalChar | contains_i | i_count | i_position | contains_ae | contains_oe | frontVowelConfoundRisk | charLength | roughSyllables | lengthBand | expectedVoiceCarriers | expectedApertureRegion | sourceCheckNote | decision | riskNote |
|---|---|---|---|---|---|---|---|---:|---:|---|---:|---:|---|---:|---:|---|---|---|---|---|---|

### 7.6 high anchor — lower-contamination place/object/point-object

| token | proposedPool | intendedBucket | gloss | functionClass | partOfSpeech | finalShape | finalChar | contains_i | i_count | i_position | contains_ae | contains_oe | frontVowelConfoundRisk | charLength | roughSyllables | lengthBand | expectedVoiceCarriers | expectedApertureRegion | sourceCheckNote | decision | riskNote |
|---|---|---|---|---|---|---|---|---:|---:|---|---:|---:|---|---:|---:|---|---|---|---|---|---|

## 8. Stop conditions

Do not create runnable JSON if any of these are true:

- this worksheet is still empty;
- fewer than 18 reviewed candidates exist for a required pool;
- any required field is missing;
- target rows are not split by final shape;
- visible `i` contamination is not labelled;
- `ä` / `ö` contamination is not labelled;
- token length bands are missing;
- U-heavy V5 remains mostly short tokens;
- high-anchor contamination split is missing;
- `joutsen` or any no-visible-`i` row is mixed as normal target material;
- final-`i` anchor rows are used as clean low anchors;
- run purpose is support-seeking.

## 9. Next safe work

Next safe evals work:

1. fill one pool at a time with source-checked Finnish candidates;
2. begin with the clean low anchor pool or x_vowel open-final pool;
3. keep the next PR curation-only;
4. do not create runnable JSON;
5. do not score.
