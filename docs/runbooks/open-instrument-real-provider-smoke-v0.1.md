# Open Instrument Real Provider Smoke Runbook v0.1

Status: readiness only.  
Scope: local/manual smoke only.  
Default provider remains `mock`.

## Purpose

This runbook describes how to safely smoke-test the Open Instrument proposer path with a real OpenAI-compatible provider after Phase 2 verifier hardening.

The real-provider path must not be enabled by default. It must remain explicit and local.

## Current contract

The proposer output must satisfy the Phase 2 verifier contract:

- candidate `form`
- candidate `language`
- `opsUsed`
- `decomposition.action`, `decomposition.instrument`, or `decomposition.unit`
- optional `decomposition.statement`
- optional `vowelPath`

`statement` alone is insufficient.

Verifier checks currently include:

- `OPS_ALLOWED`
- `DECOMP_PRESENT`
- `PATH_MATCH`
- `LANG_KNOWN`
- `ROOT_HAS_VOWEL`
- `FUNCTION_FIT_NONEMPTY`

## Safety rules

- Do not commit secrets.
- Do not put API keys in code, docs, fixtures, screenshots, or git history.
- Do not change the default provider from `mock`.
- Do not run broad batteries with the real provider until a dedicated evidence workflow exists.
- Do not use real-provider output as publication evidence without preserving raw request/response metadata.

## Required local env vars

Set these only in your local terminal session:

    export PROPOSER_PROVIDER=openai_compat
    export OPENAI_API_KEY="..."
    export OPENAI_MODEL="..."

Optional:

    export OPENAI_BASE_URL="https://api.openai.com/v1"

## Local dev server

Use the ZË-RO local port, usually `3001` when VoiceLab occupies `3000`.

    npm run dev -- --port 3001

## Mock baseline check

Before testing the real provider, confirm mock still passes:

    curl -s http://localhost:3001/api/propose-loop \
      -H 'content-type: application/json' \
      -d '{
        "word": "study",
        "mode": "strict",
        "provider": "mock",
        "maxAttempts": 2
      }' | jq '{
        status,
        attemptsUsed: .meta.attemptsUsed,
        acceptedCandidateForms: .final.acceptedCandidateForms,
        checks: .final.verification.results[0].checks
      }'

Expected:

- `status: "PASS"`
- accepted candidate includes `study`
- all six verifier checks pass

## Real provider smoke

Run one low-risk word only:

    curl -s http://localhost:3001/api/propose-loop \
      -H 'content-type: application/json' \
      -d '{
        "word": "study",
        "mode": "strict",
        "provider": "openai_compat",
        "maxAttempts": 3
      }' | jq '{
        status,
        attemptsUsed: .meta.attemptsUsed,
        provider: .meta.provider,
        model: .meta.model,
        acceptedCandidateForms: .final.acceptedCandidateForms,
        checks: .final.verification.results[0].checks,
        trace: .trace
      }'

## Interpreting result

A pass means:

- parser accepted the model JSON
- verifier accepted at least one candidate
- all hard checks passed for the accepted candidate

A fail is not automatically a system failure. Inspect `trace.failReasons`.

Common failure meanings:

- `LANG_KNOWN`: model omitted or invented language
- `ROOT_HAS_VOWEL`: decomposition/root material did not overlap extracted vowel path
- `FUNCTION_FIT_NONEMPTY`: model gave statement-only decomposition
- `OPS_ALLOWED`: model invented unsupported ops token
- `PARSE_ERROR`: model failed JSON contract

## Completion definition

This smoke is complete when:

- mock baseline passes
- one real-provider request returns either:
  - a clean `PASS`, or
  - a clean verifier-driven `FAIL` with readable fail reasons
- no secrets are committed
- no default provider behavior changes
