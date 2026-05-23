# Cohort 04 Hindi `/i/` Open-Final Replication Curation Result v0.1

Status: curation result  
Scope: documentation only  
Date recorded: 2026-05-23

## 1. Purpose

This document records the curated token buckets and runnable payloads for the Cohort 04 Hindi `/i/` open-final replication test.

It follows:

- `docs/evals/cohort-04-hi-i-open-final-replication-design-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-replication-curation-instructions-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-result-v0.1.md`
- `docs/evals/cohort-04-hi-i-open-final-closed-final-curation-result-v0.1.md`

Replication question:

> Does the open-final effect replicate with independently curated open-final Hindi `/i/` targets?

This document provides 4 runnable payloads, but no `/evals` run has been performed yet.

Do not claim replication until the future `/evals` series is run, exported, inspected, and recorded in a result doc.

## 2. Series metadata

Series label:

- `cohort04-hi-i-open-final-replication-v0.1`

Fixed eval settings:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Provenance metadata for hand-pasted buckets:

- `provider`: `openai`
- `model`: `chatgpt-assisted-researcher-reviewed`
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

### 4.1 Lane A — prior open-final reference

Purpose:

> Repeat the prior clean open-final controlled target as an in-series reference.

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

### 4.2 Lane B — independent open-final replication A

Purpose:

> New independently curated open-final Hindi `/i/` replication target.

Accepted tokens:

~~~json
[
  "khila",
  "ghisa",
  "nigla",
  "zinda",
  "ghira",
  "kiraya",
  "dilasa",
  "girija",
  "chhipa",
  "chipka"
]
~~~

Curation notes:

- All tokens are broad-Latin Hindi / Hindi-Urdu register transliterations.
- Every token contains visible `i`.
- All 10 tokens are open-final under the broad final-shape rule.
- No token is reused from the source no-reuse lists.
- Broad transliteration caveat: `chhipa` may be rendered with different aspiration conventions; retained for ASCII broad-Latin consistency.

### 4.3 Lane C — independent open-final replication B

Purpose:

> Second independently curated open-final Hindi `/i/` replication target.

Accepted tokens:

~~~json
[
  "lipta",
  "chidha",
  "zimma",
  "talika",
  "silsila",
  "bimari",
  "khushi",
  "asli",
  "nirala",
  "gila"
]
~~~

Curation notes:

- All tokens are broad-Latin Hindi / Hindi-Urdu register transliterations.
- Every token contains visible `i`.
- All 10 tokens are open-final under the broad final-shape rule.
- No token is reused from the source no-reuse lists.
- Broad transliteration caveat: `bimari`, `khushi`, and `nirala` may carry length distinctions in stricter transliteration systems; retained here because this battery uses broad Latin token geometry.

### 4.4 Lane D — closed-final stress reference

Purpose:

> Repeat the known high-boundary stressed closed-final target as comparator.

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

## 5. Geometry table

Final-shape rule:

- open-final = token ends in `a`, `e`, `i`, `o`, or `u`;
- closed-final = token ends in any other ASCII letter.

| Lane | Target role | Tokens | Mean token length | Open-final | Closed-final | Visible `i` tokens | Long `ee` marker count | Reused-token count |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Lane A | prior open-final reference | 10 | 5.4 | 10 | 0 | 10 | 0 | 0 |
| Lane B | open-final replication A | 10 | 5.5 | 10 | 0 | 10 | 0 | 0 |
| Lane C | open-final replication B | 10 | 5.5 | 10 | 0 | 10 | 0 | 0 |
| Lane D | closed-final stress reference | 10 | 5.3 | 0 | 10 | 10 | 0 | 0 |

Interpretation boundary:

> The new open-final replication lanes intentionally keep mean token length close to the prior open-final lane while avoiding token reuse.

## 6. No-reuse proof

Accepted Lane B and Lane C tokens do not reuse tokens from:

- original Hindi `/i/` main target;
- original alternate target;
- short-`i` high anchor;
- accepted length-matched target;
- length-matched replication target;
- prior open-final reference target;
- prior closed-final stress target;
- prior mixed-final target.

## 7. Source no-reuse lists

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

## 8. Rejected tokens

| Token | Reason |
|---|---|
| `kitna` | Rejected for new replication lanes because it belongs to the prior open-final reference target. |
| `kiska` | Rejected for new replication lanes because it belongs to the prior open-final reference target. |
| `nikla` | Rejected for new replication lanes because it belongs to the prior open-final reference target. |
| `idhar` | Rejected because it belongs to the prior closed-final stress target. |
| `vichar` | Rejected because it belongs to the prior closed-final stress target. |
| `itna` | Rejected because it belongs to the prior mixed-final target. |
| `jitna` | Rejected because it belongs to the prior mixed-final target. |
| `bina` | Rejected because it belongs to the prior mixed-final target. |
| `chitra` | Rejected because it appears in the original alternate target. |
| `disha` | Rejected because it appears in the original alternate target. |
| `likhna` | Rejected because it appears in the short-`i` high anchor. |
| `milna` | Rejected because it appears in the short-`i` high anchor. |
| `hilna` | Rejected because it appears in the length-matched replication target. |
| `bijli` | Rejected because it appears in the length-matched replication target. |

## 9. Runnable payloads

### Run 1 — prior open-final reference

Run ID:

- `cohort04-hi-i-open-final-reference-r01`

Label:

- `hi-i-open-final-reference-r01`

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

### Run 2 — independent open-final replication A

Run ID:

- `cohort04-hi-i-open-final-replication-a-r01`

Label:

- `hi-i-open-final-replication-a-r01`

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
      "khila",
      "ghisa",
      "nigla",
      "zinda",
      "ghira",
      "kiraya",
      "dilasa",
      "girija",
      "chhipa",
      "chipka"
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

### Run 3 — independent open-final replication B

Run ID:

- `cohort04-hi-i-open-final-replication-b-r01`

Label:

- `hi-i-open-final-replication-b-r01`

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
      "lipta",
      "chidha",
      "zimma",
      "talika",
      "silsila",
      "bimari",
      "khushi",
      "asli",
      "nirala",
      "gila"
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

### Run 4 — closed-final stress reference

Run ID:

- `cohort04-hi-i-closed-final-reference-r01`

Label:

- `hi-i-closed-final-reference-r01`

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

## 10. Exact `/evals` UI fields

Common fields for all runs:

- Series label: `cohort04-hi-i-open-final-replication-v0.1`
- Task: `T5_INTERMEDIATE_V0_1`
- Input shape: `intermediate_triple`
- Language hint: `hi`
- Vowel under test: `i`
- Anchor low: `V6`
- Anchor high: `V7`
- Provider: `openai`
- Model: `chatgpt-assisted-researcher-reviewed`
- Source engine ID: blank
- Source engine version: blank
- Source engine build: blank

Run-specific fields:

| Run | Run ID | Label |
|---|---|---|
| 1 | `cohort04-hi-i-open-final-reference-r01` | `hi-i-open-final-reference-r01` |
| 2 | `cohort04-hi-i-open-final-replication-a-r01` | `hi-i-open-final-replication-a-r01` |
| 3 | `cohort04-hi-i-open-final-replication-b-r01` | `hi-i-open-final-replication-b-r01` |
| 4 | `cohort04-hi-i-closed-final-reference-r01` | `hi-i-closed-final-reference-r01` |

## 11. Evidence ZIP name

After scoring all four runs, export the series evidence pack as:

- `evals.series-evidence-pack.cohort04-hi-i-open-final-replication-v0.1.v0.1.zip`

Do not create the ZIP before all four runs are completed.

## 12. Blocked claims

Blocked claims:

- Do not claim the open-final effect is replicated before scoring.
- Do not claim open-final distribution solves Hindi `/i/`.
- Do not claim Hindi `/i/` supports `V6-V7`.
- Do not claim final-shape distribution is proven globally.
- Do not publish this as public evidence.
- Do not update README.

## 13. Next step

After this document is merged:

1. run the 4 payloads in `/evals`;
2. export the series evidence ZIP;
3. inspect the ZIP;
4. create a separate replication result doc.

No replication result claim is authorized until the evidence ZIP is inspected.
