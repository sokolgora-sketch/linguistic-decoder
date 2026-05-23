# Cohort 04 Hindi `/i/` Open-Final / Closed-Final Curation Result v0.1

Status: curation result  
Scope: documentation only  
Date recorded: 2026-05-23

## 1. Purpose

This document records the curated token buckets and runnable payloads for the first Cohort 04 Hindi `/i/` final-shape test.

It follows:

- `docs/evals/cohort-04-hi-i-open-final-closed-final-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-instructions-v0.1.md`

Research question:

> Does open-final versus closed-final distribution explain high-edge pressure in Hindi `/i/` length-matched buckets?

This document provides 4 runnable payloads, but no `/evals` run has been performed yet.

Do not claim evidence until the future `/evals` series is run, exported, inspected, and recorded in a result doc.

## 2. Series metadata

Series label:

- `cohort04-hi-i-open-final-closed-final-v0.1`

Fixed eval settings:

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

Run count:

> 4 scored runs

## 3. Fixed anchors

### 3.1 Constant low anchor

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

### 3.2 Constant short-`i` high anchor

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

## 4. Accepted target lanes

### 4.1 Lane A — baseline reference target

Purpose:

> Prior accepted length-matched Hindi `/i/` target retained as baseline reference.

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

### 4.2 Lane B — open-final controlled target

Purpose:

> New length-matched Hindi `/i/` target with high open-final count.

Accepted tokens:

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

Curation notes:

- All tokens are broad-Latin Hindi transliterations.
- Every token contains visible `i`.
- All 10 tokens are open-final under the broad final-shape rule.
- No token is reused from the source no-reuse lists.
- Broad transliteration caveat: `chilka` may also appear as `chhilka`; the simpler broad-Latin form is retained for ASCII consistency.

### 4.3 Lane C — closed-final controlled target

Purpose:

> New length-matched Hindi `/i/` target with high closed-final count.

Accepted tokens:

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

Curation notes:

- All tokens are broad-Latin Hindi / Hindi-Urdu register transliterations.
- Every token contains visible `i`.
- All 10 tokens are closed-final under the broad final-shape rule.
- No token is reused from the source no-reuse lists.
- Broad transliteration caveat: `sifar`, `fikar`, `sabit`, and `kabil` are common Hindi-Urdu register forms; retained because the test targets broad-Latin token geometry rather than Sanskrit-only vocabulary.

### 4.4 Lane D — mixed-final balanced target

Purpose:

> New length-matched Hindi `/i/` target with balanced open-final and closed-final distribution.

Accepted tokens:

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

Curation notes:

- All tokens are broad-Latin Hindi / Hindi-Urdu register transliterations.
- Every token contains visible `i`.
- The lane has 5 open-final and 5 closed-final tokens.
- No token is reused from the source no-reuse lists.
- Broad transliteration caveat: `bina`, `nirman`, and `shivir` may carry vowel-length ambiguity in stricter transliteration systems; retained here because this battery uses broad Latin only.

## 5. Geometry table

Final-shape rule:

- open-final = token ends in `a`, `e`, `i`, `o`, or `u`;
- closed-final = token ends in any other ASCII letter.

| Lane | Target role | Tokens | Mean token length | Open-final | Closed-final | Visible `i` tokens | Long `ee` marker count | Reused-token count |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Lane A | baseline reference | 10 | 5.4 | 7 | 3 | 10 | 0 | 0 |
| Lane B | open-final controlled | 10 | 5.4 | 10 | 0 | 10 | 0 | 0 |
| Lane C | closed-final controlled | 10 | 5.3 | 0 | 10 | 10 | 0 | 0 |
| Lane D | mixed-final balanced | 10 | 5.5 | 5 | 5 | 10 | 0 | 0 |

Interpretation boundary:

> The lanes intentionally keep mean length close while varying final-shape distribution.

## 6. No-reuse proof

The accepted new targets in Lane B, Lane C, and Lane D do not reuse tokens from:

- original Hindi `/i/` main target;
- original alternate target;
- short-`i` high anchor;
- accepted length-matched target;
- length-matched replication target.

### 6.1 Source no-reuse lists

Original main target:

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

Original alternate target:

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

Short-`i` high anchor:

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

Accepted length-matched target:

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

Length-matched replication target:

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

## 7. Rejected tokens

Rejected tokens:

| Token | Reason |
|---|---|
| `kitab` | Rejected because it appears in the original main target. |
| `chitra` | Rejected because it appears in the original alternate target. |
| `kismat` | Rejected because it appears in the original alternate target. |
| `shikar` | Rejected because it appears in the original alternate target. |
| `likhna` | Rejected because it appears in the short-`i` high anchor. |
| `milna` | Rejected because it appears in the short-`i` high anchor. |
| `girna` | Rejected because it appears in the short-`i` high anchor. |
| `chinta` | Rejected because it appears in the accepted length-matched target. |
| `bijli` | Rejected because it appears in the length-matched replication target. |
| `nimak` | Rejected because it appears in the length-matched replication target. |
| `chikna` | Rejected because it appears in prior rejected curation material and is avoidable. |
| `bilkul` | Rejected because it appears in prior rejected curation material and is avoidable. |
| `pichak` | Rejected because it appears in prior rejected curation material and is avoidable. |

## 8. Runnable payloads

### Run 1 — baseline reference

Run ID:

- `cohort04-hi-i-baseline-reference-r01`

Label:

- `hi-i-baseline-reference-r01`

Purpose:

> Re-run the prior accepted length-matched target as a reference lane.

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

### Run 2 — open-final controlled target

Run ID:

- `cohort04-hi-i-open-final-target-r01`

Label:

- `hi-i-open-final-target-r01`

Purpose:

> Test the new open-final controlled Hindi `/i/` target.

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

### Run 3 — closed-final controlled target

Run ID:

- `cohort04-hi-i-closed-final-target-r01`

Label:

- `hi-i-closed-final-target-r01`

Purpose:

> Test the new closed-final controlled Hindi `/i/` target.

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

### Run 4 — mixed-final balanced target

Run ID:

- `cohort04-hi-i-mixed-final-target-r01`

Label:

- `hi-i-mixed-final-target-r01`

Purpose:

> Test the new balanced open/closed-final Hindi `/i/` target.

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

## 9. Exact `/evals` UI fields

For each run:

- Task: `T5_INTERMEDIATE_V0_1`
- Input shape: `intermediate_triple`
- Language hint: `hi`
- Vowel under test: `i`
- Anchor low: `V6`
- Anchor high: `V7`
- Provider: `researcher`
- Model: `researcher`
- Source engine ID: leave blank
- Source engine version: leave blank
- Source engine build: leave blank

Run-specific fields:

| Run | Run ID | Label |
|---|---|---|
| 1 | `cohort04-hi-i-baseline-reference-r01` | `hi-i-baseline-reference-r01` |
| 2 | `cohort04-hi-i-open-final-target-r01` | `hi-i-open-final-target-r01` |
| 3 | `cohort04-hi-i-closed-final-target-r01` | `hi-i-closed-final-target-r01` |
| 4 | `cohort04-hi-i-mixed-final-target-r01` | `hi-i-mixed-final-target-r01` |

## 10. Evidence ZIP name

After scoring all four runs, export the series evidence pack as:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-closed-final-v0.1.v0.1.zip`

Do not create the ZIP before all four runs are completed.

## 11. Blocked claims

Blocked claims:

- Do not claim Cohort 04 has evidence before scoring.
- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim closed-final distribution solves Hindi `/i/`.
- Do not claim mixed-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim length matching solves Hindi `/i/`.
- Do not publish this as public evidence.
- Do not update README.

## 12. Next step

After this document is merged:

1. run the 4 payloads in `/evals`;
2. export the series evidence ZIP;
3. inspect the ZIP;
4. create a separate Cohort 04 result doc.

No result claim is authorized until the evidence ZIP is inspected.
