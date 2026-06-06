# Study Segmentation 004 Reduced-Language Llama v0.4 Enum Normalizer Replay Review v0.1
Status: review-only.

This document reviews the archived reduced-language `llama3.1:8b` v0.4 Brain output after offline replay through the deterministic enum normalizer merged in PR #1206.
No model call is performed.
No new Brain output is created.
No artifact is modified.
No runtime wiring is added.
No prompt is changed.
No validator is changed.
No provider default is changed.
This is development evidence only.

---

## 1. Source

- PR #1207: `docs(open-instrument): replay llama v0.4 through enum normalizer`
- Merge SHA: `5b77a8b1ed8484f58eb84d277189523408993159`
- Replay artifact: `docs/open-instrument/artifacts/heart-brain-prototype/2026-06-06-study-heart-brain-llama3-1-8b-segmentation-004-reduced-language-v0.4-enum-normalizer-replay-v0.1.json`
- Replay report: `docs/open-instrument/study-segmentation-004-reduced-language-llama-v0.4-enum-normalizer-replay-v0.1.md`

Replay target:

- word: `study`
- segmentation: `study.segmentation.004`
- chunks: `S + TU + DI`
- model: `llama3.1:8b`
- provider: `openai_compat`
- reduced languages: Albanian, Latin, Chinese, Germanic

The replay used the archived v0.4 Brain output only.
It did not call a model.

---

## 2. Replay result

Recorded replay result:

- raw validation issue count: `36`
- normalized validation issue count: `36`
- repairs: `0`
- unresolved enum audits: `18`
- remaining issue families:
  - `INVALID_CANDIDATE_TYPE`
  - `INVALID_EVIDENCE_TYPE`
  - `INVALID_FALSE_FRIEND_RISK`
  - `INVALID_NULL_CANDIDATE`

Interpretation:

- the enum normalizer stayed conservative
- the raw Brain output was preserved
- no unsafe repair was fabricated
- strict validation was not weakened
- the replay did not turn the artifact into a pass

---

## 3. What the replay proves

The replay proves the following:

- the enum normalizer is conservative
- it did not fabricate repairs
- it did not convert unsafe values
- it did not make the artifact pass by weakening validation
- the v0.4 issue is not solved by simple alias, casing, or spacing normalization

This is the useful boundary of the replay.

---

## 4. What the replay does not prove

The replay does not prove:

- the llama output is useless
- the embryo morpheme method failed
- candidate meanings are false
- local models are bad
- the validator should be loosened
- a new model rerun is justified yet

The replay is narrower than those claims.

---

## 5. Failure classification

Failure classification:

`candidate-shape drift unresolved after enum-only normalization`

Why:

- the helper only targets safe scalar enum normalization
- the replay produced `0` repairs
- the replay produced `18` unresolved enum audits
- the unresolved values are outside the helper's current safe repair class

So the failure is narrower than the original structural drift, but it is not solved.

---

## 6. Audit classification

The replay artifact's unresolved audit entries were classified by original value shape.

| Shape | Count |
| --- | ---: |
| missing field | 0 |
| null | 0 |
| string unknown | 0 |
| array | 0 |
| object | 18 |
| number/boolean | 0 |
| other | 0 |

Observed unresolved values:

- `candidateType` objects such as `{ "type": "null_candidate" }`
- `evidenceType` objects such as `{ "type": "none" }`
- `falseFriendRisk` objects such as `{ "type": "none" }`

What can be determined:

- all unresolved enum values were object-shaped
- all were rejected as `non_scalar_value`
- the helper could not safely map them to canonical scalar enums

What cannot be determined from the replay alone:

- whether the object shape is intentional schema drift or a model formatting error
- whether a broader repair pass should normalize objects into scalar enums
- whether the upstream prompt should stop asking for object-shaped enum wrappers

---

## 7. Conclusion

The replay shows that PR #1206 did the correct conservative thing: it preserved the raw artifact, normalized only what was safe, and left the unsafe enum drift unresolved.

That means the current blocker is not alias normalization.
The remaining problem is candidate-shape drift beyond the helper's safe scalar enum class.

The next step should be a separate decision about whether to widen post-parse repair for object-shaped enum wrappers, or to contract the upstream Brain schema so these wrapper objects are no longer produced.
