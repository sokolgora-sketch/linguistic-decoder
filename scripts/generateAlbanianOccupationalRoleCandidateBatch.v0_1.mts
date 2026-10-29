import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import JSZip from "jszip";
import { buildAlbanianOccupationalRoleCandidateBatchV0_1 } from "../src/shared/openInstrument/albanianOccupationalRoleCandidateBatch.v0_1";

const EXPECTED = Object.freeze({
  albanianBytes: 67_438_537,
  albanianSha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
  oewnBytes: 9_986_555,
  oewnSha256: "7d749f6e2c39e6970e4997839dcf6e42fd281f3c2fae0171d2192bae8cfa4b51",
});

function option(name: string): string {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : undefined;
  if (!value || value.startsWith("--")) throw new Error(`Required argument: ${name} <path>`);
  return value;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`SOURCE_IDENTITY_OR_FORMAT_INVALID: ${message}`);
}

const albanianPath = option("--albanian");
const oewnPath = option("--oewn");
const outputPath = option("--output");
const inventoryOutputPath = option("--inventory-output");
const albanianBytes = await readFile(albanianPath);
const oewnBytes = await readFile(oewnPath);
assert(albanianBytes.byteLength === EXPECTED.albanianBytes, "Kaikki byte length mismatch");
assert(createHash("sha256").update(albanianBytes).digest("hex") === EXPECTED.albanianSha256, "Kaikki SHA256 mismatch");
assert(oewnBytes.byteLength === EXPECTED.oewnBytes, "OEWN 2025 byte length mismatch");
assert(createHash("sha256").update(oewnBytes).digest("hex") === EXPECTED.oewnSha256, "OEWN 2025 SHA256 mismatch");

const lines = albanianBytes.toString("utf8").split("\n");
const sourceRows = lines.map((line) => line.trim() ? JSON.parse(line) as unknown : null);
const zip = await JSZip.loadAsync(oewnBytes);
const oewnEntries: Record<string, unknown> = {};
const oewnSynsets: Record<string, unknown> = {};
for (const path of Object.keys(zip.files).filter((name) => /^entries-[a-z]\.json$/u.test(name)).sort()) {
  const content = await zip.file(path)!.async("string");
  Object.assign(oewnEntries, JSON.parse(content) as Record<string, unknown>);
}
for (const path of Object.keys(zip.files).filter((name) => /^noun\..+\.json$/u.test(name)).sort()) {
  const content = await zip.file(path)!.async("string");
  Object.assign(oewnSynsets, JSON.parse(content) as Record<string, unknown>);
}

const result = buildAlbanianOccupationalRoleCandidateBatchV0_1({
  sourceRows,
  sourceRowsScanned: sourceRows.filter((row) => row !== null).length,
  oewnEntries,
  oewnSynsets,
});
await mkdir(dirname(outputPath), { recursive: true });
await mkdir(dirname(inventoryOutputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(result.batch, null, 2)}\n`, "utf8");
await writeFile(inventoryOutputPath, `${JSON.stringify(result.suffixDiscoveryInventory, null, 2)}\n`, "utf8");
process.stdout.write(`${JSON.stringify({
  outputPath,
  inventoryOutputPath,
  inventoryBytes: Buffer.byteLength(JSON.stringify(result.suffixDiscoveryInventory)),
  sourceIdentity: { bytes: albanianBytes.byteLength, sha256: EXPECTED.albanianSha256 },
  ontologyIdentity: { bytes: oewnBytes.byteLength, sha256: EXPECTED.oewnSha256 },
  suffixScan: result.batch.suffixScan,
  inventory: {
    rows: result.suffixDiscoveryInventory.records.length,
    senses: result.suffixDiscoveryInventory.records.reduce((total, record) => total + record.senses.length, 0),
  },
}, null, 2)}\n`);
