# ZË-RO Seven-Voices Sound-First Theory v0.1

Classification: `USER_DOCTRINE_WITH_EXPLICIT_UNTESTED_MECHANISMS`

Version: `v0.1`

Date: `2026-10-21`

Status: `DRAFT_FOR_USER_REVIEW_NOT_YET_FROZEN_OR_MERGED`

Scope: additive clarification of the sound-first Seven-Voices theory. This
document does not replace or silently revise the existing doctrine record,
pronunciation authority contracts, moving-nucleus contracts, consonantal
configuration contracts, frozen M2 preregistration, or production behavior.

## 1. Theory statement and classification

ZË-RO investigates spoken language through seven fundamental Voices:

`A, E, I, O, U, Y, Ë`

These are the fundamental vocalic organizing elements of the theory. Vowels
provide spoken nuclei. Consonants shape, shade, constrain, and connect speech
structure. Speech sound takes priority over written spelling: a word's letters
are not equivalent to the physical sounds used to pronounce the word.

The theory proposes a deeper organization of speech formation. Its mechanisms
are `USER_DOCTRINE` and research hypotheses where they are not independently
verified. They are `NOT_ESTABLISHED` unless the relevant pronunciation,
phonological, acoustic, historical, or functional authority supports the
specific claim.

This document is not an empirical proof, a universal phonetic law, a historical
claim about Petro Zheji, a production authority, or permission to execute a
real experiment. It grants no implementation or promotion authority.

## 2. Seven canonical Voices and display orders

The canonical inventory is exactly:

`A, E, I, O, U, Y, Ë`

`Y` remains canonical. The repository's ordered views define two presentations
of the same inventory:

- Symbolic Math7: `A, E, I, O, U, Y, Ë`.
- Acoustic / VoiceLab display: `A, O, E, Ë, U, Y, I`.

These are different ordered views, not different inventories and not claims
about the order of spoken events. The source of the current ordered views is
[`src/shared/sevenVoiceOrderedViews.v0.1.ts`](../../src/shared/sevenVoiceOrderedViews.v0.1.ts).

## 3. Fundamental operating principles

1. Spoken pronunciation is the authority boundary for sound claims.
2. Written spelling is not a substitute for missing pronunciation authority.
3. Vowels provide spoken nuclei; consonants shape, shade, constrain, and
   connect the structure.
4. A consonant's spoken letter name is not identical to the isolated consonant
   phoneme.
5. A proposed contextual transition does not automatically create two spoken
   nuclei or two canonical Voice events.
6. Source variants, nucleus structure, moving-nucleus status, and consonantal
   configuration remain provenance-bearing and distinct.
7. Missing or conflicting authority remains `UNKNOWN / NULL`; it is never
   filled by spelling, generic IPA guesses, or subjective hearing.

The existing pronunciation chain remains authoritative:

```text
source pronunciation
  -> normalized phonetic representation
  -> spoken nucleus or nuclei
  -> reviewed Voice-family authority
  -> moving-nucleus canonicalization when applicable
  -> canonical Seven-Voice events
```

## 4. Example: B across languages

The same written consonant letter can have different spoken names across
languages:

| Language | Spoken name of B | Voice |
| --- | --- | --- |
| English | BEE `/biː/` | `I` |
| Albanian | BË `/bə/` | `Ë` |
| Spanish | BE `/be/` | `E` |

These examples illustrate that the vowel nucleus is the vocalic carrier of a
spoken letter name. They do not prove that the isolated consonant phoneme
`/b/` is physically impossible to articulate without a separate vowel nucleus.
They also do not by themselves establish a universal phonological or
Seven-Voice mapping.

## 5. Example: W is context-dependent

`W IS NOT ALWAYS U + O`.

The following are DF's illustrative sound-formation hypotheses:

| Form | Proposed contextual relationship |
| --- | --- |
| WATER | proposed `U -> O` relationship |
| WHAT | proposed `U -> A` relationship, with `T` in the structure |
| WHERE | proposed `U -> E` relationship |

These are `HYPOTHESIS`, not authorized IPA mappings. Actual pronunciation,
language, dialect, articulatory context, and source profile must be established
before any experiment treats them as phonological results. A hypothesized
vowel-related articulation does not itself establish a canonical spoken Voice
event.

## 6. Pronunciation and sound-formation authority chain

The following analytical layers must remain separate:

1. Source-backed spoken pronunciation and its variants.
2. Source-authorized spoken vowel nuclei.
3. Reviewed phonological categories and canonical Seven-Voice paths.
4. Source-derived consonantal configurations.
5. Proposed contextual Seven-Voice participation in consonantal articulation.
6. Candidate spoken embryos.
7. Independent functional and historical evidence.

The current contracts impose the following boundaries:

- `SPELLING != SPOKEN_PRONUNCIATION_AUTHORITY`.
- Plain adjacent IPA symbols do not alone establish one nucleus, sequential
  nuclei, or physical movement.
- A moving nucleus with two ordered anchors is not automatically two spoken
  nuclei.
- Consonant segments do not create canonical Voice events.
- Source-order consonantal configuration is structural only and grants no
  `(Voice, configuration) -> functional output` rule.
- Unsupported, unresolved, conflicting, or unauthorised claims remain Null.

Relevant authority files are:

- [`docs/open-instrument/pronunciation-to-voice-authority-contract-v0.1.md`](pronunciation-to-voice-authority-contract-v0.1.md)
- [`docs/open-instrument/moving-nucleus-observation-authority-contract-v0.1.md`](moving-nucleus-observation-authority-contract-v0.1.md)
- [`docs/open-instrument/consonantal-configuration-authority-v0.1.md`](consonantal-configuration-authority-v0.1.md)
- [`docs/open-instrument/consonant-structure-product-embryo-v0.1.md`](consonant-structure-product-embryo-v0.1.md)
- [`src/shared/sevenVoiceOrderedViews.v0.1.ts`](../../src/shared/sevenVoiceOrderedViews.v0.1.ts)

## 7. Sound-first embryo principle

An orthographic fragment is not automatically a phonological embryo.

Historical software results such as `WATER -> AT`, and prior written-letter
`AN`/`OR` probes, remain preserved under their actual orthographic or historical
representation. They must not be retroactively presented as validated tests of
this sound-first theory.

The intended research direction is:

```text
pronunciation
  -> spoken nuclei
  -> Seven-Voices path + consonantal context
  -> explicitly defined sound-based embryo operation
  -> candidate function or Null
  -> independent evidence
```

The general contextual decomposition and sound-based embryo operation are
`NOT_YET_AUTHORIZED` and are not fully implemented. No deterministic rule may
be invented merely to satisfy WATER, WHAT, WHERE, or another preferred example.
The smallest defensible embryo must be identified before expanding structural
or semantic hypotheses.

## 8. Fact, Inference, Hypothesis, and Null

- `FACT`: documented and source-qualified observation.
- `INFERENCE`: traceable interpretation of documented observations.
- `HYPOTHESIS`: proposed Seven-Voice formation, contextual relationship, or
  functional bridge that remains to be tested.
- `UNKNOWN / NULL`: insufficient evidence, missing authority, ambiguity, or a
  failed applicability condition.

The project must preserve `evidenceRefs`, source provenance, `no_single_winner`,
and user decision authority. Phonetic similarity, historical etymology,
functional proto-root evidence, candidate semantic resemblance, and production
evidence are not interchangeable.

No universal sound-composition formula may be claimed until its operations,
inputs, source scope, verification conditions, variant policy, and Null behavior
are explicitly defined and reviewed.

## 9. Current repository alignment and unresolved tension

The existing doctrine record states that the seven vowels carry the nucleus and
that consonants make the shades. It also records an Albanian-oriented position
that consonants carry foundational meaning while vowels organize and modulate
it. This document preserves the tension rather than silently resolving it:

- the explicit sound-first clarification gives primacy to spoken vowel nuclei;
- consonantal shaping and any foundational consonant meaning remain doctrine or
  hypothesis until the relevant source and functional authorities exist;
- the current consonantal configuration contract explicitly grants no consonant
  meaning or functional-composition authority.

Therefore, `CONSONANT_FOUNDATIONAL_MEANING=USER_DOCTRINE_OR_HYPOTHESIS_NOT_ESTABLISHED`
and `VOWEL_NUCLEUS_PRIMACY=USER_DOCTRINE_WITH_SPOKEN_AUTHORITY_REQUIRED`.

This additive clarification does not freeze a new contract and does not alter
the canonical inventory, existing mappings, moving-nucleus rules, M2 artifacts,
or historical research results.

## 10. Non-drift rules for ChatGPT and Codex

Future work must:

- ask for pronunciation authority before interpreting a written fragment as
  sound structure;
- preserve language, dialect, source revision, variant, and access provenance;
- distinguish a spoken letter name from an isolated consonant phoneme;
- keep sequential nuclei, moving nuclei, consonant regions, and Voice events
  distinct;
- preserve `FACT`, `INFERENCE`, `HYPOTHESIS`, and `UNKNOWN / NULL` labels;
- retain `no_single_winner` where evidence does not select one interpretation;
- never infer a Voice event, function, etymology, or production claim from
  spelling alone;
- never treat this document as authorization for a blind run, target selection,
  source acquisition, candidate promotion, or production deployment.

## 11. Unresolved research questions and promotion requirements

The following remain open:

1. What source-qualified operation identifies the smallest sound-based embryo?
2. How are moving nuclei distinguished from sequential nuclei for each source
   profile and dialect scope?
3. What evidence supports a contextual W transition, if any, beyond a proposed
   articulatory analogy?
4. How can consonantal context be represented without importing spelling or
   silently assigning consonant semantics?
5. What independent historical and functional evidence can support or reject a
   candidate function while preserving explicit Null?
6. What reproducible test can distinguish a sound-based hypothesis from
   orthographic coincidence?

Promotion requires a reviewed source profile, explicit operation definition,
exact inputs and outputs, variant and ambiguity handling, provenance,
counterexamples, Null behavior, and evidence sufficient for the claim being
promoted. No mechanism in this document is promoted merely by being recorded.

## 12. Status and locks

```text
CLASSIFICATION=USER_DOCTRINE_WITH_EXPLICIT_UNTESTED_MECHANISMS
STATUS=DRAFT_FOR_USER_REVIEW_NOT_YET_FROZEN_OR_MERGED
USER_DOCTRINE=YES
NOT_ESTABLISHED=YES_FOR_UNVERIFIED_MECHANISMS
NOT_YET_AUTHORIZED=YES_FOR_SOUND_BASED_EMBRYO_OPERATION
FROZEN_CONTRACTS_CHANGED=NO
M2_PREREGISTRATION_CHANGED=NO
REAL_M2_EXECUTION_AUTHORIZED=NO
REAL_TARGET_SELECTED=NO
M3_RESEARCH_EXECUTED=NO
PRODUCTION_PROMOTION=NO
```

The ChatGPT-generated reference document was not available as a local file.
This document therefore makes no byte-for-byte reproduction claim and records
no invented reference hash.
