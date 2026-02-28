# ZË-RO Evals v0.1 — Quickstart (BYO Outputs)

ZË-RO Evals v0.1 is a reproducible Aperture–Semantics Consistency probe.
It scores controlled bucketed token outputs using the orthography SSOT and a fixed aperture proxy.
No API keys. No model calls. No “truth” / “hallucination” scoring.

See: `docs/evals/definition.md`

## Use the UI (recommended)

1) Run locally:
- `npm install`
- `npm run dev`

2) Open:
- `http://localhost:3000/evals`

3) Choose input mode:
- **Buckets only (wrap into a run):** paste only the buckets object for a chosen task.
- **Full run bundle (evalRun.v0.1):** paste the full run JSON.

4) Click **Load example**
- Loads a synthetic calibration ladder (non-semantic) to verify wiring.

5) Click **Score**
- You’ll see bucket means, slope stats, permutation p-values, and diagnostics.
- The derived negative control (T3) is computed automatically when the ladder task (T2) is present.

## Score via API (local)

1) Save a run bundle JSON to `run.json`
2) POST it:

```bash
curl -sS -X POST "http://localhost:3000/api/evals/score" \
  -H "content-type: application/json" \
  --data-binary @run.json > scored.json
```

The response JSON includes:
- `ok` (boolean)
- `report` (`evalReport.v0.1`)
- `md` (markdown rendering)