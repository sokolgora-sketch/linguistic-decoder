# Anthropic — Claude 4.6 Sonnet Extended
## Same-Thread Feedback Adaptation Battery Summary

**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `anthropic`  
**Model:** `claude46sonnetextended`  
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
   - provider: `anthropic`
   - model: `claude46sonnetextended`
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

> Anthropic same-thread feedback adaptation battery.  
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
`tests/validation/out/evals.battery.2026-03-samethread/anthropic.claude46sonnetextended/`

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
| r01 | 0.206513 | 0.107143 | 0.841583 | wrong-direction start |
| r02 | -0.034019 | 0.071429 | 0.905000 | near-neutral |
| r03 | -0.310140 | -0.214286 | 0.658417 | best negative cluster |
| r04 | -0.269822 | -0.285714 | 0.553750 | best p-value cluster |
| r05 | 0.258582 | 0.178571 | 0.708583 | wrong-direction failure |
| r06 | -0.121325 | -0.071429 | 0.909000 | weak negative |
| r07 | -0.149604 | -0.285714 | 0.553583 | best p-value |
| r08 | 0.068734 | 0.071429 | 0.904167 | wrong-direction drift |
| r09 | 0.023684 | 0.071429 | 0.906500 | near-neutral positive |
| r10 | 0.141288 | 0.214286 | 0.658917 | wrong-direction finish |

---

## Ranking snapshot

### Best available runs
1. `r07` — best p-value, but still weak overall
2. `r04`
3. `r03`

### Weak negative runs
4. `r06`
5. `r02`

### Near-neutral / wrong-direction runs
6. `r09`
7. `r08`
8. `r01`
9. `r10`
10. `r05`

### Important note
No true top-tier recovery cluster appeared in this battery.

---

## Main interpretation

This Anthropic same-thread batch is weak overall and does **not** show stable improvement under feedback.

What the 10 runs show:

- There is a small negative cluster:
  - `r03`
  - `r04`
  - `r07`

- But that cluster is still weak compared with strong OpenAI same-thread runs.
- The model repeatedly returns to:
  - near-neutral behavior
  - wrong-direction positive behavior
  - unstable bucket regimes that do not align with the ladder geometry

So the model is clearly being conditioned by prior-thread context, but the feedback does **not** reliably move it into a strong configuration.

Instead, the sequence looks like:
- wrong-direction start
- partial recovery
- relapse
- weak recovery
- drift back toward positive / neutral output

That is oscillation without strong convergence.

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

1. We kept one dedicated Anthropic thread for `r01–r10`.
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

We intentionally stop this Anthropic same-thread phase at **10 runs**.

Reason:
- 10 runs already expose:
  - wrong-direction starts
  - weak negative recoveries
  - repeated relapse into neutral / positive behavior
  - lack of stable convergence
- The distribution is visible already
- More runs would add effort faster than insight for this provider

So for Test 2, `n=10` is enough for provider-level comparison.

---

## Final Anthropic same-thread conclusion

For `anthropic / claude46sonnetextended` on `T2_LADDER_V0_1` under same-thread feedback adaptation:

- Best observed runs: `r07`, `r04`, `r03`
- No strong stable recovery cluster appeared
- Wrong-direction outputs remained frequent
- Feedback did **not** produce stable improvement
- The model remained weak, oscillatory, and often near-neutral or positive-direction

That is the point of this battery.

---

## Next step

Do **not** continue to `r11+` for Anthropic same-thread right now.

Next move:
1. Finish saving / replacing all `r01–r10` PDFs
2. Copy Anthropic same-thread artifacts from `out/` to `baselines/`
3. Commit / push / merge Anthropic same-thread battery
4. Then start the next provider battery
