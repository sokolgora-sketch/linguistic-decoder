# Cohort 03 Hindi `/i/` Length-Matched Main-Target Run Design v0.1

Status: design only  
Scope: `/evals` follow-up design, not yet runnable  
Date recorded: 2026-05-21

## 1. Purpose

This document defines the next narrow follow-up design for the Hindi `/i/` high-region pressure lane.

It follows three prior steps:

1. `docs/evals/cohort-03-hi-i-short-i-vs-long-ee-high-anchor-result-v0.1.md`
2. `docs/evals/cohort-03-hi-i-target-split-token-geometry-result-v0.1.md`
3. `compareTokenGeometryBucketsV0_1(...)` in `src/shared/evals/tokenGeometryInspection.v0.1.ts`

The goal is to test whether the main Hindi `/i/` target collapse persists after controlling the main target bucket for token-length / target-shape mismatch.

This document does not execute new `/evals` runs.

## 2. Current evidence chain

### 2.1 Short-`i` versus long-`ee` high-anchor result

The previous four-run probe produced a mixed mechanism result:

| Target bucket | Long-`ee` high anchor | Short-`i` high anchor |
|---|---|---|
| main | `COLLAPSED_HIGH` | `COLLAPSED_HIGH` with `BOUNDARY_UNCERTAIN_HIGH` |
| alternate | `COLLAPSED_HIGH` | `INTERMEDIATE` |

Interpretation locked there:

> Hindi `/i/` collapse is sensitive to high-anchor geometry, but the long-`ee` high anchor does not fully explain the pressure by itself.

### 2.2 Target-split token geometry

The target-split inspection found:

| Bucket | meanTokenLength | shortIMarkerCount | openFinalTokenCount | closedFinalTokenCount | maxConsonantCluster |
|---|---:|---:|---:|---:|---:|
| main target | `4.4` | `11` | `5` | `5` | `3` |
| alternate target | `5.5` | `10` | `2` | `8` | `2` |
| short-`i` high anchor | `5.4` | `13` | `7` | `3` | `3` |

Short-`i` high-anchor comparison:

| Comparison | highAnchorMeanTokenLengthMinusTarget | Flags |
|---|---:|---|
| main target vs short-`i` high anchor | `+1.0` | `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET`, `HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER` |
| alternate target vs short-`i` high anchor | `-0.1` | `HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER` |

Interpretation locked there:

> The main/alternate split is consistent with token-length geometry: the alternate target is shape-aligned with the short-`i` high anchor, while the main target remains substantially shorter.

## 3. Mechanism question

Primary question:

> Does Hindi `/i/` still return high-boundary collapse when the main target bucket is replaced by a length-matched short-`i` target bucket while keeping the short-`i` high anchor constant?

Operational version:

> If a new main-style target bucket is length-matched to the short-`i` high anchor, does the result move from near-boundary `COLLAPSED_HIGH` to `INTERMEDIATE`?

## 4. Hypothesis boundary

This design tests one mechanism only:

- target/high-anchor shape mismatch, especially mean token length.

It does not test:

- a new bracket;
- new anchor doctrine;
- new scorer behavior;
- broad language expansion;
- publication-level support;
- any solved-bracket claim for Hindi `/i/`.

## 5. Design status

This design is intentionally not yet runnable.

Reason:

> The new length-matched Hindi `/i/` target bucket must be curated and inspected before any `/evals` run is allowed.

This prevents accidental token invention and keeps the evidence chain clean.

## 6. Fixed buckets from prior work

### 6.1 Constant low anchor

Use the same `anchor_low` bucket as the prior probe:

~~~json
[
  "doodh",
  "phool",
  "sooraj",
  "roop",
  "bhookh",
  "khoon",
  "jhooth",
  "dhoop",
  "chooha",
  "kooda"
]
~~~

### 6.2 Existing main Hindi `/i/` target reference

This remains the reference bucket that produced near-boundary high collapse under the short-`i` high anchor:

~~~json
[
  "din",
  "dil",
  "sir",
  "kitab",
  "shiksha",
  "nadi",
  "pita",
  "kisan",
  "vidya",
  "mitti"
]
~~~

### 6.3 Existing alternate Hindi `/i/` target reference

This remains the reference bucket that stabilized under the short-`i` high anchor:

~~~json
[
  "chitra",
  "disha",
  "himmat",
  "kiran",
  "kismat",
  "nishan",
  "vikas",
  "shikar",
  "sitar",
  "jigar"
]
~~~

### 6.4 Short-`i` high anchor

Keep the same short-`i` high anchor:

~~~json
[
  "imli",
  "mirch",
  "khidki",
  "ginti",
  "dikkat",
  "likhna",
  "milna",
  "girna",
  "rishta",
  "bistar"
]
~~~

## 7. New bucket required before running

A new bucket is required:

- `length_matched_main_target`

It must be curated in a separate step before this design becomes runnable.

### 7.1 Curation rules

The `length_matched_main_target` bucket must satisfy:

| Rule | Requirement |
|---|---|
| language | Hindi |
| script | broad Latin transliteration only |
| token shape | single-token words only |
| punctuation | no spaces, apostrophes, hyphens, punctuation, or diacritics |
| lexicality | real lexical Hindi words only |
| vowel target | visible short `i` marker in every token |
| long-front exclusion | no `ee`, `ei`, `ea`, or `ii` markers |
| high-anchor reuse | do not reuse any short-`i` high-anchor token |
| reference reuse | preferably avoid reusing existing main/alternate target tokens |
| token count | 10 tokens |
| meanTokenLength target | `5.2` to `5.6`, ideally near `5.4` |
| minTokenLength target | preferably `4` or `5` |
| maxTokenLength target | preferably `6` |
| maxConsonantCluster | no higher than `3` |

### 7.2 Geometry acceptance target

Before running `/evals`, inspect with:

- `compareTokenGeometryBucketsV0_1(...)`
- `compareTargetToHighAnchorTokenGeometryV0_1(...)`

Acceptance target:

| Metric | Desired result |
|---|---|
| length-matched target meanTokenLength | near `5.4` |
| short-`i` high anchor meanTokenLength | `5.4` |
| highAnchorMeanTokenLengthMinusTarget | between `-0.3` and `+0.3` |
| `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET` | absent |
| every token has short `i` marker | yes |
| longHighFrontMarkerCount | `0` |

If the curated bucket fails these geometry conditions, do not run the series.

## 8. Proposed run set after curation

Once `length_matched_main_target` passes inspection, run a four-run series.

Series label:

- `cohort03-hi-i-length-matched-main-target-v0.1`

Common fields:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

### Run 1 — original main target reference

Run ID:

- `cohort03-hi-i-original-main-short-i-anchor-reference-r01`

Label:

- `hi-i-original-main-short-i-anchor-reference-r01`

Purpose:

> Reproduce the original main target against the same short-`i` high anchor inside this series.

Expected prior behavior:

- near-boundary `COLLAPSED_HIGH` with high-boundary pressure.

### Run 2 — length-matched main target candidate

Run ID:

- `cohort03-hi-i-length-matched-main-short-i-anchor-candidate-r01`

Label:

- `hi-i-length-matched-main-short-i-anchor-candidate-r01`

Purpose:

> Test whether length-matching the main-style target removes the near-boundary high collapse.

### Run 3 — alternate target reference

Run ID:

- `cohort03-hi-i-alt-short-i-anchor-reference-r01`

Label:

- `hi-i-alt-short-i-anchor-reference-r01`

Purpose:

> Keep the known stabilizing alternate target in the same series as a reference lane.

Expected prior behavior:

- `INTERMEDIATE`.

### Run 4 — curated bucket alternate check

Run ID:

- `cohort03-hi-i-length-matched-main-alt-check-r01`

Label:

- `hi-i-length-matched-main-alt-check-r01`

Purpose:

> Repeat the length-matched candidate with a second curated target variant only if the curation step produces two acceptable length-matched buckets.

If only one acceptable length-matched bucket is curated, Run 4 should be omitted and the series should become a three-run series. Do not invent a weak fourth run just to force symmetry.

## 9. Outcome logic

### Outcome A — length-matched target stabilizes

Pattern:

| Run | Verdict |
|---|---|
| original main reference | `COLLAPSED_HIGH` or near-boundary high pressure |
| length-matched candidate | `INTERMEDIATE` |
| alternate reference | `INTERMEDIATE` |

Interpretation:

> The original main-target collapse was likely strongly affected by target/high-anchor shape mismatch.

Allowed claim:

- target-length geometry is a major pressure source.

Blocked claim:

- a sole-cause explanation based on token length.

### Outcome B — length-matched target still collapses

Pattern:

| Run | Verdict |
|---|---|
| original main reference | `COLLAPSED_HIGH` |
| length-matched candidate | `COLLAPSED_HIGH` |
| alternate reference | `INTERMEDIATE` |

Interpretation:

> Length matching alone does not rescue the main-style target. Hindi `/i/` pressure likely involves additional target-internal structure.

Allowed claim:

- target length is insufficient as a sole explanation.

Blocked claim:

- model falsification from this result alone.

### Outcome C — all short-`i` target variants stabilize

Pattern:

| Run | Verdict |
|---|---|
| original main reference | `INTERMEDIATE` |
| length-matched candidate | `INTERMEDIATE` |
| alternate reference | `INTERMEDIATE` |

Interpretation:

> Prior main-target high collapse may not replicate under the same short-`i` anchor in a fresh series.

Allowed claim:

- prior pressure needs replication review.

Blocked claim:

- old result is invalid without evidence-pack audit.

### Outcome D — unstable or boundary-heavy results

Pattern:

- mixed verdicts;
- repeated `BOUNDARY_UNCERTAIN_HIGH`;
- contradictory candidate/reference behavior.

Interpretation:

> Hindi `/i/` remains a high-region pressure case requiring stricter target curation and possibly phonetic/acoustic validation.

Allowed claim:

- unresolved pressure.

Blocked claim:

- bracket support or model falsification.

## 10. Evidence pack requirements

After running, export one series evidence pack.

Expected ZIP name:

- `evals.series-evidence-pack.cohort03-hi-i-length-matched-main-target-v0.1.v0.1.zip`

Required inspection:

- `01_RUN_INDEX.md`
- `series-summary.csv`
- `series-diagnostics.json`
- all per-run `input.json`
- all per-run `report.json`
- all per-run `report.md`
- all per-run `report.pdf`
- all per-run `workbook.xlsx`
- all per-run `summary.csv`
- all per-run `notes.md`
- SHA256

Do not write a result doc until the ZIP is exported and inspected.

## 11. Claim boundaries

Allowed:

- The design follows the PR #1062 mixed-result chain.
- The design follows the PR #1063 target-split geometry result.
- The design uses the PR #1064 bucket-comparison helper as a curation gate.
- The design tests target/high-anchor shape mismatch.

Blocked:

- Do not run `/evals` before curation passes.
- Do not invent a length-matched Hindi bucket inside this design doc.
- Do not claim length fully explains Hindi `/i/`.
- Do not claim `V6-V7` solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not change scorer math.
- Do not change anchor doctrine.
- Do not broaden to new languages from this design alone.
- Do not update README.
- Do not publish this as final evidence.

## 12. Next step

Next required step:

> Curate candidate `length_matched_main_target` buckets and inspect them with the token-geometry helper.

Only after one or two buckets pass the curation gate should the runnable JSON payloads be written.
