# Open Instrument contrastive semantic calibration v1

Milestone ID: `OPEN_INSTRUMENT_CONTRASTIVE_SEMANTIC_CALIBRATION_V1`
Status: `ACTIVE`
Opened: `2026-09-08`
Opening main: `e180aa4da3bdad0317fed35ca554a634f5bc9f44`
Opening branch: `feat/open-instrument-contrastive-semantic-calibration-v1`

## Motivation

The completed v0.1 and v0.2 single-sense calibration runs did not produce
useful negative discrimination. Gemma proposed three of four parseable
negative controls as `structure_specific`; Llama was heavily confounded by
timeouts and malformed output. The deterministic verifier correctly refuses
to become a semantic oracle.

The bounded correction is a contrastive calibration question: compare two
anonymous definition-bearing senses for the same word against the identical
structural and doctrine context, selecting one only when it has materially
more specific support, otherwise returning `neither` or `both_or_unclear`.

## Scope

- add opt-in contract `open-instrument.semantic-contrastive-decision-contract.v0_1`;
- bind four frozen word pairs and their internal slot mapping into a packet fingerprint;
- serialize only anonymous `sense_a` and `sense_b` labels/definitions to the provider;
- execute one provider call per pair through a dedicated four-call runner;
- preserve one-shot local authorization, timeout, retry, and truth-boundary controls;
- keep v0.1 and v0.2 single-sense behavior unchanged.

## Truth boundary

Contrastive decisions are provider calibration judgments, not lexical truth,
reviewed evidence, historical origin, historical transmission, a winner,
language superiority, or candidate truth. Neutral outcomes are calibration
uncertainty, not lexical rejection. Provider output remains hypothesis-only,
candidate-only where selected, and `user_decides`.

## Non-goals

- no real provider execution in the implementation lane;
- no evidence, catalog, SCALE-50, structural grammar, UI, VoiceLab, or JO changes;
- no word-specific production branches or `_plausible`/`_unrelated` execution logic;
- no deterministic semantic-truth oracle;
- no Llama authorization preparation in this first contrastive lane.

## Exit criteria

- four anonymous pairs share exact structural hypotheses per word;
- internal sense IDs and expected calibration orientation remain provider-hidden;
- pair order and contract version affect the packet fingerprint;
- selected outputs require bounded bridge, doctrine role, support trace, and supplied context references;
- `neither` and `both_or_unclear` remain bridge-free uncertainty;
- legacy single-sense v0.1/v0.2 paths remain compatible;
- focused tests, typecheck, gate, build, and diff checks pass;
- a fresh Gemma packet and non-granted authorization template can be prepared without provider calls;
- the first live contrastive probe requires a new explicit human authorization.

## Continuation protocol

After implementation and closure are merged, prepare only one Gemma model-bound
packet under `/tmp`. Do not execute it. A future live comparison must use a
new human authorization bound to the exact packet fingerprint, four-call
maximum, 8000 ms timeout, zero retries, and loopback-only endpoint.
