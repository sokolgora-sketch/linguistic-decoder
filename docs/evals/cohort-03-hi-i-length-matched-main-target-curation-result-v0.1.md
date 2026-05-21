# Cohort 03 Hindi `/i/` Length-Matched Main-Target Curation Result v0.1

Status: curation result + runnable payload package  
Scope: documentation only  
Date recorded: 2026-05-21

## 1. Purpose

This document records the curation result for the Hindi `/i/` length-matched main-target follow-up designed in:

- `docs/evals/cohort-03-hi-i-length-matched-main-target-run-design-v0.1.md`

It turns the accepted curation bucket into a runnable three-run `/evals` payload package.

This document does not record `/evals` results. No runs have been executed yet.

## 2. Prior design gate

The design required a future `length_matched_main_target` bucket to satisfy:

| Gate | Requirement |
|---|---|
| token count | exactly `10` |
| unique token count | exactly `10` |
| visible short `i` | every token |
| long-front markers | no `ee`, `ei`, `ea`, or `ii` |
| forbidden reuse | no original-main, alternate-target, or short-`i` high-anchor reuse |
| meanTokenLength | `5.2` to `5.6`, ideally near `5.4` |
| short-`i` high-anchor length delta | between `-0.3` and `+0.3` |
| `HIGH_ANCHOR_TOKENS_LONGER_THAN_TARGET` | absent |
| maxConsonantCluster | no higher than `3` |

## 3. Candidate buckets inspected

### 3.1 Candidate A — accepted

Bucket ID:

- `length_matched_main_target_a`

Tokens:

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

Geometry summary:

| Metric | Value |
|---|---:|
| tokenCount | `10` |
| uniqueTokenCount | `10` |
| meanTokenLength | `5.4` |
| minTokenLength | `5` |
| maxTokenLength | `6` |
| openFinalTokenCount | `7` |
| closedFinalTokenCount | `3` |
| maxConsonantCluster | `2` |
| shortIMarkerCount | `11` |
| markerTokenCounts.i | `10` |
| longHighFrontMarkerCount | `0` |

Short-`i` high-anchor comparison:

| Metric | Value |
|---|---:|
| highAnchorMeanTokenLengthMinusTarget | `0` |
| highAnchorLongHighFrontMarkersMinusTarget | `0` |
| highAnchorShortIMarkersMinusTarget | `2` |
| flags | `HIGH_ANCHOR_ALL_TOKENS_HAVE_SHORT_I_MARKER` |

Gate verdict:

- accepted

Reason:

> Candidate A removes the main target's high-anchor length pressure while preserving visible short-`i` coverage and avoiding long-front markers.

### 3.2 Candidate B — rejected

Bucket ID:

- `length_matched_main_target_b`

Tokens:

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

Geometry summary:

| Metric | Value |
|---|---:|
| tokenCount | `10` |
| uniqueTokenCount | `10` |
| meanTokenLength | `5.7` |
| minTokenLength | `5` |
| maxTokenLength | `7` |
| openFinalTokenCount | `9` |
| closedFinalTokenCount | `1` |
| maxConsonantCluster | `2` |
| shortIMarkerCount | `16` |
| markerTokenCounts.i | `10` |
| longHighFrontMarkerCount | `0` |

Gate verdict:

- rejected

Reason:

- `MEAN_TOKEN_LENGTH_OUTSIDE_5_2_TO_5_6`

Candidate B must not be used in the next `/evals` series.

## 4. Final run decision

Only one candidate bucket passed the geometry gate.

Therefore, use the design's three-run fallback:

1. original main target + short-`i` high anchor reference;
2. accepted length-matched main target A + short-`i` high anchor candidate;
3. alternate target + short-`i` high anchor reference.

Do not add a weak fourth run for symmetry.

## 5. Series metadata

Series label:

- `cohort03-hi-i-length-matched-main-target-v0.1`

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

## 6. Fixed buckets

### 6.1 Constant low anchor

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

### 6.2 Short-`i` high anchor

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

## 7. Runnable payloads

### Run 1 — original main target reference

Run ID:

- `cohort03-hi-i-original-main-short-i-anchor-reference-r01`

Label:

- `hi-i-original-main-short-i-anchor-reference-r01`

Purpose:

> Re-run the original main target against the same short-`i` high anchor inside the new length-matched series.

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

### Run 2 — accepted length-matched main target candidate

Run ID:

- `cohort03-hi-i-length-matched-main-short-i-anchor-candidate-r01`

Label:

- `hi-i-length-matched-main-short-i-anchor-candidate-r01`

Purpose:

> Test whether the accepted length-matched target removes the original main target's near-boundary high collapse.

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

- `cohort03-hi-i-alt-short-i-anchor-reference-r01`

Label:

- `hi-i-alt-short-i-anchor-reference-r01`

Purpose:

> Keep the known stabilizing alternate target in the same series as a reference lane.

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

## 8. How to run after merge

After this document is merged:

1. Open `/evals`.
2. Use series label:
   - `cohort03-hi-i-length-matched-main-target-v0.1`
3. Run the three payloads above.
4. Save each run.
5. Export one series evidence pack.

Expected ZIP name:

- `evals.series-evidence-pack.cohort03-hi-i-length-matched-main-target-v0.1.v0.1.zip`

## 9. Evidence-pack inspection required

Before any result summary is written, inspect:

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

Do not write a result doc until the evidence pack is exported and inspected.

## 10. Claim boundaries

Allowed:

- Candidate A passed the geometry gate.
- Candidate B failed the geometry gate.
- The next runnable series should use three runs.
- This package provides runnable payloads.

Blocked:

- Do not claim a scored result before `/evals` is run.
- Do not claim length matching solves Hindi `/i/`.
- Do not claim `V6-V7` supports Hindi `/i/`.
- Do not claim model falsification from this curation result.
- Do not use Candidate B.
- Do not change scorer math.
- Do not change anchor doctrine.
- Do not update README.
- Do not publish this as final evidence.
