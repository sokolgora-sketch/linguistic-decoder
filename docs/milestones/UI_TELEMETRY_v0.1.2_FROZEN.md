# UI Telemetry v0.1.2 — FROZEN

Date: 2026-01-16  
Status: FROZEN (no breaking changes without v0.1.3+)

## What is frozen
UI Telemetry v0.1.2 is locked as the contract between:
- `/api/analyze-v1` route output (telemetry/debug blocks)
- UI Telemetry VM adapter + Scientific Instrument UI

### Stable meanings
Missing telemetry is reported via:
- `MissingState = "none" | "not_emitted" | "malformed" | "unknown"`

### Stable route-provided blocks (top-level)
`/api/analyze-v1` MUST include (when available) the following stable blocks:
- `evidence`
- `originClaimGates`
- `raw`
- `heartInstrumentV1`

Route enforcement:
- The final response is validated via `toAnalyzeWordResultV1Contract(final)` (GET + POST).
- Contract enforcement is a hard gate (500 on failure).

## Rules for future changes
- Additive changes are allowed only if fully backward-compatible.
- Any breaking change requires a version bump (v0.1.3+ or v0.2.0) plus explicit migration notes + tests.