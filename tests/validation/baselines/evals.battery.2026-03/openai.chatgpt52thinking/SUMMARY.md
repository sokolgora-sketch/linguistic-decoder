# OpenAI — ChatGPT 5.2 Thinking
## Evals Battery Summary
**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `openai`  
**Model:** `chatgpt52thinking`  
**Runs completed:** `r01` to `r12`

---

## What we did

We ran a controlled 12-run battery against the same eval task.

For each run:

1. Open `/evals`.
2. Keep the scorer config fixed:
   - Input mode: `Buckets only (wrap into a run)`
   - Task: `T2_LADDER_V0_1 — Full Ladder — V1..V7`
   - provider: `openai`
   - model: `chatgpt52thinking`
3. Set a new `runId` and matching short `label` (`r01`, `r02`, … `r12`).
4. Copy the exact visible task prompt from `/evals`.
5. Open a **fresh new ChatGPT chat** for that run.
6. Paste **only** the task prompt into the fresh chat.
7. Take the returned buckets JSON and paste it back into `/evals`.
8. Click:
   - `Score`
   - `Copy Raw JSON`
   - `Copy CSV Row`
   - `Download PDF`
9. Save three artifacts per run:
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

So the method was not random convenience. It was part of the evaluation design.

---

## What was fixed before the battery

Before running the battery, the `/evals` workflow was tightened and repaired:

1. Restored the missing action buttons on `/evals`:
   - `Score`
   - `Download PDF`
   - `Copy Raw JSON`
   - `Copy CSV Row`

2. Tightened the `T2_LADDER_V0_1` prompt with:
   - uniqueness across all 70 tokens
   - self-audit for zero duplicates

3. Confirmed that the battery CSV should use:
   - `p_perm = slope_aperturePresenceMean.p_spearman`

4. Confirmed notes format:
   - `iters=...; seed=...; p_perm_src=p_spearman`

5. Revalidated with:
   - `npm run gate:quick`
   - `npm run build`

6. Merged the `/evals` clipboard helper + ladder prompt fix to `main`.

That means all runs below were performed against the repaired and validated scorer/UI.

---

## Storage layout

### Canonical battery folder
`tests/validation/out/evals.battery.2026-03/openai.chatgpt52thinking/`

### Per-run artifacts
- `r01.raw.json` ... `r12.raw.json`
- `r01.pdf` ... `r12.pdf`

### Shared index
`tests/validation/out/evals.battery.2026-03/index.csv`

### Optional mirror
Google Sheets may mirror the CSV rows, but it is **not canonical**.  
The repo files are the source of truth.

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
- The strongest runs are the ones with the most negative slope and the smallest permutation p-value

---

## Run table

| Run | Pearson r | Spearman ρ | p_perm | Notes |
|---|---:|---:|---:|---|
| r01 | -0.698600 | -0.785714 | 0.046833 | strong |
| r02 | -0.772981 | -0.678571 | 0.108333 | weak-mid |
| r03 | -0.754019 | -0.678571 | 0.109750 | weak-mid |
| r04 | -0.641413 | -0.642857 | 0.142333 | weak |
| r05 | -0.871341 | -0.821429 | 0.036333 | top tier |
| r06 | -0.862746 | -0.821429 | 0.033000 | best p-value |
| r07 | -0.803836 | -0.785714 | 0.045750 | strong |
| r08 | -0.805273 | -0.714286 | 0.087583 | mid |
| r09 | -0.781695 | -0.678571 | 0.110083 | weak-mid |
| r10 | -0.671085 | -0.428571 | 0.356750 | collapse / outlier |
| r11 | -0.829063 | -0.821429 | 0.036500 | top tier |
| r12 | -0.803328 | -0.714286 | 0.087917 | mid |

---

## Ranking snapshot

### Top tier
1. `r06` — best overall by p-value
2. `r05`
3. `r11`

### Strong but below top tier
4. `r01`
5. `r07`

### Middle
6. `r08`
7. `r12`

### Weak-mid
8. `r02`
9. `r03`
10. `r09`

### Weakest
11. `r04`
12. `r10`

---

## Main interpretation

This OpenAI batch shows that the model can produce genuinely strong ladder outputs, but not with perfect stability.

What the 12 runs show:

- There is a **real strong cluster**:
  - `r05`
  - `r06`
  - `r11`

- There is a **secondary acceptable cluster**:
  - `r01`
  - `r07`

- There is also meaningful variance:
  - `r02`, `r03`, `r08`, `r09`, `r12` are usable but clearly weaker
  - `r10` is a clear low-quality outlier

So the model is **capable**, but not fully stable across fresh-chat repeats.

That is exactly why the battery matters.

---

## Methodological notes / incidents during the batch

A few operational issues happened and were corrected:

1. The `/evals` buttons had previously disappeared after UI edits.
   - Fixed before battery continuation.

2. The ladder prompt uniqueness constraint was initially injected into the wrong task.
   - Fixed so uniqueness applies only to `T2_LADDER_V0_1`.

3. One duplicated CSV row appeared during saving.
   - `index.csv` was deduped.

4. A naming issue happened around `r10`:
   - temporary `r010` naming appeared
   - corrected so canonical run is `r10`

These were process issues, not scoring issues, and were repaired before finalizing the saved battery artifacts.

---

## Why we stop at 12 runs

We intentionally stop this OpenAI phase at **12 runs**, not 20+.

Reason:
- 12 runs already expose:
  - best case
  - typical case
  - weak case
  - outlier case
- The distribution is now visible
- More repeats would add time faster than insight

So for phase 1, `n=12` is enough to compare providers/models.

---

## Final OpenAI conclusion

For `openai / chatgpt52thinking` on `T2_LADDER_V0_1`:

- Best observed run: `r06`
- Strong repeat support: `r05`, `r11`
- Good but not top-tier: `r01`, `r07`
- Clear instability exists across repeats
- The model is not “fake-good”; it can perform well
- But it is also not perfectly stable under fresh-chat repeated sampling

That is the exact point of the battery.

---

## Next step

Do **not** continue to `r13+` for OpenAI right now.

Next move:
1. Freeze OpenAI at `r01–r12`
2. Commit the saved OpenAI battery artifacts
3. Run the same 12-run battery for the next AI using the same protocol
4. Compare distributions across models

