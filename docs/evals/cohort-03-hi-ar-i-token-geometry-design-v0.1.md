# Cohort 03 Hindi/Arabic `/i/` Token Geometry Comparison Design v0.1

Status: design only
Scope: documentation only
Date recorded: 2026-05-20

## 1. Purpose

This document defines the next mechanism-analysis step after the Cohort 03 `/i/` high-front lane probe result.

Source result:

- `docs/evals/cohort-03-i-high-front-lane-probe-result-v0.1.md`

The source result recorded a split:

- Hindi `/i/` stayed `COLLAPSED_HIGH` under `V6-V7`.
- Arabic `/i/` moved from `COLLAPSED_HIGH` under `V5-V7` to `INTERMEDIATE` under `V6-V7`.

This document does not define new `/evals` runs. It defines what must be inspected before any new run is designed.

## 2. Mechanism question

Main question:

> Why does Arabic `/i/` stabilize under `V6-V7` while Hindi `/i/` remains high-collapsed?

This is now the central high-region mechanism question.

## 3. Known result split

| Language | Target | Prior bracket | Prior verdict | Narrow bracket | Narrow verdict | Read |
|---|---|---|---|---|---|---|
| Hindi | `/i/` | `V5-V7` | `COLLAPSED_HIGH` | `V6-V7` | `COLLAPSED_HIGH` | not rescued |
| Arabic | `/i/` | `V5-V7` | `COLLAPSED_HIGH` | `V6-V7` | `INTERMEDIATE` | rescued / bracket-sensitive |

Numeric comparison:

| Language | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Movement |
|---|---|---|---:|---:|---:|---|
| Hindi | `V5-V7` | `COLLAPSED_HIGH` | `2.230159` | `0.468333` | `-0.258333` | baseline high collapse |
| Hindi | `V6-V7` | `COLLAPSED_HIGH` | `3.602564` | `0.468333` | `-0.338333` | worse high-side collapse |
| Arabic | `V5-V7` | `COLLAPSED_HIGH` | `-12.875000` | `0.515000` | `-0.555000` | baseline high collapse |
| Arabic | `V6-V7` | `INTERMEDIATE` | `0.656051` | `0.515000` | `0.270000` | stabilized |

Important numerical signal:

- Hindi `gap_high` moved from `-0.258333` to `-0.338333`.
- Arabic `gap_high` moved from `-0.555000` to `0.270000`.

Interpretation:

> The same nominal bracket change does not produce the same geometry effect across Hindi and Arabic. Arabic gains positive high-side separation under `V6-V7`; Hindi loses more high-side separation.

## 4. Buckets to compare

### 4.1 Hindi `/i/`

Hindi target bucket:

- `din`
- `dil`
- `sir`
- `kitab`
- `shiksha`
- `nadi`
- `pita`
- `kisan`
- `vidya`
- `mitti`

Hindi prior `V5-V7` high anchor:

- `khel`
- `mel`
- `der`
- `bher`
- `sher`
- `ret`
- `ped`
- `khet`
- `tel`
- `savera`

Hindi `V6-V7` high anchor:

- `jeevan`
- `geet`
- `neend`
- `cheez`
- `teer`
- `jeet`
- `peepal`
- `keeda`
- `deewar`
- `meetha`

### 4.2 Arabic `/i/`

Arabic target bucket:

- `kitab`
- `bint`
- `sikkah`
- `qalib`
- `kabir`
- `saghir`
- `jadid`
- `qadim`
- `jism`
- `ism`

Arabic prior `V5-V7` high anchor:

- `nuqta`
- `hadd`
- `qalam`
- `satr`
- `rasm`
- `qaws`
- `ramz`
- `wasm`
- `fann`
- `shakl`

Arabic `V6-V7` high anchor:

- `sifr`
- `sirr`
- `jild`
- `tin`
- `tibn`
- `dibs`
- `simt`
- `rijl`
- `hibr`
- `liman`

## 5. Inspection targets

The next analysis should inspect four possible sources of the Hindi/Arabic split.

### 5.1 Target-bucket geometry

Question:

> Is the Hindi `/i/` target bucket intrinsically closer to the high anchor than the Arabic `/i/` target bucket?

Inspect:

- token length;
- number of explicit `i` positions;
- open/closed syllable shape;
- consonant cluster density;
- semantic class mixing;
- repeated target-like high-front material in anchors.

### 5.2 High-anchor geometry

Question:

> Does the Hindi `V6-V7` high anchor create a more compressive high boundary than the Arabic `V6-V7` high anchor?

Inspect:

- Hindi high anchor contains many long `ee/ei`-like transliteration forms:
  - `jeevan`, `geet`, `neend`, `cheez`, `teer`, `jeet`, `peepal`, `keeda`, `deewar`, `meetha`
- Arabic high anchor contains mostly short `i` words:
  - `sifr`, `sirr`, `jild`, `tin`, `tibn`, `dibs`, `simt`, `rijl`, `hibr`, `liman`

Hypothesis:

> Hindi `V6-V7` high anchor may be too close to, or too strong against, the Hindi `/i/` target bucket. Arabic `V6-V7` may create a clearer lane because its high anchor is shaped differently.

### 5.3 Low-anchor invariance

Both Hindi and Arabic kept the same low anchor between the prior and narrow comparison.

Question:

> Since `gap_low` stayed unchanged in both Hindi and Arabic, is the whole difference driven by high-anchor movement?

Observed:

- Hindi `gap_low`: `0.468333` in both runs.
- Arabic `gap_low`: `0.515000` in both runs.

Interpretation:

> The split is primarily high-boundary behavior, not low-boundary behavior.

### 5.4 Scoring/geometry pressure

Question:

> Does the scoring geometry treat Hindi long-high-front transliteration differently from Arabic short-i transliteration?

Inspect:

- long vowel spellings:
  - Hindi: `ee`, `eea`, `ea`, `ii`-like visual patterns depending token
  - Arabic: mostly single `i`
- whether long transliteration forms compress toward the high anchor;
- whether Hindi words with `ee` in the high anchor create stronger high-anchor suction.

## 6. Working hypotheses

### H1 — Hindi high anchor is too target-like

Hindi `V6-V7` high anchor may not act as a clean high boundary. It may contain too much target-like material, making Hindi `/i/` collapse harder.

Expected sign:

- Hindi remains high-collapsed even after narrowing.
- `gap_high` becomes more negative under `V6-V7`.

Observed:

- yes.

### H2 — Arabic V6-V7 anchor is better separated

Arabic `V6-V7` high anchor may create a more usable diagnostic lane because the high anchor is shorter and structurally different from the target bucket.

Expected sign:

- Arabic moves from `COLLAPSED_HIGH` to `INTERMEDIATE`.
- `gap_high` becomes positive.

Observed:

- yes.

### H3 — Hindi target bucket itself is harder

Hindi target words may carry lexical/phonotactic features that remain too close to the high anchor no matter which high anchor is used.

Expected sign:

- Hindi remains collapsed across previous audits:
  - high-anchor contamination audit;
  - target-bucket split audit;
  - low-anchor sensitivity audit;
  - high-front lane probe.

Observed:

- yes.

### H4 — Transliteration convention is a confound

Hindi broad transliteration may over-represent high-front length or spelling shape compared with Arabic broad transliteration.

Expected sign:

- Hindi long-vowel transliterations produce more high-side compression than Arabic short-vowel forms.

Observed:

- not proven yet.

## 7. What not to do next

Do not:

- run another broad `/i/` language battery;
- claim `V6-V7` solved `/i/`;
- treat Arabic stabilization as support;
- treat Hindi collapse as final falsification;
- change scorer math;
- change anchor doctrine;
- update README;
- publish this stage.

## 8. Recommended next concrete work

Recommended next step:

> Create a token-geometry inspection artifact or script that compares Hindi and Arabic bucket structure without scoring new runs.

Minimum output should include:

1. target/high-anchor token list comparison;
2. vowel-pattern summary per bucket;
3. token-length summary per bucket;
4. count of `i`, `ee`, `e`, and other high-front transliteration markers;
5. note whether high anchors look target-like;
6. proposed follow-up run only if the geometry inspection finds a specific confound.

## 9. Decision gate before new runs

Only design a new `/evals` run if the token-geometry comparison identifies a testable confound, such as:

- Hindi high anchor is too target-like;
- Hindi long-vowel spelling is over-compressing;
- Arabic short-i high anchor is better separated;
- target bucket needs matched short-i vs long-i split.

If no clear confound is found, do not run more tests. Record the split as unresolved mechanism pressure.
