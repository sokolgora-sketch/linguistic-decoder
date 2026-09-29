# Open Instrument Moving Nucleus Canonicalization Contract v0.1

Date: 2026-09-29

Status: `FROZEN_DOCTRINE_RULE_CONTRACT_ONLY`.

Lifecycle state: `FROZEN_BY_EXPLICIT_DOCTRINE_DECISION`.

Runtime state: `NOT_IMPLEMENTED`.

Contract ID: `OPEN_INSTRUMENT_MOVING_NUCLEUS_CANONICALIZATION_CONTRACT_V0_1`

Version: `v0.1`

This document freezes one canonicalization rule as a documentation/contract
lane. It does not claim that implementation, runtime wiring, pronunciation
lexicon coverage, or production integration exists.

## Authority layering

This contract is layered on the following existing contracts:

- `docs/open-instrument/moving-nucleus-additive-structural-contract-v0.1.md`;
- `docs/open-instrument/moving-nucleus-observation-authority-contract-v0.1.md`;
- `docs/open-instrument/moving-nucleus-observation-authority-contract-v0.1.1-addendum.md`.

The existing observation-authority contracts remain authoritative for whether
an observation and its ordered Voice-family anchors are evidence-qualified.
This contract adds canonicalization authority after those gates. It does not
replace, weaken, or infer the upstream observation authority.

## Scope

The frozen rule is:

> When one spoken vowel nucleus carries an evidence-qualified moving
> observation with exactly two ordered canonical Voice-family anchors `[X, Y]`,
> its canonical Seven-Voice contribution is exactly two ordered Voice events
> `[X, Y]`.

The two Voice events preserve anchor order. The moving nucleus remains one
spoken nucleus.

Therefore:

```text
ONE_MOVING_SPOKEN_NUCLEUS != TWO_SPOKEN_NUCLEI
```

but:

```text
ONE_MOVING_NUCLEUS_WITH_TWO_ANCHORS
= ONE_NUCLEUS + TWO_ORDERED_CANONICAL_VOICE_EVENTS
```

This rule is general across languages and input sources. It is not an
English-specific spelling or pronunciation rule.

## Non-goals

This lane does not:

- implement the canonicalization function;
- wire canonicalization into the runtime;
- change `/api/analyze-v1`;
- change `/chat`;
- select, download, or vendor an IPA lexicon;
- integrate CMUdict;
- implement G2P;
- perform acoustic extraction;
- create a movement classifier;
- create an observation provider;
- infer pronunciation from spelling;
- create a silent-e heuristic;
- create an English-specific rule;
- create a word-specific exception;
- change Level 3 or Level 4;
- create consonant semantics;
- execute SBR or FRD-02;
- execute a provider;
- promote production evidence.

## Three distinct objects

The contract preserves three different objects:

### A. Spoken nucleus count

`spokenNucleusCount` records the number of spoken nuclei. A qualifying moving
nucleus has:

```text
spokenNucleusCount = 1
```

### B. Ordered Voice-family anchors

`orderedVoiceFamilyAnchors` records the ordered anchors supplied by the
evidence-qualified observation authority:

```text
orderedVoiceFamilyAnchors = [X, Y]
```

These anchors are not inferred from spelling and are not established by plain
IPA adjacency alone.

### C. Canonical Seven-Voice events

`canonicalVoiceEvents` is the output of this separate canonicalization rule:

```text
canonicalVoiceEvents = [X, Y]
```

The nucleus count and event count are different dimensions:

```text
NUCLEUS_COUNT != CANONICAL_EVENT_COUNT
```

The canonical events must not be represented as two spoken nuclei.

## Canonical Voice inventory

The canonical inventory remains exactly:

```text
A, E, I, O, U, Y, Ë
```

`NEW_VOICE_CREATED=NO`.

A moving nucleus does not create an eighth Voice. It contributes an ordered
path through two already-existing Voice families when the evidence gate has
passed.

`VOWELS_DRIVE_SEVEN_VOICE_PATH=YES`.

Consonants are outside this contract.

## Evidence gate

Canonicalization does not create observation authority.

```text
OBSERVATION != CANONICALIZATION
QUALIFIED_OBSERVATION_CAN_FEED_CANONICALIZATION=YES
```

Canonicalization is permitted only when all applicable upstream observation
authority conditions have passed for the same one-nucleus observation and its
anchors:

1. the spoken nucleus is established as one moving nucleus by the existing
   observation-authority contract;
2. the Voice-family anchors are supplied by an evidence-qualified authority;
3. the anchors are ordered;
4. exactly two anchors are present;
5. the observation is not missing, unresolved, conflicted, unsupported, or
   outside its source scope;
6. the source, locator, language/doculect scope, and claim-specific authority
   remain traceable through the upstream provenance.

Canonicalization must fail closed when any required condition is absent.
It must not infer a canonical result from:

- spelling;
- silent letters;
- dictionary spelling patterns;
- plain adjacent IPA vowel symbols;
- phonetic resemblance without Voice-family authority;
- a desired Seven-Voice result;
- a target word's meaning.

## Exact two-anchor rule

The supported input is exactly two ordered, evidence-qualified canonical
Voice-family anchors:

```text
[X, Y]
```

The output is exactly the same ordered pair:

```text
[X, Y]
```

This v0.1 rule does not define behavior for:

- zero anchors;
- one anchor;
- three or more anchors;
- unordered anchor sets;
- unknown anchors;
- phonetic anchors without Voice-family authority.

Those cases fail closed unless a separate existing contract establishes a
distinct scalar behavior. No behavior is invented here.

## Order preservation

Anchor order is canonical event order:

```text
[X, Y] -> [X, Y]
```

The rule must not:

- sort anchors;
- deduplicate anchors;
- convert the pair to an unordered set;
- keep only an endpoint;
- keep only an onset;
- collapse the pair into one Voice event.

If a future evidence-qualified moving nucleus supplies `[X, X]`, this v0.1
rule permits:

```text
[X, X] -> [X, X]
```

The current canonical Voice inventory accepts repeated Voice values, and the
existing moving-nucleus observation validator does not impose a uniqueness
constraint on Voice-family anchors. No existing invariant conflicts with this
interpretation.

## Canonical examples

The following are doctrine examples of the transformation after the
evidence-qualified anchor gate has passed:

```text
oʊ -> [O, U]
aɪ -> [A, I]
eɪ -> [E, I]
ɔɪ -> [O, I]
aʊ -> [A, U]
```

The transcription shown in an example is not, by itself, the authority that
establishes its anchors. Arbitrary IPA adjacency does not prove movement, one
nucleus, two nuclei, or canonical Voice identity.

These examples do not authorize spelling heuristics, silent-letter inference,
orthographic inference, or language-specific lookup tables.

## Failure and Null behavior

Canonicalization returns `Null` when the upstream evidence gate does not
provide the required qualified input.

The minimum deterministic contract-level reason-code set is:

- `CANONICALIZATION_ANCHORS_MISSING`;
- `CANONICALIZATION_ANCHORS_UNRESOLVED`;
- `CANONICALIZATION_ANCHORS_CONFLICTED`;
- `CANONICALIZATION_ANCHORS_NOT_EVIDENCE_QUALIFIED`;
- `CANONICALIZATION_REQUIRES_EXACTLY_TWO_ORDERED_ANCHORS`.

Existing reason-code conventions may be used by a future implementation when
they are semantically exact. A future implementation must preserve the
distinctions above and must not replace them with a generic success or
failure string.

Null is valid and must remain distinguishable from:

- a stable one-nucleus observation;
- sequential nuclei;
- an unsupported transcription;
- an unavailable pronunciation;
- a failed runtime request.

## Normalized Voice path boundary

When canonicalization succeeds for a qualifying moving nucleus, its two
canonical Voice events may contribute in order to the normalized canonical
Voice path.

For example:

```text
one qualified moving nucleus
ordered anchors: [O, U]
canonical contribution: [O, U]
```

This document authorizes the transformation only. It does not implement path
flattening or runtime consumption.

```text
RUNTIME_PATH_WIRING_IMPLEMENTED=NO
```

Lane 2 may implement the deterministic canonicalization function. Lane 3 may
address pronunciation-lexicon and runtime wiring. Neither lane is completed
by this document.

## Stone boundary example

Stone is a boundary example only. This contract freezes:

```text
ORTHOGRAPHIC_STONE_FINAL_E_IS_NOT_BY_ITSELF_A_SPOKEN_E_VOICE_AUTHORITY
```

A later qualified pronunciation observation containing a moving nucleus
represented by `/oʊ/` may supply evidence-qualified anchors `[O, U]`. If it
does, this contract yields `[O, U]` for that one moving nucleus.

This contract does not:

- wire `stone`;
- create a stone-specific exception;
- establish a pronunciation for stone;
- establish a canonical result for stone;
- infer a spoken E from final orthographic E.

## Generality and source boundary

The rule applies to every language and input source when the upstream
observation authority establishes:

1. one moving spoken nucleus; and
2. exactly two ordered, evidence-qualified canonical Voice-family anchors.

The future pronunciation source decision is:

```text
bundled local IPA lexicon first
```

The future source must be deterministic, offline, word-to-pronunciation/IPA,
provider-free, and fail closed for unknown words. No lexicon is selected,
downloaded, vendored, or licensed by this contract. CMUdict-derived or
equivalent sources may be evaluated in Lane 3. G2P is deferred until after
deterministic bundled-lexicon coverage is assessed.

## Future runtime policy

The future runtime direction recorded by this contract is:

- when qualified pronunciation is available, `/api/analyze-v1` and `/chat`
  may use the spoken-vowel path as the canonical Voice-analysis source;
- orthographic vowel extraction must not masquerade as spoken-vowel evidence;
- a future orthographic fallback must be explicitly labeled;
- the fallback must not claim phonetic or spoken authority;
- unknown pronunciation must remain distinguishable from known pronunciation.

This is future wiring policy only. It is not runtime authorization and does
not change current product output.

## Relation to existing authority

This contract leaves unchanged:

- the existing Seven-Voice inventory;
- the additive structural observation contract;
- the observation-authority contract and addendum;
- Level 3;
- Level 4;
- consonant treatment;
- SBR;
- FRD-02;
- production evidence;
- `/chat`;
- `/api/analyze-v1`.

Observation provenance remains insufficient by itself to establish
canonicalization unless this contract's exact-two ordered-anchor rule also
applies. Canonicalization does not establish historical origin, borrowing,
cognacy, semantic meaning, or linguistic superiority.

## Validation and implementation boundary

This contract changes no implementation, test, API, UI, SBR, FRD-02, provider,
or production authority.

The implementation/review surfaces for later lanes include:

- `src/shared/openInstrument/spokenVowelNormalization.v0_1.ts`;
- `src/shared/openInstrument/movingNucleusObservationAuthority.v0_1.ts`;
- `src/shared/vowels/extractCarrierVoicesFromIpa.v0.1.ts`;
- `src/shared/vowels/parseIpaVowels.v0.2.ts`;
- `src/shared/vowels/ipaVowelMap.v0.2.ts`;
- `src/shared/openInstrument/doctrineLevel3ProofPair.v0_1.ts`.

No runtime tests are required for this documentation-only lane. Any later
implementation must add deterministic tests for evidence gating, exact-two
anchor handling, order preservation, repeated anchors, Null reasons, and the
one-nucleus-versus-two-events distinction before runtime wiring is considered.

## Frozen boundary summary

```text
CANONICALIZATION_RULE=[X,Y] -> [X,Y]
SPOKEN_NUCLEUS_COUNT=1
CANONICAL_EVENT_COUNT=2
OBSERVATION_REQUIRED=YES
VOICE_FAMILY_ANCHORS_REQUIRED=YES
EXACTLY_TWO_ORDERED_ANCHORS_REQUIRED=YES
NEW_VOICE_CREATED=NO
SPELLING_HEURISTIC_AUTHORIZED=NO
SILENT_E_INFERENCE_AUTHORIZED=NO
RUNTIME_WIRING_IMPLEMENTED=NO
LEXICON_IMPLEMENTED=NO
G2P_IMPLEMENTED=NO
LEVEL3_CHANGED=NO
LEVEL4_CHANGED=NO
```

This document is the Lane 1 canonicalization contract only. It does not
complete Lane 2 implementation or Lane 3 pronunciation/runtime wiring.
