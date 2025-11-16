#!/usr/bin/env ts-node

/**
 * CLI: evaluate Seven-Voices solver over a CSV.
 *
 * Input CSV columns:
 *   word, expected, mode?, alphabet?
 * - expected is the target voice path (e.g., "A→E" or "AE" or "A-E"). Flexible; we normalize.
 * - mode defaults to CLI flag (--mode strict|open).
 * - alphabet defaults to CLI flag (--alphabet auto|albanian|latin|...).
 *
 * Outputs:
 *  - <outDir>/predictions.csv
 *  - <outDir>/confusion.csv
 *  - <outDir>/metrics.json
 */

import fs from "fs";
import path from "path";

// If you use tsconfig paths like "@/functions/...", keep these two requires:
require("ts-node/register");
require("tsconfig-paths/register");

// ====== IMPORT YOUR ENGINE ======
import { solveWord } from "@/functions/sevenVoicesCore";
import { getManifest } from "@/engine/manifest";

type Mode = "strict"|"open";
type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie";

type Row = {
  word: string;
  expected?: string; // normalized voice path, e.g., "A→E"
  mode?: Mode;
  alphabet?: Alphabet;
};

// ---- CLI args (minimal, no dependencies) ----
const args = new Map<string, string>();
process.argv.slice(2).forEach((a) => {
  const [k, v] = a.split("=");
  if (k.startsWith("--")) args.set(k.slice(2), v ?? "true");
});
function requireArg(name: string): string {
  const v = args.get(name);
  if (!v) {
    console.error(`Missing --${name}`);
    process.exit(1);
  }
  return v;
}

const file = requireArg("file");                               // e.g., data/gold.csv
const outDir = args.get("out") || `out/eval-${Date.now()}`;    // e.g., out/eval-1731630000000
const modeCLI = (args.get("mode") as Mode) || "strict";        // default strict
const alphabetCLI = (args.get("alphabet") as Alphabet) || "auto";
const edgeWeightCLI = args.get("edge") ? Number(args.get("edge")) : undefined;
const manifestVersion = args.get("manifest");                  // optional

// ---- helpers ----

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function readCSV(p: string): string[][] {
  const raw = fs.readFileSync(p, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  return lines.map((line) => {
    // simple CSV (no embedded commas). If you need quotes, swap to csv-parse.
    return line.split(",").map((x) => x.trim());
  });
}

function normalizePath(s?: string): string {
  if (!s) return "";
  // Accept "A→E", "A-E", "A>E", "AE", "A → E"
  const onlyVowels = s.toUpperCase().replace(/[^AEIOUYË]/g, "");
  if (onlyVowels.length <= 1) return onlyVowels;
  return onlyVowels.split("").join("→");
}

function joinPath(vowels: string[]): string {
  return (vowels || []).join("→");
}

function toCSVRow(fields: (string|number)[]) {
  return fields.map((f) => String(f)).join(",") + "\n";
}

// ---- load set ----
const rowsRaw = readCSV(file);
let header = rowsRaw[0].map((h) => h.toLowerCase());
let data = rowsRaw.slice(1);

function col(name: string): number {
  const i = header.indexOf(name.toLowerCase());
  return i >= 0 ? i : -1;
}

const ciWord = col("word");
const ciExpected = col("expected");
const ciMode = col("mode");
const ciAlphabet = col("alphabet");

if (ciWord < 0) {
  console.error(`CSV must have a "word" column. Got header: ${header.join(", ")}`);
  process.exit(1);
}

const rows: Row[] = data.map((r) => ({
  word: r[ciWord],
  expected: ciExpected >= 0 ? normalizePath(r[ciExpected]) : undefined,
  mode: ciMode >= 0 ? (r[ciMode] as Mode) : undefined,
  alphabet: ciAlphabet >= 0 ? (r[ciAlphabet] as Alphabet) : undefined,
}));

// ---- eval ----
ensureDir(outDir);

const manifest = getManifest(manifestVersion);
const defaults = {
  beamWidth: 8,
  maxOps: 1,
  allowDelete: false,
  allowClosure: false,
  opCost: manifest.opCost,
  alphabet: "auto" as Alphabet,
  manifest,
  edgeWeight: edgeWeightCLI ?? manifest.edgeWeight,
};

type ConfusionKey = string; // "expected|predicted"
const confusion = new Map<ConfusionKey, number>();
const labelsSet = new Set<string>();
let labeled = 0;
let correct = 0;

const preds: { word: string; expected: string; predicted: string; ok: boolean | null; mode: Mode; alphabet: Alphabet }[] = [];

for (const row of rows) {
  const mode = (row.mode || modeCLI) as Mode;
  const alphabet = (row.alphabet || alphabetCLI) as Alphabet;

  const opts = mode === "strict"
    ? defaults
    : { ...defaults, maxOps: 2, allowDelete: true, allowClosure: true, opCost: manifest.opCost };

  const out: any = solveWord(row.word, opts, alphabet);
  const pred = joinPath(out?.primaryPath?.voicePath || []);
  const exp = normalizePath(row.expected);
  const hasLabel = !!exp;

  if (hasLabel) {
    labeled++;
    const ok = exp === pred;
    if (ok) correct++;
    const key: ConfusionKey = `${exp}|${pred}`;
    confusion.set(key, (confusion.get(key) || 0) + 1);
    labelsSet.add(exp); labelsSet.add(pred);
    preds.push({ word: row.word, expected: exp, predicted: pred, ok, mode, alphabet });
  } else {
    // unlabeled: still record prediction
    preds.push({ word: row.word, expected: "", predicted: pred, ok: null, mode, alphabet });
    labelsSet.add(pred);
  }
}

// ---- write predictions.csv ----
let outPred = "word,expected,predicted,ok,mode,alphabet\n";
for (const p of preds) {
  const okStr = p.ok === null ? "" : (p.ok ? "1" : "0");
  outPred += toCSVRow([p.word, p.expected, p.predicted, okStr, p.mode, p.alphabet]);
}
fs.writeFileSync(path.join(outDir, "predictions.csv"), outPred, "utf8");

// ---- write confusion.csv ----
// Rows=expected labels, Cols=predicted labels
const labels = Array.from(labelsSet).filter(Boolean).sort();
let outConf = ["expected \\ predicted", ...labels].join(",") + "\n";
for (const exp of labels) {
  const rowVals: (string|number)[] = [exp];
  for (const pred of labels) {
    const key = `${exp}|${pred}`;
    rowVals.push(confusion.get(key) || 0);
  }
  outConf += toCSVRow(rowVals);
}
fs.writeFileSync(path.join(outDir, "confusion.csv"), outConf, "utf8");

// ---- metrics.json ----
const metrics = {
  total_rows: rows.length,
  labeled_rows: labeled,
  accuracy: labeled > 0 ? +(correct / labeled).toFixed(4) : null,
  correct,
  labels: labels,
  manifest: manifest.version,
  mode_default: modeCLI,
  alphabet_default: alphabetCLI,
  edge_weight: defaults.edgeWeight,
};
fs.writeFileSync(path.join(outDir, "metrics.json"), JSON.stringify(metrics, null, 2), "utf8");

// ---- console summary ----
console.log(`Wrote:
  ${path.join(outDir, "predictions.csv")}
  ${path.join(outDir, "confusion.csv")}
  ${path.join(outDir, "metrics.json")}
`);
if (metrics.accuracy !== null) {
  console.log(`Accuracy: ${(metrics.accuracy * 100).toFixed(2)}% on ${metrics.labeled_rows} labeled rows`);
} else {
  console.log(`No labeled rows (no "expected" in CSV). Predictions only.`);
}
