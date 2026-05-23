# Cohort 04 Hindi `/i/` Open-Final / Closed-Final Curation Instructions v0.1

Status: curation instructions only  
Scope: documentation only  
Date recorded: 2026-05-23

## 1. Purpose

This document defines token-curation instructions for the first Cohort 04 Hindi `/i/` final-shape test.

It follows:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-design-v0.1.md`

The design question is:

> Does open-final versus closed-final distribution explain high-edge pressure in Hindi `/i/` length-matched buckets?

This document does not provide final token buckets.  
This document does not authorize `/evals` runs by itself.  
This document does not create evidence packs.  
This document does not change README or publication claims.

## 2. Run-count decision

The first runnable Cohort 04 Hindi `/i/` final-shape series should be:

> 4 scored runs

Reason:

- one baseline reference lane;
- one open-final controlled lane;
- one closed-final controlled lane;
- one mixed-final balanced lane.

Do not run 1 run.  
Do not run 8 runs for the first pass.  
Do not add extra alternates until the first 4-run mechanism test is scored and inspected.

## 3. Fixed eval settings

Any future runnable payloads must use:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Provider/model metadata for researcher-curated buckets:

- `provider`: `researcher`
- `model`: `researcher`
- `sourceEngineId`: leave blank
- `sourceEngineVersion`: leave blank
- `sourceEngineBuild`: leave blank

## 4. Fixed anchors

The future curation result doc must use constant anchors across all four runs.

### 4.1 Constant low anchor

Use the prior Hindi `/i/` low anchor unless the future curation result doc explicitly justifies a change:

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

### 4.2 Constant short-`i` high anchor

Use the prior short-`i` high anchor unless the future curation result doc explicitly justifies a change:

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

## 5. Four required lanes

The curation result doc must produce exactly four target lanes.

### Lane A — baseline reference

Purpose:

> Keep one prior accepted length-matched Hindi `/i/` target as the reference lane.

Use the accepted length-matched target from the prior Hindi `/i/` lane:

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

Role:

- reference lane;
- not a new claim by itself;
- used to compare against open-final, closed-final, and mixed-final lanes.

### Lane B — open-final controlled target

Purpose:

> Curate a new length-matched Hindi `/i/` target with high open-final count.

Rules:

- 10 tokens.
- Broad-Latin Hindi transliteration.
- Every token must contain visible short `i`.
- Mostly open-final tokens.
- Target mean token length should stay close to Lane A.
- Avoid long-`ee` high-front markers.
- Avoid prior target and anchor reuse.
- Avoid spaces, punctuation, apostrophes, hyphens, digits, and diacritics.

Target final-shape goal:

- at least 7 of 10 tokens should be open-final.

### Lane C — closed-final controlled target

Purpose:

> Curate a new length-matched Hindi `/i/` target with high closed-final count.

Rules:

- 10 tokens.
- Broad-Latin Hindi transliteration.
- Every token must contain visible short `i`.
- Mostly closed-final tokens.
- Target mean token length should stay close to Lane B.
- Avoid long-`ee` high-front markers.
- Avoid prior target and anchor reuse.
- Avoid spaces, punctuation, apostrophes, hyphens, digits, and diacritics.

Target final-shape goal:

- at least 7 of 10 tokens should be closed-final.

### Lane D — mixed-final balanced target

Purpose:

> Curate a new length-matched Hindi `/i/` target with balanced open-final and closed-final tokens.

Rules:

- 10 tokens.
- Broad-Latin Hindi transliteration.
- Every token must contain visible short `i`.
- Balanced final shape.
- Target mean token length should stay close to Lane B and Lane C.
- Avoid long-`ee` high-front markers.
- Avoid prior target and anchor reuse.
- Avoid spaces, punctuation, apostrophes, hyphens, digits, and diacritics.

Target final-shape goal:

- 5 open-final tokens;
- 5 closed-final tokens.

## 6. Token-shape constraints

All new target lanes must satisfy:

1. 10 tokens per lane.
2. Visible short `i` in every target token.
3. Mean token length close to the accepted length-matched prior target.
4. No token reuse across Lane B, Lane C, and Lane D.
5. No reuse from:
   - original Hindi `/i/` main target;
   - original alternate target;
   - short-`i` high anchor;
   - accepted length-matched target;
   - length-matched replication target;
   - rejected prior curation tokens if avoidable.
6. No obvious long-`ee` high-front transliteration.
7. No compounds with spaces.
8. No punctuation.
9. No diacritics.
10. No digits.

## 7. No-reuse source lists

The curation result doc must check against these prior lists.

### 7.1 Original main target

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

### 7.2 Original alternate target

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

### 7.3 Short-`i` high anchor

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

### 7.4 Accepted length-matched target

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

### 7.5 Length-matched replication target

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
  "nimak"
]
~~~

## 8. Geometry summary required per lane

The curation result doc must report for each lane:

- token count;
- mean token length;
- open-final count;
- closed-final count;
- visible short-`i` count;
- long high-front marker count;
- reused-token count;
- notes on questionable transliteration;
- rejected tokens and reasons.

## 9. Required run IDs and labels

The future curation result doc should use this 4-run series label:

- `cohort04-hi-i-open-final-closed-final-v0.1`

Required run order:

### Run 1 — baseline reference

Run ID:

- `cohort04-hi-i-baseline-reference-r01`

Label:

- `hi-i-baseline-reference-r01`

### Run 2 — open-final controlled target

Run ID:

- `cohort04-hi-i-open-final-target-r01`

Label:

- `hi-i-open-final-target-r01`

### Run 3 — closed-final controlled target

Run ID:

- `cohort04-hi-i-closed-final-target-r01`

Label:

- `hi-i-closed-final-target-r01`

### Run 4 — mixed-final balanced target

Run ID:

- `cohort04-hi-i-mixed-final-target-r01`

Label:

- `hi-i-mixed-final-target-r01`

## 10. Required curation result output

The next document must include:

1. accepted Lane B tokens;
2. accepted Lane C tokens;
3. accepted Lane D tokens;
4. rejected-token list;
5. geometry table;
6. no-reuse proof;
7. final run count: 4;
8. exact `/evals` fields;
9. exact JSON payloads for all 4 runs;
10. evidence ZIP naming convention.

## 11. Evidence ZIP name

After future `/evals` scoring, the evidence ZIP should be named:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-closed-final-v0.1.v0.1.zip`

Do not create this ZIP until after the future curation result doc is merged and the 4 `/evals` runs are completed.

## 12. Blocked claims

Blocked claims:

- Do not claim Cohort 04 has evidence yet.
- Do not claim Cohort 04 has started scoring.
- Do not run `/evals` from this instructions doc alone.
- Do not create evidence packs from this instructions doc alone.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim closed-final distribution solves Hindi `/i/`.
- Do not claim mixed-final distribution solves Hindi `/i/`.
- Do not claim length matching solves Hindi `/i/`.
- Do not publish this as public evidence.
- Do not update README.

## 13. Next step

Next required document:

> Cohort 04 Hindi `/i/` open-final / closed-final curation result v0.1

That document must contain the actual curated tokens and exact 4 runnable JSON payloads.

Until that curation result doc is merged, no `/evals` runs are authorized.
