# Milestone: Mind obeys HeartInstrumentV1 surface math v0.1.1 — DONE

## Goal
Ensure `mind.dominantPrinciple*` is derived from **HeartInstrumentV1 surface math** (prism output),
not from normalized/secondary math layers.

**Rule:** Mind without Heart is hallucination. Heart is the instrument truth.

## Scope
- `/api/analyze-v1` GET + POST final response construction:
  - after `heartInstrumentV1` is attached to `final`
  - before `toAnalyzeWordResultV1Contract(final)` projection/validation

## Implementation (contract-safe)
- `app/api/analyze-v1/route.ts`
  - `overrideMindFromHeartInstrumentV1(final)` reads:
    - `final.heartInstrumentV1.surfaceMath7.total1to7`
  - maps `total1to7 -> PrincipleId` via `idFromTotal1to7`
  - uses `normalizePrinciplesToLabels([id])` only for labels
  - sets:
    - `mind.dominantPrincipleId`
    - `mind.dominantPrincipleLabel`
    - `mind.dominantPrinciple` (back-compat alias)
    - `mind.patternName`
    - `mind.logicStatement`

## Proof / Tests
- `npm run gate:quick` ✅
- GET + POST sanity (study / strict):
  - `surface total1to7 = 4` (BALANCE)
  - `normalized total1to7 = 7` (EVOLUTION)
  - **mind must output BALANCE**, not EVOLUTION

## DONE Criteria
- `npm run gate:quick` passes on main.
- GET + POST both produce:
  - `mind.dominantPrincipleId === "BALANCE"` for `study` strict
  - when `heartInstrumentV1.surfaceMath7.total1to7 === 4`
- Override is applied exactly once per handler after `final` is constructed and before contract projection.

## Notes
This is a contract-facing semantic preference: when Heart and normalized layers disagree,
Mind aligns to HeartInstrumentV1 surface math.
