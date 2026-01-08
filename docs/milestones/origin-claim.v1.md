# Milestone — Origin Claim Protocol v1 (Computed + Auditable + Deterministic)

## What shipped
- `originClaim` exists in AnalysisResult and is computed server-side.
- UI renders `OriginClaimCard` from the VM only (no raw payload access).
- Gold fixtures for `originClaim` updated and locked.
- Snapshot stability: time-varying `generatedAt` is normalized in snapshot tests.

## Determinism posture
- No randomness; claim output is derived only from the current result layers.
- Claim does **not** crown a single winner (policy: `no_single_winner`).
- When evidence is insufficient, output is `insufficient_evidence` with an explicit note.

## Verification
- `npm run gate:quick` must pass.
- `npm run build` must pass.
- `/api/analyze-v1?word=study&mode=strict` returns `originClaim`.
- Instrument Panel renders `OriginClaim` card correctly.

## Next (v1.1 target)
- Define computed selection rules for passing candidates:
  - explicit eligibility gates
  - explicit reason codes for inclusion/exclusion
  - stable ordering rules
