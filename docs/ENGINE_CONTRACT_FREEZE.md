# Engine Contract Freeze — analyzeWordV1 (v1)

This document freezes the **public engine contract** for ZË-RO v1.

If something conflicts with this document, the Reality Guide, or the Recovery Playbook,
it is wrong by definition.

---

## 1) Frozen entrypoint

**Stable API/engine entrypoint:**
- `analyzeWordV1(word, mode)`

**Modes:**
- `strict` is contract-critical and regression-locked.
- `open/loose` (if present) is not contract-critical unless explicitly stated otherwise.

---

## 2) Contract-locked JSON (shape-level)

The following **top-level keys must exist** in `analyzeWordV1` output, and their meanings are fixed:

- `word` — the analyzed basis (exact string or sanitized basis), plus any normalizations the engine claims.
- `mode` — engine mode used for this run.
- `engine_meta` — version + determinism + contract identifiers.
- `sevenVoices` (or equivalent “surface/heart” block) — surface vowel evidence and derived math/path.
- `candidates` — multi-candidate list (no single crowned winner).
- `deepRoot` — passing candidates only, no scores/ranks; includes functional proto-root analysis after Heart layer.

Notes:
- Field **names** are contract unless explicitly tagged as experimental.
- Additional fields may be added **only** if they are:
  - strictly additive (no breaking changes),
  - deterministic,
  - and default to `null` when unavailable.

---

## 3) Evidence chain must not split

Non-negotiable:
- **Math7 and PrinciplesPath are computed from the same vowel evidence the engine claims** for that layer.
- Surface evidence must reflect literal extracted vowels (A,E,I,O,U,Y,Ë only; Unicode NFC normalized).

Candidate layer may differ only with explicit ops, and must carry its own:
- candidate vowels
- candidate principles path
- candidate math7
- ops list

---

## 4) Canon lock policy (tests)

Canon words are regression-locked by snapshots.

Policy:
- No silent changes.
- Any change to canon output requires:
  1) explicit rationale in PR,
  2) **engine version bump** (or an explicit contract version lever),
  3) intentional snapshot update.

---

## 5) What may evolve without version bump

Allowed without bump (if deterministic and shape-stable):
- UI presentation and layout
- explanatory copy / narrative text (non-contract)
- documentation
- adding new non-canon words
- adding new Pattern Atlas entries (additive only)

Not allowed without bump:
- changing frozen field names/meanings
- changing canon outputs
- changing determinism controls
- changing evidence chain behavior

---

## 6) Experimental fields convention

Experimental fields must be:
- explicitly marked as experimental in docs and/or code comments
- nullable by default
- not required by tests unless promoted into the contract

