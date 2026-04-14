import ExcelJS from "exceljs/dist/exceljs.min.js";

import type { EvalReportBundleV0_1 } from "@/shared/evals/report.v0.1";

export const EVALS_WORKBOOK_EXPORT_VERSION_V0_1 = "evals.workbookExport.v0.1";

type Cell = string | number | null | undefined;

export type BuildEvalsWorkbookInputV0_1 = {
  report?: EvalReportBundleV0_1 | null;
  md?: string | null;
  runId?: string | null;
  exportedAtUtc?: string;
};

function num(v: unknown): number | "" {
  return typeof v === "number" && Number.isFinite(v) ? v : "";
}

function str(v: unknown): string {
  return String(v ?? "");
}

function primaryTask(report: EvalReportBundleV0_1 | null | undefined): Record<string, any> | null {
  const tasks = Array.isArray((report as any)?.tasks) ? (report as any).tasks : [];
  return tasks.find((t: any) => t?.kind === "byo") ?? tasks[0] ?? null;
}

function intermediate(task: Record<string, any> | null): Record<string, any> | null {
  return (
    task?.intermediatePosition?.aperturePresenceMean ??
    task?.intermediatePosition ??
    task?.intermediate_position?.aperturePresenceMean ??
    task?.intermediate ??
    null
  );
}

function addSheet(
  wb: ExcelJS.Workbook,
  name: string,
  rows: Cell[][],
  widths: number[],
): void {
  const ws = wb.addWorksheet(name, {
    views: [{ state: "frozen", ySplit: 1 }],
  });

  ws.columns = widths.map((width) => ({ width }));

  rows.forEach((r) => ws.addRow(r));

  const header = ws.getRow(1);
  header.font = { bold: true };
  header.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFD9EAF7" },
  };
  header.alignment = { vertical: "top", wrapText: true };

  ws.eachRow((row) => {
    row.alignment = { vertical: "top", wrapText: false };
  });

  ws.getRow(1).alignment = { vertical: "top", wrapText: true };
}

function runSummary(input: BuildEvalsWorkbookInputV0_1): Cell[][] {
  const report = input.report ?? null;
  const task = primaryTask(report);
  const inter = intermediate(task);
  const meta = ((report as any)?.meta ?? {}) as Record<string, unknown>;

  return [
    ["Section", "Field", "Value"],
    ["workbook", "exportVersion", EVALS_WORKBOOK_EXPORT_VERSION_V0_1],
    ["workbook", "exportedAtUtc", input.exportedAtUtc ?? new Date().toISOString()],
    ["run", "runId", str((report as any)?.runId || input.runId || "")],
    ["run", "provider", str(meta.provider)],
    ["run", "model", str(meta.model)],
    ["run", "label", str(meta.label)],
    ["run", "sourceEngineId", str(meta.sourceEngineId)],
    ["run", "sourceEngineVersion", str(meta.sourceEngineVersion)],
    ["run", "sourceEngineBuild", str(meta.sourceEngineBuild)],
    ["task", "taskId", str(task?.taskId)],
    ["task", "kind", str(task?.kind)],
    ["task", "languageHint", str(task?.languageHint)],
    ["task", "vowelUnderTest", str(task?.vowelUnderTest)],
    ["task", "anchorLow", str(task?.anchorLow)],
    ["task", "anchorHigh", str(task?.anchorHigh)],
    ["intermediate", "verdict", str(inter?.verdict)],
    ["intermediate", "normalizedPosition", num(inter?.normalizedPosition)],
    ["intermediate", "gap_low", num(inter?.gap_low)],
    ["intermediate", "gap_high", num(inter?.gap_high)],
    ["intermediate", "mean_anchor_low", num(inter?.mean_anchor_low)],
    ["intermediate", "mean_x_vowel", num(inter?.mean_x_vowel)],
    ["intermediate", "mean_anchor_high", num(inter?.mean_anchor_high)],
    [
      "intermediate",
      "diagnosticFlags",
      Array.isArray(inter?.diagnosticFlags) ? inter.diagnosticFlags.join(", ") : "",
    ],
  ];
}

function bucketStats(task: Record<string, any> | null): Cell[][] {
  const rows: Cell[][] = [
    [
      "Bucket",
      "expectedN",
      "providedN",
      "validN",
      "invalidN",
      "dupN",
      "mean(primary)",
      "mean(presenceMean)",
    ],
  ];

  const buckets = task?.buckets ?? task?.bucketReports ?? task?.bucketStats ?? [];

  const push = (name: string, b: any) => {
    rows.push([
      str(b?.bucket ?? b?.bucketId ?? b?.id ?? name),
      num(b?.expectedN),
      num(b?.providedN),
      num(b?.validN),
      num(b?.invalidN),
      num(b?.dupN),
      num(b?.mean_primary ?? b?.meanPrimary ?? b?.primaryMean),
      num(b?.mean_presenceMean ?? b?.meanPresenceMean ?? b?.presenceMean),
    ]);
  };

  if (Array.isArray(buckets)) {
    buckets.forEach((b, i) => push(String(i + 1), b));
  } else if (buckets && typeof buckets === "object") {
    Object.entries(buckets).forEach(([k, v]) => push(k, v));
  }

  return rows;
}

const PILOT_PLANNER: Cell[][] = [
  ["Language", "Vowel", "Tag", "Correct bracket", "Wrong bracket", "Main ready", "Alt ready", "Main run ID", "Alt run ID", "Ctrl run ID", "Ctrl-alt run ID", "Notes"],
  ["de", "ö", "oe", "V2–V5", "V1–V2", "yes", "yes", "t5.de.oe.v2-v5.pilot.main.r01", "t5.de.oe.v2-v5.pilot.alt.r01", "t5.de.oe.v1-v2.pilot.ctrl.r01", "t5.de.oe.v1-v2.pilot.ctrl-alt.r01", "DEEP_INTERIOR_BENCHMARK"],
  ["da", "ø", "oe", "V2–V5", "V1–V2", "yes", "yes", "t5.da.oe.v2-v5.pilot.main.r01", "t5.da.oe.v2-v5.pilot.alt.r01", "t5.da.oe.v1-v2.pilot.ctrl.r01", "t5.da.oe.v1-v2.pilot.ctrl-alt.r01", "FRAGILE_LOW_EDGE_BENCHMARK"],
  ["fi", "ä", "ae", "V1–V3", "V2–V3", "yes", "yes", "t5.fi.ae.v1-v3.pilot.main.r01", "t5.fi.ae.v1-v3.pilot.alt.r01", "t5.fi.ae.v2-v3.pilot.ctrl.r01", "t5.fi.ae.v2-v3.pilot.ctrl-alt.r01", "CLEAN_EXCEEDS_LOW_CONTROL"],
  ["de", "ä", "ae", "V1–V3", "V2–V3", "yes", "yes", "t5.de.ae.v1-v3.pilot.main.r01", "t5.de.ae.v1-v3.pilot.alt.r01", "t5.de.ae.v2-v3.pilot.ctrl.r01", "t5.de.ae.v2-v3.pilot.ctrl-alt.r01", "EDGE_BEHAVIOR_CASE"],
  ["pt", "â", "aa", "V1–V4", "V1–V2", "yes", "yes", "t5.pt.aa.v1-v4.pilot.main.r01", "t5.pt.aa.v1-v4.pilot.alt.r01", "t5.pt.aa.v1-v2.pilot.ctrl.r01", "t5.pt.aa.v1-v2.pilot.ctrl-alt.r01", "SOFT_COLLAPSE_HIGH_CONTROL"],
];

const PILOT_SUMMARY: Cell[][] = [
  ["Code", "Class", "Pattern", "Strength", "Caveat"],
  ["de-ö", "DEEP_INTERIOR_BENCHMARK", "main/alt=INT | ctrl/ctrl-alt=COLLAPSED_HIGH", "strongest robust benchmark", "none"],
  ["da-ø", "FRAGILE_LOW_EDGE_BENCHMARK", "main/alt=INT+LOW_WARN | ctrl/ctrl-alt=COLLAPSED_HIGH+HIGH_WARN", "coherent but edge-fragile", "low-edge warnings on correct bracket"],
  ["fi-ä", "CLEAN_EXCEEDS_LOW_CONTROL", "main/alt=INT | ctrl/ctrl-alt=EXCEEDS_LOW", "cleanest quartet", "none"],
  ["de-ä", "EDGE_BEHAVIOR_CASE", "main/alt=INT | ctrl/ctrl-alt=EXCEEDS_LOW+LOW_BOUNDARY", "acceptable", "wrong bracket rejects but stays near low boundary"],
  ["pt-â", "SOFT_COLLAPSE_HIGH_CONTROL", "main/alt=INT | ctrl=COLLAPSED_HIGH | ctrl-alt=INT+HIGH_WARN", "mixed", "ctrl-alt does not fully collapse"],
];

function rawReport(md: string | null | undefined): Cell[][] {
  const lines = String(md ?? "").trim()
    ? String(md).split(/\r?\n/)
    : ["No scored markdown report available. Click Score run before exporting for a filled Raw Report tab."];

  return [["Line", "Markdown"], ...lines.map((line, i) => [i + 1, line])];
}

export async function buildEvalsWorkbookArrayBufferV0_1(
  input: BuildEvalsWorkbookInputV0_1,
): Promise<ArrayBuffer> {
  const task = primaryTask(input.report ?? null);
  const wb = new ExcelJS.Workbook();

  wb.creator = "ZË-RO Evals";
  wb.created = new Date(input.exportedAtUtc ?? Date.now());

  addSheet(wb, "Run Summary", runSummary(input), [16, 24, 48]);
  addSheet(wb, "Bucket Stats", bucketStats(task), [18, 12, 12, 12, 12, 10, 16, 20]);
  addSheet(wb, "Pilot Planner", PILOT_PLANNER, [10, 8, 8, 16, 16, 12, 12, 34, 34, 34, 36, 34]);
  addSheet(wb, "Pilot Summary", PILOT_SUMMARY, [10, 28, 46, 28, 40]);
  addSheet(wb, "Raw Report", rawReport(input.md), [8, 120]);

  const bytes = await wb.xlsx.writeBuffer();
  return bytes;
}
