# Seven Voices Functional Profile Extraction v0.1

Status: `TECHNICAL_EXTRACTION`

Authority boundary: `TECHNICAL_EXTRACTION_NOT_ENGINE_AUTHORITY`

This document extracts technical candidates from the four stored Albanian
author sources. It does not change the source files, current machine mappings,
runtime behavior, lexical evidence, reviewed evidence, or production truth.
Source-derived statements remain author doctrine until separately normalized and
authorized by a reviewed technical contract.

## Primary Source Registry

| Source ID | File | Language | Status | Engine authority |
| --- | --- | --- | --- | --- |
| `seven-voices.author-source.chapter-01.sq` | `docs/doctrine/sources/seven-voices/chapter-01-lindja-e-zerave.sq.md` | `sq` | `VERBATIM` | `NOT_EXECUTABLE_DIRECTLY` |
| `seven-voices.author-source.chapter-02.sq` | `docs/doctrine/sources/seven-voices/chapter-02-ndermjetesi-i-balances.sq.md` | `sq` | `VERBATIM` | `NOT_EXECUTABLE_DIRECTLY` |
| `seven-voices.author-source.chapter-03.sq` | `docs/doctrine/sources/seven-voices/chapter-03-harmonit-e-shtate-zerave.sq.md` | `sq` | `VERBATIM` | `NOT_EXECUTABLE_DIRECTLY` |
| `seven-voices.author-source.chapter-04.sq` | `docs/doctrine/sources/seven-voices/chapter-04-shtate-parimet-e-ekzistences.sq.md` | `sq` | `VERBATIM` | `NOT_EXECUTABLE_DIRECTLY` |

Body-only SHA-256 values, computed from line 10 through EOF for each chapter,
are recorded in the validation section below. The metadata frontmatter is not
part of those hashes.

## Extraction Taxonomy

| Class | Use in this document |
| --- | --- |
| `EXPLICIT_DOCTRINE` | The source directly assigns a property, association, or relation to a Voice. |
| `FUNCTIONAL_INTERPRETATION` | The source describes what a Voice does, supports, connects, or invites without establishing an executable rule. |
| `METAPHOR_OR_EXPLANATORY_IMAGE` | Narrative, poetic, cosmological, biological, color, or physical imagery used to explain a doctrine. |
| `UNRESOLVED_OR_CONFLICTING` | Source variants, cross-chapter tension, or ambiguity that cannot be normalized from these chapters alone. |
| `ENGINE_AUTHORIZED_RULE` | An executable rule already authorized by a current reviewed repository contract. No new rule is created here. |

`ENGINE_AUTHORIZED_RULE` is deliberately not assigned to any new source-derived
profile property in this extraction.

## Semantic Dimensions

The source supports separating dimensions rather than replacing each Voice with
one English gloss:

- `VOICE_IDENTITY`: the vowel/Voice identity.
- `FUNCTIONAL_PROFILE`: described tendencies such as initiation, expansion, support, illumination, choice, or harmonization.
- `PRINCIPLE_ASSOCIATION`: the Chapter 4 named principle paired with a Voice.
- `RELATIONAL_PROPERTY`: an explicitly described relation to another Voice or group, especially A/Ë and O's high/low relation.
- `POSITIONAL_OR_COMPOSITION_CLAIM`: claims about ordered paths or sequence. The four chapters do not establish a formal path operator.
- `SYMBOLIC_METADATA`: color, frequency/level, and other symbolic correspondences.
- `COLOR_ASSOCIATION`: source color descriptions; not acoustic measurements.
- `FREQUENCY_OR_LEVEL_ASSOCIATION`: source high/middle/low language; not measured frequency evidence.
- `NARRATIVE_ORIGIN`: creation or emergence story material.
- `METAPHOR_OR_EXPLANATORY_IMAGE`: imagery that must remain quarantined from computation.
- `UNRESOLVED_OR_CONFLICTING`: unresolved vocabulary, order, or profile tension.

These are extraction dimensions, not an authorized TypeScript schema.

## Per-Voice Extraction

### A

Source passages: chapter 1 lines 16-20 and 21-26; chapter 3 line 15; chapter 4
lines 16-17.

| Class | Dimension | Extraction |
| --- | --- | --- |
| `EXPLICIT_DOCTRINE` | `VOICE_IDENTITY`, `NARRATIVE_ORIGIN` | A is the first Voice, associated with the beginning, emergence, creation, a first cry, life, and an active beginning. |
| `FUNCTIONAL_INTERPRETATION` | `FUNCTIONAL_PROFILE` | A is described as initiating or animating creation and as carrying a vital pulse. |
| `EXPLICIT_DOCTRINE` | `RELATIONAL_PROPERTY` | A and Ë are described as opposed yet inseparable counterparts; this is a relation, not a proof that A has one isolated meaning. |
| `EXPLICIT_DOCTRINE` | `PRINCIPLE_ASSOCIATION` | Chapter 4 pairs A with `Bashkimi`. This association is source material only. |
| `EXPLICIT_DOCTRINE` | `COLOR_ASSOCIATION`, `FREQUENCY_OR_LEVEL_ASSOCIATION` | A is associated with red and high/light language. The source does not establish an acoustic measurement contract. |
| `METAPHOR_OR_EXPLANATORY_IMAGE` | `METAPHOR_OR_EXPLANATORY_IMAGE` | Birth, first cry, fire, seed, heart, sun, cosmic creation, and galaxy/cell analogies explain the narrative and are not executable rules. |

Current machine role `Initiation/Source` is `PARTIALLY_SUPPORTED`: initiation and
beginning are directly supported, while `Source` is a technical compression and
the source also contains principle, relational, color, and narrative dimensions.

### E

Source passages: chapter 1 lines 27 and 29-30; chapter 3 lines 17-19; chapter 4
lines 19-20.

| Class | Dimension | Extraction |
| --- | --- | --- |
| `EXPLICIT_DOCTRINE` | `FUNCTIONAL_PROFILE` | E is associated with expansion, transformation, growth, movement, and bridge/connection behavior. |
| `FUNCTIONAL_INTERPRETATION` | `RELATIONAL_PROPERTY` | E connects inner and outer domains and links different elements in the source narrative. |
| `EXPLICIT_DOCTRINE` | `PRINCIPLE_ASSOCIATION` | Chapter 4 pairs E with `Vibrimi`; this is not the same field as expansion/bridge. |
| `EXPLICIT_DOCTRINE` | `COLOR_ASSOCIATION`, `FREQUENCY_OR_LEVEL_ASSOCIATION` | E is associated with orange and a lively/high description in the source. |
| `METAPHOR_OR_EXPLANATORY_IMAGE` | `METAPHOR_OR_EXPLANATORY_IMAGE` | Sunlight, warmth, tapestry, and developmental imagery explain the profile but do not define an operator. |

Current machine role `Expansion/Bridge` is `SUPPORTED_AS_ONE_DIMENSION`: both
expansion and bridge language are source-supported, but transformation, growth,
color, level, and `Vibrimi` remain separate dimensions.

### I

Source passages: chapter 1 lines 27-30; chapter 3 lines 21-23; chapter 4 lines
22-23.

| Class | Dimension | Extraction |
| --- | --- | --- |
| `EXPLICIT_DOCTRINE` | `FUNCTIONAL_PROFILE` | I is associated with illumination, knowledge, pursuit of knowledge, recognition, clarity, truth, understanding, and optimistic insight language. |
| `FUNCTIONAL_INTERPRETATION` | `RELATIONAL_PROPERTY` | The source describes I as illuminating a way toward truth and understanding; it does not define how I composes with a preceding Voice. |
| `EXPLICIT_DOCTRINE` | `PRINCIPLE_ASSOCIATION` | Chapter 4 pairs I with `Ritmi`, a distinct principle dimension. |
| `EXPLICIT_DOCTRINE` | `COLOR_ASSOCIATION`, `FREQUENCY_OR_LEVEL_ASSOCIATION` | I is associated with yellow/sunlight and illumination. |
| `METAPHOR_OR_EXPLANATORY_IMAGE` | `METAPHOR_OR_EXPLANATORY_IMAGE` | Sun rays, warmth, and light are explanatory images, not a lexical or causal rule. |

Current machine role `Direction/Focus` is `PARTIALLY_SUPPORTED`: direction toward
truth is explanatory source language, but the central source profile is
knowledge/illumination/clarity. Current presentation label `Insight / Pattern`
captures part of this profile but is not the machine `PrincipleRole`.

### O

Source passages: chapter 2 lines 13-28 and 31-43; chapter 3 line 25; chapter 4
lines 25-26.

| Class | Dimension | Extraction |
| --- | --- | --- |
| `EXPLICIT_DOCTRINE` | `FUNCTIONAL_PROFILE` | O is described as mediator, balancer, organizer, harmonizer, stabilizer, and non-dominating center. |
| `EXPLICIT_DOCTRINE` | `RELATIONAL_PROPERTY` | O is explicitly placed between high and low groups, links other Voices, and prevents one Voice from dominating. This is Voice-identity behavior, not a rule for every middle array position. |
| `EXPLICIT_DOCTRINE` | `PRINCIPLE_ASSOCIATION` | Chapter 4 pairs O with `Balanca`. |
| `EXPLICIT_DOCTRINE` | `COLOR_ASSOCIATION`, `FREQUENCY_OR_LEVEL_ASSOCIATION` | O is associated with green and a middle frequency/level description. |
| `FUNCTIONAL_INTERPRETATION` | `POSITIONAL_OR_COMPOSITION_CLAIM` | The source uses bridge, pause, and center language for O, but does not define an executable O-specific adjacency operator. |
| `METAPHOR_OR_EXPLANATORY_IMAGE` | `METAPHOR_OR_EXPLANATORY_IMAGE` | Gravity, a parent/caregiver, breath, sleep, circle, forest, and cosmic balance are explanatory images. |

Current machine role `Mediation/Balance` is `SUPPORTED_AS_ONE_DIMENSION` and is
the strongest direct machine/source correspondence. The source materially
supports investigating a richer relational profile for O, but does not authorize
O-specific runtime composition in this document.

### U

Source passages: chapter 1 lines 31 and 38; chapter 3 line 27; chapter 4 lines
28-29.

| Class | Dimension | Extraction |
| --- | --- | --- |
| `EXPLICIT_DOCTRINE` | `FUNCTIONAL_PROFILE` | U is associated with support, grounding, stability, depth, security, nourishment, belonging, and a foundation for other Voices. |
| `EXPLICIT_DOCTRINE` | `PRINCIPLE_ASSOCIATION` | Chapter 4 pairs U with `Ndryshimi`. This is a principle association, not a replacement for the support/depth profile. |
| `EXPLICIT_DOCTRINE` | `COLOR_ASSOCIATION`, `FREQUENCY_OR_LEVEL_ASSOCIATION` | U is associated with blue/water and low/deep language. |
| `FUNCTIONAL_INTERPRETATION` | `RELATIONAL_PROPERTY` | U is described as supporting or anchoring other Voices; no universal target or composition relation is specified. |
| `METAPHOR_OR_EXPLANATORY_IMAGE` | `METAPHOR_OR_EXPLANATORY_IMAGE` | Water, roots, trees, seasons, community, and a foundation are explanatory images. |

Current machine role `Containment/Depth` is `PARTIALLY_SUPPORTED`: depth is
directly present and containment can be a cautious technical interpretation of
support/holding, but the source does not establish that label as the complete
profile. `Ndryshimi` is a separate Chapter 4 dimension, not a source-resolved
contradiction.

### Y

Source passages: chapter 1 lines 31-33; chapter 3 line 29; chapter 4 lines 31-32.

| Class | Dimension | Extraction |
| --- | --- | --- |
| `EXPLICIT_DOCTRINE` | `FUNCTIONAL_PROFILE` | Y is associated with choice, duality, exploration, adventure, mystery, imagination, experimentation, discovery, risk, and learning from experience. |
| `FUNCTIONAL_INTERPRETATION` | `RELATIONAL_PROPERTY` | The source describes choices as shaping a path and experience, but does not define a formal path operator. |
| `EXPLICIT_DOCTRINE` | `PRINCIPLE_ASSOCIATION` | Chapter 4 pairs Y with `Nisma`. |
| `EXPLICIT_DOCTRINE` | `COLOR_ASSOCIATION`, `FREQUENCY_OR_LEVEL_ASSOCIATION` | Y is associated with indigo and a medium-high/variable description. |
| `METAPHOR_OR_EXPLANATORY_IMAGE` | `METAPHOR_OR_EXPLANATORY_IMAGE` | Moonlight, a child choosing a toy, wind, mystery, and adventure imagery explain the profile. |

Current machine role `Reflection/Mirror` is `VOCABULARY_DRIFT`: the four chapters
support exploration, choice, and mystery but do not establish `Reflection/Mirror`
as Y's canonical functional label. Current presentation `Network Integrity` is
also not established by these source passages. The source does not authorize
silently replacing either current label.

### Ë

Source passages: chapter 1 lines 21-26 and 33-34; chapter 3 line 31; chapter 4
lines 34-35.

| Class | Dimension | Extraction |
| --- | --- | --- |
| `EXPLICIT_DOCTRINE` | `FUNCTIONAL_PROFILE` | Ë is associated with resolution, harmony, peace, reconciliation, unity, emotional/interior depth, and connection. |
| `EXPLICIT_DOCTRINE` | `RELATIONAL_PROPERTY` | Ë is the counterpart/complement of A and is described as opposed yet inseparable from A. |
| `EXPLICIT_DOCTRINE` | `PRINCIPLE_ASSOCIATION` | Chapter 4 pairs Ë with `Dashuria`. |
| `EXPLICIT_DOCTRINE` | `COLOR_ASSOCIATION`, `FREQUENCY_OR_LEVEL_ASSOCIATION` | Ë is associated with violet and low-to-middle language. |
| `FUNCTIONAL_INTERPRETATION` | `FUNCTIONAL_PROFILE` | Transcendence, change, and spiritual connection appear as broader interpretive language and should not be collapsed into one executable meaning. |
| `METAPHOR_OR_EXPLANATORY_IMAGE` | `METAPHOR_OR_EXPLANATORY_IMAGE` | Moonlight, tears, sleep, a lullaby, a river, a parent, and emotional imagery are explanatory images. |

Current machine role `Completion/Unit` is `SUPPORTED_AS_ONE_DIMENSION`: resolution,
unity, and completion-adjacent language are present, but the A-counterpart,
emotion, peace, and `Dashuria` dimensions are not represented by that label.
Current presentation `Evolution / Completion` is not a complete source profile.

## Chapter 4 Principle Associations

The following are direct source associations from chapter 4 lines 16-35:

| Voice | Source principle | Extraction status | Current machine mapping |
| --- | --- | --- | --- |
| A | `Bashkimi` | `EXPLICIT_DOCTRINE`, `PRINCIPLE_ASSOCIATION` | Not present as `PrincipleRole`; do not replace `Initiation/Source`. |
| E | `Vibrimi` | `EXPLICIT_DOCTRINE`, `PRINCIPLE_ASSOCIATION` | Not present as `PrincipleRole`; do not replace `Expansion/Bridge`. |
| I | `Ritmi` | `EXPLICIT_DOCTRINE`, `PRINCIPLE_ASSOCIATION` | Not present as `PrincipleRole`; do not replace `Direction/Focus`. |
| O | `Balanca` | `EXPLICIT_DOCTRINE`, `PRINCIPLE_ASSOCIATION` | Semantically adjacent to `Mediation/Balance`, but still a separate source dimension. |
| U | `Ndryshimi` | `EXPLICIT_DOCTRINE`, `PRINCIPLE_ASSOCIATION` | Not present as `PrincipleRole`; do not replace `Containment/Depth`. |
| Y | `Nisma` | `EXPLICIT_DOCTRINE`, `PRINCIPLE_ASSOCIATION` | Not present as `PrincipleRole`; do not replace `Reflection/Mirror`. |
| Ë | `Dashuria` | `EXPLICIT_DOCTRINE`, `PRINCIPLE_ASSOCIATION` | Not present as `PrincipleRole`; do not replace `Completion/Unit`. |

The current authoritative machine vocabulary is the `PrincipleRole` union and
registry in `src/shared/sevenPrinciples.v1.ts:30-71,86-164`. The source's
Chapter 4 principle names must remain source data until a separate governance
decision authorizes a second principle/profile dimension.

## Current Machine-Role Comparison

| Voice | Current machine role | Relationship to primary source |
| --- | --- | --- |
| A | `Initiation/Source` | `PARTIALLY_SUPPORTED`: initiation is direct; source is a compressed technical label and does not cover Bashkimi, A/Ë relation, or symbolic dimensions. |
| E | `Expansion/Bridge` | `SUPPORTED_AS_ONE_DIMENSION`: expansion and bridge behavior are explicit; Vibrimi, transformation, and metadata are separate. |
| I | `Direction/Focus` | `PARTIALLY_SUPPORTED`: direction toward truth is interpretive; knowledge/illumination is more explicit than the current role label. |
| O | `Mediation/Balance` | `SUPPORTED_AS_ONE_DIMENSION`: direct and strong, but the source adds center, non-domination, high/low relation, pause, and continuity. |
| U | `Containment/Depth` | `PARTIALLY_SUPPORTED`: depth and support are direct; containment is not the whole source profile. |
| Y | `Reflection/Mirror` | `VOCABULARY_DRIFT`: choice, duality, exploration, and mystery are explicit; reflection/mirror is not established in these chapters. |
| Ë | `Completion/Unit` | `SUPPORTED_AS_ONE_DIMENSION`: resolution, unity, and peace are present; complementarity, emotion, and Dashuria are additional dimensions. |

The registry also supplies symbolic color, level, ring, and index metadata, but
those fields do not become semantic evidence merely because they are machine
available (`src/shared/openInstrument/doctrineProjection.v0_1.ts:22-41,98-123`).

## Presentation and Legacy Vocabulary

Current repository labels in `src/shared/doctrine/voiceDoctrine.v0.1.ts:39-47`
and modern principles in lines 77-87 are presentation/doctrine sets distinct
from `PrincipleRole`:

| Label/set | Current status | Source comparison |
| --- | --- | --- |
| `Truth / Source / Action` for A | Human-facing label | Partially overlaps A's beginning/creation profile; not a source-exact Chapter 4 principle. |
| `Expansion / Flow` for E | Human-facing label | Partially supported by expansion/bridge/flow language; not the Chapter 4 `Vibrimi` field. |
| `Insight / Pattern` for I | Human-facing label | `Insight` is compatible with the source's illumination/knowledge dimension; `Pattern` is not established as an explicit source field. |
| `Balance / Heart / Mediator` for O | Human-facing label | Strongly overlaps O's mediator/balance profile; source also specifies relational non-domination and high/low bridging. |
| `Unity / Field` for U | Human-facing label | `Unity` appears in source material but U's direct profile is support/depth/grounding; this is not the Chapter 4 `Ndryshimi` association. |
| `Network Integrity` for Y | Human-facing label | Not established by the four stored chapters; retain as a separate current label pending normalization. |
| `Evolution / Completion` for Ë | Human-facing label | Completion/peace/unity overlap the source; evolution/change language is present but not a complete source mapping. |
| Modern principles `Truth, Expansion, Insight, Balance, Unity, Network Integrity, Evolution` | Existing symbolic set, not the Chapter 4 named principles | This is vocabulary/version drift or parallel dimensions, not permission to overwrite either set. |

## Cross-Voice Relations

| Relation | Source evidence | Extraction status |
| --- | --- | --- |
| A and Ë are counterparts, opposed yet inseparable | chapter 1 lines 21-25 | `EXPLICIT_DOCTRINE`, `RELATIONAL_PROPERTY` |
| Chapter 1 high/light grouping | chapter 1 line 37 | `EXPLICIT_DOCTRINE`, `RELATIONAL_PROPERTY`; this passage groups Ë with A/E/I among forces of light, height, and growth. |
| Chapter 1 lower/anchoring grouping | chapter 1 line 38 | `EXPLICIT_DOCTRINE`, `RELATIONAL_PROPERTY`; this passage names U/Y as lower forces that anchor and deepen the universe. |
| Cross-chapter high/low partition | chapter 1 lines 37-38; chapter 2 lines 27-28; chapter 3 lines 25, 27, 29, 31 | `UNRESOLVED_OR_CONFLICTING`; the passages do not establish one universal executable partition: Ë appears in the Chapter 1 high/light grouping and in the Chapter 2 low grouping, while other frequency descriptions vary. |
| O mediates high and low groups | chapter 2 lines 27-28; chapter 3 line 25; chapter 4 line 26 | `EXPLICIT_DOCTRINE`, `RELATIONAL_PROPERTY` |
| O prevents any Voice from dominating | chapter 2 lines 37-38 | `FUNCTIONAL_INTERPRETATION` with strong source support; no executable adjacency rule. |
| Voices interact and harmonize | chapter 3 lines 33-35 | `FUNCTIONAL_INTERPRETATION`; interaction is not a pairwise path algebra. |
| A, Ë, E, I, U, Y, then O appear in narrative emergence/order | chapter 1 lines 16,21,27,31,33; chapter 2 line 13 | `NARRATIVE_ORIGIN`; not automatically a path/composition rule. |

## Path and Composition Evidence Matrix

| Claim | Status | Reason |
| --- | --- | --- |
| First Voice is a formal starting semantic state | `NOT_SUPPORTED` | Narrative beginnings exist, but no path contract defines first-position state semantics. |
| Last Voice is a formal resulting/terminal state | `NOT_SUPPORTED` | The source describes Voice profiles and narrative outcomes, not a universal terminal-state rule. |
| `X -> Y` means X becomes Y | `NOT_SUPPORTED` | The source has transformation language for profiles and narrative imagery, not a universal adjacent-state operator. |
| `X -> Y` means X acts through Y or leads toward Y | `PLAUSIBLE_INTERPRETATION` | Some source descriptions use movement/connection language, but no executable relation is specified. |
| Reversing X,Y reverses a semantic process | `UNRESOLVED` | The stored chapters do not define reversible path semantics. The external U/I author context is not part of these files. |
| Multi-Voice paths compose pairwise | `NOT_SUPPORTED` | Voice interaction is described, but adjacent-pair composition is not formalized. |
| Repeated Voice means self-transition, reinforcement, or recursion | `NOT_SUPPORTED` | No repeated-path rule is stated. |
| Terminal Voice dominates interpretation | `NOT_SUPPORTED` | O is identity-level mediator, but no terminal dominance rule exists. |
| O modifies adjacency/composition specially | `PLAUSIBLE_INTERPRETATION` | O has explicit relational behavior, but a path-specific operator would require a new governance decision. |

The chapters support rich Voice profiles and explicit cross-Voice relations, but
they do not authorize the generic `X becomes Y` model used by PR #1940 without
narrowing.

## External U/I Author Context

The project-director context describes U -> I as held knowledge becoming
insight/understanding and I -> U as internalized depth. That context is outside
the four stored chapter files.

The stored chapters `SUPPORT` the individual components: U has support/depth
language (chapter 3:27), and I has knowledge/illumination language (chapter
3:21-23). They `DO_NOT_ESTABLISH` the directional U/I composition rule,
`learning`, or `digesting`. Those claims require separate author-governance
normalization and an explicit composition contract.

## Metaphor Quarantine

The following source images are retained as doctrine context but are not engine
rules without separate authorization:

- newborn, baby development, first cry, parent, caregiver, nourishment;
- sun, moon, heart, tears, sleep, dream, lullaby, river, water, roots, tree;
- gravity, magnetism, circle, sphere, pause, rhythm, frequency, color;
- cosmological creation, galaxies/cells, cosmic pregnancy, spirit, sacredness;
- seed, fire, warmth, shadow/light, and biological growth.

The source may use an image alongside a functional description. The extraction
keeps the functional description and image distinct; it does not promote a
metaphor into an executable operator.

## Scientific, Historical, and Etymological Boundary

Statements about cosmology, gravity, frequency, biology, word origins,
`zë-më-ra`, `Ze ro`, and the `krim` wordplay remain author doctrine or
explanatory narrative. This document does not treat them as externally
established scientific, historical, or linguistic facts.

## Internal Tension Registry

| Area | Classification | Current handling |
| --- | --- | --- |
| A beginning/creation vs A = `Bashkimi` | `MULTIPLE_DIMENSIONS` | Keep narrative origin, functional profile, and principle association separate. |
| E expansion/transformation vs E = `Vibrimi` | `MULTIPLE_DIMENSIONS` | Do not make Vibrimi a synonym for expansion. |
| I knowledge/illumination vs I = `Ritmi` | `POTENTIAL_TENSION` | Source supports both as separate dimensions; no normalization decision exists. |
| U support/depth vs U = `Ndryshimi` | `MULTIPLE_DIMENSIONS` | Do not treat Ndryshimi as a replacement for the support/depth profile. |
| Y choice/exploration/mystery vs `Reflection/Mirror` and `Network Integrity` | `AUTHORITY_VERSION_DRIFT` | Source support for the current labels is not established; preserve all sets pending review. |
| Ë resolution/harmony/peace vs `Dashuria`, `Completion/Unit`, and evolution language | `MULTIPLE_DIMENSIONS` | Do not collapse relational, principle, completion, or change language. |
| O unity/source language vs unity/source language elsewhere | `POTENTIAL_TENSION` | O has the strongest mediator/center relation, but unity/source words are not exclusive proof of one machine role. |
| Chapter 1 six-Voice development before O vs Chapter 2 O as seventh mediator | `NARRATIVE_ORIGIN` | Preserve as narrative sequence; do not infer path order semantics. |
| Chapter 1 / Chapter 2 high-low descriptions | `UNRESOLVED_OR_CONFLICTING` | Chapter 1 line 37 groups Ë with A/E/I in high/light forces, line 38 names U/Y as lower/anchoring, and chapter 2 line 27 places Ë with U/Y in the low group. Preserve both source statements; do not derive a universal executable partition. |
| `Ë` vs `Ẽ` in chapter 2 line 40 | `UNRESOLVED_OR_CONFLICTING` | Preserve source spelling; do not normalize or reinterpret the character in technical authority. |

## Engine-Model Gap Analysis

`Voice -> PrincipleRole` is `INSUFFICIENT_REQUIRES_MULTIDIMENSIONAL_PROFILE`
for faithful representation of the source. It is sufficient only for the
current narrow canonical machine projection, not for the extracted source as a
whole.

The smallest defensible future model is Model C: a versioned multidimensional
doctrine profile containing separate functional properties, principle
association, relational properties, symbolic metadata, and unresolved fields.
`PrincipleRole` should remain one field, not be overwritten.

No profile schema is authorized by this document. A future profile contract
must define which dimensions are executable, which remain descriptive, and how
unknown/conflicting dimensions are represented.

## PR #1940 Implications

PR #1940 is open at head `73598862ac8bc7b838408d71f97b07a2bb612439` and is not
modified here.

| PR #1940 term/field | Review result | Reason |
| --- | --- | --- |
| `ORDERED_STATE_TRANSITION` | `RENAME` or `DEFER` | The source supports ordered Voice identity and relationships, not a universal state transformation. |
| `DoctrineSymbolicStateV1` | `RENAME` | A position/profile projection is safer than asserting a semantic state. |
| `startState` | `RENAME` | Preserve `startPosition` or `initialVoice` unless a future contract authorizes state semantics. |
| `terminalState` / `result` | `REMOVE` or `RENAME` | Terminal/result implications are not source-established. |
| transition records | `KEEP` only as structural adjacency records | Preserve complete order and duplicates without asserting causation, transformation, or dominance. |
| self-transition | `REMOVE` as semantic meaning; `KEEP` only as duplicate adjacency data | Repeated paths have no source-authorized self-transition semantics. |
| reversal tests | `NARROW` | Order may be recorded distinctly, but reversed semantic action is not established by these chapters. |

PR #1940 disposition after this extraction: `KEEP_WITH_NARROWING`. It should
not merge unchanged as an engine-authorized generic state-transition rule.
Narrowing requires a separate implementation/governance task and is outside
this extraction PR.

## Candidate Normalized Architectures

| Model | Assessment |
| --- | --- |
| Model A: Voice -> one `PrincipleRole` | Safe for current projection; insufficient for the source dimensions and source vocabulary drift. |
| Model B: Voice -> functional profile | Better, but too narrow if it omits principle, relational, symbolic, and unresolved dimensions. |
| Model C: Voice -> multidimensional doctrine profile | Recommended target for the next design review; preserves separate fields and source traceability without replacing machine roles. |
| Model D: path operator first | Reject for now; composition semantics are not established before profile normalization. |

The recommended sequence is: source extraction (this document) -> governance
review of profile fields and source tensions -> a versioned profile contract ->
separate composition/hypothesis work. No step promotes source doctrine to
lexical evidence.

## Epistemic Boundary Result

The architecture must keep these lanes separate:

1. `AUTHOR_PRIMARY_DOCTRINE_SOURCE`: verbatim Albanian chapters.
2. `TECHNICAL_DOCTRINE_EXTRACTION`: this document, traceable and non-executable.
3. `ENGINE_AUTHORIZED_DOCTRINE`: only reviewed contracts already authorized by the repository.
4. `DOCTRINE_DERIVED_HYPOTHESIS`: bounded internal output, not lexical evidence.
5. `RESEARCH_EVIDENCE`, `REVIEWED_EVIDENCE`, and `PRODUCTION_EVIDENCE`: independent evidence states.
6. `TARGET_SENSE`: supplied context, not automatically established by doctrine.
7. `USER_JUDGMENT`: remains required; no single winner is implied.

Doctrine profiles may eventually generate bounded symbolic hypotheses, but they
must not create lexical, historical, etymological, source-attested, or reviewed
claims without an independent evidence lane.

## Unresolved Governance Decisions

- Whether the seven Chapter 4 names are a second principle dimension or a replacement set; current evidence supports preserving both until reviewed.
- Which source-derived functional properties, if any, may become executable profile fields.
- Whether frequency/level, color, and other symbolic metadata are descriptive only or have any authorized engine use.
- Whether A/Ë complementarity and O's mediator relation require structured relational metadata.
- Whether Y's source profile should remain separate from current `Reflection/Mirror` and `Network Integrity` labels.
- Whether a future composition rule is profile interaction, structural adjacency, or another reviewed abstraction.
- Whether PR #1940 should be narrowed to ordered position/profile records before merge.
- What review unit and provenance fields are required for any future engine-authorized profile.

## Next Implementation Prerequisite

`OPEN_INSTRUMENT_DOCTRINE_FUNCTIONAL_PROFILE_NORMALIZATION_V1` is the next
technical/governance prerequisite. It should review this extraction, resolve
the explicit tensions, define a minimal profile contract, and leave
unresolved fields fail-closed. It must not change current machine mappings in
the same lane.

## Validation Record

The four primary source files were read in full before this extraction. Their
body-only hashes remain:

| Source | SHA-256 |
| --- | --- |
| chapter 1 | `42aad487d2d025ff8f0d5d7efbaed5c50a8e627da1d37b515dbe8a0bd5b7f329` |
| chapter 2 | `182b6846068dfef09c072a2a3dd1c7c674ea2e610b63173e9cec6be85042b98b` |
| chapter 3 | `4618ca7ad5797afd4e80d98584c53e3c297813dcb7674d6a6a6703a2b4f3ce32` |
| chapter 4 | `02ac9877a3f77285e6031844ccfe368e4df522bc3232e1027680791f20e131e6` |

No source file, runtime file, test, current machine mapping, provider control,
PR #1940 file, or DF_BRAIN file is changed by this extraction.
