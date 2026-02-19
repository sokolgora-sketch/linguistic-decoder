# DONE: VectorDelta (Geometry) v0.1

Merged via: PR #TBD

## Shipped
- SSOT 7-voice axial coords + ring radius:
  - `src/shared/geometry/voiceCoordsHex.v0.1.ts`
- Deterministic VectorDelta path summary:
  - `src/shared/geometry/vectorDeltaSummary.v0.1.ts`

## Locked by tests
- Coords doctrine + full distance matrix:
  - `tests/geometry/voiceCoordsHex.v0.1.lock.spec.ts`
- VectorDelta behavior + lock:
  - `tests/geometry/vectorDeltaSummary.v0.1.spec.ts`
  - `tests/geometry/vectorDeltaSummary.v0.1.lock.spec.ts`

## Gate
- `npm run gate:quick` (lint + full test pass)

## Notes
This milestone intentionally avoids audio science (Hz/formants) and proves geometry stability purely from SSOT vowel paths (mask/carrier inputs upstream).
