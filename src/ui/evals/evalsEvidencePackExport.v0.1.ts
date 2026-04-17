import JSZip from "jszip";

import type { EvalReportBundleV0_1 } from "@/shared/evals/report.v0.1";

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
- runs/${params.runId}/report.md
- runs/${params.runId}/report.pdf
- runs/${params.runId}/workbook.xlsx
- runs/${params.runId}/summary.csv
- runs/${params.runId}/notes.md

## Reading order

1. Open notes.md for the interpretation frame.
2. Open report.pdf for the human-readable scored result.
3. Open summary.csv for quick machine-readable values.
4. Open workbook.xlsx for full structured evidence.
5. Open input.json to inspect exactly what was tested.
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
  const vowel = textOrPendingV0_1(task?.vowelUnderTest);
  const anchorLow = textOrPendingV0_1(task?.anchorLow);
  const anchorHigh = textOrPendingV0_1(task?.anchorHigh);
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
