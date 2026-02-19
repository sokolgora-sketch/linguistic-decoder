# Milestone: DeepRoot–Heart Alignment Gate v0.1 — DONE

## Goal
Deterministic, adapter-safe alignment check between Heart primary path and DeepRoot/candidate functional path at the terminal vowel.

## Contract
- src/shared/deepRootHeartGate.v0.1.ts
  - status: aligned | misaligned | insufficient_data
  - reasonCodes:
    - HEART_PRIMARY_PATH_MISSING
    - DEEPROOT_FUNCTIONAL_PATH_MISSING
    - TERMINAL_VOWEL_CONFLICT
  - evidenceRefs: stable strings

## Compute
- src/shared/deepRootHeartGate.v0.1.compute.ts
  - accepts U→I, U->I, U-I
  - stable uniq evidenceRefs

## Policy (OriginClaim)
- src/shared/originClaim.deepRootHeartGatePolicy.v0.1.ts
  - aligned => allow
  - misaligned => strict: block (caps medium+), loose: warn
  - insufficient/missing => warn (never hard-cap on missing data)

## Wiring
- OriginClaim: src/shared/originClaim.builder.v1.ts (per-candidate gate)
- UI adapter: src/ui/instrument/contractAdapter.ts (per-candidate gate in VM)

## Tests proving DONE
- tests/originClaim.deepRootHeartGate.policy.v0.1.spec.ts
- tests/originClaim.deeprootHeartGate.strictPolicy.v0.1.spec.ts
- tests/ui.instrument.deepRootHeartGate.vm.spec.ts
- tests/ui.telemetry.deepRootHeartGate.fallback.v0.1.spec.ts
