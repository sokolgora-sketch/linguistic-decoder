# Milestone — Verifier API v0.1 (NO LLM)

## Goal
Expose a deterministic API that accepts a Proposal JSON (LLM-style candidates) and returns:
- per-candidate pass/fail
- explicit check IDs + reasons
- minimal surface packet (basis + vowels + math7 stub)

Hard boundary: **no model calls**.

## API
- `POST /api/verify-proposal`

## Core
- `src/shared/verifier/verifyProposal.v0.1.ts`
- `src/shared/verifier/verifierRules.v0.1.ts`

## Checks (v0.1)
- `OPS_ALLOWED` — all opsUsed tokens must be AllowedOpId
- `DECOMP_PRESENT` — at least one of action/instrument/unit/statement exists
- `PATH_MATCH` — only if proposal provides vowelPath

## Tests
- `tests/verifier/verifyProposal.v0.1.spec.ts` (snapshot + illegal ops rejection)

## DONE criteria
- `npm run gate:quick` passes
- illegal ops are rejected deterministically (test proves it)
- no LLM calls in verifier path
