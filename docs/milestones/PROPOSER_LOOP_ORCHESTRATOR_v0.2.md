# Milestone — PROPOSER_LOOP_ORCHESTRATOR v0.2

## Goal
Wire a server-side proposer that generates a Proposal JSON (LLM-style), runs the Verifier, and returns the full result bundle.

Pipeline: Propose → Parse/Sanitize → Verify → Return

Hard boundaries:
- Verifier stays NO LLM.
- V0.2 has NO retry loop. Fail = report why.
- CI-safe: mock provider by default; real provider behind env vars.

## API
- POST `/api/generate-roots`
- Body: `{ "word": string, "mode"?: "strict"|"open", "provider"?: "mock"|"openai_compat" }`

## Core files
- `src/shared/llm/prompts/rootProposer.v0.1.ts`
- `src/shared/llm/providers/proposerProvider.v0.2.ts`
- `src/shared/orchestrator/proposeOnce.v0.2.ts`
- `app/api/generate-roots/route.ts`

## Tests
- `tests/orchestrator/proposeOnce.v0.2.spec.ts` (mock provider → snapshot)

## DONE criteria
- `npm run gate:quick` passes
- endpoint works using provider=mock with no secrets
- proposal parser handles: raw JSON, fenced JSON, extra text around JSON
- verifier called + output returned
