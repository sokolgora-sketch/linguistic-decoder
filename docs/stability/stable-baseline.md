# ZË-RO Stable Baseline

## Tag
zro-stable-baseline-__DATE__

## Commit
__SHA__

## Proof gates (must pass on this commit)
- npm run gate:quick
- npm run build

## Why this baseline exists
This tag is the known-good rollback point for the ZË-RO Stability Program.
If anything destabilizes tests/build/VM integrity, we can return here.

## Canonical Source-of-Truth Entry Points

### Engine (analysis)
- API route: `app/api/analyze-v1/route.ts`
- Engine adapter entry: `src/shared/analysisAdapter.ts`
- Contract(s): `src/shared/analysisResult.v1.contract.ts` (and related contract modules)

### Telemetry VM (UI truth source)
- VM adapter: `src/ui/instrument/contractAdapter.ts`
- VM types: `src/ui/telemetry/types.ts`
- Instrument panel root (VM-only policy surface): `src/ui/instrument/InstrumentPanel.tsx`

## Semantics locked in this baseline (important)
- Dual-stream evidence semantics:
  - `evidence.surfaceVowelsRaw` = raw surface vowel stream
  - `evidence.surfaceVowels` = functional/detected stream
  - `evidence.vowelPath` = legacy duplicate of functional stream (kept for compatibility)
- Telemetry VM precedence:
  - Surface path = `surfaceVowelsRaw` → fallback `heartInstrumentV1.surfaceVowels` → fallback legacy `vp.surface`
  - Functional path = `surfaceVowels` → fallback `vowelPath` → fallback legacy `vp.functional`

## Notes
- If future work changes outputs, it must be:
  - versioned (engineVersion bump), and/or
  - backed by updated gold tests and written rationale.
