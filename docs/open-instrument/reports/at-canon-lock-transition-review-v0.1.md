# AT Canon-Lock Transition Review v0.1

Status: IMPLEMENTED_PENDING_REVIEW.

Readiness decision: READY_FOR_DEDICATED_TRANSITION.

Project lane: Open Instrument / ZË-RO.

## Reviewed pre-transition base

`e2bfb327f4a7801d5c91dac675280b178a92c9f7`

On that base AT was:

- `runtime_verified`;
- `reviewed_functional`;
- functionally ready;
- machine authorized;
- in production membership;
- runtime-projectable;
- profile-backed;
- `bounded_targets`.

The machine admission evaluator failed closed for exactly:

- `operator_not_explicitly_admitted`.

## Discovery-scope blocker and repair

Before PR #1799, simulation proved that changing AT to `canon_locked` would
silently widen discovery breadth.

Unrelated inputs including `data` and `later` became eligible for unreviewed
AT discovery.

PR #1799 separated canon lifecycle governance from discovery breadth.

On repaired merged main a hypothetical AT canon lock preserved:

- `discoveryScope = bounded_targets`;
- `diet` blocked;
- `data` blocked;
- `random` blocked;
- `later` blocked;
- legacy `atë`, `ati`, and `pater` structural carriers preserved.

Focused repaired-main readiness proof:

- 7 suites passed;
- 64 tests passed;
- repository remained clean.

## Readiness decision

AT satisfies the canon-lock requirements for:

`bounded_functional_lexical_projection`.

The proof covers stable functional identity, homograph boundary stability,
source authority appropriate to the admitted scope, runtime stability,
positive and negative controls, reusable shared architecture, rollback,
revision, supersession, revocation/deprecation, transition authority, and
claim-boundary preservation.

This decision does not authorize historical-origin or single-winner claims.

## Machine implementation

The dedicated transition changes two governance values:

1. explicit canon-lock admission expands from DA and DI to DA, DI, and AT;
2. AT lifecycle changes from `runtime_verified` to `canon_locked`.

AT discovery remains:

- `bounded_targets`.

DA and DI remain:

- `canon_locked`;
- `broad_structural`.

## Preserved runtime truth

No change is made to source identity, citation metadata, functional readiness,
runtime authorization, production membership, runtime projection, proof words,
negative controls, discovery scope, RootMap, API output, UI behavior, or
runtime evidence text.

Father remains the reviewed positive proof.

Bare `at` remains a negative homograph control.

## Historical-record policy

Earlier AT source-admission documentation remains unchanged.

Statements that the earlier source-admission repair did not canon-lock AT
remain historically correct.

Current machine truth after this transition is owned by the canonical profile
and canon-lock admission evaluator.

## Required before merge

Before merge this lane still requires exact diff review, focused transition
tests, profile-driven production live smoke, full `npm run gate:quick`,
exact-source GitHub CI, review/comment inspection, and mergeability proof.

After merge it requires merged-main machine admission proof, focused proof,
production live smoke, required full-gate proof, and both DF_BRAIN records.

## Claim boundaries

The transition preserves:

- historical origin:
  `not_claimed`;
- winner:
  `not_claimed`;
- language superiority:
  `not_claimed`;
- user decision:
  `user_decides`.

No historical transmission, borrowing direction, ownership, candidate truth,
scientific evidence, or publication evidence is claimed.
