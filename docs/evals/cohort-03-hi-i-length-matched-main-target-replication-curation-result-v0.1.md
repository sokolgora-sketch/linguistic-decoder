# Cohort 03 Hindi `/i/` Length-Matched Main-Target Replication Curation Result v0.1

Status: replication curation result + runnable payload package  
Scope: documentation only  
Date recorded: 2026-05-21

## 1. Purpose

This document records the second length-matched Hindi `/i/` candidate curation result for replication.

It follows:

1. `docs/evals/cohort-03-hi-i-length-matched-main-target-result-v0.1.md`
2. `docs/evals/cohort-03-hi-i-length-matched-main-target-curation-result-v0.1.md`
3. `docs/evals/cohort-03-hi-i-length-matched-main-target-run-design-v0.1.md`

The previous result showed that length matching moved the Hindi `/i/` main-target lane from near-boundary `COLLAPSED_HIGH` to `INTERMEDIATE`, but the accepted candidate still carried `BOUNDARY_UNCERTAIN_HIGH`.

This replication package tests whether that stabilization repeats with a second independently curated length-matched target bucket.

This document does not record scored results. No `/evals` runs have been executed yet.

## 2. Prior result summary

Prior series:

- `cohort03-hi-i-length-matched-main-target-v0.1`

Prior evidence pack:

- `evals.series-evidence-pack.cohort03-hi-i-length-matched-main-target-v0.1.v0.1.zip`

Prior SHA256:

- `4ef3e437635393643d61bf5c90dec87c3a5839bc1c4537fc9aec98f463fbcb27`

Prior result:

| Lane | Verdict | Flags |
|---|---|---|
| original main target reference | `COLLAPSED_HIGH` | `BOUNDARY_UNCERTAIN_HIGH` |
| length-matched main target candidate | `INTERMEDIATE` | `BOUNDARY_UNCERTAIN_HIGH` |
| alternate target reference | `INTERMEDIATE` | none |

Prior interpretation:

> The original Hindi `/i/` main-target collapse was strongly affected by target/high-anchor shape mismatch, especially token length.

Prior caveat:

> The length-matched candidate still carried `BOUNDARY_UNCERTAIN_HIGH`, and only one accepted length-matched candidate had been tested.

## 3. Replication curation goal

Curate one new independent Hindi `/i/` length-matched target bucket that:

- avoids all previous target/high-anchor/candidate/rejected tokens;
- remains broad Latin transliteration;
- keeps visible short `i` in every token;
- avoids `ee`, `ei`, `ea`, and `ii`;
- keeps mean token length inside `5.2` to `5.6`;
- ideally matches the short-`i` high anchor mean token length of `5.4`;
- avoids `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET`.

## 4. Forbidden token sets

Do not reuse tokens from these buckets.

### 4.1 Original main target

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

### 4.2 Alternate target

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

### 4.3 Short-`i` high anchor

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

### 4.4 Previously accepted Candidate A

~~~json
[
  "billi",
  "ginna",
  "pisna",
  "tikna",
  "chinta",
  "gilaas",
  "sitara",
  "nikas",
  "hissa",
  "chipak"
]
~~~

### 4.5 Previously rejected Candidate B

~~~json
[
  "tikli",
  "pilla",
  "sikki",
  "khilna",
  "chikna",
  "silsila",
  "pisai",
  "jhilmil",
  "tipni",
  "ghisna"
]
~~~

## 5. Candidate buckets inspected

### 5.1 Raw replication candidate A — revised and accepted

Original proposed token with lexical warning:

- `nimak`

Issue:

- dialectal/questionable lexical status.

Revision:

- replaced `nimak` with `vishay`.

Accepted revised bucket ID:

- `length_matched_main_target_replication_a_revised`

Accepted tokens:

~~~json
[
  "hilna",
  "silna",
  "pitna",
  "tilak",
  "sikka",
  "bijli",
  "mirgi",
  "chidiya",
  "likhit",
  "vishay"
]
~~~

Geometry summary:

| Metric | Value |
|---|---:|
| tokenCount | `10` |
| uniqueTokenCount | `10` |
| meanTokenLength | `5.4` |
| minTokenLength | `5` |
| maxTokenLength | `7` |
| openFinalTokenCount | `8` |
| closedFinalTokenCount | `2` |
| maxConsonantCluster | `2` |
| markerTokenCounts.i | `10` |
| shortIMarkerCount | `14` |
| longHighFrontMarkerCount | `0` |

Short-`i` high-anchor comparison:

| Metric | Value |
|---|---:|
| highAnchorMeanTokenLengthMinusTarget | `0` |
| highAnchorLongHighFrontMarkersMinusTarget | `0` |
| highAnchorShortIMarkersMinusTarget | `-1` |
| flags | `HIGH_ANCHOR_HAS_FEWER_SHORT_I_MARKERS_THAN_TARGET`, `HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER` |

Gate verdict:

- accepted

Reason:

> The revised bucket passes the geometry gate, avoids forbidden reuse, removes the lexical warning from `nimak`, and remains length-matched to the short-`i` high anchor.

### 5.2 Replication candidate B — rejected

Bucket ID:

- `length_matched_main_target_replication_b`

Tokens:

~~~json
[
  "tirna",
  "sidha",
  "hilana",
  "sikna",
  "pitai",
  "chinta",
  "ninda",
  "bilkul",
  "kiraya",
  "pichak"
]
~~~

Gate verdict:

- rejected

Reason:

- `REUSES_FORBIDDEN_TOKENS`

Forbidden reused token:

- `chinta`

Candidate B must not be used in the replication series.

## 6. Final replication run decision

Use a three-run replication series:

1. original main target + short-`i` high anchor reference;
2. accepted revised replication target + short-`i` high anchor candidate;
3. alternate target + short-`i` high anchor reference.

Do not add Candidate B.

Do not add a fourth run.

## 7. Series metadata

Series label:

- `cohort03-hi-i-length-matched-main-target-replication-v0.1`

Common fields:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Provider/model metadata for hand-pasted researcher-curated buckets:

- `provider`: `researcher`
- `model`: `researcher`
- `sourceEngineId`: leave blank
- `sourceEngineVersion`: leave blank
- `sourceEngineBuild`: leave blank

## 8. Runnable payloads

### Run 1 — original main target reference

Run ID:

- `cohort03-hi-i-repl-original-main-short-i-anchor-reference-r01`

Label:

- `hi-i-repl-original-main-short-i-anchor-reference-r01`

Purpose:

> Re-run the original main target against the same short-`i` high anchor inside the replication series.

Payload:

~~~json
{
  "taskId": "T5_INTERMEDIATE_V0_1",
  "inputShape": "intermediate_triple",
  "languageHint": "hi",
  "vowelUnderTest": "i",
  "anchorLow": "V6",
  "anchorHigh": "V7",
  "buckets": {
    "anchor_low": [
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
    ],
    "x_vowel": [
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
    ],
    "anchor_high": [
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
  }
}
~~~

### Run 2 — revised length-matched replication candidate

Run ID:

- `cohort03-hi-i-repl-length-matched-main-short-i-anchor-candidate-r01`

Label:

- `hi-i-repl-length-matched-main-short-i-anchor-candidate-r01`

Purpose:

> Test whether a second length-matched Hindi `/i/` target bucket repeats the stabilization from near-boundary `COLLAPSED_HIGH` to `INTERMEDIATE`.

Payload:

~~~json
{
  "taskId": "T5_INTERMEDIATE_V0_1",
  "inputShape": "intermediate_triple",
  "languageHint": "hi",
  "vowelUnderTest": "i",
  "anchorLow": "V6",
  "anchorHigh": "V7",
  "buckets": {
    "anchor_low": [
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
    ],
    "x_vowel": [
      "hilna",
      "silna",
      "pitna",
      "tilak",
      "sikka",
      "bijli",
      "mirgi",
      "chidiya",
      "likhit",
      "vishay"
    ],
    "anchor_high": [
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
  }
}
~~~

### Run 3 — alternate target reference

Run ID:

- `cohort03-hi-i-repl-alt-short-i-anchor-reference-r01`

Label:

- `hi-i-repl-alt-short-i-anchor-reference-r01`

Purpose:

> Keep the known length-aligned alternate target reference in the replication series.

Payload:

~~~json
{
  "taskId": "T5_INTERMEDIATE_V0_1",
  "inputShape": "intermediate_triple",
  "languageHint": "hi",
  "vowelUnderTest": "i",
  "anchorLow": "V6",
  "anchorHigh": "V7",
  "buckets": {
    "anchor_low": [
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
    ],
    "x_vowel": [
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
    ],
    "anchor_high": [
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
  }
}
~~~

## 9. How to run after merge

After this document is merged:

1. Open `/evals`.
2. Use series label:
   - `cohort03-hi-i-length-matched-main-target-replication-v0.1`
3. Use target count:
   - `3`
4. Run the three payloads above.
5. Save each run.
6. Export one series evidence pack.

Expected ZIP name:

- `evals.series-evidence-pack.cohort03-hi-i-length-matched-main-target-replication-v0.1.v0.1.zip`

## 10. Evidence-pack inspection required

Before writing a replication result summary, inspect:

- `00_README.md`
- `01_RUN_INDEX.md`
- `series-summary.csv`
- `series-diagnostics.json` if present;
- all per-run `input.json`
- all per-run `report.json`
- all per-run `report.md`
- all per-run `report.pdf`
- all per-run `workbook.xlsx`
- all per-run `summary.csv`
- all per-run `notes.md`
- SHA256

Do not write a replication result doc until the evidence pack is exported and inspected.

## 11. Outcome logic

### Outcome A — stabilization replicates

Pattern:

| Lane | Expected verdict |
|---|---|
| original main reference | `COLLAPSED_HIGH` or near-boundary high pressure |
| revised length-matched candidate | `INTERMEDIATE` |
| alternate reference | `INTERMEDIATE` |

Interpretation:

> Length matching is replicated as a major stabilizing mechanism for the Hindi `/i/` lane.

### Outcome B — replication candidate collapses

Pattern:

| Lane | Expected verdict |
|---|---|
| original main reference | `COLLAPSED_HIGH` |
| revised length-matched candidate | `COLLAPSED_HIGH` |
| alternate reference | `INTERMEDIATE` |

Interpretation:

> Length matching alone is insufficient as a stable explanation; additional lexical/shape variables remain active.

### Outcome C — unstable/boundary-heavy result

Pattern:

- repeated `BOUNDARY_UNCERTAIN_HIGH`;
- contradictory reference/candidate behavior;
- candidate lands near boundary despite geometry passing.

Interpretation:

> Hindi `/i/` remains a boundary-sensitive high-region lane requiring cautious synthesis.

## 12. Claim boundaries

Allowed:

- The revised replication bucket passed geometry.
- Replication candidate B failed because it reused `chinta`.
- The replication series has three runs.
- This package provides runnable payloads.

Blocked:

- Do not claim replication before `/evals` is run.
- Do not claim length matching solves Hindi `/i/`.
- Do not claim `V6-V7` supports Hindi `/i/`.
- Do not use rejected Candidate B.
- Do not claim model falsification or confirmation.
- Do not change scorer math.
- Do not change anchor doctrine.
- Do not update README.
- Do not publish this as final evidence.
