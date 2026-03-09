# Research Index

This folder is the entrypoint for research-facing notes and paper-style outputs in the ZË-RO repository.

## Purpose

Research docs are descriptive artifacts.
They report measurements, controlled probes, eval batteries, and reproducible findings.

They are **not** engine law by default.

For governing rules, read:
- `docs/constitution/README.md`

## Current research-facing documents

### Core notes
- [Instrument Baseline Report v0.1](../lingbuzz/instrument-baseline-report.v0.1.md)
- [Albanian200 Morphological Masking & Recovery v0.1](../lingbuzz/albanian200.morph-mask.ablation.v0.1.md)

### Evaluation summaries
- [Cross-Provider Comparison — March 2026](../evals/battery.2026-03.cross-provider-comparison.md)

### Control / sensitivity notes
- [Corpus70 A/B — Tagger Sensitivity Check (Gemini-blind vs Claude-blind)](../lingbuzz/spectrogram.corpus70.ab.v0.1.md)
- [Corpus70 A/B/C/D — Multi-tagger Sensitivity (Gemini vs Claude vs ChatGPT vs Grok)](../lingbuzz/spectrogram.corpus70.abcd.v0.1.md)

## Publication lock records

These stay under `docs/lingbuzz/` because they are release-lock metadata, not the research note itself:

- `docs/lingbuzz/lingbuzz.009799.release.v0.1.md`
- `docs/lingbuzz/lingbuzz.009808.release.v0.1.md`

## Current rule

- manuscript / note content should be easy to discover from `docs/research/`
- publication lock metadata can remain in `docs/lingbuzz/`
- constitution docs stay separate from research docs
