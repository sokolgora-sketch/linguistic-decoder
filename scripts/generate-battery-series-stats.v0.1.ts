import { readFile } from "node:fs/promises";
import { basename } from "node:path";

import { parseBatteryEvidencePackStatsV0_1 } from "../src/lib/battery/batteryEvidencePackImport.v0.1";
import { getBatteryCaseById } from "../src/lib/battery/getBatteryCase.v0.1";
import type { BatteryEvidencePackRunStatsV0_1 } from "../src/lib/battery/batteryEvidencePackImport.v0.1";
import type { BatteryBracketStatsV0_1 } from "../src/lib/battery/batteryStats.v0.1";

type CliArgsV0_1 = {
  zipPath: string | null;
  caseId: string | null;
  seriesLabel: string | null;
  evidenceZipFilename: string | null;
  inspectedManifestPath: string | null;
  intendedMainRunId: string | null;
  intendedAltRunId: string | null;
  controlMainRunId: string | null;
  controlAltRunId: string | null;
  help: boolean;
};

type RoleV0_1 =
  | "intended-main"
  | "intended-alt"
  | "control-main"
  | "control-alt";

function parseArgsV0_1(argv: string[]): CliArgsV0_1 {
  const args: CliArgsV0_1 = {
    zipPath: null,
    caseId: null,
    seriesLabel: null,
    evidenceZipFilename: null,
    inspectedManifestPath: null,
    intendedMainRunId: null,
    intendedAltRunId: null,
    controlMainRunId: null,
    controlAltRunId: null,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }

    if (arg === "--zip") {
      args.zipPath = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg === "--case-id") {
      args.caseId = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg === "--series-label") {
      args.seriesLabel = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg === "--evidence-zip-filename") {
      args.evidenceZipFilename = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg === "--inspected-manifest-path") {
      args.inspectedManifestPath = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg === "--intended-main-run-id") {
      args.intendedMainRunId = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg === "--intended-alt-run-id") {
      args.intendedAltRunId = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg === "--control-main-run-id") {
      args.controlMainRunId = argv[i + 1] ?? null;
      i += 1;
      continue;
    }

    if (arg === "--control-alt-run-id") {
      args.controlAltRunId = argv[i + 1] ?? null;
      i += 1;
      continue;
    }
  }

  return args;
}

function usageV0_1(): string {
  return [
    "Usage:",
    "  npm run battery:generate-series-stats -- --zip <evidence-pack.zip> --case-id <case-id> --intended-main-run-id <runId> --intended-alt-run-id <runId> --control-main-run-id <runId> --control-alt-run-id <runId>",
    "",
    "Options:",
    "  --zip <path>                         Required evidence-pack ZIP path",
    "  --case-id <id>                       Required battery case id, e.g. et-ae",
    "  --series-label <label>               Optional; defaults to registry case seriesLabel",
    "  --evidence-zip-filename <name>       Optional; defaults to registry case evidenceZipFilename",
    "  --inspected-manifest-path <path>      Optional manifest path to include",
    "  --intended-main-run-id <runId>        Required explicit run role mapping",
    "  --intended-alt-run-id <runId>         Required explicit run role mapping",
    "  --control-main-run-id <runId>         Required explicit run role mapping",
    "  --control-alt-run-id <runId>          Required explicit run role mapping",
    "  --help                               Show this help",
    "",
    "This script prints a ready-to-paste seriesStats block. It does not edit registry files.",
    "",
  ].join("\n");
}

function requiredV0_1(value: string | null, label: string): string {
  if (!value || value.trim() === "") {
    throw new Error(`Missing required argument: ${label}`);
  }

  return value;
}

function tsStringV0_1(value: string): string {
  return JSON.stringify(value);
}

function tsNumberOrNullV0_1(value: number | null): string {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "null";
}

function tsTupleOrNullV0_1(value: [number, number] | null): string {
  return value ? `[${value[0]}, ${value[1]}]` : "null";
}

function findRunV0_1(
  parsed: BatteryEvidencePackRunStatsV0_1[],
  runId: string,
  role: RoleV0_1,
): BatteryEvidencePackRunStatsV0_1 {
  const run = parsed.find((candidate) => candidate.runId === runId);

  if (!run) {
    throw new Error(`Could not find ${role} runId in pack: ${runId}`);
  }

  if (!run.hasImportedStats) {
    throw new Error(`Run has no imported stats for ${role}: ${runId}`);
  }

  return run;
}

function renderBracketStatsV0_1(
  propertyName: "main" | "alt",
  run: BatteryEvidencePackRunStatsV0_1,
  role: RoleV0_1,
  seriesLabel: string,
  evidenceZipFilename: string,
  indent: string,
): string {
  const stats: BatteryBracketStatsV0_1 = run.stats;

  return [
    `${indent}${propertyName}: {`,
    `${indent}  source: "evidence-pack",`,
    `${indent}  seriesLabel: ${tsStringV0_1(seriesLabel)},`,
    `${indent}  evidenceZipFilename:`,
    `${indent}    ${tsStringV0_1(evidenceZipFilename)},`,
    `${indent}  marginPermutation: {`,
    `${indent}    observedMinGap: ${tsNumberOrNullV0_1(stats.marginPermutation.observedMinGap)},`,
    `${indent}    pValue: ${tsNumberOrNullV0_1(stats.marginPermutation.pValue)},`,
    `${indent}    iters: ${tsNumberOrNullV0_1(stats.marginPermutation.iters)},`,
    `${indent}    seed: ${tsNumberOrNullV0_1(stats.marginPermutation.seed)}`,
    `${indent}  },`,
    `${indent}  effectSizes: {`,
    `${indent}    hedgesGLowX: ${tsNumberOrNullV0_1(stats.effectSizes.hedgesGLowX)},`,
    `${indent}    hedgesGXHigh: ${tsNumberOrNullV0_1(stats.effectSizes.hedgesGXHigh)}`,
    `${indent}  },`,
    `${indent}  bootstrap: {`,
    `${indent}    ci95GapLow: ${tsTupleOrNullV0_1(stats.bootstrap.ci95GapLow)},`,
    `${indent}    ci95GapHigh: ${tsTupleOrNullV0_1(stats.bootstrap.ci95GapHigh)},`,
    `${indent}    ci95NormalizedPosition: ${tsTupleOrNullV0_1(stats.bootstrap.ci95NormalizedPosition)},`,
    `${indent}    iters: ${tsNumberOrNullV0_1(stats.bootstrap.iters)},`,
    `${indent}    seed: ${tsNumberOrNullV0_1(stats.bootstrap.seed)}`,
    `${indent}  },`,
    `${indent}  notes:`,
    `${indent}    ${tsStringV0_1(`role:${role}; source:${run.reportPath}`)}`,
    `${indent}}`,
  ].join("\n");
}

async function mainV0_1(): Promise<void> {
  const args = parseArgsV0_1(process.argv.slice(2));

  if (args.help) {
    console.log(usageV0_1());
    return;
  }

  const zipPath = requiredV0_1(args.zipPath, "--zip");
  const caseId = requiredV0_1(args.caseId, "--case-id");
  const batteryCase = getBatteryCaseById(caseId);

  if (!batteryCase) {
    throw new Error(`Unknown battery case id: ${caseId}`);
  }

  const intendedMainRunId = requiredV0_1(args.intendedMainRunId, "--intended-main-run-id");
  const intendedAltRunId = requiredV0_1(args.intendedAltRunId, "--intended-alt-run-id");
  const controlMainRunId = requiredV0_1(args.controlMainRunId, "--control-main-run-id");
  const controlAltRunId = requiredV0_1(args.controlAltRunId, "--control-alt-run-id");

  const evidenceZipFilename =
    args.evidenceZipFilename ?? batteryCase.evidenceZipFilename ?? basename(zipPath);
  const seriesLabel = args.seriesLabel ?? batteryCase.seriesLabel;

  const zipBytes = await readFile(zipPath);
  const parsed = await parseBatteryEvidencePackStatsV0_1({
    zipBytes,
    seriesLabel,
    evidenceZipFilename,
  });

  const intendedMain = findRunV0_1(parsed, intendedMainRunId, "intended-main");
  const intendedAlt = findRunV0_1(parsed, intendedAltRunId, "intended-alt");
  const controlMain = findRunV0_1(parsed, controlMainRunId, "control-main");
  const controlAlt = findRunV0_1(parsed, controlAltRunId, "control-alt");

  const manifestLine = args.inspectedManifestPath
    ? [`  inspectedManifestPath: ${tsStringV0_1(args.inspectedManifestPath)},`]
    : [];

  console.log([
    `seriesStats: {`,
    `  source: "evidence-pack",`,
    `  seriesLabel: ${tsStringV0_1(seriesLabel)},`,
    `  evidenceZipFilename:`,
    `    ${tsStringV0_1(evidenceZipFilename)},`,
    ...manifestLine,
    `  intended: {`,
    `    bracketId: ${tsStringV0_1(batteryCase.intendedBracketId)},`,
    `${renderBracketStatsV0_1("main", intendedMain, "intended-main", seriesLabel, evidenceZipFilename, "    ")},`,
    `${renderBracketStatsV0_1("alt", intendedAlt, "intended-alt", seriesLabel, evidenceZipFilename, "    ")}`,
    `  },`,
    `  control: {`,
    `    bracketId: ${tsStringV0_1(batteryCase.controlBracketId)},`,
    `${renderBracketStatsV0_1("main", controlMain, "control-main", seriesLabel, evidenceZipFilename, "    ")},`,
    `${renderBracketStatsV0_1("alt", controlAlt, "control-alt", seriesLabel, evidenceZipFilename, "    ")}`,
    `  },`,
    `  notes:`,
    `    ${tsStringV0_1("Generated from evidence-pack report.json artifacts; review before committing registry changes.")}`,
    `}`,
  ].join("\n"));
}

mainV0_1().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`battery series stats generation failed: ${message}`);
  process.exitCode = 1;
});
