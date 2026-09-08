# Open Instrument semantic provider preflight and timeout v1

Milestone ID: `OPEN_INSTRUMENT_SEMANTIC_PROVIDER_PREFLIGHT_AND_TIMEOUT_V1`
Status: ACTIVE
Opened: 2026-09-08
Repository: `sokolgora-sketch/linguistic-decoder`
Opening main: `3d572c3bbf1fd8257ed175f7c31354aac6895b31`
Opening branch: `fix/open-instrument-semantic-provider-timeout-preflight-v1`

## Purpose

Harden the existing semantic-alignment provider seam before any future real-provider authorization. This milestone adds deterministic readiness preflight and actual request cancellation with a bounded timeout. It does not authorize, configure, or execute a real provider.

## Predecessor and doctrine

The predecessor `OPEN_INSTRUMENT_SENSE_GROUNDED_FUNCTIONAL_BRIDGE_V1` is closed with marker `OPEN_INSTRUMENT_SENSE_GROUNDED_FUNCTIONAL_BRIDGE_V1_CLOSED_2026-09-08`.

The implementation preserves Fact / Inference / Hypothesis / Unknown boundaries, valid Null, `no_single_winner`, `user_decides`, and all unclaimed historical-origin, historical-transmission, winner, language-superiority, and candidate-truth claims. Provider output remains hypothesis-only and is never evidence.

## Opening proof

- `main` and `origin/main` matched at `3d572c3bbf1fd8257ed175f7c31354aac6895b31`.
- Divergence was `0 behind / 0 ahead` and the worktree was clean.
- Remote identity was `sokolgora-sketch/linguistic-decoder`.
- Protected JO stash object `8b7e4397ac3341c1c4ea9c004b29e6fa93db40b1` and marker `park-jo-runtime-verified-before-logic-first-milestone-2026-08-25` were present.

## Proven gap

`RunSemanticAlignmentOptionsV0_1.timeoutMs` existed but was not enforced by `semanticAlignmentProposal.v0_1.ts`. The provider adapter already accepted an `AbortSignal`, while the semantic orchestrator did not create or pass one. Provider-disabled behavior was already fail-closed and remains unchanged.

## Bounded implementation

1. Add pure semantic-provider preflight states for disabled, unselected, unsupported, missing credential, missing model, and ready.
2. Expose only safe readiness and reason-code metadata; never expose secrets or authorization headers.
3. Normalize timeout values deterministically to a positive value capped at 30 seconds, with an 8-second default.
4. Abort the provider request when the timeout expires.
5. Classify an aborted request as `error: "timeout"` with `SEMANTIC_ALIGNMENT_PROVIDER_TIMEOUT` and return deterministic `unknown` / `deterministic_no_alignment`.
6. Keep malformed output, rejected alignment, provider errors, and disabled/not-ready states on their existing fail-closed paths.

## Explicit non-goals

- no real provider execution;
- no credentials or secret-store changes;
- no deployment or environment activation;
- no catalog/evidence changes;
- no candidate-truth, reviewed-evidence, historical, winner, or language-superiority promotion;
- no UI redesign or unrelated refactor;
- no changes to the closed predecessor milestone.

## Exit criteria

- semantic preflight is deterministic and secret-free;
- disabled/not-ready states remain unknown and non-candidate;
- a hanging fake provider receives an abort signal and returns timeout distinctly;
- malformed, rejected, and generic provider-error paths remain fail-closed;
- focused semantic tests, `npm run gate:quick`, and live provider-disabled smoke pass;
- no real provider is called;
- JO stash remains unchanged;
- only the bounded orchestrator/test/report scope is changed.

## Continuation protocol

Before merge, inspect the exact diff and changed-file scope, run focused tests followed by the repository gate and provider-disabled live smoke, verify the worktree and protected stash, then merge only after required CI and review evidence is green. A future real-provider lane requires a separate explicit authorization milestone.
