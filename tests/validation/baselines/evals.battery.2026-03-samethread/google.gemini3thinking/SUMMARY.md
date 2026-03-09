# Google — Gemini 3 Thinking
## Same-Thread Feedback Adaptation Battery Summary

**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `google`  
**Model:** `gemini3thinking`  
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
   - provider: `google`
   - model: `gemini3thinking`
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

> Google same-thread feedback adaptation battery.  
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
`tests/validation/out/evals.battery.2026-03-samethread/google.gemini3thinking/`

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
| r01 | -0.479325 | -0.428571 | 0.349333 | moderate negative start |
| r02 | -0.256069 | -0.285714 | 0.559833 | weak negative |
| r03 | 0.017075 | -0.035714 | 0.963917 | near-neutral collapse |
| r04 | 0.746164 | 0.678571 | 0.108417 | strong wrong-direction flip |
| r05 | 0.837033 | 0.892857 | 0.011333 | catastrophic wrong-direction |
| r06 | 0.838412 | 0.821429 | 0.032250 | catastrophic wrong-direction |
| r07 | 0.915622 | 0.964286 | 0.002333 | worst wrong-direction run |
| r08 | 0.768580 | 0.785714 | 0.048750 | severe wrong-direction |
| r09 | 0.951199 | 0.928571 | 0.006500 | strongest positive Pearson |
| r10 | 0.509702 | 0.464286 | 0.304750 | partial easing but still wrong-direction |

---

## Ranking snapshot

### Best available runs
1. `r01`
2. `r02`

### Collapse / transition
3. `r03`

### Strong wrong-direction cluster
4. `r10`
5. `r04`
6. `r08`

### Catastrophic wrong-direction cluster
7. `r06`
8. `r05`
9. `r09`
10. `r07`

### Important note
The “best” Gemini runs are simply the least-bad runs. No strong negative recovery cluster appeared after the early sequence.

---

## Main interpretation

This Gemini same-thread batch is the clearest failure case so far.

What the 10 runs show:

- The sequence begins with two negative runs:
  - `r01`
  - `r02`

- It then collapses toward neutral at:
  - `r03`

- After that, the model flips into a **stable wrong-direction regime**:
  - `r04` through `r10` are all positive on Pearson
  - several are strongly positive on both Pearson and Spearman
  - `r05`, `r06`, `r07`, `r08`, and `r09` form a sustained inverted cluster

So this is not just random noise or mild instability.
It looks like same-thread feedback pushed Gemini into an **inverted ladder strategy** and the model then largely stayed there.

That makes this battery especially important:
- the model is not merely weak
- it appears to become **confidently wrong** under same-thread feedback conditioning

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

For Gemini, the striking observation is:
- same-thread feedback does not just fail to improve the model
- it appears to **lock the model into the opposite geometry**

---

## Methodological notes

A few discipline points were important in this battery:

1. We kept one dedicated Gemini thread for `r01–r10`.
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

We intentionally stop this Gemini same-thread phase at **10 runs**.

Reason:
- 10 runs already expose:
  - initial negative behavior
  - collapse to neutral
  - persistent wrong-direction inversion
  - catastrophic positive-correlation cluster
- The pattern is already unmistakable
- More runs would add effort faster than insight for this provider

So for Test 2, `n=10` is enough for provider-level comparison.

---

## Final Gemini same-thread conclusion

For `google / gemini3thinking` on `T2_LADDER_V0_1` under same-thread feedback adaptation:

- Best observed runs: `r01`, `r02`
- `r03` is a neutral transition / collapse
- `r04` to `r10` show strong wrong-direction behavior
- Worst runs: `r07`, `r09`, `r05`, `r06`
- Feedback did **not** improve the model
- Instead, same-thread conditioning appears to have driven Gemini into a persistent inverted response pattern

That is the point of this battery.

---

## Next step

Do **not** continue to `r11+` for Gemini same-thread right now.

Next move:
1. Finish saving / replacing all `r01–r10` PDFs
2. Copy Gemini same-thread artifacts from `out/` to `baselines/`
3. Commit / push / merge Gemini same-thread battery
4. Then start the next provider battery
