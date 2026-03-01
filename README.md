# ZË-RO — Linguistic Decoder

*A deterministic seven-vowel analysis instrument (orthography + optional IPA) with evidence-first telemetry and baseline-locked research harnesses.*

[![CI](https://github.com/sokolgora-sketch/linguistic-decoder/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sokolgora-sketch/linguistic-decoder/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

---

## 📄 Published Research

**Paper:** [ZË-RO v0.1: A Deterministic Orthography Aperture Meter with Baseline-Locked Drift Detection](https://ling.auf.net/lingbuzz/009799)  
**Author:** Sokol Gora  
**Published:** LingBuzz, February 2026  
**Reference:** lingbuzz/009799

This repository contains the implementation, datasets, and reproducibility infrastructure described in the paper.

---
```

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
- `npm test` — full suite
- `npm run canon:c2` — detect drift vs baseline (fails on unexpected change)
- `npm run canon:c2:update` — refresh baseline after an intentional change

---

## Deterministic aperture model

ZË-RO reduces vowel carriers to 7 categories and assigns a fixed **aperture proxy**:

| Voice | Aperture |
|------:|--------:|
| A | 1.0 |
| O | 0.8 |
| E | 0.6 |
| Ë | 0.5 |
| U | 0.4 |
| Y | 0.3 |
| I | 0.1 |

Two readouts are computed per item:
- **primary** = first carrier
- **presence mean** = mean aperture over unique carriers (in order)

---

## Example: “rhythm” (mask vs carrier)

```ts
analyzeWord("rhythm", { mode: "strict", ipa: "/ˈrɪð(ə)m/" });
```

Typical behavior:
- **Orthography (spelling):** `Y`
- **Phonetics (IPA carriers):** `I → Ë`
- **Status:** `DIVERGE`

This example exists to show the instrument is honest about spelling vs spoken carriers.

---

## Benchmarks (baseline-locked)

These are committed baselines used for drift detection.

- **Albanian (Gegë/Tosk) STEP10 v0.3:** `tests/validation/baselines/albanian.spectrum.gegTosk.step10.v0.3.md|json`
- **Turkish STEP10 v0.1 (langHint=tr):** `tests/validation/baselines/turkish.spectrum.step10.v0.1.md|json`
- **Turkish STEP20 v0.1 (langHint=tr):** `tests/validation/baselines/turkish.spectrum.step20.v0.1.md|json`
- **Turkish STEP10→STEP20 compare v0.1:** `tests/validation/baselines/turkish.spectrum.step20.v0.1.compare.v0.1.md|json`
- **Taiwan Zhuyin suite (compare + audit + toneSlope):** `tests/validation/baselines/taiwan.spectrum.rootOnly.v1.0.compare.v0.1.md|json`

High-level notes:
- Turkish presence-mean slope remains extremely strong at STEP10 and STEP20, and strengthens under expansion.
- Taiwan suite is designed to show fragile signal weakening under expansion (null / drift visibility).

---

## SSOT extraction paths

- Orthography SSOT: `src/shared/vowels/extractOrthographyVoicesFromWord.v0.1.ts`
- Zhuyin SSOT: `src/shared/vowels/extractZhuyinSignal.v0.1.ts`

Orthography mapper supports Latin diacritics (incl. `ë`, `ç`), Turkish vowel letters (`ö`, `ü`, `ı`, `İ`), and includes Greek support in v0.2.

---

## Reproduce

```bash
npm install
npm run gate:quick

# example: Turkish STEP20 suite
npm test -- tests/research/turkish.spectrum.step20.v0.1.spec.ts
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
