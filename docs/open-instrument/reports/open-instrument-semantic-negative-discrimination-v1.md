# Open Instrument semantic negative-discrimination decision contract v1

Milestone ID: `OPEN_INSTRUMENT_SEMANTIC_NEGATIVE_DISCRIMINATION_V1`
Status: `DONE`
Opened: `2026-09-08`
Opening main: `ca644afd3dea06dcbf998657bfc23ded8a1c6ca3`
Opening branch: `feat/open-instrument-semantic-negative-discrimination-v1`

## Motivation

Two bounded local calibration runs showed that a provider could return
coherent proposed bridges for unrelated definition-bearing controls. The
existing deterministic parser could reject malformed or tautological output,
but it could not independently prove semantic compatibility. This lane adds
an explicit provider decision contract rather than weakening that boundary.

## Scope

- add opt-in semantic decision contract `open-instrument.semantic-decision-contract.v0_2`;
- require `structure_specific`, `generic_or_unclear`, or `conflicting` before accepting a v0.2 proposal;
- require exact agreement between that decision and `proposed`, `unknown`, or `rejected`;
- bind the decision-contract version into controlled packet and authorization fingerprints;
- preserve the existing v0.1 path for general callers and legacy packets;
- keep provider output hypothesis-only and candidate-only where applicable.

## Truth boundary

The decision is provider calibration output, not lexical evidence. It does not
promote evidence, history, origin, transmission, a winner, language
superiority, candidate truth, or reviewed status. `user_decides` remains the
only decision posture. The parser enforces structure and consistency; it does
not become a deterministic semantic-truth engine.

## Non-goals

- no real provider execution or Ollama completion;
- no new authorization consumption;
- no fuzzy, embedding, dictionary, or word-specific semantic oracle;
- no evidence, catalog, SCALE-50, structural grammar, UI, VoiceLab, or JO changes.

## Exit criteria

- v0.2 decisions are required and status-bound on the controlled path;
- generic/unclear cannot pass as `proposed`;
- legacy v0.1 callers and packets remain valid;
- packet fingerprints and authorizations bind the selected decision contract;
- focused tests, typecheck, gate, build, and diff checks pass;
- fresh blinded model-bound packets can be prepared without provider calls;
- a future real comparison requires separate human authorization.

## Closure proof

Implementation PR `#1864` was squash-merged at
`32a0ed35ccc4579e6c418c3b85d878c2b415ae06` from implementation head
`c9126415f7b906a795bfe2c9ce4385842cf702d3`. CI passed for `contracts`,
`lint-test-build`, `Analyze (actions)`, `Analyze (javascript-typescript)`,
and CodeQL. The implementation was validated with 34 focused tests,
`npm run typecheck:full`, `npm run gate:quick`, `npm run build`, and
`git diff --check`.

The merged decision contract is explicitly opt-in. Legacy v0.1 callers and
packets remain unchanged. A controlled v0.2 packet must bind
`open-instrument.semantic-decision-contract.v0_2`; its provider response must
include one of `structure_specific`, `generic_or_unclear`, or `conflicting`,
and that decision must agree with `proposed`, `unknown`, or `rejected`.

No real provider call, Ollama completion, controlled runner invocation, or
authorization consumption occurred during implementation or closure. No
evidence, catalog, SCALE-50, history, origin, transmission, winner,
superiority, or candidate-truth promotion occurred. Provider output remains
hypothesis-only, candidate-only where applicable, and `user_decides`.

Post-merge main proof: `32a0ed35ccc4579e6c418c3b85d878c2b415ae06` equals
`origin/main`, divergence is `0/0`, and the worktree is clean. Protected JO
stash object `8b7e4397ac3341c1c4ea9c004b29e6fa93db40b1` and marker
`park-jo-runtime-verified-before-logic-first-milestone-2026-08-25` remain
present and unchanged.

Fresh blinded llama3.1:8b and gemma3:4b packet preparation is outside this
repository closure and requires a new explicit human authorization before any
provider execution.

`OPEN_INSTRUMENT_SEMANTIC_NEGATIVE_DISCRIMINATION_V1_CLOSED_2026-09-08`
