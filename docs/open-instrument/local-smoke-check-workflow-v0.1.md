# Open Instrument Local Smoke-Check Workflow v0.1

Purpose: define the manual local smoke workflow for checking that Open Instrument still loads and can run a minimal mock-safe readout before any future Open Instrument code work.

This workflow is local/manual only. It is not a scientific eval, not a publication workflow, and not evidence that Open Instrument is production-ready.

Use it when opening the Open Instrument lane, reviewing UI-only changes, or confirming that a branch did not break the local operator surface.

---

## Current Repo-Native Live Smoke (2026-07)

After a PR cluster or meaningful Open Instrument lane close, run the repo-native live smoke in addition to `npm run gate:quick`:

```bash
npm run open-instrument:live-smoke
```

This command is the durable version of the manual DF live-smoke rule. It checks:

- production build;
- `next start` on a local smoke port;
- live `/chat`;
- live `/`;
- real `/api/analyze-v1` calls with lane-correct proof words;
- focused regression proof for the Open Instrument evidence lane.

Current proof words:

| word | expected proof |
|---|---|
| `da` | reviewed DA functional evidence appears because DA is a live RootMap key |
| `dam` | reviewed DA functional evidence appears because DA is a live RootMap key |
| `study` | DI appears as ordinary carrier evidence while reviewed DI runtime projection remains blocked |
| `damage` | reviewed DA evidence does not appear by broad English semantic expansion |
| `xyz` | calm empty/null behavior without reviewed DA or DI projection |

Boundary:

- This smoke does not call an external model provider.
- This smoke does not promote DI.
- This smoke does not add a broad English semantic expansion layer.
- This smoke does not make historical-origin, winner, or language-superiority claims.
- Treat `damage` showing reviewed DA evidence as the current expected contract after bounded DA minRoots emission.

For branch-level debugging, the script supports:

```bash
npm run open-instrument:live-smoke -- --skip-focused-tests
OPEN_INSTRUMENT_LIVE_SMOKE_PORT=3112 npm run open-instrument:live-smoke
```

---

## 1. What This Workflow Checks

This workflow checks that:

- the public preview page loads at `/instrument-preview`;
- the local interactive Open Instrument surface loads at `/chat?debug=1`;
- a minimal word analysis can be exercised through the existing app without live credentials;
- the debug readout exposes enough route and payload state to inspect failures;
- provider/model/base URL behavior is visible or inspectable where the current app exposes it;
- the clean mock proposer path can be checked without live credentials;
- the rejected mock proposer path can be checked without live credentials;
- failures are captured without changing API behavior, scorer behavior, or model-provider behavior.

This workflow does not require a live provider. The normal local path is mock-safe and deterministic.

If a real provider smoke is explicitly needed later, use:

```text
docs/runbooks/open-instrument-real-provider-smoke-v0.1.md
```

Do not turn this local smoke workflow into a real-provider runbook.

---

## 2. Start From A Clean Branch

Run from the repository root:

```bash
git status -sb
git branch --show-current
git log -8 --oneline --decorate
```

Expected:

- working tree is clean before starting;
- branch name matches the PR task;
- recent commits match the expected mainline state.

Stop if the working tree contains unrelated changes.

---

## 3. Start The Local App

Use the normal Next.js dev server:

```bash
npm run dev
```

If another local app, such as VoiceLab, already uses port `3000`, use port `3001`:

```bash
npm run dev -- -p 3001
```

Record the port used in the smoke notes.

---

## 4. Preview Page Smoke

Open the preview page:

```text
http://localhost:3001/instrument-preview
```

Use `http://localhost:3000/instrument-preview` if the dev server is running on port `3000`.

Check:

- the page loads without a browser error;
- the page clearly states preview-only status;
- the page does not imply that the public interactive instrument is live;
- links back to the landing page and `/evals` are visible.

This page is a public preview surface. It is not the interactive local instrument.

---

## 5. Interactive Local Instrument Smoke

Open the local interactive surface with debug enabled:

```text
http://localhost:3001/chat?debug=1
```

Use `http://localhost:3000/chat?debug=1` if the dev server is running on port `3000`.

Before running a word, check:

- the ZË-RO console frame loads;
- `Open Instrument ready` appears;
- the honest contract panel is visible;
- the bottom composer has `Word`, optional `IPA`, and `Analyze` controls.

Run one minimal local check:

```text
word: study
IPA: leave blank
```

Click `Analyze`.

Expected after analysis:

- the Open Instrument shell renders;
- the readout shows `word=study`;
- normalized form and voice path fields render;
- section tabs are visible, including Overview, Evidence, Candidates, Roots / Meaning, and Advanced;
- the debug telemetry panel is visible because `debug=1` is set;
- no raw object is rendered directly into the UI;
- no origin proof or single-winner claim is implied.

---

## 6. Mock-Safe API Probe

Use this only as a local route check. It does not replace the browser smoke.

```bash
curl -s "http://localhost:3001/api/analyze-v1?word=study&mode=strict" | jq '{
  word: .word,
  engineVersion: .engineVersion,
  heartPresent: (.heart != null),
  candidates: ((.candidates // []) | length)
}'
```

Use port `3000` if that is where the dev server is running.

Expected:

- the command returns JSON;
- no live provider key is needed;
- the response is enough to confirm the local analyze route is reachable.

Do not treat this response as scientific evidence.

---

## 7. Provider / Model / Base URL Visibility

Open Instrument has a separate optional proposer diagnostic in the Advanced section after a word has been analyzed.

For this local smoke workflow:

- start with provider `mock`;
- confirm the Advanced proposer card shows provider state when visible;
- use `mock_reject_ops` only for the rejected-case smoke below;
- do not enter a real provider unless the task explicitly scopes a real-provider smoke;
- do not record API keys in notes, screenshots, console output, docs, or git history.

The local mock providers are:

| provider | purpose | network/secrets |
|---|---|---|
| `mock` | clean proposer path | none |
| `mock_reject_ops` | rejected proposer path with deterministic `OPS_ALLOWED` failure | none |

Real-provider configuration uses:

- `PROPOSER_PROVIDER`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`

The default local smoke passes without these variables.

---

## 8. Optional Mock Rejected-Proposal Smoke

Use this after the clean `mock` path when the task touches rejected proposals, repair hints, proposer diagnostics, or oracle status labels.

This smoke is still local and mock-safe. It does not use a live model, API key, Ollama, OpenAI, Groq, DeepSeek, or any external provider.

Open:

```text
http://localhost:3001/chat?debug=1
```

Use port `3000` if that is where the dev server is running.

Run:

```text
word: study
IPA: leave blank
```

Click `Analyze`.

Then open:

```text
Advanced → Propose with Engine Oracle
```

Change provider from:

```text
mock
```

to:

```text
mock_reject_ops
```

Click:

```text
Run oracle proposal
```

Expected UI result:

- status shows `ok`;
- status separates proposal and claim verification:
  - `proposal=fail`;
  - `claim=pass`;
- provider shows `mock_reject_ops`;
- `Rejected proposals` panel appears;
- rejected count is `rejected=1`;
- rejected candidate language is `English`;
- rejected candidate form is `study`;
- extracted path is `U → I`;
- failed check is `OPS_ALLOWED`;
- reason is `Illegal opsUsed token(s): E_INSERT_NOT_ALLOWED`;
- repair hint appears:
  - `Repair: remove illegal opsUsed entries or replace them with allowed operation IDs. If unsure, use an empty opsUsed array.`

Expected copied rejected diagnostics:

Click:

```text
Copy rejected diagnostics
```

The copied JSON should include:

```json
{
  "diagnostic": "open-instrument.rejected-proposals.v0.1",
  "word": "study",
  "mode": "strict",
  "provider": "mock_reject_ops",
  "rejectedCount": 1,
  "message": "Verifier-rejected proposals emitted.",
  "rejectedProposals": [
    {
      "form": "study",
      "language": "English",
      "extractedVowelPath": ["U", "I"],
      "failedChecks": [
        {
          "id": "OPS_ALLOWED",
          "reason": "Illegal opsUsed token(s): E_INSERT_NOT_ALLOWED",
          "repairHint": "Repair: remove illegal opsUsed entries or replace them with allowed operation IDs. If unsure, use an empty opsUsed array."
        }
      ]
    }
  ]
}
```

Completion definition for this optional smoke:

- clean `mock` path still passes;
- `mock_reject_ops` path produces a deterministic proposal failure;
- rejected proposal details are visible;
- repair hint is visible;
- proposal and claim statuses are not collapsed into one ambiguous verifier label;
- no live credentials are used.


---

## 9. Do Not Proceed Conditions

Stop before claiming a successful smoke if:

- required local env vars are missing for a task that explicitly requires a real provider;
- `/instrument-preview` fails to load;
- `/chat?debug=1` fails to load;
- the `Analyze` flow fails before rendering a structured Open Instrument readout;
- provider/base URL behavior is unclear;
- `mock_reject_ops` does not produce `proposal=fail` and `claim=pass` when rejected-path smoke is required;
- the smoke would require live credentials that are not available locally;
- the browser shows a network, hydration, or raw-object rendering failure;
- the route response prints secrets or unstable provider metadata.

Record the failure message and stop. Do not patch around the failure unless a separate engineering task is selected.

---

## 10. Evidence To Record

Record enough information for a future operator to understand the smoke result:

- branch name;
- HEAD commit;
- local port used;
- route checked:
  - `/instrument-preview`
  - `/chat?debug=1`
  - optional `/api/analyze-v1?word=study&mode=strict`
- command outputs for:
  - `git status -sb`
  - `npm run gate:quick`
  - `npm run build`
  - `npm audit --audit-level=moderate`
- whether live credentials were used;
- whether the clean `mock` proposer path passed;
- whether the optional `mock_reject_ops` rejected proposer path passed, if relevant;
- any observed browser or terminal failure message.

If live credentials were used under a separate task, record only that live credentials were used. Do not record the key or any secret-bearing request details.

---

## 11. Required Gates Before PR

Before opening an Open Instrument docs or code PR, run:

```bash
npm run gate:quick
npm run build
npm audit --audit-level=moderate
```

For docs-only changes, also verify the diff:

```bash
git diff --name-only origin/main...HEAD
```

Expected for this workflow PR:

- this workflow doc;
- optionally one workflow-index link.

---

## 12. Boundary

This workflow does not authorize:

- API changes;
- real model-provider changes;
- scorer changes;
- Evals-lane work;
- VoiceLab work;
- publication action;
- token JSON changes;
- evidence ZIP changes;
- package changes;
- test changes unless docs lint explicitly requires them.

Keep this workflow as an operator smoke path. If a real-provider smoke is needed, use the existing real-provider smoke runbook and keep it under a separately selected task.
