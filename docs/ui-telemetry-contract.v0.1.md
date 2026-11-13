# UI Telemetry Contract v0.1 — Scientific Instrument UI

Status: LOCK TARGET (v0.1)
Scope: ZË-RO UI telemetry only (VM readouts derived from the engine contract)

## 1) Purpose
The UI is a scientific instrument:
- It renders read-only telemetry derived from the engine output contract.
- It does not “improve” the engine output.
- It does not infer origins, certainty, or narrative meaning.

## 2) Authority Chain (Non-Negotiable)
1. Engine JSON contract (adapter input)
2. ContractAdapter (validation + normalization)
3. ViewModel (VM) derived from adapter output only
4. UI renders from VM only

The UI must never read `raw` payload evidence directly.
The UI must never compute new “meaning” from raw data.

## 3) What UI Telemetry IS
Telemetry is:
- Deterministic readouts (same input JSON → same VM → same UI)
- Transparent about ambiguity (if uncertain, UI shows “unknown / ambiguous”)
- Traceable to contract fields (every UI value has a contract origin)

## 4) What UI Telemetry IS NOT (Hard Prohibitions)
The UI must never:
- Crown a single “winner” candidate
- Rank candidates (“best”, “most likely”, “top 1”, etc.)
- Beautify uncertainty into certainty (“this IS the origin”)
- Invent confidence or truth-claims not present in VM
- Hide ambiguity that exists in VM
- Collapse multiple candidates into a single narrative answer

## 5) Allowed Telemetry Outputs (Read-only)
The UI may display:
- Contract meta: engine version, mode, timestamps if present
- Gate observability: gate ids, active/inactive, reasons/notes if present
- Ledger-style readouts: counts, status, validation flags
- Candidate list: language/form/decomposition/functional statements (as provided)
- Evidence references: ids/refs that point to engine evidence (no raw payload rendering)

Rule: If a field is not present in the VM, it must not appear in the UI.

## 6) Determinism Rules
- No random ordering (stable sort only if defined by VM)
- No UI-only heuristics that change output meaning
- No “helpful summaries” that rewrite semantics

## 7) Versioning / Change Control
This document is the v0.1 contract for telemetry behavior.
Any change to:
- VM field meanings
- UI semantics (what the UI *means*)
- disallowed/allowed output categories
requires a contract bump (v0.1 → v0.2) and updated tests.

## 8) Definition of Done (v0.1)
v0.1 is closed when:
1) This contract file exists.
2) A guardrail test enforces instrument rules (no winner/ranking/beautification).
3) The repo is tagged: `ui-telemetry-contract-v0.1`.
