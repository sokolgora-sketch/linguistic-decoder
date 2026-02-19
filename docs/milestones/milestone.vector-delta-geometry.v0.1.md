# Milestone: VectorDelta (Geometry) v0.1 — SSOT vowel-geometry over mask + carrier

## Goal
Prove (deterministically, in-engine) that even when spelling (mask) and IPA (carrier) differ, the **7-voice movement geometry** is a stable, inspectable invariant.

> Different surfaces. Same instrument.  
> Expressed as math over {A,E,I,O,U,Y,Ë} paths, not audio science.

## Deliverables

### 1) SSOT 7-voice coordinates (integer geometry)
Add a single source of truth for coordinates and ring radius:

- `src/shared/geometry/voiceCoordsHex.v0.1.ts`

Requirements:
- deterministic, integer-only coords
- includes:
  - `voiceToAxial(v): { q: number; r: number }`
  - `voiceRadius(v): 0|1|2|3` (O=0, I/U=1, E/Y=2, A/Ë=3)
  - `hexDistance(a,b): number` using axial hex distance

Coordinate doctrine (axial coords, integer):
- O = (0, 0)
- Inner ring (radius 1): I, U
- Middle ring (radius 2): E, Y
- Outer ring (radius 3): A, Ë

(Exact placement must be locked by tests; do not “improvise” later.)

### 2) VectorDelta summary
Add:

- `src/shared/geometry/vectorDeltaSummary.v0.1.ts`

Input:
- `path: VowelVoice[]`

Output:
- per-step deltas:
  - from/to
  - `dist` (hex distance)
  - `radialDelta` (radius(to)-radius(from))
  - `turnKind: "inward"|"outward"|"circular"`
- totals:
  - `totalDist`
  - `netRadial`
  - counts: inward/outward/circular
- stable `signature` string for debug/UX

Constraints:
- must be deterministic
- no floats in logic (only integer operations)
- safe defaults: empty/length<2 returns zeroed summary

### 3) Tests (the “proof”)
Add:
- `tests/geometry/vectorDeltaSummary.v0.1.spec.ts` (behavior tests)
- `tests/geometry/vectorDeltaSummary.v0.1.lock.spec.ts` (snapshot lock)

Minimum locked cases (small + defendable):
- single step cases across rings (e.g., O→A, I→Ë)
- circular-only movement example (same radius)
- mask vs carrier example (hand-curated) where surfaces differ but geometry is comparable

## DONE criteria (non-negotiable)
- [ ] New SSOT coords module exists and is used by VectorDelta (no duplicate mappings)
- [ ] VectorDelta summary module exists + fully deterministic
- [ ] Lock snapshot exists and is stable
- [ ] `npm run gate:quick` green
- [ ] PR merged; then add `docs/milestones/milestone.vector-delta-geometry.v0.1.DONE.md`
