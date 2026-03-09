# ZË-RO Constitution

This folder is the canonical home for the stable rules of the ZË-RO instrument.

## Purpose

ZË-RO is a deterministic linguistic analysis instrument.  
Its constitutional layer defines the rules that should remain stable across UI changes, milestone work, and research iterations.

These rules are not marketing copy and not temporary milestone notes.  
They are the governing constraints of the system.

## What belongs here

Documents in this folder should define:

- what ZË-RO is
- what the engine is allowed to emit
- what the UI must not fake
- which authority layers override which others
- which contracts are considered stable
- which truths are machine-stable versus presentation-only

## What does not belong here

This folder is **not** for:

- temporary sprint notes
- one-off milestone reports
- experiment logs
- release chatter
- generated placeholders
- abandoned drafts

Those belong elsewhere:
- `docs/milestones/`
- `docs/research/`
- `docs/archive/`

## Current constitutional direction

At the current stage of the repo, the constitutional direction is:

1. ZË-RO is deterministic, not vibe-driven.
2. Public contract surfaces must be machine-stable.
3. UI labels may differ from engine IDs, but only through explicit normalization.
4. Missing evidence must remain explicit; the UI must not invent certainty.
5. Heart / instrument truth outranks downstream interpretation layers when they disagree.
6. Research notes are descriptive artifacts, not engine law.

## Current governing reference docs

These are the current repo-native governing docs and should be read first:

- [`docs/ZERO_REALITY_GUIDE.md`](../ZERO_REALITY_GUIDE.md)  
  Defines the deterministic posture, authority chain, layer separation, and success conditions.

- [`docs/ENGINE_CONTRACT_FREEZE.md`](../ENGINE_CONTRACT_FREEZE.md)  
  Defines the frozen public engine contract, evidence-chain rules, and canon lock policy.

- [`docs/ROADMAP_V1_BOUNDARY.md`](../ROADMAP_V1_BOUNDARY.md)  
  Defines what counts as ZË-RO v1.0 and what is explicitly post-v1.

## Supporting but non-constitutional reference

- [`docs/CHANGELOG.md`](../CHANGELOG.md)  
  Historical record of changes affecting determinism posture, contract shape, and canon/testing expectations.

## Candidate constitutional material still living outside this folder

The following existing repo docs contain constitutional material and may later be consolidated or promoted into this folder:

- `docs/milestones/CANONICAL_PRINCIPLES_OUTPUT_CONTRACT_v0.1.1.md`
- `docs/milestones/MIND_OBEYS_HEARTINSTRUMENT_SURFACE_MATH_v0.1.1.md`

## Status

This folder is being established as canonical structure.  
For now, this README acts as the constitution index and points to the current governing documents already present in the repo.
