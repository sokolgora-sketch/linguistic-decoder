# UI Telemetry Contract v0.1.1
## Adapter Lock + Missing-State Discipline

## Current Live Surface Status (2026-07)

This document is a historical milestone record.
It is not the complete current live-surface contract.

Current Open Instrument truth:

- The live user surface is `/chat`.
- `InstrumentPanel` is tabbed with top-level sections: `Overview`, `Evidence`, `Candidates`, `Roots / Meaning`, and `Advanced`.
- Raw JSON is audit/debug detail in `Advanced`, not the primary user surface.
- Any legacy left/right column wording below is historical milestone language.

This milestone does NOT add new features.
It hardens correctness of the existing UI Telemetry Instrument.

v0.1 established *what* may be shown.
v0.1.1 establishes *how correctness is enforced*.

---

## AUTHORITY (unchanged from v0.1)

UI AUTHORITY ORDER (highest → lowest):

1. evidence
2. heart (source only, never numeric authority)
3. deepRoot / candidates (hypotheses only)
4. raw (inspection only)

UI MUST NOT:
- Compute numeric values from heart
- Infer meaning from absence of evidence
- Promote candidates to authority

If a UI component violates this, it is incorrect even if it “looks helpful”.

---

## CORE ADDITION IN v0.1.1

### 1. Adapter Lock (NEW — REQUIRED)

The UI MUST consume engine output through a **single adapter layer**.

- The adapter output shape is **contractual**
- UI components MUST NOT read engine JSON directly
- Adapter output MUST be snapshot-locked by tests

If the adapter changes, tests must fail.

This prevents silent semantic drift.

---

### 2. Missing-State Discipline (NEW — REQUIRED)

For every field defined in v0.1:

If field is:
- **Present in evidence** → render value
- **Absent but known field** → render explicit absence
- **Not emitted by engine version** → render versioned message

Allowed messages (exact strings):

- "None emitted by engine vX.Y"
- "Not emitted by engine (yet)"

UI MUST NOT:
- Render empty panels
- Render decorative placeholders
- Guess or reconstruct values

Empty ≠ Error  
Empty = Measured absence

---

## VISUAL STATE RULES (STRICT)

Level meanings (unchanged):

- GREEN — Native emission (engine-derived)
- AMBER — Backfilled / derived WITH explicit signal
- GRAY — Not emitted by engine (yet)
- RED — Contract violation or error

Rules:
- No gradients
- No opacity tricks
- No creative color usage
- No additional levels

---

## SECTION BOUNDARIES (RE-ASSERTED)

### READOUT PANEL
- Shows: what ran + what was detected
- Zero interpretation

### EVIDENCE / OPS LEDGER
- Shows: why output occurred
- No summaries, no opinions

### CANDIDATES
- Shows: hypothesis space only
- Must be visually non-authoritative
- No ranking, no scoring, no implication of correctness

### MATH & LENSES
- Shows only emitted telemetry
- Never computed client-side

### RAW JSON (historical slot)
- Inspection only
- Never required for understanding

If a section crosses its boundary, it is wrong.

---

## TEST REQUIREMENTS (NEW)

This milestone is NOT complete until:

1. Adapter output is snapshot-locked
2. Missing fields render explicit absence text
3. UI tests fail if a field disappears silently
4. No UI component reads engine JSON directly

---

## PROCESS RULES (MANDATORY)

- Exactly one dev process
- No parallel preview servers during contract validation
- If jq ever reports “Invalid numeric literal”:
  - First action: `ps aux | grep next`
  - Kill duplicate servers before debugging JSON

---

## DEFINITION OF DONE

v0.1.1 is DONE when:
- Adapter snapshot tests pass
- UI renders explicit absence everywhere
- Refactors cannot change meaning without breaking tests

This is what upgrades the UI from “viewer” to “scientific instrument”.
