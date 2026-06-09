# Zheji Study002 Study003 Study004 Segmentation Comparison Design v0.1

## Purpose

This document designs the controlled comparison across the Zheji `study` segmentation line:

- `study.segmentation.002`
- `study.segmentation.003`
- `study.segmentation.004`

This is a design document only.

It does not run a model.

It does not create a comparison artifact.

It does not create a publication claim.

It does not declare a winning segmentation.

It does not declare origin.

It does not declare candidate truth.

## Current status

The `.004 / S + TU + DI` hard-case lane has now reached a reviewed clean schema/traceability milestone.

Most recent reviewed artifact:

- PR #1259 archived the clean artifact.
- PR #1260 reviewed the clean artifact.
- classification: `CLEAN_ZHEJI_SEGMENTATION_TRACEABILITY_HARDENED_REPLAY`
- status: `clean`
- structural issue count: `0`
- enrichment warning count: `0`

This unlocks comparison design.

It does not unlock publication framing by itself.

## Comparison target

The comparison should compare segmentation behavior, not historical truth.

The controlled comparison should ask:

- what each segmentation makes visible
- what each segmentation hides
- what candidate types each segmentation invites
- how stable the Brain schema remains under each segmentation
- how semantic/function motivation changes across segmentation granularity
- how null candidates behave across segmentation granularity
- how Zheji semantic transparency behaves across segmentation granularity

## Segmentation candidates

### Study002

Expected comparison role:

- earlier segmentation lane
- must be treated as one candidate segmentation, not a winner
- must be reviewed from archived artifacts/docs only
- no rerun in this design PR

### Study003

Expected comparison role:

- `SHTU + DI` style segmentation
- shows a larger embryo morpheme chunk for the first unit
- useful for seeing whether combined `SHTU` stabilizes meaning/function motivation better than smaller chunks
- no rerun in this design PR

### Study004

Expected comparison role:

- `S + TU + DI`
- finer segmentation
- most recent hard-case path
- now contract-clean after enum, payload, and segmentation-traceability hardening
- useful for seeing whether smaller embryo morphemes create more precise traceability or more null-candidate pressure

## Required inputs for the future comparison

The future comparison PR must cite existing archived artifacts and reports.

It must not rely on chat memory.

It should inspect:

- artifact classifications
- statuses
- structural issue counts
- enrichment warning counts
- candidate counts
- null candidate counts
- raw Brain top-level keys
- forbidden field absence or presence
- candidate payload survival
- candidate-level `segmentationId` survival
- semantic transparency survival
- claim boundary fields
- report wording

## Comparison table design

The future comparison document should include a table with these columns:

- segmentation ID
- chunk shape
- artifact source
- classification
- status
- structural issue count
- enrichment warning count
- candidate count
- null candidate count
- top-level skeleton survived
- forbidden fields absent
- candidate payload survived
- segmentation traceability survived
- semantic transparency survived
- interpretation
- limitation

## Interpretation rules

The comparison must use careful language.

Allowed language:

- `makes visible`
- `pressures`
- `stabilizes`
- `exposes`
- `suggests`
- `supports schema stability`
- `shows segmentation-dependent behavior`
- `remains a development artifact`

Forbidden language:

- `proves origin`
- `true origin`
- `winning segmentation`
- `best language`
- `language ownership`
- `historically proven`
- `scientifically proven`
- `final truth`
- `model proves`

## Meaning/function motivation boundary

Open Instrument remains a meaning/function motivation instrument.

It is not an etymology engine.

It does not find origin.

It does not declare a winner.

It records which language candidates can motivate the meaning/function of embryo morphemes through a language's own smallest meaningful units.

The comparison should compare motivation behavior under different segmentation shapes.

## Required boundary statement

The future comparison document must include this boundary statement:

This comparison records how different Heart-approved segmentations change Brain candidate behavior for the word `study`. It does not claim that any segmentation is historically original, linguistically superior, or finally true.

## No model call rule

This design PR makes no model call.

The next comparison implementation should also be docs-only unless a separate preflight explicitly authorizes a new controlled model call.

No new `.002`, `.003`, or `.004` rerun is allowed from this design.

## Scope

This PR is docs design only.

It does not:

- call a model
- create an artifact
- create a comparison result
- change prompts
- change validators
- change source implementation
- change runtime/API/UI wiring
- change provider default
- use OpenAI API
- rerun `.002`
- rerun `.003`
- rerun `.004`
- create publication framing

## Next allowed action

After this design PR lands, the next allowed PR is a docs-only comparison result or comparison worksheet that reads existing archived artifacts and reports.

Suggested next PR:

`docs(open-instrument): compare zheji study002 study003 study004 segmentations`

No model call should happen in that PR.

## Final design decision

The `.002 / .003 / .004` comparison is allowed as a controlled documentation comparison of existing evidence.

It must remain inside the meaning/function motivation boundary.

It must not become an origin, winner, or publication claim.
