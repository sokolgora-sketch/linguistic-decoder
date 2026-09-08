# Open Instrument semantic calibration packet and decision policy v1

Milestone ID: `OPEN_INSTRUMENT_SEMANTIC_CALIBRATION_PACKET_AND_DECISION_POLICY_V1`
Status: `ACTIVE`
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
