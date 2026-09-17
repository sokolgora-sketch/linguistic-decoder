# ZË-RO structural minimum-anchor and public projection contract v0.1

Date: 2026-08-26

Status: IMPLEMENTED_CONTRACT.

## Purpose

This contract separates three deterministic stages:

1. mechanically reachable structural reductions
2. emit-eligible structural hypothesis families
3. public analyze-v1 structural candidate projection

These stages are not equivalent.

A mechanically reachable terminal does not automatically become an emitted hypothesis.

An emitted structural hypothesis does not automatically become a public candidate beside stronger existing truth.

## Existing operation floor

The deterministic structural reduction grammar already requires a resulting structural form to contain at least two Unicode symbols.

Therefore the lower bound for a v0.1 structural family anchor is:

`2`

This contract does not invent a lexical threshold.

It uses the smallest defensible terminal already permitted by the structural
operation grammar, while preserving the lower bound of two symbols.

## Minimum-anchor family gate

After operation-level and structural-support filtering, a structural hypothesis
family is emit-eligible when its smallest surviving terminal reaches the
structural grammar floor:

`embryoSize >= 2`

The smallest surviving terminal is the family anchor, whether its size is 2 or
larger.

If the smallest surviving terminal has size 1, the family is not emitted as
`StructuralHypothesisV0_1`.

This is structural compactness only.

It does not imply:

- lexical meaning
- lexical attestation
- historical origin
- historical transmission
- reviewed evidence
- candidate truth
- semantic truth

## Family behavior

Once a family contains a minimum anchor of size 2 or larger, larger sibling
hypotheses that already passed the operation-support gate may remain visible.

Therefore:

`STERILE`

may emit:

1. `ER`
2. `ERILE`

because `ER` anchors the family at the grammar floor.

`ERILE` does not independently claim to be the smallest embryo.

It remains a larger competing structural hypothesis under the no-single-winner posture.

## Required internally emitted families

The following must remain structurally discoverable:

### STERILE

`STERILE → STER → TER → ER`

Minimum anchor:

`ER`

Size:

`2`

Sibling:

`ERILE`

### STER

`STER → TER → ER`

Minimum anchor:

`ER`

Size:

`2`

This remains the genericity proof that ER is not a STERILE lookup.

### SYË

`SYË → YË`

Minimum anchor:

`YË`

Size:

`2`

This preserves canonical Y and Ë.

### DAMAGE

The generic reduction search may still discover:

`AM`

Size:

`2`

This remains structural only and must not replace or compete with stronger reviewed DAMAGE truth in the public candidate surface.

### GJAK

The generic structural rules may derive:

`AK`

Size:

`2`

If no stronger status-driving layer exists, this is allowed to remain a public structural hypothesis with independent meaning Unknown.

This is a genericity consequence, not reviewed Albanian evidence and not a lexical claim about AK.

## Families that do not reach the v0.1 minimum anchor

Families with a defensible minimum terminal of size 2 or larger are now
eligible for structural emission. A mechanically reachable terminal is still
not sufficient: the existing operation-support gate remains mandatory.

The following previously inspected terminals remain useful controls because
their reachability or support must be evaluated by the unchanged pre-gate
rules rather than by terminal length alone:

- `STUDY → UDY` — size 3
- `FATHER → ATH` — size 3
- `PHILOSOPHY → ILOSOPHY` — size 8
- `MATHEMATICS → ATHEMAT` — size 7
- `LANGUAGE → ANGU` — size 4
- `TERROR → ERR` — size 3
- `SISTER → IST` — size 3

Their mechanical reduction paths may be internally reachable during search.
They produce an emitted row only if they already pass the existing
defensibility gate and their minimum terminal is at least two symbols.

## TERROR boundary

The existing TERROR control requires:

- no embryo `ER`
- no embryo `TER`
- no `TERR → TER` operation

It does not require `ERR` to be emitted.

Therefore the existing no-ER/no-TER safety boundary remains independent of
whether a defensible size-3 terminal is eligible for emission.

## ERROR boundary

ERROR must not manufacture ER by deleting a final R.

No change.

## SISTER boundary

SISTER must not manufacture ER merely because its surface ends in ER.

Suppression of `IST` by the minimum-anchor gate is compatible with this control.

## Public projection boundary

Even an emit-eligible structural hypothesis family is lower-precedence than existing status-driving truth.

Before structural hypotheses are projected into the public analyze-v1 candidate list, the adapter must evaluate the baseline deterministic result without those structural hypotheses.

Structural hypotheses may be projected publicly only when:

`baseline analysisStatusV0_1.status === "null_no_supported_candidate"`

This is the gap-filling projection rule.

## Stronger owners

Public structural projection must be suppressed when the baseline result is already:

- `reviewed_functional_evidence`
- `candidate_only`
- `structural_unreviewed` from existing RootMap structure

This suppression affects public projection only.

It does not turn the structural reduction into evidence against the hypothesis.

## Required public preservation

The existing public candidate surfaces for these stronger-owner words remain unchanged by structural discovery:

- study
- father
- damage
- data
- dij
- mode

In particular:

- STUDY must not publicly gain UDY
- FATHER must not publicly gain ATH
- DAMAGE must not publicly gain AM

The reviewed/canonical/RootMap owners remain authoritative.

## Required public gap cases

### STERILE

Baseline before logic-derived structural projection:

`null_no_supported_candidate`

After projection:

`structural_unreviewed`

Structural candidates:

1. ER
2. ERILE

### GJAK

When its baseline remains unsupported and the generic structural family reaches size-2 anchor AK:

`AK`

may fill the structural gap.

Its meaning remains Unknown.

It is not reviewed evidence.

### Previously inspected variable-length families

The following previously inspected families now emit their smallest defensible
terminal when the unchanged operation-support gate accepts it:

- `STUDY → UDY` — size 3
- `FATHER → ATH` — size 3
- `PHILOSOPHY → ILOSO` — size 5, with `ILOSOPHY` remaining as a larger sibling
- `MATHEMATICS → ATHEMAT` — size 7
- `LANGUAGE → ANGU` — size 4
- `TERROR → ERR` — size 3
- `SISTER → IST` — size 3

These rows remain structural hypotheses only. They do not receive independent
meaning, lexical attestation, historical origin, or candidate truth.

The existing no-ER/no-TER safety boundary remains mandatory.

## `minimum_defensible_embryo_reached`

This reason code describes the smallest defensible emitted hypothesis at the
structural grammar floor for v0.1.

Therefore an emitted minimum anchor carrying:

`minimum_defensible_embryo_reached`

must have:

`embryoSize >= 2`

A size-1 terminal must not receive this reason code or be emitted as a
structural hypothesis.

## Null

Null remains a valid result.

Failure to produce a defensible minimum anchor of at least two symbols is a
valid reason for structural discovery to produce no emitted hypothesis family.

## No shortcuts

This contract does not authorize:

- STERILE-specific branching
- GJAK-specific branching
- ER registration
- AK registration
- proto-root registration
- canonical operator registration
- reviewed-source registration
- lexical gloss generation
- historical-origin claims
- evidence promotion

## Determinism

The minimum-anchor decision and public projection decision must be deterministic.

No provider.

No randomness.

No lexical lookup.

No historical lookup.
