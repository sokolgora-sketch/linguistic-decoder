# Cohort 03 `/i/` High-Front Lane Probe Run Design v0.1

Status: run design only
Scope: documentation only
Date recorded: 2026-05-20

## 1. Purpose

This document defines the next `/evals` run design after:

- `docs/evals/cohort-03-high-region-i-pressure-batch-summary-v0.1.md`
- `docs/evals/cohort-03-i-pressure-mechanism-design-v0.1.md`

The mechanism-design document required a run-design doc before any new high-region `/i/` payloads.

This document defines exact languages, brackets, token buckets, run IDs, readout logic, export requirements, and claim boundaries for the next probe.

It does not execute the runs.

## 2. Probe name

Series label:

- `cohort03-i-high-front-lane-probe-v0.1`

Purpose:

> Test whether a narrower high-front lane changes the repeated `/i/` high-collapse pattern without forcing non-`/i/` high-region controls into the same collapse.

This is a diagnostic probe, not a support test.

## 3. Background

The previous batch showed:

| Target | Result |
|---|---|
| Hindi `/i/` | robust `COLLAPSED_HIGH` |
| Persian `/i/` | robust `COLLAPSED_HIGH` |
| Arabic `/i/` | robust `COLLAPSED_HIGH` |
| Hebrew `/i/` | robust `COLLAPSED_HIGH` |
| Finnish `/y/` | `INTERMEDIATE` |
| Turkish `/ı/` | mostly `INTERMEDIATE`, one mixed-target `EXCEEDS_LOW` |

Working interpretation:

> Cross-family `/i/` pressure exists under the current high-region lens, but this is not global high-region failure.

## 4. Probe logic

The probe uses two pressure targets and two controls.

| Role | Language | Target | Reason |
|---|---|---|---|
| primary pressure target | Hindi | `/i/` | most audited `/i/` case |
| cross-family pressure target | Arabic | `/i/` | Semitic replication case |
| high-front rounded control | Finnish | `/y/` | stayed `INTERMEDIATE` in cleaned comparison |
| high-back/unrounded control | Turkish | `/ı/` | mostly stayed `INTERMEDIATE` in cleaned comparison |

Primary bracket idea:

- pressure targets compare prior `V5-V7` behavior against a narrower `V6-V7` high-front lane;
- controls confirm Finnish `/y/` and Turkish `/ı/` are not forced into the same high-collapse pattern.

## 5. Common UI metadata

Use these UI fields for every future run in this design:

- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `provider`: `researcher`
- `model`: `researcher-curated`
- `sourceEngineId`: leave blank
- `sourceEngineVersion`: leave blank
- `sourceEngineBuild`: leave blank
- `series label`: `cohort03-i-high-front-lane-probe-v0.1`

## 6. Planned runs

This probe has eight runs.

### 6.1 Hindi `/i/`

#### Run 1 — Hindi `/i/`, prior bracket control

Run ID:

- `cohort03-hi-i-high-front-lane-prior-v5-v7-control-r01`

UI fields:

- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V5`
- `anchorHigh`: `V7`

Buckets:

- `anchor_low`: `["doodh", "phool", "sooraj", "roop", "bhookh", "khoon", "jhooth", "dhoop", "chooha", "kooda"]`
- `x_vowel`: `["din", "dil", "sir", "kitab", "shiksha", "nadi", "pita", "kisan", "vidya", "mitti"]`
- `anchor_high`: `["khel", "mel", "der", "bher", "sher", "ret", "ped", "khet", "tel", "savera"]`

#### Run 2 — Hindi `/i/`, narrow high-front lane

Run ID:

- `cohort03-hi-i-high-front-lane-v6-v7-candidate-r01`

UI fields:

- `languageHint`: `hi`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Buckets:

- `anchor_low`: `["doodh", "phool", "sooraj", "roop", "bhookh", "khoon", "jhooth", "dhoop", "chooha", "kooda"]`
- `x_vowel`: `["din", "dil", "sir", "kitab", "shiksha", "nadi", "pita", "kisan", "vidya", "mitti"]`
- `anchor_high`: `["jeevan", "geet", "neend", "cheez", "teer", "jeet", "peepal", "keeda", "deewar", "meetha"]`

### 6.2 Arabic `/i/`

#### Run 3 — Arabic `/i/`, prior bracket control

Run ID:

- `cohort03-ar-i-high-front-lane-prior-v5-v7-control-r01`

UI fields:

- `languageHint`: `ar`
- `vowelUnderTest`: `i`
- `anchorLow`: `V5`
- `anchorHigh`: `V7`

Buckets:

- `anchor_low`: `["safar", "sayr", "mashy", "masar", "nahr", "bahr", "hawa", "qadam", "mamarr", "sahm"]`
- `x_vowel`: `["kitab", "bint", "sikkah", "qalib", "kabir", "saghir", "jadid", "qadim", "jism", "ism"]`
- `anchor_high`: `["nuqta", "hadd", "qalam", "satr", "rasm", "qaws", "ramz", "wasm", "fann", "shakl"]`

#### Run 4 — Arabic `/i/`, narrow high-front lane

Run ID:

- `cohort03-ar-i-high-front-lane-v6-v7-candidate-r01`

UI fields:

- `languageHint`: `ar`
- `vowelUnderTest`: `i`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Buckets:

- `anchor_low`: `["safar", "sayr", "mashy", "masar", "nahr", "bahr", "hawa", "qadam", "mamarr", "sahm"]`
- `x_vowel`: `["kitab", "bint", "sikkah", "qalib", "kabir", "saghir", "jadid", "qadim", "jism", "ism"]`
- `anchor_high`: `["sifr", "sirr", "jild", "tin", "tibn", "dibs", "simt", "rijl", "hibr", "liman"]`

### 6.3 Finnish `/y/`

#### Run 5 — Finnish `/y/`, prior bracket control

Run ID:

- `cohort03-fi-y-high-front-lane-prior-v5-v7-control-r01`

UI fields:

- `languageHint`: `fi`
- `vowelUnderTest`: `y`
- `anchorLow`: `V5`
- `anchorHigh`: `V7`

Buckets:

- `anchor_low`: `["tuli", "kumi", "suu", "puu", "muna", "tupa", "kukka", "lumi", "suku", "puro"]`
- `x_vowel`: `["yksi", "kyla", "syli", "sydan", "tyyni", "kyynel", "myyda", "syyta", "pyha", "lyhyt"]`
- `anchor_high`: `["kivi", "nimi", "pieni", "tie", "meri", "siipi", "viini", "riisi", "hiiri", "liike"]`

#### Run 6 — Finnish `/y/`, high-front lane check

Run ID:

- `cohort03-fi-y-high-front-lane-v6-v7-control-r01`

UI fields:

- `languageHint`: `fi`
- `vowelUnderTest`: `y`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Buckets:

- `anchor_low`: `["tuli", "kumi", "suu", "puu", "muna", "tupa", "kukka", "lumi", "suku", "puro"]`
- `x_vowel`: `["yksi", "kyla", "syli", "sydan", "tyyni", "kyynel", "myyda", "syyta", "pyha", "lyhyt"]`
- `anchor_high`: `["kivi", "nimi", "pieni", "tie", "meri", "siipi", "viini", "riisi", "hiiri", "liike"]`

### 6.4 Turkish `/ı/`

#### Run 7 — Turkish `/ı/`, prior bracket control

Run ID:

- `cohort03-tr-ii-high-front-lane-prior-v6-v7-control-r01`

UI fields:

- `languageHint`: `tr`
- `vowelUnderTest`: `ı`
- `anchorLow`: `V6`
- `anchorHigh`: `V7`

Buckets:

- `anchor_low`: `["kul", "pul", "su", "tut", "burun", "uzun", "kuru", "tuz", "bulut", "odun"]`
- `x_vowel`: `["kız", "kır", "sır", "ılık", "ışık", "ırmak", "bıçak", "yıl", "kıl", "ağız"]`
- `anchor_high`: `["bit", "dil", "ip", "iz", "ince", "isim", "bilim", "kilit", "simit", "deniz"]`

#### Run 8 — Turkish `/ı/`, widened high-region control

Run ID:

- `cohort03-tr-ii-high-front-lane-v5-v7-control-r01`

UI fields:

- `languageHint`: `tr`
- `vowelUnderTest`: `ı`
- `anchorLow`: `V5`
- `anchorHigh`: `V7`

Buckets:

- `anchor_low`: `["kol", "yol", "son", "okul", "oda", "top", "sol", "orman", "sokak", "dolu"]`
- `x_vowel`: `["kız", "kır", "sır", "ılık", "ışık", "ırmak", "bıçak", "yıl", "kıl", "ağız"]`
- `anchor_high`: `["bit", "dil", "ip", "iz", "ince", "isim", "bilim", "kilit", "simit", "deniz"]`

## 7. Readout logic

### Outcome A — `/i/` stabilizes and controls do not collapse

Pattern:

- Hindi `/i/` `V6-V7`: `INTERMEDIATE`
- Arabic `/i/` `V6-V7`: `INTERMEDIATE`
- Finnish `/y/`: `INTERMEDIATE`
- Turkish `/ı/`: `INTERMEDIATE` or edge-stressed but not high-collapsed

Interpretation:

> A narrower high-front lane may reduce `/i/` collapse, but this is not support until replicated.

### Outcome B — `/i/` remains high-collapsed and controls do not collapse

Pattern:

- Hindi `/i/`: `COLLAPSED_HIGH`
- Arabic `/i/`: `COLLAPSED_HIGH`
- Finnish `/y/`: non-collapsed
- Turkish `/ı/`: non-collapsed

Interpretation:

> `/i/` pressure persists even inside the narrow lane. Mechanism likely target-internal or scorer-geometry pressure.

### Outcome C — `/i/` and controls all collapse high

Pattern:

- Hindi `/i/`: `COLLAPSED_HIGH`
- Arabic `/i/`: `COLLAPSED_HIGH`
- Finnish `/y/`: `COLLAPSED_HIGH`
- Turkish `/ı/`: `COLLAPSED_HIGH`

Interpretation:

> The proposed narrow lane is too compressive and should be rejected.

### Outcome D — controls collapse but `/i/` stabilizes

Pattern:

- Hindi `/i/`: non-collapsed
- Arabic `/i/`: non-collapsed
- Finnish `/y/` or Turkish `/ı/`: collapsed

Interpretation:

> The lane may be overfit to `/i/` and unsafe as a general high-region diagnostic.

## 8. Export requirements

After running the eight runs:

- save each run in `/evals`;
- export one series evidence pack;
- verify the ZIP includes `series-diagnostics.json`;
- inspect `series-summary.csv`;
- record SHA256;
- do not create a docs PR until the whole series is inspected.

Expected exported series:

- `evals.series-evidence-pack.cohort03-i-high-front-lane-probe-v0.1.v0.1.zip`

## 9. Claim boundaries

Allowed:

- This design defines a diagnostic probe.
- The probe may test whether a narrower high-front lane changes `/i/` collapse.
- Finnish `/y/` and Turkish `/ı/` act as controls.
- Stabilization would only justify further replication, not support.

Blocked:

- Do not claim `V6-V7` is the solution.
- Do not claim `/i/` supports any bracket.
- Do not claim this probe proves the model.
- Do not update README from this probe.
- Do not change scorer math from this probe alone.
- Do not change anchor definitions from this probe alone.
- Do not publish this as final evidence.
