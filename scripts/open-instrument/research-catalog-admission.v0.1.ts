#!/usr/bin/env tsx

import fs from "node:fs";
import path from "node:path";
import { admitOpenInstrumentResearchCatalogV0_1 } from "../../src/shared/openInstrumentResearchCatalogAdmission.v0_1";

const [existingPath, incomingPath, outputPath, mode] = process.argv.slice(2);

if (!existingPath || !incomingPath || !outputPath) {
  console.error("usage: tsx scripts/open-instrument/research-catalog-admission.v0.1.ts <catalog.json> <rows.json> <output.json> [--dry-run]");
  process.exit(2);
}

const existing = JSON.parse(fs.readFileSync(existingPath, "utf8")) as unknown;
const incoming = JSON.parse(fs.readFileSync(incomingPath, "utf8")) as unknown;
const result = admitOpenInstrumentResearchCatalogV0_1(existing, incoming);

if (!result.ok) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}

if (mode === "--dry-run") {
  process.stdout.write(`${JSON.stringify(result.dryRun, null, 2)}\n`);
  process.exit(0);
}

const output = `${JSON.stringify(result.catalog, null, 2)}\n`;
const temporaryPath = `${outputPath}.tmp-${process.pid}`;
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(temporaryPath, output, "utf8");
fs.renameSync(temporaryPath, outputPath);
process.stdout.write(`${JSON.stringify(result.dryRun, null, 2)}\n`);
