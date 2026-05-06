# ZË-RO Cohort Battery Workflow v0.1

Purpose: preserve the exact working method used to run, score, export, package, publish, and document a ZË-RO vowel-bracket cohort battery.

This is an operator workflow.

It is different from the reproduction runbook:

- this workflow explains how to create a cohort battery from scratch;
- the reproduction runbook explains how an outside reader verifies a finished public archive.

Current public reference example:

- Cohort: Cohort 01
- Paper: Seven-Primal-Vowel Bracket Testing: Cohort 01 Evidence Across Ten Languages
- LingBuzz: https://ling.auf.net/lingbuzz/009966
- Evidence archive: https://doi.org/10.5281/zenodo.20047120
- Repository paper: docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md
- Reproduction runbook: docs/papers/zero-cohort-01-reproduction-runbook-v0.1.md

---

## 1. Cohort battery principle

A cohort battery is not one run.

A proper vowel-bracket cohort is a controlled set of language/vowel cases where each case is tested through repeated T5 intermediate-vowel runs.

The minimum useful case structure is:

1. candidate main
2. candidate alt
3. control main
4. control alt

The candidate runs test the proposed bracket.

The control runs test a plausible alternative bracket.

This matters because a single INTERMEDIATE result is not enough. The evidence comes from comparing candidate behavior against control behavior.

---

## 2. Standard four-run case structure

For each language/vowel case, use this run structure:

| Ordinal | Role | Meaning |
|---:|---|---|
| 1 | candidate main | First run for proposed bracket |
| 2 | candidate alt | Alternate token set for proposed bracket |
| 3 | control main | First run for comparison bracket |
| 4 | control alt | Alternate token set for comparison bracket |

Example:

| Ordinal | Role | Example runId |
|---:|---|---|
| 1 | candidate main | t5.no.oe.v1-v3.refine.main.r01 |
| 2 | candidate alt | t5.no.oe.v1-v3.refine.alt.r02 |
| 3 | control main | t5.no.oe.v2-v5.refine.ctrl.r03 |
| 4 | control alt | t5.no.oe.v2-v5.refine.ctrl-alt.r04 |

Rules:

- Never mix candidate and control labels.
- Never reuse a runId.
- Never silently replace tokens after scoring.
- If a token set has an error, fix it before scoring and keep the corrected set as the source of truth.
- If a scored run was based on a bad token set, mark it invalid and rerun with a new runId.

---

## 3. Naming convention

Use stable names before scoring.

### Series label

Pattern:

    t5-<language>-<vowel-code>-<candidate-bracket>-<case-kind>-v0.1

Examples:

    t5-no-oe-v1-v3-refine-v0.1
    t5-da-oe-v1-v3-refine-v0.1
    t5-fr-euoe-v5-v7-refine-v0.1
    t5-tr-ii-wide-sweep-v0.1
    t5-ro-a-breve-v3-v4-core-v0.1

### Run ID

Pattern:

    t5.<language>.<vowel-code>.<bracket>.<case-kind>.<role>.rNN

Examples:

    t5.no.oe.v1-v3.refine.main.r01
    t5.no.oe.v1-v3.refine.alt.r02
    t5.no.oe.v2-v5.refine.ctrl.r03
    t5.no.oe.v2-v5.refine.ctrl-alt.r04

### Label

Pattern:

    <language>-<vowel-code>-<bracket>-<case-kind>-<role>-rNN

Example:

    no-oe-v1-v3-refine-main-r01

---

## 4. Standard UI setup

Run local app:

    cd "$HOME/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export" || exit 1
    npm run dev -- --hostname 0.0.0.0 --port 3001

Open:

    http://localhost:3001/evals

Use the `/evals` page for all scoring.

Do not score cohort runs from memory or from chat alone. The final scored result must come from the app.

---

## 5. Evals page fields to fill

For each run, fill the workbench like this.

### Input mode

Use:

    Raw task JSON / wrap into run

The payload pasted into the JSON box should be a single T5 task JSON.

Do not paste only this shape:

    {
      "anchor_low": [],
      "x_vowel": [],
      "anchor_high": []
    }

That shape is only a bucket fragment. The app needs the T5 task wrapper.

### Task

Use:

    T5_INTERMEDIATE_V0_1

### Run metadata

Fill:

    runId: <exact runId>
    provider: manual
    model: hand-curated
    label: <exact label>

For a public cohort using external/manual token curation, use the agreed curation provenance fields.

Cohort 01 published provenance convention:

    sourceEngineId: external-llm-curation
    sourceEngineVersion: t5-battery-2026-05-chatgpt-assisted-v0.1
    sourceEngineBuild: 6ef31a5

For future cohorts:

    sourceEngineId: external-llm-curation
    sourceEngineVersion: t5-battery-YYYY-MM-<curation-method>-v0.1
    sourceEngineBuild: <repo commit used when scoring/exporting>

Important:

- sourceEngineBuild should be the repo commit used during scoring/exporting.
- Do not rewrite sourceEngineBuild later to a publication commit.
- If the run came from the live ZË-RO API, use the live API provenance instead.
- Do not pretend external/manual curation came from analyze-v1.

---

## 6. T5 intermediate JSON shape

Every run uses this task shape:

    {
      "taskId": "T5_INTERMEDIATE_V0_1",
      "inputShape": "intermediate_triple",
      "languageHint": "<language-code>",
      "vowelUnderTest": "<vowel-or-vowel-family>",
      "anchorLow": "Vx",
      "anchorHigh": "Vy",
      "buckets": {
        "anchor_low": [
          "token1",
          "token2"
        ],
        "x_vowel": [
          "token1",
          "token2"
        ],
        "anchor_high": [
          "token1",
          "token2"
        ]
      }
    }

Cohort 01 usually used 30 tokens per bucket.

Minimum rules:

- each token must be a single orthographic token;
- no spaces;
- no punctuation unless the language/vowel case absolutely requires it;
- no duplicates inside a bucket;
- no duplicates across buckets;
- preserve the target vowel character;
- use real words where the language allows it;
- keep anchor buckets clean and contrastive;
- keep candidate and alt token sets related but not identical.

---

## 7. Token curation workflow

Use an external assistant only to generate candidate token buckets.

Then the researcher reviews them manually.

Prompt family:

    Return STRICT JSON only. No prose. No markdown fence.

    Generate 30 single-token words for each of the following buckets:
    anchor_low, x_vowel, anchor_high.

    Language: <language>
    Vowel under test: <vowel>
    Candidate bracket: <Vx-Vy>
    Role: <main|alt|control|control-alt>

    Rules:
    - each entry must be a single orthographic token;
    - no spaces;
    - no punctuation;
    - no duplicates within or across buckets;
    - anchor_low should represent the lower-side anchor;
    - x_vowel should contain clear examples of the vowel under test;
    - anchor_high should represent the higher-side anchor;
    - return JSON only.

Manual review checklist:

1. Check bucket lengths.
2. Check all tokens are single-token strings.
3. Check no spaces.
4. Check no punctuation unless intentionally part of the orthography.
5. Check no duplicates.
6. Check x_vowel really contains the target vowel.
7. Check anchor buckets do not accidentally contain the target vowel.
8. Check language is correct.
9. Check obvious malformed words.
10. Save the corrected task JSON before scoring.

Never “mentally replace” a duplicate after scoring. If a duplicate is found, create corrected JSON first, then score the corrected JSON.

---

## 8. Scoring sequence in `/evals`

For each run:

1. Fill run metadata.
2. Fill provenance metadata.
3. Paste the T5 task JSON.
4. Click Score run.
5. Confirm a report appears.
6. Inspect:
   - verdict
   - normalizedPosition
   - gap_low
   - gap_high
   - diagnosticFlags
   - mean_anchor_low
   - mean_x_vowel
   - mean_anchor_high
7. Save the run.
8. Add it to the active series if not already attached.
9. Click Save + Next Run.
10. Move to the next ordinal.

Do not export the series evidence pack until all four ordinals are scored and saved.

---

## 9. Series assembly

For each case, create or maintain a four-run series.

Series must contain:

| Ordinal | Required |
|---:|---|
| 1 | candidate main |
| 2 | candidate alt |
| 3 | control main |
| 4 | control alt |

Before export, inspect active series status:

- expected run count: 4
- all runs scored
- no duplicate runIds
- ordinals are 1, 2, 3, 4
- candidate/control roles are correct
- provider/model/label/sourceEngine metadata present and consistent
- no accidental stale saved run loaded

If ordinals are wrong, fix before export.

---

## 10. Evidence pack export

For a complete four-run series, export the series evidence pack from `/evals`.

Expected file pattern:

    evals.series-evidence-pack.<series-label>.v0.1.zip

A complete series evidence pack should contain:

- 01_RUN_INDEX.md
- series-summary.csv
- series-summary.md
- runs/<runId>/input.json
- runs/<runId>/report.json
- runs/<runId>/report.md
- runs/<runId>/report.pdf
- runs/<runId>/workbook.xlsx
- runs/<runId>/summary.csv
- runs/<runId>/notes.md

Do not rely only on screenshots.

The evidence pack ZIP is the source of truth.

---

## 11. Evidence pack inspection

After export, inspect the ZIP.

Example:

    ZIP="$HOME/Downloads/evals.series-evidence-pack.t5-no-oe-v1-v3-refine-v0.1.v0.1.zip"

    unzip -l "$ZIP" | sed -n '1,120p'
    unzip -p "$ZIP" 01_RUN_INDEX.md | sed -n '1,180p'
    unzip -p "$ZIP" series-summary.csv | sed -n '1,80p'

Check:

- all four run folders exist;
- every run has input.json;
- every run has report.json;
- every run has report.md;
- every run has report.pdf;
- every run has workbook.xlsx;
- series-summary.csv has four rows;
- ordinal order is correct;
- verdicts and flags match what was seen in UI.

Optional battery inspector:

    npm run battery:inspect-pack -- --zip "$ZIP" --series-label "<series-label>"

Use this before importing any stats into `src/lib/battery/batteryRegistry.v0.1.ts`.

---

## 12. Local evidence storage

For Cohort 01, evidence was organized outside the repo before public packaging.

Pattern:

    $HOME/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /Final Paper Cohort 01 /

Recommended structure for future cohorts:

    FINAL paper evidence/
      Final Paper Cohort NN/
        Evals-Series-Evidence/
        Public-Archive/
        Papers Writings/

Store raw exported evidence packs in:

    Evals-Series-Evidence/

Store public archive staging in:

    Public-Archive/zero-cohort-NN-evidence-v0.1/

Store paper drafts, PDF, and metadata in:

    Papers Writings/

---

## 13. Public archive packaging

A public archive should include:

    zero-cohort-NN-evidence-v0.1/
      README.md
      COHORT_NN_EVIDENCE_MANIFEST.md
      SHA256SUMS.txt
      paper/
        zero-cohort-NN-vowel-bracket-battery-v0.1.md
        zero-cohort-NN-vowel-bracket-battery-v0.1.pdf
      evidence-packs/
        evals.series-evidence-pack....zip

After staging:

    cd "<Public-Archive parent>"
    shasum -a 256 zero-cohort-NN-evidence-v0.1/evidence-packs/*.zip
    find zero-cohort-NN-evidence-v0.1 -type f | sort
    zip -r zero-cohort-NN-evidence-v0.1.zip zero-cohort-NN-evidence-v0.1
    shasum -a 256 zero-cohort-NN-evidence-v0.1.zip > zero-cohort-NN-evidence-v0.1.zip.sha256
    unzip -t zero-cohort-NN-evidence-v0.1.zip

Never publish a ZIP without:

- top-level checksum;
- internal checksums;
- evidence manifest;
- paper copy;
- exact evidence packs.

---

## 14. Repo paper workflow

Paper markdown goes in:

    docs/papers/

For Cohort 01:

    docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md

Before committing paper:

1. Save markdown into repo.
2. Confirm line count.
3. Confirm key anchors:
   - title
   - abstract
   - methodology
   - evidence availability
   - appendix token protocol
4. Run:
   - npm run gate:quick
   - npm run build
5. Commit on docs branch.
6. Push.
7. Create PR.
8. Run pre-merge gates.
9. Merge.
10. Sync main.

---

## 15. DOI workflow

After the evidence archive is uploaded to Zenodo:

1. Copy the DOI.
2. Patch the paper markdown:
   - Evidence archive: https://doi.org/...
3. Commit DOI update in a separate PR.
4. Merge.
5. Sync main.
6. Do not modify the public archive unless creating a formal new version.

Cohort 01 DOI:

    https://doi.org/10.5281/zenodo.20047120

---

## 16. PDF workflow

The final PDF can be generated from the repo paper markdown.

Cohort 01 local final PDF:

    zero-cohort-01-vowel-bracket-battery-v0.1.final.pdf

Rules:

- visually inspect before submission;
- section headings should not be stranded at page bottoms;
- preserve paper text;
- do not rephrase scientific claims only for visual polish;
- keep the Markdown source as the repo source of truth.

---

## 17. LingBuzz workflow

After the final PDF is ready:

1. Log into LingBuzz.
2. Choose publish paper.
3. Fill title, author, date, domains, keywords, abstract.
4. Upload final PDF.
5. Confirm author identity if LingBuzz asks.
6. Publish.
7. Record the LingBuzz reference.
8. Patch repo README and paper markdown with:
   - LingBuzz reference
   - LingBuzz URL
   - published status
9. Commit/PR/merge.
10. Public-link sanity check.

Cohort 01 LingBuzz reference:

    lingbuzz/009966

Cohort 01 LingBuzz URL:

    https://ling.auf.net/lingbuzz/009966

---

## 18. Public-link sanity check

After final publication/reference merge:

Run local sync:

    git switch main
    git pull --ff-only origin main
    git status -sb
    git log -1 --oneline

Check public raw files:

    curl -L "https://raw.githubusercontent.com/sokolgora-sketch/linguistic-decoder/main/README.md" \
      | rg -n "009966|zenodo.20047120|zero-cohort-01-reproduction-runbook|zero-cohort-01-vowel-bracket-battery"

    curl -L "https://raw.githubusercontent.com/sokolgora-sketch/linguistic-decoder/main/docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md" \
      | rg -n "LingBuzz reference|009966|LingBuzz URL|Evidence archive|zenodo.20047120"

    curl -L "https://raw.githubusercontent.com/sokolgora-sketch/linguistic-decoder/main/docs/papers/zero-cohort-01-reproduction-runbook-v0.1.md" \
      | rg -n "Reproduction Runbook|zenodo.20047120|c1e383e|16 canonical|a65e2b2e"

Open manually in browser:

    https://ling.auf.net/lingbuzz/009966
    https://doi.org/10.5281/zenodo.20047120
    https://github.com/sokolgora-sketch/linguistic-decoder

If all open, stop touching the cohort unless a real public error is found.

---

## 19. Cohort 01 canonical evidence packs

Cohort 01 used ten languages and sixteen evidence packs.

Canonical pack list:

1. evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip
2. evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1 (2).zip
3. evals.series-evidence-pack.t5-fr-euoe-v2-v5-exp-v0.2.v0.1 (4).zip
4. evals.series-evidence-pack.t5-fr-euoe-v5-v7-refine-v0.1.v0.1 (1).zip
5. evals.series-evidence-pack.t5-no-oe-v2-v5-exp-v0.2.v0.1 (4).zip
6. evals.series-evidence-pack.t5-no-oe-v1-v3-refine-v0.1.v0.1 (1).zip
7. evals.series-evidence-pack.t5-da-oe-v1-v3-refine-v0.1.v0.1 (1).zip
8. evals.series-evidence-pack.t5-sv-oe-v2-v5-exp-v0.2.v0.1 (3).zip
9. evals.series-evidence-pack.t5-sv-oe-v1-v3-refine-v0.1.v0.1 (1).zip
10. evals.series-evidence-pack.t5-de-oe-v2-v4-refine-v0.1.v0.1 (1).zip
11. evals.series-evidence-pack.t5-pt-aa-v1-v4-core-v0.2.v0.1 (2).zip
12. evals.series-evidence-pack.t5-pt-aa-v1-v5-refine-v0.1.v0.1 (1).zip
13. evals.series-evidence-pack.t5-tr-ii-v6-v7-core-v0.2.v0.1 (2).zip
14. evals.series-evidence-pack.t5-tr-ii-v6-v7-audit-v0.1.v0.1 (1).zip
15. evals.series-evidence-pack.t5-tr-ii-wide-sweep-v0.1.v0.1 (1).zip
16. evals.series-evidence-pack.t5-ro-a-breve-v3-v4-core-v0.1.v0.1 (1).zip

---

## 20. Cohort 01 scientific interpretation categories

Use these categories for future cohort summaries:

| Category | Meaning |
|---|---|
| Strong refinement support | Candidate bracket stabilizes cleanly and comparison bracket fails |
| Provisional support | Candidate bracket performs better but has boundary stress or weak separation |
| Weak / bridge | Candidate and comparison both partially work or separation is weak |
| Pressure / unresolved | Candidate bracket fails or remains unstable under audits/refinements |

Cohort 01 final categories:

Strong refinement:

- Norwegian /ø/
- Danish /ø/

High-edge refinement:

- French /ø~œ/

Edge-stressed support:

- Estonian /ä/
- Finnish /ä/
- Portuguese /â/

Weak / bridging:

- Swedish /ö/
- German /ö/

Pressure / unresolved:

- Turkish /ı/
- Romanian /ă/

---

## 21. New-chat sync protocol

When opening a new chat for a future cohort, paste this minimum sync:

    We are working in the ZË-RO repo:
    $HOME/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export

    Use the workflow in:
    docs/evals/cohort-battery-workflow-v0.1.md

    Cohort workflow:
    - four-run T5 intermediate series per language/vowel case;
    - r01 candidate main;
    - r02 candidate alt;
    - r03 control main;
    - r04 control alt;
    - taskId T5_INTERMEDIATE_V0_1;
    - inputShape intermediate_triple;
    - use Raw task JSON / wrap into run in /evals;
    - fill runId/provider/model/label/sourceEngine metadata;
    - score, save, add to series, export series evidence pack;
    - inspect ZIP before using it in paper/archive.

    Do not skip:
    - metadata;
    - run IDs;
    - ordinals;
    - token duplicate checks;
    - evidence-pack export;
    - gate:quick/build before PR.

---

## 22. Completion definition

A cohort workflow is complete only when:

1. all planned cases have scored evidence packs;
2. evidence packs are inspected;
3. paper markdown is repo-tracked;
4. public archive is packaged with checksum;
5. DOI is linked;
6. PDF is generated and inspected;
7. LingBuzz or public paper page is linked;
8. README points to the public chain;
9. reproduction runbook exists;
10. public-link sanity check passes.

