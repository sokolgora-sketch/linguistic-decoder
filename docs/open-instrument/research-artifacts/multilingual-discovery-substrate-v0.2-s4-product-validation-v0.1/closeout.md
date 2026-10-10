# Multilingual Discovery Substrate v0.2 — S4 Attempt-2 Forensic Recovery Closeout

Status: `PASS — S4_MEASURABLE_IMPROVEMENT`

## Recovery boundary

- Attempt 1: `MECHANICAL_POST_EVALUATION_PERSISTENCE_FAILURE`; no durable result.
- Attempt 2: provider evaluation completed and persisted `execution.json` and `results.json`.
- Recovery classification: `A` — complete computational payload recoverable offline.
- Offline finalization wrote `summary.json` before `hash-manifest.json`.
- Provider queries during recovery: `0`.
- Index lookups during recovery: `0`.
- Network calls during recovery: `0`.
- Evaluation inputs re-executed during recovery: `0`.
- Third attempt: `NOT_AUTHORIZED` and not performed.

## Frozen authority and result

- Procedure SHA-256: `97f7307d3eb3677750083889ee028639714b678ee2a80d723fe7fff9f1d52405`.
- Repository authority base: `6b06c0d6009f11570807973ad7a28e1c633c1a21`.
- Execution head: `59849b18e703d8c0841ddda608806f1fdbfb6df6`.
- Expected inputs: `1024`; valid inputs: `688`; invalid inputs: `336`.
- Missing inputs: `0`; duplicate inputs: `0`; regressions: `0`.
- Baseline positive inputs: `8`; expanded positive inputs: `451`; new positive inputs: `443`.
- Coverage: `0.011627906976744186` → `0.6555232558139535`.
- Coverage absolute delta: `0.6438953488372093`; relative delta: `55.375`.
- English-contributing inputs: `443`; Albanian: `0`; Latin: `0`; multi-source: `0`.

The finalized computational payload was verified offline with its hash manifest. Product-surface validation is recorded here separately so the computational result artifacts are not rewritten after finalization.

## Product and firewall validation

- Focused S4 persistence/API suite: `PASS` — 3 tests.
- Focused S4 browser smoke: `PASS` — persisted English candidate form, gloss, and language visible in `/chat`.
- Existing browser smoke: `PASS` — server, hydration, fresh analysis, provenance, evidence download/import, primary truth, and cleanup.
- S2/S3 firewall suites: `PASS` — 2 suites, 6 tests; historical artifacts were verified, not rerun.
- Full typecheck: `PASS`.
- Normal `gate:quick` without external-root export: `PASS` — lint, 799 suites, integration, and build.
- Separate production build: `PASS`.
- Root-enabled broad gate: `NOT_A_PRODUCT_GATE`; it produced environment-induced legacy timeouts because the external provider was intentionally enabled for the broad suite. It is not used as S4 evidence.

## Artifact hashes

- `execution.json`: `badab83c7692ea0e53128d51e12cf16e8b38d30081649284d5191b0e2ba9867b`
- `results.json`: `a729cf6f7f9ca74cc20d8aaea0c2a0a4435499345ec8b45a43d72064135f9f66`
- `summary.json`: `9cfb308b2ad4e3f66eaef2fa9ea954c7a05ad575d5146c8c072f14b5b4f90ae1`

No machine-local external-root path is recorded in this closeout.
