# Evals Battery Operator Runbook v0.1

Status: active
Owner: Sokol + DF
Scope: fresh-chat and same-thread eval execution across 5 AI systems
Purpose: make the battery repeatable, publication-ready, and easy to execute without ambiguity

---

## Goal

Run the ZË-RO eval battery consistently across 5 AI systems in two conditions:
1. fresh-chat
2. same-thread

Save exported evidence in a stable structure that can later support LingBuzz publication and public beta credibility.

---

## Models in scope

Use exactly 5 systems unless the milestone is updated:
- OpenAI
- Anthropic
- Google
- xAI
- DeepSeek

Record actual provider/model strings exactly as used in the eval UI.

---

## Core rules

- Use `/evals` as scorer only
- Do not let `/evals` call models
- Paste model output exactly as returned
- Do not hand-edit bucket contents before scoring
- Always export bundle + PDF after each scored run
- Keep naming stable across all runs
- Record whether the run was fresh-chat or same-thread in the `label`
- Save evidence immediately after each run

---

## Test matrix

You are running two conditions across five models.

### Condition A — fresh-chat
Definition:
Each run is executed in a new clean conversation with no prior battery context.

Target:
Measure baseline behavior without thread anchoring.

### Condition B — same-thread
Definition:
All repeated runs for a model occur in one continuing thread where prior results are visible to that model.

Target:
Measure anchoring, adaptation, and drift under conversational carryover.

---

## Required eval task

Use:
- `T2_LADDER_V0_1 — Full Ladder — V1..V7`

Input mode:
- `Buckets only (wrap into a run)`

Do not switch tasks unless the milestone doc is updated.

---

## Required metadata conventions

### provider
Use provider family only, lowercase if possible.
Examples:
- `openai`
- `anthropic`
- `google`
- `xai`
- `deepseek`

### model
Use a stable exact model label.
Examples:
- `chatgpt52thinking`
- `claude46sonnetextended`
- `gemini3thinking`
- `grokexpert`
- `deepthinking`

Use the actual label you want preserved in evidence and keep it consistent.

### label
Use condition + run ordinal.
Examples:
- `fresh-chat.r01`
- `fresh-chat.r02`
- `same-thread.r01`
- `same-thread.r02`

### runId
Use a stable machine-readable shape.

Recommended pattern:
`battery.v0.1.<provider>.<model>.<condition>.rNN`

Examples:
- `battery.v0.1.openai.chatgpt52thinking.fresh-chat.r01`
- `battery.v0.1.openai.chatgpt52thinking.same-thread.r01`
- `battery.v0.1.anthropic.claude46sonnetextended.fresh-chat.r01`

---

## Folder conventions

Store outputs under a stable validation folder layout.

Recommended root:
- `tests/validation/out/evals.battery.<window>/`

Examples:
- `tests/validation/out/evals.battery.2026-03/`
- `tests/validation/out/evals.battery.2026-03-samethread/`

Inside each root:
- `<provider>.<model>/SUMMARY.md`
- `<provider>.<model>/bundles/`
- `<provider>.<model>/pdf/`
- `<provider>.<model>/raw/`

Suggested file naming:
- `r01.bundle.json`
- `r01.report.pdf`
- `r01.prompt.txt`
- `r01.model-output.json`
- `r01.notes.md`

---

## Per-run operator procedure

For each run:

1. Open the target AI chat condition
2. Paste the locked ladder task prompt
3. Receive model output
4. Verify output is bucket JSON V1..V7
5. Open `/evals`
6. Select `Buckets only (wrap into a run)`
7. Confirm task is `T2_LADDER_V0_1`
8. Fill metadata:
   - runId
   - provider
   - model
   - label
9. Leave `sourceEngine*` blank for external model outputs
10. Paste bucket JSON
11. Score run
12. Export:
   - Bundle
   - PDF
13. Save raw model output
14. Save any run notes immediately

---

## Same-thread procedure

For same-thread runs:

- Stay inside one continuing conversation per model
- After each scored run, paste back the scored summary or key result if that is part of the experiment design
- Keep the same `provider` and `model`
- Increment only:
  - `label`
  - `runId`

Examples:
- `same-thread.r01`
- `same-thread.r02`
- `same-thread.r03`

Be explicit in notes about what prior result context the model could see.

---

## Fresh-chat procedure

For fresh-chat runs:

- Open a completely new conversation per run
- Do not paste prior scores or prior run outputs
- Use the identical task prompt each time
- Keep metadata naming aligned with run ordinal

Examples:
- `fresh-chat.r01`
- `fresh-chat.r02`
- `fresh-chat.r03`

---

## Per-model completion checklist

For each provider/model pair:
- [ ] fresh-chat run series completed
- [ ] same-thread run series completed
- [ ] all bundles exported
- [ ] all PDFs exported
- [ ] raw outputs saved
- [ ] summaries written
- [ ] naming conventions consistent
- [ ] no missing run IDs
- [ ] no manual edits to model output before scoring

---

## Evidence checklist for publication

Before LingBuzz packaging:
- [ ] each run has bundle
- [ ] each run has PDF
- [ ] each run has raw model output
- [ ] each run has metadata filled
- [ ] each run condition is obvious from label/runId
- [ ] summary tables are consistent across models
- [ ] screenshots are optional, not primary evidence
- [ ] claims are backed by exported scorer artifacts

---

## Reporting outputs to prepare

At minimum prepare:
- per-model summary
- cross-model fresh-chat summary
- cross-model same-thread summary
- comparison note: fresh-chat vs same-thread
- release appendix artifact list

---

## Failure handling

If a model returns invalid JSON:
- save the raw output anyway
- do not silently repair it
- note failure mode
- optionally rerun as a new ordinal if the protocol allows

If `/evals` reports invalid input:
- save the failed raw output
- record why it failed
- do not overwrite the original artifact

---

## Notes for public beta readiness

These operator runs are not just research artifacts.
They also prove:
- `/evals` is understandable
- `/evals` is stable
- exported evidence is credible
- the public beta is worth sharing

---

## Definition of done

This runbook is complete when another operator could execute the full 5-model battery without asking:
- what to name runs
- where to save outputs
- how to distinguish fresh-chat from same-thread
- what to export
- what counts as sufficient evidence
