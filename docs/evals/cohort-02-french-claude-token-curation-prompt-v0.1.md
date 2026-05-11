# Cohort 02 French Claude Token-Curation Prompt v0.1

Status: PROMPT ONLY
Project: ZË-RO
Cohort: Cohort 02 cross-model replication
Target case: French `/ø~œ/`
Source label: `claude-reviewed`
Task: `T5_INTERMEDIATE_V0_1`
Candidate bracket: V5-V7
Control bracket: V2-V5
Series label: `t5-fr-euoe-v5-v7-claude-reviewed-v0.1`

This document defines the source-specific token-curation prompt for Claude-reviewed French `/ø~œ/` cross-model replication.

It does not contain final token buckets. It does not run scoring. It does not create evidence packs. It does not update README, Zenodo, LingBuzz, registry labels, or published claims.

## 1. Purpose

The parent plan selected French `/ø~œ/` as the first cross-model replication target because it was the strongest Cohort 02 support case.

This document prepares the exact prompt to ask Claude for candidate token buckets.

Claude output is not final evidence. The returned tokens must be manually reviewed and trimmed before any `/evals` run.

## 2. Parent plan

Parent plan:

`docs/evals/cohort-02-cross-model-replication-plan-v0.1.md`

Planned case:

- French `/ø~œ/`
- candidate bracket: V5-V7
- control bracket: V2-V5
- task: `T5_INTERMEDIATE_V0_1`

## 3. Planned run IDs

Use these run IDs only after final reviewed tokens are approved:

- `t5.fr.euoe.v5-v7.claude-reviewed.main.r01`
- `t5.fr.euoe.v5-v7.claude-reviewed.alt.r02`
- `t5.fr.euoe.v2-v5.claude-reviewed.ctrl.r03`
- `t5.fr.euoe.v2-v5.claude-reviewed.ctrl-alt.r04`

Do not use vague `crossmodel` labels in saved runs.

## 4. Required `/evals` fields after review

Use only after final buckets are reviewed.

Common fields:

- `evalRunVersion`: `evalRun.v0.1`
- `evalSpecVersion`: `evalSpec.v0.1`
- `taskId`: `T5_INTERMEDIATE_V0_1`
- `inputShape`: `intermediate_triple`
- `languageHint`: `fr`
- `vowelUnderTest`: `ø~œ`
- `provider`: `anthropic`
- `model`: `claude-reviewed`
- `label`: `t5-fr-euoe-v5-v7-claude-reviewed-v0.1`
- `sourceEngineId`: blank
- `sourceEngineVersion`: blank
- `sourceEngineBuild`: blank

Candidate runs:

- `anchorLow`: `V5`
- `anchorHigh`: `V7`

Control runs:

- `anchorLow`: `V2`
- `anchorHigh`: `V5`

## 5. Claude prompt

Paste this into a fresh Claude chat.

```text
Return STRICT JSON only. No prose. No markdown fence.

Goal:
Produce candidate token buckets for a French intermediate-vowel bracket test focused on French /ø~œ/ for the ZË-RO T5_INTERMEDIATE_V0_1 evaluator.

Context:
This is token curation only, not scoring.
The target vowel zone is French front rounded /ø~œ/, usually written with eu or œu/œ in French orthography.
The researcher will manually review and trim your output before any scoring.

Rules:
- Output valid JSON only.
- Each token must be a single French orthographic token.
- No spaces.
- No punctuation.
- No duplicate tokens across any bucket.
- Avoid names, places, brands, abbreviations, acronyms, and rare archaic forms.
- Prefer common French words.
- Keep accents/diacritics where standard French spelling requires them.
- The x_vowel bucket must contain clear French /ø~œ/ words.
- Avoid words where eu/œu is not a good representative of the intended French front-rounded vowel zone.
- anchor_low and anchor_high must be French words without the target eu/œu/œ vowel sequence.
- The buckets must be useful for a contrastive intermediate-vowel test, not a semantic theme list.

Output shape:
{
  "anchor_low": ["..."],
  "x_vowel": ["..."],
  "anchor_high": ["..."]
}

Quantity:
- 14 candidates per bucket.
- The researcher will manually select 10 final tokens per bucket after review.

Self-audit before final JSON:
- Check that all 42 tokens are unique.
- Check that all tokens are single orthographic tokens.
- Check that x_vowel tokens clearly target French /ø~œ/.
- Check that no token contains spaces or punctuation.
- Check that output is valid JSON only.
6. Manual review checklist

After Claude returns candidate buckets, review manually before scoring.

Checklist:

JSON parses.
Exactly three buckets:
anchor_low
x_vowel
anchor_high
Each bucket has 14 candidates before trimming.
Final reviewed bucket must have exactly 10 tokens per bucket.
No duplicates across buckets.
No spaces.
No punctuation.
No names, places, brands, abbreviations, or obscure forms.
x_vowel tokens are valid French /ø~œ/ target words.
anchor_low tokens do not accidentally contain the target vowel sequence.
anchor_high tokens do not accidentally contain the target vowel sequence.
All final tokens are plausible common French words.
7. Final reviewed JSON shape

The final reviewed JSON must use this shape before /evals.

{
  "anchor_low": [],
  "x_vowel": [],
  "anchor_high": []
}

Do not commit the final token JSON in this prompt PR.

8. Evidence preservation after scoring

When scoring is eventually run, preserve:

Claude prompt;
raw Claude output;
manual review notes;
final reviewed JSON;
four run IDs;
/evals metadata;
copied CSV rows;
PDF/markdown reports;
series evidence pack;
checksum file;
interpretation note.
9. Claim boundaries

Allowed after this prompt PR:

A Claude-reviewed token-curation prompt exists.
French /ø~œ/ cross-model replication can proceed to manual token review.

Blocked after this prompt PR:

Claude-reviewed tokens are final.
Cross-model replication succeeded.
French proves the high-edge bracket.
Cohort 02 claims should be upgraded.
README should change.
Registry labels should migrate.
A new Zenodo archive should be created.
10. Completion criteria

This prompt milestone is complete when:

this prompt doc is merged;
no final token JSON is committed;
no scoring has been run;
no evidence pack has been created;
gates pass.
11. Next operational step after merge

After merge:

Paste the prompt into Claude.
Save the raw Claude JSON output locally.
Manually review and trim to 10 tokens per bucket.
Produce a separate reviewed-token JSON task.
Only then run /evals.
