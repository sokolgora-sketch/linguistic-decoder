# Milestone — Brain Retry/Revise Loop v0.3 (bounded)

## Goal
Given `{word, mode}`, run a bounded loop:
`propose → verify → revise` up to `maxAttempts`, returning a fully auditable trace.

## API
- `POST /api/propose-loop`
- Body: `{ "word": string, "mode"?: "strict"|"open", "maxAttempts"?: number, "provider"?: "mock"|"openai_compat" }`

## Core
- `src/shared/orchestrator/proposeLoop.v0.3.ts`
- `src/shared/orchestrator/proposalParse.v0.2.ts`
- `src/shared/llm/prompts/rootProposer.v0.2.ts`
- v0.2 wiring updates:
  - `src/shared/llm/providers/proposerProvider.v0.2.ts`
  - `src/shared/orchestrator/proposeOnce.v0.2.ts`

## Tests
- `tests/orchestrator/proposeLoop.stubbed.v0.3.spec.ts` (retry parse→fail→pass + cacheHit)
- `tests/orchestrator/noEngineImports.guard.v0.3.spec.ts` (no engine internals in orchestrator layer)
- `tests/llm/rootProposer.v0.2.prompt.snapshot.spec.ts` (+ snapshot)

## DONE criteria
- `npm run gate:quick` passes
- Loop returns PASS/FAIL with auditable trace
- FAIL attempts include stable-ordered reasons derived from verifier checks
- Stops early on PASS
- Cache toggles `cacheHit` correctly (in-memory Map v0.3)
- No direct imports of engine internals in orchestrator/LLM layer
