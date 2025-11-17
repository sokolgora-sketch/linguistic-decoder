
#!/usr/bin/env ts-node

/**
 * CLI: evaluate Seven-Voices solver over a CSV or JSON gold set.
 *
 * For JSON, expects an array of objects with keys: id, word, alphabet, expectedPrimary, etc.
 * For CSV, expects columns: word, expected, mode?, alphabet?
 *
 * Outputs to a directory in `out/`:
 *  - predictions.csv
 *  - confusion.csv
 *  - metrics.json
 */

import fs from "fs";
import path from "path";

// If you use tsconfig paths like "@/functions/...", keep these two requires:
require("ts-node/register");
require("tsconfig-paths/register");

import { runAnalysis } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { Alphabet } from "@/lib/runAnalysis";
import type { SolveOptions } from "@/functions/sevenVoicesCore";
import type { GoldItem } from "@/data/gold/schema";

type Mode = "strict"|"open";

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

const file = requireArg("file");
const outDir = args.get("out") || `out/eval-${Date.now()}`;
const modeCLI = (args.get("mode") as Mode) || "strict";
const alphabetCLI = (args.get("alphabet") as Alphabet) || "auto";
const edgeWeightCLI = args.get("edge") ? Number(args.get("edge")) : undefined;
const manifestVersion = args.get("manifest");

// ---- helpers ----

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function normalizePath(s?: string): string {
  if (!s) return "";
  return s.toUpperCase().replace(/[^AEIOUYË]/g, "").split("").join("→");
}

function joinPath(vowels: string[]): string {
  return (vowels || []).join("→");
}

// ---- load set ----
function loadGoldSet(filePath: string): GoldItem[] {
  const raw = fs.readFileSync(filePath, "utf8");
  if (filePath.endsWith('.json')) {
    return JSON.parse(raw);
  } else { // Assume CSV
    const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const data = lines.slice(1);
    const col = (name: string) => header.indexOf(name.toLowerCase());
    const ciWord = col("word");
    if (ciWord < 0) throw new Error("CSV must have 'word' column");
    const ciExp = col("expected");

    return data.map((r, i) => {
        const cols = r.split(",");
        return {
            id: `csv_row_${i+2}`,
            input: cols[ciWord],
            alphabet: "latin", // default
            expectedPrimary: ciExp >= 0 ? cols[ciExp] : "",
        }
    });
  }
}

const goldSet = loadGoldSet(file);

// ---- eval ----
ensureDir(outDir);

const manifest = getManifest(manifestVersion);

function getOpts(mode: Mode, alphabet: Alphabet): SolveOptions {
    const isStrict = mode === 'strict';
    return {
      beamWidth: 8,
      maxOps: isStrict ? 1 : 2,
      allowDelete: !isStrict,
      allowClosure: !isStrict,
      opCost: manifest.opCost,
      alphabet,
      manifest,
      edgeWeight: edgeWeightCLI ?? manifest.edgeWeight,
    };
}

type EvalResultRow = GoldItem & {
    predictedPrimary: string;
    isCorrect: boolean;
};

const results: EvalResultRow[] = [];
let correct = 0;

for (const item of goldSet) {
  const opts = getOpts("strict", item.alphabet as Alphabet);
  const analysis = runAnalysis(item.input, opts, item.alphabet as Alphabet);
  const predicted = joinPath(analysis.primaryPath?.voicePath || []);
  const expected = normalizePath(item.expectedPrimary);
  const isCorrect = predicted === expected;
  if (isCorrect) correct++;

  results.push({ ...item, predictedPrimary: predicted, isCorrect });
}

// ---- console summary ----
console.log(`Gold eval: ${correct}/${goldSet.length} passed.`);
const failures = results.filter(r => !r.isCorrect);
if (failures.length > 0) {
  console.log("\n--- Failures ---");
  for (const f of failures) {
    console.log(`- ${f.id} ('${f.input}')`);
    console.log(`  Expected: ${f.expectedPrimary}`);
    console.log(`  Got:      ${f.predictedPrimary}`);
  }
}

// ---- write report ----
const outPath = path.join(outDir, `gold-results-${new Date().toISOString().slice(0, 10)}.json`);
fs.writeFileSync(outPath, JSON.stringify(results, null, 2), "utf8");
console.log(`\nDetailed report written to: ${outPath}`);
