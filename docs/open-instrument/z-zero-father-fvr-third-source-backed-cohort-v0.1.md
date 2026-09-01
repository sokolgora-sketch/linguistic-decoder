# ZË-RO FATHER FVR Third Source-Backed Cohort v0.1

Date: 2026-08-31

Status: IMPLEMENTATION_CANDIDATE.

## Purpose

This lane adds a third real source-backed Seven-Voice Functional Recurrence
research cohort to Open Instrument.

Existing live cohorts:

- WATER
- EYE

New cohort:

`FATHER`

The lane reuses the existing deterministic recurrence engine, fail-closed
cohort evidence admission, generic research catalog, `/api/research/fvr`
endpoint, and generic Cross-Language Recurrence UI.

It does not alter the single-word Analyze V1 truth model.

## Source-backed comparison forms

### English

Source:

Oxford Advanced Learner's Dictionary — `father` noun.

Declared row:

- surface: `FATHER`
- comparison: `FATHER`
- mode: `orthography`
- authority: `source_orthography`
- expected Seven-Voice path: `A-E`

The source attests the ordinary male-parent sense.

### Albanian

Existing reviewed lexical source provenance:

`reviewed.external.albanian-at.father.citation.v0_1`

Source:

`The Albanian inherited lexicon`

Author/editor metadata:

`Bardhyl Demiraj; database revised by Alexander Lubotsky and Michiel de Vaan`

Host:

`IEED / ieed.ullet.net`

Source locator:

`at [m] (tg) {2} 'father'; Alb. atë [m] (tg) 'father' (AE 83)`

Declared FVR row:

- surface: `AT`
- comparison: `AT`
- mode: `orthography`
- authority: `source_orthography`
- expected Seven-Voice path: `A`

The FVR row retains its own `research.father.*` identity.

The reviewed status of the canonical-operator AT lane is not promoted into
FVR truth. The FVR row remains `research_candidate`.

## Expected deterministic recurrence

If the existing recurrence engine confirms the declared paths:

`FATHER -> A-E`

`AT -> A`

the intersection is expected to be:

`A`

That recurrence is not recorded as validated project fact until the focused
tests and live product smoke pass.

## Truth hierarchy

Fact if admitted and deterministically verified:

- cited lexical surfaces are source-attested;
- declared comparison modes are explicit;
- Seven-Voice extraction is deterministic;
- the canonical intersection is whatever the existing recurrence engine emits.

Research hypothesis:

- that recurrent `A` carries or motivates a FATHER / progenitor-related
  functional principle.

Not claimed:

- phonetic identity;
- historical origin;
- historical transmission;
- cognacy as an FVR conclusion;
- borrowing;
- candidate truth;
- language superiority;
- universality.

User decision posture remains:

`user_decides`

Project posture remains:

`no_single_winner`

## Separation from canonical AT runtime evidence

Open Instrument already has reviewed bounded functional lexical evidence for
Albanian `AT = father`.

That existing lane governs canonical-operator runtime projection for bounded
targets.

This FVR cohort is a separate research claim:

> Across two source-attested concept-equivalent lexical forms, which canonical
> Seven Voices recur under explicitly declared comparison modes?

The FVR catalog therefore copies the lexical citation provenance into its own
cohort evidence row rather than coupling recurrence admission to the canonical
operator runtime registry.

## Protected architecture

This lane must not modify:

- `/api/analyze-v1`;
- `functionalVoiceNormalization.v0.1.ts`;
- `sevenVoiceFunctionalRecurrence.v0_1.ts`;
- `sevenVoiceFunctionalRecurrenceCohortEvidence.v0_1.ts`;
- canonical AT runtime authorization;
- JO parked work;
- provider execution;
- security remediation.

The Cross-Language Recurrence card is already generic for ordinary
orthographic cohorts after the EYE milestone and requires no FATHER-specific
runtime branch.

## Expected live surface

`/api/research/fvr?concept=father`

Expected only after validation:

- status: `available`
- concept id: `FATHER`
- comparison forms: `FATHER`, `AT`
- shared functional nucleus: `A`
- recurrence observation truth:
  `fact_within_declared_comparison_forms`
- functional meaning truth:
  `research_hypothesis`

Unknown concepts must remain fail-closed.

## Research ordering

No recurrence statistics are authorized by this milestone.

The recurrence rule remains:

**Evidence admission precedes recurrence statistics.**

The governing doctrine remains:

**Logic discovers. Evidence validates or contextualizes. Promotion remains strict.**
