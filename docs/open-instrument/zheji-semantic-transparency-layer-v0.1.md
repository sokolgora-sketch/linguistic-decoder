# Zheji Semantic Transparency Layer v0.1

## Status
- design-only
- not implemented
- no schema change
- no validator change
- no prompt change
- no runtime change
- no model call
- no artifact replay
- no provider default change
- no changes to existing Zheji UI/path summary code
- Open Instrument development layer only

This is a design layer for embryo morpheme meaning analysis. It is not external origin/truth evidence.

## Purpose
The purpose is to add a future semantic analysis layer inspired by Petro Zheji's internal semantic motivation method.

The layer should help distinguish:

- formal/historical evidence;
- symbolic/functional resonance;
- semantic transparency inside a candidate language;
- cross-language transparency contrast.

This should help ZË-RO inspect whether embryo morpheme candidates are internally explainable, not merely whether they match a historical dictionary chain.

## Existing Zheji lens compatibility
`src/engine/zhejiLens.ts` already contains earlier symbolic/Zheji-style helper logic.
`src/lib/zhejiSummary.ts` is a UI structural overlay.
`src/lib/zhejiSummary.ts` reads from `AnalyzeWordResultUI`.
Existing Zheji summary logic computes vowel path, root polarity, tension path, subject/object/modifier roles, inversion helpers, and snippets.
Existing tests cover UI-facing Zheji summaries and symbolic layer behavior.

Classify existing code as:

UI/path summary and symbolic overlay, not Open Instrument Brain-candidate semantic transparency.

Compatibility decision for v0.1:

- Do not modify existing Zheji code.
- Do not wire Open Instrument to existing Zheji code yet.
- Keep Open Instrument semantic transparency design separate for now.
- Later, the Open Instrument layer may reuse Seven-Voice trait functions or doctrine references from the existing Zheji/trait code.
- Any reuse must be designed explicitly before implementation.

Why:

- Existing Zheji summary operates on word-level/vowel-path UI result.
- New Open Instrument layer operates on candidate-level and chunk-level Brain output.
- These are different layers and should not be merged prematurely.

## What to extract from Zheji
Open Instrument should extract the method, not total claims.

Useful method:

- internal semantic motivation;
- smallest meaningful decomposition;
- literal physical/functional explanation;
- comparison between languages by semantic transparency;
- asking whether one language explains a candidate more atomically than another.

Do not import:

- Albanian automatically wins;
- Albanian is privileged by schema;
- atomic decomposition equals true origin;
- symbolic resonance equals historical proof;
- universal prima-language claims;
- automatic candidateType upgrades.

## Layer boundaries

### Structural layer
Already handled by current Open Instrument:

- Heart-owned segmentation;
- Brain candidate output;
- normalization;
- strict validation.

Question answered:

`Did the candidate object pass the instrument contract?`

### Functional transparency layer
Future Zheji-inspired layer:

- formal vs symbolic evidence;
- semantic transparency:
  - atomic
  - metaphorical
  - opaque
- deterministic cross-language contrast matrix.

Question answered:

`How directly does this candidate explain the embryo morpheme meaning inside its own language?`

### Origin/truth layer
Not handled by this layer.

Question not answered:

`Is this the historical origin of the word?`

This design does not cross into origin proof.

## Proposed candidate-level field: `analysisLayers`
Design this as a future field only. Do not implement now.

Use a lightweight auditable shape:

analysisLayers:
- formal:
  - isPresent: boolean
  - evidenceNote: string | null
- symbolic:
  - isPresent: boolean
  - evidenceNote: string | null

Definitions:

- `formal.isPresent` means documented historical etymology, attested cognates, or established comparative evidence supports this candidate.
- `formal.evidenceNote` gives a short source/reason note, or `null` when not present.
- `symbolic.isPresent` means the candidate aligns with ZË-RO vowel-function doctrine or embryo-morpheme function.
- `symbolic.evidenceNote` gives a short doctrine/function note, or `null` when not present.
- Both formal and symbolic may be true.
- Both may be false.
- Neither automatically changes `candidateType`.

Important guardrail:

If the 7-Voice doctrine matrix required for symbolic evaluation is unavailable or incomplete in the prompt contract, the model must default symbolic evaluation to false or not evaluated. Do not invite poetic symbolic hallucination.

## Proposed candidate-level field: `semanticTransparency`
Design this as a future field only. Do not implement now.

Use a lightweight object shape:

semanticTransparency:
- level: atomic | metaphorical | opaque
- reason: string
- decomposition?: string[]

Definitions:

- `atomic`: candidate meaning is explained as a direct literal, physical, or functional sum of its smallest meaningful parts inside that language; minimal conceptual leap.
- `metaphorical`: candidate has internal roots or structure, but reaching the embryo meaning requires abstraction or conceptual leap.
- `opaque`: candidate exists as a lexical form but has no useful internal structural explanation for the embryo meaning.

Important rule:

Dictionary morphology alone is not enough for `atomic`. Judge the semantic path, not just whether a dictionary gives roots.

Operational constraint:

Do not require long academic explanations. `reason` should be short and auditable. `decomposition` is optional because local models may not reliably identify discrete units for every candidate.

## Computed chunk-level field: `transparencyContrast`
Do not let Brain write this field.

Do not generate natural-language contrast prose in deterministic code.

Define future computed field at chunk/embryo level:

transparencyContrast:
- hasContrast: boolean
- matrix:
  - atomic: string[]
  - metaphorical: string[]
  - opaque: string[]

Where each array contains the candidate languages that fall into that transparency level for the same embryo/chunk.

Rules:

- If candidates for the same embryo have different transparency levels, `hasContrast` is true.
- If all non-null candidates share the same level, `hasContrast` is false.
- The deterministic post-processor only groups candidates by level and language.
- It does not write fluid prose.
- It does not judge historical truth.
- It does not choose a winner.
- It does not modify `candidateType`.
- It does not modify `analysisLayers`.
- It does not modify `semanticTransparency`.

Optional future UI behavior:

The UI may render the matrix into readable text or visual flags for human review.

## CandidateType boundary
State clearly:

- `candidateType` remains evidence/type classification.
- `semanticTransparency.level = atomic` does not upgrade `candidateType`.
- `symbolic.isPresent = true` does not upgrade `candidateType`.
- Albanian atomic transparency does not upgrade `candidateType`.
- Formal evidence may affect `candidateType` only under existing or separately designed rules.
- Zheji transparency is a parallel analysis axis, not a replacement for `candidateType`.

## Null candidate boundary
Define:

- null candidates may receive `analysisLayers` as false/null only if later schema design chooses that.
- null candidates should not receive `semanticTransparency`, because there is no candidate to evaluate.
- null candidates should not be used in the transparency contrast matrix except as absence/null evidence.

## Albanian boundary
State:

- Albanian is a high-value test language for semantic transparency.
- Albanian must not be an automatic winner.
- Albanian must follow the same `candidateType` rules as Latin, Greek, Sanskrit, Germanic, Chinese, and every other language.
- Albanian atomic transparency is evidence to inspect, not proof.
- Other languages may also produce atomic candidates.
- If Albanian is atomic and another language is metaphorical, the system records structured contrast; it does not declare origin.

## Relationship to current study milestone
Connect this design to the completed study lane:

- `.004 / S + TU + DI` is the active hard-case structural path.
- The Zheji layer should be tested first on a structurally stable path.
- The completed `study` lane proves the pipeline can produce structurally clean development evidence.
- The Zheji layer asks a different question: whether the validated candidates show meaningful transparency patterns.
- A future replay may use `.003` as a clean baseline or `.004` as a hard-case transparency test.

## Implementation sequence, future only
Recommend this future sequence, but do not implement now:

### PR A — design-review PR
- review this design;
- decide whether Open Instrument should stay separate from existing Zheji UI lens for v0.1;
- decide whether later schema should reuse any Seven-Voice trait references.

### PR B — schema/types design or schema-only implementation
- add additive fields only;
- no prompt change;
- no validator change;
- no model run.

### PR C — validator checks
- require new fields only after schema decision;
- archived artifacts may fail expected new checks until replayed;
- do not loosen existing checks.

### PR D — Brain prompt contract append
- add analysis layer instructions;
- include an explicit 7-Voice doctrine reference for symbolic evaluation;
- if doctrine reference is absent or incomplete, symbolic must default to false or not evaluated;
- do not rewrite the whole prompt.

### PR E — deterministic transparency contrast helper
- implement matrix-based `detectTransparencyContrast`;
- read-only over candidate list;
- no prose generation;
- never changes `candidateType`.

### PR F — controlled replay
- replay one structurally clean segmentation;
- archive raw + normalized + transparency fields;
- review.

This sequence may be adjusted after design review.

## Non-goals
- no schema implementation in this PR;
- no prompt change in this PR;
- no validator change in this PR;
- no runtime change in this PR;
- no model run in this PR;
- no artifact replay in this PR;
- no language expansion;
- no automatic Albanian preference;
- no origin proof;
- no candidate truth proof;
- no scoring system;
- no changes to existing Zheji UI/path summary code.

## Enrichment, not scoring
This layer is analysis enrichment, not automated grading.

It records:

- formal evidence;
- symbolic resonance;
- semantic transparency;
- transparency contrast matrix.

It does not decide:

- which candidate is true;
- which language wins;
- whether a candidate is historical origin;
- whether a word is proved.

Human review interprets the enriched artifact.

## Recommended next step
Recommend next PR after this design:

`docs/open-instrument: review zheji semantic transparency design`

Reason:

This layer affects schema, prompt, validator, artifacts, UI interpretation, existing Zheji lens compatibility, and human review. It should be reviewed before implementation.

Do not recommend immediate schema implementation from this PR.

## Claim boundary
- development design for embryo morpheme meaning analysis;
- not external origin/truth evidence;
- not candidate truth proof;
- not historical origin proof;
- not reason to change provider default from `mock`;
- not reason to expand language/model scope without another controlled plan.
