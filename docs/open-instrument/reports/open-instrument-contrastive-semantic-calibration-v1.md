# Open Instrument contrastive semantic calibration v1

Milestone ID: `OPEN_INSTRUMENT_CONTRASTIVE_SEMANTIC_CALIBRATION_V1`
Status: `DONE`
Opened: `2026-09-08`
Opening main: `e180aa4da3bdad0317fed35ca554a634f5bc9f44`
Opening branch: `feat/open-instrument-contrastive-semantic-calibration-v1`

## Closeout

Implementation PR `#1866` (`feat(open-instrument): add contrastive semantic calibration contract`) merged into `main` as squash commit `3db4013e323443c8e4dca9955eede184d10135c8` from implementation head `ab87b545d3e4003d8eb8b451ebcfccd92f92ba8f`.

Validation proved:

- focused contrastive plus legacy semantic-provider tests: 3 suites / 45 tests passed;
- `npm run typecheck:full`: passed;
- `npm run build`: passed;
- `npm run gate:quick`: passed with 642 suites passed, 3 skipped, 2,908 tests passed, 4 skipped, 149 snapshots passed, and 2 integration suites / 5 integration tests passed;
- GitHub checks: Analyze, CodeQL, contracts, and lint-test-build passed;
- `git diff --check`: passed;
- post-merge `main` and `origin/main`: `3db4013e323443c8e4dca9955eede184d10135c8`, divergence `0/0`, clean worktree;
- protected JO stash remained present and unchanged.

The implementation lane made no provider calls and invoked no controlled
provider runner. The four-pair contrastive contract keeps sense IDs and
calibration orientation out of provider-visible context, preserves neutral
uncertainty, and leaves all provider output hypothesis-only/candidate-only
with `user_decides`; it does not promote evidence, history, origin,
transmission, winner, superiority, or candidate truth.

This milestone is closed with marker:

`OPEN_INSTRUMENT_CONTRASTIVE_SEMANTIC_CALIBRATION_V1_CLOSED_2026-09-08`

The next live contrastive calibration remains a separate action requiring a
new explicit human authorization bound to one exact model, packet, four-call
maximum, 8000 ms timeout, zero retries, and loopback-only execution. No live
provider execution is part of this closeout.

No implementation lane remains under this milestone. Any future change must
be opened as a new bounded milestone.

## Post-Closure Experiment Addendum (2026-09-09)

The first controlled contrastive calibration execution was performed after
this milestone had closed, using `gemma3:4b` and its one-shot local
authorization. Four of four bounded calls completed: three returned the
generic `CONTRASTIVE_OUTPUT_FIELDS_INVALID` malformed posture, one timed out,
zero produced parseable contrastive decisions, zero candidates were emitted,
and no evidence was promoted. The authorization was spent.

The captured result did not retain provider raw text, exact malformed field
values, model identity on failed rows, or per-call elapsed timing. The
defensible classification is
`CONTRASTIVE_SEMANTIC_CALIBRATION_V1_NO_PARSEABLE_DECISIONS`. This run is not
evidence that semantic discrimination succeeded or failed because no valid
contrastive decision reached evaluation.

The bounded diagnostics follow-up preserves deterministic field-specific
parser issues, sanitized response-shape diagnostics, the packet-bound model
identity, and non-negative per-call elapsed time without adding raw provider
text or changing semantic policy. It improves future observability only; it
does not rewrite the historical run as though these diagnostics existed then.

The milestone remains `DONE` and closed. No new provider execution,
authorization, packet, evidence, or truth promotion is part of this
addendum.

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
