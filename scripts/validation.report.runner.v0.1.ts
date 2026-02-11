import fs from "node:fs";
import path from "node:path";
import { computeValidationResultsV0_1, type ValidationRecordV01 } from "../src/shared/validation/metrics.v0.1";

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8")) as T;
}

function writeText(p: string, s: string) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s, "utf8");
}

function writeJson(p: string, x: unknown) {
  writeText(p, JSON.stringify(x, null, 2) + "\n");
}

function loadDataset(): ValidationRecordV01[] {
  const p = path.join(process.cwd(), "tests/validation/datasets/validation.dataset.v0.1.json");
  return readJson<ValidationRecordV01[]>(p);
}

function loadSplit(splitPath: string, all: ValidationRecordV01[]): ValidationRecordV01[] {
  const p = path.join(process.cwd(), splitPath);
  const raw = readJson<unknown>(p);

  // split can be ["id1","id2"] or full records
  if (Array.isArray(raw) && raw.length && typeof raw[0] === "string") {
    const ids = raw as string[];
    const byId = new Map(all.map((r) => [r.id, r]));
    return ids.map((id) => byId.get(id)).filter(Boolean) as ValidationRecordV01[];
  }
  return raw as ValidationRecordV01[];
}

function mdTable(rows: Array<Array<string>>): string {
  if (!rows.length) return "";
  const header = rows[0];
  const sep = header.map(() => "---");
  const body = rows.slice(1);
  const lines = [
    `| ${header.join(" | ")} |`,
    `| ${sep.join(" | ")} |`,
    ...body.map((r) => `| ${r.join(" | ")} |`),
  ];
  return lines.join("\n");
}

function main() {
  const all = loadDataset();
  const train = loadSplit("tests/validation/datasets/validation.train.v0.1.json", all);
  const holdout = loadSplit("tests/validation/datasets/validation.holdout.v0.1.json", all);

  const fullRes = computeValidationResultsV0_1(all);
  const trainRes = computeValidationResultsV0_1(train);
  const holdoutRes = computeValidationResultsV0_1(holdout);

  const current = {
    version: "0.1",
    datasetId: "validation.dataset.v0.1",
    splits: { trainCount: train.length, holdoutCount: holdout.length, fullCount: all.length },
    full: fullRes,
    train: trainRes,
    holdout: holdoutRes,
  };

  const outJson = "docs/validation/validation.results.current.v0.1.json";
  writeJson(outJson, current);

  const baselinePath = "docs/validation/validation.results.baseline.v0.1.json";
  let baselineStatus: "missing" | "match" | "diff" = "missing";
  if (fs.existsSync(baselinePath)) {
    const b = fs.readFileSync(baselinePath, "utf8");
    const c = fs.readFileSync(outJson, "utf8");
    baselineStatus = b === c ? "match" : "diff";
  }

  const r = fullRes;
  const lines: string[] = [];
  lines.push(`# ZË-RO External Validation Report v0.1`);
  lines.push("");
  lines.push(`**Dataset:** ${current.datasetId}`);
  lines.push(`**Counts:** full=${all.length}, train=${train.length}, holdout=${holdout.length}`);
  lines.push(`**Baseline:** ${baselineStatus}`);
  lines.push("");

  lines.push(`## Dataset summary`);
  lines.push("");
  lines.push(mdTable([
    ["Lang", "Count"],
    ...r.dataset.langDist.map((x) => [x.lang, String(x.count)]),
  ]));
  lines.push("");
  lines.push(mdTable([
    ["Tag", "Count"],
    ...r.dataset.tagDist.map((x) => [x.tag, String(x.count)]),
  ]));
  lines.push("");

  lines.push(`## Mismatch (mask vs carrier)`);
  lines.push("");
  lines.push(`with IPA: ${r.dataset.withIpa}`);
  lines.push(`mismatches: ${r.mismatch.mismatchCount}`);
  lines.push(`rate: ${r.mismatch.mismatchRate}`);
  lines.push("");

  lines.push(`## Clustering (lower within-tag distance is better)`);
  lines.push("");
  lines.push(mdTable([
    ["Space", "withinAvg", "acrossAvg", "delta(across-within)"],
    ["voiceSpace", String(r.clustering.voiceSpace.withinAvg), String(r.clustering.voiceSpace.acrossAvg), String(r.clustering.voiceSpace.delta)],
    ["baseline:vowelCount", String(r.clustering.baselines.vowelCount.withinAvg), String(r.clustering.baselines.vowelCount.acrossAvg), String(r.clustering.baselines.vowelCount.delta)],
    ["baseline:orthography", String(r.clustering.baselines.orthography.withinAvg), String(r.clustering.baselines.orthography.acrossAvg), String(r.clustering.baselines.orthography.delta)],
    ["control:shuffledTags", String(r.clustering.baselines.shuffledTagsControl.withinAvg), String(r.clustering.baselines.shuffledTagsControl.acrossAvg), String(r.clustering.baselines.shuffledTagsControl.delta)],
  ]));
  lines.push("");

  lines.push(`## Top mismatches`);
  lines.push("");
  lines.push(mdTable([
    ["id", "lang", "word", "ipa", "ortho", "ipaVoices", "dist"],
    ...r.topMismatches.map((x) => [
      x.id,
      x.lang,
      x.word,
      x.ipa,
      x.orthographyVoices.join(""),
      x.phoneticVoices.join(""),
      String(x.distance),
    ]),
  ]));
  lines.push("");

  lines.push(`## Diagnostics`);
  lines.push("");
  lines.push(`notesCount: ${r.diagnostics.notesCount}`);
  lines.push("");
  lines.push(mdTable([
    ["orthography unmapped", "count"],
    ...r.diagnostics.orthographyUnmappedTop.map((x) => [x.sym, String(x.count)]),
  ]));
  lines.push("");
  lines.push(mdTable([
    ["ipa unmapped", "count"],
    ...r.diagnostics.ipaUnmappedTop.map((x) => [x.sym, String(x.count)]),
  ]));
  lines.push("");

  writeText("docs/validation/VALIDATION_REPORT_LATEST_v0.1.md", lines.join("\n"));
}

main();
