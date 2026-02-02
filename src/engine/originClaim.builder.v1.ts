// src/engine/originClaim.builder.v1.ts
//
// Single-source policy:
// The engine layer must NOT implement OriginClaim logic.
// It re-exports the shared builder to prevent drift.

export { buildOriginClaimV1 } from "@/shared/originClaim.builder.v1";
