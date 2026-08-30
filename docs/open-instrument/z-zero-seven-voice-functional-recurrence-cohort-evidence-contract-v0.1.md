# ZË-RO Seven-Voice Functional Recurrence Cohort Evidence Contract v0.1

Status:

`research evidence admission contract`

Milestone ID:

`SEVEN_VOICE_FUNCTIONAL_RECURRENCE_COHORT_EVIDENCE_CONTRACT_V0_1`

Schema:

`open-instrument.seven-voice-functional-recurrence-cohort-evidence.v0_1`

## Purpose

Seven-Voice Functional Recurrence v0.1 established a deterministic recurrence algorithm over explicitly declared comparison forms.

This contract adds the missing evidence-admission boundary before source-backed recurrence research.

The architecture is:

`source evidence`
→ `cohort evidence admission`
→ `validated comparison forms`
→ `existing Seven-Voice Functional Recurrence engine`
→ `future research evaluation`

The evidence-admission layer does not replace the recurrence engine.

It controls which externally or project-attested observations are allowed to enter an evidence-backed recurrence cohort.

## Core distinction

The existing recurrence engine answers:

> Given these declared comparison forms, which canonical Seven Voices are shared across all forms?

The cohort evidence contract answers a different question:

> Are these declared comparison forms sufficiently source-traceable, mode-explicit, and claim-bounded to participate in evidence-backed recurrence research?

These responsibilities must remain separate.

## Canonical Seven Voices

The canonical Seven Voices remain:

`A, E, I, O, U, Y, Ë`

Y remains a canonical voice.

Consonants may shape lexical or structural frames but do not independently drive the Seven-Voice recurrence path.

## Evidence admission is fail closed

A cohort is admitted only when every observation satisfies the contract.

If any observation is malformed, unsafe, duplicated, unsupported, or violates the claim boundary:

- the complete cohort is rejected
- no partial observation set is emitted
- no recurrence forms are emitted
- the existing recurrence engine is not called by the evidence-backed entry point
- no partial cohort may silently alter the canonical intersection

This is a whole-cohort fail-closed contract.

## Required cohort identity

Every cohort requires:

- schema version
- cohort id
- concept id
- one or more observations

An empty cohort is rejected.

## Required observation identity

Every observation requires a unique:

`recurrenceEvidenceId`

Duplicate evidence ids reject the complete cohort.

Each observation also records:

- evidence role
- language id
- optional language variety
- source-attested surface form
- declared comparison form
- comparison mode
- comparison authority
- comparison provenance
- source attestation truth
- source status
- structured citations
- explicit claim boundary

## Evidence roles

v0.1 permits:

- `cohort_member`
- `negative_control`

A negative control is evidence.

It must not be filtered merely because it weakens or eliminates a desired recurrence result.

A valid negative control participates in the recurrence input exactly as declared.

Therefore a negative control may legitimately produce:

`sharedFunctionalNucleus = []`

Null / empty recurrence is a valid result.

## Source attestation

Evidence-backed recurrence requires source-traceable lexical attestation.

Every admitted observation requires at least one usable structured citation.

The cohort layer reuses the established multi-source research citation structure rather than creating a second incompatible provenance vocabulary.

Required citation information includes:

- citation id
- source title
- publisher or host
- date or version
- source URL or archive reference
- entry locator
- attested form
- attested gloss

Optional citation fields may include:

- author or editor
- source/archive hash

At least one citation must attest the declared surface form.

The comparison form does not replace surface attestation.

## Attestation truth

v0.1 admits source-attestation truth only as:

- `fact`
- `inference`

`fact` may represent directly attested lexical evidence.

`inference` may represent an explicitly identified reconstruction or other evidence-bounded inference.

The following do not qualify as source attestation for an evidence-backed cohort:

- hypothesis
- unknown
- null pretending to be evidence

A functional interpretation may remain hypothetical even when the lexical form itself is factually attested.

These truth layers must not be collapsed.

## Source status

v0.1 reuses the established research source-status vocabulary:

- `research_candidate`
- `reviewed_candidate`

These statuses do not create production truth.

They do not automatically promote a recurrence observation to Reviewed candidate truth or canonical truth.

## Comparison modes

The comparison modes remain exactly those established by Seven-Voice Functional Recurrence v0.1:

- `orthography`
- `transliteration`
- `z_zero_functional_normalization`

Modes must not be silently substituted.

### Orthography

For orthography:

- the comparison form is explicitly declared
- the comparison authority is explicitly declared
- comparison provenance is still retained
- a transformation rule id is not mandatory when no transformation is being asserted

### Transliteration

For transliteration:

- the transliteration must be explicit
- comparison authority must identify its authority/scheme
- comparison provenance must contain a non-empty rule id

A transliteration may not silently masquerade as orthography.

### ZË-RO functional normalization

For:

`z_zero_functional_normalization`

the cohort must provide:

- explicit comparison authority
- explicit comparison provenance
- a non-empty normalization rule id

The recurrence admission layer does not invent a normalization.

The recurrence algorithm does not invent a normalization.

The caller must supply the declared comparison form and its provenance.

## Comparison authority integrity

`comparisonAuthority`

must agree with:

`comparisonProvenance.authority`

An authority mismatch rejects the cohort.

This prevents a comparison form from being labeled under one authority while being justified by another.

## Evidence references

Accepted admission preserves auditable references from:

- structured citation ids
- comparison-provenance evidence refs

These references are audit/provenance links.

They are not semantic scores.

They are not historical-origin votes.

## Claim boundary

Every admitted observation must explicitly preserve:

`historicalOriginClaim = not_claimed`

`historicalTransmissionClaim = not_claimed`

`cognacyClaim = not_claimed`

`borrowingClaim = not_claimed`

`winnerClaim = not_claimed`

`languageSuperiorityClaim = not_claimed`

`candidateTruthClaim = not_claimed`

`universalityClaim = not_claimed`

`userDecisionPosture = user_decides`

Any attempt to promote the cohort beyond these boundaries rejects the complete cohort.

## No single winner

Functional recurrence does not establish a historical winner.

The project posture remains:

`no_single_winner`

Recurrence may be observed without deciding:

- which language is older
- which language supplied another
- whether forms are cognate
- whether borrowing occurred
- whether one language is the origin
- whether one hypothesis is universally correct

## Deterministic fact versus interpretation

Within an accepted cohort, deterministic facts include:

- which evidence rows were admitted
- which comparison forms were emitted
- each comparison mode and authority
- each Seven-Voice path produced by the existing recurrence engine
- the intersection of canonical voices
- the resulting shared functional nucleus

The interpretation that a recurrent voice carries or motivates a semantic function remains a research hypothesis unless separately supported.

## Counterexamples are valid evidence

Counterexamples and negative controls are not implementation failures.

They are required research evidence.

Future recurrence research must preserve forms that:

- produce no shared canonical voice
- share a different voice than expected
- depend on comparison mode
- challenge a proposed functional interpretation

The system must never discard counterexamples merely to preserve a preferred recurrence.

## Existing architecture preserved

This contract does not modify:

`src/shared/openInstrument/sevenVoiceFunctionalRecurrence.v0_1.ts`

It also does not modify the existing multi-source evidence registry or functional-normalization owner.

Instead it reuses their established types and boundaries where appropriate.

The evidence-backed recurrence entry point calls the existing recurrence engine only after successful cohort admission.

## No production/runtime wiring

v0.1 adds no:

- Analyze V1 projection
- API route
- UI surface
- InstrumentPanel wiring
- chat-page wiring
- provider execution
- network acquisition
- automatic web research
- source fetching
- candidate promotion
- Reviewed promotion

This is a shared research contract seam only.

## No real cohort data in this milestone

The v0.1 implementation tests use fixtures to prove behavior.

Those fixtures are not promoted research evidence.

This milestone does not add a production recurrence evidence catalog.

It does not claim that fixture citations constitute external linguistic evidence.

Real source rows must be introduced separately under explicit review.

## No statistical claim

This milestone does not calculate:

- recurrence prevalence
- effect size
- statistical significance
- chance baseline
- expected baseline frequency
- language-family independence
- universality

Those questions require a later research design after evidence admission is trustworthy.

The required ordering is:

`evidence admission`
→ `larger controlled cohorts`
→ `counterexamples`
→ `baseline design`
→ `frequency/statistical analysis`

not the reverse.

## Future research

After this contract is reviewed and merged, future lanes may evaluate:

- larger language cohorts
- independent language families
- source-attested lexical forms
- orthography versus transliteration recurrence
- explicitly governed functional-normalization recurrence
- negative/control cohorts
- expected baseline frequencies
- appropriate statistical baselines
- future phonetic-mode recurrence under a separately defined phonetic contract

None of those future lanes are automatically authorized by this contract.

## Milestone truth

This milestone establishes only:

> Evidence-backed Seven-Voice Functional Recurrence now has a deterministic, source-traceable, mode-explicit, fail-closed cohort admission seam before the existing recurrence algorithm.

It does not establish:

- that any particular functional recurrence is scientifically proven
- that recurrent voices establish cognacy
- that recurrent voices establish borrowing
- that recurrent voices establish historical origin
- that recurrent voices establish universality
- that recurrent voices establish candidate truth

Null remains valid.

Counterexamples remain valid.

User decision posture remains explicit.

The governing doctrine remains:

**Logic discovers. Evidence validates or contextualizes. Promotion remains strict.**

For recurrence research, the additional ordering principle is:

**Evidence admission precedes recurrence statistics.**
