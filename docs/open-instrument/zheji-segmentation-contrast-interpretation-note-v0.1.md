# Zheji Segmentation Contrast Interpretation Note v0.1

## Status

Type: interpretation note

This note interprets the accepted Zheji study segmentation contrast matrix.

No model call is made.

No rerun is made.

No artifact is created.

No source, runtime, API, UI, prompt, validator, provider, or schema behavior is changed.

## Source evidence

This note interprets these existing repository documents:

- `docs/open-instrument/zheji-segmentation-contrast-interpretation-note-design-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-v0.1.md`
- `docs/open-instrument/zheji-study-segmentation-contrast-matrix-review-v0.1.md`

The interpreted matrix compares:

- `study.segmentation.002 / STU + DI`
- `study.segmentation.003 / SHTU + DI`
- `study.segmentation.004 / S + TU + DI`

This note uses existing archived evidence only.

It does not rely on chat memory.

It does not invent missing values.

It does not backfill absent JSON summaries.

## Interpretation boundary

This is a structural and traceability interpretation.

This is not an etymology result.

This is not an origin result.

This is not a winner result.

This is not candidate-truth evidence.

This is not model-quality proof.

This is not publication framing.

Clean structure remains schema/traceability evidence only.

A clean run means the output survived the current contract.

A clean run does not mean the candidate is true.

A clean run does not mean the segmentation is historically primary.

A clean run does not mean the model is generally reliable.

## Evidence status summary

The current inspected evidence supports this bounded status:

| Lane | Segmentation | Evidence status |
|---|---|---|
| `study.segmentation.002` | `STU + DI` | report-backed in current inspected evidence |
| `study.segmentation.003` | `SHTU + DI` | direct clean reinforced matrix evidence |
| `study.segmentation.004` | `S + TU + DI` | direct clean segmentation-traceability-hardened matrix evidence |

The `.002 / STU + DI` lane remains useful as a historical comparison point.

The `.002 / STU + DI` lane is less directly comparable than `.003` and `.004` until a directly summarized `.002` JSON artifact is surfaced.

The `.003 / SHTU + DI` lane remains the stable clean reinforced baseline.

The `.004 / S + TU + DI` lane remains the clean fine-grained hard-case.

## Segmentation lane interpretation

### `study.segmentation.002 / STU + DI`

Allowed interpretation:

- `.002 / STU + DI` is a useful historical comparison point.
- `.002 / STU + DI` is an earlier spelling-close segmentation.
- `.002 / STU + DI` is report-backed in the current inspected evidence set.
- `.002 / STU + DI` should not be inflated into directly comparable JSON-summary-backed evidence unless the directly summarized JSON evidence is surfaced.

Forbidden interpretation:

- `.002 / STU + DI` is not the origin.
- `.002 / STU + DI` is not the winner.
- `.002 / STU + DI` is not truer than the other lanes.
- `.002 / STU + DI` is not rejected by this matrix.
- `.002 / STU + DI` does not prove or disprove Open Instrument.

### `study.segmentation.003 / SHTU + DI`

Allowed interpretation:

- `.003 / SHTU + DI` is the stable clean reinforced baseline.
- `.003 / SHTU + DI` uses a larger first chunk than `.004`.
- `.003 / SHTU + DI` has lower granularity pressure than `.004`.
- `.003 / SHTU + DI` has lower null pressure than `.004`.
- `.003 / SHTU + DI` is useful as a clean baseline for later contrast work.

Forbidden interpretation:

- `.003 / SHTU + DI` is not the origin.
- `.003 / SHTU + DI` is not the winning segmentation.
- `.003 / SHTU + DI` is not candidate truth.
- Lower null pressure does not mean superiority.
- Clean structure does not mean historical proof.

### `study.segmentation.004 / S + TU + DI`

Allowed interpretation:

- `.004 / S + TU + DI` is the clean fine-grained hard-case.
- `.004 / S + TU + DI` isolates smaller embryo units than `.003`.
- `.004 / S + TU + DI` creates higher granularity pressure than `.003`.
- `.004 / S + TU + DI` creates higher null pressure than `.003`.
- `.004 / S + TU + DI` creates higher traceability pressure than `.003`.
- `.004 / S + TU + DI` is useful for stress-testing smaller-unit segmentation behavior.

Forbidden interpretation:

- `.004 / S + TU + DI` is not the origin.
- `.004 / S + TU + DI` is not the winner.
- `.004 / S + TU + DI` is not candidate truth.
- Finer granularity does not mean truth.
- Higher null pressure does not mean failure.
- Clean structure does not mean publication-ready proof.

## Null-pressure interpretation

Null pressure means the segmentation creates more places where honest absence or unresolved support can appear.

Null pressure is not automatic failure.

Higher null pressure can be expected when segmentation is finer.

The matrix supports this interpretation:

- `.004 / S + TU + DI` creates more null pressure than `.003 / SHTU + DI`.
- The higher null pressure is expected because `.004` splits `SHTU` into `S + TU`.
- More null pressure means more diagnostic stress.
- More null pressure does not mean the lane is worse.
- Less null pressure does not mean the lane is better.
- Null candidates are not automatic failures when they are honest and structurally valid.

## Traceability interpretation

Traceability means the output preserves candidate-level relation to the Heart-approved segmentation.

The matrix supports this interpretation:

- `.004 / S + TU + DI` creates higher traceability pressure than `.003 / SHTU + DI`.
- Clean `.004` traceability matters because earlier `.004` runs exposed candidate-level segmentation traceability failure.
- The segmentation-traceability-hardened `.004` result shows the hardened prompt/schema contract survived.
- Clean traceability is schema/traceability evidence.
- Clean traceability is not candidate-truth evidence.

## Granularity interpretation

Granularity means how finely the target word is split into embryo units.

The matrix supports this interpretation:

- `.003 / SHTU + DI` is less granular.
- `.004 / S + TU + DI` is more granular.
- Finer granularity can expose weaknesses hidden by coarser segmentation.
- Finer granularity is useful as a stress test.
- Finer granularity is not automatically more true.
- Coarser granularity is not automatically less useful.
- Granularity should be read as diagnostic pressure, not as truth ranking.

## Missing-value discipline

The matrix and this note preserve missing-value discipline.

Allowed missing-value phrase:

- `not available in inspected evidence`

Required discipline:

- Do not backfill from chat memory.
- Do not invent missing values.
- Do not infer missing JSON fields.
- Do not convert report-backed evidence into JSON-summary-backed evidence.
- Do not silently normalize evidence classes.
- Do not treat absent evidence as negative evidence unless the source explicitly says so.

For `.002 / STU + DI`, the current interpretation remains:

- useful historical comparison point
- report-backed in the current inspected evidence set
- less directly comparable than `.003` and `.004` until directly summarized JSON evidence is surfaced

## Allowed conclusions

This note allows these conclusions:

- `.003 / SHTU + DI` is currently the stable clean reinforced baseline.
- `.004 / S + TU + DI` is currently the clean fine-grained hard-case.
- `.004 / S + TU + DI` creates more null pressure than `.003 / SHTU + DI`.
- `.004 / S + TU + DI` creates more traceability pressure than `.003 / SHTU + DI`.
- `.004 / S + TU + DI` cleanly survives the hardened prompt/schema contract.
- `.002 / STU + DI` remains useful historically but report-backed in the current inspected evidence set.
- The contrast matrix is useful for documentation comparison and future planning.
- Clean structure is schema/traceability evidence.
- Clean structure is not candidate-truth evidence.

## Forbidden conclusions

This note forbids these conclusions:

- origin claim
- historical proof claim
- winner claim
- candidate-truth claim
- language superiority claim
- model-quality proof
- provider default change
- publication framing
- new model call authorization
- rerun authorization

This note also forbids these conversions:

- clean run to truth
- low null pressure to superiority
- high null pressure to failure
- fine segmentation to origin
- stable baseline to winner
- report-backed evidence to direct JSON-summary-backed evidence

## Next allowed action

After this note lands, create a docs-only review PR:

`docs(open-instrument): review zheji segmentation contrast interpretation note`

No model call is allowed before that review lands.

No rerun is allowed before that review lands.

No publication framing is allowed by this note.

## Final interpretation

The Zheji study segmentation contrast matrix is a disciplined structural comparison tool.

It supports bounded interpretation of structural behavior, traceability behavior, null pressure, granularity pressure, and evidence status.

It does not support origin claims.

It does not support winner claims.

It does not support candidate-truth claims.

It does not support language superiority claims.

It does not support model-quality proof.

The current bounded reading is:

- `.003 / SHTU + DI` is the stable clean reinforced baseline.
- `.004 / S + TU + DI` is the clean fine-grained hard-case.
- `.004` creates higher null pressure and traceability pressure than `.003`.
- `.002 / STU + DI` remains useful historically but report-backed in the current inspected evidence set.
- Clean structure remains schema/traceability evidence, not candidate-truth evidence.
