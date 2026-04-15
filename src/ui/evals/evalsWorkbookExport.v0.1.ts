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

function cleanMdValue(v: string | undefined): string {
  const value = String(v ?? "").trim();
  return value === "(none)" || value === "—" ? "" : value;
}

function mdField(md: string | null | undefined, key: string): string {
  const lines = String(md ?? "").split(/\r?\n/);
  const needle = key.toLowerCase();

  for (const line of lines) {
    const match = line.match(/^\s*-\s*([^:]+):\s*(.*?)\s*$/);
    if (!match) continue;

    if (match[1].trim().toLowerCase() === needle) {
      return cleanMdValue(match[2]);
    }
  }

  return "";
}

function mdNumber(md: string | null | undefined, key: string): number | "" {
  const value = mdField(md, key);
  if (!value) return "";

  const direct = Number(value);
  if (Number.isFinite(direct)) return direct;

  const match = value.match(/-?\d+(?:\.\d+)?/);
  if (!match) return "";

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : "";
}

function firstText(...values: unknown[]): string {
  for (const value of values) {
    const text = str(value).trim();
    if (text) return text;
  }
  return "";
}

function firstNumber(...values: unknown[]): number | "" {
  for (const value of values) {
    const parsed = num(value);
    if (parsed !== "") return parsed;
  }
  return "";
}

function parseMarkdownBucketStats(md: string | null | undefined): Cell[][] {
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

  const lines = String(md ?? "").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("|")) continue;
    if (!/\|\s*(anchor_low|x_vowel|anchor_high)\s*\|/.test(trimmed)) continue;

    const parts = trimmed
      .split("|")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.length < 8) continue;

    rows.push([
      parts[0],
      Number(parts[1]),
      Number(parts[2]),
      Number(parts[3]),
      Number(parts[4]),
      Number(parts[5]),
      Number(parts[6]),
      Number(parts[7]),
    ]);
  }

  return rows.length > 1 ? rows : [];
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

  ws.autoFilter = {
    from: { row: 1, column: 1 },
    to: { row: 1, column: Math.max(1, widths.length) },
  };

  ws.eachRow((row, rowNumber) => {
    row.alignment = { vertical: "top", wrapText: false };

    row.eachCell((cell) => {
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } },
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };

      if (typeof cell.value === "number") {
        cell.numFmt = Number.isInteger(cell.value) ? "0" : "0.000";
        cell.alignment = { vertical: "top", horizontal: "right", wrapText: false };
      }
    });

    if (rowNumber === 1) {
      row.height = 20;
      row.font = { bold: true };
      row.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9EAF7" },
      };
      row.alignment = { vertical: "middle", wrapText: true };
    }
  });
}

function runSummary(input: BuildEvalsWorkbookInputV0_1): Cell[][] {
  const report = input.report ?? null;
  const task = primaryTask(report);
  const inter = intermediate(task);
  const meta = ((report as any)?.meta ?? {}) as Record<string, unknown>;
  const md = input.md ?? "";

  return [
    ["Section", "Field", "Value"],
    ["workbook", "exportVersion", EVALS_WORKBOOK_EXPORT_VERSION_V0_1],
    ["workbook", "exportedAtUtc", input.exportedAtUtc ?? new Date().toISOString()],
    ["run", "runId", firstText((report as any)?.runId, input.runId, mdField(md, "runId"))],
    ["run", "provider", firstText(meta.provider, mdField(md, "provider"))],
    ["run", "model", firstText(meta.model, mdField(md, "model"))],
    ["run", "label", firstText(meta.label, mdField(md, "label"))],
    ["run", "sourceEngineId", firstText(meta.sourceEngineId, mdField(md, "sourceEngineId"))],
    ["run", "sourceEngineVersion", firstText(meta.sourceEngineVersion, mdField(md, "sourceEngineVersion"))],
    ["run", "sourceEngineBuild", firstText(meta.sourceEngineBuild, mdField(md, "sourceEngineBuild"))],
    ["task", "taskId", firstText(task?.taskId, mdField(md, "taskId"))],
    ["task", "kind", firstText(task?.kind, mdField(md, "kind"))],
    ["task", "languageHint", firstText(task?.languageHint, mdField(md, "languageHint"))],
    ["task", "vowelUnderTest", firstText(task?.vowelUnderTest, mdField(md, "vowelUnderTest"))],
    ["task", "anchorLow", firstText(task?.anchorLow, mdField(md, "anchorLow"))],
    ["task", "anchorHigh", firstText(task?.anchorHigh, mdField(md, "anchorHigh"))],
    ["intermediate", "verdict", firstText(inter?.verdict, mdField(md, "verdict"))],
    ["intermediate", "normalizedPosition", firstNumber(inter?.normalizedPosition, mdNumber(md, "normalizedPosition"))],
    ["intermediate", "gap_low", firstNumber(inter?.gap_low, mdNumber(md, "gap_low"))],
    ["intermediate", "gap_high", firstNumber(inter?.gap_high, mdNumber(md, "gap_high"))],
    ["intermediate", "mean_anchor_low", firstNumber(inter?.mean_anchor_low, mdNumber(md, "mean(anchor_low)"))],
    ["intermediate", "mean_x_vowel", firstNumber(inter?.mean_x_vowel, mdNumber(md, "mean(x_vowel)"))],
    ["intermediate", "mean_anchor_high", firstNumber(inter?.mean_anchor_high, mdNumber(md, "mean(anchor_high)"))],
    [
      "intermediate",
      "diagnosticFlags",
      firstText(
        Array.isArray(inter?.diagnosticFlags) ? inter.diagnosticFlags.join(", ") : "",
        mdField(md, "diagnostic flags"),
      ),
    ],
  ];
}

function t5Summary(input: BuildEvalsWorkbookInputV0_1): Cell[][] {
  const report = input.report ?? null;
  const task = primaryTask(report);
  const inter = intermediate(task);
  const md = input.md ?? "";

  return [
    [
      "runId",
      "taskId",
      "language",
      "vowel",
      "anchorLow",
      "anchorHigh",
      "verdict",
      "normalizedPosition",
      "gap_low",
      "gap_high",
      "mean_anchor_low",
      "mean_x_vowel",
      "mean_anchor_high",
      "diagnosticFlags",
    ],
    [
      firstText((report as any)?.runId, input.runId, mdField(md, "runId")),
      firstText(task?.taskId, mdField(md, "taskId")),
      firstText(task?.languageHint, mdField(md, "languageHint")),
      firstText(task?.vowelUnderTest, mdField(md, "vowelUnderTest")),
      firstText(task?.anchorLow, mdField(md, "anchorLow")),
      firstText(task?.anchorHigh, mdField(md, "anchorHigh")),
      firstText(inter?.verdict, mdField(md, "verdict")),
      firstNumber(inter?.normalizedPosition, mdNumber(md, "normalizedPosition")),
      firstNumber(inter?.gap_low, mdNumber(md, "gap_low")),
      firstNumber(inter?.gap_high, mdNumber(md, "gap_high")),
      firstNumber(inter?.mean_anchor_low, mdNumber(md, "mean(anchor_low)")),
      firstNumber(inter?.mean_x_vowel, mdNumber(md, "mean(x_vowel)")),
      firstNumber(inter?.mean_anchor_high, mdNumber(md, "mean(anchor_high)")),
      firstText(
        Array.isArray(inter?.diagnosticFlags) ? inter.diagnosticFlags.join(", ") : "",
        mdField(md, "diagnostic flags"),
      ),
    ],
  ];
}

function bucketStats(task: Record<string, any> | null, md?: string | null): Cell[][] {
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

  const markdownRows = parseMarkdownBucketStats(md);
  if (markdownRows.length > 1) return markdownRows;

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
  addSheet(wb, "T5 Summary", t5Summary(input), [34, 22, 12, 10, 12, 12, 18, 20, 12, 12, 18, 16, 18, 24]);
  addSheet(wb, "Bucket Stats", bucketStats(task, input.md), [18, 12, 12, 12, 12, 10, 16, 20]);
  addSheet(wb, "Pilot Planner", PILOT_PLANNER, [10, 8, 8, 16, 16, 12, 12, 34, 34, 34, 36, 34]);
  addSheet(wb, "Pilot Summary", PILOT_SUMMARY, [10, 28, 46, 28, 40]);
  addSheet(wb, "Raw Report", rawReport(input.md), [8, 120]);

  const bytes = await wb.xlsx.writeBuffer();
  return bytes;
}
