# Open Instrument first controlled semantic-provider execution authorization and bounded runner v1

Milestone ID: `OPEN_INSTRUMENT_FIRST_CONTROLLED_SEMANTIC_PROVIDER_EXECUTION_AUTHORIZATION_AND_BOUNDED_RUNNER_V1`
Status: ACTIVE
Opened: 2026-09-08
Opening main: `5d537921c3261e5f6b754fae052c4683f4fd4ef2`
Opening branch: `feat/open-instrument-semantic-provider-bounded-runner-v1`

## Purpose

Provide a semantic-specific, one-shot, local-only authorization and bounded runner without enabling real provider execution or exposing normal production traffic to provider calls.

## Frozen calibration packet

The first packet freezes `candle`, `bistro`, `contra`, and `mantra`, each with one plausible and one unrelated target sense. The packet permits exactly 8 calls, zero retries, an 8000 ms timeout, and loopback-only endpoint identity. Structural hypothesis IDs were verified before packet creation.

## Truth boundary

Provider output remains a hypothesis. The runner cannot create evidence references, reviewed/research evidence, historical claims, winner claims, language-superiority claims, or candidate truth. `user_decides` and `no_single_winner` remain preserved.

## Non-goals

- no real provider call or credential configuration;
- no public API or `/chat` routing;
- no production enablement or background traffic;
- no catalog/evidence/SCALE-50 changes;
- no retries, provider chaining, batch fan-out, or automatic execution.

## Exit criteria

- semantic-specific authorization binds to the exact packet and one-shot state;
- packet validation enforces fixed words, senses, call count, timeout, local-only endpoint, and zero retries;
- consumed authorization cannot execute twice in one runner process;
- provider-disabled and authorization-negative paths make zero calls;
- timeout/provider-error/malformed outcomes remain bounded and hypothesis-only;
- focused tests, typecheck, gate, provider-disabled smoke, and diff review pass;
- final state is `READY_FOR_EXPLICIT_RUN_AUTHORIZATION`; no real provider call is claimed.
