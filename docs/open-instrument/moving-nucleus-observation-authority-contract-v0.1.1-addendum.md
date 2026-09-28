# Open Instrument moving nucleus observation authority contract v0.1.1 addendum

Status: FROZEN_CONTRACT_ADDENDUM_PENDING_IMPLEMENTATION

Contract ID: `OPEN_INSTRUMENT_MOVING_NUCLEUS_OBSERVATION_AUTHORITY_CONTRACT_V0_1_1_ADDENDUM`

Parent contract:
`OPEN_INSTRUMENT_MOVING_NUCLEUS_OBSERVATION_AUTHORITY_CONTRACT_V0_1`

Parent contract path:
`docs/open-instrument/moving-nucleus-observation-authority-contract-v0.1.md`

Parent contract SHA-256:
`76b42a3c825d980c9a0bc68c7bfcd8e094ab892567c454c66609c7910ecb10d3`

## Scope

This addendum clarifies only the two unresolved contract questions identified
by PR #2028 review triage:

1. the disposition semantics of acoustic evidence;
2. the role and minimum integrity rules of `aggregateStatus`.

Every parent-contract clause not explicitly clarified here remains unchanged.
This addendum does not resolve or implement the separately identified F1, F2,
or F3 implementation defects. In particular, F2 must still implement the
preservation of competing scoped authorities described by the parent contract.

This addendum creates no canonicalization policy, acoustic threshold,
diphthong classifier, hiatus classifier, automatic Voice mapping, semantic
interpretation, Level-3/Level-4 authority, or production authority.

## F4 — disposition scope

`correctionExclusionState` describes the acoustic evidence/provenance bundle
used for one claim. It is not a per-sample scientific measurement result and
it is not an independent whole-record status.

The field remains located in acoustic provenance. The bundle may be referenced
by more than one claim, but the disposition never authorizes an unrelated claim
and never overrides claim-specific authority requirements.

## F4 — disposition semantics

The following rules apply to an acoustic authority attached to a claim:

| State | Retained for provenance | May positively support the claim | Additional requirement |
| --- | --- | --- | --- |
| `NONE` | Yes | Yes | All ordinary claim-specific acoustic provenance and QC requirements must pass. |
| `CORRECTED` | Yes | Yes | The correction must be traceable through stable evidence references or a stable locator, with the applicable method/settings/QC and uncertainty information preserved. |
| `EXCLUDED` | Yes | No | Preserve the record, but it cannot authorize a positive acoustic claim. |
| `UNRESOLVED` | Yes | No | Preserve the record, but it cannot authorize a positive acoustic claim. |

`qcState=PASS` is necessary but not sufficient for `NONE` or `CORRECTED`.
`qcState=FAIL` or `qcState=UNRESOLVED` cannot positively support a claim.

Excluded and unresolved evidence remains auditable evidence. Preservation does
not imply support, and the disposition does not select a competing source or
winner.

## F4 — corrected evidence traceability

`CORRECTED` requires traceable correction provenance. The minimum traceability
is an evidence reference or stable locator that identifies the correction
record or method, together with the existing acoustic provenance fields that
describe extraction, settings where applicable, QC, and uncertainty.

No correction algorithm, numeric threshold, sampling rule, or new scientific
measurement method is frozen by this requirement.

The reason-code inventory is unchanged. `SOURCE_SCOPE_CONFLICT` remains for
explicit scope conflict. `MEASUREMENT_PROVENANCE_MISSING` remains for missing
required provenance; this addendum does not repurpose either code as a new
disposition code.

## F5 — aggregate-status role

`aggregateStatus` is a deterministic, coarse integrity summary of the supplied
claim set. It is not an independent whole-record scientific assertion and it
does not establish any claim that is absent, unknown, unresolved, unsupported,
or unauthorized in the component records.

The aggregate is not an authority ranking, confidence score, vote, winner, or
precedence system.

## F5 — minimum mechanically enforced compatibility

Only the following compatibility rules are frozen:

1. `aggregateStatus=SUPPORTED` must not coexist with an explicitly
   `CONFLICTED` component claim.
2. `aggregateStatus=SUPPORTED` must have at least one component observation
   claim with positive support under its own claim-specific authority. It may
   coexist with unresolved or unknown non-supporting dimensions; the aggregate
   does not mean that every possible claim dimension is resolved.
3. `aggregateStatus=CONFLICTED` requires at least one explicitly conflicted
   component claim and the existing `SOURCE_SCOPE_CONFLICT` reason code.
4. A conflicted component retains both competing scoped authorities and their
   evidence under the parent conflict policy. No winner may be selected.

For this purpose, a positive component claim is one of:

- a nucleus structure claim with `ONE_NUCLEUS` or `SEQUENTIAL_NUCLEI` and valid
  claim-specific authority;
- a movement claim with `OBSERVED` or `NOT_OBSERVED` and valid claim-specific
  authority;
- a phonetic-anchor claim with state `SUPPORTED` and valid authority;
- a Voice-family-anchor claim with state `SUPPORTED` and valid reviewed mapping
  authority.

The aggregate does not summarize `canonicalizationStatus`. Observation support
does not authorize canonicalization.

## F5 — intentionally unspecified combinations

This addendum does not freeze precedence or a complete state machine for
`UNKNOWN`, `UNRESOLVED`, and `UNSUPPORTED`, nor does it decide which claim
dimensions are mandatory for a particular observation record. Mixed records
involving those states remain claim-specific and must not be normalized into a
winner or positive claim without a later contract decision.

The absence of a full precedence matrix is intentional. The parent contract
does not define one, and adding it would be a new scientific/authority policy
rather than a mechanical integrity repair.

## Boundaries preserved

The following remain unchanged:

```text
CANONICALIZATION_POLICY_CREATED=NO
PHONETIC_TO_VOICE_AUTO_MAPPING=NO
MOVEMENT_THRESHOLD_CREATED=NO
DIPHTHONG_CLASSIFIER_CREATED=NO
HIATUS_CLASSIFIER_CREATED=NO
SEMANTICS_CREATED=NO
LEVEL3_CHANGED=NO
LEVEL4_CHANGED=NO
PRODUCTION_AUTHORITY_CREATED=NO
```

The existing claim-specific authority classes remain non-substitutable. F3's
claim-specific trajectory repair must not be replaced by this disposition
clarification.
