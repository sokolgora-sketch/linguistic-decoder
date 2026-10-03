# Open Instrument / ZË-RO — Consonantal Structural Composition Rule v0.1

CONTRACT_ID=OPEN_INSTRUMENT_ZERO_CONSONANTAL_STRUCTURAL_COMPOSITION_V0_1
VERSION=v0.1
STATUS=FROZEN_ZË-RO_STRUCTURAL_INTERPRETATION_CONTRACT_ONLY
CLAIM_LEVEL=ZË-RO_STRUCTURAL_INTERPRETATION
EXTERNAL_LINGUISTIC_AUTHORITY_REQUIRED=NO
RUNTIME_IMPLEMENTATION=NO

## 1. Purpose and boundary

This contract freezes the first project-defined deterministic ZË-RO
composition rule that makes the already-authorized pronunciation-derived
consonantal configuration computationally consequential.

It consumes the frozen consonantal configuration Γ from
OPEN_INSTRUMENT_CONSONANTAL_CONFIGURATION_AUTHORITY_V0_1 and defines:

ZC_v0_1(Γ) = <P, I, S, D, A, R>

This is a ZË-RO structural interpretation and engineering rule. It is not
established linguistic fact, externally validated consonant semantics,
historical etymology, phonological analysis, individual consonant meaning, or
Level-3 truth. The user decides how much interpretive weight to give it.

The authority chain remains:

SOURCE OBSERVATION
  -> FROZEN CONSONANTAL CONFIGURATION Γ
  -> DETERMINISTIC DERIVATION ZC_v0_1(Γ)
  -> ZË-RO STRUCTURAL INTERPRETATION

No later arrow is authorized by this contract.

## 2. Admissible input

The only admissible input is a valid frozen configuration Γ containing the
existing bundled CMUdict-derived spoken-pronunciation source, normalized
source segments, source nuclei, canonical Voice anchors, and retained
variant/provenance fields.

The configuration authority remains the source of:

- exact consonant identities and sourceUnits;
- source segment indices;
- source nuclei and their source order;
- canonical Voice anchors;
- source profile, notation, revision, variant identity, and variant order.

No spelling, orthographic cluster, G2P result, semantic lookup, etymology,
phonological equivalence class, research artifact, provider output, or FRD-02
output is admissible input.

### 2.1 Validity boundary for Γ

Γ is valid for ZC_v0_1 only when the existing consonantal configuration
authority has produced a defined configuration from authorized normalized
pronunciation segments. This rule does not parse raw CMUdict rows or repair
source loading. An unrecognized inline annotation, comment token, malformed
source unit, or other token that the existing authority has not authorized as
a pronunciation segment invalidates Γ for this rule and produces Null.

ZC_v0_1 does not strip, split, or reinterpret such a token as a consonant.
Future corpus validation must preserve this fail-closed boundary and report
invalid/Null rows separately; it must not count annotation text as consonant
load. Any alternate corpus eligibility rule requires a separately frozen
authority and is outside this contract.

## 3. Formal rule

### P — PREFIX LOAD

P is the number of consonant source segments in SOURCE_PREFIX_REGION.

P is a non-negative integer.

### I — INTER-NUCLEUS LOAD VECTOR

I is the ordered vector of consonant source-segment counts for every
SOURCE_INTER_NUCLEUS_REGION, in source-nucleus order.

Zero-length regions are preserved. If Γ has N source nuclei:

length(I) = max(N - 1, 0)

For one source nucleus, I = [].

I is not collapsed into one aggregate count.

### S — SUFFIX LOAD

S is the number of consonant source segments in SOURCE_SUFFIX_REGION.

S is a non-negative integer.

### D — DISTRIBUTION VECTOR

D is the complete ordered consonantal load topology:

D = [P, ...I, S]

D is structural only. No particular D shape receives a semantic meaning.

### A — EDGE ASYMMETRY

A is the signed structural difference:

A = P - S

Positive, zero, and negative values are orientation descriptors only. They do
not mean semantic polarity, value, gender, energy, direction, or function.

### R — IDENTITY RECURRENCE

R preserves repeated exact consonant source identities within Γ. It is not a
boolean.

The identity of a consonant source segment is its exact ordered sourceUnits
array. Two identities are equal only when their sourceUnits arrays have equal
length and equal string values at every position. No phonological equivalence
class is introduced.

R is an ordered vector of recurrence records:

{
  identity: exact sourceUnits array,
  segmentIndices: exact source segment indices in source order,
  occurrenceCount: number of participating source segments
}

Only identities occurring more than once receive a recurrence record. Records
are ordered by the first participating segmentIndex, with exact identity
ordering as a deterministic fallback. Within each record, segmentIndices are
ascending source positions and occurrenceCount equals their length.

If no consonant identity repeats, R = [].

## 4. Configuration identity and Voice relation

ZC_v0_1 is a deterministic structural projection from Γ. It does not replace
Γ, which remains authoritative and retains exact identities, sourceUnits,
source positions, source nuclei, Voice anchors, variants, and provenance.

The conceptual relation is:

Γ -> ZC_v0_1(Γ)

The projection may be lossy because Γ remains the authoritative structural
source.

The canonical Seven-Voices path remains vowel-driven:

R_ZËRO = (V, Γ, ZC_v0_1(Γ))

V is the existing canonical spoken Voice path. ZC_v0_1 does not alter V,
create Voice events, or allow consonants to drive the canonical Voice path.

## 5. Moving-nucleus boundary

Source nuclei, not expanded canonical Voice events, define consonantal regions.
The existing moving-nucleus mappings therefore remain:

OW -> [O,U]
EY -> [E,I]
AY -> [A,I]
OY -> [O,I]
AW -> [A,U]

These mappings do not create an inter-nucleus region inside one source
nucleus. For S T OW1 N, the source nuclei are [OW1], not [O,U].

## 6. Required control vectors

The following are deterministic test vectors only:

| Input pronunciation | V | P | I | S | D | A | R |
| --- | --- | ---: | --- | ---: | --- | ---: | --- |
| S T OW1 N | [O,U] | 2 | [] | 1 | [2,1] | 1 | [] |
| HH OW1 M | [O,U] | 1 | [] | 1 | [1,1] | 0 | [] |
| M AH1 DH ER0 | [Ë,Ë] | 1 | [1] | 0 | [1,1,0] | 1 | [] |
| S T AH1 D IY0 | [Ë,I] | 2 | [1] | 0 | [2,1,0] | 2 | [] |
| W AO1 T ER0 | [O,Ë] | 1 | [1] | 0 | [1,1,0] | 1 | [] |
| K AE1 T | [A] | 1 | [] | 1 | [1,1] | 0 | [] |
| M EY1 K | [E,I] | 1 | [] | 1 | [1,1] | 0 | [] |
| T AY1 M | [A,I] | 1 | [] | 1 | [1,1] | 0 | [] |
| N EY1 M | [E,I] | 1 | [] | 1 | [1,1] | 0 | [] |

STONE and HOME have the same existing Voice path but distinct Γ and ZC
values. This does not authorize a semantic difference.

For the existing bundled pronunciation BANANA, B AH0 N AE1 N AH0:

P=1
I=[1,1]
S=0
D=[1,1,1,0]
A=1
R=[{ identity: ["N"], segmentIndices: [2,4], occurrenceCount: 2 }]

This recurrence record preserves source identity and position only.

## 7. Null and variant behavior

If Γ is Null because authoritative pronunciation/configuration is unavailable:

ZC_v0_1(Γ)=NULL

NULL is not ZERO_CONFIGURATION. No zero vector is fabricated, and spelling or
legacy consonant extraction is never used as fallback.

The rule does not select pronunciation winners. Where retained variants have
defined configurations, ZC_v0_1 may be derived independently per variant,
preserving variantId and variantOrder. Where the authoritative top-level
pronunciation result is Null because variants are unresolved or ambiguous, the
top-level ZC result is Null.

## 8. Legitimacy gates

The contract freezes these gates:

G1 DETERMINISTIC
Same valid Γ produces the same ZC_v0_1.

G2 PREDECLARED
The rule is frozen before corpus-scale validation.

G3 SOURCE-BOUNDED
Only facts already present in Γ are used.

G4 NULL-CAPABLE
Unavailable Γ produces Null, never fabricated output.

G5 PROVENANCE-BEARING
The result remains traceable to Γ and its pronunciation provenance.

G6 CLAIM-LABELED
The result is explicitly a ZË-RO structural interpretation, not external
linguistic fact.

G7 BOUNDED
No individual consonant meaning, semantic claim, invented phonology,
orthographic fallback, historical inference, Level-3 mutation, or functional
bridge is introduced.

G8 WORD-INDEPENDENT
The derivation contains no target-word branch, lexical exception, semantic
lookup, or special handling for any example word.

## 9. Anti-tuning and future validation

This v0.1 rule is frozen before corpus-scale validation. The contract version,
exact definitions, and test vectors are the execution identity for a future
validation lane. A result-motivated rule modification requires a new version;
v0.1 must not be tuned toward a desired distribution or interpretation.

No corpus validation is executed in this lane.

The planned first validation source is the exact existing bundled
CMUdict-derived English pronunciation revision, exhaustively over its
predeclared eligible population rather than a handpicked word list. That
future lane may report eligible and Null counts, variant handling, P/I/S/D/A/R
distributions, exact Γ/ZC signatures, same-Voice/different-ZC cases, and
same-ZC/different-Voice cases. No semantic conclusion is required.

Albanian remains a separate future cross-language lane. Kabashi response is
not required for this contract freeze.

## 10. Explicit non-authority

This contract does not authorize:

- external linguistic fact claims;
- phonological or phonetic classification;
- onset, coda, syllable, CV, VC, CVC, or cluster claims;
- place, manner, voicing, sonority, or articulatory feature inference;
- individual consonant meaning or consonant shade semantics;
- semantic polarity, function, word meaning, etymology, origin, or cognacy;
- orthographic-to-pronunciation inference or G2P;
- pronunciation variant winner selection;
- automatic candidate generation or functional composition;
- Level-3 modification;
- FRD-02 execution or production promotion;
- runtime, API, /chat, provider, or corpus execution in this lane.

## 11. Freeze declaration

SOURCE_CONFIGURATION_INPUT=OPEN_INSTRUMENT_CONSONANTAL_CONFIGURATION_AUTHORITY_V0_1
ZC_RULE_FROZEN=YES
ZC_RULE_VERSION=v0.1
CLAIM_LEVEL=ZË-RO_STRUCTURAL_INTERPRETATION
EXTERNAL_LINGUISTIC_FACT=NOT_CLAIMED
SEMANTIC_FUNCTION=NOT_CLAIMED
PHONOLOGICAL_ANALYSIS=NOT_CLAIMED
VOICE_PATH_CHANGED=NO
LEVEL3_CHANGED=NO
RUNTIME_IMPLEMENTATION=NO
CORPUS_VALIDATION_EXECUTED=NO
ALBANIAN_VALIDATION_EXECUTED=NO
KABASHI_RESPONSE_REQUIRED=NO

This contract freezes the rule and its boundaries only. It does not implement
the rule or authorize the next implementation lane automatically.
