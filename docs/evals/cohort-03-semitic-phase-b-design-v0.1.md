# Cohort 03 Semitic Phase B Design v0.1

Status: DESIGN ONLY
Project: ZË-RO
Milestone: Cohort 03
Phase: Semitic Phase B
Date recorded: 2026-05-19

This document locks the first Semitic Phase B design before any Arabic or Hebrew `/evals` runs.

It does not run evaluations.
It does not create evidence packs.
It does not record results.
It does not update README.
It does not publish anything.
It does not claim Cohort 03 support.

## 1. Context

Cohort 03 Phase A tested Finnish front-vowel bridge behavior.

Recorded Finnish Phase A pattern:

- Finnish `/ä/`: clean lower/open-front `V1-V3` bridge support.
- Finnish `/ö/`: weaker lower front-rounded `V1-V3` bridge support with boundary-stressed controls.
- Finnish `/y/`: high-region pressure / anchor-instability, repeated in audit.

The next planned family domain is Semitic.

Semitic Phase B starts with Arabic and Hebrew because they test a different structural environment:

- consonantal root-and-pattern morphology;
- visible vowel patterning in transliteration;
- non-Indo-European and non-Uralic language structure.

## 2. Design status

This is a design-only document.

Locked for first Semitic execution:

1. Arabic `/a/`
2. Hebrew `/a/`

Deferred until after first results:

1. Arabic `/i/`
2. Hebrew `/i/`

Reason:

- `/a/` gives a lower/open baseline comparable to Finnish `/ä/`, but in a Semitic root-and-pattern environment.
- `/i/` is high-region sensitive and should not be run until the `/a/` baseline is recorded.
- Finnish `/y/` already showed high-region pressure, so high-region Semitic tests must be handled cautiously.

## 3. Token convention

Use broad Latin transliteration for the first Semitic Phase B pass.

Reason:

- Arabic and Hebrew scripts often omit short vowels in ordinary writing.
- The evaluator needs visible target-vowel tokens.
- Transliteration keeps the vowel under test explicit.

Rules for Semitic token curation:

- Use real Arabic or Hebrew words only.
- Use simple Latin transliteration.
- No Arabic or Hebrew script in the first pass.
- No diacritics.
- No apostrophes.
- No hyphens.
- No spaces.
- No proper names.
- No root labels alone.
- Use lexical words, not abstract consonantal roots.
- The `x_vowel` bucket must contain clear visible target vowel tokens.
- Anchor buckets should avoid the target vowel where possible.
- Do not over-select words from one consonantal root family.
- Candidate main and alt must not be identical.
- Control main and alt must not be identical.

## 4. Locked first execution cases

### 4.1 Arabic `/a/`

Purpose:

- Test whether Arabic `/a/` behaves as a lower/open Semitic `V1-V3` bridge case.

Candidate bracket:

- `V1-V3`

Control bracket:

- `V2-V3`

Series label:

- `cohort03-ar-a-v1-v3-semitic-v0.1`

Planned run IDs:

- `cohort03-ar-a-v1-v3-semitic-main-r01`
- `cohort03-ar-a-v1-v3-semitic-alt-r01`
- `cohort03-ar-a-v2-v3-control-main-r01`
- `cohort03-ar-a-v2-v3-control-alt-r01`

Expected task metadata:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `ar`
- `vowelUnderTest`: `a`

Interpretation rule:

- If `V1-V3` is cleaner than `V2-V3`, classify as Arabic lower/open Semitic bridge support.
- If both brackets fail or collapse, classify as Semitic `/a/` instability.
- If controls are equally clean, classify as weak / non-separating.

### 4.2 Hebrew `/a/`

Purpose:

- Test whether Hebrew `/a/` behaves as a lower/open Semitic `V1-V3` bridge case.

Candidate bracket:

- `V1-V3`

Control bracket:

- `V2-V3`

Series label:

- `cohort03-he-a-v1-v3-semitic-v0.1`

Planned run IDs:

- `cohort03-he-a-v1-v3-semitic-main-r01`
- `cohort03-he-a-v1-v3-semitic-alt-r01`
- `cohort03-he-a-v2-v3-control-main-r01`
- `cohort03-he-a-v2-v3-control-alt-r01`

Expected task metadata:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `he`
- `vowelUnderTest`: `a`

Interpretation rule:

- If `V1-V3` is cleaner than `V2-V3`, classify as Hebrew lower/open Semitic bridge support.
- If both brackets fail or collapse, classify as Semitic `/a/` instability.
- If controls are equally clean, classify as weak / non-separating.

## 5. Deferred high-region cases

These are planned but not executable until Arabic `/a/` and Hebrew `/a/` are recorded.

### 5.1 Arabic `/i/`

Planned candidate bracket:

- `V5-V7`

Planned control bracket:

- `V4-V7`

Planned series label:

- `cohort03-ar-i-v5-v7-semitic-v0.1`

Reason for deferral:

- High-region tests are pressure-sensitive after Finnish `/y/`.
- Arabic `/i/` should be tested only after lower/open Semitic baseline behavior is known.

### 5.2 Hebrew `/i/`

Planned candidate bracket:

- `V5-V7`

Planned control bracket:

- `V4-V7`

Planned series label:

- `cohort03-he-i-v5-v7-semitic-v0.1`

Reason for deferral:

- High-region tests are pressure-sensitive after Finnish `/y/`.
- Hebrew `/i/` should be tested only after lower/open Semitic baseline behavior is known.

## 6. Execution order

Run in this order:

1. Arabic `/a/`
2. Record Arabic `/a/` result.
3. Hebrew `/a/`
4. Record Hebrew `/a/` result.
5. Write Semitic Phase B `/a/` mini-summary.
6. Decide whether to continue to Arabic `/i/` and Hebrew `/i/`.

Do not run Arabic `/i/` or Hebrew `/i/` before Arabic `/a/` and Hebrew `/a/` are recorded.

## 7. Completion definition for Phase B first pass

The Semitic Phase B first pass is complete only when these exist:

- Arabic `/a/` four-run evidence pack;
- Arabic `/a/` result record;
- Hebrew `/a/` four-run evidence pack;
- Hebrew `/a/` result record;
- Semitic Phase B `/a/` mini-summary.

## 8. Claim boundaries

Allowed:

- This document locks the first Semitic Phase B design.
- Arabic `/a/` and Hebrew `/a/` are the first executable cases.
- Arabic `/i/` and Hebrew `/i/` are deferred high-region cases.
- Semitic Phase B will use broad Latin transliteration in the first pass.

Blocked:

- Do not claim any Semitic result before scoring.
- Do not claim Arabic supports any bracket before evidence exists.
- Do not claim Hebrew supports any bracket before evidence exists.
- Do not claim Semitic languages validate the framework.
- Do not claim root-and-pattern morphology proves the model.
- Do not update README from this design alone.
- Do not publish from this design alone.
- Do not say the full ZË-RO framework is proven.
