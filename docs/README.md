# ZË-RO Docs Index

This `docs/` tree is the human-readable documentation layer for the ZË-RO repository.

## Purpose

The repo should make three things clear:

1. what ZË-RO is  
2. what is stable  
3. what is current research or milestone work  

Docs are part of the contract surface.  
If something matters, it should live here and be reviewable via PR.

## Authority & Stability

### Authoritative (Locked)
- Reality Guide — defines epistemic posture and limits.
- Recovery / contract rules — define how engine truth is repaired or protected.
- Engine contract freezes — define stable public shapes.
- Canon snapshots / baselines — changes require explicit rationale and review.

### Evolving (Allowed to Change)
- UI / visualizations
- explanatory copy
- milestone planning
- eval summaries
- research notes
- pattern expansion that does not rewrite locked rules

### Explicitly Not Authoritative
- temporary experiments
- loose exploratory output
- generated placeholders
- abandoned drafts
- external commentary

If something conflicts with the Reality Guide or a frozen engine contract, it is wrong by definition.

## Folder guide

### `docs/constitution/`
Stable governing rules of the instrument.

Use this for:
- constitutional constraints
- authority-chain rules
- stable contract principles
- machine-stable vs presentation-only distinctions

### `docs/evals/`
Generated evaluation summaries and comparison documents tied to the eval harness.

### `docs/research/`
Research notes and paper-style outputs.

Use this for:
- evaluation notes
- battery summaries
- comparative findings
- controlled experiments

### `docs/ui/`
UI-facing contracts and instrument rendering rules.

Use this for:
- UI telemetry contract docs
- instrument rendering / adapter discipline
- UI safety / UI-specific contract rules

### `docs/validation/`
Validation-facing reports, canon diffs, and baseline/current artifact checks.

Use this for:
- latest validation reports
- canon diff reports
- baseline vs current artifact inspection
- drift / regression checkpoints

### `docs/canon/`
Canon-battery specs and deterministic small-battery drift references.

Use this for:
- canon battery specs
- train / holdout canon references
- canon-specific diff expectations
- deterministic small-battery regression tripwires

### `docs/contracts/`
Achieved or locked contract-facing reference records.

Use this for:
- achieved contract records
- locked done-state contract references
- contract-facing proof records preserved outside milestone prose

### `docs/milestones/`
Implementation milestones, frozen milestone notes, and delivery checkpoints.

### `docs/archive/`
Historical or superseded docs kept for reference but no longer treated as canonical.

## Core reference points

- [v1.0 Boundary](./ROADMAP_V1_BOUNDARY.md)
- [Engine Contract Freeze](./ENGINE_CONTRACT_FREEZE.md)
- [Reality Guide v1](./ZERO_REALITY_GUIDE.md)
- [Recovery Playbook](./RECOVERY.md)
- [CHANGELOG](./CHANGELOG.md)

## Current cleanup direction

This docs tree is being cleaned so that:

- constitutional truth lives in `docs/constitution/`
- research notes live in `docs/research/`
- generated eval summaries live in `docs/evals/`
- milestone delivery history stays in `docs/milestones/`
- historical drafts move to `docs/archive/`

## Current canonical reading order

At this stage, the repo should be read in this order:

1. `README.md`
2. `docs/README.md`
3. `docs/constitution/README.md`
4. core reference docs (`ROADMAP_V1_BOUNDARY.md`, `ENGINE_CONTRACT_FREEZE.md`, `ZERO_REALITY_GUIDE.md`, `RECOVERY.md`)
5. `docs/evals/`
6. `docs/milestones/` as implementation history
7. `docs/archive/` only when historical context is needed
