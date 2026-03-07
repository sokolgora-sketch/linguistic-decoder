# Anthropic — Claude 4.6 Sonnet Extended
## Evals Battery Summary
**Window:** March 2026  
**Spec:** `public-grounding-probe.v0.1`  
**Task:** `T2_LADDER_V0_1`  
**UI scorer:** `/evals`  
**Provider:** `anthropic`  
**Model:** `claude46sonnetextended`  
**Runs completed:** `r01` to `r12`

---

## What we did

We ran a controlled 12-run battery against the same eval task.

For each run:

1. Open `/evals`.
2. Keep the scorer config fixed:
   - Input mode: `Buckets only (wrap into a run)`
   - Task: `T2_LADDER_V0_1 — Full Ladder — V1..V7`
   - provider: `anthropic`
   - model: `claude46sonnetextended`
3. Set a new `runId` and matching short `label` (`r01`, `r02`, … `r12`).
4. Copy the exact visible task prompt from `/evals`.
5. Open a **fresh new Claude chat** for that run.
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

---

## Important methodological note

Claude showed more prompt resistance than OpenAI.

At least one fresh run initially responded that the task was underspecified because the prompt did not define the semantics of `V1..V7`, instead of directly returning JSON. A subsequent fresh chat then returned JSON and was scored as a normal run.

This matters:
- Claude was more likely to treat the prompt as incomplete
- OpenAI was more likely to comply and generate a ladder anyway

That difference is part of the evaluation evidence, not noise.

---

## Storage layout

### Working battery folder
`tests/validation/out/evals.battery.2026-03/anthropic.claude46sonnetextended/`

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
| r01 | -0.090873 | -0.035714 | 0.961917 | very weak |
| r02 | -0.094761 | 0.071429 | 0.907500 | very weak |
| r03 | 0.012847 | 0.000000 | 1.000000 | collapse |
| r04 | 0.238389 | 0.500000 | 0.268750 | wrong direction |
| r05 | -0.335227 | -0.321429 | 0.505667 | weak |
| r06 | -0.330098 | -0.250000 | 0.599667 | weak |
| r07 | -0.353219 | -0.500000 | 0.267500 | best Claude run |
| r08 | -0.241093 | -0.464286 | 0.305250 | weak-mid |
| r09 | -0.254808 | 0.000000 | 1.000000 | collapse |
| r10 | 0.309699 | 0.285714 | 0.557250 | wrong direction |
| r11 | -0.393367 | -0.285714 | 0.555583 | weak |
| r12 | 0.384671 | 0.321429 | 0.491417 | wrong direction |

---

## Ranking snapshot

### Best observed Claude runs
1. `r07`
2. `r08`
3. `r05`
4. `r06`

### Weak but usable
5. `r11`
6. `r01`
7. `r02`

### Collapse / wrong-direction cluster
8. `r03`
9. `r04`
10. `r09`
11. `r10`
12. `r12`

---

## Main interpretation

This Claude batch was substantially weaker than the OpenAI batch.

What the 12 runs show:

- No Claude run reached the quality band seen in OpenAI `r05`, `r06`, or `r11`
- Multiple runs were near-random or outright wrong-direction
- Claude frequently appeared to reinterpret the task into its own semantic system instead of aligning to the aperture ladder target
- The batch is not just noisy; it shows a persistent mismatch between Claude’s response pattern and the intended eval structure

So the conclusion is not “Claude had one unlucky run.”  
The conclusion is that Claude 4.6 Sonnet Extended, under this exact prompt and workflow, underperformed consistently on this battery.

---

## Why we stop at 12 runs

We intentionally stop at **12 runs**, not 20+.

Reason:
- 12 runs already show the distribution clearly
- Claude’s underperformance pattern is already obvious
- More repeats would add labor more than insight

So for phase 1, `n=12` is enough.

---

## Final Claude conclusion

For `anthropic / claude46sonnetextended` on `T2_LADDER_V0_1`:

- Best observed run: `r07`
- Secondary runs: `r08`, `r05`, `r06`
- Several runs collapsed or moved in the wrong direction
- Claude showed more prompt-friction than OpenAI
- Overall performance was materially below the OpenAI batch

That is the useful result.

---

## Next step

Do **not** continue to `r13+` for Claude right now.

Next move:
1. Freeze Claude at `r01–r12`
2. Commit the Claude battery artifacts cleanly
3. Compare OpenAI vs Claude side by side
4. Then decide whether Gemini or Grok is the next provider to benchmark

