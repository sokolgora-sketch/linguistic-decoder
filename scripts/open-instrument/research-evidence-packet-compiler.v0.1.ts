#!/usr/bin/env tsx

import fs from "node:fs";

import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
} from "../../src/shared/openInstrumentResearchEvidencePacket.v0_1";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error(
    "usage: tsx scripts/open-instrument/research-evidence-packet-compiler.v0.1.ts <packet.json>",
  );
  process.exit(2);
}

try {
  const input = JSON.parse(fs.readFileSync(inputPath, "utf8")) as unknown;
  const rows = compileOpenInstrumentResearchEvidencePacketInputV0_1(input);
  process.stdout.write(`${JSON.stringify({ rows }, null, 2)}\n`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
