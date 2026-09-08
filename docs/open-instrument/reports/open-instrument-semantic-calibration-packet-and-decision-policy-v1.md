# Open Instrument semantic calibration packet and decision policy v1

Milestone ID: `OPEN_INSTRUMENT_SEMANTIC_CALIBRATION_PACKET_AND_DECISION_POLICY_V1`
Status: `DONE`
Opened: 2026-09-08
Opening main: `6570efbe7392ae7bfca129c1dfc0f35311208e26`
Opening branch: `feat/open-instrument-semantic-calibration-packet-decision-policy-v1`

## Purpose

This bounded lane repairs the first controlled semantic-provider calibration contract. The first authorized run showed that identifier-like target-sense labels did not provide enough semantic content to distinguish plausible from unrelated controls. The run remains calibration output only: no lexical truth, evidence, historical claim, winner, or candidate-truth promotion occurred.

## Scope

- add definition-bearing semantic context to controlled calibration targets;
- require that context before a controlled provider call;
- serialize the definition to the provider while keeping calibration IDs internal;
- make proposed / unknown / rejected policy explicit;
- preserve deterministic structural, binding, definition-copy, non-tautology, and truth-boundary checks.

General target-sense callers remain backward-compatible when no controlled calibration definition is supplied. Controlled packets fail closed when their definition is absent.

## Truth boundary

Definitions in the controlled packet are calibration inputs, not reviewed evidence or lexical proof. Provider output remains hypothesis-only, candidate-only where applicable, and `user_decides`. Historical origin, historical transmission, winner, language superiority, and candidate truth remain `not_claimed`.

## Provider restriction

This implementation lane explicitly prohibits real semantic-provider execution, Ollama completion calls, authorization consumption, and controlled-runner invocation against a live provider. A future real calibration run requires separate human authorization after review and merge.

## Exit criteria

- all eight controlled targets carry meaningful semantic definitions;
- missing controlled definitions block before provider execution;
- provider prompt receives the definition but not calibration answer-bearing IDs;
- proposed / unknown / rejected policy is explicit;
- existing tautology protection remains deterministic;
- focused tests, typecheck, `npm run gate:quick`, and diff checks pass;
- no evidence, catalog, SCALE-50, historical, winner, or provider authorization changes occur.

## Implementation and closure proof

The implementation was delivered through PR `#1861`, titled `feat(open-instrument): ground semantic calibration in target definitions`, and merged by squash at `5bad7b1e42674a5a5d542bcf92baad8577637d7f` from final implementation head `731b50e18f6f4479d73afda3268587ec8eeb9520`.

- CI passed for `lint-test-build`, `contracts`, `Analyze (actions)`, `Analyze (javascript-typescript)`, and CodeQL.
- Focused semantic-calibration tests passed: 4 suites, 49 tests; the final review repair added definition-copy rejection and whitespace-only definition fail-closed coverage.
- `npm run gate:quick` passed: 641 suites passed, 3 skipped; 2,893 tests passed, 4 skipped; 149 snapshots passed; integration 2 suites / 5 tests passed; production build and static generation passed.
- The first pre-push attempt encountered one worker `SIGSEGV`; the affected test passed independently in-band, and the subsequent normal pre-push gate passed in full.
- `git diff --check` passed. No evidence, catalog, SCALE-50, or API truth-status changes were introduced.
- The eight packet definitions remain calibration fixtures, not lexical evidence, reviewed evidence, historical origin, transmission proof, winner proof, language superiority, or candidate truth.
- Controlled definitions are required and fail closed before provider execution; calibration IDs remain omitted from provider-visible payloads; provider output remains hypothesis-only, candidate-only where applicable, and `user_decides`.
- Real provider execution during this implementation lane: `0`; Ollama completions: `0`; controlled semantic runner invocations: `0`. Any future real calibration run requires a new explicit human authorization.
- Main was synchronized at `5bad7b1e42674a5a5d542bcf92baad8577637d7f` with divergence `0/0` and a clean worktree after the implementation merge.
- Protected JO stash object `8b7e4397ac3341c1c4ea9c004b29e6fa93db40b1` and marker `park-jo-runtime-verified-before-logic-first-milestone-2026-08-25` remain present and unchanged.
- No implementation lane remains under this milestone. Any further provider calibration requires a separate bounded milestone and authorization.

`OPEN_INSTRUMENT_SEMANTIC_CALIBRATION_PACKET_AND_DECISION_POLICY_V1_CLOSED_2026-09-08`
