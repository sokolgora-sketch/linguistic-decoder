# DeepRoot–Heart Alignment Gate v0.1 — DONE Criteria (Deterministic)

Purpose: prevent DeepRoot functional claims from drifting away from Heart’s primary voice path.

v0.1 gate logic is intentionally minimal:
- Compare terminal vowel of Heart primary path vs DeepRoot functional path.
- If mismatch => misaligned.
- If missing paths => insufficient_data.

## What counts as DONE

### 1) Gate contract + deterministic compute exist
- Contract: `src/shared/deepRootHeartGate.v0.1.ts`
- Compute: `src/shared/deepRootHeartGate.v0.1.compute.ts`

### 2) OriginClaim policy decision exists (strict vs loose)
- Policy: `src/shared/originClaim.deepRootHeartGatePolicy.v0.1.ts`

### 3) Gate is wired into OriginClaim builder
- Builder: `src/shared/originClaim.builder.v1.ts`
  - uses `computeDeepRootHeartGateV01`
  - applies `decideDeepRootHeartGatePolicyV01`

### 4) UI/Telemetry exposes the gate (VM-only)
Evidence already exists via:
- Telemetry contract snapshots mention `deepRootHeartGate`
- Instrument + candidates UI tests render from VM

## Proof (tests to run)

```bash
npm test -- tests/gates/deepRootHeartGate.compute.v0.1.spec.ts
npm test -- tests/gates/deepRootHeartGate.policy.v0.1.spec.ts
npm test -- tests/originClaim.deepRootHeartGate.policy.v0.1.spec.ts
npm test -- tests/ui.instrument.deepRootHeartGate.vm.spec.ts
npm test -- tests/ui.instrument.deepRootHeartGate.summaryCard.spec.tsx
npm test -- tests/ui.telemetry.deepRootHeartGate.fallback.v0.1.spec.ts
npm test -- tests/ui.candidates.deepRootHeartGate.rendersFromVM.spec.tsx

