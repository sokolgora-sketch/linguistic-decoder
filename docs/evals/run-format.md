# ZË-RO Evals v0.1 — Run Format (evalRun.v0.1)

This is the BYO input contract accepted by `/api/evals/score` and by the UI in **Full run bundle** mode.

Source of truth:
- `src/shared/evals/run.v0.1.ts` (parser: `parseEvalRunBundleV0_1`)
- `src/shared/evals/spec.v0.1.ts` (task ids + scoring settings)

Notes:
- Server enforces a payload cap (currently 300 KB, measured in UTF-8 bytes).
- You do **not** submit the derived negative control task (T3). The scorer derives it deterministically when the ladder (T2) is present.
- Tokens are strings. “Single token, no spaces” is the **task rule**; the scorer still accepts strings and reports invalid/duplicate counts.

## Top-level shape (run bundle)

```json
{
  "evalRunVersion": "evalRun.v0.1",
  "evalSpecVersion": "evalSpec.v0.1",
  "specId": "public-grounding-probe.v0.1",
  "runId": "your.run.id",
  "meta": { "provider": "optional", "model": "optional", "label": "optional" },
  "tasks": [
    {
      "taskId": "T2_LADDER_V0_1",
      "inputShape": "bucketed_single_tokens",
      "buckets": {
        "V1": ["token1", "token2"],
        "V2": ["token1", "token2"],
        "V3": ["token1", "token2"],
        "V4": ["token1", "token2"],
        "V5": ["token1", "token2"],
        "V6": ["token1", "token2"],
        "V7": ["token1", "token2"]
      }
    }
  ]
}
```