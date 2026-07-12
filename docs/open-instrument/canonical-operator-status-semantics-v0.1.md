# Open Instrument — Canonical Operator Status Semantics v0.1

Status: DEFINED_PENDING_REVIEW.

Project lane: Open Instrument / ZË-RO.

## Purpose

This contract separates three status dimensions that must not be collapsed into
one field:

1. Root/token support status;
2. reviewed external evidence status;
3. canonical operator lifecycle status.

The separation is required because a RootMap token may retain a proto-root or
carrier support status while independently receiving reviewed, authorized,
production-safe external lexical evidence.

A production-governance state must not silently overwrite a token-support
state.

## Current reference operators

The first reference operators are:

- DA;
- DI.

Current governance posture:

- DA is `canon_locked` for bounded functional lexical projection;
- DI is `runtime_verified` for bounded functional lexical projection;
- DA's canon lock is operational governance only and preserves all not-claimed
  boundaries.

Canonical status in this contract means operational reference status inside
Open Instrument.

It does not mean historical origin, historical ownership, transmission proof,
language superiority, a single winner, or candidate truth.

## Dimension 1 — Root/token support status

Current owner:

- `RootKeyV1.status`;
- `RootKeyStatusV1`;
- `RootKeyStatusV1Schema`;
- RootMap builder and adapter validation.

Current values:

- `supported`;
- `speculative`;
- `dialect_attested_pending_review`;
- `carrier_only`.

Meaning:

This status describes the support posture of the RootMap token, proto-root, or
carrier path.

It may describe:

- whether the token is supported by the existing proto-root table;
- whether the token is speculative;
- whether a dialect-attested carrier record still carries a pending-review
  label;
- whether the record is carrier-only.

It does not describe:

- production source-row membership;
- machine-readable functional runtime authorization;
- reviewed external evidence attachment;
- live-smoke completion;
- canon lifecycle state.

## Public contract boundary

`RootKeyV1.status` is part of the public RootMap v1 contract.

The field is validated by:

- `src/shared/deepRoot.rootMap.v1.ts`;
- `src/v1/rootMap.v1.schema.ts`;
- `src/ui/instrument/contractAdapter.ts`.

It is guarded by RootMap, schema, adapter, snapshot, and stable regression
tests.

This PR does not:

- rename the field;
- add enum values;
- replace `dialect_attested_pending_review`;
- reinterpret the field as production governance;
- change RootMap output;
- change API output;
- change UI output.

Any future RootMap schema expansion requires a separate reviewed contract and
implementation lane.

## Dimension 2 — reviewed external evidence status

Proposed semantic values for v0.1:

- `none`;
- `reviewed_functional`.

Meaning:

This dimension describes whether boundary-safe reviewed external lexical
evidence is attached to an emitted operator token.

Current implementation posture:

- reviewed evidence is attached through `RootKeyV1.evidence`;
- evidence is built from reviewed production source rows;
- production membership and machine-readable runtime authorization are
  required;
- claim boundaries remain embedded in the reviewed evidence text.

Current DA posture:

- reviewed evidence status: `reviewed_functional`.

Current DI posture:

- reviewed evidence status: `reviewed_functional`;
- scope: bounded functional lexical projection.

The reviewed evidence dimension does not establish:

- historical derivation;
- transmission direction;
- earliest source;
- language ownership;
- language superiority;
- a single winner;
- candidate truth;
- scientific proof;
- publication proof.

## Reviewed-evidence placement decision

No new machine-readable RootMap field is added in this PR.

A future implementation must separately decide whether reviewed evidence status
belongs in:

1. the public RootMap/API contract;
2. an adapter-derived view model;
3. a display-only projection.

That decision must be explicit before implementation.

The future lane must inspect:

- public contract compatibility;
- stable fingerprint changes;
- snapshot impact;
- adapter validation;
- UI rendering;
- whether the machine-readable field would duplicate existing reviewed source
  truth.

## Dimension 3 — canonical operator lifecycle status

Proposed lifecycle values:

1. `candidate`;
2. `functionally_ready`;
3. `machine_authorized`;
4. `production_member`;
5. `runtime_verified`;
6. `canon_locked`;
7. `deprecated`.

### candidate

A candidate row or diagnostic representation exists.

Runtime reviewed projection is not implied.

### functionally_ready

The isolated form, reviewed lexical citation, lexical gloss, and bounded
functional bridge pass functional readiness.

Historical-origin and candidate-truth claims remain disabled.

### machine_authorized

The row passes the machine-readable bounded functional runtime authorization
contract.

Authorization alone does not imply production membership.

### production_member

The source ID is explicitly admitted to the production source-row set and still
passes machine authorization.

### runtime_verified

The operator:

- projects reviewed evidence through the runtime path;
- appears for positive proof words;
- remains absent for negative controls;
- preserves claim boundaries;
- passes focused tests;
- passes repo-native live smoke.

### canon_locked

The operator is accepted as a reusable implementation reference after:

- a canonical operator profile contract exists;
- shared canon assertions exist;
- live smoke is data-driven;
- operator-specific edge tests remain explicit;
- the reusable process has been reviewed;
- scaling can proceed without bespoke runtime branching.

### deprecated

The operator remains historically traceable but is no longer approved for
current canonical use.

Deprecation must be explicit and must not silently delete evidence history.

## State derivation boundary

Canon lifecycle state must be derived from existing source truth rather than
duplicating it.

A future canonical operator profile should reference:

- reviewed source ID;
- functional readiness result;
- runtime authorization result;
- production membership;
- runtime projection result;
- positive and negative smoke cases.

It must not create a second independent source of lexical truth.

## DA status interpretation

DA currently demonstrates two simultaneous facts:

1. its RootMap token may retain
   `dialect_attested_pending_review` as the proto-root/carrier support status;
2. reviewed external DA functional evidence is attached through the production
   projection path.

The first fact must not erase the second.

The second fact must not silently rewrite the first.

Current lifecycle status:

- `canon_locked`.

Admitted scope:

- `bounded_functional_lexical_projection`.

## DI status interpretation

DI is production-live for bounded functional lexical projection.

The allowed statement is:

- Albanian `di` is an attested standalone lexical form associated with knowing;
- that lexical function may motivate a candidate reading involving knowledge,
  study, or learning;
- the user decides.

Direct DPEWA/FGJSH authority remains unresolved for historical-authority or
stronger-source claims.

That unresolved stronger-authority question is not a blocker for the current
bounded functional production lane.

Current lifecycle status:

- `runtime_verified`.

## Historical document policy

Documents that accurately recorded an earlier blocked DI posture must not be
silently rewritten.

They should receive a dated supersession notice stating:

- the historical content remains valid for its original checkpoint;
- PR #1724 changed the current bounded functional runtime posture;
- DI is now production-live for bounded functional lexical projection;
- stronger historical-authority questions remain unresolved.

Active current-state workflow and contract documents must be corrected to match
the live system.

## Next implementation sequence

After this contract is reviewed:

1. add a canonical operator profile contract referencing existing source rows;
2. add shared canonical operator assertions;
3. make live smoke data-driven;
4. lock DA as `canon_locked` while preserving DI as `runtime_verified`;
5. review DI separately and add a third operator as the scalability proof.

## Scope boundary

This PR is documentation and contract clarification only.

It does not modify:

- `src/shared/deepRoot.rootMap.v1.ts`;
- `src/shared/deepRoot.rootMap.builder.v1.ts`;
- `src/v1/rootMap.v1.schema.ts`;
- `src/ui/instrument/contractAdapter.ts`;
- runtime projection;
- production membership;
- engine behavior;
- API behavior;
- UI behavior;
- candidate ranking;
- historical-origin policy.

## Acceptance criteria

This contract is complete when:

- the three status dimensions are explicit;
- each dimension has a defined owner and meaning;
- RootMap token status remains distinct from production governance;
- reviewed evidence placement is explicitly deferred to a reviewed future lane;
- DA is recorded as `canon_locked` under bounded functional lexical
  projection;
- DI remains `runtime_verified`;
- current-state docs match PR #1724;
- historical reports carry supersession notices rather than rewritten history.
