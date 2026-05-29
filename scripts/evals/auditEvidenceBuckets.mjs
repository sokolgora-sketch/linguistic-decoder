#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import JSZip from "jszip";

const BUCKET_IDS = ["anchor_low", "x_vowel", "anchor_high"];

function usage() {
  console.error("Usage: npm run evals:audit-buckets -- [--json] /path/to/evidence-pack.zip");
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeBucketShape(candidate) {
  if (!isObject(candidate)) return null;

  if (
    Array.isArray(candidate.anchor_low) &&
    Array.isArray(candidate.x_vowel) &&
    Array.isArray(candidate.anchor_high)
  ) {
    return {
      anchor_low: candidate.anchor_low,
      x_vowel: candidate.x_vowel,
      anchor_high: candidate.anchor_high,
    };
  }

  if (
    Array.isArray(candidate.anchorLow) &&
    Array.isArray(candidate.xVowel) &&
    Array.isArray(candidate.anchorHigh)
  ) {
    return {
      anchor_low: candidate.anchorLow,
      x_vowel: candidate.xVowel,
      anchor_high: candidate.anchorHigh,
    };
  }

  if (isObject(candidate.buckets)) {
    const normalized = normalizeBucketShape(candidate.buckets);
    if (normalized) return normalized;
  }

  return null;
}

function findBuckets(value, seen = new Set()) {
  if (!isObject(value) && !Array.isArray(value)) return null;
  if (seen.has(value)) return null;
  seen.add(value);

  const normalized = normalizeBucketShape(value);
  if (normalized) return normalized;

  if (Array.isArray(value)) {
    for (const item of value) {
      const hit = findBuckets(item, seen);
      if (hit) return hit;
    }
    return null;
  }

  for (const item of Object.values(value)) {
    const hit = findBuckets(item, seen);
    if (hit) return hit;
  }

  return null;
}

function tokenText(token) {
  if (typeof token === "string") return token;
  if (!isObject(token)) return String(token);
  return (
    token.token ??
    token.text ??
    token.word ??
    token.form ??
    token.romanization ??
    token.value ??
    JSON.stringify(token)
  );
}

function normalizeToken(value) {
  return String(value)
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

function tokenLetters(value) {
  return [...normalizeToken(value)].filter((ch) => /[a-z]/i.test(ch));
}

function tokenStats(value, targetVowel = "i") {
  const letters = tokenLetters(value);
  const final = letters.at(-1) ?? "";
  const target = normalizeToken(targetVowel).replace(/[^a-z]/g, "") || "i";
  const targetPositions = [];

  letters.forEach((ch, index) => {
    if (ch === target) targetPositions.push(index + 1);
  });

  return {
    token: String(value),
    length: letters.length,
    final,
    finalShape: /[aeiouy]/i.test(final) ? "open_final" : "closed_final",
    targetCount: targetPositions.length,
    finalIsTarget: final === target,
    targetPositions: targetPositions.length ? targetPositions.join(",") : "-",
  };
}

function summarizeBucket(tokens, targetVowel) {
  const stats = tokens.map((token) => tokenStats(tokenText(token), targetVowel));
  const count = stats.length;
  const avgLength =
    count === 0 ? 0 : stats.reduce((sum, item) => sum + item.length, 0) / count;
  const avgTargetCount =
    count === 0 ? 0 : stats.reduce((sum, item) => sum + item.targetCount, 0) / count;

  return {
    count,
    openFinal: stats.filter((item) => item.finalShape === "open_final").length,
    closedFinal: stats.filter((item) => item.finalShape === "closed_final").length,
    finalTarget: stats.filter((item) => item.finalIsTarget).length,
    avgLength,
    avgTargetCount,
    stats,
  };
}

function runIdFromZipPath(zipPath) {
  const match = zipPath.match(/(?:^|\/)runs\/([^/]+)\/input\.json$/);
  return match?.[1] ?? zipPath;
}

function detectTargetVowel(input) {
  if (isObject(input)) {
    const direct = input.vowelUnderTest ?? input.targetVowel;
    if (typeof direct === "string" && direct.trim()) return direct.trim();

    if (Array.isArray(input.tasks)) {
      for (const task of input.tasks) {
        const taskValue = detectTargetVowel(task);
        if (taskValue) return taskValue;
      }
    }

    for (const value of Object.values(input)) {
      if (isObject(value) || Array.isArray(value)) {
        const nested = detectTargetVowel(value);
        if (nested) return nested;
      }
    }
  }

  return "i";
}

function formatNumber(value) {
  return Number(value).toFixed(2);
}

function warningLines(bucketId, summary) {
  const warnings = [];

  if (summary.count !== 10) {
    warnings.push(`${bucketId}: WARN count=${summary.count}, expected 10`);
  }

  if (bucketId === "x_vowel") {
    if (summary.finalTarget >= Math.max(3, Math.ceil(summary.count * 0.4))) {
      warnings.push(`${bucketId}: WARN final-target inflation=${summary.finalTarget}`);
    }

    if (summary.avgTargetCount > 1.5) {
      warnings.push(`${bucketId}: WARN high average target count=${formatNumber(summary.avgTargetCount)}`);
    }
  }

  return warnings;
}

function parseArgs(argv) {
  const json = argv.includes("--json");
  const positional = argv.filter((arg) => arg !== "--json");

  return {
    json,
    zipPath: positional[0],
  };
}

function bucketSummaryForJson(bucketId, summary) {
  return {
    bucketId,
    count: summary.count,
    openFinal: summary.openFinal,
    closedFinal: summary.closedFinal,
    finalTarget: summary.finalTarget,
    avgLength: Number(formatNumber(summary.avgLength)),
    avgTargetCount: Number(formatNumber(summary.avgTargetCount)),
    tokens: summary.stats.map((item) => ({
      token: item.token,
      finalShape: item.finalShape,
      length: item.length,
      targetCount: item.targetCount,
      targetPositions: item.targetPositions,
    })),
  };
}

async function buildAuditReport(zipPath) {
  const bytes = fs.readFileSync(zipPath);
  const zip = await JSZip.loadAsync(bytes);
  const inputPaths = Object.keys(zip.files)
    .filter((name) => /(?:^|\/)runs\/[^/]+\/input\.json$/.test(name))
    .sort();

  const report = {
    zipPath: path.resolve(zipPath),
    inputJsonFiles: inputPaths.length,
    runs: [],
  };

  for (const inputPath of inputPaths) {
    const raw = await zip.file(inputPath).async("string");
    const input = JSON.parse(raw);
    const buckets = findBuckets(input);
    const runId = runIdFromZipPath(inputPath);
    const targetVowel = detectTargetVowel(input);
    const run = {
      runId,
      targetVowel,
      buckets: [],
      warnings: [],
    };

    if (!buckets) {
      run.warnings.push("ERROR: no anchor_low/x_vowel/anchor_high buckets found");
      report.runs.push(run);
      continue;
    }

    for (const bucketId of BUCKET_IDS) {
      const tokens = asArray(buckets[bucketId]);
      const summary = summarizeBucket(tokens, targetVowel);
      run.buckets.push(bucketSummaryForJson(bucketId, summary));
      run.warnings.push(...warningLines(bucketId, summary));
    }

    report.runs.push(run);
  }

  return report;
}

function printHumanReport(report) {
  console.log(`Evidence ZIP: ${report.zipPath}`);
  console.log(`Input JSON files: ${report.inputJsonFiles}`);

  if (report.inputJsonFiles === 0) {
    console.log("ERROR: no runs/*/input.json files found");
    process.exitCode = 1;
    return;
  }

  for (const run of report.runs) {
    console.log("");
    console.log(`RUN ${run.runId}`);
    console.log(`targetVowel=${run.targetVowel}`);

    if (run.buckets.length === 0) {
      console.log("ERROR: no anchor_low/x_vowel/anchor_high buckets found");
      continue;
    }

    for (const summary of run.buckets) {
      console.log(
        `${summary.bucketId}: count=${summary.count} open=${summary.openFinal} closed=${summary.closedFinal} finalTarget=${summary.finalTarget} avgLen=${formatNumber(summary.avgLength)} avgTargetCount=${formatNumber(summary.avgTargetCount)}`
      );

      for (const item of summary.tokens) {
        console.log(
          `  - ${item.token} | ${item.finalShape} | len=${item.length} | targetCount=${item.targetCount} | targetPos=${item.targetPositions}`
        );
      }
    }

    if (run.warnings.length) {
      console.log("WARNINGS:");
      for (const warning of run.warnings) console.log(`  - ${warning}`);
    } else {
      console.log("WARNINGS: none");
    }
  }
}

async function main() {
  const { json, zipPath } = parseArgs(process.argv.slice(2));

  if (!zipPath) {
    usage();
    process.exitCode = 1;
    return;
  }

  if (!fs.existsSync(zipPath)) {
    console.error(`ERROR: file not found: ${zipPath}`);
    process.exitCode = 1;
    return;
  }

  const report = await buildAuditReport(zipPath);

  if (json) {
    console.log(JSON.stringify(report, null, 2));
    if (report.inputJsonFiles === 0) process.exitCode = 1;
    return;
  }

  printHumanReport(report);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
