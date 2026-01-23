# UI Telemetry Contract v0.1 — DONE Criteria

This is a contract (definition of done), not a task list.  
Phase 1 = telemetry correctness. No styling. No new engine meaning logic.

## 1) Scope Lock (Non-Negotiable)
- [ ] UI renders only data emitted by engine JSON / Telemetry VM
- [ ] UI never invents: ops, decompositions, archetypes, functional meaning
- [ ] Missing fields render explicitly as: “Not emitted by engine vX.Y.Z”
- [ ] No engine logic modified in this milestone

## 2) Section Order (Must Match Exactly)
Primary results order is fixed:
1. READOUT (always visible)
2. COUNTS / RATIOS (telemetry only)
3. EVIDENCE LEDGER (falsifiable log)
4. CANDIDATES
5. MATH / LENSES (optional telemetry)
6. RAW JSON (collapsed)

Deviation = not done.

## 3) READOUT — Required Fields
READOUT must always render and include:
- [ ] word
- [ ] normalizedWord
- [ ] mode (strict/open)
- [ ] strictInput (true/false)
- [ ] engineVersion
- [ ] contract stamp (or contractVersion)
- [ ] voicePath (or “none”)
- [ ] status badge (Detected/None/Diverge)
- [ ] counts: candidates, ops (if emitted), notes (if emitted), signals (if emitted)
- [ ] buttons: Copy Summary, Copy Full JSON

## 4) COUNTS / RATIOS (Telemetry Only)
Render only if present in JSON:
- [ ] vowelCount / consonantCount (if present)
- [ ] math7 summaries (if emitted)
- [ ] spectral counts / L (if emitted)
- [ ] oscillation/delta fields (if emitted)
If none exist:
- [ ] section hidden OR explicitly marked “Not emitted”

## 5) EVIDENCE LEDGER (Falsifiable Log)
- [ ] normalization steps (ordered, verbatim)
- [ ] ops/transforms list OR “None emitted by engine”
- [ ] signals/notes list OR “None emitted”
- [ ] rejections (if emitted)
- [ ] each subsection shows source label: `source: vm.evidence.X`

## 6) CANDIDATES (Deterministic)
Per candidate collapsed:
- [ ] language + form
- [ ] one-line functional statement (if present)
- [ ] vowel path mini
- [ ] gate status (pass/fail/aligned) (if present)
Expanded:
- [ ] decomposition (if present)
- [ ] ops (if present)
- [ ] notes (if present)
- [ ] Copy Candidate JSON
Global rules:
- [ ] stable ordering (no hidden scoring)
- [ ] no “winner” language
- [ ] empty list is valid and intentional

## 7) MATH / LENSES (Optional Telemetry)
- [ ] only render lenses that exist
- [ ] missing lenses show “Not available in this engine version”
- [ ] lenses do not affect truth/gating in v0.1

## 8) RAW JSON
- [ ] collapsed by default
- [ ] explicitly labeled “Raw Engine JSON”
- [ ] copy button
- [ ] never the default view

## 9) Acceptance Proof (Must Pass Visibly)
UI must visibly behave correctly for:
- [ ] xyz (strict): no voice path, no candidates, math hidden/not computed
- [ ] yë (strict): Y→Ë behavior shown; deterministic output
- [ ] study (strict): detected path + telemetry visible
- [ ] damage (strict): detected path + telemetry visible

Screenshots or recorded confirmation required.

## 10) DONE Definition
Phase 1 is DONE only when:
- [ ] all sections render deterministically
- [ ] missing data states are explicit (not “blank” or implied)
- [ ] acceptance words behave correctly
- [ ] no styling work included
- [ ] tests are green
- [ ] this document is committed
