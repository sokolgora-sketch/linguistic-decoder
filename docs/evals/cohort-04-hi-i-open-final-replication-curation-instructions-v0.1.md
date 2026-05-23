# Cohort 04 Hindi `/i/` Open-Final Replication Curation Instructions v0.1

Status: curation instructions only  
Scope: documentation only  
Date recorded: 2026-05-23

## 1. Purpose

This document defines token-curation instructions for the Cohort 04 Hindi `/i/` open-final replication test.

It follows:

- `docs/evals/cohort-04-hi-i-open-final-replication-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-result-v0.1.md`

Replication question:

> Does the open-final effect replicate with independently curated open-final Hindi `/i/` targets?

This document does not provide final token buckets.  
This document does not authorize `/evals` runs by itself.  
This document does not create evidence packs.  
This document does not change README or publication claims.

## 2. Run-count decision

The first open-final replication pass should be:

> 4 scored runs

Run structure:

1. prior open-final reference;
2. independent open-final replication A;
3. independent open-final replication B;
4. closed-final stress reference.

Reason:

- the prior open-final lane supplies an in-series clean reference;
- two independent open-final lanes test whether the effect repeats;
- the closed-final lane supplies the known high-boundary stress comparator.

Do not run 1 run.  
Do not run 8 runs for this first replication pass.  
Do not add mixed-final lanes in this replication pass.

## 3. Fixed eval settings

Any future runnable payloads must use:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Provenance metadata for future hand-pasted buckets:

- `provider`: `openai`
- `model`: `chatgpt-assisted-researcher-reviewed`
- `sourceEngineId`: leave blank
- `sourceEngineVersion`: leave blank
- `sourceEngineBuild`: leave blank

## 4. Fixed anchors

Use the same anchors as the prior Cohort 04 Hindi `/i/` final-shape test.

### 4.1 Constant low anchor

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

The future curation result doc must produce exactly four target lanes.

### Lane A — prior open-final reference

Purpose:

> Repeat the prior clean open-final controlled target as a reference lane.

Use:

~~~json
[
  "kitna",
  "kiska",
  "bigda",
  "bikta",
  "pighla",
  "sikhna",
  "chilka",
  "tircha",
  "jiska",
  "nikla"
]
~~~

Role:

- reference lane only;
- not a new replication lane;
- used to confirm the prior clean open-final behavior in the same series.

### Lane B — independent open-final replication A

Purpose:

> Curate a new independently selected open-final Hindi `/i/` target.

Rules:

- 10 tokens.
- Broad-Latin Hindi / Hindi-Urdu register transliteration.
- Every token must contain visible short `i`.
- At least 8 of 10 tokens should be open-final.
- Mean token length should stay close to 5.4.
- No token reuse from prior no-reuse lists.
- No token reuse from Lane A.
- No obvious long-`ee` high-front markers.
- No spaces, punctuation, apostrophes, hyphens, digits, or diacritics.

### Lane C — independent open-final replication B

Purpose:

> Curate a second new independently selected open-final Hindi `/i/` target.

Rules:

- 10 tokens.
- Broad-Latin Hindi / Hindi-Urdu register transliteration.
- Every token must contain visible short `i`.
- At least 8 of 10 tokens should be open-final.
- Mean token length should stay close to 5.4.
- No token reuse from prior no-reuse lists.
- No token reuse from Lane A or Lane B.
- No obvious long-`ee` high-front markers.
- No spaces, punctuation, apostrophes, hyphens, digits, or diacritics.

### Lane D — closed-final stress reference

Purpose:

> Repeat the known high-boundary stressed closed-final target as the comparator.

Use:

~~~json
[
  "kichad",
  "idhar",
  "jidhar",
  "nigam",
  "vichar",
  "sifar",
  "fikar",
  "sabit",
  "kabil",
  "vidit"
]
~~~

Role:

- stress comparator;
- expected to remain high-boundary stressed unless the prior result was unstable.

## 6. Token-shape constraints

All new open-final replication targets must satisfy:

1. 10 tokens per lane.
2. Visible short `i` in every target token.
3. At least 8 open-final tokens per new replication lane.
4. Mean token length close to 5.4.
5. No token reuse across Lane B and Lane C.
6. No reuse from previous Hindi `/i/` target, anchor, or reference lists.
7. No obvious long-`ee` high-front transliteration.
8. No compounds with spaces.
9. No punctuation.
10. No diacritics.
11. No digits.

Final-shape rule:

- open-final = token ends in `a`, `e`, `i`, `o`, or `u`;
- closed-final = token ends in any other ASCII letter.

## 7. No-reuse source lists

The future curation result doc must check candidate tokens against all lists below.

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

### 7.6 Prior open-final reference target

~~~json
[
  "kitna",
  "kiska",
  "bigda",
  "bikta",
  "pighla",
  "sikhna",
  "chilka",
  "tircha",
  "jiska",
  "nikla"
]
~~~

### 7.7 Prior closed-final stress target

~~~json
[
  "kichad",
  "idhar",
  "jidhar",
  "nigam",
  "vichar",
  "sifar",
  "fikar",
  "sabit",
  "kabil",
  "vidit"
]
~~~

### 7.8 Prior mixed-final target

~~~json
[
  "itna",
  "jitna",
  "pichla",
  "dikha",
  "bina",
  "fitrat",
  "visham",
  "nirman",
  "shivir",
  "bichhad"
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

Future series label:

- `cohort04-hi-i-open-final-replication-v0.1`

Required run order:

### Run 1 — prior open-final reference

Run ID:

- `cohort04-hi-i-open-final-reference-r01`

Label:

- `hi-i-open-final-reference-r01`

### Run 2 — independent open-final replication A

Run ID:

- `cohort04-hi-i-open-final-replication-a-r01`

Label:

- `hi-i-open-final-replication-a-r01`

### Run 3 — independent open-final replication B

Run ID:

- `cohort04-hi-i-open-final-replication-b-r01`

Label:

- `hi-i-open-final-replication-b-r01`

### Run 4 — closed-final stress reference

Run ID:

- `cohort04-hi-i-closed-final-reference-r01`

Label:

- `hi-i-closed-final-reference-r01`

## 10. Required curation result output

The next curation result doc must include:

1. accepted Lane B tokens;
2. accepted Lane C tokens;
3. rejected-token list;
4. geometry table;
5. no-reuse proof;
6. final run count: 4;
7. exact `/evals` fields;
8. exact JSON payloads for all 4 runs;
9. evidence ZIP naming convention.

## 11. Evidence ZIP name

After future `/evals` scoring, the evidence ZIP should be named:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-replication-v0.1.v0.1.zip`

Do not create this ZIP until after the future curation result doc is merged and the 4 `/evals` runs are completed.

## 12. Expected interpretation boundaries

If both new independent open-final lanes remain clean:

> The open-final pressure-reduction effect replicated in this Hindi `/i/` setup.

If one new open-final lane is clean and the other is boundary-stressed:

> Open-final shape may help, but token selection remains active.

If both new open-final lanes are boundary-stressed:

> The prior clean open-final lane may have been token-specific rather than final-shape-specific.

## 13. Blocked claims

Blocked claims:

- Do not claim the open-final effect is replicated yet.
- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim final-shape distribution is proven globally.
- Do not publish this as public evidence.
- Do not update README.

## 14. Next step

Next required document:

> Cohort 04 Hindi `/i/` open-final replication curation result v0.1

That document must contain actual curated Lane B and Lane C tokens, rejected tokens, geometry summaries, no-reuse proof, and exact 4 runnable JSON payloads.

Until that curation result doc is merged, no `/evals` runs are authorized.
