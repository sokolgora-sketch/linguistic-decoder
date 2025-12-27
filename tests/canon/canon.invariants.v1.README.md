# Canon Invariants v1

These tests exist to lock **structural correctness** of the engine output.
They are intentionally **not snapshots**.

## What invariants should cover
- Required fields exist and are correctly typed.
- Arrays are arrays; strings are strings; no accidental `undefined`.
- Strict-mode always returns at least one candidate.
- math7_summary is present when the input contains vowels.

## What invariants should NOT cover
- Exact decomposition strings (that’s snapshot territory).
- Timestamps.
- Narrative text phrasing.

## Why this matters
Snapshots lock behavior *as observed*.
Invariants lock behavior *as required*.

Use both.
