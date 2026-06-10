# Zheji Study002 Repair Lineage Note v0.1

## Status

Type: documentation note

This note documents the repair lineage for Zheji `study.segmentation.002 / STU + DI`.

No model call is made.

No rerun is made.

No artifact JSON is created.

No prompt, validator, source implementation, runtime, API, UI, provider, or schema behavior is changed.

## Source chain

This note follows the accepted repair lineage design:

- `docs/open-instrument/zheji-study002-repair-lineage-note-design-v0.1.md`

It uses only repo-backed source evidence:

- `docs/open-instrument/study-segmentation-002-zheji-direct-json-evidence-review-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.2.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.2-review-v0.1.md`
- `docs/open-instrument/zheji-next-controlled-segmentation-decision-review-v0.1.md`

Direct `.002` artifacts in the lineage:

- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.1.json`
- `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-04-study-heart-brain-qwen3-8b-segmentation-002-v0.2.json`

## Lineage summary

The `.002 / STU + DI` lane now has direct artifact evidence.

It is no longer merely report-backed.

However, direct artifact evidence does not automatically mean clean parity.

The accepted state is:

- `.002 / STU + DI` is direct-artifact-backed for reviewed evidence.
- `.002` v0.1 is a repair predecessor.
- `.002` v0.1 includes candidate-level segmentationId drift: `study.segment,002`.
- `.002` v0.2 is reviewed direct evidence.
- `.002` v0.2 is not promoted to clean parity.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- clean structure remains schema/traceability evidence, not candidate-truth evidence.

## `.002 / STU + DI` v0.1

Role:

- repair predecessor

Evidence status:

- direct artifact evidence
- not the accepted clean state
- repair-history evidence

Known issue:

- candidate-level segmentationId drift is present

Required drift string:

- `study.segment,002`

Interpretation:

The v0.1 artifact is useful because it preserves the repair history of the `.002 / STU + DI` lane.

It shows that the lane existed in direct artifact form before the later v0.2 evidence.

It also preserves a concrete candidate-level segmentationId defect.

That defect must not be hidden.

The defect must not be used to erase the `.002` lane.

The defect must not be used to inflate v0.2 into clean parity.

Boundary:

- v0.1 is not clean evidence.
- v0.1 is not clean-parity evidence.
- v0.1 is not origin evidence.
- v0.1 is not winner evidence.
- v0.1 is not candidate-truth evidence.
- v0.1 is not publication evidence.

## `.002 / STU + DI` v0.2

Role:

- reviewed direct evidence

Evidence status:

- direct artifact evidence
- later repair-lineage evidence
- reviewed direct evidence

Interpretation:

The v0.2 artifact supports direct-artifact-backed status for `.002 / STU + DI`.

That is a meaningful upgrade from report-backed status.

However, v0.2 is not promoted to clean parity by this note.

The correct reading is conservative:

- v0.2 is direct evidence.
- v0.2 is reviewed evidence.
- v0.2 supports `.002` as direct-artifact-backed.
- v0.2 does not erase v0.1 repair history.
- v0.2 does not convert `.002` into origin, winner, or candidate-truth evidence.

Boundary:

- v0.2 direct evidence is not origin evidence.
- v0.2 direct evidence is not winner evidence.
- v0.2 direct evidence is not candidate-truth evidence.
- v0.2 direct evidence is not publication evidence.
- v0.2 direct evidence is not provider-quality evidence.
- v0.2 direct evidence is not automatic clean parity.

## Direct-artifact-backed versus clean parity

### Direct-artifact-backed

Definition:

- a lane has reviewed direct artifact evidence.

Current `.002` status:

- direct-artifact-backed

Reason:

- direct `.002` v0.1 and v0.2 artifacts exist
- direct `.002` artifacts have been reviewed
- `.002` is now represented by direct evidence, not only by report description

Boundary:

- direct-artifact-backed does not mean clean
- direct-artifact-backed does not mean complete
- direct-artifact-backed does not mean origin
- direct-artifact-backed does not mean winner
- direct-artifact-backed does not mean candidate truth
- direct-artifact-backed does not mean publication-ready

### Clean parity

Definition:

- a lane has enough directly inspected clean fields to compare cleanly with other clean lanes.

Current `.002` status:

- not clean-parity evidence

Reason:

- v0.1 is a repair predecessor with visible candidate-level drift
- v0.2 is reviewed direct evidence but is not inflated into clean parity
- the current evidence chain intentionally preserves this distinction

Required statement:

`.002 / STU + DI` is direct-artifact-backed, not clean-parity evidence.

## Relationship to `.003 / SHTU + DI`

Role:

- stable clean reinforced baseline

Interpretation:

`.003 / SHTU + DI` remains the stable clean reinforced baseline.

It remains useful as the clean comparison lane against which `.002` and `.004` can be discussed.

Its cleaner status does not make it origin.

Its lower null pressure does not make it winner.

Its larger `SHTU` chunk does not make it candidate truth.

Boundary:

- `.003` is not origin evidence.
- `.003` is not winner evidence.
- `.003` is not candidate-truth evidence.
- `.003` is not language superiority evidence.

## Relationship to `.004 / S + TU + DI`

Role:

- clean fine-grained hard-case

Interpretation:

`.004 / S + TU + DI` remains the clean fine-grained segmentation-traceability-hardened hard-case.

It isolates smaller units than `.003`.

That increases traceability pressure and null pressure.

Higher pressure is diagnostic stress.

Higher pressure is not automatic failure.

Finer granularity is not automatic truth.

Boundary:

- `.004` is not origin evidence.
- `.004` is not winner evidence.
- `.004` is not candidate-truth evidence.
- `.004` is not language superiority evidence.

## Accepted statements

This note accepts:

- `.002 / STU + DI` is direct-artifact-backed for reviewed evidence.
- `.002` v0.1 is a repair predecessor.
- `.002` v0.1 includes candidate-level `study.segment,002` drift.
- `study.segment,002` must remain visible.
- `.002` v0.2 is reviewed direct evidence.
- `.002` v0.2 does not erase v0.1 repair history.
- `.002` is not clean-parity evidence.
- `.003 / SHTU + DI` remains the stable clean reinforced baseline.
- `.004 / S + TU + DI` remains the clean fine-grained hard-case.
- clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Rejected statements

This note rejects:

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

## Interpretation boundary

This note preserves the Open Instrument meaning/function motivation boundary.

It does not claim origin.

It does not claim etymology.

It does not claim a winning segmentation.

It does not claim candidate truth.

It does not claim language superiority.

It does not claim model quality.

It does not change provider default.

It does not create publication framing.

It does not authorize a model call.

It does not authorize a rerun.

It does not authorize artifact creation.

It does not authorize prompt, validator, source, runtime, API, or UI changes.

## Missing-value discipline

This note does not fill unknown fields with assumptions.

It does not infer clean parity from direct artifact presence.

It does not infer structural cleanliness from matrix convenience.

It does not infer candidate truth from schema cleanliness.

It does not infer historical truth from direct evidence.

## Final decision

The `.002 / STU + DI` repair lineage is accepted as direct-artifact-backed documentation evidence.

The `.002` v0.1 artifact remains a repair predecessor.

The candidate-level `study.segment,002` drift remains visible.

The `.002` v0.2 artifact is reviewed direct evidence.

The `.002` lane is not promoted to clean parity.

The `.003 / SHTU + DI` lane remains the stable clean reinforced baseline.

The `.004 / S + TU + DI` lane remains the clean fine-grained hard-case.

Clean structure remains schema/traceability evidence, not candidate-truth evidence.

## Next required step

After this note lands, create a docs-only review PR:

- `docs(open-instrument): review zheji study002 repair lineage note`

No model call is authorized before that review lands.

No rerun is authorized before that review lands.
