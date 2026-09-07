# ZË-RO WATER Functional Recurrence Live Research Slice v0.1

Date: 2026-08-30

Status: IMPLEMENTED_RESEARCH_SURFACE.

The bounded research surface described here is implemented in the current
catalog, `/api/research/fvr`, `/chat` recurrence card, and provider-disabled
live smoke. This status does not promote recurrence observations to statistics,
historical origin, cognacy, or production linguistic truth.

## Purpose

This slice connects the existing Seven-Voice Functional Recurrence research
engine to the user-facing Open Instrument without rewriting single-word truth.

The existing `/api/analyze-v1` WATER analysis remains independent.

In particular, this slice does not replace:

- raw `WATER -> A-E`;
- existing bounded single-word functional normalization;
- structural `WATER -> WAT -> AT`;
- `structural_unreviewed` truth where applicable.

Instead it adds a separate explicit research surface:

`source-attested concept cohort`
→ `FVR cohort evidence admission`
→ `Seven-Voice Functional Recurrence`
→ `Cross-Language Recurrence — Research`

## First live research concept

Concept:

`WATER`

Declared comparison cohort:

- English `WATER -> UOTER -> U-O-E`
- Standard Albanian `UJË -> U-Ë`
- Gheg Albanian `UJ -> U`
- Mandarin `shuǐ -> SHUI -> U-I`

Shared functional nucleus:

`U`

## Source evidence

### English

Source:

Oxford Advanced Learner's Dictionary, `water`.

The source establishes the English lexical surface and meaning.

It does not establish `UOTER`.

`WATER -> UOTER` remains explicit ZË-RO project comparison doctrine owned by:

`SEVEN_VOICE_FUNCTIONAL_RECURRENCE_V0_1`

and:

`docs/open-instrument/z-zero-seven-voice-functional-recurrence-milestone-v0.1.md`

### Standard Albanian

Source:

IE-CoR Cognate Set 335.

Attested:

`ujë`

Meaning:

`water`

### Gheg Albanian

Source:

Norbert Boretzky,
`Konjunktiv und Infinitiv im gegischen Dialekt des Albanischen`,
Zeitschrift für Balkanologie 50 (2014) 2.

Page 145, example (1), contains:

`me pi uj`

with `uj` translated as `Wasser`.

This provides an exact Gheg `uj` lexical attestation for the research row.

### Mandarin

Source:

Ministry of Education, Republic of China (Taiwan),
Revised Mandarin Chinese Dictionary 2021.

Entry:

`水`

Hanyu Pinyin:

`shuǐ`

The source establishes the Mandarin lexical form / Pinyin.

The comparison transform:

`shuǐ -> SHUI`

is explicitly declared as a research comparison transform and is not treated
as source orthography.

## Truth hierarchy

Fact:

- the cited lexical surfaces are source-attested;
- admitted comparison forms have deterministic Seven-Voice paths;
- the admitted WATER cohort intersects at `U`.

Research hypothesis:

- that the recurrent `U` carries or motivates a WATER-related functional
  principle.

Not claimed:

- phonetic identity;
- historical origin;
- historical transmission;
- cognacy;
- borrowing;
- language superiority;
- candidate truth;
- universality.

User decision posture remains:

`user_decides`

## Product boundary

The recurrence result is loaded through a separate research API:

`/api/research/fvr?concept=water`

The normal word request remains:

`/api/analyze-v1?word=water&mode=strict`

The two result classes may be shown together but may not be silently merged.

The research API must return `not_available` for concepts without an admitted
cohort.

It must not invent comparison forms from arbitrary words.

## User surface

When a real admitted FVR concept is available, `/chat` may show:

`Cross-Language Recurrence`

with:

- source form;
- comparison form;
- comparison mode;
- Seven-Voice path;
- source citation;
- shared functional nucleus;
- research-hypothesis truth boundary.

The first slice exposes:

`WATER -> shared U`

as research evidence, not production linguistic truth.
