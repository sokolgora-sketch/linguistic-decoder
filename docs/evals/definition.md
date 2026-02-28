# ZË-RO Evals v0.1 — Definition (Scope Lock)

## What ZË-RO Evals is (v0.1)
ZË-RO Evals is a **reproducible calibration probe**. It measures **Aperture–Semantics Consistency** under controlled tasks.

It does **not** claim:
- “truthfulness”
- “hallucination reduction”
- a general-purpose “LLM quality score”

## What is measured
Given a set of model-produced word tokens tagged into semantic buckets (V1..V7), we measure:
- vowel-carrier extraction (orthography) via SSOT
- deterministic aperture proxy metrics:
  - aperture(primary)
  - aperture(presence mean)
- slope statistics on **bucket means** vs semantic index 1..7:
  - Pearson r, Spearman ρ
  - permutation p-values (seeded, deterministic)

## Hard constraints (v0.1)
- BYO outputs only (no API keys, no model calls).
- No free-text “meaning drift” scoring (too gameable / subjective).
- Outputs must be deterministic, versioned, and baseline-lockable.
