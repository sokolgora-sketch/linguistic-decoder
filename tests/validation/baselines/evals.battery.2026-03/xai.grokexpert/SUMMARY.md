# xAI — Grok Expert
## Evals Battery Summary
**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `xai`  
**Model:** `grokexpert`  
**Runs completed:** `r01` to `r12`

---

## What we did

We ran a controlled 12-run battery against the same eval task.

For each run:

1. Open `/evals`.
2. Keep the scorer config fixed:
   - Input mode: `Buckets only (wrap into a run)`
   - Task: `T2_LADDER_V0_1 — Full Ladder — V1..V7`
   - provider: `xai`
   - model: `grokexpert`
3. Set a new `runId` and matching short `label` (`r01`, `r02`, … `r12`).
4. Copy the exact visible task prompt from `/evals`.
5. Open a **fresh new Grok chat** for that run.
6. Keep **Expert** selected.
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

This battery was run using the visible Grok UI mode **Expert**.

We intentionally logged the model as `grokexpert` because that is the exact mode we could verify on screen, rather than guessing an internal model identifier.

Also notable:
- `r09` and `r12` converged to the same scored pattern
- those were kept as separate runs because they came from separate fresh-chat attempts

---

## Storage layout

### Working battery folder
`tests/validation/out/evals.battery.2026-03/xai.grokexpert/`

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
| r01 | -0.758765 | -0.785714 | 0.048917 | best Grok run |
| r02 | -0.758204 | -0.714286 | 0.087833 | strong |
| r03 | -0.567313 | -0.321429 | 0.499250 | usable |
| r04 | 0.743448 | 0.714286 | 0.088333 | wrong direction |
| r05 | -0.480567 | -0.678571 | 0.111333 | good-mid |
| r06 | 0.329371 | 0.392857 | 0.392000 | wrong direction |
| r07 | -0.253204 | -0.285714 | 0.555500 | weak |
| r08 | -0.122981 | -0.071429 | 0.909167 | near-random |
| r09 | -0.167009 | -0.500000 | 0.266750 | repeated fallback pattern |
| r10 | -0.373325 | -0.392857 | 0.396750 | usable-mid |
| r11 | -0.124776 | 0.071429 | 0.908583 | weak |
| r12 | -0.167009 | -0.500000 | 0.266750 | repeated fallback pattern |

---

## Ranking snapshot

### Best observed Grok runs
1. `r01`
2. `r02`
3. `r05`

### Usable middle
4. `r03`
5. `r10`
6. `r09`
7. `r12`

### Weak cluster
8. `r07`
9. `r11`
10. `r08`

### Wrong-direction failures
11. `r06`
12. `r04`

---

## Main interpretation

This Grok batch shows a high ceiling, but meaningful instability.

What the 12 runs show:

- Grok can produce very strong ladder-aligned outputs:
  - `r01`
  - `r02`

- It also has a smaller usable middle:
  - `r05`
  - `r03`
  - `r10`

- But variance is substantial:
  - two runs were clearly wrong-direction (`r04`, `r06`)
  - one run was near-random (`r08`)
  - two runs converged to the same repeated fallback pattern (`r09`, `r12`)

So Grok is not weak in the same way Claude was.  
But it also does not look consistently reliable under repeated fresh-chat sampling.

---

## Why we stop at 12 runs

We intentionally stop at **12 runs**, not 20+.

Reason:
- 12 runs already show:
  - best case
  - strong case
  - usable middle
  - weak case
  - repeated fallback behavior
  - wrong-direction failures
- The distribution is already visible
- More repeats would add labor more than insight

So for phase 1, `n=12` is enough.

---

## Final Grok conclusion

For `xai / grokexpert` on `T2_LADDER_V0_1`:

- Best observed runs: `r01`, `r02`
- Additional usable runs: `r05`, `r03`, `r10`
- Repeated fallback pattern appeared in `r09` and `r12`
- Wrong-direction failures occurred in `r04` and `r06`
- Overall performance appears better than Claude
- Overall stability appears below OpenAI
- Relative to Gemini, Grok appears competitive but still noisy

That is the useful result.

---

## Next step

Do **not** continue to `r13+` for Grok right now.

Next move:
1. Freeze Grok at `r01–r12`
2. Commit the Grok battery artifacts cleanly
3. Then write the all-provider comparison across OpenAI, Claude, Gemini, and Grok

