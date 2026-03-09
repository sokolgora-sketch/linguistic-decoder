# OpenAI — ChatGPT 5.2 Thinking
## Same-Thread Feedback Adaptation Battery Summary

**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `openai`  
**Model:** `chatgpt52thinking`  
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
   - provider: `openai`
   - model: `chatgpt52thinking`
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

> OpenAI same-thread feedback adaptation battery.  
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
`tests/validation/out/evals.battery.2026-03-samethread/openai.chatgpt52thinking/`

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
| r01 | -0.504201 | -0.571429 | 0.199417 | strong start |
| r02 | -0.311058 | 0.000000 | 1.000000 | collapse to neutral |
| r03 | -0.407704 | -0.321429 | 0.496667 | partial recovery |
| r04 | -0.758433 | -0.642857 | 0.134083 | top tier |
| r05 | -0.169962 | -0.214286 | 0.670917 | weak |
| r06 | -0.358304 | -0.250000 | 0.591917 | weak-mid |
| r07 | 0.116791 | 0.178571 | 0.716833 | wrong-direction failure |
| r08 | -0.297363 | -0.321429 | 0.494667 | weak-mid |
| r09 | -0.726327 | -0.714286 | 0.086500 | best overall |
| r10 | -0.490359 | -0.464286 | 0.302917 | strong finish |

---

## Ranking snapshot

### Top tier
1. `r09` — best overall by p-value and strongest combined profile
2. `r04`

### Strong but below top tier
3. `r01`
4. `r10`

### Middle
5. `r03`
6. `r08`
7. `r06`

### Weak
8. `r05`

### Weakest / failure modes
9. `r02` — neutralized
10. `r07` — wrong-direction positive drift

---

## Main interpretation

This OpenAI same-thread batch does **not** show monotonic improvement under feedback.

What the 10 runs show:

- The model can still produce **strong same-thread recoveries**:
  - `r04`
  - `r09`

- But those strong recoveries do **not** lock in permanently:
  - after `r04`, performance weakens again in `r05` and `r06`
  - after a positive-direction failure in `r07`, it recovers again in `r08`–`r10`

- The sequence is therefore **oscillatory**, not steadily improving:
  - strong negative
  - collapse / neutralization
  - recovery
  - renewed drift
  - stronger recovery
  - partial weakening

So the model is clearly **responsive to prior-thread context**, but that response is **not stable optimization**. It behaves more like feedback-conditioned drift with intermittent recovery.

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
- instability under repeated feedback

not about independent repeatability.

---

## Methodological notes

A few discipline points were important in this battery:

1. We kept one dedicated OpenAI thread for `r01–r10`.
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

We intentionally stop this OpenAI same-thread phase at **10 runs**.

Reason:
- 10 runs already expose:
  - strong recovery runs
  - weak runs
  - neutral failure
  - wrong-direction drift
  - end-of-sequence recovery
- The pattern is visible already
- More runs would add effort faster than insight for this provider

So for Test 2, `n=10` is enough for provider-level comparison.

---

## Final OpenAI same-thread conclusion

For `openai / chatgpt52thinking` on `T2_LADDER_V0_1` under same-thread feedback adaptation:

- Best observed run: `r09`
- Other strong runs: `r04`, `r01`, `r10`
- Clear instability remains across the sequence
- Feedback does **not** produce steady upward improvement
- The model can recover after weak runs, but it can also drift or flip direction
- Same-thread conditioning changes behavior, but does not stabilize it into a consistently strong state

That is the point of this battery.

---

## Next step

Do **not** continue to `r11+` for OpenAI same-thread right now.

Next move:
1. Finish saving / replacing all `r01–r10` PDFs
2. Start the same-thread battery for the next provider using the exact same protocol
3. After all providers finish Test 2, freeze the artifacts
4. Then compare fresh-chat vs same-thread distributions in the combined paper
