# Open Instrument — Seven-Voice Phonological Category Authority Contract v0.1

## Contract identity

- Contract ID: `OPEN_INSTRUMENT_SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_V0_1`
- Schema: `open-instrument.seven-voice-phonological-category-authority.v0_1`
- Version: `v0.1`
- Status: `FROZEN_CANONICAL_CATEGORY_QUANTIZER_ONLY`

This contract freezes the language-neutral, evidence-qualified phonological
category layer immediately before canonical Seven-Voice quantization. It does
not provide a pronunciation source, a dialect classifier, a grapheme-to-
phoneme system, a semantic system, or a moving-nucleus interpreter.

## Canonical Voice inventory

The canonical Voice inventory remains exactly:

`A, E, I, O, U, Y, Ë`

No additional Voice is created from IPA symbol count or from a phonological
category. `Y` remains a canonical Voice.

## Canonical category inventory

The only valid category inputs to the quantizer are:

`HIGH_FRONT_UNROUNDED`, `HIGH_FRONT_ROUNDED`, `HIGH_BACK`,
`MID_FRONT_UNROUNDED`, `CENTRAL_NON_CLOSE`, `MID_BACK`, `LOW_OPEN`.

These category IDs are language-neutral doctrine categories. They are not
aliases for the preserved Albanian pre-Voice category IDs, and this contract
does not edit or silently reinterpret the Albanian source contract.

The preserved Albanian source boundary remains explicit:
`ALBANIAN_UNSPECIFIED != STANDARD_EXPLICIT`.

## Category quantizer

| Evidence-qualified category | Canonical Voice |
| --- | --- |
| `HIGH_FRONT_UNROUNDED` | `I` |
| `HIGH_FRONT_ROUNDED` | `Y` |
| `HIGH_BACK` | `U` |
| `MID_FRONT_UNROUNDED` | `E` |
| `CENTRAL_NON_CLOSE` | `Ë` |
| `MID_BACK` | `O` |
| `LOW_OPEN` | `A` |

For every valid category, the quantizer returns exactly one canonical Voice.
The quantizer does not return Null for a valid category. Null remains valid at
the upstream observation/authority boundary when a category is not
evidence-qualified.

## Doctrine folds

The category folds are:

1. Open and near-open qualities fold to `LOW_OPEN`, then to `A`, regardless of
   backness or rounding.
2. Front rounded qualities fold to `HIGH_FRONT_ROUNDED`, then to `Y`,
   regardless of height.
3. Back vowels are distinguished by height; rounding does not create another
   Voice.
4. Close and near-close central unrounded qualities use
   `HIGH_FRONT_UNROUNDED`, while central rounded qualities use
   `HIGH_FRONT_ROUNDED`.
5. `ʌ` is an explicit exception: it is referenced as `CENTRAL_NON_CLOSE` and
   therefore quantizes to `Ë`. This exception does not generalize to `ɤ` or
   other back unrounded qualities.

## Reference symbol policy

This table is a frozen reference policy, not an unrestricted IPA parser and
not a dialect decision. It is only a reference for an upstream adapter that
already has authority to present a phonological category.

| Reference symbol | Category | Voice after quantization |
| --- | --- | --- |
| `i`, `ɪ` | `HIGH_FRONT_UNROUNDED` | `I` |
| `y`, `ʏ`, `ø`, `œ` | `HIGH_FRONT_ROUNDED` | `Y` |
| `e`, `ɛ` | `MID_FRONT_UNROUNDED` | `E` |
| `ɨ` | `HIGH_FRONT_UNROUNDED` | `I` |
| `ʉ` | `HIGH_FRONT_ROUNDED` | `Y` |
| `ɘ`, `ə`, `ɜ`, `ɵ`, `ɞ` | `CENTRAL_NON_CLOSE` | `Ë` |
| `ʌ` | `CENTRAL_NON_CLOSE` | `Ë` |
| `u`, `ʊ`, `ɯ` | `HIGH_BACK` | `U` |
| `o`, `ɔ`, `ɤ` | `MID_BACK` | `O` |
| `a`, `æ`, `ɑ`, `ɒ`, `ɐ`, `ɶ` | `LOW_OPEN` | `A` |

An unsupported symbol returns the reason code
`IPA_SYMBOL_NOT_QUANTIZABLE`. No nearest-vowel matching is authorized.

The only atomic reference rewrites are `ɚ → ə` and `ɝ → ɜ`. Rewrites are
normalization references; they are not category-to-Voice rules.

## Non-Voice features

Length, nasalization, stress, and tone remain pronunciation/prosodic metadata.
They do not change Voice identity and stress does not create a Voice event.
For example, `i` and `iː` may share `I`, and `a` and `ã` may share `A`, while
the metadata remains preserved by the upstream observation object.

## Authority chain and firewalls

The authorized conceptual chain is:

`RAW IPA / PRONUNCIATION`
→ `language/profile observation authority`
→ `evidence-qualified phonological category`
→ `category quantizer`
→ `canonical Voice`
→ `downstream canonicalization when separately authorized`

This contract does not parse raw IPA, determine dialect, segment a moving
nucleus, perform G2P, inspect spelling, assign semantics, infer etymology, or
invoke downstream canonicalization. `PHONOLOGICAL_CATEGORY_AUTHORITY` is not
`IPA_TO_VOICE_AUTHORITY` for arbitrary unreviewed input.

The legacy map at `src/shared/vowels/ipaVowelMap.v0.2.ts` remains
`LEGACY_COARSE_BUCKET` and non-authoritative. It is unchanged and has no
call-site migration in this lane.

The Albanian phonological-nucleus contract remains a pre-Voice contract. Its
previous `NO_GO` was valid under its prior authority state; this contract
records the posture `REOPEN_CONDITION_SATISFIED_BY_NEW_DOCTRINE_AUTHORITY`.
That posture does not create an Albanian bridge or runtime wiring.

## Null and reason boundary

Null is used when upstream authority cannot establish a valid category or
nucleus structure. The contract preserves these reason codes:

- `IPA_SYMBOL_NOT_QUANTIZABLE`
- `PHONOLOGICAL_CATEGORY_UNRESOLVED`
- `PROFILE_AUTHORITY_MISSING`
- `NUCLEUS_STRUCTURE_UNRESOLVED`

The category quantizer itself is total over the seven valid category IDs. A
valid category is never silently converted to Null.

## Explicit non-authorities

`ORTHOGRAPHIC_AUTHORITY = NO`

`G2P_AUTHORITY = NO`

`MOVING_NUCLEUS_AUTHORITY = NOT_DEFINED_HERE`

`IPA_TO_VOICE_AUTHORITY = NOT_DEFINED_HERE`

`SEMANTIC_AUTHORITY = NO`

Dialect classification, etymological authority, downstream canonicalization,
and Albanian runtime/API/chat/Heart/Math7 wiring are also not authorized here.

## Scope and next decision

This is a frozen canonical category quantizer contract only. It does not
authorize the Albanian bridge. The next decision input is
`SEVEN_VOICE_PHONOLOGICAL_CATEGORY_AUTHORITY_CONTRACT_FROZEN`.
