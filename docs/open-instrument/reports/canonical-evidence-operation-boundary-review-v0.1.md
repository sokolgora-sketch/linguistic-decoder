# Open Instrument — Canonical Evidence Operation Boundary Review v0.1

## Status

Reviewed policy input.

No runtime mutation is authorized by this review.

## Current repository state

DA is:

- `canon_locked`;
- production-live;
- profile-backed;
- machine-authorized;
- covered by positive and negative live-smoke cases.

DI is:

- `runtime_verified`;
- production-live for bounded functional lexical projection;
- not admitted to canon lock.

## Observed boundary

Current RootMap evidence attachment resolves reviewed runtime evidence by
operator embryo identity.

The attachment seam does not currently require an operation-specific
authorization decision.

As a result, transformed DA token matches can receive the complete reviewed DA
functional evidence string.

Observed examples include:

| Word | DA token | Reviewed DA evidence | Observed operation |
| --- | --- | --- | --- |
| `da` | present | present | exact or untransformed |
| `dam` | present | present | exact or untransformed |
| `damage` | present | present | classification to confirm |
| `mode` | present | present | `final_swap` |
| `made` | present | present | `final_swap` |
| `dome` | present | present | `vowel_swap` |

The reviewed Dedvukaj and Ndoci evidence supports isolated Gheg `da` and its
bounded split, divide, or cut function.

It does not by itself attest every surface form produced by a carrier
transformation.

## Existing contract

The current wiring contract intentionally uses:

- `mode`

as a positive DA reviewed-evidence assertion.

Therefore the current behavior is not an accidental untested regression.

It is a historical runtime contract that must be deliberately superseded.

## Review conclusion

Token discovery and reviewed evidence projection must become separate decisions.

The preferred architecture is:

1. RootMap discovers a token and records the carrier operation;
2. the reviewed source policy declares allowed evidence-bearing operations;
3. the runtime checks the observed operation against that policy;
4. reviewed evidence projects only when explicitly permitted;
5. disallowed transformed tokens may remain visible without the reviewed
   citation.

## Preferred ownership

The policy should belong to the reviewed source row or to a machine-readable
owner derived directly from that source row.

The RootMap builder should remain operator-agnostic.

A DA-specific conditional inside RootMap is rejected.

A DI-specific conditional inside RootMap is rejected.

## Initial policy direction

DA should not project reviewed evidence through:

- `final_swap`;
- `vowel_swap`.

The implementation lane must confirm the positive path for:

- `da`;
- `dam`;
- `damage`.

DI remains unchanged in this policy-only lane.

The later implementation lane must explicitly decide whether:

- `y_to_i`

is an allowed reviewed-evidence operation for DI.

## Evidence controls

Future DA controls should distinguish token presence from evidence presence.

For:

- `mode`;
- `made`;
- `dome`;

the expected target contract is:

- DA token may be present;
- reviewed DA evidence must be absent when the observed operation is not
  allowed.

## Status semantics

The following are not interchangeable:

- RootMap token status;
- reviewed evidence projection status;
- canonical lifecycle status.

DA being `canon_locked` does not authorize reviewed evidence for every
transformed DA-shaped token.

## Preserved boundaries

This review does not change:

- source rows;
- citations;
- evidence text;
- carrier operations;
- token discovery;
- RootMap selection;
- runtime projection;
- canonical profiles;
- DA lifecycle;
- DI lifecycle;
- API;
- UI;
- live smoke.

DA remains:

- `canon_locked`.

DI remains:

- `runtime_verified`.

## Next accepted lane

Open a separate implementation inspection and PR that identifies:

- the exact source-row field or derived policy owner;
- the exact operation type;
- representation of exact or empty operations;
- the `damage` path classification;
- the DI `study` path classification;
- generic fail-closed enforcement;
- stale tests to supersede;
- new evidence-absence controls;
- post-change live-smoke expectations.

No lifecycle mutation belongs in that implementation lane.
