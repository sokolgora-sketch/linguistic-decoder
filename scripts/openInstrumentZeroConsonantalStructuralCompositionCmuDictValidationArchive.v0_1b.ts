import { createHash } from "node:crypto";
import { readFileSync, statSync, writeFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

function sha256(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

const [sourcePath, archivePath] = process.argv.slice(2);
if (!sourcePath || !archivePath) {
  throw new Error("Usage: npx tsx scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidationArchive.v0_1b.ts <result.json> <result.json.gz>");
}

const source = readFileSync(sourcePath);
const archive = gzipSync(source, { level: 9, mtime: 0 });
writeFileSync(archivePath, archive);

console.log(JSON.stringify({
  sourcePath,
  sourceBytes: source.length,
  sourceSha256: sha256(source),
  archivePath,
  archiveBytes: statSync(archivePath).size,
  archiveSha256: sha256(archive),
  compression: "gzip level 9, mtime 0",
}, null, 2));
