# Cohort 03 High-Region Anchor Review v0.1

Status: REVIEW / DIAGNOSIS ONLY
Project: ZË-RO
Milestone: Cohort 03
Date recorded: 2026-05-19

This document records the current high-region pressure pattern and pauses further high-region support claims until the anchor model is reviewed.

It does not change scoring code.
It does not change bracket rules.
It does not update README.
It does not publish anything.
It does not claim the full ZË-RO framework is proven.

## 1. Reason for review

Cohort 03 now has repeated high-region collapse across more than one language family.

The pattern is no longer isolated to one language, one token pack, or one family.

Current pressure cases:

- Finnish `/y`
- Arabic `/i`
- Hebrew `/i`
- Hindi `/i`
- Persian `/i`

The repeated pattern suggests the current high-region anchor lens may be miscalibrated.

## 2. Evidence basis

### 2.1 Finnish `/y`

Recorded status:

- high-region pressure / anchor-instability
- not stable `V5-V7` support

Relevant docs:

- `docs/evals/cohort-03-finnish-y-bridge-result-v0.1.md`
- `docs/evals/cohort-03-finnish-y-audit-result-v0.1.md`
- `docs/evals/cohort-03-finnish-phase-a-summary-v0.1.md`

### 2.2 Semitic `/i`

Relevant docs:

- `docs/evals/cohort-03-arabic-i-semitic-result-v0.1.md`
- `docs/evals/cohort-03-hebrew-i-semitic-result-v0.1.md`
- `docs/evals/cohort-03-semitic-phase-b-i-summary-v0.1.md`

Recorded pattern:

- Arabic `/i`: `V5-V7` candidates collapsed high; `V4-V7` controls also collapsed high.
- Hebrew `/i`: `V5-V7` candidates collapsed high; `V4-V7` controls also collapsed high.
- Classification: high-region pressure / anchor-instability; not support.

### 2.3 Indo-Iranian `/i`

Relevant docs:

- `docs/evals/cohort-03-hindi-i-indo-iranian-result-v0.1.md`
- `docs/evals/cohort-03-persian-i-indo-iranian-result-v0.1.md`
- `docs/evals/cohort-03-indo-iranian-i-summary-v0.1.md`

Recorded pattern:

- Hindi `/i`: `V5-V7` candidates collapsed high; `V4-V7` controls also collapsed high.
- Persian `/i`: `V5-V7` candidates collapsed high; `V4-V7` controls also collapsed high.
- Classification: high-region pressure / anchor-instability; not support.

## 3. Diagnosis

The current evidence does not show ordinary random noise.

It shows a repeated structural failure mode:

1. `V5-V7` candidate brackets collapse high.
2. `V4-V7` control brackets also collapse high.
3. Widening the lower anchor from `V5` to `V4` does not stabilize the target vowel.
4. The same pattern appears across Uralic, Semitic, and Indo-Iranian domains.
5. No current high-region `/i`-type pack gives clean `V5-V7` support.

This means the high-region lens should be treated as under review.

## 4. Working hypotheses

### Hypothesis A — bracket geometry problem

The `V5-V7` bracket may be too narrow or wrongly placed for high/front vowels.

If true:

- the current `V5-V7` support claim should remain frozen;
- high/front cases may need a different candidate bracket;
- old high-region assumptions should not be reused without audit.

### Hypothesis B — semantic anchor mismatch

The current anchor contrast may not match high/front `/i` behavior.

Current anchor pattern often uses:

- `V5`: movement / flow / path
- `V7`: point / edge / target / line

This may not capture the semantic behavior of high/front `/i` tokens.

If true:

- the bracket may be numerically plausible but semantically mis-lensed;
- the engine may be seeing the target through the wrong semantic dimension.

### Hypothesis C — scorer sensitivity / collapse threshold problem

The scoring lens may over-collapse high-region targets when the high anchor is semantically strong.

If true:

- the diagnostic threshold may be too aggressive near the high boundary;
- `COLLAPSED_HIGH` may need a sub-diagnosis separating genuine high collapse from high-anchor suction.

### Hypothesis D — token curation is still too broad

Even after cleaning, high-region token packs may mix multiple semantic functions.

If true:

- a narrower high-region audit pack may be needed;
- token buckets should be curated by function class, not only vowel visibility.

## 5. What this does not mean

This does not mean:

- the broader ZË-RO model should be discarded;
- Cohort 03 failed as a research program;
- the evals instrument is useless;
- all Seven-Voices brackets are invalid.

It means:

- the high-region front-vowel lens is not clean enough yet;
- `V5-V7` should not be claimed as supported for `/i`-type cases;
- more blind high-region support tests are not useful until the lens is reviewed.

## 6. Research decision

Stop running more high-region `/i` support tests for now.

Next research step should be one of:

1. Design a high-region audit protocol with narrower semantic function buckets.
2. Review whether `V5-V7`, `V4-V7`, or another bracket model is appropriate.
3. Add a collapse sub-diagnosis to distinguish:
   - genuine high collapse;
   - high-anchor suction;
   - boundary overpressure;
   - token-function mismatch.

## 7. Claim boundaries

Allowed:

- High-region `/i`-type cases show repeated pressure across multiple family domains.
- Finnish `/y`, Arabic `/i`, Hebrew `/i`, Hindi `/i`, and Persian `/i` are current pressure cases.
- Current `V5-V7` support claims should be frozen for high/front `/i`-type cases.
- A high-region anchor review is required before more support claims.

Blocked:

- Do not claim the whole model is invalid.
- Do not claim the full framework is proven.
- Do not claim `V5-V7` supports high/front `/i`-type vowels.
- Do not publish this as a final result.
- Do not update README from this review alone.
- Do not change scoring code from this document alone.
