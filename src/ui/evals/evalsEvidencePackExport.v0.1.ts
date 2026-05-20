import JSZip from "jszip";

import type { EvalReportBundleV0_1 } from "@/shared/evals/report.v0.1";
import type { HighRegionSeriesDiagnosticsArtifactV0_1 } from "@/shared/evals/highRegionSeriesDiagnosticsArtifact.v0.1";

export const EVALS_EVIDENCE_PACK_VERSION_V0_1 = "evals.evidencePack.v0.1";

type EvidencePackInputV0_1 = {
  runId?: string | null;
  runJson: unknown;
  report?: EvalReportBundleV0_1 | null;
  reportMd: string;
  pdfBytes: ArrayBuffer | Uint8Array | Blob;
  workbookBytes: ArrayBuffer | Uint8Array;
  summaryCsv: string;
  exportedAtUtc?: string;
};

function safePathPartV0_1(value: unknown, fallback = "run"): string {
  const text = String(value ?? "").trim() || fallback;
  return text.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 160) || fallback;
}

function primaryTaskV0_1(report: EvalReportBundleV0_1 | null | undefined): Record<string, any> | null {
  const tasks = Array.isArray((report as any)?.tasks) ? (report as any).tasks : [];
  return tasks.find((t: any) => t?.kind === "byo") ?? tasks[0] ?? null;
}

function intermediateV0_1(task: Record<string, any> | null): Record<string, any> | null {
  return (
    task?.intermediate_aperturePresenceMean ??
    task?.intermediatePosition?.aperturePresenceMean ??
    task?.intermediatePosition ??
    task?.intermediate_position?.aperturePresenceMean ??
    task?.intermediate ??
    null
  );
}

function textOrPendingV0_1(value: unknown): string {
  const text = String(value ?? "").trim();
  return text || "pending";
}

function numberOrBlankV0_1(value: unknown): string {
  return typeof value === "number" && Number.isFinite(value) ? String(Number(value.toFixed(6))) : "";
}

function buildReadmeV0_1(params: {
  runId: string;
  exportedAtUtc: string;
  taskId: string;
  language: string;
  vowel: string;
  anchorLow: string;
  anchorHigh: string;
}): string {
  return `# ZË-RO Evidence Pack

- evidencePackVersion: ${EVALS_EVIDENCE_PACK_VERSION_V0_1}
- exportedAtUtc: ${params.exportedAtUtc}
- runId: ${params.runId}
- taskId: ${params.taskId}
- language: ${params.language}
- vowelUnderTest: ${params.vowel}
- bracket: ${params.anchorLow}–${params.anchorHigh}

## Hypothesis under test

There are only seven primal vowel positions. Written/phonetic vowels beyond seven are expected to behave as derived, intermediate, collapsed, or surface-variant positions inside the seven-primal field.

## Evidence files

- runs/${params.runId}/input.json
- runs/${params.runId}/report.json
- runs/${params.runId}/report.md
- runs/${params.runId}/report.pdf
- runs/${params.runId}/workbook.xlsx
- runs/${params.runId}/summary.csv
- runs/${params.runId}/notes.md

## Reading order

1. Open notes.md for the interpretation frame.
2. Open report.pdf for the human-readable scored result.
3. Open report.json for structured scorer output and statistical fields.
4. Open summary.csv for quick machine-readable values.
5. Open workbook.xlsx for full structured evidence.
6. Open input.json to inspect exactly what was tested.
`;
}

function buildRunIndexV0_1(params: {
  runId: string;
  language: string;
  vowel: string;
  anchorLow: string;
  anchorHigh: string;
  verdict: string;
  normalizedPosition: string;
  gapLow: string;
  gapHigh: string;
  flags: string;
}): string {
  return `# Run Index

| Run ID | Language | Vowel | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags | Interpretation |
|---|---|---:|---|---|---:|---:|---:|---|---|
| ${params.runId} | ${params.language} | ${params.vowel} | ${params.anchorLow}–${params.anchorHigh} | ${params.verdict} | ${params.normalizedPosition} | ${params.gapLow} | ${params.gapHigh} | ${params.flags || "none"} | Review notes.md |
`;
}

function buildNotesV0_1(params: {
  exportedAtUtc: string;
  runId: string;
  taskId: string;
  language: string;
  vowel: string;
  anchorLow: string;
  anchorHigh: string;
  verdict: string;
  normalizedPosition: string;
  gapLow: string;
  gapHigh: string;
  meanLow: string;
  meanX: string;
  meanHigh: string;
  flags: string;
}): string {
  return `# T5 Run Notes

## Identity

- evidencePackVersion: ${EVALS_EVIDENCE_PACK_VERSION_V0_1}
- exportedAtUtc: ${params.exportedAtUtc}
- runId: ${params.runId}
- taskId: ${params.taskId}
- language: ${params.language}
- vowelUnderTest: ${params.vowel}
- bracket: ${params.anchorLow}–${params.anchorHigh}

## Hypothesis

- Expected supportive result: extra written/phonetic vowel behaves as intermediate, collapsed, or boundary-governed inside the seven-primal system.
- Challenge condition: result forces a stable position outside the seven-primal geometry.

## Result

- verdict: ${params.verdict}
- normalizedPosition: ${params.normalizedPosition}
- gap_low: ${params.gapLow}
- gap_high: ${params.gapHigh}
- mean_anchor_low: ${params.meanLow}
- mean_x_vowel: ${params.meanX}
- mean_anchor_high: ${params.meanHigh}
- diagnosticFlags: ${params.flags || "none"}

## Interpretation

- Supports / weakens / challenges: pending researcher review
- Notes: pending researcher review

## Files

- input.json
- report.json
- report.md
- report.pdf
- workbook.xlsx
- summary.csv
`;
}

export async function buildEvalsEvidencePackZipArrayBufferV0_1(
  input: EvidencePackInputV0_1,
): Promise<ArrayBuffer> {
  const report = input.report ?? null;
  const task = primaryTaskV0_1(report);
  const inter = intermediateV0_1(task);
  const exportedAtUtc = input.exportedAtUtc ?? new Date().toISOString();

  const runId = safePathPartV0_1((report as any)?.runId ?? input.runId, "run");
  const taskId = textOrPendingV0_1(task?.taskId);
  const language = textOrPendingV0_1(task?.languageHint);
  const vowel = textOrPendingV0_1(inter?.vowelUnderTest ?? task?.vowelUnderTest);
  const anchorLow = textOrPendingV0_1(inter?.anchorLow ?? task?.anchorLow);
  const anchorHigh = textOrPendingV0_1(inter?.anchorHigh ?? task?.anchorHigh);
  const verdict = textOrPendingV0_1(inter?.verdict);
  const normalizedPosition = numberOrBlankV0_1(inter?.normalizedPosition);
  const gapLow = numberOrBlankV0_1(inter?.gap_low);
  const gapHigh = numberOrBlankV0_1(inter?.gap_high);
  const meanLow = numberOrBlankV0_1(inter?.mean_anchor_low);
  const meanX = numberOrBlankV0_1(inter?.mean_x_vowel);
  const meanHigh = numberOrBlankV0_1(inter?.mean_anchor_high);
  const flags = Array.isArray(inter?.diagnosticFlags)
    ? inter.diagnosticFlags.join(", ")
    : "";

  const zip = new JSZip();
  const runDir = `runs/${runId}`;

  zip.file(
    "00_README.md",
    buildReadmeV0_1({ runId, exportedAtUtc, taskId, language, vowel, anchorLow, anchorHigh }),
  );
  zip.file(
    "01_RUN_INDEX.md",
    buildRunIndexV0_1({
      runId,
      language,
      vowel,
      anchorLow,
      anchorHigh,
      verdict,
      normalizedPosition,
      gapLow,
      gapHigh,
      flags,
    }),
  );

  zip.file(`${runDir}/input.json`, `${JSON.stringify(input.runJson, null, 2)}\n`);
  zip.file(`${runDir}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
  zip.file(`${runDir}/report.md`, input.reportMd || "No scored markdown report available.\n");
  zip.file(`${runDir}/report.pdf`, input.pdfBytes);
  zip.file(`${runDir}/workbook.xlsx`, input.workbookBytes);
  zip.file(`${runDir}/summary.csv`, input.summaryCsv);
  zip.file(
    `${runDir}/notes.md`,
    buildNotesV0_1({
      exportedAtUtc,
      runId,
      taskId,
      language,
      vowel,
      anchorLow,
      anchorHigh,
      verdict,
      normalizedPosition,
      gapLow,
      gapHigh,
      meanLow,
      meanX,
      meanHigh,
      flags,
    }),
  );

  return await zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}


type SeriesEvidencePackRunInputV0_1 = EvidencePackInputV0_1 & {
  ordinal?: number | null;
  title?: string | null;
};

type SeriesEvidencePackInputV0_1 = {
  seriesId?: string | null;
  seriesLabel: string;
  targetCount?: number | null;
  exportedAtUtc?: string;
  seriesDiagnosticsArtifact?: HighRegionSeriesDiagnosticsArtifactV0_1 | null;
  runs: SeriesEvidencePackRunInputV0_1[];
};

function extractEvidenceMetaV0_1(input: EvidencePackInputV0_1): {
  runId: string;
  taskId: string;
  language: string;
  vowel: string;
  anchorLow: string;
  anchorHigh: string;
  verdict: string;
  normalizedPosition: string;
  gapLow: string;
  gapHigh: string;
  meanLow: string;
  meanX: string;
  meanHigh: string;
  flags: string;
} {
  const report = input.report ?? null;
  const task = primaryTaskV0_1(report);
  const inter = intermediateV0_1(task);

  return {
    runId: safePathPartV0_1((report as any)?.runId ?? input.runId, "run"),
    taskId: textOrPendingV0_1(task?.taskId),
    language: textOrPendingV0_1(task?.languageHint),
    vowel: textOrPendingV0_1(inter?.vowelUnderTest ?? task?.vowelUnderTest),
    anchorLow: textOrPendingV0_1(inter?.anchorLow ?? task?.anchorLow),
    anchorHigh: textOrPendingV0_1(inter?.anchorHigh ?? task?.anchorHigh),
    verdict: textOrPendingV0_1(inter?.verdict),
    normalizedPosition: numberOrBlankV0_1(inter?.normalizedPosition),
    gapLow: numberOrBlankV0_1(inter?.gap_low),
    gapHigh: numberOrBlankV0_1(inter?.gap_high),
    meanLow: numberOrBlankV0_1(inter?.mean_anchor_low),
    meanX: numberOrBlankV0_1(inter?.mean_x_vowel),
    meanHigh: numberOrBlankV0_1(inter?.mean_anchor_high),
    flags: Array.isArray(inter?.diagnosticFlags) ? inter.diagnosticFlags.join(", ") : "",
  };
}

function csvEscapeV0_1(value: unknown): string {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function csvRowV0_1(values: unknown[]): string {
  return values.map(csvEscapeV0_1).join(",");
}

function buildSeriesReadmeV0_1(params: {
  seriesLabel: string;
  seriesId: string;
  targetCount: string;
  exportedAtUtc: string;
  runCount: number;
}): string {
  return `# ZË-RO Series Evidence Pack

- evidencePackVersion: ${EVALS_EVIDENCE_PACK_VERSION_V0_1}
- exportedAtUtc: ${params.exportedAtUtc}
- seriesId: ${params.seriesId}
- seriesLabel: ${params.seriesLabel}
- targetCount: ${params.targetCount}
- scoredRunCount: ${params.runCount}

## Hypothesis under test

There are only seven primal vowel positions. Written/phonetic vowels beyond seven are expected to behave as derived, intermediate, collapsed, or surface-variant positions inside the seven-primal field.

## Evidence files

- 01_RUN_INDEX.md
- series-summary.csv
- series-diagnostics.json (optional; present only when supplied)
- runs/<runId>/input.json
- runs/<runId>/report.json
- runs/<runId>/report.md
- runs/<runId>/report.pdf
- runs/<runId>/workbook.xlsx
- runs/<runId>/summary.csv
- runs/<runId>/notes.md

## Reading order

1. Open 01_RUN_INDEX.md for the whole battery.
2. Open series-summary.csv for quick machine-readable values.
3. If present, open series-diagnostics.json for series-level high-region diagnostics.
4. Open each run report.json for structured scorer output and statistical fields.
5. Open each run notes.md for interpretation status.
6. Open report.pdf for human-readable scored evidence.
7. Open input.json to inspect exactly what was tested.
`;
}

export async function buildEvalsSeriesEvidencePackZipArrayBufferV0_1(
  input: SeriesEvidencePackInputV0_1,
): Promise<ArrayBuffer> {
  const exportedAtUtc = input.exportedAtUtc ?? new Date().toISOString();
  const seriesLabel = input.seriesLabel.trim() || "series";
  const seriesId = safePathPartV0_1(input.seriesId ?? seriesLabel, "series");
  const targetCount = typeof input.targetCount === "number" && Number.isFinite(input.targetCount)
    ? String(input.targetCount)
    : "not set";

  const zip = new JSZip();
  const runs = [...input.runs].sort((a, b) => {
    const ao = typeof a.ordinal === "number" ? a.ordinal : Number.MAX_SAFE_INTEGER;
    const bo = typeof b.ordinal === "number" ? b.ordinal : Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return String(a.runId ?? "").localeCompare(String(b.runId ?? ""));
  });

  const metas = runs.map((run) => ({ run, meta: extractEvidenceMetaV0_1(run) }));

  zip.file(
    "00_README.md",
    buildSeriesReadmeV0_1({
      seriesLabel,
      seriesId,
      targetCount,
      exportedAtUtc,
      runCount: metas.length,
    }),
  );

  const indexRows = [
    "# Run Index",
    "",
    "| Ordinal | Run ID | Language | Vowel | Bracket | Verdict | normalizedPosition | gap_low | gap_high | Flags | Interpretation |",
    "|---:|---|---|---:|---|---|---:|---:|---:|---|---|",
    ...metas.map(({ run, meta }) => {
      const ordinal =
        typeof run.ordinal === "number" && Number.isFinite(run.ordinal)
          ? String(run.ordinal)
          : "";
      return `| ${ordinal} | ${meta.runId} | ${meta.language} | ${meta.vowel} | ${meta.anchorLow}–${meta.anchorHigh} | ${meta.verdict} | ${meta.normalizedPosition} | ${meta.gapLow} | ${meta.gapHigh} | ${meta.flags || "none"} | Review notes.md |`;
    }),
    "",
  ];
  zip.file("01_RUN_INDEX.md", indexRows.join("\n"));

  const csvRows = [
    [
      "ordinal",
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
    ...metas.map(({ run, meta }) => [
      typeof run.ordinal === "number" ? run.ordinal : "",
      meta.runId,
      meta.taskId,
      meta.language,
      meta.vowel,
      meta.anchorLow,
      meta.anchorHigh,
      meta.verdict,
      meta.normalizedPosition,
      meta.gapLow,
      meta.gapHigh,
      meta.meanLow,
      meta.meanX,
      meta.meanHigh,
      meta.flags || "none",
    ]),
  ];
  zip.file("series-summary.csv", csvRows.map(csvRowV0_1).join("\n") + "\n");

  if (input.seriesDiagnosticsArtifact) {
    zip.file(
      "series-diagnostics.json",
      `${JSON.stringify(input.seriesDiagnosticsArtifact, null, 2)}\n`,
    );
  }

  for (const { run, meta } of metas) {
    const runDir = `runs/${meta.runId}`;
    zip.file(`${runDir}/input.json`, `${JSON.stringify(run.runJson, null, 2)}\n`);
    zip.file(`${runDir}/report.json`, `${JSON.stringify(run.report ?? null, null, 2)}\n`);
    zip.file(`${runDir}/report.md`, run.reportMd || "No scored markdown report available.\n");
    zip.file(`${runDir}/report.pdf`, run.pdfBytes);
    zip.file(`${runDir}/workbook.xlsx`, run.workbookBytes);
    zip.file(`${runDir}/summary.csv`, run.summaryCsv);
    zip.file(
      `${runDir}/notes.md`,
      buildNotesV0_1({
        exportedAtUtc,
        runId: meta.runId,
        taskId: meta.taskId,
        language: meta.language,
        vowel: meta.vowel,
        anchorLow: meta.anchorLow,
        anchorHigh: meta.anchorHigh,
        verdict: meta.verdict,
        normalizedPosition: meta.normalizedPosition,
        gapLow: meta.gapLow,
        gapHigh: meta.gapHigh,
        meanLow: meta.meanLow,
        meanX: meta.meanX,
        meanHigh: meta.meanHigh,
        flags: meta.flags,
      }),
    );
  }

  return await zip.generateAsync({
    type: "arraybuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });
}
