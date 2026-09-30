# Open Instrument Albanian Northern-Tosk source profile v0.1

## Status

`SOURCE_PROFILE_ONLY`

This document records the provenance and bounded adapter boundary for the
public `stefanocoretta/alb-ipa` Northern Tosk Albanian research compendium.
It does not add phonological categories, Seven-Voice mappings, runtime lookup,
or production authority.

## Source identity

- Profile ID: `open-instrument.alb-ipa-northern-tosk.v2_2.v0_1`
- Repository: https://github.com/stefanocoretta/alb-ipa
- Repository commit used: `60855d1ffe6471bd9a3aa12aa03afdc11f36e690`
- Repository version: `v2.2`
- OSF research-compendium page: https://osf.io/vry3h/
- Downloaded archive: `data.zip`
- Download locator: https://osf.io/download/h4s6j/
- Archive bytes: `1544137143`
- Archive SHA-256: `aced72224e60b6f9a20f6dda831a1558ca9d4a906d53031f887f48328601572a`
- Data license: `CC-BY-4.0`
- Code license: `MIT` (the adapter does not treat this as the data license)

## Adapter boundary

The source archive contains Northern-Tosk recordings, metadata, word lists,
and aligned phone annotations. The adapter consumes only the aligned `KAN-MAU`
phone sequence for a word token and preserves the raw sequence, speaker,
variant/order, source locator, archive identity, repository commit, and
license metadata.

The source phone sequence is documented as language-independent SAMPA produced
for the G2P→MAUS alignment workflow. The adapter performs only the explicit
source-map normalization from those SAMPA labels to an IPA string. It does not
perform G2P, acoustic inference, word-specific rewriting, or source selection.

The normalized string is passed to the existing Albanian phonological-category
projector as a source-qualified phonemic transcription asserted by the source
phone map. This source-specific assertion does not alter the projector's
existing profile rules and does not authorize any Voice mapping.

## Scope and limitations

- Profile scope is exact Northern Tosk; it is not generic Tosk or generic
  Albanian.
- Speaker-level phone alignment is source evidence, not a new universal
  Albanian phonology claim.
- Unsupported or structurally unresolved IPA remains Null through the existing
  projector reasons.
- Audio is not bundled by this repository change.
- The OSF archive was acquired for local research execution; this document is
  provenance, not a redistribution authorization.

## Local execution measurement

The frozen OSF archive was parsed without modifying the archive. The adapter
used the five source sessions not marked `not used` (`s01`, `s02`, `s04`,
`s05`, `s06`) and consumed only non-empty paired `ORT-MAU`/`KAN-MAU`
intervals:

- 628 source observations
- 43 unique lexical forms
- 438 observations with a fully supported Northern-Tosk projection
- 30 forms represented among those supported observations
- 0 of those 30 supported forms were supported by the frozen Kaikki
  source-to-projector replay; net-new supported forms from this independent
  source: 30
- 190 observations remained Null/unresolved
- 921 canonical Voice events were produced by the existing pre-Voice bridge
  and quantizer for supported projections

The unresolved observations were retained as Null. Their observed existing
reason counts were `SYMBOL_AUTHORITY_MISSING=145` and
`NUCLEUS_STRUCTURE_UNRESOLVED=59`; these counts overlap when one observation
has both conditions. This is an execution measurement, not a new phonological
rule or production-runtime result.
