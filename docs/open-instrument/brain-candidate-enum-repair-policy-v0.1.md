# Brain Candidate Enum Repair Policy v0.1

Status: design-only.

This document is not implemented.
It makes no runtime behavior change.
It performs no model call.
It performs no artifact replay.
It makes no validator change.
It is for Open Instrument local-provider development only.

It is not origin proof, not candidate truth proof, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, and not a reason to change the default provider from `mock`.

---

## 1. Problem statement

PR #1203 showed that reduced-language `llama3.1:8b` v0.4 can produce parseable Brain output with corrected top-level metadata.

The remaining blocker is candidate-shape / enum drift:

- `INVALID_CANDIDATE_TYPE`
- `INVALID_EVIDENCE_TYPE`
- `INVALID_FALSE_FRIEND_RISK`
- `INVALID_NULL_CANDIDATE`

More prompt prose is a poor next move here. The v0.4 failure pattern suggests the prompt is already large enough to be brittle for the local llama path. The next safe step is deterministic post-parse enum normalization design.

---

## 2. Scope

Allowed scope:

- enum alias normalization only
- scalar enum value repair only
- casing normalization when it maps to an already allowed enum
- spacing normalization when it maps to an already allowed enum
- hyphen normalization when it maps to an already allowed enum
- underscore normalization when it maps to an already allowed enum
- explicit whitelist mappings only
- raw Brain output must remain untouched
- normalized object must be stored separately
- validator must run after normalization
- unresolved values remain failures

Forbidden scope:

- no semantic repair
- no candidate creation
- no deleting candidates to force pass
- no invented source notes
- no invented null-candidate explanations
- no confidence inflation
- no language changes
- no chunk changes
- no segmentation changes
- no candidate meaning changes
- no evidence fabrication
- no validator loosening
- no provider default change

This policy is about structural repair discipline only.

---

## 3. Raw output preservation

The raw Brain output must remain exact and auditable.

Use a two-object model:

- `rawBrainOutput`: exact model output, unchanged
- `normalizedBrainOutput`: deterministic post-parse object used for validation

Both objects must remain available for replay, inspection, and archive review.

Any archive or replay artifact must keep the raw output intact.

Normalization is a derived layer only.
It does not rewrite the model record.

---

## 4. Safe repair class

The only safe repair class is deterministic enum normalization for known enum fields.

Rules:

- only known enum fields may be normalized
- only known allowed values may be produced
- only approved alias-table mappings may be applied
- normalization must be deterministic
- no fuzzy inference
- no semantic interpretation
- no guesswork from nearby prose

Current Brain enum fields in scope, as defined by the active validator/schema:

- `candidateType`
- `evidenceType`
- `falseFriendRisk`

Current canonical values in the active schema/validator include:

- `candidateType`: `strong_living_match`, `historical_match`, `functional_resonance`, `phonetic_resonance`, `weak_resonance`, `likely_false_friend`, `null_candidate`
- `evidenceType`: `living_lexical`, `historical_etymology`, `dictionary_attested`, `phonetic_only`, `semantic_only`, `doctrine_alignment`, `none`
- `falseFriendRisk`: `none`, `low`, `medium`, `high`

The normalizer may map only when the output value already corresponds to one of those exact canonical values.

Examples of possible alias classes, subject to whitelist approval only:

- `weak resonance` → `weak_resonance`, if and only if `weak_resonance` is already a canonical value for the target field
- `weak_resonance` → `weak_resonance`, if and only if the field already allows that exact canonical value
- `false friend risk` → only a canonical value if a current canonical value exists for that exact meaning in the target field
- `false_friend_risk` → only a canonical value if a current canonical value exists for the target field

If there is no exact canonical destination, leave the field unresolved.

---

## 5. Audit trail

Every attempted normalization must emit an audit entry.

Required audit fields:

- `path`
- `field`
- `originalValue`
- `normalizedValue`
- `mappingRuleId`
- `status`
- `reason`

Required statuses:

- `repaired`
- `unchanged`
- `unresolved`

Audit rules:

- `repaired` means a deterministic whitelist mapping changed the scalar enum value to a canonical allowed value
- `unchanged` means the field was already canonical and passed through untouched
- `unresolved` means the field could not be safely normalized and must remain a validation failure

Audit entries must be kept alongside the normalized object so the repair decision is reviewable.

---

## 6. Validator relationship

The validator remains strict.

Normalization does not loosen validation.
Normalization does not change the validator contract.
Normalization runs before validation only as a deterministic pre-step.

Rules:

- validator is not loosened
- validator runs after normalization
- unresolved enum values remain validation failures
- normalization cannot turn missing required fields into invented data
- normalization cannot fabricate semantic content
- normalization cannot fabricate candidates
- normalization cannot fabricate evidence

Any field not safely normalized must still fail under the strict validator.

---

## 7. Problem boundary

This policy is not a general cleanup pass.

It does not allow:

- semantic repair
- candidate rewriting
- evidence rewriting
- source-note invention
- null-candidate invention
- language invention
- chunk invention
- segmentation invention

The policy only repairs the shape of scalar enum values when the canonical target is already known.

---

## 8. Implementation sequence

Required sequence:

1. design policy doc
2. implement enum repair helper
3. add guard tests
4. offline replay archived v0.4 artifact through normalizer only
5. archive replay result as replay/development evidence only
6. review replay result
7. only then consider another controlled llama retry

The replay step is for development evidence only.
It is not a model run.
It does not change the artifact archive.
It preserves raw Brain output.

---

## 9. Comparison with alternatives

Considered options:

- prompt-only tightening
- schema example compression
- deterministic enum normalizer

Decision:

Deterministic enum normalization is preferred over more prompt bloat, because v0.4 suggests the prompt is becoming too large and brittle for local llama.

Prompt tightening may still remain useful later, but it is not the safest first move for this failure mode.

---

## 10. Explicit non-goals

This policy explicitly does not do the following:

- no rerun
- no artifact
- no model invocation
- no implementation
- no validator loosening
- no default-provider change
- no language expansion

It also does not:

- normalize anything by semantic guess
- normalize missing fields into invented values
- normalize candidate content outside enum scalars
- normalize away unresolved failures

---

## 11. Claim boundary

This is development-only.

It is not:

- origin proof
- candidate truth proof
- publication evidence
- eval evidence
- Cohort evidence
- model-quality evidence
- reason to change default provider from `mock`

It governs structural enum repair discipline only.

---

## 12. Completion definition

This policy is complete when:

- enum alias normalization is explicitly limited to scalar enum fields
- raw output preservation is explicit
- normalized output separation is explicit
- audit trail requirements are explicit
- validator strictness after normalization is explicit
- forbidden semantic repair classes are explicit
- implementation sequence is explicit
- comparison with prompt-only tightening is explicit
- the design remains separate from runtime behavior changes
