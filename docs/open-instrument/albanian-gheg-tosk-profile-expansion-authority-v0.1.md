# Open Instrument Albanian Gheg/Tosk Profile Expansion Authority v0.1

**Contract ID:** `OPEN_INSTRUMENT_ALBANIAN_GHEG_TOSK_PROFILE_EXPANSION_AUTHORITY_V0_1`

**Version:** `v0.1`

**Status:** `FROZEN_PROFILE_EXPANSION_AUTHORITY_ONLY`

## 1. Boundary

This is an additive profile-qualified extension of the frozen Albanian IPA
category matrix. It operates on:

```text
SOURCE OBSERVATION
  → PROFILE-QUALIFIED ALBANIAN PHONOLOGICAL CATEGORY
  → existing pre-Voice bridge
```

It does not define Seven-Voice identity, moving-nucleus interpretation,
canonicalization, semantics, etymology, orthographic pronunciation, G2P, or
runtime/API behavior.

The existing broad category vocabulary is reused without renaming:

```text
HIGH_FRONT_UNROUNDED
HIGH_FRONT_ROUNDED
HIGH_BACK_ROUNDED
MID_FRONT_UNROUNDED
CENTRAL_MID
MID_BACK_ROUNDED
LOW_CENTRAL_OR_BACK
```

## 2. Exact profile qualifiers

The source adapter may emit a qualifier only from a conjunction of direct
pronunciation-level sound tags:

| Qualifier | Required direct tags | Not inferred from |
| --- | --- | --- |
| `NORTHERN_TOSK_EXPLICIT` | `Northern` and `Tosk` | spelling, geography alone, notes, entry/sense metadata |
| `SOUTHERN_GHEG_EXPLICIT` | `Southern` and `Gheg` | spelling, geography alone, notes, entry/sense metadata |

The qualifier is additive metadata. It does not turn an otherwise generic
`TOSK_EXPLICIT` or `GHEG_EXPLICIT` observation into a broader profile claim.
`ALBANIAN_UNSPECIFIED` remains distinct from `STANDARD_EXPLICIT`; a positive
projection requires the exact qualifier as well as the rule's notation and
structure conditions.

## 3. Northern-Tosk rules

For `NORTHERN_TOSK_EXPLICIT` and `PHONEMIC` notation, the following existing
categories are authorized:

| IPA | Category |
| --- | --- |
| `i` | `HIGH_FRONT_UNROUNDED` |
| `y` | `HIGH_FRONT_ROUNDED` |
| `u` | `HIGH_BACK_ROUNDED` |
| `e` | `MID_FRONT_UNROUNDED` |
| `ɜ` | `CENTRAL_MID` |
| `ɔ` | `MID_BACK_ROUNDED` |
| `a` | `LOW_CENTRAL_OR_BACK` |

For `PHONETIC` notation, only these relation-qualified realizations are
authorized:

| IPA | Relation | Category |
| --- | --- | --- |
| `ʏ` | realization of `/y/` | `HIGH_FRONT_ROUNDED` |
| `ä` | realization of `/a/` | `LOW_CENTRAL_OR_BACK` |
| `ɑ` | realization of `/a/` | `LOW_CENTRAL_OR_BACK` |

No raw-symbol rule is created for these phonetic realizations outside this
exact profile and relation.

Authority: Coretta, Riverin-Coutlée, Kapia and Nichols, “Northern Tosk
Albanian,” *Journal of the International Phonetic Association* 53(3), 2023,
pp. 1122–1144, DOI
https://doi.org/10.1017/S0025100322000044.

## 4. Southern-Gheg rules

For `SOUTHERN_GHEG_EXPLICIT` and `PHONEMIC` notation, the bounded oral-vowel
observations explicitly treated in the reviewed study authorize:

| IPA | Category |
| --- | --- |
| `i` | `HIGH_FRONT_UNROUNDED` |
| `y` | `HIGH_FRONT_ROUNDED` |
| `u` | `HIGH_BACK_ROUNDED` |
| `e` | `MID_FRONT_UNROUNDED` |
| `o` | `MID_BACK_ROUNDED` |
| `a` | `LOW_CENTRAL_OR_BACK` |

The study also documents contrastive length, nasalization, contextual
post-nasal `[ɔ]` realizations of `/a/`, and profile-conditioned
monophthongization. Those facts remain independent features or structural
authority boundaries; they do not authorize a raw `[ɔ] → MID_BACK_ROUNDED`
rule, universal diacritic stripping, or generic Gheg mappings.

Authority: Riverin-Coutlée, Kapia, Cunha and Harrington, “Vowels in urban and
rural Albanian: the case of the Southern Gheg dialect,” *Phonetica* 79(5),
2022, pp. 459–512, DOI https://doi.org/10.1515/phon-2022-2025. The paper's
Southern-Gheg oral vowel-space analysis explicitly includes `/i y u e o a/`;
its `/ə/` treatment is not admitted as a positive v0.1 rule here.

## 5. Generic profile and Null boundary

The following remain Null under the existing reason vocabulary:

- generic `GHEG_EXPLICIT` without `SOUTHERN_GHEG_EXPLICIT`;
- generic `TOSK_EXPLICIT` without `NORTHERN_TOSK_EXPLICIT`;
- regional labels without an exact reviewed profile qualifier;
- `ALBANIAN_UNSPECIFIED` without an exact qualifier;
- phonetic symbols without an explicit relation rule;
- unsupported symbols, unresolved features, and unresolved vowel structure.

No generic Northern → Gheg, Southern → Tosk, Kosovo → Gheg, Arbëresh → Tosk,
Arvanitika → Tosk, or Cham → Tosk collapse is authorized.

## 6. Invariants

```text
DIRECT_TAG_CONJUNCTION_ONLY = YES
GENERIC_GHEG_MATRIX = NO
GENERIC_TOSK_MATRIX = NO
ALBANIAN_UNSPECIFIED_IS_NOT_STANDARD = YES
ADJACENCY_IS_NOT_MOVING_NUCLEUS_AUTHORITY = YES
IPA_TO_VOICE_AUTHORITY = NO
RUNTIME_CHANGE = NO
```

Length and nasalization remain preserved independent features. No source-level
variant winner is selected. The existing projector, pre-Voice bridge, and
downstream quantizer remain the only executable seams.
