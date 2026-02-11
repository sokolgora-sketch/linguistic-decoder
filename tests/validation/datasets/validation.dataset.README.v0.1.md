# External Validation Dataset (v0.1)

This dataset is a **local fixture** used by the External Validation Harness.
No network calls are allowed in tests.

## Record schema (v0.1)
Each record is:
- id (string, stable)
- lang (string; e.g. en, sq, it, el, sa)
- word (string; lemma/spelling)
- ipa (optional string; if provided, enables phonetic rail)
- semanticTag (string; coarse label)
- knownEtymology (string; coarse provenance label)
- notes (optional string)

## Files
- validation.dataset.v0.1.json — full dataset records
- validation.train.v0.1.json — list of record ids (train)
- validation.holdout.v0.1.json — list of record ids (holdout)

## Rules
- Inputs are fixtures only (no external IO).
- IDs must remain stable once introduced.
- Splits are locked by explicit id lists (v0.1); later versions may move to hash-split.
