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

Therefore the v0.1 structural grammar floor is:

`2`

This contract does not invent a new lexical threshold.

It uses the minimum form size already permitted by the structural operation grammar.

## Minimum-anchor family gate

After operation-level and structural-support filtering, a structural hypothesis family is emit-eligible only when at least one surviving terminal reaches:

`embryoSize = 2`

The smallest surviving terminal is the family anchor.

If the smallest surviving terminal has size greater than 2, the family has not reached the v0.1 structural grammar floor and is not emitted as `StructuralHypothesisV0_1`.

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

Once a family contains a size-2 anchor, larger sibling hypotheses that already passed the operation-support gate may remain visible.

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

The following inspected terminals have minimum size greater than 2 and must not be emitted as structural hypotheses in v0.1:

- `STUDY → UDY` — size 3
- `FATHER → ATH` — size 3
- `PHILOSOPHY → ILOSOPHY` — size 8
- `MATHEMATICS → ATHEMAT` — size 7
- `LANGUAGE → ANGU` — size 4
- `TERROR → ERR` — size 3
- `SISTER → IST` — size 3

Their mechanical reduction paths may be internally reachable during search.

They do not produce emitted `StructuralHypothesisV0_1` rows because the family never reaches the v0.1 minimum structural anchor.

## TERROR boundary

The existing TERROR control requires:

- no embryo `ER`
- no embryo `TER`
- no `TERR → TER` operation

It does not require `ERR` to be emitted.

Therefore suppression of the size-3 `ERR` terminal by this minimum-anchor gate is compatible with the existing deterministic reduction contract.

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

### PHILOSOPHY

ILOSOPHY does not reach the minimum anchor.

No structural candidate.

Baseline Null remains Null unless some separate stronger architecture changes it.

### MATHEMATICS

ATHEMAT does not reach the minimum anchor.

No structural candidate.

### LANGUAGE

ANGU does not reach the minimum anchor.

No structural candidate.

### TERROR

ERR does not reach the minimum anchor.

No structural candidate is required.

The existing no-ER/no-TER safety boundary remains mandatory.

## `minimum_defensible_embryo_reached`

This reason code must only describe a hypothesis at the structural grammar floor for v0.1.

Therefore an emitted minimum anchor carrying:

`minimum_defensible_embryo_reached`

must have:

`embryoSize = 2`

A size-3, size-4, size-7, or size-8 terminal must not receive this reason code as an emitted structural hypothesis.

## Null

Null remains a valid result.

Failure to reach the minimum structural anchor is a valid reason for structural discovery to produce no emitted hypothesis family.

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
