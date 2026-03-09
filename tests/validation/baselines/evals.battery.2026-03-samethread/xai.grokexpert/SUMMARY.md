# xAI — Grok Expert
## Same-Thread Feedback Adaptation Battery Summary

**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `xai`  
**Model:** `grokexpert`  
**Condition:** `same-thread feedback adaptation`  
**Runs completed:** `r01` to `r10`

---

## What we did

We ran a controlled 10-run battery against the same eval task, but **inside one continuing chat thread**.

For each run:

1. Open `/evals`.
2. Keep the scorer config fixed:
   - Input mode: `Buckets only (wrap into a run)`
   - Task: `T2_LADDER_V0_1 — Full Ladder — V1..V7`
   - provider: `xai`
   - model: `grokexpert`
3. Set a new `runId` and matching short `label` (`r01`, `r02`, … `r10`).
4. For `r01`, paste the task prompt into a clean dedicated chat thread.
5. For `r02+`, paste back:
   - previous `runId`
   - previous `pearson_r`
   - previous `spearman_rho`
   - previous `p_perm`
   - previous full output JSON
6. Ask for the same task again with:
   - `Return STRICT JSON only.`
   - `Do not explain.`
7. Paste the returned JSON back into `/evals`.
8. Click:
   - `Score`
   - `Copy Raw JSON`
   - `Copy CSV Row`
   - `Download PDF`
9. Save artifacts per run:
   - `rNN.raw.json`
   - `rNN.pdf`
   - one line in the shared results sheet

This gives a same-thread battery where every run is conditioned on the previous scored output.

---

## Exact thread initialization prompt

Before `r01`, the provider chat was initialized with this exact message:

> xAI same-thread feedback adaptation battery.  
> This thread is dedicated to runs r01–r10 for `T2_LADDER_V0_1` only.  
> After each run, I will paste back the previous scored result and previous JSON, then request the same task again.  
> You must return STRICT JSON only when the test prompt is given.  
> Do not explain.

This message was **not** the eval task itself. It only established the protocol for the thread.

Immediately after that, `r01` used the **actual task prompt copied from `/evals`**.

So the thread structure was:

1. Protocol banner (the message above)
2. Exact `T2_LADDER_V0_1` task prompt from `/evals`
3. Model returns JSON
4. JSON is scored in `/evals`
5. For `r02+`, the previous score block and previous JSON are fed back into the same chat, followed by the same task request again

This distinction matters:

- the **banner** defines the conversation contract
- the **task prompt** defines the semantic ladder task being scored

The same structure was used for all same-thread provider batteries, with only the provider name changed in the banner.

---

## Why we used one continuing thread

We intentionally reused **one single conversation thread** for all 10 runs.

Reason:
- We wanted to test **feedback-conditioned behavior**, not fresh-chat independence.
- The model sees its previous scored result and previous JSON.
- This lets us observe:
  - drift
  - anchoring
  - oscillation
  - recovery
  - collapse
  - temporary stabilization

Important:
- this is **not training**
- this is **not weight updating**
- it is a test of **within-thread adaptation under repeated scored feedback**

So this method was part of the experimental design, not a convenience choice.

---

## What stayed fixed

All runs used the same scorer settings and emitted the same schema:

- `validN = 70`
- `invalidN = 0`
- `noVowelTokenCount = 0`
- `iters = 12000`
- `seed = 97631760`
- `p_perm_src = p_spearman`

Interpretation:
- More negative `pearson_r` / `spearman_rho` is better for this task
- Lower `p_perm` is better
- Strong runs are the runs with the most negative slope and smallest permutation p-value

---

## Storage layout

### Working battery folder
`tests/validation/out/evals.battery.2026-03-samethread/xai.grokexpert/`

### Per-run artifacts
- `r01.raw.json` ... `r10.raw.json`
- `r01.pdf` ... `r10.pdf`

### Sheet mirror
Google Sheets may mirror the run rows, but the repo artifacts in `out/` are the working source of truth until freeze.

### Freeze later
After all providers complete Test 2, freeze the final same-thread battery into baselines.

---

## Run table

| Run | Pearson r | Spearman ρ | p_perm | Notes |
|---|---:|---:|---:|---|
| r01 | -0.810515 | -0.785714 | 0.050000 | strong start |
| r02 | -0.035181 | -0.107143 | 0.835667 | collapse to near-neutral |
| r03 | -0.806954 | -0.821429 | 0.034833 | strong recovery |
| r04 | -0.917299 | -0.928571 | 0.006583 | peak run |
| r05 | -0.283100 | -0.285714 | 0.556167 | weaker middle |
| r06 | -0.167009 | -0.500000 | 0.266750 | mixed but still negative |
| r07 | -0.353822 | -0.321429 | 0.493250 | moderate negative |
| r08 | -0.385453 | -0.535714 | 0.241167 | improved negative |
| r09 | -0.917299 | -0.928571 | 0.006583 | exact re-lock to peak |
| r10 | -0.917299 | -0.928571 | 0.006583 | exact repeat of peak |

---

## Ranking snapshot

### Top tier
1. `r04`
2. `r09`
3. `r10`

### Strong
4. `r03`
5. `r01`

### Middle
6. `r08`
7. `r06`
8. `r07`
9. `r05`

### Weakest
10. `r02`

### Important note
The end of the sequence did not merely stay negative. It appears to have **re-locked onto a stable best-performing pattern**, with `r09` and `r10` exactly matching the `r04` peak profile.

---

## Main interpretation

This xAI same-thread batch is strong overall and shows a notable pattern of collapse, recovery, and eventual stabilization.

What the 10 runs show:

- The sequence begins strongly:
  - `r01`

- It then collapses sharply toward neutral:
  - `r02`

- After that, the model recovers strongly:
  - `r03`

- It reaches a clear peak at:
  - `r04`

- The middle sequence weakens but stays on the correct negative side:
  - `r05`
  - `r06`
  - `r07`
  - `r08`

- Then the model re-locks onto the peak configuration:
  - `r09`
  - `r10`

Most important:
- `r04`, `r09`, and `r10` have the same best score profile
- `r09` and `r10` repeated that peak exactly rather than drifting away

So unlike Gemini and unlike the more oscillatory DeepSeek case, xAI does not look like it is being pushed into instability by same-thread feedback.
It looks more like:
- early strong behavior
- one collapse
- recovery
- convergence onto a stable high-performing pattern

That makes this one of the strongest same-thread batteries in the set.

---

## Comparison to fresh-chat logic

This same-thread battery should not be interpreted the same way as the fresh-chat battery.

Fresh-chat asks:
- how stable is the model under repeated independent samples?

Same-thread asks:
- what happens when the model sees its own previous scored output and must try again in the same conversation?

So this result is about:
- anchoring
- self-conditioning
- local adaptation
- instability or stabilization under repeated feedback

not about independent repeatability.

For xAI, the striking observation is:
- same-thread feedback did not degrade the model overall
- after an early collapse, the model appears to have stabilized into a strong solution

---

## Methodological notes

A few discipline points were important in this battery:

1. We kept one dedicated xAI thread for `r01–r10`.
2. We avoided coaching language such as:
   - “you were wrong”
   - “improve your score”
   - “follow the truth”
3. We fed back only:
   - previous run record
   - previous full JSON
   - the request to perform the same task again
4. We kept scorer settings fixed across all runs.

That means changes across runs are attributable to the same-thread feedback condition, not to prompt redesign.

---

## Why we stop at 10 runs

We intentionally stop this xAI same-thread phase at **10 runs**.

Reason:
- 10 runs already expose:
  - strong start
  - one major collapse
  - strong recovery
  - middle-sequence weakening
  - end-state stabilization
- The pattern is already clear
- More runs would add effort faster than insight for this provider

So for Test 2, `n=10` is enough for provider-level comparison.

---

## Final xAI same-thread conclusion

For `xai / grokexpert` on `T2_LADDER_V0_1` under same-thread feedback adaptation:

- Best observed runs: `r04`, `r09`, `r10`
- Other strong runs: `r03`, `r01`
- `r02` is the clear collapse / outlier
- The middle sequence weakens but stays negative
- Same-thread feedback did not destabilize the model long-term
- After recovery, the model appears to converge onto a stable high-performing pattern

That is the point of this battery.

---

## Next step

Do **not** continue to `r11+` for xAI same-thread right now.

Next move:
1. Finish saving / replacing all `r01–r10` PDFs
2. Copy xAI same-thread artifacts from `out/` to `baselines/`
3. Commit / push / merge xAI same-thread battery
4. Then standardize earlier provider summaries so OpenAI and Anthropic match the same method section format
