# ZË-RO deterministic structural reduction operation contract v0.1

Date: 2026-08-25

Status: IMPLEMENTED_CONTRACT.

## Purpose

This contract defines the first bounded deterministic operation grammar for logic-first structural hypothesis discovery.

It exists to prove that ZË-RO can perform embryo surgery without:

- arbitrary letter stripping
- lexical-evidence prerequisites
- historical-morphology claims
- proto-root shortcuts
- canonical-operator shortcuts
- STERILE-specific branching

The operations generate structural hypotheses only.

They do not assign lexical meaning.

## Existing architecture inspection

The current DR1 segmenter performs deterministic contiguous segmentation.

It does not perform structural edge reduction.

The current carrier-operation vocabulary is designed for carrier/evidence matching and includes operations such as:

- exact
- vowel swap
- Y → I
- final swap
- S ↔ SH
- G ↔ GJ
- optional H/J
- compound

That vocabulary does not currently define structural edge peeling.

Structural discovery therefore requires a separate operation namespace.

The carrier matcher must not become the Seven-Voices authority for this lane.

The canonical Seven-Voices authority remains:

`src/shared/math7.core.ts`

and specifically:

`extractSevenVowelsFromString(...)`.

This preserves:

A, E, I, O, U, Y, Ë.

## New operation namespace

Structural reduction operations must remain separate from reviewed lexical carrier operations.

Initial operation IDs:

- `peel_right_vowel_led_expansion`
- `peel_left_consonant_frame`

No generic `delete` operation is authorized.

No internal deletion operation is authorized.

## Operation 1 — peel_right_vowel_led_expansion

Purpose:

Remove one bounded terminal expansion while preserving a contiguous left stem.

Contract:

1. removal occurs only at the right edge
2. removed suffix length is 2 or 3 Unicode characters
3. first character of the removed suffix must map to a canonical Seven Voice
4. removed suffix must contain at least one consonantal/non-voice symbol
5. resulting form must contain at least one canonical Seven Voice
6. resulting form length must be at least 3
7. no characters may be rearranged
8. no internal deletion is permitted
9. at most one such operation may occur in one v0.1 reduction chain
10. every accepted operation records the exact removed span and before/after Seven-Voices paths

For:

`STERILE`

the suffix:

`ILE`

is structurally eligible because:

- it is a contiguous right-edge suffix
- length = 3
- it begins with canonical voice I
- it contains consonantal frame L
- removing it leaves `STER`
- `STER` retains canonical voice E

Therefore this edge may be generated:

`STERILE → STER`

This is structural surgery only.

It is not a historical suffix claim.

## Operation 2 — peel_left_consonant_frame

Purpose:

Reduce an outer consonantal frame while preserving the same vowel authority.

Contract:

1. remove exactly one character
2. removal occurs only at the left edge
3. removed character must not be a canonical Seven Voice
4. resulting form length must be at least 2
5. resulting form must contain at least one canonical Seven Voice
6. Seven-Voices path before and after must be exactly equal
7. no internal deletion is permitted
8. no vowel removal is permitted by this operation
9. at most two consecutive left-frame peels may occur in one v0.1 chain
10. every accepted operation records exact span and before/after voice paths

This rule encodes the ZË-RO distinction:

**Vowels drive the Seven-Voices path; consonants may shape the structural frame.**

For:

`STER → TER`

the removed S is consonantal and:

`E → E`

is unchanged.

For:

`TER → ER`

the removed T is consonantal and:

`E → E`

is unchanged.

Therefore both edges may be generated.

Once the form becomes:

`ER`

the leading E is a canonical voice.

The operation must stop.

This gives a deterministic stopping rule.

## STERILE proving chain

Under the two authorized structural operations:

`STERILE → STER → TER → ER`

may be generated without any word-specific branch.

Reduction order:

1. `STERILE → STER`
   - operation: `peel_right_vowel_led_expansion`
   - removed: `ILE`
   - span: `[4, 7)`
   - voices: `E-I-E → E`

2. `STER → TER`
   - operation: `peel_left_consonant_frame`
   - removed: `S`
   - span: `[0, 1)`
   - voices: `E → E`

3. `TER → ER`
   - operation: `peel_left_consonant_frame`
   - removed: `T`
   - span: `[0, 1)`
   - voices: `E → E`

Expansion presentation is the reverse:

`ER → TER → STER → STERILE`

## ER truth boundary

The resulting ER candidate is:

- a structural hypothesis
- not reviewed lexical evidence
- not a production proto-root
- not a canonical operator
- not historical morphology
- not a historical-origin claim
- not a candidate-truth claim

Its independent standalone meaning remains:

`Unknown / null`

The reduction chain itself does not authorize a gloss.

## Generic discovery algorithm

The v0.1 discovery seam must be generic.

For a normalized basis:

1. preserve the original form
2. optionally generate every valid bounded right-edge expansion peel
3. for each resulting branch, repeatedly apply valid left consonant-frame peeling
4. stop left peeling when:
   - the next leading symbol is a canonical voice
   - minimum length would be violated
   - the Seven-Voices path would change
   - the chain reaches the operation-depth limit
5. emit terminal structural hypotheses
6. preserve deterministic ordering
7. deduplicate identical terminal hypotheses deterministically

The engine may emit more than one structural hypothesis.

It must not force a single structural winner.

## Operation depth

v0.1 maximum:

- right-edge expansion peels: 1
- left consonant-frame peels: 2
- total reduction operations: 3

No recursive unbounded stripping is allowed.

## Structural step shape

Each step must expose semantics equivalent to:

~~~ts
{
  from: "STERILE",
  to: "STER",
  operationId:
    "peel_right_vowel_led_expansion",
  reasonCodes: [
    "structural_reduction_applied",
    "right_edge_vowel_led_expansion",
    "deterministic_operation_authorized"
  ],
  fromSpan: {
    start: 4,
    end: 7
  },
  removedOrChanged: "ILE",
  voicePathBefore: ["E", "I", "E"],
  voicePathAfter: ["E"]
}
~~~

## Seven-Voices authority

Every structural operation must obtain voice paths from the repository Seven-Voices SSOT.

The implementation must reuse:

`extractSevenVowelsFromString(...)`

from:

`src/shared/math7.core.ts`.

It must not define another vowel set.

It must preserve canonical Y and Ë.

Example control:

`SYË → YË`

may use a left consonant-frame peel because:

`Y-Ë → Y-Ë`

is unchanged.

The implementation must not normalize Ë into E for structural-discovery authority.

## TERR boundary

The contract preserves the existing rule:

**No shortening operation from TERR to TER is authorized.**

`peel_left_consonant_frame` applied to:

`TERR`

can only produce:

`ERR`

because it removes the left T.

There is no operation in this contract that deletes the final R of `TERR`.

Therefore:

`TERR → TER`

must not occur.

Likewise, `TERROR` must not produce ER or TER through an unauthorized internal or final-consonant deletion.

## Negative-control posture

Controls do not have to produce absolute Null.

Logic-first discovery may produce other structural hypotheses.

Controls must instead prove that operations do not leak the target embryo through unauthorized surgery.

Required controls:

### TERROR

Must not produce:

- embryo `ER`
- embryo `TER`
- step `TERR → TER`

### ERROR

Must not produce embryo `ER` by deleting final R.

### SISTER

Must not produce embryo `ER` merely because the word ends in the letters ER.

### genericity control: STER

`STER` must be able to derive:

`STER → TER → ER`

without any reference to `STERILE`.

This proves the left-frame logic is generic.

### canonical Y/Ë control: SYË

`SYË → YË`

must preserve:

`Y-Ë → Y-Ë`.

## No STERILE-specific branch

Production source must not contain logic equivalent to:

- `word === "sterile"`
- `basis === "sterile"`
- switch/case for sterile
- a lookup table whose purpose is to return ER for STERILE

STERILE is a proving input, not implementation policy.

## Determinism

For identical normalized input and options:

- hypotheses are byte-for-byte equivalent
- hypothesis order is stable
- reduction-step order is stable
- reason-code order is stable

No randomness.

No provider/LLM call.

No current-time dependency.

## Candidate projection

This operation engine produces structural hypotheses.

The existing `analysisAdapter.ts` structural-hypothesis seam remains the projection authority.

Future wiring must project with:

- `sourceKind = logic_derived_structural_hypothesis`
- `claimType = structuralHypothesis`
- `validationOutcome = not_evaluated`
- `rankGroup = structuralHypothesis`
- `originClaim = not_claimed`
- `userDecisionPosture = user_decides`

No lexical isolation fields are manufactured.

## Null

The discovery function may return `[]`.

An empty result is valid.

A structural candidate exists only when at least one complete deterministic branch satisfies all operation contracts.

No fallback embryo may be fabricated solely to avoid Null.

## Non-goals

This contract does not:

- add ER to protoRoots
- add ER to canonical profiles
- add ER to reviewed source rows
- promote TER
- promote SHTER
- define historical morphology
- assign ER a meaning
- modify carrier evidence operations
- modify current canonical operator policy
- execute provider/LLM logic
- alter UI

## Implementation target

The smallest implementation should use one new reusable seam:

`src/shared/structuralHypothesisDiscovery.v0_1.ts`

The first implementation must make the operation contract tests green before live analyze-v1 wiring is added.
