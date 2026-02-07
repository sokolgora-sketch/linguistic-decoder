# Verifier API Surface Parity v0.1.1 — DONE criteria

This milestone is **DONE** when all of the following hold.

## Behavioral parity

- Verifier surface packet uses **v1-parity basis normalization** (trim → collapse whitespace → first token → Unicode NFKC → lowercase, preserving diacritics like `ë`).
- Verifier vowel extraction is **SevenVowel-typed** and applies **strict terminal Y hint** (mode-dependent), matching engine surface behavior.
- `principlesPath` is derived via `PRINCIPLE_MAP` (not raw vowels).
- `math7` surface packet is computed via `computeMath7` and includes `events` + `jumps` (parity with engine math7 reporting).

## Decoupling / bundling safety

- `/api/verify-proposal` must **NOT** pull in engine modules (especially `analyzeWordV1` / DeepRoot).
- `src/shared/verifier/verifyProposal.v0.1.ts` must have **no imports from** `src/v1/analyzeWordV1` (or other engine entry points).

## Proof (tests + build)

All must pass:

- Unit: `npm test -- tests/verifier/verifyProposal.v0.1.spec.ts`
- Gold corpus: `npm test -- tests/verifier/verifyProposal.corpus.gold.v0.1.spec.ts`
- Full gate: `npm run gate:quick`
- Production build: `npm run build`

## Evidence (merged)

- PR #384 merged to `main`
- `main` at commit `866969b`
