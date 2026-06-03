# Open Instrument Llama Local Provider Ten-Word Smoke Result v0.1
Date: 2026-06-03
Status: internal local provider-quality smoke only.
This document records the ten-word local Open Instrument smoke using Ollama `llama3.1:8b` through the `openai_compat` provider path.
This is not scientific evidence, not publication evidence, not eval evidence, not Cohort evidence, not a general model-quality proof, and not a reason to change the default provider from `mock`.
---
## 1. Purpose
The ten-word smoke run executes the fixed word set defined in:
    docs/open-instrument/llama-local-provider-ten-word-smoke-set-design-v0.1.md
The goal is to test whether the local OpenAI-compatible provider path remains usable across the designed ten-word smoke set.
Tested path:
    Open Instrument → openai_compat → Ollama local → llama3.1:8b → parser → verifier
---
## 2. Archived artifact
Archived JSON artifact:
    docs/open-instrument/artifacts/local-provider-smoke/2026-06-03-open-instrument-local-smoke-ollama-llama3-1-8b-ten-word-v0.1.json
The artifact preserves:
- repo metadata;
- provider metadata;
- local environment summary;
- word set;
- per-run request summary;
- per-run response summary;
- candidate summary;
- verifier summary;
- raw proposer text/API response;
- fail reasons if any;
- redaction status;
- claim boundary.
---
## 3. Run settings
Run settings:
    endpoint: /api/propose-loop
    provider: openai_compat
    runtime: Ollama local
    model: llama3.1:8b
    mode: strict
    maxAttempts: 3
    baseUrl: http://localhost:11434/v1
No paid OpenAI API call was used.
---
## 4. Ten-word set
The smoke used exactly this word set:
- `study`
- `damage`
- `language`
- `philosophy`
- `mathematics`
- `origin`
- `measure`
- `voice`
- `garden`
- `memory`
---
## 5. Result table
| Word | Status | Attempts | Accepted form | Candidate language | Decomposition summary | vowelPath.present |
|---|---:|---:|---|---|---|---:|
| `study` | PASS | 1 | `study` | English | action: to study | false |
| `damage` | PASS | 1 | `damage` | English | action: cause; instrument: force; unit: amount | false |
| `language` | PASS | 1 | `language` | English | action: express; instrument: tongue; unit: word | false |
| `philosophy` | PASS | 1 | `philosophy` | English | action: contemplate; instrument: mind; unit: thought | false |
| `mathematics` | PASS | 1 | `mathematics` | English | action: calculate; instrument: mind; unit: concept | false |
| `origin` | PASS | 1 | `origin` | English | action: derive; instrument: Latin; unit: root | false |
| `measure` | PASS | 1 | `measure` | English | action: to measure; instrument: meter; unit: square meter | false |
| `voice` | PASS | 1 | `voice` | English | action: utter; instrument: larynx; unit: sound | false |
| `garden` | PASS | 1 | `garden` | English | action: cultivate; instrument: hand; unit: yard | false |
| `memory` | PASS | 1 | `memory` | English | action: recall; instrument: mind | false |
---
## 6. Verifier note
Verifier v0.1 can pass `PATH_MATCH` when `vowelPath` is absent.
Therefore this result must be read with the archived field:
    candidateSummary.vowelPath.present
Do not rely only on final PASS/FAIL.
The archived JSON artifact preserves this field for every run.
---
## 7. Interpretation
This smoke supports a limited development reading only.
Allowed interpretation:
- `llama3.1:8b` completed the ten-word local-provider smoke through `openai_compat`;
- the local OpenAI-compatible provider path remained usable for development smoke testing;
- the archived JSON artifact preserves the exact development smoke record.
Not allowed:
- claiming `llama3.1:8b` is scientifically validated;
- claiming `llama3.1:8b` is research-grade;
- treating this as publication evidence;
- treating this as eval evidence;
- treating this as Cohort evidence;
- changing the default provider from `mock`.
---
## 8. Quality boundary
This is still only a local-provider smoke result.
Limitations:
- ten words only;
- no systematic model comparison;
- no manual linguistic adjudication;
- no scoring as eval evidence;
- no publication claim.
Some outputs may be structurally acceptable to the current verifier while still being linguistically thin.
Future interpretation must inspect the archived raw proposer text and verifier checks, not only the summary table.
---
## 9. Current decision
Keep default provider as:
    mock
Keep preferred local Ollama smoke model as:
    llama3.1:8b
Future local-provider smoke work should continue preserving exact JSON artifacts and passing the archive guard before merge.
---
## 10. Completion definition
This result is complete when:
- the exact ten-word smoke was run;
- the JSON artifact was archived;
- the result doc links to the artifact;
- the result table was generated from the artifact;
- `vowelPath.present` was preserved;
- claim boundaries were preserved;
- the archive guard passed;
- local validation passed.
