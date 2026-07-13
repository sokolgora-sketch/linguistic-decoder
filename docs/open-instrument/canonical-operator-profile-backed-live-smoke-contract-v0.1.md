# Open Instrument — Canonical Operator Profile-Backed Live Smoke Contract v0.1

Status: IMPLEMENTED_PENDING_REVIEW.

## Purpose

This contract migrates the local Open Instrument production smoke from
hard-coded DA/DI cases to the canonical operator profile registry.

The smoke remains deterministic, offline, and local.

It does not call a model provider.

## Source of truth

The canonical profile owner remains:

- `src/shared/canonicalOperatorProfile.v0_1.ts`

The smoke runner does not define a second DA/DI profile registry.

The case projection owner is:

- `scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts`

It imports and resolves the canonical profiles directly.

## Runtime mechanism

The repository already uses `tsx` for executable TypeScript scripts.

The live-smoke package command therefore becomes:

- `tsx scripts/open-instrument/live-smoke.v0.1.ts`

No new runtime dependency is added.

Native Node TypeScript import is not used because the current project modules
use extensionless TypeScript imports that plain Node cannot resolve safely.

## Fail-closed requirements

Before live API execution, every canonical profile must:

- resolve through the existing canonical profile resolver;
- be functionally ready;
- be machine authorized;
- match the bounded authorization scope;
- hold explicit production membership;
- expose a non-null runtime projection;
- preserve source ID and embryo identity;
- expose non-empty runtime evidence text;
- hold a runtime-mature lifecycle status:
  - `runtime_verified`; or
  - `canon_locked`.

If any requirement fails, the smoke exits with failure.

## Positive cases

Each profile’s `positiveProofWords` is executed against the real production
`/api/analyze-v1` route.

For every positive word, the smoke requires:

- the profile embryo to appear as a RootMap key;
- the exact reviewed runtime-projection evidence text to appear.

## Negative controls

Each profile’s `negativeControlWords` is executed against the same production
route.

For every negative control, the smoke requires:

- the exact profile-specific reviewed runtime-projection evidence text to be
  absent from the operator's RootMap key;
- citation-bearing reviewed metadata to be absent from that same key,
  including reviewed-source wording, citation wording, DOI markers, and URLs.

This permits a word to retain an operator-shaped token while preventing both
complete and partial reviewed-evidence leakage from the operator currently
under test.

## Preserved behavior

The migration preserves:

- production build by default;
- `--skip-build`;
- `--skip-focused-tests`;
- local port selection;
- optional explicit port;
- `/chat` and `/` route checks;
- real `/api/analyze-v1` requests;
- deterministic failure exit codes;
- server cleanup;
- no external provider calls.

## Scope boundary

This lane does not modify:

- canonical profile data;
- reviewed source rows;
- citations;
- readiness logic;
- authorization logic;
- production membership;
- runtime projection;
- RootMap construction;
- API response shape;
- UI behavior;
- candidate ranking;
- historical-origin policy.

## Evidence boundary

A successful live smoke is operational regression proof only.

It is not:

- candidate-truth evidence;
- historical-origin evidence;
- borrowing-direction evidence;
- language-superiority evidence;
- publication evidence;
- scientific evidence;
- Cohort evidence;
- provider-quality evidence.

## Lifecycle boundary

DA is:

- `canon_locked` under bounded functional lexical projection.

DI remains:

- `runtime_verified`.

The smoke accepts both runtime-mature states while rejecting earlier lifecycle
states and `deprecated`.

## Carrier-scope extension — 2026-07

The profile-backed smoke also verifies reviewed carrier scope.

Current DI evidence-positive words are:

- `di`;
- `study`;
- `studim`.

Each must resolve through selected reviewed carrier:

- `di`.

Current DI evidence-absence carrier controls are:

- `dij`;
- `dije`;
- `dit`.

These controls may retain a DI token and carrier diagnostics while the exact
reviewed DI projection and citation-bearing metadata remain absent.

`dit` also retains its non-citation weak-carrier warning.

This extension does not change DI from `runtime_verified` and does not alter
DA `canon_locked` status.
