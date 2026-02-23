# Preregistration — Albanian200 v0.1 (baseline expansion)

## Purpose
Increase statistical power for tag↔carrier associations in Albanian by expanding Albanian150 → Albanian200.

## Dataset construction
- Base: Albanian150 words + historical mixed tags:
  - `tests/research/albanian150.words.v0.1.txt`
  - `tests/research/albanian150.meta.v0.1.mixed.json`
- Expansion: add 50 new items (sq.151–sq.200) with **strict single-tag** policy.
- No retroactive edits: Albanian150 tags remain unchanged (history preserved).

## Selection policy (anti p-hack)
- New items chosen by *semantic atomicity* and *single-tag clarity*.
- Prefer nouns/pronouns/adverbs over conjugated verbs (reduce suffix-tax).
- Not selected for vowel content; vowels are treated as observed outcomes.

## IPA policy
- IPA strings are phoneme-level, vowel-carrier focused, consistent with existing corpus style.
- Albanian ë represented as /ə/ where applicable.
- This is sufficient for carrier extraction; later revisions may refine consonant detail if needed.

## Analysis plan
Run deterministic pilots:
- `semanticPilot.albanian200.v0.1` (top carrier per tag + permutation p-values)
- `semanticPilot.albanian200.matrix.v0.1` (Tag×Vowel obs/p per cell)

Seeds/iters are fixed in the specs; significance threshold for drilldown remains p<=0.10.
