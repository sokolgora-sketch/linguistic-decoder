# Semantic Pilot v0.1 — Research Note (pre-registered)

## What we observed (Corpus70 / English-heavy)
- One tag emerged as potentially non-random in permutation testing:
  - `expression` showed low p-value (~0.027) under Gemini-blind tagging.
- Drilldown suggests the effect is dominated by DIVERGE cases (mask Y/E → carrier I),
  consistent with English/Greek/Latinate phonotactics + borrowing conventions.
- A separate artifact appears for position/function-words (schwa/Ë sink).

## Hypothesis under test (next)
If the effect is “real” (not an English orthography/loanword artifact), then in a Classical control corpus
(Latin+Greek with mandatory IPA), we should still see tag concentration in carrier primaries.

## Next control
- Classical100 v0.1 (50 Latin + 50 Greek, IPA required, 8 fixed tags)
- Run same pipeline: purity + permutation p-values + drilldown.
