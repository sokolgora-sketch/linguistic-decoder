# Open Instrument Zheji Semantic Transparency Layer Review v0.1
Status: review only.

## Review verdict

Accepted as design direction; implementation must remain staged and additive.

This review accepts PR #1219 as the correct Open Instrument direction, but only as a design boundary. It does not authorize runtime wiring, schema changes, or any attempt to collapse the new layer into the existing Zheji UI/path helpers.

## Compatibility review

The existing Zheji code in `src/engine/zhejiLens.ts` and `src/lib/zhejiSummary.ts` is a deterministic UI/path summary and symbolic overlay layer. It is already focused on the present `AnalyzeWordResultUI` shape, vowel-path reasoning, polarity, tension, subject/object/modifier role helpers, and inversion helpers.

The new Open Instrument semantic transparency layer should stay separate for v0.1. It should be treated as candidate-level analysis enrichment, not as a replacement for the current Zheji lens or summary behavior.

The reuse decision for now is:
- reuse directly: no
- wrap or adapt later: possible, but only after a separate schema design
- keep separate for now: yes

Later Seven-Voice reuse may be practical, but only if it is designed explicitly before implementation. This review does not assume that Seven-Voice traits can be imported or mapped without another review.

## Field-shape review

The proposed future fields are directionally sound and should remain additive.

### `analysisLayers`

This should remain a candidate-level structure with distinct sublayers. The proposed separation between `formal` and `symbolic` is sensible because it prevents one overlay from mutating the other.

The review accepts the current shape direction:
- `formal.isPresent`
- `formal.evidenceNote`
- `symbolic.isPresent`
- `symbolic.evidenceNote`

The layer must not mutate `candidateType`.
If the Seven-Voice doctrine matrix is incomplete or unavailable, `symbolic` should default to false or not evaluated rather than inferred from prose.

### `semanticTransparency`

The proposed future shape is acceptable as an analysis output, not as a claim of truth.

The candidate-level fields remain reasonable:
- `level: atomic | metaphorical | opaque`
- `reason: string`
- `decomposition?: string[]`

The review accepts the rule that dictionary morphology alone is not enough to mark a candidate atomic.

### `transparencyContrast`

The proposed contrast field is useful if it remains computed and descriptive.

It should stay at the chunk or embryo level and remain a matrix of:
- atomic strings
- metaphorical strings
- opaque strings

It must not generate prose, select winners, or mutate `candidateType`.

## Pipeline review

The intended pipeline reads correctly if it stays staged:
1. Heart captures the raw candidate and evidence.
2. Brain validation remains strict.
3. Open Instrument semantic transparency adds analysis only.
4. Review docs capture the design boundary.
5. A later schema PR can introduce explicit fields.

This review does not support runtime wiring in the same PR as the design direction.

## Risks and constraints

The main risks are:
- overloading the new layer so it looks like a truth claim
- collapsing semantic transparency into the existing UI/path overlay too early
- mutating `candidateType` to force the new analysis to fit
- treating Seven-Voice reuse as automatic instead of designed
- using the layer as origin evidence instead of design enrichment

The constraints remain:
- docs-only review
- no source changes
- no runtime wiring
- no schema changes
- no prompt changes
- no validator changes
- no artifacts
- no model calls

## Implementation readiness

The design is ready for the next schema-focused step, but not ready for direct runtime integration.

Readiness conditions for the next PR:
- keep the layer additive
- define schema additions explicitly
- preserve the current Zheji lens and summary code as-is
- keep the Open Instrument layer separate unless a later design explicitly merges them

## Recommended next PR

`docs/open-instrument: design zheji transparency schema additions`

That next step should define the schema fields required to carry the semantic transparency layer without changing the current runtime behavior.

## Claim boundary

Development design only.

Not:
- scientific evidence
- publication evidence
- eval evidence
- Cohort evidence
- origin proof
- a general model-quality proof
- a reason to change source/runtime/provider behavior

## Completion definition

This review is complete when:
- the verdict is explicit
- the compatibility decision is explicit
- the field-shape review is explicit
- the pipeline review is explicit
- the risks and constraints are explicit
- the implementation readiness boundary is explicit
- the recommended next PR is explicit
- the claim boundary is explicit
- no source/runtime/schema/prompt/validator/model changes are made
