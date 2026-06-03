# Open Instrument Local Provider Smoke v0.2 Runbook

Status: preparation only.
Scope: local smoke path definition only.
Default provider remains `mock`.

## Purpose

This runbook defines how to run the Open Instrument local-provider smoke for v0.2 after the prompt path has been wired for explicit `vowelPath`.

No v0.2 artifact is captured by this document.
No smoke run is performed by this document.

## v0.2 contract

Future v0.2 local smoke captures must use the real prompt path with explicit `vowelPath` requirements:

- JSON only
- top-level object includes `word`, `mode`, `candidates`
- every candidate includes:
  - `form`
  - `language`
  - `opsUsed`
  - `decomposition`
  - `vowelPath`
- `decomposition` includes:
  - `action`
  - `instrument`
  - `unit`
  - `statement`
- `vowelPath` is:
  - present
  - non-empty
  - uppercase only
  - limited to `A`, `E`, `I`, `O`, `U`, `Y`, `Ë`

## Local smoke setup

Use Ollama with the OpenAI-compatible provider path:

- `PROPOSER_PROVIDER=openai_compat`
- `OPENAI_BASE_URL=http://localhost:11434/v1`
- `OPENAI_API_KEY=ollama`
- `OPENAI_MODEL=llama3.1:8b`

Run the local dev server with the normal Open Instrument port for this repo.

## Artifact rule

When v0.2 capture is eventually added, the artifact must:

- use `v0.2.json`
- pass the version-aware archive guard from PR #1150
- preserve `candidateSummary.vowelPath.present` as a required review field

## Compatibility note

- v0.1 artifacts remain valid.
- v0.2 requirements do not retroactively invalidate v0.1 artifacts.
- This runbook does not change the default provider from `mock`.

## Completion definition

This runbook is complete when the prompt path is wired and the v0.2 capture workflow is ready for a future artifact run.
