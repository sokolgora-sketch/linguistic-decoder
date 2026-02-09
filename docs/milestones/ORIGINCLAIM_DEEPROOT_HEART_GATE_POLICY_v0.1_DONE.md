# OriginClaim ← DeepRoot–Heart Gate Policy v0.1 — DONE

## Purpose
Make the DeepRoot–Heart alignment gate influence **OriginClaim** in a deterministic, documented way.

This is *policy*, not a heuristic:
- same inputs → same decision
- no probabilistic scoring
- auditable via reason codes and tests

## Policy (v0.1)
Interpreting `DeepRootHeartGateV01.status`:

- `aligned` → **ALLOW**
- `misaligned` →
  - **BLOCK** when `strictMediumPlus` is true (hard gate)
  - **WARN** otherwise (soft gate)
- `insufficient` / missing / unknown → **WARN** (never hard-block in v0.1)

Implementation lives in:
- `src/shared/originClaim.deepRootHeartGatePolicy.v0.1.ts`

Wiring (OriginClaim builder uses the policy decision):
- `src/shared/originClaim.builder.v1.ts`

## Proof (tests)
Run as the proof set:
- `tests/originClaim.deeprootHeartGate.strictPolicy.v0.1.spec.ts`
- `tests/originClaim.deepRootHeartGate.policy.v0.1.spec.ts`
