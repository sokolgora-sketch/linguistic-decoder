#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const analyzeV1StableRegressionFingerprintSchemaVersion =
  "open-instrument.analyze-v1-stable-regression-fingerprint.v0.1";

export const volatileTimestampFieldNames = Object.freeze([
  "created",
  "generatedAt",
  "createdAt",
  "updatedAt",
  "timestamp",
  "time",
]);

const volatileTimestampFieldNameSet = new Set(volatileTimestampFieldNames);

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function normalizeAnalyzeV1ForStableRegressionFingerprint(value) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeAnalyzeV1ForStableRegressionFingerprint(item));
  }

  if (!isRecord(value)) {
    return value;
  }

  const normalized = {};
  for (const key of Object.keys(value).sort()) {
    if (volatileTimestampFieldNameSet.has(key)) {
      continue;
    }

    normalized[key] = normalizeAnalyzeV1ForStableRegressionFingerprint(value[key]);
  }

  return normalized;
}

export function stableStringifyAnalyzeV1ForRegression(value) {
  return `${JSON.stringify(normalizeAnalyzeV1ForStableRegressionFingerprint(value), null, 2)}\n`;
}

export function sha256Text(text) {
  return createHash("sha256").update(text).digest("hex");
}

export function stableRegressionFingerprintForAnalyzeV1Json(value) {
  const normalizedJson = stableStringifyAnalyzeV1ForRegression(value);

  return {
    schemaVersion: analyzeV1StableRegressionFingerprintSchemaVersion,
    sha256: sha256Text(normalizedJson),
    volatileTimestampFieldsRemoved: [...volatileTimestampFieldNames],
    normalizedJson,
  };
}

export function stableRegressionFingerprintForAnalyzeV1File(inputPath, options = {}) {
  const raw = readFileSync(inputPath, "utf8");
  const parsed = JSON.parse(raw);
  const fingerprint = stableRegressionFingerprintForAnalyzeV1Json(parsed);
  const outputPath = options.outputPath ? path.resolve(options.outputPath) : null;

  if (outputPath) {
    writeFileSync(outputPath, fingerprint.normalizedJson, "utf8");
  }

  return {
    schemaVersion: fingerprint.schemaVersion,
    inputPath: path.resolve(inputPath),
    outputPath,
    sha256: fingerprint.sha256,
    volatileTimestampFieldsRemoved: fingerprint.volatileTimestampFieldsRemoved,
  };
}

function printUsage() {
  console.log(`Usage:
  node scripts/openInstrumentAnalyzeV1StableRegressionFingerprint.v0.1.mjs <input.raw.json> [--out <normalized.json>]

Purpose:
  Computes a stable /api/analyze-v1 regression fingerprint by recursively removing
  known volatile timestamp fields, sorting object keys, and hashing normalized JSON.

Volatile fields:
  ${volatileTimestampFieldNames.join(", ")}
`);
}

export function runCli(argv) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    printUsage();
    return 0;
  }

  let inputPath = null;
  let outputPath = null;

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--out") {
      outputPath = argv[i + 1] ?? null;
      if (!outputPath) {
        throw new Error("--out requires a path");
      }
      i += 1;
      continue;
    }

    if (arg.startsWith("--")) {
      throw new Error(`unknown option: ${arg}`);
    }

    if (inputPath) {
      throw new Error(`unexpected extra argument: ${arg}`);
    }

    inputPath = arg;
  }

  if (!inputPath) {
    throw new Error("missing input JSON path");
  }

  const result = stableRegressionFingerprintForAnalyzeV1File(inputPath, { outputPath });
  console.log(JSON.stringify(result, null, 2));
  return 0;
}

const modulePath = fileURLToPath(import.meta.url);
const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";

if (modulePath === invokedPath) {
  try {
    process.exitCode = runCli(process.argv.slice(2));
  } catch (error) {
    console.error(`ERROR: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
