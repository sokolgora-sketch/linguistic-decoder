import JSZip from "jszip";

import type { EvalReportBundleV0_1 } from "@/shared/evals/report.v0.1";
import {
  buildBatteryBracketStatsFromReportV0_1,
  hasImportedBatteryBracketStatsV0_1,
  type BatteryBracketStatsV0_1,
} from "@/lib/battery/batteryStats.v0.1";

export type BatteryEvidencePackRunStatsV0_1 = {
  reportPath: string;
  runId: string;
  report: EvalReportBundleV0_1;
  stats: BatteryBracketStatsV0_1;
  hasImportedStats: boolean;
};

export type ParseBatteryEvidencePackStatsInputV0_1 = {
  zipBytes: ArrayBuffer | Uint8Array;
  seriesLabel: string;
  evidenceZipFilename: string;
};

function normalizeZipBytesV0_1(input: ArrayBuffer | Uint8Array): ArrayBuffer | Uint8Array {
  return input;
}

function isRunReportJsonPathV0_1(path: string): boolean {
  return /^runs\/[^/]+\/report\.json$/.test(path);
}

function parseReportJsonV0_1(path: string, text: string): EvalReportBundleV0_1 {
  const parsed = JSON.parse(text) as EvalReportBundleV0_1;

  if (!parsed || typeof parsed !== "object") {
    throw new Error(`Invalid report.json object at ${path}`);
  }

  if (typeof parsed.runId !== "string" || parsed.runId.trim() === "") {
    throw new Error(`Invalid or missing runId in ${path}`);
  }

  if (!Array.isArray(parsed.tasks)) {
    throw new Error(`Invalid or missing tasks array in ${path}`);
  }

  return parsed;
}

export async function parseBatteryEvidencePackStatsV0_1(
  input: ParseBatteryEvidencePackStatsInputV0_1,
): Promise<BatteryEvidencePackRunStatsV0_1[]> {
  const zip = await JSZip.loadAsync(normalizeZipBytesV0_1(input.zipBytes));

  const reportPaths = Object.keys(zip.files)
    .filter(isRunReportJsonPathV0_1)
    .sort((a, b) => a.localeCompare(b));

  const results: BatteryEvidencePackRunStatsV0_1[] = [];

  for (const reportPath of reportPaths) {
    const file = zip.file(reportPath);

    if (!file) continue;

    const text = await file.async("string");
    const report = parseReportJsonV0_1(reportPath, text);

    const stats = buildBatteryBracketStatsFromReportV0_1({
      seriesLabel: input.seriesLabel,
      evidenceZipFilename: input.evidenceZipFilename,
      report,
      notes: `source:${reportPath}`,
    });

    results.push({
      reportPath,
      runId: report.runId,
      report,
      stats,
      hasImportedStats: hasImportedBatteryBracketStatsV0_1(stats),
    });
  }

  return results;
}
