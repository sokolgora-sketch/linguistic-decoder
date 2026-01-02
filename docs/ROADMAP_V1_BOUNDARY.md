# ZË-RO v1.0 Boundary (Cut)

This document defines what counts as **ZË-RO v1.0** and what is explicitly **post-v1**.

If something conflicts with this, the Engine Contract Freeze, the Reality Guide, or the Recovery Playbook,
it is wrong by definition.

---

## 1) v1.0 Goal (Definition of Done)

ZË-RO v1.0 is complete when:

- `analyzeWordV1` contract is frozen and stable (shape + determinism).
- Canon words are snapshotted and gated (strict mode).
- Evidence chain is coherent: basis → vowels → principlesPath → math7 (no split-brain).
- DeepRoot produces multi-candidate outputs (no single crowned winner), with functional proto-root analysis.
- Pattern Atlas v1 is present as a static table and is used deterministically (if shown in UI, must be marked experimental unless contract-promoted).
- CI gates remain green with PR-only workflow.

---

## 2) In Scope for v1.0

### Engine
- Deterministic `analyzeWordV1` with strict mode as primary.
- Surface evidence block (vowels/path + math7 + principlesPath).
- Candidate layer with explicit ops and candidate-level evidence (vowels/path + math7 + principlesPath).
- DeepRoot: passing candidates only; no scores/ranks; functional statement required.

### Tests
- Contract shape locks + invariants tests.
- Canon battery snapshots for selected words (strict).
- No silent changes policy (version bump + rationale required).

### UI
- Single-word analysis UI that renders the contract output.
- UI may evolve, but must not mutate contract semantics.

---

## 3) Out of Scope (Explicitly Post-v1)

These do not ship as part of v1.0:

- “Heart-7 desktop manager / OS” concepts
- Seven-Voices chess/game prototypes
- Kids voice game
- Any U&AI / Trust Points / blockchain / UTC integration
- “Mythic narrative mode” inside the app (beyond optional copy)
- Non-deterministic LLM behavior or training loops
- Large multi-word documents / paragraph analysis

---

## 4) Post-v1 Branching Policy

After v1.0 is tagged:

- All new work happens on feature branches.
- Any change that affects canon outputs or contract fields requires:
  - explicit version bump,
  - snapshot updates,
  - doc update (Contract Freeze + Changelog).

Recommended long-lived branches after v1:
- `release/v1` (hotfixes only; contract-respecting)
- `develop` (optional; only if you want parallel feature streams)

---

## 5) v1.0 Tag Checklist (When ready)

- main is clean and green
- latest PRs merged
- `npm run gate:quick` passes
- canon snapshots unchanged
- docs: Reality + Recovery + Contract Freeze + v1 Boundary all present

Then tag:
- `v1.0.0`
