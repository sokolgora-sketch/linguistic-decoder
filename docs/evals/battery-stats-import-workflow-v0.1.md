# Battery stats import workflow v0.1

This document defines the repeatable workflow for importing artifact-backed Battery stats into the ZË-RO registry.

Core chain:

```text
Evidence ZIP -> runs/<runId>/report.json -> inspect pack -> generate seriesStats -> review values -> patch registry -> update manifest -> test -> PR
```

Rules:

- Do not manually invent registry stats.
- Do not round registry values.
- Do not collapse four runs into one p-value.
- Registry values stay full precision.
- UI display may round values for readability.

---

## 1. Preconditions

A Battery evidence pack is import-ready only when:

- The ZIP is a fresh export from the current Evals app.
- The ZIP contains runs/<runId>/report.json artifacts.
- npm run battery:inspect-pack returns the expected runCount.
- Every expected run has hasStats: true.
- Every expected run has a runs/<runId>/report.json source path.
- The series label matches the Battery registry case.
- Any duplicate-export suffix, such as (1), is documented in the manifest.

If inspection returns runCount: 0, stop and re-export a fresh series evidence pack.

---

## 2. Inspect the evidence pack

Run from the repository root:

```bash
ZIP="/absolute/path/to/evals.series-evidence-pack.<series>.v0.1.zip"
npm run battery:inspect-pack -- --zip "$ZIP" --series-label "<series-label>"
```

Expected four-run pattern:

- intended main
- intended alt
- control main
- control alt

Do not proceed until the run roles are clear.

---

## 3. Generate the registry block

The generator prints a reviewable seriesStats block and does not edit files.

```bash
npm run battery:generate-series-stats -- \
  --zip "$ZIP" \
  --case-id "<case-id>" \
  --inspected-manifest-path "docs/evals/inspected-battery-packs-v0.1.md" \
  --intended-main-run-id "<run-id>" \
  --intended-alt-run-id "<run-id>" \
  --control-main-run-id "<run-id>" \
  --control-alt-run-id "<run-id>" \
  | tee /tmp/<case-id>.seriesStats.generated.ts
```

Review the generated block before patching the registry.

---

## 4. Patch the registry

Patch only the intended Battery case in src/lib/battery/batteryRegistry.v0.1.ts.

Registry rules:

- Add seriesStats.
- Preserve intended/control separately.
- Preserve main/alt separately.
- Remove placeholder mainPairStats/controlPairStats for that case.
- Keep raw numeric values full precision.
- Keep report.json source paths in notes.

Required source-path pattern:

- role:intended-main; source:runs/<runId>/report.json
- role:intended-alt; source:runs/<runId>/report.json
- role:control-main; source:runs/<runId>/report.json
- role:control-alt; source:runs/<runId>/report.json

---

## 5. Update inspected-pack manifest

Update docs/evals/inspected-battery-packs-v0.1.md with:

- caseId
- displayName
- seriesLabel
- inspected ZIP filename
- canonical registry filename
- inspector command
- inspector result
- runCount
- four run IDs
- p-values
- effect sizes
- normalized-position CI values
- report.json source paths
- import readiness status

Imported packs use:

```text
Status: imported-into-registry
```

---

## 6. Tests before commit

Focused tests:

```bash
npm test -- tests/battery/batteryRegistry.v0.1.spec.ts tests/ui/battery/BatteryCasePage.v0.1.spec.tsx
```

If imported/pending counts change:

```bash
npm test -- tests/ui/battery/BatteryIndexTable.v0.1.spec.tsx tests/ui/battery/BatteryPage.v0.1.spec.tsx
```

Full gates:

```bash
npm run gate:quick
npm run build
```

No PR without green gates.

---

## Current imported cases

As of PR #925:

Imported:

- fi-ae — Finnish ä
- et-ae — Estonian ä

Pending:

- de-oe — German ö
- da-oe — Danish ø
- pt-aa — Portuguese â
- sv-oe — Swedish ö
- no-oe — Norwegian ø
- fr-euoe — French /ø~œ/
- tr-ii — Turkish ı
