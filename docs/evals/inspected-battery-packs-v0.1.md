# Inspected battery evidence packs v0.1

This document records evidence-pack ZIPs that have been inspected through the local battery stats inspector before any registry numeric stats are imported.

The purpose is traceability:

```text
Evidence ZIP → runs/<runId>/report.json → EvalReportBundle → BatteryBracketStats → inspected manifest → registry import
```

No registry values should be changed from this document alone. Registry imports require a separate PR.

---

## Inspection protocol

Run from the repository root:

```bash
npm run battery:inspect-pack -- --zip "<absolute-path-to-evidence-pack.zip>" --series-label "<series-label>"
```

A pack is considered import-ready only if:

- `runCount` matches the expected number of runs.
- Every expected run has `hasStats: true`.
- Every row has a `runs/<runId>/report.json` source path.
- The inspected series label matches the battery registry series label.
- The ZIP filename matches or is intentionally documented as a duplicate/export copy.

---

## 2026-04-27 — Estonian ä / V1-V3 expansion pack

### Battery case

- caseId: `et-ae`
- displayName: `Estonian ä`
- seriesLabel: `t5-et-ae-v1-v3-exp-v0.2`
- inspected evidenceZipFilename: `evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip`
- canonical registry filename currently recorded as: `evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip`
- note: inspected file is a duplicate/export copy with `(1)` suffix; stats source paths are internal `report.json` artifacts.

### Inspector command

```bash
ZIP="$HOME/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip"

npm run battery:inspect-pack -- --zip "$ZIP" --series-label "t5-et-ae-v1-v3-exp-v0.2"
```

### Inspector result

```text
# Battery Evidence Pack Stats
seriesLabel: t5-et-ae-v1-v3-exp-v0.2
evidenceZipFilename: evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip
runCount: 4

runId	hasStats	pValue	hedgesGLowX	hedgesGXHigh	ci95NormalizedPosition	reportPath
t5.et.ae.v1-v3.exp.alt.r02	true	0.05316666666666667	0.18585610045242854	3.228770024675538	[-0.10315486549358109, 0.1923810142806043]	runs/t5.et.ae.v1-v3.exp.alt.r02/report.json
t5.et.ae.v1-v3.exp.main.r01	true	0.0025833333333333333	0.5545588905459405	3.3788729357208416	[0.01687618549916784, 0.25953006089362474]	runs/t5.et.ae.v1-v3.exp.main.r01/report.json
t5.et.ae.v2-v3.exp.ctrl-alt.r04	true	0.99975	-1.5256813128871087	3.228770024675538	[-1.3543749569648162, -0.49355045311160994]	runs/t5.et.ae.v2-v3.exp.ctrl-alt.r04/report.json
t5.et.ae.v2-v3.exp.ctrl.r03	true	0.9974166666666666	-1.2548084847778591	3.3788729357208416	[-0.9694656488549633, -0.3360955329356846]	runs/t5.et.ae.v2-v3.exp.ctrl.r03/report.json
```

### Interpretation for registry-import planning

Intended bracket: `V1-V3`

- main run: `pValue = 0.0025833333333333333`
- alt run: `pValue = 0.05316666666666667`

Control bracket: `V2-V3`

- control run: `pValue = 0.9974166666666666`
- control-alt run: `pValue = 0.99975`

This supports the current battery interpretation:

- intended bracket carries the signal,
- wrong-bracket controls collapse/fail,
- all four runs are artifact-traceable through `report.json`.

### Import readiness

Status: `imported-into-registry`

Imported by registry-import PR: `feat(battery): import Estonian series stats`.

Registry representation:

- four-run `seriesStats`
- intended/control preserved separately
- main/alt preserved separately
- source paths preserved through `runs/<runId>/report.json`


---

## 2026-04-28 — Finnish ä / V1-V3 core pack

### Battery case

- caseId: `fi-ae`
- displayName: `Finnish ä`
- seriesLabel: `t5-fi-ae-v1-v3-core-v0.2`
- inspected evidenceZipFilename: `evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1 (1).zip`
- canonical registry filename currently recorded as: `evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1.zip`
- note: inspected file is a duplicate/export copy with `(1)` suffix; stats source paths are internal `report.json` artifacts.

### Inspector command

```bash
ZIP="$HOME/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1 (1).zip"

npm run battery:inspect-pack -- --zip "$ZIP" --series-label "t5-fi-ae-v1-v3-core-v0.2"
```

### Inspector result

```text
# Battery Evidence Pack Stats
seriesLabel: t5-fi-ae-v1-v3-core-v0.2
evidenceZipFilename: evals.series-evidence-pack.t5-fi-ae-v1-v3-core-v0.2.v0.1 (1).zip
runCount: 4

runId   hasStats        pValue  hedgesGLowX     hedgesGXHigh    ci95NormalizedPosition  reportPath
t5.fi.ae.v1-v3.core.alt.r02     true    0.02225 0.2358221892385302      2.452306194073692       [-0.11084128960841325, 0.2586216851158711]      runs/t5.fi.ae.v1-v3.core.alt.r02/report.json
t5.fi.ae.v1-v3.core.main.r01    true    0.05383333333333333     0.15786370458162743     2.555873476619985       [-0.14128318043643415, 0.22555698479845424]   runs/t5.fi.ae.v1-v3.core.main.r01/report.json
t5.fi.ae.v2-v3.core.ctrl-alt.r04        true    0.6138333333333333      -0.34312025976015914    2.4047766805732387      [-0.4226173776319394, 0.05906610605618381]    runs/t5.fi.ae.v2-v3.core.ctrl-alt.r04/report.json
t5.fi.ae.v2-v3.core.ctrl.r03    true    0.9251666666666667      -0.7168234910674489     2.555873476619985       [-0.6582400418069919, -0.1005741189322699]    runs/t5.fi.ae.v2-v3.core.ctrl.r03/report.json
```

### Interpretation for registry-import planning

Intended bracket: `V1-V3`

- main run: `pValue = 0.05383333333333333`
- alt run: `pValue = 0.02225`

Control bracket: `V2-V3`

- control run: `pValue = 0.9251666666666667`
- control-alt run: `pValue = 0.6138333333333333`

This supports the current battery interpretation:

- intended bracket carries the signal,
- wrong-bracket controls weaken/collapse relative to the intended pair,
- all four runs are artifact-traceable through `report.json`.

### Import readiness

Status: `imported-into-registry`

Imported by this registry-import PR: `feat(battery): import Finnish series stats`.


---

## 2026-04-29 — German ö / V2-V5 core pack

### Battery case

- caseId: `de-oe`
- displayName: `German ö`
- seriesLabel: `t5-de-oe-v2-v5-core-v0.2`
- inspected evidenceZipFilename: `evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1 (1).zip`
- canonical registry filename currently recorded as: `evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1.zip`
- note: inspected file is a duplicate/export copy with `(1)` suffix; registry keeps canonical filename.

### Inspector result

```text
# Battery Evidence Pack Stats
seriesLabel: t5-de-oe-v2-v5-core-v0.2
evidenceZipFilename: evals.series-evidence-pack.t5-de-oe-v2-v5-core-v0.2.v0.1 (1).zip
runCount: 4

t5.de.oe.v2-v5.core.main.r01    true    0    1.2995551896449504    1.3790991837809656    [0.29774946495452204, 0.6384180790960461]    runs/t5.de.oe.v2-v5.core.main.r01/report.json
t5.de.oe.v2-v5.core.alt.r02     true    0    1.4093058122409403    4.182285217921306     [0.20689655172413862, 0.380000000000001]     runs/t5.de.oe.v2-v5.core.alt.r02/report.json
t5.de.oe.v1-v3.core.ctrl.r03    true    0    2.357960820159967     3.0171932124650485    [0.3350920029286223, 0.49580005555941425]    runs/t5.de.oe.v1-v3.core.ctrl.r03/report.json
t5.de.oe.v1-v3.core.ctrl-alt.r04 true   0    1.6303220871775905    4.349068466504851     [0.19236073332608147, 0.3325242718446611]    runs/t5.de.oe.v1-v3.core.ctrl-alt.r04/report.json
```

### Interpretation for registry-import planning

Status remains `support / weak`.

- intended V2-V5 runs are clean `INTERMEDIATE` with no diagnostic flags.
- control V1-V3 runs are also `INTERMEDIATE` with no diagnostic flags.
- this confirms weak support rather than strong discrimination.
- the existing registry interpretation remains correct: wrong-bracket controls stayed intermediate.

### Import readiness

Status: `imported-into-registry`

Imported by this registry-import PR: `feat(battery): import German series stats`.
