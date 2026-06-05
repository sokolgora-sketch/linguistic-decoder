# Finnish /i/ Anchor-Family Arm A Review v0.1

Status: REVIEW / DECISION NOTE ONLY
Project: ZË-RO Evals
Lane: Finnish `/i` anchor-family audit
Arm reviewed: A — scratch reproduction token-geometry table
Date recorded: 2026-06-05

This document reviews Arm A of the Finnish `/i` anchor-family audit.

It does not run evaluations.
It does not create evidence packs.
It does not change scoring code.
It does not change bracket rules.
It does not update README.
It does not publish anything.
It does not claim Finnish `/i` supports any tested bracket.

Related documents:

- `docs/evals/c05-fi-i-anchor-geometry-scratch-notes-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-audit-design-v0.1.md`
- `docs/evals/c05-fi-i-anchor-family-arm-a-token-geometry-table-v0.1.md`

## 1. Purpose

Arm A converted the already-recorded Finnish `/i` scratch tokens into a reviewable token-geometry table.

This review turns those table observations into design decisions for the next audit arms.

The goal is not to score.

The goal is to decide what must be controlled before any future scoring.

## 2. Current state

The Finnish `/i` scratch lane already established:

1. Final-shape alone does not explain the pressure.
2. Bracket relabelling alone does not change scorer geometry.
3. Real U-heavy V5 anchoring changes the result but overcorrects low.
4. V4/O-mid anchoring returns high collapse.
5. Finnish `/i` is scratch falsification-pressure / bracket-instability evidence, not support.

Arm A then exposed several token-geometry confounds:

- original A/O-heavy low anchor is mostly open-final and mostly `i`-free;
- U-heavy V5 anchor is `i`-free but shorter and U-dense;
- V4-style anchor contains final-`i` tokens;
- shared high anchor is heavily `i`-contaminated;
- open-final target is all visible-`i`;
- closed-final target contains one no-visible-`i` exception;
- target buckets mix multiple function classes;
- Finnish front vowels `ä` and `ö` appear in anchor and target tokens.

## 3. Review decisions

### 3.1 Arm B should start with place/object

Decision:

- Arm B should use `place/object` as the first function-matched target class.

Reason:

- `place/object` appears across the existing scratch material.
- It is less semantically unstable than emotion/state or property.
- It avoids making living-object tokens dominate the target.
- It gives a cleaner bridge between anchor and target families.

Do not start Arm B with:

- emotion/state;
- property/adjective-heavy targets;
- mixed living-object/body/place/tool targets.

### 3.2 V4 final-i tokens must be isolated before scoring

Decision:

- V4-style final-`i` tokens must not be silently reused in a scoring arm.

Tokens:

- `koti`
- `ovi`
- `onni`

Reason:

- these are anchor_low tokens but contain visible target vowel `i`;
- they may pull the low anchor toward the target/high region;
- they could contaminate any interpretation of V4 behavior.

Allowed next choices:

1. create a V4-clean variant without final-`i` tokens;
2. create an explicit V4-contaminated variant and mark it as such;
3. keep both variants, but never mix them without labels.

### 3.3 Shared high anchor needs contamination split

Decision:

- the shared high anchor should be split in a later contamination-controlled arm.

Reason:

The high anchor is intentionally `i`-dense:

- `ilo`
- `ilma`
- `ilta`
- `isä`
- `itä`
- `kissa`
- `viima`
- `viileä`
- `viiva`
- `hiiva`

This is useful for one hypothesis, but it cannot answer whether high collapse comes from:

- correct high-anchor behavior;
- visible `i` contamination;
- long high-front marker density;
- semantic class mismatch.

Arm C should later compare:

- high-contamination high anchor;
- lower-contamination high anchor;
- matched function/length where possible.

### 3.4 U-heavy V5 requires length review

Decision:

- the U-heavy V5 family should not be scored again until length balance is reviewed.

Reason:

The U-heavy V5 family contains several very short long-vowel tokens:

- `puu`
- `kuu`
- `suu`
- `luu`

This may explain why real V5 flipped the result to `EXCEEDS_LOW`.

Before reuse, Arm B/C/D should decide whether to:

1. length-match V5 upward;
2. keep short V5 as a deliberate stress condition;
3. split V5 into short-U and mid-length-U variants.

### 3.5 `joutsen` must be treated as an explicit exception

Decision:

- `joutsen` should not be silently mixed into a target-`i` bucket.

Reason:

- it is in the closed-final target bucket;
- it has no visible `i`;
- it may be useful as a deliberate no-visible-`i` control;
- but it cannot be treated as ordinary target-vowel evidence.

Allowed next choices:

1. remove it from a strict visible-`i` target bucket;
2. keep it only in an explicit mixed-contamination condition;
3. use it as a no-visible-`i` negative-control token.

### 3.6 Finnish `ä` and `ö` must be labelled as front-vowel confounds

Decision:

- `ä` and `ö` should be explicitly labelled in future tables.

Reason:

Arm A includes tokens with `ä` and `ö`, including:

- `metsä`
- `pöytä`
- `isä`
- `itä`
- `viileä`
- `silmä`
- `leipä`

These may introduce front-vowel behavior that is not the same as visible `i`.

Future tables should include:

- contains_ae
- contains_oe
- frontVowelConfoundRisk

or an equivalent note column.

## 4. Arm B design recommendation

The next table should be:

- Arm B function-matched table;
- target function class: `place/object`;
- no scoring;
- no evidence pack.

Recommended Arm B purpose:

> Test whether Finnish `/i` pressure remains visible when the target bucket and anchors are restricted to one more coherent place/object function class.

Arm B should prepare candidate rows only.

It should not include runnable JSON until the table is reviewed.

## 5. Arm B draft constraints

Arm B should require:

- one dominant target function class;
- no silent final-`i` anchor contamination;
- explicit high-anchor contamination label;
- token length bands recorded;
- visible `i`, `ä`, and `ö` labelled;
- no `joutsen` unless it is marked as no-visible-`i` control;
- function class must be assigned before scoring.

## 6. Stop conditions

Do not proceed to scoring if:

- Arm B table does not exist;
- Arm B mixes function classes;
- V4 final-`i` anchor tokens are reused without label;
- high-anchor contamination is not labelled;
- U-heavy V5 length imbalance is not labelled;
- `joutsen` is mixed as if it were visible-`i`;
- `ä` and `ö` are not labelled;
- run purpose is phrased as support-seeking.

## 7. Decision

Arm A review is complete when this document is merged.

Next safe evals work:

1. Create Arm B function-matched place/object curation table.
2. Do not score Arm B.
3. Review Arm B table before any runnable payload or evidence pack.
