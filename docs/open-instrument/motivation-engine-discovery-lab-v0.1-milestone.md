# OPEN INSTRUMENT — MOTIVATION ENGINE / DISCOVERY LAB v0.1

Milestone ID: `OPEN_INSTRUMENT_MOTIVATION_ENGINE_DISCOVERY_LAB_V0_1`

Status: `IMPLEMENTATION_STARTED`

Date defined: 2026-10-06

## Verified stage after M8

The M8 multilingual expansion seam is complete: the generic Motivation Engine
can compose the existing Albanian adapter with one independently bounded Latin
source adapter backed by the frozen Lewis & Short records. Latin lexical facts
and provenance remain source-only; pronunciation, spoken Voice, Gamma, ZC,
functional interpretation, historical relation, and winner claims remain
Null or unclaimed where authority is absent. M9 closure has not started.

```text
M0=COMPLETE
M1=COMPLETE
M2=COMPLETE
M3=COMPLETE
M4=COMPLETE
M5=COMPLETE
M6=COMPLETE
M7=COMPLETE
M8=COMPLETE
M9=NOT_STARTED
MILESTONE_DONE=NO
```

## Historical initial implementation stage

The following stage note records the initial M1/M3 slice and is retained as
historical context. The current verified stage is recorded above.

The first bounded vertical slice has started on the implementation branch.
It folds the existing M0/M1/M2 machinery and the minimum M3 composition seam
into an additive Discovery projection: Albanian-profile input can reach the
language-aware path, generic English retrieval can query reviewed Albanian
source rows, and the default `/chat` surface can label source facts, derived
structure, hypotheses, and Null outcomes. The slice preserves the existing
production canonical path and does not promote Albanian research evidence to
production pronunciation authority.

This is progress, not milestone completion. The full M3/M4/M5/M6 sequence,
broader language coverage, and final Discovery Lab closure remain open.

## Bounded M1/M3 lexical-substrate slice

The bounded Albanian M1/M3 implementation slice now projects source-attested
Albanian lexical facts from the existing typed research catalog and reviewed
lexical registry into the generic witness query seam. Retrieval is keyed by
deterministic embryo/structural-expansion values rather than the current input
word, so the reviewed DI row remains retrievable without a STUDY-specific
mapping and source-backed `zemër`/`gjak` records can be surfaced when their
existing structural keys qualify. Target words, semantic bridges, functional
hypotheses, historical claims, and winner claims are not projected into the
substrate.

The candidate surface labels candidate Voice extraction as an orthographic /
profile-derived Discovery representation, not spoken pronunciation, and keeps
source facts, deterministic structure, interpretation/hypothesis, and Null
outcomes separate. The existing reviewed registry remains a source-status
enrichment boundary; it is no longer the only runtime candidate population for
the Albanian Discovery slice.

```text
M1_BOUNDED_ALBANIAN_LEXICAL_SUBSTRATE=IMPLEMENTED
M3_GENERIC_ALBANIAN_RETRIEVAL=IMPLEMENTED
M4_STRUCTURAL_MOTIVATION_ANALYSIS=NOT_STARTED
M5_FUNCTIONAL_MOTIVATION_INTERPRETATION=NOT_STARTED
ALBANIAN_PROMOTED_TO_PRODUCTION=NO
MILESTONE_DONE=NO
```

This document is a durable planning boundary. It defines the next bounded
implementation sequence; it does not implement or authorize production
behavior by itself.

## Purpose

This milestone defines a generic Motivation Engine and a user-facing Discovery
Lab for exploring multilingual functional motivation candidates. The engine is
generic machinery. The Discovery Lab is an exploratory surface over that
machinery. Neither is an etymology engine, an origin adjudicator, or a license
to promote research evidence into production truth.

The milestone begins with Albanian as the first language because the current
project has an explicit Albanian source/profile authority path and because
Albanian is a useful bounded test of a language that is not English. English is
not the architectural default and no English-only candidate model is allowed.

## North star

For a previously unprepared input word in a supported language, the system
should be able to enter a deterministic, provenance-preserving exploration
path:

```text
input word
  -> pronunciation / phonological representation
  -> Seven Voices / Math7 / Gamma / consonantal structure where authorized
  -> language-aware lexical candidates
  -> structural and functional motivation evidence
  -> competing explanations with status, provenance, and unresolved fields
  -> user-facing Discovery Lab
```

The user should be able to see the candidate language, form, meaning/gloss,
pronunciation or phonological representation, nucleus/Voice structure,
consonantal structure, evidence references, functional interpretation, truth
status, historical-relation boundary, and reasons for any unresolved result.

The output must preserve competing candidates. There is no hidden winner and
no automatic historical-origin conclusion. The user remains the final
interpreter.

## Architecture boundary

The strict deterministic layer remains the authority for production analysis,
fail-closed behavior, canonical normalization, provenance, and existing
runtime contracts. The Discovery Lab may consume explicitly authorized
experimental or research inputs, language adapters, dialect forms, competing
pronunciations, cross-language candidates, and experimental interpretations,
but it must label their source and status and keep them separate from
production truth.

The required truth layers are:

1. **SOURCE FACT** — a source explicitly attests a form, pronunciation,
   language, gloss, or other evidence field.
2. **DERIVED STRUCTURE** — deterministic project computation such as a
   pronunciation path, nucleus ordering, or consonantal configuration.
3. **ZË-RO INTERPRETATION / HYPOTHESIS** — a functional explanation proposed
   from the evidence and structure.
4. **UNKNOWN / NULL** — authority or structure is unavailable, conflicting, or
   intentionally unresolved.

Every future surface must make these layers distinguishable. A factual lexical
attestation does not make a functional bridge factual. A structural match does
not establish historical transmission. A research row does not become
production truth merely because it is displayed.

## Albanian-first boundary

Albanian is the first language slice, not a claim that the project has solved
Albanian phonology or that Albanian has historical priority. The roadmap may
use the existing seven-vowel / seven-Voice correspondence as a project
representation while preserving source/profile, notation, and evidence
boundaries.

The Albanian slice must preserve these constraints:

- Albanian has a 36-letter alphabet and the letters A/E/Ë/I/O/U/Y align with
  the project's seven canonical Voice identifiers as a bounded project fact;
- Albanian orthography is more phonemic than English in relevant respects, but
  digraphs, dialect variation, and pronunciation evidence remain separate;
- no claim of one letter equaling one sound is authorized;
- no claim of linguistic superiority, historical priority, or universal
  Albanian category coverage is authorized;
- the frozen Albanian source/profile, phonological category, notation, and
  fail-closed contracts remain authoritative;
- the current Albanian source closure remains a valid boundary and is not
  reopened by this milestone.

## Stages

The stages are ordered implementation slices. A later stage cannot silently
replace an earlier authority decision or skip its validation boundary.

### M0 — architecture and reuse inspection

Map the existing pronunciation, phonological, Seven-Voice, Math7,
consonantal, structural-hypothesis, candidate, evidence, status, comparison,
export/replay, and `/chat` seams. Record the smallest reusable boundary before
adding any new type or adapter. Duplicate subsystems are out of scope.

### M1 — multilingual lexical substrate

Define the smallest source-bound lexical input seam, beginning with Albanian.
Source selection, license/provenance, source profile, language identity,
normalization, and Null behavior must be explicit. A reviewed source row may
enrich an explanation but may not become the only retrieval mechanism for a
generic input.

### M2 — language-aware structural analysis

Apply existing pronunciation and phonological authority with language/profile
qualification. Preserve pronunciation variants, moving nuclei, Seven Voices,
Math7, consonantal configuration, and unresolved structure without using
orthographic inference or G2P as an implicit fallback.

### M3 — generic candidate retrieval

Retrieve candidate forms from the authorized multilingual substrate using a
generic, deterministic path. Retrieval must not be word-specific, registry-
only, or dependent on a hand-authored mapping for the selected study word.

### M4 — structural motivation analysis

Compare input and candidate structures through existing authorized operations.
Report the nucleus, Voice path, consonantal configuration, expansion or
reduction chain, and evidence references. Preserve multiple candidates and
fail closed where a relation is not authorized.

### M5 — functional motivation interpretation

Represent what the structure may functionally motivate while keeping source
facts, deterministic derivations, and hypotheses separate. Historical
relations may be displayed as context only. The engine must not convert a
functional interpretation into an origin claim.

### M6 — Discovery Lab `/chat` experience

Expose the exploratory result in a user-facing surface that makes language,
form, meaning, structure, evidence, status, and unresolved reasons legible.
The surface must communicate that candidates are competing interpretations,
not a hidden ranked historical answer.

### M7 — novel-input and anti-hardcoding validation

Select a previously unprepared input using a deterministic procedure after the
retrieval substrate and procedure are frozen. Do not freeze the exact novel
word in this milestone definition. Verify generic retrieval and explanation,
not a special-case result.

### M8 — multilingual expansion seam

Confirm that another language can be added through a bounded source/language
adapter without rewriting the engine or weakening evidence boundaries. Greek,
Latin, Sanskrit, and other future languages remain expansion targets, not
prematurely selected source authorities in v0.1.

### M9 — milestone closure

Close only after the implementation slices, validation, provenance, UI
boundary, and remaining Null conditions are recorded. Closure must use the
token below and must not claim doctrine proof, historical proof, or universal
language coverage.

## Primary acceptance criterion

The primary test is a previously unprepared input that was not specially
encoded for the engine. From supported multilingual data, generic retrieval
must produce one or more candidate explanations when matching rules qualify,
or an explicit Null when authority or structure is insufficient.

The result must expose, separately:

- source facts and their provenance;
- deterministic structural derivations;
- functional interpretation or hypothesis;
- candidate status and user-decision posture;
- unresolved fields and reason codes.

The study and DI regression gate is valid only when the result comes through
generic retrieval. A registry entry, word-specific shortcut, or reviewed row
alone is not a passing demonstration of the engine.

Milestone closure requires at least one independently selected, generic
positive retrieval case whose qualifying source records are not a special-case
mapping for the input. A separate previously unprepared input may validly
produce `UNKNOWN / NULL` when its frozen authority does not qualify; that Null
case remains required evidence of fail-closed behavior and may not substitute
for the generic positive case.

At least one supported Albanian input must enter the pipeline during the
implementation lane. The milestone does not require forcing `ZEMËR` or any
other preselected word to produce a positive result.

## Candidate model direction

The implementation contract should be derived from existing candidate and
evidence contracts before new fields are introduced. Conceptually, a Discovery
Lab candidate must be able to preserve:

```text
inputWord
inputLanguage
inputSourceProfile / inputAuthorityBinding
candidateLanguage
candidateForm
candidatePronunciationOrPhonology
inputGloss / candidateGloss
sourceRefs
inputStructure
candidateStructure
inputNucleus / candidateNucleus
inputGamma / candidateGamma where authorized
inputConsonants / candidateConsonants where authorized
compatibilityOrRelation
functionalInterpretation
attestationTruthStatus
functionalBridgeTruthStatus
historicalRelation
candidateStatus
reasonCodes
unresolvedFields
userDecisionPosture=user_decides
originClaim=not_claimed unless separately authorized
```

The input language and source/profile authority binding are required at the
request or result boundary; the bare input spelling must never be the only
language discriminator. Attestation truth and functional-bridge truth remain
separate because a factual source attestation can support only a hypothesis
about the functional bridge.

These are planning requirements, not permission to add a schema in this
documentation lane. Existing types must be reused where they already express
the requirement.

## Anti-hardcoding boundary

The engine must not contain word-specific production mappings, candidate lists,
or hidden semantic exceptions. It must not pass by displaying only reviewed
rows. Reviewed rows can provide evidence or fixtures, but generic retrieval
must remain executable over the authorized source population.

Novel-input selection must be deterministic and frozen only after the
retrieval procedure exists. Selection must not depend on expected Voice path,
semantic attractiveness, desired language balance, or a known functional
result.

## Existing work to reuse

The future implementation must inspect and reuse, rather than duplicate, the
following current seams where applicable:

- spoken-first and source-bound pronunciation normalization:
  `src/shared/openInstrument/spokenVowelNormalization.v0_1.ts`,
  `src/shared/openInstrument/cmudictArpabetPronunciation.v0_1.ts`;
- Albanian source/profile, phonological category, projector, and pre-Voice
  bridge:
  `src/shared/openInstrument/albanianPronunciationSourceContract.v0_1.ts`,
  `src/shared/openInstrument/albanianPronunciationSourceProfiles.v0_1.ts`,
  `src/shared/openInstrument/albanianPhonologicalNucleusAuthority.v0_1.ts`,
  `src/shared/openInstrument/albanianPhonologicalCategoryProjector.v0_1.ts`,
  `src/shared/openInstrument/albanianPreVoiceCategoryBridge.v0_1.ts`;
- deterministic structural hypotheses and evidence references:
  `src/shared/structuralHypothesisDiscovery.v0_1.ts`;
- multi-source functional evidence and truth/status separation:
  `src/shared/multiSourceFunctionalDiscovery.v0_1.ts`,
  `src/shared/multiSourceFunctionalResearchProjection.v0_1.ts`,
  `src/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1.ts`,
  `src/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1.ts`;
- candidate normalization and UI adaptation:
  `src/shared/brain/candidateRecord.v0.1.ts`,
  `src/shared/analyzeV1Adapter.ts`,
  `src/ui/candidates/candidateModel.ts`;
- status, provenance, and user-decision enforcement:
  `src/shared/analysisStatus.v0_1.ts`,
  `src/shared/originClaim.deepRootHeartGatePolicy.v0.1.ts`;
- live composition seam:
  `app/api/analyze-v1/route.ts`;
- existing user-facing candidate/evidence surfaces:
  `src/ui/candidates/CandidatesAccordion.tsx`,
  `src/ui/instrument/InstrumentPanel.tsx`,
  `src/ui/instrument/sections/EvidenceTraceCard.tsx`;
- existing structural and consonantal artifacts and tests under
  `docs/open-instrument/` and `tests/`.

The list is an inspection map, not an authorization to change all of these
files. Each future lane must declare its exact seam and changed-file scope.

## Truth and authority rules

The milestone preserves the following hard boundaries:

- no IPA-to-Seven-Voice inference without an applicable frozen authority;
- no orthographic inference, G2P, or spelling fallback when pronunciation is
  unavailable;
- no semantic or etymological inference from structural resemblance;
- no provider or model execution unless a separate task authorizes it;
- no promotion of Albanian research evidence into production `/api/analyze-v1`
  or `/chat` merely because this roadmap exists;
- no single-winner ranking that hides alternatives;
- `user_decides` remains the user-facing posture;
- valid Null and unresolved outputs remain first-class results;
- evidence references remain attached to the claim they support;
- historical relationship and functional motivation are separate axes.

## Non-goals

This milestone does not:

- prove or disprove the ZË-RO doctrine;
- derive historical origin or replace etymology;
- establish an Albanian source claim or universal Albanian phonology;
- define universal consonant semantics;
- introduce statistical significance, scoring, or hidden confidence thresholds;
- rerun the Functional Manifestation experiment;
- execute a new scientific experiment or provider run;
- cover every language or eliminate Null outcomes;
- choose a single candidate winner;
- weaken provenance, source licensing, status, or fail-closed behavior;
- change Seven Voices, Math7, Gamma, consonantal configuration, or moving-
  nucleus authority;
- wire Albanian research into production routes or `/chat`;
- reopen the closed Albanian acquisition lane, One-Embryo dependency, or
  Diachronic v0.2;
- add a dataset, source contract, or runtime implementation in this
  documentation-only milestone.

## Definition of done

The future implementation sequence may use the following conceptual closure
token only after all required stages and validation are complete:

`OPEN_INSTRUMENT_MOTIVATION_ENGINE_DISCOVERY_LAB_V0_1_DONE`

This document does **not** mark that token complete. At the current implementation stage:

```text
MILESTONE_DEFINED=YES
IMPLEMENTATION_STARTED=YES
IMPLEMENTATION_COMPLETE=NO
DISCOVERY_LAB_SHIPPED=NO
MOTIVATION_ENGINE_SHIPPED=NO
DOCTRINE_PROVEN=NO
HISTORICAL_ORIGIN_PROVEN=NO
```

Every future lane must record its current stage, completed work, missing
authority or seam, next bounded slice, and how that slice advances the north
star. A lane that cannot state those five items stops rather than broadening
scope.

## Roadmap and planning state

This document is the repository-side milestone definition. The canonical
planning object is one Linear milestone under the existing Open Instrument
project, if created during the authorized lifecycle. Its initial state is
`MILESTONE_DEFINED`; it must explicitly say `IMPLEMENTATION_NOT_STARTED`.

The existing historical embryo-first functional-motivation milestone remains
closed/superseded for its original scope. This milestone reuses its truth
boundaries and does not reopen it. The One-Embryo Proof remains dependency-
blocked at its target-sense authority boundary. Diachronic v0.2 remains
inactive.

No duplicate stage issues or parallel project are authorized by this
milestone. If the existing Linear model cannot represent this as one milestone
under Open Instrument, the planning action must stop and report that exact
limitation instead of inventing a second hierarchy.

## Validation for this definition lane

The definition lane validates:

- repository path, branch, synchronized main, and clean worktree before
  editing;
- absence of an exact duplicate Motivation Engine / Discovery Lab milestone;
- consistency with `docs/dev-workflow.md`, `docs/process/README.md`, and the
  existing Open Instrument authority docs;
- internal links and referenced paths that exist in the repository;
- no production, API, UI, source, dataset, contract, or research-result
  changes;
- `git diff --check` and the repository-required gate/build according to the
  current workflow.

## Protected boundaries

This milestone must not mutate the JO object/tree, the Open Instrument
closeout branch, the doctrine record, FRD-02 results, Albanian frozen source
artifacts, current production pronunciation authority, or any existing
research result. DF_BRAIN is updated only after a confirmed repository merge,
using its standing local-update authority, preserving unrelated dirty state;
no DF_BRAIN remote push is implied.

## Freeze declaration

`OPEN_INSTRUMENT_MOTIVATION_ENGINE_DISCOVERY_LAB_V0_1` is a bounded roadmap and
milestone definition only.

```text
STATUS=IMPLEMENTATION_STARTED
PRODUCTION_BEHAVIOR_CHANGED=NO
FIRST_VERTICAL_SLICE=IN_PROGRESS
RESEARCH_EXECUTED=NO
PROVIDER_EXECUTED=NO
NEW_SOURCE_AUTHORITY_CREATED=NO
ALBANIAN_PROMOTED_TO_PRODUCTION=NO
ONE_EMBRYO_RESTARTED=NO
DIACHRONIC_V0_2_ACTIVATED=NO
```
