# Open Instrument Albanian IPA Category Matrix Authority Contract v0.1

**Contract ID:** `OPEN_INSTRUMENT_ALBANIAN_IPA_CATEGORY_MATRIX_AUTHORITY_CONTRACT_V0_1`
**Version:** `v0.1`
**Status:** `FROZEN_AUTHORITY_CONTRACT_ONLY`
**Frozen on:** 2026-09-30

## 1. Purpose and boundary

This contract freezes reviewed authority for interpreting a bounded Albanian
IPA observation as one of the existing Open Instrument broad phonological
categories. It does not implement a projector and does not change the
source-observation adapter.

The authority chain is:

```text
SOURCE OBSERVATION
  → ALBANIAN PHONOLOGICAL CATEGORY AUTHORITY
  → future ZË-RO Voice interpretation
```

This contract operates only on the middle boundary. It is not:

- an IPA-to-Voice authority;
- a semantic or etymological authority;
- an orthographic pronunciation authority;
- a grapheme-to-phoneme authority;
- a moving-nucleus or canonicalization authority;
- a runtime or production pronunciation authority.

The current executable source-observation adapter preserves
`notationKind=UNSPECIFIED` for its observations. This contract therefore
freezes authority without making those observations eligible for positive
projection automatically.

## 2. Existing category vocabulary

The contract reuses the already-frozen category identifiers exactly:

- `HIGH_FRONT_UNROUNDED`
- `HIGH_FRONT_ROUNDED`
- `HIGH_BACK_ROUNDED`
- `MID_FRONT_UNROUNDED`
- `CENTRAL_MID`
- `MID_BACK_ROUNDED`
- `LOW_CENTRAL_OR_BACK`

These are project-level broad phonological categories. They are not the
canonical Seven Voices and do not imply a Voice mapping.

## 3. Profile vocabulary and scope

The source contract's profile vocabulary remains authoritative:

- `STANDARD_EXPLICIT`
- `GHEG_EXPLICIT`
- `TOSK_EXPLICIT`
- `REGIONAL_EXPLICIT`
- `ALBANIAN_UNSPECIFIED`

`ALBANIAN_UNSPECIFIED != STANDARD_EXPLICIT`.

Positive rules in this contract are scope-bound. An exact named variety such
as Northern Tosk is not silently widened to generic `TOSK_EXPLICIT`.

The following relations are not authorized by this contract:

- Northern → Gheg;
- Southern → Tosk;
- Kosovo → Gheg;
- Arbëresh → Tosk;
- Arvanitika → Tosk;
- Cham → Tosk.

`REGIONAL_EXPLICIT` remains the exact source label unless a later reviewed
authority explicitly licenses a relation.

## 4. Verified external authority registry

Every positive rule below is traceable to an independently resolvable
authority locator.

| Authority | Publication and locator | Authorized scope | Authorized claim |
| --- | --- | --- | --- |
| Sylvia Moosmüller and Theodor Granser | “The Vowels of Standard Albanian,” *Proceedings of the 15th International Congress of Phonetic Sciences*, Barcelona, 2003, pp. 659–662. [Stable PDF](https://projects.ari.oeaw.ac.at/publications/2003_moosmueller_granser_the_vowels_of_standard_albanian.pdf) | Standard Albanian | The bounded seven-vowel phonemic system and its broad vowel properties. |
| Stefano Coretta, Josiane Riverin-Coutlée, Enkeleida Kapia and Stephen Nichols | “Northern Tosk Albanian,” *Journal of the International Phonetic Association* 53(3), 2023, pp. 1122–1144. [DOI](https://doi.org/10.1017/S0025100322000044) | Northern Tosk only | Phonemic inventory, vowel qualities, and explicitly related phonetic realizations for the described Northern-Tosk profile. |
| Josiane Riverin-Coutlée, Enkeleida Kapia, Conceição Cunha and Jonathan Harrington | “Vowels in urban and rural Albanian: the case of the Southern Gheg dialect,” *Phonetica* 79(5), 2022, pp. 459–512. [DOI](https://doi.org/10.1515/phon-2022-2025) | Southern Gheg profile studied by the authors | Contextual /a/ rounding, phonological vowel length, monophthongization, and profile-specific variation. This source preserves a boundary; it does not authorize a generic Gheg matrix. |
| Victor A. Friedman and Brian D. Joseph | “Phonology,” Chapter 5 in *The Balkan Languages*, Cambridge University Press, 2025, pp. 359–494. [DOI](https://doi.org/10.1017/9781139019095.007) | Broader Albanian dialect phonology where explicitly scoped | Comparative and dialectological context. It may support a future bounded rule only when the exact profile and claim are explicit. |

An unverified, unresolved, or non-resolvable citation is not positive
authority. `UNVERIFIED_CITATION → INSUFFICIENT_AUTHORITY`.

## 5. Standard Albanian positive matrix

The following rules are authorized only for an observation whose preserved
profile is `STANDARD_EXPLICIT` and whose notation/status is established as
phonemic under the notation invariant below.

| IPA symbol | Phonological status | Category | Authority |
| --- | --- | --- | --- |
| `i` | phonemic | `HIGH_FRONT_UNROUNDED` | Moosmüller & Granser, ICPhS 2003, pp. 659–662 |
| `y` | phonemic | `HIGH_FRONT_ROUNDED` | Moosmüller & Granser, ICPhS 2003, pp. 659–662 |
| `u` | phonemic | `HIGH_BACK_ROUNDED` | Moosmüller & Granser, ICPhS 2003, pp. 659–662 |
| `e` | phonemic | `MID_FRONT_UNROUNDED` | Moosmüller & Granser, ICPhS 2003, pp. 659–662 |
| `ə` | phonemic | `CENTRAL_MID` | Moosmüller & Granser, ICPhS 2003, pp. 659–662 |
| `o` | phonemic | `MID_BACK_ROUNDED` | Moosmüller & Granser, ICPhS 2003, pp. 659–662 |
| `a` | phonemic | `LOW_CENTRAL_OR_BACK` | Moosmüller & Granser, ICPhS 2003, pp. 659–662 |

These are phonological category rules, not claims that every Standard
Albanian token has identical phonetic realization. A documented realization
variation of Standard `/ə/` or `/a/` does not create a new project category
automatically.

No generic positive rule is frozen here for `ɛ`, `ɔ`, `ɜ`, `ä`, `ɑ`, or any
other raw symbol under `STANDARD_EXPLICIT`.

## 6. Exact Northern-Tosk positive matrix

The following rules apply only when the source profile identifies the exact
Northern-Tosk variety covered by Coretta et al. They do not apply to generic
`TOSK_EXPLICIT`.

| IPA symbol | Phonological status | Category | Authority |
| --- | --- | --- | --- |
| `i` | phonemic | `HIGH_FRONT_UNROUNDED` | Coretta et al., JIPA 53(3), 2023, pp. 1122–1144 |
| `y` | phonemic | `HIGH_FRONT_ROUNDED` | Coretta et al., JIPA 53(3), 2023, pp. 1122–1144 |
| `u` | phonemic | `HIGH_BACK_ROUNDED` | Coretta et al., JIPA 53(3), 2023, pp. 1122–1144 |
| `e` | phonemic | `MID_FRONT_UNROUNDED` | Coretta et al., JIPA 53(3), 2023, pp. 1122–1144 |
| `ɜ` | phonemic | `CENTRAL_MID` | Coretta et al., JIPA 53(3), 2023, pp. 1122–1144 |
| `ɔ` | phonemic | `MID_BACK_ROUNDED` | Coretta et al., JIPA 53(3), 2023, pp. 1122–1144 |
| `a` | phonemic | `LOW_CENTRAL_OR_BACK` | Coretta et al., JIPA 53(3), 2023, pp. 1122–1144 |

### 6.1 Relation-qualified Northern-Tosk realizations

Only where the source observation and profile evidence explicitly establish
the relation described by Coretta et al., the following phonetic realizations
are authorized:

| Realization | Relation | Category | Scope |
| --- | --- | --- | --- |
| `ʏ` | identified realization of `/y/` | `HIGH_FRONT_ROUNDED` | exact Northern-Tosk profile only |
| `ä` | identified realization of `/a/` | `LOW_CENTRAL_OR_BACK` | exact Northern-Tosk profile only |
| `ɑ` | identified realization of `/a/` | `LOW_CENTRAL_OR_BACK` | exact Northern-Tosk profile only |

These are relation-qualified rules. They are not universal raw-symbol rules.

## 7. Gheg, Tosk, and regional boundaries

### 7.1 Generic Gheg

No generic positive `GHEG_EXPLICIT` matrix is frozen. The Riverin-Coutlée et
al. Southern-Gheg study supports a bounded boundary involving contextual
`/a/` rounding, vowel length, monophthongization, and profile-specific
variation. It does not authorize a generic Gheg raw-symbol mapping.

In particular, a contextual Southern-Gheg `[ɔ]` realization of `/a/` must not
be promoted to the independent generic rule `ɔ → MID_BACK_ROUNDED`.

Generic `GHEG_EXPLICIT` without the exact narrower authority required by a
rule resolves through existing profile-authority Null behavior.

### 7.2 Generic Tosk

The Northern-Tosk matrix above is not generic Tosk authority. Generic
`TOSK_EXPLICIT` without an exact reviewed narrower authority resolves through
existing profile-authority Null behavior.

### 7.3 Regional and unspecified profiles

`REGIONAL_EXPLICIT` without an exact reviewed regional match resolves through
existing profile-authority Null behavior. `ALBANIAN_UNSPECIFIED` also resolves
through existing profile-authority Null behavior. No source label is silently
collapsed into a macro-dialect.

## 8. Notation invariant

### `AUTHORIZATION_DOES_NOT_IMPLY_EXECUTABLE_NOTATION_RESOLUTION`

Scientific authorization in this document does not make a current source
observation eligible for positive projection.

- `PHONEMIC`: a positive category rule may execute only where phonemic
  notation and profile authority are established.
- `PHONETIC`: a positive category rule may execute only where the exact
  phonetic realization is explicitly related to an authorized phonological
  category, as in the bounded Northern-Tosk relations above.
- `UNSPECIFIED`: fail closed unless a separately frozen authority establishes
  a valid cross-notation relation.

The current adapter's `notationKind=UNSPECIFIED` must not be upgraded by
inspecting slash or bracket delimiters. This contract does not change the
adapter or freeze slash/bracket parsing semantics.

## 9. Conflict invariant

### `CONFLICTING_EXTERNAL_EVIDENCE_FAILS_CLOSED`

When admissible external authorities materially conflict for the same symbol,
profile, and notation/phonological-status condition, and the conflict cannot
be resolved by explicit scope, the phonemic/phonetic distinction, or another
already-frozen authority:

```text
RESULT = NULL
REASON = CONFLICTING_PHONOLOGICAL_EVIDENCE
```

There is no winner, averaging, majority vote, nearest-IPA resolution, or model
discretion.

## 10. Length and nasalization

Length and nasalization remain independent preserved features.

- Neither feature creates a new phonological category.
- Neither feature silently changes the base category.
- Gheg length or nasalization authority does not propagate to Standard or
  Tosk.
- A feature-bearing observation requires sufficient authority for its
  underlying/base category independently.
- No generic “strip `ː` and classify” operation is authorized.
- No generic diacritic-stripping operation is authorized.
- Raw source evidence remains preserved.

If the feature-bearing observation lacks the required base-category or
profile/notation authority, it resolves through the applicable existing Null
reason rather than through simplification.

## 11. Unsupported symbols and Null behavior

Observed symbols without sufficient reviewed authority fail closed. This
includes, unless an exact reviewed authority is later added:

`ɪ`, `ʊ`, `æ`, `ɒ`, `ɚ`, `ɘ`, `ë`, `ê`, `ô`, `ø`, and any other unsupported
symbol encountered by the source.

The contract does not infer `ɪ ≈ i`, `ʊ ≈ u`, `ɒ ≈ ɔ`, `æ ≈ a`, or any similar
relation from IPA geometry. Existing reason codes are reused:

- `PROFILE_AUTHORITY_MISSING`
- `SYMBOL_AUTHORITY_MISSING`
- `NOTATION_AUTHORITY_MISSING`
- `PHONOLOGICAL_CATEGORY_UNRESOLVED`
- `NUCLEUS_STRUCTURE_UNRESOLVED`
- `PLAIN_IPA_ADJACENCY_INSUFFICIENT`
- `CONFLICTING_PHONOLOGICAL_EVIDENCE`
- `AUTHORITY_REFERENCE_MISSING`

No new scientific reason code is introduced by this contract.

## 12. Adjacency, glides, and movement boundary

This contract preserves existing structural boundaries:

- plain adjacent vowels → `PLAIN_IPA_ADJACENCY_INSUFFICIENT`;
- unresolved glide/nucleus relation → existing unresolved-structure Null
  behavior;
- `j` or `w` adjacency does not establish a complex nucleus.

This contract does not authorize diphthong detection, hiatus detection,
moving-nucleus identification, sequential-nucleus identification, moving-
nucleus canonicalization, or canonical Voice events.

## 13. Citation verification invariant

Every positive frozen rule must have an independently resolvable author,
publication, year, page range, and DOI or stable locator in the authority
registry. If a future rule lacks a verifiable locator, it is
`INSUFFICIENT_AUTHORITY` and is not admissible as a positive rule.

## 14. Forbidden inferences and implementation boundary

This contract does not authorize:

- IPA → Seven-Voice mapping;
- semantic or etymological interpretation;
- orthographic pronunciation inference;
- G2P or Epitran fallback;
- pronunciation-variant winner selection;
- moving-nucleus or sequential-nucleus inference;
- runtime lookup or production promotion;
- changes to the source-observation adapter;
- changes to existing pronunciation, observation, canonicalization, API,
  chat, Heart, Math7, or baseline behavior.

The future projector may consume this authority only after it independently
proves profile and notation eligibility. This document alone does not make a
source observation projectable.

## 15. Truth hierarchy

- **Source observation:** the source records a raw IPA symbol and associated
  provenance/features.
- **Phonological authority:** this contract supplies a bounded category only
  when its profile, notation/status, relation, and citation conditions hold.
- **Null:** missing profile authority, missing symbol authority, missing
  notation authority, unresolved structure, or unresolved conflict remains a
  valid result.
- **Future ZË-RO interpretation:** outside this contract and not defined here.

No source frequency, IPA geometry, spelling pattern, semantic fact, or
etymological fact is a substitute for the frozen authority conditions.

## 16. Freeze declaration

`OPEN_INSTRUMENT_ALBANIAN_IPA_CATEGORY_MATRIX_AUTHORITY_CONTRACT_V0_1` is
frozen as documentation-only authority. It adds no executable projector,
does not modify the current `notationKind=UNSPECIFIED` adapter behavior, and
does not create IPA-to-Voice authority.
