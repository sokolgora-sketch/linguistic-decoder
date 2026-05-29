# ZË-RO Workflow Index

Purpose: stable entrypoint for DF / operator workflows.

When a new chat starts and workflow memory is missing, inspect this file first.

This file does not replace the detailed workflow docs. It points to them and explains when to use each one.

---

## New-chat sync command

Run this from the repo root:

    cd "$HOME/Desktop/ZËRO /Dwnlosads /zero-firebase-studio-export" || exit 1

    echo "=== workflow index ==="
    sed -n '1,220p' docs/process/workflows.md

    echo
    echo "=== available workflow docs ==="
    find docs -type f \( -iname '*workflow*.md' -o -iname '*runbook*.md' -o -iname '*quickstart*.md' \) | sort

    echo
    echo "=== cohort battery workflow anchors ==="
    rg -n "Cohort Battery Workflow|Raw task JSON|T5_INTERMEDIATE_V0_1|external-llm-curation|series evidence pack|Zenodo|LingBuzz|New-chat sync|Completion definition" docs/evals/cohort-battery-workflow-v0.1.md

---

## Core workflows

### 1. Cohort battery workflow

Path:

    docs/evals/cohort-battery-workflow-v0.1.md

Use this when:

- planning Cohort 02 or later;
- running 10-language / multi-language vowel-bracket batteries;
- scoring T5 intermediate-vowel cases in `/evals`;
- exporting series evidence packs;
- packaging Zenodo archives;
- preparing LingBuzz papers;
- opening a new chat and DF needs the exact battery workflow again.

This workflow preserves:

- four-run candidate/control structure;
- runId and series-label naming;
- `/evals` UI fields;
- T5 intermediate JSON shape;
- sourceEngine provenance rules;
- token curation checklist;
- evidence-pack export and inspection;
- public archive packaging;
- DOI / LingBuzz / README publication chain;
- new-chat sync protocol.

Critical anchor:

    taskId: T5_INTERMEDIATE_V0_1
    inputShape: intermediate_triple

Four-run structure:

    r01 candidate main
    r02 candidate alt
    r03 control main
    r04 control alt

---

### 2. Cohort 01 reproduction runbook

Path:

    docs/papers/zero-cohort-01-reproduction-runbook-v0.1.md

Use this when:

- an outside reader wants to verify the published Cohort 01 archive;
- checking Zenodo checksum;
- confirming the 16 canonical evidence packs;
- confirming the public paper/evidence chain.

This is not the operator workflow. It verifies the finished archive.

---

### 3. Evals quickstart

Path:

    docs/evals/quickstart.md

Use this when:

- someone needs a short intro to `/evals`;
- testing a simple BYO output;
- learning how to call the local scoring API.

This is shorter than the cohort battery workflow and does not explain publication packaging.

---

### 4. Evals battery operator runbook

Path:

    docs/runbooks/evals-battery-operator-runbook.v0.1.md

Use this when:

- running provider comparison batteries;
- running fresh-chat vs same-thread tests;
- comparing multiple AI systems.

This is separate from the Cohort vowel-bracket workflow.

---

### 5. Battery stats import workflow

Path:

    docs/evals/battery-stats-import-workflow-v0.1.md

Use this when:

- importing inspected evidence-pack stats into `src/lib/battery/batteryRegistry.v0.1.ts`;
- using `npm run battery:inspect-pack`;
- generating registry-ready stats from evidence ZIPs.

Do not import stats from prose. Use evidence packs only.

---

### 6. Evidence bucket audit workflow

Path:

    docs/evals/evidence-bucket-audit-workflow-v0.1.md

Use this when:

- inspecting Evals evidence ZIP bucket geometry;
- deciding whether an intermediate-triple input should be reviewed before scoring;
- using `npm run evals:audit-buckets`;
- using CLI JSON audit output for durable evidence notes;
- comparing CLI audit output against the `/evals` Bucket geometry check panel.

This workflow preserves:

- the human evidence bucket audit CLI path;
- the machine-readable `--json` audit path;
- the warning meanings for non-10 bucket counts, final target-vowel inflation, and high average target-vowel count;
- the rule that these checks are warning-only and do not alter scorer math.

Do not treat bucket audit output as publication authorization or scientific validation.

---

## DF operating rule

For future repo work:

1. Inspect this workflow index first.
2. Inspect the specific workflow doc second.
3. Then inspect current repo state.
4. Then make changes on a branch.
5. Run gates before PR.
6. After merge, update DF_BRAIN.

---

## Workflow docs currently treated as active

- `docs/process/workflows.md`
- `docs/evals/cohort-battery-workflow-v0.1.md`
- `docs/papers/zero-cohort-01-reproduction-runbook-v0.1.md`
- `docs/evals/quickstart.md`
- `docs/runbooks/evals-battery-operator-runbook.v0.1.md`
- `docs/evals/battery-stats-import-workflow-v0.1.md`
- `docs/evals/evidence-bucket-audit-workflow-v0.1.md`

---

## Update rule

When a workflow changes, update both:

1. the detailed workflow file;
2. this index.

Do not rely on chat memory alone.
