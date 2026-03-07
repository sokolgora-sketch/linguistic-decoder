# Google — Gemini 3 Thinking
## Evals Battery Summary
**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `google`  
**Model:** `gemini3thinking`  
**Runs completed:** `r01` to `r12`

---

## What we did

We ran a controlled 12-run battery against the same eval task.

For each run:

1. Open `/evals`.
2. Keep the scorer config fixed:
   - Input mode: `Buckets only (wrap into a run)`
   - Task: `T2_LADDER_V0_1 — Full Ladder — V1..V7`
   - provider: `google`
   - model: `gemini3thinking`
3. Set a new `runId` and matching short `label` (`r01`, `r02`, … `r12`).
4. Copy the exact visible task prompt from `/evals`.
5. Open a **fresh new Gemini chat** for that run.
6. Keep **Thinking** selected.
7. Paste **only** the task prompt into the fresh chat.
8. Take the returned buckets JSON and paste it back into `/evals`.
9. Click:
   - `Score`
   - `Copy Raw JSON`
   - `Copy CSV Row`
   - `Download PDF`
10. Save three artifacts per run:
   - `rNN.raw.json`
   - `rNN.pdf`
   - one line in shared `index.csv`

This gives a clean, reproducible battery with one raw response, one scored row, and one PDF report per run.

---

## Why we used a fresh chat every run

We intentionally opened a **new chat page for every run** to reduce carryover effects.

Reason:
- If the same conversation is reused, the model can anchor on prior wording, prior bucket choices, or prior self-patterns.
- A fresh chat is closer to an independent repeat under the same prompt.
- That makes the battery more defendable as a repeatability test instead of a single conversation drifting over time.

---

## Important methodological note

The Gemini battery was briefly interrupted after `r07` because the Thinking quota limit was reached.

We did **not** switch that battery to Pro, Fast, or fallback modes.

Instead:
- we paused the battery
- resumed later with the **same** model: `gemini3thinking`
- continued from `r08` through `r12`

This keeps the battery valid as a single-model run set.

---

## Storage layout

### Working battery folder
`tests/validation/out/evals.battery.2026-03/google.gemini3thinking/`

### Per-run artifacts
- `r01.raw.json` ... `r12.raw.json`
- `r01.pdf` ... `r12.pdf`

### Shared index
`tests/validation/out/evals.battery.2026-03/index.csv`

---

## Scoring notes

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
- Positive correlations indicate the model is pushing in the wrong direction for the ladder

---

## Run table

| Run | Pearson r | Spearman ρ | p_perm | Notes |
|---|---:|---:|---:|---|
| r01 | 0.069784 | 0.000000 | 1.000000 | collapse |
| r02 | -0.488417 | -0.500000 | 0.272167 | good |
| r03 | -0.003334 | 0.071429 | 0.904750 | very weak |
| r04 | 0.192872 | 0.285714 | 0.555333 | wrong direction |
| r05 | -0.403788 | -0.357143 | 0.441917 | usable |
| r06 | 0.134086 | 0.071429 | 0.907250 | very weak |
| r07 | -0.706142 | -0.642857 | 0.138500 | best Gemini run |
| r08 | -0.378548 | -0.392857 | 0.390250 | usable |
| r09 | -0.017272 | 0.142857 | 0.787417 | weak |
| r10 | -0.406935 | -0.392857 | 0.392333 | usable |
| r11 | -0.406788 | -0.428571 | 0.349667 | good-mid |
| r12 | -0.442369 | -0.607143 | 0.169167 | strong |

---

## Ranking snapshot

### Best observed Gemini runs
1. `r07`
2. `r12`
3. `r02`

### Usable middle
4. `r11`
5. `r10`
6. `r08`
7. `r05`

### Weak / collapse / wrong-direction cluster
8. `r09`
9. `r03`
10. `r06`
11. `r04`
12. `r01`

---

## Main interpretation

This Gemini batch was clearly stronger than the Claude batch, but still less stable than the OpenAI batch.

What the 12 runs show:

- Gemini can produce strong ladder-aligned outputs:
  - `r07`
  - `r12`
  - `r02`

- Gemini also has a meaningful mid-tier band:
  - `r11`
  - `r10`
  - `r08`
  - `r05`

- But instability is still real:
  - several runs are near-random or wrong-direction
  - the spread between best and worst runs is large

So Gemini is not weak in the same way Claude was.  
But it is also not as consistently strong as OpenAI under repeated fresh-chat sampling.

---

## Why we stop at 12 runs

We intentionally stop at **12 runs**, not 20+.

Reason:
- 12 runs already show:
  - best case
  - good case
  - usable middle
  - weak case
  - collapse / wrong-direction case
- The distribution is already visible
- More repeats would add labor more than insight

So for phase 1, `n=12` is enough.

---

## Final Gemini conclusion

For `google / gemini3thinking` on `T2_LADDER_V0_1`:

- Best observed run: `r07`
- Strong support run: `r12`
- Additional decent runs: `r02`, `r11`, `r10`, `r08`, `r05`
- Multiple weak or wrong-direction runs still occurred
- Overall performance appears materially better than Claude
- Overall stability still appears lower than OpenAI

That is the useful result.

---

## Next step

Do **not** continue to `r13+` for Gemini right now.

Next move:
1. Freeze Gemini at `r01–r12`
2. Commit the Gemini battery artifacts cleanly
3. Then decide whether Grok is the next provider to benchmark
4. After all target providers are complete, write the full all-provider comparison

