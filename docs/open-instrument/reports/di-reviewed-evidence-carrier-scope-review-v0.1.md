# DI Reviewed Evidence Carrier-Scope Review v0.1

Status: IMPLEMENTED_PENDING_REVIEW.

## Finding

The previous operation-aware evidence policy correctly separated token
discovery from operation authorization, but exact operation identity was not a
sufficient reviewed-evidence boundary.

The reviewed DI source directly attests:

- isolated form: `di`;
- bounded gloss: know / knowledge.

The proto-root inventory also contains:

- `dij`;
- `dije`;
- `dit`.

Before this change, all four forms received reviewed DI evidence when matched
through `exact`.

## Confirmed leakage

Runtime inspection confirmed:

- `dij` received the reviewed `di` citation;
- `dije` received the reviewed `di` citation;
- `dit` received the reviewed `di` citation despite:
  - `carrier_only` status;
  - a semantic-drift warning;
  - a do-not-over-claim note.

## Architecture decision

The existing source-derived operation policy is extended with:

- `allowedEvidenceCarrierForms`.

A second carrier-policy registry is not created.

RootMap already supplies the selected carrier form to the evaluator and
already attaches reviewed evidence only when that evaluator returns allowed.

Therefore no RootMap branch is required.

## DI decision matrix

| Runtime word | Selected carrier | Operation | Reviewed DI evidence |
| --- | --- | --- | --- |
| `di` | `di` | `exact` | allowed |
| `study` | `di` | `y_to_i` | allowed |
| `studim` | `di` | `exact` | allowed |
| `dij` | `dij` | `exact` | withheld |
| `dije` | `dije` | `exact` | withheld |
| `dit` | `dit` | `exact` | withheld |

For the withheld cases:

- the DI token remains visible;
- the selected carrier remains visible;
- operation diagnostics remain visible;
- non-citation weak-carrier warnings remain visible;
- reviewed citation metadata is absent.

## Profile proof coverage

DI positive proof words become:

- `di`;
- `study`;
- `studim`.

DI reviewed-evidence absence controls add:

- `dij`;
- `dije`;
- `dit`.

This increases runtime proof coverage without changing lifecycle status.

## Lifecycle decision

DA remains:

- `canon_locked`.

DI remains:

- `runtime_verified`.

DI canon-lock admission is not changed in this lane.

## Source-authority boundary

The current reviewed source is sufficient for bounded lexical projection of
isolated `di`.

It is not automatically treated as reviewed evidence for every DI proto-root
carrier.

Unresolved direct DPEWA/FGJSH locator or archive work remains relevant only to
stronger source-authority or historical-authority claims unless a later
review proves otherwise.

## Claim preservation

No historical, transmission, ownership, winner, superiority, scientific,
publication, or candidate-truth claim is added.

The result remains user-decidable.
