# Open Instrument Albanian phonological nucleus authority contract v0.1

Date: 2026-09-29

Status: `FROZEN_PRE_VOICE_AUTHORITY_CONTRACT_ONLY`.

Contract ID: `OPEN_INSTRUMENT_ALBANIAN_PHONOLOGICAL_NUCLEUS_AUTHORITY_CONTRACT_V0_1`.

Machine-readable contract:
`src/shared/openInstrument/albanianPhonologicalNucleusAuthority.v0_1.ts`.

This contract defines the bounded, profile-scoped authority layer between the
hash-bound Albanian pronunciation source contract and any later pronunciation
to Voice contract. It records what a reviewed linguistic authority may support
about a vowel category or nucleus structure. It does not create a runtime
parser or assign any canonical Seven Voice.

## Authority boundary

```text
SOURCE_IPA_OBSERVATION
  -> PROFILE_SCOPED_PHONOLOGICAL_INTERPRETATION
  -> EXISTING_MOVING_NUCLEUS_OBSERVATION_AUTHORITY (when applicable)
  -> future Voice-family classification (not defined here)
```

The following are invariants:

```text
PHONOLOGICAL_AUTHORITY != VOICE_AUTHORITY
PHONOLOGICAL_CATEGORY != CANONICAL_VOICE
SOURCE_IPA != AUTOMATIC_PHONOLOGICAL_CATEGORY
ADJACENT_VOWELS != AUTOMATIC_MOVING_NUCLEUS
GLIDE_ADJACENCY != AUTOMATIC_COMPLEX_NUCLEUS
```

This contract does not define IPA-to-Voice mapping, Voice-family anchors,
canonical Voice events, canonicalization, semantics, runtime integration,
G2P, or orthographic pronunciation authority.

## Source dependency and scope

The contract depends on the frozen source profile
`open-instrument.wiktionary-kaikki-albanian-ipa.v0_1` and preserves its scope
values:

```text
STANDARD_EXPLICIT
GHEG_EXPLICIT
TOSK_EXPLICIT
REGIONAL_EXPLICIT
ALBANIAN_UNSPECIFIED
```

`ALBANIAN_UNSPECIFIED != STANDARD_EXPLICIT`.

Scope is attached to the pronunciation observation only when the source
contract provides pronunciation-level evidence. Entry-level, sense-level,
etymology-level, usage-level, spelling, meaning, or geography-only information
does not become pronunciation scope automatically.

## Evidence model

A future observation record has these independent fields:

| Field | Meaning |
| --- | --- |
| `rawIpa` | The source IPA string, preserved byte-for-byte at the contract boundary. |
| `notationKind` | `PHONEMIC`, `PHONETIC`, or `UNSPECIFIED`; notation is not silently promoted. |
| `sourceScope` | A scope from the frozen Albanian source contract. |
| `phonologicalCategory` | A profile-scoped conceptual category, or `Null`. |
| `nucleusStructure` | A bounded structural state, including unresolved. |
| `features` | Length and nasalization preserved independently of category. |
| `authorityRefs` | Traceable reviewed authority references required for positive claims. |
| `reasonCodes` | Deterministic explanation for unresolved or rejected claims. |

The source fact “the source records IPA X” is not the phonological claim “X is
category Y.” A positive category or structure claim requires the source
observation, the profile, and reviewed authority references.

## Bounded phonological categories

The bounded conceptual inventory is a Standard/Northern-Tosk-oriented core
described by the reviewed feasibility work. These identifiers are phonological
categories, not Seven-Voice identifiers:

```text
HIGH_FRONT_UNROUNDED
HIGH_FRONT_ROUNDED
HIGH_BACK_ROUNDED
MID_FRONT_UNROUNDED
CENTRAL_MID
MID_BACK_ROUNDED
LOW_CENTRAL_OR_BACK
```

This is not a universal Albanian inventory and is not a universal lookup from
one IPA character to one category. Gheg, Tosk subvarieties, regional varieties,
phonetic realizations, loans, and notation conventions may require a narrower
profile or `Null`.

## Symbol interpretation policy

`SOURCE_IPA != AUTOMATIC_PHONOLOGICAL_CATEGORY`.

The reviewed evidence is bounded and profile-specific:

- `a` has core low-vowel evidence in relevant profiles;
- `ä` and `ɑ` are phonetic-realization evidence, not universal categories;
- `e` has core front-vowel evidence in relevant profiles;
- `ə` and `ɜ` have central-vowel evidence only under qualifying profile and
  notation authority;
- `i` has core high-front evidence;
- `o` and `ɔ` are profile/notation-dependent back-mid evidence;
- `u` has core high-back evidence;
- `y` has core high-front-rounded evidence;
- `ʏ` is a Northern-Tosk phonetic realization reported for `/y/`.

Observed symbols such as `ä`, `ã`, `æ`, `ɑ`, `ɒ`, `ê`, `ë`, `ẽ`, `ɘ`, `ɚ`,
`ɛ`, `ø`, `õ`, `ô`, `ʊ`, `ũ`, and other symbols not supported by the active
profile remain a phonetic observation, a profile-specific possibility, or
`Null`; they are not promoted by the generic coarse `ipaVowelMap`.

## Phonemic versus phonetic notation

```text
PHONEMIC_TRANSCRIPTION != PHONETIC_TRANSCRIPTION
```

Slash-delimited evidence may support a phonemic interpretation only when the
source convention and reviewed authority establish that reading. Bracketed
evidence remains phonetic realization evidence unless an authority explicitly
supports the relationship to a phonological category. A narrow phonetic symbol
does not become an independent phoneme merely because it has a distinct IPA
character.

## Length and nasalization

Length is an independent preserved feature:

```text
LENGTH_STATUS = PROFILE_DEPENDENT
```

The representation preserves `ː` and `ˑ` and does not strip them. Gheg
authority may support contrastive length under bounded profiles; Standard and
Northern Tosk evidence must not inherit Gheg length rules automatically.
Length alone does not create a new category or Voice event.

Nasalization is also an independent preserved feature:

```text
NASALIZATION_STATUS = PROFILE_DEPENDENT
```

Diacritics are not stripped. Gheg/profile-specific authority may support
phonological nasalization; Standard/Tosk must not inherit a Gheg nasal-vowel
rule automatically. Nasalization has no Voice effect in this contract.

## Nucleus structure

The structural vocabulary reuses the existing observation-authority concepts
without changing its validator:

```text
MONOPHTHONG_NUCLEUS
EVIDENCE_QUALIFIED_MOVING_NUCLEUS
SEQUENTIAL_NUCLEI
GLIDE_PLUS_NUCLEUS
NUCLEUS_PLUS_GLIDE
UNRESOLVED_NUCLEUS_STRUCTURE
```

Plain adjacent IPA vowels alone have no structural authority. Reviewed
one-nucleus evidence may support a one-nucleus claim. Reviewed hiatus/sequential
evidence may support `SEQUENTIAL_NUCLEI`. Conflicting or insufficient evidence
remains `UNRESOLVED_NUCLEUS_STRUCTURE`.

Southern Gheg literature reports profile- and lexically-conditioned
monophthongization involving sequences including `ie`, `ye`, `ua`, and `ue`.
This contract records that bounded research fact but defines no universal
string-rewrite rule.

## Glide policy

`j` may be treated as a consonantal/palatal approximant only where the active
profile and authority support that claim. `j` adjacency does not establish an
onglide, offglide, or complex nucleus. `w` remains unresolved without explicit
qualifying authority. Therefore:

```text
j_ADJACENCY_AUTHORITY = NO
w_ADJACENCY_AUTHORITY = NO
```

## Reuse of existing observation authority

The existing schema
`open-instrument.moving-nucleus-observation-authority.v0_1` remains the
observation seam. This Albanian contract supplies a new source profile and
profile-scoped phonological claims that can later be represented through that
seam. A literature-backed structural claim uses the existing
`PHONOLOGICALLY_DOCUMENTED` claim class; notation-only claims remain
`TRANSCRIPTION_ASSERTED` and do not establish movement by themselves.

The existing observation validator and canonicalizer are not modified or
invoked here. No Voice-family anchors are defined.

## Null and reason policy

Null is valid. The machine-readable contract uses these deterministic reasons:

- `PHONOLOGICAL_CATEGORY_UNRESOLVED`;
- `NUCLEUS_STRUCTURE_UNRESOLVED`;
- `PROFILE_AUTHORITY_MISSING`;
- `NOTATION_AUTHORITY_MISSING`;
- `SYMBOL_AUTHORITY_MISSING`;
- `CONFLICTING_PHONOLOGICAL_EVIDENCE`;
- `PLAIN_IPA_ADJACENCY_INSUFFICIENT`;
- `AUTHORITY_REFERENCE_MISSING`.

An unsupported symbol, unscoped realization, source/profile conflict, or
unresolved sequence is not forced into the nearest category.

## Firewalls

```text
ORTHOGRAPHIC_AUTHORITY = NO
G2P_AUTHORITY = NO
GENERIC_IPA_MAP = NOT_AUTHORITY
VOICE_MAPPING = NOT_DEFINED_HERE
CANONICALIZATION = NOT_AUTHORIZED_HERE
SEMANTIC_AUTHORITY = NO
```

The generic `src/shared/vowels/ipaVowelMap.v0.2.ts` is a coarse Seven-Voice
family map and is not sufficient Albanian phonological authority. It is not
modified or used to prove this contract.

## Reviewed authority references

The bounded findings are based on:

| ID | Authority | Bounded role |
| --- | --- | --- |
| `ICPhS-2003-THE-VOWELS-OF-STANDARD-ALBANIAN` | International Congress of Phonetic Sciences, *The Vowels of Standard Albanian*. https://www.internationalphoneticassociation.org/icphs-proceedings/ICPhS2003/p15_0659.html | Standard Albanian vowel system and regional variation. |
| `JIPA-NORTHERN-TOSK-ALBANIAN` | *Journal of the International Phonetic Association*, *Northern Tosk Albanian*. https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/northern-tosk-albanian/D27484BD90369B3BC0FBA9479074ED88 | Northern Tosk inventory, /j/, dialect scope, and vowel-sequence limits. |
| `PHON-2022-2025-SOUTHERN-GHEG-VOWELS` | Riverin-Coutlée et al., *Vowels in urban and rural Albanian: the case of Southern Gheg*. https://doi.org/10.1515/PHON-2022-2025 | Gheg length, nasalization context, and profile-conditioned monophthongization. |
| `GRANSER-MOOSMULLER-2001-SCHWA-IN-ALBANIAN` | Granser & Moosmüller, *The schwa in Albanian*. https://projects.ari.oeaw.ac.at/publications/2001_granser_moosmueller_the_schwa_in_albanian.pdf | Schwa variation by dialect and geography. |
| `UT-AUSTIN-INTRODUCTION-TO-ALBANIAN` | University of Texas at Austin, *Introduction to Albanian*. https://lrc.la.utexas.edu/eieol/albol/0 | Bounded instructional summary of Gheg/Tosk differences. |
| `CAMBRIDGE-BALKAN-LANGUAGES-PHONOLOGY` | *The Balkan Languages*, “Phonology.” https://www.cambridge.org/core/books/balkan-languages/phonology/AF89A4618B63980225363D64B2B38F4B | Comparative context for Gheg length/nasalization and variation. |

These sources do not establish Seven-Voice identity or canonicalization.

## Runtime status

```text
RUNTIME_LOOKUP = NOT_DEFINED
API_CHANGE = NO
CHAT_CHANGE = NO
HEART_MATH7_CHANGE = NO
IPA_TO_VOICE_MAPPING = NOT_DEFINED
MOVING_NUCLEUS_CANONICALIZATION = NOT_AUTHORIZED
G2P = NO
PRODUCTION_PROMOTION = NO
```
