# ZË-RO — Linguistic Analysis Instrument

*A deterministic seven-vowel analysis instrument (orthography + optional IPA) with evidence-first telemetry and baseline-locked research harnesses.*

[![CI](https://github.com/sokolgora-sketch/linguistic-decoder/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sokolgora-sketch/linguistic-decoder/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

---

## Published Research

- **Paper:** [ZË-RO v0.1: A Deterministic Orthography Aperture Meter with Baseline-Locked Drift Detection](https://ling.auf.net/lingbuzz/009799)
  - **Author:** Sokol Gora
  - **Published:** LingBuzz, February 2026
  - **Reference:** `lingbuzz/009799`

- **Note:** [ZË-RO v0.2 Note: Morphological Masking & Recovery in Albanian200 (Controlled Ablation)](https://ling.auf.net/lingbuzz/009808)
  - **Author:** Sokol Gora
  - **Published:** LingBuzz, March 2026
  - **Reference:** `lingbuzz/009808`

- **Paper:** [Seven-Primal-Vowel Bracket Testing: Cohort 01 Evidence Across Ten Languages](https://ling.auf.net/lingbuzz/009966)
  - **Author:** Sokol Gora
  - **Published:** LingBuzz, May 2026
  - **Reference:** `lingbuzz/009966`
  - **Repository paper:** [Markdown](docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md)
  - **Evidence archive:** [Zenodo DOI 10.5281/zenodo.20047120](https://doi.org/10.5281/zenodo.20047120)
  - **Reproduction:** [Cohort 01 reproduction runbook](docs/papers/zero-cohort-01-reproduction-runbook-v0.1.md)

- **Paper:** [Seven-Primal-Vowel Bracket Testing: Cohort 02 Support and Pressure Cases Across Six Languages](https://ling.auf.net/lingbuzz/009986)
  - **Author:** Sokol Gora
  - **Published:** LingBuzz, May 2026
  - **Reference:** `lingbuzz/009986`
  - **Repository paper:** [Markdown](docs/evals/cohort-02-paper-preprint-v0.6.md)
  - **Evidence archive:** [Zenodo DOI 10.5281/zenodo.20116021](https://doi.org/10.5281/zenodo.20116021)
  - **Cross-model supplement:** [Zenodo DOI 10.5281/zenodo.20174451](https://doi.org/10.5281/zenodo.20174451)
  - **Cross-model supplement note:** [LingBuzz 009994](https://ling.auf.net/lingbuzz/009994)
  - **Publication record:** [Cohort 02 LingBuzz publication](docs/evals/cohort-02-lingbuzz-publication-v0.1.md)

This repository contains the implementation, datasets, and reproducibility infrastructure described in those releases.

---

## Start here

If you are new to the repo, read in this order:

1. `docs/README.md`
2. `docs/process/workflows.md`
3. `docs/constitution/README.md`
4. `docs/research/README.md`
5. `docs/evals/`

This is the shortest path to understanding:
- what ZË-RO is
- what is governed as stable
- what is research-facing
- what is eval-harness output

---

## What this repo is

ZË-RO is a **calibration-grade linguistic analysis instrument** for vowel-carrier structure in words.

It is designed to **measure**, **reproduce**, and **catch drift** — not to merely “sound right”.

Deterministic core behaviors:

1. **Extract a 7-vowel voice path** using only: **A, E, I, O, U, Y, Ë**
   - from **orthography** (spelling)
   - from **phonetics** when an **IPA string** is provided (optional)

2. **Detect Mask vs Carrier divergence**
   - if spelling path ≠ IPA carrier path, the UI marks **DIVERGE**

3. **Emit audit-friendly telemetry**
   - evidence-first output
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
- Taiwan suite is designed to show fragile signal weakening under expansion.

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

<!-- DF_PUBLICATIONS_START -->
## Publications / Preprints
- LingBuzz 009799 — ZË-RO v0.1 baseline report (deterministic orthography aperture meter + baseline-lock drift workflow): https://ling.auf.net/lingbuzz/009799
- LingBuzz 009808 — ZË-RO v0.2 Note: Morphological Masking & Recovery in Albanian200 (Controlled Ablation): https://ling.auf.net/lingbuzz/009808
- LingBuzz 009966 — Seven-Primal-Vowel Bracket Testing: Cohort 01 Evidence Across Ten Languages: https://ling.auf.net/lingbuzz/009966
- Cohort 01 repository paper: docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md
- Cohort 01 evidence archive — Zenodo DOI: https://doi.org/10.5281/zenodo.20047120
- Cohort 01 reproduction runbook: docs/papers/zero-cohort-01-reproduction-runbook-v0.1.md
- LingBuzz 009986 — Seven-Primal-Vowel Bracket Testing: Cohort 02 Support and Pressure Cases Across Six Languages: https://ling.auf.net/lingbuzz/009986
- Cohort 02 repository paper: docs/evals/cohort-02-paper-preprint-v0.6.md
- Cohort 02 evidence archive — Zenodo DOI: https://doi.org/10.5281/zenodo.20116021
- Cohort 02 all-versions archive DOI: https://doi.org/10.5281/zenodo.20116020
- Cohort 02 LingBuzz publication record: docs/evals/cohort-02-lingbuzz-publication-v0.1.md
- Cohort 02 Zenodo publication record: docs/evals/cohort-02-zenodo-publication-v0.1.md
- LingBuzz 009994 — ZË-RO Cohort 02 Cross-Model Supplement: Replication, Cleaner-Provisional Support, and Pressure Evidence: https://ling.auf.net/lingbuzz/009994
- Cohort 02 cross-model supplement archive — Zenodo DOI: https://doi.org/10.5281/zenodo.20174451
- Cohort 02 cross-model supplement all-versions DOI: https://doi.org/10.5281/zenodo.20174450
- Cohort 02 cross-model supplement Zenodo publication record: docs/evals/cohort-02-cross-model-supplement-zenodo-publication-v0.1.md
- Cohort 02 cross-model supplement LingBuzz publication record: docs/evals/cohort-02-cross-model-supplement-lingbuzz-publication-v0.1.md

## Research Controls
- Corpus70 tagger-sensitivity control (Gemini-blind vs Claude-blind):
  - note: docs/lingbuzz/spectrogram.corpus70.ab.v0.1.md
  - fixtures: tests/research/corpus70.meta.v0.1.gemini.json; tests/research/corpus70.meta.v0.1.claude-blind.json
  - spectrogram override: SPECTROGRAM_CORPUS70_META (tests/research/spectrogram.v0.2.spec.ts)
<!-- DF_PUBLICATIONS_END -->