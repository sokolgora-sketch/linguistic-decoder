# Milestone: UI Scientific Instrument Skin v0.1.1

Goal: apply a consistent “scientific instrument” skin to the Instrument UI without changing engine outputs.
Rule: VM-only rendering; no raw payload access in UI. Truth-posture must remain explicit (present/none/missing).

## Scope (v0.1.1)
- Instrument page layout: stable two-column scaffold (controls + telemetry stream).
- Card skin: border, background, spacing, typography.
- Density rules: compact, readable; evidence lists show counts + preview.
- No micro-graphs in PR1 (layout + tokens only). Micro-graphs come in PR2+.

## DONE criteria
### Visual / UX
- Two-column layout does not collapse awkwardly at typical widths (>= 1024px).
- Telemetry panels use a consistent card style (border/bg/padding).
- Titles, labels, values use consistent typography (labels vs values).
- No panel renders “blank”: if missing, shows missing(...) text.

### Engineering
- `npm run gate:quick` passes.
- No violations of VM-only guardrails (existing tests remain green).
- No new raw payload access in render paths.

## Proof
- CI: gate:quick green on PR.
- Manual: screenshot set for /chat Instrument view:
  - word=study (strict)
  - word=damage (strict)
