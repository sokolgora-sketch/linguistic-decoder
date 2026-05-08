# ZË-RO Cohort 02 Token-Curation Instructions v0.1

Status: CURATION INSTRUCTIONS ONLY
Created: 2026-05-08
Cohort: Cohort 02
Depends on:
- `docs/evals/cohort-02-design-v0.1.md`
- `docs/evals/cohort-battery-workflow-v0.1.md`

This document defines how to curate token buckets for the first Cohort 02 subset.

This document does not contain final token buckets.

Do not score anything from this document.

---

## 1. Purpose

Cohort 02 must not jump directly from design into scoring.

This instruction pack exists to control token generation and manual review before any `/evals` run is scored.

Goals:

1. Standardize assistant prompts for token generation.
2. Keep candidate/main, candidate/alt, control/main, and control/alt separated.
3. Force manual review before scoring.
4. Prevent duplicate-token contamination.
5. Preserve exact run IDs and labels from the Cohort 02 design plan.
6. Keep all provenance honest: manual/external curation is not `analyze-v1`.

---

## 2. First subset

The first Cohort 02 subset is:

| Case ID | Language | Vowel | Candidate bracket | Control bracket | Purpose |
|---|---|---|---|---|---|
| c02-no-oe-human | Norwegian | `/ø/` | V1-V3 | V2-V5 | low-edge front-rounded replication |
| c02-da-oe-human | Danish | `/ø/` | V1-V3 | V2-V5 | low-edge front-rounded replication |
| c02-tr-ii-redesign | Turkish | `/ı/` | V4-V7 | V5-V7 | high-region pressure redesign |
| c02-ro-a-breve-redesign | Romanian | `/ă/` | V3-V4 | V2-V4 | central-vowel pressure redesign |

Do not add the remaining Cohort 02 cases until this first subset has curated, validated task JSON.

---

## 3. Curation rule

Each case requires four token sets:

| Ordinal | Role | Bucket purpose |
|---:|---|---|
| r01 | candidate main | first token set for proposed bracket |
| r02 | candidate alt | alternate token set for proposed bracket |
| r03 | control main | first token set for comparison bracket |
| r04 | control alt | alternate token set for comparison bracket |

Rules:

- Candidate and control roles must never be mixed.
- Main and alt sets must be related but not identical.
- Do not silently replace tokens after scoring.
- If a duplicate or bad token is found before scoring, correct the task JSON first.
- If a scored run used bad tokens, mark that run invalid and rerun with a new run ID.

---

## 4. Required token bucket shape

Each generated token proposal must contain exactly these buckets:

- `anchor_low`
- `x_vowel`
- `anchor_high`

Each bucket should contain 30 tokens where possible.

Minimum requirements:

- each token is a single orthographic token;
- no spaces;
- no punctuation unless required by the language orthography;
- no duplicates inside one bucket;
- no duplicates across buckets;
- `x_vowel` contains clear examples of the vowel under test;
- anchor buckets are contrastive and clean;
- anchor buckets should not accidentally contain the target vowel unless the case design explicitly allows it;
- all words should be real words where possible;
- reject brand names, abbreviations, proper names, random stems, and malformed words unless the case explicitly requires them.

---

## 5. Assistant prompt template

Use this prompt for each run.

Replace the placeholders before sending to an assistant.

    Return STRICT JSON only. No prose. No markdown fence.

    Generate 30 single-token words for each bucket in a T5 intermediate-vowel bracket test.

    Language: <LANGUAGE>
    Vowel under test: <VOWEL>
    Candidate/control role: <ROLE>
    Bracket being tested: <BRACKET>
    Case ID: <CASE_ID>

    Buckets:
    - anchor_low: lower-side anchor words for this bracket
    - x_vowel: clear words containing the vowel under test
    - anchor_high: higher-side anchor words for this bracket

    Rules:
    - each entry must be a single orthographic token;
    - no spaces;
    - no punctuation unless required by the language orthography;
    - no duplicates inside a bucket;
    - no duplicates across buckets;
    - x_vowel must contain clear examples of the target vowel;
    - anchor_low and anchor_high must be clean contrast buckets;
    - avoid proper names, brand names, abbreviations, invented words, and malformed words;
    - return JSON only.

    Return exactly this object shape:

    {
      "anchor_low": [],
      "x_vowel": [],
      "anchor_high": []
    }

Important:

- The assistant returns only a bucket fragment.
- The operator must later wrap the reviewed buckets into the full T5 task JSON.
- Do not paste bucket fragments directly into `/evals`.

---

## 6. Case prompt pack

### 6.1 Norwegian `/ø/` — candidate main r01

Use:

- Case ID: `c02-no-oe-human`
- Language: Norwegian
- Vowel under test: `/ø/`
- Role: candidate main
- Bracket: V1-V3

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.no.oe.v1-v3.human.main.r01` |
| label | `no-oe-v1-v3-human-main-r01` |
| series | `t5-no-oe-v1-v3-human-v0.1` |

### 6.2 Norwegian `/ø/` — candidate alt r02

Use:

- Case ID: `c02-no-oe-human`
- Language: Norwegian
- Vowel under test: `/ø/`
- Role: candidate alt
- Bracket: V1-V3

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.no.oe.v1-v3.human.alt.r02` |
| label | `no-oe-v1-v3-human-alt-r02` |
| series | `t5-no-oe-v1-v3-human-v0.1` |

### 6.3 Norwegian `/ø/` — control main r03

Use:

- Case ID: `c02-no-oe-human`
- Language: Norwegian
- Vowel under test: `/ø/`
- Role: control main
- Bracket: V2-V5

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.no.oe.v2-v5.human.ctrl.r03` |
| label | `no-oe-v2-v5-human-ctrl-r03` |
| series | `t5-no-oe-v1-v3-human-v0.1` |

### 6.4 Norwegian `/ø/` — control alt r04

Use:

- Case ID: `c02-no-oe-human`
- Language: Norwegian
- Vowel under test: `/ø/`
- Role: control alt
- Bracket: V2-V5

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.no.oe.v2-v5.human.ctrl-alt.r04` |
| label | `no-oe-v2-v5-human-ctrl-alt-r04` |
| series | `t5-no-oe-v1-v3-human-v0.1` |

---

### 6.5 Danish `/ø/` — candidate main r01

Use:

- Case ID: `c02-da-oe-human`
- Language: Danish
- Vowel under test: `/ø/`
- Role: candidate main
- Bracket: V1-V3

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.da.oe.v1-v3.human.main.r01` |
| label | `da-oe-v1-v3-human-main-r01` |
| series | `t5-da-oe-v1-v3-human-v0.1` |

### 6.6 Danish `/ø/` — candidate alt r02

Use:

- Case ID: `c02-da-oe-human`
- Language: Danish
- Vowel under test: `/ø/`
- Role: candidate alt
- Bracket: V1-V3

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.da.oe.v1-v3.human.alt.r02` |
| label | `da-oe-v1-v3-human-alt-r02` |
| series | `t5-da-oe-v1-v3-human-v0.1` |

### 6.7 Danish `/ø/` — control main r03

Use:

- Case ID: `c02-da-oe-human`
- Language: Danish
- Vowel under test: `/ø/`
- Role: control main
- Bracket: V2-V5

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.da.oe.v2-v5.human.ctrl.r03` |
| label | `da-oe-v2-v5-human-ctrl-r03` |
| series | `t5-da-oe-v1-v3-human-v0.1` |

### 6.8 Danish `/ø/` — control alt r04

Use:

- Case ID: `c02-da-oe-human`
- Language: Danish
- Vowel under test: `/ø/`
- Role: control alt
- Bracket: V2-V5

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.da.oe.v2-v5.human.ctrl-alt.r04` |
| label | `da-oe-v2-v5-human-ctrl-alt-r04` |
| series | `t5-da-oe-v1-v3-human-v0.1` |

---

### 6.9 Turkish `/ı/` — candidate main r01

Use:

- Case ID: `c02-tr-ii-redesign`
- Language: Turkish
- Vowel under test: `/ı/`
- Role: candidate main
- Bracket: V4-V7

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.tr.ii.v4-v7.redesign.main.r01` |
| label | `tr-ii-v4-v7-redesign-main-r01` |
| series | `t5-tr-ii-v4-v7-redesign-v0.1` |

### 6.10 Turkish `/ı/` — candidate alt r02

Use:

- Case ID: `c02-tr-ii-redesign`
- Language: Turkish
- Vowel under test: `/ı/`
- Role: candidate alt
- Bracket: V4-V7

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.tr.ii.v4-v7.redesign.alt.r02` |
| label | `tr-ii-v4-v7-redesign-alt-r02` |
| series | `t5-tr-ii-v4-v7-redesign-v0.1` |

### 6.11 Turkish `/ı/` — control main r03

Use:

- Case ID: `c02-tr-ii-redesign`
- Language: Turkish
- Vowel under test: `/ı/`
- Role: control main
- Bracket: V5-V7

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.tr.ii.v5-v7.redesign.ctrl.r03` |
| label | `tr-ii-v5-v7-redesign-ctrl-r03` |
| series | `t5-tr-ii-v4-v7-redesign-v0.1` |

### 6.12 Turkish `/ı/` — control alt r04

Use:

- Case ID: `c02-tr-ii-redesign`
- Language: Turkish
- Vowel under test: `/ı/`
- Role: control alt
- Bracket: V5-V7

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.tr.ii.v5-v7.redesign.ctrl-alt.r04` |
| label | `tr-ii-v5-v7-redesign-ctrl-alt-r04` |
| series | `t5-tr-ii-v4-v7-redesign-v0.1` |

---

### 6.13 Romanian `/ă/` — candidate main r01

Use:

- Case ID: `c02-ro-a-breve-redesign`
- Language: Romanian
- Vowel under test: `/ă/`
- Role: candidate main
- Bracket: V3-V4

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.ro.a-breve.v3-v4.redesign.main.r01` |
| label | `ro-a-breve-v3-v4-redesign-main-r01` |
| series | `t5-ro-a-breve-v3-v4-redesign-v0.1` |

### 6.14 Romanian `/ă/` — candidate alt r02

Use:

- Case ID: `c02-ro-a-breve-redesign`
- Language: Romanian
- Vowel under test: `/ă/`
- Role: candidate alt
- Bracket: V3-V4

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.ro.a-breve.v3-v4.redesign.alt.r02` |
| label | `ro-a-breve-v3-v4-redesign-alt-r02` |
| series | `t5-ro-a-breve-v3-v4-redesign-v0.1` |

### 6.15 Romanian `/ă/` — control main r03

Use:

- Case ID: `c02-ro-a-breve-redesign`
- Language: Romanian
- Vowel under test: `/ă/`
- Role: control main
- Bracket: V2-V4

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.ro.a-breve.v2-v4.redesign.ctrl.r03` |
| label | `ro-a-breve-v2-v4-redesign-ctrl-r03` |
| series | `t5-ro-a-breve-v3-v4-redesign-v0.1` |

### 6.16 Romanian `/ă/` — control alt r04

Use:

- Case ID: `c02-ro-a-breve-redesign`
- Language: Romanian
- Vowel under test: `/ă/`
- Role: control alt
- Bracket: V2-V4

Run identity later:

| Field | Value |
|---|---|
| runId | `t5.ro.a-breve.v2-v4.redesign.ctrl-alt.r04` |
| label | `ro-a-breve-v2-v4-redesign-ctrl-alt-r04` |
| series | `t5-ro-a-breve-v3-v4-redesign-v0.1` |

---

## 7. Manual review checklist

Before wrapping any token buckets into T5 task JSON:

1. Count bucket lengths.
2. Confirm all values are strings.
3. Confirm every token is a single orthographic token.
4. Confirm no spaces.
5. Confirm no punctuation unless required by orthography.
6. Confirm no duplicates inside a bucket.
7. Confirm no duplicates across buckets.
8. Confirm `x_vowel` contains the target vowel.
9. Confirm anchor buckets are clean and contrastive.
10. Confirm language correctness.
11. Remove obvious malformed words.
12. Save the corrected bucket fragment before wrapping.
13. Save the wrapped task JSON before scoring.

Never fix tokens mentally after scoring.

---

## 8. Duplicate-check helper

After a bucket fragment is saved to a temporary JSON file, run a validator before scoring.

Example path:

- `/tmp/c02-token-fragment.json`

Validator command:

    node - <<'NODE'
    const fs = require("fs");
    const path = process.argv[2] || "/tmp/c02-token-fragment.json";
    const data = JSON.parse(fs.readFileSync(path, "utf8"));
    const bucketNames = ["anchor_low", "x_vowel", "anchor_high"];
    const seen = new Map();
    let failed = false;

    for (const bucket of bucketNames) {
      const values = data[bucket];
      if (!Array.isArray(values)) {
        console.error(`Missing or non-array bucket: ${bucket}`);
        failed = true;
        continue;
      }

      values.forEach((token, index) => {
        if (typeof token !== "string") {
          console.error(`${bucket}[${index}] is not a string`);
          failed = true;
          return;
        }

        if (token.trim() !== token || token.length === 0) {
          console.error(`${bucket}[${index}] has leading/trailing whitespace or is empty: ${JSON.stringify(token)}`);
          failed = true;
        }

        if (/\s/.test(token)) {
          console.error(`${bucket}[${index}] contains whitespace: ${JSON.stringify(token)}`);
          failed = true;
        }

        if (/[.,;:!?()[\]{}"'`]/.test(token)) {
          console.error(`${bucket}[${index}] contains punctuation: ${JSON.stringify(token)}`);
          failed = true;
        }

        const key = token.toLocaleLowerCase();
        if (seen.has(key)) {
          console.error(`Duplicate token ${JSON.stringify(token)} in ${bucket}; first seen in ${seen.get(key)}`);
          failed = true;
        } else {
          seen.set(key, `${bucket}[${index}]`);
        }
      });
    }

    if (failed) {
      process.exitCode = 1;
    } else {
      console.log(`OK: ${seen.size} unique tokens across ${bucketNames.join(", ")}`);
    }
    NODE /tmp/c02-token-fragment.json

If this validator fails, fix the bucket fragment before wrapping and before scoring.

---

## 9. T5 wrapping rule

Only after manual review and duplicate-checking, wrap the bucket fragment into the full T5 task JSON.

Required fields:

| Field | Value |
|---|---|
| taskId | `T5_INTERMEDIATE_V0_1` |
| inputShape | `intermediate_triple` |
| languageHint | language code |
| vowelUnderTest | target vowel |
| anchorLow | lower anchor bracket |
| anchorHigh | higher anchor bracket |
| buckets | reviewed bucket fragment |

Do not paste a bucket fragment directly into `/evals`.

Use `/evals` input mode:

- `Raw task JSON / wrap into run`

---

## 10. Provenance metadata

For this first Cohort 02 token-curation subset, use:

| Field | Value |
|---|---|
| provider | `manual` |
| model | `hand-curated` |
| sourceEngineId | `external-llm-curation` |
| sourceEngineVersion | `t5-battery-2026-05-cohort-02-token-curation-v0.1` |
| sourceEngineBuild | `<repo commit used when scoring/exporting>` |

Rules:

- `sourceEngineBuild` is the repo commit used during scoring/exporting.
- Do not rewrite `sourceEngineBuild` later to a publication commit.
- Do not claim manual/external token curation came from `analyze-v1`.

---

## 11. Not allowed in this milestone

This milestone does not allow:

- final token buckets committed to this doc;
- scored runs;
- evidence-pack export;
- interpretation of results;
- publication claims;
- Zenodo update;
- LingBuzz update;
- README public-chain update.

This milestone only locks how token curation must be done.

---

## 12. Completion criteria

This token-curation instruction pack is complete when:

1. first subset is listed;
2. all 16 run identities are listed;
3. prompt template is present;
4. manual review checklist is present;
5. duplicate-check helper is present;
6. T5 wrapping rule is present;
7. provenance convention is present;
8. no final token buckets are included;
9. repo gates pass;
10. PR is merged.

After merge, the next milestone is token curation itself.
