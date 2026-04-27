import { readFile } from "node:fs/promises";
import { basename } from "node:path";

import { parseBatteryEvidencePackStatsV0_1 } from "../src/lib/battery/batteryEvidencePackImport.v0.1";

type CliArgsV0_1 = {
  zipPath: string | null;
  seriesLabel: string | null;
  evidenceZipFilename: string | null;
  json: boolean;
  help: boolean;
};

function parseArgsV0_1(argv: string[]): CliArgsV0_1 {
  const args: CliArgsV0_1 = {
    zipPath: null,
    seriesLabel: null,
    evidenceZipFilename: null,
    json: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }

    if (arg === "--json") {
      args.json = true;
      continue;
    }

    if (arg === "--zip") {
      args.zipPath = argv[i + 1] ?? null;
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
  }

  return args;
}

function usageV0_1(): string {
  return [
    "Usage:",
    "  npm run battery:inspect-pack -- --zip <path-to-evidence-zip> --series-label <label>",
    "",
    "Options:",
    "  --zip <path>                   Required evidence-pack ZIP path",
    "  --series-label <label>         Optional; defaults to ZIP filename without .zip",
    "  --evidence-zip-filename <name> Optional; defaults to basename of ZIP path",
    "  --json                         Print JSON instead of table",
    "  --help                         Show this help",
    "",
  ].join("\n");
}

function valueV0_1(value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string" && value.trim()) return value;
  return "null";
}

function tupleV0_1(value: [number, number] | null): string {
  return value ? `[${value[0]}, ${value[1]}]` : "null";
}

async function mainV0_1(): Promise<void> {
  const args = parseArgsV0_1(process.argv.slice(2));

  if (args.help || !args.zipPath) {
    console.log(usageV0_1());
    process.exitCode = args.help ? 0 : 1;
    return;
  }

  const zipBytes = await readFile(args.zipPath);
  const evidenceZipFilename = args.evidenceZipFilename ?? basename(args.zipPath);
  const seriesLabel =
    args.seriesLabel ??
    evidenceZipFilename.replace(/^evals\.series-evidence-pack\./, "").replace(/\.zip$/, "");

  const parsed = await parseBatteryEvidencePackStatsV0_1({
    zipBytes,
    seriesLabel,
    evidenceZipFilename,
  });

  if (args.json) {
    console.log(JSON.stringify(parsed, null, 2));
    return;
  }

  console.log("# Battery Evidence Pack Stats");
  console.log(`zip: ${args.zipPath}`);
  console.log(`seriesLabel: ${seriesLabel}`);
  console.log(`evidenceZipFilename: ${evidenceZipFilename}`);
  console.log(`runCount: ${parsed.length}`);
  console.log("");

  if (parsed.length === 0) {
    console.log("No runs/<runId>/report.json artifacts found.");
    return;
  }

  console.log(
    [
      "runId",
      "hasStats",
      "pValue",
      "hedgesGLowX",
      "hedgesGXHigh",
      "ci95NormalizedPosition",
      "reportPath",
    ].join("\t"),
  );

  for (const run of parsed) {
    console.log(
      [
        run.runId,
        String(run.hasImportedStats),
        valueV0_1(run.stats.marginPermutation.pValue),
        valueV0_1(run.stats.effectSizes.hedgesGLowX),
        valueV0_1(run.stats.effectSizes.hedgesGXHigh),
        tupleV0_1(run.stats.bootstrap.ci95NormalizedPosition),
        run.reportPath,
      ].join("\t"),
    );
  }
}

mainV0_1().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`battery evidence-pack inspection failed: ${message}`);
  process.exitCode = 1;
});
