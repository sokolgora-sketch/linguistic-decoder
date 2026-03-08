# DeepSeek — Deep Thinking
## Evals Battery Summary
**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `deepseek`  
**Model:** `deepthinking`  
**Runs completed:** `r01` to `r12`

---

## What we did

We ran a controlled 12-run battery against the same eval task.

For each run:

1. Open `/evals`.
2. Keep the scorer config fixed:
   - Input mode: `Buckets only (wrap into a run)`
   - Task: `T2_LADDER_V0_1 — Full Ladder — V1..V7`
   - provider: `deepseek`
   - model: `deepthinking`
3. Set a new `runId` and matching short `label` (`r01`, `r02`, … `r12`).
4. Copy the exact visible task prompt from `/evals`.
5. Open a **fresh new DeepSeek chat** for that run.
6. Keep **Deep thinking** enabled.
7. Keep **Smart Search** off.
8. Paste **only** the task prompt into the fresh chat.
9. Take the returned buckets JSON and paste it back into `/evals`.
10. Click:
   - `Score`
   - `Copy Raw JSON`
   - `Copy CSV Row`
   - `Download PDF`
11. Save three artifacts per run:
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

## Storage layout

### Working battery folder
`tests/validation/out/evals.battery.2026-03/deepseek.deepthinking/`

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
| r01 | -0.706987 | -0.785714 | 0.047083 | strong |
| r02 | -0.352428 | -0.214286 | 0.656333 | usable |
| r03 | -0.211836 | -0.035714 | 0.965667 | weak |
| r04 | -0.379540 | -0.500000 | 0.268000 | usable |
| r05 | -0.807870 | -0.714286 | 0.090667 | best DeepSeek run |
| r06 | -0.674364 | -0.642857 | 0.138583 | strong |
| r07 | -0.617925 | -0.607143 | 0.164917 | strong |
| r08 | 0.534283 | 0.678571 | 0.108667 | wrong direction |
| r09 | 0.054072 | -0.107143 | 0.839167 | weak |
| r10 | -0.328968 | -0.321429 | 0.499167 | usable-mid |
| r11 | -0.168827 | -0.214286 | 0.668750 | weak |
| r12 | -0.680799 | -0.571429 | 0.201167 | strong |

---

## Ranking snapshot

### Best observed DeepSeek runs
1. `r05`
2. `r01`
3. `r06`
4. `r07`
5. `r12`

### Usable middle
6. `r04`
7. `r02`
8. `r10`

### Weak cluster
9. `r03`
10. `r11`
11. `r09`

### Wrong-direction failure
12. `r08`

---

## Main interpretation

This DeepSeek batch shows a high ceiling with noticeable variance.

What the 12 runs show:

- DeepSeek can produce very strong ladder-aligned outputs:
  - `r05`
  - `r01`
  - `r06`
  - `r07`
  - `r12`

- It also has a usable middle:
  - `r04`
  - `r02`
  - `r10`

- But instability is still present:
  - several runs are weak (`r03`, `r09`, `r11`)
  - one run is clearly wrong-direction (`r08`)

So DeepSeek is clearly not weak on this task.  
But it is also not uniformly stable under repeated fresh-chat sampling.

---

## Why we stop at 12 runs

We intentionally stop at **12 runs**, not 20+.

Reason:
- 12 runs already show:
  - best case
  - strong case
  - usable middle
  - weak case
  - wrong-direction failure
- The distribution is already visible
- More repeats would add labor more than insight

So for phase 1, `n=12` is enough.

---

## Final DeepSeek conclusion

For `deepseek / deepthinking` on `T2_LADDER_V0_1`:

- Best observed run: `r05`
- Additional strong runs: `r01`, `r06`, `r07`, `r12`
- Usable runs: `r04`, `r02`, `r10`
- Weak runs: `r03`, `r09`, `r11`
- Wrong-direction failure: `r08`

Overall:
- stronger than Claude
- clearly capable of top-tier outputs
- less stable than OpenAI
- competitive with Gemini and Grok

That is the useful result.

---

## Next step

Do **not** continue to `r13+` for DeepSeek right now.

Next move:
1. Freeze DeepSeek at `r01–r12`
2. Commit the DeepSeek battery artifacts cleanly
3. Then write the all-provider comparison across OpenAI, Claude, Gemini, Grok, and DeepSeek

