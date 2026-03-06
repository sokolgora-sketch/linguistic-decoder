# ZË-RO Evals Battery — March 2026

This folder stores public, reproducible battery runs for the `/evals` workflow.

## Canonical source of truth
- Raw model output JSON per run
- Exported PDF per run
- `index.csv` as the machine-readable summary table

## Scope
- Spec: `public-grounding-probe.v0.1`
- Task: `T2_LADDER_V0_1`
- UI scorer: `/evals`
- Date window: March 2026

## Naming
- Raw JSON: `openai.chatgpt52thinking/r01.raw.json`
- PDF: `openai.chatgpt52thinking/r01.pdf`

## CSV schema
timestamp,runId,provider,model,pearson_r,spearman_rho,p_perm,validN,invalidN,noVowelTokenCount,notes

## Notes
- Google Sheets is optional and not canonical.
- `p_perm` is taken from `slope_aperturePresenceMean.p_spearman`.
- `notes` must preserve `iters`, `seed`, and `p_perm_src=p_spearman`.
