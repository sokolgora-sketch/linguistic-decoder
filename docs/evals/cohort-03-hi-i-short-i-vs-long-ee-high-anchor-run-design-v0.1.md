# Cohort 03 Hindi `/i/` Short-`i` vs Long-`ee` High-Anchor Run Design v0.1

Status: run design only
Scope: documentation only
Date recorded: 2026-05-21

## 1. Purpose

This document defines a narrow follow-up `/evals` run design after the Hindi/Arabic `/i/` token-geometry result.

Source result:

- `docs/evals/cohort-03-hi-ar-i-token-geometry-result-v0.1.md`

The source result found:

- Hindi `V6-V7` high anchor was long-`ee` dominated.
- Arabic `V6-V7` high anchor was short-`i` dominated.
- Hindi and Arabic were not tested against equivalent high-anchor geometry under `V6-V7`.

This run design tests one specific confound:

> Does Hindi `/i/` remain `COLLAPSED_HIGH` when the `V6-V7` high anchor uses short-`i` geometry instead of long-`ee` geometry?

This document does not execute the runs.

## 2. Series

Series label:

- `cohort03-hi-i-short-i-vs-long-ee-high-anchor-v0.1`

Task:

- `T5_INTERMEDIATE_V0_1`

Input shape:

- `intermediate_triple`

Language:

- Hindi

Target:

- `/i/`

## 3. Common UI metadata

Use these UI fields for every run in this design:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `provider`: `researcher`
- `model`: `researcher-curated`
- `sourceEngineId`: leave blank
- `sourceEngineVersion`: leave blank
- `sourceEngineBuild`: leave blank
- `series label`: `cohort03-hi-i-short-i-vs-long-ee-high-anchor-v0.1`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

## 4. Design logic

This is a four-run controlled probe.

It compares:

1. existing Hindi target bucket with long-`ee` high anchor;
2. existing Hindi target bucket with short-`i` high anchor;
3. alternate Hindi target bucket with long-`ee` high anchor;
4. alternate Hindi target bucket with short-`i` high anchor.

The low anchor is held constant across all four runs.

This separates:

- target-bucket sensitivity;
- high-anchor spelling geometry;
- long-`ee` high-anchor pressure;
- short-`i` high-anchor behavior.

## 5. Buckets

### 5.1 Constant low anchor

Use this `anchor_low` bucket for all four runs:

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

### 5.2 Main Hindi `/i/` target bucket

This is the previous target bucket from the high-front lane probe:

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

### 5.3 Alternate Hindi `/i/` target bucket

This alternate bucket keeps short-`i` transliteration pressure visible while avoiding direct reuse of the short-`i` high-anchor words:

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

### 5.4 Long-`ee` high anchor

This is the previous Hindi `V6-V7` high anchor:

~~~json
[
  "jeevan",
  "geet",
  "neend",
  "cheez",
  "teer",
  "jeet",
  "peepal",
  "keeda",
  "deewar",
  "meetha"
]
~~~

### 5.5 Short-`i` high anchor

This is the matched short-`i` high-anchor probe bucket:

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

## 6. Planned runs

### Run 1 — main target, long-`ee` high anchor control

Run ID:

- `cohort03-hi-i-main-long-ee-high-anchor-control-r01`

Label:

- `hi-i-main-long-ee-high-anchor-control-r01`

JSON:

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
      "jeevan",
      "geet",
      "neend",
      "cheez",
      "teer",
      "jeet",
      "peepal",
      "keeda",
      "deewar",
      "meetha"
    ]
  }
}
~~~

### Run 2 — main target, short-`i` high anchor candidate

Run ID:

- `cohort03-hi-i-main-short-i-high-anchor-candidate-r01`

Label:

- `hi-i-main-short-i-high-anchor-candidate-r01`

JSON:

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

### Run 3 — alternate target, long-`ee` high anchor control

Run ID:

- `cohort03-hi-i-alt-long-ee-high-anchor-control-r01`

Label:

- `hi-i-alt-long-ee-high-anchor-control-r01`

JSON:

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
      "jeevan",
      "geet",
      "neend",
      "cheez",
      "teer",
      "jeet",
      "peepal",
      "keeda",
      "deewar",
      "meetha"
    ]
  }
}
~~~

### Run 4 — alternate target, short-`i` high anchor candidate

Run ID:

- `cohort03-hi-i-alt-short-i-high-anchor-candidate-r01`

Label:

- `hi-i-alt-short-i-high-anchor-candidate-r01`

JSON:

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

## 7. Readout logic

### Outcome A — short-`i` high anchor stabilizes Hindi

Pattern:

- long-`ee` controls: `COLLAPSED_HIGH`
- short-`i` candidates: `INTERMEDIATE`

Interpretation:

> Hindi collapse is high-anchor-geometry sensitive. The long-`ee` high anchor is a likely confound.

### Outcome B — Hindi remains collapsed under both high anchors

Pattern:

- long-`ee` controls: `COLLAPSED_HIGH`
- short-`i` candidates: `COLLAPSED_HIGH`

Interpretation:

> Hindi `/i/` pressure persists even when the high anchor is changed to short-`i` geometry. The issue is not explained by long-`ee` anchor shape alone.

### Outcome C — both high-anchor types stabilize

Pattern:

- long-`ee` controls: `INTERMEDIATE`
- short-`i` candidates: `INTERMEDIATE`

Interpretation:

> The previous Hindi collapse may not be stable across reruns or target variants. Treat as replication pressure.

### Outcome D — short-`i` anchor worsens or creates boundary artifacts

Pattern:

- short-`i` candidates produce stronger collapse or new boundary flags.

Interpretation:

> The short-`i` high anchor may be too target-like or unsuitable as a boundary. Do not treat stabilization/failure as bracket support without further audit.

## 8. Export requirements

After running the four runs:

- save each run in `/evals`;
- export one series evidence pack;
- verify the ZIP includes `series-diagnostics.json`;
- inspect `series-summary.csv`;
- inspect all four `report.json` files;
- record SHA256;
- do not create a result PR until the whole series is inspected.

Expected exported series:

- `evals.series-evidence-pack.cohort03-hi-i-short-i-vs-long-ee-high-anchor-v0.1.v0.1.zip`

## 9. Claim boundaries

Allowed:

- This is a narrow confound test.
- The design tests whether Hindi `/i/` collapse is sensitive to long-`ee` high-anchor geometry.
- Short-`i` stabilization would justify replication, not support.
- Continued collapse would show the issue is deeper than the long-`ee` anchor alone.

Blocked:

- Do not claim `V6-V7` solves `/i/`.
- Do not claim Hindi `/i/` supports or falsifies the model.
- Do not claim the long-`ee` confound is proven before runs.
- Do not update README from this probe.
- Do not change scorer math from this probe alone.
- Do not change anchor doctrine from this probe alone.
- Do not publish this as final evidence.
