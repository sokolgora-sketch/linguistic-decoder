/* eslint-disable no-console */

import fs from "node:fs";
import path from "node:path";

import { solveWord } from "../src/functions/sevenVoicesCore";
import { detectAlbanianDialect } from "../src/lib/detectDialect";

type GoldItem = {
  id: string;
  word: string;
  expectedPrimaryVoicePath?: string[];
  expectedPrimaryRingPath?: number[];
  expectedDialect?: "geg" | "tosk";
  notes?: string;
};

type GoldEvalRow = {
  id: string;
  word: string;
  ok: boolean;
  primaryVoiceOk?: boolean;
  primaryRingOk?: boolean;
  dialectOk?: boolean;
  expectedPrimaryVoicePath?: string[];
  predictedPrimaryVoicePath?: string[];
  expectedPrimaryRingPath?: number[];
  predictedPrimaryRingPath?: number[];
  expectedDialect?: string;
  predictedDialect?: string;
  notes?: string;
};

function loadGoldSet(): GoldItem[] {
  const filePath = path.join(__dirname, "..", "data", "gold", "core.json");
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw) as GoldItem[];
}

function evaluateGoldItem(item: GoldItem): GoldEvalRow {
  const result = solveWord(item.word);

  // Adjust these to your actual result shape
  const primaryVoicePath: string[] = result.primaryPath?.voicePath ?? [];
  const primaryRingPath: number[] = result.primaryPath?.ringPath ?? [];

  // For gold eval, we *explicitly* use the same helper as the mapper,
  // so we're not depending on engine internals for dialect.
  const predictedDialect: string | undefined = item.expectedDialect
    ? detectAlbanianDialect(item.word)
    : undefined;

  let primaryVoiceOk: boolean | undefined;
  let primaryRingOk: boolean | undefined;
  let dialectOk: boolean | undefined;

  if (item.expectedPrimaryVoicePath) {
    primaryVoiceOk =
      JSON.stringify(primaryVoicePath) ===
      JSON.stringify(item.expectedPrimaryVoicePath);
  }

  if (item.expectedPrimaryRingPath) {
    primaryRingOk =
      JSON.stringify(primaryRingPath) ===
      JSON.stringify(item.expectedPrimaryRingPath);
  }

  if (item.expectedDialect) {
    dialectOk = predictedDialect === item.expectedDialect;
  }

  const checks = [primaryVoiceOk, primaryRingOk, dialectOk].filter(
    (v) => v !== undefined
  ) as boolean[];

  const ok = checks.length === 0 ? true : checks.every((v) => v === true);

  return {
    id: item.id,
    word: item.word,
    ok,
    primaryVoiceOk,
    primaryRingOk,
    dialectOk,
    expectedPrimaryVoicePath: item.expectedPrimaryVoicePath,
    predictedPrimaryVoicePath: primaryVoicePath,
    expectedPrimaryRingPath: item.expectedPrimaryRingPath,
    predictedPrimaryRingPath: primaryRingPath,
    expectedDialect: item.expectedDialect,
    predictedDialect,
    notes: item.notes,
  };
}

function main() {
  const gold = loadGoldSet();
  const rows: GoldEvalRow[] = gold.map(evaluateGoldItem);

  const total = rows.length;
  const passed = rows.filter((r) => r.ok).length;
  const failed = total - passed;

  console.log(`Gold eval: ${passed}/${total} passed, ${failed} failed.`);

  if (failed > 0) {
    console.log("Failed items:");
    for (const row of rows.filter((r) => !r.ok)) {
      console.log(`- ${row.id} [${row.word}]:`, {
        primaryVoiceOk: row.primaryVoiceOk,
        primaryRingOk: row.primaryRingOk,
        dialectOk: row.dialectOk,
        expectedDialect: row.expectedDialect,
        predictedDialect: row.predictedDialect,
      });
    }
  }

  const outDir = path.join(__dirname, "..", "data", "eval");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const outPath = path.join(outDir, `gold-results-${timestamp}.json`);
  fs.writeFileSync(outPath, JSON.stringify(rows, null, 2), "utf8");
  console.log(`Wrote detailed gold eval to ${outPath}`);
}

main();
