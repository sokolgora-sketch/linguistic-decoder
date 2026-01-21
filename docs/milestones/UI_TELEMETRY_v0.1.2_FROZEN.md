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

## Milestone B — Auditable surface vs normalized vowels (DONE)

Goal: `/api/analyze-v1` must expose **both**:
- the true raw surface vowel sequence, and
- the functional (normalized) vowel path,
plus a deterministic proof record when they differ.

### Required evidence fields (stable)

- `evidence.surfaceVowels`: **true surface vowels** (source of truth: `heartInstrumentV1.surfaceVowels`)
- `evidence.vowelPath`: **functional vowel path** (source of truth: `heart.math7.primary.vowels`)
- `evidence.normalizationSteps`: deterministic proof records, emitted only when `surfaceVowels !== vowelPath`

### Example (study, strict)

- `heartInstrumentV1.surfaceVowels = ["U","Y"]`
- `evidence.surfaceVowels = ["U","Y"]`
- `evidence.vowelPath = ["U","I"]`
- `evidence.normalizationSteps = [{ op:"vowel_normalize", from:"UY", to:"UI", reason:"functional_equivalence" }]`

### Enforcement (locked by tests)

- Route wiring: `app/api/analyze-v1/route.ts` reconciles evidence after `backfillEvidenceMath7(...)`.
- Unit lock: `tests/apiAnalyzeV1.evidence.wired.unit.spec.ts` asserts:
  - `evidence.surfaceVowels === heartInstrumentV1.surfaceVowels`
  - `evidence.vowelPath === ["U","I"]` for `study`
  - `normalizationSteps` emits the proof record `UY → UI`


## Rules for future changes
- Additive changes are allowed only if fully backward-compatible.
- Any breaking change requires a version bump (v0.1.3+ or v0.2.0) plus explicit migration notes + tests.
