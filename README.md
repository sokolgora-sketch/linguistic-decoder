# ZË-RO — Linguistic Decoder

*A deterministic seven-vowel analysis instrument (orthography + optional IPA) with evidence-first telemetry and baseline-locked research harnesses.*

[![CI](https://github.com/sokolgora-sketch/linguistic-decoder/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sokolgora-sketch/linguistic-decoder/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

---

## What this repo is

ZË-RO is a **calibration-grade decoder** for vowel-carrier structure in words.

It is designed to **measure**, **reproduce**, and **catch drift** — not to “sound right”.

Deterministic core behaviors:

1) **Extract a 7-vowel “voice path”** using only: **A, E, I, O, U, Y, Ë**
   - from **orthography** (spelling)
   - from **phonetics** when an **IPA string** is provided (optional)

2) **Detect Mask vs Carrier divergence**
   - if spelling path ≠ IPA carrier path, the UI marks **DIVERGE**

3) **Emit audit-friendly telemetry**
   - evidence-first output (stable references)
   - explicit “not emitted” instead of silent nulls
   - research harnesses write **MD + JSON** reports

This is a research instrument. It helps test hypotheses about vowel structure and meaning. It does **not** claim conclusions by default.

---

## Determinism & anti-regression

- **SSOT vowel extraction** (one authoritative mapper)
- **Evidence-first contracts** (UI reads VM; missing data is explicit)
- **Baseline locking** (drift detection via committed baselines)

Commands:

- `npm run gate:quick` — lint + unit tests + integration + build
- `npm test` — full suite (as of baseline lock: **294 passed, 3 skipped**; **732 tests**, **146 snapshots**)
- `npm run canon:c2` — detect drift vs baseline (fails on unexpected change)
- `npm run canon:c2:update` — refresh baseline after an intentional change

---

## Example: “rhythm” (mask vs carrier)

```ts
analyzeWord("rhythm", { mode: "strict", ipa: "/ˈrɪð(ə)m/" });
```

Typical behavior:
- **Orthography (spelling):** `Y`
- **Phonetics (IPA carriers):** `I → Ë`
- **Status:** `DIVERGE`

---

## Deterministic aperture proxy (fixed meter)

ZË-RO uses a fixed, deterministic aperture proxy per voice (a calibration scale, not a claim about acoustics):

| Voice | A | O | E | Ë | U | Y | I |
|------:|--:|--:|--:|--:|--:|--:|--:|
| Aperture | 1.0 | 0.8 | 0.6 | 0.5 | 0.4 | 0.3 | 0.1 |

Two readouts are used in research harnesses:
- **primary** = aperture of the first carrier
- **presence mean** = mean aperture over carriers present in-order

---

## Benchmark: Albanian STEP10 v0.3 (baseline-locked)

Baseline lock: committed under `tests/validation/baselines/` (Feb 2026).

**Files**
- Corpus: `tests/research/albanian.spectrum.gegTosk.step10.v0.3.txt` (**N=140**, 10/bucket/dialect)
- Harness: `tests/research/albanian.spectrum.gegTosk.step10.v0.3.spec.ts`
- Baselines:
  - `tests/validation/baselines/albanian.spectrum.gegTosk.step10.v0.3.md`
  - `tests/validation/baselines/albanian.spectrum.gegTosk.step10.v0.3.json`
  - plus `*.audit.v0.1.*` and `*.compare.v0.1.*`

### Bucket means — ALL (N=140)
(From `tests/validation/baselines/albanian.spectrum.gegTosk.step10.v0.3.md`)

| Bucket | N | aperture(primary) | aperture(presence mean) |
|--------|--:|------------------:|------------------------:|
| V1 | 20 | 1.000 | 0.875 |
| V2 | 20 | 0.860 | 0.735 |
| V3 | 20 | 0.600 | 0.550 |
| V4 | 20 | 0.550 | 0.530 |
| V5 | 20 | 0.400 | 0.433 |
| V6 | 20 | 0.160 | 0.345 |
| V7 | 20 | 0.120 | 0.150 |

V7 presence-mean by dialect (from JSON baseline):
- **Tosk V7:** 0.160
- **Gegë V7:** 0.140

### Slope test (12,000-iteration permutation; bucket means vs semantic index 1..7)
(From `tests/validation/baselines/albanian.spectrum.gegTosk.step10.v0.3.md`)

| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |
|--------|-------|----------:|---------:|-----------:|---------:|
| ALL | aperture(primary) | -0.989 | 0.000 | -1.000 | 0.000 |
| ALL | aperture(presence mean) | -0.984 | 0.000 | -1.000 | 0.000 |
| Tosk | aperture(primary) | -0.989 | 0.000 | -1.000 | 0.000 |
| Tosk | aperture(presence mean) | -0.984 | 0.000 | -1.000 | 0.000 |
| Gegë | aperture(primary) | -0.989 | 0.000 | -1.000 | 0.000 |
| Gegë | aperture(presence mean) | -0.983 | 0.000 | -1.000 | 0.001 |

Instrument-level interpretation:
- Rank ordering across V1→V7 bucket means is strictly descending (ρ = -1.000).
- This baseline is the meter reference to detect drift during refactors or dataset changes.

---

## Honest null / drift visibility: Taiwan (Mandarin Zhuyin) suite

This suite exists to prove the instrument does **not** force-fit correlations.

**Files**
- Corpus: `tests/research/taiwan.spectrum.rootOnly.v1.0.txt`
- Harness: `tests/research/taiwan.spectrum.rootOnly.v1.0.spec.ts`
- Baselines:
  - `tests/validation/baselines/taiwan.spectrum.rootOnly.v1.0.compare.v0.1.md|json`
  - `tests/validation/baselines/taiwan.spectrum.rootOnly.v1.0.audit.v0.1.md|json`
  - `tests/validation/baselines/taiwan.spectrum.rootOnly.v1.0.toneSlope.v0.1.md|json`

Key result (from compare baseline):
- **N=10:** aperture(presence mean) shows signal — **r = -0.815**, **p = 0.026**
- **N=20:** signal degrades under expansion — **r = -0.746**, **p = 0.056**

Expected instrument behavior:
- stable signal should persist/strengthen with expansion
- fragile signal should weaken (drift / selection bias becomes visible)

Tone diagnostics are tracked separately in `toneSlope.v0.1.*`.

---

## SSOT extraction paths

- Orthography SSOT: `src/shared/vowels/extractOrthographyVoicesFromWord.v0.1.ts`
- Zhuyin SSOT: `src/shared/vowels/extractZhuyinSignal.v0.1.ts`

Orthography mapper supports Latin diacritics (incl. `ë`, `ç`) and Turkish vowel letters (`ö`, `ü`, `ı`, `İ`) and includes Greek support in v0.2.

---

## Reproduce

```bash
# full gate
npm run gate:quick

# Albanian STEP10 baseline suite
npm test -- tests/research/albanian.spectrum.gegTosk.step10.v0.3.spec.ts

# Taiwan suite
npm test -- tests/research/taiwan.spectrum.rootOnly.v1.0.spec.ts
```

Outputs:
- `tests/validation/out/*.md|*.json` (current run)
- `tests/validation/baselines/*.md|*.json` (committed drift references)

---

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

---

## License

GNU Affero General Public License v3.0 (AGPL-3.0). See `LICENSE`.