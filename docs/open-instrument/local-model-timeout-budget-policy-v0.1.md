# Open Instrument Local Model Timeout Budget Policy v0.1

Date: 2026-06-05

Status: development policy only.

This document defines the timeout budget policy for local Open Instrument model captures.

It is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not model-quality evidence, and not a change to the default provider contract.

---

## 1. Purpose

The purpose is to keep local model captures bounded, auditable, and comparable.

The policy prevents indefinite reruns, arbitrary timeout extension, and confusion between operational capture failures and output-quality failures.

---

## 2. Context

Recent local Open Instrument sequence:

- `study.segmentation.004` v0.2 Qwen3 8B capture timed out twice.
- Attempt 1 timeout: `120000 ms`.
- Attempt 2 timeout: `600000 ms`.
- No Brain output existed.
- No validation result existed.
- PR #1181 archived this as a model-capture failure.
- PR #1182 reviewed it and required timeout policy before rerun.

That sequence showed that the project needs a clear timeout budget before any further local capture attempts.

---

## 3. Failure-class separation

This policy separates the following classes:

- operational capture failure;
- provider/transport failure;
- Brain-output failure;
- parser failure;
- validation failure;
- model-quality concern;
- candidate-quality concern.

Do not collapse these classes together.

Operational failure is about whether the capture path completed.
Output and validation failures are about what happened after a response existed.
Model and candidate quality concerns are separate again.

---

## 4. Default timeout policy for local captures

For a full local prompt capture, use the following default budget:

- preflight call timeout: `30000 ms`;
- first capture attempt timeout: `180000 ms`;
- one retry maximum for the full prompt;
- retry timeout: `300000 ms`;
- total budget for one full-prompt target: `480000 ms`.

If both attempts fail, stop and archive a model-capture failure artifact.

Do not extend timeout by intuition.
Do not keep adding retries to recover a stalled full prompt.

---

## 5. Reduced-load fallback policy

After a timeout artifact or timeout review, do not rerun the full prompt immediately.

The next step is a reduced-load retry if the work still needs to continue.

Recommended reduced language set for `study.segmentation.004`:

- Albanian
- Latin
- Chinese
- Germanic

Reason:

- keeps core test pressure;
- reduces generation cost;
- keeps the `TU` / `DI` cross-language check alive.

The reduced-language retry is not a quality claim.
It is a load-management step.

---

## 6. Chunk-split fallback policy

If the reduced-language full segmentation still times out, split by chunk:

- `S`
- `TU`
- `DI`

Each chunk call must still preserve Heart segmentation metadata.

Chunk-split results must be labelled as split-capture, not as a direct full-prompt equivalent.

Do not treat split-capture as if it were the same evidence class as the original full prompt.

---

## 7. Model-switch policy

Only switch model after all of the following:

- full prompt timeout archived;
- timeout review completed;
- reduced-language attempt timed out or failed operationally.

Model switch is not a quality claim.

If a model switch happens, archive it as a separate provider/model comparison context.

Do not treat a model switch as proof that the original model was bad or that the new model is good.

---

## 8. Archive policy

Every failed capture that reaches timeout must produce:

- model-capture failure artifact;
- companion result doc;
- optional review doc if the decision changes.

The archive must show the failure class honestly.

If no Brain output exists, do not create a Heart-to-Brain prototype artifact.

---

## 9. Stop conditions

Stop after 2 timeouts for the same full prompt.

Stop after 1 timeout for a reduced-language retry if the timeout exceeds `300000 ms`.

Stop immediately on provider unavailable or transport failure.

Do not keep extending the timeout budget by intuition.
Do not assume that another longer attempt will produce a different class of result.

---

## 10. Classification policy

Classify results as follows:

- timeout before response = operational capture failure;
- raw response but invalid JSON = parser or Brain-output failure;
- valid JSON but validator rejects = validation failure;
- valid output but weak candidates = candidate-quality concern;
- none of these alone is scientific evidence.

The classification should preserve the actual failure boundary.

---

## 11. Claim boundary

This policy is development policy only.

It is not:

- scientific evidence;
- publication evidence;
- eval evidence;
- Cohort evidence;
- model-quality evidence;
- candidate-truth evidence;
- language-origin evidence;
- reason to change the default provider from `mock`.

The policy governs local capture discipline.
It does not make any linguistic or scientific claim.

---

## 12. Recommended next action

After this policy PR, run a reduced-language `study.segmentation.004` v0.2 retry using Qwen3 8B.

Use target languages:

- Albanian
- Latin
- Chinese
- Germanic

Use the policy timeout budget.

Archive the result honestly, whether it passes, fails, or times out.

---

## 13. Completion definition

This policy is complete when:

- the timeout budget is explicit;
- the reduced-load fallback is explicit;
- the chunk-split fallback is explicit;
- the model-switch policy is explicit;
- the archive policy is explicit;
- the stop conditions are explicit;
- the classification policy is explicit;
- the claim boundary is explicit;
- the recommended next action is explicit.
