# Brain Candidate Enum Object-Shape Repair Policy v0.1
Status: design-only.
This policy is not implemented.
It makes no runtime behavior change.
It requires no model call.
It requires no artifact replay.
It makes no validator change.
It makes no prompt change.
It is for Open Instrument local-provider development only.

## Problem Statement
PR #1207 replayed the archived `llama3.1:8b` v0.4 artifact through the enum normalizer.
PR #1208 reviewed that replay.
Normalization made 0 repairs.
Validation issue count stayed at 36.
All 18 unresolved enum audits were object-shaped.
The active blocker is therefore object-shaped enum drift, not simple scalar enum alias drift.

More prompt prose is the wrong next move here.
The prompt is already large enough that more prose risks increasing local-model brittleness.
The next safe step is deterministic post-parse object-shape enum normalization design.

## Source Evidence
- PR #1207 replay artifact:
  - `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-06-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4-enum-normalizer-replay-v0.1.json`
- PR #1207 replay report:
  - `docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.4-enum-normalizer-replay-v0.1.md`
- PR #1208 review doc:
  - `docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.4-enum-normalizer-replay-review-v0.1.md`

Target context:
- word: `study`
- segmentation: `study.segmentation.004`
- chunks: `S + TU + DI`
- model: `llama3.1:8b`
- provider: `openai_compat`
- reduced languages: `Albanian`, `Latin`, `Chinese`, `Germanic`

Audit classification from the replay review:
- missing field: `0`
- null: `0`
- string unknown: `0`
- array: `0`
- object: `18`
- number/boolean: `0`
- other: `0`

Object key-shape counts from the inspection script:
- `type: 18`

Field counts for those 18 object-shaped unresolved enum audits:
- `candidateType: 6`
- `evidenceType: 6`
- `falseFriendRisk: 6`

Observed sample wrapper values:
- `{"type":"null_candidate"}`
- `{"type":"none"}`

## Core Decision
Object-shaped enum repair may be allowed only when all of the following are true:
- the target field is one of `candidateType`, `evidenceType`, or `falseFriendRisk`
- the object has an approved wrapper shape
- the wrapper contains exactly one scalar string candidate enum value
- that scalar string can be normalized by the existing scalar enum rules
- no other object fields are used as semantic evidence
- raw Brain output remains untouched
- normalized output remains separate
- the audit trail records the extraction
- unresolved or ambiguous objects remain failures

The current replay evidence only justifies the `{"type":"..."}` wrapper shape.
Other wrapper shapes remain contingent and must not be assumed safe without explicit follow-up evidence and rule approval.

## Allowed Repair Class
Allowed object-shape repair is narrow and deterministic.
The approved repair pattern is:
- plain object only
- exactly one approved scalar enum carrier key
- extracted value must be a string
- extracted string must map to a canonical enum by the existing scalar rules
- no multi-value extraction
- no confidence inference
- no meaning inference

Current rule-id coverage should be explicit, not implicit.
The only currently justified rule id from the replay evidence is:
- `object_type_scalar_enum_wrapper`

Possible follow-up rule ids may be considered later only if future evidence proves they are safe:
- `object_value_scalar_enum_wrapper`
- `object_label_scalar_enum_wrapper`
- `object_enum_scalar_enum_wrapper`

Those follow-up ids are not approved by this policy unless a later helper proposal explicitly whitelists them.

## Forbidden Repair Class
The following are forbidden:
- empty object
- object with no approved carrier key
- object with multiple candidate carrier keys
- object where the carrier value is array, object, null, number, or boolean
- object requiring semantic interpretation
- object containing explanation text but no enum value
- object containing multiple possible enum values
- object where the extracted string is unknown after scalar normalization
- object repair for non-enum fields
- creating missing fields
- deleting candidates to force validation pass
- changing candidate meaning
- changing language
- changing chunk
- changing segmentation
- inventing `sourceNote`
- inventing null-candidate explanation
- evidence fabrication
- confidence inflation
- validator loosening

## Raw and Normalized Output Rule
Raw Brain output must remain exact and untouched.
Object-shape repair can only create a separate normalized output.
Replay artifacts must keep both raw and normalized values.
Every object repair must have an audit trail.

## Audit Trail
Every object-shaped enum inspection should emit an audit entry with:
- path
- field
- originalValue
- extractedValue, if any
- normalizedValue, if any
- objectShape
- carrierKey, if any
- mappingRuleId
- status
- reason

Statuses should distinguish:
- repaired
- unchanged
- unresolved

Object-shaped raw values should not be treated as unchanged by this policy.
They are either repaired into scalar canonical enums or left unresolved.

## Validator Relationship
The validator remains strict.
The validator does not accept object-shaped enum values.
Repair happens before validation on a separate normalized object.
Unresolved object-shaped enum values must still fail validation.
No validator loosening is allowed.
Normalization cannot turn missing required fields into invented data.
Normalization cannot fabricate semantic content.

## Decision Boundary for Future Helper Expansion
Future helper expansion may implement object-shape repair only if the observed object key-shapes are simple wrappers.
If the object shapes require interpretation of semantic objects, the helper must not repair them.

## Implementation Sequence
Required sequence:
1. design this object-shape repair policy
2. implement helper expansion with guard tests
3. replay the archived v0.4 artifact again through the expanded helper
4. review the replay result
5. only after review consider another controlled llama retry

## Comparison with Alternatives
Prompt-only tightening is not preferred.
Schema example compression is not preferred.
Deterministic enum normalization is preferred.

Reason:
PR #1208 shows the current failure is object-shaped drift, and the v0.4 prompt is already large enough that adding more prose is more likely to increase brittleness than to fix the drift.

## Claim Boundary
This is development-only.
It is an object-shape repair policy only.
It is not a new model run.
It is not origin proof.
It is not candidate truth proof.
It is not publication evidence.
It is not eval evidence.
It is not Cohort evidence.
It is not model-quality evidence.
It is not a reason to change the default provider from `mock`.

## Non-Goals
No rerun.
No artifact.
No model invocation.
No implementation.
No prompt change.
No validator loosening.
No default-provider change.
No language expansion.
