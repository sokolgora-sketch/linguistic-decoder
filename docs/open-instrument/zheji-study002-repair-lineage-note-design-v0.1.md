# Zheji Study002 Repair Lineage Note Design v0.1

## Status

Type: documentation design

This document designs a future Zheji `.002 / STU + DI` repair lineage note.

No model call is made.

No rerun is made.

No artifact JSON is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Immediate input

This design follows the accepted review of the updated Zheji segmentation contrast matrix:

- PR #1275: `docs(open-instrument): review updated zheji segmentation contrast matrix`

That review accepted matrix v0.2 and confirmed:

- `.002 / STU + DI` is direct-artifact-backed after PR #1273.
- `.002 / STU + DI` is not clean-parity evidence.
- v0.1 remains a repair predecessor.
- candidate-level `study.segment,002` drift remains visible.
- v0.2 remains reviewed direct evidence.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Purpose

The future repair lineage note should explain the `.002 / STU + DI` evidence lineage without overclaiming.

It should make the `.002` lane easier to read by separating:

- v0.1 repair predecessor status
- v0.1 candidate-level segmentationId drift
- v0.2 reviewed direct evidence status
- direct-artifact-backed evidence
- clean-parity evidence
- relationship to `.003 / SHTU + DI`
- relationship to `.004 / S + TU + DI`
- interpretation boundaries

## Non-purpose

The future repair lineage note is not:

- an etymology result
- an origin result
- a winner result
- a candidate-truth result
- a model-quality result
- a publication result
- a rerun plan
- a prompt-hardening plan
- a validator-hardening plan
- a source implementation plan
- a provider default plan

## Required source chain

The future note must cite and rely on repo-backed documents only.

Required source documents:

- `docs/open-instrument/study-segmentation-002-zheji-direct-json-evidence-review-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.2.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.2-review-v0.1.md`
- `docs/open-instrument/zheji-next-controlled-segmentation-decision-review-v0.1.md`

The future note must not rely on chat memory.

The future note must not rely on unstaged local notes.

The future note must not rely on unreviewed assumptions.

## Required lineage objects

The future note should describe these lineage objects:

### `.002 / STU + DI` v0.1

Role:

- repair predecessor

Required interpretation:

- v0.1 is direct artifact evidence.
- v0.1 is not the accepted clean state.
- v0.1 includes candidate-level segmentationId drift.
- the drift must remain visible.

Required drift string:

- `study.segment,002`

Required boundary:

- v0.1 drift is evidence of repair history.
- v0.1 drift is not a reason to erase `.002`.
- v0.1 drift is not a reason to inflate v0.2.
- v0.1 drift is not candidate-truth evidence.

### `.002 / STU + DI` v0.2

Role:

- reviewed direct evidence

Required interpretation:

- v0.2 is direct artifact evidence.
- v0.2 is later than v0.1 in the repair lineage.
- v0.2 can support direct-artifact-backed status for `.002`.
- v0.2 must not be inflated into clean-parity evidence unless directly inspected fields support that.

Required boundary:

- v0.2 direct evidence is not origin evidence.
- v0.2 direct evidence is not winner evidence.
- v0.2 direct evidence is not candidate-truth evidence.
- v0.2 direct evidence is not publication evidence.

### `.003 / SHTU + DI`

Role:

- stable clean reinforced baseline

Required interpretation:

- `.003` remains the stable clean reinforced baseline.
- `.003` is useful as a comparison baseline.
- `.003` lower null pressure does not prove superiority.
- `.003` clean structure does not prove candidate truth.

Required boundary:

- `.003` is not origin.
- `.003` is not winner.
- `.003` is not language superiority evidence.

### `.004 / S + TU + DI`

Role:

- clean fine-grained hard-case

Required interpretation:

- `.004` remains the clean fine-grained segmentation-traceability-hardened hard-case.
- `.004` higher null pressure and traceability pressure are diagnostic stress.
- `.004` finer granularity does not prove truth.
- `.004` clean structure does not prove candidate truth.

Required boundary:

- `.004` is not origin.
- `.004` is not winner.
- `.004` is not language superiority evidence.

## Required distinction

The future note must distinguish these evidence statuses.

### Report-backed

Definition:

- evidence is described in a report or review but is not directly supported by inspected artifact fields in the current note.

Use rule:

- use only where direct artifact evidence has not been reviewed.

### Direct-artifact-backed

Definition:

- evidence is supported by reviewed direct artifact JSON evidence.

Use rule:

- `.002 / STU + DI` is now direct-artifact-backed after PR #1273.

Boundary:

- direct-artifact-backed does not mean clean.
- direct-artifact-backed does not mean complete.
- direct-artifact-backed does not mean origin.
- direct-artifact-backed does not mean winner.
- direct-artifact-backed does not mean candidate truth.

### Clean-parity

Definition:

- a lane has enough directly inspected clean fields to compare cleanly with other clean lanes.

Use rule:

- do not assign clean-parity status to `.002` unless directly inspected fields support it.

Required wording:

- `.002` is direct-artifact-backed, not clean-parity evidence.

## Required note sections

The future repair lineage note should include these sections:

1. status
2. source chain
3. lineage summary
4. v0.1 repair predecessor
5. v0.1 segmentationId drift
6. v0.2 reviewed direct evidence
7. direct-artifact-backed versus clean-parity
8. relationship to `.003 / SHTU + DI`
9. relationship to `.004 / S + TU + DI`
10. accepted statements
11. rejected statements
12. interpretation boundary
13. next allowed action
14. final decision

## Required accepted statements

The future note should accept:

- `.002 / STU + DI` is now direct-artifact-backed for reviewed evidence.
- `.002` v0.1 is a repair predecessor.
- `.002` v0.1 includes candidate-level `study.segment,002` drift.
- `.002` v0.2 is reviewed direct evidence.
- `.002` is not clean-parity evidence unless directly inspected clean fields support that.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Required rejected statements

The future note must reject:

- `.002` is clean.
- `.002` has clean parity.
- `.002` is origin.
- `.002` is winner.
- `.002` is candidate truth.
- v0.2 erases v0.1 repair history.
- `study.segment,002` should be hidden.
- direct-artifact-backed means clean.
- direct-artifact-backed means historically true.
- `.003` wins because it is cleaner.
- `.004` wins because it is finer.
- `.004` fails because it has higher null pressure.
- any clean lane proves historical truth.

## Required boundary language

The future note must preserve these boundaries:

- no model call
- no rerun
- no artifact JSON creation
- no prompt change
- no validator change
- no source implementation change
- no runtime/API/UI wiring
- no provider default change
- no OpenAI API use
- no publication framing
- no origin claim
- no winner claim
- no candidate-truth claim
- no language superiority claim
- no model-quality claim

## Missing-value discipline

The future note must preserve missing-value discipline.

It must not fill unknown fields with assumptions.

It must not infer clean parity from direct artifact presence.

It must not infer structural cleanliness from matrix convenience.

It must not infer candidate truth from schema cleanliness.

It must not infer historical truth from direct evidence.

## Relationship to future work

The future note may authorize a later docs-only review PR.

It must not authorize:

- model call
- rerun
- new artifact capture
- prompt hardening
- validator hardening
- source implementation change
- provider change
- publication framing

## Proposed next PR after this design lands

After this design PR lands, the next PR should be docs-only:

- `docs(open-instrument): add zheji study002 repair lineage note`

That PR should create the actual repair lineage note.

No model call is authorized in that PR.

No rerun is authorized in that PR.

## Final design decision

The `.002 / STU + DI` repair lineage note should become the controlled documentation layer for explaining `.002` evidence after direct JSON review.

It should preserve v0.1 as repair predecessor.

It should preserve `study.segment,002`.

It should define v0.2 as reviewed direct evidence.

It should keep direct-artifact-backed evidence separate from clean-parity evidence.

It should relate `.002`, `.003`, and `.004` without origin, winner, candidate-truth, language superiority, model-quality, provider-default, or publication claims.
