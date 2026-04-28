# Inspected battery evidence packs v0.1

This document records evidence-pack ZIPs that have been inspected through the local battery stats inspector before any registry numeric stats are imported.

The purpose is traceability:

```text
Evidence ZIP → runs/<runId>/report.json → EvalReportBundle → BatteryBracketStats → inspected manifest → registry import

No registry values should be changed from this document alone. Registry imports require a separate PR.

Inspection protocol

Run from the repository root:

npm run battery:inspect-pack -- --zip "<absolute-path-to-evidence-pack.zip>" --series-label "<series-label>"

A pack is considered import-ready only if:

runCount matches the expected number of runs.
every expected run has hasStats: true.
every row has a runs/<runId>/report.json source path.
the inspected series label matches the battery registry series label.
the ZIP filename matches or is intentionally documented as a duplicate/export copy.
2026-04-27 — Estonian ä / V1-V3 expansion pack
Battery case
caseId: et-ae
displayName: Estonian ä
seriesLabel: t5-et-ae-v1-v3-exp-v0.2
evidenceZipFilename: evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip
canonical registry filename currently recorded as: evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1.zip
note: inspected file is a duplicate/export copy with (1) suffix; stats source paths are internal report.json artifacts.
Inspector command
ZIP="$HOME/Desktop/ZËRO /Dwnlosads /FINAL paper evidence /evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip"

npm run battery:inspect-pack -- --zip "$ZIP" --series-label "t5-et-ae-v1-v3-exp-v0.2"
Inspector result
# Battery Evidence Pack Stats
seriesLabel: t5-et-ae-v1-v3-exp-v0.2
evidenceZipFilename: evals.series-evidence-pack.t5-et-ae-v1-v3-exp-v0.2.v0.1 (1).zip
runCount: 4

runId	hasStats	pValue	hedgesGLowX	hedgesGXHigh	ci95NormalizedPosition	reportPath
t5.et.ae.v1-v3.exp.alt.r02	true	0.05316666666666667	0.18585610045242854	3.228770024675538	[-0.10315486549358109, 0.1923810142806043]	runs/t5.et.ae.v1-v3.exp.alt.r02/report.json
t5.et.ae.v1-v3.exp.main.r01	true	0.0025833333333333333	0.5545588905459405	3.3788729357208416	[0.01687618549916784, 0.25953006089362474]	runs/t5.et.ae.v1-v3.exp.main.r01/report.json
t5.et.ae.v2-v3.exp.ctrl-alt.r04	true	0.99975	-1.5256813128871087	3.228770024675538	[-1.3543749569648162, -0.49355045311160994]	runs/t5.et.ae.v2-v3.exp.ctrl-alt.r04/report.json
t5.et.ae.v2-v3.exp.ctrl.r03	true	0.9974166666666666	-1.2548084847778591	3.3788729357208416	[-0.9694656488549633, -0.3360955329356846]	runs/t5.et.ae.v2-v3.exp.ctrl.r03/report.json
Interpretation for registry-import planning
Intended bracket: V1-V3
main run: pValue = 0.0025833333333333333
alt run: pValue = 0.05316666666666667
Control bracket: V2-V3
control run: pValue = 0.9974166666666666
control-alt run: pValue = 0.99975

This supports the current battery interpretation:

intended bracket carries the signal,
wrong-bracket controls collapse/fail,
all four runs are artifact-traceable through report.json.
Import readiness

Status: ready-for-registry-import-planning

Not yet imported into registry.

Required next PR:

decide exact registry representation for four-run series stats,
preserve main and control contrast separately,
avoid collapsing four runs into one vague p-value,
update tests before writing numeric registry values.
