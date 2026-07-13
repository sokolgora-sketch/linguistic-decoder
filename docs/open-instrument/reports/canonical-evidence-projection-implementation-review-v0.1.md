# Open Instrument — Canonical Evidence Projection Implementation Review v0.1

## Status

Implementation review for operation-aware reviewed evidence projection.

## Implemented boundary

Token discovery and reviewed evidence projection are now separate decisions.

A canonical RootMap token may remain visible while its reviewed external
evidence is withheld.

## Policy owner

The implementation uses a source-derived machine-readable registry:

- `reviewedExternalLexiconEvidenceOperationPoliciesV0_1`

The RootMap builder remains operator-agnostic.

No DA-specific or DI-specific branch was added to RootMap.

## DA policy

DA permits reviewed evidence through:

- `exact`

DA blocks reviewed evidence through:

- `final_swap`
- `vowel_swap`
- unknown operations
- missing non-exact operations

Observed outcomes:

- `da`: token present, reviewed evidence present
- `dam`: token present, reviewed evidence present
- `damage`: token present, reviewed evidence present
- `mode`: token present, reviewed evidence absent
- `made`: token present, reviewed evidence absent
- `dome`: token present, reviewed evidence absent

## Damage classification

The bounded `damage` min-root path currently emits:

- segment: `da`
- carrier form: `da`
- operations: empty

An empty operation list is treated as exact-equivalent only when normalized
segment and carrier form are identical.

Empty operations with mismatching forms fail closed.

## DI policy

DI permits reviewed evidence through:

- `exact`
- `y_to_i`

The `study` path retains reviewed DI evidence through explicit `y_to_i`
authorization.

DI remains:

- `runtime_verified`

## Contract supersession

The historical wiring test that used `mode` as a positive reviewed-DA-evidence
case was intentionally superseded.

The replacement contract requires:

- the DA token to remain visible;
- `ops: final_swap` to remain visible;
- the reviewed DA citation to be absent.

## Citation-bearing carrier notes

The RootMap builder applies the same operation-policy decision to carrier
notes that contain reviewed-source or citation metadata.

Citation-bearing markers include:

- reviewed-source wording;
- citation wording;
- DOI wording;
- source URLs.

This prevents a disallowed transformed match from losing the complete runtime
projection while still leaking a partial citation through the proto-carrier
note.

Non-citation diagnostic carrier notes remain governed by the existing RootMap
note-exposure rules.

## Production smoke enforcement

Profile-driven production smoke now checks each negative operator control for:

- absence of the exact reviewed runtime projection;
- absence of citation-bearing reviewed metadata on that operator's RootMap
  key.

The enforcement remains generic and contains no DA-specific or DI-specific
runtime branch.

## Preserved behavior

This implementation does not change:

- carrier matching;
- token discovery;
- min-root selection;
- canonical admission;
- production membership;
- readiness;
- functional runtime authorization;
- runtime projection source text;
- API response shape;
- UI structure;
- historical-origin claim boundaries.

DA remains:

- `canon_locked`

DI remains:

- `runtime_verified`
